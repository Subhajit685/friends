import express from "express"
import User from "../models/user.model.js"
const route = express.Router()

route.post("/search", async(req, res)=>{
    try {
        const {text} = req.body

        const regex = new RegExp(text, "i")

        const result=  await User.find({userName : {$regex : regex}})

        return res.status(200).json({success : true, result : result})
    } catch (error) {
        console.log("searchRoute", error)
        return res.status(500).json({success : false, message : "Internal server error search route"})
    }
})


export default route