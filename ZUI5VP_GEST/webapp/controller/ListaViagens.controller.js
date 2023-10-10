sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"monitorPortocel/webServices/apiConnector",
	"sap/m/Dialog",
	"sap/m/Panel"
], function (Controller, apiConnector, Dialog, Panel) {
	"use strict";

	return Controller.extend("monitorPortocel.controller.ListaViagens", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf monitorPortocel.view.ListaViagens
		 */
		onInit: function () {
			var oTable = this.byId("tabelaCiclo");
			oTable.setBusyIndicatorDelay(1);
			oTable.setBusy(true);
			this.byId("cabViagem").setBusyIndicatorDelay(1);
			this.byId("cabViagem").setBusy(true);

			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribe("dadosViagem", "viagem", this.loadModel, this);

			var oTemplate = oTable.getRowActionTemplate();
			var fnPress = this.handleActionPress.bind(this);
			oTemplate = new sap.ui.table.RowAction({items: [
						new sap.ui.table.RowActionItem({icon: "sap-icon://edit", text: "Edit", press: fnPress}),
						new sap.ui.table.RowActionItem({type: "Delete", press: fnPress})
					]});
			oTable.setRowActionTemplate(oTemplate);
			oTable.setRowActionCount(2);
		},

		loadModel: function(sChanel, sEvent, params) {

			this.centroOrigem =  params.centroOrigem;
			this.centroDestino = params.centroDestino;
			this.depositoDestino = params.depositoDestino;
			this.cdMotorista = params.cdMotorista;
			this.dtInicio = params.dtInicio.substr(6, 4) + params.dtInicio.substr(3, 2) + params.dtInicio.substr(0, 2);
			this.hrInicio = params.hrInicio.substr(0, 2) + params.hrInicio.substr(3, 2) + params.hrInicio.substr(6, 2);
			this.dtFim = params.dtFim.substr(6, 4) + params.dtFim.substr(3, 2) + params.dtFim.substr(0, 2);
			this.hrFim = params.hrFim.substr(0, 2) + params.hrFim.substr(3, 2) + params.hrFim.substr(6, 2);
			this.composicao = params.composicao;
			this.viagem = params.viagem;
			this.Status = params.Status;
			this.StatusText = params.StatusText;
			this.Excluido = params.Excluido;
			this.Alterado = params.Alterado;
			
			this.getListaViagensBackend();
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf monitorPortocel.view.ListaViagens
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf monitorPortocel.view.ListaViagens
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf monitorPortocel.view.ListaViagens
		 */
		onExit: function() {
			if (this._oPopupEtapa) {
				this._oPopupEtapa.destroy();
			}
		},

		onNavBack: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("grafico", {}, true);
		},

		handleActionPress: function(oEvent){
			
			var oRow = oEvent.getParameter("row");
			var oItem = oEvent.getParameter("item");

			if (this.getView().getModel().getProperty("Excluido", oRow.getBindingContext()) === "X") {
				sap.m.MessageToast.show("Etapa " + this.getView().getModel().getProperty("Etapa", oRow.getBindingContext()) + " - " +
					this.getView().getModel().getProperty("DescrEtapa", oRow.getBindingContext()) + " excluída, não é possível alterar");	
			} else {

				this.DtInicioUpdate = this.getView().getModel().getProperty("DtInicio", oRow.getBindingContext()).substr(6, 4) + this.getView().getModel().getProperty("DtInicio", oRow.getBindingContext()).substr(3, 2) + this.getView().getModel().getProperty("DtInicio", oRow.getBindingContext()).substr(0, 2);
				this.HrInicioUpdate = this.getView().getModel().getProperty("HrInicio", oRow.getBindingContext()).substr(0, 2) + this.getView().getModel().getProperty("HrInicio", oRow.getBindingContext()).substr(3, 2) + this.getView().getModel().getProperty("HrInicio", oRow.getBindingContext()).substr(6, 2);
				this.DtFimUpdate = this.getView().getModel().getProperty("DtFim", oRow.getBindingContext()).substr(6, 4) + this.getView().getModel().getProperty("DtFim", oRow.getBindingContext()).substr(3, 2) + this.getView().getModel().getProperty("DtFim", oRow.getBindingContext()).substr(0, 2);
				this.HrFimUpdate = this.getView().getModel().getProperty("HrFim", oRow.getBindingContext()).substr(0, 2) + this.getView().getModel().getProperty("HrFim", oRow.getBindingContext()).substr(3, 2) + this.getView().getModel().getProperty("HrFim", oRow.getBindingContext()).substr(6, 2);
				this.Etapa = this.getView().getModel().getProperty("Etapa", oRow.getBindingContext());
	
				switch (oItem.getType()) {
					case "Custom":
						this.handlePopoverPress(oEvent);
						break;
					case "Delete": 
						this.deleteSelectedStep(oEvent);
						break;
				}
			}
		},

		handlePopoverPress: function (oEvent) {
			
			var maskDtInicio = this.getView().getModel().getProperty("DtInicio", oEvent.getParameter("row").getBindingContext()).substr(3, 2) + "/" + this.getView().getModel().getProperty("DtInicio", oEvent.getParameter("row").getBindingContext()).substr(0, 2) + "/" + this.getView().getModel().getProperty("DtInicio", oEvent.getParameter("row").getBindingContext()).substr(8, 2);
			var maskDtFim = this.getView().getModel().getProperty("DtFim", oEvent.getParameter("row").getBindingContext()).substr(3, 2) + "/" + this.getView().getModel().getProperty("DtFim", oEvent.getParameter("row").getBindingContext()).substr(0, 2) + "/" + this.getView().getModel().getProperty("DtFim", oEvent.getParameter("row").getBindingContext()).substr(8, 2);
			var fnPressSubmit = this.updateStepItem.bind(this);

			this._oPopupEtapa = new Dialog({
				title: this.getView().getModel().getProperty("DescrEtapa", oEvent.getParameter("row").getBindingContext()),
				contentWidth: "550px",
				contentHeight: "300px",
				resizable: true,
				draggable: true,
				initialFocusId: "cancel_oPopupEtapa",
				content: [
					new sap.m.Panel({
						id: "DtHrInicioPnl",
						width: "auto",
						expanded: true,
						expandAnimation: false,
						content: [
							new sap.m.Text({ 
								text: "Data Hora Início",
								id: "DtHrInicioLbl"
							}),
							new sap.m.DatePicker({
								id: "DtInicio",
								required: true,
								displayFormat: "dd.MM.yyyy",
								value: maskDtInicio
							}),
							new sap.m.TimePicker({
								id: "HrInicio",
								required: true,
								displayFormat: "HH:mm:ss",
								valueFormat: "HH:mm:ss",
								support2400: true,
								value: this.getView().getModel().getProperty("HrInicio", oEvent.getParameter("row").getBindingContext())
							})
						]
					}),
					new sap.m.Panel({
						id: "DtHrFimPnl",
						width: "auto",
						expanded: true,
						expandAnimation: false,
						content: [
							new sap.m.Text({ 
								text: "Data Hora Fim",
								id: "DtHrFimLbl"
							}),
							new sap.m.DatePicker({
								id: "DtFim",
								required: true,
								displayFormat: "dd.MM.yyyy",
								value: maskDtFim
							}),
							new sap.m.TimePicker({
								id: "HrFim",
								required: true,
								displayFormat: "HH:mm:ss",
								valueFormat: "HH:mm:ss",
								support2400: true,
								value: this.getView().getModel().getProperty("HrFim", oEvent.getParameter("row").getBindingContext())
							})
						]
					})
				],
				beginButton: new sap.m.Button({
					id: "submit_oPopupEtapa",
					text: "Salvar",
					Type: "Accept",
					press: fnPressSubmit
				}),
				endButton: new sap.m.Button({
					id: "cancel_oPopupEtapa",
					text: "Cancelar",
					Type: "Reject",
					press: function () {
						this._oPopupEtapa.close();
						this._oPopupEtapa.destroy();
					}.bind(this)
				})
			});

			//to get access to the global model
			this.getView().addDependent(this._oPopupEtapa);
			this._oPopupEtapa.open();
		},


		deleteSelectedStep: function(control) {
			var message = "Você tem certeza que deseja prosseguir?";
			var fnPress = this.deleteStepItem.bind(this);
			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: [
					new sap.m.Label({ text: message, labelFor: "submitDeleteStepDialogTextarea"}),
					new sap.m.TextArea("submitDeleteStepDialogTextarea", {
						liveChange: function(oEvent) {
							var sText = oEvent.getParameter("value");
							var parent = oEvent.getSource().getParent();
							parent.getBeginButton().setEnabled(sText.length > 0);
						},
						width: "100%",
						placeholder: "Adicionar motivo (obrigatório)"
					})
				],
				beginButton: new sap.m.Button({
					text: "Continuar",
					enabled: false,
					press: fnPress
				}),
				endButton: new sap.m.Button({
					text: "Cancelar",
					press: function () {
						dialog.close();
						return false;
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});
			dialog.open();
		},

		deleteStepItem: function(me) {

			var dialog = me.getSource().getParent();
			dialog.setBusyIndicatorDelay(1);
			dialog.setBusy(true);

			var oEntry = {};
			var sText = sap.ui.getCore().byId("submitDeleteStepDialogTextarea").getValue();
			sap.m.MessageToast.show("Motivo é: " + sText);

			oEntry.CentroOrigem = this.centroOrigem;
			oEntry.CentroDestino = this.centroDestino;
			oEntry.DepositoDestino = this.depositoDestino;
			oEntry.Etapa = this.Etapa;
			oEntry.Composicao = this.composicao;
			oEntry.DtInicio = this.DtInicioUpdate;
			oEntry.HrInicio = this.HrInicioUpdate;
			oEntry.Message = sText;
			oEntry.Excluido = "X";
			oEntry.Alterado = "";

			var stringParam = "/ZET_VPWM_LISTA_ETAPAS_TRPSET" + 
								"(CentroDestino=" + "'" + this.centroDestino + "'" + 
								",CentroOrigem=" + "'" + this.centroOrigem + "'" +
								",Composicao=" + "'" + this.composicao + "'" +
								",DepositoDestino=" + "'" + this.depositoDestino + "'" +
								",DtInicio=" + "'" + this.DtInicioUpdate + "'" +
								",Etapa=" + "'" + this.Etapa + "'" +
								",HrInicio=" + "'" + this.HrInicioUpdate + "')";
			me = this;
			apiConnector.updateModel(stringParam, oEntry,
				function(oData, oResponse) {
					dialog.setBusy(false);
					dialog.close();
					dialog.destroy();
					me.getListaViagensBackend();
					if (oResponse.statusCode === 204) {
						sap.m.MessageToast.show("Operação realizada com sucesso");
					}
				},
				function(err) {
					sap.m.MessageToast.show(err.response.body.substr(err.response.body.search("value") + 8, 
											err.response.body.search("innererror") - err.response.body.search("value") - 12));
					dialog.setBusy(false);
				});
		},
		
		updateStepItem: function(me) {

			var dialog = me.getSource().getParent();
			dialog.setBusyIndicatorDelay(1);
			dialog.setBusy(true);

			var oEntry = {};
			oEntry.CentroOrigem = this.centroOrigem;
			oEntry.CentroDestino = this.centroDestino;
			oEntry.DepositoDestino = this.depositoDestino;
			oEntry.Etapa = this.Etapa;
			oEntry.Composicao = this.composicao;
			var mes  = sap.ui.getCore().byId("DtInicio").getValue().split("/")[0];
			var dia  = sap.ui.getCore().byId("DtInicio").getValue().split("/")[1];
			var ano  = "20" + sap.ui.getCore().byId("DtInicio").getValue().split("/")[2];
			oEntry.DtInicio = ano + ("0"+mes).slice(-2) + ("0"+dia).slice(-2);
			oEntry.HrInicio = sap.ui.getCore().byId("HrInicio").getValue().substr(0, 2) + sap.ui.getCore().byId("HrInicio").getValue().substr(3, 2) + sap.ui.getCore().byId("HrInicio").getValue().substr(6, 2);
			mes  = sap.ui.getCore().byId("DtFim").getValue().split("/")[0];
			dia  = sap.ui.getCore().byId("DtFim").getValue().split("/")[1];
			ano  = "20" + sap.ui.getCore().byId("DtFim").getValue().split("/")[2];
			oEntry.DtFim = ano + ("0"+mes).slice(-2) + ("0"+dia).slice(-2);
			oEntry.HrFim = sap.ui.getCore().byId("HrFim").getValue().substr(0, 2) + sap.ui.getCore().byId("HrFim").getValue().substr(3, 2) + sap.ui.getCore().byId("HrFim").getValue().substr(6, 2);
			oEntry.Excluido = "";
			oEntry.Alterado = "X";
			
			me = this;
			var stringParam = "/ZET_VPWM_LISTA_ETAPAS_TRPSET" + 
								"(CentroDestino=" + "'" + this.centroDestino + "'" + 
								",CentroOrigem=" + "'" + this.centroOrigem + "'" +
								",Composicao=" + "'" + this.composicao + "'" +
								",DepositoDestino=" + "'" + this.depositoDestino + "'" +
								",DtInicio=" + "'" + this.DtInicioUpdate + "'" +
								",Etapa=" + "'" + this.Etapa + "'" +
								",HrInicio=" + "'" + this.HrInicioUpdate + "')";
			apiConnector.updateModel(stringParam, oEntry,
				function(oData, oResponse) {
					if (oResponse.statusCode === 204) {
						sap.m.MessageToast.show("Operação realizada com sucesso");
					}
					dialog.close();
					dialog.destroy();
					dialog.setBusy(false);
					me.getListaViagensBackend();
				},
				function(err) {
					dialog.setBusy(false);
					var bCompact = !!me.getView().$().closest(".sapUiSizeCompact").length;
					sap.m.MessageBox.error(
						err.response.body.substr(err.response.body.search("value") + 8, 
						err.response.body.search("innererror") - err.response.body.search("value") - 12),
						{
							styleClass: bCompact ? "sapUiSizeCompact" : ""
						}
					);
				});
		},
		
		getListaViagensBackend: function() {
			var me = this;

			this.byId("tabelaCiclo").setBusy(true);
			this.byId("cabViagem").setBusy(true);

			if (this.byId("tableMotoristas") !== undefined) {
				this.byId("tableMotoristas").setHeaderText(this.tituloDaLista);
			}

			this.byId("statusViagemGeral").setText(me.StatusText);
			if (this.Excluido === "X") {
				this.byId("statusViagemGeral").setIcon("sap-icon://alert");
				this.byId("statusViagemGeral").setState("Error");
			} else {
				this.byId("statusViagemGeral").setState(me.Status);
				if (this.Status === "Error") {
					this.byId("statusViagemGeral").setIcon("sap-icon://status-negative");
				} else {
					this.byId("statusViagemGeral").setIcon("sap-icon://hint");
				}
			}
					
			var oView = this.getView();
			var model = new sap.ui.model.json.JSONModel();
			model.setData({});
			oView.setModel(model, "viagem");

			var aFilter = [];
			aFilter.push(new sap.ui.model.Filter({
				path: "CentroOrigem",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: this.centroOrigem
			}));
			aFilter.push(new sap.ui.model.Filter({
				path: "CentroDestino",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: this.centroDestino
			}));
			aFilter.push(new sap.ui.model.Filter({
				path: "DepositoDestino",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: this.depositoDestino
			}));
			aFilter.push(new sap.ui.model.Filter({
				path: "CodMotorista",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: this.cdMotorista
			}));
			aFilter.push(new sap.ui.model.Filter({
				path: "DtInicio",
				operator: sap.ui.model.FilterOperator.GE,
				value1: this.dtInicio
			}));
			aFilter.push(new sap.ui.model.Filter({
				path: "HrInicio",
				operator: sap.ui.model.FilterOperator.GE,
				value1: this.hrInicio
			}));
			aFilter.push(new sap.ui.model.Filter({
				path: "DtFim",
				operator: sap.ui.model.FilterOperator.LE,
				value1: this.dtFim
			}));
			aFilter.push(new sap.ui.model.Filter({
				path: "HrFim",
				operator: sap.ui.model.FilterOperator.LE,
				value1: this.hrFim
			}));
			aFilter.push(new sap.ui.model.Filter({
				path: "Composicao",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: this.composicao
			}));
			aFilter.push(new sap.ui.model.Filter({
				path: "Viagem",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: this.viagem
			}));

			var stringParam = "/ZET_VPWM_LISTA_ETAPAS_TRPSET";
			apiConnector.consumeModel(stringParam, aFilter, {},
				function(oData, oResponse) {
					model.setData(oData);
					oView.setModel(model);
					me.byId("tabelaCiclo").setBusy(false);
					me.byId("cabViagem").setBusy(false);
				},
				function(err) {
					sap.m.MessageToast.show(err.response.body.substr(err.response.body.search("value") + 8, 
											err.response.body.search("innererror") - err.response.body.search("value") - 12));
					me.byId("tabelaCiclo").setBusy(false);
					me.byId("cabViagem").setBusy(false);
				});
		},
		onSetRowCount: function(oEvent) {
			this.byId("tabelaCiclo").setVisibleRowCountMode(oEvent.getSource().getProperty("key"));
			switch (oEvent.getSource().getProperty("key")) {
				case "Fixed":
					if(this.getView().getModel()) {
						this.byId("tabelaCiclo").setVisibleRowCount(this.getView().getModel().getProperty('/').results.length);
					}
				case "Auto":
					this.byId("tabelaCiclo").setMinAutoRowCount(5);
					break;
			}
		},
		createColumnConfig: function() {
			return [
			{
				label: "Status",
				property: "Status",
				type: "String"
			},{
				label: "Texto Status",
				property: "StatusText",
				type: "String"
			},{
				label: "Motorista",
				property: "NomeMotorista",
				width: "25"
			},{
				label: "Usuário",
				property: "UsuarioMot",
				type: "String"
			},{
				label: "Cod.WAS.Motorista",
				property: "CodMotorista",
				type: "String"
			}, {
				label: "Composição",
				property: "Composicao",
				type: "String"
			}, {
				label: "Placa Cavalo",
				property: "PlcCavalo",
				type: "String"
			}, {
				label: "Placa Carreta 1",
				property: "PlcCarr1",
				type: "String"
			}, {
				label: "Placa Carreta 2",
				property: "PlcCarr2",
				type: "String"
			},{
				label: "Centro Origem",
				property: "CentroOrigem",
				type: "String"
			}, {
				label: "Origem",
				property: "Des_Origem",
				type: "String"
			},{
				label: "Centro Destino",
				property: "CentroDestino",
				type: "String"
			},{
				label: "Depósito Destino",
				property: "DepositoDestino",
				type: "String"
			}, {
				label: "Destino",
				property: "Des_Destino",
				type: "String"
			},{
				label: "Tipo Etapa",
				property: "TpEtapa",
				type: "String"
			},{
				label: "Etapa",
				property: "Etapa",
				type: "String"
			}, {
				label: "Descr. Etapa",
				property: "DescrEtapa",
				type: "String"
			},{
				label: "Data Início",
				property: "DtInicio",
				type: "String"
			},{
				label: "Hora Início",
				property: "HrInicio",
				type: "String"
			},{
				label: "Data Fim",
				property: "DtFim",
				type: "String"
			},{
				label: "Hora Fim",
				property: "HrFim",
				type: "String"
			},{
				label: "Data Sistema",
				property: "DataSist",
				type: "String"
			},{
				label: "Hora Sistema",
				property: "HoraSist",
				type: "String"
			}, {
				label: "Meta Etapa",
				property: "MetaEtapa",
				type: "String"
			}, {
				label: "Tempo Minutos",
				property: "TempoMin",
				type: "String"
			}, {
				label: "Tempo Total Minutos",
				property: "TempoTotMin",
				type: "String"
			},{
				label: "OC/Item",
				property: "OcItem",
				type: "String"
			},{
				label: "NF-e",
				property: "NfSerie",
				type: "String"
			},{
				label: "Remessa",
				property: "Remessa",
				type: "String"
			},{
				label: "Cód. Viagem",
				property: "ViagemRet",
				type: "String"
			},{
				label: "Observações",
				property: "Message",
				type: "String"
			},{
				label: "Ciclo Alterado",
				property: "Alterado",
				type: "String"
			},{
				label: "Ciclo Excluído",
				property: "Excluido",
				type: "String"
			},{
				label: "Usuário Última Modificação",
				property: "UsUltMod",
				type: "String"
			},{
				label: "Data Última Modificação",
				property: "DtUltMod",
				type: "String"
			},{
				label: "Hora Última Modificação",
				property: "HrUltMod",
				type: "String"
			}];
		},

		onExportTabelaCiclo: function() {
			if (this.getView().getModel()) {

				var aCols, aProducts, oSettings, oSheet;

				aCols = this.createColumnConfig();
				aProducts = this.getView().getModel().getProperty('/').results; //this.getView().getModel("undefined").oData;

				oSettings = {
					workbook: {
						columns: aCols
					},
					dataSource: aProducts,
					fileName: "DetalheCiclo_" + Date()
				};

				oSheet = new sap.ui.export.Spreadsheet(oSettings);
				oSheet.build()
				    .then( function() {
  						sap.m.MessageToast.show("Planilhar exportada com sucesso");
				    })
				    .catch( function(sMessage) {
  						sap.m.MessageToast.show("Erro ao exportar: " + sMessage);
				    })
					.finally(function() {
						oSheet.destroy();
					});
			} else {
				sap.m.MessageToast.show("Não há dados para exportar");
			}
		}
	});
});