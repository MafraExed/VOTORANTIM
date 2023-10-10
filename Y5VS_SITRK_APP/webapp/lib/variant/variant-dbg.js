"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/model/constant', 'com/innova/model/variant/Action', 'com/innova/model/variant/Function', 'com/innova/model/variant/Variant', 'com/innova/service/petitions', 'com/innova/util/isEmpty', 'com/innova/util/showToast', 'sap/m/Button', 'sap/m/CheckBox', 'sap/m/Dialog', 'sap/m/Input', 'sap/m/Label', 'sap/ui/core/Fragment', 'sap/ui/model/Filter', 'sap/ui/model/FilterOperator', 'sap/ui/model/json/JSONModel'], function (constant, VariantAction, VariantFunction, Variant, petitions, isEmpty, showToast, Button, CheckBox, Dialog, Input, Label, Fragment, Filter, FilterOperator, JSONModel) {
  var variant = {
    /* =========================================================== */

    /* begin: event handlers                                      */

    /* =========================================================== */

    /**
     * @function
     * @name onGetVariant
     * @description - Encargado de recibir el evento en las acciones del MenuAction.
     *
     * @public
     * @param {string} sKey - Llave de las opciones de las variantes.
     * @param {string} sTitle - Titulo que se desea mostrar
     * @param {string} sFunction - Attributo de las constantes de las variantes a buscar.
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    onGetVariant: function onGetVariant(sKey, sTitle, sFunction) {
      var oController = this;
      var oAppModel = oController.getModel('appView');

      try {
        oAppModel.setProperty('/busy', true);
        petitions.post("".concat(constant.GET_VARIANT), new Variant({
          function: VariantFunction["".concat(sFunction)],
          action: VariantAction.READ
        })).then(variant._showVariantDialog.bind(oController)).catch(oController.errorHandler.bind(this)).then(oAppModel.setProperty.bind(oAppModel, '/busy', false));
      } catch (error) {
        oController.errorHandler(error);
        oAppModel.setProperty('/busy', false);
      }
    },

    /**
     * @function
     * @name onSaveVariant
     * @description - Se encarga de guardar una variante
     *
     * @public
     * @param {string} sKey - Llave de las opciones de las variantes.
     * @param {string} sTitle - Titulo que se desea mostrar
     * @param {string} sFunction - Attributo de las constantes de las variantes a buscar.
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    onSaveVariant: function onSaveVariant(sKey, sTitle, sFunction) {
      var oController = this;
      var oAppModel = oController.getModel('appView');

      try {
        oController._sVariantFunction = VariantFunction["".concat(sFunction)];
        Promise.resolve(oAppModel.setProperty('/busy', true)).then(oController._getFormDataForVariant.bind(oController)).then(variant._validateFormData.bind(oController)).then(variant._showSaveVariantDialog.bind(oController)).catch(oController.errorHandler.bind(oController)).finally(oAppModel.setProperty.bind(oAppModel, '/busy', false));
      } catch (error) {
        oController.errorHandler(error);
        oAppModel.setProperty('/busy', false);
      }
    },

    /**
     * @function
     * @name onSaveVariantHandler
     * @description - Se encarga de guardar una variante en el backend
     *
     * @public
     * @param {object} context
     * @param {string} context.defaultVariant - Si es default
     * @param {string} context.nameVariant - Nombre de la variante
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    onSaveVariantHandler: function onSaveVariantHandler(_ref) {
      var defaultVariant = _ref.defaultVariant,
          nameVariant = _ref.nameVariant;
      var oController = this;

      try {
        if (isEmpty(nameVariant)) {
          throw new Error(oController.getMessageTextPool('K069'));
        }

        Promise.resolve(oController._oSaveVariantDialog.setBusy(true)).then(variant._createPostRequest.bind(oController, {
          defaultVariant: defaultVariant,
          nameVariant: nameVariant
        })).then(petitions.post.bind(petitions, constant.GET_VARIANT)).then(function (_ref2) {
          var data = _ref2.data;
          return showToast(data.message);
        }).then(oController._oSaveVariantDialog.close.bind(oController._oSaveVariantDialog)).catch(oController.errorHandler.bind(oController)).finally(oController._oSaveVariantDialog.setBusy.bind(oController._oSaveVariantDialog, false));
      } catch (error) {
        oController.errorHandler(error);

        oController._oSaveVariantDialog.setBusy(false);
      }
    },

    /**
     * @function
     * @name onSearch
     * @description - Se encarga del filtro la lista del dialogo SelectDialog.
     *
     * @public
     * @param {sap.m.SelectDialog} oSource - Lista de la ayuda de busqueda de las variantes
     * @param {string} sQuery - Query a buscar
     * @returns {void} - No retona nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    onSearch: function onSearch(oSource, sQuery) {
      var aFilter = [];

      if (sQuery && sQuery.length > 0) {
        aFilter = [new Filter('ZVARIANT', FilterOperator.Contains, sQuery)];
      }

      var oBinding =
      /** @type {sap.ui.model.json.JSONListBinding} */
      oSource.getBinding('items');

      if (aFilter.length !== 0) {
        oBinding.filter(new Filter(aFilter, false));
      } else {
        oBinding.filter([]);
      }
    },

    /**
     * @function
     * @name onConfirm
     * @description - Se encarga del evento confirm o cancel del SelectDialog de las Variantes.
     *
     * @public
     * @param {sap.m.SelectDialog} oSource - Control
     * @param {object[]} aContexts - Contexto del item seleccionado.
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    onConfirm: function onConfirm(oSource) {
      var aContexts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      if (aContexts.length) {
        var oController = this;
        var oAppModel = oController.getModel('appView');

        try {
          oAppModel.setProperty('/busy', true);

          var _aContexts = _slicedToArray(aContexts, 1),
              oContext = _aContexts[0];

          var nameVariant = oContext.getProperty('ZVARIANT');
          petitions.post("".concat(constant.GET_VARIANT), new Variant({
            function: VariantFunction.PROCESS,
            action: VariantAction.GET,
            nameVariant: nameVariant
          })).then(oController._bindVariantData.bind(oController)).catch(oController.errorHandler.bind(oController)).then(function () {
            return (
              /** @type {sap.ui.model.json.JSONListBinding} */
              oSource.getBinding('items').filter([])
            );
          }).finally(oAppModel.setProperty.bind(oAppModel, '/busy', false));
        } catch (error) {
          oController.errorHandler(error);
          oAppModel.setProperty('/busy', false);
        }
      }
    },

    /**
     * @function
     * @name onConfirm
     * @description - Se encarga del evento confirm o cancel del SelectDialog de las Variantes.
     *
     * @public
     * @param {sap.m.Button} oButton - Control
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    onDefault: function onDefault(oButton) {
      var context = oButton.getBindingContext();

      var _context$getObject =
      /** @type {object} */
      context.getObject(),
          nameVariant = _context$getObject.ZVARIANT;

      var oController = this;
      var oAppModel = oController.getModel('appView');
      oAppModel.setProperty('/busy', true);
      petitions.post("".concat(constant.GET_VARIANT), new Variant({
        action: VariantAction.ASSING,
        defaultVariant: 'X',
        function: VariantFunction.PROCESS,
        nameVariant: nameVariant
      })).then(function (_ref3) {
        var data = _ref3.data;
        return showToast(data.message);
      }).catch(oController.errorHandler.bind(oController)).finally(oAppModel.setProperty.bind(oAppModel, '/busy', false));
    },

    /**
     * @function
     * @name onGetDefaultVariant
     * @description - Obtener variante por defecto
     *
     * @public
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    onGetDefaultVariant: function onGetDefaultVariant() {
      var oController = this;
      var oAppModel = oController.getModel('appView');

      try {
        oAppModel.setProperty('/busy', true);
        petitions.post("".concat(constant.GET_VARIANT), new Variant({
          function: VariantFunction.PROCESS,
          action: VariantAction.DEFAULT
        })).then(oController._bindVariantData.bind(oController)).catch(oController.errorHandler.bind(oController)).finally(oAppModel.setProperty.bind(oAppModel, '/busy', false));
      } catch (error) {
        oController.errorHandler(error);
        oAppModel.setProperty('/busy', false);
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
     * @name _validateFormData
     * @description - Validar datos del formulario
     *
     * @private
     * @param {string} sFunction - Nombre de la funciÃ³n donde se encuentra el usuario
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _validateFormData: function _validateFormData() {
      var oController = this;

      if (!oController._aVariantItems.length) {
        throw new Error(oController.getMessageTextPool('K058'));
      }
    },

    /**
     * @function
     * @name _showSaveVariantDialog
     * @description - Mostrar dialogo para guardar variante
     *
     * @private
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _showSaveVariantDialog: function _showSaveVariantDialog() {
      var _this = this;

      var oController = this;
      oController._oSaveVariantDialog = new Dialog({
        busyIndicatorDelay: 0,
        stretch: '{device>/system/phone}',
        title: '{main>/textPool/K086}',
        type: 'Message',
        content: [new Label({
          labelFor: oController.createId('variantNameInput'),
          required: true,
          text: '{main>/textPool/K347}',
          width: '100%'
        }), new Input(oController.createId('variantNameInput'), {
          /*     change: [fnChange, oController], */
          width: '100%',
          placeholder: '{main>/textPool/K347}',
          required: true,
          maxLength: 50
        }), new Label({
          labelFor: oController.createId('defaultVariantCheckbox'),
          text: '{main>/textPool/K100}',
          width: '100%'
        }), new CheckBox(oController.createId('defaultVariantCheckbox'), {
          useEntireWidth: true,
          width: '100%'
        })],
        beginButton: new Button({
          text: '{main>/textPool/K065}',
          press: [function () {
            return variant.onSaveVariantHandler.call(oController, {
              nameVariant: oController.byId('variantNameInput').getValue().trim(),
              defaultVariant: _this.byId('defaultVariantCheckbox').getSelected() ? 'X' : ''
            });
          }, oController]
        }),
        endButton: new Button({
          text: '{main>/textPool/K067}'
        })
      });
      oController.getView().addDependent(oController._oSaveVariantDialog);

      oController._oSaveVariantDialog.attachAfterClose(oController._oSaveVariantDialog.destroy.bind(oController._oSaveVariantDialog));

      oController._oSaveVariantDialog.getEndButton().attachPress(oController._oSaveVariantDialog.close.bind(oController._oSaveVariantDialog));

      oController._oSaveVariantDialog.addStyleClass(oController.getOwnerComponent().getContentDensityClass());

      oController._oSaveVariantDialog.open();
    },

    /**
     * @function
     * @name _createPostRequest
     * @description - Crear objeto request para el layout
     *
     * @private
     * @param {object} context
     * @param {string} context.defaultVariant - Si es default
     * @param {string} context.nameVariant - Nombre
     * @returns {Promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _createPostRequest: function _createPostRequest(_ref4) {
      var defaultVariant = _ref4.defaultVariant,
          nameVariant = _ref4.nameVariant;
      var oController = this;
      return new Variant({
        defaultVariant: defaultVariant,
        nameVariant: nameVariant,
        action: VariantAction.POST,
        function: oController._sVariantFunction,
        variants: oController._aVariantItems.map(function (item) {
          return _objectSpread(_objectSpread({}, item), {}, {
            ZVARIANT: nameVariant
          });
        })
      });
    },

    /**
     * @function
     * @name _showVariantDialog
     * @description - Mostrar el dialogo con las variantes
     *
     * @public
     * @param {object} oContextObject - Objeto contexto de la funciÃ³n.
     * @param {object} oContextObject.data - Modelo para mostrar el SelectDialog de las variantes.
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _showVariantDialog: function _showVariantDialog(_ref5) {
      var _this2 = this;

      var data = _ref5.data;
      var oModel = new JSONModel(_objectSpread(_objectSpread({}, data), {}, {
        properties: {}
      }));

      if (!this._oVariantSearchHelpDialogFragment) {
        Fragment.load({
          id: this.getView().getId(),
          name: 'com.innova.sitrack.view.variant.VariantSearchHelp',
          controller: this
        }).then(function (oDialog) {
          // connect dialog to the root view of this component (models, lifecycle)
          _this2.getView().addDependent(oDialog);

          oDialog.addStyleClass(_this2.getOwnerComponent().getContentDensityClass()); // set model & bind Aggregation

          oDialog.setModel(oModel);
          _this2._oVariantSearchHelpDialogFragment = oDialog;
          oDialog.open();
        });
      } else {
        // Destruir columnas si existen.
        this._oVariantSearchHelpDialogFragment.destroyItems(); // set model & bind Aggregation


        this._oVariantSearchHelpDialogFragment.setModel(oModel);

        this._oVariantSearchHelpDialogFragment.open();
      }
    }
    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

  };
  return variant;
});