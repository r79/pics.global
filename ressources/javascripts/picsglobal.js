var app = angular.module('picsGlobal', ['ngFileUpload'])
    .controller('mainController', function ($scope) {
        $scope.test = "It works with angular! And NodeJS!";

        $scope.$watch('files', function () {
            $scope.upload($scope.files);
        });

        $scope.upload = function (files, Upload) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    Upload.upload({
                        url: 'example.com',
                        file: file
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        $scope.log = 'progress: ' + progressPercentage + '% ' +
                            evt.config.file.name + '\n' + $scope.log;
                    }).success(function (data, status, headers, config) {
                        $timeout(function() {
                            $scope.log = 'file: ' + config.file.name + ', Response: ' + JSON.stringify(data) + '\n' + $scope.log;
                        });
                    });
                }
            }
        };
    });