"use strict";

sap.ui.define(['./BaseController', 'sap/ui/model/json/JSONModel'], function (BaseController, JSONModel) {
  return BaseController.extend('com.innova.sitrack.controller.App', {
    /**
     * @function
     * @name onInit
     * @description - Se ejecuta cuando se inicia la aplicaciÃ³n
     *
     * @private
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    onInit: function onInit() {
      this.setModel(new JSONModel({
        busy: false,
        delay: 0,
        resetProcessForm: true
      }), 'appView');
    }
  });
});