/* globals env_json */
;(function() {
    'use strict';

    angular
        .module('app', [
            'ngStorage',
            'ui.router',
            // 'ui.bootstrap',
        ])
        .config(DefaultRouteConfig)
        .config(Routes);

    function DefaultRouteConfig($locationProvider, $urlRouterProvider, $httpProvider) {
        $locationProvider.html5Mode(false);
        $urlRouterProvider.otherwise('/dashboard');
    }

    function Routes($stateProvider) {
        $stateProvider
        .state('barrier', {
            url: '/',
            controller: 'BarrierController',
            controllerAs: 'vm',
            templateUrl: "/views/barrier.html"
        })
        .state('lobby', {
            url: '/lobby',
            controller: 'LobbyController',
            controllerAs: 'vm',
            templateUrl: "/views/lobby.html"
        });
    }
})();
