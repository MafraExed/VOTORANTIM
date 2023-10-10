"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sigc/lib/formUtils/formUtils', 'com/innova/sigc/lib/richTextEditor/editor', 'com/innova/sigc/model/constant', 'com/innova/sigc/model/process/Process', 'com/innova/sigc/model/process/TypesDocEnum', 'com/innova/sigc/service/http', 'com/innova/sigc/utils/isEmpty', 'com/innova/sigc/utils/showToast', 'com/innova/vendor/moment', 'sap/ui/core/ListItem'],
/**
 * @class
 * @name General.js
 * @description - Handler of the general for the process controller
 *
 * @param {object} constant
 * @param {object} http
 * @param {typeof sap.ui.core.ListItem} ListItem
 *
 * @returns {object}
 *
 * @author Edwin Valencia <evalencia@innovainternacional.biz>
 * @version 1.0.0
 */
function (formUtils, editor, constant, Process, TypesDocEnum, http, isEmpty, showToast, moment, ListItem) {
  return {
    /* =========================================================== */

    /* begin: event handlers                                       */

    /* =========================================================== */

    /**
     * @function
     * @name onSave
     * @description - Save the Process.
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onSave: function onSave() {
      var _this = this;

      Promise.resolve(this._oPage.setBusy(true)).then(this._isValidForm.bind(this, this._oGeneralForm)).then(this._buildProcessObjToSave.bind(this)).then(this._saveOrUpdateProcess.bind(this)).then(function () {
        showToast(_this._i18n.getText('Commons.0021'));
      }).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
    },

    /**
     * @function
     * @name onTipoProcSuggest
     * @description - Suggest the TipoProc.
     *
     * @public
     * @param {sap.m.Input} source - Input source
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onTipoProcSuggest: function onTipoProcSuggest(source) {
      this._inputSuggest(source, constant.api.PROCESS_TYPE_PATH);
    },

    /**
     * @function
     * @name onCategorySuggest
     * @description - Suggest the Category.
     *
     * @public
     * @param {sap.m.Input} source - Input source
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onCategorySuggest: function onCategorySuggest(source) {
      this._inputSuggest(source, constant.api.PROCESS_CATEGORY_PATH);
    },

    /**
     * @function
     * @name onCondNegocChange
     * @description -  Manage the change on the CondNego Switch.
     *  If true show the DZTERM field, by default false.
     *  DZTERM by default hidden.
     *
     * @public
     * @param {boolean} state - Estado del switch
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onCondNegocChange: function onCondNegocChange(state) {
      this.byId('dztermFormContainer').setVisible(!state);
    },

    /**
     * @function
     * @name onValRfiChange
     * @description -  Manage the change on the ValRfi Switch.
     *  If true show the NUM_RFI field, by default false.
     *  NUM_RFI by default hidden.
     *
     * @public
     * @param {boolean} state - Estado del switch
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onValRfiChange: function onValRfiChange(state) {
      this.byId('numRfiFormContainer').setVisible(state);
    },

    /**
     * @function
     * @name onPregRespChange
     * @description -  Manage the change on the PregResp Switch.
     *  If true show the LIM_PREG field, by default false.
     *  LIM_PREG by default hidden.
     *
     * @public
     * @param {boolean} state - Estado del switch
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onPregRespChange: function onPregRespChange(state) {
      this.byId('limPregFormContainer').setVisible(state);
    },

    /**
     * @function
     * @name onSuggestionItemSelected
     * @description - Suggest item selected.
     *
     * @public
     * @param {sap.m.Input} source - Input source
     * @param {sap.ui.core.ListItem} selectedItem - Item selected
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onSuggestionItemSelected: function onSuggestionItemSelected(source, selectedItem) {
      source.setValue(selectedItem.getText());
    },

    /**
     * @function
     * @name onLimPregChange
     * @description - Handle the change on the LimPreg DatePicker.
     *
     * @public
     * @param {sap.m.DatePicker} source - DatePicker source
     * @param {string} value - Value of the DatePicker
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onLimPregChange: function onLimPregChange(source, value) {
      var oLimOfertaDatePicker = this.byId('limOferta');
      var limOfertaValue = oLimOfertaDatePicker.getDateValue();
      var isAfter = moment(value).isAfter(limOfertaValue);

      if (isAfter) {
        source.setDateValue();
        showToast(this._i18n.getText('0308'));
      }
    },

    /**
     * @function
     * @name onValidateCurrency
     * @description - Handle the change on the Currency Input.
     *
     * @public
     * @param {sap.m.Input} source - Input source
     * @param {string} value - Value of the DatePicker
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onValidateCurrency: function onValidateCurrency(source, value) {
      var _this$byId;

      var excludeInput = this.byId("".concat(source.data('exclude')));
      var disableButtonId = source.data('disableButtonId');
      var isEmptyValue = isEmpty(value);
      (_this$byId = this.byId("".concat(disableButtonId))) === null || _this$byId === void 0 ? void 0 : _this$byId.setEnabled(true);
      source.setValueState(sap.ui.core.ValueState.None);

      if (isEmptyValue) {
        source.setDescription('');
        source.setValue('');
        excludeInput.setValueState(sap.ui.core.ValueState.None);
        excludeInput.setRequired(isEmptyValue);
        excludeInput.setEditable(isEmptyValue);
        excludeInput.getParent().getParent().setVisible(true);
      } else {
        var name = this.searchHelp.getControlFieldname(source);
        Promise.resolve(source.setBusy(true)).then(this.searchHelp._validateValueInSearchHelp.bind(this, {
          name: name,
          value: value.toUpperCase()
        })).then(function (data) {
          var suggestion =
          /** @type {object} */
          data;

          if (!suggestion) {
            isEmptyValue = true;
            source.setValueState(sap.ui.core.ValueState.Error);
            source.setValue(null);
          }

          source.setValue(value.toUpperCase());
          source.setDescription(suggestion === null || suggestion === void 0 ? void 0 : suggestion.FTEXT);
          excludeInput.setValueState(sap.ui.core.ValueState.None);
          excludeInput.setRequired(isEmptyValue);
          excludeInput.setEditable(isEmptyValue);
        }).catch(this.errorHandler.bind(this)).finally(source.setBusy.bind(source, false));
      }
    },

    /**
     * @function
     * @name onChangeErnam
     * @description - Handle the change on the Ernam Input.
     *
     * @public
     * @param {sap.m.Input} oSource - Input source
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onChangeErnam: function onChangeErnam(oSource) {
      oSource.setValueState(sap.ui.core.ValueState.None);

      if (this._oSearchHelpContext) {
        var _this$_oSearchHelpCon;

        var oAdSmtpadr = this.byId('oIEmailManage'); // Correo de la persona que selecciono en el search help

        oAdSmtpadr.setValue((_this$_oSearchHelpCon = this._oSearchHelpContext) === null || _this$_oSearchHelpCon === void 0 ? void 0 : _this$_oSearchHelpCon.FCODE2);
        this._oSearchHelpContext = null;
      }
    },

    /* =========================================================== */

    /* finish: event handlers                                      */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: internal methods                                     *
    /* =========================================================== */

    /**
     * @function
     * @name _renderEditors
     * @description - Re render editors
     *
     * @private
     * @returns {void} - Noting to return
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _renderEditors: function _renderEditors() {
      var _this2 = this;

      setTimeout(function () {
        // remove all editors
        editor.removeEditorManager(); // Initialize invitation email editor

        _this2._oInvitationEmailEditor = editor.initializeQuillEditor.call(_this2, {
          container: _this2.byId('invitationEmailEditor').getDomRef(),
          placeholder: _this2._i18n.getText('0314'),
          setup: function setup(edtr) {
            edtr.on('init', function () {
              edtr.setContent(_this2._oFormModel.getProperty('/templateInvitation') || '');
            });
          }
        });

        _this2._oInvitationEmailEditor.render(); // Initialize editor oferentes


        _this2._oOferenteEditor = editor.initializeQuillEditor.call(_this2, {
          container: _this2.byId('editorOferente').getDomRef(),
          placeholder: _this2._i18n.getText('0080'),
          setup: function setup(edtr) {
            edtr.on('init', function () {
              edtr.setContent(_this2._oFormModel.getProperty('/infoOferentes') || '');
            });
          }
        });

        _this2._oOferenteEditor.render(); // Initialize editor Interno


        _this2._oInternoEditor = editor.initializeQuillEditor({
          container: _this2.byId('editorInterno').getDomRef(),
          placeholder: _this2._i18n.getText('0081'),
          setup: function setup(edtr) {
            edtr.on('init', function () {
              edtr.setContent(_this2._oFormModel.getProperty('/infoInterno') || '');
            });
          }
        });

        _this2._oInternoEditor.render();
      }, 0);
    },

    /**
     * @function
     * @name _buildProcessObjToSave
     * @description - Build process object to save.
     *
     * @private
     * @returns {Process}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildProcessObjToSave: function _buildProcessObjToSave() {
      var data = formUtils.getFormData(this._oGeneralForm);
      return new Process(_objectSpread(_objectSpread({}, data), {}, {
        tipoDoc: TypesDocEnum.LIC_COT,
        infoOferentes: this._oOferenteEditor.getContent(),
        infoInterno: this._oInternoEditor.getContent(),
        templateInvitation: this._oInvitationEmailEditor.getContent()
      }));
    },

    /**
     * @function
     * @name _saveOrUpdateProcess
     * @description - Save or update process.
     *
     * @private
     * @param {Process} process - Process to save or update
     * @returns {Promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _saveOrUpdateProcess: function _saveOrUpdateProcess(process) {
      var _this3 = this;

      if (this._numProc) {
        return http.update("".concat(constant.api.PROCESS_PATH, "/").concat(this._numProc), process);
      }

      return http.post(constant.api.PROCESS_PATH, process).then(function (_ref) {
        var data = _ref.data;
        var numProc = data.numProc;

        _this3.getRouter().navTo('manageBiddingProcess', {
          query: window.encodeURIComponent(numProc)
        }, {}, true);
      });
    },

    /**
     * @function
     * @name _inputSuggest
     * @description - Suggestion for Inputs.
     *
     * @private
     * @param {sap.m.Input} source - Input source
     * @param {string} path - Path request
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _inputSuggest: function _inputSuggest(source, path) {
      http.get("".concat(path)).then(function (_ref2) {
        var data = _ref2.data;
        return data;
      }).then(function (data) {
        source.destroySuggestionItems();
        data.forEach(function (item) {
          source.addSuggestionItem(new ListItem({
            key: item.id,
            text: item.description,
            additionalText: item.id
          }));
        });
      }).catch(this.errorHandler.bind(this));
    },

    /**
     * @function
     * @name _validateProcessCurrency
     * @description - Validate process currency
     *
     * @private
     * @param {object} context
     * @param {string} context.waers - Currency process
     * @param {string} context.conversionCurrency - Currency conversion process
     * @param {object[]} context.offers - Offers process
     * @returns {void} - Noting to return
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _validateProcessCurrency: function _validateProcessCurrency(_ref3) {
      var _ref3$offers = _ref3.offers,
          offers = _ref3$offers === void 0 ? [] : _ref3$offers,
          waers = _ref3.waers,
          conversionCurrency = _ref3.conversionCurrency;

      if (!isEmpty(conversionCurrency)) {
        this.byId('processCurrency').setRequired(false);
        this.byId('processCurrency').setEditable(false);
        this.byId('waersContainer').setVisible(false);
      } else if (!isEmpty(waers)) {
        var hasPricesPerRound = offers.some(function (_ref4) {
          var pricesPerRound = _ref4.pricesPerRound;
          return pricesPerRound.length;
        });
        this.byId('processCurrency').setEditable(!hasPricesPerRound);
        this.byId('processCurrency').setRequired(true);
        this.byId('processConversionCurrency').setRequired(false);
        this.byId('processConversionCurrency').setEditable(false);
        this.byId('conversionCurrencyContainer').setVisible(false);
      }
    },

    /**
     * @function
     * @name _validatePartialOffers
     * @description - Validate partial offers
     *
     * @private
     * @param {object} context
     * @param {object[]} context.offers - Offers process
     * @returns {void} - Noting to return
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _validatePartialOffers: function _validatePartialOffers(_ref5) {
      var _ref5$offers = _ref5.offers,
          offers = _ref5$offers === void 0 ? [] : _ref5$offers;
      var hasOffers = offers.some(function (_ref6) {
        var positions = _ref6.positions;
        return positions.length;
      });
      this.byId('offerPartialSwitch').setEnabled(!hasOffers);
    },

    /**
     * @function
     * @name _loadItemsRespJuridico
     * @description - Load items for legal evaluator.
     *
     * @private
     * @returns {Promise} - Returns a promise.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _loadItemsRespJuridico: function _loadItemsRespJuridico() {
      var _this4 = this;

      return http.get(constant.api.EVALUATORS_PATH).then(function (_ref7) {
        var data = _ref7.data;

        _this4._oFormModel.setProperty('/valueHelp/respJuridico', data.filter(function (_ref8) {
          var role = _ref8.role,
              status = _ref8.status;
          return role.includes('LEGAL_EVALUATOR') && status === 'Verified';
        }));
      });
    },

    /**
     * @function
     * @name _loadItemsRespTecnico
     * @description - Load items for technical evaluator.
     *
     * @private
     * @returns {Promise} - Returns a promise.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _loadItemsRespTecnico: function _loadItemsRespTecnico() {
      var _this5 = this;

      return http.get(constant.api.EVALUATORS_PATH).then(function (_ref9) {
        var data = _ref9.data;

        _this5._oFormModel.setProperty('/valueHelp/respTecnico', data.filter(function (_ref10) {
          var role = _ref10.role,
              status = _ref10.status;
          return role.includes('TECHNICAL_EVALUATOR') && status === 'Verified';
        }));
      });
    }
    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

  };
});