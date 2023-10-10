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
sap.ui.define(['./OfferStatus'], function (Status) {
  return {
    /**
     * GANADOR = 'A'
     * GANADOR_PARCIAL = 'B'
     * RECHAZADO = 'C'
     * RECHAZO_PROVEEDOR = 'D'
     * GANADOR_TOTAL = 'E'
     * RECHAZO_TOTAL = 'F'
     * RECHAZO_TOTAL_PROVEEDOR = 'G'
     * */

    /**
     * @function
     * @name isPositionRejected
     * @description - Is position rejected
     *
     * @private
     * @param {string} s - Status
     * @returns {boolean}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    isPositionRejected: function isPositionRejected(s) {
      return s === Status.RECHAZADO_POSICION_EVALUADOR.status || s === Status.RECHAZO_POSICION_PROVEEDOR.status || s === Status.RECHAZO_TOTAL_EVALUADOR.status || s === Status.RECHAZO_TOTAL_PROVEEDOR.status;
    },

    /**
     * @function
     * @name isPositionWinning
     * @description - Is position winning
     *
     * @private
     * @param {string} s - Status
     * @returns {boolean}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    isPositionWinning: function isPositionWinning(s) {
      return s === Status.GANADOR.status || s === Status.GANADOR_PARCIAL.status || s === Status.GANADOR_TOTAL.status;
    },

    /**
     * @function
     * @name isPartialWinner
     * @description - Is partial winner
     *
     * @private
     * @param {string} s - Status
     * @returns {boolean}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    isPartialWinner: function isPartialWinner(s) {
      return s === Status.GANADOR_PARCIAL.status;
    },

    /**
     * @function
     * @name isTotalWinningOffer
     * @description - Is total winner
     *
     * @private
     * @param {string} s - Status
     * @returns {boolean}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    isTotalWinningOffer: function isTotalWinningOffer(s) {
      return s === Status.GANADOR_TOTAL.status;
    },

    /**
     * @function
     * @name isWinningPosition
     * @description - Is winning position
     *
     * @private
     * @param {string} s - Status
     * @returns {boolean}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    isWinningPosition: function isWinningPosition(s) {
      return s === Status.GANADOR.status;
    },

    /**
     * @function
     * @name isOfferRejected
     * @description - Is offer rejected
     *
     * @private
     * @param {string} s - Status
     * @returns {boolean}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    isOfferRejected: function isOfferRejected(s) {
      return s === Status.RECHAZO_TOTAL_EVALUADOR.status || s === Status.RECHAZO_TOTAL_PROVEEDOR.status;
    },

    /**
     * @function
     * @name isOfferRejectedByEvaluator
     * @description - Is offer rejected by buyer
     *
     * @private
     * @param {string} s - Status
     * @returns {boolean}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    isOfferRejectedByEvaluator: function isOfferRejectedByEvaluator(s) {
      return s === Status.RECHAZO_TOTAL_EVALUADOR.status;
    },

    /**
     * @function
     * @name isPositionRejectedByVendor
     * @description - Is position rejected by vendor
     *
     * @private
     * @param {string} s - Status
     * @returns {boolean}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    isPositionRejectedByVendor: function isPositionRejectedByVendor(s) {
      return s === Status.RECHAZO_POSICION_PROVEEDOR.status;
    },

    /**
     * @function
     * @name isPositionRejectedByEvaluator
     * @description - Is position rejected by vendor
     *
     * @private
     * @param {string} s - Status
     * @returns {boolean}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    isPositionRejectedByEvaluator: function isPositionRejectedByEvaluator(s) {
      return s === Status.RECHAZADO_POSICION_EVALUADOR.status;
    },

    /**
     * @function
     * @name getStatusMetadata
     * @description - Get status metadata
     *
     * @private
     * @param {string} s - Status
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    getStatusMetadata: function getStatusMetadata(s, _ref) {
      var type = _ref.type;
      var status = Object.entries(Status).find(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            value = _ref3[1];

        return value.status === s;
      });

      if (status) {
        var _metadata$type$type$c, _metadata$type, _metadata$type$type, _metadata$type$type$t, _metadata$type2, _metadata$type2$type;

        var _status = _slicedToArray(status, 2),
            metadata = _status[1];

        return {
          color: (_metadata$type$type$c = metadata === null || metadata === void 0 ? void 0 : (_metadata$type = metadata.type) === null || _metadata$type === void 0 ? void 0 : (_metadata$type$type = _metadata$type[type]) === null || _metadata$type$type === void 0 ? void 0 : _metadata$type$type.color) !== null && _metadata$type$type$c !== void 0 ? _metadata$type$type$c : metadata.color,
          icon: metadata.icon,
          text: (_metadata$type$type$t = metadata === null || metadata === void 0 ? void 0 : (_metadata$type2 = metadata.type) === null || _metadata$type2 === void 0 ? void 0 : (_metadata$type2$type = _metadata$type2[type]) === null || _metadata$type2$type === void 0 ? void 0 : _metadata$type2$type.text) !== null && _metadata$type$type$t !== void 0 ? _metadata$type$type$t : metadata.text
        };
      }

      return {};
    }
  };
});