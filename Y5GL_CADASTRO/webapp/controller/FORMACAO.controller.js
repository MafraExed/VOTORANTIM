sap.ui.define([
	"Y5GL_CADASTRO/Y5GL_CADASTRO/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("Y5GL_CADASTRO.Y5GL_CADASTRO.controller.FORMACAO", {
		onInit: function () {},
		
		onAdd: function(){
			this.getRouter().navTo("FORMACAO_DETAIL");
		},
		
		onBackMaster: function () {
			this.getRouter().navTo("master");
		}

	});

});