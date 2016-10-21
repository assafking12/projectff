myapp.controller('loginCtrl', function ($scope, facebookService, restService, $location, $rootScope) {

    $scope.user = {};
    $scope.connected = false;

    // *********************************
    // ******** Facebook Login *********
    // *********************************

    facebookService.getLoginStatus(function(response){
        if (response.status === 'connected') {
            facebookService.saveUser(facebookService.calcExpirationDate(response.authResponse.expiresIn), response, function(user){
                $rootScope.user = user;
                $location.path('/search');
            }, function(){
                alert("התרחשה שגיאה");
            });
        }
    });

    $scope.FBLogin = function() {
        facebookService.login(function (response) {
            if (response.authResponse) {
                facebookService.saveUser(facebookService.calcExpirationDate(response.authResponse.expiresIn), response, function(user){
                    $rootScope.user = user;
                    $location.path('/search');
                }, function(){
                    alert("התרחשה שגיאה");
                });
            }
        });
    }

    // *********************************
    // ****** End Facebook Login *******
    // *********************************
});