/*global location */
sap.ui.define([
	"ZVCRH_VISAO_FERIAS/ZVCRH_VISAO_FERIAS/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ZVCRH_VISAO_FERIAS/ZVCRH_VISAO_FERIAS/model/formatter",
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/m/Text',
	'sap/ui/core/Fragment'

], function(BaseController, JSONModel, formatter, Dialog, Button, Text, Fragment) {
	"use strict";

	return BaseController.extend("ZVCRH_VISAO_FERIAS.ZVCRH_VISAO_FERIAS.controller.Detail", {

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

			//this.getRouter().getRoute("object")F.attachPatternMatched(this._onObjectMatched, this);

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

			sap.m.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
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

		_onObjectMatched: function(oEvent) {
			var Pernr = oEvent.getParameter("arguments").Pernr;
			var Index = oEvent.getParameter("arguments").Index;

			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("ZET_VCRH_PROGRAMAR", {
					//	Tipo: Tipo,
					Pernr: Pernr,
					Index: Index
						//	Objps: Objps
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));

		},

		onVoltar: function(oEvent) {

			this.getRouter().navTo("master");
			var	sKey = oEvent.getParameter("key");
        	
			var vl = this.getView().byId("Form1").setVisible(false);
			var v2 = this.getView().byId("Form2").setVisible(false);
			var v3 = this.getView().byId("Form3").setVisible(false);
		},
		
			handleIconTabBarSelect : function (oEvent) {
				
				var	sKey = oEvent.getParameter("key");
        		
			if (sKey === "1") {
				this.getView().byId("Form1").setVisible(true);
				this.getView().byId("Form2").setVisible(false);
				this.getView().byId("Form3").setVisible(false);
		
			} else if (sKey === "2") {
				this.getView().byId("Form1").setVisible(false);
				this.getView().byId("Form2").setVisible(true);
				this.getView().byId("Form3").setVisible(false);
  
			} else if (sKey === "3") {
			    this.getView().byId("Form1").setVisible(false);
			    this.getView().byId("Form2").setVisible(false);
			    this.getView().byId("Form3").setVisible(true);
			}
				
		},

		
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
			
			// var sPath = oElementBinding.getPath(),
			// 	oResourceBundle = this.getResourceBundle(),
			// 	oObject = oView.getModel().getObject(sPath),
			// 	sObjectId = oObject.master,
			// 	sObjectName = oObject.Pernrs,
			// 	oViewModel = this.getModel("detailView");

			// this.getOwnerComponent().oListSelector.selectAListItem(sPath);

			// oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("shareSaveTileAppTitle", [sObjectName]));
			// oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			// oViewModel.setProperty("/shareSendEmailSubject",
			// 	oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			// oViewModel.setProperty("/shareSendEmailMessage",
			// 	oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
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

		somardatafirst: function() {
			var that = this;
			var vdata = this.getView().byId("IdInicio1").getValue();
			var vdays = this.getView().byId("first_diasgozo").getValue();
			if (vdays > 0) {
				var resultado = "";

				var Key = "/sap/opu/odata/sap/ZGWVCHR_FERIAS_ESS_SRV/ZET_VCRH_CALC_DAYS(V_DATA='" + vdata + "',V_DIAS='" + vdays + "')";
				var oModel = new sap.ui.model.json.JSONModel();
				var oEntry = {};

				oEntry.vdata = this.getView().byId("IdInicio1").getValue();
				oEntry.vdays = this.getView().byId("first_diasgozo").getValue();

				oModel.loadData(Key, null, false, "GET", false, false, null);

				var vdate = oModel.oData.d.V_RESULTADO;

				var DataFim = that.getView().byId("IdFim1");
				DataFim.setValue(vdate);
			}
		},
		somardatasecon: function() {
			var that = this;
			var vdata2 = this.getView().byId("IdInicio2").getValue();
			var vdays2 = this.getView().byId("secon_diasgozo").getValue();
			if (vdays2 > 0) {
				var resultado = "";

				var Key2 = "/sap/opu/odata/sap/ZGWVCHR_FERIAS_ESS_SRV/ZET_VCRH_CALC_DAYS(V_DATA='" + vdata2 + "',V_DIAS='" + vdays2 + "')";
				var oModel = new sap.ui.model.json.JSONModel();
				var oEntry = {};

				oEntry.vdata2 = this.getView().byId("IdInicio2").getValue();
				oEntry.vdays2 = this.getView().byId("secon_diasgozo").getValue();

				oModel.loadData(Key2, null, false, "GET", false, false, null);

				var vdate2 = oModel.oData.d.V_RESULTADO;

				var DataFim2 = that.getView().byId("IdFim2");
				DataFim2.setValue(vdate2);
			}
		},
		somardatathird: function() {
			var that = this;
			var vdata = this.getView().byId("IdInicio3").getValue();
			var vdays = this.getView().byId("third_diasgozo").getValue();
			if (vdays > 0) {
				var resultado = "";

				var Key = "/sap/opu/odata/sap/ZGWVCHR_FERIAS_ESS_SRV/ZET_VCRH_CALC_DAYS(V_DATA='" + vdata + "',V_DIAS='" + vdays + "')";
				var oModel = new sap.ui.model.json.JSONModel();
				var oEntry = {};

				oEntry.vdata = this.getView().byId("IdInicio3").getValue();
				oEntry.vdays = this.getView().byId("third_diasgozo").getValue();

				oModel.loadData(Key, null, false, "GET", false, false, null);

				var vdate = oModel.oData.d.V_RESULTADO;

				var DataFim = that.getView().byId("IdFim3");
				DataFim.setValue(vdate);
			}
		},
		somardata: function(vata, vdias) {
			//This code was generated by the layout editor.
			var that = this;
			var oModel = this.getOwnerComponent().getModel("ferias_ess");
			var sFilter = "VDATA eq '" + vata + "' and VDIAS eq '" + vdias + "'";
			var sPath = "/ZET_VCRH_CALC_DAYS";
			oModel.read(sPath, {
				urlParameters: {
					"$filter": sFilter
				},
				async: false,
				success: function(oData, oResponse) {
					return oData.results[0].RESULTADO;
				},
				error: function() {
					sap.m.MessageToast.show("F\xE9rias n\xE3o encontradas!");
				}
			});
		},

		onSave: function() {
			var vthat = this;
			var _oComponent = this.getOwnerComponent();
			var oList = _oComponent.oListSelector._oList;
			var oListBinding = oList.getBinding("items");
			var oModel = this.getView().getModel();
			var Index = this.getView().byId("IdIndex").getValue();
			var Pernr = this.getView().byId("IdPernr").getValue();
			var Abono1 = this.getView().byId("first_abono").getSelected();
			//var Index = parseInt(Index);
			var Key = "/ZET_VCRH_SALVAR(Index=" + Index + ",Pernr='" + Pernr + "')";
			var oEntry = {};

			//1º Período
			oEntry.Pernr = this.getView().byId("IdPernr").getValue();
			oEntry.Inicio1 = this.getView().byId("IdInicio1").getValue();
			oEntry.DiasGozo1 = this.getView().byId("first_diasgozo").getValue();
			oEntry.Fim1 = this.getView().byId("IdFim1").getValue();

			//abono
			if (this.getView().byId("first_abono").getSelected() === true) {
				oEntry.Abono1 = "X";
				oEntry.DiasAbono1 = "10";
			} else {
				oEntry.Abono1 = " ";
			}

			//13
			if (this.getView().byId("first_13").getSelected() === true) {
				oEntry.SolParc131 = "X";

			} else {
				oEntry.SolParc131 = " ";
			}

			//2º Período
			oEntry.Inicio2 = this.getView().byId("IdInicio2").getValue();
			oEntry.DiasGozo2 = this.getView().byId("secon_diasgozo").getValue();
			oEntry.Fim2 = this.getView().byId("IdFim2").getValue();
			//3º Período
			oEntry.Inicio3 = this.getView().byId("IdInicio3").getValue();
			oEntry.DiasGozo3 = this.getView().byId("third_diasgozo").getValue();
			oEntry.Fim3 = this.getView().byId("IdFim3").getValue();

			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: "Confirma programação de Férias?"
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
					}
				}),
				afterClose: function() {
					//dialog.destroy();
					//this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
					vthat.getRouter().navTo("master");

				}
			});

			dialog.open();

		},

		onCancel: function() {
			var vthat = this;
			var _oComponent = this.getOwnerComponent();
			var oList = _oComponent.oListSelector._oList;
			var oListBinding = oList.getBinding("items");
			var oModel = this.getView().getModel();
			var Index = this.getView().byId("IdIndex").getValue();
			//		var Pernr = this.getView().byId("IdPernr").getValue();
			var Key = "/ZET_VCRH_CANCELAR(Index=" + Index + ")";
			var oEntry = {};

			oEntry.Index = parseInt(this.getView().byId("IdIndex").getValue());

			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: "Confirma o cancelamento?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function() {
						oModel.update(Key, oEntry, {
							success: function(oData, oResponse) {

								if (oResponse.body === "") {
									//	sap.m.MessageBox.error("Férias Canceladas com sucesso!");
									sap.m.MessageToast.show("Férias canceladas com Sucesso!");
									vthat.getRouter().navTo("master");
									return;
								}

								var hdrMessage = oResponse.headers["sap-message"];
								var hdrMessageObject = JSON.parse(hdrMessage);
								var length = hdrMessageObject.details.length;
								var i = 0;
								var sTexto;

								sap.m.MessageBox.alert(hdrMessageObject.message, {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function(sAction) {
										vthat.getRouter().navTo("master");
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
					}
				}),
				afterClose: function() {
					dialog.destroy();
					//	this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
					vthat.getRouter().navTo("master");

				}
			});
			dialog.open();

		},
		FormatChecked: function(value) {
			if (value === 'X') {

				return true;

			} else {

				return false;

			}

		},

		FormatChecked2: function(value) {
			if (value === 'X') {

				return true;

			} else {

				return false;

			}

		},

		onAfterRendering: function(evt) {
			//var abono = this.getView().byId("IdFavor").getValue();
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