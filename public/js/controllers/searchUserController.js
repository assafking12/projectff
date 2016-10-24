/**
 * Created by Assaf on 14/10/2016.
 */
myapp.controller('searchUserCtrl', function($scope, facebookService, restService, $location, $rootScope) {
    $scope.image = {};
    $scope.foundUsers = null;

    if ($rootScope.user == null) {
        facebookService.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                facebookService.saveUser(facebookService.calcExpirationDate(response.authResponse.expiresIn), response, function(user){
                    $rootScope.user = user;
                }, function(){
                    alert("התרחשה שגיאה");
                    $location.path("/");
                    $scope.$apply();
                });
            } else {
                $location.path("/");
                $scope.$apply();
            }
        });
    }

    function putImageOnCanvas(p_src, p_isUrl){
        var ctx = $("#canvas")[0].getContext("2d");
        var image = new Image();
        $scope.faces = [];

        image.onload = function() {
            // Calc the difference between the canvas' dimension and the image's dimension
            var dx = ctx.canvas.width / image.width;
            var dy = ctx.canvas.height / image.height;

            // Draw the image
            ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
            ctx.drawImage(image,0,0,image.width,image.height,0,0,ctx.canvas.width,ctx.canvas.height);

            facebookService.getLoginStatus(function (response){
                if ($rootScope.user != null && response.status === 'connected' && response.authResponse != null && $rootScope.user.userId == response.authResponse.userID){
                    $scope.faces = null;
                    restService.photos.findFaceInImage(p_isUrl, p_src, function(data){
                        if (!data.error){
                            var faces = [];
                            $scope.selectedFace = null;
                            var ctx = $("#canvas")[0].getContext("2d");

                            if (data.length == 0) {

                            }

                            data.forEach(function(currFace){
                                // Set the position of the faces caused the resize of the image
                                var canvasFaceLocation = {
                                    left: currFace.faceRectangle.left * dx,
                                    width: currFace.faceRectangle.width * dx,
                                    top: currFace.faceRectangle.top * dy,
                                    height: currFace.faceRectangle.height * dy
                                }

                                // Save the location of the faces in array
                                // The real location (the face's location from the server) and the canvas location (where to place the face on the canvas)
                                faces.push({
                                    faceId: currFace.faceId,
                                    real: currFace.faceRectangle,
                                    canvas: canvasFaceLocation
                                });

                                // Draw rect in order to display the face
                                ctx.beginPath();
                                ctx.rect(canvasFaceLocation.left, canvasFaceLocation.top, canvasFaceLocation.width, canvasFaceLocation.height);
                                ctx.lineWidth = 7;
                                ctx.strokeStyle = 'black';
                                ctx.stroke();
                            });
                            $scope.faces = faces;
                        } else {
                            console.log(data);
                        }
                    }, function(error){
                        console.log(error);
                    });
                } else {
                    $location.path("/");
                    $scope.$apply();
                }
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

    $("#canvas").on('click', function(event){
        if ($scope.faces != null && $scope.faces.length != 0) {
            $scope.foundUsers = null;
            $scope.$apply();

            var selectedFace = [];
            var x = event.offsetX;
            var y = event.offsetY;

            // Running over all the faces in order to get the user's choice of face
            $scope.faces.forEach(function(currFace) {
                // Get the face dimension
                var top = currFace.canvas.top;
                var left = currFace.canvas.left;
                var height = currFace.canvas.height;
                var width = currFace.canvas.width;

                if (x >= left &&
                    x <= left + width &&
                    y >= top &&
                    y <= top + height){
                    selectedFace.push(currFace);
                }
            });

            var ctx = $("#canvas")[0].getContext("2d");
            if ($scope.selectedFace) {
                // Draw the rect around the face in order the mark it, because the face is changed
                ctx.beginPath();
                ctx.rect($scope.selectedFace.canvas.left, $scope.selectedFace.canvas.top, $scope.selectedFace.canvas.width, $scope.selectedFace.canvas.height);
                ctx.lineWidth = 7;
                ctx.strokeStyle = 'black';
                ctx.stroke();
            }

            if (selectedFace.length == 1) {
                $scope.selectedFace = selectedFace[0];

                // Draw rect in order to display the face differently
                ctx.beginPath();
                ctx.rect($scope.selectedFace.canvas.left, $scope.selectedFace.canvas.top, $scope.selectedFace.canvas.width, $scope.selectedFace.canvas.height);
                ctx.lineWidth = 7;
                ctx.strokeStyle = 'green';
                ctx.stroke();

                restService.photos.findUserByPhoto(selectedFace[0].faceId, function(data) {
                    $scope.foundUsers = data;
                }, function(error){
                    console.log(error);
                    alert("התרחשה שגיאה");
                });
            } else if (selectedFace.length > 1) {

            }
        }
    });

    // function getUserName(userId, callback) {
    //     facebookService.api('/' + userId + "?fields=name", function(res) {
    //         if (res.name) {
    //             callback(res.name);
    //         } else {
    //             callback("no name");
    //         }
    //     });
    // }
    //
    // $scope.reloadUsersNames = function(){
    //     restService.users.getAll(function(users) {
    //         users.forEach(function(currUser, index) {
    //             getUserName(currUser.userId, function(username) {
    //                 users[index].name = username;
    //                 if (index == users.length - 1) {
    //                     restService.users.updateMany({users: users}, function() {
    //
    //                     }, function(){
    //
    //                     });
    //                 }
    //             });
    //         });
    //     }, function(error) {
    //         console.log(error);
    //     });
    // }
});
