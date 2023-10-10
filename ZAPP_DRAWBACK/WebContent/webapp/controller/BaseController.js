/*global history */
sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/routing/History",
		"sap/m/Dialog",
		"sap/m/Button",
		"sap/m/Text",
		"sap/m/MessageBox",
		"sap/m/MessageToast",
		'sap/m/MessagePopover',
		'sap/m/MessagePopoverItem',
		'sap/ui/model/Sorter',
		"nasa/ui5/controleDrawback/model/formatter"
	], function (Controller, History, Dialog, Button, Text, MessageBox, MessageToast, MessagePopover, MessagePopoverItem, Sorter, formatter) {
		"use strict";

		return Controller.extend("nasa.ui5.controleDrawback.controller.BaseController", {

			getRouter : function () {
				return this.getOwnerComponent().getRouter();

			},


			getModel : function (sName) {
				return this.getView().getModel(sName);
			},

			setModel : function (oModel, sName) {
				return this.getView().setModel(oModel, sName);
			},


			getResourceBundle : function () {
				return this.getOwnerComponent().getModel("i18n").getResourceBundle();
			},

			getTextI18n: function (pId) {
				return this.getResourceBundle().getText(pId);
			},
			
			onNavBack : function() {
				var sPreviousHash = History.getInstance().getPreviousHash(),
					oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

					if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
					history.go(-1);
				} else {
					this.getRouter().navTo("main", {}, true);
				}
			},

			/**
			 * Cria o model do popover
			 * @public
			 */
			initializeMessagePopOver: function(){
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
			
			/**
			 * Preenche o componente de popover para exibir as mensagems
			 * @public
			 */
			createMessagePopOver: function(pMsgs){
				
				//Monta Mensagens
				var sMessages = [];
				
				pMsgs.error.innererror.errordetails.forEach(function(oItem) {
					sMessages.push({
						type: formatter.formatTypeMessagePopOver(oItem.severity),
						title: oItem.severity + " message",
						description: oItem.message
					});
				});
				
				//Seta Model no Objeto MessagePopOver
				var oViewModel = this.getModel("messagePopOver");
		        oViewModel.setData(sMessages);
		        this.oMessagePopover.setModel(oViewModel);

			},	
		
			onMessageError: function(pId){
	        	MessageBox.error(this.getTextI18n(pId), 
	        			{ styleClass: this.getOwnerComponent().getContentDensityClass() } );
		          return;				
			},
			
	
			onMessageDisplay: function(pType, pId){
				
				var sMsg = this.getTextI18n(pId);
				switch (pType) {
			    case "E":
		        	MessageBox.error(sMsg, { styleClass: this.getOwnerComponent().getContentDensityClass() } );
			       break;
			    case "S":
		        	MessageBox.success(sMsg, { styleClass: this.getOwnerComponent().getContentDensityClass() } );
			        break;
			    case "A":
		        	MessageBox.alert(sMsg, { styleClass: this.getOwnerComponent().getContentDensityClass() } );
			        break;
				};	
			},	          
			
	
		
			onMessageConfirmation: function(sQuestion, sButtonOK, sButtonNOK, sFunctionOK){
				var dialog = new Dialog({
		            title: this.getTextI18n("popupTitleMessageConfirm"),
		            type: 'Message',
		            content: new Text({ text: sQuestion }),
		            beginButton: new Button({
		              text: sButtonOK,
		              press: function () {
		                dialog.close();
		                sFunctionOK();
		              }
		            }),
		            endButton: new Button({
		              text: sButtonNOK,
		              press: function () {
		                dialog.close();
		              }
		            }),
		            afterClose: function() {
		              dialog.destroy();
		              return false;
		            }
		          });
		     
		          dialog.open();
			},
			
			
			onValidaNumerico: function (oEvent){
				
				//Return ID do objeto 
				var id_ini = oEvent.mParameters.id.split('---')[1];
				var id = id_ini.split('--')[1];
					
				
				var valor = this.getView().byId(id).getValue();
				var RegExp = /^[\d]+$/;
				
								
				if (valor !== ''){
					
				
					if (RegExp.test(valor) == true) {
						this._setInputNone(id);
					} else {
						this._setInputErro(id);
					}
				
				}else{
					this._setInputNone(id);
				}	
			},
			
			
			onValidaNumericoMoeda: function (oEvent){
				
				//Return ID do objeto 
				var id_ini = oEvent.mParameters.id.split('---')[1];
				var id = id_ini.split('--')[1];
					
				
				var valor = this.getView().byId(id).getValue();
				var RegExp = /^[\d]+.+[\d]+$/;
				
								
				if (valor !== ''){
									
					if (RegExp.test(valor) == true) {
						this._setInputNone(id);
					} else {
						this._setInputErro(id);
					}
				
				}else{
					this._setInputNone(id);
				}	
			},
			
			_setInputErro: function (Pfield){
				this.getView().byId(Pfield).setValueState(sap.ui.core.ValueState.Error);
			},
			
			_setInputNone: function (Pfield){
				this.getView().byId(Pfield).setValueState(sap.ui.core.ValueState.None);
			},


			/* =========================================================== */
			/* method Search Help    	                                   */
			/* =========================================================== */
			
  			shlp_create_filter: function(oEvent){
                var sValue = oEvent.getParameter("value");
                var aFilters = [];


                if (sValue) {
                  var oFilter = null;
                  oFilter = new sap.ui.model.Filter([ new sap.ui.model.Filter("PiName", sap.ui.model.FilterOperator.Contains, sValue)], false);
                  aFilters.push(oFilter);
                }
                return aFilters;
			},
			
			onHandleF4Global: function(oDialog, oView, oFragment){

                if (! oDialog) {
                	oDialog = sap.ui.xmlfragment("nasa.ui5.controleDrawback.view.fragments."+oFragment, this);
                }

                oView.addDependent(oDialog);
                
                // toggle compact style
                jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, oDialog);
                oDialog.open();

              },
						
			onSearchHelperGlobal : function (oEvent) {

                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter(this.shlp_create_filter(oEvent));

              },
                
		});

	}
);