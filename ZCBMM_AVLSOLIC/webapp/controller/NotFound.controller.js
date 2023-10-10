sap.ui.define([
		"ZCBMM_AVLSOLIC/ZCBMM_AVLSOLIC/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("ZCBMM_AVLSOLIC.ZCBMM_AVLSOLIC.controller.NotFound", {

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