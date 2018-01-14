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
        "speech": message, "displayText": message
    }));
}

var APIList = {
    'RailwayAPI': () => {
        console.log('Inside Railway APIList');
        api = 'https://limitless-beyond-94753.herokuapp.com/RailwayAPI';
        return api;
    },
    'FlightAPI': () => {
        console.log('Inside Flight APIList');
        api = 'https://limitless-beyond-94753.herokuapp.com/RailwayAPI';
        return api;
    }    
};

var FBcardTemplate = function() {
    var title = null;
    var image_url = null;
    var subtitle = null;
};

var SlackcardTemplate = function() {
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

module.exports.APIList = APIList;
module.exports.FBcardTemplate = FBcardTemplate;
module.exports.SlackcardTemplate = SlackcardTemplate;