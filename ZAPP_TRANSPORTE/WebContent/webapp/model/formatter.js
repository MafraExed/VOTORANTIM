sap.ui.define([
               "sap/ui/core/format/NumberFormat",
               "sap/ui/core/format/DateFormat",
               "nasa/ui5/transporte/model/constants"
	], function (NumberFormat, DateFormat, constants) {
		"use strict";

		return {

			mudarStatus: function(pValue){
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
			
			setHighlight: function(pValue){
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

		   
		   mudarIcon: function(pValue){
				 
				switch (pValue) {
			    case constants.PENDENT_STATUS:
			       return  "sap-icon://pending" ;
			        break;
			    case constants.START_STATUS:
			    	return  "sap-icon://message-warning" ; //alert, warning, //warning2, quality-issue							  
			        break;
			    case constants.COMPLETED_STATUS:
			    	return  "sap-icon://approvals" ;//accept
			 
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
//			    	return "sap-icon://sys-enter" ;
			        break;
			    case 'W':
			    	return "sap-icon://message-warning" ;
			        break;
			    };
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
			     
				 formatVisibleMarker: function(pValor){
					 if(pValor == "S")
						 return true;
					   
					   return false;
				 }			     
		   
		};
	}
);