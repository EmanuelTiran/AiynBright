import { NextResponse } from "next/server";


export const PUT = async (req, { params }) => {
try {
   const body = await req.json();
   const { id } = params;
   const searchParams = Object.fromEntries(req.nextUrl.searchParams)    //query
   return NextResponse.json({ body, id, searchParams })
} catch (error) {
   console.log(error);
}
 }