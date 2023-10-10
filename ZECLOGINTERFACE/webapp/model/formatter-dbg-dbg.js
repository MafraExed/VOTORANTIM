sap.ui.define([], function () {
	"use strict";
	return {
		formatDate: function (date) {
			
			// ajuste para considerar o timezone - FRC
			//var dateConv = new Date(date);
			//dateConv.setTime(dateConv.getTime() + 3 * 60 * 60 * 1000);
			// teste...
			//var dateConv = new Date("17/05/2022T08:30:00");
			
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				format: "full, e.g. '{1} 'at' {0}'",
                pattern: "dd-MM-yyyy - HH:mm"
            });
            
            // ajuste sugerido pelo Marcelo Walter
            //var dateConv = new Date(date);
			//dateConv.setTime(dateConv.getTime() + 3 * 60 * 60 * 1000);
			//return dateFormat.format(dateConv);
            
			// retorna data após novo ajuste - FRC
			 return dateFormat.format(date);
			//return dateFormat.format(dateConv); 
			
		},
		
		formatStatus: function(status){
			if(status === "OK")
				return "sap-icon://accept";
			else
				return "sap-icon://sys-cancel";
		},
		
		formatStatusColor: function(status){
			if(status === "OK")
				return "#1e9e40";
			else
				return "#d11d1d";
		}
	};
});