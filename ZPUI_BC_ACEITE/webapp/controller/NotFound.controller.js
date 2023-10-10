sap.ui.define([
		"ZCBMM_ACEITE_RESERVA/ZCBMM_ACEITE_RESERVA/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("ZCBMM_ACEITE_RESERVA.ZCBMM_ACEITE_RESERVA.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);