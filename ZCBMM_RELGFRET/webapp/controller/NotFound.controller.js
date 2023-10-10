sap.ui.define([
		"ZCBMM_RELGFRET/ZCBMM_RELGFRET/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("ZCBMM_RELGFRET.ZCBMM_RELGFRET.controller.NotFound", {

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