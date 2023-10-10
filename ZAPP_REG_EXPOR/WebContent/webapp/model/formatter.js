sap.ui.define([
	               "sap/ui/core/format/NumberFormat",
	               "sap/ui/core/format/DateFormat",
	               "nasa/ui5/registroExportacao/model/constants",
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
			
		   
			mudarStatus2 : function(pValue){
			
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
			    	return  "sap-icon://message-warning" ;	  
			        break;
			    case constants.COMPLETED_STATUS:
			    	return  "sap-icon://approvals" ;
			 
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
			
			formatNumberInternational : function(pValue){
					if(pValue === ""){
						pValue =  0;
				      }else{
				    	  pValue = pValue.replace(".","");
				    	  pValue = pValue.replace(",",".");
				    	  pValue = parseFloat(pValue);
				      }
				      return pValue; 
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
			 
			 formatCNPJin: function(pValue){
				 if(!!pValue)
				    pValue = "" + pValue.replace(/\D/g,"");
				 
				 return pValue; 
			 },
			 
			 formatCNPJout: function(pValue){
				 
				 var sValue = "" + pValue.replace(/\D/g,"");
				 
				 if(!!sValue){
					//Coloca ponto entre o segundo e o terceiro d�gitos
					 sValue = sValue.replace(/^(\d{2})(\d)/,"$1.$2")
				 
				    //Coloca ponto entre o quinto e o sexto d�gitos
				    sValue = sValue.replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3")
				 
				    //Coloca uma barra entre o oitavo e o nono d�gitos
				    sValue = sValue.replace(/\.(\d{3})(\d)/,".$1/$2")
				 
				    //Coloca um h�fen depois do bloco de quatro d�gitos
				    sValue = sValue.replace(/(\d{4})(\d)/,"$1-$2") 
				 }
				 
				 return sValue; 
			 }
			 
		};

	}
);