sap.ui.define([
	"ZCBMM_SOLICITACAO_FRETE/ZCBMM_SOLICITACAO_FRETE/controller/BaseController",
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/m/Text',
	"sap/ui/model/json/JSONModel"
], function (BaseController,
	Dialog,
	Button,
	Text,
	JSONModel) {
	"use strict";

	return BaseController.extend("ZCBMM_SOLICITACAO_FRETE.ZCBMM_SOLICITACAO_FRETE.controller.Add_Solicitacao", {

		onInit: function () {
			this.getRouter().getRoute("Add_Solicitacao").attachPatternMatched(this._onObjectMatched, this);
			this.getRouter().getRoute("BackAddSol").attachPatternMatched(this.AtualizaTabela, this);

		},

		onbeforeRebindTable: function (oEvent) {
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();

			if (IdSolicitacao) {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "IdSolicitacao",
					operator: "EQ",
					value1: IdSolicitacao
				}));
			}
		},

		_onObjectMatched: function () {

			var This = this;
			This.getView().byId("IdWerks").setEditable(true);
			This.getView().byId("IdCarteira").setEditable(true);
			This.getView().byId("IdModalidade").setEditable(true);
			This.getView().byId("IdFinalidade").setEditable(true);
			This.getView().byId("IdGrpCompras").setEditable(true);
			This.getView().byId("IdDtInic").setEditable(true);

			This.getView().byId("IdWerks").setValue();
			This.getView().byId("IdCarteira").setValue();
			This.getView().byId("IdModalidade").setValue();
			This.getView().byId("IdFinalidade").setValue();
			This.getView().byId("IdGrpCompras").setValue();
			This.getView().byId("IdDtInic").setValue();
			This.getView().byId("IdPrioridade").setValue();

			var oModel = new sap.ui.model.json.JSONModel();
			var sService = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_PARAMETSet/?$filter=Parametro eq 'ID_SOLICITACAO'";

			// Inicio - Buscar id da solicitação
			oModel.loadData(sService, null, false, "GET", false, false, null);
			var valor = oModel.oData.d.results[0].Valor;

			if (valor !== "") {
				valor = parseInt(valor) + 1;
			}
			this.getView().byId("IdIdSolicitacao").setValue(valor);
			// Fim - Buscar id da solicitação

			var smartTable = this.getView().byId("smartTable");
			smartTable.rebindTable("e");
		},

		AtualizaTabela: function (oEvent) {

			var IdSolicitacao = oEvent.getParameters("arguments").arguments.IdSolicitacao;
			var WerksO = oEvent.getParameters("arguments").arguments.WerksO;
			var Carteira = oEvent.getParameters("arguments").arguments.Carteira;
			var Modalidade = oEvent.getParameters("arguments").arguments.Modalidade;
			var Prioridade = oEvent.getParameters("arguments").arguments.Prioridade;
			var Finalidade = oEvent.getParameters("arguments").arguments.Finalidade;
			var GrpCompras = oEvent.getParameters("arguments").arguments.GrpCompras;
			var DtInic = oEvent.getParameters("arguments").arguments.DtInic;
			var Status = oEvent.getParameters("arguments").arguments.Status;
			var Kostl = oEvent.getParameters("arguments").arguments.Kostl;

			if (Kostl === "-") {
				var oModel = new sap.ui.model.json.JSONModel();
				var oInd = {};
				var Bukrs = "2001";
				var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_FRETESet(Bukrs='" + Bukrs + "',WerksO='" + WerksO +
					"',IdSolicitacao=" + IdSolicitacao + ")";

				oModel.loadData(serviceUrl, null, false, "GET", false, false, null);
				Kostl = oModel.oData.d.Kostl;
			}

			this.getView().byId("IdIdSolicitacao").setValue(IdSolicitacao);
			this.getView().byId("IdWerks").setValue(WerksO);
			this.getView().byId("IdCarteira").setValue(Carteira);
			this.getView().byId("IdModalidade").setValue(Modalidade);
			this.getView().byId("IdPrioridade").setValue(Prioridade);
			this.getView().byId("IdFinalidade").setValue(Finalidade);
			this.getView().byId("IdGrpCompras").setValue(GrpCompras);
			this.getView().byId("IdDtInic").setValue(DtInic);
			this.getView().byId("IdStatus").setValue(Status);
			this.getView().byId("IdKostl").setValue(Kostl);

			this.getView().byId("IdIdSolicitacao").setEditable(false);
			this.getView().byId("IdWerks").setEditable(false);
			this.getView().byId("IdCarteira").setEditable(false);
			this.getView().byId("IdModalidade").setEditable(false);
			this.getView().byId("IdPrioridade").setEditable(false);
			this.getView().byId("IdFinalidade").setEditable(false);
			this.getView().byId("IdGrpCompras").setEditable(false);
			this.getView().byId("IdDtInic").setEditable(false);
			this.getView().byId("IdStatus").setEditable(false);
			this.getView().byId("IdKostl").setEditable(false);

			var smartTable = this.getView().byId("smartTable");
			smartTable.rebindTable("e");

			var Prioridade = this.getView().byId("IdPrioridade").getValue();

			if (Prioridade === "EMERGENCIAL") {
				this.getView().byId("Msg_Emergencial").setVisible(true);
			} else {
				this.getView().byId("Msg_Emergencial").setVisible(false);
			}
		},

		onBack: function () {
			this.getRouter().navTo("Back");
		},

		onSalvar: function () {
			var oView = this.getView();
			var oModel = this.getView().getModel();
			var dialog = "";
			var Bukrs = "2001";
			var WerksO = this.getView().byId("IdWerks").getValue();
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();
			var NrRequisicao = this.getView().byId("IdNrRequisicao").getValue();
			var NrItem = this.getView().byId("IdNrItem").getValue();
			var Key = "";
			var Erro = 0;
			var This = this;
			var Motivo = "";
			var mensagem = "Confirma a criação da solicitação?";
			var oEntry = {};
			var oEntryPedido = {};
			var KeyPedido = "/ZET_CBMM_CF_PEDIDOSet(Werkso='" + WerksO + "',IdSolicitacao=" + IdSolicitacao + ",NrRequisicao='" + NrRequisicao +
				"',NrItem='" + NrItem + "')";

			oEntry.Modalidade = this.getView().byId("IdModalidade").getValue();
			Key = "/ZET_CBMM_CF_FRETESet(Bukrs='" + Bukrs + "',WerksO='" + WerksO + "',IdSolicitacao=" + IdSolicitacao + ")";
			oEntry.Carteira = this.getView().byId("IdCarteira").getValue();
			oEntry.Prioridade = this.getView().byId("IdPrioridade").getValue();
			oEntry.Finalidade = this.getView().byId("IdFinalidade").getValue();
			oEntry.GrpCompras = this.getView().byId("IdGrpCompras").getValue();
			oEntry.DtInicOper = this.getView().byId("IdDtInic").getValue();
			oEntry.Status = "INIC";
			oEntry.Usuario = sap.ushell.Container.getUser().getId();
			oEntry.Emailsol = sap.ushell.Container.getUser().getEmail();
			oEntry.Kostl = this.getView().byId("IdKostl").getValue();

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

			if (oEntry.DtInicOper === "") {
				this.getView().byId("IdDtInic").setValueState("Error");
				sap.m.MessageBox.error("Data inicio da operação não informada!");
				return;
			}

			if (oEntry.Kostl === "") {
				this.getView().byId("IdKostl").setValueState("Error");
				sap.m.MessageBox.error("Centro de Custo não informado!");
				return;
			}

			if (oEntry.Modalidade === "PEDIDO DE COMPRAS") {
				oEntryPedido.Carteira = oEntry.Carteira;
				oEntryPedido.Prioridade = oEntry.Prioridade;
				oEntryPedido.Finalidade = oEntry.Finalidade;
				oEntryPedido.GrpCompras = oEntry.GrpCompras;
				oEntryPedido.Modalidade = oEntry.Modalidade;
				oEntryPedido.DtPedido = oEntry.DtInicOper;
				oEntryPedido.NrRequisicao = this.getView().byId("IdNrRequisicao").getValue();
				oEntryPedido.NrItem = this.getView().byId("IdNrItem").getValue();
				oEntryPedido.VlPedido = this.getView().byId("IdVlPedido").getValue();
				oEntryPedido.Fornecedor = this.getView().byId("IdFornecedor").getValue();
				oEntryPedido.Tipo = "G";
				oEntry.Observacao = this.getView().byId("IdObserv").getValue();

				if (oEntryPedido.NrRequisicao === "") {
					this.getView().byId("IdNrRequisicao").setValueState("Error");
					sap.m.MessageBox.error("Número da requisição não informada!");
					return;
				}

				if (oEntryPedido.NrItem === "") {
					this.getView().byId("IdNrItem").setValueState("Error");
					sap.m.MessageBox.error("Item da Requisição não informada!");
					return;
				}

				/*if (oEntryPedido.VlPedido === "") {
					this.getView().byId("IdVlPedido").setValueState("Error");
					sap.m.MessageBox.error("valor do pedido não informada!");
					return;
				}*/

				if (oEntryPedido.Fornecedor === "") {
					this.getView().byId("IdKostl").setValueState("Error");
					sap.m.MessageBox.error("Centro de Custo não informado!");
					return;
				}

				var sNrRequisicao = this.getView().byId("IdNrRequisicao").getValueState();
				var sNrItem = this.getView().byId("IdNrItem").getValueState();
				var sVlPedido = this.getView().byId("IdVlPedido").getValueState();
				var sFornecedor = this.getView().byId("IdKostl").getValueState();

				/*if (sNrRequisicao === "Error" || sNrItem === "Error" || sVlPedido === "Error" || sFornecedor === "Error"){
					sap.m.MessageBox.error("Existem informações incorretas, favor verificar!");
					return;
				}*/
			}

			var sWerks = this.getView().byId("IdWerks").getValueState();
			var sCarteira = this.getView().byId("IdCarteira").getValueState();
			var sModalidade = this.getView().byId("IdModalidade").getValueState();
			var sFinalidade = this.getView().byId("IdFinalidade").getValueState();
			var sGrpCompras = this.getView().byId("IdGrpCompras").getValueState();
			var sDtInic = this.getView().byId("IdDtInic").getValueState();
			var sKostl = this.getView().byId("IdKostl").getValueState();

			if (sWerks === "Error" || sCarteira === "Error" || sModalidade === "Error" || sFinalidade === "Error" || sGrpCompras === "Error" ||
				sDtInic === "Error" || sKostl === "Error") {
				sap.m.MessageBox.error("Existem informações incorretas, favor verificar!");
				return;
			}

			dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: mensagem
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(Key, oEntry, {
							success: function (oData, oResponse) {
								This.getView().byId("IdWerks").setEditable(false);
								This.getView().byId("IdCarteira").setEditable(false);
								This.getView().byId("IdPrioridade").setEditable(false);
								This.getView().byId("IdModalidade").setEditable(false);
								This.getView().byId("IdFinalidade").setEditable(false);
								This.getView().byId("IdGrpCompras").setEditable(false);
								This.getView().byId("IdDtInic").setEditable(false);
								This.getView().byId("IdKostl").setEditable(false);
								This.getView().byId("IdStatus").setValue("INIC");
								Erro = 0;
							},
							error: function (oError) {
								Erro = 1;
								Motivo = "Erro no serviço de Frete! - Contate a equipe de desenvolvimento";
							}
						});

						if (oEntry.Modalidade === "PEDIDO DE COMPRAS") {
							oModel.update(KeyPedido, oEntryPedido, {
								success: function (oData, oResponse) {
									Erro = 0;
								},
								error: function (oError) {
									Erro = 1;
									Motivo = "Erro no serviço de Pedido de compras! - Contate a equipe de desenvolvimento";
								}
							});

							This.getView().byId("IdNrRequisicao").setEditable(false);
							This.getView().byId("IdNrItem").setEditable(false);
							This.getView().byId("IdFornecedor").setEditable(false);
							This.getView().byId("IdObserv").setEditable(false);
						}

						if (Erro === 0) {
							This.getView().byId("B_Salvar").setType("Default");
							This.getView().byId("B_Incluir").setType("Reject");
							sap.m.MessageBox.success("Solicitação criada com sucesso!");
							//This.onBack();
						} else {
							sap.m.MessageBox.error(Motivo);
						}

						dialog.close();
					}
				}),
				endButton: new Button({
					text: "Não",
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.open();
		},

		onincluir: function () {
			var Bukrs = "2001";
			var Werks = this.getView().byId("IdWerks").getValue();
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();
			IdSolicitacao = parseInt(IdSolicitacao);

			var oModel = new sap.ui.model.json.JSONModel();
			var oInd = {};
			var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_FRETESet(Bukrs='" + Bukrs + "',WerksO='" + Werks +
				"',IdSolicitacao=" + IdSolicitacao + ")";

			oModel.loadData(serviceUrl, null, false, "GET", false, false, null);
			oInd = oModel.oData.d.Status;

			if (oInd !== "INIC") {
				sap.m.MessageBox.error("Salve a solicitação para incluir rotas.");
				return;
			}

			var Carteira = this.getView().byId("IdCarteira").getValue();
			var Modalidade = this.getView().byId("IdModalidade").getValue();
			var Prioridade = this.getView().byId("IdPrioridade").getValue();
			var Finalidade = this.getView().byId("IdFinalidade").getValue();
			var GrpCompras = this.getView().byId("IdGrpCompras").getValue();
			var DtInic = this.getView().byId("IdDtInic").getValue();
			var Kostl = this.getView().byId("IdKostl").getValue();

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
				DtInic: DtInic,
				Kostl: Kostl
			});
		},

		onincluirCopy: function () {

			var Bukrs = "2001";
			var Werks = this.getView().byId("IdWerks").getValue();
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();
			IdSolicitacao = parseInt(IdSolicitacao);
			var oListBase = this.getView().byId("smartTable").getTable();
			var items = oListBase._aSelectedPaths;
			var length = items.length;
			var oModel = new sap.ui.model.json.JSONModel();
			var oModelCopy = new sap.ui.model.json.JSONModel();
			var oInd = {};
			var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_FRETESet(Bukrs='" + Bukrs + "',WerksO='" + Werks +
				"',IdSolicitacao=" + IdSolicitacao + ")";
			var IdRota = "";
			var Carteira = this.getView().byId("IdCarteira").getValue();
			var Modalidade = this.getView().byId("IdModalidade").getValue();
			var Prioridade = this.getView().byId("IdPrioridade").getValue();
			var Finalidade = this.getView().byId("IdFinalidade").getValue();
			var GrpCompras = this.getView().byId("IdGrpCompras").getValue();
			var DtInic = this.getView().byId("IdDtInic").getValue();
			var Kostl = this.getView().byId("IdKostl").getValue();

			oModel.loadData(serviceUrl, null, false, "GET", false, false, null);
			oInd = oModel.oData.d.Status;

			if (oInd !== "INIC" && oInd !== "REPR") {
				sap.m.MessageBox.error("Não é possivel criar uma rota em uma solicitação liberada.");
				return;
			}

			if (length < 1) {
				sap.m.MessageBox.error("Selecione uma rota para criar cópia!");
				return;
			}

			if (length > 1) {
				sap.m.MessageBox.error("Selecione apenas uma rota para criar cópia!");
				return;
			}

			oModelCopy.loadData("/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV" + items, null, false, "GET", false, false, null);
			IdRota = oModelCopy.oData.d.IdRota;

			this.getRouter().navTo("Add_Rota_Copy", {
				Bukrs: Bukrs,
				Werks: Werks,
				IdSolicitacao: IdSolicitacao,
				IdRota: IdRota,
				Carteira: Carteira,
				Modalidade: Modalidade,
				Prioridade: Prioridade,
				Finalidade: Finalidade,
				GrpCompras: GrpCompras,
				DtInic: DtInic,
				Kostl: Kostl
			});

		},

		onChangeWerks: function () {

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

		onChangeCarteira: function () {
			var oModel = new sap.ui.model.json.JSONModel();
			var oInd = {};
			var Valor = this.getView().byId("IdCarteira").getValue();
			var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_PARAMETSet/$count?$filter=Valor eq '" + Valor + "'";

			oModel.loadData(serviceUrl, null, false, "GET", false, false, null);
			oInd = oModel.oData;

			if (oInd > 0) {
				this.getView().byId("IdCarteira").setValueState("None");
			} else {
				sap.m.MessageBox.error("Carteira inexistente");
				this.getView().byId("IdCarteira").setValueState("Error");
			}
		},

		onChangePrioridade: function () {
			var oModel = new sap.ui.model.json.JSONModel();
			var oInd = {};
			var Valor = this.getView().byId("IdPrioridade").getValue();
			var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_PARAMETSet/$count?$filter=Valor eq '" + Valor + "'";

			oModel.loadData(serviceUrl, null, false, "GET", false, false, null);
			oInd = oModel.oData;

			if (oInd > 0) {
				this.getView().byId("IdPrioridade").setValueState("None");
			} else {
				sap.m.MessageBox.error("Prioridade inexistente");
				this.getView().byId("IdPrioridade").setValueState("Error");
			}
		},

		onChangeModalidade: function () {
			var oModel = new sap.ui.model.json.JSONModel();
			var oInd = {};
			var Valor = this.getView().byId("IdModalidade").getValue();
			var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_PARAMETSet/$count?$filter=Valor eq '" + Valor + "'";

			oModel.loadData(serviceUrl, null, false, "GET", false, false, null);
			oInd = oModel.oData;

			if (Valor === "PEDIDO DE COMPRAS") {
				// Troca SmartTable
				this.getView().byId("IdFormPedido").setVisible(true);
				this.getView().byId("IdFormRota").setVisible(false);

				// Troca Botões
				this.getView().byId("B_Incluir").setVisible(false);
				this.getView().byId("B_Excluir").setVisible(false);

			} else {
				// Troca SmartTable
				this.getView().byId("IdFormPedido").setVisible(false);
				this.getView().byId("IdFormRota").setVisible(true);

				// Troca Botões
				this.getView().byId("B_Incluir").setVisible(true);
				this.getView().byId("B_Excluir").setVisible(true);
			}

			if (oInd > 0) {
				this.getView().byId("IdModalidade").setValueState("None");
			} else {
				sap.m.MessageBox.error("Modalidade inexistente");
				this.getView().byId("IdModalidade").setValueState("Error");
				return;
			}

			this.onChangeDtInic();
		},

		onChangeFinalidade: function () {
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

		onChangeGrpCompras: function () {
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

		onHelpWerks: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog1) {
				this._valueHelpDialog1 = sap.ui.xmlfragment("ZCBMM_SOLICITACAO_FRETE.ZCBMM_SOLICITACAO_FRETE.view.Werks", this);
				this.getView().addDependent(this._valueHelpDialog1);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog1.open(sInputValue);
		},

		onHelpKostl: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog0) {
				this._valueHelpDialog0 = sap.ui.xmlfragment("ZCBMM_SOLICITACAO_FRETE.ZCBMM_SOLICITACAO_FRETE.view.Kostl", this);
				this.getView().addDependent(this._valueHelpDialog0);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog0.open(sInputValue);
		},

		onHelpCarteira: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog2) {
				this._valueHelpDialog2 = sap.ui.xmlfragment("ZCBMM_SOLICITACAO_FRETE.ZCBMM_SOLICITACAO_FRETE.view.Carteira", this);
				this.getView().addDependent(this._valueHelpDialog2);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog2.open(sInputValue);
		},

		onHelpPrioridade: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog3) {
				this._valueHelpDialog3 = sap.ui.xmlfragment("ZCBMM_SOLICITACAO_FRETE.ZCBMM_SOLICITACAO_FRETE.view.Prioridade", this);
				this.getView().addDependent(this._valueHelpDialog3);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog3.open(sInputValue);
		},

		onHelpModalidade: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog4) {
				this._valueHelpDialog4 = sap.ui.xmlfragment("ZCBMM_SOLICITACAO_FRETE.ZCBMM_SOLICITACAO_FRETE.view.Modalidade", this);
				this.getView().addDependent(this._valueHelpDialog4);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog4.open(sInputValue);
		},

		onHelpFinalidade: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog5) {
				this._valueHelpDialog5 = sap.ui.xmlfragment("ZCBMM_SOLICITACAO_FRETE.ZCBMM_SOLICITACAO_FRETE.view.Finalidade", this);
				this.getView().addDependent(this._valueHelpDialog5);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog5.open(sInputValue);
		},

		onHelpGrupoDeCompras: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog6) {
				this._valueHelpDialog6 = sap.ui.xmlfragment("ZCBMM_SOLICITACAO_FRETE.ZCBMM_SOLICITACAO_FRETE.view.GrupoDeCompras", this);
				this.getView().addDependent(this._valueHelpDialog6);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog6.open(sInputValue);
		},

		_handleValueHelpClose: function (evt) {
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

		_handleValueHelpWerks: function (oEvent) {
			var sValue = oEvent.getParameter("value");

			if (!sValue) {
				sValue = " ";
			}

			var sFilter = sValue;
			var oFilter = new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpKostl: function (oEvent) {
			var sValue = oEvent.getParameter("value");

			if (!sValue) {
				sValue = " ";
			}
			var oFilter = new sap.ui.model.Filter("Kostl", sap.ui.model.FilterOperator.Contains, sValue);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		_onModelContextChangeCarteira: function (oEvent) {
			var Parametro = "CARTEIRA";

			var sFilter = Parametro;
			var oFilter = oFilter = new sap.ui.model.Filter("Parametro", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		_onModelContextChangePrioridade: function (oEvent) {
			var Parametro = "PRIORIDADE";

			var sFilter = Parametro;
			var oFilter = oFilter = new sap.ui.model.Filter("Parametro", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		_onModelContextChangeModalidade: function (oEvent) {
			var Parametro = "MODALIDADE";

			var sFilter = Parametro;
			var oFilter = oFilter = new sap.ui.model.Filter("Parametro", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		_onModelContextChangeFinalidade: function (oEvent) {
			var Parametro = "FINALIDADE";

			var sFilter = Parametro;
			var oFilter = oFilter = new sap.ui.model.Filter("Parametro", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		_onModelContextChangeGrpCompras: function (oEvent) {
			var Parametro = "GRP COMPRAS";

			var sFilter = Parametro;
			var oFilter = oFilter = new sap.ui.model.Filter("Parametro", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		_Confirme_werks: function (evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			this._valueHelpDialog5 = null;

			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
			}

			this.getView().byId("IdWerks").setValueState("None");
		},

		_Confirme_Kostl: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			this._valueHelpDialog5 = null;

			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
			}

			this.getView().byId("IdKostl").setValueState("None");
		},

		onConfirmModalidade: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			this._valueHelpDialog5 = null;

			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
			}

			this.onChangeModalidade();
		},

		onExclui: function () {

			var Status = this.getView().byId("IdStatus").getValue();

			if (Status !== "INIC") {

				if (Status === "") {
					sap.m.MessageBox.error("Solicitação não existente!");
					return;
				} else {
					sap.m.MessageBox.error("Não é possivel excluir rota de uma solicitação liberada!");
					return;
				}

			}
			var oModel = this.getView().getModel();
			var oListBase = this.getView().byId("smartTable").getTable();
			var items = oListBase._aSelectedPaths;
			var length = items.length;
			var oTable = this.byId("smartTable");
			var erro = 0;

			var dialog = new Dialog({
				title: 'Confirmação',
				type: 'Message',
				content: new Text({
					text: 'Confirma Exclusão dos Registros Selecionados?'
				}),
				beginButton: new Button({
					text: 'Confirma',
					press: function () {

						//Função para Excluir registros
						for (var i = 0; i < length; i++) {
							var oEntry = oListBase._aSelectedPaths[i];
							oModel.remove(oEntry, {
								method: "DELETE",
								success: function (data) {
									erro = 0;
								},
								error: function (e) {
									erro = 1;
								}
							});
						}
						dialog.close();
						oTable.getBinding("items").refresh();

						if (erro === 0) {
							sap.m.MessageBox.success("Registros Excluidos Corretamente!");
						} else {
							sap.m.MessageBox.error("Registros não foram excluidos - Erro ao chamar o serviço!");
						}
					}
				}),
				endButton: new Button({
					text: 'Cancelar',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();

				}
			});
			dialog.open();
		},

		onChangeRequisicao: function () {
			var IdNrRequisicao = this.getView().byId("IdNrRequisicao").getValue();
			var IdNrItem = this.getView().byId("IdNrItem").getValue();
			var WerksO = this.getView().byId("IdWerks").getValue();
			var oModel = new sap.ui.model.json.JSONModel();
			var oInd = {};

			if (IdNrRequisicao === "" || IdNrItem === "") {
				this.getView().byId("IdNrRequisicao").setValueState("None");
				this.getView().byId("IdNrItem").setValueState("None");
				return;
			}

			var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_EBANSet(Banfn='" + IdNrRequisicao + "',Bnfpo='" +
				IdNrItem + "')";

			oModel.loadData(serviceUrl, null, false, "GET", false, false, null);
			var Frgkz = oModel.oData.d.Frgkz;
			var Werks = oModel.oData.d.Werks;
			var Rlwrt = oModel.oData.d.Rlwrt;

			// Inicio - Validar Centro em branco
			if (Werks === "") {
				this.getView().byId("IdNrRequisicao").setValueState("Error");
				this.getView().byId("IdNrItem").setValueState("Error");
				sap.m.MessageBox.error("Requisição informada não existe.");
				return;
			} else {
				this.getView().byId("IdNrRequisicao").setValueState("None");
				this.getView().byId("IdNrItem").setValueState("None");
			}
			// Fim - Validar Centro em branco

			// Inicio - Validar Liberação
			if (Frgkz !== "L") {
				sap.m.MessageBox.error("Requisição informada não está liberada.");
				this.getView().byId("IdNrRequisicao").setValueState("Error");
				this.getView().byId("IdNrItem").setValueState("Error");
				return;
			} else {
				this.getView().byId("IdNrRequisicao").setValueState("None");
				this.getView().byId("IdNrItem").setValueState("None");
			}
			// Fim - Validar Liberação

			if (WerksO !== Werks) {
				sap.m.MessageBox.error("Centro da requisição diferente do centro da solicitação.");
				this.getView().byId("IdNrRequisicao").setValueState("Error");
				this.getView().byId("IdNrItem").setValueState("Error");
				return;
			} else {
				this.getView().byId("IdNrRequisicao").setValueState("None");
				this.getView().byId("IdNrItem").setValueState("None");
			}

			this.getView().ById("IdVlPedido").setValue(Rlwrt);

		},

		onChangeItem: function () {
			var IdNrRequisicao = this.getView().byId("IdNrRequisicao").getValue();
			var IdNrItem = this.getView().byId("IdNrItem").getValue();
			var WerksO = this.getView().byId("IdWerks").getValue();
			var oModel = new sap.ui.model.json.JSONModel();
			var oInd = {};

			if (IdNrRequisicao === "" || IdNrItem === "") {
				this.getView().byId("IdNrRequisicao").setValueState("None");
				this.getView().byId("IdNrItem").setValueState("None");
				return;
			}

			var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_EBANSet(Banfn='" + IdNrRequisicao + "',Bnfpo='" +
				IdNrItem + "')";

			oModel.loadData(serviceUrl, null, false, "GET", false, false, null);
			var Frgkz = oModel.oData.d.Frgkz;
			var Werks = oModel.oData.d.Werks;
			var Rlwrt = oModel.oData.d.Rlwrt;

			// Inicio - Validar Centro em branco
			if (Werks === "") {
				this.getView().byId("IdNrRequisicao").setValueState("Error");
				this.getView().byId("IdNrItem").setValueState("Error");
				sap.m.MessageBox.error("Requisição informada não existe.");
				return;
			} else {
				this.getView().byId("IdNrRequisicao").setValueState("None");
				this.getView().byId("IdNrItem").setValueState("None");
			}
			// Fim - Validar Centro em branco

			// Inicio - Validar Liberação
			if (Frgkz !== "L") {
				sap.m.MessageBox.error("Requisição informada não está liberada.");
				this.getView().byId("IdNrRequisicao").setValueState("Error");
				this.getView().byId("IdNrItem").setValueState("Error");
				return;
			} else {
				this.getView().byId("IdNrRequisicao").setValueState("None");
				this.getView().byId("IdNrItem").setValueState("None");
			}
			// Fim - Validar Liberação

			if (WerksO !== Werks) {
				sap.m.MessageBox.error("Centro da requisição diferente do centro da solicitação.");
				this.getView().byId("IdNrRequisicao").setValueState("Error");
				this.getView().byId("IdNrItem").setValueState("Error");
				return;
			} else {
				this.getView().byId("IdNrRequisicao").setValueState("None");
				this.getView().byId("IdNrItem").setValueState("None");
			}

			this.getView().byId("IdVlPedido").setValue(Rlwrt);
		},

		onPress: function (oEvent) {
			this._showObject(oEvent.getSource());
		},

		_showObject: function (oItem) {
			var Bukrs = "2001";
			var WerksO = oItem.getBindingContext().getProperty("WerksO");
			var IdSolicitacao = oItem.getBindingContext().getProperty("IdSolicitacao");
			var IdRota = oItem.getBindingContext().getProperty("IdRota");
			var Carteira = this.getView().byId("IdCarteira").getValue();
			var Modalidade = this.getView().byId("IdModalidade").getValue();
			var Prioridade = this.getView().byId("IdPrioridade").getValue();
			var Finalidade = this.getView().byId("IdFinalidade").getValue();
			var GrpCompras = this.getView().byId("IdGrpCompras").getValue();
			var DtInic = this.getView().byId("IdDtInic").getValue();
			var Status = this.getView().byId("IdStatus").getValue();

			if (Status === "" || Status === undefined) {
				Status = "INIC";
			}

			this.getRouter().navTo("objectRota1", {
				Bukrs: Bukrs,
				WerksO: WerksO,
				IdSolicitacao: IdSolicitacao,
				IdRota: IdRota,
				Carteira: Carteira,
				Modalidade: Modalidade,
				Prioridade: Prioridade,
				Finalidade: Finalidade,
				GrpCompras: GrpCompras,
				DtInic: DtInic,
				Status: Status
			});
		},

		onChangeDtInic: function () {
			var oModel10 = new sap.ui.model.json.JSONModel();
			var Parametro = this.getView().byId("IdModalidade").getValue();

			var oInd = {};
			var Valor = "x";
			// buscar data do campo data inicial
			var data = this.getView().byId("IdDtInic").getValue();
			var dia = data.substring(8, 10);
			dia = parseInt(dia) + 1;
			if (dia < 10) {
				dia = dia.toString();
				dia = "0" + dia;
			}
			if (dia > 31) {
				dia = 31;
			}

			var dtini = data.substring(0, 4) + "-" + data.substring(5, 7) + "-" + dia;
			var dtfim = new Date(dtini + "T03:00:01.000Z");
			// buscar data do campo data inicial

			// buscar o dia de hoje
			var date = new Date();
			// buscar o dia de hoje

			// Verificar diferença
			var diferença = Math.abs(dtfim.getTime() - date.getTime());
			var emdias = Math.ceil(diferença / (1000 * 3600 * 24));
			emdias = parseInt(emdias);
			// Verificar diferença

			// if (dtfim < date) {
			// 	this.getView().byId("IdDtInic").setValueState("Error");
			// 	sap.m.MessageBox.error("Data de inicio não poderá ser menor do que hoje!");
			// 	return;
			// } else {
			// 	this.getView().byId("IdDtInic").setValueState("None");
			// }

			var sService = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_PARAMETSet(Parametro='" + Parametro + "',Valor='" +
				Valor + "')";
			oModel10.loadData(sService, null, false, "GET", false, false, null);
			oInd = oModel10.oData.d.Valor;
			oInd = parseInt(oInd);

			if (emdias < oInd) {
				if (Parametro === "CONTRATOS") {
					sap.m.MessageBox.error("Prazo fora da política de contratações logística, favor revisar. Prazo mínimo para contratos " + oInd +
						" dias!");
					this.getView().byId("IdDtInic").setValueState("Error");
					return;
				}
				this.getView().byId("IdPrioridade").setValue("EMERGENCIAL");
				this.getView().byId("Msg_Emergencial").setVisible(true);
			} else {
				this.getView().byId("IdPrioridade").setValue("NORMAL");
				this.getView().byId("Msg_Emergencial").setVisible(false);
			}
			if (data === "") {
				this.getView().byId("IdDtInic").setValueState("Error");
				return;
			} else {
				this.getView().byId("IdDtInic").setValueState("None");
			}

		},
		onLibera: function () {
			var oModel = this.getView().getModel();
			oModel.setUseBatch(false);
			var dialog = "";
			var Bukrs = "2001";
			var WerksO = this.getView().byId("IdWerks").getValue();
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();
			var NrRequisicao = this.getView().byId("IdNrRequisicao").getValue();
			var NrItem = this.getView().byId("IdNrItem").getValue();
			var Status = this.getView().byId("IdStatus").getValue();
			var Erro = 0;
			var This = this;
			var Motivo = "";
			var Key = "";
			var oEntry = {};
			var oInd = {};
			Key = "/ZET_CBMM_CF_FRETESet(Bukrs='" + Bukrs + "',WerksO='" + WerksO + "',IdSolicitacao=" + IdSolicitacao + ")";
			oEntry.Modalidade = this.getView().byId("IdModalidade").getValue();
			oEntry.Carteira = this.getView().byId("IdCarteira").getValue();
			oEntry.Prioridade = this.getView().byId("IdPrioridade").getValue();
			oEntry.Finalidade = this.getView().byId("IdFinalidade").getValue();
			oEntry.GrpCompras = this.getView().byId("IdGrpCompras").getValue();
			oEntry.DtInicOper = this.getView().byId("IdDtInic").getValue();

			var oModel10 = new sap.ui.model.json.JSONModel();
			var sService = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_ROTASet/$count?$filter=IdSolicitacao eq " +
				IdSolicitacao + "";
			oModel10.loadData(sService, null, false, "GET", false, false, null);
			oInd = oModel10.oData;

			if (Status !== "INIC" && Status !== "REPR") {
				if (Status === "") {
					sap.m.MessageBox.error("Salve as informações para enviar para aprovação!");
					return;
				} else {
					sap.m.MessageBox.error("O Processo já foi liberado!");
					return;
				}
			}

			if (oEntry.Modalidade !== "PEDIDO DE COMPRAS") {
				if (oInd === 0) {
					sap.m.MessageBox.error("Não existem rotas cadastradas.");
					return;
				}
			}

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

			if (oEntry.DtInicOper === "") {
				this.getView().byId("IdDtInic").setValueState("Error");
				sap.m.MessageBox.error("Data inicio da operação não informada!");
				return;
			}

			var This = this;

			if (oEntry.Modalidade === "PEDIDO DE COMPRAS") {
				var oEntryPedido = {};
				var KeyPedido = "/ZET_CBMM_CF_PEDIDOSet(Werkso='" + WerksO + "',IdSolicitacao=" + IdSolicitacao + ",NrRequisicao='" + NrRequisicao +
					"',NrItem='" + NrItem + "')";
				oEntryPedido.Carteira = oEntry.Carteira;
				oEntryPedido.Prioridade = oEntry.Prioridade;
				oEntryPedido.Finalidade = oEntry.Finalidade;
				oEntryPedido.GrpCompras = oEntry.GrpCompras;
				oEntryPedido.Modalidade = oEntry.Modalidade;
				oEntryPedido.DtPedido = oEntry.DtInicOper;
				oEntryPedido.NrRequisicao = this.getView().byId("IdNrRequisicao").getValue();
				oEntryPedido.NrItem = this.getView().byId("IdNrItem").getValue();
				oEntryPedido.VlPedido = this.getView().byId("IdVlPedido").getValue();
				oEntryPedido.Fornecedor = this.getView().byId("IdFornecedor").getValue();

				if (oEntryPedido.NrRequisicao === "") {
					this.getView().byId("IdNrRequisicao").setValueState("Error");
					sap.m.MessageBox.error("Número da requisição não informada!");
					return;
				}

				if (oEntryPedido.NrItem === "") {
					this.getView().byId("IdNrItem").setValueState("Error");
					sap.m.MessageBox.error("Item da Requisição não informada!");
					return;
				}

				if (oEntryPedido.VlPedido === "") {
					this.getView().byId("IdVlPedido").setValueState("Error");
					sap.m.MessageBox.error("valor do pedido não informada!");
					return;
				}

				if (oEntryPedido.Fornecedor === "") {
					this.getView().byId("IdFornecedor").setValueState("Error");
					sap.m.MessageBox.error("Fornecedor não informado!");
					return;
				}
			}

			var oModel10 = new sap.ui.model.json.JSONModel();
			var Parametro = oEntry.Modalidade;
			var oInd = {};
			var Valor = "x";
			var sService = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_PARAMETSet(Parametro='" + Parametro + "',Valor='" +
				Valor + "')";
			oModel10.loadData(sService, null, false, "GET", false, false, null);
			oInd = oModel10.oData.d.Valor;
			oInd = parseInt(oInd);

			var mensagem = "";

			if (oEntry.Prioridade !== "EMERGENCIAL") {
				mensagem = "Confirma a liberação da solicitação?";
				oEntry.Status = "AVSO";
			} else {
				mensagem = "A solicitação não atende o SLA. Será necessario aprovação emergencial, deseja continuar?";
				oEntry.Status = "APEM";
			}

			var oModel11 = new sap.ui.model.json.JSONModel();
			var sService10 = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_UPLOADSet(WerksO = '" + WerksO + "',Bukrs = '" +
				Bukrs +
				"',IdSolicitacao = '" + IdSolicitacao + "',IdRota = 'x',DocId = 'x')";
			oModel11.loadData(sService10, null, false, "GET", false, false, null);

			dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: mensagem
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(Key, oEntry, {
							success: function (oData, oResponse) {
								This.getView().byId("IdWerks").setEditable(false);
								This.getView().byId("IdCarteira").setEditable(false);
								This.getView().byId("IdPrioridade").setEditable(false);
								This.getView().byId("IdModalidade").setEditable(false);
								This.getView().byId("IdFinalidade").setEditable(false);
								This.getView().byId("IdGrpCompras").setEditable(false);
								This.getView().byId("IdDtInic").setEditable(false);

								if (oEntryPedido === "PEDIDO DE COMPRAS") {
									oModel.update(KeyPedido, oEntryPedido, {
										success: function (oData, oResponse) {
											sap.m.MessageBox.success("Solicitação Alterada com sucesso!", {
												actions: ["OK", sap.m.MessageBox.Action.CLOSE],
												onClose: function (sAction) {
													This.getRouter().navTo("Back");
												}
											});
										},
										error: function (oError) {
											sap.m.MessageBox.error("Erro ao chamar o serviço");
										}
									});
								}

								if (oEntry.Prioridade === "EMERGENCIAL") {
									// Buscar email do aprovador da carteira.
									var oModel10 = new sap.ui.model.json.JSONModel();
									var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_APROVSet(Carteira='" + oEntry.Carteira +
										"')";
									oModel10.loadData(serviceUrl, null, false, "GET", false, false, null);
									var email = oModel10.oData.d.Email;

									var oEntrymail = {};
									var keymail = "/ZET_CBMM_CF_EMAILSet(Titulo='A%20solicitacao%20" + IdSolicitacao +
										"%20cadastrada%20como%20emergencial.')";
									oEntrymail.Destinatario = email;
									oEntrymail.Corpo = "Solicitação Emergencial " + IdSolicitacao + " enviada para aprovação.";
									oModel.update(keymail, oEntrymail, {
										success: function (oData, oResponse) {
											Erro = 0;
										},
										error: function (oError) {
											Erro = 1;
											Motivo = "Erro no serviço de envio de Email! - Contate a equipe de desenvolvimento";
										}
									});
								}

								if (oEntry.Prioridade === "NORMAL") {

									// Buscar email do aprovador da carteira.
									var oModel10 = new sap.ui.model.json.JSONModel();
									var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_EKGRPSet(Ekgrp='" + oEntry.GrpCompras +
										"')";
									oModel10.loadData(serviceUrl, null, false, "GET", false, false, null);
									var email = oModel10.oData.d.Email;

									var oEntrymail = {};
									var keymail = "/ZET_CBMM_CF_EMAILSet(Titulo='A%20solicitacao%20" + IdSolicitacao +
										"%20cadastrada.')";
									oEntrymail.Destinatario = email;
									oEntrymail.Corpo = "A Solicitação " + IdSolicitacao + " enviada para sua aprovação.";
									oModel.update(keymail, oEntrymail, {
										success: function (oData, oResponse) {
											Erro = 0;
										},
										error: function (oError) {
											Erro = 1;
											Motivo = "Erro no serviço de envio de Email! - Contate a equipe de desenvolvimento";
										}
									});
								}

								if (Erro === 0) {
									This.getView().byId("B_Salvar").setType("Default");
									This.getView().byId("B_Incluir").setType("Reject");
									sap.m.MessageBox.success("Solicitação criada com sucesso!");
									This.getRouter().navTo("Back");
								} else {
									sap.m.MessageBox.error(Motivo);
								}

							},
							error: function (oError) {
								sap.m.MessageBox.error("Erro ao chamar o serviço");
							}
						});
						dialog.close();
					}
				}),
				endButton: new Button({
					text: "Não",
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.open();
		}
	});

});