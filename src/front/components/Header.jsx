import React, {useState, useContext, useCallback, useEffect, useLayoutEffect} from 'react';

import '../css/login.css'
import {SocketContext} from '../api/dbSockets';
import {Link} from "react-router-dom";
import DBTables from "./DBTables";
import {Dropdown} from "semantic-ui-react";

const Header = () => {
    const [user,setUser] = useState(window.sessionStorage.getItem('username'));
    const socket = useContext(SocketContext);

    const [dropdownVisible, setVisible] = useState(false);
    const disconnect = () => {
        window.sessionStorage.clear();
        socket.emit('userDisconnect');
        setUser('');
    };
    const handleDropdown = () =>{
        setVisible (!dropdownVisible);
    }
    useLayoutEffect(() => {
        socket.on('userConnected',(data) => {
            //setUser(window.sessionStorage.getItem('username'));
        });

    });
    return (
            <div className="header">

                {user ?
                    <div className="container wide">
                        {user !== 'user4'?
                            <>
                                <h2> Выберите таблицу для работы:</h2>
                                <DBTables />
                            </>
                            :
                            <div></div>
                        }

                        <div className="userAvatar">
                            <p>Вы зашли как </p>
                            <div className="container">
                                <button onClick={handleDropdown}
                                        className="dropdown container">
                                    <p className="userName">{user}</p>
                                    <div className="dropdown-icon"></div>
                                </button>
                            </div>
                            {dropdownVisible ?
                                    <button className="dropdownItem"
                                            onClick={disconnect}
                                    > Выйти
                                    </button>
                                    : ''
                                }

                        </div>

                    </div>
                     :
                    <Link to={"/login"} >
                        <button type="button" className="button" >Авторизироваться</button>
                    </Link>
                }
            </div>
    )
}

export default Header;

