import React from "react";
import {io} from "socket.io-client";
//import { SOCKET_URL } from "config";


export const socket = io('http://192.168.1.108:8000'); // Адрес и порт сервера
export const SocketContext = React.createContext();