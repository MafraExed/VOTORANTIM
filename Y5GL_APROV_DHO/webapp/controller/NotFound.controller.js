sap.ui.define(["Y5GL_APROV_DHO/Y5GL_APROV_DHO/controller/BaseController"],function(t){"use strict";return t.extend("Y5GL_APROV_DHO.Y5GL_APROV_DHO.controller.NotFound",{onInit:function(){this.getRouter().getTarget("notFound").attachDisplay(this._onNotFoundDisplayed,this)},_onNotFoundDisplayed:function(){this.getModel("appView").setProperty("/layout","OneColumn")}})});