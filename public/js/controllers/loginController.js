myapp.controller('loginCtrl', function ($scope, $http, $timeout, $rootScope) {

    $scope.user = {};
    $scope.connected = false;

    // *********************************
    // ******** Facebook Login *********
    // *********************************
    // function statusChangeCallback(response) {
    //     if (response.status === 'connected') {
    //         var date = new Date();
    //         var millis = date.getTime() + response.authResponse.expiresIn * 1000;
    //         date = new Date(millis - date.getTimezoneOffset() * 60000);
    //         var expirationDate = date.toISOString();
    //         saveUser(expirationDate, response);
    //     }
    // }
    //
    // FB.init({
    //     // appId: '292046017808004',    // Prod
    //     appId: '236265666776812',       //Test
    //     status: true,
    //     cookie: true,
    //     xfbml: true,
    //     version: 'v2.4'
    // });
    //
    // FB.getLoginStatus(function (response) {
    //     if (response.status === 'connected') {
    //         var date = new Date();
    //         var millis = date.getTime() + response.authResponse.expiresIn * 1000;
    //         date = new Date(millis - date.getTimezoneOffset() * 60000);
    //         var expirationDate = date.toISOString();
    //         saveUser(expirationDate, response);
    //     }
    // });
    //
    // function checkLoginState() {
    //     FB.getLoginStatus(function(response) {
    //         statusChangeCallback(response);
    //     });
    // }

    FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            var date = new Date();
            var millis = date.getTime() + response.authResponse.expiresIn * 1000;
            date = new Date(millis - date.getTimezoneOffset() * 60000);
            var expirationDate = date.toISOString();
            saveUser(expirationDate, response);
        }
    });

    $scope.FBLogin = function() {
        FB.login(function (response) {
            if (response.authResponse) {
                var date = new Date();
                var millis = date.getTime() + response.authResponse.expiresIn * 1000;
                date = new Date(millis - date.getTimezoneOffset() * 60000);
                saveUser(date.toISOString(), response);
            }
        })
    }

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
            }).success(function(data){
                $scope.user = data;
                $scope.connected = true;
            }).error(function(error){
                console.log(error);
            });
        });
    }

    // *********************************
    // ****** End Facebook Login *******
    // *********************************
});