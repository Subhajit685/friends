import { createContext, useState } from "react"

export const StoreContext = createContext(null)

const ContextProvider = ({ children }) => {

    const url = "http://localhost:4000"
    const [user, setuser] = useState(null)
    const [color, setcolor] = useState('light')
    const [showcomment, setshowcomment] = useState(false)
    const [ispopup, setpopup] = useState(false)
    const [commentpopup, setcommentpopup] = useState(false)
    const [showCreate, setshowCreate] = useState(false)
    const [selectPostcomment, setselectPostcomment] = useState({})
    const [allpost, setallpost] = useState([])
    const [userData, setuserData] = useState({})
    const [suggestionUser, setsuggestionuser] = useState([])
    const [follewing, setfollewing] = useState(false)
    const [followers, setfollowers] = useState(false)
    const [messages, setmessages] = useState([])
    const [shownotification, setshownotification] = useState([])
    const [notificationCount, setnotificationCount] = useState(0)
    const [popData, setpopData] = useState(null)
    const [notificationLength, setnotificationLength] = useState(0)
    const [lengthCount, setlengthCount] = useState(0)

    const getUser = async () => {
        try {
            const res = await fetch(`${url}/api/user/check`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const data = await res.json()
            if (data.success) {
                setuser(data.user)
                setcolor(data.user?.theam)
            }
        } catch (error) {
            console.log("check User", error)
        }
    }

    const addComment = async (id, comment) => {
        try {
            const res = await fetch(`${url}/api/post/addcomment/${id}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ text: comment })
            })

            const data = await res.json()
            setcomment("")
            return data
        } catch (error) {
            console.log("addcomment", error)
        }
    }

    const like = async (id) => {
        try {
            const res = await fetch(`${url}/api/post/like/${id}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({})
            })

            const data = await res.json()
            return data
        } catch (error) {
            console.log("like", error)
        }
    }
    const dislike = async (id) => {
        try {
            const res = await fetch(`${url}/api/post/dislike/${id}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({})
            })

            const data = await res.json()
            return data
        } catch (error) {
            console.log("dislike", error)
        }
    }
    const bookmark = async (id) => {
        try {
            const res = await fetch(`${url}/api/post/bookmark/${id}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({})
            })

            const data = await res.json()
            return data
        } catch (error) {
            console.log("bookmark", error)
        }
    }

    const profiledata = async (id) => {
        try {
            const res = await fetch(`${url}/api/user/profile/${id}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const data = await res.json()
            if (data.success) {
                setfollewing(data.user.following.includes(user._id))
                setfollowers(data.user.followers.includes(user._id))
                setuserData(data.user)
            }
        } catch (error) {
            console.log("profileData", error)
        }
    }

    const hendleSuggestion = async () => {
        try {
            const res = await fetch(`${url}/api/user/suggest`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const data = await res.json()
            if (data.success) {
                setsuggestionuser(data.users)
            }
        } catch (error) {
            console.log("suggestion", error)
        }
    }

    const deletePost = async (id) => {
        try {
            const res = await fetch(`${url}/api/post/deletepost/${id}`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "appliction/json"
                },
                body: JSON.stringify({})
            })

            const data = await res.json()
            if(data.success){
                const newAllpost = allpost.filter(post => post._id !== id)
                setallpost(newAllpost)
            }
        } catch (error) {
            console.log("deletePost", error)
        }
    }

    const hendletoFollow = async (id) => {
        try {
          const res = await fetch(`${url}/api/user/followOrUnfollow/${id}`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({})
          })
    
          const data = await res.json()
          if (data.success) {
            setfollewing(!follewing)
            setfollowers(!followers)
            profiledata(id)
          }
        } catch (error) {
          console.log("follow", error)
        }
      }

      const getNotification = async () => {
        try {
          const res = await fetch(`${url}/api/user/notofocation`, {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            }
          })
  
          const data = await res.json()
          if (data.success) {
            setnotificationLength(data.notificationLength)
            setlengthCount(data.notification.length)
            setnotificationCount(data.notification.length - data.notificationLength)
            setshownotification(data.notification.reverse())
          }
        } catch (error) {
          console.log("getNotification", error)
        }
      }
    return (
        <StoreContext.Provider value={{ url, user, setuser, getUser, color, setcolor, showcomment, setshowcomment, ispopup, setpopup, commentpopup, setcommentpopup, showCreate, setshowCreate, selectPostcomment, setselectPostcomment, addComment, like, dislike, bookmark, allpost, setallpost, profiledata, userData, setuserData, hendleSuggestion, suggestionUser, setsuggestionuser, follewing, setfollewing, followers, setfollowers, messages, setmessages, shownotification, setshownotification, notificationCount, setnotificationCount, popData, setpopData, deletePost, hendletoFollow, getNotification, notificationLength, setnotificationLength, lengthCount, setlengthCount }}>
            {children}
        </StoreContext.Provider>
    )

}

export default ContextProvider