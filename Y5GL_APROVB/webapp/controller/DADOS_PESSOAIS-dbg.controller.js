sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/Device",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text",
	'sap/ui/model/Filter'

], function (Controller, Device, Dialog, Button, Text, Filter) {
	"use strict";

	return Controller.extend("Y5GL_APROVB.Y5GL_APROVB.controller.DADOS_PESSOAIS", {
		onInit: function () {

		},

		onSave: function () {
			var view = this.getView();
			var NomeCompleto = view.byId("IdNomeCompleto").getValue();
			var DataNascimento = view.byId("IdDataNascimento").getValue();
			var Sexo = view.byId("IdSexo").getSelectedKey();
			var Nacionaliade = view.byId("IdNacionaliade").getSelectedKey();
			var LocalNascimento = view.byId("IdLocNascimento").getValue();
			var EstNasc = view.byId("IdEstNasc").getSelectedKey();
			var PaisNasc = view.byId("IdPaisNasc").getSelectedKey();
			var Aposentado = view.byId("IdAposentado").getSelectedKey();
			var Raca = view.byId("IdRaca").getSelectedKey();
			var CasadoDesde = view.byId("IdCasadoDesde").getValue();
			var EstCivil = view.byId("IdEstCivil").getSelectedKey();
			var Idioma = view.byId("IdIdioma").getSelectedKey();
			var dialog;
			var oModel = this.getView().getModel();
			var that = this;
			var erro;
			var erro2;
			var messagem;
			var key;
			var oEntry = {};

			if (NomeCompleto === "" || NomeCompleto === undefined) {
				view.byId("IdNomeCompleto").setValueState("Error");
				sap.m.MessageBox.error("Informe o nome completo.");
				return;
			} else {
				view.byId("IdNomeCompleto").setValueState("None");
				oEntry.Nome = NomeCompleto;
			}

			if (DataNascimento === "" || DataNascimento === undefined) {
				view.byId("IdDataNascimento").setValueState("Error");
				sap.m.MessageBox.error("Informe a data de nascimento.");
				return;
			} else {
				view.byId("IdDataNascimento").setValueState("None");
				DataNascimento = DataNascimento.substring(0,4) + DataNascimento.substring(5,7)  + DataNascimento.substring(8,10);
				oEntry.DtNasc = DataNascimento;
			}

			if (Sexo === "" || Sexo === undefined) {
				view.byId("IdSexo").setValueState("Error");
				sap.m.MessageBox.error("Informe o sexo.");
				return;
			} else {
				view.byId("IdSexo").setValueState("None");
				oEntry.Sexo = Sexo;
			}

			if (Nacionaliade === "" || Nacionaliade === undefined) {
				view.byId("IdNacionaliade").setValueState("Error");
				sap.m.MessageBox.error("Informe a nacionalidade.");
				return;
			} else {
				view.byId("IdNacionaliade").setValueState("None");
				oEntry.Nacionalidade = Nacionaliade;
			}

			if (LocalNascimento === "" || LocalNascimento === undefined) {
				view.byId("IdLocalNascimento").setValueState("Error");
				sap.m.MessageBox.error("Informe a local de nascimento.");
				return;
			} else {
				view.byId("IdLocNascimento").setValueState("None");
				LocalNascimento = this.getView().byId("IdCodNat").getValue();
				LocalNascimento = LocalNascimento.split("-");
				LocalNascimento = LocalNascimento[0];
				oEntry.Municipio = LocalNascimento;
			}

			if (EstNasc === "" || EstNasc === undefined) {
				view.byId("IdEstNasc").setValueState("Error");
				sap.m.MessageBox.error("Informe o estado de nascimento.");
				return;
			} else {
				view.byId("IdEstNasc").setValueState("None");
				oEntry.Estado = EstNasc;
			}

			if (PaisNasc === "" || PaisNasc === undefined) {
				view.byId("IdPaisNasc").setValueState("Error");
				sap.m.MessageBox.error("Informe o pais de nascimento.");
				return;
			} else {
				view.byId("IdPaisNasc").setValueState("None");
				oEntry.Pais = PaisNasc;
			}

			if (Idioma === "" || Idioma === undefined) {
				view.byId("IdIdioma").setValueState("Error");
				sap.m.MessageBox.error("Informe o idioma.");
				return;
			} else {
				view.byId("IdIdioma").setValueState("None");
				oEntry.Idioma = Idioma;
			}

			if (EstCivil === "" || EstCivil === undefined) {
				view.byId("IdEstCivil").setValueState("Error");
				sap.m.MessageBox.error("Informe o estado civil.");
				return;
			} else {
				view.byId("IdEstCivil").setValueState("None");
				oEntry.EstadoCivil = EstCivil;
			}

			if (CasadoDesde === "" || CasadoDesde === undefined) {
				view.byId("IdCasadoDesde").setValueState("Error");
				sap.m.MessageBox.error("Informe a data de casamento.");
				return;
			} else {
				view.byId("IdCasadoDesde").setValueState("None");
				CasadoDesde = CasadoDesde.substring(0,4) + CasadoDesde.substring(5,7)  + CasadoDesde.substring(8,10);
				oEntry.DtCasamento = CasadoDesde;
			}

			if (Raca === "" || Raca === undefined) {
				view.byId("IdRaca").setValueState("Error");
				sap.m.MessageBox.error("Informe a raca.");
				return;
			} else {
				view.byId("IdRaca").setValueState("None");
				oEntry.Raca = Raca;
			}

			if (Aposentado === "" || Aposentado === undefined) {
				view.byId("IdAposentado").setValueState("Error");
				sap.m.MessageBox.error("Informe se aposentado.");
				return;
			} else {
				view.byId("IdAposentado").setValueState("None");
				oEntry.Aposentado = Aposentado;
			}

			key = "/ZET_MEUS_DADOS_ECSet(Pernr='0')";

			dialog = new Dialog({
				title: "Confirma\xE7\xE3o",
				type: "Message",
				content: new Text({
					text: "Confirma a exclusão da solicitação do benefício?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(key, oEntry, {
							success: function (oData, oResponse) {

								sap.m.MessageBox.success("Dados gravados.", {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function (sAction) {
										//that.getRouter().navTo("BENEFICIOS");
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
										//that.getRouter().navTo("BENEFICIOS");
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

		handleValueHelp: function (oEvent) {

			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog1) {
				this._valueHelpDialog1 = sap.ui.xmlfragment("Y5GL_APROVB.Y5GL_APROVB.view.LocNascimento", this);
				this.getView().addDependent(this._valueHelpDialog1);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog1.open(sInputValue);

			// // create a filter for the binding
			if (sInputValue) {
				this._valueHelpDialog1.getBinding("items").filter([new Filter(
					"IMunicipio",
					sap.ui.model.FilterOperator.EQ, sInputValue
				)]);
			}

			this._valueHelpDialog1.getBinding("items").filter([new Filter(
				"IUf",
				sap.ui.model.FilterOperator.EQ, "SP"
			)]);
		},

		onSearchMunicipio: function (oEvent) {
			var sValue = oEvent.getParameter("value");

			if (sValue) {
				var sFilter = sValue;
				var oFilter = new sap.ui.model.Filter("IMunicipio", sap.ui.model.FilterOperator.EQ, sFilter);
				var oFilter2 = new sap.ui.model.Filter("IUf", sap.ui.model.FilterOperator.EQ, "SP");
				oEvent.getSource().getBinding("items").filter([oFilter,oFilter2]);
			}

		},

		onConfirmMunicipio: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			
			this._valueHelpDialog1 = null;
			
			if (oSelectedItem) {
				var title = oSelectedItem.getTitle();
				var descripition = oSelectedItem.getDescription();
				
				var value = descripition + "-" + title;
				
				this.getView().byId("IdCodNat").setValue(value);
				
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(title);
				
			}
		}

	});

});