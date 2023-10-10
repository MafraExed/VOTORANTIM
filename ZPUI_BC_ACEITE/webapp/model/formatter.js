sap.ui.define([], function() {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit: function(sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},

		formatDate: function(sDate) {
			if (sDate) {
				return sDate.substr(6) + '.' + sDate.substr(4, 2) + '.' + sDate.substr(0, 4);
			}
		},

		formatTime: function(value) {
			//                             console.log(value);                        
			if (value) {

				var date = new Date(value.ms);
				//                             console.log("date po value.ms: "+ date);
				var timeinmiliseconds = date.getTime(); //date.getTime(); //date.getSeconds(); //date.getTime();
				//                             console.log(timeinmiliseconds);
				var oTimeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
					pattern: "KK:mm:ss a"
				});
				var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
				//                             console.log(TZOffsetMs);
				var timeStr = oTimeFormat.format(new Date(timeinmiliseconds + TZOffsetMs));
				//                             console.log(timeStr);

				return timeStr;
			} else {
				return value;
			}
		}

	};

});