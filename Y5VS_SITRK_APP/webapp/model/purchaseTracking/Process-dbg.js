"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * Process
 *
 * @namespace
 * @name com.innova.sitrack.model.purchaseTracking.Process
 * @public
 */
// Proporciona la implementaciÃ³n del modelo Process
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un nuevo Process.
     *
     * Modelo de un request para la consulta de procesos seleccionados
     *
     *
     * @class
     * @name - Process
     * @description - ImplementaciÃ³n del modelo de Process,
     *
     *
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     * @public
     * @alias com.innova.sitrack.model.purchaseTracking.Process
     */
    Object.extend('com.innova.sitrack.model.purchaseTracking.Process', {
      constructor: function constructor(data) {
        this.IV_SDP_BLDAT = null;

        if (data.SDP_BLDAT) {
          this.IV_SDP_BLDAT = [data.SDP_BLDAT];
        }

        this.IV_SDP_DELIVDATE = null;

        if (data.SDP_DELIVDATE) {
          this.IV_SDP_DELIVDATE = [data.SDP_DELIVDATE];
        }

        this.IV_SDP_PAYDATE = null;

        if (data.SDP_PAYDATE) {
          this.IV_SDP_PAYDATE = [data.SDP_PAYDATE];
        }

        this.IT_DOCKEYS = data.IT_DOCKEYS || [];
        this.IT_SEL_FEILDS = data.IT_SEL_FEILDS || [];
        this.IV_DOC_C = data.IV_DOC_C || null;
        this.IV_INDIC_FECHA = data.IV_INDIC_FECHA || null;
        this.IV_INDIC_INFMAT = data.IV_INDIC_INFMAT || null;
        this.IV_INDIC_STK = data.IV_INDIC_STK || null;
        this.IV_INDIC_ULTP = data.IV_INDIC_ULTP || null;
        this.IV_ONLYKEYS = data.IV_ONLYKEYS || null;
        this.IV_PED_COMPL = data.IV_PED_COMPL || null;
        this.IV_PED_DELETED = data.IV_PED_DELETED || null;
        this.IV_PED_EM = data.IV_PED_EM || null;
        this.IV_PED_LIV = data.IV_PED_LIV || null;
        this.IV_PED_LOCKED = data.IV_PED_LOCKED || null;
        this.IV_PED_STALIB = data.IV_PED_STALIB || null; // this.IV_SDP_BLDAT = [data.SDP_BLDAT] || null
        // this.IV_SDP_DELIVDATE = [data.SDP_DELIVDATE] || null

        this.IV_SDP_EKGRP = data.SDP_EKGRP || null; // this.IV_SDP_PAYDATE = [data.SDP_PAYDATE]|| null

        this.IV_SDP_PAYNUM = data.SDP_PAYNUM || null;
        this.IV_SDP_PAYSTATUS = data.SDP_PAYSTATUS || null;
        this.IV_SOLP_CLOSED = data.IV_SOLP_CLOSED || null;
        this.IV_SOLP_DELETED = data.IV_SOLP_DELETED || null;
        this.IV_SOLP_ESTP = data.IV_SOLP_ESTP || null;
        this.IV_SOLP_LOCKED = data.IV_SOLP_LOCKED || null;
        this.IV_SOLP_STALIB = data.IV_SOLP_STALIB || null;
      }
    })
  );
});