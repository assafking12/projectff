/**
 * Created by Assaf on 14/10/2016.
 */
myapp.controller('searchUserCtrl', function($scope, facebookService, restService, $location) {
    $scope.uploadImage = function(){

    }

    facebookService.getLoginStatus(function(response){
        if (response.status !== 'connected') {
            $location.path("/");
            $scope.$apply();
        }
    });

    $scope.showPreview = function(){
        var file = $("#imageUpload")[0].files[0];
        var reader = new FileReader();

        reader.addEventListener("load", function () {
            var ctx = $("#canvas")[0].getContext("2d");
            var image = new Image();
            image.src = reader.result;
            ctx.canvas.width = image.width;
            ctx.canvas.height = image.height;
            ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
            ctx.drawImage(image,0,0,image.width,image.height);

            restService.photos.findFaceInImage(false, reader.result, function(data){
                if (!data.error){
                    var ctx = $("#canvas")[0].getContext("2d");
                    data.forEach(function(currFace){
                        ctx.beginPath();
                        ctx.rect(currFace.faceRectangle.left, currFace.faceRectangle.top, currFace.faceRectangle.width, currFace.faceRectangle.height);
                        ctx.lineWidth = 7;
                        ctx.strokeStyle = 'black';
                        ctx.stroke();
                    });                        
                } else {
                    console.log(data);
                }
            }, function(error){
                console.log(error);
            });
        }, false);

        if (file){
            reader.readAsDataURL(file);
        }
    }
});