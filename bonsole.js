const http = require('http');
const open = require('open');
const detectPort = require('detect-port');

module.exports = (content, port, option) => {
    if (Object.prototype.toString.call(port) !== "[object Number]"){
        option = port;
        port = 9094;
    }
    detectPort(port, (err, _port)=>{
        if (!err && port === _port){
            http.createServer((req, res)=>{
                try {
                    content = JSON.stringify(content);
                } catch (e) {
                    throw new Error(`transfer to string fail: ${e}`);
                }
                res.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
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
                res.end(html);
            }).listen(port, 'localhost', ()=>{
                (async ()=>{
                    await open(`http://localhost:${port}`, option);
                })();
            });
        }
    });
};






