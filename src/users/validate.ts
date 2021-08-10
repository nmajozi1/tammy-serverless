'use strict';
import * as AWS from 'aws-sdk';
import * as jwt from 'jsonwebtoken';

require("dotenv").config();

const settings = {
    region: process.env.REGION,
    secret: process.env.JWT_SECRET ? process.env.JWT_SECRET : '',
}

AWS.config.update({region: settings.region});

module.exports.validate = async (event: any = {}): Promise<any> => {
    const authorizationToken = event.authorizationToken;
    const authorizationArr = authorizationToken.split('');
    const token = authorizationArr[1];

    if (authorizationArr.length !== 2 || authorizationArr[0] !== 'Bearer' || authorizationArr[1].length === 0) {
        return generatePolicy('undefined', 'Deny', event.methodArn);
    }

    let decodeJwt = jwt.verify(token, settings.secret);
    if (typeof decodeJwt !== undefined) {
        console.log('DECODED JWT: ', decodeJwt);
        return generatePolicy('ntokozo', 'Allow', event.methodArn);
    }

    return generatePolicy('undefined', 'Deny', event.methodArn);
};

// Help function to generate an IAM policy
const generatePolicy = (principalId: string, effect: string, resource: string) => {
    let authResponse: any = {};
    
    authResponse.principalId = principalId;
    if (effect && resource) {
        let policyDocument: any = {};
        policyDocument.Version = '2012-10-17'; 
        policyDocument.Statement = [];
        let statementOne: any = {};
        statementOne.Action = 'execute-api:Invoke'; 
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }

    return authResponse;
}