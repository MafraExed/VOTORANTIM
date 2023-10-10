"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sigc/formatter/date', 'com/innova/sigc/formatter/yesOrNoText', 'com/innova/sigc/model/process/EntProvEvaluationCriteria', 'com/innova/sigc/model/process/processStatus/useProcessStatus', 'com/innova/sigc/model/process/ValoracionEvaluationCriteria', 'com/innova/sigc/model/offer/offerStatus/useOfferStatus', 'com/innova/sigc/utils/isEmpty', 'sap/m/ColumnListItem', 'sap/m/ObjectIdentifier', 'sap/m/Input', 'sap/m/Text', 'sap/m/VBox', 'sap/ui/core/ValueState'],
/**
 * @function
 * @name qualification
 * @namespace com.innova.sipp.factory.commercialQualification
 * @description - Factory for commercial qualification
 *
 * @private
 * @param {typeof sap.m.Input} Input
 * @param {typeof sap.m.Text} Text
 * @param {typeof sap.m.VBox} VBox
 * @param {typeof sap.ui.core.ValueState} ValueState
 * @param {typeof sap.m.ColumnListItem} ColumnListItem
 * @returns {object}
 *
 * @author Edwin Valencia <evalencia@innovainternacional.biz>
 * @version 1.0.0
 */
function (dateFormatter, yesOrNoTextFormatter, EntProvEvaluationCriteria, useProcessStatus, ValoracionEvaluationCriteria, useOfferStatus, isEmpty, ColumnListItem, ObjectIdentifier, Input, Text, VBox, ValueState) {
  var _factory = {
    /**
     * @function
     * @name createItems
     * @description - Create items for qualification table
     *
     * @public
     * @param {string} sId - column id
     * @param {object} oContext - Context binding
     * @returns {sap.m.ColumnListItem}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    createItems: function createItems(sId, oContext) {
      var _this = this;

      return new ColumnListItem(sId, {
        selected: {
          path: 'selected'
        }
      }).bindAggregation('cells', {
        path: '/columns',
        factory: function factory(id, cellContext) {
          var template = cellContext.getProperty('template');
          var strategy = "_buildTemplate".concat(template);

          if (_factory["".concat(strategy)]) {
            return _factory["".concat(strategy)].call(_this, {
              id: id,
              context: oContext.getObject(),
              options: cellContext.getObject()
            });
          }

          var value = oContext.getProperty("".concat(cellContext.getProperty('name')));
          return new Text(id, {
            text: _this.getResourceBundle().getText(value) || ''
          });
        }
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
     * @param {object} data
     * @param {string} data.id - id
     * @param {object} data.context - context
     * @returns {sap.m.ObjectIdentifier}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildTemplateMatnr: function _buildTemplateMatnr(_ref) {
      var id = _ref.id,
          context = _ref.context;
      return new ObjectIdentifier(id, {
        text: "".concat(context.matnr || ''),
        title: "".concat(context.maktx)
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
     * @returns {sap.m.VBox}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildTemplateCustom: function _buildTemplateCustom(_ref2) {
      var _context$status$get, _context$status, _offerStatus$statusTy, _context$commentsByPo, _context$commentsByPo2, _context$qualificatio, _context$qualificatio2;

      var id = _ref2.id,
          context = _ref2.context,
          options = _ref2.options;
      var entradaProveedor = context.entradaProveedor,
          valoracion = context.valoracion,
          isPrice = context.isPrice;
      var offerStatus = (_context$status$get = (_context$status = context.status) === null || _context$status === void 0 ? void 0 : _context$status.get(options.vendorId)) !== null && _context$status$get !== void 0 ? _context$status$get : {};

      var enabled = _factory._canQualify({
        entradaProveedor: entradaProveedor,
        offerStatus: offerStatus.status,
        processStatus: options.processStatus,
        valoracion: valoracion,
        vendorValue: context[options.name]
      });

      var type = (_offerStatus$statusTy = offerStatus.statusType) === null || _offerStatus$statusTy === void 0 ? void 0 : _offerStatus$statusTy.charAt(0).toUpperCase();
      var statusMetadata = useOfferStatus.getStatusMetadata(offerStatus.status, {
        type: type
      });

      var tooltip = this._i18n.getText("".concat(statusMetadata.text));

      var commentsByPosition = (_context$commentsByPo = (_context$commentsByPo2 = context.commentsByPosition) === null || _context$commentsByPo2 === void 0 ? void 0 : _context$commentsByPo2.get(options.vendorId)) !== null && _context$commentsByPo !== void 0 ? _context$commentsByPo : {};
      var value = (_context$qualificatio = context.qualifications) === null || _context$qualificatio === void 0 ? void 0 : (_context$qualificatio2 = _context$qualificatio.get(options.vendorId)) === null || _context$qualificatio2 === void 0 ? void 0 : _context$qualificatio2.value;
      return new VBox(id, {
        items: [new sap.m.HBox({
          items: [new sap.ui.core.Icon({
            src: statusMetadata.icon,
            color: statusMetadata.color,
            tooltip: tooltip,
            visible: !!offerStatus
          }), new sap.m.ObjectStatus({
            icon: 'sap-icon://comment',
            active: true,
            inverted: false,
            tooltip: '{i18n>0111}',
            visible: !isEmpty(commentsByPosition.comments),
            state: 'Indication05',
            press: this.onShowPositionComments.bind(this, {
              commentsByPosition: commentsByPosition
            })
          })]
        }), _factory._getControlToDisplay.call(this, {
          entradaProveedor: entradaProveedor,
          isPrice: isPrice,
          value: context[options.name]
        }), new Input({
          value: value,
          description: '%',
          enabled: enabled,
          valueState: enabled && isEmpty(value) ? ValueState.Error : ValueState.None,
          placeholder: options.placeholder || this.getResourceBundle().getText('0132'),
          maxLength: 3,
          change: this.onQualificationInputChange.bind(this, {
            options: options
          })
        })]
      });
    },

    /**
     * @function
     * @name _canQualify
     * @description - Check if can qualify
     *
     * @private
     * @param {object} data
     * @param {string} data.entradaProveedor - entrada proveedor
     * @param {string} data.offerStatus - Offer status
     * @param {string} data.processStatus - Process status
     * @param {object} data.valoracion - valoracion
     * @param {object} data.vendorValue - vendor value
     * @returns {Boolean}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _canQualify: function _canQualify(_ref3) {
      var entradaProveedor = _ref3.entradaProveedor,
          offerStatus = _ref3.offerStatus,
          processStatus = _ref3.processStatus,
          valoracion = _ref3.valoracion,
          vendorValue = _ref3.vendorValue;
      var isRejected = useOfferStatus.isPositionRejected(offerStatus);

      if (isRejected) {
        return false;
      }

      var status = useProcessStatus.inNewRound(processStatus) || useProcessStatus.inAdjudication(processStatus) || useProcessStatus.inPurchaseOrder(processStatus);

      if (status) {
        return false;
      }

      var val = valoracion !== ValoracionEvaluationCriteria.X.key;

      if (val) {
        return false;
      }

      return entradaProveedor === EntProvEvaluationCriteria.A.key || entradaProveedor !== EntProvEvaluationCriteria.A.key && !isEmpty(vendorValue);
    },

    /**
     * @function
     * @name _getControlToDisplay
     * @description - Format value
     *
     * @private
     * @param {object} data
     * @param {string} data.entradaProveedor - entrada proveedor
     * @param {string} data.isPrice - Is value a price
     * @param {object} data.value - value
     * @returns {any}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _getControlToDisplay: function _getControlToDisplay(_ref4) {
      var entradaProveedor = _ref4.entradaProveedor,
          isPrice = _ref4.isPrice,
          value = _ref4.value;

      if (isPrice && value) {
        return new sap.m.ObjectNumber({
          number: new Intl.NumberFormat(this.getModel('main').getProperty('/currentLanguage')).format(value.bbwert),
          unit: value.waers,
          visible: !isEmpty(value.bbwert)
        });
      }

      return new Text({
        text: _factory._formatValue({
          entradaProveedor: entradaProveedor,
          value: value
        })
      });
    },

    /**
     * @function
     * @name _formatValue
     * @description - Format value
     *
     * @private
     * @param {object} data
     * @param {string} data.entradaProveedor - entrada proveedor
     * @param {object} data.value - value
     * @returns {any}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _formatValue: function _formatValue(_ref5) {
      var entradaProveedor = _ref5.entradaProveedor,
          _ref5$value = _ref5.value,
          value = _ref5$value === void 0 ? '' : _ref5$value;
      var strategy = {
        D: dateFormatter,
        C: yesOrNoTextFormatter
      };
      return strategy[entradaProveedor] && strategy[entradaProveedor](value) || value;
    }
    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

  };
  return _factory;
});