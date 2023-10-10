sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/m/Text",
	"sap/ui/core/UIComponent", 
	"sap/ui/model/json/JSONModel"
], function (Controller, Dialog, Button, MessageBox, MessageToast, Text, UIComponent, JSONModel) {
	"use strict";

	//TODO: substituir oModel.refresh por refreshes em bindings pontuais

	return Controller.extend("Y5BC_CONF_CEGA.Y5BC_CONF_CEGA.controller.Teste", { 

		onInit: function () {
			/*						this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
									this.oRouter.attachRoutePatternMatched(this._handleRoutePatternMatched, this);
									this.oAceiteModel = this.getOwnerComponent().getModel("aceiteModel");

									this.getView().setModel(new JSONModel({}), "errorModel");*/
            
			var oAceiteModel = new JSONModel({
				busy: false,
				delay: 0,
				selectedTab: "1"
			});

			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(this._handleRoutePatternMatched, this);

		},

		_handleRoutePatternMatched: function (oEvent) {

			if (oEvent.getParameter("name") !== "Teste") {
				this.oRouter.navTo("worklist", false);
				return;
			}

			var oArguments = oEvent.getParameter("arguments");
			this._bindView(oArguments);
		},

		_bindView: function (oArguments) {

			var oModel = this.getView().getModel();
			var sKey = oModel.createKey("/ZET_CBEWM_ACEITE_RESERVACBSet", {
				CodAviso: oArguments.CodAviso,
				// Ebelp: oArguments.Ebelp,
				Fornecedor: oArguments.Fornecedor,
				Nfe: oArguments.Nfe,
				Serie: oArguments.Serie,
				// Matnr: oArguments.Matnr,
				Ebeln: oArguments.Ebeln

			});

			this.getView().bindElement({
				path: sKey,
				parameters: {
					expand: "ToIT"
				}
			});

		},

		onSave: function () {

			var oAceiteModel = this.getOwnerComponent().getModel("aceiteModel");
			var aItems = oAceiteModel.getData().items;
			var aErrors = [];
			var oKeys = {};

			oKeys.Nome = sap.ushell.Container.getService("UserInfo").getId();
			oKeys.Pernr = this.getView().byId("idMatricula").getValue();

			var oModel = this.getOwnerComponent().getModel();

			for (var i = 0; i < aItems.length; i++) {

				var obj = aItems[i].getBindingContext().getObject();

				oModel.callFunction("/AceitarReserva", {
					method: "POST",
					urlParameters: {
						CodAviso: obj.CodAviso,
						Fornecedor: obj.Fornecedor,
						Matnr: obj.Matnr,
						Serie: obj.Serie,
						Nfe: obj.Nfe,
						Matricula: oKeys.Pernr,
						Usuario: oKeys.Nome,
						Ebeln: obj.Ebeln,
						Ebelp: obj.Ebelp

					},
					success: function (oData, response) {
						MessageToast.show("A reserva foi aceita com sucesso.");

					},
					error: function (oError) {

						// aItems[i].returnStatus = JSON.parse(oError.responseText).error.message.value;

						// MessageToast.show(JSON.parse(oError.responseText).error.message.value);
						var messageText;

						try {
							var oMessage = JSON.parse(oError);
						} catch (err) {
							try {

								switch (typeof oError) {
								case "string":
									if (oError.indexOf("<?xml") == 0) {
										var oXML = jQuery.parseXML(oError);
										var oXMLMsg = oXML.querySelector("message");
										if (oXMLMsg) {
											messageText = oXMLMsg.textContent;
										}
									} else {

										messageText = oError;
									}
									break;
								case "object":
									messageText = oError.toString();
									break;
								}
							} catch (err) {
								messageText = "An unknown error occurred";
							}
						}
					}
				});

			}

		},

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
				this._oDialog = sap.ui.xmlfragment("Y5BC_CONF_CEGA.Y5BC_CONF_CEGA.fragment.Aceite", this);
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

			var sPath = this.getView().getBindingContext().getPath();
			//var sImgUploadPath = this.getView().getBindingContext().getPath() + "/ToFoto";
			var oModel = this.getView().getModel();
			var este = this;

			var sMatricula, sUsuario, sLogin;
			sMatricula = sap.ui.getCore().byId('inputMatricula').getValue();
			sUsuario = sap.ui.getCore().byId('inputLogin').getValue();
			sLogin = sap.ushell.Container.getService("UserInfo").getId();

			if (!sMatricula || !sUsuario) {
				//MessageToast.show("Preencha os campos 'Login' e 'Matrícula'.");
				MessageToast.show("Preencha o campo 'Matrícula' e 'Nome'.");
				return;
			}

			// var sPhoto = this.oAceiteModel.getProperty("/img");

			// if (!sPhoto) {
			// 	MessageToast.show("Pressione a imagem antes de confirmar o aceite.");
			// 	return;
			// }

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
						Fornecedor: obj.Fornecedor,
						Login: sLogin,
						Matnr: obj.Matnr,
						Matricula: sMatricula,
						Nfe: obj.Nfe,
						Nome: sUsuario,
						Serie: obj.Serie
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

			// Value: btoa(encodeURIComponent(this.oAceiteModel.getProperty("/img")))
			// oModel.create(sImgUploadPath,
			// 	sPhoto, {
			// 		groupId: "Batch_AceitarAviso",
			// 		urlParameters: {
			// 			"Content-Type": "image/png"
			// 		},
			// 		success: function(a, b) {
			// 			// debugger;
			// 		},
			// 		error: function(c) {
			// 			// debugger;
			// 		}
			// 	});

			oModel.submitChanges({
				groupId: "Batch_AceitarAviso", 
				success: function (a, b) {

					oModel.refresh();

					if (aReturn.err.length <= 0) {

						// MessageBox.success("Aceite reali	zado com sucesso.");
						MessageToast.show("Aceite realizado com sucesso.");
						setTimeout(function () {
							this.oRouter.navTo("worklist", true);
						}.bind(this), 1500);//3000
					} else {
						sap.m.MessageBox.error(aReturn.err[1].text);
					}

				}.bind(this),
				error: function (e) {
					oModel.refresh();
				}.bind(this)
			});

		},
/*		_impressao: function () {
			var oTable = this.byId("aceiteItemsTable");
			var aItems = oTable.getItems();

			var oModel2 = this.getOwnerComponent().getModel();
			debugger;
			for (var i = 0; i < aItems.length; i++) {

				var obj2 = aItems[0].getBindingContext().getObject();

				//
				oModel2.callFunction("/ImprimirPorMaterial", {
					method: "POST",
					urlParameters: {
						Matnr: obj2.Matnr,
						Quantidade: parseFloat(obj2.Volume),
						Name: this.getView().byId("imp").getSelectedItem().getKey(),
					    Pep: obj2.Pep,
					  	Lote: obj2.Lote
					},
					success: function (oData, response) {

					}.bind(this),
					error: function (oError) {

					}
				});

			}
		},*/
		onCancelPress: function () {
			this._getDialog().close();
		}

	});

});