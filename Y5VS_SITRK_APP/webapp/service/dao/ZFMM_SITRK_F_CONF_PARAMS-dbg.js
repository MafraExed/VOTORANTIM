"use strict";

/*!
 *  SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/vendor/lodash.set'], function (set) {
  return (
    /**
     * @function
     * @name ZFMM_SITRK_F_CONF_PARAMS
     * @description - DAO para la funciÃ³n ZFMM_SITRK_F_CONF_PARAMS
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
      var EV_PARAMS = res.EV_PARAMS,
          EV_RETURN = res.EV_RETURN;
      set(result, 'data', EV_PARAMS);
      set(result, 'log', EV_RETURN);
      return result;
    }
  );
});