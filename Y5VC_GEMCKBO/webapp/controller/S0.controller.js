sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/m/MessageBox",
	"../model/formatter",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text",
	"sap/ui/model/json/JSONModel",
	"sap/m/Token",
	"workspace/zcockpit_bo_v3/controller/ListManager",
	"sap/ui/export/Spreadsheet",
	"workspace/zcockpit_bo_v3/controller/VariantFilter"
], function (Controller, Filter, FilterOperator, Sorter, MessageBox, Formatter, Dialog, Button, Text, JSONModel, Token, ListManager,
	Spreadsheet, VariantFilter) {
	"use strict";

	const cStatusTodos = "";

	// Ajuste 10.09.2019 - Gustavo Cordeiro
	// Filtro por centro

	return Controller.extend("workspace.zcockpit_bo_v3.controller.S0", {
		myFormatter: Formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf workspace.zcockpit_bo_v3.view.S0
		 */
		onInit: function () {
			this._createModelStatus();
			this._loadInfoFilters();

			this.oView = this.getView();
			this.oBosTable = this.oView.byId("BosTable");
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("master").attachPatternMatched(this.handleRouteMatched, this);

			//Customização da tabela
			this.oBosTable.attachEventOnce("updateFinished", function (oEvent) {
				this._initP13N(oEvent.getSource());
			}.bind(this));
		},
		_initVariantTable: function () {
			var sIdVariant = "variantTable";
			this.oVariantTable = new VariantFilter(
				this.getView().byId(sIdVariant),
				this,
				sIdVariant,
				/*repassa valores de variante para tela */
				function (oThat, aData) {
					$.each(oThat.oBosTable.getColumns(), function (iIndex, oColumn) {
						var oColumnMng = aData.find(oColumnFlt => oColumnFlt.sColumnKey === oColumn.getId());
						if (oColumnMng && oColumnMng.sColumnVisible) {
							oColumn.setOrder(oColumnMng.iIndex);
							oColumn.setVisible(oColumnMng.sColumnVisible);
						} else {
							var iIndexNew = 90000 + iIndex;
							oColumn.setOrder(iIndexNew);
							oColumn.setVisible(false);
						}
					});
					oThat.oBosTable.invalidate();
				},
				/*repassa valores da tela para variante */
				function (oThat) {
					var oJsonData = [];
					var aColumns = oThat.oBosTable.getColumns();
					for (let oColumn of aColumns) {
						oJsonData.push({
							sColumnKey: oColumn.getId(),
							sColumnVisible: oColumn.getVisible(),
							iIndex: oColumn.getOrder()
						});
					}
					return oJsonData;
				}
			);
		},
		_initVariantFilter: function () {
			//controle de variante
			var sIdVariant = "variantFilter";
			this.oVariantFilter = new VariantFilter(
				this.getView().byId(sIdVariant),
				this,
				sIdVariant,
				/*repassa valores de variante para tela */
				function (oThat, aData) {
					for (let oInput of oThat.aInputs) {
						var oData;
						if (aData) {
							oData = aData.find(oDataFlt => oDataFlt.id === oInput.sInput);
						}
						let oControl = oThat.getView().byId(oInput.sInput);

						//oControl.setValue(aData[i].value);
						var sType = oControl.getMetadata().getName();
						switch (sType) {
						case "sap.m.MultiComboBox":
							oControl.setSelectedKeys([]);
							if (oData) {
								oControl.setSelectedKeys(oData.value);
							}
							break;
						case "sap.m.Select":
							oControl.setSelectedKey(false);
							if (oData) {
								oControl.setSelectedKey(oData.value);
							}
							break;
						case "sap.m.MultiInput":
							oControl.removeAllTokens();
							if (oData) {
								var listaToken = oData.value;
								//repassa cada token
								for (var j = 0; j < listaToken.length; j++) {
									oControl.addToken(new sap.m.Token({
										key: listaToken[j].key,
										text: listaToken[j].text
									}));
								}
							}
							break;
						default:
							if (oData) {
								oControl.setValue(oData.value);
							} else {
								oControl.setValue("");
							}
						}
					}
					oThat.oView.byId("filterBarBO").fireFilterChange();

					//Caso queira executar já após a seleção
					oThat.onSearch();
				},
				/*repassa valores da tela para variante */
				function (oThat) {
					var oJsonParam = null;
					var oJsonData = [];

					for (let oInput of oThat.aInputs) {
						let oControl = oThat.getView().byId(oInput.sInput);
						oJsonParam = {};

						oJsonParam.id = oInput.sInput;
						if (oControl) {
							//oJsonParam.value = oControl.getValue();
							var sType = oControl.getMetadata().getName();
							switch (sType) {
							case "sap.m.MultiComboBox":
								oJsonParam.value = oControl.getSelectedKeys();
								break;
							case "sap.m.Select":
								oJsonParam.value = oControl.getSelectedKey();
								break;
							case "sap.m.MultiInput":
								var oTokenVal = {};
								oJsonParam.value = [];

								var oListToken = oControl.getTokens();

								//add cada valor
								for (var j = 0; j < oListToken.length; j++) {
									oTokenVal.text = oListToken[j].getText();
									oTokenVal.key = oListToken[j].getKey();
									oJsonParam.value.push(oTokenVal);
								}

								break;
							default:
								oJsonParam.value = oControl._getInputValue();
							}

							oJsonData.push(oJsonParam);
						}
					}
					return oJsonData;
				}
			);
		},
		_handleGetFiltersWithValues: function () {
			var aFiltersWithValue = [];
			var aFilters = this.getFilterGroupItems();
			for (let i = 0; i < aFilters.length; i++) {
				let oControl = this.determineControlByFilterItem(aFilters[i]);
				var sType = oControl.getMetadata().getName();
				var bTemValor = false;

				switch (sType) {
				case "sap.m.MultiComboBox":
					var valueC = oControl.getSelectedKeys();

					if (valueC.length > 0) {
						bTemValor = true;
					}
					break;
				case "sap.m.Select":
					valueC = oControl.getSelectedKey();

					if (valueC.length > 0) {
						bTemValor = true;
					}
					break;
				case "sap.m.MultiInput":
					valueC = oControl.getTokens();

					if (valueC.length > 0) {
						bTemValor = true;
					}
					break;
				default:
					valueC = oControl._getInputValue();

					if (valueC.length > 0) {
						bTemValor = true;
					}
				}
				if (oControl && bTemValor === true) {
					aFiltersWithValue.push(aFilters[i]);
				}
			}
			return aFiltersWithValue;
		},
		//Ao alterar filtro
		_onFilterChange: function (oEvent, oThat) {
			if (oThat.oVariantFilter) {
				oThat.oVariantFilter.currentVariantSetModified();
			}
			oThat.oView.byId("filterBarBO").fireFilterChange(oEvent);
		},
		_initP13N: function (oList) {
			this._oP13nManagerSettings = {
				oListener: this,
				bAddNoneItem: false,
				oI18nIds: {
					sSortPanelTitleId: "SortPanelTitle",
					sFilterPanelTitleId: "FilterPanelTitle",
					sGroupPanelTitleId: "GroupPanelTitle",
					sColumnsPanelTitleId: "ColumnsPanelTitle",
					sNoneItemId: "None"
				},
				aFilterItems: this._getFilterItemsP13N(),
				aColumnItems: [],
				aSortItems: this._getSortItemsP13N(),
				aGroupItems: this._getGroupItemsP13N(),
				aFilters: [],
				aSort: [],
				aGroup: []
			};

			//Carregar os já setados na tabela...
			for (let oFilter of this.oBosTable.getBinding("items").aFilters) {
				if (oFilter.oValue1.length <= 0) {
					continue;
				}
				this._oP13nManagerSettings.aFilters.push({
					sColumnKey: oFilter.sPath,
					sOperation: oFilter.sOperator,
					sValue1: oFilter.oValue1,
					sValue2: oFilter.oValue2,
					sExclude: false
				});
			}
			for (let oSorter of this.oBosTable.getBinding("items").aSorters) {
				let vDescending = (oSorter.bDescending === true) ? "Descending" : "Ascending";
				this._oP13nManagerSettings.aSort.push({
					sColumnKey: oSorter.sPath,
					sOperation: vDescending
				});
			}
			//popular colunas
			var aColumns = this.oBosTable.getColumns();
			for (let oColumn of aColumns) {
				this._oP13nManagerSettings.aColumnItems.push({
					sColumnKey: oColumn.getId(),
					sColumnText: oColumn.getHeader().getText(),
					sColumnVisible: oColumn.getVisible(),
					iIndex: oColumn.getOrder()
				});
			}

			var oListManager = new ListManager();
			oListManager.init(this.getOwnerComponent(), this.oBosTable, this.byId("btnConfTable"), this._oP13nManagerSettings);
		},
		_getFilterItemsP13N: function () {
			var aResult = [];
			for (let oInput of this.aInputs) {
				let oControl = this.getView().byId(oInput.sInput);

				let vLabel = "";
				try {
					vLabel = oControl.getLabels()[0].getText();
				} catch (e) {
					vLabel = oInput.vProperty;
				}

				aResult.push({
					sColumnKey: oInput.vProperty,
					sColumnText: vLabel
				});
			}
			return aResult;
		},
		_getSortItemsP13N: function () {
			var aResult = [{
				sColumnKey: "NumeroBo",
				sColumnI18nKey: "title_Column_Incident_Number"
			}, {
				sColumnKey: "Werks",
				sColumnI18nKey: "title_Column_Werks"
			}, {
				sColumnKey: "Status",
				sColumnI18nKey: "title_Column_Status"
			}, {
				sColumnKey: "RespBo",
				sColumnI18nKey: "title_Column_Resp_Bo"
			}];
			return aResult;
		},
		_getGroupItemsP13N: function () {
			var aResult = [{
				sColumnKey: "NumeroBo",
				sColumnI18nKey: "title_Column_Incident_Number",
				fnVGroup: function (oContext) {
					var sName = "" + oContext.getProperty("NumeroBo");
					return {
						key: sName,
						text: "{i18n>" + "title_Column_Incident_Number" + "}: " + sName.replace(/^[0]+/g, "")
					};
				}.bind(this)
			}, {
				sColumnKey: "Werks",
				sColumnI18nKey: "title_Column_Werks"
			}, {
				sColumnKey: "RespBO",
				sColumnI18nKey: "title_Column_Resp_Bo"
			}, {
				sColumnKey: "Status",
				sColumnI18nKey: "title_Column_Status",
				fnVGroup: function (oContext) {
					var sName = "" + this.myFormatter.statusConverterText(oContext.getProperty("Status"), this);
					return {
						key: sName,
						text: "{i18n>" + "title_Column_Status" + "}: " + sName.replace(/^[0]+/g, "")
					};
				}.bind(this)
			}];
			return aResult;
		},
		handleRouteMatched: function (evt) {
			if (this.atualizarLista) {
				this.atualizarLista = false;
				this.onRefresh();
			}

		},
		_loadInfoFilters: function () {
			this.aInputs = [{
				sInput: "selectStatus",
				vProperty: "Status"
			}, {
				sInput: "ipchvnfe",
				vProperty: "ChaveXmlNfe"
			}, {
				sInput: "ipNumBo",
				vProperty: "NumeroBo"
			}, {
				sInput: "ipnfenum",
				vProperty: "Nfenum"
			}, {
				sInput: "ipwerks",
				vProperty: "Werks"
			}, {
				sInput: "ipresp",
				vProperty: "RespBo"
			}];

			//eventos
			for (let oInput of this.aInputs) {
				let oControl = this.getView().byId(oInput.sInput);

				var sType = oControl.getMetadata().getName();
				switch (sType) {
				case "sap.m.MultiComboBox":
					oControl.attachSelectionChange(this, this._onFilterChange);
					break;
				case "sap.m.MultiInput":
					oControl.attachTokenUpdate(this, this._onFilterChange);
					break;
				default:
					oControl.attachChange(this, this._onFilterChange);
				}
			}
			this.oView.byId("filterBarBO").registerGetFiltersWithValues(this._handleGetFiltersWithValues);
		},
		_formatInput: function () {
			//para possibilitar copiar e colar conteudo
			var oMultiInputNfe = this.getView().byId("ipchvnfe");
			//oMultiInputNfe.setWidth("350px");
			//*** add checkbox validator
			var fValidator = function (args) {
				var text = args.text;
				return new Token({
					key: text,
					text: text
				});
			};
			oMultiInputNfe.addValidator(fValidator);

			var oMultiInputNBo = this.getView().byId("ipNumBo");
			oMultiInputNBo.addValidator(fValidator);

			var oMultiInputNfenum = this.getView().byId("ipnfenum");
			oMultiInputNfenum.addValidator(fValidator);

		},
		onSearch: function () {
			if (!this.oBosTable) {
				this.oBosTable = this.getView().byId("BosTable");
			}
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
						// Select
						if (oControl.getSelectedKey) {
							let vSelectKey = oControl.getSelectedKey();
							aFilters.push(new sap.ui.model.Filter(oInput.vProperty, sap.ui.model.FilterOperator.EQ, vSelectKey));
						} else {
							if (oControl.getSelectedKeys) {
								for (let vSelectKey of oControl.getSelectedKeys()) {
									if (oInput.sInput === "ipresp") {
										aFilters.push(new sap.ui.model.Filter(oInput.vProperty, sap.ui.model.FilterOperator.EQ, vSelectKey ));
									} else {
										aFilters.push(new sap.ui.model.Filter(oInput.vProperty, sap.ui.model.FilterOperator.EQ, vSelectKey));
									}
								}
							}
						}
					}
				}
			}
			this.oBosTable.getBinding("items").filter(aFilters);
		},
		_createModelStatus: function () {
			var that = this;

			var oData = {
				"selectedStsBo": "X", //Aguardando aprovação
				"StatusBoSet": [{
					"Status": cStatusTodos,
					"Name": "Todos"
				}, {
					"Status": "X", //Aguardando aprovação
					"Name": that.myFormatter.statusConverterText("X", that)
				}, {
					"Status": "A", //Aberto
					"Name": that.myFormatter.statusConverterText("A", that)
				}, {
					"Status": "F", //Finalizado
					"Name": that.myFormatter.statusConverterText("F", that)
				}]
			};
			var oModel = new JSONModel(oData);
			this.getView().setModel(oModel, "StatusLoc");
		},
		_verificarSairSave: function (fnFunction) {
			let oView = this.getView();
			let oModel = oView.getModel("GE");
			let oTranslationModel = this.getView().getModel("i18n");
			let oBundle = oTranslationModel.getResourceBundle();
			let that = this;
			if (oModel && oModel.hasPendingChanges()) {

				var dialog = new Dialog({
					title: oBundle.getText("PopSairSave"),
					type: "Message",
					content: new Text({
						text: oBundle.getText("PopSairSaveText")
					}),
					beginButton: new Button({
						text: oBundle.getText("PopSairSaveBtnConfirm"),
						icon: "sap-icon://accept",
						type: "Accept",
						press: function () {
							if (oModel) {
								oModel.resetChanges();
							}
							fnFunction();
							dialog.close();
						}
					}),
					endButton: new Button({
						text: oBundle.getText("PopSairSaveBtnCancel"),
						icon: "sap-icon://decline",
						type: "Reject",
						press: function () {
							dialog.close();
						}
					}),
					afterClose: function () {
						that.getView().setBusy(false);
						dialog.destroy();
					}
				});
				dialog.open();
			} else {
				fnFunction();
			}
		},
		onCreateBO: function (oEvent) {
			var that = this;
			this._verificarSairSave(function () {
				that._criarNovoBO();
			});
		},
		_criarNovoBO: function () {
			var oModel = this.getOwnerComponent().getModel("GE");
			var oContext = oModel.createEntry("ZET_VCMM_BOHEADERSet");

			var vBOPath = oContext.getPath();
			vBOPath = vBOPath.split("/").slice(-1).pop();

			this.atualizarLista = true;

			var oNextUIState;
			this.getOwnerComponent().getHelper().then(function (oHelper) {
				oNextUIState = oHelper.getNextUIState(1);
				this.oRouter.navTo("detail", {
					layout: oNextUIState.layout,
					BOPath: vBOPath
				});
			}.bind(this));
		},
		onListItemPress: function (oEvent) {
			var that = this;
			var oSource = oEvent.getSource();
			this._verificarSairSave(function () {
				that._goToDetailsBO(oSource);
			});
		},
		_goToDetailsBO: function (oSource) {
			var oBindingContext = oSource.getBindingContext("GE"),
				oNextUIState;
			if (oBindingContext) {
				this.atualizarLista = true;
				var vBOPath = oBindingContext.getPath();
				vBOPath = vBOPath.split("/").slice(-1).pop();

				this.getOwnerComponent().getHelper().then(function (oHelper) {
					oNextUIState = oHelper.getNextUIState(1);
					this.oRouter.navTo("detail", {
						layout: oNextUIState.layout,
						BOPath: vBOPath
					});
				}.bind(this));
			}
		},

		onRefresh: function () {
			this.oBosTable.getBinding("items").refresh();
		},
		onUpdateFinished: function (oEvent) {
			var oTranslationModel = this.getView().getModel("i18n");
			var oBundle = oTranslationModel.getResourceBundle();
			var oTitle = this.getView().byId("DynamicPageTitleId");

			if (this.oBosTable.getBinding("items").isLengthFinal()) {
				var iCount = oEvent.getParameter("total");
				//var iItems = oEvent.getParameter("actual");

				//if (iItems === iCount) {
				oTitle.setText(oBundle.getText("title_S0") + " (" +
					iCount + ")");
				//} else {
				//	oTitle.setText(oBundle.getText("title_S0") + " (" +
				//		iItems + " / " + iCount + ")");
				//}

			}
		},
		_setFilterInit: function (vQuery) {
			var aFilter = [];
			if (vQuery && vQuery !== cStatusTodos) {
				aFilter.push(new Filter("Status", FilterOperator.EQ, vQuery));
			}
			// filter binding
			if (!this.oBosTable) {
				this.oBosTable = this.getView().byId("BosTable");
			}
			var oBinding = this.oBosTable.getBinding("items");
			oBinding.filter(aFilter);
		},
		_createColumnConfigExport: function () {
			let oTranslationModel = this.getView().getModel("i18n");
			let oBundle = oTranslationModel.getResourceBundle();
			var aCols = [];

			aCols.push({
				label: oBundle.getText("title_Column_Incident_Number"),
				type: "string",
				property: "NumeroBo"
			});

			aCols.push({
				label: oBundle.getText("title_Column_Nfe"),
				type: "string",
				property: ["Nfenum", "Serie"],
				template: " {0}-{1}"
			});

			aCols.push({
				label: oBundle.getText("title_Column_Nfe_value"),
				type: "number",
				property: "VlrTotalBrtNf",
				template: " {0}-{1}"
			});

			aCols.push({
				label: oBundle.getText("title_Column_Werks"),
				type: "string",
				property: "Werks"
			});

			aCols.push({
				label: oBundle.getText("title_Column_Date_Open"),
				type: "date",
				format: "dd/MM/yyyy",
				property: "Credat"
			});

			aCols.push({
				label: oBundle.getText("title_Column_Status"),
				type: "string",
				property: "StatusTxt"
			});

			return aCols;
		},
		onExport: function () {
			var aCols, oRowBinding, oSettings, oSheet;

			oRowBinding = this.oBosTable.getBinding("items");

			aCols = this._createColumnConfigExport();

			var oModel = oRowBinding.getModel();
			var oModelInterface = oModel.getInterface();

			oSettings = {
				workbook: {
					columns: aCols,
					hierarchyLevel: "Level"
				},
				dataSource: {
					type: "odata",
					dataUrl: oRowBinding.getDownloadUrl ? oRowBinding.getDownloadUrl() : null,
					serviceUrl: oModelInterface.sServiceUrl,
					headers: oModelInterface.getHeaders ? oModelInterface.getHeaders() : null,
					count: oRowBinding.getLength ? oRowBinding.getLength() : null,
					useBatch: true,
					sizeLimit: oModelInterface.iSizeLimit
				},
				worker: false // We need to disable worker because we are using a MockServer as OData Service
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build().finally(function () {
				oSheet.destroy();
			});
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf workspace.zcockpit_bo_v3.view.S0
		 */
		onBeforeRendering: function () {
			this._formatInput();

			//filtro padrão
			var vQuery = this.getView().byId("selectStatus").getSelectedKey();
			if (vQuery && vQuery !== cStatusTodos) {
				this._setFilterInit(vQuery);
			}

			//Variantes de filtro
			this._initVariantFilter();

			//Variantes da tabela
			this._initVariantTable();
		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf workspace.zcockpit_bo_v3.view.S0
		 */
		onAfterRendering: function () {},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf workspace.zcockpit_bo_v3.view.S0
		 */
		onExit: function () {
			//this.oRouter.getRoute("master").detachPatternMatched(this.handleRouteMatched, this);
		}

	});
});