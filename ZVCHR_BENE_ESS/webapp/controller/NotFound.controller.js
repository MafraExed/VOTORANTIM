sap.ui.define([
	"ZVCRH_VISAO_EMPREGADO/ZVCRH_VISAO_EMPREGADO/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("ZVCRH_VISAO_EMPREGADO.ZVCRH_VISAO_EMPREGADO.controller.NotFound", {

			onInit: function () {
				this.getRouter().getTarget("notFound").attachDisplay(this._onNotFoundDisplayed, this);
			},

			_onNotFoundDisplayed : function () {
					this.getModel("appView").setProperty("/layout", "OneColumn");
			}
		});
	}
);