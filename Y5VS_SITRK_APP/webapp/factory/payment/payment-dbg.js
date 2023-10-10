"use strict";

sap.ui.define(['com/innova/formatter/columnTitleProcess', 'sap/m/Label', 'sap/m/Text', 'sap/ui/table/Column'], function (columnTitleProcess, Label, Text, Column) {
  var factory = {
    /* =========================================================== */

    /* begin: tablepayment                                        */

    /* =========================================================== */

    /**
     * @function
     * @name tablepayment
     * @description - FunciÃ³n Factory para la tabla procesoss de compra
     *
     * @private
     * @param {string} sId - id del la columna.
     * @param {object} oContext - Contexto del objeto del binding.
     * @returns {sap.ui.table.Column} - Columna de la tabla.
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    tablePayment: function tablePayment(sId, oContext) {
      factory.controller = this;
      var oCatalog = oContext.getObject();
      var sFieldname = oCatalog.FIELDNAME;
      var sIntType = oCatalog.INTTYPE;
      var sPath = "payment>".concat(sFieldname);
      var template = new Text({
        text: "{".concat(sPath, "}")
      });
      return new Column({
        id: sId,
        label: new Label({
          text: {
            parts: ['payment>REPTEXT', 'payment>SCRTEXT_L', 'payment>SP_GROUP'],
            formatter: columnTitleProcess
          },
          tooltip: {
            parts: ['payment>REPTEXT', 'payment>SCRTEXT_L', 'payment>SP_GROUP'],
            formatter: columnTitleProcess
          },
          wrapping: true,
          wrappingType: 'Hyphenated'
        }),
        autoResizable: true,
        filterOperator: 'Contains',
        filterProperty: "".concat(sFieldname),
        hAlign: sIntType === 'N' ? 'End' : 'Left',
        name: "".concat(sFieldname),
        showFilterMenuEntry: '{= %{payment>MARK} !== "X" }',
        showSortMenuEntry: '{= %{payment>MARK} !== "X" }',
        sortProperty: "".concat(sFieldname),
        template: template,
        visible: "{= %{payment>TECH} !== 'X' && %{payment>NO_OUT} !== 'X' }",
        width: "{= parseInt(%{payment>OUTPUTLEN}) > 0 ? parseInt(%{payment>OUTPUTLEN}) + 'px' : '130px' }"
      });
    }
    /* =========================================================== */

    /* finish: tablePayment                                    *
    /* =========================================================== */

    /* =========================================================== */

    /* begin: internal methods                                     *
    /* =========================================================== */

  };
  return factory;
});