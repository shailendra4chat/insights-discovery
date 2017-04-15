var express = require('express');
var Path = require('path');
var routes = express.Router();

var daasapi = require('./routes/daasapi');

//
//route to your index.html
//
var assetFolder = Path.resolve(__dirname, '../client/');
routes.use(express.static(assetFolder));

//
// JSON endpoint
//
routes.get('/api/algorithms', daasapi.getAlgorithms);
routes.get('/api/views', daasapi.getViews);
routes.get('/api/datasets', daasapi.getDatasets);
routes.get('/api/execute', daasapi.getExecute);
routes.get('/api/getdataofdataset', daasapi.getDataOfDataset);

//
// The Catch-all Route
// This is for supporting browser history pushstate.
// NOTE: Make sure this route is always LAST.
//
routes.get('/*', function(req, res){
  res.sendFile( assetFolder + '/index.html' )
})

//
// We're in development or production mode;
// create and run a real server.
//
var app = express();

// Parse incoming request bodies as JSON
app.use( require('body-parser').json() );

// Mount our main router
app.use('/', routes);

// Start the server!
var port = process.env.PORT || 3000;
app.listen(port);
console.log("Listening on port", port);
