/**
 * Created by john on 2016/8/30.
 */
(function () {
    'use strict';

    angular
        .module('tabs.controller', [])
        .controller('TabsCtrl', TabsCtrl);

    TabsCtrl.$inject = ['$scope','$yikeUtils','$rootScope','$state','$ionicHistory','$ionicModal','$ionicTabsDelegate','localStorageService','$ionicPopup','$cordovaImagePicker'];
    /* @ngInject */
    function TabsCtrl($scope,$yikeUtils,$rootScope,$state,$ionicHistory,$ionicModal,$ionicTabsDelegate,localStorageService,$ionicPopup,$cordovaImagePicker){
        // $scope.closeInterval=closeInterval;
        init();
        function init() {}
        // function closeInterval(status) {
        //     clearInterval(pksh);
        //     window.location.href='#/tab/'+status;
        // }
    }
})();
