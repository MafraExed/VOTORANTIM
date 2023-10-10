"use strict";

sap.ui.define(['./utils/index', 'com/innova/sigc/formatter/maxLength', 'sap/m/Column', 'sap/m/ColumnListItem', 'sap/m/Input', 'sap/m/Text', 'sap/ui/layout/form/FormElement'], function (utils, maxLength, Column, ColumnListItem, Input, Text, FormElement) {
  var factory = {
    /**
     * @function
     * @name sHelpColumnFactory
     * @description - FunciÃ³n Factory para las columnas de la tabla de ayuda de busqueda
     *
     * @public
     * @param {string} key - Campo llave.
     * @returns {function}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    sHelpColumnFactory: function sHelpColumnFactory(key) {
      return function (sId, oContext) {
        return new Column(sId, {
          hAlign: 'Begin',
          popinDisplay: 'Inline',
          header: new Text({
            text: oContext.getProperty('SCRTEXT_L')
          }),
          visible: oContext.getProperty('TECH') !== 'X',
          minScreenWidth: key !== oContext.getProperty('FIELDNAME') ? 'Tablet' : '',
          demandPopin: true
        });
      };
    },

    /**
     * @function
     * @name sHelpItemsFactory
     * @description - FunciÃ³n Factory para los items de la tabla de ayuda de busqueda
     *
     * @public
     * @param {string} sId - id del control.
     * @param {object} oContext - Contexto del objeto del binding.
     * @returns {sap.m.ColumnListItem} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    sHelpItemsFactory: function sHelpItemsFactory(sId, oContext) {
      return new ColumnListItem("".concat(sId, "-ColumnListItem"), {
        type: 'Active',
        unread: false,
        selected: '{selected}'
      }).bindAggregation('cells', '/catalog', function (id, context) {
        var value = oContext.getProperty(context.getProperty('FIELDNAME'));
        return new Text(id, {
          text: value
        });
      });
    },

    /**
     * @function
     * @name tableItemDynamicSH
     * @description - Factory para los Items de la sap.m.Table de posiciones.
     *
     * @private
     * @param {string} sPath - Path del objeto del binding.
     * @returns {function} - ColumnListItem para la agregaciÃ³n de los items de la sap.m.Table.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    tableItemDynamicSH: function tableItemDynamicSH(sPath) {
      var _this = this;

      return function (sId, oContext) {
        return new ColumnListItem("ColumnListItem-".concat(sId), {
          type: 'Active',
          selected: '{selected}',
          press: function press(oSource) {
            _this.searchHelp.onClose.call(_this, [oSource.getSource().getBindingContext()]);
          }
        }).bindAggregation('cells', sPath, function (id, context) {
          return new Text(id, {
            text: oContext.getProperty(context.getProperty('FIELDNAME'))
          });
        });
      };
    },

    /* =========================================================== */

    /* Begin: filterFields                                         */

    /* =========================================================== */

    /**
     * @function
     * @name filterFields
     * @description - FunciÃ³n Factory del binding del Formulario de Custom filter
     *
     * @private
     * @param {string} sId - id del la columna.
     * @param {object} oContext - Contexto del objeto del binding.
     * @returns {sap.m.VBox} - Columna de la tabla.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    filterFields: function filterFields(sId, oContext) {
      var oCatalog = oContext.getObject();
      var sTitle = utils.getCatalogTitle(oCatalog);
      var sInttype = oCatalog.INTTYPE;
      var id = this.createId("input".concat(oCatalog.FIELDNAME));
      return new FormElement(sId, {
        label: "".concat(sTitle),
        fields: [sInttype === 'N' ? factory._filterFieldTypeN.call(this, id, oCatalog) : factory._filterFieldTypeV.call(this, id, oCatalog)]
      });
    },

    /**
     * @function
     * @name _filterFieldTypeN
     * @description - FunciÃ³n Factory los campos de tipo N
     *
     * @private
     * @param {string} id - id del Input.
     * @param {object} catalog - Catalogo del campo
     * @returns {sap.m.VBox} - Columna de la tabla.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _filterFieldTypeN: function _filterFieldTypeN(id, catalog) {
      return new Input(id, {
        fieldGroupIds: 'customFilter',

        /*  liveChange: formUtils.onLiveChangeTypeNumberN.bind(this), */
        maxLength: maxLength(catalog.INTLEN),
        name: "".concat(catalog.FIELDNAME),
        placeholder: utils.getCatalogTitle(catalog),
        showValueHelp: false,
        type: 'Text',
        change: function change(oEvent) {
          var oSource = oEvent.getSource();
          var sValue = oSource.getValue();
          oSource.setSelectedKey(sValue);
        }
      });
    },

    /**
     * @function
     * @name _filterFieldTypeV
     * @description - FunciÃ³n Factory los campos de tipo V
     *
     * @private
     * @param {string} id - id del Input.
     * @param {object} catalog - Catalogo del campo
     * @returns {sap.m.VBox} - Columna de la tabla.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _filterFieldTypeV: function _filterFieldTypeV(id, catalog) {
      var title = utils.getCatalogTitle(catalog);
      return new Input(id, {
        fieldGroupIds: 'customFilter',
        maxLength: maxLength(catalog.INTLEN),
        name: "".concat(catalog.FIELDNAME),
        placeholder: title,
        showSuggestion: false,
        showValueHelp: false,
        type: 'Text',
        valueHelpRequest: [this.searchHelp.onValueHelpRequest, this],
        width: '100%',
        change: function change(oEvent) {
          if (catalog.LOWERCASE !== 'X') {
            var oSource = oEvent.getSource();
            var sValue = oEvent.getParameter('value');
            sValue = sValue.toUpperCase();
            oSource.setValue(sValue);
          }
        }
      });
    }
    /* =========================================================== */

    /* finish: filterFields                                     */

    /* =========================================================== */

  };
  return factory;
});