"use server"
import { connectToMongo } from "@/server/connectToMongo"
import { cookies } from 'next/headers'
import { redirect } from "next/navigation";
import { createUserService } from "../services/user.service";
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET
const EMAIL = process.env.EMAIL_USER
const PASSWORD = process.env.PASSWORD_USER
const cookieStore = cookies()

export async function generate(user) {
    let token = jwt.sign(user, SECRET, { expiresIn: "200m" });
    return `Bearer ${token}`
}

export const signAction = async (fd) => {
    "use server"
    let body = Object.fromEntries(fd)
    connectToMongo()
    let user = await createUserService(body);
    user = { email: user.email, password: user.password }
    let token;
    token = await generate(user);
    cookies().set('token', token)
    redirect('/user');
}


export async function authAction() {
    "use server"
    try {
        let token = cookies().get('token');
        if (!token) throw "no token provided"
        if (!token.value) return false;
        token = token.value.split('Bearer ')[1] || "null";
        const userFromToken = jwt.verify(token, SECRET);
        if (!userFromToken) throw "not correct"
        if (userFromToken.email == EMAIL && userFromToken.password == PASSWORD) {
            return true;
        }
        else {
            cookies().delete('token')
            // redirect('/admin/');
            return false;
        }
    }
    catch (e) {
        console.log(e);

    }
}