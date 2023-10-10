sap.ui.define(["Y5GL_FERI_APRO2/Y5GL_FERI_APRO2/controller/BaseController", "sap/ui/model/json/JSONModel",
	"Y5GL_FERI_APRO2/Y5GL_FERI_APRO2/model/formatter", "sap/ui/Device", "sap/m/Dialog", "sap/m/Button", "sap/m/Text", "sap/ui/core/Fragment",
	"sap/m/Label", "sap/m/Button",
	"sap/m/Dialog", "sap/m/Text", "sap/m/TextArea", "sap/m/CheckBox", "sap/m/Input"
], function (e, t, a, i, s, o, r, d, Label, Button, Dialog, Text, TextArea, CheckBox, Input) {
	"use strict";
	var n, l, g, u, c, I, h, V, b, f, S, Pernr, Index, Endda, Begda, sText, Inicio, DiasGozo

	var g_Begda;
	var g_Endda;
	var data_inicio;
	var dias_gozo;
	var idDataInicio;
	var idDiasGozo;
	var adelanto;
	var adiantamento;

	return e.extend("Y5GL_FERI_APRO2.Y5GL_FERI_APRO2.controller.DetalheFeriasPeru", {
		formatter: a,

		// Para iniciar
		onInit: function () {
			var e = new t({
				busy: false,
				delay: 0
			});
			this.getRouter().getRoute("DetalheFeriasPeru").attachPatternMatched(this._onObjectMatched, this);
			this.setModel(e, "detailView");
			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
			var a = jQuery.sap.getModulePath("Y5GL_FERI_APRO2.Y5GL_FERI_APRO2");
			var i = a + "/imagens/loading.gif";
			this.getView().byId("idimg").setSrc(i);

		},
		
		formatterIcon: function (e) {
			var sRootPath = jQuery.sap.getModulePath("Y5GL_FERI_APRO2.Y5GL_FERI_APRO2");
			var sImagePath = sRootPath + "/Icones/";
			var icone;
			icone = sImagePath + "FERIAS_DET.png";
			return icone;
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

			g_Begda = Begda;
			g_Endda = Endda;

			if (Pernr !== "" && a !== "" && f !== "" && h !== "") {
				this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
				this.getModel().metadataLoaded().then(function () {
					var e = this.getModel().createKey("ZET_GLHR_FERI_PERU_DETALHESet", {
						Endda: Endda,
						Begda: Begda,
						Pernr: Pernr
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
			var smartTable = this.getView().byId("LineItemsSmartTable");
			smartTable.rebindTable("e");
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

		_onMetadataLoaded: function () {
			var e = this.getView().getBusyIndicatorDelay(),
				t = this.getModel("detailView");
			t.setProperty("/delay", 0);
			t.setProperty("/busy", true);
			t.setProperty("/delay", e);
		},

		onbeforeRebindTable: function (oEvent) {

			var Begda = g_Begda;
			var Endda = g_Endda;

			if (Begda) {

				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Begda",
					operator: "EQ",
					value1: Begda
				}));

			}

			if (Endda) {

				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Endda",
					operator: "EQ",
					value1: Endda
				}));

			}

			if (Pernr) {

				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Pernr",
					operator: "EQ",
					value1: Pernr
				}));

			}

			oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
				path: "Tipo",
				operator: "EQ",
				value1: "X"
			}));
		},

		AfterUpdate: function (oEvent) {
			var table2 = this.getView().byId("FERIAS");
			var count = this.getView().byId("FERIAS").getBinding("rows").getLength();
			table2.setVisibleRowCount(count);
		},

		FormatCheck: function (valor) {
			if (valor === "X") {
				return true;
			} else {
				return false;
			}

		},

		FormatEditable: function (Valor) {
			if (Valor) {
				return false;
			} else {
				return true;
			}
		},

		onAprova: function () {

			var table = this.getView().byId("FERIAS");
			var selecionados = table.getSelectedIndices();
			var indice;
			var chave;
			var erro;
			var oEntry = {};
			var oModel = this.getView().getModel();
			var that = this;

			oEntry.Tipo = "A";

			if (selecionados.length === 0 || selecionados.length === "" || selecionados.length === undefined) {
				sap.m.MessageBox.error("Selecione ao menos um registro para aprovar.");
				return;
			} else {

				var dialog = new Dialog({
					title: "Confirmación",
					type: "Message",
					content: new Text({
						text: "¿Confirma la aprobación de los períodos seleccionados?"
					}),
					beginButton: new Button({
						text: "Si",
						press: function () {

							for (var i = 0; i < selecionados.length; i++) {
								indice = table.getContextByIndex([selecionados[i]]);
								oEntry.Adiantamento = indice.getObject().Adiantamento;
								chave = indice.sPath;
								oModel.update(chave, oEntry, {
									success: function (oData, oResponse) {
										sap.m.MessageBox.success("Períodos aprovados com exito.", {
											actions: ["OK", sap.m.MessageBox.Action.CLOSE],
											onClose: function (sAction) {
												adiantamento = "";
												data_inicio = "";
												dias_gozo = "";
												that.getView().getModel().refresh(true);
											}
										});
									},
									error: function (oError) {
										var erro = oError;
										erro = erro.responseText;
										var erro2 = JSON.parse(erro);
										var messagem = erro2.error.message.value;
										sap.m.MessageBox.error(messagem, {
											actions: ["OK", sap.m.MessageBox.Action.CLOSE],
											onClose: function (sAction) {}
										});
										return;
									}
								});
							}
							dialog.close();
						}
					}),
					endButton: new Button({
						text: "No",
						press: function () {
							dialog.close();
						}
					}),
					afterClose: function () {
						dialog.destroy();
					}
				});
				dialog.open();
			}

		},

		onReprova: function () {

			var table = this.getView().byId("FERIAS");
			var selecionados = table.getSelectedIndices();
			var indice;
			var chave;
			var erro;
			var oEntry = {};
			var oModel = this.getView().getModel();
			var that = this;

			oEntry.Tipo = "R";

			if (selecionados.length === 0 || selecionados.length === "" || selecionados.length === undefined) {
				sap.m.MessageBox.error("Selecione ao menos um período para reprovar.");
				return;
			} else {

				var dialog = new Dialog({
					title: "Confirmação",
					type: "Message",
					content: new Text({
						text: "Confirma a reprovação dos períodos selecionados?"
					}),
					beginButton: new Button({
						text: "Sim",
						press: function () {

							for (var i = 0; i < selecionados.length; i++) {
								indice = table.getContextByIndex([selecionados[i]]);
								chave = indice.sPath;
								oModel.update(chave, oEntry, {
									success: function (oData, oResponse) {
										sap.m.MessageBox.success("Períodos reprovados com sucesso.", {
											actions: ["OK", sap.m.MessageBox.Action.CLOSE],
											onClose: function (sAction) {
												adiantamento = "";
												data_inicio = "";
												dias_gozo = "";
												that.getView().getModel().refresh(true);
											}
										});
									},
									error: function (oError) {
										var erro = oError;
										erro = erro.responseText;
										var erro2 = JSON.parse(erro);
										var messagem = erro2.error.message.value;
										sap.m.MessageBox.error(messagem, {
											actions: ["OK", sap.m.MessageBox.Action.CLOSE],
											onClose: function (sAction) {}
										});
										return;
									}
								});
							}
							dialog.close();
						}
					}),
					endButton: new Button({
						text: "Não",
						press: function () {
							dialog.close();
						}
					}),
					afterClose: function () {
						dialog.destroy();
					}
				});
				dialog.open();
			}
		},

		onEdita: function () {
			var table = this.getView().byId("FERIAS");
			var selecionados = table.getSelectedIndices();
			var indice;
			var chave;
			var erro;
			var oEntry = {};
			var oModel = this.getView().getModel();
			var that = this;

			var that = this;

			if (selecionados.length === 0 || selecionados.length === "" || selecionados.length === undefined) {
				sap.m.MessageBox.error("Seleciona um registro para editar.");
				return;
			} else {

				indice = table.getContextByIndex(selecionados);
				chave = indice.sPath;
				var dialog = "";
				dialog = new Dialog({
					title: "Período de edição",
					type: "Message",
					content: [
						new Label({
							text: "Inicio:",
							labelFor: "submitDialogTextarea"
						}),
						new Input("submitDialogTextarea", {
							liveChange: function (oEvent) {
								sText = oEvent.getParameter("value");
								Inicio = sText;
							},
							width: "100%",
							type: "Date"
						}),
						new Label({
							text: "Dias gozo",
							labelFor: "idDiasDisfrute"
						}),
						new Input("idDiasDisfrute", {
							liveChange: function (oEvent) {
								sText = oEvent.getParameter("value");
								DiasGozo = sText;

								var parent = oEvent.getSource().getParent();
								parent.getBeginButton().setEnabled(sText.length > 0);
							},
							width: "100%",
						}),
						new CheckBox("IdAdelantoo", {
							text: "Adelanto",
							select: function (oEvent) {
								adelanto = oEvent.getParameter("selected");
							},
							width: "100%",
						})
					],
					beginButton: new Button({
						text: "Gravar",
						enabled: false,
						press: function () {

							DiasGozo = parseInt(DiasGozo);

							oEntry.Inicio = Inicio;
							oEntry.DiasGozo = DiasGozo;
							oEntry.Tipo = "Q";
							if (adelanto === true) {
								oEntry.Adiantamento = 'X';
							} else {
								oEntry.Adiantamento = '';
							}
							adelanto = '';

							oModel.update(chave, oEntry, {
								success: function (oData, oResponse) {

									sap.m.MessageBox.success(
										"Solicitação enviada com exito", {
											actions: ["OK"],
											onClose: function (sAction) {
												adiantamento = "";
												data_inicio = "";
												dias_gozo = "";
												that.getView().getModel().refresh(true);
											}
										});
								},
								error: function (oError) {
									var erro = oError;
									erro = erro.responseText;
									var erro2 = JSON.parse(erro);
									var messagem = erro2.error.message.value;
									sap.m.MessageBox.error(messagem, {
										actions: ["OK"],
										onClose: function (sAction) {}
									});
									return;
								}
							});

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
			}
		},

		ChangeDataInicio: function (oEvent) {

			idDataInicio = oEvent.mParameters.id;

			this.getView().byId("idAprovar").setVisible(false);
			this.getView().byId("idReprovar").setVisible(false);
			this.getView().byId("idEditar").setVisible(false);

			this.getView().byId("idGravar").setVisible(true);
			this.getView().byId("idCancelar").setVisible(true);

			data_inicio = "";
			var evento = oEvent;
			var valor = evento.getParameters().value;

			data_inicio = valor;

		},

		onChangeDiasGozo: function (oEvent) {
			idDiasGozo = oEvent.mParameters.id;

			this.getView().byId("idAprovar").setVisible(false);
			this.getView().byId("idReprovar").setVisible(false);
			this.getView().byId("idEditar").setVisible(false);

			this.getView().byId("idGravar").setVisible(true);
			this.getView().byId("idCancelar").setVisible(true);

			dias_gozo = "";

			var evento = oEvent;
			var valor = evento.getParameters().value;

			dias_gozo = valor;

		},

		onCancelar: function () {
			dias_gozo = "";
			data_inicio = "";

			this.getView().byId("idAprovar").setVisible(true);
			this.getView().byId("idReprovar").setVisible(true);
			this.getView().byId("idEditar").setVisible(true);

			this.getView().byId("idGravar").setVisible(false);
			this.getView().byId("idCancelar").setVisible(false);

			if (idDiasGozo) {
				this.getView().byId(idDiasGozo).setValue("");
			}

			if (idDataInicio) {
				this.getView().byId(idDataInicio).setValue("");
			}
		},

		onGrava: function () {

			var oModel = this.getView().getModel();
			var key = "";
			var oEntry = {};
			var that = this;

			if (!data_inicio) {
				sap.m.MessageBox.error("Informe a data e início das férias");
				return;
			}

			if (!dias_gozo) {
				sap.m.MessageBox.error("Informe dias de gozo");
				return;
			}

			oEntry.Inicio = data_inicio;

			dias_gozo = parseInt(dias_gozo);
			oEntry.DiasGozo = dias_gozo;
			oEntry.Tipo = "Y";

			if (adiantamento === true) {
				oEntry.Adiantamento = "X";
			} else {
				oEntry.Adiantamento = "";
			}

			key = "/ZET_GLHR_FERI_PERUSet(Pernr='" + Pernr + "',Begda='" + g_Begda + "',Endda='" + g_Endda + "',Seqnr=0)";

			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: "Quer enviar a solicitação de férias?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(key, oEntry, {
							success: function (oData, oResponse) {

								sap.m.MessageBox.success(
									"Solicitação enviada com exito", {
										actions: ["OK"],
										onClose: function (sAction) {
											that.getView().getModel().refresh(true);

											adiantamento = "";
											data_inicio = "";
											dias_gozo = "";

											that.getView().byId("idAprovar").setVisible(true);
											that.getView().byId("idReprovar").setVisible(true);
											that.getView().byId("idEditar").setVisible(true);

											that.getView().byId("idGravar").setVisible(false);
											that.getView().byId("idCancelar").setVisible(false);
										}
									});
							},
							error: function (oError) {
								var erro = oError;
								erro = erro.responseText;
								var erro2 = JSON.parse(erro);
								var messagem = erro2.error.message.value;
								sap.m.MessageBox.error(messagem, {
									actions: ["OK"],
									onClose: function (sAction) {
										//that.getRouter().navTo("Master");
									}
								});

								//sap.m.MessageBox.error("Desculpe, não foi possível realizar sua solicitação, tente novamente em alguns instantes");
								return;
							}
						});
						dialog.close();
					}
				}),
				endButton: new Button({
					text: "Não",
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

		onSelectedAdiant: function (oEvent) {
			selecionado = "";
			var selecionado = oEvent.getParameters().selected;

			adiantamento = selecionado;

		}
	});
});