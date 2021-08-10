export interface ILoginParams {
    TableName: string;
    Key: IKey;
}

export interface ILoginResponse {
    statusCode: number;
    headers: IHeaders;
    body: string;
}

interface IHeaders {
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Credentials': Boolean;
    Bearer?: string;
}

interface IKey {
    username: string;
}

export interface IItemData {
    Item: IItem
}

interface IItem {
    password?: string;
    surname: string;
    role: string;
    username: string;
    email: string;
    name: string;
}