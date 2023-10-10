/*global location */
sap.ui.define([
		"nasa/ui5/monitorEmbarques/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"nasa/ui5/monitorEmbarques/model/formatter",
		"nasa/ui5/monitorEmbarques/model/constants",
		"sap/m/MessageBox",
		"sap/m/MessageToast"
	], function (BaseController, JSONModel, History, formatter, constants, MessageBox, MessageToast) {
		"use strict";

		return BaseController.extend("nasa.ui5.monitorEmbarques.controller.Detail", {

			formatter: formatter,

			onInit : function () {
				
				// Model used to manipulate control states. The chosen values make sure,
				// detail page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				debugger;
				var oViewModel = new JSONModel({
					busy: false,
					delay: 0,
					itemListTableTitle: this.getResourceBundle().getText("detailTitleTableItemList"),
					lineItemListTitle: this.getResourceBundle().getText("detailLineItemTableHeading"),
					//listTpEmb: constants.LISTTPEMB,
					listTpNav: constants.LISTTPNAV,
					listTipoVenda: constants.LISTTIPOVENDA
				});
						
				this.setModel(oViewModel, "detailView");
				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
				
				//Message PopOver
				this.initializeMessagePopOver();
				
				
			     var csspath = jQuery.sap.getModulePath("nasa.ui5.monitorEmbarques","/css/style.css");
	              jQuery.sap.includeStyleSheet(csspath);
				
	             //Controle para Search Help da Tela de Replicar Itens
	             this.replicateAction = false; 
	             
	     
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
			/**
			 * Event handler for navigating back.
			 * We navigate back in the browser historz
			 * @public
			 */
			onNavBack : function() {
				debugger;
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
			
			onDadoEmbarqueActionButton: function(oEvent){
 
				var sMode;
				
				switch(oEvent.oSource.getIcon().substr(11)) {
				    case "edit":
				    	sMode = true;
				    	break;
				    case "save":
				    	sMode = false;
						this._updateAddEmbarque();
				    	break;
				    case "sys-cancel":
				    	this._cancelUpdateEmbarque();
				    	sMode = false;				    	
				    	break;				        
				}				
				
		    	this.byId("dadosButtonSave").setVisible(sMode);
		    	this.byId("dadosButtonEdit").setVisible(!sMode);
		    	this.byId("dadosButtonCancel").setVisible(sMode);
				
				// validate user using OData and enable form
				var fieldsToEnable = [
						'dadosDteta',
						'dadosTpnav',
						'dadosAgent',
						'dadosBookingnr',
						'dadosDtdraft',
						'dadosBldate',
						'dadosDrawbacknr',
						'dadosUserr' ];
							
				var that = this;
				
				jQuery.each(fieldsToEnable, function(index, element){
					that.byId(element).setEditable(sMode);
				});
			},
			
			onItensEmbarqueButtons: function(oEvent){
				switch(oEvent.oSource.getIcon().substr(11)) {
				    case "add-document":
						this._criarItemEmbarque();
				    	break;
				    case "copy":
						this._copiarItemEmbarque();
				    	break;
				    case "duplicate":
						this._replicarItemEmbarque();
				    	break;	
				    case "edit":
						this._editarItemEmbarque();
				    	break;
				    case "delete":
				    	this._deletarItemEmbarque();
				    	break;				        
				}	
			},
			
			onHanleCloseAddItem: function(oEvent){
				this._limpaValidacao();
				this.byId("idDialogItem").setBusy(false);  //(Busy from id)	
		          this._oDialogAddItem.close(); 		 
		    },
		    
		    onHanleCloseReplicarDadosItem: function(oEvent){
		    	  this.replicateAction = false;
		          this._oDialogReplicarDados.close();
		    },
		    
		    
		    
		    //Valida os campos que dever�o ou n�o serem replicados
		    _duplicateFields: function (oReplicarItem, oItemSelected){
		    	debugger;
		    	
		    	
		    	
		    	var oDadosSaida = { Inco1:"",
									Inco2:"",
									Zterm:"",
									CeMercante:"",
								    Renum:"",
									Marks:"" };
		    	
		    	
		    	var oObjectItem = [
		    		  { tela:oReplicarItem.Inco1, 	   itens:oItemSelected.Inco1,      saida:oDadosSaida.Inco1      },
					  { tela:oReplicarItem.Inco2, 	   itens:oItemSelected.Inco2,      saida:oDadosSaida.Inco2      },
					  { tela:oReplicarItem.Zterm, 	   itens:oItemSelected.Zterm,      saida:oDadosSaida.Zterm      },
					  { tela:oReplicarItem.CeMercante, itens:oItemSelected.CeMercante, saida:oDadosSaida.CeMercante },
					  { tela:oReplicarItem.Renum,      itens:oItemSelected.Renum,      saida:oDadosSaida.Renum      },
					  { tela:oReplicarItem.Marks,      itens:oItemSelected.Marks,      saida:oDadosSaida.Marks      }
					];
		    	

		    	 oObjectItem.forEach(function(object) {

		    		 if (!object.tela || (object.tela == '') || (object.tela == undefined)) {
		    			 debugger;
		    			 object.saida = object.itens;
					}else{
						debugger;
						object.saida = object.tela;   			 
					}
		    	 });
		    	 
		    	 debugger;
		    
		    	 oReplicarItem.Inco1      = oObjectItem[0].saida;
				 oReplicarItem.Inco2      = oObjectItem[1].saida;
				 oReplicarItem.Zterm      = oObjectItem[2].saida;
				 oReplicarItem.CeMercante = oObjectItem[3].saida;
				 oReplicarItem.Renum      = oObjectItem[4].saida;
				 oReplicarItem.Marks      = oObjectItem[5].saida;
		    	 
		    },
		    
		    
		    
		    onHandleSaveReplicarDadosItem: function(){
		    	debugger;
		    	var that= this;
		    	//Busca as informacoes para POST
		        var oReplicarItem = this.getModel("replicarItem").getData();
						        
//		        //Verifica se algum dos campos estao preenchidos para poder salvar (Se n�o vazios)
		        if(!(!oReplicarItem.Inco1 &&
	        		  !oReplicarItem.Inco2 &&
	        		  !oReplicarItem.Zterm &&
	        		  !oReplicarItem.CeMercante &&
	        		  !oReplicarItem.Renum &&
	        		  !oReplicarItem.Marks )
	        		 ){
		                
		        	
		        var oHead = this._getDataModel();
		        var inco1, inco2, zterm, marks, renum, ceMercante;
		       
		        var oEntry = {
		        		Dcrnv: oHead.Dcrnv,
		        		Nvoyg: oHead.Nvoyg,
		        		Ptorg: oHead.Ptorg,
		        		Nrembarque: oHead.Nrembarque,
		        		Tpembarque: oHead.Tpembarque,
		        		Tpnav: oHead.Tpnav,
		        		Agent: oHead.Agent,
		        		Bookingnr: oHead.Bookingnr,
		        		Dtdraft: oHead.Dtdraft,
		        		Dteta: oHead.Dteta,
		        		Bldate: oHead.Bldate,
		        		Drawbacknr: oHead.Drawbacknr,
		        		ShipmentDetailToItems: [] };
		        
		        var oTable = this.getView().byId("itensEmbarqueTable"),
		        	oSelectedItems = oTable.getSelectedContexts();
		        
		        oSelectedItems.forEach(function(oItem) {
					  var oItemSelected = oItem.getObject();
				
					  that._duplicateFields(oReplicarItem, oItemSelected);
					  
					  oEntry.ShipmentDetailToItems.push({
						  									Nrembarque: oHead.NrEmbarque,
						  									Inco1: oReplicarItem.Inco1,
						  									Inco2: oReplicarItem.Inco2,
						  									Zterm: oReplicarItem.Zterm,
						  									Marks: oReplicarItem.Marks,
						  									Renum: oReplicarItem.Renum,
						  									CeMercante: oReplicarItem.CeMercante,
						  									ShpmtIt: oItemSelected.ShpmtIt,
						  					        		Matnr: oItemSelected.Matnr,
						  					        		Route: oItemSelected.Route,
						  					        		Dteta: oItemSelected.Dteta,
						  					        		Weight: oItemSelected.Weight,
						  					        		WeightFsc: oItemSelected.WeightFsc,
						  					        		WeightCerflor: oItemSelected.WeightCerflor,
						  					        		WeightCw: oItemSelected. WeightCw,
						  					        		Volumn: oItemSelected.Volumn,
						  					        		Unit: oItemSelected.Unit,
						  									Ptdst: oItemSelected.Ptdst,
//						  									Ptdst: oItemSelected.Ptdst,
						  									Cdsre: oItemSelected.Cdsre,
						  									Docref: oItemSelected.Docref,
						  									DocrefItem: oItemSelected.DocrefItem,
						  									Werkso: oItemSelected.Werkso,
						  									Lgorto: oItemSelected.Lgorto,
						  									Blnum: oItemSelected.Blnum,
						  									Tipovenda: oItemSelected.Tipovenda
					  									});									
	    	  });
		        
				var oDataModel = this.getView().getModel();
				
			
				// Replicando o item
				oDataModel.create("/ZET_FBSD_ShipmentDetailSet", oEntry, {
					success: function(){ 
						that.replicateAction = false;
						that.onMessageDisplay("S","itemEmbarqueMsgReplicadoSucesso"); 
						that.onHanleCloseReplicarDadosItem();
						oDataModel.refresh();
					}, 
					error: function(oResponse){ 
						that._displayModelError(that, oResponse);
					} 
				});		
				
				
		        }else{
		        	MessageBox.error(this.getResourceBundle().getText("itensEmbarqueMessageFill"), 
			                  {
			                styleClass: this.getOwnerComponent().getContentDensityClass()
			                  }
			                );
					return;
		        };//ENd If valida algum campo preenchido
		        
		    },
		    
		    
		    
		    
		    
		    
		    
		    
		    _validaCampos: function(oAddItem){
		    	debugger;
	    	      	
		      	var oValidaCampos = [
					  { tela:oAddItem.Marks, 	  id:"addItemMarks"      },
					  { tela:oAddItem.Zterm, 	  id:"addItemFieldZterm" },
					  { tela:oAddItem.Inco1, 	  id:"addItemFieldInco1" },
					  { tela:oAddItem.Ptdst, 	  id:"addItemFieldPtdst" },
					  { tela:oAddItem.Route,      id:"addItemFieldRoute" },
					  { tela:oAddItem.Unit,       id:"addItemUnit"       },
					  { tela:oAddItem.Weight,     id:"addItemPeso"  	 },
					  { tela:oAddItem.Tipovenda,  id:"addItemTipoVenda"  },
					  { tela:oAddItem.Matnr,      id:"addItemFieldMatnr" }
					];
	      	
		    	 var that = this;
		    	 
		    	 oValidaCampos.forEach(function(campos) {

		    		 if (!campos.tela || (campos.tela == '') || (campos.tela == undefined)) {
		    			 that.getView().byId(campos.id).setValueState(sap.ui.core.ValueState.Error);
					}else{
						that.getView().byId(campos.id).setValueState(sap.ui.core.ValueState.None);
					}
		    		 	    			 
		    	 });
			},	
		    
		    
		    _limpaValidacao: function(){
		    	this.getView().byId("addItemFieldInco1").setValueState(sap.ui.core.ValueState.None);
		    	//this.getView().byId("addItemFieldInco2").setValueState(sap.ui.core.ValueState.None);
		    	this.getView().byId("addItemPeso").setValueState(sap.ui.core.ValueState.None);
		    	this.getView().byId("addItemUnit").setValueState(sap.ui.core.ValueState.None);
		    	this.getView().byId("addItemTipoVenda").setValueState(sap.ui.core.ValueState.None);
		    	this.getView().byId("addItemFieldRoute").setValueState(sap.ui.core.ValueState.None);
		    	this.getView().byId("addItemFieldMatnr").setValueState(sap.ui.core.ValueState.None);
		    	this.getView().byId("addItemFieldPtdst").setValueState(sap.ui.core.ValueState.None);
		    	this.getView().byId("addItemFieldZterm").setValueState(sap.ui.core.ValueState.None);
		    	this.getView().byId("addItemMarks").setValueState(sap.ui.core.ValueState.None);
		    	
		    },
		    
		    
		    onHandleSaveAddItem: function(){
		    	debugger;

		    	/**Limpar valida��es de campos obrigatorios*/
		    	this._limpaValidacao();  	
		    	
				//Busca as informacoes para POST
		        var oAddItem = this.getModel("addItem").getData();
						        
		        //Verifica se os campos obrigatorios estao preenchidos
		        if(!oAddItem.Tipovenda
				        || !oAddItem.Matnr
				        || !oAddItem.Weight
				        || !oAddItem.Unit
				        //|| !oAddItem.Blnum
				        || !oAddItem.Route
				        || !oAddItem.Ptdst
				        || !oAddItem.Inco1
//				        || !oAddItem.Inco2
				        || !oAddItem.Zterm
				        || !oAddItem.Marks){
		        	
		        	
		        	this.onMessageDisplay("E","messageErroCampoObrigatorio");
		        	/**Exibir campos obrigatorios com erros para o usu�rio*/	
			        this._validaCampos(oAddItem);	
			        return;
		        };

		 		
				//this._oDialogAddItem.setBusy(true); (Set Busy on Dialog)
		        this.byId("idDialogItem").setBusy(true);  //(Busy from id)
		        
		        var NrEmbarque = this._getDataModel().Nrembarque;
		        var sPathList, vMode;
		        var itemErro;
		        try {
		        	 var item =	oAddItem.ShpmtIt;
		        	 	 item = parseInt(item);
						 itemErro = '';
				} catch (e) {
					// TODO: handle exception
					 itemErro = 'erroConversao';
					 	item  = 0;
				}
		       
		        // Montando o path e definindo o tipo de  acao em cima do item
//		        if(oAddItem.ShpmtIt){
	        	if (item > 0){
		        	sPathList = "/ZET_FBSD_ShipmentItemsSet(Nrembarque='"+NrEmbarque+"',ShpmtIt='"+oAddItem.ShpmtIt+"')";
		        	vMode = "U"; // Alterando item
		        }else{
		        	sPathList = "/ZET_FBSD_ShipmentItemsSet";
		        	vMode = "N"; // Criando novo item
		        	oAddItem.ShpmtIt = "000000";
		        };

		        var oEntry = {
		        		Nrembarque: NrEmbarque,
		        		Tipovenda: oAddItem.Tipovenda,
		        		ShpmtIt: oAddItem.ShpmtIt,
		        		Matnr: oAddItem.Matnr,
		        		Weight: oAddItem.Weight,
		        		Unit: oAddItem.Unit,
						Ptdst: oAddItem.Ptdst,
						Inco1: oAddItem.Inco1,
						Inco2: oAddItem.Inco2,//GS
						Route: oAddItem.Route,
//						RouteDsc: oAddItem.Bezei, GS
						Processnum: oAddItem.Processnum, //GS 
						Blnum: oAddItem.Blnum,
						CeMercante: oAddItem.CeMercante,
						Zterm: oAddItem.Zterm,
						Docref: oAddItem.Docref,
						DocrefItem: oAddItem.DocrefItem,
						Renum: oAddItem.Renum,
						Werkso: oAddItem.Werkso,//GS
						Lgorto: oAddItem.Lgorto,//GS
						Marks: oAddItem.Marks };
		        
		        var that = this;
				var oDataModel = this.getView().getModel();
				
		
				if(vMode=="N"){					
					// Criando um novo item
					oDataModel.create(sPathList, oEntry, {
						success: function(){ 
							that.onMessageDisplay("S","itemEmbarqueMsgCriadoSucesso"); 
							that._limpaValidacao();
							that.onHanleCloseAddItem();
							oDataModel.refresh();
						}, 
						error: function(oResponse){ 
							that._limpaValidacao();
							that._displayModelError(that, oResponse);
						} 
						
					
					});						
				}else{
					// Alterando um item existente
					oDataModel.update(sPathList, oEntry, {
						success: function(){ 
							that.onMessageDisplay("S","itemEmbarqueMsgAtualizadoSucesso"); 
							that._limpaValidacao();
							that.onHanleCloseAddItem();	
						}, 
						error: function(oResponse){ 
							that._limpaValidacao();
							that._displayModelError(that, oResponse);
						} 					
					});						
				};
			

		    },
		    
			onHandleMessagePopover: function (oEvent) {
				this.oMessagePopover.openBy(oEvent.getSource());
			},
			
			
			
			
			

		    onHandleIconTabBarSelect: function(oEvent){
		    	var vMode = this.byId(oEvent.mParameters.selectedKey).getIcon() == "sap-icon://activities" ? true : false;
		    	this.byId("detailButtonNewItem").setVisible(vMode);
//		    	this.byId("detailButtonCopyItem").setVisible(vMode);
		    	this.byId("detailButtonDuplicateItem").setVisible(vMode);
		    	this.byId("detailButtonEditItem").setVisible(vMode);
		    	this.byId("detailButtonDeleteItem").setVisible(vMode);
		    	
		    	//Botao Confirmar Embarque
		    	if (this.byId(oEvent.mParameters.selectedKey).getIcon() == "sap-icon://activity-items") {
		    		this.byId("detailButtonConfirm").setVisible(true);
		    		//this.byId("detailButtonCancel").setVisible(true);
				} else {
					this.byId("detailButtonConfirm").setVisible(false);	
					//this.byId("detailButtonCancel").setVisible(false);	
				}	
		    	
		    	/**Set Visible botao cancelar embarque*/
		    	var vModeCancel = this.byId(oEvent.mParameters.selectedKey).getIcon() == "sap-icon://process" ? true : false;
		    	this.byId("detailButtonCancel").setVisible(vModeCancel);
		    }, 
		    
	        onHandleF4Matnr: function(oEvent){
	        	this.onHandleF4Global(this._oDialogMatnr, this.getView(), "ShlpMaterial");
            },

            onHandleF4Ptdst: function(oEvent){
            	debugger;
	        	this.onHandleF4Global(this._oDialogPtdst, this.getView(), "ShlpDestino");
            },
            
	        onHandleF4Zterm: function(oEvent){
	        	this.onHandleF4Global(this._oDialogZterm, this.getView(), "ShlpCondPagto");
            },

	        onHandleF4Incoterms: function(oEvent){
	        	debugger;
	        	this.onHandleF4Global(this._oDialogIncoterms, this.getView(), "ShlpIncoterms");
            },
            
            
            
			//*******Search Help Route*******//
			onHandleF4Route: function(oEvent){
						
				debugger;
				
				this.onHandleF4Global(this._oDialogRoute, this.getView(), "ShlpRoute");		
				
						
//						this.sPathRoute = oEvent.getSource().getParent().getParent().getBindingContextPath();
//						
//			             if (! this._oDialogRoute) {
//			                  this._oDialogRoute = sap.ui.xmlfragment("nasa.ui5.monitorEmbarques.view.fragments.ShlpRoute", this);
//			              }
//		
//			              this.getView().addDependent(this._oDialogRoute);
//		
//			              // toggle compact style
//			              jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogRoute);
//			              this._oDialogRoute.open();
			                
			         },
            
            onConfirmShlpRoute: function(oEvent){
	        	  debugger;
	               var aContexts = oEvent.getParameter("selectedContexts");

	               if (aContexts && aContexts.length) {
	                    var oObject = aContexts.map(function(oContext) { return oContext.getObject(); });
	               
	                    var oInputLocal = this.getView().byId("addItemFieldRoute");
	                    oInputLocal.setValue(oObject[0].Route);

	                    oInputLocal = this.getView().byId("addItemFieldRouteDsc");
	                    oInputLocal.setText(oObject[0].Bezei);
	                    
	                    
	                    // var oModel = this.getView().getModel("dataDocument");
						//var oDataObject = oModel.getProperty(this.sPathRoute);
						//oDataObject.Route = oObject[0].Route;
						//oDataObject.RouteDsc = oObject[0].Bezei;	
						//oModel.setProperty(this.sPathRoute, oDataObject);
	                
	               
	               }
	            },
            
            
	         onSearchHelperRoute : function (oEvent) {
	        	 debugger;
	        	 var sValue = oEvent.getParameter("value");
                  var aFilters = [];


                  if (sValue) {
                    var oFilter = null;
//                    oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("Route", sap.ui.model.FilterOperator.Contains, sValue)], false);
                    oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("Bezei", sap.ui.model.FilterOperator.Contains, sValue)], false);
                    aFilters.push(oFilter);
                  }

                  var oBinding = oEvent.getSource().getBinding("items");
                  oBinding.filter(aFilters);

	          },
            
            
            onConfirmShlpMatnr: function(oEvent){
            	debugger;
            	var aContexts = oEvent.getParameter("selectedContexts");

                if (aContexts && aContexts.length) {
                	var oObject = aContexts.map(function(oContext) { return oContext.getObject(); });
                    var oInputLocal = this.getView().byId("addItemFieldMatnr");
                    oInputLocal.setValue(oObject[0].Matnr);

                    oInputLocal = this.getView().byId("addItemFieldMatnrDsc");
                    oInputLocal.setText(oObject[0].Name1);
                }
            },
                      
            onConfirmShlpPtdst: function(oEvent){
            	var aContexts = oEvent.getParameter("selectedContexts");

                if (aContexts && aContexts.length) {
                	var oObject = aContexts.map(function(oContext) { return oContext.getObject(); });
                    var oInputLocal = this.getView().byId("addItemFieldPtdst");
                    oInputLocal.setValue(oObject[0].Term);

                    oInputLocal = this.getView().byId("addItemFieldPtdstDsc");
                    oInputLocal.setText(oObject[0].Name1);
                }
            },

            onConfirmShlpZterm: function(oEvent){
            	var aContexts = oEvent.getParameter("selectedContexts");

                if (aContexts && aContexts.length) {
                	var oObject = aContexts.map(function(oContext) { return oContext.getObject(); });
                    //var oInputLocal = this.getView().byId("addItemFieldZterm");
                	var oInputLocal = !!this.replicateAction ? this.getView().byId("ReplicarFieldZterm") : this.getView().byId("addItemFieldZterm");
                    oInputLocal.setValue(oObject[0].Zterm);

                    //oInputLocal = this.getView().byId("addItemFieldZtermDsc");
                    oInputLocal = !!this.replicateAction ? this.getView().byId("ReplicarFieldZtermDsc") : this.getView().byId("addItemFieldZtermDsc");
                    oInputLocal.setText(oObject[0].Name1);
                }
            },

            onConfirmShlpIncoterms: function(oEvent){
            	
            	debugger;
            	var aContexts = oEvent.getParameter("selectedContexts");

                if (aContexts && aContexts.length) {
                	var oObject = aContexts.map(function(oContext) { return oContext.getObject(); });
                    var oInputLocal = !!this.replicateAction ? this.getView().byId("ReplicarFieldInco1") : this.getView().byId("addItemFieldInco1");
                    oInputLocal.setValue(oObject[0].Inco1);
                }
            },
            
            onHandleSubmitMatnr: function(oEvent){
            	var that = this;
                this.getModel().read("/ZET_FBSD_SearchMaterialSet", {
                	filters: this.shlp_create_filter(oEvent),
                    success: function (oData) {
                    	if (!!oData.results.length){
                        	var oInputLocal = that.getView().byId("addItemFieldMatnr");
                            oInputLocal.setValue(oData.results[0].Matnr);

                            oInputLocal = that.getView().byId("addItemFieldMatnrDsc");
                            oInputLocal.setText(oData.results[0].Name1);
                        }
                     }
                });
            },              
            
            onHandleSubmitZterm: function(oEvent){
            	var that = this;
            	this.getModel().read("/ZET_FBSD_SearchCondPagtoSet", {
                	filters: this.shlp_create_filter(oEvent),
                    success: function (oData) {
                    	if (!!oData.results.length){
                        	//var oInputLocal = that.getView().byId("addItemFieldZterm");
                        	var oInputLocal = !!that.replicateAction ? that.getView().byId("ReplicarFieldZterm") : that.getView().byId("addItemFieldZterm");
                    		oInputLocal.setValue(oData.results[0].Zterm);

                            //oInputLocal = that.getView().byId("addItemFieldZtermDsc");
                            oInputLocal = !!that.replicateAction ? that.getView().byId("ReplicarFieldZtermDsc") : that.getView().byId("addItemFieldZtermDsc");
                            oInputLocal.setText(oData.results[0].Name1);
                        }
                     }
                });
            },              
                                  
            onHandleSubmitPtdst: function(oEvent){
            	debugger;
            	var that = this;
            	this.getModel().read("/ZET_FBSD_SearchPortSet", {
                	filters: this.shlp_create_filter(oEvent),
                    success: function (oData) {
                    	if (!!oData.results.length){
                        	var oInputLocal = that.getView().byId("addItemFieldPtdst");
                            oInputLocal.setValue(oData.results[0].Term);

                            oInputLocal = that.getView().byId("addItemFieldPtdstDsc");
                            oInputLocal.setText(oData.results[0].Name1);
                        }
                     }
                });
            },

            onHandleSubmitIncoterms: function(oEvent){
            	debugger;
            	var that = this;
            	this.getModel().read("/ZET_FBSD_SearchIncoSet", {
                	filters: this.shlp_create_filter(oEvent),
                    success: function (oData) {
                    	if (!!oData.results.length){
                        	//var oInputLocal = that.getView().byId("addItemFieldInco1");
                        	var oInputLocal = !!that.replicateAction ? that.getView().byId("ReplicarFieldInco1") : that.getView().byId("addItemFieldInco1");
                            oInputLocal.setValue(oData.results[0].inco1);
                        }
                     }
                });
            },
            
			onHandleSubmitRoute: function(oEvent){
				debugger;
							
				var that = this;
            	this.getModel().read("/ZET_FBSD_SearchItinerarySet", {
                	filters: this.shlp_create_filter(oEvent),
                    success: function (oData) {
                    	                    
                    	if (!!oData.results.length){
                        	var oInputLocal = that.getView().byId("addItemFieldRoute");
                            oInputLocal.setValue(oData.results[0].Route);

                            oInputLocal = that.getView().byId("addItemFieldRouteDsc");
                            oInputLocal.setText(oData.results[0].Bezei);
                        }
                             
                    }
                });
            },
               	
		           
			onPressBuscar: function(oEvent){
						
				var vNrEmbarque = this._getDataModel().Nrembarque,
						 vDcrnv = this._getDataModel().Dcrnv,
						 vNvoyg = this._getDataModel().Nvoyg;
				var valid;
				var vDocref		=	this.getView().byId("addItemDocref").getValue();
				var vDocrefItem =   this.getView().byId("addItemDocrefItem").getValue();
				
				//Encode Url (Espa�os no nome do navio)
				vDcrnv = encodeURIComponent(vDcrnv);

				var vEntidade = "/ZET_FBSD_ShipPlanItemSet";
				var vPath = vEntidade.concat("(Dcrnv='", vDcrnv, "',Nvoyg='", vNvoyg, "',Docref='", vDocref, "',DocrefItem='", vDocrefItem, "')");
			           	
				
				//Valida��o de campos associados a Busca 
				this.getView().byId("addItemDocref").setValueState(sap.ui.core.ValueState.None);
				this.getView().byId("addItemDocrefItem").setValueState(sap.ui.core.ValueState.None);
				this.getView().byId("addItemBtn").setType(sap.m.ButtonType.Default);
								
		      
				switch (true) {
				case (!vDocref && !vDocrefItem):
						this.getView().byId("addItemDocref").setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("addItemDocrefItem").setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("addItemBtn").setType(sap.m.ButtonType.Reject);
						valid = false;
					break;
				
				case (vDocrefItem && !vDocref):
						this.getView().byId("addItemDocref").setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("addItemDocrefItem").setValueState(sap.ui.core.ValueState.None);
						this.getView().byId("addItemBtn").setType(sap.m.ButtonType.Reject);
						valid = false;
					break;	
				case (vDocref && !vDocrefItem):
						this.getView().byId("addItemDocref").setValueState(sap.ui.core.ValueState.None);
						this.getView().byId("addItemDocrefItem").setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("addItemBtn").setType(sap.m.ButtonType.Reject);
						valid = false;
						break;

				default:
					 valid = true;		
						
				};
			      	
            	
            		
				
				//Busca Autorizada
				if (valid == true) {
							
					 var oAddItem = {
				        		Tipovenda:"",
				        		Werkso:"",
				        		Lgorto:"",
				        		Matnr:"",
				        		MatnrDsc:"",
				        		Weight:"",
				        		Unit:"",
								Ptdst:"",
								Inco1:"",
								Inco2:"",
								Blnum:"",
								CeMercante:"",
								Zterm:"",
								Docref:"",
								DocrefItem:"",
								Marks:"",
								Renum:""
				        };
							debugger;
					//trazer dados da tela para modelo local
					 var oViewModel = this.getModel("addItem");
					 oAddItem = oViewModel.getData();
					
					//Metodo read Entity
					 var oModel = this.getView().getModel();
					 BuscarDocref (vPath, oAddItem, oModel, oViewModel);
					valid = false;
				};//EndIF	
					
			
				/*Metodo read Entity*/
				function BuscarDocref (sPath, oAddItem, oModel, oViewModel){
				
					oModel.read(sPath, {
	            	     async : false,
	            	     success : function(oData, response) {
 	            	    	 debugger;
 	            	    	 //transporta dados do retorno do servi�o para model local
		            	    	oAddItem = oData;  
		            	     //Atribui dados na tela
		            	    	oViewModel.setData(oAddItem);
		            	    
		            	    	
		            	    console.log("Os dados foram retornados com Sucesso!");
		            	    console.log(response);
	            	     },
	            	     error : function(oError) {
	            	         debugger;  
	            	    	 console.log("Erro ao buscar servi�o")
	            	    	 console.log(oError);
	            	    	 
	            	    }
	            	     
	            	 });
				
				};
				
				
				
			},//onPressBuscar			
			
			
		     onSearch: function(oEvent){
		    	 var sValue = oEvent.getParameter("query");
                 var aFilters = [];

                 if (sValue) {
                   var oFilter = null;
                   oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("SearchString", sap.ui.model.FilterOperator.EQ, sValue)], false);
                   aFilters.push(oFilter);
                 }

                 var oTable = this.byId("itensEmbarqueTable"), 
                 	 oBinding = oTable.getBinding("items");
                 
                 oBinding.filter(aFilters);
		     },
	   
		     	
		   //Confirmar ou Cancelar Embarque Detail View
		     onConfirmEmbarque: function (oEvent) {
		     		//Retorna acao dos botoes
		     		var acao = oEvent.mParameters.id.split('---')[1].split('--')[1]
		     		var fnEmbarque = function () {
		     			var that = this;
		     			var oDataModel = this.getModel();
		     			switch (acao) {
		     			case "detailButtonConfirm":
		     				//Acao Confirmar	
		     				var oEntry = {
		     					Dcrnv: ""
		     				};
		     				oDataModel.update(Path, oEntry, {
		     					success: function () {
		     						that.onMessageDisplay("S", "addEmbarqueMsgConfirmadoSucesso");
		     						oDataModel.refresh();
		     						//that.onRefresh();
		     					}
		     					, error: function (oResponse) {
		     						var oReponseMsg = JSON.parse(oResponse.responseText);
		     						that.createMessagePopOver(oReponseMsg);
		     						that.onMessageDisplay("E", oReponseMsg.error.message.value);
		     					}
		     				});
		     				break;
		     			case "detailButtonCancel":
		     				//Acao Cancelar					
		     				oDataModel.remove(Path, { method: "DELETE",
								success: function() {
									debugger;
									
									that.onMessageDisplay("S","addEmbarqueMsgDeletadoSucesso"); 
									//esperar para voltar a tela
									 setTimeout(function(){
									       that._returnCancel();
									    }, 1510);
									
								},
								error: function(oResponse) {
									debugger;
									var oReponseMsg = JSON.parse(oResponse.responseText)
		     						that.createMessagePopOver(oReponseMsg);
		     						that.onMessageDisplay("E", oReponseMsg.error.message.value);
								}
							});						
		     				
		       				break;
		     			}
		     		}; //End fnConfirmar Embarque
		     		var Entidade = "/ZET_FBSD_ShipmentListSet";
		     		var navio = this.getView().oModels.dadosEmbarque.oData.Dcrnv;
		     		var viagem = this.getView().oModels.dadosEmbarque.oData.Nvoyg;
		     		var porto = this.getView().oModels.dadosEmbarque.oData.Ptorg;
		     		var embarque = this.getView().oModels.dadosEmbarque.oData.Nrembarque;
		     		navio = encodeURIComponent(navio);
		     		var Path = Entidade.concat("(Dcrnv='", navio, "',Nvoyg='", viagem, "',Ptorg='", porto, "',Nrembarque='", embarque, "')");
		     		switch (acao) {
		     		case "detailButtonConfirm":
		     			if (Path) {
		     				this.onMessageConfirmation(this.getResourceBundle().getText("masterPopupConfirmarEmbarque"), this.getResourceBundle().getText("popupButtonTextOK"), this.getResourceBundle().getText("popupButtonTextCancel"), fnEmbarque.bind(this));
		     			}
		     			else {
		     				this.onMessageDisplay("W", "masterPopupSelecionarEmbarque");
		     				return;
		     			};
		     			break;
		     		case "detailButtonCancel":
		     			if (Path) {
		     				this.onMessageConfirmation(this.getResourceBundle().getText("masterPopupDeletarEmbarque"), this.getResourceBundle().getText("popupButtonTextOK"), this.getResourceBundle().getText("popupButtonTextCancel"), fnEmbarque.bind(this));
		     			}
		     			else {
		     				this.onMessageDisplay("W", "masterPopupSelecionarEmbarque");
		     				return;
		     			};
		     			break;
		     		}
		     		
		     		},
		     
		     		     		
		     		_returnCancel: function(){
		     			this.getRouter().navTo("master", {}, true);
		     		
		     			
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
		    
		
			_onObjectMatched : function (oEvent) {
				var sNrembarque =  oEvent.getParameter("arguments").Nrembarque;

				this.getModel().metadataLoaded().then( function() {
					var sObjectPath = this.getModel().createKey("ZET_FBSD_ShipmentDetailSet", {
						Nrembarque : sNrembarque
					});
					this._bindView("/" + sObjectPath);
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
					expand: "ShipmentProcessFlow",
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

				// Model local da tela DadosEmbarque
				var oData = { Dcrnv: oObject.Dcrnv,
					    	  Nvoyg: oObject.Nvoyg,
					    	  Ptorg: oObject.Ptorg,
					    	  Vstel: oObject.Vstel,
					    	  Dterm: oObject.Dterm,
					    	  Dteta: oObject.Dteta,
					    	  Nrembarque: oObject.Nrembarque,
					    	  Tpnav: oObject.Tpnav,
					    	  Agent: oObject.Agent,
					    	  Bookingnr: oObject.Bookingnr,
					    	  Dtdraft: oObject.Dtdraft,
					    	  Bldate: oObject.Bldate,							
					    	  Drawbacknr: oObject.Drawbacknr,
					    	  Userr: oObject.Userr };  	
				
				var oViewModelJSON = new JSONModel(oData);
			    this.getView().setModel(oViewModelJSON, "dadosEmbarque");
			    
			    this.getView().setModel(new JSONModel(), "addItem");
			    this.getView().setModel(new JSONModel(), "replicarItem");

				this.getOwnerComponent().oListSelector.selectAListItem(sPath);
				
				var oTable = this.byId("itensEmbarqueTable");
				oTable.removeSelections(true);
				
			},

				
			_cancelUpdateEmbarque: function(){
				this._onBindingChange();
			},
			
					
			_updateAddEmbarque: function(){
				
				var that = this;
				var sPath = this.getView().getElementBinding().getPath();
				var oDataModel = this.getView().getModel();
				var oEntry = this.getView().getModel("dadosEmbarque").getData();
				
				//ZET_FBSD_ShipmentDetailSet('XXXXX')				
				oDataModel.update(sPath, oEntry, {
					success: function(){ 
						that.onMessageDisplay("S","addEmbarqueMsgAtualizadoSucesso"); }, 
					error: function(oResponse){ 
						that._displayModelError(that, oResponse);
					} 
				});	
			},
			
			_callDialogScreen: function(oDataItem){
				
				
		        var oViewModel = this.getModel("addItem");
		        oViewModel.setData(oDataItem);
		        
				//Abre Tela para preenchimento de dados de head do embarque
		        if (! this._oDialogAddItem) {
		        	var oView = this.getView();
		        	this._oDialogAddItem = sap.ui.xmlfragment(oView.getId(),"nasa.ui5.monitorEmbarques.view.fragments.AddItem", this);
		        }

		          this.getView().addDependent(this._oDialogAddItem);

		          // toggle compact style
		          jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogAddItem);
		       
		          //Limpa validacoes de erros 
		          this.getView().byId("addItemDocref").setValueState(sap.ui.core.ValueState.None);
				  this.getView().byId("addItemDocrefItem").setValueState(sap.ui.core.ValueState.None);
					
		          this._oDialogAddItem.open();
			},
			
			_callDialogScreen2: function(oDataItem, oEntry){
				
		        //var oViewModel = this.getModel("replicarItem");
		        //oViewModel.setData(oDataItem);
		        
				
		        if (! this._oDialogReplicarDados) {
		        	var oView = this.getView();
		        	this._oDialogReplicarDados = sap.ui.xmlfragment(oView.getId(),"nasa.ui5.monitorEmbarques.view.fragments.ReplicarDadosItem", this);
		        }

		          this.getView().addDependent(this._oDialogReplicarDados);

		          // toggle compact style
		          jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogReplicarDados);
		          this._oDialogReplicarDados.open();
			},
			
			
				
			_criarItemEmbarque: function(){
				
				//Limpa os campos da tela AddItem
		        var oAddItem = {
		        		Tipovenda:"",
		        		Werkso:"",
		        		Lgorto:"",
//		        		Werksd:"",
//		        		Lgortd:"",
		        		Matnr:"",
		        		MatnrDsc:"",
		        		Weight:"",
		        		Unit:"",
						Ptdst:"",
						Inco1:"",
						Inco2:"",
						Blnum:"",
						CeMercante:"",
						Zterm:"",
						Docref:"",
						DocrefItem:"",
						Marks:"",
						Renum:""
		        };

				//Abre Tela para preenchimento de dados de head do embarque
		       this._callDialogScreen(oAddItem);
		          			
			},
			
			
			_copiarItemEmbarque: function(){
				
				//Limpa os campos da tela AddItem
		        var oAddItem = {
		        		Tipovenda:"",
		        		Werkso:"",
		        		Lgorto:"",
//		        		Werksd:"",
//		        		Lgortd:"",
		        		Matnr:"",
		        		MatnrDsc:"",
		        		Weight:"",
		        		Unit:"",
						Ptdst:"",
						Inco1:"",
						Inco2:"",
						Blnum:"",
						CeMercante:"",
						Zterm:"",
						Docref:"",
						DocrefItem:"",
						Marks:"",
						Renum:""
		        };
			
				var oTable = this.getView().byId("itensEmbarqueTable");
				
				//Verifica se pelo menos 1 item foi selecionado
	    		if(oTable.getSelectedItems().length === 1){
	    	
	    			oAddItem = oTable.getSelectedItems()[0].getBindingContext().getObject();				
					    this._callDialogScreen(oAddItem);
	    			
	    		}else{
	    			this.onMessageDisplay("E","itensEmbarqueMessageSelectErrorCopy");
	    			return;
	    		};	
					
			},
			
			
			_replicarItemEmbarque: function(){
				
				//Verifica se algum item foi selecionado
				var oTable = this.getView().byId("itensEmbarqueTable");
			   
				if(!oTable.getSelectedItems().length){
					MessageBox.error(this.getResourceBundle().getText("itensEmbarqueMessageSelectError"), 
			                  {
			                styleClass: this.getOwnerComponent().getContentDensityClass()
			                  }
			                );
					return;
				}
				
				this.replicateAction = true;
				
				//Limpa os campos da tela Replicar
		        var oReplicarItem = {
		        		Inco1:"",
		        		Inco2:"",
		        		Zterm:"",
		        		CeMercante:"",
		        		Renum:"",
		        		Marks:""
		        };
				
		        //model local para tela Replicar  ==> LM_ReplicarDadosItens
		        var oViewModel = this.getModel("replicarItem");
		        oViewModel.setData(oReplicarItem);
				
		        
//		        var oEntry = oTable.getSelectedItems()[0].getBindingContext().getObject();				
//				this._callDialogScreen2(oReplicarItem, oEntry);
				this._callDialogScreen2();
	    	
							
				
			},
			
			
	    	_editarItemEmbarque: function(){
	    		
	    		var oTable = this.getView().byId("itensEmbarqueTable");
				//Verifica se pelo menos 1 item foi selecionado
	    		if(oTable.getSelectedItems().length === 1){
	    	
						var oEntry = oTable.getSelectedItems()[0].getBindingContext().getObject();				
					    this._callDialogScreen(oEntry);
	    			
	    		}else{
	    			//mensagem de erro para selecao de 1 item apenas
	    			this.onMessageDisplay("E","itensEmbarqueMessageSelectErrorCopy");
	    			return;
	    		};	

	    	},
	    	
	    	_deletarItemEmbarque: function(){
	    		
	    		var oTable = this.getView().byId("itensEmbarqueTable");
	    		if(oTable.getSelectedContexts()[0]){
	    			
	    			var fnDeleteItemEmbarque = function(){
						var that = this;
						var sPath = oTable.getSelectedContextPaths()[0];
						var oDataModel = this.getView().getModel();						
						oDataModel.remove(sPath, { method: "DELETE",
							success: function() {
								that.onMessageDisplay("S","itemEmbarqueMsgDeletadoSucesso"); 
							},
							error: function(oResponse) {
								that._displayModelError(that, oResponse);
							}
						});						
	    			};
	    			
					this.onMessageConfirmation( 
							this.getResourceBundle().getText("ItensEmbarquePopupDeletar"),
							this.getResourceBundle().getText("popupButtonTextOK"),
		 					this.getResourceBundle().getText("popupButtonTextCancel"), 
		 					fnDeleteItemEmbarque.bind(this));
					
	    		}else{
	    			this.onMessageDisplay("E","itensEmbarqueMessageSelectError");
	    			return;
	    		};	    		
	    	},
	    	
	    	_getDataModel: function(){
				var oDataModel = this.getModel();
		        var sPathDetail = this.getView().getElementBinding().getPath();
		        return oDataModel.getObject(sPathDetail)
	    	},
	    	
			_displayModelError: function(pThat, pResponse){
				this.byId("idDialogItem").setBusy(false);  //(Busy from id)
				var oReponseMsg = JSON.parse(pResponse.responseText);
				pThat.createMessagePopOver(oReponseMsg);
				pThat.onMessageDisplay("E",oReponseMsg.error.message.value); 
			},
			
			_getSemanticObject: function(oEvent){
				var oSource = oEvent.getSource();
				var oBinding = oSource.oBindingContexts;
				return this.getModel().getObject(oBinding.undefined.sPath).Objsem;
			}
			
		});
	}
);