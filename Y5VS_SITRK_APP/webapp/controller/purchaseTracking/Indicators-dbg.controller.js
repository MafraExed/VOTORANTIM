"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

sap.ui.define(['./Base', 'sap/ui/model/json/JSONModel', 'com/innova/vendor/chart.js', 'sap/ui/core/HTML', 'sap/m/DialogType', 'sap/m/Dialog', 'sap/m/Button', 'sap/m/DatePicker', 'sap/m/ButtonType', 'sap/m/MessageToast', 'sap/ui/model/BindingMode', 'com/innova/factory/purchaseTracking/process', 'com/innova/lib/layout/layout', 'com/innova/formatter/columnTitleProcess', 'sap/ui/model/FilterOperator', 'sap/ui/model/Filter', 'com/innova/util/isEmpty', 'com/innova/model/formatter'],
/**
 * Module dependencies
 *
 * @param {typeof sap.ui.core.ValueState} ValueState
 * @param {typeof sap.ui.core.Fragment} Fragment
 * @param {typeof sap.ui.model.BindingMode} BindingMode
 * @param {typeof sap.ui.model.Filter} Filter
 * @param {typeof sap.ui.model.FilterOperator} FilterOperator
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel
 */
function (BaseController, JSONModel, Chart, HTML, DialogType, Dialog, Button, DatePicker, ButtonType, MessageToast, BindingMode, process, layout, columnTitleProcess, FilterOperator, Filter, isEmpty, formatterLib) {
  return BaseController.extend('com.innova.sitrack.controller.purchaseTracking.Indicators', {
    layout: layout,
    process: process,
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
     * @description - Se ejecuta cuando se inicia la aplicaciÃ³n
     *
     * @private
     * @returns {void} - No retorna nada.
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    onInit: function onInit() {
      this._initialState();

      this._myChart = null;
      this._oPage = this.byId('page');
      this._oProcessTable = this.byId('indicatorsTable');
      this._oPorcentDayRetar = this.byId('oIPorcentDayRetar');
      this._oRouter = this.getRouter();

      this._oRouter.getRoute('purchaseTrackingIndicators').attachMatched(this._onRouteMatched, this);
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
    _getInitialData: function _getInitialData() {
      return Promise.resolve(this._resetTableDefatuls()).then(this._fetchFirstPage.bind(this)).then(this._buildData.bind(this)).then(this._buildCatalogIndicators.bind(this));
    },

    /**
     * @function
     * @name _buildNewCatalog
     * @description - Crear objeto request para el layout
     *
     * @private
     * @returns {void} - No retorna nada
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _buildCatalogIndicators: function _buildCatalogIndicators() {
      var newCatalogIndicators = [];
      var indicatorsField = {};
      var initialCatalog = this._oRes.catalog;
      initialCatalog.forEach(function (element) {
        var fieldName = element.FIELDNAME;
        var textFieldName = element.SCRTEXT_L;
        indicatorsField = _objectSpread(_objectSpread({}, indicatorsField), {}, _defineProperty({}, fieldName, textFieldName));
      });
      newCatalogIndicators.push(indicatorsField);

      this._oModel.setProperty('/catalog', this._oRes.catalog);

      this._oModel.setProperty('/indicatorsFields', indicatorsField);

      this._oModel.setProperty('/indicators', this._oRes.indicators[0]);
    },

    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

    /* =========================================================== */

    /* begin: event handlers                                       */

    /* =========================================================== */

    /**
     * @function
     * @name onPressIndicatorsButton
     * @description - Muestra el chart grafico del reporte
     *
     * @private
     * @returns {void} - No retorna nada.
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    onPressIndicatorsButton: function onPressIndicatorsButton() {
      if (this._myChart) {
        this._myChart.destroy();
      }

      if (!this.oApproveDialog) {
        var htmlString = "<canvas id='myChart' width='1000' height='500'></canvas>";
        this.oApproveDialog = new Dialog({
          type: DialogType.Message,
          title: '{main>/textPool/K170}',
          content: [new HTML({
            content: htmlString
          })],
          beginButton: new Button({
            type: ButtonType.Emphasized,
            text: 'Aceptar',
            press: function press() {
              this.oApproveDialog.close();
            }
          })
        });
      }

      this.oApproveDialog.open();
      var labelsGraph = [];
      var dataGraph = [];
      var ctx = document.getElementById('myChart');

      this._oRes.graph.forEach(function (element) {
        labelsGraph.push(element.MESEJER);
        dataGraph.push(element.POH_INPOATRAS);
      });

      this._myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labelsGraph,
          datasets: [{
            label: this.getMessageTextPool('K205'),
            data: dataGraph,
            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    },

    /**
     * @function
     * @name _resetSortingState
     * @description - Restablece el ordenamiento de las columnas
     *
     * @private
     * @returns {void}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    _resetSortingState: function _resetSortingState() {
      var aColumns = this._oProcessTable.getColumns();

      aColumns.forEach(function (element) {
        element.setSorted(false);
      });
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
     * @name onResetOrder
     * @description -Restaura el ordenamiento de la tabla
     *
     * @public
     * @returns {void}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    onResetOrder: function onResetOrder() {
      try {
        this._oPage.setBusy(true);

        this._oProcessTable.getBinding().sort(null);

        this._resetSortingState();
      } catch (error) {
        this.errorHandler(error);
      } finally {
        this._oPage.setBusy(false);
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
      var _this = this;

      oEvent.preventDefault();
      var column = oEvent.getParameter('column');
      var value = oEvent.getParameter('value');
      var isEmptyValue = isEmpty(value);
      var filters = isEmptyValue ? [] : [new Filter(column.getName(), FilterOperator.Contains, "".concat(value))];
      var promise = Promise.resolve(this._oPage.setBusy(true));

      if (this._hasMorePages()) {
        promise = this._getAllData().then(function () {
          _this._setNewData(_this._items);
        });
      }

      promise.then(this._setFilterByColumn.bind(this, {
        column: column,
        filters: filters,
        isEmptyValue: isEmptyValue
      })).catch(this.errorHandler.bind(this)).then(this._oPage.setBusy.bind(this._oPage, false));
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
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _setFilterByColumn: function _setFilterByColumn(_ref) {
      var column = _ref.column,
          filters = _ref.filters,
          isEmptyValue = _ref.isEmptyValue;
      this.byId('indicatorsTable').getBinding('rows').filter(filters);
      column.setFiltered(!isEmptyValue);

      if (this._oFilteredPreviousColumn && this._oFilteredPreviousColumn !== column) {
        this._oFilteredPreviousColumn.setFilterValue('');

        this._oFilteredPreviousColumn.setFiltered(false);
      }

      this._oFilteredPreviousColumn = column;
    }
    /* =========================================================== */

    /* finish: event handlers                                      */

    /* =========================================================== */

  });
});