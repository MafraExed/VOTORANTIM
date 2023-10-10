sap.ui.define([
		"ZCBLE_PR_REM_SAIDA/ZCBLE_PR_REM_SAIDA/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("ZCBLE_PR_REM_SAIDA.ZCBLE_PR_REM_SAIDA.controller.NotFound", {

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