/**
 * Created by Assaf on 16/10/2016.
 */
myapp.service("faceService", function($http){
    var address = "http://localhost:9000/"
    var faceService = {};

    faceService.findFaceInImage = function(p_isUrl, p_urlOrBase64, p_successFunc, p_errorFunc){
        $http({
            url: address + "findFaceInImage",
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin":"*"
            },
            data: {
                isUrl: p_isUrl,
                url: p_urlOrBase64
            }
        }).success(p_successFunc).error(p_errorFunc);
    };

    return faceService;
});