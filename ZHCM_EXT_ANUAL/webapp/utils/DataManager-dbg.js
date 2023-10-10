/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mypaystubs.utils.DataManager");
/*global hcm:true */
hcm.mypaystubs.utils.DataManager = (function() {
	var _modelBase = null;
	//var _resourceBundle = null;
	var _cachedModelObj = {};
	_cachedModelObj.exist = true;

	return {
		init: function(oDataModel, oresourceBundle) {
			_modelBase = oDataModel;
			//_resourceBundle = oresourceBundle;
		},

		getBaseODataModel: function() {
			return _modelBase;
		},

		setCachedModelObjProp: function(propName, propObj) {
			_cachedModelObj[propName] = propObj;
		},

		getCachedModelObjProp: function(propName) {
			return _cachedModelObj[propName];
		},

		getPersonellAssignments: function(appController, fSuccess) {
			var self = this;
			var oSuccessFn = function(oData) {
				fSuccess(oData.results);
			};
			var oErrorHandler = function(response) {
				self.parseErrorMessages(response);
			};
			_modelBase.read("/ConcurrentEmploymentSet", null, [], true, oSuccessFn, oErrorHandler);
		},
		getPaystubs: function(appController, fSuccess) {
			var self = this;
			var oUrlParams = [];
			var oPernr = appController.oApplication.pernr;
            oUrlParams.push("$filter=PersonnelAssignment eq '" + oPernr + "'");
			var oSuccessFn = function(oData) {
				fSuccess(oData.results);
			};
			var oErrorHandler = function(response) {
				self.errorDialog(self.parseErrorMessages(response));
			};
			_modelBase.read("/Paystubs", null, oUrlParams, true, oSuccessFn, oErrorHandler);
		},
		parseErrorMessages: function(objResponse) {
			if (objResponse.response && objResponse.response.body) {
				var dynamicSort = function(property) {
					var sortOrder = 1;
					if (property[0] === "-") {
						sortOrder = -1;
						property = property.substr(1);
					}
					return function(a, b) {
						var result;
						if (a[property] < b[property]) {
							result = -1;
						} else if (a[property] > b[property]) {
							result = 1;
						} else {
							result = 0;
						}
						return result * sortOrder;
					};
				};
				try {
					var oResponse = JSON.parse(objResponse.response.body);
					if (oResponse.error && oResponse.error.message && oResponse.error.message.value) {
						var result = [];
						result.push(oResponse.error.message.value);
						if (oResponse.error.innererror && oResponse.error.innererror.errordetails && oResponse.error.innererror.errordetails instanceof Array) {
							oResponse.error.innererror.errordetails.sort(dynamicSort("severity"));
							for (var i = 0; i < oResponse.error.innererror.errordetails.length; i++) {
								if (oResponse.error.innererror.errordetails[i].message) {
									var message = oResponse.error.innererror.errordetails[i].message;
									/*if (oResponse.error.innererror.errordetails[i].code) {
										message += " [" + oResponse.error.innererror.errordetails[i].code + "]";
									}*/
									if (oResponse.error.innererror.errordetails[i].severity) {
										message += " (" + oResponse.error.innererror.errordetails[i].severity + ")";
									}
									result.push(message);
								}
							}
						}
						return result;
					}
				} catch (e) {
					jQuery.sap.log.warning("couldn't parse error message", ["parseErrorMessages"], ["DataManger"]);
				}
			}
		},
		errorDialog : function(messages) {

			var _errorTxt = "";
			var _firstMsgTxtLine = "";
			var _detailmsg = "";
			var oSettings = "";

			if (typeof messages === "string") {
				oSettings = {
					message : messages,
					type : sap.ca.ui.message.Type.ERROR
				};
			} else if (messages instanceof Array) {

				for ( var i = 0; i < messages.length; i++) {
					_errorTxt = "";
					if (typeof messages[i] === "string") {
						_errorTxt = messages[i];
					} else if (typeof messages[i] === "object") {
						_errorTxt = messages[i].value;
					}
					_errorTxt.trim();
					if( _errorTxt !== ""){
    					if (i === 0) {
    						_firstMsgTxtLine = _errorTxt;
    					} else {
    						_detailmsg = _detailmsg + _errorTxt + "\n";
    					}
					}
				}

				if (_detailmsg === "") { // do not show any details if none are there
					oSettings = {
						message : _firstMsgTxtLine,
						type : sap.ca.ui.message.Type.ERROR
					};
				} else {
					oSettings = {
						message : _firstMsgTxtLine,
						details : _detailmsg,
						type : sap.ca.ui.message.Type.ERROR
					};
				}

			}
			sap.ca.ui.message.showMessageBox(oSettings);
		}
	};
}());