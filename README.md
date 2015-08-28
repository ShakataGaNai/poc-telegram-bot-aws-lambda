# poc-telegram-bot-aws-lambda
A Proof of Concept Telegram Boy running on AWS Lambda

* What to test it? Message [AWSLambdaBot](http://telegram.me/AWSLambdaBot)
* Want the long setup instructions? With pictures? See the [Snowulf blog](https://snowulf.com/2015/08/28/tutorial-poc-telegram-bot-running-in-aws-lambda/)

## Setup - The short version
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
* `curl -H "Content-Type: application/json" -X POST -d "{\"url\":\"https://YOURURL.execute-api.us-west-2.amazonaws.com/main/telegram\"}" https://YOURURL.execute-api.us-west-2.amazonaws.com/main/setwebhook/`
 * You should see a response of `{"ok":true,"result":true,"description":"Webhook was set"}`
* Message your bot!
* It should respond and you should be able to see the log entry in your DynamoDB table.

## FAQ
* Q. Aren't there lots of NPM modules for Telegram bots? Why didn't you use one?
* A. Because I wanted to understand everything that was happening for this proof of concept.


* Q. Is this the "best" way to make a Telelgram/Lambda bot?
* A. I really hope not, again, just a POC to show that it can easily be done.


* Q. How do I make my bot stateful in Lambda?
* A. Lambda is inherently stateless, so you'll need to store state info in a database.


* Q. How many users will this support?
* A. It's the cloud my friends, Lambda should theoretically be able to support an unlimited number of simultaneous hits. Your limiting factor would be Dynamo read/write (in this example).


* Q. Do you need to use Lambda to set the webhook?
* A. No, you don't. You could just curl it directly (in fact, that'd probably be easier), however I did it because I wanted to have an "All in Lambda" bot. If I made a real bot, I'd want to be able to set it's own webhooks.


* Q. How do I send messages at times other than when the user messages the bot?
* A. I presume you want to be able to do things like set timers or notifications? Well, with this code you can't. If you had a Lambda function that was triggered by a webcron or some other webhook, it could send messages as the bot. Once a user has messaged the bot for the first time, all you need is their user id to send them messages later.


* Q. How does this bot handle /slash commands?
* A. It doesn't. It's the bot equivalent of "Hello <username>".


* Q. Where can I learn more about Telegram bots?
* A. See the [Telegram Bot API docs](https://core.telegram.org/bots)
