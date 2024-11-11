import express from "express"
import userProtected from "../middleware/userProtected.js"
import sharp from "sharp"
import cloudinary from "../utils/cloudinary.js"
import User from "../models/user.model.js"
import Post from "../models/post.model.js"
import Comment from "../models/comment.model.js"
import multer from "multer"
import { io, onlineUser } from "../socket/socket.js"
const upload = multer({ storage: multer.memoryStorage() })

const route = express.Router()

route.post("/newpost", userProtected, upload.single("postImage"), async (req, res) => {
    try {
        const { caption } = req.body
        const postImage = req.file
        const postAuthor = req.user._id

        if (!postImage) {
            return res.status(400).json({ success: false, message: "You must post a image on your post" })
        }
        const imageToBuffer = await sharp(postImage.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat("jpeg", { quality: 100 })
            .toBuffer()

        const fileuri = `data:image/jpeg;base64,${imageToBuffer.toString("base64")}`
        const cloudinaryResponse = await cloudinary.uploader.upload(fileuri)

        const newpost = await Post({
            caption: caption ? caption : "",
            postImage: cloudinaryResponse.secure_url,
            postAuthor
        })

        await newpost.save()
        await newpost.populate("postAuthor")
        const user = await User.findById(postAuthor)

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        } else {
            user.posts.push(newpost._id)
            await user.save()
        }

        // socket io

        const notification = {
            message: `${user.userName} add a post`,
            userImage: user?.profileImage,
            id : user._id
        }

        const users = await User.find({ _id: { $ne: req.user._id } }).select("-password")

        for (const followinguser of users) {
            if (followinguser.following.includes(user._id.toString())) {
                followinguser.notification.push(notification)
                await followinguser.save()

                const sendNotification = onlineUser(followinguser._id.toString())

                if (sendNotification) {
                    io.to(sendNotification).emit("notification", notification)
                }
            }
        }


        return res.status(200).json({ success: true, message: "New post add", newpost })


    } catch (error) {
        console.log("newpost", error)
        return res.status(500).json({ success: false, message: "Internal server error on newpost" })
    }
})

route.get("/allpost", userProtected, async (req, res) => {
    try {
        const allpost = await Post.find({}).sort({ createdAt: -1 }).populate("postAuthor")
        return res.status(200).json({ success: true, allPost: allpost })
    } catch (error) {
        console.log("allpost", error)
        return res.status(500).json({ success: false, message: "Internal server error on allpost" })
    }
})

route.get("/getPost", userProtected, async (req, res) => {
    try {
        const allpost = await Post.find({ postAuthor: req.user._id }).sort({ createdAt: -1 })
        return res.status(200).json({ success: true, allPost: allpost })
    } catch (error) {
        console.log("getPost", error)
        return res.status(500).json({ success: false, message: "Internal server error on getPost" })
    }
})

route.post("/like/:id", userProtected, async (req, res) => {
    try {
        const { id } = req.params

        const post = await Post.findById(id)
        const user = await User.findById(req.user._id)

        if (!post) {
            return res.status(400).json({ success: false, message: "Post not found" })
        }

        await post.updateOne({ $addToSet: { likes: req.user._id } })

        await post.save()

        // socket io

        const notification = {
            message: `${user.userName} like on your post ${post.caption}`,
            userImage: user?.profileImage,
            id : user._id
        }

        const postUser = await User.findById(post.postAuthor)

        if (!postUser) {
            return res.status(400).json({
                message: 'Post user not found',
                success: false
            })
        }

        postUser.notification.push(notification)
        await postUser.save()

        const sendNotification = onlineUser(post.postAuthor.toString())

        if (sendNotification) {
            io.to(sendNotification).emit("notification", notification)
        }

        return res.status(200).json({ success: true, message: "Like" })
    } catch (error) {
        console.log("like", error)
        return res.status(500).json({ success: false, message: "Internal server error on like" })
    }
})

route.post("/dislike/:id", userProtected, async (req, res) => {
    try {
        const { id } = req.params

        const post = await Post.findById(id)

        if (!post) {
            return res.status(400).json({ success: false, message: "Post not found" })
        }

        await post.updateOne({ $pull: { likes: req.user._id } })

        await post.save()

        return res.status(200).json({ success: true, message: "DisLike" })
    } catch (error) {
        console.log("dislike", error)
        return res.status(500).json({ success: false, message: "Internal server error on dislike" })
    }
})

route.post("/addcomment/:id", userProtected, async (req, res) => {
    try {
        const { text } = req.body
        const { id } = req.params

        if (!text) {
            return res.status(400).json({ success: false, message: "You not comment any text" })
        }

        const post = await Post.findById(id)
        const user = await User.findById(req.user._id)

        if (!post) {
            return res.status(400).json({ success: false, message: "Post not found" })
        }

        const newComment = await Comment.create({
            text,
            post: id,
            user: req.user._id
        })

        post.comments.push(newComment)
        await post.save()

        await newComment.populate("user")

        // socket io

        const notification = {
            message: `${user.userName} comment on your post ${post.caption}`,
            userImage: user?.profileImage,
            id : user._id
        }

        const postUser = await User.findById(post.postAuthor)

        if (!postUser) {
            return res.status(400).json({
                message: 'Post user not found',
                success: false
            })
        }

        postUser.notification.push(notification)
        await postUser.save()

        const sendNotification = onlineUser(post.postAuthor.toString())

        if (sendNotification) {
            io.to(sendNotification).emit("notification", notification)
        }

        return res.status(200).json({
            message: 'Comment Added',
            newComment,
            success: true
        })
    } catch (error) {
        console.log("addcomment", error)
        return res.status(500).json({ success: false, message: "Internal server error on addcomment" })
    }
})

route.get("/getcomment/:id", userProtected, async (req, res) => {
    try {
        const { id } = req.params
        const allcomment = await Comment.find({ post: id }).sort({ createdAt: -1 }).populate("user")
        return res.status(200).json({
            allcomment,
            success: true
        })
    } catch (error) {
        console.log("getcomment", error)
        return res.status(500).json({ success: false, message: "Internal server error on getcomment" })
    }
})

route.post("/deletepost/:id", userProtected, async (req, res) => {
    try {
        const { id } = req.params
        const post = await Post.findById(id)

        if (!post) {
            return res.status(400).json({ success: false, message: "No post found" })
        }

        if (post.postAuthor.toString() !== req.user._id.toString()) {
            return res.status(400).json({ success: false, message: "you can not delete this post" })
        }

        await Post.findByIdAndDelete(id)

        const user = await User.findById(req.user._id)

        user.posts = user.posts.filter(postID => postID.toString() !== id)

        await user.save()

        await Comment.deleteMany({ post: id })

        return res.status(200).json({
            success: true,
            message: 'Post deleted'
        })
    } catch (error) {
        console.log("deletepost", error)
        return res.status(500).json({ success: false, message: "Internal server error on deletepost" })
    }
})

route.post("/bookmark/:id", userProtected, async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(400).json({ success: true, message: "User not found" })
        }

        const post = await Post.findById(id)

        if (!post) {
            return res.status(400).json({ success: true, message: "Post not found" })
        }

        if (user.bookmarks.includes(post._id)) {
            await user.updateOne({ $pull: { bookmarks: post._id } })
            await user.save()
            return res.status(400).json({ success: true, message: "Unsave from your bookmarks", bookmark: false })
        } else {
            await user.updateOne({ $addToSet: { bookmarks: post._id } })
            await user.save()
            return res.status(400).json({ success: true, message: "Add your bookmarks", bookmark: true })
        }
    } catch (error) {
        console.log("deletepost", error)
        return res.status(500).json({ success: false, message: "Internal server error on deletepost" })
    }
})

export default route