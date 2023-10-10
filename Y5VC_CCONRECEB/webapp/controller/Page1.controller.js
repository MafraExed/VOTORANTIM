sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"../model/nfHeaderModel",
	"../model/nfHeaderListModel",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/resource/ResourceModel",
	"sap/m/SearchField",
	"sap/m/MessageToast",
	"sap/m/Token"

], function (BaseController, MessageBox, Utilities, History, Filter, NFHeaderModel, NFHeaderListModel,
	JSONModel, formatter, ResourceModel, SearchField, MessageToast, Token) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.operadorLogisticoCons.controller.Page1", {
		handleRouteMatched: function (oEvent) {

			var sAppId = "App5c06d9238147af3ab5537f2a";
			let oView = this.getView();
			var vIsAlmox = Utilities.isAlmox(oView);
			var vIsOplog = Utilities.isOpLog(oView);
			//vIsOplog = true;
			var oModel = new JSONModel({
				"oplog": vIsOplog,
				"almox": vIsAlmox
			});
			this.getView().setModel(oModel, "Role");

			this.getView().getModel("NFHEADER").setHeaders(Utilities.getRoleHeaders(oView));

			this._onSearch();
		},
		_onSearch: function () {

			let oTable = this.getView().byId("tbNF");
			var aFilters = [];
			for (let oInput of this.aInputs) {
				let oControl = this.getView().byId(oInput.sInput);
				if (oControl) {
					// MultiInput
					if (oControl.getTokens) {
						let oTokens = oControl.getTokens();
						if (oTokens) {
							for (let oToken of oTokens) {
								aFilters.push(new sap.ui.model.Filter(oInput.vProperty, sap.ui.model.FilterOperator.EQ, oToken.getKey()));
							}
						}
					} else {
						// Combo Box
						if (oControl.getSelectedKeys) {
							for (let vSelectKey of oControl.getSelectedKeys()) {
								let vStr = "";
								vStr = vSelectKey.toString();
								aFilters.push(new sap.ui.model.Filter(oInput.vProperty, sap.ui.model.FilterOperator.EQ, vStr));
							}
						}
					}
				}
			}
			if (aFilters) {
				oTable.getBinding("items").filter(aFilters, sap.ui.model.FilterType.Application);
				//var vFilter = new sap.ui.model.Filter({filters: aFilters});
				//oTable.getBinding("items").filter(vFilter, sap.ui.model.FilterType.Application );
			}

		},
		_onSubmit: function (oEvent) {

			let vId = oEvent.getParameter("id");
			let vValue = oEvent.getParameter("value").toString();
			let oFilter = {};

			for (let oInput of this.aInputs) {
				if (vId.search(oInput.sPath) > -1) {
					oFilter = "empty";
					for (oFilter of this.aFilters) {
						if (oFilter.sPath === oInput.sPath) {
							oFilter.oValue1 = vValue;
							break;
						}
						oFilter = "empty";
					}
					if (oFilter === "empty") {
						this.aFilters.push(new sap.ui.model.Filter(oInput.sPath, sap.ui.model.FilterOperator.EQ, vValue));
					}
					break;
				}
			}
		},

		_onItemPress: function (oEvent) {
			var oParam = oEvent.getParameter("listItem");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oCtx = oParam.getBindingContext("NFHEADER");

			oRouter.navTo("NFdetail", {
				chvNfe: oCtx.getProperty("Chvnfe")
			});
		},
		_cProcessSuccess: function (oView, oModel) {
			oView.setModel(oModel, "NFHEADERLIST");
			//oView.byId("tbNF").setBusy(false);
		},

		_onOpenDialog: function () {
			var oView = this.getView();
			var oDialog = this.byId("helloDialog");
			// create dialog lazily
			if (!oDialog) {
				// load asynchronous XML fragment
				sap.ui.xmlfragment(oView.getId(),
					"com.sap.build.standard.operadorLogistico.view.FileUploadDialog",
					this);
				oView.addDependent(oDialog);
			}
			this.byId("helloDialog").open();
		},

		_onCloseDialog: function () {
			this.byId("helloDialog").close();
		},

		doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel() : null;

			var sEntityNameSet;
			if (sPath !== null && sPath !== "") {
				if (sPath.substring(0, 1) === "/") {
					sPath = sPath.substring(1);
				}
				sEntityNameSet = sPath.split("(")[0];
			}
			var sNavigationPropertyName;
			var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

			if (sEntityNameSet !== null) {
				sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet,
					sRouteName);
			}
			if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
				if (sNavigationPropertyName === "") {
					this.oRouter.navTo(sRouteName, {
						context: sPath,
						masterContext: sMasterContext
					}, false);
				} else {
					oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function (bindingContext) {
						if (bindingContext) {
							sPath = bindingContext.getPath();
							if (sPath.substring(0, 1) === "/") {
								sPath = sPath.substring(1);
							}
						} else {
							sPath = "undefined";
						}

						// If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
						if (sPath === "undefined") {
							this.oRouter.navTo(sRouteName);
						} else {
							this.oRouter.navTo(sRouteName, {
								context: sPath,
								masterContext: sMasterContext
							}, false);
						}
					}.bind(this));
				}
			} else {
				this.oRouter.navTo(sRouteName);
			}

			if (typeof fnPromiseResolve === "function") {
				fnPromiseResolve();
			}

		},
		_onFioriListReportTableUpdateFinished: function (oEvent) {
			var oTable = oEvent.getSource();
			var oHeaderbar = oTable.getAggregation("headerToolbar");
			if (oHeaderbar && oHeaderbar.getAggregation("content")[1]) {
				var oTitle = oHeaderbar.getAggregation("content")[1];
				if (oTable.getBinding("items") && oTable.getBinding("items").isLengthFinal()) {
					oTitle.setText("(" + oTable.getBinding("items").getLength() + ")");
				} else {
					oTitle.setText("(1)");
				}
			}

		},

		/*_submitMultInput: function (oEvent) {

			var oSource = oEvent.getSource();
			oSource.addToken(new Token({
				key: oSource.getValue(),
				text: oSource.getValue()
			}));
			oSource.setValue("");

		},*/
		_onSuggestionItemSelected: function (oEvent) {

			var oCtx = oEvent.getParameter("selectedRow").getBindingContext("NFHEADER");

			this._onSetKeys(oCtx);

		},
		_onSetKeys: function (oCtx) {

			for (let oInput of this.aInputs) {
				let oControl = this.getView().byId(oInput.sInput);
				if (oControl) {
					if (oControl.addToken) {
						let key = oCtx.getProperty(oInput.vProperty);
						let text = oCtx.getProperty(oInput.vProperty).toString();

						oControl.addToken(new Token({
							key: key,
							text: text
						}));
					}
				}
			}

		},
		_onPressLogGR: function (oEvent) {

			let oView = this.getView();
			let aFilters = [];
			let oTable = this.getView().byId("tbNF");
			let oContext = oTable.getSelectedContexts();
			var oTranslationModel = oView.getModel("i18n");
			var oBundle = oTranslationModel.getResourceBundle();

			// Verifica se alguma linha foi selecionada
			if (!oContext) {
				MessageBox.error(oBundle.getText("errorNoneNfeSelected"), {
					title: oBundle.getText("error"),
					styleClass: "sapUiSizeCompact"
				});
				return;
			}

			for (let oCtx of oContext) {
				let sFilter = new sap.ui.model.Filter({
					path: "Chvnfe",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: oCtx.getProperty("Chvnfe")
				});
				aFilters.push(sFilter);
			}

			var oDialog = oView.byId("idDialogTableLog");
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "com.sap.build.standard.operadorLogisticoCons.view.LogTableDialog", this);
				// connect dialog to view (models, lifecycle)
				oView.addDependent(oDialog);
			}
			let oTableLog = this.byId("idTbTableLog");
			if (oTableLog) {
				oTableLog.getBinding("items").filter(aFilters, sap.ui.model.FilterType.Application);
			}
			oDialog.open();

		},
		_onCloseLogGR: function () {
			this.byId("idDialogTableLog").close();
		},

		_onPressGR: function (oEvent) {

			let oView = this.getView();
			let oTable = oView.byId("tbNF");
			let oModel = oView.getModel("NFHEADER");

			let oBundle = oView.getModel("i18n").getResourceBundle();

			let oContext = oTable.getSelectedContexts();

			// Verifica se alguma linha foi selecionada
			if (!oContext) {
				MessageBox.error(oBundle.getText("errorNoneNfeSelected"), {
					title: oBundle.getText("errorTitle"),
					styleClass: "sapUiSizeCompact"
				});
				return;
			}
			oTable.setBusy(true);

			var mParameters = {
				groupId: "gpIDUpdNFHeader",
				success: function (oData, oResp) {
					if (oData) {
						MessageBox.success(oBundle.getText("GrScheduled"), {
							styleClass: "sapUiSizeCompact"
						});
						oModel.refresh();

					}
					oTable.setBusy(false);
				},
				error: function (odata, resp) {
					MessageBox.success(oBundle.getText("ErrorGrScheduled"), {
						styleClass: "sapUiSizeCompact"
					});
					oTable.setBusy(false);
				}
			};
			oModel.setDeferredGroups(["gpIDUpdNFHeader"]);
			for (let oCtx of oContext) {

				if (oCtx.getProperty("statusNfe") !== "93") {
					MessageBox.error(oBundle.getText("errorOnlyErrorGR"), {
						title: oBundle.getText("errorTitle"),
						styleClass: "sapUiSizeCompact"
					});
					oTable.setBusy(false);
					return;
				} else {
					let oNfheader = {};
					oNfheader.Chvnfe = oCtx.getProperty("Chvnfe");
					oNfheader.statusNfe = "94"; // Reprocessar E.M.
					oModel.update("/ZET_VCMM_NFHEADERSet(Chvnfe='" + oNfheader.Chvnfe + "')", oNfheader, {
						groupId: "gpIDUpdNFHeader"
					});
					//mParameters);
				}
			}
			oModel.submitChanges(mParameters);
		},
		_checkSelectedLines: function (oContext) {

			let oView = this.getView();
			let oBundle = oView.getModel("i18n").getResourceBundle();

			if (oContext.length === 0) {
				MessageBox.error(oBundle.getText("errorNoneNfeSelected"), {
					title: oBundle.getText("errorTitle"),
					styleClass: "sapUiSizeCompact"
				});
				return false;
			}
			return true;
		},
		_onPressPrintVolumes: function (oEvent) {

			let oView = this.getView();
			let oBundle = oView.getModel("i18n").getResourceBundle();
			let oTable = oView.byId("tbNF");
			let oModel = oView.getModel("NFHEADER");
			let oContext = oTable.getSelectedContexts();
			let that = this;
			let boolVolZero = false;
			var vChvnfe = "";
			oTable.setBusy(true);
			// Verifica se alguma linha foi selecionada
			if (!this._checkSelectedLines(oContext)) {
				oTable.setBusy(false);
				return;
			}
			// Se somatório de volumes impressos é menor que o limite (500)
			if (!this._checkMaximumVolumesAllowed(oContext)) {
				oTable.setBusy(false);
				return;
			}

			//Verifica se NF-es tem status válido para impressão de volumes
			if (!this._checkValidStatusForPrintVolumes(oContext)) {
				oTable.setBusy(false);
				return;
			}

			//Verifica se Incoterms é válido para impressão de volumes
			if (!this._checkValidIncotermsForPrintVolumes(oContext)) {
				oTable.setBusy(false);
				return;
			} else {
				oContext = oTable.getSelectedContexts();
			}

			var mParameters = {
				groupId: "gpIDUpdNFHeader",
				success: (oData, oResp) => {

					if (oData.__batchResponses[0].response) {

						let responseText = oData.__batchResponses[0].response.body;
						let responseParser = JSON.parse(responseText);

						if (responseParser.error.innererror) {
							MessageBox.error(responseParser.error.innererror.errordetails[0].message, {
								styleClass: "sapUiSizeCompact"
							});
						} else {
							MessageBox.error(responseParser.error.message.value, {
								styleClass: "sapUiSizeCompact"
							});
						}

					} else {
						if (oData) {

							var string = oModel.sServiceUrl +
								"/ZET_VCMM_FILESet(fileName='" + vChvnfe + "',fileCategory='VOL',fileDescription='PE')/$value";
							window.open(string);

							MessageBox.success(oBundle.getText("LabelGeneratedSuccess"), {
								styleClass: "sapUiSizeCompact"
							});
						}
					}
					oTable.setBusy(false);
					that._onSearch();
				},
				error: function (odata, resp) {
					MessageBox.error(oBundle.getText("ErrorPrintVolLabel"), {
						styleClass: "sapUiSizeCompact"
					});
					oTable.setBusy(false);
				}
			};
			oModel.setDeferredGroups(["gpIDUpdNFHeader"]);
			for (let oCtx of oContext) {
				let oNfheader = {};
				oNfheader.vol = oCtx.getProperty("vol");

				// Verifica se quantidade de volumes é maior que zero
				if (oNfheader.vol > 0) {
					oNfheader.Chvnfe = oCtx.getProperty("Chvnfe");
					oNfheader.statusNfe = "60"; // Imprimir Etiqueta Volumes

					oModel.update("/ZET_VCMM_NFHEADERSet(Chvnfe='" + oNfheader.Chvnfe + "')", oNfheader, {
						groupId: "gpIDUpdNFHeader"
					});

					//mParameters);
					if (vChvnfe === "") {
						vChvnfe = oNfheader.Chvnfe;
					}
				} else {
					boolVolZero = true;
				}
			}
			if (boolVolZero) {
				MessageBox.error(oBundle.getText("ErrorPrintVolZero"), {
					styleClass: "sapUiSizeCompact"
				});
				oTable.setBusy(false);
			}

			oModel.submitChanges(mParameters);

		},

		_checkValidIncotermsForPrintVolumes: function (oContext) {

			let oView = this.getView();
			let oBundle = oView.getModel("i18n").getResourceBundle();
			let boolValidItem = false;
			let boolValidStatus = true;
			let boolValidInco = true;
			let errorItem = false;

			let oTable = oView.byId("tbNF");
			let oSelectedItems = oTable.getSelectedItems();

			// Verifica se Incoterms é válido para impressão de volumes
			for (let oCtx of oSelectedItems) {

				errorItem = false;

				if (oCtx.getBindingContext("NFHEADER").getProperty("Incoterms") == "CIF" && oCtx.getBindingContext("NFHEADER").getProperty(
						"Transf") == "") {
					boolValidStatus = false;
					errorItem = true;
				}

				if (oCtx.getBindingContext("NFHEADER").getProperty("DifInco") == "X") {
					boolValidInco = false;
					errorItem = true;
				}

				if (errorItem) { //Chave inválida para impressão
					oCtx.setSelected(false);
				} else {
					boolValidItem = true; //Chave válida para impressão
				}

			}

			if (!boolValidStatus) {
				MessageBox.warning(oBundle.getText("ErrorInvalidIncotermsVolumesPrint"), {
					styleClass: "sapUiSizeCompact"
				});
			}

			if (!boolValidInco) {
				MessageBox.warning(oBundle.getText("ErrorInvalidDiferenceInco"), {
					styleClass: "sapUiSizeCompact"
				});
			}

			if (!boolValidItem) {
				MessageBox.error(oBundle.getText("ErroInvalidPrint"), {
					styleClass: "sapUiSizeCompact"
				});
			}

			return boolValidItem;

		},

		_checkValidStatusForPrintVolumes: function (oContext) {

			let oView = this.getView();
			let oBundle = oView.getModel("i18n").getResourceBundle();
			let boolValidStatus = true;

			// Verifica status para impressão de volumes
			for (let oCtx of oContext) {

				// Status menores que Pré conciliação "03" 
				// OU
				// Status maiores que Embarque 
				// São inválido para impressão de volumes

				if (oCtx.getProperty("statusNfe") < "03" ||
					oCtx.getProperty("statusNfe") >= "08") {
					boolValidStatus = false;
				}
			}

			if (!boolValidStatus) {
				MessageBox.error(oBundle.getText("ErrorInvalidStatusVolumesPrint"), {
					styleClass: "sapUiSizeCompact"
				});
			}
			return boolValidStatus;
		},

		_checkMaximumVolumesAllowed: function (oContext) {

			let oView = this.getView();
			let oBundle = oView.getModel("i18n").getResourceBundle();
			let vSumVol = 0;

			for (let oCtx of oContext) {
				vSumVol = vSumVol + parseInt(oCtx.getProperty("vol"), 10);
			}

			if (vSumVol > 500) {
				MessageBox.error(oBundle.getText("ErrorPrintVolTooMany"), {
					styleClass: "sapUiSizeCompact"
				});
				return false;
			}
			return true;
		},

		_onPressSave: function (oEvent) {

			let oView = this.getView();
			let oBundle = oView.getModel("i18n").getResourceBundle();
			let oTable = oView.byId("tbNF");
			let oModel = oView.getModel("NFHEADER");
			let bInvalidValue = false;
			let bInvalidZeroValue = false;
			let bInvalidTooLargeValue = false;
			let aEntitiesToResetChanges = [];
			let vMessage = "";

			if (oModel.hasPendingChanges() === true) {

				oTable.setBusy(true);

				// Só é possível alterar quantidade de volumes no StatusNfe === 04
				// Após o status 04 qualquer alteração será revogada 
				for (let oLine of oTable.getItems()) {
					let oCtx = oLine.getBindingContext("NFHEADER");

					// Verifica se teve alterações
					if (oCtx.getModel("NFHEADER").getPendingChanges()[oCtx.getInterface().getPath().substring(1)]) {

						let vPropertyStatusNfe = oCtx.getProperty("statusNfe");

						// Status é maior que impressão de etiquetas de volumes
						// Reinicia Valores
						if (vPropertyStatusNfe > "07") {
							aEntitiesToResetChanges.push(oCtx.getPath());
							bInvalidValue = true;
						} else {
							let vPropertyVol = oCtx.getProperty("vol");
							// Valor de etiquetas é menor ou igual a 0
							if (parseInt(vPropertyVol, 10) <= 0) {
								aEntitiesToResetChanges.push(oCtx.getPath());
								bInvalidZeroValue = true;
							} else {
								if (parseInt(vPropertyVol, 10) > 500) {
									aEntitiesToResetChanges.push(oCtx.getPath());
									bInvalidTooLargeValue = true;
								}
							}
						}
					}

					// Reverte valores para valores originais				
					if (aEntitiesToResetChanges.length > 0) {
						oModel.resetChanges(aEntitiesToResetChanges);
					}
				}

				// Há alterações?
				if (oModel.hasPendingChanges() === true) {
					var mParameters = {
						//groupId: "gpIDUpdNFHeader",
						success: (oData, oResp) => {
							if (oData) {

								// Verifica se tivemos erro na execução
								if (oData.__batchResponses[0].response) {
									let responseText = oData.__batchResponses[0].response.body;
									let responseParser = JSON.parse(responseText);
									if (responseParser.error.innererror) {
										MessageBox.error(responseParser.error.innererror.errordetails[0].message, {
											styleClass: "sapUiSizeCompact"
										});
									} else {
										MessageBox.error(responseParser.error.message.value, {
											styleClass: "sapUiSizeCompact"
										});
									}

								} else {

									// Monta mensagem de acordo com verifica de status e quantidade
									// Dados gravados com sucesso
									vMessage = oBundle.getText("RecordedData");
									if (bInvalidValue) {
										// Alterações de quantidade com status diferente de impressão de volumes foram revertidas
										vMessage = vMessage + " " + oBundle.getText("errorInvalidStatusVolume");
										MessageBox.success(vMessage, {
											styleClass: "sapUiSizeCompact"
										});

									} else {

										if (bInvalidZeroValue) {
											//Quantidade de volumes 0 é inválida. Alterações incorretas foram revertidas
											vMessage = vMessage + " " + oBundle.getText("errorInvalidZeroValue");
											MessageBox.success(vMessage, {
												styleClass: "sapUiSizeCompact"
											});
										} else {
											if (bInvalidTooLargeValue) {
												// Quantidade de volumes é muito grande
												vMessage = vMessage + " " + oBundle.getText("errorInvalidTooLargeValue");
											} else {
												// Dados gravados com sucesso
												MessageToast.show(vMessage);
											}
										}
									}
								}
							}
							this._onPressCancelEdit();
							oTable.setBusy(false);
						},
						error: (odata, resp) => {
							MessageBox.error(oBundle.getText("ErrorRecordedData"), {
								styleClass: "sapUiSizeCompact"
							});
							oTable.setBusy(false);
						}
					};
					oModel.submitChanges(mParameters);
				} else {
					oTable.setBusy(false);

					vMessage = oBundle.getText("DataNotModified");
					if (bInvalidValue) {
						// // Alterações de quantidade com status diferente de impressão de volumes foram revertidas
						vMessage = vMessage + " " + oBundle.getText("errorInvalidStatusVolume");
					} else {
						if (bInvalidZeroValue) {
							// Quantidade de volumes 0 é inválida. Alterações incorretas foram revertidas
							vMessage = vMessage + " " + oBundle.getText("errorInvalidZeroValue");
						} else {
							if (bInvalidTooLargeValue) {
								// Quantidade de volumes é muito grande
								vMessage = vMessage + " " + oBundle.getText("errorInvalidTooLargeValue");
							}
						}

					}

					MessageBox.error(vMessage, {
						styleClass: "sapUiSizeCompact"
					});

					this._onPressCancelEdit();
				}

			}
		},

		_onBtnTemplateCubagem: function (oEvent) {

			let oView = this.getView();
			let oModel = oView.getModel("NFHEADER");
			let oBundle = oView.getModel("i18n").getResourceBundle();

			//Recupera template de cubagem
			var string = oModel.sServiceUrl +
				"/ZET_VCMM_FILESet(fileName='Tempate_cubagem.csv',fileCategory='CN',fileDescription='AT')/$value";
			window.open(string);

			MessageBox.success(oBundle.getText("CubGeneratedSuccess"), {
				styleClass: "sapUiSizeCompact"
			});
		},

		_changeVisibilityButtons: function (aButtons, vValue) {
			for (let vButton of aButtons) {
				let oControl = this.byId(vButton);
				if (oControl) {
					oControl.setVisible(vValue);
				}
			}
		},
		_onPressEdit: function (oEvent) {

			this._changeVisibilityButtons(this._getButtons2HideOnEdit(), false);
			this._changeVisibilityButtons(this._getButtons2ShowOnEdit(), true);
			this.rebindTable(this.oEditableTemplate, "Edit");
			this._onSearch();

		},
		_getButtons2ShowOnEdit: function () {

			let aButtons = [];
			aButtons.push("idBtnCancelEdit");
			aButtons.push("idBtnSave");
			return aButtons;
		},
		_getButtons2HideOnEdit: function () {

			let aButtons = [];
			aButtons.push("idBtnPrintVolumes");
			aButtons.push("idBtnEdit");
			aButtons.push("idBtnTemplateCubagem");

			//aButtons.push("idBtnCancelEdit");
			//aButtons.push("idBtnSave");
			return aButtons;
		},
		_onPressCancelEdit: function () {

			let oModel = this.getView().getModel("NFHEADER");
			oModel.resetChanges();

			this._changeVisibilityButtons(this._getButtons2HideOnEdit(), true);
			this._changeVisibilityButtons(this._getButtons2ShowOnEdit(), false);

			this.rebindTable(this.oReadOnlyTemplate, "Navigation");
			this._onSearch();
		},
		onInit: function () {

			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			this._nFheaderList = NFHeaderListModel.getInstance();
			this.aFilters = [];
			this.aInputs = [{
				sPath: "Chvnfe",
				sInput: "ipchvnfe",
				vProperty: "Chvnfe"
			}, {
				sPath: "nfenum",
				sInput: "ipnfenum",
				vProperty: "nfenum"
			}, {
				sPath: "fornecedor",
				sInput: "ipFornecedor",
				vProperty: "fornecedor"
			}, {
				sPath: "etapa",
				sInput: "ipEtapa",
				vProperty: "statusNfe"
			}, {
				sPath: "branch",
				sInput: "ipFilial",
				vProperty: "branch"
			}, {
				sPath: "Inco1",
				sInput: "ipIncoterms",
				vProperty: "Inco1"
			}];

			//para possibilitar copiar e colar conteudo
			var oMultiInput = this.getView().byId("ipchvnfe");
			oMultiInput.setWidth("400px");
			//*** add checkbox validator
			var fValidator = function (args) {
				var text = args.text;
				return new Token({
					key: text,
					text: text
				});
			};

			oMultiInput.addValidator(fValidator);

			var fValidatorNfe = function (args) {
				var text = args.text;

				while (text.length < 9)
					text = "0" + text;

				return new Token({
					key: text,
					text: text
				});
			};

			oMultiInput = this.getView().byId("ipnfenum");
			oMultiInput.addValidator(fValidatorNfe);

			var fValidatorLifnr = function (args) {
				var text = args.text;

				while (text.length < 10)
					text = "0" + text;

				return new Token({
					key: text,
					text: text
				});
			};

			oMultiInput = this.getView().byId("ipFornecedor");
			oMultiInput.addValidator(fValidatorNfe);

			var oComboBox = this.getView().byId("ipEtapa");

			//oComboBox.addSelectedKeys("00");
			oComboBox.addSelectedKeys("03");
			this.oTable = this.byId("tbNF");
			this.oReadOnlyTemplate = this.byId("tbNF").removeItem(0);
			this.rebindTable(this.oReadOnlyTemplate, "Navigation");
			this.oEditableTemplate = new sap.m.ColumnListItem({
				cells: [
					new sap.ui.core.Icon({
						src: "{NFHEADER>statusIcon}",
						color: "{NFHEADER>statusColor}",
						size: "24px",
						height: "32px",
						width: "32px"
					}),
					new sap.m.Text({
						text: "{NFHEADER>statusNfeDescr}",
						width: "auto",
						wrapping: true
					}),
					new sap.m.ObjectStatus({
						text: "{NFHEADER>Incoterms}",
						state: "{NFHEADER>IncotermsColor}",
						width: "auto"
					}),
					new sap.m.Text({
						text: "{NFHEADER>etapa}",
						width: "auto",
						wrapping: true
					}),

					new sap.m.ObjectStatus({
						text: "{NFHEADER>StatusBoDescr}",
						state: "{NFHEADER>StatusBoColor}",
						width: "auto"
					}),
					new sap.m.Text({
						text: "{NFHEADER>nfenum}",
						width: "auto"
					}),
					new sap.m.Text({
						text: "{NFHEADER>series}",
						width: "auto"
					}),
					new sap.m.ObjectIdentifier({
						title: "{NFHEADER>fornecedorNome}",
						text: "{NFHEADER>fornecedor}"
					}),
					new sap.m.Input({
						value: "{NFHEADER>vol}",
						type: sap.m.InputType.String,
						constraints: "{isDigitSequence : true,	maxLength : 3}",
						width: "4.5em"
					}),
					new sap.m.ObjectIdentifier({
						title: "{NFHEADER>descricaoFilial}",
						text: "{NFHEADER>branch}"
					})
				]
			});

			this.oRouter.getTarget("Page1").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

		},

		onExit: function () {

			// to destroy templates for bound aggregations when templateShareable is true on exit to prevent duplicateId issue
			/*var aControls = [{
				"controlId": "Fiori_ListReport_ListReport_0-content-Fiori_ListReport_Table-1",
				"groups": ["items"]
			}];
			for (var i = 0; i < aControls.length; i++) {
				var oControl = this.getView().byId(aControls[i].controlId);
				for (var j = 0; j < aControls[i].groups.length; j++) {
					var sAggregationName = aControls[i].groups[j];
					var oBindingInfo = oControl.getBindingInfo(sAggregationName);
					var oTemplate = oBindingInfo.template;
					oTemplate.destroy();
				}
			}*/

		},
		handleUploadComplete: function (oEvent) {
			var sResponse = oEvent.getParameter("response");
			if (sResponse) {
				var sMsg = "";
				var m = /^\[(\d\d\d)\]:(.*)$/.exec(sResponse);
				if (m[1] == "200") {
					sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Success)";
					oEvent.getSource().setValue("");
				} else {
					sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Error)";
				}

				MessageToast.show(sMsg);
			}
		},

		_onTypeMissmatch: function (oEvent) {

			// Formato do arquivo é inválido
			let oView = this.getView();
			let oBundle = oView.getModel("i18n").getResourceBundle();

			MessageBox.error(oBundle.getText("errorTypeMissMatch"), {
				title: oBundle.getText("error"),
				styleClass: "sapUiSizeCompact"
			});

		},

		handleUploadPress: function (oEvent) {

			jQuery.sap.log.debug("onHandleUploadPress");

			var oFileUploader = this.getView().byId("fileUploader");
			var t = this;
			var fU = this.getView().byId("fileUploader");
			var domRef = fU.getFocusDomRef();
			var file = domRef.files[0];
			try {
				if (file) {
					var that = this;
					var oView = that.getView();
					var oTable = oView.byId("tbNF");

					/****************To Fetch CSRF Token*******************/
					oTable.setBusy(true);
					var sUrl = that.getView().getModel("NFHEADER").sServiceUrl + "/ZET_VCMM_FILESet";
					$.ajax({
						url: sUrl,
						type: "GET",
						beforeSend: function (xhr) {
							xhr.setRequestHeader("X-CSRF-Token", "Fetch");
						},
						success: function (data, textStatus, XMLHttpRequest) {
							var vFileCategory = "CN";
							var oToken = XMLHttpRequest.getResponseHeader("X-CSRF-Token");
							var oHeaders = {
								"x-csrf-token": oToken
							};

							/****************To Fetch CSRF Token*******************/

							/*******************To Upload File************************/

							var oURL = that.getView().getModel("NFHEADER").sServiceUrl +
								"/ZET_VCMM_FILESet(fileName='" + file.name + "',fileCategory='" + vFileCategory + "',fileDescription='Cubagem')/$value";
							$.ajax({
								type: "PUT",
								url: oURL,
								headers: oHeaders,
								cache: false,
								contentType: ["txt"],
								processData: false,
								data: file,
								success: function (oData) {
									that._onUploadSuccess(oData, that);
								},
								error: function (oData, oError) {
									that._onUploadError(oData, that);

								}
							});
						}
					});
				}
			} catch (oException) {
				jQuery.sap.log.error("File upload failed:\n" + oException.message);
				this._onUploadError(null, that);
			}
		},

		_onUploadSuccess: function (oData, oThat) {

			jQuery.sap.log.debug("onUploadCompleted");
			let oView = oThat.getView();
			let oTable = oView.byId("tbNF");
			let oFileUploader = oThat.getView().byId("fileUploader");
			oFileUploader.clear();
			oFileUploader.setAdditionalData(null);

			oTable.setBusy(false);

			let oBundle = oView.getModel("i18n").getResourceBundle();

			MessageToast.show(oBundle.getText("uploadCompleted"));
		},

		_onUploadError: function (oData, oThat) {
			jQuery.sap.log.debug("onUploadError");

			let oView = oThat.getView();
			let oTable = oView.byId("tbNF");
			let oBundle = oView.getModel("i18n").getResourceBundle();
			let oFileUploader = oThat.getView().byId("fileUploader");
			oFileUploader.clear();
			oFileUploader.setAdditionalData(null);

			oTable.setBusy(false);

			if (oData.responseXML) {
				let strJson = JSON.stringify(oThat.xmlToJson(oData.responseXML));
				MessageBox.error(JSON.parse(strJson).error.message["#text"], {
					styleClass: "sapUiSizeCompact"
				});
			} else {

				MessageBox.error(oBundle.getText("Erro ao importar arquivo"), {
					styleClass: "sapUiSizeCompact"
				});
			}

		},

		handleTypeMissmatch: function (oEvent) {
			var aFileTypes = oEvent.getSource().getFileType();
			jQuery.each(aFileTypes, function (key, value) {
				aFileTypes[key] = "*." + value;
			});
			var sSupportedFileTypes = aFileTypes.join(", ");
			MessageToast.show("The file type *." + oEvent.getParameter("fileType") +
				" is not supported. Choose one of the following types: " +
				sSupportedFileTypes);
		},

		handleValueChange: function (oEvent) {
			MessageToast.show("Press 'Upload File' to upload file '" +
				oEvent.getParameter("newValue") + "'");
		},
		rebindTable: function (oTemplate, sKeyboardMode) {
			this.oTable.bindItems({
				path: "NFHEADER>/ZET_VCMM_NFHEADERSet",
				template: oTemplate
			}).setKeyboardMode(sKeyboardMode);

		},

		// Changes XML to JSON
		xmlToJson: function (xml) {

			// Create the return object
			var obj = {};

			if (xml.nodeType === 1) { // element
				// do attributes
				if (xml.attributes.length > 0) {
					obj["@attributes"] = {};
					for (var j = 0; j < xml.attributes.length; j++) {
						var attribute = xml.attributes.item(j);
						obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
					}
				}
			} else if (xml.nodeType === 3) { // text
				obj = xml.nodeValue;
			}

			// do children
			if (xml.hasChildNodes()) {
				for (var i = 0; i < xml.childNodes.length; i++) {
					var item = xml.childNodes.item(i);
					var nodeName = item.nodeName;
					if (typeof (obj[nodeName]) === "undefined") {
						obj[nodeName] = this.xmlToJson(item);
					} else {
						if (typeof (obj[nodeName].push) === "undefined") {
							var old = obj[nodeName];
							obj[nodeName] = [];
							obj[nodeName].push(old);
						}
						obj[nodeName].push(this.xmlToJson(item));
					}
				}
			}
			return obj;
		},

		_onCompleteNfe: function () {

			let oView = this.getView();
			let oTable = oView.byId("tbNF");
			let oModel = oView.getModel("NFHEADER");
			let oSelectedContexts = oTable.getSelectedContexts();
			let that = this;
			let strChangesetId = "NFeHeaderChangeID";

			this._setBusy(that);
			// Verifica se alguma linha foi selecionada
			if (!this._checkSelectedLines(oSelectedContexts)) {
				this._setBusy(that);
				return;
			}

			if (oSelectedContexts) {
				let mParameters = {
					groupId: strChangesetId,
					success: (oData, oResp) => {
						that.handleSuccess(oData, oResp, that);
					},
					error: (oData, oResp) => {
						that.handleError(oData, oResp, that);
					}
				};
				oModel.setDeferredGroups([strChangesetId]);

				for (let oContext of oSelectedContexts) {
					let oNfeheader = {};
					oNfeheader.chvnfe = oContext.getProperty("Chvnfe");

					oModel.callFunction("/finalizarNfe", {
						method: "POST", // http method
						urlParameters: oNfeheader,
						groupId: strChangesetId
					}); // function import pa
				}
				oModel.submitChanges(mParameters);
			}
		},

		handleSuccess: function (oData, oResp, oThat) {

			let oView = oThat.getView();
			let oBundle = oView.getModel("i18n").getResourceBundle();

			if (oData.__batchResponses[0].response) {

				let responseText = oData.__batchResponses[0].response.body;
				let responseParser = JSON.parse(responseText);

				if (responseParser.error.innererror) {
					MessageBox.error(responseParser.error.innererror.errordetails[0].message, {
						styleClass: "sapUiSizeCompact"
					});
				} else {
					MessageBox.error(responseParser.error.message.value, {
						styleClass: "sapUiSizeCompact"
					});
				}
			} else {
				MessageBox.success(oBundle.getText("RecordedData"), {
					styleClass: "sapUiSizeCompact"
				});
			}
			this._setBusy(oThat);
			this._onSearch();
		},

		handleError: function (oData, oResp, oThat, vOperation) {

			let oView = oThat.getView();
			let oBundle = oView.getModel("i18n").getResourceBundle();

			MessageBox.error(oBundle.getText("ErrorRecordedData"), {
				styleClass: "sapUiSizeCompact"
			});

			this._setBusy(oThat);
		},

		_setBusy: function (oThat) {
			let oView = oThat.getView();
			let oTable = oView.byId("tbNF");
			oTable.setBusy(!oTable.getBusy());
		},
		onUpdateFinished: function (oEvent) {
			let oView = this.getView();
			let oBundle = oView.getModel("i18n").getResourceBundle();
			var oTitle = this.getView().byId("title_total_nf");
			if (oEvent.getSource().getBinding("items").isLengthFinal()) {
				var iCount = oEvent.getParameter("total");
				oTitle.setText(oBundle.getText("txt_title_documents") + " (" + iCount + ")");

			}
		}

	});
}, /* bExport= */ true);