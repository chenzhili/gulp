/**
 * Created by john on 2016/8/31.
 */
(function () {
    'use strict';

    angular
        .module('user.about.us.controller', [])
        .controller('UserAboutUsCtrl',UserAboutUsCtrl);

    UserAboutUsCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','$ionicTabsDelegate'];
    /* @ngInject */
    function UserAboutUsCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,$ionicTabsDelegate) {

        init();
        function init() {

        }
    }
})();
