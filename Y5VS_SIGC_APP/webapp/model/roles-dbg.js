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
    vendors: {
      key: 'vendor',
      text: oResourceBundle.getText('0069')
    }
  };
},
/* bExport= */
true);