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
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['./Base', 'com/innova/factory/purchaseTracking/process', 'com/innova/formatter/columnTitleProcess', 'com/innova/lib/formUtils/formUtils', 'com/innova/lib/layout/layout', 'com/innova/lib/searchHelp/searchHelp', 'com/innova/lib/excel', 'com/innova/model/constant', 'com/innova/model/layout/Action', 'com/innova/model/layout/Function', 'com/innova/model/layout/ItemLayout', 'com/innova/model/layout/Layout', 'com/innova/model/purchaseTracking/GetAttachment', 'com/innova/model/purchaseTracking/AssignUser', 'com/innova/model/purchaseTracking/EmailProv', 'com/innova/model/purchaseTracking/ItemAssignUser', 'com/innova/model/purchaseTracking/ItemEmailProv', 'com/innova/model/purchaseTracking/ItemPedModif', 'com/innova/model/purchaseTracking/ItemReminder', 'com/innova/model/purchaseTracking/ItemReturnSolPed', 'com/innova/model/purchaseTracking/ItemSolModif', 'com/innova/model/purchaseTracking/PedModif', 'com/innova/model/purchaseTracking/Reminder', 'com/innova/model/purchaseTracking/ReturnSolPed', 'com/innova/model/purchaseTracking/SolModif', 'com/innova/model/purchaseTracking/ItemEmailAddress', 'com/innova/model/purchaseTracking/UploadAttached', 'com/innova/service/petitions', 'com/innova/vendor/lodash.filter', 'com/innova/util/isEmpty', 'com/innova/util/keyBy', 'com/innova/util/showToast', 'com/innova/sitrack/model/formatter', 'sap/ui/core/Fragment', 'sap/ui/model/Filter', 'sap/ui/model/FilterOperator', 'sap/ui/model/json/JSONModel', 'sap/m/Token', 'sap/m/MessageBox', 'com/innova/sitrack/model/purchaseTracking/payment/DetailPayment', 'com/innova/sitrack/model/purchaseTracking/payment/DockKeyPayment', 'com/innova/model/searchHelp/SearchHelp'],
/**
 * Module dependencies
 *
 * @param {typeof sap.ui.core.Fragment} Fragment
 * @param {typeof sap.ui.model.Filter} Filter
 * @param {typeof sap.ui.model.FilterOperator} FilterOperator
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel
 */
function (BaseController, process, columnTitleProcess, formUtils, layout, searchHelp, excel, constant, LayoutAction, LayoutFunction, ItemLayout, Layout, GetAttachment, AssignUser, EmailProv, ItemAssignUser, ItemEmailProv, ItemPedModif, ItemReminder, ItemReturnSolPed, ItemSolModif, PedModif, Reminder, ReturnSolPed, SolModif, ItemEmailAddress, UploadAttached, petitions, filter, isEmpty, keyBy, showToast, formatterLib, Fragment, Filter, FilterOperator, JSONModel, Token, MessageBox, DetailPayment, DockKeyPayment, SearchHelpModel) {
  return (
    /**
     * @class
     * @name Process.controller.js
     * @extends com.innova.sitrack.controller.BaseController
     * @description - Controlador del formulario de tracking de compras
     *
     * @constructor
     * @public
     * @namespace com.innova.sitrack.controller.purchaseTracking
     *
     * @param {String} sId - id for the new control, generated automatically if no id is given
     * @param {Object} mSettings - initial settings for the new control
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    BaseController.extend('com.innova.sitrack.controller.purchaseTracking.Process', {
      layout: layout,
      process: process,
      searchHelp: searchHelp,
      formatter: {
        columnTitleProcess: columnTitleProcess
      },
      formatterLib: formatterLib,

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
        this._initialState();

        this._oPage = this.byId('page');
        this._oProcessTable = this.byId('processTable');
        this._oRouter = this.getRouter();

        this._oRouter.getRoute('purchaseTrackingProcess').attachMatched(this._onRouteMatched, this);
      },

      /* =========================================================== */

      /* finish: lifecycle methods                                   */

      /* =========================================================== */

      /* =========================================================== */

      /* begin: internal methods                                     *
      /* =========================================================== */

      /**
       * @function
       * @name _fetch
       * @description - Reiniciar valor por defecto de la tabla
       *
       * @private
       * @returns {void} - No retorna nada
       *
       * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
       * @version 0.5.0
       */
      _fetch: function _fetch() {
        Promise.resolve(this._oPage.setBusy(true)).then(this._getInitialData.bind(this)).catch(this.errorHandler.bind(this)).then(this._oPage.setBusy.bind(this._oPage, false));
      },

      /**
       * @function
       * @name _fetch
       * @description - Reiniciar valor por defecto de la tabla
       *
       * @private
       * @returns {void} - No retorna nada
       *
       * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
       * @version 0.5.0
       */
      _fetchNoLayout: function _fetchNoLayout() {
        var _this = this;

        var _this$getModel$getDat = this.getModel('store').getData(),
            keys = _this$getModel$getDat.keys,
            req = _this$getModel$getDat.req;

        req.IT_DOCKEYS = keys;
        Promise.resolve(this._oPage.setBusy(true)).then(petitions.post.bind(petitions, "".concat(constant.GET_PROCESS_SELECTED), req)).then(function (_ref) {
          var _ref$data = _ref.data;
          _ref$data = _ref$data === void 0 ? {} : _ref$data;
          var _ref$data$items = _ref$data.items,
              items = _ref$data$items === void 0 ? [] : _ref$data$items;

          var data = _this._buildRows(items);

          _this._oModel.setProperty('/data', []);

          _this._oModel.setProperty('/data', data);
        }).catch(this.errorHandler.bind(this)).finally(function () {
          _this._scrollTable = false;

          _this._oPage.setBusy(false);
        });
      },

      /**
       * @function
       * @name _getInitialData
       * @description - Obteniendo datos iniciales
       *
       * @private
       * @returns {Promise}
       *
       * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
       * @version 0.5.0
       */
      _getInitialData: function _getInitialData() {
        return Promise.resolve(this._resetTableDefatuls()).then(this._fetchFirstPage.bind(this)).then(this._buildData.bind(this)).then(this._getDefaultLayout.bind(this));
      },

      /**
       * @function
       * @name _getDefaultLayout
       * @description - Ir a buscar la layout por defecto
       *
       * @private
       * @returns {Promise}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _getDefaultLayout: function _getDefaultLayout() {
        return petitions.post("".concat(constant.GET_LAYOUT), new Layout({
          function: LayoutFunction.PROCESS,
          action: LayoutAction.DEFAULT,
          catalog: []
        })).then(this._buildNewCatalog.bind(this)).then(layout.onChangeStepInput.bind(this));
      },

      /**
       * @function
       * @name _buildNewCatalog
       * @description - Crear objeto request para el layout
       *
       * @private
       * @param {object} context
       * @param {object} context.data - Nombre
       * @returns {void} - No retorna nada
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _buildNewCatalog: function _buildNewCatalog(_ref2) {
        var _this2 = this;

        var data = _ref2.data;
        var catalog = data.catalog; // const allCatalog = keyBy(this._oRes.catalog, 'FIELDNAME')

        var allCatalog = keyBy(JSON.parse(JSON.stringify(this._oRes.catalog)), 'FIELDNAME');
        var newCatalog = catalog.map(function (item) {
          var FIELDNAME = item.FIELDNAME;
          _this2._iColumnHeight = item.HREF_HNDL;

          if (item.HREF_HNDL === 0) {
            _this2._iColumnHeight = 55;
          }

          var field = allCatalog[FIELDNAME];
          field.HREF_HNDL = item.HREF_HNDL;
          field.OUTPUTLEN = item.OUTPUTLEN;
          field.COL_POS = item.ZORDER;
          field.TECH = '';
          field.NO_OUT = '';
          return field;
        });

        this._oModel.setProperty('/catalog', this._buildColumns(newCatalog));

        this._oModel.setProperty('/allCatalog', allCatalog);
      },

      /**
       * @function
       * @name _buildColumns
       * @description - Agregar campos predeterminadas al catalogo
       *
       * @private
       * @param {object[]} aCatalog - Catalogo actual
       * @returns {object[]}
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      _buildColumns: function _buildColumns(aCatalog) {
        var oStatus = {
          FIELDNAME: 'Status',
          REPTEXT: this.getMessageTextPool('K074'),
          SCRTEXT_L: this.getMessageTextPool('K074'),
          INTTYPE: 'Status',
          TECH: '',
          NO_OUT: '',
          COL_POS: 1,
          MARK: 'X',
          OUTPUTLEN: '250',
          HREF_HNDL: this._iColumnHeight
        };
        var oSolPed = {
          FIELDNAME: 'SolPed',
          REPTEXT: this.getMessageTextPool('K075'),
          SCRTEXT_L: this.getMessageTextPool('K075'),
          INTTYPE: 'SolPed',
          TECH: '',
          NO_OUT: '',
          COL_POS: 2,
          MARK: 'X',
          OUTPUTLEN: '110',
          HREF_HNDL: this._iColumnHeight
        };
        var longTextComp = {
          FIELDNAME: 'longTextComp',
          REPTEXT: this.getMessageTextPool('K216'),
          SCRTEXT_L: this.getMessageTextPool('K216'),
          INTTYPE: 'longTextComp',
          TECH: '',
          NO_OUT: '',
          COL_POS: 100,
          MARK: 'X',
          OUTPUTLEN: '320',
          HREF_HNDL: this._iColumnHeight
        };
        var longText = {
          FIELDNAME: 'longText',
          REPTEXT: this.getMessageTextPool('K366'),
          SCRTEXT_L: this.getMessageTextPool('K366'),
          INTTYPE: 'longText',
          TECH: '',
          NO_OUT: '',
          COL_POS: 100,
          MARK: 'X',
          OUTPUTLEN: '320',
          HREF_HNDL: this._iColumnHeight
        };
        var attachments = {
          FIELDNAME: 'Attachments',
          REPTEXT: this.getMessageTextPool('K217'),
          SCRTEXT_L: this.getMessageTextPool('K217'),
          INTTYPE: 'attachments',
          TECH: '',
          NO_OUT: '',
          COL_POS: 100,
          MARK: 'X',
          OUTPUTLEN: '80',
          HREF_HNDL: this._iColumnHeight
        };
        var attachmentsSolPed = {
          FIELDNAME: 'AttachmentsSolPed',
          REPTEXT: this.getMessageTextPool('K221'),
          SCRTEXT_L: this.getMessageTextPool('K221'),
          INTTYPE: 'attachmentsSolPed',
          TECH: '',
          NO_OUT: '',
          COL_POS: 100,
          MARK: 'X',
          OUTPUTLEN: '130',
          HREF_HNDL: this._iColumnHeight
        };
        var fixedColumns = [oStatus, oSolPed];
        var colPos = fixedColumns.length;
        var orderedCatalog = fixedColumns.concat(aCatalog.filter(function (_ref3) {
          var TECH = _ref3.TECH,
              NO_OUT = _ref3.NO_OUT;
          return TECH !== 'X' && NO_OUT !== 'X';
        }).sort(function (a, b) {
          return a.COL_POS - b.COL_POS;
        }).map(function (catalog, index) {
          return _objectSpread(_objectSpread({}, catalog), {}, {
            COL_POS: index + colPos + 1
          });
        })); // Agregar Texto Largo de ultimo

        orderedCatalog.push(longTextComp);
        orderedCatalog.push(longText);
        orderedCatalog.push(attachments);
        orderedCatalog.push(attachmentsSolPed);
        return orderedCatalog;
      },

      /**
       * @function
       * @name _getSelectedIndices
       * @description - Obtener los indices de las filas seleccionadas de la tabla
       *
       * @private
       * @param {sap.ui.table.Table} oTable - Tabla de la vista
       * @returns {Promise}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _getSelectedIndices: function _getSelectedIndices(oTable) {
        var aSelectedIndices = oTable.getSelectedIndices();

        if (isEmpty(aSelectedIndices)) {
          return Promise.reject(new Error(this.getMessageTextPool('K058')));
        }

        return Promise.resolve(aSelectedIndices);
      },

      /**
       * @function
       * @name _getDocContextByIndices
       * @description - Obtener los contextos de los pedidos de las filas seleccionadas de la tabla
       *
       * @private
       * @param {sap.ui.table.Table} oTable - Tabla de la vista
       * @param {string} prop - Propiedad
       * @param {object[]} aSelectedIndices - Indices seleccionados
       * @returns {Promise}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _getDocContextByIndices: function _getDocContextByIndices(oTable, prop, aSelectedIndices) {
        var aContext = aSelectedIndices.map(function (i) {
          return oTable.getContextByIndex(i);
        }).filter(function (context) {
          return !isEmpty(context.getProperty(prop));
        });
        this._aSelectedContext = aContext;
        this._aSelectedObjects = aContext.map(function (context) {
          return context.getObject();
        });
        return isEmpty(aContext) ? Promise.reject(new Error(this.getMessageTextPool('K131'))) : Promise.resolve(aContext);
      },

      /**
       * @function
       * @name _openAssignUserDialog
       * @description - Abrir dialogo de parametros para asignar usuario responsable
       *
       * @private
       * @returns {void} - No retorna nada
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _openAssignUserDialog: function _openAssignUserDialog() {
        var _this3 = this;

        // this._saveInfoContext(aContext)
        if (!this._oAssignUserDialog) {
          var oView = this.getView();
          Fragment.load({
            id: oView.getId(),
            name: 'com.innova.sitrack.view.purchaseTracking.dialog.AssignUser',
            controller: this
          }).then(function (control) {
            var oDialog =
            /** @type {sap.m.Dialog} */
            control; // connect dialog to the root view of this component (models, lifecycle)

            oView.addDependent(oDialog);
            oDialog.addStyleClass(_this3.getOwnerComponent().getContentDensityClass());
            oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
            _this3._oAssignUserDialog = oDialog;
            oDialog.open();
          });
        } else {
          this.getView().byId('buyerAU').setValue();
          this.getView().byId('reasonAU').setValue();

          this._oAssignUserDialog.open();
        }
      },

      /**
       * @function
       * @name _saveInfoContext
       * @description - Guarda la data de los items seleccionados.
       *
       * @private
       * @returns {object}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _saveInfoContext: function _saveInfoContext(aContext) {
        var aSelectedObjects = aContext.map(function (context) {
          return context.getObject();
        });
        var data = {
          aSelectedObjects: aSelectedObjects
        };
        var oModel = new JSONModel(data);
        this.setModel(oModel, 'oDataToSearchHelp');
      },

      /**
       * @function
       * @name _createRequestAssignUser
       * @description - Crear el objeto request para asignar usuario a la solic de pedido
       *
       * @private
       * @returns {object}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _createRequestAssignUser: function _createRequestAssignUser() {
        var buyer = this.byId('buyerAU').getValue();
        var reason = this.byId('reasonAU').getValue();

        if (isEmpty(buyer)) {
          throw new Error(this.getMessageTextPool('K069'));
        }

        return new AssignUser({
          IT_SOLP: this._aSelectedContext.map(function (context) {
            return new ItemAssignUser(_objectSpread(_objectSpread({}, context.getObject()), {}, {
              BUYER: buyer,
              ASSIG_REASON: reason
            }));
          })
        });
      },

      /**
       * @function
       * @name _createUpdateAttachedRequest
       * @description - Crear el objeto request para cargar adjunto
       *
       * @private
       * @returns {object}
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      _createUpdateAttachedRequest: function _createUpdateAttachedRequest() {
        var oUploadAttachment = this._oUploadAttachedDialog.getModel('oUploadAttached').getData();

        var arrayPromise = [];
        var aPositions = oUploadAttachment.positions;
        aPositions.forEach(function (position) {
          var oRequest = new UploadAttached(oUploadAttachment, position.getObject());
          arrayPromise.push(oRequest);
        });
        return arrayPromise;
      },

      /**
       * @function
       * @name _openReturnSolPedDialog
       * @description - Abrir dialogo de parametros para asignar usuario responsable
       *
       * @private
       * @returns {void} - No retorna nada
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _openReturnSolPedDialog: function _openReturnSolPedDialog() {
        var _this4 = this;

        if (!this._oReturnSolPedDialog) {
          var oView = this.getView();
          Fragment.load({
            id: oView.getId(),
            name: 'com.innova.sitrack.view.purchaseTracking.dialog.ReturnSolPed',
            controller: this
          }).then(function (control) {
            var oDialog =
            /** @type {sap.m.Dialog} */
            control; // connect dialog to the root view of this component (models, lifecycle)

            oView.addDependent(oDialog);
            oDialog.addStyleClass(_this4.getOwnerComponent().getContentDensityClass());
            oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
            _this4._oReturnSolPedDialog = oDialog;
            oDialog.open();
          });
        } else {
          this._oReturnSolPedDialog.open();

          this.byId('reasonRSP').setValue();
          this.byId('multiMailAddress').setValue();
          this.byId('multiMailAddress').setTokens([]);
        }
      },

      /**
       * @function
       * @name _createRequestReturnSolPed
       * @description - Crear el objeto request para devolver o ajustar SolPed
       *
       * @private
       * @returns {object}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _createRequestReturnSolPed: function _createRequestReturnSolPed() {
        var _this5 = this;

        var textArea = this.byId('reasonRSP');
        var multiMailAddress = this.byId('multiMailAddress');
        var reason = textArea.getValue();
        var name = textArea.getName();
        var aMailAddress = multiMailAddress.getTokens();

        if (isEmpty(reason)) {
          throw new Error(this.getMessageTextPool('K069'));
        }

        return new ReturnSolPed({
          IT_SOLP: this._aSelectedContext.map(function (context) {
            return new ItemReturnSolPed(_objectSpread(_objectSpread({}, context.getObject()), {}, _defineProperty({
              RETURNED: _this5._oModel.getProperty('/returnOption')
            }, "".concat(name), reason)));
          }),
          IT_EMAIL: aMailAddress.map(function (context) {
            return new ItemEmailAddress(context.getText());
          })
        });
      },

      /**
       * @function
       * @name _saveLayout
       * @description - Se encarga de guardar el layout
       *
       * @private
       * @param {object} context
       * @param {string} context.nameLayout - Nombre
       * @param {string} context.defaultLayout - Si es default
       * @returns {void} - No retorna nada
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _saveLayout: function _saveLayout(_ref4) {
        var nameLayout = _ref4.nameLayout,
            defaultLayout = _ref4.defaultLayout;

        try {
          if (isEmpty(nameLayout)) {
            throw new Error(this.getMessageTextPool('K069'));
          }

          Promise.resolve(this._oSaveDialog.setBusy(true)).then(this._oSaveDialog.setBusy.bind(this._oSaveDialog, true)).then(this._createLayoutRequest.bind(this, {
            nameLayout: nameLayout,
            defaultLayout: defaultLayout
          })).then(petitions.post.bind(petitions, constant.GET_LAYOUT)).then(function (_ref5) {
            var data = _ref5.data;
            return showToast(data.message);
          }).then(this._oSaveDialog.close.bind(this._oSaveDialog)).catch(this.errorHandler.bind(this)).finally(this._oSaveDialog.setBusy.bind(this._oSaveDialog, false));
        } catch (error) {
          this.errorHandler(error);

          this._oSaveDialog.setBusy(false);
        }
      },

      /**
       * @function
       * @name _createLayoutRequest
       * @description - Crear objeto request para el layout
       *
       * @private
       * @param {object} context
       * @param {string} context.nameLayout - Nombre
       * @param {string} context.defaultLayout - Si es default
       * @returns {Promise}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _createLayoutRequest: function _createLayoutRequest(_ref6) {
        var _this6 = this;

        var nameLayout = _ref6.nameLayout,
            defaultLayout = _ref6.defaultLayout;
        return Promise.resolve(new Layout({
          function: LayoutFunction.PROCESS,
          action: LayoutAction.POST,
          nameLayout: nameLayout,
          defaultLayout: defaultLayout,
          catalog: this._oModel.getProperty('/catalog').filter(function (_ref7) {
            var MARK = _ref7.MARK;
            return MARK !== 'X';
          }).map(function (catalog) {
            return new ItemLayout(_objectSpread(_objectSpread({}, catalog), {}, {
              function: LayoutFunction.PROCESS,
              nameLayout: nameLayout,
              columnHeight: _this6._iColumnHeight
            }));
          })
        }));
      },

      /**
       * @function
       * @name _openEmailDialog
       * @description - Abrir dialogo de parametros para asignar usuario responsable
       *
       * @private
       * @returns {void} - No retorna nada
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _openEmailDialog: function _openEmailDialog(_ref8) {
        var _this7 = this;

        var data = _ref8.data;

        if (!this._oEmailDialog) {
          var oView = this.getView();
          Fragment.load({
            id: oView.getId(),
            name: 'com.innova.sitrack.view.purchaseTracking.dialog.Email',
            controller: this
          }).then(function (control) {
            var oDialog =
            /** @type {sap.m.Dialog} */
            control; // connect dialog to the root view of this component (models, lifecycle)

            oView.addDependent(oDialog);
            oDialog.addStyleClass(_this7.getOwnerComponent().getContentDensityClass());
            oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
            oDialog.setModel(new JSONModel(data));
            _this7._oEmailDialog = oDialog;
            oDialog.open();
            formUtils.addValidatorEmailMultiInputs({
              fields: oDialog.getControlsByFieldGroupId('email')
            });
          });
        } else {
          this._oEmailDialog.setModel(new JSONModel(data));

          this._oEmailDialog.open();

          formUtils.addValidatorEmailMultiInputs({
            fields: this._oEmailDialog.getControlsByFieldGroupId('email')
          });
        }
      },

      /**
       * @function
       * @name _createReminberRequest
       * @description - Crear objeto request para recordatorio
       *
       * @private
       * @returns {object}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _createReminberRequest: function _createReminberRequest() {
        var _this8 = this;

        var emails = this._oEmailDialog.getModel().getData();

        var IT_PED = [];
        emails.forEach(function (email) {
          var aDocs = _this8._aSelectedContext.filter(function (context) {
            return Number.isNaN(Number(context.getProperty('POH_LIFNR'))) || Number.isNaN(Number(email.LIFNR)) ? context.getProperty('POH_LIFNR') === email.LIFNR : Number(context.getProperty('POH_LIFNR')) === Number(email.LIFNR);
          });

          aDocs.forEach(function (doc) {
            IT_PED.push(new ItemReminder(_objectSpread(_objectSpread({}, doc.getObject()), email)));
          });
          return IT_PED;
        });
        return new Reminder({
          IT_PED: IT_PED
        });
      },

      /**
       * @function
       * @name _getAllData
       * @description - Obtener todos los datos
       *
       * @private
       * @returns {Promise}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _getAllData: function _getAllData() {
        var _this9 = this;

        this._allData = true;
        return this._getNextPage().then(function (_ref9) {
          var _ref9$data = _ref9.data;
          _ref9$data = _ref9$data === void 0 ? {} : _ref9$data;
          var _ref9$data$items = _ref9$data.items,
              items = _ref9$data$items === void 0 ? [] : _ref9$data$items;
          _this9._items = _this9._items.concat(items);
          return _this9._nextKeys.length > 0 ? _this9._getAllData() : Promise.resolve();
        });
      },

      /**
       * @function
       * @name _setFilterByColumn
       * @description - Establecer filtro por columna
       *
       * @private
       * @param {object} context - Nuevos items
       * @param {sap.ui.table.Column} context.column - Nuevos items
       * @param {object[]} context.filters - Nuevos items
       * @param {boolean} context.isEmptyValue - Nuevos items
       * @param {string} context.value - Nuevos items
       * @returns {void}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _setFilterByColumn: function _setFilterByColumn(_ref10) {
        var column = _ref10.column,
            filters = _ref10.filters,
            isEmptyValue = _ref10.isEmptyValue,
            value = _ref10.value;

        this._oProcessTable.getBinding('rows').filter(filters);

        column.setFiltered(!isEmptyValue);
        column.setFilterValue(value);

        if (this._oFilteredPreviousColumn && this._oFilteredPreviousColumn !== column) {
          this._oFilteredPreviousColumn.setFilterValue('');

          this._oFilteredPreviousColumn.setFiltered(false);
        }

        this._oFilteredPreviousColumn = column;

        if (value === '') {
          this._oFilteredPreviousColumn = null;
        }
      },

      /**
       * @function
       * @name openFindApprover
       * @description - Abrir fragment para seleccionar aprobador
       *
       * @private
       * @returns
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      _openViewAttachment: function _openViewAttachment() {
        var _this10 = this;

        if (!this._oViewAttachment) {
          var oView = this.getView();
          Fragment.load({
            id: oView.getId(),
            name: 'com.innova.sitrack.view.purchaseTracking.fragment.attachment.ViewAttachment',
            controller: this
          }).then(function (control) {
            var oDialog =
            /** @type {sap.m.Dialog} */
            control; // connect dialog to the root view of this component (models, lifecycle)

            oView.addDependent(oDialog);
            oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
            _this10._oViewAttachment = oDialog;
            oDialog.open();
          });
        } else {
          this._oViewAttachment.open();
        }
      },
      _openViewAttachmentDocument: function _openViewAttachmentDocument() {
        var _this11 = this;

        if (!this._oViewAttachmentDocument) {
          var oView = this.getView();
          Fragment.load({
            id: oView.getId(),
            name: 'com.innova.sitrack.view.purchaseTracking.fragment.attachment.ViewAttachmentDocument',
            controller: this
          }).then(function (control) {
            var oDialog =
            /** @type {sap.m.Dialog} */
            control; // connect dialog to the root view of this component (models, lifecycle)

            oView.addDependent(oDialog);
            oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
            _this11._oViewAttachmentDocument = oDialog;
            oDialog.open();
          });
        } else {
          this._oViewAttachmentDocument.open();
        }
      },

      /**
       * @function
       * @name _responseAttachmentContent
       * @description - Abrir fragment para seleccionar aprobador
       *
       * @private
       * @returns
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      _responseAttachmentContent: function _responseAttachmentContent(_ref11) {
        var res = _ref11.data;
        var base64 = res.content;
        var oBase64Model = this.getModel('base64');
        var oBase64Data = oBase64Model.getData();
        var content = "data:".concat(oBase64Data.extension, ";base64,").concat(base64);
        oBase64Data.content = content;
        oBase64Model.refresh();

        this._oPage.setBusy(false);

        if (oBase64Data.extension) {
          switch (oBase64Data.extension.toUpperCase()) {
            case 'PNG':
              this._openViewAttachment();

              break;

            case 'JPG':
              this._openViewAttachment();

              break;

            case 'JPEG':
              this._openViewAttachment();

              break;

            case 'PDF':
              this.onDownloadAttachment();
              break;

            default:
              this.onDownloadAttachment();
              break;
          }
        } else if (res.url) {
          if (res.url.search('\\\\') > -1 || res.url.search('file:') > -1) {
            // res.url = res.url.replace('\\\\', 'file:///')
            this._onValidateFileExtension(res.url);
          } else {
            var link = document.createElement('a');
            link.href = res.url;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
          }
        }
      },
      _onValidateFileExtension: function _onValidateFileExtension(url) {
        var aux = document.createElement('input');
        aux.setAttribute('value', url); // AÃ±ade el campo a la pÃ¡gina

        document.body.appendChild(aux); // Selecciona el contenido del campo

        aux.select(); // Copia el texto seleccionado

        document.execCommand('copy'); // Elimina el campo de la pÃ¡gina

        document.body.removeChild(aux); // showToast(this.getMessageTextPool('K230'))

        showToast(this.getMessageTextPool('K267')); // const link = document.createElement('a')
        // const sSplitExt = url.split('.')
        // const sExtension = sSplitExt[sSplitExt.length - 1]
        // switch (sExtension.toUpperCase()) {
        //   case 'DOCX':
        //     link.href = `ms-word:ofv|u|${url}`
        //     break
        //   case 'DOC':
        //     link.href = `ms-word:ofv|u|${url}`
        //     break
        //   case 'XLSX':
        //     link.href = `ms-excel:ofv|u|${url}`
        //     break
        //   case 'CSV':
        //     link.href = `ms-excel:ofv|u|${url}`
        //     break
        //   case 'PPTX':
        //     link.href = `ms-powerpoint:ofv|u|${url}`
        //     break
        //   default:
        //     const aux = document.createElement('input')
        //     aux.setAttribute('value', url)
        //     // AÃ±ade el campo a la pÃ¡gina
        //     document.body.appendChild(aux)
        //     // Selecciona el contenido del campo
        //     aux.select()
        //     // Copia el texto seleccionado
        //     document.execCommand('copy')
        //     // Elimina el campo de la pÃ¡gina
        //     document.body.removeChild(aux)
        //     // showToast(this.getMessageTextPool('K230'))
        //     showToast('____Archivo adjunto copiado en portapapeles')
        //     break
        // }
        // document.body.appendChild(link)
        // link.click()
        // document.body.removeChild(link)
      },
      goto: function goto(url, fallback) {
        var script = document.createElement('script');

        script.onload = function () {
          document.location = url;
        };

        script.onerror = function () {
          document.location = fallback;
        };

        script.setAttribute('src', url);
        document.getElementsByTagName('head')[0].appendChild(script);
      },

      /* =========================================================== */

      /* finish: internal methods                                    *
      /* =========================================================== */

      /* =========================================================== */

      /* begin: event handlers                                       */

      /* =========================================================== */

      /**
       * @function
       * @name onDetailPayment
       * @description - crea el request para los detalles de payment y navega a la vista de detalle de pago.
       *
       * @public
       * @returns {void}
       *
       * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
       * @version 0.5.0
       */
      onDetailPayment: function onDetailPayment() {
        var _this12 = this;

        var _this$getModel$getDat2 = this.getModel('store').getData(),
            req = _this$getModel$getDat2.req;

        Promise.resolve(this._oPage.setBusy(true)).then(this._getSelectedIndices.bind(this, this._oProcessTable)).then(this._getDocContextByIndices.bind(this, this._oProcessTable, 'EBELN')).then(function (aContext) {
          var oDetailPayment = new DetailPayment(req);
          oDetailPayment.IT_DOCKEYS = aContext.map(function (c) {
            return new DockKeyPayment(c.getObject());
          });
          return oDetailPayment;
        }).then(petitions.post.bind(petitions, constant.GET_PAYMENT_DETAIL)).then(function (_ref12) {
          var data = _ref12.data;
          var catalog = data.catalog,
              items = data.items;

          if (isEmpty(items)) {
            throw new Error('___No se encontraron datos');
          }

          _this12._oPaymentModel.setProperty('/catalog', catalog);

          _this12._oPaymentModel.setProperty('/items', items);

          _this12._oRouter.navTo('purchaseTrackingPaymentDetail');
        }).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
      },

      /**
       * @function
       * @name onAssingHandler
       * @description - Maneja la ejecuciÃ³n de validar y mostrar dialogo del botÃ³n asignar usuario
       *
       * @public
       * @returns {void}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      onAssingHandler: function onAssingHandler() {
        try {
          this._oPage.setBusy(true);

          this._getSelectedIndices(this._oProcessTable).then(this._getDocContextByIndices.bind(this, this._oProcessTable, 'BANFN')).then(this._openAssignUserDialog.bind(this)).catch(this.errorHandler.bind(this)).then(this._oPage.setBusy.bind(this._oPage, false));
        } catch (error) {
          this.errorHandler(error);
          this.getView().byId('buyerAU').setValue();
          this.getView().byId('reasonAU').setValue();

          this._oPage.setBusy(false);
        }
      },

      /**
       * @function
       * @name onAssingUserHandler
       * @description - Asignar usuario
       *
       * @public
       * @returns {void}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      onAssingUserHandler: function onAssingUserHandler() {
        Promise.resolve(this._oAssignUserDialog.setBusy(true)).then(this._createRequestAssignUser.bind(this)).then(petitions.post.bind(petitions, constant.GET_ASSIGN_USER)) // .then(({ data }) => {
        //   this._aSelectedContext.forEach((context) => {
        //     const object = context.getObject()
        //     const notification = filter(data, {
        //       BANFN: context.getProperty('BANFN'),
        //       BNFPO: context.getProperty('BNFPO'),
        //     })
        //     if (!isEmpty(notification)) {
        //       const [{ TYPE }] = notification
        //       object.notification = {
        //         data: notification,
        //         type: TYPE,
        //       }
        //     }
        //   })
        //   this._oModel.updateBindings()
        //   this._oAssignUserDialog.close()
        // })
        .then(this._updateTableProcess.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oAssignUserDialog.setBusy.bind(this._oAssignUserDialog, false));
      },

      /**
       * @function
       * @name onReturnHandler
       * @description - Maneja la ejecuciÃ³n de validar y mostrar dialogo del botÃ³n retornar solicitud
       *
       * @public
       * @param {string} target - valor
       * @returns {void}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      onReturnHandler: function onReturnHandler(target) {
        try {
          this._oModel.setProperty('/returnOption', target);

          this._oPage.setBusy(true);

          this._getSelectedIndices(this._oProcessTable).then(this._getDocContextByIndices.bind(this, this._oProcessTable, 'BANFN')).then(this._openReturnSolPedDialog.bind(this)).catch(this.errorHandler.bind(this)).then(this._oPage.setBusy.bind(this._oPage, false));
        } catch (error) {
          this.errorHandler(error);

          this._oPage.setBusy(false);
        }
      },

      /**
       * @function
       * @name onReturnSolPedHandler
       * @description - Devolver o ajustar SolPed
       *
       * @public
       * @returns {void}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      onReturnSolPedHandler: function onReturnSolPedHandler() {
        var _this13 = this;

        Promise.resolve(this._oReturnSolPedDialog.setBusy(true)).then(this._createRequestReturnSolPed.bind(this)).then(petitions.post.bind(petitions, constant.GET_RETURN_SOL_PED)).then(function (_ref13) {
          var data = _ref13.data;
          _this13._aSolPedNotifications = data;

          _this13.onUpdateMonitor();

          _this13._oModel.updateBindings();

          _this13._oReturnSolPedDialog.close();
        }).catch(this.errorHandler.bind(this)).finally(this._oReturnSolPedDialog.setBusy.bind(this._oReturnSolPedDialog, false));
      },

      /**
       * @function
       * @name onEmailHandler
       * @description - Obtener correos de proveedores
       *
       * @public
       * @returns {void}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      onEmailHandler: function onEmailHandler() {
        try {
          this._oPage.setBusy(true);

          this._getSelectedIndices(this._oProcessTable).then(this._getDocContextByIndices.bind(this, this._oProcessTable, 'EBELN')).then(function (aContext) {
            return petitions.post(constant.GET_EMAIL_PROV, new EmailProv({
              IT_PROV: aContext.map(function (c) {
                return new ItemEmailProv(c.getObject());
              })
            }));
          }).then(this._openEmailDialog.bind(this)).catch(this.errorHandler.bind(this)).then(this._oPage.setBusy.bind(this._oPage, false));
        } catch (error) {
          this.errorHandler(error);

          this._oPage.setBusy(false);
        }
      },

      /**
       * @function
       * @name onReminberHandler
       * @description - Enviar recordatorio
       *
       * @public
       * @returns {void}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      onReminberHandler: function onReminberHandler() {
        var _this14 = this;

        Promise.resolve(this._oEmailDialog.setBusy(true)).then(this._createReminberRequest.bind(this)).then(petitions.post.bind(petitions, constant.GET_REMINDER)).then(function (_ref14) {
          var data = _ref14.data;

          _this14._setPedNotifications(data);

          _this14._oModel.updateBindings();

          _this14._oEmailDialog.close();
        }).catch(this.errorHandler.bind(this)).finally(this._oEmailDialog.setBusy.bind(this._oEmailDialog, false));
      },

      /**
       * @function
       * @name onRowSelectionChange
       * @description - Maneja el cambio de la selecciÃ³n de la tabla
       *
       * @public
       * @returns {void}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      onRowSelectionChange: function onRowSelectionChange(oEvent) {
        var _this15 = this;

        var selectAll = oEvent.getParameter('selectAll');

        if (selectAll && this._hasMorePages()) {
          this._oPage.setBusy(true);

          this._getAllData().then(function () {
            _this15._setNewData(_this15._items);

            _this15._oProcessTable.selectAll();
          }).catch(this.errorHandler.bind(this)).then(this._oPage.setBusy.bind(this._oPage, false));
        }
      },

      /**
       * @function
       * @name onFilterByColumn
       * @description - Llamado cuando la tabla es filtrada por columna
       *
       * @public
       * @returns {void}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      onFilterByColumn: function onFilterByColumn(oEvent) {
        var _this16 = this;

        oEvent.preventDefault();
        var column = oEvent.getParameter('column');
        var value = oEvent.getParameter('value');
        var isEmptyValue = isEmpty(value);
        var filters = isEmptyValue ? [] : [new Filter(column.getName(), FilterOperator.Contains, "".concat(value))];
        var promise = Promise.resolve(this._oPage.setBusy(true));

        if (this._hasMorePages()) {
          promise = this._getAllData().then(function () {
            _this16._setNewData(_this16._items);
          });
        }

        promise.then(this._setFilterByColumn.bind(this, {
          column: column,
          filters: filters,
          isEmptyValue: isEmptyValue,
          value: value
        })).catch(this.errorHandler.bind(this)).then(this._oPage.setBusy.bind(this._oPage, false));
      },

      /**
       * @function
       * @name onSendOrderApprovers
       * @description - Se encarga de enviar Sol.Ped/Pos Ã³ nÃºmero de pedido para consulta de aprobadores
       *
       * @public
       * @param {object} oEvent - Evento al seleccionar opciÃ³n del menÃº
       * @returns {void} - No retorna nada.
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      onSendApprovers: function onSendApprovers(oEvent) {
        var sTarget = oEvent.getSource().data().target;
        var store = this.getModel('store');
        store.setProperty('/approvalTarget', sTarget);

        this._oPage.setBusy(true);

        this._getSelectedIndices(this._oProcessTable).then(this.goToApprovals.bind(this)).catch(this.errorHandler.bind(this)).then(this._oPage.setBusy.bind(this._oPage, false));
      },

      /**
       * @function
       * @name goToApprovals
       * @description - Navega a vista Aprobadores
       *
       * @public
       * @returns {void} - No retorna nada.
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      goToApprovals: function goToApprovals() {
        var store = this.getModel('store');
        var aDataProcessSelected = [];
        var aDataProcess = this.getModel('process').getData().data;

        var aProcessSelecteed = this._oProcessTable.getSelectedIndices();

        if (!this._oFilteredPreviousColumn) {
          aProcessSelecteed.forEach(function (e) {
            aDataProcessSelected.push(aDataProcess[e]);
          });
        } else {
          var column = this._oFilteredPreviousColumn.getName();

          var value = this._oFilteredPreviousColumn.getFilterValue();

          var oFilteredDataProcess = aDataProcess.filter(function (element) {
            return element[column] === value;
          });
          aProcessSelecteed.forEach(function (e) {
            aDataProcessSelected.push(oFilteredDataProcess[e]);
          });
        }

        store.setProperty('/processSelected', aDataProcessSelected);

        this._oRouter.navTo('approvals');
      },

      /**
       * @function
       * @name onSaveDocuments
       * @description - Guardar documentos
       *
       * @public
       * @returns {void} - No retorna nada.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      onSaveDocuments: function onSaveDocuments() {
        var _this17 = this;

        this._oPage.setBusy(true);

        var _this$getModel$getDat3 = this.getModel('store').getData(),
            keys = _this$getModel$getDat3.keys,
            req = _this$getModel$getDat3.req;

        req.IT_DOCKEYS = keys;

        this._getSelectedIndices(this._oProcessTable).then(this._getDocContextByIndices.bind(this, this._oProcessTable, 'update')).then(this._buildPedSolped.bind(this)).then(this._fetchApiToUpdateDocument.bind(this)) // .then(this._getInitialData.bind(this))
        .then(petitions.post.bind(petitions, "".concat(constant.GET_PROCESS_SELECTED), req)).then(function (_ref15) {
          var _ref15$data = _ref15.data;
          _ref15$data = _ref15$data === void 0 ? {} : _ref15$data;
          var _ref15$data$items = _ref15$data.items,
              items = _ref15$data$items === void 0 ? [] : _ref15$data$items;

          var data = _this17._buildRows(items);

          _this17._oModel.setProperty('/data', []);

          _this17._oModel.setProperty('/data', data);
        }).catch(this.errorHandler.bind(this)).then(this._oPage.setBusy.bind(this._oPage, false));
      },

      /**
       * @function
       * @name _buildPedSolped
       * @description - valida que el pedido y la solicitud de pedido devuelvan valores
       *
       * @private
       * @returns {object}
       *
       * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
       * @version 0.5.0
       */
      _buildPedSolped: function _buildPedSolped(aContext) {
        var pedido = this._createPed(aContext);

        var solPed = this._createSolPed(aContext);

        if (isEmpty(pedido) && isEmpty(solPed)) {
          throw new Error(this.getMessageTextPool('K345'));
        }

        return {
          pedido: pedido,
          solPed: solPed
        };
      },

      /**
       * @function
       * @name _createPed
       * @description - filtra el pedido para validar que funcione
       *
       * @private
       * @returns {object}
       *
       * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
       * @version 0.5.0
       */
      _createPed: function _createPed(aContext) {
        return aContext.filter(function (context) {
          return !isEmpty(context.getProperty('EBELN'));
        }).map(function (context) {
          return new ItemPedModif(context.getObject());
        }).filter(function (item) {
          return item.isUpdate();
        });
      },

      /**
       * @function
       * @name _createSolPed
       * @description - filtra el solped para validar que funcione
       *
       * @private
       * @returns {object}
       *
       * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
       * @version 0.5.0
       */
      _createSolPed: function _createSolPed(aContext) {
        return aContext.filter(function (context) {
          return !isEmpty(context.getProperty('BANFN')) || isEmpty(context.getProperty('EBELN'));
        }).map(function (context) {
          return new ItemSolModif(context.getObject());
        }).filter(function (item) {
          return item.isUpdate();
        });
      },

      /**
       * @function
       * @name onUpdateMonitor
       * @description - Actualizar Monitor
       *
       * @public
       * @returns {void} - No retorna nada.
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      onUpdateMonitor: function onUpdateMonitor() {
        var _this18 = this;

        var _this$getModel$getDat4 = this.getModel('store').getData(),
            keys = _this$getModel$getDat4.keys,
            req = _this$getModel$getDat4.req;

        req.IT_DOCKEYS = keys;
        Promise.resolve(this._oPage.setBusy(true)).then(petitions.post.bind(petitions, "".concat(constant.GET_PROCESS_SELECTED), req)).then(function (_ref16) {
          var _ref16$data = _ref16.data;
          _ref16$data = _ref16$data === void 0 ? {} : _ref16$data;
          var _ref16$data$items = _ref16$data.items,
              items = _ref16$data$items === void 0 ? [] : _ref16$data$items;

          var data = _this18._buildRows(items);

          _this18._oModel.setProperty('/data', []);

          _this18._oModel.setProperty('/data', data);
        }).catch(this.errorHandler.bind(this)).finally(function () {
          _this18._scrollTable = false;

          _this18._oPage.setBusy(false);
        });
      },

      /**
       * @function
       * @name onCreateBid
       * @description - Navegar a la vista de crear licitaciÃ³n.
       *
       * @public
       * @returns {void} - No retorna nada.
       *
       * @author Edgar Perez <eperez@innovainternacional.biz>
       * @version 0.5.0
       */
      onCreateBid: function onCreateBid() {
        try {
          this._oPage.setBusy(true);

          this._getSelectedIndices(this._oProcessTable).then(this._navToBiddingDetail.bind(this)).catch(this.errorHandler.bind(this)).then(this._oPage.setBusy.bind(this._oPage, false));
        } catch (error) {
          this.errorHandler(error);

          this._oPage.setBusy(false);
        }
      },
      errorHandlerSearch: function errorHandlerSearch() {
        MessageBox.success(showToast(this.getMessageTextPool('K266')));
      },

      /**
       * @function
       * @name onExportExcel
       * @description - Descargar datos del monitor a Excel.
       *
       * @public
       * @returns {void} - No retorna nada.
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      onExportExcel: function onExportExcel() {
        var _this19 = this;

        var processModel = this.getModel('process');
        var initialData = processModel.getProperty('/data');
        var controller = this;

        var _this$getModel$getDat5 = this.getModel('store').getData(),
            keys = _this$getModel$getDat5.keys,
            req = _this$getModel$getDat5.req;

        req.IT_DOCKEYS = keys;

        if (initialData.length === keys.length) {
          excel.exportDataInXlsx({
            catalog: Object.values(processModel.getProperty('/allCatalog')),
            data: processModel.getProperty('/data')
          });

          controller._oProcessTable.setSelectedIndex(-1);
        } else {
          Promise.resolve(this._oPage.setBusy(true)).then(petitions.post.bind(petitions, "".concat(constant.GET_PROCESS_SELECTED), req)).then(function (_ref17) {
            var _ref17$data = _ref17.data;
            _ref17$data = _ref17$data === void 0 ? {} : _ref17$data;
            var _ref17$data$items = _ref17$data.items,
                items = _ref17$data$items === void 0 ? [] : _ref17$data$items;

            var data = _this19._buildRows(items);

            _this19._oModel.setProperty('/data', []);

            _this19._oModel.setProperty('/data', data);

            excel.exportDataInXlsx({
              catalog: Object.values(processModel.getProperty('/allCatalog')),
              data: processModel.getProperty('/data')
            });

            controller._oProcessTable.setSelectedIndex(-1);
          }).catch(this.errorHandler.bind(this)).finally(function () {
            _this19._scrollTable = false;

            _this19._oPage.setBusy(false);
          });
        }
      },

      /**
       * @function
       * @name _updateTableProcess
       * @description - Actualizar Tabla de procesos
       *
       * @public
       * @returns {void} - No retorna nada.
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      _updateTableProcess: function _updateTableProcess(response) {
        var _this20 = this;

        var dataResponse = response.data;

        var _this$getModel$getDat6 = this.getModel('store').getData(),
            keys = _this$getModel$getDat6.keys,
            req = _this$getModel$getDat6.req;

        req.IT_DOCKEYS = keys;
        Promise.resolve(this._oPage.setBusy(true)).then(petitions.post.bind(petitions, "".concat(constant.GET_PROCESS_SELECTED), req)).then(function (_ref18) {
          var _ref18$data = _ref18.data;
          _ref18$data = _ref18$data === void 0 ? {} : _ref18$data;
          var _ref18$data$items = _ref18$data.items,
              items = _ref18$data$items === void 0 ? [] : _ref18$data$items;

          var data = _this20._buildRows(items);

          _this20._oModel.setProperty('/data', []);

          _this20._oModel.setProperty('/data', data);
        }).catch(this.errorHandler.bind(this)).finally(function () {
          _this20._aSelectedContext.forEach(function (context) {
            var object = context.getObject();
            var notification = filter(dataResponse, {
              BANFN: context.getProperty('BANFN'),
              BNFPO: context.getProperty('BNFPO')
            }); // const notification = dataResponse.item

            if (!isEmpty(notification)) {
              var _notification = _slicedToArray(notification, 1),
                  TYPE = _notification[0].TYPE;

              object.notification = {
                data: notification,
                type: TYPE
              };
            }
          });

          _this20._oModel.updateBindings();

          _this20._oAssignUserDialog.close();

          _this20._scrollTable = false;

          _this20._oPage.setBusy(false);
        });
      },

      /**
       * @function
       * @name _fetchApiToUpdateDocument
       * @description - Buscar y armar request para Ped. Ã³ para SolPed
       *
       * @public
       * @returns {void} - No retorna nada.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _fetchApiToUpdateDocument: function _fetchApiToUpdateDocument(_ref19) {
        var pedido = _ref19.pedido,
            solPed = _ref19.solPed;
        var promises = [this._getReqObjToUpdatePed.bind(this, pedido), this._getReqObjToUpdateSolPed.bind(this, solPed)];
        return promises.reduce(function (acc, el) {
          return acc.then(function (res) {
            return el().then(function (resp) {
              return [].concat(_toConsumableArray(res), [resp]);
            });
          });
        }, Promise.resolve([]));
      },

      /**
       * @function
       * @name _getReqObjToUpdatePed
       * @description - Obtener Request para Pedido
       *
       * @public
       * @returns {void} - No retorna nada.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _getReqObjToUpdatePed: function _getReqObjToUpdatePed(pedido) {
        var _this21 = this;

        return !isEmpty(pedido) ? petitions.post(constant.GET_UPDATE_PED, new PedModif({
          IT_PEDMODIF: pedido
        })).then(function (_ref20) {
          var data = _ref20.data;
          _this21._aPedNotifications = data;
        }) : Promise.resolve();
      },

      /**
       * @function
       * @name _getReqObjToUpdateSolPed
       * @description - Obtener Request para SolPed.
       *
       * @public
       * @returns {void} - No retorna nada.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _getReqObjToUpdateSolPed: function _getReqObjToUpdateSolPed(solPed) {
        var _this22 = this;

        return !isEmpty(solPed) ? petitions.post(constant.GET_UPDATE_SOL_PED, new SolModif({
          IT_SOLMODIF: solPed
        })).then(function (_ref21) {
          var data = _ref21.data;
          _this22._aSolPedNotifications = data;
        }) : Promise.resolve();
      },

      /**
       * @function
       * @name _setPedNotifications
       * @description - Setear notificaciÃ³n para Pedidos a los items tratados
       *
       * @public
       * @returns {void} - No retorna nada.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _setPedNotifications: function _setPedNotifications(data) {
        this._aSelectedContext.forEach(function (context) {
          var object = context.getObject();
          var notificationForPos = filter(data, {
            EBELN: context.getProperty('EBELN'),
            EBELP: context.getProperty('EBELP')
          });

          if (!isEmpty(notificationForPos)) {
            var _notificationForPos = _slicedToArray(notificationForPos, 1),
                TYPE = _notificationForPos[0].TYPE;

            object.notification = {
              data: notificationForPos,
              type: TYPE
            };
          }
        });
      },

      /**
       * @function
       * @name onUpdateDocuments
       * @description - Evento modificar documentos
       *
       * @public
       * @returns {void} - No retorna nada.
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      onUpdateDocuments: function onUpdateDocuments() {
        this._getSelectedIndices(this._oProcessTable).then(this._onOpenUpdateDocuments.bind(this)).catch(this.errorHandler.bind(this));
      },

      /**
       * @function
       * @name _onOpenUpdateDocuments
       * @description - Abrir formulario para modificar documentos
       *
       * @public
       * @returns {void} - No retorna nada.
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      _onOpenUpdateDocuments: function _onOpenUpdateDocuments() {
        var _this23 = this;

        if (!this._oModifyDocuments) {
          var oView = this.getView();
          Fragment.load({
            id: oView.getId(),
            name: 'com.innova.sitrack.view.purchaseTracking.fragment.process.ModifyDocuments',
            controller: this
          }).then(function (control) {
            var oDialog =
            /** @type {sap.m.Dialog} */
            control; // connect dialog to the root view of this component (models, lifecycle)

            oView.addDependent(oDialog);
            oDialog.getEndButton().attachPress(_this23.closeFormModifyDocuments.bind(_this23));
            _this23._oModifyDocuments = oDialog;
            oDialog.open();
          });
        } else {
          this._oModifyDocuments.open();
        }
      },

      /**
       * @function
       * @name handleModifyDocuments
       * @description - Modificar valores de los items seleccionados con los datos ingresados en el formulario
       *
       * @public
       * @returns {void} - No retorna nada.
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      handleModifyDocuments: function handleModifyDocuments() {
        var aSelectedItems = this._oProcessTable.getSelectedIndices();

        var oModelProcess = this.getModel('process');
        var aDataTable = oModelProcess.getData().data;
        var rbModifyDocument = this.byId('rbModifyDocument');
        var aButtons = rbModifyDocument.getButtons();
        var aValueForm = this.getValuesFormModifyDocuments();
        aSelectedItems.forEach(function (itemSelected) {
          var oDataTable = aDataTable[itemSelected];
          aValueForm.forEach(function (valueForm) {
            var sFieldName = valueForm.fieldname;

            if (sFieldName.search('PR') > -1) {
              if (aButtons[0].getSelected()) {
                oDataTable.update = true;
                oDataTable[sFieldName] = valueForm.value;
                oDataTable["".concat(sFieldName, "_FLAG")] = 'X';
              }
            } else if (sFieldName.search('POI') > -1) {
              if (aButtons[1].getSelected()) {
                oDataTable.update = true;

                if (sFieldName === 'POI_LFDAT') {
                  oDataTable.POI_EINDT = valueForm.value;
                  oDataTable.POI_EINDT_FLAG = 'X';
                } else if (sFieldName === 'POI_EBAKZ') {
                  oDataTable.POI_ELIKZ = valueForm.value;
                  oDataTable.POI_ELIKZ_FLAG = 'X';
                } else {
                  oDataTable[sFieldName] = valueForm.value;
                  oDataTable["".concat(sFieldName, "_FLAG")] = 'X';
                }
              }
            }
          });
        });
        oModelProcess.refresh();

        this._oModifyDocuments.close();

        this.onSaveDocuments();
      },

      /**
       * @function
       * @name getValuesFormModifyDocuments
       * @description - Obtener valores del formulario de modificaciÃ³n de documentos
       *
       * @public
       * @returns {array} - Retorna arreglo con valores
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      getValuesFormModifyDocuments: function getValuesFormModifyDocuments() {
        var _this24 = this;

        var aValueForm = [];

        this._oModifyDocuments.getControlsByFieldGroupId('formModifyDocuments').forEach(function (oControl) {
          var typeOf = oControl.getMetadata().getName();

          var _typeOf$split$reverse = typeOf.split('.').reverse(),
              _typeOf$split$reverse2 = _slicedToArray(_typeOf$split$reverse, 1),
              type = _typeOf$split$reverse2[0];

          var fn = "getValue".concat(type);

          if (_this24[fn]) {
            var dataControl = oControl.data();
            var element = {};
            element.fieldname = dataControl.fieldname;
            element.value = _this24[fn](oControl);
            aValueForm.push(element);

            _this24["clean".concat(type)](oControl);
          }
        });

        return aValueForm;
      },

      /**
       * @function
       * @name getValueDatePicker
       * @description - Obtener valor del campo de fecha.
       *
       * @public
       * @param {Object} oControl - Contecto actual
       * @returns {String} - Valor del campo de fecha.
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      getValueDatePicker: function getValueDatePicker(oControl) {
        return oControl.getValue();
      },

      /**
       * @function
       * @name getValueSwitch
       * @description - Obtener valor del campo de fecha.
       *
       * @public
       * @param {Object} oControl - Contecto actual
       * @returns {String} - Valor de acuerdo al estado del control
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      getValueSwitch: function getValueSwitch(oControl) {
        return oControl.getState() ? 'X' : null;
      },

      /**
       * @function
       * @name closeFormModifyDocuments
       * @description - Limpiar formulario de modificaciÃ³n de documentos
       *
       * @public
       * @returns {void} - No retorna nada.
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      closeFormModifyDocuments: function closeFormModifyDocuments(fCloseDialog) {
        var _this25 = this;

        this._oModifyDocuments.getControlsByFieldGroupId('formModifyDocuments').forEach(function (oControl) {
          var typeOf = oControl.getMetadata().getName();

          var _typeOf$split$reverse3 = typeOf.split('.').reverse(),
              _typeOf$split$reverse4 = _slicedToArray(_typeOf$split$reverse3, 1),
              type = _typeOf$split$reverse4[0];

          var fn = "clean".concat(type);

          if (_this25[fn]) {
            _this25[fn](oControl);
          }
        });

        if (fCloseDialog) {
          this._oModifyDocuments.close();
        }
      },

      /**
       * @function
       * @name cleanDatePicker
       * @description - Limpiar campos de fecha
       *
       * @public
       * @param {Object} oControl - Contecto actual
       * @returns {void} - No retorna nada
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      cleanDatePicker: function cleanDatePicker(oControl) {
        oControl.setValue();
      },

      /**
       * @function
       * @name cleanSwitch
       * @description - Limpiar campos Switch
       *
       * @public
       * @param {Object} oControl - Contecto actual
       * @returns {void} - No retorna nada
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      cleanSwitch: function cleanSwitch(oControl) {
        oControl.setState(false);
      },

      /**
       * @function
       * @name onSelectOptionModifyDocument
       * @description - Obtener opciÃ³n seleccionada para modificar Sol.Ped / Pedido.
       *
       * @public
       * @param {Object} oEvent - Evento select de radioButtonGroup
       * @returns {void} - No retorna nada
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      onSelectOptionModifyDocument: function onSelectOptionModifyDocument(oEvent) {
        var oSource = oEvent.getSource();
        var aButtons = oSource.getButtons();
        var fieldsContainerSolPed = this.byId('fieldsContainerSolPed');
        var fieldsContainerPed = this.byId('fieldsContainerPed');

        if (aButtons[0].getSelected()) {
          fieldsContainerSolPed.setVisible(true);
          fieldsContainerPed.setVisible(false);
        } else {
          fieldsContainerSolPed.setVisible(false);
          fieldsContainerPed.setVisible(true);
        }

        this.closeFormModifyDocuments(false);
      },

      /**
       * @function
       * @name onResetFilters
       * @description -Restaurar filtros de la tabla
       *
       * @public
       * @returns {void}
       *
       * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
       * @version 0.5.0
       */
      onResetFilters: function onResetFilters() {
        try {
          this._oPage.setBusy(true);

          var iTotalCols = this._oProcessTable.getColumns().length;

          var iColCounter = 0;
          this._oFilteredPreviousColumn = null;

          for (iColCounter = 0; iColCounter < iTotalCols; iColCounter += 1) {
            var column = this._oProcessTable.getColumns()[iColCounter];

            this._oProcessTable.getBinding('rows').filter([]);

            column.setFilterValue('');
            column.setFiltered(false);
          }
        } catch (error) {
          this.errorHandler(error);
        } finally {
          this._oPage.setBusy(false);
        }
      },

      /**
       * @function
       * @name onConsultAttachment
       * @description - Consultar adjunto seleccionado
       *
       * @public
       * @param {Object} oDataItemSelected - Datos del item del Monitor seleccionado
       * @param {Object} sPathAttachment - Path del adjunto seleccionado
       * @returns {void}
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      onConsultAttachment: function onConsultAttachment(oDataItemSelected, sPathAttachment) {
        this._oPage.setBusy(true);

        try {
          var sPath = sPathAttachment.split('/')[2];
          var oAttachment = oDataItemSelected.INF_ADJUNTOS[sPath];
          var data = {
            id: oAttachment.ADJID,
            name: oAttachment.NOMBRE,
            extension: oAttachment.EXTENSION
          };
          var oModel = new JSONModel(data);
          this.setModel(oModel, 'base64');
          var req = new GetAttachment(data);
          petitions.post("".concat(constant.GET_ATTACHMENT), req).then(this._responseAttachmentContent.bind(this));
        } catch (error) {
          this.errorHandler(error);

          this._oPage.setBusy(false);
        }
      },

      /**
       * @function
       * @name onConsultAttachmentSolPed
       * @description - Consultar adjunto SolPed seleccionado
       *
       * @public
       * @param {Object} oDataItemSelected - Datos del item del Monitor seleccionado
       * @param {Object} sPathAttachment - Path del adjunto seleccionado
       * @returns {void}
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      onConsultAttachmentSolPed: function onConsultAttachmentSolPed(oDataItemSelected, sPathAttachment) {
        this._oPage.setBusy(true);

        try {
          var sPath = sPathAttachment.split('/')[2];
          var oAttachment = oDataItemSelected.INF_ADJUNTO_SOLP[sPath];
          var data = {
            id: oAttachment.ADJID,
            name: oAttachment.NOMBRE,
            extension: oAttachment.EXTENSION
          };
          var oModel = new JSONModel(data);
          this.setModel(oModel, 'base64');
          var req = new GetAttachment(data);
          petitions.post("".concat(constant.GET_ATTACHMENT), req).then(this._responseAttachmentContent.bind(this));
        } catch (error) {
          this.errorHandler(error);

          this._oPage.setBusy(false);
        }
      },

      /**
       * @function
       * @name onDownloadAttachment
       * @description - Descargar adjunto visualizado
       *
       * @public
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      onDownloadAttachment: function onDownloadAttachment() {
        var oModelBase64 = this.getModel('base64');
        var oInfoBase64 = oModelBase64.getData();
        var linkSource = oInfoBase64.content;
        var downloadLink = document.createElement('a');
        downloadLink.href = linkSource;
        downloadLink.download = "".concat(oInfoBase64.name, ".").concat(oInfoBase64.extension);
        downloadLink.click();
      },

      /**
       * @function
       * @name onChangeMailAddress
       * @description - Controlar evento change del campo direcciÃ³n de correos al devoler o corregir una disposiciÃ³n
       *
       * @public
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      onChangeMailAddress: function onChangeMailAddress(oEvent) {
        var oSource = oEvent.getSource();
        var sValue = oEvent.getParameters().value;
        var mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        var aCurrentTokens = oSource.getTokens();

        if (sValue.match(mailformat)) {
          oSource.setValue();
          oSource.setTokens([]);
          var aTokens = [];
          aCurrentTokens.forEach(function (token) {
            aTokens.push(new Token({
              text: token.getText(),
              key: token.getText()
            }));
          });
          aTokens.push(new Token({
            text: sValue,
            key: sValue
          }));
          oSource.setTokens(aTokens);
        } else {
          showToast(this.getMessageTextPool('K230'));
        }
      },

      /**
       * @function
       * @name onChangeEmails
       * @description - Setear valores al campo emails
       *
       * @private
       * @returns {void} - No retorna nada
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      onChangeEmails: function onChangeEmails(oEvent) {
        var oSource = oEvent.getSource();
        var sValue = oEvent.getParameters().value;

        var _oEvent$getSource$get = oEvent.getSource().getBindingContext(),
            sPath = _oEvent$getSource$get.sPath;

        var oModelSource = oSource.getModel();

        var _oModelSource$getProp = oModelSource.getProperty(sPath),
            E_MAILS = _oModelSource$getProp.E_MAILS;

        var oNewEmail = {};
        oNewEmail.EMAIL = sValue;
        oNewEmail.RECIPNAME = '';
        oNewEmail.REGID = 0;
        oNewEmail.UNAME = '';

        if (!E_MAILS) {
          E_MAILS = [];
          E_MAILS.push(oNewEmail);
          oSource.setValue();
          oModelSource.setProperty("".concat(sPath, "/E_MAILS"), E_MAILS);
          oModelSource.refresh();
        } else {
          E_MAILS.push(oNewEmail);
          oSource.setValue();
          oModelSource.refresh();
        }
      },

      /**
       * @function
       * @name onOpenUploadAttached
       * @description - Capturar CustomData y validar items
       *
       * @private
       * @returns {void} - No retorna nada
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      onOpenUploadAttached: function onOpenUploadAttached(oEvent) {
        var oSource = oEvent.getSource();

        var _oSource$data = oSource.data(),
            target = _oSource$data.target;

        var data = {
          target: target,
          desc: '',
          url: '',
          positions: []
        };
        var oModel = new JSONModel(data);
        this.setModel(oModel, 'oUploadAttached');

        this._getSelectedIndices(this._oProcessTable).then(this._getDocContextByIndices.bind(this, this._oProcessTable, 'BANFN')).then(this._openUploadAttached.bind(this)).catch(this.errorHandler.bind(this)).then(this._oPage.setBusy.bind(this._oPage, false));
      },

      /**
       * @function
       * @name _openUploadAttached
       * @description - Abrir Dialogo para cargar URL.
       *
       * @private
       * @returns {void} - No retorna nada
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      _openUploadAttached: function _openUploadAttached() {
        var _this26 = this;

        var oModelUploadAttached = this.getModel('oUploadAttached');
        var oDataUploadAttached = oModelUploadAttached.getData();
        oDataUploadAttached.positions = this._aSelectedContext;

        if (!this._oUploadAttachedDialog) {
          var oView = this.getView();
          Fragment.load({
            id: oView.getId(),
            name: 'com.innova.sitrack.view.purchaseTracking.dialog.UploadAttached',
            controller: this
          }).then(function (control) {
            var oDialog =
            /** @type {sap.m.Dialog} */
            control; // connect dialog to the root view of this component (models, lifecycle)

            oView.addDependent(oDialog);
            oDialog.addStyleClass(_this26.getOwnerComponent().getContentDensityClass());
            oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
            oDialog.setModel(new JSONModel(oDataUploadAttached));
            _this26._oUploadAttachedDialog = oDialog;
            oDialog.open();
            formUtils.addValidatorEmailMultiInputs({
              fields: oDialog.getControlsByFieldGroupId('email')
            });
          });
        } else {
          this._oUploadAttachedDialog.setModel(new JSONModel(oDataUploadAttached));

          this._oUploadAttachedDialog.open();

          formUtils.addValidatorEmailMultiInputs({
            fields: this._oUploadAttachedDialog.getControlsByFieldGroupId('email')
          });
        }
      },

      /**
       * @function
       * @name onUploadAttached
       * @description - Guardar / Cargar Adjunto
       *
       * @private
       * @returns {void} - No retorna nada
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      onUploadAttached: function onUploadAttached() {
        var oUploadAttachment = this._oUploadAttachedDialog.getModel('oUploadAttached').getData();

        if (oUploadAttachment.desc || oUploadAttachment.url) {
          this._oUploadAttachedDialog.setBusy(true);

          this._createUpdateAttachedRequest().map(function (el) {
            return petitions.post.bind(petitions, "".concat(constant.POST_UPLOAD_ATTACHED), el);
          }).reduce(function (acc, el) {
            return acc.then(function (res) {
              return el().then(function (resp) {
                return [].concat(_toConsumableArray(res), [resp]);
              });
            });
          }, Promise.resolve([])).then(this._processResponseAttached.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oUploadAttachedDialog.setBusy.bind(this._oUploadAttachedDialog, false));
        } else {
          showToast(this.getMessageTextPool('K069'));
        }
      },

      /**
       * @function
       * @name _processResponseAttached
       * @description - Obtener respuesta y mostrar mensaje
       *
       * @private
       * @returns {void} - No retorna nada
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      _processResponseAttached: function _processResponseAttached() {
        MessageBox.success('Adjunto creado satisfactoriamente');
        this.onUpdateMonitor();

        this._oUploadAttachedDialog.close();
      },

      /**
       * @function
       * @name _navToBiddingDetail
       * @description - Navega a vista licitaciÃ³n
       *
       * @public
       * @returns {void} - No retorna nada.
       *
       * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
       * @version 0.5.0
       */
      _navToBiddingDetail: function _navToBiddingDetail() {
        var _this27 = this;

        var store = this.getModel('store');

        var aProcessSelecteed = this._oProcessTable.getSelectedIndices();

        var aDataProcess = this.getModel('process').getData().data;
        var aDataProcessSelected = [];
        aProcessSelecteed.forEach(function (e) {
          aDataProcessSelected.push(aDataProcess[e]);
        });
        Promise.resolve(this._oPage.setBusy(true)).then(petitions.post.bind(petitions, constant.GET_SEARCH_HELP, new SearchHelpModel('WERKS'))).then(function (_ref22) {
          var data = _ref22.data;
          var werksResponse = data.data;
          aDataProcessSelected.forEach(function (element) {
            if (element.LICITA !== '' || element.PR_LOEKZ !== '' || element.PR_BLCKD !== '' || element.PR_EBAKZ !== '') {
              throw new Error("".concat(_this27.getMessageTextPool('K342'), " ").concat(element.BANFN, " / ").concat(element.BNFPO));
            }

            if (element.EBELN !== '' && element.PR_MENGE <= element.POI_MENGE) {
              throw new Error("".concat(_this27.getMessageTextPool('K342'), " ").concat(element.BANFN, " / ").concat(element.BNFPO));
            }

            var werksFound = werksResponse.find(function (el) {
              return el.FCODE1 === element.PR_WERKS;
            }); // eslint-disable-next-line no-param-reassign

            element.adStreet = werksFound.FCODE2;
          });
          store.setProperty('/processSelected', aDataProcessSelected);
          store.setProperty('/processData', aDataProcessSelected[0]);

          _this27._oRouter.navTo('purchaseTrackingManage');
        }).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
      }
      /* =========================================================== */

      /* finish: event handlers                                       */

      /* =========================================================== */

    })
  );
});