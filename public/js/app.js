var myapp = angular.module('myapp', ['ngRoute', 'ngMaterial']);

FB.init({
    appId: '292046017808004',    // Prod
    // appId: '236265666776812',       //Test
    status: true,
    cookie: true,
    version: 'v2.8'
});

myapp.config(function($routeProvider){
    $routeProvider
        .when("/", 
        {
            templateUrl:"../views/login.html",
            controller:"loginCtrl"
        })
        .when("/search",
        {
            templateUrl: "../views/searchUser.html",
            controller: "searchUserCtrl"
        })
        .otherwise({redirectTo:"/"});
});