var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SpiCountrySchema = new Schema({
    "Country": String,
    "CountryCode": String,
    "SocialProgressIndex": Number,
    "BasicHumanNeeds": Number,
    "FoundationsofWellbeing": Number,
    "Opportunity": Number,
    "NutritionandBasicMedicalCare": Number,
    "WaterandSanitation": Number,
    "Shelter": Number,
    "PersonalSafety": Number,
    "AccesstoBasicKnowledge": Number,
    "AccesstoInformationandCommunications": Number,
    "HealthandWellness": Number,
    "EnvironmentalQuality": Number,
    "PersonalRights": Number,
    "PersonalFreedomandChoice": Number,
    "ToleranceandInclusion": Number,
    "AccesstoAdvancedEducation": Number,
    "Undernourishment": Number,
    "Depthoffooddeficit": Number,
    "Maternalmortalityrate": Number,
    "Childmortalityrate": Number,
    "Deathsfrominfectiousdiseases": Number,
    "Accesstopipedwater": Number,
    "Ruralaccesstoimprovedwatersource": Number,
    "Accesstoimprovedsanitationfacilities": Number,
    "Availabilityofaffordablehousing": Number,
    "Accesstoelectricity": Number,
    "Qualityofelectricitysupply": Number,
    "Householdairpollutionattributabledeaths": Number,
    "Homicide rate": Number,
    "Levelofviolentcrime": Number,
    "Perceivedcriminality": Number,
    "Politicalterror": Number,
    "Trafficdeaths": Number,
    "Adultliteracyrate": Number,
    "Primaryschoolenrollment": Number,
    "Secondaryschoolenrollment": Number,
    "Genderparityinsecondaryenrollment": Number,
    "Mobiletelephonesubscriptions": Number,
    "Internetusers": Number,
    "PressFreedomIndex": Number,
    "LifeexpectancyatSixty": Number,
    "PrematuredeathsfromNonCommunicablediseases": Number,
    "Suiciderate": Number,
    "Outdoorairpollutionattributabledeaths": Number,
    "Wastewatertreatment": Number,
    "Biodiversityandhabitat": Number,
    "Greenhousegasemissions": Number,
    "Politicalrights": Number,
    "Freedomofexpression": Number,
    "Freedomofassembly": Number,
    "Privatepropertyrights": Number,
    "Freedomoverlifechoices": Number,
    "Freedomofreligion": Number,
    "Earlymarriage": Number,
    "Satisfieddemandforcontraception": Number,
    "Corruption": Number,
    "Toleranceforimmigrants": Number,
    "Toleranceforhomosexuals": Number,
    "Discriminationandviolenceagainstminorities": Number,
    "Religioustolerance": Number,
    "Communitysafetynet": Number,
    "Yearsoftertiaryschooling": Number,
    "Womensaverageyearsinschool": Number,
    "Inequalityintheattainmenofeducation": Number,
    "Globallyrankeduniversities": Number,
    "Percentageoftertiarystudentsenrolledingloballyrankeduniversities": Number,
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