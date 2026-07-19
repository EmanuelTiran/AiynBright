import React, { createContext, useState } from 'react';

const MyContext = createContext();

const MyProvider = ({ children }) => {
    const [data, setData] = useState('');

    const updateData = async () => {
        setData('gnb');
    };

    return (
        <MyContext.Provider value={{ data, updateData }}>
            {children}
        </MyContext.Provider>
    );
};

export { MyContext, MyProvider };