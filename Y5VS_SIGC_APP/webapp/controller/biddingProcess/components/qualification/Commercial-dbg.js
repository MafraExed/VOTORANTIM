"use strict";

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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sigc/factory/commercialQualification/roundHistory', 'com/innova/sigc/factory/commercialQualification/qualification', 'com/innova/sigc/lib/richTextEditor/editor', 'com/innova/sigc/model/constant', 'com/innova/sigc/model/process/roundsProcessStatus/RoundsProcessStatus', 'com/innova/sigc/model/process/EntProvEvaluationCriteria', 'com/innova/sigc/model/process/LevelEvaluationCriteria', 'com/innova/sigc/model/process/TypesEvaluationCriteria', 'com/innova/sigc/model/offer/offerStatus/useOfferStatus', 'com/innova/sigc/service/http', 'com/innova/sigc/utils/keyBy', 'com/innova/sigc/utils/parseUniversalDate', 'com/innova/sigc/utils/isEmpty', 'com/innova/sigc/utils/isStatusTypeC', 'com/innova/sigc/utils/isStatusTypeT', 'com/innova/sigc/utils/showToast', 'com/innova/vendor/lodash.filter', 'com/innova/vendor/lodash.find', 'com/innova/vendor/lodash.get', 'sap/ui/core/Fragment', 'sap/ui/core/ValueState', 'sap/ui/model/json/JSONModel', 'sap/ui/model/Sorter'],
/**
 * @class
 * @name Commercial.js
 * @description - Handler of the commercial qualification for the detail controller
 *
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel
 * @param {typeof sap.ui.model.Sorter} Sorter
 * @param {typeof sap.ui.core.ValueState} ValueState
 * @param {typeof sap.ui.core.Fragment} Fragment
 *
 * @returns {object}
 *
 * @author Edwin Valencia <evalencia@innovainternacional.biz>
 * @version 1.0.0
 */
function (roundHistoryFactory, qualificationFactory, editor, constant, RoundsProcessStatus, EntProvEvaluationCriteria, LevelEvaluationCriteria, TypesEvaluationCriteria, useOfferStatus, http, keyBy, parseUniversalDate, isEmpty, isStatusTypeC, isStatusTypeT, showToast, filter, find, get, Fragment, ValueState, JSONModel, Sorter) {
  return {
    /* =========================================================== */

    /* begin: event handlers                                       */

    /* =========================================================== */

    /**
     * @function
     * @name onSaveQualificationByHeader
     * @description - Save the qualification by header
     *
     * @public
     * @param {object} id - The id of the table
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onSaveQualificationByHeader: function onSaveQualificationByHeader(id) {
      Promise.resolve(this._oPage.setBusy(true)).then(this._getItemsUpdatedQualification.bind(this, id)).then(this._buildQualificationRequest.bind(this)).then(http.update.bind(http, constant.api.HEADER_CRITERIA)).then(this._updateStateQualification.bind(this)).then(this._fetchAPI.bind(this, this._numProc)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
    },

    /**
     * @function
     * @name onSaveQualificationByPos
     * @description - Save the qualification by position
     *
     * @public
     * @param {object} id - Target id
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onSaveQualificationByPos: function onSaveQualificationByPos(id) {
      Promise.resolve(this._oPage.setBusy(true)).then(this._getItemsUpdatedQualification.bind(this, id)).then(this._buildQualificationRequestByPosition.bind(this)).then(this._updateStateQualification.bind(this)).then(this._fetchAPI.bind(this, this._numProc)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
    },

    /**
     * @function
     * @name onQualificationInputChange
     * @description - Save the qualification
     *
     * @public
     * @param {object} context - Context of the event
     * @param {object} context.options - Options of the event
     * @param {object} oEvent - Event of the event
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onQualificationInputChange: function onQualificationInputChange(_ref, oEvent) {
      var _object$qualification, _object$qualification2;

      var options = _ref.options;
      var oSource =
      /** @type {sap.m.Input} */
      oEvent.getSource();
      oSource.setValueState(ValueState.None);
      var value = oSource.getValue();

      if (!isEmpty(value) && !/^[0-9]\d?$|^100$/.test("".concat(value))) {
        value = null;
        oSource.setValue(null);
        oSource.setValueState(ValueState.Error);
      }

      var item =
      /** @type {sap.m.ColumnListItem} */
      oSource.getParent().getParent();
      var object =
      /** @type {object} */
      item.getBindingContext().getObject();
      object.isUpdated = true;
      var qualifications = object === null || object === void 0 ? void 0 : (_object$qualification = object.qualifications) === null || _object$qualification === void 0 ? void 0 : _object$qualification.get(options.vendorId);
      object === null || object === void 0 ? void 0 : (_object$qualification2 = object.qualifications) === null || _object$qualification2 === void 0 ? void 0 : _object$qualification2.set(options.vendorId, _objectSpread(_objectSpread({}, qualifications), {}, {
        value: value,
        updated: true
      }));
    },

    /**
     * @function
     * @name onCommercialPositionSelectionChange
     * @description - Select the commercial position
     *
     * @public
     * @param {sap.ui.base.Event} oEvent - An Event object consisting of an id, a source and a map of parameters.
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onCommercialPositionSelectionChange: function onCommercialPositionSelectionChange(oEvent) {
      var listItem = oEvent.getParameter('listItem');
      var selected = oEvent.getParameter('selected');
      var context = listItem.getBindingContext();
      var model = context.getModel();
      var posProc = context.getProperty('posProc');
      var rows = model.getProperty('/rows');
      var newRows = rows.map(function (item) {
        var row = _objectSpread({}, item);

        row.selected = selected ? row.posProc === posProc : false;
        return row;
      });
      model.setProperty('/rows', newRows);
    },

    /* ======= begin: Reject/Reactivate Position Offers ======= */

    /**
     * @function
     * @name onReactivatePositionDialog
     * @description - Handler of the reactivate position
     *
     * @public
     * @param {string} id - id table
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onReactivatePositionDialog: function onReactivatePositionDialog(id) {
      var _this = this;

      Promise.resolve(this._oPage.setBusy(true)).then(this._getItemsSelectedQualification.bind(this, id)).then(function (selectedItems) {
        var items = _this._validateOffersOrPosToRejectOrReactivate({
          selectedItems: selectedItems,
          fnSome: _this._isPosOfferRejectedByCommercialEvaluator
        });

        if (!items.length) {
          return Promise.reject(new Error(_this._i18n.getText('0268')));
        }

        return items;
      }).then(this._openReactivatePositionDialog.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
    },

    /**
     * @function
     * @name onReactivatePosition
     * @description - Handler of the reactivate position button
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onReactivatePosition: function onReactivatePosition() {
      var _this2 = this;

      Promise.resolve(this._oRejectPositionDialog.setBusy(true)).then(this._getSelectedItems.bind(this, this.byId('reactivatePositionTable'))).then(this._buildRequestToRejectOrReactivatePosition.bind(this, undefined)).then(http.post.bind(http, constant.api.POSITION_OFFERS_REACTIVATE_PATH)).then(this._fetchCommercialQualifications.bind(this)).then(function () {
        showToast(_this2._i18n.getText('Commons.0021'));

        _this2._oRejectPositionDialog.close();
      }).catch(this.errorHandler.bind(this)).finally(this._oRejectPositionDialog.setBusy.bind(this._oRejectPositionDialog, false));
    },

    /**
     * @function
     * @name onRejectPositionDialog
     * @description - Handler of the reject position dialog
     *
     * @public
     * @param {string} id - id table
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onRejectPositionDialog: function onRejectPositionDialog(id) {
      var _this3 = this;

      Promise.resolve(this._oPage.setBusy(true)).then(this._getItemsSelectedQualification.bind(this, id)).then(function (selectedItems) {
        var items = _this3._validateOffersOrPosToRejectOrReactivate({
          selectedItems: selectedItems,
          fnSome: _this3._canRejectPositionOffer
        });

        if (!items.length) {
          return Promise.reject(new Error(_this3._i18n.getText('0269')));
        }

        return items;
      }).then(this._openRejectPositionDialog.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
    },

    /**
     * @function
     * @name onRejectPosition
     * @description - Handler of the reject position button
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onRejectPosition: function onRejectPosition() {
      var _this4 = this;

      Promise.resolve(this._oRejectPositionDialog.setBusy(true)).then(this._getSelectedItems.bind(this, this.byId('rejectPositionTable'))).then(this._buildRequestToRejectOrReactivatePosition.bind(this, this._oRejectPositionEditor.getContent())).then(http.post.bind(http, constant.api.POSITION_OFFERS_REJECT_PATH)).then(this._fetchCommercialQualifications.bind(this)).then(function () {
        showToast(_this4._i18n.getText('Commons.0021'));

        _this4._oRejectPositionDialog.close();
      }).catch(this.errorHandler.bind(this)).finally(this._oRejectPositionDialog.setBusy.bind(this._oRejectPositionDialog, false));
    },

    /* ======= finish: Reject/Reactivate Position Offers ======= */

    /* ======= begin: Reject/Reactivate Offers ======= */

    /**
     * @function
     * @name onRejectOffersDialog
     * @description - Handler of the reject offer dialog
     *
     * @public
     * @param {string} id - id table
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onRejectOffersDialog: function onRejectOffersDialog(id) {
      var _this5 = this;

      Promise.resolve(this._oPage.setBusy(true)).then(this._getItemsSelectedQualification.bind(this, id)).then(function (selectedItems) {
        var items = _this5._validateOffersOrPosToRejectOrReactivate({
          selectedItems: selectedItems,
          fnSome: _this5._canRejectOffer
        });

        if (!items.length) {
          return Promise.reject(new Error(_this5._i18n.getText('0274')));
        }

        return items;
      }).then(this._openRejectOffersDialog.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
    },

    /**
     * @function
     * @name onRejectOffers
     * @description - Handler of the reject offers button
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onRejectOffers: function onRejectOffers() {
      var _this6 = this;

      Promise.resolve(this._oRejectOfferDialog.setBusy(true)).then(this._getSelectedItems.bind(this, this.byId('rejectOffersTable'))).then(this._buildRequestToRejectOrReactivateOffers.bind(this, undefined)).then(http.post.bind(http, constant.api.OFFERS_REJECT_PATH)).then(this._fetchCommercialQualifications.bind(this, this._numProc)).then(function () {
        showToast(_this6._i18n.getText('Commons.0021'));

        _this6._oRejectOfferDialog.close();
      }).catch(this.errorHandler.bind(this)).finally(this._oRejectOfferDialog.setBusy.bind(this._oRejectOfferDialog, false));
    },

    /**
     * @function
     * @name onReactivateOffersDialog
     * @description - Handler of the reactivate position
     *
     * @public
     * @param {string} id - id table
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onReactivateOffersDialog: function onReactivateOffersDialog(id) {
      var _this7 = this;

      Promise.resolve(this._oPage.setBusy(true)).then(this._getItemsSelectedQualification.bind(this, id)).then(function (selectedItems) {
        var items = _this7._validateOffersOrPosToRejectOrReactivate({
          selectedItems: selectedItems,
          fnSome: _this7._isOfferRejectedByCommercialEvaluator
        });

        if (!items.length) {
          return Promise.reject(new Error(_this7._i18n.getText('0273')));
        }

        return items;
      }).then(this._openReactivateOffersDialog.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
    },

    /**
     * @function
     * @name onReactivateOffers
     * @description - Handler of the reactivate position button
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onReactivateOffers: function onReactivateOffers() {
      var _this8 = this;

      Promise.resolve(this._oReactivateOffersDialog.setBusy(true)).then(this._getSelectedItems.bind(this, this.byId('reactivateOffersTable'))).then(this._buildRequestToRejectOrReactivateOffers.bind(this, undefined)).then(http.post.bind(http, constant.api.OFFERS_REACTIVATE_PATH)).then(this._fetchCommercialQualifications.bind(this)).then(function () {
        showToast(_this8._i18n.getText('Commons.0021'));

        _this8._oReactivateOffersDialog.close();
      }).catch(this.errorHandler.bind(this)).finally(this._oReactivateOffersDialog.setBusy.bind(this._oReactivateOffersDialog, false));
    },

    /* ======= finish: Reject/Reactivate Offers ======= */

    /* ======= begin: Comments Position Offers ======= */

    /**
     * @function
     * @name onCommentPositionDialog
     * @description - Handler of the comment position dialog
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onCommentPositionDialog: function onCommentPositionDialog(id) {
      Promise.resolve(this._oPage.setBusy(true)).then(this._getItemsSelectedQualification.bind(this, id)).then(this._openCommentPositionDialogDialog.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
    },

    /**
     * @function
     * @name onCommentPosition
     * @description - Handler of the comment position button
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onCommentPosition: function onCommentPosition() {
      var _this9 = this;

      Promise.resolve(this._oCommentPositionDialog.setBusy(true)).then(this._getSelectedItems.bind(this, this.byId('commentPositionTable'))).then(this._buildRequestToRejectOrReactivatePosition.bind(this, this._oCommentPositionEditor.getContent())).then(http.post.bind(http, constant.api.POSITION_OFFERS_COMMENT_PATH)).then(this._fetchCommercialQualifications.bind(this)).then(function () {
        showToast(_this9._i18n.getText('Commons.0021'));

        _this9._oCommentPositionDialog.close();
      }).catch(this.errorHandler.bind(this)).finally(this._oCommentPositionDialog.setBusy.bind(this._oCommentPositionDialog, false));
    },

    /**
     * @function
     * @name onSaveConversionDate
     * @description - Handler of the save conversion date button
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onSaveConversionDate: function onSaveConversionDate() {
      var _this10 = this;

      var conversionDate = this.byId('conversionDateDP').getDateValue();
      var conversionDateString = conversionDate.toISOString();

      var currentConversionDate = this._oFormModel.getProperty('/conversionDate');

      if (conversionDateString !== currentConversionDate) {
        Promise.resolve(this._oPage.setBusy(true)).then(http.update.bind(http, "".concat(constant.api.PROCESS_PATH, "/").concat(this._numProc), {
          conversionDate: conversionDateString
        })).then(this._callTabsStrategy.bind(this)).then(function () {
          showToast(_this10._i18n.getText('Commons.0021'));
        }).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
      }
    },

    /* ======= finish: Comments Position Offers ======= */

    /**
     * @function
     * @name onRoundHistoryButtonPress
     * @description - Handler of the round history button
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onRoundHistoryButtonPress: function onRoundHistoryButtonPress() {
      var _this11 = this;

      var processPositions = this._oFormModel.getProperty('/positions');

      var columns = [{
        label: this._i18n.getText('0083'),
        name: 'posProc',
        template: 'PosProc'
      }, {
        label: this._i18n.getText('0039'),
        name: 'matnr',
        template: 'Matnr'
      }];
      var rows = processPositions.map(function (position) {
        return {
          posId: position.id,
          posProc: position.posProc,
          matnr: position.matnr,
          maktx: position.maktx
        };
      });

      this._buildRoundHistory({
        columns: columns,
        rows: rows
      });

      var oView = this.getView();
      Fragment.load({
        id: oView.getId(),
        name: 'com.innova.sigc.view.biddingProcess.dialog.qualification.RoundHistory',
        controller: this
      }).then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control; // connect dialog to the root view of this component (models, lifecycle)

        oView.addDependent(oDialog);
        oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
        oDialog.attachAfterClose(oDialog.destroy.bind(oDialog));

        var table =
        /** @type {sap.ui.table.TreeTable} */
        _this11.byId('roundHistoryTable');

        table.unbindColumns().unbindRows().bindColumns({
          path: '/columns',
          factory: roundHistoryFactory.createColumns.bind(_this11)
        }).bindRows({
          path: '/rows',
          parameters: {
            arrayNames: ['roundHistory'],
            numberOfExpandedLevels: '/numberOfExpandedLevels',
            rootLevel: 1
          }
        }).setModel(new JSONModel({
          columns: columns,
          rows: rows
        }));
        oDialog.open();
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
     * @name _fetchCommercialQualifications
     * @description - Fetch API to get the commercial qualification
     *
     * @private
     * @returns {promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _fetchCommercialQualifications: function _fetchCommercialQualifications() {
      var _this12 = this;

      return http.get("".concat(constant.api.PROCESS_PATH, "/").concat(this._numProc, "/").concat(constant.api.OFFERS_PATH)).then(function (_ref2) {
        var data = _ref2.data;
        _this12._oConversionCurrency = null;

        var process = _this12._oFormModel.getData();

        var conversionCurrency = process.conversionCurrency;
        var promise = Promise.resolve({
          data: data
        });

        if (!isEmpty(conversionCurrency)) {
          promise = _this12._fetchCommercialQualificationsWithConversionCurrency({
            conversionCurrency: conversionCurrency,
            conversionDate: process.conversionDate,
            offers: data
          });
        }

        return promise;
      }).then(this._handleResCommercialQualifications.bind(this));
    },

    /**
     * @function
     * @name _fetchCommercialQualificationsWithConversionCurrency
     * @description - Fetch API to get the commercial qualification with conversion currency
     *
     * @private
     * @param {object} context - Context
     * @param {object} context.conversionCurrency - Conversion currency
     * @param {object} context.conversionDate - Conversion date
     * @param {object[]} context.offers - Offers
     * @returns {promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _fetchCommercialQualificationsWithConversionCurrency: function _fetchCommercialQualificationsWithConversionCurrency(_ref3) {
      var _this13 = this;

      var conversionCurrency = _ref3.conversionCurrency,
          conversionDate = _ref3.conversionDate,
          offers = _ref3.offers;
      return this._fetchWithConversionCurrency({
        conversionCurrency: conversionCurrency,
        offers: offers,
        conversionDate: conversionDate
      }).then(http.post.bind(http, "".concat(constant.api.PROCESS_PATH, "/").concat(this._numProc, "/comercial-calification"))).then(function (res) {
        var keyedOffers = keyBy(res.data, 'angnr');
        var keyedConversionCurrency = keyBy(_this13._oConversionCurrency.rates, 'currency');
        return {
          data: offers.map(function (offer) {
            var _keyedOffers$offer$an;

            return _objectSpread(_objectSpread({}, offer), {}, {
              pricesPerRound: (_keyedOffers$offer$an = keyedOffers[offer.angnr]) === null || _keyedOffers$offer$an === void 0 ? void 0 : _keyedOffers$offer$an.pricesPerRound.map(function (price) {
                return _objectSpread(_objectSpread({}, price), {}, {
                  bbwert: parseFloat("".concat(price.bbwert * keyedConversionCurrency[price.waers].value)).toFixed(2),
                  waers: _this13._oConversionCurrency.currencyBase
                });
              })
            });
          })
        };
      });
    },

    /**
     * @function
     * @name _handleResCommercialQualifications
     * @description - Handler of the commercial qualification response
     *
     * @private
     * @param {object} res - Response of the fetch
     * @param {object} res.data - Data of the response
     * @returns {void} - Nothing to return
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _handleResCommercialQualifications: function _handleResCommercialQualifications(_ref4) {
      var data = _ref4.data;

      var process = this._oFormModel.getData();

      this._oFormModel.setProperty('/offers', data);

      this.byId('conversionDateOT').setVisible(!isEmpty(process.conversionCurrency));
      this.byId('conversionDateDP').setDateValue(process.conversionDate ? parseUniversalDate(process.conversionDate) : new Date());

      this._buildCommercialQualifications(_objectSpread(_objectSpread({}, process), {}, {
        offers: data
      }));
    },

    /**
     * @function
     * @name _buildCommercialQualifications
     * @description - Build commercial qualifications
     *
     * @private
     * @param {object} data - Data to build the qualifications
     * @returns {void} - Nothing to return
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildCommercialQualifications: function _buildCommercialQualifications(data) {
      var offers = filter(get(data, 'offers', []), {
        estaOfer: true
      });
      var processStatus = get(data, 'status', '');
      var processPositions = get(data, 'positions', []);
      var roundProcess = get(data, 'roundsProcess', []);
      var evaluationCriteria = get(data, 'evaluationCriteria', []);
      var evaluationCriteriaFiltered = filter(evaluationCriteria, {
        tipo: TypesEvaluationCriteria.C
      });

      var _this$_getDefaultQual = this._getDefaultQualificationColumns(),
          _this$_getDefaultQual2 = _slicedToArray(_this$_getDefaultQual, 2),
          headerColumn = _this$_getDefaultQual2[0],
          positionColumn = _this$_getDefaultQual2[1];
      /* TODO: Hace falta filtrar por el campo 'user': Que es el evaluador tÃ©cnico que inicio sesiÃ³n */


      this._buildCommercialQualificationsByHeader({
        evaluationCriteria: evaluationCriteriaFiltered,
        headerColumn: headerColumn,
        offers: offers,
        processStatus: processStatus
      });

      this._buildCommercialQualificationsByPos({
        evaluationCriteria: evaluationCriteriaFiltered,
        offers: offers,
        positionColumn: positionColumn,
        processPositions: processPositions,
        processStatus: processStatus,
        roundProcess: roundProcess
      });
    },

    /**
     * @function
     * @name _buildCommercialQualificationsByHeader
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
    _buildCommercialQualificationsByHeader: function _buildCommercialQualificationsByHeader(_ref5) {
      var _this14 = this;

      var evaluationCriteria = _ref5.evaluationCriteria,
          headerColumn = _ref5.headerColumn,
          offers = _ref5.offers,
          processStatus = _ref5.processStatus;
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

          if (row) {
            _this14._addPositionCriteriaToRow({
              criteria: criteria,
              offerId: offer.angnr,
              row: row,
              vendorId: vendorId
            });
          }
        });
        columns.push(column);
      });
      var table =
      /** @type {sap.m.Table} */
      this.byId('commercialQualificationTableByHeader');
      var panel =
      /** @type {sap.m.Panel} */
      this.byId('commercialQualificationPanel');
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
     * @name _buildCommercialQualificationsByPos
     * @description - build the qualifications by position
     *
     * @private
     * @param {object} context - Context
     * @param {object[]} context.positionColumn - Position columns
     * @param {object[]} context.evaluationCriteria - Evaluation criteria
     * @param {object[]} context.offers - Offers
     * @param {object[]} context.processPositions - Process positions
     * @param {object[]} context.roundProcess - Round process
     * @param {string} context.processStatus - Process status
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildCommercialQualificationsByPos: function _buildCommercialQualificationsByPos(_ref6) {
      var _this15 = this;

      var evaluationCriteria = _ref6.evaluationCriteria,
          offers = _ref6.offers,
          positionColumn = _ref6.positionColumn,
          processPositions = _ref6.processPositions,
          processStatus = _ref6.processStatus,
          roundProcess = _ref6.roundProcess;
      var columns = JSON.parse(JSON.stringify(positionColumn));
      var evaluationCriteriaFiltered = filter(evaluationCriteria, {
        indCabPos: LevelEvaluationCriteria.P.key
      });
      var evaluationCriteriaFilteredByPrice = find(evaluationCriteriaFiltered, {
        criterio: constant.CRITERIA_PRICE_KEY
      });

      var rows = this._mappedOffers({
        offers: offers,
        rows: this._mergeEvaluationCriteriaWithProcessPositions({
          evaluationCriteria: evaluationCriteriaFiltered,
          processPositions: processPositions
        }),
        isPosition: true
      });

      var round = find(roundProcess, {
        estatusRonda: RoundsProcessStatus.ABIERTO.status
      });
      offers.forEach(function (offer) {
        var offerPositions = get(offer, 'positions', []);
        var positionCriteria = get(offer, 'positionCriteria', []);
        var vendorId = get(offer, 'vendor.idProv', '');
        var pricesPerRound = get(offer, 'pricesPerRound', []);
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

          _this15._addPositionCriteriaToRow({
            row: row,
            criteria: criteria,
            vendorId: vendorId,
            offerId: offer.angnr
          });
        });

        _this15._addPriceCriteriaToRow({
          criteriaId: evaluationCriteriaFilteredByPrice === null || evaluationCriteriaFilteredByPrice === void 0 ? void 0 : evaluationCriteriaFilteredByPrice.id,
          vendorId: vendorId,
          roundId: round === null || round === void 0 ? void 0 : round.roundId,
          rows: rows,
          pricesPerRound: pricesPerRound
        });

        columns.push(column);
      });
      var table =
      /** @type {sap.m.Table} */
      this.byId('commercialQualificationTableByPosition');
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
     * @name _mergeEvaluationCriteriaWithProcessPositions
     * @description - Merge the evaluation criteria with the process positions
     *
     * @private
     * @param {object} context - Context to build the criteria row
     * @param {object[]} context.evaluationCriteria - Evaluation criteria
     * @param {object[]} context.processPositions - Process positions
     * @returns {object[]} - Criteria row
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _mergeEvaluationCriteriaWithProcessPositions: function _mergeEvaluationCriteriaWithProcessPositions(_ref7) {
      var evaluationCriteria = _ref7.evaluationCriteria,
          processPositions = _ref7.processPositions;
      var rows = [];
      evaluationCriteria.map(this._mapEvaluationCriteria).forEach(function (criteria) {
        processPositions.forEach(function (position) {
          rows.push(_objectSpread(_objectSpread({}, criteria), {}, {
            posId: position.id,
            posProc: position.posProc,
            matnr: position.matnr,
            maktx: position.maktx
          }));
        });
      });
      return rows;
    },

    /**
     * @function
     * @name _mappedOffers
     * @description - Map the offers
     *
     * @private
     * @param {object} context - Context to build the criteria row
     * @param {object[]} context.offers - Offers
     * @param {object[]} context.rows - Rows
     * @param {boolean} context.isPosition - Is position
     * @returns {object[]} - Rows
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _mappedOffers: function _mappedOffers(_ref8) {
      var _this16 = this;

      var offers = _ref8.offers,
          rows = _ref8.rows,
          isPosition = _ref8.isPosition;
      var mappedOffers = offers.reduce(function (acc, offer) {
        var _acc = _slicedToArray(acc, 2),
            offersMap = _acc[0],
            statusMap = _acc[1];

        var vendorId = get(offer, 'vendor.idProv', '');
        var vendorName = get(offer, 'vendor.name1', '');
        var offerId = get(offer, 'angnr', '');
        var status = get(offer, 'status', ''); // Status

        statusMap.set(vendorId, {
          status: status,
          statusType: offer.statusEvaluatorType
        }); // Offer

        offersMap.set(vendorId, {
          offerId: offerId,
          vendorName: vendorName,
          status: status,
          statusType: offer.statusEvaluatorType
        });
        return [offersMap, statusMap];
      }, [new Map(), new Map()]);
      return rows.map(function (row) {
        return _objectSpread(_objectSpread({}, row), {}, {
          qualifications: new Map(JSON.parse(JSON.stringify(_toConsumableArray(_this16._mappedQualification({
            row: row,
            offers: offers,
            isPosition: isPosition
          }))))),
          commentsByPosition: new Map(JSON.parse(JSON.stringify(_toConsumableArray(_this16._mappedComments({
            row: row,
            offers: offers
          }))))),
          offers: new Map(JSON.parse(JSON.stringify(_toConsumableArray(mappedOffers[0])))),
          status: new Map(JSON.parse(JSON.stringify(_toConsumableArray(mappedOffers[1]))))
        });
      });
    },

    /**
     * @function
     * @name _mappedQualification
     * @description - Map the qualifications
     *
     * @private
     * @param {object} context - Context to build the criteria row
     * @param {object[]} context.offers - Offers
     * @param {object} context.row - Row
     * @param {boolean} context.isPosition - Is position
     * @returns {Map} - Qualification map
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _mappedQualification: function _mappedQualification(_ref9) {
      var offers = _ref9.offers,
          row = _ref9.row,
          isPosition = _ref9.isPosition;
      var el = row;

      var keys = _objectSpread({
        evaluationCriteriaId: el.criteriaId
      }, isPosition ? {
        positionId: el.posId
      } : {});

      return offers.reduce(function (acc, offer) {
        var offerId = get(offer, 'angnr', '');
        var vendorId = get(offer, 'vendor.idProv', ''); // Qualification

        acc.set(vendorId, _objectSpread(_objectSpread({}, keys), {}, {
          offerId: offerId,
          value: null
        }));
        return acc;
      }, new Map());
    },

    /**
     * @function
     * @name _mappedComments
     * @description - Map the comments
     *
     * @private
     * @param {object} context - Context to build the criteria row
     * @param {object[]} context.offers - Offers
     * @param {object} context.row - Row
     * @returns {Map} - Comments by position
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _mappedComments: function _mappedComments(_ref10) {
      var offers = _ref10.offers,
          row = _ref10.row;
      var el = row;
      var posId = el.posId;
      return offers.reduce(function (acc, offer) {
        var offerId = get(offer, 'angnr', '');
        var vendorId = get(offer, 'vendor.idProv', '');
        var positions = get(offer, 'positions', []);
        var position = find(positions, {
          positionId: posId
        });
        var comments = get(position, 'comments', []);
        acc.set(vendorId, {
          comments: comments,
          offerId: offerId
        });
        return acc;
      }, new Map());
    },

    /**
     * @function
     * @name _addPositionCriteriaToRow
     * @description - Build the criteria row
     *
     * @private
     * @param {object} context - Context to build the criteria row
     * @param {object} context.row - Row to build
     * @param {object} context.criteria - Criteria to build the row
     * @param {string} context.vendorId - Vendor id
     * @param {string} context.offerId - Offer id
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _addPositionCriteriaToRow: function _addPositionCriteriaToRow(_ref11) {
      var criteria = _ref11.criteria,
          offerId = _ref11.offerId,
          row = _ref11.row,
          vendorId = _ref11.vendorId;

      if (row) {
        var _newRow$qualification;

        var newRow = row;
        var prop = get(EntProvEvaluationCriteria, "".concat(row.entradaProveedor, ".prop"), '');
        newRow[vendorId] = criteria[prop];
        (_newRow$qualification = newRow.qualifications) !== null && _newRow$qualification !== void 0 ? _newRow$qualification : newRow.qualifications = new Map();
        newRow.qualifications.set(vendorId, {
          posId: criteria.id,
          valuePerVendor: criteria[prop],
          offerId: offerId,
          // Qualification
          value: criteria.calificacion
        });
      }
    },

    /**
     * @function
     * @name _addPriceCriteriaToRow
     * @description - Build the criteria price row
     *
     * @private
     * @param {object} context - Context to build the criteria price row
     * @param {object[]} context.rows - Rows
     * @param {object} context.pricesPerRound - Prices per round
     * @param {string} context.vendorId - Vendor id
     * @param {string} context.criteriaId - Criteria id
     * @param {string} context.roundId - Round id
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _addPriceCriteriaToRow: function _addPriceCriteriaToRow(_ref12) {
      var rows = _ref12.rows,
          pricesPerRound = _ref12.pricesPerRound,
          vendorId = _ref12.vendorId,
          criteriaId = _ref12.criteriaId,
          roundId = _ref12.roundId;
      pricesPerRound.filter(function (price) {
        return roundId === price.roundId;
      }).forEach(function (price) {
        var row = find(rows, {
          posId: price.positionId,
          criteriaId: criteriaId
        });

        if (row) {
          var _row$qualifications;

          row.isPrice = true;
          row[vendorId] = {
            bbwert: price.bbwert,
            waers: price.waers
          };
          /* `${price.bbwert} ${price.waers}` */

          (_row$qualifications = row.qualifications) !== null && _row$qualifications !== void 0 ? _row$qualifications : row.qualifications = new Map();
          row.qualifications.set(vendorId, {
            isPrice: true,
            valuePerVendor: price.bbwert,
            waers: price.waers,
            // Qualification
            value: price.calificacion,
            // Keys
            offerId: price.offerId,
            positionId: price.positionId,
            roundId: price.roundId
          });
        }
      });
    },

    /**
     * @function
     * @name _buildQualificationRequest
     * @description - Build the qualification request
     *
     * @private
     * @param {object[]} updatedItems - Updated items
     * @returns {object[]}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildQualificationRequest: function _buildQualificationRequest(updatedItems) {
      var _this17 = this;

      var req = [];
      var fechaCal = new Date().toISOString();
      updatedItems.forEach(function (item) {
        var _obj$qualifications;

        var obj = item.getBindingContext().getObject();
        obj === null || obj === void 0 ? void 0 : (_obj$qualifications = obj.qualifications) === null || _obj$qualifications === void 0 ? void 0 : _obj$qualifications.forEach(function (value) {
          if (value.updated) {
            req.push(_objectSpread(_objectSpread({}, _this17._setQualificationKeys(value)), {}, {
              calificacion: value.value,
              fechaCal: fechaCal
            }));
          }
        });
      });
      return req;
    },

    /**
     * @function
     * @name _setQualificationKeys
     * @description - Set the qualification keys
     *
     * @private
     * @param {object} qualification - Qualification to set the keys
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _setQualificationKeys: function _setQualificationKeys(qualification) {
      if (qualification.isPrice) {
        return {
          offerId: qualification.offerId,
          positionId: qualification.positionId,
          roundId: qualification.roundId
        };
      }

      if (!isEmpty(qualification.posId)) {
        return {
          id: qualification.posId
        };
      }

      return {
        offerId: qualification.offerId,
        positionId: qualification.positionId,
        evaluationCriteriaId: qualification.evaluationCriteriaId
      };
    },

    /**
     * @function
     * @name _buildQualificationRequestByPosition
     * @description - Build the qualification request by position
     *
     * @private
     * @param {object[]} updatedItems - Updated items
     * @returns {Promise<object[]>}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildQualificationRequestByPosition: function _buildQualificationRequestByPosition(updatedItems) {
      var qualificationByPricequalificationByPos = updatedItems.filter(function (item) {
        return !item.getBindingContext().getProperty('isPrice');
      });
      var qualificationByPrice = updatedItems.filter(function (item) {
        return item.getBindingContext().getProperty('isPrice');
      });

      var quReqByPos = this._buildQualificationRequest(qualificationByPricequalificationByPos);

      var quReqByPrice = this._buildQualificationRequest(qualificationByPrice);

      return Promise.allSettled([quReqByPos.length ? http.update(constant.api.POSITION_CRITERIA, quReqByPos) : Promise.resolve(), quReqByPrice.length ? http.update("".concat(constant.api.PRICES_PER_ROUND), quReqByPrice) : Promise.resolve()]);
    },

    /**
     * @function
     * @name _updateStateQualification
     * @description - Update the state of the qualification
     *
     * @private
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _updateStateQualification: function _updateStateQualification() {
      showToast(this.getResourceBundle().getText('Commons.0021')); // Clean state updated

      this._oQualificationItems.filter(function (item) {
        return item.getBindingContext().getProperty('isUpdated');
      }).forEach(function (item) {
        var _obj$qualifications2;

        var obj = item.getBindingContext().getObject();
        delete obj.isUpdated;
        obj === null || obj === void 0 ? void 0 : (_obj$qualifications2 = obj.qualifications) === null || _obj$qualifications2 === void 0 ? void 0 : _obj$qualifications2.entries(function (_ref13) {
          var _ref14 = _slicedToArray(_ref13, 2),
              key = _ref14[0],
              value = _ref14[1];

          var qualif = _objectSpread({}, value);

          delete qualif.updated;
          obj.qualifications.set(key, qualif);
        });
      });
    },

    /**
     * @function
     * @name _buildRoundHistory
     * @description - Build the round history
     *
     * @private
     * @param {object} context - Selected items
     * @param {object[]} context.columns - Columns of the table
     * @param {object[]} context.rows - Rows of the table
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildRoundHistory: function _buildRoundHistory(_ref15) {
      var columns = _ref15.columns,
          rows = _ref15.rows;

      var rounds = this._oFormModel.getProperty('/roundsProcess');

      var offers = this._oFormModel.getProperty('/offers');

      var title = this._i18n.getText('0311');

      offers.forEach(function (offer) {
        var pricesPerRound = get(offer, 'pricesPerRound', []);

        var _get = get(offer, 'vendor', {}),
            name1 = _get.name1,
            idProv = _get.idProv;

        columns.push({
          label: name1,
          name: 'round',
          template: 'Round',
          vendorId: idProv
        });
        pricesPerRound === null || pricesPerRound === void 0 ? void 0 : pricesPerRound.forEach(function (price) {
          var _row$roundHistory;

          var row = find(rows, {
            posId: get(price, 'positionId', '')
          });
          var round = find(rounds, {
            roundId: get(price, 'roundId', '')
          });
          var roundId = round.roundId;
          (_row$roundHistory = row.roundHistory) !== null && _row$roundHistory !== void 0 ? _row$roundHistory : row.roundHistory = [];
          var rowHistory = find(row.roundHistory, {
            roundId: roundId
          });

          if (!rowHistory) {
            rowHistory = _defineProperty({
              roundId: roundId,
              posProc: "".concat(title, " ").concat(round.round)
            }, idProv, {
              bbwert: price.bbwert,
              waers: get(price, 'waers', '')
            });
            row.roundHistory.push(rowHistory);
          } else {
            rowHistory[idProv] = {
              bbwert: price.bbwert,
              waers: get(price, 'waers', '')
            };
          }
        });
      });
    },

    /**
     * @function
     * @name _buildRequestToRejectOrReactivatePosition
     * @description - Build the request to reject or reactivate position
     *
     * @private
     * @param {object} message - Comment
     * @param {object[]} selectedItems - Selected items
     * @returns {object[]}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildRequestToRejectOrReactivatePosition: function _buildRequestToRejectOrReactivatePosition(message, selectedItems) {
      return selectedItems.map(function (item) {
        return {
          offerId: item.getBindingContext().getProperty('offerId'),
          processPositionId: item.getBindingContext().getProperty('positionId'),
          message: message
        };
      });
    },

    /**
     * @function
     * @name _buildRequestToRejectOrReactivateOffers
     * @description - Build the request to reject or reactivate offers
     *
     * @private
     * @param {object} _ - Comment
     * @param {object[]} selectedItems - Selected items
     * @returns {object[]}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildRequestToRejectOrReactivateOffers: function _buildRequestToRejectOrReactivateOffers(_, selectedItems) {
      return selectedItems.map(function (item) {
        return {
          angnr: item.getBindingContext().getProperty('offerId')
        };
      });
    },

    /**
     * @function
     * @name _validateOffersOrPosToRejectOrReactivate
     * @description - Validate offers or position to reject or reactivate
     *
     * @private
     * @param {object} context - Context
     * @param {object[]} context.selectedItems - Selected items
     * @param {any} context.fnSome - Function to some
     * @returns {object[]}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _validateOffersOrPosToRejectOrReactivate: function _validateOffersOrPosToRejectOrReactivate(_ref16) {
      var selectedItems = _ref16.selectedItems,
          fnSome = _ref16.fnSome;
      return selectedItems.filter(function (item) {
        var array = [];
        var context = item.getBindingContext();
        var offers = context.getProperty('offers');
        offers === null || offers === void 0 ? void 0 : offers.forEach(function (_ref17) {
          var status = _ref17.status,
              statusType = _ref17.statusType;
          array.push({
            status: status,
            statusType: statusType
          });
        });
        return array.some(fnSome);
      });
    },

    /* ======= begin: Reject/Reactivate Offers ======= */

    /**
     * @function
     * @name _isOfferRejectedByCommercialEvaluator
     * @description - Is offer rejected by commercial evaluador
     *
     * @private
     * @param {object} context
     * @param {string} context.status - Status
     * @param {string} context.statusType - Status type
     * @returns {boolean}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _isOfferRejectedByCommercialEvaluator: function _isOfferRejectedByCommercialEvaluator(_ref18) {
      var status = _ref18.status,
          statusType = _ref18.statusType;
      return useOfferStatus.isOfferRejectedByEvaluator(status) && isStatusTypeC({
        statusType: statusType
      });
    },

    /**
     * @function
     * @name _canRejectOffer
     * @description - Can reject offer
     *
     * @private
     * @param {object} context
     * @param {string} context.status - Status
     * @param {string} context.statusType - Status type
     * @returns {boolean}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _canRejectOffer: function _canRejectOffer(_ref19) {
      var status = _ref19.status,
          statusType = _ref19.statusType;
      return !useOfferStatus.isOfferRejected(status) && !useOfferStatus.isTotalWinningOffer(status) && !isStatusTypeT({
        statusType: statusType
      });
    },

    /**
     * @function
     * @name _openRejectOffersDialog
     * @description - Open the reject offers dialog
     *
     * @private
     * @param {object[]} selectedItems - Selected items
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _openRejectOffersDialog: function _openRejectOffersDialog(selectedItems) {
      var _this18 = this;

      var oView = this.getView();
      Fragment.load({
        id: oView.getId(),
        name: 'com.innova.sigc.view.biddingProcess.dialog.qualification.RejectOffers',
        controller: this
      }).then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control; // connect dialog to the root view of this component (models, lifecycle)

        oView.addDependent(oDialog);
        oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
        _this18._oRejectOfferDialog = oDialog;
        var positions = selectedItems.map(function (items) {
          return items.getBindingContext().getObject();
        });
        var data = [];
        var offers = get(positions, '[0].offers', new Map());
        offers.forEach(function (offer, vendorId) {
          var offerId = offer.offerId,
              vendorName = offer.vendorName,
              s = offer.status,
              statusType = offer.statusType;

          if (_this18._canRejectOffer({
            status: s,
            statusType: statusType
          })) {
            data.push({
              vendorId: vendorId,
              offerId: offerId,
              vendorName: vendorName,
              status: s
            });
          }
        });

        _this18._oRejectOfferDialog.setModel(new JSONModel({
          offers: data
        })); // remove all editors


        editor.removeEditorManager();
        setTimeout(function () {
          // Initialize editor oferentes
          _this18._oRejectOfferEditor = editor.initializeQuillEditor.call(_this18, {
            container: _this18.byId('editorRejectOffers').getDomRef(),
            placeholder: _this18._i18n.getText('0111')
          });

          _this18._oRejectOfferEditor.render();
        });
        oDialog.attachAfterClose(oDialog.destroy.bind(oDialog));
        oDialog.open();
      });
    },

    /**
     * @function
     * @name _openReactivateOffersDialog
     * @description - Open the reactivate offers dialog
     *
     * @private
     * @param {object[]} selectedItems - Selected items
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _openReactivateOffersDialog: function _openReactivateOffersDialog(selectedItems) {
      var _this19 = this;

      var oView = this.getView();
      Fragment.load({
        id: oView.getId(),
        name: 'com.innova.sigc.view.biddingProcess.dialog.qualification.ReactivateOffers',
        controller: this
      }).then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control; // connect dialog to the root view of this component (models, lifecycle)

        oView.addDependent(oDialog);
        oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
        _this19._oReactivateOffersDialog = oDialog;
        var positions = selectedItems.map(function (items) {
          return items.getBindingContext().getObject();
        });
        var data = [];
        var offers = get(positions, '[0].offers', new Map());
        offers.forEach(function (offer, vendorId) {
          var offerId = offer.offerId,
              vendorName = offer.vendorName,
              s = offer.status,
              statusType = offer.statusType;

          if (_this19._isOfferRejectedByCommercialEvaluator({
            status: s,
            statusType: statusType
          })) {
            data.push({
              vendorId: vendorId,
              offerId: offerId,
              vendorName: vendorName,
              status: s
            });
          }
        });

        _this19._oReactivateOffersDialog.setModel(new JSONModel({
          offers: data
        }));

        oDialog.attachAfterClose(oDialog.destroy.bind(oDialog));
        oDialog.open();
      });
    },

    /* ======= finish: Reject/Reactivate Offers ======= */

    /* ======= begin: Reject/Reactivate Position Offers ======= */

    /**
     * @function
     * @name _isPosOfferRejectedByCommercialEvaluator
     * @description - Is the position offer rejected by commercial evaluator
     *
     * @private
     * @param {object} context
     * @param {string} context.status - Status
     * @param {string} context.statusType - Status type
     * @returns {boolean}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _isPosOfferRejectedByCommercialEvaluator: function _isPosOfferRejectedByCommercialEvaluator(_ref20) {
      var status = _ref20.status,
          statusType = _ref20.statusType;
      return useOfferStatus.isPositionRejectedByEvaluator(status) && isStatusTypeC({
        statusType: statusType
      });
    },

    /**
     * @function
     * @name _canRejectPositionOffer
     * @description - Can reject position offer
     *
     * @private
     * @param {object} context
     * @param {string} context.status - Status
     * @param {string} context.statusType - Status type
     * @returns {boolean}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _canRejectPositionOffer: function _canRejectPositionOffer(_ref21) {
      var status = _ref21.status,
          statusType = _ref21.statusType;
      return !useOfferStatus.isPositionRejected(status) && !useOfferStatus.isPositionWinning(status) && !isStatusTypeT({
        statusType: statusType
      });
    },

    /**
     * @function
     * @name _openRejectPositionDialog
     * @description - Open the reject position dialog
     *
     * @private
     * @param {object[]} selectedItems - Selected items
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _openRejectPositionDialog: function _openRejectPositionDialog(selectedItems) {
      var _this20 = this;

      var oView = this.getView();
      Fragment.load({
        id: oView.getId(),
        name: 'com.innova.sigc.view.biddingProcess.dialog.qualification.RejectPosition',
        controller: this
      }).then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control; // connect dialog to the root view of this component (models, lifecycle)

        oView.addDependent(oDialog);
        oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
        _this20._oRejectPositionDialog = oDialog;
        var positions = selectedItems.map(function (items) {
          return items.getBindingContext().getObject();
        });
        var positionNumber = get(positions, '[0].posProc', 0);
        var positionId = get(positions, '[0].posId', 0);
        var positionMatnr = get(positions, '[0].matnr', 0);
        var positionMaktx = get(positions, '[0].maktx', 0);
        var data = [];
        var offers = get(positions, '[0].offers', new Map());
        offers.forEach(function (offer, vendorId) {
          var offerId = offer.offerId,
              vendorName = offer.vendorName,
              s = offer.status,
              statusType = offer.statusType;

          if (_this20._canRejectPositionOffer({
            status: s,
            statusType: statusType
          })) {
            data.push({
              positionId: positionId,
              vendorId: vendorId,
              offerId: offerId,
              vendorName: vendorName,
              status: s
            });
          }
        });

        _this20._oRejectPositionDialog.setModel(new JSONModel({
          positionNumber: positionNumber,
          positionId: positionId,
          positionMatnr: positionMatnr,
          positionMaktx: positionMaktx,
          offers: data
        })); // remove all editors


        editor.removeEditorManager();
        setTimeout(function () {
          // Initialize editor oferentes
          _this20._oRejectPositionEditor = editor.initializeQuillEditor.call(_this20, {
            container: _this20.byId('editorRejectPosition').getDomRef(),
            placeholder: _this20._i18n.getText('0111')
          });

          _this20._oRejectPositionEditor.render();
        });
        oDialog.attachAfterClose(oDialog.destroy.bind(oDialog));
        oDialog.open();
      });
    },

    /**
     * @function
     * @name _openReactivatePositionDialog
     * @description - Open the reactivate position dialog
     *
     * @private
     * @param {object[]} selectedItems - Selected items
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _openReactivatePositionDialog: function _openReactivatePositionDialog(selectedItems) {
      var _this21 = this;

      var oView = this.getView();
      Fragment.load({
        id: oView.getId(),
        name: 'com.innova.sigc.view.biddingProcess.dialog.qualification.ReactivatePosition',
        controller: this
      }).then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control; // connect dialog to the root view of this component (models, lifecycle)

        oView.addDependent(oDialog);
        oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
        _this21._oRejectPositionDialog = oDialog;
        var positions = selectedItems.map(function (items) {
          return items.getBindingContext().getObject();
        });
        var positionNumber = get(positions, '[0].posProc', 0);
        var positionId = get(positions, '[0].posId', 0);
        var positionMatnr = get(positions, '[0].matnr', 0);
        var positionMaktx = get(positions, '[0].maktx', 0);
        var data = [];
        var offers = get(positions, '[0].offers', new Map());
        offers.forEach(function (offer, vendorId) {
          var offerId = offer.offerId,
              vendorName = offer.vendorName,
              s = offer.status,
              statusType = offer.statusType;

          if (_this21._isPosOfferRejectedByCommercialEvaluator({
            status: s,
            statusType: statusType
          })) {
            data.push({
              positionId: positionId,
              vendorId: vendorId,
              offerId: offerId,
              vendorName: vendorName,
              status: s
            });
          }
        });

        _this21._oRejectPositionDialog.setModel(new JSONModel({
          positionNumber: positionNumber,
          positionId: positionId,
          positionMatnr: positionMatnr,
          positionMaktx: positionMaktx,
          offers: data
        }));

        oDialog.attachAfterClose(oDialog.destroy.bind(oDialog));
        oDialog.open();
      });
    },

    /* ======= finish: Reject/Reactivate Position Offers ======= */

    /* ======= begin: Comments Position Offers ======= */

    /**
     * @function
     * @name _openCommentPositionDialogDialog
     * @description - Open the comment position dialog
     *
     * @private
     * @param {object[]} selectedItems - Selected items
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _openCommentPositionDialogDialog: function _openCommentPositionDialogDialog(selectedItems) {
      var _this22 = this;

      var oView = this.getView();
      Fragment.load({
        id: oView.getId(),
        name: 'com.innova.sigc.view.biddingProcess.dialog.qualification.CommentPosition',
        controller: this
      }).then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control; // connect dialog to the root view of this component (models, lifecycle)

        oView.addDependent(oDialog);
        oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
        _this22._oCommentPositionDialog = oDialog;
        var positions = selectedItems.map(function (items) {
          return items.getBindingContext().getObject();
        });
        var positionNumber = get(positions, '[0].posProc', 0);
        var positionId = get(positions, '[0].posId', 0);
        var positionMatnr = get(positions, '[0].matnr', 0);
        var positionMaktx = get(positions, '[0].maktx', 0);
        var data = [];
        var offers = get(positions, '[0].offers', new Map());
        offers.forEach(function (offer, vendorId) {
          var offerId = offer.offerId,
              vendorName = offer.vendorName,
              s = offer.status;
          data.push({
            positionId: positionId,
            vendorId: vendorId,
            offerId: offerId,
            vendorName: vendorName,
            status: s
          });
        });

        _this22._oCommentPositionDialog.setModel(new JSONModel({
          positionNumber: positionNumber,
          positionId: positionId,
          positionMatnr: positionMatnr,
          positionMaktx: positionMaktx,
          offers: data
        })); // remove all editors


        editor.removeEditorManager();
        setTimeout(function () {
          // Initialize editor oferentes
          _this22._oCommentPositionEditor = editor.initializeQuillEditor.call(_this22, {
            container: _this22.byId('editorCommentPosition').getDomRef(),
            placeholder: _this22._i18n.getText('0111')
          });

          _this22._oCommentPositionEditor.render();
        });
        oDialog.attachAfterClose(oDialog.destroy.bind(oDialog));
        oDialog.open();
      });
    }
    /* ======= finish: Comments Position Offers ======= */

    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

  };
});