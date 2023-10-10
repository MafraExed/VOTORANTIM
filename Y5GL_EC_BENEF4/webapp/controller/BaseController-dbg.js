sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";

	var caminho_imagem;
	var Bukrs;

	return Controller.extend("Y5GL_EC_BENEF4.Y5GL_EC_BENEF4.controller.BaseController", {
		/**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		formatVisible: function (oValue) {
			if (oValue === "Em ResoluÃ§Ã£o") {
				return true;
			} else {
				return false;
			}
		},

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		loading: function (bollean) {
			if (bollean === false) {
				this.getView().byId("idGif").addStyleClass("LoadingFalse");
				this.sleep(1000);
			} else {
				this.getView().byId("idGif").removeStyleClass("LoadingFalse");
				this.sleep(0);
			}
		},

		sleep: function (milliseconds) {
			var date = Date.now();
			var currentDate = null;

			do {
				currentDate = Date.now();
			}
			while (currentDate - date < milliseconds);
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler for navigating back.
		 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash(),
				oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
				// eslint-disable-next-line sap-no-history-manipulation
				history.go(-1);
			} else {
				this.getRouter().navTo("master", {}, true);
			}
		},

		adicionarponto: function (nStr) {
			var x;
			var x1;
			var x2;
			var x3;

			nStr += "";
			x = nStr.split(".");
			x1 = x[0];
			x2 = x.length > 1 ? "." + x[1] : "";
			var rgx = /(\d+)(\d{3})/;

			while (rgx.test(x1)) {
				x1 = x1.replace(rgx, "$1" + "." + "$2");
			}

			x3 = x1 + x2;
			x3 = x3.trim();
			return x3;
		},

		adicionarpontoFloat: function (nStr) {
			var x;
			var x1;
			var x2;
			var x3;

			nStr += "";
			x = nStr.split(".");
			x1 = x[0];
			x2 = x.length > 1 ? "." + x[1] : "";
			var rgx = /(\d+)(\d{3})/;

			while (rgx.test(x1)) {
				x1 = x1.replace(rgx, "$1" + "." + "$2");
			}

			x3 = x1 + x2;
			return x3;
		},

		setEmpresa: function (IBukrs, sImagePath) {
			var sRootPath = jQuery.sap.getModulePath("Y5GL_EC_BENEF4.Y5GL_EC_BENEF4");

			sImagePath = sRootPath + "/imagens/loading.gif";

			caminho_imagem = sImagePath;
		},

		buscaImagem: function () {

			this.getView().byId("idimg").setSrc(caminho_imagem);

			this.getView().byId("idimg").addStyleClass("footer_img");
			this.getView().byId("idimg").removeStyleClass("footer_img");

		}

	});

});