"use strict";

/*!
 *  SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/vendor/lodash.get', 'com/innova/vendor/lodash.set'], function (get, set) {
  return (
    /**
     * @function
     * @name ZFMM_SITRK_F_VARIANT_DAO
     * @description - DAO para la funciÃ³n ZFMM_SITRK_F_VARIANT_DAO
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
      set(result, 'variants', get(res, 'ET_VARIANTS', []));
      set(result, 'variant', get(res, 'ET_VARIANT', []));
      set(result, 'message', get(res, 'EV_MESSAGE', ''));
      set(result, 'type', get(res, 'EV_TYPE', ''));
      return result;
    }
  );
});