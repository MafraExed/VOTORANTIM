sap.ui.define(["sap/ui/core/mvc/Controller"], function(Controller) {
	"use strict";

	return Controller.extend("com.sap.votorantim.grupoZHCM_FERIAS_VT.controller.Main", {

		onInit: function() {
	

		},

		go: function() {
			
	this.getRouter().getTargets().display("pagina2");
		}
	
	});

});