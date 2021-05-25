var express = require('express');
var app = express();
var fs = require('fs');

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    fs.readdir("logs/", (err, files) => {
        res.render('pages/index', {files: files});
    });
});

app.get('/api/read/:crash_id', function(req, res) {
    fs.readFile(`logs/${req.params.crash_id}`, 'utf8' , (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(data);
    });        
});

// API endpoints for crashes
app.post('/api/exceptions', function(req, res) {
    const chunks = [];
    console.log(`New Crash from ${req.ip}`);
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
        const body = Buffer.concat(chunks);
        const data = JSON.parse(body);
        const now = Date.now()
        const file_name = `logs/${req.ip}-${now}.json`        
        fs.writeFile(file_name, body, function (err) {
            if (err) return console.log(err);
            console.log(`Crash saved as ${file_name} (${body.length} bytes)`);
        });
        res.end({})
    });
});

app.listen(8000);
console.log('Crash server is up');
