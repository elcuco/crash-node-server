var express = require('express');
var app = express();
var fs = require('fs');

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('pages/index');
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
    });
});

app.listen(8000);
console.log('Crash server is up');
