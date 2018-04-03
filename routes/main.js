var router = require('express').Router();
var User =require('../models/user');
var Country = require('../models/country');

router.get('/chart', function(req, res){
  res.render('main/charts');
});


router.get('/', function(req, res) {
  res.render('main/home');
});

router.get('/about', function(req, res) {
  res.render('main/about');
});
 router.get('/insight', function(req, res) {
  res.render('main/insight');
});
router.get('/culture', function(req, res) {
  res.render('main/culture');
});


router.get('/users', function(req,res){
	User.find({},function(err,users){
		res.json(users);
	});
});
router.get('/countrylist', function(req,res){
	res.render('countrylist');
});

router.get('/countries', function(req, res){
  Country.find({}, function(err, countries){
    if(err) return next();
    res.json(countries);
  });
});

module.exports = router;
