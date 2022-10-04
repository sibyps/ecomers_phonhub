

var logger = require('morgan');
const dotenv=require("dotenv")
const express=require("express")
const createError=require("http-errors")
const connectdb = require("./helpers/connection")
const app =express()
const bodyparser =require("body-parser")
const session = require('express-session')



/* ------------------------------- BODY PARSER ------------------------------ */
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.json())


/* -------------------------------------------------------------------------- */
/*                                 CACHE-CONTROL                                 
/* -------------------------------------------------------------------------- */
app.use((req, res, next) => {
  if (!req.user) {
    res.header("cache-control", "private,no-cache,no-store,mustrevalidate");
    res.header("Express", "-3");
  }
  next();
});


 /* ----------------------------------- EJS ---------------------------------- */
app.set("view engine","ejs")

 /* --------------------------------- PUBLIC --------------------------------- */
app.use(express.static("public"))

/* -------------------------------- SESSSION -------------------------------- */
app.use(
    session({
      secret: "secret", 
      saveUninitialized: true,
      cookie: { maxAge: 600000 },
      resave: false,
    })
  );

/* --------------------------------- ROUTES --------------------------------- */
app.use("/",require('./routes/userRoute'))
app.use("/admin",require('./routes/adminRoute'))

/* ----------------------------------- ENV ---------------------------------- */
dotenv.config({path:".env"})


/* --------------------------- DATABASE CONECTION --------------------------- */
connectdb()



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
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
