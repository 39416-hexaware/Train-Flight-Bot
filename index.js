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

    // CallAPI(req, res);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        "data": {
            "facebook": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Smurfs: The Lost Village (2017)",
                                "image_url": "https://www.moovrika.com/ext/makeimg.php?tbl=movies&id=15666&img=1&type=image&movie=Smurfs+The+Lost+Village&fs=400",
                                "subtitle": "Smurfette attempts to find her purpose in the village. When she encounters a creature in the Forbidden Forest who drops a mysterious map, she sets off with her friends Brainy, Clumsy, and Hefty on an adventure to find the Lost Village before the evil wizard Gargamel does.",
                                "default_action": {
                                    "type": "web_url",
                                    "url": "https://www.moovrika.com/m/15666",
                                    "webview_height_ratio": "tall"
                                },
                                "buttons": [
                                    {
                                        "title": "more info",
                                        "type": "web_url",
                                        "url": "https://www.moovrika.com/m/4082",
                                        "webview_height_ratio": "tall"
                                    },
                                    {
                                        "title": "View trailer",
                                        "type": "web_url",
                                        "url": "https://www.moovrika.com/m/4082",
                                        "webview_height_ratio": "tall"
                                    }
                                ]
                            },
                            {
                                "title": "Resident Evil: The Final Chapter (2017)",
                                "image_url": "https://www.moovrika.com/ext/makeimg.php?tbl=movies&id=4167&img=1&type=image&movie=Resident+Evil+The+Final+Chapter&fs=400",
                                "subtitle": "Resident Evil: The Final Chapter is an upcoming science fiction action horror film written and directed by Paul W. S. Anderson. It is the sequel to Resident Evil: Retribution (2012), and will be the sixth and final installment in the Resident Evil film series, which is very loosely based on the Capcom survival horror video game series Resident Evil.",
                                "default_action": {
                                    "type": "web_url",
                                    "url": "https://www.moovrika.com/m/4167",
                                    "webview_height_ratio": "tall"
                                },
                                "buttons": [
                                    {
                                        "title": "more info",
                                        "type": "web_url",
                                        "url": "https://www.moovrika.com/m/4082",
                                        "webview_height_ratio": "tall"
                                    }
                                ]
                            }
                        ]
                    }
                }
            },
            "kik": {
                "type": "",
                "body": ""
            },
            "slack": {
                "text": "",
                "attachments": []
            },
            "telegram": {
                "text": ""
            }
        }
    }));

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
                        firstfn(false, body);
                    }
                });
            }
        }],
        function (err, result) {
            console.log('Final Result');
            console.log(result[0].total);
            console.log(JSON.stringify(result[0].trains));

            if (result[0].total > 10) {
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
            }
        });
}

console.log("Server Running at Port : " + port);

app.listen(port);