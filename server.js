
var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');


var secret = require('./config/secret');
var User = require('./models/user');
var Country = require('./models/country');
var Category = require('./models/category');
var spiCountry = require('./models/spiCountry');

var app = express();



mongoose.connect(secret.database, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to the database");
  }
});

// Middleware
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secret.secretKey,
  store: new MongoStore({ url: secret.database, autoReconnect: true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

app.use(function(req, res, next) {
  Country.find({}, function(err, countries) {
    if (err) return next(err);
    res.locals.countries = countries;
    next();
  });
});


//spiCountries is the variable to for use in the views page
app.use(function(req, res, next) {
  spiCountry.find({}, function(err, countries) {
    if (err) return next(err);
    res.locals.spiCountries = countries;
    next();
  });
});
app.get('/insights/spicountries/:code', function(req, res){
    var code = req.params.code;

    spiCountry.find({CountryCode: code})
       .exec(function(err, spiCountries){
        //rank(spiCountries);
        if(err) return next(err);
        //res.json(spiCountries);
        res.render('admin/insights',{
          spiCountries:spiCountries
        });
    });

});


app.use(function(req, res, next) {
  Category.find({}, function(err, categories) {
    if (err) return next(err);
    res.locals.categories = categories;
    next();
  });
});


app.engine('ejs', engine);
app.set('view engine', 'ejs');

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
var adminRoutes = require('./routes/admin');

app.use(mainRoutes);
app.use(userRoutes);
app.use(adminRoutes);

app.listen(secret.port, function(err) {
  if (err) throw err;
  console.log("Server is Running on port " + secret.port);
});
