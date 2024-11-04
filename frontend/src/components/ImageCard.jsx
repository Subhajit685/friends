import React, { useContext } from 'react'
import { StoreContext } from '../context/storeContext'
import { FaHeart, FaRegComment } from 'react-icons/fa'

function ImageCard({ post }) {
    const { color, setshowcomment, setselectPostcomment, setpopData } = useContext(StoreContext)
    const hendleComment = () => {
        setshowcomment(true)
        setselectPostcomment(post)
        setpopData(post)
    }
    return (
        <div className={`min-w-[30%] min-h-[40%] border ${color === "light" ? "border-gray-400" : "border-gray-600"} rounded-sm relative cursor-pointer group`} onClick={hendleComment}>
            <img src={post.postImage[0]} alt="post image" className='w-full h-full object-scale-down object-center' />
            <div className={`absolute top-0 left-0 right-0 bottom-0 sm:group-hover:bg-black opacity-50 `}>
            </div>
            <div className='hidden sm:group-hover:flex justify-center items-center gap-4 absolute top-0 left-0 right-0 bottom-0'>
                <div className='sm:text-2xl text-sm flex items-center gap-1 text-white'><span>{post.likes.length}</span><span><FaHeart /></span></div>
                <div className='sm:text-2xl text-sm flex items-center gap-1 text-white'><span>{post.comments.length}</span><span><FaRegComment /></span></div>
            </div>
        </div>
    )
}

export default ImageCard
