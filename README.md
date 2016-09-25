# Proxy Server Preview

This is preview submission for Coderschool [Pre-work](https://quip.com/B8WAAdyLf35O)

Timespend: 2.5 hours

Completed:
* [x] Required: Requests to port `8000` are echoed back with the same HTTP headers and body
* [x] Required: Requests/reponses are proxied to/from the destination server
* [x] Required: The destination server is configurable via the `--host`, `--port`  or `--url` arguments
* [x] Required: The destination server is configurable via the `x-destination-url` header
* [x] Required: Client requests and respones are printed to stdout
* [x] Required: The `--log` argument outputs all logs to the file specified instead of stdout
* [] Optional: The `--exec` argument proxies stdin/stdout to/from the destination program
* [] Optional: The `--loglevel` argument sets the logging chattiness
* [] Optional: Supports HTTPS
* [] Optional: `-h` argument prints CLI API


###Walkthrough Gif:
![Video Walkthrough](walkthrough.gif)

##Start Proxy Server Project:
```bash
npm install (if have not installed node_modules yet)
npm start
```

##Features:
###Echo Server
```bash
curl -v -X POST http://127.0.0.1:8000 -d "[any data come here]" -H "[any header value come here]"
```

####Example
```bash
curl -v -X POST http://127.0.0.1:8000 -d "hello world" -H "code:cool"
```

Process stdout:
Echo header: {"host":"localhost:8000","user-agent":"curl/7.43.0","accept":"*/*","code":"cool","content-length":"11","content-type":"application/x-www-form-urlencoded"}

Response: hello world


###Proxy server
Proxy server address : 127.0.0.1:8001
```bash
curl -v -X POST http://127.0.0.1:8001 -d "[any data come here]" -H "[any header value come here]"
```

####Example
```bash
curl http://localhost:8001 -d "hello world" -H "code:cool" -X POST
```

Process stdout:
Echo response server:
Echo header: {"host":"localhost:8000","user-agent":"curl/7.43.0","accept":"*/*","code":"cool","content-length":"11","content-type":"application/x-www-form-urlencoded"}
Proxy response server:
Proxy header: {"host":"localhost:8001","user-agent":"curl/7.43.0","accept":"*/*","code":"cool","content-length":"11","content-type":"application/x-www-form-urlencoded"}
Echo response server:
Echo header: {"host":"localhost:8001","user-agent":"curl/7.43.0","accept":"*/*","code":"cool","content-length":"11","content-type":"application/x-www-form-urlencoded","connection":"close"}

Response: hello world

###Add CLI

#### `--host`
Destination server. Default: 127.0.0.1
#### `--port`
Destination port. Default: 8000
#### `--log`
Logfile write out.
#### `--url`
Overide URL for destination server.
#### Add `x-destination-url` into headers request
Overide all arguments above
Example 
curl http://localhost:8001 -d "hello world" -H "code:cool" -X POST -H "x-destination-url:google.com"




