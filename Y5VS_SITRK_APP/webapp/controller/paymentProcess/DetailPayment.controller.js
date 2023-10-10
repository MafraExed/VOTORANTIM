"use strict";
/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["../BaseController","com/innova/util/isEmpty","com/innova/factory/payment/payment"],function(t,e,o){t.extend("com.innova.sitrack.controller.paymentProcess.DetailPayment",{payment:o,onInit:function t(){this._oPage=this.byId("page");this._oRouter=this.getRouter();this._oRouter.getRoute("purchaseTrackingPaymentDetail").attachMatched(this._onRouteMatched,this)},_onRouteMatched:function t(){this._oPaymentModel=this.getModel("payment");var o=this._oPaymentModel.getData(),a=o.items;if(e(a)){this.getModel("appView").setProperty("/resetProcessForm",true);this.getRouter().navTo("purchaseTracking",{},true)}}})});