import { connectToMongo } from '@/server/connectToMongo'

import style from './style.module.css'
import Images from '@/components/Images'
import AddToCartBtn from '@/components/AddToCartBtn'
import Link from 'next/link'


// export async function generateStaticParams() {
//    await connectToMongo()
//    const all = await readProductsService();
//    return all.map((carpet) => ({ slug: carpet.slug }))
// }

export default async function page({ params: { slug } }) {
   await connectToMongo()

   return (
      <div className={style.container} >
         Slug Params's Example
      </div>
   )
}
