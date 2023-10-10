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
		"nasa/ui5/remessasExportacao/model/formatter"
	], function (Controller, History, Dialog, Button, Text, MessageBox, MessageToast, MessagePopover, MessagePopoverItem, formatter) {
		"use strict";

		return Controller.extend("nasa.ui5.remessasExportacao.controller.BaseController", {
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
			 */
			getTextI18n: function (pId) {
				return this.getResourceBundle().getText(pId);
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
		        
		        //Enable Button
		        var oMsgBtn = this.byId("itensButtonMsg");
		        oMsgBtn.setText(this.getResourceBundle().getText("itensButtonMsg", [sMessages.length]));

			},

			/**
			 * Popup com mensagem de erro
			 * @public
			 */
			onMessageError: function(pId){
	        	MessageBox.error(this.getTextI18n(pId), 
	        			{ styleClass: this.getOwnerComponent().getContentDensityClass() } );
		          return;				
			},
			
			/**
			 * Popup com display de mensagem 
			 * @public
			 */
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
			    case "W":
		        	MessageBox.alert(sMsg, { styleClass: this.getOwnerComponent().getContentDensityClass() } );
			        break;			        
				};	
			},	          
			
			/**
			 * Popup com mensagem de confirmação
			 * @public
			 */
			onMessageConfirmation: function(sQuestion, sButtonOK, sButtonNOK, sFunctionOK){
				var dialog = new Dialog({
		            title: this.getTextI18n("popupTitleMsgConfirm"),
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
			}

		});

	}
);