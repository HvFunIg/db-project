import React from 'react';
import ReactDOM from 'react-dom';
import App from './front/App';
import {BrowserRouter} from "react-router-dom";
import {socket, SocketContext} from "./front/api/dbSockets";

ReactDOM.render(
  <React.StrictMode>
      <BrowserRouter>
          <SocketContext.Provider value={socket}>
          <App />
          </SocketContext.Provider>
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

