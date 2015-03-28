 var myapp = angular.module('myapp', ['ngRoute']);

 // configure our routes
 myapp.config(function($routeProvider) {

     $routeProvider

     // home page
     .when('/', {
         templateUrl: 'pages/input.html',
         controller: 'inputController'
     })

     // about page
     .when('/result', {
         templateUrl: 'pages/result.html',
         controller: 'resultController'
     })

     // contact page
     .when('/input', {
         templateUrl: 'pages/input.html',
         controller: 'inputController'
     });

 });
 // create the controller and inject Angular's $scope
 myapp.controller('mainController', function($scope) {
     // create a message to display in our view
     $scope.message = 'Everyone come and see how good I look!';
 });