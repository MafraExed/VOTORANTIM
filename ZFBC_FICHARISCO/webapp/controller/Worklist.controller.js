sap.ui.define([
		"fibria/com/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"fibria/com/model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		'sap/ui/model/Sorter'
	], function (BaseController, JSONModel, History, formatter, Filter, FilterOperator, Sorter) {
		"use strict";

		return BaseController.extend("fibria.com.controller.Worklist", {
			formatter: formatter,

		    onPrintWorklist: function(oEvent) {
				// var isFirefox = typeof InstallTrigger !== 'undefined';
				// var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
				// var isIE = false || !!document.documentMode;
				// var isEdge = !isIE && !!window.StyleMedia;
				// var isChrome = !!window.chrome && !!window.chrome.webstore;
				
				var oTarget = this.getView().byId(oEvent.getSource().data("targetId"));
				var $domTarget = oTarget.$()[0];
				var sTargetContent = $domTarget.innerHTML;
				var sOriginalContent = document.body.innerHTML;

				// var oRenderer = sap.ushell.Container.getRenderer("fiori2");
				// oRenderer.setHeaderVisibility(false, false, ["home", "app"]);
				
				this.getView().byId("table").oParent.getContent()[0].$().print({
					globalStyles: true,
					mediaPrint: false,
					stylesheet: null,
					noPrintSelector: ".no-print",
					iframe: true,
					append: null,
					prepend: null,
					manuallyCopyFormValues: true,
					deferred: $.Deferred(),
					timeout: 800,
					title: null,
					//doctype: this.getView().byId("table").oParent.getContent()[0].$().html()
					//doctype: this.getView().byId("pageWorklist").oParent._$oldContent.context.documentElement.innerHTML
					doctype: '<!doctype html>'
				});
				
				// oRenderer.setHeaderVisibility(true, true, ["home", "app"]);	
		    },
		
			onInit : function () {
				var oViewModel,
					iOriginalBusyDelay,
					oTable = this.byId("table");

				iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
				this._oTable = oTable;
				this._oTableSearchState = [];

				oViewModel = new JSONModel({
					worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
					saveAsTileTitle: this.getResourceBundle().getText("saveAsTileTitle", this.getResourceBundle().getText("worklistViewTitle")),
					shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
					shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
					shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
					tableNoDataText : this.getResourceBundle().getText("tableNoDataText"),
					tableBusyDelay : 0
				});
				this.setModel(oViewModel, "worklistView");

				oTable.attachEventOnce("updateFinished", function(){
					oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
				});
			},

			onUpdateFinished : function (oEvent) {
				var sTitle,
					oTable = oEvent.getSource(),
					iTotalItems = oEvent.getParameter("total");
				if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
					sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
				} else {
					sTitle = this.getResourceBundle().getText("worklistTableTitle");
				}
				this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
			},

			onPress : function (oEvent) {
				this._showObject(oEvent.getSource());
			},

			onShareInJamPress : function () {
				var oViewModel = this.getModel("worklistView"),
					oShareDialog = sap.ui.getCore().createComponent({
						name: "sap.collaboration.components.fiori.sharing.dialog",
						settings: {
							object:{
								id: location.href,
								share: oViewModel.getProperty("/shareOnJamTitle")
							}
						}
					});
				oShareDialog.open();
			},

			onSearch : function (oEvent) {
				if (oEvent.getParameters().refreshButtonPressed) {
					this.onRefresh();
				} else {
					var oTableSearchState = [];
					var sQuery = oEvent.getParameter("query");

					if (sQuery && sQuery.length > 0) {
						oTableSearchState = [
							new Filter("Stext", FilterOperator.Contains, sQuery, true),
							new Filter("RiskCategoryTxt", FilterOperator.Contains, sQuery, true),
							new Filter("OrgunitTxt", FilterOperator.Contains, sQuery, true),
							new Filter("RiskLabel", FilterOperator.Contains, sQuery, true)
						];
					}
					this._applySearch(oTableSearchState);
				}
			},
			
			_applySearch: function(oTableSearchState) {
				var oViewModel = this.getModel("worklistView");
				this._oTable.getBinding("items").filter(oTableSearchState, "Application");
				if (oTableSearchState.length !== 0) {
					oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
				}
			},
			
			handleViewSettingsDialogButtonPressed: function (oEvent) {
				if (!this._oDialog) {
					this._oDialog = sap.ui.xmlfragment("fibria.com.fragment.SortingDialog", this);
				}
				// toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
				this._oDialog.open();
			},
			
			handleConfirm: function(oEvent) {
				var mParams = oEvent.getParameters();
				var oBinding = this.getView().byId("table").getBinding("items");
				var sPath;
				var bDescending;
				var aSorters = [];

				sPath = mParams.sortItem.getKey();
				bDescending = mParams.sortDescending;
				aSorters.push(new Sorter(sPath, bDescending));
				oBinding.sort(aSorters);
			},

			onRefresh : function () {
				this._oTable.getBinding("items").refresh();
			},

			_showObject : function (oItem) {
				this.getRouter().navTo("object", {
					objectId: oItem.getBindingContext().getProperty("RiskId"),
					objectType: "OF"
				});
			},
			
			formatterDate: function(date) {
				if (date !== null && date !== "") {
					var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000,
						oDateFormat = sap.ui.core.format.DateFormat.getInstance({
							pattern: "dd/MM/yyyy"
						});
					return oDateFormat.format(new Date(date.getTime() + TZOffsetMs));
				} else {
					return "";
				}
			}
		});
	}
);