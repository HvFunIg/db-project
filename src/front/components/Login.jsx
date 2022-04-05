import React, {useState, useContext} from 'react';
import '../css/login.css';
import {SocketContext} from '../api/dbSockets';
import { Link } from 'react-router-dom';


const Login = () => {
    const socket = useContext(SocketContext);

    const [username ,setUsername] = useState('');
    const [password ,setPassword] = useState('');
    const [isConnected ,swapConnect] = useState(false);

    const connect = async (e) => {
        e.preventDefault();
        socket.emit('userLogin', {login: username, password: password});
    };
    const handleChange = (e) => {
        const target = e.target;
        if (target.name ==='login')
            setUsername(target.value);
        else if (target.name ==='password')
            setPassword(target.value);
    }

    return (
        <div className="container">
            {isConnected
                ?
                <Link className="startWork" to="/tables">Начать работу</Link>
                :
                <form className="loginForm " onSubmit={connect}>
                    <h3 className="loginH">Авторизируйтесь для входа в систему</h3>
                    <label htmlFor="login">Введите логин</label>
                    <input type = "text"
                           id="login"
                           name="login"
                           placeholder="Логин"
                           onChange={handleChange}
                           className="loginInput"
                    >
                    </input>
                    <label htmlFor="login">Введите пароль</label>
                    <input type = "password"
                           name="password"
                           id="password"
                           placeholder="Пароль"
                           onChange={handleChange}
                           className="loginInput"
                    />

                    <input type = "submit"
                           value="Войти"
                           className="loginSubmit"
                    />

                </form>
            }
        </div>
    )
}
/*
Login.propTypes = {
    setToken: PropTypes.func.isRequired
}*/
export default Login;

