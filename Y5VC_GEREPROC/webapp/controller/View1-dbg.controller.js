sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/m/Token",
	"sap/m/MessageToast",
	"sap/ndc/BarcodeScanner",
	"../util/formatter"
], function (Controller, MessageBox, JSONModel, Token, MessageToast, BarcodeScanner, Formatter) {
	"use strict";

	return Controller.extend("workspace.zreimpressao_etiqueta2.controller.View1", {
		myFormatter: Formatter,
		onInit: function () {

			var oModel = new JSONModel({
				data: {
					"headerExpanded": "sdae"
				}
			});
			this.getView().setModel(oModel);

			oModel = new JSONModel({
				"Options": [{
					key: "MAT",
					value: "Material"
				}, {
					key: "VOL",
					value: "Volume"
				}, {
					key: "AGR",
					value: "Agrupador"
				}]
			});

			this.getView().setModel(oModel, "Category");
			

		},
		
		_onSearch: function () {

			let oView = this.getView();
			let oBundle = oView.getModel("i18n").getResourceBundle();
			let oTable = this.getView().byId("idLabelTable");
			let aFilters = [];
			let bNoChvnfeInput = false;
			let bNoLabelNumberInput = false;
			let bNoNfeInput = false;

			// Chave NF-e
			let oControl = this.getView().byId("idMultiInputChvnfe");
			if (oControl) {
				oControl.setValueState(null);
				let oTokens = oControl.getTokens();
				if (oTokens.length > 0) {
					for (let oToken of oTokens) {
						aFilters.push(new sap.ui.model.Filter("chvnfe", sap.ui.model.FilterOperator.EQ, oToken.getKey()));
					}
				} else {
					bNoChvnfeInput = true;
				}
			}

			// Número Etiqueta
			oControl = this.getView().byId("idMultiInputLabelNumber");
			if (oControl) {
				oControl.setValueState(null);
				let oTokens = oControl.getTokens();
				if (oTokens.length > 0) {
					for (let oToken of oTokens) {
						aFilters.push(new sap.ui.model.Filter("nretq", sap.ui.model.FilterOperator.Contains, oToken.getKey().trim()));
					}
				} else {
					bNoLabelNumberInput = true;
				}
			}
			
			// NFenum
			oControl = this.getView().byId("idMultiInputNfe");
			if (oControl) {
				oControl.setValueState(null);
				let oTokens = oControl.getTokens();
				if (oTokens.length > 0) {
					for (let oToken of oTokens) {
						aFilters.push(new sap.ui.model.Filter("chvnfe", sap.ui.model.FilterOperator.Contains, oToken.getKey()));
					}
				} else {
					bNoNfeInput = true;
				}
			}

			if (bNoLabelNumberInput && bNoChvnfeInput && bNoNfeInput) {
				oControl = this.getView().byId("idMultiInputChvnfe");
				oControl.setValueState(sap.ui.core.ValueState.Error);
				oControl.setValueStateText(oBundle.getText("error_mandatory_field"));

				oControl = this.getView().byId("idMultiInputLabelNumber");
				oControl.setValueState(sap.ui.core.ValueState.Error);
				oControl.setValueStateText(oBundle.getText("error_mandatory_field"));
				
				oControl = this.getView().byId("idMultiInputNfe");
				oControl.setValueState(sap.ui.core.ValueState.Error);
				oControl.setValueStateText(oBundle.getText("error_mandatory_field"));

				MessageBox.error(oBundle.getText("error_mandatory_fields"), {
					title: oBundle.getText("error_title"),
					styleClass: "sapUiSizeCompact"
				});

				return;

			} else {

				// Categoria Etiqueta
				oControl = this.getView().byId("idLabelCategorySelect");
				
				// Status Ativo da Etiqueta
				aFilters.push(new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "AT"));
				// Combo Box
				if (oControl.getSelectedKey) {
					aFilters.push(new sap.ui.model.Filter("categoriaEtq", sap.ui.model.FilterOperator.EQ, oControl.getSelectedKey()));

					if (oControl.getSelectedKey() === "MAT") {
						this.getView().byId("idLabelColumnMat").setVisible(true);
						this.getView().byId("idLabelColumnDescMat").setVisible(true);
						this.getView().byId("idLabelColumnValidade").setVisible(true);
						this.getView().byId("idLabelColumnNF").setVisible(true);
						this.getView().byId("idLabelColumnNFItem").setVisible(true);
						this.getView().byId("idLabelColumnNFValue").setVisible(true);
						this.getView().byId("idLabelColumnNFItemValue").setVisible(true);
						aFilters.push(new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "PE"));	
					} else if (oControl.getSelectedKey() === "VOL") {
						this.getView().byId("idLabelColumnMat").setVisible(false);
						this.getView().byId("idLabelColumnDescMat").setVisible(false);
						this.getView().byId("idLabelColumnValidade").setVisible(false);
						this.getView().byId("idLabelColumnNF").setVisible(true);
						this.getView().byId("idLabelColumnNFItem").setVisible(false);
						this.getView().byId("idLabelColumnNFValue").setVisible(true);
						this.getView().byId("idLabelColumnNFItemValue").setVisible(true);
						aFilters.push(new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "PE"));	
					} else {
						this.getView().byId("idLabelColumnMat").setVisible(false);
						this.getView().byId("idLabelColumnDescMat").setVisible(false);
						this.getView().byId("idLabelColumnValidade").setVisible(false);
						this.getView().byId("idLabelColumnNF").setVisible(false);
						this.getView().byId("idLabelColumnNFItem").setVisible(false);
						this.getView().byId("idLabelColumnNFValue").setVisible(false);
						this.getView().byId("idLabelColumnNFItemValue").setVisible(false);
					}
				}else{
					
					aFilters.push(new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "PE"));	
				}

				
				if (aFilters) {
					oTable.getBinding("items").filter(aFilters, sap.ui.model.FilterType.Application);
				}
			}
		},

		_onPressCancelLabel: function (oEvent) {

			let oView = this.getView();
			let oTable = oView.byId("idLabelTable");
			let oContext = oTable.getSelectedContexts();
			let oBundle = oView.getModel("i18n").getResourceBundle();
			let aChvnfeMap = new Map();
			let vChvnfe = "";
			let boolVolLabelCategory = false;
			let oModel = {};
			var that = this;

			var mParameters = {
				groupId: "gpIDUpdNFHeader",
				success: function (oData, oResp) {
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

							// Sucesso
							MessageToast.show(oBundle.getText("message_label_canceled"));
							oModel.refresh();
						}
					}
					oTable.setBusy(false);
				},
				error: function (oData, oResp) {

					if (oData !== undefined) {
						let responseText = oData.responseText;
						let responseParser = JSON.parse(responseText);
						MessageBox.error(responseParser.error.message.value, {
							title: oBundle.getText("error_title"),
							styleClass: "sapUiSizeCompact"
						});
					} else {

						MessageBox.success(oBundle.getText("ErrorGrScheduled"), {
							styleClass: "sapUiSizeCompact"
						});
					}
					oTable.setBusy(false);
				}

			};

			if (oContext.length > 0) {
				//Validações:
				// Apenas válido para etiqueta de material
				// Apenas uma Nota fiscal deve ser selecionada
				// Todas as etiquetas dos itens da nota fiscal selecionados serão cancelados
				// Etada da NF-e
				// - Se Etiqueta tem origem no OpLog não pode ser cancelada no Almox
				// - Se etapa NF-e for posterior a entrada mercadorias não é possível cancelar etiqueta
				//Ao Cancelar status da NF-e deverá ser alterado para conferência de etiquetas
				oModel = oView.getModel("GE");
				oModel.setDeferredGroups(["gpIDUpdNFHeader"]);

				for (let oCtx of oContext) {
					let oNfitem = {};
					let oNfheader = {};

					// Guarda chaves NF-e únicas no array
					vChvnfe = oCtx.getProperty("chvnfe");

					if (oCtx.getProperty("categoriaEtq") === "AGR") {
						var oModelUtil = new sap.ui.model.odata.v2.ODataModel(oModel.sServiceUrl, {
							defaultCountMode: "Inline",
							defaultOperationMode: "Server"
						});
						oModelUtil.callFunction("/cancelarAgrupador", {
							method: "POST", // http method
							urlParameters: {
								"Agrupador": oCtx.getProperty("nretq")
							}, // function import parameters
							success: function (oData, response) { // callback function for success
								var vAgrupadorOut = oData.Agrupador;
								MessageToast.show(oBundle.getText("title_message_cancel_label", [vAgrupadorOut]));
								that.getView().getModel("GE").refresh();
							}
						});
					} else {
						if (oCtx.getProperty("categoriaEtq") === "VOL") {

							// Se ainda não processou etiqueta de volume
							if (aChvnfeMap.get(vChvnfe) === undefined) {
								oNfheader.Chvnfe = oCtx.getProperty("chvnfe");
								oNfheader.statusNfe = "61"; // Cancelar etiquetas volumes
								oModel.update("/ZET_VCMM_NFHEADERSet(Chvnfe='" + oNfitem.Chvnfe + "')", oNfheader, {
									groupId: "gpIDUpdNFHeader"
								});
							}

							boolVolLabelCategory = true;
						} else {
							oNfitem.Chvnfe = oCtx.getProperty("chvnfe");
							oNfitem.Itmnum = oCtx.getProperty("itmnum");
							oNfitem.Status = "05"; // Cancelar etiquetas
							oModel.update("/ZET_VCMM_NFITEMSet(Chvnfe='" + oNfitem.Chvnfe + "',Itmnum='" + oNfitem.Itmnum + "')", oNfitem, {
								groupId: "gpIDUpdNFHeader"
							});
						}
						// Verifica se já processou chave NF-e
						if (aChvnfeMap.get(vChvnfe) === undefined) {
							aChvnfeMap.set(vChvnfe, vChvnfe);
						}
					}
				}

				/*if (boolVolLabelCategory) {
					// Apenas válido para etiqueta de material
					MessageBox.error(oBundle.getText("error_only_material_label_is_allowed"), {
						title: oBundle.getText("error_title"),
						styleClass: "sapUiSizeCompact"
					});
					oModel.resetChanges();
					return;
				}*/

				if (aChvnfeMap.length > 1) {
					// Apenas uma Nota fiscal deve ser selecionada	
					MessageBox.error(oBundle.getText("error_only_one_chvnfe_is_allowed"), {
						title: oBundle.getText("error_title"),
						styleClass: "sapUiSizeCompact"
					});
					oModel.resetChanges();
					return;
				}

				let strMessage = "";
				if (boolVolLabelCategory) {
					strMessage = oBundle.getText("message_vol_question_cancel_label");
				} else {
					strMessage = oBundle.getText("message_question_cancel_label");
				}

				MessageBox.show(
					strMessage, {
						icon: MessageBox.Icon.INFORMATION,
						title: oBundle.getText("title_message_cancel_label"),
						actions: [MessageBox.Action.YES, MessageBox.Action.NO],
						onClose: function (oAction) {

							if (oAction === "YES") {
								oModel = that.getView().getModel("GE");
								oModel.submitChanges(mParameters);
							} else {
								oModel = that.getView().getModel("GE");
								oModel.resetChanges();
							}
						}
					}
				);

			} else {
				MessageBox.error(oBundle.getText("error_no_line_selected"), {
					title: oBundle.getText("error_title"),
					styleClass: "sapUiSizeCompact"
				});
			}

		},

		_onPressRePrintLabel: function (oEvent) {
			this._handleAction(oEvent, "REPRINT");
		},

		_handleAction: function (oEvent, vAction) {

			let oView = this.getView();
			let oTable = oView.byId("idLabelTable");
			let oContext = oTable.getSelectedContexts();
			let oBundle = oView.getModel("i18n").getResourceBundle();
			let oModel = oView.getModel("GE");
			let aChvnfeMap = new Map();
			let vChvnfe = "";
			let vCategoriaEtiqueta = "";
			let bCategoriaError = false;
			let vChvnfeString = "";
			let boolPendingLabel = false;
			let vEtq = "";

			oTable.setBusy(true);
			// Percorre linhas selecionadas
			if (oContext.length > 0) {
				//oModel.setDeferredGroups(["gpIDUpdNFHeader"]);
				for (let oCtx of oContext) {

					if (oCtx.getProperty("status") === "PE") {
						boolPendingLabel = true;
					}

					// Definir etiquetas com status PE
					oCtx.getModel().setProperty(oCtx.getPath() + "/status", "PE");
					// Guarda chaves NF-e únicas no array
					vChvnfe = oCtx.getProperty("chvnfe");

					vEtq = oCtx.getProperty("nretq");
					// Verifica se categoria da etiqueta já foi preenchida
					if (vCategoriaEtiqueta === "") {
						vCategoriaEtiqueta = oCtx.getProperty("categoriaEtq");
					} else {
						// Verifica se categoria da etiqueta é a mesma das demais.
						// Só serão impressas etiquetas da mesma categoria
						if (vCategoriaEtiqueta !== oCtx.getProperty("categoriaEtq")) {
							bCategoriaError = true;
						}
					}

					if (vCategoriaEtiqueta === "AGR") {
						aChvnfeMap.set(vEtq, vEtq);
					} else if (aChvnfeMap.get(vChvnfe) === undefined) {
						// Verifica se já processou chave NF-e
						aChvnfeMap.set(vChvnfe, vChvnfe);
					}

				}
				if (!bCategoriaError) {
					for (let key of aChvnfeMap.keys()) {
						// if (vChvnfeString === "") {
						vChvnfeString = key;
						// } else {
						//vChvnfeString = vChvnfeString + "-" + key;
						// }

						// Etiqueta de Agrupador ?
						if (vCategoriaEtiqueta === "AGR") {
							var stringAgr = oModel.sServiceUrl +
								"/ZET_VCMM_FILESet(fileName='" + vChvnfeString +
								"',fileCategory='" + vCategoriaEtiqueta +
								"',fileDescription='PE')/$value";
							window.open(stringAgr);

							// MessageBox.success(oBundle.getText("message_label_reprint_success"), {
							// 	styleClass: "sapUiSizeCompact"
							// });
							oTable.setBusy(false);
						} else {
							// Há alterações pendentes ?
							if (oModel.hasPendingChanges()) {
								this._submitChanges(vChvnfeString, vCategoriaEtiqueta, vAction);
							} else {
								// Não há alterações, mas impressão é de etiqueta pendente
								if (boolPendingLabel) {
									var string = oModel.sServiceUrl +
										"/ZET_VCMM_FILESet(fileName='" + vChvnfeString +
										"',fileCategory='" + vCategoriaEtiqueta +
										"',fileDescription='PE')/$value";
									window.open(string);

									// MessageBox.success(oBundle.getText("message_label_reprint_success"), {
									// 	styleClass: "sapUiSizeCompact"
									// });
									oTable.setBusy(false);
								}
							}
						}
					}
				} else {
					oModel.resetChanges();

					oTable.setBusy(false);

					MessageBox.error(oBundle.getText("error_no_wrong_category_label"), {
						title: oBundle.getText("error_title"),
						styleClass: "sapUiSizeCompact"
					});
				}
			} else {
				oTable.setBusy(false);
				MessageBox.error(oBundle.getText("error_no_line_selected"), {
					title: oBundle.getText("error_title"),
					styleClass: "sapUiSizeCompact"
				});
			}
		},

		_submitChanges: function (vChvnfeString, vCategory, vAction) {

			let that = this;
			let oView = that.getView();
			let oModel = oView.getModel("GE");
			let oTable = oView.byId("idLabelTable");
			let oBundle = oView.getModel("i18n").getResourceBundle();

			var mParameters = {
				//groupId: "gpIDUpdNFHeader",
				success: function (oData, oResp) {
					if (oData) {

						if (vAction === "REPRINT") {
							oModel.resetChanges();
							var string = oModel.sServiceUrl +
								"/ZET_VCMM_FILESet(fileName='" + vChvnfeString +
								"',fileCategory='" + vCategory +
								"',fileDescription='PE')/$value";
							window.open(string);
							
							// MessageBox.success(oBundle.getText("message_label_reprint_success"), {
							// 	styleClass: "sapUiSizeCompact"
							// });
							oTable.setBusy(false);
							
							//that._onSearch();
						} else {
							// MessageBox.success(oBundle.getText("message_label_canceled"), {
							// 	styleClass: "sapUiSizeCompact"
							// });
							
							oTable.setBusy(false);
							//that._onSearch();
						}
					}
					oModel.refresh();
					oTable.setBusy(false);
				},
				error: function (oData, oResp) {
					MessageBox.success(oBundle.getText("error_backend"), {
						styleClass: "sapUiSizeCompact"
					});
					oTable.setBusy(false);
				}
			};

			oModel.submitChanges(mParameters);
		},

		_onPressReSplitLabel: function (oEvent) {

			let oView = this.getView();
			let oTable = oView.byId("idLabelTable");
			let oContext = oTable.getSelectedContexts();
			let oBundle = oView.getModel("i18n").getResourceBundle();
			let aChvnfeMap = new Map();
			let vChvnfe = "";
			let oModel = {};
			var that = this;
			let boolVolLabelCategory = false;

			if (oContext.length === 1) {
				//Validações:
				// Apenas válido para etiqueta de material
				// Apenas uma Etiqueta deve ser selecionada
				// Tela modal questionando nova quantidade e número de etiquetas
				// Verificar se quantidade é menor ou igual a quantidade anterior 
				// Número de etiquetas deve ser maior ou igual a 1
				// Cancela etiqueta original
				// Gerar as novas etiquetas como cópia da original
				oModel = oView.getModel("GE");
				oModel.setDeferredGroups(["gpIDUpdNFHeader"]);

				for (let oCtx of oContext) {

					// Verifica se categoria de etiqueta é Volume
					if (oCtx.getProperty("categoriaEtq") === "VOL" || oCtx.getProperty("categoriaEtq") === "AGR") {
						boolVolLabelCategory = true;
					} else {

						let oJsonModel = new JSONModel({
							nretq: oCtx.getProperty("nretq"),
							menge: oCtx.getProperty("menge"),
							mengeOld: oCtx.getProperty("menge"),
							labelQuantity: "1",
							chvnfe: oCtx.getProperty("chvnfe"),
							itmnum: oCtx.getProperty("itmnum"),
							categoriaEtq: oCtx.getProperty("categoriaEtq"),
							meins: oCtx.getProperty("meins"),
							matnr: oCtx.getProperty("matnr")
						});
						oView.setModel(oJsonModel, "SPLABEL");
					}
				}
				if (boolVolLabelCategory) {
					// Apenas válido para etiqueta de material
					MessageBox.error(oBundle.getText("error_only_material_label_is_allowed2"), {
						title: oBundle.getText("error_title"),
						styleClass: "sapUiSizeCompact"
					});
					oModel.resetChanges();
					return;
				}

				let oDialog = oView.byId("idDialogSplitLabel");
				// create dialog lazily
				if (!oDialog) {
					// create dialog via fragment factory
					oDialog = sap.ui.xmlfragment(oView.getId(), "workspace.zreimpressao_etiqueta2.view.DialogSplitLabel", this);
					// connect dialog to view (models, lifecycle)
					oView.addDependent(oDialog);
				}
				
				this._setSplitLabelSummary(this );
				
				oDialog.open();

			} else {
				if (oContext.length === 0) {
					oTable.setBusy(false);
					MessageBox.error(oBundle.getText("error_no_line_selected"), {
						title: oBundle.getText("error_title"),
						styleClass: "sapUiSizeCompact"
					});
				} else {
					oTable.setBusy(false);
					MessageBox.error(oBundle.getText("error_more_than_one_line_selected"), {
						title: oBundle.getText("error_title"),
						styleClass: "sapUiSizeCompact"
					});
				}
			}

		},
		
		_onChangeFragQuantity: function(oEvent){
			this._setSplitLabelSummary(this);		
		},
		
		_setSplitLabelSummary: function(oThat){
			
			let oView = oThat.getView();
			let oModel = oView.getModel("SPLABEL");
			let oData  = oModel.getData();
			let oBundle = oView.getModel("i18n").getResourceBundle();
			let sText   = oBundle.getText("text_split_label_summary");
			let oQuociente = oData.labelQuantity;
			
			if ( oQuociente > 0 ) {
				oQuociente = oData.menge / oQuociente ;	
			}
			
			
			sText = sText.replace("&1", oData.labelQuantity);		// Quantidade de Etiquetas
			sText = sText.replace("&2", oQuociente.toString());		// Quantidade do material por etiqueta
			sText = sText.replace("&3", oData.meins);				// Unidade de medida
			
			let oText = oThat.byId("idTxtResult");
			if (oText){
				oText.setText(sText);
			}
		},
		
		
		_submitMultInput: function (oEvent) {

			var oSource = oEvent.getSource();
			oSource.addToken(new Token({
				key: oSource.getValue(),
				text: oSource.getValue()
			}));
			oSource.setValue("");

		},

		_onSuggestionItemSelected: function (oEvent) {

			var oCtx = oEvent.getParameter("selectedRow").getBindingContext("GE");

			this._onSetKeys(oCtx);

			let oControl = oEvent.getSource();
			if (oControl) {
				let sNfe = oCtx.getProperty("nfenum").toString() + oCtx.getProperty("series").toString();
				let key = sNfe;
				let text = sNfe;

				oControl.addToken(new Token({
					key: key,
					text: text
				}));
			}

		},
		_onSetKeys: function (oCtx) {

			let oControl = this.getView().byId("idMultiInputChvnfe");
			if (oControl) {
				let key = oCtx.getProperty("Chvnfe");
				let text = oCtx.getProperty("Chvnfe").toString();

				oControl.addToken(new Token({
					key: key,
					text: text
				}));
			}
		},
		_onSaveDialog: function (oEvent) {

			// Verifica campo Quantidade de Etiquetas. Não deve ser menor que 1

			let oJsonModel = this.getView().getModel("SPLABEL");
			let oModel = this.getView().getModel("GE");
			let oBundle = this.getView().getModel("i18n").getResourceBundle();
			let boolError = false;

			let oControl = this.byId("idIpFragQuantity");
			if (oJsonModel.getData().labelQuantity < 1) {

				oControl.setValueState(sap.ui.core.ValueState.Error);
				oControl.setValueStateText(oBundle.getText("error_invalid_value_label_quantity"));
				boolError = true;
			} else {
				oControl.setValueState(null);
			}

			if (!boolError) {
				oModel.setDeferredGroups(["gpIDCreLabel"]);
				let fResult = oJsonModel.getData().menge / oJsonModel.getData().labelQuantity;

				for (let i = 0; i < oJsonModel.getData().labelQuantity; i++) {
					let oEntry = {};
					oEntry.nretq = oJsonModel.getData().nretq;
					oEntry.menge = fResult.toPrecision(3);
					oEntry.chvnfe = oJsonModel.getData().chvnfe;
					oEntry.itmnum = oJsonModel.getData().itmnum;
					oEntry.categoriaEtq = oJsonModel.getData().categoriaEtq;
					oEntry.meins = oJsonModel.getData().meins;
					oEntry.matnr = oJsonModel.getData().matnr;

					oModel.create("/ZET_VCMM_LABELSet", oEntry, {
						groupId: "gpIDCreLabel"
					});

				}
				let oEntry = {};
				oEntry.nretq = oJsonModel.getData().nretq;
				oEntry.chvnfe = oJsonModel.getData().chvnfe;
				oEntry.itmnum = oJsonModel.getData().itmnum;
				oEntry.categoriaEtq = oJsonModel.getData().categoriaEtq;
				oEntry.meins = oJsonModel.getData().meins;
				oEntry.matnr = oJsonModel.getData().matnr;
				oEntry.status = "CA";
				oModel.update("/ZET_VCMM_LABELSet(nretq='" + oEntry.nretq + "')", oEntry, {
					groupId: "gpIDCreLabel"
				});

				var mParameters = {
					groupId: "gpIDCreLabel",
					success: function (oData, oResp) {
						if (oData) {

							let string = oModel.sServiceUrl +
								"/ZET_VCMM_FILESet(fileName='" + oJsonModel.getData().chvnfe + "',fileCategory='MAT',fileDescription='asdsa')/$value";

							window.open(string);

							MessageBox.success(oBundle.getText("message_label_split_success"), {
								styleClass: "sapUiSizeCompact"
							});
							oModel.refresh();
						}
					},
					error: function (oData, oResp) {
						MessageBox.success(oBundle.getText("error_backend"), {
							styleClass: "sapUiSizeCompact"
						});
					}
				};

				oModel.submitChanges(mParameters);

				this.byId("idDialogSplitLabel").close();

			}
		},

		_onCancelDialog: function (oEvent) {

			let oControl = this.byId("idIpFragQuantity");
			oControl.setValueState(null);
			this.byId("idDialogSplitLabel").close();
		},
		onUpdateFinished: function (oEvent) {
			let oView = this.getView();
			let oBundle = oView.getModel("i18n").getResourceBundle();
			var oTitle = this.getView().byId("title_total_etq");
			if (oEvent.getSource().getBinding("items").isLengthFinal()) {
				var iCount = oEvent.getParameter("total");
				oTitle.setText(oBundle.getText("title_total_etq") + " (" + iCount + ")");

			}
		},
		_formatInput: function () {
			//para possibilitar copiar e colar conteudo
			//*** add checkbox validator
			var fValidator = function (args) {
				var text = args.text;
				return new Token({
					key: text,
					text: text
				});
			};
			var oMultiInputChvnfe = this.getView().byId("idMultiInputChvnfe");
			oMultiInputChvnfe.addValidator(fValidator);

			var oMultiInputLabelNumber = this.getView().byId("idMultiInputLabelNumber");
			oMultiInputLabelNumber.addValidator(fValidator);
			
			var oMultiInputNfenum = this.getView().byId("idMultiInputNfe");
			oMultiInputNfenum.addValidator(fValidator);

		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf workspace.zcockpit_bo_v3.view.S0
		 */
		onBeforeRendering: function () {
			this._formatInput();
		},
		onPressScan: function (oEvent) {
			var that = this;
			BarcodeScanner.scan(
				function (mResult) {
					that.handleScan(mResult.text);
				},
				function (Error) {
					// alert("Scanning failed: " + Error);
				}
			);
		},
		handleScan: function (ScanValue) {

			let vNrEtq;
			let vChvNfe;
			if (ScanValue.length === 184) { // etiqueta VOL ou AGR
				vNrEtq = ScanValue.substring(174, 185);
				vChvNfe = ScanValue.substring(0, 44);
				this.byId("idMultiInputLabelNumber").setValue(vNrEtq);
				this.byId("idMultiInputLabelNumber").fireEvent("submit");

				if (ScanValue.substring(171, 174) === "VOL") {
					this.byId("idMultiInputChvnfe").setValue(vChvNfe);
					this.byId("idMultiInputChvnfe").fireEvent("submit");
				}
			} else if (ScanValue.length === 162) { // etiqueta MAT
				vNrEtq = ScanValue.substring(152, 162);
				this.byId("idMultiInputLabelNumber").setValue(vNrEtq);
				this.byId("idMultiInputLabelNumber").fireEvent("submit");
			} else if (ScanValue.length === 44) { //chave de acess
				vChvNfe = ScanValue.substring(0, 44);
				this.byId("idMultiInputChvnfe").setValue(vChvNfe);
				this.byId("idMultiInputChvnfe").fireEvent("submit");
			}

			// this.byId("idMultiInputLabelNumber").setValue(vNrEtq);
			// this.byId("Chave_NfeInput").fireEvent("submit");
			// this.onChaveNfeInputSubmit(ScanValue);
		}
	});
});