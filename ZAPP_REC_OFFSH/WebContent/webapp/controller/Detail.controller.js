/*global location */
sap.ui.define([
					"nasa/ui5/recebimentoOffshore/controller/BaseController",
					"sap/ui/model/json/JSONModel",
					"sap/ui/core/routing/History",
					"sap/ui/model/Filter",
					"sap/ui/model/FilterOperator",
					"nasa/ui5/recebimentoOffshore/model/formatter",
					"nasa/ui5/recebimentoOffshore/model/constant",
					"sap/m/MessageBox",
					"sap/m/MessageToast",
					"sap/m/MessagePopover",
					"sap/m/MessagePopoverItem",
	], function (	
					BaseController, 
					JSONModel, 
					History, 
					Filter, 
					FilterOperator, 
					formatter, 
					constant, 
					MessageBox, 
					MessageToast, 
					MessagePopover, 
					MessagePopoverItem) {
	
		"use strict";

		return BaseController.extend("nasa.ui5.recebimentoOffshore.controller.Detail", {

			formatter: formatter,
		
			onInit : function () {
				// Model used to manipulate control states. The chosen values make sure,
				// detail page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				var oViewModel = new JSONModel({
					busy : false,
					delay : 0,
					itemsClassf: [],
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
			},//END ON INIT

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */
	
			onFullScreenPage: function(){
				var that = this;
				var oSplitApp = this.getOwnerComponent().getAggregation("rootControl").byId("idAppControl");
				var oFullScreen = (oSplitApp.getMode() == constant.HIDE_MODE ? false : true);
				
				if (oFullScreen) {
					this.onHideUnhideMaster(constant.HIDE_MODE);
				} else {
					this.onHideUnhideMaster(constant.UNHIDE_MODE);
				}
				
				var buttonsToChange = ['ListItemFullButton',
				                       'ListRecFITFullButton',
				                       'ListFatFITFullButton',
				                       'ListVendaINCFullButton',
				                       'ListRecINCFullButton',
				                       'ListFatINCFullButton'];
				
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
		     
		     onHandleSelectFilterBar: function(oEvent){

		    	 
		    	 var that = this;
		    	 var sKey = oEvent.getParameters().key;    	 
		    	 var buttonsToChange = [{key: 'tabItem1', buttonId: 'detailViewRecebFITBtn'}
//		    	                        {key: 'tabItem2', buttonId: 'detailViewEstRecFITBtn'},
//		    	                        {key: 'tabItem3', buttonId: 'detailViewEstFatFITBtn'},
//		    		 					{key: 'tabItem5', buttonId: 'detailViewEstRecINCBtn'},
//		    		 					{key: 'tabItem6', buttonId: 'detailViewEstFatINCBtn'},
//		    	                        {key: 'tabItem4', buttonId: 'detailViewAtualFreteBtn'},
//		    	                        {key: 'tabItem4', buttonId: 'detailViewRecebINCBtn'}
		    	                        
		    	                        ];
					
				 jQuery.each(buttonsToChange, function(index, element){
						
						var oButtonEdit = that.byId(element.buttonId);				
				        		        
						if(sKey == element.key) { 
							oButtonEdit.setVisible(true);
						} else { 
							oButtonEdit.setVisible(false);
						}
				   });
				 
				 this._initializeMessagePopOver();

		     },
		     
		     
		     onSearch: function(oEvent){
		    	 var sValue = oEvent.getParameter("query");
                 var aFilters = [];

                 if (sValue) {
                   var oFilter = null;
                   oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("SearchString", sap.ui.model.FilterOperator.EQ, sValue)], false);
                   aFilters.push(oFilter);
                 }

                 
                 var sKey = oEvent.getSource().oParent.oParent.oParent.mProperties.key 
                 
                 switch (sKey) {
 			     case "tabItem1":
 			     var oTable = this.byId("tableHeader");
 			           break;
				 case "tabItem2":
					 var oTable = this.byId("tableHeaderRecFIT");			       
			          break;
				 case "tabItem3":
					 var oTable = this.byId("tableHeaderFatFIT");
				      break;
				 case "tabItem4":
					 var oTable = this.byId("shipDetailVendaINCTable");
				      break;
				 case "tabItem5":
					 var oTable = this.byId("tableHeaderRecINC");
				      break;
				 case "tabItem6":
					 var oTable = this.byId("tableHeaderFatINC");  
//				      break;
// 			    default:
// 			        return "";	
 			    };				    
                      
                 var oBinding = oTable.getBinding("items");
                 oBinding.filter(aFilters);
		     },
		     
		     
		     
		     
		     
		     onHanleCloseRecebFIT: function(oEvent){
		    	 this._oDialogRecebFIT.close();
		     },
		     
		     onHandleMessagePopover: function(oEvent){
		    	 this.oMessagePopover.openBy(oEvent.getSource());
		     },
		     
		     onHandlePopoverClassf: function(oEvent){	
		    	 debugger;
		          var that = this;
		            
		          //Open PopOver
				  if (! this._PopOverClassf) {
					  var oView = this.getView();
					  this._PopOverClassf = sap.ui.xmlfragment(oView.getId(), "nasa.ui5.recebimentoOffshore.view.fragments.PopOverClassf", this);
					  this.getView().addDependent(this._PopOverClassf);
				  }
		           
		           this._PopOverClassf.openBy(oEvent.getSource());
		            
				   //Get Selected Object
				   var oDataPartners = [];
				   var oModel = this.getView().getModel();
				   var sPath = oEvent.getSource().getParent().getBindingContextPath();
				   var oObject = oModel.getProperty(sPath);
				   
				   var oViewModel = this.getModel("detailView");
					
				   var sNrembarque = oObject.Nrembarque;
				   var sShpmtIt = oObject.ShpmtIt;
										
				   //Set Items			    		   
				   var oFilter = null;
			       var aFilters = [];
			          
       
				   oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("Nrembarque", sap.ui.model.FilterOperator.EQ, sNrembarque),
				   			 						   new sap.ui.model.Filter("ShpmtIt", sap.ui.model.FilterOperator.EQ, sShpmtIt)],true);

				   aFilters.push(oFilter);
				   
				   debugger;
				   
//				  var sPath = "/ZET_FBSD_CharacteristicSet?$filter=Nrembarque eq '" + sNrembarque + "' and ShpmtIt eq '" + sShpmtIt + "'"
//				  var sPath = "ZET_FBSD_ShipmentDetailSet(Nrembarque='" + sNrembarque + "')/ShipmentDetailToCharact?$filter=ShpmtIt eq" + "'" + sShpmtIt + "'"
				   
				   var sPath = "/ZET_FBSD_CharacteristicSet";
				   
				   oModel.read(sPath, {
					   
					     filters: aFilters,
				         success: function (oData) {
				        	 debugger;
				        	 debugger;
				           if(!!oData.results.length){
					          oViewModel.setProperty("/itemsClassf", oData.results);
							  oViewModel.refresh(true);
				            }
				          }
				    });
				   
			},
			
			onHanleSaveRecebFIT: function(oEvent){
				debugger;
				this.onMessageConfirmation(this.getResourceBundle().getText("detailViewQuestionSaveRecFIT"),
	 					this.getResourceBundle().getText("buttonTextOK"),
	 					this.getResourceBundle().getText("buttonTextCancel"),
	 					function(){ this._SaveRecebimento("shipDetailTable"); }.bind(this));
			},
			
			onHandleRecebFIT: function(oEvent){
				//Verifica se algum item foi selecionado
				var oTable = this.getView().byId("shipDetailTable");
					if(!oTable.getSelectedItems().length){
						MessageBox.error(this.getResourceBundle().getText("detailMessageErroSelectError"), 
				                  {
				                styleClass: this.getOwnerComponent().getContentDensityClass()
				                  }
				                );
					return;
				}
					
				this._RecebFIT(oEvent);
			},
			
			onHandleRecebINC: function(oEvent){
				//Verifica se algum item foi selecionado
				var oTable = this.getView().byId("shipDetailVendaINCTable");
					if(!oTable.getSelectedItems().length){
						MessageBox.error(this.getResourceBundle().getText("detailMessageErroSelectError"), 
				                  {
				                styleClass: this.getOwnerComponent().getContentDensityClass()
				                  }
				                );
					return;
				}
					
				this._RecebINC(oEvent);
			},
			
//			onHandleEstRecFIT: function(oEvent){
//		    	//Verifica se algum item foi selecionado
//				var oTable = this.getView().byId("shipDetailRecFITTable");
//					if(!oTable.getSelectedItems().length){
//						MessageBox.error(this.getResourceBundle().getText("detailMessageErroSelectError"), 
//				                  {
//				                styleClass: this.getOwnerComponent().getContentDensityClass()
//				                  }
//				                );
//					return;
//				}
//					
//				this.onMessageConfirmation(this.getResourceBundle().getText("detailViewQuestionEstorno"),
//	 					this.getResourceBundle().getText("buttonTextOK"),
//	 					this.getResourceBundle().getText("buttonTextCancel"),
//	 					function(){ this._EstornaRecebimento("shipDetailRecFITTable"); }.bind(this));
//			},
			
//			onHandleEstFatFIT: function(oEvent){
//				//Verifica se algum item foi selecionado
//				var oTable = this.getView().byId("shipDetailFatFITTable");
//					if(!oTable.getSelectedItems().length){
//						MessageBox.error(this.getResourceBundle().getText("detailMessageErroSelectError"), 
//				                  {
//				                styleClass: this.getOwnerComponent().getContentDensityClass()
//				                  }
//				                );
//					return;
//				}
//					
//				this.onMessageConfirmation(this.getResourceBundle().getText("detailViewQuestionEstorno"),
//	 					this.getResourceBundle().getText("buttonTextOK"),
//	 					this.getResourceBundle().getText("buttonTextCancel"),
//	 					function(){ this._EstornaFaturamento("shipDetailFatFITTable"); }.bind(this));
//			},
			
//			onHandleEstRecINC: function(oEvent){
//				//Verifica se algum item foi selecionado
//				var oTable = this.getView().byId("shipDetailRecINCTable");
//					if(!oTable.getSelectedItems().length){
//						MessageBox.error(this.getResourceBundle().getText("detailMessageErroSelectError"), 
//				                  {
//				                styleClass: this.getOwnerComponent().getContentDensityClass()
//				                  }
//				                );
//					return;
//				}
//					
//				this.onMessageConfirmation(this.getResourceBundle().getText("detailViewQuestionEstorno"),
//	 					this.getResourceBundle().getText("buttonTextOK"),
//	 					this.getResourceBundle().getText("buttonTextCancel"), 
//	 					function(){ this._EstornaRecebimento("shipDetailRecINCTable"); }.bind(this));
//			},
			
//			onHandleEstFatINC: function(oEvent){
//				//Verifica se algum item foi selecionado
//				var oTable = this.getView().byId("shipDetailFatINCTable");
//					if(!oTable.getSelectedItems().length){
//						MessageBox.error(this.getResourceBundle().getText("detailMessageErroSelectError"), 
//				                  {
//				                styleClass: this.getOwnerComponent().getContentDensityClass()
//				                  }
//				                );
//					return;
//				}
//					
//				this.onMessageConfirmation(this.getResourceBundle().getText("detailViewQuestionEstorno"),
//	 					this.getResourceBundle().getText("buttonTextOK"),
//	 					this.getResourceBundle().getText("buttonTextCancel"),
//	 					function(){ this._EstornaFaturamento("shipDetailFatINCTable"); }.bind(this));
//			},
			
			onHandleAtualFrete: function(oEvent){
				//Verifica se algum item foi selecionado
				var oTable = this.getView().byId("shipDetailVendaINCTable");
					if(!oTable.getSelectedItems().length){
						MessageBox.error(this.getResourceBundle().getText("detailMessageErroSelectError"), 
				                  {
				                styleClass: this.getOwnerComponent().getContentDensityClass()
				                  }
				                );
					return;
				}
					
				this.onMessageConfirmation(this.getResourceBundle().getText("detailViewQuestionAtualFrete"),
	 					this.getResourceBundle().getText("buttonTextOK"),
	 					this.getResourceBundle().getText("buttonTextCancel"),
	 					function(){ this._AtualizaFrete("shipDetailVendaINCTable"); }.bind(this));
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
					expand: "ShipmentDetailToDeliveryRec",
					expand: "ShipmentDetailToRecFisicoFIT",
					expand: "ShipmentDetailToFaturamentoFIT",
					expand: "ShipmentDetailToVendaINC",
					expand: "ShipmentDetailToRecFisicoINC",
					expand: "ShipmentDetailToFaturamentoINC",
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
				
				//Message PopOver
				this._initializeMessagePopOver();
				
				
				//Oculta Abas INC, caso necessario
				debugger;
				var sVisible = oObject.ProcessoInc == 'X' ? true : false; 
				
				this.byId("iconTabBarFilter4Separador").setVisible(sVisible);
				
				this.byId("iconTabBarFilter4").setVisible(sVisible);
				
				this.byId("iconTabBarFilter5").setVisible(sVisible);
				
				this.byId("iconTabBarFilter6").setVisible(sVisible);

			},
			
			_deselect_all_table: function(sId){
				// Mantem a linha dos itens concluidos nao selecionadas
		    	 var oTable = this.getView().byId(sId);
		    	 var oSelectedItems = oTable.getSelectedItems();
		    	  
		    	  oSelectedItems.forEach(function(oItem) {
		    		  oTable.setSelectedItem(oItem, false);		    	  	  
		    	  })
			},
			

			_MergeBatch: function(){
				debugger;
				var oViewModel = this.getModel("execReceb");
				oViewModel.setProperty("/Agrupar","X");
				
				//chama o dialog de datas 
				this._oDialogRecebFIT.open();
			},
			
			_UnMergeBatch: function(){
				var oViewModel = this.getModel("execReceb");
				oViewModel.setProperty("/Agrupar","");
				
				//chama o dialog de datas 
				this._oDialogRecebFIT.open();
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
		        oButtonMsg.setText(this.getResourceBundle().getText("detailMsgTitleCount", 
		        													[sMessages.length]));
			},
			
			_RecebFIT: function(oEvent){
				debugger;
				//Busca Data Default
				var oModel = this.getView().getModel();
				var sPath = oEvent.getSource().getParent().getBindingContext().sPath;
				var oObject = oModel.getProperty(sPath);
					
				//Limpa os campos da tela Executar Recebimento FIT		        
			    var execRecebFIT = new JSONModel({
									    			Dtdoc: oObject.Bldate,
									    			DtLanc: oObject.Bldate,
													Agrupar: ""
									            });
					
				this.setModel(execRecebFIT, "execReceb");
				
				//Limpa o campo mensagem
		        this._initializeMessagePopOver();
		        
		        //Abre Tela para preenchimento de dados de head do embarque
		        if (! this._oDialogRecebFIT) {
		        	debugger;
		        	var oView = this.getView();
		        	this._oDialogRecebFIT = sap.ui.xmlfragment(oView.getId(),"nasa.ui5.recebimentoOffshore.view.fragments.ExecRecebimentoFIT", this);
		        }

		        this.getView().addDependent(this._oDialogRecebFIT);

		        // toggle compact style
		        jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogRecebFIT);
debugger;
		        if (oObject.ProcessoInc == 'X'){
		        debugger;
			        /**Comentado aguardando conclusao de desenvolvimento backend*/
				        //Caso haja mais de um item selecionado, pergunta se deseja agrupar os itens em lote
				        var oTable = this.getView().byId("shipDetailTable");
				        if(oTable.getSelectedItems().length > 1){
				        	
					        this.onMessageConfirmation(this.getResourceBundle().getText("detailQuestionBatch"),
				 					this.getResourceBundle().getText("buttonTextOK"),
				 					this.getResourceBundle().getText("buttonTextNOK"), 
				 					this._MergeBatch.bind(this),		 							 					
				 					this._UnMergeBatch.bind(this));
				        }else{
				        	this._oDialogRecebFIT.open();	
				        }
		        
				}else{		
					this._oDialogRecebFIT.open();				
				};
		     
			},
			
			_RecebINC: function(){		
				debugger;
				//Limpa o campo mensagem
		        this._initializeMessagePopOver();
		        
		        
		        /**Comentado aguardando conclusao de desenvolvimento backend*/
//		      Caso haja mais de um item selecionado, pergunta se deseja agrupar os itens em lote
		        var oTable = this.getView().byId("shipDetailVendaINCTable");
		        if(oTable.getSelectedItems().length > 1)
			        this.onMessageConfirmation(this.getResourceBundle().getText("detailQuestionBatch"),
		 					this.getResourceBundle().getText("buttonTextOK"),
		 					this.getResourceBundle().getText("buttonTextNOK"), 
		 					function(){ this._MergeBatch();
		 								this._SaveRecebimento("shipDetailVendaINCTable"); }.bind(this),
							function(){ this._UnMergeBatch();
										this._SaveRecebimento("shipDetailVendaINCTable");	}.bind(this));
			},
			
			_SaveRecebimento: function(sIdTable){
				debugger;
				var that = this;
				this._oDialogRecebFIT.close();
				//Get Detail
				var oView = this.getView(),
				oElementBinding = oView.getElementBinding();
				var sPath = oElementBinding.getPath(),
				oResourceBundle = this.getResourceBundle(),
				oDetail = oView.getModel().getObject(sPath);
				
				var oDataModel = this.getModel();
				oDataModel.setProperty("/busy", true);
				
				var oViewModel = this.getModel("execReceb"),
				 	oObjectReceb = oViewModel.getData();
				
				var oViewModel = this.getModel("detailView");
				oViewModel.setProperty("/busy", true);
				
				//Get Itens Selecionados
				var oTable = this.getView().byId(sIdTable);
				var oItems = oTable.getSelectedContexts();
				
				var sEvent = sIdTable == "shipDetailTable" ? constant.EVENT_RECEB_FIT : constant.EVENT_INC;
				var oEntry = this._getDataRecebimento(sEvent, oDetail, oObjectReceb, oItems);
		        
		        oDataModel.create("/ZET_FBSD_ShipmentDetailSet", oEntry, {
		            success: function (oData, oResponse) {
		            	  if(sIdTable == "shipDetailTable")
		            		  that._oDialogRecebFIT.close();
			              
		            	  that._deselect_all_table(sIdTable);
			              oDataModel.refresh();
			              MessageToast.show(that.getResourceBundle().getText("detailViewMessageSucessSave"));
			              oViewModel.setProperty("/busy", false);
		            },
					error: function(oError){ 
						if(sIdTable == "shipDetailTable")
							that._oDialogRecebFIT.close();
						
						try{
							var sMsg = JSON.parse(oError.responseText);
							that._createMessagePopOver(sMsg.error.innererror.errordetails);
							MessageBox.error(that.getResourceBundle().getText("detailViewErroMessageSave"), 
					                  {styleClass: that.getOwnerComponent().getContentDensityClass()});
						}catch(err){};
						oViewModel.setProperty("/busy", false);
					}
		        });	
			},
			
			_getDataRecebimento: function(sEvent, sDetail, sObjectReceb, sItems){
				
				var oEntry = {};
				
				//*********** Recebimento FIT *******************//
				if(sEvent == constant.EVENT_RECEB_FIT){
					oEntry = {
									Event							: sEvent,
									Nrembarque						: sDetail.Nrembarque,
									Docdt							: sObjectReceb.Dtdoc,
									PostDt							: sObjectReceb.DtLanc,
									Agrupar							: sObjectReceb.Agrupar,
									ShipmentDetailToDeliveryRec		: []
							  };
				
				
			        for(var i=0;i < sItems.length; i++){
						var oObject = sItems[i].getObject();
						oEntry.ShipmentDetailToDeliveryRec.push({
																	Nrembarque	: oObject.Nrembarque,
																	ShpmtIt		: oObject.ShpmtIt,
																	Ebeln		: oObject.Ebeln,
																	Ebelp		: oObject.Ebelp,
																	VbelnVl		: oObject.VbelnVl
																});
					}
				}
				//*********** Recebimento INC ou Atualizar Frete/Seguro *******************//
				else if(sEvent == constant.EVENT_RECEB_INC || sEvent == constant.EVENT_ATUALIZAR_FRETE){
					oEntry = {
							Event							: sEvent,
							Nrembarque						: sDetail.Nrembarque,
							Agrupar							: sObjectReceb.Agrupar,
							ShipmentDetailToVendaINC		: []
					  };
		
		
			         for(var i=0;i < sItems.length; i++){
						var oObject = sItems[i].getObject();
						oEntry.ShipmentDetailToVendaINC.push({
																	Nrembarque	: oObject.Nrembarque,
																	ShpmtIt		: oObject.ShpmtIt,
																	Ebeln		: oObject.Ebeln,
																	Ebelp		: oObject.Ebelp,
																	VbelnVl		: oObject.VbelnVl
																});
					}
				}
				
				return oEntry;
			},
			
//			_EstornaRecebimento: function(sIdTable){
//				var that = this;
//				
//				//Get Detail
//				var oView = this.getView(),
//				oElementBinding = oView.getElementBinding();
//				var sPath = oElementBinding.getPath(),
//				oResourceBundle = this.getResourceBundle(),
//				oDetail = oView.getModel().getObject(sPath);
//				
//				var oDataModel = this.getModel();
//				oDataModel.setProperty("/busy", true);
//				
//				var oViewModel = this.getModel("detailView");
//				oViewModel.setProperty("/busy", true);
//				
//				//Get Itens Selecionados
//				var oTable = this.getView().byId(sIdTable);
//				var oItems = oTable.getSelectedContexts();
//				
//				var sEvent = sIdTable == "shipDetailRecFITTable" ? constant.EVENT_EST_RECEB_FIT : constant.EVENT_EST_RECEB_INC;
//				var oEntry = this._getDataEstorno(sEvent, oDetail, oItems);
//		        
//		        oDataModel.create("/ZET_FBSD_ShipmentDetailSet", oEntry, {
//		            success: function (oData, oResponse) {
//		            	that._deselect_all_table(sIdTable);
//			            oDataModel.refresh();
//			            MessageToast.show(that.getResourceBundle().getText("detailViewMessageSucessEst"));
//			            oViewModel.setProperty("/busy", false);
//		            },
//					error: function(oError){ 
//						try{
//							var sMsg = JSON.parse(oError.responseText);
//							that._createMessagePopOver(sMsg.error.innererror.errordetails);
//							MessageBox.error(that.getResourceBundle().getText("detailViewErroMessageEst"), 
//					                  {styleClass: that.getOwnerComponent().getContentDensityClass()});
//						}catch(err){};
//						oViewModel.setProperty("/busy", false);
//					}
//		        });	
//			},
			
			_getDataEstorno: function(sEvent, sDetail, sItems){
				
				var oEntry = {};
				
				//*********** Estorno FIT *******************//
				if(sEvent == constant.EVENT_EST_RECEB_FIT){
					oEntry = {
									Event							: sEvent,
									Nrembarque						: sDetail.Nrembarque,
									ShipmentDetailToRecFisicoFIT	: []
							  };
				
				
			        for(var i=0;i < sItems.length; i++){
						var oObject = sItems[i].getObject();
						oEntry.ShipmentDetailToRecFisicoFIT.push({
																	Nrembarque	: oObject.Nrembarque,
																	ShpmtIt		: oObject.ShpmtIt,
																	Ebeln		: oObject.Ebeln,
																	Ebelp		: oObject.Ebelp,
																	VbelnVl		: oObject.VbelnVl
																});
					}
				}
				//*********** Estorno INC *******************//
				else if(sEvent == constant.EVENT_EST_RECEB_INC){
					oEntry = {
							Event							: sEvent,
							Nrembarque						: sDetail.Nrembarque,
							ShipmentDetailToRecFisicoINC	: []
					  };
		
		
			         for(var i=0;i < sItems.length; i++){
						var oObject = sItems[i].getObject();
						oEntry.ShipmentDetailToRecFisicoINC.push({
																	Nrembarque	: oObject.Nrembarque,
																	ShpmtIt		: oObject.ShpmtIt,
																	Ebeln		: oObject.Ebeln,
																	Ebelp		: oObject.Ebelp,
																	VbelnVl		: oObject.VbelnVl
																});
					}
				}
				
				return oEntry;
			},
			
//			_EstornaFaturamento: function(sIdTable){
//				var that = this;
//				
//				//Get Detail
//				var oView = this.getView(),
//				oElementBinding = oView.getElementBinding();
//				var sPath = oElementBinding.getPath(),
//				oResourceBundle = this.getResourceBundle(),
//				oDetail = oView.getModel().getObject(sPath);
//				
//				var oDataModel = this.getModel();
//				
//				var oViewModel = this.getModel("detailView");
//				oViewModel.setProperty("/busy", true);
//				
//				//Get Itens Selecionados
//				var oTable = this.getView().byId(sIdTable);
//				var oItems = oTable.getSelectedContexts();
//				
//				var sEvent = sIdTable == "shipDetailFatFITTable" ? constant.EVENT_EST_FATUR_FIT : constant.EVENT_EST_FATUR_INC;
//				var oEntry = this._getDataFatura(sEvent, oDetail, oItems);
//		        
//		        oDataModel.create("/ZET_FBSD_ShipmentDetailSet", oEntry, {
//		            success: function (oData, oResponse) {
//		            	that._deselect_all_table(sIdTable);
//			            oDataModel.refresh();
//			            MessageToast.show(that.getResourceBundle().getText("detailViewMessageSucessEst"));
//			            oViewModel.setProperty("/busy", false);
//		            },
//					error: function(oError){ 
//						try{
//							var sMsg = JSON.parse(oError.responseText);
//							that._createMessagePopOver(sMsg.error.innererror.errordetails);
//							MessageBox.error(that.getResourceBundle().getText("detailViewErroMessageEst"), 
//					                  {styleClass: that.getOwnerComponent().getContentDensityClass()});
//						}catch(err){};
//						oViewModel.setProperty("/busy", false);
//					}
//		        });	
//			},
			
			_getDataFatura: function(sEvent, sDetail, sItems){
				
				var oEntry = {};
				
				//*********** Fatura FIT *******************//
				if(sEvent == constant.EVENT_EST_FATUR_FIT){
					oEntry = {
									Event							: sEvent,
									Nrembarque						: sDetail.Nrembarque,
									ShipmentDetailToFaturamentoFIT	: []
							  };
				
				
			        for(var i=0;i < sItems.length; i++){
						var oObject = sItems[i].getObject();
						oEntry.ShipmentDetailToFaturamentoFIT.push({
																		Nrembarque	: oObject.Nrembarque,
																		ShpmtIt		: oObject.ShpmtIt,
																		Ebeln		: oObject.Ebeln,
																		Ebelp		: oObject.Ebelp,
																		VbelnVl		: oObject.VbelnVl
																  });
					}
				}
				//*********** Fatura INC *******************//
				else if(sEvent == constant.EVENT_EST_FATUR_INC){
					oEntry = {
							Event							: sEvent,
							Nrembarque						: sDetail.Nrembarque,
							ShipmentDetailToFaturamentoINC	: []
					  };
		
		
			         for(var i=0;i < sItems.length; i++){
						var oObject = sItems[i].getObject();
						oEntry.ShipmentDetailToFaturamentoINC.push({
																		Nrembarque	: oObject.Nrembarque,
																		ShpmtIt		: oObject.ShpmtIt,
																		Ebeln		: oObject.Ebeln,
																		Ebelp		: oObject.Ebelp,
																		VbelnVl		: oObject.VbelnVl
																  });
					}
				}
				
				return oEntry;
			},
					
			_AtualizaFrete: function(sIdTable){
				var that = this;
				
				//Get Detail
				var oView = this.getView(),
				oElementBinding = oView.getElementBinding();
				var sPath = oElementBinding.getPath(),
				oResourceBundle = this.getResourceBundle(),
				oDetail = oView.getModel().getObject(sPath);
				
				var oDataModel = this.getModel();
				oDataModel.setProperty("/busy", true);
				
				var oViewModel = this.getModel("execReceb"),
				 	oObjectReceb = oViewModel.getData();
				oObjectReceb.Agrupar = "";
				
				var oViewModel = this.getModel("detailView");
				oViewModel.setProperty("/busy", true);
				
				//Get Itens Selecionados
				var oTable = this.getView().byId(sIdTable);
				var oItems = oTable.getSelectedContexts();
				
				var sEvent = constant.EVENT_ATUALIZAR_FRETE;
				var oEntry = this._getDataRecebimento(sEvent, oDetail, oObjectReceb, oItems);
		        
		        oDataModel.create("/ZET_FBSD_ShipmentDetailSet", oEntry, {
		            success: function (oData, oResponse) {
		            	  if(sIdTable == "shipDetailTable")
		            		  that._oDialogRecebFIT.close();
			              
		            	  that._deselect_all_table(sIdTable);
			              oDataModel.refresh();
			              MessageToast.show(that.getResourceBundle().getText("detailViewMessageSucessSave"));
			              oViewModel.setProperty("/busy", false);
		            },
					error: function(oError){ 
						if(sIdTable == "shipDetailTable")
							that._oDialogRecebFIT.close();
						
						try{
							var sMsg = JSON.parse(oError.responseText);
							that._createMessagePopOver(sMsg.error.innererror.errordetails);
							MessageBox.error(that.getResourceBundle().getText("detailViewErroMessageSave"), 
					                  {styleClass: that.getOwnerComponent().getContentDensityClass()});
						}catch(err){};
						oViewModel.setProperty("/busy", false);
					}
		        });	
			}
			
		});

	}
);