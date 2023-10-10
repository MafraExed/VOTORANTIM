"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['./ProcessStatus'], function (Status) {
  return {
    /**
     * @function
     * @name getProcessStatusMetadata
     * @description - Get process status metadata
     *
     * @private
     * @param {string} s - Status
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    getStatusMetadata: function getStatusMetadata(s) {
      var status = Object.entries(Status).find(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            value = _ref2[1];

        return value.status === s;
      });

      if (status) {
        var _status = _slicedToArray(status, 2),
            metadata = _status[1];

        return {
          color: metadata.color,
          icon: metadata.icon,
          text: metadata.text
        };
      }

      return {};
    },

    /**
     * @function
     * @name inEvaluation
     * @description - Validate process status in evaluation
     *
     * @private
     * @param {string} s - Process status
     * @returns {boolean}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    inEvaluation: function inEvaluation(s) {
      var evaluation = [Status.EVALUACION_TECNICA.status, Status.EVALUACION_COMERCIAL.status];
      return s.split('').some(function (status) {
        return evaluation.includes(status);
      });
    },

    /**
     * @function
     * @name inNewRound
     * @description - Is process status in new round
     *
     * @private
     * @param {string} s - Process status
     * @returns {boolean}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    inNewRound: function inNewRound(s) {
      var roundsStatus = [Status.RONDA_NEGOCIACION.status, Status.OFERTA_RONDA_NEGOCIACION.status];
      return s.split('').some(function (status) {
        return roundsStatus.includes(status);
      });
    },

    /**
     * @function
     * @name inAdjudication
     * @description - Is process status in adjudication
     *
     * @private
     * @param {string} s - Process status
     * @returns {boolean}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    inAdjudication: function inAdjudication(s) {
      var roundsStatus = [Status.LICITACION_PARCIAL.status, Status.LICITACION_ADJUDICADA.status];
      return s.split('').some(function (status) {
        return roundsStatus.includes(status);
      });
    },

    /**
     * @function
     * @name inPurchaseOrder
     * @description - Is process status in purchase order
     *
     * @private
     * @param {string} s - Process status
     * @returns {boolean}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    inPurchaseOrder: function inPurchaseOrder(s) {
      var purchaseOrder = [Status.ORDEN_DE_COMPRA.status];
      return s.split('').some(function (status) {
        return purchaseOrder.includes(status);
      });
    },
    isAdjudication: function isAdjudication(s) {
      var roundsStatus = [Status.LICITACION_ADJUDICADA.status];
      return s.split('').some(function (status) {
        return roundsStatus.includes(status);
      });
    },
    isPartialAdjudication: function isPartialAdjudication(s) {
      var roundsStatus = [Status.LICITACION_PARCIAL.status];
      return s.split('').some(function (status) {
        return roundsStatus.includes(status);
      });
    }
  };
});