import React, {useState, useLayoutEffect, useContext} from 'react';
import {Route,Switch} from "react-router-dom";
import {SocketContext} from './api/dbSockets';

import './css/index.css';
import DataTable from "./components/DataTable";
import Header from "./components/Header";
import Login from "./components/Login";
import ErrorConsole from "./components/ErrorConsole";
import Procedure from "./components/Procedure";
import useToken from './js/useToken.js';
import DBTables from "./components/DBTables";


const App = () => {
    const socket = useContext(SocketContext);
    //const { token, setToken } = useToken();
    const [ token, setToken ] = useState(window.sessionStorage.getItem('username'));
    //<Route path ="/" component={Login} />
    console.log(token);

    useLayoutEffect(() => {
        socket.on('userConnected',(data) => {
            window.sessionStorage.setItem('username',data);
            socket.emit('addActiveUser',data);
            setToken(data);
        });
        socket.on('userDisconnected',(data) => {
            console.log("App заметил, что " + data + " вышел");
            socket.emit('deleteActiveUser',data);
            setToken('');
        });
        return () => {
            // before the component is destroyed
            // unbind all event handlers used in this component
            socket.off("userConnected");
            socket.off("userDisconnected");
        };
    });
    if(!token) {
        return (
            <>
                <Login />
                <ErrorConsole/>
            </>
        )
    }
    if (token === 'user4'){
        return(
            <>
                <Header/>
                <DataTable editable={false}/>
                <Procedure/>

                <ErrorConsole/>
            </>
        )
    }
    else
    return (
        <>
          <Header/>
          <DataTable editable={true}/>
            <ErrorConsole/>
        </>
  );
}
export default App;
