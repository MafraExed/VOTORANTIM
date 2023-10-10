/*global location */
sap.ui.define([
	"Y5GL_SOL_FER/Y5GL_SOL_FER/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"Y5GL_SOL_FER/Y5GL_SOL_FER/model/formatter",
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/m/Text',
	'sap/ui/core/Fragment'

], function (BaseController, JSONModel, formatter, Dialog, Button, Text, Fragment) {
	"use strict";

	//Global Variables
	var i;
	var s;
	var n;
	var d;
	var l;
	var g;
	var u;
	var c;
	var V;
	var I;
	var h;
	var f;
	var v;
	var p;
	var w;
	var y;
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
	var LblStatus;
	var Status;

	return BaseController.extend("Y5GL_SOL_FER.Y5GL_SOL_FER.controller.Detail", {

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
				if (!sObjectPath) {

				};
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
			var ValidNum;

			if (vdays === "") {
				vdays = "0";
			}

			ValidNum = !isNaN(vdays);
			if (ValidNum === true) {
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

			} else {
				sap.m.MessageBox.error("O valor informado deverá ser um número.", {
					actions: ["OK", sap.m.MessageBox.Action.CLOSE],
					onClose: function (sAction) {
						that.getView().byId("first_diasgozo").setValue();
					}
				});
			}
		},
		somardatasecon: function () {
			var that = this;
			var vdata2 = this.getView().byId("IdInicio2").getValue();
			var vdays2 = this.getView().byId("secon_diasgozo").getValue();
			var ValidNum2;

			if (vdays2 === "") {
				vdays2 = "0";
			}

			ValidNum2 = !isNaN(vdays2);
			if (ValidNum2 === true) {
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
			} else {
				sap.m.MessageBox.error("O valor informado deverá ser um número.", {
					actions: ["OK", sap.m.MessageBox.Action.CLOSE],
					onClose: function (sAction) {
						that.getView().byId("secon_diasgozo").setValue();
					}
				});
			}
		},
		somardatathird: function () {
			var that = this;
			var vdata = this.getView().byId("IdInicio3").getValue();
			var vdays = this.getView().byId("third_diasgozo").getValue();
			var ValidNum;

			if (vdays === "") {
				vdays = "0";
			}

			ValidNum = !isNaN(vdays);
			if (ValidNum === true) {
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

			} else {
				sap.m.MessageBox.error("O valor informado deverá ser um número.", {
					actions: ["OK", sap.m.MessageBox.Action.CLOSE],
					onClose: function (sAction) {
						that.getView().byId("third_diasgozo").setValue();
					}
				});
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

		validacaracter: function (value) {

			var caracter = this.getView().byId("first_diasgozo").getValue();

			var regra = /^[0-9]+$/;
			if (caracter.match(regra)) {
				if (caracter.length > 2) {
					var setThis = caracter.slice(0, 2);
					this.getView().byId("first_diasgozo").setValue(setThis);
				}
				if (caracter.length < 2) {
					this.somardatafirst();
				}
				this.somardatafirst();
			} else {
				var zero = caracter.slice(0, 0);
				this.getView().byId("first_diasgozo").setValue(zero);
				this.somardatafirst();
			}
			if (zero.length === 0) {
				this.getView().byId("IdFim1").setValue("");
			}

		},

		validasecon: function (value) {

			var caracter = this.getView().byId("secon_diasgozo").getValue();

			var regra = /^[0-9]+$/;
			if (caracter.match(regra)) {
				if (caracter.length > 2) {
					var setThis = caracter.slice(0, 2);
					this.getView().byId("secon_diasgozo").setValue(setThis);
				}
				if (caracter.length < 2) {
					this.somardatasecon();
				}
				this.somardatasecon();
			} else {
				var zero = caracter.slice(0, 0);
				this.getView().byId("secon_diasgozo").setValue(zero);
				this.somardatasecon();
			}
			if (zero.length === 0) {
				this.getView().byId("IdFim2").setValue("");
			}

		},

		validathird: function (value) {

			var caracter = this.getView().byId("third_diasgozo").getValue();

			var regra = /^[0-9]+$/;
			if (caracter.match(regra)) {
				if (caracter.length > 2) {
					var setThis = caracter.slice(0, 2);
					this.getView().byId("third_diasgozo").setValue(setThis);
				}
				if (caracter.length < 2) {
					this.somardatathird();
				}
				this.somardatathird();
			} else {
				var zero = caracter.slice(0, 0);
				this.getView().byId("third_diasgozo").setValue(zero);
				this.somardatathird();
			}
			if (zero.length === 0) {
				this.getView().byId("IdFim3").setValue("");
			}

		},

		onSave: function () {
			var e = this;
			var t = this.getOwnerComponent();
			//	var a = t.oListSelector._oList;
			//	var r = a.getBinding("items");
			var n = this.getView().getModel();
			var d = this.getView().byId("IdIndex").getValue();
			var l = this.getView().byId("IdPernr").getValue();
			var Abono1 = this.getView().byId("first_abono").getSelected();
			var SolParc131 = this.getView().byId("first_13").getSelected();
			var g = "/ZET_GLHR_SALVARSet(Index=" + d + ",Pernr='" + l + "')";
			var u = {};
			var c = "";

			//1º Período
			u.Pernr = this.getView().byId("IdPernr").getValue();
			u.Inicio1 = this.getView().byId("IdInicio1").getValue();
			u.DiasGozo1 = this.getView().byId("first_diasgozo").getValue();
			u.Fim1 = this.getView().byId("IdFim1").getValue();

			//abono
			if (this.getView().byId("first_abono").getSelected() === true) {
				u.Abono1 = "X";
				u.DiasAbono1 = "10";
			} else {
				u.Abono1 = " ";
			}

			//13
			if (this.getView().byId("first_13").getSelected() === true) {
				u.SolParc131 = "X";

			} else {
				u.SolParc131 = " ";
			}

			//2º Período
			u.Inicio2 = this.getView().byId("IdInicio2").getValue();
			u.DiasGozo2 = this.getView().byId("secon_diasgozo").getValue();
			u.Fim2 = this.getView().byId("IdFim2").getValue();
			if (u.DiasGozo2 > 0) {
				c = "2º Período";
			}
			//3º Período
			u.Inicio3 = this.getView().byId("IdInicio3").getValue();
			u.DiasGozo3 = this.getView().byId("third_diasgozo").getValue();
			u.Fim3 = this.getView().byId("IdFim3").getValue();
			if (u.DiasGozo3 > 0) {
				c = "3º Período";
			}

			var V = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: "Deseja enviar a solicitação de Férias?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						n.update(g, u, {
							success: function (t, a) {

								var s = a.headers["sap-message"];
								if (s == "" || s == null || s == "   .") {
									e.refreshProgram();
									sap.m.MessageBox.alert("Suas Férias foram programadas com Sucesso!! Aguarde a aprovação!");
									return;
								} else
									var i = JSON.parse(s);
								var o = i.details.length;
								var r = 0;
								var n;
								sap.m.MessageBox.alert(i.message, {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function (t) {
										if (i.code === "ZA/000") {
											e.refreshProgram();
										}
									}
								});
							}
						});
						V.close();
					}
				}),
				endButton: new Button({
					text: "Não",
					press: function () {
						V.close();
					}
				}),
				afterClose: function () {
					V.destroy();
				}
			});
			V.open();

		},

		refreshProgram: function () {
			var e = this.getView().byId("IdIndex").getValue();
			var t = this.getView().byId("IdPernr").getValue();
			var a = new sap.ui.model.json.JSONModel;
			var s = "/sap/opu/odata/sap/ZGWGLHR_FERIAS_ESS_SRV/ZET_GLHR_PROGRAMARSet(Pernr='" + t + "',Index=" + e + ")";
			a.loadData(s, null, false, "GET", false, false, null);
			n = a.oData.d.DiasGozo1;
			d = a.oData.d.Inicio1;
			l = a.oData.d.Fim1;
			c = a.oData.d.DiasGozo2;
			f = a.oData.d.Inicio2;
			e = a.oData.d.Fim2;
			var x = a.oData.d.DiasGozo3;
			var z = a.oData.d.Inicio3;
			var q = a.oData.d.Fim3;
			g = a.oData.d.StatusTxt1;
			h = a.oData.d.StatusTxt2;
			i = a.oData.d.StatusTxt3;
			var j = a.oData.d.LabelStatus;
			this.getView().byId("first_diasgozo").setValue(n);
			this.getView().byId("IdInicio1").setValue(d);
			this.getView().byId("IdFim1").setValue(l);
			this.getView().byId("secon_diasgozo").setValue(c);
			this.getView().byId("IdInicio2").setValue(f);
			this.getView().byId("IdFim2").setValue(e);
			this.getView().byId("third_diasgozo").setValue(x);
			this.getView().byId("IdInicio3").setValue(z);
			this.getView().byId("IdFim3").setValue(q);
			this.getView().byId("first_status").setText(g);
			this.getView().byId("secon_status").setText(h);
			this.getView().byId("third_status").setText(i);
			this.getView().byId("LblStatus").setText(j);
			switch (g) {
			case "Em aberto":
				this.getView().byId("first_status").setState("Error");

				break;
			case "Em aprovação":
				this.getView().byId("first_status").setState("Warning");

				break;
			case "Aprovado":
				this.getView().byId("first_status").setState("Success");

				break;
			default:
				this.getView().byId("first_status").setState("Success");
			}
			switch (h) {
			case "Em aberto":
				this.getView().byId("secon_status").setState("Error");
				break;
			case "Em aprovação":
				this.getView().byId("secon_status").setState("Warning");
				break;
			case "Aprovado":
				this.getView().byId("secon_status").setState("Success");
				break;
			default:
				this.getView().byId("secon_status").setState("Success");
			}
			switch (i) {
			case "Em aberto":
				this.getView().byId("third_status").setState("Error");
				break;
			case "Em aprovação":
				this.getView().byId("third_status").setState("Warning");
				break;
			case "Aprovado":
				this.getView().byId("third_status").setState("Success");
				break;
			default:
				this.getView().byId("third_status").setState("Success");
			}
			switch (j) {
			case "Status: Em aberto":
				this.getView().byId("LblStatus").setState("Error");
				break;
			case "Status: Em aprovação":
				this.getView().byId("LblStatus").setState("Warning");
				break;
			case "Status: Aprovado":
				this.getView().byId("LblStatus").setState("Success");
				break;
			default:
				this.getView().byId("LblStatus").setState("Success");
			}
			
			d = a.oData.d.Inicio1;
			n = a.oData.d.DiasGozo1;
			l = a.oData.d.Fim1;
			c = a.oData.d.DiasGozo2;
			f = a.oData.d.Inicio2;
			e = a.oData.d.Fim2;
			var x = a.oData.d.DiasGozo3;
			var z = a.oData.d.Inicio3;
			var q = a.oData.d.Fim3;
			
			switch (d){
			case "":
				this.getView().byId("IdInicio1").setProperty("editable", true);
				this.getView().byId("first_diasgozo").setProperty("editable", true);
				break;
			 default:
				this.getView().byId("IdInicio1").setProperty("editable", false);
				this.getView().byId("first_diasgozo").setProperty("editable", false);
			}	
		
			switch (f){
			case "":
				this.getView().byId("IdInicio2").setProperty("editable", true);
				this.getView().byId("secon_diasgozo").setProperty("editable", true);
				break;
			 default:
				this.getView().byId("IdInicio2").setProperty("editable", false);
				this.getView().byId("secon_diasgozo").setProperty("editable", false);
			}
			
			switch (z){
			case "":
				this.getView().byId("IdInicio3").setProperty("editable", true);
				this.getView().byId("third_diasgozo").setProperty("editable", true);
				break;
			 default:
				this.getView().byId("IdInicio3").setProperty("editable", false);
				this.getView().byId("third_diasgozo").setProperty("editable", false);
			}
		
			
		},

		refreshProgramCancel: function () {
			var e = this.getView().byId("IdIndex").getValue();
			var t = this.getView().byId("IdPernr").getValue();
			var a = new sap.ui.model.json.JSONModel;
			var s = "/sap/opu/odata/sap/ZGWGLHR_FERIAS_ESS_SRV/ZET_GLHR_PROGRAMARSet(Pernr='" + t + "',Index=" + e + ")";
			a.loadData(s, null, false, "GET", false, false, null);
			n = a.oData.d.DiasGozo1;
			d = a.oData.d.Inicio1;
			l = a.oData.d.Fim1;
			c = a.oData.d.DiasGozo2;
			f = a.oData.d.Inicio2;
			e = a.oData.d.Fim2;
			var x = a.oData.d.DiasGozo3;
			var z = a.oData.d.Inicio3;
			var q = a.oData.d.Fim3;
			g = a.oData.d.StatusTxt1;
			h = a.oData.d.StatusTxt2;
			i = a.oData.d.StatusTxt3;
			var j = a.oData.d.LabelStatus;
			this.getView().byId("first_diasgozo").setValue(n);
			this.getView().byId("IdInicio1").setValue(d);
			this.getView().byId("IdFim1").setValue(l);
			this.getView().byId("secon_diasgozo").setValue(c);
			this.getView().byId("IdInicio2").setValue(f);
			this.getView().byId("IdFim2").setValue(e);
			this.getView().byId("third_diasgozo").setValue(x);
			this.getView().byId("IdInicio3").setValue(z);
			this.getView().byId("IdFim3").setValue(q);
			this.getView().byId("first_status").setText(g);
			this.getView().byId("secon_status").setText(h);
			this.getView().byId("third_status").setText(i);
			this.getView().byId("LblStatus").setText(j);
			switch (g) {
			case "Em aberto":
				this.getView().byId("first_status").setState("Error");

				break;
			case "Em aprovação":
				this.getView().byId("first_status").setState("Warning");

				break;
			case "Aprovado":
				this.getView().byId("first_status").setState("Success");

				break;
			default:
				this.getView().byId("first_status").setState("Success");
			}
			switch (h) {
			case "Em aberto":
				this.getView().byId("secon_status").setState("Error");
				break;
			case "Em aprovação":
				this.getView().byId("secon_status").setState("Warning");
				break;
			case "Aprovado":
				this.getView().byId("secon_status").setState("Success");
				break;
			default:
				this.getView().byId("secon_status").setState("Success");
			}
			switch (i) {
			case "Em aberto":
				this.getView().byId("third_status").setState("Error");
				break;
			case "Em aprovação":
				this.getView().byId("third_status").setState("Warning");
				break;
			case "Aprovado":
				this.getView().byId("third_status").setState("Success");
				break;
			default:
				this.getView().byId("third_status").setState("Success");
			}
			switch (j) {
			case "Status: Em aberto":
				this.getView().byId("LblStatus").setState("Error");
				break;
			case "Status: Em aprovação":
				this.getView().byId("LblStatus").setState("Warning");
				break;
			case "Status: Aprovado":
				this.getView().byId("LblStatus").setState("Success");
				break;
			default:
				this.getView().byId("LblStatus").setState("Success");
			}
			
			switch (d){
			case "":
				this.getView().byId("IdInicio1").setProperty("editable", true);
				this.getView().byId("first_diasgozo").setProperty("editable", true);
				break;
			 default:
				this.getView().byId("IdInicio1").setProperty("editable", false);
				this.getView().byId("first_diasgozo").setProperty("editable", false);
			}	
		
			switch (f){
			case "":
				this.getView().byId("IdInicio2").setProperty("editable", true);
				this.getView().byId("secon_diasgozo").setProperty("editable", true);
				break;
			 default:
				this.getView().byId("IdInicio2").setProperty("editable", false);
				this.getView().byId("secon_diasgozo").setProperty("editable", false);
			}
			
			switch (z){
			case "":
				this.getView().byId("IdInicio3").setProperty("editable", true);
				this.getView().byId("third_diasgozo").setProperty("editable", true);
				break;
			 default:
				this.getView().byId("IdInicio3").setProperty("editable", false);
				this.getView().byId("third_diasgozo").setProperty("editable", false);
			}
			
			
			
			

		},

		onCancel: function (oEvent) {
			var vthat = this;
			//var _oComponent = this.getOwnerComponent();
			//var oList = _oComponent.oListSelector._oList;
			//var oListBinding = oList.getBinding("items");
			var oModel = this.getView().getModel();
			var Index = this.getView().byId("IdIndex").getValue();
			//	var Pernr = this.getView().byId("IdPernr").getValue();
			var Key = "/ZET_GLHR_CANCELAR(Index=" + Index + ")";
			var oEntry = {};

			vthat.getView().byId("Per1").setValue("");
			vthat.getView().byId("Per2").setValue("");
			vthat.getView().byId("Per3").setValue("");
			//Validação de valores para MessageBox
			//1º Período
			var FirstD = vthat.getView().byId("first_diasgozo").getValue();
			var FirstDti = vthat.getView().byId("IdInicio1").getValue();
			var FirstDtf = vthat.getView().byId("IdFim1").getValue();
			//2º Período
			var SecondD = vthat.getView().byId("secon_diasgozo").getValue();
			var SecondDti = vthat.getView().byId("IdInicio2").getValue();
			var SecondDtf = vthat.getView().byId("IdFim2").getValue();
			//3º Período
			var ThirdD = vthat.getView().byId("third_diasgozo").getValue();
			var ThirdDti = vthat.getView().byId("IdInicio3").getValue();
			var ThirdDtf = vthat.getView().byId("IdFim3").getValue();
			var Pertxt;

			//Marca o Flag
			if (FirstD > 0 && FirstDti != "" && FirstDtf != "") {
				vthat.getView().byId("Per1").setValue("X");
			}
			if (SecondD > 0 && SecondDti != "" && SecondDtf != "") {
				vthat.getView().byId("Per2").setValue("X");
			}
			if (ThirdD > 0 && ThirdDti != "" && ThirdDtf != "") {
				vthat.getView().byId("Per3").setValue("X");
			}

			//Valida Flag
			if (vthat.getView().byId("Per1").getValue() === "X" &&
				vthat.getView().byId("Per2").getValue() === "X" &&
				vthat.getView().byId("Per3").getValue() === "X") {
				var Pertxt = "1º Período";
			}
			if (vthat.getView().byId("Per1").getValue() === "" &&
				vthat.getView().byId("Per2").getValue() === "X" &&
				vthat.getView().byId("Per3").getValue() === "X") {
				var Pertxt = "2º Período";
			}
			if (vthat.getView().byId("Per1").getValue() === "" &&
				vthat.getView().byId("Per2").getValue() === "" &&
				vthat.getView().byId("Per3").getValue() === "X") {
				var Pertxt = "3º Período";
			}

			oEntry.Index = parseInt(this.getView().byId("IdIndex").getValue());

			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({

					text: "Confirma o cancelamento da solicitação de férias?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(Key, oEntry, {
							success: function (oData, oResponse) {

								if (oResponse.body === "") {
									vthat.refreshProgramCancel();
									sap.m.MessageBox.alert("Solicitação de férias canceladas com Sucesso!");
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

		FormatStatus: function (value) {

			if (value === 'Status: Disponível') {

				return "Success";

			}
			if (value === 'Status: Em programação') {

				return "Warning";

			}
			if (value === 'Status: Em aprovação') {

				return "Warning";

			}
			if (value === 'Status: Disponível') {

				return "Success";

			}
			if (value === 'Em programação') {

				return "Warning";

			}
			if (value === 'Status: Homologado') {

				return "Success";

			}
			if (value === 'Homologado') {

				return "Success";

			}
			if (value === 'Status: Em Aberto') {

				return "Success";

			}
			if (value === 'Em Aberto') {

				return "Success";

			}

			if (value === 'Status: Aprovado') {

				return "Success";

			}
			if (value === 'Aprovado') {

				return "Success";

			}

			if (value === 'Status: Em aprovação') {

				return "Warning";

			}
			if (value === 'Em aprovação') {

				return "Warning";

			}

			return "Error";

		},

		FormatEditable: function (value) {

			
			if (value === "" | value === '0' | value === null){
				return true;	
			}
			else
				return false;
			
			

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