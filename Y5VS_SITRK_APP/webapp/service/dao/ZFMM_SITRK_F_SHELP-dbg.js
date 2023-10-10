"use strict";

/*!
 *  SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['../utils/filterSHelpData', 'com/innova/util/isEmpty', 'com/innova/util/keyBy', 'com/innova/vendor/lodash.get', 'com/innova/vendor/lodash.set'], function (filterSHelpData, isEmpty, keyBy, get, set) {
  return (
    /**
     * @function
     * @name ZFMM_SITRK_F_SHELP_DAO
     * @description - DAO para la funciÃ³n ZFMM_SITRK_F_SHELP_DAO
     *
     * @public
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version  0.5.0
     */
    function (req, res) {
      var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          filter = _ref.filter,
          query = _ref.query;

      var result = {};
      var ET_FCAT = res.ET_FCAT,
          ET_FCAT_SHELP = res.ET_FCAT_SHELP;
      set(result, 'catalog', isEmpty(ET_FCAT) ? ET_FCAT_SHELP : keyBy(ET_FCAT, 'FIELDNAME'));
      set(result, 'data', filterSHelpData({
        catalog: ET_FCAT,
        data: get(res, "ET_SHELP_".concat(req.IV_FIELDNAME), get(res, 'ET_SHELP', [])),
        filter: filter,
        query: query
      }));
      set(result, 'spras', get(res, "ET_SHELP_SPRAS", []));
      return result;
    }
  );
});