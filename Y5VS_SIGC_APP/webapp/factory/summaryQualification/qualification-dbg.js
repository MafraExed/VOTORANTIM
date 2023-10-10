"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sigc/model/offer/offerStatus/useOfferStatus', 'com/innova/sigc/utils/isEmpty', 'sap/m/Button', 'sap/m/FlexBox', 'sap/m/HBox', 'sap/m/Input', 'sap/m/Label', 'sap/m/ObjectIdentifier', 'sap/m/ObjectNumber', 'sap/m/Text', 'sap/m/VBox', 'sap/ui/core/CustomData', 'sap/ui/table/Column', 'sap/ui/unified/Currency'],
/**
 * @function
 * @name qualification
 * @namespace com.innova.sipp.factory.summaryQualification
 * @description - Factory for summary qualification
 *
 * @private
 * @param {typeof sap.m.FlexBox} FlexBox
 * @param {typeof sap.m.HBox} HBox
 * @param {typeof sap.m.Input} Input
 * @param {typeof sap.m.Label} Label
 * @param {typeof sap.m.ObjectIdentifier} ObjectIdentifier
 * @param {typeof sap.m.ObjectNumber} ObjectNumber
 * @param {typeof sap.m.Text} Text
 * @param {typeof sap.m.VBox} VBox
 * @param {typeof sap.ui.core.CustomData} CustomData
 * @param {typeof sap.ui.table.Column} Column
 * @param {typeof sap.ui.unified.Currency} Currency
 * @returns {object}
 *
 * @author Edwin Valencia <evalencia@innovainternacional.biz>
 * @version 1.0.0
 */
function (useOfferStatus, isEmpty, Button, FlexBox, HBox, Input, Label, ObjectIdentifier, ObjectNumber, Text, VBox, CustomData, Column, Currency) {
  var _factory = {
    /**
     * @function
     * @name createItems
     * @description - Create items for qualification table
     *
     * @public
     * @param {string} id - column id
     * @param {object} oContext - Context binding
     * @returns {sap.ui.table.Column}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    bindColumnsToTreeTable: function bindColumnsToTreeTable(id, oContext) {
      var context = oContext.getObject();
      var templateName = oContext.getProperty('template');
      var strategy = "_buildTemplate".concat(templateName);
      var template = new Text({
        wrapping: true,
        text: "{".concat(oContext.getProperty('name'), "}")
      });

      if (_factory["".concat(strategy)]) {
        template = _factory["".concat(strategy)].call(this, {
          id: id,
          context: oContext.getObject()
        });
      }

      return new Column(id, {
        label: new Label({
          text: context.label,
          tooltip: context.label,
          wrapping: true
        }),
        template: template,
        autoResizable: true,
        width: 'auto',
        minWidth: 150,
        customData: [new CustomData({
          key: '1',
          value: 1
        })]
      });
    },

    /* =========================================================== */

    /* begin: internal methods                                     *
    /* =========================================================== */

    /**
     * @function
     * @name _buildTemplateMatnr
     * @description - Build template for matnr
     *
     * @private
     * @returns {sap.m.ObjectIdentifier}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildTemplateMatnr: function _buildTemplateMatnr() {
      return new ObjectIdentifier({
        text: '{= %{matnr} || "" }',
        title: '{maktx}'
      });
    },

    /**
     * @function
     * @name _buildTemplatemenge
     * @description - Build template for menge
     *
     * @private
     * @returns {sap.m.ObjectNumber}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildTemplatemenge: function _buildTemplatemenge() {
      return new ObjectNumber({
        number: '{menge}',
        numberUnit: '{meins}'
      });
    },

    /**
     * @function
     * @name _buildTemplateTipo
     * @description - Build template for tipo
     *
     * @private
     * @returns {sap.m.Text}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildTemplateTipo: function _buildTemplateTipo() {
      return new Text({
        text: '{= %{tipo} === "C" ? %{i18n>0133} : %{i18n>0162} }'
      });
    },

    /**
     * @function
     * @name _buildTemplateQualifications
     * @description - Build template for tipo
     *
     * @private
     * @param {object} oContext - Context binding
     * @returns {sap.m.HBox}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildTemplateQualifications: function _buildTemplateQualifications(_ref) {
      var factoryId = _ref.factoryId,
          context = _ref.context;
      return new HBox(factoryId, {
        alignItems: sap.m.FlexAlignItems.Center,
        items: [new sap.ui.core.Icon({
          src: 'sap-icon://message-success',
          color: '#107e3e',
          visible: context.status === 'E'
        }), new ObjectNumber({
          number: {
            path: "".concat(context.name)
          },
          unit: '%'
        })]
      });
    },

    /**
     * @function
     * @name _buildTemplateCustom
     * @description - Build template for Custom item
     *
     * @private
     * @param {object} data
     * @param {string} data.id - id
     * @param {object} data.context - context
     * @param {object} data.options - context
     * @returns {sap.m.FlexBox}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildTemplateCustom: function _buildTemplateCustom(_ref2) {
      var _this = this;

      var context = _ref2.context;
      return new FlexBox({
        height: '100%',
        width: '100%',
        direction: sap.m.FlexDirection.Column,
        justifyContent: sap.m.FlexJustifyContent.Center,
        alignItems: sap.m.FlexAlignItems.Center
      }).bindAggregation('items', {
        path: "".concat(context.name),
        factory: function factory(factoryId, cellContext) {
          var _ref3 = cellContext.getObject() || {},
              _ref3$type = _ref3.type,
              type = _ref3$type === void 0 ? '' : _ref3$type,
              value = _ref3.value;

          var nameStrategy = type.charAt(0).toUpperCase() + type.slice(1);
          var strategy = "_build".concat(nameStrategy, "Cell");

          if (_factory["".concat(strategy)]) {
            return _factory["".concat(strategy)].call(_this, {
              factoryId: factoryId,
              context: cellContext
            });
          }

          return new Text(factoryId, {
            text: value
          });
        }
      });
    },

    /**
     * @function
     * @name _buildPriceCell
     * @description - Build template for price cell
     *
     * @private
     * @returns {sap.m.HBox}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildPriceCell: function _buildPriceCell(_ref4) {
      var factoryId = _ref4.factoryId,
          context = _ref4.context;

      var _context$getObject = context.getObject(),
          price = _context$getObject.price,
          menge = _context$getObject.menge,
          status = _context$getObject.status;

      var statusIcon = _factory._getStatusIcon.call(this, status);

      return new HBox(factoryId, {
        alignItems: sap.m.FlexAlignItems.Center,
        items: [statusIcon, price ? new VBox({
          items: [new Currency({
            value: price.bbwert * menge,
            currency: price.waers,
            maxPrecision: 2,
            useSymbol: false
          }), new Currency({
            value: price.bbwert,
            currency: price.waers,
            maxPrecision: 2,
            useSymbol: false
          })]
        }) : new Text()]
      });
    },

    /**
     * @function
     * @name _buildCantOferCell
     * @description - Build template for cantOfer cell
     *
     * @private
     * @returns {sap.m.HBox}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildCantOferCell: function _buildCantOferCell(_ref5) {
      var factoryId = _ref5.factoryId,
          context = _ref5.context;

      var _context$getObject2 = context.getObject(),
          _context$getObject2$c = _context$getObject2.cantOfer,
          cantOfer = _context$getObject2$c === void 0 ? '' : _context$getObject2$c,
          meins = _context$getObject2.meins,
          status = _context$getObject2.status;

      var statusIcon = _factory._getStatusIcon.call(this, status);

      return new HBox(factoryId, {
        alignItems: sap.m.FlexAlignItems.Center,
        items: [statusIcon, new ObjectNumber({
          number: new Intl.NumberFormat(this.getModel('main').getProperty('/currentLanguage')).format(cantOfer),
          unit: meins,
          visible: !isEmpty(cantOfer)
        })]
      });
    },

    /**
     * @function
     * @name _buildCantAsigCell
     * @description - Build template for cantAsig cell
     *
     * @private
     * @returns {sap.m.Input | sap.m.Text | sap.m.HBox}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildCantAsigCell: function _buildCantAsigCell(_ref6) {
      var factoryId = _ref6.factoryId,
          context = _ref6.context;

      var _context$getObject3 = context.getObject(),
          isWinningProcess = _context$getObject3.isWinningProcess,
          value = _context$getObject3.value,
          cantOfer = _context$getObject3.cantOfer,
          status = _context$getObject3.status;

      var statusIcon = _factory._getStatusIcon.call(this, status);

      return new HBox(factoryId, {
        alignItems: sap.m.FlexAlignItems.Center,
        items: [statusIcon, isWinningProcess ? new Text({
          text: value
        }) : new Input({
          placeholder: '{i18n>0145}',
          value: value,
          type: sap.m.InputType.Number,
          editable: !isWinningProcess && !useOfferStatus.isPositionRejected(status.positionStatus) && !isEmpty(cantOfer),
          change: this.onCantAsigChange.bind(this, {
            cantOfer: cantOfer
          })
        })]
      });
    },

    /**
     * @function
     * @name _buildQualificationsCell
     * @description - Build template for qualifications cell
     *
     * @private
     * @param {object} oContext - Context binding
     * @returns {sap.m.HBox}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildQualificationsCell: function _buildQualificationsCell(_ref7) {
      var factoryId = _ref7.factoryId,
          context = _ref7.context;

      var _context$getObject4 = context.getObject(),
          value = _context$getObject4.value,
          status = _context$getObject4.status,
          highest = _context$getObject4.highest;

      var statusIcon = _factory._getStatusIcon.call(this, status);

      return new HBox(factoryId, {
        alignItems: sap.m.FlexAlignItems.Center,
        height: '100%',
        justifyContent: sap.m.FlexJustifyContent.Center,
        width: '100%',
        items: [statusIcon, new ObjectNumber({
          number: new Intl.NumberFormat(this.getModel('main').getProperty('/currentLanguage')).format(value),
          unit: '%',
          state: highest === value && value !== 0 ? sap.ui.core.ValueState.Success : sap.ui.core.ValueState.None
        })]
      });
    },

    /**
     * @function
     * @name _buildTotalCell
     * @description - Build template for qualifications cell
     *
     * @private
     * @param {object} oContext - Context binding
     * @returns {sap.m.HBox}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildTotalCell: function _buildTotalCell(_ref8) {
      var factoryId = _ref8.factoryId,
          context = _ref8.context;

      var _context$getObject5 = context.getObject(),
          value = _context$getObject5.value,
          status = _context$getObject5.status,
          waers = _context$getObject5.waers;

      var statusIcon = _factory._getStatusIcon.call(this, status);

      return new HBox(factoryId, {
        alignItems: sap.m.FlexAlignItems.Center,
        height: '100%',
        justifyContent: sap.m.FlexJustifyContent.Center,
        width: '100%',
        items: [statusIcon, new Currency({
          value: value,
          currency: waers,
          maxPrecision: 2,
          useSymbol: false
        })]
      });
    },

    /**
     * @function
     * @name _buildPurchaseOrderCell
     * @description - Build template for purchaseOrder cell
     *
     * @private
     * @param {object} oContext - Context binding
     * @returns {sap.m.HBox}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildPurchaseOrderCell: function _buildPurchaseOrderCell(_ref9) {
      var factoryId = _ref9.factoryId,
          context = _ref9.context;

      var _context$getObject6 = context.getObject(),
          value = _context$getObject6.value,
          offerId = _context$getObject6.offerId,
          vendorName = _context$getObject6.vendorName;

      return new HBox(factoryId, {
        alignItems: sap.m.FlexAlignItems.Center,
        height: '100%',
        justifyContent: sap.m.FlexJustifyContent.SpaceAround,
        width: '100%',
        items: [new Text({
          text: value
        }), new Button({
          tooltip: '{i18n>0422}',
          icon: 'sap-icon://sys-cancel-2',
          type: 'Reject',
          visible: !isEmpty(value),
          press: this.onDeletePurchaseOrder.bind(this, {
            value: value,
            offerId: offerId,
            vendorName: vendorName
          })
        })]
      });
    },

    /**
     * @function
     * @name _buildOperationsCell
     * @description - Build template for operations cell
     *
     * @private
     * @param {object} oContext - Context binding
     * @returns {sap.m.HBox}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildOperationsCell: function _buildOperationsCell(_ref10) {
      var factoryId = _ref10.factoryId,
          context = _ref10.context;
      var object = context.getObject();
      var offerId = object.offerId,
          vendorName = object.vendorName,
          isWinningProcess = object.isWinningProcess,
          isPartialProcess = object.isPartialProcess;
      return new HBox(factoryId, {
        alignItems: sap.m.FlexAlignItems.Center,
        items: [new Button({
          tooltip: '{i18n>0277}',
          icon: 'sap-icon://competitor',
          type: 'Accept',
          visible: !object.isOfferRejected && (!isWinningProcess || isPartialProcess),
          press: this.onWinnerOfferButtonPress.bind(this, {
            offerId: offerId,
            vendorName: vendorName,
            isPartialProcess: isPartialProcess,
            hasPositionsRejected: object.hasPositionsRejected
          })
        }), new Button({
          tooltip: '{i18n>0309}',
          icon: 'sap-icon://decline',
          type: 'Reject',
          visible: !object.isOfferRejected && (object.isTotalWinningOffer || object.isPartialOffer || object.isWinningOfferForPositions) && (!object.hasPurchaseOrder || object.isPartialOffer),
          press: this.onUndoWinningOfferButtonPress.bind(this, {
            offerId: offerId,
            vendorName: vendorName
          })
        }), new Button({
          tooltip: '{i18n>0288}',
          icon: 'sap-icon://create',
          visible: !object.isOfferRejected && (object.isTotalWinningOffer || object.isPartialOffer || object.isWinningOfferForPositions) && (!object.hasPurchaseOrder || object.isPartialOffer),
          press: this.onCreateOrderButtonPress.bind(this, {
            offerId: offerId
          })
        })]
      });
    },

    /**
     * @function
     * @name _getStatusIcon
     * @description - Get status icon
     *
     * @private
     * @param {object} status - Status of the offer
     * @returns {sap.ui.core.Icon}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _getStatusIcon: function _getStatusIcon() {
      var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var statusType = (status === null || status === void 0 ? void 0 : status.offerStatusType) || (status === null || status === void 0 ? void 0 : status.positionStatusType);
      var type = statusType === null || statusType === void 0 ? void 0 : statusType.charAt(0).toUpperCase();
      var statusMetadata = useOfferStatus.getStatusMetadata((status === null || status === void 0 ? void 0 : status.offerStatus) || (status === null || status === void 0 ? void 0 : status.positionStatus), {
        type: type
      });
      var icon;

      if (statusMetadata) {
        var tooltip = this._i18n.getText("".concat(statusMetadata.text));

        icon = new sap.ui.core.Icon({
          src: statusMetadata.icon,
          color: statusMetadata.color,
          tooltip: tooltip,
          visible: !!status
        });
      }

      return icon;
    }
    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

  };
  return _factory;
});