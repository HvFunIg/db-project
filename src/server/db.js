const handlers = require('./requestHandlers.js')
const fs = require('fs');
const xlsx = require('./createExcel');

function CreateConnection(DBconnection,socket,user){
    let successFlag = 0;
    let activeTable = '';
    DBconnection.connect();
    DBconnection.on('connect', function(err) {
        if (err) {
            socket.emit('DBError',err)
            console.log(err);
            DBconnection.close();
            successFlag = 0;
            //return successFlag;
        }
        else{
            successFlag = 1;
            console.log('Подключение к БД завершено');
            console.log(successFlag);
            socket.emit('userConnected',user);
            //return(successFlag);
        }
        socket.on('userDisconnect',()=> {
            DBconnection.close();
            socket.emit('userDisconnected',user);
            console.log("Пользователь " + user + " вышел из системы.")
        });
        socket.on('executeQuery',(queryString)=> {
            handlers.executeQuery(DBconnection, socket, queryString, function (error, results) {
                console.log(results);
            })
        });
        socket.on('selectTable',(table)=> {
            console.log("Пользователь запрашивает данные из таблицы " + table);
            activeTable = table;
            let queryString = `SELECT * FROM ${table};`
            handlers.executeQuery(DBconnection, socket, queryString, function (error, results) {
                if (error) console.log(error);
            })
        });

        socket.on('updateRow',(data)=> {
            console.log("NTCN - data:");
            console.log(activeTable);
            handlers.tableUpdate(DBconnection, socket,activeTable,data.columns.names,data.cells, function (error, results) {
                console.log(results);
            })
        });


        socket.on('insertRow',(data)=> {
            handlers.tableInsert(DBconnection, socket,activeTable, data.cells, function (error, results) {
                console.log(results);
            })
        });
        socket.on('deleteRow',(data)=> {
            console.log("Должна быть удалена строка" + data.rows[0]);
            handlers.tableDelete(DBconnection, socket,activeTable, data.columns.names,data.rows, function (error, results) {
                console.log(results);
            })
        });
        socket.on('uploadImage',(blob) =>{

            const image = new Uint8Array(blob.buffer);
            //const data = new Uint8Array(Buffer.from(buffer));
            /** Изображение с клиента временно сохраняется на сервере.
             * После этого оно передается в БД с помощью "создания BLOB
             * из файла".
             * **/
            fs.writeFile(__dirname+'\\temp\\temp.png', image, (err) => {
                if (err) throw err;
                console.log('Изображение временно сохранено на сервере ');
            });
            handlers.insertImage(DBconnection, socket,activeTable,blob.row,image, function (error, results) {
                console.log(results);
            })
        })
        socket.on('getChart',(data) =>{
            console.log("Файл создается");
            xlsx.makeXlsx(socket,data);
        })
        /****Транзакция*****/
        socket.on('editStarted',()=> {
            console.log("Начато редактирование таблицы:");
            console.log(activeTable);
            handlers.beginTransaction(DBconnection, user,function (error, results) {
                console.log(results);
            })
            /*handlers.startTransaction(DBconnection, socket, function (error, results) {
                console.log(results);
            })*/
        });
        socket.on('editFinished',()=> {
            console.log("Редактирование таблицы завершено");
            handlers.endTransaction(DBconnection,socket, user,activeTable,function (error, results) {
                console.log(results);
            })

        });
        socket.on('editRollback',()=> {
            console.log("Откат изменений");
            handlers.rollbackTransaction(DBconnection,socket, user,function (error, results) {
                console.log(results);
            })
        });
        /***Процедура***/

        socket.on('startProcedure',(param)=> {
            console.log("Выполняется процедура");
            handlers.runProc(DBconnection, socket,param,function (error, results) {
                console.log(results);
            })
        });
    });
    console.log("flag = "+successFlag);
    return successFlag;
}
exports.CreateConnection = CreateConnection;

