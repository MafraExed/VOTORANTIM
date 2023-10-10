"use strict";

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
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['../BaseController', 'com/innova/formatter/hasSearchHelp', 'com/innova/formatter/maxLength', 'com/innova/lib/formUtils/formUtils', 'com/innova/lib/searchHelp/searchHelp', 'com/innova/lib/variant/variant', 'com/innova/model/constant', 'com/innova/model/purchaseTracking/Process', 'com/innova/service/petitions', 'com/innova/util/isEmpty', 'sap/ui/model/json/JSONModel'],
/**
 * Module dependencies
 *
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel
 */
function (BaseController, hasSearchHelp, maxLength, formUtils, searchHelp, variant, constant, Process, petitions, isEmpty, JSONModel) {
  return (
    /**
     * @class
     * @name Form.controller.js
     * @description - Controlador del formulario de tracking de compras
     *
     * @constructor
     * @public
     * @alias com.innova.sitrack.controller.purchaseTracking
     *
     * @param {String} sId - id for the new control, generated automatically if no id is given
     * @param {Object} mSettings - initial settings for the new control
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    BaseController.extend('com.innova.sitrack.controller.purchaseTracking.Form', {
      hasSearchHelp: hasSearchHelp,
      maxLength: maxLength,
      searchHelp: searchHelp,
      variant: variant,

      /* =========================================================== */

      /* begin: lifecycle methods                                    */

      /* =========================================================== */

      /**
       * @function
       * @name onInit
       * @description - Se ejecuta despuÃ©s de que se renderizo la vista.
       *
       * @private
       * @returns {void} - No retorna nada.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      onInit: function onInit() {
        this._oReq = {};
        this._keys = [];
        this._oPage = this.byId('page');
        this._oSolPedList = this.byId('solPedList');
        this._oSolPedPanel = this.byId('solPedPanel');
        this._oPedList = this.byId('pedList');
        this._oSelectList = this.byId('selectList');
        this._oSolPaymentList = this.byId('solPaymentList');
        this._oPedElementPepForm = this.byId('FormElementPEP');
        this._oSolPedElementPepForm = this.byId('FormSolPedElementPEP');
        this._oRouter = this.getRouter();

        this._oRouter.getRoute('purchaseTracking').attachMatched(this._onRouteMatched, this);

        this._createDataModel();
      },

      /**
       * @function
       * @name onAfterRendering
       * @description - Se ejecuta despuÃ©s de que se renderizo la vista.
       *
       * @private
       * @returns {void} - No retorna nada.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      onAfterRendering: function onAfterRendering() {
        // Enlazar los datos de los componentes de la vista.
        this._bindView();
      },

      /**
       * @function
       * @name validateTipoImputacionPEP
       * @description - Se ejecuta al agregar algun token al multiinput de Tipo de ImputaciÃ³n.
       *
       * @private
       * @returns {void} - No retorna nada.
       *
       * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
       * @version 0.5.0
       */
      validateTipoImputacionPEP: function validateTipoImputacionPEP(evt) {
        var _this = this;

        var tokensEvent = evt.getParameters();
        var idTokenEvent = evt.getSource().getId();

        if (tokensEvent.type === 'added') {
          var tokensAdded = evt.getSource().getTokens();
          tokensAdded.forEach(function (element) {
            if (element.getKey() === 'P') {
              if (idTokenEvent === 'container-sitrack---purchaseTrackingForm--multiInputKNTTP2') {
                _this._oPedElementPepForm.setVisible(true);
              } else {
                _this._oSolPedElementPepForm.setVisible(true);
              }
            }
          });
        } else {
          var tokensDeleted = tokensEvent.removedTokens;

          if (tokensDeleted) {
            if (tokensDeleted[0].getKey() === 'P') {
              if (idTokenEvent === 'container-sitrack---purchaseTrackingForm--multiInputKNTTP2') {
                this._oPedElementPepForm.setVisible(false);
              } else {
                this._oSolPedElementPepForm.setVisible(false);
              }
            }
          }
        }
      },

      /* =========================================================== */

      /* finish: lifecycle methods                                   */

      /* =========================================================== */

      /* =========================================================== */

      /* begin: internal methods                                     *
      /* =========================================================== */

      /**
       * @function
       * @name _onRouteMatched
       * @description - Se ejecuta cuando se navega a la vista.
       *
       * @private
       * @returns {void} - No retorna nada.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _onRouteMatched: function _onRouteMatched() {
        var oMainModel = this.getModel('main');
        this._showPayment = oMainModel.getProperty('/showPayment');

        if (this.getModel('appView').getProperty('/resetProcessForm')) {
          this.onReset();
          variant.onGetDefaultVariant.call(this);
        }
      },

      /**
       * @function
       * @name _bindView
       * @description - Enlazar los datos de los componentes de la vista.
       *
       * @private
       * @returns {void} - No retorna nada.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _bindView: function _bindView() {
        try {
          formUtils.addValidatorAllMultiInputs({
            fields: this.byId('container').getControlsByFieldGroupId('groupMultiInput')
          });
        } catch (error) {
          this.errorHandler(error);
        }
      },

      /**
       * @function
       * @name _createDataModel
       * @description - Crear modelo de datos
       *
       * @private
       * @returns {void} - No retorna nada.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _createDataModel: function _createDataModel() {
        this._oDataModel = new JSONModel({
          TABNAME: {
            solPed: 'EBAN',
            ped: 'EKKO',
            pedPosition: 'EKPO',
            solPedElementPep: 'EBKN',
            pedElementPep: 'EKKN'
          },
          DRS: {
            delimiter: '-',
            displayFormat: 'dd/MM/yyyy',
            valueFormat: 'yyyy-MM-dd'
          },
          IV_SOLP_STALIB: {
            child1: false,
            child2: false,
            child3: false
          },
          IV_SOLP_ESTP: {
            child1: false,
            child2: false,
            child3: false
          },
          IV_PED_LIV: {
            child1: false,
            child2: false,
            child3: false
          },
          IV_SOLP_CLOSED: {
            child1: false,
            child2: false
          },
          IV_PED_STALIB: {
            child1: false,
            child2: false,
            child3: false
          },
          SDP_PAYSTATUS: {
            child1: false,
            child2: false,
            child3: false,
            child4: false,
            child5: false,
            child6: false,
            child7: false,
            child8: false
          },
          IV_PED_EM: {
            child1: false,
            child2: false,
            child3: false
          },
          IV_PED_COMPL: {
            child1: false,
            child2: false
          },
          IR_PED_LIV: {
            child1: false,
            child2: false,
            child3: false
          }
        });
        this.setModel(this._oDataModel, 'data');
      },

      /**
       * @function
       * @name _buildRequest
       * @description - Construir objeto request
       *
       * @private
       * @param {object[]} items - Elementos de la lista
       * @returns {void} - No retorna nada
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _buildRequest: function _buildRequest(items) {
        var _this2 = this;

        var isIndicators = '';

        if (this.byId('reportSegmentButton').getSelectedKey() === 'indicators') {
          isIndicators = 'X';
        }

        var req = {
          IV_INDIC_STK: isIndicators
        };
        items.forEach(function (listItem) {
          var fieldGroupId = listItem.data('to');

          var container = _this2.byId(fieldGroupId);

          if (container) {
            var parent = container.data('parent');
            var data = formUtils.getDataFromFields({
              formElements: container.getFormElements()
            });

            if (parent) {
              var _req, _ref, _req$_ref, _req$;

              (_req$_ref = (_req = req)[_ref = "".concat(parent)]) !== null && _req$_ref !== void 0 ? _req$_ref : _req[_ref] = [];
              req["".concat(parent)] = (_req$ = req["".concat(parent)]).concat.apply(_req$, _toConsumableArray(Object.values(data)));
            } else {
              req = _objectSpread(_objectSpread({}, req), data);
            }
          }
        });
        this._oReq = new Process(req, this.byId('reportSegmentButton').getSelectedKey());
      },

      /**
       * @function
       * @name _fetchKeys
       * @description - Buscar llaves
       *
       * @private
       * @returns {Promise}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _fetchKeys: function _fetchKeys() {
        var requestOnlyKeys = JSON.parse(JSON.stringify(this._oReq));
        requestOnlyKeys.IV_ONLYKEYS = 'X';
        return petitions.post("".concat(constant.GET_PROCESS_SELECTED), requestOnlyKeys);
      },

      /**
       * @function
       * @name _validateKeys
       * @description - Validar las llaves
       *
       * @private
       * @param {object} context
       * @param {object} context.data - Objeto del req
       * @returns {Promise}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _validateKeys: function _validateKeys(_ref2) {
        var data = _ref2.data;

        if (isEmpty(data.dockeys)) {
          return Promise.reject(new Error(this.getMessageTextPool('K060')));
        }

        this._keys = data.dockeys;
        return Promise.resolve();
      },

      /**
       * @function
       * @name _handleResponse
       * @description - Maneja la respuesta del servicio
       *
       * @private
       * @returns {void} - No retorna nada
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _handleResponse: function _handleResponse() {
        var store = this.getModel('store');
        store.setProperty('/req', this._oReq);
        store.setProperty('/keys', this._keys);

        if (this._oReq.IV_INDIC_STK === 'X') {
          this._oRouter.navTo('purchaseTrackingIndicators');
        } else {
          this._oRouter.navTo('purchaseTrackingProcess');
        }
      },

      /**
       * @function
       * @name _getFormDataForVariant
       * @description - Obtener datos del formulario para variantes
       *
       * @private
       * @returns {void}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _getFormDataForVariant: function _getFormDataForVariant() {
        var _this3 = this;

        var listItems = this._getSelectedItems();

        var items = [];
        listItems.forEach(function (listItem) {
          var fieldGroupId = listItem.data('to');

          var container = _this3.byId(fieldGroupId);

          if (container) {
            var data = formUtils.getDataFromFields({
              formElements: container.getFormElements(),
              functionName: _this3._sVariantFunction,
              group: fieldGroupId,
              isVariant: true
            });

            if (!isEmpty(data)) {
              items = items.concat(Object.values(data).reduce(function (acc, el) {
                return acc.concat(el);
              }, []));
            }
          }
        });
        this._aVariantItems = items;
      },

      /**
       * @function
       * @name _bindVariantData
       * @description - Enlazar datos de la variante
       *
       * @private
       * @param {object} context
       * @param {object} context.data - Nombre
       * @returns {void} - No retorna nada
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _bindVariantData: function _bindVariantData(_ref3) {
        var _this4 = this;

        var data = _ref3.data;
        var items = data.variant;
        this.onReset();

        if (items) {
          if (items.length) {
            var listItems = [].concat(this._oSolPedList.getItems(), this._oPedList.getItems(), this._oSelectList.getItems(), this._oSolPaymentList.getItems());
            var keyedListItems = listItems.reduce(function (acc, el) {
              return _objectSpread(_objectSpread({}, acc), {}, _defineProperty({}, "".concat(el.data('to')), el));
            }, {});
            items.forEach(function (variantItem) {
              var GRUPO = variantItem.GRUPO;
              var listItem = keyedListItems["".concat(GRUPO)];

              if (listItem) {
                listItem.getParent().fireSelectionChange({
                  listItem: listItem,
                  selected: true
                });
                listItem.setSelected(true);
              }

              var formContainer = _this4.byId("".concat(GRUPO));

              if (formContainer) {
                formUtils.setDataInFields({
                  data: variantItem,
                  formElements: formContainer.getFormElements()
                });
              }
            });
          } else if (!this._showPayment) {
            this._oSolPedList.getItems()[4].setSelected(true);

            this.byId('solPed5').setVisible(true);
            var currentDate = new Date();
            var lastMonth = new Date(new Date().setDate(new Date().getDate() - 30));
            var inpRequestDate = this.byId('DRS_BADAT');
            inpRequestDate.setDateValue(lastMonth);
            inpRequestDate.setSecondDateValue(currentDate);
          }
        }
      },

      /**
       * @function
       * @name _getSelectedItems
       * @description - Obtener items seleccionados de las listas
       *
       * @private
       * @returns {object[]}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _getSelectedItems: function _getSelectedItems() {
        var solPedItems = this._oSolPedList.getSelectedItems();

        var pedItems = this._oPedList.getSelectedItems();

        var selectItems = this._oSelectList.getSelectedItems();

        var solPaymentItems = this._oSolPaymentList.getSelectedItems();

        return [].concat(solPedItems, pedItems, selectItems, solPaymentItems);
      },

      /* =========================================================== */

      /* finish: internal methods                                    *
      /* =========================================================== */

      /* =========================================================== */

      /* begin: event handlers                                       */

      /* =========================================================== */

      /**
       * @function
       * @name onSelectionChangeHandler
       * @description - Ejecuta cuando se selecciona un elemento de la lista de Master
       *
       * @public
       * @param {string} parameters - A quÃ© pÃ¡gina detalle va a navegar
       * @returns {void}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      onSelectionChangeHandler: function onSelectionChangeHandler(parameters) {
        var listItem = parameters.listItem,
            selected = parameters.selected;
        var id = listItem.data('to');
        var control = this.byId("".concat(id));

        if (control) {
          control.setVisible(selected);
        }
      },

      /**
       * @function
       * @name onSelectAllCheckBoxHandler
       * @description - Ejecuta cuando se selecciona la opciÃ³n de todas las opciones
       *
       * @public
       * @param {string} prop - Propiedad
       * @param {boolean} selected - Estado
       * @returns {void}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      onSelectAllCheckBoxHandler: function onSelectAllCheckBoxHandler(prop, selected) {
        this._oDataModel.setProperty("/".concat(prop), {
          child1: selected,
          child2: selected,
          child3: selected,
          child4: selected,
          child5: selected,
          child6: selected,
          child7: selected,
          child8: selected
        });
      },

      /**
       * @function
       * @name onSubmitHandler
       * @description - Ejecuta tracking de compras
       *
       * @public
       * @returns {void}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      onSubmitHandler: function onSubmitHandler() {
        try {
          Promise.resolve(this._oPage.setBusy(true)).then(this._buildRequest.bind(this, this._getSelectedItems())).then(this._fetchKeys.bind(this)).then(this._validateKeys.bind(this)).then(this._handleResponse.bind(this)).catch(this.errorHandler.bind(this)).then(this._oPage.setBusy.bind(this._oPage, false));
        } catch (error) {
          this.errorHandler(error);

          this._oPage.setBusy(false);
        }
      },

      /**
       * @function
       * @name onReset
       * @description -Restaurar formulario a su valor por defecto
       *
       * @public
       * @returns {void}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      onReset: function onReset() {
        var _this5 = this;

        var listItems = this._getSelectedItems();

        listItems.forEach(function (listItem) {
          var fieldGroupId = listItem.data('to');

          var container = _this5.byId(fieldGroupId);

          listItem.getParent().fireSelectionChange({
            listItem: listItem,
            selected: false
          });
          listItem.setSelected(false);

          if (container) {
            formUtils.cleanFields({
              formElements: container.getFormElements()
            });
          }
        });
      },

      /**
       * @function
       * @name onChangeSegmentReport
       * @description Cambia el tipo de reporte a mostrar (Indicadores o Tracking)
       *
       * @public
       * @returns {void}
       *
       * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
       * @version 0.5.0
       */
      onChangeSegmentReport: function onChangeSegmentReport(evt) {
        this.onReset();
        var selected = evt.getSource().getSelectedKey();

        if (selected === 'indicators') {
          this._oSolPedList.setVisible(false);

          this._oSolPedPanel.setVisible(false);
        } else {
          this._oSolPedList.setVisible(true);

          this._oSolPedPanel.setVisible(true);
        }
      }
      /* =========================================================== */

      /* finish: event handlers                                       */

      /* =========================================================== */

    })
  );
});