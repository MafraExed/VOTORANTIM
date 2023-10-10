sap.ui.define([
		"ZCBMM_APROVMAP/ZCBMM_APROVMAP/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("ZCBMM_APROVMAP.ZCBMM_APROVMAP.controller.NotFound", {

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