import React, { useContext, useEffect } from 'react'
import { StoreContext } from '../context/storeContext'

function Popup() {
  const { color, ispopup, setpopup, commentpopup, setcommentpopup, popData, setpopData, deletePost, user, hendletoFollow, followers, profiledata } = useContext(StoreContext)
  const hendleClose = () => {
    setpopup(false)
    setcommentpopup(false)
  }

  const hendleDelete = () => {
    deletePost(popData._id)
    setpopup(false)
  }

  const ID = popData.postAuthor._id ? popData.postAuthor._id : popData.postAuthor

  useEffect(()=>{
    profiledata(ID)
  },[])

  return (
    <div className='h-screen w-screen flex justify-center items-center'>
      <div className={`${color === "light" ? "bg-white text-black" : "bg-slate-800 text-white"} sm:w-40 w-32 rounded-md shadow-lg cursor-pointer`}>

        {/* save */}

        <div className='flex justify-center items-center text-center text-sm sm:text-base py-4'>
          Save
        </div>
        <div className={`${color === "light" ? "bg-slate-300" : "bg-slate-500"} w-full h-px`}></div>

        {/* delete */}

        {
          user._id === ID ?

            <><div className='flex justify-center items-center text-center text-sm sm:text-base py-4' onClick={hendleDelete}>
              Delete
            </div>
              <div className={`${color === "light" ? "bg-slate-300" : "bg-slate-500"} w-full h-px`}></div></>

            :
            // folloe or unfollow

            <> <div className='flex justify-center items-center text-center text-sm sm:text-base py-4' onClick={()=> hendletoFollow(ID)}>
              {followers ? "Unfollow" : "Follow"}
            </div>
              <div className={`${color === "light" ? "bg-slate-300" : "bg-slate-500"} w-full h-px`}></div></>
        }

        {/* close */}
        <div className='flex justify-center items-center px-8 py-4' onClick={hendleClose}>
          Close
        </div>
      </div>
    </div>
  )
}

export default Popup
