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
   * Tipos de preguntas para los procesos
   *
   * @enum {object}
   * @public
   * @alias com.innova.sigc.model.process.ProcessQuestionsType
   */

  return {
    /**
     * Tecnico
     * @public
     */
    T: {
      key: 'T',
      text: oResourceBundle.getText('0130')
    },

    /**
     * Comercial
     * @public
     */
    C: {
      key: 'C',
      text: oResourceBundle.getText('0133')
    },

    /**
     * Juridico
     * @public
     */
    J: {
      key: 'J',
      text: oResourceBundle.getText('0163')
    }
  };
},
/* bExport= */
true);