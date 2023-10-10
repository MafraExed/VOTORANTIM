/*global location */
sap.ui.define([		
               		"nasa/ui5/registroExportacao/controller/BaseController",
					"sap/ui/model/json/JSONModel",
					"sap/ui/core/routing/History",
					"nasa/ui5/registroExportacao/model/formatter",
					"nasa/ui5/registroExportacao/model/constants",
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

		return BaseController.extend("nasa.ui5.registroExportacao.controller.Detail", {

			formatter: formatter,
		
			onInit : function () {
				// Model used to manipulate control states. The chosen values make sure,
				// detail page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				var oViewModel = new JSONModel({
					busy : false,
					delay : 0,
					mailData: {},
					mailText: "",
					mailIssue: "",
					itemListTableTitle : this.getResourceBundle().getText("detailTitleTableItemList")
				});
				
				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
				this.setModel(oViewModel, "detailView");
				
				//Message PopOver
				this._initializeMessagePopOver();
				
				
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
	
			onFullScreenPage: function(){
				var that = this;
				var oSplitApp = this.getOwnerComponent().getAggregation("rootControl").byId("idAppControl");
				var oFullScreen = (oSplitApp.getMode() == constants.HIDE_MODE ? false : true);
				
				if (oFullScreen) {
					this.onHideUnhideMaster(constants.HIDE_MODE);
				} else {
					this.onHideUnhideMaster(constants.UNHIDE_MODE);
				}
				
				var buttonsToChange = ['ListItemFullButton'];
				
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
		     
		     onHandleMessagePopover: function (oEvent) {
					this.oMessagePopover.openBy(oEvent.getSource());
			 },
		     
		     onHandleSolicitarRE: function(oEvent){
		    	//Verifica se algum item foi selecionado
				var oTable = this.getView().byId("shipDetailTable");
				if(!oTable.getSelectedItems().length){
						MessageBox.error(this.getResourceBundle().getText("detailMessageErroSelectError"), 
					           {
					                styleClass: this.getOwnerComponent().getContentDensityClass()
					            });
						return;
				 }
				
				//Limpa o campo mensagem
		        this._initializeMessagePopOver();
				
				//Abre Tela para preenchimento de dados de head do embarque
		        if (! this._oDialogSolicRE) {
		        	var oView = this.getView();
		        	this._oDialogSolicRE = sap.ui.xmlfragment(oView.getId(),"nasa.ui5.registroExportacao.view.fragments.SolicitarRE", this);
		        }

		        this.getView().addDependent(this._oDialogSolicRE);

		        // toggle compact style
		        jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogSolicRE);
		        this._oDialogSolicRE.open();
		        
		        this._prepareMailRE(oEvent);
		    },
		     
		
			
			 onHandleCloseSolicRE: function(){
				 this._oDialogSolicRE.close();
			 },
			    	
			
			 
			 
			 onHandleF4Pais: function(oEvent){

	                if (! this._oDialogPais) {
	                  this._oDialogPais = sap.ui.xmlfragment("nasa.ui5.planejamentoEmbarque.view.fragments.Shlp_Pais", this);
	                }

	                this.getView().addDependent(this._oDialogPais);

	                // toggle compact style
	                jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogPais);
	                this._oDialogPais.open();

	              },
			 
			 
	              onHandleSubmitPais: function(oEvent){
	                    var that = this;
	                    var sValue = oEvent.getParameter("value");
	                	  var oDataModel = this.getModel();
	                	  
	                	  var oFilter = null;
	                	  var aFilters = [];
	                    oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("Name1", sap.ui.model.FilterOperator.Contains, sValue)], false);
	                    aFilters.push(oFilter);
	                    
	              	  oDataModel.read("/ZET_FBSD_SearchPaisSet", {
	              		  filters: aFilters,
	                        success: function (oData) {
		                      	if (!!oData.results.length){
		                      		var oInputLocal = that.getView().byId("solicREFieldPaisDestino");
		                              oInputLocal.setValue(oData.results[0].Lifnr);
		
//		                              oInputLocal = that.getView().byId("addEmbarqueFieldAgentDsc");
//		                              oInputLocal.setText(oData.results[0].Name1);
		                      	}else{
		                      		var oInputLocal = that.getView().byId("solicREFieldPaisDestino");
		                              oInputLocal.setValue("");
		
//		                              oInputLocal = that.getView().byId("addEmbarqueFieldAgentDsc"); //Campo texto na frente do input field
//		                              oInputLocal.setText("");
		                            
		                              MessageBox.error(that.getResourceBundle().getText("shlpPaisMessageNotFound"), 
		        			                  {
		        			                styleClass: that.getOwnerComponent().getContentDensityClass()
		        			                  }
		        			                );
		                      	}
	                        }
	                      });
	                  }, 
			 
			 
	                  onSearchHelperPais : function (oEvent, oTable) {

	                      var sValue = oEvent.getParameter("value");
	                      var aFilters = [];


	                      if (sValue) {
	                        var oFilter = null;
	                        oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("Name1", sap.ui.model.FilterOperator.Contains, sValue)], false);
	                        aFilters.push(oFilter);
	                      }

	                      var oBinding = oEvent.getSource().getBinding("items");
	                      oBinding.filter(aFilters);

	                    },
			 	                    
	                    onConfirmShlpPais: function(oEvent){
	                        var aContexts = oEvent.getParameter("selectedContexts");

	                        if (aContexts && aContexts.length) {
	                          var oObject = aContexts.map(function(oContext) { return oContext.getObject(); });
	                          var oInputLocal = this.getView().byId("solicREFieldPaisDestino");
	                          oInputLocal.setValue(oObject[0].Pais);

	                          //	oInputLocal = this.getView().byId("addEmbarqueFieldAgentDsc");
	                          //	oInputLocal.setText(oObject[0].Name1);
	                        }
	                      },    
	                                   
			
			onHandleSaveRE: function(oEvent){
				//Verifica se os campos obrigatorios foram preenchidos
				var oViewModel = this.getModel("detailView"),
					oObject = oViewModel.getData().mailData;
				
				if(!oObject.BukrsTxt || !oObject.Cnpj || !oObject.Ncm || !oObject.PtdstDsc ||
				   !oObject.PaisNome || !oObject.Weight || !oObject.Volumn || !oObject.ValorFob ||
				   !oObject.ValorCif || !oObject.Inco1 || !oObject.ZtermDsc ){
						MessageBox.error(this.getResourceBundle().getText("detailViewMsgObligatoryField"), 
					           {
					                styleClass: this.getOwnerComponent().getContentDensityClass()
					            });
						return;
				 }
				
				this._saveRE(oEvent);
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
				
				//Limpa o campo mensagem
		        this._initializeMessagePopOver();

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
		        var oButtonMsg = this.byId("detailViewButtonMsg");
		        oButtonMsg.setText(this.getResourceBundle().getText("detailViewMsgTitleCount", [sMessages.length]));
			},
			
			_prepareMailRE: function(oEvent){
				var that = this,
					oDataModel = this.getModel();
				
				//Get Selected Object
				var oDataPartners = [],
					sPath = oEvent.getSource().getParent().getBindingContext().sPath,
					oObject = oDataModel.getProperty(sPath);
				
				var oEntry = {
								Event: constants.EVENT_BUSCAR,
								Nrembarque: oObject.Nrembarque,
								ShipmentDetailToItems: [],
								ShipmentDetailToRERequest: []
							 };
				
				//Get Itens Selecionados
				var oTable = this.byId("shipDetailTable");
				var oItems = oTable.getSelectedContexts();
				for(var i=0;i < oItems.length; i++){
					var oItemObject = oItems[i].getObject();
					oEntry.ShipmentDetailToItems.push({
															Nrembarque	: oObject.Nrembarque,
															ShpmtIt		: oItemObject.ShpmtIt
													  });
				}
	            
            	oDataModel.create("/ZET_FBSD_ShipmentDetailSet", oEntry, {
	              		success: function (oData, oResponse) {
				            that._setTextMailRE(that.getResourceBundle(), oData.ShipmentDetailToRERequest.results[0]);
			            },
						error: function(oError){ 
							that._oDialogSolicRE.close();
							try{
								var sMsg = JSON.parse(oError.responseText);
								that._createMessagePopOver(sMsg.error.innererror.errordetails);
								MessageBox.error(that.getResourceBundle().getText("detailErroMessage"), 
						                  {styleClass: that.getOwnerComponent().getContentDensityClass()});
							}catch(err){};
						}
			      });	
			},
			
			_setTextMailRE: function(oResourceBundle, oMail){
				var sMailData = {
									Nrembarque	: oMail.Nrembarque,
									Dcrnv		: oMail.Dcrnv,		
									Nvoyg		: oMail.Nvoyg,
									Bukrs   	: oMail.Bukrs,
									BukrsTxt	: oMail.BukrsTxt,
									Cnpj		: formatter.formatCNPJout(oMail.Cnpj),
									Ncm			: oMail.Ncm,
									Ptdst		: oMail.Ptdst,
									PtdstDsc	: oMail.PtdstDsc,
									PaisDestino : oMail.PaisDestino,
									PaisNome	: oMail.PaisNome,
									Weight		: oMail.Weight,
									Unit		: oMail.Unit,
									Volumn		: oMail.Volumn,
									ValorFob	: oMail.ValorFob,
									ValorCif	: oMail.ValorCif,
									Waerk		: oMail.Waerk,
									Inco1		: oMail.Inco1,
									Zterm		: oMail.Zterm,
									ZtermDsc	: oMail.ZtermDsc,
									Dterm		: oMail.Dterm,
									DtermDsc	: oMail.DtermDsc,	
									Acnum		: oMail.Acnum
								};
				
				var smailIssue = oResourceBundle.getText("detailViewMailREHeader",   [sMailData.Dcrnv, sMailData.Nvoyg]);
				
				var sMailText = "";
				sMailText = oResourceBundle.getText("detailViewMailREBodyMsg1", [sMailData.Dcrnv]);
				
				var oDataModel = this.getModel("detailView");
				oDataModel.setProperty("/mailIssue", smailIssue);
				oDataModel.setProperty("/mailData", sMailData);
				oDataModel.setProperty("/mailText", sMailText);
			},
			
			_saveRE: function(oEvent){
				var that = this,
				oDataModel = this.getModel(),
				oViewModel = this.getModel("detailView");
				
				oViewModel.setProperty("/busy", true);
				
				//Get Selected Object
				var sPath = oEvent.getSource().getParent().getBindingContext().sPath,
					oObject = oDataModel.getProperty(sPath);
				
				var oEntry = {
						Event: constants.EVENT_ENVIAR,
						Nrembarque: oObject.Nrembarque,
						ShipmentDetailToItems: [],
						ShipmentDetailToRERequest: []
					 };
		
				//Get Itens Selecionados
				var oTable = this.byId("shipDetailTable");
				var oItems = oTable.getSelectedContexts();
				for(var i=0;i < oItems.length; i++){
					var oItemObject = oItems[i].getObject();
					oEntry.ShipmentDetailToItems.push({
															Nrembarque	: oObject.Nrembarque,
															ShpmtIt		: oItemObject.ShpmtIt
													  });
				}
				
				//Get Dados Informados para Solicita��o
				var oMail = oViewModel.getData().mailData;
				oEntry.ShipmentDetailToRERequest.push({
														Dcrnv		: oMail.Dcrnv,		
														Nvoyg		: oMail.Nvoyg,
														Bukrs   	: oMail.Bukrs,
														BukrsTxt	: oMail.BukrsTxt,
														Cnpj		: formatter.formatCNPJin(oMail.Cnpj),
														Ncm			: oMail.Ncm,
														Ptdst		: oMail.Ptdst,
														PtdstDsc	: oMail.PtdstDsc,
														PaisDestino : oMail.PaisDestino,
														PaisNome	: oMail.PaisNome,
														Weight		: oMail.Weight,
														Unit		: oMail.Unit,
														Volumn		: oMail.Volumn,
														ValorFob	: oMail.ValorFob,
														ValorCif	: oMail.ValorCif,
														Waerk		: oMail.Waerk,
														Inco1		: oMail.Inco1,
														Zterm		: oMail.Zterm,
														ZtermDsc	: oMail.ZtermDsc,
														Dterm		: oMail.Dterm,
														DtermDsc	: oMail.DtermDsc,	
														Acnum		: oMail.Acnum
													});
				
				 oDataModel.create("/ZET_FBSD_ShipmentDetailSet", oEntry, {
              		success: function (oData, oResponse) {
              		    that._oDialogSolicRE.close();
              		    oDataModel.refresh();
              		    MessageToast.show(that.getResourceBundle().getText("detailSuccessMessage"));
              		    oViewModel.setProperty("/busy", false);
		            },
					error: function(oError){ 
						if(oError.statusCode !== 500){
							that._oDialogSolicRE.close();
							try{
								var sMsg = JSON.parse(oError.responseText);
								that._createMessagePopOver(sMsg.error.innererror.errordetails);
								MessageBox.error(that.getResourceBundle().getText("detailErroMessage"), 
						                  {styleClass: that.getOwnerComponent().getContentDensityClass()});
							}catch(err){};
						}
						oViewModel.setProperty("/busy", false);
					}
		         });
			},
			
			_deselect_all_table: function(sId){
				// Mantem a linha dos itens concluidos nao selecionadas
		    	 var oTable = this.getView().byId(sId);
		    	 var oSelectedItems = oTable.getSelectedItems();
		    	  
		    	  oSelectedItems.forEach(function(oItem) {
		    		  oTable.setSelectedItem(oItem, false);		    	  	  
		    	  })
			},
			
		});

	}
);