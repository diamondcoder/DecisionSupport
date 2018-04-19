var router = require('express').Router();
var User = require('../models/user');
var Country = require('../models/country');
var SpiCountry = require('../models/spiCountry');
var flash = require('express-flash');
const AHP = require('ahp');
var ahpContext = new AHP();
var needList;
var express = require('express');
var data = express();
data.locals.Ranking;


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

        //ahpTest();
        //score_component(spiCountries)
        res.json(rank());
    });
});

router.post('/project', function(req,res){
    ahpTest(req.body);
//fromUI(req.body)
  var obj = {};
  	//console.log('body: ' + JSON.stringify(req.body));
    //console.log(getValue(1, 3))
  res.send(ahpTest(req.body));
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
    console.log(scoreRanker(needsArray));

//Ranking the score for Foundations of Wellbeing
    var foundationsArray = [needList[0]["FoundationsofWellbeing"]["AccesstoBasicKnowledge"]["Score"],
        needList[0]["FoundationsofWellbeing"]["AccesstoInformationandCommunications"]["Score"],
        needList[0]["FoundationsofWellbeing"]["HealthandWellness"]["Score"],
        needList[0]["FoundationsofWellbeing"]["EnvironmentalQuality"]["Score"]];
    console.log(scoreRanker(foundationsArray));

//Ranking the score for Opportunity
    var opportunityArray = [needList[0]["Opportunity"]["PersonalRights"]["Score"],
        needList[0]["Opportunity"]["PersonalFreedomandChoice"]["Score"],
        needList[0]["Opportunity"]["ToleranceandInclusion"]["Score"],
        needList[0]["Opportunity"]["AccesstoAdvancedEducation"]["Score"]];
    console.log(scoreRanker(opportunityArray));
    var rankedNeeds = needsArray + "," + foundationsArray + "," + opportunityArray;
    //console.log(scoreRanker(rankedNeeds))
   /* var rankedArray = rankedNeeds.split(",");

    var jsonString = "[";
    for (var i = 0; i < rankedArray.length; i++) {
        jsonString = jsonString + buildJson([rankedArray[i]]);
        if(i != rankedArray.length-1){
            jsonString = jsonString+",";
        }
    }*/

    //return jsonString + "]";
    return rankedNeeds;

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
function getValue(value1, value2){
    value1 = value1.replace(/"/g,"");
    value2 = value2.replace(/"/g,"");
    var value = value1 - value2 < 0 ? value1 : value2;
    return value;
}
 function ahpTest(content){

     /*ahpContext.addItems(['VendorA', 'VendorB']);

     ahpContext.addCriteria(['price', 'functionality', 'UX', 'Usability', 'Speed','response','testable','cool']);

     ahpContext.rankCriteriaItem('price',[['VendorA', 'VendorB', 3],['VendorB', 'VendorA', 1/3]]);

     ahpContext.rankCriteriaItem('functionality', [['VendorA', 'VendorB', 5],['VendorB', 'VendorA', 1/5]]);
     ahpContext.rankCriteriaItem('UX', [['VendorA', 'VendorB', 1],['VendorB', 'VendorA', 1]]);
     ahpContext.rankCriteriaItem('Usability', [['VendorA', 'VendorB', 3],['VendorB', 'VendorA', 1/3]]);
     ahpContext.rankCriteriaItem('Speed', [['VendorA', 'VendorB', 1/5],['VendorB', 'VendorA', 5]]);
     ahpContext.rankCriteriaItem('response', [['VendorA', 'VendorB', 1],['VendorB', 'VendorA', 1]]);
     ahpContext.rankCriteriaItem('testable', [['VendorA', 'VendorB', 1/3],['VendorB', 'VendorA', 3]]);
     ahpContext.rankCriteriaItem('cool', [['VendorA', 'VendorB', 1/5],['VendorB', 'VendorA', 5]]);

     ahpContext.rankCriteria(
         [
             ['price', 'functionality', 1],
             ['price', 'UX', 3],
             ['price', 'Usability', 5],
             ['price', 'Speed', 7],
             ['price', 'response', 9],
             ['price', 'testable', 11],
             ['price', 'cool', 13],
             ['functionality', 'UX', 3],
             ['functionality', 'Usability', 5],
             ['functionality', 'Speed', 7],
             ['functionality', 'response', 9],
             ['functionality', 'testable', 11],
             ['functionality', 'cool', 13],
             ['UX', 'Usability', 3],
             ['UX', 'Speed', 5],
             ['UX', 'response', 7],
             ['UX', 'testable', 9],
             ['UX', 'cool', 11],
             ['Usability','Speed',3],
             ['Usability', 'response', 5],
             ['Usability', 'testable', 7],
             ['Usability', 'cool', 9],
             ['Speed', 'response', 3],
             ['Speed', 'testable', 5],
             ['Speed', 'cool', 7],
             ['response', 'testable',3],
             ['response', 'cool',5],
             ['testable', 'cool', 3]
         ]
     );

     var output = ahpContext.run();
     console.log(output)
     Ranking = output;
     return output;*/
    // str = str.replace(/\s/g, '');
    var project1 = content[1]["value"].replace(/\s/g,'');
     var project2 = content[11]["value"].replace(/\s/g, '');
var  number = getValue(JSON.stringify(content[3]["value"]),JSON.stringify(content[13]["value"]));
 //number = number.replace(/"/g,"")
     console.log(number)

     ahpContext.addItems([project1, project2]);

     ahpContext.addCriteria(['Nutrition', 'Water', 'Shelter', 'Safety', 'BasicKnowledge','ICT','Health','Environmental']);

     ahpContext.rankCriteriaItem('Nutrition', [[project1, project2, getValue(JSON.stringify(content[3]["value"]),JSON.stringify(content[13]["value"]))],
         [project2, project1, (1/getValue(JSON.stringify(content[3]["value"]),JSON.stringify(content[13]["value"])))]]);
     ahpContext.rankCriteriaItem('Water', [[project1, project2, getValue(JSON.stringify(content[4]["value"]),JSON.stringify(content[14]["value"]))],
         [project2, project1, (1/getValue(JSON.stringify(content[4]["value"]),JSON.stringify(content[14]["value"])))]]);
     ahpContext.rankCriteriaItem('Shelter', [[project1, project2, getValue(JSON.stringify(content[5]["value"]),JSON.stringify(content[15]["value"]))],
         [project2, project1, (1/getValue(JSON.stringify(content[5]["value"]),JSON.stringify(content[15]["value"])))]]);
     ahpContext.rankCriteriaItem('Safety', [[project1, project2, getValue(JSON.stringify(content[6]["value"]),JSON.stringify(content[16]["value"]))],
         [project2, project1, (1/getValue(JSON.stringify(content[6]["value"]),JSON.stringify(content[16]["value"])))]]);
     ahpContext.rankCriteriaItem('BasicKnowledge', [[project1, project2, getValue(JSON.stringify(content[7]["value"]),JSON.stringify(content[17]["value"]))],
         [project2, project1, (1/getValue(JSON.stringify(content[7]["value"]),JSON.stringify(content[17]["value"])))]]);
     ahpContext.rankCriteriaItem('ICT', [[project1, project2, getValue(JSON.stringify(content[8]["value"]),JSON.stringify(content[18]["value"]))],
         [project2, project1, (1/getValue(JSON.stringify(content[8]["value"]),JSON.stringify(content[18]["value"])))]]);
     ahpContext.rankCriteriaItem('Health', [[project1, project2, getValue(JSON.stringify(content[9]["value"]),JSON.stringify(content[19]["value"]))],
         [project2, project1, (1/getValue(JSON.stringify(content[9]["value"]),JSON.stringify(content[19]["value"])))]]);
     ahpContext.rankCriteriaItem('Environmental', [[project1, project2, getValue(JSON.stringify(content[10]["value"]),JSON.stringify(content[20]["value"]))],
         [project2, project1, (1/getValue(JSON.stringify(content[10]["value"]),JSON.stringify(content[20]["value"])))]]);

     ahpContext.rankCriteria(
         [
             ['Nutrition', 'Water', 3], ['Nutrition', 'Shelter', 5], ['Nutrition', 'Safety', 7], ['Nutrition', 'BasicKnowledge', 9], ['Nutrition', 'ICT', 11],
             ['Nutrition', 'Health', 13], ['Nutrition', 'Environmental',15],
             ['Water', 'Shelter', 3], ['Water', 'Safety', 5], ['Water', 'BasicKnowledge', 7], ['Water', 'ICT', 9], ['Water', 'Health', 11], ['Water', 'Environmental', 13],
             ['Shelter', 'Safety', 3], ['Shelter', 'BasicKnowledge', 5], ['Shelter', 'ICT', 7], ['Shelter', 'Health', 9],  ['Shelter', 'Environmental', 11],
             ['Safety', 'BasicKnowledge', 3], ['Safety', 'ICT', 5], ['Safety', 'Health', 7], ['Safety', 'Environmental', 9],
             ['BasicKnowledge', 'ICT', 3], ['BasicKnowledge', 'Health', 5], ['BasicKnowledge', 'Environmental', 7],
             ['ICT', 'Health', 3], ['ICT', 'Environmental', 5],
             ['Health', 'Environmental', 3]
         ]
     );

     var output = ahpContext.run();
     Ranking = output.rankedScoreMap

   //for(var i=0;i<Ranking.length;i++){
     Ranking = content[1]["value"] +" "+ Ranking[project1]+" : "+content[11]["value"]+" "+Ranking[project2]
       console.log("In loop "+Ranking)
   //}
    // console.log(Ranking);
    console.log(output)
     return output;


 }

module.exports = router;