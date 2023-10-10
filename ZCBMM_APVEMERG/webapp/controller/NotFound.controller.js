sap.ui.define([
		"ZCBMM_APVEMERG/ZCBMM_APVEMERG/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("ZCBMM_APVEMERG.ZCBMM_APVEMERG.controller.NotFound", {

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