sap.ui.define([
	"ZCBMM_AVLSOLIC/ZCBMM_AVLSOLIC/controller/BaseController",
	"sap/m/Dialog",
	"sap/ui/model/json/JSONModel",
	"sap/m/Button",
	"sap/m/Text"
], function(BaseController, Dialog, JSONModel, Button, Text) {
	"use strict";

	return BaseController.extend("ZCBMM_AVLSOLIC.ZCBMM_AVLSOLIC.controller.objectRota", {

		onInit: function() {

			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});
			this.getRouter().getRoute("objectRota").attachPatternMatched(this._onObjectMatched, this);

			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectRotaView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function() {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});
		},

		_onObjectMatched: function(oEvent) {
			var IdSolicitacao = oEvent.getParameter("arguments").IdSolicitacao;
			var WerksO = oEvent.getParameter("arguments").WerksO;
			var IdRota = oEvent.getParameter("arguments").IdRota;
			var Carteira = oEvent.getParameter("arguments").Carteira;
			var Modalidade = oEvent.getParameter("arguments").Modalidade;
			var Prioridade = oEvent.getParameter("arguments").Prioridade;
			var Finalidade = oEvent.getParameter("arguments").Finalidade;
			var GrpCompras = oEvent.getParameter("arguments").GrpCompras;
			var DtInic = oEvent.getParameter("arguments").DtInic;

			this.getView().byId("IdCarteira").setValue(Carteira);
			this.getView().byId("IdModalidade").setValue(Modalidade);
			this.getView().byId("IdPrioridade").setValue(Prioridade);
			this.getView().byId("IdFinalidade").setValue(Finalidade);
			this.getView().byId("IdGrpCompras").setValue(GrpCompras);
			this.getView().byId("IdDtInic").setValue(DtInic);

			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("ZET_CBMM_CF_ROTASet", {
					Bukrs: "2001",
					IdSolicitacao: IdSolicitacao,
					WerksO: WerksO,
					IdRota: IdRota
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		_bindView: function(sObjectPath) {
			var oViewModel = this.getModel("objectRotaView"),
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
				oViewModel = this.getModel("objectRotaView"),
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
				intent: "#SolicitaçãodeFrete-display&/ZET_CBMM_CF_RotaSet/" + sObjectId
			});

			oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("saveAsTileTitle", [sObjectName]));
			oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));

			var Carteira = this.getView().byId("IdCarteira").getValue();

			if (Carteira === "SERVIÇO") {
				this.getView().byId("idFormOrig").setVisible(true);
				this.getView().byId("idFormDest").setVisible(false);
				this.getView().byId("idFormMat").setVisible(false);
				this.getView().byId("idFormOut").setVisible(false);
				this.getView().byId("UploadCollection").setVisible(true);
				this.getView().byId("idFormTransp").setVisible(true);
			}

			if (Carteira === "INSUMO" || Carteira === "RESIDUO" || Carteira === "BAUXITA") {
				this.getView().byId("idFormOrig").setVisible(true);
				this.getView().byId("idFormDest").setVisible(true);
				this.getView().byId("idFormMat").setVisible(true);
				this.getView().byId("idFormOut").setVisible(true);
				this.getView().byId("UploadCollection").setVisible(true);
				this.getView().byId("idFormTransp").setVisible(true);
			}
			if (Carteira === "MRO") {
				this.getView().byId("idFormOrig").setVisible(true);
				this.getView().byId("idFormDest").setVisible(true);
				this.getView().byId("idFormMat").setVisible(true);
				this.getView().byId("idFormOut").setVisible(true);
				this.getView().byId("UploadCollection").setVisible(true);
				this.getView().byId("idFormTransp").setVisible(true);
			}
			if (Carteira === "PRODUTO ACABADO") {
				this.getView().byId("idFormOrig").setVisible(true);
				this.getView().byId("idFormDest").setVisible(true);
				this.getView().byId("idFormMat").setVisible(true);
				this.getView().byId("idFormOut").setVisible(true);
				this.getView().byId("UploadCollection").setVisible(true);
				this.getView().byId("idFormTransp").setVisible(true);
			}

			// Fim - Validar carteira e deixar campos visiveis.

			// Inicio - Filtro nos uploads de arquivo
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue(),
				IdRota = this.getView().byId("IdIdRota").getValue(),
				filter = IdSolicitacao + ";" + IdRota,
				oFilter = new sap.ui.model.Filter("WerksO", sap.ui.model.FilterOperator.EQ, filter),
				oList = this.getView().byId("UploadCollection");

			// Executa filtro
			oList.getBinding("items").filter([oFilter]);
			// fim executa filtro

			// Fim - Filtro nos uploads de arquivo
		},

		onBack: function() {
			this.getRouter().navTo("BackObjectRota");
		},

		onCancelar: function() {
			var that = this;
			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: "As alterações realizadas não seram salvas, deseja confirmar"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function() {
						that.getView().byId("IdVlrTon").setEditable(false);
						that.getView().byId("B_Cancelar").setVisible(false);
						that.getView().byId("B_Salvar").setVisible(false);
						that.getView().byId("B_Editar").setVisible(true);
						that.getView().byId("B_Voltar").setVisible(true);
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

		onBeforeUploadStarts: function(oEvent) {
			var sName = sap.ushell.Container.getUser().getFullName();
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();
			var IdRota = this.getView().byId("IdIdRota").getValue();
			var sSlug = sName + "$" + IdSolicitacao + "$" + oEvent.getParameter("fileName") + "$" + IdRota;

			// Stellen die Kopf Parameter slug
			var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
				name: "slug",
				value: sSlug
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
			//			_busyDialog.open();
		},

		onEdit: function() {
			this.getView().byId("IdVlrTon").setEditable(true);
			this.getView().byId("B_Cancelar").setVisible(true);
			this.getView().byId("B_Salvar").setVisible(true);
			this.getView().byId("B_Editar").setVisible(false);
			this.getView().byId("B_Voltar").setVisible(false);
		},

		onSave: function() {
			var that = this;
			var oModel = this.getView().getModel();
			var Bukrs = "2001";
			var WerksO = this.getView().byId("IdWerks").getValue();
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();
			var IdRota = this.getView().byId("IdIdRota").getValue();
			var Key = "/ZET_CBMM_CF_ROTASet(Bukrs='" + Bukrs + "',WerksO='" + WerksO + "',IdSolicitacao=" + IdSolicitacao + ",IdRota=" +
				IdRota + ")";
			var oEntry = {};
				oEntry.VlrTon = this.getView().byId("IdVlrTon").getValue();
				oEntry.VlrTon = oEntry.VlrTon.replace(",",".");
			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: "Confirma alteração do valor ?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function() {
						
						oModel.update(Key, oEntry, {
							success: function(oData, oResponse) {
								sap.m.MessageBox.success("Valor gravado com sucesso!", {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function(sAction) {
										dialog.close();
									}
								});
							},
							error: function(oError) {
								sap.m.MessageBox.error("Erro ao chamar o serviço!", {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function(sAction) {
										dialog.close();
									}
								});
							}
						});
						
						that.getView().byId("IdVlrTon").setEditable(false);
						that.getView().byId("B_Cancelar").setVisible(false);
						that.getView().byId("B_Salvar").setVisible(false);
						that.getView().byId("B_Editar").setVisible(true);
						that.getView().byId("B_Voltar").setVisible(true);
					
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
					that.getRouter().navTo("BackObjectRota");
				}
			});
			dialog.open();
		}

	});

});