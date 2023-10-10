sap.ui.define(["Y5GL_SOLFER_DHO/Y5GL_SOLFER_DHO/controller/BaseController", "sap/ui/model/json/JSONModel",
	"Y5GL_SOLFER_DHO/Y5GL_SOLFER_DHO/model/formatter", "sap/ui/Device", "sap/m/Dialog", "sap/m/Button", "sap/m/Text", "sap/ui/core/Fragment"
], function (e, t, a, i, s, o, r, n) {
	"use strict";
	var d, u, l, g, c, V, I, h, f, m, v;
	return e.extend("Y5GL_SOLFER_DHO.Y5GL_SOLFER_DHO.controller.Detail", {
		formatter: a,
		onInit: function () {
			var e = new t({
				busy: false,
				delay: 0
			});
			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			this.setModel(e, "detailView");
			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
			this.buscaImagem()
		},
		_onObjectMatched: function (e) {
			this.getView().byId("idPage").scrollTo(0, 0);
			this.getView().getModel().refresh(true);
			var t = e.getParameter("arguments").Pernr;
			a = e.getParameter("arguments").Index;
			v = e.getParameter("arguments").Tipo;
			m = e.getParameter("arguments").Endda;
			I = e.getParameter("arguments").Begda;
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then(function () {
				var e = this.getModel().createKey("ZET_GLHR_PROGRAMARSet", {
					Pernr: t,
					Index: a,
					Endda: m,
					Begda: I
				});
				if (!e) {}
				this._bindView("/" + e)
			}.bind(this))
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
						t.loading(true)
					},
					dataReceived: function () {
						t.loading(false)
					}
				}
			})
		},
		
		_onBindingChange: function () {
			var e = this.getView(),
				t = e.getElementBinding();
			if (!t.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return
			}
			this.getView().byId("IdInicio1").setValueState("None");
			this.getView().byId("first_diasgozo").setValueState("None");
			this.getView().byId("IdFim1").setValueState("None");
			this.getView().byId("IdInicio2").setValueState("None");
			this.getView().byId("secon_diasgozo").setValueState("None");
			this.getView().byId("IdFim2").setValueState("None");
			this.getView().byId("IdInicio3").setValueState("None");
			this.getView().byId("third_diasgozo").setValueState("None");
			this.getView().byId("IdFim3").setValueState("None")
		},
		_onMetadataLoaded: function () {
			var e = this.getView().getBusyIndicatorDelay(),
				t = this.getModel("detailView");
			t.setProperty("/delay", 0);
			t.setProperty("/busy", true);
			t.setProperty("/delay", e)
		},
		FormatValue: function (e) {
			if (e === "0") {
				return ""
			} else {
				return e
			}
		},
		FormatChecked: function (e) {
			if (e === "X") {
				return true
			} else {
				return false
			}
		},
		FormatStatus: function (e) {
			
			if (e === "Status: Disponível") {
				return "Success"
			}
			if (e === "Status: Em programação") {
				return "Warning"
			}
			if (e === "Status: Em aprovação") {
				return "Warning"
			}
			if (e === "Status: Disponível") {
				return "Success"
			}
			if (e === "Em programação") {
				return "Warning"
			}
			if (e === "Status: Homologado") {
				return "Success"
			}
			if (e === "Homologado") {
				return "Success"
			}
			if (e === "Status: Em Aberto") {
				return "Success"
			}
			if (e === "Em Aberto") {
				return "Success"
			}
			if (e === "Status: Aprovado") {
				return "Success"
			}
			if (e === "Aprovado") {
				return "Success"
			}
			if (e === "Status: Em aprovação") {
				return "Warning"
			}
			if (e === "Em aprovação") {
				return "Warning"
			}
			return "Error"
		},
		FormatEditable: function (e) {

			if (e === "Em aprovação" || e === "Em aberto") {
				return true
			} else {
				return false
			}
		},
		FormatCancel: function (e) {
			if (e === "Status: Disponível") {
				return false
			} else {
				return true
			}
		},
		FormatVisiblePDF: function (e) {
			switch (e) {
			case "Aprovado":
				return true;
				break;
			case "Homologado":
				return true;
				break;
			default:
				return false
			}
		},
		onDownload: function (e) {
			var t = e.getParameter("id");
			var a = t.split("detail--");
			var i = a[1];
			this.ChamaDownload(i)
		},
		ChamaDownload: function (e) {
			var t = "0";
			var a = "0";
			var i = "0";
			var s = "99.9999";
			var o = "0";
			var r = "H";
			var n = "0";
			var d;
			switch (e) {
			case "Download1":
				d = this.getView().byId("IdInicio1").getValue();
				break;
			case "Download2":
				d = this.getView().byId("IdInicio2").getValue();
				break;
			case "Download3":
				d = this.getView().byId("IdInicio3").getValue();
				break
			}
			while (d.indexOf("-") !== -1) {
				d = d.replace("-", "")
			}
			var u = "/sap/opu/odata/sap/ZGWGLRH_MEU_CADASTRO_SRV/ZET_GLHR_UPFILESet('" + t + "$" + a + "$" + i + "$" + s + "$" + o + "$" + r +
				"$" + n + "$" + d + "')/$value";
			var l = document.createElement("a");
			l.href = u;
			l.target = "_blank";
			l.style.display = "none";
			document.body.appendChild(l);
			l.click();
			document.body.removeChild(l)
		},
		onCancel: function (e, t, a) {
			var i = this;
			var n = this.getView().byId("IdIndex").getValue();
			var d = this.getView().byId("IdPernr").getValue();
			var u = "/ZET_GLHR_ESS_FERIASSet(Index=" + n + ",Pernr='" + d + "',Acao='C')";
			var l = {};
			var g = this.getView().byId("first_abono").getSelected();
			var c = this.getView().byId("first_13_1").getSelected();
			var V = this.getView().byId("first_13_2").getSelected();
			var I = this.getView().byId("first_13_3").getSelected();
			var h = 0;
			var f = this.getView().getModel();
			e = true;
			t = true;
			a = true;
			if (e === true) {
				l.Inicio1 = this.getView().byId("IdInicio1").getValue();
				l.DiasGozo1 = this.getView().byId("first_diasgozo").getValue();
				l.Fim1 = this.getView().byId("IdFim1").getValue();
				if (g === true) {
					l.Abono1 = "X";
					l.DiasAbono1 = "10"
				} else {
					l.Abono1 = " "
				}
				if (c === true) {
					l.SolParc131 = "X"
				}
				l.Acao1 = "X"
			} else {
				this.getView().byId("IdInicio1").setValueState("None");
				this.getView().byId("first_diasgozo").setValueState("None");
				this.getView().byId("IdFim1").setValueState("None")
			}
			if (t === true) {
				l.Inicio2 = this.getView().byId("IdInicio2").getValue();
				l.DiasGozo2 = this.getView().byId("secon_diasgozo").getValue();
				l.Fim2 = this.getView().byId("IdFim2").getValue();
				if (V === true) {
					l.SolParc132 = "X"
				}
				l.Acao2 = "X"
			} else {
				this.getView().byId("IdInicio2").setValueState("None");
				this.getView().byId("secon_diasgozo").setValueState("None");
				this.getView().byId("IdFim2").setValueState("None")
			}
			if (a === true) {
				l.Inicio3 = this.getView().byId("IdInicio3").getValue();
				l.DiasGozo3 = this.getView().byId("third_diasgozo").getValue();
				l.Fim3 = this.getView().byId("IdFim3").getValue();
				if (I === true) {
					l.SolParc133 = "X"
				}
				l.Acao3 = "X"
			} else {
				this.getView().byId("IdInicio3").setValueState("None");
				this.getView().byId("third_diasgozo").setValueState("None");
				this.getView().byId("IdFim3").setValueState("None")
			}
			if (h === 1) {
				sap.m.MessageBox.error("Existem informações não preenchidas.", {
					actions: ["OK"],
					onClose: function (e) {
						i._valueHelpDialog1.close()
					}
				});
				return
			}
			var m = new s({
				title: "Confirmação",
				type: "Message",
				content: new r({
					text: "Confirma cancelamento das férias?"
				}),
				beginButton: new o({
					text: "Sim",
					press: function () {
						i.loading(true);
						f.update(u, l, {
							success: function (e, t) {
								sap.m.MessageBox.success("Suas férias foram canceladas com sucesso.", {
									actions: ["OK"],
									onClose: function (e) {
										i.getView().getModel().refresh(true)
									}
								})
							},
							error: function (e) {
								var t = e;
								t = t.responseText;
								var a = JSON.parse(t);
								var s = a.error.message.value;
								sap.m.MessageBox.error(s, {
									actions: ["OK"],
									onClose: function (e) {
										i.loading(false)
									}
								});
								return
							}
						});
						m.close()
					}
				}),
				endButton: new o({
					text: "Não",
					press: function () {
						m.close()
					}
				}),
				afterClose: function () {
					m.destroy();
					i._valueHelpDialog1.close()
				}
			});
			m.open()
		},
		onSave: function (e, t, a) {
			var i = this;
			var n = this.getView().byId("IdIndex").getValue();
			var d = this.getView().byId("IdPernr").getValue();
			var u = "/ZET_GLHR_ESS_FERIASSet(Index=" + n + ",Pernr='" + d + "',Acao='P')";
			var l = {};
			var g = this.getView().byId("first_abono").getSelected();
			var c = this.getView().byId("first_13_1").getSelected();
			var V = this.getView().byId("first_13_2").getSelected();
			var I = this.getView().byId("first_13_3").getSelected();
			var h = 0;
			var f = this.getView().getModel();
			e = true;
			t = true;
			a = true;
			l.Is_dho = 'X';
			if (e === true) {
				l.Inicio1 = this.getView().byId("IdInicio1").getValue();
				l.DiasGozo1 = this.getView().byId("first_diasgozo").getValue();
				l.Fim1 = this.getView().byId("IdFim1").getValue();
				l.StatusTxt1 = this.getView().byId("first_status").getText();
				if (g === true) {
					l.Abono1 = "X";
					l.DiasAbono1 = "10"
				} else {
					l.Abono1 = " "
				}
				if (c === true) {
					l.SolParc131 = "X"
				}
				l.Acao1 = "X"
			} else {
				this.getView().byId("IdInicio1").setValueState("None");
				this.getView().byId("first_diasgozo").setValueState("None");
				this.getView().byId("IdFim1").setValueState("None")
			}
			if (t === true) {
				l.Inicio2 = this.getView().byId("IdInicio2").getValue();
				l.DiasGozo2 = this.getView().byId("secon_diasgozo").getValue();
				l.Fim2 = this.getView().byId("IdFim2").getValue();
				l.StatusTxt2 = this.getView().byId("secon_status").getText();
				if (V === true) {
					l.SolParc132 = "X"
				}
				l.Acao2 = "X"
			} else {
				this.getView().byId("IdInicio2").setValueState("None");
				this.getView().byId("secon_diasgozo").setValueState("None");
				this.getView().byId("IdFim2").setValueState("None")
			}
			if (a === true) {
				l.Inicio3 = this.getView().byId("IdInicio3").getValue();
				l.DiasGozo3 = this.getView().byId("third_diasgozo").getValue();
				l.Fim3 = this.getView().byId("IdFim3").getValue();
				l.StatusTxt3 = this.getView().byId("third_status").getText();
				if (I === true) {
					l.SolParc133 = "X"
				}
				l.Acao3 = "X"
			} else {
				this.getView().byId("IdInicio3").setValueState("None");
				this.getView().byId("third_diasgozo").setValueState("None");
				this.getView().byId("IdFim3").setValueState("None")
			}
			if (h === 1) {
				sap.m.MessageBox.error("Existem informações não preenchidas.", {
					actions: ["OK"],
					onClose: function (e) {
						i._valueHelpDialog1.close()
					}
				});
				return
			}
			var m = new s({
				title: "Confirmação",
				type: "Message",
				content: new r({
					text: "Deseja enviar a solicitação de Férias?"
				}),
				beginButton: new o({
					text: "Sim",
					press: function () {
						i.loading(true);
						f.update(u, l, {
							success: function (e, t) {
								sap.m.MessageBox.success("Suas férias foram programadas com sucesso.", {
									actions: ["OK"],
									onClose: function (e) {
										i.getView().getModel().refresh(true)
									}
								})
							},
							error: function (e) {
								var t = e;
								t = t.responseText;
								var a = JSON.parse(t);
								var s = a.error.message.value;
								sap.m.MessageBox.error(s, {
									actions: ["OK"],
									onClose: function (e) {
										i.loading(false)
									}
								});
								return
							}
						});
						m.close()
					}
				}),
				endButton: new o({
					text: "Não",
					press: function () {
						m.close()
					}
				}),
				afterClose: function () {
					m.destroy();
					i._valueHelpDialog1.close()
				}
			});
			m.open()
		},
		onVoltar: function () {
			this.getRouter().navTo("master")
		},
		validaData: function () {
			var e = this.getView().byId("IdInicio1").getValue();
			var t = this.getView().byId("first_diasgozo").getValue();
			if (e === "" || t === "") {
				this.getView().byId("IdFim1").setValue()
			}
		},
		somardatafirst: function () {
			var e = this;
			var t = this.getView().byId("IdInicio1").getValue();
			var a = this.getView().byId("first_diasgozo").getValue();
			var i;
			if (t === "") {
				this.getView().byId("IdFim1").setValue("");
				return
			}
			if (a === "") {
				a = "0"
			}
			i = !isNaN(a);
			if (i === true) {
				if (a > 0) {
					var s = "";
					var o = "/sap/opu/odata/sap/ZGWGLHR_FERIAS_ESS_SRV/ZET_GLHR_CALC_DAYS(V_DATA='" + t + "',V_DIAS='" + a + "')";
					var r = new sap.ui.model.json.JSONModel;
					var n = {};
					n.vdata = this.getView().byId("IdInicio1").getValue();
					n.vdays = this.getView().byId("first_diasgozo").getValue();
					r.loadData(o, null, false, "GET", false, false, null);
					var d = r.oData.d.V_RESULTADO;
					var u = e.getView().byId("IdFim1");
					u.setValue(d)
				}
			} else {
				sap.m.MessageBox.error("O valor informado deverá ser um número.", {
					actions: ["OK"],
					onClose: function (t) {
						e.getView().byId("first_diasgozo").setValue()
					}
				})
			}
		},
		somardatasecon: function () {
			var e = this;
			var t = this.getView().byId("IdInicio2").getValue();
			var a = this.getView().byId("secon_diasgozo").getValue();
			var i;
			if (t === "") {
				this.getView().byId("IdFim1").setValue("");
				return
			}
			if (a === "") {
				a = "0"
			}
			i = !isNaN(a);
			if (i === true) {
				if (a > 0) {
					var s = "";
					var o = "/sap/opu/odata/sap/ZGWGLHR_FERIAS_ESS_SRV/ZET_GLHR_CALC_DAYS(V_DATA='" + t + "',V_DIAS='" + a + "')";
					var r = new sap.ui.model.json.JSONModel;
					var n = {};
					n.vdata2 = this.getView().byId("IdInicio2").getValue();
					n.vdays2 = this.getView().byId("secon_diasgozo").getValue();
					r.loadData(o, null, false, "GET", false, false, null);
					var d = r.oData.d.V_RESULTADO;
					var u = e.getView().byId("IdFim2");
					u.setValue(d)
				}
			} else {
				sap.m.MessageBox.error("O valor informado deverá ser um número.", {
					actions: ["OK"],
					onClose: function (t) {
						e.getView().byId("secon_diasgozo").setValue()
					}
				})
			}
		},
		somardatathird: function () {
			var e = this;
			var t = this.getView().byId("IdInicio3").getValue();
			var a = this.getView().byId("third_diasgozo").getValue();
			var i;
			if (t === "") {
				this.getView().byId("IdFim1").setValue("");
				return
			}
			if (a === "") {
				a = "0"
			}
			i = !isNaN(a);
			if (i === true) {
				if (a > 0) {
					var s = "";
					var o = "/sap/opu/odata/sap/ZGWGLHR_FERIAS_ESS_SRV/ZET_GLHR_CALC_DAYS(V_DATA='" + t + "',V_DIAS='" + a + "')";
					var r = new sap.ui.model.json.JSONModel;
					var n = {};
					n.vdata = this.getView().byId("IdInicio3").getValue();
					n.vdays = this.getView().byId("third_diasgozo").getValue();
					r.loadData(o, null, false, "GET", false, false, null);
					var d = r.oData.d.V_RESULTADO;
					var u = e.getView().byId("IdFim3");
					u.setValue(d)
				}
			} else {
				sap.m.MessageBox.error("O valor informado deverá ser um número.", {
					actions: ["OK"],
					onClose: function (t) {
						e.getView().byId("third_diasgozo").setValue()
					}
				})
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
					return e.results[0].RESULTADO
				},
				error: function () {
					sap.m.MessageToast.show("Férias não encontradas!")
				}
			})
		},
		validasecon: function (e) {
			var t = this.getView().byId("secon_diasgozo").getValue();
			var a = /^[0-9]+$/;
			if (t.match(a)) {
				if (t.length > 2) {
					var i = t.slice(0, 2);
					this.getView().byId("secon_diasgozo").setValue(i)
				}
				if (t.length < 2) {
					this.somardatasecon()
				}
				this.somardatasecon()
			} else {
				var s = t.slice(0, 0);
				this.getView().byId("secon_diasgozo").setValue(s);
				this.somardatasecon()
			}
		},
		validathird: function (e) {
			var t = this.getView().byId("third_diasgozo").getValue();
			var a = /^[0-9]+$/;
			if (t.match(a)) {
				if (t.length > 2) {
					var i = t.slice(0, 2);
					this.getView().byId("third_diasgozo").setValue(i)
				}
				if (t.length < 2) {
					this.somardatathird()
				}
				this.somardatathird()
			} else {
				var s = t.slice(0, 0);
				this.getView().byId("third_diasgozo").setValue(s);
				this.somardatathird()
			}
		},
		formatterIcon: function (e) {
			var t = jQuery.sap.getModulePath("Y5GL_SOLFER_DHO.Y5GL_SOLFER_DHO");
			var a = t + "/Icones/";
			var i;
			i = a + "FERIAS_DET.png";
			return i
		}
	})
});