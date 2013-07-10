#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.
*/

var fs = require('fs');
var program = require('commander');
var rest = require('restler');
var cheerio = require('cheerio');
var FILE2CHK_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1);
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var download = function(url, fname) {
    var resp = rest.get(url);
    resp.on('complete', function(result) {
        if (result instanceof Error) {
            console.log('Error:  ' + result.message);
            return 1; 
        }
    return 0; 
    });
}


if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Name of JSON check file', CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Name of HTML file', FILE2CHK_DEFAULT)
        .option('-u, --url <web_address>', 'Web site from which to pull file', URL_DEFAULT)
        .parse(process.argv);
    var chkforfile = assertFileExists(program.checks);
    if (program.file == "") {
        console.log("Name of file to be checked must be provided.");
        process.exit(1);
    }
    if ( program.url != "" ) {
        var dnldcode = download(program.url, program.file);
        if (dnldcode != 0) {
            console.log("Unable to download file.  Exiting.");
            process.exit(1);
        }
    }
    chkforfile = assertFileExists(program.file);
    var checkJson = checkHtmlFile(program.file, program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
