import { connectToMongo } from '@/server/connectToMongo';
import style from './style.module.css';
import { authAction } from '@/server/BL/actions/login.action';
import { readUserByFieldService } from '@/server/BL/services/user.service';
import ColorChanger from '@/components/Color';
import DetailUser from '@/components/DetailUser';

export default async function Page() {
   await connectToMongo();
   const authData = await authAction();
   console.log({authData})
   if (!authData || !authData.userToken) {
      return (
         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
         <h1 className='shake text-orange-200 font-thin text-4xl'>User does not exist or is not authenticated!</h1>
       </div>      );
   }

   const { email } = authData.userToken;
   const { isUser } = authData;
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
