'use strict';

angular.module('ttmclinic')
    .controller('CategoriesController', CategoriesController);

CategoriesController.$inhect = ['$log', '$scope', '$timeout', '$sce', '$stateParams', '$uibModal', 'toaster', 'MainService', 'SweetAler'];

function CategoriesController($log, $scope, $timeout, $sce, $stateParams, $uibModal, toaster, MainService, SweetAlert) {
    var vm = this;
    vm.clinicId = $stateParams.id;
    vm.clinics = MainService.clinics;
    vm.album = [];
    vm.selectedItem = null;

    vm.createItem = createItem;
    vm.removeItem = removeItem;
    vm.selectItem = selectItem;
    vm.saveItem = saveItem;

    vm.createCategory = createCategory;
    vm.removeCategory = removeCategory;

    vm.createBanner = createBanner;
    vm.removeBanner = removeBanner;
    vm.saveBanner = saveBanner;

    vm.trustSrc = trustSrc;
    vm.openSelectImagesModal = openSelectImagesModal;
    vm.openSelectImageCoverModal = openSelectImageCoverModal;
    vm.openSelectVideoCoverModal = openSelectVideoCoverModal;
    vm.openSelectBannerModal = openSelectBannerModal;

    activate();

    function activate() {
        vm.clinics.$loaded(function () {
            vm.clinic = _.find(vm.clinics, { $id: vm.clinicId });
        });
        MainService.getCategories($stateParams.id).$loaded(function (data) {
            vm.categories = data;
        });

        MainService.getBanners($stateParams.id).$loaded(function (data) {
            vm.banners = data;
        });


        vm.newCategoryValidationOptions = {
            rules: {
                name: {
                    required: true
                }
            },
            messages: {
                name: {
                    required: 'Informe o nome da categoria'
                }
            }
        };

        vm.newBannerValidationOptions = {
            rules: {
                name: {
                    required: true
                }
            },
            messages: {
                name: {
                    required: 'Informe o nome do banner'
                }
            }
        };

        vm.editorConfig = {
            btns: [
                ['undo'],
                ['formatting'],
                'btnGrp-semantic',
                ['superscript', 'subscript'],
                ['link'],
                'btnGrp-justify',
                'btnGrp-lists',
                ['horizontalRule'],
                ['removeformat']
            ]
        };
    }

    function createItem(cat) {
        var key = firebase.database().ref().child('categories/' + vm.clinicId + '/' + cat.$id + '/items').push({
            title: 'Novo Item ' + (_.size(cat.items) + 1),
            cover: {
                src: 'https://placeholdit.imgix.net/~text?txtsize=84&txt=900%C3%97400&w=900&h=400',
                type: 'image'
            }
        }).key;
        MainService.getItem(vm.clinicId, cat.$id, key).$loaded(function (data) {
            vm.selectedItem = data;
        });
    }

    function selectItem(cat, id) {
        MainService.getItem(vm.clinicId, cat.$id, id).$loaded(function (data) {
            vm.selectedItem = data;
        });
    }

    function removeItem(cat, id) {
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
                    var item = MainService.getItem(vm.clinicId, cat.$id, id);
                    item.$remove().then(function () {
                        vm.selectedItem = null;
                        toaster.pop('success', "Item excluído com sucesso!");
                    }, function (error) {
                        toaster.pop('error', "Ops!!", error.message);
                    });
                }
            });

    }

    function saveItem() {
        vm.selectedItem.$save().then(function () {
            toaster.pop('success', "Item salvo com sucesso!");
        }, function (error) {
            toaster.pop('error', "Ops!!", error.message);
        });
    }

    function createCategory(form) {
        if (form.validate()) {
            vm.categories.$add({ name: vm.newCategoryName }).then(function () {
                toaster.pop('success', "Categoria criada com sucesso!");
                vm.newCategoryName = null;
            }, function (error) {
                toaster.pop('error', "Ops!!", error.message);
            });
        }
    }

    function removeCategory(cat, e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
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
                    vm.categories.$remove(cat).then(function () {
                        vm.selectedItem = null;
                        toaster.pop('success', "Item excluído com sucesso!");
                    }, function (error) {
                        toaster.pop('error', "Ops!!", error.message);
                    });
                }
            });
    }

    function createBanner(form) {
        if (form.validate()) {
            vm.banners.$add({ name: vm.newBannerName }).then(function () {
                toaster.pop('success', "Banner criado com sucesso!");
                vm.newBannerName = null;
            }, function (error) {
                toaster.pop('error', "Ops!!", error.message);
            });
        }
    }

    function saveBanner() {
        vm.banners.$save(vm.selectedBanner).then(function () {
            toaster.pop('success', "Banner alterado com sucesso!");
            vm.selectedBanner = null;
            vm.bannerModal.dismiss();
        }, function (error) {
            toaster.pop('error', "Ops!!", error.message);
        });
    }

    function removeBanner(banner, e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
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
                    vm.banners.$remove(banner).then(function () {
                        vm.selectedItem = null;
                        toaster.pop('success', "Item excluído com sucesso!");
                    }, function (error) {
                        toaster.pop('error', "Ops!!", error.message);
                    });
                }
            });
    }

    function openSelectImagesModal() {
        vm.imagesModal = $uibModal.open({
            templateUrl: 'select-images-modal.html',
            scope: $scope,
            size: 'lg'
        });
    }

    function openSelectImageCoverModal() {
        vm.coverImageModal = $uibModal.open({
            templateUrl: 'select-cover-image-modal.html',
            scope: $scope
        });
    }

    function openSelectVideoCoverModal() {
        vm.coverVideoModal = $uibModal.open({
            templateUrl: 'select-cover-video-modal.html',
            scope: $scope,
            size: 'lg'
        });
    }

    function openSelectBannerModal(banner) {
        vm.selectedBanner = banner;
        vm.bannerModal = $uibModal.open({
            templateUrl: 'select-banner-modal.html',
            scope: $scope,
            size: 'lg'
        });
    }

    function trustSrc(src) {
        return $sce.trustAsResourceUrl(src);
    }

}
