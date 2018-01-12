//imports
var express = require('express');
var bodyParser = require('body-parser');
var data = require('./dataProcessor');
var async = require('async');
var request = require('request');

app = express();
//Create express object

var port = 7000;
//Assign port
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Configuring express app behaviour

app.get("/MicroService", function (req, res) {
    //res.send("Bot works");
    console.log('Inside get method');
    const header = {
        'Cache-Control': 'no-cache',
        Accept: 'application/json',
        'Content-Type': 'application/json'
    };
    //https://limitless-beyond-94753.herokuapp.com/RailwayAPI

    // let action = 'LaunchRequest';
    // data.DataProcess[action];

    // async.parallel([
    //     function (firstfn) {
    //         console.log('Inside MicroService');
    //         data.DataProcess[action];
    //         firstfn(false, 'Data received Successfully');
    //     }],
    //     function (err, results) {
    //         res.send("Bot works");
    //         console.log(results);
    //     });

    var options = {
        url: 'https://limitless-beyond-94753.herokuapp.com/RailwayAPI', //,urlPath, //'https://api.railwayapi.com/v2/pnr-status/pnr/4338716830/apikey/sl5zmz3g1w'
        method: 'POST',
        header: header,
        body: '',
        json: true
    };

    request(options, function (error, response, body) {
        if (error) {
            console.dir(error);
            return
        }
        console.log('headers:' + response.headers);
        console.log('status code:' + response.statusCode);
        console.log(body);

        console.log('Inside data process');
    });
});
//GET Endpoint

app.post("/MicroService", function (req, res) {
    let action = 'LaunchRequest';

    async.parallel([
        function (firstfn) {
            console.log('Inside MicroService');
            data.DataProcess[action];
            firstfn(false, 'Data received Successfully');
        }],
        function (err, results) {
            console.log(results);
        });
    console.log(JSON.stringify(req.body.result.action));

    console.log('req.body.originalRequest.source');
});
//POST Call Endpoint

console.log("Server Running at Port : " + port);

app.listen(port);