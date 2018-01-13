//imports
var express = require('express');
var bodyParser = require('body-parser');
var data = require('./dataProcessor');
var async = require('async');
var requestAPI = require('request');
const commonFiles = require('./util/commonfiles');

app = express();
//Create express object

var port = process.env.PORT || 5000;
//Assign port
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Configuring express app behaviour

// app.get("/MicroService", function (req, res) {
//     //res.send("Bot works");
//     console.log('Inside get method');
//     const header = {
//         'Cache-Control': 'no-cache',
//         Accept: 'application/json',
//         'Content-Type': 'application/json'
//     };
//     //https://limitless-beyond-94753.herokuapp.com/RailwayAPI

//     // let action = 'LaunchRequest';
//     // data.DataProcess[action];

//     // async.parallel([
//     //     function (firstfn) {
//     //         console.log('Inside MicroService');
//     //         data.DataProcess[action];
//     //         firstfn(false, 'Data received Successfully');
//     //     }],
//     //     function (err, results) {
//     //         res.send("Bot works");
//     //         console.log(results);
//     //     });

//     var options = {
//         url: 'https://limitless-beyond-94753.herokuapp.com/RailwayAPI', //,urlPath, //'https://api.railwayapi.com/v2/pnr-status/pnr/4338716830/apikey/sl5zmz3g1w'
//         method: 'POST',
//         header: header,
//         body: '',
//         json: true
//     };

//     request(options, function (error, response, body) {
//         if (error) {
//             console.dir(error);
//             return
//         }
//         console.log('headers:' + response.headers);
//         console.log('status code:' + response.statusCode);
//         console.log(body);

//         console.log('Inside data process');
//     });
// });
//GET Endpoint

// app.post("/MicroService", function (req, res) {
//     let action = 'LaunchRequest';

//     async.parallel([
//         function (firstfn) {
//             console.log('Inside MicroService');
//             data.DataProcess[action];
//             firstfn(false, 'Data received Successfully');
//         }],
//         function (err, results) {
//             console.log(results);
//         });
//     console.log(JSON.stringify(req.body.result.action));

//     console.log('req.body.originalRequest.source');
// });

app.post("/Bot", function (req, res) {
    // commonFiles.headerTemplate();

    CallAPI(req, res);
    // res.setHeader('Content-Type', 'application/json');
    // res.send(JSON.stringify({
    //     "data": {
    //         "facebook": {
    //             "text": "Choose a department:",
    //             "quick_replies": [
    //                 {
    //                     "content_type": "text",
    //                     "title": "Cancelled",
    //                     "payload": "Cancelled"
    //                 }
    //             ]
    //         }
    //     }
    // }));

    console.log('Inside Express');
});
//POST Call Endpoint


function CallAPI(request, response) {
    console.log(JSON.stringify(request.body));
    async.parallel([
        function (firstfn) {
            var intentFrom = request.body.result.action;

            console.log('Inside MicroService');

            console.log(intentFrom);

            console.log(request.body.result.parameters.canceldate);

            if (intentFrom === 'TrainIntent.CancelIntent') {
                let cancelledDate = request.body.result.parameters.canceldate;
                let url = commonFiles.APIList[intentFrom](cancelledDate);

                console.log(url);

                var options = {
                    url: url,
                    method: 'GET',
                    header: commonFiles.headerTemplate(),
                    body: '',
                    json: true
                };

                requestAPI(options, function (error, response, body) {
                    if (error) {
                        console.dir(error);
                        return
                    }
                    else {
                        console.log('status code:' + response.statusCode);

                        console.log('Inside data process');
                        firstfn(false, JSON.stringify(body));
                    }
                });
            }
        }],
        function (err, result) {

            console.log('Final Result')
            console.log(result);
            // console.log(result.trains.length);

            // if (result.trains.length > 10) {
                response.setHeader('Content-Type', 'application/json');
                response.send(JSON.stringify({
                    "data": {
                        "facebook": {
                            "text": "Cancel API success",
                            "quick_replies": [
                                {
                                    "content_type": "text",
                                    "title": "Cancelled",
                                    "payload": "Cancelled"
                                }
                            ]
                        }
                    }
                }));
            // }
        });
}

console.log("Server Running at Port : " + port);

app.listen(port);