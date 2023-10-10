"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name getSelectedRowsContext
     * @description - Obtener los indices de las filas seleccionadas de la tabla
     *
     * @private
     * @param {sap.ui.table.Table} oTable - Tabla de la vista
     * @param {object} context
     * @param {object} context.i18n
     * @returns {Promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    function (oTable, _ref) {
      var i18n = _ref.i18n;
      var aSelectedIndices = oTable.getSelectedIndices();

      if (!aSelectedIndices.length) {
        return Promise.reject(new Error(i18n.getText('Commons.0030')));
      }

      return Promise.resolve(aSelectedIndices.map(function (iSelectedIndex) {
        return {
          context: oTable.getContextByIndex(iSelectedIndex),
          index: iSelectedIndex,
          object: oTable.getContextByIndex(iSelectedIndex).getObject()
        };
      }));
    }
  );
});