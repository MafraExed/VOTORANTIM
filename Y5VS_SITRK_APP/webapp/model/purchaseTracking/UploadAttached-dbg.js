"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * UploadAttached
 *
 * @namespace
 * @name com.innova.sitrack.model.purchaseTracking.UploadAttached
 * @public
 */
// Proporciona la implementaciÃ³n del modelo UploadAttached
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un nuevo UploadAttached.
     *
     * Modelo de un request para retornar o ajustar la solicitud de pedido
     *
     *
     * @class
     * @name - UploadAttached
     * @description - ImplementaciÃ³n del modelo de UploadAttached
     *
     *
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     * @public
     * @alias com.innova.sitrack.model.purchaseTracking.UploadAttached
     */
    Object.extend('com.innova.sitrack.model.purchaseTracking.UploadAttached', {
      constructor: function constructor(data, position) {
        if (data.target === '1') {
          // SolPed
          this.IV_DOCUMENTO = position.BANFN;
          this.IV_MATERIAL = '';
          this.IV_TIPO = data.target;
        } else if (data.target === '4') {
          // Material
          this.IV_DOCUMENTO = '';
          this.IV_MATERIAL = position.PR_MATNR;
          this.IV_TIPO = data.target;
        }

        this.IV_URL = data.url || '';
        this.IV_URLDES = data.desc || '';
        this.IV_NOCOMMIT = 'X';
        this.OT_RETURN = {};
      }
    })
  );
});