/**
 * Created by john on 2016/8/30.
 */
(function () {
    'use strict';

    angular
        .module('account.controller', [])
        .controller('AccountCtrl', AccountCtrl);

    AccountCtrl.$inject = ['$scope','$yikeUtils','$rootScope','$state','$ionicHistory','$ionicModal','$ionicTabsDelegate','localStorageService','$ionicPopup','$cordovaImagePicker','$ionicPlatform','Upload','$ionicLoading'];
    /* @ngInject */
    function AccountCtrl($scope,$yikeUtils,$rootScope,$state,$ionicHistory,$ionicModal,$ionicTabsDelegate,localStorageService,$ionicPopup,$cordovaImagePicker,$ionicPlatform,Upload,$ionicLoading){
        $scope.user=localStorageService.get('user');
        $scope.images=$scope.user.image;
        $scope.loginout=loginout;
        $scope.goBindPhone=goBindPhone;
        $scope.openQQ = openQQ;
        $scope.goBuyRights2 = goBuyRights2;
        var userTime;
        $scope.$on('$ionicView.afterLeave', function() {
            clearInterval(userTime);
        });
        init();
        function init() {
            $ionicTabsDelegate.showBar(true);//打开导航栏
            //是否显示充值等信息
            yikeTaishan.isShowRecharge()
                .then(function (data) {
                    if($ionicPlatform.is("IOS")){
                        $scope.isOpen = data.result.open;
                    }else{
                        $scope.isOpen = 1;
                    }
                    $scope.$digest();
                });
            yikeTaishan.expire($scope.user.id,$scope.user.token)
                .then(function (data) {
                    if(data.status == 1){
                        getMessage();
                        // getDatatime();
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
        //购买授权
        function goBuyRights2(){
            $rootScope.buytype = 2;
            $state.go('pay-rights');
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
        // function getDatatime() {
        //     yikeTaishan.personalCenter('user',$scope.user.id)
        //         .then(function (data) {
        //             if(data.status == 1){
        //                 if(data.result.result.sjc > 0){
        //                     // sscTimer(data.result.result.sjc);
        //                 }else{
        //                     var alertPopup = $ionicPopup.alert({
        //                         title: '提示',
        //                         template: data.result.result,
        //                         buttons:[{
        //                             text:'确定',
        //                             type: 'button-positive'
        //                         }]
        //                     });
        //                     alertPopup.then(function() {
        //                         localStorageService.remove('user');
        //                         // $state.go('login')
        //                     });
        //                 }
        //
        //             }
        //         })
        // }
        //在线QQ
        function openQQ(){
            // if (!cordova.InAppBrowser) {
            //     return;
            // }
            // window.open("http://wpa.qq.com/msgrd?V=1&amp;Uin=563941370&amp","_system",options)
            window.open('mqqwpa://im/chat?chat_type=wpa&uin=3524944792&version=1&src_type=web&web_src=oicqzone.com','_system','location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=关闭')
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
        //用户账户到期倒计时
        // function sscTimer(intDiff){
        //     clearInterval(userTime);
        //     userTime=setInterval(function(){
        //         // var day=0,
        //         //     hour=0,
        //         //     minute=0,
        //         //     second=0;//时间默认值
        //         if(intDiff > 0){
        //             // day = Math.floor(intDiff / (60 * 60 * 24));
        //             // hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
        //             // minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
        //             // second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        //         // var endSeconds = new Date().getTime()+intDiff;
        //         var unixTimestamp = new Date( new Date().getTime()+intDiff ) ;
        //         var commonTime = unixTimestamp.toLocaleString();
        //         }else{
        //             clearInterval(userTime);
        //             var alertPopup = $ionicPopup.alert({
        //                 title: '提示',
        //                 template: '您的会员时间已到期',
        //                 buttons:[{
        //                     text:'确定',
        //                     type: 'button-positive'
        //                 }]
        //             });
        //             alertPopup.then(function() {
        //                 $ionicLoading.hide();
        //                 localStorageService.remove('user');
        //                 $state.go('login')
        //             });
        //         }
        //         // if (minute <= 9) minute = '0' + minute;
        //         // if (second <= 9) second = '0' + second;
        //         $scope.datatime=commonTime.split(' ')[0];
        //
        //         // day + '天' + hour + '时' + minute + '分' + second + '秒';
        //         $scope.$digest();
        //         intDiff--;
        //     }, 1000);
        // }
        function sscTimer(intDiff){
            clearInterval(userTime);
            userTime=setInterval(function(){
                var day=0,
                    hour=0,
                    minute=0,
                    second=0;//时间默认值
                if(intDiff > 0){
                    day = Math.floor(intDiff / (60 * 60 * 24));
                    hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
                    minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
                    second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
                }else{
                    clearInterval(userTime);
                    var alertPopup = $ionicPopup.alert({
                        title: '提示',
                        template: '您的会员时间已到期',
                        buttons:[{
                            text:'确定',
                            type: 'button-positive'
                        }]
                    });
                    alertPopup.then(function() {
                        $ionicLoading.hide();
                        localStorageService.remove('user');
                        $state.go('login')
                    });
                }
                if (minute <= 9) minute = '0' + minute;
                if (second <= 9) second = '0' + second;
                $scope.datatime=day + '天' + hour + '时' + minute + '分' + second + '秒';
                $scope.$digest();
                intDiff--;
            }, 1000);
        }
        //退出登录
        function loginout() {
            yikeTaishan.expire($scope.user.id,$scope.user.token)
                .then(function (data) {
                    if(data.status == 1){
                        var comfirmPopup = $ionicPopup.confirm({
                            title: '退出登录',
                            template: '确认要退出登录？',
                            okText: '确定',
                            cancelText: '取消'
                        });
                        comfirmPopup.then(function (res) {
                            if (res) {
                                yikeTaishan.logout($scope.user.id)
                                    .then(function (data) {
                                        $yikeUtils.toast(data.result.result);
                                        if(data.status == 1){
                                            localStorageService.remove('user');
                                            $state.go('login');
                                        }
                                    })
                            }
                        });
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
        //跳转绑定手机页面
        function goBindPhone() {
            if($scope.user.phone == ''){
                $state.go('bind-phone');
            }else{
                $state.go('linked-phone');
            }
        }
        //上传头像
        /*function pickImage() {
            yikeTaishan.expire($scope.user.id,$scope.user.token)
                .then(function (data) {
                    if(data.status == 1){
                        var options = {
                            maximumImagesCount: 1,
                            width: 200,
                            height: 200,
                            quality: 80
                        };
                        $cordovaImagePicker.getPictures(options)
                            .then(function (results) {
                                if(results.length > 0){
                                    $scope.images = results[0];
                                    var fileURL = $scope.images;
                                    var url = encodeURI("http://taishanjihua.com/app/index.php?i=2&c=entry&m=yike_ts_plan&do=image_upload");
                                    var option = new FileUploadOptions();
                                    option.fileKey = "imgs";
                                    option.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
                                    option.mimeType = "image/jpeg";
                                    var params = {};
                                    params.uid = $scope.user.id;
                                    option.params = params;
                                    var ft = new FileTransfer();
                                    ft.upload(fileURL, url, onSuccess, onError, option);
                                }
                            }, function (error) {
                                // error getting photos
                                $yikeUtils.toast('上传失败')
                            });
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
        function onSuccess(r) {
            var data=JSON.parse(r.response);
            $scope.user.image=data.result.image;
            localStorageService.set('user',$scope.user);
            $yikeUtils.toast('上传成功');
        }
        //图片上传失败回调
        function onError(error) {
            $yikeUtils.toast("错误发生了，请重试 = " + error.code);
            // console.log("upload error source " + error.source);
            // console.log("upload error target " + error.target);
        }*/
        $scope.upload = function (file) {
            Upload.upload({
                url: WX_API_URL+"?i=1&c=entry&m=yike_ts_plan&do=image_upload",
                data: {imgs: file}
            }).then(function (resp) {
                if(resp.data.status ==1){
                    $scope.images=resp.data.result.image;
                    $scope.user.image = $scope.images;
                    localStorageService.set("user",$scope.user);
                    $yikeUtils.toast('上传成功');
                }else {
                    $yikeUtils.toast('上传失败');
                }
                // console.log('Success ' + 'uploaded. Response: ' + resp.data);
            }, function (resp) {
                $yikeUtils.toast('上传失败,请重试');
                // console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                $ionicLoading.show({
                    template: "已经上传：" + progressPercentage + "%"
                });
                if (progressPercentage > 99.9) {
                    $ionicLoading.hide();
                }
            });
        };
    }
})();
