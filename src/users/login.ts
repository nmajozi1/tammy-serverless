'use strict';
import * as AWS from 'aws-sdk';
import * as jwt from 'jsonwebtoken';
import { ILoginParams, ILoginResponse } from './interfaces/login.interface';

require("dotenv").config();

const settings = {
  region: process.env.REGION,
  TableName: process.env.DYNAMO_DB_USERS_TABLE ? process.env.DYNAMO_DB_USERS_TABLE : '',
  secret: process.env.JWT_SECRET ? process.env.JWT_SECRET : '',
}

AWS.config.update({region: settings.region});

module.exports.login = async (event: any = {}): Promise<ILoginResponse> => {
  const docClient = new AWS.DynamoDB.DocumentClient({region: settings.region});

  const inputJson = JSON.parse(event.body);

  const params: ILoginParams = {
    TableName: settings.TableName,
    Key: {
      username: inputJson.username
    }
  }

  try {

    const data: any = await docClient.get(params).promise();

    if(data.Item && data.Item.password === inputJson.password) {

      delete data.Item['password'];

      const token = jwt.sign(data.Item, settings.secret);

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Bearer': token
        },
        body: JSON.stringify(
          {
            success: true,
            message: `successfully logged in user ${data.Item.surname}`,
          }
        ),
      };
    } else {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          success: false,
          message: 'Incorrect password.',
        })
      }
    }
  } catch(error) {
    if (error.message === "Cannot read property 'password' of undefined") {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          success: false,
          message: 'Incorrect username',
        })
      }
    } else {
      return {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        statusCode: error.statusCode,
        body: JSON.stringify({
          success: false,
          message: error.message,
        })
      }
    }
  }
};