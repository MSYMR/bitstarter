#!/usr/bin/env node
var express = require('express');
var app = express.createServer(express.logger());
var port = process.env.PORT || 5000;
var fs = require('fs');
var fileName = "./index.html";
var content = fs.readFileSync(fileName);
var str = content.toString("utf-8", 0, content.length);

app.listen(port, function() {
    console.log("Listening on " + port);
});


app.get("/", function(request, response) {
    response.send(str);
});
