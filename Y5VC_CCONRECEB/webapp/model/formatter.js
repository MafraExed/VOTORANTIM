sap.ui.define(["sap/ui/model/SimpleType",
		"sap/ui/model/ValidateException",
	],
	function (SimpleType, ValidateException) {
		"use strict";
		return {
			shiftLeadingZeros: function (vValue) {
				return parseInt(vValue, 10);
			},
			cnpjConverter: function (vValue) {
				if (vValue) {
					return vValue.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
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
			}),
		};
	});