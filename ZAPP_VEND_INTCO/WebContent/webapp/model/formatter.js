sap.ui.define([
	               "sap/ui/core/format/NumberFormat",
	               "sap/ui/core/format/DateFormat",
	               "nasa/ui5/vendaIntercompany/model/constant",
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
			    	 break;
			    default:
			        return "None";	
			    };			    
			},

			mudarStatus2 : function(pValue){
				
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
		   
		   mudarStatusDocument: function(pValue){
			   switch (pValue) {
			    case 'Positive':
			    	return "Success";
			       break;
			    case 'Negative':
			    	return "Error";
			        break;
			    default:
			        return "None";	
			    };		
		   },
		   
		   mudarIconDocument : function(pValue){
				switch (pValue) {
			    case 'Positive':
//			       return  "sap-icon://sys-enter";
			        break;
			    case 'Negative':
			    	return  "sap-icon://message-error" ;							  
			        break;
			    default:
			    	return  "sap-icon://message-warning" ;
			 
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
			          else{
			        	return null;
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
			     
			    formatProcessFlowText: function(pValue) {
			    	 var oText = [];
			    	 
			    	 if(!!pValue)
			    		 oText.push(pValue);
			    	 
			    	 return oText;
				},
				
				formatProcessFlowChildren: function(pValue) {
			    	 var oChildren = [];
			    	 
			    	 if(!!pValue)
			    		 oChildren = pValue.split(",");
			    	 
			    	 return oChildren;
				},
				
				formatParceiro: function(pValue){
					 switch (pValue) {
					    case "AG":
					       return this.getResourceBundle().getText("detailDocumentsFuncParcAg") ;
					        break;
					    case "EO":
						     return this.getResourceBundle().getText("detailDocumentsFuncParcAg") ;
						     break;
					    case "RE":
					    	return  this.getResourceBundle().getText("detailDocumentsFuncParcRe") ;
					    	break;
					    case "RG":
						    return this.getResourceBundle().getText("detailDocumentsFuncParcRg") ;
						    break;
						 case "WE":
						    return  this.getResourceBundle().getText("detailDocumentsFuncParcWe") ;
						    break;
						 case "ZN":
							return  this.getResourceBundle().getText("detailDocumentsFuncParcZn") ;
							break;
						 case "ZO":
							 return  this.getResourceBundle().getText("detailDocumentsFuncParcZo") ;
							 break;
						 case "ZR":
							 return  this.getResourceBundle().getText("detailDocumentsFuncParcZr") ;
							 break;
						 case "ZP":
							 return  this.getResourceBundle().getText("detailDocumentsFuncParcZp") ;
							 break;
					     
					 };	
				},
				
				formatTipoVenda: function(pValue){
					switch (pValue) {
				    case "N":
				       return this.getResourceBundle().getText("tipoVendaN");
				        break;
				    case "D":
						return  this.getResourceBundle().getText("tipoVendaD");
						break;    
				        
					};	
				},
					
				PriceValor: function(pValue){
					if (pValue == '*') {
						pValue = false;
					}else{
						pValue = true;
					}	
	
					return pValue;
				},
				
				PriceMoeda: function(pValue){
					return checkBloqueio(pValue);	
				},
				
				PricePor: function(pValue){
					return checkBloqueio(pValue);	
				},
				
				PriceUm: function(pValue){
					return checkBloqueio(pValue);			
				},
								
				
				
				formatTextTpProd: function(pValue){
					switch (pValue) {
				    case "K":
				       return "Klabin" ;
				        break;
				    case "F":
						return "Fibria" ;
						break;
				    case "V":
						return "Veracel" ;
						break;
					};	
				}
		};
			
		
		//validacao de bloqueio das condicoes
		function checkBloqueio(vParam) {
			debugger;
			switch (vParam) {
			case '*' :
				vParam = false;
				return vParam;
				break;
			case '%':
				vParam = false;
				return vParam;
				break;	
			default:
				vParam = true;
				return vParam;
				break;
			}
		};
		
	
		
	}
);