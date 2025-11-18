import React from 'react'
import { NavLink, useNavigate } from 'react-router'
import { useForm } from "react-hook-form"
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../store/authSlice'

function LoginPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit, formState: { errors, isValid }} = useForm({mode:"onChange"})

    const loginUser = async (data) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/user/login`, data, {withCredentials: true})
            console.log("LOGIN RESPONSE", response);
            if(response){
                dispatch(login(response.data.data))
                navigate('/')
            }
            return response
        } catch (error) {
            console.log("LOGGING IN::ERROR::", error.message);
            throw new Error(error)
        }
    }

    const onSubmit = (data) => {
        loginUser(data)
    }

  return (
    <div className='h-screen w-screen flex justify-center items-center bg-cover bg-base-300 bg-linear-to-r from-base-300 to-base-100'>
        <div className='border border-info/10 h-full w-lg shadow-info/10 shadow-md p-10 rounded-2xl' >
            <form type="submit" onSubmit={handleSubmit(onSubmit)} >
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
                    <legend className="fieldset-legend">Email</legend>
                    <input 
                    {...register("email", { required: true })}
                    type="email" className="input w-full " placeholder="Type here" />
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Password</legend>
                    <input 
                    {...register("password", { required: true })}
                    type="text" className="input w-full " placeholder="Type here" />
                </fieldset>
                <button 
                className='btn btn-soft btn-info mt-5' 
                disabled={!isValid}
                >submit</button>
            </form>
        </div>
    </div>
  )
}

export default LoginPage