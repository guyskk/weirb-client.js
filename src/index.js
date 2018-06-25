var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import axios from 'axios';
import * as lodash from 'lodash';
var Service = (function () {
    function Service(name, client) {
        this.name = name;
        this.client = client;
    }
    Service.prototype.call = function (name, params, is_http_request, is_http_response) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.client.request(this.name, name, params, is_http_request, is_http_response)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    return Service;
}());
var HrpcError = (function (_super) {
    __extends(HrpcError, _super);
    function HrpcError(code, message, data, headers) {
        if (data === void 0) { data = null; }
        if (headers === void 0) { headers = null; }
        var _this = _super.call(this, message) || this;
        _this.code = code;
        _this.message = message;
        _this.data = data;
        _this.headers = headers;
        return _this;
    }
    return HrpcError;
}(Error));
var AxiosClient = (function () {
    function AxiosClient(baseURL) {
        this.axios = axios.create({
            baseURL: baseURL
        });
    }
    AxiosClient.prototype.makeHeaders = function () {
        var ret = {};
        this.headers.forEach(function (k, v) {
            ret["Hrpc-" + k] = v;
        });
        return ret;
    };
    AxiosClient.prototype.extractHeaders = function (headers) {
        var ret = new Map();
        lodash.forOwn(headers, function (k, v) {
            k = lodash.toLower(k);
            if (lodash.startsWith('hrpc-', k)) {
                ret.set(k.substr(5, k.length - 5), v);
            }
        });
        return ret;
    };
    AxiosClient.prototype.request = function (service, method, params, is_http_request, is_http_response) {
        return __awaiter(this, void 0, void 0, function () {
            var request, data, response, headers, code;
            return __generator(this, function (_a) {
                request = params;
                if (!is_http_request) {
                    data = undefined;
                    if (params !== null && params !== undefined) {
                        data = JSON.stringify(params);
                    }
                    request = {
                        url: service + "/" + method,
                        method: 'POST',
                        headers: this.makeHeaders(),
                        data: data
                    };
                }
                response = this.axios.request(request);
                if (is_http_response) {
                    return [2, response];
                }
                if (response.status < 200 || response.status > 299) {
                    throw new HrpcError('Hrpc.HttpError', response.status + ": " + response.statusText, response);
                }
                headers = this.extractHeaders(response.headers);
                if (headers.has('error')) {
                    code = headers.get('error');
                    headers["delete"]('error');
                    throw new HrpcError(code, response.data.message, response.data.data, headers);
                }
                return [2, [response.data, headers]];
            });
        });
    };
    return AxiosClient;
}());
export { Service, AxiosClient };
//# sourceMappingURL=index.js.map