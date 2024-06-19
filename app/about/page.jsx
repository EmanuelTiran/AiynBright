export const metadata = { title: "About" };
import style from './style.module.scss'
export default async function About() {

    return (
        <div className={`${style.contain} `}>
            <div className={style.typingEffect}>
            זה לא אתר אמיתי - אין לנו מה לספר על עצמינו!!!
            </div>
        </div>
    )
}
