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

var port = process.env.PORT || 7000;
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

            // Train workflow & Microservices
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
            else if (intentFrom === 'TrainIntent.BookTicket') {
                let boardingPoint = request.body.result.parameters.boardpoint;
                let destination = request.body.result.parameters.destination;
                let dateoftravel = request.body.result.parameters.dateoftravel;
                let tickets = request.body.result.parameters.tickets;
                url = commonFiles.APIList['RailwayAPI']();
                console.log(url);
                data = {
                    "IntentName": intentFrom,
                    "BoardingPoint": boardingPoint,
                    "Destination": destination,
                    "DateOfTravel": dateoftravel,
                    "Tickets": tickets
                };
                console.log(data);
            }
            // Flight workflow & Microservices
            else if (intentFrom === 'FlightIntent.BookFlight') {

                let boardingPoint = request.body.result.parameters.boardpoint;
                let destination = request.body.result.parameters.destination;
                let dateoftravel = request.body.result.parameters.dateoftravel;
                let tickets = request.body.result.parameters.tickets;
                url = commonFiles.APIList['FlightAPI']();
                console.log(url);
                data = {
                    "IntentName": intentFrom,
                    "BoardingPoint": boardingPoint,
                    "Destination": destination,
                    "DateOfTravel": dateoftravel,
                    "Tickets": tickets
                };
                console.log(data);
            }
            else if (intentFrom === 'FlightIntent.CancelFlight' || intentFrom === 'FlightIntent.FlightStatus' || intentFrom === 'FlightIntent.FlightFacilities') {
                let ticketNumber = request.body.result.parameters.ticketnumber;
                url = commonFiles.APIList['FlightAPI']();
                console.log(url);
                if(intentFrom === 'FlightIntent.CancelFlight') {
                    let reason = request.body.result.parameters.reason;
                    data = {
                        "IntentName": intentFrom,
                        "TicketNumber": ticketNumber.toUpperCase(),
                        "Reason": reason
                    };
                }
                else {
                    data = {
                        "IntentName": intentFrom,
                        "TicketNumber": ticketNumber.toUpperCase()
                    };
                }
                console.log(data);
            }
            else if (intentFrom === 'FlightIntent.RescheduleFlight') {
                let ticketNumber = request.body.result.parameters.ticketnumber;
                let dateOfReschedule = request.body.result.parameters.rescheduledate;
                url = commonFiles.APIList['FlightAPI']();
                console.log(url);

                let reason = request.body.result.parameters.reason;
                data = {
                    "IntentName": intentFrom,
                    "TicketNumber": ticketNumber.toUpperCase(),
                    "DateOfReschedule": dateOfReschedule
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

            requestAPI(options, function (error, resp, body) {
                if (error) {
                    console.dir(error);
                    msg = "An error occurred!";
                    commonFiles.sendMessage(response, msg);
                    return
                }
                else {
                    console.log('status code:' + resp.statusCode);

                    console.log('Inside data process');
                    firstfn(false, body);
                }
            });
        }],
        function (err, result) {
            var msg = '';
            var FBResp = [], SlackResp = [];
            console.log('Final Result');
            console.log(result);
            if (result == null || result == undefined) {
                msg = "An error occurred with API Microservice! Kindly contact adminsitrator";
                commonFiles.sendMessage(response, msg);
            }
            // else if (!result[0][0].hasOwnProperty('response_code')) {
            //     msg = "An error occurred with API Microservice! Kindly contact adminsitrator";
            //     commonFiles.sendMessage(response, msg);
            // }
            else {
                if (intentFrom === 'TrainIntent.CancelIntent') {
                    if (result[0][0].total > 0) {
                        console.log('Checking withd data')
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
                        },
                        {
                            "speech": "",
                            "messages": [
                                {
                                    "type": 2,
                                    "title": "Can I help you with anything else?",
                                    "replies": [
                                        "Train Services",
                                        "Flight Services",
                                        "Another query"
                                    ]
                                }
                            ]
                        }));
                    }
                    else {
                        msg = "No data found!";
                        commonFiles.sendMessage(response, msg);
                    }
                }
                else if (intentFrom === 'TrainIntent.PNRStatus') {
                    if (result[0][0].response_code == '220') {
                        response.setHeader('Content-Type', 'application/json');
                        response.send(JSON.stringify({
                            "speech": "",
                            "messages": [
                                {
                                    "type": 0,
                                    "speech": "PNR number is flushed"
                                },
                                {
                                    "type": 2,
                                    "title": "Can I help you with anything else?",
                                    "replies": [
                                        "Train Services",
                                        "Flight Services",
                                        "Another query"
                                    ]
                                }
                            ]
                        }));
                    }
                    else {
                        message = "The train " + result[0][0].train.name + " - " + result[0][0].train.number + " from  " + result[0][0].boarding_point.name + " to " + result[0][0].to_station.name + " is scheduled for " + result[0][0].total_passengers + " passenger(s) on" + result[0][0].doj;
                        response.setHeader('Content-Type', 'application/json');
                        response.send(JSON.stringify({
                            "speech": "",
                            "messages": [
                                {
                                    "type": 0,
                                    "speech": message
                                },
                                {
                                    "type": 2,
                                    "title": "Can I help you with anything else?",
                                    "replies": [
                                        "Train Services",
                                        "Flight Services",
                                        "Another query"
                                    ]
                                }
                            ]
                        }));
                    }
                }
                else if (intentFrom === 'TrainIntent.TrainRoute') {
                    var message = '';
                    console.log('inside train route');
                    console.log(result[0][0].route);

                    if (result[0][0].response_code == '200') {
                        if (result[0][0].route.length > 0) {
                            console.log('Checking withd data')
                            for (let i = 0; i < result[0][0].route.length; i++) {
                                message += result[0][0].route[i].station.code + ' - ' + result[0][0].route[i].station.name + ', ';
                            }

                            console.log(FBResp);
                            console.log(SlackResp);
                            response.setHeader('Content-Type', 'application/json');
                            response.send(JSON.stringify({
                                "speech": "",
                                "messages": [
                                    {
                                        "type": 0,
                                        "speech": "Please find the list of routes covered from Source To destination"
                                    },
                                    {
                                        "type": 0,
                                        "speech": message
                                    },
                                    {
                                        "type": 2,
                                        "title": "Can I help you with anything else?",
                                        "replies": [
                                            "Train Services",
                                            "Flight Services",
                                            "Another query"
                                        ]
                                    }
                                ]
                            }));
                        }
                    }
                    else {
                        msg = "Error occurred!";
                        commonFiles.sendMessage(response, msg);
                    }
                }
                else if (intentFrom === 'TrainIntent.GetStationCode') {
                    var message = '';
                    console.log('Station Code data')

                    if (result[0][0].stations.length > 0) {
                        // message = 'Station Code : ';
                        for (let i = 0; i < result[0][0].stations.length; i++) {
                            message += result[0][0].stations[i].code + ' - ' + result[0][0].stations[i].name + ', ';
                        }

                        response.setHeader('Content-Type', 'application/json');
                        response.send(JSON.stringify({
                            "speech": "",
                            "messages": [
                                {
                                    "type": 0,
                                    "speech": message
                                },
                                {
                                    "type": 2,
                                    "title": "Can I help you with anything else?",
                                    "replies": [
                                        "Train Services",
                                        "Flight Services",
                                        "Another query"
                                    ]
                                }
                            ]
                        }));
                    }
                    else {
                        msg = "Error occurred!";
                        commonFiles.sendMessage(response, msg);
                    }
                }
                else if (intentFrom === 'TrainIntent.BookTicket') {
                    var message = '';
                    let boardingPoint = request.body.result.parameters.boardpoint;
                    let destination = request.body.result.parameters.destination;
                    let dateoftravel = request.body.result.parameters.dateoftravel;
                    let tickets = request.body.result.parameters.tickets;
                    let ticketno = result[0];
                    console.log(ticketno);

                    message = 'Train ticket booking for ' + tickets + ' tickets is successful from ' + boardingPoint + ' - ' + destination + ' on ' + dateoftravel + '. Your ticket number is ' + ticketno;
                    console.log('Book ticket intent');

                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech": "",
                        "messages": [
                            {
                                "type": 0,
                                "speech": message
                            },
                            {
                                "type": 2,
                                "title": "Can I help you with anything else?",
                                "replies": [
                                    "Train Services",
                                    "Flight Services",
                                    "Another query"
                                ]
                            }
                        ]
                    }));
                }
                else if (intentFrom === 'FlightIntent.BookFlight') {
                    var message = '';
                    let boardingPoint = request.body.result.parameters.boardpoint;
                    let destination = request.body.result.parameters.destination;
                    let dateoftravel = request.body.result.parameters.dateoftravel;
                    let tickets = request.body.result.parameters.tickets;
                    let ticketno = result[0];
                    console.log(ticketno);

                    message = 'Flight ticket booking for ' + tickets + ' tickets is successful from ' + boardingPoint + ' - ' + destination + ' on ' + dateoftravel + '. Your ticket number is ' + ticketno;
                    console.log('Book ticket intent');

                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech": "",
                        "messages": [
                            {
                                "type": 0,
                                "speech": message
                            },
                            {
                                "type": 2,
                                "title": "Can I help you with anything else?",
                                "replies": [
                                    "Train Services",
                                    "Flight Services",
                                    "Another query"
                                ]
                            }
                        ]
                    }));
                }
                else if (intentFrom === 'FlightIntent.CancelFlight') {
                    console.log('Inside cancel flight');
                    let ticketno = result[0][0].ticketnumber;
                    let airportdet = result[0][0].airport.code + ' - ' + result[0][0].airport.name;
                    let flightdet = result[0][0].carrier.code + ' - ' + result[0][0].carrier.name;
                    var message = 'Flight ticket has been cancelled for ticket number - ' + ticketno;
                    let arrMessage = [
                        {
                            "type": 0,
                            "speech": message
                        },
                        {
                            "type": 1,
                            "title": airportdet,
                            "image_url": "URL",
                            "subtitle": flightdet,
                            "buttons": [{
                                "type": "web_url",
                                "url": "URL",
                                "title": "View Website"
                            }]
                        },
                        {
                            "type": 2,
                            "title": "Can I help you with anything else?",
                            "replies": [
                                "Train Services",
                                "Flight Services",
                                "Another query"
                            ]
                        }
                    ];
                    if (request.body.originalRequest.source == 'slack') {
                        console.log('Inside slack');
                        let arrIndex = arrMessage.findIndex(x => x.type == 1);
                        arrMessage.splice(arrIndex, 1);
                        // message += '\n' + flightdet + '\n' + airportdet;
                    }

                    console.log(ticketno);

                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech": "",
                        "messages": arrMessage
                    }));
                }
                else if (intentFrom === 'FlightIntent.FlightStatus') {
                    console.log('flight status');

                    let ticketno = result[0][0].ticketnumber;
                    let airportdet = result[0][0].airport.code + ' - ' + result[0][0].airport.name;
                    let flightdet = result[0][0].carrier.code + ' - ' + result[0][0].carrier.name;
                    let flightStatus = result[0][0].statistics.flights.status;
                    var message = 'Flight status for flight number - ' + ticketno + ' is "' + flightStatus + '"';
                    message += '\n' + flightdet + '\n' + airportdet;
                    let arrMessage = [
                        {
                            "type": 0,
                            "speech": message
                        },
                        {
                            "type": 2,
                            "title": "Can I help you with anything else?",
                            "replies": [
                                "Train Services",
                                "Flight Services",
                                "Another query"
                            ]
                        }
                    ];

                    console.log(ticketno);

                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech": "",
                        "messages": arrMessage
                    }));
                }
                else if (intentFrom === 'FlightIntent.RescheduleFlight') {
                    console.log('flight status');

                    let ticketno = result[0][0].ticketnumber;
                    let airportdet = result[0][0].airport.code + ' - ' + result[0][0].airport.name;
                    let flightdet = result[0][0].carrier.code + ' - ' + result[0][0].carrier.name;
                    var message = 'Flight has been rescheduled for flight number - ' + ticketno + '.';
                    message += '\n' + flightdet + '\n' + airportdet;
                    let arrMessage = [
                        {
                            "type": 0,
                            "speech": message
                        },
                        {
                            "type": 2,
                            "title": "Can I help you with anything else?",
                            "replies": [
                                "Train Services",
                                "Flight Services",
                                "Another query"
                            ]
                        }
                    ];

                    console.log(ticketno);

                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech": "",
                        "messages": arrMessage
                    }));
                }
                else if (intentFrom === 'FlightIntent.FlightFacilities') {
                    let ticketno = result[0][0].ticketnumber;
                        console.log('Check in data')
                            // Facebook Carousel
                            var objFBCard = new commonFiles.FBcardTemplate();
                            objFBCard.title = "Facilities Available in Flight";
                            objFBCard.image_url = 'https://imgak.mmtcdn.com/pwa-hlp/assets/img/hlp/deals/ic-flight-3.jpg';
                            objFBCard.subtitle = `Flight Number : ` + result[0][0].ticketnumber + `, Class : ` + result[0][0].facilities.class + ` , Meals ` + result[0][0].facilities.food + `, Entertainment : ` + result[0][0].facilities.food + ``;
                            FBResp.push(objFBCard);

                            // Slack Carousel
                            var objSlackCard = new commonFiles.SlackcardTemplate();
                            objSlackCard.title = "Facilities Available in Flight";
                            objSlackCard.text = `Flight Number : ` + result[0][0].ticketnumber + `, Class : ` + result[0][0].facilities.class + ` , Meals ` + result[0][0].facilities.food + `, Entertainment : ` + result[0][0].facilities.food + ``;
                            objSlackCard.image_url = 'https://imgak.mmtcdn.com/pwa-hlp/assets/img/hlp/deals/ic-flight-3.jpg';
                            objSlackCard.thumb_url = 'https://imgak.mmtcdn.com/pwa-hlp/assets/img/hlp/deals/ic-flight-3.jpg';
                            objSlackCard.footer = 'Flight Facilities';
                            SlackResp.push(objSlackCard);

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
            }
        });
}

console.log("Server Running at Port : " + port);

app.listen(port);