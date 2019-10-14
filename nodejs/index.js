let jwt = require('jsonwebtoken');
let jwkToPem = require('jwk-to-pem');
let axios = require('axios');

exports.handler = async function(event) {
  try {
    let encodedToken = getEncodedToken(event.authorizationToken)
    let token = jwt.decode(encodedToken, {complete: true});
    let jwk = await getJwkByKid(token.payload.iss, token.header.kid);
    let pem = jwkToPem(jwk);
    jwt.verify(encodedToken, pem);
      
      return allowPolicy(event.methodArn);
    } catch (error) {
        console.error(error.message);
        return denyAllPolicy();
    }
}

function getEncodedToken(header) {
    let token = header.split(" ")[1];
    return token;
}

async function getJwkByKid(iss, kid) {
  let jwksendpoint = iss + "/.well-known/jwks.json";
  let json = await axios(jwksendpoint);

  for (let index = 0; index < json.data.keys.length; index++) {
    let key = json.data.keys[index];

    if(key.kid === kid)
      return key;
  }
}

function denyAllPolicy(){
    return {
        "principalId": "*",
        "policyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Action": "*",
                    "Effect": "Deny",
                    "Resource": "*"
                }
            ]
        }
    }
}

function allowPolicy(methodArn){
    return {
        "principalId": "apigateway.amazonaws.com",
        "policyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Action": "execute-api:Invoke",
                    "Effect": "Allow",
                    "Resource": methodArn
                }
            ]
        }
    }
}