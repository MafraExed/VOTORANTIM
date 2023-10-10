sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History"], function (e, t) {
	"use strict";

	var caminho_imagem;
	var Bukrs;

	return e.extend("Y5GL_EC_SOLFER2.Y5GL_EC_SOLFER2.controller.BaseController", {

		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		getModel: function (e) {
			return this.getView().getModel(e);
		},

		loading: function (e) {
			if (e === false) {
				this.getView().byId("idGif").addStyleClass("LoadingFalse");
			} else {
				this.getView().byId("idGif").removeStyleClass("LoadingFalse");
			}
		},

		setModel: function (e, t) {
			return this.getView().setModel(e, t);
		},

		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		onNavBack: function () {
			var e = t.getInstance().getPreviousHash(),
				i = sap.ushell.Container.getService("CrossApplicationNavigation");
			if (e !== undefined || !i.isInitialNavigation()) {
				history.go(-1);
			} else {
				this.getRouter().navTo("master", {}, true);
			}
		},

		setEmpresa: function (IBukrs, sImagePath) {
			var sRootPath = jQuery.sap.getModulePath("Y5GL_EC_SOLFER2.Y5GL_EC_SOLFER2");

			sImagePath = sRootPath + "/imagens/loading.gif";

			caminho_imagem = sImagePath;
		},
		buscaImagem: function () {

			this.getView().byId("idimg").setSrc(caminho_imagem);

			this.getView().byId("idimg").addStyleClass("footer_img");
			this.getView().byId("idimg").removeStyleClass("footer_img");

		}

	})
});