/**
 * Created by HL on 2017/2/7.
 */
(function(){

    (function () {
            'use strict';

            angular
            .module('user.details.controller', [])
            .controller('UserDetailsCtrl',UserDetailsCtrl);
            UserDetailsCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicLoading','$sce'];
            /* @ngInject */
            function UserDetailsCtrl($scope,$yikeUtils,$state,$ionicLoading,$sce) {
            var id=$state.params.id;
            init();
            function init() {
                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner>'
                });

                yikeTaishan.more(id)
                 .then(function(data){
                     console.log(data) ;
                    $scope.word=data.result.result;
                    $ionicLoading.hide();
                })

               yikeTaishan.details(id)
                .then(function(data){
                $scope.detailsname=data.result.result.name;
                var pattern1=/&lt;/gim;
                var pattern2=/&gt;/gim;
                var pattern3=/&quot;/gim;
                data.result.result.content=data.result.result.content.replace(pattern1,'<');
                data.result.result.content=data.result.result.content.replace(pattern2,'>');
                data.result.result.content=data.result.result.content.replace(pattern3,'"');
                data.result.result.content =$sce.trustAsHtml(data.result.result.content);
                $scope.text=data.result.result.content;
                $scope.$digest();
                $ionicLoading.hide();
                })
            }

        }
    })();
})();
