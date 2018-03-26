var app= angular.module("myModule",['ngRoute', 'ngResource']);


app.factory("countrylist", function($scope){
  var url="http://127.0.0.1:3000/countries";
  $http.get(url).success(function (response){
    $scope.records = response;
  });
});
