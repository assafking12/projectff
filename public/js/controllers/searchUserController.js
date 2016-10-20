/**
 * Created by Assaf on 14/10/2016.
 */
myapp.controller('searchUserCtrl', function($scope, facebookService, restService, $location) {
    $scope.image = {};

    function putImageOnCanvas(p_src, p_isUrl){
        var ctx = $("#canvas")[0].getContext("2d");
        var image = new Image();

        image.onload = function() {
            // Calc the difference between the canvas' dimension and the image's dimension
            var dx = ctx.canvas.width / image.width;
            var dy = ctx.canvas.height / image.height;

            // Draw the image
            ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
            ctx.drawImage(image,0,0,image.width,image.height,0,0,ctx.canvas.width,ctx.canvas.height);

            restService.photos.findFaceInImage(p_isUrl, p_src, function(data){
                if (!data.error){
                    var ctx = $("#canvas")[0].getContext("2d");
                    data.forEach(function(currFace){
                        // Set the position of the faces caused the resize of the image
                        currFace.faceRectangle.left = currFace.faceRectangle.left * dx;
                        currFace.faceRectangle.width = currFace.faceRectangle.width * dx;
                        currFace.faceRectangle.top = currFace.faceRectangle.top * dy;
                        currFace.faceRectangle.height = currFace.faceRectangle.height * dy;

                        // Draw rect in order to display the face
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
        };

        image.src = p_src;
    }

    $scope.toggleFile = function(){
        $('#imageUpload')[0].click();
        $('#mdButtonImage')[0].blur();
    }

    $scope.refreshUrl = function(){
        putImageOnCanvas($scope.image.url, true);
    }

    facebookService.getLoginStatus(function(response){
        if (response.status !== 'connected') {
            $location.path("/");
            $scope.$apply();
        }
    });

    $scope.showPreview = function(){
        var file = $("#imageUpload")[0].files[0];

        if (file == null || file.type.indexOf('image') == -1) {
            return;
        }

        var reader = new FileReader();

        reader.addEventListener("load", function () {
            putImageOnCanvas(reader.result, false);
        }, false);

        if (file){
            reader.readAsDataURL(file);
        }
    }
});
