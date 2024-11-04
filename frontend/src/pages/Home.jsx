import React, { useContext, useEffect, useState } from 'react'
import LeftSidebar from '../components/LeftSidebar'
import { Outlet } from 'react-router-dom'
import RightSidebar from '../components/RightSidebar'
import { StoreContext } from '../context/storeContext'
import ShowComment from '../components/ShowComment'
import Popup from '../components/Popup'
import Create from './Create'


import { GoHome } from "react-icons/go";
import { GoHomeFill } from "react-icons/go";
import { FaRegUserCircle } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { CiSearch } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { BsGraphUpArrow } from "react-icons/bs";
import { GoGraph } from "react-icons/go";
import { BsClipboard2Plus } from "react-icons/bs";
import { BsClipboard2PlusFill } from "react-icons/bs";
import { AiOutlineMessage } from "react-icons/ai";
import { AiFillMessage } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { IoSettingsSharp } from "react-icons/io5";
import { PiUserCircleThin } from 'react-icons/pi'

function Home() {
    const { color, showcomment, setshowcomment, ispopup, setpopup, showCreate, setshowCreate, selectPostcomment, setselectPostcomment, url, setuser, setcolor, user, profiledata, notificationCount, setnotificationCount } = useContext(StoreContext)


    const location = useLocation()
    const navigate = useNavigate()

    const [setting, setsetting] = useState(false)

    const hendleLogout = async () => {
        try {
            const res = await fetch(`${url}/api/user/logout`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const data = await res.json()
            if (data.success) {
                setuser(null)
            }
        } catch (error) {
            console.log("logout", error)
        }
    }

    const chengeTheam = async () => {
        let theamcolor
        if (color == "light") {
            theamcolor = "dark"
        } else {
            theamcolor = "light"
        }

        try {
            const res = await fetch(`${url}/api/user/theam`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ theam: theamcolor })
            })

            const data = await res.json()
            if (data.success) {
                setcolor(data.color)
            }
        } catch (error) {

        }
    }

    const hendleRefresh = () => {
        navigate(`${user._id}/profile`)
        profiledata(user._id)
    }

    const hendlesetting = () => {
        setsetting(!setting)
    }
    return (
        <div className={`${color === "light" ? "bg-white text-black" : "bg-black text-white"} w-screen h-screen overflow-y-auto relative`}>
            <div className='flex flex-col md:flex-row justify-between h-full'>

                <div className='flex items-center justify-between px-4 md:hidden max-h-[10%] min-h-[10%] md:max-h-[0%] md:min-h-[0%]'>

                    {/* logo */}

                    <div className={`${color === "light" ? "text-black" : "text-white"} text-3xl font-bold`}>Logo</div>


                    <div className='flex items-center gap-4'>
                        {/* // nitification */}

                        <Link to={"notification"} className='flex items-center gap-2 cursor-pointer'>
                            <div className={`text-3xl ${color === "light" ? "text-black" : "text-white"} relative`}>
                                {
                                    location.pathname === "/notification" ? <span className='text-2xl'><FaHeart /></span> : <span className='text-2xl'><FaRegHeart /></span>
                                }
                                {
                                    notificationCount > 0 && <div className='bg-red-800 text-white absolute -top-2 -right-2 rounded-full text-sm p-2 w-5 h-5 flex justify-center items-center'>{notificationCount}</div>
                                }
                            </div>
                            <div className={`text-xl hidden lg:block font-sans ${color === "light" ? "text-black" : "text-white"}`}>
                                <div>{
                                    location.pathname === "/notification" ? <span className='text-lg font-bold'>Notification</span> : <span className='text-lg'>Notification</span>
                                }</div>
                            </div>
                        </Link>

                        {/* // message */}

                        <Link to={"/message"} className='flex items-center gap-2 cursor-pointer'>
                            <div className={`text-3xl ${color === "light" ? "text-black" : "text-white"}`}>
                                {
                                    location.pathname === "/message" ? <span className='text-2xl'><AiFillMessage /></span> : <span className='text-2xl'><AiOutlineMessage /></span>
                                }
                            </div>
                            <div className={`text-xl hidden lg:block font-sans ${color === "light" ? "text-black" : "text-white"}`}>
                                <div>{
                                    location.pathname === "/message" ? <span className='text-lg font-bold'>Message</span> : <span className='text-lg'>Message</span>
                                }</div>
                            </div>
                        </Link>

                        {/* setting */}

                        <div className={`text-2xl md:text-3xl ${color === "light" ? "text-black" : "text-white"} cursor-pointer relative`} onClick={hendlesetting}>
                            {
                                location.pathname === "/setting" ? <IoSettingsSharp /> : <IoSettingsOutline />
                            }
                            {
                                setting && <div className={`absolute top-7 right-0 w-28 md:w-32 ${color === "light" ? "bg-white" : "bg-slate-800 shadow-slate-500"} shadow-md rounded-md flex flex-col items-center justify-center z-50`}>

                                    <div className='text-base py-2' onClick={hendleLogout}>Logout</div>

                                    <div className={`${color === "light" ? "bg-slate-300" : "bg-slate-500"} w-full h-px`}></div>

                                    <div className='text-base py-2' onClick={chengeTheam}>{color === "light" ? "Dark" : "Light"}</div>

                                    <div className={`${color === "light" ? "bg-slate-300" : "bg-slate-500"} w-full h-px`}></div>

                                    <div className='text-base py-2' onClick={() => setsetting(!setting)}>Close</div>
                                </div>
                            }
                        </div>
                    </div>

                </div>




                <div className={`${color === "light" ? "bg-white" : "bg-black"} min-w-[0%] max-w-[0%] md:min-w-[15%] md:max-w-[15%] relative hidden md:flex`}>
                    <LeftSidebar />
                    <div className={`${color === "light" ? "bg-slate-300" : "bg-slate-700"} h-full w-px absolute right-0`}></div>
                </div>



                <div className={`w-full md:min-w-[85%] md:max-w-[85%] lg:min-w-[60%] lg:max-w-[60%] max-h-[82%] min-h-[82%] md:max-h-[100%] md:min-h-[100%]`}>
                    <Outlet />
                </div>


                <div className={`lg:min-w-[25%] lg:max-w-[25%] hidden lg:block min-w-[0%] max-w-[0%] px-4`}>
                    <RightSidebar />
                </div>

                <div className='flex items-center justify-between px-4 md:hidden max-h-[8%] min-h-[8%] md:max-h-[0%] md:min-h-[0%]'>

                    {/* //home */}

                    <Link to={"/"} className='flex items-center gap-2 cursor-pointer'>
                        <div className={`${color === "light" ? "text-black" : "text-white"}`}>
                            {
                                location.pathname === "/" ? <span className='text-2xl'><GoHomeFill /></span> : <span className='text-2xl'><GoHome /></span>
                            }
                        </div>
                        <div className={`text-xl hidden lg:block font-sans ${color === "light" ? "text-black" : "text-white"}`}>
                            <div>{
                                location.pathname === "/" ? <span className='font-bold'>Home</span> : <span className=''>Home</span>
                            }</div>
                        </div>
                    </Link>

                    {/* //Search */}

                    <Link to={"search"} className='flex items-center gap-2 cursor-pointer'>
                        <div className={`text-3xl ${color === "light" ? "text-black" : "text-white"}`}>
                            {
                                location.pathname === "/search" ? <span className='text-2xl'><FaSearch /></span> : <span className='text-2xl'><CiSearch /></span>
                            }
                        </div>
                        <div className={`text-xl hidden lg:block font-sans ${color === "light" ? "text-black" : "text-white"}`}>
                            <div>{
                                location.pathname === "/search" ? <span className='text-lg font-bold'>Search</span> : <span className='text-lg'>Search</span>
                            }</div>
                        </div>
                    </Link>

                    {/* //create  */}

                    <Link to={"create"} className='flex items-center gap-2 cursor-pointer' onClick={() => setshowCreate(true)}>
                        <div className={`text-3xl ${color === "light" ? "text-black" : "text-white"}`}>
                            {
                                location.pathname === "/create" ? <span className='text-2xl'><BsClipboard2PlusFill /></span> : <span className='text-2xl'><BsClipboard2Plus /></span>
                            }
                        </div>
                        <div className={`text-xl hidden lg:block font-sans ${color === "light" ? "text-black" : "text-white"}`}>
                            <div>{
                                location.pathname === "/create" ? <span className='text-lg font-bold'>Create</span> : <span className='text-lg'>Create</span>
                            }</div>
                        </div>
                    </Link>

                    {/* //trende */}

                    <Link to={"/trend"} className='flex items-center gap-2 cursor-pointer'>
                        <div className={`text-3xl ${color === "light" ? "text-black" : "text-white"}`}>
                            {
                                location.pathname === "/trend" ? <span className='text-2xl'><BsGraphUpArrow /></span> : <span className='text-2xl'><GoGraph /></span>
                            }
                        </div>
                        <div className={`text-xl hidden lg:block font-sans ${color === "light" ? "text-black" : "text-white"}`}>
                            <div>{
                                location.pathname === "/trend" ? <span className='text-lg font-bold'>Trends</span> : <span className='text-lg'>Trends</span>
                            }</div>
                        </div>
                    </Link>


                    {/* // profile  */}

                    <div className='flex items-center gap-2 cursor-pointer' onClick={hendleRefresh}>
                        <div className={`text-3xl ${color === "light" ? "text-black" : "text-white"}`}>
                            {
                                location.pathname === `/${user._id}/profile` ? (user?.profileImage ? (<div className=' w-7 h-7 rounded-full overflow-hidden border-2'><img src={user?.profileImage} alt="" className='w-full h-full object-cover object-center' /></div>) : (<PiUserCircleThin />)) : (user?.profileImage ? (<div className='w-7 h-7 rounded-full overflow-hidden'><img src={user?.profileImage} alt="" className='w-full h-full object-cover object-center' /></div>) : (<PiUserCircleThin />))
                            }
                        </div>
                        <div className={`text-xl hidden lg:block font-sans ${color === "light" ? "text-black" : "text-white"}`}>
                            <div >{
                                location.pathname === `/${user._id}/profile` ? <span className='text-lg font-bold'>Profile</span> : <span className='tet-lg'>Profile</span>
                            }</div>
                        </div>
                    </div>
                </div>
            </div>
            {
                showcomment && <div className={`absolute top-0 left-0 z-20 ${color === "light" ? "bg-slate-300" : "bg-slate-950"} bg-opacity-80`}><ShowComment selectPostcomment={selectPostcomment} /></div>
            }
            {
                ispopup && <div className={`absolute top-0 left-0 z-50 ${color === "light" ? "bg-slate-300" : "bg-slate-950"} bg-opacity-30`}>
                    <Popup />
                </div>
            }
            {
                showCreate && <div className={`absolute top-0 left-0 z-30 ${color === "light" ? "bg-slate-300" : "bg-slate-950"} bg-opacity-80`}>
                    <Create />
                </div>
            }
        </div>
    )
}

export default Home
