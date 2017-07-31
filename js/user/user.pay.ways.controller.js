/**
 * Created by john on 2016/8/31.
 */
(function () {
    'use strict';

    angular
        .module('user.pay.ways.controller', [])
        .controller('UserPayWaysCtrl',UserPayWaysCtrl);

    UserPayWaysCtrl.$inject = ['$scope','$yikeUtils','$rootScope','$state','$ionicHistory','$ionicModal','$ionicTabsDelegate','localStorageService','$ionicPlatform'];
    /* @ngInject */
    function UserPayWaysCtrl($scope,$yikeUtils,$rootScope,$state,$ionicHistory,$ionicModal,$ionicTabsDelegate,localStorageService,$ionicPlatform) {
        var id=$state.params;
        // $scope.setPayWay = setPayWay;
        $scope.user=localStorageService.get('user');
        // console.log($state.params);
        $scope.money =$state.params.price;
        $scope.confirm = confirm;
        init();
        function init() {
            // $ionicTabsDelegate.showBar(true);//打开导航栏
        }
        // function setPayWay(way){
        //     console.log(way);
        //     $scope.payway = way;
        // }
        function confirm(way){
             $scope.payway = way;
            if($scope.payway == "wx"){
                $yikeUtils.toast('自动充值授权目前支持（支付宝）,需要（微信）支付授权请联系客服!');
            }else{
                yikeTaishan.choseChargeWay($scope.payway,id.type,$scope.user.token)
                    .then(function (data) {
                        var subStatus = data.result.set.alipay.alipay_pay;
                        if($ionicPlatform.is("IOS")){
                            if(subStatus){
                                if(data.result.list.type=='1'){
                                    try{
                                        cordova.plugins.alipay.payment(data.result.list.form,function success(e){
                                            console.log(JSON.stringify(e));
                                            $yikeUtils.toast('支付成功');
                                        },function error(e){
                                            console.log(JSON.stringify(e));
                                            $yikeUtils.toast('支付失败');
                                        });
                                    }catch(ex){
                                        $yikeUtils.toast('支付未完成');
                                    }
                                }
                            }else{
                                $ionicLoading.toast("支付功能已关闭");
                            }
                        }else{
                            if(data.result.list.type=='1'){
                                try{
                                    cordova.plugins.alipay.payment(data.result.list.form,function success(e){
                                        console.log(JSON.stringify(e));
                                        $yikeUtils.toast('支付成功');
                                    },function error(e){
                                        console.log(JSON.stringify(e));
                                        $yikeUtils.toast('支付失败');
                                    });
                                }catch(ex){
                                    $yikeUtils.toast('支付未完成');
                                }
                            }
                        }
                    });
            }

        }
    }
})();
