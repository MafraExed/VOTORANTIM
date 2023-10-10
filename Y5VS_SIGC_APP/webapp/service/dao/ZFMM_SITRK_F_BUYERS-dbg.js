"use strict";

/*!
 *  SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name ZSITRK_F_BUYERS
     * @description - DAO for function ZSITRK_F_BUYERS - Compradores
     *
     * @public
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version  1.0.0
     */
    function (req) {
      return req.ET_COMPRADORES;
    }
  );
});