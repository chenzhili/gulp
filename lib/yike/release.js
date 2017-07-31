// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var pksh;
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'yike', 'tab.module','user.module','LocalStorageModule','ngCordova','platform.module','ksSwiper','ngFileUpload'])

    .run(["$ionicPlatform","$rootScope", "$location","$yikeUtils","$state","$ionicHistory","$cordovaToast","$ionicLoading","$ionicPopup","$timeout"
        ,function ($ionicPlatform,$rootScope, $location,$yikeUtils,$state,$ionicHistory,$cordovaToast,$ionicLoading,$ionicPopup,$timeout) {
        //连接超时
        window.connectionTimeout = function () {
            $yikeUtils.toast('请求超时');
        };


        if (window.cordova && window.cordova.InAppBrowser) {
            window.open = window.cordova.InAppBrowser.open;
        }
        document.addEventListener("offline", onOffline, false);
        function onOffline() {
            $yikeUtils.toast('未连接网络');
        }
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
            cordova.plugins.Keyboard.disableScroll(false);
            if (cordova.InAppBrowser) {
                window.open = cordova.InAppBrowser.open;
            }
        }
        var appUpdate = {
            // Application Constructor
            initialize: function() {
                this.bindEvents();
            },
            // Bind any events that are required.
            // Usually you should subscribe on 'deviceready' event to know, when you can start calling cordova modules
            bindEvents: function() {
                document.addEventListener('deviceready', this.onDeviceReady, false);
                document.addEventListener('chcp_updateLoadFailed', this.onUpdateLoadError, false);
            },
            // deviceready Event Handler
            onDeviceReady: function() {
            },
            onUpdateLoadError: function(eventData) {
                var error = eventData.detail.error;

                // 当检测出内核版本过小
                if (error && error.code == chcp.error.APPLICATION_BUILD_VERSION_TOO_LOW) {
                    var dialogMessage = '有新的版本,请下载更新';

                    // iOS端 直接弹窗提示升级，点击ok后自动跳转
                    if(ionic.Platform.isIOS()){
                        chcp.requestApplicationUpdate(dialogMessage, this.userWentToStoreCallback, this.userDeclinedRedirectCallback);
                        // Android端 提示升级下载最新APK文件
                    }else if(ionic.Platform.isAndroid()){
                        var confirmPopup = $ionicPopup.confirm({
                            template: '有新的版本,请下载更新',
                            cssClass: 'popup',
                            cancelText:'取消',
                            okText:'升级'
                        });
                        confirmPopup.then(function (res) {
                            if (res) {
                                $ionicLoading.show({
                                    template: "已经下载：0%"
                                });
                                window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(fileEntry) {
                                    fileEntry.getDirectory("jiucaijihua", { create: true, exclusive: false }, function (f) {
                                        //下载代码
                                        var fileTransfer = new FileTransfer();
                                        fileTransfer.download("http://114.215.222.89/platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk", f.toInternalURL()+"jiucaijihua.apk", function(entry) {
                                            // 打开下载下来的APP
                                            window.plugins.webintent.startActivity({
                                                    action: window.plugins.webintent.ACTION_VIEW,
                                                    url: entry.toInternalURL(),
                                                    type: 'application/vnd.android.package-archive'
                                                },
                                                function() {},
                                                function() {
                                                    $yikeUtils.toast('Failed to open URL via Android Intent.');
                                                    // console.log("Failed to open URL via Android Intent. URL: " + theFile.fullPath)
                                                }
                                            );
                                        }, function(err) {
                                        },true);
                                        fileTransfer.onprogress = function(progressEvent) {
                                            $timeout(function () {
                                                var downloadProgress = (progressEvent.loaded / progressEvent.total) * 100;
                                                $ionicLoading.show({
                                                    template: "已经下载：" + Math.floor(downloadProgress) + "%"
                                                });
                                                if (downloadProgress > 99) {
                                                    $ionicLoading.hide();
                                                }
                                            });
                                        };
                                    },function(err){alert("创建失败")});
                                });
                            }
                        });
                    }
                }
            },
            userWentToStoreCallback: function() {
                // user went to the store from the dialog
            },
            userDeclinedRedirectCallback: function() {
                // User didn't want to leave the app.
                // Maybe he will update later.
            }
        };
        appUpdate.initialize();
        //双击退出
        $ionicPlatform.registerBackButtonAction(function (e) {
            //判断处于哪个页面时双击退出
            var path = $location.path();
            if (path == '/tab/home' || path == '/tab/account' || path == '/tab/lottery' || path == '/login') {
                if ($rootScope.backButtonPressedOnceToExit) {
                    ionic.Platform.exitApp();
                } else {
                    $rootScope.backButtonPressedOnceToExit = true;
                    $cordovaToast.show('再按一次退出系统',1000,'bottom');
                    setTimeout(function () {
                        $rootScope.backButtonPressedOnceToExit = false;
                    }, 2000);
                }
            }else if ($ionicHistory.backView()) {
                $ionicHistory.goBack();
            }else{
                $rootScope.backButtonPressedOnceToExit = true;
                $cordovaToast.show('再按一次退出系统',1000,'bottom');
                setTimeout(function () {
                    $rootScope.backButtonPressedOnceToExit = false;
                }, 2000);
            }
            e.preventDefault();
            return false;
        }, 101);
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
                //延迟splash screnn 隐藏时间,不然会有短暂的白屏出现
                setTimeout(function () {
                    navigator.splashscreen.hide();
                }, 1000);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    }])
    .config(["$stateProvider", "$urlRouterProvider", "$ionicConfigProvider",function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.tabs.style('standard');
        $ionicConfigProvider.navBar.alignTitle('center');
        $ionicConfigProvider.backButton.icon('ion-ios-arrow-left');
        $ionicConfigProvider.views.maxCache(0);
        $ionicConfigProvider.views.swipeBackEnabled(false);
        // $ionicC
        // $ionicConfigProvider.views.transition('none');
        $ionicConfigProvider.scrolling.jsScrolling(true);
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

        // setup an abstract state for the tabs directive
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html',
                controller:'TabsCtrl'
            })
            //首页
            .state('tab.home', {
                url: '/home',
                views: {
                    'tab-home': {
                        templateUrl:'templates/tab-home.html',
                        controller: 'HomeCtrl',
                        cache: false
                    }
                }
            })
            //历史开奖
            .state('tab.lottery', {
                url: '/lottery',
                views: {
                    'tab-lottery': {
                        templateUrl:'templates/tab-lottery.html',
                        controller: 'LotteryCtrl'
                    }
                }
            })
            // 秘籍
            .state('news', {
                url: '/news',
                templateUrl:'templates/tab-news.html',
                controller: 'NewsCtrl'
            })
            // 我的消息列表
            .state('my-message', {
                url: '/my-message',
                templateUrl:'templates/my-message.html',
                controller: 'UserMessageCtrl'
            })
            //我的消息详情
            .state('my-message-detail', {
                url: '/my-message-detail/:id',
                templateUrl: 'templates/my-message-detail.html',
                controller:'UserMessageDetailCtrl'
            })
            //开奖走势
            .state('tab.movements', {
                url: '/movements',
                views: {
                    'tab-movements': {
                        templateUrl: 'templates/tab-movements.html',
                        controller: 'MovementsCtrl'
                    }
                }
            })
            //个人中心
            .state('tab.account', {
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/tab-account.html',
                        controller: 'AccountCtrl'
                    }
                }
            })
            //推荐方案
            .state('recommend-program', {
                url: '/recommend-program/:playType',
                templateUrl: 'templates/recommend-program.html',
                controller:'PlatformSchemeCtrl'
            })
            //方案详情
            .state('program-details', {
                url: '/program-details/:id/:type',
                templateUrl: 'templates/program-details.html',
                controller:'PlatformProgramDetailsCtrl',
                cache:false
            })
            //假的方案
            .state('fade-program', {
                url: '/fade-program/:id',
                templateUrl: 'templates/fade-program.html',
                controller:'FadeProgramCtrl',
                cache:false
            })
            //我的方案
            .state('my-scheme', {
                url: '/my-scheme',
                templateUrl: 'templates/my-scheme.html',
                controller:'UserSchemeCtrl'
            })
            //注册
            .state('register', {
                url: '/register',
                templateUrl: 'templates/user-register.html',
                controller:'UserRegisterCtrl'
            })
            //充值
            .state('recharge', {
                url: '/recharge',
                templateUrl: 'templates/user-recharge.html',
                controller:'UserRechargeCtrl'
            })
            //验证邮箱
            .state('verification-email', {
                url: '/verification-email/:uid',
                templateUrl: 'templates/verification-email.html',
                controller:'UserVerificationEmailCtrl'
            })
            //重置密码
            .state('reset-password', {
                url: '/reset-password',
                templateUrl: 'templates/reset-password.html',
                controller:'UserResetPasswordCtrl'
            })
            //修改密码
            .state('modification-password', {
                url: '/modification-password',
                templateUrl: 'templates/modification-password.html',
                controller:'UserModificationPasswordCtrl'
            })
            //登录
            .state('login', {
                url: '/login',
                templateUrl: 'templates/user-login.html',
                controller:'UserLoginCtrl'
            })
            //绑定手机
            .state('bind-phone', {
                url: '/bind-phone',
                templateUrl: 'templates/bind-phone.html',
                controller:'UserBindPhoneCtrl'
            })
            //已绑定手机
            .state('linked-phone', {
                url: '/linked-phone',
                templateUrl: 'templates/linked-phone.html',
                controller:'UserLinkedPhoneCtrl'
            })
            //续费授权
            .state('pay-rights', {
                url: '/pay-rights',
                templateUrl: 'templates/pay-rights.html',
                controller:'UserPayRightsCtrl'
            })
            //续费授权
            .state('my-rights', {
                url: '/my-rights',
                templateUrl: 'templates/my-rights.html',
                controller:'UserMyRightsCtrl'
            })
            //支付页
            .state('pay-ways', {
                url: '/pay-ways/:type/:price',
                templateUrl: 'templates/pay-ways.html',
                controller:'UserPayWaysCtrl'
            })
            // 关于我们
            .state('about-us', {
                url: '/about-us',
                templateUrl: 'templates/about-us.html',
                controller:'UserAboutUsCtrl'
            })
            // 意见反馈
            .state('feed-back', {
                url: '/feed-back',
                templateUrl: 'templates/feed-back.html',
                controller:'UserFeedBackCtrl'
            })
            // 切换公式
            .state('switching-formula', {
                url: '/switching-formula',
                templateUrl: 'templates/switching-formula.html'
                //controller:'UserNewsCtrl'
            })
            // 详情
            .state('details', {
                url: '/details/:id',
                templateUrl: 'templates/details.html',
                controller:'UserDetailsCtrl'
            })
            // 更多
            .state('more', {
                url: '/more/:id',
                templateUrl: 'templates/more.html',
                controller:'MoreCtrl'
            })
            // 计划分享
            .state('Plan-share', {
                url: '/Plan-share',
                templateUrl: 'templates/Plan-share.html'
                //controller:'UserNewsCtrl'
            })
            // 搜索结果
            .state('search-details', {
                url: '/search-details/:id',
                templateUrl: 'templates/search-details.html',
                controller:'SearchDetailsCtrl'
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');

    }]);

angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

/**
 * ==================  angular-ios9-uiwebview.patch.js v1.1.1 ==================
 *
 * This patch works around iOS9 UIWebView regression that causes infinite digest
 * errors in Angular.
 *
 * The patch can be applied to Angular 1.2.0 – 1.4.5. Newer versions of Angular
 * have the workaround baked in.
 *
 * To apply this patch load/bundle this file with your application and add a
 * dependency on the "ngIOS9UIWebViewPatch" module to your main app module.
 *
 * For example:
 *
 * ```
 * angular.module('myApp', ['ngRoute'])`
 * ```
 *
 * becomes
 *
 * ```
 * angular.module('myApp', ['ngRoute', 'ngIOS9UIWebViewPatch'])
 * ```
 *
 *
 * More info:
 * - https://openradar.appspot.com/22186109
 * - https://github.com/angular/angular.js/issues/12241
 * - https://github.com/driftyco/ionic/issues/4082
 *
 *
 * @license AngularJS
 * (c) 2010-2015 Google, Inc. http://angularjs.org
 * License: MIT
 */

angular.module('ngIOS9UIWebViewPatch', ['ng']).config(['$provide', function($provide) {
  'use strict';

  $provide.decorator('$browser', ['$delegate', '$window', function($delegate, $window) {

    if (isIOS9UIWebView($window.navigator.userAgent)) {
      return applyIOS9Shim($delegate);
    }

    return $delegate;

    function isIOS9UIWebView(userAgent) {
      return /(iPhone|iPad|iPod).* OS 9_\d/.test(userAgent) && !/Version\/9\./.test(userAgent);
    }

    function applyIOS9Shim(browser) {
      var pendingLocationUrl = null;
      var originalUrlFn= browser.url;

      browser.url = function() {
        if (arguments.length) {
          pendingLocationUrl = arguments[0];
          return originalUrlFn.apply(browser, arguments);
        }

        return pendingLocationUrl || originalUrlFn.apply(browser, arguments);
      };

      window.addEventListener('popstate', clearPendingLocationUrl, false);
      window.addEventListener('hashchange', clearPendingLocationUrl, false);

      function clearPendingLocationUrl() {
        pendingLocationUrl = null;
      }

      return browser;
    }
  }]);
}]);

angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});

/**
 * 串串计划
 * @param uid
 * @constructor
 */

function yikeTaishan(url, uid) {
    this.url = url + '?i='+uid+'&c=entry&m=yike_ts_plan';
    this.uid = uid;
    // this.openid = openid;
}

yikeTaishan.prototype = {
    constructor: yikeTaishan,
    /**
     * 基础查询函数
     * @param controller
     * @param action
     * @param op
     * @returns {AV.Promise}
     */
    query: function (data) {
        var promise = new AV.Promise();
        var url = this.url;
        for (var key in data) {
            if (url != "") {
                url += "&";
            }
            url += key + "=" + encodeURIComponent(data[key]);
        }

        $.ajax({
            url: url,
            dataType: 'jsonp',
            processData: false,
            type: 'get',
            success: function (data) {
                promise.resolve(data);
            },
            error: function (i, data) {
                connectionTimeout();
                promise.reject(data);
            }
        });
        return promise;
    },


    /**
     * 注册
     * @param phone
     * @param mac
     * @param qq
     * @param nickname
     * @param password
     * @returns {*|AV.Promise}
     */
    register:function(phone,mac,qq,nickname,password,tourists){
        return this.query({
            do:'register',
            phone:phone,
            mac:mac,
            qq:qq,
            nickname:nickname,
            password:password,
            tourists:tourists
        });
    },
    /**
     * 发送手机验证码
     * @param phone
     * @param op
     * @returns {*|AV.Promise}
     */
    sendMsg:function(phone,op){
        return this.query({
            do:'sendmsg',
            op:op,
            phone:phone
        });
    },
    /**
     * 确认邮箱验证完成
     * @param uid
     * @returns {*|AV.Promise}
     */
    confirmEmail :function(uid){
        return this.query({
            do:'confirm',
            op:'ok',
            uid:uid
        });
    },
    /**
     * 登录
     * @param email
     * @param password
     * @param op
     * @returns {*|AV.Promise}
     */
    login :function(email,password,op){
        return this.query({
            do:'login',
            op:op,
            email:email,
            password:password
        });
    },
    /**
     * 获取账户是否到期
     * @param uid
     * @param token
     * @returns {*|AV.Promise}
     */
    expire :function(uid,token){
        return this.query({
            do:'user',
            uid:uid,
            token:token
        });
    },
    /**
     * 首页banner
     * @returns {*|AV.Promise}
     */
    banner :function(){
        return this.query({
            do:'banner'
        });
    },
    /**
     * 历史开奖
     * @param op
     * @param page
     * @returns {*|AV.Promise}
     */
    lottery :function(op,page){
        return this.query({
            do:'lottery',
            op:op,
            page:page
        });
    },
    /**
     * 开奖走势
     * @param op
     * @param ob
     * @param num
     * @returns {*|AV.Promise}
     */
    movements :function(op,ob,num){
        return this.query({
            do:'trend',
            op:op,
            ob:ob,
            num:num
        });
    },
    /**
     * 重庆时时彩方案列表
     * @returns {*|AV.Promise}
     */
    sscScheme :function(){
        return this.query({
            do:'plan',
            op:'list'
        });
    },
    /**
     * pk10方案列表
     * @returns {*|AV.Promise}
     */
    pkScheme :function(token){
        return this.query({
            do:'pk10_plan',
            op:'list',
            token:token
        });
    },
    /**
     * 重庆时时彩方案详情
     * @param plan_id
     * @returns {*|AV.Promise}
     */
    schemeDetails :function(plan_id){
        return this.query({
            do:'plan',
            op:'detail',
            plan_id:plan_id
        });
    },
    /**
     * pk10方案详情
     * @param plan_id
     * @returns {*|AV.Promise}
     */
    pkDetails :function(plan_id){
        return this.query({
            do:'pk10_plan',
            op:'detail',
            num:3,
            code:5,
            plan_id:plan_id
        });
    },
    /**
     * 获取代理用户信息
     * @param token
     * @returns {*|AV.Promise}
     */
    agencyMessage:function(token){
        return this.query({
            do:"agency",
            op:"index",
            token:token
        });
    },
    /**
     * 查询会员和代理列表
     * @param token
     * @param page
     * @param phone
     * @param type
     * @param time
     * @param time1
     * @returns {*|AV.Promise}
     */
    queryUserList:function(token,page,phone,type,time,time1){
        return this.query({
            do:"agency",
            op:"list",
            token:token,
            page:page,
            phone:phone,
            type:type,
            time:time,
            time1:time1
        });
    },
    /**
     * 获取会员详情
     * @param token
     * @param id
     * @returns {*|AV.Promise}
     */
    userListDetails:function(token,id){
        return this.query({
            do:"agency",
            op:"view",
            token:token,
            id:id
        });
    },
    /**
     * 生成注册链接
     * @param token
     * @param type
     * @param num
     * @param ratio
     * @returns {*|AV.Promise}
     */
    generateLink:function(token,type,num,ratio){
        return this.query({
            do:"agency",
            op:"links",
            token:token,
            type:type,
            num:num,
            ratio:ratio
        });
    },
    /**
     * 收藏方案
     * @param ob
     * @param op
     * @param plan_id
     * @param uid
     * @returns {*|AV.Promise}
     */
    collect :function(op,ob,plan_id,uid){
        return this.query({
            do:'collection',
            op:op,
            ob:ob,
            plan_id:plan_id,
            uid:uid
        });
    },
    /**
     * 我收藏的方案
     * @param op
     * @param ob
     * @param uid
     * @returns {*|AV.Promise}
     */
    myCollect :function(op,ob,uid){
        return this.query({
            do:'collection',
            op:op,
            ob:ob,
            uid:uid
        });
    },
    /**
     * 删除我的收藏
     * @param op
     * @param ob
     * @param id
     * @returns {*|AV.Promise}
     */
    deleteCollect :function(op,ob,id){
        return this.query({
            do:'collection',
            op:op,
            ob:ob,
            id:id
        });
    },
    /**
     * 获取消息列表和详情
     * @param type
     * @param page
     * @param id
     * @returns {*|AV.Promise}
     */
    myMessageAndDetail:function(type,page,id){
        return this.query({
            do:"inform",
            op:"pk10",
            type:type,
            page:page,
            id:id
        });
    },
    /**
     * 修改密码
     * @param op
     * @param phone
     * @param password
     * @param new_password
     * @param token
     * @returns {*|AV.Promise}
     */
    modificationPassword :function(op,phone,new_password,password,token){
        return this.query({
            do:'reset',
            op:op,
            phone:phone,
            new_password:new_password,
            password:password,
            token:token
        });
    },
    /**
     * 公告列表
     * @returns {*|AV.Promise}
     */
    notice :function(){
        return this.query({
            do:'notice'
        });
    },
    /**
     * 个人中心
     * @param uid
     * @param op
     * @returns {*|AV.Promise}
     */
    personalCenter :function(op,uid){
        return this.query({
            do:'personal_center',
            op:op,
            uid:uid
        });
    },
    /**
     * 充值
     * @param phone
     * @param password
     * @param token
     * @returns {*|AV.Promise}
     */
    recharge :function(phone,password,token){
        return this.query({
            do:'recharge',
            phone:phone,
            password:password,
            token:token
        });
    },
    /***
     * 退出登录
     * @param uid
     * @returns {*|AV.Promise}
     */
    logout :function(uid){
        return this.query({
            do:'login_out',
            uid:uid
        });
    },
    /**
     * 绑定手机号
     * @param phone
     * @param token
     * @returns {*|AV.Promise}
     */
    bindPhone :function(phone,token){
        return this.query({
            do:'binding',
            phone:phone,
            token:token
        });
    },
    //咨询秘籍 >彩票新闻
    news:function(){
        return this.query({
            do:'info',
            op:'index',
            type:1
        });
    },
    //咨询秘籍 >技术技巧
    workmanship:function(){
        return this.query({
            do:'info',
            op:'index',
            type:2
        });
    },
    //更多
    more:function(id){
        return this.query({
            do:'info',
            op:'more',
            classify_id:id
        });
    },
    //详情
    details:function(id){
        return this.query({
            do:'info',
            op:'details',
            id:id
        });
    },
    /**
     * 是否显示充值按钮
     * @returns {*|AV.Promise}
     */
    isShowRecharge :function(){
        return this.query({
            do:'open'
        });
    },
    /**
     * 支付接口
     * @returns {*|AV.Promise}
     */
    payPorts :function(id){
        return this.query({
            do:'req',
            package_id:id
        });
    },
    /**
     * 套餐接口
     //  *{*|AV.Promise
     */
    setWays :function(){
        return this.query({
            do:'package',
            op:'index'
        });
    },
    //选择充值方式充值
    choseChargeWay :function(payway,id,token){
        return this.query({
            do:'package',
            op:'recharge',
            pay:payway,
            id:id,
            token:token
        });
    },
    // 微信支付
    weixinpay :function(){
        return this.query({
            do:'pay'
        });
    },
    // 意见反馈提交
    feedback :function(content,from){
        return this.query({
            op:'add',
            do:'addmsg',
            content:content,
            from:from
        });
    },
    // 计划详情搜索
    search :function(plan_id,num,code,rate_high,rate_low,no_num_high,no_num_low,ok_num_high,ok_num_low,current_high,current_low){
        return this.query({
            op:'detail',
            do:'pk10_plan',
            m:'yike_ts_plan',
            plan_id:plan_id,
            num:num,
            code:code,
            rate_high:rate_high,
            rate_low:rate_low,
            no_num_high:no_num_high,
            no_num_low:no_num_low,
            ok_num_high:ok_num_high,
            ok_num_low:ok_num_low,
            current_high:current_high,
            current_low:current_low
        });
    }
};

//var openid = elocalStorage.get('openid') || '';
var yikeTaishan = new yikeTaishan(WX_API_URL, WX_ID);

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

/**
 * Created by frank on 2016/8/30.
 */
(function () {
    'use strict';

    angular
        .module('platform.module', ['platform.scheme.controller','platform.program.details.controller','fade.program.controller']);
})();

/**
 * Created by frank on 2016/9/8.
 */
(function () {
    'use strict';

    angular
        .module('platform.program.details.controller', [])
        .controller('PlatformProgramDetailsCtrl', PlatformProgramDetailsCtrl)
        .directive('repeatFinish',function(){
            return {
                link: function(scope,element,attr){
                    if(scope.$last == true){
                        scope.$eval( attr.repeatFinish );
                    }
                }
            }
        });
    PlatformProgramDetailsCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','$ionicTabsDelegate','localStorageService','$ionicPopup','$ionicLoading',];
    /* @ngInject */
    function PlatformProgramDetailsCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,$ionicTabsDelegate,localStorageService,$ionicPopup,$ionicLoading){
        $scope.user=localStorageService.get('user');
        var id=$state.params.id;
        var index;
        $scope.repeatFinish = function(position){
            for(var i=0,l=$scope.collectDetail.length;i<l;i++){
                if(id == $scope.collectDetail[i][4]){
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
        $scope.planid=$state.params.id;
        $scope.type=$state.params.type;
        $scope.typesss=$state.params;
        $scope.isShow=false;
        $scope.myCollect=myCollect;
        $scope.getcollectId = getcollectId;
        $scope.collectDetail = [];
        $scope.copy=copy;
        $scope.confirm=confirm;
        $scope.changeDetails = changeDetails;
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
        var status=0;
        $scope.$on('$ionicView.afterLeave', function() {
            clearInterval(pksh);
        });
        init();
        function init() {
            myCollect();
            lottery();
            document.addEventListener("webkitvisibilitychange", onVisibilityChanged, false);
            //获取客服微信,qq
            yikeTaishan.personalCenter('platform','')
                .then(function (data) {
                    if(data.status == 1){
                        $scope.message=data.result;
                        $scope.$digest();
                    }
                });
        }

        $scope.onReadySwiper = function (swiper) {
            $scope.swiper = swiper;
        };
        function rangeinit (){
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
        }
        function onVisibilityChanged() {
            lottery();
        }
        function confirm(){
            $scope.slider1.update({from:$scope.slider1.old_from,to:$scope.slider1.old_to});
            $scope.slider2.update({from:$scope.slider2.old_from,to:$scope.slider2.old_to});
            $scope.slider3.update({from:$scope.slider3.old_from,to:$scope.slider3.old_to});
            $scope.slider4.update({from:$scope.slider4.old_from,to:$scope.slider4.old_to});
            $scope.closeSearchModal();
            yikeTaishan.search($scope.planid,$scope.searchitem.code,$scope.searchitem.num,$scope.slider1.old_to,$scope.slider1.old_from,$scope.slider2.old_to,$scope.slider2.old_from,$scope.slider3.old_to,$scope.slider3.old_from,$scope.slider4.old_to,$scope.slider4.old_from)
                .then(function (data) {
                    if(data.result.result){
                        $yikeUtils.toast('暂无该条件的数据');
                        return false;
                    }else {
                        clearInterval(pksh);
                        var next = [$scope.planid,$scope.searchitem.code,$scope.searchitem.num,$scope.slider1.old_to,$scope.slider1.old_from,$scope.slider2.old_to,$scope.slider2.old_from,$scope.slider3.old_to,$scope.slider3.old_from,$scope.slider4.old_to,$scope.slider4.old_from]
                        $state.go('search-details',{id:JSON.stringify(next)});
                    }
                });
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
        }

        function changeDetails(choseId,index){
            $scope.mySwiper.slideTo(index);
            $scope.mySwiper.update();
            $scope.planid = choseId;
            id = choseId;
            pkDetails();
        }

        //pk10方案详情
        function pkDetails() {
            yikeTaishan.pkDetails(id)
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
                                $scope.maxarray[i]= 1;
                            }else{
                                $scope.maxarray[i]= 2;
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
                    })
            }
            $(document).ready(function(){
                $scope.mySwiper = new Swiper('#program-swiper', {
                    onInit:function(swiper){
                        /*setTimeout(function(){
                            swiper.slideTo(index);
                            swiper.update();
                            $scope.$digest();
                        },2000);*/
                    },
                    slidesPerView : 3,
                    observer:true
                });
            });
        }
        // 复制
        var clipboard = new Clipboard('#copyDetails', {
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
        //搜索公式modal
        $ionicModal.fromTemplateUrl('templates/modal/searchway.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(searchmodal) {
            $scope.searchservice= searchmodal;
        });
        $scope.openSearchModal = function() {
            if ($scope.user.status == 0) {
                $yikeUtils.toast('购买权限之后才能使用此功能');
                return false;
            }else{
                $scope.searchservice.show();
                rangeinit();
            }
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

/**
 * Created by frank on 2016/9/7.
 */
(function () {
    'use strict';

    angular
        .module('platform.scheme.controller', [])
        .controller('PlatformSchemeCtrl', PlatformSchemeCtrl);

    PlatformSchemeCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','$ionicTabsDelegate','localStorageService','$ionicPopup','$ionicLoading'];
    /* @ngInject */
    function PlatformSchemeCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,$ionicTabsDelegate,localStorageService,$ionicPopup,$ionicLoading){
        $scope.user=localStorageService.get('user');
        $scope.oneStar=[];
        $scope.twoStar=[];
        $scope.threeStar=[];
        $scope.fourStar=[];
        $scope.fiveStar=[];
        $scope.status={
            status:1,
            oneStar:true,
            twoStar:false,
            threeStar:false,
            fourStar:false,
            fiveStar:false,
            playingMethod:$state.params.playType
        };
        $scope.selectStar=selectStar;
        $scope.playingMethod=playingMethod;
        init();
        function init() {
            playingMethod();
        }
        //重庆时时彩方案列表
        function sscList() {
            yikeTaishan.sscScheme()
                .then(function (data) {
                    $ionicLoading.hide();
                    if(data.status == 1){
                        for(var i=0;i < data.result.plan.length;i++){
                            if(data.result.plan[i].address == 1){
                                $scope.oneStar.push(data.result.plan[i]);
                            }else if(data.result.plan[i].address == 2){
                                $scope.twoStar.push(data.result.plan[i]);
                            }else if(data.result.plan[i].address == 3){
                                $scope.threeStar.push(data.result.plan[i]);
                            }else if(data.result.plan[i].address == 4){
                                $scope.fourStar.push(data.result.plan[i]);
                            }else{
                                $scope.fiveStar.push(data.result.plan[i]);
                            }
                        }
                        $scope.$digest();
                    }
                })
        }
        //pk10方案列表
        function pkScheme() {
            yikeTaishan.pkScheme()
                .then(function (data) {
                    console.log(data.result.plan);
                    $ionicLoading.hide();
                    if(data.status == 1){
                        for(var i=0;i < data.result.plan.length;i++){
                            if(data.result.plan[i].address == 1){
                                $scope.oneStar.push(data.result.plan[i]);
                            }else if(data.result.plan[i].address == 2){
                                $scope.twoStar.push(data.result.plan[i]);
                            }else if(data.result.plan[i].address == 3){
                                $scope.threeStar.push(data.result.plan[i]);
                            }else if(data.result.plan[i].address == 4){
                                $scope.fourStar.push(data.result.plan[i]);
                            }else{
                                $scope.fiveStar.push(data.result.plan[i]);
                            }
                        }
                        $scope.$digest();
                    }
                })
        }
        //玩法
        function playingMethod() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
            });
            yikeTaishan.expire($scope.user.id,$scope.user.token)
                .then(function (data) {
                    if(data.status == 1){
                        $scope.oneStar=[];
                        $scope.twoStar=[];
                        $scope.threeStar=[];
                        $scope.fourStar=[];
                        $scope.fiveStar=[];
                        if($scope.status.playingMethod == 'ssc'){
                            sscList();
                        }else{
                            pkScheme();
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
                })

        }
        //选择星级
        function selectStar(status) {
            $scope.status.status=status;
            if($scope.status.status == 1){
                $scope.status.oneStar=true;
                $scope.status.twoStar=false;
                $scope.status.threeStar=false;
                $scope.status.fourStar=false;
                $scope.status.fiveStar=false;
            }else if($scope.status.status == 2){
                $scope.status.oneStar=false;
                $scope.status.twoStar=true;
                $scope.status.threeStar=false;
                $scope.status.fourStar=false;
                $scope.status.fiveStar=false;
            }else if($scope.status.status == 3){
                $scope.status.oneStar=false;
                $scope.status.twoStar=false;
                $scope.status.threeStar=true;
                $scope.status.fourStar=false;
                $scope.status.fiveStar=false;
            }else if($scope.status.status == 4){
                $scope.status.oneStar=false;
                $scope.status.twoStar=false;
                $scope.status.threeStar=false;
                $scope.status.fourStar=true;
                $scope.status.fiveStar=false;
            }else{
                $scope.status.oneStar=false;
                $scope.status.twoStar=false;
                $scope.status.threeStar=false;
                $scope.status.fourStar=false;
                $scope.status.fiveStar=true;
            }
        }
    }
})();

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

/**
 * Created by frank on 2016/8/30.
 */
(function () {
    'use strict';

    angular
        .module('lottery.controller', [])
        .controller('LotteryCtrl', LotteryCtrl);

    LotteryCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicTabsDelegate','localStorageService','$ionicPopup','$ionicLoading'];
    /* @ngInject */
    function LotteryCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicTabsDelegate,localStorageService,$ionicPopup,$ionicLoading){
        $scope.refresh=refresh;
        $scope.loadMore=loadMore;
        $scope.screen=screen;
        var page=1;
        $scope.lotteryList=[];
        $scope.op='pk10';
        var user=localStorageService.get('user');
        init();
        function init() {
            $ionicTabsDelegate.showBar(true);//隐藏开奖走势导航栏
        }
        //下拉刷新
        function refresh() {
            yikeTaishan.expire(user.id,user.token)
                .then(function (data) {
                    if(data.status == 1){
                        page=1;
                        lottery();
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
        //上拉加载
        function loadMore() {
            yikeTaishan.expire(user.id,user.token)
                .then(function (data) {
                    if(data.status == 1){
                        lottery();
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
        function lottery() {
            yikeTaishan.lottery($scope.op,page)
                .then(function (data) {
                    $ionicLoading.hide();
                    if(data.status== 1){
                        for(var i=0;i<data.result.list.length;i++){
                            data.result.list[i].time=moment.unix(Number(data.result.list[i].time)).format("YYYY.MM.DD HH:mm");
                        }
                        if(page == 1){
                            $scope.lotteryList=data.result.list;
                        }else{
                            $scope.lotteryList=$scope.lotteryList.concat(data.result.list);
                        }
                    }else{
                        $scope.lotteryList=[];
                    };
                    $scope.noMoreItemsAvailable = $scope.lotteryList.length >= Number(data.result.total);
                    $scope.$digest();
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    page++;
                });
        }
        //分类筛选
        function screen() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
            });
            yikeTaishan.expire(user.id,user.token)
                .then(function (data) {
                    if(data.status == 1){
                        page=1;
                        loadMore();
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
    }
})();

/**
 * Created by frank on 2016/8/30.
 */
(function () {
    'use strict';

    angular
        .module('movements.controller', [])
        .controller('MovementsCtrl', MovementsCtrl);

    MovementsCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicTabsDelegate','$timeout','localStorageService','$ionicLoading','$ionicScrollDelegate','$ionicPopup'];
    /* @ngInject */
    function MovementsCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicTabsDelegate,$timeout,localStorageService,$ionicLoading,$ionicScrollDelegate,$ionicPopup){
        var user=localStorageService.get('user');
        $scope.num='30';
        // $scope.movements={
        //     num:'30',
        //     op:'ssc',
        //     ob:'one',
        //     digit:'个位走势'
        // };
        $scope.movements={
            num:'30',
            op:'pk10',
            ob:'first',
            digit:'冠军'
        };
        $scope.sscScreen=[{ob:'one',content:'个位走势'},{ob:'ten',content:'十位走势'},{ob:'hundred',content:'百位走势'},{ob:'thousand',content:'千位走势'},
            {ob:'ten_thousand',content:'万位走势'}];
        $scope.pkScreen=[{ob:'first',content:'冠军'},{ob:'second',content:'亚军'},{ob:'third',content:'季军'},{ob:'fourth',content:'第四'},{ob:'fifth',content:'第五'},
            {ob:'sixth',content:'第六'}, {ob:'seventh',content:'第七'},{ob:'eighth',content:'第八'},{ob:'ninth',content:'第九'},{ob:'tenth',content:'第十'}];
        $scope.movementsNum=[1,2,3,4,5,6,7,8,9,10];
        $scope.digitMovements=digitMovements;
        $scope.periods=periods;
        $scope.playing=playing;
        init();
        function init() {
            $ionicTabsDelegate.showBar(false);//隐藏开奖走势导航栏
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
            });
            yikeTaishan.expire(user.id,user.token)
                .then(function (data) {
                    if(data.status == 1){
                        movements();
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

        //走势数据
        function movements() {
            yikeTaishan.movements($scope.movements.op,$scope.movements.ob,Number($scope.movements.num))
                .then(function (data) {
                    $ionicLoading.hide();
                    if(data.status == 1){
                        $scope.datas=data.result.list;
                        $scope.analysis=data.result.analysis;
                        $timeout(function() {
                            pageLoad();
                        });
                        $scope.$digest();
                    }
                })
        }
        //位数走势
        function digitMovements(ob,content) {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
            });
            $scope.movements.ob=ob;
            $scope.movements.digit=content;
            yikeTaishan.expire(user.id,user.token)
                .then(function (data) {
                    if(data.status == 1){
                        movements();
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
        //期数筛选
        function periods() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
            });
            yikeTaishan.expire(user.id,user.token)
                .then(function (data) {
                    if(data.status == 1){
                        movements();
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
        //玩法筛选
        function playing () {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
            });
            // if($scope.movements.op == 'ssc'){
            //     $scope.movementsNum=[0,1,2,3,4,5,6,7,8,9];
            //     $scope.movements.ob='one';
            //     $scope.movements.digit='个位走势';
            //
            // }else{
                $scope.movementsNum=[1,2,3,4,5,6,7,8,9,10];
                $scope.movements.ob='first';
                $scope.movements.digit='冠军';
            // }
            yikeTaishan.expire(user.id,user.token)
                .then(function (data) {
                    if(data.status == 1){
                        movements();
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
        //走势线条
        function pageLoad(){
            var span=document.getElementsByClassName('span-active');
            var ul=document.getElementById('ul');
            var container=document.getElementById('container');
            var mycanvas=document.getElementById('mycanvas');
            mycanvas.style.display='none';
            mycanvas.style.display='block';
            mycanvas.width=container.offsetWidth;
            mycanvas.height=container.offsetHeight-88;
            var cans=mycanvas.getContext('2d');
                var u = navigator.userAgent;
                var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
                // var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+token OS X/); //ios终端
            if(isAndroid){
                for(var i=0;i<span.length;i++){
                    var x=span[i].getBoundingClientRect().left+document.documentElement.scrollLeft+9;
                    var y=span[i].getBoundingClientRect().top+document.documentElement.scrollTop+$ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top-123;
                    if(i == 0){
                        cans.moveTo(x,y);
                    }else{
                        cans.lineTo(x,y);
                    }
                }
            }else{
                for(var i=0;i<span.length;i++){
                    var x=span[i].getBoundingClientRect().left+document.documentElement.scrollLeft+9;
                    var y=span[i].getBoundingClientRect().top+document.documentElement.scrollTop+$ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top-143;
                    if(i == 0){
                        cans.moveTo(x,y);
                    }else{
                        cans.lineTo(x,y);
                    }
                }
            }
            cans.lineWidth=1;
            cans.strokeStyle = '#FF9900';
            cans.stroke();
            cans.save();
        }
    }
})();

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

/**
 * Created by frank on 2016/8/30.
 */
(function () {
    'use strict';

    angular
        .module('tab.module', ['lottery.controller','movements.controller','account.controller','home.controller','news.controller','tabs.controller']);
})();

/**
 * Created by john on 2016/8/30.
 */
(function () {
    'use strict';

    angular
        .module('tabs.controller', [])
        .controller('TabsCtrl', TabsCtrl);

    TabsCtrl.$inject = ['$scope','$yikeUtils','$rootScope','$state','$ionicHistory','$ionicModal','$ionicTabsDelegate','localStorageService','$ionicPopup','$cordovaImagePicker'];
    /* @ngInject */
    function TabsCtrl($scope,$yikeUtils,$rootScope,$state,$ionicHistory,$ionicModal,$ionicTabsDelegate,localStorageService,$ionicPopup,$cordovaImagePicker){
        // $scope.closeInterval=closeInterval;
        init();
        function init() {}
        // function closeInterval(status) {
        //     clearInterval(pksh);
        //     window.location.href='#/tab/'+status;
        // }
    }
})();

"use strict";
angular.module("ionic-toast", ["ionic"]).run(["$templateCache", function (t) {
    var o = '<div class="ionic_toast" ng-class="ionicToast.toastClass" ng-style="ionicToast.toastStyle"><span class="ionic_toast_close" ng-click="hide()"><i class="ion-close-round toast_close_icon"></i></span><span ng-bind-html="ionicToast.toastMessage"></span></div>';
    t.put("ionic-toast/templates/ionic-toast.html", o)
}]).provider("ionicToast", function () {
    this.$get = ["$compile", "$document", "$interval", "$rootScope", "$templateCache", "$timeout", function (t, o, i, n, s, a) {
        var c, e = {
            toastClass: "",
            toastMessage: "",
            toastStyle: {display: "none", opacity: 0}
        }, l = {
            top: "ionic_toast_top",
            middle: "ionic_toast_middle",
            bottom: "ionic_toast_bottom"
        }, d = n.$new(), p = t(s.get("ionic-toast/templates/ionic-toast.html"))(d);
        d.ionicToast = e, o.find("body").append(p);
        var u = function (t, o, i) {
            d.ionicToast.toastStyle = {display: t, opacity: o}, d.ionicToast.toastStyle.opacity = o, i()
        };
        return d.hide = function () {
            u("none", 0, function () {
                console.log("toast hidden")
            })
        }, {
            show: function (t, o, i, n) {
                t && o && n && (a.cancel(c), n > 5e3 && (n = 5e3), angular.extend(d.ionicToast, {
                    toastClass: l[o] + " " + (i ? "ionic_toast_sticky" : ""),
                    toastMessage: t
                }), u("block", 1, function () {
                    i || (c = a(function () {
                        d.hide()
                    }, n))
                }))
            }, hide: function () {
                d.hide()
            }
        }
    }]
});

(function () {
  'use strict';

  angular
    .module('yike.back', [])
    .directive('yikeBack', YikeBack);

  YikeBack.$inject = ['$ionicHistory'];

  function YikeBack($ionicHistory) {
    var directive = {
      template: ' <button class="button button-clear ion-chevron-left" style="color:#fff !important"></button>',
      link: link,
      replace: true,
      restrict: 'AE'
    };
    return directive;

    function link(scope, element, attrs) {
      element.bind('click', function(e) {
        $ionicHistory.goBack();
      })
    }
  }
})();

(function () {
    'use strict';

    angular
        .module('yike', ['yike.subMenu', 'yike.utils', 'ionic-toast', 'yike.back']);

})();

(function () {
  'use strict';

  angular
    .module('yike.subMenu', [])
    .directive('yikeSubMenu', yikeSubMenu);

  yikeSubMenu.$inject = [];
  function yikeSubMenu() {
    return {
      replace: false,
      restrict: 'AE',
      link: function (scope, elem, attrs) {
        scope.clickCategory = function (key) {
          scope.current.menu = key == scope.current.menu ? '' : key;
          scope.current.subMenu = [];
        };

        scope.clickMenu = function (menu) {
          if (menu.sub.length > 0) {
            scope.current.subMenu = menu.sub;
          } else {
            scope.condition[scope.current.menu] = menu;
            scope.current.menu = null;
            scope.page = 1;
            scope.query();
          }
          $('.sub').scrollTop(0);
        };

        scope.clickSubMenu = function (subMenu) {
          scope.condition[scope.current.menu] = subMenu;
          scope.current.menu = null;
          scope.page = 1;
          scope.query();
        }
      },
      templateUrl: 'templates/utils/sub-menu.html'
    };
  }
})();

(function () {
  'use strict';

  angular
    .module('yike.utils', ['ionic'])
    .factory('$yikeUtils', $yikeUtils);

  $yikeUtils.$inject = ['$rootScope', '$state', '$ionicPopup', '$ionicModal', '$location', '$timeout', 'ionicToast', '$ionicLoading'];

  /* @ngInject */
  function $yikeUtils($rootScope, $state, $ionicPopup, $ionicModal, $location, $timeout, ionicToast, $ionicLoading) {
    return {
      go: go,
      alert: alert,
      confirm: confirm,
      show: show,
      toast: toast
    };

    ////////////////

    function go(target, params, options) {
      $state.go(target, params, options);
    }

    function toast(message, position, stick, time) {
      //position = position || 'middle';
      //stick = stick || false;
      //time = time || 3000;
      //ionicToast.show(message, position, stick, time);
      $ionicLoading.show({ template: message, noBackdrop: true, duration: 2000 });
    }

    function alert(title, template) {
      var _alert = $ionicPopup.alert({
        title: title,
        template: template,
        'okType': 'button-assertive'
      });

      $timeout(function() {
        _alert.close(); //close the popup after 3 seconds for some reason
      }, 1500);

      return _alert;
    }

    function confirm(title, template) {
      var _alert = $ionicPopup.confirm({
        'title': title,
        'template': template,
        'okType': 'button-assertive',
        'cancelText': '取消',
        'okText': '确认',
        cssClass:'red-confirm'
      });

      $timeout(function() {
        _alert.close(); //close the popup after 3 seconds for some reason
      }, 3000);

      return _alert;
    }

    function show(title, template, scope, buttons) {
      var _alert = $ionicPopup.show({
        title: title,
        template: template,
        scope: scope,
        buttons: buttons
      });
      $timeout(function() {
        _alert.close(); //close the popup after 3 seconds for some reason
      }, 3000);

      return _alert;
    }
  }
})();

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

/**
 * Created by john on 2016/8/31.
 */
(function () {
    'use strict';

    angular
        .module('user.about.us.controller', [])
        .controller('UserAboutUsCtrl',UserAboutUsCtrl);

    UserAboutUsCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','$ionicTabsDelegate'];
    /* @ngInject */
    function UserAboutUsCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,$ionicTabsDelegate) {

        init();
        function init() {

        }
    }
})();

/**
 * Created by frank on 2016/11/17.
 */
(function () {
    'use strict';

    angular
        .module('user.bind.phone.controller', [])
        .controller('UserBindPhoneCtrl', UserBindPhoneCtrl);

    UserBindPhoneCtrl.$inject = ['$scope','$yikeUtils','$state','localStorageService','$ionicModal','$ionicTabsDelegate','$ionicLoading'];
    /* @ngInject */
    function UserBindPhoneCtrl($scope,$yikeUtils,$state,localStorageService ,$ionicModal,$ionicTabsDelegate,$ionicLoading){
        var user=localStorageService.get('user');
        $scope.user={
            phone:'',
            code:'',
            msg:''
        };
        $scope.register=register;
        $scope.sendMsg=sendMsg;
        init();
        function init() {}
        //表单验证
        function formValidation() {
            if($scope.user.phone == '' || $scope.user.phone == null){
                $yikeUtils.toast('请先输入手机号');
                return false;
            }else if($scope.user.code == '' || $scope.user.code == null){
                $yikeUtils.toast('请先输入验证码');
                return false;
            }else if($scope.user.phone != $scope.user.msg.phone){
                $yikeUtils.toast('请输入正确的验证码');
                return false;
            }else if($scope.user.code != $scope.user.msg.code){
                $yikeUtils.toast('请输入正确的验证码');
                return false;
            }else{
                return true;
            }
        }
        //发送短信验证码
        function sendMsg() {
            if($scope.user.phone == '' || $scope.user.phone==null){
                $yikeUtils.toast('请先输入手机号');
                return false;
            }
            yikeTaishan.sendMsg($scope.user.phone,$scope.user.op)
                .then(function (data) {
                    $yikeUtils.toast(data.result.result);
                    if(data.status == 1){
                        $scope.user.msg=data.result.msg;
                        var sendMsg=document.body.querySelector('#send-msg');
                        settime(sendMsg);
                    }
                });
        }
        var countdown=60;
        //倒计时
        function settime(obj) {
            if (countdown == 0) {
                obj.removeAttribute("disabled");
                obj.innerHTML="获取验证码";
                countdown = 60;
                return;
            } else {
                obj.setAttribute("disabled", true);
                obj.innerHTML="重新发送(" + countdown + ")";
                countdown--;
            }
            setTimeout(function() {
                    settime(obj) }
                ,1000)
        }
        //绑定手机号
        function register() {
            var suc=formValidation();
            if(suc){
                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner>'
                });
                yikeTaishan.bindPhone($scope.user.phone,user.token)
                    .then(function (data) {
                        $yikeUtils.toast(data.result.result);
                        if( data.status ==1 ){
                            user.phone=$scope.user.phone;
                            $state.go('tab.account');
                        }
                    })
            }
        }
    }
})();
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

/**
 * Created by john on 2016/8/31.
 */
(function () {
    'use strict';

    angular
        .module('user.feed.back.controller', [])
        .controller('UserFeedBackCtrl',UserFeedBackCtrl);

    UserFeedBackCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','$ionicTabsDelegate','localStorageService','$ionicLoading'];
    /* @ngInject */
    function UserFeedBackCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,$ionicTabsDelegate,localStorageService,$ionicLoading) {
        $scope.user=localStorageService.get('user');
        $scope.confirm = confirm;
        $scope.data = {};
        init();
        function init() {

            yikeTaishan.expire($scope.user.id,$scope.user.token)
                .then(function (data) {
                    console.log($scope.user);
                    if(data.status == 1){
                        getMessage();
                        getDatatime();
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

        function confirm(){
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
            });
            yikeTaishan.feedback($scope.data.content,$scope.user.phone)
                .then(function (data) {
                    if(data.status == 1){
                            $yikeUtils.toast('提交完成');
                        }else{
                            $yikeUtils.toast('提交失败');
                        }
                        $scope.data.content = '';             
                });
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
        function getDatatime() {
            yikeTaishan.personalCenter('user',$scope.user.id)
                .then(function (data) {
                    if(data.status == 1){
                        if(data.result.result.sjc > 0){
                            // sscTimer(data.result.result.sjc);
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

                    }
                })
        }
    }
})();

/**
 * Created by frank on 2016/11/17.
 */
(function () {
    'use strict';

    angular
        .module('user.linked.phone.controller', [])
        .controller('UserLinkedPhoneCtrl', UserLinkedPhoneCtrl);

    UserLinkedPhoneCtrl.$inject = ['$scope','$yikeUtils','$state','localStorageService','$ionicModal','$ionicTabsDelegate','$ionicLoading'];
    /* @ngInject */
    function UserLinkedPhoneCtrl($scope,$yikeUtils,$state,localStorageService ,$ionicModal,$ionicTabsDelegate,$ionicLoading){
        $scope.user=localStorageService.get('user');
        init();
        function init() {}
    }
})();
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

/**
 * Created by frank on 2016/9/8.
 */
(function () {
    'use strict';

    angular
        .module('user.modification.password.controller', [])
        .controller('UserModificationPasswordCtrl', UserModificationPasswordCtrl);

    UserModificationPasswordCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicLoading'];
    /* @ngInject */
    function UserModificationPasswordCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicLoading){
        var user=localStorageService.get('user');
        $scope.user={
            oldPassword:'',
            newPassword:'',
            password:''
        };
        $scope.modification=modification;
        $scope.focus=focus;
        $scope.blur=blur;
        init();

        function init() {
            //是否显示充值等信息
            yikeTaishan.isShowRecharge()
                .then(function (data) {
                    $scope.isOpen=data.result.open;
                });
            //获取客服微信,qq
            yikeTaishan.personalCenter('platform','')
                .then(function (data) {
                    if(data.status == 1){
                        $scope.message=data.result;
                        $scope.$digest();
                    }
                })
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
        //表单验证
        function formValidation() {
            if($scope.user.oldPassword == ''){
                $yikeUtils.toast('请先输入旧密码');
                return false;
            }else if($scope.user.oldPassword.length < 6){
                $yikeUtils.toast('密码长度至少6位');
                return false;
            }else if($scope.user.newPassword == ''){
                $yikeUtils.toast('请先输入新密码');
                return false;
            }else if($scope.user.newPassword.length < 6){
                $yikeUtils.toast('密码长度至少6位');
                return false;
            }else if($scope.user.password == ''){
                $yikeUtils.toast('请再次输入密码');
                return false;
            }else if($scope.user.password != $scope.user.newPassword){
                $yikeUtils.toast('两次密码不一致');
                return false;
            }else{
                return true;
            }
        }
        //修改密码
        function modification() {
            var suc=formValidation();
            if(suc){
                yikeTaishan.expire(user.id,user.token)
                    .then(function (data) {
                        if(data.status == 1){
                            $ionicLoading.show({
                                template: '<ion-spinner icon="bubbles"></ion-spinner>'
                            });
                            yikeTaishan.modificationPassword('modify','',$scope.user.newPassword,$scope.user.oldPassword,user.token)
                                .then(function (data) {
                                    $yikeUtils.toast(data.result.result);
                                    if(data.status == 1){
                                        localStorageService.remove('user');
                                        $state.go('login');
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
                    });

            }
        }
        //获取焦点隐藏other
        function focus() {
            document.getElementsByClassName('other')[0].classList.add('keyboard-hide');
        }
        //失去焦点显示other
        function blur(){
            document.getElementsByClassName('other')[0].classList.remove('keyboard-hide');
        }
    }
})();
/**
 * Created by frank on 2016/9/5.
 */
(function () {
    'use strict';

    angular
        .module('user.module', ['user.register.controller','user.verification.email.controller','user.login.controller','user.scheme.controller','user.modification.password.controller',
        'user.reset.password.controller','user.recharge.controller','user.bind.phone.controller','user.linked.phone.controller','user.pay.rights.controller','user.my.rights.controller','user.pay.ways.controller','user.about.us.controller','user.feed.back.controller','more.controller','user.details.controller','search.details.controller'
        ,'user.message.controller','user.message.detail.controller']);
})();

/**
 * Created by john on 2016/8/31.
 */
(function () {
    'use strict';

    angular
        .module('user.my.rights.controller', [])
        .controller('UserMyRightsCtrl',UserMyRightsCtrl);

    UserMyRightsCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','localStorageService','$ionicModal','$ionicPopup','$ionicTabsDelegate'];
    /* @ngInject */
    function UserMyRightsCtrl($scope,$yikeUtils,$state,$ionicHistory,localStorageService,$ionicModal,$ionicPopup,$ionicTabsDelegate) {
        $scope.user=localStorageService.get('user');
        console.log($scope.user);
        if ($scope.user.status == 0) {
            $scope.buystatus = '未购买';
        }else if($scope.user.status == 1){
            $scope.buystatus = '标准版';
        }else{
            $scope.buystatus = '专业版';
        }
        $scope.endtime = Number($scope.user.end_time)*1000;

        init();
        function init() {
            // $ionicTabsDelegate.showBar(true);//打开导航栏
        }

    }
})();

/**
 * Created by john on 2016/8/31.
 */
(function () {
    'use strict';

    angular
        .module('user.pay.rights.controller', [])
        .controller('UserPayRightsCtrl',UserPayRightsCtrl);

    UserPayRightsCtrl.$inject = ['$scope','$yikeUtils','$state','$rootScope','$ionicHistory','$ionicModal','$ionicTabsDelegate','$ionicPopup','localStorageService'];
    /* @ngInject */
    function UserPayRightsCtrl($scope,$yikeUtils,$state,$rootScope,$ionicHistory,$ionicModal,$ionicTabsDelegate,$ionicPopup,localStorageService) {
        $scope.$on('$ionicView.beforeLeave', function() {
            yikeTaishan.expire($scope.user.id,$scope.user.token)
                .then(function (data) {
                    if(data.status == 1){
                        localStorageService.set('user',data.result.user);
                    }
                })
        });
        $scope.openQQ = openQQ;
        $scope.backpage = backpage;
        $scope.user=localStorageService.get('user');
        $scope.getsetWays = getsetWays;
        $scope.getList_id = getList_id;
        $scope.gonext = gonext;
        init();
        function init() {
            getsetWays();
            yikeTaishan.expire($scope.user.id,$scope.user.token)
                .then(function (data) {
                    if(data.status == 1){
                        getMessage();
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
        function openQQ(){
            window.open('mqqwpa://im/chat?chat_type=wpa&uin=3524944792&version=1&src_type=web&web_src=oicqzone.com','_system','location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=关闭')
        }
        function getMessage() {
            yikeTaishan.personalCenter('platform','')
                .then(function (data) {
                    if(data.status == 1){
                        $scope.message=data.result;
                        $scope.$digest();
                    }
                })
        }

        function getsetWays(){
            yikeTaishan.setWays()
                .then(function (data) {
                    console.log(data);
                    $scope.allways = data.result.result;
                    $scope.$$phase || $scope.$digest();
                });
        }

        function getList_id(type,price){
            $scope.chose = {};
            $scope.chose.model_id = type;
            $scope.chose.price = price;
        }
        function gonext(){
            if ($scope.chose) {
                $state.go('pay-ways',{type:$scope.chose.model_id,price:$scope.chose.price})
                // cordova.InAppBrowser.open(WX_API_URL +'?i=1&c=entry&do=package&m=yike_ts_plan&op=recharge&token='+$scope.user.token+'&id='+$scope.model_id,'_system','location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=关闭')
            }else{
                $yikeUtils.toast('请选择授权类型');
                return false;
            }
        }

        //返回上一页
        function backpage(){

            yikeTaishan.expire($scope.user.id,$scope.user.token)
                .then(function (data) {
                    if(data.status == 1){
                        localStorageService.set('user',data.result.user);
                    }
                })

            if($rootScope.buytype == 1){
                $state.go('tab.home');
            }else{
                $state.go('tab.account');
            }
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

    }
})();

/**
 * Created by john on 2016/8/31.
 */
(function () {
    'use strict';

    angular
        .module('user.pay.ways.controller', [])
        .controller('UserPayWaysCtrl',UserPayWaysCtrl);

    UserPayWaysCtrl.$inject = ['$scope','$yikeUtils','$rootScope','$state','$ionicHistory','$ionicModal','$ionicTabsDelegate','localStorageService','$ionicPlatform'];
    /* @ngInject */
    function UserPayWaysCtrl($scope,$yikeUtils,$rootScope,$state,$ionicHistory,$ionicModal,$ionicTabsDelegate,localStorageService,$ionicPlatform) {
        var id=$state.params;
        // $scope.setPayWay = setPayWay;
        $scope.user=localStorageService.get('user');
        // console.log($state.params);
        $scope.money =$state.params.price;
        $scope.confirm = confirm;
        init();
        function init() {
            // $ionicTabsDelegate.showBar(true);//打开导航栏
        }
        // function setPayWay(way){
        //     console.log(way);
        //     $scope.payway = way;
        // }
        function confirm(way){
             $scope.payway = way;
            if($scope.payway == "wx"){
                $yikeUtils.toast('自动充值授权目前支持（支付宝）,需要（微信）支付授权请联系客服!');
            }else{
                yikeTaishan.choseChargeWay($scope.payway,id.type,$scope.user.token)
                    .then(function (data) {
                        var subStatus = data.result.set.alipay.alipay_pay;
                        if($ionicPlatform.is("IOS")){
                            if(subStatus){
                                if(data.result.list.type=='1'){
                                    try{
                                        cordova.plugins.alipay.payment(data.result.list.form,function success(e){
                                            console.log(JSON.stringify(e));
                                            $yikeUtils.toast('支付成功');
                                        },function error(e){
                                            console.log(JSON.stringify(e));
                                            $yikeUtils.toast('支付失败');
                                        });
                                    }catch(ex){
                                        $yikeUtils.toast('支付未完成');
                                    }
                                }
                            }else{
                                $ionicLoading.toast("支付功能已关闭");
                            }
                        }else{
                            if(data.result.list.type=='1'){
                                try{
                                    cordova.plugins.alipay.payment(data.result.list.form,function success(e){
                                        console.log(JSON.stringify(e));
                                        $yikeUtils.toast('支付成功');
                                    },function error(e){
                                        console.log(JSON.stringify(e));
                                        $yikeUtils.toast('支付失败');
                                    });
                                }catch(ex){
                                    $yikeUtils.toast('支付未完成');
                                }
                            }
                        }
                    });
            }

        }
    }
})();

/**
 * Created by frank on 2016/9/9.
 */
(function () {
    'use strict';

    angular
        .module('user.recharge.controller', [])
        .controller('UserRechargeCtrl', UserRechargeCtrl);

    UserRechargeCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicLoading'];
    /* @ngInject */
    function UserRechargeCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicLoading){
        var user=localStorageService.get('user');
        var token='';
        $scope.user={
            phone:'',
            password:''
        };
        $scope.recharge=recharge;
        $scope.focus=focus;
        $scope.blur=blur;
        init();
        function init() {
            if(user){
                token=user.token;
            }
            //获取客服微信,qq
            yikeTaishan.personalCenter('platform','')
                .then(function (data) {
                    if(data.status == 1){
                        $scope.message=data.result;
                        $scope.$digest();
                    }
                })
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
        //表单验证
        function formValidation() {
            if($scope.user.phone == '' || $scope.user.phone == null){
                $yikeUtils.toast('请先输入手机号');
                return false;
            }else if($scope.user.password == '' || $scope.user.password == null){
                $yikeUtils.toast('请先输入卡密');
                return false;
            }else{
                return true;
            }
        }
        //充值
        function recharge() {
            var suc=formValidation();
            if(suc){
                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner>'
                });
                yikeTaishan.recharge($scope.user.phone,$scope.user.password,token)
                    .then(function (data) {
                        $yikeUtils.toast(data.result.result);
                        if( data.status ==1){
                            $state.go('login');
                        }
                    })
            }
        }
        //获取焦点隐藏other
        function focus() {
            document.getElementsByClassName('other')[0].classList.add('keyboard-hide');
        }
        //失去焦点显示other
        function blur(){
            document.getElementsByClassName('other')[0].classList.remove('keyboard-hide');
        }
    }
})();
/**
 * Created by frank on 2016/9/5.
 */
(function () {
    'use strict';

    angular
        .module('user.register.controller', [])
        .controller('UserRegisterCtrl', UserRegisterCtrl);

    UserRegisterCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','$ionicTabsDelegate','$ionicLoading'];
    /* @ngInject */
    function UserRegisterCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,$ionicTabsDelegate,$ionicLoading){
        $scope.user={
            phone:'',
            qq:'',
            name:'',
            password:'',
            passwordTwo:'',
            op:'register',
            msg:'',
            code:''
        };
        $scope.register=register;
        $scope.sendMsg=sendMsg;
        $scope.focus=focus;
        /*$scope.blur=blur;*/
        $scope.focusStyle = focusStyle;
        $scope.blurStyle = blurStyle;
        $scope.focusStyleState = 1;
        init();
        function init() {}
        //表单验证
        function formValidation() {
            if($scope.user.phone == '' || $scope.user.phone == null){
                $yikeUtils.toast('请先输入手机号');
                return false;
            }else if($scope.user.code == '' || $scope.user.code == null){
                $yikeUtils.toast('请先输入验证码');
                return false;
            }else if($scope.user.password == '' || $scope.user.password==null){
                $yikeUtils.toast('请先输入密码');
                return false;
            }else if($scope.user.password.length < 6){
                $yikeUtils.toast('密码长度至少6位');
                return false;
            }else if($scope.user.passwordTwo == '' || $scope.user.passwordTwo == null){
                $yikeUtils.toast('请再次输入密码');
                return false;
            }else if($scope.user.passwordTwo != $scope.user.password ){
                $yikeUtils.toast('两次密码不一致');
                return false;
            }else if($scope.user.phone != $scope.user.msg.phone){
                $yikeUtils.toast('请输入正确的验证码');
                return false;
            }else if($scope.user.code != $scope.user.msg.code){
                $yikeUtils.toast('请输入正确的验证码');
                return false;
            }else{
                return true;
            }
        }
        //发送短信验证码
        function sendMsg() {
            if($scope.user.phone == '' || $scope.user.phone==null){
                $yikeUtils.toast('请先输入手机号');
                return false;
            }
            yikeTaishan.sendMsg($scope.user.phone,$scope.user.op)
                .then(function (data) {
                    $yikeUtils.toast(data.result.result);
                    if(data.status == 1){
                        $scope.user.msg=data.result.msg;
                        var sendMsg=document.body.querySelector('#send-msg');
                        settime(sendMsg);
                    }
                });
        }
        var countdown=60;
        //倒计时
        function settime(obj) {
            if (countdown == 0) {
                obj.removeAttribute("disabled");
                obj.innerHTML="获取验证码";
                countdown = 60;
                return;
            } else {
                obj.setAttribute("disabled", true);
                obj.innerHTML="重新发送(" + countdown + ")";
                countdown--;
            }
            setTimeout(function() {
                    settime(obj) }
                ,1000)
        }
        /*获得焦点改变*/
        function focusStyle(){
            $scope.focusStyleState = 0;
        }
        /*失去焦点*/
        function blurStyle(){
            $scope.focusStyleState = 1;
        }
        //注册
        function register() {
            var suc=formValidation();
            if(suc){
                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner>',duration: 3000
                });
                yikeTaishan.register($scope.user.phone,'',$scope.user.qq,$scope.user.name,$scope.user.password,0)
                    .then(function (data) {
                        $yikeUtils.toast(data.result.result);
                        if( data.status ==1 ){
                            $state.go('login');
                        }
                    })
            }
        }
    }
})();

/**
 * Created by frank on 2016/9/9.
 */
(function () {
    'use strict';

    angular
        .module('user.reset.password.controller', [])
        .controller('UserResetPasswordCtrl', UserResetPasswordCtrl);

    UserResetPasswordCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','$ionicLoading'];
    /* @ngInject */
    function UserResetPasswordCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,$ionicLoading){
        $scope.user={
            phone:'',
            code:'',
            password:'',
            passwordTwo:'',
            op:'reset',
            msg:''
        };
        $scope.reset=reset;
        $scope.sendMsg=sendMsg;
        $scope.focus=focus;
        $scope.blur=blur;
        init();

        function init() {
            //是否显示充值等信息
            yikeTaishan.isShowRecharge()
                .then(function (data) {
                    $scope.isOpen=data.result.open;
                });
            //获取客服微信,qq
                yikeTaishan.personalCenter('platform','')
                    .then(function (data) {
                        if(data.status == 1){
                            $scope.message=data.result;
                            $scope.$digest();
                        }
                    })
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
        //表单验证
        function formValidation() {
            if($scope.user.phone == '' || $scope.user.phone == null){
                $yikeUtils.toast('请先输入手机号');
                return false;
            }else if($scope.user.code == '' || $scope.user.code == null){
                $yikeUtils.toast('请先输入验证码');
                return false;
            }else if($scope.user.password == '' || $scope.user.password==null){
                $yikeUtils.toast('请先输入密码');
                return false;
            }else if($scope.user.password.length < 6){
                $yikeUtils.toast('密码长度至少6位');
                return false;
            }else if($scope.user.passwordTwo == '' || $scope.user.passwordTwo == null){
                $yikeUtils.toast('请再次输入密码');
                return false;
            }else if($scope.user.passwordTwo != $scope.user.password ){
                $yikeUtils.toast('两次密码不一致');
                return false;
            }else if($scope.user.phone != $scope.user.msg.phone){
                $yikeUtils.toast('请输入正确的验证码');
                return false;
            }else if($scope.user.code != $scope.user.msg.code){
                $yikeUtils.toast('请输入正确的验证码');
                return false;
            }else{
                return true;
            }
        }
        //发送短信验证码
        function sendMsg() {
            if($scope.user.phone == '' || $scope.user.phone==null){
                $yikeUtils.toast('请先输入手机号');
                return false;
            }
            yikeTaishan.sendMsg($scope.user.phone,$scope.user.op)
                .then(function (data) {
                    $yikeUtils.toast(data.result.result);
                    if(data.status == 1){
                        $scope.user.msg=data.result.msg;
                        var sendMsg=document.body.querySelector('#send-msg');
                        settime(sendMsg);
                    }
                });
        }
        var countdown=60;
        //倒计时
        function settime(obj) {
            if (countdown == 0) {
                obj.removeAttribute("disabled");
                obj.innerHTML="获取验证码";
                countdown = 60;
                return;
            } else {
                obj.setAttribute("disabled", true);
                obj.innerHTML="重新发送(" + countdown + ")";
                countdown--;
            }
            setTimeout(function() {
                    settime(obj) }
                ,1000)
        }
        //重置密码
        function reset() {
            var suc=formValidation();
            if(suc){
                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner>'
                });
                yikeTaishan.modificationPassword('reset',$scope.user.phone,$scope.user.password,'','')
                    .then(function (data) {
                        $yikeUtils.toast(data.result.result);
                        if(data.status == 1){
                            $state.go('login');
                        }
                    })
            }
        }
        //获取焦点隐藏other
        function focus() {
            document.getElementsByClassName('other')[0].classList.add('keyboard-hide');
        }
        //失去焦点显示other
        function blur(){
            document.getElementsByClassName('other')[0].classList.remove('keyboard-hide');
        }
    }
})();
/**
 * Created by frank on 2016/9/8.
 */
(function () {
    'use strict';

    angular
        .module('user.scheme.controller', [])
        .controller('UserSchemeCtrl', UserSchemeCtrl);

    UserSchemeCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','$ionicPopup','$ionicLoading','localStorageService'];
    /* @ngInject */
    function UserSchemeCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,$ionicPopup,$ionicLoading,localStorageService){
        $scope.user=localStorageService.get('user');
        $scope.playingMethod='ssc';
        $scope.selectPlayingMethod=selectPlayingMethod;
        $scope.deleteCollect=deleteCollect;
        init();
        function init() {
            myCollect();
        }
        //我收藏的方案
        function myCollect() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
            });
            yikeTaishan.expire($scope.user.id,$scope.user.token)
                .then(function (data) {
                    if(data.status == 1){
                        yikeTaishan.myCollect('my_collection',$scope.playingMethod,$scope.user.id)
                            .then(function (data) {
                                $ionicLoading.hide();
                                if(data.status == 1){
                                    $scope.collect=data.result.collection;
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
        //选择玩法
        function selectPlayingMethod() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
            });
            myCollect();
        }
        //删除收藏
        function deleteCollect(id,index) {
            yikeTaishan.expire($scope.user.id,$scope.user.token)
                .then(function (data) {
                    if(data.status == 1){
                        var comfirmPopup=$ionicPopup.confirm({
                            title:'删除收藏方案',
                            template:'确认要删除？',
                            okText:'确定',
                            cancelText:'取消'
                        });
                        comfirmPopup.then(function(res) {
                            if (res) {
                                $ionicLoading.show({
                                    template: '<ion-spinner icon="bubbles"></ion-spinner>'
                                });
                                yikeTaishan.deleteCollect('delete',$scope.playingMethod,id)
                                    .then(function (data) {
                                        $ionicLoading.hide();
                                        $yikeUtils.toast(data.result.result);
                                        if(data.status == 1){
                                            $scope.collect.splice(index,1);
                                        }
                                        $scope.$digest();
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
                            $ionicLoading.hide();
                            localStorageService.remove('user');
                            $state.go('login')
                        });
                    }
                })
        }
    }
})();

/**
 * Created by frank on 2016/9/5.
 */
(function () {
    'use strict';

    angular
        .module('user.verification.email.controller', [])
        .controller('UserVerificationEmailCtrl', UserVerificationEmailCtrl);

    UserVerificationEmailCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','$ionicTabsDelegate','$ionicLoading'];
    /* @ngInject */
    function UserVerificationEmailCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,$ionicTabsDelegate,$ionicLoading){
        $scope.complete=complete;
        var uid=$state.params.uid;
        $scope.openEmailLink=openEmailLink;
        init();
        function init() {}
        //完成验证
        function complete() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
            });
            yikeTaishan.confirmEmail(uid)
                .then(function (data) {
                    if(data.status == 1){
                        $ionicLoading.hide();
                        $state.go('login');
                    }else{
                        $yikeUtils.toast(data.result.result);
                    }
                })
        }
        //跳自定义链接
        function openEmailLink() {
            window.open('http://ui.ptlogin2.qq.com/cgi-bin/login?style=9&appid=522005705&daid=4&s_url=https%3A%2F%2Fw.mail.qq.com%2Fcgi-bin%2Flogin%3Fvt%3Dpassport%26vm%3Dwsk%26delegate_url%3D%26f%3Dxhtml%26target%3D&hln_css=http%3A%2F%2Fmail.qq.com%2Fzh_CN%2Fhtmledition%2Fimages%2Flogo%2Fqqmail%2Fqqmail_logo_default_200h.png&low_login=1&hln_autologin=%E8%AE%B0%E4%BD%8F%E7%99%BB%E5%BD%95%E7%8A%B6%E6%80%81&pt_no_onekey=1','_system');
        }
    }
})();