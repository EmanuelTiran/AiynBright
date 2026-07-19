"use client";
import { authAction, loginAction } from '@/server/BL/actions/login.action';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import Link from 'next/link';
const SECRET = process.env.JWT_SECRET;

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const response = await loginAction(formData);

        if (response.success) {
            setError('');
            let user = "Emanuel tiran";
            window.location.href = `/user`;
        } else {
            setError(response.message);
            alert(response.message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-4">
            <form className="w-full max-w-md" onSubmit={handleSubmit}>
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 space-y-4">
                    <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                        <input
                            name='email'
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                        <input
                            name='password'
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-center">
                        <button className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto" type="submit">
                            Login
                        </button>
                    </div>
                    <div className="text-center mt-4">
                        <Link href={'signin'} className="text-blue-500 hover:underline">Sign In</Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
