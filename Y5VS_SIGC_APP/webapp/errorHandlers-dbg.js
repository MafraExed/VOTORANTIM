"use strict";

/*!
 *  SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['sap/base/Log', 'sap/m/MessageBox', './service/petitions', './utils/showToast'], function (Log, MessageBox, petitions, showToast) {
  var showMessageBox = function showMessageBox(_ref) {
    var message = _ref.message,
        responseText = _ref.responseText,
        statusCode = _ref.statusCode,
        statusText = _ref.statusText;
    MessageBox.show(message, {
      icon: MessageBox.Icon.ERROR,
      title: "".concat(statusCode, " | ").concat(statusText),
      actions: [MessageBox.Action.CLOSE],
      details: "".concat(responseText),
      styleClass: 'sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer',
      contentWidth: '100px'
    });
  };

  var ERROR_HANDLERS = {
    500: showMessageBox,
    400: function _(_ref2, controller) {
      var _controller$getResour;

      var _ref2$data = _ref2.data,
          data = _ref2$data === void 0 ? {
        description: {}
      } : _ref2$data;
      var description = data.description;
      var code = description.code,
          message = description.message;
      var text = (_controller$getResour = controller.getResourceBundle().getText(code)) !== null && _controller$getResour !== void 0 ? _controller$getResour : message;
      showToast(text);
    },
    401: function _(_2, controller) {
      return controller.getOwnerComponent().refreshToken();
    },
    403: showMessageBox,
    404: function _(_ref3) {
      var statusText = _ref3.statusText,
          message = _ref3.message;
      return showToast("".concat(statusText, ": ").concat(message));
    },
    409: function _(_ref4, controller) {
      var _controller$getResour2;

      var _ref4$data = _ref4.data,
          data = _ref4$data === void 0 ? {
        description: {}
      } : _ref4$data;
      var description = data.description;
      var code = description.code,
          message = description.message;
      var text = (_controller$getResour2 = controller.getResourceBundle().getText(code)) !== null && _controller$getResour2 !== void 0 ? _controller$getResour2 : message;
      showToast(text);
    },
    defaultError: function defaultError(error, controller) {
      // Something happened in setting up the request that triggered an Error
      showToast(error.message || error.toString(), {
        duration: 3000,
        width: 'auto',
        closeOnBrowserNavigation: false
      });
      Log.error(error.toString(), error.stack, controller.getView().getControllerName());
    }
  };

  var axiosError = function axiosError(error, controller) {
    if (error.response) {
      var _error$response = error.response,
          status = _error$response.status,
          data = _error$response.data,
          statusText = _error$response.statusText; // The request was made and the server responded with a status code
      // that falls out of the range of 2xx

      Log.error(error, status, statusText);
      var handler = ERROR_HANDLERS["".concat(status)] || ERROR_HANDLERS.defaultError;
      handler(data ? {
        message: data.message || statusText,
        responseText: JSON.stringify(data),
        statusCode: status,
        statusText: statusText,
        data: data
      } : error, controller);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js (error.request)
      showToast("".concat(error.name, ": ").concat(error.message));
      Log.error(error.name, error.message);
    }
  };

  return function (error, controller) {
    if (error.isAxiosError) {
      axiosError(error, controller);
    } else if (petitions.isCancel(error)) {
      Log.info(error.name, error.message);
    } else {
      ERROR_HANDLERS.defaultError(error, controller);
    }
  };
});