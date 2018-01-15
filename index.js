//imports
var express = require('express');
var bodyParser = require('body-parser');
var data = require('./dataProcessor');
var async = require('async');
var requestAPI = require('request');
const commonFiles = require('./util/commonfiles');
var intentFrom = '';
app = express();
//Create express object

var port = process.env.PORT || 5000;
//Assign port
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Configuring express app behaviour

app.get("/MicroService", function (req, res) {
    res.send("Bot works");
});
//GET Endpoint

app.post("/Bot", function (req, res) {

    CallAPI(req, res);

    console.log('Inside Express');
});
//POST Call Endpoint


function CallAPI(request, response) {
    console.log(JSON.stringify(request.body));
    async.parallel([
        function (firstfn) {
            intentFrom = request.body.result.action;
            var data = '', url = '';

            console.log('Inside MicroService');

            if (intentFrom === 'TrainIntent.CancelIntent') {
                let cancelledDate = request.body.result.parameters.canceldate;
                url = commonFiles.APIList['RailwayAPI']();

                console.log(url);

                data = {
                    "IntentName": intentFrom,
                    "CancelledDate": cancelledDate
                };
                console.log(data);
            }
            else if (intentFrom === 'TrainIntent.PNRStatus') {
                let pnrNumber = request.body.result.parameters.pnrnumber;
                url = commonFiles.APIList['RailwayAPI']();

                console.log(url);

                data = {
                    "IntentName": intentFrom,
                    "PNRNumber": pnrNumber
                };
                console.log(data);
            }
            else if (intentFrom === 'TrainIntent.TrainRoute') {
                let trainNumber = request.body.result.parameters.trainnumber;
                url = commonFiles.APIList['RailwayAPI']();

                console.log(url);

                data = {
                    "IntentName": intentFrom,
                    "TrainNumber": trainNumber
                };
                console.log(data);
            }
            else if (intentFrom === 'TrainIntent.GetStationCode') {
                let stationName = request.body.result.parameters.stationname;
                url = commonFiles.APIList['RailwayAPI']();

                console.log(url);

                data = {
                    "IntentName": intentFrom,
                    "StationName": stationName
                };
                console.log(data);
            }

            var options = {
                url: url,
                method: 'POST',
                header: commonFiles.headerTemplate(),
                body: data,
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
        }],
        function (err, result) {
            console.log('Final Result');
            console.log(result);

            if (intentFrom === 'TrainIntent.CancelIntent') {
                var FBResp = [], SlackResp = [];
                for (let i = 0; i < 5; i++) {

                    // Facebook Carousel
                    var objFBCard = new commonFiles.FBcardTemplate();                    
                    objFBCard.title = result[0][0].trains[i].name;
                    objFBCard.image_url = 'https://www.bahn.com/en/view/mdb/pv/agenturservice/2011/mdb_22990_ice_3_schnellfahrstrecke_nuernberg_-_ingolstadt_1000x500_cp_0x144_1000x644.jpg';
                    objFBCard.subtitle = `Train Number : ` + result[0][0].trains[i].number + `, Source : ` + result[0][0].trains[i].source.name + ` - ` + result[0][0].trains[i].source.code + `, Destination : ` + result[0][0].trains[i].dest.name + ` - ` + result[0][0].trains[i].dest.code + ``;
                    FBResp.push(objFBCard);

                    // Slack Carousel
                    var objSlackCard = new commonFiles.SlackcardTemplate();
                    objSlackCard.title = result[0][0].trains[i].name;
                    objSlackCard.text = `Train Number : ` + result[0][0].trains[i].number + `, Source : ` + result[0][0].trains[i].source.name + ` - ` + result[0][0].trains[i].source.code + `, Destination : ` + result[0][0].trains[i].dest.name + ` - ` + result[0][0].trains[i].dest.code + ``;
                    objSlackCard.image_url = 'https://www.bahn.com/en/view/mdb/pv/agenturservice/2011/mdb_22990_ice_3_schnellfahrstrecke_nuernberg_-_ingolstadt_1000x500_cp_0x144_1000x644.jpg';
                    objSlackCard.thumb_url = 'https://www.bahn.com/en/view/mdb/pv/agenturservice/2011/mdb_22990_ice_3_schnellfahrstrecke_nuernberg_-_ingolstadt_1000x500_cp_0x144_1000x644.jpg';
                    objSlackCard.footer = 'Cancelled';
                    SlackResp.push(objSlackCard);
                }

                console.log(FBResp);
                console.log(SlackResp);
                response.setHeader('Content-Type', 'application/json');
                response.send(JSON.stringify({
                    "data": {
                        "facebook": {
                            "attachment": {
                                "type": "template",
                                "payload": {
                                    "template_type": "generic",
                                    "elements": FBResp
                                }
                            }
                        },
                        "slack": {
                            "text": "",
                            "attachments": SlackResp
                        }
                    }
                }));
            }
        });
}

console.log("Server Running at Port : " + port);

app.listen(port);