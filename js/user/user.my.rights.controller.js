/**
 * Created by john on 2016/8/31.
 */
(function () {
    'use strict';

    angular
        .module('user.my.rights.controller', [])
        .controller('UserMyRightsCtrl',UserMyRightsCtrl);

    UserMyRightsCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','localStorageService','$ionicModal','$ionicPopup','$ionicTabsDelegate'];
    /* @ngInject */
    function UserMyRightsCtrl($scope,$yikeUtils,$state,$ionicHistory,localStorageService,$ionicModal,$ionicPopup,$ionicTabsDelegate) {
        $scope.user=localStorageService.get('user');
        console.log($scope.user);
        if ($scope.user.status == 0) {
            $scope.buystatus = '未购买';
        }else if($scope.user.status == 1){
            $scope.buystatus = '标准版';
        }else{
            $scope.buystatus = '专业版';
        }
        $scope.endtime = Number($scope.user.end_time)*1000;

        init();
        function init() {
            // $ionicTabsDelegate.showBar(true);//打开导航栏
        }

    }
})();
