import { readCarpetsService, readCarpetByFieldService } from '@/server/BL/services/carpet.service';
import { connectToMongo } from '@/server/connectToMongo';
import style from './style.module.css';
import { authAction } from '@/server/BL/actions/login.action';
import { readUserByFieldService } from '@/server/BL/services/user.service';
import ColorChanger from '@/components/Color';

export default async function Page({ params: { user } }) {
   await connectToMongo();
   const isUser = await authAction();
   const decodedUser = decodeURIComponent(user);

   let currentUser = await readUserByFieldService({ email: decodedUser });
   console.log({ currentUser });
   const simplifiedUser = {
      username: currentUser.username,
      password: currentUser.password,
      email: currentUser.email,
      colorWeaknesses: currentUser.colorWeaknesses.map(weakness => ({
         background_color: weakness.background_color,
         font_color: weakness.font_color
      }))
   };
   return (
      <>
         {isUser ? (
            <div className={style.container}>
               <ColorChanger user={simplifiedUser} />
            </div>
         ) : (
            <h1>no exist!!!</h1>
         )}
      </>
   );
}
