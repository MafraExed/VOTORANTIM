sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text"
], function (Controller, JSONModel, Dialog, Button, Text) {
	"use strict";

	return Controller.extend("Y5GL_APROVB.Y5GL_APROVB.controller.ENDERECO", {

		onInit: function () {

		},

		onChangeCEP: function () {
			var cep = this.getView().byId("IdCEP").getValue();
			var url = "https://viacep.com.br/ws/" + cep + "/json/?callback=callback_name";
			var oModel;
			var that = this;

			$.ajax({
				url: url,
				dataType: "jsonp",
				success: function (response) {
					oModel = response;
					that.BuscaEndereco(oModel);
				},
				error: function () {

				}
			});
		},

		BuscaEndereco: function (oModel) {
			var rua = oModel.logradouro;
			var bairro = oModel.bairro;
			var cidade = oModel.localidade;
			var uf = oModel.uf;
			var ibge = oModel.ibge;
			var cep = oModel.cep;

			this.getView().byId("IdRua").setValue(rua);
			this.getView().byId("IdBairro").setValue(bairro);
			this.getView().byId("IdCidade").setValue(cidade);
			this.getView().byId("IdUF").setValue(uf);
			this.getView().byId("IdCodMunicipio").setValue(ibge);
			this.getView().byId("IdCEP").setValue(cep);

		},

		onSave: function () {
			var IdTipoEnd = this.getView().byId("IdTipoEnd").getSelectedKey();
			var IdCEP = this.getView().byId("IdCEP").getValue();
			var IdRua = this.getView().byId("IdRua").getValue();
			var IdNumero = this.getView().byId("IdNumero").getValue();
			var IdComplemento = this.getView().byId("IdComplemento").getValue();
			var IdBairro = this.getView().byId("IdBairro").getValue();
			var IdCidade = this.getView().byId("IdCidade").getValue();
			var IdUF = this.getView().byId("IdUF").getValue();
			var IdCodMunicipio = this.getView().byId("IdCodMunicipio").getValue();
			var dialog;
			var erro;
			var oModel = this.getView().getModel();
			var key;
			var oEntry = {};
			var erro2;
			var messagem;

			oEntry.Subty = IdTipoEnd;

			if (oEntry.Subty === "") {
				this.getView().byId("IdTipoEnd").setValueState("Error");
				sap.m.MessageBox.error("Informe o tipo de endereço");
				return;
			} else {
				this.getView().byId("IdTipoEnd").setValueState("Success");
			}

			oEntry.Cep = IdCEP;
			
			if (oEntry.Cep === "") {
				this.getView().byId("IdCEP").setValueState("Error");
				sap.m.MessageBox.error("Informe o CEP");
				return;
			} else {
				this.getView().byId("IdCEP").setValueState("Success");
			}
			
			
			oEntry.Rua = IdRua;
			oEntry.Numero = IdNumero;
			
			if (oEntry.Numero === "") {
				this.getView().byId("IdNumero").setValueState("Error");
				sap.m.MessageBox.error("Informe o numero do endereço");
				return;
			} else {
				this.getView().byId("IdNumero").setValueState("Success");
			}
			
			oEntry.Complemento = IdComplemento;
			oEntry.Bairro = IdBairro;
			oEntry.Cidade = IdCidade;
			oEntry.Uf = IdUF;
			oEntry.Ibge = IdCodMunicipio;

			key = "/ZET_GLHR_CAD_ENDERECOSet(ITipo='G',Pernr='0',Subty='" + IdTipoEnd + "')";

			dialog = new Dialog({
				title: "Confirma\xE7\xE3o",
				type: "Message",
				content: new Text({
					text: "Confirma a gravação de endereço?"
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

		}

	});

});