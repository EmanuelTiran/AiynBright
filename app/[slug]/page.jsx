import { readCarpetsService, readCarpetByFieldService } from '@/server/BL/services/carpet.service'
import { connectToMongo } from '@/server/connectToMongo'

import style from './style.module.css'
import Images from '@/components/Images'
import { readProductByFieldService } from '@/server/BL/services/product.service'
import AddToCartBtn from '@/components/AddToCartBtn'
import Link from 'next/link'


// export async function generateStaticParams() {
//    await connectToMongo()
//    const all = await readProductsService();
//    return all.map((carpet) => ({ slug: carpet.slug }))
// }

export default async function page({ params: { slug } }) {
   await connectToMongo()
   const carpet = await readProductByFieldService({ slug: slug })

   return (
      <div className={style.container} >
         <div className={style.detailCarpet}>
            
            <Images carpet={carpet} className={style.img} />
            <span className={style.details}>
               <h2>{carpet.name}</h2>
               <p className={style.description}>{carpet.description}</p>
               <p className={style.price}>Price: {carpet.price}</p>
               <Link href="/"><button className={style.button}>Back to home</button></Link>
            </span>
            <AddToCartBtn productId={carpet._id}/>
         </div>
      </div>
   )
}
