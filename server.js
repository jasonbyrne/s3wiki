/*
 *   BRAIN GAME
 *
 */


var publicFolder = 'public',
    restify = require('restify'),
    fs = require('fs'),
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

var sendStatic = function(req, res, next) {
    var filePath = __dirname + publicFolder + req.url;
    fs.readFile(filePath, 'utf8', function(err, data) {
        if (err) {
            res.send("File Not Found: " + filePath);
        }
        else {
            res.send(data);
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
server.get(/.*/, sendStatic);

server.listen((process.env.PORT || 80), function() {
    console.log('%s listening at %s', server.name, server.url);
});
