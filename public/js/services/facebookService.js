/**
 * Created by Assaf on 14/10/2016.
 */
myapp.service('facebookService', function(){
    var exportService = {};

    exportService.login = function(p_callbackFunc) {
        FB.login(p_callbackFunc);
    };

    exportService.getLoginStatus = function(p_callbackFunc) {
        FB.getLoginStatus(p_callbackFunc);
    };

    exportService.api = function(p_query, p_callbackFunc) {
        FB.api(p_query, p_callbackFunc);
    };

    return exportService;
});