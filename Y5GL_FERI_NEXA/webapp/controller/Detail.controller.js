sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/m/library",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text",
	"sap/m/Label",
	"sap/m/TextArea",
	"sap/m/CheckBox",
	"sap/m/Input"
], function (BaseController, JSONModel, formatter, mobileLibrary, Dialog, Button, Text, Label, TextArea, CheckBox, Input) {
	"use strict";

	// shortcut for sap.m.URLHelper
	var URLHelper = mobileLibrary.URLHelper;
	var g_Begda;
	var g_Endda;
	var data_inicio;
	var dias_gozo;
	var adiantamento;
	var adelanto;
	var sText;
	var Inicio;
	var DiasGozo;

	return BaseController.extend("Y5GL_FERI_NEXA.Y5GL_FERI_NEXA.controller.Detail", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0
			});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			this.setModel(oViewModel, "detailView");

			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onSendEmailPress: function () {
			var oViewModel = this.getModel("detailView");

			URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function () {
			var oViewModel = this.getModel("detailView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});

			oShareDialog.open();
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		/**
		 * Binds the view to the object path and expands the aggregated line items.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function (oEvent) {
			this.getView().byId("idPage").scrollTo(0, 0);

			var Pernr = oEvent.getParameter("arguments").Pernr;
			var a = oEvent.getParameter("arguments").Index;
			var S = oEvent.getParameter("arguments").Tipo;
			var Endda = oEvent.getParameter("arguments").Endda;
			var Begda = oEvent.getParameter("arguments").Begda;

			g_Begda = Begda;
			g_Endda = Endda;

			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then(function () {
				var e = this.getModel().createKey("ZET_GLHR_FERI_PERU_DETALHESet", {
					Endda: Endda,
					Begda: Begda,
					Pernr: Pernr
				});
				if (!e) {}
				this._bindView("/" + e);
			}.bind(this));
		},

		/**
		 * Binds the view to the object path. Makes sure that detail view displays
		 * a busy indicator while data for the corresponding element binding is loaded.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound to the view.
		 * @private
		 */
		_bindView: function (sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("detailView");

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
			var smartTable = this.getView().byId("LineItemsSmartTable");
			smartTable.rebindTable("e");
		},

		_onMetadataLoaded: function () {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("detailView");

			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);

			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		},

		/**
		 * Set the full screen mode to false and navigate to master page
		 */
		onCloseDetailPress: function () {
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
			// No item should be selected on master after detail page is closed
			this.getOwnerComponent().oListSelector.clearMasterListSelection();
			this.getRouter().navTo("master");
		},

		/**
		 * Toggle between full and non full screen mode.
		 */
		toggleFullScreen: function () {
			var bFullScreen = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
			if (!bFullScreen) {
				// store current layout and go full screen
				this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
				this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
			} else {
				// reset to previous layout
				this.getModel("appView").setProperty("/layout", this.getModel("appView").getProperty("/previousLayout"));
			}
		},

		formatterIcon: function (e) {
			var sRootPath = jQuery.sap.getModulePath("Y5GL_FERI_NEXA.Y5GL_FERI_NEXA");
			var sImagePath = sRootPath + "/Icones/";
			var icone;
			icone = sImagePath + "FERIAS_DET.png";
			return icone;
		},

		onAdiciona: function () {
			var table = this.getView().byId("FERIAS");
			var qtdLinhas = table.getVisibleRowCount();
			var newLinha = qtdLinhas + 1;

			table.setVisibleRowCount(newLinha);

		},

		onbeforeRebindTable: function (oEvent) {

			var Begda = g_Begda;
			var Endda = g_Endda;
			var Index = this.getView().byId("IdIndex").getValue();

			if (Begda) {

				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Begda",
					operator: "EQ",
					value1: Begda
				}));

			}

			if (Endda) {

				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Endda",
					operator: "EQ",
					value1: Endda
				}));

			}
		},

		ChangeDataInicio: function (oEvent) {

			data_inicio = "";
			var evento = oEvent;
			var valor = evento.getParameters().value;

			data_inicio = valor;

		},

		onChangeDiasGozo: function (oEvent) {

			dias_gozo = "";

			var evento = oEvent;
			var valor = evento.getParameters().value;

			dias_gozo = valor;

		},

		onGrava: function () {
			var oModel = this.getView().getModel();
			var key = "";
			var oEntry = {};
			var that = this;
			var count = this.getView().byId("FERIAS").getBinding("rows").getLength();
			count = count - 1;

			//oEntry.Inicio = data_inicio;
			oEntry.Inicio = this.getView().byId("FERIAS").getRows()[count].getCells()[1].getValue();

			//dias_gozo = parseInt(dias_gozo);
			//oEntry.DiasGozo = dias_gozo;
			oEntry.DiasGozo = parseInt(this.getView().byId("FERIAS").getRows()[count].getCells()[2].getValue());
			oEntry.Tipo = "G";
			if (this.getView().byId("FERIAS").getRows()[count].getCells()[5].getSelected() === true) {
				oEntry.Adiantamento = 'X'
			} else {
				oEntry.Adiantamento = '';
			}
			// if (adiantamento === true) {
			// 	oEntry.Adiantamento = "X";
			// } else {
			// 	oEntry.Adiantamento = "";
			// }

			key = "/ZET_GLHR_FERI_PERUSet(Pernr='0',Begda='" + g_Begda + "',Endda='" + g_Endda + "',Seqnr=0)";

			var dialog = new Dialog({
				title: "Confirmación",
				type: "Message",
				content: new Text({
					text: "¿Quieres enviar una solicitud de vacaciones?"
				}),
				beginButton: new Button({
					text: "Sí",
					press: function () {
						oModel.update(key, oEntry, {
							success: function (oData, oResponse) {

								sap.m.MessageBox.success(
									"Solicitud enviada con éxito", {
										actions: ["OK"],
										onClose: function (sAction) {
											that.getView().getModel().refresh(true);
											that.onCancel();
											//that.getRouter().navTo("BENEFICIOS");
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
										//that.getRouter().navTo("Master");
									}
								});

								//sap.m.MessageBox.error("Desculpe, não foi possível realizar sua solicitação, tente novamente em alguns instantes");
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

		FormatEditable: function (Valor) {
			if (Valor) {
				return false;
			} else {
				return true;
			}
		},

		AfterUpdate: function (oEvent) {
			var table2 = this.getView().byId("FERIAS");
			var count = this.getView().byId("FERIAS").getBinding("rows").getLength();
			table2.setVisibleRowCount(count);
		},

		onExclui: function () {
			var table = this.getView().byId("FERIAS");
			var selecionados = table.getSelectedIndices();
			var indice;
			var chave;
			var erro;
			var oEntry = {};
			var oModel = this.getView().getModel();
			var that = this;

			oEntry.Tipo = "E";

			if (selecionados.length === 0 || selecionados.length === "" || selecionados.length === undefined) {
				sap.m.MessageBox.error("Selecione o periodo a ser excluido.");
				return;
			} else {

				var dialog = new Dialog({
					title: "Confirmación",
					type: "Message",
					content: new Text({
						text: "¿Confirma las exclusiones de los períodos seleccionados?"
					}),
					beginButton: new Button({
						text: "Sim",
						press: function () {

							for (var i = 0; i < selecionados.length; i++) {
								indice = table.getContextByIndex([selecionados[i]]);
								chave = indice.sPath;
								oModel.update(chave, oEntry, {
									success: function (oData, oResponse) {
										sap.m.MessageBox.success("registro eliminado con éxito", {
											actions: ["OK", sap.m.MessageBox.Action.CLOSE],

											onClose: function (sAction) {
												that.getView().getModel().refresh(true);
												that.onCancel();
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
					}
				});
				dialog.open();
			}
		},

		onSelectedAdiant: function (oEvent) {
			selecionado = "";
			var selecionado = oEvent.getParameters().selected;

			adiantamento = selecionado;

		},

		FormatCheck: function (valor) {
			if (valor === "X") {
				return true;
			} else {
				return false;
			}

		},

		onEdita: function () {
			var table = this.getView().byId("FERIAS");
			var selecionados = table.getSelectedIndices();
			var indice;
			var chave;
			var erro;
			var oEntry = {};
			var oModel = this.getView().getModel();
			var that = this;

			var that = this;

			if (selecionados.length === 0 || selecionados.length === "" || selecionados.length === undefined) {
				sap.m.MessageBox.error("Seleccione un registro para editar.");
				return;
			} else {

				indice = table.getContextByIndex(selecionados);
				chave = indice.sPath;
				var dialog = "";
				dialog = new Dialog({
					title: "Periodo de edición",
					type: "Message",
					content: [
						new Label({
							text: "Inicio:",
							labelFor: "submitDialogTextarea"
						}),
						new Input("submitDialogTextarea", {
							liveChange: function (oEvent) {
								sText = oEvent.getParameter("value");
								Inicio = sText;
							},
							width: "100%",
							type: "Date"
						}),
						new Label({
							text: "Dias disfrute",
							labelFor: "idDiasDisfrute"
						}),
						new Input("idDiasDisfrute", {
							liveChange: function (oEvent) {
								sText = oEvent.getParameter("value");
								DiasGozo = sText;

								var parent = oEvent.getSource().getParent();
								parent.getBeginButton().setEnabled(sText.length > 0);
							},
							width: "100%",
						}),
						new CheckBox("IdAdelantoo", {
							text: "Adelanto",
							select: function (oEvent) {
								adelanto = oEvent.getParameter("selected");
							},
							width: "100%",
						})
					],
					beginButton: new Button({
						text: "Grabar",
						enabled: false,
						press: function () {

							DiasGozo = parseInt(DiasGozo);

							oEntry.Inicio = Inicio;
							oEntry.DiasGozo = DiasGozo;
							oEntry.Tipo = "D";
							if (adelanto === true) {
								oEntry.Adiantamento = 'X';
							} else {
								oEntry.Adiantamento = '';
							}
							adelanto = '';

							oModel.update(chave, oEntry, {
								success: function (oData, oResponse) {

									sap.m.MessageBox.success(
										"Solicitud enviada con éxito", {
											actions: ["OK"],
											onClose: function (sAction) {
												that.getView().getModel().refresh(true);
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
			}
		}

	});

});