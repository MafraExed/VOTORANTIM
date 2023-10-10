sap.ui.define(["sap/ui/model/SimpleType",
		"sap/ui/model/ValidateException",
	],
	function (SimpleType, ValidateException) {
		"use strict";
		return {
			shiftLeadingZeros: function (vValue) {
				if (vValue === "0.000") {
					return '';
				} else {
					return vValue.replace(/^0+/, '');	
				}
			},
			cnpjConverter: function (vValue) {
				if (vValue) {
					return vValue.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
				}
			},

			statusConverter: function (vStatus) {

				if (vStatus !== "0000000000000") {
					return false;
				} else {
					return true;
				}
			},

			statusInfoStateConverter: function (vStatus) {
				
				var oTranslationModel = this.getView().getModel("i18n");
				var oBundle = oTranslationModel.getResourceBundle();
				
				var vText;
				if (vStatus !== "0000000000000") {
					vText = oBundle.getText("print_printed");
					return vText;
				} else {
					return vText;
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