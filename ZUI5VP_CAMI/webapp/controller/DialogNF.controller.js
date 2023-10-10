sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"FibriaStatusViagem/webServices/conections"
], function(BaseController, MessageBox, Utilities, History, conections) {
	"use strict";

	return BaseController.extend("FibriaStatusViagem.controller.DialogNF", {
		NF: "",
		setRouter: function(oRouter) {
			this.oRouter = oRouter;

		},
		_onCloseDialogButtonPress: function(){
			this.closeDialog();
		},
		closeDialog: function(){
			var oDialog = this.getView().getContent()[0];
			oDialog.close();
		},
		setNFOnDialog: function(sChanel, sEvent, oData){
			this.NF = oData;
			var oJSON = new sap.ui.model.json.JSONModel();
			oJSON.setData(this.NF);
			this.getView().setModel(oJSON, 'NF');
		},
		onInit: function() {
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribe("DialogNF", "setNFOnDialog", this.setNFOnDialog, this);
			sap.ui.getCore().setModel(this, "DialogNF");
			this._oDialog = this.getView().getContent()[0];
		},
		onExit: function() {
			this._oDialog.destroy();

		}
	
	});
}, /* bExport= */ true);