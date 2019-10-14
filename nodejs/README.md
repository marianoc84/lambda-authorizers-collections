# How to use

Using your terminal open the `nodejs` directory then execute `npm run serve`.
This will create a file called `authorizer.zip` that you can use as [deployment package](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-create-deployment-pkg.html) for your Lambda.

You can test locally your Lambda executing an `npm install` followed by `npm test` (remember to paste a valid tokein in event.json)

# Prerequisites
* NodeJS installed with npm
* A Lambda function in which you can upload your authorizer.zip