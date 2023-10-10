sap.ui.define(["Y5GL_DHO/Y5GL_DHO/controller/BaseController", "sap/ui/Device", "sap/m/Dialog", "sap/m/Button", "sap/m/Text",
		"sap/ui/model/Filter", "sap/m/Label", "sap/m/TextArea", "sap/m/ButtonType"
	],

	function (BaseController, Device, Dialog, Button, Text, Filter, Label, TextArea, ButtonType) {
		"use strict";

		var param, edit, dep, chaveacao, via2, Cancela, Pernr, chamado;
		var operacao = "";

		return BaseController.extend("Y5GL_DHO.Y5GL_DHO.controller.BENEFICIOS_DETAIL", {

			onInit: function () {

				this.getRouter().getRoute("BENEFICIOS_DETAIL").attachPatternMatched(this._onObjectMatched, this);

				var sName = sap.ushell.Container.getUser().getFullName();
				this.getView().byId("idTitleDep").setText(sName);

				// Image loading
				var sRootPath = jQuery.sap.getModulePath("Y5GL_DHO.Y5GL_DHO");
				var sImagePath = sRootPath + "/imagens/loading.gif";
				this.getView().byId("idimg").setSrc(sImagePath);
			},

			formatVisibleMsg: function (oValue) {
				if (oValue === "Em ResoluÃ§Ã£o") {
					return true;
				} else {
					return false;
				}
			},

			FormatEditable: function (oValue) {
				return true;
			},

			FormatValor: function (oValue) {
				if (oValue === "" || oValue === undefined) {
					return 2;
				} else {
					return oValue;
				}
			},

			formathighlight: function (oValue) {
				if (oValue === "X") {
					return "Success";
				} else {
					return "Error";
				}
			},

			formatVisiblebButton: function (oValue) {
				if (oValue === "Em ResoluÃ§Ã£o") {
					return true;
				} else {
					return false;
				}
			},

			FormatBV: function (oValue) {
				if (oValue === "Em ResoluÃ§Ã£o" || oValue === "") {
					return false;
				} else {
					return true;
				}
			},

			formatVisibleEdit: function (oValue) {
				if (oValue === "Em ResoluÃ§Ã£o" || oValue === "X") {
					return false;
				} else {
					return true;
				}
			},

			formatVisibleEditOpcoes: function (oValue) {
				if (oValue === "Em ResoluÃ§Ã£o") {
					if (param === "SEGURO_VIDA") {
						return true;
					} else {
						return false;
					}
				} else {
					return true;
				}

			},

			onchangeOpcoesSeguroVida: function (oEvent) {
				var infty = "0168";
				var subty = "VIDA";
				var Valor = this.getView().byId("IdOpcoes_SEGURO_DE_VIDA").getSelectedKey();

				var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr);
				var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
				var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, subty);
				var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "U");
				var oFilterValor = new sap.ui.model.Filter("Valor", sap.ui.model.FilterOperator.EQ, Valor);
				var oList = this.getView().byId("UploadCollection");
				oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo, oFilterValor]);
				oList.getBinding("items").refresh(true);
			},

			FormatForm: function (oValue) {
				return false;
			},

			OnDelete: function () {
				var oModel = this.getView().getModel();
				var oListBase = this.getView().byId("smartTable").getTable();
				var items = oListBase._aSelectedPaths;
				var length = items.length;
				var menssagem = "Confirma a exclusão do dependente no plano?";
				var oEntry = {};
				var Concatenate = "E$";
				var Subty, Objps, Key;
				var Beneficio = param;
				var that = this;

				if (length === 0) {
					sap.m.MessageBox.error("Não existem dependentes marcados para inclusão");
					return;
				}

				var dialog = new Dialog({
					title: "Confirmação",
					type: "Message",
					content: new Text({
						text: menssagem
					}),
					beginButton: new Button({
						text: "Sim",
						press: function () {
							for (var i = 0; i < length; i++) {
								var chave = items[i];
								Subty = chave.split(",");
								Subty = Subty[2];
								Subty = Subty.split("Subty=");
								Subty = Subty[1];
								while (Subty.indexOf("'") !== -1) {
									Subty = Subty.replace("'", "");
								}
								if (Subty < 10) {
									Subty = "0" + Subty;
								}

								Objps = chave.split(",");
								Objps = Objps[3];
								Objps = Objps.split("Objps=");
								Objps = Objps[1];
								while (Objps.indexOf("'") !== -1) {
									Objps = Objps.replace("'", "");
								}
								while (Objps.indexOf(")") !== -1) {
									Objps = Objps.replace(")", "");
								}

								if (Objps === "") {
									Objps = "00";
								}

								Concatenate = Concatenate + Subty + "-" + Objps + "$";
							}
							Key = "/ZET_GLHR_DETAIL_BENEFICIOSSet(Pernr='" + Pernr + "',Beneficio='" + Beneficio + "',Tipo='G')";
							oEntry.Dependentes = Concatenate;

							switch (param) {
							case "PLANO_MEDICO":
								oEntry.Bplan = that.getView().byId("IdPlano_PLANO_MEDICO").getSelectedKey();

								if (oEntry.Bplan === "") {
									that.getView().byId("IdPlano_PLANO_MEDICO").setValueState("Error");
									sap.m.MessageBox.error("Informe o plano");
									return;
								} else {
									that.getView().byId("IdPlano_PLANO_MEDICO").setValueState("Success");
								}

								oEntry.Opcoes = that.getView().byId("IdOpcoes_PLANO_MEDICO").getSelectedKey();

								if (oEntry.Opcoes === "") {
									that.getView().byId("IdOpcoes_PLANO_MEDICO").setValueState("Error");
									sap.m.MessageBox.error("Informe a opção do plano");
									return;
								} else {
									that.getView().byId("IdPlano_PLANO_MEDICO").setValueState("Success");
								}

								oEntry.CartMedica = that.getView().byId("idCartMedica").getValue();

								break;
							}

							oModel.update(Key, oEntry, {
								success: function (oData, oResponse) {
									sap.m.MessageBox.success("Benefício salvo com sucesso.", {
										actions: ["OK", sap.m.MessageBox.Action.CLOSE],
										onClose: function (sAction) {
											that.getView().getModel().refresh(true);
											that.getView().byId("TextInclusao").setVisible(false);
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

			_onObjectMatched: function (oEvent) {
				this.getView().getModel().refresh(true);
				var Beneficio = oEvent.getParameter("arguments").Beneficio;
				chamado = oEvent.getParameter("arguments").Chamado;
				Pernr = oEvent.getParameter("arguments").Pernr;
				var Descricao = oEvent.getParameter("arguments").Zdesc;
				var Bplan, Opcoes, Tipo;
				this.getView().byId("idTitleDependentes").setText(Descricao);

				param = Beneficio;

				Tipo = "V";

				this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
				this.getModel().metadataLoaded().then(function () {
					var sObjectPath = this.getModel().createKey("ZET_GLHR_EC_CSC_BENEFICIOSSet", {
						Pernr: Pernr,
						Beneficio: Beneficio,
						Tipo: Tipo,
						Chamado: chamado
					});
					this._bindView("/" + sObjectPath);
				}.bind(this));
			},

			onBackMaster: function () {
				this.getView().getModel().refresh(true);
				this.getView().byId("IdCancelDetailDep").setVisible(false);
				this.getRouter().navTo("master");
			},

			onchangeIdMargemEmp: function (oEvent) {
				var that = this;
				var number, numero_aux;
				var numero = oEvent.getParameter("value");
				var oEvent_id = oEvent.getParameter("id");
				var id = oEvent_id.split("DETAIL--")[1];

				numero_aux = numero;

				while (numero.indexOf(",") !== -1) {
					numero = numero.replace(",", ".");
				}

				number = !isNaN(numero);

				if (number === true) {
					numero = this.adicionarpontoFloat(numero_aux);

					this.getView().byId(id).setValue(numero);
				} else {
					sap.m.MessageBox.error("O valor informado deverá ser um número.", {
						actions: ["OK", sap.m.MessageBox.Action.CLOSE],
						onClose: function (sAction) {
							that.getView().byId("IdMargemEmp").setValue();
						}
					});
				}
			},

			onVoltar: function () {
				var bReplace, Zdesc;

				bReplace = !Device.system.phone;
				Zdesc = "worklist";
				this.getRouter().navTo(Zdesc, bReplace);

			},

			onCancel: function () {
				var dialog;
				var that = this;
				dialog = new Dialog({
					title: "Confirma\xE7\xE3o",
					type: "Message",
					content: new Text({
						text: "Deseja cancelar a alteração?"
					}),
					beginButton: new Button({
						text: "Sim",
						press: function () {
							that.Cancela();
							that.getView().byId("TextInclusao").setVisible(false);
							dialog.close();
						}
					}),
					endButton: new Button({
						text: "N\xE3o",
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

			Cancela: function () {
				var that = this;
				that.getView().getModel().refresh(true);

				switch (param) {
				case "PLANO_MEDICO":
					that.getView().byId("TextInclusao").setVisible(false);
					that.getView().byId("TextExclusao").setVisible(false);
					that.getView().byId("TextInclusao_PLANO_ODONTOLOGICO").setVisible(false);
					break;
				case "PLANO_ODONTOLOGICO":
					that.getView().byId("TextInclusao_PLANO_ODONTOLOGICO").setVisible(false);
					that.getView().byId("TextInclusao").setVisible(false);
					that.getView().byId("TextExclusao").setVisible(false);
					break;
				}

				that.getView().byId("IdCancelDetailDep").setVisible(false);
				that.getView().byId("IdIncluir").setVisible(false);

			},

			FormatIcon: function (oValue) {
				if (oValue !== null) {
					if (oValue === "Não") {
						return "sap-icon://add";
					} else if (oValue === "Sim") {
						return "sap-icon://delete";
					}
				}
			},

			FormatBVisible: function (oValue) {
				if (oValue !== null) {
					if (oValue === "Não" || oValue === "Sim") {
						return true;
					} else {
						return false;
					}
				}
			},

			FormatIncluir: function (oValue) {
				var table = this.getView().byId("table1");
				var count = table.getBinding("rows").getLength();
				var indice = 0;
				var Ativo;

				for (indice; indice < count; indice++) {
					Ativo = table.getRows()[indice].getCells()[1].getText();
					if (Ativo === "Sim") {
						return true;
					} else {
						return false;
					}
				}
			},

			FormatExcluir: function (oValue) {
				if (oValue === "Não") {
					return false;
				} else {
					return true;
				}
			},

			formatEditableUpload: function (oValue) {
				var idCartMedica = this.getView().byId("idVia2medico").getText();
				var IdCartDentista = this.getView().byId("idVia2Dent").getText();

				if (oValue === "Em ResoluÃ§Ã£o") {
					if (idCartMedica === "X" || IdCartDentista === "X") {
						return false;
					} else {
						return true;
					}
				} else {
					return false;
				}
			},

			onSave: function (via2) {
				var dialog, Tipo;
				var oModel = this.getView().getModel();
				var oEntry = {};
				var that = this;
				var Beneficio = param;

				if (Cancela === "C") {
					Tipo = Cancela;
				} else {
					Tipo = "D";
				}

				var Key = "/ZET_GLHR_DETAIL_BENEFICIOSSet(Pernr='" + Pernr + "',Beneficio='" + Beneficio + "',Tipo='" + Tipo + "')";
				var validaoutros = 0;

				switch (Beneficio) {
				case "FUNSEJEM":
					oEntry.Bplan = this.getView().byId("IdPlano_FUNSEJEM").getSelectedKey();

					if (oEntry.Bplan === "") {
						this.getView().byId("IdPlano_FUNSEJEM").setValueState("Error");
						sap.m.MessageBox.error("Informe o plano");
						return;
					} else {
						this.getView().byId("IdPlano_FUNSEJEM").setValueState("Success");
					}

					oEntry.MargemFunsejem = this.getView().byId("IdMargemEmp").getValue();
					if (oEntry.MargemFunsejem !== "") {
						while (oEntry.MargemFunsejem.indexOf(".") !== -1) {
							oEntry.MargemFunsejem = oEntry.MargemFunsejem.replace(".", "");
						}
						oEntry.MargemFunsejem = oEntry.MargemFunsejem.replace(",", ".");
					}
					break;
				case "PLANO_MEDICO":
					oEntry.Bplan = this.getView().byId("IdPlano_PLANO_MEDICO").getSelectedKey();

					if (oEntry.Bplan === "") {
						this.getView().byId("IdPlano_PLANO_MEDICO").setValueState("Error");
						sap.m.MessageBox.error("Informe o plano");
						return;
					} else {
						this.getView().byId("IdPlano_PLANO_MEDICO").setValueState("Success");
					}

					oEntry.Opcoes = that.getView().byId("IdOpcoes_PLANO_MEDICO").getSelectedKey();

					if (oEntry.Opcoes === "") {
						that.getView().byId("IdOpcoes_PLANO_MEDICO").setValueState("Error");
						sap.m.MessageBox.error("Informe a opção do plano");
						return;
					} else {
						that.getView().byId("IdPlano_PLANO_MEDICO").setValueState("Success");
					}

					oEntry.CartMedica = this.getView().byId("idCartMedica").getValue();

					if (via2 === "X") {
						oEntry.Via2medico = via2;
					}

					break;
				case "PLANO_ODONTOLOGICO":
					oEntry.Operation = this.getView().byId("idOperation").getValue();

					oEntry.Bplan = this.getView().byId("IdPlano_PLANO_ODONTOLOGICO").getSelectedKey();

					if (oEntry.Bplan === "") {
						this.getView().byId("IdPlano_PLANO_ODONTOLOGICO").setValueState("Error");
						sap.m.MessageBox.error("Informe o plano");
						return;
					} else {
						this.getView().byId("IdPlano_PLANO_ODONTOLOGICO").setValueState("Success");
					}

					oEntry.Opcoes = this.getView().byId("IdOpcoes_PLANO_ODONTOLOGICO").getSelectedKey();

					if (oEntry.Opcoes === "") {
						this.getView().byId("IdOpcoes_PLANO_ODONTOLOGICO").setValueState("Error");
						sap.m.MessageBox.error("Informe o plano");
						return;
					} else {
						this.getView().byId("IdOpcoes_PLANO_ODONTOLOGICO").setValueState("Success");
					}

					oEntry.CartDentista = this.getView().byId("IdCartDentista").getValue();
					oEntry.Valor = Cancela;

					if (via2 === "X") {
						oEntry.Via2Dent = via2;
					}

					oEntry.Depcv = this.getView().byId("IdOpcoes_DEPCV").getSelectedKey();

					if (oEntry.Depcv === "") {
						this.getView().byId("IdOpcoes_DEPCV").setValueState("Error");
						sap.m.MessageBox.error("Informe a Cobertura de dependentes");
						return;
					} else {
						this.getView().byId("IdOpcoes_DEPCV").setValueState("Success");
					}

					break;
				case "SEGURO_VIDA":
					oEntry.Bplan = this.getView().byId("IdPlano_SEGURO_DE_VIDA").getSelectedKey();

					if (oEntry.Bplan === "") {
						this.getView().byId("IdPlano_SEGURO_DE_VIDA").setValueState("Error");
						sap.m.MessageBox.error("Informe o plano");
						return;
					} else {
						this.getView().byId("IdPlano_SEGURO_DE_VIDA").setValueState("Success");
					}

					oEntry.Opcoes = this.getView().byId("IdOpcoes_SEGURO_DE_VIDA").getSelectedKey();

					if (oEntry.Opcoes === "") {
						this.getView().byId("IdOpcoes_SEGURO_DE_VIDA").setValueState("Error");
						sap.m.MessageBox.error("Selecione entre as opções");
						return;
					} else {
						this.getView().byId("IdOpcoes_SEGURO_DE_VIDA").setValueState("Success");
					}
					break;
				case "TRANSPORTE":
					oEntry.Bplan = this.getView().byId("IdPlano_VALE_TRANSPORTE").getSelectedKey();

					if (oEntry.Bplan === "") {
						this.getView().byId("IdPlano_VALE_TRANSPORTE").setValueState("Error");
						sap.m.MessageBox.error("Informe o plano");
						return;
					} else {
						this.getView().byId("IdPlano_VALE_TRANSPORTE").setValueState("Success");
					}
					break;
				case "VALE_REFEICAO":
					oEntry.Bplan = this.getView().byId("IdPlano_VALE_REFEICAO").getSelectedKey();

					if (oEntry.Bplan === "") {
						this.getView().byId("IdPlano_VALE_REFEICAO").setValueState("Error");
						sap.m.MessageBox.error("Informe o plano");
						return;
					} else {
						this.getView().byId("IdPlano_VALE_REFEICAO").setValueState("Success");
					}

					oEntry.Opcoes = this.getView().byId("IdOpcoes_VALE_REFEICAO").getSelectedKey();

					if (oEntry.Opcoes === "") {
						this.getView().byId("IdOpcoes_VALE_REFEICAO").setValueState("Error");
						sap.m.MessageBox.error("Informe a opção");
						return;
					} else {
						this.getView().byId("IdOpcoes_VALE_REFEICAO").setValueState("Success");
					}
					break;
				case "AUXILIO_CRECHE":
					var Valor = this.getView().byId("IdPlano_AUXILIO_CRECHE").getSelectedKey();

					if (Valor === "") {
						this.getView().byId("IdPlano_AUXILIO_CRECHE").setValueState("Error");
						sap.m.MessageBox.error("Informe o mês de referência");
						return;
					} else {
						this.getView().byId("IdPlano_AUXILIO_CRECHE").setValueState("Success");
					}
					oEntry.Valor = this.getView().byId("IdPlano_AUXILIO_CRECHE").getSelectedKey();

					break;
				case "COOPERATIVA":
					oEntry.Rubrica = this.getView().byId("IdRubrica_COOPERATIVA").getValue();

					if (oEntry.Rubrica === "") {
						this.getView().byId("IdRubrica_COOPERATIVA").setValueState("Error");
						sap.m.MessageBox.error("Informe a Rubrica");
						return;
					} else {
						this.getView().byId("IdRubrica_COOPERATIVA").setValueState("Success");
					}

					oEntry.Montante = this.getView().byId("IdMontanteCoop").getValue();
					oEntry.Validade = this.getView().byId("IdValidadeCoop").getValue();
					oEntry.Observacao = this.getView().byId("IdObservacao_COOPERATIVA").getValue();
					break;
				case "GREMIO_CLUBE":
					oEntry.Bplan = this.getView().byId("IdPlano_GREMIO_CLUBE").getSelectedKey();

					if (oEntry.Bplan === "") {
						this.getView().byId("IdPlano_GREMIO_CLUBE").setValueState("Error");
						sap.m.MessageBox.error("Informe a Rubrica");
						return;
					} else {
						this.getView().byId("IdPlano_GREMIO_CLUBE").setValueState("Success");
					}

					oEntry.Adesao = this.getView().byId("IdAdesao").getState();
					if (oEntry.Adesao === true) {
						oEntry.Adesao = "X";
					} else {
						oEntry.Adesao = "";
					}
					oEntry.Observacao = this.getView().byId("IdObservacao_GREMIO_CLUBE").getValue();
					break;
				case "EMP_CONSIGINADO":
					oEntry.Rubrica = this.getView().byId("IdPlano_EMPRESTIMO_CONSIGINADO").getSelectedKey();

					if (oEntry.Rubrica === "") {
						this.getView().byId("IdPlano_EMPRESTIMO_CONSIGINADO").setValueState("Error");
						sap.m.MessageBox.error("Informe a Rubrica");
						return;
					} else {
						this.getView().byId("IdPlano_EMPRESTIMO_CONSIGINADO").setValueState("Success");
					}

					oEntry.Montante = this.getView().byId("IdMontante_EMPRESTIMO_CONSIGINADO").getValue();
					oEntry.Validade = this.getView().byId("IdValidade_EMPRESTIMO_CONSIGINADO").getValue();
					oEntry.Observacao = this.getView().byId("IdObservacao_EMPRESTIMO_CONSIGINADO").getValue();
					break;
				case "FARMACIA":
					oEntry.Bplan = this.getView().byId("IdPlano_FARMACIA").getSelectedKey();
					if (oEntry.Bplan === "") {
						this.getView().byId("IdPlano_FARMACIA").setValueState("Error");
						sap.m.MessageBox.error("Informe o Plano");
						return;
					} else {
						this.getView().byId("IdPlano_FARMACIA").setValueState("Success");
					}

					oEntry.Opcoes = this.getView().byId("IdMotivo_FARMACIA").getSelectedKey();
					if (oEntry.Bplan === "") {
						this.getView().byId("IdMotivo_FARMACIA").setValueState("Error");
						sap.m.MessageBox.error("Informe o Motivo");
						return;
					} else {
						this.getView().byId("IdMotivo_FARMACIA").setValueState("Success");
					}

					break;
				case "REEMBOLSO_SUBSIDIO":
					oEntry.Bplan = this.getView().byId("IdPlano_REEMBOLSO_SUBSIDIO").getSelectedKey();
					if (oEntry.Bplan === "") {
						this.getView().byId("IdPlano_REEMBOLSO_SUBSIDIO").setValueState("Error");
						sap.m.MessageBox.error("Informe o Plano");
						return;
					} else {
						this.getView().byId("IdPlano_REEMBOLSO_SUBSIDIO").setValueState("Success");
					}
					oEntry.Montante = this.getView().byId("IdMontante_REEMBOLSO_SUBSIDIO").getValue();
					oEntry.Validade = this.getView().byId("IdValidade_REEMBOLSO_SUBSIDIO").getValue();
					oEntry.Observacao = this.getView().byId("IdObservacao_REEMBOLSO_SUBSIDIO").getValue();
					break;
				case "ALIMENTACAO":
					oEntry.Bplan = this.getView().byId("IdPlano_ALIMENTACAO").getSelectedKey();
					if (oEntry.Bplan === "") {
						this.getView().byId("IdPlano_ALIMENTACAO").setValueState("Error");
						sap.m.MessageBox.error("Informe o Plano");
						return;
					} else {
						this.getView().byId("IdPlano_ALIMENTACAO").setValueState("Success");
					}
					oEntry.Opcoes = this.getView().byId("IdOpcoes_ALIMENTACAO").getSelectedKey();
					if (oEntry.Opcoes === "") {
						this.getView().byId("IdOpcoes_ALIMENTACAO").setValueState("Error");
						sap.m.MessageBox.error("Informe as opções");
						return;
					} else {
						this.getView().byId("IdOpcoes_ALIMENTACAO").setValueState("Success");
					}
					oEntry.Observacao = this.getView().byId("IdObservacao_ALIMENTACAO").getValue();
					break;
				case "OTICA":
					oEntry.Bplan = this.getView().byId("IdPlano_OTICA").getSelectedKey();

					if (oEntry.Bplan === "") {
						this.getView().byId("IdPlano_OTICA").setValueState("Error");
						sap.m.MessageBox.error("Informe o Plano");
						return;
					} else {
						this.getView().byId("IdPlano_OTICA").setValueState("Success");
					}

					oEntry.Opcoes = this.getView().byId("IdOpcoes_OTICA").getSelectedKey();

					if (oEntry.Opcoes === "") {
						this.getView().byId("IdOpcoes_OTICA").setValueState("Error");
						sap.m.MessageBox.error("Informe a Opção");
						return;
					} else {
						this.getView().byId("IdOpcoes_OTICA").setValueState("Success");
					}

					oEntry.Observacao = this.getView().byId("IdObservacao_OTICA").getValue();
					break;
				case "CESTA_BASICA":
					oEntry.Bplan = this.getView().byId("IdPlano_CESTA_BASICA").getSelectedKey();
					if (oEntry.Bplan === "") {
						this.getView().byId("IdPlano_CESTA_BASICA").setValueState("Error");
						sap.m.MessageBox.error("Informe o Plano");
						return;
					} else {
						this.getView().byId("IdPlano_CESTA_BASICA").setValueState("Success");
					}

					oEntry.Opcoes = this.getView().byId("IdOpcoes_CESTA_BASICA").getSelectedKey();

					if (oEntry.Opcoes === "") {
						this.getView().byId("IdOpcoes_CESTA_BASICA").setValueState("Error");
						sap.m.MessageBox.error("Informe a Opção");
						return;
					} else {
						this.getView().byId("IdOpcoes_CESTA_BASICA").setValueState("Success");
					}

					oEntry.Motivo = this.getView().byId("IdMotivo_CESTA_BASICA").getSelectedKey();

					if (oEntry.Motivo === "") {
						this.getView().byId("IdMotivo_CESTA_BASICA").setValueState("Error");
						sap.m.MessageBox.error("Informe a Opção");
						return;
					} else {
						this.getView().byId("IdMotivo_CESTA_BASICA").setValueState("Success");
					}

					oEntry.Telefone = this.getView().byId("idTelefone").getValue();

					break;
				case "PREVIDENCIA_PRIVADA":
					oEntry.Bplan = this.getView().byId("IdPlano_PREVIDENCIA_PRIVADA").getSelectedKey();
					if (oEntry.Bplan === "") {
						this.getView().byId("IdPlano_PREVIDENCIA_PRIVADA").setValueState("Error");
						sap.m.MessageBox.error("Informe o Plano");
						return;
					} else {
						this.getView().byId("IdPlano_PREVIDENCIA_PRIVADA").setValueState("Success");
					}

					oEntry.Motivo = this.getView().byId("IdMotivo_PREVIDENCIA_PRIVADA").getSelectedKey();

					if (oEntry.Motivo === "") {
						this.getView().byId("IdMotivo_PREVIDENCIA_PRIVADA").setValueState("Error");
						sap.m.MessageBox.error("Informe o Motivo");
						return;
					} else {
						this.getView().byId("IdMotivo_PREVIDENCIA_PRIVADA").setValueState("Success");
					}

					oEntry.Valor = this.getView().byId("IdValor1_PREVIDENCIA_PRIVADA1").getValue();

					break;
				case "PREV_PRIV_BAS":
					oEntry.Bplan = this.getView().byId("IdPlano_PREV_PRIV_BAS").getSelectedKey();
					if (oEntry.Bplan === "") {
						this.getView().byId("IdPlano_PREV_PRIV_BAS").setValueState("Error");
						sap.m.MessageBox.error("Informe o Plano");
						return;
					} else {
						this.getView().byId("IdPlano_PREV_PRIV_BAS").setValueState("Success");
					}
					break;
				case "PREV_PRIV_ESP":
					oEntry.Bplan = this.getView().byId("IdPlano_PREV_PRIV_ESP").getSelectedKey();
					if (oEntry.Bplan === "") {
						this.getView().byId("IdPlano_PREV_PRIV_ESP").setValueState("Error");
						sap.m.MessageBox.error("Informe o Plano");
						return;
					} else {
						this.getView().byId("IdPlano_PREV_PRIV_ESP").setValueState("Success");
					}
					break;
				case "PREV_PRIV_NOR":
					oEntry.Bplan = this.getView().byId("IdPlano_PREV_PRIV_NOR").getSelectedKey();
					if (oEntry.Bplan === "") {
						this.getView().byId("IdPlano_PREV_PRIV_NOR").setValueState("Error");
						sap.m.MessageBox.error("Informe o Plano");
						return;
					} else {
						this.getView().byId("IdPlano_PREV_PRIV_NOR").setValueState("Success");
					}
					break;
				case "PREV_PRIV_SUP":
					oEntry.Bplan = this.getView().byId("IdPlano_PREV_PRIV_SUP").getSelectedKey();
					if (oEntry.Bplan === "") {
						this.getView().byId("IdPlano_PREV_PRIV_SUP").setValueState("Error");
						sap.m.MessageBox.error("Informe o Plano");
						return;
					} else {
						this.getView().byId("IdPlano_PREV_PRIV_SUP").setValueState("Success");
					}
					break;
				case "PLANO_DENT_2":
					oEntry.Bplan = this.getView().byId("IdPlano_PLANO_DENT_2").getSelectedKey();
					if (oEntry.Bplan === "") {
						this.getView().byId("IdPlano_PLANO_DENT_2").setValueState("Error");
						sap.m.MessageBox.error("Informe o Plano");
						return;
					} else {
						this.getView().byId("IdPlano_PLANO_DENT_2").setValueState("Success");
					}

					oEntry.CartDentista = this.getView().byId("IdCartPLANO_DENT_2").getValue();
					if (oEntry.CartDentista === "") {
						this.getView().byId("IdCartPLANO_DENT_2").setValueState("Error");
						sap.m.MessageBox.error("Informe a carterinha do dentista.");
						return;
					} else {
						this.getView().byId("IdCartPLANO_DENT_2").setValueState("Success");
					}
					break;
				case "REFEITORIO":
					oEntry.Bplan = this.getView().byId("IdPlano_REFEITORIO").getSelectedKey();
					oEntry.Opcoes = this.getView().byId("IdPlano_REFEITORIO").getSelectedKey();
					break;
				case "REEMBOLSO_ESTACIONAM":
					oEntry.Valor = this.getView().byId("IdPlano_REEMBOLSO_ESTACIONAM").getSelectedKey();
					if (oEntry.Valor === "") {
						this.getView().byId("IdPlano_REEMBOLSO_ESTACIONAM").setValueState("Error");
						sap.m.MessageBox.error("Informe mês de referência.");
						return;
					} else {
						this.getView().byId("IdPlano_REEMBOLSO_ESTACIONAM").setValueState("Success");
					}
					break;
				case "REEMBOLSO_EDUCACAO":
					oEntry.Valor = this.getView().byId("IdPlano_REEMBOLSO_EDUCACAO").getSelectedKey();
					if (oEntry.Valor === "") {
						this.getView().byId("IdPlano_REEMBOLSO_EDUCACAO").setValueState("Error");
						sap.m.MessageBox.error("Informe mês de referência.");
						return;
					} else {
						this.getView().byId("IdPlano_REEMBOLSO_EDUCACAO").setValueState("Success");
					}
					break;
				}

				oEntry.Tipo = "G";
				oEntry.Beneficio = Beneficio;
				oEntry.Chamado = this.getView().byId("idChamado").getValue();

				if (oEntry.Montante !== "" && oEntry.Montante !== undefined) {

					while (oEntry.Montante.indexOf(".") !== -1) {
						oEntry.Montante = oEntry.Montante.replace(".", "");
					}

					oEntry.Montante = oEntry.Montante.replace(",", ".");
				}

				if (validaoutros === 1) {
					var that = this;
					var dialog = "";
					var sText;
					
					dialog = new Dialog({
						title: "Código Outros",
						type: "Message",
						content: [
							new Label({
								text: "Você selecionou a opção outros,\n informe o transporte a ser solicitado.",
								labelFor: "submitDialogTextarea"
							}),
							new TextArea("submitDialogTextarea", {
								liveChange: function (oEvent) {
									sText = oEvent.getParameter("value");
									oEntry.Observacao = sText;
								},
								width: "100%",
								placeholder: "Digite aqui."
							})
						],
						beginButton: new Button({
							type: ButtonType.Emphasized,
							text: "Ok",
							press: function () {
								if (oEntry.Observacao === undefined || oEntry.Observacao === "") {
									sap.m.MessageBox.error("Observação não preenchida");
									return;
								} else {
									dialog.close();
									that.GravaBeneficio(Key, oEntry);
								}
							}.bind(this)
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
				} else {
					this.GravaBeneficio(Key, oEntry, via2);
				}
			},

			FormatZero: function () {
				return "";
			},

			GravaBeneficio: function (key, oEntry, via2) {
				var that = this;
				var oModel = this.getView().getModel();
				var menssagemsave = "";
				var Zdesc;

				Zdesc = "worklist";

				if (via2 === "X") {
					menssagemsave = "Confirma solicitação de segunda via?";
				} else {
					menssagemsave = "Confirma alteração/inclusão do Benefício?";
				}

				var dialog = new Dialog({
					title: "Confirma\xE7\xE3o",
					type: "Message",
					content: new Text({
						text: menssagemsave
					}),
					beginButton: new Button({
						text: "Sim",
						press: function () {
							oModel.update(key, oEntry, {
								success: function (oData, oResponse) {
									sap.m.MessageBox.success("Benefício salvo com sucesso.", {
										actions: ["OK", sap.m.MessageBox.Action.CLOSE],
										onClose: function (sAction) {
											that.getView().getModel().refresh(true);
											that.getRouter().navTo(Zdesc);
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
							dialog.close();
						}
					}),
					endButton: new Button({
						text: "N\xE3o",
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

			onSaveCDep: function () {
				var oModel = this.getView().getModel();
				var oListBase;
				var oEntry = {};
				var that = this;

				switch (param) {
				case "PLANO_MEDICO":
					oListBase = this.getView().byId("smartTable").getTable();
					oEntry.Bplan = that.getView().byId("IdPlano_PLANO_MEDICO").getSelectedKey();

					if (oEntry.Bplan === "") {
						that.getView().byId("IdPlano_PLANO_MEDICO").setValueState("Error");
						sap.m.MessageBox.error("Informe o plano");
						return;
					} else {
						that.getView().byId("IdPlano_PLANO_MEDICO").setValueState("Success");
					}

					oEntry.Opcoes = that.getView().byId("IdOpcoes_PLANO_MEDICO").getSelectedKey();

					if (oEntry.Opcoes === "") {
						that.getView().byId("IdOpcoes_PLANO_MEDICO").setValueState("Error");
						sap.m.MessageBox.error("Informe a opção do plano");
						return;
					} else {
						that.getView().byId("IdPlano_PLANO_MEDICO").setValueState("Success");
					}
					oEntry.CartMedica = that.getView().byId("idCartMedica").getValue();

					if (via2 === "X") {
						oEntry.Via2medico = via2;
					}

					break;
				case "PLANO_ODONTOLOGICO":
					oListBase = this.getView().byId("smartTable_PLANO_ODONTOLOGICO").getTable();
					oEntry.Bplan = that.getView().byId("IdPlano_PLANO_ODONTOLOGICO").getSelectedKey();

					if (oEntry.Bplan === "") {
						that.getView().byId("IdPlano_PLANO_ODONTOLOGICO").setValueState("Error");
						sap.m.MessageBox.error("Informe o plano");
						return;
					} else {
						that.getView().byId("IdPlano_PLANO_ODONTOLOGICO").setValueState("Success");
					}

					oEntry.Opcoes = that.getView().byId("IdOpcoes_PLANO_ODONTOLOGICO").getSelectedKey();

					if (oEntry.Opcoes === "") {
						that.getView().byId("IdOpcoes_PLANO_ODONTOLOGICO").setValueState("Error");
						sap.m.MessageBox.error("Informe a opção do plano");
						return;
					} else {
						that.getView().byId("IdOpcoes_PLANO_ODONTOLOGICO").setValueState("Success");
					}
					oEntry.CartDentista = that.getView().byId("IdCartDentista").getValue();

					if (via2 === "X") {
						oEntry.Via2Dent = via2;
					}
					break;
				}

				var Concatenate;
				var Subty;
				var Objps;
				var Key;
				var Pernr = "0";
				var Beneficio = param;
				var menssagem;
				var selecionados;
				selecionados = oListBase.getSelectedIndices();
				var dialog;

				if (operacao === "I") {
					menssagem = "Confirma a inclusão do dependente no plano?";
					Concatenate = "I@";
				} else if (operacao === "C") {
					menssagem = "Confirma a solicitação da segunda via?";
					Concatenate = "C@";
				} else if (via2 === "X") {
					Concatenate = "2@";
				} else {
					menssagem = "Confirma a exclusão do dependente do plano?";
					Concatenate = "E@";
				}

				if (via2 === "X") {
					dialog = new Dialog({
						title: "Confirmação",
						type: "Message",
						content: new Text({
							text: "Confirma a solicitação de segunda via para os dependentes selecionados?"
						}),
						beginButton: new Button({
							text: "Sim",
							press: function () {
								var subty;
								var objps;
								for (var i = 0; i < selecionados.length; i++) {
									subty = oListBase.getContextByIndex([selecionados[i]]).getObject().Subty;
									objps = oListBase.getContextByIndex([selecionados[i]]).getObject().Objps;
									Concatenate = Concatenate + subty + "-" + objps + "@";
								}

								Key = "/ZET_GLHR_DETAIL_BENEFICIOSSet(Pernr='" + Pernr + "',Beneficio='" + Beneficio + "',Tipo='G')";
								oEntry.Dependentes = Concatenate;

								oModel.update(Key, oEntry, {
									success: function (oData, oResponse) {
										sap.m.MessageBox.success("Benefício salvo com sucesso.", {
											actions: ["OK", sap.m.MessageBox.Action.CLOSE],
											onClose: function (sAction) {
												that.getView().getModel().refresh(true);

												switch (param) {
												case "PLANO_MEDICO":
													that.getView().byId("TextInclusao").setVisible(false);
													that.getView().byId("TextExclusao").setVisible(false);
													that.getView().byId("TextInclusao_PLANO_ODONTOLOGICO").setVisible(false);
													break;
												case "PLANO_ODONTOLOGICO":
													that.getView().byId("TextInclusao_PLANO_ODONTOLOGICO").setVisible(false);
													that.getView().byId("TextInclusao").setVisible(false);
													that.getView().byId("TextExclusao").setVisible(false);
													break;
												}

												that.getView().byId("IdCancelDetailDep").setVisible(false);
												that.getView().byId("IdIncluir").setVisible(false);
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
											onClose: function (sAction) {
												that.getView().getModel().refresh(true);

												switch (param) {
												case "PLANO_MEDICO":
													that.getView().byId("TextInclusao").setVisible(false);
													that.getView().byId("TextExclusao").setVisible(false);
													that.getView().byId("TextInclusao_PLANO_ODONTOLOGICO").setVisible(false);
													break;
												case "PLANO_ODONTOLOGICO":
													that.getView().byId("TextInclusao_PLANO_ODONTOLOGICO").setVisible(false);
													that.getView().byId("TextInclusao").setVisible(false);
													that.getView().byId("TextExclusao").setVisible(false);
													break;
												}

												that.getView().byId("IdCancelDetailDep").setVisible(false);
												that.getView().byId("IdIncluir").setVisible(false);
											}
										});
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
				} else {

					dialog = new Dialog({
						title: "Confirmação",
						type: "Message",
						content: new Text({
							text: menssagem
						}),
						beginButton: new Button({
							text: "Sim",
							press: function () {

								var chave = chaveacao;
								Subty = chave.split(",");
								Subty = Subty[2];
								Subty = Subty.split("Subty=");
								Subty = Subty[1];
								while (Subty.indexOf("'") !== -1) {
									Subty = Subty.replace("'", "");
								}
								if (Subty < 10) {
									Subty = "0" + Subty;
								}

								Objps = chave.split(",");
								Objps = Objps[3];
								Objps = Objps.split("Objps=");
								Objps = Objps[1];
								while (Objps.indexOf("'") !== -1) {
									Objps = Objps.replace("'", "");
								}
								while (Objps.indexOf(")") !== -1) {
									Objps = Objps.replace(")", "");
								}

								if (Objps === "") {
									Objps = "00";
								}

								Concatenate = Concatenate + Subty + "-" + Objps;

								Key = "/ZET_GLHR_DETAIL_BENEFICIOSSet(Pernr='" + Pernr + "',Beneficio='" + Beneficio + "',Tipo='G')";
								oEntry.Dependentes = Concatenate;

								oModel.update(Key, oEntry, {
									success: function (oData, oResponse) {
										sap.m.MessageBox.success("Benefício salvo com sucesso.", {
											actions: ["OK", sap.m.MessageBox.Action.CLOSE],
											onClose: function (sAction) {
												that.getView().getModel().refresh(true);

												switch (param) {
												case "PLANO_MEDICO":
													that.getView().byId("TextInclusao").setVisible(false);
													that.getView().byId("TextExclusao").setVisible(false);
													that.getView().byId("TextInclusao_PLANO_ODONTOLOGICO").setVisible(false);
													break;
												case "PLANO_ODONTOLOGICO":
													that.getView().byId("TextInclusao_PLANO_ODONTOLOGICO").setVisible(false);
													that.getView().byId("TextInclusao").setVisible(false);
													that.getView().byId("TextExclusao").setVisible(false);
													break;
												}

												that.getView().byId("IdCancelDetailDep").setVisible(false);
												that.getView().byId("IdIncluir").setVisible(false);
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
											onClose: function (sAction) {
												that.getView().getModel().refresh(true);

												switch (param) {
												case "PLANO_MEDICO":
													that.getView().byId("TextInclusao").setVisible(false);
													that.getView().byId("TextExclusao").setVisible(false);
													that.getView().byId("TextInclusao_PLANO_ODONTOLOGICO").setVisible(false);
													break;
												case "PLANO_ODONTOLOGICO":
													that.getView().byId("TextInclusao_PLANO_ODONTOLOGICO").setVisible(false);
													that.getView().byId("TextInclusao").setVisible(false);
													that.getView().byId("TextExclusao").setVisible(false);
													break;
												}

												that.getView().byId("IdCancelDetailDep").setVisible(false);
												that.getView().byId("IdIncluir").setVisible(false);
											}
										});
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
				}
			},

			tirapontos: function (sValue) {
				while (sValue.indexOf(".") !== -1) {
					sValue = sValue.replace(".", "");
				}
				while (sValue.indexOf(",") !== -1) {
					sValue = sValue.replace(",", ".");
				}
				return sValue;
			},

			_bindView: function (sObjectPath) {
				// Set busy indicator during view binding
				var oViewModel = this.getView().getModel();
				var that = this;
				// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
				that.loading(false);
				this.getView().bindElement({
					path: sObjectPath,
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

			onAcao: function (oEvent) {
				dep = "X";
				var id = oEvent.getSource().getId();
				var icon = oEvent.getSource().getIcon();
				this.getView().byId(id).setPressed(true);

				if (icon === "sap-icon://add") {
					this.onIncluinoPlano(oEvent);
				} else if (icon === "sap-icon://delete") {
					this.onExluiPlano(oEvent);
				}
			},

			AfterUpdate: function (oEvent) {
				var count = this.getView().byId("table1").getBinding("rows").getLength();
				if (count > 0) {
					this.getView().byId("table1").setVisibleRowCount(count);
				} else {
					this.getView().byId("FormContainer5_PLANO_MEDICO").setVisible(false);
				}
			},

			AfterUpdate_VALE_TRANSPORTE: function (oEvent) {
				var count = this.getView().byId("table1_VALE_TRANSPORT").getBinding("rows").getLength();
				if (count > 0) {
					this.getView().byId("table1_VALE_TRANSPORT").setVisibleRowCount(count);
				} else {
					this.getView().byId("FormContainer7_VALE_TRANSPORTE").setVisible(false);
				}
			},

			AfterUpdate_PLANO_ODONTOLOGICO: function (oEvent) {
				var count = this.getView().byId("table1_PLANO_ODONTOLOGICO").getBinding("rows").getLength();
				if (count > 0) {
					this.getView().byId("table1_PLANO_ODONTOLOGICO").setVisibleRowCount(count);
				} else {
					this.getView().byId("FormContainer5_PLANO_ODONTOLOGICO").setVisible(false);
				}

			},

			_onBindingChange: function () {

				this.getView().byId(param).setVisible(true);

				var IdMargemEmp = this.getView().byId("IdMargemEmp").getValue();

				if (IdMargemEmp !== "") {
					IdMargemEmp = parseFloat(IdMargemEmp).toFixed(2);

					while (IdMargemEmp.indexOf(".") !== -1) {
						IdMargemEmp = IdMargemEmp.replace(".", ",");
					}
					IdMargemEmp = this.adicionarpontoFloat(IdMargemEmp);
					this.getView().byId("IdMargemEmp").setValue(IdMargemEmp);
				}

				var smartTable;
				var Plano;
				var Opcoes;
				var oFilterOpcoes;
				var Opcoes2;
				var Valor = "";
				var array;
				var ano;
				var mes;
				var idTipo = this.getView().byId("idTipo").getValue();
				var infty;
				var subty;

				switch (param) {
				case "FUNSEJEM":
					break;
				case "PLANO_MEDICO":
					Plano = this.getView().byId("IdPlano_PLANO_MEDICO").getSelectedKey();
					Opcoes = this.getView().byId("IdOpcoes_PLANO_MEDICO").getBinding("items");

					smartTable = this.getView().byId("smartTable");
					smartTable.rebindTable("e");

					this.getView().byId("IdIncluir").setVisible(false);

					oFilterOpcoes = new sap.ui.model.Filter("Bplan", sap.ui.model.FilterOperator.EQ, Plano);
					Opcoes.filter([oFilterOpcoes]);

					this.getView().byId("IdEditDetailDep").setText("Alterar Plano");
					this.getView().byId("IdEditDetailDep").setVisible(false);

					infty = "0167";
					subty = "MEDI";

					break;
				case "PLANO_ODONTOLOGICO":
					Plano = this.getView().byId("IdPlano_PLANO_ODONTOLOGICO").getSelectedKey();
					Opcoes = this.getView().byId("IdOpcoes_PLANO_ODONTOLOGICO").getBinding("items");

					smartTable = this.getView().byId("smartTable_PLANO_ODONTOLOGICO");
					smartTable.rebindTable("e");

					this.getView().byId("IdIncluir").setVisible(false);

					oFilterOpcoes = new sap.ui.model.Filter("Bplan", sap.ui.model.FilterOperator.EQ, Plano);
					Opcoes.filter([oFilterOpcoes]);

					Cancela = " ";

					infty = "0167";
					subty = "DENT";
					break;
				case "PLANO_DENT_2":
					infty = "0167";
					subty = "ODNT";
					break;
				case "SEGURO_VIDA":
					this.getView().byId("IdIncluir").setVisible(false);

					Plano = this.getView().byId("IdPlano_SEGURO_DE_VIDA").getSelectedKey();
					Opcoes = this.getView().byId("IdOpcoes_SEGURO_DE_VIDA").getBinding("items");

					oFilterOpcoes = new sap.ui.model.Filter("Bplan", sap.ui.model.FilterOperator.EQ, Plano);
					Opcoes.filter([oFilterOpcoes]);

					this.getView().byId("IdEditDetailDep").setText("Editar Plano");

					infty = "0168";
					subty = "VIDA";
					break;
				case "TRANSPORTE":
					infty = "XXXX";
					subty = "TRAN";
					break;
				case "VALE_REFEICAO":
					infty = "0377";
					subty = "VALM";
					break;
				case "AUXILIO_CRECHE":
					this.getView().byId("IdIncluir").setVisible(false);
					this.getView().byId("IdEditDetailDep").setText("Nova Solicitação");
					Valor = this.getView().byId("IdPlano_AUXILIO_CRECHE").getSelectedKey();
					infty = "XXXX";
					subty = "CREC";
					break;
				case "COOPERATIVA":
					infty = "4707";
					subty = "";
					break;
				case "GREMIO_CLUBE":
					infty = "9003";
					subty = "";
					break;
				case "EMP_CONSIGINADO":
					infty = "";
					subty = "";
					break;
				case "FARMACIA":

					this.getView().byId("IdIncluir").setVisible(false);

					Plano = this.getView().byId("IdPlano_FARMACIA").getSelectedKey();
					Opcoes = this.getView().byId("IdMotivo_FARMACIA").getBinding("items");

					oFilterOpcoes = new sap.ui.model.Filter("IBplan", sap.ui.model.FilterOperator.EQ, Plano);
					Opcoes.filter([oFilterOpcoes]);

					this.getView().byId("IdEditDetailDep").setText("Nova Solicitação");

					infty = "0377";
					subty = "FARM";
					break;
				case "REEMBOLSO_SUBSIDIO":
					Valor = this.getView().byId("IdPlano_REEMBOLSO_SUBSIDIO").getValue();

					array = Valor.split("_", 2);
					ano = array[1];
					mes = array[0];

					this.getView().byId("IdPlano_REEMBOLSO_SUBSIDIO").setSelectedKey(mes);
					this.getView().byId("IdAno_REEMBOLSO_SUBSIDIO").setSelectedKey(ano);

					infty = "";
					subty = "";
					break;
				case "ALIMENTACAO":
					infty = "0377";
					subty = "VALM";
					break;
				case "OTICA":
					infty = "0377";
					subty = "OTIC";
					break;
				case "CESTA_BASICA":
					this.getView().byId("IdIncluir").setVisible(false);
					this.getView().byId("idTelefone").setEditable(false);

					Plano = this.getView().byId("IdPlano_CESTA_BASICA").getSelectedKey();
					Opcoes = this.getView().byId("IdOpcoes_CESTA_BASICA").getBinding("items");

					oFilterOpcoes = new sap.ui.model.Filter("Bplan", sap.ui.model.FilterOperator.EQ, Plano);
					Opcoes.filter([oFilterOpcoes]);

					Opcoes2 = this.getView().byId("IdMotivo_CESTA_BASICA").getBinding("items");
					oFilterOpcoes = new sap.ui.model.Filter("IBplan", sap.ui.model.FilterOperator.EQ, Plano);
					Opcoes2.filter([oFilterOpcoes]);

					this.getView().byId("IdEditDetailDep").setText("Nova Solicitação");

					infty = "0377";
					subty = "CEST";
					break;
				case "PREVIDENCIA_PRIVADA":
					this.getView().byId("IdIncluir").setVisible(false);
					this.getView().byId("idTelefone").setEditable(false);

					Plano = this.getView().byId("IdPlano_PREVIDENCIA_PRIVADA").getSelectedKey();

					Opcoes2 = this.getView().byId("IdMotivo_PREVIDENCIA_PRIVADA").getBinding("items");

					oFilterOpcoes = new sap.ui.model.Filter("IBplan", sap.ui.model.FilterOperator.EQ, Plano);
					Opcoes2.filter([oFilterOpcoes]);

					this.getView().byId("IdEditDetailDep").setText("Nova Solicitação");

					infty = "0169";
					subty = "PREV";
					break;
				case "PREV_PRIV_BAS":
					infty = "0169";
					subty = "PREB";
					break;
				case "PREV_PRIV_ESP":
					infty = "0169";
					subty = "PREE";
					break;
				case "PREV_PRIV_NOR":
					infty = "0169";
					subty = "PREN";
					break;
				case "PREV_PRIV_SUP":
					infty = "0169";
					subty = "PRES";
					break;
				case "REEMBOLSO_ESTACIONAM":
					this.getView().byId("IdIncluir").setVisible(false);
					this.getView().byId("IdEditDetailDep").setText("Nova Solicitação");

					Valor = this.getView().byId("IdPlano_REEMBOLSO_ESTACIONAM").getValue();
					array = Valor.split("_", 2);

					ano = array[1];
					mes = array[0];

					this.getView().byId("IdPlano_REEMBOLSO_ESTACIONAM").setSelectedKey(mes);
					this.getView().byId("IdAno_REEMBOLSO_ESTACIONAM").setSelectedKey(ano);

					infty = "XXXX";
					subty = "REES";
					break;
				case "REEMBOLSO_EDUCACAO":
					this.getView().byId("IdIncluir").setVisible(false);
					this.getView().byId("IdEditDetailDep").setText("Nova Solicitação");
					infty = "XXXX";
					subty = "REED";
					break;
				case "MATERIAL_ESCOLAR":
					this.getView().byId("IdIncluir").setVisible(false);
					this.getView().byId("IdEditDetailDep").setText("Nova Solicitação");

					Valor = this.getView().byId("IdPlano_MATERIAL_ESCOLAR").getSelectedKey();

					infty = "XXXX";
					subty = "MATE";
					break;
				case "REEMBOLSO_MEDICAM":
					this.getView().byId("IdIncluir").setVisible(false);
					this.getView().byId("IdEditDetailDep").setText("Nova Solicitação");

					Valor = this.getView().byId("IdPlano_REEMBOLSO_MEDICAM").getValue();

					array = Valor.split("_", 2);
					ano = array[1];
					mes = array[0];

					this.getView().byId("IdPlano_REEMBOLSO_MEDICAM").setSelectedKey(mes);
					this.getView().byId("IdAno_REEMBOLSO_MEDICAM").setSelectedKey(ano);

					infty = "XXXX";
					subty = "REME";

					break;
				}

				var Subty = subty;
				if (Pernr !== "" || Subty !== "") {
					var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr);
					var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
					var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, Subty);
					var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "U");
					var oFilterValor = new sap.ui.model.Filter("Valor", sap.ui.model.FilterOperator.EQ, Valor);
					var oList = this.getView().byId("UploadCollection");
					oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo, oFilterValor]);
				}
			},

			onConfirmMunicipio: function (evt) {
				var oSelectedItem = evt.getParameter("selectedItem");

				this._valueHelpDialog1 = null;

				if (oSelectedItem) {
					var title = oSelectedItem.getTitle();
					var productInput = this.getView().byId(this.inputId);
					productInput.setValue(title);

				}
			},

			handleValueHelp: function (oEvent) {
				var Motivo = this.getView().byId("IdMotivo_PREVIDENCIA_PRIVADA").getSelectedKey();

				if (Motivo === "") {
					sap.m.MessageBox.error("Informe o motivo.");
					return;
				}
				var sInputValue = oEvent.getSource().getValue();
				this.inputId = oEvent.getSource().getId();
				// create value help dialog
				if (!this._valueHelpDialog1) {
					this._valueHelpDialog1 = sap.ui.xmlfragment("Y5GL_EC_BENEFICIOS.Y5GL_EC_BENEFICIOS.view.Valor", this);
					this.getView().addDependent(this._valueHelpDialog1);
				}
				// open value help dialog filtered by the input value
				this._valueHelpDialog1.open(sInputValue);

				this._valueHelpDialog1.getBinding("items").filter([new Filter(
					"IOpcao",
					sap.ui.model.FilterOperator.EQ, Motivo
				)]);

			},

			onchangeMotivo: function (oEvent) {
				var motivo = this.getView().byId("IdMotivo_PREVIDENCIA_PRIVADA").getSelectedKey();
				var oFilterOpcoes = new sap.ui.model.Filter("IOpcao", sap.ui.model.FilterOperator.EQ, motivo);
				var Opcoes = this.getView().byId("IdValor1_PREVIDENCIA_PRIVADA1").getBinding("items");
				Opcoes.filter([oFilterOpcoes]);
			},

			onchangePlano: function (oEvent) {
				var id = oEvent.getParameter("id");
				id = id.split("BENEFICIOS_DETAIL--");
				id = id[1];

				var Plano = this.getView().byId(id).getSelectedKey();
				var oFilterOpcoes = new sap.ui.model.Filter("Bplan", sap.ui.model.FilterOperator.EQ, Plano);
				var oFilterMotivo = new sap.ui.model.Filter("IBplan", sap.ui.model.FilterOperator.EQ, Plano);
				var Opcoes;
				var Motivo;

				switch (param) {
				case "PLANO_MEDICO":
					Opcoes = this.getView().byId("IdOpcoes_PLANO_MEDICO").getBinding("items");
					Opcoes.filter([oFilterOpcoes]);
					break;
				case "PLANO_ODONTOLOGICO":
					Opcoes = this.getView().byId("IdOpcoes_PLANO_ODONTOLOGICO").getBinding("items");
					Opcoes.filter([oFilterOpcoes]);
					break;
				case "FARMACIA":
					Motivo = this.getView().byId("IdMotivo_FARMACIA").getBinding("items");
					Motivo.filter([oFilterMotivo]);
					break;
				case "PREVIDENCIA_PRIVADA":
					Motivo = this.getView().byId("IdMotivo_PREVIDENCIA_PRIVADA").getBinding("items");
					Motivo.filter([oFilterMotivo]);
				}

			},

			onIncluinoPlano: function (oEvent) {
				sap.m.MessageBox.alert("Anexe o documento para prosseguir.");

				chaveacao = oEvent.getSource()._getBindingContext().sPath;

				this.getView().byId("UPLOAD").setVisible(true);
				operacao = "I";

				this.getView().byId("TextInclusao").setVisible(true);
				this.getView().byId("TextExclusao").setVisible(false);
			},

			onExluiPlano: function (oEvent) {
				sap.m.MessageBox.alert("Anexe o documento para prosseguir.");
				chaveacao = oEvent.getSource()._getBindingContext().sPath;

				this.getView().byId("UPLOAD").setVisible(true);
				operacao = "E";

				this.getView().byId("TextInclusao").setVisible(false);
				this.getView().byId("TextExclusao").setVisible(true);
			},

			onChange: function (oEvent) {
				var oUploadCollection = oEvent.getSource();
				var oModel = this.getView().getModel();
				oModel.refreshSecurityToken();
				var oHeaders = oModel.oHeaders;
				var sToken = oHeaders["x-csrf-token"];
				// Stellen das CSRF Token wenn ein File hinzugefügt ist
				var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
					name: "x-csrf-token",
					value: sToken
				});
				oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
			},

			onBeforeUploadStarts: function (oEvent) {
				var Pernr = "0";
				var infty;
				var subty;
				var oListBase;
				var Valor = "";

				switch (param) {
				case "FUNSEJEM":
					infty = "";
					subty = "";
					break;
				case "PLANO_MEDICO":
					infty = "0167";
					subty = "MEDI";
					oListBase = this.getView().byId("smartTable").getTable();
					break;
				case "PLANO_ODONTOLOGICO":
					infty = "0167";
					subty = "DENT";
					oListBase = this.getView().byId("smartTable_PLANO_ODONTOLOGICO").getTable();
					Valor = Cancela;
					break;
				case "PLANO_DENT_2":
					infty = "0167";
					subty = "ODNT";
					break;
				case "SEGURO_VIDA":
					infty = "0168";
					subty = "VIDA";
					Valor = this.getView().byId("IdOpcoes_SEGURO_DE_VIDA").getSelectedKey();
					break;
				case "TRANSPORTE":
					infty = "XXXX";
					subty = "TRAN";
					break;
				case "VALE_REFEICAO":
					infty = "0377";
					subty = "VALM";
					break;
				case "AUXILIO_CRECHE":
					infty = "XXXX";
					subty = "CREC";
					Valor = this.getView().byId("IdPlano_AUXILIO_CRECHE").getSelectedKey();
					break;
				case "COOPERATIVA":
					infty = "4707";
					subty = "";
					break;
				case "GREMIO_CLUBE":
					infty = "9003";
					subty = "";
					break;
				case "EMP_CONSIGINADO":
					infty = "";
					subty = "";
					break;
				case "FARMACIA":
					infty = "0377";
					subty = "FARM";
					break;
				case "REEMBOLSO_SUBSIDIO":
					infty = "";
					subty = "";
					break;
				case "ALIMENTACAO":
					infty = "0377";
					subty = "VALM";
					break;
				case "OTICA":
					infty = "0377";
					subty = "OTIC";
					break;
				case "CESTA_BASICA":
					infty = "0377";
					subty = "CEST";
					Valor = this.getView().byId("IdMotivo_CESTA_BASICA").getSelectedKey();
					break;
				case "PREVIDENCIA_PRIVADA":
					infty = "0169";
					subty = "PREV";
					Valor = this.getView().byId("IdMotivo_PREVIDENCIA_PRIVADA").getSelectedKey();
					break;
				case "PREV_PRIV_BAS":
					infty = "0169";
					subty = "PREB";
					break;
				case "PREV_PRIV_ESP":
					infty = "0169";
					subty = "PREE";
					break;
				case "PREV_PRIV_NOR":
					infty = "0169";
					subty = "PREN";
					break;
				case "PREV_PRIV_SUP":
					infty = "0169";
					subty = "PRES";
					break;
				case "REEMBOLSO_ESTACIONAM":
					infty = "XXXX";
					subty = "REES";
					Valor = this.getView().byId("IdPlano_REEMBOLSO_ESTACIONAM").getSelectedKey();
					break;
				case "REEMBOLSO_EDUCACAO":
					infty = "XXXX";
					subty = "REED";
					Valor = this.getView().byId("IdPlano_REEMBOLSO_EDUCACAO").getSelectedKey();
					break;
				case "REEMBOLSO_MEDICAM":
					infty = "XXXX";
					subty = "REME";
					Valor = this.getView().byId("IdPlano_REEMBOLSO_MEDICAM").getValue();
					break;
				}

				var Subty;
				var Objps = "0";
				var Concatenate = "";
				var Menssagem = "";

				if (dep === "X") {

					if (operacao === "I") {
						Concatenate = "I@";
						Menssagem = "Não existem dependentes marcados para inclusão";
					} else {
						Concatenate = "E@";
						Menssagem = "Não existem dependentes marcados para Exclusão";
					}

					var chave = chaveacao;
					Subty = chave.split(",");
					Subty = Subty[2];
					Subty = Subty.split("Subty=");
					Subty = Subty[1];
					while (Subty.indexOf("'") !== -1) {
						Subty = Subty.replace("'", "");
					}
					if (Subty < 10) {
						Subty = "0" + Subty;
					}

					Objps = chave.split(",");
					Objps = Objps[3];
					Objps = Objps.split("Objps=");
					Objps = Objps[1];
					while (Objps.indexOf("'") !== -1) {
						Objps = Objps.replace("'", "");
					}
					while (Objps.indexOf(")") !== -1) {
						Objps = Objps.replace(")", "");
					}

					if (Objps === "") {
						Objps = "00";
					}

					Concatenate = Concatenate + Subty + "-" + Objps;
				}

				if (Pernr !== "" || Subty !== "" || Objps !== "") {
					var sSlug = Pernr + "$" + infty + "$" + subty + "$" + Objps + "$" + oEvent.getParameter("fileName") + "$ $ $" + Concatenate + "$" +
						Valor;
					// Stellen die Kopf Parameter slug
					var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
						name: "slug",
						value: sSlug
					});
					oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
				}
				//			_busyDialog.open();
			},

			onuploadComplete: function (oEvent) {
				var Pernr = "0";
				var infty;
				var subty;
				var Valor = "";

				switch (param) {
				case "FUNSEJEM":
					infty = "";
					subty = "";
					break;
				case "PLANO_MEDICO":
					infty = "0167";
					subty = "MEDI";
					break;
				case "PLANO_ODONTOLOGICO":
					infty = "0167";
					subty = "DENT";
					Valor = Cancela;
					break;
				case "PLANO_DENT_2":
					infty = "0167";
					subty = "ODNT";
					break;
				case "SEGURO_VIDA":
					infty = "0168";
					subty = "VIDA";
					Valor = this.getView().byId("IdOpcoes_SEGURO_DE_VIDA").getSelectedKey();
					break;
				case "TRANSPORTE":
					infty = "XXXX";
					subty = "TRAN";
					break;
				case "VALE_REFEICAO":
					infty = "0377";
					subty = "VALM";
					break;
				case "AUXILIO_CRECHE":
					infty = "XXXX";
					subty = "CREC";
					Valor = this.getView().byId("IdPlano_AUXILIO_CRECHE").getSelectedKey();
					break;
				case "COOPERATIVA":
					infty = "4707";
					subty = "";
					break;
				case "GREMIO_CLUBE":
					infty = "9003";
					subty = "";
					break;
				case "EMP_CONSIGINADO":
					infty = "";
					subty = "";
					break;
				case "FARMACIA":
					infty = "0377";
					subty = "FARM";
					break;
				case "REEMBOLSO_SUBSIDIO":
					infty = "";
					subty = "";
					break;
				case "ALIMENTACAO":
					infty = "0377";
					subty = "VALM";
					break;
				case "OTICA":
					infty = "0377";
					subty = "OTIC";
					break;
				case "CESTA_BASICA":
					infty = "0377";
					subty = "CEST";
					Valor = this.getView().byId("IdMotivo_CESTA_BASICA").getSelectedKey();
					break;
				case "PREVIDENCIA_PRIVADA":
					infty = "0169";
					subty = "PREV";
					Valor = this.getView().byId("IdMotivo_PREVIDENCIA_PRIVADA").getSelectedKey();
					break;
				case "PREV_PRIV_BAS":
					infty = "0169";
					subty = "PREB";
					break;
				case "PREV_PRIV_ESP":
					infty = "0169";
					subty = "PREE";
					break;
				case "PREV_PRIV_NOR":
					infty = "0169";
					subty = "PREN";
					break;
				case "PREV_PRIV_SUP":
					infty = "0169";
					subty = "PRES";
					break;
				case "REEMBOLSO_ESTACIONAM":
					infty = "XXXX";
					subty = "REES";
					Valor = this.getView().byId("IdPlano_REEMBOLSO_ESTACIONAM").getSelectedKey();
					break;
				case "REEMBOLSO_EDUCACAO":
					infty = "XXXX";
					subty = "REED";
					Valor = this.getView().byId("IdPlano_REEMBOLSO_EDUCACAO").getSelectedKey();
					break;
				}

				if (dep === "X") {
					var Concatenate = "";
					var Menssagem = "";
					var Subty = "";
					var Objps = "";

					if (operacao === "I") {
						Concatenate = "I@";
						Menssagem = "Não existem dependentes marcados para inclusão";
					} else {
						Concatenate = "E@";
						Menssagem = "Não existem dependentes marcados para Exclusão";
					}

					var chave = chaveacao;
					Subty = chave.split(",");
					Subty = Subty[2];
					Subty = Subty.split("Subty=");
					Subty = Subty[1];
					while (Subty.indexOf("'") !== -1) {
						Subty = Subty.replace("'", "");
					}
					if (Subty < 10) {
						Subty = "0" + Subty;
					}

					Objps = chave.split(",");
					Objps = Objps[3];
					Objps = Objps.split("Objps=");
					Objps = Objps[1];
					while (Objps.indexOf("'") !== -1) {
						Objps = Objps.replace("'", "");
					}
					while (Objps.indexOf(")") !== -1) {
						Objps = Objps.replace(")", "");
					}

					if (Objps === "") {
						Objps = "00";
					}

					Concatenate = Concatenate + Subty + "-" + Objps;
				}

				if (Pernr !== "" || Subty !== "") {
					var oFiltertTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "U");
					var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
					var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, subty);
					var oFilterValor = new sap.ui.model.Filter("Valor", sap.ui.model.FilterOperator.EQ, Valor);

					var oList = this.getView().byId("UploadCollection");

					oList.getBinding("items").filter([oFilterInfty, oFilterSubty, oFiltertTipo, oFilterValor]);
				}

			},

			onmodelListContextChange: function (oEvent) {
				var infty;
				var subty;
				var Valor = " ";

				switch (param) {
				case "FUNSEJEM":
					infty = "";
					subty = "";
					break;
				case "PLANO_MEDICO":
					infty = "0167";
					subty = "MEDI";
					break;
				case "PLANO_ODONTOLOGICO":
					infty = "0167";
					subty = "DENT";
					break;
				case "PLANO_DENT_2":
					infty = "0167";
					subty = "ODNT";
					break;
				case "SEGURO_VIDA":
					infty = "0168";
					subty = "VIDA";
					Valor = this.getView().byId("IdOpcoes_SEGURO_DE_VIDA").getSelectedKey();
					break;
				case "TRANSPORTE":
					infty = "XXXX";
					subty = "TRAN";
					break;
				case "VALE_REFEICAO":
					infty = "0377";
					subty = "VALM";
					break;
				case "AUXILIO_CRECHE":
					infty = "XXXX";
					subty = "CREC";
					Valor = this.getView().byId("IdPlano_AUXILIO_CRECHE").getSelectedKey();
					break;
				case "COOPERATIVA":
					infty = "4707";
					subty = "";
					break;
				case "GREMIO_CLUBE":
					infty = "9003";
					subty = "";
					break;
				case "EMP_CONSIGINADO":
					infty = "";
					subty = "";
					break;
				case "FARMACIA":
					infty = "0377";
					subty = "FARM";
					break;
				case "REEMBOLSO_SUBSIDIO":
					infty = "";
					subty = "";
					break;
				case "ALIMENTACAO":
					infty = "0377";
					subty = "VALM";
					break;
				case "OTICA":
					infty = "0377";
					subty = "OTIC";
					break;
				case "CESTA_BASICA":
					infty = "0377";
					subty = "CEST";
					Valor = this.getView().byId("IdMotivo_CESTA_BASICA").getSelectedKey();
					break;
				case "PREVIDENCIA_PRIVADA":
					infty = "0169";
					subty = "PREV";
					Valor = this.getView().byId("IdMotivo_PREVIDENCIA_PRIVADA").getSelectedKey();
					break;
				case "PREV_PRIV_BAS":
					infty = "0169";
					subty = "PREB";
					break;
				case "PREV_PRIV_ESP":
					infty = "0169";
					subty = "PREE";
					break;
				case "PREV_PRIV_NOR":
					infty = "0169";
					subty = "PREN";
					break;
				case "PREV_PRIV_SUP":
					infty = "0169";
					subty = "PRES";
					break;
				case "REEMBOLSO_ESTACIONAM":
					infty = "XXXX";
					subty = "REES";
					Valor = this.getView().byId("IdPlano_REEMBOLSO_ESTACIONAM").getSelectedKey();
					break;
				case "REEMBOLSO_EDUCACAO":
					infty = "XXXX";
					subty = "REED";
					Valor = this.getView().byId("IdPlano_REEMBOLSO_EDUCACAO").getSelectedKey();
					break;
				case "REEMBOLSO_MEDICAM":
					infty = "XXXX";
					subty = "REME";
					Valor = this.getView().byId("IdPlano_REEMBOLSO_MEDICAM").getValue();
					break;
				}
				var Subty = subty;
				if (Pernr !== "" || Subty !== "") {
					var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr);
					var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
					var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, Subty);
					var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "U");
					var oFilterValor = new sap.ui.model.Filter("Valor", sap.ui.model.FilterOperator.EQ, Valor);
					var oList = this.getView().byId("UploadCollection");
					oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo, oFilterValor]);
				}
			},

			onDeleteSelectedItems: function (oEvent) {
				var UploadCollection = this.getView().byId("UploadCollection");
				var oList = UploadCollection.oList;
				var infty;
				var subty;
				var Valor = " ";

				switch (param) {
				case "FUNSEJEM":
					infty = "";
					subty = "";
					break;
				case "PLANO_MEDICO":
					infty = "0167";
					subty = "MEDI";
					break;
				case "PLANO_ODONTOLOGICO":
					infty = "0167";
					subty = "DENT";
					break;
				case "PLANO_DENT_2":
					infty = "0167";
					subty = "ODNT";
					break;
				case "SEGURO_VIDA":
					infty = "0168";
					subty = "VIDA";
					Valor = this.getView().byId("IdOpcoes_SEGURO_DE_VIDA").getSelectedKey();
					break;
				case "TRANSPORTE":
					infty = "XXXX";
					subty = "TRAN";
					break;
				case "VALE_REFEICAO":
					infty = "0377";
					subty = "VALM";
					break;
				case "AUXILIO_CRECHE":
					infty = "XXXX";
					subty = "CREC";
					Valor = this.getView().byId("IdPlano_AUXILIO_CRECHE").getSelectedKey();
					break;
				case "COOPERATIVA":
					infty = "4707";
					subty = "";
					break;
				case "GREMIO_CLUBE":
					infty = "9003";
					subty = "";
					break;
				case "EMP_CONSIGINADO":
					infty = "";
					subty = "";
					break;
				case "FARMACIA":
					infty = "0377";
					subty = "FARM";
					break;
				case "REEMBOLSO_SUBSIDIO":
					infty = "";
					subty = "";
					break;
				case "ALIMENTACAO":
					infty = "0377";
					subty = "VALM";
					break;
				case "OTICA":
					infty = "0377";
					subty = "OTIC";
					break;
				case "CESTA_BASICA":
					infty = "0377";
					subty = "CEST";
					Valor = this.getView().byId("IdMotivo_CESTA_BASICA").getSelectedKey();
					break;
				case "PREVIDENCIA_PRIVADA":
					infty = "0169";
					subty = "PREV";
					Valor = this.getView().byId("IdMotivo_PREVIDENCIA_PRIVADA").getSelectedKey();
					break;
				case "PREV_PRIV_BAS":
					infty = "0169";
					subty = "PREB";
					break;
				case "PREV_PRIV_ESP":
					infty = "0169";
					subty = "PREE";
					break;
				case "PREV_PRIV_NOR":
					infty = "0169";
					subty = "PREN";
					break;
				case "PREV_PRIV_SUP":
					infty = "0169";
					subty = "PRES";
					break;
				case "REEMBOLSO_ESTACIONAM":
					infty = "XXXX";
					subty = "REES";
					Valor = this.getView().byId("IdPlano_REEMBOLSO_ESTACIONAM").getSelectedKey();
					break;
				case "REEMBOLSO_EDUCACAO":
					infty = "XXXX";
					subty = "REED";
					Valor = this.getView().byId("IdPlano_REEMBOLSO_EDUCACAO").getSelectedKey();
					break;
				}

				var oModel = this.getView().getModel();
				var Ano = "0";
				var Favor = "0";
				var Infty = infty;
				var Mes = "0";
				var Tipo = "E";
				var ListItem = oEvent.getParameters("listItem");
				var docid = ListItem.documentId;
				docid = parseInt(docid);
				var idTipo = this.getView().byId("idTipo").getValue();

				if (idTipo === "Em ResoluÃ§Ã£o") {
					sap.m.MessageBox.error("Não será possivel exclusão do anexo, quando o chamado ja existir.");
					return;
				}

				var Menssagem = "";

				if (operacao === "I") {
					Menssagem = "Não existem dependentes marcados para inclusão";
				} else {
					Menssagem = "Não existem dependentes marcados para Exclusão";
				}

				var UploadCollection = this.getView().byId("UploadCollection");

				var Concatenate = "";

				if (dep === "X") {

					var Menssagem = "";
					var Subty = "";
					var Objps = "";

					if (operacao === "I") {
						Concatenate = "I@";
						Menssagem = "Não existem dependentes marcados para inclusão";
					} else {
						Concatenate = "E@";
						Menssagem = "Não existem dependentes marcados para Exclusão";
					}

					var chave = chaveacao;
					Subty = chave.split(",");
					Subty = Subty[2];
					Subty = Subty.split("Subty=");
					Subty = Subty[1];
					while (Subty.indexOf("'") !== -1) {
						Subty = Subty.replace("'", "");
					}
					if (Subty < 10) {
						Subty = "0" + Subty;
					}

					Objps = chave.split(",");
					Objps = Objps[3];
					Objps = Objps.split("Objps=");
					Objps = Objps[1];
					while (Objps.indexOf("'") !== -1) {
						Objps = Objps.replace("'", "");
					}
					while (Objps.indexOf(")") !== -1) {
						Objps = Objps.replace(")", "");
					}

					if (Objps === "") {
						Objps = "00";
					}

					Concatenate = Concatenate + Subty + "-" + Objps;
				}

				var Key = "/ZET_GLRH_UPLOADSet(Ano='" + Ano + "',Favor='" + Favor + "',Infty='" + Infty + "',Mes='" + Mes + "',Pernr='" + Pernr +
					"',Tipo='" + Tipo + "',Subty='" + subty + "',DocId=" + docid + ",Objps='',Icnum='',Valor='" + Valor + "',Dependentes='" +
					Concatenate + "')";
				var oEntry = {};
				oEntry.DocId = docid;
				oEntry.Valor = Valor;

				var dialog = new Dialog({
					title: "Confirma\xE7\xE3o",
					type: "Message",
					content: new Text({
						text: "Confirma a exclusão anexo?"
					}),
					beginButton: new Button({
						text: "Sim",
						press: function () {
							oModel.update(Key, oEntry, {
								success: function (oData, oResponse) {
									sap.m.MessageBox.success("Documentos excluido com sucesso.", {
										actions: ["OK", sap.m.MessageBox.Action.CLOSE],
										onClose: function (sAction) {
											UploadCollection.getBinding("items").refresh(true);
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
										onClose: function (sAction) {
											UploadCollection.getBinding("items").refresh(true);
										}
									});
									return;
								}
							});
							dialog.close();
						}
					}),
					endButton: new Button({
						text: "N\xE3o",
						press: function () {
							dialog.close();
						}
					}),
					afterClose: function () {
						dialog.destroy();
						//UploadCollection.refresh(true);
					}
				});
				dialog.open();
			},

			FormatSelectionMode: function (oValue) {
				return "None";
			},

			onAdd: function () {
				var Tipo = "A";
				var Objps = "0";
				var Subty = "-";
				var Favor = "-";
				var Zdesc = "DependentesAdd";
				var Cpf = "-";
				this.getRouter().navTo(Zdesc, {
					Pernr: Pernr,
					Subty: Subty,
					Objps: Objps,
					Tipo: Tipo,
					Favor: Favor,
					Icnum: Cpf
				});
			},

			onSegunda: function () {
				var that = this;
				var messagem;
				via2 = "X";

				var count = this.getView().byId("table1").getBinding("rows").getLength();
				if (count > 0) {
					messagem = "Deseje solicitar segunda via da carterinha para:";
					sap.m.MessageBox.show(messagem, {
						actions: ["Dependente", "Titular"],
						onClose: function (sAction) {
							if (sAction === "Dependente") {
								that.byId("table1").setSelectionMode("MultiToggle");
								that.byId("IdCancelDetailDep").setVisible(true);

							} else if (sAction === "Titular") {
								that.onSave(via2);
							}
						}
					});
				} else {
					that.onSave(via2);
				}

			},

			onEdit: function () {
				var visao = this.getView();
				edit = true;
				dep = "";
				visao.byId("UPLOAD").setVisible(true);
				switch (param) {
				case "FUNSEJEM":
					visao.byId("IdPlano_FUNSEJEM").setEditable(true);
					visao.byId("IdMargemEmp").setEditable(true);
					break;
				case "PLANO_MEDICO":
					visao.byId("IdPlano_PLANO_MEDICO").setEditable(true);
					visao.byId("idCartMedica").setEditable(true);
					visao.byId("IdOpcoes_PLANO_MEDICO").setEditable(true);
					visao.byId("IdIncluir").setVisible(false);
					break;
				case "PLANO_ODONTOLOGICO":
					visao.byId("IdPlano_PLANO_ODONTOLOGICO").setEditable(true);
					visao.byId("IdCartDentista").setEditable(true);
					visao.byId("IdOpcoes_PLANO_ODONTOLOGICO").setEditable(true);
					break;
				case "PLANO_DENT_2":
					visao.byId("IdPlano_PLANO_DENT_2").setEditable(true);
					visao.byId("IdCartPLANO_DENT_2").setEditable(true);
					break;
				case "SEGURO_VIDA":
					visao.byId("IdOpcoes_SEGURO_DE_VIDA").setEditable(true);
					visao.byId("TextPlano").setVisible(true);
					break;
				case "TRANSPORTE":
					//visao.byId("idValorTranporte").setEditable(true);
					visao.byId("TextVALE_TRANSPORTE").setVisible(true);
					visao.byId("FormContainer6_VALE_TRANSPORTE").setVisible(true);

					var smartTable = this.getView().byId("smartTable_VALE_TRANSPORTE");
					smartTable.rebindTable("e");
					break;
				case "VALE_REFEICAO":
					visao.byId("IdPlano_VALE_REFEICAO").setEditable(true);
					visao.byId("IdOpcoes_VALE_REFEICAO").setEditable(true);
					break;
				case "AUXILIO_CRECHE":
					visao.byId("IdPlano_AUXILIO_CRECHE").setEditable(true);
					visao.byId("TextAUXILIO_CRECHE").setVisible(true);
					break;
				case "COOPERATIVA":
					visao.byId("IdRubrica_COOPERATIVA").setEditable(true);
					visao.byId("IdMontanteCoop").setEditable(true);
					visao.byId("IdValidadeCoop").setEditable(true);
					visao.byId("IdObservacao_COOPERATIVA").setEditable(true);
					break;
				case "GREMIO_CLUBE":
					visao.byId("IdPlano_GREMIO_CLUBE").setEditable(true);
					visao.byId("IdObservacao_GREMIO_CLUBE").setEditable(true);
					break;
				case "EMP_CONSIGINADO":
					visao.byId("IdPlano_EMPRESTIMO_CONSIGINADO").setEditable(true);
					visao.byId("IdMontante_EMPRESTIMO_CONSIGINADO").setEditable(true);
					visao.byId("IdValidade_EMPRESTIMO_CONSIGINADO").setEditable(true);
					visao.byId("IdObservacao_EMPRESTIMO_CONSIGINADO").setEditable(true);
					break;
				case "FARMACIA":
					visao.byId("IdPlano_FARMACIA").setEditable(true);
					visao.byId("IdMotivo_FARMACIA").setEditable(true);
					break;
				case "REEMBOLSO_SUBSIDIO":
					visao.byId("IdPlano_ALIMENTACAO").setEditable(true);
					visao.byId("IdMontante_REEMBOLSO_SUBSIDIO").setEditable(true);
					visao.byId("IdValidade_REEMBOLSO_SUBSIDIO").setEditable(true);
					visao.byId("IdObservacao_REEMBOLSO_SUBSIDIO").setEditable(true);
					break;
				case "ALIMENTACAO":
					visao.byId("IdPlano_ALIMENTACAO").setEditable(true);
					visao.byId("IdOpcoes_ALIMENTACAO").setEditable(true);
					visao.byId("IdObservacao_ALIMENTACAO").setEditable(true);
					break;
				case "OTICA":
					visao.byId("IdPlano_OTICA").setEditable(true);
					visao.byId("IdOpcoes_OTICA").setEditable(true);
					visao.byId("IdObservacao_OTICA").setEditable(true);
					break;
				case "CESTA_BASICA":
					visao.byId("IdMotivo_CESTA_BASICA").setEditable(true);
					visao.byId("idTelefone").setEditable(true);
					visao.byId("TextCesta").setVisible(true);
					break;
				case "PREVIDENCIA_PRIVADA":
					visao.byId("IdMotivo_PREVIDENCIA_PRIVADA").setEditable(true);
					visao.byId("IdValor1_PREVIDENCIA_PRIVADA1").setEditable(true);
					visao.byId("TextPrevidencia").setVisible(true);
					break;
				case "PREV_PRIV_BAS":
					visao.byId("IdPlano_PREV_PRIV_BAS").setEditable(true);
					break;
				case "PREV_PRIV_ESP":
					visao.byId("IdPlano_PREV_PRIV_ESP").setEditable(true);
					break;
				case "PREV_PRIV_NOR":
					visao.byId("IdPlano_PREV_PRIV_NOR").setEditable(true);
					break;
				case "PREV_PRIV_SUP":
					visao.byId("IdPlano_PREV_PRIV_SUP").setEditable(true);
					break;
				case "REEMBOLSO_ESTACIONAM":
					visao.byId("IdPlano_REEMBOLSO_ESTACIONAM").setEditable(true);
					visao.byId("TextREEMBOLSO_ESTACIONAM").setVisible(true);
					break;
				case "REEMBOLSO_EDUCACAO":
					visao.byId("IdPlano_REEMBOLSO_EDUCACAO").setEditable(true);
					visao.byId("TextREEMBOLSO_EDUCACAO").setVisible(true);
					break;
				}

				visao.byId("IdEditDetailDep").setVisible(false);

				visao.byId("IdCancelDetailDep").setVisible(true);
			},

			FormatFalse: function () {
				return false;
			},

			onSelected: function () {
				this.getView().byId("FormContainer7_VALE_TRANSPORTE").setVisible(true);
			},

			onbeforeRebindTable_VALE_TRANSPORTE: function (oEvent) {
				var Plano = "TRANSPORTE";

				if (Plano !== undefined || Plano !== "") {
					oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
						path: "IBplan",
						operator: "EQ",
						value1: Plano
					}));

					oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
						path: "IBeneficio",
						operator: "EQ",
						value1: Plano
					}));

					oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
						path: "Chamado",
						operator: "EQ",
						//value1: "'" + chamado + "'"
						value1: chamado
					}));

				}
			},

			onbeforeRebindTable: function (oEvent) {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "IPernr",
					operator: "EQ",
					value1: Pernr
				}));

				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "IPlan",
					operator: "EQ",
					value1: "MEDI"
				}));
			},

			onbeforeRebindTable_smartTable_PLANO_ODONTOLOGICO: function (oEvent) {

				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "IPlan",
					operator: "EQ",
					value1: "DENT"
				}));

				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "IPernr",
					operator: "EQ",
					value1: Pernr
				}));
			},

			OnEditDep: function () {
				var Table = this.getView().byId("table");
				var Selecionado = Table.getSelectedItems();
				var ChaveSelec;
				var Separador;
				var length = Selecionado.length;
				var Subty;
				var Tipo = "V";
				var Objps;
				var Favor;
				var Zdesc = "DepententeDetail";

				if (length > 1) {
					sap.m.MessageBox.error("Por favor, selecione apenas um dependente para edição.");
					return;
				}

				ChaveSelec = Selecionado[0].getBindingContextPath();
				Separador = ChaveSelec.split(",");

				Subty = Separador[2];
				Subty = Subty.split("=");
				Subty = Subty[1];
				while (Subty.indexOf("'") !== -1) {
					Subty = Subty.replace("'", "");
				}

				Objps = Separador[3];
				Objps = Objps.split("=");
				Objps = Objps[1];

				this.getRouter().navTo(Zdesc, {
					Pernr: Pernr,
					Subty: Subty,
					Objps: Objps,
					Tipo: Tipo,
					Favor: Favor
				});

			},

			formatSelect: function (oValue) {
				if (oValue === "X") {
					return true;
				} else {
					return false;
				}
			},

			onChangeMotivoPrev: function () {
				var Motivo = this.getView().byId("IdMotivo_PREVIDENCIA_PRIVADA").getSelectedKey();
				var Valor = this.getView().byId("IdValor1_PREVIDENCIA_PRIVADA1");
				var Valor1 = this.getView().byId("IdValor1_PREVIDENCIA_PRIVADA");
				var Texto;

				switch (Motivo) {
				case "AB":
					Texto = "Informe para alteração de beneficiários";
					Valor.setVisible(true);
					Valor1.setVisible(false);
					break;
				case "AD":
					Texto = "Informe valor da Adesão.";
					Valor.setVisible(true);
					Valor1.setVisible(false);
					break;
				case "CA":
					Texto = "Informe o valor da contribuição adicional.";
					Valor.setVisible(false);
					Valor1.setVisible(true);
					break;
				case "CB":
					Texto = "Informe o valor da contribuição básica.";
					Valor.setVisible(true);
					Valor1.setVisible(false);
					break;
				case "MI":
					Texto = "Informe o valor para alterar modalidade de investimento.";
					Valor.setVisible(true);
					Valor1.setVisible(false);
					break;
				}

				if (Motivo === "CA") {
					this.getView().byId("FormContainer4_PREVIDENCIA_PRIVADA").setVisible(false);
					this.getView().byId("FormContainer5_PREVIDENCIA_PRIVADA").setVisible(true);
				} else if (Motivo === "AB") {
					this.getView().byId("FormContainer4_PREVIDENCIA_PRIVADA").setVisible(false);
				} else {
					this.getView().byId("FormContainer4_PREVIDENCIA_PRIVADA").setVisible(true);
					this.getView().byId("FormContainer5_PREVIDENCIA_PRIVADA").setVisible(false);

					var ValorItems = this.getView().byId("IdValor1_PREVIDENCIA_PRIVADA1").getBinding("items");
					var oFilterOpcoes = new sap.ui.model.Filter("IOpcao", sap.ui.model.FilterOperator.EQ, Motivo);
					ValorItems.filter([oFilterOpcoes]);

				}

				Valor.setPlaceholder(Texto);
				Valor1.setPlaceholder(Texto);
			},

			onCancelBeneficio: function () {
				sap.m.MessageBox.error("Anexe o formulario para continuar.");
				Cancela = "C";
				this.getView().byId("UPLOAD").setVisible(true);
				this.getView().byId("IdCancelDetailDep").setVisible(true);
			}
		});

	});