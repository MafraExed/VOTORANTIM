sap.ui.define([ "sap/ui/core/format/NumberFormat",
				"nasa/ui5/saidaMercadoria/model/constants" ],
				function(NumberFormat, constants) {
					"use strict";

					return {

						mudarStatus : function(pValue) {
							switch (pValue) {
							case constants.PENDENT_STATUS:
								return "Error";
								break;
							case constants.START_STATUS:
								return "Warning";
								break;
							case constants.COMPLETED_STATUS:
								return "Success";
							default:
								return "None";
							};

						},
						
						mudarStatus2 : function(pValue) {
							
							return "Warning";
						},

						//Busca nome dos Status
									mudarTexto : function(pValue){
									 
										switch (pValue) {
									    case constants.PENDENT_STATUS:
									       return this.getResourceBundle().getText("pendentStatus");
									        break;
									    case constants.START_STATUS:
									    	return this.getResourceBundle().getText("startStatus");
									        break;
									    case constants.COMPLETED_STATUS:
									    	return this.getResourceBundle().getText("completedStatus");
									    	break;
									    case constants.ALL_STATUS:
									    	return this.getResourceBundle().getText("AllStatus");
									    	break;
									    };	

								    },

						mudarIcon : function(pValue) {

							switch (pValue) {
							case constants.PENDENT_STATUS:
								return "sap-icon://pending";
								break;
							case constants.START_STATUS:
								return "sap-icon://message-warning"; 
								break;
							case constants.COMPLETED_STATUS:
								return "sap-icon://approvals";

							};
						},

						formatVisibleMarker : function(pValor) {
							if (pValor == "S")
								return true;

							return false;
						},

						   formatNumberBrazil : function(pValue){
								  var oNumberFormat = NumberFormat.getFloatInstance({
									  maxFractionDigits: 3,
									  groupingEnabled: true,
									  groupingSeparator: ".",
									  decimalSeparator: ","
							      });
								  
								  if(isNaN(pValue)){
									  pValue = 0;
								  }
								  
								  var text = oNumberFormat.format(pValue);
								  return text;
							 },

						formatTypeMessagePopOver : function(pValue) {
							switch (pValue) {
							case "error":
								return "Error";
								break;
							case "warning":
								return "Warning";
								break;
							case "info":
								return "Information";
								break;
							default:
								return "None";
								break;
							};
						},

						mudarStatusIcon : function(pValue) {
							var sIcon = (pValue == constants.COMPLETED_STATUS ? "sap-icon://approvals" : "sap-icon://pending");
							return sIcon;
						},

						mudarStatusState : function(pValue) {
							var sState = (pValue == constants.COMPLETED_STATUS ? "Success" : "Error");
							return sState;
						},

		
						
						setHighlight : function(pValue) {
							switch (pValue) {
							case constants.PENDENT_STATUS:
								return "Error";
								break;
							case constants.START_STATUS:
								return "Warning";
								break;
							case constants.COMPLETED_STATUS:
								return "Success";
							default:
								return "Information";
							};
						}

					};

				});