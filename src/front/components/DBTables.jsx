import React, {useState, useContext, useCallback, useEffect} from 'react';

import {SocketContext} from '../api/dbSockets';

const DBTables = () => {
    const socket = useContext(SocketContext);
    const handleClick = (e) =>{
        window.sessionStorage.setItem('activeTable',e.target.value);
        socket.emit('selectTable',e.target.value);
    }

    return (
        <div >
            <div className="container">

                <button className={"navLink"} name = "Genres" onClick={handleClick} value={"Жанры"}> Жанры</button>
                <button className="navLink" name = "Books" onClick={handleClick} value={"Книги"}> Книги</button>
                <button className="navLink" name = "Orders" onClick={handleClick} value={"Заказы"}> Заказы</button>
                <button className="navLink" name = "Order_lines" onClick={handleClick} value={"Строки_заказа"}> Строки заказа</button>
            </div>

        </div>
    )
}

export default DBTables;