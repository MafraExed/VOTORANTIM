"use strict";

sap.ui.define(['sap/ui/core/MessageType'], function (MessageType) {
  return (
    /**
     * @function
     * @name messageItemTypeFormat
     * @description - Obtiene el tipo para el MessageItem segÃºn el tipo enviado por el backend.
     *
     * @public
     * @param {string} type - Tipo de mensaje en el backend.
     * @returns {sap.ui.core.MessageType} - Tipo del MessageType.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    function () {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var sType = {
        E: MessageType.Error,
        W: MessageType.Warning,
        I: MessageType.Success,
        S: MessageType.Success
      };
      return sType["".concat(type)] || MessageType.None;
    }
  );
});