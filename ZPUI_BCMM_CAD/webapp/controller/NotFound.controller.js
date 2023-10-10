sap.ui.define([
		"CADASTROAPROVADORES/CADASTROAPROVADOR/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("CADASTROAPROVADORES.CADASTROAPROVADOR.controller.NotFound", {

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