sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/format/DateFormat"
], function (Controller, JSONModel, Filter, FilterOperator, DateFormat) {
	"use strict";

	return Controller.extend("portal.y5fb_dashlog.controller.Default", {

		onInit: function () {
			var that = this;
			var oModel = this.getOwnerComponent().getModel();

			var sServiceUrl1 = "/sap/opu/odata/sap/ZGWFBBC_DASH_LOG_SRV_SRV/";
			oModel = new sap.ui.model.odata.ODataModel(sServiceUrl1, true);
			oModel.read("/Logs", {
				success: function (oData) {
					if (oData.results.length) {
						if (oData.results) {
							var oModelLog = new sap.ui.model.json.JSONModel(oData.results);
							oModelLog.setData({
								length: oData.results.length,
								rows: oModelLog.oData
							});
							that.getView().setModel(oModelLog, "ViewLog");

						}
					}
				}
			});
			var oModel1 = this.getOwnerComponent().getModel();
			oModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl1, true);

			oModel1.read("/kpis", {
				success: function (oData) {
					if (oData.results.length) {
						if (oData.results) {

							var vtotal = 0;
							for (var a = 0; a < oData.results.length; a++) {

								vtotal = vtotal + Number(oData.results[a].Total);

							}
							var oKpiTotal = new sap.ui.model.json.JSONModel(oData.results);
							oKpiTotal.setData({
								length: oData.results.length,
								total: vtotal
							});
							that.getView().setModel(oKpiTotal, "KpiTotal");

							for (var w = 0; w < oData.results.length; w++) {
								vtotal = (vtotal + oData.results[w].Qtd);
								//that.getView().setModel(oData.results[w], oData.results[w].Tipodoc);
								var oKpiTotal1 = new sap.ui.model.json.JSONModel(oData.results[w]);
								that.getView().setModel(oKpiTotal1, oData.results[w].Tipodoc);
							}

						}
					}
				}
			});

			var oModel2 = this.getOwnerComponent().getModel();
			oModel2 = new sap.ui.model.odata.ODataModel(sServiceUrl1, true);

			oModel2.read("/KpiStatisticSet", {
				success: function (oData) {
					if (oData.results.length) {
						if (oData.results) {
							var oKpiTotal = new sap.ui.model.json.JSONModel(oData.results);
							oKpiTotal.setData({
								length: oData.results[0].UserTotal
							});
							that.getView().setModel(oKpiTotal, "KpiStatistic");

						}
					}
				}
			});
		},

		onPush: function (oEvent) {
			var index = oEvent.getSource().getParent().getIndex();
			var oTable = this.byId("table");
			var rowContext = oTable.getContextByIndex(index);
			var oUserlib = rowContext.getProperty('Userlib');
			var oTipodoc = rowContext.getProperty('Tipodoc');
			var oTimestamp = rowContext.getProperty('Timestamp');
			var oQtd = rowContext.getProperty('Qtd');
			var oFirstdate = rowContext.getProperty('Firstdate');
			var oAction = rowContext.getProperty('DescAction');
			var n = oAction.substring(0, 1);

			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: 'yyyy-MM-ddTHH:mm:ss',
				strictParsing: true,
				UTC: true
			});
			var dateFormatted = dateFormat.format(oTimestamp);

			var dateFormat1 = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: 'yyyy-MM-ddTHH:mm:ss',
				strictParsing: true,
				UTC: true
			});
			var dateFormatted1 = dateFormat1.format(oFirstdate);
			var state = oEvent.getParameter("state");
			//	var oModelD = this.getView().getModel("ViewLog");
			var oEntry = {
				Push: state
			};

			var sServiceUrl1 = "/sap/opu/odata/sap/ZGWFBBC_DASH_LOG_SRV_SRV/";
			var oModelD = new sap.ui.model.odata.ODataModel(sServiceUrl1);
			oModelD.update(
				"/Logs(Userlib='" + oUserlib + "',Tipodoc='" + oTipodoc + "',Timestamp=datetime'" + dateFormatted +
				"',Qtd='" + oQtd + "',Firstdate=datetime'" + dateFormatted1 + "',Action='" + n + "')",
				oEntry, null,
				function () {

				},
				function () {

				});

		},
		_filter: function () {
			var oFilter = null;

			if (this._oGlobalFilter && this._oPriceFilter) {
				oFilter = new sap.ui.model.Filter([this._oGlobalFilter, this._oPriceFilter], true);
			} else if (this._oGlobalFilter) {
				oFilter = this._oGlobalFilter;
			} else if (this._oPriceFilter) {
				oFilter = this._oPriceFilter;
			}

			this.byId("table").getBinding("rows").filter(oFilter, "Application");
		},
		filterGlobally: function (oEvent) {
			var sQuery = oEvent.getParameter("query");
			this._oGlobalFilter = null;

			if (sQuery) {
				this._oGlobalFilter = new Filter([
					new Filter("Userlib", FilterOperator.Contains, sQuery),
					new Filter("Category", FilterOperator.Contains, sQuery)
				], false);
			}

			this._filter();
		},
		clearAllFilters: function (oEvent) {
			//	this._onRefresh();
			var oTable = this.byId("table");
			var oModel = oTable.getModel("ViewLog");

			var oUiModel = this.getView().getModel("ViewLog");
			oUiModel.setProperty("/globalFilter", "");
			//	oUiModel.setProperty("/availabilityFilterOn", false);

			this._oGlobalFilter = null;
			this._oPriceFilter = null;
			this._filter();

			var aColumns = oTable.getColumns();
			for (var i = 0; i < aColumns.length; i++) {
				oTable.filter(aColumns[i], null);

				//debugger;

			}

			oTable.setEnableGrouping(false);
			oTable.getColumns()[0].setGrouped(false);

			var oListBinding = oTable.getBinding();
			oListBinding.aSorters = null;
			oListBinding.aFilters = null;
			oTable.getModel("ViewLog").refresh(true);
			//after reset, set the enableGrouping back to true
			//	debugger;
			//	oTable.setEnableGrouping(true);
			oTable.getModel("ViewLog").refresh(true);
			//	
			//			oTable.sort(oTable.getColumns()[0]);
			//			oTable.sort(oTable.getColumns()[1]);

		},
		onDownload: function (oEvent) {
			var sUrl = "/sap/opu/odata/sap/ZGWFBBC_DASH_LOG_SRV_SRV/Logs?$format=xlsx";
			var encodeUrl = encodeURI(sUrl);
			sap.m.URLHelper.redirect(encodeUrl, true);
			var oTable = this.byId("table");
			oTable.getModel("ViewLog").refresh(true);
		},
		_onRefresh: function () {
			var that = this;
			var oModel = this.getOwnerComponent().getModel();
			var sServiceUrl1 = "/sap/opu/odata/sap/ZGWFBBC_DASH_LOG_SRV_SRV/";
			oModel = new sap.ui.model.odata.ODataModel(sServiceUrl1, true);
			oModel.read("/Logs", {
				success: function (oData) {
					if (oData.results.length) {
						if (oData.results) {
							var oModelLog = new sap.ui.model.json.JSONModel(oData.results);
							oModelLog.setData({
								length: oData.results.length,
								rows: oModelLog.oData
							});
							that.getView().setModel(oModelLog, "ViewLog");
						}
					}
				}
			});
		}
	});
});