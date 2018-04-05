var router = require('express').Router();
var User =require('../models/user');
var Country = require('../models/country');
var SpiCountry = require('../models/spiCountry');

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


router.get('/spicountries', function(req, res){
    SpiCountry.find({}, function(err, spiCountries){
        if(err) return next();
        res.json(spiCountries);
    });
});

router.get('/spicountries/CountryCode/:code', function(req, res){
    var code = req.params.code;

    SpiCountry.find({CountryCode: code}, function(err, spiCountries){
        rank(spiCountries);
        if(err) return next();
        res.json(spiCountries);
    });

})

router.get('/spicountries/:code', function(req, res){
    var code = req.params.code;
    var needs = code.split("&");
    console.log(needs)
    SpiCountry.find({CountryCode: code}, function(err, spiCountries){
        rank(spiCountries);
        if(err) return next();
        res.json(spiCountries);
    });

})

router.get('/spicountries/:code/prioritylist', function(req, res){
    var code = req.params.code;
    SpiCountry.find({CountryCode: code}, function(err, spiCountries){
        if(err) return next();
        console.log(spiCountries)
        //res.json(spiCountries)
        //rank(spiCountries);

        res.json(spiCountries);
    });
})

router.post('/spiCountries/create', function(req, res){
    var spiCountry = new SpiCountry();

    spiCountry.save(function(err){
        if(err) return next(err);
        req.flash('success', 'successfully added a spicountry');
        return res.redirect('/add-category');
    });
});

function rank(country){
    var countryString = country.toString();
    //var country = country);
    console.log(countryString);
    var basicHumanNeeds = country.BasicHumanNeeds;
    var foundationNeeds = country.FoundationsofWellbeing;
    console.log(basicHumanNeeds);
    console.log(foundationNeeds);

}
module.exports = router;