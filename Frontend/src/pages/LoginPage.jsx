import React from 'react'
import { NavLink } from 'react-router'

function LoginPage() {
  return (
    <div className='h-screen w-screen flex justify-center items-center bg-cover bg-base-300 bg-linear-to-r from-base-300 to-base-100'>
        <div className='border border-info/10 h-full w-lg shadow-info/10 shadow-md p-10 rounded-2xl' >
            <progress className="progress w-full"></progress>
            <div>
                <p className='text-sm text-white/50' >sign in for free</p>
                <h1 className='text-3xl font-bold' >Sign In</h1>
                <p className='text-sm text-white/50' >didn't have an account?  
                <NavLink 
                className='link link-info'
                to={'/signup'}
                >Signup</NavLink> </p>
            </div>
            <fieldset className="fieldset mt-20">
                <legend className="fieldset-legend">Email/Username</legend>
                <input type="text" className="input w-full " placeholder="Type here" />
            </fieldset>
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Password</legend>
                <input type="text" className="input w-full " placeholder="Type here" />
            </fieldset>
            <button 
            className='btn btn-soft btn-info mt-5' 
            disabled={false}
            >submit</button>
        </div>
    </div>
  )
}

export default LoginPage