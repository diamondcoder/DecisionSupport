var router = require('express').Router();
var User = require('../models/user');
var Country = require('../models/country');
var SpiCountry = require('../models/spiCountry');
const AHP = require('ahp');
var ahpContext = new AHP();
var needList;

router.get('/chart', function (req, res) {
    res.render('main/charts');
});


router.get('/', function (req, res) {
    res.render('main/home');
});

router.get('/about', function (req, res) {
    res.render('main/about');
});
router.get('/insight', function (req, res) {
    res.render('main/insight');
});
router.get('/culture', function (req, res) {
    res.render('main/culture');
});


router.get('/users', function (req, res) {
    User.find({}, function (err, users) {
        res.json(users);
    });
});
router.get('/countrylist', function (req, res) {
    res.render('countrylist');
});

router.get('/countries', function (req, res) {
    Country.find({}, function (err, countries) {
        if (err) return next();
        res.json(countries);
    });
});


router.get('/spicountries', function (req, res) {
    SpiCountry.find({}, function (err, spiCountries) {
        if (err) return next();
        res.json(spiCountries);
    });
});

router.get('/spicountries/CountryCode/:code', function (req, res) {
    var code = req.params.code;
    SpiCountry.find({CountryCode: code}, function (err, spiCountries) {
        if (err) return next();
        res.json(spiCountries);
    });

})

router.get('/spicountries/:code', function (req, res) {
    var code = req.params.code;
    var needs = code.split("&");
    console.log(needs)
    SpiCountry.find({CountryCode: code}, function (err, spiCountries) {
        rank(spiCountries);
        score_component(spiCountries)
        if (err) return next();
        res.json(spiCountries);
    });

})

router.get('/spicountries/:code/prioritylist', function (req, res) {
    var code = req.params.code;
    SpiCountry.find({CountryCode: code}, function (err, spiCountries) {
        if (err) return next();
        needList = spiCountries;
        ahpTest();
        //score_component(spiCountries)
        res.json(ahpTest());
    });
});

router.post('/project', function(req,res){


  var obj = {};
  	console.log('body: ' + JSON.stringify(req.body));
  res.send(req.body);
});


router.post('/spiCountries/create', function (req, res) {
    var spiCountry = new SpiCountry();

    spiCountry.save(function (err) {
        if (err) return next(err);
        req.flash('success', 'successfully added a spicountry');
        return res.redirect('/add-category');
    });
});

function rank() {
//Ranking the score for Basic Human Needs
    var needsArray = [needList[0]["BasicHumanNeeds"]["NutritionandBasicMedicalCare"]["Score"],
        needList[0]["BasicHumanNeeds"]["WaterandSanitation"]["Score"],
        needList[0]["BasicHumanNeeds"]["Shelter"]["Score"],
        needList[0]["BasicHumanNeeds"]["PersonalSafety"]["Score"]];
    //console.log(scoreRanker(needsArray));

//Ranking the score for Foundations of Wellbeing
    var foundationsArray = [needList[0]["FoundationsofWellbeing"]["AccesstoBasicKnowledge"]["Score"],
        needList[0]["FoundationsofWellbeing"]["AccesstoInformationandCommunications"]["Score"],
        needList[0]["FoundationsofWellbeing"]["HealthandWellness"]["Score"],
        needList[0]["FoundationsofWellbeing"]["EnvironmentalQuality"]["Score"]];
    //console.log(scoreRanker(foundationsArray));

//Ranking the score for Opportunity
    var opportunityArray = [needList[0]["Opportunity"]["PersonalRights"]["Score"],
        needList[0]["Opportunity"]["PersonalFreedomandChoice"]["Score"],
        needList[0]["Opportunity"]["ToleranceandInclusion"]["Score"],
        needList[0]["Opportunity"]["AccesstoAdvancedEducation"]["Score"]];
    //console.log(scoreRanker(opportunityArray));
    var rankedNeeds = needsArray + "," + foundationsArray + "," + opportunityArray;
    var rankedArray = rankedNeeds.split(",");

    var jsonString = "{";
    for (var i = 0; i < rankedArray.length; i++) {
        jsonString = jsonString + buildJson([rankedArray[i]]);
        if(i != rankedArray.length-1){
            jsonString = jsonString+",";
        }
    }

    return jsonString + "}";

}

function score_component() {
    //var associativeArray = {};
    var nutritionScore = needList[0]["BasicHumanNeeds"]["NutritionandBasicMedicalCare"]["Score"];
    var waterScore = needList[0]["BasicHumanNeeds"]["WaterandSanitation"]["Score"];
    var shelterScore = needList[0]["BasicHumanNeeds"]["Shelter"]["Score"];
    var personalScore = needList[0]["BasicHumanNeeds"]["PersonalSafety"]["Score"];
    var knowledge = needList[0]["FoundationsofWellbeing"]["AccesstoBasicKnowledge"]["Score"];
    var informationScore = needList[0]["FoundationsofWellbeing"]["AccesstoInformationandCommunications"]["Score"];
    var wellnessScore = needList[0]["FoundationsofWellbeing"]["HealthandWellness"]["Score"];
    var environmentSore = needList[0]["FoundationsofWellbeing"]["EnvironmentalQuality"]["Score"];
    var rightsSore = needList[0]["Opportunity"]["PersonalRights"]["Score"];
    var freedomScore = needList[0]["Opportunity"]["PersonalFreedomandChoice"]["Score"];
    var toleranceScore = needList[0]["Opportunity"]["ToleranceandInclusion"]["Score"]
    var educationScore = needList[0]["Opportunity"]["AccesstoAdvancedEducation"]["Score"];

    var assocciativeArray = [nutritionScore + "&" + "Nutrition and BasicMedical Care", waterScore + "&" + "Water and Sanitation", shelterScore + "&" + "Shelter", personalScore + "&" + "Personal Safety",
        knowledge + "&" + "Access to Basic Knowledge", informationScore + "&" + "Access to Information and Communications",
        wellnessScore + "&" + "Health and Wellness", environmentSore + "&" + "Environmental Quality", rightsSore + "&" + "Personal Rights",
        freedomScore + "&" + "Personal Freedom and Choice", toleranceScore + "&" + "Tolerance and Inclusion", educationScore + "&" + "Access to Advanced Education"
    ]
    return assocciativeArray;
}

function buildJson(score) {
    var jstring = "";
    for (var i = 0; i < score_component().length; i++) {
        var inString = score_component()[i].split("&");
        if (inString[0] == score + "") {
            jstring = "{" + score + ": " + inString[1] + "}";

            break;
        }
    }
    return jstring;
}

function scoreRanker(array) {
    for (var i = 0; i < array.length; i++) {
        var temp = array[i];
        var j = i - 1;
        while (j >= 0 && array[j] > temp) {
            array[j + 1] = array[j];
            j--;
        }
        array[j + 1] = temp;
    }
    return array;
}

function index(need) {
    if (need == "NutritionandBasicMedicalCare") return '[0]["BasicHumanNeeds"]';
    if (need == "WaterandSanitation") return '[0]["BasicHumanNeeds"]';
    if (need == "Shelter") return '[0]["BasicHumanNeeds"]';
    if (need == "PersonalSafety") return '[0]["BasicHumanNeeds"]';

    if (need == "AccesstoBasicKnowledge") return '[0]["FoundationsofWellbeing"]';
    if (need == "AccesstoInformationandCommunications") return '[0]["FoundationsofWellbeing"]';
    if (need == "HealthandWellness") return '[0]["FoundationsofWellbeing"]';
    if (need == "EnvironmentalQuality") return '[0]["FoundationsofWellbeing"]';

    if (need == "PersonalRights") return '[0]["Opportunity"]';
    if (need == "PersonalFreedomandChoice") return '[0]["Opportunity"]';
    if (need == "ToleranceandInclusion") return '[0]["Opportunity"]';
    if (need == "AccesstoAdvancedEducation") return '[0]["Opportunity"]';

    if (need == "PowerDistance") return '[0]["Culture"]';
    if (need == "Individualism") return '[0]["Culture"]';
    if (need == "Masculinity") return '[0]["Culture"]';
    if (need == "UncertaintyAvoidance") return '[0]["Culture"]';
    if (need == "LTO") return '[0]["Culture"]';
    if (need == "INDULGENCE") return '[0]["Culture"]';

}
 function ahpTest(){
     ahpContext.addItems(['Rural Water Project', 'Food Project', 'Shelter Project']);

     ahpContext.addCriteria(['Food', 'Water', 'Shelter', 'Health', 'need4','need5','need6','need7','']);

     ahpContext.rankCriteriaItem('Food', [
         ['P1', 'P2', 3],
         ['P1', 'P3', 5],
         ['P2', 'P3', 3]
     ]);
     ahpContext.rankCriteriaItem('Water', [
         ['Rural Water Project', 'Food Project', 3],
         ['Rural Water Project', 'Shelter Project', 5],
         ['Food Project', 'Shelter Project', 3]
     ]);
     ahpContext.rankCriteriaItem('Shelter', [
         ['Rural Water Project', 'Food Project', 1],
         ['Rural Water Project', 'Shelter Project', 1/5],
         ['Food Project', 'Shelter Project', 1/5]
     ]);
     ahpContext.rankCriteriaItem('Health', [
         ['Rural Water Project', 'Food Project', 1],
         ['Rural Water Project', 'Shelter Project', 3],
         ['Food Project', 'Shelter Project', 3]
     ]);

     ahpContext.rankCriteria(
         [
             ['Food', 'Water', 1],
             ['Food', 'Shelter', 5],
             ['Food', 'Health', 3],
             ['Water', 'Shelter', 5],
             ['Water', 'Health', 3],
             ['Shelter', 'Health', 1/3]
         ]
     );

     var output = ahpContext.run();
     return output;
     //console.log(output);
 }

module.exports = router;
