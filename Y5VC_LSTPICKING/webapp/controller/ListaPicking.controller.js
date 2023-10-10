sap.ui.define([
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/Label",
	"sap/m/MessageToast",
	"sap/m/Text",
	"sap/m/TextArea",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/model/Filter",
	"sap/ui/core/mvc/Controller",
	"sap/m/Token",
	"sap/m/MessagePopover"
], function (Button, Dialog, Label, MessageToast, Text, TextArea, MessageBox, JSONModel, ResourceModel, Filter, Controller, Token,
	MessagePopover) {
	"use strict";

	return Controller.extend("workspace.ztotemlistapicking.controller.ListaPicking", {
		onInit: function () {

			let oView = this.getView();
			let oJSONModel = new JSONModel({});
			oView.setModel(oJSONModel, "PKGLST");

			//para possibilitar copiar e colar conteudo
			var oMultiInput = this.getView().byId("idMultiInputLabelNumber");
			oMultiInput.setWidth("500px");
			//*** add checkbox validator
			var fValidator = function (args) {
				var text = args.text;
				return new Token({
					key: text,
					text: text
				});
			};

			oMultiInput.addValidator(fValidator);

			var oViewModel = new sap.ui.model.json.JSONModel({
				bHideColumn: true
			});

			this.getView().setModel(oViewModel, "viewProperties");

			let oModelGe = this.getView().getModel("GE");

			// PopOver Template
			let oMessageTemplate = new sap.m.MessagePopoverItem({
				type: '{type}',
				title: '{title}',
				description: '{description}',
				subtitle: '{subtitle}',
				counter: '{counter}'
			});

			// PopOver
			let oMessagePopover = new MessagePopover({
				items: {
					path: '/',
					template: oMessageTemplate
				}
			});

			let that = this;

			that._MessagePopover = oMessagePopover;

			oModelGe.attachRequestCompleted(function (oEvent) {

				if (oEvent.getParameters().response) {
					if (oEvent.getParameters().response.headers) {
						if (oEvent.getParameters().response.headers["sap-message"]) {
							// Trata mensagens retornadas
							that._handleResponseMessage(oEvent, that);

						}

					}
				}
			});

			oModelGe.attachRequestFailed(function (oEvent) {
				let oSuccess = oEvent.getParameters().success;
				if (!oSuccess) {
					let oResponse = oEvent.getParameters().response;
					if (oResponse) {
						let responseParser = JSON.parse(oResponse.responseText);
						if (responseParser.error.innererror) {
							MessageBox.error(responseParser.error.innererror.errordetails[0].message, {
								styleClass: "sapUiSizeCompact"
							});
							oView.getModel("GE").resetChanges();
						} else {
							MessageBox.error(responseParser.error.message.value, {
								styleClass: "sapUiSizeCompact"
							});
						}
					}
				}
			}, this);

		},

		_handleResponseMessage: function (oEvent, oThat) {
			let oModelErrors = new JSONModel();

			let aMessages = [];
			let oMessages = JSON.parse(oEvent.getParameters().response.headers["sap-message"]);
			let oMessageItem = {};
			oMessages.severity = oMessages.severity.charAt(0).toUpperCase() + oMessages.severity.slice(1);
			oMessageItem.type = oMessages.severity;
			oMessageItem.title = oMessages.message;
			oMessageItem.description = oMessages.message;
			oMessageItem.subtitle = oMessages.code;
			oMessageItem.counter = 1;
			aMessages.push(oMessageItem);

			for (let oMessage of oMessages.details) {
				oMessageItem = {};

				oMessage.severity = oMessage.severity.charAt(0).toUpperCase() + oMessage.severity.slice(1);
				oMessageItem.type = oMessage.severity;
				oMessageItem.title = oMessage.message;
				oMessageItem.description = oMessage.message;
				oMessageItem.subtitle = oMessage.code;
				oMessageItem.counter = 1;
				aMessages.push(oMessageItem);
			}
			oModelErrors.setData(aMessages);
			oThat._MessagePopover.setModel(oModelErrors);

			var viewModel = new JSONModel();
			viewModel.setData({
				messagesLength: aMessages.length + ''
			});

			oThat.getView().setModel(viewModel);

			if (aMessages.length > 0) {
				let oTranslationModel = oThat.getView().getModel("i18n");
				let oBundle = oTranslationModel.getResourceBundle();
				MessageToast.show(oBundle.getText("check_messages"));
			}
		},

		handlePopoverPress: function (oEvent) {
			///this._oPopover.openBy(oEvent.getSource());

			this._MessagePopover.toggle(oEvent.getSource());
		},

		_onSearch: function (evt) {

			let oSelect = this.byId("idSelCatPkg");
			let oMultiInput = this.byId("idMultiInputLabelNumber");
			let oTranslationModel = this.getView().getModel("i18n");
			let oBundle = oTranslationModel.getResourceBundle();
			let aFilter = [];

			//Verifica se categoria do documento foi preenchida
			if (!oSelect.getSelectedItem()) {
				oSelect.setValueState("Error");
				oSelect.setValueStateText(oBundle.getText("input_required"));
				return;
			} else {
				oSelect.setValueState("None");
			}

			// Verifica se documento foi preenchido
			if (oMultiInput.getTokens().length === 0) {
				oMultiInput.setValueState("Error");
				oMultiInput.setValueStateText(oBundle.getText("input_required"));
				return;
			} else {
				oMultiInput.setValueState("None");
			}

			aFilter.push(
				new sap.ui.model.Filter("Catpkg", sap.ui.model.FilterOperator.EQ, oSelect.getSelectedItem().getKey())
			);

			for (let oToken of oMultiInput.getTokens()) {
				if (oToken.getKey() !== "") {
					aFilter.push(
						new sap.ui.model.Filter("Docpkg", sap.ui.model.FilterOperator.EQ, oToken.getKey())
					);
				}
			}

			let oTable = this.byId("idTablePicking");
			oTable.getBinding("items").filter(aFilter);
			let oViewModel = this.getView().getModel("viewProperties");

			if (oSelect.getSelectedItem().getKey() === "01") {
				oViewModel.setProperty("/bHideColumn", false);
			} else {
				oViewModel.setProperty("/bHideColumn", true);
			}
		},

		handleSalvar: function (evt) {

			var oView = this.getView();
			var oBundle = oView.getModel("i18n").getResourceBundle();
			var oModel = oView.getModel("GE");
			var oTable = oView.byId("idTablePicking");
			var oItems = oTable.getItems();
			var tipoDocumento = "2"; //Reserva
			var indErroQtd = false;
			var indItemSelecionado = false;

			let oContexts = oTable.getSelectedContexts();
			//for (var oItem of oItems) {	

			for (let oCtx of oContexts) {

				//indItemSelecionado = true;
				//let oIndSelecao = oCtx   oItem.getAggregation("cells")[0];
				let vQtdPicking = oCtx.getProperty("QtdPicking"); // oItem.getAggregation("cells")[5];
				let vtdOriginal = oCtx.getProperty("QtdOriginal"); //oItem.getAggregation("cells")[6].getProperty("text");

				// Se for editável o tipo de documento é reserva e somente deve ser enviado para o SAP as células
				// selecionadas e somente essas devem ser validadas
				//oQtdPicking.setValueState(sap.ui.core.ValueState.None);
				if (oCtx.getProperty("Editavel")) {
					indItemSelecionado = true;
					if (parseFloat(vQtdPicking) > parseFloat(vtdOriginal)) {
						//			oQtdPicking.setValueState(sap.ui.core.ValueState.Error);
						indErroQtd = true;
					} else {
						//			oQtdPicking.setValueState(sap.ui.core.ValueState.Success);
					}
				} else {
					// - para tipo de documento remessa passar em todas as linhas e modificar para poder realizar o update
					indItemSelecionado = true;
					tipoDocumento = "1"; //Remessa
				}
			}

			if (!indItemSelecionado) {
				MessageBox.error(oBundle.getText("errorNoneRegisterSelected"), {
					title: oBundle.getText("error"),
					styleClass: "sapUiSizeCompact"
				});
				return;
			}

			if (indErroQtd) {
				MessageBox.error(oBundle.getText("errorQtdePickingInvalid"), {
					title: oBundle.getText("error"),
					styleClass: "sapUiSizeCompact"
				});
				return;
			}

			oTable.setBusy(true);

			var mParameters = {
				//groupId: "gpIdListaPicking",
				success: (oData, oResp) => {
					if (oData) {
						if (oData.__batchResponses[0]) {
							let oBatchResponse = oData.__batchResponses[0];
							let vMsgIdpkg = "";
							for (let oResponse of oBatchResponse.__changeResponses) {
								if (oResponse.data) {
									vMsgIdpkg = oResponse.data.Idpkg;
								}
							}

							if (vMsgIdpkg) {
								MessageBox.success(oBundle.getText("PickingListCreated") + " " + vMsgIdpkg, {
									styleClass: "sapUiSizeCompact"
								});
							}
						} else {
							MessageBox.success(oBundle.getText("RecordedData"), {
								styleClass: "sapUiSizeCompact"
							});
						}

						this._limparTela();
					}
					oTable.setBusy(false);
				},
				error: (odata, resp) => {
					MessageBox.error(oBundle.getText("ErrorRecordedData"), {
						styleClass: "sapUiSizeCompact"
					});
					oTable.setBusy(false);
				}
			};

			//			oModel.setDeferredGroups(["gpIdListaPicking"]);
			let aResetChanges = [];
			for (let oCtx of oContexts) {
				let oNewItem = oModel.createEntry("ZET_VCMM_PICKINGSet");
				oModel.setProperty(oNewItem.getPath() + "/Docpkg", oCtx.getProperty("Docpkg").substring(12, 2));
				oModel.setProperty(oNewItem.getPath() + "/Itmpkg", oCtx.getProperty("Itmpkg"));
				oModel.setProperty(oNewItem.getPath() + "/Catpkg", oCtx.getProperty("Catpkg"));
				oModel.setProperty(oNewItem.getPath() + "/Werks", oCtx.getProperty("Werks"));
				oModel.setProperty(oNewItem.getPath() + "/Matnr", oCtx.getProperty("Matnr"));
				oModel.setProperty(oNewItem.getPath() + "/Menge", oCtx.getProperty("QtdPicking"));
				oModel.setProperty(oNewItem.getPath() + "/Meins", oCtx.getProperty("Meins"));
				oModel.setProperty(oNewItem.getPath() + "/Aufnr", oCtx.getProperty("Aufnr"));
				aResetChanges.push(oCtx.getPath());

			}
			if (aResetChanges.length > 0) {
				oModel.resetChanges(aResetChanges);
			}

			oModel.submitChanges(mParameters);
			//			oModel.resetChanges( );

			/*if (oModel.hasPendingChanges()) {
				
			} else {
				MessageBox.error(oBundle.getText("ErrorRecordedData"), {
					styleClass: "sapUiSizeCompact"
				});
				oTable.setBusy(false);
			}*/

		},

		handleCancelar: function (evt) {
			this._limparTela();
		},

		_limparTela: function () {

			let oMultiInput = this.byId("idMultiInputLabelNumber");
			let aFilter = [];
			let oTable = this.byId("idTablePicking");

			oMultiInput.removeAllTokens();
			oTable.getBinding("items").filter(aFilter);
		},

		_onReset: function () {
			this._limparTela();
		}
	});
});