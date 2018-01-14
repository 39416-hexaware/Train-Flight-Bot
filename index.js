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
                var resptemp = [];
                for (let i = 0; i < 5; i++) {
                    var objCard = new commonFiles.cardTemplate();
                    objCard.title = result[0][0].trains[i].name;
                    objCard.image_url = 'https://www.bahn.com/en/view/mdb/pv/agenturservice/2011/mdb_22990_ice_3_schnellfahrstrecke_nuernberg_-_ingolstadt_1000x500_cp_0x144_1000x644.jpg';
                    objCard.subtitle = `Train Number : ` + result[0][0].trains[i].number + `, Source : ` + result[0][0].trains[i].source.name + ` - ` + result[0][0].trains[i].source.code + `, Destination : ` + result[0][0].trains[i].dest.name + ` - ` + result[0][0].trains[i].dest.code + ``;
                    resptemp.push(objCard);

                }

                console.log(resptemp);
                response.setHeader('Content-Type', 'application/json');
                response.send(JSON.stringify({
                    "data": {
                        "facebook": {
                            "attachment": {
                                "type": "template",
                                "payload": {
                                    "template_type": "generic",
                                    "elements": resptemp
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
            }
        });
}

console.log("Server Running at Port : " + port);

app.listen(port);