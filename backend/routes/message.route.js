import express from "express"
import userProtected from "../middleware/userProtected.js"
import Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js"
import User from "../models/user.model.js"
import { io, onlineUser } from "../socket/socket.js"

const route = express.Router()

route.post("/sendmessage/:id", userProtected, async(req, res)=>{
    try {
        const {message} = req.body
        const senderId = req.user._id
        const resiverID = req.params.id

        if(!message){
            return res.status(400).json({success : false, message : "You not type any message"})
        }

        let conversation = await Conversation.findOne({
            participents : {$all : [senderId, resiverID]}
        })

        if(!conversation){
            conversation = await Conversation.create({
                participents :[senderId, resiverID]
            })
        }

        const newMessage = await Message.create({
            senderId,
            resiverID,
            message
        })

        if(newMessage){
            conversation.messages.push(newMessage._id)
        }

        await Promise.all([conversation.save(), newMessage.save()])

        const getonlineUser = onlineUser(resiverID)

        if(getonlineUser){
            io.to(getonlineUser).emit("newMessage", newMessage)
        }
        

        return res.status(201).json({
            success:true,
            newMessage
        })
        
    } catch (error) {
        console.log("sendmessage", error)
        return res.status(500).json({success : false, message : "Internal server error on sendmessage"})
    }
})

route.get("/getmessage/:id", userProtected, async(req, res)=>{
    try {
        const senderId = req.user._id
        const resiverID = req.params.id

        const conversation = await Conversation.findOne({
            participents : {$all : [senderId, resiverID]}
        }).populate("messages")

        if(!conversation){
            return res.status(200).json({success : true, message : []})
        }

        return res.status(200).json({success : true, message : conversation.messages})
    } catch (error) {
        console.log("getmessage", error)
        return res.status(500).json({success : false, message : "Internal server error on getmessage"})
    }
})

route.get("/messageUser", userProtected, async(req, res)=>{
    try {
        const users = await User.find({_id : {$ne : req.user._id}}).select("-password")
        const owner = await User.findById(req.user._id).select("-password")
        const messageUser = []
        for(let user of users){
            if(owner.followers.includes(user._id.toString()) && user.followers.includes(owner._id.toString())){
                messageUser.push(user)
            }
        }

        if(!messageUser){
            return res.status(200).json({success : true, users : []})
        }

        return res.status(200).json({success : true, users : messageUser})

    } catch (error) {
        console.log("messageUser", error)
        return res.status(500).json({success : false, message : "Internal server error on messageUser"})
    }
})


export default route