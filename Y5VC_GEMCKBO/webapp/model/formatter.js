sap.ui.define(["sap/ui/model/SimpleType",
		"sap/ui/model/ValidateException"
	],
	function (SimpleType, ValidateException) {
		"use strict";
		return {
			shiftLeadingZeros: function (vValue) {
				if(!vValue){
					return "";
				}
				return parseInt(vValue, 10);
			},

			statusConverterTextTypeBo: function (vStatus, vStatusText) {
				var vTextTypeBO = "";

				if (vStatus !== null && vStatus !== undefined) {
					vTextTypeBO = "(" + vStatus + ") " + vStatusText;
					return vTextTypeBO;
				} else {
					return vTextTypeBO;
				}
			},

			statusConverterText: function (vStatus, oMyself) {
				
				var oThat = oMyself;
				if(!oThat){
					oThat = this;
				}
				var oTranslationModel = oThat.getOwnerComponent().getModel("i18n");
				var oBundle = oTranslationModel.getResourceBundle();

				if (vStatus === "X") { //Aguardando Aprovação
					var vTextApproval = oBundle.getText("text_status_waiting_approval");
					return vTextApproval;
				} else if (vStatus === "A") { //Aberto
					var vTextOpen = oBundle.getText("text_status_open");
					return vTextOpen;
				} else if (vStatus === "E") { //Execução
					var vTextProcess = oBundle.getText("text_status_execution");
					return vTextProcess;
				} else if (vStatus === "F") { //Finalizado
					var vTextFinished = oBundle.getText("text_status_finalized");
					return vTextFinished;
				} else if (vStatus === "S") { //A ser salvo
					var vTextSave = oBundle.getText("text_status_save");
					return vTextSave;
				} else if (vStatus === "Z") { //Finalizado ao ser salvo
					var vTextSaveFin = oBundle.getText("text_status_f_save");
					return vTextSaveFin;
				} else {
					var vTextNovo = oBundle.getText("text_status_new");
					return vTextNovo;
				}
			},

			statusConverter: function (vStatus) {

				if (vStatus === "X") { //Aguardando Aprovação
					return "Error";
				} else if (vStatus === "A") { //Aberto
					return "Warning";
				} else if (vStatus === "E") { //Execução
					return "Warning";
				} else if (vStatus === "F") { //Finalizado
					return "Success";
				} else if (vStatus === "S") { //Salvar
					return "Success";
				} else {
					return "Success";
				}
			},
			getTpItemState: function (vTpItem) {
				 
				if(!vTpItem){ 
					return sap.ui.core.ValueState.Information;
				}

				if (vTpItem === "00") { //Ref. Item NF
					return sap.ui.core.ValueState.Success;
				} else if (vTpItem === "01") { //Genérico
					return sap.ui.core.ValueState.Warning;
				} else {
					return sap.ui.core.ValueState.Information;
				}
			},
			getTpItemIcon: function (vTpItem) {
				if(!vTpItem){ 
					return "sap-icon://status-inactive";
				}


				if (vTpItem === "00") { //Ref. Item NF
					return "sap-icon://manager-insight";
				} else if (vTpItem === "01") { //Genérico
					return "sap-icon://hint";
				} else {
					return "sap-icon://status-inactive";
				}
			},

			statusIconConverter: function (vStatus) {

				if (vStatus === "X") { //Aguardando Aprovação
					return "sap-icon://message-error";
				} else if (vStatus === "A") { //Aberto
					return "sap-icon://message-warning";
				} else if (vStatus === "E") { //Execução
					return "sap-icon://message-warning";
				} else if (vStatus === "F") { //Finalizado
					return "sap-icon://message-success";
				} else if (vStatus === "S") { //Salvar
					return "sap-icon://message-warning";
				} else {
					return "sap-icon://message-success";
				}
			},

			customChvNfeType: SimpleType.extend("chvNfe", {
				formatValue: function (oValue) {
					return oValue;
				},
				parseValue: function (oValue) {
					//parsing step takes place before validating step, value could be altered here
					return oValue;
				},
				validateValue: function (oValue) {
					if (oValue) {
						// Verifica se chave de acesso tem 44 caracteres
						if (oValue.length !== 44) {
							throw new ValidateException("'" + oValue + "' Não é uma chave de acesso válida");
						}
						// Verifica se chave de acesso contêm apenas números
						if (!/^\d+$/.test(oValue)) {
							throw new ValidateException("'" + oValue + "' Não é uma chave de acesso válida");
						}
					}
				}
			})
		};
	});