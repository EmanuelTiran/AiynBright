
import ColorChanger from '@/components/Color';
import ToLogin from '@/components/ToLogin';
import { authAction } from '@/server/BL/actions/login.action';
import { readUserByFieldService } from '@/server/BL/services/user.service';
import { connectToMongo } from '@/server/connectToMongo'
import { unstable_noStore } from 'next/cache';
import Link from 'next/link'

export default async function page({ params: { detail } }) {

    function extractColors(detail) {
        const colors = detail.split('_');

        return {
            background_color: colors[0],
            font_color: colors[1]
        };
    }
    let colorsUser = extractColors(detail);
  
    const authData = await authAction();

  if (!authData || !authData.userToken) return <ToLogin/>

  const { email } = authData.userToken;

  let currentUser = await readUserByFieldService({ email });
  const simplifiedUser = {
    username: currentUser.username,
    password: currentUser.password,
    email: currentUser.email,
    colorWeaknesses: currentUser.colorWeaknesses.map(weakness => ({
      background_color: weakness.background_color,
      font_color: weakness.font_color
    }))
  };
  unstable_noStore()

  return (
    <div >
      <ColorChanger user={simplifiedUser} colorsUser={colorsUser} />
    </div>
  )
}
