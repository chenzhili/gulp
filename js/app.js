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
