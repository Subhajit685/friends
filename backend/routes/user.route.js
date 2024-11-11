import express from "express"
import User from "../models/user.model.js"
import genTokenSetCookie from "../utils/genTokenSetCookie.js"
import bcrypt from "bcryptjs"
import userProtected from "../middleware/userProtected.js"
import dataUri from "../utils/datauri.js"
import cloudinary from "../utils/cloudinary.js"
import multer from "multer"
import { io, onlineUser } from "../socket/socket.js"
const upload = multer({ storage: multer.memoryStorage() })

const route = express.Router()

route.post("/signup", async (req, res) => {
    try {
        const { userName, password, email } = req.body

        if (!userName || !password || !email) {
            return res.status(400).json({ success: false, message: "All fields required" })
        }

        const user = await User.findOne({ email })

        if (user) {
            return res.status(400).json({ success: false, message: "Email all ready exit" })
        }

        const salt = await bcrypt.genSalt(10)
        const hasPassword = await bcrypt.hash(password, salt)
        const newUser = await User({
            userName,
            email,
            password: hasPassword
        })

        genTokenSetCookie(newUser._id, res)

        await newUser.save()

        return res.status(200).json({
            success: true, message: "Account created successfully", user: {
                ...newUser._doc, password: undefined
            }
        })
    } catch (error) {
        console.log("sign-up", error)
        return res.status(500).json({ success: false, message: "Internal server error on sign-up" })
    }
})


route.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields required" })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            return res.status(400).json({ success: false, message: "Wrong password" })
        }

        genTokenSetCookie(user._id, res)

        return res.status(200).json({
            success: true, message: "Login successfully", user: {
                ...user._doc, password: undefined
            }
        })
    } catch (error) {
        console.log("login", error)
        return res.status(500).json({ success: false, message: "Internal server error on login" })
    }
})

route.get("/logout", async (req, res) => {
    try {
        return res.clearCookie("token").status(200).json({ success: true, message: "Logout successfully" })
    } catch (error) {
        console.log("logout", error)
        return res.status(500).json({ success: false, message: "Internal server error on logout" })
    }
})

route.get("/profile/:id", userProtected, async (req, res) => {
    try {
        const { id } = req.params

        const user = await User.findById(id).select("-password")

        await user.populate("posts")
        await user.populate("bookmarks")
        await user.populate("followers")
        await user.populate("following")

        return res.status(200).json({ success: true, user })
    } catch (error) {
        console.log("getProfile", error)
        return res.status(500).json({ success: false, message: "Internal server error on getProfile" })
    }
})

route.get("/suggest", userProtected, async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user._id } }).select("-password")

        if (!users) {
            return res.status(200).json({ success: true, users: [] })
        }

        return res.status(200).json({ success: true, users: users })
    } catch (error) {
        console.log("suggest", error)
        return res.status(500).json({ success: false, message: "Internal server error on suggest" })
    }
})

route.post("/editProfile", userProtected, upload.single("profileImage"), async (req, res) => {
    try {
        const { bio, gender } = req.body
        const profileImage = req.file
        let cloudinaryResponce

        const user = await User.findById(req.user._id)


        if (!user) {
            return res.status(500).json({ success: false, message: "User not found" })
        }

        if (profileImage) {
            const image = dataUri(profileImage)
            cloudinaryResponce = await cloudinary.uploader.upload(image)
        }

        if (bio) {
            user.bio = bio
        }

        if (gender) {
            user.gender = gender
        }

        if (profileImage) {
            user.profileImage = cloudinaryResponce.secure_url
        }

        await user.save()

        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            user: {
                ...user._doc, password: undefined
            }
        });


    } catch (error) {
        console.log("editProfile", error)
        return res.status(500).json({ success: false, message: "Internal server error on editProfile" })
    }
})

route.post("/followOrUnfollow/:id", userProtected, async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(req.user._id)
        const anotherUser = await User.findById(id)

        if (id === req.user._id) {
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }

        if (!user || !anotherUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }

        if (user.following.includes(id)) {
            await Promise.all([
                User.updateOne({ _id: req.user._id }, { $pull: { following: id } }),
                User.updateOne({ _id: id }, { $pull: { followers: req.user._id } }),
            ])

            return res.status(200).json({ success: true, message: "Unfollow" })
        } else {
            await Promise.all([
                User.updateOne({ _id: req.user._id }, { $push: { following: id } }),
                User.updateOne({ _id: id }, { $push: { followers: req.user._id } }),
            ])


            // socket io

            const notification = user.following.includes(id) ?
                ({ message: `${user?.userName} follow back you. You can started message now`, userImage: user?.profileImage, id : user._id }) :
                ({ message: `${user?.userName} started following you. If you know follow back.`, userImage: user?.profileImage, id : user._id })



            anotherUser.notification.push(notification)
            await anotherUser.save()

            const sendNotification = onlineUser(id)

            if (sendNotification) {
                io.to(sendNotification).emit("notification", notification)
            }

            return res.status(200).json({ success: true, message: "Following" })
        }
    } catch (error) {
        console.log("followOrUnfollow", error)
        return res.status(500).json({ success: false, message: "Internal server error on followOrUnfollow" })
    }
})

route.get("/check", userProtected, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password")
        if (!user) {
            return res.status(400).json({ success: false, user: null })
        }

        return res.status(200).json({ success: true, user: user })
    } catch (error) {
        console.log("check", error)
        return res.status(500).json({ success: false, message: "Internal server error on check" })
    }
})

route.post("/theam", userProtected, async (req, res) => {
    try {
        const { theam } = req.body
        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(200).json({ success: false, color: "" })
        }

        user.theam = theam
        await user.save()
        return res.status(200).json({ success: true, color: theam })
    } catch (error) {
        console.log("theam", error)
        return res.status(500).json({ success: false, message: "Internal server error on theam" })
    }
})

route.get("/userData/:id", userProtected, async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        if (!user) {
            return res.status(400).json({ success: false, user: null })
        }
        return res.status(200).json({ success: true, user: user })
    } catch (error) {
        console.log("userData", error)
        return res.status(500).json({ success: false, message: "Internal server error on userData" })
    }
})

route.get("/notofocation", userProtected, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }

        if (!user.notification) {
            return res.status(200).json({ success: true, notification: [], notificationLength: 0 })
        }

        return res.status(200).json({ success: true, notification: user.notification, notificationLength: user.notoficationLength })
    } catch (error) {
        console.log("notofocation", error)
        return res.status(500).json({ success: false, message: "Internal server error on notofocation" })
    }
})

route.post("/setnotification", userProtected, async (req, res) => {
    try {
        const { count } = req.body
        const user = await User.findById(req.user.id)

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }

        user.notoficationLength = count
        await user.save()

        return res.status(200).json({ success: true, notification: user.notification, notificationLength: user.notoficationLength })

    } catch (error) {
        console.log("notofocation", error)
        return res.status(500).json({ success: false, message: "Internal server error on notofocation" })
    }
})

export default route