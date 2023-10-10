"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sigc/factory/searchHelp/searchHelp', 'com/innova/sigc/lib/formUtils/formUtils', 'com/innova/sigc/model/constant', 'com/innova/sigc/model/searchHelp/SearchHelp', 'com/innova/sigc/service/petitions', 'com/innova/sigc/utils/hasAllPropsEmpty', 'com/innova/sigc/utils/keyBy', 'com/innova/sigc/utils/throwError', 'com/innova/sigc/utils/toLowerCase', 'com/innova/vendor/lodash.find', 'com/innova/vendor/lodash.get', 'sap/base/strings/formatMessage', 'sap/ui/core/Fragment', 'sap/ui/core/ListItem', 'sap/ui/model/Filter', 'sap/ui/model/FilterOperator', 'sap/ui/model/json/JSONModel'], function (factory, formUtils, constants, SearchHelp, petitions, hasAllPropsEmpty, keyBy, throwError, toLowerCase, find, get, formatMessage, Fragment, ListItem, Filter, FilterOperator, JSONModel) {
  var searchHelp = {
    factory: factory,

    /**
     * @function
     * @name getControlFieldname
     * @description - Get control fieldname
     *
     * @private
     * @param {any} control - Control
     * @returns {string} - Fieldname
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    getControlFieldname: function getControlFieldname(control) {
      var sName = control.getName();
      var sFieldname = control.data('fieldname');
      return sFieldname !== null && sFieldname !== void 0 ? sFieldname : sName;
    },

    /* =========================================================== */

    /* begin: event handlers                                       */

    /* =========================================================== */

    /**
     * @function
     * @name onValueHelpRequest
     * @description - Se encarga de realizar la busqueda de su respectiva ayuda
     *
     * @public
     * @param {sap.ui.base.Event} oEvent An Event object consisting of an id, a source and a map of parameters.
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onValueHelpRequest: function onValueHelpRequest(oEvent) {
      var oSource =
      /** @type {sap.m.Input} */
      oEvent.getSource();
      var name = searchHelp.getControlFieldname(oSource);
      this._oControlSHelp = oSource;
      var oReq = new SearchHelp(name.toUpperCase(), {
        FCAT: 'X'
      });
      Promise.resolve(oSource.setBusy(true)).then(petitions.post.bind(petitions, constants.GET_SEARCH_HELP, oReq)).then(function (_ref) {
        var data = _ref.data;
        return data;
      }).then(searchHelp._processDynamicData.bind(this)).then(searchHelp._showDynamicDialog.bind(this, oReq)).catch(this.errorHandler.bind(this)).then(oSource.setBusy.bind(oSource, false));
    },

    /**
     * @function
     * @name onValidateInputLiveChange
     * @description - Validate input live change event
     *
     * @public
     * @param {sap.ui.base.Event} oEvent An Event object consisting of an id, a source and a map of parameters.
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onValidateInputLiveChange: function onValidateInputLiveChange(oEvent) {
      var _this$byId;

      var oSource =
      /** @type {sap.m.Input} */
      oEvent.getSource();
      var disableButtonId = oSource.data('disableButtonId');
      (_this$byId = this.byId("".concat(disableButtonId))) === null || _this$byId === void 0 ? void 0 : _this$byId.setEnabled(false);
    },

    /**
     * @function
     * @name onValidateInputValue
     * @description - Validate the input value
     *
     * @public
     * @param {sap.ui.base.Event} oEvent An Event object consisting of an id, a source and a map of parameters.
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onValidateInputValue: function onValidateInputValue(oEvent) {
      var _this$byId2,
          _this = this;

      var oSource =
      /** @type {sap.m.Input} */
      oEvent.getSource();
      var value = toLowerCase(oSource.data('lowercase'), oSource.getValue());
      var disableButtonId = oSource.data('disableButtonId');
      oSource.setValueState(sap.ui.core.ValueState.None);
      (_this$byId2 = this.byId("".concat(disableButtonId))) === null || _this$byId2 === void 0 ? void 0 : _this$byId2.setEnabled(true);

      if (value) {
        var _this$oSource$data;

        var name = searchHelp.getControlFieldname(oSource);
        var promise = Promise.resolve();

        if (!this._oSearchHelpContext) {
          promise = searchHelp._validateValueInSearchHelp.call(this, {
            name: name,
            value: value
          }).then(function (data) {
            var suggestion =
            /** @type {object} */
            data;

            if (!suggestion) {
              oSource.setValueState(sap.ui.core.ValueState.Error);
              oSource.setValue(null);
            } else {
              _this._oSearchHelpContext = data;
            }

            oSource.setDescription(suggestion === null || suggestion === void 0 ? void 0 : suggestion.FTEXT);
          });
        }

        Promise.resolve(oSource.setBusy(true)).then(function () {
          return promise;
        }).then(this === null || this === void 0 ? void 0 : (_this$oSource$data = this[oSource.data('calledOnChange')]) === null || _this$oSource$data === void 0 ? void 0 : _this$oSource$data.bind(this, oSource)).catch(this.errorHandler.bind(this)).finally(function () {
          _this._oSearchHelpContext = null;
          oSource.setBusy(false);
        });
      } else {
        oSource.setDescription('');
      }
    },

    /**
     * @function
     * @name onSearch
     * @description - se encarga del filtro la lista del dialogo TableSelectDialog.
     *
     * @public
     * @param {sap.m.Input} oSource An Event object consisting of an id, a source and a map of parameters
     * @returns {void} - No retona nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onSearch: function onSearch(oSource, sQuery) {
      var aFilter = [];

      if (sQuery && sQuery.length > 0) {
        aFilter = searchHelp._getFilter(this._oControlSHelp.getName(), sQuery, oSource.getModel().getProperty('/catalog'));
      }

      var oBinding = searchHelp._getBindingItems.call(this, oSource);

      if (aFilter.length !== 0) {
        oBinding.filter(new Filter(aFilter, false));
      } else {
        oBinding.filter([]);
      }
    },

    /**
     * @function
     * @name onClose
     * @description - Se ejecuta cuando se selecciona o cierra el dialogo
     *
     * @public
     * @param {object[]} aContexts - Contexto del item seleccionado
     * @returns {void} - No retona nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onClose: function onClose() {
      var aContexts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      try {
        if (aContexts.length) {
          var typeOf = this._oControlSHelp.getMetadata().getName();

          var strategy = "_setValue".concat(typeOf.split('.').pop(), "Control");

          if (searchHelp["".concat(strategy)]) {
            searchHelp["".concat(strategy)].call(this, aContexts, this._oControlSHelp, this._sKeySHelp);
          }
        }

        this._sKeySHelp = null;
        this._oControlSHelp = null;
        searchHelp.onCloseDynamicDialog.call(this);
      } catch (error) {
        this.errorHandler(error);
      }
    },

    /**
     * @function
     * @name onConfirmSelectedOption
     * @description - Confirmar la selecciÃ³n de la tabla
     *
     * @public
     * @returns {void} - No retona nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onConfirmSelectedOption: function onConfirmSelectedOption() {
      try {
        var dynamicSHTable = this.byId('dynamicSHTable');
        var aSelectedItems = dynamicSHTable.getSelectedItems();

        if (aSelectedItems.length) {
          var typeOf = this._oControlSHelp.getMetadata().getName();

          var strategy = "_setValue".concat(typeOf.split('.').pop(), "Control");

          if (searchHelp["".concat(strategy)]) {
            searchHelp["".concat(strategy)].call(this, aSelectedItems, this._oControlSHelp, this._sKeySHelp);
          }

          this._sKeySHelp = null;
          this._oControlSHelp = null;
          searchHelp.onCloseDynamicDialog.call(this);
        }
      } catch (error) {
        this.errorHandler(error);
      }
    },

    /**
     * @function
     * @name onToggleFilters
     * @description - Mostrar/Oculta filtros personalizados
     *
     * @public
     * @param {boolean} pressed - Propiedad pressed
     * @returns {void} - No retona nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onToggleFilters: function onToggleFilters(pressed) {
      this.byId('SimpleFormSH').setVisible(pressed);
      this.byId('execButton').setVisible(pressed);
    },

    /**
     * @function
     * @name onCustomFilter
     * @description - Ejecutar filtro personalizado
     *
     * @public
     * @returns {void} - No retona nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onCustomFilter: function onCustomFilter() {
      var _this2 = this;

      try {
        var dynamicContainer = this.byId('dynamicContainer');
        var staticContainer = this.byId('staticContainer');
        var data = formUtils.getDataFromFields({
          formElements: [].concat(_toConsumableArray(dynamicContainer.getFormElements()), _toConsumableArray(staticContainer.getFormElements()))
        });
        throwError(hasAllPropsEmpty(data), this.getMessageTextPool('064'));
        var name = searchHelp.getControlFieldname(this._oControlSHelp);
        var oReq = new SearchHelp(name.toUpperCase());

        searchHelp._setRequestData(oReq, data);

        Promise.resolve(this._oDynamicDialog.setBusy(true)).then(petitions.post.bind(petitions, constants.GET_SEARCH_HELP, oReq)).then(function (res) {
          return res.data;
        }).then(searchHelp._processDynamicData.bind(this)).then(function (oModel) {
          // Destruir columnas si existen.
          _this2._oDynamicTable.destroyColumns();

          _this2._oDynamicTable.destroyItems(); // set model & bind Aggregation


          _this2._oDynamicDialog.setModel(oModel);
        }).catch(this.errorHandler.bind(this)).finally(this._oDynamicDialog.setBusy.bind(this._oDynamicDialog, false));
      } catch (e) {
        this.errorHandler(e);

        this._oDynamicDialog.setBusy(false);
      }
    },

    /**
     * @function
     * @name onCloseDynamicDialog
     * @description - Encargado de cerrar el dialogo de ayuda de busqueda dinamica
     *
     * @public
     * @returns {void} - No retorna nada
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onCloseDynamicDialog: function onCloseDynamicDialog() {
      if (this._oDynamicDialog) {
        this._oDynamicDialog.close();

        this._oDynamicDialog.destroy();

        this._oDynamicDialog = null;
      }
    },

    /* =========================================================== */

    /* finish: event handlers                                      */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: internal methods                                     */

    /* =========================================================== */

    /**
     * @function
     * @name _setSelected
     * @description - Establecer propiedad selected
     *
     * @private
     * @param {object[]} data - Data de la peticiÃ³n
     * @param {object} context - Data de la peticiÃ³n
     * @param {object[]} context.tokens - Tokens del control
     * @param {string} context.key - Llave
     *
     * @returns {object[]}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _setSelected: function _setSelected(data, _ref2) {
      var tokens = _ref2.tokens,
          key = _ref2.key;
      return data.map(function (item) {
        return _objectSpread(_objectSpread({}, item), {}, {
          selected: tokens.some(function (token) {
            return token.getKey() === item[key];
          })
        });
      });
    },

    /**
     * @function
     * @name _processDynamicData
     * @description - Procesa la data de la ayuda de busqueda dinamcia
     *
     * @private
     * @param {object} res - Contexto de la peticiÃ³n
     * @param {object} res.data - Datos de la ayuda de busqueda
     * @param {object} res.catalog - Catalogo de la ayuda de busqueda
     * @returns {sap.ui.model.json.JSONModel}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _processDynamicData: function _processDynamicData(res) {
      var catalog = keyBy(res.catalog, 'FIELDNAME');
      var data = res.data;
      var item = find(catalog, {
        F4AVAILABL: 'X'
      });
      this._sKeySHelp = item.FIELDNAME;

      if (this._oControlSHelp.getMetadata().getName() === 'sap.m.MultiInput') {
        data = searchHelp._setSelected(data, {
          tokens: this._oControlSHelp.getTokens(),
          key: this._sKeySHelp
        });
      }

      var sTextHelp = "".concat(catalog[this._sKeySHelp].SCRTEXT_L || catalog[this._sKeySHelp].REPTEXT);
      var title = '';

      if (data.length > 0) {
        title = formatMessage(this.getMessageTextPool('K304'), ["".concat(data.length), sTextHelp]);
      }

      return searchHelp._setSearchHelpModel.call(this, {
        catalog: catalog,
        data: data,
        title: title,
        lang: get(res, 'spras', []),
        shortTitle: sTextHelp
      });
    },

    /**
     * @function
     * @name _setSearchHelpModel
     * @description - Procesa la data de la ayuda de busqueda dinamcia
     *
     * @private
     * @param {object} context - Contexto de la peticiÃ³n
     * @param {object} context.catalog - Catalogo de la ayuda de busqueda
     * @param {object} context.data - Datos de la ayuda de busqueda
     * @param {object} context.lang - Textos
     * @param {object} context.title - Titulo del dialogo
     * @param {object} context.shortTitle - Titulo corto del dialogo
     * @returns {sap.ui.model.json.JSONModel}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _setSearchHelpModel: function _setSearchHelpModel(_ref3) {
      var catalog = _ref3.catalog,
          data = _ref3.data,
          _ref3$lang = _ref3.lang,
          lang = _ref3$lang === void 0 ? [] : _ref3$lang,
          title = _ref3.title,
          shortTitle = _ref3.shortTitle;
      var oModel = new JSONModel({
        catalog: catalog,
        data: data,
        lang: lang,
        properties: {
          key: this._sKeySHelp,
          shortTitle: "".concat(shortTitle),
          mode: this._oControlSHelp.data('multi') ? 'MultiSelect' : 'None',
          // Multi-select if required
          title: "".concat(title),
          visible: data.length > 0
        }
      });
      oModel.setSizeLimit(1000000);
      return oModel;
    },

    /**
     * @function
     * @name _showDynamicDialog
     * @description - se encarga de abrir el dialogo de ayuda de busqueda
     * dinamicas.
     *
     * @private
     * @param {object} oReq - Para conocer si muestra filtro o formulario de consulta
     * @param {JSONModel} oModel - Modelo para el dialogo.
     * @returns {void} - No retorna nada
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _showDynamicDialog: function _showDynamicDialog(oReq, oModel) {
      var _this3 = this;

      if (!this._oDynamicDialog) {
        Fragment.load({
          id: this.getView().getId(),
          name: 'com.innova.sigc.view.searchHelp.DynamicSearchHelpDialog',
          controller: this
        }).then(function (oDialog) {
          // connect dialog to the root view of this component (models, lifecycle)
          _this3.getView().addDependent(oDialog);

          oDialog.addStyleClass(_this3.getOwnerComponent().getContentDensityClass());
          _this3._oDynamicTable = _this3.byId('dynamicSHTable');

          _this3._oDynamicTable.bindAggregation('columns', {
            path: '/catalog',
            sorter: {
              path: 'COL_POS'
            },
            filter: [new Filter({
              path: 'TECH',
              operator: 'NE',
              value1: 'X'
            }), new Filter({
              path: 'NO_OUT',
              operator: 'NE',
              value1: 'X'
            })],
            factory: factory.sHelpColumnFactory(oModel.getProperty('/properties/key'))
          });

          _this3._oDynamicTable.bindItems({
            path: '/data',
            factory: factory.tableItemDynamicSH.call(_this3, '/catalog')
          });

          _this3._oRowsStepInput = _this3.byId('rows');
          _this3._oSprasComboBox = _this3.byId('spras');
          _this3.oSimpleFormSH = _this3.byId('SimpleFormSH');

          _this3.oSimpleFormSH.setVisible(true); // set model & bind Aggregation


          oDialog.setModel(oModel);
          _this3._oDynamicDialog = oDialog;

          _this3._oDynamicDialog.open();
        });
      } else {
        this._oRowsStepInput.setValue(20);

        this._oSprasComboBox.setSelectedKey('S'); // Destruir columnas si existen.


        this._oDynamicTable.destroyColumns();

        this._oDynamicTable.destroyItems(); // set model & bind Aggregation


        this._oDynamicDialog.setModel(oModel);

        this._oDynamicDialog.open();
      }
    },

    /**
     * @function
     * @name _getFilter
     * @description - Obtener filtro del campo
     *
     * @private
     * @param {string} name - Nombre del campo
     * @param {string} query - Valor a buscar
     * @param {object} catalog - Catalogo del campo
     * @returns {object[]}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _getFilter: function _getFilter(name, query) {
      var catalog = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var aFilter = [new Filter(name, "".concat(FilterOperator.Contains.toString()), "".concat(query))];
      var arr = Object.keys(catalog);

      if (arr.length) {
        aFilter = arr.filter(function (key) {
          return catalog[key].TECH !== 'X';
        }).map(function (element) {
          return new Filter(catalog[element].FIELDNAME, "".concat(FilterOperator.Contains.toString()), "".concat(query));
        });
      }

      return aFilter;
    },

    /**
     * @function
     * @name _getBindingItems
     * @description - Obtener enlace de los items de la tabla
     *
     * @private
     * @param {object} oSource - Control
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _getBindingItems: function _getBindingItems(oSource) {
      return oSource.getMetadata().getName() === 'sap.m.TableSelectDialog' ? oSource.getBinding('items') : this.byId('dynamicSHTable').getBinding('items');
    },

    /**
     * @function
     * @name _setRequestData
     * @description - Establecer datos del request
     *
     * @private
     * @param {object} req - Objecto request
     * @param {object} data - Datos
     * @returns {void} - No retorna nada
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _setRequestData: function _setRequestData(req, data) {
      return Object.entries(data).forEach(function (_ref4) {
        var _ref5 = _slicedToArray(_ref4, 2),
            key = _ref5[0],
            value = _ref5[1];

        return value && req["set".concat(key)](value);
      });
    },

    /**
     * @function
     * @name _getValue
     * @description - Obtiene el valor del campo seleccionado
     *
     * @private
     * @param {string} sValue - Arreglo de token ya seleccionados
     * @returns {string}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _getValue: function _getValue() {
      var sValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      return sValue !== '*' ? sValue.replace(/\*/g, '') : sValue;
    },

    /**
     * @function
     * @name _comparerTokens
     * @description - Comparar tokens con selecciÃ³n de la ayuda de busqueda
     *
     * @private
     * @param {object[]} otherArray - Arreglo de token ya seleccionados
     * @returns {function}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _comparerTokens: function _comparerTokens(otherArray) {
      return function (current) {
        return otherArray.filter(function (other) {
          return current === other.getKey();
        }).length === 0;
      };
    },

    /**
     * @function
     * @name _setValueInputControl
     * @description - Establecer el valor seleccionado en el control Input
     *
     * @private
     * @param {object[]} aContext - Contexto seleccionado
     * @param {sap.m.Input} oUIControl - Control
     * @param {string} sFieldname - Nombre del campo
     * @returns {void} - No retorna nada
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _setValueInputControl: function _setValueInputControl(aContext, oUIControl, sFieldname) {
      var _aContext = _slicedToArray(aContext, 1),
          context = _aContext[0];

      this._oSearchHelpContext = context.getObject();

      var sValue = searchHelp._getValue(context.getProperty(sFieldname));

      var description = context.getProperty('FTEXT');
      oUIControl.setValue(sValue);
      oUIControl.setDescription(description);
      oUIControl.destroySuggestionItems().addSuggestionItem(new ListItem({
        key: sValue,
        text: sValue
      }));
      oUIControl.setSelectedKey(sValue);
      oUIControl.fireChangeEvent(sValue);
    },

    /**
     * @function
     * @name _setValueMultiInputControl
     * @description - Establecer el valor seleccionado en el control MultiInput
     *
     * @private
     * @param {object[]} aContext - Contextos seleccionado
     * @param {sap.m.MultiInput} oUIControl - Control
     * @param {string} sFieldname - Nombre del campo
     *
     * @returns {void} - No retorna nada
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _setValueMultiInputControl: function _setValueMultiInputControl(aContext, oUIControl, sFieldname) {
      aContext.map(function (element) {
        return searchHelp._getValue(element[sFieldname] || element.getBindingContext().getProperty("".concat(element.getBindingContext(), "/").concat(sFieldname)));
      }) // @ts-ignore
      .filter(searchHelp._comparerTokens(oUIControl.getTokens())).forEach(function (data) {
        return oUIControl.addToken(new sap.m.Token({
          key: data,
          text: data
        }));
      });
      oUIControl.fireTokenUpdate({
        type: 'added'
      });
    },

    /**
     * @function
     * @name _validateValueInSearchHelp
     * @description - Establecer el valor seleccionado en el control MultiInput
     *
     * @private
     * @param {object} context - Contextos seleccionado
     * @param {object} context.name - Contextos seleccionado
     * @param {object} context.value - Contextos seleccionado
     *
     * @returns {Promise} - Promise
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _validateValueInSearchHelp: function _validateValueInSearchHelp(_ref6) {
      var name = _ref6.name,
          value = _ref6.value;
      var oReq = new SearchHelp(name.toUpperCase());
      oReq.setFCODE1(value);
      return petitions.post(constants.GET_SEARCH_HELP, oReq).then(function (_ref7) {
        var data = _ref7.data;
        var aData = get(data, 'data', []);
        var suggestion = find(aData, {
          FCODE1: value
        });
        return suggestion;
      });
    }
    /* =========================================================== */

    /* finish: internal methods                                    */

    /* =========================================================== */

  };
  return searchHelp;
});