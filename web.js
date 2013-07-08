var express = require('express');

var fs = require('fs');
var fileName = "./index.html";

fs.exists(fileName, function(exists) {
    if (exists) {
        fs.stat(fileName, function(error, stats) {
            fs.open(fileName, "r", function(error, fd) {
                var buf = new Buffer(stats.size);
                fs.read(fd, buf, 0, buf.length, null, function(err, bytesRead, buf) {
                    var str = buf.toString('utf8', 0, buf.length);
                    console.log(str);
                    fs.close(fd);
                });
            });
        });
    else {
        str = "Problem encountered.  Contact web administrator.";
    }
});

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send(str);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
