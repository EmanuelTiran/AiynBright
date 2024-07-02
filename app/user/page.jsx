import { readCarpetsService, readCarpetByFieldService } from '@/server/BL/services/carpet.service';
import { connectToMongo } from '@/server/connectToMongo';
import style from './style.module.css';
import { authAction } from '@/server/BL/actions/login.action';
import { readUserByFieldService } from '@/server/BL/services/user.service';
import ColorChanger from '@/components/Color';
import DetailUser from '@/components/DetailUser';

export default async function Page() {
   await connectToMongo();
   const { isUser, userToken: { email } } = await authAction();

   let currentUser = await readUserByFieldService({ email });
   const simplifiedUser = {
      username: currentUser.username,
      password: currentUser.password,
      email: currentUser.email,
      colorWeaknesses: currentUser.colorWeaknesses.map(weakness => ({
         background_color: weakness.background_color,
         font_color: weakness.font_color,
         date: weakness.date
      })),
      sizeWeaknesses: currentUser.sizeWeaknesses.map(weakness => ({
         fontSize: weakness.fontSize,
         distance: weakness.distance,
         date: weakness.date
      }))
   };
   return (
      <>
         {isUser ? (
            <DetailUser simplifiedUser={simplifiedUser} />
         ) : (
            <h1>User does not exist!</h1>
         )}
      </>
   );
}
