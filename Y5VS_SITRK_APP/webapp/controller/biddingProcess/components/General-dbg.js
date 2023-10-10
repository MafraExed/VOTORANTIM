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

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sitrack/lib/formUtils/formUtils', 'com/innova/sitrack/lib/richTextEditor/editor', 'com/innova/sitrack/model/constant', 'com/innova/sitrack/model/purchaseTracking/Process2', 'com/innova/sitrack/model/purchaseTracking/TypesDocEnum', 'com/innova/sitrack/model/purchaseTracking/bidding/PositionSap', 'com/innova/sitrack/model/purchaseTracking/bidding/BiddingPosition', 'com/innova/sitrack/utils/showToast', 'com/innova/service/http', 'com/innova/vendor/moment', 'com/innova/util/isEmpty', 'sap/ui/core/ListItem'],
/**
 * @class
 * @name General.js
 * @description - Handler of the general for the process controller
 *
 * @param {object} constant
 * @param {typeof sap.ui.core.ListItem} ListItem
 *
 * @returns {object}
 *
 * @author Edwin Valencia <evalencia@innovainternacional.biz>
 * @version 0.5.0
 */
function (formUtils, editor, constant, Process, TypesDocEnum, PositionSap, BiddingPosition, showToast, http, moment, isEmpty, ListItem) {
  return {
    /* =========================================================== */

    /* begin: event handlers                                       */

    /* =========================================================== */

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
     * @version 0.5.0
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
     * @version 0.5.0
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
     * @version 0.5.0
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
     * @version 0.5.0
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
     * @version 0.5.0
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
     * @version 0.5.0
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
     * @version 0.5.0
     */
    onLimPregChange: function onLimPregChange(source, value) {
      var oLimOfertaDatePicker = this.byId('limOferta');
      var limOfertaValue = oLimOfertaDatePicker.getDateValue();

      if (isEmpty(limOfertaValue)) {
        source.setDateValue();
        showToast(this.getMessageTextPool('K369'));
      }

      var isAfter = moment(value, 'DD/MM/YYYY').isAfter(limOfertaValue);

      if (isAfter) {
        source.setDateValue();
        showToast(this.getMessageTextPool('K353'));
      }
    },

    /**
     * @function
     * @name onLimOfertaChange
     * @description - Handle the change on the LimOfer DatePicker.
     *
     * @public
     * @param {sap.m.DatePicker} source - DatePicker source
     * @param {Boolean} valid - Value of the DatePicker
     * @returns {void}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    onLimOfertaChange: function onLimOfertaChange(source, valid) {
      source.setValueState(sap.ui.core.ValueState.None);

      if (!valid) {
        source.setDateValue();
        source.setValueState(sap.ui.core.ValueState.Error);
        showToast(this.getMessageTextPool('K370'));
      }
    },

    /**
     * @function
     * @name onFechaEntregaChange
     * @description - Handle the change on the LimPreg DatePicker.
     *
     * @public
     * @param {sap.m.DatePicker} source - DatePicker source
     * @param {string} value - Value of the DatePicker
     * @returns {void}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    onFechaEntregaChange: function onFechaEntregaChange(source, value, valid) {
      source.setValueState(sap.ui.core.ValueState.None);
      var name = source.getName();
      var context = source.getBindingContext('store');
      var path = context.getPath();
      var model =
      /** @type{sap.ui.model.json.JSONModel} */
      context.getModel();

      if (!valid) {
        source.setDateValue();
        source.setValueState(sap.ui.core.ValueState.Error);
        model.setProperty("".concat(path, "/").concat(name), '');
        showToast(this.getMessageTextPool('K370'));
      } else {
        model.setProperty("".concat(path, "/").concat(name), value);
      }

      model.updateBindings(true);
      model.refresh();
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
     * @version 0.5.0
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

    /* =========================================================== */

    /* finish: event handlers                                      */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: internal methods                                     *
    /* =========================================================== */

    /**
     * @function
     * @name _createPositionsRequest
     * @description - crea los objetos para guardar las posiciones de la licitaciÃ³n
     *
     * @public
     * @returns {Object[]} - No retorna nada.
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    _createPositionsRequest: function _createPositionsRequest(_ref) {
      var _this = this;

      var data = _ref.data;
      this._oNumProcBidding = data.numProc;

      var positions = this._oStoreModel.getProperty('/processSelected');

      var dataBidding = positions.map(function (element, index) {
        return _objectSpread(_objectSpread({}, element), {}, {
          posProc: index + 1,
          processId: _this._oNumProcBidding
        });
      });
      var arrayPositionsRequest = [];
      dataBidding.forEach(function (element) {
        arrayPositionsRequest.push(http.post("".concat(constant.api.POSITION_BIDDING_PATH), new BiddingPosition(element)));
      });
      return arrayPositionsRequest;
    },

    /**
     * @function
     * @name _sendPositionBidding
     * @description - Envia las ofertas de los proveedores seleccionados.
     *
     * @private
     * @param {Promise[]}  arrayPositions - arreglo de peticiones para ofertas.
     * @returns {Promise}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    _sendPositionBidding: function _sendPositionBidding(arrayPositions) {
      return arrayPositions.reduce(function (acc, el) {
        return acc.then(function (res) {
          return el.then(function (resp) {
            return [].concat(_toConsumableArray(res), [resp]);
          });
        });
      }, Promise.resolve([]));
    },

    /**
     * @function
     * @name _handleResponse
     * @description - crea el objeto para guardar en sap la licitaciÃ³n
     *
     * @public
     * @returns {void} - No retorna nada.
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    _handleResponseToSap: function _handleResponseToSap(_ref2) {
      var _this2 = this;

      var data = _ref2.data;

      if (data.status === 'success') {
        this._oNumProcBidding = data.process.numProc;
      }

      var positions = this._oStoreModel.getProperty('/processSelected');

      var dataBidding = positions.map(function (element) {
        return {
          LICITA: _this2._oNumProcBidding,
          BANFN: element.BANFN,
          BNFPO: element.BNFPO
        };
      });
      return new PositionSap(dataBidding);
    },
    _oNavToPosition: function _oNavToPosition() {
      showToast("".concat(this.getMessageTextPool('K331')).concat(this._oNumProcBidding));
      this.onNavBackTable();
    },

    /**
     * @function
     * @name _renderEditors
     * @description - Re render editors
     *
     * @private
     * @returns {void} - Noting to return
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _renderEditors: function _renderEditors(_ref3) {
      var _this3 = this;

      var data = _ref3.data;
      setTimeout(function () {
        // remove all editors
        editor.removeEditorManager(); // Initialize invitation email editor

        _this3._oInvitationEmailEditor = editor.initializeQuillEditor.call(_this3, {
          container: _this3.byId('invitationEmailEditor').getDomRef(),
          placeholder: _this3.getMessageTextPool('K365'),
          setup: function setup(edtr) {
            edtr.on('init', function () {
              edtr.setContent(data.content);
            });
          }
        });

        _this3._oInvitationEmailEditor.render(); // Initialize editor oferentes


        _this3._oOferenteEditor = editor.initializeQuillEditor.call(_this3, {
          container: _this3.byId('editorOferente').getDomRef(),
          placeholder: _this3.getMessageTextPool('K285'),
          setup: function setup(edtr) {
            edtr.on('init', function () {
              edtr.setContent('');
            });
          }
        });

        _this3._oOferenteEditor.render(); // Initialize editor Interno


        _this3._oInternoEditor = editor.initializeQuillEditor({
          container: _this3.byId('editorInterno').getDomRef(),
          placeholder: _this3.getMessageTextPool('K286'),
          setup: function setup(edtr) {
            edtr.on('init', function () {
              edtr.setContent('');
            });
          }
        });

        _this3._oInternoEditor.render();
      }, 0);
    },

    /**
     * @function
     * @name _renderEditorsWithData
     * @description - Re render editors
     *
     * @private
     * @returns {void} - Noting to return
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _renderEditorsWithData: function _renderEditorsWithData() {
      var _this4 = this;

      setTimeout(function () {
        // remove all editors
        editor.removeEditorManager(); // Initialize invitation email editor

        _this4._oInvitationEmailEditor = editor.initializeQuillEditor.call(_this4, {
          container: _this4.byId('invitationEmailEditor').getDomRef(),
          placeholder: _this4.getMessageTextPool('K285'),
          setup: function setup(edtr) {
            edtr.on('init', function () {});
          }
        });

        _this4._oInvitationEmailEditor.render(); // Initialize editor oferentes


        _this4._oOferenteEditor = editor.initializeQuillEditor.call(_this4, {
          container: _this4.byId('editorOferente').getDomRef(),
          placeholder: _this4.getMessageTextPool('K285'),
          setup: function setup(edtr) {
            edtr.on('init', function () {});
          }
        });

        _this4._oOferenteEditor.render(); // Initialize editor Interno


        _this4._oInternoEditor = editor.initializeQuillEditor({
          container: _this4.byId('editorInterno').getDomRef(),
          placeholder: _this4.getMessageTextPool('K286'),
          setup: function setup(edtr) {
            edtr.on('init', function () {});
          }
        });

        _this4._oInternoEditor.render();
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
     * @version 0.5.0
     */
    _buildProcessObjToSave: function _buildProcessObjToSave() {
      var data = formUtils.getFormData(this._oGeneralForm);

      var positions = this._oStoreModel.getProperty('/processSelected');

      return new Process(_objectSpread(_objectSpread({}, data), {}, {
        ernamDesc: this.byId('oIErnamInput').getDescription(),
        tipoDoc: TypesDocEnum.LIC_COT,
        infoOferentes: this._oOferenteEditor.getContent(),
        infoInterno: this._oInternoEditor.getContent(),
        templateInvitation: this._oInvitationEmailEditor.getContent(),
        positions: positions
      }));
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
     * @version 0.5.0
     */
    _inputSuggest: function _inputSuggest(source, path) {
      http.get("".concat(path)).then(function (_ref4) {
        var data = _ref4.data;
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
     * @param {object[]} context.offers - Offers process
     * @returns {void} - Noting to return
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _validateProcessCurrency: function _validateProcessCurrency(_ref5) {
      var _ref5$offers = _ref5.offers,
          offers = _ref5$offers === void 0 ? [] : _ref5$offers;
      var hasPricesPerRound = offers.some(function (_ref6) {
        var pricesPerRound = _ref6.pricesPerRound;
        return pricesPerRound.length;
      });
      this.byId('processCurrency').setEnabled(!hasPricesPerRound);
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
     * @version 0.5.0
     */
    _validatePartialOffers: function _validatePartialOffers(_ref7) {
      var _ref7$offers = _ref7.offers,
          offers = _ref7$offers === void 0 ? [] : _ref7$offers;
      var hasOffers = offers.some(function (_ref8) {
        var positions = _ref8.positions;
        return positions.length;
      });
      this.byId('offerPartialSwitch').setEnabled(!hasOffers);
    }
    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

  };
});