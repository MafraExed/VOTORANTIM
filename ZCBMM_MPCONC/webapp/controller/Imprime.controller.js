sap.ui.define([
	"ZCBMM_MPCONC/ZCBMM_MPCONC/controller/BaseController",
	"jquery.sap.global",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"ZCBMM_MPCONC/ZCBMM_MPCONC/model/formatter"
], function(BaseController,jQuery, Controller, JSONModel,formatter) {
	"use strict";

	return BaseController.extend("ZCBMM_MPCONC.ZCBMM_MPCONC.controller.Imprime", {

		formatter: formatter,

		onInit : function () {
			this.getRouter().getRoute("Imprime").attachPatternMatched(this._onObjectMatched, this);
		},
		
		_onObjectMatched: function(oEvent){
			var IdSolicitacao = oEvent.getParameter("arguments").IdSolicitacao,
				filter = IdSolicitacao,
				oFilter = new sap.ui.model.Filter("IdSolicitacao", sap.ui.model.FilterOperator.EQ, filter),
				oList = this.getView().byId("UploadCollection");
				
				oList.getBinding("items").filter([oFilter]);
			
		}
	});
});