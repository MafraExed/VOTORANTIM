"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['sap/ui/model/resource/ResourceModel'], function (ResourceModel) {
  var oResourceBundle = new ResourceModel({
    bundleName: 'com.innova.sigc.i18n.i18n'
  }).getResourceBundle();
  /**
   * Entrada proveedor of Evaluation Criteria.
   *
   * @enum {object}
   * @public
   * @alias com.innova.sigc.model.process.EntProvEvaluationCriteria
   */

  return {
    /**
     * No se necesita un valor de referencia
     * @public
     */
    A: {
      key: 'A',
      text: oResourceBundle.getText('0087')
    },

    /**
     * NÃºmero
     * @public
     */
    B: {
      key: 'B',
      text: oResourceBundle.getText('0088'),
      prop: 'number'
    },

    /**
     * Si/No
     * @public
     */
    C: {
      key: 'C',
      text: oResourceBundle.getText('0089'),
      prop: 'yesOrNo'
    },

    /**
     * Fecha
     * @public
     */
    D: {
      key: 'D',
      text: oResourceBundle.getText('0090'),
      prop: 'date'
    },

    /**
     * Texto
     * @public
     */
    E: {
      key: 'E',
      text: oResourceBundle.getText('0091'),
      prop: 'text'
    }
  };
},
/* bExport= */
true);