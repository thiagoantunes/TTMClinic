(function () {
    'use strict';
    angular
        .module('ttmclinic')
        .directive('fileSelect', fileSelect);

    function fileSelect() {

        return {
            templateUrl: 'app/components/common/directives/file-select/file-select.html',
            restrict: 'E',
            scope: {
                selection: "=",
                multi: "=",
                type: "="
            },
            controller: ['$scope', 'StorageService', 'toaster', 'SweetAlert', function ($scope, StorageService, toaster, SweetAlert) {
                activate();

                function activate() {
                    if ($scope.type != null && $scope.type == 'video') {
                        if ($scope.selection == undefined)
                            $scope.selection = {};
                        $scope.videos = StorageService.videos;
                        $scope.videos.$loaded(function (data) {
                            _.forEach(data, function (file) {
                                if (file.$value == $scope.selection.src)
                                    file.checked = true;
                            });
                        });
                    }
                    else {
                        $scope.images = StorageService.images;

                        $scope.images.$loaded(function (data) {
                            if ($scope.multi) {
                                _.forEach(data, function (file) {
                                    var checked = _.some($scope.selection, function (data) {
                                        return data.src == file.$value;
                                    });
                                    if (checked) {
                                        file.checked = true;
                                    }
                                });
                            }
                            else {
                                _.forEach(data, function (file) {
                                    if (file.$value == $scope.selection.src)
                                        file.checked = true;
                                });
                            }
                        });
                    }
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
                        var storageRef = firebase.storage().ref('images/' + imageFile.name + new Date().getTime());

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
                                $scope.cancelCrop();
                            });
                    });
                }

                $scope.uploadVideoAsPromise = function (imageFile) {
                    return new Promise(function () {
                        var storageRef = firebase.storage().ref('videos/' + imageFile.name + new Date().getTime());

                        var task = storageRef.put(imageFile);

                        task.on(firebase.storage.TaskEvent.STATE_CHANGED,
                            function (snapshot) {
                                $scope.$apply(function () {
                                    $scope.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                });
                            }, function (error) {
                                toaster.pop('error', "Ops!!", error.message);
                            }, function () {
                                StorageService.videos.$add(task.snapshot.downloadURL);
                            });
                    });
                }

                $scope.selectImageToCrop = function (img) {
                     $scope.selectedImage = img.$value;
                    //$scope.myImage = 'https://raw.githubusercontent.com/CrackerakiUA/ui-cropper/master/screenshots/live.jpg';
                    $scope.croppedImage = '';
                }

                $scope.cancelCrop = function () {
                    $scope.selectedImage = null;
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

                $scope.deleteImage = function (img) {
                    SweetAlert.swal({
                        title: 'Você tem certeza?',
                        text: 'Esta operação não tem volta',
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: 'Sim!',
                        cancelButtonText: 'Cancelar',
                        closeOnConfirm: true
                    },
                        function (isConfirm) {
                            if (isConfirm) {

                                $scope.images.$remove(img).then(function () {
                                    toaster.pop('success', "Item excluído com sucesso!");
                                }, function (error) {
                                    toaster.pop('error', "Ops!!", error.message);
                                });

                                // var storageRef = firebase.storage().refFromURL(img.$value);

                                // // Delete the file
                                // storageRef.delete().then(function () {
                                //     $scope.images.$remove(img).then(function () {
                                //         toaster.pop('success', "Item excluído com sucesso!");
                                //     }, function (error) {
                                //         toaster.pop('error', "Ops!!", error.message);
                                //     });
                                // }).catch(function (error) {
                                //     toaster.pop('error', "Ops!!", error.message);
                                // });
                            }
                        });
                }

            }]
        };

    }

}());
