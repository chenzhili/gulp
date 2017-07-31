/**
 * Created by frank on 2016/9/8.
 */
(function () {
    'use strict';

    angular
        .module('search.details.controller', [])
        .controller('SearchDetailsCtrl', SearchDetailsCtrl)
        .directive('repeatFinish',function(){
            return {
                link: function(scope,element,attr){
                    if(scope.$last == true){
                        scope.$eval( attr.repeatFinish );
                    }
                }
            }
        });
    SearchDetailsCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','$ionicTabsDelegate','localStorageService','$ionicPopup','$ionicLoading',];
    /* @ngInject */
    function SearchDetailsCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,$ionicTabsDelegate,localStorageService,$ionicPopup,$ionicLoading){
        $scope.user=localStorageService.get('user');
        $scope.page = JSON.parse($state.params.id);

        /*切换wiper需要的id*/
        $scope.id = $scope.page[0];
        var index;
        /*ng-repeat结束后执行的函数*/
        $scope.repeatFinish = function(position){
            for(var i=0,l=$scope.collectDetail.length;i<l;i++){
                if($scope.id == $scope.collectDetail[i][4]){
                    index = i;
                    if(index || index == 0){
                        setTimeout(function(){
                            $scope.mySwiper.slideTo(index);
                            if(i <= (position-3)){
                                $scope.mySwiper.update();
                            }
                        },500);
                    }
                }
            }
        };


        $scope.data = {
            time: '00:00'
        };
        $scope.playStatus=0;
        $scope.planid=$scope.page[0];
        $scope.type=2;
        $scope.typesss=$state.params;
        $scope.isShow=false;
        $scope.myCollect=myCollect;
        $scope.getcollectId = getcollectId;
        $scope.collectDetail = [];
        $scope.copy=copy;
        $scope.changeDetails = changeDetails;
        var status=0;
        var pksh;
        $scope.$on('$ionicView.afterLeave', function() {
            clearInterval(pksh);
        });
        // $scope.$on('$ionicView.afterEnter', function () {
        //     console.log(22123);
        //   $scope.mySwiper = new Swiper('#details-swiper', {
        //       slidesPerView : 3,
        //       observer:true
        //   });
        // });
        init();
        function init() {
            myCollect();
            lottery();
            document.addEventListener("webkitvisibilitychange", onVisibilityChanged, false);
        }


        $scope.onReadySwiper = function (swiper) {
            $scope.swiper = swiper;
        };

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
                            pkDetails();
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

        function changeDetails(choseId){
            $scope.planid = choseId;
            id = choseId;
            pkDetails();
        }

        //pk10方案详情
        function pkDetails() {
            yikeTaishan.search($scope.page[0],$scope.page[1],$scope.page[2],$scope.page[3],$scope.page[4],$scope.page[5],$scope.page[6],$scope.page[7],$scope.page[8],$scope.page[9],$scope.page[10])
                .then(function (data) {
                    $ionicLoading.hide();
                    if(data.status ==1 ){
                        if(data.result.win2){
                            data.result.win2.create_time=moment.unix(Number(data.result.win2.create_time)).format("YYYY年MM月DD日 HH:mm:ss");
                        }
                        $scope.schemeDetails=data.result;
                        $scope.latestqushuall = data.result.win;
                        $scope.rightqishu =[];
                        $scope.wrongqishu = [];
                        $scope.maxarray = [];
                        delete $scope.latestqushuall.current;
                        delete $scope.latestqushuall.no_num;
                        delete $scope.latestqushuall.ok_num;
                        delete $scope.latestqushuall.rate;
                        delete $scope.latestqushuall.win;
                        var sortNumber = function(a,b){
                            return b - a
                        }
                        var percentNum = function(num,num2) {
                            return (Math.round(num / num2 * 10000) / 100.00 + "%"); //小数点后两位百分比
                        }
                        for ( var x in $scope.latestqushuall){
                            if ($scope.latestqushuall[x].is_win == "中") {
                                $scope.rightqishu.push($scope.latestqushuall[x].num);
                            }else{
                                $scope.wrongqishu.push($scope.latestqushuall[x].num);
                            }
                        }
                        for( var i in $scope.latestqushuall){
                            if ($scope.latestqushuall[i].is_win == "中"){
                                $scope.maxarray[i] = 1;
                            }else{
                                $scope.maxarray[i] = 2;
                            }
                        }
                        var count = 1;
                        $scope.arr = [];
                        $scope.arr2 = [];
                        for(var i=0,l=$scope.maxarray.length; i<l; i++){
                            if($scope.maxarray[i] == 1){
                                if($scope.maxarray[i] == $scope.maxarray[i+1]){
                                    count += 1
                                }else{
                                    $scope.arr.push(count);count=1;
                                      }
                             }else{
                                 if($scope.maxarray[i] == $scope.maxarray[i+1]){
                                     count += 1
                                 }else{
                                     $scope.arr2.push(count);count=1;
                                 }
                             }
                         };
                         if ($scope.maxarray[$scope.maxarray.length -1] == 1) {
                             $scope.rightnow1 = $scope.arr[$scope.arr.length - 1];
                         }else{
                             $scope.rightnow1 = $scope.arr2[$scope.arr2.length - 1];
                         }
                        $scope.time1st = [];$scope.time2nd = [];$scope.time3rd = [];$scope.time4th = [];
                        $scope.time5th = [];$scope.time6th = [];$scope.time7th = [];$scope.time8th = [];$scope.time9th = [];

                        // console.log($scope.rightqishu);
                       for(var i =0 ;i<$scope.rightqishu.length;i++){
                           if ($scope.rightqishu[i]==1) {
                               $scope.time1st.push($scope.rightqishu[i]);
                           }else if($scope.rightqishu[i]==2){
                               $scope.time2nd.push($scope.rightqishu[i]);
                           }else if($scope.rightqishu[i]==3){
                               $scope.time3rd.push($scope.rightqishu[i]);
                           }else if($scope.rightqishu[i]==4){
                               $scope.time4th.push($scope.rightqishu[i]);
                           }else if($scope.rightqishu[i]==5){
                               $scope.time5th.push($scope.rightqishu[i]);
                           }else if($scope.rightqishu[i]==6){
                               $scope.time6th.push($scope.rightqishu[i]);
                           }else if($scope.rightqishu[i]==7){
                               $scope.time7th.push($scope.rightqishu[i]);
                           }else if($scope.rightqishu[i]==8){
                               $scope.time8th.push($scope.rightqishu[i]);
                           }else{
                               $scope.time9th.push($scope.rightqishu[i]);
                           }
                       }
                       $scope.allrighttimes =[
                           {name:1,times:$scope.time1st.length},{name:2,times:$scope.time2nd.length},{name:3,times:$scope.time3rd.length},
                           {name:4,times:$scope.time4th.length},{name:5,times:$scope.time5th.length},{name:6,times:$scope.time6th.length},
                           {name:7,times:$scope.time7th.length},{name:8,times:$scope.time8th.length},{name:9,times:$scope.time9th.length}
                       ];
                       var qishulength = Object.keys($scope.latestqushuall).length-1;
                       $scope.rightnow = $scope.latestqushuall[qishulength].num;
                       $scope.rightmax = $scope.arr.sort(sortNumber)[0];
                       $scope.wrongmax = $scope.arr2.sort(sortNumber)[0];
                       $scope.rightrate = percentNum($scope.rightqishu.length , Object.keys($scope.latestqushuall).length);
                        $scope.latestqishu= $scope.schemeDetails.win1.split(' ')[0];
                        $scope.latestyu=$scope.schemeDetails.win1.split(' ')[2].replace("[","").replace(']','');
                        $scope.latestgoal = $scope.schemeDetails.win3.split(' ');
                        $scope.$digest();
                    }
                })
        }
        //我的收藏
        function myCollect() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
            });
            yikeTaishan.expire($scope.user.id,$scope.user.token)
                .then(function (data) {
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
        //收藏方案
        function collect() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
            });
            yikeTaishan.expire($scope.user.id,$scope.user.token)
                .then(function (data) {
                    if(data.status == 1){
                        yikeTaishan.collect('add',$scope.schemeDetails.plan.type,id,$scope.user.id)
                            .then(function (data) {
                                $ionicLoading.hide();
                                $yikeUtils.toast(data.result.result);
                                if(data.status == 1){
                                    $scope.isShow=false;
                                }
                            })
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
                })
        }

        //获取收藏ID

        function getcollectId(){
            for(var i =0; i<$scope.collect.length; i++){
                yikeTaishan.pkDetails($scope.collect[i].plan_id)
                    .then(function (data) {
                       var a = data.result.win1.split(' ');
                       var c =[];
                       c.push(a[0]);
                       c.push(a[1]);
                       c.push(data.result.win3);
                       $scope.collectDetail.push(c);
                       c.push(data.result.win.rate);
                       c.push(data.result.plan.id);
                       c.push(data.result.plan.type);
                       $scope.$digest();
                    })
            }
            $(document).ready(function(){
                $scope.mySwiper = new Swiper('#details-swiper', {
                    slidesPerView : 3,
                    observer:true
                });
            });
        }
        // 复制
        var clipboard = new Clipboard('#copyAgain', {
            text: function() {
                return $scope.schemeDetails.win3;
            }
        });

        clipboard.on('success', function(e) {
            console.log(e);
            $yikeUtils.toast("复制成功");
        });

        clipboard.on('error', function(e) {
            console.log(e);
            $yikeUtils.toast("复制失败");
        });
        function copy() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
            });
            yikeTaishan.expire($scope.user.id,$scope.user.token )
                .then(function (data) {
                    if(data.status == 1){
                        $ionicLoading.hide();
                        $scope.isShow=false;
                        cordova.plugins.clipboard.copy($scope.schemeDetails.win3);
                        $yikeUtils.toast('复制成功');
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
                        details();
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
    }
})();
