sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"FibriaStatusViagem/webServices/conections",
	"FibriaStatusViagem/controller/DialogLastTrip.controller"
], function(Controller, conections, DialogLastTrip) {
	"use strict";

	return Controller.extend("FibriaStatusViagem.controller.App", {

		stagesList: [],
		currentTruck: [],
		currentStage: {},
		currentExtraStage: {},
		currentDriver: {},
		currentStageStart: 0,
		generalStart: 0,
		currentStageDuration: 0,
		generalDuration: 0,
		NF: 0,
		getNFInterval: "",
		passedStages: [],
		passedExtraStages: [],
		connectionStatus: 0,
		tripInfo: {
			Oc: "",
			ItemOc: "",
			Viagem: ""
		},
		geoLocationSave: null,
		busy: false,
		multipleDestinations: false,
		interruptedStage: "",
		exibirPopUPNF: true,
		
		_onPageNavButtonPress: function(oEvent) {
			this.currentStage = {};
			this.currentStageStart = 0;
			this.generalStart = 0;
			var json = new sap.ui.model.json.JSONModel();
			json.setData(0);
			this.byId("stageDuration").setVisible(false);
			this.byId("generalDuration").setVisible(false);
			this.getView().setModel(json, "currentStageDuration");
			this.getView().setModel(json, "generalDuration");
			this.NF = 0;
			clearInterval(this.getNFInterval);
			this.byId("tripNF").setText("Não Gerada");
			var sync = this.checkSyncForChange();
			if (sync) {
				if (this.multipleDestinations) {
					this.openDialog("OriginDestinationDialog");
				} else {
					this.openDialog("SelectTruckPopover");
				}
			}
		},
		checkSyncForChange: function() {
			if (!this.passedStages.length) {
				return true;
			} else {
				sap.m.MessageToast.show("Aguarde a sincronização para trocar de composição", {
					duration: 3000
				});
				setTimeout(function() {
					sap.ui.getCore().getModel("app").callNav();
				}, 3000);
				return false;
			}
		},
		callNav: function() {
			this._onPageNavButtonPress();
		},
		_onNextStageButtonPress: function(oEvent) {
			sap.ui.core.BusyIndicator.show();
			this.byId("nextStageButton").setEnabled(false);
			setTimeout(function() {
				sap.ui.getCore().getModel("app").navToNextStage();
			}, 1500);

		},
		_onUnscheduledStageButtonPress: function(oEvent) {
			var oData = {
				Centro: this.currentTruck.Centro,
				Truck: this.currentTruck,
				CurrentStage: this.currentStage,
				currentDriver: this.currentDriver
			};
			this.openDialog("DialogUnscheduledStage", oData, "getUnscheduledStages");
		},
		_onDonutChartSelectValue: function(oEvent) {},
		_onProfileButtonPress: function(oEvent) {
			var oData = {
				Nome: this.currentDriver.Nome,
				Cpf: this.currentDriver.Cpf,
				Cnh: this.currentDriver.Cnh,
				Composicao: this.currentTruck.Composicao,
				Cavalo: this.currentTruck.PlcCavalo,
				Carreta1: this.currentTruck.PlcCarro1,
				Carreta2: this.currentTruck.PlcCarro2

			};
			this.openPopover("DriverProfilePopover", oEvent, oData, "setDriverInfo");
		},
		formatHours: function(hours) {
			if (hours.length) {
				return hours.substring(0, 2) + ":" + hours.substring(2, 4);
			} else {
				return "Não Finalizada";
			}
		},
		addZero: function(i) {
			if (i < 10) {
				i = "0" + i;
			}
			return i;
		},
		timeConversion: function(duration) {
			var milliseconds = parseInt((duration % 1000) / 100, 10),
				seconds = parseInt((duration / 1000) % 60, 10),
				minutes = parseInt((duration / (1000 * 60)) % 60, 10),
				hours = parseInt(duration / (1000 * 60 * 60), 10);

			hours = (hours < 10) ? "0" + hours : hours;
			minutes = (minutes < 10) ? "0" + minutes : minutes;
			seconds = (seconds < 10) ? "0" + seconds : seconds;

			return hours + ":" + minutes + ":" + seconds;
		},
		countStageTimer: function() {
			var currentStageTime = Math.abs(new Date() - this.currentStageStart);
			var convertedCurrentStageTime = this.timeConversion(currentStageTime);
			this.currentStageDuration = convertedCurrentStageTime;
			var json = new sap.ui.model.json.JSONModel();
			json.setData(this.currentStageDuration);
			this.getView().setModel(json, "currentStageDuration");
		},
		countGeneralTimer: function() {
			var generalTime = Math.abs(new Date() - this.generalStart);
			var convertedGeneralTime = this.timeConversion(generalTime);
			this.generalDuration = convertedGeneralTime;
			var json = new sap.ui.model.json.JSONModel();
			json.setData(this.generalDuration);
			this.getView().setModel(json, "generalDuration");
		},
		startTimer: function(startTime, startDate, startProccessDate, startProccessTime) {
			this.byId("stageDuration").setVisible(true);
			this.byId("generalDuration").setVisible(true);
			startTime = startTime.substring(0, 2) + ":" + startTime.substring(2, 4) + ":" + startTime.substring(4, 6);
			var date = startDate.substring(0, 4) + "/" + startDate.substring(4, 6) + "/" + startDate.substring(6, 8);
			date = new Date(date + " " + startTime);
			this.currentStageStart = date;
			if (!this.generalStart) {
				if (!startProccessDate) {
					this.generalStart = date;
				} else {
					startTime = startProccessTime.substring(0, 2) + ":" + startProccessTime.substring(2, 4) + ":" + startProccessTime.substring(4, 6);
					var initialDate = startProccessDate.substring(0, 4) + "/" + startProccessDate.substring(4, 6) + "/" + startProccessDate.substring(
						6, 8);
					initialDate = new Date(initialDate + " " + startTime);
					this.generalStart = initialDate;
				}
			}
			setInterval(function() {
				sap.ui.getCore().getModel("app").countStageTimer();
				sap.ui.getCore().getModel("app").countGeneralTimer();
			}, 1000);
		},
		setChart: function() {
			// TO DO

		},
		setNF: function(oData) {
			this.NF = oData.NotaFiscal;
			this.byId("tripNF").setText(this.NF);
			this.openDialog("DialogNF", this.NF, "setNFOnDialog");
			clearInterval(this.getNFInterval);
			this.exibirPopUPNF = false;
		},
		getNF: function() {
			if ((this.tripInfo.Viagem) && (this.tripInfo.Oc) && (this.tripInfo.ItemOc) && (this.exibirPopUPNF)) {
				var aFilters = [];
				var stringParam = "/ZET_VPWM_STATUS_NFSET(Viagem='" + this.tripInfo.Viagem + "',Oc='" + this.tripInfo.Oc + "',ItemOc='" + this.tripInfo.ItemOc + "')";
				conections.consumeModel(stringParam,
					function(oData, oResponse) {
						sap.ui.getCore().getModel("app").setNF(oData);
					},
					function(err) {}, "", aFilters);
			}
		},
		checkNF: function() {
			if (!this.NF) {
				this.getNFInterval = setInterval(function() {
					sap.ui.getCore().getModel("app").getNF();
				}, 30000);
			}
		},
		handleStagePass: function(oData) {
			if (!oData.Ofline) {
				this.passedStages.shift();
			}
			var currentStage = {
				Etapa: "",
				DescricaoEtapa: "",
				DescAcao1: "",
				DescAcao2: "",
				HoraInicio: "",
				HoraFim: "",
				HoraInicioBack: "",
				DataInicioBack: "",
				HoraFimBack: "",
				DataFimBack: "",
				Oc: "",
				ItemOc: "",
				Viagem: ""
			};
			sap.ui.core.BusyIndicator.hide();
			this.byId("nextStageButton").setEnabled(true);
			for (var i = 0; i < this.stagesList.length; i++) {
				if (this.stagesList[i].Etapa.trim() === oData.Etapa.trim()) {
					if (this.stagesList[i].EtapaInicial) {
						if (this.currentStageStart) {
							this.openDialog("DialogLastTrip");
						}
						this.tripInfo = {};
						this.currentStage = {};
						this.currentStageStart = 0;
						this.generalStart = 0;
						this.NF = 0;
						clearInterval(this.getNFInterval);
						this.byId("tripNF").setText("Não Gerada");
					}
					if (this.stagesList[i].CicloNotaFiscal) {
						this.checkNF();
						this.exibirPopUPNF = true;
					}
					currentStage.Etapa = oData.Etapa;
					currentStage.HoraInicio = oData.HoraInicio;
					currentStage.DataInicioBack = oData.DataInicio;
					currentStage.HoraInicioBack = oData.HoraInicio;
					currentStage.DataFimBack = oData.DataFim;
					currentStage.HoraFimBack = oData.HoraFim;
					currentStage.HoraFim = oData.HoraFim;
					currentStage.Oc = oData.Oc;
					currentStage.ItemOc = oData.ItemOc;
					currentStage.Viagem = oData.Viagem;
					currentStage.DescricaoEtapa = this.stagesList[i].DescricaoEtapa;
					currentStage.DescAcao1 = this.stagesList[i].DescAcao1;
					currentStage.DescAcao2 = this.stagesList[i].DescAcao2;
				}
			}
			currentStage.HoraInicio = this.formatHours(currentStage.HoraInicio);
			currentStage.HoraFim = this.formatHours(currentStage.HoraFim);
			this.startTimer(currentStage.HoraInicioBack, currentStage.DataInicioBack, currentStage.DataFimBack, currentStage.HoraFimBack);
			this.currentStage = currentStage;
			var json = new sap.ui.model.json.JSONModel();
			json.setData(this.currentStage);
			this.getView().setModel(json, "currentStage");
			this.setChart();
		},
		checkStageMode: function(oData) {
			var counter = 0;
			for (var i = 0; i < this.stagesList.length; i++) {
				if (this.stagesList[i].Etapa.trim() === oData.Etapa.trim()) {
					counter++;
				}
			}
			if (counter) {
				this.handleStagePass(oData);
			} else {
				this.getInterruptedStage();
				this.getExtraStageList(oData);
			}
		},
		getInterruptedStage: function() {
			var aFilters = [];
			var stringParam = "/ZET_VPWM_ETAPA_COMPOSICAOSET(CentroOrigem='" + sap.ui.getCore().getModel("SelectedDestination").CentroOrigem +
				"',CentroDestino='" + sap.ui.getCore().getModel("SelectedDestination").CentroDestino + "',DepositoDestino='" + sap.ui.getCore().getModel(
					"SelectedDestination").Deposito + "',Composicao='" + this.currentTruck.Composicao + "',Tipo='C')";
			conections.consumeModel(stringParam,
				function(oData, oResponse) {
					sap.ui.getCore().getModel("app").saveInterruptedStage(oData);
				},
				function(err) {
					sap.m.MessageToast.show("Não foi possível inicializar o aplicativo, conecte-se a internet", {
						duration: 3000
					});
				}, "", aFilters);
		},
		saveInterruptedStage: function(oData) {
			this.interruptedStage = oData;
		},
		setInterruptedStage: function() {
			this.handleStagePass(this.interruptedStage);
		},
		getExtraStageList: function(oData) {
			this.currentExtraStage = oData;
			var aFilters = [];
			var stringParam = "/ZET_VPWM_ETAPAS_TRPSET";

			var oFilter = new sap.ui.model.Filter({
				path: "CentroOrigem",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: sap.ui.getCore().getModel("SelectedDestination").CentroOrigem
			});
			aFilters.push(oFilter);

			oFilter = new sap.ui.model.Filter({
				path: "Tipo",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: "E"
			});
			aFilters.push(oFilter);

			oFilter = new sap.ui.model.Filter({
				path: "CentroDestino",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: sap.ui.getCore().getModel("SelectedDestination").CentroDestino
			});
			aFilters.push(oFilter);

			oFilter = new sap.ui.model.Filter({
				path: "DepositoDestino",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: sap.ui.getCore().getModel("SelectedDestination").Deposito
			});
			aFilters.push(oFilter);

			conections.consumeModel(stringParam,
				function(oData, oResponse) {
					sap.ui.getCore().getModel("app").handleExtraStage(oData.results);
				},
				function(err) {
					sap.m.MessageToast.show("Erro inesperado", {
						duration: 3000
					});
				}, "", aFilters);
		},
		handleExtraStage: function(oData) {
			var stageText;
			for (var i = 0; i < oData.length; i++) {
				if (oData[i].Etapa.trim() === this.currentExtraStage.Etapa.trim()) {
					stageText = oData[i].DescricaoEtapa;
				}
			}
			oData = {
				stageInfo: this.currentExtraStage,
				stageText: stageText,
				stageDescription: "teste"
			};
			this.openDialog("DialogFrozenTrip", oData, "setUnscheduledStage");
		},
		setBusyComposition: function(sMessage) {
			sap.m.MessageToast.show(sMessage, {
				duration: 3000
			});
			this.openDialog("OriginDestinationDialog");
		},
		checkTripStage: function() {
			var aFilters = [];
			var stringParam = "/ZET_VPWM_ETAPA_COMPOSICAOSET(CentroOrigem='" + sap.ui.getCore().getModel("SelectedDestination").CentroOrigem +
				"',CentroDestino='" + sap.ui.getCore().getModel("SelectedDestination").CentroDestino + "',DepositoDestino='" + sap.ui.getCore().getModel(
					"SelectedDestination").Deposito + "',Composicao='" + this.currentTruck.Composicao + "',Tipo='')";
			conections.consumeModel(stringParam,
				function(oData, oResponse) {
					sap.ui.getCore().getModel("app").checkStageMode(oData);
				},
				function(err) {
					if (JSON.parse(err.responseText).error.code === "1/008") {
						sap.ui.getCore().getModel("app").setBusyComposition(JSON.parse(err.responseText).error.message.value.split("8")[1]);
					} else {
						sap.ui.getCore().getModel("app").navToNextStage();
					}
				}, "", aFilters);

		},
		navToNextStage: function() {
			var time;
			var day;
			if (!this.currentStageStart) {
				var date = new Date();
				time = this.addZero(date.getHours()).toString() + "" + this.addZero(date.getMinutes()).toString() + "" + this.addZero(date.getSeconds())
					.toString();
				day = this.addZero(date.getFullYear()).toString() + this.addZero(date.getMonth() + 1).toString() + this.addZero(date.getDate()).toString();
			} else {
				time = this.currentStage.HoraInicioBack;
				day = this.currentStage.DataInicioBack;
			}
			var data = new Date();
			if(time === ""){
				time = this.addZero(data.getHours()).toString() + "" + this.addZero(data.getMinutes()).toString() + "" + this.addZero(data.getSeconds())
					.toString();
			}
			if(day === ""){
				day = this.addZero(data.getFullYear()).toString() + this.addZero(data.getMonth() + 1).toString() + this.addZero(data.getDate())
					.toString();
			}
			var stringParam = "/ZET_VPWM_REGI_ETAPASET";
			var obj = {
				"CentroOrigem": sap.ui.getCore().getModel("SelectedDestination").CentroOrigem,
				"CentroDestino": sap.ui.getCore().getModel("SelectedDestination").CentroDestino,
				"DepositoDestino": sap.ui.getCore().getModel("SelectedDestination").Deposito,
				"Etapa": "",
				"Composicao": this.currentTruck.Composicao,
				"DataInicio": day,
				"HoraInicio": time,
				"DataFim": this.addZero(data.getFullYear()).toString() + this.addZero(data.getMonth() + 1).toString() + this.addZero(data.getDate())
					.toString(),
				"HoraFim": this.addZero(data.getHours()).toString() + "" + this.addZero(data.getMinutes()).toString() + "" + this.addZero(data.getSeconds())
					.toString(),
				"Viagem": this.tripInfo.Viagem,
				"Oc": this.tripInfo.Oc,
				"ItemOc": this.tripInfo.ItemOc,
				"Usuario": this.currentDriver.Usuario
			};

			if (!this.currentStage.Etapa) {
				conections.createModel(stringParam, obj,
					function(oData, oResponse) {
						sap.ui.getCore().getModel("app").handleStagePass(oData);
					},

					function(err) {
						sap.ui.core.BusyIndicator.hide();
						sap.m.MessageToast.show("Não foi possível inicializar o aplicativo, conecte-se a internet", {
							duration: 3000
						});
					}
				);
			} else {
				obj.Etapa = this.currentStage.Etapa;
				this.passedStages.push(obj);
				this.handleUnpassedStage(obj.DataFim, obj.HoraFim);
			}

		},
		handleUnpassedStage: function(dataInicio, horaInicio) {
			this.connectionStatus = 0;
			this.byId("nextStageButton").setEnabled(true);
			for (var i = 0; i < this.stagesList.length; i++) {
				if (this.currentStage.Etapa.trim() === this.stagesList[i].Etapa.trim()) {
					// var data = new Date();
					var oData = {
						CentroDestino: sap.ui.getCore().getModel("SelectedDestination").CentroDestino,
						CentroOrigem: sap.ui.getCore().getModel("SelectedDestination").CentroOrigem,
						Composicao: this.currentTruck.Composicao,
						DataFim: "",
						// DataInicio: this.addZero(data.getFullYear()).toString() + this.addZero(data.getMonth() + 1).toString() + this.addZero(data.getDate())
						// 	.toString(),
						DataInicio: dataInicio,
						DepositoDestino: sap.ui.getCore().getModel("SelectedDestination").Deposito,
						Etapa: this.stagesList[i].ProximaEtapa,
						FimCiclo: "",
						HoraFim: "",
						// HoraInicio: this.addZero(data.getHours()).toString() + "" + this.addZero(data.getMinutes()).toString() + "" + this.addZero(data
						// 	.getSeconds()).toString(),
						HoraInicio: horaInicio,
						Oc: this.currentStage.Oc,
						ItemOc: this.currentStage.ItemOc,
						Usuario: this.currentDriver.Usuario,
						Viagem: this.currentStage.Viagem,
						Ofline: true
					};
					if (this.stagesList[i].ProximaEtapa.trim() === "0") {
						oData.Etapa = this.stagesList[0].Etapa;
					}
				}
			}
			var obj = {
				"CentroOrigem": sap.ui.getCore().getModel("SelectedDestination").CentroOrigem,
				"CentroDestino": sap.ui.getCore().getModel("SelectedDestination").CentroDestino,
				"DepositoDestino": sap.ui.getCore().getModel("SelectedDestination").Deposito,
				"Etapa": oData.Etapa,
				"Composicao": oData.Composicao,
				"DataInicio": oData.DataInicio,
				"HoraInicio": oData.HoraInicio,
				"DataFim": "",
				"HoraFim": "",
				"Viagem": oData.Viagem,
				"Oc": oData.Oc,
				"ItemOc":oData.ItemOc,
				"Usuario": oData.Usuario
			};
			this.passedStages.push(obj);
			this.handleStagePass(oData);
		},
		openDialog: function(dialogName, eventBusData, eventBusName) {
			var sDialogName = dialogName;
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			var oView;
			if (!oDialog) {
				this.getOwnerComponent().runAsOwner(function() {
					oView = sap.ui.xmlview({
						viewName: "FibriaStatusViagem.view." + sDialogName
					});
					this.getView().addDependent(oView);
					oView.getController().setRouter(this.oRouter);
					oDialog = oView.getContent()[0];
					this.mDialogs[sDialogName] = oDialog;
					if (sDialogName === "DialogLastTrip") {
						this.lastTripDialog = oDialog;
					}

				}.bind(this));
			}
			if (eventBusData) {
				var oEventBus = sap.ui.getCore().getEventBus();
				oEventBus.publish(dialogName, eventBusName, eventBusData);
			}
			return new Promise(function(fnResolve) {
				oDialog.attachEventOnce("afterOpen", null, fnResolve);
				oDialog.addAriaDescribedBy({
					escapeHandler: function(oPromise) {
						oPromise.reject();
					}
				});
				oDialog.open();
				if (oView) {
					oDialog.attachAfterOpen(function() {
						oDialog.rerender();
					});
				} else {
					oView = oDialog.getParent();
				}

				var oModel = this.getView().getModel();
				if (oModel) {
					oView.setModel(oModel);
				}
			}.bind(this)).catch(function(err) {
				// if (err !== undefined) {}
			});
		},
		openPopover: function(sPopoverName, oEvent, eventBusData, eventBusName) {

			this.mPopovers = this.mPopovers || {};
			var oPopover = this.mPopovers[sPopoverName];
			var oSource = oEvent.getSource();
			var oBindingContext = oSource.getBindingContext();
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oView;
			if (!oPopover) {
				this.getOwnerComponent().runAsOwner(function() {
					oView = sap.ui.xmlview({
						viewName: "FibriaStatusViagem.view." + sPopoverName
					});
					this.getView().addDependent(oView);
					oView.getController().setRouter(this.oRouter);
					oPopover = oView.getContent()[0];
					oPopover.setPlacement("Auto");
					this.mPopovers[sPopoverName] = oPopover;
				}.bind(this));
			}
			if (eventBusData) {
				var oEventBus = sap.ui.getCore().getEventBus();
				oEventBus.publish(sPopoverName, eventBusName, eventBusData);
			}

			return new Promise(function(fnResolve) {
				oPopover.attachEventOnce("afterOpen", null, fnResolve);
				oPopover.openBy(oSource);
				if (oView) {
					oPopover.attachAfterOpen(function() {
						oPopover.rerender();
					});
				} else {
					oView = oPopover.getParent();
				}

				var oModel = this.getView().getModel();
				if (oModel) {
					oView.setModel(oModel);
				}
				if (sPath) {
					var oParams = oView.getController().getBindingParameters();
					oView.bindObject({
						path: sPath,
						parameters: oParams
					});
				}
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					//
				}
			});

		},
		getDriverData: function() {
			var aFilters = [];
			var stringParam = "/ZET_VPWM_MOTORISTASET(Centro='',Codigo='')";
			conections.consumeModel(stringParam,
				function(oData, oResponse) {
					sap.ui.getCore().getModel("app").setDriverInfo(oData);
				},
				function(err) {
					sap.ui.getCore().getModel("app").handleUnauthorizedAccess();
				}, "", aFilters);
		},
		setDriverInfo: function(oData) {
			this.currentDriver = oData;
			var oJSON = new sap.ui.model.json.JSONModel();
			oJSON.setData(this.currentDriver);
			this.getView().setModel(oJSON, 'currentDriver');
		},
		handleUnauthorizedAccess: function() {
			sap.ui.getCore().getModel("dialogSelectTrip").handleUnauthorizedAccess();
		},
		setTripModel: function(oData) {
			this.connectionStatus = 1;
			var percentage = 100 / oData.length;
			for (var i = 0; i < oData.length; i++) {
				oData[i].Porcentagem = percentage;
			}
			this.stagesList = oData;
			var oJSON = new sap.ui.model.json.JSONModel();
			oJSON.setData(this.stagesList);
			this.getView().setModel(oJSON, 'stagesList');
			this.checkTripStage();
		},
		TripSelected: function(sChanel, sEvent, oData) {
			this.currentTruck = oData;
			var oJSON = new sap.ui.model.json.JSONModel();
			oJSON.setData(this.currentTruck.Composicao);
			this.getView().setModel(oJSON, 'changeTruck');
			var aFilters = [];
			var stringParam = "/ZET_VPWM_ETAPAS_TRPSET";

			var oFilter = new sap.ui.model.Filter({
				path: "CentroOrigem",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: oData.Centro
			});
			aFilters.push(oFilter);

			oFilter = new sap.ui.model.Filter({
				path: "Tipo",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: "C"
			});
			aFilters.push(oFilter);

			oFilter = new sap.ui.model.Filter({
				path: "CentroDestino",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: sap.ui.getCore().getModel("SelectedDestination").CentroDestino
			});
			aFilters.push(oFilter);

			oFilter = new sap.ui.model.Filter({
				path: "DepositoDestino",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: sap.ui.getCore().getModel("SelectedDestination").Deposito
			});
			aFilters.push(oFilter);

			conections.consumeModel(stringParam,
				function(oData, oResponse) {
					sap.ui.getCore().getModel("app").setTripModel(oData.results);
				},
				function(err) {
					sap.m.MessageToast.show("Erro inesperado", {
						duration: 3000
					});
				}, "", aFilters);

		},
		ReturnRegularTrip: function(sChanel, sEvent, oData) {
			this.passedExtraStages = oData;
			if (!this.currentStageDuration) {
				var obj = this.passedExtraStages[0];
				var stringParam = "/ZET_VPWM_EXTRA_REGI_ETAPASET";
				conections.createModel(stringParam, obj,
					function(oData, oResponse) {
						sap.ui.getCore().getModel("app").setInterruptedStage();
					},

					function(err) {
						sap.ui.core.BusyIndicator.hide();
						sap.m.MessageToast.show("Por favor reinicializa o app, conexão necessária", {
							duration: 3000
						});
					});
			}
		},
		onDeleteCurrentTrip: function() {
			if (!this.passedStages.length) {
				var keys = {
					Etapa: this.currentStage.Etapa.trim(),
					DataInicio: this.currentStage.DataInicioBack,
					HoraInicio: this.currentStage.HoraInicioBack,
					Centro: sap.ui.getCore().getModel("SelectedDestination").CentroOrigem,
					Composicao: this.currentTruck.Composicao,
					CentroDestino: sap.ui.getCore().getModel("SelectedDestination").CentroDestino,
					DepositoDestino: sap.ui.getCore().getModel("SelectedDestination").Deposito
				};
				var stringParam = "/ZET_VPWM_REGI_ETAPASET(CentroOrigem='" + keys.Centro + "',CentroDestino='" + keys.CentroDestino +
					"',DepositoDestino='" + keys.DepositoDestino + "',Etapa='" + keys.Etapa +
					"',Composicao='" + keys.Composicao + "',DataInicio='" + keys.DataInicio + "',HoraInicio='" + keys.HoraInicio + "')";
				conections.deleteModel(stringParam, "urlParams",
					function(oData, oResponse) {
						sap.ui.core.BusyIndicator.hide();
						sap.ui.getCore().getModel("app").callNav();
					},

					function(err) {
						sap.ui.getCore().getModel("app").openDialog("DialogLastTrip");
					});
			} else {
				sap.ui.core.BusyIndicator.show();
				sap.m.MessageToast.show("Aguarde a sincronização para encerrar o aplicativo", {
					duration: 3000
				});
				//sap.ui.getCore().getModel("app").retryTripDelete();
				setTimeout(function() {
					sap.ui.getCore().getModel("app").retryTripDelete();
				}, 3000);
			}
		},
		retryTripDelete: function() {
			this.onDeleteCurrentTrip();
		},
		sendStagePassed: function() {
			var obj = this.passedStages[0];
			var stringParam = "/ZET_VPWM_REGI_ETAPASET";
			conections.createModel(stringParam, obj,
				function(oData, oResponse) {
					sap.ui.getCore().getModel("app").handleStageSync(oData);
				},

				function(err) {
					sap.ui.core.BusyIndicator.hide();
					sap.ui.getCore().getModel("app").checkSyncTimer();
				});
		},
		checkSyncTimer: function() {
			setTimeout(function() {
				sap.ui.getCore().getModel("app").checkSync();
			}, 30000);
		},
		handleStageSync: function(oData) {
			if(this.passedStages.length == 1){
				this.currentStage.HoraInicioBack = oData.HoraInicio;
				this.currentStage.DataInicioBack = oData.DataInicio;
			}
			if (oData.Viagem && !this.tripInfo.Viagem) {
				this.currentStage.Viagem = oData.Viagem;
				this.currentStage.Oc = oData.Oc;
				this.currentStage.ItemOc = oData.ItemOc;
				this.tripInfo.Viagem = oData.Viagem;
				this.tripInfo.Oc = oData.Oc;
				this.tripInfo.ItemOc = oData.ItemOc;
			}
			this.passedStages.shift();
			// if(this.passedStages.length > 0){
			// 	this.passedStages[0].HoraInicio = oData.HoraInicio;
			// 	this.passedStages[0].DataInicio = oData.DataInicio;
			// }
			setTimeout(function() {
				sap.ui.getCore().getModel("app").checkSync();
			}, 5000);
		},
		checkSync: function() {
			if (this.passedStages.length) {
				this.sendStagePassed();
			} else {
				setTimeout(function() {
					sap.ui.getCore().getModel("app").checkSync();
				}, 30000);
			}
		},
		onExit: function() {
			clearInterval(window.timerLocalizacao);
			sap.ui.core.BusyIndicator.show();
			var sync = this.checkExitSync();
			if (sync) {
				sap.ui.core.BusyIndicator.hide();
			}
			this.currentStage = {};
			this.currentStageStart = 0;
			this.generalStart = 0;
			this.NF = 0;
			clearInterval(this.getNFInterval);
			this.byId("tripNF").setText("Não Gerada");
		},
		checkExitSync: function() {
			if (!this.passedStages.length) {
				return true;
			} else {
				sap.m.MessageToast.show("Aguarde a sincronização", {
					duration: 3000
				});
				setTimeout(function() {
					sap.ui.getCore().getModel("app").unSyncExit();
				}, 3000);
				return false;
			}
		},
		unSyncExit: function() {
			this.onExit();
		},
		getLocation: function() {
			var me = this;
			var options = {
				enableHighAccuracy: true,
				timeout: 5000,
				maximumAge: 0
			};
			// var sapGeoLocation = SAPGeoLocation(geoLocationType: location);
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(me.sendLocation, me.sendLocation, options);
				// navigator.geolocation.getCurrentPosition();
			} else {
				// x.innerHTML = "Geolocation is not supported by this browser.";
				me.sendLocation(me.geoLocationSave);
			}
		},
		createLocationObject: function(position, status) {
			if (!this.currentTruck.Composicao) {
				// setTimeout(function() {
				// 	sap.ui.getCore().getModel("app").getLocation();
				// }, 10000);
				return false;
			} else {
				var data = new Date();
				var obj = {
					"Usuario": this.currentDriver.Usuario,
					"Composicao": this.currentTruck.Composicao,
					"Data": this.addZero(data.getFullYear()).toString() + this.addZero(data.getMonth() + 1).toString() + this.addZero(data.getDate())
						.toString(),
					"Hora": this.addZero(data.getHours()).toString() + "" + this.addZero(data.getMinutes()).toString() + "" + this.addZero(data.getSeconds())
						.toString(),
					"Latitude": position.coords.latitude.toString(),
					"Longitude": position.coords.longitude.toString(),
					"CentroOrigem": sap.ui.getCore().getModel("SelectedDestination").CentroOrigem,
					"CentroDestino": sap.ui.getCore().getModel("SelectedDestination").CentroDestino,
					"DepositoDestino": sap.ui.getCore().getModel("SelectedDestination").Deposito,
					"Etapa": this.currentStage.Etapa,
					"Material": "",
					"Status": status,
					"Viagem": this.currentStage.Viagem,
					"Oc": this.currentStage.Oc
				};
				return obj;

			}
		},
		getLocationSave: function() {
			return this.geoLocationSave;
		},
		setLocationSave: function(location) {
			this.geoLocationSave = location;
		},
		sendLocation: function(pos) {
			var status = "S";
			if (pos != null) {
				if (pos.code == undefined) {
					sap.ui.getCore().getModel("app").setLocationSave(pos);
				} else {
					status = "E";
				}
				var obj = true;
				if (sap.ui.getCore().getModel("app").getLocationSave() == null) {
					var position = {
						"coords": {
							"latitude": 0,
							"longitude": 0
						}
					};
					obj = sap.ui.getCore().getModel("app").createLocationObject(position, status);
				} else {
					obj = sap.ui.getCore().getModel("app").createLocationObject(sap.ui.getCore().getModel("app").getLocationSave(), status);
				}
				var stringParam = "/ZET_VPWM_VIAGENSSET";
				if (obj) {
					conections.createModel(stringParam, obj,
						function(oData, oResponse) {
							sap.ui.getCore().getModel("app").geoError();
						},

						function(err) {}
					);
				}

			}

		},
		geoError: function(error) {
			// setTimeout(function() {
			// 	sap.ui.getCore().getModel("app").getLocation();
			// }, 10000);
		},
		setCenterModel: function(oData) {
			var destinations = [];
			var centers = [];
			for (var i = 0; i < oData.length; i++) {
				var center = {
					Centro: "",
					Descricao: ""
				};
				center.Centro = oData[i].Centro;
				center.Descricao = oData[i].Descricao;
				centers.push(center);
				for (var j = 0; j < oData[i].CentroMotoristaToDestinoNav.results.length; j++) {
					destinations.push(oData[i].CentroMotoristaToDestinoNav.results[j]);
				}
			}
			if (!(destinations.length - 1)) {
				sap.ui.getCore().setModel(destinations[0], "SelectedDestination");
				this.openDialog("SelectTruckPopover", 1, "selectTruck");
			} else {
				this.multipleDestinations = true;
				var oData = {
					centers: centers,
					destinations: destinations
				};
				this.openDialog("OriginDestinationDialog", oData, "onSetModel");
			}
		},
		getCenterData: function() {
			var stringParam = "/ZET_VPWM_CENTRO_MOTORISTASet";
			var aFilters = [];
			var param = {
				"$expand": "CentroMotoristaToDestinoNav"
			};
			conections.consumeModel(stringParam,

				function(oData, oResponse) {
					sap.ui.getCore().getModel("app").setCenterModel(oData.results);
				},
				function(err) {}, param, aFilters);

		},
		onInit: function() {
			sap.ui.getCore().setModel(this, "app");
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribe("App", "TripSelected", this.TripSelected, this);
			oEventBus.subscribe("DialogLastTrip", "deleteTrip", this.onDeleteCurrentTrip, this);
			oEventBus.subscribe("DialogFrozenTrip", "ReturnRegularTrip", this.ReturnRegularTrip, this);
			this.getDriverData();
			this.checkSync();
		},
		onIniciaTimer: function() {
			var controller = this;
			var qtde = 0;
			window.timerLocalizacao = setInterval(function() {
				somaTempo();
			}, 1000);

			function somaTempo() {
				if (qtde == 120) {
					controller.getLocation();
					qtde = 0;
				}
				qtde++;
			}
		},
		onAfterRendering: function() {
			// this.getLocation();
			clearInterval(window.timerLocalizacao);
			this.onIniciaTimer();
			this.getCenterData();
			this.openDialog("DialogLastTrip", true, "DialogClose");
			this.lastTripDialog.close();
		}
	});
});