/*global history */
sap.ui.define([
	"ZPUI_BCMM_COND/ZPUI_BCMM_COND/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"ZPUI_BCMM_COND/ZPUI_BCMM_COND/model/formatter",
	"ZPUI_BCMM_COND/ZPUI_BCMM_COND/model/grouper",
	"ZPUI_BCMM_COND/ZPUI_BCMM_COND/model/GroupSortState"
], function (BaseController, JSONModel, History, Filter, FilterOperator, GroupHeaderListItem, Device, formatter, grouper,
	GroupSortState) {
	"use strict";

	return BaseController.extend("ZPUI_BCMM_COND.ZPUI_BCMM_COND.controller.Master", {

		formatter: formatter,

		onInit: function () {
			// Control state model
			var oList = this.byId("list"),

				oViewModel = this._createViewModel(),
				iOriginalBusyDelay = oList.getBusyIndicatorDelay();

			this._oList = oList;
			// keeps the filter and search state
			this._oListFilterState = {
				aFilter: [],
				aSearch: []
			};

			this.setModel(oViewModel, "masterView");

			oList.attachEventOnce("updateFinished", function () {
				// Restore original busy indicator delay for the list
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});

			this.getView().addEventDelegate({
				onBeforeFirstShow: function () {
					this.getOwnerComponent().oListSelector.setBoundMasterList(oList);
				}.bind(this)
			});
			this.getRouter().getRoute("masterRefresh").attachPatternMatched(this.Atualiza, this);
			this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
			this.getRouter().attachBypassed(this.onBypassed, this);

		},

		onUpdateFinished: function (oEvent) {
			// update the master list object counter after new data is loaded
			this._updateListItemCount(oEvent.getParameter("total"));
			// hide pull to refresh if necessary
			this.byId("pullToRefresh").hide();

		},

		onSearch: function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				this.onRefresh();
				return;
			}

			var sQuery = oEvent.getParameter("query");
			sQuery = parseInt(sQuery);

			var filtro1 = new Filter("IdSolicitacao", FilterOperator.EQ, sQuery);
			var filtro2 = new Filter("Status", FilterOperator.EQ, "CNDC");
			if (!isNaN(sQuery)) {
				this._oListFilterState.aSearch = [filtro1, filtro2];
			} else {
				this._oListFilterState.aSearch = [filtro2];
			}

			this._applyFilterSearch();

		},

		_applyFilterSearch: function () {
			var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
				oViewModel = this.getModel("masterView");
			this._oList.getBinding("items").filter(aFilters, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aFilters.length !== 0) {
				oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"));
			} else if (this._oListFilterState.aSearch.length > 0) {
				// only reset the no data text to default when no new search was triggered
				oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataText"));
			}
		},

		onPress2: function () {
			if (this.getView().getParent().getParent().getMode("HideMode") === true) {
				this.getView().getParent().getParent().setMode("ShowHideMode");
			} else {
				this.getView().getParent().getParent().setMode("HideMode");
			}

			// var oSplitContainer = this.getView().byId("idAppControl");
			// oSplitContainer.setMode(sap.m.SplitAppMode.StretchCompressMode);
			// if (oSplitContainer.isMasterShown()) {
			// 	oSplitContainer.setMode(sap.m.SplitAppMode.HideMode);
			// }
		},

		onRefresh: function () {
			this._oList.getBinding("items").refresh();
		},

		onSelectionChange: function (oEvent) {
			// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
			this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());

		},

		onBypassed: function () {
			this._oList.removeSelections(true);
		},

		createGroupHeader: function (oGroup) {
			return new GroupHeaderListItem({
				title: oGroup.text,
				upperCase: false
			});
		},

		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash(),
				oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
				history.go(-1);
			} else {
				oCrossAppNavigator.toExternal({
					target: {
						shellHash: "#Shell-home"
					}
				});
			}
		},

		_createViewModel: function () {
			return new JSONModel({
				isFilterBarVisible: false,
				filterBarLabel: "",
				delay: 0,
				title: this.getResourceBundle().getText("masterTitleCount", [0]),
				noDataText: this.getResourceBundle().getText("masterListNoDataText"),
				sortBy: "IdSolicitacao",
				groupBy: "None"
			});
		},

		_onMasterMatched: function () {
			this.getOwnerComponent().oListSelector.oWhenListLoadingIsDone.then(
				function (mParams) {
					if (mParams.list.getMode() === "None") {
						return;
					}
					var IdSolicitacao = mParams.firstListitem.getBindingContext().getProperty("IdSolicitacao");
					var Bukrs = mParams.firstListitem.getBindingContext().getProperty("Bukrs");
					var WerksO = mParams.firstListitem.getBindingContext().getProperty("WerksO");

					this.getRouter().navTo("object", {
						Bukrs: Bukrs,
						IdSolicitacao: IdSolicitacao,
						WerksO: WerksO
					}, true);
				}.bind(this),
				function (mParams) {
					if (mParams.error) {
						return;
					}
					this.getRouter().getTargets().display("detailNoObjectsAvailable");
				}.bind(this)
			);

		},

		_showDetail: function (oItem) {
			var bReplace = !Device.system.phone;
			var Bukrs = oItem.getBindingContext().getProperty("Bukrs");
			var IdSolicitacao = oItem.getBindingContext().getProperty("IdSolicitacao");
			var WerksO = oItem.getBindingContext().getProperty("WerksO");

			this.getRouter().navTo("object", {
				Bukrs: Bukrs,
				IdSolicitacao: IdSolicitacao,
				WerksO: WerksO

			}, bReplace);
		},

		_updateListItemCount: function (iTotalItems) {
			var sTitle;
			// only update the counter if the length is final
			if (this._oList.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("masterTitleCount", [iTotalItems]);
				this.getModel("masterView").setProperty("/title", sTitle);
			}
		},

		FilterSearch: function () {
			var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
				oViewModel = this.getModel("masterView");
			this._oList.getBinding("items").filter(aFilters, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aFilters.length !== 0) {
				oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"));
			} else if (this._oListFilterState.aSearch.length > 0) {
				// only reset the no data text to default when no new search was triggered
				oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataText"));
			}
		},

		_applyGroupSort: function (aSorters) {
			this._oList.getBinding("items").sort(aSorters);
		},

		_updateFilterBar: function (sFilterBarText) {
			var oViewModel = this.getModel("masterView");
			oViewModel.setProperty("/isFilterBarVisible", (this._oListFilterState.aFilter.length > 0));
			oViewModel.setProperty("/filterBarLabel", this.getResourceBundle().getText("masterFilterBarText", [sFilterBarText]));
		},

		Atualiza: function (oEvent) {
			var oList = this.getView().byId("list");
			var chave = oList.getBinding("items").aKeys[0];
			if (chave !== undefined) {
				var bukrs = chave.substring(28, 32);
				var werks = chave.substring(42, 46);
				var idsolicitacao = chave.substring(62, 64);
				idsolicitacao = parseInt(idsolicitacao);

				this.getRouter().navTo("object", {
					Bukrs: bukrs,
					IdSolicitacao: idsolicitacao,
					WerksO: werks
				});
			} else {
				this.getRouter().getTargets().display("detailNoObjectsAvailable");
			}
		}
	});

});