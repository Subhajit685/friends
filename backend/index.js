import express, { urlencoded } from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieparser from "cookie-parser"
import database from "./config/database.js"
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"
import messageRoute from "./routes/message.route.js"
import { app, server } from "./socket/socket.js"
import path from "path"

dotenv.config()
const PROT = process.env.PORT
const __dirname = path.resolve()

app.use(express.json())
app.use(urlencoded({extended : false}))
app.use(cookieparser())
app.use(cors({
    origin : "https://friends-kfbr.onrender.com",
    credentials : true
}))

app.use("/api/user", userRoute)
app.use("/api/post", postRoute)
app.use("/api/message", messageRoute)

app.use(express.static(path.join(__dirname, "/frontend/dist")))
app.get("*", (req, res)=>{
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
})

server.listen(PROT, ()=>{
    database()
    console.log(`Server listen at ${PROT}`);
})