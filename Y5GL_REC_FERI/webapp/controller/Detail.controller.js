sap.ui.define(["Y5GL_REC_FERI/Y5GL_REC_FERI/controller/BaseController", "sap/ui/model/json/JSONModel",
	"Y5GL_REC_FERI/Y5GL_REC_FERI/model/formatter", "sap/m/Dialog", "sap/m/Button", "sap/m/Text", "sap/ui/core/Fragment"
], function (e, t, a, s, i, o, r) {
	"use strict";
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
	var z;
	var f;
	var b;
	return e.extend("Y5GL_REC_FERI.Y5GL_REC_FERI.controller.Detail", {
		formatter: a,
		onInit: function () {
			var e = new t({
				busy: false,
				delay: 0
			});
			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			this.setModel(e, "detailView");
			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
			
			// Image loading
			var sRootPath = jQuery.sap.getModulePath("Y5GL_REC_FERI.Y5GL_REC_FERI");
			var sImagePath = sRootPath + "/imagens/CBA_Logo.gif";
			this.getView().byId("idimg").setSrc(sImagePath);
		},
		onPrint: function () {
			this.getView().byId("FormChange480_12120").print();
		},
		onSendEmailPress: function () {
			var e = this.getModel("detailView");
			sap.m.URLHelper.triggerEmail(null, e.getProperty("/shareSendEmailSubject"), e.getProperty("/shareSendEmailMessage"));
		},
		onShareInJamPress: function () {
			var e = this.getModel("detailView"),
				t = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: e.getProperty("/shareOnJamTitle")
						}
					}
				});
			t.open();
		},
		_onObjectMatched: function (e) {
			var t = e.getParameter("arguments").Pernr;
			var a = e.getParameter("arguments").Index;
			z = e.getParameter("arguments").Tipo;
			f = e.getParameter("arguments").Endda;
			b = e.getParameter("arguments").Begda;
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then(function () {
				var e = this.getModel().createKey("ZET_GLHR_PROGRAMARSet", {
					Pernr: t,
					Index: a,
					Endda: f,
					Begda: b
				});
				if (!e) {}
				this._bindView("/" + e);
			}.bind(this));
		},
		onVoltar: function (e) {
			this.getRouter().navTo("master");
		},
		_bindView: function (e) {
			var that = this;
			//var t = this.getModel("detailView");
			var oViewModel = this.getView().getModel();
			that.loading(false);
			this.getView().bindElement({
				path: e,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						that.loading(true);
					},
					dataReceived: function () {
						that.loading(false);
					}
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

		_onBindingChange: function () {
			var e = this.getView(),
				t = e.getElementBinding();
			if (!t.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}
		},
		_onMetadataLoaded: function () {
			var e = this.getView().getBusyIndicatorDelay(),
				t = this.getModel("detailView");
			t.setProperty("/delay", 0);
			t.setProperty("/busy", true);
			t.setProperty("/delay", e);
		},
		onCloseDetailPress: function () {
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
			this.getOwnerComponent().oListSelector.clearMasterListSelection();
			this.getRouter().navTo("master");
		},
		toggleFullScreen: function () {
			var e = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !e);
			if (!e) {
				this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
				this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
			} else {
				this.getModel("appView").setProperty("/layout", this.getModel("appView").getProperty("/previousLayout"));
			}
		},

		somardatafirst: function () {
			var e = this;
			var t = this.getView().byId("IdInicio1").getValue();
			var a = this.getView().byId("first_diasgozo").getValue();
			if (a > 0) {
				var s = "";
				var i = "/sap/opu/odata/sap/ZGWGLHR_FERIAS_ESS_SRV/ZET_GLHR_CALC_DAYS(V_DATA='" + t + "',V_DIAS='" + a + "')";
				var o = new sap.ui.model.json.JSONModel;
				var r = {};
				r.vdata = this.getView().byId("IdInicio1").getValue();
				r.vdays = this.getView().byId("first_diasgozo").getValue();
				o.loadData(i, null, false, "GET", false, false, null);
				var n = o.oData.d.V_RESULTADO;
				var d = e.getView().byId("IdFim1");
				d.setValue(n);
			}
		},
		somardatasecon: function () {
			var e = this;
			var t = this.getView().byId("IdInicio2").getValue();
			var a = this.getView().byId("secon_diasgozo").getValue();
			if (a > 0) {
				var s = "";
				var i = "/sap/opu/odata/sap/ZGWGLHR_FERIAS_ESS_SRV/ZET_GLHR_CALC_DAYS(V_DATA='" + t + "',V_DIAS='" + a + "')";
				var o = new sap.ui.model.json.JSONModel;
				var r = {};
				r.vdata2 = this.getView().byId("IdInicio2").getValue();
				r.vdays2 = this.getView().byId("secon_diasgozo").getValue();
				o.loadData(i, null, false, "GET", false, false, null);
				var n = o.oData.d.V_RESULTADO;
				var d = e.getView().byId("IdFim2");
				d.setValue(n);
			}
		},
		somardatathird: function () {
			var e = this;
			var t = this.getView().byId("IdInicio3").getValue();
			var a = this.getView().byId("third_diasgozo").getValue();
			if (a > 0) {
				var s = "";
				var i = "/sap/opu/odata/sap/ZGWGLHR_FERIAS_ESS_SRV/ZET_GLHR_CALC_DAYS(V_DATA='" + t + "',V_DIAS='" + a + "')";
				var o = new sap.ui.model.json.JSONModel;
				var r = {};
				r.vdata = this.getView().byId("IdInicio3").getValue();
				r.vdays = this.getView().byId("third_diasgozo").getValue();
				o.loadData(i, null, false, "GET", false, false, null);
				var n = o.oData.d.V_RESULTADO;
				var d = e.getView().byId("IdFim3");
				d.setValue(n);
			}
		},
		somardata: function (e, t) {
			var a = this;
			var s = this.getOwnerComponent().getModel("ferias_ess");
			var i = "VDATA eq '" + e + "' and VDIAS eq '" + t + "'";
			var o = "/ZET_GLHR_CALC_DAYS";
			s.read(o, {
				urlParameters: {
					$filter: i
				},
				async: false,
				success: function (e, t) {
					return e.results[0].RESULTADO;
				},
				error: function () {
					sap.m.MessageBox.alert("Férias não encontradas!");
				}
			});
		},
		onSave: function () {
			var e = this;
			var that = this;
			var t = this.getOwnerComponent();
			var a = t.oListSelector._oList;
			var r = a.getBinding("items");
			var n = this.getView().getModel();
			var d = this.getView().byId("IdIndex").getValue();
			var l = this.getView().byId("IdPernr").getValue();
			var g = "/ZET_GLHR_SALVARSet(Index=" + d + ",Pernr='" + l + "',Begda='" + b + "',Endda='" + f + "')";
			var u = {};
			var c = "";
			u.Pernr = this.getView().byId("IdPernr").getValue();
			u.Inicio1 = this.getView().byId("IdInicio1").getValue();
			u.DiasGozo1 = this.getView().byId("first_diasgozo").getValue();
			u.Fim1 = this.getView().byId("IdFim1").getValue();
			var V = new s({
				title: "Confirmação",
				type: "Message",
				content: new o({
					text: "Deseja enviar a solicitação de Recesso Escolar?"
				}),
				beginButton: new i({
					text: "Sim",
					press: function () {
						that.loading(true);
						n.update(g, u, {
							success: function (t, a) {
								var s = a.headers["sap-message"];
								if (s == "" || s == null) {
									sap.m.MessageBox.alert("Período Recessivo de Férias programado com Sucesso!! Aguarde a aprovação!");
									that.getView().getModel().refresh(true);
									return;
								}
								var i = JSON.parse(s);
								var o = i.details.length;
								var r = 0;
								var n;
								sap.m.MessageBox.alert(i.message, {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function (t) {
										if (i.code === "ZA/000") {
											that.getView().getModel().refresh(true);
										}
									}
								});
							}
						});
						V.close();
					}
				}),
				endButton: new i({
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
			g = a.oData.d.StatusTxt1;
			h = a.oData.d.LabelStatus;
			this.getView().byId("first_diasgozo").setValue(n);
			this.getView().byId("IdInicio1").setValue(d);
			this.getView().byId("IdFim1").setValue(l);
			this.getView().byId("first_status").setText(g);
			this.getView().byId("IdLabelStatus").setText(h);
			switch (g) {
			case "Em aberto":
				this.getView().byId("first_status").setState("Error");
				break;
			case "Em aprovação":
				this.getView().byId("first_status").setState("Warning");
				break;
			default:
				this.getView().byId("first_status").setState("Success");
			}
			switch (h) {
			case "Status: Em aberto":
				this.getView().byId("IdLabelStatus").setState("Error");
				break;
			case "Status: Em aprovação":
				this.getView().byId("IdLabelStatus").setState("Warning");
				break;
			default:
				this.getView().byId("IdLabelStatus").setState("Success");
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
		
			
		},

		FormatStatus: function (value) {

			if (value === 'Disponível') {

				return "Success";

			}
			if (value === 'Em Programação') {

				return "Warning";

			}
			if (value === 'Homologado') {

				return "Success";

			}
			if (value === 'Em Aberto') {

				return "Error";

			}
			if (value === 'Em aprovação') {

				return "Warning";

			}
			if (value === 'Status: Em aprovação') {

				return "Warning";

			} else {

				return "Success";

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
			g = a.oData.d.StatusTxt1;
			h = a.oData.d.LabelStatus;
			this.getView().byId("first_diasgozo").setValue(n);
			this.getView().byId("IdInicio1").setValue(d);
			this.getView().byId("IdFim1").setValue(l);
			this.getView().byId("first_status").setText(g);
			this.getView().byId("IdLabelStatus").setText(h);
			switch (g) {
			case "Em aberto":
				this.getView().byId("first_status").setState("Error");
				break;
			case "Em aprovação":
				this.getView().byId("first_status").setState("Warning");
				break;
			default:
				this.getView().byId("first_status").setState("Success");
			}
			switch (h) {
			case "Status: Em aberto":
				this.getView().byId("IdLabelStatus").setState("Error");
				break;
			case "Status: Em aprovação":
				this.getView().byId("IdLabelStatus").setState("Warning");
				break;
			default:
				this.getView().byId("IdLabelStatus").setState("Success");
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
		},
		onCancel: function (e) {
			var t = this;
			var that = this;
			var a = this.getOwnerComponent();
			var r = a.oListSelector._oList;
			var n = r.getBinding("items");
			var d = this.getView().getModel();
			var l = this.getView().byId("IdIndex").getValue();
			var g = "/ZET_GLHR_CANCELAR(Index=" + l + ")";
			var u = {};
			t.getView().byId("Per1").setValue("");
			u.Index = parseInt(this.getView().byId("IdIndex").getValue());
			var c = new s({
				title: "Confirmação",
				type: "Message",
				content: new o({
					text: "Confirma o cancelamento da Programação?"
				}),
				beginButton: new i({
					text: "Sim",
					press: function () {
						that.loading(true);
						d.update(g, u, {
							success: function (e, a) {
								if (a.body === "") {
									that.getView().getModel().refresh(true);
									sap.m.MessageBox.alert("Programação cancelada com Sucesso!");
									return;
								}
								var s = a.headers["sap-message"];
								var i = JSON.parse(s);
								var o = i.details.length;
								var r = 0;
								var n;
								sap.m.MessageBox.alert(i.message, {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function (e) {
										that.getView().getModel().refresh(true);
									}
									
								});
							}
						});
						c.close();
					}
				}),
				endButton: new i({
					text: "Não",
					press: function () {
						c.close();
					}
				}),
				afterClose: function () {
					c.destroy();
				}
			});
			c.open();
		},
		FormatEditable: function (e) {
			if (e === "" | e === "0" | e === null) {
				return true;
			} else return false;
		},
		FormatChecked: function (e) {
			if (e === "X") {
				return true;
			} else {
				return false;
			}
		},
		FormatChecked2: function (e) {
			if (e === "X") {
				return true;
			} else {
				return false;
			}
		},
		onAfterRendering: function (e) {},
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