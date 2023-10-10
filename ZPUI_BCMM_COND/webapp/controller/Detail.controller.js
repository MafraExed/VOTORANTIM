/*global location */
sap.ui.define([
	"ZPUI_BCMM_COND/ZPUI_BCMM_COND/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/m/Text',
	"ZPUI_BCMM_COND/ZPUI_BCMM_COND/model/formatter"
], function (BaseController, JSONModel, Dialog, Button, Text, formatter) {
	"use strict";

	return BaseController.extend("ZPUI_BCMM_COND.ZPUI_BCMM_COND.controller.Detail", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0
			});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			this.setModel(oViewModel, "detailView");

			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onShareEmailPress: function () {
			var oViewModel = this.getModel("detailView");

			sap.m.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function () {
			var oViewModel = this.getModel("detailView"),
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

		_onObjectMatched: function (oEvent) {
			if (oEvent) {
				var Bukrs = oEvent.getParameter("arguments").Bukrs;
				var IdSolicitacao = oEvent.getParameter("arguments").IdSolicitacao;
				var WerksO = oEvent.getParameter("arguments").WerksO;
			} else {
				Bukrs = "";
				IdSolicitacao = "";
				WerksO = "";
			}
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("ZET_CBMM_CF_FRETESet", {
					Bukrs: Bukrs,
					IdSolicitacao: IdSolicitacao,
					WerksO: WerksO

				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		_bindView: function (sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("detailView");

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function () {
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
				oViewModel = this.getModel("detailView");

			this.getOwnerComponent().oListSelector.selectAListItem(sPath);

			oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("shareSaveTileAppTitle", [sObjectName]));
			oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));

			var smartTable = this.getView().byId("smartTable");
			smartTable.rebindTable("e");
		},

		atualizaTabela: function (oEvent) {
			var IdSolicitacao = this.getView().byId("IdSolicitacao").getValue();

			if (IdSolicitacao) {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "IdSolicitacao",
					operator: "EQ",
					value1: IdSolicitacao
				}));
			}
		},

		onConfirm: function (oEvent) {
			var that = this;
			var _oComponent = this.getOwnerComponent();
			var oList = _oComponent.oListSelector._oList;
			var oListBinding = oList.getBinding("items");
			var IdSolicitacao = this.getView().byId("IdSolicitacao").getValue();
			IdSolicitacao = parseInt(IdSolicitacao);

			var oModel10 = new sap.ui.model.json.JSONModel();
			var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_TRANSPSet/$count?$filter=IdSolicitacao eq " +
				IdSolicitacao + "";
			oModel10.loadData(serviceUrl, null, false, "GET", false, false, null);
			var oInd = oModel10.oData;

			if (oInd === 0) {
				sap.m.MessageBox.error("Cadastre ao menos uma transportadora para liberar a cotação");
				return;
			}

			var oModel11 = new sap.ui.model.json.JSONModel();
			var serviceUrl1 = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_VEICULOSet/$count?$filter=IdSolicitacao eq " +
				IdSolicitacao + "";
			oModel11.loadData(serviceUrl1, null, false, "GET", false, false, null);
			var oInd1 = oModel11.oData;

			if (oInd1 === 0) {
				sap.m.MessageBox.error("Cadastre ao menos um veiculo para liberar a cotação");
				return;
			}

			var oModel = this.getView().getModel();
			var key = "";
			var oParameters = {};

			oParameters.Bukrs = this.getView().byId("IdBBukrs").getValue();
			oParameters.WerksO = this.getView().byId("IdWerksO").getValue();
			oParameters.IdSolicitacao = parseInt(this.getView().byId("IdSolicitacao").getValue());
			oParameters.Status = "ZCOND";

			key = "/ZET_CBMM_CF_FRETESet(Bukrs='" + oParameters.Bukrs + "',WerksO='" + oParameters.WerksO + "',IdSolicitacao=" + oParameters.IdSolicitacao +
				")";
			var texto = "Deseja liberar para cotação?";

			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: texto
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {

						oModel.update(key, oParameters, {
							success: function (oData, oResponse) {
								sap.m.MessageBox.success("Condição para cotação efetuada com sucesso", {
									actions: ["OK"],
									onClose: function (sAction) {
										if (sAction === "OK") {
											//oListBinding.refresh(true);
											that.getRouter().navTo("masterRefresh");
										}
									}
								});
							},

							error: function (e) {
								sap.m.MessageBox.error("Erro ao gerar condição para cotação");
							}
						});

						dialog.close();
					}
				}),
				endButton: new Button({
					text: "Cancelar",
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

		onPress: function (oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());

		},

		_showObject: function (oItem) {
			var Bukrs = this.getView().byId("IdBBukrs").getValue();
			//oItem.getBindingContext().getProperty("Bukrs");
			var WerksO = oItem.getBindingContext().getProperty("WerksO");
			if (WerksO === "") {
				WerksO = "0";
			}

			var Werks = this.getView().byId("IdWerksO").getValue();
			var IdSolicitacao = oItem.getBindingContext().getProperty("IdSolicitacao");
			var IdRota = oItem.getBindingContext().getProperty("IdRota");
			var Carteira = this.getView().byId("idCarteira").getValue();
			var Modalidade = this.getView().byId("idModalidade").getValue();
			var Prioridade = this.getView().byId("IdPrioridade").getValue();
			var Finalidade = this.getView().byId("IdFinalidade").getValue();
			var GrpCompras = this.getView().byId("IdGrpCompras").getValue();
			var DtInic = this.getView().byId("idDtInic").getValue();
			while (DtInic.indexOf('/') != -1) {
				DtInic = DtInic.replace('/','_');
			}

			this.getRouter().navTo("rota", {
				Bukrs: Bukrs,
				WerksO: WerksO,
				Werks: Werks,
				IdSolicitacao: IdSolicitacao,
				IdRota: IdRota,
				Carteira: Carteira,
				Modalidade: Modalidade,
				Prioridade: Prioridade,
				Finalidade: Finalidade,
				GrpCompras: GrpCompras,
				DtInic: DtInic
			});
		},

		_onMetadataLoaded: function () {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("detailView");

			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);

			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		},
		onPress2: function () {
			if (this.getView().getParent().getParent().getMode("HideMode") === "HideMode") {
				this.getView().getParent().getParent().setMode("ShowHideMode");
			} else {
				this.getView().getParent().getParent().setMode("HideMode");
			}

			// var oSplitContainer = this.getView().byId("idAppControl");
			// oSplitContainer.setMode(sap.m.SplitAppMode.StretchCompressMode);
			// if (oSplitContainer.isMasterShown()) {
			// 	oSplitContainer.setMode(sap.m.SplitAppMode.HideMode);
			// }
		},
		
		onVoltar: function () {
			var that = this;
			var oModel = this.getView("Master").getModel();
			var Bukrs = "2001";
			var WerksO = this.getView().byId("IdWerksO").getValue();
			var IdSolicitacao = this.getView().byId("IdSolicitacao").getValue();

			var Key = "/ZET_CBMM_CF_FRETESet(Bukrs='" + Bukrs + "',WerksO='" + WerksO + "',IdSolicitacao=" + IdSolicitacao + ")";
			var oEntry = {};
			oEntry.Status = "AVSO";

			var dialog = "";
			dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: "Deseja estornar o Status?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(Key, oEntry, {
							success: function (oData, oResponse) {
								sap.m.MessageBox.success("Status estornado com sucesso!", {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function (sAction) {
										that.getRouter().navTo("masterRefresh");
									}
								});
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

		},

	});

});