jQuery.sap.require("sap.ui.core.format.DateFormat");
sap.ui.define(["sap/ui/model/SimpleType",
		"sap/ui/model/ValidateException"
	],
	function (SimpleType, ValidateException) {
		"use strict";
		return {
			date: function (vDate) {
				if (vDate) {
					var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "dd.MM.yyyy"
					});
					var oDate = new Date(vDate.getTime());
					return oDateFormat.format(oDate, true);
				}
				return "";
			},
			time: function (vTime) {
				if (vTime) {
					var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "HH:mm:ss"
					});
					var oDate = new Date(vTime.ms);

					return oDateFormat.format(oDate, true);
				}
				return "";
			},
			shiftLeadingZeros: function (vValue) {
				if (!vValue) {
					return "";
				}
				return parseInt(vValue, 10);
			},
			cnpjConverter: function (vValue) {
				if (vValue) {
					return vValue.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
				}
				return vValue;
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
				} else if (vStatus === "02") {
					// return "Information";
				} else if (vStatus === "01") {
					return "Warning";
				}

				return "Information";
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

			customNrEtqType: SimpleType.extend("nrEtq", {
				formatValue: function (oValue) {
					return oValue;
				},
				parseValue: function (oValue) {
					//parsing step takes place before validating step, value could be altered here
					return oValue;
				},
				validateValue: function (oValue) {
					if (oValue) {
						// Verifica se o número da etiqueta é maior que 10 caracteres
						if (oValue.length > 10) {
							throw new ValidateException("'" + oValue + "' Não é um número de etiqueta válido");
						}
						// Verifica se número da etiqueta contêm apenas números
						if (!/^\d+$/.test(oValue)) {
							throw new ValidateException("'" + oValue + "' Não é um número de etiqueta válido");
						}
					}
				}
			}),

			statusTextVolumeLido: function (vVolumeLido) {
				var sResult = "";
				sResult = vVolumeLido;
				return sResult;
			},

			statusStateVolumeLido: function (vVolumeLido, vVolume) {
				var sResult = "Error";

				if (vVolumeLido === vVolume) {
					sResult = "Success";
				}
				return sResult;
			},

			statusStateTotalVolume: function (vTotalVolumeLido, vTotalVolume) {
				var sResult = "Negative";

				if (vTotalVolumeLido === vTotalVolume) {
					sResult = "Positive";
				}

				return sResult;
			}
		};
	});