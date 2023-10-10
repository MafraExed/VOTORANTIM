/*global location */
sap.ui.define([
	"ZCBMM_APRVCOTA/ZCBMM_APRVCOTA/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ZCBMM_APRVCOTA/ZCBMM_APRVCOTA/model/formatter",
	"sap/m/MessageToast",
	"sap/ui/core/mvc/Controller",
	'sap/m/Label',
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/Text',
	'sap/m/TextArea'

], function(BaseController, JSONModel, formatter, MessageToast, Controller, Label, Button, Dialog, Text, TextArea) {
	"use strict";

	return BaseController.extend("ZCBMM_APRVCOTA.ZCBMM_APRVCOTA.controller.Detail", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function() {
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
		onShareEmailPress: function() {
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
		onShareInJamPress: function() {
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

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		/**
		 * Binds the view to the object path and expands the aggregated line items.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function(oEvent) {
			var Bukrs = oEvent.getParameter("arguments").Bukrs;
			var IdSolicitacao = oEvent.getParameter("arguments").IdSolicitacao;
			var WerksO = oEvent.getParameter("arguments").WerksO;

			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("ZET_CBMM_CF_FRETESet", {
					Bukrs: Bukrs,
					IdSolicitacao: IdSolicitacao,
					WerksO: WerksO

				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		/**
		 * Binds the view to the object path. Makes sure that detail view displays
		 * a busy indicator while data for the corresponding element binding is loaded.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound to the view.
		 * @private
		 */
		_bindView: function(sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("detailView");

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},
			onChange: function(oEvent) {
			// Stellen das CSRF Token wenn ein File hinzugefügt ist
			var oUploadCollection = oEvent.getSource();
			var _csrfToken = this.getView().getModel().oHeaders['x-csrf-token'];
			var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
				name: "x-csrf-token",
				value: _csrfToken
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
			
		},
		
		
		onuploadComplete: function(oEvent) {
			this.getView().getModel().refresh();

			// Inicio - Filtro nos uploads de arquivo
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue(),
				IdWerks = this.getView().byId("IdWerks").getValue(),
				filter = IdSolicitacao,
				oFilter = new sap.ui.model.Filter("IdSolicitacao", sap.ui.model.FilterOperator.EQ, filter),
				oList = this.getView().byId("UploadCollection");

			// Executa filtro
			oList.getBinding("items").filter([oFilter]);
			// fim executa filtro

			// Fim - Filtro nos uploads de arquivo
		},

		
		onBeforeUploadStarts: function(oEvent) {

			// var sName = sap.ushell.Container.getUser().getFullName();
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();
			var IdWerksO = this.getView().byId("IdWerks").getValue();
			var sSlug = IdSolicitacao + "$" + oEvent.getParameter("fileName") + "$" + IdWerksO;

			// Stellen die Kopf Parameter slug
			var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
				name: "slug",
				value: sSlug
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
			//			_busyDialog.open();
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
			
				var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue(),
				IdWerks = this.getView().byId("IdWerks").getValue(),
				filter = IdSolicitacao,
				oFilter = new sap.ui.model.Filter("IdSolicitacao", sap.ui.model.FilterOperator.EQ, filter),
				oList = this.getView().byId("UploadCollection");

			// Executa filtro
			oList.getBinding("items").filter([oFilter]);
		},

		atualizaTabela: function(oEvent) {
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();

			if (IdSolicitacao) {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "IdSolicitacao",
					operator: "EQ",
					value1: IdSolicitacao
				}));
			}
		},

		handleUploadPress: function(oEvent) {
			var oFileUploader = this.byId("fileUploader");
			oFileUploader.upload();
		},

		onPress: function(oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},

		_showObject: function(oItem) {
			var IdSolicitacao = oItem.getBindingContext().getProperty("IdSolicitacao");
			var Bukrs = '2001';
			var IdRota = oItem.getBindingContext().getProperty("IdRota");
			var WerksO = oItem.getBindingContext().getProperty("WerksO");
			var Carteira = this.getView().byId("IdCarteira").getValue();

			this.getRouter().navTo("Information", {
				IdSolicitacao: IdSolicitacao,
				Bukrs: Bukrs,
				IdRota: IdRota,
				WerksO: WerksO,
				Carteira: Carteira
			});
		},

		_onMetadataLoaded: function() {
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

		onAprove: function() {
			var oModel = this.getView().getModel();
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();
			var mensagemAprov = "Deseja aprovar o orçamento '" + IdSolicitacao + "'?";
			var _oComponent = this.getOwnerComponent();
			var oList = _oComponent.oListSelector._oList;
			var oListBinding = oList.getBinding("items");
			var Erro = 0;
			var Aprov = "TK11";
			var Bukrs = "2001";
			var WerksO = this.getView().byId("IdWerks").getValue();

			var dialog = "";
			dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: mensagemAprov
				}),
				beginButton: new Button({
					text: "Sim",
					press: function() {

						var Key = "/ZET_CBMM_CF_FRETESet(Bukrs='" + Bukrs + "',WerksO='" + WerksO + "',IdSolicitacao=" + IdSolicitacao + ")";
						var oEntry = {};
						oEntry.Status = Aprov;
						oModel.update(Key, oEntry, {
							success: function(oData, oResponse) {
								Erro = 0;
							},
							error: function(oError) {
								Erro = 1;
							}
						});
						dialog.close();

						if (Erro === 0) {
							oListBinding.refresh(true);
							sap.m.MessageBox.success("Orçamento aprovado!");
						}
						if (Erro === 1) {
							sap.m.MessageBox.error("Orçamento não aprovado!");
						}

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

		OnReprov: function() {
			var oModel = this.getView().getModel();
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();
			var mensagemReprov = "Deseja Reprovar o orçamento '" + IdSolicitacao + "'?";
			var Erro = 0;
			var Reprov = "GCOT";
			var Bukrs = "2001";
			var WerksO = this.getView().byId("IdWerks").getValue();

			var dialog = "";
			dialog = new Dialog({
				title: "Motivo da reprovação",
				type: "Message",
				content: [
					new Label({
						text: 'Descreva o motivo da reprovação:',
						labelFor: 'submitDialogTextarea'
					}),
					new TextArea('submitDialogTextarea', {
						liveChange: function(oEvent) {
							var sText = oEvent.getParameter('value');
							var parent = oEvent.getSource().getParent();

							parent.getBeginButton().setEnabled(sText.length > 0);
						},
						width: '100%',
						placeholder: 'Digite aqui.'
					})
				],
				beginButton: new Button({
					text: 'Enviar',
					enabled: false,
					press: function() {
						var sText = sap.ui.getCore().byId('submitDialogTextarea').getValue();
						var Key = "/ZET_CBMM_CF_FRETESet(Bukrs='" + Bukrs + "',WerksO='" + WerksO + "',IdSolicitacao=" + IdSolicitacao + ")";
						var oEntry = {};
						oEntry.Status = Reprov;
						oModel.update(Key, oEntry, {
							success: function(oData, oResponse) {
								Erro = 0;
							},
							error: function(oError) {
								Erro = 1;
							}
						});

						dialog.close();

						if (Erro === 0) {
							var oModel10 = new sap.ui.model.json.JSONModel();
							var Key2 = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV" + Key;
							oModel10.loadData(Key2, null, false, "GET", false, false, null);
							var idSolicitacao = oModel10.oData.d.IdSolicitacao;
							var emailsol = oModel10.oData.d.Emailsol;
							var keymail = "/ZET_CBMM_CF_EMAILSet(Titulo='O%20orçamento%20" + idSolicitacao + "%20foi%20recusado.')";
							var oEntrymail = {};
							oEntrymail.Destinatario = emailsol;
							oEntrymail.Corpo = sText;
							oModel.update(keymail, oEntrymail, {
								success: function(oData, oResponse) {
									Erro = 0;
								},
								error: function(oError) {
									Erro = 1;
								}
							});
							if (Erro === 0) {
								sap.m.MessageBox.success("Reprovação enviada ao solicitante!");
							}
							if (Erro === 1) {
								sap.m.MessageBox.error("Erro ao chamar o serviço.");
							}
						}
						if (Erro === 1) {
							sap.m.MessageBox.error("Erro ao chamar o serviço.");
						}
					}
				}),
				endButton: new Button({
					text: "Cancelar",
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