sap.ui.controller("viewcontroller.home", {

	onAfterRendering: function (oEvent) {
		var that = this;
		var token = this._getQueryVariable("token");
		if( token ){
			var URI = "/sap/opu/odata/sap/ZGWFBSD_EMAIL_EGX_SRV/ZET_FBSD_EmailManagerSet('" + token + "')?$expand=ManagerKit,ManagerExtract,ManagerService,ManagerScreenType,ManagerMessage&$format=json&saml2=disabled";
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData(URI);
							
			//var oModel = new JSONModel(jQuery.sap.getModulePath("zui5_sol_email", "/mockEgx.json"));
			this.getView().setModel(oModel);
			this.getView().bindElement("/d");
		}
		var oBar = this.byId("homeBar");
		oBar.removeAllContentRight();
		var oAprovarBt = new sap.m.Button( "aprovarBt",{
			text: "Aprovar",
			type: "Accept",
			visible: false,
			press: this.handleAprovarPress
		});
		var oRejeitarBt = new sap.m.Button( "rejeitarBt",{
			text: "Rejeitar",
			type: "Reject",
			visible: false,
			press: this.handleRejeitarPress
		});

		oBar.addContentRight(oAprovarBt);
		oBar.addContentRight(oRejeitarBt);
		
		
		oModel.attachRequestCompleted(function(){  
			var msg = oModel.getData().d.ManagerMessage.TxtMensagem;
			if ( msg == false ){
				msg = "Dados não retornados do Backend";
			}
			sap.m.MessageToast.show(msg);
			
			if ( oModel.getData().d.ManagerScreenType.TipoBts === "A" ){
				oAprovarBt.setVisible(true);
				oRejeitarBt.setVisible(true);
				oOkBt.setVisible(false);
			}
			
			if ( oModel.getData().d.ManagerScreenType.TipoTela === "S" ){
				that.getView().bindElement("/d/ManagerService");
				that._showFormFragment("servico");
			}else{
				if ( oModel.getData().d.ManagerScreenType.TipoTela === "E" ){
					that.getView().bindElement("/d/ManagerExtract");
					that._showFormFragment("extrato");
				}else{
					if ( oModel.getData().d.ManagerScreenType.TipoTela === "K" ){
						that.getView().bindElement("/d/ManagerKit");
						that._showFormFragment("kit");
					}else{
				
					}
				}
			}
		
		}); 
		
	},

	_formFragments: {},

	_getFormFragment: function (sFragmentName) {
		var oFormFragment = this._formFragments[sFragmentName];

		if (oFormFragment) {
			return oFormFragment;
		}

		oFormFragment = sap.ui.xmlfragment(this.getView().getId(), "viewcontroller.fragments." + sFragmentName);

		this._formFragments[sFragmentName] = oFormFragment;
		return this._formFragments[sFragmentName];
	},

	_showFormFragment : function (sFragmentName) {
		var oPage = this.getView().byId("home");
		oPage.removeAllContent();
		
		oPage.insertContent(this._getFormFragment(sFragmentName));
	},
	
	_getQueryVariable: function (sVariable) {
		var query = window.location.search.substring(1);
		var vars = query.split("&");
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			if (pair[0] === sVariable) {
				return pair[1];
			}
		}
		var msg = "Parâmetro " + sVariable + " não encontrado na URL";
		sap.m.MessageToast.show(msg);
	},
	
	handleAprovarPress : function () {
		var token = sap.ui.getCore().byId("__xmlview0").getController()._getQueryVariable("token");
		if( token ){
			var URI = "/sap/opu/odata/sap/ZGWFBSD_EMAIL_APPROVER_SRV/ZET_FBSD_EmailApproverSet(Token='" + token + "',TipoAprovacao='A')?$expand=ApproverMessage&$format=json&saml2=disabled";
			var oModelApr = new sap.ui.model.json.JSONModel();
			oModelApr.loadData(URI);
			oModelApr.attachRequestCompleted(function(){ 
				var msg = oModelApr.getData().d.ApproverMessage.TxtMensagem;
				sap.m.MessageToast.show(msg);
			}); 
		}
	},
	handleRejeitarPress : function () {
		var token = sap.ui.getCore().byId("__xmlview0").getController()._getQueryVariable("token");
		if( token ){
			var URI = "/sap/opu/odata/sap/ZGWFBSD_EMAIL_APPROVER_SRV/ZET_FBSD_EmailApproverSet(Token='" + token + "',TipoAprovacao='R')?$expand=ApproverMessage&$format=json&saml2=disabled";
			var oModelApr = new sap.ui.model.json.JSONModel();
			oModelApr.loadData(URI);
			oModelApr.attachRequestCompleted(function(){ 
				var msg = oModelApr.getData().d.ApproverMessage.TxtMensagem;
				sap.m.MessageToast.show(msg);
			}); 
		}
	}

});