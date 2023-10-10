sap.ui.define([
	"ZVCRH_FERIAS_GESTOR/ZVCRH_FERIAS_GESTOR/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("ZVCRH_FERIAS_GESTOR.ZVCRH_FERIAS_GESTOR.controller.NotFound", {

			onInit: function () {
				this.getRouter().getTarget("notFound").attachDisplay(this._onNotFoundDisplayed, this);
			},

			_onNotFoundDisplayed : function () {
					this.getModel("appView").setProperty("/layout", "OneColumn");
			}
		});
	}
);