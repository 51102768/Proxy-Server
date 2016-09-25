let http = require('http')
let path = require('path')
let fs = require('fs')
let request = require('request')
let argv = require('yargs').argv

let logPath = argv.log && path.join(__dirname, argv.log)
let logStream = logPath ? fs.createWriteStream(logPath): process.stdout
let localhost = '127.0.0.1'
let host = argv.host || '127.0.0.1'
let port = argv.port || (host === localhost ? 8000:80)
let scheme = 'http://'
let destinationUrl = argv.url || scheme + host + ':' + port 

console.log(argv)

http.createServer((req, res) => {
    logStream.write('Echo response server:\n')
    for (let header in req.headers) {
	    res.setHeader(header, req.headers[header])
	}
    logStream.write('Echo header: ' + JSON.stringify( req.headers) + '\n')
    // req.pipe(logStream, {end:false})
    req.pipe(res)
}).listen(8000)
logStream.write('Echo server listening localhost:8000\n')

http.createServer((req, res) => {
    logStream.write('Proxy response server:\n')
    // logStream.write(JSON.stringify(req.headers) + '\n')

    let url = destinationUrl
    if(req.headers['x-destination-url']){
        url  = 'http://' + req.headers['x-destination-url']
    }
    let options = {
        headers: req.headers, 
        url : url + req.url,
        method : req.method
    }

    let downstreamResponse = req.pipe(request(options))
    logStream.write('Proxy header: ' + JSON.stringify(downstreamResponse.headers) + '\n')
    // downstreamResponse.pipe(logStream, {end:false})
    downstreamResponse.pipe(res);
}).listen(8001)

logStream.write('Proxy server listening localhost:8001\n')

