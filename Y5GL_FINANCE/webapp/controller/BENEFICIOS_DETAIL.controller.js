sap.ui.define([
	"Y5GL_FINANCE/Y5GL_FINANCE/controller/BaseController",
	"sap/ui/Device",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text",
	"sap/ui/model/Filter",
	"sap/m/Label",
	"sap/m/TextArea",
	'sap/m/ButtonType'
], function (BaseController, Device, Dialog, Button, Text, Filter, Label, TextArea, ButtonType) {
	"use strict";

	var param, edit, dep, chaveacao, via2, Cancela, Pernr;
	var operacao = "";
	var chamado;

	return BaseController.extend("Y5GL_FINANCE.Y5GL_FINANCE.controller.BENEFICIOS_DETAIL", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Y5GL_EC_BENEFICIOS.Y5GL_EC_BENEFICIOS.view.BENEFICIOS_DETAIL
		 */

		onInit: function () {
			this.getRouter().getRoute("BENEFICIOS_DETAIL").attachPatternMatched(this._onObjectMatched, this);
			var sName = sap.ushell.Container.getUser().getFullName();
			//this.getView().byId("idTitleDep").setText(sName);

			// Image loading
			var sRootPath = jQuery.sap.getModulePath("Y5GL_FINANCE.Y5GL_FINANCE");
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
			// if (oValue === "") {
			// 	return true;
			// } else {
			// 	return false;
			// }
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

		FormatForm: function (oValue) {
			return false;
		},

		onBindingContextUpload: function (oEvent) {
			var teste = oEvent;
		},

		_onObjectMatched: function (oEvent) {
			this.getView().getModel().refresh(true);
			var Beneficio = oEvent.getParameter("arguments").Beneficio;
			chamado = oEvent.getParameter("arguments").Chamado;
			Pernr = oEvent.getParameter("arguments").Pernr;
			var Descricao = oEvent.getParameter("arguments").Zdesc;
			var Bplan;
			var Opcoes;
			var Tipo;
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
			var number;
			var numero = oEvent.getParameter("value");
			var oEvent_id = oEvent.getParameter("id");
			var id = oEvent_id.split("DETAIL--")[1];
			var numero_aux;

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
						that.getView().byId("IdMontante_EMP_CONSIGNADO").setValue();
					}
				});
			}
		},

		onVoltar: function () {
			var bReplace;
			var Zdesc;

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
			if (oValue != null) {
				if (oValue === "Não") {
					return "sap-icon://add";
				} else if (oValue === "Sim") {
					return "sap-icon://delete";
				}
			}
		},

		FormatBVisible: function (oValue) {
			if (oValue != null) {
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
			var dialog;
			var oModel = this.getView().getModel();
			var oEntry = {};
			var that = this;
			var Beneficio = param;
			var Pernr = "0";
			var Tipo;

			if (Beneficio == "EMP_CONSIGNADO" || Beneficio == "LABORAL" || Beneficio == "PASAJE") {
				Tipo = 'L';
			} else if(Beneficio == "SEGURO_DE_VIDA" || Beneficio == "PLANO_MEDICO") {
				Tipo = "K";
			} else if(Beneficio == "ESTAC_MOVBUS" || Beneficio == "REEMBOLSO_CURSOS") {
				Tipo = "M";
			}

			var Key = "/ZET_GLHR_DETAIL_BENEFICIOSSet(Pernr='" + Pernr + "',Beneficio='" + Beneficio + "',Tipo='" + Tipo + "')";
			var desativaValor = "";

			switch (Beneficio) {
			case "EMP_CONSIGNADO":
				oEntry.Rubrica = this.getView().byId("IdPlano_EMP_CONSIGNADO").getSelectedKey();
				oEntry.Montante = this.getView().byId("IdMontante_EMP_CONSIGNADO").getValue();
				oEntry.Validade = this.getView().byId("IdValidade_EMP_CONSIGNADO").getValue();
				oEntry.Observacao = this.getView().byId("IdObservacao_EMP_CONSIGNADO").getValue();
				desativaValor = "x";
				break;
			case "SEGURO_DE_VIDA":
				oEntry.Bplan = this.getView().byId("IdPlano_SEGURO_DE_VIDA").getSelectedKey();
				oEntry.Opcoes = this.getView().byId("IdOpcoes_SEGURO_DE_VIDA").getSelectedKey();
				desativaValor = "x";
				break;
			case "PLANO_MEDICO":
				oEntry.Bplan = this.getView().byId("IdPlano_PLANO_MEDICO").getSelectedKey();
				oEntry.Opcoes = this.getView().byId("IdOpcoes_PLANO_MEDICO").getSelectedKey();
				desativaValor = "x";
				break;
			}

			if (desativaValor !== "x") {
				var mes = this.getView().byId("IdPlano_" + param).getSelectedKey();
				var ano = this.getView().byId("IdAno_" + param).getSelectedKey();
				oEntry.Valor = mes + "_" + ano;
			}
			
			oEntry.Chamado = chamado;
			oEntry.Tipo = oEntry.Operation;
			oEntry.Beneficio = Beneficio;
			if (oEntry.Montante !== "" && oEntry.Montante !== undefined) {
				while (oEntry.Montante.indexOf(".") !== -1) {
					oEntry.Montante = oEntry.Montante.replace(".", "");
				}
				oEntry.Montante = oEntry.Montante.replace(",", ".");
			}
			this.GravaBeneficio(Key, oEntry, via2);
		},

		GravaBeneficio: function (key, oEntry, via2) {
			var that = this;
			var oModel = this.getView().getModel();
			var menssagemsave = "";
			var Zdesc;

			Zdesc = "worklist";

			if (via2 === "X") {
				menssagemsave = "¿Confirmar pedido duplicado?";
			} else {
				menssagemsave = "¿Confirma el cambio / inclusión del beneficio?";
			}

			var dialog = new Dialog({
				title: "Confirmación",
				type: "Message",
				content: new Text({
					text: menssagemsave
				}),
				beginButton: new Button({
					text: "Si",
					press: function () {
						oModel.update(key, oEntry, {
							success: function (oData, oResponse) {
								sap.m.MessageBox.success("Beneficio guardado con éxito", {
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
			var infty, subty;
			this.getView().byId(param).setVisible(true);
			this.getView().byId("UPLOAD").setVisible(true);
			this.getView().byId("UploadCollection").setUploadButtonInvisible(true);
			if (param !== undefined) {

				switch (param) {
				case "EMP_CONSIGNADO":
					// this.getView().byId("IdPlano_EMP_CONSIGNADO
					// this.getView().byId("IdMontante_EMP_CONSIGNADO
					// this.getView().byId("IdValidade_EMP_CONSIGNADO
					// this.getView().byId("IdObservacao_EMP_CONSIGNADO
					break;
				case "ESTAC_MOVBUS":
					var valor1 = this.getView().byId("alug1").getValue();
					var valor = valor1;
					valor = valor.split("_");
					var mes1 = valor[0];
					var ano1 = valor[1];

					this.getView().byId("IdPlano_ESTAC_MOVBUS").setSelectedKey(mes1);
					this.getView().byId("IdAno_ESTAC_MOVBUS").setSelectedKey(ano1);
					infty = "XXXX";
					subty = "ESMV";

					var oFilterValor = new sap.ui.model.Filter("Valor", sap.ui.model.FilterOperator.EQ, valor1);
					var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr);
					var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
					var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, subty);
					var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "C");

					var oList = this.getView().byId("UploadCollection");
					oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo, oFilterValor]);
					return;

				case "LABORAL":
					var valor1 = this.getView().byId("alug1").getValue();
					var valor = valor1;
					valor = valor.split("_");
					var mes1 = valor[0];
					var ano1 = valor[1];

					this.getView().byId("IdPlano_LABORAL").setSelectedKey(mes1);
					this.getView().byId("IdAno_LABORAL").setSelectedKey(ano1);
					infty = "XXXX";
					subty = "LABO";

					var oFilterValor = new sap.ui.model.Filter("Valor", sap.ui.model.FilterOperator.EQ, valor1);
					var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr);
					var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
					var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, subty);
					var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "C");

					var oList = this.getView().byId("UploadCollection");
					oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo, oFilterValor]);
					return;
				case "PASAJE":
					// this.pasaje();
					// break;
				case "REEMBOLSO_CURSOS":
					var valor1 = this.getView().byId("alug1").getValue();
					var valor = valor1;
					valor = valor.split("_");
					var mes1 = valor[0];
					var ano1 = valor[1];

					this.getView().byId("IdPlano_REEMBOLSO_CURSOS").setSelectedKey(mes1);
					this.getView().byId("IdAno_REEMBOLSO_CURSOS").setSelectedKey(ano1);
					infty = "XXXX";
					subty = "RECU";

					var oFilterValor = new sap.ui.model.Filter("Valor", sap.ui.model.FilterOperator.EQ, valor1);
					var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr);
					var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
					var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, subty);
					var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "C");

					var oList = this.getView().byId("UploadCollection");
					oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo, oFilterValor]);
					return;
				case "REEMBOLSO_EXPATRIADO":
					var valor1 = this.getView().byId("alug1").getValue();
					var valor = valor1;
					valor = valor.split("_");
					var mes1 = valor[0];
					var ano1 = valor[1];

					this.getView().byId("IdPlano_REEMBOLSO_EXPATRIADO").setSelectedKey(mes1);
					this.getView().byId("IdAno_REEMBOLSO_EXPATRIADO").setSelectedKey(ano1);
					infty = "XXXX";
					subty = "REEX";

					var oFilterValor = new sap.ui.model.Filter("Valor", sap.ui.model.FilterOperator.EQ, valor1);
					var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr);
					var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
					var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, subty);
					var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "C");

					var oList = this.getView().byId("UploadCollection");
					oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo, oFilterValor]);
					return;
				case "REEMBOLSO_IDIOMA":
					var valor1 = this.getView().byId("alug1").getValue();
					var valor = valor1;
					valor = valor.split("_");
					var mes1 = valor[0];
					var ano1 = valor[1];

					this.getView().byId("IdPlano_REEMBOLSO_IDIOMA").setSelectedKey(mes1);
					this.getView().byId("IdAno_REEMBOLSO_IDIOMA").setSelectedKey(ano1);
					infty = "XXXX";
					subty = "REID";

					var oFilterValor = new sap.ui.model.Filter("Valor", sap.ui.model.FilterOperator.EQ, valor1);
					var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr);
					var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
					var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, subty);
					var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "C");

					var oList = this.getView().byId("UploadCollection");
					oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo, oFilterValor]);
					return;
				case "SEGURO_DE_VIDA":
					// this.seguroVida();
					// break;
				case "PLANO_MEDICO":
					// this.planoMedico();
					// break;
				}
			}

			this.filtraUploadCollection();
		},

		filtraUploadCollection: function () {
			var infty, subty;

			if (param !== undefined) {
				switch (param) {
				case "EMP_CONSIGNADO":
					infty = "XXXX";
					subty = "EMCO";
					break;
				case "ESTAC_MOVBUS":
					infty = "XXXX";
					subty = "ESMV";
					break;
				case "LABORAL":
					infty = "XXXX";
					subty = "LABO";
					break;
				case "PASAJE":
					infty = "XXXX";
					subty = "PASA";
					break;
				case "REEMBOLSO_CURSOS":
					infty = "XXXX";
					subty = "RECU";
					break;
				case "REEMBOLSO_EXPATRIADO":
					infty = "XXXX";
					subty = "REEX";
					break;
				case "REEMBOLSO_IDIOMA":
					infty = "XXXX";
					subty = "REID";
					break;
				case "SEGURO_DE_VIDA":
					infty = "0168";
					subty = "VIDA";
					break;
				case "PLANO_MEDICO":
					infty = "0167";
					subty = "MEDI";
					break;
				}

				if (subty !== "") {
					var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr);
					var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
					var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, subty);
					var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "C");
					var oList = this.getView().byId("UploadCollection");
					oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo]);
				}
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
				if (Valor === "") {
					sap.m.MessageBox.error("Selecione mês de referencia.");
					return;
				}
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

				if (Valor === "") {
					sap.m.MessageBox.error("Selecione mês de referencia.");
					return;
				}
				break;
			case "REEMBOLSO_EDUCACAO":
				infty = "XXXX";
				subty = "REED";
				Valor = this.getView().byId("IdPlano_REEMBOLSO_EDUCACAO").getSelectedKey();

				if (Valor === "") {
					sap.m.MessageBox.error("Selecione mês de referencia.");
					return;
				}
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
				var oFiltertTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "C");
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
			}
			var Subty = subty;
			if (Pernr !== "" || Subty !== "") {
				var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr);
				var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
				var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, Subty);
				var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "C");
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

		formatFalse: function () {
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