const open = require('open');
const ip = require('ip').address();
const fs = require('fs');
const path = require('path');

const event = {
    notStart:Symbol('notStart'),
    inStart:Symbol('inStart'),
    started:Symbol('started')
};
let status = event.notStart;
let messageQueue = [];
let socket;

const server = require('http').createServer((req, res)=>{
    let html = `<!DOCTYPE html>
                <html>
                    <head>
                        <meta charset="UTF-8">
                        <title>bonsole</title>
                        <script src="build/index.js"></script>
                    </head>
                    <body>
                    </body>
                </html>`;
    if (req.url.endsWith('.js')){
        fs.readFile(path.resolve(__dirname, 'build/index.js'), (err, data)=>{
            if (err){
                throw new Error(err.toString());
            } else {
                res.writeHead(200, {"Content-Type":"application/javascript"});
                res.end(data);
            }
        })
    } else {
        res.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
        res.end(html);
    }
});


const io = require('socket.io')(server);
io.on('connection', (so)=>{

    socket = so;
    status = event.started;

    socket.on('ready', ()=>{
        socket.emit('first-push',messageQueue);
    });


});




module.exports = (content, port, option) => {
    if (Object.prototype.toString.call(port) !== "[object Number]"){
        option = port;
        port = 9094;
    }
    switch (status) {
        case event.notStart:
            status = event.inStart;
            messageQueue.push(content);
            server.listen(port, ip, ()=>{
                (async ()=>{
                    await open(`http://${ip}:${port}`, option);
                    console.log(`console.log in http://${ip}:${port}`);
                })();
            });
            break;
        case event.inStart:
            messageQueue.push(content);
            break;
        case event.started:
            socket.emit('push', content);
            break;
        default:
            break;
    }
};


