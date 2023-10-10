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
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/model/constant', 'com/innova/model/layout/Action', 'com/innova/model/layout/Function', 'com/innova/model/layout/Layout', 'com/innova/service/petitions', 'com/innova/vendor/lodash.set', 'sap/m/Button', 'sap/m/CheckBox', 'sap/m/ComboBox', 'sap/m/Dialog', 'sap/m/Input', 'sap/m/Label', 'sap/ui/core/Fragment', 'sap/ui/core/Item', 'sap/ui/model/Filter', 'sap/ui/model/FilterOperator', 'sap/ui/model/json/JSONModel'],
/**
 * Module dependencies
 *
 * @param {typeof sap.ui.model.FilterOperator} FilterOperator
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel
 */
function (constant, LayoutAction, LayoutFunction, Layout, petitions, set, Button, CheckBox, ComboBox, Dialog, Input, Label, Fragment, Item, Filter, FilterOperator, JSONModel) {
  var layout = {
    /**
     * @function
     * @name onModifyLayouts
     * @description - Se encarga de abrir el dialogo para modificar el layout
     *
     * @public
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    onModifyLayouts: function onModifyLayouts() {
      var _this = this;

      if (!this._oNoOutColumnDialog) {
        Fragment.load({
          id: this.getView().getId(),
          name: 'com.innova.sitrack.view.layout.Layout',
          controller: this
        }).then(function (oDialog) {
          // connect oDialog to the root view of this component (models, lifecycle)
          _this.getView().addDependent(oDialog);

          oDialog.addStyleClass(_this.getOwnerComponent().getContentDensityClass());
          oDialog.getEndButton().attachPress(function () {
            _this._oModel.updateBindings();

            oDialog.close();
          });
          oDialog.getBeginButton().attachPress(layout.onSaveLayout, _this);
          var oModel = new JSONModel({
            catalog: _this._oModel.getProperty('/catalog'),
            allCatalog: _this._oModel.getProperty('/allCatalog')
          });
          oModel.setSizeLimit(1000000);
          oDialog.setModel(oModel);

          _this.byId('rowHeightCober').attachChange(layout.onChangeStepInput.bind(_this));

          layout._setColumnOrder.call(_this);

          _this._oNoOutColumnDialog = oDialog;

          _this._oNoOutColumnDialog.open();
        }).catch(this.errorHandler.bind(this));
      } else {
        layout._setColumnOrder.call(this);

        var oModel = new JSONModel({
          catalog: this._oModel.getProperty('/catalog'),
          allCatalog: this._oModel.getProperty('/allCatalog')
        });
        oModel.setSizeLimit(1000000);

        this._oNoOutColumnDialog.setModel(oModel);

        this.getView().byId('sfHiddenFields').setValue();
        this.getView().byId('sfVisibleFields').setValue();

        this._oNoOutColumnDialog.open();
      }
    },

    /**
     * @function
     * @name onSearchLayouts
     * @description - Se encarga de abrir el dialogo para mostrar todos los layouts disponibles
     *
     * @public
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    onSearchLayouts: function onSearchLayouts() {
      var _this2 = this;

      var oAppModel = this.getModel('appView');

      try {
        oAppModel.setProperty('/busy', true);

        layout._fetchSearchLayout().then(function (_ref) {
          var data = _ref.data;
          return layout._showSearchLayoutDialog.call(_this2, {
            model: new JSONModel({
              data: data.layouts
            })
          });
        }).catch(this.errorHandler.bind(this)).then(oAppModel.setProperty.bind(oAppModel, '/busy', false));
      } catch (error) {
        this.errorHandler(error);
        oAppModel.setProperty('/busy', false);
      }
    },

    /**
     * @function
     * @name onColumnResize
     * @description - Se activa cuando se cambia el tamaÃ±o de una columna de la tabla.
     *
     * @public
     * @param {sap.ui.table.Column} oColumn - Columna.
     * @param {sap.ui.core.CSSSize} sWidth - Nuevo ancho transformada de excel.
     * @param {string} sContext - contexto
     *
     * @returns {void} - No retorn nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    onColumnResize: function onColumnResize(oColumn, sWidth, sContext) {
      var width = sWidth;
      width || (width = '125');
      var oDataItem = oColumn.getBindingContext(sContext).getObject();
      set(oDataItem, 'OUTPUTLEN', width.replace('px', ''));
      set(oDataItem, 'zNoOutChange', true);
    },

    /**
     * @function
     * @name onMoveSelectedFieldHandler
     * @description - Se encarga de mover los campos seleccionados
     *
     * @public
     * @param {sap.m.Button} oSource - Switch del campo
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    onMoveSelectedFieldHandler: function onMoveSelectedFieldHandler(oSource) {
      var context = oSource.getBindingContext();
      var model =
      /** @type {sap.ui.model.json.JSONModel} */
      context.getModel();
      var oDataItem =
      /** @type {object} */
      context.getObject();

      var catalog = this._oModel.getProperty('/catalog');

      set(oDataItem, 'NO_OUT', '');
      set(oDataItem, 'zNoOutChange', true);
      set(oDataItem, 'COL_POS', catalog.length + 1);
      catalog.push(oDataItem);
      model.updateBindings(false);
    },

    /**
     * @function
     * @name onMoveDeselectedFieldHandler
     * @description - Se encarga de mover los campos deseleccionados
     *
     * @public
     * @param {sap.m.Button} oSource - Switch del campo
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    onMoveDeselectedFieldHandler: function onMoveDeselectedFieldHandler(oSource) {
      var context = oSource.getBindingContext();
      var model =
      /** @type {sap.ui.model.json.JSONModel} */
      context.getModel();
      var oDataItem =
      /** @type {object} */
      context.getObject();

      var catalog = this._oModel.getProperty('/catalog');

      set(oDataItem, 'NO_OUT', 'X');
      set(oDataItem, 'zNoOutChange', true);
      model.updateBindings(false);

      var item = this._oModel.getProperty('/allCatalog')[oDataItem.FIELDNAME];

      set(item, 'NO_OUT', 'X');
      var newCatalog = catalog.filter(function (_ref2) {
        var FIELDNAME = _ref2.FIELDNAME;
        return FIELDNAME !== oDataItem.FIELDNAME;
      }).map(function (c, index) {
        return _objectSpread(_objectSpread({}, c), {}, {
          COL_POS: index + 1
        });
      });

      this._oModel.setProperty('/catalog', newCatalog);

      model.setProperty('/catalog', newCatalog);
      model.updateBindings(true);
    },

    /**
     * @function
     * @name onChangeStepInput
     * @description - Se encarga de cambiar la altura de las filas
     *
     * @public
     * @param {string} value - Switch del campo
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    onChangeStepInput: function onChangeStepInput(oEvent) {
      var value = oEvent ? oEvent.getParameter('value') || this._iColumnHeight : this._iColumnHeight;

      this._oProcessTable.setRowHeight(value);

      this._oProcessTable.setColumnHeaderHeight(value);

      this._iColumnHeight = value;
    },

    /**
     * @function
     * @name onSearch
     * @description - Buscar en la lista de disposiciÃ³n
     *
     * @public
     * @param {string} newValue - Switch del campo
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    onSearch: function onSearch(source, newValue) {
      // add filter for search
      var filters = [new Filter('TECH', FilterOperator.NE, 'X')];

      if (newValue && newValue.length > 0) {
        filters.push(new Filter({
          filters: [new Filter({
            path: 'SCRTEXT_L',
            operator: FilterOperator.Contains,
            value1: newValue
          }), new Filter({
            path: 'REPTEXT',
            operator: FilterOperator.Contains,
            value1: newValue
          })],
          and: false
        }));
      } // update list binding


      var oList = source.getParent().getParent();
      var oBinding = oList.getBinding('items');
      oBinding.filter(filters, 'Control');
    },

    /**
     * @function
     * @name onSaveLayout
     * @description - Mostrar dialogo para guardar el layout
     *
     * @public
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    onSaveLayout: function onSaveLayout() {
      Promise.resolve(this._oNoOutColumnDialog.setBusy(true)).then(layout._fetchSearchLayout.bind(this)).then(layout._showSaveDialog.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oNoOutColumnDialog.setBusy.bind(this._oNoOutColumnDialog, false));
    },

    /**
     * @function
     * @name onSaveLayoutHandler
     * @description - Maneja la opciÃ³n de guardar el layout
     *
     * @public
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    onSaveLayoutHandler: function onSaveLayoutHandler() {
      var comboBox = this.byId('layoutComboBox');

      this._saveLayout({
        nameLayout: comboBox.getSelectedKey() || comboBox.getValue().trim(),
        defaultLayout: this.byId('defaultCheckbox').getSelected() ? 'X' : ''
      });
    },

    /**
     * @function
     * @name onSearchLayout
     * @description - Se encarga del filtro la lista de layouts.
     *
     * @public
     * @param {sap.m.SelectDialog} oSource - Lista de layouts
     * @param {string} sQuery - Query a buscar
     * @returns {void} - No retona nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    onSearchLayout: function onSearchLayout(oSource, sQuery) {
      var aFilter = [];

      if (sQuery && sQuery.length > 0) {
        aFilter = [new Filter('LAYOUT', FilterOperator.Contains, sQuery)];
      }

      var oBinding =
      /** @type {sap.ui.model.json.JSONListBinding}  */
      oSource.getBinding('items');

      if (aFilter.length !== 0) {
        oBinding.filter(new Filter(aFilter, false));
      } else {
        oBinding.filter([]);
      }
    },

    /**
     * @function
     * @name onConfirmLayout
     * @description - Se encarga del evento confirm o cancel del SelectDialog de los layout.
     *
     * @public
     * @param {sap.m.SelectDialog} oSource - Lista de la ayuda de busqueda de los layout
     * @param {object[]} aContexts - Contexto del item seleccionado.
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    onConfirmLayout: function onConfirmLayout(oSource) {
      var aContexts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      if (aContexts.length) {
        var oAppModel = this.getModel('appView');

        try {
          oAppModel.setProperty('/busy', true);

          var _aContexts = _slicedToArray(aContexts, 1),
              oContext = _aContexts[0];

          var nameLayout = oContext.getProperty('LAYOUT');
          petitions.post("".concat(constant.GET_LAYOUT), new Layout({
            function: LayoutFunction.PROCESS,
            action: LayoutAction.GET,
            nameLayout: nameLayout,
            catalog: []
          })).then(this._buildNewCatalog.bind(this)).catch(this.errorHandler.bind(this)).then(function () {
            return (
              /** @type {sap.ui.model.json.JSONListBinding} */
              oSource.getBinding('items').filter([])
            );
          }).finally(oAppModel.setProperty.bind(oAppModel, '/busy', false));
        } catch (error) {
          this.errorHandler(error);
          oAppModel.setProperty('/busy', false);
        }
      }
    },

    /* =========================================================== */

    /* begin: internal methods                                     *
    /* =========================================================== */

    /**
     * @function
     * @name _setColumnOrder
     * @description - Establecer orden de columnas
     *
     * @private
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _setColumnOrder: function _setColumnOrder() {
      var columns = this._oProcessTable.getColumns();

      columns.forEach(function (column, i) {
        var context = column.getBindingContext('process');
        var obj = context.getObject();
        obj.COL_POS = i + 1;
      });

      this._oModel.getProperty('/catalog').sort(function (a, b) {
        return a.COL_POS - b.COL_POS;
      });

      this._oModel.updateBindings();
    },

    /**
     * @function
     * @name _fetchSearchLayout
     * @description - PeticiÃ³n para buscar todos los layouts disponibles
     *
     * @private
     * @returns {Promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _fetchSearchLayout: function _fetchSearchLayout() {
      return petitions.post("".concat(constant.GET_LAYOUT), new Layout({
        function: LayoutFunction.PROCESS,
        action: LayoutAction.READ,
        catalog: []
      }));
    },

    /**
     * @function
     * @name _showSaveDialog
     * @description - PeticiÃ³n para buscar todos los layouts disponibles
     *
     * @private
     * @param {object} context
     * @param {object} context.data - Datos del servicio
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _showSaveDialog: function _showSaveDialog(_ref3) {
      var data = _ref3.data;
      this._oSaveDialog = new Dialog({
        busyIndicatorDelay: 0,
        stretch: '{device>/system/phone}',
        title: '{main>/textPool/K086}',
        type: 'Message',
        content: [new Label({
          labelFor: 'layoutInput',
          required: true,
          text: '{main>/textPool/K099}',
          width: '100%'
        }), new ComboBox(this.createId('layoutComboBox'), {
          items: [data.layouts.sort(function (a, b) {
            var fa = a.LAYOUT.toLowerCase();
            var fb = b.LAYOUT.toLowerCase();

            if (fa < fb) {
              return -1;
            }

            if (fa > fb) {
              return 1;
            }

            return 0;
          }).map(function (_ref4) {
            var LAYOUT = _ref4.LAYOUT;
            return new Item({
              key: LAYOUT,
              text: LAYOUT
            });
          })],
          width: '100%'
        }), new Label({
          labelFor: 'defaultCheckbox',
          text: '{main>/textPool/K100}',
          width: '100%'
        }), new CheckBox(this.createId('defaultCheckbox'), {
          useEntireWidth: true,
          width: '100%'
        })],
        beginButton: new Button({
          text: '{main>/textPool/K065}',
          press: [layout.onSaveLayoutHandler, this]
        }),
        endButton: new Button({
          text: '{main>/textPool/K067}'
        })
      });
      this.getView().addDependent(this._oSaveDialog);

      this._oSaveDialog.attachAfterClose(this._oSaveDialog.destroy.bind(this._oSaveDialog));

      this._oSaveDialog.getEndButton().attachPress(this._oSaveDialog.close.bind(this._oSaveDialog));

      this._oSaveDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());

      this._oSaveDialog.open();
    },

    /**
     * @function
     * @name _showSearchLayoutDialog
     * @description - Mostrar el dialogo con las variantes que se han creado.
     *
     * @private
     * @param {object} oContextObject - Objeto contexto de la funciÃ³n.
     * @param {sap.ui.model.json.JSONModel} [oContextObject.model] - Modelo para mostrar el SelectDialog de las variantes.
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _showSearchLayoutDialog: function _showSearchLayoutDialog(_ref5) {
      var _this3 = this;

      var model = _ref5.model;

      if (!this._oSearchLayoutDialog) {
        Fragment.load({
          id: this.getView().getId(),
          name: 'com.innova.sitrack.view.layout.SearchLayout',
          controller: this
        }).then(function (oDialog) {
          // connect oDialog to the root view of this component (models, lifecycle)
          _this3.getView().addDependent(oDialog);

          oDialog.addStyleClass(_this3.getOwnerComponent().getContentDensityClass()); // set model & bind Aggregation

          oDialog.setModel(model);
          _this3._oSearchLayoutDialog = oDialog;
          oDialog.open();
        });
      } else {
        // Destruir columnas si existen.
        this._oSearchLayoutDialog.destroyItems(); // set model & bind Aggregation


        this._oSearchLayoutDialog.setModel(model);

        this._oSearchLayoutDialog.open();
      }
    }
    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

  };
  return layout;
});