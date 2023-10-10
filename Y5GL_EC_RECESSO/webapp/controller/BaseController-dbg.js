sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History"], function (e, t) {
	"use strict";
	return e.extend("Y5GL_EC_RECESSO.Y5GL_EC_RECESSO.controller.BaseController", {
		getRouter: function () {
			return this.getOwnerComponent().getRouter()
		},
		getModel: function (e) {
			return this.getView().getModel(e)
		},
		loading: function (e) {
			if (e === false) {
				this.getView().byId("idGif").addStyleClass("LoadingFalse")
			} else {
				this.getView().byId("idGif").removeStyleClass("LoadingFalse")
			}
		},
		setModel: function (e, t) {
			return this.getView().setModel(e, t)
		},
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle()
		},
		onNavBack: function () {
			var e = t.getInstance().getPreviousHash(),
				i = sap.ushell.Container.getService("CrossApplicationNavigation");
			if (e !== undefined || !i.isInitialNavigation()) {
				history.go(-1)
			} else {
				this.getRouter().navTo("master", {}, true)
			}
		}
	})
});