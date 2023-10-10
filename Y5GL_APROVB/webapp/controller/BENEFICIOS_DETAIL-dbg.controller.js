sap.ui.define([
	"Y5GL_APROVB/Y5GL_APROVB/controller/BaseController",
	"sap/ui/Device",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text"
], function (BaseController, Device, Dialog, Button, Text) {
	"use strict";

	return BaseController.extend("Y5GL_APROVB.Y5GL_APROVB.controller.BENEFICIOS_DETAIL", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Y5GL_APROVB.Y5GL_APROVB.view.BENEFICIOS_DETAIL
		 */
		onInit: function () {

			this.getRouter().getRoute("BENEFICIOS_DETAIL").attachPatternMatched(this._onObjectMatched, this);

			var sName = sap.ushell.Container.getUser().getFullName();
			this.getView().byId("idTitleDep").setText(sName);

		},

		formatVisible: function (oValue) {
			if (oValue === "A") {
				return true;
			} else {
				return false;
			}
		},

		formatTextEStatus: function (oValue) {

			if (oValue === "A") {
				return "Em Aprovação";
			}
			return "";
		},

		formatStateEStatus: function (oValue) {

			if (oValue === "A") {
				return "Success";
			}
			return "None";
		},

		_onObjectMatched: function (oEvent) {
			var Beneficio = oEvent.getParameter("arguments").Zparam;
			var Descricao = oEvent.getParameter("arguments").Zdesc;
			var Pernr = "0";
			this.getView().byId("idTitleDependentes").setText(Descricao);

			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("ZET_GLHR_DETAIL_BENEFICIOSSet", {
					Pernr: Pernr,
					Beneficio: Beneficio
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));

			this.getView().byId("FUNSEJEM").setVisible(false);
			this.getView().byId("PLANO_MEDICO").setVisible(false);
			this.getView().byId("PLANO_ODONTOLOGICO").setVisible(false);
			this.getView().byId("SEGURO_DE_VIDA").setVisible(false);
			this.getView().byId("VALE_TRANSPORTE").setVisible(false);
			this.getView().byId("VALE_REFEICAO").setVisible(false);
			this.getView().byId("AUXILIO_CRECHE").setVisible(false);
			this.getView().byId("COOPERATIVA").setVisible(false);
			this.getView().byId("GREMIO_CLUBE").setVisible(false);
			this.getView().byId("EMP_CONSIGINADO").setVisible(false);
			this.getView().byId("FARMACIA").setVisible(false);
			this.getView().byId("REEMBOLSO_SUBSIDIO").setVisible(false);
			this.getView().byId("ALIMENTACAO").setVisible(false);

			this.getView().byId(Beneficio).setVisible(true);
		},

		onBackMaster: function () {
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
						that.getView().byId("IdMargemEmp").setValue();
					}
				});
			}
		},

		onVoltar: function () {
			var bReplace = !Device.system.phone;
			var Zdesc = "BENEFICIOS";
			this.getRouter().navTo(Zdesc, bReplace);
		},

		onCancel: function () {
			var dialog;
			var oModel = this.getView().getModel();
			var oEntry = {};
			var that = this;
			var Beneficio = this.getView().byId("idTitleDependentes").getText();
			var Pernr = "0";
			var Key = "/ZET_GLHR_DETAIL_BENEFICIOSSet(Pernr='" + Pernr + "',Beneficio='" + Beneficio + "')";
			var erro;
			var erro2;
			var code;
			var messagem;
			var erro;

			oEntry.Tipo = "C";

			dialog = new Dialog({
				title: "Confirma\xE7\xE3o",
				type: "Message",
				content: new Text({
					text: "Deseja reprovar a solicitação do benefício?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(Key, oEntry, {
							success: function (oData, oResponse) {

								sap.m.MessageBox.success("Solicitação do benefício rejeitada com sucesso.", {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function (sAction) {
										that.getRouter().navTo("BENEFICIOS");
									}
								});
							},
							error: function (oError) {
								erro = oError;
								erro = erro.responseText;
								erro2 = JSON.parse(erro);
								messagem = erro2.error.message.value;
								sap.m.MessageBox.error(messagem, {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function (sAction) {
										that.getRouter().navTo("BENEFICIOS");
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
				}
			});
			dialog.open();

		},

		onReprove: function () {

			var dialog;
			var oModel = this.getView().getModel();
			var oEntry = {};
			var that = this;
			var Beneficio = this.getView().byId("idTitleDependentes").getText();
			var Pernr = "0";
			var Key = "/ZET_GLHR_DETAIL_BENEFICIOSSet(Pernr='" + Pernr + "',Beneficio='" + Beneficio + "')";

			oEntry.Tipo = "E";

			dialog = new Dialog({
				title: "Confirma\xE7\xE3o",
				type: "Message",
				content: new Text({
					text: "Deseja reprovar a solicitação do benefício?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(Key, oEntry, {
							success: function (oData, oResponse) {
								sap.m.MessageBox.success("Solicitação do benefício rejeitada com sucesso.", {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function (sAction) {
										that.getRouter().navTo("BENEFICIOS");
									}
								});
							},
							error: function (oError) {
								sap.m.MessageBox.error("Erro ao chamar o servi\xE7o");
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

		onAprovar: function () {
			var dialog;
			var oModel = this.getView().getModel();
			var oEntry = {};
			var that = this;
			var Beneficio = this.getView().byId("idTitleDependentes").getText();
			var Pernr = "0";
			var Key = "/ZET_GLHR_DETAIL_BENEFICIOSSet(Pernr='" + Pernr + "',Beneficio='" + Beneficio + "')";

			oEntry.Tipo = "A";

			dialog = new Dialog({
				title: "Confirma\xE7\xE3o",
				type: "Message",
				content: new Text({
					text: "Confirma a inclusão do benefício?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(Key, oEntry, {
							success: function (oData, oResponse) {
								sap.m.MessageBox.success("Benefício salvo com sucesso.", {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function (sAction) {
										that.getRouter().navTo("BENEFICIOS");
									}
								});
							},
							error: function (oError) {
								sap.m.MessageBox.error("Erro ao chamar o servi\xE7o");
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

		onSave: function () {
			var dialog;
			var oModel = this.getView().getModel();
			var oEntry = {};
			var that = this;
			var Beneficio = this.getView().byId("idTitleDependentes").getText();
			var Pernr = "0";
			var Key = "/ZET_GLHR_DETAIL_BENEFICIOSSet(Pernr='" + Pernr + "',Beneficio='" + Beneficio + "')";

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

				oEntry.CartMedica = this.getView().byId("idCartMedica").getValue();

				break;
			case "PLANO_ODONTOLOGICO":
				oEntry.Bplan = this.getView().byId("IdPlano_PLANO_ODONTOLOGICO").getSelectedKey();

				if (oEntry.Bplan === "") {
					this.getView().byId("IdPlano_PLANO_ODONTOLOGICO").setValueState("Error");
					sap.m.MessageBox.error("Informe o plano");
					return;
				} else {
					this.getView().byId("IdPlano_PLANO_ODONTOLOGICO").setValueState("Success");
				}

				oEntry.CartDentista = this.getView().byId("IdCartDentista").getValue();
				break;
			case "SEGURO_DE_VIDA":
				oEntry.Bplan = this.getView().byId("IdPlano_SEGURO_DE_VIDA").getSelectedKey();

				if (oEntry.Bplan === "") {
					this.getView().byId("IdPlano_SEGURO_DE_VIDA").setValueState("Error");
					sap.m.MessageBox.error("Informe o plano");
					return;
				} else {
					this.getView().byId("IdPlano_SEGURO_DE_VIDA").setValueState("Success");
				}
				break;
			case "VALE_TRANSPORTE":
				oEntry.Bplan = this.getView().byId("IdPlano_VALE_TRANSPORTE").getSelectedKey();

				if (oEntry.Bplan === "") {
					this.getView().byId("IdPlano_VALE_TRANSPORTE").setValueState("Error");
					sap.m.MessageBox.error("Informe o plano");
					return;
				} else {
					this.getView().byId("IdPlano_VALE_TRANSPORTE").setValueState("Success");
				}

				oEntry.Opcoes = this.getView().byId("IdOpcoes_VALE_TRANSPORTE").getSelectedKey();

				if (oEntry.Opcoes === "") {
					this.getView().byId("IdOpcoes_VALE_TRANSPORTE").setValueState("Error");
					sap.m.MessageBox.error("Informe a opção");
					return;
				} else {
					this.getView().byId("IdOpcoes_VALE_TRANSPORTE").setValueState("Success");
				}

				oEntry.Observacao = this.getView().byId("IdObservacao_VALE_TRANSPORTE").getValue();
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
				oEntry.Bplan = this.getView().byId("IdPlano_AUXILIO_CRECHE").getSelectedKey();

				if (oEntry.Bplan === "") {
					this.getView().byId("IdPlano_AUXILIO_CRECHE").setValueState("Error");
					sap.m.MessageBox.error("Informe o plano");
					return;
				} else {
					this.getView().byId("IdPlano_AUXILIO_CRECHE").setValueState("Success");
				}

				oEntry.Opcoes = this.getView().byId("IdOpcoes_AUXILIO_CRECHE").getSelectedKey();

				if (oEntry.Opcoes === "") {
					this.getView().byId("IdOpcoes_AUXILIO_CRECHE").setValueState("Error");
					sap.m.MessageBox.error("Informe a opção");
					return;
				} else {
					this.getView().byId("IdOpcoes_AUXILIO_CRECHE").setValueState("Success");
				}

				oEntry.Observacao = this.getView().byId("IdObservacao_AUXILIO_CRECHE").getValue();
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
				oEntry.Observacao = this.getView().byId("IdObservacao_FARMACIA").getValue();
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
			}

			oEntry.Tipo = "G";

			if (oEntry.Montante !== "" && oEntry.Montante !== undefined) {

				while (oEntry.Montante.indexOf(".") !== -1) {
					oEntry.Montante = oEntry.Montante.replace(".", "");
				}

				oEntry.Montante = oEntry.Montante.replace(",", ".");

			}

			dialog = new Dialog({
				title: "Confirma\xE7\xE3o",
				type: "Message",
				content: new Text({
					text: "Confirma a inclusão do benefício?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(Key, oEntry, {
							success: function (oData, oResponse) {
								sap.m.MessageBox.success("Benefício salvo com sucesso.", {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function (sAction) {
										that.getRouter().navTo("BENEFICIOS");
									}
								});
							},
							error: function (oError) {
								sap.m.MessageBox.error("Erro ao chamar o servi\xE7o");
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
		
		// -- Aprovação Portal EC
		onAprovar: function () {
			var dialog;
			var oModel = this.getView().getModel();
			var oEntry = {};
			var that = this;
			var Beneficio = this.getView().byId("idTitleDependentes").getText();
			var Pernr = "0";
			
				switch (Beneficio) {
			case "ALIMENTAÇÃO":
				Beneficio = "ALIMENTACAO";
				break;
			case "PLANO MÉDICO":
				Beneficio = "PLANO_MEDICO";
				break;
			case "PLANO ODONTOLÓGICO":
				Beneficio = "PLANO_ODONTOLOGICO";
				break;
			case "REEMBOLSO SUBSIDIO":
				Beneficio = "REEMBOLSO_SUBSIDIO";
				break;
			case "SEGURO DE VIDA":
				Beneficio = "SEGURO_DE_VIDA";
				break;
			case "VALE TRANSPORTE":
				Beneficio = "VALE_TRANSPORTE";
				break;
			};
			
			var Key = "/ZET_GLHR_DETAIL_BENEFICIOSSet(Pernr='" + Pernr + "',Beneficio='" + Beneficio + "')";
			oEntry.Tipo = "X";

			switch (Beneficio) {
			case "FUNSEJEM":
				oEntry.Bplan = this.getView().byId("IdPlano_FUNSEJEM").getSelectedKey();
				oEntry.Beneficio = Beneficio;
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
						oEntry.MargemFunsejem = oEntry.MargemFunsejem.replace(",00","");
						//oEntry.MargemFunsejem = oEntry.MargemFunsejem.replace(".", "");
						//oEntry.MargemFunsejem = oEntry.MargemFunsejem.replace(",", ".");
					}
					oEntry.MargemFunsejem = oEntry.MargemFunsejem.replace(",00", "");
					//oEntry.MargemFunsejem = oEntry.MargemFunsejem.replace(".", "");
					//oEntry.MargemFunsejem = oEntry.MargemFunsejem.replace(",", ".");

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

				oEntry.CartMedica = this.getView().byId("idCartMedica").getValue();

				break;
			case "PLANO_ODONTOLOGICO":
				oEntry.Bplan = this.getView().byId("IdPlano_PLANO_ODONTOLOGICO").getSelectedKey();

				if (oEntry.Bplan === "") {
					this.getView().byId("IdPlano_PLANO_ODONTOLOGICO").setValueState("Error");
					sap.m.MessageBox.error("Informe o plano");
					return;
				} else {
					this.getView().byId("IdPlano_PLANO_ODONTOLOGICO").setValueState("Success");
				}

				oEntry.CartDentista = this.getView().byId("IdCartDentista").getValue();
				break;
			case "SEGURO_DE_VIDA":
				oEntry.Bplan = this.getView().byId("IdPlano_SEGURO_DE_VIDA").getSelectedKey();

				if (oEntry.Bplan === "") {
					this.getView().byId("IdPlano_SEGURO_DE_VIDA").setValueState("Error");
					sap.m.MessageBox.error("Informe o plano");
					return;
				} else {
					this.getView().byId("IdPlano_SEGURO_DE_VIDA").setValueState("Success");
				}
				break;
			case "VALE_TRANSPORTE":
				oEntry.Bplan = this.getView().byId("IdPlano_VALE_TRANSPORTE").getSelectedKey();

				if (oEntry.Bplan === "") {
					this.getView().byId("IdPlano_VALE_TRANSPORTE").setValueState("Error");
					sap.m.MessageBox.error("Informe o plano");
					return;
				} else {
					this.getView().byId("IdPlano_VALE_TRANSPORTE").setValueState("Success");
				}

				oEntry.Opcoes = this.getView().byId("IdOpcoes_VALE_TRANSPORTE").getSelectedKey();

				if (oEntry.Opcoes === "") {
					this.getView().byId("IdOpcoes_VALE_TRANSPORTE").setValueState("Error");
					sap.m.MessageBox.error("Informe a opção");
					return;
				} else {
					this.getView().byId("IdOpcoes_VALE_TRANSPORTE").setValueState("Success");
				}

				oEntry.Observacao = this.getView().byId("IdObservacao_VALE_TRANSPORTE").getValue();
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
				oEntry.Bplan = this.getView().byId("IdPlano_AUXILIO_CRECHE").getSelectedKey();

				if (oEntry.Bplan === "") {
					this.getView().byId("IdPlano_AUXILIO_CRECHE").setValueState("Error");
					sap.m.MessageBox.error("Informe o plano");
					return;
				} else {
					this.getView().byId("IdPlano_AUXILIO_CRECHE").setValueState("Success");
				}

				oEntry.Opcoes = this.getView().byId("IdOpcoes_AUXILIO_CRECHE").getSelectedKey();

				if (oEntry.Opcoes === "") {
					this.getView().byId("IdOpcoes_AUXILIO_CRECHE").setValueState("Error");
					sap.m.MessageBox.error("Informe a opção");
					return;
				} else {
					this.getView().byId("IdOpcoes_AUXILIO_CRECHE").setValueState("Success");
				}

				oEntry.Observacao = this.getView().byId("IdObservacao_AUXILIO_CRECHE").getValue();
				break;
			case "COOPERATIVA":
				oEntry.Rubrica = this.getView().byId("IdRubrica_COOPERATIVA").getvalue();

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
				oEntry.Observacao = this.getView().byId("IdObservacao_FARMACIA").getValue();
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
			}

			oEntry.Tipo = "X";

			if (oEntry.Montante !== "" && oEntry.Montante !== undefined) {

				while (oEntry.Montante.indexOf(".") !== -1) {
					oEntry.Montante = oEntry.Montante.replace(".", "");
					oEntry.Montante = oEntry.Montante.replace(",", ".");

				}
				//oEntry.Montante = oEntry.Montante.replace(",00", "");
				oEntry.Montante = oEntry.Montante.replace(".", "");
				oEntry.Montante = oEntry.Montante.replace(",", ".");
			}

			dialog = new Dialog({
				title: "Confirma\xE7\xE3o",
				type: "Message",
				content: new Text({
					text: "Confirma a aprovação do benefício" + " " + Beneficio + " ?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(Key, oEntry, {
							success: function (oData, oResponse) {
								sap.m.MessageBox.success("Benefício" + " " + Beneficio + " " + "aprovado com sucesso.", {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function (sAction) {
										that.getRouter().navTo("BENEFICIOS");
									}
								});
							},
							error: function (oError) {
								sap.m.MessageBox.error("Erro ao chamar o servi\xE7o");
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
		//-- Aprovação Portal EC

		_onBindingChange: function () {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();
			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				//this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}

			var IdMargemEmp = this.getView().byId("IdMargemEmp").getValue();

			if (IdMargemEmp !== "") {
				IdMargemEmp = parseFloat(IdMargemEmp).toFixed(2);

				while (IdMargemEmp.indexOf(".") !== -1) {
					IdMargemEmp = IdMargemEmp.replace(".", ",");
				}
				IdMargemEmp = this.adicionarpontoFloat(IdMargemEmp);
				this.getView().byId("IdMargemEmp").setValue(IdMargemEmp);
			}

		}
	});

});