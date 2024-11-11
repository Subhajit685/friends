import React, { useContext, useEffect, useState } from 'react'
import { GoHome } from "react-icons/go";
import { GoHomeFill } from "react-icons/go";
import { FaRegUserCircle } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { StoreContext } from '../context/storeContext';
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




function LeftSidebar() {
    const { color, url, setuser, setcolor, showCreate, setshowCreate, user, profiledata, notificationCount, setnotificationCount } = useContext(StoreContext)
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


    return (

        <div className='h-screen mx-auto px-4 flex flex-col items-center justify-between py-8'>

            <div className='flex flex-col items-center gap-24'>
                <div className={`${color === "light" ? "text-black" : "text-white"} text-4xl font-bold`}>Logo</div>

                <div className={`flex flex-col gap-8`}>

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

                    {/* //trende */}

                    {/* <Link to={"/trend"} className='flex items-center gap-2 cursor-pointer'>
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
                    </Link> */}

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

                    {/* // profile  */}

                    <div className='flex items-center gap-2 cursor-pointer' onClick={hendleRefresh}>
                        <div className={`text-3xl ${color === "light" ? "text-black" : "text-white"}`}>
                            {
                                location.pathname === `/${user._id}/profile` ? <span className='text-2xl'><FaUserCircle /></span> : <span className='text-2xl'><FaRegUserCircle /></span>
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


            <div className={`text-3xl ${color === "light" ? "text-black" : "text-white"} cursor-pointer relative`} onClick={() => setsetting(!setting)}>
                {
                    location.pathname === "/setting" ? <IoSettingsSharp /> : <IoSettingsOutline />
                }
                {
                    setting && <div className={`absolute bottom-0 left-10 w-32 ${color === "light" ? "bg-white" : "bg-slate-800 shadow-slate-500"} shadow-md rounded-md flex flex-col items-center justify-center z-30`}>

                        <div className='text-xl py-2' onClick={hendleLogout}>Logout</div>

                        <div className={`${color === "light" ? "bg-slate-300" : "bg-slate-500"} w-full h-px`}></div>

                        <div className='text-xl py-2' onClick={chengeTheam}>{color === "light" ? "Dark" : "Light"}</div>

                        <div className={`${color === "light" ? "bg-slate-300" : "bg-slate-500"} w-full h-px`}></div>

                        <div className='text-xl py-2' onClick={() => setsetting(!setting)}>Close</div>
                    </div>
                }
            </div>

        </div>
    )
}

export default LeftSidebar
