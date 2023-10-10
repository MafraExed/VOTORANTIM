"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['./isEmpty'], function (isEmpty) {
  return (
    /**
     * @function
     * @name hasAllPropsEmpty
     * @description - Valida si tiene todas sus propiedades vacÃ­as
     *
     * @private
     * @param {object} obj - Objeto a validar
     * @returns {boolean}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    function () {
      var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return Object.values(obj).every(isEmpty);
    }
  );
});