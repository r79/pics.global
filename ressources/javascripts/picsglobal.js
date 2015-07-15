var app = angular.module('picsGlobal', ['ngFileUpload', 'ngWebSocket'])

    .controller('sampleTextController', function ($scope, Upload) {
        $scope.test = "It works with angular! And NodeJS!";
    })

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
                        $scope.log = 'progress: ' + progressPercentage + '% ' +
                            evt.config.file.name + '\n' + $scope.log;
                    }).success(function (data, status, headers, config) {
                        $scope.log = 'file: ' + config.file.name + ', Response: ' + JSON.stringify(data) + '\n' + $scope.log;
                    });
                }
            }
        };
    })

    .controller('canvasController', function($http, $websocket) {
        var canvas = angular.element(currentImage)[0];
        var ctx = canvas.getContext('2d');
        var img;
        var dataStream = $websocket('wss://localhost:1337');

        dataStream.onOpen(function () {
            console.log('ws Connection established');
        });

        dataStream.onError(function () {
           console.log('ws Connection error');
        });

        var drawNewImage = function () {
            img = new Image;

            img.onload = function () {
                drawImageScaled(this, ctx)
            };

            img.src = './image/current';
        };

        //I TL;DR copy pasted this.
        // thx to GameAlchemist@Stackoverflow: http://stackoverflow.com/a/23105310
        function drawImageScaled(img, ctx) {
            var canvas = ctx.canvas ;
            var hRatio = canvas.width  / img.width    ;
            var vRatio =  canvas.height / img.height  ;
            var ratio  = Math.min ( hRatio, vRatio );
            var centerShift_x = ( canvas.width - img.width*ratio ) / 2;
            var centerShift_y = ( canvas.height - img.height*ratio ) / 2;
            ctx.clearRect(0,0,canvas.width, canvas.height);
            ctx.drawImage(img, 0,0, img.width, img.height,
                centerShift_x,centerShift_y,img.width*ratio, img.height*ratio);
        }
    });