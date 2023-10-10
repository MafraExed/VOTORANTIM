sap.ui.define([
	"Y5GL_EC_BENEF2/Y5GL_EC_BENEF2/controller/BaseController",
	"sap/ui/Device",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text",
	"sap/ui/model/Filter",
	"sap/m/Label",
	"sap/m/TextArea",
	"sap/m/ButtonType"
], function (BaseController, Device, Dialog, Button, Text, Filter, Label, TextArea, ButtonType) {
	"use strict";

	var param, edit, dep, chaveacao, via2, Cancela;
	var operacao = "";

	return BaseController.extend("Y5GL_EC_BENEF2.Y5GL_EC_BENEF2.controller.BENEFICIOS_DETAIL", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Y5GL_EC_BENEF2.Y5GL_EC_BENEF2.view.BENEFICIOS_DETAIL
		 */

		onInit: function () {
			this.getRouter().getRoute("BENEFICIOS_DETAIL").attachPatternMatched(this._onObjectMatched, this);

			this.buscaImagem();
		},

		formatVisibleMsg: function (oValue) {
			if (oValue === "Aguardando aprovação") {
				return true;
			} else {
				return false;
			}
		},

		formatVisibleexcl: function (oValue) {
			if (oValue === "F") {
				return false;
			} else {
				return true;
			}
		},

		FormatEditable: function (oValue) {
			if (oValue === "") {
				return true;
			} else {
				return false;
			}
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
			if (oValue === "Aguardando aprovação") {
				return true;
			} else {
				return false;
			}
		},

		FormatBV: function (oValue) {
			if (param !== "COOPERATIVA") {
				if (param !== "TRANSPORTE") {
					if (oValue === "Aguardando aprovação" || oValue === "") {
						return false;
					} else {
						return true;
					}
				} else {
					return false;
				}
			} else {
				return false;
			}
		},

		formatVisibleEdit: function (oValue) {
			if (oValue === "Aguardando aprovação" || oValue === "X") {
				return false;
			} else {
				return true;
			}
		},

		formatVisibleEditOpcoes: function (oValue) {
			if (oValue === "Aguardando aprovação") {
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
			var Pernr = "0";
			var infty = "0168";
			var subty = "VIDA";
			//var Valor = this.getView().byId("IdOpcoes_SEGURO_VIDA").getSelectedKey();

			var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr);
			var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
			var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, subty);
			//var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "B");
			//var oFilterValor = new sap.ui.model.Filter("Valor", sap.ui.model.FilterOperator.EQ, Valor);
			var oList = this.getView().byId("UploadCollection");
			oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty]); //, oFilterTipo ]);//, oFilterValor]);
			oList.getBinding("items").refresh(true);
		},

		onchangeParentesco: function (oEvent) {
			var Plano = this.getView().byId("IdPlano_SEGURO_VIDA").getSelectedKey();
			var Opcoes = this.getView().byId("IdOpcoes_SEGURO_VIDA").getBinding("items");

			var oFilterOpcoes = new sap.ui.model.Filter("Bplan", sap.ui.model.FilterOperator.EQ, Plano);
			Opcoes.filter([oFilterOpcoes]);
		},

		onchangeOpcoes: function(oEvent) {
			if (param === "PLANO_ODONTOLOGICO") {
				var Plano = this.getView().byId("IdPlano_PLANO_ODONTOLOGICO").getSelectedKey();
				var Opcoes = this.getView().byId("IdOpcoes_PLANO_ODONTOLOGICO").getSelectedKey();

				const sPlan = this.getView().byId("idbPLAN").getValue();
				const sOpcoes = this.getView().byId("idbOPCOES").getValue();

				if (sPlan !== Plano || sOpcoes !== Opcoes) {
					this.getView().byId("CHECKBOX").setVisible(true);
					this.getView().byId("CheckBox").setSelected(false);
				} else {
					this.getView().byId("CHECKBOX").setVisible(false);
					this.getView().byId("CheckBox").setSelected(false);
				}
			}
		},

		FormatForm: function (oValue) {
			return false;
		},

		onBindingContextUpload: function (oEvent) {
			var teste = oEvent;
		},

		onchangeModCesta: function () {
			var IdMotivo_CESTA_BASICA = this.getView().byId("IdMotivo_CESTA_BASICA").getSelectedKey();
			if (IdMotivo_CESTA_BASICA === "1") {
				this.getView().byId("UPLOAD").setVisible(false);
			} else {
				this.getView().byId("UPLOAD").setVisible(true);
			}
		},

		OnDelete: function () {

			var oModel = this.getView().getModel();
			var oListBase = this.getView().byId("smartTable_PLANO_MEDICO").getTable();
			var items = oListBase._aSelectedPaths;
			var length = items.length;
			var menssagem = "Confirma a exclusão do dependente no plano?";
			var oEntry = {};
			var Concatenate = "E$";
			var Subty;
			var Objps;
			var Key;
			var Pernr = "0";
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
								sap.m.MessageBox.success("Solicitação de exclusão enviada com sucesso.", {
									actions: ["OK"],
									onClose: function (sAction) {
										that.getView().getModel().refresh(true);
										that.getView().byId("TextInclusao").setVisible(false);
										that.getView().byId("TextInclusao_CNUN_BRAD").setVisible(false);
										that.getView().byId("TextInclusao_SCMP").setVisible(false);
										that.getView().byId("TextInclusao_UNCU").setVisible(false);
										that.getView().byId("TextInclusao_UNJZ").setVisible(false);
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
			var Beneficio = oEvent.getParameter("arguments").Zparam;
			var Descricao = oEvent.getParameter("arguments").Zdesc;
			var Pernr = "0";
			var Bplan;
			var Opcoes;
			var Tipo;
			this.getView().byId("idTitleDependentes").setText(Descricao);

			param = Beneficio;

			Tipo = "V";

			switch (param) {
			case "AUXILIO_CRECHE":
				Tipo = "N";
				break;
			case "REEMBOLSO_ESTACIONAM":
				//	Tipo = "N";
				break;
			case "REEMBOLSO_EDUCACAO":
				Tipo = "N";
				break;
			case "PREVIDENCIA_PRIVADA":
				//Tipo = "N";
				break;
			case "REEMBOLSO_SUBSIDIO":
				Tipo = "N";
				break;
			case "FARMACIA":
				//	Tipo = "N";
				break;
			case "MATERIAL_ESCOLAR":
				Tipo = "N";
				break;
			}

			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("ZET_GLHR_DETAIL_BENEFICIOSSet", {
					Pernr: Pernr,
					Beneficio: Beneficio,
					Tipo: Tipo

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
			case "SEGURO_VIDA":
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
				infty = "XXXX";
				subty = "CREC";
				break;
			case "COOPERATIVA":
				infty = "XXXX";
				subty = "COOP";
				break;
			case "GREMIO_CLUBE":
				infty = "XXXX";
				subty = "GREM";
				break;
			case "EMP_CONSIGNADO":
				infty = "XXXX";
				subty = "EMCO";
				break;
			case "FARMACIA":
				infty = "XXXX";
				subty = "FARM";
				break;
			case "REEMBOLSO_SUBSIDIO":
				infty = "XXXX";
				subty = "SUBS";
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
			case "REEMBOLSO_ESTACIONAM":
				infty = "XXXX";
				subty = "REES";
				break;
			case "REEMBOLSO_EDUCACAO":
				infty = "XXXX";
				subty = "REED";
			case "MATERIAL_ESCOLAR":
				infty = "XXXX";
				subty = "MATE";
				break;
			case "REEMBOLSO_MEDICAM":
				infty = "XXXX";
				subty = "REME";
				break;
			case "REEMBOLSO_ALUGUEL":
				infty = "XXXX";
				subty = "REAL";
				break;
			case "REEMBOLSO_EXT_UNIV":
				infty = "XXXX";
				subty = "REUN";
				break;
			}
			// var Subty = subty;
			// if (Pernr !== "" || Subty !== "") {
			// 	var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr);
			// 	var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
			// 	var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, Subty);
			// 	if (this.getView().byId("idTipo").getValue() == "B") {
			// 		var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "B");
			// 	} else {
			// 		var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "B");
			// 	}

			// 	var oList = this.getView().byId("UploadCollection");
			// 	oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo]);
			// }
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

			this.getView().byId("IdCancelDetailDep").setVisible(false);
			bReplace = !Device.system.phone;
			Zdesc = "master";
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
						via2 = "";
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
				//that.getView().byId("TextExclusao").setVisible(false);
				that.getView().byId("TextInclusao_CNUN_BRAD").setVisible(false);
				that.getView().byId("TextInclusao_SCMP").setVisible(false);
				that.getView().byId("TextInclusao_UNCU").setVisible(false);
        		that.getView().byId("TextInclusao_UNJZ").setVisible(false);
				that.byId("FormContainer5_PLANO_MEDICO").setVisible(true);
				//that.getView().byId("TextExclusao_CNUN_BRAD").setVisible(false);
				break;
			case "PLANO_ODONTOLOGICO":
				that.getView().byId("TextInclusao_PLANO_ODONTOLOGICO_UNIMED").setVisible(false);
				that.getView().byId("TextInclusao_PLANO_ODONTOLOGICO_BRAD_MET").setVisible(false);
				that.getView().byId("TextInclusao_PLANO_ODONTOLOGICO_MET").setVisible(false);
				that.getView().byId("TextEditar_PLANO_ODONTOLOGICO").setVisible(false);
				that.getView().byId("TextInclusao").setVisible(false);
				that.getView().byId("CHECKBOX").setVisible(false);
				that.getView().byId("CheckBox").setSelected(false);
				//that.getView().byId("TextExclusao").setVisible(false);
				break;
			}

			that.getView().byId("UploadCollection").setUploadButtonInvisible(false);
			that.getView().byId("IdCancelDetailDep").setVisible(false);
			that.getView().byId("IdIncluir").setVisible(false);
			that.getView().byId("IdSalvarDetailDep").setVisible(false);
			that.getView().byId("UPLOAD").setVisible(false);

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

			if (oValue === "Aguardando aprovação") {
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

			if (Cancela === "C") {
				Tipo = Cancela;
			} else {
				Tipo = "G";
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

				oEntry.Aceite = ""
				if (this.getView().byId("CHECKBOX").getVisible()) {
					if (this.getView().byId("CheckBox").getSelected()) {
						oEntry.Aceite = "X";
					} else {
						sap.m.MessageBox.error("Aceite o termo");
						return;
					}
				}

				oEntry.CartDentista = this.getView().byId("IdCartDentista").getValue();
				oEntry.Valor = Cancela;

				if (via2 === "X") {
					oEntry.Via2Dent = via2;
				}

				break;
			case "SEGURO_VIDA":
				oEntry.Bplan = this.getView().byId("IdPlano_SEGURO_VIDA").getSelectedKey();

				if (oEntry.Bplan === "") {
					this.getView().byId("IdPlano_SEGURO_VIDA").setValueState("Error");
					sap.m.MessageBox.error("Informe o plano");
					return;
				} else {
					this.getView().byId("IdPlano_SEGURO_VIDA").setValueState("Success");
				}
				Beneficio = "SEGURO_VIDA";
				oEntry.Opcoes = this.getView().byId("IdOpcoes_SEGURO_VIDA").getSelectedKey();

				if (oEntry.Opcoes === "") {
					this.getView().byId("IdOpcoes_SEGURO_VIDA").setValueState("Error");
					sap.m.MessageBox.error("Selecione entre as opções");
					return;
				} else {
					this.getView().byId("IdOpcoes_SEGURO_VIDA").setValueState("Success");
				}

				Key = "/ZET_GLHR_DETAIL_BENEFICIOSSet(Pernr='" + Pernr + "',Beneficio='" + Beneficio + "',Tipo='" + Tipo + "')";
				break;
			case "TRANSPORTE":
				oEntry.Bplan = this.getView().byId("IdPlano_TRANSPORTE").getSelectedKey();

				if (oEntry.Bplan === "") {
					this.getView().byId("IdPlano_TRANSPORTE").setValueState("Error");
					sap.m.MessageBox.error("Informe o plano");
					return;
				} else {
					this.getView().byId("IdPlano_TRANSPORTE").setValueState("Success");
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
				oEntry.Valor = this.getView().byId("IdPlano_AUXILIO_CRECHE").getSelectedKey();
				if (oEntry.Valor === "") {
					this.getView().byId("IdPlano_AUXILIO_CRECHE").setValueState("Error");
					sap.m.MessageBox.error("Informe mês de referência.");
					return;
				} else {
					this.getView().byId("IdPlano_AUXILIO_CRECHE").setValueState("Success");
				}
				break;
			case "COOPERATIVA":
				oEntry.Valor = this.getView().byId("Cooperativa1").getValue();

				break;
			case "GREMIO_CLUBE":
				// oEntry.Bplan = this.getView().byId("IdPlano_GREMIO_CLUBE").getSelectedKey();

				// if (oEntry.Bplan === "") {
				// 	this.getView().byId("IdPlano_GREMIO_CLUBE").setValueState("Error");
				// 	sap.m.MessageBox.error("Informe a Rubrica");
				// 	return;
				// } else {
				// 	this.getView().byId("IdPlano_GREMIO_CLUBE").setValueState("Success");
				// }

				// oEntry.Adesao = this.getView().byId("IdAdesao").getState();
				// if (oEntry.Adesao === true) {
				oEntry.Adesao = "X";
				// } else {
				// 	oEntry.Adesao = "";
				// }
				// oEntry.Observacao = this.getView().byId("IdObservacao_GREMIO_CLUBE").getValue();
				break;
			case "EMP_CONSIGNADO":
				//oEntry.Rubrica = this.getView().byId("IdPlano_EMPRESTIMO_CONSIGINADO").getSelectedKey();

				// if (oEntry.Rubrica === "") {
				// 	this.getView().byId("IdPlano_EMPRESTIMO_CONSIGINADO").setValueState("Error");
				// 	sap.m.MessageBox.error("Informe a Rubrica");
				// 	return;
				// } else {
				// 	this.getView().byId("IdPlano_EMPRESTIMO_CONSIGINADO").setValueState("Success");
				// }

				//oEntry.Montante = this.getView().byId("IdMontante_EMPRESTIMO_CONSIGINADO").getValue();
				//oEntry.Validade = this.getView().byId("IdValidade_EMPRESTIMO_CONSIGINADO").getValue();
				//oEntry.Observacao = this.getView().byId("IdObservacao_EMPRESTIMO_CONSIGINADO").getValue();
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
				if (oEntry.Opcoes === "") {
					this.getView().byId("IdMotivo_FARMACIA").setValueState("Error");
					sap.m.MessageBox.error("Informe o Motivo");
					return;
				} else {
					this.getView().byId("IdMotivo_FARMACIA").setValueState("Success");
				}

				break;
			case "REEMBOLSO_SUBSIDIO":
				var mes = this.getView().byId("IdPlano_REEMBOLSO_SUBSIDIO").getSelectedKey();
				var ano = this.getView().byId("IdAno_REEMBOLSO_SUBSIDIO").getSelectedKey();

				if (mes === "") {
					this.getView().byId("IdPlano_REEMBOLSO_SUBSIDIO").setValueState("Error");
					sap.m.MessageBox.error("Informe o mês");
					return;
				} else {
					this.getView().byId("IdPlano_REEMBOLSO_SUBSIDIO").setValueState("Success");
				}

				if (ano === "") {
					this.getView().byId("IdAno_REEMBOLSO_SUBSIDIO").setValueState("Error");
					sap.m.MessageBox.error("Informe o ano");
					return;
				} else {
					this.getView().byId("IdAno_REEMBOLSO_SUBSIDIO").setValueState("Success");
				}

				oEntry.Valor = mes + "_" + ano;

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

				oEntry.Valor = this.getView().byId("IdValor_PREVIDENCIA_PRIVADA").getValue();
				if (!oEntry.Valor) {
					oEntry.Valor = this.getView().byId("IdValor1_PREVIDENCIA_PRIVADA").getValue();
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
				var mes = this.getView().byId("IdPlano_REEMBOLSO_ESTACIONAM").getSelectedKey();
				var ano = this.getView().byId("IdAno_REEMBOLSO_ESTACIONAM").getSelectedKey();

				if (mes === "") {
					this.getView().byId("IdPlano_REEMBOLSO_ESTACIONAM").setValueState("Error");
					sap.m.MessageBox.error("Informe mês de referência.");
					return;
				} else {
					this.getView().byId("IdPlano_REEMBOLSO_ESTACIONAM").setValueState("Success");
				}

				if (ano === "") {
					this.getView().byId("IdAno_REEMBOLSO_ESTACIONAM").setValueState("Error");
					sap.m.MessageBox.error("Informe ano de referência.");
					return;
				} else {
					this.getView().byId("IdAno_REEMBOLSO_ESTACIONAM").setValueState("Success");
				}

				oEntry.Valor = mes + "_" + ano;

				break;
			case "REEMBOLSO_EXT_UNIV":
				var mes = this.getView().byId("IdPlano_REEMBOLSO_EXT_UNIV").getSelectedKey();
				var ano = this.getView().byId("IdAno_REEMBOLSO_EXT_UNIV").getSelectedKey();

				if (mes === "") {
					this.getView().byId("IdPlano_REEMBOLSO_EXT_UNIV").setValueState("Error");
					sap.m.MessageBox.error("Informe mês de referência.");
					return;
				} else {
					this.getView().byId("IdPlano_REEMBOLSO_EXT_UNIV").setValueState("Success");
				}

				if (ano === "") {
					this.getView().byId("IdAno_REEMBOLSO_EXT_UNIV").setValueState("Error");
					sap.m.MessageBox.error("Informe ano de referência.");
					return;
				} else {
					this.getView().byId("IdAno_REEMBOLSO_EXT_UNIV").setValueState("Success");
				}

				oEntry.Valor = mes + "_" + ano;

				break;
			case "REEMBOLSO_ALUGUEL":
				var mes = this.getView().byId("IdPlano_REEMBOLSO_ALUGUEL").getSelectedKey();
				var ano = this.getView().byId("IdAno_REEMBOLSO_ALUGUEL").getSelectedKey();

				if (mes === "") {
					this.getView().byId("IdPlano_REEMBOLSO_ALUGUEL").setValueState("Error");
					sap.m.MessageBox.error("Informe mês de referência.");
					return;
				} else {
					this.getView().byId("IdPlano_REEMBOLSO_ALUGUEL").setValueState("Success");
				}

				if (ano === "") {
					this.getView().byId("IdAno_REEMBOLSO_ALUGUELM").setValueState("Error");
					sap.m.MessageBox.error("Informe ano de referência.");
					return;
				} else {
					this.getView().byId("IdAno_REEMBOLSO_ALUGUEL").setValueState("Success");
				}

				oEntry.Valor = mes + "_" + ano;

				break;
			case "REEMBOLSO_MEDICAM":
				var mes = this.getView().byId("IdPlano_REEMBOLSO_MEDICAM").getSelectedKey();
				var ano = this.getView().byId("IdAno_REEMBOLSO_MEDICAM").getSelectedKey();

				if (mes === "") {
					this.getView().byId("IdPlano_REEMBOLSO_MEDICAM").setValueState("Error");
					sap.m.MessageBox.error("Informe mês de referência.");
					return;
				} else {
					this.getView().byId("IdPlano_REEMBOLSO_MEDICAM").setValueState("Success");
				}

				if (ano === "") {
					this.getView().byId("IdAno_REEMBOLSO_MEDICAM").setValueState("Error");
					sap.m.MessageBox.error("Informe ano de referência.");
					return;
				} else {
					this.getView().byId("IdAno_REEMBOLSO_MEDICAM").setValueState("Success");
				}

				oEntry.Valor = mes + "_" + ano;

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
			case "REEMBOLSO_IDIOMA":
				var mes = this.getView().byId("IdPlano_REEMBOLSO_IDIOMA").getSelectedKey();
				var ano = this.getView().byId("IdAno_REEMBOLSO_IDIOMA").getSelectedKey();
				
				if (mes === "") {
					this.getView().byId("IdPlano_REEMBOLSO_IDIOMA").setValueState("Error");
					sap.m.MessageBox.error("Informe mês de referência.");
					return;
				} else {
					this.getView().byId("IdPlano_REEMBOLSO_IDIOMA").setValueState("Success");
				}
				
				if (ano === "") {
					this.getView().byId("IdAno_REEMBOLSO_IDIOMA").setValueState("Error");
					sap.m.MessageBox.error("Informe o ano de referência.");
					return;
				} else {
					this.getView().byId("IdAno_REEMBOLSO_IDIOMA").setValueState("Success");
				}
				
				oEntry.Valor = mes + "_" + ano;
				break;
			case "MATERIAL_ESCOLAR":
				oEntry.Valor = this.getView().byId("IdPlano_MATERIAL_ESCOLAR").getSelectedKey();
				if (oEntry.Valor === "") {
					this.getView().byId("IdPlano_MATERIAL_ESCOLAR").setValueState("Error");
					sap.m.MessageBox.error("Informe mês de referência.");
					return;
				} else {
					this.getView().byId("IdPlano_MATERIAL_ESCOLAR").setValueState("Success");
				}
				break;
			}

			oEntry.Tipo = oEntry.Operation;
			oEntry.Beneficio = Beneficio;

			if (oEntry.Montante !== "" && oEntry.Montante !== undefined) {

				while (oEntry.Montante.indexOf(".") !== -1) {
					oEntry.Montante = oEntry.Montante.replace(".", "");
				}

				oEntry.Montante = oEntry.Montante.replace(",", ".");
			}

			if (validaoutros === 1) {
				var that = this;
				var dialog = "";
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
			var menssagem2 = "";

			if (via2 === "X") {
				menssagemsave = "Confirma solicitação de segunda via?";
				menssagem2 = "Solicitação de segunda via efetuado."
			} else {
				menssagemsave = "Confirma a solicitação do beneficio?";
				menssagem2 = "Solicitação de beneficio efetuada com sucesso."
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
								sap.m.MessageBox.success(menssagem2, {
									actions: ["OK"],
									onClose: function (sAction) {
										that.getView().getModel().refresh(true);
										that.getView().byId("IdCancelDetailDep").setVisible(false);

										if (param === "PLANO_ODONTOLOGICO") {
											that.getView().byId("CHECKBOX").setVisible(false);
											that.getView().byId("CheckBox").setSelected(false);
										}
									}
								});
							},
							error: function (oError) {
								var erro = oError;
								erro = erro.responseText;
								var erro2 = JSON.parse(erro);
								var messagem = erro2.error.message.value;
								var codigo = erro2.error.code;
								if (codigo === "Fiori - W/001") {
									sap.m.MessageBox.warning(messagem, {
										actions: ["OK"],
										onClose: function (sAction) {
											that.getView().getModel().refresh(true);
											that.getView().byId("IdCancelDetailDep").setVisible(false);

											if (param === "PLANO_ODONTOLOGICO") {
												that.getView().byId("CHECKBOX").setVisible(false);
												that.getView().byId("CheckBox").setSelected(false);
											}
										}
									});
								} else {
									sap.m.MessageBox.error(messagem, {
										actions: ["OK"],
										onClose: function (sAction) {}
									});
									return;
								}
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
				oListBase = this.getView().byId("smartTable_PLANO_MEDICO").getTable();
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

				oEntry.Aceite = ""
				if (this.getView().byId("CHECKBOX").getVisible()) {
					if (this.getView().byId("CheckBox").getSelected()) {
						oEntry.Aceite = "X";
					} else {
						sap.m.MessageBox.error("Aceite o termo");
						return;
					}
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
			var menssagem2;
			var selecionados = this.getSelectedDependentes(param);
			var dialog;

			if (operacao === "I") {
				menssagem = "Confirma a inclusão do dependente no plano?";
				menssagem2 = "Solicitação de inclusão efetuada com sucesso"
				Concatenate = "I@";
			} else if (operacao === "C") {
				menssagem = "Confirma a solicitação da segunda via?";
				menssagem2 = "Solicitação de segunda efetuada com sucesso"
				Concatenate = "C@";
			} else if (via2 === "X") {
				Concatenate = "2@";
			} else {
				menssagem = "Confirma a exclusão do dependente do plano?";
				menssagem2 = "Solicitação de exclusão efetuada com sucesso"
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
							for (var i = 0; i < selecionados.length; i++) {
								Subty = selecionados[i].Subty;
								Objps = selecionados[i].Objps;
		
								if (Number.parseInt(selecionados[i].Subty, 10) < 10) {
									Subty = `0${Subty}`;
								};
		
								if (Objps === "") {
									Objps = "00";
								};
		
								const sSeparator = i < selecionados.length - 1 ? "@" : "";
								Concatenate = Concatenate + Subty + "-" + Objps + sSeparator;
							}

							Key = "/ZET_GLHR_DETAIL_BENEFICIOSSet(Pernr='" + Pernr + "',Beneficio='" + Beneficio + "',Tipo='G')";
							oEntry.Dependentes = Concatenate;

							oModel.update(Key, oEntry, {
								success: function (oData, oResponse) {
									sap.m.MessageBox.success("Solicitação de segunda via efetuado com sucesso.", {
										actions: ["OK"],
										onClose: function (sAction) {
											that.getView().getModel().refresh(true);

											switch (param) {
											case "PLANO_MEDICO":
												that.getView().byId("TextInclusao").setVisible(false);
												//that.getView().byId("TextExclusao").setVisible(false);
												break;
											case "PLANO_ODONTOLOGICO":
												that.getView().byId("TextInclusao").setVisible(false);
												that.getView().byId("CHECKBOX").setVisible(false);
												that.getView().byId("CheckBox").setSelected(false);
												//that.getView().byId("TextExclusao").setVisible(false);
												break;
											}

											that.getView().byId("UploadCollection").setUploadButtonInvisible(false);
											that.getView().byId("IdCancelDetailDep").setVisible(false);
											that.getView().byId("IdIncluir").setVisible(false);
											that.getView().byId("IdSalvarDetailDep").setVisible(false);
											that.getView().byId("UPLOAD").setVisible(false);
										}
									});
								},
								error: function (oError) {
									var erro = oError;
									erro = erro.responseText;
									var erro2 = JSON.parse(erro);
									var messagem = erro2.error.message.value;
									var codigo = erro2.error.code;
									if (codigo === "Fiori - W/001") {
										sap.m.MessageBox.warning(messagem, {
											actions: ["OK"],
											onClose: function (sAction) {
												//that.getView().getModel().refresh(true);
												//that.getView().byId("IdCancelDetailDep").setVisible(false);
											}
										});
									} else {
										sap.m.MessageBox.error(messagem, {
											actions: ["OK"],
											onClose: function (sAction) {
												//that.getView().getModel().refresh(true);

												switch (param) {
												case "PLANO_MEDICO":
													that.getView().byId("TextInclusao").setVisible(false);
													//that.getView().byId("TextExclusao").setVisible(false);
													break;
												case "PLANO_ODONTOLOGICO":
													that.getView().byId("TextInclusao").setVisible(false);
													that.getView().byId("CHECKBOX").setVisible(false);
													that.getView().byId("CheckBox").setSelected(false);
													//that.getView().byId("TextExclusao").setVisible(false);
													break;
												}

												//that.getView().byId("UploadCollection").setUploadButtonInvisible(false);
												//that.getView().byId("IdCancelDetailDep").setVisible(false);
												//that.getView().byId("IdIncluir").setVisible(false);
												//that.getView().byId("IdSalvarDetailDep").setVisible(false);
												//that.getView().byId("UPLOAD").setVisible(false);
											}
										});
										return;
									}
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
							for (var i = 0; i < selecionados.length; i++) {
								let Subty = selecionados[i].Subty;
								let Objps = selecionados[i].Objps;
		
								if (Number.parseInt(selecionados[i].Subty, 10) < 10) {
									Subty = `0${Subty}`;
								};
		
								if (Objps === "") {
									Objps = "00";
								};
		
								const sSeparator = i < selecionados.length - 1 ? "@" : "";
								Concatenate = Concatenate + Subty + "-" + Objps + sSeparator;
							}

							Key = "/ZET_GLHR_DETAIL_BENEFICIOSSet(Pernr='" + Pernr + "',Beneficio='" + Beneficio + "',Tipo='G')";
							oEntry.Dependentes = Concatenate;

							oModel.update(Key, oEntry, {
								success: function (oData, oResponse) {
									sap.m.MessageBox.success(menssagem2, {
										actions: ["OK"],
										onClose: function (sAction) {
											that.getView().getModel().refresh(true);

											switch (param) {
											case "PLANO_MEDICO":
												that.getView().byId("TextInclusao").setVisible(false);
												//that.getView().byId("TextExclusao").setVisible(false);
												that.getView().byId("TextInclusao_CNUN_BRAD").setVisible(false);
												that.getView().byId("TextInclusao_SCMP").setVisible(false);
												that.getView().byId("TextInclusao_UNCU").setVisible(false);
                        						that.getView().byId("TextInclusao_UNJZ").setVisible(false);
												//that.getView().byId("TextExclusao_CNUN_BRAD").setVisible(false);
												break;
											case "PLANO_ODONTOLOGICO":
												that.getView().byId("TextInclusao").setVisible(false);
												that.getView().byId("CHECKBOX").setVisible(false);
												that.getView().byId("CheckBox").setSelected(false);
												//that.getView().byId("TextExclusao").setVisible(false);
												break;
											}

											that.getView().byId("UploadCollection").setUploadButtonInvisible(false);
											that.getView().byId("IdCancelDetailDep").setVisible(false);
											that.getView().byId("IdIncluir").setVisible(false);
											that.getView().byId("IdSalvarDetailDep").setVisible(false);
											that.getView().byId("UPLOAD").setVisible(false);
										}
									});
								},
								error: function (oError) {
									var erro = oError;
									erro = erro.responseText;
									var erro2 = JSON.parse(erro);
									var messagem = erro2.error.message.value;
									var codigo = erro2.error.code;
									if (codigo === "Fiori - W/001") {
										sap.m.MessageBox.warning(messagem, {
											actions: ["OK"],
											onClose: function (sAction) {
												that.getView().getModel().refresh(true);
												that.getView().byId("IdCancelDetailDep").setVisible(false);

												if (param === "PLANO_ODONTOLOGICO") {
													that.getView().byId("CHECKBOX").setVisible(false);
													that.getView().byId("CheckBox").setSelected(false);
												}
											}
										});
									} else {
										sap.m.MessageBox.error(messagem, {
											actions: ["OK"],
											onClose: function (sAction) {
												that.getView().getModel().refresh(true);

												switch (param) {
												case "PLANO_MEDICO":
													that.getView().byId("TextInclusao").setVisible(false);
													//that.getView().byId("TextExclusao").setVisible(false);
													that.getView().byId("TextInclusao_CNUN_BRAD").setVisible(false);
													that.getView().byId("TextInclusao_SCMP").setVisible(false);
													that.getView().byId("TextInclusao_UNCU").setVisible(false);
                          							that.getView().byId("TextInclusao_UNJZ").setVisible(false);
													//that.getView().byId("TextExclusao_CNUN_BRAD").setVisible(false);
													break;
												case "PLANO_ODONTOLOGICO":
													that.getView().byId("TextInclusao").setVisible(false);
													that.getView().byId("CHECKBOX").setVisible(false);
													that.getView().byId("CheckBox").setSelected(false);
													//that.getView().byId("TextExclusao").setVisible(false);
													break;
												}

												that.getView().byId("UploadCollection").setUploadButtonInvisible(false);
												that.getView().byId("IdCancelDetailDep").setVisible(false);
												that.getView().byId("IdIncluir").setVisible(false);
												that.getView().byId("IdSalvarDetailDep").setVisible(false);
												that.getView().byId("UPLOAD").setVisible(false);
											}
										});
										return;
									}
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

		onAcaoO: function (oEvent) {
			var idTipo = this.getView().byId("idTipo").getValue();
			if (idTipo === "Aguardando aprovação") {
				sap.m.MessageBox.alert("Não é possível executar está ação, enquanto exister uma solicitação em aprovação.");
				return;
			}
			this.getView().byId("IdCancelBeneficio").setVisible(false);
			dep = "X";

			var id = oEvent.getSource().getId();
			var icon = oEvent.getSource().getIcon();
			this.getView().byId(id).setPressed(true);
			this.getView().byId("UploadCollection").setUploadButtonInvisible(false);

			if (icon === "sap-icon://add") {
				this.onIncluinoPlanoO(oEvent);
			} else if (icon === "sap-icon://delete") {
				this.onExluiPlanoO(oEvent);
			}
		},

		onAcaoM: function (oEvent) {
			var idTipo = this.getView().byId("idTipo").getValue();
			if (idTipo === "Aguardando aprovação") {
				sap.m.MessageBox.alert("Não é possível executar está ação, enquanto exister uma solicitação em aprovação.");
				return;
			}
			this.getView().byId("IdCancelBeneficio").setVisible(false);
			dep = "X";
			var id = oEvent.getSource().getId();
			var icon = oEvent.getSource().getIcon();
			this.getView().byId(id).setPressed(true);
			this.getView().byId("UploadCollection").setUploadButtonInvisible(false);

			if (icon === "sap-icon://add") {
				this.onIncluinoPlanoM(oEvent);
			} else if (icon === "sap-icon://delete") {
				this.onExluiPlanoM(oEvent);
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

		AfterUpdate_TRANSPORTE: function (oEvent) {
			var count = this.getView().byId("table1_VALE_TRANSPORT").getBinding("rows").getLength();
			if (count > 0) {
				this.getView().byId("table1_VALE_TRANSPORT").setVisibleRowCount(count);
			} else {
				this.getView().byId("FormContainer7_TRANSPORTE").setVisible(false);
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

			Cancela = "";

			//this.getView().byId("idEditar").setPressed(false);
			//this.getView().byId("idExcluir").setPressed(false);
			//this.getView().byId("idEditar_PLANO_ODONTOLOGICO").setPressed(false);
			//this.getView().byId("idExcluir_PLANO_ODONTOLOGICO").setPressed(false);

			this.getView().byId(param).setVisible(true);

			// var IdMargemEmp = this.getView().byId("IdMargemEmp").getValue();

			// if (IdMargemEmp !== "") {
			// 	IdMargemEmp = parseFloat(IdMargemEmp).toFixed(2);

			// 	while (IdMargemEmp.indexOf(".") !== -1) {
			// 		IdMargemEmp = IdMargemEmp.replace(".", ",");
			// 	}
			// 	IdMargemEmp = this.adicionarpontoFloat(IdMargemEmp);
			// 	this.getView().byId("IdMargemEmp").setValue(IdMargemEmp);
			// }

			var smartTable;
			var Plano;
			var Opcoes;
			var oFilterOpcoes;
			var Opcoes2;

			var idTipo = this.getView().byId("idTipo").getValue();

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
			case "SEGURO_VIDA":
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
				infty = "XXXX";
				subty = "CREC";
				break;
			case "COOPERATIVA":
				infty = "XXXX";
				subty = "COOP";
				break;
			case "GREMIO_CLUBE":
				infty = "XXXX";
				subty = "GREM";
				break;
			case "EMP_CONSIGNADO":
				infty = "XXXX";
				subty = "EMCO";
				break;
			case "FARMACIA":
				infty = "XXXX";
				subty = "FARM";
				break;
			case "REEMBOLSO_SUBSIDIO":
				infty = "XXXX";
				subty = "SUBS";
				break;
			case "REEMBOLSO_IDIOMA":
				infty = "XXXX";
				subty = "REID";
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
			case "REEMBOLSO_ESTACIONAM":
				infty = "XXXX";
				subty = "REES";
				break;
			case "REEMBOLSO_EDUCACAO":
				infty = "XXXX";
				subty = "REED";
			case "MATERIAL_ESCOLAR":
				infty = "XXXX";
				subty = "MATE";
				break;
			case "REEMBOLSO_MEDICAM":
				infty = "XXXX";
				subty = "REME";
				break;
			case "REEMBOLSO_ALUGUEL":
				infty = "XXXX";
				subty = "REAL";
				break;
			case "REEMBOLSO_EXT_UNIV":
				infty = "XXXX";
				subty = "REUN";
				break;
			}

			switch (param) {
			case "FUNSEJEM":
				break;
			case "PLANO_MEDICO":
				Plano = this.getView().byId("IdPlano_PLANO_MEDICO").getSelectedKey();
				Opcoes = this.getView().byId("IdOpcoes_PLANO_MEDICO").getBinding("items");
				smartTable = this.getView().byId("smartTable_PLANO_MEDICO");
				smartTable.rebindTable("e");
				this.getView().byId("IdIncluir").setVisible(true);
				oFilterOpcoes = new sap.ui.model.Filter("Bplan", sap.ui.model.FilterOperator.EQ, Plano);
				Opcoes.filter([oFilterOpcoes]);

				if (idTipo === "Aguardando aprovação") {
					this.getView().byId("IdSegundaVia").setVisible(false);
					this.getView().byId("IdEditDetailDep").setVisible(false);
				} else {
					this.getView().byId("IdSegundaVia").setVisible(true);
					this.getView().byId("IdEditDetailDep").setVisible(true);
				}

				this.getView().byId("IdEditDetailDep").setText("Editar");
				this.getView().byId("IdCancelDetailDep").setVisible(false);
				this.getView().byId("CHECKBOX").setVisible(false);
				this.getView().byId("CheckBox").setSelected(false);

				oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, "0");
				oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, "MEDI");
				oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, Plano);
				if (idTipo === "Aguardando aprovação") {
					break;
				} else {
					oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "B");
				}

				oList = this.getView().byId("UploadCollection");
				oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo]);
				return;

			case "PLANO_ODONTOLOGICO":
				Plano = this.getView().byId("IdPlano_PLANO_ODONTOLOGICO").getSelectedKey();
				Opcoes = this.getView().byId("IdOpcoes_PLANO_ODONTOLOGICO").getBinding("items");

				smartTable = this.getView().byId("smartTable_PLANO_ODONTOLOGICO");
				smartTable.rebindTable("e");

				this.getView().byId("IdIncluir").setVisible(false);

				oFilterOpcoes = new sap.ui.model.Filter("Bplan", sap.ui.model.FilterOperator.EQ, Plano);
				Opcoes.filter([oFilterOpcoes]);

				if (idTipo === "Aguardando aprovação") {
					this.getView().byId("IdSegundaVia").setVisible(false);
					this.getView().byId("IdCancelBeneficio").setVisible(false);
				} else {
					this.getView().byId("IdSegundaVia").setVisible(true);
					this.getView().byId("IdCancelBeneficio").setVisible(true);
				}

				this.getView().byId("IdEditDetailDep").setText("Solicitar");
				this.getView().byId("IdCancelDetailDep").setVisible(false);
				this.getView().byId("CHECKBOX").setVisible(false);
				this.getView().byId("CheckBox").setSelected(false);

				Cancela = " ";

				oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, "0");
				oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, "DENT");
				oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, Plano);
				if (idTipo === "Aguardando aprovação") {
					break;
				} else {
					oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "B");
				}

				oList = this.getView().byId("UploadCollection");
				oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo]);
				return;

				break;
			case "PLANO_DENT_2":
				this.getView().byId("IdSegundaVia").setVisible(false);
				this.getView().byId("CHECKBOX").setVisible(false);
				this.getView().byId("CheckBox").setSelected(false);
				break;
			case "SEGURO_VIDA":
				this.getView().byId("IdIncluir").setVisible(false);

				Plano = this.getView().byId("IdPlano_SEGURO_VIDA").getSelectedKey();
				Opcoes = this.getView().byId("IdOpcoes_SEGURO_VIDA").getBinding("items");
				oFilterOpcoes = new sap.ui.model.Filter("Bplan", sap.ui.model.FilterOperator.EQ, Plano);
				Opcoes.filter([oFilterOpcoes]);
				this.getView().byId("IdSegundaVia").setVisible(false);

				this.getView().byId("IdEditDetailDep").setText("Solicitar");
				var opt = this.getView().byId("IdOpcoes_SEGURO_VIDA").getSelectedKey();
				this.getView().byId("IdPlano_SEGURO_VIDA").setEditable(false);
				this.getView().byId("IdIncluir").setVisible(false);
				this.getView().byId("IdSalvarDetailDep").setVisible(false);
				this.getView().byId("IdSalvarDetail").setVisible(false);
				this.getView().byId("IdCancelDetailDep").setVisible(false);
				this.getView().byId("IdSegundaVia").setVisible(false);
				this.getView().byId("CHECKBOX").setVisible(false);
				this.getView().byId("CheckBox").setSelected(false);
				this.getView().byId("IdEditDetailDep").setText("Solicitar");

				var oFilterValor = new sap.ui.model.Filter("Valor", sap.ui.model.FilterOperator.EQ, opt);
				var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, "0");
				var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
				var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, subty);
				if (idTipo === "Aguardando aprovação") {
					var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "C");
				} else {
					oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "B");
				}

				if (idTipo === "Aguardando aprovação") {
					this.getView().byId("IdEditDetailDep").setVisible(false);

				} else {
					this.getView().byId("IdEditDetailDep").setVisible(true);
				}

				var oList = this.getView().byId("UploadCollection");
				oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo, oFilterValor]);
				return;

			case "TRANSPORTE":
				Plano = this.getView().byId("IdPlano_TRANSPORTE").getSelectedKey();
				this.getView().byId("IdSegundaVia").setVisible(false);
				this.getView().byId("IdIncluir").setVisible(false);
				this.getView().byId("UPLOAD").setVisible(false);
				this.getView().byId("CHECKBOX").setVisible(false);
				this.getView().byId("CheckBox").setSelected(false);
				this.getView().byId("IdEditDetailDep").setText("Solicitar");
				break;
			case "VALE_REFEICAO":
				this.getView().byId("IdSegundaVia").setVisible(false);
				this.getView().byId("CHECKBOX").setVisible(false);
				this.getView().byId("CheckBox").setSelected(false);
				break;
			case "AUXILIO_CRECHE":
				this.getView().byId("IdIncluir").setVisible(false);
				this.getView().byId("IdSalvarDetailDep").setVisible(false);
				this.getView().byId("IdSalvarDetail").setVisible(false);
				this.getView().byId("IdCancelDetailDep").setVisible(false);
				this.getView().byId("IdSegundaVia").setVisible(false);
				this.getView().byId("CHECKBOX").setVisible(false);
				this.getView().byId("CheckBox").setSelected(false);

				this.getView().byId("IdEditDetailDep").setText("Solicitar");
				break;
			case "COOPERATIVA":
				this.getView().byId("IdSegundaVia").setVisible(false);
				this.getView().byId("CHECKBOX").setVisible(false);
				this.getView().byId("CheckBox").setSelected(false);
				break;
			case "GREMIO_CLUBE":
				this.getView().byId("IdSegundaVia").setVisible(false);
				this.getView().byId("CHECKBOX").setVisible(false);
				this.getView().byId("CheckBox").setSelected(false);
				break;
			case "EMP_CONSIGNADO":
				this.getView().byId("IdSegundaVia").setVisible(false);
				this.getView().byId("IdSalvarDetailDep").setVisible(false);
				this.getView().byId("IdSalvarDetail").setVisible(false);
				this.getView().byId("IdSalvarDetail2via").setVisible(false);
				this.getView().byId("CHECKBOX").setVisible(false);
				this.getView().byId("CheckBox").setSelected(false);
				break;
			case "FARMACIA":
				this.getView().byId("IdIncluir").setVisible(false);
				this.getView().byId("IdSalvarDetailDep").setVisible(false);
				this.getView().byId("IdSalvarDetail").setVisible(false);
				Plano = this.getView().byId("IdPlano_FARMACIA").getSelectedKey();
				Opcoes = this.getView().byId("IdMotivo_FARMACIA").getBinding("items");
				oFilterOpcoes = new sap.ui.model.Filter("IBplan", sap.ui.model.FilterOperator.EQ, Plano);
				Opcoes.filter([oFilterOpcoes]);
				this.getView().byId("IdSegundaVia").setVisible(false);
				this.getView().byId("IdEditDetailDep").setText("Solicitar");
				this.getView().byId("UPLOAD").setVisible(true);
				this.getView().byId("CHECKBOX").setVisible(false);
				this.getView().byId("CheckBox").setSelected(false);
				break;
			case "REEMBOLSO_SUBSIDIO":
				this.getView().byId("IdSegundaVia").setVisible(false);
				this.getView().byId("CHECKBOX").setVisible(false);
				this.getView().byId("CheckBox").setSelected(false);

				var valor_mes = this.getView().byId("IdPlano_REEMBOLSO_SUBSIDIO").getValue();

				this.getView().byId("IdPlano_REEMBOLSO_SUBSIDIO").setValue("");

				var array = valor_mes.split('/', 2);
				var ano = array[1];
				var mes = array[0];

				this.getView().byId("IdPlano_REEMBOLSO_SUBSIDIO").setSelectedKey(mes);
				this.getView().byId("IdAno_REEMBOLSO_SUBSIDIO").setSelectedKey(ano);
				this.getView().byId("IdEditDetailDep").setText("Solicitar");
				break;
			case "ALIMENTACAO":
				this.getView().byId("IdSegundaVia").setVisible(false);
				this.getView().byId("CHECKBOX").setVisible(false);
				this.getView().byId("CheckBox").setSelected(false);
				break;
			case "OTICA":
				this.getView().byId("IdSegundaVia").setVisible(false);
				this.getView().byId("CHECKBOX").setVisible(false);
				this.getView().byId("CheckBox").setSelected(false);
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

				this.getView().byId("IdSegundaVia").setVisible(false);
				this.getView().byId("CHECKBOX").setVisible(false);
				this.getView().byId("CheckBox").setSelected(false);

				this.getView().byId("IdEditDetailDep").setText("Alterar");

				break;
			case "PREVIDENCIA_PRIVADA":
				this.getView().byId("IdIncluir").setVisible(false);
				this.getView().byId("idTelefone").setEditable(false);
				Plano = this.getView().byId("IdPlano_PREVIDENCIA_PRIVADA").getSelectedKey();

				Opcoes2 = this.getView().byId("IdMotivo_PREVIDENCIA_PRIVADA").getBinding("items");
				oFilterOpcoes = new sap.ui.model.Filter("IBplan", sap.ui.model.FilterOperator.EQ, Plano);
				Opcoes2.filter([oFilterOpcoes]);

				this.getView().byId("IdSegundaVia").setVisible(false);
				this.getView().byId("CHECKBOX").setVisible(false);
				this.getView().byId("CheckBox").setSelected(false);
				this.getView().byId("IdEditDetailDep").setText("Solicitar");

				var valor1 = this.getView().byId("IdMotivo_PREVIDENCIA_PRIVADA").getSelectedKey();

				var oFilterValor = new sap.ui.model.Filter("Valor", sap.ui.model.FilterOperator.EQ, valor1);
				var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, "0");

				if (idTipo === "Aguardando aprovação") {
					var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "C");
					var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
					var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, subty);
				} else {
					oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "B");
					var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, "PREV");
					var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, Plano);

				}

				var oList = this.getView().byId("UploadCollection");
				oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo, oFilterValor]);
				return;

			case "PREV_PRIV_BAS":
				this.getView().byId("IdSegundaVia").setVisible(false);
				this.getView().byId("CHECKBOX").setVisible(false);
				this.getView().byId("CheckBox").setSelected(false);
				break;
			case "PREV_PRIV_ESP":
				this.getView().byId("IdSegundaVia").setVisible(false);
				this.getView().byId("CHECKBOX").setVisible(false);
				this.getView().byId("CheckBox").setSelected(false);
				break;
			case "PREV_PRIV_NOR":
				this.getView().byId("IdSegundaVia").setVisible(false);
				this.getView().byId("CHECKBOX").setVisible(false);
				this.getView().byId("CheckBox").setSelected(false);
				break;
			case "PREV_PRIV_SUP":
				this.getView().byId("IdSegundaVia").setVisible(false);
				this.getView().byId("CHECKBOX").setVisible(false);
				this.getView().byId("CheckBox").setSelected(false);
				break;
			case "REEMBOLSO_ESTACIONAM":
				var valor1 = this.getView().byId("alug1").getValue();
				var valor = valor1;
				valor = valor.split("_");
				var mes1 = valor[0];
				var ano1 = valor[1];

				this.getView().byId("IdPlano_REEMBOLSO_ESTACIONAM").setSelectedKey(mes1);
				this.getView().byId("IdAno_REEMBOLSO_ESTACIONAM").setSelectedKey(ano1);

				this.getView().byId("IdIncluir").setVisible(false);
				this.getView().byId("IdSalvarDetailDep").setVisible(false);
				this.getView().byId("IdSalvarDetail").setVisible(false);
				this.getView().byId("IdCancelDetailDep").setVisible(false);
				this.getView().byId("IdSegundaVia").setVisible(false);
				this.getView().byId("CHECKBOX").setVisible(false);
				this.getView().byId("CheckBox").setSelected(false);
				this.getView().byId("IdEditDetailDep").setText("Solicitar");

				var oFilterValor = new sap.ui.model.Filter("Valor", sap.ui.model.FilterOperator.EQ, valor1);
				var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, "0");
				var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
				var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, subty);
				if (idTipo === "Aguardando aprovação") {
					var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "C");
				} else {
					oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "B");
				}

				var oList = this.getView().byId("UploadCollection");
				oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo, oFilterValor]);
				return;

			case "REEMBOLSO_ALUGUEL":
				var valor1 = this.getView().byId("alug1").getValue();
				var valor = valor1;
				valor = valor.split("_");
				var mes1 = valor[0];
				var ano1 = valor[1];

				this.getView().byId("IdPlano_REEMBOLSO_ALUGUEL").setSelectedKey(mes1);
				this.getView().byId("IdAno_REEMBOLSO_ALUGUEL").setSelectedKey(ano1);

				this.getView().byId("IdIncluir").setVisible(false);
				this.getView().byId("IdSalvarDetailDep").setVisible(false);
				this.getView().byId("IdSalvarDetail").setVisible(false);
				this.getView().byId("IdCancelDetailDep").setVisible(false);
				this.getView().byId("IdSegundaVia").setVisible(false);
				this.getView().byId("CHECKBOX").setVisible(false);
				this.getView().byId("CheckBox").setSelected(false);
				this.getView().byId("IdEditDetailDep").setText("Solicitar");

				var oFilterValor = new sap.ui.model.Filter("Valor", sap.ui.model.FilterOperator.EQ, valor1);
				var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, "0");
				var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
				var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, subty);
				if (idTipo === "Aguardando aprovação") {
					var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "C");
				} else {
					oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "B");
				}

				var oList = this.getView().byId("UploadCollection");
				oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo, oFilterValor]);
				return;

			case "REEMBOLSO_EXT_UNIV":

				valor1 = this.getView().byId("UNIV1").getValue();
				valor = valor1;
				valor = valor.split("_");
				mes1 = valor[0];
				ano1 = valor[1];

				this.getView().byId("IdPlano_REEMBOLSO_EXT_UNIV").setSelectedKey(mes1);
				this.getView().byId("IdAno_REEMBOLSO_EXT_UNIV").setSelectedKey(ano1);

				this.getView().byId("IdIncluir").setVisible(false);
				this.getView().byId("IdSalvarDetailDep").setVisible(false);
				this.getView().byId("IdSalvarDetail").setVisible(false);
				this.getView().byId("IdCancelDetailDep").setVisible(false);
				this.getView().byId("IdSegundaVia").setVisible(false);
				this.getView().byId("CHECKBOX").setVisible(false);
				this.getView().byId("CheckBox").setSelected(false);
				this.getView().byId("IdEditDetailDep").setText("Solicitar");

				oFilterValor = new sap.ui.model.Filter("Valor", sap.ui.model.FilterOperator.EQ, valor1);
				oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, "0");
				oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
				oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, subty);
				if (idTipo === "Aguardando aprovação") {
					oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "C");
				} else {
					oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "B");
				}

				oList = this.getView().byId("UploadCollection");
				oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo, oFilterValor]);
				return;

			case "REEMBOLSO_EDUCACAO":
				this.getView().byId("IdIncluir").setVisible(false);
				this.getView().byId("IdSalvarDetailDep").setVisible(false);
				this.getView().byId("IdSalvarDetail").setVisible(false);
				this.getView().byId("IdCancelDetailDep").setVisible(false);
				this.getView().byId("IdSegundaVia").setVisible(false);
				this.getView().byId("CHECKBOX").setVisible(false);
				this.getView().byId("CheckBox").setSelected(false);
				this.getView().byId("IdEditDetailDep").setText("Solicitar");
				break;
			case "MATERIAL_ESCOLAR":
				this.getView().byId("IdIncluir").setVisible(false);
				this.getView().byId("IdSalvarDetailDep").setVisible(false);
				this.getView().byId("IdSalvarDetail").setVisible(false);
				this.getView().byId("IdCancelDetailDep").setVisible(false);
				this.getView().byId("IdSegundaVia").setVisible(false);
				this.getView().byId("CHECKBOX").setVisible(false);
				this.getView().byId("CheckBox").setSelected(false);
				this.getView().byId("IdEditDetailDep").setText("Solicitar");
				break;
			case "REEMBOLSO_IDIOMA":
				
				valor1 = this.getView().byId("IDIOMA1").getValue();
				valor = valor1;
				valor = valor.split("_");
				mes1 = valor[0];
				ano1 = valor[1];
				
				this.getView().byId("IdPlano_REEMBOLSO_EXT_UNIV").setSelectedKey(mes1);
				this.getView().byId("IdAno_REEMBOLSO_EXT_UNIV").setSelectedKey(ano1);
				
				this.getView().byId("IdIncluir").setVisible(false);
				this.getView().byId("IdSalvarDetailDep").setVisible(false);
				this.getView().byId("IdSalvarDetail").setVisible(false);
				this.getView().byId("IdCancelDetailDep").setVisible(false);
				this.getView().byId("IdSegundaVia").setVisible(false);
				this.getView().byId("CHECKBOX").setVisible(false);
				this.getView().byId("CheckBox").setSelected(false);
				this.getView().byId("IdEditDetailDep").setText("Solicitar");

				oFilterValor = new sap.ui.model.Filter("Valor", sap.ui.model.FilterOperator.EQ, valor1);
				oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, "0");
				oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
				oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, subty);
				if (idTipo === "Aguardando aprovação") {
					oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "C");
				} else {
					oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "B");
				}

				oList = this.getView().byId("UploadCollection");
				oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo, oFilterValor]);
				return;

			case "REEMBOLSO_MEDICAM":
				this.getView().byId("IdIncluir").setVisible(false);
				this.getView().byId("IdSalvarDetailDep").setVisible(false);
				this.getView().byId("IdSalvarDetail").setVisible(false);
				this.getView().byId("IdCancelDetailDep").setVisible(false);
				this.getView().byId("IdSegundaVia").setVisible(false);
				this.getView().byId("CHECKBOX").setVisible(false);
				this.getView().byId("CheckBox").setSelected(false);
				this.getView().byId("IdEditDetailDep").setText("Solicitar");
				break;
			}

			var Subty = subty;
			var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, "0");
			var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
			var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, Subty);
			if (idTipo === "Aguardando aprovação") {
				var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "C");
			} else {
				var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "B");
			}

			var oList = this.getView().byId("UploadCollection");
			oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo]);
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
				this._valueHelpDialog1 = sap.ui.xmlfragment("Y5GL_EC_BENEF2.Y5GL_EC_BENEF2.view.Valor", this);
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
			var Opcoes = this.getView().byId("IdValor_PREVIDENCIA_PRIVADA").getBinding("items");
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
				const sPlan = this.getView().byId("idbPLAN").getValue();
				const sOpcoes = this.getView().byId("idbOPCOES").getValue();

				if (sPlan !== Plano) {
					this.getView().byId("CHECKBOX").setVisible(true);
					this.getView().byId("CheckBox").setSelected(false);
				} else {
					this.getView().byId("CHECKBOX").setVisible(false);
					this.getView().byId("CheckBox").setSelected(false);
				}

				Opcoes = this.getView().byId("IdOpcoes_PLANO_ODONTOLOGICO").getBinding("items");
				Opcoes.filter([oFilterOpcoes]);

				var Pernr = "0";
				var infty = "DENT";
				var subty = Plano;
				var Valor = Plano; //this.getView().byId("IdOpcoes_SEGURO_VIDA").getSelectedKey();

				var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr);
				var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
				var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, subty);
				var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "B");
				var oFilterValor = new sap.ui.model.Filter("Valor", sap.ui.model.FilterOperator.EQ, Valor);
				var oList = this.getView().byId("UploadCollection");
				oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo, oFilterValor]);
				oList.getBinding("items").refresh(true);
				break;

			case "REEMBOLSO_ALUGUEL":
				var Pernr = "0";
				var infty = "XXXX";
				var subty = "REAL";
				var Valor = this.getView().byId("alug1").getValue();

				var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr);
				var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
				var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, subty);
				var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "U");
				var oFilterValor = new sap.ui.model.Filter("Valor", sap.ui.model.FilterOperator.EQ, Valor);
				var oList = this.getView().byId("UploadCollection");
				oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo, oFilterValor]);
				oList.getBinding("items").refresh(true);
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

		onIncluinoPlanoO: function (oEvent) {
			sap.m.MessageBox.alert("Anexe o documento para prosseguir.");

			chaveacao = oEvent.getSource()._getBindingContext().sPath;

			this.getView().byId("UPLOAD").setVisible(true);
			operacao = "I";
			this.getView().byId("IdCancelDetailDep").setVisible(true);
			this.getView().byId("IdSalvarDetailDep").setVisible(true);
			this.getView().byId("CHECKBOX").setVisible(true);
			this.getView().byId("CheckBox").setSelected(false);
			this.getView().byId("IdSalvarDetail").setVisible(false);
			this.getView().byId("IdSegundaVia").setVisible(false);

			this.getView().byId("TextInclusao_PLANO_ODONTOLOGICO_BRAD_MET").setVisible(false);
			this.getView().byId("TextInclusao_PLANO_ODONTOLOGICO_MET").setVisible(false);
			this.getView().byId("TextInclusao_PLANO_ODONTOLOGICO_UNIMED").setVisible(false);
			this.getView().byId("TextEditar_PLANO_ODONTOLOGICO").setVisible(false);

			if (this.getView().byId("IdPlano_PLANO_ODONTOLOGICO").getSelectedKey() == "BRAO") {
				this.getView().byId("TextInclusao_PLANO_ODONTOLOGICO_BRAD_MET").setVisible(true);
			} else if (this.getView().byId("IdPlano_PLANO_ODONTOLOGICO").getSelectedKey() == "METL") {
				this.getView().byId("TextInclusao_PLANO_ODONTOLOGICO_MET").setVisible(true);
			} else if (this.getView().byId("IdPlano_PLANO_ODONTOLOGICO").getSelectedKey() == "PSOU") {
				this.getView().byId("TextInclusao_PLANO_ODONTOLOGICO_UNIMED").setVisible(true);
			} else {
				this.getView().byId("TextEditar_PLANO_ODONTOLOGICO").setVisible(true);
			}

			//this.getView().byId("TextInclusao").setVisible(true);
			//this.getView().byId("TextExclusao_PLANO_ODONTOLOGICO").setVisible(false);
			//this.getView().byId("TextExclusao").setVisible(false);
		},

		getSelectedDependentes: function (sPlano) {
			const sTableId = `smartTable_${sPlano}`;

			const oTable = this.getView().byId(sTableId);
			const aRows = oTable.getTable().getAggregation("rows");

			const aSelectedDependentes = [];
			aRows.forEach((oRow) => {
				const bPressed = oRow.getAggregation("cells")[2].getProperty("pressed");
				if (bPressed) {
					aSelectedDependentes.push(oRow.getBindingContext().getObject())
				};
			});

			return aSelectedDependentes;
		},

		onIncluinoPlanoM: function (oEvent) {
			sap.m.MessageBox.alert("Anexe o documento para prosseguir.");

			chaveacao = oEvent.getSource()._getBindingContext().sPath;

			this.getView().byId("UPLOAD").setVisible(true);
			operacao = "I";
			this.getView().byId("IdCancelDetailDep").setVisible(true);
			this.getView().byId("IdSalvarDetailDep").setVisible(true);
			this.getView().byId("IdSalvarDetail").setVisible(false);
			this.getView().byId("IdSegundaVia").setVisible(false);
			if (this.getView().byId("IdPlano_PLANO_MEDICO").getSelectedKey() == "CNUN" || this.getView().byId("IdPlano_PLANO_MEDICO").getSelectedKey() ==
				"BRAD") {
				this.getView().byId("TextInclusao_CNUN_BRAD").setVisible(true);
			} else if (this.getView().byId("IdPlano_PLANO_MEDICO").getSelectedKey() == "UNCU") {
				this.getView().byId("TextInclusao_UNCU").setVisible(true);
			}else if (this.getView().byId("IdPlano_PLANO_MEDICO").getSelectedKey() == "UNJZ") {
				this.getView().byId("TextInclusao_UNJZ").setVisible(true);
			} else if (this.getView().byId("IdPlano_PLANO_MEDICO").getSelectedKey() == "SCMP") {
				this.getView().byId("TextInclusao_SCMP").setVisible(true);
			} else {
				this.getView().byId("TextInclusao").setVisible(true);
			}

			//this.getView().byId("TextExclusao_CNUN_BRAD").setVisible(false);
			//this.getView().byId("TextExclusao").setVisible(false);
		},

		onExluiPlanoO: function (oEvent) {
			chaveacao = oEvent.getSource()._getBindingContext().sPath;

			this.getView().byId("UPLOAD").setVisible(true);
			operacao = "E";
			this.getView().byId("IdCancelDetailDep").setVisible(true);
			this.getView().byId("IdSalvarDetailDep").setVisible(true);
			this.getView().byId("IdSalvarDetail").setVisible(false);
			this.getView().byId("IdSegundaVia").setVisible(false);

			this.getView().byId("TextInclusao_PLANO_ODONTOLOGICO_BRAD_MET").setVisible(false);
			this.getView().byId("TextInclusao_PLANO_ODONTOLOGICO_MET").setVisible(false);
			this.getView().byId("TextInclusao_PLANO_ODONTOLOGICO_UNIMED").setVisible(false);
			this.getView().byId("TextEditar_PLANO_ODONTOLOGICO").setVisible(false);

			if (this.getView().byId("IdPlano_PLANO_ODONTOLOGICO").getSelectedKey() == "BRAO") {
				this.getView().byId("TextInclusao_PLANO_ODONTOLOGICO_BRAD_MET").setVisible(true);
			} else if (this.getView().byId("IdPlano_PLANO_ODONTOLOGICO").getSelectedKey() == "METL") {
				this.getView().byId("TextInclusao_PLANO_ODONTOLOGICO_MET").setVisible(true);
			} else if (this.getView().byId("IdPlano_PLANO_ODONTOLOGICO").getSelectedKey() == "PSOU") {
				this.getView().byId("TextInclusao_PLANO_ODONTOLOGICO_UNIMED").setVisible(true);
			} else {
				this.getView().byId("TextEditar_PLANO_ODONTOLOGICO").setVisible(true);
			}
		},

		onExluiPlanoM: function (oEvent) {
			chaveacao = oEvent.getSource()._getBindingContext().sPath;

			this.getView().byId("UPLOAD").setVisible(true);
			operacao = "E";
			this.getView().byId("IdCancelDetailDep").setVisible(true);
			this.getView().byId("IdSalvarDetailDep").setVisible(true);
			this.getView().byId("IdSalvarDetail").setVisible(false);
			this.getView().byId("IdSegundaVia").setVisible(false);

			// if (this.getView().byId("IdPlano_PLANO_MEDICO").getSelectedKey() == "CNUN" || this.getView().byId("IdPlano_PLANO_MEDICO").getSelectedKey() ==
			// 	"BRAD") {
			// 	//this.getView().byId("TextExclusao_CNUN_BRAD").setVisible(true);
			// } else {
			// 	//this.getView().byId("TextExclusao").setVisible(true);
			// }

			this.getView().byId("IdSalvarDetail2via").setVisible(false);
			this.getView().byId("TextInclusao_CNUN_BRAD").setVisible(false);
			this.getView().byId("TextInclusao_UNCU").setVisible(false);
      		this.getView().byId("TextInclusao_UNJZ").setVisible(false);
			this.getView().byId("TextInclusao_SCMP").setVisible(false);
			this.getView().byId("TextInclusao").setVisible(false);

			if (this.getView().byId("IdPlano_PLANO_MEDICO").getSelectedKey() == "CNUN" || this.getView().byId("IdPlano_PLANO_MEDICO").getSelectedKey() ==
				"BRAD") {
				this.getView().byId("TextInclusao_CNUN_BRAD").setVisible(true);
			} else if (this.getView().byId("IdPlano_PLANO_MEDICO").getSelectedKey() == "UNCU") {
				this.getView().byId("TextInclusao_UNCU").setVisible(true);
			} else if (this.getView().byId("IdPlano_PLANO_MEDICO").getSelectedKey() == "UNJZ") {
				this.getView().byId("TextInclusao_UNJZ").setVisible(true);
			} else if (this.getView().byId("IdPlano_PLANO_MEDICO").getSelectedKey() == "SCMP") {
				this.getView().byId("TextInclusao_SCMP").setVisible(true);
			} else {
				this.getView().byId("TextInclusao").setVisible(true);
			}

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
			var mes;
			var ano;

			switch (param) {
			case "FUNSEJEM":
				infty = "";
				subty = "";
				break;
			case "PLANO_MEDICO":
				infty = "0167";
				subty = "MEDI";
				oListBase = this.getView().byId("smartTable_PLANO_MEDICO").getTable();
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
				Valor = this.getView().byId("IdOpcoes_SEGURO_VIDA").getSelectedKey();
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
				infty = "XXXX";
				subty = "COOP";
				break;
			case "GREMIO_CLUBE":
				infty = "XXXX";
				subty = "GREM";
				break;
			case "EMP_CONSIGNADO":
				infty = "XXXX";
				subty = "EMCO";
				break;
			case "FARMACIA":
				infty = "XXXX";
				subty = "FARM";
				break;
			case "REEMBOLSO_SUBSIDIO":
				infty = "XXXX";
				subty = "SUBS";
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
			case "MATERIAL_ESCOLAR":
				infty = "XXXX";
				subty = "MATE";
				Valor = this.getView().byId("IdPlano_MATERIAL_ESCOLAR").getSelectedKey();
				if (Valor === "") {
					sap.m.MessageBox.error("Selecione mês de referencia.");
					return;
				}
				break;
			case "REEMBOLSO_MEDICAM":
				infty = "XXXX";
				subty = "REME";
				mes = this.getView().byId("IdPlano_REEMBOLSO_MEDICAM").getSelectedKey();
				ano = this.getView().byId("IdAno_REEMBOLSO_MEDICAM").getSelectedKey();

				if (mes === "") {
					sap.m.MessageBox.error("Selecione mês de referencia.");
					return;
				}

				if (ano === "") {
					sap.m.MessageBox.error("Selecione ano de referencia.");
					return;
				}

				Valor = mes + "_" + ano;
				break;
			case "REEMBOLSO_ALUGUEL":
				infty = "XXXX";
				subty = "REAL	";
				mes = this.getView().byId("IdPlano_REEMBOLSO_ALUGUEL").getSelectedKey();
				ano = this.getView().byId("IdAno_REEMBOLSO_ALUGUEL").getSelectedKey();

				if (mes === "") {
					sap.m.MessageBox.error("Selecione mês de referencia.");
					return;
				}

				if (ano === "") {
					sap.m.MessageBox.error("Selecione ano de referencia.");
					return;
				}

				Valor = mes + "_" + ano;

				break;
			case "REEMBOLSO_EXT_UNIV":
				infty = "XXXX";
				subty = "REUN";
				mes = this.getView().byId("IdPlano_REEMBOLSO_EXT_UNIV").getSelectedKey();
				ano = this.getView().byId("IdAno_REEMBOLSO_EXT_UNIV").getSelectedKey();

				if (mes === "") {
					sap.m.MessageBox.error("Selecione mês de referencia.");
					return;
				}

				if (ano === "") {
					sap.m.MessageBox.error("Selecione ano de referencia.");
					return;
				}

				Valor = mes + "_" + ano;

				break;
			case "REEMBOLSO_ESTACIONAM":
				infty = "XXXX";
				subty = "REES";
				mes = this.getView().byId("IdPlano_REEMBOLSO_ESTACIONAM").getSelectedKey();
				ano = this.getView().byId("IdAno_REEMBOLSO_ESTACIONAM").getSelectedKey();

				if (mes === "") {
					sap.m.MessageBox.error("Selecione mês de referencia.");
					return;
				}

				if (ano === "") {
					sap.m.MessageBox.error("Selecione ano de referencia.");
					return;
				}

				Valor = mes + "_" + ano;

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

			case "REEMBOLSO_IDIOMA":
				infty = "XXXX";
				subty = "REID";
				mes = this.getView().byId("IdPlano_REEMBOLSO_IDIOMA").getSelectedKey();
				ano = this.getView().byId("IdAno_REEMBOLSO_IDIOMA").getSelectedKey();

				if (mes === "") {
					sap.m.MessageBox.error("Selecione mês de referencia.");
					return;
				}
				if (ano === "") {
					sap.m.MessageBox.error("Selecione o ano de referencia.");
					return;
				}
				
					Valor = mes + "_" + ano;
				break;
			}

			var Subty;
			var Objps = "0";
			var Concatenate = "";
			var Menssagem = "";

			if (dep === "X") {

				var selecionados = this.getSelectedDependentes(param);

				if (operacao === "I") {
					Concatenate = "I@";
					Menssagem = "Não existem dependentes marcados para inclusão";
				} else if (operacao === "E") {
					Concatenate = "E@";
					Menssagem = "Não existem dependentes marcados para Exclusão";
				} else if (via2 === "X") {
					Concatenate = "2@";
					Menssagem = "Não existem dependentes marcados para solicitação de segunda via.";

					for (var i = 0; i < selecionados.length; i++) {
						Subty = selecionados[i].Subty;
						Objps = selecionados[i].Objps;

						if (Number.parseInt(selecionados[i].Subty, 10) < 10) {
							Subty = `0${Subty}`;
						};

						if (Objps === "") {
							Objps = "00";
						};

						const sSeparator = i < selecionados.length - 1 ? "@" : "";
						Concatenate = Concatenate + Subty + "-" + Objps + sSeparator;
					}

				}

				if (via2 !== "X") {
					for (var i = 0; i < selecionados.length; i++) {
						Subty = selecionados[i].Subty;
						Objps = selecionados[i].Objps;

						if (Number.parseInt(selecionados[i].Subty, 10) < 10) {
							Subty = `0${Subty}`;
						};

						if (Objps === "") {
							Objps = "00";
						};

						const sSeparator = i < selecionados.length - 1 ? "@" : "";
						Concatenate = Concatenate + Subty + "-" + Objps + sSeparator;
					}
				}
			}

			if (Pernr !== "" || Subty !== "" || Objps !== "") {
				var sSlug = Pernr + "$" + infty + "$" + subty + "$" + Objps + "$" + oEvent.getParameter("fileName") + "$ $ $" + Concatenate + "$" +
					Valor;
				// Stellen die Kopf Parameter slug
				var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
					name: "slug",
					value: encodeURIComponent(sSlug)
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
			var mes;
			var ano;

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
				Valor = this.getView().byId("IdOpcoes_SEGURO_VIDA").getSelectedKey();
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
				infty = "XXXX";
				subty = "COOP";
				break;
			case "GREMIO_CLUBE":
				infty = "XXXX";
				subty = "GREM";
				break;
			case "EMP_CONSIGNADO":
				infty = "XXXX";
				subty = "EMCO";
				break;
			case "FARMACIA":
				infty = "XXXX";
				subty = "FARM";
				break;
			case "REEMBOLSO_SUBSIDIO":
				infty = "XXXX";
				subty = "SUBS";
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
			case "MATERIAL_ESCOLAR":
				infty = "XXXX";
				subty = "MATE";
				Valor = this.getView().byId("IdPlano_MATERIAL_ESCOLAR").getSelectedKey();
				break;
			case "REEMBOLSO_MEDICAM":
				infty = "XXXX";
				subty = "REME";
				mes = this.getView().byId("IdPlano_REEMBOLSO_MEDICAM").getSelectedKey();
				ano = this.getView().byId("IdAno_REEMBOLSO_MEDICAM").getSelectedKey();

				if (mes === "") {
					sap.m.MessageBox.error("Selecione mês de referencia.");
					return;
				}

				if (ano === "") {
					sap.m.MessageBox.error("Selecione ano de referencia.");
					return;
				}

				Valor = mes + "_" + ano;
				break;
			case "REEMBOLSO_ESTACIONAM":
				infty = "XXXX";
				subty = "REES";
				mes = this.getView().byId("IdPlano_REEMBOLSO_ESTACIONAM").getSelectedKey();
				ano = this.getView().byId("IdAno_REEMBOLSO_ESTACIONAM").getSelectedKey();

				if (mes === "") {
					sap.m.MessageBox.error("Selecione mês de referencia.");
					return;
				}

				if (ano === "") {
					sap.m.MessageBox.error("Selecione ano de referencia.");
					return;
				}

				Valor = mes + "_" + ano;

				break;
			case "REEMBOLSO_ALUGUEL":
				infty = "XXXX";
				subty = "REAL";
				mes = this.getView().byId("IdPlano_REEMBOLSO_ALUGUEL").getSelectedKey();
				ano = this.getView().byId("IdAno_REEMBOLSO_ALUGUEL").getSelectedKey();

				if (mes === "") {
					sap.m.MessageBox.error("Selecione mês de referencia.");
					return;
				}

				if (ano === "") {
					sap.m.MessageBox.error("Selecione ano de referencia.");
					return;
				}

				Valor = mes + "_" + ano;

				break;
			case "REEMBOLSO_EXT_UNIV":
				infty = "XXXX";
				subty = "REUN";
				mes = this.getView().byId("IdPlano_REEMBOLSO_EXT_UNIV").getSelectedKey();
				ano = this.getView().byId("IdAno_REEMBOLSO_EXT_UNIV").getSelectedKey();

				if (mes === "") {
					sap.m.MessageBox.error("Selecione mês de referencia.");
					return;
				}

				if (ano === "") {
					sap.m.MessageBox.error("Selecione ano de referencia.");
					return;
				}

				Valor = mes + "_" + ano;

				break;
			case "REEMBOLSO_EDUCACAO":
				infty = "XXXX";
				subty = "REED";
				Valor = this.getView().byId("IdPlano_REEMBOLSO_EDUCACAO").getSelectedKey();
				break;

			case "REEMBOLSO_IDIOMA":
				infty = "XXXX";
				subty = "REID";
				Valor = this.getView().byId("IDIOMA1").getValue();
				break;
			}
			if (dep === "X") {
				var Concatenate = "";
				var Menssagem = "";
				var Subty = "";
				var Objps = "";
				var selecionados = this.getSelectedDependentes(param);

				if (operacao === "I") {
					Concatenate = "I@";
					Menssagem = "Não existem dependentes marcados para inclusão";
				} else {
					Concatenate = "E@";
					Menssagem = "Não existem dependentes marcados para Exclusão";
				}

				if (via2 !== "X") {
					for (var i = 0; i < selecionados.length; i++) {
						Subty = selecionados[i].Subty;
						Objps = selecionados[i].Objps;

						if (Number.parseInt(selecionados[i].Subty, 10) < 10) {
							Subty = `0${Subty}`;
						};

						if (Objps === "") {
							Objps = "00";
						};

						const sSeparator = i < selecionados.length - 1 ? "@" : "";
						Concatenate = Concatenate + Subty + "-" + Objps + sSeparator;
					}
				}
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
			var Pernr = "0";
			var infty;
			var subty;
			var Valor;
			var mes;
			var ano;

			switch (param) {
			case "FUNSEJEM":
				infty = "";
				subty = "";
				break;
			case "PLANO_MEDICO":
				infty = "MEDI";
				subty = this.getView().byId("IdPlano_PLANO_MEDICO").getSelectedKey();
				break;
			case "PLANO_ODONTOLOGICO":
				infty = "DENT";
				subty = this.getView().byId("IdPlano_PLANO_ODONTOLOGICO").getSelectedKey();
				break;
			case "SEGURO_VIDA":
				infty = "0168";
				subty = "VIDA";
				Valor = this.getView().byId("IdOpcoes_SEGURO_VIDA").getSelectedKey();
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
				infty = "XXXX";
				subty = "COOP";
				break;
			case "GREMIO_CLUBE":
				infty = "XXXX";
				subty = "GREM";
				break;
			case "EMP_CONSIGNADO":
				infty = "XXXX";
				subty = "EMCO";
				break;
			case "FARMACIA":
				infty = "XXXX";
				subty = "FARM";
				break;
			case "REEMBOLSO_SUBSIDIO":
				infty = "XXXX";
				subty = "SUBS";
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
				infty = "PREV";
				subty = "NORM";
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
			case "MATERIAL_ESCOLAR":
				infty = "XXXX";
				subty = "MATE";
				break;
			case "REEMBOLSO_MEDICAM":
				infty = "XXXX";
				subty = "REME";
				mes = this.getView().byId("IdPlano_REEMBOLSO_MEDICAM").getSelectedKey();
				ano = this.getView().byId("IdAno_REEMBOLSO_MEDICAM").getSelectedKey();

				Valor = mes + "_" + ano;
				break;
			case "REEMBOLSO_ESTACIONAM":
				infty = "XXXX";
				subty = "REES";
				mes = this.getView().byId("IdPlano_REEMBOLSO_ESTACIONAM").getSelectedKey();
				ano = this.getView().byId("IdAno_REEMBOLSO_ESTACIONAM").getSelectedKey();

				Valor = mes + "_" + ano;

				break;
			case "REEMBOLSO_ALUGUEL":
				infty = "XXXX";
				subty = "REAL	";
				mes = this.getView().byId("IdPlano_REEMBOLSO_ALUGUEL").getSelectedKey();
				ano = this.getView().byId("IdAno_REEMBOLSO_ALUGUEL").getSelectedKey();

				Valor = mes + "_" + ano;

				break;
			case "REEMBOLSO_EXT_UNIV":
				infty = "XXXX";
				subty = "REUN";
				mes = this.getView().byId("IdPlano_REEMBOLSO_EXT_UNIV").getSelectedKey();
				ano = this.getView().byId("IdAno_REEMBOLSO_EXT_UNIV").getSelectedKey();

				Valor = mes + "_" + ano;

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
				var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "B");
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
			var mes;
			var ano;

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
				Valor = this.getView().byId("IdOpcoes_SEGURO_VIDA").getSelectedKey();
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
				infty = "XXXX";
				subty = "COOP";
				break;
			case "GREMIO_CLUBE":
				infty = "XXXX";
				subty = "GREM";
				break;
			case "EMP_CONSIGNADO":
				infty = "XXXX";
				subty = "EMCO";
				break;
			case "FARMACIA":
				infty = "XXXX";
				subty = "FARM";
				break;
			case "REEMBOLSO_SUBSIDIO":
				infty = "XXXX";
				subty = "SUBS";
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
			case "MATERIAL_ESCOLAR":
				infty = "XXXX";
				subty = "MATE";
				break;
			case "REEMBOLSO_MEDICAM":
				infty = "XXXX";
				subty = "REME";
				mes = this.getView().byId("IdPlano_REEMBOLSO_MEDICAM").getSelectedKey();
				ano = this.getView().byId("IdAno_REEMBOLSO_MEDICAM").getSelectedKey();

				Valor = mes + "_" + ano;
				break;
			case "REEMBOLSO_ESTACIONAM":
				infty = "XXXX";
				subty = "REES";
				mes = this.getView().byId("IdPlano_REEMBOLSO_ESTACIONAM").getSelectedKey();
				ano = this.getView().byId("IdAno_REEMBOLSO_ESTACIONAM").getSelectedKey();

				if (mes === "") {
					sap.m.MessageBox.error("Selecione mês de referencia.");
					return;
				}

				if (ano === "") {
					sap.m.MessageBox.error("Selecione ano de referencia.");
					return;
				}

				Valor = mes + "_" + ano;

				break;
			case "REEMBOLSO_ALUGUEL":
				infty = "XXXX";
				subty = "REAL";
				mes = this.getView().byId("IdPlano_REEMBOLSO_ALUGUEL").getSelectedKey();
				ano = this.getView().byId("IdAno_REEMBOLSO_ALUGUEL").getSelectedKey();

				if (mes === "") {
					sap.m.MessageBox.error("Selecione mês de referencia.");
					return;
				}

				if (ano === "") {
					sap.m.MessageBox.error("Selecione ano de referencia.");
					return;
				}

				Valor = mes + "_" + ano;

				break;
			case "REEMBOLSO_EXT_UNIV":
				infty = "XXXX";
				subty = "REUN";
				mes = this.getView().byId("IdPlano_REEMBOLSO_EXT_UNIV").getSelectedKey();
				ano = this.getView().byId("IdAno_REEMBOLSO_EXT_UNIV").getSelectedKey();

				if (mes === "") {
					sap.m.MessageBox.error("Selecione mês de referencia.");
					return;
				}

				if (ano === "") {
					sap.m.MessageBox.error("Selecione ano de referencia.");
					return;
				}

				Valor = mes + "_" + ano;

				break;
			case "REEMBOLSO_EDUCACAO":
				infty = "XXXX";
				subty = "REED";
				Valor = this.getView().byId("IdPlano_REEMBOLSO_EDUCACAO").getSelectedKey();
				break;

			case "REEMBOLSO_IDIOMA":
				infty = "XXXX";
				subty = "REID";
				Valor = this.getView().byId("IDIOMA1").getValue();
				break;
			}

			var oModel = this.getView().getModel();
			var Ano = "0";
			var Favor = "0";
			var Infty = infty;
			var Mes = "0";
			var Pernr = "0";
			var Tipo = "E";
			var ListItem = oEvent.getParameters("listItem");
			var docid = ListItem.documentId;
			docid = parseInt(docid);
			var idTipo = this.getView().byId("idTipo").getValue();
			var Area = "0";

			if (idTipo === "Aguardando aprovação") {
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

				const selecionados = this.getSelectedDependentes(param);

				for (var i = 0; i < selecionados.length; i++) {
					Subty = selecionados[i].Subty;
					Objps = selecionados[i].Objps;

					if (Number.parseInt(selecionados[i].Subty, 10) < 10) {
						Subty = `0${Subty}`;
					};

					if (Objps === "") {
						Objps = "00";
					};

					const sSeparator = i < selecionados.length - 1 ? "@" : "";
					Concatenate = Concatenate + Subty + "-" + Objps + sSeparator;
				}
			}

			var Key = "/ZET_GLRH_UPLOADSet(Ano='" + Ano + "',Favor='" + Favor + "',Infty='" + Infty + "',Mes='" + Mes + "',Pernr='" + Pernr +
				"',Tipo='" + Tipo + "',Subty='" + subty + "',DocId=" + docid + ",Objps='',Icnum='',Valor='" + Valor + "',Dependentes='" +
				Concatenate + "',Area='" + Area + "')";
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

		FormatSelectionMode: function (oValue) {
			return "None";
		},

		onAdd: function () {
			var Pernr = "0";
			var Tipo = "A";
			var Objps = "0";
			var Subty = "-";
			var Favor = "-";
			var Zdesc = "DependentesAdd";
			var Cpf = "-";
			var Plan = this.getView().byId("IdPlano_PLANO_MEDICO").getSelectedKey();
			this.getRouter().navTo(Zdesc, {
				Pernr: Pernr,
				Subty: Subty,
				Objps: Objps,
				Tipo: Tipo,
				Favor: Favor,
				Icnum: Cpf,
				Plan: Plan
			});
		},

		onSegunda: function () {
			var that = this;
			var messagem;
			via2 = "X";
			var count;

			if (param === "PLANO_MEDICO") {
				count = this.getView().byId("table1").getBinding("rows").getLength();
			} else if (param === "PLANO_ODONTOLOGICO") {
				count = this.getView().byId("table1_PLANO_ODONTOLOGICO").getBinding("rows").getLength();
			}

			if (count > 0) {
				messagem = "Deseje solicitar segunda via da carterinha para:";
				sap.m.MessageBox.show(messagem, {
					actions: ["Dependente", "Titular"],
					onClose: function (sAction) {
						if (sAction === "Dependente") {
							if (param === "PLANO_MEDICO") {
								that.byId("table1").setSelectionMode("MultiToggle");
								that.byId("IdCancelBeneficio").setVisible(false);
								that.byId("IdSegundaVia").setVisible(false);
								that.byId("IdCancelDetailDep").setVisible(true);
								that.byId("IdSalvarDetailDep").setVisible(true);
								dep = "X";
							} else if (param === "PLANO_ODONTOLOGICO") {
								that.byId("table1_PLANO_ODONTOLOGICO").setSelectionMode("MultiToggle");
								that.byId("IdCancelBeneficio").setVisible(false);
								that.byId("IdSegundaVia").setVisible(false);
								that.byId("IdCancelDetailDep").setVisible(true);
								that.byId("IdSalvarDetailDep").setVisible(true);
							}
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
				visao.byId("IdSegundaVia").setVisible(false);
				visao.byId("IdIncluir").setVisible(false);
				if (this.getView().byId("IdPlano_PLANO_MEDICO").getSelectedKey() == "CNUN" || this.getView().byId("IdPlano_PLANO_MEDICO").getSelectedKey() ==
					"BRAD") {
					this.getView().byId("TextInclusao_CNUN_BRAD").setVisible(true);
				} else if (this.getView().byId("IdPlano_PLANO_MEDICO").getSelectedKey() == "UNCU") {
					this.getView().byId("TextInclusao_UNCU").setVisible(true);
				} else if (this.getView().byId("IdPlano_PLANO_MEDICO").getSelectedKey() == "UNJZ") {
					this.getView().byId("TextInclusao_UNJZ").setVisible(true);
				} else if (this.getView().byId("IdPlano_PLANO_MEDICO").getSelectedKey() == "SCMP") {
					this.getView().byId("TextInclusao_SCMP").setVisible(true);
				} else {
					this.getView().byId("TextInclusao").setVisible(true);
				}
				break;
			case "PLANO_ODONTOLOGICO":
				visao.byId("IdPlano_PLANO_ODONTOLOGICO").setEditable(true);
				visao.byId("IdCartDentista").setEditable(true);
				visao.byId("IdOpcoes_PLANO_ODONTOLOGICO").setEditable(true);
				visao.byId("IdSegundaVia").setVisible(false);

				this.getView().byId("TextInclusao_PLANO_ODONTOLOGICO_BRAD_MET").setVisible(false);
				this.getView().byId("TextInclusao_PLANO_ODONTOLOGICO_MET").setVisible(false);
				this.getView().byId("TextInclusao_PLANO_ODONTOLOGICO_UNIMED").setVisible(false);
				this.getView().byId("TextEditar_PLANO_ODONTOLOGICO").setVisible(false);

				if (this.getView().byId("IdPlano_PLANO_ODONTOLOGICO").getSelectedKey() == "BRAO") {
					this.getView().byId("TextInclusao_PLANO_ODONTOLOGICO_BRAD_MET").setVisible(true);
				} else if (this.getView().byId("IdPlano_PLANO_ODONTOLOGICO").getSelectedKey() == "METL") {
					this.getView().byId("TextInclusao_PLANO_ODONTOLOGICO_MET").setVisible(true);
				} else if (this.getView().byId("IdPlano_PLANO_ODONTOLOGICO").getSelectedKey() == "PSOU") {
					this.getView().byId("TextInclusao_PLANO_ODONTOLOGICO_UNIMED").setVisible(true);
				} else {
					this.getView().byId("TextEditar_PLANO_ODONTOLOGICO").setVisible(true);
				}

				if (visao.byId("idbPLAN").getValue() && visao.byId("idbOPCOES").getValue()) {
					visao.byId("CHECKBOX").setVisible(false);
				} else {
					visao.byId("CHECKBOX").setVisible(true);
				}
				visao.byId("CheckBox").setSelected(false);
				//visao.byId("Text_PLANO_ODONTOLOGICO").setVisible(true);
				break;
			case "PLANO_DENT_2":
				visao.byId("IdPlano_PLANO_DENT_2").setEditable(true);
				visao.byId("IdCartPLANO_DENT_2").setEditable(true);
				break;
			case "SEGURO_VIDA":
				visao.byId("IdPlano_SEGURO_VIDA").setEditable(true);
				visao.byId("IdOpcoes_SEGURO_VIDA").setEditable(true);
				visao.byId("TextPlano").setVisible(true);
				break;
			case "TRANSPORTE":
				//visao.byId("idValorTranporte").setEditable(true);
				visao.byId("IdPlano_TRANSPORTE").setEditable(true);
				visao.byId("UPLOAD").setVisible(true);
				visao.byId("IdSalvarDetail").setVisible(true);
				visao.byId("TextTransporte").setVisible(true);
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
				visao.byId("IdSalvarDetail").setVisible(true);
				visao.byId("TextCOOPERATIVA").setVisible(true);
				break;
			case "GREMIO_CLUBE":
				//visao.byId("IdPlano_GREMIO_CLUBE").setEditable(true);
				//visao.byId("IdObservacao_GREMIO_CLUBE").setEditable(true);
				visao.byId("TextGREMIO_CLUBE4").setVisible(false);
				visao.byId("TextGREMIO_CLUBE").setVisible(true);
				visao.byId("UPLOAD").setVisible(true);
				break;
			case "EMP_CONSIGNADO":
				//visao.byId("IdPlano_EMPRESTIMO_CONSIGINADO").setEditable(true);
				//visao.byId("IdMontante_EMPRESTIMO_CONSIGINADO").setEditable(true);
				//visao.byId("IdValidade_EMPRESTIMO_CONSIGINADO").setEditable(true);
				//visao.byId("IdObservacao_EMPRESTIMO_CONSIGINADO").setEditable(true);
				visao.byId("TextEMPRESTIMO_CONSIGINADO").setVisible(true);
				break;
			case "FARMACIA":
				visao.byId("IdPlano_FARMACIA").setEditable(true);
				visao.byId("IdMotivo_FARMACIA").setEditable(true);
				visao.byId("TextFARMACIA").setVisible(true);
				visao.byId("UPLOAD").setVisible(true);
				break;
			case "REEMBOLSO_SUBSIDIO":
				visao.byId("IdPlano_REEMBOLSO_SUBSIDIO").setEditable(true);
				visao.byId("IdAno_REEMBOLSO_SUBSIDIO").setEditable(true);
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
				visao.byId("FormContainer5_CESTA_BASICA").setVisible(true);
				break;
			case "PREVIDENCIA_PRIVADA":
				visao.byId("IdMotivo_PREVIDENCIA_PRIVADA").setEditable(true);
				visao.byId("IdValor_PREVIDENCIA_PRIVADA").setEditable(true);
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
				visao.byId("IdAno_REEMBOLSO_ESTACIONAM").setEditable(true);
				break;
			case "REEMBOLSO_ALUGUEL":
				visao.byId("IdPlano_REEMBOLSO_ALUGUEL").setEditable(true);
				visao.byId("TextREEMBOLSO_ALUGUEL").setVisible(true);
				visao.byId("IdAno_REEMBOLSO_ALUGUEL").setEditable(true);
				break;
			case "REEMBOLSO_EXT_UNIV":
				visao.byId("IdPlano_REEMBOLSO_EXT_UNIV").setEditable(true);
				visao.byId("TextREEMBOLSO_EXT_UNIV").setVisible(true);
				visao.byId("IdAno_REEMBOLSO_EXT_UNIV").setEditable(true);
				break;
			case "REEMBOLSO_EDUCACAO":
				visao.byId("IdPlano_REEMBOLSO_EDUCACAO").setEditable(true);
				visao.byId("TextREEMBOLSO_EDUCACAO").setVisible(true);
				break;
			case "MATERIAL_ESCOLAR":
				visao.byId("IdPlano_MATERIAL_ESCOLAR").setEditable(true);
				visao.byId("Text_MATERIAL_ESCOLAR").setVisible(true);
				break;
			case "REEMBOLSO_IDIOMA":
				visao.byId("IdPlano_REEMBOLSO_IDIOMA").setEditable(true);
				visao.byId("IdAno_REEMBOLSO_IDIOMA").setEditable(true);
				visao.byId("Text_REEMBOLSO_IDIOMA").setVisible(true);
				break;
			case "REEMBOLSO_MEDICAM":
				visao.byId("IdPlano_REEMBOLSO_MEDICAM").setEditable(true);
				visao.byId("IdAno_REEMBOLSO_MEDICAM").setEditable(true);
				visao.byId("Text_REEMBOLSO_MEDICAM").setVisible(true);
				break;
			}

			visao.byId("IdEditDetailDep").setVisible(false);
			visao.byId("IdSalvarDetail").setVisible(true);
			visao.byId("IdSalvarDetailDep").setVisible(false);
			visao.byId("IdCancelDetailDep").setVisible(true);
			visao.byId("UploadCollection").setUploadButtonInvisible(false);
		},

		FormatFalse: function () {
			return false;
		},

		onSelected: function () {
			this.getView().byId("FormContainer7_TRANSPORTE").setVisible(true);
		},

		onbeforeRebindTable_TRANSPORTE: function (oEvent) {
			var Plano = this.getView().byId("IdPlano_TRANSPORTE").getSelectedKey();

			if (Plano !== undefined || Plano !== "") {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "IBplan",
					operator: "EQ",
					value1: Plano
				}));

				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "IBeneficio",
					operator: "EQ",
					value1: "TRANSPORTE"
				}));
			}
		},

		onbeforeRebindTable: function (oEvent) {
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
		},

		OnEditDep: function () {
			var Table = this.getView().byId("table");
			var Selecionado = Table.getSelectedItems();
			var ChaveSelec;
			var Separador;
			var length = Selecionado.length;
			var Pernr = "0";
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
			var Valor = this.getView().byId("IdValor_PREVIDENCIA_PRIVADA");
			var Valor1 = this.getView().byId("IdValor1_PREVIDENCIA_PRIVADA");
			var Title = this.getView().byId("FormContainer5_PREVIDENCIA_PRIVADA");
			var Title1 = this.getView().byId("FormContainer4_PREVIDENCIA_PRIVADA");
			var Texto;

			switch (Motivo) {
			case "AB":
				Texto = "Informe para alteração de beneficiários";
				Valor.setVisible(true);
				Valor1.setVisible(false);
				break;
			case "AD":
				Texto = "Informe o percentual da Adesão.";
				Valor.setVisible(true);
				Valor1.setVisible(false);
				Title.setLabel("Percentual");
				Title1.setLabel("Percentual");
				break;
			case "CA":
				Texto = "Informe o percentual da contribuição adicional.";
				Valor.setVisible(false);
				Valor1.setVisible(true);
				Title.setLabel("Percentual");
				Title1.setLabel("Percentual");
				break;
			case "CB":
				Texto = "Informe o percentual da contribuição básica.";
				Valor.setVisible(true);
				Valor1.setVisible(false);
				Title.setLabel("Percentual");
				Title1.setLabel("Percentual");
				break;
			case "MI":
				Texto = "Informe a modalidade de investimento.";
				Valor.setVisible(true);
				Valor1.setVisible(false);
				Title.setLabel("Modalidade");
				Title1.setLabel("Modalidade");
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

				var ValorItems = this.getView().byId("IdValor_PREVIDENCIA_PRIVADA").getBinding("items");
				var oFilterOpcoes = new sap.ui.model.Filter("IOpcao", sap.ui.model.FilterOperator.EQ, Motivo);
				ValorItems.filter([oFilterOpcoes]);

			}

			Valor.setPlaceholder(Texto);
			Valor1.setPlaceholder(Texto);
		},

		onCancelBeneficio: function () {
			let sMessage = "Anexe o formulario para continuar.";
			if (param === "PLANO_ODONTOLOGICO") {
				sMessage = 'Você está solicitando o cancelamento deste benefício. Clique em "Enviar" para continuar com a solicitação.';
			};
			sap.m.MessageBox.error(sMessage);

			Cancela = "C";
			this.getView().byId("UPLOAD").setVisible(true);
			this.getView().byId("IdSalvarDetail").setVisible(true);
			this.getView().byId("IdSegundaVia").setVisible(false);
			this.getView().byId("IdCancelBeneficio").setVisible(false);
			this.getView().byId("IdCancelDetailDep").setVisible(true);
		},

		formatExclui: function () {

		},

		onSave2via: function () {
			var dialog;
			var oModel = this.getView().getModel();
			var oEntry = {};
			var that = this;
			var Beneficio = param;
			var Pernr = "0";
			var Tipo;
			var via2 = "X";

			if (Cancela === "C") {
				Tipo = Cancela;
			} else {
				Tipo = "G";
			}

			var Key = "/ZET_GLHR_DETAIL_BENEFICIOSSet(Pernr='" + Pernr + "',Beneficio='" + Beneficio + "',Tipo='" + Tipo + "')";
			var validaoutros = 0;

			switch (Beneficio) {

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

				break;
			}

			oEntry.Tipo = oEntry.Operation;
			oEntry.Beneficio = Beneficio;

			if (oEntry.Montante !== "" && oEntry.Montante !== undefined) {

				while (oEntry.Montante.indexOf(".") !== -1) {
					oEntry.Montante = oEntry.Montante.replace(".", "");
				}

				oEntry.Montante = oEntry.Montante.replace(",", ".");
			}

			if (validaoutros === 1) {
				var that = this;
				var dialog = "";
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

		}

	});

});