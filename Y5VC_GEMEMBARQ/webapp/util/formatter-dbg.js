jQuery.sap.require("sap.ui.core.format.DateFormat");
sap.ui.define(["sap/ui/model/SimpleType",
		"sap/ui/model/ValidateException"
	],
	function (SimpleType, ValidateException) {
		"use strict";
		var Formatter = {
			State: "S",
			Icon: "I",
			dateTime: function (vDate, vTime) {
				if (vDate && vTime) {
					var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "dd.MM.yyyy HH:mm:ss"
					});
					var oDate = new Date(vDate.getTime() + vTime.ms);

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
			_stsProcMap: {
				"00": { //Nenhum
					"I": "sap-icon://status-inactive",
					"S": sap.ui.core.ValueState.None
				},
				"01": { //Agendado
					"I": "sap-icon://hint",
					"S": sap.ui.core.ValueState.Information
				},
				"02": { //Processando
					"I": "sap-icon://status-critical",
					"S": sap.ui.core.ValueState.Warning
				},
				"03": { //Erro docs
					"I": "sap-icon://status-negative",
					"S": sap.ui.core.ValueState.Error
				},
				"98": { //Processado
					"I": "sap-icon://status-positive",
					"S": sap.ui.core.ValueState.Success
				},
				"99": { //Cancelado
					"I": "sap-icon://status-negative",
					"S": sap.ui.core.ValueState.Error
				}
			},
			stsProcState: function (vValue) {
				var map = Formatter._stsProcMap;
				try {
					return (vValue && map[vValue].S) ? map[vValue].S : map["00"].S;
				} catch (e) {
					return "";
				}
			},
			stsProcIcon: function (vValue) {
				var map = Formatter._stsProcMap;
				try {
					return (vValue && map[vValue].I) ? map[vValue].I : map["00"].I;
				} catch (e) {
					return "";
				}
			},
			_stsMap: {
				"": { //Iniciado
					"I": "sap-icon://status-inactive",
					"S": sap.ui.core.ValueState.None
				},
				"L": { //Liberado
					"I": "sap-icon://hint",
					"S": sap.ui.core.ValueState.Information
				},
				"X": { //Carregado
					"I": "sap-icon://status-critical",
					"S": sap.ui.core.ValueState.Warning
				},
				"Z": { //Encerrado
					"I": "sap-icon://status-positive",
					"S": sap.ui.core.ValueState.Success
				},
				"D": { //Lib. divergências
					"I": "sap-icon://status-negative",
					"S": sap.ui.core.ValueState.Error
				}
			},
			stsState: function (vValue) {
				var map =  Formatter._stsMap;

				try {
					return (vValue && map[vValue].S) ? map[vValue].S : map[""].S;
				} catch (e) {
					return "None";
				}
			},
			stsIcon: function (vValue) {
				var map =  Formatter._stsMap;

				try {
					return (vValue && map[vValue].I) ? map[vValue].I : map[""].I;
				} catch (e) {
					return "None";
				}
			}

		};
		return Formatter;
	});