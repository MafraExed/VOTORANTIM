/*global location */
sap.ui.define([
	"ZVCRH_VISAO_CSC/ZVCRH_VISAO_CSC/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ZVCRH_VISAO_CSC/ZVCRH_VISAO_CSC/model/formatter",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text",
	"sap/ui/core/Fragment"
], function(BaseController, JSONModel, formatter, Dialog, Button, Text, Fragment) {
	"use strict";

	var oEntry = {};
	var oEntry2 = {};
	return BaseController.extend("ZVCRH_VISAO_CSC.ZVCRH_VISAO_CSC.controller.Detail", {
		formatter: formatter,
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */
		onInit: function() {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			oEntry = oEntry2;
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
		onSendEmailPress: function() {
			var oViewModel = this.getModel("detailView");
			sap.m.URLHelper.triggerEmail(null, oViewModel.getProperty("/shareSendEmailSubject"), oViewModel.getProperty(
				"/shareSendEmailMessage"));
		},
		onAprov: function() {
			var vthat = this;
			var _oComponent = this.getOwnerComponent();
			var oList = _oComponent.oListSelector._oList;
			var oListBinding = oList.getBinding("items");
			var oModel = this.getView().getModel();
			var Pernr = this.getView().byId("IdPernr").getValue();
			var Subty = this.getView().byId("IdSubty").getValue();
			var Objps = this.getView().byId("IdObjps").getValue();
			var Key = "/ZET_VCRH_APROVN_CSC(Pernr='" + Pernr + "',Subty='" + Subty + "',Objps='" + Objps + "')";

			oEntry.Parentesco = this.getView().byId("IdParentesco").getValue();
			oEntry.Favor = this.getView().byId("IdFavor").getValue();
			oEntry.Fanam = this.getView().byId("IdFanam").getValue();
			oEntry.Fgbdt = this.getView().byId("IdFgbdt").getValue();
			oEntry.Fgbld = this.getView().byId("IdPais").getSelectedKey();
			oEntry.Ufbot = this.getView().byId("IdEstado").getSelectedKey();
			oEntry.Fgbot = this.getView().byId("IdFgbot").getValue();
			oEntry.Dtcvc = this.getView().byId("IdDtcvc").getValue();
			oEntry.Noreu = this.getView().byId("IdNoreu").getValue();
			oEntry.Noliv = this.getView().byId("IdNoliv").getValue();
			oEntry.ZzcartMedi = this.getView().byId("Idv").getValue();
			oEntry.Carto = this.getView().byId("IdCart").getValue();
			oEntry.Irflg = this.getView().byId("IdIrflg").getSelectedKey();
			oEntry.Noreg = this.getView().byId("IdReg").getValue();
			oEntry.Dtent = this.getView().byId("IdDtCert").getValue();
			oEntry.Mothe = this.getView().byId("IdMothe").getValue();
			oEntry.Lbcnr = this.getView().byId("IdNumDecl").getValue();
			oEntry.Salfa = this.getView().byId("IdSalfa").getSelectedKey();
			oEntry.HealthplanInd = this.getView().byId("IdPlano").getSelectedKey();
			oEntry.Fuman = this.getView().byId("IdFuman").getSelectedKey();
			oEntry.Estud = this.getView().byId("IdEstud").getSelectedKey();
			oEntry.Escol = this.getView().byId("IdEscol").getSelectedKey();
			oEntry.Moden = this.getView().byId("IdModen").getSelectedKey();
			oEntry.Saled = this.getView().byId("IdSaled").getSelectedKey();
			oEntry.Observacao = this.getView().byId("IdObservacao").getValue();
			oEntry.Sexo = this.getView().byId("IdSexo").getValue();
			oEntry.Zzestciv = this.getView().byId("IdZzestciv").getSelectedKey();
			//			while (oEntry.Fgbdt.indexOf("-") != -1)
			//			oEntry.Fgbdt = oEntry.Fgbdt.replace("-", "");
			//			while (oEntry.Dtent.indexOf("-") != -1)
			//			oEntry.Dtent = oEntry.Dtent.replace("-", "");
			//			while (oEntry.Dtcvc.indexOf("-") != -1)
			//			oEntry.Dtcvc = oEntry.Dtcvc.replace("-", "");
			var dialog = new Dialog({
				title: "Confirma\xE7\xE3o",
				type: "Message",
				content: new Text({
					text: "Confirma aprova\xE7\xE3o do dependente?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function() {
						oModel.update(Key, oEntry, {
							success: function(oData, oResponse) {
								sap.m.MessageBox.success("Dependente aprovado com sucesso.", {
									actions: [
										"OK",
										sap.m.MessageBox.Action.CLOSE
									],
									onClose: function(sAction) {
										dialog.close();
									}
								});
								oEntry = oEntry2;
							},
							error: function(oError) {
								sap.m.MessageBox.error("Erro ao chamar o servi\xE7o");
							}
						});
						dialog.close();
					}
				}),
				endButton: new Button({
					text: "N\xE3o",
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
					oListBinding.refresh(true);
					vthat.getRouter().navTo("master"); //this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
				}
			});
			dialog.open(); //this.getRouter().navTo("master");
		},
		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
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
		onReprov: function() {
			var _oComponent = this.getOwnerComponent();
			var oList = _oComponent.oListSelector._oList;
			var oListBinding = oList.getBinding("items");
			var oModel = this.getView().getModel();
			var Pernr = this.getView().byId("IdPernr").getValue();
			var Subty = this.getView().byId("IdSubty").getValue();
			var Objps = this.getView().byId("IdObjps").getValue();
			var Key = "/ZET_VCRH_REPROV_CSCSet(Pernr='" + Pernr + "',Subty='" + Subty + "',Objps='" + Objps + "')";
			var oEntry = {};
			oEntry.Observacao = this.getView().byId("IdObservacao").getValue();
			while (oEntry.Observacao.indexOf(" ") != -1)
				oEntry.Observacao = oEntry.Observacao.replace(" ", "");
			if (oEntry.Observacao === "") {
				this.getView().byId("IdObservacao").setValueState("Error");
				sap.m.MessageBox.error("Preencha o campo Observa\xE7\xE3o descrevendo o motivo da Reprova\xE7\xE3o.");
				return;
			} else {
				var dialog = new Dialog({
					title: "Confirma\xE7\xE3o",
					type: "Message",
					content: new Text({
						text: "Confirma Reprova\xE7\xE3o do dependente?"
					}),
					beginButton: new Button({
						text: "Sim",
						press: function() {
							oModel.update(Key, oEntry, {
								success: function(oData, oResponse) {
									sap.m.MessageBox.success("Dependente Reprovado com sucesso.", {
										actions: [
											"OK",
											sap.m.MessageBox.Action.CLOSE
										],
										onClose: function(sAction) {
											dialog.close();
										}
									});
										oEntry = oEntry2;
								},
								error: function(oError) {
									sap.m.MessageBox.error("Erro ao chamar o servi\xE7o");
								}
							});
							dialog.close();
						}
					}),
					endButton: new Button({
						text: "N\xE3o",
						press: function() {
							dialog.close();
						}
					}),
					afterClose: function() {
						dialog.destroy();
						oListBinding.refresh(true);
						this.getRouter().navTo("master"); //this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
					}
				});
				dialog.open();
			}
		},
		_onObjectMatched: function(oEvent) {
			var Pernr = oEvent.getParameter("arguments").Pernr;
			var Subty = oEvent.getParameter("arguments").Subty;
			var Objps = oEvent.getParameter("arguments").Objps;
			var Tipo = oEvent.getParameter("arguments").Tipo;
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("ZET_VCRH_DEPENDENTES_CSCSet", {
					Tipo: Tipo,
					Pernr: Pernr,
					Subty: Subty,
					Objps: Objps
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
			oViewModel.setProperty("/shareSendEmailSubject", oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage", oResourceBundle.getText("shareSendEmailObjectMessage", [
				sObjectName,
				sObjectId,
				location.href
			]));
			/*	this.getView().byId("IdonAddDoc").setVisible(false);
						this.getView().byId("Idon
						").setVisible(false);

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
				oEntry = oEntry2;
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
		},
		/**
		 *@memberOf ZVCRH_VISAO_CSC.ZVCRH_VISAO_CSC.controller.Detail
		 */
		getanexo: function() {
			//This code was generated by the layout editor.

			var vthis = this;
			var Pernr = this.getView().byId("IdPernr").getValue();
			var Subty = this.getView().byId("IdParentesco").getSelectedKey();
			var Favor = this.getView().byId("IdFavor").getValue();
			var varquivo = "/ZET_VCRH_ARQU_UI5Set(Pernr='" + Pernr + "',Subty='" + Subty + "',Favor='" + Favor + "')/$value";
			var oModel = vthis.getView().getModel().sServiceUrl + varquivo;

			//	window.parent.location = oModel;
			window.open(oModel, "_blank");
		}
	});
});