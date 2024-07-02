"use server"
import { connectToMongo } from "@/server/connectToMongo"
import { cookies } from 'next/headers'
import { redirect } from "next/navigation";
import { readUserByFieldService } from "../services/user.service";
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET
const EMAIL_ADMIN = process.env.EMAIL_ADMIN
const PASSWORD_ADMIN = process.env.PASSWORD_ADMIN


export async function generate(user) {
    let token = jwt.sign(user, SECRET, { expiresIn: "200m" });
    return `Bearer ${token}`
}

export const loginAction = async (fd) => {
    "use server"
    let body = Object.fromEntries(fd)
    const user = { email: body.email, password: body.password }
    const newU = await readUserByFieldService(user)
    let token;
    try {
        if (newU) {
            token = await generate(user);
            cookies().set('token', token);
            return { success: true ,newU: newU.email };
        } else {
            console.error('Could not create new user');
            return { success: false, message: 'Your details are invalid' };
        }
    } catch (error) {
        console.log({ error });
        return { success: false, message: 'An error occurred' };
    }
}


export async function authAction() {
    "use server"
    try {
        let token = cookies().get('token');
        if (!token) throw "no token provided"
        if (!token.value) return false;
        token = token.value.split('Bearer ')[1] || "null";
        const userFromToken = jwt.verify(token, SECRET);
        console.log({ userFromToken })
        if (!userFromToken) throw "not correct"
        return { isUser: true, userToken: userFromToken };
    }
    catch (e) {
        console.log(e);

    }
}

