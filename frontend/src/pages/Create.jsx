import React, { useContext, useRef } from 'react'
import { StoreContext } from '../context/storeContext'
import { FaRegUserCircle } from 'react-icons/fa'
import { HiDotsHorizontal } from 'react-icons/hi'
import { MdOutlineCloudUpload } from "react-icons/md";
import { GoX } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { imageFileToDataURI } from '../helper/Datauri';
import Spinner from '../components/Spinner';
import { PiUserCircleThin } from 'react-icons/pi';
import toast from 'react-hot-toast';


function Create() {
  const { color, showCreate, setshowCreate, url, user, allpost, setallpost } = useContext(StoreContext)
  const navigate = useNavigate()
  const [image, setimage] = useState("")
  const [loading, setloading] = useState(false)
  const [file, setfile] = useState("")
  const [caption, setcaption] = useState("")

  const [showDiscard, setshowDiscard] = useState(false)
  const hendleCreate = () => {
    setshowCreate(false)
    navigate("/")
  }
  const imageRef = useRef()

  const hendleDiscart = () => {
    setshowDiscard(!showDiscard)
  }


  const hendleImage = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setfile(file)
      const datauri = await imageFileToDataURI(file)
      setimage(datauri)
    }
  }

  const hendleSubmit = async (e) => {
    e.preventDefault()
    setloading(true)
    let fromData = new FormData()
    fromData.append("caption", caption)
    if (image) {
      fromData.append("postImage", file)
    }
    try {
      const res = await fetch(`${url}/api/post/newpost`, {
        method: "POST",
        credentials: "include",
        body: fromData
      })

      const data = await res.json()
      setloading(false)
      if (data.success) {
        setshowCreate(false)
        setallpost([data?.newpost, ...allpost])
        navigate("/")
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log("newpost", error)
    }
  }

  return (
    <div className={`h-screen overflow-y-scroll w-screen flex justify-center items-center relative`}>
      <div className={`${color === "light" ? "text-black" : "text-white"} absolute top-8 right-8 text-2xl md:text-4xl cursor-pointer hover:text-red-500`} onClick={hendleCreate}>
        <GoX />
      </div>
      <div className={`${color === "light" ? "bg-white text-black" : "bg-slate-800 text-white"} min-w-[90%] max-w-[90%] md:min-w-[80%] md:max-w-[80%] lg:min-w-[60%] lg:max-w-[60%] xl:min-w-[50%] xl:max-w-[50%] 2xl:min-w-[40%] 2xl:max-w-[40%] rounded-md shadow-lg`}>
        <form onSubmit={hendleSubmit}>
          <div className={`flex items-center justify-between w-full px-8 pt-4`}>
            <div className={`flex gap-2 items-center cursor-pointer`}>
              <div className={`md:text-4xl text-2xl`}>
                {user?.profileImage ? (<div className='md:w-12 md:h-12 w-10 h-10 rounded-full overflow-hidden border'><img src={user?.profileImage} alt="" className='w-full h-full object-cover object-center' /></div>) : (<PiUserCircleThin />)}
              </div>
              <div className='flex flex-col'>
                <div className='text-sm md:text-base'>
                  {user?.userName}
                </div>
                <div className='text-xs'>
                  {user?.bio}
                </div>
              </div>
            </div>
            <div className={`cursor-pointer relative`} onClick={hendleDiscart}>
              <HiDotsHorizontal />
              {
                showDiscard && <div className={`${color === "light" ? "bg-white text-black" : "bg-slate-800 text-white"} absolute top-0 right-0 border rounded-md shadow-lg md:w-32 w-28`}>

                  <div className='text-center p-2 text-sm md:text-base' onClick={hendleCreate}>
                    Discard
                  </div>
                  <div className={`${color === "light" ? "bg-slate-300" : "bg-slate-500"} w-full h-px`}></div>

                  <div className='text-center p-2 text-sm md:text-base' onClick={hendleDiscart}>
                    Continue
                  </div>
                </div>
              }


            </div>
          </div>

          <div className='text-center md:text-xl text-base py-2'>
            Create New Post
          </div>

          <div className='flex justify-center items-center px-10 py-2'>
            <input type="text" value={caption} onChange={(e) => setcaption(e.target.value)} placeholder='write a caption here...' className='bg-transparent border-none outline-none w-full' />
          </div>
          <div className={`${color === "light" ? "bg-slate-300" : "bg-slate-500"} max-w-[95%] h-px mx-4`}></div>
          <div className='pt-4'>
            <input type="file" name='image' ref={imageRef} onChange={hendleImage} className='hidden' />
            <div className={`max-w-[95%] min-h-[40vh] max-h-[50vh] ${color === "light" ? "bg-slate-100" : "bg-slate-700"} border mx-auto rounded-md cursor-pointer flex justify-center items-center md:text-7xl text-5xl flex-col`} onClick={() => imageRef.current.click()}>
              {
                image ? <div className='w-full h-full overflow-hidden rounded-md'><img src={image} alt="" className='w-full h-full object-scale-down object-center rounded-md' /> </div> :
                  <div className='flex justify-items-center items-center gap-4'>
                    <MdOutlineCloudUpload />
                    <div className={`text-xl`}>
                      Upload image
                    </div>
                  </div>
              }

            </div>
          </div>

          <div className='max-w-[95%] mx-auto py-4'>
            <button className={`w-full bg-blue-700 py-2 rounded-md hover:bg-blue-800 text-white`}>{loading ? <div className='flex items-center justify-center gap-4'><p>Processing..</p><Spinner /></div> : "Publish"}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Create
