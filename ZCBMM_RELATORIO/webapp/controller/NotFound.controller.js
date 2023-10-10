sap.ui.define([
		"ZCBMM_RELATORIO/ZCBMM_RELATORIO/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("ZCBMM_RELATORIO.ZCBMM_RELATORIO.controller.NotFound", {

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