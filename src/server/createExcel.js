let XLSXChart = require ("xlsx-chart");
let fs = require ("fs");

let xlsxChart = new XLSXChart();
let opts = {
    charts: [{
        chart: "column",
        titles: [
            "Title 1",
            "Title 2",
            "Title 3"
        ],
        fields: [
            "GG",
            "Field 2",
            "Field 3",
            "Field 4"
        ],
        data: {
            "Title 1": {
                "GG": 5,
                "Field 2": 10,
                "Field 3": 15,
                "Field 4": 20
            },
            "Title 2": {
                "GG": 10,
                "Field 2": 5,
                "Field 3": 20,
                "Field 4": 15
            },
            "Title 3": {
                "GG": 20,
                "Field 2": 15,
                "Field 3": 10,
                "Field 4": 5
            }
        },
        chartTitle: "Title 1"
    }]
};
const makeData = (SQLdata) =>{
    let titles =  [
        "Количество книг"
    ];
    /*Преобразование всех данных в столбцы для графика*/
    let field1 = SQLdata.map(row => typeof(row) !=='string' ? row[0] : 'DEL');
    let field2 = SQLdata.map(row => typeof(row) !=='string' ? row[1] : 'DEL');
    let field3 = SQLdata.map(row => typeof(row) !=='string' ? row[2] : 'DEL');
    let field4 = SQLdata.map(row => typeof(row) !=='string' ? row[3] : 'DEL');
    field1.splice(0,4);
    field2.splice(0,4);
    field3.splice(0,4);
    field4.splice(0,4);
    let fields = field1.reduce((unique,item) => unique.includes(item) ? unique : [...unique,item], [])
    let genres = field2.reduce((unique,item) => unique.includes(item) ? unique : [...unique,item], [])

    let nameWamount = field1.reduce((o,c,i) => {o[c] = o[c] ? o[c]  + field4[i]:field4[i]; return o;}, {})

    let genresWamount = field2.reduce((o,c,i) => {o[c] = o[c] ? o[c]  + field4[i]:field4[i]; return o;}, {})
    /**
     * В данной библиотеке нельзя нарисовать два графика разных типов
     * (Столбцы и круги - разный тип)
     * Ниже - для столбчатых диаграмм.**/
    /*let opts = {
        charts: [{
            chart: "column",
            titles: titles,
            fields: fields,
            data: {
                "Количество книг": nameWamount
            },
            chartTitle: "Проданные книги"
        }
        ]
    };*/
    /** Ниже - для круговых диаграмм **/
    let opts = {
        chart: "pie",
        titles: titles,
        fields: genres,
        data: {
            "Количество книг": genresWamount
        },
        chartTitle: "Проданные книги"

    };
    return opts;

}
function makeXlsx(socket,SQLdata) {
    makeData(SQLdata);
    xlsxChart.generate(makeData(SQLdata), function (err, data) {
        fs.writeFileSync(__dirname+"\\temp\\chart.xlsx", data);
        socket.emit("downloadChart",data);
    });
}

exports.makeXlsx = makeXlsx;
