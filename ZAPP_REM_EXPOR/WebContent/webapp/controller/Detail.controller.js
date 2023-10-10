/*global location */
sap.ui.define([
		"nasa/ui5/remessasExportacao/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"nasa/ui5/remessasExportacao/model/formatter",
		"nasa/ui5/remessasExportacao/model/constants",
		"sap/m/MessageBox",
		"sap/m/MessageToast",
		'sap/m/MessagePopover',
		'sap/m/MessagePopoverItem'
	], function (BaseController, JSONModel, History, formatter, constants, MessageBox, MessageToast, MessagePopover, MessagePopoverItem ) {
		"use strict";

		return BaseController.extend("nasa.ui5.remessasExportacao.controller.Detail", {

			formatter: formatter,
		
			onInit : function () {

				this.setModel(this._createModel(), "detailView");
				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
				
				//Message PopOver
				this.initializeMessagePopOver();
				
				
				
				
				
				 //Set Fullscreen
				
	             var  origem   = location.hash; // str a procurar
	             var  caminho  = "ZET_FBSD_ShipmentDetailSet"; //expressao a encontrar
	             
	             if (origem.search(caminho) > -1) {
					
	            	 var FullMode = this.getOwnerComponent().getAggregation("rootControl").byId("idAppControl");
						
						FullMode.setMode("HideMode");                	 
	             }; 
				
				
				
				
				
			},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */
			onFullScreenPage: function(oEvent){
				
				var oSplitApp = this.getOwnerComponent().getAggregation("rootControl").byId("idAppControl");
				var oFullScreen = (oSplitApp.getMode() == "HideMode" ? false : true);
				
				if (oFullScreen) {
					oSplitApp.setMode("HideMode");
				} else {
					oSplitApp.setMode("ShowHideMode");
				}
					var sIcon = (oFullScreen ? "sap-icon://exit-full-screen" : "sap-icon://full-screen");
					var oButton = this.byId(oEvent.mParameters.id);
					oButton.setIcon(sIcon);
			},
			
			onListUpdateFinished : function (oEvent) {
				var sTitle,
					iTotalItems = oEvent.getParameter("total"),
					oViewModel = this.getModel("detailView");

				// only update the counter if the length is final
				if (this.byId("lineItemsList").getBinding("items").isLengthFinal()) {
					if (iTotalItems) {
						sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
					} else {
						//Display 'Line Items' instead of 'Line items (0)'
						sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
					}
					oViewModel.setProperty("/lineItemListTitle", sTitle);
				}
			},

			 onHandleIconTabBarSelect: function(oEvent){
			   	var vMode = this.byId(oEvent.mParameters.selectedKey).getIcon() == "sap-icon://activities" ? true : false;
			   	this.byId("itensButtonMsg").setVisible(vMode);
			   	this.byId("itensButtonNew").setVisible(vMode);
//			   	this.byId("itensButtonSync").setVisible(vMode);
			   	this.byId("itensButtonSync").setVisible(false);
//			   	this.byId("itensButtonDelete").setVisible(vMode);
			 }, 
			    
		   
			 
			 
		    onNavBack : function() {
		    	 var sPreviousHash = History.getInstance().getPreviousHash();

		         if (sPreviousHash !== undefined) {
		           history.go(-1);
		         } else {
		           this.getRouter().navTo("master", {}, true);
		         }
		     },
			 
			 
			 
		     onItensEmbarqueButtons: function(oEvent){
		    	 var vMode;
		    	 // .substr(11) = "sap-icon://"
		    	 switch(oEvent.oSource.getIcon().substr(11)) {
				    case "documents":
				    	vMode = "I"; //Insert
				    	break;
				    case "synchronize":
				    	vMode = "U"; //Update
				    	break;
				    case "inspect-down":
				    	vMode = "D"; //Delete
				    	break;				        				
				};
		    	 this._actionItensRemessa(vMode);
		     },
		    
			 onHandleMessagePopover: function (oEvent) {
					this.oMessagePopover.openBy(oEvent.getSource());
			 },
			 
			 
		     onSearch: function(oEvent){
		    	 var sValue = oEvent.getParameter("query");
                 var aFilters = [];

                 if (sValue) {
                   var oFilter = null;
                   oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("SearchString", sap.ui.model.FilterOperator.EQ, sValue)], false);
                   aFilters.push(oFilter);
                 }

                 var oTable = this.byId("shipDetailTable"),
                 	 oBinding = oTable.getBinding("items");
                 
                 oBinding.filter(aFilters);
		     },
		     
		     
			 
		 	onHandleGoApp: function(oEvent){
				
				 var sPath = this.getView().getElementBinding().getPath(),
				     oResourceBundle = this.getResourceBundle(),
					 oObject = this.getView().getModel().getObject(sPath);
				 
				 var buttonsGoApp = [
				                     { id:'detailViewMonitorApp', semantic: 'NasaMonitor' },
				                     { id:'detailViewIntercompSalesApp', semantic: 'VendaIntercompany' },
				                     { id:'detailViewDeliveryApp', semantic: 'NasaRemessa' },
				                     { id:'detailViewExportRegisterApp', semantic: 'NasaExportRegistration' },
				                     { id:'detailViewTransportApp', semantic: 'NasaTransporte' },
				                     { id:'detailViewSaidaMercadoriaApp', semantic: 'NasaSM' },
				                     { id:'detailViewInvoicingApp', semantic: 'NasaInvoicing' },
				                     { id:'detailViewOffshoreReceivingApp', semantic: 'NasaOffshoreReceiving' }
				 					]; 

				 var oSelectedButton = buttonsGoApp.find(function (oItem) {

						//return oEvent.getSource().getId().indexOf(oItem.id) !== -1;
					  	return oEvent.getParameters().item.sId.indexOf(oItem.id) !== -1;
		 
				  });
				 
				 var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
				 var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
				  target: {
							semanticObject: oSelectedButton.semantic,
							action: "display"
						  }
				   })) || "";
				  
				  hash += "&" + '/ZET_FBSD_ShipmentDetailSet' + "('" + oObject.Nrembarque + "')";
				  oCrossAppNavigator.toExternal({
							  target: {
							  shellHash: hash
						  }
				   }); 
			 },
		     
			/* =========================================================== */
			/* begin: internal methods                                     */
			/* =========================================================== */

			
			_onObjectMatched : function (oEvent) {
				
				var sNrembarque =  oEvent.getParameter("arguments").Nrembarque;

				this.getModel().metadataLoaded().then( function() {
					var sObjectPath = this.getModel().createKey("ZET_FBSD_ShipmentDetailSet", {
							Nrembarque : sNrembarque
						});
					this._bindView("/" + sObjectPath);
					
					//Message PopOver
		            this.initializeMessagePopOver();
				}.bind(this));
			},

			/**
			 * Binds the view to the object path. Makes sure that detail view displays
			 * a busy indicator while data for the corresponding element binding is loaded.
			 * @function
			 * @param {string} sObjectPath path to the object to be bound to the view.
			 * @private
			 */
			_bindView : function (sObjectPath) {
				// Set busy indicator during view binding
				var oViewModel = this.getModel("detailView");

				// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
				oViewModel.setProperty("/busy", false);

				this.getView().bindElement({
					path: sObjectPath,
					expand: "ShipmentDetailToItems",
					expand: "ShipmentDetailToDeliveryExport",
					events: {
						change: this._onBindingChange.bind(this),
						dataRequested: function () {
							oViewModel.setProperty("/busy", true);
						},
						dataReceived: function () {
							oViewModel.setProperty("/busy", false);
						}
					}
				});
			},

			_onBindingChange : function () {
				var oView = this.getView(),
					oElementBinding = oView.getElementBinding();

				// No data for the binding
				if (!oElementBinding.getBoundContext()) {
					this.getRouter().getTargets().display("detailObjectNotFound");
					// if object could not be found, the selection in the master list
					// does not make sense anymore.
					this.getOwnerComponent().oListSelector.clearMasterListSelection();
					return;
				}

				var sPath = oElementBinding.getPath();
				this.getOwnerComponent().oListSelector.selectAListItem(sPath);
				
			},
		
			_createModel: function(){
				return new JSONModel({
					busy: false,
					delay: 0,
					itemListTableTitle: this.getResourceBundle().getText("detailTitleTableItemList"),
					lineItemListTitle: this.getResourceBundle().getText("detailLineItemTableHeading"),
					listTpEmb: constants.LISTTPEMB,
					listTpNav: constants.LISTTPNAV,
					listTipoVenda: constants.LISTTIPOVENDA
				});
			},
					
			_actionItensRemessa: function(pMode){		
	    		var oTable = this.getView().byId("itensEmbarqueTable");
	    		var oItems = oTable.getSelectedContexts();
	    		if(oItems[0]){
	    			var oEntry = [];
					var oThat = this;
										
			        var oEntry = {
	        				Event: pMode,
							ShipmentDetailToItems:[]
	        			};
					
			        for(var i=0; i<oItems.length; i++){
						var oObject = oItems[i].getObject();
						if(!!oObject){
							oEntry.ShipmentDetailToItems.push({
								Nrembarque: oObject.Nrembarque,
								ShpmtIt: oObject.ShpmtIt,
								VbelnVa: oObject.VbelnVa,
								PosnrVa: oObject.PosnrVa,
								VbelnVl: oObject.VbelnVl								
							});
						}
					}
					
					switch(pMode) {
					    case "I": // Insert
							this.onMessageConfirmation( 
									this.getResourceBundle().getText("itemEmbarquePopupCriar"),
									this.getResourceBundle().getText("popupButtonTextOk"),
				 					this.getResourceBundle().getText("popupButtonTextCancel"), 
				 					function(){ this._RemessaAction(oThat, oEntry, "itemEmbarqueMsgCriadoSucesso")}.bind(this) );	
					    	break;
					    case "U": // Update
					    	this.onMessageConfirmation( 
									this.getResourceBundle().getText("itemEmbarquePopupAtualizar"),
									this.getResourceBundle().getText("popupButtonTextOk"),
				 					this.getResourceBundle().getText("popupButtonTextCancel"), 
				 					function(){ this._RemessaAction(oThat, oEntry, "itemEmbarqueMsgAtualizadoSucesso")}.bind(this) );	
					    	break;
					    case "D": // Delete
							this.onMessageConfirmation( 
									this.getResourceBundle().getText("itemEmbarquePopupDeletar"),
									this.getResourceBundle().getText("popupButtonTextOk"),
				 					this.getResourceBundle().getText("popupButtonTextCancel"), 
				 					function(){ this._RemessaAction(oThat, oEntry, "itemEmbarqueMsgDeletadoSucesso")}.bind(this) );	
					    	break;				        				
					};
					
	    		}else{
	    			this.onMessageDisplay("E","itemEmbarqueMsgSelectError");
	    			return;
	    		};
	    		
			},
			
			_RemessaAction: function(pThat, pEntry, pI18n){
				
				var oDataModel = pThat.getView().getModel(),
					oViewModel = pThat.getView().getModel("detailView");
				
				oViewModel.setProperty("/busy", true);
				
				oDataModel.create("/ZET_FBSD_ShipmentDetailSet", pEntry, {
					success: function(oResponse){
						oViewModel.setProperty("/busy", false);
						oDataModel.refresh();
						pThat.onMessageDisplay("S",pI18n); 
					}, 
					error: function(oResponse){
					//	pThat._displayModelError(pThat, oResponse);				
						try{
							var sMsg = JSON.parse(oResponse.responseText);
							pThat._displayModelError(sMsg.error.innererror.errordetails);	
							//that._createMessagePopOver(sMsg.error.innererror.errordetails);
						
							MessageBox.error(that.getResourceBundle().getText("itemEmbarqueMsgErrorSave"), 
					          {styleClass: that.getOwnerComponent().getContentDensityClass()});
							}catch(err){};
							oViewModel.setProperty("/busy", false);
						}
				 
				});	
			},	
			
//			_displayModelError: function(pThat, pResponse){
//				var oReponseMsg = JSON.parse(pResponse.responseText);
//				pThat.createMessagePopOver(oReponseMsg);
//				pThat.onMessageDisplay("E",oReponseMsg.error.message.value); 
			
//			Criar mensagens Popover
			_displayModelError: function(oMessages){
			
//				DESENVOLVER A REMOCAO DAS MSGS DE ERRO INUTEIS
//			     for(var i=0;i < oMessages.length; i++){
//					
//			    	 oMessages[i].code
//						
//						  oMessages[2].code
//
//						  "/IWBEP/CX_MGW_BUSI_EXCEPTION"
//				
//						
//						  //oMessages[2] = "";
//			    	 oMessages.splice(2)
//						
//					}
//				
//				
//				
				
				
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
			    var oButtonMsg = this.byId("itensButtonMsg");
			    oButtonMsg.setText(this.getResourceBundle().getText("itensButtonMsg", [sMessages.length]));
			
			}			
			
			
			
			
			
			
		});
	}
);