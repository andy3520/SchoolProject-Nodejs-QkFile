const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
let session = require('express-session');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const authRouter = require('./routes/authenticate');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true,
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  key: 'user_sid',
  secret: 'meowmeow',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 1544150116
  }
}));

let sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect('/user');
  } else {
    next();
  }
};

app.get('/', sessionChecker);

app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid');
  }
  next();
});

app.get('/user', (req, res,next) => {
  if (!req.cookies.user_sid || !req.session.user) {
    res.redirect('/?loginmessage=Vui lòng đăng nhập#login');
  }
  next();
});

app.post('/auth', sessionChecker);

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);

app.use('/*', (req, res) => {
  res.render('error');
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
