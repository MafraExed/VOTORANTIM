sap.ui.define([],function(){"use strict";return{formatDate:function(t){var e=sap.ui.core.format.DateFormat.getDateInstance({format:"full, e.g. '{1} 'at' {0}'",pattern:"dd-MM-yyyy - HH:mm"});return e.format(t)},formatStatus:function(t){if(t==="OK")return"sap-icon://accept";else return"sap-icon://sys-cancel"},formatStatusColor:function(t){if(t==="OK")return"#1e9e40";else return"#d11d1d"}}});