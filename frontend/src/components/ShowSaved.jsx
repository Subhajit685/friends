import React, { useContext } from 'react'
import { StoreContext } from '../context/storeContext'
import ImageCard from './ImageCard'

function ShowSaved({userData}) {
  const {color} = useContext(StoreContext)
  return (
    <div className='w-full h-full grid grid-cols-3 gap-1'>
        {
          userData?.bookmarks ? userData.bookmarks?.map((post, index)=>{
            return <ImageCard key={index} post={post}/>
          }) : <div className='text-center'>No saved post</div>
        }
    </div>
  )
}

export default ShowSaved
