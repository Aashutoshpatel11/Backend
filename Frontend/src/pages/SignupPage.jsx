import React from 'react'
import { NavLink } from 'react-router'

function SignupPage() {
  return (
    <div className='h-screen w-screen flex justify-center items-center bg-cover bg-base-300 bg-linear-to-r from-base-300 to-base-100'>
        <div className='border border-info/10 shadow-info/10 shadow-md p-10 h-full w-lg rounded-2xl' >
            <progress className="progress w-full"></progress>
            <div>
                <p className='text-sm text-white/50' >start for free</p>
                <h1 className='text-3xl font-bold' >Create new account</h1>
                <p className='text-sm text-white/50' >already a member?  
                <NavLink 
                className='link link-info'
                to={'/login'}
                >Login</NavLink> </p>
            </div>
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Fullname</legend>
                <input type="text" className="input w-full " placeholder="Type here" />
            </fieldset>
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Email</legend>
                <input type="text" className="input w-full " placeholder="Type here" />
            </fieldset>
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Username</legend>
                <input type="text" className="input w-full " placeholder="Type here" />
            </fieldset>
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Password</legend>
                <input type="text" className="input w-full " placeholder="Type here" />
            </fieldset>
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Profile Picture</legend>
                <input type="file" className="file-input w-full file-input-info " />
            </fieldset>
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Cover Image</legend>
                <input type="file" className="file-input w-full file-input-info " />
            </fieldset>
            <button 
            className='btn btn-soft btn-info mt-5' 
            disabled={false}
            >submit</button>
        </div>
    </div>
  )
}

export default SignupPage