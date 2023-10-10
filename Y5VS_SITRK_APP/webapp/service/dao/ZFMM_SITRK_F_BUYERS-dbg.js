"use strict";

/*!
 *  SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name ZFMM_SITRK_F_BUYERS
     * @description - DAO for function ZFMM_SITRK_F_BUYERS - Compradores
     *
     * @public
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version  0.5.0
     */
    function (req) {
      return req.ET_COMPRADORES;
    }
  );
});