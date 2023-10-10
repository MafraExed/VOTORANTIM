sap.ui.define([
		"ZCBMM_SOLICITACAO_FRETE/ZCBMM_SOLICITACAO_FRETE/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("ZCBMM_SOLICITACAO_FRETE.ZCBMM_SOLICITACAO_FRETE.controller.NotFound", {

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