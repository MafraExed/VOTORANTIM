"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['./convertStringToJson'], function (convertStringToJson) {
  return (
    /**
     * @function
     * @name buildRes
     * @description - Contruir respuesta del servicio FIORI
     *
     * @private
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    function (res) {
      return res.filter(function (_ref) {
        var Name = _ref.Name;
        return Name !== 'IV_FUNCNAME';
      }).reduce(function (acc, _ref2) {
        var Name = _ref2.Name,
            Value = _ref2.Value;
        return _objectSpread(_objectSpread({}, acc), {}, _defineProperty({}, "".concat(Name), convertStringToJson(Value)));
      }, {});
    }
  );
});