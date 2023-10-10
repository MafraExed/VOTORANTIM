/*global location */
sap.ui.define([
	"ZVCRH_FERIAS_GESTOR/ZVCRH_FERIAS_GESTOR/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ZVCRH_FERIAS_GESTOR/ZVCRH_FERIAS_GESTOR/model/formatter",
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/m/Text',
	'sap/ui/core/Fragment',
	"sap/ui/Device",

], function(BaseController, JSONModel, formatter, Dialog, Button, Text, Fragment, Device) {
	"use strict";
	var v_Pernr;
	var v_Begda;
	var v_Seqnr;
	return BaseController.extend("ZVCRH_FERIAS_GESTOR.ZVCRH_FERIAS_GESTOR.controller.Detail", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function() {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0
			});

			//this.getRouter().getRoute("object")F.attachPatternMatched(this._onObjectMatched, this);

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			this.setModel(oViewModel, "detailView");

			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onSendEmailPress: function() {
			var oViewModel = this.getModel("detailView");

			sap.m.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function() {
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

		_onObjectMatched: function(oEvent) {
			var Pernr = oEvent.getParameter("arguments").Pernr;
			this.vPernr = oEvent.getParameter("arguments").Pernr;
			this.vBegda = oEvent.getParameter("arguments").LabelPeriodo;
			this.vSeqnr = oEvent.getParameter("arguments").Seqnr;

			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("ZET_VCHR_MSS_DETALHE", {
					Pernr: Pernr,
					Begda: "",
					Seqnr: ""
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));

		},

		onVoltar: function() {

			this.getRouter().navTo("master");

		},

		onSelectionChange: function(oEvent) {

			var oList = oEvent.getSource(),
				bSelected = oEvent.getParameter("selected");

			//		var datax = oEvent.getSource().getBindingContext();

			//	this.v_Pernr = datax.sPath.substring(48, 56);

			//	this.v_Begda = datax.sPath.substring(29, 39);

			// skip navigation when deselecting an item in multi selection mode
			if (!(oList.getMode() === "MultiSelect" && !bSelected)) {
				// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
				this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
				//	this._showDetail();
			}

		},

		/*	_showDetail: function() {
					var that = this;
					var bReplace = !Device.system.phone;
					
					this.getRouter().navTo("object2", {
						//	Pernr: oItem.getBindingContext().getProperty("Pernr"),
						//	Begda: oItem.getBindingContext().getProperty("Begda")
						//Pernr: that.v_Pernr,
						//Begda: that.v_Begda

					}, bReplace);
				},*/

		_showDetail: function(oItem) {
			var bReplace = !Device.system.phone;
			var Pernr = oItem.getBindingContext().getProperty("Pernr");
			var IdBegda = oItem.getBindingContext().getProperty("Begda");
			var Seqnr = oItem.getBindingContext().getProperty("Seqnr");

			// set the layout property of FCL control to show two columns
			this.getRouter().navTo("object2", {
				Pernr: Pernr,
				Begda: IdBegda,
				Seqnr: Seqnr
			}, bReplace);
		},

		_bindView: function(sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("detailView");

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function() {
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

			var list = this.getView().byId("list");
			var Pernr = this.getView().byId("IdPernr").getValue();

			var oFilter = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr);
			var binding = list.getBinding("items");
			binding.filter(oFilter);
			/*		list.getBinding("items").filter([oFilter, oFilter2]);
					this._oListSelector = this.getOwnerComponent().oListSelector;
					this._oListSelector.setBoundMasterList(list);*/

		},

		_onMetadataLoaded: function() {
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
		onCloseDetailPress: function() {
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
			// No item should be selected on master after detail page is closed
			this.getOwnerComponent().oListSelector.clearMasterListSelection();
			this.getRouter().navTo("master");
		},

		/**
		 * Toggle between full and non full screen mode.
		 */
		toggleFullScreen: function() {
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

		somardatafirst: function() {
			var that = this;
			var vdata = this.getView().byId("IdInicio1").getValue();
			var vdays = this.getView().byId("first_diasgozo").getValue();
			if (vdays > 0) {
				var resultado = "";

				var Key = "/sap/opu/odata/sap/ZGWVCHR_FERIAS_ESS_SRV/ZET_VCRH_CALC_DAYS(V_DATA='" + vdata + "',V_DIAS='" + vdays + "')";
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
		somardatasecon: function() {
			var that = this;
			var vdata2 = this.getView().byId("IdInicio2").getValue();
			var vdays2 = this.getView().byId("secon_diasgozo").getValue();
			if (vdays2 > 0) {
				var resultado = "";

				var Key2 = "/sap/opu/odata/sap/ZGWVCHR_FERIAS_ESS_SRV/ZET_VCRH_CALC_DAYS(V_DATA='" + vdata2 + "',V_DIAS='" + vdays2 + "')";
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
		somardatathird: function() {
			var that = this;
			var vdata = this.getView().byId("IdInicio3").getValue();
			var vdays = this.getView().byId("third_diasgozo").getValue();
			if (vdays > 0) {
				var resultado = "";

				var Key = "/sap/opu/odata/sap/ZGWVCHR_FERIAS_ESS_SRV/ZET_VCRH_CALC_DAYS(V_DATA='" + vdata + "',V_DIAS='" + vdays + "')";
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
		somardata: function() {
			var that = this;
			var vdata = this.getView().byId("IdBegfe").getValue();
			var vdays = this.getView().byId("IdDiasGo").getValue();
			if (vdays > 0) {
				var resultado = "";

				var Key = "/sap/opu/odata/sap/ZGWVCHR_FERIAS_ESS_SRV/ZET_VCRH_CALC_DAYS(V_DATA='" + vdata + "',V_DIAS='" + vdays + "')";
				var oModel = new sap.ui.model.json.JSONModel();
				var oEntry = {};

				oEntry.vdata = this.getView().byId("IdBegfe").getValue();
				oEntry.vdays = this.getView().byId("IdDiasGo").getValue();

				oModel.loadData(Key, null, false, "GET", false, false, null);

				var vdate = oModel.oData.d.V_RESULTADO;

				var DataFim = that.getView().byId("IdEndfe");
				DataFim.setValue(vdate);
			}
		},

		onAprov: function() {

			var _oComponent = this.getOwnerComponent();
			var oList = _oComponent.oListSelector._oList;
			var oListBinding = oList.getBinding("items");
			var oModel = this.getView().getModel();
			var Begda = this.getView().byId("IdBegda").getValue();
			var Endda = this.getView().byId("IdEndda").getValue();
			var Pernr = this.getView().byId("IdPernr").getValue();
			var Seqnr = this.getView().byId("IdSeqnr").getValue();
			var Key = "/ZET_VCHR_MSS_APROVAR(Begda='" + Begda + "',Endda='" + Endda + "',Pernr='" + Pernr + "',Seqnr='" + Seqnr + "')";
			var oEntry = {};
			oEntry.Begda = this.getView().byId("IdBegda").getValue();
			oEntry.Endda = this.getView().byId("IdEndda").getValue();
			oEntry.Pernr = this.getView().byId("IdPernr").getValue();
			oEntry.Seqnr = this.getView().byId("IdSeqnr").getValue();
			oEntry.Begfe = this.getView().byId("IdBegfe").getValue();
			oEntry.DiasGozo = this.getView().byId("IdDiasGo").getValue();
			oEntry.Endfe = this.getView().byId("IdEndfe").getValue();
			//	oEntry.Pg131 = this.getView().byId("IdPg131").getSelected();
			//	oEntry.Abono = this.getView().byId("IdAbono").getSelected();
			//oEntry.Status = this.getView().byId("IdStatus").getValue();
			oEntry.Msg = this.getView().byId("IdMsg").getValue();
			oEntry.DiasAbono = this.getView().byId("IdDiasAb").getValue();
			oEntry.CodStatus = this.getView().byId("IdCodStts").getValue();

			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: "Confirma aprovação de férias?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function() {
						oModel.update(Key, oEntry, {
							success: function(oData, oResponse) {
								var hdrMessage = oResponse.headers["sap-message"];
								var hdrMessageObject = JSON.parse(hdrMessage);
								var length = hdrMessageObject.details.length;
								var i = 0;
								var sTexto;

								if (hdrMessageObject.message === "") {
									sap.m.MessageBox.error("Férias aprovadas com Sucesso!");
									return;
								}

								sap.m.MessageBox.alert(hdrMessageObject.message, {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function(sAction) {

									}

								});

							},

						});
						dialog.close();
					}
				}),
				endButton: new Button({
					text: "Não",
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();

					this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
				}
			});

			dialog.open();

		},

		onReprov: function() {

			var _oComponent = this.getOwnerComponent();
			var oList = _oComponent.oListSelector._oList;
			var oListBinding = oList.getBinding("items");
			var oModel = this.getView().getModel();
			var Begda = this.getView().byId("IdBegda").getValue();
			var Endda = this.getView().byId("IdEndda").getValue();
			var Pernr = this.getView().byId("IdPernr").getValue();
			var Seqnr = this.getView().byId("IdSeqnr").getValue();
			var Key = "/ZET_VCHR_MSS_REPROVAR(Begda='" + Begda + "',Endda='" + Endda + "',Pernr='" + Pernr + "',Seqnr='" + Seqnr + "')";
			var oEntry = {};
			oEntry.Begda = this.getView().byId("IdBegda").getValue();
			oEntry.Endda = this.getView().byId("IdEndda").getValue();
			oEntry.Pernr = this.getView().byId("IdPernr").getValue();
			oEntry.Seqnr = this.getView().byId("IdSeqnr").getValue();
			oEntry.Begfe = this.getView().byId("IdBegfe").getValue();
			oEntry.DiasGozo = this.getView().byId("IdDiasGo").getValue();
			oEntry.Endfe = this.getView().byId("IdEndfe").getValue();
			//	oEntry.Pg131 = this.getView().byId("IdPg131").getSelected();
			//	oEntry.Abono = this.getView().byId("IdAbono").getSelected();
			//oEntry.Status = this.getView().byId("IdStatus").getValue();
			oEntry.Msg = this.getView().byId("IdMsg").getValue();
			oEntry.DiasAbono = this.getView().byId("IdDiasAb").getValue();
			oEntry.CodStatus = this.getView().byId("IdCodStts").getValue();

			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: "Confirma Reprovação de férias?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function() {
						oModel.update(Key, oEntry, {
							success: function(oData, oResponse) {
								var hdrMessage = oResponse.headers["sap-message"];
								var hdrMessageObject = JSON.parse(hdrMessage);
								var length = hdrMessageObject.details.length;
								var i = 0;
								var sTexto;

								if (hdrMessageObject.message === "") {
									sap.m.MessageBox.error("Férias reprovadas com Sucesso!");
									return;
								}

								sap.m.MessageBox.alert(hdrMessageObject.message, {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function(sAction) {

									}

								});

							},

						});
						dialog.close();
					}
				}),
				endButton: new Button({
					text: "Não",
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();

					this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
				}
			});

			dialog.open();

		},

		onAlt: function() {

			var _oComponent = this.getOwnerComponent();
			var oList = _oComponent.oListSelector._oList;
			var oListBinding = oList.getBinding("items");
			var oModel = this.getView().getModel();
			var Begda = this.getView().byId("IdBegda").getValue();
			var Endda = this.getView().byId("IdEndda").getValue();
			var Pernr = this.getView().byId("IdPernr").getValue();
			var Seqnr = this.getView().byId("IdSeqnr").getValue();
			var Key = "/ZET_VCHR_MSS_ALTERAR(Begda='" + Begda + "',Endda='" + Endda + "',Pernr='" + Pernr + "',Seqnr='" + Seqnr + "')";
			var oEntry = {};
			oEntry.Begda = this.getView().byId("IdBegda").getValue();
			oEntry.Endda = this.getView().byId("IdEndda").getValue();
			oEntry.Pernr = this.getView().byId("IdPernr").getValue();
			oEntry.Seqnr = this.getView().byId("IdSeqnr").getValue();
			oEntry.Begfe = this.getView().byId("IdBegfe").getValue();
			oEntry.DiasGozo = this.getView().byId("IdDiasGo").getValue();
			oEntry.Endfe = this.getView().byId("IdEndfe").getValue();
			//	oEntry.Pg131 = this.getView().byId("IdPg131").getSelected();
			//	oEntry.Abono = this.getView().byId("IdAbono").getSelected();
			//oEntry.Status = this.getView().byId("IdStatus").getValue();
			oEntry.Msg = this.getView().byId("IdMsg").getValue();
			oEntry.DiasAbono = this.getView().byId("IdDiasAb").getValue();
			oEntry.CodStatus = this.getView().byId("IdCodStts").getValue();

			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: "Confirma Alteração de férias?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function() {
						oModel.update(Key, oEntry, {
							success: function(oData, oResponse) {
								var hdrMessage = oResponse.headers["sap-message"];
								var hdrMessageObject = JSON.parse(hdrMessage);
								var length = hdrMessageObject.details.length;
								var i = 0;
								var sTexto;

								if (hdrMessageObject.message === "") {
									sap.m.MessageBox.error("Alteração efetuada com Sucesso!");
									return;
								}

								sap.m.MessageBox.alert(hdrMessageObject.message, {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function(sAction) {

									}

								});

							},

						});
						dialog.close();
					}
				}),
				endButton: new Button({
					text: "Não",
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();

					this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
				}
			});

			dialog.open();

		},

		onProg: function() {

			var _oComponent = this.getOwnerComponent();
			var oList = _oComponent.oListSelector._oList;
			var oListBinding = oList.getBinding("items");
			var oModel = this.getView().getModel();
			var Begda = this.getView().byId("IdBegda").getValue();
			var Endda = this.getView().byId("IdEndda").getValue();
			var Pernr = this.getView().byId("IdPernr").getValue();
			var Seqnr = this.getView().byId("IdSeqnr").getValue();
			var Key = "/ZET_VCHR_MSS_PROGRAMAR(Begda='" + Begda + "',Endda='" + Endda + "',Pernr='" + Pernr + "',Seqnr='" + Seqnr + "')";
			var oEntry = {};
			oEntry.Begda = this.getView().byId("IdBegda").getValue();
			oEntry.Endda = this.getView().byId("IdEndda").getValue();
			oEntry.Pernr = this.getView().byId("IdPernr").getValue();
			oEntry.Seqnr = this.getView().byId("IdSeqnr").getValue();
			oEntry.Begfe = this.getView().byId("IdBegfe").getValue();
			oEntry.DiasGozo = this.getView().byId("IdDiasGo").getValue();
			oEntry.Endfe = this.getView().byId("IdEndfe").getValue();
			//oEntry.Pg131 = this.getView().byId("IdPg131").getSelected();
			//oEntry.Abono = this.getView().byId("IdAbono").getSelected();
			//oEntry.Status = this.getView().byId("IdStatus").getValue();
			oEntry.Msg = this.getView().byId("IdMsg").getValue();
			oEntry.DiasAbono = this.getView().byId("IdDiasAb").getValue();
			oEntry.CodStatus = this.getView().byId("IdCodStts").getValue();

			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: "Confirma Programação de férias?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function() {
						oModel.update(Key, oEntry, {
							success: function(oData, oResponse) {
								var hdrMessage = oResponse.headers["sap-message"];
								var hdrMessageObject = JSON.parse(hdrMessage);
								var length = hdrMessageObject.details.length;
								var i = 0;
								var sTexto;

								if (hdrMessageObject.message === "") {
									sap.m.MessageBox.error("Férias programadas com Sucesso!");
									return;
								}

								sap.m.MessageBox.alert(hdrMessageObject.message, {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function(sAction) {

									}

								});

							},

						});
						dialog.close();
					}
				}),
				endButton: new Button({
					text: "Não",
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();

					this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
				}
			});

			dialog.open();

		},

		onSave: function() {

			var _oComponent = this.getOwnerComponent();
			var oList = _oComponent.oListSelector._oList;
			var oListBinding = oList.getBinding("items");
			var oModel = this.getView().getModel();
			var Index = this.getView().byId("IdIndex").getValue();
			var Pernr = this.getView().byId("IdPernr").getValue();
			var Abono1 = this.getView().byId("first_abono").getSelected();
			//var Index = parseInt(Index);
			var Key = "/ZET_VCRH_SALVAR(Index=" + Index + ",Pernr='" + Pernr + "')";
			var oEntry = {};

			//1º Período
			oEntry.Pernr = this.getView().byId("IdPernr").getValue();
			oEntry.Inicio1 = this.getView().byId("IdInicio1").getValue();
			oEntry.DiasGozo1 = this.getView().byId("first_diasgozo").getValue();
			oEntry.Fim1 = this.getView().byId("IdFim1").getValue();
			//2º Período
			oEntry.Inicio2 = this.getView().byId("IdInicio2").getValue();
			oEntry.DiasGozo2 = this.getView().byId("secon_diasgozo").getValue();
			oEntry.Fim2 = this.getView().byId("IdFim2").getValue();
			//3º Período
			oEntry.Inicio3 = this.getView().byId("IdInicio3").getValue();
			oEntry.DiasGozo3 = this.getView().byId("third_diasgozo").getValue();
			oEntry.Fim3 = this.getView().byId("IdFim3").getValue();

			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: "Confirma programação de Férias?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function() {
						oModel.update(Key, oEntry, {
							success: function(oData, oResponse) {
								var hdrMessage = oResponse.headers["sap-message"];
								var hdrMessageObject = JSON.parse(hdrMessage);
								var length = hdrMessageObject.details.length;
								var i = 0;
								var sTexto;

								if (hdrMessageObject.message === "") {
									sap.m.MessageBox.error("Gravação efetuada com Sucesso!");
									return;
								}

								sap.m.MessageBox.alert(hdrMessageObject.message, {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function(sAction) {

									}

								});

							},

						});
						dialog.close();
					}
				}),
				endButton: new Button({
					text: "Não",
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();

					this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
				}
			});

			this.getRouter().navTo("master");
			dialog.open();

		},

		onCancel: function() {

			var _oComponent = this.getOwnerComponent();
			var oList = _oComponent.oListSelector._oList;
			var oListBinding = oList.getBinding("items");
			var oModel = this.getView().getModel();
			var Index = this.getView().byId("IdIndex").getValue();
			var Pernr = this.getView().byId("IdPernr").getValue();
			var Key = "/ZET_VCRH_CANCELAR(Index=" + Index + ",Pernr='" + Pernr + "')";
			var oEntry = {};

			oEntry.Index = this.getView().byId("IdIndex").getValue();

			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: "Confirma o cancelamento?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function() {
						oModel.update(Key, oEntry, {
							success: function(oData, oResponse) {
								var hdrMessage = oResponse.headers["sap-message"];
								var hdrMessageObject = JSON.parse(hdrMessage);
								var length = hdrMessageObject.details.length;
								var i = 0;
								var sTexto;

								if (hdrMessageObject.message === "") {
									sap.m.MessageBox.error("Gravação efetuada com Sucesso!");
									return;
								}

								sap.m.MessageBox.alert(hdrMessageObject.message, {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function(sAction) {
										this.getRouter().navTo("master");
									}
								});

							},

						});
						dialog.close();
					}
				}),
				endButton: new Button({
					text: "Não",
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
					oListBinding.refresh(true);

					this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
				}
			});
			dialog.open();
			this.getRouter().navTo("master");

		},

		_onAdd: function() {
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