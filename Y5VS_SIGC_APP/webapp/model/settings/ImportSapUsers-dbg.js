"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * ImportSapUsers
 *
 * @namespace
 * @name com.innova.sigc.model.settings.ImportSapUsers
 * @public
 */
// Proporciona la implementaciÃ³n del modelo Position
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un Importar usuarios SAP.
     *
     * Modelo de un request importar usuarios de sap
     *
     *
     * @class
     * @name ImportSapUsers
     * @description - ImplementaciÃ³n del modelo para importar usuarios de sap
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     * @public
     * @alias com.innova.sigc.model.settings.ImportSapUsers
     */
    Object.extend('com.innova.sigc.model.settings.ImportSapUsers', {
      constructor: function constructor(data) {
        this.IR_BNAME = data.BNAME;
        this.IR_NAME_FIRST = data.NAME_FIRST;
        this.IR_NAME_LAST = data.NAME_LAST;
        this.IR_SMTP_ADDR = data.SMTP_ADDR;
        this.IR_FUNCTION = data.FUNCTION;
        this.IR_DEPARTMENT = data.DEPARTMENT;
        this.IR_AGR_NAME = data.AGR_NAME;
        this.IR_USERGROUP = data.USERGROUP;
      }
    })
  );
});