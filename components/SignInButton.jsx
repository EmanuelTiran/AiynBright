"use client"
import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
export default function SighnInButton() {
    const { data: session } = useSession()
    const isUserLoggedIn = session && session.user;
    return (
        <div className="flex gap-4 ml-auto">
            {isUserLoggedIn ? (
                <>
                    <p className="text-sky-600">{session.user.name}</p>
                    <button onClick={signOut} className="text-red-600">
                        Sign Out
                    </button>
                </>
            ) : (
                <button onClick={signIn} className="text-green-600">
                    Sign In
                </button>
            )}
        </div>
    )
}
