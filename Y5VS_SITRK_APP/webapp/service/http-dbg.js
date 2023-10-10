"use strict";

sap.ui.define(['com/innova/vendor/axios'], function (axios) {
  var instance;
  var CancelToken = axios.CancelToken;
  var sources = [];
  return {
    getInstance: function getInstance() {
      return instance;
    },
    setInstance: function setInstance(_ref) {
      var baseURL = _ref.baseURL,
          token = _ref.token;
      instance = axios.create({
        baseURL: baseURL,
        headers: {
          Authorization: "".concat(token)
        }
      });
    },
    get: function get(route) {
      var source = CancelToken.source();
      sources.push(source);
      return instance.get(route, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        cancelToken: source.token
      });
    },
    find: function find(route, query, data) {
      var source = CancelToken.source();
      sources.push(source);
      return instance.post("".concat(route, "/").concat(query), data, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        cancelToken: source.token
      });
    },
    post: function post(route, data) {
      var source = CancelToken.source();
      sources.push(source);
      return instance.post(route, data, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        cancelToken: source.token
      });
    },
    update: function update(route, data) {
      var source = CancelToken.source();
      sources.push(source);
      return instance.put(route, data, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        cancelToken: source.token
      });
    },
    delete: function _delete(route, data) {
      var source = CancelToken.source();
      sources.push(source);
      return instance.delete(route, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        data: data,
        cancelToken: source.token
      });
    },
    downloadAttachment: function downloadAttachment(_ref2) {
      var url = _ref2.url;
      var source = CancelToken.source();
      sources.push(source);
      return instance.get(url, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        cancelToken: source.token
      });
    },

    /* 'Accept': 'application/msword' */
    spread: function spread(cb) {
      return instance.spread(cb);
    },
    login: function login(route, auth, data) {
      var source = CancelToken.source();
      sources.push(source);
      return instance.post(route, data, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        auth: auth,
        cancelToken: source.token
      });
    },
    abort: function abort(message) {
      return new Promise(function (resolve, reject) {
        try {
          sources.forEach(function (s) {
            s.cancel(message || 'Operation canceled by the user.');
          });
          sources.length = 0;
          resolve();
        } catch (error) {
          reject();
        }
      });
    },
    isCancel: function isCancel(error) {
      return instance.isCancel(error);
    }
  };
});