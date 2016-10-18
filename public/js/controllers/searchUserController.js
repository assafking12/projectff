/**
 * Created by Assaf on 14/10/2016.
 */
myapp.controller('searchUserCtrl', function($scope, facebookService, restService, $location, faceService) {
    $scope.uploadImage = function(){

    }

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

            var dataURI = reader.result;
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64')>=0){
                byteString = atob(dataURI.split(',')[1]);
            } else {
                byteString = unescape(dataURI.split(',')[1]);
            }

            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            var ia = new Uint8Array(byteString.length);
            for(var i=0; i<byteString.length; i++){
                ia[i] = byteString.charCodeAt(i);
            }
            var blob = new Blob([ia], {type:mimeString});
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
