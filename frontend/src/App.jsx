import { Navigate, Route, Routes } from "react-router-dom"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import Allpost from "./pages/Allpost"
import { useContext, useEffect } from "react"
import { StoreContext } from "./context/storeContext"
import Search from "./pages/Search"
import Trend from "./pages/Trend"
import Create from "./pages/Create"
import Message from "./pages/Message"
import Notification from "./pages/Notification"
import EditProfile from "./pages/EditProfile"
import {Toaster} from "react-hot-toast"


function App() {

  const { user, getUser, color, getNotification } = useContext(StoreContext)

  useEffect(() => {
    getUser()
    getNotification()
  }, [])


  return (
    <>
      <Routes>
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to={"/"} />}></Route>
        <Route path="/login" element={!user ? <Login /> : <Navigate to={"/"} />}></Route>
        <Route path="/" element={user ? <Home /> : <Navigate to={"/login"} />}>
          <Route path=":id/profile" element={<Profile />} />
          <Route path="" element={<Allpost />} />
          <Route path="search" element={<Search />} />
          <Route path="trend" element={<Trend />} />
          <Route path="create" element={<Allpost />} />
          <Route path="message" element={<Message />} />
          <Route path="notification" element={<Notification />} />
          <Route path="editprofile" element={<EditProfile />} />
        </Route>
      </Routes>
      <Toaster/>
    </>
  )
}

export default App
