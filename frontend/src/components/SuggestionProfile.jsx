import React, { useContext } from 'react'
import { PiUserCircleThin } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import { StoreContext } from '../context/storeContext'

function SuggestionProfile({user}) {
    const {profiledata} = useContext(StoreContext)
    const navigate = useNavigate()
    const hendleProfile = () =>{
        navigate(`${user._id}/profile`)
        profiledata(user._id)
    }


    return (
        <div className='flex items-center gap-2 py-2 justify-between w-full xl:max-w-[80%] 2xl:max-w-[60%]'>
            <span className='flex items-center gap-2 cursor-pointer' onClick={hendleProfile}>
                <span className='text-3xl'>
                    {
                        user.profileImage ? <div className='w-10 h-10 rounded-full border overflow-hidden'><img src={user.profileImage} alt="userImage" className='h-full w-full object-cover object-center' /></div> : <PiUserCircleThin />
                    }
                </span>
                <span>{user.userName}</span>
            </span>

            <span className='text-blue-700 px-2 rounded-md cursor-pointer hover:text-blue-950'>Follow</span>
        </div>
    )
}

export default SuggestionProfile
