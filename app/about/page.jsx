export const metadata = { title: "About" };
import AboutPage from '@/components/AboutPage';
import style from './style.module.scss'
import RandomCharacterGame from '@/components/RandomCharacterGame';
export default async function About() {

    return (
       <div>
        <AboutPage/>
        {/* <RandomCharacterGame/> */}
       </div>
    )
}
