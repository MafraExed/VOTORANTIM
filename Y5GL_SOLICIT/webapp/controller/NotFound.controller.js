sap.ui.define([
	"Y5GL_SOLICIT/Y5GL_SOLICIT/controller/BaseController",
], function (BaseController) {
	"use strict";

	return BaseController.extend("Y5GL_SOLICIT.Y5GL_SOLICIT.controller.NotFound", {

		onInit: function () {
			this.getRouter().getTarget("notFound").attachDisplay(this._onNotFoundDisplayed, this);
		},

		_onNotFoundDisplayed : function () {
			this.getModel("appView").setProperty("/layout", "OneColumn");
		}
	});
});