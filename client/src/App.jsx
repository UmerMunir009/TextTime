import React from 'react'
import { Navigate, Route ,Routes} from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingPage from './pages/SettingPage'
import ProfilePage from './pages/ProfilePage'
import UserProfilePage from './pages/UserProfilePage'
import { useAuth } from './customHooks/useAuth'
import { authStore } from './store/authStore'
import {Loader} from 'lucide-react'
import { Toaster } from 'react-hot-toast';
import GroupPage from './pages/GroupPage'


const App = () => {
  const {isCheckingAuth}=useAuth()
  const {authUser}=authStore()

  if(isCheckingAuth && !authUser){
    return <div className='flex justify-center items-center h-screen'>
      <Loader className='size-10 text-white animate-spin'/>
    </div>
  }
  return (
    <div>
      <Navbar/>
            <Toaster  />
      <Routes>
        <Route path='/' element={authUser?<HomePage/>:<Navigate to={'/sign-up'}/>}/>
        <Route path='/sign-up' element={!authUser?<SignUpPage/>:<Navigate to={'/'}/>}/>
        <Route path='/login' element={!authUser?<LoginPage/>:<Navigate to={'/'}/>}/>
        <Route path='/settings' element={authUser?<SettingPage/>:<Navigate to={'/sign-up'}/>}/>
        <Route path='/profile' element={authUser?<ProfilePage/>:<Navigate to={'/sign-up'} />}/>
        <Route path='/user-profile' element={authUser?<UserProfilePage/>:<Navigate to={'/sign-up'} />}/>
        <Route path='/groups' element={authUser?<GroupPage/>:<Navigate to={'/sign-up'} />}/>
      </Routes>
    </div>
  )
}

export default App
