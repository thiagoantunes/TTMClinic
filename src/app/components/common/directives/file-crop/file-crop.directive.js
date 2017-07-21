(function () {
    'use strict';
    angular
        .module('ttmclinic')
        .directive('fileCrop', fileCrop);

    function fileCrop() {

        return {
            templateUrl: 'app/components/common/directives/file-crop/file-crop.html',
            restrict: 'E',
            scope: {
                image: "="
            },
            controller: ['$scope', 'StorageService', 'toaster', function ($scope, StorageService, toaster) {

                activate();

                function activate() {
                    $scope.croppedImage = ''; 
                }

                $scope.uploadFiles = function (files) {
                    var i = 0;
                    if ($scope.type == 'video') {
                        for (i = 0; i < files.length; i++) {
                            $scope.uploadVideoAsPromise(files[i]);
                        }
                    }
                    else {
                        for (i = 0; i < files.length; i++) {
                            $scope.uploadImageAsPromise(files[i]);
                        }
                    }

                }

                $scope.uploadImageAsPromise = function (imageFile) {
                    return new Promise(function () {
                        var storageRef = firebase.storage().ref('images/' + imageFile.name);

                        var task = storageRef.put(imageFile);

                        task.on(firebase.storage.TaskEvent.STATE_CHANGED,
                            function (snapshot) {
                                $scope.$apply(function () {
                                    $scope.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                });
                            }, function (error) {
                                toaster.pop('error', "Ops!!", error.message);
                            }, function () {
                                StorageService.images.$add(task.snapshot.downloadURL);
                            });
                    });
                }

                $scope.addFile = function (file) {
                    if ($scope.type == 'video') {
                        _.forEach($scope.videos, function (f) {
                            f.checked = false;
                        });

                        if (!$scope.selection)
                            $scope.selection = {};

                        $scope.selection.src = file.$value;

                        _.forEach($scope.videos, function (file) {
                            if (file.$value == $scope.selection.src)
                                file.checked = true;
                        });
                    }
                    else {
                        if ($scope.multi) {
                            if ($scope.selection == undefined)
                                $scope.selection = {};
                            if (file.checked) {
                                $scope.selection[file.$id] = {
                                    src: file.$value
                                };
                            }
                            else {
                                delete $scope.selection[file.$id];
                            }
                        }
                        else {

                            _.forEach($scope.images, function (f) {
                                f.checked = false;
                            });

                            if (!$scope.selection)
                                $scope.selection = {};

                            $scope.selection.src = file.$value;

                            _.forEach($scope.images, function (file) {
                                if (file.$value == $scope.selection.src)
                                    file.checked = true;
                            });
                        }
                    }
                }

            }]
        };

    }

}());
