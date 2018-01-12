//imports
var express = require('express');
var bodyParser = require('body-parser');
var data = require('./dataProcessor');
var async = require('async');

app = express();
//Create express object

var port = 7000;
//Assign port
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Configuring express app behaviour

app.get("/MicroService", function (req, res) {

    console.log('Inside get method');
    //https://limitless-beyond-94753.herokuapp.com/RailwayAPI

    let action = 'LaunchRequest';
    data.DataProcess[action];

    async.parallel([
        function (firstfn) {
            console.log('Inside MicroService');
            data.DataProcess[action];
            firstfn(false, 'Data received Successfully');
        }],
        function (err, results) {
            res.send("Bot works");
            console.log(results);
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