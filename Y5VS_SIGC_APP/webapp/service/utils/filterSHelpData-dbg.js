"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name filterSHelpData
     * @description - Filtrar datos de la ayuda de busqueda
     *
     * @private
     * @param {string} value - Valor a convertir
     * @returns {object|string}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    function (_ref) {
      var catalog = _ref.catalog,
          data = _ref.data,
          filter = _ref.filter,
          query = _ref.query;
      var newData = data;

      if (filter) {
        var regExp = filter === '*' ? new RegExp(filter.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), 'i') : new RegExp(filter, 'ig');
        var keys = catalog.reduce(function (acc, el) {
          return _objectSpread(_defineProperty({}, el.FIELDNAME, el.FIELDNAME), acc);
        }, {});
        var fieldname = query;
        newData = data.filter(function (i) {
          return Object.keys(keys).some(function (key) {
            return regExp.test(i["".concat(key)]);
          });
        }).map(function (i) {
          return Object.keys(keys).reduce(function (acc, key, idx) {
            return fieldname === key ? _objectSpread(_objectSpread({}, acc), {}, {
              key: i["".concat(key)]
            }) : _objectSpread(_objectSpread({}, acc), {}, _defineProperty({}, "text".concat(idx), i["".concat(key)]));
          }, {});
        });
      }

      return newData;
    }
  );
});