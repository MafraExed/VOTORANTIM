"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sigc/model/process/processStatus/useProcessStatus'], function (useProcessStatus) {
  return (
    /**
     * @function
     * @name formatStatus
     * @description - Formatea el estado del proceso
     *
     * @public
     * @param {object} status - Estatus del proceso
     * @returns {string} - String formateado.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    function (_ref) {
      var _ref$status = _ref.status,
          status = _ref$status === void 0 ? '' : _ref$status,
          i18n = _ref.i18n;
      return status && status.split('').map(function (s) {
        var meta = useProcessStatus.getStatusMetadata(s);
        return _objectSpread(_objectSpread({}, meta), {}, {
          text: i18n.getText(meta.text)
        });
      });
    }
  );
});