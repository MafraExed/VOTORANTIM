"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sigc/model/process/TypesEvaluationCriteria'], function (TypesEvaluationCriteria) {
  return (
    /**
     * @function
     * @name isStatusTypeT
     * @description -Is status type Technical
     *
     * @public
     * @param {object} context
     * @returns {boolean}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    function (_ref) {
      var statusType = _ref.statusType;
      return (statusType === null || statusType === void 0 ? void 0 : statusType.charAt(0).toUpperCase()) === TypesEvaluationCriteria.T;
    }
  );
});