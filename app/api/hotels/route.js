import { readCarpetsService } from "@/server/BL/services/carpet.service";
import { connectToMongo } from "@/server/connectToMongo";
import { NextResponse } from "next/server";

export const GET = async () => {
   try {
      await connectToMongo()
      const carpets = await readCarpetsService()
      return NextResponse.json(carpets)
   } catch (error) {
      console.log(error);
   }
}

export const POST = async () => {

}