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

		return BaseController.extend("nasa.ui5.vendaIntercompany.controller.DetailDocuments", {

			formatter: formatter,
		
			onInit : function () {	
				// Model used to manipulate control states. The chosen values make sure,
				// detail page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				var oViewModel = new JSONModel({
					busy : false,
					delay : 0,
					editFields: false,
					editFields2: false,
					shlpPartners: [],
					shlpPortdestcli: [],
					headerPrice: "",
					titlePage: "",
					itemsPrice: [],
					itemListTableTitle : this.getResourceBundle().getText("detailFlowTitleTableItemList")
				});
				
				this.getRouter().getRoute("objectDocument").attachPatternMatched(this._onObjectMatched, this);
				this.setModel(oViewModel, "detailDocumentView");
			
      
			},//END ON INIT

				
			
		     onNavBack : function() {
		    	 /*this.onMessageConfirmation(this.getResourceBundle().getText("detailFlowQuestionBack"),
		    			 					this.getResourceBundle().getText("buttonTextOK"),
		    			 					this.getResourceBundle().getText("buttonTextCancel"), 
		    			 					this.onBack.bind(this));*/
		    	 
		    	 this.onBack();
		     },
		     
		     onBack: function(){         
		           this.getRouter().navTo("objectFlow", { }, true);
		     },
		     
			onChangeMode: function(){
			
					var that = this;
					var sMode;
					var sMode2;
					
					var oObject = this.getModel("dataDocument").getData();
					
//					var buttonsToChange = [
//											'detailDocumentButtonEdit',
//											'detailDocumentItemsButtonEdit',
//											'detailDocumentPOButtonEdit',
//											'detailDocumentTextButtonEdit',
//											'detailDocumentPartnerButtonEdit'];
					
					var buttonsToChange = [
						'detailDocumentButtonEdit',
						'detailDocumentItemsButtonEdit',
						'detailDocumentPOButtonEdit',
						'detailDocumentTextButtonEdit'];
					
					jQuery.each(buttonsToChange, function(index, element){
						var oButtonEdit = that.byId(element);				
				       
						sMode = oButtonEdit.getIcon().substr(11) == "edit" ? true : false;
				        		        
						if(sMode) { 
							
							//debugger;
							//var editbtn = that.byId("detailDocumentItemsButtonEdit");
							//sMode2 = editbtn.getIcon().substr(11) == "edit" ? true : false;
//							if (sMode2) {
								if (oObject.dataHead.Auart != 'ZXAB') {
									
//									that.byId("ovRoute").setEditable(true);
//									that.byId("ovLgort").setEditable(true);
//									that.byId("ovWerks").setEditable(true);
															

									//le os dados da tela e valida o editable
									var oViewModel = that.getModel("detailDocumentView");
									oViewModel.setProperty("/editFields2", sMode);
									
								}else{
									var bloqueio = false;
									var oViewModel = that.getModel("detailDocumentView");
									oViewModel.setProperty("/editFields2", bloqueio);
								
									
//									that.byId("ovRoute").setEditable(false);
//									that.byId("ovLgort").setEditable(false);
//									that.byId("ovWerks").setEditable(false);
								};
									
//							}else{
//								var oViewModel = that.getModel("detailDocumentView");
//								oViewModel.setProperty("/editFields2", !sMode2);
//								
//							}
							
							
							oButtonEdit.setIcon("sap-icon://display");
							oButtonEdit.setTooltip( that.getResourceBundle().getText("detailDocumentsTooltipButtonView") );
						}else{ 
							
							oButtonEdit.setIcon("sap-icon://edit");
							oButtonEdit.setTooltip( that.getResourceBundle().getText("detailDocumentsTooltipButtonEdit" ) );
						}
					});
					
					
					//le os dados da tela e valida o editable
					var oViewModel = this.getModel("detailDocumentView");
					oViewModel.setProperty("/editFields", sMode);
					
					if (oObject.dataHead.Auart != 'ZXAB') {
						var oViewModel = this.getModel("detailDocumentView");
						oViewModel.setProperty("/editFields2", sMode);
					};
										
				},
				
				onHandleAddDocument: function(oEvent){
					/*this.onMessageConfirmation(this.getResourceBundle().getText("detailDocumentsMessageConfirm"),
		 					this.getResourceBundle().getText("buttonTextOK"),
		 					this.getResourceBundle().getText("buttonTextNOK"), 
		 					this._onSaveDocument.bind(this));*/
					this._onSaveDocument();
				},
				
				
				//Condicoes de precos itens
				onHandlePopoverPrice: function(oEvent){
					debugger;
					
					var oDataPrices = [];
					var oModel = this.getView().getModel("dataDocument");
					var sPath = oEvent.getSource().getParent().getBindingContextPath();
					var oObject = oModel.getProperty(sPath);
					var oTablePrice = oModel.getData();
					
					this.CodSeq = oObject.CodSeq;
					this.ItmNumber = oObject.ItmNumber;
					
					//Set Header
					var oHeader = oObject.Matnr + " " + oObject.MatnrDsc;
					
					//Set Items
					jQuery.each(oTablePrice.dataPrices, function(index, oPrice){
						if(oPrice.CodSeq == oObject.CodSeq &&
						   oPrice.ItmNumber == oObject.ItmNumber &&
						   oPrice.ItmNumber != "000000"){					
							oDataPrices.push({
								Nrembarque	: oPrice.Nrembarque,
								CodSeq		: oPrice.CodSeq,
								ItmNumber	: oPrice.ItmNumber,
								Condicao	: oPrice.Condicao,
								Descricao	: oPrice.Descricao,
								Valor		: oPrice.Valor,
								Moeda		: oPrice.Moeda,
								Bloqueio    : oPrice.Bloqueio,//GS
								Knumv    	: oPrice.Knumv,//GS
  								Kposn    	: oPrice.Kposn,//GS
  								Stunr    	: oPrice.Stunr,//GS
  								Zaehk    	: oPrice.Zaehk,//GS
  							  ChaveCondicao : oPrice.ChaveCondicao,//GS
								QtdUm		: oPrice.QtdUm,
								UnidMed		: oPrice.UnidMed
							});
							
						}
					});
					
					var oViewModel = this.getModel("detailDocumentView");
						oViewModel.setProperty("/headerPrice", oHeader);
						oViewModel.setProperty("/itemsPrice", oDataPrices);
					
					oViewModel.refresh(true);
					oModel.refresh(true);
					
					if (! this._PopOverPrice) {
						  var oView = this.getView();
						  debugger;
		                  this._PopOverPrice = sap.ui.xmlfragment(oView.getId(), "nasa.ui5.vendaIntercompany.view.fragments.PopOverPrice", this);
		            }
					
						
					debugger;
		            this.getView().addDependent(this._PopOverPrice);
		            this._PopOverPrice.openBy(oEvent.getSource());
		            
				},
				
				
				//Condicoes de precos cabeçalho - GS 23.11.2017
				onHandlePopoverPriceHeader: function(oEvent){
					debugger;
					
					var oDataPricesHeader = [];
					var oModel = this.getView().getModel("dataDocument");
					
//					var sPath = oEvent.getSource().getParent().getBindingContextPath();
//					//var sPath = "/dataPrices";
//					var oObject = oModel.getProperty(sPath);
					
					var oTablePrice = oModel.getData();
											
					//Set Header
					var oHeaderHead = "Condição de Preços do Cabeçalho";
				
					var oTablePrice = oModel.getData();
										
					//Set Items
					jQuery.each(oTablePrice.dataPrices, function(index, oPrice){
						if(oPrice.ItmNumber == "000000"){		//O item 00000 corresponde ao cabeçalho 			
							oDataPricesHeader.push({
								Nrembarque	: oPrice.Nrembarque,
								CodSeq		: oPrice.CodSeq,
								ItmNumber	: oPrice.ItmNumber,
								Condicao	: oPrice.Condicao,
								Descricao	: oPrice.Descricao,
								Valor		: oPrice.Valor,
								Moeda		: oPrice.Moeda,
								Bloqueio	: oPrice.Bloqueio,//GS
								Knumv    	: oPrice.Knumv,//GS
								Kposn    	: oPrice.Kposn,//GS
								Stunr    	: oPrice.Stunr,//GS
								Zaehk    	: oPrice.Zaehk,//GS
							  ChaveCondicao : oPrice.ChaveCondicao,//GS
							  	VbelnVa	 	: oPrice.VbelnVa,//GS
								QtdUm		: oPrice.QtdUm,
								UnidMed		: oPrice.UnidMed
							});
						}
					});
		
					//Get Selected Object
					var oViewModel = this.getModel("detailDocumentView");
					oViewModel.setProperty("/headerPriceHead", oHeaderHead);
					oViewModel.setProperty("/itemsPriceHead", oDataPricesHeader);
					
					
					oViewModel.refresh(true);
					oModel.refresh(true);
					
					
					
						//Open PopOver
		            if (! this._PopOverPriceHeader) {
						  var oView = this.getView();
						  this._PopOverPriceHeader = sap.ui.xmlfragment(oView.getId(), "nasa.ui5.vendaIntercompany.view.fragments.PopOverPriceHeader", this);
		            }
					
					this.getView().addDependent(this._PopOverPriceHeader);
		            this._PopOverPriceHeader.openBy(oEvent.getSource());
										
				},//end header preços
				
			
				
				onHandleSavePrice: function(oEvent){
				debugger;
					var that = this;
					var oTablePrice = {itemsPrice: []};
					
					var oTable = this.byId("priceTable");
					var oTableItems = oTable.getItems();
					debugger;			  
					debugger;
				    oTableItems.forEach(function(oSelectedItem) {
						 var oItem = oSelectedItem.getCells();
											  
			  
			    		  oTablePrice.itemsPrice.push({
			    			 
			    			  Condicao		: oItem[0].getProperty("number"),
			    			  Valor			: formatter.formatNumberInternational(oItem[1].getProperty("value")),
			    			  Moeda			: oItem[2].getProperty("value"),
			    			  QtdUm			: formatter.formatNumberInternational(oItem[3].getProperty("value")),
			    			  UnidMed		: oItem[4].getProperty("value"),
			    			  ChaveCondicao : oItem[6].getProperty("text"),//GS
			    			  Bloqueio		: oItem[7].getProperty("text"),//GS
			    			  Knumv			: oItem[8].getProperty("text"),//GS
							  Kposn			: oItem[9].getProperty("text"),//GS
							  Stunr			: oItem[10].getProperty("text"),//GS
							  Zaehk			: oItem[11].getProperty("text")//GS
			    		  });		    	  	  
			    	  });
					
					var oModelDocument = this.getModel("detailDocumentView"),
						oModelGlobal = this.getView().getModel("dataDocument");
					
					var	oPriceGlobal = oModelGlobal.getData();
					
					if(!!oTablePrice.itemsPrice.length){	
						debugger;
						jQuery.each(oTablePrice.itemsPrice, function(index1, oLocalPrice){
							jQuery.each(oPriceGlobal.dataPrices, function(index2, oGlobalPrices){
								
								if(oGlobalPrices.CodSeq == this.CodSeq && 
								   oGlobalPrices.ItmNumber == this.ItmNumber && 
								   oGlobalPrices.Condicao == oLocalPrice.Condicao &&
								   oGlobalPrices.ChaveCondicao == oLocalPrice.ChaveCondicao ){
									
									oPriceGlobal.dataPrices[index2].Valor = "" + oLocalPrice.Valor;
									oPriceGlobal.dataPrices[index2].Moeda = "" + oLocalPrice.Moeda;
									oPriceGlobal.dataPrices[index2].Bloqueio = "" + oLocalPrice.Bloqueio;//GS
									oPriceGlobal.dataPrices[index2].Knumv    = "" + oLocalPrice.Knumv;//GS
									oPriceGlobal.dataPrices[index2].Kposn    = "" + oLocalPrice.Kposn;//GS
									oPriceGlobal.dataPrices[index2].Stunr    = "" + oLocalPrice.Stunr;//GS
									oPriceGlobal.dataPrices[index2].Zaehk    = "" + oLocalPrice.Zaehk;//GS
							oPriceGlobal.dataPrices[index2].ChaveCondicao    = "" + oLocalPrice.ChaveCondicao;//GS
									oPriceGlobal.dataPrices[index2].QtdUm = "" + oLocalPrice.QtdUm;
									oPriceGlobal.dataPrices[index2].UnidMed = "" + oLocalPrice.UnidMed;
								}
							}.bind(this));
						}.bind(this));
					
						oModelGlobal.setData(oPriceGlobal);
						oModelGlobal.refresh(true);
					
						oModelDocument.setProperty("/itemsPrice", []);
						oModelDocument.refresh(true);
					}
					this._PopOverPrice.close();

				},
				
				
				onHandleReplicatePrice: function(oEvent){
				
					var that = this;
					var oTablePrice = {itemsPrice: []};
					
					var oTable = this.byId("priceTable");
					var oTableItems = oTable.getItems();
					
					oTableItems.forEach(function(oSelectedItem) {
			    		  var oItem = oSelectedItem.getCells();
			    		  oTablePrice.itemsPrice.push({
			    			  Condicao		: oItem[0].getProperty("number"),
			    			  Valor			: formatter.formatNumberInternational(oItem[1].getProperty("value")),
			    			  Moeda			: oItem[2].getProperty("value"),
			    			  QtdUm			: formatter.formatNumberInternational(oItem[3].getProperty("value")),
			    			  UnidMed		: oItem[4].getProperty("value"),
			    			  ChaveCondicao : oItem[6].getProperty("text"),//GS
			    			  Bloqueio		: oItem[7].getProperty("text"),//GS
			    			  Knumv			: oItem[8].getProperty("text"),//GS
							  Kposn			: oItem[9].getProperty("text"),//GS
							  Stunr			: oItem[10].getProperty("text"),//GS
							  Zaehk			: oItem[11].getProperty("text")//GS
			    		  });		    	  	  
			    	  });
				
					var oModelDocument = this.getModel("detailDocumentView"),
						oModelGlobal = this.getView().getModel("dataDocument");
					
					var	oPriceGlobal = oModelGlobal.getData();
					
					if(!!oTablePrice.itemsPrice.length){	
						debugger;
						jQuery.each(oTablePrice.itemsPrice, function(index1, oLocalPrice){
							jQuery.each(oPriceGlobal.dataPrices, function(index2, oGlobalPrices){
								
								debugger;
								if(oGlobalPrices.CodSeq == this.CodSeq && 
								   //oGlobalPrices.ItmNumber == this.ItmNumber && 
								 //  oGlobalPrices.Condicao == oLocalPrice.Condicao &&
									oGlobalPrices.ChaveCondicao == oLocalPrice.ChaveCondicao ){
									
									oPriceGlobal.dataPrices[index2].Valor = "" + oLocalPrice.Valor;
									oPriceGlobal.dataPrices[index2].Moeda = "" + oLocalPrice.Moeda;
									oPriceGlobal.dataPrices[index2].Bloqueio = "" + oLocalPrice.Bloqueio;//GS
									oPriceGlobal.dataPrices[index2].Knumv    = "" + oLocalPrice.Knumv;//GS
									oPriceGlobal.dataPrices[index2].Kposn    = "" + oLocalPrice.Kposn;//GS
									oPriceGlobal.dataPrices[index2].Stunr    = "" + oLocalPrice.Stunr;//GS
									oPriceGlobal.dataPrices[index2].Zaehk    = "" + oLocalPrice.Zaehk;//GS
									oPriceGlobal.dataPrices[index2].ChaveCondicao    = "" + oLocalPrice.ChaveCondicao;//GS
									oPriceGlobal.dataPrices[index2].QtdUm = "" + oLocalPrice.QtdUm;
								    oPriceGlobal.dataPrices[index2].UnidMed = "" + oLocalPrice.UnidMed;
								}
							}.bind(this));
						}.bind(this));
					
						oModelGlobal.setData(oPriceGlobal);
						oModelGlobal.refresh(true);
					
						oModelDocument.setProperty("/itemsPrice", []);
						oModelDocument.refresh(true);
					}
					
					this._PopOverPrice.close();
				},
				
						
				onHandleSavePriceHeader: function(oEvent){
				debugger;
					var that = this;
					var oTablePrice = {itemsPrice: []};
					
					var oTable = this.byId("priceTableHeader");
					var oTableItems = oTable.getItems();
					
					// inserir no console: oTableItems[0].getCells()[0].mProperties  para visualizar a matriz com os dados 
					
					oTableItems.forEach(function(oSelectedItem) {
						 var oItem = oSelectedItem.getCells();
											  
						 
						 // no console inserir oTablePrice.itemsPrice para visualizar o conteudo
			    		  oTablePrice.itemsPrice.push({
			    			  VbelnVa		: oItem[0].getProperty("text"),//GS
			    			  Condicao		: oItem[1].getProperty("number"),
			    			  Valor			: formatter.formatNumberInternational(oItem[2].getProperty("value")),
			    			  Moeda			: oItem[3].getProperty("value"),
			    			  QtdUm			: formatter.formatNumberInternational(oItem[4].getProperty("value")),
			    			  UnidMed		: oItem[5].getProperty("value"),
			    			  ChaveCondicao : oItem[7].getProperty("text"),//GS
			    			  Bloqueio		: oItem[8].getProperty("text"),
			    			  Knumv			: oItem[9].getProperty("text"),//GS
							  Kposn			: oItem[10].getProperty("text"),//GS
							  Stunr			: oItem[11].getProperty("text"),//GS
							  Zaehk			: oItem[12].getProperty("text")//GS
			    		  });		    	  	  
			    	  });
					
					var oModelDocument = this.getModel("detailDocumentView"),
						oModelGlobal = this.getView().getModel("dataDocument");
					
					var	oPriceGlobal = oModelGlobal.getData();
					
					if(!!oTablePrice.itemsPrice.length){					
						jQuery.each(oTablePrice.itemsPrice, function(index1, oLocalPrice){
							jQuery.each(oPriceGlobal.dataPrices, function(index2, oGlobalPrices){
								if(oGlobalPrices.CodSeq == this.sCodSeq &&  // this.CodSeq (buscar na tabela com apenas os itens 00000)
								   oGlobalPrices.ItmNumber ==  "000000" && //this.ItmNumber
								   oGlobalPrices.Condicao == oLocalPrice.Condicao &&
								   oGlobalPrices.ChaveCondicao == oLocalPrice.ChaveCondicao ){
									
									oPriceGlobal.dataPrices[index2].Valor = "" + oLocalPrice.Valor;
									oPriceGlobal.dataPrices[index2].Moeda = "" + oLocalPrice.Moeda;
									oPriceGlobal.dataPrices[index2].Bloqueio = "" + oLocalPrice.Bloqueio;//GS
									oPriceGlobal.dataPrices[index2].Knumv    = "" + oLocalPrice.Knumv;//GS
									oPriceGlobal.dataPrices[index2].Kposn    = "" + oLocalPrice.Kposn;//GS
									oPriceGlobal.dataPrices[index2].Stunr    = "" + oLocalPrice.Stunr;//GS
									oPriceGlobal.dataPrices[index2].Zaehk    = "" + oLocalPrice.Zaehk;//GS
									oPriceGlobal.dataPrices[index2].ChaveCondicao = "" + oLocalPrice.ChaveCondicao;//GS
									oPriceGlobal.dataPrices[index2].VbelnVa = "" + oLocalPrice.VbelnVa;//GS
									oPriceGlobal.dataPrices[index2].QtdUm = "" + oLocalPrice.QtdUm;
									oPriceGlobal.dataPrices[index2].UnidMed = "" + oLocalPrice.UnidMed;
								}
							}.bind(this));
						}.bind(this));
					
						oModelGlobal.setData(oPriceGlobal);
						oModelGlobal.refresh(true);
					
						oModelDocument.setProperty("/itemsPriceHead", []);
						oModelDocument.refresh(true);
					}
					
	
					this._PopOverPriceHeader.close();
				},
				
				onHandleCancelPrice: function(oEvent){
					if (this._PopOverPrice) 
						this._PopOverPrice.close();
				},
				
					onHandleCancelPriceHeader: function(oEvent){
					if (this._PopOverPriceHeader) 
						this._PopOverPriceHeader.close();
				},
	
				
			/* =========================================================== */
			/* method Search Help    	                                   */
			/* =========================================================== */	
				
			//*******Search Help Partner*******//
			onHandleF4Partner: function(oEvent){

				//Busca os Dados para Search Help
				var that = this;
				var oModel = this.getView().getModel("dataDocument");
				this.sPath = oEvent.getSource().getParent().getBindingContextPath();
				
				var oObject = oModel.getProperty(this.sPath);
				var oDataModel = this.getModel();
            	
				var oParamPartner = constant.PARTNERS.find(function (oItem) {
				    return oItem.funcao == oObject.Parvw;
				});
				
            	var oFilter = null;
            	var aFilters = [];
                oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("PiTipo", sap.ui.model.FilterOperator.EQ, oParamPartner.tipo)], false);
                
                aFilters.push(oFilter);
                
              	oDataModel.read("/ZET_FBSD_SearchPartnerSet", {
              		filters: aFilters,
                    success: function (oData) {
	                    if (!!oData.results.length){
	                    	var oPartnerModel = that.getModel("detailDocumentView");
	                    	var oPartnerModelData = oPartnerModel.getData();
	                    	oPartnerModelData.shlpPartners = oData.results;	
	                    	oPartnerModel.setData(oPartnerModelData);
	                    }
                     }
                 });
				
	             if (! this._oDialogPartner) {
	                  this._oDialogPartner = sap.ui.xmlfragment("nasa.ui5.vendaIntercompany.view.fragments.ShlpPartner", this);
	              }

	              this.getView().addDependent(this._oDialogPartner);

	              // toggle compact style
	              jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogPartner);
	              this._oDialogPartner.open();
	                
	         },
	              
	         onSearchHelperPartner : function (oEvent) {
	        	  var that = this;
	        	  var oModel = this.getView().getModel("dataDocument");
				  var oObject = oModel.getProperty(this.sPath);
				  var oDataModel = this.getModel();
	            	
				  var oParamPartner = constant.PARTNERS.find(function (oItem) {
					  return oItem.funcao == oObject.Parvw;
				  });
	        	 
	              var sValue = oEvent.getParameter("value");
	              var aFilters = [];

	              if (sValue) {
	                 var oFilter = null;
	                 oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("PiName", sap.ui.model.FilterOperator.EQ, sValue),
	                                                     new sap.ui.model.Filter("PiTipo", sap.ui.model.FilterOperator.EQ, oParamPartner.tipo)], true);
	                 aFilters.push(oFilter);
	               }
	              
	              oDataModel.read("/ZET_FBSD_SearchPartnerSet", {
	              		filters: aFilters,
	                    success: function (oData) {
		                    if (!!oData.results.length){
		                    	var oPartnerModel = that.getModel("detailDocumentView");
		                    	var oPartnerModelData = oPartnerModel.getData();
		                    	oPartnerModelData.shlpPartners = oData.results;	
		                    	oPartnerModel.setData(oPartnerModelData);
		                    }
	                     }
	                });

	            },
	              
	            onConfirmShlpPartner: function(oEvent){
	               var aContexts = oEvent.getParameter("selectedContexts");

	               if (aContexts && aContexts.length) {
	                    var oObject = aContexts.map(function(oContext) { return oContext.getObject(); });
	                    var oModel = this.getView().getModel("dataDocument");
	                    var oDataObject = oModel.getProperty(this.sPath);
	                    oDataObject.CodParc = oObject[0].CodParceiro;
	                    oDataObject.Name1 = oObject[0].Name;	
	                    oModel.setProperty(this.sPath, oDataObject);
	                }
	            },
				
				onHandleSubmitPartner: function(oEvent){
					var that = this;
					var oModel = this.getView().getModel("dataDocument");
					var sPath = oEvent.getSource().getParent().getBindingContextPath();
					var oObject = oModel.getProperty(sPath);
					var oDataModel = this.getModel();
                	
					var oParamPartner = constant.PARTNERS.find(function (oItem) {
					    return oItem.funcao == oObject.Parvw;
					});
					
                	var oFilter = null;
                	var aFilters = [];
                    oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("PiName", sap.ui.model.FilterOperator.EQ, oObject.CodParc),
                                                        new sap.ui.model.Filter("PiTipo", sap.ui.model.FilterOperator.EQ, oParamPartner.tipo)], true);
                    aFilters.push(oFilter);
                    
	              	oDataModel.read("/ZET_FBSD_SearchPartnerSet", {
	              		filters: aFilters,
	                    success: function (oData) {
		                    if (!!oData.results.length){
		                    	oObject.CodParc = oData.results[0].CodParceiro;
		                    	oObject.Name1 = oData.results[0].Name;	
		                    	oModel.setProperty(sPath, oObject);
		                    }else{
		                    	oObject.CodParc = "";
		                    	oObject.Name1 = "";	
		                    	oModel.setProperty(sPath, oObject);
		                        MessageBox.error(that.getResourceBundle().getText("shlpPartnerMessageNotFound"), 
		        			                  { styleClass: that.getOwnerComponent().getContentDensityClass() });
		                     }
	                     }
                     });
				},
				
				//*******Search Help Werks*******//
				onHandleF4Werks: function(oEvent){
					
					this.sPathWerks = oEvent.getSource().getParent().getParent().getBindingContextPath();
					
		             if (! this._oDialogWerks) {
		                  this._oDialogWerks = sap.ui.xmlfragment("nasa.ui5.vendaIntercompany.view.fragments.ShlpWerks", this);
		              }

		              this.getView().addDependent(this._oDialogWerks);

		              // toggle compact style
		              jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogWerks);
		              this._oDialogWerks.open();
		                
		         },
		              
		         onSearchHelperWerks : function (oEvent) {
		        	 var sValue = oEvent.getParameter("value");
	                  var aFilters = [];


	                  if (sValue) {
	                    var oFilter = null;
	                    oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.Contains, sValue)], false);
	                    aFilters.push(oFilter);
	                  }

	                  var oBinding = oEvent.getSource().getBinding("items");
	                  oBinding.filter(aFilters);

		          },
		              
		          onConfirmShlpWerks: function(oEvent){
		               var aContexts = oEvent.getParameter("selectedContexts");

		               if (aContexts && aContexts.length) {
		                    var oObject = aContexts.map(function(oContext) { return oContext.getObject(); });
		                    var oModel = this.getView().getModel("dataDocument");
		                    var oDataObject = oModel.getProperty(this.sPathWerks);
		                    oDataObject.Werks = oObject[0].Werks;
		                    oDataObject.WerksDsc = oObject[0].Name1;	
		                    oModel.setProperty(this.sPathWerks, oDataObject);
		                }
		            },
					
					onHandleSubmitWerks: function(oEvent){
						
						var that = this;
						var oModel = this.getView().getModel("dataDocument");
						var sPath = oEvent.getSource().getParent().getParent().getBindingContextPath();
						var oObject = oModel.getProperty(sPath);
						var oDataModel = this.getModel();
						
	                	var oFilter = null;
	                	var aFilters = [];
	                    oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.EQ, oObject.Werks)], true);
	                    aFilters.push(oFilter);
	                    
		              	oDataModel.read("/ZET_FBSD_SearchPlantSet", {
		              		filters: aFilters,
		                    success: function (oData) {
			                    if (!!oData.results.length){
			                    	oObject.Werks = oData.results[0].Werks;
			                    	oObject.WerksDsc = oData.results[0].Name1;	
			                    	oModel.setProperty(sPath, oObject);
			                    	
			                    }else{
			                    	oObject.Werks = "";
			                    	oObject.WerksDsc = "";	
			                    	oModel.setProperty(sPath, oObject);
			                        MessageBox.error(that.getResourceBundle().getText("shlpWerksMessageNotFound"), 
			        			                  { styleClass: that.getOwnerComponent().getContentDensityClass() });
			                     }
		                     }
	                     });
					},
					
					//*******Search Help Route*******//
					onHandleF4Route: function(oEvent){
						
						this.sPathRoute = oEvent.getSource().getParent().getParent().getBindingContextPath();
						
			             if (! this._oDialogRoute) {
			                  this._oDialogRoute = sap.ui.xmlfragment("nasa.ui5.vendaIntercompany.view.fragments.ShlpRoute", this);
			              }

			              this.getView().addDependent(this._oDialogRoute);

			              // toggle compact style
			              jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogRoute);
			              this._oDialogRoute.open();
			                
			         },
			              
			         onSearchHelperRoute : function (oEvent) {
			        	 debugger;
			        	 var sValue = oEvent.getParameter("value");
		                  var aFilters = [];


		                  if (sValue) {
		                    var oFilter = null;
//		                    oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("Route", sap.ui.model.FilterOperator.Contains, sValue)], false);
		                    oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("Bezei", sap.ui.model.FilterOperator.Contains, sValue)], false);
		                    aFilters.push(oFilter);
		                  }

		                  var oBinding = oEvent.getSource().getBinding("items");
		                  oBinding.filter(aFilters);

			          },
			              
			          onConfirmShlpRoute: function(oEvent){
			        	  debugger;
			               var aContexts = oEvent.getParameter("selectedContexts");

			               if (aContexts && aContexts.length) {
			                    var oObject = aContexts.map(function(oContext) { return oContext.getObject(); });
			                    var oModel = this.getView().getModel("dataDocument");
			                    var oDataObject = oModel.getProperty(this.sPathRoute);
			                    oDataObject.Route = oObject[0].Route;
			                    oDataObject.RouteDsc = oObject[0].Bezei;	
			                    oModel.setProperty(this.sPathRoute, oDataObject);
			                }
			            },
						
						onHandleSubmitRoute: function(oEvent){
							var that = this;
							var oModel = this.getView().getModel("dataDocument");
							var sPath = oEvent.getSource().getParent().getParent().getBindingContextPath();
							var oObject = oModel.getProperty(sPath);
							var oDataModel = this.getModel();
							
		                	var oFilter = null;
		                	var aFilters = [];
		                    oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("Route", sap.ui.model.FilterOperator.EQ, oObject.Route)], true);
		                    aFilters.push(oFilter);
		                    
			              	oDataModel.read("/ZET_FBSD_SearchItinerarySet", {
			              		filters: aFilters,
			                    success: function (oData) {
				                    if (!!oData.results.length){
				                    	oObject.Route = oData.results[0].Route;
				                    	oObject.RouteDsc = oData.results[0].Bezei;	
				                    	oModel.setProperty(sPath, oObject);
				                    	
				                    }else{
				                    	oObject.Route = "";
				                    	oObject.RouteDsc = "";	
				                    	oModel.setProperty(sPath, oObject);
				                        MessageBox.error(that.getResourceBundle().getText("shlpRouteMessageNotFound"), 
				        			                  { styleClass: that.getOwnerComponent().getContentDensityClass() });
				                     }
			                     }
		                     });
						},
						
						//*******Search Help Cliente Porto Destino*******//
						onHandleF4Portdestcli: function(oEvent){

							//Busca os Dados para Search Help
							var that = this;
							var oModel = this.getView().getModel("dataDocument");
							this.sPathPortdestcli = oEvent.getSource().getParent().getParent().getBindingContextPath();

							var oDataModel = this.getModel();
							
			            	var oFilter = null;
			            	var aFilters = [];
			                oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("PiTipo", sap.ui.model.FilterOperator.EQ, "K")], false);
			                
			                aFilters.push(oFilter);
			                
			              	oDataModel.read("/ZET_FBSD_SearchPartnerSet", {
			              		filters: aFilters,
			                    success: function (oData) {
				                    if (!!oData.results.length){
				                    	var oPartnerModel = that.getModel("detailDocumentView");
				                    	var oPartnerModelData = oPartnerModel.getData();
				                    	oPartnerModelData.shlpPortdestcli = oData.results;	
				                    	oPartnerModel.setData(oPartnerModelData);
				                    }
			                     }
			                 });
							
				             if (! this._oDialogPortdestcli) {
				                  this._oDialogPortdestcli = sap.ui.xmlfragment("nasa.ui5.vendaIntercompany.view.fragments.ShlpPortdestcli", this);
				              }

				              this.getView().addDependent(this._oDialogPortdestcli);

				              // toggle compact style
				              jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogPortdestcli);
				              this._oDialogPortdestcli.open();
				                
				         },
				              
				         onSearchHelperPortdestcli : function (oEvent) {
				        	  var that = this;
							  var oDataModel = this.getModel();
				        	 
				              var sValue = oEvent.getParameter("value");
				              var aFilters = [];

				              if (sValue) {
				                 var oFilter = null;
				                 oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("PiName", sap.ui.model.FilterOperator.EQ, sValue),
				                                                     new sap.ui.model.Filter("PiTipo", sap.ui.model.FilterOperator.EQ, "K")], true);
				                 aFilters.push(oFilter);
				               }
				              
				              oDataModel.read("/ZET_FBSD_SearchPartnerSet", {
				              		filters: aFilters,
				                    success: function (oData) {
					                    if (!!oData.results.length){
					                    	var oPartnerModel = that.getModel("detailDocumentView");
					                    	var oPartnerModelData = oPartnerModel.getData();
					                    	oPartnerModelData.shlpPortdestcli = oData.results;	
					                    	oPartnerModel.setData(oPartnerModelData);
					                    }
				                     }
				                });

				            },
				              
				            onConfirmShlpPortdestcli: function(oEvent){
				            	
				               var aContexts = oEvent.getParameter("selectedContexts");

				               if (aContexts && aContexts.length) {
				                    var oObject = aContexts.map(function(oContext) { return oContext.getObject(); });
				                    var oModel = this.getView().getModel("dataDocument");
				                    var oDataObject = oModel.getProperty(this.sPathPortdestcli);
				                    oDataObject.Portdestcli = oObject[0].CodParceiro;
				                    oDataObject.PortdestcliDsc = oObject[0].Name;	
				                    oModel.setProperty(this.sPathPortdestcli, oDataObject);
				                }
				            },
							onHandleSubmitPortdestcli: function(oEvent){
								
								var that = this;
								var oModel = this.getView().getModel("dataDocument");
								var sPath = oEvent.getSource().getParent().getParent().getBindingContextPath();
								var oObject = oModel.getProperty(sPath);
								var oDataModel = this.getModel();
								
			                	var oFilter = null;
			                	var aFilters = [];
			                    oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("PiName", sap.ui.model.FilterOperator.EQ, oObject.Portdestcli),
			                                                        new sap.ui.model.Filter("PiTipo", sap.ui.model.FilterOperator.EQ, "K")], true);
			                    aFilters.push(oFilter);
			                    
				              	oDataModel.read("/ZET_FBSD_SearchPartnerSet", {
				              		filters: aFilters,
				                    success: function (oData) {
					                    if (!!oData.results.length){
					                    	oObject.Portdestcli = oData.results[0].CodParceiro;
					                    	oObject.PortdestcliDsc = oData.results[0].Name;	
					                    	oModel.setProperty(sPath, oObject);
					                    }else{
					                    	oObject.Portdestcli = "";
					                    	oObject.PortdestcliDsc = "";	
					                    	oModel.setProperty(sPath, oObject);
					                        MessageBox.error(that.getResourceBundle().getText("shlpPortdestcliMessageNotFound"), 
					        			                  { styleClass: that.getOwnerComponent().getContentDensityClass() });
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
			
				var that = this;
				var sNode =  oEvent.getParameter("arguments").Node;				
				this.sNode = sNode;
				
				//Busca dados para compor o Process Flow
				this.getModel().metadataLoaded().then( function() {
					
					var oViewModel = this.getModel("detailDocumentView");
					
					var oObjectHead = {},
						oDataHead	= {},
						oDataHeadPO = {};
				
					var oDocumentData = {
							objectHead		: {},
							dataHead		: {},
							dataPartners	: [],
							dataItens		: [],
							dataPrices		: [],
							textObject		: [],
							dataHeadPO		: {}
					};
					
					
					var oGlobalData = sap.ui.getCore().getModel("globalData").getData();
				
					//Object Head
					if(!!oGlobalData.ShipmentDetailToSalesPFNodes){
						oObjectHead = oGlobalData.ShipmentDetailToSalesPFNodes.find(function (oItem) {
						    return oItem.Node == sNode;
						});
						this.sCodSeq = oObjectHead.CodSeq;
					}
					
					if(!!oObjectHead)
						oDocumentData.objectHead = oObjectHead;
					
					//Head OV
					if(!!oGlobalData.ShipmentDetailToDocSOHeader){
						
						oDataHead = oGlobalData.ShipmentDetailToDocSOHeader.find(function (oItem) {
						    return oItem.CodSeq == this.sCodSeq;
						}.bind(this));
					}
					
					if(!!oDataHead){
		
						oViewModel.setProperty("/titlePage", this.getResourceBundle().getText("detailDocumentTitlePageOV") + 
								 " " + oDocumentData.objectHead.Text);
						
						
						
			            oDocumentData.dataHead 	 = {
														Nrembarque	: oDataHead.Nrembarque,
														CodSeq		: oDataHead.CodSeq,
														Bukrs		: oDataHead.Bukrs,
														Auart		: oDataHead.Auart,
														Vkorg		: oDataHead.Vkorg,
														Vtweg		: oDataHead.Vtweg,
														Spart		: oDataHead.Spart,
														Kunnr		: oDataHead.Kunnr,
														Bstkd		: oDataHead.Bstkd,
														Dtpedido	: oDataHead.Dtpedido,
														Dtremessa	: oDataHead.Dtremessa,
														Dtfixpreco	: oDataHead.Dtfixpreco,
														Waerk		: oDataHead.Waerk,
//														Zterm		: oDataHead.Zterm,
//														Inco1		: oDataHead.Inco1,
//														Inco2		: oDataHead.Inco2,
														Werks		: oDataHead.Werks,
														Lgort		: oDataHead.Lgort,
														BukrsTxt	: oDataHead.BukrsTxt,
														Renum		: oDataHead.Renum,
														Route		: oDataHead.Route
										  		    }
					}
					
					//Head PO
					if(!!oGlobalData.ShipmentDetailToDocPOHeader){
						oDataHeadPO = oGlobalData.ShipmentDetailToDocPOHeader.find(function (oItem) {
						    return oItem.CodSeq == this.sCodSeq;
						}.bind(this));
					}
					
					if(!!oDataHeadPO){
						oViewModel.setProperty("/titlePage", this.getResourceBundle().getText("detailDocumentTitlePagePO") + 
															 " " + oDocumentData.objectHead.Text);
			            oDocumentData.dataHeadPO = {
									            		Nrembarque	: oDataHeadPO.Nrembarque,
						  								CodSeq		: oDataHeadPO.CodSeq,
						  								Bukrs		: oDataHeadPO.Bukrs,
						  								Lifnr		: oDataHeadPO.Lifnr,
						  								Bsart		: oDataHeadPO.Bsart,
						  								Ekgrp		: oDataHeadPO.Ekgrp,
						  								Ekorg		: oDataHeadPO.Ekorg,
						  								Mwskz		: oDataHeadPO.Mwskz,
//						  								Zterm		: oDataHeadPO.Zterm,
//						  								Inco1		: oDataHeadPO.Inco1,
//						  								Inco2		: oDataHeadPO.Inco2,
						  								Waers		: oDataHeadPO.Waers,
						  								LifnrTxt	: oDataHeadPO.LifnrTxt,
						  								BukrsTxt	: oDataHeadPO.BukrsTxt,
//						  								ZtermTxt	: oDataHeadPO.ZtermTxt,
						  								EkorgTxt	: oDataHeadPO.EkorgTxt,
						  								EkgrpTxt	: oDataHeadPO.EkgrpTxt
										  		    }
					}
					
					//Itens
					if(!!oGlobalData.ShipmentDetailToDocSOItems.length){		
						
						jQuery.each(oGlobalData.ShipmentDetailToDocSOItems, function(index, oShipmentDetailToDocSOItems){
							if(oShipmentDetailToDocSOItems.CodSeq == that.sCodSeq){
								oDocumentData.dataItens.push({
									Nrembarque	: oShipmentDetailToDocSOItems.Nrembarque,
	  								CodSeq		: oShipmentDetailToDocSOItems.CodSeq,
	  								ItmNumber	: oShipmentDetailToDocSOItems.ItmNumber,
	  								VbelnVa		: oShipmentDetailToDocSOItems.VbelnVa,
	  								PosnrVa		: oShipmentDetailToDocSOItems.PosnrVa,
	  								Matnr		: oShipmentDetailToDocSOItems.Matnr,
	  								Weight		: oShipmentDetailToDocSOItems.Weight,
	  								Unit		: oShipmentDetailToDocSOItems.Unit,
	  								Dteta		: oShipmentDetailToDocSOItems.Dteta,
	  								Werks		: oShipmentDetailToDocSOItems.Werks,
	  								MatnrDsc	: oShipmentDetailToDocSOItems.MatnrDsc,	 
	  								WerksDsc	: oShipmentDetailToDocSOItems.WerksDsc,
	  								Lgort		: oShipmentDetailToDocSOItems.Lgort,
	  								Route		: oShipmentDetailToDocSOItems.Route,
	  								Portdestcli : oShipmentDetailToDocSOItems.Portdestcli,
	  								Ptdst		: oShipmentDetailToDocSOItems.Ptdst,
	  								TipoVenda	: oShipmentDetailToDocSOItems.TipoVenda,
	  								TipoProd	: oShipmentDetailToDocSOItems.TipoProd,
	  								LgortDsc	: oShipmentDetailToDocSOItems.LgortDsc,
	  								RouteDsc	: oShipmentDetailToDocSOItems.RouteDsc,
//	  								Classificacao	: oShipmentDetailToDocSOItems.Classificacao,
	  								PortdestcliDsc : oShipmentDetailToDocSOItems.PortdestcliDsc
							});
							}
						});
					}
					
					//Prices
					if(!!oGlobalData.ShipmentDetailToDocSOPrices.length){					
						jQuery.each(oGlobalData.ShipmentDetailToDocSOPrices, function(index, oPrice){
							if(oPrice.CodSeq == that.sCodSeq){
								oDocumentData.dataPrices.push({
									Nrembarque	: oPrice.Nrembarque,
									CodSeq		: oPrice.CodSeq,
									ItmNumber	: oPrice.ItmNumber,
									Condicao	: oPrice.Condicao,
									Descricao	: oPrice.Descricao,
									Valor		: oPrice.Valor,
									Moeda		: oPrice.Moeda,
									Bloqueio	: oPrice.Bloqueio,//GS
									Knumv    	: oPrice.Knumv,//GS
	  								Kposn    	: oPrice.Kposn,//GS
	  								Stunr    	: oPrice.Stunr,//GS
	  								Zaehk    	: oPrice.Zaehk,//GS
	  								ChaveCondicao : oPrice.ChaveCondicao,//GS
	  								VbelnVa		: oPrice.VbelnVa,//GS
									QtdUm		: oPrice.QtdUm,
									UnidMed		: oPrice.UnidMed
							});
							}
						});
					}
					
					//Text
					if(!!oGlobalData.ShipmentDetailToDocSOTxt.length){					
						jQuery.each(oGlobalData.ShipmentDetailToDocSOTxt, function(index, oTextObject){
							if(oTextObject.CodSeq == that.sCodSeq){
								oDocumentData.textObject.push({
									CodSeq		: oTextObject.CodSeq,
									TextId		: oTextObject.TextId,
									TextDsc		: oTextObject.TextDsc,
									TextLine	: oTextObject.TextLine
							});
							}
						});
					}
					
					//Partners
					if(!!oGlobalData.ShipmentDetailToDocSOPartners.length){					
						jQuery.each(oGlobalData.ShipmentDetailToDocSOPartners, function(index, oPartner){
							if(oPartner.CodSeq == that.sCodSeq){
								oDocumentData.dataPartners.push({
									Nrembarque	: oPartner.Nrembarque,
									CodSeq		: oPartner.CodSeq,
									ItmNumber	: oPartner.ItmNumber,
									Parvw		: oPartner.Parvw,
									CodParc		: oPartner.CodParc,
									Name1		: oPartner.Name1
							});
							}
						});
					}
								
					this.setModel(new JSONModel(oDocumentData), "dataDocument");
					
					this._initialize_filterbar();
					this._validaDadosBusca(oDocumentData);
		                
				}.bind(this));
			},
			
			_validaDadosBusca: function(oObject){
				var that = this;
				
				//Verifica se Possui Dados de Head
				if(!oObject.dataHead["Nrembarque"] && !oObject.dataHeadPO["Nrembarque"]){
					MessageBox.error(this.getResourceBundle().getText("detailDocumentsMessageNoHead"), 
			                  { onClose: function(){
			                	  						that.getRouter().navTo("objectFlow", { }, true);
			                  			  			},
								styleClass: this.getOwnerComponent().getContentDensityClass() }
			                  );
					return;
				}
			},
			
			_onSaveDocument: function(){
				debugger;
				var that = this;
				var oObject = this.getModel("dataDocument").getData();
				var oGlobalData = sap.ui.getCore().getModel("globalData").getData();
				
				//***ShipmentDetailToDocSOHeader***//
				if(!!oObject.dataHead.Bukrs && (!oObject.dataHead.Bstkd || !oObject.dataHead.Dtpedido ||
				   !oObject.dataHead.Dtfixpreco || !oObject.dataHead.Waerk)){
					MessageBox.error(this.getResourceBundle().getText("detailDocumentsMessageFieldHead"), 
			                  { 
								styleClass: this.getOwnerComponent().getContentDensityClass() }
			                  );
					return;
				}
				
				var oIndex = oGlobalData.ShipmentDetailToDocSOHeader.map(function (oItem) { 
					return oItem.CodSeq; 
				}).indexOf(this.sCodSeq);

				if(oIndex >= 0)
					oGlobalData.ShipmentDetailToDocSOHeader[oIndex] = oObject.dataHead;
				
				//***ShipmentDetailToDocPOHeader***//
				if(!!oObject.dataHeadPO.Bukrs && (!oObject.dataHeadPO.Mwskz ||
				   !oObject.dataHeadPO.Waers)){
					MessageBox.error(this.getResourceBundle().getText("detailDocumentsMessageFieldHead"), 
			                  { 
								styleClass: this.getOwnerComponent().getContentDensityClass() }
			                  );
					return;
				}
				
				var oIndex = oGlobalData.ShipmentDetailToDocPOHeader.map(function (oItem) { 
					return oItem.CodSeq; 
				}).indexOf(this.sCodSeq);

				if(oIndex >= 0)
					oGlobalData.ShipmentDetailToDocPOHeader[oIndex] = oObject.dataHeadPO;
				
				//***ShipmentDetailToDocSOItems***//
				if(!!oGlobalData.ShipmentDetailToDocSOItems.length){					
					jQuery.each(oGlobalData.ShipmentDetailToDocSOItems, function(index1, oShipmentDetailToDocSOItems){
						jQuery.each(oObject.dataItens, function(index2, oDataItens){
							if(oShipmentDetailToDocSOItems.CodSeq    == oDataItens.CodSeq &&
							   oShipmentDetailToDocSOItems.ItmNumber == oDataItens.ItmNumber &&
							   oShipmentDetailToDocSOItems.Condicao  == oDataItens.Condicao){
								oGlobalData.ShipmentDetailToDocSOItems[index1] = oDataItens;
							}
						});
					});
				}
				
				//***ShipmentDetailToDocSOPrices***//
				
				if(!!oGlobalData.ShipmentDetailToDocSOPrices.length){					
					jQuery.each(oGlobalData.ShipmentDetailToDocSOPrices, function(index1, oShipmentDetailToDocSOPrices){
						jQuery.each(oObject.dataPrices, function(index2, oDataPrices){
							if(oShipmentDetailToDocSOPrices.CodSeq == oDataPrices.CodSeq &&
							   oShipmentDetailToDocSOPrices.ItmNumber == oDataPrices.ItmNumber &&
							   oShipmentDetailToDocSOPrices.Condicao == oDataPrices.Condicao &&
							   oShipmentDetailToDocSOPrices.ChaveCondicao == oDataPrices.ChaveCondicao	){

								oGlobalData.ShipmentDetailToDocSOPrices[index1] = oDataPrices;
							}
						});
					});
				}
				
						
				
				
				//***ShipmentDetailToDocSOTxt***//
				if(!!oGlobalData.ShipmentDetailToDocSOTxt.length){					
					jQuery.each(oGlobalData.ShipmentDetailToDocSOTxt, function(index1, oShipmentDetailToDocSOTxt){
						jQuery.each(oObject.textObject, function(index2, oTextObject){
							if(oShipmentDetailToDocSOTxt.CodSeq == oTextObject.CodSeq && oShipmentDetailToDocSOTxt.TextId == oTextObject.TextId){
								oGlobalData.ShipmentDetailToDocSOTxt[index1] = oTextObject;
							}
						});
					});
				}
				
				//***ShipmentDetailToDocSOPartners***//
				if(!!oGlobalData.ShipmentDetailToDocSOPartners.length){					
					jQuery.each(oGlobalData.ShipmentDetailToDocSOPartners, function(index1, oShipmentDetailToDocSOPartners){
						jQuery.each(oObject.dataPartners, function(index2, oDataPartners){
							if(oShipmentDetailToDocSOPartners.CodSeq == oDataPartners.CodSeq && oShipmentDetailToDocSOPartners.Parvw == oDataPartners.Parvw){
								oGlobalData.ShipmentDetailToDocSOPartners[index1] = oDataPartners;
							}
						});
					});
				}
				
				//***ShipmentDetailToSalesPFNodes***//
				var oIndex = oGlobalData.ShipmentDetailToSalesPFNodes.map(function (oItem) { 
					return oItem.CodSeq; 
				}).indexOf(this.sCodSeq);

				if(oIndex >= 0){
					oGlobalData.ShipmentDetailToSalesPFNodes[oIndex].StatusText = this.getResourceBundle().getText("detailDocumentsTitleValidated");
					oGlobalData.ShipmentDetailToSalesPFNodes[oIndex].Status		= constant.STATUS_VALIDATED;
				}
				
				MessageToast.show(this.getResourceBundle().getText("detailDocumentsDocValidated"));
				this.onBack();
				
			},
			

		    onHandleIconTabBarSelect: function(oEvent){
        	  	var vMode = this.byId(oEvent.mParameters.selectedKey).getIcon();
		    	 		
		    	 if (vMode === "sap-icon://list" ) { 
		    		var buttonpriceheader = this.byId("precoHead")

		    		buttonpriceheader.setVisible(true);	    	
				}else {
					var buttonpriceheader = this.byId("precoHead");
					buttonpriceheader.setVisible(false);
				};	
				
		    }, 
			
			
			_initialize_filterbar: function(){
				
				var oObject = this.getModel("dataDocument").getData();
				
				var oFilterBar = this.byId("documentIconTabBar1"),
					oTabFilter1 = this.byId("documentIconTabBarFilter1"),
					oTabFilter1_2 = this.byId("documentIconTabBarFilter1_2"),
					
					oTabFilter4 = this.byId("documentIconTabBarFilter4");
					
				var oTableColumns = this.byId("itemOvTable").getColumns();
									
				if(!!oObject.dataHead.Bukrs){		
					
					//Ordem de Venda
									
					oFilterBar.setSelectedKey("documentIconTabBarFilter1");
					oTabFilter1.setVisible(true);
					oTabFilter1_2.setVisible(false);
					oTabFilter4.setVisible(true);
					oTableColumns[2].setVisible(true);	//OV
					oTableColumns[3].setVisible(true);	//Itens OV
					oTableColumns[4].setVisible(false);	//Pedido
					oTableColumns[5].setVisible(false);	//Itens Pedido
					oTableColumns[10].setVisible(true);	//Itinerario
					oTableColumns[11].setVisible(true);	//Cliente Porto Destino
//					oTableColumns[1].setVisible(true);	//OV
//					oTableColumns[2].setVisible(true);	//Itens OV
//					oTableColumns[3].setVisible(false);	//Pedido
//					oTableColumns[4].setVisible(false);	//Itens Pedido
//					oTableColumns[9].setVisible(true);	//Itinerario
//					oTableColumns[10].setVisible(true);	//Cliente Porto Destino
//		//			oTableColumns[11].setVisible(false);//Classificação		
										
				}else{		
					//Pedido
					
					oFilterBar.setSelectedKey("documentIconTabBarFilter1_2"); 
					oTabFilter4.setVisible(false);
					oTabFilter1.setVisible(false);
					oTabFilter1_2.setVisible(true);
					oTableColumns[2].setVisible(false);	//OV
					oTableColumns[3].setVisible(false);	//Itens OV
					oTableColumns[4].setVisible(true);	//Pedido
					oTableColumns[5].setVisible(true);	//Itens Pedido
					oTableColumns[10].setVisible(false);	//Itinerario
					oTableColumns[11].setVisible(false);//Cliente Porto Destino
//					oTableColumns[1].setVisible(false);	//OV
//					oTableColumns[2].setVisible(false);	//Itens OV
//					oTableColumns[3].setVisible(true);	//Pedido
//					oTableColumns[4].setVisible(true);	//Itens Pedido
//					oTableColumns[9].setVisible(false);	//Itinerario
//					oTableColumns[10].setVisible(false);//Cliente Porto Destino
//					oTableColumns[11].setVisible(false);	//Classificação
					
					
				}
		
				
				var oButtonEdit = this.byId("detailDocumentButtonEdit");				
				var sMode = oButtonEdit.getIcon().substr(11) == "edit" ? false : true;
				if(sMode)
					this.onChangeMode();
				
				
				
			}
			
		});

	}
);