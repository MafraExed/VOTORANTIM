"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * PoCreate
 *
 * @namespace
 * @name com.innova.sigc.model.process.poCreate.PoCreate
 * @public
 */
// Proporciona la implementaciÃ³n del modelo Position
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * @class
     * @name PoCreate - Create order
     * @description - ImplementaciÃ³n del modelo de Crear Orden de Pedido
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     * @public
     * @alias com.innova.sigc.model.process.poCreate.PoCreate
     */
    Object.extend('com.innova.sigc.model.process.poCreate.PoCreate', {
      constructor: function constructor(data) {
        this.DOC_TYPE = data.DOC_TYPE;
        this.DOC_DATE = data.DOC_DATE;
        this.COMP_CODE = data.COMP_CODE;
        this.VENDOR = data.VENDOR;
        this.PURCH_ORG = data.PURCH_ORG;
        this.PUR_GROUP = data.PUR_GROUP;
        this.CURRENCY = data.CURRENCY;
        this.VPER_START = data.VPER_START;
        this.VPER_END = data.VPER_END;
        this.INCOTERMS1 = data.INCOTERMS1;
        this.INCOTERMS2 = data.INCOTERMS2;
        this.PMNTTRMS = data.PMNTTRMS;
        this.WARRANTY = data.WARRANTY;
        this.COLLECT_NO = data.COLLECT_NO;
        this.REF_1 = data.REF_1;
        this.OUR_REF = data.OUR_REF;
        this.SALES_PERS = data.SALES_PERS;
        this.TELEPHONE = data.TELEPHONE;
      }
    })
  );
});