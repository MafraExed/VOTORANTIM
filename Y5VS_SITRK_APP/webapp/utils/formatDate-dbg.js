"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['sap/ui/core/format/DateFormat'], function (DateFormat) {
  var oDateFormat = DateFormat.getDateInstance({
    pattern: 'yyyy-MM-dd'
  });
  /**
   * @function
   * @name formatDate
   * @description - Retorna una fecha formateada al formato que SAP recibe.
   *
   * @public
   * @param {Date} dDate - Fecha a formatear.
   * @returns {string} - Fecha formateada.
   *
   * @author Edwin Valencia <evalencia@innovainternacional.biz>
   * @version 0.5.0
   */

  return function (dDate) {
    return oDateFormat.format(dDate);
  };
});