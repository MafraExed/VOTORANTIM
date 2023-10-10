"use strict";

/*!
 *  SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['../utils/buildSysParams', '../utils/keyTextPool', 'com/innova/sigc/utils/keyBy'], function (buildSysParams, keyTextPool, keyBy) {
  return (
    /**
     * @function
     * @name ZFMM_SIGC_F_INITIALIZE
     * @description - DAO para la funciÃ³n ZFMM_SIGC_F_INITIALIZE
     *
     * @public
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    function (res) {
      var ES_SYSPARAMS = res.ES_SYSPARAMS,
          ET_FCAT_INPUTPARAMS = res.ET_FCAT_INPUTPARAMS,
          ET_TEXTPOOL = res.ET_TEXTPOOL,
          EP_BUKRS = res.EP_BUKRS,
          EP_EKORG = res.EP_EKORG,
          EP_EKGRP = res.EP_EKGRP;
      return {
        catalog: keyBy(ET_FCAT_INPUTPARAMS, 'FIELDNAME'),
        textPool: keyTextPool(ET_TEXTPOOL),
        sysParams: buildSysParams(ES_SYSPARAMS),
        bukrs: EP_BUKRS,
        ekorg: EP_EKORG,
        ekgrp: EP_EKGRP
      };
    }
  );
});