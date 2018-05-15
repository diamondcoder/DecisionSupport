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
data.locals.prioritylist;


router.get('/chart', function (req, res) {
    res.render('main/charts');
});


router.get('/', function (req, res) {
    res.render('admin/dsshome');
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
   // console.log(needs)
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
        prioritylist= spiCountries;

        //ahpTest();
        //score_component(spiCountries)
        res.json(rank());
    });
});

router.post('/project', function (req, res) {
    //console.log(" Check oout new form "+ (JSON.stringify(req.body)))
    //console.log(req.body.projNum)
    if(req.body.projNum==2){
        res.send(ahpTestTwoProj(req.body));
    }
    if(req.body.projNum==3){
        res.send(ahpTestThreeProj(req.body));
    }
    if(req.body.projNum==4){
        res.send(ahpTestFourProj(req.body));
    }

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
     var rankedArray = rankedNeeds.split(",");

     var jsonString = "{";
     for (var i = 0; i < rankedArray.length; i++) {
         jsonString = jsonString + buildJson([rankedArray[i]],i);
         if(i != rankedArray.length-1){
             jsonString = jsonString+",";
         }
     }
console.log(jsonString)
    return jsonString + "}";
    //return rankedNeeds;

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

function buildJson(score,rank) {
    var jstring = "";
    for (var i = 0; i < score_component().length; i++) {
        var inString = score_component()[i].split("&");
        if (inString[0] == score + "") {
            jstring = " \""+rank+"\": {\"score\": " + score + ", \"name\": \"" + inString[1] + "\"}";

            break;
        }
    }
    return jstring + "";
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

function getValue(value1, value2) {

    value1 = value1.replace(/"/g, "");
    value2 = value2.replace(/"/g, "");
    if(value1 == 0 || value2 == 0){
        return 0
    }
    var value = value1 - value2 < 0 ? value1 : value2;
    return value;
}

function getNumber(str){
     str = str.replace(/"/g,"");
     return parseInt(str);

}



function ahpTestTwoProj(content) {

    var project1 = content.Projects.Project0.replace(/\s/g, '');
    var project2 = content.Projects.Project1.replace(/\s/g, '');


    ahpContext.addItems([project1, project2]);

    ahpContext.addCriteria(['Nutrition', 'Water', 'Shelter', 'Safety', 'BasicKnowledge', 'ICT', 'Health', 'Environmental']);

    ahpContext.rankCriteriaItem('Nutrition', [
        [project1, project1, parseFloat(content["Needs"]["Nutrition"]["Nutrition00"])],
        [project1, project2, parseFloat(content["Needs"]["Nutrition"]["Nutrition01"])],

        [project2, project1, parseFloat(content["Needs"]["Nutrition"]["Nutrition10"])],
        [project2, project2, parseFloat(content["Needs"]["Nutrition"]["Nutrition11"])]

    ]);
    ahpContext.rankCriteriaItem('Water', [
        [project1, project1, parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation00"])],
        [project1, project2, parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation01"])],
        [project2, project1, parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation10"])],
        [project2, project2, parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation11"])]


    ]);
    ahpContext.rankCriteriaItem('Shelter', [
        [project1, project1, parseFloat(content["Needs"]["Shelter"]["Shelter00"])],
        [project1, project2, parseFloat(content["Needs"]["Shelter"]["Shelter01"])],
        [project2, project1, parseFloat(content["Needs"]["Shelter"]["Shelter10"])],
        [project2, project2, parseFloat(content["Needs"]["Shelter"]["Shelter11"])]


    ]);
    ahpContext.rankCriteriaItem('Safety', [
        [project1, project1, parseFloat(content["Needs"]["Safety"]["Safety00"])],
        [project1, project2, parseFloat(content["Needs"]["Safety"]["Safety01"])],
        [project2, project1, parseFloat(content["Needs"]["Safety"]["Safety10"])],
        [project2, project2, parseFloat(content["Needs"]["Safety"]["Safety11"])]

    ]);
    ahpContext.rankCriteriaItem('BasicKnowledge', [
        [project1, project1, parseFloat(content["Needs"]["BasicKnowledge"]["BasicKnowledge00"])],
        [project1, project2, parseFloat(content["Needs"]["BasicKnowledge"]["BasicKnowledge01"])],
        [project2, project1, parseFloat(content["Needs"]["BasicKnowledge"]["BasicKnowledge10"])],
        [project2, project2, parseFloat(content["Needs"]["BasicKnowledge"]["BasicKnowledge11"])]
    ]);
    ahpContext.rankCriteriaItem('ICT', [
        [project1, project1, parseFloat(content["Needs"]["ICT"]["ICT00"])],
        [project1, project2, parseFloat(content["Needs"]["ICT"]["ICT01"])],
        [project2, project1, parseFloat(content["Needs"]["ICT"]["ICT10"])],
        [project2, project2, parseFloat(content["Needs"]["ICT"]["ICT11"])]

    ]);
    ahpContext.rankCriteriaItem('Health', [
        [project1, project1, parseFloat(content["Needs"]["Health"]["Health00"])],
        [project1, project2, parseFloat(content["Needs"]["Health"]["Health01"])],
        [project2, project1, parseFloat(content["Needs"]["Health"]["Health10"])],
        [project2, project2, parseFloat(content["Needs"]["Health"]["Health11"])]

    ]);
    ahpContext.rankCriteriaItem('Environmental', [
        [project1, project1, parseFloat(content["Needs"]["Environmental"]["Environmental00"])],
        [project1, project2, parseFloat(content["Needs"]["Environmental"]["Environmental01"])],
        [project2, project1, parseFloat(content["Needs"]["Environmental"]["Environmental10"])],
        [project2, project2, parseFloat(content["Needs"]["Environmental"]["Environmental11"])]


    ]);

    ahpContext.rankCriteria(
        [
            ['Nutrition', 'Water', 3], ['Nutrition', 'Shelter', 5], ['Nutrition', 'Safety', 7], ['Nutrition', 'BasicKnowledge', 9], ['Nutrition', 'ICT', 9],['Nutrition', 'Health', 9], ['Nutrition', 'Environmental', 9],
            ['Water', 'Shelter', 3], ['Water', 'Safety', 5], ['Water', 'BasicKnowledge', 7], ['Water', 'ICT', 7], ['Water', 'Health', 7], ['Water', 'Environmental', 7],
            ['Shelter', 'Safety', 3], ['Shelter', 'BasicKnowledge', 5], ['Shelter', 'ICT', 5], ['Shelter', 'Health', 5], ['Shelter', 'Environmental', 5],
            ['Safety', 'BasicKnowledge', 3], ['Safety', 'ICT', 5], ['Safety', 'Health', 7], ['Safety', 'Environmental', 9],
            ['BasicKnowledge', 'ICT', 3], ['BasicKnowledge', 'Health', 5], ['BasicKnowledge', 'Environmental', 7],
            ['ICT', 'Health', 3], ['ICT', 'Environmental', 5],
            ['Health', 'Environmental', 3]
        ]
    );


    var output = ahpContext.run();
    Ranking = output.rankedScoreMap

    //for(var i=0;i<Ranking.length;i++){
    Ranking = ontent["Projects"]["Project0"] + ":" + Ranking[project1] + "," + ontent["Projects"]["Project1"] + ":" + Ranking[project2]
   // console.log("In loop " + Ranking)
    //}
    // console.log(Ranking);
    //console.log(output)
    return output;


}

function ahpTestThreeProj(content) {

    var project1 = content.Projects.Project0.replace(/\s/g, '');
    var project2 = content.Projects.Project1.replace(/\s/g, '');
    var project3 = content.Projects.Project2.replace(/\s/g, '');

    ahpContext.addItems([project1, project2, project3]);

    ahpContext.addCriteria(['Nutrition', 'Water', 'Shelter', 'Safety', 'BasicKnowledge', 'ICT', 'Health', 'Environmental']);

    ahpContext.rankCriteriaItem('Nutrition', [
        [project1, project1, parseFloat(content["Needs"]["Nutrition"]["Nutrition00"])],
        [project1, project2, parseFloat(content["Needs"]["Nutrition"]["Nutrition01"])],
        [project1, project3, parseFloat(content["Needs"]["Nutrition"]["Nutrition02"])],

        [project2, project1, parseFloat(content["Needs"]["Nutrition"]["Nutrition10"])],
        [project2, project2, parseFloat(content["Needs"]["Nutrition"]["Nutrition11"])],
        [project2, project3, parseFloat(content["Needs"]["Nutrition"]["Nutrition12"])],

        [project3, project1, parseFloat(content["Needs"]["Nutrition"]["Nutrition20"])],
        [project3, project2, parseFloat(content["Needs"]["Nutrition"]["Nutrition21"])],
        [project3, project3, parseFloat(content["Needs"]["Nutrition"]["Nutrition22"])]
    ]);
    ahpContext.rankCriteriaItem('Water', [
        [project1, project1, parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation00"])],
        [project1, project2, parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation01"])],
        [project1, project3, parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation02"])],

        [project2, project1, parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation10"])],
        [project2, project2, parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation11"])],
        [project2, project3, parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation12"])],

        [project3, project1, parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation20"])],
        [project3, project2, parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation21"])],
        [project3, project3, parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation22"])],

    ]);
    ahpContext.rankCriteriaItem('Shelter', [
        [project1, project1, parseFloat(content["Needs"]["Shelter"]["Shelter00"])],
        [project1, project2, parseFloat(content["Needs"]["Shelter"]["Shelter01"])],
        [project1, project3, parseFloat(content["Needs"]["Shelter"]["Shelter02"])],

        [project2, project1, parseFloat(content["Needs"]["Shelter"]["Shelter10"])],
        [project2, project2, parseFloat(content["Needs"]["Shelter"]["Shelter11"])],
        [project2, project3, parseFloat(content["Needs"]["Shelter"]["Shelter12"])],

        [project3, project1, parseFloat(content["Needs"]["Shelter"]["Shelter20"])],
        [project3, project2, parseFloat(content["Needs"]["Shelter"]["Shelter21"])],
        [project3, project3, parseFloat(content["Needs"]["Shelter"]["Shelter22"])]

    ]);
    ahpContext.rankCriteriaItem('Safety', [
        [project1, project1, parseFloat(content["Needs"]["Safety"]["Safety00"])],
        [project1, project2, parseFloat(content["Needs"]["Safety"]["Safety01"])],
        [project1, project3, parseFloat(content["Needs"]["Safety"]["Safety02"])],

        [project2, project1, parseFloat(content["Needs"]["Safety"]["Safety10"])],
        [project2, project2, parseFloat(content["Needs"]["Safety"]["Safety11"])],
        [project2, project3, parseFloat(content["Needs"]["Safety"]["Safety12"])],

        [project3, project1, parseFloat(content["Needs"]["Safety"]["Safety20"])],
        [project3, project2, parseFloat(content["Needs"]["Safety"]["Safety21"])],
        [project3, project3, parseFloat(content["Needs"]["Safety"]["Safety22"])]


    ]);
    ahpContext.rankCriteriaItem('BasicKnowledge', [
        [project1, project1, parseFloat(content["Needs"]["BasicKnowledge"]["BasicKnowledge00"])],
        [project1, project2, parseFloat(content["Needs"]["BasicKnowledge"]["BasicKnowledge01"])],
        [project1, project3, parseFloat(content["Needs"]["BasicKnowledge"]["BasicKnowledge02"])],

        [project2, project1, parseFloat(content["Needs"]["BasicKnowledge"]["BasicKnowledge10"])],
        [project2, project2, parseFloat(content["Needs"]["BasicKnowledge"]["BasicKnowledge11"])],
        [project2, project3, parseFloat(content["Needs"]["BasicKnowledge"]["BasicKnowledge12"])],

        [project3, project1, parseFloat(content["Needs"]["BasicKnowledge"]["BasicKnowledge20"])],
        [project3, project2, parseFloat(content["Needs"]["BasicKnowledge"]["BasicKnowledge21"])],
        [project3, project3, parseFloat(content["Needs"]["BasicKnowledge"]["BasicKnowledge22"])]

    ]);
    ahpContext.rankCriteriaItem('ICT', [
        [project1, project1, parseFloat(content["Needs"]["ICT"]["ICT00"])],
        [project1, project2, parseFloat(content["Needs"]["ICT"]["ICT01"])],
        [project1, project3, parseFloat(content["Needs"]["ICT"]["ICT02"])],

        [project2, project1, parseFloat(content["Needs"]["ICT"]["ICT10"])],
        [project2, project2, parseFloat(content["Needs"]["ICT"]["ICT11"])],
        [project2, project3, parseFloat(content["Needs"]["ICT"]["ICT12"])],

        [project3, project1, parseFloat(content["Needs"]["ICT"]["ICT20"])],
        [project3, project2, parseFloat(content["Needs"]["ICT"]["ICT21"])],
        [project3, project3, parseFloat(content["Needs"]["ICT"]["ICT22"])]


    ]);
    ahpContext.rankCriteriaItem('Health', [
        [project1, project1, parseFloat(content["Needs"]["Health"]["Health00"])],
        [project1, project2, parseFloat(content["Needs"]["Health"]["Health01"])],
        [project1, project3, parseFloat(content["Needs"]["Health"]["Health02"])],
        [project2, project1, parseFloat(content["Needs"]["Health"]["Health10"])],
        [project2, project2, parseFloat(content["Needs"]["Health"]["Health11"])],
        [project2, project3, parseFloat(content["Needs"]["Health"]["Health12"])],
        [project3, project1, parseFloat(content["Needs"]["Health"]["Health20"])],
        [project3, project2, parseFloat(content["Needs"]["Health"]["Health21"])],
        [project3, project3, parseFloat(content["Needs"]["Health"]["Health22"])]
    ]);
    ahpContext.rankCriteriaItem('Environmental', [
        [project1, project1, parseFloat(content["Needs"]["Environmental"]["Environmental00"])],
        [project1, project2, parseFloat(content["Needs"]["Environmental"]["Environmental01"])],
        [project1, project3, parseFloat(content["Needs"]["Environmental"]["Environmental02"])],
        [project2, project1, parseFloat(content["Needs"]["Environmental"]["Environmental10"])],
        [project2, project2, parseFloat(content["Needs"]["Environmental"]["Environmental11"])],
        [project2, project3, parseFloat(content["Needs"]["Environmental"]["Environmental12"])],
        [project3, project1, parseFloat(content["Needs"]["Environmental"]["Environmental20"])],
        [project3, project2, parseFloat(content["Needs"]["Environmental"]["Environmental21"])],
        [project3, project3, parseFloat(content["Needs"]["Environmental"]["Environmental22"])]
    ]);

    ahpContext.rankCriteria(
        [
            ['Nutrition', 'Water', 3], ['Nutrition', 'Shelter', 5], ['Nutrition', 'Safety', 7], ['Nutrition', 'BasicKnowledge', 9], ['Nutrition', 'ICT', 9],['Nutrition', 'Health', 9], ['Nutrition', 'Environmental', 9],
            ['Water', 'Shelter', 3], ['Water', 'Safety', 5], ['Water', 'BasicKnowledge', 7], ['Water', 'ICT', 7], ['Water', 'Health', 7], ['Water', 'Environmental', 7],
            ['Shelter', 'Safety', 3], ['Shelter', 'BasicKnowledge', 5], ['Shelter', 'ICT', 5], ['Shelter', 'Health', 5], ['Shelter', 'Environmental', 5],
            ['Safety', 'BasicKnowledge', 3], ['Safety', 'ICT', 5], ['Safety', 'Health', 7], ['Safety', 'Environmental', 9],
            ['BasicKnowledge', 'ICT', 3], ['BasicKnowledge', 'Health', 5], ['BasicKnowledge', 'Environmental', 7],
            ['ICT', 'Health', 3], ['ICT', 'Environmental', 5],
            ['Health', 'Environmental', 3]
        ]
    );

    var output = ahpContext.run();
    Ranking = output.rankedScoreMap

    //for(var i=0;i<Ranking.length;i++){
    Ranking = ontent["Projects"]["Project0"] + ":" + Ranking[project1] + "," + ontent["Projects"]["Project1"] + ":" + Ranking[project2] + "," + ontent["Projects"]["Project2"] + ":" + Ranking[project3]
    //console.log("In loop " + Ranking)
    //}
    // console.log(Ranking);
    console.log(output)
    return output;


}

function ahpTestFourProj(content) {

    var project1 = content.Projects.Project0.replace(/\s/g, '');
    var project2 = content.Projects.Project1.replace(/\s/g, '');
    var project3 = content.Projects.Project2.replace(/\s/g, '');
    var project4 = content.Projects.Project3.replace(/\s/g, '');

    ahpContext.addItems([project1, project2, project3, project4]);

    ahpContext.addCriteria(['Nutrition', 'Water', 'Shelter', 'Safety', 'BasicKnowledge', 'ICT', 'Health', 'Environmental']);
console.log(parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation00"]))
    console.log(parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation01"]))
    console.log(parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation02"]))
    console.log(parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation03"]))


   ahpContext.rankCriteriaItem('Nutrition', [
       [project1, project1, parseFloat(content["Needs"]["Nutrition"]["Nutrition00"])],
       [project1, project2, parseFloat(content["Needs"]["Nutrition"]["Nutrition01"])],
       [project1, project3, parseFloat(content["Needs"]["Nutrition"]["Nutrition02"])],
       [project1, project4, parseFloat(content["Needs"]["Nutrition"]["Nutrition03"])],
       [project2, project1, parseFloat(content["Needs"]["Nutrition"]["Nutrition10"])],
       [project2, project2, parseFloat(content["Needs"]["Nutrition"]["Nutrition11"])],
       [project2, project3, parseFloat(content["Needs"]["Nutrition"]["Nutrition12"])],
       [project2, project4, parseFloat(content["Needs"]["Nutrition"]["Nutrition13"])],
       [project3, project1, parseFloat(content["Needs"]["Nutrition"]["Nutrition20"])],
       [project3, project2, parseFloat(content["Needs"]["Nutrition"]["Nutrition21"])],
       [project3, project3, parseFloat(content["Needs"]["Nutrition"]["Nutrition22"])],
       [project3, project4, parseFloat(content["Needs"]["Nutrition"]["Nutrition23"])],
       [project4, project1, parseFloat(content["Needs"]["Nutrition"]["Nutrition30"])],
       [project4, project2, parseFloat(content["Needs"]["Nutrition"]["Nutrition31"])],
       [project4, project3, parseFloat(content["Needs"]["Nutrition"]["Nutrition32"])],
       [project4, project4, parseFloat(content["Needs"]["Nutrition"]["Nutrition33"])]

   ]);
    ahpContext.rankCriteriaItem('Water', [
        [project1, project1, parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation00"])],
        [project1, project2, parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation01"])],
        [project1, project3, parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation02"])],
        [project1, project4, parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation03"])],
        [project2, project1, parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation10"])],
        [project2, project2, parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation11"])],
        [project2, project3, parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation12"])],
        [project2, project4, parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation13"])],
        [project3, project1, parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation20"])],
        [project3, project2, parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation21"])],
        [project3, project3, parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation22"])],
        [project3, project4, parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation23"])],
        [project4, project1, parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation30"])],
        [project4, project2, parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation31"])],
        [project4, project3, parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation32"])],
        [project4, project4, parseFloat(content["Needs"]["WaterSanitation"]["WaterSanitation33"])]

    ]);
    ahpContext.rankCriteriaItem('Shelter', [
        [project1, project1, parseFloat(content["Needs"]["Shelter"]["Shelter00"])],
        [project1, project2, parseFloat(content["Needs"]["Shelter"]["Shelter01"])],
        [project1, project3, parseFloat(content["Needs"]["Shelter"]["Shelter02"])],
        [project1, project4, parseFloat(content["Needs"]["Shelter"]["Shelter03"])],
        [project2, project1, parseFloat(content["Needs"]["Shelter"]["Shelter10"])],
        [project2, project2, parseFloat(content["Needs"]["Shelter"]["Shelter11"])],
        [project2, project3, parseFloat(content["Needs"]["Shelter"]["Shelter12"])],
        [project2, project4, parseFloat(content["Needs"]["Shelter"]["Shelter13"])],
        [project3, project1, parseFloat(content["Needs"]["Shelter"]["Shelter20"])],
        [project3, project2, parseFloat(content["Needs"]["Shelter"]["Shelter21"])],
        [project3, project3, parseFloat(content["Needs"]["Shelter"]["Shelter22"])],
        [project3, project4, parseFloat(content["Needs"]["Shelter"]["Shelter23"])],
        [project4, project1, parseFloat(content["Needs"]["Shelter"]["Shelter30"])],
        [project4, project2, parseFloat(content["Needs"]["Shelter"]["Shelter31"])],
        [project4, project3, parseFloat(content["Needs"]["Shelter"]["Shelter32"])],
        [project4, project4, parseFloat(content["Needs"]["Shelter"]["Shelter33"])]

    ]);
    ahpContext.rankCriteriaItem('Safety', [
        [project1, project1, parseFloat(content["Needs"]["Safety"]["Safety00"])],
        [project1, project2, parseFloat(content["Needs"]["Safety"]["Safety01"])],
        [project1, project3, parseFloat(content["Needs"]["Safety"]["Safety02"])],
        [project1, project4, parseFloat(content["Needs"]["Safety"]["Safety03"])],
        [project2, project1, parseFloat(content["Needs"]["Safety"]["Safety10"])],
        [project2, project2, parseFloat(content["Needs"]["Safety"]["Safety11"])],
        [project2, project3, parseFloat(content["Needs"]["Safety"]["Safety12"])],
        [project2, project4, parseFloat(content["Needs"]["Safety"]["Safety13"])],
        [project3, project1, parseFloat(content["Needs"]["Safety"]["Safety20"])],
        [project3, project2, parseFloat(content["Needs"]["Safety"]["Safety21"])],
        [project3, project3, parseFloat(content["Needs"]["Safety"]["Safety22"])],
        [project3, project4, parseFloat(content["Needs"]["Safety"]["Safety23"])],
        [project4, project1, parseFloat(content["Needs"]["Safety"]["Safety30"])],
        [project4, project2, parseFloat(content["Needs"]["Safety"]["Safety31"])],
        [project4, project3, parseFloat(content["Needs"]["Safety"]["Safety32"])],
        [project4, project4, parseFloat(content["Needs"]["Safety"]["Safety33"])]

    ]);
    ahpContext.rankCriteriaItem('BasicKnowledge', [
        [project1, project1, parseFloat(content["Needs"]["BasicKnowledge"]["BasicKnowledge00"])],
        [project1, project2, parseFloat(content["Needs"]["BasicKnowledge"]["BasicKnowledge01"])],
        [project1, project3, parseFloat(content["Needs"]["BasicKnowledge"]["BasicKnowledge02"])],
        [project1, project4, parseFloat(content["Needs"]["BasicKnowledge"]["BasicKnowledge03"])],
        [project2, project1, parseFloat(content["Needs"]["BasicKnowledge"]["BasicKnowledge10"])],
        [project2, project2, parseFloat(content["Needs"]["BasicKnowledge"]["BasicKnowledge11"])],
        [project2, project3, parseFloat(content["Needs"]["BasicKnowledge"]["BasicKnowledge12"])],
        [project2, project4, parseFloat(content["Needs"]["BasicKnowledge"]["BasicKnowledge13"])],
        [project3, project1, parseFloat(content["Needs"]["BasicKnowledge"]["BasicKnowledge20"])],
        [project3, project2, parseFloat(content["Needs"]["BasicKnowledge"]["BasicKnowledge21"])],
        [project3, project3, parseFloat(content["Needs"]["BasicKnowledge"]["BasicKnowledge22"])],
        [project3, project4, parseFloat(content["Needs"]["BasicKnowledge"]["BasicKnowledge23"])],
        [project4, project1, parseFloat(content["Needs"]["BasicKnowledge"]["BasicKnowledge30"])],
        [project4, project2, parseFloat(content["Needs"]["BasicKnowledge"]["BasicKnowledge31"])],
        [project4, project3, parseFloat(content["Needs"]["BasicKnowledge"]["BasicKnowledge32"])],
        [project4, project4, parseFloat(content["Needs"]["BasicKnowledge"]["BasicKnowledge33"])]

    ]);
    ahpContext.rankCriteriaItem('ICT', [
        [project1, project1, parseFloat(content["Needs"]["ICT"]["ICT00"])],
        [project1, project2, parseFloat(content["Needs"]["ICT"]["ICT01"])],
        [project1, project3, parseFloat(content["Needs"]["ICT"]["ICT02"])],
        [project1, project4, parseFloat(content["Needs"]["ICT"]["ICT03"])],
        [project2, project1, parseFloat(content["Needs"]["ICT"]["ICT10"])],
        [project2, project2, parseFloat(content["Needs"]["ICT"]["ICT11"])],
        [project2, project3, parseFloat(content["Needs"]["ICT"]["ICT12"])],
        [project2, project4, parseFloat(content["Needs"]["ICT"]["ICT13"])],
        [project3, project1, parseFloat(content["Needs"]["ICT"]["ICT20"])],
        [project3, project2, parseFloat(content["Needs"]["ICT"]["ICT21"])],
        [project3, project3, parseFloat(content["Needs"]["ICT"]["ICT22"])],
        [project3, project4, parseFloat(content["Needs"]["ICT"]["ICT23"])],
        [project4, project1, parseFloat(content["Needs"]["ICT"]["ICT30"])],
        [project4, project2, parseFloat(content["Needs"]["ICT"]["ICT31"])],
        [project4, project3, parseFloat(content["Needs"]["ICT"]["ICT32"])],
        [project4, project4, parseFloat(content["Needs"]["ICT"]["ICT33"])]

    ]);
    ahpContext.rankCriteriaItem('Health', [
        [project1, project1, parseFloat(content["Needs"]["Health"]["Health00"])],
        [project1, project2, parseFloat(content["Needs"]["Health"]["Health01"])],
        [project1, project3, parseFloat(content["Needs"]["Health"]["Health02"])],
        [project1, project4, parseFloat(content["Needs"]["Health"]["Health03"])],
        [project2, project1, parseFloat(content["Needs"]["Health"]["Health10"])],
        [project2, project2, parseFloat(content["Needs"]["Health"]["Health11"])],
        [project2, project3, parseFloat(content["Needs"]["Health"]["Health12"])],
        [project2, project4, parseFloat(content["Needs"]["Health"]["Health13"])],
        [project3, project1, parseFloat(content["Needs"]["Health"]["Health20"])],
        [project3, project2, parseFloat(content["Needs"]["Health"]["Health21"])],
        [project3, project3, parseFloat(content["Needs"]["Health"]["Health22"])],
        [project3, project4, parseFloat(content["Needs"]["Health"]["Health23"])],
        [project4, project1, parseFloat(content["Needs"]["Health"]["Health30"])],
        [project4, project2, parseFloat(content["Needs"]["Health"]["Health31"])],
        [project4, project3, parseFloat(content["Needs"]["Health"]["Health32"])],
        [project4, project4, parseFloat(content["Needs"]["Health"]["Health33"])]

    ]);
    ahpContext.rankCriteriaItem('Environmental', [
        [project1, project1, parseFloat(content["Needs"]["Environmental"]["Environmental00"])],
        [project1, project2, parseFloat(content["Needs"]["Environmental"]["Environmental01"])],
        [project1, project3, parseFloat(content["Needs"]["Environmental"]["Environmental02"])],
        [project1, project4, parseFloat(content["Needs"]["Environmental"]["Environmental03"])],
        [project2, project1, parseFloat(content["Needs"]["Environmental"]["Environmental10"])],
        [project2, project2, parseFloat(content["Needs"]["Environmental"]["Environmental11"])],
        [project2, project3, parseFloat(content["Needs"]["Environmental"]["Environmental12"])],
        [project2, project4, parseFloat(content["Needs"]["Environmental"]["Environmental13"])],
        [project3, project1, parseFloat(content["Needs"]["Environmental"]["Environmental20"])],
        [project3, project2, parseFloat(content["Needs"]["Environmental"]["Environmental21"])],
        [project3, project3, parseFloat(content["Needs"]["Environmental"]["Environmental22"])],
        [project3, project4, parseFloat(content["Needs"]["Environmental"]["Environmental23"])],
        [project4, project1, parseFloat(content["Needs"]["Environmental"]["Environmental30"])],
        [project4, project2, parseFloat(content["Needs"]["Environmental"]["Environmental31"])],
        [project4, project3, parseFloat(content["Needs"]["Environmental"]["Environmental32"])],
        [project4, project4, parseFloat(content["Needs"]["Environmental"]["Environmental33"])]

    ]);

    ahpContext.rankCriteria(
        [
            ['Nutrition', 'Water', 3], ['Nutrition', 'Shelter', 5], ['Nutrition', 'Safety', 7], ['Nutrition', 'BasicKnowledge', 9], ['Nutrition', 'ICT', 9],['Nutrition', 'Health', 9], ['Nutrition', 'Environmental', 9],
            ['Water', 'Shelter', 3], ['Water', 'Safety', 5], ['Water', 'BasicKnowledge', 7], ['Water', 'ICT', 7], ['Water', 'Health', 7], ['Water', 'Environmental', 7],
            ['Shelter', 'Safety', 3], ['Shelter', 'BasicKnowledge', 5], ['Shelter', 'ICT', 5], ['Shelter', 'Health', 5], ['Shelter', 'Environmental', 5],
            ['Safety', 'BasicKnowledge', 3], ['Safety', 'ICT', 5], ['Safety', 'Health', 7], ['Safety', 'Environmental', 9],
            ['BasicKnowledge', 'ICT', 3], ['BasicKnowledge', 'Health', 5], ['BasicKnowledge', 'Environmental', 7],
            ['ICT', 'Health', 3], ['ICT', 'Environmental', 5],
            ['Health', 'Environmental', 3]
        ]
    );

    var output = ahpContext.run();
    Ranking = output.rankedScoreMap
    console.log(output)

   Ranking = content["Projects"]["Project0"] + ":" + Ranking[project1] + "," + content["Projects"]["Project1"] + ":" + Ranking[project2] + "," + ontent["Projects"]["Project2"] + ":" + Ranking[project3] + "," +
       ontent["Projects"]["Project3"] + ":" + Ranking[project4]


    return output;


}


module.exports = router;
