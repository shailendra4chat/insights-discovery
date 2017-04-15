'use strict';

angular.module('app')
  .controller('ReportsCtrl', ['$scope', '$http', function($scope, $http) {
  	$scope.welcome = 'Welcome to Reports!';
      $scope.buttonText = 'Back to Home';

	$http.get('/api/setcall').
	    success(function(data, status, headers, config) {
	    console.log(data);
    });
  }]);
