import { createSlice } from "@reduxjs/toolkit";

let initialState ={
    status: false,
    userData: {}
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => { 
            state.status = true
            state.userData = action.payload
        },
        logout: (state, action) => { 
            state.status = false
            state.userData = {}
        }
    }
})

export const {login, logout} = authSlice.actions
export default authSlice.reducer