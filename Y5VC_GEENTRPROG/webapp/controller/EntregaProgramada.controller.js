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
	"sap/ui/model/Sorter",
	"sap/ui/core/mvc/Controller",
	"sap/m/Token",
], function (Button, Dialog, Label, MessageToast, Text, TextArea, MessageBox, JSONModel, ResourceModel, Filter, Sorter, Controller, Token) {
	"use strict";

	return Controller.extend("workspace.zmonitor_entprog.controller.EntregaProgramada", {
		onInit: function () {

			let oView = this.getView();
			let oJSONModel = new JSONModel({});
			oView.setModel(oJSONModel, "PKGLST");

			//para possibilitar copiar e colar conteudo
			var oMultiInput = this.getView().byId("idMultiInputLabelNumber");
			//oMultiInput.setWidth("500px");
			//*** add checkbox validator
			var fValidator = function (args) {
				var text = args.text;
				return new Token({
					key: text,
					text: text
				});
			};

			oMultiInput.addValidator(fValidator);

			oMultiInput = this.getView().byId("idMultiInputWerks");
			oMultiInput.addValidator(fValidator);

			// Keeps reference to any of the created sap.m.ViewSettingsDialog-s in this sample
			this._mViewSettingsDialogs = {};

			var oViewModel = new sap.ui.model.json.JSONModel({
				bHideColumn: true
			});

			this.getView().setModel(oViewModel, "viewProperties");

		},

		_onSearch: function (evt) {

			let oSelect = this.byId("idSelCatPkg");
			let oMultiInput = this.byId("idMultiInputLabelNumber");
			let oInputUnloadPoint = this.byId("idIPUnloadPoint");
			let oInputWerks = this.byId("idMultiInputWerks");
			let oTranslationModel = this.getView().getModel("i18n");
			let oBundle = oTranslationModel.getResourceBundle();
			let aFilter = [];
			let oStockLevel = this.byId("idSelStLevel");
			var oLevel = oStockLevel.getSelectedKey();

			//Verifica se categoria do documento foi preenchida
			if (!oSelect.getSelectedItem()) {
				oSelect.setValueState("Error");
				oSelect.setValueStateText(oBundle.getText("input_required"));
				return;
			} else {
				oSelect.setValueState("None");
			}

			if (oSelect.getSelectedItem()) {
				aFilter.push(
					new sap.ui.model.Filter("Catpkg", sap.ui.model.FilterOperator.EQ, oSelect.getSelectedItem().getKey())
				);
			}

			if (oLevel) {
				if (oLevel == "01") { //Com Saldo
					aFilter.push(
						new sap.ui.model.Filter("QtdDisponivel", sap.ui.model.FilterOperator.GT, "0")
					);
				} else if (oLevel == "02") { //Saldo Zero
					aFilter.push(
						new sap.ui.model.Filter("QtdDisponivel", sap.ui.model.FilterOperator.EQ, "0")
					);
				}
			}

			for (let oToken of oMultiInput.getTokens()) {
				if (oToken.getKey() !== "") {
					aFilter.push(
						new sap.ui.model.Filter("Docpkg", sap.ui.model.FilterOperator.EQ, oToken.getKey())
					);
				}
			}

			for (let oToken of oInputWerks.getTokens()) {
				if (oToken.getKey() !== "") {
					aFilter.push(
						new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.EQ, oToken.getKey())
					);
				}
			}

			if (oInputUnloadPoint.getValue() !== "") {
				aFilter.push(
					new sap.ui.model.Filter("Ablad", sap.ui.model.FilterOperator.Contains, oInputUnloadPoint.getValue())
				);
			}

			let oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-dd"
			});

			let oDatePickerFrom = this.byId("idDPRequirementDateFrom");
			let oDatePickerTo = this.byId("idDPRequirementDateTo");
			let vValueFrom = oDatePickerFrom.getDateValue();
			let vValueTo = oDatePickerTo.getDateValue();

			vValueFrom = oDateFormat.format(vValueFrom);
			vValueTo = oDateFormat.format(vValueTo);

			if (vValueFrom !== "") {
				if (vValueTo === "") {
					aFilter.push(
						new sap.ui.model.Filter("Bdter", sap.ui.model.FilterOperator.EQ, vValueFrom)
					);
				} else {
					aFilter.push(
						new sap.ui.model.Filter("Bdter", sap.ui.model.FilterOperator.BT, vValueFrom, vValueTo)
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
			var indItemInvalidyError = false;
			var indItemDistinctError = false;
			var oDischargePoint;

			let oContexts = oTable.getSelectedContexts();
			//for (var oItem of oItems) {	

			for (let oCtx of oContexts) {

				//Todos os pontos de descarga selecionados devem ser iguais
				if (!oDischargePoint) {
					oDischargePoint = oCtx.getProperty("Ablad");
				} else {
					if (oDischargePoint != oCtx.getProperty("Ablad")) {
						indItemDistinctError = true;
					}
				}

				if (indItemDistinctError == false) {

					//Verificar se o ponto de descarga é permitido para realizar o picking.
					var oModelCtx = oCtx.getModel();
					var oAblad = oCtx.getProperty("Ablad").toUpperCase();
					var oZetVcmmPde = oModelCtx.getProperty("/ZET_VCMM_PDE_IHSet('" + oAblad + "')");
					if (oZetVcmmPde) {

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

					} else {
						indItemInvalidyError = true;
					}

				}

			}

			//Ponto de descarga inválido.Realiza alteração na reserva.
			if (indItemInvalidyError) {
				MessageBox.error(oBundle.getText("errorInvalidDischargPoint"), {
					title: oBundle.getText("error"),
					styleClass: "sapUiSizeCompact"
				});
				return;
			}

			//Não é possível criar lista de picking com pontos de descargas distintos
			if (indItemDistinctError) {
				MessageBox.error(oBundle.getText("erroDistinctDischargePoint"), {
					title: oBundle.getText("error"),
					styleClass: "sapUiSizeCompact"
				});
				return;
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

							if (vMsgIdpkg > 0) {
								MessageBox.success(oBundle.getText("PickingListCreated") + " " + vMsgIdpkg, {
									styleClass: "sapUiSizeCompact"
								});

							} else {
								//Erro no ECC
								//Ponto de descarga inválido.Realiza alteração na reserva.
								indItemInvalidyError = true;
								MessageBox.error(oBundle.getText("errorInvalidDischargPoint"), {
									title: oBundle.getText("error"),
									styleClass: "sapUiSizeCompact"
								});
							}
						} else {
							MessageBox.success(oBundle.getText("RecordedData"), {
								styleClass: "sapUiSizeCompact"
							});
						}

						if (!indItemInvalidyError) {
							this._limparTela();
						}
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
				//oModel.setProperty(oNewItem.getPath() + "/Docpkg", oCtx.getProperty("Docpkg"));
				oModel.setProperty(oNewItem.getPath() + "/Itmpkg", oCtx.getProperty("Itmpkg"));
				oModel.setProperty(oNewItem.getPath() + "/Catpkg", oCtx.getProperty("Catpkg"));
				oModel.setProperty(oNewItem.getPath() + "/Werks", oCtx.getProperty("Werks"));
				oModel.setProperty(oNewItem.getPath() + "/Matnr", oCtx.getProperty("Matnr"));
				oModel.setProperty(oNewItem.getPath() + "/Menge", oCtx.getProperty("QtdPicking"));
				oModel.setProperty(oNewItem.getPath() + "/Meins", oCtx.getProperty("Meins"));
				oModel.setProperty(oNewItem.getPath() + "/Aufnr", oCtx.getProperty("Aufnr"));
				oModel.setProperty(oNewItem.getPath() + "/EntregaProg", true);
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
		},

		_handleSortDialogConfirm: function (oEvent) {
			let oTable = this.byId("idTablePicking"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				aSorters = [];

			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));

			// apply the selected sort and group settings
			oBinding.sort(aSorters);
		},

		_createViewSettingsDialog: function (sDialogFragmentName) {
			var oDialog = this._mViewSettingsDialogs[sDialogFragmentName];
			let oView = this.getView();

			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(sDialogFragmentName, this);
				this._mViewSettingsDialogs[sDialogFragmentName] = oDialog;
				oView.addDependent(oDialog);
			}
			return oDialog;
		},
		_onSort: function () {
			this._createViewSettingsDialog("workspace.zmonitor_entprog.view.SortDialog").open();
		},

		onUpdateFinished: function (oEvent) {
			let oView = this.getView();
			let oBundle = oView.getModel("i18n").getResourceBundle();
			var oTitle = this.getView().byId("title_total_pkg");
			if (oEvent.getSource().getBinding("items").isLengthFinal()) {
				var iCount = oEvent.getParameter("total");
				oTitle.setText(oBundle.getText("txt_title_documents") + " (" + iCount + ")");

			}
		},
	});
});