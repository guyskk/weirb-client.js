import "babel-polyfill";
import axios from 'axios';
import * as lodash from 'lodash-es';


class HrpcError extends Error {

    constructor(httpError) {
        super(httpError.message);
        this.origin = httpError;
        this.request = httpError.request;
        this.response = httpError.response;
        this.config = httpError.config;
        let code = null;
        let message = null;
        let data = null;
        if (!lodash.isNil(this.response)) {
            code = this._extractErrorCode(this.response.headers);
            if (lodash.isNil(code)) {
                code = 'Hrpc.HttpError';
            } else {
                message = this.response.data.message;
                data = this.response.data.data;
            }
        }
        if (lodash.isNil(message)) {
            message = httpError.message;
        }
        message = lodash.trim(lodash.toString(message));
        this.code = code;
        this.message = message;
        this.data = data;
    }

    _extractErrorCode(headers) {
        for (let [k, v] of lodash.toPairs(headers)) {
            if (lodash.toLower(k) === 'hrpc-error') {
                return v;
            }
        }
        return null;
    }

}

class PreparedRequest {

    constructor(client, config) {
        this.client = client;
        this.config = config;
    }

    async result() {
        let res = null;
        try {
            res = await this.response();
        } catch (httpError) {
            throw new HrpcError(httpError);
        }
        console.log(res);
        return res.data;
    }

    async response() {
        return await this.client.axios.request(this.config);
    }

}

class AxiosClient {

    constructor(baseURL, config = null) {
        if (lodash.isNil(config)) {
            config = {};
        }
        if (lodash.isNil(config.baseURL)) {
            config.baseURL = baseURL;
        }
        if (lodash.isNil(config.timeout)) {
            config.timeout = 10000;
        }
        if (lodash.isNil(config.withCredentials)) {
            config.withCredentials = true;
        }
        this.axios = axios.create(config);
    }

    call(endpoint, params, config = null) {
        if (lodash.isNil(config)) {
            config = {};
        }
        let [service, method] = lodash.split(endpoint, '.', 2);
        config.url = `${service}/${method}`;
        config.method = 'POST';
        if (params !== null && params !== undefined) {
            config.data = JSON.stringify(params);
        }
        if (lodash.isNil(config.headers)) {
            config.headers = {};
        }
        config.headers['Content-Type'] = 'application/json;charset=utf-8';
        return this.request(config);
    }

    request(config) {
        return new PreparedRequest(this, config);
    }

}

export {
    HrpcError,
    AxiosClient
};