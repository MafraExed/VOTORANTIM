"use strict";

/*!
 *  SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['../utils/buildSysParams', '../utils/keyTextPool', 'com/innova/util/keyBy'], function (buildSysParams, keyTextPool, keyBy) {
  return (
    /**
     * @function
     * @name ZFMM_SITRK_F_INITIALIZE_DAO
     * @description - DAO para la funciÃ³n ZFMM_SITRK_F_INITIALIZE_DAO
     *
     * @public
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    function (res) {
      var ES_SYSPARAMS = res.ES_SYSPARAMS,
          ET_FCAT_INPUTPARAMS = res.ET_FCAT_INPUTPARAMS,
          ET_TEXTPOOL = res.ET_TEXTPOOL,
          GV_NAME = res.GV_NAME,
          EV_ZSIGC = res.EV_ZSIGC,
          EP_BUKRS = res.EP_BUKRS,
          EP_EKORG = res.EP_EKORG,
          EP_EKGRP = res.EP_EKGRP;
      var paymentBoolean = true;

      if (GV_NAME === null || GV_NAME === '') {
        paymentBoolean = false;
      }

      return {
        catalog: keyBy(ET_FCAT_INPUTPARAMS, 'FIELDNAME'),
        textPool: keyTextPool(ET_TEXTPOOL),
        sysParams: buildSysParams(ES_SYSPARAMS),
        // eslint-disable-next-line no-unneeded-ternary
        showPayment: paymentBoolean,
        zsigc: EV_ZSIGC,
        bukrs: EP_BUKRS,
        ekorg: EP_EKORG,
        ekgrp: EP_EKGRP
      };
    }
  );
});