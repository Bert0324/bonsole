const http = require('http');
const open = require('open');
const detectPort = require('detect-port');
const ip = require('ip');

module.exports = (content, port, option) => {
    if (Object.prototype.toString.call(port) !== "[object Number]"){
        option = port;
        port = 9094;
    }
    detectPort(port, (err, _port)=>{
        if (!err && port === _port){
            try {
                content = JSON.stringify(content);
            } catch (e) {
                throw new Error(`transfer to string fail: ${e}`);
            }
            let html = `<!DOCTYPE html><html>
                                <head>
                                    <meta charset="UTF-8">
                                    <title>bonsole</title>
                                    <script>
                                        console.log(${content});
                                    </script>
                                </head>
                                <body>
                                    <pre>${content}</pre>
                                </body>
                            </html>`;
            http.createServer((req, res)=>{
                res.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
                res.end(html);
            }).listen(port, ip.address(), ()=>{
                (async ()=>{
                    await open(`http://${ip.address()}:${port}`, option);
                    console.log(`console.log in http://${ip.address()}:${port}`);
                })();
            });
        } else {
            if (err){
                console.log(err);
            } else {
                console.log(`port ${_port} in use, please set a not used port`);
            }
        }
    });
};


