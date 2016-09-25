let http = require('http')
let path = require('path')
let fs = require('fs')
let request = require('request')
let argv = require('yargs')
            .alias('p','port').describe('p', 'Specify a forwarding host')
            .alias('m','host').describe('m', 'Specify a forwarding host')
            .alias('e','exec').describe('e', 'Specify a process to proxy instead')
            .alias('l','log').describe('l', 'Specify a output log file')
            .example('node $0 -l log.txt -x 127.0.0.1')
            .epilog('I would like to give props CodePath and CoderSchool.')
            .help('h').argv
let spawn = require('child_process').spawn
let chalk = require('chalk')

let logPath = argv.log && path.join(__dirname, argv.log)
let logStream = logPath ? fs.createWriteStream(logPath): process.stdout
let localhost = '127.0.0.1'
let host = argv.host || '127.0.0.1'
let port = argv.port || (host === localhost ? 8000:80)
let scheme = 'http://'
let destinationUrl = argv.url || scheme + host + ':' + port




let echoServer = http.createServer((req, res) => {
    logStream.write(chalk.green('Echo response server:\n'))
    for (let header in req.headers) {
	    res.setHeader(header, req.headers[header])
	}
    logStream.write(chalk.bold.red('Echo header: \n') + JSON.stringify( req.headers) + '\n')
    // req.pipe(logStream, {end:false})
    req.pipe(res)
});
let proxyServer = http.createServer((req, res) => {
    logStream.write(chalk.green('Proxy response server:\n'))
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
    logStream.write(chalk.bold.red('Proxy header: \n') + JSON.stringify(downstreamResponse.headers) + '\n')
    downstreamResponse.pipe(logStream,  {end:false});
    downstreamResponse.pipe(res);
})

if("exec" in argv){
    let argument = process.argv.slice(4);
    let child = spawn(process.argv[3],argument,{stdio:[process.stdin , 'pipe', 'pipe']});
    // console.log(child.stdio[0]._writableState.corkedRequestsFree.finish)
    child.stdout.on('data',function(data){
        console.log(data)
        logStream.write(data);
    });

    child.stderr.on('data', function (data) {
        console.log(data)
        logStream.write(data);
    });

    child.on('close', function (code) {
        console.log('Child process exited with code ' + code)
        logStream.write('Child process exited with code ' + code);
    });
}
else{  
    echoServer.listen(8000)
    logStream.write(chalk.blue('Echo server listening \n'))
    proxyServer.listen(8001)
    logStream.write(chalk.blue('Proxy server listening \n'))
}


