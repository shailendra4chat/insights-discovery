'use strict';

angular.module('app', [
    'ui.router',
    'chart.js',
	'nvd3'
  ])

    .config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl'
        })
        .state('reports', {
            url: '/reports',
            templateUrl: 'views/reports.html',
            controller: 'ReportsCtrl'
        });
        
});
