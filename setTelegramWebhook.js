console.log('Loading event');
var https = require('https');
var querystring = require('querystring');
var botAPIKey = '9999999:KEYKEYCHANGEMEKEYKEY';

exports.handler = function(event, context) {

    // Log the basics, just in case
    console.log("Request received:\n", JSON.stringify(event));
    console.log("Context received:\n", JSON.stringify(context));

    // What we want the final URL to look like:
    // https://api.telegram.org/bot9999999:KEYKEYTHEKEYKEYKEYTHEKEY/setwebhook

    // All we need is to send the URL along to Telegram
    var post_data = querystring.stringify({
  	   'url': event.url
    });

    // Build the post options
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

    // Create the post request
    var body = '';
    var post_req = https.request(post_options, function(res) {
        res.setEncoding('utf8');

        // Save the returning data
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
            body += chunk;
        });

        // Are we done yet?
        res.on('end', function() {
            console.log('Successfully processed HTTPS response');
            // If we know it's JSON, parse it
            if (res.headers['content-type'] === 'application/json') {
                body = JSON.parse(body);
            }
            // This tells Lambda that this script is done
            context.succeed(body);
        });

    });

    // Post the data
    post_req.write(post_data);
    post_req.end();
};
