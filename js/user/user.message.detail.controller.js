/**
 * Created by frank on 2016/9/8.
 */
(function () {
    'use strict';

    angular
        .module('user.message.detail.controller', [])
        .controller('UserMessageDetailCtrl', UserMessageDetailCtrl);

  UserMessageDetailCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicLoading','$sce'];
    /* @ngInject */
    function UserMessageDetailCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicLoading,$sce){
      var id=$state.params.id;
      init();
      $scope.content = {
        content:"",
        title:"",
        time:"",
        writer:""
      };
      function init(){
        yikeTaishan.myMessageAndDetail("view","",id)
          .then(function(res){
            var pattern1=/&lt;/gim;
            var pattern2=/&gt;/gim;
            var pattern3=/&quot;/gim;
            res.result.result.content=res.result.result.content.replace(pattern1,'<');
            res.result.result.content=res.result.result.content.replace(pattern2,'>');
            res.result.result.content=res.result.result.content.replace(pattern3,'"');
            res.result.result.content =$sce.trustAsHtml(res.result.result.content);
            $scope.content.content = res.result.result.content;
            $scope.content.creation_time = moment.unix(Number(res.result.result.creation_time)).format("YYYY.MM.DD HH:mm");
            $scope.content.title = res.result.result.title;
            $scope.content.source = res.result.result.source;
            $scope.$digest();
          });
      }
    }
})();
