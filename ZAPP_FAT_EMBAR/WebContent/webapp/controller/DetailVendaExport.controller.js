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

		return BaseController.extend("nasa.ui5.faturamentoEmbarque.controller.DetailVendaExport", {

			formatter: formatter,
		
			onInit : function () {
				debugger;
				// Model used to manipulate control states. The chosen values make sure,
				// detail page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				
	
					var oViewModel = new JSONModel({
						busy : false,
						delay : 0,
						itemListTableVendaExportTitle : this.getResourceBundle().getText("detailTitleTableItemList"),
						itemsPartner: []
					});
					
					
//					//Popular o cabeçalho 
//					debugger;
//	
//					if (sap.ui.getCore().getModel("globalData") != undefined) {
//						
//					var oObject = sap.ui.getCore().getModel("globalData").getData();
//					var oNavio = sap.ui.getCore().getModel("globalData").getData().Dcrnv;
//					var oViagem = sap.ui.getCore().getModel("globalData").getData().Nvoyg;
//										
//					
//					var obj = {
//						Dcrnv : oNavio,	
//						Nvoyg : oViagem	
//					}
//					
//								
//					this.getView().setModel(obj,   "oHeader");			
//					sap.ui.getCore().setModel(obj, "oHeader");
//					
//					
//					//alert("Navio: "+ oNavio +" Viagem: "+ oViagem);
//					}
				
					
					
					
					this.getRouter().getRoute("objectItems").attachPatternMatched(this._onObjectMatched, this);
					this.setModel(oViewModel, "detailVendaExportView");
					
		
						//Message PopOver
					this._initializeMessagePopOver();
						
				
	
			},//END ON INIT
			
			
			onBeforeRendering : function () {
				this.byId('PageDetailFullButton').setVisible(false);
			},
						
			
			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */
		    onNavBack : function(oEvent) {	    	
		    	var oObject = oEvent.getSource().getBindingContext().getObject();
		    	debugger;
		    	//Show MASTER
//				this.onHideUnhideMaster(constants.UNHIDE_MODE);
				this.onHideUnhideMaster(constants.HIDE_MODE);
		    	
		    	 var sPreviousHash = History.getInstance().getPreviousHash();

		         if (sPreviousHash !== undefined) {
		           history.go(-1);
		         } else {
		           this.getRouter().navTo("object", { Nrembarque: oObject.Nrembarque }, true);
		         }
		     },
		     
				onHandlePopoverPartner: function(oEvent){					
					debugger;

					var that = this;
					
					var oDataPartners = [];
					var oModel = this.getView().getModel();
					var sPath = oEvent.getSource().getParent().getBindingContextPath();
					var oObject = oModel.getProperty(sPath);
		           
					var oViewModel = this.getModel("detailVendaExportView");
		            
					var sNrembarque = oObject.Nrembarque;
					var sVbelnVa = oObject.VbelnVa;
					var sPosnrVa = oObject.PosnrVa;
										
					//Set Items			    
				    sPath = "/ZET_FBSD_SalesExportItemPartnersSet?$filter=Nrembarque eq '" + sNrembarque + "' and ";
				    sPath += "VbelnVa eq '" + sVbelnVa + "'"; 
//				    sPath += "PosnrVa eq '" + sPosnrVa + "'"; 
				    
				    debugger;
				    oModel.read(sPath, {
			              success: function (oData) {
			            	  debugger;
			            	  if(!!oData.results.length){
				            	  oViewModel.setProperty("/itemsPartner", oData.results);
								  oViewModel.refresh(true);
			            	  }
			              }
			        });
				    
				    
				    //Open PopOver
					if (! this._PopOverPartner) {
						  var oView = this.getView();
						  this._PopOverPartner = sap.ui.xmlfragment(oView.getId(), "nasa.ui5.faturamentoEmbarque.view.fragments.PopOverPartner", this);
		            }
				     
				    this.getView().addDependent(this._PopOverPartner);
		            this._PopOverPartner.openBy(oEvent.getSource());
				},
				
				
				onHandleClosePartner: function(oEvent){
					if (this._PopOverPartner) 
						this._PopOverPartner.close();
				},
				
			    onHandleMessagePopover: function (oEvent) {
					this.oMessagePopover.openBy(oEvent.getSource());
				},
				
				onHandleCreateBill: function(oEvent){
					//Verifica se algum item foi selecionado
					var oTable = this.getView().byId("shipDetailItemVendaExportTable");
					if(!oTable.getSelectedItems().length){
						MessageBox.error(this.getResourceBundle().getText("detailMessageErroSelectError"), 
				                  {
				                styleClass: this.getOwnerComponent().getContentDensityClass()
				                  }
				                );
						return;
					}
					
					this.onMessageConfirmation(this.getResourceBundle().getText("detailVendaExportQuestionCreate"),
		 					this.getResourceBundle().getText("buttonTextOK"),
		 					this.getResourceBundle().getText("buttonTextCancel"), 
		 					this._createBill.bind(this));
				},
				
				
				
				onHandleSelectFilterBarVendasExport: function(oEvent){
					
			    	 var that = this;
			    	 
			    	 var sKey = oEvent.getParameters().key;
			    	 
			    	 var buttonsToChange = ['PageDetailFullButton'];
						
					 jQuery.each(buttonsToChange, function(index, element){
							var oButtonEdit = that.byId(element);
							oButtonEdit.setVisible(sKey == "tabVendaExport" ? true : false);
					 });
					
				},
				
				
			/* =========================================================== */
			/* begin: internal methods                                     */
			/* =========================================================== */

				_bindingHeader : function () {
					debugger;
					var oViewModel = that.getModel("detailVendaExportView");
					
					var oModelx = this.getView().getModel("detailVendaExportView");
					//var sPath = oEvent.getSource().getParent().getBindingContextPath();
				//	var oObject = oModel.getProperty(sPath);
					var oTablePrice = oModelx.getData();
					var that = this;
					var oHeaderModel = {
							Dcrnv: "",
							Nvoyg: "",
							Ptorg: "",
							Dteta: "",
							Peso: "",
							Unit: "",
							Status: "" 
							};
					
					this.setModel(new sap.ui.model.json.JSONModel(), "oHead");
					
					var LocalModel = that.getView().getModel("detailVendaExportView");			
				
					var oModel1 =  that.getModel("oHead");	
					var oModel2 =  this.getModel();	
					
					
				//	var oViewModel = this.getModel("oHeader");
	            //    oHeaderModel = oViewModel.getData();
				//	oViewModel.setData(oHeaderModel);
					
					
					var sPath = "/ZET_FBSD_ShipmentListSet(Dcrnv='ARBORELLA',Nvoyg='MLS25',Ptorg='STOS',Nrembarque='0000000303')";
				
					try {						
						debugger;
						
					    oModel2.read(sPath, {
				              success: function (Dados) {
				            	  debugger;
				            	  if(!!oData.results.length){
					            	  debugger;
									  oViewModel.refresh(true);
				            	  }
				              }
				        });
												
						
					} catch (e){
					
						console.log("erromodel2");
						
					}
						
						try {
							
							debugger;
							
						    oModel1.read(sPath, {
					              success: function (Dados) {
					            	  debugger;
					            	  if(!!oData.results.length){
						            	  debugger;
										  oViewModel.refresh(true);
					            	  }
					              }
					        });
							
							
							
						} catch (e) {
						
							// TODO: handle exception
							
						//	alert("erromodel1");
							
						}
					
				},
				
				
				
			_onObjectMatched : function (oEvent) {
					var sNrembarque =  oEvent.getParameter("arguments").Nrembarque,
						sVbelnVa	= oEvent.getParameter("arguments").VbelnVa;

				this.getModel().metadataLoaded().then( function() {
					var sObjectPath = this.getModel().createKey("ZET_FBSD_SalesExportSet", {
						Nrembarque  : sNrembarque,
						VbelnVa		: sVbelnVa
					});
					this._bindView("/" + sObjectPath);
				}.bind(this));
				
				
			},

			
			_bindView : function (sObjectPath) {
								
				// Set busy indicator during view binding
				var oViewModel = this.getModel("detailVendaExportView");

				// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
				oViewModel.setProperty("/busy", false);
				
				this.getView().bindElement({
					path : sObjectPath,
					expand: "SalesExportToItems",
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
				debugger;
				//var oGlobalData = sap.ui.getCore().getModel("globalData").getData();
			
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
				
				
					oObject.Nrembarque
				
				//Message PopOver
				this._initializeMessagePopOver();
				
				this._deselect_all_table();

			},

			_createBill: function(){
			
				var that = this;
								
				//Message PopOver
				this._initializeMessagePopOver();
				
				
				var oDataModel = this.getModel();
				
				//Get Detail
				var oView = this.getView(),
				oElementBinding = oView.getElementBinding();
				var sPath = oElementBinding.getPath(),
				oDataItem = oView.getModel().getObject(sPath);
				
				var oViewModel = this.getModel("detailVendaExportView");
				oViewModel.setProperty("/busy", true);
				
				//Get Itens Selecionados
				var oTable = this.byId("shipDetailItemVendaExportTable");
				var oItems = oTable.getSelectedContexts();

				var oEntry = { 
								Nrembarque	: oDataItem.Nrembarque,
								SalesExportToItems:[]
							  };
				
				for(var i=0;i < oItems.length; i++){
					var oObject = oItems[i].getObject();
					oEntry.SalesExportToItems.push({
													  Nrembarque	: oDataItem.Nrembarque,
									    			  ShpmtIt		: oObject.ShpmtIt,
									    			  VbelnVa		: oObject.VbelnVa,	
									    			  PosnrVa		: oObject.PosnrVa,
									    			  VbelnVl		: oObject.VbelnVl
													});
				}
				debugger;
				oDataModel.create("/ZET_FBSD_SalesExportSet", oEntry, {
					success: function(oData, oResponse){
		    			that._deselect_all_table();
		    			oDataModel.refresh();
		    			MessageToast.show(that.getResourceBundle().getText("detailVendaExportMessageSucessSave"));	
						that.onHideUnhideMaster(constants.HIDE_MODE);
						oViewModel.setProperty("/busy", false);
						that.getRouter().navTo("object", { Nrembarque: oDataItem.Nrembarque }, true);
					}, 
					error: function(oError){ 
						try{
							var sMsg = JSON.parse(oError.responseText);
							that._createMessagePopOver(sMsg.error.innererror.errordetails);
							MessageBox.error(that.getResourceBundle().getText("detailVendaExportErroMessageSave"), 
					                  { styleClass: that.getOwnerComponent().getContentDensityClass() }
					         );
						}catch(err){};
						oViewModel.setProperty("/busy", false);
					} 
				});
			},
			
			_deselect_all_table: function(){
				// Mantem a linha dos itens concluidos nao selecionadas
		    	 var oTable = this.getView().byId("shipDetailItemVendaExportTable");
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
		    	  	
		        var oButtonMsg = this.byId("vendaExportButtonMsg");
		        oButtonMsg.setText(this.getResourceBundle().getText("detailItemVendaExportMsgTitleCount", 
		        													[sMessages.length]));
			},
			
		});

	}
);