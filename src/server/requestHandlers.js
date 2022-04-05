const {Request,TYPES} = require('tedious');
const isolationLevel = require('tedious').ISOLATION_LEVEL;

function executeQuery(DBconnection,socket, queryString, callback) {
    let results = [];
    const request = new Request(queryString, (err) => {
        if (err) {
            socket.emit('DBError',err)
            return callback(err);
        }
        console.log('DONE!');
        callback(null, results);
    });
    request.on('columnMetadata', function (columns) {
        let colNames = [];
        columns.forEach((column) => {
            colNames.push(column.colName);
        });
        socket.emit('getColumnNames',{names: colNames});
    });

    // Emits a 'DoneInProc' event when completed
    request.on('row', (columns) => {
        let row = [];
        columns.forEach((column) => {
            if (column.value === null) {
                row.push(null);
                //console.log('NULL');
            } else {
                if (typeof(column.value) === "object")
                    console.log("image found")
                row.push(column.value);
            }
        });
        socket.emit('getRows',{ rows: row});
    });

    request.on('done', (rowCount) => {
        console.log('Done is called!');
    });

    request.on('doneInProc', (rowCount, more) => {
        console.log(rowCount + ' rows returned');
    });
    // In SQL Server 2000 you may need: connection.execSqlBatch(request);
    DBconnection.execSql(request);
}

function tableInsert(DBconnection,socket,tableName, data, callback) {
    console.log(data);
    let queryString = `INSERT INTO  ${tableName} 
                        VALUES (${data.map ((cell,index) => {
                            if (cell !=='NULL') 
                                return ('\'' + cell + '\'')
                            else 
                                if (tableName === 'Книги' && index === data.length-1)
                                    return 'NULL'
                                else
                                    return '0'
                        }
        )})`
                        ;
    let results = [];
    console.log(queryString);
    const request = new Request(queryString, (err) => {
        if (err) {
            socket.emit('DBError',err)
            console.log('Ошибка при вставке в БД');
            return callback(err);
        }
        console.log('DONE!');
    });

    // In SQL Server 2000 you may need: connection.execSqlBatch(request);
    DBconnection.execSql(request);
}
function tableUpdate(DBconnection,socket,tableName,colNames,cells, callback) {
    console.log(cells);
    //let colNames = data.colNames;
   // let tableName = 'Genres'
    let queryString = `UPDATE  ${tableName}
                        SET ${cells.map((cell,index)=> `${colNames[index]} = '${cell}'`)}
                        WHERE ${colNames[0]} = ${cells[0]} ;`
                        ;
    let results = [];
    console.log(queryString);

    const request = new Request(queryString, (err) => {
        if (err) {
            console.log('Обновление не выполнено',err);
            socket.emit('DBError',err);
            return callback(err);
        }
        console.log('DONE!');

        callback(null, results);
    });
    // In SQL Server 2000 you may need: DBconnection.execSqlBatch(request);
    DBconnection.execSql(request);
}
function tableDelete(DBconnection,socket,tableName,colNames, cells, callback) {

    let queryString = `DELETE FROM  ${tableName}    
                        WHERE ${colNames[0]} = '${cells[0]}' AND 
                            ${colNames[1]} = '${cells[1]}'`
    ;
    let results = [];
    console.log(queryString);
    const request = new Request(queryString, (err) => {
        if (err) {
            console.log('Строка не удалена');
            socket.emit('DBError',err);
            return callback(err);
        }

        console.log('Строка удалена');
        callback(null, results);
    });
    // In SQL Server 2000 you may need: DBconnection.execSqlBatch(request);
    DBconnection.execSql(request);
}
function insertImage(DBconnection,socket,tableName, row,image, callback) {
    //let row = 2;

    console.log(row);
    /*let queryString = `UPDATE  ${tableName}
                        SET Cover = '${image}'
                        WHERE Book_ID = ${row};`
    ;*/
    let queryString = `UPDATE  ${tableName}
                        SET Обложка = (SELECT * FROM OPENROWSET (BULK '${__dirname}\\temp\\temp.png', SINGLE_BLOB) AS Обложка) 
                        WHERE ID_книги = ${row};`
    ;
    let results = [];
    console.log(queryString);
    const request = new Request(queryString, (err) => {
        if (err) {
            console.log('Изображение не вставлено');
            socket.emit('DBError',err);
            return callback(err);
        }
        console.log('Изображение добавлено (в транзакцию)');
        callback(null, results);
    });
    // In SQL Server 2000 you may need: DBconnection.execSqlBatch(request);
    DBconnection.execSql(request);
}

/**** Процедура *********/
function runProc(DBconnection,socket,parameter,callback) {
    let queryString = `EXEC MostPopular '${parameter}';`
    ;
    let results = [];
    console.log(queryString);
    const request = new Request(queryString, (err) => {
        if (err) {
            console.log('Процедура не запущена');
            socket.emit('DBError',err);
            return callback(err);
        }
        callback(null, results);
    });
    request.on('columnMetadata', function (columns) {
        let colNames = [];
        columns.forEach((column) => {
            colNames.push(column.colName);
        });
        socket.emit('getColumnNames',{names: colNames});
    });

    // Emits a 'DoneInProc' event when completed
    request.on('row', (columns) => {
        let row = [];
        columns.forEach((column) => {
            if (column.value === null) {
                row.push(null);
                //console.log('NULL');
            } else {
                if (typeof(column.value) === "object")
                    console.log("image found")
                row.push(column.value);
            }
        });
        socket.emit('getRows',{ rows: row});
    });
    // In SQL Server 2000 you may need: DBconnection.execSqlBatch(request);
    DBconnection.execSql(request);
}

/** Транзакции ***/
function startTransaction(DBconnection,socket,callback) {
    console.log("Начало транзакции:");
    let queryString = `BEGIN TRANSACTION; COMMIT;`;
    let results = [];
    console.log(queryString);
    const request = new Request(queryString, (err) => {
        if (err) {
            console.log('Update failed');
            socket.emit('DBError',err);
            return callback(err);
        }
        console.log('-CHECK');
        callback(null, results);
    });
    // In SQL Server 2000 you may need: DBconnection.execSqlBatch(request);
    DBconnection.execSql(request);
}
function beginTransaction(DBconnection,user,callback) {
    DBconnection.beginTransaction((err) => {
        if (err) {
            // If error in begin transaction, roll back!
            rollbackTransaction(err,DBconnection,user,callback);
        } else {
            console.log("Начало транзакции "+user+" через встроенный метод:");
            // If no error, commit transaction!
            //commitTransaction();
        }
    },user,isolationLevel.REPEATABLE_READ); //w это пользовательское имя транзакции
}
    // SQL: Commit Transaction (if no errors)
function endTransaction(DBconnection,socket,user,table,callback) {
    console.log('Попытка завершения транзакции');
    DBconnection.commitTransaction((err) => {
        if (err) {
            return rollbackTransaction(DBconnection,socket,user,callback);
            console.log('Ошибка при коммите: ', err);
        }
        console.log('Коммит транзакции успешен');
        console.log('DONE!');
        let queryString = `SELECT * FROM ${table};`

        executeQuery(DBconnection, socket, queryString, function (error, results) {
            if (error) console.log(error);
        })
        //connection.close();
    });

}
    // SQL: Rolling Back Transaction - due to errors during transaction process.
    // function commitTransaction() {
    //     connection.commitTransaction((err) => {
    //         if (err) {
    //             console.log('commit transaction err: ', err);
    //         }
    //         console.log('commitTransaction() done!');
    //         console.log('DONE!');
    //         //connection.close();
    //     });
    // }


    // SQL: Rolling Back Transaction - due to errors during transaction process.
    function rollbackTransaction(DBconnection,socket,user,callback) {
        console.log('transaction err: ',user);

        /*DBconnection.rollbackTransaction((err) => {
            if (err) {
                console.log('transaction rollback error: ', err);
                return callback(err);
            }
        });*/

        let queryString = `ROLLBACK TRAN ${user};`
        ;
        let results = [];
        console.log(queryString);
        const request = new Request(queryString, (err) => {
            if (err) {
                console.log('Rollback error');

                socket.emit('FixTransaction');
                return callback(err);
            }
            console.log('Rollback success)');
            callback(null, results);
        });
        // In SQL Server 2000 you may need: DBconnection.execSqlBatch(request);
        DBconnection.execSql(request);

    }
//}
exports.executeQuery = executeQuery
exports.tableInsert = tableInsert
exports.tableUpdate = tableUpdate
exports.tableDelete = tableDelete
exports.insertImage = insertImage
exports.runProc = runProc

exports.beginTransaction = beginTransaction
exports.rollbackTransaction = rollbackTransaction
exports.endTransaction = endTransaction
