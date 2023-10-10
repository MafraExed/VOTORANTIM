/*global location*/
sap.ui.define([
	"ZCBMM_AVLSOLIC/ZCBMM_AVLSOLIC/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/m/Text',
	"ZCBMM_AVLSOLIC/ZCBMM_AVLSOLIC/model/formatter"
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

	return BaseController.extend("ZCBMM_AVLSOLIC.ZCBMM_AVLSOLIC.controller.Object", {

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
			var Prioridade = oEvent.getParameter("arguments").Prioridade;

			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("ZET_CBMM_CF_FRETESet", {
					Bukrs: "2001",
					IdSolicitacao: IdSolicitacao,
					WerksO: WerksO,
					Prioridade: Prioridade

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

			var IdModalidade = this.getView().byId("IdModalidade").getValue();

			if (IdModalidade !== "PEDIDO DE COMPRAS") {

				var smartTable = this.getView().byId("smartTable");
				smartTable.rebindTable("e");
				this.getView().byId("IdFormPedido").setVisible(false);
				this.getView().byId("FormSmart").setVisible(true);
				this.getView().byId("B_Editar").setVisible(false);

			} else {
				this.getView().byId("IdFormPedido").setVisible(true);
				this.getView().byId("FormSmart").setVisible(false);

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
				this.getView().byId("B_Editar").setVisible(true);
				this.getView().byId("IdPedido").setValue(Pedido);

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
			var DtInic = this.getView().byId("IdDtInicOper").getValue();

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
				DtInic: DtInic
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
			});
		},

		onExclui: function() {
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

		onEdit: function() {
			this.getView().byId("IdVlPedido").setEditable(true);
			this.getView().byId("B_Salvar").setVisible(true);
			this.getView().byId("B_Cancelar").setVisible(true);
			this.getView().byId("B_Voltar").setVisible(false);
			this.getView().byId("B_Editar").setVisible(false);
		},

		onSave: function() {
			var that = this;
			var oModel = this.getView().getModel();
			var VlPedido = this.getView().byId("IdVlPedido").getValue();
			var WerksO = this.getView().byId("IdWerks").getValue();
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();
			var NrRequisicao = this.getView().byId("IdNrRequisicao").getValue();
			var NrItem = this.getView().byId("IdNrItem").getValue();
			var Key = "/ZET_CBMM_CF_PEDIDOSet(Werkso='" + WerksO + "',IdSolicitacao=" + IdSolicitacao + ",NrRequisicao='" + NrRequisicao +
				"',NrItem='" + NrItem + "')";
			var oEntry = {};
				oEntry.VlPedido = VlPedido;
				
			oModel.update(Key, oEntry, {
				success: function(oData, oResponse) {
					sap.m.MessageBox.success("O valor " + VlPedido + " foi gravado na solicitação " + IdSolicitacao + ".", {
						actions: ["OK", sap.m.MessageBox.Action.CLOSE],
						onClose: function(sAction) {
							that.getView().byId("IdVlPedido").setEditable(false);
							that.getView().byId("B_Salvar").setVisible(false);
							that.getView().byId("B_Cancelar").setVisible(false);
							that.getView().byId("B_Voltar").setVisible(true);
							that.getView().byId("B_Editar").setVisible(true	);
						}
					});
				},
				error: function(oError) {
					sap.m.MessageBox.error("Erro ao chamar o serviço");
				}
			});
		},
		
		onCancel: function(){
			this.getView().byId("IdVlPedido").setEditable(false);
			this.getView().byId("B_Salvar").setVisible(false);
			this.getView().byId("B_Cancelar").setVisible(false);
			this.getView().byId("B_Voltar").setVisible(true);
			this.getView().byId("B_Editar").setVisible(true	);
		}
	});

});