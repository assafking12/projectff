myapp.controller('loginCtrl', function ($scope, $http) {

    $scope.user = {};
    $scope.connected = false;

    // *********************************
    // ******** Facebook Login *********
    // *********************************
    function statusChangeCallback(response) {
        if (response.status === 'connected') {
            var date = new Date();
            var millis = date.getTime() + response.authResponse.expiresIn * 1000;
            date = new Date(millis - date.getTimezoneOffset() * 60000);
            var expirationDate = date.toISOString();
            saveUser(expirationDate, response);
        }
    }

    // window.fbAsyncInit = function () {
    //
    //
    //
    // };

    FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            var date = new Date();
            var millis = date.getTime() + response.authResponse.expiresIn * 1000;
            date = new Date(millis - date.getTimezoneOffset() * 60000);
            var expirationDate = date.toISOString();
            saveUser(expirationDate, response);
        }
    });

    function saveUser(expirationDate, response) {        
        $scope.user.id = response.authResponse.userID;
        $scope.user.token = {
            accessToken: response.authResponse.accessToken,
            expiresIn: expirationDate
        };

        FB.api('/me?fields=name,picture', function (response) {
            $scope.user.name = response.name;
            $scope.user.photo = response.picture.data.url;
            $http({
                method:"POST",
                data: $scope.user,
                url: "/users/loginUser"
            }).then(function(data){
                $scope.user = data.data;
                $scope.connected = true;
            }, function(error){

            });
        });
    }

    // *********************************
    // ****** End Facebook Login *******
    // *********************************
});