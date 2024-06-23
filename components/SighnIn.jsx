"use client"
import { signAction } from '@/server/BL/actions/sighnin.action';
import React, { useState } from 'react';
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SighnIn() {

    const path = usePathname()

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-1/3">
                <h2 className="text-2xl font-bold mb-4">Sign In</h2>
                <form action={signAction} className="space-y-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
                        <input
                            name='username'
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                        <input
                            name='password'
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                        <input
                            name='email'
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit">
                            Sign In
                        </button>
                    </div>
                </form>
                <Link
                    href={'login'}
                    // style={{ color: path === href ? '#f7aa05' : '#9da1a2' }}
                    className={path === 'signin' ? 'text-amber-500' : 'text-gray-500'}
                >login</Link>
            </div>
        </div>
    );

}
