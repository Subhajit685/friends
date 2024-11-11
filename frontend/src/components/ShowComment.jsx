import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../context/storeContext'
import { FaRegUserCircle } from 'react-icons/fa'
import { HiDotsHorizontal } from 'react-icons/hi'
import Popup from './Popup'
import { GoX } from "react-icons/go";
import Spinner from './Spinner'
import { PiUserCircleThin } from 'react-icons/pi'


function ShowComment({ selectPostcomment }) {
  const { color, setshowcomment, showcomment, ispopup, setpopup, commentpopup, setcommentpopup, addComment, url, comment, setcomment, user, setpopData, allComment, setAllcomment } = useContext(StoreContext)

  const [loading, setloading] = useState(false)
  const [postUserData, setpostuserData] = useState({})

  const hendleComment = async () => {
    setloading(true)
    const data = await addComment(selectPostcomment?._id)
    if (data.success) {
      setloading(false)
      setAllcomment([data.newComment, ...allComment])
    }
  }

  const hendlePop = () => {
    setcommentpopup(true)
    setpopData(selectPostcomment)
  }

  useEffect(() => {
    const getComment = async () => {
      try {
        const res = await fetch(`${url}/api/post/getcomment/${selectPostcomment._id}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        })

        const data = await res.json()
        if (data.success) {
          setAllcomment(data.allcomment)
        }
      } catch (error) {
        console.log("allcomment", error)
      }
    }
    getComment()
  }, [])

  useEffect(() => {
    const gerUserData = async () => {
      try {
        const res = await fetch(`${url}/api/user/userData/${selectPostcomment.postAuthor}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        })
        const data = await res.json()
        if (data.success) {
          setpostuserData(data.user)
        }
      } catch (error) {
        console.log("gerUserData", error)
      }
    }

    if (!selectPostcomment?.postAuthor.userName) {
      gerUserData()
    } else {
      setpostuserData({})
    }
  }, [])
  return (
    <div className={`w-screen h-screen flex justify-center items-center relative`}>


      {/* cross button */}

      <div className={`${color === "light" ? "text-black" : "text-white"} absolute top-2 lg:top-8 lg:right-8 right-2 lg:text-4xl text-2xl cursor-pointer hover:text-red-500`} onClick={() => setshowcomment(false)}>
        <GoX />
      </div>


      {/* main div */}

      <div className={`${color === "light" ? "bg-white text-black" : "bg-slate-800 text-white"}  min-w-[90%] max-w-[90%] sm:min-w-[70%] sm:max-w-[70%] md:min-w-[60%] md:max-w-[60%] lg:min-w-[80%] lg:max-w-[80%] xl:min-w-[70%] xl:max-w-[70%] 2xl:min-w-[60%] 2xl:max-w-[60%] rounded-md shadow-md p-2 md:p-4 flex flex-col lg:flex-row h-[85%] lg:h-auto`}>

        {/* top profile data before lg then hide */}

        <div className={`flex lg:hidden justify-between w-full items-center px-2 md:px-4 pb-2 h-[10%] lg:h-auto`}>
          <div className={`flex gap-2 cursor-pointer`}>
            <div className={`text-3xl`}>
              {
                selectPostcomment.postAuthor?.profileImage ? (<div className='md:w-10 md:h-10 w-8 h-8 rounded-full overflow-hidden border'><img src={selectPostcomment.postAuthor?.profileImage} alt="userImage" className='w-full h-full object-cover object-center' /></div>) : (postUserData.profileImage ? (<div className='w-10 h-10 rounded-full overflow-hidden border'><img src={postUserData.profileImage} alt="userImage" className='w-full h-full object-cover object-center' /></div>) : <PiUserCircleThin />)
              }
            </div>
            <div className='flex flex-col'>
              <div className='text-base lg:text-xl'>
                {selectPostcomment?.postAuthor.userName || postUserData.userName}
              </div>
              <div className='text-xs text-gray-300'>
                {selectPostcomment?.postAuthor.bio || postUserData.bio}
              </div>
            </div>
          </div>
          <div className={`cursor-pointer`} onClick={hendlePop}>
            <HiDotsHorizontal />
          </div>
        </div>

        {/* image */}

        <div className={`w-full md:w-full lg:w-1/2 rounded-md min-h-[50%] max-h-[60%] lg:h-auto`}>
          {
            selectPostcomment?.postImage.map((image, index) => {
              return <img key={index} src={image} alt="" className={`w-full h-full object-scale-down object-center rounded-md`} />
            })
          }
        </div>



        {/* comment data */}

        <div className={`w-full lg:w-1/2 px-4 flex flex-col h-full lg:h-auto relative`}>

          {/* 1 */}

          <div className={`hidden lg:flex justify-between w-full items-center px-4 pt-0 pb-2 absolute top-0`}>
            <div className={`flex gap-2 cursor-pointer`}>
              <div className={`text-3xl`}>
                {
                  selectPostcomment.postAuthor?.profileImage ? (<div className='w-10 h-10 rounded-full overflow-hidden border'><img src={selectPostcomment.postAuthor?.profileImage} alt="userImage" className='w-full h-full object-cover object-center' /></div>) : (postUserData.profileImage ? (<div className='w-10 h-10 rounded-full overflow-hidden border'><img src={postUserData.profileImage} alt="userImage" className='w-full h-full object-cover object-center' /></div>) : <PiUserCircleThin />)
                }
              </div>
              <div className='flex flex-col'>
                <div className='text-xl'>
                  {selectPostcomment?.postAuthor.userName || postUserData.userName}
                </div>
                <div className='text-xs text-gray-300'>
                  {selectPostcomment?.postAuthor.bio || postUserData.bio}
                </div>
              </div>
            </div>
            <div className={`cursor-pointer`} onClick={hendlePop}>
              <HiDotsHorizontal />
            </div>
          </div>

          {/* line after show profile data */}

          <div className={`${color === "light" ? "bg-slate-300" : "bg-slate-500"} hidden lg:block w-full h-px absolute top-14`}></div>

          {/* 2 */}

          <div className={`overflow-y-scroll w-full py-2 px-4 absolute top-4 lg:top-16 left-0 bottom-12`}>

            <div className={`flex gap-2 items-center pb-2`}>
              <div className='text-3xl'>
                {
                  selectPostcomment.postAuthor?.profileImage ? (<div className='w-8 h-8 rounded-full overflow-hidden border'><img src={selectPostcomment.postAuthor?.profileImage} alt="userImage" className='w-full h-full object-cover object-center' /></div>) : (postUserData.profileImage ? (<div className='w-8 h-8 rounded-full overflow-hidden border'><img src={postUserData.profileImage} alt="userImage" className='w-full h-full object-cover object-center' /></div>) : <PiUserCircleThin />)
                }
              </div>
              <div className='text-base lg:text-xl font-bold'>
                {selectPostcomment?.postAuthor.userName || postUserData.userName}
              </div>
              <div className='text-sm'>
                {selectPostcomment?.caption}
              </div>
            </div>

            {
              allComment ? (allComment?.map((comment, index) => {
                return <div key={index} className={`flex gap-2 items-center py-3`}>
                  <div className='text-4xl'>
                    {
                      comment.user?.profileImage ? <div className='md:w-8 md:h-8 w-6 h-6 rounded-full border overflow-hidden'><img src={comment.user?.profileImage} alt="userImage" className='w-full h-full object-cover object-center' /></div> : <PiUserCircleThin />
                    }</div>
                  <div className='text-sm font-bold'>
                    {comment?.user.userName}
                  </div>
                  <div className='text-sm'>
                    {comment?.text}
                  </div>

                </div>
              })) : (<div>No comment</div>)
            }

          </div>

          <div className={`${color === "light" ? "bg-slate-300" : "bg-slate-500"} w-[95%] h-px absolute bottom-10`}></div>

          {/* 3 */}
          <div className='flex items-center py-2 w-full justify-between px-4 absolute bottom-0 left-0'>
            <div className='cursor-pointer text-2xl'>
              {
                user?.profileImage ? <div className='w-6 h-6 rounded-full overflow-hidden border'><img src={user?.profileImage} alt="userImage" className='w-full h-full object-cover object-center' /></div> : <PiUserCircleThin />
              }
            </div>
            <input type="text" value={comment} onChange={(e) => setcomment(e.target.value)} placeholder='Add your comment here...' className='w-full px-4 border-none outline-none bg-transparent text-sm lg:text-base' />
            <div className='cursor-pointer text-blue-500' onClick={hendleComment}>{loading ? <Spinner /> : "Post"}</div>
          </div>

        </div>

      </div>

      {/* popup */}

      {
        commentpopup && <div className={`absolute top-0 left-0 z-50 ${color === "light" ? "bg-slate-300" : "bg-slate-950"} bg-opacity-30`}>
          <Popup />
        </div>
      }
    </div>
  )
}

export default ShowComment
