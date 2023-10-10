sap.ui.define([
	"Y5GL_FERI_SOLI/Y5GL_FERI_SOLI/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("Y5GL_FERI_SOLI.Y5GL_FERI_SOLI.controller.NotFound", {

			onInit: function () {
				this.getRouter().getTarget("notFound").attachDisplay(this._onNotFoundDisplayed, this);
			},

			_onNotFoundDisplayed : function () {
					this.getModel("appView").setProperty("/layout", "OneColumn");
			}
		});
	}
);