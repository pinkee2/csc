// import dependancies in app.js fiel
const express=require('express');
const multer = require('multer');
const ejs =require('ejs');
const path = require('path');
//const fs = require("file-system");
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fileUpload = require('express-fileupload');


const adminRouter = require('./routers/admin_routes');
const subadminRouter = require('./routers/sub_admin_routes');
const websiteRouter = require('./routers/website_routes');

const app = express(); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(session({secret:'my pet name is sankey',saveUninitialized: true,resave: false, path: '/expert/sign_in', httpOnly: true, secure: false, maxAge: null}));
app.use(session({secret:'my pet name is monkey',saveUninitialized: true,resave: true}));
app.use('/uploads',express.static('uploads'))

app.use('/admin', adminRouter);
app.use('/subadmin', subadminRouter);
app.use('/website', websiteRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
 if(res.status(err.status || 404)){
  res.render('404')
   /*res.json({
   	 result:'false',
   	 msg:'Authication failed'
   })*/
  }else{
  res.render('500')
}
});

module.exports = app;