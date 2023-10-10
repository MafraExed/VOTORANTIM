/*global location */
sap.ui.define([
		"nasa/ui5/transporte/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"nasa/ui5/transporte/model/formatter",
		"nasa/ui5/transporte/model/constants",
		"sap/m/MessageBox",
		"sap/m/MessageToast",
	], function (BaseController, JSONModel, History, formatter, constants, MessageBox, MessageToast ) {
		"use strict";

		return BaseController.extend("nasa.ui5.transporte.controller.Detail", {

			formatter: formatter,
		
			onInit : function () {

				this.setModel(this._createModel(), "detailView");
				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
				
				
				
				 //Set Fullscreen
				
	             var  origem   = location.hash; // str a procurar
	             var  caminho  = "ZET_FBSD_ShipmentDetailSet"; //expressao a encontrar
	             
	             if (origem.search(caminho) > -1) {
					
	            	 var FullMode = this.getOwnerComponent().getAggregation("rootControl").byId("idAppControl");
						
						FullMode.setMode("HideMode");                	 
	             }; 
	             
	             
				
			},//END ON INIT

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
			   	var vMode = this.byId(oEvent.mParameters.selectedKey).getIcon() == "sap-icon://activities" ? false : true;
			   	this.byId("itensButtonNew").setVisible(!vMode);
			   	this.byId("itensButtonDelete").setVisible(vMode);
			 }, 
			    
		    onNavBack : function() {
		    	 var sPreviousHash = History.getInstance().getPreviousHash();

		         if (sPreviousHash !== undefined) {
		           history.go(-1);
		         } else {
		           this.getRouter().navTo("master", {}, true);
		         }
		     },
		     			    
		     onActionButtons: function(oEvent){
		    	 var vMode;
		    	 // .substr(11) = "sap-icon://"
		    	 switch(oEvent.oSource.getIcon().substr(11)) {
		    	 //case "create":
				    case "shipping-status":  
				    	vMode = "I"; //Insert
				    	break;
				    case "delete":
				    	vMode = "D"; //Delete
				    	break;				        				
				};
				
					
				var oTable = this.getView().byId("remessasExportacaoTable");
				
				//Verifica se pelo menos 1 item foi selecionado
	    		if(oTable.getSelectedItems().length >= 1){
	    	
	    			this._actionButtons(vMode);
	    			
	    		}else{
	    			this.onMessageDisplay("E","remessasExportacaoMessageSelectError");
	    			return;
	    		};	
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

		     _actionButtons: function(pMode){
		    	var oThat = this;
				switch(pMode) {
				    case "I": // Insert
						this.onMessageConfirmation( 
								this.getResourceBundle().getText("remessasExportacaoPopupInsert"),
								this.getResourceBundle().getText("popupButtonTextOk"),
			 					this.getResourceBundle().getText("popupButtonTextCancel"), 
			 					function(){ this._criarTransporte() }.bind(this) )
				    	break;
				    case "D": // Delete
						this.onMessageConfirmation( 
								this.getResourceBundle().getText("dadosTransportePopupDelete"),
								this.getResourceBundle().getText("popupButtonTextOk"),
			 					this.getResourceBundle().getText("popupButtonTextCancel"), 
			 					function(){ this._deletarTransporte() }.bind(this) )
				    	break;				        
				}
		     },
		     
			/**
			 * Binds the view to the object path and expands the aggregated line items.
			 * @function
			 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
			 * @private
			 */
			_onObjectMatched : function (oEvent) {
				var sNrembarque =  oEvent.getParameter("arguments").Nrembarque;

				this.getModel().metadataLoaded().then( function() {
					var sObjectPath = this.getModel().createKey("ZET_FBSD_ShipmentDetailSet", {
							Nrembarque : sNrembarque
						});
					this._bindView("/" + sObjectPath);
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
					expand: "ShipmentDetailToDeliveryExport",
					expand: "ShipmentDetailToTransportData",
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
				});
			},
						
			_criarTransporte: function(){
				
				var oThat = this;
				var oEntry = {};
				var oDataModel = this.getView().getModel(),
					oViewModel = oThat.getView().getModel("detailView");
		        var sPathDetail = this.getView().getElementBinding().getPath();
//		        var sPathModel = "/ZET_FBSD_DeliveryExport(Nrembarque='" + oDataModel.getObject(sPathDetail).Nrembarque + "')";
//		        var sPathModel = "/ZET_FBSD_DeliveryExport";
		        var sPathModel = "/ZET_FBSD_ShipmentDetailSet";
		       // ShipmentDetailToDeliveryExport
		        var NrEmb = oDataModel.getObject(sPathDetail).Nrembarque;		
		        var oTable = this.getView().byId("remessasExportacaoTable");
	    		var oItems = oTable.getSelectedContexts();	
	    		
	    		oViewModel.setProperty("/busy", true);
		        		
		        oEntry = {
		        			Nrembarque: NrEmb,
		        			ShipmentDetailToDeliveryExport:[]
		        		};
		        		
		           for(var i=0; i<oItems.length; i++){
					var oObject = oItems[i].getObject();
					if(!!oObject){
						oEntry.ShipmentDetailToDeliveryExport.push({
							Nrembarque: oObject.Nrembarque,
							ShpmtIt: oObject.ShpmtIt,
							VbelnVa: oObject.VbelnVa,
							PosnrVa: oObject.PosnrVa,
							VbelnVl: oObject.VbelnVl								
						});
					}
				}
		        
				oDataModel.create(sPathModel, oEntry, {
					success: function(){ 
						oViewModel.setProperty("/busy", false);
						oDataModel.refresh();
						oThat.onMessageDisplay("S","remessasExportacaoMsgCriadoSucesso"); 
					}, 
					error: function(oResponse){ 
						oViewModel.setProperty("/busy", false);
						oThat._displayModelError(oThat, oResponse);
					} 
				});	
			},
			
			_deletarTransporte: function(){
				var oThat = this;
				var oDataModel = this.getView().getModel(),
					oViewModel = pThat.getView().getModel("detailView");
		        var sPathDetail = this.getView().getElementBinding().getPath();
		        var sPathModel = "/ZET_FBSD_DeliveryExport(Nrembarque='" + oDataModel.getObject(sPathDetail).Nrembarque + "')";
		        
		        oViewModel.setProperty("/busy", true);
		        
				oDataModel.remove(sPathModel, { method: "DELETE",
					success: function() {
						oViewModel.setProperty("/busy", false);
						oDataModel.refresh();
						oThat.onMessageDisplay("S","dadosTransporteMsgDeletadoSucesso"); 
					},
					error: function(oResponse) {
						oViewModel.setProperty("/busy", false);
						oThat._displayModelError(oThat, oResponse);
					}
				});		
			},
			
			_displayModelError: function(pThat, pResponse){
				var oReponseMsg = JSON.parse(pResponse.responseText);
				pThat.createMessagePopOver(oReponseMsg);
				pThat.onMessageDisplay("E",oReponseMsg.error.message.value); 
			}
			
		});
	}
);