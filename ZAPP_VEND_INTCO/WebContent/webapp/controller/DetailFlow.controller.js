/*global location */
sap.ui.define([
					"nasa/ui5/vendaIntercompany/controller/BaseController",
					"sap/ui/model/json/JSONModel",
					"sap/ui/core/routing/History",
					"nasa/ui5/vendaIntercompany/model/formatter",
					"nasa/ui5/vendaIntercompany/model/constant",
					"sap/m/MessageBox",
					"sap/m/MessageToast",
					"sap/m/MessagePopover",
					"sap/m/MessagePopoverItem",
	], function (	
					BaseController, 
					JSONModel, 
					History, 
					formatter, 
					constant, 
					MessageBox, 
					MessageToast, 
					MessagePopover, 
					MessagePopoverItem) {
		
		"use strict";

		return BaseController.extend("nasa.ui5.vendaIntercompany.controller.DetailFlow", {

			formatter: formatter,
		
			onInit : function () {	
				// Model used to manipulate control states. The chosen values make sure,
				// detail page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				var oViewModel = new JSONModel({
					busy : false,
					delay : 0,
					itemListTableTitle : this.getResourceBundle().getText("detailFlowTitleTableItemList")
				});
				
				this.getRouter().getRoute("objectFlow").attachPatternMatched(this._onObjectMatched, this);
				this.setModel(oViewModel, "detailFlowView");
				
				this._createProcessFlowModel();
				
				//Message PopOver
				this._initializeMessagePopOver();

			},//END ON INIT

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */			
			
		     onNavBack : function() {
		    	 /*this.onMessageConfirmation(this.getResourceBundle().getText("detailFlowQuestionBack"),
		    			 					this.getResourceBundle().getText("buttonTextOK"),
		    			 					this.getResourceBundle().getText("buttonTextCancel"), 
		    			 					this.onBack.bind(this));*/
		    	 this.onBack();
		     },
		     
		     onBack: function(){
		    	 
				this._createProcessFlowModel();
		    	 
		    	//Show MASTER
				this.onHideUnhideMaster(constant.UNHIDE_MODE);
		    	 
		        var oModel = sap.ui.getCore().getModel("globalData"),
		        oItem = oModel.getData();
		           
		        this.getRouter().navTo("object", {Nrembarque: oItem.Nrembarque}, true);

		     },
		     
		     onNodePress: function(oEvent) {
		    	
		    	    var oNode = oEvent.getParameters().getNodeId();
		    	    this.getRouter().navTo("objectDocument", {Node: oNode}, true);
		     },
		     
		     onZoomIn: function(oOEvent){
		    	 var oProcessFlow = this.byId("processFlowPage");
		    	 oProcessFlow.zoomIn();
		     },
		     
		     onZoomOut: function(oOEvent){
		    	 var oProcessFlow = this.byId("processFlowPage");
		    	 oProcessFlow.zoomOut();
		     },
		     
			 onHandleMessagePopover: function (oEvent) {
					this.oMessagePopover.openBy(oEvent.getSource());
			 },
			 
			 onHandleNewDocuments: function(oEvent){
				 /*this.onMessageConfirmation(this.getResourceBundle().getText("detailFlowMessageQuestionSave"),
		 					this.getResourceBundle().getText("buttonTextOK"),
		 					this.getResourceBundle().getText("buttonTextCancel"), 
		 					function(){ this._SaveNewCancelDocuments(constant.EVENT_CREATE); }.bind(this));*/
				 this._SaveNewCancelDocuments(constant.EVENT_CREATE);
			},
			
			onHandleRefreshDocuments: function(oEvent){
				debugger;
				 /*this.onMessageConfirmation(this.getResourceBundle().getText("detailFlowMessageQuestionSave"),
		 					this.getResourceBundle().getText("buttonTextOK"),
		 					this.getResourceBundle().getText("buttonTextCancel"), 
		 					function(){ this._SaveNewCancelDocuments(constant.EVENT_CREATE); }.bind(this));*/
				 this._SaveNewCancelDocuments(constant.EVENT_REFRESH);
			},
			
			onHandleCancelDocuments: function(oEvent){
				 /*this.onMessageConfirmation(this.getResourceBundle().getText("detailFlowMessageQuestionCancel"),
		 					this.getResourceBundle().getText("buttonTextOK"),
		 					this.getResourceBundle().getText("buttonTextCancel"),
		 					function(){ this._SaveNewCancelDocuments(constant.EVENT_CANCEL); }.bind(this));*/
				 this._SaveNewCancelDocuments(constant.EVENT_CANCEL);
			},
		    
			/* =========================================================== */
			/* begin: internal methods                                     */
			/* =========================================================== */

			/**
			 * Binds the view to the object path and expands the aggregated line items.
			 * @function
			 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
			 * @private
			 */
			_onObjectMatched : function (oEvent) {
				
				var that = this;

				//Busca dados para compor o Process Flow
				this.getModel().metadataLoaded().then( function() {
									
					var oGlobalData = sap.ui.getCore().getModel("globalData").getData();
					that._setFlowData(oGlobalData);
		                 
		             var oFlowProcess = that.byId("processFlowPage");
		             oFlowProcess.updateModel();
		             
					//Message PopOver
		            that._initializeMessagePopOver();
		                   
				});
			},
			
			_setFlowData: function(sData){
				 var oModel = this.getModel("processFlow");
			
	             var oFlowData = oModel.getData();
	                 oFlowData.laneFlow = sData.ShipmentDetailToSalesPFLanes;
	                 oFlowData.nodeFlow = sData.ShipmentDetailToSalesPFNodes;
	                 
	             //Deixa botao cancelar visivel caso algum node tenha Status concluido
	             var sVisible = false;
	             oFlowData.nodeFlow.forEach(function(oSelectedNode) {
			    	if(oSelectedNode.Status == "Positive")
			    		sVisible = true;
	             });
	             
	             var oButton = this.byId("detailFlowButtonCancel");
	            
	                          
	             //Manter botao inativo para usuários nao utilizarem enquanto estiver na validação
	             //oButton.setVisible(sVisible);
	             
	             oModel.setData(oFlowData);
			},
			
			_initializeMessagePopOver: function(){
				this.oMessageTemplate = new MessagePopoverItem({
	        		type: '{type}',
	        		title: '{title}',
	        		description: '{description}'
	        	});
        	
	        	this.oMessagePopover = new MessagePopover({
	        		items: {
	        			path: '/',
	        			template: this.oMessageTemplate
	        		}
	        	});
	        	
	        	this.setModel(new sap.ui.model.json.JSONModel(), 'messagePopOver');
			},
			
			_createMessagePopOver: function(oMessages){
				
				//Monta Mensagens
				var sMessages = [];
								
				oMessages.forEach(function(oItem) {
					sMessages.push({
						type: formatter.formatTypeMessagePopOver(oItem.severity),
						title: oItem.message,
						description: oItem.code
					});
				});
				
				//Seta Model no Objeto MessagePopOver
				var oViewModel = this.getModel("messagePopOver");
		        oViewModel.setData(sMessages);
		        this.oMessagePopover.setModel(oViewModel);
		        
		        //Set Text Button Message
		        var oMsgBtn = this.byId("detailFlowButtonMsg");
		        oMsgBtn.setText(this.getResourceBundle().getText("detailFlowMsgTitleCount", [sMessages.length]));
			},
			
			_createProcessFlowModel: function(){
				var oProcessFlow = new JSONModel({
					laneFlow: [],
					nodeFlow: []
				});
				
				this.setModel(oProcessFlow, "processFlow");
			},
			
			_SaveNewCancelDocuments: function(sEvent){
				var that = this;
				var oDataModel = this.getModel();
				
				debugger;
				var oEntry = sap.ui.getCore().getModel("globalData").getData();
				
				// Set busy indicator during view binding
				var oViewModel = this.getModel("detailFlowView");
					oViewModel.setProperty("/busy", true);
					
					oEntry.Event = sEvent;
					
					oDataModel.create("/ZET_FBSD_ShipmentDetailSet", oEntry, {
						success: function(oData, oResponse){ 
							that._setGlobalModel(oData);
								
							var oGlobalData = sap.ui.getCore().getModel("globalData").getData();
							that._setFlowData(oGlobalData);
								
							var oFlowProcess = that.byId("processFlowPage");
					        oFlowProcess.updateModel();
							    	
							oViewModel.setProperty("/busy", false);
							MessageToast.show(that.getResourceBundle().getText("detailFlowMessageSucessSave"));	
						}, 
						error: function(oError){ 	            		
							try{
								var sMsg = JSON.parse(oError.responseText);
								that._createMessagePopOver(sMsg.error.innererror.errordetails);
								MessageBox.error(that.getResourceBundle().getText("detailFlowMessageErroMessageSave"), 
						                  {styleClass: that.getOwnerComponent().getContentDensityClass()});
							}catch(err){};
							oViewModel.setProperty("/busy", false);
						} 
					});
			}
		});

	}
);