"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name getNameRespTec
     * @description - Get name response technical.
     *
     * @public
     * @param {string} respTecId - Id of RespTec
     * @param {object[]} shelp - Shelp
     * @returns {string}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    function (respTecId, shelp) {
      if (respTecId) {
        var _shelp$find;

        var _ref = (_shelp$find = shelp.find(function (_ref2) {
          var id = _ref2.id;
          return id === respTecId;
        })) !== null && _shelp$find !== void 0 ? _shelp$find : {},
            firstname = _ref.firstname,
            lastname = _ref.lastname;

        return "".concat(firstname, " ").concat(lastname);
      }

      return '';
    }
  );
});