/**
 * Created by frank on 2016/9/8.
 */
(function () {
    'use strict';

    angular
        .module('fade.program.controller', [])
        .controller('FadeProgramCtrl', FadeProgramCtrl);
    FadeProgramCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','$ionicTabsDelegate','localStorageService','$ionicPopup','$ionicLoading',];
    /* @ngInject */
    function FadeProgramCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,$ionicTabsDelegate,localStorageService,$ionicPopup,$ionicLoading){
        $scope.user=localStorageService.get('user');
        var id=$state.params.id;
        console.log(id);
        $scope.fadenum = id;
        $scope.data = {
            time: '00:00'
        };
        $scope.playStatus=0;
        $scope.planid=$state.params.id;
        $scope.type=$state.params.type;
        $scope.typesss=$state.params;
        $scope.isShow=false;
        $scope.confirm = confirm;
        $scope.nowdate = new Date().toLocaleString( );
        $scope.rangeinit=rangeinit;
        $scope.searchitem = {
                                 num:3,
                                 code:3,
                                 rate_high:100,
                                 rate_low:0,
                                 no_num_high:10,
                                 no_num_low:0,
                                 ok_num_high:10,
                                 ok_num_low:0,
                                 current_high:10,
                                 current_low :-10
                             };
        $scope.yuplan01=['03','04','05','06','10'];
        $scope.yuplan02=['02','04','07','09','10'];
        $scope.yuplan03=['01','02','05','06','07'];
        $scope.yuplan04="单";
        $scope.yuplan05="合";
        $scope.fadeplan_01=[
            { qishu:'482-484', yuce:'01 02 03 06 07', num:2, numqishu:482, allnum:'03 05 08 09 04 07 10 02 06 01', ifgot:'中' },
            { qishu:'483-485', yuce:'01 02 06 07 08', num:1, numqishu:483, allnum:'08 04 07 06 09 05 01 10 02 03', ifgot:'中' },
            { qishu:'484-486', yuce:'02 03 04 05 09', num:2, numqishu:485, allnum:'04 06 01 10 03 05 09 07 02 02', ifgot:'中' },
            { qishu:'485-487', yuce:'01 03 04 06 08', num:1, numqishu:485, allnum:'04 06 05 07 10 08 01 09 03 02', ifgot:'中' },
            { qishu:'486-488', yuce:'01 04 07 08 10', num:2, numqishu:487, allnum:'04 10 01 09 07 05 03 06 02 08', ifgot:'中' },
            { qishu:'487-489', yuce:'01 04 05 06 10', num:3, numqishu:489, allnum:'04 10 03 05 01 06 09 08 02 07', ifgot:'中' },
            { qishu:'488-490', yuce:'03 04 05 06 10', num:3, numqishu:490, allnum:'06 08 03 07 04 01 05 02 09 10', ifgot:'中' },
            { qishu:'489-491', yuce:'01 02 04 07 08', num:3, numqishu:491, allnum:'07 04 02 09 01 03 10 05 08 06', ifgot:'中' },
            { qishu:'490-492', yuce:'01 05 06 09 10', num:1, numqishu:490, allnum:'09 01 10 03 06 04 08 07 02 05', ifgot:'中' },
            { qishu:'491-493', yuce:'01 04 05 06 08', num:2, numqishu:492, allnum:'04 02 07 10 08 05 09 01 03 06', ifgot:'中' },
        ];
        $scope.fadeplan_02=[
            { qishu:'480-482', yuce:'03 04 05 06 10', num:3, numqishu:482, allnum:'03 05 08 09 04 07 10 02 06 01', ifgot:'中' },
            { qishu:'481-483', yuce:'01 04 05 06 07', num:2, numqishu:482, allnum:'08 04 07 06 09 05 01 10 02 03', ifgot:'中' },
            { qishu:'482-484', yuce:'01 06 07 08 09', num:1, numqishu:482, allnum:'04 06 01 10 03 05 09 07 02 08', ifgot:'中' },
            { qishu:'483-485', yuce:'05 06 07 08 10', num:2, numqishu:484, allnum:'04 06 05 07 10 08 01 09 03 02', ifgot:'中' },
            { qishu:'484-486', yuce:'02 04 07 09 10', num:3, numqishu:486, allnum:'06 04 10 09 08 05 02 03 01 07', ifgot:'中' },
            { qishu:'485-487', yuce:'01 03 04 05 06', num:1, numqishu:485, allnum:'06 05 10 02 04 07 03 01 09 08', ifgot:'中' },
            { qishu:'486-488', yuce:'01 02 03 04 08', num:1, numqishu:486, allnum:'08 04 07 06 09 05 01 10 02 03', ifgot:'中' },
            { qishu:'487-489', yuce:'02 04 07 09 10', num:2, numqishu:488, allnum:'04 06 01 10 03 05 09 07 02 08', ifgot:'中' },
            { qishu:'488-490', yuce:'01 04 07 08 1o', num:3, numqishu:490, allnum:'10 06 05 07 04 08 03 01 02 09', ifgot:'中' },
            { qishu:'489-491', yuce:'01 02 04 08 10', num:2, numqishu:490, allnum:'06 08 03 07 04 01 05 02 09 10', ifgot:'中' },
        ];
        $scope.fadeplan_03=[
            { qishu:'481-483', yuce:'01 02 05 07 10', num:1, numqishu:481, allnum:'06 05 10 02 04 07 03 01 09 08', ifgot:'中' },
            { qishu:'482-484', yuce:'01 02 04 06 07', num:2, numqishu:483, allnum:'08 04 07 06 09 05 01 10 02 03', ifgot:'中' },
            { qishu:'483-485', yuce:'02 05 07 08 09', num:2, numqishu:484, allnum:'04 06 05 07 10 08 01 09 03 02', ifgot:'中' },
            { qishu:'484-486', yuce:'01 03 05 06 10', num:2, numqishu:485, allnum:'03 06 10 01 02 08 05 07 04 09', ifgot:'中' },
            { qishu:'485-487', yuce:'01 02 08 09 10', num:1, numqishu:485, allnum:'03 01 02 04 08 09 05 07 06 10', ifgot:'中' },
            { qishu:'486-488', yuce:'02 05 08 09 10', num:1, numqishu:486, allnum:'10 07 05 04 06 03 09 01 08 02', ifgot:'中' },
            { qishu:'487-489', yuce:'01 05 06 07 08', num:2, numqishu:488, allnum:'10 06 05 07 04 08 03 01 02 09', ifgot:'中' },
            { qishu:'488-490', yuce:'02 03 05 07 09', num:2, numqishu:489, allnum:'04 10 03 05 01 06 09 08 02 07', ifgot:'中' },
            { qishu:'489-491', yuce:'01 04 05 07 10', num:1, numqishu:489, allnum:'09 01 10 03 06 04 08 07 02 05', ifgot:'中' },
            { qishu:'490-492', yuce:'03 04 07 08 09', num:2, numqishu:491, allnum:'06 10 04 08 01 02 09 03 05 07', ifgot:'中' },
        ];
        $scope.fadeplan_04=[
            { qishu:'483-485', yuce:'单', num:1, numqishu:483, allnum:'05 03 08 04 10 02 07 01 06 09', ifgot:'中' },
            { qishu:'484-484', yuce:'双', num:2, numqishu:485, allnum:'02 07 05 10 09 08 06 04 01 03', ifgot:'中' },
            { qishu:'485-487', yuce:'双', num:1, numqishu:485, allnum:'08 05 03 01 09 10 07 04 06 02', ifgot:'中' },
            { qishu:'486-488', yuce:'双', num:1, numqishu:486, allnum:'08 04 07 06 09 05 01 10 02 03', ifgot:'中' },
            { qishu:'487-489', yuce:'双', num:3, numqishu:489, allnum:'04 06 01 10 03 05 09 07 02 08', ifgot:'中' },
            { qishu:'488-490', yuce:'单', num:1, numqishu:488, allnum:'01 08 03 07 04 01 05 02 09 10', ifgot:'中' },
            { qishu:'489-491', yuce:'单', num:2, numqishu:490, allnum:'09 10 03 05 01 06 09 08 02 07', ifgot:'中' },
            { qishu:'490-492', yuce:'双', num:1, numqishu:490, allnum:'04 06 05 07 10 08 01 09 03 02', ifgot:'中' },
            { qishu:'491-493', yuce:'单', num:3, numqishu:493, allnum:'03 01 02 04 08 09 05 07 06 10', ifgot:'中' },
            { qishu:'492-494', yuce:'单', num:1, numqishu:492, allnum:'03 06 10 01 02 08 05 07 04 09', ifgot:'中' },
        ];
        $scope.fadeplan_05=[
            { qishu:'482-484', yuce:'合', num:1, numqishu:482, allnum:'02 04 07 05 03 01 09 08 10 06', ifgot:'中' },
            { qishu:'483-485', yuce:'质', num:3, numqishu:485, allnum:'05 03 08 04 10 02 07 01 06 09', ifgot:'中' },
            { qishu:'484-486', yuce:'质', num:1, numqishu:484, allnum:'07 08 03 07 04 01 05 02 09 10', ifgot:'中' },
            { qishu:'485-487', yuce:'合', num:2, numqishu:486, allnum:'08 05 03 01 09 10 07 04 06 02', ifgot:'中' },
            { qishu:'486-488', yuce:'质', num:1, numqishu:486, allnum:'05 10 03 05 01 06 09 08 02 07', ifgot:'中' },
            { qishu:'487-489', yuce:'合', num:3, numqishu:489, allnum:'08 04 07 06 09 05 01 10 02 03', ifgot:'中' },
            { qishu:'488-490', yuce:'质', num:1, numqishu:488, allnum:'01 04 07 06 09 05 01 10 02 03', ifgot:'中' },
            { qishu:'489-491', yuce:'合', num:3, numqishu:491, allnum:'04 06 01 10 03 05 09 07 02 08', ifgot:'中' },
            { qishu:'490-492', yuce:'质', num:3, numqishu:492, allnum:'03 01 02 04 08 09 05 07 06 10', ifgot:'中' },
            { qishu:'491-493', yuce:'质', num:1, numqishu:491, allnum:'03 06 10 01 02 08 05 07 04 09', ifgot:'中' },
        ];
        var pksh;
        var status=0;
        $scope.$on('$ionicView.afterLeave', function() {
            clearInterval(pksh);
        });
        init();
        function init() {
            rangeinit();
            lottery();
            document.addEventListener("webkitvisibilitychange", onVisibilityChanged, false);
            $scope.mySwiper = new Swiper('#program-swiper', {
                slidesPerView : 3,
                observer:true,
            })

            yikeTaishan.pkDetails(523)
                .then(function (data) {
                    console.log(data);
                    $scope.updatetime = data.result.win2.create_time;
                })
        }
        //初始化range条
        function rangeinit (){
            console.log(2222);
            $("#searchRange1").ionRangeSlider({
                type: "double",
                grid: true,
                min: 0,
                max: 100,
                from: $scope.searchitem.rate_low,
                to: $scope.searchitem.rate_high,
                postfix: "%"
            });
            $("#searchRange2").ionRangeSlider({
                type: "double",
                grid: true,
                min: 0,
                max: 10,
                from: $scope.searchitem.no_num_low,
                to: $scope.searchitem.no_num_high
            });
            $("#searchRange3").ionRangeSlider({
                type: "double",
                grid: true,
                min: 0,
                max: 10,
                from: $scope.searchitem.ok_num_low,
                to: $scope.searchitem.ok_num_high
            });
            $("#searchRange4").ionRangeSlider({
                type: "double",
                grid: true,
                min: -10,
                max: 10,
                from: $scope.searchitem.current_low,
                to: $scope.searchitem.current_high,
                step: 1
            });
            $scope.slider1 = $("#searchRange1").data("ionRangeSlider");
            $scope.slider2 = $("#searchRange2").data("ionRangeSlider");
            $scope.slider3 = $("#searchRange3").data("ionRangeSlider");
            $scope.slider4 = $("#searchRange4").data("ionRangeSlider");
            console.log(43);
        }

        function onVisibilityChanged() {
            lottery();
        }

        function details() {
            if(status == 0){
                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner>'
                });
            }
            status=1;
            yikeTaishan.expire($scope.user.id,$scope.user.token)
                .then(function (data) {
                    if(data.status == 1){
                        if($scope.type == 1){
                            schemeDetails();
                        }else {
                        }
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
                            $ionicLoading.hide();
                            localStorageService.remove('user');
                            $state.go('login')
                        });
                    }
                });
        }

        //首页历史开奖
        function lottery() {
            yikeTaishan.lottery('index','')
                .then(function (lottery) {
                    if(lottery.status == 1){
                        $scope.pk=lottery.result.pk10;
                        $scope.thispk = Number($scope.pk.num) +1 ;
                        $scope.pkTime = parseInt($scope.pk.difference_time);//倒计时总秒数量
                        if($scope.type != 1){
                            if(moment().hour() >=0 && moment().hour() <=8){
                                $scope.playStatus=2;
                            }else{
                                if($scope.pkTime > 0){
                                    $scope.playStatus=1;
                                }else{
                                    $scope.playStatus=0;
                                }
                            }
                            pkTimer($scope.pkTime);
                        }
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
                $scope.data.time = hour + ':' + minute + ':' + second;
                $scope.$digest();
                intDiff--;
            }, 1000);
        }

        //搜索公式modal
        $ionicModal.fromTemplateUrl('templates/modal/searchway.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(searchmodal) {
            $scope.searchservice= searchmodal;
        });
        $scope.openSearchModal = function() {
                $scope.searchservice.show();
                rangeinit();
        };
        $scope.closeSearchModal = function() {
                $scope.slider1.reset();
                $scope.slider2.reset();
                $scope.slider3.reset();
                $scope.slider4.reset();
            $scope.searchservice.hide();
        };
        $scope.$on('$destroy', function () {
            $scope.searchservice.remove();
        });

        //搜索公式modal
        $ionicModal.fromTemplateUrl('templates/modal/paymodal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(paymodal) {
            $scope.payservice= paymodal;
        });
        $scope.openPayModal = function() {
            $scope.payservice.show();
        };
        $scope.closePayModal = function() {
            $scope.payservice.hide();
        };
        $scope.$on('$destroy', function () {
            $scope.payservice.remove();
        });

        function confirm(){
            $scope.openPayModal();
        }
    }
})();
