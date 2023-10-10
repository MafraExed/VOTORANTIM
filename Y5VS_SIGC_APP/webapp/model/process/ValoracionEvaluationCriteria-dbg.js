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
   * Valoracion of Evaluation Criteria.
   *
   * @enum {object}
   * @public
   * @alias com.innova.sigc.model.process.ValoracionEvaluationCriteria
   */

  return {
    /**
     * Valoracion clasificacion manual
     * @public
     */
    X: {
      key: 'X',
      text: oResourceBundle.getText('0084')
    },

    /**
     * Valoracion Automatico - menor es mejor
     * @public
     */
    Y: {
      key: 'Y',
      text: oResourceBundle.getText('0085')
    },

    /**
     * Valoracion Automatico - mayor es mejor
     * @public
     */
    Z: {
      key: 'Z',
      text: oResourceBundle.getText('0086')
    }
  };
},
/* bExport= */
true);