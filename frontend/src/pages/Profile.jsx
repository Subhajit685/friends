import React, { useContext, useEffect, useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { StoreContext } from '../context/storeContext'
import { PiUserCircleThin } from "react-icons/pi";
import { CiCirclePlus } from "react-icons/ci";
import { BsPlusLg } from "react-icons/bs";
import { AiOutlineProfile } from "react-icons/ai";
import { FaRegBookmark } from 'react-icons/fa';
import { TfiVideoClapper } from "react-icons/tfi";
import ProfilePost from '../components/ProfilePost';
import ShowSaved from '../components/ShowSaved';
import Reels from '../components/Reels';




function Profile() {

  const { url, color, profiledata, userData, setuserData, user, follewing, setfollewing, followers, setfollowers, hendletoFollow } = useContext(StoreContext)
  const parems = useParams()
  const naviget = useNavigate()

  const [tab, settab] = useState("post")

  const hendelEdit = () => {
    naviget("/editprofile")
  }

  const hendleFollow = (id) => {
    hendletoFollow(id)
  }

  const hendleMessage = () => {
    naviget(`/message`)
  }

  useEffect(() => {
    profiledata(parems.id)
  }, [])
  return (
    <div className={`px-4 sm:px-0 max-w-[100%] min-w-[100%] sm:max-w-[90%] sm:min-w-[90%] md:max-w-[80%] md:min-w-[80%] lg:max-w-[90%] lg:min-w-[90%] xl:max-w-[80%] xl:min-w-[80%] 2xl:max-w-[70%] 2xl:min-w-[70%] h-full overflow-y-scroll mx-auto ${color === "light" ? "text-black" : "text-white"}`}>


      <div className='sm:hidden flex items-center gap-6 sm:gap-8 md:gap-6 lg:gap-4 xl:gap-4 2xl:gap-8 w-full pt-2 mx-auto justify-center'>
        <div className='font-bold lg:text-xl sm:text-lg text-lg'>{userData.userName}</div>

        {
          userData._id === user._id ?

            // Login user button

            (<div className='flex gap-6 sm:gap-6 md:gap-6 lg:gap-6 xl:gap-6 2xl:gap-8'>

              {/* edit button */}

              <div className={`${color === "light" ? "bg-gray-300 text-black hover:bg-gray-400" : "bg-gray-600 text-white hover:bg-gray-500"} px-2 py-2 text-xs sm:text-base rounded-md cursor-pointer text-black`} onClick={hendelEdit}>Edit profile</div>

              {/* View archive */}

              <div className={`${color === "light" ? "bg-gray-300 text-black hover:bg-gray-400" : "bg-gray-600 text-white hover:bg-gray-500"} px-2 py-2 text-xs sm:text-base rounded-md cursor-pointer text-black`}>View archive</div>
            </div>)
            :
            (follewing ? (

              followers ? (<div className='flex gap-4 sm:gap-8'>

                {/* unfollow button */}

                <div className={`${color === "light" ? "bg-gray-300 text-black hover:bg-gray-400" : "bg-gray-600 text-white hover:bg-gray-500"} px-2 py-2 rounded-md cursor-pointer text-xs sm:text-base text-black`} onClick={() => hendleFollow(userData._id)}>Unfollow</div>

                {/* message button */}

                <div className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs sm:text-base rounded-md cursor-pointer`} onClick={hendleMessage}>Message</div>
              </div>) : (

                // follow back button

                <div className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs sm:text-base rounded-md cursor-pointer`} onClick={() => hendleFollow(userData._id)}>Follow back</div>))
              :
              (followers ? (

                // cancle button

                <div className={`${color === "light" ? "bg-gray-300 text-black hover:bg-gray-400" : "bg-gray-600 text-white hover:bg-gray-500"} px-2 py-2 text-xs sm:text-base rounded-md cursor-pointer text-black`} onClick={() => hendleFollow(userData._id)}>Cancle</div>) : (

                // follow button

                <div className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs sm:text-base rounded-md cursor-pointer`} onClick={() => hendleFollow(userData._id)} >Follow</div>
              )))
        }



      </div>

      {/* //up */}
      <div className='flex w-full min-h-[20vh] pt-4'>

        <div className='text-9xl min-w-[30%] max-w-[30%] sm:min-w-[25%] sm:max-w-[25%] flex items-center justify-center'>{userData.profileImage ? <div className='w-24 h-24 sm:w-28 sm:h-28 xl:w-32 xl:h-32 2xl:w-40 2xl:h-40 rounded-full border border-orange-400 overflow-hidden'><img src={userData.profileImage} alt="" className='w-full h-full object-cover object-center' /></div> : <PiUserCircleThin />} </div>


        <div className='flex flex-col min-w-[70%] max-w-[70%] sm:min-w-[75%] sm:max-w-[75%] items-start justify-center px-4'>

          <div className='hidden sm:flex items-center gap-2 sm:gap-8 md:gap-6 lg:gap-4 xl:gap-4 2xl:gap-8 w-full pt-2'>
            <div className='font-bold lg:text-xl sm:text-lg text-md'>{userData.userName}</div>

            {
              userData._id === user._id ?

                // Login user button

                (<div className='flex gap-2 sm:gap-6 md:gap-6 lg:gap-6 xl:gap-6 2xl:gap-8'>

                  {/* edit button */}

                  <div className={`${color === "light" ? "bg-gray-300 text-black hover:bg-gray-400" : "bg-gray-600 text-white hover:bg-gray-500"} px-2 py-2 text-xs sm:text-base rounded-md cursor-pointer text-black`} onClick={hendelEdit}>Edit profile</div>

                  {/* View archive */}

                  <div className={`${color === "light" ? "bg-gray-300 text-black hover:bg-gray-400" : "bg-gray-600 text-white hover:bg-gray-500"} px-2 py-2 text-xs sm:text-base rounded-md cursor-pointer text-black`}>View archive</div>
                </div>)
                :
                (follewing ? (

                  followers ? (<div className='flex gap-8'>

                    {/* unfollow button */}

                    <div className={`${color === "light" ? "bg-gray-300 text-black hover:bg-gray-400" : "bg-gray-600 text-white hover:bg-gray-500"} px-2 py-2 rounded-md cursor-pointer text-black`} onClick={() => hendleFollow(userData._id)}>Unfollow</div>

                    {/* message button */}

                    <div className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer`} onClick={hendleMessage}>Message</div>
                  </div>) : (

                    // follow back button

                    <div className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer`} onClick={() => hendleFollow(userData._id)}>Follow back</div>))
                  :
                  (followers ? (

                    // cancle button

                    <div className={`${color === "light" ? "bg-gray-300 text-black hover:bg-gray-400" : "bg-gray-600 text-white hover:bg-gray-500"} px-2 py-2 rounded-md cursor-pointer text-black`} onClick={() => hendleFollow(userData._id)}>Cancle</div>) : (

                    // follow button

                    <div className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer`} onClick={() => hendleFollow(userData._id)} >Follow</div>
                  )))
            }



          </div>
          <div className='flex gap-4 py-4'>
            <div className='text-sm sm:text-base text-center font-bold'>{userData.posts?.length} posts</div>
            <div className='text-sm sm:text-base text-center font-bold'>{userData.followers?.length} followers</div>
            <div className='text-sm sm:text-base text-center font-bold'>{userData.following?.length} following</div>
          </div>
          <div>
            <p className='text-sm sm:text-base'>{userData.userName}</p>
            <p className='text-sm sm:text-base'>{userData.bio ? userData.bio : "No bio"}</p>
          </div>
        </div>

      </div>

      <div className='my-10 w-16 h-16 text-center'>

        <div className='text-6xl p-px border rounded-full w-16 h-16 flex justify-center items-center flex-col cursor-pointer'>
          <div className='w-14 h-14 border rounded-full bg-gray-300 flex justify-center items-center text-6xl'><BsPlusLg /></div>
        </div>
        <span>New</span>
      </div>

      <div className={`${color === "light" ? "bg-slate-300" : "bg-slate-500"} w-full h-px`}></div>

      {/* //Down */}

      <div className=''>

        <div className='flex items-center justify-center py-4 gap-16'>
          <div className={`flex items-center gap-1 ${tab === "post" ? "" : "text-gray-400"} cursor-pointer`} onClick={() => settab("post")}><span><AiOutlineProfile /></span><span>Posts</span></div>
          <div className={`flex items-center gap-1 ${tab === "save" ? "" : "text-gray-400"} cursor-pointer`} onClick={() => settab("save")}><span><FaRegBookmark /></span><span>Saved</span></div>
          <div className={`flex items-center gap-1 ${tab === "reel" ? "" : "text-gray-400"} cursor-pointer`} onClick={() => settab("reel")}><span><TfiVideoClapper /></span><span>Reels</span></div>
        </div>

        <div className='w-full mx-auto'>
          {
            tab === "post" && <ProfilePost userData={userData} />
          }
          {
            tab === "save" && <ShowSaved userData={userData} />
          }
          {
            tab === "reel" && <Reels />
          }
        </div>

      </div>

    </div>
  )
}

export default Profile
