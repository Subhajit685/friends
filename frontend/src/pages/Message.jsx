import React, { useContext, useEffect, useRef, useState } from 'react'
import { StoreContext } from '../context/storeContext'
import { PiUserCircleThin } from 'react-icons/pi'
import { SocketContext } from '../context/socket'
import { GoArrowLeft } from "react-icons/go";
import Spinner from '../components/Spinner';



function Message() {
  const { color, user, url, messages, setmessages } = useContext(StoreContext)
  const { onlineUser } = useContext(SocketContext)
  const [selectUser, setselctUser] = useState(null)
  const [users, setusers] = useState([])
  const [text, settext] = useState("")
  const messageRef = useRef()
  const [showMessage, setshowMessage] = useState(false)
  const [loading, setloading] = useState(false)


  const getmessage = async (id) => {
    setloading(true)
    try {
      const res = await fetch(`${url}/api/message/getmessage/${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      })

      const data = await res.json()
      setloading(false)
      if (data.success) {
        setmessages(data.message)
      }
    } catch (error) {
      console.log("getmessage", error)
    }
  }
  const hendleselctUser = (user) => {
    setselctUser(user)
    getmessage(user._id)
    setshowMessage(true)
  }

  const hendleSend = async (id) => {
    try {
      const res = await fetch(`${url}/api/message/sendmessage/${id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: text })
      })

      const data = await res.json()
      if (data.success) {
        getmessage(id)
        settext("")
      }
    } catch (error) {
      console.log("sendmessage", error)
    }
  }


  useEffect(() => {
    const getMessageUser = async () => {
      try {
        const res = await fetch(`${url}/api/message/messageUser`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        })

        const data = await res.json()
        if (data.success) {
          setusers(data.users)
        }
      } catch (error) {
        console.log("getMessageUser", error)
      }
    }

    getMessageUser()
  }, [])

  useEffect(() => {
    setTimeout(() => {
      messageRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }, [getmessage])

  //   useEffect(()=>{
  //     document.addEventListener("keydown", (e)=>{
  //       console.log(e.key)
  //         if(e.key === "Enter" && text !== ""){
  //             hendleSend(selectUser?._id)
  //         }
  //     })
  // },[])


  return (
    <div className={`flex w-full h-full relative`}>

      {/* user */}
      <div className={`${showMessage ? "max-w-[0%] min-w-[0%] hidden" : "max-w-[100%] min-w-[100%]"} sm:block sm:max-w-[30%] sm:min-w-[30%] h-full relative sm:shadow-xl ${color === "light" ? "shadow-gray-300" : "shadow-gray-500"}`}>

        <div className={`hidden sm:flex max-h-[10%] min-h-[10%] gap-2 px-4 py-4 items-center shadow-md ${color === "light" ? "shadow-gray-300" : "shadow-gray-500"}`}>
          <div className='text-5xl'>
            {
              user.profileImage ? (
                <div className='w-12 h-12 rounded-full border overflow-hidden'><img src={user.profileImage} alt="profile image" className='w-full h-full object-cover object-center' /></div>
              ) : (<PiUserCircleThin />)
            }
          </div>
          <div className='text-xl sm:text-base md:text-base lg:text-base xl:text-xl font-bold'>
            {user.userName}
          </div>
        </div>

        <div className='max-h-[90%] min-h-[90%] overflow-y-scroll'>
          {
            users.map((user, index) => {
              return <div key={index} className=''>
                <div className={`flex gap-2 items-center py-4 px-4 cursor-pointer ${selectUser?._id === user._id ? (color === "light" ? ("bg-gray-300") : ("bg-gray-600")) : ("")}`} onClick={() => hendleselctUser(user)}>
                  <div className='text-5xl'>
                    {
                      user.profileImage ? (<div className='w-10 h-10 rounded-full border overflow-hidden'><img src={user.profileImage} alt="profile image" className='w-full h-full object-cover object-center' /></div>) : (<PiUserCircleThin />)
                    }
                  </div>
                  <div className=''>
                    <p className='text-lg sm:text-base md:text-base lg:text-sm xl:text-base font-bold'>{user.userName}</p>
                    <p className={`${color === "light" ? "text-slate-400" : "text-slate-400"} text-sm`}>{onlineUser.includes(user._id.toString()) ? "Online" : "Offline"}</p>
                  </div>
                </div>

                <div className={`${color === "light" ? "bg-slate-300" : "bg-slate-700"} w-full h-px`}></div>

              </div>
            })
          }
        </div>


      </div>

      {/* message box */}

      <div className={`${showMessage ? "min-w-[100%] max-w-[100%]" : "hidden min-w-[0%] max-w-[0%]"} sm:block sm:max-w-[70%] sm:min-w-[70%] h-full`}>
        {
          selectUser ? (
            <div className='w-full h-full flex flex-col'>
              <div className={`flex max-h-[10%] min-h-[10%] gap-2 px-8 py-4 items-center shadow-md ${color === "light" ? "shadow-gray-300" : "shadow-gray-500"}`}>
                <div className='sm:hidden text-3xl cursor-pointer' onClick={() => setshowMessage(false)}><GoArrowLeft /></div>
                <div className='text-5xl'>
                  {
                    selectUser?.profileImage ? (<div className='w-12 h-12 rounded-full border overflow-hidden'><img src={selectUser.profileImage} alt="profile image" className='w-full h-full object-cover object-center' /></div>) : (<PiUserCircleThin />)
                  }
                </div>
                <div>
                  <p className='text-xl font-bold'>{selectUser?.userName}</p>
                  <p className={`${color === "light" ? "text-slate-400" : "text-slate-400"} text-sm`}>{onlineUser.includes(selectUser._id.toString()) ? "Online" : "Offline"}</p>
                </div>
              </div>

              {/* message */}

              <div className='p-6 max-h-[80%] min-h-[80%] overflow-y-auto'>
                {
                  loading ? (<div className='flex justify-center items-center'><Spinner/></div>): (messages && messages.map((message, index) => {
                    return <div key={index} ref={messageRef} className={`flex py-2 ${user._id === message.senderId ? "justify-end" : "justify-start"}`}>
                  <span className={`${user._id === message.senderId ? "bg-blue-500 text-white p-2 rounded-md" : "bg-slate-200 text-black p-2 rounded-md"} mx-4`}>{message.message}</span>
                </div>
                  }))
                  
                }
              </div>

              {/* input */}
              <div className='flex w-full px-4 gap-2 items-center max-h-[10%] min-h-[10%]'>
                <input type="text" value={text} onChange={(e) => settext(e.target.value)} className='w-full px-8 py-2 bg-transparent border rounded-md' placeholder='write message here...' />
                <div className='border px-4 py-2 rounded-md cursor-pointer bg-blue-600 hover:bg-blue-700 text-white' onClick={() => hendleSend(selectUser?._id)}>Send</div>
              </div>
            </div>
          ) : (<div className='flex items-center justify-center w-full h-full'>No user select</div>)
        }


        <div className={`${color === "light" ? "bg-slate-300" : "bg-slate-700"} h-full w-px absolute right-0 top-0`}></div>
      </div>
    </div>
  )
}

export default Message
