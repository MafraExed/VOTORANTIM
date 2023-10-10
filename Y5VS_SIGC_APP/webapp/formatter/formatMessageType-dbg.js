"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['sap/ui/core/MessageType'], function (MessageType) {
  return (
    /**
     * @function
     * @name formatMessageType
     * @description - Format a message type.
     *
     * @public
     * @param {string} sType - Message type
     * @returns {sap.ui.core.MessageType} - Message type
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    function (sType) {
      var _types$sType;

      var types = {
        S: MessageType.Success,
        E: MessageType.Error,
        W: MessageType.Warning,
        I: MessageType.Information
      };
      return (_types$sType = types[sType]) !== null && _types$sType !== void 0 ? _types$sType : MessageType.None;
    }
  );
});