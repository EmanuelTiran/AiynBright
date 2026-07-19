import { connectToMongo } from '@/server/connectToMongo';
import style from './style.module.css';
import { authAction } from '@/server/BL/actions/login.action';
import { readUserByFieldService } from '@/server/BL/services/user.service';
import ColorChanger from '@/components/Color';
import DetailUser from '@/components/DetailUser';
import Link from 'next/link';
import ToLogin from '@/components/ToLogin';

export default async function Page() {
   await connectToMongo();
   const authData = await authAction();
   if (!authData || !authData.userToken) return <ToLogin/>


   const { email } = authData.userToken;
   const { isUser } = authData;
   let currentUser = await readUserByFieldService({ email });
   const simplifiedUser = {
      // userId: currentUser._id,
      username: currentUser.username,
      password: currentUser.password,
      email: currentUser.email,
      colorWeaknesses: currentUser.colorWeaknesses.map(weakness => ({
         background_color: weakness.background_color,
         font_color: weakness.font_color,
         date: weakness.date
      })),
      sizeWeaknesses: currentUser.sizeWeaknesses.map(weakness => ({
         eye: weakness.eye,
         fontSize: weakness.fontSize,
         distance: weakness.distance,
         date: weakness.date
      })),
      fieldWeaknesses: currentUser.fieldWeaknesses.map(weakness => ({
        side: weakness.side,
        distance: weakness.distance,
        date: weakness.date
      })),
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
