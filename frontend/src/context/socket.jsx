import {createContext, useContext, useEffect, useState} from "react"
import { StoreContext } from "./storeContext"
import  io from "socket.io-client"

export const SocketContext = createContext(null)

const SocketProvider = ({children}) =>{

    const {user, messages, setmessages, shownotification, setshownotification, notificationCount, setnotificationCount} = useContext(StoreContext)
    const [socket, setsocket] = useState(null)
    const [onlineUser, setonlineuser] = useState([])

    // https://friends-kfbr.onrender.com

    useEffect(()=>{
        if(user){
            const socket = io("https://friends-kfbr.onrender.com",{
                query : {
                    userID : user._id
                }
            })

            setsocket(socket)

            socket.on("getOnlineUser", (users)=>{
                setonlineuser(users)
            })

            return ()=> socket.close()

        }else{
            if(socket){
                socket.close()
                setsocket(null)
            }
        }
    },[user])

    useEffect(()=>{
        socket?.on("newMessage", (message)=>{
            setmessages([...messages, message])
        })

        return () => socket?.off("newMessage")
    },[messages, setmessages, socket])

    useEffect(()=>{
        socket?.on("notification", (notification)=>{
            setnotificationCount(notificationCount + 1)
            setshownotification([notification, ...shownotification])
        })

        return ()=> socket?.off("notification")
    },[shownotification, setshownotification, socket])

    return (<SocketContext.Provider value={{socket, setsocket, onlineUser}}>
        {children}
    </SocketContext.Provider>)
}

export default SocketProvider