import React, {useState, useContext, useRef, useEffect, useLayoutEffect} from 'react';
import "../css/table.css"
import {SocketContext} from "../api/dbSockets";
import Modal from "./Modal";
import Canvas from "./Canvas";

const DataRow = ({Drows,colNames}) => {
    const socket = useContext(SocketContext);
    const [editFlag ,setEditFlag] = useState(false);
    const [pushFlag ,setPushFlag] = useState(false);
    const [addFlag ,setAddFlag] = useState(false);
    const [deleteFlag ,setDeleteFlag] = useState(false);
    const [cells ,setCells] = useState(Drows);
    const [rowID ,setRowID] = useState(Drows ? "_"+Drows[0]+Drows[1] : 0);


    const [isModal, setModal] = React.useState(false)
    const onClose = () => setModal(false)
    const [imgURL,setURL] = useState('');

    const isInitialMount = useRef(true);    //чтобы предотвратить запуск useState при маунте

    const importImage = () =>{
        Drows?.forEach((cell,i,Drows) => {
            if ( cell && typeof (cell) === "object"){
                let arrayBufferView = new Uint8Array(cell);
                let blob = new Blob( [ cell ], { type: "image/png" } );
                let urlCreator = window.URL || window.webkitURL;
                setURL(urlCreator.createObjectURL( blob ));
            }
        });
    }
    const exportImage = async (e) => {
        e.preventDefault();
        /** Именно файл **/
        console.log("Точно форма");
        console.log(e.target);
        let buffer = new FormData(e.target);
        let arrayBufferView = new Uint8Array(buffer);
        let blob = new Blob( [ arrayBufferView ], { type: "image/png" } );
        let urlCreator = window.URL || window.webkitURL;
        setURL(urlCreator.createObjectURL( blob ));
        console.log(imgURL);
        //socket.emit('uploadImage', { row:Drows[0], buffer: buffer.get('file') });
    };
    const handleExport = async (blob) => {
        /** TODO: Должен передаваться первичный ключ.
         * Просто в этой таблице он состоит из первого элемента **/
        socket.emit('uploadImage', { row:Drows[0], buffer: blob });
        console.log("handleExport");
        console.log(blob);

    };
    const paintDeleted = () =>{
        //Окрашивание строки, которая должна быть удалена
        let input = document.getElementById(rowID);
        input.classList.add('deleted');
    }
    const handleAddImage = (e) =>{
        let arrayBufferView = new Uint8Array(e.target.files[0]);
        let blob = new Blob( [ arrayBufferView ], { type: "image/png" } );
        let urlCreator = window.URL || window.webkitURL;
        setURL(urlCreator.createObjectURL( e.target.files[0] ));
    }

    const handleDelete = () =>{
        paintDeleted();
        socket.emit("deleteRow", {columns:colNames,rows:Drows});
        setDeleteFlag(true);
    }
    const handleAdd = () =>{
        let tempCells = [];
        let input = document.getElementById(rowID);
        let inputs = input.querySelectorAll("input")
        inputs.forEach(function(inp,i,inputs){
            if (inp.value)
                tempCells.push(inp.value);
            else(tempCells.push('NULL'))
        });
        setCells(tempCells);
        setAddFlag(true);
    }
    const handlePush = () =>{
        let tempCells = [];
        let input = document.getElementById(rowID);
        let inputs = input.querySelectorAll("input")
        inputs.forEach(function(inp,i,inputs){
            if (inp.value)
                tempCells.push(inp.value);
            else(tempCells.push(inp.placeholder))
        });
        setCells(tempCells);
        setEditFlag(false);
        setPushFlag(true);
    }
    const handleClear = () =>{
        let input = document.getElementById(rowID);
        let inputs = input.querySelectorAll("input")
        inputs.forEach(function(inp,i,inputs){
            inp.value = '';
        });
    }

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (pushFlag){
                socket.emit("updateRow", {cells:cells,columns:colNames});
                setPushFlag(false);
            }
            if (addFlag){
                socket.emit("insertRow", {cells:cells,columns:colNames});
                setAddFlag(false);
                handleClear();
            }
        }

    });
    useEffect(()=>{
        importImage();
    },[])


    if (Drows) return (
        <tr className="row" id={rowID} key={rowID}>
                {Drows.map((cell,index) =>{
                    return typeof(Drows[index])=='object' ?
                        <td className="coverBlock container">
                            <img className="preview"
                                 id={"img_"+rowID }
                                 src={imgURL}
                                 alt=""/>
                            {Drows[index]?
                                <button className="zoom" onClick={() => setModal(true)}></button>
                            :
                                <button className="button-upload" onClick={() => setModal(true)}></button>

                            }
                                <Modal
                                    visible={isModal}
                                    title=''
                                    content={
                                        <>
                                            <form onSubmit={exportImage} encType="multipart/form-data">
                                                <label>Выберите Файл</label><br/>
                                                <input type = "file"
                                                       name="file"
                                                       id="file"
                                                       accept="image/*"

                                                       onChange={handleAddImage}
                                                />
                                            </form>
                                            <Canvas height={800}
                                                    width={500}
                                                    id = {"canv_"+rowID }
                                                    src = {imgURL}

                                                    callbackToParent={handleExport}
                                            />
                                        </>}
                                    footer={
                                        ''
                                    }
                                    onClose={onClose}
                                />
                        </td>
                        :
                        <td >
                            <input type = "text"
                                   name={rowID +'_' + index}
                                   placeholder={Drows[index]}
                                   readOnly={true}
                            />
                        </td>
                    }

                )}

                <td className="container editable" >
                    <button className="button-send" onClick={handlePush} ></button>
                    <button className="button-del" onClick={handleDelete}></button>
                </td>


        </tr>
    )
    else
        return(
            <tr className="row" id={rowID} key={rowID}>
                {colNames.names?.map((cell,index) => {
                    return (
                        <td>
                        <input type="text"
                               name={rowID +'_' + index}
                               readOnly={true}
                               placeholder=""
                        />
                    </td>)})
                }

                <td className="container editable" >
                    <button className="button-plus" onClick={handleAdd}></button>
                </td>


            </tr>
        )
}

export default DataRow;

