/*global location */
sap.ui.define([
	"ZVCRH_FERIAS_GESTOR/ZVCRH_FERIAS_GESTOR/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ZVCRH_FERIAS_GESTOR/ZVCRH_FERIAS_GESTOR/model/formatter",
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/m/Text',
	'sap/ui/core/Fragment'

], function(BaseController, JSONModel, formatter, Dialog, Button, Text, Fragment) {
	"use strict";

	return BaseController.extend("ZVCRH_FERIAS_GESTOR.ZVCRH_FERIAS_GESTOR.controller.Detail2", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function() {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0
			});

			this.getRouter().getRoute("object2").attachPatternMatched(this._onObjectMatched, this);

			this.setModel(oViewModel, "detailView");

			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},

		onAfterRendering: function(evt) {

		},

		FormatChecked: function(value) {
			if (value === 'S') {

				return true;

			} else {

				return false;

			}

		},

		FormatChecked2: function(value) {
			if (value === 'S') {

				return true;

			} else {

				return false;

			}

		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onSendEmailPress: function() {
			var oViewModel = this.getModel("detailView");

			sap.m.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},

		onAprov: function() {

			//check
			var status = this.getView().byId('IdStatus').getText();

			if (status === "Aprovado" || status === "Homologado" || status === "Efetivado" || status === "Férias Realizadas") {
				sap.m.MessageToast.show("Férias já aprovadas, não é possível Aprovar!");
				return;
			}

			var vthat = this;
			var _oComponent = this.getOwnerComponent();
			var oList = _oComponent.oListSelector._oList;
			var oListBinding = oList.getBinding("items");
			var oModel = this.getView().getModel();
			var Begda = this.getView().byId("IdBegda").getValue();
			var Endda = this.getView().byId("IdEndda").getValue();
			var Pernr = this.getView().byId("IdPernr").getValue();
			var Seqnr = this.getView().byId("IdSeqnr").getValue();
			var Key = "/ZET_VCHR_MSS_APROVAR(Begda='" + Begda + "',Endda='" + Endda + "',Pernr='" + Pernr + "',Seqnr='" + Seqnr + "')";
			var oEntry = {};
			oEntry.Begda = this.getView().byId("IdBegda").getValue();
			oEntry.Endda = this.getView().byId("IdEndda").getValue();
			oEntry.Pernr = this.getView().byId("IdPernr").getValue();
			oEntry.Seqnr = this.getView().byId("IdSeqnr").getValue();
			oEntry.Begfe = this.getView().byId("IdBegfe").getValue();
			oEntry.DiasGozo = this.getView().byId("IdDiasGo").getValue();
			oEntry.Endfe = this.getView().byId("IdEndfe").getValue();

			if (this.getView().byId("IdPg131").getSelected() === true) {
				oEntry.Pg131 = "X";
			} else {
				oEntry.Pg131 = "";
			}

			if (this.getView().byId("IdAbono").getSelected() === true) {
				oEntry.Abono = "X";
			} else {
				oEntry.Abono = "";
			}

			//oEntry.Status = this.getView().byId("IdStatus").getValue();
			oEntry.Msg = this.getView().byId("IdMsg").getValue();
			oEntry.DiasAbono = this.getView().byId("IdDiasAb").getValue();
			oEntry.CodStatus = this.getView().byId("IdCodStts").getValue();

			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: "Confirma aprovação de férias?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function() {
						oModel.update(Key, oEntry, {
							success: function(oData, oResponse) {

								var hdrMessage = oResponse.headers["sap-message"];

								if (hdrMessage == "" || hdrMessage == null) {
									//sap.m.MessageBox.show("Férias programadas com Sucesso!");
									sap.m.MessageToast.show("Férias aprovadas com Sucesso!");
									vthat.getRouter().navTo("master");
									location.reload(true);
									return;

								}

								var hdrMessageObject = JSON.parse(hdrMessage);
								var length = hdrMessageObject.details.length;
								var i = 0;
								var sTexto;

								sap.m.MessageBox.alert(hdrMessageObject.message, {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function(sAction) {
										vthat.getRouter().navTo("master");
										location.reload(true);
									}

								});
							},

						});
						dialog.close();
					}
				}),
				endButton: new Button({
					text: "Não",
					press: function() {
						dialog.close();
						vthat.getRouter().navTo("master");
						location.reload(true);
					}
				}),
				afterClose: function() {
					//	dialog.destroy();
					//	oListBinding.refresh(true
					vthat.getRouter().navTo("master");
					//this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
				}
			});
			dialog.open();
			//this.getRouter().navTo("master");
		},
		onReprov: function() {

			//check
			var status = this.getView().byId('IdStatus').getText();

			if (status === "Homologado" || status === "Efetivado" || status === "Férias Realizadas") {
				sap.m.MessageToast.show("Férias já aprovadas, não é possível Reprovar!");
				return;
			}

			var vthat = this;
			var _oComponent = this.getOwnerComponent();
			var oList = _oComponent.oListSelector._oList;
			var oListBinding = oList.getBinding("items");
			var oModel = this.getView().getModel();
			var Begda = this.getView().byId("IdBegda").getValue();
			var Endda = this.getView().byId("IdEndda").getValue();
			var Pernr = this.getView().byId("IdPernr").getValue();
			var Seqnr = this.getView().byId("IdSeqnr").getValue();
			var Key = "/ZET_VCHR_MSS_REPROVAR(Begda='" + Begda + "',Endda='" + Endda + "',Pernr='" + Pernr + "',Seqnr='" + Seqnr + "')";
			var oEntry = {};
			oEntry.Begda = this.getView().byId("IdBegda").getValue();
			oEntry.Endda = this.getView().byId("IdEndda").getValue();
			oEntry.Pernr = this.getView().byId("IdPernr").getValue();
			oEntry.Seqnr = this.getView().byId("IdSeqnr").getValue();
			oEntry.Begfe = this.getView().byId("IdBegfe").getValue();
			oEntry.DiasGozo = this.getView().byId("IdDiasGo").getValue();
			oEntry.Endfe = this.getView().byId("IdEndfe").getValue();

			if (this.getView().byId("IdPg131").getSelected() === true) {
				oEntry.Pg131 = "X";
			} else {
				oEntry.Pg131 = "";
			}

			if (this.getView().byId("IdAbono").getSelected() === true) {
				oEntry.Abono = "X";
			} else {
				oEntry.Abono = "";
			}

			//oEntry.Status = this.getView().byId("IdStatus").getValue();
			oEntry.Msg = this.getView().byId("IdMsg").getValue();
			oEntry.DiasAbono = this.getView().byId("IdDiasAb").getValue();
			oEntry.CodStatus = this.getView().byId("IdCodStts").getValue();

			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: "Confirma reprovação de férias?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function() {
						oModel.update(Key, oEntry, {
							success: function(oData, oResponse) {

								var hdrMessage = oResponse.headers["sap-message"];

								if (hdrMessage == "" || hdrMessage == null) {
									//sap.m.MessageBox.show("Férias programadas com Sucesso!");
									sap.m.MessageToast.show("Férias reprovadas com Sucesso!");
									vthat.getRouter().navTo("master");
									location.reload(true);
									return;

								}

								var hdrMessageObject = JSON.parse(hdrMessage);
								var length = hdrMessageObject.details.length;
								var i = 0;
								var sTexto;

								sap.m.MessageBox.alert(hdrMessageObject.message, {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function(sAction) {
										vthat.getRouter().navTo("master");
										location.reload(true);
									}

								});
							},

						});
						dialog.close();
					}
				}),
				endButton: new Button({
					text: "Não",
					press: function() {
						dialog.close();
						vthat.getRouter().navTo("master");
						location.reload(true);
					}
				}),
				afterClose: function() {
					//	dialog.destroy();
					//	oListBinding.refresh(true
					vthat.getRouter().navTo("master");
					//this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
				}
			});
			dialog.open();
			//this.getRouter().navTo("master");

		},

		onAlter: function() {

			//check
			var status = this.getView().byId('IdStatus').getText();

			if (status === "Homologado" || status === "Efetivado" || status === "Férias Realizadas") {
				sap.m.MessageToast.show("Férias já aprovadas, não é possível alterar!");
				return;
			}

			var vthat = this;
			var _oComponent = this.getOwnerComponent();
			var oList = _oComponent.oListSelector._oList;
			var oListBinding = oList.getBinding("items");
			var oModel = this.getView().getModel();
			var Begda = this.getView().byId("IdBegda").getValue();
			var Endda = this.getView().byId("IdEndda").getValue();
			var Pernr = this.getView().byId("IdPernr").getValue();
			var Seqnr = this.getView().byId("IdSeqnr").getValue();
			var Key = "/ZET_VCHR_MSS_ALTERAR(Begda='" + Begda + "',Endda='" + Endda + "',Pernr='" + Pernr + "',Seqnr='" + Seqnr + "')";
			var oEntry = {};
			oEntry.Begda = this.getView().byId("IdBegda").getValue();
			oEntry.Endda = this.getView().byId("IdEndda").getValue();
			oEntry.Pernr = this.getView().byId("IdPernr").getValue();
			oEntry.Seqnr = this.getView().byId("IdSeqnr").getValue();
			oEntry.Begfe = this.getView().byId("IdBegfe").getValue();
			oEntry.DiasGozo = this.getView().byId("IdDiasGo").getValue();
			oEntry.Endfe = this.getView().byId("IdEndfe").getValue();

			if (this.getView().byId("IdPg131").getSelected() === true) {
				oEntry.Pg131 = "X";
			} else {
				oEntry.Pg131 = "";
			}

			if (this.getView().byId("IdAbono").getSelected() === true) {
				oEntry.Abono = "X";
			} else {
				oEntry.Abono = "";
			}

			//oEntry.Status = this.getView().byId("IdStatus").getValue();
			oEntry.Msg = this.getView().byId("IdMsg").getValue();
			oEntry.DiasAbono = this.getView().byId("IdDiasAb").getValue();
			oEntry.CodStatus = this.getView().byId("IdCodStts").getValue();

			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: "Confirma alteração de férias?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function() {
						oModel.update(Key, oEntry, {
							success: function(oData, oResponse) {

								var hdrMessage = oResponse.headers["sap-message"];

								if (hdrMessage == "" || hdrMessage == null) {
									//sap.m.MessageBox.show("Férias programadas com Sucesso!");
									sap.m.MessageToast.show("Férias alteradas com Sucesso!");
									vthat.getRouter().navTo("master");
									location.reload(true);
									return;

								}

								var hdrMessageObject = JSON.parse(hdrMessage);
								var length = hdrMessageObject.details.length;
								var i = 0;
								var sTexto;

								sap.m.MessageBox.alert(hdrMessageObject.message, {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function(sAction) {
										vthat.getRouter().navTo("master");
										location.reload(true);
									}

								});
							},

						});
						dialog.close();
					}
				}),
				endButton: new Button({
					text: "Não",
					press: function() {
						dialog.close();
						vthat.getRouter().navTo("master");
						location.reload(true);
					}
				}),
				afterClose: function() {
					//	dialog.destroy();
					//	oListBinding.refresh(true
					vthat.getRouter().navTo("master");
					//this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
				}
			});
			dialog.open();
			//this.getRouter().navTo("master");

		},
		onProgram: function() {

			//check
			var status = this.getView().byId('IdStatus').getText();

			if (status === "Aprovado" || status === "Homologado" || status === "Efetivado" || status === "Férias Realizadas") {
				sap.m.MessageToast.show("Férias já aprovadas, não é possível programar!");
				return;
			}

			var vthat = this;
			var _oComponent = this.getOwnerComponent();
			var oList = _oComponent.oListSelector._oList;
			var oListBinding = oList.getBinding("items");
			var oModel = this.getView().getModel();
			var Begda = this.getView().byId("IdBegda").getValue();
			var Endda = this.getView().byId("IdEndda").getValue();
			var Pernr = this.getView().byId("IdPernr").getValue();
			var Seqnr = this.getView().byId("IdSeqnr").getValue();
			var Key = "/ZET_VCHR_MSS_PROGRAMAR(Begda='" + Begda + "',Endda='" + Endda + "',Pernr='" + Pernr + "',Seqnr='" + Seqnr + "')";
			var oEntry = {};
			oEntry.Begda = this.getView().byId("IdBegda").getValue();
			oEntry.Endda = this.getView().byId("IdEndda").getValue();
			oEntry.Pernr = this.getView().byId("IdPernr").getValue();
			oEntry.Seqnr = this.getView().byId("IdSeqnr").getValue();
			oEntry.Begfe = this.getView().byId("IdBegfe").getValue();
			oEntry.DiasGozo = this.getView().byId("IdDiasGo").getValue();
			oEntry.Endfe = this.getView().byId("IdEndfe").getValue();

			if (this.getView().byId("IdPg131").getSelected() === true) {
				oEntry.Pg131 = "X";
			} else {
				oEntry.Pg131 = "";
			}

			if (this.getView().byId("IdAbono").getSelected() === true) {
				oEntry.Abono = "X";
			} else {
				oEntry.Abono = "";
			}

			//oEntry.Status = this.getView().byId("IdStatus").getValue();
			oEntry.Msg = this.getView().byId("IdMsg").getValue();
			oEntry.DiasAbono = this.getView().byId("IdDiasAb").getValue();
			oEntry.CodStatus = this.getView().byId("IdCodStts").getValue();

			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: "Confirma programação de férias?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function() {
						oModel.update(Key, oEntry, {
							success: function(oData, oResponse) {

								var hdrMessage = oResponse.headers["sap-message"];

								if (hdrMessage == "" || hdrMessage == null) {
									//sap.m.MessageBox.show("Férias programadas com Sucesso!");
									sap.m.MessageToast.show("Férias programadas com Sucesso!");
									vthat.getRouter().navTo("master");
									location.reload(true);
									return;

								}

								var hdrMessageObject = JSON.parse(hdrMessage);
								var length = hdrMessageObject.details.length;
								var i = 0;
								var sTexto;

								sap.m.MessageBox.alert(hdrMessageObject.message, {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function(sAction) {
										vthat.getRouter().navTo("master");
										location.reload(true);
									}

								});
							},

						});
						dialog.close();
					}
				}),
				endButton: new Button({
					text: "Não",
					press: function() {
						dialog.close();
						vthat.getRouter().navTo("master");
						location.reload(true);
					}
				}),
				afterClose: function() {
					//	dialog.destroy();
					//	oListBinding.refresh(true
					vthat.getRouter().navTo("master");
					//this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
				}
			});
			dialog.open();
			//this.getRouter().navTo("master");

		},

		onShareInJamPress: function() {
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

		_onObjectMatched: function(oEvent) {
			var Pernr = oEvent.getParameter("arguments").Pernr;
			var Begda = oEvent.getParameter("arguments").Begda;
			var Seqnr = oEvent.getParameter("arguments").Seqnr;
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("ZET_VCHR_MSS_DETALHE", {
					Pernr: Pernr,
					Begda: Begda,
					Seqnr: Seqnr
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		/**
		 * Binds the view to the object path. Makes sure that detail view displays
		 * a busy indicator while data for the corresponding element binding is loaded.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound to the view.
		 * @private
		 */
		_bindView: function(sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("detailView");

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},
		somardatathird: function() {
			var that = this;
			var vdata = this.getView().byId("IdBegfe").getValue();
			var vdays = this.getView().byId("IdDiasGo").getValue();
			if (vdays > 0) {
				var resultado = "";

				var Key = "/sap/opu/odata/sap/ZGWVCHR_FERIAS_ESS_SRV/ZET_VCRH_CALC_DAYS(V_DATA='" + vdata + "',V_DIAS='" + vdays + "')";
				var oModel = new sap.ui.model.json.JSONModel();
				var oEntry = {};

				oModel.loadData(Key, null, false, "GET", false, false, null);
				var vdate = oModel.oData.d.V_RESULTADO;

				var DataFim = that.getView().byId("IdEndfe");
				DataFim.setValue(vdate);
			}
		},

		_onBindingChange: function() {
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

			var sPath = oElementBinding.getPath(),
				oResourceBundle = this.getResourceBundle(),
				oObject = oView.getModel().getObject(sPath),
				sObjectId = oObject.Pernr,
				sObjectName = oObject.Nomecompleto,
				oViewModel = this.getModel("detailView");

			this.getOwnerComponent().oListSelector.selectAListItem(sPath);

			oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("shareSaveTileAppTitle", [sObjectName]));
			oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));

			/*	this.getView().byId("IdonAddDoc").setVisible(false);
				this.getView().byId("IdonEnviar").setVisible(false);

				this.getView().byId("IdonDoc").setVisible(true);
				this.getView().byId("IdonVoltar").setVisible(true);

				var Status = this.getView().byId("IdStatus").getValue();
				if (Status !== "Ativo") {
					this.getView().byId("IdMsg").setVisible(true);
				} else {
					this.getView().byId("IdMsg").setVisible(false);
				}*/
		},

		_onMetadataLoaded: function() {
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
		onCloseDetailPress: function() {
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
			// No item should be selected on master after detail page is closed
			this.getOwnerComponent().oListSelector.clearMasterListSelection();
			this.getRouter().navTo("master");
		},

		/**
		 * Toggle between full and non full screen mode.
		 */
		toggleFullScreen: function() {
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

		onVoltar: function() {

			this.getRouter().navTo("master");

		},

		_onAdd: function() {
			this.getView().byId("IdonAddDoc").setVisible(true);
			this.getView().byId("IdonEnviar").setVisible(true);

			this.getView().byId("IdonDoc").setVisible(false);
			this.getView().byId("IdonVoltar").setVisible(false);

			this.getView().byId("IdMsg").setVisible(false);

			this.getView().byId("IdParentesco").setValue();
			this.getView().byId("IdFavor").setValue();
			this.getView().byId("IdFanam").setValue();
			this.getView().byId("IdFgbdt").setValue();
			this.getView().byId("IdSexo").setValue();
			this.getView().byId("IdZzestciv").setValue();
		}
	});

});