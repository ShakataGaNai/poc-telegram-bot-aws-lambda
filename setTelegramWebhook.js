console.log('Loading event');
var https = require('https');
var querystring = require('querystring');
var botAPIKey = '9999999:KEYKEYCHANGEMEKEYKEY';

exports.handler = function(event, context) {

    console.log("Request received:\n", JSON.stringify(event));
    console.log("Context received:\n", JSON.stringify(context));

    // What we want the final URL to look like:
    // https://api.telegram.org/bot9999999:KEYKEYTHEKEYKEYKEYTHEKEY/setwebhook

    var post_data = querystring.stringify({
  	   'url': event.url
    });

    var post_options = {
          hostname: 'api.telegram.org',
          port: 443,
          path: '/bot'+botAPIKey+'/setwebhook',
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': post_data.length
          }
    };

    var body = '';
    var post_req = https.request(post_options, function(res) {
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
            body += chunk;
        });

        res.on('end', function() {
            console.log('Successfully processed HTTPS response');
            // If we know it's JSON, parse it
            if (res.headers['content-type'] === 'application/json') {
                body = JSON.parse(body);
            }
            context.succeed(body);
        });

    });

    // post the data
    post_req.write(post_data);
    post_req.end();
};
