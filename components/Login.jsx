import { loginAction } from '@/server/BL/actions/login.action'
import React from 'react'

export default function Login() {
    return (
<div className="flex justify-center items-center h-screen">
    <form className="w-1/3" action={loginAction}>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 space-y-4">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                <input 
                name='email'
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email" value="hob@example.com" />
            </div>
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                <input 
                name='password'
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Password" value="5858" />
            </div>
            <div className="flex items-center justify-center">
                <button className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                    Login
                </button>
            </div>
        </div>
    </form>
</div>
    )
}
