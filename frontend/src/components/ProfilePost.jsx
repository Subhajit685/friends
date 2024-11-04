import React, { useContext } from 'react'
import { StoreContext } from '../context/storeContext'
import { FaHeart, FaRegComment } from 'react-icons/fa'
import ImageCard from './ImageCard'

function ProfilePost({ userData }) {
  const { color, setshowcomment, setselectPostcomment } = useContext(StoreContext)
  return (
    <div className='w-full h-full grid grid-cols-3 gap-1'>
      {
        userData.posts ? userData.posts?.map((post, index) => {
          return <ImageCard key={index} post={post}/>
        }) : <div>No post</div>
      }
    </div>
  )
}

export default ProfilePost
