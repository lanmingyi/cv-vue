/*** 
 * @Description: mock服务
 * @Author: lmy
 * @Date: 2021-06-02 13:38:06
 * @LastEditTime: 2021-09-09 15:50:58
 * @LastEditors: lmy
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\mock\index.js
 */
const Mock = require('mockjs');
const { param2Obj } = require('./utils');
const qs = require('qs');

const dashboard = require('./controller/dashboard');
const portal = require('./controller/portal');
const lottery = require('./controller/lottery');
const table = require('./controller/table');

const mocks = [...dashboard, ...lottery, ...table, ...portal];

function mockXHR() {
    Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send;

    Mock.XHR.prototype.send = function() {
        if (this.custom.xhr) {
            this.custom.xhr.withCredentials = this.withCredentials || false;

            if (this.responseType) {
                this.custom.xhr.responseType = this.responseType;
            }
        }
        this.proxy_send(...arguments);
    };

    function XHR2ExpressReqWrap(respond) {
        return function(options) {
            let result = null;
            if (respond instanceof Function) {
                const { body, type, url } = options;
                result = respond({
                    method: type,
                    body: qs.parse(body),
                    query: param2Obj(url)
                });
            } else {
                result = respond;
            }
            return Mock.mock(result);
        };
    }

    for (const i of mocks) {
        Mock.mock(new RegExp(i.url), i.type || 'get', XHR2ExpressReqWrap(i.response));
    }
}

module.exports = {
    mocks,
    mockXHR
};