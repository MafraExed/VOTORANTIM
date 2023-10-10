"use strict";

/*!
 *  SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/vendor/lodash.set'], function (set) {
  return (
    /**
     * @function
     * @name ZFMM_SITRK_F_LICITA
     * @description - DAO para la funciÃ³n ZFMM_SITRK_F_LICITA
     *
     * @public
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    function (res) {
      var result = {};
      set(result, 'response', res);
      return result;
    }
  );
});