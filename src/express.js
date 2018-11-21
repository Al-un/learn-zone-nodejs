// Express
const express = require('express');
const bodyParser = require('body-parser');
// Express Handlebars
const handlebars = require('handlebars');
const expressHandlebars = require('express-handlebars');
const path = require('path');
// Express sessions
const session = require('express-session');
// Override method
const methodOverride = require('method-override');

// Express
const app = express();

// Method override
// https://www.npmjs.com/package/method-override
// https://dev.to/moz5691/method-override-for-put-and-delete-in-html-3fp2
app.use(methodOverride('_method'));

// https://stackoverflow.com/a/4296402/4906586
/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form
 * data from regular forms set to POST) and exposes the resulting object
 * (containing the keys and values) on req.body
 */
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

// static files: https://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// Configure Express-handlebars
// https://stackoverflow.com/a/42120699/4906586
// https://gist.github.com/TastyToast/5053642
handlebars.registerHelper('truncate', function(str, len) {
  if (str.length > len) {
    var new_str = str.substr(0, len + 1);
    return new handlebars.SafeString(new_str + '...');
  }
  return str;
});

app.engine(
  'hbs',
  expressHandlebars({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
  })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// config express-session
// secret: https://randomkeygen.com/
var sess = {
  secret: process.env.EXPRESS_SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true
};
// if (app.get('env') === 'production') {
//     sess.cookie.secure = true; // serve secure cookies, requires https
// }
// this needs to be defined before passport configuration
app.use(session(sess));

module.exports = app;
