var express = require('express');
var fs = require('fs');

var app = express();

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  // What happens if directory logs/ doesn't exist?
  fs.readdir("logs/", (err, files) => {
    // No need to write double, In JavaScript you can use:
    // res.render('pages/index', { files });
    res.render('pages/index', {files: files});
  });
});

/**
 * I would use a REST API like this:
 *
 * GET /crashes/:crash_id    # return data for a specific crash
 * GET /crashes              # return list of all crashes
 * POST /crashes             # create a new crash report
 *
 */
app.get('/api/read/:crash_id', function(req, res, next) {
  // This code has a directory traversal vulnerability. Consider the URL:
  // http://localhost:9000/api/read/..%2F..%2F..%2F..%2F..%2F..%2F..%2F..%2Fetc%2Fpasswd
  fs.readFile(`logs/${req.params.crash_id}`, 'utf8' , (err, data) => {
    if (err) {
      // You'd normally want to use a normal logger like:
      // https://github.com/bithavoc/express-winston
      console.error(err)
      // We usually report errors in Node.JS using next():
      // https://expressjs.com/en/guide/error-handling.html
      return next(err);
    }
    res.setHeader('Content-Type', 'application/json');
    // res.send() is more common, and will also set content type for you
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
    // data is defined but never used
    const data = JSON.parse(body);
    const now = Date.now()
    // not sure if possible or how easy, but just to be on the safe side I would sanitizy req.ip before using it in a file name
    // Also looks like there's no limit on the size of a crash report, which would expose you to DOS attack
    // (user uploads a file too big)

    // What if directory logs does not exist?
    const file_name = `logs/${req.ip}-${now}.json`        
    fs.writeFile(file_name, body, function (err) {
      // report errors with next()
      if (err) return console.log(err);
      console.log(`Crash saved as ${file_name} (${body.length} bytes)`);
    });
    res.end({})
  });
});

app.listen(9000);
console.log('Crash server is up');
