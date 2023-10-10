sap.ui.define([
               "sap/ui/core/format/NumberFormat",
               "sap/ui/core/format/DateFormat",
               "nasa/ui5/monitorEmbarques/model/constants"
	], function (NumberFormat, DateFormat, constants) {
		"use strict";

		return {
			currencyValue : function (pValue) {
				if (!pValue) {
					return "";
				}

				return parseFloat(pValue).toFixed(2);
			},
		
			mudarStatus : function(pValue){
				switch (pValue) {
			    case "P":
			       return "Error";
			       break;
			    case "I":
			    	return "Warning";
			        break;
			    case "C":
			    	return "Success";
			    default:
			        return "None";	
			    };	 			    
			},
			
			mudarStatus2 : function(pValue){
				
			    	return "Warning";
			  
			},
		      
//			//Textos de Status (Facet Filter)
//			mudarTexto : function(pValue){
//				if(pValue){
//					switch (pValue) {
//						case constants.PENDENT_STATUS:
//							return this.getTextI18n("statusPendente");
//							break;
//						case constants.START_STATUS:
//							return this.getTextI18n("statusIniciado");
//							break;
//						case constants.COMPLETED_STATUS:
//							return this.getTextI18n("statusConcluido");
//					    case constants.ALL_STATUS:
//					    	return this.getTextI18n("statusAll");
//					    	break;	
//					};	
//				}
//		   },
			
			
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
			
				
		   
		   mudarIcon : function(pStatus){
				 
				switch (pStatus) {
			    case "P":
			       return  "sap-icon://pending" ;
			        break;
			    case "I":
			    	return  "sap-icon://message-warning" ; 
			    	
			        break;
			    case "C":
			    	return  "sap-icon://approvals" ;
			 
			    };	

		   },
		   
		   mudarIconIte : function(pStatus){
				 
				switch (pStatus) {
			    case "E":
			       return "sap-icon://message-error";
			        break;
			    case "W":
				    return "sap-icon://message-warning";
				   
				    break;
			    case "S":

//			    	return  "sap-icon://sys-enter";
			    	break;
			    };	
		   },

		   formatVisibleMarker: function(pValor){
			   if(pValor == "S")
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
				
		    formatDate : function(pValue) {
		          if(!!pValue){
		            var oDateFormat = DateFormat.getDateTimeInstance({pattern: "dd.MM.YYYY"});
		            return oDateFormat.format(new Date(pValue));
		          }
		     },
			        
			    formatProcessFlowState: function(pStatus) {
					switch (pStatus) {
					    case "I":
					       return [ { state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, value: 50 },
					                { state: sap.suite.ui.commons.ProcessFlowNodeState.Positive,  value: 50 } ];
					       break;
					    case "C":
					       return [ { state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 100 }];
						   break;
					    case "E":
						   return [ { state: sap.suite.ui.commons.ProcessFlowNodeState.Critical, value: 100 }];
						   break;
						default:
							return [ { state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, value: 100 }];
				    };	
				},
			    
			     formatTypeMessagePopOver: function(pValue){
			    	 switch (pValue) {
					    case "error":
					       return "Error" ;
					        break;
					    case "warning":
					    	return  "Warning" ;
					    	break;
					    case "info":
					    	return  "Information" ;
					    	break;
					    default:
					    	return "None";
					    	break;
					 };	
			     },
			     
				   mudarStateProblema: function(pValue){
					   switch (pValue) {
					    case 'E':
					    	return "Error" ;
					        break;
					    case 'S':
					    	return "Success" ;
					        break;
					    case 'W':
					    	return "Warning" ;
					        break;
					    };	
				   },
				   
				   mudarIconProblema: function(pValue){
					   switch (pValue) {
					    case 'E':
					    	return "sap-icon://message-error" ;
					        break;
					    case 'S':
//					    	return "sap-icon://sys-enter";
					        break;
					    case 'W':
					    	return "sap-icon://message-warning" ;
					        break;
					    };
				   },
				   
			     formatTpVenda: function(pValue){
			    	 switch (pValue) {
					    case "N":
					    	return this.getTextI18n("textTpVendaNormal");
					    	break;
					    
					    case "D":
					    	return this.getTextI18n("textTpVendaDireta");
					    	break; 	
					    						    	
					    case "P":
					    	return this.getTextI18n("textTpVendaPossession");
					    	break;
					    default:
					    	return "";
					    	break;
					 };	
			     }

		};

	}
);