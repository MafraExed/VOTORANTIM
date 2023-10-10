"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['./numberFormat', 'com/innova/sitrack/utils/isEmpty', 'com/innova/vendor/moment', 'sap/base/strings/formatMessage', 'sap/ui/core/format/NumberFormat', 'sap/ui/core/MessageType'], function (numberFormat, isEmpty, moment, _formatMessage, NumberFormat, MessageType) {
  var oNumberFormat = null;
  var formatter = {
    /**
     * @function
     * @name maxLength
     * @description - Convierte un String a entero, para campos de mÃ¡xima longitud.
     *
     * @public
     * @param {string} sIntlen - Entero a convertir
     * @returns {integer} - Entero formateado.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    maxLength: function maxLength(sIntlen) {
      var intLen = sIntlen;
      var bNotnumber = Number.isNaN(sIntlen);

      if (bNotnumber) {
        intLen = 0;
      }

      return parseInt(intLen, 10);
    },

    /**
     * @function
     * @name hasSearchHelp
     * @description - Validar si el campo tiene ayuda de busqueda
     *
     * @public
     * @param {string} sF4availabl - Campo ayuda de busqueda
     * @returns {boolean}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    hasSearchHelp: function hasSearchHelp(sF4availabl) {
      return sF4availabl === 'X';
    },

    /**
     * @function
     * @name formatDateSAP
     * @description - Formatea la fecha que envia SAP
     *
     * @public
     * @param {string} value - Fecha
     * @param {string} format - Formato
     * @returns {string} - Formateado
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    formatDateSAP: function formatDateSAP(value, format) {
      return moment(value).format(format);
    },

    /**
     * @function
     * @name formatGlobalDate
     * @description - Formatea la fecha que se muestra al front
     *
     * @public
     * @param {string} value - Fecha
     * @returns {string} - Formateado
     *
     * @author Edwin Valencia <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    formatGlobalDate: function formatGlobalDate(value) {
      if (value === '0000-00-00') {
        return null;
      }

      if (!isEmpty(value)) {
        return moment(value === null || value === void 0 ? void 0 : value.split('T')[0]).format('DD/MM/yyyy');
      }

      return value;
    },

    /**
     * @function
     * @name floatNumberFormat
     * @description - Convierte un String a un numero float con formato especifico.
     *
     * @public
     * @param {string} amount - Cadena a formatear
     * @returns {string} - Cadena formateada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    floatNumberFormat: function floatNumberFormat(amount) {
      return !amount || amount.length === 0 ? amount : formatter.getNumberFormat().format(amount);
    },

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
    getNumberFormat: function getNumberFormat(sepmil, sepdec) {
      if (!oNumberFormat) {
        oNumberFormat = NumberFormat.getFloatInstance({
          showMeasure: false,
          useSymbol: true,
          minFractionDigits: 1,
          decimals: 2,
          groupingSeparator: sepmil,
          decimalSeparator: sepdec
        });
      }

      return oNumberFormat;
    },

    /**
     * @function
     * @name floatWholeNumber
     * @description - Convierte un String a un numero float con decimales y enteros pasados.
     *
     * @public
     * @param {string} decimals - Cantidad de decimales
     * @param {string} intlen - Cantidad de enteros
     * @param {string} amount - Cadena a formatear
     * @returns {string} - Cadena formateada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    floatWholeNumber: function floatWholeNumber(decimals, intlen, amount) {
      return isEmpty(amount) ? amount : numberFormat.getWholeNumberFormat({
        decimals: 0,
        maxIntegerDigits: parseInt(intlen, 10)
      }).format(amount);
    },

    /**
     * @function
     * @name floatNumber
     * @description - Convierte un String a un numero float con decimales y enteros pasados.
     *
     * @public
     * @param {string} decimals - Cantidad de decimales
     * @param {string} intlen - Cantidad de enteros
     * @param {string} amount - Cadena a formatear
     * @returns {string} - Cadena formateada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    floatNumber: function floatNumber(decimals, intlen, amount) {
      return isEmpty(amount) ? amount : numberFormat.getFloatFormat({
        decimals: parseInt(decimals, 10),
        maxIntegerDigits: parseInt(intlen, 10)
      }).format(amount);
    },

    /**
     * @function
     * @name formatMessage
     * @description - Formatea un string con formatMessage.
     *
     * @public
     * @param {object} sPatternString - Cadena con el pattern
     * @param {object} oArgs - Argumentos de la funciÃ³n
     * @returns {string} - String formateado.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    formatMessage: function formatMessage(sPatternString) {
      for (var _len = arguments.length, oArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        oArgs[_key - 1] = arguments[_key];
      }

      return _formatMessage(sPatternString, oArgs);
    },

    /**
     * @function
     * @name formatMessageItemType
     * @description - Obtiene el tipo para el MessageItem segÃºn el dato enviado por el backend.
     *
     * @public
     * @param {string} sType - Tipo de mensaje en el backend.
     * @returns {sap.ui.core.MessageType} - Tipo del MessageType.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    formatMessageItemType: function formatMessageItemType(sType) {
      var msType = '';

      switch (sType) {
        case 'E':
          msType = MessageType.Error;
          break;

        case 'W':
          msType = MessageType.Warning;
          break;

        case 'I':
          msType = MessageType.Information;
          break;

        case 'S':
          msType = MessageType.Success;
          break;

        default:
          msType = MessageType.None;
      }

      return msType;
    },

    /**
     * @function
     * @name formatIntTypeP
     * @description - Formatea los campos de tipo P
     *
     * @public
     * @param {string} value - Valor
     * @returns {string}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    formatIntTypeP: function formatIntTypeP(value) {
      return formatter.floatNumber(value);
    },

    /**
     * @function
     * @name formatIntTypeD
     * @description - Formatea los campos de tipo D
     *
     * @public
     * @param {string} value - Valor
     * @param {string} formatDate - Formato de fecha
     * @returns {string}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    formatIntTypeD: function formatIntTypeD(value, formatDate) {
      return value !== '0000-00-00' ? formatter.formatDateSAP(value, formatDate) : '';
    },

    /**
     * @function
     * @name formatValue
     * @description - Formatear valores
     *
     * @public
     * @param {string} value - Valor
     * @param {string} intType - Tipo de campo
     * @param {string} formatDate - Formato de fecha
     * @returns {string}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    formatValue: function formatValue(value, intType, formatDate) {
      var strategy = formatter["formatIntType".concat(intType)];

      if (strategy) {
        return strategy(value, formatDate);
      }

      return value;
    },

    /**
     * @function
     * @name formatCerosCode
     * @description - Quita los ceros a la izquierda de algun codigo
     *
     * @public
     * @param {string} value - Valor
     * @returns {Number}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    formatCerosCode: function formatCerosCode(value) {
      return parseInt(value, 10);
    }
  };
  return formatter;
});