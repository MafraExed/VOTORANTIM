sap.ui.define(["Y5GL_REC_FERI/Y5GL_REC_FERI/controller/BaseController", "sap/ui/model/json/JSONModel", "sap/ui/core/routing/History",
	"sap/ui/model/Filter", "sap/ui/model/Sorter", "sap/ui/model/FilterOperator", "sap/m/GroupHeaderListItem", "sap/ui/Device",
	"Y5GL_REC_FERI/Y5GL_REC_FERI/model/formatter"
], function (e, t, o, i, r, s, a, n, l) {
	"use strict";
	return e.extend("Y5GL_REC_FERI.Y5GL_REC_FERI.controller.Master", {
		formatter: l,
		onInit: function () {
			var e = this.byId("list"),
				t = this._createViewModel(),
				o = e.getBusyIndicatorDelay();
			this._oList = e;
			this._oListFilterState = {
				aFilter: [],
				aSearch: []
			};
			this.setModel(t, "masterView");
			e.attachEventOnce("updateFinished", function () {
				t.setProperty("/delay", o);
			});
			this.getView().addEventDelegate({
				onBeforeFirstShow: function () {
					this.getOwnerComponent().oListSelector.setBoundMasterList(e);
				}.bind(this)
			});
			this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
			this.getRouter().attachBypassed(this.onBypassed, this);
		},
		onSelectionChange: function (e) {
			var t = e.getSource(),
				o = e.getParameter("selected");
			if (!(t.getMode() === "MultiSelect" && !o)) {
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
		_onMasterMatched: function () {
			this.getModel("appView").setProperty("/layout", "OneColumn");
		},
		_showDetail: function (e) {
			var t = !n.system.phone;
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getRouter().navTo("object", {
				Index: e.getBindingContext().getProperty("Index"),
				Pernr: e.getBindingContext().getProperty("Pernr"),
				Endda: e.getBindingContext().getProperty("Endda"),
				Begda: e.getBindingContext().getProperty("Begda")
			}, t);
		},
		onAdd: function () {
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getRouter().navTo("Add");
		}
	});
});