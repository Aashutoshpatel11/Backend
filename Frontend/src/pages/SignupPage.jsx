import React, { useState } from 'react'
import { Navigate, NavLink, useNavigate } from 'react-router'
import { useForm } from "react-hook-form"
import axios from 'axios'
import toast, {Toaster} from 'react-hot-toast'

function SignupPage() {
    const navigate = useNavigate()
    const [progress, setProgress] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const { register, handleSubmit, formState: { errors, isValid }} = useForm({mode:"onChange"})
    // console.log("URL::", import.meta.ENV.VITE_SERVER_URL);

    const formData = new FormData()

    const registerUser = async(data) => {
        formData.append( "fullname" , data.fullname )
        formData.append( "username" , data.username )
        formData.append( "email" , data.email )
        formData.append( "password" , data.password )
        formData.append( "avatar" , data.profile[0] )
        formData.append( "coverImage" , data.coverImage[0] )
        try {
            setErrorMessage("")
            setProgress(true)
            // toast.loading('Registering User...');
            const response = await axios.post(`http://localhost:5400/api/v1/user/register`, formData)
            console.log(response);
            // toast.success('User Registered');
            if(response){
                navigate('/login')
            }
            return response
        } catch (error) {
            setErrorMessage(error.message)
            setProgress(false)
            // toast.error('User Not Registered...');
            console.log("ERROR REGISTERING USER::", error.message);
            throw new Error(error)
        }
    }

    const onSubmit = (data) => {
        registerUser(data)
    }

  return (
    <div className='h-screen w-screen flex justify-center items-center bg-cover bg-base-300 bg-linear-to-r from-base-300 to-base-100'>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='border border-info/10 shadow-info/10 shadow-md p-10 h-full w-lg rounded-2xl' >
                {progress? <progress className="progress w-full"></progress> : <div className='h-2 w-full' ></div>}
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
                    <legend className="fieldset-legend flex justify-center ">Fullname
                        {errors.fullname && <span className='text-xs text-white/50' >*This field is required</span>}
                    </legend>
                    <input 
                    {...register("fullname", { required: true })}
                    type="text" className="input w-full " placeholder="Type here" />
                </fieldset>

                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Email
                        {errors.email && <span className='text-xs text-white/50' >*This field is required</span>}
                    </legend>
                    <input
                    {...register("email", { required: true })} type="email" className="input w-full " placeholder="Type here" />
                </fieldset>

                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Username
                        {errors.username && <span className='text-xs text-white/50' >*This field is required</span>}
                    </legend>
                    <input
                    {...register("username", { required: true })} type="text" className="input w-full " placeholder="Type here" />
                </fieldset>

                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Password
                        {errors.password && <span className='text-xs text-white/50' >*minimum length is 8</span>}
                    </legend>
                    <input
                    {...register("password", { required: true, minLength: 8 })} type="text" className="input w-full " placeholder="Type here" />
                </fieldset>

                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Profile Picture
                        {errors.profile && <span className='text-xs text-white/50' >*This field is required</span>}
                    </legend>
                    <input
                    {...register("profile", { required: true })} type="file" className="file-input w-full file-input-info " />
                </fieldset>

                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Cover Image
                        {errors.coverImage && <span className='text-xs text-white/50' >*This field is required</span>}
                    </legend>
                    <input
                    {...register("coverImage", { required: true })} type="file" className="file-input w-full file-input-info " />
                </fieldset>

                <div className='flex mt-5 justify-between items-center ' >
                    <button 
                    className='btn btn-soft btn-info' 
                    disabled={!isValid}
                    >submit</button>
                    <div className='h-full w-full flex justify-center items-center px-2 text-error text-xs font-semibold ' >{`${errorMessage}`}</div>
                </div>
            </div>
        </form>
        <Toaster />
    </div>
  )
}

export default SignupPage