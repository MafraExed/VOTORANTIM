sap.ui.define([
	"Y5GL_EC_CSC/Y5GL_EC_CSC/controller/BaseController",
], function (BaseController) {
	"use strict";

	return BaseController.extend("Y5GL_EC_CSC.Y5GL_EC_CSC.controller.NotFound", {

		onInit: function () {
			this.getRouter().getTarget("notFound").attachDisplay(this._onNotFoundDisplayed, this);
		},

		_onNotFoundDisplayed : function () {
			this.getModel("appView").setProperty("/layout", "OneColumn");
		}
	});
});