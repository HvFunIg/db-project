/*** Это кастомный хук для обработки
* токена и последующего ререндера ***/
import { useState } from 'react';

export default function useToken() {
    const getToken = () => {
        //Отправка токена (логин/пароль) в session storage в виде JSON
        const tokenString = window.localStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        return userToken?.token
    };
    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
        //Получение токена в виде JSON
        window.localStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken.token);
    };

    return {
        setToken: saveToken,
        token
    }
}


