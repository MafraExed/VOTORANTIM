sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text",
	"sap/viz/ui5/format/ChartFormatter",
	"sap/viz/ui5/api/env/Format"

], function(Controller, JSONModel, History, Dialog, Button, Text, ChartFormatter, Format) {

	"use strict";

	return Controller.extend("ZCBMM_RELGFRET.ZCBMM_RELGFRET.controller.Worklist", {

		onInit: function() {

		},

		//Carrega SmartTable com detalhes de documentos em vigência
		onSuccess: function(oEvent) {

			var smartTable = this.getView().byId("smartTableSuccess");
			smartTable.rebindTable("e");
			this.getView().byId("smartTableSuccess").setVisible(true);

			var smartTable2 = this.getView().byId("smartTableWarning");
			smartTable2.rebindTable("e");
			this.getView().byId("smartTableWarning").setVisible(false);

			var smartTable3 = this.getView().byId("smartTableError");
			smartTable3.rebindTable("e");
			this.getView().byId("smartTableError").setVisible(false);
		},
		//Carrega SmartTable com detalhes de documentos inexistentes
		onError: function(oEvent) {

			var smartTable = this.getView().byId("smartTableSuccess");
			smartTable.rebindTable("e");
			this.getView().byId("smartTableSuccess").setVisible(false);

			var smartTable2 = this.getView().byId("smartTableWarning");
			smartTable2.rebindTable("e");
			this.getView().byId("smartTableWarning").setVisible(false);

			var smartTable3 = this.getView().byId("smartTableError");
			smartTable3.rebindTable("e");
			this.getView().byId("smartTableError").setVisible(true);
		},

		//Carrega SmartTable com detalhes de documentos a vencer
		onWarning: function(oEvent) {

			var smartTable = this.getView().byId("smartTableSuccess");
			smartTable.rebindTable("e");
			this.getView().byId("smartTableSuccess").setVisible(false);

			var smartTable2 = this.getView().byId("smartTableWarning");
			smartTable2.rebindTable("e");
			this.getView().byId("smartTableWarning").setVisible(true);

			var smartTable3 = this.getView().byId("smartTableError");
			smartTable3.rebindTable("e");
			this.getView().byId("smartTableError").setVisible(false);
		},

		//Atualiza SmartTable
		onbeforeRebindTableSuccess: function(oEvent) {

			var Kozgf = this.getView().byId("IdTpConditDe").getValue();

			if (Kozgf !== "") {

				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Kozgf",
					operator: "EQ",
					value1: Kozgf

				}));
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Status",
					operator: "EQ",
					value1: "G"

				}));
			} else {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Status",
					operator: "EQ",
					value1: "G"
				}));
			}
		},
		onbeforeRebindTableError: function(oEvent) {

			var Kozgf = this.getView().byId("IdTpConditDe").getValue();

			if (Kozgf !== "") {

				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Kozgf",
					operator: "EQ",
					value1: Kozgf
				}));
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Status",
					operator: "EQ",
					value1: "R"

				}));
			} else {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Status",
					operator: "EQ",
					value1: "R"

				}));
			}
		},
		onbeforeRebindTableWarning: function(oEvent) {

			var Kozgf = this.getView().byId("IdTpConditDe").getValue();

			if (Kozgf !== "") {

				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Kozgf",
					operator: "EQ",
					value1: Kozgf

				}));
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Status",
					operator: "EQ",
					value1: "Y"

				}));
			} else {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Status",
					operator: "EQ",
					value1: "Y"

				}));
			}
		},
		valueHelpRequest: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog2) {
				this._valueHelpDialog2 = sap.ui.xmlfragment("ZPUI_BCMM_COND.ZPUI_BCMM_COND.view.Condicoes", this);
				this.getView().addDependent(this._valueHelpDialog2);
				this._valueHelpDialog2.setModel(this.getView().getModel());

			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog2.open(sInputValue);

		},

		onHelpCondition: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment("ZCBMM_RELGFRET.ZCBMM_RELGFRET.view.Condition", this);
				this.getView().addDependent(this._valueHelpDialog);
				this._valueHelpDialog.setModel(this.getView().getModel());
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(sInputValue);

		},
		_handleValueHelpClose: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");

			this._valueHelpDialog = null;

			if (oSelectedItem) {
				var productInput = this.byId("IdTpConditDe");
				productInput.setValue(oSelectedItem.getTitle());
			}
			oEvent.getSource().getBinding("items").filter([]);
			this.getView().byId(this.inputId).setValueState("None");
		},

		//R.R.
		_handleValueHelpCond: function(oEvent) {

			var sValue = oEvent.getParameter("value");

			if (!sValue) {
				sValue = " ";
			}

			var sFilter = sValue;

			var oFilter = new sap.ui.model.Filter("Kschl", sap.ui.model.FilterOperator.Contains, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);

		},
		_onModelContextChangeCond: function(oEvent) {

			// create value help dialog
			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment("ZCBMM_RELGFRET.ZCBMM_RELGFRET.view.Condition", this);
				this.getView().addDependent(this._valueHelpDialog);
				this._valueHelpDialog.setModel(this.getView().getModel());
				this.getView().addDependent(this._valueHelpDialog);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog.open();
		},
		//R.R.
		 onBeforeShow: function(oEvent){
          var oBusyDialog = sap.ui.getCore().byId("GlobalBusyDialog");
          oBusyDialog.open();
          },
          onAfterShow: function(oEvent){
          var oBusyDialog = sap.ui.getCore().byId("GlobalBusyDialog");
          oBusyDialog.close();
          },
		//Função botão Pesquisar
		onPress: function(oEvent) {
			
			var oBusyDialog = new sap.m.BusyDialog("GlobalBusyDialog", {title : "Please wait..."});
			
			this.getView().byId("IdSucess").setVisible(true);
			this.getView().byId("IdError").setVisible(true);
			this.getView().byId("IdWarning").setVisible(true);
			this.getView().byId("idIconTabBarMulti").setVisible(true);
			this.getView().byId("idIconTabBarMulti").setSelectedKey("0");

			var Kozgf = this.getView().byId("IdTpConditDe").getValue();
			var Key = "";

			if (Kozgf === "") {
				var Key = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_RELGFRECOUNTSet";
			} else {
				var Key = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_RELGFRECOUNTSet/?$filter=Kozgf eq '" + Kozgf + "'";
			}

			var oModel13 = new sap.ui.model.json.JSONModel();
			oModel13.loadData(Key, null, false, "GET", false, false, null);

			var Yellow = oModel13.oData.d.results[2].Count;
			var Red = oModel13.oData.d.results[1].Count;
			var Green = oModel13.oData.d.results[0].Count;
			
			Yellow = parseInt(Yellow);
			Red = parseInt(Red);
			Green = parseInt(Green);
			
			this.getView().byId("IdSucess").setDisplayValue(Green + " Contrato(s) em vigência");
			this.getView().byId("IdError").setDisplayValue(Red + " Contrato(s) inexistentes");
			this.getView().byId("IdWarning").setDisplayValue(Yellow + " Contrato(s) a vencer");

			this.getView().byId("IdSucess").setDisplayValue(Green + " Contrato(s) em vigência");
			if (Green > 100){
				var v_Green = 100;
				this.getView().byId("IdSucess").setPercentValue(v_Green);
			}else{
			this.getView().byId("IdSucess").setPercentValue(Green);
			}
			
			this.getView().byId("IdError").setDisplayValue(Red + " Contrato(s) inexistentes");
			if (Red > 100){
				var v_Red = 100;
				this.getView().byId("IdError").setPercentValue(v_Red);
			}else{
				this.getView().byId("IdError").setPercentValue(Red);
			}
			

			this.getView().byId("IdWarning").setDisplayValue(Yellow + " Contrato(s) a vencer");
			if(Yellow > 100){
				var v_Yellow = 100;
				this.getView().byId("IdWarning").setPercentValue(v_Yellow);
			}else{
			this.getView().byId("IdWarning").setPercentValue(Yellow);
			}
			
			//var smartTable = this.getView().byId("smartTableSuccess");
			//smartTable.rebindTable("e");

			//var smartTable2 = this.getView().byId("smartTableWarning");
			//smartTable2.rebindTable("e");

			//var smartTable3 = this.getView().byId("smartTableError");
			//smartTable3.rebindTable("e");
			
			/*if (Green > Yellow && Green > Red){
				this.getView().byId("idIconTabBarMulti").setSelectedKey("0");
			}
			
			if (Red > Green && Red > Yellow){
				this.getView().byId("idIconTabBarMulti").setSelectedKey("1");
			}
			
			if (Yellow > Green && Yellow > Red){
				this.getView().byId("idIconTabBarMulti").setSelectedKey("2");
			}*/
			
			if (Green > 0){
			this.getView().byId("I_POSITIVE").setCount(Green);
			}
			if (Red > 0){
			this.getView().byId("I_NEGATIVE").setCount(Red);
			}
			if (Yellow > 0){
			this.getView().byId("I_CRITICAL").setCount(Yellow);
			}
		},
		
		handleIconTabBarSelect: function (oEvent) {
		
		var sKey = "";		
		var sKey = oEvent.getParameter("key");
		
		var Green = this.getView().byId("IdSucess").getPercentValue();
		var Red = this.getView().byId("IdError").getPercentValue();
		var Yellow = this.getView().byId("IdWarning").getPercentValue();
		//var sKey = this.getView().byId("idIconTabBarMulti").getSelectedKey("key");
		
		if (sKey === "0" && Green > 0){
			var smartTable = this.getView().byId("smartTableSuccess");
			smartTable.rebindTable("e");
		}
		if (sKey === "1" && Red > 0){
			var smartTable2 = this.getView().byId("smartTableError");
			smartTable2.rebindTable("e");
		}
		if (sKey === "2" && Yellow > 0){
			var smartTable3 = this.getView().byId("smartTableWarning");
			smartTable3.rebindTable("e");		
		}
		var sKey = "";
		},

	});
});