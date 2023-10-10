sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text",
	"sap/m/Label",
	"sap/m/TextArea",
	'sap/m/ButtonType'
], function (Controller, Dialog, Button, Text, Label, TextArea, ButtonType) {
	"use strict";

	return Controller.extend("Y5GL_REL_FERI.Y5GL_REL_FERI.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 //* @returns {sap.ui.core.routing.Router} the router for this component
		 */

		loading: function (bollean) {
			if (bollean === false) {
				this.getView().byId("idGif").addStyleClass("LoadingFalse");
			} else {
				this.getView().byId("idGif").removeStyleClass("LoadingFalse");
			}
		},
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		adicionarponto: function (nStr) {
			var x;
			var x1;
			var x2;
			var x3;

			nStr += "";
			x = nStr.split(".");
			x1 = x[0];
			x2 = x.length > 1 ? "." + x[1] : "";
			var rgx = /(\d+)(\d{3})/;

			while (rgx.test(x1)) {
				x1 = x1.replace(rgx, "$1" + "." + "$2");
			}

			x3 = x1 + x2;
			x3 = x3.trim();
			return x3;
		},

		adicionarpontoFloat: function (nStr) {
			var x;
			var x1;
			var x2;
			var x3;

			nStr += "";
			x = nStr.split(".");
			x1 = x[0];
			x2 = x.length > 1 ? "." + x[1] : "";
			var rgx = /(\d+)(\d{3})/;

			while (rgx.test(x1)) {
				x1 = x1.replace(rgx, "$1" + "." + "$2");
			}

			x3 = x1 + x2;
			return x3;
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onShareEmailPress: function () {
			var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
			sap.m.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},

		Aprova: function () {
			var that = this;
			var chamado = this.getView().byId("idChamado").getValue();
			var tipo = "D";
			var Key = "/ZET_GLHR_EC_PROCESSARSet(Chamado='" + chamado + "')";
			var oModel = this.getView().getModel();
			var oEntry = {};
			oEntry.Tipo = tipo;

			var dialog = new Dialog({
				title: "Confirma\xE7\xE3o",
				type: "Message",
				content: new Text({
					text: "Confirma a efetivação da solicitação?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(Key, oEntry, {
							success: function (oData, oResponse) {
								sap.m.MessageBox.success("Solicitação efetivada", {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function (sAction) {
										that.getView().getModel().refresh(true);
										that.getRouter().navTo("worklist");
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

		Reprova: function () {
			var that = this;
			var oModel = this.getView().getModel();
			var chamado = this.getView().byId("idChamado").getValue();
			var tipo = "R";
			var Key = "/ZET_GLHR_EC_PROCESSARSet(Chamado='" + chamado + "')";
			var oEntry = {};
			oEntry.Tipo = tipo;
			var sText;

			var dialog = "";
			dialog = new Dialog({
				title: "Motivo de Reprovação",
				type: "Message",
				content: [
					new Label({
						text: "Descreva o motivo de reprovação.",
						labelFor: "submitDialogTextarea"
					}),
					new TextArea("submitDialogTextarea", {
						liveChange: function (oEvent) {
							sText = oEvent.getParameter("value");
							oEntry.Motivo = sText;
						},
						width: "100%",
						rows: 10,
						placeholder: "Digite aqui."
					})
				],
				beginButton: new Button({
					type: ButtonType.Emphasized,
					text: "Ok",
					press: function () {
						if (oEntry.Motivo === undefined) {
							sap.m.MessageBox.error("Motivo não preenchida");
							return;
						} else {
							dialog.close();
							oModel.update(Key, oEntry, {
								success: function (oData, oResponse) {
									sap.m.MessageBox.success("Solicitação Reprovada", {
										actions: ["OK", sap.m.MessageBox.Action.CLOSE],
										onClose: function (sAction) {
											that.getView().getModel().refresh(true);
											that.getRouter().navTo("worklist");
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
											that.getRouter().navTo("worklist");
										}
									});
									return;
								}
							});
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
		},

		formatValueState: function (oValue) {
			if (oValue === "X") {
				return "Error";
			} else {
				return "None";
			}
		},

	});

});