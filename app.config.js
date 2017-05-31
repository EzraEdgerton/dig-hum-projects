'use strict';

angular.
  module('dighumApp').
  config(['$locationProvider' ,'$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/', {
          templateUrl : "homepage.html"
        }).
        when('/all-vis-aug', {
          templateUrl : "twitter-network-creator/all-vis/all-vis-aug.template.html"
        }).
        when('/all-vis-nov-dec', {
          templateUrl : "twitter-network-creator/all-vis/all-vis-nov-dec.template.html"
        }).
        when('/basic-aug', {
          templateUrl : "twitter-network-creator/basic-stats/basic-aug.template.html"
        }).
        when('/basic-nov-dec', {
          templateUrl : "twitter-network-creator/basic-stats/basic-nov-dec.template.html"
        }).
        when('/plant-gen-map', {
          templateUrl : "plantgenmap/new_map.template.html"
        }).
        otherwise('/');
    }
  ]);
