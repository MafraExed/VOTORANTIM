sap.ui.define([
	], function () {
		"use strict";

		return {
			/**
			 * Rounds the currency value to 2 digits
			 *
			 * @public
			 * @param {string} sValue value to be formatted
			 * @returns {string} formatted currency value with 2 digits
			 */
			currencyValue : function (sValue) {
				if (!sValue) {
					return "";
				}

				return parseFloat(sValue).toFixed(2);
			},
			
			updateIntegerValue: function (sValue) {
				if (!sValue) {
					return "";
				}
				return parseInt(parseFloat(sValue).toFixed(0), 10);
			},
			
			dateStringOutputWay: function(sDate) {
				return sDate.substr(6,2) + "/" + sDate.substr(4,2) + "/" + sDate.substr(0,4);
			},
			
			getDateTimeOutputWay: function(sDateTime) {
				if(sDateTime)
					return sDateTime.toLocaleString();
				return sDateTime;
			}
		};
	}
);