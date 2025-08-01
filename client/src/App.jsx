import React from 'react'
import { Navigate, Route ,Routes} from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingPage from './pages/SettingPage'
import ProfilePage from './pages/ProfilePage'
import { useAuth } from './customHooks/useAuth'
import {Loader} from 'lucide-react'


const App = () => {
  const {isCheckingAuth,authUser}=useAuth()

  if(isCheckingAuth && !authUser){
    return <div className='flex justify-center items-center h-screen'>
      <Loader className='size-10 text-white animate-spin'/>
    </div>
  }
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={authUser?<HomePage/>:<Navigate to={'/login'}/>}/>
        <Route path='/sign-up' element={!authUser?<SignUpPage/>:<Navigate to={'/'}/>}/>
        <Route path='/login' element={!authUser?<LoginPage/>:<Navigate to={'/'}/>}/>
        <Route path='/setting' element={authUser?<SettingPage/>:<Navigate to={'/login'}/>}/>
        <Route path='/profile' element={authUser?<ProfilePage/>:<Navigate to={'/login'} />}/>
      </Routes>
    </div>
  )
}

export default App
