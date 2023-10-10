"use strict";

/*!
 *  SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/vendor/lodash.get', 'com/innova/vendor/lodash.set'], function (get, set) {
  return (
    /**
     * @function
     * @name ZFMM_SITRK_F_LAYOUT_DAO
     * @description - DAO para la funciÃ³n ZFMM_SITRK_F_LAYOUT_DAO
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
      set(result, 'layouts', get(res, 'ET_LAYOUTS', []));
      set(result, 'catalog', get(res, 'ET_CATALOGO', []));
      set(result, 'message', get(res, 'EV_MESSAGE', ''));
      set(result, 'type', get(res, 'EV_TYPE', ''));
      return result;
    }
  );
});