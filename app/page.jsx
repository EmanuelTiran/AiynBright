import { connectToMongo } from '@/server/connectToMongo'

import CurrentTime from '@/components/CurrentTime'
import ImageCarousel from '@/components/ImageCarousel'
import SighnIn from '@/components/SighnIn'
import VisionImprovementHub from '@/components/VisionImprovementHub '
import { authAction } from '@/server/BL/actions/login.action'
import Login from '../components/Login'

export default async function Home() {

  await connectToMongo()


  const isUser = await authAction();

  return (
    <div>
      <ImageCarousel >
        <VisionImprovementHub />
      </ImageCarousel >
      {isUser ? (
        <Login />
      ) : (
        <SighnIn />
      )}
      <CurrentTime />  
    </div>
  )
}
