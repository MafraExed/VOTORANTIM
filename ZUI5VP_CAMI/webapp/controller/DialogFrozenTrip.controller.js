sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"FibriaStatusViagem/webServices/conections"
], function(BaseController, MessageBox, Utilities, History, conections) {
	"use strict";

	return BaseController.extend("FibriaStatusViagem.controller.DialogFrozenTrip", {
		currentStage: {},
		currentStageStart: "",
		currentStageDuration: 0,
		passItems: [],
		busy: false,
		setRouter: function(oRouter) {
			this.oRouter = oRouter;

		},
		addZero: function(i) {
			if (i < 10) {
				i = "0" + i;
			}
			return i;
		},
		_onContinueTripButtonPress: function() {
			var time;
			var day;
			time = this.currentStage.stageInfo.HoraInicio;
			day = this.currentStage.stageInfo.DataInicio;
			// var stringParam = "/ZET_VPWM_EXTRA_REGI_ETAPASET";
			var data = new Date();
			var obj = {
				"CentroOrigem": sap.ui.getCore().getModel("SelectedDestination").CentroOrigem,
				"CentroDestino": sap.ui.getCore().getModel("SelectedDestination").CentroDestino,
				"DepositoDestino": sap.ui.getCore().getModel("SelectedDestination").Deposito,
				"Etapa": this.currentStage.stageInfo.Etapa.trim(),
				"Composicao": this.currentStage.stageInfo.Composicao,
				"DataInicio": day,
				"HoraInicio": time,
				"DataFim": this.addZero(data.getFullYear()).toString() + this.addZero(data.getMonth() + 1).toString() + this.addZero(data.getDate())
					.toString(),
				"HoraFim": this.addZero(data.getHours()).toString() + "" + this.addZero(data.getMinutes()).toString() + "" + this.addZero(data.getSeconds())
					.toString(),
				"Viagem": this.currentStage.stageInfo.Viagem,
				"Oc": this.currentStage.stageInfo.Oc,
				"ItemOc": this.currentStage.stageInfo.ItemOc,
				"Usuario": ""
			};
			// if(this.currentStage.toSendStage){
			// 	this.currentStage.toSendStage.push(obj);	
			// }
			// else{
			this.passItems.push(obj);
			// }
			this.checkExtraSync();
			this.handleStagePass();
		},
		_onCloseDialogButtonPress: function() {
			this.closeDialog();
		},
		handleStagePass: function(oData) {
			var passItems;
			if (this.currentStage.toSendStage) {
				passItems = this.currentStage.toSendStage;
			} else {
				passItems = this.passItems;
			}
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.publish("DialogFrozenTrip", "ReturnRegularTrip", passItems);
			this.closeDialog();
		},
		handleFrozenStage: function() {
			this.currentStage.stageInfo.stageText = this.currentStage.stageText;
			this.currentStage.stageInfo.stageDescription = this.currentStage.stageDescription;
			this.currentStage.stageInfo.formatedHours = this.formatHours(this.currentStage.stageInfo.HoraInicio);
			this.currentStage.stageInfo.formatedEndHours = this.formatHours(this.currentStage.stageInfo.HoraFim.trim());
			this.startTimer(this.currentStage.stageInfo.HoraInicio, this.currentStage.stageInfo.DataInicio);
			var json = new sap.ui.model.json.JSONModel();
			json.setData(this.currentStage.stageInfo);
			this.getView().setModel(json, "frozenState");
			this.checkExtraSync();
		},
		formatHours: function(hours) {
			if (hours !== "00000") {
				return hours.substring(0, 2) + ":" + hours.substring(2, 4);
			} else {
				return "Não Finalizada";
			}
		},
		startTimer: function(startTime, startDate) {
			startTime = startTime.substring(0, 2) + ":" + startTime.substring(2, 4) + ":" + startTime.substring(4, 6);
			var date = startDate.substring(0, 4) + "/" + startDate.substring(4, 6) + "/" + startDate.substring(6, 8);
			date = new Date(date + " " + startTime);
			this.currentStageStart = date;
			setInterval(function() {
				sap.ui.getCore().getModel("DialogFrozenTrip").countStageTimer();
			}, 1000);
		},
		countStageTimer: function() {
			var currentStageTime = Math.abs(new Date() - this.currentStageStart);
			var convertedCurrentStageTime = this.timeConversion(currentStageTime);
			this.currentStageDuration = convertedCurrentStageTime;
			var json = new sap.ui.model.json.JSONModel();
			json.setData(this.currentStageDuration);
			this.getView().setModel(json, "frozenStageDuration");
		},
		timeConversion: function(duration) {
			var milliseconds = parseInt((duration % 1000) / 100, 10),
				seconds = parseInt((duration / 1000) % 60, 10),
				minutes = parseInt((duration / (1000 * 60)) % 60, 10),
				hours = parseInt((duration / (1000 * 60 * 60)) % 24, 10);

			hours = (hours < 10) ? "0" + hours : hours;
			minutes = (minutes < 10) ? "0" + minutes : minutes;
			seconds = (seconds < 10) ? "0" + seconds : seconds;

			return hours + ":" + minutes + ":" + seconds;
		},
		setUnscheduledStage: function(sChanel, sEvent, oData) {
			this.currentStage.toSendStage = [];
			this.currentStage = oData;
			if (this.currentStage.toSendStage) {
				this.passItems = this.currentStage.toSendStage;
			}
			this.handleFrozenStage();
			if (oData.trocaMotorista) {
				var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
				oCrossAppNavigator.toExternal({
					target: {
						semanticObject: "#"
					}
				});
			}
		},
		sendExtraStagePassed: function() {
			if (!this.busy) {
				this.busy = true;
				var obj = this.passItems[0];
				var stringParam = "/ZET_VPWM_EXTRA_REGI_ETAPASET";
				conections.createModel(stringParam, obj,
					function(oData, oResponse) {
						sap.ui.getCore().getModel("DialogFrozenTrip").handleExtraStageSync();
					},

					function(err) {
						sap.ui.core.BusyIndicator.hide();
						sap.ui.getCore().getModel("DialogFrozenTrip").checkExtraSyncTimer();
					});
			}

		},
		checkExtraSyncTimer: function() {
			this.busy = false;
			setTimeout(function() {
				sap.ui.getCore().getModel("DialogFrozenTrip").checkExtraSync();
			}, 30000);
		},
		handleExtraStageSync: function() {
			this.busy = false;
			this.passItems.shift();
			this.checkExtraSync();
		},
		checkExtraSync: function(oData) {
			if (this.passItems) {
				if (this.passItems.length) {
					this.sendExtraStagePassed();
				} else {
					setTimeout(function() {
						sap.ui.getCore().getModel("DialogFrozenTrip").checkExtraSync();
					}, 30000);
				}
			}
		},
		closeDialog: function() {
			var oDialog = this.getView().getContent()[0];
			oDialog.close();
		},
		onInit: function() {
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribe("DialogFrozenTrip", "setUnscheduledStage", this.setUnscheduledStage, this);
			sap.ui.getCore().setModel(this, "DialogFrozenTrip");
			this._oDialog = this.getView().getContent()[0];
		},
		onExit: function() {
			this._oDialog.destroy();

		}

	});
}, /* bExport= */ true);