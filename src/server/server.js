const http = require('http')
const url = require ('url')

const os = require('os')
const User = require('./user.js')

function start(route,handle) {
    function onRequest(request, response) {
        let pathname = url.parse(request.url).pathname

        let userName = os.userInfo().username;
        let eugene = new User("user1", '123');
        eugene.sayHi();

        console.log('Request for ' + pathname + 'from ' + userName + ' received.')

        route(handle,pathname)
        response.writeHead(200, {
            'Content-Type': 'text/plain',
        })
        response.write('Hello World')
        response.end()
    }

    http.createServer(onRequest).listen(8888)
    console.log('Server has started.')
}
exports.start = start
