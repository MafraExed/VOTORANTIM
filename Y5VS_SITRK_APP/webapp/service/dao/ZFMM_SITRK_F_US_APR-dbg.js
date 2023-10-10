"use strict";

/*!
 *  SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/vendor/lodash.set'], function (set) {
  return (
    /**
     * @function
     * @name ZFMM_SITRK_F_US_APR_DAO
     * @description - DAO para la funciÃ³n ZFMM_SITRK_F_US_APR_DAO
     *
     * @public
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    function (res) {
      var result = {};
      var ET_USU_APROB = res.ET_USU_APROB;
      set(result, 'results', ET_USU_APROB);
      return result;
    }
  );
});