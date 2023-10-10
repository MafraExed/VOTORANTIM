sap.ui.define([
	"Y5GL_DECLAR/Y5GL_DECLAR/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("Y5GL_DECLAR.Y5GL_DECLAR.controller.NotFound", {

			onInit: function () {
				this.getRouter().getTarget("notFound").attachDisplay(this._onNotFoundDisplayed, this);
			},

			_onNotFoundDisplayed : function () {
					this.getModel("appView").setProperty("/layout", "OneColumn");
			}
		});
	}
);