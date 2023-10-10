"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['sap/m/Label', 'sap/m/Text', 'sap/ui/table/Column', 'sap/ui/unified/Currency'],
/**
 * @function
 * @name RoundHistory
 * @namespace com.innova.sigc.factory.commercialQualification
 * @description - Factory to create the round history
 *
 * @private
 * @param {typeof sap.m.Label} Label
 * @param {typeof sap.m.Text} Text
 * @param {typeof sap.ui.table.Column} Column
 * @param {typeof sap.ui.unified.Currency} Column
 * @returns {object}
 *
 * @author Edwin Valencia <evalencia@innovainternacional.biz>
 * @version 1.0.0
 */
function (Label, Text, Column, Currency) {
  var factory = {
    /**
     * @function
     * @name createColumns
     * @description - Create columns for position table
     *
     * @public
     * @param {string} sId - column id
     * @param {object} oContext - Context binding
     * @returns {sap.ui.table.Column}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    createColumns: function createColumns(sId, oContext) {
      var name = oContext.getProperty('name');
      var type = oContext.getProperty('template');
      var template = new Text({
        text: "{".concat(name, "}")
      });
      var strategy = "buildTemplateType".concat(type);

      if (factory["".concat(strategy)]) {
        template = factory["".concat(strategy)].call(this, {
          context: oContext.getObject()
        });
      }

      return new Column(sId, {
        label: new Label({
          text: oContext.getProperty('label'),
          wrapping: true
        }),
        autoResizable: true,
        filterOperator: 'Contains',
        filterProperty: "".concat(name),
        name: "".concat(name),
        visible: 'visible' in oContext.getObject() ? oContext.getObject().visible : true,
        sortProperty: "".concat(name),
        template: template,
        width: 'auto',
        minWidth: 150
      });
    },

    /* =========================================================== */

    /* begin: internal methods                                     *
    /* =========================================================== */

    /**
     * @function
     * @name buildTemplateTypePosProc
     * @description - Build template type PosProc
     *
     * @private
     * @returns {sap.m.Text}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    buildTemplateTypePosProc: function buildTemplateTypePosProc() {
      return new Text({
        text: "{posProc}",
        wrapping: true
      });
    },

    /**
     * @function
     * @name buildTemplateTypeMatnr
     * @description - Build template type Matnr
     *
     * @private
     * @returns {sap.m.Text}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    buildTemplateTypeMatnr: function buildTemplateTypeMatnr() {
      return new Text({
        text: "{matnr} {maktx}",
        wrapping: true
      });
    },

    /**
     * @function
     * @name buildTemplateTypeMenge
     * @description - Build template type Menge
     *
     * @private
     * @returns {sap.m.Text}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    buildTemplateTypeRound: function buildTemplateTypeRound(_ref) {
      var context = _ref.context;
      var vendorId = context.vendorId;
      return new Currency({
        value: "{= parseFloat(%{".concat(vendorId, "/bbwert}) }"),
        currency: "{".concat(vendorId, "/waers}"),
        maxPrecision: 2,
        useSymbol: false
      });
    }
    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

  };
  return factory;
});