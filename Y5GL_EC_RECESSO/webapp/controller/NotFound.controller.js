sap.ui.define(["Y5GL_EC_RECESSO/Y5GL_EC_RECESSO/controller/BaseController"],function(t){"use strict";return t.extend("Y5GL_EC_RECESSO.Y5GL_EC_RECESSO.controller.NotFound",{onInit:function(){this.getRouter().getTarget("notFound").attachDisplay(this._onNotFoundDisplayed,this)},_onNotFoundDisplayed:function(){this.getModel("appView").setProperty("/layout","OneColumn")}})});