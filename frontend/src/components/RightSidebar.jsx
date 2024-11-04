import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../context/storeContext'
import { FaRegUserCircle } from 'react-icons/fa'
import { PiUserCircleThin } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import SuggestionProfile from './SuggestionProfile'

function RightSidebar() {
  const { color, url, user, hendleSuggestion, suggestionUser, setsuggestionuser } = useContext(StoreContext)



  useEffect(() => {
    hendleSuggestion()

  }, [])
  return (
    <div className={`${color === "light" ? "bg-white text-black" : "bg-black text-white"} w-full h-screen`}>
      <div className='pt-4'>
        <div className='flex items-center gap-2 py-2 justify-between w-full xl:max-w-[80%] 2xl:max-w-[60%]'><span className='flex items-center gap-2'>
          <span className='text-3xl'>
            {
              user.profileImage ? <div className='xl:w-12 xl:h-12 w-10 h-10 rounded-full overflow-hidden border'><img src={user.profileImage} alt="userImage" className='w-full h-full object-cover object-center' /></div> : <PiUserCircleThin />
            }
          </span>
          <span className='font-bold'>{user.userName}</span>
        </span>
          <span className='text-blue-700 hover:text-blue-950 px-2 rounded-md cursor-pointer'>Switch</span></div>
      </div>
      <div>
        <div className='py-4 font-bold text-slate-400'>Friends suggestion for you</div>
        <div className=''>
          {
            suggestionUser ? suggestionUser?.map((user, index) => {
              return <SuggestionProfile key={index} user={user} />
            })
              : <div className='text-slate-400'>No suggestion</div>
          }
        </div>
      </div>
    </div>
  )
}

export default RightSidebar
