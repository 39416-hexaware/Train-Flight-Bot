var request = require('request');

const header = {
    'Cache-Control': 'no-cache',
    Accept: 'application/json',
    'Content-Type': 'application/json'
};

var DataProcess = {
    'LaunchRequest': () => {

        var options = {
            url: 'https://limitless-beyond-94753.herokuapp.com/RailwayAPI', //,urlPath, //'https://api.railwayapi.com/v2/pnr-status/pnr/4338716830/apikey/sl5zmz3g1w'
            method: 'POST',
            header: header,
            body: '',
            json: true
        };

        request(options, function (error, response, body) {
            if (error) {
                console.dir(error);
                return
            }
            console.log('headers:' + response.headers);
            console.log('status code:' + response.statusCode);
            console.log(body);

            console.log('Inside data process');
        });
    }
};



module.exports.DataProcess = DataProcess;