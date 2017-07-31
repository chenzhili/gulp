/**
 * Created by john on 2016/8/31.
 */
(function () {
    'use strict';

    angular
        .module('user.feed.back.controller', [])
        .controller('UserFeedBackCtrl',UserFeedBackCtrl);

    UserFeedBackCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','$ionicTabsDelegate','localStorageService','$ionicLoading'];
    /* @ngInject */
    function UserFeedBackCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,$ionicTabsDelegate,localStorageService,$ionicLoading) {
        $scope.user=localStorageService.get('user');
        $scope.confirm = confirm;
        $scope.data = {};
        init();
        function init() {

            yikeTaishan.expire($scope.user.id,$scope.user.token)
                .then(function (data) {
                    console.log($scope.user);
                    if(data.status == 1){
                        getMessage();
                        getDatatime();
                    }else{
                        var alertPopup = $ionicPopup.alert({
                            title: '提示',
                            template: data.result.result,
                            buttons:[{
                                text:'确定',
                                type: 'button-positive'
                            }]
                        });
                        alertPopup.then(function() {
                            localStorageService.remove('user');
                            $state.go('login')
                        });
                    }
                })


        }

        function confirm(){
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
            });
            yikeTaishan.feedback($scope.data.content,$scope.user.phone)
                .then(function (data) {
                    if(data.status == 1){
                            $yikeUtils.toast('提交完成');
                        }else{
                            $yikeUtils.toast('提交失败');
                        }
                        $scope.data.content = '';             
                });
        }
        //获取客服微信,qq
        function getMessage() {
            yikeTaishan.personalCenter('platform','')
                .then(function (data) {
                    if(data.status == 1){
                        $scope.message=data.result;
                        $scope.$digest();
                    }
                })
        }
        //获取会员到期时间
        function getDatatime() {
            yikeTaishan.personalCenter('user',$scope.user.id)
                .then(function (data) {
                    if(data.status == 1){
                        if(data.result.result.sjc > 0){
                            // sscTimer(data.result.result.sjc);
                        }else{
                            var alertPopup = $ionicPopup.alert({
                                title: '提示',
                                template: data.result.result,
                                buttons:[{
                                    text:'确定',
                                    type: 'button-positive'
                                }]
                            });
                            alertPopup.then(function() {
                                localStorageService.remove('user');
                                $state.go('login')
                            });
                        }

                    }
                })
        }
    }
})();
