import React, { useContext, useEffect } from 'react'
import { StoreContext } from '../context/storeContext'
import { PiUserCircleThin } from 'react-icons/pi';

function Notification() {

  const { user, shownotification, setshownotification, url, notificationCount, setnotificationCount, lengthCount, setlengthCount, notificationLength, setnotificationLength } = useContext(StoreContext)

  useEffect(() => {

    const setnotification = async () =>{
      try {
        const res = await fetch(`${url}/api/user/setnotification`,{
          method : "POST",
          credentials : "include",
          headers : {
            'Content-Type' : "application/json"
          },
          body : JSON.stringify({count : lengthCount})
        })

        const data = await res.json()
        if(data.success){
          setnotificationCount(0)
          setnotificationLength(data.notificationLength)
          setlengthCount(data.notification.length)
          setshownotification(data.notification.reverse())
        }
      } catch (error) {
        console.log("setnotification", error)
      }
    }
    if(lengthCount > 0){
      setnotification()
    }
  }, [])
  return (
    <div className='w-screen h-full'>
      <div className='container w-full h-full mx-auto'>
        <h1 className='max-h-[10%] min-h-[10%] text-3xl font-bold py-8 hidden md:block px-4'>Notification</h1>

        <div className='max-h-[100%] min-h-[100%] overflow-y-scroll'>
          {
            shownotification ? (shownotification.map((item, index) => {
              return <div key={index} className='flex gap-4 items-center py-4 px-4'>
                <div>{item.userImage ? <div className='w-12 h-12 rounded-full border overflow-hidden'><img src={item.userImage} alt="image" className='w-full h-full object-center object-cover' /></div> : <div className='text-6xl'><PiUserCircleThin /></div>}</div>
                <div>{item.message || item}</div>
              </div>
            })) : (<div>No notification</div>)
          }
        </div>

      </div>
    </div>
  )
}

export default Notification
