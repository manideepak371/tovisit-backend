var http=require('http')
var app=require('./main')
var port=process.env.port | 9000

var server=http.createServer(app)
server.listen(port)