var app = angular.module('picsGlobal', ['ngFileUpload'])

    .controller('imageUploadController', function ($scope, Upload) {
        $scope.$watch('files', function () {
            $scope.upload($scope.files);
        });

        $scope.upload = function (files, $timeout) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    Upload.upload({
                        url: '/image',
                        method: 'POST',
                        file: file,
                        fileFormDataName: 'image'
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    }).success(function (data, status, headers, config) {
                        alert('successfully uploaded image, position in queue: ' + data);
                    });
                }
            }
        };
    })

    .controller('canvasController', function ($http, socket) {
        var canvas = angular.element(currentImage)[0];
        var ctx = canvas.getContext('2d');
        var img;

        var drawNewImage = function (noImages) {
            img = new Image();

            img.onload = function () {
                drawImageScaled(this, ctx)
            };

            img.onerror = function () {
                console.log('error occured');
                this.src = './ressources/noimges.png';
            };

            img.src = './image/current?thisAttributeIsOnlyToLetAllBrowsersIgnoreCacheAndDoesNothingFunctionalAtAllOtherwise=' + Date.now();
        };

        drawNewImage();

        socket.on('imageCycle', function () {
            drawNewImage();
        });

        //I TL;DR copy pasted this.
        // thx to GameAlchemist@Stackoverflow: http://stackoverflow.com/a/23105310
        function drawImageScaled(img, ctx) {
            var canvas = ctx.canvas;
            var hRatio = canvas.width / img.width;
            var vRatio = canvas.height / img.height;
            var ratio = Math.min(hRatio, vRatio);
            var centerShift_x = ( canvas.width - img.width * ratio ) / 2;
            var centerShift_y = ( canvas.height - img.height * ratio ) / 2;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, img.width, img.height,
                centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
        }
    })

    .controller('informationController', function ($scope, socket) {
        socket.on('initialData', function (data) {
            $scope.informations = data;
            $scope.informations.userCount = $scope.informations.userCount == 1 ? 'currently you are the only one ' : $scope.informations.userCount + ' people ';
            $scope.$apply();
        });
    })

    .service('socket', function () {
        return io.connect();
    })
;