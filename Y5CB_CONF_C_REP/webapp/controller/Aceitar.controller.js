sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"Y5CB_CONF_C_REP/Y5CB_CONF_C_REP/model/models",
    "Y5CB_CONF_C_REP/Y5CB_CONF_C_REP/model/formatter",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/m/Text",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel"
], function (Controller, models, formatter, Dialog, Button, MessageBox, MessageToast, Text, UIComponent, JSONModel) {
	"use strict";

	/*	//TODO: substituir oModel.refresh por refreshes em bindings pontuais*/

	return Controller.extend("Y5CB_CONF_C_REP.Y5CB_CONF_C_REP.controller.Aceitar", {

		onInit: function () {

			var oAceiteModel = new JSONModel({
				busy: false,
				delay: 0,
				selectedTab: "1"
			});
			
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(this._handleRoutePatternMatched, this);
			
		},

		_handleRoutePatternMatched: function (oEvent) {
			
			if (oEvent.getParameter("name") !== "Aceitar") {
				return;
			}

			var oArguments = oEvent.getParameter("arguments");
			this._bindView(oArguments);

		},

		_bindView: function (oArguments) {

			var oAceiteModel = this.getView().getModel();
			var sKey = oAceiteModel.createKey("/ZET_CBMM_ACEITE_RESERVACBSet", {
				CodAviso: oArguments.CodAviso,
				Cliente: oArguments.Cliente
					//Ebelp: obj.Ebelp
			});

			this.getView().bindElement({
				path: sKey,
				parameters: {
					expand: "ToIT"
				}
			});
		},

		_setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

/*		_handleRoutePatternMatched2: function (oEvent) {
			var oArguments = oEvent.getParameter("arguments");
			if (oEvent.getParameter("name") === "Aceitar") {

				if (!this.oAceiteModel.getData().hasOwnProperty("items")) {
					this.oRouter.navTo("worklist", false);
					return;
				}
				this._bindView();
			}

			if (oEvent.getParameter("name") === "worklist") { //"backBtn" 

				this.getView().unbindElement("aceiteModel");
			}
		},*/

		onRegistrarAceitePress: function () {

			var table = this.getView().byId("aceiteItemsTable");
			var cont = table.getSelectedIndex();
			if (cont === -1) {
				sap.m.MessageBox.error("Selecione ao menos um registro para aceite.");
				return;
			}

			this._getDialog().open();

		},

		_getDialog: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("Y5CB_CONF_C_REP.Y5CB_CONF_C_REP.fragment.Aceite", this);
				this.getView().addDependent(this._oDialog);
			}
			return this._oDialog;
		},
		onOpenDialog: function () {
			this._getDialog().open();
		},
		afterDialogClose: function (oEvent) {
			this._getDialog().destroy();
			delete this._oDialog;
		},

		onSnapshot: function (oEvent) {

			var sImg = oEvent.getParameter("image"); //base64
			sImg = sImg.replace("data:image/png;base64,", "");

			this.oAceiteModel.setProperty("/img", sImg);

			sap.m.MessageToast.show("Foto registrada");

		},

		onAceiteSavePress: function () {
		    var oModel = this.getView().getModel();

			var sMatricula, sUsuario, sLogin;
			sMatricula = sap.ui.getCore().byId('inputMatricula').getValue();
			sUsuario = sap.ui.getCore().byId('inputLogin').getValue();
			sLogin = sap.ushell.Container.getService("UserInfo").getId();

			if (!sMatricula || !sUsuario) {
				MessageToast.show("Preencha o campo 'Matrícula' e 'Nome'.");
				return;
			}

			var aDeferredGroups = ["Batch_AceitarAviso"];
			oModel.setDeferredGroups(aDeferredGroups);

			var aReturn = {
				suc: [],
				err: []
			};

			var aItensAceite = this.byId("aceiteItemsTable").getSelectedIndices();
			for (var i = 0; i < aItensAceite.length; i++) {
				var obj = this.byId("aceiteItemsTable").getContextByIndex(aItensAceite[i]).getObject();

				oModel.callFunction("/AceitarAviso", {
					method: "POST",
					urlParameters: {
						CodAviso: obj.CodAviso,
						Ebeln: obj.Ebeln,
						Ebelp: obj.Ebelp,
						Cliente: obj.Cliente,
						Login: sLogin,
						Matnr: obj.Matnr,
						Matricula: sMatricula,
						Nfe: obj.Nfe,
						Nome: sUsuario
					},
					success: function (oData, response) {
						aReturn.suc.push({});
						sap.ui.getCore().byId('inputMatricula').setValue("");
						sUsuario = sap.ui.getCore().byId('inputLogin').setValue("");
						this.byId("aceiteItemsTable").getModel().refresh(true); 

					}.bind(this),
					error: function (oError) {
						aReturn.err.push({});
						var oResponse = JSON.parse(oError.responseText);
						if (oResponse.hasOwnProperty("error")) {
							aReturn.err.push({
								text: "erro de usuario e matricula"
							});
						}
					},
					groupId: "Batch_AceitarAviso"
				});
			}

			oModel.submitChanges({
				groupId: "Batch_AceitarAviso",
				success: function (a, b) {
					oModel.refresh();
					if (aReturn.err.length <= 0) {

						MessageToast.show("Aceite realizado com sucesso.");
						setTimeout(function () {
							this.oRouter.navTo("worklist", true);
						}.bind(this), 3000);
					} else {
						sap.m.MessageBox.error(aReturn.err[1].text);
					}

				}.bind(this),
				error: function (e) {
					oModel.refresh();
				}.bind(this)
			});

		},
		_impressao: function () {
			var oTable = this.byId("aceiteItemsTable");
			var aItems = oTable.getItems();

			var oModel2 = this.getOwnerComponent().getModel();

			for (var i = 0; i < aItems.length; i++) {

				var obj2 = aItems[0].getBindingContext().getObject();

				//
				oModel2.callFunction("/ImprimirPorMaterial", {
					method: "POST",
					urlParameters: {
						Matnr: obj2.Matnr,
						Quantidade: parseFloat(obj2.Volume),
						Name: this.getView().byId("imp").getSelectedItem().getKey()
					},
					success: function (oData, response) {

					}.bind(this),
					error: function (oError) {

					}
				});

			}
		},
		onCancelPress: function () {
			this._getDialog().close();
		}

	});

});