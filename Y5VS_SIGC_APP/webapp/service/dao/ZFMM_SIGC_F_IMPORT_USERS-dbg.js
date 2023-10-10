"use strict";

/*!
 *  SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name ZFMM_SIGC_F_IMPORT_USERS
     * @description - DAO para la funciÃ³n ZFMM_SIGC_F_IMPORT_USERS
     *
     * @public
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    function (res) {
      var ET_USERS = res.ET_USERS;
      return ET_USERS;
    }
  );
});