/**
 * Created by john on 2016/8/31.
 */
(function () {
    'use strict';

    angular
        .module('user.pay.rights.controller', [])
        .controller('UserPayRightsCtrl',UserPayRightsCtrl);

    UserPayRightsCtrl.$inject = ['$scope','$yikeUtils','$state','$rootScope','$ionicHistory','$ionicModal','$ionicTabsDelegate','$ionicPopup','localStorageService'];
    /* @ngInject */
    function UserPayRightsCtrl($scope,$yikeUtils,$state,$rootScope,$ionicHistory,$ionicModal,$ionicTabsDelegate,$ionicPopup,localStorageService) {
        $scope.$on('$ionicView.beforeLeave', function() {
            yikeTaishan.expire($scope.user.id,$scope.user.token)
                .then(function (data) {
                    if(data.status == 1){
                        localStorageService.set('user',data.result.user);
                    }
                })
        });
        $scope.openQQ = openQQ;
        $scope.backpage = backpage;
        $scope.user=localStorageService.get('user');
        $scope.getsetWays = getsetWays;
        $scope.getList_id = getList_id;
        $scope.gonext = gonext;
        init();
        function init() {
            getsetWays();
            yikeTaishan.expire($scope.user.id,$scope.user.token)
                .then(function (data) {
                    if(data.status == 1){
                        getMessage();
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
        function openQQ(){
            window.open('mqqwpa://im/chat?chat_type=wpa&uin=3524944792&version=1&src_type=web&web_src=oicqzone.com','_system','location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=关闭')
        }
        function getMessage() {
            yikeTaishan.personalCenter('platform','')
                .then(function (data) {
                    if(data.status == 1){
                        $scope.message=data.result;
                        $scope.$digest();
                    }
                })
        }

        function getsetWays(){
            yikeTaishan.setWays()
                .then(function (data) {
                    console.log(data);
                    $scope.allways = data.result.result;
                    $scope.$$phase || $scope.$digest();
                });
        }

        function getList_id(type,price){
            $scope.chose = {};
            $scope.chose.model_id = type;
            $scope.chose.price = price;
        }
        function gonext(){
            if ($scope.chose) {
                $state.go('pay-ways',{type:$scope.chose.model_id,price:$scope.chose.price})
                // cordova.InAppBrowser.open(WX_API_URL +'?i=1&c=entry&do=package&m=yike_ts_plan&op=recharge&token='+$scope.user.token+'&id='+$scope.model_id,'_system','location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=关闭')
            }else{
                $yikeUtils.toast('请选择授权类型');
                return false;
            }
        }

        //返回上一页
        function backpage(){

            yikeTaishan.expire($scope.user.id,$scope.user.token)
                .then(function (data) {
                    if(data.status == 1){
                        localStorageService.set('user',data.result.user);
                    }
                })

            if($rootScope.buytype == 1){
                $state.go('tab.home');
            }else{
                $state.go('tab.account');
            }
        }
        //联系客服
        $ionicModal.fromTemplateUrl('templates/modal/service.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.service= modal;
        });
        $scope.openModal = function() {
            $scope.service.show();
        };
        $scope.closeModal = function() {
            $scope.service.hide();
        };
        $scope.$on('$destroy', function () {
            $scope.service.remove();
        });

    }
})();
