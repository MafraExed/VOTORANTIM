/*global location */
sap.ui.define([
	"Y5GL_REC_FERI/Y5GL_REC_FERI/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"Y5GL_REC_FERI/Y5GL_REC_FERI/model/formatter",
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/m/Text',
	'sap/ui/core/Fragment'

], function (BaseController, JSONModel, formatter, Dialog, Button, Text, Fragment) {
	"use strict";

	//Global Variables
	var Dias1;
	var Inic1;
	var Fim1;
	var Sts1;
	var Dias2;
	var Inic2;
	var Fim2;
	var Sts2;
	var Dias3;
	var Inic3;
	var Fim3;
	var Sts3;
	var Abono;
	var F13;

	return BaseController.extend("Y5GL_REC_FERI.Y5GL_REC_FERI.controller.Detail", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0
			});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			this.setModel(oViewModel, "detailView");

			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));

		},

		onPrint: function () {
			this.getView().byId("FormChange480_12120").print();
			//window.print();
		},

		onSendEmailPress: function () {
			var oViewModel = this.getModel("detailView");

			sap.m.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},

		onShareInJamPress: function () {
			var oViewModel = this.getModel("detailView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});

			oShareDialog.open();
		},

		_onObjectMatched: function (oEvent) {
			var Pernr = oEvent.getParameter("arguments").Pernr;
			var Index = oEvent.getParameter("arguments").Index;

			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("ZET_GLHR_PROGRAMARSet", {
					//	Tipo: Tipo,
					Pernr: Pernr,
					Index: Index
						//	Objps: Objps
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));

		},

		onVoltar: function (oEvent) {

			this.getRouter().navTo("master");
		},

		_bindView: function (sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("detailView");

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function () {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}

		},

		_onMetadataLoaded: function () {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("detailView");

			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);

			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		},

		/**
		 * Set the full screen mode to false and navigate to master page
		 */
		onCloseDetailPress: function () {
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
			// No item should be selected on master after detail page is closed
			this.getOwnerComponent().oListSelector.clearMasterListSelection();
			this.getRouter().navTo("master");
		},

		/**
		 * Toggle between full and non full screen mode.
		 */
		toggleFullScreen: function () {
			var bFullScreen = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
			if (!bFullScreen) {
				// store current layout and go full screen
				this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
				this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
			} else {
				// reset to previous layout
				this.getModel("appView").setProperty("/layout", this.getModel("appView").getProperty("/previousLayout"));
			}
		},

		somardatafirst: function () {
			var that = this;
			var vdata = this.getView().byId("IdInicio1").getValue();
			var vdays = this.getView().byId("first_diasgozo").getValue();
			if (vdays > 0) {
				var resultado = "";

				var Key = "/sap/opu/odata/sap/ZGWGLHR_FERIAS_ESS_SRV/ZET_GLHR_CALC_DAYS(V_DATA='" + vdata + "',V_DIAS='" + vdays + "')";
				var oModel = new sap.ui.model.json.JSONModel();
				var oEntry = {};

				oEntry.vdata = this.getView().byId("IdInicio1").getValue();
				oEntry.vdays = this.getView().byId("first_diasgozo").getValue();

				oModel.loadData(Key, null, false, "GET", false, false, null);

				var vdate = oModel.oData.d.V_RESULTADO;

				var DataFim = that.getView().byId("IdFim1");
				DataFim.setValue(vdate);
			}
		},
		somardatasecon: function () {
			var that = this;
			var vdata2 = this.getView().byId("IdInicio2").getValue();
			var vdays2 = this.getView().byId("secon_diasgozo").getValue();
			if (vdays2 > 0) {
				var resultado = "";

				var Key2 = "/sap/opu/odata/sap/ZGWGLHR_FERIAS_ESS_SRV/ZET_GLHR_CALC_DAYS(V_DATA='" + vdata2 + "',V_DIAS='" + vdays2 + "')";
				var oModel = new sap.ui.model.json.JSONModel();
				var oEntry = {};

				oEntry.vdata2 = this.getView().byId("IdInicio2").getValue();
				oEntry.vdays2 = this.getView().byId("secon_diasgozo").getValue();

				oModel.loadData(Key2, null, false, "GET", false, false, null);

				var vdate2 = oModel.oData.d.V_RESULTADO;

				var DataFim2 = that.getView().byId("IdFim2");
				DataFim2.setValue(vdate2);
			}
		},
		somardatathird: function () {
			var that = this;
			var vdata = this.getView().byId("IdInicio3").getValue();
			var vdays = this.getView().byId("third_diasgozo").getValue();
			if (vdays > 0) {
				var resultado = "";

				var Key = "/sap/opu/odata/sap/ZGWGLHR_FERIAS_ESS_SRV/ZET_GLHR_CALC_DAYS(V_DATA='" + vdata + "',V_DIAS='" + vdays + "')";
				var oModel = new sap.ui.model.json.JSONModel();
				var oEntry = {};

				oEntry.vdata = this.getView().byId("IdInicio3").getValue();
				oEntry.vdays = this.getView().byId("third_diasgozo").getValue();

				oModel.loadData(Key, null, false, "GET", false, false, null);

				var vdate = oModel.oData.d.V_RESULTADO;

				var DataFim = that.getView().byId("IdFim3");
				DataFim.setValue(vdate);
			}
		},
		somardata: function (vata, vdias) {
			//This code was generated by the layout editor.
			var that = this;
			var oModel = this.getOwnerComponent().getModel("ferias_ess");
			var sFilter = "VDATA eq '" + vata + "' and VDIAS eq '" + vdias + "'";
			var sPath = "/ZET_GLHR_CALC_DAYS";
			oModel.read(sPath, {
				urlParameters: {
					"$filter": sFilter
				},
				async: false,
				success: function (oData, oResponse) {
					return oData.results[0].RESULTADO;
				},
				error: function () {
					sap.m.MessageToast.show("F\xE9rias n\xE3o encontradas!");
				}
			});
		},

		onSave: function () {
			var vthat = this;
			var _oComponent = this.getOwnerComponent();
			var oList = _oComponent.oListSelector._oList;
			var oListBinding = oList.getBinding("items");
			var oModel = this.getView().getModel();
			var Index = this.getView().byId("IdIndex").getValue();
			var Pernr = this.getView().byId("IdPernr").getValue();
			//var Abono1 = this.getView().byId("first_abono").getSelected();
			//var SolParc131 = this.getView().byId("first_13").getSelected();
			var Key = "/ZET_GLHR_SALVARSet(Index=" + Index + ",Pernr='" + Pernr + "')";
			var oEntry = {};
			var PerTxt = "";

			//1º Período
			oEntry.Pernr = this.getView().byId("IdPernr").getValue();
			oEntry.Inicio1 = this.getView().byId("IdInicio1").getValue();
			oEntry.DiasGozo1 = this.getView().byId("first_diasgozo").getValue();
			oEntry.Fim1 = this.getView().byId("IdFim1").getValue();

			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: "Deseja enviar a solicitação de Recesso Escolar?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(Key, oEntry, {
							success: function (oData, oResponse) {

								var hdrMessage = oResponse.headers["sap-message"];

								if (hdrMessage == "" || hdrMessage == null) {
									vthat.refreshProgram();
									sap.m.MessageToast.show("Período Recessivo de Férias programado com Sucesso!! Aguarde a aprovação!", {
										duration: 4000
									});
									return;
								}

								var hdrMessageObject = JSON.parse(hdrMessage);
								var length = hdrMessageObject.details.length;
								var i = 0;
								var sTexto;

								sap.m.MessageBox.alert(hdrMessageObject.message, {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function (sAction) {
										if (hdrMessageObject.code === "ZA/000") {
											vthat.refreshProgram();
										}
									}

								});

							},

						});
						dialog.close();

					}
				}),
				endButton: new Button({
					text: "Não",
					press: function () {
						dialog.close();
						//vthat.getRouter().navTo("master");
					}
				}),
				afterClose: function () {
					dialog.destroy();

				}
			});

			dialog.open();

		},

		refreshProgram: function () {
			var Index = this.getView().byId("IdIndex").getValue();
			var Pernr = this.getView().byId("IdPernr").getValue();

			var oModel_new = new sap.ui.model.json.JSONModel();

			var Refresh = "/sap/opu/odata/sap/ZGWGLHR_FERIAS_ESS_SRV/ZET_GLHR_PROGRAMARSet(Pernr='" + Pernr + "',Index=" + Index + ")";

			oModel_new.loadData(Refresh, null, false, "GET", false, false, null);

			//1º Período
			Dias1 = oModel_new.oData.d.DiasGozo1;
			Inic1 = oModel_new.oData.d.Inicio1;
			Fim1 = oModel_new.oData.d.Fim1;
			Sts1 = oModel_new.oData.d.StatusTxt1;

			//1º Período
			this.getView().byId("first_diasgozo").setValue(Dias1);
			this.getView().byId("IdInicio1").setValue(Inic1);
			this.getView().byId("IdFim1").setValue(Fim1);
			this.getView().byId("first_status").setText(Sts1);

			//Set color State in 1º
			switch (Sts1) {

			case "Em aberto":
				this.getView().byId("first_status").setState("Error");
				break;
			case "Em aprovação":
				this.getView().byId("first_status").setState("Warning");
				break;
			default:
				this.getView().byId("first_status").setState("Success");
			}

		},

		refreshProgramCancel: function () {
			var Index = this.getView().byId("IdIndex").getValue();
			var Pernr = this.getView().byId("IdPernr").getValue();

			var oModel_new = new sap.ui.model.json.JSONModel();

			var Refresh = "/sap/opu/odata/sap/ZGWGLHR_FERIAS_ESS_SRV/ZET_GLHR_PROGRAMARSet(Pernr='" + Pernr + "',Index=" + Index + ")";

			oModel_new.loadData(Refresh, null, false, "GET", false, false, null);

			//1º Período
			Dias1 = oModel_new.oData.d.DiasGozo1;
			Inic1 = oModel_new.oData.d.Inicio1;
			Fim1 = oModel_new.oData.d.Fim1;
			Sts1 = oModel_new.oData.d.StatusTxt1;

			//1º Período
			this.getView().byId("first_diasgozo").setValue(Dias1);
			this.getView().byId("IdInicio1").setValue(Inic1);
			this.getView().byId("IdFim1").setValue(Fim1);
			this.getView().byId("first_status").setText(Sts1);

			//Set color State in 1º
			switch (Sts1) {

			case "Em aberto":
				this.getView().byId("first_status").setState("Error");
				break;
			case "Em aprovação":
				this.getView().byId("first_status").setState("Warning");
				break;
			default:
				this.getView().byId("first_status").setState("Success");
			}

		},

		onCancel: function (oEvent) {
			var vthat = this;
			var _oComponent = this.getOwnerComponent();
			var oList = _oComponent.oListSelector._oList;
			var oListBinding = oList.getBinding("items");
			var oModel = this.getView().getModel();
			var Index = this.getView().byId("IdIndex").getValue();
			//	var Pernr = this.getView().byId("IdPernr").getValue();
			var Key = "/ZET_GLHR_CANCELAR(Index=" + Index + ")";
			var oEntry = {};

			vthat.getView().byId("Per1").setValue("");

			oEntry.Index = parseInt(this.getView().byId("IdIndex").getValue());

			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({

					text: "Confirma o cancelamento da Programação?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(Key, oEntry, {
							success: function (oData, oResponse) {

								if (oResponse.body === "") {
									vthat.refreshProgramCancel();
									sap.m.MessageToast.show("Programação cancelada com Sucesso!", {
										duration: 4000
									});
									//	vthat.getRouter().navTo("master");
									return;
								}

								var hdrMessage = oResponse.headers["sap-message"];
								var hdrMessageObject = JSON.parse(hdrMessage);
								var length = hdrMessageObject.details.length;
								var i = 0;
								var sTexto;
								sap.m.MessageBox.alert(hdrMessageObject.message, {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function (sAction) {

									}
								});

							},

						});
						dialog.close();
					}
				}),
				endButton: new Button({
					text: "Não",
					press: function () {
						dialog.close();
						//	vthat.getRouter().navTo("master");
					}
				}),
				afterClose: function () {
					dialog.destroy();
					//	this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
					//	vthat.getRouter().navTo("master");

				}
			});
			//	}
			dialog.open();

		},
		FormatChecked: function (value) {
			if (value === 'X') {

				return true;

			} else {

				return false;

			}

		},

		FormatChecked2: function (value) {
			if (value === 'X') {

				return true;

			} else {

				return false;

			}

		},

		onAfterRendering: function (evt) {
			//var abono = this.getView().byId("IdFavor").getValue();
		},

		_onAdd: function () {
			this.getView().byId("IdonAddDoc").setVisible(true);
			this.getView().byId("IdonEnviar").setVisible(true);

			this.getView().byId("IdonDoc").setVisible(false);
			this.getView().byId("IdonVoltar").setVisible(false);

			this.getView().byId("IdMsg").setVisible(false);

			this.getView().byId("IdParentesco").setValue();
			this.getView().byId("IdFavor").setValue();
			this.getView().byId("IdFanam").setValue();
			this.getView().byId("IdFgbdt").setValue();
			this.getView().byId("IdSexo").setValue();
			this.getView().byId("IdZzestciv").setValue();
		}

	});

});