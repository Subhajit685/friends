import React, { useContext, useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { StoreContext } from '../context/storeContext';
import Spinner from '../components/Spinner';
import { toast } from "react-hot-toast"
import SuggestionProfile from '../components/SuggestionProfile';


function Search() {
  const { url, color, hendletoFollow, followers, user } = useContext(StoreContext)
  const [search, setsearch] = useState([])
  const [text, settext] = useState("")
  const [loading, setloading] = useState(false)

  const hendleSearch = async () => {
    if (text.trim() !== "") {
      setloading(true)
      try {
        const res = await fetch(`${url}/api/search/search`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ text: text })
        })

        const data = await res.json()
        setloading(false)
        if (data.success) {
          setsearch(data.result)
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        console.log("search", error)
      }
    } else {
      toast.error("Write something")
    }

  }


  return (
    <div className={`h-full w-full ${color === "light" ? "text-black" : "text-white"}`}>


      {/* input */}

      <div className='min-h-[15%] max-h-[15%] flex items-center justify-center'>
        <div className='flex items-center w-[90%] mx-auto border rounded-xl'>
          <input type="text" value={text} onChange={(e) => settext(e.target.value)} className='bg-transparent px-4 py-2 w-full outline-none' placeholder='search here...' />
          <div className='px-4 py-2 text-2xl cursor-pointer' onClick={hendleSearch}>
            <CiSearch />
          </div>
        </div>
      </div>

      {/* show */}

      <div className='min-h-[85%] max-h-[85%] overflow-y-scroll px-0 md:px-8'>

        <div>
          {
            loading ? (<div className='flex justify-center items-center'><Spinner /></div>) : (<div>

              {
                search ? search?.map((User, index) => {
                  return <div key={index}>{
                    User._id.toString() === user._id.toString() ? (<div></div>) : (<SuggestionProfile User={User} />)
                  }</div>
                }) : (<div className='flex justify-center items-center'>No user match</div>)
              }
            </div>)
          }
        </div>
      </div>

    </div>
  )
}

export default Search
