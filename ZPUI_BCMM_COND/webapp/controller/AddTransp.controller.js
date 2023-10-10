sap.ui.define([
	"ZPUI_BCMM_COND/ZPUI_BCMM_COND/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/ui/model/Filter',
	"ZPUI_BCMM_COND/ZPUI_BCMM_COND/model/formatter"
], function(BaseController, JSONModel, Filter, formatter) {
	"use strict";

	return BaseController.extend("ZPUI_BCMM_COND.ZPUI_BCMM_COND.controller.AddTransp", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ZPUI_BCMM_COND.ZPUI_BCMM_COND.view.AddRota
		 */
		onInit: function() {
			this.getRouter().getRoute("addtransp").attachPatternMatched(this._onObjectMatched, this);
			this.getView().byId("IdNrTransp").setValue(null);
		},

		//	onExit: function() {
		//
		//	}
		_onObjectMatched: function(oEvent) {
			var Bukrs = oEvent.getParameter("arguments").Bukrs;
			var IdSolicitacao = oEvent.getParameter("arguments").IdSolicitacao;
			var WerksO = oEvent.getParameter("arguments").WerksO;
			var IdRota = oEvent.getParameter("arguments").IdRota;
			
			this.getView().byId("Bukrs").setValue(Bukrs);
			this.getView().byId("IdSolicitacao").setValue(IdSolicitacao);
			this.getView().byId("WerksO").setValue(WerksO);
			this.getView().byId("IdRota").setValue(IdRota);
			
		},
		
		OnSave: function() {

			var oModel = this.getView().getModel();
			var key = "";
			var oParameters = {};
			var este = this;
			
			oParameters.Bukrs = this.getView().byId("Bukrs").getValue();
			oParameters.WerksO = this.getView().byId("WerksO").getValue();
			oParameters.IdSolicitacao = parseInt(this.getView().byId("IdSolicitacao").getValue());
			oParameters.IdRota = parseInt(this.getView().byId("IdRota").getValue());
			oParameters.NrTransp = this.getView().byId("IdNrTransp").getValue();
			
			if (!oParameters.NrTransp ){
			sap.m.MessageBox.show("Campo Transportadora obrigatório");
			return;
			}
			
			var oModel2 = new sap.ui.model.json.JSONModel();
			var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_TRANSP_HSet/$count?$filter=Lifnr eq '" + oParameters.NrTransp + "'";

			oModel2.loadData(serviceUrl, null, false, "GET", false, false, null);
			var oInd = oModel2.getData();

			if (oInd !== 1) {
				sap.m.MessageToast.show("Transportadora inválida, favor selecionar uma transportadora válida.");
				return;
			}

			key = "/ZET_CBMM_CF_TRANSPSet(Bukrs='" + oParameters.Bukrs + "',WerksO='" + oParameters.WerksO + "',IdSolicitacao=" + oParameters
				.IdSolicitacao + ",IdRota=" + oParameters.IdRota + ",NrTransp='" + oParameters.NrTransp + "')";

			oModel.update(key, oParameters, {
				success: function(oData, oResponse) {
					sap.m.MessageBox.success("Transportadora cadastrada com sucesso", {
						actions: ["OK", sap.m.MessageBox.Action.CLOSE],
						onClose: function(sAction) {
							este.getView().byId("IdNrTransp").setValue(null);
							este.getRouter().navTo("Back");
						}

					});
				
				},

				error: function(e) {
					sap.m.MessageBox.error("Não foi possível inserir a transportadora");
				}
			});

		},

		onCanc: function() {
		// voltar para tela anterior
		this.getRouter().navTo("Back");
		},

		onNrTransp: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog2) {
				this._valueHelpDialog2 = sap.ui.xmlfragment("ZPUI_BCMM_COND.ZPUI_BCMM_COND.view.Transp", this);
				this.getView().addDependent(this._valueHelpDialog2);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog2.open(sInputValue);
		},

		_handleValueHelpClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");

			this._valueHelpDialog1 = null;
			this._valueHelpDialog4 = null;
			this._valueHelpDialog6 = null;

			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);
			this.getView().byId(this.inputId).setValueState("None");
		},

		_handleValueHelpTransp: function(oEvent) {
			var sValue = oEvent.getParameter("value");

			if (!sValue) {
				sValue = " ";
			}

			var sFilter = sValue;

			var oFilter = oFilter = new sap.ui.model.Filter("Lifnr", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);

			// var sValue = oEvent.getParameter("value");
			// var oFilter = new sap.ui.model.Filter("Aprovador",
			// 	sap.ui.model.FilterOperator.Contains, sValue);
			// oEvent.getSource().getBinding("items").filter([oFilter]);
		}

	});

});