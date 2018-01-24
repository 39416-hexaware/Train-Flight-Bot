var api = '';

module.exports.headerTemplate = function () {
    var header = {
        'Cache-Control': 'no-cache',
        Accept: 'application/json',
        'Content-Type': 'application/json'
    };
    return header;
}

module.exports.sendMessage = function (response, message) {
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

var APIList = {
    'RailwayAPI': () => {
        console.log('Inside Railway APIList');
        api = 'http://34.229.40.189:7001/RailwayAPI';
        return api;
    },
    'FlightAPI': () => {
        console.log('Inside Flight APIList');
        api = 'http://34.229.40.189:7002/FlightAPI';
        return api;
    }
};

var FBcardTemplate = function () {
    var title = null;
    var image_url = null;
    var subtitle = null;
};

var SlackcardTemplate = function () {
    var fallback = "Required plain-text summary of the attachment.";
    color = "#36a64f";
    var pretext = null;
    var title = null;
    var text = null;
    var image_url = null;
    var thumb_url = null;
    var footer = null;
    var footer_icon = "https://platform.slack-edge.com/img/default_application_icon.png";
    var ts = 123456789;
};

var CustomListTemplate = function () {
    var type = 1;
    var title = null;
    var image_url = null;
    var subtitle = null;
    var buttons = [{
        "type": "web_url",
        "url": "URL",
        "title": "View Website"
    }];
}

module.exports.APIList = APIList;
module.exports.FBcardTemplate = FBcardTemplate;
module.exports.SlackcardTemplate = SlackcardTemplate;
module.exports.CustomListTemplate = CustomListTemplate;