const APIKEY = 'sl5zmz3g1w';
const api = '';

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
    'TrainIntent.CancelIntent': (date) => {
        console.log('Inside APIList');
        api = 'https://api.railwayapi.com/v2/cancelled/date/'+ date +'/apikey/' + APIKEY ; //Date Format: <dd-mm-yyyy>
        return api;
    }    
};

module.exports.APIList = APIList;