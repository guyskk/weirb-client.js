import axios from 'axios'
import * as lodash from 'lodash-es'

class ServiceError extends Error {
    constructor(httpError) {
        super(httpError.message)
        this.request = httpError.request
        this.response = httpError.response
        this.config = httpError.config
        let code = null
        let message = null
        let data = null
        if (!lodash.isNil(this.response)) {
            code = this.response.headers['service-error']
            if (!lodash.isNil(code)) {
                message = this.response.data.message
                data = this.response.data.data
            }
        }
        if (lodash.isNil(message)) {
            message = httpError.message
        }
        message = lodash.trim(lodash.toString(message))
        this.code = code
        this.message = message
        this.data = data
    }
}

class WeirbClient {
    constructor(baseURLOrConfig, config = undefined) {
        if (lodash.isNil(config)) {
            config = {}
        }
        if (lodash.isString(baseURLOrConfig)) {
            config.baseURL = baseURLOrConfig
        } else if (!lodash.isNil(baseURLOrConfig)) {
            lodash.assign(config, baseURLOrConfig)
        }
        this.axios = axios.create(config)
        this.axios.interceptors.response.use(undefined, this._onError)
        lodash.assign(this, this.axios)
    }

    _onError(error) {
        return Promise.reject(new ServiceError(error))
    }

    async call(url, params = undefined, config = undefined) {
        if (lodash.isNil(config)) {
            config = {}
        }
        config.url = url
        config.method = 'POST'
        if (lodash.isNil(params)) {
            params = {}
        }
        config.data = JSON.stringify(params)
        if (lodash.isNil(config.headers)) {
            config.headers = {}
        }
        config.headers['Content-Type'] = 'application/json;charset=utf-8'
        let response = await this.request(config)
        return response.data
    }
}

function create(baseURLOrConfig, config = undefined) {
    return new WeirbClient(baseURLOrConfig, config)
}

export { ServiceError, WeirbClient, create }
