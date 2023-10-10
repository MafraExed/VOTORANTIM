sap.ui.define([
	"Y5GL_APROVB/Y5GL_APROVB/controller/BaseController",
	"sap/ui/Device",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text"
], function (BaseController, Device, Dialog, Button, Text) {
	"use strict";

	return BaseController.extend("Y5GL_APROVB.Y5GL_APROVB.controller.FORMACAO_DETAIL", {

		onInit: function () {
			this.getRouter().getRoute("FORMACAO_ADD").attachPatternMatched(this._onObjectMatched, this);
			this.getRouter().getRoute("FORMACAO_DETAIL").attachPatternMatched(this._onDetail, this);
		},

		onVoltar: function () {
			var bReplace = !Device.system.phone;
			this.getRouter().navTo("FORMACAO", bReplace);
		},

		onBackMaster: function () {
			this.getRouter().navTo("master");
		},

		_onObjectMatched: function (oEvent) {
			var Pernr = oEvent.getParameter("arguments").Pernr;
			var Objps = oEvent.getParameter("arguments").Objps;

			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("ZET_GLHR_FORM_EMP_ECSet", {
					Pernr: Pernr,
					Objps: Objps
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
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

		_onBindingChange: function () {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();
			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}

			

		},

		_onDetail: function () {
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

			if (oEntry.Insti === "") {
				this.getView().byId("IdInstituicao").setValueState("Error");
				sap.m.MessageBox.error("Por favor, informe a instituição de ensino.");
				return;
			} else {
				this.getView().byId("IdInstituicao").setValueState("Success");
			}

			oEntry.Sland = this.getView().byId("IdPais").getSelectedKey();

			if (oEntry.Sland === "") {
				this.getView().byId("IdPais").setValueState("Error");
				sap.m.MessageBox.error("Por favor, selecione o Pais.");
				return;
			} else {
				this.getView().byId("IdPais").setValueState("Success");
			}

			oEntry.Slabs = this.getView().byId("IdCertificado").getSelectedKey();

			if (oEntry.Slabs === "") {
				this.getView().byId("IdCertificado").setValueState("Error");
				sap.m.MessageBox.error("Por favor, informe se a formação contem Certificado.");
				return;
			} else {
				this.getView().byId("IdCertificado").setValueState("Success");
			}

			oEntry.Anzkl = this.getView().byId("IdDuracao").getValue();
			if (oEntry.Anzkl === "") {
				this.getView().byId("IdDuracao").setValueState("Error");
				sap.m.MessageBox.error("Por favor, informe duração.");
				return;
			} else {
				this.getView().byId("IdDuracao").setValueState("Success");
			}

			oEntry.Anzeh = this.getView().byId("IdTpDuracao").getSelectedKey();

			if (oEntry.Anzeh === "") {
				this.getView().byId("IdTpDuracao").setValueState("Error");
				sap.m.MessageBox.error("Por favor, informe unidade de tempo.");
				return;
			} else {
				this.getView().byId("IdTpDuracao").setValueState("Success");
			}

			oEntry.Ksbez = this.getView().byId("IdDenCurso").getValue();

			if (oEntry.Ksbez === "") {
				this.getView().byId("IdDenCurso").setValueState("Error");
				sap.m.MessageBox.error("Por favor, denominação do curso.");
				return;
			} else {
				this.getView().byId("IdDenCurso").setValueState("Success");
			}

			oEntry.ZenddaForm = this.getView().byId("IdDtFimForm").getValue();

			if (oEntry.ZenddaForm === "") {
				this.getView().byId("IdDtFimForm").setValueState("Error");
				sap.m.MessageBox.error("Por favor, data fim da formação.");
				return;
			} else {
				this.getView().byId("IdDtFimForm").setValueState("Success");
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
								sap.m.MessageBox.success("formação educacional salva com sucesso.", {
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