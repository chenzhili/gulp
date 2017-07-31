/**
 * Created by john on 2016/8/31.
 */
(function () {
    'use strict';

    angular
        .module('news.controller', [])
        .controller('NewsCtrl',NewsCtrl);

    NewsCtrl.$inject = ['$scope','$state','$yikeUtils','$ionicTabsDelegate','$ionicLoading','localStorageService'];
    /* @ngInject */
    function NewsCtrl($scope,$state,$yikeUtils,$ionicTabsDelegate,$ionicLoading,localStorageService) {
        $scope.user=localStorageService.get('user');
        $scope.$on('$ionicView.beforeEnter', function() {
            yikeTaishan.expire($scope.user.id,$scope.user.token)
                .then(function (data) {
                    console.log(5566);
                    console.log(data);
                    if(data.status == 1){
                        localStorageService.set('user',data.result.user);
                    }
                })
        });
        init();
        $scope.godetails = godetails;
        $scope.gomore = gomore;
        function init() {
            //   $ionicTabsDelegate.showBar(false);//隐藏导航栏
              $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
              });
              /*彩市新闻数据*/
               yikeTaishan.news()
                .then(function(data){
                        console.log(data);
                    $scope.data=data.result.result;
                    $scope.$digest();
                    $ionicLoading.hide();
                });
            //技术技巧
              yikeTaishan.workmanship()
                .then(function(data){
                        console.log(data);
                    $scope.datas=data.result.result;
                    $scope.$digest();
                    $ionicLoading.hide();
                });


              }
              function godetails(i){
                  console.log(i);
                if ($scope.user.status == 0) {
                    $yikeUtils.toast('未购买授权用户不能进行操作');
                    return false;
                }else{
                    $state.go('details',{id:i});
                }
              }

              function gomore(i){
                  console.log($scope.user.status);
                if ($scope.user.status == 0) {
                    $yikeUtils.toast('未购买授权用户不能进行操作');
                    return false;
                }else{
                    $state.go('more',{id:i})
                }
              }

              $scope.status=1;
              $scope.selectSort=function(i){
                  if (i == 2) {
                      if($scope.user.status != 2){
                          $yikeUtils.toast('非专业版用户不能进行操作');
                          return false;
                      }
                  }
                  $scope.status=i;
              };
    }
})();
