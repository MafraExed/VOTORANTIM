sap.ui.define([
	"ZCBMM_MAPACONC1/ZCBMM_MAPACONC1/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("ZCBMM_MAPACONC1.ZCBMM_MAPACONC1.controller.NotFound", {

			onInit: function () {
				this.getRouter().getTarget("notFound").attachDisplay(this._onNotFoundDisplayed, this);
			},

			_onNotFoundDisplayed : function () {
					this.getModel("appView").setProperty("/layout", "OneColumn");
			}
		});
	}
);