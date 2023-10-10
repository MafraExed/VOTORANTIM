sap.ui.define(["Y5GL_SOLFER_DHO/Y5GL_SOLFER_DHO/controller/BaseController", "sap/ui/model/json/JSONModel",
	"Y5GL_SOLFER_DHO/Y5GL_SOLFER_DHO/model/formatter", "sap/ui/Device", "sap/m/Dialog", "sap/m/Button", "sap/m/Text", "sap/ui/core/Fragment"
], function (e, t, a, i, s, o, r, d) {
	"use strict";
	var n, l, g, u, c, I, h, V, b, f, S;
	return e.extend("Y5GL_SOLFER_DHO.Y5GL_SOLFER_DHO.controller.Detail", {
		formatter: a,

		//para iniciar - inicio
		onInit: function () {
			var e = new t({
				busy: false,
				delay: 0
			});
			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			this.setModel(e, "detailView");
			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
			
			this.buscaImagem();
		},
		// para iniciar - fim

		// Para Matched - Inicio
		_onObjectMatched: function (e) {
			this.getView().byId("idPage").scrollTo(0,0);
		
			this.getView().getModel().refresh(true);

			var t = e.getParameter("arguments").Pernr;
			a = e.getParameter("arguments").Index;
			S = e.getParameter("arguments").Tipo;
			f = e.getParameter("arguments").Endda;
			h = e.getParameter("arguments").Begda;

			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then(function () {
				var e = this.getModel().createKey("ZET_GLHR_PROGRAMARSet", {
					Pernr: t,
					Index: a,
					Endda: f,
					Begda: h
				});
				if (!e) {}
				this._bindView("/" + e);
			}.bind(this));
		},
		_bindView: function (e) {
			var t = this;
			var a = this.getView().getModel();
			t.loading(false);
			this.getView().bindElement({
				path: e,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						t.loading(true);
					},
					dataReceived: function () {
						t.loading(false);
					}
				}
			});
		},
		_onBindingChange: function () {
			var e = this.getView(),
				t = e.getElementBinding();
			if (!t.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}
			this.getView().byId("IdInicio1").setValueState("None");
			this.getView().byId("first_diasgozo").setValueState("None");
			this.getView().byId("IdFim1").setValueState("None");
			this.getView().byId("IdInicio2").setValueState("None");
			this.getView().byId("secon_diasgozo").setValueState("None");
			this.getView().byId("IdFim2").setValueState("None");
			this.getView().byId("IdInicio3").setValueState("None");
			this.getView().byId("third_diasgozo").setValueState("None");
			this.getView().byId("IdFim3").setValueState("None");
		},
		_onMetadataLoaded: function () {
			var e = this.getView().getBusyIndicatorDelay(),
				t = this.getModel("detailView");
			t.setProperty("/delay", 0);
			t.setProperty("/busy", true);
			t.setProperty("/delay", e);
		},

		// Para Matched - Fim

		// formatters - inicio
		FormatValue: function (oValue) {
			if (oValue === "0") {
				return "";
			} else {
				return oValue;
			}
		},
		FormatChecked: function (e) {
			if (e === "X") {
				return true;
			} else {
				return false;
			}
		},
		FormatStatus: function (e) {
			if (e === "Status: Disponível") {
				return "Success";
			}
			if (e === "Status: Em programação") {
				return "Warning";
			}
			if (e === "Status: Em aprovação") {
				return "Warning";
			}
			if (e === "Status: Disponível") {
				return "Success";
			}
			if (e === "Em programação") {
				return "Warning";
			}
			if (e === "Status: Homologado") {
				return "Success";
			}
			if (e === "Homologado") {
				return "Success";
			}
			if (e === "Status: Em Aberto") {
				return "Success";
			}
			if (e === "Em Aberto") {
				return "Success";
			}
			if (e === "Status: Aprovado") {
				return "Success";
			}
			if (e === "Aprovado") {
				return "Success";
			}
			if (e === "Status: Em aprovação") {
				return "Warning";
			}
			if (e === "Em aprovação") {
				return "Warning";
			}
			return "Error";
		},
		FormatEditable: function (e) {
			if (e === "Em aprovação" || e === "Em aberto") {
				return true;
			} else {
				return false;
			}
		},
		FormatCancel: function (e) {
			if (e === "Status: Disponível") {
				return false;
			} else {
				return true;
			}
		},
		FormatVisiblePDF: function (oValue) {
			switch (oValue) {
			case "Aprovado":
				return true;
				break;
			case "Homologado":
				return true;
				break;
			default:
				return false;
			}
		},
		// formatter - fim

		// Ações - Inicio

		onDownload: function (oEvent) {
			var id = oEvent.getParameter("id");
			var split = id.split("detail--");
			var newid = split[1];

			this.ChamaDownload(newid);
		},

		ChamaDownload: function (id) {
			var Pernr = "0";
			var Infty = "0";
			var Subty = "0";
			var Periodo = "99.9999";
			var Adiantamento = "0";
			var Tipo = "H";
			var Favor = "0";
			var Data;

			switch (id) {
			case "Download1":
				Data = this.getView().byId("IdInicio1").getValue();
				break;
			case "Download2":
				Data = this.getView().byId("IdInicio2").getValue();
				break;
			case "Download3":
				Data = this.getView().byId("IdInicio3").getValue();
				break;
			}

			while (Data.indexOf("-") !== -1) {
				Data = Data.replace("-", "");
			}

			var url = "/sap/opu/odata/sap/ZGWGLRH_MEU_CADASTRO_SRV/ZET_GLHR_UPFILESet('" + Pernr + "$" + Infty + "$" + Subty + "$" + Periodo +
				"$" + Adiantamento + "$" + Tipo + "$" + Favor + "$" + Data + "')/$value";

			var oA = document.createElement("a");
			oA.href = url;
			oA.target = "_blank";
			oA.style.display = "none";
			document.body.appendChild(oA);
			oA.click();
			document.body.removeChild(oA);
		},
		onCancel: function (e, t, a) {
			var i = this;
			var d = this.getView().byId("IdIndex").getValue();
			var n = this.getView().byId("IdPernr").getValue();
			var l = "/ZET_GLHR_ESS_FERIASSet(Index=" + d + ",Pernr='" + n + "',Acao='C')";
			var g = {};
			var u = this.getView().byId("first_abono").getSelected();
			var c = this.getView().byId("first_13_1").getSelected();
			var I = this.getView().byId("first_13_2").getSelected();
			var h = this.getView().byId("first_13_3").getSelected();
			var V = 0;
			var b = this.getView().getModel();
			e = true;
			t = true;
			a = true;
			if (e === true) {
				g.Inicio1 = this.getView().byId("IdInicio1").getValue();
				g.DiasGozo1 = this.getView().byId("first_diasgozo").getValue();
				g.Fim1 = this.getView().byId("IdFim1").getValue();
				if (u === true) {
					g.Abono1 = "X";
					g.DiasAbono1 = "10";
				} else {
					g.Abono1 = " ";
				}
				if (c === true) {
					g.SolParc131 = "X";
				}
				g.Acao1 = "X";
			} else {
				this.getView().byId("IdInicio1").setValueState("None");
				this.getView().byId("first_diasgozo").setValueState("None");
				this.getView().byId("IdFim1").setValueState("None");
			}
			if (t === true) {
				g.Inicio2 = this.getView().byId("IdInicio2").getValue();
				g.DiasGozo2 = this.getView().byId("secon_diasgozo").getValue();
				g.Fim2 = this.getView().byId("IdFim2").getValue();
				if (I === true) {
					g.SolParc132 = "X";
				}
				g.Acao2 = "X";
			} else {
				this.getView().byId("IdInicio2").setValueState("None");
				this.getView().byId("secon_diasgozo").setValueState("None");
				this.getView().byId("IdFim2").setValueState("None");
			}
			if (a === true) {
				g.Inicio3 = this.getView().byId("IdInicio3").getValue();
				g.DiasGozo3 = this.getView().byId("third_diasgozo").getValue();
				g.Fim3 = this.getView().byId("IdFim3").getValue();
				if (h === true) {
					g.SolParc133 = "X";
				}
				g.Acao3 = "X";
			} else {
				this.getView().byId("IdInicio3").setValueState("None");
				this.getView().byId("third_diasgozo").setValueState("None");
				this.getView().byId("IdFim3").setValueState("None");
			}
			if (V === 1) {
				sap.m.MessageBox.error("Existem informações não preenchidas.", {
					actions: ["OK"],
					onClose: function (e) {
						i._valueHelpDialog1.close();
					}
				});
				return;
			}
			var f = new s({
				title: "Confirmação",
				type: "Message",
				content: new r({
					text: "Confirma cancelamento das férias?"
				}),
				beginButton: new o({
					text: "Sim",
					press: function () {
						i.loading(true);
						b.update(l, g, {
							success: function (e, t) {
								sap.m.MessageBox.success("Suas férias foram canceladas com sucesso.", {
									actions: ["OK"],
									onClose: function (e) {
										i.getView().getModel().refresh(true);
									}
								});
							},
							error: function (e) {
								var t = e;
								t = t.responseText;
								var a = JSON.parse(t);
								var s = a.error.message.value;
								sap.m.MessageBox.error(s, {
									actions: ["OK"],
									onClose: function (e) {
										i.loading(false);
									}
								});
								return;
							}
						});
						f.close();
					}
				}),
				endButton: new o({
					text: "Não",
					press: function () {
						f.close();
					}
				}),
				afterClose: function () {
					f.destroy();
					i._valueHelpDialog1.close();
				}
			});
			f.open();
		},
		onSave: function (e, t, a) {
			var i = this;
			var d = this.getView().byId("IdIndex").getValue();
			var n = this.getView().byId("IdPernr").getValue();
			var l = "/ZET_GLHR_ESS_FERIASSet(Index=" + d + ",Pernr='" + n + "',Acao='P')";
			var g = {};
			var u = this.getView().byId("first_abono").getSelected();
			var c = this.getView().byId("first_13_1").getSelected();
			var I = this.getView().byId("first_13_2").getSelected();
			var h = this.getView().byId("first_13_3").getSelected();
			var V = 0;
			var b = this.getView().getModel();
			e = true;
			t = true;
			a = true;
			if (e === true) {
				g.Inicio1 = this.getView().byId("IdInicio1").getValue();
				g.DiasGozo1 = this.getView().byId("first_diasgozo").getValue();
				g.Fim1 = this.getView().byId("IdFim1").getValue();
				g.StatusTxt1 = this.getView().byId("first_status").getText();
				if (u === true) {
					g.Abono1 = "X";
					g.DiasAbono1 = "10";
				} else {
					g.Abono1 = " ";
				}
				if (c === true) {
					g.SolParc131 = "X";
				}
				g.Acao1 = "X";
			} else {
				this.getView().byId("IdInicio1").setValueState("None");
				this.getView().byId("first_diasgozo").setValueState("None");
				this.getView().byId("IdFim1").setValueState("None");
			}
			if (t === true) {
				g.Inicio2 = this.getView().byId("IdInicio2").getValue();
				g.DiasGozo2 = this.getView().byId("secon_diasgozo").getValue();
				g.Fim2 = this.getView().byId("IdFim2").getValue();
				g.StatusTxt2 = this.getView().byId("secon_status").getText();
				if (I === true) {
					g.SolParc132 = "X";
				}
				g.Acao2 = "X";
			} else {
				this.getView().byId("IdInicio2").setValueState("None");
				this.getView().byId("secon_diasgozo").setValueState("None");
				this.getView().byId("IdFim2").setValueState("None");
			}
			if (a === true) {
				g.Inicio3 = this.getView().byId("IdInicio3").getValue();
				g.DiasGozo3 = this.getView().byId("third_diasgozo").getValue();
				g.Fim3 = this.getView().byId("IdFim3").getValue();
				g.StatusTxt3 = this.getView().byId("third_status").getText();
				if (h === true) {
					g.SolParc133 = "X";
				}
				g.Acao3 = "X";
			} else {
				this.getView().byId("IdInicio3").setValueState("None");
				this.getView().byId("third_diasgozo").setValueState("None");
				this.getView().byId("IdFim3").setValueState("None");
			}
			if (V === 1) {
				sap.m.MessageBox.error("Existem informações não preenchidas.", {
					actions: ["OK"],
					onClose: function (e) {
						i._valueHelpDialog1.close();
					}
				});
				return;
			}
			var f = new s({
				title: "Confirmação",
				type: "Message",
				content: new r({
					text: "Deseja enviar a solicitação de Férias?"
				}),
				beginButton: new o({
					text: "Sim",
					press: function () {
						i.loading(true);
						b.update(l, g, {
							success: function (e, t) {
								sap.m.MessageBox.success("Suas férias foram programadas com sucesso.", {
									actions: ["OK"],
									onClose: function (e) {
										i.getView().getModel().refresh(true);
									}
								});
							},
							error: function (e) {
								var t = e;
								t = t.responseText;
								var a = JSON.parse(t);
								var s = a.error.message.value;
								sap.m.MessageBox.error(s, {
									actions: ["OK"],
									onClose: function (e) {
										i.loading(false);
									}
								});
								return;
							}
						});
						f.close();
					}
				}),
				endButton: new o({
					text: "Não",
					press: function () {
						f.close();
					}
				}),
				afterClose: function () {
					f.destroy();
					i._valueHelpDialog1.close();
				}
			});
			f.open();
		},
		// Ações - Fim

		// Navegações - Inicio	
		onVoltar: function () {
			this.getRouter().navTo("master");
		},
		//Navegações - Fim

		// Validações - Inicio

		validaData: function () {
			var t = this.getView().byId("IdInicio1").getValue();
			var a = this.getView().byId("first_diasgozo").getValue();

			if (t === "" || a === "") {
				this.getView().byId("IdFim1").setValue();
			}
		},

		somardatafirst: function () {
			var e = this;
			var t = this.getView().byId("IdInicio1").getValue();
			var a = this.getView().byId("first_diasgozo").getValue();
			var i;

			if (t === "") {
				this.getView().byId("IdFim1").setValue("");
				return;
			}

			if (a === "") {
				a = "0";
			}

			i = !isNaN(a);

			if (i === true) {
				if (a > 0) {

					var s = "";
					var o = "/sap/opu/odata/sap/ZGWGLHR_FERIAS_ESS_SRV/ZET_GLHR_CALC_DAYS(V_DATA='" + t + "',V_DIAS='" + a + "')";
					var r = new sap.ui.model.json.JSONModel;
					var d = {};
					d.vdata = this.getView().byId("IdInicio1").getValue();
					d.vdays = this.getView().byId("first_diasgozo").getValue();
					r.loadData(o, null, false, "GET", false, false, null);
					var n = r.oData.d.V_RESULTADO;
					var l = e.getView().byId("IdFim1");
					l.setValue(n);

				}
			} else {
				sap.m.MessageBox.error("O valor informado deverá ser um número.", {
					actions: ["OK"],
					onClose: function (t) {
						e.getView().byId("first_diasgozo").setValue();
					}
				});
			}
		},

		somardatasecon: function () {
			var e = this;
			var t = this.getView().byId("IdInicio2").getValue();
			var a = this.getView().byId("secon_diasgozo").getValue();
			var i;

			if (t === "") {
				this.getView().byId("IdFim1").setValue("");
				return;
			}

			if (a === "") {
				a = "0";
			}
			i = !isNaN(a);
			if (i === true) {
				if (a > 0) {
					var s = "";
					var o = "/sap/opu/odata/sap/ZGWGLHR_FERIAS_ESS_SRV/ZET_GLHR_CALC_DAYS(V_DATA='" + t + "',V_DIAS='" + a + "')";
					var r = new sap.ui.model.json.JSONModel;
					var d = {};
					d.vdata2 = this.getView().byId("IdInicio2").getValue();
					d.vdays2 = this.getView().byId("secon_diasgozo").getValue();
					r.loadData(o, null, false, "GET", false, false, null);
					var n = r.oData.d.V_RESULTADO;
					var l = e.getView().byId("IdFim2");
					l.setValue(n);
				}
			} else {
				sap.m.MessageBox.error("O valor informado deverá ser um número.", {
					actions: ["OK"],
					onClose: function (t) {
						e.getView().byId("secon_diasgozo").setValue();
					}
				});
			}
		},

		somardatathird: function () {
			var e = this;
			var t = this.getView().byId("IdInicio3").getValue();
			var a = this.getView().byId("third_diasgozo").getValue();
			var i;

			if (t === "") {
				this.getView().byId("IdFim1").setValue("");
				return;
			}

			if (a === "") {
				a = "0";
			}
			i = !isNaN(a);
			if (i === true) {
				if (a > 0) {
					var s = "";
					var o = "/sap/opu/odata/sap/ZGWGLHR_FERIAS_ESS_SRV/ZET_GLHR_CALC_DAYS(V_DATA='" + t + "',V_DIAS='" + a + "')";
					var r = new sap.ui.model.json.JSONModel;
					var d = {};
					d.vdata = this.getView().byId("IdInicio3").getValue();
					d.vdays = this.getView().byId("third_diasgozo").getValue();
					r.loadData(o, null, false, "GET", false, false, null);
					var n = r.oData.d.V_RESULTADO;
					var l = e.getView().byId("IdFim3");
					l.setValue(n);
				}
			} else {
				sap.m.MessageBox.error("O valor informado deverá ser um número.", {
					actions: ["OK"],
					onClose: function (t) {
						e.getView().byId("third_diasgozo").setValue();
					}
				});
			}
		},
		somardata: function (e, t) {
			var a = this;
			var i = this.getOwnerComponent().getModel("ferias_ess");
			var s = "VDATA eq '" + e + "' and VDIAS eq '" + t + "'";
			var o = "/ZET_GLHR_CALC_DAYS";
			i.read(o, {
				urlParameters: {
					$filter: s
				},
				async: false,
				success: function (e, t) {
					return e.results[0].RESULTADO;
				},
				error: function () {
					sap.m.MessageToast.show("Férias não encontradas!");
				}
			});
		},
		validasecon: function (e) {
			var t = this.getView().byId("secon_diasgozo").getValue();
			var a = /^[0-9]+$/;
			if (t.match(a)) {
				if (t.length > 2) {
					var i = t.slice(0, 2);
					this.getView().byId("secon_diasgozo").setValue(i);
				}
				if (t.length < 2) {
					this.somardatasecon();
				}
				this.somardatasecon();
			} else {
				var s = t.slice(0, 0);
				this.getView().byId("secon_diasgozo").setValue(s);
				this.somardatasecon();
			}
		},
		validathird: function (e) {
			var t = this.getView().byId("third_diasgozo").getValue();
			var a = /^[0-9]+$/;
			if (t.match(a)) {
				if (t.length > 2) {
					var i = t.slice(0, 2);
					this.getView().byId("third_diasgozo").setValue(i);
				}
				if (t.length < 2) {
					this.somardatathird();
				}
				this.somardatathird();
			} else {
				var s = t.slice(0, 0);
				this.getView().byId("third_diasgozo").setValue(s);
				this.somardatathird();
			}
		},
		formatterIcon: function (e) {
			var sRootPath = jQuery.sap.getModulePath("Y5GL_SOLFER_DHO.Y5GL_SOLFER_DHO");
			var sImagePath = sRootPath + "/Icones/";
			var icone;
			icone = sImagePath + "FERIAS_DET.png";
			return icone;
		}
		// Validações - Fim
	});
});