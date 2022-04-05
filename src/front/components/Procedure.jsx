import React, {useState, useContext, useRef, useEffect} from 'react';

import {SocketContext} from '../api/dbSockets';

const Procedure = () => {
    const socket = useContext(SocketContext);
    const [genre ,setGenre] = useState('');
    const [pushFlag ,setPushFlag] = useState(false);
    const isInitialMount = useRef(true);

    const handleChange = (e) => {
        const target = e.target;
        setGenre(target.value);
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        setPushFlag(true);
    }

    useEffect(() => {
        socket.emit("selectTable", 'SoldGenres');
    },[]);
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (pushFlag){
                socket.emit('startProcedure',genre);
                setPushFlag(false);
            }
        }
    },[pushFlag, socket, genre]);
    return (
        <div className="container">
            <div className="procedure">
                <p> Укажите жанр, чтобы узнать самую продаваемую книгу этого жанра.</p>
                <form  onSubmit={handleSubmit} >
                    <label>Выберите жанр</label><br/>
                    <input type = "text"
                           name="genre"
                           id="genre"
                           onChange={handleChange}
                    />
                    <input type = "submit"
                           name="submit"
                           id="submit"
                           value="Отправить"
                           className="loginSubmit"
                    />
                </form>
            </div>


        </div>
    )
}
export default Procedure;