"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * FormItem
 *
 * @namespace
 * @name com.innova.sigc.model.item
 * @public
 */
// Proporciona la implementaciÃ³n del modelo FormItem
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un nuevo FormItem.
     *
     * Modelo de un item de formulario que se envia a SAP
     *
     * @param {object} oData - Inf
     *
     * @class
     * @name - FormItem
     * @description - ImplementaciÃ³n del modelo de FormItem,
     *  que representa un item del Request para el backend.
     *
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     * @public
     * @alias com.innova.sigc.model.item.FormItem
     */
    Object.extend('com.innova.sigc.model.item.FormItem', {
      constructor: function constructor(_ref) {
        var tabname = _ref.tabname,
            fieldname = _ref.fieldname,
            _ref$sign = _ref.sign,
            sign = _ref$sign === void 0 ? 'I' : _ref$sign,
            _ref$option = _ref.option,
            option = _ref$option === void 0 ? 'EQ' : _ref$option,
            low = _ref.low,
            high = _ref.high;

        if (tabname) {
          this.TABNAME = tabname;
        }

        if (fieldname) {
          this.FIELDNAME = fieldname;
        }

        this.SIGN = sign;
        this.OPTION = option;
        this.LOW = low;
        this.HIGH = high;
      },

      /**
       * @function
       * @name setSign
       * @description - Establecer el atributo Sign.
       *
       * @public
       * @param {string} sSign - texto del atributo Sign.
       * @returns {void} Noting to return.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 1.0.0
       */
      setSign: function setSign(sSign) {
        this.SIGN = sSign;
      },

      /**
       * @function
       * @name setOption
       * @description - Establecer el atributo Option.
       *
       * @public
       * @param {string} sOption - texto del atributo Option.
       * @returns {void} Noting to return.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 1.0.0
       */
      setOption: function setOption(sOption) {
        this.OPTION = sOption;
      },

      /**
       * @function
       * @name setOption
       * @description - Establecer el atributo Low.
       *
       * @public
       * @param {string} sLow - texto del atributo Low.
       * @returns {void} Noting to return.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 1.0.0
       */
      setLow: function setLow(sLow) {
        this.LOW = sLow;
      },

      /**
       * @function
       * @name setHigh
       * @description - Establecer el atributo High.
       *
       * @public
       * @param {string} sHigh - texto del atributo High.
       * @returns {void} Noting to return.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 1.0.0
       */
      setHigh: function setHigh(sHigh) {
        this.HIGH = sHigh;
      }
    })
  );
});