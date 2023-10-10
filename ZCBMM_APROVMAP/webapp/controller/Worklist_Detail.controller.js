/*global location history */
sap.ui.define([
	"ZCBMM_APROVMAP/ZCBMM_APROVMAP/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"ZCBMM_APROVMAP/ZCBMM_APROVMAP/model/formatter",
	"sap/ui/model/Filter",
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/Text',
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, History, formatter, Filter, Button, Dialog, Text, FilterOperator) {
	"use strict";

	return BaseController.extend("ZCBMM_APROVMAP.ZCBMM_APROVMAP.controller.Worklist_Detail", {

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

			this.getRouter().getRoute("Worklist_Detail").attachPatternMatched(this._onObjectMatched, this);

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
				intent: "#SolicitaçãodeFrete-display"
			}, true);
		},

		_onObjectMatched: function(oEvent) {
			this.getView().byId("IdVeiculo").setVisible(false);
			var IdSolicitacao = oEvent.getParameter("arguments").IdSolicitacao;
			this.getView().byId("IdIdSolicitacao").setValue(IdSolicitacao);

			//Atualiza Tabela
			var smartTable = this.getView().byId("smartTable");
			smartTable.rebindTable("e");
		},

		onbeforeRebindTable: function(oEvent) {
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();

			if (IdSolicitacao !== "") {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "IdSolicitacao",
					operator: "EQ",
					value1: IdSolicitacao
				}));

				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Bukrs",
					operator: "EQ",
					value1: "X"
				}));
			}

		},

		onbeforeRebindTable2: function(oEvent) {
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();
			var NrTransp = this.getView().byId("IdNrTransp").getValue();

			if (IdSolicitacao !== "") {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "IdSolicitacao",
					operator: "EQ",
					value1: IdSolicitacao
				}));

				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Vencedor",
					operator: "EQ",
					value1: "X"
				}));

				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "NrTransp",
					operator: "EQ",
					value1: NrTransp
				}));

			}

		},
		onBack: function() {
			this.getRouter().navTo("BackWork");
		},

		onPress: function(oEvent) {
			this.getView().byId("IdVeiculo").setVisible(true);
			var IdSolicitacao = oEvent.getSource().getBindingContext().getProperty("IdSolicitacao");
			var NrTransp = oEvent.getSource().getBindingContext().getProperty("NrTransp");

			this.getView().byId("IdIdSolicitacao").setValue(IdSolicitacao);
			this.getView().byId("IdNrTransp").setValue(NrTransp);
			var smartTable = this.getView().byId("smartTable1");
			smartTable.rebindTable("e");

		},

		onPress1: function(oEvent) {
			this._showObject(oEvent.getSource());
		},

		_showObject: function(oItem) {
			var sPath = oItem.getBindingContext().sPath;
			var Model = new sap.ui.model.json.JSONModel();
			var Key = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV" + sPath;
			Model.loadData(Key, null, false, "GET", false, false, null);
			var IdSolicitacao = Model.oData.d.IdSolicitacao;
			var Bukrs = Model.oData.d.Bukrs;
			var WerksO = Model.oData.d.WerksO;
			var IdRota = Model.oData.d.IdRota;
			var NrTransp = Model.oData.d.NrTransp;
			var TpVeiculo = Model.oData.d.TpVeiculo;

			this.getRouter().navTo("Mapa", {
				Bukrs: Bukrs,
				WerksO: WerksO,
				IdSolicitacao: IdSolicitacao,
				IdRota: IdRota,
				NrTransp: NrTransp,
				TpVeiculo: TpVeiculo

			});
		}

	});
});