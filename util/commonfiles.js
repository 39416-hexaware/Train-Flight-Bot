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

var cardTemplate = function() {
    var title = null;
    var image_url = null;
    var subtitle = null;
};

module.exports.APIList = APIList;
module.exports.cardTemplate = cardTemplate;