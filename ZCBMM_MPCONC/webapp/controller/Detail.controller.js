/*global location */
sap.ui.define([
	"ZCBMM_MPCONC/ZCBMM_MPCONC/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ZCBMM_MPCONC/ZCBMM_MPCONC/model/formatter",
	'sap/m/Dialog'
], function (BaseController, JSONModel, formatter, Dialog) {
	"use strict";

	return BaseController.extend("ZCBMM_MPCONC.ZCBMM_MPCONC.controller.Detail", {

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
		onSendEmailPress: function () {
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
			var Werks = oEvent.getParameter("arguments").Werks;
			var IdSolicitacao = oEvent.getParameter("arguments").IdSolicitacao;
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("ZET_CBMM_CF_FRETESet", {
					Bukrs: Bukrs,
					WerksO: Werks,
					IdSolicitacao: IdSolicitacao
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
				sObjectName = oObject.Status,
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

			var smartTable2 = this.getView().byId("smartTable2");
			smartTable2.rebindTable("e");

			var smartTable3 = this.getView().byId("smartTable3");
			smartTable3.rebindTable("e");

			var oModel10 = new sap.ui.model.json.JSONModel();
			var IdIdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();
			var sService = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_VEICONDSet/?$filter=Idsolicitacao eq " +
				IdIdSolicitacao + " and Moeda eq 'A'";
			oModel10.loadData(sService, null, false, "GET", false, false, null);
			var Justificativa = oModel10.oData.d.results[0].Justif;
			this.getView().byId("IdJustif").setValue(Justificativa);
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

		/**
		 * Set the full screen mode to false and navigate to master page
		 */
		onCloseDetailPress: function () {
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
			// No item should be selected on master after detail page is closed
			this.getOwnerComponent().oListSelector.clearMasterListSelection();
			this.getRouter().navTo("master");
		},

		/**
		 * Toggle between full and non full screen mode.
		 */
		toggleFullScreen: function () {
			var bFullScreen = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
			if (!bFullScreen) {
				// store current layout and go full screen
				this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
				this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
			} else {
				// reset to previous layout
				this.getModel("appView").setProperty("/layout", this.getModel("appView").getProperty("/previousLayout"));
			}
		},

		/**
		 * Opens the Action Sheet popover
		 * @param {sap.ui.base.Event} oEvent the press event of the share button
		 */
		onSharePress: function (oEvent) {
			var oButton = oEvent.getSource();

			// create action sheet only once
			if (!this._actionSheet) {
				this._actionSheet = sap.ui.xmlfragment(
					"sap.ui.demo.masterdetail.view.ActionSheet",
					this
				);
				this.getView().addDependent(this._actionSheet);
				// forward compact/cozy style into dialog
				jQuery.sap.syncStyleClass(this.getView().getController().getOwnerComponent().getContentDensityClass(), this.getView(), this._actionSheet);
			}
			this._actionSheet.openBy(oButton);
		},

		atualizaTabela: function (oEvent) {
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();

			if (IdSolicitacao) {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Idsolicitacao",
					operator: "EQ",
					value1: IdSolicitacao
				}));

				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Vencedor",
					operator: "EQ",
					value1: "X"
				}));
			}
		},

		atualizaTabela2: function (oEvent) {
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();

			if (IdSolicitacao) {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Idsolicitacao",
					operator: "EQ",
					value1: IdSolicitacao
				}));

				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Vencedor",
					operator: "EQ",
					value1: "X"
				}));
			}
		},

		atualizaTabela3: function (oEvent) {
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();

			if (IdSolicitacao) {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Idsolicitacao",
					operator: "EQ",
					value1: IdSolicitacao
				}));

				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Vencedor",
					operator: "EQ",
					value1: "Y"
				}));
			}
		},

		onSelectFilter1: function () {
			var smartTable = this.getView().byId("smartTable");
			smartTable.rebindTable("e");

			var smartTable2 = this.getView().byId("smartTable2");
			smartTable2.rebindTable("e");

			var smartTable3 = this.getView().byId("smartTable3");
			smartTable3.rebindTable("e");
		},

		onAprovar: function () {
			var oModel = this.getView().getModel();
			var Bukrs = "2001";
			var WerksO = this.getView().byId("IdWerksO").getValue();
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();

			var Key = "/ZET_CBMM_CF_FRETESet(Bukrs='" + Bukrs + "',WerksO='" + WerksO + "',IdSolicitacao=" + IdSolicitacao + ")";
			var oEntry = {};
			oEntry.Status = "FINA";

			oModel.update(Key, oEntry, {
				success: function (oData, oResponse) {
					var hdrMessage = oResponse.headers["sap-message"];
					var hdrMessageObject = JSON.parse(hdrMessage);
					sap.m.MessageBox.warning(hdrMessageObject.message);
				},
				error: function (oError) {
					sap.m.MessageBox.error("Erro na Grava\xE7\xE3o da Sele\xE7\xE3o!!");
				}
			});
		},

		onReprov: function () {

			var oModel = this.getView().getModel();
			var Bukrs = "2001";
			var WerksO = this.getView().byId("IdWerksO").getValue();
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();

			var Key = "/ZET_CBMM_CF_FRETESet(Bukrs='" + Bukrs + "',WerksO='" + WerksO + "',IdSolicitacao=" + IdSolicitacao + ")";
			var oEntry = {};
			oEntry.Status = "COTV";

			oModel.update(Key, oEntry, {
				success: function (oData, oResponse) {
					sap.m.MessageBox.success("Mapa reprovado com sucesso.");
				},
				error: function (oError) {
					sap.m.MessageBox.error("Erro na Grava\xE7\xE3o da Sele\xE7\xE3o!!");
				}
			});

		},

		onImprime: function (oEvent) {
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();
			
			this.getRouter().navTo("Imprime", {
				IdSolicitacao:IdSolicitacao
			});
		}
	});

});