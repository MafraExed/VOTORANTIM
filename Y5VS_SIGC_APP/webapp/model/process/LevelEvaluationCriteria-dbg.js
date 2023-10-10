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
   * Level of Evaluation Criteria.
   *
   * @enum {object}
   * @public
   * @alias com.innova.sigc.model.process.LevelEvaluationCriteria
   */

  return {
    /**
     * Nivel de evaluaciÃ³n CABECERA
     * @public
     */
    C: {
      key: 'C',
      text: oResourceBundle.getText('0082')
    },

    /**
     * Nivel de evaluaciÃ³n POSICION
     * @public
     */
    P: {
      key: 'P',
      text: oResourceBundle.getText('0083')
    }
  };
},
/* bExport= */
true);