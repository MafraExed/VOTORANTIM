"use strict";

/*!
 *  SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/vendor/lodash.set', 'com/innova/util/keyBy'], function (set, keyBy) {
  return (
    /**
     * @function
     * @name ZFMM_SITRK_BUSQ_SOLPAGO
     * @description - DAO para la funciÃ³n ZFMM_SITRK_BUSQ_SOLPAGO
     *
     * @public
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    function (res) {
      var result = {};
      var ET_FCAT_ITEMS = res.ET_FCAT_ITEMS,
          ET_ITEMS = res.ET_ITEMS;
      set(result, 'result', res);
      set(result, 'items', ET_ITEMS);
      set(result, 'catalog', keyBy(ET_FCAT_ITEMS, 'FIELDNAME'));
      return result;
    }
  );
});