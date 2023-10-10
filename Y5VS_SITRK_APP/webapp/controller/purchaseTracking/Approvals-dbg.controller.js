"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['../BaseController', 'sap/ui/model/BindingMode', 'sap/ui/model/json/JSONModel', 'sap/ui/core/Fragment', 'com/innova/factory/purchaseTracking/approvals', 'com/innova/model/purchaseTracking/Approval', 'com/innova/model/purchaseTracking/ListApprovals', 'com/innova/model/constant', 'com/innova/service/petitions', 'sap/m/MessageBox', 'com/innova/util/isEmpty'],
/**
 * Module dependencies
 *
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel
 */
function (BaseController, BindingMode, JSONModel, Fragment, approvals, Approval, ListApprovals, constant, petitions, MessageBox, isEmpty) {
  return (
    /**
     * @class
     * @name ApprovalTable.controller.js
     * @extends com.innova.sitrack.controller.BaseController
     * @description - Controlador del formulario de tracking de compras
     *
     * @constructor
     * @public
     * @namespace com.innova.sitrack.controller.approvals
     *
     * @param {String} sId - id for the new control, generated automatically if no id is given
     * @param {Object} mSettings - initial settings for the new control
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    BaseController.extend('com.innova.sitrack.controller.approvals.ApprovalTable', {
      /* =========================================================== */

      /* begin: lifecycle methods                                    */

      /* =========================================================== */
      approvals: approvals,

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
        this._oApprovalTable = this.byId('approvalTable');
        this.getRouter().getRoute('approvals').attachMatched(this._onRouteMatched, this);
      },

      /* =========================================================== */

      /* finish: lifecycle methods                                   */

      /* =========================================================== */

      /* =========================================================== */

      /* begin: internal methods                                     *
      /* =========================================================== */

      /**
       * @function
       * @name _initialState
       * @description - Establecer estado incial del controlador
       *
       * @private
       * @returns {void} - No retorna nada
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _initialState: function _initialState() {
        this._allData = false;
        this._aSelectedContext = [];
        this._iColumnHeight = 100;
        this._isExcel = false;
        this._items = [];
        this._oReq = {};
        this._scrollTable = false;
        this._sTargetReturn = '';
        this._oFilteredPreviousColumn = null;
      },

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
        var oStore = this.getOwnerComponent().getModel('store');
        var req = oStore.getProperty('/req');
        var keys = oStore.getProperty('/keys');

        if (!Object.keys(req).length || !Object.keys(keys).length) {
          this.getModel('appView').setProperty('/resetProcessForm', true);
          this.getRouter().navTo('purchaseTracking', {}, true);
          return;
        }

        this.getModel('appView').setProperty('/resetProcessForm', false); // this._initialState()

        this._oReq = req;
        this._oModel = new JSONModel();

        this._oModel.setData(null);

        this._oModel.setDefaultBindingMode(BindingMode.TwoWay);

        this._oModel.setSizeLimit(1000000);

        this.setModel(this._oModel, 'approvals');
        Promise.resolve(this._oPage.setBusy(true)).then(this._buildRequest.bind(this)).then(this._fetchData.bind(this)).then(this._handleResponse.bind(this)).catch(this.errorHandler.bind(this)).then(this._oPage.setBusy.bind(this._oPage, false));
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
      _buildRequest: function _buildRequest() {
        var store = this.getModel('store');
        var processSelected = store.getProperty('/processSelected');
        var approvalTarget = store.getProperty('/approvalTarget');
        var aReq = [];
        processSelected.forEach(function (o) {
          var oReq = {};

          if (approvalTarget === 'A') {
            oReq.BANFN = o.BANFN; // Sol.Ped

            oReq.BNFPO = o.BNFPO; // Pos
          }

          if (approvalTarget === 'B') {
            oReq.EBELN = o.EBELN; // Pedido

            oReq.EBELP = o.EBELP;
          }

          aReq.push(oReq);
        });
        var oData = {};
        oData.IT_DOCKEYS = aReq;
        this._oReq = new Approval(oData);
      },

      /**
       * @function
       * @name _buildRequestListApprovers
       * @description - Construir objeto request para obtener lista de aprobadores
       *
       * @private
       * @param {Object} oDataItem CustomData del Elemento
       * @param {String} sPath - Path del item seleccionado
       * @returns {void} - No retorna nada
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _buildRequestListApprovers: function _buildRequestListApprovers(oDataItem, sPath) {
        var oModelStore = this.getModel('store');
        var oModelapprovals = this.getModel('approvals');
        var approvalTarget = oModelStore.getProperty('/approvalTarget');
        var oDataItemSelected = oModelapprovals.getProperty(sPath);
        var data = {};
        data.TIPO = approvalTarget === 'A' ? 1 : 2;
        data.DOC = oDataItemSelected.DOCUMENTO;
        data.POS = oDataItemSelected.BNFPO;
        data.COD_LIB = oDataItem.code;
        this._oReq = new ListApprovals(data);
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
        var oDataModel = {};

        if (isEmpty(this._oRes.items)) {
          var that = this;
          MessageBox.error(this.getMessageTextPool('K344'), {
            actions: [MessageBox.Action.OK],
            onClose: function onClose() {
              that.onNavBack();
            }
          });
        } else {
          oDataModel.data = this._buildRows(this._oRes.items);
          oDataModel.catalog = JSON.parse(JSON.stringify(this._oRes.catalog));
          oDataModel.catalog = this._buildColumns(oDataModel.catalog, oDataModel.data); // set model

          this._oModel = new JSONModel();

          this._oModel.setData(oDataModel);

          this._oModel.setDefaultBindingMode(BindingMode.TwoWay);

          this._oModel.setSizeLimit(1000000);

          this.setModel(this._oModel, 'approvals');
        }
      },

      /**
       * @function
       * @name _handleResponseListApprovers
       * @description - Maneja la respuesta del servicio al consultar lista de aprobadores
       *
       * @private
       * @returns {void} - No retorna nada
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      _handleResponseListApprovers: function _handleResponseListApprovers() {
        if (isEmpty(this._oRes.results)) {
          throw new Error(this.getMessageTextPool('K060'));
        }

        var aApprovers = this._oRes.results;
        var oView = this.getView();
        var oModel =
        /** @type {sap.ui.model.json.JSONModel} */
        oView.getModel('approvals');
        oModel.setProperty('/listApprovers', aApprovers);
      },

      /**
       * @function
       * @name _buildColumns
       * @description - Agregar campos predeterminadas al catalogo
       *
       * @private
       * @param {object[]} aCatalog - Catalogo actual
       * @param {object[]} aData - Datos para el catalogo actual
       * @returns {object[]}
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      _buildColumns: function _buildColumns(aCatalog, aData) {
        var oApproverOne = {
          FIELDNAME: 'ApproverOne',
          REPTEXT: "{main>/textPool/K113}",
          SCRTEXT_L: "{main>/textPool/K113}",
          INTTYPE: 'approver',
          TECH: this._checkVisibility(aData, 1),
          NO_OUT: '',
          COL_POS: 30,
          MARK: 'X',
          OUTPUTLEN: '220'
        };
        var oApproverTwo = {
          FIELDNAME: 'ApproverTwo',
          REPTEXT: "{main>/textPool/K114}",
          SCRTEXT_L: "{main>/textPool/K114}",
          INTTYPE: 'approver',
          TECH: this._checkVisibility(aData, 1),
          NO_OUT: '',
          COL_POS: 31,
          MARK: 'X',
          OUTPUTLEN: '110'
        };
        var oApproverThree = {
          FIELDNAME: 'ApproverThree',
          REPTEXT: "{main>/textPool/K115}",
          SCRTEXT_L: "{main>/textPool/K115}",
          INTTYPE: 'approver',
          TECH: this._checkVisibility(aData, 3),
          NO_OUT: '',
          COL_POS: 32,
          MARK: 'X',
          OUTPUTLEN: '110'
        };
        var oApproverFour = {
          FIELDNAME: 'ApproverFour',
          REPTEXT: "{main>/textPool/K116}",
          SCRTEXT_L: "{main>/textPool/K116}",
          INTTYPE: 'approver',
          TECH: this._checkVisibility(aData, 4),
          NO_OUT: '',
          COL_POS: 33,
          MARK: 'X',
          OUTPUTLEN: '110'
        };
        var oApproverFive = {
          FIELDNAME: 'ApproverFive',
          REPTEXT: "{main>/textPool/K117}",
          SCRTEXT_L: "{main>/textPool/K117}",
          INTTYPE: 'approver',
          TECH: this._checkVisibility(aData, 5),
          NO_OUT: '',
          COL_POS: 34,
          MARK: 'X',
          OUTPUTLEN: '110'
        };
        var oApproverSix = {
          FIELDNAME: 'ApproverSix',
          REPTEXT: "{main>/textPool/K118}",
          SCRTEXT_L: "{main>/textPool/K118}",
          INTTYPE: 'approver',
          TECH: this._checkVisibility(aData, 6),
          NO_OUT: '',
          COL_POS: 35,
          MARK: 'X',
          OUTPUTLEN: '110'
        };
        var oApproverSeven = {
          FIELDNAME: 'ApproverSeven',
          REPTEXT: "{main>/textPool/K119}",
          SCRTEXT_L: "{main>/textPool/K119}",
          INTTYPE: 'approver',
          TECH: this._checkVisibility(aData, 7),
          NO_OUT: '',
          COL_POS: 36,
          MARK: 'X',
          OUTPUTLEN: '110'
        };
        var oApproverEight = {
          FIELDNAME: 'ApproverEight',
          REPTEXT: "{main>/textPool/K120}",
          SCRTEXT_L: "{main>/textPool/K120}",
          INTTYPE: 'approver',
          TECH: this._checkVisibility(aData, 8),
          NO_OUT: '',
          COL_POS: 37,
          MARK: 'X',
          OUTPUTLEN: '110'
        };
        var fixedColumns = [oApproverOne, oApproverTwo, oApproverThree, oApproverFour, oApproverFive, oApproverSix, oApproverSeven, oApproverEight];
        return aCatalog.filter(function (_ref) {
          var TECH = _ref.TECH,
              NO_OUT = _ref.NO_OUT;
          return TECH !== 'X' && NO_OUT !== 'X';
        }).sort(function (a, b) {
          return a.COL_POS - b.COL_POS;
        }).concat(fixedColumns).map(function (catalog, index) {
          return _objectSpread(_objectSpread({}, catalog), {}, {
            COL_POS: index + 1
          });
        });
      },

      /**
       * @function
       * @name _checkVisibility
       * @description - Revisar que por lo menos un registro tenga datos por aprobador para mostrarla en pantalla.
       *
       * @private
       * @param {array[]} aData - Datos de la consutla
       * @param {number} iApprover - Consecutivo de aprobador
       * @returns {String}
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      _checkVisibility: function _checkVisibility(aData, iApprover) {
        var sTech = 'X';
        var key = "APR".concat(iApprover);
        aData.forEach(function (o) {
          if (o[key] !== '') {
            sTech = '';
          }
        });
        return sTech;
      },

      /**
       * @function
       * @name _buildRows
       * @description - Construir datos de las filas
       *
       * @private
       * @param {object[]} aItems - Resultados de la consulta
       * @returns {object[]}
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      _buildRows: function _buildRows(aItems) {
        return aItems.map(function (item) {
          return _objectSpread(_objectSpread({}, item), {}, {
            ApproverOne: {
              name: item.APR1,
              date: item.FEC_APR1,
              hour: item.HORA_APR1,
              days: item.DIAS_APR1,
              code: item.COD_LIB1
            },
            ApproverTwo: {
              name: item.APR2,
              date: item.FEC_APR2,
              hour: item.HORA_APR2,
              days: item.DIAS_APR2,
              code: item.COD_LIB2
            },
            ApproverThree: {
              name: item.APR3,
              date: item.FEC_APR3,
              hour: item.HORA_APR3,
              days: item.DIAS_APR3,
              code: item.COD_LIB3
            },
            ApproverFour: {
              name: item.APR4,
              date: item.FEC_APR4,
              hour: item.HORA_APR4,
              days: item.DIAS_APR4,
              code: item.COD_LIB4
            },
            ApproverFive: {
              name: item.APR5,
              date: item.FEC_APR5,
              hour: item.HORA_APR5,
              days: item.DIAS_APR5,
              code: item.COD_LIB5
            },
            ApproverSix: {
              name: item.APR6,
              date: item.FEC_APR6,
              hour: item.HORA_APR6,
              days: item.DIAS_APR6,
              code: item.COD_LIB6
            },
            ApproverSeven: {
              name: item.APR7,
              date: item.FEC_APR7,
              hour: item.HORA_APR7,
              days: item.DIAS_APR7,
              code: item.COD_LIB7
            },
            ApproverEight: {
              name: item.APR8,
              date: item.FEC_APR8,
              hour: item.HORA_APR8,
              days: item.DIAS_APR8,
              code: item.COD_LIB8
            }
          });
        });
      },

      /**
       * @function
       * @name _resetTableDefaults
       * @description - Reiniciar valor por defecto de la tabla
       *
       * @private
       * @returns {void} - No retorna nada
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _resetTableDefaults: function _resetTableDefaults() {
        var _this = this;

        this._scrollTable = true;

        this._oApprovalTable.$().find('.sapUiTableVSb').scrollTop(0);

        setTimeout(function () {
          _this._scrollTable = false;
        }, 100);
      },

      /**
       * @function
       * @name _fetchData
       * @description - Ir a buscar data al API
       *
       * @private
       * @returns {Promise}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _fetchData: function _fetchData() {
        var _this2 = this;

        var request = JSON.parse(JSON.stringify(this._oReq));
        return this._fetchAPI(request).then(function (_ref2) {
          var data = _ref2.data;
          _this2._oRes = data;
        });
      },

      /**
       * @function
       * @name _fetchAPI
       * @description - Ir a buscar al API
       *
       * @private
       * @param {object} req - Objeto request para la peticiÃ³n
       * @returns {object} - llaves
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _fetchAPI: function _fetchAPI(req) {
        return petitions.post("".concat(constant.GET_APPROVALS_SELECTED), req);
      },
      _fetchDataListApprovers: function _fetchDataListApprovers() {
        var _this3 = this;

        var request = JSON.parse(JSON.stringify(this._oReq));
        return this._fetchAPIListApprovers(request).then(function (_ref3) {
          var data = _ref3.data;
          _this3._oRes = data;
        });
      },
      _fetchAPIListApprovers: function _fetchAPIListApprovers(req) {
        return petitions.post("".concat(constant.LIST_APPROVERS), req);
      },

      /**
       * @function
       * @name openFindApprover
       * @description - Abrir fragment para seleccionar aprobador
       *
       * @private
       * @returns
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _openFindApprover: function _openFindApprover() {
        var _this4 = this;

        if (!this._oListApprovers) {
          var oView = this.getView();
          Fragment.load({
            id: oView.getId(),
            name: 'com.innova.sitrack.view.purchaseTracking.fragment.approvals.ListApprovals',
            controller: this
          }).then(function (control) {
            var oDialog =
            /** @type {sap.m.Dialog} */
            control; // connect dialog to the root view of this component (models, lifecycle)

            oView.addDependent(oDialog);
            oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
            _this4._oListApprovers = oDialog;
            oDialog.open();
          });
        } else {
          this._oListApprovers.open();
        }
      },
      _findApprover: function _findApprover(oEvent) {
        var oSource = oEvent.getSource();
        var oDataItem = oSource.data().dataItem;
        var oItemSelected = oSource.getParent().getParent();

        var _oItemSelected$getBin = oItemSelected.getBindingContext('approvals'),
            sPath = _oItemSelected$getBin.sPath;

        this.getApprovers(oDataItem, sPath);
      },
      getApprovers: function getApprovers(oDataItem, sPath) {
        Promise.resolve(this._oPage.setBusy(true)).then(this._buildRequestListApprovers.bind(this, oDataItem, sPath)).then(this._fetchDataListApprovers.bind(this)).then(this._handleResponseListApprovers.bind(this)).then(this._openFindApprover.bind(this)).catch(this.errorHandler.bind(this)).then(this._oPage.setBusy.bind(this._oPage, false));
      }
      /* =========================================================== */

      /* finish: internal methods                                    *
      /* =========================================================== */

      /* =========================================================== */

      /* begin: event handlers                                       */

      /* =========================================================== */

      /* =========================================================== */

      /* finish: event handlers                                       */

      /* =========================================================== */

    })
  );
});