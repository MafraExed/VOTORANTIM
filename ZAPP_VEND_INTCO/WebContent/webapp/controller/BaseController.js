/*global history */
sap.ui.define([
					"sap/ui/core/mvc/Controller",
					"sap/ui/core/routing/History",
					"sap/m/Dialog",
					"sap/m/Button",
					"sap/m/Text",
					"sap/m/MessageBox"
	], function (	
					Controller, 
					History, 
					Dialog, 
					Button, 
					Text, 
					MessageBox) {
		
		"use strict";

		return Controller.extend("nasa.ui5.vendaIntercompany.controller.BaseController", {
			/**
			 * Convenience method for accessing the router in every controller of the application.
			 * @public
			 * @returns {sap.ui.core.routing.Router} the router for this component
			 */
			getRouter : function () {
				return this.getOwnerComponent().getRouter();
			},

			/**
			 * Convenience method for getting the view model by name in every controller of the application.
			 * @public
			 * @param {string} sName the model name
			 * @returns {sap.ui.model.Model} the model instance
			 */
			getModel : function (sName) {
				return this.getView().getModel(sName);
			},

			/**
			 * Convenience method for setting the view model in every controller of the application.
			 * @public
			 * @param {sap.ui.model.Model} oModel the model instance
			 * @param {string} sName the model name
			 * @returns {sap.ui.mvc.View} the view instance
			 */
			setModel : function (oModel, sName) {
				return this.getView().setModel(oModel, sName);
			},

			/**
			 * Convenience method for getting the resource bundle.
			 * @public
			 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
			 */
			getResourceBundle : function () {
				return this.getOwnerComponent().getModel("i18n").getResourceBundle();
			},

			/**
			 * Event handler for navigating back.
			 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
			 * If not, it will replace the current entry of the browser history with the master route.
			 * @public
			 */
			onNavBack : function() {
				var sPreviousHash = History.getInstance().getPreviousHash(),
					oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

					if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
					history.go(-1);
				} else {
					this.getRouter().navTo("master", {}, true);
				}
			},
			
			/**
			 * Event handler for Hide or Show Master View.
			 * @public
			 */
			onHideUnhideMaster: function(sMode){
				if(!sap.ui.Device.system.phone){
					var oSplitApp = this.getOwnerComponent().getAggregation("rootControl").byId("idAppControl");
					oSplitApp.setMode(sMode);
				}
			},
			
			/**
			 * Event handler for Message Confirmation Choose.
			 * @public
			 */
			onMessageConfirmation: function(sQuestion, sButtonTextOK, sButtonTextNOK, sFunctionOK, sFunctionNOK){
				var dialog = new Dialog({
								            title: this.getResourceBundle().getText("titleMessageConfirm"),
								            type: 'Message',
								            content: new Text({ text: sQuestion }),
								            beginButton: new Button({
															              text: sButtonTextOK,
															              press: function () {
															                dialog.close();
															                if(!!sFunctionOK)
															                	sFunctionOK();
															              }
								            						}),
								            endButton: new Button({
															              text: sButtonTextNOK,
															              press: function () {
															                dialog.close();
															                if(!!sFunctionNOK)
															            		sFunctionNOK();
															              }
								            						}),
								            afterClose: function() {
															              dialog.destroy();
															              return false;
															            }
								          							});
		          dialog.open();
			},
                  
			
			
			
//			onConversaoValor: function(oEvent){
//			debugger;
//				
//			var oTable = this.byId("PriceTable");
//			
//			
//			var Pvalue = "123";
//			
//			input.setValue(Pvalue);
//			
//			debugger;
//			
////				//Return ID do objeto 
////				var id_ini = oEvent.mParameters.id.split('---')[1];
////				var id = id_ini.split('--')[1];
////					
////				
////				var pValue = this.getView().byId(id).getValue();
////				
////				if (pValue < 0){
////					
////				this.getView().byId(id).setValueState(sap.ui.core.ValueState.Error);
////				};
//				
//				
//				
//			},
//					
			
			
      		/* =========================================================== */
      		/* method Model Global    	                                   */
      		/* =========================================================== */                  
            _setGlobalModel: function(sData){
  					
  					var oShipmentDetailToItems		   = [],
  						oShipmentDetailToSalesPFLanes  = [],
  						oShipmentDetailToSalesPFNodes  = [],
  						oShipmentDetailToDocSOHeader   = [],
  						oShipmentDetailToDocSOItems	   = [],
  						oShipmentDetailToDocSOPrices   = [],
  						oShipmentDetailToDocSOPartners = [],
  						oShipmentDetailToDocSOTxt	   = [],
  						oShipmentDetailToDocPOHeader   = [];
  					
  					var oGlobalData = {
  							Event							: '',
  							Nrembarque						: sData.Nrembarque,
  							ShipmentDetailToItems			: [],
  							ShipmentDetailToSalesPFLanes	: [],
  							ShipmentDetailToSalesPFNodes	: [],
  							ShipmentDetailToDocSOHeader		: [],
  							ShipmentDetailToDocSOItems		: [],
  							ShipmentDetailToDocSOPrices		: [],
  							ShipmentDetailToDocSOPartners	: [],
  							ShipmentDetailToDocSOTxt		: [],
  							ShipmentDetailToDocPOHeader		: []
  					};
  					
  					//Lanes
  					if(!!sData.ShipmentDetailToSalesPFLanes){
  						jQuery.each(sData.ShipmentDetailToSalesPFLanes.results, function(index, element){
  							oShipmentDetailToSalesPFLanes.push({
  								Cenario		: element.Cenario,
  								Nrembarque	: element.Nrembarque,
  								Lane		: element.Lane,
  								Npos		: element.Npos,
  								Icon		: element.Icon,
  								Labl		: element.Labl,
  								State		: element.State
  							});
  						});
  						oGlobalData.ShipmentDetailToSalesPFLanes = oShipmentDetailToSalesPFLanes;
  					}
  					
  					//Node
  					if(!!sData.ShipmentDetailToSalesPFNodes){
  						jQuery.each(sData.ShipmentDetailToSalesPFNodes.results, function(index, element){
  							oShipmentDetailToSalesPFNodes.push({
  								Cenario		: element.Cenario,
  								Nrembarque	: element.Nrembarque,
  								Lane		: element.Lane,
  								Node		: element.Node,
  								Title		: element.Title,
  								TitleAbrv	: element.TitleAbrv,
  								Children	: element.Children,
  								Status		: element.Status,
  								StatusText	: element.StatusText,
  								Text		: element.Text,
  								DocGerar	: element.DocGerar,
  								CodSeq		: element.CodSeq 
  	
  							});
  						});
  						oGlobalData.ShipmentDetailToSalesPFNodes = oShipmentDetailToSalesPFNodes;
  					}
  					
  					//Head OV
  					if(!!sData.ShipmentDetailToDocSOHeader){
  						jQuery.each(sData.ShipmentDetailToDocSOHeader.results, function(index, element){
  							oShipmentDetailToDocSOHeader.push({
  								Nrembarque	: element.Nrembarque,
  								CodSeq		: element.CodSeq,
  								Bukrs		: element.Bukrs,
  								Auart		: element.Auart,
  								Vkorg		: element.Vkorg,
  								Vtweg		: element.Vtweg,
  								Spart		: element.Spart,
  								Kunnr		: element.Kunnr,
  								Bstkd		: element.Bstkd,
  								Dtpedido	: element.Dtpedido,
  								Dtremessa	: element.Dtremessa,
  								Dtfixpreco	: element.Dtfixpreco,
  								Waerk		: element.Waerk,
//  								Zterm		: element.Zterm,
//  								Inco1		: element.Inco1,
//  								Inco2		: element.Inco2,
  								Werks		: element.Werks,
  								Lgort		: element.Lgort,
  								BukrsTxt	: element.BukrsTxt,
  								Renum		: element.Renum,
  								Route		: element.Route
  							});
  						});
  						oGlobalData.ShipmentDetailToDocSOHeader = oShipmentDetailToDocSOHeader;
  					}
  					
  					//Head PO
  					if(!!sData.ShipmentDetailToDocPOHeader){
  						jQuery.each(sData.ShipmentDetailToDocPOHeader.results, function(index, element){
  							oShipmentDetailToDocPOHeader.push({
  								Nrembarque	: element.Nrembarque,
  								CodSeq		: element.CodSeq,
  								Bukrs		: element.Bukrs,
  								Lifnr		: element.Lifnr,
  								Bsart		: element.Bsart,
  								Ekgrp		: element.Ekgrp,
  								Ekorg		: element.Ekorg,
  								Mwskz		: element.Mwskz,
//  								Zterm		: element.Zterm,
//  								Inco1		: element.Inco1,
//  								Inco2		: element.Inco2,
  								Waers		: element.Waers,
  								LifnrTxt	: element.LifnrTxt,
  								BukrsTxt	: element.BukrsTxt,
  								ZtermTxt	: element.ZtermTxt,
  								EkorgTxt	: element.EkorgTxt,
  								EkgrpTxt	: element.EkgrpTxt
  							});
  						});
  						oGlobalData.ShipmentDetailToDocPOHeader = oShipmentDetailToDocPOHeader;
  					}
  					
  					//Itens Selecionados
  					if(!!sData.ShipmentDetailToItems){
  						jQuery.each(sData.ShipmentDetailToItems.results, function(index, element){
  							oShipmentDetailToItems.push({
  								Nrembarque		: element.Nrembarque,
  								ShpmtIt			: element.ShpmtIt,
  								TipoProd		: element.TipoProd,
  								Matnr			: element.Matnr,
  								Dteta			: element.Dteta,
  								Weight			: element.Weight,
  								WeightFsc		: element.WeightFsc,
  								WeightCerflor	: element.WeightCerflor,
  								WeightCw		: element.WeightCw,
  								Volumn			: element.Volumn,
  								Unit			: element.Unit,
  								Inco1			: element.Inco1,
  								Zterm			: element.Zterm,
  								Marks			: element.Marks,
  								Ptdst			: element.Ptdst,
  								Cdsre			: element.Cdsre,
  								Docref			: element.Docref,
  								DocrefItem		: element.DocrefItem,
  								Stalert			: element.Stalert,
  								Inco2			: element.Inco2,
  								MatnrDsc		: element.MatnrDsc,
  								ZtermDsc		: element.ZtermDsc,
  								PtdstDsc		: element.PtdstDsc,
  								StalertDsc		: element.StalertDsc,
  								Renum			: element.Renum,
  								Processnum		: element.Processnum,
  								Tipovenda		: element.Tipovenda,
  								Stprocess		: element.Stprocess

  							});
  						});
  						oGlobalData.ShipmentDetailToItems = oShipmentDetailToItems;
  					}
  					
  					//Itens Documento
  				
  					if(!!sData.ShipmentDetailToDocSOItems){
  						jQuery.each(sData.ShipmentDetailToDocSOItems.results, function(index, element){
  							oShipmentDetailToDocSOItems.push({
  								Nrembarque	: element.Nrembarque,
  								CodSeq		: element.CodSeq,
  								ItmNumber	: element.ItmNumber,
  								Matnr		: element.Matnr,
  								Weight		: element.Weight,
  								Unit		: element.Unit,
  								Dteta		: element.Dteta,
  								Werks		: element.Werks,
  								MatnrDsc	: element.MatnrDsc,	 
  								WerksDsc	: element.WerksDsc,
  								Lgort		: element.Lgort,
  								Route		: element.Route,
  								Portdestcli : element.Portdestcli,
  								Ptdst		: element.Ptdst,
  								TipoVenda	: element.TipoVenda,
  								VbelnVa		: element.VbelnVa,//gs
  								PosnrVa		: element.PosnrVa,//gs
  								TipoProd	: element.TipoProd,
  								LgortDsc	: element.LgortDsc,
  								RouteDsc	: element.RouteDsc,
//  								Classificacao  : element.Classificacao,//gs
  								PortdestcliDsc : element.PortdestcliDsc
  							});
  						});
  						oGlobalData.ShipmentDetailToDocSOItems = oShipmentDetailToDocSOItems;
  					}
  					
  					//Price
  					if(!!sData.ShipmentDetailToDocSOPrices){
  						jQuery.each(sData.ShipmentDetailToDocSOPrices.results, function(index, element){
  							oShipmentDetailToDocSOPrices.push({
  								Nrembarque	: element.Nrembarque,
  								CodSeq		: element.CodSeq,
  								ItmNumber	: element.ItmNumber,
  								Condicao	: element.Condicao,
  								Descricao	: element.Descricao,
  								Valor		: element.Valor,
  								Moeda		: element.Moeda,
  								Bloqueio    : element.Bloqueio,//GS
  								Knumv    	: element.Knumv,//GS
  								Kposn    	: element.Kposn,//GS
  								Stunr    	: element.Stunr,//GS
  								Zaehk    	: element.Zaehk,//GS
  							  ChaveCondicao : element.ChaveCondicao,//GS
  							  	VbelnVa		: element.VbelnVa,//GS
  								QtdUm		: element.QtdUm,
  								UnidMed		: element.UnidMed
  							});
  						});
  						oGlobalData.ShipmentDetailToDocSOPrices = oShipmentDetailToDocSOPrices;
  					}
  					
  					//Partners
  					if(!!sData.ShipmentDetailToDocSOPartners){
  						jQuery.each(sData.ShipmentDetailToDocSOPartners.results, function(index, element){
  							oShipmentDetailToDocSOPartners.push({
  								Nrembarque	: element.Nrembarque,
  								CodSeq		: element.CodSeq,
  								ItmNumber	: element.ItmNumber,
  								Parvw		: element.Parvw,
  								CodParc		: element.CodParc,
  								Name1		: element.Name1
  							});
  						});
  						oGlobalData.ShipmentDetailToDocSOPartners = oShipmentDetailToDocSOPartners;
  					}
  					
  					//Texts
  					if(!!sData.ShipmentDetailToDocSOTxt){
  						jQuery.each(sData.ShipmentDetailToDocSOTxt.results, function(index, element){
  							oShipmentDetailToDocSOTxt.push({
  								CodSeq		: element.CodSeq,
  								TextId		: element.TextId,
  								TextDsc		: element.TextDsc,
  								TextLine	: element.TextLine
  							});
  						});
  						oGlobalData.ShipmentDetailToDocSOTxt = oShipmentDetailToDocSOTxt;
  					}
  					
  	        		var oGlobalModel = new sap.ui.model.json.JSONModel(oGlobalData);
  					sap.ui.getCore().setModel(oGlobalModel, "globalData");
  			}

		});

	}
);