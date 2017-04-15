 'use strict';
/*
 * Serve JSON to our AngularJS client
 */
let csvtojson    = require('csvtojson');
let RestClient   = require('node-rest-client').Client;
let restClient   = new RestClient();
let request = require("request");

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

// API endpoint
let apiEndpoint 	= process.env.API_ENDPOINT
let consumerKey	 	= process.env.CONSUMER_KEY
let consumerSecret 	= process.env.CONSUMER_SECRET
let apiUsername 	= process.env.API_USERNAME || 'shailendra'
let apiPassword 	= process.env.API_PASSWORD || 'shailendra'

let accessTokenObj;

function getAccessToken(callback){
	let options = {
		method: 'POST',
		url: apiEndpoint + '/token',
		qs: {
			grant_type: 'password',
			username: apiUsername,
			password: apiPassword
		},
		headers: {
			'cache-control': 'no-cache',
			'authorization': 'Basic ' + new Buffer(consumerKey+':'+consumerSecret).toString('base64')
		}
	};

	request(options, function (error, response, body) {
		if (error) callback(error, null)

		callback(null, body)
	});
}

getAccessToken(function(error, res){
	if(error) console.log(error)

	accessTokenObj = JSON.parse(res);
});

exports.getAlgorithms = function (req, res) {
	let options = {
		headers: {
			"accept": "application/json",
			'authorization': 'Bearer ' + accessTokenObj.access_token
		}
	};
	
	restClient.get(apiEndpoint + "/analytics/v1.0.0/algorithms", options, function (data, response) {
		res.send(data);
	})
	.on('error', function (error) {
		res.send(error);
	});
};

exports.getViews = function (req, res) {
	let options = {
		headers: {
			"accept": "application/json",
			'authorization': 'Bearer ' + accessTokenObj.access_token
		}
	};
	
	restClient.get(apiEndpoint + "/analytics/v1.0.0/views", options, function (data, response) {
		res.send(data);
	})
	.on('error', function (error) {
		res.send(error);
	});
};

exports.getDatasets = function (req, res) {
	let options = {
		headers: {
			"accept": "application/json",
			'authorization': 'Bearer ' + accessTokenObj.access_token
		}
	};
	
	restClient.get(apiEndpoint + "/dataproducts/v1.0.0/data/products", options, function (data, response) {
		res.send(data);
	})
	.on('error', function (error) {
		res.send(error);
	});
};

exports.getExecute = function (req, res) {

	let options = {
		headers: {
			"accept": "application/json",
			'authorization': 'Bearer ' + accessTokenObj.access_token
		}
	};
	
	let datasetid   = req.query.datasetid;
	let viewid      = req.query.viewid;
	let algorithmid = req.query.algorithmid;
		
	restClient.get(apiEndpoint + "/analytics/v1.0.0/data/execute/"+datasetid+"/"+viewid+"/"+algorithmid, options, function (data, response) {
		res.send(data);
	})
	.on('error', function (error) {
		res.send(error);
	});
};

exports.getDataOfDataset = function (req, res) {

	let options = {
		headers: {
			"accept": "application/json",
			'authorization': 'Bearer ' + accessTokenObj.access_token
		}
	};
	
	let datasetid   = req.query.datasetid;
	
	restClient.get(apiEndpoint + "/dataproducts/v1.0.0/data/products/"+datasetid, options, function (data, response) {		
		let xAxisArray    = [];
		let yAxisArray    = [];
		let csvArray	  = [];
		let JQueryArray   = [];
		let csvFilePath   =__dirname + '/myfile1.csv';
		console.log(data);
		
		csvtojson().fromFile(csvFilePath)
		.on('json',(jsonObj) => { 			
			xAxisArray.push(jsonObj.milktimestamp); 
			yAxisArray.push(jsonObj.count); 
			JQueryArray.push({'label': jsonObj.milktimestamp, 'y': parseInt(jsonObj.count), 'color': ''})
			csvArray.push(jsonObj) 			
		})
		.on('done',(error) => {
			res.send({'xAxisArray' : xAxisArray, 'yAxisArray' : yAxisArray, 'JQueryArray' : JQueryArray, 'csvArray' : csvArray});
		});		
	})
	.on('error', function (error) {
		res.send(error);
	});
};