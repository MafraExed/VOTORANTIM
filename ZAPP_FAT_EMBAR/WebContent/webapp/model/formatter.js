sap.ui.define([
	               "sap/ui/core/format/NumberFormat",
	               "sap/ui/core/format/DateFormat",
	               "nasa/ui5/faturamentoEmbarque/model/constants",
	], function (  
					NumberFormat, 
					DateFormat, 
					constants) {
		
		"use strict";

		return {
			
			mudarStatus : function(pValue){
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
			
			mudarStatusHighLigth : function(pValue){
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
		   
		   mudarIcon : function(pValue){
				 
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
		   
		   mudarIconIte : function(pValue){
				 
				switch (pValue) {
			    case constants.PENDENT_STATUS:
			       return "sap-icon://message-error" ;
			        break;
			    case constants.START_STATUS:
			    	return "sap-icon://message-warning";
			        break;    
			    case constants.COMPLETED_STATUS:
//			    	return  "sap-icon://sys-enter" ;
			    	break;			 
			    };	
		   },
		   
		   mudarStateProblema : function(pValue){
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
		   
		   mudarIconProblema : function(pValue){
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
		   
		   formatVisibleMarker: function(pValue){
			   if(pValue == "S")
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
				
			  formatTipoVenda: function(pValue){
				  	switch (pValue) {
				    case "N":
				       return this.getResourceBundle().getText("tipoVendaN") ;
				        break;
				    case "P":
						return  this.getResourceBundle().getText("tipoVendaP") ;
						break;
					};	
				},
				
				mudarStateNfe : function(pValue){
					 switch (pValue) {
					    case '2' || '3':
					    	return "Error" ;
					        break;
					    case '1':
					    	return "Success" ;
					        break;
					    default:
					    	return "Warning" ;
					        break;
					    };	
				},
				
				mudarIconNfe : function(pValue){
					   switch (pValue) {
					    case '2' || '3':
					    	return "sap-icon://pending" ;
					        break;
					    case '1':
					    	return "sap-icon://approvals" ;
					        break;
					    default:
					    	return "sap-icon://message-warning" ;
					        break;
					    };
				 },	
				 
				 		 
				 mudarTextoStatusNfe: function(pValue){
					 
					 switch (pValue) {
					    case '1':
					    	return "Autorizado";
					        break;
					    case '2':
					    	return "Recusado";
					        break;
					    case '3':
					    	return "Rejeitado";
					    	break;
					    default:
					    	return "Aguardando retorno do Sefaz" ;
					        break;	
					 }
				 }
				 
				 
				 
//				 mudarTextNfe : function(pValue){
//					   switch (pValue) {
//					    case '2' || '3':
//					    	return this.getResourceBundle().getText("tipoVendaN") ;
//					        break;
//					    case '1':
//					    	return this.getResourceBundle().getText("tipoVendaN") ;
//					        break;
//					    default:
//					    	return this.getResourceBundle().getText("tipoVendaN") ;
//					        break;
//					    };
//				 },		   
		   
		};

	}
);