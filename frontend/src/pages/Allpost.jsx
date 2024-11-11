import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../context/storeContext'
import Showpost from '../components/Showpost'
import Spinner from '../components/Spinner'

function Allpost() {
  const { color, url, allpost, setallpost, setuser, setcolor, showCreate, setshowCreate, user, profiledata, notificationCount, setnotificationCount, getPost, setgetpost } = useContext(StoreContext)
  const [loading, setloading] = useState(false)

  const showllPost = async () => {
    setloading(true)
    try {
      const res = await fetch(`${url}/api/post/allpost`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      })

      const data = await res.json()
      setloading(false)
      if (data.success) {
        setallpost(data.allPost)
      }
    } catch (error) {
      console.log("allpost", error)
    }
  }

  useEffect(() => {
    if(getPost){
      showllPost()
      setgetpost(false)
    }
  }, [])
  return (
    <div className={`h-full overflow-y-auto`}>


      {
        loading ? <div className='flex items-center justify-center'><Spinner/></div> : allpost?.map((post, index) => {
          return <Showpost key={index} post={post} />
        })
      }


    </div>
  )
}

export default Allpost
