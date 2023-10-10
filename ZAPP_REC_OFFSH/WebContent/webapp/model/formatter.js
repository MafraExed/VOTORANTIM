sap.ui.define([
	               "sap/ui/core/format/NumberFormat",
	               "sap/ui/core/format/DateFormat",
	               "nasa/ui5/recebimentoOffshore/model/constant",
	], function (  
				   NumberFormat, 
				   DateFormat, 
				   constant) {
		
		"use strict";

		return {
			
			mudarStatus : function(pValue){
				switch (pValue) {
			    case constant.PENDENT_STATUS:
			       return "Error";
			       break;
			    case constant.START_STATUS:
			    	return "Warning";
			        break;
			    case constant.COMPLETED_STATUS:
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
			    case constant.PENDENT_STATUS:
			       return "Error";
			       break;
			    case constant.START_STATUS:
			    	return "Warning";
			        break;
			    case constant.COMPLETED_STATUS:
			    	return "Success";
			    default:
			        return "Information";	
			    };			    
			},
		      
			mudarTexto : function(pValue){
			 
				switch (pValue) {
			    case constant.PENDENT_STATUS:
			       return this.getResourceBundle().getText("pendentStatus");
			        break;
			    case constant.START_STATUS:
			    	return this.getResourceBundle().getText("startStatus");
			        break;
			    case constant.COMPLETED_STATUS:
			    	return this.getResourceBundle().getText("completedStatus");
			    	break;
			    case constant.ALL_STATUS:
			    	return this.getResourceBundle().getText("AllStatus");
			    	break;
			    };	

		    },
		   
		   mudarIcon : function(pValue){
				 
				switch (pValue) {
			    case constant.PENDENT_STATUS:
			       return  "sap-icon://pending" ;
			        break;
			    case constant.START_STATUS:
			    	return  "sap-icon://message-warning" ; //alert, warning, //warning2, quality-issue							  
			        break;
			    case constant.COMPLETED_STATUS:
			    	return  "sap-icon://approvals" ;//accept
			 
			    };	

		   },
		   
		   mudarIconIte : function(pValue){
				 
				switch (pValue) {
			    case constant.PENDENT_STATUS:
			       return "sap-icon://message-error" ;
			        break;
			    case constant.START_STATUS:
			    	return "sap-icon://message-warning";
			        break;    
			    case constant.COMPLETED_STATUS:
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
		   
		   
		   formatTabs: function(pValue){
			  
			   var oVisibleElement = this.byId("iconTabBarFilter6");
		    	  oVisibleElement.setVisible(true);  
		   },
		   		   
		   
		   formatTipoProd: function(pValue){
			   switch (pValue) {
			    case "F":
			       return "Fibria" ;
			        break;
			    case "V":
			    	return  "Veracel" ;
			    	break;
			    case "K":
			    	return  "Klabin" ;
			    	break;
			    default:
			    	return "";
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
				
			mudarIconStatSM : function(pValue){
					   switch (pValue) {
					    case 'C':
					    	return "sap-icon://approvals" ;
					        break;
					    default:
					    	return "sap-icon://pending" ;
					        break;
					    };
			 },
				 
			 mudarStateStatSM : function(pValue){
					 switch (pValue) {
					    case 'C':
					    	return "Success" ;
					        break;
					    default:
					    	return "Error" ;
					        break;
					    };	
			  }
		   
		};

	}
);