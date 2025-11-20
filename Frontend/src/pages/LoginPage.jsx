import React,{ useState} from 'react'
import { NavLink, useNavigate } from 'react-router'
import { useForm } from "react-hook-form"
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../store/authSlice'

function LoginPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [progress, setProgress] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const { register, handleSubmit, formState: { errors, isValid }} = useForm({mode:"onChange"})

    const loginUser = async (data) => {
        try {
            setErrorMessage("")
            setProgress(true)
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/user/login`, data, {withCredentials: true})
            console.log("LOGIN RESPONSE", response);
            if(response){
                dispatch(login(response.data.data))
                navigate('/')
            }
            return response
        } catch (error) {
            setErrorMessage(error.response.data)
            setProgress(false)
            console.log("LOGGING IN::ERROR::", error);
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
                {progress? <progress className="progress w-full"></progress> : <div className='h-2 w-full' ></div>}
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
                    <legend className="fieldset-legend">Email
                        {errors.email && <span className='text-xs text-white/50' >*This field is required</span>}
                    </legend>
                    <input 
                    {...register("email", { required: true })}
                    type="email" className="input w-full " placeholder="Type here" />
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Password
                        {errors.password && <span className='text-xs text-white/50' >*minimum length is 8</span>}
                    </legend>
                    <input 
                    {...register("password", { required: true, minLength: 8 })}
                    type="text" className="input w-full " placeholder="Type here" />
                </fieldset>
                <div className='flex mt-5 justify-between items-center ' >
                    <button 
                    className='btn btn-soft btn-info mt-5' 
                    disabled={!isValid}
                    >submit</button>
                    <div className='h-full w-full flex justify-center items-center px-2 text-error text-xs font-semibold ' >{`${errorMessage}`}</div>
                </div>
            </form>
        </div>
    </div>
  )
}

export default LoginPage