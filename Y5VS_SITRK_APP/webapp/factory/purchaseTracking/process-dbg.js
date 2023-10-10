"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

sap.ui.define(['com/innova/formatter/columnTitleProcess', 'com/innova/formatter/notificationColor', 'com/innova/formatter/notificationIcon', 'com/innova/lib/notification/notification', 'com/innova/lib/attachment/attachment', 'com/innova/model/formatter', 'sap/m/DatePicker', 'sap/m/FlexBox', 'sap/m/HBox', 'sap/m/Label', 'sap/m/ObjectIdentifier', 'sap/m/ProgressIndicator', 'sap/m/Switch', 'sap/m/Text', 'sap/m/Button', 'sap/m/TextArea', 'sap/ui/core/CustomData', 'sap/ui/core/Icon', 'sap/ui/table/Column'], function (columnTitleProcess, notificationColor, notificationIcon, notification, attachment, _formatter, DatePicker, FlexBox, HBox, Label, ObjectIdentifier, ProgressIndicator, Switch, Text, Button, TextArea, CustomData, Icon, Column) {
  var VISIBLE_PROP_EXPRESSION_SOLPED = '{= %{process>BANFN} !== "" || %{process>EBELN} === "" }';
  var VISIBLE_PROP_EXPRESSION_PED = '{= %{process>EBELN} !== "" }';
  var factory = {
    /* =========================================================== */

    /* begin: tableProcess                                        */

    /* =========================================================== */

    /**
     * @function
     * @name tableProcess
     * @description - FunciÃ³n Factory para la tabla procesoss de compra
     *
     * @private
     * @param {string} sId - id del la columna.
     * @param {object} oContext - Contexto del objeto del binding.
     * @returns {sap.ui.table.Column} - Columna de la tabla.
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    tableProcess: function tableProcess(sId, oContext) {
      factory.controller = this;
      var oCatalog = oContext.getObject();
      var sFieldname = oCatalog.FIELDNAME;
      var sIntType = oCatalog.INTTYPE;
      var sPath = "process>".concat(sFieldname);
      var template = new Text({
        text: "{".concat(sPath, "}")
      });
      var strategy = "_buildTemplateType".concat(sFieldname);

      if (factory["".concat(strategy)]) {
        template = factory["".concat(strategy)]({
          context: oContext,
          path: sPath
        });
      } else {
        template = factory._buildDefaultTemplate({
          context: oContext.getObject(),
          path: sPath
        });
      }

      var filterFieldname = sFieldname;

      if (sFieldname === 'SolPed') {
        filterFieldname = 'BANFN';
      } else if (sFieldname === 'ZMATNR') {
        filterFieldname = 'PR_MATNR';
      } else if (sFieldname === 'ZPEDIDO') {
        filterFieldname = 'EBELN';
      }

      return new Column({
        id: sId,
        label: new Label({
          text: {
            parts: ['process>REPTEXT', 'process>SCRTEXT_L', 'process>SP_GROUP'],
            formatter: columnTitleProcess
          },
          tooltip: {
            parts: ['process>REPTEXT', 'process>SCRTEXT_L', 'process>SP_GROUP'],
            formatter: columnTitleProcess
          },
          wrapping: true,
          wrappingType: 'Hyphenated'
        }),
        autoResizable: true,
        filterOperator: 'Contains',
        filterProperty: "".concat(filterFieldname),
        hAlign: sIntType === 'N' ? 'End' : 'Left',
        name: "".concat(filterFieldname),
        // showFilterMenuEntry: '{= %{process>MARK} !== "X" }',
        // showSortMenuEntry: '{= %{process>MARK} !== "X" }',
        showFilterMenuEntry: true,
        showSortMenuEntry: true,
        sortProperty: "".concat(filterFieldname),
        template: template,
        visible: "{= %{process>TECH} !== 'X' && %{process>NO_OUT} !== 'X' }",
        width: "{= parseInt(%{process>OUTPUTLEN}) > 0 ? parseInt(%{process>OUTPUTLEN}) + 'px' : '130px' }"
      });
    },

    /* =========================================================== */

    /* finish: tableProcess                                    *
    /* =========================================================== */

    /* =========================================================== */

    /* begin: internal methods                                     *
    /* =========================================================== */

    /**
     * @function
     * @name _buildDefaultTemplate
     * @description - Construir columna por default.
     *
     * @private- Contexto del objeto del binding.
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

            if (sIntType === 'P' && value !== null) {
              return _formatter.floatNumberFormat(value);
            }

            return value;
          }
        }
      });
    },

    /**
     * @function
     * @name _buildTemplateTypeLongText
     * @description - Construir columna LongText.
     *
     * @private
     * @param {object} context
     * @param {object} context.context - Contexto del objeto del binding.
     * @returns {sap.m.FlexBox}
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    _buildTemplateTypelongText: function _buildTemplateTypelongText() {
      return new Button({
        icon: 'sap-icon://message-popup',
        ariaHasPopup: 'Dialog',
        visible: '{= !!%{process>longText} }',
        press: factory.onShowTextDialog.bind(factory.controller, {
          prop: 'longText',
          title: 'K366'
        })
      });
    },

    /**
     * @function
     * @name _buildTemplateTypeLongTextComp
     * @description - Construir columna LongTextComp.
     *
     * @private
     * @returns {sap.m.FlexBox}
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    _buildTemplateTypelongTextComp: function _buildTemplateTypelongTextComp() {
      return new Button({
        icon: 'sap-icon://message-popup',
        ariaHasPopup: 'Dialog',
        visible: '{= !!%{process>longTextComp}}',
        press: factory.onShowTextDialog.bind(factory.controller, {
          prop: 'longTextComp',
          title: 'K216'
        })
      });
    },

    /**
     * @function
     * @name _buildTemplateTypeAttachments
     * @description - Construir columna attachments.
     *
     * @private
     * @param {object} context
     * @param {object} context.context - Contexto del objeto del binding.
     * @returns {sap.m.FlexBox}
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    _buildTemplateTypeAttachments: function _buildTemplateTypeAttachments() {
      return new Button({
        tooltip: '{main>textPool/K217}',
        icon: 'sap-icon://attachment',
        press: [attachment.showAttachment, this],
        // eslint-disable-next-line no-template-curly-in-string
        visible: '{= ${process>INF_ADJUNTOS}.length > 0 ? true : false}'
      });
    },

    /**
     * @function
     * @name _buildTemplateTypeAttachments
     * @description - Construir columna attachments.
     *
     * @private
     * @param {object} context
     * @param {object} context.context - Contexto del objeto del binding.
     * @returns {sap.m.FlexBox}
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    _buildTemplateTypeAttachmentsSolPed: function _buildTemplateTypeAttachmentsSolPed() {
      return new Button({
        tooltip: '{main>textPool/K221}',
        icon: 'sap-icon://attachment',
        press: [attachment.showAttachmentSolPed, this],
        // eslint-disable-next-line no-template-curly-in-string
        visible: '{= ${process>INF_ADJUNTO_SOLP}.length > 0 ? true : false}'
      });
    },

    /**
     * @function
     * @name _buildTemplateTypeStatus
     * @description - Construir columna estado.
     *
     * @private
     * @param {object} context
     * @param {object} context.context - Contexto del objeto del binding.
     * @returns {sap.m.FlexBox}
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    _buildTemplateTypeStatus: function _buildTemplateTypeStatus(_ref) {
      var context = _ref.context;
      return new HBox({
        alignItems: 'Center',
        items: [new Icon({
          visible: '{= typeof %{process>notification} !== "undefined" }',
          src: {
            path: 'process>notification/type',
            formatter: notificationIcon
          },
          color: {
            path: 'process>notification/type',
            formatter: notificationColor
          },
          press: [notification.showNotificationFromContext, this],
          customData: [new CustomData({
            key: 'context',
            value: 'process'
          })]
        }).addStyleClass('sapUiTinyMarginEnd'), new FlexBox({
          direction: 'Row',
          alignItems: 'Center',
          justifyContent: 'SpaceAround',
          wrap: 'Wrap',
          width: '100%'
        }).bindAggregation('items', 'process>status', function (id, currentContext) {
          var oInfoButton = context.getProperty(currentContext.sPath);
          return new Icon(id, {
            backgroundColor: "".concat(oInfoButton.COLOR),
            color: '#fff',
            height: '2.3rem',
            size: '1.5rem',
            src: oInfoButton.ICON,
            tooltip: oInfoButton.TOOLTIP,
            useIconTooltip: false,
            width: '2.3rem'
          }).addStyleClass('border-icon');
        })]
      });
    },

    /**
     * @function
     * @name _buildTemplateTypeSolPed
     * @description - Construir columna de solicitud de pedido y posiciÃ³n.
     *
     * @private
     * @param {object} context
     * @param {object} context.context - Contexto del objeto del binding.
     * @returns {sap.m.FlexBox}
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    _buildTemplateTypeSolPed: function _buildTemplateTypeSolPed() {
      return new FlexBox({
        direction: 'Row',
        alignItems: 'Start',
        visible: '{= %{process>BANFN} !== "" }',
        items: [new ObjectIdentifier({
          title: '{process>BANFN}',
          text: '{process>BNFPO}'
        })]
      });
    },

    /**
     * @function
     * @name _buildTemplateTypeZPEDIDO
     * @description - Construir columna de pedido y posiciÃ³n.
     *
     * @private
     * @param {object} context
     * @param {object} context.context - Contexto del objeto del binding.
     * @returns {sap.m.FlexBox}
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    _buildTemplateTypeZPEDIDO: function _buildTemplateTypeZPEDIDO() {
      return new FlexBox({
        direction: 'Row',
        alignItems: 'Start',
        visible: '{= %{process>EBELN} !== "" }',
        items: [new ObjectIdentifier({
          title: '{process>EBELN}',
          text: '{process>EBELP}'
        })]
      });
    },

    /**
     * @function
     * @name _buildTemplateTypeZMATNR
     * @description - Retornar el Flexbox con el cÃ³digo material y su descripciÃ³n
     *
     * @private
     * @param {object} context
     * @param {object} context.context - Contexto del objeto del binding.
     * @returns {sap.m.FlexBox}
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    _buildTemplateTypeZMATNR: function _buildTemplateTypeZMATNR() {
      return new FlexBox({
        direction: 'Row',
        alignItems: 'Start',
        items: [new ObjectIdentifier({
          // title: '{process>PR_MATNR}',
          // text: '{process>PR_TXZ01}',
          title: '{process>MAT_COMB}',
          text: '{process>TEXT_COMB}'
        }) // new ObjectIdentifier({
        //   visible: '{= %{process>PR_MATNR} === "" }',
        //   title: '{process>POI_MATNR}',
        //   text: '{process>POI_TXZ01}',
        // }),
        ]
      });
    },

    /**
     * @function
     * @name _buildTemplateTypeZCANTIDADES
     * @description - Construir grÃ¡fica de la columna Cantidades
     *
     * @private
     * @param {object} context
     * @param {object} context.context - Contexto del objeto del binding.
     * @returns {sap.m.FlexBox}
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    _buildTemplateTypeZCANTIDADES: function _buildTemplateTypeZCANTIDADES(_ref2) {
      var oContext = _ref2.context;
      return new FlexBox({
        direction: 'Column',
        alignItems: 'Center',
        renderType: 'Bare'
      }).bindAggregation('items', 'process>quantities', function (id, context) {
        var oInfoProgressIndicator = oContext.getProperty(context.sPath);
        return new ProgressIndicator(id, {
          percentValue: oInfoProgressIndicator.percentValue,
          state: oInfoProgressIndicator.state,
          displayValue: oInfoProgressIndicator.displayValue,
          showValue: true,
          displayOnly: true,
          displayAnimation: true
        });
      });
    },

    /**
     * @function
     * @name _buildTemplateTypePR_LFDAT
     * @description - Construir template para el campo PR_LFDAT - Fecha de entraga SP.
     *
     * @private
     * @param {object} context
     * @param {object} context.context - Contexto de la columna
     * @param {string} context.path - Path del campo
     * @returns {sap.m.DatePicker}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _buildTemplateTypePR_LFDAT: function _buildTemplateTypePR_LFDAT(context) {
      return factory._buildDatePicker(_objectSpread(_objectSpread({}, context), {}, {
        visible: VISIBLE_PROP_EXPRESSION_SOLPED
      }));
    },

    /**
     * @function
     * @name _buildTemplateTypePR_EBAKZ
     * @description - Construir template para el campo PR_EBAKZ - Indicador de borrado SP.
     *
     * @private
     * @param {object} context
     * @param {object} context.context - Contexto de la columna
     * @param {string} context.path - Path del campo
     * @returns {sap.m.Switch}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _buildTemplateTypePR_EBAKZ: function _buildTemplateTypePR_EBAKZ(context) {
      return factory._buildSwitch(_objectSpread(_objectSpread({}, context), {}, {
        visible: VISIBLE_PROP_EXPRESSION_SOLPED
      }));
    },

    /**
     * @function
     * @name _buildTemplateTypePR_LOEKZ
     * @description - Construir template para el campo PR_LOEKZ - Concluida SP.
     *
     * @private
     * @param {object} context
     * @param {object} context.context - Contexto de la columna
     * @param {string} context.path - Path del campo
     * @returns {sap.m.Switch}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _buildTemplateTypePR_LOEKZ: function _buildTemplateTypePR_LOEKZ(_ref3) {
      var context = _ref3.context,
          path = _ref3.path;
      return factory._buildSwitch({
        context: context,
        path: path,
        visible: VISIBLE_PROP_EXPRESSION_SOLPED
      });
    },

    /**
     * @function
     * @name _buildTemplateTypePOI_EINDT
     * @description - Construir template para el campo POI_EINDT - Fecha de entraga PED.
     *
     * @private
     * @param {object} context
     * @param {object} context.context - Contexto de la columna
     * @param {string} context.path - Path del campo
     * @returns {sap.m.DatePicker}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _buildTemplateTypePOI_EINDT: function _buildTemplateTypePOI_EINDT(context) {
      return factory._buildDatePicker(_objectSpread(_objectSpread({}, context), {}, {
        visible: VISIBLE_PROP_EXPRESSION_PED
      }));
    },

    /**
     * @function
     * @name _buildTemplateTypePOI_ELIKZ
     * @description - Construir template para el campo POI_ELIKZ - Entrega final - PED.
     *
     * @private
     * @param {object} context
     * @param {object} context.context - Contexto de la columna
     * @param {string} context.path - Path del campo
     * @returns {sap.m.Switch}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _buildTemplateTypePOI_ELIKZ: function _buildTemplateTypePOI_ELIKZ(context) {
      return factory._buildSwitch(_objectSpread(_objectSpread({}, context), {}, {
        visible: VISIBLE_PROP_EXPRESSION_PED
      }));
    },

    /**
     * @function
     * @name _buildTemplateTypePOI_LOEKZ
     * @description - Construir template para el campo POI_LOEKZ - Indicador de borrado - PED.
     *
     * @private
     * @param {object} context
     * @param {object} context.context - Contexto de la columna
     * @param {string} context.path - Path del campo
     * @returns {sap.m.Switch}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _buildTemplateTypePOI_LOEKZ: function _buildTemplateTypePOI_LOEKZ(context) {
      return factory._buildSwitch(_objectSpread(_objectSpread({}, context), {}, {
        path: context.path,
        visible: VISIBLE_PROP_EXPRESSION_PED
      }));
    },

    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

    /**
     * @function
     * @name onShowTextDialog
     * @description - Select item tab bar.
     *
     * @public
     * @returns {void}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    onShowTextDialog: function onShowTextDialog(_ref4, oEvent) {
      var prop = _ref4.prop,
          title = _ref4.title;
      var button = oEvent.getSource();
      var context = button.getBindingContext('process');
      var process = context.getObject();
      var oDefaultMessageDialog = new sap.m.Dialog({
        type: sap.m.DialogType.Message,
        title: this.getMessageTextPool(title),
        content: new sap.m.Text({
          text: process[prop]
        }),
        beginButton: new sap.m.Button({
          type: sap.m.ButtonType.Emphasized,
          text: 'OK',
          press: function press() {
            oDefaultMessageDialog.close();
          }
        })
      });
      oDefaultMessageDialog.attachAfterClose(oDefaultMessageDialog.destroy.bind(oDefaultMessageDialog));
      oDefaultMessageDialog.open();
    },

    /**
     * @function
     * @name _buildSwitch
     * @description - Construir template campo Switch
     *
     * @private
     * @param {object} context
     * @param {object} context.context - Contexto de la columna
     * @param {string} context.path - Path del campo
     * @param {string|boolean} context.visible - Visibilidad del campo
     * @returns {sap.m.Switch}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _buildSwitch: function _buildSwitch(_ref5) {
      var context = _ref5.context,
          path = _ref5.path,
          _ref5$visible = _ref5.visible,
          visible = _ref5$visible === void 0 ? true : _ref5$visible;
      return new Switch({
        customTextOff: 'Off',
        customTextOn: 'On',
        name: context.getProperty('FIELDNAME'),
        state: "{= %{".concat(path, "}  === 'X' }"),
        visible: visible,
        change: function change(oEvent) {
          var oSource = oEvent.getSource();
          var sName = oSource.getName();
          var oContext = oSource.getBindingContext('process');
          var oObject = oContext.getObject();
          oObject["".concat(sName)] = oSource.getState() ? 'X' : '';
          oObject["".concat(sName, "_FLAG")] = 'X';
          oObject.update = true;
          oContext.getModel().updateBindings();
        }
      });
    },
    _buildDatePicker: function _buildDatePicker(_ref6) {
      var context = _ref6.context,
          path = _ref6.path,
          visible = _ref6.visible;
      return new DatePicker({
        displayFormat: 'yyyy-MM-dd',
        name: context.getProperty('FIELDNAME'),
        // value: `{${path}}`,
        value: {
          parts: ["".concat(path)],
          formatter: function formatter(value) {
            if (value === '0000-00-00') {
              return null;
            }

            if (value !== null) {
              return _formatter.formatDateSAP(value === null || value === void 0 ? void 0 : value.split('T')[0], 'DD/MM/yyyy');
            }

            return value;
          }
        },
        valueFormat: 'yyyy-MM-dd',
        visible: visible,
        change: function change(oEvent) {
          var bValid = oEvent.getParameter('valid');
          var oSource = oEvent.getSource();
          var sName = oSource.getName();
          var oContext = oSource.getBindingContext('process');
          var oObject = oContext.getObject();

          if (!bValid) {
            oSource.setValue(null);
            oSource.setValueState('Error');
            oObject[sName] = null;
          } else {
            this.setValueState('None');
            oObject[sName] = oSource.getValue();
          }

          oObject["".concat(sName, "_FLAG")] = 'X';
          oObject.update = true;
          oContext.getModel().updateBindings();
        }
      });
    }
  };
  return factory;
});