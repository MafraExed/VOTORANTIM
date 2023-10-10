/*global location*/
sap.ui.define([
	"ZCBMM_SOLICITACAO_FRETE/ZCBMM_SOLICITACAO_FRETE/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/m/Text',
	"ZCBMM_SOLICITACAO_FRETE/ZCBMM_SOLICITACAO_FRETE/model/formatter"
], function(
	BaseController,
	JSONModel,
	History,
	Dialog,
	Button,
	Text,
	formatter
) {
	"use strict";

	return BaseController.extend("ZCBMM_SOLICITACAO_FRETE.ZCBMM_SOLICITACAO_FRETE.controller.Object", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			this.getRouter().getRoute("BackObjectRota").attachPatternMatched(this._AtualizaTabela, this);
			this.getRouter().getRoute("BackSol").attachPatternMatched(this._AtualizaTabela, this);
			this.getRouter().getRoute("BackObject").attachPatternMatched(this._AtualizaTabela, this);

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function() {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});
		},

		_AtualizaTabela: function() {
			var smartTable = this.getView().byId("smartTable");
			smartTable.rebindTable("e");

			var Prioridade = this.getView().byId("IdPrioridade").getValue();

			if (Prioridade === "EMERGENCIAL") {
				this.getView().byId("Msg_Emergencial").setVisible(true);
			} else {
				this.getView().byId("Msg_Emergencial").setVisible(false);
			}
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function() {
			var oViewModel = this.getModel("objectView"),
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

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function(oEvent) {
			var IdSolicitacao = oEvent.getParameter("arguments").IdSolicitacao;
			var WerksO = oEvent.getParameter("arguments").WerksO;

			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("ZET_CBMM_CF_FRETESet", {
					Bukrs: "2001",
					IdSolicitacao: IdSolicitacao,
					WerksO: WerksO
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView: function(sObjectPath) {
			var oViewModel = this.getModel("objectView"),
				oDataModel = this.getModel();

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oDataModel.metadataLoaded().then(function() {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
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
				oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.IdSolicitacao,
				sObjectName = oObject.Finalidade;

			oViewModel.setProperty("/busy", false);
			// Add the object page to the flp routing history
			this.addHistoryEntry({
				title: this.getResourceBundle().getText("objectTitle") + " - " + sObjectName,
				icon: "sap-icon://enter-more",
				intent: "#SolicitaçãodeFrete-display&/ZET_CBMM_CF_FRETESet/" + sObjectId
			});

			oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("saveAsTileTitle", [sObjectName]));
			oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));

			var smartTable = this.getView().byId("smartTable");
			smartTable.rebindTable("e");

			var Valor = this.getView().byId("IdModalidade").getValue();

			if (Valor === "PEDIDO DE COMPRAS") {
				// Troca SmartTable
				this.getView().byId("IdFormPedido").setVisible(true);
				this.getView().byId("IdFormRota").setVisible(false);
				this.getView().byId("B_EditP").setVisible(true);

				// Troca Botões
				this.getView().byId("B_Incluir").setVisible(false);
				this.getView().byId("B_Excluir").setVisible(false);

				var oModel10 = new sap.ui.model.json.JSONModel();
				var Werkso = this.getView().byId("IdWerks").getValue();
				var IdIdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();
				IdIdSolicitacao = parseInt(IdIdSolicitacao);
				var sService = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_PEDIDOSet(Werkso='" + Werkso + "',IdSolicitacao=" +
					IdIdSolicitacao + ",NrItem='-',NrRequisicao='-')";
				oModel10.loadData(sService, null, false, "GET", false, false, null);
				var NRReq = oModel10.oData.d.NrRequisicao;
				var NrItem = oModel10.oData.d.NrItem;
				var Fornecedor = oModel10.oData.d.Fornecedor;
				var VlPedido = oModel10.oData.d.VlPedido;
				var Pedido = oModel10.oData.d.Pedido;

				this.getView().byId("IdNrRequisicao").setValue(NRReq);
				this.getView().byId("IdNrItem").setValue(NrItem);
				this.getView().byId("IdFornecedor").setValue(Fornecedor);
				this.getView().byId("IdVlPedido").setValue(VlPedido);
				this.getView().byId("IdPedido").setValue(Pedido);

			} else {
				// Troca SmartTable
				this.getView().byId("IdFormPedido").setVisible(false);
				this.getView().byId("IdFormRota").setVisible(true);

				// Troca Botões
				this.getView().byId("B_Incluir").setVisible(true);
				this.getView().byId("B_Excluir").setVisible(true);
			}

			var Prioridade = this.getView().byId("IdPrioridade").getValue();

			if (Prioridade === "EMERGENCIAL") {
				this.getView().byId("Msg_Emergencial").setVisible(true);
			} else {
				this.getView().byId("Msg_Emergencial").setVisible(false);
			}

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
			var Status = this.getView().byId("IdStatus").getValue();
			var Kostl = this.getView().byId("IdKostl").getValue();

			if (Status !== "INIC" && Status !== "REPR") {
				sap.m.MessageBox.error("Não é possivel a inclusão de rotas em solicitações liberadas!");
				return;
			}

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

			this.getRouter().navTo("Detail_Rota", {
				Bukrs: Bukrs,
				Werks: Werks,
				IdSolicitacao: IdSolicitacao,
				Carteira: Carteira,
				Modalidade: Modalidade,
				Prioridade: Prioridade,
				Finalidade: Finalidade,
				GrpCompras: GrpCompras,
				DtInic: DtInic,
				Status: Status,
				Kostl: Kostl
			});
		},

		onBack: function() {
			this.getRouter().navTo("Back");
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
			var Parametro = "GrpCompras";

			var sFilter = Parametro;
			var oFilter = oFilter = new sap.ui.model.Filter("Parametro", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		onPress: function(oEvent) {
			this._showObject(oEvent.getSource());
		},

		_showObject: function(oItem) {
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

			var aDtInic = DtInic.split("/");
			
			this.getRouter().navTo("objectRota", {
				Bukrs: Bukrs,
				WerksO: WerksO,
				IdSolicitacao: IdSolicitacao,
				IdRota: IdRota,
				Carteira: Carteira,
				Modalidade: Modalidade,
				Prioridade: Prioridade,
				Finalidade: Finalidade,
				GrpCompras: GrpCompras,
				DtInic: aDtInic[2] + "-" + aDtInic[1] + "-" + aDtInic[0],
				Status: Status
			});
		},
		
		onLibera: function() {

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
			var sService = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_ROTASet/$count?$filter=IdSolicitacao eq " + IdSolicitacao + "";
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

			// var oModel11 = new sap.ui.model.json.JSONModel();
			
			// var sService10 = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_UPLOADSet(WerksO='" + WerksO + "',Bukrs='" +
			// 	Bukrs +	"',IdSolicitacao=" + IdSolicitacao + ",IdRota='x',DocId='x')";
				
			// oModel11.loadData(sService10, null, false, "GET", false, false, null);

			dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: mensagem
				}),
				beginButton: new Button({
					text: "Sim",
					press: function() {
						oModel.update(Key, oEntry, {
							success: function(oData, oResponse) {
								This.getView().byId("IdWerks").setEditable(false);
								This.getView().byId("IdCarteira").setEditable(false);
								This.getView().byId("IdPrioridade").setEditable(false);
								This.getView().byId("IdModalidade").setEditable(false);
								This.getView().byId("IdFinalidade").setEditable(false);
								This.getView().byId("IdGrpCompras").setEditable(false);
								This.getView().byId("IdDtInic").setEditable(false);

								if (oEntryPedido === "PEDIDO DE COMPRAS") {
									oModel.update(KeyPedido, oEntryPedido, {
										success: function(oData, oResponse) {
											sap.m.MessageBox.success("Solicitação Alterada com sucesso!", {
												actions: ["OK", sap.m.MessageBox.Action.CLOSE],
												onClose: function(sAction) {
													This.getRouter().navTo("Back");
												}
											});
										},
										error: function(oError) {
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
										success: function(oData, oResponse) {
											Erro = 0;
										},
										error: function(oError) {
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
										success: function(oData, oResponse) {
											Erro = 0;
										},
										error: function(oError) {
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

		onExclui: function() {
			var Status = this.getView().byId("IdStatus").getValue();

			if (Status !== "INIC" && Status !== "REPR") {

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

			var dialog = new Dialog({
				title: 'Confirmação',
				type: 'Message',
				content: new Text({
					text: 'Confirma Exclusão dos Registros Selecionados?'
				}),
				beginButton: new Button({
					text: 'Confirma',
					press: function() {

						//Função para Excluir registros
						for (var i = 0; i < length; i++) {
							var oEntry = oListBase._aSelectedPaths[i];
							oModel.remove(oEntry, {
								method: "DELETE",
								success: function(data) {
									sap.m.MessageBox.success("Registros Excluidos Corretamente!");
								},
								error: function(e) {
									sap.m.MessageBox.error("Registros não foram excluidos - Erro ao chamar o serviço!");
								}
							});
						}

						dialog.close();
						var oTable = this.byId("smartTable");
						oTable.getBinding("items").refresh();
					}
				}),
				endButton: new Button({
					text: 'Cancelar',
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
		
		onincluirCopy: function() {
			
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
			Werks = oModelCopy.oData.d.WerksO;
			
			
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
		
		onEditaP: function(){
			var IdStatus = this.getView().byId("IdStatus").getValue();
			
			if (IdStatus !== "REPR"){
				sap.m.MessageBox.error("Status não permite edição!");
				return;
			}
			this.getView().byId("IdNrRequisicao").setEditable(true);
			this.getView().byId("IdNrItem").setEditable(true);
			this.getView().byId("IdFornecedor").setEditable(true);
			this.getView().byId("IdVlPedido").setEditable(true);
			this.getView().byId("IdObserv").setEditable(true);
		},
		
		onSalvar: function() {
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
					press: function() {
						oModel.update(Key, oEntry, {
							success: function(oData, oResponse) {
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
							error: function(oError) {
								Erro = 1;
								Motivo = "Erro no serviço de Frete! - Contate a equipe de desenvolvimento";
							}
						});

						if (oEntry.Modalidade === "PEDIDO DE COMPRAS") {
							oModel.update(KeyPedido, oEntryPedido, {
								success: function(oData, oResponse) {
									Erro = 0;
								},
								error: function(oError) {
									Erro = 1;
									Motivo = "Erro no serviço de Pedido de compras! - Contate a equipe de desenvolvimento";
								}
							});

							This.getView().byId("IdNrRequisicao").setEditable(false);
							This.getView().byId("IdNrItem").setEditable(false);
							This.getView().byId("IdFornecedor").setEditable(false);
							This.getView().byId("IdObserv").setEditable(false);
							This.getView().byId("IdVlPedido").setEditable(false);
						}

						if (Erro === 0) {
							This.getView().byId("B_Salvar").setType("Default");
							This.getView().byId("B_Incluir").setType("Reject");
							sap.m.MessageBox.success("Solicitação alterada com sucesso!");
							//This.onBack();
						} else {
							sap.m.MessageBox.error(Motivo);
						}

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
		}
	});

});