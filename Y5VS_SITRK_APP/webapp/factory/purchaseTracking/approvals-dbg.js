"use strict";

sap.ui.define(['sap/m/Label', 'sap/m/Text', 'sap/m/ObjectIdentifier', 'sap/m/FlexBox', 'sap/ui/table/Column', 'sap/ui/core/CustomData', 'com/innova/model/formatter'], function (Label, Text, ObjectIdentifier, FlexBox, Column, CustomData, _formatter) {
  var factory = {
    /* =========================================================== */

    /* begin: Aprobaciones                                         */

    /* =========================================================== */

    /**
     * @function
     * @name tableApproval
     * @description - FunciÃ³n Factory para la tabla aprobaciones de procesos seleccionados
     *
     * @private
     * @param {string} sId - id del la columna.
     * @param {object} oContext - Contexto del objeto del binding.
     * @returns {sap.ui.table.Column} - Columna de la tabla.
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    tableApproval: function tableApproval(sId, oContext) {
      var controller = this;
      var oCatalog = oContext.getObject();
      var sFieldname = oCatalog.FIELDNAME;
      var sTitle = oCatalog.SCRTEXT_L || oCatalog.REPTEXT;
      var sIntType = oCatalog.INTTYPE;
      var sPath = "approvals>".concat(sFieldname);
      var template = new Text({
        text: "{".concat(sPath, "}")
      });

      if (sIntType === 'approver') {
        template = factory._buildTemplateTypeApprover.call(controller, sFieldname);
      } else if (sFieldname === 'BNFPO') {
        template = factory._buildBNFPOTemplate({
          context: oContext.getObject(),
          path: sPath
        });
      } else {
        template = factory._buildDefaultTemplate({
          context: oContext.getObject(),
          path: sPath
        });
      }

      return new Column({
        id: sId,
        label: new Label({
          text: sTitle,
          tooltip: sTitle,
          wrapping: true,
          wrappingType: 'Hyphenated'
        }),
        autoResizable: true,
        filterOperator: 'Contains',
        filterProperty: "".concat(sFieldname),
        hAlign: sIntType === 'N' ? 'End' : 'Left',
        name: "".concat(sFieldname),
        showFilterMenuEntry: '{= %{process>MARK} !== "X" }',
        showSortMenuEntry: '{= %{process>MARK} !== "X" }',
        sortProperty: "".concat(sFieldname),
        template: template,
        visible: "{= %{process>TECH} !== 'X' && %{process>NO_OUT} !== 'X' }",
        width: "{= parseInt(%{process>OUTPUTLEN}) > 0 ? parseInt(%{process>OUTPUTLEN}) + 'px' : '130px' }"
      });
    },

    /**
     * @function
     * @name _buildBNFPOTemplate
     * @description - Retornar el BNFPO quitando 0 a la izquierda
     *
     * @private
     * @param {string} sFieldname
     * @returns {sap.m.FlexBox}
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    _buildBNFPOTemplate: function _buildBNFPOTemplate(data) {
      var path = data.path;
      return new Text({
        text: {
          parts: ["".concat(path)],
          formatter: function formatter(value) {
            if (value === '00000' || value === null) {
              return null;
            }

            return parseInt(value, 10);
          }
        }
      });
    },

    /**
     * @function
     * @name _buildDefaultTemplate
     * @description - Retornar el Text mapeando la fecha en caso de que la tenga
     *
     * @private
     * @returns {sap.m.FlexBox}
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    _buildDefaultTemplate: function _buildDefaultTemplate(data) {
      var path = data.path,
          context = data.context;
      var sIntType = context.INTTYPE;
      return new Text({
        text: {
          parts: ["".concat(path)],
          formatter: function formatter(value) {
            if (sIntType === 'D') {
              if (value === '0000-00-00') {
                return null;
              }

              if (value !== null) {
                return _formatter.formatDateSAP(value === null || value === void 0 ? void 0 : value.split('T')[0], 'DD/MM/yyyy');
              }

              return value;
            }

            return value;
          }
        }
      });
    },

    /**
     * @function
     * @name _buildTemplateTypeApprover
     * @description - Retornar el Flexbox con el cÃ³digo material y su descripciÃ³n
     *
     * @private
     * @param {string} sFieldname
     * @returns {sap.m.FlexBox}
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    _buildTemplateTypeApprover: function _buildTemplateTypeApprover(sFieldname) {
      var controller = this;
      return new FlexBox({
        direction: 'Column',
        alignItems: 'Start',
        items: [new ObjectIdentifier({
          visible: "{= %{approvals>".concat(sFieldname, "/date} === '0000-00-00' || %{approvals>").concat(sFieldname, "/date} === '0000-00-00'}"),
          title: "{approvals>".concat(sFieldname, "/name}"),
          titleActive: true,
          titlePress: [controller._findApprover, controller],
          customData: [new CustomData({
            key: 'dataItem',
            value: "{approvals>".concat(sFieldname, "}")
          })]
        }), new ObjectIdentifier({
          visible: "{= %{approvals>".concat(sFieldname, "/date} !== '0000-00-00' && %{approvals>").concat(sFieldname, "/date} !== '0000-00-00'}"),
          title: "{approvals>".concat(sFieldname, "/name}"),
          // text: `{approvals>${sFieldname}/date} - {approvals>${sFieldname}/hour}`,
          text: {
            parts: ["approvals>".concat(sFieldname, "/date"), "approvals>".concat(sFieldname, "/hour")],
            formatter: function formatter(value, hour) {
              if (value === '0000-00-00') {
                return null;
              }

              if (value !== null) {
                var date = _formatter.formatDateSAP(value === null || value === void 0 ? void 0 : value.split('T')[0], 'DD/MM/yyyy');

                return "".concat(date, " - ").concat(hour);
              }

              return value;
            }
          }
        }), new ObjectIdentifier({
          visible: "{= %{approvals>".concat(sFieldname, "/date} !== '0000-00-00' && %{approvals>").concat(sFieldname, "/date} !== '0000-00-00'}"),
          text: "{main>/textPool/K125}: {approvals>".concat(sFieldname, "/days}")
        })]
      });
    }
  };
  return factory;
});