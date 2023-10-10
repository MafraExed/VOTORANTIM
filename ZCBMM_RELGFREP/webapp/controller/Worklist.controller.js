/*global location history */
sap.ui.define([
	"ZCBMM_RELGFREP/ZCBMM_RELGFREP/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"ZCBMM_RELGFREP/ZCBMM_RELGFREP/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, History, formatter, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("ZCBMM_RELGFREP.ZCBMM_RELGFREP.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			var oViewModel,
				iOriginalBusyDelay,
				oTable = this.byId("table");

			// Put down worklist table's original value for busy indicator delay,
			// so it can be restored later on. Busy handling on the table is
			// taken care of by the table itself.
			iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			// keeps the search state
			this._aTableSearchState = [];

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
				saveAsTileTitle: this.getResourceBundle().getText("saveAsTileTitle", this.getResourceBundle().getText("worklistViewTitle")),
				shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
				tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay: 0
			});
			this.setModel(oViewModel, "worklistView");

			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			oTable.attachEventOnce("updateFinished", function() {
				// Restore original busy indicator delay for worklist's table
				oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			});
			// Add the worklist page to the flp routing history
			this.addHistoryEntry({
				title: this.getResourceBundle().getText("worklistViewTitle"),
				icon: "sap-icon://table-view",
				intent: "#RelatórioGestãodeFreteContratosAnalítico-display"
			}, true);

			/*		var oFilterBar = this.byId("smartFilterBar");
				if (oFilterBar) {
					var that = this;
					oFilterBar.attachFilterChange(function(oEvent) {
						 that._updateCustomFilter();
					});
				}*/
		},

		onbeforeRebindTable: function(oEvent) {
			var oSmartFilterbar = this.getView().byId("smartFilterBar");
			var oCtrl = oSmartFilterbar.determineControlByName("Status");
			var Tdlnr = this.getView().byId("IdTranps").getValue();
			var Vhilm = this.getView().byId("IdTpVeiculo").getValue();
			var Kschl = this.getView().byId("IdTpCondicao").getValue();
			var IdZone1O = this.getView().byId("IdZone1O").getValue();
			var IdZone1D = this.getView().byId("IdZone1D").getValue();

			if (oCtrl) {
				var sStatus = oCtrl.getSelectedKey();
				if (sStatus !== " ") {
					oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
						path: "Status",
						operator: "EQ",
						value1: sStatus
					}));
				}
			}

			if (Tdlnr) {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Tdlnr",
					operator: "EQ",
					value1: Tdlnr
				}));
			}

			if (Vhilm) {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Vhilm",
					operator: "EQ",
					value1: Vhilm
				}));
			}

			if (Kschl) {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Kschl",
					operator: "EQ",
					value1: Kschl
				}));
			}

			if (IdZone1O && IdZone1D) {
				var Route  = IdZone1O + "/" + IdZone1D;
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Route",
					operator: "EQ",
					value1: Route
				}));
			}
			
			if (IdZone1O) {
				var RouteO  = IdZone1O;
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Route",
					operator: "EQ",
					value1: RouteO
				}));
			}
			
			if (IdZone1D) {
				var RouteD  = IdZone1D;
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Route",
					operator: "EQ",
					value1: RouteD
				}));
			}

		},

		onUpdateFinished: function(oEvent) {
			// update the worklist's object counter after the table update
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

		onPress: function(oEvent) {

			this._showObject(oEvent.getSource());
		},

		onShareInJamPress: function() {
			var oViewModel = this.getModel("worklistView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});
			oShareDialog.open();
		},

		onSearch: function(oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var aTableSearchState = [];
				var sQuery = oEvent.getParameter("query");

				if (sQuery && sQuery.length > 0) {
					aTableSearchState = [new Filter("Kozgf", FilterOperator.Contains, sQuery)];
				}
				this._applySearch(aTableSearchState);
			}

		},

		onRefresh: function() {
			var oTable = this.byId("table");
			oTable.getBinding("items").refresh();
		},

		_showObject: function(oItem) {
			this.getRouter().navTo("object", {
				objectId: oItem.getBindingContext().getProperty("Kozgf")
			});
		},

		_applySearch: function(aTableSearchState) {
			var oTable = this.byId("table"),
				oViewModel = this.getModel("worklistView");
			oTable.getBinding("items").filter(aTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			}
		},

		onHelpTransp: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog1) {
				this._valueHelpDialog1 = sap.ui.xmlfragment("ZCBMM_RELGFREP.ZCBMM_RELGFREP.view.Transp", this);
				this.getView().addDependent(this._valueHelpDialog1);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog1.open(sInputValue);
		},

		onHelpRoute: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog2) {
				this._valueHelpDialog2 = sap.ui.xmlfragment("ZCBMM_RELGFREP.ZCBMM_RELGFREP.view.Route", this);
				this.getView().addDependent(this._valueHelpDialog2);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog2.open(sInputValue);
		},

		onHelpTpVeiculo: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog3) {
				this._valueHelpDialog3 = sap.ui.xmlfragment("ZCBMM_RELGFREP.ZCBMM_RELGFREP.view.Veic", this);
				this.getView().addDependent(this._valueHelpDialog3);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog3.open(sInputValue);
		},

		onTpCondicao: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog4) {
				this._valueHelpDialog4 = sap.ui.xmlfragment("ZCBMM_RELGFREP.ZCBMM_RELGFREP.view.Condicoes", this);
				this.getView().addDependent(this._valueHelpDialog4);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog4.open(sInputValue);
		},

		onHelpZone1: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog5) {
				this._valueHelpDialog5 = sap.ui.xmlfragment("ZCBMM_RELGFREP.ZCBMM_RELGFREP.view.Zone1", this);
				this.getView().addDependent(this._valueHelpDialog5);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog5.open(sInputValue);
			
		},

		_handleValueHelpClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");

			this._valueHelpDialog1 = null;
			this._valueHelpDialog2 = null;
			this._valueHelpDialog3 = null;
			this._valueHelpDialog4 = null;
			this._valueHelpDialog5 = null;

			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);
			this.getView().byId(this.inputId).setValueState("None");
			
			this.onValidaZona();
		},
		
		ConfirmTransp: function(evt){
			var oSelectedItem = evt.getParameter("selectedItem");

			this._valueHelpDialog1 = null;

			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getDescription());
			}
			evt.getSource().getBinding("items").filter([]);
			this.getView().byId(this.inputId).setValueState("None");
		},

		onChangeZone1O: function() {
			var Zone1O = this.getView().byId("IdZone1O").getValue();
			var oInd = {};
			var oModel1 = new sap.ui.model.json.JSONModel();

			var sServiceCount = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_ZONE1Set/$count?$filter=Vtext eq '" +
				Zone1O +
				"'";

			oModel1.loadData(sServiceCount, null, false, "GET", false, false, null);
			oInd = oModel1.oData;

			if (oInd === 0) {
				this.getView().byId("IdZone1O").setValueState("Error");
				sap.m.MessageBox.error("A Zona de transporte informada não existe.");
				return;
			} else {
				this.getView().byId("IdZone1O").setValueState("None");
			}

			this.onValidaZona();
		},

		onChangeZone1D: function() {
			var Zone1D = this.getView().byId("IdZone1D").getValue();
			var oInd = {};
			var oModel1 = new sap.ui.model.json.JSONModel();

			var sServiceCount = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_ZONE1Set/$count?$filter=Vtext eq '" +
				Zone1D +
				"'";

			oModel1.loadData(sServiceCount, null, false, "GET", false, false, null);
			oInd = oModel1.oData;

			if (oInd === 0) {
				this.getView().byId("IdZone1D").setValueState("Error");
				sap.m.MessageBox.error("A Zona de tranpsorte informada não existe.");
				return;
			} else {
				this.getView().byId("IdZone1D").setValueState("None");
			}

			this.onValidaZona();
		},

		onValidaZona: function() {
			// Alimenta Campo itinerario
			var Zone1D = this.getView().byId("IdZone1D").getValue();
			var Zone1O = this.getView().byId("IdZone1O").getValue();

			if (Zone1D !== "" && Zone1O !== "") {

				// Verificar se tem espaços.
				while (Zone1D.indexOf(" ") != -1)
					Zone1D = Zone1D.replace(" ", "%20");

				while (Zone1O.indexOf(" ") != -1)
					Zone1O = Zone1O.replace(" ", "%20");
				// Verificar se tem espaços.

				var oModel2 = new sap.ui.model.json.JSONModel();

				var key = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_ROUTESet(Zone1='" + Zone1O + "',Zone2='" + Zone1D + "')";

				oModel2.loadData(key, null, false, "GET", false, false, null);
				var Route = oModel2.oData.d.Route;

				this.getView().byId("IdRoute").setValue(Route);
			}

		},

		_handleValueHelpZone1: function(oEvent) {
			var sValue = oEvent.getParameter("value");

			var oFilter = new sap.ui.model.Filter("Vtext",
				sap.ui.model.FilterOperator.Contains, sValue);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		
		_handleValueHelpVeic: function(oEvent) {
			var sValue = oEvent.getParameter("value");

			if (!sValue) {
				sValue = " ";
			}

			var sFilter = sValue;

			var oFilter = oFilter = new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.Contains, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);

		},
		
		_handleValueHelpCond: function(oEvent) {
			var sValue = oEvent.getParameter("value");

			if (!sValue) {
				sValue = " ";
			}

			sValue = sValue.toUpperCase();
			var sFilter = sValue;
			var oFilter = new sap.ui.model.Filter("Kschl", sap.ui.model.FilterOperator.Contains, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);

		},
		
		_handleValueHelpTransp: function(oEvent) {
			var sValue = oEvent.getParameter("value");

			if (!sValue) {
				sValue = " ";
			}

			var sFilter = sValue;

			var oFilter = oFilter = new sap.ui.model.Filter("Lifnr", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);

		},
		
		onAssignedFiltersChanged: function(oEvent) {
			var oStatusText = sap.ui.getCore().byId(this.getView().getId() + "--statusText");
			var oFilterBar = sap.ui.getCore().byId(this.getView().getId() + "--smartFilterBar");
			if (oStatusText && oFilterBar) {
				var sText = oFilterBar.retrieveFiltersWithValuesAsText();

				oStatusText.setText(sText);
			}
		},
	});
});