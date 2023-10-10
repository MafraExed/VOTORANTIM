sap.ui.define([
	"Y5GL_CADASTRO/Y5GL_CADASTRO/controller/BaseController",
	"sap/ui/Device",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text"
], function (BaseController, Device, Dialog, Button, Text) {
	"use strict";

	return BaseController.extend("Y5GL_CADASTRO.Y5GL_CADASTRO.controller.FORMACAO_DETAIL", {

		onInit: function () {

		},

		onVoltar: function () {
			var bReplace = !Device.system.phone;
			this.getRouter().navTo("FORMACAO", bReplace);
		},

		onBackMaster: function () {
			this.getRouter().navTo("master");
		},

		onSave: function () {
			var dialog;
			var that = this;
			var oModel = this.getView().getModel();
			var oEntry = {};
			var Pernr = "0";
			var Objps = "0";
			var Key = "/ZET_GLHR_FORM_EMP_ECSet(Pernr='" + Pernr + "',Objps='" + Objps + "')";

			oEntry.Slart = this.getView().byId("IdEstEnsino").getSelectedKey();
			if (oEntry.Slart === "") {
				this.getView().byId("IdEstEnsino").setValueState("Error");
				sap.m.MessageBox.error("Por favor, informe o tipo de Estabelecimento de Ensino.");
				return;
			} else {
				this.getView().byId("IdEstEnsino").setValueState("Success");
			}
			
			oEntry.Insti = this.getView().byId("IdInstituicao").getValue();
			
			if (oEntry.Insti === ""){
				this.getView().byId("IdInstituicao").setValueState("Error");
				sap.m.MessageBox.error("Por favor, informe a instituiÃ§Ã£o de ensino.");
				return;
			}else{
				this.getView().byId("IdInstituicao").setValueState("Success");
			}
			
			oEntry.Sland = this.getView().byId("IdPais").getSelectedKey();
			
			if (oEntry.Sland === ""){
				this.getView().byId("IdPais").setValueState("Error");
				sap.m.MessageBox.error("Por favor, selecione o Pais.");
				return;
			}else{
				this.getView().byId("IdPais").setValueState("Success");
			}
			
			oEntry.Slabs = this.getView().byId("IdCertificado").getSelectedKey();
			
			if (oEntry.Slabs === ""){
				this.getView().byId("IdCertificado").setValueState("Error");
				sap.m.MessageBox.error("Por favor, informe se a formaÃ§Ã£o contem Certificado.");
				return;
			}else{
				this.getView().byId("IdCertificado").setValueState("Success");
			}
			
			oEntry.Anzkl = this.getView().byId("IdDuracao").getValue();
			if (oEntry.Anzkl === ""){
				this.getView().byId("IdDuracao").setValueState("Error");
				sap.m.MessageBox.error("Por favor, informe duraÃ§Ã£o.");
				return;
			}else{
				this.getView().byId("IdDuracao").setValueState("Success");
			}
			
			oEntry.Anzeh = this.getView().byId("IdTpDuracao").getSelectedKey();
			
			if (oEntry.Anzeh === ""){
				this.getView().byId("IdTpDuracao").setValueState("Error");
				sap.m.MessageBox.error("Por favor, informe unidade de tempo.");
				return;
			}else{
				this.getView().byId("IdTpDuracao").setValueState("Success");
			}
			
			oEntry.Ksbez = this.getView().byId("IdDenCurso").getValue();
			
			if (oEntry.Ksbez === ""){
				this.getView().byId("IdDenCurso").setValueState("Error");
				sap.m.MessageBox.error("Por favor, denominaÃ§Ã£o do curso.");
				return;
			}else{
				this.getView().byId("IdDenCurso").setValueState("Success");
			}
			
			oEntry.ZenddaForm = this.getView().byId("IdDtFimForm").getValue();
			
			if (oEntry.ZenddaForm === ""){
				this.getView().byId("IdDtFimForm").setValueState("Error");
				sap.m.MessageBox.error("Por favor, data fim da formaÃ§Ã£o.");
				return;
			}else{
				this.getView().byId("IdDtFimForm").setValueState("Success");
			}
			
			dialog = new Dialog({
				title: "Confirma\xE7\xE3o",
				type: "Message",
				content: new Text({
					text: "Confirma a inclusÃ£o do benefÃ­cio?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(Key, oEntry, {
							success: function (oData, oResponse) {
								sap.m.MessageBox.success("formaÃ§Ã£o educacional salva com sucesso.", {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function (sAction) {
										that.getRouter().navTo("FORMACAO");
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
		}

	});

});