sap.ui.define([
	"ZCBMM_APVEMERG/ZCBMM_APVEMERG/controller/BaseController",
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/m/Text',
	"sap/ui/model/json/JSONModel"
], function(BaseController,
	Dialog,
	Button,
	Text,
	JSONModel) {
	"use strict";

	return BaseController.extend("ZCBMM_APVEMERG.ZCBMM_APVEMERG.controller.Add_Solicitacao", {

		onInit: function() {
			this.getRouter().getRoute("Add_Solicitacao").attachPatternMatched(this._onObjectMatched, this);
			this.getRouter().getRoute("BackAddSol").attachPatternMatched(this.AtualizaTabela, this);
			
		},

		onbeforeRebindTable: function(oEvent) {
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();

			if (IdSolicitacao) {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "IdSolicitacao",
					operator: "EQ",
					value1: IdSolicitacao
				}));
			}
		},

		_onObjectMatched: function() {
			var oModel = new sap.ui.model.json.JSONModel();
			var sService = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_PARAMETSet/?$filter=Parametro eq 'ID_SOLICITACAO'";

			// Inicio - Buscar id da solicitação
			oModel.loadData(sService, null, false, "GET", false, false, null);
			var valor = oModel.oData.d.results[0].Valor;

			valor = parseInt(valor) + 1;

			this.getView().byId("IdIdSolicitacao").setValue(valor);
			// Fim - Buscar id da solicitação
			
			var smartTable = this.getView().byId("smartTable");
			smartTable.rebindTable("e");
		},
		
		AtualizaTabela: function(){
			var smartTable = this.getView().byId("smartTable");
			smartTable.rebindTable("e");
		},

		onBack: function() {
			this.getRouter().navTo("Back");
		},

		onSalvar: function() {
			var oModel = this.getView().getModel();
			var dialog = "";
			var Bukrs = "2001";
			var WerksO = this.getView().byId("IdWerks").getValue();
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();
			var Key = "/ZET_CBMM_CF_FRETESet(Bukrs='" + Bukrs + "',WerksO='" + WerksO + "',IdSolicitacao=" + IdSolicitacao + ")";
			var Este = this;
			var router = Este.getRouter();
			var oEntry = {};
			oEntry.Carteira = this.getView().byId("IdCarteira").getValue();
			oEntry.Modalidade = this.getView().byId("IdModalidade").getValue();
			oEntry.Prioridade = this.getView().byId("IdPrioridade").getValue();
			oEntry.Finalidade = this.getView().byId("IdFinalidade").getValue();
			oEntry.GrpCompras = this.getView().byId("IdGrpCompras").getValue();
			oEntry.DtInic = this.getView().byId("IdDtInic").getValue();

			if (WerksO === "") {
				this.getView().byId("IdWerks").setValueState("Error");
				sap.m.MessageBox.error("Centro não informado!");
				return;
			}

			if (oEntry.Carteira === "") {
				this.getView().byId("IdCarteira").setValueState("Error");
				sap.m.MessageBox.error("Carteira não informado!");
				return;
			}

			if (oEntry.Modalidade === "") {
				this.getView().byId("IdModalidade").setValueState("Error");
				sap.m.MessageBox.error("Modalidade não informada!");
				return;
			}

			if (oEntry.Prioridade === "") {
				this.getView().byId("IdPrioridade").setValueState("Error");
				sap.m.MessageBox.error("Prioridade não informada!");
				return;
			}

			if (oEntry.Finalidade === "") {
				this.getView().byId("IdFinalidade").setValueState("Error");
				sap.m.MessageBox.error("Finalidade não informada!");
				return;
			}

			if (oEntry.GrpCompras === "") {
				this.getView().byId("IdGrpCompras").setValueState("Error");
				sap.m.MessageBox.error("Grupo de Compras não informado!");
				return;
			}

			if (oEntry.DtInic === "") {
				this.getView().byId("IdDtInic").setValueState("Error");
				sap.m.MessageBox.error("Data inicio da operação não informada!");
				return;
			}

			dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: "Confirma a criação da solicitação?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function() {
						oModel.update(Key, oEntry, {
							success: function(oData, oResponse) {
								sap.m.MessageBox.success("Solicitação criada com sucesso!", {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function(sAction) {
										router.navTo("Back");
									}
								});
							},
							error: function(oError) {
								sap.m.MessageBox.error("Erro ao chamar o serviço");
							}
						});
						dialog.close();
					}
				}),
				endButton: new Button({
					text: "Não",
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});
			dialog.open();
		},

		onincluir: function() {

			var Bukrs = "2001";
			var Werks = this.getView().byId("IdWerks").getValue();
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();
			var Carteira = this.getView().byId("IdCarteira").getValue();
			var Modalidade = this.getView().byId("IdModalidade").getValue();
			var Prioridade = this.getView().byId("IdPrioridade").getValue();
			var Finalidade = this.getView().byId("IdFinalidade").getValue();
			var GrpCompras = this.getView().byId("IdGrpCompras").getValue();
			var DtInic = this.getView().byId("IdDtInic").getValue();

			if (Werks === "") {
				this.getView().byId("IdWerks").setValueState("Error");
				sap.m.MessageBox.error("Centro não informado!");
				return;
			}

			if (Carteira === "") {
				this.getView().byId("IdCarteira").setValueState("Error");
				sap.m.MessageBox.error("Carteira não informado!");
				return;
			}

			if (Modalidade === "") {
				this.getView().byId("IdModalidade").setValueState("Error");
				sap.m.MessageBox.error("Modalidade não informada!");
				return;
			}

			if (Prioridade === "") {
				this.getView().byId("IdPrioridade").setValueState("Error");
				sap.m.MessageBox.error("Prioridade não informada!");
				return;
			}

			if (Finalidade === "") {
				this.getView().byId("IdFinalidade").setValueState("Error");
				sap.m.MessageBox.error("Finalidade não informada!");
				return;
			}

			if (GrpCompras === "") {
				this.getView().byId("IdGrpCompras").setValueState("Error");
				sap.m.MessageBox.error("Grupo de Compras não informado!");
				return;
			}

			if (DtInic === "") {
				this.getView().byId("IdDtInic").setValueState("Error");
				sap.m.MessageBox.error("Data inicio da operação não informada!");
				return;
			}

			this.getRouter().navTo("Add_Rota", {
				Bukrs: Bukrs,
				Werks: Werks,
				IdSolicitacao: IdSolicitacao,
				Carteira: Carteira,
				Modalidade: Modalidade,
				Prioridade: Prioridade,
				Finalidade: Finalidade,
				GrpCompras: GrpCompras,
				DtInic: DtInic
			});
		},

		onChangeWerks: function() {

			var oModel = new sap.ui.model.json.JSONModel();
			var oInd = {};
			var Werks = this.getView().byId("IdWerks").getValue();
			var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_WERKSSet/$count?$filter=Werks eq '" + Werks + "'";

			oModel.loadData(serviceUrl, null, false, "GET", false, false, null);
			oInd = oModel.oData;

			if (oInd === 0) {
				sap.m.MessageBox.error("Centro inexistente");
				this.getView().byId("IdWerks").setValueState("Error");
			} else {
				this.getView().byId("IdWerks").setValueState("None");
			}
		},

		onChangeCarteira: function() {
			var oModel = new sap.ui.model.json.JSONModel();
			var oInd = {};
			var Valor = this.getView().byId("IdCarteira").getValue();
			var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_PARAMETSet(Parametro='CARTEIRA',Valor='" + Valor +
				"')/$count?";

			oModel.loadData(serviceUrl, null, false, "GET", false, false, null);
			oInd = oModel.oData;

			if (oInd > 0) {
				this.getView().byId("IdCarteira").setValueState("None");
			} else {
				sap.m.MessageBox.error("Carteira inexistente");
				this.getView().byId("IdCarteira").setValueState("Error");
			}
		},

		onChangePrioridade: function() {
			var oModel = new sap.ui.model.json.JSONModel();
			var oInd = {};
			var Valor = this.getView().byId("IdPrioridade").getValue();
			var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_PARAMETSet(Parametro='PRIORIDADE',Valor='" + Valor +
				"')/$count?";

			oModel.loadData(serviceUrl, null, false, "GET", false, false, null);
			oInd = oModel.oData;

			if (oInd > 0) {
				this.getView().byId("IdPrioridade").setValueState("None");
			} else {
				sap.m.MessageBox.error("Prioridade inexistente");
				this.getView().byId("IdPrioridade").setValueState("Error");
			}
		},

		onChangeModalidade: function() {
			var oModel = new sap.ui.model.json.JSONModel();
			var oInd = {};
			var Valor = this.getView().byId("IdModalidade").getValue();
			var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_PARAMETSet(Parametro='MODADELIDADE',Valor='" + Valor +
				"')/$count?";

			oModel.loadData(serviceUrl, null, false, "GET", false, false, null);
			oInd = oModel.oData;

			if (oInd > 0) {
				this.getView().byId("IdModalidade").setValueState("None");
			} else {
				sap.m.MessageBox.error("Modalidade inexistente");
				this.getView().byId("IdModalidade").setValueState("Error");
			}
		},

		onChangeFinalidade: function() {
			var oModel = new sap.ui.model.json.JSONModel();
			var oInd = {};
			var Valor = this.getView().byId("IdFinalidade").getValue();
			var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_PARAMETSet(Parametro='FINALIDADE',Valor='" + Valor +
				"')/$count?";

			oModel.loadData(serviceUrl, null, false, "GET", false, false, null);
			oInd = oModel.oData;

			if (oInd > 0) {
				this.getView().byId("IdFinalidade").setValueState("None");
			} else {
				sap.m.MessageBox.error("Finalidade inexistente");
				this.getView().byId("IdFinalidade").setValueState("Error");
			}
		},

		onChangeGrpCompras: function() {
			var oModel = new sap.ui.model.json.JSONModel();
			var oInd = {};
			var GrpCompras = this.getView().byId("IdGrpCompras").getValue();
			var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_GRPSet/$count?$filter=GrpComprador eq '" +
				GrpCompras + "'";

			oModel.loadData(serviceUrl, null, false, "GET", false, false, null);
			oInd = oModel.oData;

			if (oInd === 0) {
				sap.m.MessageBox.error("Grupo de Compras inexistente");
				this.getView().byId("IdGrpCompras").setValueState("Error");
			} else {
				this.getView().byId("IdGrpCompras").setValueState("None");
			}
		},

		onHelpWerks: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog1) {
				this._valueHelpDialog1 = sap.ui.xmlfragment("ZCBMM_APVEMERG.ZCBMM_APVEMERG.view.Werks", this);
				this.getView().addDependent(this._valueHelpDialog1);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog1.open(sInputValue);
		},

		onHelpCarteira: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog2) {
				this._valueHelpDialog2 = sap.ui.xmlfragment("ZCBMM_APVEMERG.ZCBMM_APVEMERG.view.Carteira", this);
				this.getView().addDependent(this._valueHelpDialog2);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog2.open(sInputValue);
		},

		onHelpPrioridade: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog3) {
				this._valueHelpDialog3 = sap.ui.xmlfragment("ZCBMM_APVEMERG.ZCBMM_APVEMERG.view.Prioridade", this);
				this.getView().addDependent(this._valueHelpDialog3);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog3.open(sInputValue);
		},

		onHelpModalidade: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog4) {
				this._valueHelpDialog4 = sap.ui.xmlfragment("ZCBMM_APVEMERG.ZCBMM_APVEMERG.view.Modalidade", this);
				this.getView().addDependent(this._valueHelpDialog4);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog4.open(sInputValue);
		},

		onHelpFinalidade: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog5) {
				this._valueHelpDialog5 = sap.ui.xmlfragment("ZCBMM_APVEMERG.ZCBMM_APVEMERG.view.Finalidade", this);
				this.getView().addDependent(this._valueHelpDialog5);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog5.open(sInputValue);
		},

		onHelpGrupoDeCompras: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog6) {
				this._valueHelpDialog6 = sap.ui.xmlfragment("ZCBMM_APVEMERG.ZCBMM_APVEMERG.view.GrupoDeCompras", this);
				this.getView().addDependent(this._valueHelpDialog6);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog6.open(sInputValue);
		},

		_handleValueHelpClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");

			this._valueHelpDialog1 = null;
			this._valueHelpDialog2 = null;
			this._valueHelpDialog3 = null;
			this._valueHelpDialog4 = null;
			this._valueHelpDialog5 = null;
			this._valueHelpDialog6 = null;

			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);
			this.getView().byId(this.inputId).setValueState("None");
		},

		_handleValueHelpWerks: function(oEvent) {
			var sValue = oEvent.getParameter("value");

			if (!sValue) {
				sValue = " ";
			}

			var sFilter = sValue;
			var oFilter = oFilter = new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		_onModelContextChangeCarteira: function(oEvent) {
			var Parametro = "CARTEIRA";

			var sFilter = Parametro;
			var oFilter = oFilter = new sap.ui.model.Filter("Parametro", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		_onModelContextChangePrioridade: function(oEvent) {
			var Parametro = "PRIORIDADE";

			var sFilter = Parametro;
			var oFilter = oFilter = new sap.ui.model.Filter("Parametro", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		_onModelContextChangeModalidade: function(oEvent) {
			var Parametro = "MODALIDADE";

			var sFilter = Parametro;
			var oFilter = oFilter = new sap.ui.model.Filter("Parametro", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		_onModelContextChangeFinalidade: function(oEvent) {
			var Parametro = "FINALIDADE";

			var sFilter = Parametro;
			var oFilter = oFilter = new sap.ui.model.Filter("Parametro", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		_onModelContextChangeGrpCompras: function(oEvent) {
			var Parametro = "GRP COMPRAS";

			var sFilter = Parametro;
			var oFilter = oFilter = new sap.ui.model.Filter("Parametro", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		_Confirme_werks: function(evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			this._valueHelpDialog5 = null;

			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
			}
			
			this.getView().byId("IdWerks").setValueState("None");
		},

	});

});