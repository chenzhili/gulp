/**
 * Created by frank on 2016/9/8.
 */
(function () {
    'use strict';

    angular
        .module('user.message.controller', [])
        .controller('UserMessageCtrl', UserMessageCtrl);

  UserMessageCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicLoading'];
    /* @ngInject */
    function UserMessageCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicLoading){
      var page = 1;
      $scope.loadMore = loadMore;
      $scope.refresh = refresh;
      $scope.messageTitleList = [];
      $scope.messageTitle = {
        state:0
      };
      function refresh(){
        page = 1;
        loadMoreTmeplate();
      }

      function loadMore(){
        loadMoreTmeplate();
      }
      function loadMoreTmeplate(){
        yikeTaishan.myMessageAndDetail("show",page)
          .then(function(res){
            if(res.status == 1){
              for(var i=0;i<res.result.result.length;i++){
                res.result.result[i].creation_time = moment.unix(Number(res.result.result[i].creation_time)).format("YYYY.MM.DD HH:mm");
              }
              if(page == 1){
                $scope.messageTitleList = res.result.result;
              }else{
                $scope.messageTitleList = $scope.messageTitleList.concat(res.result.result);
              }
            }
            $scope.is_loadMore=$scope.messageTitleList.length >= res.result.count;
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.$broadcast('scroll.refreshComplete');
            page++;
            $scope.$digest();
          });
      }
    }
})();
