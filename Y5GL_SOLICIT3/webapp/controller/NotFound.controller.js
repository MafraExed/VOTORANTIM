sap.ui.define([
	"Y5GL_SOLICI3/Y5GL_SOLICI3/controller/BaseController",
], function (BaseController) {
	"use strict";

	return BaseController.extend("Y5GL_SOLICI3.Y5GL_SOLICI3.controller.NotFound", {

		onInit: function () {
			this.getRouter().getTarget("notFound").attachDisplay(this._onNotFoundDisplayed, this);
		},

		_onNotFoundDisplayed : function () {
			this.getModel("appView").setProperty("/layout", "OneColumn");
		}
	});
});