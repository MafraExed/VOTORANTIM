sap.ui.define([
		"ZCBMM_RELGFREP/ZCBMM_RELGFREP/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("ZCBMM_RELGFREP.ZCBMM_RELGFREP.controller.NotFound", {

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