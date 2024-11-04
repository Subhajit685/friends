import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../context/storeContext'
import { FaRegUserCircle } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { FaRegBookmark } from "react-icons/fa6";
import Spinner from './Spinner';
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { MdBookmark } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { PiUserCircleThin } from "react-icons/pi";



function Showpost({ post }) {
    const { color, showcomment, setshowcomment, ispopup, setpopup, selectPostcomment, setselectPostcomment, addComment, user, like, dislike, bookmark, allComment, setAllcomment, popData, setpopData, deletePost } = useContext(StoreContext)

    const [loading, setloading] = useState(false)
    const [showLike, setshowLike] = useState([])
    const [showbookmark, setshowbookmark] = useState(user?.bookmarks.includes(post._id) || false)
    const navigate = useNavigate()
    const [comment, setcomment] = useState("")

    const hendleShowComment = () => {
        setshowcomment(true)
        setselectPostcomment(post)
    }


    const hendleComment = async () => {
        setloading(true)
        const data = await addComment(post?._id, comment)
        setloading(false)
        setcomment("")
        if (data.success) {
            setAllcomment([data.newComment, ...allComment])
        }
    }

    const hendleLike = async () => {
        try {
            if (showLike.includes(user._id)) {
                const data = await dislike(post._id)
                if (data.success) {
                    const newLike = showLike.filter((id) => id !== user._id)
                    setshowLike(newLike)
                }
            } else {
                const data = await like(post._id)
                if (data.success) {
                    setshowLike([...showLike, user._id])
                }
            }
        } catch (error) {
            console.log("hendleLike", error)
        }
    }

    const hendlebookmark = async () => {
        try {
            const data = await bookmark(post._id)
            if (data.success) {
                setshowbookmark(data.bookmark)
            }
        } catch (error) {
            console.log("hendlebookmark", error)
        }
    }

    const hendleProfile = () => {
        navigate(`${post.postAuthor?._id}/profile`)
    }

    const hendlePopup = () =>{
        setpopup(true)
        setpopData(post)
    }

    useEffect(() => {
        setshowLike(post?.likes)
    }, [])

    return (
        <div className={`${color === "light" ? "bg-white text-black" : "bg-black text-white"} w-full sm:max-w-[80%] md:max-w-[80%] lg:max-w-[90%] xl:max-w-[70%] my-4 rounded-md mx-auto`}>
            <div className={`flex items-center justify-between w-full md:px-8 px-4 pt-0 md:pt-4`}>
                <div className={`flex gap-2 items-center cursor-pointer`} onClick={hendleProfile}>
                    <div className={`md:text-5xl text-3xl`}>
                        {
                            post.postAuthor?.profileImage ? <div className='md:w-12 md:h-12 w-10 h-10 rounded-full overflow-hidden border'><img src={post.postAuthor?.profileImage} alt="userImage" className='w-full h-full object-cover object-center' /></div> : <PiUserCircleThin />
                        }
                    </div>
                    <div className='flex flex-col'>
                        <div className='font-bold text-sm md:text-base'>
                            {post.postAuthor?.userName}
                        </div>
                        <div className={`${color === "light" ? "text-gray-500" : "text-gray-400"} text-sm`}>
                            {post.postAuthor?.bio}
                        </div>
                    </div>
                </div>
                <div className={`cursor-pointer`} onClick={() => hendlePopup()}>
                    <HiDotsHorizontal />
                </div>
            </div>
            <div className='w-full'>
                {
                    post?.postImage?.map((image, index) => {
                        return <img key={index} src={image} alt="" className='w-full object-cover p-2 md:p-4 object-center rounded-md' />
                    })
                }

            </div>
            <div className='flex items-center justify-between px-4'>
                <div className='flex items-center gap-4'>
                    <div className='text-2xl md:text-3xl cursor-pointer hover:text-slate-400' onClick={hendleLike}>{showLike.includes(user._id) ? <div className='text-red-600'><FaHeart /> </div> : <FaRegHeart />}</div>
                    <div className='text-2xl md:text-3xl cursor-pointer hover:text-slate-400' onClick={hendleShowComment}><FaRegComment /></div>
                    <div className='text-2xl md:text-3xl cursor-pointer hover:text-slate-400'><FiSend /></div>
                </div>
                <div>
                    <div className='text-2xl md:text-3xl cursor-pointer hover:text-slate-400' onClick={hendlebookmark}>{showbookmark ? <MdBookmark /> : <FaRegBookmark />}</div>
                </div>
            </div>
            <div className='px-4 py-1 md:py-2'>
                {showLike.length} likes
            </div>
            <div className='px-4 text-sm md:text-base'>
                <span className={`${color === "light" ? "text-black font-bold" : "text-white font-bold"}`}>{post.postAuthor.userName}.</span> <span>{post?.caption}</span>
            </div>
            <div className='px-4 text-slate-400 text-sm md:text-base cursor-pointer' onClick={hendleShowComment}>
                View All {post?.comments.length} comments
            </div>

            <div className='flex items-center px-4 py-2 pb-4'>
                <div className='cursor-pointer text-2xl'>

                    {
                        user?.profileImage ? <div className='md:w-8 md:h-8 w-6 h-6 rounded-full overflow-hidden border'><img src={user?.profileImage} alt="userImage" className='w-full h-full object-cover object-center' /></div> : <PiUserCircleThin />
                    }

                </div>
                <input type="text" value={comment} onChange={(e) => setcomment(e.target.value)} placeholder='Add your comment here...' className='w-full px-4 text-sm md:text-base border-none outline-none bg-transparent' />
                <div className='cursor-pointer text-blue-500' onClick={hendleComment}>{loading ? <Spinner /> : "Post"}</div>
            </div>
            <div className={`${color === "light" ? "bg-slate-300" : "bg-slate-500"} w-full h-px`}></div>
        </div>
    )
}

export default Showpost
