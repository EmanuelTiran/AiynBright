"use server"

import { connectToMongo } from "@/server/connectToMongo"
import { createProductService, updateProductByFieldService } from "../services/product.service"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"


export const createCarpetAction = async (fd) => {
   let body = Object.fromEntries(fd)
   const images = [body.image1, body.image2, body.image3];
   console.log({ images });
   body.images = images;
   console.log(body);
   if (!body.inStock) {
      body.inStock = 100;
   }
   try {
      await connectToMongo()
      const newCarpet = await createProductService(body)
      console.log(newCarpet.toObject());
      revalidatePath('/carpet')
   } catch (error) {
      console.log({ error });
   }
   // redirect('/')
}

export const updateCarpetAction = async (fd) => {
   let body = Object.fromEntries(fd)
   if (!body.id) {
      console.log("safdsfc")
      createCarpetAction(fd);
      return
   }

   // const images = [body.image1? body.image1: "",body.image2 ? body.image2 : "",body.image3? body.image3 : ""];
   // body.images = images;
   const newBody = getNonEmptyFields(body)
   console.log(newBody);
   try {
      await connectToMongo()
      const updatedProduct = await updateProductByFieldService({ _id: body.id }, { $set: newBody })
      console.log(updatedProduct.toObject());
      revalidatePath('/carpet')
   } catch (error) {
      console.log({ error });
   }
   // redirect('/')
}

export const saveCookie = async (bla) => {
   console.log("cookies:", cookies().get("name"))

}




function getNonEmptyFields(obj) {
   const newObj = {};

   for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
         const value = obj[key];

         // Check if the value is not null, undefined, an empty string, an empty array, or an empty object
         if (value !== null && value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true) && (typeof value === 'object' ? Object.keys(value).length > 0 : true)) {
            newObj[key] = value;
         }
      }
   }

   return newObj;
}
