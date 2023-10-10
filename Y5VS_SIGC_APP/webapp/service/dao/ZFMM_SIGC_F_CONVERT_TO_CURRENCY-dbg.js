"use strict";

/*!
 *  SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name ZFMM_SIGC_F_CONVERT_TO_CURRENCY
     * @description - DAO para la funciÃ³n ZFMM_SIGC_F_CONVERT_TO_CURRENCY
     *
     * @public
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    function (res) {
      var ET_EXCHANGE = res.ET_EXCHANGE;
      return ET_EXCHANGE;
    }
  );
});