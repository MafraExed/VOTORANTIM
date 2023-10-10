"use strict";

/*!
 *  SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/vendor/lodash.set'], function (set) {
  return (
    /**
     * @function
     * @name ZFMM_SITRK_F_APROB_DAO
     * @description - DAO para la funciÃ³n ZFMM_SITRK_F_APROB_DAO
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
      var IT_DOCKEYS = res.IT_DOCKEYS,
          ET_APROB = res.ET_APROB,
          IT_SEL_FEILDS = res.IT_SEL_FEILDS,
          ET_FCAT_APROB = res.ET_FCAT_APROB;
      set(result, 'dockeys', IT_DOCKEYS);
      set(result, 'items', ET_APROB);
      set(result, 'selFields', IT_SEL_FEILDS);
      set(result, 'catalog', ET_FCAT_APROB);
      return result;
    }
  );
});