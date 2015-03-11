/*
 *   BRAIN GAME
 *
 */


var webRoot = './public',
    restify = require('restify'),
    fs = require('fs'),
    serveStatic = require('node-static'),
    staticFile = new(static.Server)(webRoot),
    config = {};


// Load config file
fs.readFile('./config/settings.json', 'utf8', function(err, data) {
    if (!err) {
        config = JSON.parse(data);
    }
});

var sendFile = function(req, res, next) {
    var filePath = req.params.name;
    if (req.params.level) {
        filePath = req.params.level + '/' + filePath;
    }
    fs.readFile('./data/' + filePath + '.json', 'utf8', function(err, data) {
        if (err) {
            res.send("File Not Found");
        }
        else {
            res.send(JSON.parse(data));
        }
    });
};


function respond(req, res, next) {
    res.send({
        'hello': req.params.name
    });
    next();
}

// initialize server
var server = restify.createServer({
    "name": "oldflorida.info"
});
server.pre(restify.pre.sanitizePath());

// Test
server.get('/hello/:name', respond);

// Fallback for everything is local static file
server.get(/.*/, function (req, res) {
    staticFile.serve(req, res, function(err, result) {
        if (err) {
            console.error('Error serving %s - %s', req.url, err.message);
            res.writeHead(err.status, err.headers);
            res.write(err.status);
            res.end();
        }
        else {
            console.log('%s - %s', req.url, res.message);
        }
    });
});

server.listen((process.env.PORT || 80), function() {
    console.log('%s listening at %s', server.name, server.url);
});
