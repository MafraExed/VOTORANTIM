sap.ui.define([
	"Y5GL_SOLICIT4/Y5GL_SOLICIT4/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/library"
], function (BaseController, JSONModel, formatter, mobileLibrary) {
	"use strict";
	return BaseController.extend("Y5GL_SOLICIT4.Y5GL_SOLICIT4.controller.Detail", {

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

			// Image loading
			var sRootPath = jQuery.sap.getModulePath("Y5GL_SOLICIT4.Y5GL_SOLICIT4");
			var sImagePath = sRootPath + "/imagens/Transparente_CBA.gif";
			this.getView().byId("idimg").setSrc(sImagePath);
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

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
			var Pernr = oEvent.getParameter("arguments").Pernr;
			var Chamado = oEvent.getParameter("arguments").Chamado;

			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("ZET_GLHR_MINHAS_SOLICITACOESSet", {
					Pernr: Pernr,
					Chamado: Chamado
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
			var oViewModel = this.getView().getModel();
			var that = this;

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			that.loading(false);

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						that.loading(true);
					},
					dataReceived: function () {
						that.loading(false);
					}
				}
			});
		},

		_onBindingChange: function () {
			this.filtraUploadCollection();

			this.getView().byId(param).setVisible(true);

			if (param !== undefined) {

				switch (param) {
				case "EMP_CONSIGNADO":
					this.empConsiginado();
					break;
				case "ESTAC_MOVBUS":
					this.estacMovBus();
					break;
				case "LABORAL":
					this.laboral();
					break;
				case "PASAJE":
					this.pasaje();
					break;
				case "REEMBOLSO_CURSOS":
					this.reembolsoCursos();
					break;
				case "REEMBOLSO_EXPATRIADO":
					this.reembolsoExpatriado();
					break;
				case "REEMBOLSO_IDIOMA":
					this.reembolsoIdioma();
					break;
				case "SEGURO_DE_VIDA":
					this.seguroVida();
					break;
				case "PLANO_MEDICO":
					this.planoMedico();
					break;
				}
			}
		},
		
		filtraUploadCollection: function () {
			var infty, subty;

			if (param !== undefined) {
				switch (param) {
				case "EMP_CONSIGNADO":
					infty = "XXXX";
					subty = "EMCO";
					break;
				case "ESTAC_MOVBUS":
					infty = "XXXX";
					subty = "ESMV";
					break;
				case "LABORAL":
					infty = "XXXX";
					subty = "LABO";
					break;
				case "PASAJE":
					infty = "XXXX";
					subty = "PASA";
					break;
				case "REEMBOLSO_CURSOS":
					infty = "XXXX";
					subty = "RECU";
					break;
				case "REEMBOLSO_EXPATRIADO":
					infty = "XXXX";
					subty = "REEX";
					break;
				case "REEMBOLSO_IDIOMA":
					infty = "XXXX";
					subty = "REID";
					break;
				case "SEGURO_DE_VIDA":
					infty = "0168";
					subty = "VIDA";
					break;
				case "PLANO_MEDICO":
					infty = "0167";
					subty = "MEDI";
					break;
				}

				if (subty !== "") {
					var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, "0");
					var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
					var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, subty);
					var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "B");
					var oList = this.getView().byId("UploadCollection");
					oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo]);
				}
			}
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

		onVoltar: function () {
			this.getRouter().navTo("master");
		}
	});

});