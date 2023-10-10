/*global location */
sap.ui.define([
	"ZCBMM_GERAR_COTACAO/ZCBMM_GERAR_COTACAO/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ZCBMM_GERAR_COTACAO/ZCBMM_GERAR_COTACAO/model/formatter",
	"sap/m/MessageToast",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/ODataModel",
	"sap/ui/model/odata/v4/ODataModel",
	"sap/m/Token",
	"sap/ui/commons/FileUploader",
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/m/Text'

], function (BaseController, JSONModel, formatter, MessageToast, Controller, oDataModel, OData, oToken, oFileUploader1, Dialog, Button,
	Text) {
	"use strict";

	return BaseController.extend("ZCBMM_GERAR_COTACAO.ZCBMM_GERAR_COTACAO.controller.Detail", {

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

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		/**
		 * Binds the view to the object path and expands the aggregated line items.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function (oEvent) {
			var Bukrs = oEvent.getParameter("arguments").Bukrs;
			var IdSolicitacao = oEvent.getParameter("arguments").IdSolicitacao;
			var WerksO = oEvent.getParameter("arguments").WerksO;

			this.getModel().metadataLoaded().then(function () {
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
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();

			if (IdSolicitacao) {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "IdSolicitacao",
					operator: "EQ",
					value1: IdSolicitacao
				}));

				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "IdRota",
					operator: "EQ",
					value1: 1
				}));
			}
		},

		// for UPLOAD.
		onChange: function (oEvent) {
			// Stellen das CSRF Token wenn ein File hinzugefügt ist
			var oUploadCollection = oEvent.getSource();
			var _csrfToken = this.getView().getModel().oHeaders['x-csrf-token'];
			var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
				name: "x-csrf-token",
				value: _csrfToken
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
		},

		onuploadComplete: function (oEvent) {
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

		onBeforeUploadStarts: function (oEvent) {

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

		onPress: function (oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},

		_showObject: function (oItem) {
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();
			var Bukrs = "2001";
			var WerksO = this.getView().byId("IdWerks").getValue();
			var NrTransp = oItem.getBindingContext().getProperty("NrTransp");

			this.getRouter().navTo("Mapa", {
				IdSolicitacao: IdSolicitacao,
				Bukrs: Bukrs,
				WerksO: WerksO,
				NrTransp: NrTransp
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

		onCondition: function () {
			var Bukrs = "2001";
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();
			var WerksO = this.getView().byId("IdWerks").getValue();

			this.getRouter().navTo("Condition", {
				Bukrs: Bukrs,
				IdSolicitacao: IdSolicitacao,
				WerksO: WerksO
			});
		},

		onConclui: function () {
			var oModel = this.getView().getModel();
			var oModel99 = new sap.ui.model.json.JSONModel();
			var This = this;
			var _oComponent = this.getOwnerComponent();
			var oList = _oComponent.oListSelector._oList;
			var oListBinding = oList.getBinding("items");
			var oEntry = {};
			oEntry.Status = "COTV";
			oEntry.Observacao = this.getView().byId("IdObs").getValue();
			var Bukrs = "2001";
			var WerksO = this.getView().byId("IdWerks").getValue();
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();
			var Key = "/ZET_CBMM_CF_FRETESet(Bukrs='" + Bukrs + "',WerksO='" + WerksO + "',IdSolicitacao=" + IdSolicitacao + ")";

			if (oEntry.Observacao === "") {
				this.getView().byId("IdObs").setValueState("Error");
				sap.m.MessageBox.error("Preencha o campo observação");
				return;
			} else {
				this.getView().byId("IdObs").setValueState("None");
			}

			var oModel10 = new sap.ui.model.json.JSONModel();
			var serviceUrl10 = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_VEICONDSet/?$filter=Idsolicitacao eq " +
				IdSolicitacao + " and Moeda eq 'C'";
			oModel10.loadData(serviceUrl10, null, false, "GET", false, false, null);
			var length = oModel10.oData.d.results.length;
			var VlrNegoc = "";
			if (length === 0) {
				sap.m.MessageBox.error("Deverá ser informado ao menos uma condition!");
				return;
			} else {
				for (var i = 0; i < length; i++) {
					var VlrNegoc = oModel10.oData.d.results[i].VlrNegoc;
					if (VlrNegoc === 0 || VlrNegoc === "" || VlrNegoc === "0.00") {
						var erro = 1;
					}
				}

				if (erro === 1) {
					sap.m.MessageBox.error("Existem confições onde não foi informado o valor negociado.");
					return;
				}
			}

			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: "Confirma conclusão da Cotação"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(Key, oEntry, {
							success: function (oData, oResponse) {
								sap.m.MessageBox.success("Cotação Concluida", {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function (sAction) {
										This.getRouter().navTo("masterRefresh");
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
					oListBinding.refresh(true);
				}
			});
			dialog.open();
		},

		onChangeIdObs: function () {
			var IdObs = this.getView().byId("IdObs").getValue();
			if (IdObs === "") {
				this.getView().byId("IdObs").setValueState("Error");
				sap.m.MessageBox.error("Preencha observação");
				return;
			} else {
				this.getView().byId("IdObs").setValueState("None");
			}
		},

		onVoltar: function () {
			var that  = this;
			var oModel = this.getView().getModel();
			var Bukrs = "2001";
			var WerksO = this.getView().byId("IdWerks").getValue();
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();

			var Key = "/ZET_CBMM_CF_FRETESet(Bukrs='" + Bukrs + "',WerksO='" + WerksO + "',IdSolicitacao=" + IdSolicitacao + ")";
			var oEntry = {};
			oEntry.Status = "CNDC";

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

		}

	});

});