"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sitrack/model/item/FormItem', 'com/innova/sitrack/model/item/OptionType', 'com/innova/sitrack/model/variant/ItemVariant', 'com/innova/sitrack/utils/formatDate', 'com/innova/vendor/moment'], function (FormItem, OptionType, ItemVariant, formatDate, moment) {
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
   * @param {object} context.value - Valor
   * @returns {object}
   *
   * @author Edwin Valencia <evalencia@innovainternacional.biz>
   * @version 0.5.0
   */
  var buildItem = function buildItem(_ref) {
    var isVariant = _ref.isVariant,
        field = _ref.field,
        functionName = _ref.functionName,
        group = _ref.group,
        value = _ref.value;
    return isVariant ? new ItemVariant({
      fieldname: field.getName(),
      function: functionName,
      group: group,
      high: formatDate(field.getSecondDateValue() || value),
      low: formatDate(value),
      tabname: field.data('tabname')
    }) : new FormItem({
      fieldname: field.getName(),
      high: formatDate(field.getSecondDateValue() || value),
      low: formatDate(value),
      option: OptionType.BT,
      tabname: field.data('tabname')
    });
  };

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
     * @version 0.5.0
     */
    getDateRangeSelectionData: function getDateRangeSelectionData(_ref2) {
      var isVariant = _ref2.isVariant,
          field = _ref2.field,
          functionName = _ref2.functionName,
          group = _ref2.group;
      var value = field.getDateValue();
      var oItem;

      if (value) {
        oItem = buildItem({
          isVariant: isVariant,
          field: field,
          functionName: functionName,
          group: group,
          value: value
        });
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
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    setDateRangeSelectionData: function setDateRangeSelectionData(_ref4) {
      var data = _ref4.data,
          field = _ref4.field;
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
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    cleanDateRangeSelection: function cleanDateRangeSelection(_ref5) {
      var field = _ref5.field;
      field.setDateValue(undefined);
    }
  };
});