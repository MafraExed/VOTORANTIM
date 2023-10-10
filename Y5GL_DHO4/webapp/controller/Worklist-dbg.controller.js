999999/*global location history */
sap.ui.define([
	"Y5GL_DHO4/Y5GL_DHO4/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"Y5GL_DHO4/Y5GL_DHO4/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text"
], function (BaseController, JSONModel, History, formatter, Filter, FilterOperator, Dialog, Button, Text) {
	"use strict";

	return BaseController.extend("Y5GL_DHO4.Y5GL_DHO4.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {},

		onPress: function (oEvent) {
			var Evento = oEvent.getSource();
			var ROTA = "";
			var IdApp = Evento.getBindingContext().getProperty("DescricaoApp");
			var Pernr = "";
			var Subty;
			var Status = Evento.getBindingContext().getProperty("Status");
			var Chamado = Evento.getBindingContext().getProperty("Chamado");

			switch (IdApp) {
			case "Beneficios":
				ROTA = "BENEFICIOS_DETAIL";
				var Beneficio = Evento.getBindingContext().getProperty("Beneficio");
				Pernr = Evento.getBindingContext().getProperty("Pernr");

				this.getRouter().navTo(ROTA, {
					Beneficio: Beneficio,
					Chamado: Chamado,
					Pernr: Pernr
				});
				break;
			case "Datos personales":
				ROTA = "DADOS_PESSOAIS";
				Pernr = Evento.getBindingContext().getProperty("Pernr");

				this.getRouter().navTo(ROTA, {
					Pernr: Pernr,
					Chamado: Chamado
				});
				break;
			case "Dependientes":
				ROTA = "DependenteDetail";
				Pernr = Evento.getBindingContext().getProperty("Pernr");
				Subty = Evento.getBindingContext().getProperty("Subty");
				var Tipo = "V";
				var Objps = Evento.getBindingContext().getProperty("Objps");
				if (Objps === "") {
					Objps = "00";
				}
				var Favor = Evento.getBindingContext().getProperty("Favor");
				var Icnum = Evento.getBindingContext().getProperty("Icnum");

				if (Icnum === "") {
					Icnum = " ";
				}

				this.getRouter().navTo(ROTA, {
					Pernr: Pernr,
					Subty: Subty,
					Tipo: Tipo,
					Objps: Objps,
					Favor: Favor,
					Icnum: Icnum,
					Chamado: Chamado
				});
				break;
			case "Documentos":
				ROTA = "Documentos_Detail";
				Pernr = Evento.getBindingContext().getProperty("Pernr");
				Tipo = "V";
				Subty = Evento.getBindingContext().getProperty("Subty");

				this.getRouter().navTo(ROTA, {
					Pernr: Pernr,
					Tipo: Tipo,
					Subty: Subty,
					Chamado: Chamado
				});
				break;
			case "Formación":
				ROTA = "FORMACAO_DETAIL";
				Pernr = Evento.getBindingContext().getProperty("Pernr");
				var Slart = Evento.getBindingContext().getProperty("Subty");
				this.getRouter().navTo(ROTA, {
					Pernr: Pernr,
					Slart: Slart,
					Chamado: Chamado
				});
				break;
			}
		},

		onAtualiza: function () {
			var smartTable = this.getView().byId("smartTable");
			smartTable.rebindTable("e");
		},

		onEnvia: function (oEvent) {
			var table = this.getView().byId("table");
			var selecionados = table.getSelectedContextPaths();

			if (selecionados.length < 1) {
				sap.m.MessageBox.error("Selecione um chamado para enviar para o operador");
				return;
			}

			// create value help dialog
			if (!this._valueHelpDialog1) {
				this._valueHelpDialog1 = sap.ui.xmlfragment("Y5GL_DHO4.Y5GL_DHO4.view.Operador", this);
				this.getView().addDependent(this._valueHelpDialog1);
			}
			this._valueHelpDialog1.open();
			// open value help dialog filtered by the input value
		},

		onSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oBinding = oEvent.getSource().getBinding("items");
			var oFilter = new Filter("Pernr", FilterOperator.Contains, sValue);
			oBinding.filter([oFilter]);
		},

		onConfirmOperador: function (oEvent) {
			var Planejador = oEvent.getParameter("selectedItem").getTitle();

			var oModel = this.getView().getModel();
			var Key;
			var oEntry = {};
			var table = this.getView().byId("table");
			var selecionados = table.getSelectedContextPaths();
			var erro;
			var smartTable = this.getView().byId("smartTable");

			var dialog = new Dialog({
				title: "Confirma\xE7\xE3o",
				type: "Message",
				content: new Text({
					text: "Confirma o envio das solicitações para o operador selecionado?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {

						for (var i = 0; i < selecionados.length; i++) {

							Key = selecionados[i];

							oEntry.Planejador = Planejador;
							oModel.update(Key, oEntry, {
								success: function (oData, oResponse) {},
								error: function (oError) {
									erro = oError;
								}
							});
						}
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
					if (erro) {
						erro = erro.responseText;
						var erro2 = JSON.parse(erro);
						var messagem = erro2.error.message.value;
						sap.m.MessageBox.error(messagem);
						return;
					} else {
						sap.m.MessageBox.success("Enviado ao programador com sucesso", {
							actions: ["OK", sap.m.MessageBox.Action.CLOSE],
							onClose: function (sAction) {
								smartTable.rebindTable("e");
							}
						});

					}
				}
			});
			dialog.open();
		},

		onHelpChamado: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog1) {
				this._valueHelpDialog1 = sap.ui.xmlfragment("Y5GL_DHO4.Y5GL_DHO4.view.Chamado", this);
				this.getView().addDependent(this._valueHelpDialog1);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog1.open(sInputValue);
		},

		onHelpMatriculas: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog2) {
				this._valueHelpDialog2 = sap.ui.xmlfragment("Y5GL_DHO4.Y5GL_DHO4.view.Pernr", this);
				this.getView().addDependent(this._valueHelpDialog2);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog2.open(sInputValue);
		},

		onHelpProcesso: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog3) {
				this._valueHelpDialog3 = sap.ui.xmlfragment("Y5GL_DHO4.Y5GL_DHO4.view.Processo", this);
				this.getView().addDependent(this._valueHelpDialog3);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog3.open(sInputValue);
		},

		onHelpStatus: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog4) {
				this._valueHelpDialog4 = sap.ui.xmlfragment("Y5GL_DHO4.Y5GL_DHO4.view.Status", this);
				this.getView().addDependent(this._valueHelpDialog4);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog4.open(sInputValue);
		},

		onHelpDtCriacao: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog5) {
				this._valueHelpDialog5 = sap.ui.xmlfragment("Y5GL_DHO4.Y5GL_DHO4.view.DtCriacao", this);
				this.getView().addDependent(this._valueHelpDialog5);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog5.open(sInputValue);
		},

		onSearchChamado: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			if (!sValue) {
				sValue = " ";
			}
			sValue = sValue.toUpperCase();
			var sFilter = sValue;
			var oFilter = new sap.ui.model.Filter("Chamado", sap.ui.model.FilterOperator.Contains, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		onSearchMatricula: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			if (!sValue) {
				sValue = " ";
			}
			sValue = sValue.toUpperCase();
			var sFilter = sValue;
			var oFilter = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.Contains, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		onSearchProcesso: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			if (!sValue) {
				sValue = " ";
			}
			sValue = sValue.toUpperCase();
			var sFilter = sValue;
			var oFilter = new sap.ui.model.Filter("IdApp", sap.ui.model.FilterOperator.Contains, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		onSearchStatus: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			if (!sValue) {
				sValue = " ";
			}
			sValue = sValue.toUpperCase();
			var sFilter = sValue;
			var oFilter = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.Contains, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		ConfirmaChamado: function (evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			this._valueHelpDialog1 = null;

			if (oSelectedItem) {
				var productInput = this.getView().byId("foo0");
				productInput.setValue(oSelectedItem.getTitle());
			}
		},

		ConfirmaMatricula: function (evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			this._valueHelpDialog1 = null;

			if (oSelectedItem) {
				var productInput = this.getView().byId("foo1");
				productInput.setValue(oSelectedItem.getTitle());
			}
		},

		ConfirmaProcesso: function (evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			this._valueHelpDialog1 = null;

			if (oSelectedItem) {
				var productInput = this.getView().byId("foo2");
				productInput.setValue(oSelectedItem.getTitle());
			}
		},
		ConfirmaStatus: function (evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			this._valueHelpDialog1 = null;

			if (oSelectedItem) {
				var productInput = this.getView().byId("foo3");
				productInput.setValue(oSelectedItem.getTitle());
			}
		},

		ChangeChamado: function (oEvent) {
			var st = this.getView().byId("smartTable");
			st.rebindTable("e");
		},

		onbeforeRebindTable: function (oEvent) {

			var Chamado = this.getView().byId("foo0").getValue();
			var Pernr = this.getView().byId("foo1").getValue();
			var IdApp = this.getView().byId("foo2").getValue();
			var Status = this.getView().byId("foo3").getValue();
			var DataCriacao = this.getView().byId("DataCriacao").getValue();

			if (Chamado !== "") {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Chamado",
					operator: "EQ",
					value1: Chamado
				}));
			}

			if (Pernr !== "") {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Pernr",
					operator: "EQ",
					value1: Pernr
				}));
			}

			if (IdApp !== "") {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "IdApp",
					operator: "EQ",
					value1: IdApp
				}));
			}

			if (Status !== "") {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Status",
					operator: "EQ",
					value1: Status
				}));
			}

			if (DataCriacao !== "") {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "DataCriacao",
					operator: "EQ",
					value1: DataCriacao
				}));
			}
		},

		AfterUpdate: function (oEvent) {
			var oModeltable = this.getView().byId("table").getModel();
			oModeltable.setSizeLimit("999999");
		}
	});
});