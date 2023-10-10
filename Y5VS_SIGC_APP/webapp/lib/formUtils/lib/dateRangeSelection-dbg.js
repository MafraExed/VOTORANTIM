"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/vendor/moment'], function (moment) {
  return {
    /**
     * @function
     * @name getDateRangeSelectionData
     * @description - Obtiene los datos de un control DateRangeSelectionData.
     *
     * @public
     * @param {object} context - Objeto contexto
     * @param {boolean} context.isVariant - Es variante
     * @param {sap.m.DateRangeSelection} context.field - Control VBox
     * @param {string} context.functionName - Nombre de la funciÃ³n para el backend
     * @param {string} context.group - Grupo al que pertenece el campo
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    getDateRangeSelectionData: function getDateRangeSelectionData(_ref) {
      var field = _ref.field;
      var value =
      /** @type {Date} */
      field.getDateValue();
      var oItem;

      if (value) {
        var afterValue =
        /** @type {Date} */
        field.getSecondDateValue();
        oItem = "".concat(value.toISOString(), "_").concat(afterValue.toISOString());
        /*  oItem = buildItem({ isVariant, field, functionName, group, value }) */
      }

      return _objectSpread({}, oItem && _defineProperty({}, field.getName(), oItem));
    },

    /**
     * @function
     * @name setDateRangeSelectionData
     * @description - Obtener datos del control DateRangeSelection
     *
     * @private
     * @param {object} context
     * @param {object} context.data - Datos
     * @param {sap.m.DateRangeSelection} context.field - Campo
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    setDateRangeSelectionData: function setDateRangeSelectionData(_ref3) {
      var data = _ref3.data,
          field = _ref3.field;
      field.setDateValue(new Date(moment(data.LOW))).setSecondDateValue(new Date(moment(data.HIGH)));
    },

    /**
     * @function
     * @name cleanDateRangeSelection
     * @description - Limpiar control
     *
     * @private
     * @param {object} context
     * @param {sap.m.DateRangeSelection} context.field - Campo
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    cleanDateRangeSelection: function cleanDateRangeSelection(_ref4) {
      var field = _ref4.field;
      field.setValue(undefined);
    },

    /**
     * @function
     * @name isDateRangeSelectionValid
     * @description - Is valid
     *
     * @private
     * @param {object} context
     * @param {sap.m.DateRangeSelection} context.field - Field
     * @returns {boolean}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    isDateRangeSelectionValid: function isDateRangeSelectionValid(_ref5) {
      var field = _ref5.field;
      return !!field.getDateValue() && !!field.getSecondDateValue();
    }
  };
});