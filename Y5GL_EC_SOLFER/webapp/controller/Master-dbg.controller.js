sap.ui.define(["Y5GL_EC_SOLFER/Y5GL_EC_SOLFER/controller/BaseController", "sap/ui/model/json/JSONModel", "sap/ui/core/routing/History",
	"sap/ui/model/Filter", "sap/ui/model/Sorter", "sap/ui/model/FilterOperator", "sap/m/GroupHeaderListItem", "sap/ui/Device",
	"Y5GL_EC_SOLFER/Y5GL_EC_SOLFER/model/formatter"
], function (e, t, r, o, i, n, a, s, d) {
	"use strict";
	return e.extend("Y5GL_EC_SOLFER.Y5GL_EC_SOLFER.controller.Master", {
		formatter: d,
		
		onInit: function () {
			var e = this.byId("list"),
				t = this._createViewModel(),
				r = e.getBusyIndicatorDelay();
			this._oList = e;
			this._oListFilterState = {
				aFilter: [],
				aSearch: []
			};
			this.setModel(t, "masterView");
			e.attachEventOnce("updateFinished", function () {
				t.setProperty("/delay", r);
			});
			this.getView().addEventDelegate({
				onBeforeFirstShow: function () {}.bind(this)
			});
			this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
			this.getRouter().attachBypassed(this.onBypassed, this);
		},
		
		onSelectionChange: function (e) {
			var t = e.getSource(),
				r = e.getParameter("selected");
			if (!(t.getMode() === "MultiSelect" && !r)) {
				this._showDetail(e.getParameter("listItem") || e.getSource());
			}
		},
		
		_createViewModel: function () {
			return new t({
				isFilterBarVisible: false,
				filterBarLabel: "",
				delay: 0,
				title: this.getResourceBundle().getText("masterTitleCount", [0]),
				noDataText: this.getResourceBundle().getText("masterListNoDataText"),
				sortBy: "Pernr",
				groupBy: "None"
			});
		},
		
		_onMasterMatched: function (e) {
			this.getModel("appView").setProperty("/layout", "OneColumn");
			var t = e.getParameter("arguments").Pernr;
		},
		
		_showDetail: function (e) {
			var bukrs = e.getBindingContext().getProperty("Bukrs");
			this.setEmpresa(bukrs);
			
			var t = !s.system.phone;
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getRouter().navTo("object", {
				Index: e.getBindingContext().getProperty("Index"),
				Pernr: e.getBindingContext().getProperty("Pernr"),
				Endda: e.getBindingContext().getProperty("Endda"),
				Begda: e.getBindingContext().getProperty("Begda")
			}, t);
		},
		
		FormatStatus: function (e) {
			if (e === "Disponível") {
				return "Success";
			}
			if (e === "Em Programação") {
				return "Warning";
			}
			if (e === "Homologado") {
				return "Success";
			}
			if (e === "Em Aberto") {
				return "Error";
			}
			if (e === "Em aprovação") {
				return "Warning";
			} else {
				return "Success";
			}
		},
		
		onAdd: function () {
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getRouter().navTo("Add");
		},

		formatterIcon: function (e) {
			var sRootPath = jQuery.sap.getModulePath("Y5GL_EC_SOLFER.Y5GL_EC_SOLFER");
			var sImagePath = sRootPath + "/Icones/";
			var icone;
			icone = sImagePath + "FERIAS.png";
			return icone;
		}
	})
});