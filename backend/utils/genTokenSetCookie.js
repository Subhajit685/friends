import jwt from "jsonwebtoken"

const genTokenSetCookie = (id, res) =>{
    const token = jwt.sign({id}, process.env.SECRET_KEY, {expiresIn : "1d"})

    res.cookie("token", token,{
        httpOnly : true,
        maxAge : 1 * 24 * 60 * 60 * 1000,
        sameSite : "Strict",
        secure : true
    })
}

export default genTokenSetCookie