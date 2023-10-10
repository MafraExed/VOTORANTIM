"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * ItemSolModif
 *
 * @namespace
 * @name com.innova.sitrack.model.purchaseTracking.ItemSolModif
 * @public
 */
// Proporciona la implementaciÃ³n del modelo ItemSolModif
sap.ui.define(['sap/ui/base/Object', 'com/innova/util/isEmpty'], function (Object, isEmpty) {
  return (
    /**
     * Constructor para un nuevo ItemSolModif.
     *
     * Modelo de un request para la asignar comprador a la solicitud de pedido
     *
     *
     * @class
     * @name ItemSolModif
     * @description - ImplementaciÃ³n del modelo de ItemSolModif
     *
     *
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     * @public
     * @alias com.innova.sitrack.model.purchaseTracking.ItemSolModif
     */
    Object.extend('com.innova.sitrack.model.purchaseTracking.ItemSolModif', {
      constructor: function constructor(data) {
        var _data$PR_LFDAT;

        this.BANFN = data.BANFN;
        this.BNFPO = data.BNFPO;
        this.LFDAT_FLAG = data.PR_LFDAT_FLAG;
        this.EBAKZ_FLAG = data.PR_EBAKZ_FLAG;
        this.LOEKZ_FLAG = data.PR_LOEKZ_FLAG;
        this.LFDAT = (_data$PR_LFDAT = data.PR_LFDAT) === null || _data$PR_LFDAT === void 0 ? void 0 : _data$PR_LFDAT.split('T')[0];
        this.EBAKZ = data.PR_EBAKZ;
        this.LOEKZ = data.PR_LOEKZ;
      },
      isUpdate: function isUpdate() {
        return !isEmpty(this.LFDAT_FLAG) || !isEmpty(this.EBAKZ_FLAG) || !isEmpty(this.LOEKZ_FLAG);
      }
    })
  );
});