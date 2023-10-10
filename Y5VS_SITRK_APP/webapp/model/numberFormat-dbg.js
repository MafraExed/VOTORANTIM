"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['sap/ui/core/format/NumberFormat'], function (NumberFormat) {
  var oNumberFormat = null;
  var oFormatOptions = null;
  var numberFormat = {
    /**
     * @function
     * @name getNumberFormat
     * @description - Obtener una instancia de NumberFormat
     *
     * @public
     * @param {string} sepmil - Separador de miles
     * @param {string} sepdec - Separador decimal
     * @returns {NumberFormat} - Cadena formateada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    getNumberFormat: function getNumberFormat(groupingSeparator, decimalSeparator) {
      if (!oNumberFormat) {
        oNumberFormat = NumberFormat.getFloatInstance({
          showMeasure: false,
          useSymbol: true,
          minFractionDigits: 1,
          decimals: 2,
          groupingSeparator: groupingSeparator,
          decimalSeparator: decimalSeparator
        });
      }

      return oNumberFormat;
    },

    /**
     * @function
     * @name getFormatOptions
     * @description - Obtiene un objeto con las opciones de formator de los nÃºmeros de SAP.
     *
     * @public
     * @returns {object} - Objeto de formato de opciones.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    getFormatOptions: function getFormatOptions() {
      if (!oFormatOptions) {
        oFormatOptions = {
          groupingSeparator: arguments.length <= 0 ? undefined : arguments[0],
          decimalSeparator: arguments.length <= 1 ? undefined : arguments[1]
        };
      }

      return oFormatOptions;
    },

    /**
     * @function
     * @name getFloatFormat
     * @description - Obtener una instancia Float
     *
     * @public
     * @param {object} context
     * @param {number} context.decimals - Cantidad de decimales
     * @param {number} context.maxIntegerDigits - Cantidad de decimales
     * @returns {NumberFormat} - Instancia
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    getFloatFormat: function getFloatFormat(_ref) {
      var _ref$decimals = _ref.decimals,
          decimals = _ref$decimals === void 0 ? 2 : _ref$decimals,
          maxIntegerDigits = _ref.maxIntegerDigits;

      var _numberFormat$getForm = numberFormat.getFormatOptions(),
          groupingSeparator = _numberFormat$getForm.groupingSeparator,
          decimalSeparator = _numberFormat$getForm.decimalSeparator;

      return NumberFormat.getFloatInstance({
        decimalSeparator: decimalSeparator,
        emptyString: null,
        groupingSeparator: groupingSeparator,
        maxFractionDigits: decimals,
        maxIntegerDigits: maxIntegerDigits,
        showMeasure: false,
        useSymbol: true
      });
    },

    /**
     * @function
     * @name quote
     * @description - Retorna el valor especifico que se desea reemplazar.
     *
     * @public
     * @param {string} sRegex - ExpresiÃ³n regular.
     * @returns {string} - string.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    quote: function quote(sRegex) {
      return sRegex.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    },

    /**
     * @function
     * @name getRegExtFloat
     * @description - Retorna la expresiÃ³n regular para vÃ¡lidar si un string formateado es un nÃºmero con formato vÃ¡lido.
     *
     * @public
     * @returns {string} - ExpresiÃ³n regular.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    getRegExtFloat: function getRegExtFloat() {
      var sGroupingSeparator = numberFormat.quote(oFormatOptions.groupingSeparator);
      var sDecimalSeparator = numberFormat.quote(oFormatOptions.decimalSeparator);
      return "^-?(?:\\d+|\\d{1,3}(?:[\\s".concat(sGroupingSeparator, "]\\d{3})+)(?:[").concat(sDecimalSeparator, "]\\d+)?$");
    }
  };
  return numberFormat;
});