import React, {useContext,useLayoutEffect,Fragment} from 'react'
import {SocketContext} from "../api/dbSockets";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import downloadImg from "../img/Note.png";

/** this component creates a button
*  that can create .xlsx Excel file */

export const ExportXlsx = ({csvData, fileName}) => {

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const socket = useContext(SocketContext);

    const exportToCSV = (csvData, fileName) => {
        
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }
    const exportWithCharts = () => {
        socket.emit('getChart');
    }

    return (
        <Fragment>
            <button  onClick={(e) => exportToCSV(csvData,fileName)}
                     className="buttonWithIcon button-accent">
                <img  src={downloadImg}/>
                <div >Скачать табличный отчет </div>
            </button>

        </Fragment>

    )
}


