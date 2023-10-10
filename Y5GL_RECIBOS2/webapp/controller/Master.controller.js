sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel", "sap/ui/core/routing/History", "sap/ui/model/Filter",
	"sap/ui/model/Sorter", "sap/ui/model/FilterOperator", "sap/m/GroupHeaderListItem", "sap/ui/Device", "sap/ui/core/Fragment",
	"../model/formatter"
], function (e, t, i, a, r, s, n, o, l, c) {
	"use strict";
	return e.extend("Y5GL_RECIBOS2.Y5GL_RECIBOS2.controller.Master", {
		formatter: c,
		onInit: function () {
			var e = this.byId("list"),
				t = this._createViewModel(),
				i = e.getBusyIndicatorDelay();
			this._oList = e;
			this._oListFilterState = {
				aFilter: [],
				aSearch: []
			};
			this.setModel(t, "masterView");
			e.attachEventOnce("updateFinished", function () {
				t.setProperty("/delay", i)
			});
			this.getView().addEventDelegate({
				onBeforeFirstShow: function () {}.bind(this)
			});
			this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
			this.getRouter().attachBypassed(this.onBypassed, this);
			var a = sap.ushell.Container.getUser().getFullName();
			this.getView().byId("idTitleText").setText(a)
		},
		onUpdateFinished: function (e) {
			this._updateListItemCount(e.getParameter("total"))
		},
		onSearch: function (e) {
			if (e.getParameters().refreshButtonPressed) {
				this.onRefresh();
				return
			}
			var t = e.getParameter("query");
			if (t) {
				this._oListFilterState.aSearch = [new a("Zdesc", s.Contains, t)]
			} else {
				this._oListFilterState.aSearch = []
			}
			this._applyFilterSearch()
		},
		onRefresh: function () {
			this._oList.getBinding("items").refresh()
		},
		onOpenViewSettings: function (e) {
			var t = "filter";
			if (e.getSource() instanceof sap.m.Button) {
				var i = e.getSource().getId();
				if (i.match("sort")) {
					t = "sort"
				} else if (i.match("group")) {
					t = "group"
				}
			}
			if (!this.byId("viewSettingsDialog")) {
				l.load({
					id: this.getView().getId(),
					name: "Y5GL_RECIBOS2.Y5GL_RECIBOS2.view.ViewSettingsDialog",
					controller: this
				}).then(function (e) {
					this.getView().addDependent(e);
					e.addStyleClass(this.getOwnerComponent().getContentDensityClass());
					e.open(t)
				}.bind(this))
			} else {
				this.byId("viewSettingsDialog").open(t)
			}
		},
		onConfirmViewSettingsDialog: function (e) {
			this._applySortGroup(e)
		},
		_applySortGroup: function (e) {
			var t = e.getParameters(),
				i, a, s = [];
			i = t.sortItem.getKey();
			a = t.sortDescending;
			s.push(new r(i, a));
			this._oList.getBinding("items").sort(s)
		},
		onSelectionChange: function (e) {
			var t = e.getSource(),
				i = e.getParameter("selected");
			if (!(t.getMode() === "MultiSelect" && !i)) {
				this._showDetail(e.getParameter("listItem") || e.getSource())
			}
		},
		onBypassed: function () {
			this._oList.removeSelections(true)
		},
		createGroupHeader: function (e) {
			return new n({
				title: e.text,
				upperCase: false
			})
		},
		onNavBack: function () {
			var e = i.getInstance().getPreviousHash(),
				t = sap.ushell.Container.getService("CrossApplicationNavigation");
			if (e !== undefined || !t.isInitialNavigation()) {
				history.go(-1)
			} else {
				t.toExternal({
					target: {
						shellHash: "#Shell-home"
					}
				})
			}
		},
		_createViewModel: function () {
			return new t({
				isFilterBarVisible: false,
				filterBarLabel: "",
				delay: 0,
				title: this.getResourceBundle().getText("masterTitleCount", [0]),
				noDataText: this.getResourceBundle().getText("masterListNoDataText"),
				sortBy: "Zdesc",
				groupBy: "None"
			})
		},
		_onMasterMatched: function () {
			this.getModel("appView").setProperty("/layout", "OneColumn")
		},
		_showDetail: function (e) {
			var t = !o.system.phone;
			var i = e.getBindingContext().getProperty("Zparam");
			var a = e.getBindingContext().getProperty("Zdesc");
			while (a.indexOf("/") != -1) {
				a = a.replace("/", "_")
			}
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getRouter().navTo("object", {
				Zparam: i,
				Zdesc: a
			}, t)
		},
		_updateListItemCount: function (e) {
			var t;
			if (this._oList.getBinding("items").isLengthFinal()) {
				t = this.getResourceBundle().getText("masterTitleCount", [e]);
				this.getModel("masterView").setProperty("/title", t)
			}
		},
		_applyFilterSearch: function () {
			var e = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
				t = this.getModel("masterView");
			this._oList.getBinding("items").filter(e, "Application");
			if (e.length !== 0) {
				t.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"))
			} else if (this._oListFilterState.aSearch.length > 0) {
				t.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataText"))
			}
		},
		formatterIcon: function (e) {
			switch (e) {
			case "ADIANTAMENTO QUINZENAL":
				return "sap-icon://lead";
				break;
			case "FÉRIAS":
				return "sap-icon://travel-expense";
				break;
			case "INFORME DE RENDIMENTOS":
				return "sap-icon://payment-approval";
				break;
			case "PAGAMENTO MENSAL":
				return "sap-icon://monitor-payments";
				break;
			case "13º SALÁRIO":
				return "sap-icon://money-bills";
				break;
			case "PPR/RV":
				return "sap-icon://simple-payment";
				break;
			case "PRV":
				return "sap-icon://batch-payments";
				break
			}
		},
		_updateFilterBar: function (e) {
			var t = this.getModel("masterView");
			t.setProperty("/isFilterBarVisible", this._oListFilterState.aFilter.length > 0);
			t.setProperty("/filterBarLabel", this.getResourceBundle().getText("masterFilterBarText", [e]))
		}
	})
});