"use client"

import { createCarpetAction, updateCarpetAction } from "@/server/BL/actions/carpet.action"
import style from "./style.module.css"

export default function ProductsForm() {


  return (
   <div className={`${style.container} p-4 `}>
        <h1 className="text-2xl font-bold mb-4">Update Items</h1>
        
        <form action={updateCarpetAction} className="space-y-4">
        {/* <form action={createCarpetAction} className="space-y-4"> */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Product ID</label>
          <input
            type="text"
            name='id'
            className={`mt-1 block w-full rounded-md shadow-sm`}
            placeholder="In case you want to update an existing product"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name='name'
            className={`mt-1 block w-full rounded-md shadow-sm`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Slug</label>
          <input
            type="text"
            name='slug'
            className={`mt-1 block w-full rounded-md shadow-sm`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Size</label>
          <input
            type="text"
            name='size'
            className={`mt-1 block w-full  rounded-md shadow-sm`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Color</label>
          <input
            type="text"
            name='color'
            className={`mt-1 block w-full  rounded-md shadow-sm`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name='description'
            className={`mt-1 block w-full rounded-md shadow-sm`}
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            name='category'
            className={`mt-1 block w-full rounded-md shadow-sm`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name='price'
            className={`mt-1 block w-full  rounded-md shadow-sm`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Instock</label>
          <input
            type="number"
            name='inStock'
            className={`mt-1 block w-full  rounded-md shadow-sm`}
          />
        </div>
        <div>
        <div>
              <label className="block text-sm font-medium text-gray-700">Image1 URL</label>
              
          <input
            type="text"
            name='image1'
            className={`mt-1 block w-full  rounded-md shadow-sm`}
          />
        </div>
        <div>
              <label className="block text-sm font-medium text-gray-700">Image2 URL</label>
              
          <input
            type="text"
            name='image2'
            className={`mt-1 block w-full  rounded-md shadow-sm`}
          />
        </div>
        <div>
              <label className="block text-sm font-medium text-gray-700">Image3 URL</label>
              
          <input
            type="text"
            name='image3'
            className={`mt-1 block w-full  rounded-md shadow-sm`}
          />
        </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600"
          >
            Add/Updae
          </button>
        </div>
      </form>
    </div>
  )
}
