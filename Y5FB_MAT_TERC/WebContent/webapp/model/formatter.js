sap.ui.define([
	"sap/ui/core/format/NumberFormat",
    "sap/ui/core/format/DateFormat",
    "y5fb/ui5/Dashboard/model/constants",
	], function (NumberFormat, DateFormat, constants) {
		"use strict";

		return {
				
	
			currencyValue : function (pValue) {
				if (!pValue) {
					return "";
				}

				return parseFloat(pValue).toFixed(2);
			},
			
			mudarTexto: function (){
				
			},
			
			mudarStatus : function(pStatus){
				switch (pStatus) {
			    case "P":
			       return "Error";
			       break;
			    case "E":
				       return "None";
				       break;   
			    case "I":
			    	return "Warning";
			        break;
			    case "C":
			    	return "Success";
			    case "S":
			    	return "None";	
			    default:
			        return "Error";	
			    };	
			    			    
			},
			
		
//			mudarTextoDrawback : function(pStatus){
//			 switch (pStatus) {
//			    case "P":
//			       return "Pendente";
//			        break;
//			    case "I":
//			    	return "Iniciado";
//			        break;
//			    case "C":
//			    	return "Concluido";
//			    	break;
//			    default :
//			    	return "ErroStatus";
//			    };	
//		    },
		   /*
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
			    	
			    default :
			    	return "sap-icon://cancel-maintenance";
			    };	
		   },
		   
		   mudarIconIte : function(pStatus){
			 switch (pStatus) {
			    case "P":
			       return "sap-icon://decline" ;
			        break;
			    case "S":
				       return "sap-icon://activity-items" ;
				        break;   
			    
			    case "E":
				       return "sap-icon://pending" ;
				        break;   
				        
			    case "C":
			    	return  "sap-icon://accept" ;			 
			    };	

		   },
		   
		   
		   formatDateTime: function(Ptime){
			  
		      var TZOffsetMs = new Date(0).getTimezoneOffset()*60*1000;

			   if (Ptime != null) {
				   var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({pattern: "KK:mm:ss a"});        
				   var timeStr = timeFormat.format(new Date(Ptime.ms + TZOffsetMs));  
					
				   var time = timeStr;
				  
				   time = time.substr(0,5) + time.substr(8,3); 

			   };	
			   	   
			   if (time != null) {
				
				   var hours = parseInt(time.substr(0,2)); 
				   var minutes = parseInt(time.substr(3,2));
				   var AMPM    = time.substr(6,2).toLowerCase();
			   
			   
				   if (AMPM == "pm" && hours < 12) hours = hours + 12;
				   
				   if (AMPM == "am" && hours == 12) hours = hours - 12;
				   
				   var sHours = hours.toString();
				   var sMinutes = minutes.toString();
				   if (hours < 10) sHours = "0" + sHours;
				   if (minutes < 10) sMinutes = "0" + sMinutes;
				   
				   time = sHours +':'+sMinutes+ 'h';
			   }else{
				  time 
			   }	
			   
			   return time;
			   	
			   
		   },
		   
		   
		      
		   classificaSaldo: function(Pvalue) {
			   var NumValue = parseFloat(Pvalue);
		
			   if (NumValue > 100000) {
				   return "Success";
				} else {
					
					if (NumValue > 50000 && NumValue < 100000) {
					 return "Warning";	
					}else{
						
						if (NumValue >= 0 && NumValue <= 50000) {
							return "Error";
						}else{
							return "None";
						}
					}
				}
   
		   },
	
		   formatVisibleMarker: function(pValor){
			   if(pValor == "S")
				   return true;
			   
			   return false;
		   },
		   */
			formatNumberQuantity : function(pValor) {
				pValor = pValor.trim();
		    	
			   	jQuery.sap.require("sap.ui.core.format.NumberFormat");
				  var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
					  maxFractionDigits: 0,
					  groupingEnabled: true,
					  groupingSeparator: ".",
					  decimalSeparator: ","
				  });
				  
				  if(isNaN(pValor)){
					  pValor = 0;
				  }
				  
				  var text = oNumberFormat.format(pValor);
				      return text;
			},
		   
		   formatNumberBrazil : function(pValor){
			   
			   	pValor = pValor.trim();
		    	
			   	jQuery.sap.require("sap.ui.core.format.NumberFormat");
				  var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
					  maxFractionDigits: 2,
					  groupingEnabled: true,
					  groupingSeparator: ".",
					  decimalSeparator: ","
				  });
				  
				  if(isNaN(pValor)){
					  pValor = 0;
				  }
				  
				  var text = oNumberFormat.format(pValor);
				      return text;
		   	}
				/*
		   formatDate: function(pValue) {
			          if(!!pValue){
			            jQuery.sap.require("sap.ui.core.format.DateFormat");
			            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "dd.MM.YYYY"});
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
			     }			    
		   */
		};

	}
);