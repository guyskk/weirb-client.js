import axios from 'axios';
import * as lodash from 'lodash';
import { loadavg } from 'os';


interface Client {
    request(service: string, method: string, params: object,
        is_http_request: boolean, is_http_response: boolean): Promise<[any, any]>;
}

class Service {

    name: string;
    client: Client;

    constructor(name: string, client: Client) {
        this.name = name;
        this.client = client;
    }

    public async call(this: Service, name: string, params: any,
        is_http_request: boolean, is_http_response: boolean): Promise<[any, any]> {
        return await this.client.request(this.name, name, params, is_http_request, is_http_response);
    }
}

class HrpcError extends Error {

    code: string;
    message: string;
    data: any;
    headers: Map<string, any>

    constructor(code: string, message: string,
        data: any = null, headers: Map<string, any> = null) {
        super(message);
        this.code = code;
        this.message = message;
        this.data = data;
        this.headers = headers;
    }
}

class AxiosClient implements Client {

    headers: Map<string, string>;
    axios: axios.Instance;

    constructor(baseURL: string) {
        this.axios = axios.create({
            baseURL: baseURL
        });
    }

    private makeHeaders(this: AxiosClient) {
        let ret: any = {};
        this.headers.forEach((k, v) => {
            ret[`Hrpc-${k}`] = v;
        });
        return ret;
    }

    private extractHeaders(this: AxiosClient, headers: any) {
        let ret: Map<string, string> = new Map();
        lodash.forOwn(headers, (k, v) => {
            k = lodash.toLower(k) as string;
            if (lodash.startsWith('hrpc-', k)) {
                ret.set(k.substr(5, k.length - 5), v);
            }
        });
        return ret;
    }

    async request(this: AxiosClient, service: string, method: string, params: object,
        is_http_request: boolean, is_http_response: boolean): Promise<[any, any]> {
        let request = params;
        if (!is_http_request) {
            let data = undefined;
            if (params !== null && params !== undefined) {
                data = JSON.stringify(params);
            }
            request = {
                url: `${service}/${method}`,
                method: 'POST',
                headers: this.makeHeaders(),
                data: data,
            }
        }
        let response = this.axios.request(request);
        if (is_http_response) {
            return response;
        }
        if (response.status < 200 || response.status > 299) {
            throw new HrpcError(
                'Hrpc.HttpError',
                `${response.status}: ${response.statusText}`,
                response
            );
        }
        let headers = this.extractHeaders(response.headers);
        if (headers.has('error')) {
            let code = headers.get('error');
            headers.delete('error');
            throw new HrpcError(
                code,
                response.data.message,
                response.data.data,
                headers,
            )
        }
        return [response.data, headers]
    }
}

export { Client, Service, AxiosClient };
