/**
 * Created by HL on 2017/2/6.
 */
(function () {
    'use strict';
    angular
        .module('more.controller', [])
        .controller('MoreCtrl',MoreCtrl);

    MoreCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicLoading'];
    /* @ngInject */
    function MoreCtrl($scope,$yikeUtils,$state,$ionicLoading) {
        var id=$state.params.id;
        init();
        $scope.godetails = godetails;
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
        }

        function godetails(i){
              $state.go('details',{id:i});
        }

    }
})();
