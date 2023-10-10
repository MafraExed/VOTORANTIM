"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

sap.ui.define(['com/innova/sigc/factory/summaryQualification/qualification', 'com/innova/sigc/lib/richTextEditor/editor', 'com/innova/sigc/formatter/formatMessage', 'com/innova/sigc/model/constant', 'com/innova/sigc/model/process/roundsProcessStatus/RoundsProcessStatus', 'com/innova/sigc/model/offer/offerStatus/useOfferStatus', 'com/innova/sigc/model/process/processStatus/useProcessStatus', 'com/innova/sigc/service/http', 'com/innova/sigc/utils/isEmpty', 'com/innova/sigc/utils/keyBy', 'com/innova/sigc/utils/showToast', 'com/innova/vendor/lodash.filter', 'com/innova/vendor/lodash.find', 'com/innova/vendor/lodash.get', 'sap/m/MessageBox', 'sap/ui/core/Fragment', 'sap/ui/model/json/JSONModel', 'sap/ui/model/Sorter'],
/**
 * @class
 * @name Summary.js
 * @description - Handler of the summary qualification for the detail controller
 *
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel
 * @param {typeof sap.ui.model.Sorter} Sorter
 *
 * @returns {object}
 *
 * @author Edwin Valencia <evalencia@innovainternacional.biz>
 * @version 1.0.0
 */
function (factory, editor, formatMessage, constant, RoundsProcessStatus, useOfferStatus, useProcessStatus, http, isEmpty, keyBy, showToast, filter, find, get, MessageBox, Fragment, JSONModel, Sorter) {
  return {
    /* =========================================================== */

    /* begin: event handlers                                       */

    /* =========================================================== */

    /**
     * @function
     * @name onExpandSelection
     * @description - Expand the selection of the table
     *
     * @public
     * @param {object} id - The id of the table
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onExpandSelection: function onExpandSelection(id) {
      var oTreeTable = this.byId(id);
      var selectedIndices = oTreeTable.getSelectedIndices();

      if (isEmpty(selectedIndices)) {
        oTreeTable.expandToLevel(1);
      } else {
        oTreeTable.expand(selectedIndices);
      }
    },

    /**
     * @function
     * @name onCollapseSelection
     * @description - Collapse the selection of the table
     *
     * @public
     * @param {object} id - The id of the table
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onCollapseSelection: function onCollapseSelection(id) {
      var oTreeTable = this.byId(id);
      var selectedIndices = oTreeTable.getSelectedIndices();

      if (isEmpty(selectedIndices)) {
        oTreeTable.collapseAll();
      } else {
        oTreeTable.collapse(selectedIndices);
      }
    },

    /**
     * @function
     * @name onWinnerOfferButtonPress
     * @description - Handler of the winner offer button
     *
     * @public
     * @param {object} context
     * @param {object} context.offerId - The id of the offer
     * @param {object} context.vendorName - The name of the vendor
     * @param {boolean} context.isPartialProcess - Any offer with winning position
     * @param {boolean} context.hasPositionsRejected - Has positions rejected
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onWinnerOfferButtonPress: function onWinnerOfferButtonPress(_ref) {
      var _this = this;

      var offerId = _ref.offerId,
          vendorName = _ref.vendorName,
          isPartialProcess = _ref.isPartialProcess,
          hasPositionsRejected = _ref.hasPositionsRejected;

      if (hasPositionsRejected) {
        showToast(this._i18n.getText('0361'));
        return;
      }

      if (isPartialProcess) {
        showToast(this._i18n.getText('0358'));
        return;
      }

      MessageBox.success(formatMessage(this._i18n.getText('0279'), vendorName), {
        actions: [this._i18n.getText('Commons.0003'), this._i18n.getText('Commons.0004')],
        emphasizedAction: MessageBox.Action.OK,
        onClose: function onClose(sAction) {
          if (sAction === _this._i18n.getText('Commons.0003')) {
            Promise.resolve(_this._oPage.setBusy(true)).then(http.post.bind(_this, "".concat(constant.api.OFFERS_PATH, "/").concat(offerId, "/winner"), {})).then(function () {
              showToast(_this._i18n.getText('Commons.0021'));
            }).then(_this._fetchAPI.bind(_this, _this._numProc)).then(_this._fetchOffers.bind(_this)).then(_this._fetchQualificationSummary.bind(_this)).catch(_this.errorHandler.bind(_this)).finally(_this._oPage.setBusy.bind(_this._oPage, false));
          }
        }
      });
    },

    /**
     * @function
     * @name onDeclineOfferButtonPress
     * @description - Handler of the decline offer button
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onDeclineOfferButtonPress: function onDeclineOfferButtonPress() {
      MessageBox.show(this._i18n.getText('0280'), {
        actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
        emphasizedAction: MessageBox.Action.OK,
        onClose: function onClose(sAction) {
          sap.m.MessageToast.show("Action selected: ".concat(sAction));
        }
      });
    },

    /**
     * @function
     * @name onCantAsigChange
     * @description - Handler of the winner offer button
     *
     * @public
     * @param {object} context
     * @param {object} context.cantOfer - Cantidad ofertada
     * @param {object} oEvent - The event
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onCantAsigChange: function onCantAsigChange(_ref2, oEvent) {
      var cantOfer = _ref2.cantOfer;
      var input =
      /** @type {sap.m.Input} */
      oEvent.getSource();
      var value = +input.getValue();
      var context = input.getBindingContext();
      var path = context.getPath();
      var model =
      /** @type{sap.ui.model.json.JSONModel} */
      context.getModel();

      var _path$split = path.split('qualifications'),
          _path$split2 = _slicedToArray(_path$split, 1),
          rowPath = _path$split2[0];

      var newValue = this._getCantAsignByEvaluator({
        value: value,
        cantOfer: cantOfer
      });

      var menge = model.getProperty("".concat(rowPath, "menge"));

      var cantAsignTotal = this._sumAllCantAsig({
        qualifications: model.getProperty("".concat(rowPath, "qualifications")),
        currentQualification: model.getProperty(path)
      });

      if (cantAsignTotal + newValue > menge) {
        var _model$getProperty;

        showToast(this._i18n.getText('0357'));
        newValue = (_model$getProperty = model.getProperty("".concat(path, "/value"))) !== null && _model$getProperty !== void 0 ? _model$getProperty : 0;
        model.setProperty("".concat(path, "/value"), newValue);
      } else {
        var _updatedCantAsig;

        var updatedCantAsig = model.getProperty("".concat(rowPath, "updatedCantAsig"));
        updatedCantAsig = (_updatedCantAsig = updatedCantAsig) !== null && _updatedCantAsig !== void 0 ? _updatedCantAsig : [];
        updatedCantAsig = [].concat(_toConsumableArray(updatedCantAsig), [{
          offerId: context.getProperty('offerId'),
          processPositionId: context.getProperty('processPositionId'),
          cantAsig: newValue
        }]);
        model.setProperty("".concat(path, "/value"), newValue);
        model.setProperty("".concat(rowPath, "updated"), true);
        model.setProperty("".concat(rowPath, "updatedCantAsig"), updatedCantAsig);
      }

      model.updateBindings(true);
      model.refresh();
    },

    /**
     * @function
     * @name onSaveCantOferByPos
     * @description - Han
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onSaveCantOferByPos: function onSaveCantOferByPos() {
      var _this2 = this;

      Promise.resolve(this._oPage.setBusy(true)).then(this._getUpdatedRowsCantAsig.bind(this)).then(http.post.bind(this, "".concat(constant.api.POSITION_OFFERS_CANT_ASIGN_PATH))).then(function () {
        showToast(_this2._i18n.getText('Commons.0021'));
      }).then(this._fetchAPI.bind(this, this._numProc)).then(this._fetchOffers.bind(this)).then(this._fetchQualificationSummary.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
    },

    /**
     * @function
     * @name onUndoWinningOfferButtonPress
     * @description - Handler of the undo winning offer button
     *
     * @public
     * @param {object} context
     * @param {object} context.offerId - The id of the offer
     * @param {object} context.vendorName - The name of the vendor
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onUndoWinningOfferButtonPress: function onUndoWinningOfferButtonPress(_ref3) {
      var _this3 = this;

      var vendorName = _ref3.vendorName,
          offerId = _ref3.offerId;
      MessageBox.confirm(formatMessage(this._i18n.getText('0310'), vendorName), {
        actions: [this._i18n.getText('Commons.0003'), this._i18n.getText('Commons.0004')],
        emphasizedAction: MessageBox.Action.OK,
        onClose: function onClose(sAction) {
          if (sAction === _this3._i18n.getText('Commons.0003')) {
            Promise.resolve(_this3._oPage.setBusy(true)).then(http.post.bind(_this3, "".concat(constant.api.OFFERS_RESET_PATH), [{
              angnr: offerId
            }])).then(function () {
              showToast(_this3._i18n.getText('Commons.0021'));
            }).then(_this3._fetchAPI.bind(_this3, _this3._numProc)).then(_this3._fetchOffers.bind(_this3)).then(_this3._fetchQualificationSummary.bind(_this3)).catch(_this3.errorHandler.bind(_this3)).finally(_this3._oPage.setBusy.bind(_this3._oPage, false));
          }
        }
      });
    },

    /**
     * @function
     * @name onNewRoundDialog
     * @description - Handler of the new round dialog
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onNewRoundDialog: function onNewRoundDialog() {
      Promise.resolve(this._oPage.setBusy(true)).then(this._fetchOffers.bind(this)).then(this._buildOffersFromRound.bind(this)).then(this._openNewRoundDialog.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
    },

    /**
     * @function
     * @name onNewRound
     * @description - Handler of the new round
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onNewRound: function onNewRound() {
      var _this4 = this;

      MessageBox.confirm(this._i18n.getText('0346'), {
        actions: [this._i18n.getText('Commons.0003'), this._i18n.getText('Commons.0004')],
        emphasizedAction: MessageBox.Action.OK,
        onClose: function onClose(sAction) {
          if (sAction === _this4._i18n.getText('Commons.0003')) {
            var _this4$byId$getDateVa;

            Promise.resolve(_this4._oNewRoundDialog.setBusy(true)).then(_this4._getSelectedItems.bind(_this4, _this4.byId('newRoundTable'))).then(_this4._buildReqNewRound.bind(_this4, {
              message: _this4._oNewRoundEditor.getContent(),
              fechaLimite: (_this4$byId$getDateVa = _this4.byId('limOfertaNewRound').getDateValue()) === null || _this4$byId$getDateVa === void 0 ? void 0 : _this4$byId$getDateVa.toISOString()
            })).then(http.post.bind(http, "".concat(constant.api.PROCESS_PATH, "/").concat(_this4._numProc, "/new-round"))).then(_this4._fetchAPI.bind(_this4, _this4._numProc)).then(_this4._fetchOffers.bind(_this4)).then(_this4._fetchQualificationSummary.bind(_this4)).then(function () {
              showToast(_this4._i18n.getText('Commons.0021'));

              _this4._oNewRoundDialog.close();
            }).catch(_this4.errorHandler.bind(_this4)).finally(_this4._oNewRoundDialog.setBusy.bind(_this4._oNewRoundDialog, false));
          }
        }
      });
    },

    /* =========================================================== */

    /* finish: event handlers                                      */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: internal methods                                     *
    /* =========================================================== */

    /**
     * @function
     * @name _fetchQualificationSummary
     * @description - Fetch API to get the summary qualification
     *
     * @private
     * @returns {Promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _fetchQualificationSummary: function _fetchQualificationSummary() {
      var process = this._oFormModel.getData();

      var waers = process.waers,
          conversionCurrency = process.conversionCurrency,
          offers = process.offers;

      if (isEmpty(offers)) {
        return Promise.resolve();
      }

      var promise = this._fetchWithCurrentWaers({
        waers: waers
      });

      if (!isEmpty(conversionCurrency)) {
        promise = this._fetchWithConversionCurrency({
          conversionCurrency: conversionCurrency,
          offers: offers,
          conversionDate: process.conversionDate
        });
      }

      return promise.then(http.post.bind(http, "".concat(constant.api.PROCESS_PATH, "/").concat(this._numProc, "/").concat(constant.api.GLOBAL_CALIFICATION))).then(this._handleResponseQualificationSummary.bind(this));
    },

    /**
     * @function
     * @name _fetchWithCurrentWaers
     * @description -Fetch API to get the global calification with the current waers
     *
     * @private
     * @param {object} params - The params of the fetch
     * @param {string} params.waers - Current waers
     * @returns {Promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _fetchWithCurrentWaers: function _fetchWithCurrentWaers(_ref4) {
      var waers = _ref4.waers;
      return Promise.resolve({
        currencyBase: waers,
        rates: [{
          currency: waers,
          value: 1
        }]
      });
    },

    /**
     * @function
     * @name _handleResponseQualificationSummary
     * @description -Handle response of the API to get the summary qualification and build the model
     *
     * @private
     * @param {object} params - The params of the fetch
     * @param {object} params.data - Response of the API
     * @returns {void} - Nothing to return
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _handleResponseQualificationSummary: function _handleResponseQualificationSummary(_ref5) {
      var data = _ref5.data;

      this._buildSummaryQualifications(this._oFormModel.getData(), data);
    },

    /**
     * @function
     * @name _buildSummaryQualifications
     * @description - Build commercial qualifications
     *
     * @private
     * @param {object} data - Data to build the qualifications
     * @returns {void} - Nothing to return
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildSummaryQualifications: function _buildSummaryQualifications(data, globalQualifications) {
      var offers = filter(get(data, 'offers', []), {
        estaOfer: true
      });
      var processPositions = get(data, 'positions', []);
      var roundProcess = get(data, 'roundsProcess', []);
      var waers = get(data, 'waers', '');
      var conversionCurrency = get(data, 'conversionCurrency', '');
      var round = find(roundProcess, {
        estatusRonda: RoundsProcessStatus.ABIERTO.status
      });

      var _this$_getDefaultQual = this._getDefaultQualificationColumns(),
          _this$_getDefaultQual2 = _slicedToArray(_this$_getDefaultQual, 3),
          summaryColumns = _this$_getDefaultQual2[2];

      var processStatus = get(data, 'status', '');
      var isWinningProcess = useProcessStatus.isAdjudication(processStatus);
      var isPartialProcess = useProcessStatus.isPartialAdjudication(processStatus);
      this.byId('roundTitle').setText("".concat(this._i18n.getText('0311'), " #").concat(round.round));

      this._buildSummaryQualificationsByHeader({
        conversionCurrency: conversionCurrency,
        globalQualifications: globalQualifications,
        isPartialProcess: isPartialProcess,
        isWinningProcess: isWinningProcess,
        offers: offers,
        processStatus: processStatus,
        waers: waers
      });

      this._buildSummaryQualificationsByPos({
        columns: summaryColumns,
        globalQualifications: globalQualifications,
        isPartialProcess: isPartialProcess,
        isWinningProcess: isWinningProcess,
        offers: offers,
        processPositions: processPositions,
        processStatus: processStatus,
        round: round
      });
    },

    /**
     * @function
     * @name _buildSummaryQualificationsByHeader
     * @description - build the qualifications by header
     *
     * @private
     * @param {object} context - Context
     * @param {object[]} context.conversionCurrency - Conversion currency
     * @param {object[]} context.globalQualifications - Global qualifications
     * @param {boolean} context.isPartialProcess - Is partial process
     * @param {boolean} context.isWinningProcess - Is winning process
     * @param {object[]} context.offers - Offers
     * @param {string} context.processStatus - Process status
     * @param {string} context.waers - Waers
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildSummaryQualificationsByHeader: function _buildSummaryQualificationsByHeader(_ref6) {
      var _this5 = this;

      var conversionCurrency = _ref6.conversionCurrency,
          globalQualifications = _ref6.globalQualifications,
          isPartialProcess = _ref6.isPartialProcess,
          isWinningProcess = _ref6.isWinningProcess,
          offers = _ref6.offers,
          processStatus = _ref6.processStatus,
          waers = _ref6.waers;
      var columns = [{
        label: this._i18n.getText('0176'),
        name: 'name',
        template: 'name'
      }];

      var globalMax = this._getGlobalQualificationMax(globalQualifications);

      var globalQualificationsKeyed = keyBy(globalQualifications, 'id');
      var rows = [{
        name: this._i18n.getText('0248')
      }, {
        name: this._i18n.getText('0249')
      }, {
        name: this._i18n.getText('0250')
      }, {
        name: this._i18n.getText('0251')
      }, {
        name: this._i18n.getText('0356')
      }, {
        name: this._i18n.getText('Commons.0036')
      }];
      offers.forEach(function (offer) {
        var _globalQualifications, _rows, _rows2, _rows3, _rows4, _rows5, _rows6;

        var _ref7 = (_globalQualifications = globalQualificationsKeyed[offer.angnr]) !== null && _globalQualifications !== void 0 ? _globalQualifications : {},
            global = _ref7.global;

        var vendorId = get(offer, 'vendor.idProv', '');
        var positions = get(offer, 'positions', []);
        var offerStatus = get(offer, 'status', '');
        var offerStatusType = get(offer, 'statusEvaluatorType', '');
        var column = {
          offerId: offer.angnr,
          vendorId: vendorId,
          label: get(offer, 'vendor.name1', ''),
          name: vendorId,
          template: 'Custom',
          offerStatus: offerStatus,
          processStatus: processStatus
        };
        columns.push(column);
        var status = {
          offerStatus: offerStatus,
          offerStatusType: offerStatusType,
          processStatus: processStatus
        };
        rows = [_objectSpread(_objectSpread({}, (_rows = rows) === null || _rows === void 0 ? void 0 : _rows[0]), {}, _defineProperty({}, column.name, [{
          type: 'Qualifications',
          value: get(global, 'tecnical', 0),
          status: status,
          highest: globalMax.tecnical
        }])), _objectSpread(_objectSpread({}, (_rows2 = rows) === null || _rows2 === void 0 ? void 0 : _rows2[1]), {}, _defineProperty({}, column.name, [{
          type: 'Qualifications',
          value: get(global, 'comercial', 0),
          status: status,
          highest: globalMax.comercial
        }])), _objectSpread(_objectSpread({}, (_rows3 = rows) === null || _rows3 === void 0 ? void 0 : _rows3[2]), {}, _defineProperty({}, column.name, [{
          type: 'Qualifications',
          value: get(global, 'total', 0),
          status: status,
          highest: globalMax.total
        }])), _objectSpread(_objectSpread({}, (_rows4 = rows) === null || _rows4 === void 0 ? void 0 : _rows4[3]), {}, _defineProperty({
          posProc: _this5.getResourceBundle().getText('0133')
        }, column.name, [{
          type: 'Total',
          value: get(global, 'offerValue', 0),
          offerId: offer.angnr,
          vendorName: get(offer, 'vendor.name1', ''),
          status: status,
          waers: waers || conversionCurrency
        }])), _objectSpread(_objectSpread({}, (_rows5 = rows) === null || _rows5 === void 0 ? void 0 : _rows5[4]), {}, _defineProperty({
          posProc: _this5.getResourceBundle().getText('0133')
        }, column.name, [{
          type: 'PurchaseOrder',
          value: get(offer, 'purchaseOrder', ''),
          offerId: offer.angnr,
          vendorName: get(offer, 'vendor.name1', ''),
          status: status
        }])), _objectSpread(_objectSpread({}, (_rows6 = rows) === null || _rows6 === void 0 ? void 0 : _rows6[5]), {}, _defineProperty({}, column.name, [{
          type: 'Operations',
          offerId: offer.angnr,
          vendorName: get(offer, 'vendor.name1', ''),
          status: status,
          isTotalWinningOffer: useOfferStatus.isTotalWinningOffer(offerStatus),
          isPartialOffer: !isEmpty(positions) && !positions.every(function (_ref8) {
            var s = _ref8.status;
            return isEmpty(s) || useOfferStatus.isPositionRejected(s);
          }),
          isWinningOfferForPositions: !isEmpty(positions) && positions.every(function (_ref9) {
            var s = _ref9.status;
            return useOfferStatus.isWinningPosition(s);
          }),
          isWinningProcess: isWinningProcess,
          isPartialProcess: isPartialProcess,
          isOfferRejected: useOfferStatus.isOfferRejected(offerStatus),
          hasPositionsRejected: !isEmpty(positions) && positions.some(function (_ref10) {
            var s = _ref10.status;
            return useOfferStatus.isPositionRejected(s);
          }),
          hasPurchaseOrder: useProcessStatus.inPurchaseOrder(processStatus)
        }]))];
      });
      var panel =
      /** @type {sap.m.Panel} */
      this.byId('summaryHeaderPanel');
      panel.setHeaderText("".concat(this.getResourceBundle().getText('0082'), " (").concat(globalQualifications.length, ")"));
      this.byId('summaryHeaderTreeTable').bindColumns({
        path: '/columns',
        sorter: new Sorter('id'),
        factory: factory.bindColumnsToTreeTable.bind(this)
      }).bindRows({
        path: '/rows'
      }).setModel(new JSONModel({
        columns: columns,
        rows: rows
      }));
    },

    /**
     * @function
     * @name _buildSummaryQualificationsByPos
     * @description - build the qualifications by position
     *
     * @private
     * @param {object} context - Context
     * @param {object[]} context.columns - Position columns
     * @param {object[]} context.globalQualifications - Global qualifications
     * @param {object} context.isWinningProcess - Is winning process
     * @param {object[]} context.offers - Offers
     * @param {object[]} context.processPositions - Process positions
     * @param {string} context.processStatus - Process status
     * @param {object} context.round - Round process
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildSummaryQualificationsByPos: function _buildSummaryQualificationsByPos(_ref11) {
      var _this6 = this;

      var columns = _ref11.columns,
          globalQualifications = _ref11.globalQualifications,
          isWinningProcess = _ref11.isWinningProcess,
          offers = _ref11.offers,
          processPositions = _ref11.processPositions,
          processStatus = _ref11.processStatus,
          round = _ref11.round;
      var rows = JSON.parse(JSON.stringify(processPositions));
      var globalQualificationsKeyed = keyBy(globalQualifications, 'id');
      offers.forEach(function (offer) {
        var _globalQualifications2;

        var _ref12 = (_globalQualifications2 = globalQualificationsKeyed[offer.angnr]) !== null && _globalQualifications2 !== void 0 ? _globalQualifications2 : {},
            _ref12$positions = _ref12.positions,
            pos = _ref12$positions === void 0 ? [] : _ref12$positions;

        var vendorId = get(offer, 'vendor.idProv', '');
        var pricesPerRound = get(offer, 'pricesPerRound', []);
        var positions = get(offer, 'positions', []);
        var offerStatus = get(offer, 'status', '');
        var offerStatusType = get(offer, 'statusEvaluatorType', '');
        var column = {
          offerId: offer.angnr,
          vendorId: vendorId,
          label: get(offer, 'vendor.name1', ''),
          name: vendorId,
          template: 'Custom',
          offerStatus: offerStatus,
          processStatus: processStatus
        };
        columns.push(column);
        rows = rows.map(function (position) {
          var _position$qualificati, _position$qualificati2, _position$qualificati3, _objectSpread10, _position$qualificati4, _position$qualificati5, _objectSpread13;

          var price = find(pricesPerRound, {
            positionId: position.id,
            roundId: round.roundId
          });
          var posOffer = find(positions, {
            positionId: position.id
          });
          var posGlobal = find(pos, {
            processPositionId: position.id
          });
          var status = {
            offerStatus: offerStatus,
            offerStatusType: offerStatusType,
            positionStatus: posOffer === null || posOffer === void 0 ? void 0 : posOffer.status,
            positionStatusType: posOffer === null || posOffer === void 0 ? void 0 : posOffer.statusEvaluatorType,
            processStatus: processStatus
          };
          return _objectSpread(_objectSpread({}, position), {}, (_objectSpread13 = {}, _defineProperty(_objectSpread13, "".concat(vendorId), [{
            type: 'Qualifications',
            value: get(posGlobal, 'califications.total', 0),
            status: status
          }]), _defineProperty(_objectSpread13, "qualifications", [_objectSpread(_objectSpread({}, position === null || position === void 0 ? void 0 : (_position$qualificati = position.qualifications) === null || _position$qualificati === void 0 ? void 0 : _position$qualificati[0]), {}, _defineProperty({
            posProc: _this6.getResourceBundle().getText('0133')
          }, "".concat(vendorId), [{
            type: 'Qualifications',
            value: get(posGlobal, 'califications.comercial', 0),
            status: status
          }])), _objectSpread(_objectSpread({}, position === null || position === void 0 ? void 0 : (_position$qualificati2 = position.qualifications) === null || _position$qualificati2 === void 0 ? void 0 : _position$qualificati2[1]), {}, _defineProperty({
            posProc: _this6.getResourceBundle().getText('0130')
          }, "".concat(vendorId), [{
            type: 'Qualifications',
            value: get(posGlobal, 'califications.tecnical', 0),
            status: status
          }])), _objectSpread(_objectSpread({}, position === null || position === void 0 ? void 0 : (_position$qualificati3 = position.qualifications) === null || _position$qualificati3 === void 0 ? void 0 : _position$qualificati3[2]), {}, (_objectSpread10 = {
            posProc: _this6.getResourceBundle().getText('0140')
          }, _defineProperty(_objectSpread10, "".concat(vendorId), [{
            type: 'price',
            price: price,
            menge: position.menge,
            status: status
          }
          /*  price && `${position.menge * price.bbwert} ${price.waers}`,
          price && `${price.bbwert} ${price.waers}`, */
          ]), _defineProperty(_objectSpread10, "type", 'price'), _objectSpread10)), _objectSpread(_objectSpread({}, position === null || position === void 0 ? void 0 : (_position$qualificati4 = position.qualifications) === null || _position$qualificati4 === void 0 ? void 0 : _position$qualificati4[3]), {}, _defineProperty({
            posProc: _this6.getResourceBundle().getText('0144')
          }, "".concat(vendorId), [{
            type: 'cantOfer',
            cantOfer: posOffer === null || posOffer === void 0 ? void 0 : posOffer.cantOfer,
            meins: position.meins,
            status: status
          }])), _objectSpread(_objectSpread({}, position === null || position === void 0 ? void 0 : (_position$qualificati5 = position.qualifications) === null || _position$qualificati5 === void 0 ? void 0 : _position$qualificati5[4]), {}, _defineProperty({
            posProc: _this6.getResourceBundle().getText('0145'),
            type: 'cantAsig'
          }, "".concat(vendorId), [{
            type: 'cantAsig',
            value: posOffer === null || posOffer === void 0 ? void 0 : posOffer.cantAsig,
            cantOfer: posOffer === null || posOffer === void 0 ? void 0 : posOffer.cantOfer,
            isWinningProcess: isWinningProcess,
            offerId: offer.angnr,
            processPositionId: position.id,
            status: status
          }]))]), _objectSpread13));
        });
      });
      this.byId('summaryPositionTreeTable').unbindColumns().unbindRows().bindColumns({
        path: '/columns',
        sorter: new Sorter('id'),
        factory: factory.bindColumnsToTreeTable.bind(this)
      }).bindRows({
        path: '/rows',
        parameters: {
          arrayNames: ['qualifications'],
          numberOfExpandedLevels: '/numberOfExpandedLevels',
          rootLevel: 1
        }
      }).setModel(new JSONModel({
        columns: columns,
        rows: rows
      }));
    },

    /**
     * @function
     * @name _getUpdatedRowsCantAsig
     * @description - Get the updated rows cant asig
     *
     * @private
     * @returns {object[]}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _getUpdatedRowsCantAsig: function _getUpdatedRowsCantAsig() {
      var _filter;

      var model = this.byId('summaryPositionTreeTable').getModel();
      var rows = model.getProperty('/rows');
      var updatedRows = (_filter = filter(rows, {
        updated: true
      })) !== null && _filter !== void 0 ? _filter : [];

      if (!updatedRows.length) {
        throw new Error(this._i18n.getText('Commons.0035'));
      }

      return updatedRows.reduce(function (acc, row) {
        return acc.concat(row.updatedCantAsig);
      }, []);
    },

    /**
     * @function
     * @name _buildOffersFromRound
     * @description - Build the offers from round
     *
     * @private
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildOffersFromRound: function _buildOffersFromRound() {
      var offers = this._oFormModel.getProperty('/offers');

      var filteredOffers = filter(offers, {
        estaOfer: true
      }).filter(function (_ref13) {
        var status = _ref13.status;
        return !useOfferStatus.isPositionRejected(status);
      });

      if (!filteredOffers.length) {
        throw new Error(this._i18n.getText('0313'));
      }

      return {
        offers: filteredOffers,
        hasPartialWinner: filteredOffers.some(function (_ref14) {
          var status = _ref14.status;
          return useOfferStatus.isPartialWinner(status);
        })
      };
    },

    /**
     * @function
     * @name _openNewRoundDialog
     * @description - Open the new round dialog
     *
     * @private
     * @param {object} context - The context
     * @param {object[]} context.offers - The offers
     * @param {boolean} context.hasPartialWinner - Has partial winner
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _openNewRoundDialog: function _openNewRoundDialog(_ref15) {
      var _this7 = this;

      var offers = _ref15.offers,
          hasPartialWinner = _ref15.hasPartialWinner;
      var oView = this.getView();
      Fragment.load({
        id: oView.getId(),
        name: 'com.innova.sigc.view.biddingProcess.dialog.qualification.NewRoundDialog',
        controller: this
      }).then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control; // connect dialog to the root view of this component (models, lifecycle)

        oView.addDependent(oDialog);
        oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
        _this7._oNewRoundDialog = oDialog;

        _this7._oNewRoundDialog.setModel(new JSONModel({
          offers: offers,
          hasPartialWinner: hasPartialWinner
        }));

        _this7.byId('limOfertaNewRound').setMinDate(new Date()); // remove all editors


        editor.removeEditorManager();
        setTimeout(function () {
          // Initialize editor oferentes
          _this7._oNewRoundEditor = editor.initializeQuillEditor.call(_this7, {
            container: _this7.byId('editorNewRound').getDomRef(),
            placeholder: _this7._i18n.getText('0314')
          });

          _this7._oNewRoundEditor.render();
        });
        oDialog.attachAfterClose(oDialog.destroy.bind(oDialog));
        oDialog.open();
      });
    },

    /**
     * @function
     * @name _buildReqNewRound
     * @description - Build the request to create a new round
     *
     * @private
     * @param {object} context - The context
     * @param {string} context.message - The message email
     * @param {string} context.fechaLimite - The date limit
     * @param {object[]} offers - The offers
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildReqNewRound: function _buildReqNewRound(_ref16, offers) {
      var message = _ref16.message,
          fechaLimite = _ref16.fechaLimite;
      return {
        fechaLimite: fechaLimite,
        message: message,
        vendors: offers.map(function (item) {
          return item.getBindingContext().getProperty('vendorId');
        })
      };
    },

    /**
     * @function
     * @name _getCantAsignByEvaluator
     * @description - Get the cant asign by evaluator
     *
     * @private
     * @param {object} context - The context
     * @param {number} context.value - Value of the cell
     * @param {string} context.cantOfer - Cant ofer
     * @returns {number}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _getCantAsignByEvaluator: function _getCantAsignByEvaluator(_ref17) {
      var value = _ref17.value,
          cantOfer = _ref17.cantOfer;
      var newValue = +value;

      if (value < 0) {
        newValue = 0;
      } else if (value > +cantOfer) {
        newValue = +cantOfer;
      }

      return newValue;
    },

    /**
     * @function
     * @name _sumAllCantAsig
     * @description - Sum all cant asig
     *
     * @private
     * @param {object} context - The context
     * @param {object[]} context.qualifications - Qualifications
     * @param {object} context.currentQualification - Current qualification
     * @returns {number}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _sumAllCantAsig: function _sumAllCantAsig(_ref18) {
      var _ref18$qualifications = _ref18.qualifications,
          qualifications = _ref18$qualifications === void 0 ? [] : _ref18$qualifications,
          _ref18$currentQualifi = _ref18.currentQualification,
          currentQualification = _ref18$currentQualifi === void 0 ? {} : _ref18$currentQualifi;
      var cantAsing = find(qualifications, {
        type: 'cantAsig'
      });
      return Object.entries(cantAsing).filter(function (_ref19) {
        var _ref20 = _slicedToArray(_ref19, 2),
            v = _ref20[1];

        return Array.isArray(v);
      }).filter(function (_ref21) {
        var _ref22 = _slicedToArray(_ref21, 2),
            v = _ref22[1];

        return currentQualification.offerId !== v[0].offerId && currentQualification.processPositionId !== v[0].processPositionId;
      }).reduce(function (acc, _ref23) {
        var _cantAsignVendor$valu;

        var _ref24 = _slicedToArray(_ref23, 2),
            v = _ref24[1];

        var _v = _slicedToArray(v, 1),
            cantAsignVendor = _v[0];

        var ca = (_cantAsignVendor$valu = cantAsignVendor.value) !== null && _cantAsignVendor$valu !== void 0 ? _cantAsignVendor$valu : 0;
        return acc + parseInt(ca, 10);
      }, 0);
    },

    /**
     * @function
     * @name _getGlobalQualificationMax
     * @description - Get global qualification max
     *
     * @private
     * @param {object[]} globalQualifications - Global qualifications
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _getGlobalQualificationMax: function _getGlobalQualificationMax(globalQualifications) {
      return globalQualifications.map(function (qualification) {
        return qualification.global;
      }).reduce(function (prev, cur) {
        var comercial = (prev === null || prev === void 0 ? void 0 : prev.comercial) > cur.comercial ? prev.comercial : cur.comercial;
        var tecnical = (prev === null || prev === void 0 ? void 0 : prev.tecnical) > cur.tecnical ? prev.tecnical : cur.tecnical;
        var total = (prev === null || prev === void 0 ? void 0 : prev.total) > cur.total ? prev.total : cur.total;
        return {
          comercial: comercial,
          tecnical: tecnical,
          total: total
        };
      }, {});
    }
    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

  };
});