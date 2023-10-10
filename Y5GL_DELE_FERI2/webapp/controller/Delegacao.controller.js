sap.ui.define([
	"Y5GL_DELE_FERI2/Y5GL_DELE_FERI2/controller/BaseController",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text"
], function (BaseController, Dialog, Button, Text) {
	"use strict";

	return BaseController.extend("Y5GL_DELE_FERI2.Y5GL_DELE_FERI2.controller.Delegacao", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Y5GL_DELE_FERI2.Y5GL_DELE_FERI2.view.Delegacao
		 */
		onInit: function () {
			this.getRouter().getRoute("Delegacao").attachPatternMatched(this._onMasterMatched, this);
			this.getRouter().getRoute("DelegaTodos").attachPatternMatched(this.onMaterTodos, this);
		},

		_onMasterMatched: function (oItem) {

			this.getView().byId("FormElementNomeCompleto").setVisible(true);

			var Pernr = oItem.getParameter("arguments").Pernr;
			this.getView().byId("IdColaborador").setSelectedKey(Pernr);
			this.getView().byId("idGestor").setSelectedKey("");
			this.getView().byId("DtInicio").setValue("");
			this.getView().byId("DtFim").setValue("");

			var oControl = this.getView().byId("idGestor");
			oControl.bindItems({
				path: "/ZET_GESTORESSet",
				length: 900,
				template: new sap.ui.core.Item({
					key: "{Pernr}",
					text: "{NomeGestor}"
				})
			});

			//this.getView().getModel().setSizeLimit("999999");
		},

		onMaterTodos: function () {
			this.getView().byId("FormElementNomeCompleto").setVisible(false);
			var oControl = this.getView().byId("idGestor");
			oControl.bindItems({
				path: "/ZET_GESTORESSet",
				length: 900,
				template: new sap.ui.core.Item({
					key: "{Pernr}",
					text: "{NomeGestor}"
				})
			});
		},

		onBackMaster: function () {
			this.getRouter().navTo("master");
		},

		onSave: function () {
			var colaborador = this.getView().byId("IdColaborador").getSelectedKey();
			var gestor = this.getView().byId("idGestor").getSelectedKey();
			if (gestor === "") {
				this.getView().byId("idGestor").setValueState("Error");
				sap.m.MessageBox.error("Gestor não preenchido");
				return;
			}
			var dtInicio = this.getView().byId("DtInicio").getValue();
			if (dtInicio === "") {
				this.getView().byId("DtInicio").setValueState("Error");
				sap.m.MessageBox.error("Data de inicio não preenchido");
				return;
			}
			var dtFim = this.getView().byId("DtFim").getValue();
			if (dtFim === "") {
				this.getView().byId("DtFim").setValueState("Error");
				sap.m.MessageBox.error("Data Fi não preenchido");
				return;
			}
			var key = "/ZET_DELEG_FERIASSet(GestorDeleg='" + gestor + "',Empregado='" + colaborador + "')";
			var oEntry = {};
			var oModel = this.getView().getModel();
			var that = this;

			oEntry.DtInicio = dtInicio;
			oEntry.DtFim = dtFim;

			var dialog = new Dialog({
				title: "Confirmación",
				type: "Message",
				content: new Text({
					text: "¿Confirmar la delegación de vacaciones?"
				}),
				beginButton: new Button({
					text: "Sí",
					press: function () {
						oModel.update(key, oEntry, {
							success: function (oData, oResponse) {

								sap.m.MessageBox.success(
									"Delegación realizada", {
										actions: ["OK"],
										onClose: function (sAction) {
											that.getView().getModel().refresh(true);
											that.getView().byId("idGestor").setSelectedKey("");
											that.getView().byId("DtInicio").setValue("");
											that.getView().byId("DtFim").setValue("");
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

	});

});