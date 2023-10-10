"use strict";

/*!
 *  SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/vendor/lodash.set'], function (set) {
  return (
    /**
     * @function
     * @name ZFMM_SITRK_CONT_ADJUNTO
     * @description - DAO para la funciÃ³n ZFMM_SITRK_CONT_ADJUNTO
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
      var IV_ADJID = res.IV_ADJID,
          EV_CONTENIDO = res.EV_CONTENIDO,
          EV_ADJURL = res.EV_ADJURL;
      set(result, 'id', IV_ADJID);
      set(result, 'url', EV_ADJURL);
      set(result, 'content', EV_CONTENIDO);
      return result;
    }
  );
});