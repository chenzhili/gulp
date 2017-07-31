/**
 * Created by frank on 2016/9/6.
 */
(function () {
    'use strict';

    angular
        .module('user.login.controller', [])
        .controller('UserLoginCtrl', UserLoginCtrl);

    UserLoginCtrl.$inject = ['$scope','$yikeUtils','$rootScope','$state','$ionicHistory','$ionicModal','localStorageService','$ionicLoading','$rootScope'];
    /* @ngInject */
    function UserLoginCtrl($scope,$yikeUtils,$rootScope,$state,$ionicHistory,$ionicModal,localStorageService,$ionicLoading){
        $scope.user={
            email:'',
            password:'',
            op:''
        };
        $scope.openQQ=openQQ;
        $scope.isOpen=window.isOpen;
        $scope.userLogin = userLogin;
        $scope.focusStyle = focusStyle;
        $scope.blurStyle = blurStyle;
        $scope.focusStyleState = 1;
        $scope.QQ = "";
        var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        $scope.login=login;
        $scope.$on('$ionicView.beforeEnter', function() {
            if(localStorageService.get('user')){
                $state.go('tab.home')
            }
            if(localStorageService.get('account')){
                $scope.user={
                    email:localStorageService.get('account').email
                };
            }
        });
        init();
        function init() {
            //是否显示充值等信息
            // yikeTaishan.isShowRecharge()
            //     .then(function (data) {
            //         $scope.isOpen=data.result.open;
            //     });
            // //获取客服微信,qq
            // yikeTaishan.personalCenter('platform','')
            //     .then(function (data) {
            //         if(data.status == 1){
            //             $scope.message=data.result;
            //             $scope.$digest();
            //         }
            //     })
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
        //客服QQ
        function openQQ(){
            yikeTaishan.banner()
                .then(function(data){
                    if(data.status == 1){
                        $scope.QQ = data.result.set.qq;
                        cordova.InAppBrowser.open('mqqwpa://im/chat?chat_type=wpa&uin='+$scope.QQ+'&version=1&src_type=web&web_src=oicqzone.com','_system','location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=关闭')
                    }
                });
        }

        /*获得焦点改变*/
        function focusStyle(){
            $scope.focusStyleState = 0;
        }
        /*失去焦点*///这里用键盘的隐藏事件
        /*window.addEventListener('native.keyboardhide', function (e) {
         console.log("能否监听键盘隐藏事件");
         $scope.focusStyleState = 1;
         });*/
        /*window.addEventListener('native.keyboardshow', function (e) {
         //e.keyboardHeight 表示软件盘显示的时候的高度
         $scope.focusStyleState = 0;
         });*/
        function blurStyle(){
            $scope.focusStyleState = 1;
        }
        /*游客登录*/
        function userLogin(){
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',duration: 3000
            });
            var userTime = (new Date()).getTime();
            yikeTaishan.register(userTime,"''","''","''",1234,1)
                .then(function(data){
                    if(data.status == 1){
                        yikeTaishan.login(userTime,1234,"phone")
                            .then(function(result){
                                $ionicLoading.hide();
                                if(result.status == 1){
                                    $scope.alluser = {
                                        id:result.result.user.id,
                                        token:result.result.user.token
                                    };
                                    localStorageService.set('alluser',$scope.alluser);
                                    localStorageService.set('user',result.result.user);
                                    localStorageService.set('account',{
                                        email:"",
                                        password:1234,
                                        op:"phone"
                                    });
                                    $state.go('tab.home');
                                }
                            });
                    }
                });
        }
        //表单验证
        function formValidation() {
            if($scope.user.email == '' || $scope.user.email == null){
                $yikeUtils.toast('请先输入帐号');
                return false;
            }else if($scope.user.password == '' || $scope.user.password == null){
                $yikeUtils.toast('请先输入密码');
                return false;
            }else{
                return true;
            }
        }
        //登录
        function login() {
            var suc=formValidation();
            if(suc){
                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner>',duration: 3000
                });
                if(filter.test($scope.user.email)){
                    $scope.user.op='email';
                }else {
                    $scope.user.op='phone';
                }
                yikeTaishan.login($scope.user.email,$scope.user.password,$scope.user.op)
                    .then(function (data) {
                        $yikeUtils.toast(data.result.result);
                        if(data.status == 1){
                            $scope.alluser = {
                                id:data.result.user.id,
                                token:data.result.user.token
                            }
                            localStorageService.set('alluser',$scope.alluser);
                            localStorageService.set('user',data.result.user);
                            localStorageService.set('account',$scope.user);
                            $state.go('tab.home');
                        }
                    })
            }
        }
        // 游客模式
        $scope.tourist=function () {
            localStorageService.set('user',{token:'2c992eec9acde07fa81bf18c2aac8133'});
            $state.go('tab.home');
        }
    }
})();
