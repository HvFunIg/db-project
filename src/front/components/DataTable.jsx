import React, {useState, useContext, useCallback, useEffect, useLayoutEffect} from 'react';
import * as FileSaver from 'file-saver';


import '../css/table.css';
import {SocketContext} from '../api/dbSockets';
import DataRow from "./DataRow";
import {ExportXlsx} from "../js/exportXlsx";

import editImg from "../img/PencilLine.png"
import tableReport from "../img/Note.png"
import pieReport from "../img/ChartPieSlice.png"


const DataTable = ({editable}) => {
    const socket = useContext(SocketContext);
    const [colNames,setNames] = useState([]);
    const [dataRows,setRows] = useState([]);
    let [pureNames,setPureNames]= useState([]);
    const [excelData,setExcelData] = useState([]);

    const [isEdited,alterEdited] = useState(false);
    const [fixIsNeeded,setFixed] = useState(false);

    const fileName = 'Otchyot'

    const handleRows = (data) => {
        let dataRow = React.createElement(DataRow,{Drows:data.rows,colNames:pureNames},null);
        setRows([...dataRows,dataRow]);
        /* Добавить строку в Excel*/
        setExcelData([...excelData,data.rows]);
    };

    const handleColNames = (data) =>{
        let names = data.names.map(name => <th>{name}</th>);
        names.push(<th> </th>);
        setNames(names);
        setPureNames(data);
        setRows([]);
        setFixed(false);

        /* обновить данные для экспорта в Excel*/
        setExcelData([]);
        /* Установить заголовки в Excel*/
        console.log (data.names);
        setExcelData(data.names);
        //setVisible(true);
    };
    const reverseInput = () =>{
        //Замена значения readOnly для инпутов строки
        let inputs = document.querySelectorAll("input");
        inputs.forEach(function(inp,i,inputs){
            inp.readOnly = !inp.readOnly;
        });
    }
    const handleEditStart = () =>{
        socket.emit("editStarted");
        console.log("Должно начаться редактирование")
        let buttonBlocks = document.querySelectorAll(".editable");
        buttonBlocks.forEach(function(inp,i,inputs){
            inp.style.opacity = 1;
        });
        console.log()
        reverseInput();
        alterEdited(true);
    };
    const handleEditFinish = () =>{
        socket.emit("editFinished");
        let buttonBlocks = document.querySelectorAll(".editable");
        buttonBlocks.forEach(function(inp,i,inputs){
            inp.style.opacity = 0;
        });

        reverseInput();
        alterEdited(false);
    };
    const handleEditRollback = () =>{
        socket.emit("editRollback");
        let buttonBlocks = document.querySelectorAll(".editable");
        buttonBlocks.forEach(function(inp,i,inputs){
            inp.style.opacity = 0;
        });
        let row = document.querySelectorAll(".deleted");
        row.forEach(function(inp,i,inputs){
            inp.classList.remove('deleted');
        });


        reverseInput();
        alterEdited(false);
    };
    const handleFix = () =>{
        console.log("Нужен ремонт");
        setFixed(true);
    };
    const repare = () =>{
        setFixed(false);
        socket.emit("editRollback");

    };
    const handleCreateXlsx = () =>{
        socket.emit("getChart",excelData);
    }
    const handleDownload = (data) =>{
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const data2 = new Blob([data], {type: fileType});
        FileSaver.saveAs(data2, "temp.xlsx");
    }
    useEffect(() => {
        if (!editable) socket.emit("selectTable", 'SoldGenres');
        else {
            socket.emit("selectTable", 'Жанры');

        }
    },[])
    useLayoutEffect(() => {
        //useLayoutEffect запускается синхронно после всех изменений в DOM, иначе отображаются не все данные

        // as soon as the component is mounted, do the following tasks:

        // emit USER_ONLINE event
        // subscribe to socket events
        socket.on("getRows", handleRows);
        socket.on("getColumnNames", handleColNames);
        socket.on("FixTransaction", handleFix);
        socket.on("downloadChart", handleDownload);

        return () => {
            // before the component is destroyed
            // unbind all event handlers used in this component
            socket.off("getRows", handleRows);
            socket.off("getColumnNames", handleColNames);
            socket.off("FixTransaction", handleFix);
            socket.off("downloadChart", handleDownload);

        };
    }, [socket, handleRows,handleColNames,handleFix,handleDownload]);

    return (
        <div>
            <div>
                <div className="container " >
                    <div className="table">
                    <table id="content" >
                        <thead>
                        <tr>{colNames}</tr>

                        </thead>
                        <tbody>
                        {dataRows}
                        {editable ? <DataRow Drows={null} colNames={pureNames}/> : ''}

                        </tbody>
                    </table>
                    </div>
                </div>
                <div className="container">
                    {editable ? <>
                        {isEdited ?
                                <>
                                <button onClick={handleEditFinish} className=" buttonWithIcon">
                                    <img src={editImg}/>
                                    <div> Закончить редактирование </div>
                                </button>
                                <button onClick={handleEditRollback} className=" buttonWithIcon">
                                    <img src={editImg}/>
                                    <div> Отменить редактирование </div>
                                </button>
                                </>
                                :
                                <button onClick={handleEditStart} className="buttonWithIcon">
                                    <img  src={editImg}/>
                                    <div > Начать редактирование </div>
                                </button>

                        }</>
                        :
                        <button onClick={handleCreateXlsx} className="buttonWithIcon button-accent">
                            <img  src={pieReport}/>
                            <div > Скачать с графиками </div>
                        </button>
                    }

                    <ExportXlsx csvData={excelData}
                                fileName={fileName} />

                    {fixIsNeeded ?
                        <button onClick={repare} className="buttonWithIcon">
                            <img  src={editImg}/>
                            <div > Отменить изменения </div>
                        </button>
                        : ''
                    }

                </div>

            </div>
        </div>

    )}


export default DataTable;