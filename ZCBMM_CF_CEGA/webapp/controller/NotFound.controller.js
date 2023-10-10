sap.ui.define([
		"ZCBMM_CF_CEGA/ZCBMM_CF_CEGA/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("ZCBMM_CF_CEGA.ZCBMM_CF_CEGA.controller.NotFound", {

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