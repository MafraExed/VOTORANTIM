/*global location */
sap.ui.define([
		"nasa/ui5/saidaMercadoria/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"nasa/ui5/saidaMercadoria/model/formatter",
		"nasa/ui5/saidaMercadoria/model/constants",
		"sap/m/Dialog",
		"sap/m/Button",
		"sap/m/DatePicker",
		"sap/m/MessageBox",
		"sap/m/MessageToast"
	], function (BaseController, JSONModel, History, formatter, constants, Dialog, Button, DatePicker, MessageBox, MessageToast) {
		"use strict";

		return BaseController.extend("nasa.ui5.saidaMercadoria.controller.Detail", {

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
		    onNavBack : function() {
		    	 var sPreviousHash = History.getInstance().getPreviousHash();

		         if (sPreviousHash !== undefined) {
		           history.go(-1);
		         } else {
		           this.getRouter().navTo("master", {}, true);
		         }
		     },
		     
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
			
			onPressButton: function(oEvent){
				switch(oEvent.oSource.getIcon().substr(11)) {
				    case "journey-depart": // Executar
				    	if(this._checkSelecao()){
							this.onMessageConfirmation( 
									this.getTextI18n("itemEmbarquePopupExecutar"),
									this.getTextI18n("popupButtonTextOk"),
				 					this.getTextI18n("popupButtonTextCancel"), 
				 					this._executarSaida.bind(this));					    		
				    	}else{
				    		this.onMessageDisplay("E","msgNoSelect");				    		
				    	}
				    	break;
				    case "reset": // Estornar
//				    	if(this._checkSelecao()){
//					    	this.onMessageConfirmation( 
//									this.getTextI18n("itemEmbarquePopupEstornar"),
//									this.getTextI18n("popupButtonTextOk"),
//				 					this.getTextI18n("popupButtonTextCancel"), 
//				 					this._estornarSaida.bind(this));	
//				    	}else{
//				    		this.onMessageDisplay("E","msgNoSelect");				    		
//				    	}
				    	break;				        
				}	
			},
            
	
			
			 onHandleMessagePopover: function (oEvent) {
					this.oMessagePopover.openBy(oEvent.getSource());
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

	
			_bindView : function (sObjectPath) {
				// Set busy indicator during view binding
				var oViewModel = this.getModel("detailView");

				// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
				oViewModel.setProperty("/busy", false);

				this.getView().bindElement({
					path : sObjectPath,
					expand: "ShipmentDetailToItems",
					expand: "ShipmentDetailToDeliveryExport",
					events: {
						change : this._onBindingChange.bind(this),
						dataRequested : function () {
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
			
			_getDataDetail: function(){
				var oElementBinding = this.getView().getElementBinding();
				var sData = this.getModel().getObject(oElementBinding.sPath);
				return sData;
			},
			
			_preencherDadosSaida: function(){
//	    		var oTable = this.getView().byId("itensEmbarqueTable"); Versao anteriror desconsiderada pela remoção da tabbar Itens
	    		var oTable = this.getView().byId("RemessasEmbarqueTable");
	    		var oItems = oTable.getSelectedContexts();
	    		if(oItems[0]){
	    			var oEntry = [];					
			        oEntry = { Nrembarque: this._getDataDetail().Nrembarque,
			        		   PostDt: "", //_callScreenInputDate
			        		   Event: "",
			        		   ShipmentDetailToDeliveryExport:[]
	        				  };
					
			        for(var i=0; i<oItems.length; i++){
						var oObject = oItems[i].getObject();
						if(!!oObject){
							oEntry.ShipmentDetailToDeliveryExport.push({
								Nrembarque: oObject.Nrembarque,
								ShpmtIt: oObject.ShpmtIt,
								VbelnVl: oObject.VbelnVl,								
								Docref:  oObject.Docref,								
								DocrefItem: oObject.DocrefItem,								
								//Docref:  oObject.VbelnVa,								
								//DocrefItem: oObject.PosnrVa,								
								Mtsnr: oObject.Mtsnr,								
							});
						}
					}
					
	    		}
	    		return oEntry;
			},
			
			_createModel: function(){
				return new JSONModel({
					busy: false,
					delay: 0,
					itemListTableTitle: this.getTextI18n("detailTitleTableItemList"),
					lineItemListTitle: this.getTextI18n("detailLineItemTableHeading"),
					listTpEmb: constants.LISTTPEMB,
					listTpNav: constants.LISTTPNAV,
					listTipoVenda: constants.LISTTIPOVENDA
				});
			},
			
			_executarSaida: function(){
				var oEntry = this._preencherDadosSaida();
				oEntry.Event = "EXECUTAR_SM";	
				this._callService("itemEmbarqueMsgExecutadoSucesso", oEntry);
			},
			
//			_estornarSaida: function(){
//				var oEntry = this._preencherDadosSaida();
//				oEntry.Event = "ESTORNAR_SM";
//				this._callService("itemEmbarqueMsgEstornadoSucesso", oEntry);	
//			},
			
			_modelCreate: function(pIdMsg, pEntry){
								
				var oDataModel = this.getModel(),
//					oViewModel = oThat.getView().getModel("detailView");
					oViewModel = this.getView().getModel("detailView");
				
				oViewModel.setProperty("/busy", true);
				
				oDataModel.create("/ZET_FBSD_ShipmentDetailSet", pEntry, {
					success: function(){ 
						oViewModel.setProperty("/busy", false);
						oDataModel.refresh();
						this.onMessageDisplay("S",pIdMsg); 
					}.bind(this), 
					error: function(oResponse){ 
						oViewModel.setProperty("/busy", false);
						var oReponseMsg = JSON.parse(oResponse.responseText)
						this.createMessagePopOver(oReponseMsg);
						this.onMessageDisplay("E",oReponseMsg.error.message.value); }.bind(this) 
				});			
			},
			
			_checkSelecao: function(){
	    		var oTable = this.getView().byId("RemessasEmbarqueTable");
	    		return oTable.getSelectedContexts().length == 0 ? false : true;
			},
			
			_callService: function(pIdMsg, pEntry){
				
				var oDatePicker = new DatePicker({valueFormat:"yyyy-MM-dd", displayFormat:"short"});
				var pressDialog = new Dialog({
						title: this.getTextI18n("itemEmbarquePopupDtLancamento"),
						type: 'Message',
						draggable: true,
						content: oDatePicker,
						beginButton: new Button({
							text: this.getTextI18n("itemEmbarquePopupButtonOK"),
							press: function (oEvent) {
								pressDialog.close();
								pEntry.PostDt= oDatePicker.getDateValue();
								this._modelCreate(pIdMsg, pEntry);
							}.bind(this) })
					}); 
					pressDialog.open();
			}
		});
});