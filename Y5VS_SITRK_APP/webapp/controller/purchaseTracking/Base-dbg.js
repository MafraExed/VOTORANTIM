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

sap.ui.define(['../BaseController', 'com/innova/model/constant', 'com/innova/service/petitions', 'com/innova/model/states', 'sap/ui/model/json/JSONModel', 'sap/ui/core/ValueState', 'com/innova/vendor/lodash.filter', 'com/innova/vendor/lodash.find', 'com/innova/util/isEmpty', 'sap/ui/model/BindingMode', 'com/innova/formatter/formatMessage'], function (Controller, constant, petitions, states, JSONModel, ValueState, filter, find, isEmpty, BindingMode, formatMessage) {
  return (
    /**
     * @class
     * @name Base.controller.js
     * @extends sap.ui.core.mvc.Controller
     * @description - Controlador de base de la aplicaciÃ³n
     *
     * @constructor
     * @public
     * @namespace com.innova.sitrack.controller.purchaseTracking.Base
     *
     * @param {String} sId - id for the new control, generated automatically if no id is given
     * @param {Object} mSettings - initial settings for the new control
     * @returns {void} - No retorna nada.
     *
     * @author Heinner Mayorga <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    Controller.extend('com.innova.sitrack.controller.purchaseTracking.Base', {
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
        this._aSolPedNotifications = [];
        this._aPedNotifications = [];
        this._iColumnHeight = 100;
        this._isExcel = false;
        this._items = [];
        this._keys = [];
        this._nextKeys = [];
        this._oFilteredPreviousColumn = null;
        this._oReq = {};
        this._scrollTable = false;
        this._sTargetReturn = '';
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
      _onRouteMatched: function _onRouteMatched(oEvent) {
        var _oArgs$Query;

        this._oPaymentModel = this.getOwnerComponent().getModel('payment');
        var oArgs = oEvent.getParameter('arguments');
        var docs = (_oArgs$Query = oArgs['?query']) === null || _oArgs$Query === void 0 ? void 0 : _oArgs$Query.docs;
        var oStore = this.getOwnerComponent().getModel('store');
        var req = oStore.getProperty('/req');
        var keys = oStore.getProperty('/keys');

        if (isEmpty(docs) && (isEmpty(req) || isEmpty(keys))) {
          this.getModel('appView').setProperty('/resetProcessForm', true);
          this.getRouter().navTo('purchaseTracking', {}, true);
          return;
        }

        this.getModel('appView').setProperty('/resetProcessForm', false); // this._initialState()

        this._oProcessTable.setSelectedIndex(-1);

        this._oReq = this._buildReqByStoreOrQueryParams({
          req: req,
          docs: docs
        });
        this.getOwnerComponent().getModel('store').setProperty('/req', this._oReq);
        this._keys = JSON.parse(JSON.stringify(keys !== null && keys !== void 0 ? keys : []));
        this._oQuery = docs;

        if (!this.getModel('appView').getProperty('/backFromButton')) {
          this._fetch();
        } else {
          this._fetchNoLayout();
        }

        this.getModel('appView').setProperty('/backFromButton', false);
      },

      /**
       * @function
       * @name _buildReqByStoreOrUrlParams
       * @description - Construye el objeto de peticiÃ³n a partir de los parÃ¡metros de la url o del store
       *
       * @private
       * @param {Object} context
       * @param {Object} context.req - Objeto de peticiÃ³n
       * @param {String} context.docs - Documentos por parametros de la url
       * @returns {object}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _buildReqByStoreOrQueryParams: function _buildReqByStoreOrQueryParams(_ref) {
        var req = _ref.req,
            _ref$docs = _ref.docs,
            docs = _ref$docs === void 0 ? '' : _ref$docs;

        if (isEmpty(docs)) {
          return req;
        }

        return {
          IT_SEL_FEILDS: docs.split(',').map(function (doc) {
            return {
              FIELDNAME: 'BANFN',
              LOW: doc,
              OPTION: 'EQ',
              SIGN: 'I',
              TABNAME: 'EBAN'
            };
          }),
          IV_INDIC_FECHA: 'X',
          IV_INDIC_INFMAT: 'X',
          IV_INDIC_ULTP: 'X'
        };
      },

      /**
       * @function
       * @name _resetTableDefatuls
       * @description - Reiniciar valor por defecto de la tabla
       *
       * @private
       * @returns {void} - No retorna nada
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _resetTableDefatuls: function _resetTableDefatuls() {
        var _this = this;

        this._scrollTable = true;

        this._oProcessTable.$().find('.sapUiTableVSb').scrollTop(0);

        setTimeout(function () {
          _this._scrollTable = false;
        }, 100);
      },

      /**
       * @function
       * @name _fetchFirstPage
       * @description - Ir a buscar data al API
       *
       * @private
       * @returns {Promise}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _fetchFirstPage: function _fetchFirstPage() {
        var _this2 = this;

        this._nextKeys = JSON.parse(JSON.stringify(this._keys));
        return this._getNextPage().then(function (_ref2) {
          var data = _ref2.data;
          _this2._oRes = data;

          if (_this2._keys.length === 0) {
            _this2.getOwnerComponent().getModel('store').setProperty('/keys', data.dockeys);

            _this2._keys = data.dockeys;
          }
        });
      },

      /**
       * @function
       * @name _buildData
       * @description - Construir data
       *
       * @private
       * @returns {void} - No retorna nada.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _buildData: function _buildData() {
        var oDataModel = {};
        oDataModel.allCatalog = JSON.parse(JSON.stringify(this._oRes.catalog));
        oDataModel.data = this._buildRows(this._oRes.items);
        oDataModel.dockeys = this._oRes.dockeys;
        oDataModel.total = this._keys.length || oDataModel.data.length;
        oDataModel.returnOption = ''; // set model

        this._oModel = new JSONModel();

        this._oModel.setData(oDataModel);

        this._oModel.setDefaultBindingMode(BindingMode.TwoWay);

        this._oModel.setSizeLimit(1000000);

        this.setModel(this._oModel, 'process');
      },

      /**
       * @function
       * @name _getNextPage
       * @description - Obtener datos(pÃ¡gina) siguientes
       *
       * @private
       * @returns {Promise}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _getNextPage: function _getNextPage() {
        return Promise.resolve(this._getNextKeys()).then(this._buildRequestObjForPaging.bind(this)).then(this._fetchAPI.bind(this));
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
        var _this3 = this;

        return aItems.map(function (item) {
          return _objectSpread(_objectSpread({}, item), {}, {
            status: [states.buildStateOne({
              icon: item.ICON1,
              color: item.COLOR1
            }), states.buildStateSeven({
              icon: item.ICON7
            }), states.buildStateTwo({
              icon: item.ICON2,
              color: item.COLOR2
            }), states.buildStateThree({
              icon: item.ICON3,
              color: item.COLOR3
            }), states.buildStateFour({
              icon: item.ICON4,
              color: item.COLOR4
            }), states.buildStateFive({
              icon: item.ICON5,
              color: item.COLOR5
            }) // states.buildStateSix({ icon: item.ICON6, color: item.COLOR6 }),
            ],
            quantities: _this3._buildInfoQuantities(item.PR_MENGE, item.PR_BSMNG, item.PR_MEINS),
            notification: _this3._setSolPedNotifications(item),
            longText: _this3._getLongTextByItem(item),
            longTextComp: _this3._getLongTextCompByItem(item)
          });
        });
      },

      /**
       * @function
       * @name _getLongTextCompByItem
       * @description - Obtiene las llaves de los siguientes items
       *
       * @private
       * @returns {string} - longText
       *
       * @author Heinner Mayorga <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _getLongTextCompByItem: function _getLongTextCompByItem(item) {
        var longText = '';

        if (item.MAT_TEXT_COMPR) {
          item.MAT_TEXT_COMPR.forEach(function (e) {
            if (e.TDLINE !== null) {
              longText += "".concat(e.TDLINE, " ");
            }
          });
        }

        return longText;
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
        var _this4 = this;

        this._allData = true;
        return this._getNextPage().then(function (_ref3) {
          var _ref3$data = _ref3.data;
          _ref3$data = _ref3$data === void 0 ? {} : _ref3$data;
          var _ref3$data$items = _ref3$data.items,
              items = _ref3$data$items === void 0 ? [] : _ref3$data$items;
          _this4._items = _this4._items.concat(items);
          return _this4._nextKeys.length > 0 ? _this4._getAllData() : Promise.resolve();
        });
      },

      /**
       * @function
       * @name _setSolPedNotifications
       * @description - Setear notificaciÃ³n para SolPed a los items tratados
       *
       * @public
       * @param {Object} item - Objecto actual
       * @returns {Object} - Notificaciones
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _setSolPedNotifications: function _setSolPedNotifications(item) {
        var notifications = this._aSolPedNotifications.concat(this._aPedNotifications);

        var notification; // SolPed

        var predicateSolPed = {
          BANFN: item.BANFN,
          BNFPO: item.BNFPO
        }; // Pedido

        var predicatePed = {
          EBELN: item.EBELN,
          EBELP: item.EBELP
        };
        var object = find(this._aSelectedObjects, predicateSolPed);

        if (!isEmpty(object)) {
          var notificationForPos = filter(notifications, predicateSolPed);

          if (!isEmpty(notificationForPos)) {
            var notificationForSolPed = filter(notifications, _objectSpread(_objectSpread({}, predicateSolPed), {}, {
              BNFPO: 0
            }));

            var _notificationForPos = _slicedToArray(notificationForPos, 1),
                TYPE = _notificationForPos[0].TYPE;

            notification = {
              data: notificationForPos.concat(notificationForSolPed),
              type: TYPE
            };
          }

          var notificationForPosPed = filter(notifications, predicatePed);

          if (!isEmpty(notificationForPosPed)) {
            var _notificationForPosPe = _slicedToArray(notificationForPosPed, 1),
                _TYPE = _notificationForPosPe[0].TYPE;

            notification = {
              data: notificationForPosPed,
              type: _TYPE
            };
          }
        }

        return notification;
        /* this._aSelectedObjects.forEach((object) => {
          const notificationForPos = filter(data, {
            BANFN: object.BANFN,
            BNFPO: object.BNFPO,
          })
           if (!isEmpty(notificationForPos)) {
            const notificationForSolPed = filter(data, {
              BANFN: object.BANFN,
              BNFPO: 0,
            })
            const [{ TYPE }] = notificationForPos
            object.notification = {
              data: notificationForPos.concat(notificationForSolPed),
              type: TYPE,
            }
          }
        }) */
      },

      /**
       * @function
       * @name _buildRequestObjForPaging
       * @description - Crea el objeto de solicitud para pÃ¡ginaciÃ³n
       *
       * @private
       * @param {object[]} nextKeys - Arreglo con las siguientes llaves.
       * @returns {object} - request
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _buildRequestObjForPaging: function _buildRequestObjForPaging() {
        var nextKeys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var oReq = JSON.parse(JSON.stringify(this._oReq));
        oReq.IT_DOCKEYS = nextKeys;
        oReq.IV_ONLYKEYS = '';
        return oReq;
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
        return petitions.post("".concat(constant.GET_PROCESS_SELECTED), req);
      },

      /**
       * @function
       * @name _getNextKeys
       * @description - Obtiene las llaves de los siguientes items
       *
       * @private
       * @returns {object[]} - llaves
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _getNextKeys: function _getNextKeys() {
        var hasNext = this._nextKeys.length >= constant.PURCHASE_TRACKING_PER_PAGE;
        var nextKeys = hasNext ? this._nextKeys.slice(0, constant.PURCHASE_TRACKING_PER_PAGE) : this._nextKeys || [];
        this._nextKeys = hasNext ? this._nextKeys.slice(constant.PURCHASE_TRACKING_PER_PAGE) : [];
        return nextKeys;
      },

      /**
       * @function
       * @name _getLongTextByItem
       * @description - Obtiene las llaves de los siguientes items
       *
       * @private
       * @returns {string} - longText
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _getLongTextByItem: function _getLongTextByItem(item) {
        var longText = '';
        item.MAT_TEXT_LARGO.forEach(function (e) {
          if (e.TDLINE !== null) {
            longText += "".concat(e.TDLINE, " ");
          }
        });
        return longText;
      },

      /**
       * @function
       * @name _buildInfoQuantities
       * @description - Construir datos para la columna Cantidades (GrÃ¡fica)
       *
       * @private
       * @param {number} iMenge PR_MENGE - SolPed
       * @param {number} iBsmng PR_BSMNG - Pedido
       * @param {string} sMeins PR_MEINS - Unidad de medida para todas
       * @returns {object}
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      _buildInfoQuantities: function _buildInfoQuantities(iMenge, iBsmng, sMeins) {
        var oInfoQuantities = {};

        if (iMenge > 0) {
          oInfoQuantities.PR_MENGE = {
            percentValue: '100',
            state: ValueState.Success,
            displayValue: "{main>/textPool/K046} - ".concat(iMenge, " ").concat(sMeins)
          };

          var oInfoBsmng = this._getStateProgress(iBsmng, iMenge);

          oInfoQuantities.PR_BSMNG = {
            percentValue: oInfoBsmng.nPercentage,
            state: oInfoBsmng.sState,
            displayValue: "{main>/textPool/K047} - ".concat(iBsmng, " ").concat(sMeins)
          };
        } else {
          oInfoQuantities.PR_BSMNG = {
            percentValue: 100,
            state: ValueState.Success,
            displayValue: "{main>/textPool/K047} - ".concat(iBsmng, " ").concat(sMeins)
          };
        } // oInfoQuantities.EM = {
        //   percentValue: '20',
        //   state: 'Warning',
        //   displayValue: '20 UN',
        // }
        // oInfoQuantities.FACTURA = {
        //   percentValue: '35',
        //   state: 'Information',
        //   displayValue: '35 UN',
        // }


        return oInfoQuantities;
      },

      /**
       * @function
       * @name _getStateProgress
       * @description - Calcular porcentaje y retornar state
       *
       * @private
       * @param {number} iValue - Valor actual
       * @param {number} iValueMax - Valor mÃ¡ximo
       * @returns {object}
       *
       * @author Juan Orjuela <jorjuela@innovainternacional.biz>
       * @version 0.5.0
       */
      _getStateProgress: function _getStateProgress(iValue, iValueMax) {
        var nPercentage = iValue * 100 / iValueMax;
        var sState = 'Information';

        if (nPercentage === 100) {
          sState = ValueState.Success;
        }

        if (nPercentage < 99 && nPercentage > 49) {
          sState = 'Warning';
        }

        if (nPercentage < 50 && nPercentage > 0) {
          sState = 'Error';
        }

        return {
          sState: sState,
          nPercentage: nPercentage
        };
      },

      /**
       * @function
       * @name formatTitle
       * @description - Dar formato al titulo
       *
       * @public
       * @param {string} text - Text pattern
       * @param {object[]} data - Datos de la tabla
       * @param {object[]} args - Otros argumentos
       * @returns {string}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      formatTitle: function formatTitle(text, data) {
        for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }

        return formatMessage.apply(void 0, [text, data.length].concat(args));
      },

      /**
       * @function
       * @name onScrollHandler
       * @description - Maneja el cambio en el scroll de la tabla para paginar.
       *
       * @public
       * @returns {void}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      onScrollHandler: function onScrollHandler() {
        var _this5 = this;

        if (this._hasMorePages()) {
          this._scrollTable = true;

          this._getNextPage().then(function (_ref4) {
            var _ref4$data = _ref4.data;
            _ref4$data = _ref4$data === void 0 ? {} : _ref4$data;
            var _ref4$data$items = _ref4$data.items,
                items = _ref4$data$items === void 0 ? [] : _ref4$data$items;

            _this5._setNewData(items);
          }).catch(this.errorHandler.bind(this)).finally(function () {
            _this5._scrollTable = false;
          });
        }
      },

      /**
       * @function
       * @name _setNewData
       * @description - Obtener todos los datos
       *
       * @private
       * @param {object[]} items - Nuevos items
       * @returns {void}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _setNewData: function _setNewData(items) {
        var data = this._buildRows(items);

        var currentData = this._oModel.getProperty('/data');

        this._oModel.setProperty('/data', currentData.concat(data));
      },

      /**
       * @function
       * @name _hasMorePages
       * @description - Valida si hay mÃ¡s pÃ¡ginas
       *
       * @private
       * @returns {boolean}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      _hasMorePages: function _hasMorePages() {
        return !isEmpty(this._nextKeys) && !this._scrollTable && !this._isExcel && !this._allData;
      }
    })
  );
});