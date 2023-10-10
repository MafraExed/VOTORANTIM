/*global location */
sap.ui.define([
		"vsa/y5gl_ga_portal/view/BaseController",
		"sap/ui/model/json/JSONModel",
		"vsa/y5gl_ga_portal/model/formatter",
		"sap/ui/model/FilterOperator",
		"sap/ui/model/Filter"		
	], function (BaseController, JSONModel, formatter, FilterOperator, Filter) {
		"use strict";

		return BaseController.extend("vsa.y5gl_ga_portal.view.Multi", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			onInit : function () {
				// Model used to manipulate control states. The chosen values make sure,
				// Multi page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				var oViewModel = new JSONModel({
					busy : false,
					delay : 0
				});
				
				this._oMultiModel = this.getOwnerComponent().getModel("multi");
				
				this._oTable = this.byId("tbMulti");

				this.getRouter().getRoute("mGa").attachPatternMatched(this._onObjectMatched, this);

				this.setModel(oViewModel, "multiView");
				
				var oTabModel = this.getOwnerComponent().getModel("hFields");
				
				this.setTable(this._oTable, oTabModel, "/results");
				
				this._oTable.setModel(this.getOwnerComponent().getModel("multi"));
				
			},


			_onObjectMatched: function (oEvent) {
				
				if(this._oTable.getBinding("rows")){
					
					var c = 0;
					var b = this._oTable.getBinding("rows"); 
					if (b) {
						c = b.getLength();
					}
					if (c > 0) {
						this._oTable.setTitle(this.getResourceBundle().getText("TABLETITLE", c));
					} else {
						this._oTable.setTitle(this.getResourceBundle().getText("TABLETITLE", "0"));
					}
				
				}
				
			},
			
			onApprove: function (e) {			
				if (!this._oDialogApprove) {
					this._oDialogApprove = sap.ui.xmlfragment("vsa.y5gl_ga_portal.view.fragment.approve_m", this);
					this._oDialogApprove.setModel(this.getView().getModel());
					this.getView().addDependent(this._oDialogApprove);				
				}
				
				sap.ui.getCore().byId("txtMApprove").setText(this.getResourceBundle().getText("MASSAPPROVE",  this._oTable.getBinding("rows").getLength()))
				
				this._oDialogApprove.open();
			},
			
			onConfirmApprove : function(e){
							
				this.onAcao("A", this._oTable.getBinding("rows").oList, "");

				this._oDialogApprove.close();	
			
			},
			
			onReject: function (e) {						
				var aFilters = []; 
				var oRejection = {
					Visible: false,
					Items: [],
					Key: ""
				};
				aFilters.push(new Filter("Unidade", FilterOperator.EQ, this._oTable.getBinding("rows").oList[0].Unidade));
				aFilters.push(new Filter("Processo", FilterOperator.EQ, "GA"));
				aFilters.push(new Filter("Acao", FilterOperator.EQ, "R"));
				
				this.getModel().read("/Motivos",{
					filters: aFilters,
					success: function(oData){
						oRejection.Visible = ( oData.results && oData.results.length > 0 );
						oData.results.forEach(function(oRejectionItem){
							oRejection.Items.push({
								CodMotivo: oRejectionItem.CodMotivo,
								Descricao: oRejectionItem.Descricao
							});
						}.bind(this));
						
						if(! this.getModel("RejectionModel")){
							this.setModel( new JSONModel(oRejection), "RejectionModel");
						}else{
							this.getModel("RejectionModel").setData(oRejection);
						}
						this.getModel("RejectionModel").refresh(true);
						
						this._openRejectionPopup();
					}.bind(this),
					error: function(oError){
						
					}
				});				
			},

			_openRejectionPopup: function(){
				if (!this._oDialogReject) {
					this._oDialogReject = sap.ui.xmlfragment(this.getView().getId(),"vsa.y5gl_ga_portal.view.fragment.reject", this);
					this._oDialogReject.setModel(this.getView().getModel());
					this.getView().addDependent(this._oDialogReject);				
				}
				this._oDialogReject.open();
				
				// INICIO - REJEITAR DIRECIONADO
				var sFormId = sap.ui.core.Fragment.createId(this.getView().getId(), "formReject");
				var oformReject = sap.ui.getCore().byId(sFormId);
				var oResource = this.getResourceBundle();
				if(oformReject){				
					if(oRbgReject){
						oRbgReject.destroy();
					}
								
					var oRbgReject = new sap.m.RadioButtonGroup({
						buttons: [ //new sap.m.RadioButton({ text : oResource.getText("REJECTRB-1") }).addCustomData(new sap.ui.core.CustomData({key : "J"})),
								   new sap.m.RadioButton({ text : oResource.getText("REJECTRB-2") }).addCustomData(new sap.ui.core.CustomData({key : "I"}))
						]
					});							

					oformReject.removeAllContent();
					oformReject.rerender();
					oformReject.addContent(oRbgReject);
				
				}
			// FIM - REJEITAR DIRECIONADO	
			},
			
			onConfirmReject : function(e){
				
				// INICIO - REJEITAR DIRECIONADO
				var sFormId = sap.ui.core.Fragment.createId(this.getView().getId(), "formReject");
				var oformReject = sap.ui.getCore().byId(sFormId);
				
				var sRejCode = oformReject.getContent()[0].getSelectedButton().getCustomData()[0].getKey();
							
				this.getOwnerComponent().getModel('global').setProperty("/rejCode", sRejCode);
				
				var sRejUserid = oformReject.getContent()[0].getSelectedButton().getCustomData()[0].getValue();	
				
				var sRejectId = sap.ui.core.Fragment.createId(this.getView().getId(), "taReject");				
				var sComent = sap.ui.getCore().byId(sRejectId).getValue();
				
				sap.ui.getCore().byId(sRejectId).setValue();
				
				this.getOwnerComponent().getModel('global').setProperty("/rejUserid", sRejUserid);
				
				var oRejectionData = this.getModel("RejectionModel").getData();
				var sRejectionKey = oRejectionData.Key;
				var sRejectionText = "";
				if (sRejectionKey && sRejectionKey.length > 0){
					function customFind(sKey){
						return function(oElement){
							return oElement.CodMotivo === sKey;
						}
					}
					
					sRejectionText = oRejectionData.Items.find(customFind(sRejectionKey)).Descricao;
				}
				
				this._oDialogReject.close();
				// FIM - REJEITAR DIRECIONADO
				
				this.onAcao("R", this._oTable.getBinding("rows").oList, sComent, sRejectionText);
			},
			
			onLiveButtonConfirmReject : function(e){
		        var sText = e.getParameter('value');
		        e.getSource().getParent().getBeginButton().setEnabled(sText.length > 0)
		    },			
			
  
			onLiveButtonConfirm : function(e){ 
				var sText = e.getParameter('value');
				var parent = e.getSource().getParent().getParent().getParent().getParent().getParent()
				parent.getBeginButton().setEnabled(sText.length > 0)
			}

		});

	}
);