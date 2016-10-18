/**
 * Created by Assaf on 14/10/2016.
 */
myapp.service('restService', function($http) {

    // **************************
    // BASIC HTTP REQUEST METHODS
    // **************************
    function sendHttpRequestNotGetWithParams(p_url, p_method, p_data, p_successFunc, p_errorFunc) {
        $http({
            url: p_url,
            data: p_data,
            method: p_method
        }).success(p_successFunc).error(p_errorFunc);
    }

    function sendHttpRequestNotGetWithoutParams(p_url, p_method, p_successFunc, p_errorFunc){
        $http({
            url: p_url,
            method: p_method
        }).success(p_successFunc).error(p_errorFunc);
    }

    function sendHttpRequestGet(p_url, p_successFunc, p_errorFunc) {
        $http({
            url: p_url,
        }).success(p_successFunc).error(p_errorFunc);
    }

    function sendHttpRequestDelete(p_url, p_successFunc, p_errorFunc) {
        $http({
            url: p_url,
            method: "DELETE"
        }).success(p_successFunc).error(p_errorFunc);
    }

    // **************************
    // ****** END METHODS *******
    // **************************

    var exportService = {};

    // Defining the models
    var models = ['users', 'photos'];

    models.forEach(function(currModel) {
        var url = "/" + currModel + "/";
        exportService[currModel] = {
            modelUrl: url,
            getAll: function(p_successFunc, p_errorFunc) {
                sendHttpRequestGet(url + "getAll", p_successFunc, p_errorFunc);
            },
            getById: function(p_id, p_successFunc, p_errorFunc) {
                sendHttpRequestGet(url + "getById?p_id=" + p_id, p_successFunc, p_errorFunc);
            },
            insert: function(p_model, p_successFunc, p_errorFunc) {
                sendHttpRequestNotGetWithParams(url + "insert", "POST", p_model, p_successFunc, p_errorFunc);
            },
            delete: function(p_id, p_successFunc, p_errorFunc) {
                sendHttpRequestDelete(url + "delete?p_id=" + p_id, p_successFunc, p_errorFunc);
            }
        }
    });

    /**
     * Extend Users methods
     */
    angular.extend(exportService.users, {
        loginUser: function(p_user, p_successFunc, p_errorFunc) {
            sendHttpRequestNotGetWithParams(exportService.users.modelUrl + "loginUser", "POST", p_user, p_successFunc, p_errorFunc);
        }
    });

    /**
     * Extend Photos methods
     */
    angular.extend(exportService.photos, {
        findFaceInImage: function(p_isUrl, p_urlOrBase64, p_successFunc, p_errorFunc){
            var request = {
                isUrl: p_isUrl,
                url: p_urlOrBase64
            }

            var data = {request:request};

            sendHttpRequestNotGetWithParams(exportService.photos.modelUrl + "findFaceInImage","POST",data,p_successFunc,p_errorFunc);
        }
    });

    return exportService;
});