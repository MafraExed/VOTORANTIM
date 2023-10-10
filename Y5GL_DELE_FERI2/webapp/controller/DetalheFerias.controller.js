sap.ui.define(["Y5GL_DELE_FERI2/Y5GL_DELE_FERI2/controller/BaseController", "sap/ui/model/json/JSONModel",
	"Y5GL_DELE_FERI2/Y5GL_DELE_FERI2/model/formatter", "sap/ui/Device", "sap/m/Dialog", "sap/m/Button", "sap/m/Text", "sap/ui/core/Fragment",
	"sap/m/Label", "sap/m/Button",
	"sap/m/Dialog", "sap/m/Text", "sap/m/TextArea"
], function (e, t, a, i, s, o, r, d, Label, Button, Dialog, Text, TextArea) {
	"use strict";
	var n, l, g, u, c, I, h, V, b, f, S, Pernr, Index, Endda, Begda, sText;
	return e.extend("Y5GL_DELE_FERI2.Y5GL_DELE_FERI2.controller.DetalheFerias", {
		formatter: a,

		// Para iniciar
		onInit: function () {
			var e = new t({
				busy: false,
				delay: 0
			});
			this.getRouter().getRoute("DetalheFerias").attachPatternMatched(this._onObjectMatched, this);
			this.setModel(e, "detailView");
			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
			var a = jQuery.sap.getModulePath("Y5GL_DELE_FERI2.Y5GL_DELE_FERI2");
			var i = a + "/imagens/Transparente_CBA.gif";
			this.getView().byId("idimg").setSrc(i);

		},
		// Fim - Para iniciar

		// para Matched - Inicio
		_onObjectMatched: function (e) {
			this.getView().byId("idPage").scrollTo(0, 0);
			this.getView().getModel().refresh(true);

			Pernr = e.getParameter("arguments").Pernr;
			Index = e.getParameter("arguments").Index;
			Endda = e.getParameter("arguments").Endda;
			Begda = e.getParameter("arguments").Begda;
			if (Pernr !== "" && a !== "" && f !== "" && h !== "") {
				this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
				this.getModel().metadataLoaded().then(function () {
					var e = this.getModel().createKey("ZET_GLHR_PROGRAMARSet", {
						Pernr: Pernr,
						Index: Index,
						Endda: Endda,
						Begda: Begda
					});
					this._bindView("/" + e);
				}.bind(this));
			} else {
				sap.m.MessageBox.success("Não foi possivel determinar rota.");
				return;
			}
		},

		_bindView: function (e) {
			var t = this;
			var a = this.getView().getModel();
			var f;
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
						t.getView().byId("idPage").scrollTo(0, 0);
					}
				}
			});
		},

		_onBindingChange: function (newthis) {
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
			//this.loading(false);
		},
		// Para Matched - FIM

		// Navegações - Inicio
		onVoltar: function (e) {
			this.getRouter().navTo("object", {
				Pernr: Pernr
			});
		},
		// Navegações - Fim

		// Formattters 

		FormatValue: function (e) {
			if (e === "0") {
				return "";
			} else {
				return e;
			}
		},

		FormatVisible: function (oValue) {
			switch (oValue) {
			case "Aprovado":
				return true;
				break;
			case "Homologado":
				return true;
				break;
			case "Em aberto":
				return true;
				break;
			case "Em aprovação":
				return true;
				break;
			default:
				return false;
			}
		},

		FormatAlterar: function (oValue) {
			switch (oValue) {
			case "Aprovado":
				return true;
				break;
			case "Homologado":
				return true;
				break;
			case "Em aprovação":
				return true;
				break;
			default:
				return false;
			}
		},

		FormatAprovar: function (oValue) {
			switch (oValue) {
			case "Homologado":
				return true;
				break;
			case "Em aberto":
				return true;
				break;
			case "Em aprovação":
				return true;
				break;
			default:
				return false;
			}
		},

		FormatPDF: function (oValue) {
			if (oValue === "Aprovado" || oValue === "Homologado") {
				return true;
			} else {
				return false;
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
			this.getRouter().navTo("master")
		},
		toggleFullScreen: function () {
			var e = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !e);
			if (!e) {
				this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
				this.getModel("appView").setProperty("/layout", "MidColumnFullScreen")
			} else {
				this.getModel("appView").setProperty("/layout", this.getModel("appView").getProperty("/previousLayout"))
			}
		},

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
				a = "0"
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
					l.setValue(n)
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
					l.setValue(n)
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
		validacaracter: function (e) {
			var t = this.getView().byId("first_diasgozo").getValue();
			var a = /^[0-9]+$/;
			if (t.match(a)) {
				if (t.length > 2) {
					var i = t.slice(0, 2);
					this.getView().byId("first_diasgozo").setValue(i)
				}
				if (t.length < 2) {
					this.somardatafirst()
				}
				this.somardatafirst()
			} else {
				var s = t.slice(0, 0);
				this.getView().byId("first_diasgozo").setValue(s);
				this.somardatafirst()
			}
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
		AbreDialogSave: function () {
			var e = this;
			if (!e._valueHelpDialog1) {
				e._valueHelpDialog1 = sap.ui.xmlfragment("Y5GL_DELE_FERI2.Y5GL_DELE_FERI2.view.dialog", e);
				e.getView().addDependent(e._valueHelpDialog1)
			}
			e._valueHelpDialog1.open()
		},
		AbreDialogCancel: function () {
			var e = this;
			if (!e._valueHelpDialog2) {
				e._valueHelpDialog2 = sap.ui.xmlfragment("Y5GL_DELE_FERI2.Y5GL_DELE_FERI2.view.dialogCancel", e);
				e.getView().addDependent(e._valueHelpDialog2)
			}
			e._valueHelpDialog2.open()
		},
		FormatChecked: function (e) {
			if (e === "X") {
				return true
			} else {
				return false
			}
		},
		FormatChecked2: function (e) {
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
			switch (e) {
			case "Homologado":
				return false;
				break;
			case "Aprovado":
				return false;
				break;
			case "Em Aberto":
				return false;
				break;
			case "Efetivado":
				return false;
				break;
			case "Em aprovação":
				return false;
				break;
			default:
				return true;
			}
		},

		onAltera1: function () {
			this.getView().byId("IdInicio1").setEditable(true);
			this.getView().byId("first_diasgozo").setEditable(true);
			this.getView().byId("first_13_1").setEditable(true);
			this.getView().byId("first_abono").setEditable(true);

			this.getView().byId("Aprova1").setVisible(true);
		},

		onAltera2: function () {
			this.getView().byId("IdInicio2").setEditable(true);
			this.getView().byId("secon_diasgozo").setEditable(true);
			this.getView().byId("first_13_2").setEditable(true);

			this.getView().byId("Aprova2").setVisible(true);
		},

		onAltera3: function () {
			this.getView().byId("IdInicio3").setEditable(true);
			this.getView().byId("third_diasgozo").setEditable(true);
			this.getView().byId("first_13_3").setEditable(true);

			this.getView().byId("Aprova3").setVisible(true);
		},

		onSelect: function (e) {
			var t = this.getView().byId("first_13_1").getSelected();
			var a = this.getView().byId("first_13_2").getSelected();
			var i = this.getView().byId("first_13_3").getSelected();
			var s = this.getView().byId("first_status").getText();
			var o = this.getView().byId("secon_status").getText();
			var r = this.getView().byId("third_status").getText();
			var d = e.getParameters("id").id;
			var n = d.split("detail--");
			var l = n[1];
			var g = "A solicitação de 13° salário será possivel apenas uma vez!";
			if (l === "first_13_1") {
				if (t === true && s !== "Efetivado") {
					if (a === true || i === true) {
						sap.m.MessageBox.error(g);
						this.getView().byId("first_13_2").setSelected(false);
						this.getView().byId("first_13_3").setSelected(false);
						return
					}
				}
			}
			if (l === "first_13_2") {
				if (a === true && s !== "Efetivado" && o !== "Efetivado") {
					if (t === true || i === true) {
						sap.m.MessageBox.error(g);
						this.getView().byId("first_13_1").setSelected(false);
						this.getView().byId("first_13_3").setSelected(false);
						return
					}
				}
			}
			if (l === "first_13_3") {
				if (i === true && s !== "Efetivado" && o !== "Efetivado" && r !== "Efetivado") {
					if (t === true || a === true) {
						sap.m.MessageBox.error(g);
						this.getView().byId("first_13_1").setSelected(false);
						this.getView().byId("first_13_2").setSelected(false);
						return
					}
				}
			}
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
			this.getView().byId("IdZzestciv").setValue()
		},
		onParentClicked: function (e) {
			var t = e.getParameter("selected");
			var a = this._valueHelpDialog1.getContent()[2];
			var i = this._valueHelpDialog1.getContent()[3];
			var s = this._valueHelpDialog1.getContent()[4];
			if (t === true) {
				a.setSelected(true);
				i.setSelected(true);
				s.setSelected(true)
			} else {
				a.setSelected(false);
				i.setSelected(false);
				s.setSelected(false)
			}
		},
		onParentClickedCancel: function (e) {
			var t = e.getParameter("selected");
			var a = this._valueHelpDialog2.getContent()[2];
			var i = this._valueHelpDialog2.getContent()[3];
			var s = this._valueHelpDialog2.getContent()[4];
			if (t === true) {
				a.setSelected(true);
				i.setSelected(true);
				s.setSelected(true)
			} else {
				a.setSelected(false);
				i.setSelected(false);
				s.setSelected(false)
			}
		},
		onSelectedCheck_1: function (e) {
			var t = e.getSource().getId();
			var a = this._valueHelpDialog1.getContent()[0];
			var i = this._valueHelpDialog1.getContent()[2].getSelected();
			var s = this._valueHelpDialog1.getContent()[3].getSelected();
			var o = this._valueHelpDialog1.getContent()[4].getSelected();
			if (i === true && s === true && o === true) {
				a.setSelected(true)
			} else {
				a.setSelected(false)
			}
			var r = this.getView().byI("IdInicio1").getValue();
			var d = this.getView().byId("first_diasgozo").getValue();
			if (r !== "" || d !== "") {
				i.setSelected(true)
			}
		},
		onSelectedCheckCancel: function (e) {
			var t = e.getSource().getId();
			var a = this._valueHelpDialog2.getContent()[0];
			var i = this._valueHelpDialog2.getContent()[2].getSelected();
			var s = this._valueHelpDialog2.getContent()[3].getSelected();
			var o = this._valueHelpDialog2.getContent()[4].getSelected();
			if (i === true && s === true && o === true) {
				a.setSelected(true)
			} else {
				a.setSelected(false)
			}
		},
		onConfirmaDialog: function () {
			var e = this._valueHelpDialog1.getContent()[2].getSelected();
			var t = this._valueHelpDialog1.getContent()[3].getSelected();
			var a = this._valueHelpDialog1.getContent()[4].getSelected();
			if (e !== true && t !== true && a !== true) {
				sap.m.MessageBox.error("Deverá ser selecionado ao menos um periodo");
				return
			}
			this.onSave(e, t, a)
		},
		onConfirmaDialogCancel: function () {
			var e = this._valueHelpDialog2.getContent()[2].getSelected();
			var t = this._valueHelpDialog2.getContent()[3].getSelected();
			var a = this._valueHelpDialog2.getContent()[4].getSelected();
			if (e !== true && t !== true && a !== true) {
				sap.m.MessageBox.error("Deverá ser selecionado ao menos um periodo");
				return
			}
			this.onCancel(e, t, a)
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
			if (e === true && f === "Em aprovação") {
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
			if (t === true && S === "Em aprovação") {
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
			if (a === true && y === "Em aprovação") {
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
						i._valueHelpDialog2.destroy();
					}
				});
				return;
			}
			var w = new s({
				title: "Confirmação",
				type: "Message",
				content: new r({
					text: "Deseja cancelar a solicitação de Férias?"
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
						w.close();
					}
				}),
				endButton: new o({
					text: "Não",
					press: function () {
						w.close();
					}
				}),
				afterClose: function () {
					w.destroy();
					i._valueHelpDialog2.close();
				}
			});
			w.open();
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
				if (u === true) {
					g.Abono1 = "X";
					g.DiasAbono1 = "10"
				} else {
					g.Abono1 = " "
				}
				if (c === true) {
					g.SolParc131 = "X"
				}
				g.Acao1 = "X"
			} else {
				this.getView().byId("IdInicio1").setValueState("None");
				this.getView().byId("first_diasgozo").setValueState("None");
				this.getView().byId("IdFim1").setValueState("None")
			}
			if (t === true) {
				g.Inicio2 = this.getView().byId("IdInicio2").getValue();
				g.DiasGozo2 = this.getView().byId("secon_diasgozo").getValue();
				g.Fim2 = this.getView().byId("IdFim2").getValue();
				if (I === true) {
					g.SolParc132 = "X"
				}
				g.Acao2 = "X"
			} else {
				this.getView().byId("IdInicio2").setValueState("None");
				this.getView().byId("secon_diasgozo").setValueState("None");
				this.getView().byId("IdFim2").setValueState("None")
			}
			if (a === true) {
				g.Inicio3 = this.getView().byId("IdInicio3").getValue();
				g.DiasGozo3 = this.getView().byId("third_diasgozo").getValue();
				g.Fim3 = this.getView().byId("IdFim3").getValue();
				if (h === true) {
					g.SolParc133 = "X"
				}
				g.Acao3 = "X"
			} else {
				this.getView().byId("IdInicio3").setValueState("None");
				this.getView().byId("third_diasgozo").setValueState("None");
				this.getView().byId("IdFim3").setValueState("None")
			}
			if (V === 1) {
				sap.m.MessageBox.error("Existem informações não preenchidas.", {
					actions: ["OK"],
					onClose: function (e) {
						i._valueHelpDialog1.close()
					}
				});
				return
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
						f.close()
					}
				}),
				endButton: new o({
					text: "Não",
					press: function () {
						f.close()
					}
				}),
				afterClose: function () {
					f.destroy();
					i._valueHelpDialog1.close()
				}
			});
			f.open()
		},
		onCancelaDialog: function () {
			this._valueHelpDialog1.close()
		},
		onCancelaDialogCancel: function () {
			this._valueHelpDialog2.close()
		},
		FormatVisibleCheck1: function () {
			var e = this.getView().byId("first_status").getText();
			if (e === "Em aprovação") {
				return true
			} else {
				return false
			}
		},
		FormatVisibleCheck2: function () {
			var e = this.getView().byId("secon_status").getText();
			if (e === "Em aprovação") {
				return true
			} else {
				return false
			}
		},
		FormatVisibleCheck3: function () {
			var e = this.getView().byId("third_status").getText();
			if (e === "Em aprovação") {
				return true;
			} else {
				return false;
			}
		},

		onAprova: function (oEvent) {
			var id = oEvent.getParameter("id");
			var split = id.split("DetalheFerias--");
			var idnew = split[1];
			var acao = "A";

			var periodo;
			switch (idnew) {
			case "Aprova1":
				periodo = 1;
				break;
			case "Aprova2":
				periodo = 2;
				break;
			case "Aprova3":
				periodo = 3;
				break;
			}

			this.save(a, b, c, periodo, acao);
		},

		onReprova: function (oEvent) {
			var that = this;
			var id = oEvent.getParameter("id");
			var split = id.split("DetalheFerias--");
			var idnew = split[1];
			var acao = "R";
			var dialog = "";
			dialog = new Dialog({
				title: "Motivo da reprovação",
				type: "Message",
				content: [
					new Label({
						text: "Descreva o motivo da reprovação:",
						labelFor: "submitDialogTextarea"
					}),
					new TextArea("submitDialogTextarea", {
						liveChange: function (oEvent) {
							sText = oEvent.getParameter("value");
							var parent = oEvent.getSource().getParent();

							parent.getBeginButton().setEnabled(sText.length > 0);
						},
						width: "100%",
						placeholder: "Digite aqui."
					})
				],
				beginButton: new Button({
					text: "Enviar",
					enabled: false,
					press: function () {

						var periodo;
						switch (idnew) {
						case "Reprova1":
							periodo = 1;
							break;
						case "Reprova2":
							periodo = 2;
							break;
						case "Reprova3":
							periodo = 3;
							break;
						}
						that.save(a, b, c, periodo, acao);
						dialog.close();
					}
				}),
				endButton: new Button({
					text: "Cancelar",
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.open();
		},

		save: function (e, t, a, periodo, acao) {
			var i = this;
			var d = Index;
			var n = Pernr;
			var l = "/ZET_GLHR_ESS_FERIASSet(Index=" + d + ",Pernr='" + n + "',Acao='" + acao + "')";
			var g = {};
			var u = this.getView().byId("first_abono").getSelected();
			var c = this.getView().byId("first_13_1").getSelected();
			var I = this.getView().byId("first_13_2").getSelected();
			var h = this.getView().byId("first_13_3").getSelected();
			var V = 0;
			var b = this.getView().getModel();
			var messagem_erro;
			var messagem_pergunta;
			var messagem_sucesso;
			var first_status = this.getView().byId("first_status").getText();
			var secon_status = this.getView().byId("secon_status").getText();
			var third_status = this.getView().byId("third_status").getText();
			var msg_pendente;
			var pendente;
			var Elemento;

			if (acao === "A") {
				messagem_erro = "Não existem informações a serem aprovadas.";
				messagem_pergunta = "Confirma a aprovação de férias ?";
				messagem_sucesso = "Aprovação realizada com sucesso!";
				msg_pendente = "Férias aprovadas com sucesso! \n \n Este empregado possui outros periodos pendentes para aprovação, deseja continuar?";
			}

			if (acao === "R") {
				messagem_erro = "Não existem informações a serem reprovadas.";
				messagem_pergunta = "Confirma a reprovação de férias ?";
				messagem_sucesso = "Reprovação realizada com sucesso!";
				msg_pendente = "Férias reprovadas com sucesso! \n \n Este empregado possui outros periodos pendentes para aprovação, deseja continuar?";
			}

			
			pendente = "Em aprovação";

			e = true;
			t = true;
			a = true;

			switch (periodo) {
			case 1:
				g.Acao1 = "X";
				if (secon_status === pendente || third_status === pendente) {
					messagem_sucesso = msg_pendente;
					
					if (secon_status === pendente){
						Elemento = "Scroll2";
					}
					
					if (third_status === pendente){
						Elemento = "Scroll3";
					}
				}
				break;
			case 2:
				g.Acao2 = "X";
				if (first_status === pendente || third_status === pendente) {
					messagem_sucesso = msg_pendente;
					
					if (first_status === pendente){
						Elemento = "Scroll1";
					}
					
					if (third_status === pendente){
						Elemento = "Scroll3";
					}
				}
				break;
			case 3:
				g.Acao3 = "X";
				if (first_status === pendente || secon_status === pendente) {
					messagem_sucesso = msg_pendente;
					
					if (first_status === pendente){
						Elemento = "Scroll1";
					}
					
					if (secon_status === pendente){
						Elemento = "Scroll2";
					}
				}
				break;
			}

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
				g.Mensagem = sText;

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

				g.Mensagem = sText;
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

				g.Mensagem = sText;
			} else {
				this.getView().byId("IdInicio3").setValueState("None");
				this.getView().byId("third_diasgozo").setValueState("None");
				this.getView().byId("IdFim3").setValueState("None");
			}
			if (V === 1) {
				sap.m.MessageBox.error("Existem informações não preenchidas.", {
					actions: ["OK"],
					onClose: function (e) {}
				});
				return;
			}
			var f = new s({
				title: "Confirmação",
				type: "Message",
				content: new r({
					text: messagem_pergunta
				}),
				beginButton: new o({
					text: "Sim",
					press: function () {
						i.loading(true);
						b.update(l, g, {
							success: function (e, t) {

								if (messagem_sucesso === msg_pendente) {
									sap.m.MessageBox.warning(messagem_sucesso, {
										actions: ["Sim", sap.m.MessageBox.Action.CLOSE],
										onClose: function (e) {
											i.getView().getModel().refresh(true);
										}
									});
								} else {
									sap.m.MessageBox.success(messagem_sucesso, {
										actions: ["OK"],
										onClose: function (e) {
											i.getView().getModel().refresh(true);
										}
									});
								}
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
				}
			});
			f.open();
		},

		onDownload: function () {
			var Infty = "0";
			var Subty = "0";
			var Periodo = "99.9999";
			var Adiantamento = "0";
			var Tipo = "H";
			var Favor = "0";
			var Data = this.getView().byId("IdInicio1").getValue();
			while (Data.indexOf("-") !== -1) {
				Data = Data.replace("-", "");
			}

			//var url = "/sap/opu/odata/sap/ZGWGLRH_MEU_CADASTRO_SRV/ZET_GLHR_UPFILESet(PERNR/INFOTIPO/SUBTIPO/PERIODO/ADIANTAMENTO/TIPO/FAVOR/DATA)/$value";

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

		onDownload2: function () {
			var Infty = "0";
			var Subty = "0";
			var Periodo = "99.9999";
			var Adiantamento = "0";
			var Tipo = "H";
			var Favor = "0";
			var Data = this.getView().byId("IdInicio2").getValue();
			while (Data.indexOf("-") !== -1) {
				Data = Data.replace("-", "");
			}

			//var url = "/sap/opu/odata/sap/ZGWGLRH_MEU_CADASTRO_SRV/ZET_GLHR_UPFILESet(PERNR/INFOTIPO/SUBTIPO/PERIODO/ADIANTAMENTO/TIPO/FAVOR/DATA)/$value";

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

		onDownload3: function () {
			var Infty = "0";
			var Subty = "0";
			var Periodo = "99.9999";
			var Adiantamento = "0";
			var Tipo = "H";
			var Favor = "0";
			var Data = this.getView().byId("IdInicio3").getValue();
			while (Data.indexOf("-") !== -1) {
				Data = Data.replace("-", "");
			}

			//var url = "/sap/opu/odata/sap/ZGWGLRH_MEU_CADASTRO_SRV/ZET_GLHR_UPFILESet(PERNR/INFOTIPO/SUBTIPO/PERIODO/ADIANTAMENTO/TIPO/FAVOR/DATA)/$value";

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
		
		formatterIcon: function (e) {
			var sRootPath = jQuery.sap.getModulePath("Y5GL_DELE_FERI2.Y5GL_DELE_FERI2");
			var sImagePath = sRootPath + "/Icones/";
			var icone;
			icone = sImagePath + "FERIAS_DET.png";
			return icone;
		}
	});
});