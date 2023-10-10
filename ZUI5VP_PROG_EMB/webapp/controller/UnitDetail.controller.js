sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, History) {
	"use strict";

	return BaseController.extend("fibriembarque.controller.UnitDetail", {
		_onNavPress: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			if (sap.ui.Device.system.desktop === true) {
				oRouter.navTo("ordem", {}, true);
			} else {
				oRouter.navTo("master", {}, true);
			}
		},

		onInit: function() {
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribe("Unit", "atualizaTela", this.atualizaTela, this);
		},
		atualizaTela: function() {
			if (sap.ui.getCore().getModel("dadosUnit") !== undefined) {
				this.getView().setModel(sap.ui.getCore().getModel("dadosUnit"));
				var data = sap.ui.getCore().getModel("dadosUnit").getData();
				if(this.byId("localizacaoant") !== undefined){
				
				if(data.Localizaant === ''){
				this.byId("localizacaoant").setVisible(false);
				}else{
				this.byId("localizacaoant").setVisible(true);
				}
			}//if
		   }
		}

	});
}, /* bExport= */ true);