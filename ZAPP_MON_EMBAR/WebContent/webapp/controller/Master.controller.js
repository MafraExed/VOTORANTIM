/*global history */
sap.ui.define([
		"nasa/ui5/monitorEmbarques/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/m/GroupHeaderListItem",
		"sap/ui/Device",
		"nasa/ui5/monitorEmbarques/model/formatter",
		"nasa/ui5/monitorEmbarques/model/constants",
	], function (BaseController, JSONModel, History, Filter, FilterOperator, GroupHeaderListItem, Device, formatter, constants) {
		"use strict";

		return BaseController.extend("nasa.ui5.monitorEmbarques.controller.Master", {

			formatter: formatter,

			/**
			 * Called when the master list controller is instantiated. It sets up the event handling for the master/detail communication and other lifecycle tasks.
			 * @public
			 */
			onInit : function () {
				
				// Control state model
				var oList = this.byId("list"),
					// Put down master list's original value for busy indicator delay,
					// so it can be restored later on. Busy handling on the master list is
					// taken care of by the master list itself.
					iOriginalBusyDelay = oList.getBusyIndicatorDelay();
	
				this._oList = oList;
				// keeps the filter and search state
				this._oListFilterState = {
					aFilter : [],
					aSearch : []
				};

				var oViewModel = this._createViewModel();
				this.setModel(oViewModel, "masterView");
				
				// Make sure, busy indication is showing immediately so there is no
				// break after the busy indication for loading the view's meta data is
				// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
				oList.attachEventOnce("updateFinished", function(){
					// Restore original busy indicator delay for the list
					oViewModel.setProperty("/delay", iOriginalBusyDelay);
				});
	
				this.getView().addEventDelegate({
					onBeforeFirstShow: function () {
						this.getOwnerComponent().oListSelector.setBoundMasterList(oList);
					}.bind(this)
				});

				this.setModel(new JSONModel, 'AddEmbarque');
				this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
				this.getRouter().attachBypassed(this.onBypassed, this);
				
				//Message PopOver
				this.initializeMessagePopOver();
			},
		
			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

			/**
			 * After list data is available, this handler method updates the
			 * master list counter and hides the pull to refresh control, if
			 * necessary.
			 * @param {sap.ui.base.Event} oEvent the update finished event
			 * @public
			 */
			onUpdateFinished : function (oEvent) {
				// update the master list object counter after new data is loaded
				this._updateListItemCount(oEvent.getParameter("total"));
				// hide pull to refresh if necessary
				this.byId("pullToRefresh").hide();
			},
			
			/**
			 * Event handler for the master search field. Applies current
			 * filter value and triggers a new search. If the search field's
			 * 'refresh' button has been pressed, no new search is triggered
			 * and the list binding is refresh instead.
			 * @param {sap.ui.base.Event} oEvent the search event
			 * @public
			 */
			onSearch : function (oEvent) {
				if (oEvent.getParameters().refreshButtonPressed) {
					// Search field's 'refresh' button has been pressed.
					// This is visible if you select any master list item.
					// In this case no new search is triggered, we only
					// refresh the list binding.
					this.onRefresh();
					return;
				}

				var sQuery = oEvent.getParameter("query");

				if (sQuery){
					this._oListFilterState.aSearch = [new Filter("Dcrnv", FilterOperator.Contains, sQuery)];					
				}else{
					this._oListFilterState.aSearch = [];					
				}

				this._applyFilterSearch();

			},			

			/**
			 * Event handler for refresh event. Keeps filter, sort
			 * and group settings and refreshes the list binding.
			 * @public
			 */
			onRefresh : function () {
				this._oList.getBinding("items").refresh();
			},			
			
			/**
			 * Event handler for the list selection event
			 * @param {sap.ui.base.Event} oEvent the list selectionChange event
			 * @public
			 */
			onSelectionChange : function (oEvent) {
				// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
				this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
			},
			
			/**
			 * Event handler for the bypassed event, which is fired when no routing pattern matched.
			 * If there was an object selected in the master list, that selection is removed.
			 * @public
			 */
			onBypassed : function () {
				this._oList.removeSelections(true);
			},	
		
			/**
			 * Event handler for navigating back.
			 * We navigate back in the browser historz
			 * @public
			 */
			onNavBack : function() {
				history.go(-1);
			},
					
			onHanleCloseAddEmbarque: function(oEvent){
		          this._oDialogAddEmbarque.close();
		    },
		                
            onHandleF4Agent: function(oEvent){
	        	this.onHandleF4Global(this._oDialogAgent, this.getView(), "ShlpAgent");
              },
              
  	        onHandleF4User: function(oEvent){
	        	this.onHandleF4Global(this._oDialogUser, this.getView(), "ShlpUser");
            },
	        onHandleF4Dterm: function(oEvent){
	        	this.onHandleF4Global(this._oDialogDterm, this.getView(), "ShlpTerminal");
            },
                    
	        onHandleF4Vstel: function(oEvent){
	        	this.onHandleF4Global(this._oDialogVstel, this.getView(), "ShlpLocExpedicao");
            },
                                    
            onConfirmShlpAgent: function(oEvent){
            	var aContexts = oEvent.getParameter("selectedContexts");

            	if (aContexts && aContexts.length) {
                	var oObject = aContexts.map(function(oContext) { return oContext.getObject(); });
                    var oInputLocal = this.getView().byId("addEmbarqueFieldAgent");
                    oInputLocal.setValue(oObject[0].Lifnr);
                    oInputLocal = this.getView().byId("addEmbarqueFieldAgentDsc");
                    oInputLocal.setText(oObject[0].Name1);
            	}
            },
                                                       
            onConfirmShlpUser: function(oEvent){
            	var aContexts = oEvent.getParameter("selectedContexts");

                if (aContexts && aContexts.length) {
                	var oObject = aContexts.map(function(oContext) { return oContext.getObject(); });
                    var oInputLocal = this.getView().byId("addEmbarqueFieldUserr");
                    oInputLocal.setValue(oObject[0].Bname);

                    oInputLocal = this.getView().byId("addEmbarqueFieldUserrDsc");
                    oInputLocal.setText(oObject[0].NameFirst + " " + oObject[0].NameLast);
                }
            },
                    
            onConfirmShlpDterm: function(oEvent){
            	var aContexts = oEvent.getParameter("selectedContexts");

                if (aContexts && aContexts.length) {
                	var oObject = aContexts.map(function(oContext) { return oContext.getObject(); });
                    var oInputLocal = this.getView().byId("addEmbarqueFieldDterm");
                    oInputLocal.setValue(oObject[0].Dterm);

                    oInputLocal = this.getView().byId("addEmbarqueFieldDtermDsc");
                    oInputLocal.setText(oObject[0].DescTerm);
                }
            },
                                                          
            onConfirmShlpVstel: function(oEvent){
            	var aContexts = oEvent.getParameter("selectedContexts");

                if (aContexts && aContexts.length) {
                	var oObject = aContexts.map(function(oContext) { return oContext.getObject(); });
                    var oInputLocal = this.getView().byId("addEmbarqueFieldVstel");
                    oInputLocal.setValue(oObject[0].Vstel);

                    oInputLocal = this.getView().byId("addEmbarqueFieldVstelDsc");
                    oInputLocal.setText(oObject[0].Name1);
                }
            },
                      
            
            onHandleSubmitAgent: function(oEvent){
            	var that = this;
            	this.getModel().read("/ZET_FBSD_SearchVendorSet", {
                	filters: this.shlp_create_filter(oEvent),
	                success: function (oData) {
                		var oAgent = that.getView().byId("addEmbarqueFieldAgent");
                        var oAgentDsc = that.getView().byId("addEmbarqueFieldAgentDsc");

	                	if (!!oData.results.length){
	                		oAgent.setValue(oData.results[0].Lifnr);
	                		oAgentDsc.setText(oData.results[0].Name1);
	                     }else{
	                    	oAgent.setValue("");
		                	oAgentDsc.setText("");
		                	this.onMessageError("addEmbarqueMessageErroGetVendor");
			    			return;
	                     }
	                  }
	            });
            },
            
            onHandleSubmitUser: function(oEvent){
            	var that = this;                          
	            this.getModel().read("/ZET_FBSD_SearchUserSet", {
                	filters: this.shlp_create_filter(oEvent),
                    success: function (oData) {
                    	if (!!oData.results.length){
                        	var oInputLocal = that.getView().byId("addEmbarqueFieldUserr");
                            oInputLocal.setValue(oData.results[0].Bname);

                            oInputLocal = that.getView().byId("addEmbarqueFieldUserrDsc");
                            oInputLocal.setText(oData.results[0].NameFirst + " " + oData.results[0].NameLast);
                        }
                     }
                });
            }, 
            
            onHandleSubmitDterm: function(oEvent){
            	var that = this;                          
	            this.getModel().read("/ZET_FBSD_SearchTerminalSet", {
                	filters: this.shlp_create_filter(oEvent),
                    success: function (oData) {
                    	if (!!oData.results.length){
                        	var oInputLocal = that.getView().byId("addEmbarqueFieldDterm");
                            oInputLocal.setValue(oData.results[0].Dterm);

                            oInputLocal = that.getView().byId("addEmbarqueFieldDtermDsc");
                            oInputLocal.setText(oData.results[0].DescTerm);
                        }
                     }
                });
            },  
            
            onHandleSubmitVstel: function(oEvent){
            	var that = this;                          
	            this.getModel().read("/ZET_FBSD_SearchLocalExpSet", {
                	filters: this.shlp_create_filter(oEvent),
                    success: function (oData) {
                    	if (!!oData.results.length){
                        	var oInputLocal = that.getView().byId("addEmbarqueFieldVstel");
                            oInputLocal.setValue(oData.results[0].Vstel);

                            oInputLocal = that.getView().byId("addEmbarqueFieldVstelDsc");
                            oInputLocal.setText(oData.results[0].Name1);
                        }
                     }
                });
            },              
            
			onHanleSaveAddEmbarque: function(oEvent){
				var that = this;
				var oDataModel = this.getModel();
								
				//Busca as informacoes para POST
				var oViewModel = this.getModel("AddEmbarque");
		        var oAddEmbarque = oViewModel.getData();
		        		        //AgentDsc 
		        				//Agent
		        //Verifica se os campos obrigatorios estao preenchidos
		        if(!oAddEmbarque.Dcrnv 
		        || !oAddEmbarque.Nvoyg 
//		        || !oAddEmbarque.Vstel
//		        || !oAddEmbarque.Dterm
		        || !oAddEmbarque.Dteta
		        || !oAddEmbarque.Agent
//		        || !oAddEmbarque.Tpembarque
		        || !oAddEmbarque.Tpnav ){
		        	this.onMessageError("messageErroCampoObrigatorio");
		        	return;
		        }
		        
		        var oEntry = {
		        				Dcrnv: oAddEmbarque.Dcrnv,
		        				Nvoyg: oAddEmbarque.Nvoyg,
		        				Ptorg: oAddEmbarque.Ptorg,
//		        				Vstel: oAddEmbarque.Vstel,
//		        				Dterm: oAddEmbarque.Dterm,
		        				Dteta: oAddEmbarque.Dteta,
//								Tpembarque: oAddEmbarque.Tpembarque,
								Tpnav: oAddEmbarque.Tpnav,
								Agent: oAddEmbarque.Agent,
								Bookingnr: oAddEmbarque.Bookingnr,
								Dtdraft: oAddEmbarque.Dtdraft,
								//Blnum: oAddEmbarque.Blnum,
								Bldate: oAddEmbarque.Bldate,
								//CeMercante: oAddEmbarque.CeMercante,								
								Drawbacknr: oAddEmbarque.Drawbacknr,
								Userr: oAddEmbarque.Userr
		        			};
						
		        var that = this;
		        
				oDataModel.create("/ZET_FBSD_ShipmentDetailSet", oEntry, {
					success: function(){ 
								that.onMessageDisplay("S","addEmbarqueMsgCriadoSucesso"); 
								that.onHanleCloseAddEmbarque();
								that.onRefresh();
					}, 
					error: function(oResponse){ 
						var oReponseMsg = JSON.parse(oResponse.responseText)
						that.createMessagePopOver(oReponseMsg);
						that.onMessageDisplay("E",oReponseMsg.error.message.value); } 					
				});	
			},	
		    
		    onHandleMessagePopover: function (oEvent) {
				this.oMessagePopover.openBy(oEvent.getSource());
			},
			
//			onConfirmEmbarque: function (oEvent){
//debugger;
//				
//
//					var fnConfirmEmbarque = function(){
//					
//					var that = this;
//					var oEntry = { Dcrnv: "" };
//					var oDataModel = this.getModel(); 	
//					///ZET_FBSD_ShipmentListSet(Dcrnv='XXXXX',Nvoyg='XXXXX',Ptorg='XXXXX',Nrembarque='XXXXX')"
//						oDataModel.update(this._oList.getSelectedContexts()[0].sPath, oEntry, {
//							success: function(){ 
//								that.onMessageDisplay("S","addEmbarqueMsgConfirmadoSucesso"); 
//								oDataModel.refresh();
//								//that.onRefresh();
//							}, 
//							error: function(oResponse){ 
//								var oReponseMsg = JSON.parse(oResponse.responseText)
//								that.createMessagePopOver(oReponseMsg);
//								that.onMessageDisplay("E",oReponseMsg.error.message.value); } 
//						});	
//						
//					};
//
//
//
//				if(this._oList.getSelectedContexts()[0]){
//					this.onMessageConfirmation( 
//							this.getResourceBundle().getText("masterPopupConfirmarEmbarque"),
//							this.getResourceBundle().getText("popupButtonTextOK"),
//						 	this.getResourceBundle().getText("popupButtonTextCancel"), 
//						 	fnConfirmEmbarque.bind(this));
//				}else{
//	    			this.onMessageDisplay("W","masterPopupSelecionarEmbarque");
//	    			return;
//				};
//			
//				
//			},
			
//			onDeleteEmbarque: function(){
//				
//				var fnDeleteEmbarque = function(){       
//						var that = this;
//						var oDataModel = this.getModel(); 	
//						///ZET_FBSD_ShipmentListSet(Dcrnv='XXXXX',Nvoyg='XXXXX',Ptorg='XXXXX',Nrembarque='XXXXX')"						
//						oDataModel.remove(this._oList.getSelectedContexts()[0].sPath, null, {
//							success: function(){ 
//								that.onMessageDisplay("S","addEmbarqueMsgDeletadoSucesso"); 
//							}, 
//							error: function(oResponse){ 
//								var oReponseMsg = JSON.parse(oResponse.responseText)
//								that.createMessagePopOver(oReponseMsg);
//								that.onMessageDisplay("E",oReponseMsg.error.message.value); 
//							} 						
//						});	
//				};
//
//				if(this._oList.getSelectedContexts()[0]){
//					this.onMessageConfirmation( 
//						this.getResourceBundle().getText("masterPopupDeletarEmbarque"),
//						this.getResourceBundle().getText("popupButtonTextOK"),
//	 					this.getResourceBundle().getText("popupButtonTextCancel"), 
//	 					fnDeleteEmbarque.bind(this));
//				}else{
//	    			this.onMessageDisplay("W","masterPopupSelecionarEmbarque");
//	    			return;
//				};	
//			},
			
			onNewEmbarque: function(oEvent){
				
				//Limpa os campos da tela Novo Embarque		        
		        var oAddEmbarque = {
		        		Dcrnv:"",
		        		Nvoyg:"",
		        		Ptorg:"",
		        		PtorgDsc:"",
		        		Vstel:"",
						Dterm:"",
						Dteta:null,
						Tpembarque:"N",
						Tpnav:"B",
						Agent:"",
						AgentDsc:"",
						Bookingnr:"",
						Dtdraft:null,
						Blnum:"",
						Bldate:null,
						CeMercante:"",
						Drawbacknr:"",
						Userr:"",
						UserrDsc:"" };
		       
		        var oViewModel = this.getModel("AddEmbarque");
		        oViewModel.setData(oAddEmbarque);
		        
				//Abre Tela para preenchimento de dados de head do embarque
		        if (! this._oDialogAddEmbarque) {
		        	var oView = this.getView();
		        	this._oDialogAddEmbarque = sap.ui.xmlfragment(oView.getId(),"nasa.ui5.monitorEmbarques.view.fragments.AddEmbarque", this);
		        }

		          this.getView().addDependent(this._oDialogAddEmbarque);

		          // toggle compact style
		          jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogAddEmbarque);
		          this._oDialogAddEmbarque.open();
		          
			},
			
	        onHandleF4Ptorg: function(oEvent){

            	if (! this._oDialogPtorg) {
                	this._oDialogPtorg = sap.ui.xmlfragment("nasa.ui5.monitorEmbarques.view.fragments.ShlpDestino", this);
                	}

                this.getView().addDependent(this._oDialogPtorg);

                // toggle compact style
                jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogPtorg);
                this._oDialogPtorg.open();
            },
                    
            onSearchHelperPtdst: function (oEvent, oTable) {

            	var sValue = oEvent.getParameter("value");
            	var aFilters = [];

            	if (sValue) {
                	var oFilter = null;
                    oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("PiName", sap.ui.model.FilterOperator.Contains, sValue)], false);
                    aFilters.push(oFilter);
                }

                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter(aFilters);

            },
             
            onConfirmShlpPtdst: function(oEvent){
            	var aContexts = oEvent.getParameter("selectedContexts");

                if (aContexts && aContexts.length) {
                	var oObject = aContexts.map(function(oContext) { return oContext.getObject(); });
                    var oInputLocal = this.getView().byId("addEmbarqueFieldPtorg");
                    oInputLocal.setValue(oObject[0].Term);

                    oInputLocal = this.getView().byId("addEmbarqueFieldPtorgDsc");
                    oInputLocal.setText(oObject[0].Name1);
                }
            },
                      
            onHandleSubmitPtorg: function(oEvent){
            	var that = this;
                var sValue = oEvent.getParameter("value");
                var oDataModel = this.getModel();
                      	  
                var oFilter = null;
                var aFilters = [];
                oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("PiName", sap.ui.model.FilterOperator.Contains, sValue)], false);
                aFilters.push(oFilter);
                          
                oDataModel.read("/ZET_FBSD_SearchPortSet", {
                	filters: aFilters,
                    success: function (oData) {
                    	if (!!oData.results.length){
                        	var oInputLocal = that.getView().byId("addEmbarqueFieldPtorg");
                            oInputLocal.setValue(oData.results[0].Term);

                            oInputLocal = that.getView().byId("addEmbarqueFieldPtorgDsc");
                            oInputLocal.setText(oData.results[0].Name1);
                        }
                     }
                });
            },              
            
			onHandleConfirmStatusFilter: function(oEvent){
				
				//Clear Filter except Dcrnv(Quick Search)
				this._oListFilterState.aSearch = this._oListFilterState.aSearch.filter(function(item) { 
					return item.sPath == "Dcrnv";
				});
				
				var oStatusItem = oEvent.getSource().getSelectedItem();
	 
				if(!!oStatusItem && oStatusItem.getKey() !== constants.ALL_STATUS) {			
					var oFilter = new Filter("Status", "EQ", oStatusItem.getKey());
					this._oListFilterState.aSearch.push(oFilter);
				} 
				
				this._applyFilterSearch(this._oListFilterState.aSearch);
				
			},
			
			onHandleConfirm: function(oEvent){
				// Get the Facet Filter lists and construct a (nested) filter for the binding
				var oFacetFilter = oEvent.getSource();
				this._filterModel(oFacetFilter);
			},
		
			
			
			onHandleFacetFilterReset: function(oEvent){
				var oFacetFilter = sap.ui.getCore().byId(oEvent.getParameter("id"));
				var aFacetFilterLists = oFacetFilter.getLists();
				for(var i=0; i < aFacetFilterLists.length; i++) {
					for(var i=0; i < aFacetFilterLists.length; i++) {
						aFacetFilterLists[i].setSelectedKeys();
					}
				}
				//Clear Filter except DataIda(Quick Search)
				this._oListFilterState.aSearch = this._oListFilterState.aSearch.filter(function(item) { 
					return item.sPath == "Dteta";
				});
				this._applyFilterSearch(this._oListFilterState.aSearch);
			},
			
			
			
			
			
			
			onSearchDate : function (oEvent) {
				
				var sOptionSearch = "Dteta";
				var sFrom = oEvent.getParameter("from");
				var sTo = oEvent.getParameter("to");
				
				//Clear Filter except Dcnrv and Status(Quick Search)
				this._oListFilterState.aSearch = this._oListFilterState.aSearch.filter(function(item) { 
					return item.sPath == "Status" || item.sPath == "Dcnrv";
				});

				if (!!sFrom) {
					this._oListFilterState.aSearch.push(new Filter(sOptionSearch, FilterOperator.BT, sFrom, sTo));
				}
				
				this._applyFilterSearch(this._oListFilterState);

			},	
			
			/* =========================================================== */
			/* begin: internal methods                                     */
			/* =========================================================== */
			_createViewModel : function() {
				return new JSONModel({
					isFilterBarVisible: false,
					filterBarLabel: "",
					delay: 0,
					//listTpEmb: constants.LISTTPEMB,
					listTpNav: constants.LISTTPNAV,
					title: this.getResourceBundle().getText("masterTitleCount", [0]),
					noDataText: this.getResourceBundle().getText("masterListNoDataText"),
					sortBy: "Dcrnv",
					groupBy: "None",
					statusFilter: [{ Status: constants.PENDENT_STATUS },
					               { Status: constants.START_STATUS },
					               { Status: constants.COMPLETED_STATUS },
					               { Status: constants.ALL_STATUS }]
				});
			},
			
			/**
			 * If the master route was hit (empty hash) we have to set
			 * the hash to to the first item in the list as soon as the
			 * listLoading is done and the first item in the list is known
			 * @private
			 */
			_onMasterMatched :  function() {
				this.getOwnerComponent().oListSelector.oWhenListLoadingIsDone.then(
						function (mParams) {
							if (mParams.list.getMode() === "None")  
								return;

							this.getRouter().getTargets().display("detailNoObjectsAvailable");	
							//var sNrembarque = mParams.firstListitem.getBindingContext().getProperty("Nrembarque");
										
							//this.getRouter().navTo("object", {Nrembarque: sNrembarque}, true);
									
							}.bind(this),
									function (mParams) {
										if (mParams.error) {
											return;
										}
										this.getRouter().getTargets().display("detailNoObjectsAvailable");
									}.bind(this)
								);
							},
			
			_showDetail : function (oItem) {
				var bReplace = !Device.system.phone;
				this.getRouter().navTo("object", {
					Nrembarque : oItem.getBindingContext().getProperty("Nrembarque")										
				}, bReplace);
			},			
			
			/**
			 * Sets the item count on the master list header
			 * @param {int} iTotalItems the total number of items in the list
			 * @private
			 */
			_updateListItemCount : function (iTotalItems) {
				var sTitle;
				// only update the counter if the length is final
				if (this._oList.getBinding("items").isLengthFinal()) {
					sTitle = this.getResourceBundle().getText("masterTitleCount", [iTotalItems]);
					this.getModel("masterView").setProperty("/title", sTitle);
				}
			},			
			
			/**
			 * Internal helper method to apply both filter and search state together on the list binding
			 * @private
			 */
			_applyFilterSearch : function () {
				var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
					oViewModel = this.getModel("masterView");
				this._oList.getBinding("items").filter(aFilters, "Application");
				// changes the noDataText of the list in case there are no filter results
				if (aFilters.length !== 0) {
					oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"));
				} else if (this._oListFilterState.aSearch.length > 0) {
					// only reset the no data text to default when no new search was triggered
					oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataText"));
				}
			},
			
			/**
			 * Internal helper method to apply both group and sort state together on the list binding
			 * @param {sap.ui.model.Sorter[]} aSorters an array of sorters
			 * @private
			 */
			_applyGroupSort : function (aSorters) {
				this._oList.getBinding("items").sort(aSorters);
			},

			/**
			 * Internal helper method that sets the filter bar visibility property and the label's caption to be shown
			 * @param {string} sFilterBarText the selected filter value
			 * @private
			 */
			_updateFilterBar : function (sFilterBarText) {
				var oViewModel = this.getModel("masterView");
				oViewModel.setProperty("/isFilterBarVisible", (this._oListFilterState.aFilter.length > 0));
				oViewModel.setProperty("/filterBarLabel", this.getResourceBundle().getText("masterFilterBarText", [sFilterBarText]));
			},
			
			_filterModel: function(oFacetFilter) {
				
				//Clear Filter except DataIda(Quick Search)
				this._oListFilterState.aSearch = this._oListFilterState.aSearch.filter(function(item) { 
					return item.sPath == "Dteta";
				});
				
				var mFacetFilterLists = oFacetFilter.getLists().filter(function(oList) {
					return oList.getSelectedItems().length;
				});
	 
				
				if(mFacetFilterLists.length) {
					// Build the nested filter with ORs between the values of each group and
					// ANDs between each group
					var oFilter = new Filter(mFacetFilterLists.map(function(oList) {
						return new Filter(oList.getSelectedItems().map(function(oItem) {
							return new Filter(oList.getKey(), "EQ", oItem.getKey());
						}), false);
					}), true);
					this._oListFilterState.aSearch.push(oFilter);
				} 
				
				this._applyFilterSearch(this._oListFilterState.aSearch);
			}
	
		});
	}
);