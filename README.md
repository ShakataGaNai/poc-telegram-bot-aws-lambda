# poc-telegram-bot-aws-lambda
A Proof of Concept Telegram Boy running on AWS Lambda

## Setup
For the long version, see: https://snowulf.com/?p=6352

Short version:
* Register a Telegram Bot per https://core.telegram.org/bots#botfather
* Create two Lambda functions, one for each of the js files
 * Change the 'botAPIKey' to your new bots API key
 * Allocate 1024MB of memory per function, for faster running
* Create a DynamoDB table
 * Name: telegramlog
 * Key type: hash and range
 * Hash key: username
 * Range key: updateid
 * Provisioned read: 5
 * Provisioned write: 2
* Create two AWS API Gateway resources of /telegram (with post) and /setwebhook (with post)
 * the /setwebhook api should point to the Lambda function for setTelegramWebhook.js
 * the /telegram api should point to the Lambda function for telegramEcho.js
* curl -H "Content-Type: application/json" -X POST -d "{\"url\":\"https://YOURURL.execute-api.us-west-2.amazonaws.com/main/telegram\"}" https://YOURURL.execute-api.us-west-2.amazonaws.com/main/setwebhook/
 * You should see a response of {"ok":true,"result":true,"description":"Webhook was set"}
* Message your bot!
* It should respond and you should be able to see the log entry in your DynamoDB table.

## FAQ
Q. Aren't there lots of NPM modules for Telegram bots? Why didn't you use one?
A. Because I wanted to understand everything that was happening for this proof of concept.

Q. Is this the "best" way to make a Telelgram/Lambda bot?
A. I really hope not, again, just a POC to show that it can easily be done.

Q. How do I make my bot stateful in Lambda?
A. Lambda is inherently stateless, so you'll need to store state info in a database.

Q. How many users will this support?
A. It's the cloud my friends, Lambda should theoretically be able to support an unlimited number of simultaneous hits. Your limiting factor would be Dynamo read/write (in this example).

Q. Do you need to use Lambda to set the webhook?
A. No, you don't. You could just curl it directly (in fact, that'd probably be easier), however I did it because I wanted to have an "All in Lambda" bot. If I made a real bot, I'd want to be able to set it's own webhooks.
