'use strict';

angular.module('app')
.config(function($httpProvider){
	 delete $httpProvider.defaults.headers.common['X-Requested-With'];
})
.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {
 
	$scope.isReport            = false;
	$scope.datasets            = {};
	$scope.views               = {};
	$scope.algorithms          = {};
	$scope.datapoints          = {};
	$scope.graphdata           = {};
	$scope.selectedDatasetId   = 0;
	$scope.selectedViewId      = 0;
	$scope.selectedAlgorithmId = 0;
	
	$.support.cors             = true;
	
	$scope.getDatasets = function(){
		$http.get('/api/datasets')
		.then(function(response) {			
			$scope.datasets = response.data;
			$scope.datasetsLength = response.data.length;
		}, function(error) { 
			console.log(error);
		}); 
	};

	$scope.getViews = function () {
		$http.get('/api/views')
		.then(function(response) {			
			$scope.views = response.data;
			$scope.viewsLength = response.data.length;
		}, function(error) { 
			console.log(error);
		});
	};
	
	$scope.getAlgorithms = function () {
		$http.get('/api/algorithms')
		.then(function(response) {
			 $scope.algorithms = response.data;
			 $scope.algorithmsLength = response.data.length;
		}, function(error) { 
			console.log(error);
		});
	};
	
	$scope.getDataofDataSet = function (datasetId, viewId, algorithmId) { 
		$http.get('/api/getdataofdataset?datasetid=' + datasetId)
		.then(function(response) {			
			$scope.graphdata = response.data;

			$http.get('/api/execute?datasetid=' + datasetId + '&viewid=' + viewId + '&algorithmid=' + algorithmId)
			.then(function(response) {
				$scope.datapoints = response.data;
				$scope.loadGraphWithData($scope.graphdata);
			}, function(error) { 
				console.log(error);
			}); 			
		}, function(error) { 
			console.log(error);
		});
	};
		
	$scope.selectDataset = function(datasetId, datasetName){
		$scope.isReport            = true;
		$scope.selectedDatasetId   = datasetId;
		$scope.selectedDatasetName = datasetName;
	};
	
	$scope.selectView = function(viewId, viewName){
		$scope.isReport         = true;
		$scope.selectedViewId   = viewId;
		$scope.selectedViewName = viewName;
	};

	$scope.selectAlgorithm = function(algorithmId, algorithmtName){
		$scope.isReport              = true;
		$scope.selectedAlgorithmId   = algorithmId;
		$scope.selectedAlgorithmName = algorithmtName;
	};

	$scope.drawGraph = function(){
		$scope.isGraph = true;
		$scope.getDataofDataSet($scope.selectedDatasetId, $scope.selectedViewId, $scope.selectedAlgorithmId);		
	};
	
	$scope.loadGraphWithData = function(graphData) {
	
		/*
		//Angular-Chart
		$scope.labels          = graphData.xAxisArray;
		$scope.data            = [graphData.yAxisArray] 
		$scope.series          = ['Series A'];
		$scope.colors          = [{"fillColor": "#000"}];
		$scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
		$scope.options = {
			responsive: true,
			showTooltips: true,
			maintainAspectRatio: true,
			showScale: true,
			scales: { yAxes: [{id: 'y-axis-1', type: 'linear', display: true, position: 'left'}] }
		};
		*/
		
		//console.log($scope.datapoints)
		
		var newArray = [];		
		angular.forEach(graphData.JQueryArray, function(graphDataValue, graphDataKey) {		
			angular.forEach($scope.datapoints, function(dataPointValue, dataPointKey) {			
			//console.log(graphDataValue.label +'=='+ dataPointValue.timestamp +'&&'+ graphDataValue.y +'=='+ dataPointValue.anom)
				if (graphDataValue.label == dataPointValue.timestamp && graphDataValue.y == dataPointValue.anoms) {
					newArray.push({'label': graphDataValue.label, 'y': graphDataValue.y, 'color': 'red'});
				}
				else {
					newArray.push(graphDataValue);
				}
			});		
		});
		
		//console.log(newArray);
		//console.log(graphData.JQueryArray);
			
		//JQuery CanvasJS 
		var chart = new CanvasJS.Chart("chartContainer", {
			title:{text: "Anomaly Chart"},
			animationEnabled: true,			
			axisY:{ title: "Y Demo" },
			legend: { verticalAlign: "bottom", horizontalAlign: "center"},
			theme: "theme2",
			data: [{type: "column", showInLegend: true, color: "green", dataPoints:newArray}]			
			//data: [{type: "column", showInLegend: true, color: "green", dataPoints:graphData.JQueryArray}]			
		});
		chart.render();	
		
		/*
		//nvD3 Graphs
		$scope.dataD3 = [{values: graphData.JQueryArray, key: 'Sine Wave', color: '#ff7f0e', strokeWidth: 2, classed: 'dashed'}];		
		$scope.optionsD3 = {
            chart: {
				type: 'discreteBarChart',
				useInteractiveGuideline: true,
				showLabels: true,
				x: function(d){return d.label;},
                y: function(d){return d.y;},
				xAxis: { rotateLabels: -90 },
				margin : { top: 0, right: 0, bottom: 80, left: 0 },
				color: function(d){return "red"}
			}
		};
		*/
	};
	
	$scope.getDatasets();
	$scope.getViews();
	$scope.getAlgorithms();
}]);