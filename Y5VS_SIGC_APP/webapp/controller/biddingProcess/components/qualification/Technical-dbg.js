"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sigc/factory/technicalQualification/qualification', 'com/innova/sigc/model/constant', 'com/innova/sigc/model/process/LevelEvaluationCriteria', 'com/innova/sigc/model/process/TypesEvaluationCriteria', 'com/innova/sigc/service/http', 'com/innova/vendor/lodash.filter', 'com/innova/vendor/lodash.find', 'com/innova/vendor/lodash.get', 'sap/ui/model/json/JSONModel', 'sap/ui/model/Sorter'],
/**
 * @class
 * @name Qualification.js
 * @description - Handler of the qualification for the detail controller
 *
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel
 * @param {typeof sap.ui.model.Sorter} Sorter
 *
 * @returns {object}
 *
 * @author Edwin Valencia <evalencia@innovainternacional.biz>
 * @version 1.0.0
 */
function (qualificationFactory, constant, LevelEvaluationCriteria, TypesEvaluationCriteria, http, filter, find, get, JSONModel, Sorter) {
  return {
    /* =========================================================== */

    /* begin: event handlers                                       */

    /* =========================================================== */

    /* =========================================================== */

    /* finish: event handlers                                      */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: internal methods                                     *
    /* =========================================================== */

    /**
     * @function
     * @name _fetchTechnicalQualifications
     * @description - Fetch API to get the technical qualification
     *
     * @private
     * @returns {promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _fetchTechnicalQualifications: function _fetchTechnicalQualifications() {
      var _this = this;

      return http.get("".concat(constant.api.PROCESS_PATH, "/").concat(this._numProc, "/").concat(constant.api.OFFERS_PATH)).then(function (_ref) {
        var data = _ref.data;

        var process = _this._oFormModel.getData();

        _this._buildTechnicalQualifications(_objectSpread(_objectSpread({}, process), {}, {
          offers: data
        }));

        _this._oFormModel.setProperty('/offers', data);
      });
    },

    /**
     * @function
     * @name _buildTechnicalQualifications
     * @description - Build the qualifications
     *
     * @private
     * @param {object} data - Data to build the qualifications
     * @returns {void} - Nothing to return
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildTechnicalQualifications: function _buildTechnicalQualifications(data) {
      var offers = filter(get(data, 'offers', []), {
        estaOfer: true
      });
      var processStatus = get(data, 'status', '');
      var processPositions = get(data, 'positions', []);
      var evaluationCriteria = get(data, 'evaluationCriteria', []);
      var evaluationCriteriaFiltered = filter(evaluationCriteria, {
        tipo: TypesEvaluationCriteria.T
      });

      var _this$_getDefaultQual = this._getDefaultQualificationColumns(),
          _this$_getDefaultQual2 = _slicedToArray(_this$_getDefaultQual, 2),
          headerColumn = _this$_getDefaultQual2[0],
          positionColumn = _this$_getDefaultQual2[1];
      /* TODO: Hace falta filtrar por el campo 'user': Que es el evaluador tÃ©cnico que inicio sesiÃ³n */


      this._buildTechnicalQualificationsByHeader({
        evaluationCriteria: evaluationCriteriaFiltered,
        headerColumn: headerColumn,
        offers: offers,
        processStatus: processStatus
      });

      this._buildTechnicalQualificationsByPos({
        evaluationCriteria: evaluationCriteriaFiltered,
        offers: offers,
        positionColumn: positionColumn,
        processPositions: processPositions,
        processStatus: processStatus
        /*      roundProcess, */

      });
    },

    /**
     * @function
     * @name _buildTechnicalQualificationsByHeader
     * @description - build the qualifications by header
     *
     * @private
     * @param {object} context - Context
     * @param {object[]} context.headerColumn - Position columns
     * @param {object[]} context.evaluationCriteria - Evaluation criteria
     * @param {object[]} context.offers - Offers
     * @param {string} context.processStatus - Process status
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildTechnicalQualificationsByHeader: function _buildTechnicalQualificationsByHeader(_ref2) {
      var _this2 = this;

      var evaluationCriteria = _ref2.evaluationCriteria,
          headerColumn = _ref2.headerColumn,
          offers = _ref2.offers,
          processStatus = _ref2.processStatus;
      var columns = JSON.parse(JSON.stringify(headerColumn));
      var evaluationCriteriaFiltered = filter(evaluationCriteria, {
        indCabPos: LevelEvaluationCriteria.C.key
      });

      var rows = this._mappedOffers({
        offers: offers,
        rows: evaluationCriteriaFiltered.map(this._mapEvaluationCriteria)
      });

      offers.forEach(function (offer) {
        var headerCriteria = get(offer, 'headerCriteria', []);
        var vendorId = get(offer, 'vendor.idProv', '');
        var column = {
          offerId: offer.angnr,
          vendorId: vendorId,
          label: get(offer, 'vendor.name1', ''),
          name: vendorId,
          template: 'Custom',
          processStatus: processStatus
        };
        headerCriteria.forEach(function (criteria) {
          var row = find(rows, {
            criteriaId: criteria.evaluationCriteriaId
          });

          _this2._addPositionCriteriaToRow({
            criteria: criteria,
            offerId: offer.angnr,
            row: row,
            vendorId: vendorId
          });
        });
        columns.push(column);
      });
      var table =
      /** @type {sap.m.Table} */
      this.byId('technicalQualificationTableByHeader');
      var panel =
      /** @type {sap.m.Panel} */
      this.byId('techQualificationPanel');
      panel.setHeaderText("".concat(this.getResourceBundle().getText('0082'), " (").concat(rows.length, ")"));
      table.bindItems({
        path: '/rows',
        sorter: new Sorter('posId'),
        factory: qualificationFactory.createItems.bind(this)
      }).setModel(new JSONModel({
        rows: rows,
        columns: columns
      }));
    },

    /**
     * @function
     * @name _buildTechnicalQualificationsByPos
     * @description - build the qualifications by position
     *
     * @private
     * @param {object} context - Context
     * @param {object[]} context.positionColumn - Position columns
     * @param {object[]} context.evaluationCriteria - Evaluation criteria
     * @param {object[]} context.offers - Offers
     * @param {object[]} context.processPositions - Process positions
     * @param {string} context.processStatus - Process status
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildTechnicalQualificationsByPos: function _buildTechnicalQualificationsByPos(_ref3) {
      var _this3 = this;

      var evaluationCriteria = _ref3.evaluationCriteria,
          offers = _ref3.offers,
          positionColumn = _ref3.positionColumn,
          processPositions = _ref3.processPositions,
          processStatus = _ref3.processStatus;
      var columns = JSON.parse(JSON.stringify(positionColumn));
      var evaluationCriteriaFiltered = filter(evaluationCriteria, {
        indCabPos: LevelEvaluationCriteria.P.key
      });

      var rows = this._mappedOffers({
        offers: offers,
        rows: this._mergeEvaluationCriteriaWithProcessPositions({
          evaluationCriteria: evaluationCriteriaFiltered,
          processPositions: processPositions
        }),
        isPosition: true
      });

      offers.forEach(function (offer) {
        var offerPositions = get(offer, 'positions', []);
        var positionCriteria = get(offer, 'positionCriteria', []);
        var vendorId = get(offer, 'vendor.idProv', '');
        var column = {
          offerId: offer.angnr,
          vendorId: vendorId,
          label: get(offer, 'vendor.name1', ''),
          name: vendorId,
          template: 'Custom',
          processStatus: processStatus
        };
        offerPositions.forEach(function (position) {
          var rowsFiltered = filter(rows, {
            posId: position.positionId
          });
          rowsFiltered.forEach(function (el) {
            var _row$status, _row$offers, _row$offers2;

            var row = el;
            row["cantOfer_".concat(vendorId)] = position.cantOfer;
            row["cantAsig_".concat(vendorId)] = position.cantAsig;
            row["diasEntrega_".concat(vendorId)] = position.diasEntrega;
            row["diasGarantia_".concat(vendorId)] = position.diasGarantia; // Status

            (_row$status = row.status) !== null && _row$status !== void 0 ? _row$status : row.status = new Map();
            row.status.set(vendorId, {
              status: position.status,
              statusType: offer.statusEvaluatorType || position.statusEvaluatorType
            }); // Offer

            var mappedOffer = (_row$offers = row.offers) === null || _row$offers === void 0 ? void 0 : _row$offers.get(vendorId);
            (_row$offers2 = row.offers) === null || _row$offers2 === void 0 ? void 0 : _row$offers2.set(vendorId, _objectSpread(_objectSpread({}, mappedOffer), {}, {
              status: position.status,
              statusType: position.statusEvaluatorType
            }));
          });
        });
        positionCriteria.forEach(function (criteria) {
          var row = find(rows, {
            posId: criteria.positionId,
            criteriaId: criteria.evaluationCriteriaId
          });

          _this3._addPositionCriteriaToRow({
            row: row,
            criteria: criteria,
            vendorId: vendorId,
            offerId: offer.angnr
          });
        });
        columns.push(column);
      });
      var table =
      /** @type {sap.m.Table} */
      this.byId('technicalQualificationTableByPos');
      table.bindItems({
        path: '/rows',
        sorter: new Sorter('posId'),
        factory: qualificationFactory.createItems.bind(this)
      }).setModel(new JSONModel({
        rows: rows,
        columns: columns
      }));
    }
    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

  };
});