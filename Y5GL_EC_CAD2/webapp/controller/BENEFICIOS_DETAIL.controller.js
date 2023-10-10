sap.ui.define([
	"Y5GL_EC_CAD2/Y5GL_EC_CAD2/controller/BaseController",
	"sap/ui/Device",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text"
], function (BaseController, Device, Dialog, Button, Text) {
	"use strict";

	var param;
	var edit;

	return BaseController.extend("Y5GL_EC_CAD2.Y5GL_EC_CAD2.controller.BENEFICIOS_DETAIL", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Y5GL_EC_CAD2.Y5GL_EC_CAD2.view.BENEFICIOS_DETAIL
		 */

		onInit: function () {
			this.getRouter().getRoute("BENEFICIOS_DETAIL").attachPatternMatched(this._onObjectMatched, this);
			var sName = sap.ushell.Container.getUser().getFullName();
			this.getView().byId("idTitleDep").setText(sName);

			this.buscaImagem();
		},

		formatVisibleMsg: function (oValue) {
			if (oValue === "Em ResoluÃ§Ã£o") {
				return true;
			} else {
				return false;
			}
		},

		FormatEditable: function (oValue) {
			if (oValue === "") {
				return true;
			} else {
				return false;
			}
		},

		formatVisiblebButton: function (oValue) {
			if (oValue == "X") {
				return false;
			} else {
				return true;
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

		FormatForm: function (oValue) {
			return false;
		},

		_onObjectMatched: function (oEvent) {
			this.getView().getModel().refresh(true);

			var Beneficio = oEvent.getParameter("arguments").Zparam;
			var Descricao = oEvent.getParameter("arguments").Zdesc;
			var Pernr = "0";
			this.getView().byId("idTitleDependentes").setText(Descricao);

			param = Beneficio;

			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("ZET_GLHR_DETAIL_BENEFICIOSSet", {
					IPernr: Pernr,
					IBeneficio: Beneficio,
					ITipo: "V"

				});
				this._bindView("/" + sObjectPath);
			}.bind(this));

			var infty;
			var subty;
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
			case "SEGURO_DE_VIDA":
				infty = "0168";
				subty = "VIDA";
				break;
			case "VALE_TRANSPORTE":
				infty = "0377";
				subty = "TRAN";
				break;
			case "VALE_REFEICAO":
				infty = "0377";
				subty = "VALM";
				break;
			case "AUXILIO_CRECHE":
				infty = "0377";
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
				break;
			case "PREVIDENCIA_PRIVADA":
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
			}
			var Subty = subty;
			if (Pernr !== "" || Subty !== "") {
				var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr);
				var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
				var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, Subty);
				var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "U");
				var oList = this.getView().byId("UploadCollection");
				oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo]);
			}
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
					actions: ["OK"],
					onClose: function (sAction) {
						that.getView().byId("IdMargemEmp").setValue();
					}
				});
			}
		},

		onVoltar: function () {
			var bReplace;
			var Zdesc;

			if (edit === true) {
				var that = this;
				var dialog3;

				dialog3 = new Dialog({
					title: "Confirma\xE7\xE3o",
					type: "Message",
					content: new Text({
						text: "As alterações não seram gravadas, deseja voltar?"
					}),
					beginButton: new Button({
						text: "Sim",
						press: function () {
							edit = false;
							that.getView().getModel().refresh(true);
							that.getView().byId("IdCancelDetailDep").setVisible(false);
							bReplace = !Device.system.phone;
							Zdesc = "BENEFICIOS";
							that.getRouter().navTo(Zdesc, bReplace);
							dialog3.close();
						}
					}),
					endButton: new Button({
						text: "N\xE3o",
						press: function () {
							dialog3.close();
						}
					}),
					afterClose: function () {
						dialog3.destroy();
					}
				});
				dialog3.open();
			} else {
				this.getView().byId("IdCancelDetailDep").setVisible(false);
				bReplace = !Device.system.phone;
				Zdesc = "BENEFICIOS";
				this.getRouter().navTo(Zdesc, bReplace);
			}

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
			this.getView().getModel().refresh(true);
			edit = false;
			this.getView().byId("IdCancelDetailDep").setVisible(false);
		},

		onSave: function () {
			var dialog;
			var oModel = this.getView().getModel();
			var oEntry = {};
			var that = this;
			var Beneficio = param;
			var Pernr = "0";
			var Key = "/ZET_GLHR_DETAIL_BENEFICIOSSet(IPernr='" + Pernr + "',IBeneficio='" + Beneficio + "',ITipo='G')";

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

				oEntry.Observacao = this.getView().byId("IdObservacao_CESTA_BASICA").getValue();
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
				} else {
					this.getView().byId("IdCartPLANO_DENT_2").setValueState("Success");
				}
				break;
			case "REFEITORIO":
				oEntry.Bplan = this.getView().byId("IdPlano_REFEITORIO").getSelectedKey();
				oEntry.Opcoes = this.getView().byId("IdPlano_REFEITORIO").getSelectedKey();
				break;
			}

			oEntry.Tipo = "G";
			oEntry.Beneficio = Beneficio;

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
					text: "Confirma alteração/inclusão do Benefício?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(Key, oEntry, {
							success: function (oData, oResponse) {
								sap.m.MessageBox.success("Benefício salvo com sucesso.", {
									actions: ["OK"],
									onClose: function (sAction) {
										that.getView().getModel().refresh(true);
										that.getRouter().navTo("BENEFICIOS");
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
			var that = this;
			var oViewModel = this.getView().getModel();
			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);
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

		_onBindingChange: function () {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();
			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master listNOTE
				// does not make sense anymore.
				//this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}

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

		},

		onChange: function (oEvent) {
			var oUploadCollection = oEvent.getSource();
			var oModel = this.getView().getModel();
			oModel.refreshSecurityToken();
			var oHeaders = oModel.oHeaders;
			var sToken = oHeaders['x-csrf-token'];
			// Stellen das CSRF Token wenn ein File hinzugefügt ist
			var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
				name: "x-csrf-token",
				value: sToken
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
		},

		onBeforeUploadStarts: function (oEvent) {
			var specialChars = /[^a-zA-Z0-9 ]/g;
			var fileName = oEvent.getParameter("fileName").split(".", 1);
			
			if (fileName[0].match(specialChars)){
				sap.m.MessageBox.error("O arquivo que você está tentando importar, possui caracteres especiais no nome. Renomeie o arquivo e tente novamente!");
				return;
			}
			
			var Pernr = "0";
			var infty;

			var infty;
			var subty;
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
			case "SEGURO_DE_VIDA":
				infty = "0168";
				subty = "VIDA";
				break;
			case "VALE_TRANSPORTE":
				infty = "0377";
				subty = "TRAN";
				break;
			case "VALE_REFEICAO":
				infty = "0377";
				subty = "VALM";
				break;
			case "AUXILIO_CRECHE":
				infty = "0377";
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
				break;
			case "PREVIDENCIA_PRIVADA":
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
			}
			var Subty = subty;
			var Objps = "0";
			if (Pernr !== "" || Subty !== "" || Objps !== "") {
				var sSlug = Pernr + "$" + infty + "$" + Subty + "$" + Objps + "$" + oEvent.getParameter("fileName");
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
			case "SEGURO_DE_VIDA":
				infty = "0168";
				subty = "VIDA";
				break;
			case "VALE_TRANSPORTE":
				infty = "0377";
				subty = "TRAN";
				break;
			case "VALE_REFEICAO":
				infty = "0377";
				subty = "VALM";
				break;
			case "AUXILIO_CRECHE":
				infty = "0377";
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
				break;
			case "PREVIDENCIA_PRIVADA":
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
			}
			var Subty = subty;

			if (Pernr !== "" || Subty !== "") {
				var oFiltertTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "U");
				var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
				var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, Subty);
				var oList = this.getView().byId("UploadCollection");

				oList.getBinding("items").filter([oFilterInfty, oFilterSubty, oFiltertTipo]);
			}
			
			
		},

		onmodelListContextChange: function (oEvent) {
			var Pernr = "0";
			var infty;
			var subty;
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
			case "SEGURO_DE_VIDA":
				infty = "0168";
				subty = "VIDA";
				break;
			case "VALE_TRANSPORTE":
				infty = "0377";
				subty = "TRAN";
				break;
			case "VALE_REFEICAO":
				infty = "0377";
				subty = "VALM";
				break;
			case "AUXILIO_CRECHE":
				infty = "0377";
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
				break;
			case "PREVIDENCIA_PRIVADA":
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
			}
			var Subty = subty;
			if (Pernr !== "" || Subty !== "") {
				var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr);
				var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
				var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, Subty);
				var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "U");
				var oList = this.getView().byId("UploadCollection");
				oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo]);
			}
		},

		onDeleteSelectedItems: function (oEvent) {
			var UploadCollection = this.getView().byId("UploadCollection");
			var oList = UploadCollection.oList;
			var infty;
			var subty;
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
			case "SEGURO_DE_VIDA":
				infty = "0168";
				subty = "VIDA";
				break;
			case "VALE_TRANSPORTE":
				infty = "0377";
				subty = "TRAN";
				break;
			case "VALE_REFEICAO":
				infty = "0377";
				subty = "VALM";
				break;
			case "AUXILIO_CRECHE":
				infty = "0377";
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
				break;
			case "PREVIDENCIA_PRIVADA":
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
			}

			var oModel = this.getView().getModel();
			var Ano = "0";
			var Favor = "0";
			var Infty = infty;
			var Mes = "0";
			var Pernr = "0";
			var Tipo = "E";
			var Subty = subty;
			var ListItem = oEvent.getParameters("listItem");
			var docid = ListItem.documentId;
			docid = parseInt(docid);
			var idTipo = this.getView().byId("idTipo").getValue();
			
			if (idTipo === "Em ResoluÃ§Ã£o"){
				sap.m.MessageBox.error("Não será possivel exclusão do anexo, quando o chamado ja existir.");
				return;
			}
			
			var UploadCollection = this.getView().byId("UploadCollection");
			
			//var Key = "/ZET_GLRH_UPLOADSet(Ano='" + Ano + "',Favor='" + Favor + "',Infty='" + Infty + "',Mes='" + Mes + "',Pernr='" + Pernr +
			//	"',Tipo='" + Tipo + "',Subty='" + Subty + "',DocId=" + docid + ",Objps='',Icnum='')";
			var Key = "/ZET_GLRH_UPLOADSet(Ano='" + Ano + "',Favor='" + Favor + "',Infty='" + Infty + "',Mes='" + Mes + "',Pernr='" + Pernr +
				"',Tipo='" + Tipo + "',Subty='" + Subty + "',DocId=" + docid + ",Objps='',Icnum='',Dependentes='',Valor='',Area='')";
			var oEntry = {};
			oEntry.DocId = 1;

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
									actions: ["OK"],
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
									actions: ["OK"],
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

		onEdit: function () {
			var visao = this.getView();
			edit = true;

			switch (param) {
			case "FUNSEJEM":
				visao.byId("IdPlano_FUNSEJEM").setEditable(true);
				visao.byId("IdMargemEmp").setEditable(true);
				break;
			case "PLANO_MEDICO":
				visao.byId("IdPlano_PLANO_MEDICO").setEditable(true);
				visao.byId("idCartMedica").setEditable(true);
				break;
			case "PLANO_ODONTOLOGICO":
				visao.byId("IdPlano_PLANO_ODONTOLOGICO").setEditable(true);
				visao.byId("IdCartDentista").setEditable(true);
				break;
			case "PLANO_DENT_2":
				visao.byId("IdPlano_PLANO_DENT_2").setEditable(true);
				visao.byId("IdCartPLANO_DENT_2").setEditable(true);
			case "SEGURO_DE_VIDA":
				visao.byId("IdPlano_SEGURO_DE_VIDA").setEditable(true);
				break;
			case "VALE_TRANSPORTE":
				visao.byId("IdPlano_VALE_TRANSPORTE").setEditable(true);
				visao.byId("IdOpcoes_VALE_TRANSPORTE").setEditable(true);
				visao.byId("IdObservacao_VALE_TRANSPORTE").setEditable(true);
				break;
			case "VALE_REFEICAO":
				visao.byId("IdPlano_VALE_REFEICAO").setEditable(true);
				visao.byId("IdOpcoes_VALE_REFEICAO").setEditable(true);
				break;
			case "AUXILIO_CRECHE":
				visao.byId("IdPlano_AUXILIO_CRECHE").setEditable(true);
				visao.byId("IdOpcoes_AUXILIO_CRECHE").setEditable(true);
				visao.byId("IdObservacao_AUXILIO_CRECHE").setEditable(true);
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
				visao.byId("IdObservacao_FARMACIA").setEditable(true);
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
				visao.byId("IdPlano_CESTA_BASICA").setEditable(true);
				visao.byId("IdOpcoes_CESTA_BASICA").setEditable(true);
				visao.byId("IdObservacao_CESTA_BASICA").setEditable(true);
				break;
			case "PREVIDENCIA_PRIVADA":
				visao.byId("IdPlano_PREVIDENCIA_PRIVADA").setEditable(true);
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
			}
			visao.byId("IdSalvarDetailDep").setVisible(true);
			visao.byId("IdCancelDetailDep").setVisible(true);
			visao.byId("IdEditDetailDep").setVisible(false);
			visao.byId("UploadCollection").setUploadButtonInvisible(false);
		}
	});

});