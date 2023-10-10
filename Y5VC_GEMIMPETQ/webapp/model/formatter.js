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

			statusConverter: function (vStatus) {

				var oTranslationModel = this.getView().getModel("i18n");
				var oBundle = oTranslationModel.getResourceBundle();

				if (vStatus === "00") {
					var vTextNovo = oBundle.getText("print_novo");
					return vTextNovo;
				} else if (vStatus === "11") {
					var vTextMark = oBundle.getText("print_mark");
					return vTextMark;
				} else if (vStatus === "12") {
					var vTextMarkPen = oBundle.getText("print_mark");
					return vTextMarkPen;
				} else if (vStatus === "02") {
					var vTextPrinted = oBundle.getText("print_printed");
					return vTextPrinted;
				} else if (vStatus === "01") {
					var vTextPending = oBundle.getText("print_pending");
					return vTextPending;
				} else {
					return "None";
				}
			},

			statusInfoStateConverter: function (vStatus) {

				if (vStatus === "00") {
					return "Warning";
				} else if (vStatus === "11") {
					return "Success";
				} else if (vStatus === "12") {
					return "Success";
				} else if (vStatus === "02") {
					// return "Information";
				} else if (vStatus === "01") {
					return "Warning";
				} else {
					// return "Information";
				}
			},

			xchpfCheck: function (vStatus) {

				if (vStatus === undefined) {
					var vTrueUnd = false;
					return vTrueUnd;
				} else if (vStatus === null) {
					var vTrueNul = false;
					return vTrueNul;
				} else {
					return true;
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