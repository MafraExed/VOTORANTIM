sap.ui.define([
	"ZCBMM_MAILTRAN/ZCBMM_MAILTRAN/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ZCBMM_MAILTRAN/ZCBMM_MAILTRAN/model/formatter"
], function(BaseController, JSONModel, formatter) {
	"use strict";

	return BaseController.extend("ZCBMM_MAILTRAN.ZCBMM_MAILTRAN.controller.Veiculo", {

		formatter: formatter,

		onInit: function() {
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0
			});
			this.getRouter().getRoute("Veiculo").attachPatternMatched(this._onObjectMatched, this);
			this.setModel(oViewModel, "VeiculoView");
			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},
		_onObjectMatched: function(oEvent) {
			var Bukrs = oEvent.getParameter("arguments").Bukrs;
			var WerksO = oEvent.getParameter("arguments").WerksO;
			var IdSolicitacao = oEvent.getParameter("arguments").IdSolicitacao;
			var IdRota = oEvent.getParameter("arguments").IdRota;
			var NrTransp = oEvent.getParameter("arguments").NrTransp;

			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("ZET_CBMM_CF_TRANSPSet", {
					Bukrs: Bukrs,
					WerksO: WerksO,
					IdSolicitacao: IdSolicitacao,
					IdRota: IdRota,
					NrTransp: NrTransp
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		_bindView: function(sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("VeiculoView"),
				oDataModel = this.getModel();

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oDataModel.metadataLoaded().then(function() {
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},
		_onBindingChange: function() {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}

			var sPath = oElementBinding.getPath(),
				oResourceBundle = this.getResourceBundle(),
				oObject = oView.getModel().getObject(sPath),
				sObjectId = oObject.IdSolicitacao,
				sObjectName = oObject.IdSolicitacao,
				oViewModel = this.getModel("VeiculoView");

			this.getOwnerComponent().oListSelector.selectAListItem(sPath);

			oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("shareSaveTileAppTitle", [sObjectName]));
			oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));

			var smartTable = this.getView().byId("smartTable2");
			smartTable.rebindTable("e");

		},
		atualizaTabela2: function(oEvent) {
			var IdSolicitacao = this.getView().byId("IdSolicitacao").getValue();

			if (IdSolicitacao) {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "IdSolicitacao",
					operator: "EQ",
					value1: IdSolicitacao
				}));
			}
		},
		onBack: function() {
			this.getRouter().navTo("BackTo");
		},
		_onMetadataLoaded: function() {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("VeiculoView");
			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);
			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		},
		onPress: function(oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},
		_showObject: function(oItem) {
			var IdSolicitacao = oItem.getBindingContext().getProperty("IdSolicitacao");
			var WerksO = oItem.getBindingContext().getProperty("WerksO");
			var Bukrs = oItem.getBindingContext().getProperty("Bukrs");
			var IdRota = oItem.getBindingContext().getProperty("IdRota");
			var NrTransp = oItem.getBindingContext().getProperty("NrTransp");
			var TpVeiculo = oItem.getBindingContext().getProperty("TpVeiculo");

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