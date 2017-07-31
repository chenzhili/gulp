/**
 * Created by frank on 2016/8/31.
 */
(function () {
    'use strict';

    angular
        .module('home.controller', [])
        .controller('HomeCtrl', HomeCtrl)
        .directive('repeatFinish',function(){
            return {
                link: function(scope,element,attr){
                    if(scope.$last == true){
                        scope.$eval( attr.repeatFinish );
                    }
                }
            }
        });

    HomeCtrl.$inject = ['$scope','$yikeUtils','$rootScope','$ionicModal','$state','$ionicHistory','$ionicTabsDelegate','localStorageService','$ionicPopup','$ionicSlideBoxDelegate','$ionicLoading','$sce','$ionicPlatform'];
    /* @ngInject */
    function HomeCtrl($scope,$yikeUtils,$rootScope,$ionicModal,$state,$ionicHistory,$ionicTabsDelegate,localStorageService,$ionicPopup,$ionicSlideBoxDelegate,$ionicLoading,$sce,$ionicPlatform){
        $scope.repeatFinish = function(){
            var aa = $('.collection1 .sample_goal');
            for (var i = 0; i <aa.length; i++) {
                $(aa[i]).goalProgress({
                    goalAmount: 100,
                    currentAmount:$scope.collectDetail1[i].v4,
                    textBefore: '',
                    textAfter: '%'
                })
            }
            var bb = $('.collection2 .sample_goal');
            for (var y = 0; y <bb.length; y++) {
                $(bb[y]).goalProgress({
                    goalAmount: 100,
                    currentAmount:$scope.collectDetail2[y].v4,
                    textBefore: '',
                    textAfter: '%'
                })
            }
        };
        $scope.user=localStorageService.get('user');
        $scope.playStatus={
            sscStatus:0,
            pkStatus:0
        };
        $scope.statusReturn = statusReturn;
        $scope.openLink=openLink;
        $scope.printCollect = [];
        $scope.getcollectId = getcollectId;
        $scope.deleteCollect = deleteCollect;
        $scope.addcollect = addcollect;
        $scope.openBannerLink=openBannerLink;
        $scope.goBuyRights1 = goBuyRights1;
        $scope.openQQ = openQQ;
        $scope.QQ = "";
        // $scope.runbar = runbar;
        $scope.$on('$ionicView.afterEnter',function(){
            $('.sample_goal').goalProgress({
                goalAmount: 100,
                currentAmount: 40,
                textBefore: '',
                textAfter: '%'
            })
        });
        init();
        function init() {
            $ionicTabsDelegate.showBar(true);//隐藏开奖走势导航栏
            /*取出缓存里的方案详情*/
            $scope.collectDetail = [];
            if(localStorageService.get("myCollectionDetails1")){
                $scope.collectDetail1 = localStorageService.get("myCollectionDetails1");
            }else{
                $scope.collectDetail1 = [];
            }
            if(localStorageService.get("myCollectionDetails2")){
                $scope.collectDetail2 = localStorageService.get("myCollectionDetails2");
            }else{
                $scope.collectDetail2 = [];
            }
            banner();
            lottery();
            notice();
            initYouxiwanfa();
            pkScheme();
            myCollect();
            isShowRecharge();
            document.addEventListener("visibilitychange", onVisibilityChanged, false);
        }
        //是否显示充值按钮
        function isShowRecharge() {
            yikeTaishan.isShowRecharge()
                .then(function (data) {
                    if($ionicPlatform.is("IOS")){
                        $scope.is_open = data.result.open;
                    }else{
                        $scope.is_open = 1;
                    }
                    $scope.$digest();
                })
        }
        //在线QQ
        function openQQ(){
            cordova.InAppBrowser.open('mqqwpa://im/chat?chat_type=wpa&uin='+$scope.QQ+'&version=1&src_type=web&web_src=oicqzone.com','_system','location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=关闭')
        }
        //
        function onVisibilityChanged() {
            lottery();
        }
        // function runbar(){
        //     console.log(232);
        //     if($('.sample_goal>div').length == 0){
        //         var a = $('.sample_goal')
        //         for (var i = 0; i < a.length; i++) {
        //             $(a[i]).goalProgress({
        //                 goalAmount: 100,
        //                 currentAmount:40,
        //                 textBefore: '',
        //                 textAfter: '%'
        //             })
        //         }
        //     }else{
        //         clearInterval(checkbar);
        //     }
        // }
        // var checkbar = setInterval(function(){
        //     runbar();
        // },1000);

        //权限不够退回
        function statusReturn(){
            $yikeUtils.toast('购买权限之后才能使用此功能');
        }


        //banner
        function banner() {
            yikeTaishan.banner()
                .then(function (banner) {
                    if(banner.status == 1){
                        $scope.banners=banner.result.banner;
                        $scope.$digest();
                        new Swiper('.swiper-container-banner',{
                            direction:"horizontal",
                            loop:true,
                            pagination:'.swiper-pagination',
                            autoplay : 3500
                        });
                    }
                });
        }
        //公告列表
        function notice() {
            yikeTaishan.notice()
                .then(function (data) {
                    if(data.status == 1){
                        var pattern1=/&lt;/gim;
                        var pattern2=/&gt;/gim;
                        var pattern3=/&quot;/gim;
                        for(var i=0;i<data.result.notice.length;i++){
                            data.result.notice[i].content=data.result.notice[i].content.replace(pattern1,'<');
                            data.result.notice[i].content=data.result.notice[i].content.replace(pattern2,'>');
                            data.result.notice[i].content=data.result.notice[i].content.replace(pattern3,'"');
                            data.result.notice[i].content =$sce.trustAsHtml(data.result.notice[i].content);
                        }
                        $scope.noticeList=data.result.notice;
                        $scope.$digest();
                        jQuery(".txtMarquee-left").slide({mainCell:".bd ul",autoPlay:true,effect:"leftMarquee",vis:2,interTime:50});
                    }
                })
        }

        //首页历史开奖
        function lottery() {
            yikeTaishan.lottery('index','')
                .then(function (lottery) {
                    if(lottery.status == 1){
                        $scope.pk=lottery.result.pk10;
                        $scope.thispk = Number($scope.pk.num) +1 ;
                        $scope.pkTime = parseInt($scope.pk.difference_time);//倒计时总秒数量
                        if(moment().hour() >=0 && moment().hour() <=8){
                            $scope.playStatus.pkStatus=2;
                        }else{
                            if($scope.pkTime > 0){
                                $scope.playStatus.pkStatus=1;
                            }else{
                                $scope.playStatus.pkStatus=0;
                            }
                        }
                        pkTimer($scope.pkTime);
                        $scope.$digest();
                    }
                })
        }
        //pk倒计时
        var pkt=5;
        function pkTimer(intDiff){
            clearInterval(pksh);
            pksh=setInterval(function(){
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
                    clearInterval(pksh);
                    if(intDiff == 0){
                        lottery();
                    }else{
                        pkt--;
                        if(pkt == 0){
                            lottery();
                            pkt=5;
                        }else {
                            pkTimer(-1);
                        }
                    }
                }
                if (minute <= 9) minute = '0' + minute;
                if (second <= 9) second = '0' + second;
                // $scope.pktime=hour + ':' + minute + ':' + second;
                $scope.pktime= minute + ':' + second;
                $scope.$digest();
                intDiff--;
            }, 1000);
        }
        //跳自定义链接
        function openBannerLink(link) {
            window.open(link,'_system');
        }
        //跳转官方网站
        function openLink() {
            window.open('http://www.taishanjihua.com','_system');
        }

        function pkScheme() {
            yikeTaishan.pkScheme($scope.user.token)
                .then(function (data) {
                    $scope.allplans = data.result.plan;
                    // console.log($scope.allplans);
                    $ionicLoading.hide();
                    // if(data.status == 1){
                    //     $scope.$digest();
                    // }
                })
        }

        //我的收藏
        function myCollect() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',duration: 3000
            });
            yikeTaishan.expire($scope.user.id,$scope.user.token)
                .then(function (data) {
                    $scope.QQ = data.result.set.qq;
                    if(data.status == 1){
                        yikeTaishan.myCollect('my_collection','pk10',$scope.user.id)
                            .then(function (data) {
                                $ionicLoading.hide();
                                if(data.status == 1){
                                    $scope.collect=data.result.collection;
                                    getcollectId();
                                    $scope.$digest();
                                }else{
                                    $scope.collect=[];
                                    $yikeUtils.toast(data.result.collection);
                                }
                            })
                    }else{
                        clearInterval(pksh);
                        var alertPopup = $ionicPopup.alert({
                            title: '提示',
                            template: data.result.result,
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
                })
        }

        //购买授权
        function goBuyRights1(){
            if(Number($scope.user.is_tourists)){
                var comfirmPopup = $ionicPopup.confirm({
                    title: '游客模式',
                    template: '请先登录？',
                    okText: '确定',
                    cancelText: '取消'
                });
                comfirmPopup.then(function (res) {
                    if (res) {
                        localStorageService.remove('user');
                        $state.go('login')
                    }
                });
                return;
            }
            $rootScope.buytype = 1;
            $state.go('pay-rights');
        }


        //获取收藏ID

        function getcollectId(){
            var promiseArr = [];
            for(var i =0; i<$scope.collect.length; i++){
                promiseArr.push(yikeTaishan.pkDetails($scope.collect[i].plan_id));
            }
            Promise.all(promiseArr)
                .then(function(data){
                    for(var i=0,l=data.length;i<l;i++){
                        //为了清除缓存
                        if(i == 0){
                            $scope.collectDetail.length = 0;
                        }
                        var a = data[i].result.win1.split(' ');
                        var c ={};
                        c.v1 = a[0];
                        c.v2 = a[1];
                        c.v3 = data[i].result.win3;
                        c.v4 = data[i].result.win.rate;
                        c.v5 = data[i].result.plan.id;
                        c.v6 = data[i].result.plan.type;
                        $scope.collectDetail.push(c);
                        $scope.$digest();
                    }
                    $scope.collectDetail1 = $scope.collectDetail.slice(0,5);
                    $scope.collectDetail2 = $scope.collectDetail.slice(5);
                    localStorageService.set("myCollectionDetails1",$scope.collectDetail1);
                    localStorageService.set("myCollectionDetails2",$scope.collectDetail2);
                });
            /*for(var i =0; i<$scope.collect.length; i++){
             yikeTaishan.pkDetails($scope.collect[i].plan_id)
             .then(function (data) {
             if(i == 0){
             $scope.collectDetail.length = 0;
             }
             var a = data.result.win1.split(' ');
             var c ={};
             c.v1 = a[0];
             c.v2 = a[1];
             c.v3 = data.result.win3;
             c.v4 = data.result.win.rate;
             c.v5 = data.result.plan.id;
             c.v6 = data.result.plan.type;
             $scope.collectDetail.push(c);
             $scope.$digest();
             })
             }
             var checkbar = setInterval(function(){
             if ($('.sample_goal').length == $scope.collectDetail.length) {
             clearInterval(checkbar);
             }
             $scope.$$phase || $scope.$digest();
             },1000);
             console.log($scope.collectDetail);
             $scope.collectDetail1 = $scope.collectDetail.slice(0,5);
             $scope.collectDetail2 = $scope.collectDetail.slice(5);
             console.log($scope.collectDetail1);
             console.log($scope.collectDetail2);
             localStorageService.set("myCollectionDetails1",$scope.collectDetail1);
             localStorageService.set("myCollectionDetails2",$scope.collectDetail2);*/
        }
        //删除收藏
        function deleteCollect(id,index) {
            if(Number($scope.user.is_tourists)){
                $ionicPopup.confirm({
                    title: '游客模式',
                    template: '想更改收藏，请先登录',
                    okText: '确定',
                    cancelText: '取消'
                }).then(function (res) {
                    if (res) {
                        localStorageService.remove('user');
                        $state.go('login')
                    }
                });
                return;
            }
            if($scope.user.status == 1 || $scope.user.status == 2){
                yikeTaishan.expire($scope.user.id,$scope.user.token)
                    .then(function (data) {
                        if(data.status == 1){
                            yikeTaishan.deleteCollect('delete','pk10',id)
                                .then(function (data) {
                                    $ionicLoading.hide();
                                    if(data.status == 1){
                                        $scope.collect.splice(index,1);
                                    }
                                    $scope.collectDetail.length = 0;
                                    myCollect();
                                    $yikeUtils.toast(data.result.result);
                                })
                        }else{
                            clearInterval(pksh);
                            var alertPopup = $ionicPopup.alert({
                                title: '提示',
                                template: data.result.result,
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
                    });
            }else{
                $yikeUtils.toast('购买授权之后才能更改计划');
            }
            $scope.$digest();
        }

        //收藏方案
        function addcollect(id) {
            if(Number($scope.user.is_tourists)){
                $ionicPopup.confirm({
                    title: '游客模式',
                    template: '想更改收藏，请先登录',
                    okText: '确定',
                    cancelText: '取消'
                }).then(function (res) {
                    if (res) {
                        localStorageService.remove('user');
                        $state.go('login')
                    }
                });
                return;
            }
            if ($scope.user.status == 1 || $scope.user.status == 2) {
                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner>',duration: 3000
                });
                yikeTaishan.expire($scope.user.id,$scope.user.token)
                    .then(function (data) {
                        if(data.status == 1){
                            yikeTaishan.collect('add','2',id,$scope.user.id)
                                .then(function (data) {
                                    $ionicLoading.hide();
                                    if(data.status == 1){
                                        $scope.isShow=false;
                                    }
                                    $scope.collectDetail.length = 0;
                                    myCollect();
                                    $yikeUtils.toast(data.result.result);
                                })
                        }else{
                            clearInterval(pksh);
                            var alertPopup = $ionicPopup.alert({
                                title: '提示',
                                template: data.result.result,
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
                    });
                $scope.$$phase || $scope.$digest();
            }else{
                $yikeUtils.toast('购买授权之后才能更改计划');
                return false;
            }
        }

        function initYouxiwanfa() {
            $ionicModal.fromTemplateUrl('youxiwanfa.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (method) {
                $scope.youxiwanfaModal = method;
                $scope.openMethodModal = function () {
                    yikeTaishan.expire($scope.user.id,$scope.user.token)
                        .then(function (data) {
                            if(data.status == 1){
                                $scope.user = data.result.user;
                                localStorageService.set('user',data.result.user);
                            }
                        })
                    $scope.youxiwanfaModal.show();
                    $scope.$on('$destroy', function () {
                        $scope.youxiwanfaModal.remove();
                    });
                };
                $scope.closeMethodModal = function () {
                    $scope.youxiwanfaModal.hide();
                    $yikeUtils.toast('数据载入中', 1000, false);
                };
            });
        }

    }
})();
