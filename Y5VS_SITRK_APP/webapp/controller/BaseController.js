"use strict";sap.ui.define(["sap/ui/core/mvc/Controller","com/innova/sitrack/lib/searchHelp/searchHelp"],function(e,t){return e.extend("com.innova.sili.controller.BaseController",{searchHelp:t,getRouter:function e(){return this.getOwnerComponent().getRouter()},getModel:function e(t){return this.getView().getModel(t)},setModel:function e(t,n){return this.getView().setModel(t,n)},getResourceBundle:function e(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()},errorHandler:function e(t){this.getOwnerComponent().errorHandler(t,this)},hideLoader:function e(t){this.getOwnerComponent().hideLoader(t)},showLoader:function e(){this.getOwnerComponent().showLoader()},onNavBack:function e(){this.getOwnerComponent().onNavBack()},onNavBackTable:function e(){this.getModel("appView").setProperty("/backFromButton",true);this.getOwnerComponent().onNavBack()},getMessageTextPool:function e(t){return this.getOwnerComponent().getMessageTextPool(t)}})});