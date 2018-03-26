var mongoose = require('mongoose');
var Schema= mongoose.Schema;

var CountrySchema= new Schema({
  "Country": String,
  "Country Code": String,
  "Social Progress Index": Number,
  "Basic Human Needs": Number,
  "Foundations of Wellbeing": Number,
  "Opportunity": Number,
  "Nutrition and Basic Medical Care": Number,
  "Water and Sanitation": Number,
  "Shelter": Number,
  "Personal Safety": Number,
  "Access to Basic Knowledge": Number,
  "Access to Information and Communications": Number,
  "Health and Wellness": Number,
  "Environmental Quality": Number,
  "Personal Rights": Number,
  "Personal Freedom and Choice": Number,
  "Tolerance and Inclusion": Number,
  "Access to Advanced Education": Number
});

module.exports=mongoose.model('Country', CountrySchema);
