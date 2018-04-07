var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SpiCountrySchema = new Schema({
    "Country": String,
    "CountryCode": String,
    "SocialProgressIndex": Number,
    "BasicHumanNeeds": {
    "Score": Number,
        "Desc": String,
        "NutritionandBasicMedicalCare": {
        "Score": Number,
            "Desc": String,
            "Undernourishment": Number,
            "Depthoffooddeficit": Number,
            "Maternalmortalityrate": Number,
            "Childmortalityrate": Number,
            "Deathsfrominfectiousdiseases": Number
    },
    "WaterandSanitation": {
        "Score": Number,
            "Desc": String,
            "Accesstopipedwater": Number,
            "Ruralaccesstoimprovedwatersource": Number,
            "Accesstoimprovedsanitationfacilities": Number
    },
    "Shelter": {
        "Score": Number,
            "Desc": String,
            "Availabilityofaffordablehousing": Number,
            "Accesstoelectricity": Number,
            "Qualityofelectricitysupply": Number,
            "Householdairpollutionattributabledeaths": Number
    },
    "PersonalSafety": {
        "Score": Number,
            "Desc": String,
            "Homicide rate": Number,
            "Levelofviolentcrime": Number,
            "Perceivedcriminality": Number,
            "Politicalterror": Number,
            "Trafficdeaths": Number
    }
},
    "FoundationsofWellbeing": {
    "Score": Number,
        "Desc": String,
        "AccesstoBasicKnowledge": {
        "Score": Number,
            "Desc": String,
            "Adultliteracyrate": Number,
            "Primaryschoolenrollment": Number,
            "Secondaryschoolenrollment": Number,
            "Genderparityinsecondaryenrollment": Number
    },
    "AccesstoInformationandCommunications": {
        "Score": Number,
            "Desc": String,
            "Mobiletelephonesubscriptions": Number,
            "Internetusers": Number,
            "PressFreedomIndex": Number
    },
    "HealthandWellness": {
        "Score": Number,
            "Desc": String,
            "LifeexpectancyatSixty": Number,
            "PrematuredeathsfromNonCommunicablediseases": Number,
            "Suiciderate": Number
    },
    "EnvironmentalQuality": {
        "Score": Number,
            "Desc": String,
            "Outdoorairpollutionattributabledeaths": Number,
            "Wastewatertreatment": Number,
            "Biodiversityandhabitat": Number,
            "Greenhousegasemissions": Number
    }
},
    "Opportunity": {
    "Score": Number,
        "Desc": String,
        "PersonalRights": {
        "Score": Number,
            "Desc": String,
            "Politicalrights": Number,
            "Freedomofexpression": Number,
            "Freedomofassembly": Number,
            "Privatepropertyrights": Number
    },
    "PersonalFreedomandChoice": {
        "Score": Number,
            "Desc": String,
            "Freedomoverlifechoices": Number,
            "Freedomofreligion": Number,
            "Earlymarriage": Number,
            "Satisfieddemandforcontraception": Number,
            "Corruption": Number
    },
    "ToleranceandInclusion": {
        "Score": Number,
            "Desc": String,
            "Toleranceforimmigrants": Number,
            "Toleranceforhomosexuals": Number,
            "Discriminationandviolenceagainstminorities": Number,
            "Religioustolerance": Number,
            "Communitysafetynet": Number
    },
    "AccesstoAdvancedEducation": {
        "Score": Number,
            "Desc": String,
            "Yearsoftertiaryschooling": Number,
            "Womensaverageyearsinschool": Number,
            "Inequalityintheattainmenofeducation": Number,
            "Globallyrankeduniversities": Number,
            "Percentageoftertiarystudentsenrolledingloballyrankeduniversities": Number
    }
},"Culture": {
        "PowerDistance": {
            "Score": Number,
            "Desc": String
        },
        "Individualism": {
            "Score": Number,
            "Desc": String
        },
        "Masculinity": {
            "Score": Number,
            "Desc": String
        },
        "UncertaintyAvoidance": {
            "Score": Number,
            "Desc": String
        },
        "LTO": {
            "Score": Number,
            "Desc": String
        },
        "INDULGENCE": {
            "Score": Number,
            "Desc": String
        }
    },
    "DepthoffooddeficitCapped": Number,
    "AdultliteracyrateCapped": Number,
    "SecondaryschoolenrollmentCapped": Number,
    "GenderparityinsecondaryenrollmentThedifferencefromparity": Number,
    "MobiletelephonesubscriptionsCapped": Number,
    "GreenhousegasemissionsCapped": Number,
    "GloballyrankeduniversitiesBucketed": Number,
    "PercentageoftertiarystudentsenrolledingloballyrankeduniversitiesBucketed": Number
});

module.exports=mongoose.model('SpiCountry', SpiCountrySchema);