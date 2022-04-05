import React from "react";
import styles from "../css/temp.css"
export function Temp() {

    return (
        <div>
            <script src="http://localhost:5000/socket.io/socket.io.js"></script>
            <script src="client.js"></script>

            <div id="log"></div><br/>
            <input type="text" id="input" autofocus/>
            <input type="submit" id="send" value="Send"/>
        </div>
    )
}