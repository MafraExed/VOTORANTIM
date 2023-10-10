/*global location */
sap.ui.define([
					"nasa/ui5/planejamentoEmbarque/controller/BaseController",
					"sap/ui/model/json/JSONModel",
					"sap/ui/core/routing/History",
					"nasa/ui5/planejamentoEmbarque/model/formatter",
					"nasa/ui5/planejamentoEmbarque/model/constant",
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

		return BaseController.extend("nasa.ui5.planejamentoEmbarque.controller.Detail", {

			formatter: formatter,
		
			onInit : function () {
				// Model used to manipulate control states. The chosen values make sure,
				// detail page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				var oViewModel = new JSONModel({
					busy : false,
					delay : 0,
					itemListTableTitle : this.getResourceBundle().getText("detailTitleTableItemList"),
					lineItemListTitle : this.getResourceBundle().getText("detailLineItemTableHeading"),
					listTpEmb: constant.LISTTPEMB,
					listTpNav: constant.LISTTPNAV
				});
				
				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
				this.setModel(oViewModel, "detailView");
				
				this.setModel(new sap.ui.model.json.JSONModel(), 'infoHeadEmbarque');
				
				//Message PopOver
				this._initializeMessagePopOver();
				
				
			
				
//				  var csspath = jQuery.sap.getModulePath("nasa.ui5.planejamentoEmbarque","/css/style.css");
//	              jQuery.sap.includeStyleSheet(csspath);

			},//END ON INIT

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */
	
			onFullScreenPage: function(){
				
				var oSplitApp = this.getOwnerComponent().getAggregation("rootControl").byId("idAppControl");
				var oFullScreen = (oSplitApp.getMode() == "HideMode" ? false : true);
				
				if (oFullScreen) {
					oSplitApp.setMode("HideMode");
					
				} else {
					oSplitApp.setMode("ShowHideMode");
				}
					
				var oButton = this.byId("ListItemFullButton");
				var sIcon = (oFullScreen ? "sap-icon://exit-full-screen" : "sap-icon://full-screen"),
					sText = (oFullScreen ? this.getResourceBundle().getText("detailviewToolTipFullScreen") : 
										   this.getResourceBundle().getText("detailviewToolTipHideScreen"));
				oButton.setIcon(sIcon);
				oButton.setTooltip(sText);
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
			
		     onNewEmbarque: function(oEvent){
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
				
				//Verifica se os itens selecionados pertencem ao mesmo Local de Expedicao
				var that = this;
				var oSelectedItems = oTable.getSelectedContexts();
				var oLocalExp = "",
					oNok = false;
				
				oSelectedItems.forEach(function(oItem) {
						  var oItemSelected = oItem.getObject();
						  if(!oLocalExp){
							  oLocalExp = oItemSelected.Vstel;
						  }else{
							 if(oLocalExp !== oItemSelected.Vstel)
								oNok = true;
						  }
		    	  });
				
				if(oNok){
					MessageBox.error(that.getResourceBundle().getText("detailMessageErroLocalExp"), 
			                  {
			                styleClass: that.getOwnerComponent().getContentDensityClass()
			                  }
			                );
					return;
				}
				
				//Limpa os campos da tela Novo Embarque		        
		        var oInfoHeadEmbarque = {
		        		//Dterm: "",
						//Tpembarque: "N",
						Tpnav: "B",
						Agent: "",
						AgentDsc: "",
						Dtdraft: null,
						Drawbacknr: "",
						Dteta: null,
						Userr: "",
						UserrDsc: ""
		            };
		        
		        //Busca Usuario Default
		        var oView = this.getView(),
				oElementBinding = oView.getElementBinding();
		        var sPath = oElementBinding.getPath(),
				oResourceBundle = this.getResourceBundle(),
				oObject = oView.getModel().getObject(sPath);
		        
		        oInfoHeadEmbarque.Userr = oObject.StShipplanHeader.Userr;
		        oInfoHeadEmbarque.UserrDsc = oObject.StShipplanHeader.UserrDsc;
		       
		        var oViewModel = this.getModel("infoHeadEmbarque");
		        oViewModel.setData(oInfoHeadEmbarque);
		        
		        //Limpa o campo mensagem
		        this._initializeMessagePopOver();
				
				//Abre Tela para preenchimento de dados de head do embarque
		       
		        if (! this._oDialogAddEmbarque) {
		        	var oView = this.getView();
		        	this._oDialogAddEmbarque = sap.ui.xmlfragment(oView.getId(),"nasa.ui5.planejamentoEmbarque.view.fragments.Add_Embarque", this);
		        }

		          this.getView().addDependent(this._oDialogAddEmbarque);

		          // toggle compact style
		          jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogAddEmbarque);
		          this._oDialogAddEmbarque.open();
		          
		          //Desabilita campos container
		          var oVisibleElement = this.byId("addEmbarqueFormElementBookingnr");
			    	  oVisibleElement.setVisible(false);
			    	 
			    	  oVisibleElement = this.byId("addEmbarqueFormElementDtdraft");
			    	  oVisibleElement.setVisible(false);
			},

			onHanleSaveAddEmbarque: function(oEvent){
			
				this.oKeys = oEvent.getSource().getBindingContext().getObject();
				
				this.onMessageConfirmation(this.getResourceBundle().getText("addEmbarqueQuestionSave"),
	 					this.getResourceBundle().getText("buttonTextOK"),
	 					this.getResourceBundle().getText("buttonTextCancel"), 
	 					this._saveEmbarque.bind(this));
		    },			
			
			onHanleCloseAddEmbarque: function(oEvent){
				this.onMessageConfirmation(this.getResourceBundle().getText("addEmbarqueQuestionCancel"),
	 					this.getResourceBundle().getText("buttonTextOK"),
	 					this.getResourceBundle().getText("buttonTextNOK"), 
	 					this._closeAddEmbarque.bind(this));
		    },
		    
		    onHandleChangeTpnav: function(oEvent){
		    	var oVisible;
		    	if(oEvent.getParameters().selectedItem.getKey() == constant.COMPLETED_STATUS){
		    		oVisible = true;
		    	}else{
		    		oVisible = false;
		    	}
		    	
		    	 var oVisibleElement = this.byId("addEmbarqueFormElementBookingnr");
		    	 oVisibleElement.setVisible(oVisible);
		    	 
		    	 oVisibleElement = this.byId("addEmbarqueFormElementDtdraft");
		    	 oVisibleElement.setVisible(oVisible);
		    },
		    
		    onHandleMessagePopover: function (oEvent) {
				this.oMessagePopover.openBy(oEvent.getSource());
			},
			
		     onNavBack : function() {
		    	 debugger;
		    	 var sPreviousHash = History.getInstance().getPreviousHash();

		         if (sPreviousHash !== undefined) {
		           history.go(-1);
		         } else {
		           this.getRouter().navTo("master", {}, true);
		         }
		     },
		     
		     onSearch: function(oEvent){
		    	 var sValue = oEvent.getParameter("query");
                 var aFilters = [];

                 if (sValue) {
                   var oFilter = null;
                   oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("SearchString", sap.ui.model.FilterOperator.EQ, sValue)], false);
                   aFilters.push(oFilter);
                 }

                 var oTable = this.byId("shipDetailTable"), //shipDetailTable //itensEmbarqueTable
                 	 oBinding = oTable.getBinding("items");
                 
                 oBinding.filter(aFilters);
		     },
			/* =========================================================== */
			/* begin: methods Search Helps                                 */
			/* =========================================================== */
		    
		    //*******Search Help Agente*******/
		    
            onHandleF4Agent: function(oEvent){

                if (! this._oDialogAgent) {
                  this._oDialogAgent = sap.ui.xmlfragment("nasa.ui5.planejamentoEmbarque.view.fragments.Shlp_Agent", this);
                }

                this.getView().addDependent(this._oDialogAgent);

                // toggle compact style
                jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogAgent);
                this._oDialogAgent.open();

              },
              
              onSearchHelperAgent : function (oEvent, oTable) {

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
                
                onHandleSubmitAgent: function(oEvent){
                    var that = this;
                    var sValue = oEvent.getParameter("value");
                	  var oDataModel = this.getModel();
                	  
                	  var oFilter = null;
                	  var aFilters = [];
                    oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("Name1", sap.ui.model.FilterOperator.Contains, sValue)], false);
                    aFilters.push(oFilter);
                    
              	  oDataModel.read("/ZET_FBSD_SearchVendorSet", {
              		  filters: aFilters,
                        success: function (oData) {
	                      	if (!!oData.results.length){
	                      		var oInputLocal = that.getView().byId("addEmbarqueFieldAgent");
	                              oInputLocal.setValue(oData.results[0].Lifnr);
	
	                              oInputLocal = that.getView().byId("addEmbarqueFieldAgentDsc");
	                              oInputLocal.setText(oData.results[0].Name1);
	                      	}else{
	                      		var oInputLocal = that.getView().byId("addEmbarqueFieldAgent");
	                              oInputLocal.setValue("");
	
	                              oInputLocal = that.getView().byId("addEmbarqueFieldAgentDsc");
	                              oInputLocal.setText("");
	                              MessageBox.error(that.getResourceBundle().getText("shlpAgentMessageNotFound"), 
	        			                  {
	        			                styleClass: that.getOwnerComponent().getContentDensityClass()
	        			                  }
	        			                );
	                      	}
                        }
                      });
                  },
                  
                //*******Search Help Usuario*******/
                  
                  onHandleF4User: function(oEvent){

                      if (! this._oDialogUser) {
                        this._oDialogUser = sap.ui.xmlfragment("nasa.ui5.planejamentoEmbarque.view.fragments.ShlpUser", this);
                      }

                      this.getView().addDependent(this._oDialogUser);

                      // toggle compact style
                      jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogUser);
                      this._oDialogUser.open();

                    },
                    
                    onSearchHelperUser : function (oEvent, oTable) {

                        var sValue = oEvent.getParameter("value");
                        var aFilters = [];


                        if (sValue) {
                          var oFilter = null;
                          oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("PiName", sap.ui.model.FilterOperator.EQ, sValue)], false);
                          aFilters.push(oFilter);
                        }

                        var oBinding = oEvent.getSource().getBinding("items");
                        oBinding.filter(aFilters);

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
                      
                      onHandleSubmitUser: function(oEvent){
                          var that = this;
                          var sValue = oEvent.getParameter("value");
                      	  var oDataModel = this.getModel();
                      	  
                      	  var oFilter = null;
                      	  var aFilters = [];
                          oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("PiName", sap.ui.model.FilterOperator.EQ, sValue)], false);
                          aFilters.push(oFilter);
                          
                    	  oDataModel.read("/ZET_FBSD_SearchUserSet", {
                    		  filters: aFilters,
                              success: function (oData) {
                            	if (!!oData.results.length){
                            		var oInputLocal = that.getView().byId("addEmbarqueFieldUserr");
                                    oInputLocal.setValue(oData.results[0].Bname);

                                    oInputLocal = that.getView().byId("addEmbarqueFieldUserrDsc");
                                    oInputLocal.setText(oData.results[0].NameFirst + " " + oData.results[0].NameLast);
                            	}else{
                            		var oInputLocal = that.getView().byId("addEmbarqueFieldUserr");
                                    oInputLocal.setValue("");

                                    oInputLocal = that.getView().byId("addEmbarqueFieldUserrDsc");
                                    oInputLocal.setText("");
                                    
                                    MessageBox.error(that.getResourceBundle().getText("shlpUserMessageNotFound"), 
  	        			                  {
  	        			                styleClass: that.getOwnerComponent().getContentDensityClass()
  	        			                  }
  	        			                );
                            	}
                              }
                            });
                        },  
                        
                      //*******Search Help Terminal*******/
            		    
                        onHandleF4Terminal: function(oEvent){

                            if (! this._oDialogTerminal) {
                              this._oDialogTerminal = sap.ui.xmlfragment("nasa.ui5.planejamentoEmbarque.view.fragments.ShlpTerminal", this);
                            }

                            this.getView().addDependent(this._oDialogTerminal);

                            // toggle compact style
                            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogTerminal);
                            this._oDialogTerminal.open();

                          },
                          
                          onSearchHelperTerminal : function (oEvent) {

                              var sValue = oEvent.getParameter("value");
                              var aFilters = [];


                              if (sValue) {
                                var oFilter = null;
                                oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("PiName", sap.ui.model.FilterOperator.EQ, sValue)], false);
                                aFilters.push(oFilter);
                              }

                              var oBinding = oEvent.getSource().getBinding("items");
                              oBinding.filter(aFilters);

                            },
                          
                          onConfirmShlpTerminal: function(oEvent){
                              var aContexts = oEvent.getParameter("selectedContexts");

                              if (aContexts && aContexts.length) {
                                var oObject = aContexts.map(function(oContext) { return oContext.getObject(); });
                                var oInputLocal = this.getView().byId("addEmbarqueFieldDterm");
                                oInputLocal.setValue(oObject[0].Dterm);

                                oInputLocal = this.getView().byId("addEmbarqueFieldDtermDsc");
                                oInputLocal.setText(oObject[0].DescTerm);
                              }
                            },
                            
                            onHandleSubmitTerminal: function(oEvent){
                                var that = this;
                                var sValue = oEvent.getParameter("value");
                            	var oDataModel = this.getModel();
                            	  
                            	var oFilter = null;
                            	var aFilters = [];
                                oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("PiName", sap.ui.model.FilterOperator.EQ, sValue)], false);
                                aFilters.push(oFilter);
                                
                          	  oDataModel.read("/ZET_FBSD_SearchTerminalSet", {
                          		  filters: aFilters,
                                    success: function (oData) {
            	                      	if (!!oData.results.length){
            	                      		var oInputLocal = that.getView().byId("addEmbarqueFieldDterm");
            	                              oInputLocal.setValue(oData.results[0].Dterm);
            	
            	                              oInputLocal = that.getView().byId("addEmbarqueFieldDtermDsc");
            	                              oInputLocal.setText(oData.results[0].DescTerm);
            	                      	}else{
            	                      		var oInputLocal = that.getView().byId("addEmbarqueFieldDterm");
            	                              oInputLocal.setValue("");
            	
            	                              oInputLocal = that.getView().byId("addEmbarqueFieldDtermDsc");
            	                              oInputLocal.setText("");
            	                              MessageBox.error(that.getResourceBundle().getText("shlpTerminalMessageNotFound"), 
            	        			                  {
            	        			                styleClass: that.getOwnerComponent().getContentDensityClass()
            	        			                  }
            	        			                );
            	                      	}
                                    }
                                  });
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
				var sDcrnv =  oEvent.getParameter("arguments").Dcrnv;
				var sNvoyg =  oEvent.getParameter("arguments").Nvoyg;
				//var sPtorg =  oEvent.getParameter("arguments").Ptorg;
				
				this.getModel().metadataLoaded().then( function() {
					var sObjectPath = this.getModel().createKey("ZET_FBSD_ShipPlanDetailSet", {
						Dcrnv : sDcrnv,
						Nvoyg : sNvoyg
						//Ptorg : sPtorg
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
		        var oButtonMsg = this.byId("addEmbarqueButtonMsg");
		        oButtonMsg.setText(this.getResourceBundle().getText("addEmbarqueMsgTitleCount", [sMessages.length]));
			},
			
			_deselect_all_table: function(){
				// Mantem a linha dos itens concluidos nao selecionadas
		    	 var oTable = this.getView().byId("shipDetailTable");
		    	 
		    	 var oSelectedItems = oTable.getSelectedItems();
		    	  
		    	  oSelectedItems.forEach(function(oItem) {
		    		  oTable.setSelectedItem(oItem, false);		    	  	  
		    	  })
			},
			
			_closeAddEmbarque: function(){
				this._oDialogAddEmbarque.close();
			},
			
			_saveEmbarque: function(){
				var that = this,
			    oDataModel = this.getModel();
			
				//Busca as informacoes para POST
				var oViewModel = this.getModel("infoHeadEmbarque");
		        var oInfoHeadEmbarque = oViewModel.getData();
		        
		        var oViewModel = this.getModel("detailView");
		        oViewModel.setProperty("/busy", true);
		        
		        var oTable = this.getView().byId("shipDetailTable");
		        var oItems = oTable.getSelectedContexts();
		        
		        //var oHeadDetail = oEvent.getSource().getBindingContext().getObject();
		        var oHeadDetail = this.oKeys;
		        
		      //Verifica se os campos obrigatorios estao preenchidos
//		        if(!oInfoHeadEmbarque.Dterm || !oInfoHeadEmbarque.Tpnav || !oInfoHeadEmbarque.Agent || !oInfoHeadEmbarque.Dteta){
		        	if(!oInfoHeadEmbarque.Tpnav || !oInfoHeadEmbarque.Agent || !oInfoHeadEmbarque.Dteta){
		        	MessageBox.error(this.getResourceBundle().getText("addEmbarqueMessageErroSave"), 
			                  {
			                styleClass: this.getOwnerComponent().getContentDensityClass()
			                  }
			                );
			          return;
		        }
		        
		        var oEntry = {
		        				Dcrnv: oHeadDetail.Dcrnv,
		        				Nvoyg: oHeadDetail.Nvoyg,
		        				Ptorg: oHeadDetail.Ptorg,
//		        				Werkso: oHeadDetail.Werkso,
//		        				Lgorto: oHeadDetail.Lgorto,
				        		//Dterm: oInfoHeadEmbarque.Dterm,
								//Tpembarque: oInfoHeadEmbarque.Tpembarque,
								Tpnav: oInfoHeadEmbarque.Tpnav,
								Agent: oInfoHeadEmbarque.Agent,
								Dtdraft: oInfoHeadEmbarque.Dtdraft,
								Drawbacknr: oInfoHeadEmbarque.Drawbacknr,
								Dteta: oInfoHeadEmbarque.Dteta,
								Userr: oInfoHeadEmbarque.Userr,
								ShipmentDataToItems:[]
		        			};
		        
		        for(var i=0;i < oItems.length; i++){
					var oObject = oItems[i].getObject();
				
					if(!!oObject){
						oEntry.ShipmentDataToItems.push({
							Docref: oObject.Docref,
							DocrefItem: oObject.DocrefItem,
							Ptorg:	oObject.Ptorg,
							Werkso:	oObject.Werkso,
							Lgorto:	oObject.Lgorto,
							Matnr:  oObject.Matnr,
							Weight: oObject.Weight,
							Unit:   oObject.Unit,
							Vstel:  oObject.Vstel,
							Zterm:  oObject.Zterm,
							//Dterm:  oObject.Dterm,
							Kdmat:  oObject.Kdmat,
							Ptdst:  oObject.Ptdst,
							Inco1:  oObject.Inco1
						});
					}
				}
		     		      
		        oDataModel.create("/ZET_FBSD_ShipmentDataSet", oEntry, {
		            success: function (oData, oResponse) {
		            	that.Nrembarque = oData.Nrembarque;
		            		
			            that.onMessageConfirmation(that.getResourceBundle().getText("detailMessageNavMonitor"),
			            		  	that.getResourceBundle().getText("buttonTextOK"),
			            		  	that.getResourceBundle().getText("buttonTextNOK"), 
			            		  	that._NavMonitor.bind(that));
		            	  		
		            	  that.Nrembarque = oData.Nrembarque;
			              that._oDialogAddEmbarque.close();
			              that._deselect_all_table();
			              oDataModel.refresh();
			              oViewModel.setProperty("/busy", false);
		            },
					error: function(oError){ 
						try{
							var sMsg = JSON.parse(oError.responseText);
							that._createMessagePopOver(sMsg.error.innererror.errordetails);
							MessageBox.error(that.getResourceBundle().getText("addEmbarqueMessageErroMessageSave"), 
					                  {styleClass: that.getOwnerComponent().getContentDensityClass()});
						}catch(err){};
						oViewModel.setProperty("/busy", false);
					}
		        });	
			},
			
			_NavMonitor: function() {
				  var oNrembarque = this.Nrembarque;
				  var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
				  var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
				  target: {
							semanticObject: "NasaMonitor",
							action: "display"
						  }
				   })) || "";
				  
				  hash += "&" + constant.ENTITY_MONITOR + "('" + this.Nrembarque + "')";
				  oCrossAppNavigator.toExternal({
							  target: {
							  shellHash: hash
						  }
					    }); 
			}
			
		});

	}
);