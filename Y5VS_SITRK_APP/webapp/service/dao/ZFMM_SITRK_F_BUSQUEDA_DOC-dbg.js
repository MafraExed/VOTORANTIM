"use strict";

/*!
 *  SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/vendor/lodash.set'], function (set) {
  return (
    /**
     * @function
     * @name ZFMM_SITRK_F_BUSQUEDA_DOC
     * @description - DAO para la funciÃ³n ZFMM_SITRK_F_BUSQUEDA_DOC
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
      var ET_DOCKEYS = res.ET_DOCKEYS,
          ET_ITEMS = res.ET_ITEMS,
          ET_FCAT_ITEMS = res.ET_FCAT_ITEMS,
          ET_HEDINDIC = res.ET_HEDINDIC,
          ET_INDANMES = res.ET_INDANMES;
      set(result, 'dockeys', ET_DOCKEYS);
      set(result, 'items', ET_ITEMS);
      set(result, 'catalog', ET_FCAT_ITEMS);
      set(result, 'indicators', ET_HEDINDIC);
      set(result, 'graph', ET_INDANMES);
      return result;
    }
  );
});