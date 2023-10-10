"use strict";

/*!
 *  SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['sap/base/Log', 'sap/m/MessageBox', 'sap/m/MessageToast'], function (Log, MessageBox, MessageToast) {
  var ERROR_HANDLERS = {
    401: function _(_2, controller) {
      return controller.getOwnerComponent().refreshToken();
    },
    500: function _(_ref) {
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
    },
    defaultError: function defaultError(error) {
      // Something happened in setting up the request that triggered an Error
      MessageToast.show(error.message || error.toString(), {
        duration: 3000,
        width: 'auto',
        closeOnBrowserNavigation: false
      });
      Log.error(error.toString(), error.stack);
    }
  };
  return function (error) {
    var handler = ERROR_HANDLERS["".concat(error.statusCode)] || ERROR_HANDLERS.defaultError;
    handler(error);
  };
});