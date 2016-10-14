myapp.controller('loginCtrl', function ($scope, $http, facebookService, restService, $location) {

    $scope.user = {};
    $scope.connected = false;

    // *********************************
    // ******** Facebook Login *********
    // *********************************

    facebookService.getLoginStatus(function(response){
        if (response.status === 'connected') {
            var date = new Date();
            var millis = date.getTime() + response.authResponse.expiresIn * 1000;
            date = new Date(millis - date.getTimezoneOffset() * 60000);
            var expirationDate = date.toISOString();
            saveUser(expirationDate, response);
        }
    });

    $scope.FBLogin = function() {
        facebookService.login(function (response) {
            if (response.authResponse) {
                var date = new Date();
                var millis = date.getTime() + response.authResponse.expiresIn * 1000;
                date = new Date(millis - date.getTimezoneOffset() * 60000);
                saveUser(date.toISOString(), response);
            }
        });
    }

    function saveUser(expirationDate, response) {
        $scope.user.id = response.authResponse.userID;
        $scope.user.token = {
            accessToken: response.authResponse.accessToken,
            expiresIn: expirationDate
        };

        facebookService.api('/me?fields=name,picture', function (response){
            $scope.user.name = response.name;
            $scope.user.photo = response.picture.data.url;

            restService.users.loginUser($scope.user, function(data){
                $scope.user = data;
                $scope.connected = true;
                $location.path("/search");
            }, function(error) {
                console.log(error);
                alert("התרחשה שגיאה");
            })
        });
    }

    // *********************************
    // ****** End Facebook Login *******
    // *********************************
});