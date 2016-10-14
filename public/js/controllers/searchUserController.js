/**
 * Created by Assaf on 14/10/2016.
 */
myapp.controller('searchUserCtrl', function($scope, facebookService, restService, $location) {
    $scope.uploadImage = function(){

    }

    $scope.showPreview = function(){
        var file = $("#imageUpload")[0].files[0];
        var reader = new FileReader();

        reader.addEventListener("load", function () {
            $("#imagePreview")[0].src = reader.result;
        }, false);

        if (file){
            reader.readAsDataURL(file);
        }
    }
});