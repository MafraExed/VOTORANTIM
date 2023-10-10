/*global location */
sap.ui.define([
	"ZCBMM_GERAR_COTACAO/ZCBMM_GERAR_COTACAO/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ZCBMM_GERAR_COTACAO/ZCBMM_GERAR_COTACAO/model/formatter"
], function(BaseController, JSONModel, formatter) {
	"use strict";

	return BaseController.extend("ZCBMM_GERAR_COTACAO.ZCBMM_GERAR_COTACAO.controller.Information", {

		formatter: formatter,

		onInit: function() {
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0
			});
			this.getRouter().getRoute("Information").attachPatternMatched(this._onObjectMatched, this);
			this.setModel(oViewModel, "InformationView");
			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},

		_onObjectMatched: function(oEvent) {
			var Bukrs = oEvent.getParameter("arguments").Bukrs;
			var IdSolicitacao = oEvent.getParameter("arguments").IdSolicitacao;
			var WerksO = oEvent.getParameter("arguments").WerksO;
			var IdRota = oEvent.getParameter("arguments").IdRota;
			var Carteira = oEvent.getParameter("arguments").Carteira;
			this.getView().byId("IdCarteira").setValue(Carteira);

			if (Carteira === "SERVIÇO") {
				this.getView().byId("Filter01").setVisible(true);
				this.getView().byId("Filter02").setVisible(false);
				this.getView().byId("Filter03").setVisible(false);
				this.getView().byId("Filter04").setVisible(false);
				this.getView().byId("Filter05").setVisible(true);
				

				// Campos não necessarios em MRO
				this.getView().byId("FIdAlturaEmb").setVisible(true);
				this.getView().byId("FIdLarguraEmb").setVisible(true);

				// Campos não necessarios em INSUMOS
				this.getView().byId("FIdPesoUnit").setVisible(true);
				this.getView().byId("FIdPesoTotal").setVisible(true);
				this.getView().byId("FIdAltura").setVisible(true);
				this.getView().byId("FIdLargura").setVisible(true);
				this.getView().byId("FIdCompr").setVisible(true);

				// Campos necessarios para Insumos
				this.getView().byId("FIdComprEmb").setVisible(false);
				this.getView().byId("FIdVolumEmb").setVisible(false);
			}
			if (Carteira === "INSUMO" || Carteira === "RESIDUO" || Carteira === "BAUXITA") {
				this.getView().byId("Filter01").setVisible(true);
				this.getView().byId("Filter02").setVisible(true);
				this.getView().byId("Filter03").setVisible(true);
				this.getView().byId("Filter04").setVisible(true);
				this.getView().byId("Filter05").setVisible(false);
				// Campos não necessarios em MRO
				this.getView().byId("FIdAlturaEmb").setVisible(true);
				this.getView().byId("FIdLarguraEmb").setVisible(true);

				this.getView().byId("FIdComprEmb").setVisible(true);
				this.getView().byId("FIdVolumEmb").setVisible(true);

				// Campos não necessarios em INSUMOS
				this.getView().byId("FIdPesoUnit").setVisible(false);
				this.getView().byId("FIdPesoTotal").setVisible(false);
				this.getView().byId("FIdAltura").setVisible(false);
				this.getView().byId("FIdLargura").setVisible(false);
				this.getView().byId("FIdCompr").setVisible(false);

				// Campos necessarios para Insumos
				this.getView().byId("FIdComprEmb").setVisible(true);
				this.getView().byId("FIdVolumEmb").setVisible(true);
			}
			if (Carteira === "MRO") {
				this.getView().byId("Filter01").setVisible(true);
				this.getView().byId("Filter02").setVisible(true);
				this.getView().byId("Filter03").setVisible(true);
				this.getView().byId("Filter04").setVisible(true);
				this.getView().byId("Filter05").setVisible(false);

				// Campos não necessarios em MRO
				this.getView().byId("FIdAlturaEmb").setVisible(false);
				this.getView().byId("FIdLarguraEmb").setVisible(false);

				// Campos não necessarios em INSUMOS
				this.getView().byId("FIdPesoUnit").setVisible(true);
				this.getView().byId("FIdPesoTotal").setVisible(true);
				this.getView().byId("FIdAltura").setVisible(true);
				this.getView().byId("FIdLargura").setVisible(true);
				this.getView().byId("FIdCompr").setVisible(true);

				// Campos necessarios para Insumos
				this.getView().byId("FIdComprEmb").setVisible(false);
				this.getView().byId("FIdVolumEmb").setVisible(false);
			}
			if (Carteira === "PRODUTO ACABADO") {
				this.getView().byId("Filter01").setVisible(true);
				this.getView().byId("Filter02").setVisible(true);
				this.getView().byId("Filter03").setVisible(true);
				this.getView().byId("Filter04").setVisible(true);
				this.getView().byId("Filter05").setVisible(false);

				// Campos não necessarios em MRO
				this.getView().byId("FIdAlturaEmb").setVisible(true);
				this.getView().byId("FIdLarguraEmb").setVisible(true);

				// Campos não necessarios em INSUMOS
				this.getView().byId("FIdPesoUnit").setVisible(true);
				this.getView().byId("FIdPesoTotal").setVisible(true);
				this.getView().byId("FIdAltura").setVisible(true);
				this.getView().byId("FIdLargura").setVisible(true);
				this.getView().byId("FIdCompr").setVisible(true);

				// Campos necessarios para Insumos
				this.getView().byId("FIdComprEmb").setVisible(false);
				this.getView().byId("FIdVolumEmb").setVisible(false);
			}

			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("ZET_CBMM_CF_ROTASet", {
					Bukrs: Bukrs,
					IdSolicitacao: IdSolicitacao,
					WerksO: WerksO,
					IdRota: IdRota

				});
				this._bindView("/" + sObjectPath);
			}.bind(this));

		},

		_bindView: function(sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("InformationView"),
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
			var IdSolicitacao = this.getView().byId("IdSolicitacao").getValue();
			var IdRota = this.getView().byId("idIdRota").getValue();
			var WerksO = this.getView().byId("IdWerksO").getValue();
			var oModel = new sap.ui.model.json.JSONModel();
			var oInd = {};

			var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_UPLOADSet(Bukrs='2001',WerksO='" + WerksO +
				"',IdSolicitacao=" + IdSolicitacao + ",IdRota=" + IdRota + ",DocId=1)";

			oModel.loadData(serviceUrl, null, false, "GET", false, false, null);
			oInd = oModel.oData.d.Filename;

			if (!oInd) {
				this.getView().byId("UploadCollection").setVisible(false);
			} else {
				this.getView().byId("UploadCollection").setVisible(true);
			}

			// Inicio - Filtro nos uploads de arquivo   

			var filter = IdSolicitacao + ";" + IdRota,
				oFilter = new sap.ui.model.Filter("WerksO", sap.ui.model.FilterOperator.EQ, filter),
				oList = this.getView().byId("UploadCollection");
			// Executa filtro   
			oList.getBinding("items").filter([oFilter]);

			// // fim executa filtro   
			// // Fim - Filtro nos uploads de arquivo

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
				oViewModel = this.getModel("InformationView");

			this.getOwnerComponent().oListSelector.selectAListItem(sPath);

			oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("shareSaveTileAppTitle", [sObjectName]));
			oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));

			var smartTable = this.getView().byId("smartTable1");
			smartTable.rebindTable("e");
			
			var sStart = this.getView().byId("IdAdrnrO").getValue(); 
			var sEnd = this.getView().byId("IdAdrnrD").getValue();
			var sRoute = this.getView().byId("idRoute");
			
		},
		atualizaTabela1: function(oEvent) {
			var IdSolicitacao = this.getView().byId("IdSolicitacao").getValue();

			if (IdSolicitacao) {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "IdSolicitacao",
					operator: "EQ",
					value1: IdSolicitacao
				}));
			}
			var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
				pattern: "KK:mm:ss a"
			});
			timeFormat.hasOwnProperty("HrDescFim");
		},
		
		onBack: function(){
			this.getRouter().navTo("Back");
		},
		
		_onMetadataLoaded: function() {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("InformationView");

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

			this.getRouter().navTo("Veiculo", {
				Bukrs: Bukrs,
				WerksO: WerksO,
				IdSolicitacao: IdSolicitacao,
				IdRota: IdRota,
				NrTransp: NrTransp
			});
		}
	});

});