sap.ui.controller("viewcontroller.View1", {

	// onInit: function () {
	// 	var sValue = jQuery.sap.getUriParameters().get("processo");
	// 	var oModel = this.getView().getModel();
	// 	var oEntry = {};
	// 	var Key = "/ZET_CARREGAMENTOSet(Confirma='C',Processo='" + sValue + "')";
	// 	var messagem = "";

	// 	this.getView().byId("tProcess").setText(sValue);
	// 	oEntry.Processo = sValue;
	// 	oEntry.Confirma = "C";
	// 	var that = this;

	// 	oModel.update(Key, oEntry, {
	// 		success: function (oData, oResponse) {
	// 			that.getView().byId("button0").setVisible(true);
	// 			that.getView().byId("button1").setVisible(true);
	// 		},
	// 		error: function (oError) {
	// 			var otext = oError.responseText;
	// 			var oMsg = JSON.parse(otext);
	// 			messagem = oMsg.error.message.value;
	// 			sap.m.MessageBox.error(messagem, {
	// 				actions: ["OK"],
	// 				onClose: function (sAction) {
	// 					that.getView().byId("button0").setVisible(false);
	// 					that.getView().byId("button1").setVisible(false);
	// 				}
	// 			});
	// 			return;
	// 		}
	// 	});
	// },

	onAfterRendering: function (oEvent) {
		var that = this;
		var processo = jQuery.sap.getUriParameters().get("processo");
		this.getView().byId("tProcess").setText(processo);
		if (processo) {
			var URI = "/sap/opu/odata/sap/ZGWFBSD_CARREG_BONI_SRV/ZET_CARREGAMENTOSet('" + processo +
				"')?$expand=ManagerKit,ManagerExtract,ManagerService,ManagerScreenType,ManagerMessage&$format=json&saml2=disabled";
			//var URI = "/sap/opu/odata/sap/ZGWFBSD_CARREG_BONI_SRV/ZET_CARREGAMENTOSet(Processo='" + processo + "',Confirma='X')?$format=json&saml2=disabled";
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData(URI);

			//var oModel = new JSONModel(jQuery.sap.getModulePath("zui5_sol_email", "/mockEgx.json"));
			this.getView().setModel(oModel);
			this.getView().bindElement("/d");
		}

		that.getView().byId("button0").setVisible(true);
		that.getView().byId("button1").setVisible(true);
		// var oBar = this.byId("homeBar");
		// oBar.removeAllContentRight();
		// var oAprovarBt = new sap.m.Button( "aprovarBt",{
		// 	text: "Aprovar",
		// 	type: "Accept",
		// 	visible: false,
		// 	press: this.handleAprovarPress
		// });
		// var oRejeitarBt = new sap.m.Button( "rejeitarBt",{
		// 	text: "Rejeitar",
		// 	type: "Reject",
		// 	visible: false,
		// 	press: this.handleRejeitarPress
		// });

		// oBar.addContentRight(oAprovarBt);
		// oBar.addContentRight(oRejeitarBt);

		// oModel.attachRequestCompleted(function(){  
		// 	var msg = oModel.getData().d.ManagerMessage.TxtMensagem;
		// 	if ( msg === false ){
		// 		msg = "Dados não retornados do Backend";
		// 	}
		// 	sap.m.MessageToast.show(msg);

		// 	if ( oModel.getData().d.ManagerScreenType.TipoBts === "A" ){
		// 		that.getView().byId("button0").setVisible(true);
		//			that.getView().byId("button1").setVisible(true);
		// 	}

		// }); 

	},

	onAprov: function () {
		var sValue = jQuery.sap.getUriParameters().get("processo");
		//var that = this;

		if (sValue) {
			var URI = "/sap/opu/odata/sap/ZGWFBSD_CARREG_BONI_SRV/ZET_CARREGAMENTOSet(Processo='" + sValue +
				"',Confirma='Y')?$expand=ApproverMessageC&$format=json&saml2=disabled";
			//var URI = "/sap/opu/odata/sap/ZGWFBSD_CARREG_BONI_SRV/ZET_CARREGAMENTOSet(Processo='" + sValue + "',Confirma='Y')?$format=json&saml2=disabled";
			var oModelApr = new sap.ui.model.json.JSONModel();
			oModelApr.loadData(URI);
			oModelApr.attachRequestCompleted(function () {
				if (oModelApr.getData().d.ApproverMessageC.TipoMensagem === 'E') {
					var msg = oModelApr.getData().d.ApproverMessageC.TxtMensagem;
					sap.m.MessageToast.show(msg);
				} else {
					sap.m.MessageToast.show("Aprovação efetuada com sucesso");
				}
			});
		}

	},

	onReprov: function () {
		var sValue = jQuery.sap.getUriParameters().get("processo");
		if (sValue) {
			var URI = "/sap/opu/odata/sap/ZGWFBSD_CARREG_BONI_SRV/ZET_CARREGAMENTOSet(Processo='" + sValue +
				"',Confirma='N')?$expand=ApproverMessageC&$format=json&saml2=disabled";
			//var URI = "/sap/opu/odata/sap/ZGWFBSD_CARREG_BONI_SRV/ZET_CARREGAMENTOSet(Processo='" + sValue + "',Confirma='N')?$format=json&saml2=disabled";
			var oModelApr = new sap.ui.model.json.JSONModel();
			oModelApr.loadData(URI);
			oModelApr.attachRequestCompleted(function () {
				if (oModelApr.getData().d.ApproverMessageC.TipoMensagem === 'E') {
					var msg = oModelApr.getData().d.ApproverMessageC.TxtMensagem;
					sap.m.MessageToast.show(msg);
				} else {
					sap.m.MessageToast.show("Reprovação efetuada com sucesso");
				}
			});
		}
	}

});