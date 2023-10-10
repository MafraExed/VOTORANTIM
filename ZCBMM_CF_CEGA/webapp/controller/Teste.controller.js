sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/m/Text",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel"
], function(Controller, Dialog, Button, MessageBox, MessageToast, Text, UIComponent, JSONModel) {
	"use strict";

	//TODO: substituir oModel.refresh por refreshes em bindings pontuais

	return Controller.extend("ZCBMM_CF_CEGA.ZCBMM_CF_CEGA.controller.Teste", {

		onInit: function() {

			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(this._handleRoutePatternMatched, this);
			this.oAceiteModel = this.getOwnerComponent().getModel("aceiteModel");

			this.getView().setModel(new JSONModel({}), "errorModel");

		},

		_handleRoutePatternMatched: function(oEvent) {
			if (oEvent.getParameter("name") === "Teste") {

				if (!this.oAceiteModel.getData().hasOwnProperty("items")) {
					this.oRouter.navTo("worklist", false);
					return;
				}
				this._bindView();

			}
		},

		_bindView: function() {

			var obj = this.oAceiteModel.getProperty("/items")[0].getBindingContext().getObject();

			var oModel = this.getView().getModel();
			var sKey = oModel.createKey("/AceiteReservaCBSet", {
				CodAviso: obj.CodAviso,
				// Ebelp: obj.Ebelp,
				Fornecedor: obj.Fornecedor,
				Nfe: obj.Nfe,
				Serie: obj.Serie,
				// Matnr: obj.Matnr,
				Ebeln: obj.Ebeln
			});

			// this.getView().getModel("contagemModel").setData({});
			this.getView().bindElement({
				path: sKey,
				parameters: {
					expand: "ToIt"
				}
			});

		},

		onSave: function() {

			var oAceiteModel = this.getOwnerComponent().getModel("aceiteModel");

			var aItems = oAceiteModel.getData().items;
			var aErrors = [];

			var oKeys = {};
			oKeys.Login = this.getView().byId("idUsuario").getValue();
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
						Usuario: oKeys.Login,
						Ebeln: obj.Ebeln,
						Ebelp: obj.Ebelp

					},
					success: function(oData, response) {
						MessageToast.show("A reserva foi aceita com sucesso.");

					},
					error: function(oError) {

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
		onRegistrarAceitePress: function() {

			this._getDialog().open();

		},

		_getDialog: function() {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("ZCBMM_CF_CEGA.ZCBMM_CF_CEGA.fragment.Aceite", this);
				this.getView().addDependent(this._oDialog);
			}
			return this._oDialog;
		},
		onOpenDialog: function() {
			this._getDialog().open();
		},
		afterDialogClose: function(oEvent) {
			this._getDialog().destroy();
			delete this._oDialog;
		},

		onSnapshot: function(oEvent) {

			var sImg = oEvent.getParameter("image"); //base64
			sImg = sImg.replace("data:image/png;base64,", "");

			this.oAceiteModel.setProperty("/img", sImg);

			sap.m.MessageToast.show("Foto registrada");

		},

		onAceiteSavePress: function() {

			var sPath = this.getView().getBindingContext().getPath();
			var sImgUploadPath = this.getView().getBindingContext().getPath() + "/ToFoto";
			var oModel = this.getView().getModel();
			var este = this;

			var sMatricula, sUsuario;
			sMatricula = sap.ui.getCore().byId('inputMatricula').getValue();
			sUsuario = sap.ui.getCore().byId('inputLogin').getValue();

			if (!sMatricula || !sUsuario) {
				MessageToast.show("Preencha os campos 'Login' e 'Matrícula'.");
				return;
			}

			var sPhoto = this.oAceiteModel.getProperty("/img");

			if (!sPhoto) {
				MessageToast.show("Pressione a imagem antes de confirmar o aceite.");
				return;
			}

			var aDeferredGroups = ["Batch_AceitarAviso"];
			oModel.setDeferredGroups(aDeferredGroups);

			var aReturn = {
				suc: [],
				err: []
			};

			var aItensAceite = this.byId("aceiteItemsTable").getItems();
			var erro = "";
			for (var i = 0; i < aItensAceite.length; i++) {
				var obj = aItensAceite[i].getBindingContext().getObject();

				oModel.callFunction("/AceitarAviso", {
					method: "POST",
					urlParameters: {
						CodAviso: obj.CodAviso,
						Ebeln: obj.Ebeln,
						Ebelp: obj.Ebelp,
						Fornecedor: obj.Fornecedor,
						Matnr: obj.Matnr,
						Matricula: sMatricula,
						Nfe: obj.Nfe,
						Serie: obj.Serie,
						Usuario: sUsuario
					},
					success: function(oData, response) {

						aReturn.suc.push({});
					}.bind(this),
					error: function(oError) {
						//sap.m.MessageBox.error("erro de usuario e matricula");
						// erro = "X";
						 console.log(i);
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
			oModel.create(sImgUploadPath,
				sPhoto, {
					groupId: "Batch_AceitarAviso",
					urlParameters: {
						"Content-Type": "image/png"
					},
					success: function(a, b) {
						// debugger;
					},
					error: function(c) {
						// debugger;
					}
				});

			oModel.submitChanges({
				groupId: "Batch_AceitarAviso",
				success: function(a, b) {
				
					oModel.refresh();

					if (aReturn.err.length <= 0) {
						
						// MessageBox.success("Aceite reali	zado com sucesso.");
						MessageToast.show("Aceite realizado com sucesso.");
						setTimeout(function() {
							this.oRouter.navTo("worklist", true);
						}.bind(this), 3000);
					} else {
						sap.m.MessageBox.error(aReturn.err[1].text);
					}

				}.bind(this),
				error: function(e) {
					oModel.refresh();
				}.bind(this)
			});

		},
		_impressao: function() {
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
					success: function(oData, response) {

					}.bind(this),
					error: function(oError) {

					}
				});

			}
		},
		onCancelPress: function() {
			this._getDialog().close();
			// this._getDialog().destroy();
			// delete this._getDialog();
		}

	});

});