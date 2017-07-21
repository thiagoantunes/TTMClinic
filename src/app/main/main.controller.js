'use strict';

angular.module('ttmclinic')
  .controller('MainController', MainController);

MainController.$inhect = ['$log', '$scope', 'toaster', 'MainService', '$uibModal', 'SweetAlert'];

function MainController($log, $scope, toaster, MainService, $uibModal, SweetAlert) {
  var vm = this;
  vm.clinics = MainService.clinics;
  vm.selectedClinic = {};
  vm.newClinicModal = {};
  vm.emptyList = false;

  vm.logOut = logOut;

  vm.openNewClinicModal = openNewClinicModal;
  vm.closeNewClinicModal = closeNewClinicModal;
  vm.insertOrUpdate = insertOrUpdate;
  vm.openSelectLogoModal = openSelectLogoModal;
  vm.removeClinic = removeClinic;

  activate();

  function activate() {
    vm.clinics.$loaded(function (data) {
      if (data.length == 0) {
        vm.emptyList = true;
      }
    });

    vm.newClinicValidationOptions = {
      rules: {
        name: {
          required: true
        },
        password: {
          required: true,
          minlength: 6
        },
        login: {
          required: true
        },
        bgcolor: {
          required: true,
          hexcolor: true
        },
        fontcolor: {
          required: true,
          hexcolor: true
        }
      },
      messages: {
        name: {
          required: 'Informe o nome da clínica'
        },
        password: {
          required: 'Informe a senha',
          minlength: 'A senha deve ter pelo menos 6 caracteres'
        },
        login: {
          required: 'Informe o login'
        },
        bgcolor: {
          required: 'Informe a cor de fundo'
        },
        fontcolor: {
          required: 'Informe a cor da fonte'
        }
      }
    };

  }

  function logOut() {
    firebase.auth().signOut();
  }

  function openNewClinicModal(clinic) {
    if (clinic) {
      vm.selectedClinic = angular.copy(clinic);
    }
    vm.newClinicModal = $uibModal.open({
      templateUrl: 'app/main/new-clinic.html',
      scope: $scope
    });
  }

  function openSelectLogoModal() {
    vm.imagesModal = $uibModal.open({
      templateUrl: 'select-logo-modal.html',
      appendTo: angular.element('#new-clinic-form'),
      scope: $scope
    });
  }

  function closeNewClinicModal() {
    vm.newClinicModal.dismiss();
  }

  function insertOrUpdate(form) {
    if (form.validate()) {
      if (vm.selectedClinic.$id) {
        var clinic = _.find(vm.clinics, { $id: vm.selectedClinic.$id });
        clinic.name = vm.selectedClinic.name;
        clinic.slogan = vm.selectedClinic.slogan;
        clinic.description = vm.selectedClinic.description;
        clinic.logo = vm.selectedClinic.logo ? vm.selectedClinic.logo : null;
        clinic.crm = vm.selectedClinic.crm;
        clinic.login = vm.selectedClinic.login;
        clinic.password = vm.selectedClinic.password;
        clinic.bgcolor = vm.selectedClinic.bgcolor;
        clinic.fontcolor = vm.selectedClinic.fontcolor;
        vm.clinics.$save(clinic).then(function () {
          toaster.pop('success', "Clínica editada com sucesso!");
          closeNewClinicModal();
        }, function (error) {
          toaster.pop('error', "Ops!!", error.message);
        });
      }

      else {
        firebase.auth().createUserWithEmailAndPassword(vm.selectedClinic.login, vm.selectedClinic.password).then(function (user) {
          vm.clinics.$ref().child(user.uid).set(vm.selectedClinic).then(function () {
            toaster.pop('success', "Clínica criada com sucesso!");
            closeNewClinicModal();
          }, function (error) {
            toaster.pop('error', "Ops!!", error.message);
          });
        }).catch(function (error) {
          if (error.code == 'auth/email-already-in-use') {
            toaster.pop('error', "Ops!!", 'Este e-mail já está sendo usado por outra clínica');
          }
          else {
            toaster.pop('error', "Ops!!", error.message);
          }
        });
      }

      if (vm.newFile)
        uploadFirebase();
    }
  }

  function removeClinic(id) {
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
          var clinic = _.find(vm.clinics, { $id: id });
          vm.clinics.$remove(clinic).then(function () {
            vm.selectedItem = null;
            toaster.pop('success', "Item excluído com sucesso!");
          }, function (error) {
            toaster.pop('error', "Ops!!", error.message);
          });
        }
      });

  }

  function uploadFirebase() {
    var file = vm.newFile;
    // Create the file metadata
    var metadata = {
      contentType: 'image/jpeg'
    };
    var storageRef = firebase.storage().ref();
    // Upload file and metadata to the object 'images/mountains.jpg'
    var uploadTask = storageRef.child('images/' + file.name).put(file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      function (snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        $log.debug('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            $log.debug('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            $log.debug('Upload is running');
            break;
        }
      }, function (error) {
        $log.debug(error);
      }, function () {
        // Upload completed successfully, now we can get the download URL
        var downloadURL = uploadTask.snapshot.downloadURL;
        $log.debug(downloadURL);
      });
  }

}
