import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { logout, login } from '../../store/authSlice'
import axios from 'axios'
import { NavLink } from 'react-router'

function Header() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [userStatus, setUserStatus] = useState()
    const status = useSelector( (state) => state.auth.status )
    const user = useSelector( (state) => state.auth.userData )
    // console.log("status", userStatus);
    

    useEffect( () => {
        setUserStatus(status)
    }, [status] )

    // LOUGOUT USER
    const handleLogout = async() => {
        try {
            console.log("HERE");
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/user/logout`,{}, {withCredentials: true})
            console.log("Logout response::", response);
            if(response){
                dispatch(logout())
            }
            return response
        } catch (error) {
            console.log("LOGOUT USER::ERROR::", error.response.data);
            throw new Error(error);
        }
    }

    //CHECK IS USER LOGGED IN
    const getCurrentUser = async() => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/current-user`,{withCredentials: true})
        // console.log("CURRENT USER::", response);
        
        if(response){
          dispatch(login(response.data.data))
        }
        return response
      } catch (error) {
        console.log("ERROR::GET CURRENT USER::", error);
        throw new Error(error.message);
      }
    }
    useEffect(()=> {
      getCurrentUser()
    }, [])

  return (
    <div className="navbar bg-base-300 shadow-sm">
        <div className="flex-1">
            <a className="btn btn-ghost text-xl">Streamly</a>
        </div>
        <div className="flex gap-2">
            <input type="text" placeholder="Search" className="input input-bordered w-56 md:w-auto" />
            <div className="dropdown dropdown-end">
            {status? (
                <div>
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                <img
                    alt="Tailwind CSS Navbar component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
                </div>
                <ul
                    tabIndex="-1"
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                    <li>
                    <NavLink to={`/dashboard/${user._id}`}  className="justify-between">Dashboard
                    </NavLink>
                    </li>
                    <li><button className='hover:bg-error' onClick={()=>handleLogout()} type='button' >Logout</button ></li>
                </ul>
                </div>
            ) : ( 
                <div className='flex justify-center gap-2 items-center h-full' >
                    <button 
                    onClick={() => navigate('/signup')}
                    className='btn btn-sm btn-info btn-ghost'
                    type="button">Signup</button>
                    <button
                    onClick={() => navigate('/login')}
                    className='btn btn-sm btn-info btn-ghost'
                    type='button' >Login</button>
                </div>
             )}
            </div>
        </div>
        </div>
  )
}

export default Header