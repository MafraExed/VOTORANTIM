sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","Y5GL_EC_BENEF4/Y5GL_EC_BENEF4/controller/ErrorHandler"],function(t,s,e){"use strict";return t.extend("Y5GL_EC_BENEF4.Y5GL_EC_BENEF4.Component",{metadata:{manifest:"json"},init:function(){this._oErrorHandler=new e(this);t.prototype.init.apply(this,arguments);this.getRouter().initialize()},destroy:function(){this._oErrorHandler.destroy();t.prototype.destroy.apply(this,arguments)},getContentDensityClass:function(){if(this._sContentDensityClass===undefined){if(jQuery(document.body).hasClass("sapUiSizeCozy")||jQuery(document.body).hasClass("sapUiSizeCompact")){this._sContentDensityClass=""}else if(!s.support.touch){this._sContentDensityClass="sapUiSizeCompact"}else{this._sContentDensityClass="sapUiSizeCozy"}}return this._sContentDensityClass}})});