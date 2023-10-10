sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"FibriaStatusViagem/webServices/conections"
], function(BaseController, MessageBox, Utilities, History, conections) {
	"use strict";

	return BaseController.extend("FibriaStatusViagem.controller.DialogUnscheduledStage", {
		stagesList: [],
		currentTruck: {},
		extraStagesPassed: [],
		tripInfo: {},
		setRouter: function(oRouter) {
			this.oRouter = oRouter;

		},
		addZero: function(i) {
			if (i < 10) {
				i = "0" + i;
			}
			return i;
		},
		getBindingParameters: function() {
			return {};

		},
		_onConfirmButtonPress: function() {
			var path = this.byId("unscheduledStageRadioButtons").getSelectedButton().getId();
			var index = parseInt(path.substring(path.lastIndexOf("-") + 1, path.length), 10);
			var model = this.byId("unscheduledStageRadioButtons").getSelectedButton().getModel("stagesList").getData();
			var stage = model[index];
			this.startUnscheduledStage(stage);
			this._onCloseDialogButtonPress();
		},
		handleExtraStage: function(oData, trocaMotorista) {
			oData = {
				stageInfo: oData,
				stageText: this.byId("unscheduledStageRadioButtons").getSelectedButton().getText(),
				stageDescription: this.byId("reasonTextArea").getValue(),
				toSendStage: this.extraStagesPassed,
				trocaMotorista: trocaMotorista
			};
			this.openDialog("DialogFrozenTrip", oData, "setUnscheduledStage");
		},
		startUnscheduledStage: function(stage) {
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
			var obj = {
				"CentroOrigem": sap.ui.getCore().getModel("SelectedDestination").CentroOrigem,
				"CentroDestino": sap.ui.getCore().getModel("SelectedDestination").CentroDestino,
				"DepositoDestino": sap.ui.getCore().getModel("SelectedDestination").Deposito,
				"Etapa": stage.Etapa.trim(),
				"Composicao": this.currentTruck.Composicao,
				"DataInicio": day,
				"HoraInicio": time,
				"DataFim": "",
				"HoraFim": "",
				"Viagem": this.tripInfo.CurrentStage.Viagem,
				"Oc": this.tripInfo.CurrentStage.Oc,
				"ItemOc": this.tripInfo.CurrentStage.ItemOc,
				"Usuario": "",
				"Descricao": this.byId("reasonTextArea").getValue()
			};
			this.extraStagesPassed.push(obj);
			this.handleUnpassedExtraStage(stage.TrocaMotorista);
		},
		handleUnpassedExtraStage: function(trocaMotorista) {
			for (var i = 0; i < this.stagesList.length; i++) {
				if (this.stagesList[i].Etapa.trim() === this.extraStagesPassed[this.extraStagesPassed.length - 1].Etapa.trim()) {
					var obj = {
						CentroDestino: sap.ui.getCore().getModel("SelectedDestination").CentroDestino,
						CentroOrigem: sap.ui.getCore().getModel("SelectedDestination").CentroOrigem,
						Composicao: this.currentTruck.Composicao,
						DataFim: "",
						DataInicio: this.extraStagesPassed[this.extraStagesPassed.length - 1].DataInicio,
						DepositoDestino: sap.ui.getCore().getModel("SelectedDestination").Destino,
						Descricao: this.byId("reasonTextArea").getValue(),
						Etapa: this.extraStagesPassed[this.extraStagesPassed.length - 1].Etapa,
						FimCiclo: "",
						HoraFim: "",
						HoraInicio: this.extraStagesPassed[this.extraStagesPassed.length - 1].HoraInicio,
						ItemOc: "000",
						Oc: this.tripInfo.CurrentStage.Oc,
						Usuario: this.tripInfo.currentDriver.Usuario,
						Viagem: this.tripInfo.CurrentStage.Viagem,
						Ofline: true
					};

				}
			}
			this.handleExtraStage(obj, trocaMotorista);
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

				}.bind(this));
			}
			if (eventBusData) {
				var oEventBus = sap.ui.getCore().getEventBus();
				oEventBus.publish(dialogName, eventBusName, eventBusData);
			}

			return new Promise(function(fnResolve) {
				oDialog.attachEventOnce("afterOpen", null, fnResolve);
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
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});
		},
		handleRadioButtonGroupsSelectedIndex: function() {
			var that = this;
			this.aRadioButtonGroupIds.forEach(function(sRadioButtonGroupId) {
				var oRadioButtonGroup = that.byId(sRadioButtonGroupId);
				var oButtonsBinding = oRadioButtonGroup ? oRadioButtonGroup.getBinding("buttons") : undefined;
				if (oButtonsBinding) {
					var oSelectedIndexBinding = oRadioButtonGroup.getBinding("selectedIndex");
					var iSelectedIndex = oRadioButtonGroup.getSelectedIndex();
					oButtonsBinding.attachEventOnce("change", function() {
						if (oSelectedIndexBinding) {
							oSelectedIndexBinding.refresh(true);
						} else {
							oRadioButtonGroup.setSelectedIndex(iSelectedIndex);
						}
					});
				}
			});

		},
		convertTextToIndexFormatter: function(sTextValue) {
			var oRadioButtonGroup = this.byId("sap_m_Dialog_0-content-sap_m_RadioButtonGroup-1536543533968");
			var oButtonsBindingInfo = oRadioButtonGroup.getBindingInfo("buttons");
			if (oButtonsBindingInfo && oButtonsBindingInfo.binding) {
				// look up index in bound context
				var sTextBindingPath = oButtonsBindingInfo.template.getBindingPath("text");
				return oButtonsBindingInfo.binding.getContexts(oButtonsBindingInfo.startIndex, oButtonsBindingInfo.length).findIndex(function(
					oButtonContext) {
					return oButtonContext.getProperty(sTextBindingPath) === sTextValue;
				});
			} else {
				// look up index in static items
				return oRadioButtonGroup.getButtons().findIndex(function(oButton) {
					return oButton.getText() === sTextValue;
				});
			}

		},
		_onCloseDialogButtonPress: function() {
			var oDialog = this.getView().getContent()[0];
			oDialog.close();
		},
		setStagesModel: function(oData) {
			this.stagesList = oData;
			var oJSON = new sap.ui.model.json.JSONModel();
			oJSON.setData(this.stagesList);
			this.getView().setModel(oJSON, 'stagesList');
		},
		getUnscheduledStages: function(sChanel, sEvent, oData) {
			if (!this.stagesList.length) {
				this.currentTruck = oData.Truck;
				this.tripInfo = oData;
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
						sap.ui.getCore().getModel("dialogUnscheduledStage").setStagesModel(oData.results);
					},
					function(err) {
						sap.m.MessageToast.show("Erro inesperado", {
							duration: 3000
						});
					}, "", aFilters);
			}

		},
		onInit: function() {
			sap.ui.getCore().setModel(this, "dialogUnscheduledStage");
			this._oDialog = this.getView().getContent()[0];
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribe("DialogUnscheduledStage", "getUnscheduledStages", this.getUnscheduledStages, this);
		},
		onExit: function() {
			this._oDialog.destroy();

		}
	});
}, /* bExport= */ true);