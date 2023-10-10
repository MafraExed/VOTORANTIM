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

		return BaseController.extend("nasa.ui5.vendaIntercompany.controller.Detail", {

			formatter: formatter,
		
			onInit : function () {
				// Model used to manipulate control states. The chosen values make sure,
				// detail page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				var oViewModel = new JSONModel({
					busy : false,
					delay : 0,
					globalFilter: "",
					itemListTableTitle : this.getResourceBundle().getText("detailTitleTableItemList"),
					lineItemListTitle : this.getResourceBundle().getText("detailLineItemTableHeading")
				});
				
				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
				this.setModel(oViewModel, "detailView");
			//GS	this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
				
				
				
				//ver a utilização desse header
				debugger;
				this.setModel(new sap.ui.model.json.JSONModel(), 'infoHeadEmbarque');
				
				this._oGlobalFilter = null;
				
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
			
			onHandleFilterGlobally : function(oEvent) {
				var sQuery = oEvent.getParameter("query");
				this._oGlobalFilter = null;

				if (sQuery) {
					this._oGlobalFilter = new sap.ui.model.Filter([
						new sap.ui.model.Filter("Ptdst",  sap.ui.model.FilterOperator.Contains, sQuery),
						new sap.ui.model.Filter("MatnrDsc",  sap.ui.model.FilterOperator.Contains, sQuery)
					], false);
				}

				this._filter();
			},
	
			onFullScreenPage: function(){
				
				var oSplitApp = this.getOwnerComponent().getAggregation("rootControl").byId("idAppControl");
				var oFullScreen = (oSplitApp.getMode() == constant.HIDE_MODE ? false : true);
				
				if (oFullScreen) {
					this.onHideUnhideMaster(constant.HIDE_MODE);
				} else {
					this.onHideUnhideMaster(constant.UNHIDE_MODE);
				}
				
				var oButton = this.byId("ListItemFullButton");
				var sIcon = (oFullScreen ? "sap-icon://exit-full-screen" : "sap-icon://full-screen"),
					sText = (oFullScreen ? this.getResourceBundle().getText("detailviewToolTipFullScreen") : 
										   this.getResourceBundle().getText("detailviewToolTipHideScreen"));
				
				oButton.setIcon(sIcon);
				oButton.setTooltip(sText);
			},
			
			onHandleTableLoad: function() {
		          // disable checkboxes
				  var oTable = this.getView().byId("shipDetailTable");

				  oTable.getItems().forEach(function(r) {
		            var obj = r.getBindingContext().getObject();
		            var oStatus = obj.Status;
		            var cb = r.$().find('.sapMCb');
		            var oCb = sap.ui.getCore().byId(cb.attr('id'));
		            if (oStatus == constant.COMPLETED_STATUS) {
		              oCb.setEnabled(false);
		            }
		          });
		     },
		     
		     onHandleSelectionChange: function(oEvent){
		    	// Mantem a linha dos itens concluidos nao selecionadas
		    	 var oTable = this.getView().byId("shipDetailTable");
		    	  var oSelectedItems = oEvent.getParameter("listItems");
		    	  
		    	  oSelectedItems.forEach(function(oItem) {
		    		  var oModel = oItem.getBindingContext().getObject();
		    		  if(oModel.Status == constant.COMPLETED_STATUS)
		    			  oTable.setSelectedItem(oItem, false);		    	  	  
		    	  });
		     },
			
		     onHandleNewProcess: function(oEvent){
		    	//Message PopOver
				this._initializeMessagePopOver();
		    	 
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
				
				//Joga Itens Selecionados no Model Global para serem utilizados na DetailFlow View
				this._setDataGlobalModel();
				
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
					oObject = oView.getModel().getObject(sPath),
					oViewModel = this.getModel("detailView");

				this.getOwnerComponent().oListSelector.selectAListItem(sPath);
				
				//Message PopOver
				this._initializeMessagePopOver();

			},
/*
			_onMetadataLoaded : function () {
				// Store original busy indicator delay for the detail view
				var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
					oViewModel = this.getModel("detailView");
			},
		*/	
			_deselect_all_table: function(){
				// Mantem a linha dos itens concluidos nao selecionadas
		    	 var oTable = this.getView().byId("shipDetailTable");
		    	 var oSelectedItems = oTable.getSelectedItems();
		    	  
		    	  oSelectedItems.forEach(function(oItem) {
		    		  oTable.setSelectedItem(oItem, false);		    	  	  
		    	  })
			},
			
			_filter : function () {
				var oFilter = null;

				if (this._oGlobalFilter)
					oFilter = this._oGlobalFilter;

				this.getView().byId("shipDetailTable").getBinding("items").filter(oFilter, "Application");
			},
			
			_setDataGlobalModel: function(){
			debugger;
				var that = this;
				var oDataModel = this.getModel();
				
				var oView = this.getView(),
				oElementBinding = oView.getElementBinding();
				
				var oViewModel = this.getModel("detailView");
					oViewModel.setProperty("/busy", true);

				var sPath = oElementBinding.getPath(),
				oDataItem = oView.getModel().getObject(sPath);
				
				//Itens Selecionados na Tabela
				var oTable = this.getView().byId("shipDetailTable");
				var oItems = {values: []};
				var oSelectedItems = oTable.getSelectedItems();
				
				oSelectedItems.forEach(function(oSelectedItem) {
		    		  var oItem = oSelectedItem.getBindingContext().getObject();
		    		  oItems.values.push({
		    			  Nrembarque		: oDataItem.Nrembarque,
		    			  ShpmtIt			: oItem.ShpmtIt,
		    			  Tipovenda			: oItem.Tipovenda,
		    			  Ptdst				: oItem.Ptdst,
		    			  TipoProd			: oItem.TipoProd,
		    			  Matnr				: oItem.Matnr,	
		    			  MatnrDsc			: oItem.MatnrDsc,	
		    			  Weight			: oItem.Weight,
		    			  WeightFsc			: oItem.WeightFsc,
		    			  WeightCerflor		: oItem.WeightCerflor,
		    			  WeightCw			: oItem.WeightCw,
		    			  Volumn			: oItem.Volumn,
		    			  Unit				: oItem.Unit,
		    			  Renum				: oItem.Renum,
		    			  Stalert			: oItem.Stalert,
		    			  Stprocess			: oItem.Stprocess,	
		    			  Processnum		: oItem.Processnum	
		    		  });		    	  	  
		    	  });
				
				//Busca dados do Process Flow de acordo com os itens selecionados				
				var oEntry = {			
						Nrembarque 	            		: oDataItem.Nrembarque,
						ShipmentDetailToItems			: oItems.values,
						ShipmentDetailToSalesPFLanes 	: [],
						ShipmentDetailToSalesPFNodes 	: [],
						ShipmentDetailToDocSOHeader		: [],
						ShipmentDetailToDocPOHeader		: [],
						ShipmentDetailToDocSOItems		: [],
						ShipmentDetailToDocSOPartners	: [],
						ShipmentDetailToDocSOTxt		: [],
						ShipmentDetailToDocSOPrices		: []
				};
				
				oDataModel.create("/ZET_FBSD_ShipmentDetailSet", oEntry, {
					success: function(oData, oResponse){
						oData.ShipmentDetailToItems.results = oItems.values;
						that._setGlobalModel(oData);
		    			that._deselect_all_table();
						that.onHideUnhideMaster(constant.HIDE_MODE);
		    			that.getRouter().navTo("objectFlow", { }, true);
		    			oViewModel.setProperty("/busy", false);
					}, 
					error: function(oError){ 
						try{
							var sMsg = JSON.parse(oError.responseText);
							that._createMessagePopOver(sMsg.error.innererror.errordetails);
							MessageBox.error(that.getResourceBundle().getText("detailMessageErroSelect"), 
					                  {styleClass: that.getOwnerComponent().getContentDensityClass()});
						}catch(err){};
						oViewModel.setProperty("/busy", false);
					} 
				});
				
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
		        oButtonMsg.setText(this.getResourceBundle().getText("detailFlowMsgTitleCount", 
		        													[sMessages.length]));
			}
			
		});

	}
);