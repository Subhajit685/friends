import React, { useContext } from 'react'
import { PiUserCircleThin } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import { StoreContext } from '../context/storeContext'

function SuggestionProfile({ User }) {
    const {user, profiledata, hendletoFollow, followers } = useContext(StoreContext)
    const navigate = useNavigate()
    const hendleProfile = () => {
        navigate(`/${User._id}/profile`)
        profiledata(User._id)
    }

    return (
        <div className='flex items-center gap-2 py-2 justify-between xl:max-w-[80%] 2xl:max-w-[70%] px-4'>
            <span className='flex items-center gap-2 cursor-pointer' onClick={hendleProfile}>
                <span className='text-3xl'>
                    {
                        User.profileImage ? <div className='w-10 h-10 rounded-full border overflow-hidden'><img src={User.profileImage} alt="userImage" className='h-full w-full object-cover object-center' /></div> : <div className='text-5xl'><PiUserCircleThin /></div>
                    }
                </span>
                <span>{User.userName}</span>
            </span>

            <span className='text-blue-700 px-2 rounded-md cursor-pointer hover:text-blue-950' onClick={()=> hendletoFollow(User._id)}>{User.followers.includes(user._id.toString()) ? "Unfollow" : "Follow"}</span>
        </div>
    )
}

export default SuggestionProfile
