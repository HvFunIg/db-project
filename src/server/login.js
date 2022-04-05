/***Константы сервера**/
const port = 8000;
const path = 'pathToSrcServer'
class Config{
    constructor(log='user1',pass='123') {
        this.login = log;
        this.password = pass;
    }
    get config() {
        return {
            server: 'pc-name',
            authentication: {
                type: 'default',
                options: {
                    userName: this.login,
                    password: this.password
                }

            },
            options: {
                connectTimeout: 5000,
                database: 'B1',
                trustServerCertificate: true,
            }
        }
    }
}

function setConfig(login,password) {

    let config = new Config(login,password);
    return (config.config);
}
exports.path = path;
exports.port = port;
exports.setConfig = setConfig;
