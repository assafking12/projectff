/**
 * Created by Assaf on 14/10/2016.
 */
myapp.service('facebookService', function(restService){
    var exportService = {};

    exportService.calcExpirationDate = function (p_expiresIn) {
        var date = new Date();
        var millis = date.getTime() + p_expiresIn * 1000;
        date = new Date(millis - date.getTimezoneOffset() * 60000);
        return date.toISOString();
    }

    exportService.login = function(p_callbackFunc) {
        FB.login(p_callbackFunc, {scope:"public_profile,user_friends,email,user_location", return_scopes: true});
    };

    exportService.getLoginStatus = function(p_callbackFunc) {
        FB.getLoginStatus(p_callbackFunc);
    };

    exportService.api = function(p_query, p_callbackFunc) {
        FB.api(p_query, p_callbackFunc);
    };

    exportService.saveUser = function(expirationDate, response, p_successFunc, p_errorFunc) {
        var user = {};
        user.id = response.authResponse.userID;
        user.token = {
            accessToken: response.authResponse.accessToken,
            expiresIn: expirationDate
        };

        exportService.api('/me?fields=name,picture', function (response){
            user.name = response.name;
            user.photo = response.picture.data.url;

            restService.users.loginUser(user, function(data){
                if (!data.error) {
                    user = data;
                    p_successFunc(user);
                } else {
                    console.log(data.error);
                    p_errorFunc();
                }
            }, function(error) {
                console.log(error);
                p_errorFunc();
            });
        });
    }

    return exportService;
});