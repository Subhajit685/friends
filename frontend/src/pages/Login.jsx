import React, { useContext, useEffect, useState } from 'react'
import { IoMdEyeOff } from "react-icons/io";
import { IoIosEye } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/storeContext';
import Cookie from "js-cookie"
import toast from 'react-hot-toast';

function Login() {

    const {url, setuser, color} = useContext(StoreContext)
    const [show, setshow] = useState(false)
    const [loading, setloading] = useState(false)
    const [data, setdata] = useState({
        email : "", 
        password : "",
    })
    const nevigate = useNavigate()

    const onChenge = (e) =>{
        const {name, value} = e.target
        setdata({...data, [name]:value})
    }

    const hendelLogin = async (e) =>{
        e.preventDefault()
        setloading(true)
        try {
            const res = await fetch(`${url}/api/user/login`,{
                method : "POST",
                credentials : "include",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(data)
            })

            const data1 = await res.json()
            setloading(false)
            if(data1.success){
                setuser(data1.user)
                nevigate("/")
            }
            else{
                toast.error(data1.message)
            }
        } catch (error) {
            console.log("login", error)
        }
    }

    return (
        <div className={`h-screen w-screen ${color === "light" ? "bg-slate-100" : "bg-slate-900"} flex justify-center items-center px-4 md:px-0`}>
            <div className={`${color === "light" ? "bg-white text-black" : "bg-slate-800 text-white"} w-96 shadow-md rounded-md`}>
                <form className='p-4' onSubmit={hendelLogin}>
                    <h1 className={`text-center text-2xl font-bold ${color === "light" ? "text-black" : "text-white"}`}>Login</h1>
                    <div className='flex flex-col py-2 gap-1'>
                        <label htmlFor="email" className={`${color === "light" ? "text-black" : "text-white"}`}>Email</label>
                        <input type="email" name='email' value={data.email} onChange={onChenge} placeholder='enter your email' className='border py-1 px-4 rounded-md outline-none bg-transparent' />
                    </div>
                    <div className='flex flex-col py-2 gap-1'>
                        <label htmlFor="password" className={`${color === "light" ? "text-black" : "text-white"}`}>Password</label>
                        <div className='flex border items-center justify-between px-4 rounded-md'>
                            <input type={show ? "text" : "password"} name='password' value={data.password} onChange={onChenge}  placeholder='*********' className='py-1 outline-none w-full bg-transparent' />
                            <div className={`text-2xl cursor-pointer ${color === "light" ? "text-black" : "text-white"}`} onClick={() => setshow(!show)}>
                                {
                                    show ? <IoIosEye /> : <IoMdEyeOff />
                                }
                            </div>
                        </div>
                    </div>
                    <div className='py-2'>
                        <button className='bg-blue-600 w-full p-2 text-white rounded-md'>{loading ? "Processing..." : "Login"}</button>
                    </div>

                    <div className='flex gap-1'>
                        <p>Create an account click here</p>
                        <Link to={"/signup"} className='text-red-500 hover:underline'>Sign up</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
