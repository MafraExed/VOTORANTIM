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

sap.ui.define(['com/innova/sigc/formatter/formatMessage', 'com/innova/sigc/formatter/formatMessageType', 'com/innova/sigc/lib/formUtils/formUtils', 'com/innova/sigc/model/constant', 'com/innova/sigc/model/process/roundsProcessStatus/RoundsProcessStatus', 'com/innova/sigc/model/process/poCreate/Imputacion', 'com/innova/sigc/model/process/poCreate/PoCreate', 'com/innova/sigc/model/process/poCreate/Posicion', 'com/innova/sigc/model/process/poCreate/Servicio', 'com/innova/sigc/model/searchHelp/SearchHelp', 'com/innova/sigc/service/http', 'com/innova/sigc/service/petitions', 'com/innova/sigc/utils/addLeadingZeros', 'com/innova/sigc/utils/checkIfNumberBetween', 'com/innova/sigc/utils/isEmpty', 'com/innova/vendor/lodash.find', 'com/innova/vendor/lodash.get', 'sap/m/MessageBox', 'sap/ui/core/Fragment', 'sap/ui/model/json/JSONModel'], function (formatMessage, formatMessageType, formUtils, constant, RoundsProcessStatus, Imputacion, PoCreate, Posicion, Servicio, SearchHelp, http, petitions, addLeadingZeros, checkIfNumberBetween, isEmpty, find, get, MessageBox, Fragment, JSONModel) {
  return {
    formatMessageType: formatMessageType,

    /* =========================================================== */

    /* begin: event handlers                                       */

    /* =========================================================== */

    /**
     * @function
     * @name onCreateOrderButtonPress
     * @description - Handler of the create order button
     *
     * @public
     * @param {object} context - Context
     * @param {string} context.offerId - Offer id
     * @param {boolean} context.hasPartial - Has partial
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onCreateOrderButtonPress: function onCreateOrderButtonPress(_ref) {
      var _this = this;

      var offerId = _ref.offerId;

      var offers = this._oFormModel.getProperty('/offers');

      var offer = find(offers, {
        angnr: offerId
      });

      if (get(offer, 'vendor.lifnr', '') === '') {
        MessageBox.error(this._i18n.getText('0416', offer.vendor.name1));
        return;
      }

      if (offer) {
        Promise.resolve(this._oPage.setBusy(true)).then(this._getPosTypeAndKnttp.bind(this)).then(function (_ref2) {
          var _ref3 = _slicedToArray(_ref2, 3),
              posType = _ref3[0],
              knttp = _ref3[1],
              taxCode = _ref3[2];

          return _this._buildOrderModel({
            posType: posType,
            knttp: knttp,
            offer: offer,
            taxCode: taxCode
          });
        }).then(this._openCreateOrderDialog.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
      }
    },

    /**
     * @function
     * @name onCreateOrder
     * @description - Handler of the create order
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onCreateOrder: function onCreateOrder() {
      Promise.resolve(this._oCreateOrderDialog.setBusy(true)).then(this._isValidForm.bind(this, this.byId('headerDataForm'))).then(this._buildReqToCreateOrder.bind(this)).then(petitions.post.bind(petitions, constant.GET_CREATE_ORDER)).then(this._showNotificationsForCreateOrder.bind(this)).then(this._updatePurchaseOrder.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oCreateOrderDialog.setBusy.bind(this._oCreateOrderDialog, false));
    },

    /**
     * @function
     * @name getMessagePopover
     * @description - Get the message popover
     *
     * @public
     * @returns {sap.m.MessagePopover} - Message popover
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    getMessagePopover: function getMessagePopover() {
      if (!this._messagePopoveNotification) {
        this._messagePopoveNotification = new sap.m.MessagePopover({
          items: {
            path: '/',
            template: new sap.m.MessageItem({
              type: {
                path: 'TYPE',
                formatter: formatMessageType
              },
              title: '{MESSAGE}',
              description: '{MESSAGE}'
            })
          }
        });
      }

      return this._messagePopoveNotification;
    },

    /**
     * @function
     * @name onImputacionButtonPress
     * @description - Handler for open imputacion dialog
     *
     * @public
     * @returns {void} - Nothing to return
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onImputacionButtonPress: function onImputacionButtonPress(source) {
      var _this2 = this;

      var context = source.getBindingContext();
      var oView = this.getView();
      var imputations = context.getProperty('imputations');
      Fragment.load({
        id: oView.getId(),
        name: 'com.innova.sigc.view.biddingProcess.dialog.order.CreateImputacion',
        controller: this
      }).then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control; // connect dialog to the root view of this component (models, lifecycle)

        oView.addDependent(oDialog);
        oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
        _this2._oCreateImputacionDialog = oDialog;
        oDialog.setModel(new JSONModel({
          contextPosition: context,
          imputacion: imputations !== null && imputations !== void 0 ? imputations : []
        }));
        oDialog.attachAfterClose(oDialog.destroy.bind(oDialog));
        oDialog.open();
      });
    },

    /**
     * @function
     * @name onPercentageImputacionChange
     * @description - Percentage imputacion change.
     *
     * @public
     * @param {sap.m.Input} input - Input selected
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onPercentageImputacionChange: function onPercentageImputacionChange(input) {
      var value = input.getValue();
      input.setValueState(sap.ui.core.ValueState.None);

      if (!checkIfNumberBetween(value, 1, 100)) {
        input.setValueState(sap.ui.core.ValueState.Error);
        input.setValue('');
      }
    },

    /**
     * @function
     * @name onAddImputacion
     * @description - Handler for add imputacion
     *
     * @public
     * @returns {void} - Nothing to return
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onAddImputacion: function onAddImputacion() {
      var _this3 = this;

      var form = this.byId('imputacionDataForm');
      Promise.resolve(this._oCreateImputacionDialog.setBusy(true)).then(this._isValidForm.bind(this, form)).then(this._checkImputationPercentageBeforeAdding.bind(this, form)).then(function () {
        var data = formUtils.getFormData(form);

        var model = _this3._oCreateImputacionDialog.getModel();

        var currentData = model.getProperty('/imputacion');
        model.setProperty('/imputacion', [].concat(_toConsumableArray(currentData), [_objectSpread(_objectSpread({}, data), {}, {
          SERIAL_NO: currentData.length + 1
        })])); // Reset form

        form.getFormContainers().forEach(function (container) {
          formUtils.cleanFields({
            formElements: container.getFormElements()
          });
        });
      }).catch(this.errorHandler.bind(this)).finally(this._oCreateImputacionDialog.setBusy.bind(this._oCreateImputacionDialog, false));
    },

    /**
     * @function
     * @name onDeleteImputacion
     * @description - Handler for delete imputacion
     *
     * @public
     * @returns {void} - Nothing to return
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onDeleteImputacion: function onDeleteImputacion() {
      var _this4 = this;

      var list = this.byId('listOfImputations');
      Promise.resolve(this._oCreateImputacionDialog.setBusy(true)).then(this._getSelectedItems.bind(this, list)).then(function (selectedItems) {
        var serialsToRemove = selectedItems.map(function (item) {
          return item.getBindingContext().getProperty('SERIAL_NO');
        });

        var model = _this4._oCreateImputacionDialog.getModel();

        var imputations = model.getProperty('/imputacion');
        model.setProperty('/imputacion', imputations.filter(function (imputation) {
          return !serialsToRemove.includes(imputation.SERIAL_NO);
        }).map(function (imputation, index) {
          return _objectSpread(_objectSpread({}, imputation), {}, {
            SERIAL_NO: index + 1
          });
        }));
        list.removeSelections(true);
      }).catch(this.errorHandler.bind(this)).finally(this._oCreateImputacionDialog.setBusy.bind(this._oCreateImputacionDialog, false));
    },

    /**
     * @function
     * @name onCreateImputations
     * @description - Handler for create imputacion
     *
     * @public
     * @returns {void} - Nothing to return
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onCreateImputations: function onCreateImputations() {
      try {
        var model = this._oCreateImputacionDialog.getModel();

        var contextPosition = model.getProperty('/contextPosition');
        var imputations = model.getProperty('/imputacion');
        var sum = imputations.reduce(function (acc, value) {
          return acc + parseFloat(value.DISTR_PERC);
        }, 0);

        if (sum !== 100) {
          throw new Error(this._i18n.getText('0371'));
        }

        var position = contextPosition.getObject();
        position.imputations = imputations;
        contextPosition.getModel().updateBindings();

        this._oCreateImputacionDialog.close();
      } catch (error) {
        this.errorHandler(error);
      }
    },

    /**
     * @function
     * @name onDeletePurchaseOrder
     * @description - Handler for delete purchase order
     *
     * @public
     * @param {object} context - Context selected
     * @returns {void} - Nothing to return
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onDeletePurchaseOrder: function onDeletePurchaseOrder(_ref4) {
      var _this5 = this;

      var value = _ref4.value,
          offerId = _ref4.offerId,
          vendorName = _ref4.vendorName;
      MessageBox.confirm(this._i18n.getText('0421', [value, vendorName]), {
        actions: [MessageBox.Action.OK, this._i18n.getText('Commons.0007')],
        emphasizedAction: this._i18n.getText('Commons.0007'),
        onClose: function onClose(sAction) {
          if (sAction === MessageBox.Action.OK) {
            Promise.resolve(_this5._oPage.setBusy(true)).then(petitions.post.bind(petitions, constant.GET_DELETE_ORDER, {
              IV_PEDIDO: value
            })).then(_this5._handleResponseDeleteSapOrder.bind(_this5, offerId)).then(_this5._showNotifications.bind(_this5)).then(_this5._fetchAPI.bind(_this5, _this5._numProc)).then(_this5._fetchOffers.bind(_this5)).then(_this5._fetchQualificationSummary.bind(_this5)).catch(_this5.errorHandler.bind(_this5)).finally(_this5._oPage.setBusy.bind(_this5._oPage, false));
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
     * @name _getPosTypeAndKnttp
     * @description - Get pos type and knttp
     *
     * @private
     * @returns {Promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _getPosTypeAndKnttp: function _getPosTypeAndKnttp() {
      return [this._getPosType(), this._getKnttp(), this._getTaxCode()].reduce(function (acc, el) {
        return acc.then(function (res) {
          return el.then(function (resp) {
            return [].concat(_toConsumableArray(res), [resp]);
          });
        });
      }, Promise.resolve([]));
    },

    /**
     * @function
     * @name _getTaxCode
     * @description - Get pos type
     *
     * @private
     * @returns {object}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    _getTaxCode: function _getTaxCode() {
      var req = new SearchHelp('MWSKZ', {
        FCAT: 'X'
      });
      req.setFCODE1('TAXCO');
      return petitions.post(constant.GET_SEARCH_HELP, req).then(function (_ref5) {
        var data = _ref5.data;
        return data;
      });
    },

    /**
     * @function
     * @name _getPosType
     * @description - Get pos type
     *
     * @private
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _getPosType: function _getPosType() {
      return petitions.post(constant.GET_SEARCH_HELP, new SearchHelp('PSTYP', {
        FCAT: 'X'
      })).then(function (_ref6) {
        var data = _ref6.data;
        return data;
      });
    },

    /**
     * @function
     * @name _getKnttp
     * @description - Get knttp
     *
     * @private
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _getKnttp: function _getKnttp() {
      return petitions.post(constant.GET_SEARCH_HELP, new SearchHelp('KNTTP', {
        FCAT: 'X'
      })).then(function (_ref7) {
        var data = _ref7.data;
        return data;
      });
    },

    /**
     * @function
     * @name _buildOrderModel
     * @description - Build create order model
     *
     * @private
     * @param {object} context
     * @returns {sap.ui.model.json.JSONModel}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildOrderModel: function _buildOrderModel(_ref8) {
      var posType = _ref8.posType,
          knttp = _ref8.knttp,
          offer = _ref8.offer,
          taxCode = _ref8.taxCode;

      var process = this._oFormModel.getData();

      var roundProcess = get(process, 'roundsProcess', []);
      var positions = get(process, 'positions', []);
      var bukrs = process.bukrs,
          ekorg = process.ekorg,
          waers = process.waers,
          ekgrp = process.ekgrp,
          zterm = process.zterm,
          dzterm = process.dzterm;
      var round = find(roundProcess, {
        estatusRonda: RoundsProcessStatus.ABIERTO.status
      });
      var roundId = round === null || round === void 0 ? void 0 : round.roundId;
      var pricesPerRound = offer.pricesPerRound,
          offerPositions = offer.positions;
      return new JSONModel({
        bukrs: bukrs,
        ekgrp: ekgrp,
        ekorg: ekorg,
        offer: offer,
        dzterm: dzterm,
        positions: positions.map(function (position) {
          var _position$eeind;

          var positionId = position.id;
          var eeind = (_position$eeind = position.eeind) === null || _position$eeind === void 0 ? void 0 : _position$eeind.replace(/T.+/, '');
          var price = find(pricesPerRound, {
            roundId: roundId,
            positionId: positionId
          });
          var offerPosition = find(offerPositions, {
            positionId: positionId
          });
          return _objectSpread(_objectSpread({}, position), {}, {
            eeind: eeind,
            price: price,
            offerPosition: offerPosition
          });
        }).filter(function (_ref9) {
          var offerPosition = _ref9.offerPosition;
          return !isEmpty(offerPosition === null || offerPosition === void 0 ? void 0 : offerPosition.cantAsig);
        }),
        waers: waers,
        zterm: zterm,
        editable: true,
        searchHelp: {
          posType: posType,
          knttp: knttp,
          taxCode: taxCode
        }
      });
    },

    /**
     * @function
     * @name _openCreateOrderDialog
     * @description - Open create order dialog
     *
     * @private
     * @param {sap.ui.model.json.JSONModel} model
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _openCreateOrderDialog: function _openCreateOrderDialog(model) {
      var _this6 = this;

      var oView = this.getView();
      return Fragment.load({
        id: oView.getId(),
        name: 'com.innova.sigc.view.biddingProcess.dialog.order.CreateOrder',
        controller: this
      }).then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control; // connect dialog to the root view of this component (models, lifecycle)

        oView.addDependent(oDialog);
        oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
        _this6._oCreateOrderDialog = oDialog;
        oDialog.setModel(model);
        oDialog.attachAfterClose(function () {
          _this6._oCreateOrderDialog = null;
          oDialog.destroy();
        });
        oDialog.open();
      });
    },

    /**
     * @function
     * @name _buildReqToCreateOrder
     * @description - Build the request to create order
     *
     * @private
     * @returns {PoCreate}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildReqToCreateOrder: function _buildReqToCreateOrder() {
      var header = formUtils.getFormData(this.byId('headerDataForm'));

      var pos = this._oCreateOrderDialog.getModel().getProperty('/positions');

      var positions = this._buildPositionsToCreateOrder(pos);

      var services = this._buildServicesToCreateOrder(pos);

      var imputations = this._buildImputationsToCreateOrder(pos);

      var headerText = this.byId('headerText').getValue();
      var noteText = this.byId('noteText').getValue();
      var textoCab = [].concat(this._buildHeaderText({
        text: headerText,
        textId: 'F01'
      }), this._buildHeaderText({
        text: noteText,
        textId: 'F02'
      }));

      var lifnr = this._oCreateOrderDialog.getModel().getProperty('/offer/vendor/lifnr');

      return new PoCreate({
        header: _objectSpread(_objectSpread({}, header), {}, {
          VENDOR: lifnr,
          COLLECT_NO: this._numProc
        }),
        textoCab: textoCab,
        positions: positions,
        services: services,
        imputations: imputations
      });
    },

    /**
     * @function
     * @name _buildPositionsToCreateOrder
     * @description - Build the positions to create order
     *
     * @private
     * @param {object} positions - Positions
     * @returns {Posicion[]}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildPositionsToCreateOrder: function _buildPositionsToCreateOrder(positions) {
      return positions.map(function (position) {
        return new Posicion({
          PO_ITEM: position.posProc,
          MATERIAL: position.matnr,
          SHORT_TEXT: position.maktx,
          QUANTITY: get(position, 'offerPosition.cantAsig', 0),
          PO_UNIT: position.meins,
          DELIVERY_DATE: position.eeind,
          NET_PRICE: get(position, 'price.bbwert', 0),
          MATL_GROUP: position.matkl,
          PLANT: position.werks,
          PREQ_NAME: position.afnam,
          ITEM_CAT: position.posType,
          ACCTASSCAT: position.knttp,
          PREQ_NO: position.banfn,
          PREQ_ITEM: position.bnfpo,
          TAX_CODE: position.taxCode
        });
      });
    },

    /**
     * @function
     * @name _buildServicesToCreateOrder
     * @description - Build the services to create order
     *
     * @private
     * @param {object} positions - Positions
     * @returns {Servicio[]}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildServicesToCreateOrder: function _buildServicesToCreateOrder(positions) {
      return positions.filter(function (_ref10) {
        var posType = _ref10.posType;
        return posType === 'F';
      }).map(function (position) {
        return new Servicio({
          PO_ITEM: position.posProc,
          LINE_NO: '0000000001',
          SERVICE: '',
          SHORT_TEXT: position.maktx,
          QUANTITY: get(position, 'offerPosition.cantAsig', 0),
          BASE_UOM: position.meins,
          GR_PRICE: get(position, 'price.bbwert', 0),
          MATL_GROUP: position.matkl
        });
      });
    },

    /**
     * @function
     * @name _buildImputationsToCreateOrder
     * @description - Build the imputations to create order
     *
     * @private
     * @param {object} positions - Positions
     * @returns {Servicio[]}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildImputationsToCreateOrder: function _buildImputationsToCreateOrder(positions) {
      var _this7 = this;

      var pos = positions.filter(function (_ref11) {
        var knttp = _ref11.knttp;
        return !isEmpty(knttp);
      });
      var array = [];
      pos.forEach(function (position) {
        var imputations = position.imputations;

        if (isEmpty(imputations)) {
          throw new Error(formatMessage(_this7._i18n.getText('0369'), [position.posProc]));
        }

        array = array.concat(imputations.map(function (imputation) {
          return new Imputacion({
            PO_ITEM: position.posProc,
            LINE_NO: '0000000001',
            SERIAL_NO: imputation.SERIAL_NO,
            DISTR_PERC: parseFloat("".concat(parseInt(imputation.DISTR_PERC, 10) / 100)).toFixed(2),
            G_L_ACCT: imputation.G_L_ACCT,
            COST_CTR: imputation.COST_CTR,
            ORDER_NO: imputation.ORDER_NO,
            WBS_ELEMENT: imputation.WBS_ELEMENT,
            GR_RCPT: imputation.GR_RCPT
          });
        }));
      });
      return array;
    },

    /**
     * @function
     * @name _buildHeaderText
     * @description - Build the header text
     *
     * @private
     * @param {object} context - Context
     * @param {string} context.text - Text
     * @param {string} context.textId - Text id
     * @returns {object[]}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildHeaderText: function _buildHeaderText(_ref12) {
      var text = _ref12.text,
          textId = _ref12.textId;
      var textoCab = [];
      var textFilter = text.split(/\r?\n/).filter(Boolean);

      for (var index = 0; index < textFilter.length; index += 1) {
        var line = textFilter[index];
        textoCab.push({
          TEXT_ID: textId,
          SECUENCIA: addLeadingZeros(index + 1, 3),
          TEXT_FORM: null,
          TEXT_LINE: line
        });
      }

      return textoCab;
    },

    /**
     * @function
     * @name _showNotificationsForCreateOrder
     * @description - Show the notifications for create order
     *
     * @private
     * @param {object} context - Context
     * @param {object} context.data - Response data
     * @returns {string} - PO number
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _showNotificationsForCreateOrder: function _showNotificationsForCreateOrder(_ref13) {
      var data = _ref13.data;
      var oMessagePopoveNotification = this.getMessagePopover();
      var oButton = this.byId('messagePopoverBtn');
      oButton.setText("".concat(data.ET_MENSAJES.length));
      oButton.setEnabled(true);
      oButton.attachPress(function attachPress() {
        oMessagePopoveNotification.toggle(this);
      });
      oMessagePopoveNotification.setModel(new JSONModel(data.ET_MENSAJES));
      oMessagePopoveNotification.toggle(oButton); // @ts-ignore

      oMessagePopoveNotification._oPopover.setModal(true);

      return data.PO_NUMBER;
    },

    /**
     * @function
     * @name _updatePurchaseOrder
     * @description - Update the purchase order
     *
     * @private
     * @param {string} purchaseOrder - Purchase order
     * @returns {Promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _updatePurchaseOrder: function _updatePurchaseOrder(purchaseOrder) {
      if (purchaseOrder) {
        var model = this._oCreateOrderDialog.getModel();

        var angnr = model.getProperty('/offer/angnr');
        model.setProperty('/poNumber', purchaseOrder);
        model.setProperty('/editable', false);
        this.byId('createOrdenBtn').setVisible(false);
        this.byId('closeCreateOrderBtn').setText(this._i18n.getText('Commons.0032'));
        this.byId('closeCreateOrderBtn').setType('Accept');
        return http.post("".concat(constant.api.PROCESS_PATH, "/").concat(this._numProc, "/").concat(constant.api.PURCHASE_ORDER), {
          angnr: angnr,
          purchaseOrder: purchaseOrder
        });
      }

      return Promise.resolve();
    },

    /**
     * @function
     * @name _checkImputationPercentageBeforeAdding
     * @description - Check imputation percentage before adding
     *
     * @private
     * @param {object} form - Imputation form
     * @returns {void} - Nothing to return
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _checkImputationPercentageBeforeAdding: function _checkImputationPercentageBeforeAdding(form) {
      var _formUtils$getFormDat = formUtils.getFormData(form),
          DISTR_PERC = _formUtils$getFormDat.DISTR_PERC;

      var model = this._oCreateImputacionDialog.getModel();

      var imputaciones = model.getProperty('/imputacion');
      var sum = imputaciones.reduce(function (acc, value) {
        return acc + parseFloat(value.DISTR_PERC);
      }, parseFloat(DISTR_PERC));

      if (sum > 100) {
        throw new Error(this._i18n.getText('0370'));
      }
    },

    /**
     * @function
     * @name _handleResponseDeleteSapOrder
     * @description - Handle response for delete sap order
     *
     * @private
     * @param {string} offerId - Offer id
     * @param {object} response - Response
     * @returns {Promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _handleResponseDeleteSapOrder: function _handleResponseDeleteSapOrder(offerId, _ref14) {
      var data = _ref14.data;
      var hasError = data.some(function (_ref15) {
        var TYPE = _ref15.TYPE;
        return TYPE === 'E';
      });
      this._oDeletePurchaseOrderNotifications = {
        notifications: data,
        state: hasError ? 'Error' : 'Success'
      };
      var promise = Promise.resolve();

      if (!hasError) {
        promise = http.post("".concat(constant.api.PROCESS_PATH, "/").concat(this._numProc, "/").concat(constant.api.DELETE_PURCHASE_ORDER), {
          angnr: offerId
        });
      }

      return promise;
    },

    /**
     * @function
     * @name _showNotifications
     * @description - Show the notifications
     *
     * @private
     * @returns {void} - Nothing to return
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _showNotifications: function _showNotifications() {
      var _this8 = this;

      var oView = this.getView();
      return Fragment.load({
        id: oView.getId(),
        name: 'com.innova.sigc.view.biddingProcess.dialog.order.ShowNotifications',
        controller: this
      }).then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control; // connect dialog to the root view of this component (models, lifecycle)

        oView.addDependent(oDialog);
        oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
        oDialog.attachAfterClose(oDialog.destroy.bind(oDialog));
        oDialog.setModel(new JSONModel(_this8._oDeletePurchaseOrderNotifications));

        var oMessageView = _this8.byId('messageView');

        var oBackButton = _this8.byId('backButton');

        oMessageView.attachItemSelect(oBackButton.setVisible.bind(oBackButton, true));
        oBackButton.attachPress(function () {
          oMessageView.navigateBack();
          oBackButton.setVisible(false);
        });
        _this8._oDeleteOrderDialog = oDialog;
        oDialog.open();
      });
    }
  };
});