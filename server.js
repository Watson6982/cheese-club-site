var express = require('express');
var nunjucks = require('nunjucks');
var expressNunjucks = require('express-nunjucks');
var helmet = require('helmet');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
// routes files
var routes = require('./routes/site.js');

var PORT = process.env.PORT || 3000;

var app = express();
app.set('views', __dirname + '/views');

var isDev = app.get('env') === 'development';
var njk = expressNunjucks(app, {
    watch: isDev,
    noCache: isDev,
    autoescape: true,
    throwOnUndefined: isDev 
});
// middleware
app.use(express.static('public'));
app.use(helmet()); // security stuffs
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use((req,res,next) => {
	var log = {
		body: req.body,
		params: req.params,
		queryStr: req.query,
	};
	console.log(JSON.stringify(log, null, 2));
	next();
}); // log specific request objects for clarity when testing

// set up separate routes files for easier management
app.use('/', routes);

// run the server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});