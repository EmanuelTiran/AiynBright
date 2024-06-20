import { readCarpetsService, readCarpetByFieldService } from '@/server/BL/services/carpet.service'
import { connectToMongo } from '@/server/connectToMongo'

import style from './style.module.css'
import { authAction } from '@/server/BL/actions/login.action';
import { readUserByFieldService } from '@/server/BL/services/user.service';



// export async function generateStaticParams() {
//    await connectToMongo()
//    const all = await readProductsService();
//    return all.map((carpet) => ({ slug: carpet.slug }))
// }

export default async function page({ params: { user } }) {
   await connectToMongo()
   const isUser = await authAction();
   const decodedUser = decodeURIComponent(user); // פענוח הפרמטר

   let currentUser = await readUserByFieldService({ email: decodedUser })
   console.log({ currentUser })
   return (<>
      {isUser ?
         <div className={style.container} >
            U  - s - e - r : {currentUser.username}
         </div> : <h1>no exist!!!</h1>}
   </>
   )
}
