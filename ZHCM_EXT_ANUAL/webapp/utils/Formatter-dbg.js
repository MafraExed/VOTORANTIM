/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mypaystubs.utils.Formatter");
jQuery.sap.require("sap.ui.core.format.NumberFormat");
/*global hcm:true */
hcm.mypaystubs.utils.Formatter = (function() {
	"use strict";
	return {
	// Formatter for concatenating string in the View
	stringFormatter: function() {
		var str = "";
		if (arguments[1]) {
			for (var i = 0; i < arguments.length; i++) {
				str = str + " " + arguments[i];
			}
		}
		return str;
	},
	//Number Formatter for amount
	amountFormatter: function(amount) {
		try {
			if (!isNaN(parseFloat(amount)) && isFinite(amount)) {
				var amountFormat = sap.ui.core.format.NumberFormat.getInstance();
				return amountFormat.format(amount);
			}
		} catch (e) {
			jQuery.sap.log.warning(amount + " couldn't be formatted to Number", "Payslip");
		}
		return amount;
	},
	//formatter for deductions and grosspay string 
	numberFormatter: function() {
		if (arguments.length > 1) {
			arguments[1] = hcm.mypaystubs.utils.Formatter.amountFormatter(arguments[1]);
		}
		var str = arguments[0] + ":";
		for (var i = 1; i < arguments.length; i++) {
			str = str + " " + arguments[i];
		}
		return str;
	},
	//formatter for employeeID
	idFormatter: function() {
		var id = "";
		if (!arguments[1]) {
			id = arguments[0] + ": " + arguments[2];
		} else {
			id = arguments[0] + ": " + arguments[1];
		}
		return id;
	},	
	positionFormatter: function() {
		var position = "";
		if (arguments[1]) {
			position = arguments[0] + ": " + arguments[1];	
		}
		return position;
	},
	monthFormatterMaster: function() {
		//ARGUMENTS[0] = PayrollType (String)
		//ARGUMENTS[1] = Period (String)
		//ARGUMENTS[2] = BonusDate (DateTime)
		return hcm.mypaystubs.utils.Formatter.monthFormatter(arguments[0],arguments[1],arguments[2],"medium");
	},	
	monthFormatterDetail: function() {
		//ARGUMENTS[0] = PayrollType (String)
		//ARGUMENTS[1] = Period (String)
		//ARGUMENTS[2] = BonusDate (DateTime)
		//ARGUMENTS[3] = Reason (String)
		return hcm.mypaystubs.utils.Formatter.monthFormatter(arguments[0],arguments[1],arguments[2],"long",arguments[3]);
	},	
	monthFormatterDetailPhone: function() { 
		//ARGUMENTS[0] = PayrollType (String)
		//ARGUMENTS[1] = Period (String)
		//ARGUMENTS[2] = BonusDate (DateTime)
		//ARGUMENTS[3] = Reason (String)
		return hcm.mypaystubs.utils.Formatter.monthFormatter(arguments[0],arguments[1],arguments[2],"medium",arguments[3]);
	},	
	//formatter for object header title (MM/JJJJ)
	monthFormatter: function(payrollType,period,bonusDate,style,reason) {
		switch(payrollType) {
			case "A":	//offcycle run
			case "C":   //check
				if (bonusDate) {
					var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
						style: style,
						UTC: true
					});
					var dateFormatted = dateFormat.format(bonusDate);
					if (reason) {
						return reason + " - " + dateFormatted.toString();
					}
					return dateFormatted.toString();
				}
				break;
			default:	//standard payroll run
				try {
					if (!isNaN(parseFloat(period)) && isFinite(period)) {
						var formatyear = period.substring(0, 4);
						var formatmonth = period.substring(4, 6);
						if (reason) {
							return reason + " - " + formatmonth + "/" + formatyear;
						} else {
							return formatmonth + "/" + formatyear;
						}
					}
				} catch (e) {
					jQuery.sap.log.warning(period + " couldn't be formatted to month year", "month in S3 Controller", "Payslip");
				}
		}
	}
	};
}());