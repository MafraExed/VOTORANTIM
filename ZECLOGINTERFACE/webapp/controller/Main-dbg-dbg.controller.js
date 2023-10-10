sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"ec/log/integrations/ECLogIntegrations/model/formatter"
], function (Controller,formatter) {
	"use strict";

	return Controller.extend("ec.log.integrations.ECLogIntegrations.controller.Main", {
		
		formatter: formatter,
		
		onInit: function () {
			var today = new Date().toISOString().slice(0,10);
			this.getView().byId("inputDate").setValue(today);
			this.getDadosECC("buscaLogs");
		},
		
		buscaRegistros: function(){
			this.getDadosECC("buscaLogs");
		},

		getFilters: function(){
			var filters;
			
			var inputDate = this.getView().byId("inputDate").getValue();
			if(inputDate){
				inputDate = inputDate.replace(/\//g,'-');
				filters = "Data ge datetime'" + inputDate + "T00:00:00.0' and Data le datetime'" + inputDate + "T23:59:59.9'" ; 
			}
			
			var inputEmpresa = this.getView().byId("inputEmpresa").getValue();
			if(inputEmpresa){
				if(filters){
					filters = filters + " and ";
					filters =  filters + "CompanyCode eq '" + inputEmpresa + "'" ; 
				}
				else 
					filters =  "CompanyCode eq '" + inputEmpresa + "'" ; 
			}
			
			var inputProcesso = this.getView().byId("inputProcesso").getSelectedKey();
			if(inputProcesso){
				if(filters){
					filters = filters + " and ";
					filters =  filters + "Processo eq '" + inputProcesso + "'" ; 
				}
				else 
					filters =  "Processo eq '" + inputProcesso + "'" ; 
			}
			
			var inputID = this.getView().byId("inputID").getValue();
			if(inputID){
				if(filters){
					filters = filters + " and ";
					filters =  filters + "IdProcesso eq '" + inputID + "'" ; 
				}
				else 
					filters =  "IdProcesso eq '" + inputID + "'" ; 
			}
			
			return filters;
		},

		getDadosECC: function (parametro) {
			var oModel = this.getOwnerComponent().getModel();
			var oDataURL;
			var that = this;
			var filters;

			//  Busca Logs
			if (parametro === "buscaLogs") {
				filters = this.getFilters();
				oDataURL = "/logs";
			}

			if(!filters){
				sap.m.MessageToast.show("Preencher pelo menos um campo de pesquisa");
				return;
			}
				
            this.getView().byId("tableLogs").setBusy(true);
			oModel.removeData();
			oModel.read(oDataURL, {
				urlParameters: {
					"$orderby": 'Data desc',
					"$filter": filters
				},
				method: "GET",
				success: function (data) {
					that.getView().byId("tableLogs").setBusy(false);
					var oModel2;
					oModel2 = new sap.ui.model.json.JSONModel(data);
					that.getView().setModel(oModel2, "logs");
				},
				error: function () {
					that.getView().byId("tableLogs").setBusy(false);
					sap.m.MessageToast.show("Erro na conexão com o ECC");
				}
			});
		}

	});
});