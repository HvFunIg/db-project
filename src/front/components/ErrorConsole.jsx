import React, {useState, useContext, useRef, useEffect, useLayoutEffect} from 'react';
import '../css/error.css'

import {SocketContext} from "../api/dbSockets";

const ErrorConsole = () => {
    const socket = useContext(SocketContext);

    const [errLine ,setError] = useState({message:'',code:''});

    const handleMessage = (err) =>{
        console.log(err)
        setError(err);
        setTimeout(() => setError({message:'',code:''}),5000);
    }

    useEffect(() => {
        socket.on('DBError',err => handleMessage(err));
        return () => {

            socket.off('DBError',err => handleMessage(err));


        };
    });

    return (
       <div className="container">
           {errLine.message ? <div className="errLine"> {errLine.message}</div> :''}
       </div>
    )
}

export default ErrorConsole;