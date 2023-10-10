"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

sap.ui.define(['./AdditionalInformation', './Commercial', './Technical', './Summary', 'com/innova/sigc/model/constant', 'com/innova/sigc/service/petitions', 'com/innova/sigc/utils/parseUniversalDate', 'sap/ui/core/Fragment', 'sap/ui/model/json/JSONModel'], function (AdditionalInformation, Commercial, Technical, Summary, constant, petitions, parseUniversalDate, Fragment, JSONModel) {
  return _objectSpread(_objectSpread(_objectSpread(_objectSpread({
    /* =========================================================== */

    /* begin: event handlers                                       */

    /* =========================================================== */

    /**
     * @function
     * @name onShowPositionComments
     * @description - Handler for show position comments
     *
     * @public
     * @param {object} context - Context binding
     * @param {object} context.commentsByPosition - Comments by position
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onShowPositionComments: function onShowPositionComments(_ref) {
      var _this = this;

      var commentsByPosition = _ref.commentsByPosition;
      var oView = this.getView();
      Fragment.load({
        id: oView.getId(),
        name: 'com.innova.sigc.view.biddingProcess.dialog.qualification.SeePositionComments',
        controller: this
      }).then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control; // connect dialog to the root view of this component (models, lifecycle)

        oView.addDependent(oDialog);
        oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
        _this._oRejectOfferDialog = oDialog;

        _this._oRejectOfferDialog.setModel(new JSONModel({
          comments: commentsByPosition.comments
        }));

        oDialog.attachAfterClose(oDialog.destroy.bind(oDialog));
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
     * @name _fetchQualifications
     * @description - Fetch API to get the commercial qualification
     *
     * @private
     * @returns {promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _fetchQualifications: function _fetchQualifications() {
      var oIconTabBar = this.byId('qualificationsIconTabBar');
      oIconTabBar.setSelectedKey('commercialQualification');

      this._validateEvaluationCriteria(oIconTabBar);

      return this._fetchCommercialQualifications();
    },

    /**
     * @function
     * @name _validateEvaluationCriteria
     * @description - Validate evaluation criteria
     *
     * @private
     * @returns {void} Nothing to return
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _validateEvaluationCriteria: function _validateEvaluationCriteria(oIconTabBar) {
      var _this$_sumOfEvaluatio = this._sumOfEvaluationCriteria(this._oFormModel.getProperty("/evaluationCriteria")),
          sumCommercialEval = _this$_sumOfEvaluatio.sumCommercialEval,
          sumTechEval = _this$_sumOfEvaluatio.sumTechEval;

      var oRadioButtonEvaluation = this.byId('oRBEvaluation');
      var isValid;

      if (oRadioButtonEvaluation.getSelectedIndex() === 0) {
        // Se quita validaciÃ³n de que los tÃ©cnicos pueden ser igual a cero
        isValid = sumTechEval === 100 && sumCommercialEval === 100;
        oIconTabBar.setBlocked(!isValid);
        oIconTabBar.setExpanded(isValid);

        if (!isValid) {
          throw new Error(this._i18n.getText('0363'));
        }
      } else {
        var sumaComercialTech = sumCommercialEval + sumTechEval;
        isValid = sumaComercialTech === 100;
        oIconTabBar.setBlocked(!isValid);
        oIconTabBar.setExpanded(isValid);

        if (!isValid) {
          throw new Error(this._i18n.getText('0362'));
        }
      }
    },

    /**
     * @function
     * @name _getDefaultQualificationColumns
     * @description - Get the default columns
     *
     * @private
     * @returns {object[]}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _getDefaultQualificationColumns: function _getDefaultQualificationColumns() {
      var criteriaColumns = [{
        label: this.getResourceBundle().getText('0053'),
        mergeDuplicates: false,
        name: 'criterio',
        template: 'Criterio'
      }, {
        label: this.getResourceBundle().getText('0057'),
        mergeDuplicates: false,
        name: 'pesoValor',
        template: 'PesoValor'
      }];
      var posColumns = [{
        label: this.getResourceBundle().getText('0083'),
        mergeDuplicates: true,
        name: 'posProc',
        template: 'PosProc'
      }, {
        label: this.getResourceBundle().getText('0039'),
        mergeDuplicates: true,
        mergeFunctionName: 'getTitle',
        name: 'matnr',
        template: 'Matnr'
      }];
      var headerColumns = [].concat(criteriaColumns);
      var positionColumns = posColumns.concat(criteriaColumns);
      var summaryPosColumns = posColumns.concat([{
        label: this.getResourceBundle().getText('0042'),
        mergeDuplicates: true,
        name: 'menge',
        template: 'menge'
      }, {
        label: this.getResourceBundle().getText('0143'),
        mergeDuplicates: true,
        name: 'state',
        template: 'state'
      }]);
      return [headerColumns, positionColumns, summaryPosColumns];
    },

    /**
     * @function
     * @name _mapEvaluationCriteria
     * @description - Map the evaluation criteria
     *
     * @private
     * @param {object} criteria - Criteria to map
     * @returns {object} - Mapped criteria
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _mapEvaluationCriteria: function _mapEvaluationCriteria(criteria) {
      return {
        criteriaId: criteria.id,
        criterio: criteria.criterio,
        entradaProveedor: criteria.entradaProveedor,
        pesoValor: criteria.pesoValor,
        valoracion: criteria.valoracion,
        tipo: criteria.tipo
      };
    },

    /**
     * @function
     * @name _getItemsUpdatedQualification
     * @description - Get items updated
     *
     * @private
     * @param {string} id - The id of the table
     * @returns {object[]}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _getItemsUpdatedQualification: function _getItemsUpdatedQualification(id) {
      var updatedItems = this.byId(id).getItems().filter(function (oItem) {
        return oItem.getBindingContext().getProperty('isUpdated');
      });

      if (!updatedItems.length) {
        throw new Error(this.getResourceBundle().getText('Commons.0026'));
      }

      this._oQualificationItems = updatedItems;
      return updatedItems;
    },

    /**
     * @function
     * @name _getItemsSelectedQualification
     * @description - get items selected
     *
     * @private
     * @param {string} id - The id of the table
     * @returns {object[]}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _getItemsSelectedQualification: function _getItemsSelectedQualification(id) {
      var selectedItems = this.byId(id).getItems().filter(function (oItem) {
        return oItem.getBindingContext().getProperty('selected');
      });

      if (!selectedItems.length) {
        throw new Error(this.getResourceBundle().getText('Commons.0022'));
      }

      this._aQualificationItems = selectedItems;
      return selectedItems;
    },

    /**
     * @function
     * @name _fetchWithConversionCurrency
     * @description -Fetch API to get the global calification with the conversion currency
     *
     * @private
     * @param {object} params - The params of the fetch
     * @param {object[]} params.offers - Offers
     * @param {string} params.conversionCurrency - Conversion currency
     * @param {string} params.conversionDate - Conversion date
     * @returns {Promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _fetchWithConversionCurrency: function _fetchWithConversionCurrency(_ref2) {
      var _this2 = this;

      var offers = _ref2.offers,
          conversionCurrency = _ref2.conversionCurrency,
          conversionDate = _ref2.conversionDate;
      var coin = [];
      offers.forEach(function (offer) {
        offer.pricesPerRound.forEach(function (pricesPerRound) {
          coin.push(pricesPerRound.waers);
        });
      });
      var date = conversionDate ? parseUniversalDate(conversionDate) : new Date();
      return petitions.post(constant.GET_CONVERT_TO_CURRENCY, {
        IV_DATE: date.toISOString().replace(/T.+/, ''),
        IT_FOREIGN: _toConsumableArray(new Set(coin)).map(function (el) {
          return {
            WAERS: el
          };
        }),
        IV_LOCAL: conversionCurrency
      }).then(function (_ref3) {
        var data = _ref3.data;
        var req = {
          currencyBase: conversionCurrency,
          rates: coin.map(function (el) {
            var _data$find;

            var currency = (_data$find = data.find(function (el2) {
              return el2.FCURR === el;
            })) !== null && _data$find !== void 0 ? _data$find : {
              FCURR: el,
              UKURS: 1
            };
            return {
              currency: currency.FCURR,
              value: currency.UKURS
            };
          })
        };
        _this2._oConversionCurrency = req;
        return req;
      });
    }
  }, AdditionalInformation), Commercial), Technical), Summary);
});