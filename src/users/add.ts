'use strict';
import * as AWS from 'aws-sdk';
require("dotenv").config();

const region = process.env.REGION;
AWS.config.update({region});

module.exports.add = async (event: any = {}): Promise<any> => {
    const docClient = new AWS.DynamoDB.DocumentClient({region});
    const params = JSON.parse(event.body);
  
    try {
      const data = await docClient.put(params).promise();
  
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(
          {
            message: 'User has been successfully created.',
            input: params,
          }
        ),
      };
  
    } catch(error) {
  
      return {
        statusCode: error.statusCode,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: error.message,
          input: params,
        })
      }
  
    }
  };