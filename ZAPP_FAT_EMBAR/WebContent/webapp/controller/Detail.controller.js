/*global location */
sap.ui.define([
					"nasa/ui5/faturamentoEmbarque/controller/BaseController",
					"sap/ui/model/json/JSONModel",
					"sap/ui/core/routing/History",
					"nasa/ui5/faturamentoEmbarque/model/formatter",
					"nasa/ui5/faturamentoEmbarque/model/constants",
					"sap/m/MessageBox",
					"sap/m/MessageToast",
					"sap/m/MessagePopover",
					"sap/m/MessagePopoverItem",
	], function (	
					BaseController, 
					JSONModel, 
					History, 
					formatter, 
					constants, 
					MessageBox, 
					MessageToast, 
					MessagePopover, 
					MessagePopoverItem) {
		
		"use strict";

		return BaseController.extend("nasa.ui5.faturamentoEmbarque.controller.Detail", {

			formatter: formatter,
		
			onInit : function () {
				debugger;
				
				// Model used to manipulate control states. The chosen values make sure,
				// detail page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				var oViewModel = new JSONModel({
					busy : false,
					delay : 0,
					tableVendaExport: [],
					itemListTableTitle : this.getResourceBundle().getText("detailTitleTableItemList")
				});
				
				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
				this.setModel(oViewModel, "detailView");
			//	this.setModel(oViewModel, "oHead");
				
				//Message PopOver
				this._initializeMessagePopOver();
				
				
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
	
			onFullScreenPage: function(){
				var that = this;
				var oSplitApp = this.getOwnerComponent().getAggregation("rootControl").byId("idAppControl");
				var oFullScreen = (oSplitApp.getMode() == constants.HIDE_MODE ? false : true);
				
				if (oFullScreen) {
					this.onHideUnhideMaster(constants.HIDE_MODE);
				} else {
					this.onHideUnhideMaster(constants.UNHIDE_MODE);
				}
				
				var buttonsToChange = ['ListItemFullButton',
									   'ListItemVendaExportFullButton',
									   'ListItemFaturaFullButton'];
				
				jQuery.each(buttonsToChange, function(index, element){
					
					var oButtonEdit = that.byId(element);				
			        		        
					if(oFullScreen) { 
						oButtonEdit.setIcon("sap-icon://exit-full-screen");
						oButtonEdit.setTooltip( that.getResourceBundle().getText("detailviewToolTipFullScreen") );
					} else { 
						oButtonEdit.setIcon("sap-icon://full-screen");
						oButtonEdit.setTooltip( that.getResourceBundle().getText("detailviewToolTipHideScreen" ) );
					}
				});
			},
			
		    onNavBack : function() {
		    	 var sPreviousHash = History.getInstance().getPreviousHash();

		         if (sPreviousHash !== undefined) {
		           history.go(-1);
		         } else {
		           this.getRouter().navTo("master", {}, true);
		         }
		     },
		     
		     onHandleItemFatura: function(oEvent){		    	 

//		    	var that = this;
//		    	var oModel = this.getView().getModel();
	 				
		    	 var oItem = oEvent.getSource().getBindingContext("detailView").getObject();
		    					
		    	this.onHideUnhideMaster(constants.HIDE_MODE);
 				this.getRouter().navTo("objectItems", {	Nrembarque	: oItem.Nrembarque, 
 														VbelnVa		: oItem.VbelnVa 
 													   }, true);
 							
		     },
		     
		     onHandleSelectFilterBar: function(oEvent){
		    	 var that = this;
		    	 
		    	 var sKey = oEvent.getParameters().key;
		    	 
		    	 var buttonsToChange = [//'detailViewEstornoBtn',
										'detailViewButtonMsg'];
					
				 jQuery.each(buttonsToChange, function(index, element){
						var oButtonEdit = that.byId(element);
						oButtonEdit.setVisible(sKey == "tabFatura" ? true : false);
				 });

		     },
		     
		     onHandleMessagePopover: function (oEvent) {
				  this.oMessagePopover.openBy(oEvent.getSource());
			 },
			 
//			 onHandleEstornar: function(oEvent){
//				//Verifica se algum item foi selecionado
//					var oTable = this.getView().byId("faturaTable");
//					if(!oTable.getSelectedItems().length){
//						MessageBox.error(this.getResourceBundle().getText("detailMessageErroSelectError"), 
//				                  {
//				                styleClass: this.getOwnerComponent().getContentDensityClass()
//				                  }
//				                );
//						return;
//					}
//				 
//				 this.onMessageConfirmation(this.getResourceBundle().getText("detailQuestionEstornar"),
//		 					this.getResourceBundle().getText("buttonTextOK"),
//		 					this.getResourceBundle().getText("buttonTextCancel"), 
//		 					this._estornarBill.bind(this));
//			 },
			 			 
			  onSearch: function(oEvent){
			    	 var sValue = oEvent.getParameter("query");
	                 var aFilters = [];

	                 if (sValue) {
	                   var oFilter = null;
	                   oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("SearchString", sap.ui.model.FilterOperator.EQ, sValue)], false);
	                   aFilters.push(oFilter);
	                 }

	                 var oTable = this.byId("shipDetailVendaExportTable"), 
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
					path : sObjectPath,
					expand: "ShipmentDetailToItems",
					expand: "ShipmentDetailToInvoiceReport",
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

				var sPath = oElementBinding.getPath(),
					oResourceBundle = this.getResourceBundle(),
					oObject = oView.getModel().getObject(sPath);

				this.getOwnerComponent().oListSelector.selectAListItem(sPath);
				
				//Busca Vendas Exporta��o
				this._get_vendas_export(oObject.Nrembarque);
				
				//Message PopOver
				this._initializeMessagePopOver();

			},
			
			_get_vendas_export: function(sNrembarque){
                
            	var oDataModel = this.getModel(),
            		oViewModel = this.getModel("detailView");
            	  
            	var oFilter = null;
            	var aFilters = [];
                oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("Nrembarque", sap.ui.model.FilterOperator.EQ, sNrembarque)], false);
                aFilters.push(oFilter);
                
                //ZET_FBSD_ShipmentDetailSet
	          	oDataModel.read("/ZET_FBSD_SalesExportSet", {
	          		filters: aFilters,
	          		success: function (oData) {
	                    if (!!oData.results.length){
	                    	oViewModel.setProperty("/tableVendaExport", oData.results);
	                    }
	                }
	             });
			},
			
//			_estornarBill: function(){
//				var that = this;
//				
//				//Message PopOver
//				this._initializeMessagePopOver();
//				
//				//Get Detail
//				var oView = this.getView(),
//				oElementBinding = oView.getElementBinding();
//				var sPath = oElementBinding.getPath(),
//				oDataItem = oView.getModel().getObject(sPath);
//				
//				var oDataModel = this.getModel(),
//        		oViewModel = this.getModel("detailView");
//				
//				oViewModel.setProperty("/busy", true);
//				
//				//Get Itens Selecionados
//				var oTable = this.byId("faturaTable");
//				var oItems = oTable.getSelectedContexts();
//				
//				var oEntry = { 
//						Nrembarque	: oDataItem.Nrembarque,
//						ShipmentDetailToInvoiceReport:[]
//					  };
//				
//				for(var i=0;i < oItems.length; i++){
//					var oObject = oItems[i].getObject();
//					oEntry.ShipmentDetailToInvoiceReport.push({
//																	Nrembarque	: oDataItem.Nrembarque,
//																	VbelnVf		: oObject.VbelnVf,
//															  });
//				}
//
//				oDataModel.create("/ZET_FBSD_ShipmentDetailSet", oEntry, {
//		    		  success: function(oData, oResponse){
//			    			that._deselect_all_table();
//			    			oDataModel.refresh();
//			    			MessageToast.show(that.getResourceBundle().getText("detailMessageSuccessEstorno"));	
//			    			oViewModel.setProperty("/busy", false);
//						}, 
//						error: function(oError){ 
//							try{
//								var sMsg = JSON.parse(oError.responseText);
//								that._createMessagePopOver(sMsg.error.innererror.errordetails);
//								MessageBox.error(that.getResourceBundle().getText("detailErroMessageEstorno"), 
//						                  {styleClass: that.getOwnerComponent().getContentDensityClass()});
//							}catch(err){};
//							oViewModel.setProperty("/busy", false);
//						}
//		          });
//			},
			
			_deselect_all_table: function(){
				// Mantem a linha dos itens concluidos nao selecionadas
		    	 var oTable = this.getView().byId("faturaTable");
		    	 var oSelectedItems = oTable.getSelectedItems();
		    	  
		    	  oSelectedItems.forEach(function(oItem) {
		    		  oTable.setSelectedItem(oItem, false);		    	  	  
		    	  })
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
		    	  	
		        var oButtonMsg = this.byId("detailViewButtonMsg");
		        oButtonMsg.setText(this.getResourceBundle().getText("detailItemVendaExportMsgTitleCount", 
		        													[sMessages.length]));
			}
			
		});

	}
);