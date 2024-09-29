
import React, { useEffect, useState } from 'react';
import style from "./style.module.css"
export default function Popup({ open, setOpen, type }) {
    const [text, setText] = useState('');

    useEffect(() => {
        // טוען את הקובץ txt בצורה דינמית
        fetch(type === 'blur' ? '/blurRules.txt' : '/fieldsRules.txt')
            .then(response => response.text())
            .then(data => setText(data))
            .catch(error => console.error('Error loading blur.txt:', error));
    }, []);

    const handleOutsideClick = () => {
        setOpen(!open);
    };

    const handleInsideClick = (e) => {
        e.stopPropagation();
    };

    return (
        open && (
            <div className={style.outside} onClick={handleOutsideClick}>
                <div className={style.inside} onClick={handleInsideClick}>
                    <div className={style.scrollContent}>
                        {text}
                    </div>
                </div>
            </div>
        )
    )
}
