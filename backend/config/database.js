import mongoose from "mongoose";

const database = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URI).then(()=>{
            console.log("Database connected");
        })
    } catch (error) {
        console.log(error)
    }
}

export default database