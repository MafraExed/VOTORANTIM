sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/model/models","Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/controller/ListSelector","Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/controller/ErrorHandler"],function(t,e,s,i,o){"use strict";return t.extend("Y5GL_DHO_FORM3.Y5GL_DHO_FORM3.Component",{metadata:{manifest:"json"},init:function(){this.oListSelector=new i;this._oErrorHandler=new o(this);this.setModel(s.createDeviceModel(),"device");t.prototype.init.apply(this,arguments);this.getRouter().initialize()},destroy:function(){this.oListSelector.destroy();this._oErrorHandler.destroy();t.prototype.destroy.apply(this,arguments)},getContentDensityClass:function(){if(this._sContentDensityClass===undefined){if(jQuery(document.body).hasClass("sapUiSizeCozy")||jQuery(document.body).hasClass("sapUiSizeCompact")){this._sContentDensityClass=""}else if(!e.support.touch){this._sContentDensityClass="sapUiSizeCompact"}else{this._sContentDensityClass="sapUiSizeCozy"}}return this._sContentDensityClass}})});