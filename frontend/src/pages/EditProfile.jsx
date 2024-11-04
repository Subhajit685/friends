import React, { useContext, useRef } from 'react'
import { StoreContext } from '../context/storeContext'
import { PiUserCircleThin } from 'react-icons/pi'
import { useState } from 'react'
import { imageFileToDataURI } from '../helper/Datauri'
import { useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner'
import toast from 'react-hot-toast'

function EditProfile() {
    const { user, color, url } = useContext(StoreContext)
    const imageRef = useRef()
    const [bio, setbio] = useState("")
    const [image, setimage] = useState(user?.profileImage)
    const [file, setfile] = useState(null)
    const [gender, setgender] = useState(user?.gender || "select")
    const [loading, setloading] = useState(false)
    const navigate = useNavigate()

    const hendleImage = async (e) => {
        const file = e.target.files[0]
        if (file) {
            setfile(file)
            const dataUri = await imageFileToDataURI(file)
            setimage(dataUri)
        }
    }

    const hendleSave = async () => {
        if (gender === "select") {
            return
        }
        const fromdata = new FormData()
        fromdata.append("bio", bio)
        fromdata.append("gender", gender)
        fromdata.append("profileImage", file)
        setloading(true)
        try {
            const res = await fetch(`${url}/api/user/editProfile`, {
                method : "POST",
                credentials : "include",
                body : fromdata
            })

            const data = await res.json()
            setloading(false)
            if(data.success){
                navigate(`/${user._id}/profile`)
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log("edit", error)
        }
    }

    return (
        <div className={`sm:max-w-[70%] sm:min-w-[70%] max-w-[90%] min-w-[90%] h-full overflow-y-scroll mx-auto ${color === "light" ? "text-black" : "text-white"}`}>
            <h1 className='sm:py-8 py-4 ms:text-2xl text-xl font-bold'>Edit profile</h1>
            <div className={`${color === "light" ? "bg-gray-300" : "bg-gray-600"} flex flex-col sm:flex-row gap-4 sm:gap-0 items-center justify-around py-2 rounded-md`}>
                <div className='flex items-center gap-2'>
                    <div className='sm:text-7xl text-4xl'>
                        {image ? <div className='sm:w-20 sm:h-20 w-16 h-16 rounded-full border overflow-hidden'><img src={image} alt="" className='w-full h-full object-cover object-center' /></div> : <PiUserCircleThin />}</div>
                    <div className='sm:text-2xl text-xl'>{user.userName}</div>
                </div>
                <input type="file" className='hidden' ref={imageRef} onChange={hendleImage} />
                <div className='bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 cursor-pointer' onClick={() => imageRef.current.click()}>Chenge photo</div>
            </div>

            <div className='py-0 sm:py-6'>
                <p className='text-xl font-bold py-4'>Bio</p>
                <textarea value={bio} onChange={(e) => setbio(e.target.value)} className='w-full h-32 border rounded-md bg-transparent p-4' placeholder={user?.bio || "write here.."} />
            </div>

            <div className='py-0 pb-4 sm:pb-8 relative'>
                {
                    gender === "select" && <div className='absolute top-0 left-0 right-0 py-2 text-center bg-red-300 text-red-600 rounded-md'>You not select any gender</div>
                }
                <p className='text-xl font-bold py-4 sm:py-6'>Gender</p>
                <select value={gender} onChange={(e) => setgender(e.target.value)} className='bg-transparent w-full border rounded-md h-10'>
                    <option value="select" className='text-black'>Select gender</option>
                    <option value="male" className='text-black'>Male</option>
                    <option value="female" className='text-black'>Female</option>
                </select>
            </div>

            <div className='bg-blue-600 cursor-pointer hover:bg-blue-700 text-white py-2 mb-8 w-full rounded-md text-center' onClick={hendleSave}>
                {
                    loading ? <Spinner/> : "Save chenges"
                }
            </div>
        </div>
    )
}

export default EditProfile
