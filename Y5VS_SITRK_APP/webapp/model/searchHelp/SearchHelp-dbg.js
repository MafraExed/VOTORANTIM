"use strict";

/**
 * SearchHelp
 *
 * @namespace
 * @name com.innova.sitrack.model.searchHelp.SearchHelp
 * @public
 */
// Proporciona la implementaciÃ³n del modelo SearchHelp

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['../item/FormItem', '../item/OptionType', 'com/innova/vendor/lodash.get', 'sap/ui/base/Object'], function (FormItem, OptionType, get, Object) {
  return (
    /**
     * Constructor para el request de SearchHelp.
     *
     * Modelo de un request para la configuracion de SearchHelp.
     *
     * @param {object} oData - Objeto JS con los parametros de la clase.
     *
     * @class
     * @name - SearchHelp
     * @description - ImplementaciÃ³n del modelo de SearchHelp
     *  que representa el objeto del Request para configuracion de SearchHelp.
     *
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     *
     * @public
     * @alias com.innova.sitrack.model.searchHelp.SearchHelp
     */
    Object.extend('com.innova.sitrack.model.searchHelp.SearchHelp', {
      // constructor({ fieldname, ...args }) {
      constructor: function constructor(fieldname, oData) {
        this.IR_FCODE1 = get(oData, 'FCODE1', []);
        this.IR_FCODE2 = [];
        this.setFCODE2(get(oData, 'FCODE2', null));
        this.IR_FCODE3 = get(oData, 'FCODE3', []);
        this.IR_FCODE4 = get(oData, 'FCODE4', []);
        this.IR_FCODE5 = get(oData, 'FCODE5', []);
        this.IR_FDATE1 = get(oData, 'FDATE1', []);
        this.IR_FTEXT = get(oData, 'FTEXT', []);
        this.IV_FCAT = '';
        this.IV_FIELDNAME = fieldname;
        this.IV_ONLYFCAT = get(oData, 'IvOnlyfcat', '');
        this.IV_ROWS = get(oData, 'IvRows', '');
        this.IV_SPRAS = 'S';
        this.IV_TABNAME = get(oData, 'Tabname', 'ZSTMM_SITRK_INPUTPARAMS');
      },
      setFCODE1: function setFCODE1(value) {
        this.IR_FCODE1.push(new FormItem({
          low: value,
          option: OptionType.EQ
        }));
      },
      setFCODE2: function setFCODE2(value) {
        var _this = this;

        if (value) {
          if (value.aSelectedObjects) {
            value.aSelectedObjects.forEach(function (e) {
              _this.IR_FCODE2.push(new FormItem({
                low: e.PR_WERKS,
                option: OptionType.EQ
              }));
            });
          } else {
            this.IR_FCODE2.push(new FormItem({
              low: value,
              option: OptionType.EQ
            }));
          }
        }
      },
      setFCODE3: function setFCODE3(value) {
        this.IR_FCODE3.push(new FormItem({
          low: value,
          option: OptionType.EQ
        }));
      },
      setFCODE4: function setFCODE4(value) {
        this.IR_FCODE4.push(new FormItem({
          low: value,
          option: OptionType.EQ
        }));
      },
      setFCODE5: function setFCODE5(value) {
        this.IR_FCODE5.push(new FormItem({
          low: value,
          option: OptionType.EQ
        }));
      },
      setFDATE1: function setFDATE1(value) {
        this.IR_FDATE1.push(new FormItem({
          option: OptionType.CP,
          low: value
        }));
      },
      setFTEXT: function setFTEXT(value) {
        this.IR_FTEXT.push(new FormItem({
          option: OptionType.CP,
          low: value
        }));
      },
      setSPRAS: function setSPRAS(value) {
        this.IV_SPRAS = value;
      },
      setROWS: function setROWS(value) {
        this.IV_ROWS = value;
      }
    })
  );
});