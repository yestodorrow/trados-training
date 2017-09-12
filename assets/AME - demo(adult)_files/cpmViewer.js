
//
// Define the 'app' module.
//
var cpmAuthApp = angular.module('cpmApplication', ['cpmDiagramReadOnly', 'ng-context-menu', 'ui.router', 'ng.httpLoader', 'sitecoreServiceMod', 'uuid', 'ngSanitize','cpmAppCommon']).constant('settings', CpmAuthoringView.config.settings)
    .config([
        'httpMethodInterceptorProvider',
        function(httpMethodInterceptorProvider) {
            httpMethodInterceptorProvider.whitelistDomain('mayo.edu');
            httpMethodInterceptorProvider.whitelistDomain('mayoclinic.org');
            //used on my local. Can be removed for prod.
            httpMethodInterceptorProvider.whitelistDomain('dataservices');
            httpMethodInterceptorProvider.whitelistDomain('kcms');
            // ...
        }
    ])
    .config([
        '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
            //
            // For any unmatched url, redirect to /state1
            $urlRouterProvider.otherwise("/");
            //
            // Now set up the states
            $stateProvider
                .state('view', {
                    url: "",
                    templateUrl: "cpmDisplayContainerTemplate.html"
                })
                 .state('viewDefault', {
                     url: "/",
                     templateUrl: "cpmDisplayContainerTemplate.html"
                 })
                .state('raw', {
                    url: "/raw",
                    templateUrl: "rawModelTemplate.html"
                });
        }
    ]).config([
        '$provide', function($provide) {
            $provide.decorator('$rootScope', [
                '$delegate', function($delegate) {

                    Object.defineProperty($delegate.constructor.prototype, '$onRootScope', {
                        value: function(name, listener) {
                            var unsubscribe = $delegate.$on(name, listener);
                            this.$on('$destroy', unsubscribe);

                            return unsubscribe;
                        },
                        enumerable: false
                    });


                    return $delegate;
                }
            ]);
        }
    ]).config(['$locationProvider', function ($locationProvider) {
        //$locationProvider.html5Mode({enabled:false, requireBase:false});
    }]);/*
.config(['dialogsProvider', function (dialogsProvider) {
    dialogsProvider.useBackdrop('static');
    dialogsProvider.useEscClose(true);
    dialogsProvider.useCopy(false);
    dialogsProvider.setSize('lg');
}]);
*/