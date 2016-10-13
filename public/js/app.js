var myapp = angular.module('myapp', ['ngRoute']);

myapp.config(function($routeProvider){
    $routeProvider
        .when("/", 
        {
            templateUrl:"../views/login.html",
            controller:"loginCtrl"
        })
        .otherwise({redirectTo:"/"});
});