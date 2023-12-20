import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../security/login/Login'
import Register from '../security/register/Register'
import Home from '../pages/home/Home'
import MyPost from '../pages/myPost/MyPost'

const Routing = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/home' element={<Home />} />
                <Route path='/mesPostes' element={<MyPost />} />
            </Routes>
        </>
    )
}

export default Routing