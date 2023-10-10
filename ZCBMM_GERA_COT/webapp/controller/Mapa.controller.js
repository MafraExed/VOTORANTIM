sap.ui.define([
	"ZCBMM_GERAR_COTACAO/ZCBMM_GERAR_COTACAO/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/Button",
	"sap/m/MessageBox",
	"sap/m/Dialog",
	"sap/m/MessageToast",
	"sap/ui/core/mvc/Controller",
	"ZCBMM_GERAR_COTACAO/ZCBMM_GERAR_COTACAO/model/formatter",
	"sap/m/Text"
], function(BaseController, JSONModel, Button, MessageBox, Dialog, MessageToast, Controller, formatter, Text) {
	"use strict";

	return BaseController.extend("ZCBMM_GERAR_COTACAO.ZCBMM_GERAR_COTACAO.controller.Mapa", {

		formatter: formatter,

		onInit: function() {
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0
			});
			this.getRouter().getRoute("Mapa").attachPatternMatched(this._onObjectMatched, this);
			this.setModel(oViewModel, "MapaView");
			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},
		_onObjectMatched: function(oEvent) {

			var WerksO = oEvent.getParameter("arguments").WerksO;
			var IdSolicitacao = oEvent.getParameter("arguments").IdSolicitacao;
			var NrTransp = oEvent.getParameter("arguments").NrTransp;

			this.getView().byId("IdNrtransp").setValue(NrTransp);
			this.getView().byId("Idsolicitacao").setValue(IdSolicitacao);
			this.getView().byId("IdWerkso").setValue(WerksO);

			var smarttable = this.getView().byId("smartTable");
			smarttable.rebindTable("e");
			var smartTable1 = this.getView().byId("smartTable1");
			smartTable1.rebindTable("e");

			// Inicio - Filtro nos uploads de arquivo
			var IdSolicitacao = this.getView().byId("Idsolicitacao").getValue();
			IdSolicitacao = parseInt(IdSolicitacao);

			var filter = IdSolicitacao,
				oFilter = new sap.ui.model.Filter("WerksO", sap.ui.model.FilterOperator.EQ, filter),
				oList = this.getView().byId("UploadCollection");

			// Executa filtro
			oList.getBinding("items").filter([oFilter]);
			// fim executa filtro

		},

		_bindView: function(sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("MapaView"),
				oDataModel = this.getModel();

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oDataModel.metadataLoaded().then(function() {
							oViewModel.setProperty("/busy", true);
						});
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
				sObjectId = oObject.IdSolicitacao,
				sObjectName = oObject.IdSolicitacao,
				oViewModel = this.getModel("MapaView");

			this.getOwnerComponent().oListSelector.selectAListItem(sPath);

			oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("shareSaveTileAppTitle", [sObjectName]));
			oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));

			this.getView().byId("smartTable").rebindTable("e");
			this.getView().byId("smartTable1").rebindTable("e");

		},
		_onMetadataLoaded: function() {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("MapaView");
			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);
			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		},
		onGrava: function(oEvent) {
			this.onSave("IdSolicitacao", oEvent);
		},
		onBack: function() {
			this.getRouter().navTo("Backend");
		},

		OnZterm: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog2) {
				this._valueHelpDialog2 = sap.ui.xmlfragment("ZCBMM_GERAR_COTACAO.ZCBMM_GERAR_COTACAO.view.Zterm", this);
				this.getView().addDependent(this._valueHelpDialog2);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog2.open(sInputValue);

		},

		OnCalcule: function(oEvent) {
			var oKeys = {};
			var volume = this.getView().byId("IdVolume").getValue();

			var VlrNegoc = this.getView().byId("IdVlrNegoc").getValue();
			oKeys.VlrNegoc = parseInt(VlrNegoc);

			var negociac = oKeys.VlrNegoc;
			var result = this.getView().byId("IdTco").getValue();
			var calc = this.getView().byId("IdTco").getValue();

			var OrcBaseline = this.getView().byId("IdOrcBaseline").getValue();
			var value = this.getView().byId("IdSaving").getValue();

			var resu = this.getView().byId("IdPerformance").getValue();
			var perf = this.getView().byId("IdPerformance").getValue();
			var VlrProp = this.getView().byId("IdVlrProp").getValue();

			var pedagio = this.getView().byId("IdPedagio").getValue();

			if (volume !== 0 && negociac !== 0 && pedagio !== 0) {

				calc = +negociac + +pedagio;
				result = calc * volume;
				this.getView().byId("IdTco").setValue(result);
			}
			if (negociac !== 0 && OrcBaseline !== 0) {
				value = OrcBaseline - negociac;
				this.getView().byId("IdSaving").setValue(value);
			}
			if (negociac !== 0 && VlrProp !== 0) {
				resu = negociac - VlrProp;
				perf = resu * 100 / VlrProp;
				this.getView().byId("IdPerformance").setValue(perf);
			}
		},
		_handleValueHelpClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");

			this._valueHelpDialog1 = null;
			this._valueHelpDialog4 = null;
			this._valueHelpDialog6 = null;

			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);
			this.getView().byId(this.inputId).setValueState("None");
		},

		_handleValueHelpZterm: function(oEvent) {
			var sValue = oEvent.getParameter("value");

			if (!sValue) {
				sValue = " ";
			}

			var sFilter = sValue;

			var oFilter = oFilter = new sap.ui.model.Filter("Zterm", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		atualizaTabela: function(oEvent) {
			var NrTransp = this.getView().byId("IdNrtransp").getValue();
			var Idsolicitacao = parseInt(this.getView().byId("Idsolicitacao").getValue());

			var filter01 = new sap.ui.model.Filter({
				path: "Nrtransp",
				operator: "EQ",
				value1: NrTransp
			});
			var filter02 = new sap.ui.model.Filter({
				path: "Idsolicitacao",
				operator: "EQ",
				value1: Idsolicitacao
			});

			if (!isNaN(Idsolicitacao)) {
				oEvent.getParameter("bindingParams").filters.push(filter01, filter02);
			}
		},

		OnSave: function() {
			var oModel = this.getView().getModel();
			var _oComponent = this.getOwnerComponent();
			var oList = _oComponent.oListSelector._oList;
			var oListBinding = oList.getBinding("items");
			var IdSolicitacao = this.getView().byId("IdSolicitacao").getValue();
			var IdRota = this.getView().byId("IdRota").getValue();
			var Volume = this.getView().byId("IdVolume").getValue();
			var OrcBaseline = this.getView().byId("IdOrcBaseline").getValue();
			var Saving = this.getView().byId("IdSaving").getValue();
			var Tco = this.getView().byId("IdTco").getValue();
			var VlrNegoc = this.getView().byId("IdVlrNegoc").getValue();
			var VlrProp = this.getView().byId("IdVlrProp").getValue();
			var Pedagio = this.getView().byId("IdPedagio").getValue();

			var textApro = sap.ui.getCore().byId(this.createId("IdAproTec")).getSelectedButton().getText();
			// var textHab = sap.ui.getCore().byId(this.createId("IdHabQuali")).getSelectedButton().getText();

			var oKeys = {};

			oKeys.Bukrs = this.getView().byId("IdBukrs2").getValue();
			oKeys.WerksO = this.getView().byId("IdWerksO2").getValue();
			oKeys.NrTransp = this.getView().byId("NrTransp").getValue();
			oKeys.TpVeiculo = this.getView().byId("IdTpVeiculo2").getValue();
			oKeys.Vigencia = this.getView().byId("IdVigencia").getValue();
			oKeys.Negociacao = this.getView().byId("IdNegociacao").getValue();
			oKeys.Volume = this.getView().byId("IdVolume").getValue();
			oKeys.DataBase = this.getView().byId("IDDataBase").getValue();
			oKeys.AtPreco = this.getView().byId("IdAtPreco").getValue();
			oKeys.PrazoPag = this.getView().byId("IdPrazoPag").getValue();
			oKeys.Incoterm = this.getView().byId("IdIncoterm").getValue();
			oKeys.Performance = this.getView().byId("IdPerformance").getValue();
			oKeys.Performance = this.getView().byId("IdObjeto").getValue();

			if (textApro === "Sim") {
				oKeys.AproTec = 'X';
			}
			if (textApro === "Não") {
				oKeys.AproTec = '-';
			}

			oKeys.IdRota = parseInt(IdRota);
			oKeys.IdSolicitacao = parseInt(IdSolicitacao);
			oKeys.Volume = parseInt(Volume);
			oKeys.OrcBaseline = parseInt(OrcBaseline);
			oKeys.Saving = parseInt(Saving);
			oKeys.Tco = parseInt(Tco);
			oKeys.VlrNegoc = parseInt(VlrNegoc);
			oKeys.VlrProp = parseInt(VlrProp);
			oKeys.Pedagio = parseInt(Pedagio);

			while (oKeys.TpVeiculo.indexOf(" ") != -1)
				oKeys.TpVeiculo = oKeys.TpVeiculo.replace(" ", "");
			var Key = "/ZET_CBMM_CF_VEICULOSet(Bukrs='" + oKeys.Bukrs + "',WerksO='" + oKeys.WerksO + "',IdSolicitacao=" + oKeys.IdSolicitacao +
				",IdRota=" + oKeys.IdRota +
				",NrTransp='" + oKeys.NrTransp +
				"',TpVeiculo='" + oKeys.TpVeiculo +
				"')";

			var dialog = new Dialog({
				title: 'Confirmação',
				type: 'Message',
				state: sap.ui.core.ValueState.Success,
				content: new Text({
					text: "Deseja realizar a Grava\xE7\xE3o?"
				}),
				beginButton: new Button({
					text: 'Confirma',
					press: function() {

						oModel.update(Key, oKeys, {
							success: function(oData, oResponse) {
								sap.m.MessageBox.success("Informações gravadas com sucesso.");
								oListBinding.refresh(true);
							},
							error: function(oError) {
								sap.m.MessageBox.error("Erro na Grava\xE7\xE3o da Sele\xE7\xE3o!!");
							}
						});
						dialog.close();
					}
				}),
				endButton: new Button({
					text: 'Cancelar',
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});
			dialog.open();
		},

		// for UPLOAD.
		onChange: function(oEvent) {
			// Stellen das CSRF Token wenn ein File hinzugefügt ist
			var oUploadCollection = oEvent.getSource();
			var _csrfToken = this.getView().getModel().oHeaders['x-csrf-token'];
			var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
				name: "x-csrf-token",
				value: _csrfToken
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
		},

		onuploadComplete: function(oEvent) {
			this.getView().getModel().refresh();

			// Inicio - Filtro nos uploads de arquivo
			var IdSolicitacao = this.getView().byId("Idsolicitacao").getValue();
			IdSolicitacao = parseInt(IdSolicitacao);

			var filter = IdSolicitacao,
				oFilter = new sap.ui.model.Filter("WerksO", sap.ui.model.FilterOperator.EQ, filter),
				oList = this.getView().byId("UploadCollection");

			// Executa filtro
			oList.getBinding("items").filter([oFilter]);
			// fim executa filtro

			var erro = oEvent.getParameters().getParameters().status;
			if (erro === 500) {
				var Menssagem = oEvent.getParameters().getParameters().response;
				var MostraMenssagem = Menssagem.substring(6, 35);
				var ZA = Menssagem.substring(0, 2);
				if (ZA === "ZA") {
					sap.m.MessageBox.error(MostraMenssagem);
				}
			}

		},

		onBeforeUploadStarts: function(oEvent) {

			var sName = "Teste";
			var IdSolicitacao = this.getView().byId("Idsolicitacao").getValue();
			var IdRota = 0;
			var sSlug = sName + "$" + IdSolicitacao + "$" + oEvent.getParameter("fileName") + "$" + IdRota + "$Subir";

			// Stellen die Kopf Parameter slug
			var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
				name: "slug",
				value: sSlug
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
			//			_busyDialog.open();
		},

		ondeletePress: function(oEvent) {
			var oModel = this.getView().getModel();
			var UploadCollection = this.getView().byId("UploadCollection");
			var oModel10 = UploadCollection.getModel();

			var Bukrs = "2001";
			var WerksO = this.getView().byId("IdWerkso").getValue();
			var IdSolicitacao = this.getView().byId("Idsolicitacao").getValue();
			IdSolicitacao = parseInt(IdSolicitacao);
			var IdRota = 0;

			var sEvent = oEvent.getSource();
			var sDocId = sEvent.getProperty("documentId");

			while (sDocId.indexOf(" ") != -1){
				sDocId = sDocId.replace(" ", "");
			}
			var sRefr = this.getView().getModel();

			sDocId = parseInt(sDocId);

			var oEntry = {};
			oEntry.Url = "DEL";

			var sService = "/ZET_CBMM_CF_UPLOADSet(Bukrs='" + Bukrs + "',WerksO='" + WerksO + "',IdSolicitacao=" + IdSolicitacao + ",IdRota=" +
				IdRota + ",DocId=" +
				sDocId + ")";

			var dialog = new Dialog({
				title: "Eliminação",
				type: "Message",
				content: new Text({
					text: "Confirma Eliminação do Arquivo Anexo?"
				}),
				beginButton: new Button({
					text: "Confirma",
					press: function() {

						oModel10.update(sService, oEntry, {
							success: function(oData, oResponse) {
								sap.m.MessageBox.success("Anexo Eliminado com Sucesso", {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function(sAction) {
										sRefr.refresh();
									}
								});
							},
							error: function(oError) {
								sap.m.MessageBox.error("Erro na Grava\xE7\xE3o da Sele\xE7\xE3o!!");
							}
						});
						dialog.close();
					}
				}),
				endButton: new Button({
					text: "Cancelar",
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});
			dialog.open();
		},
		// FIM Upload

		onEdit: function() {
			this.getView().byId("FormSt2").setVisible(true);
			this.getView().byId("FormSt1").setVisible(false);
		},

		onCancelar: function() {
			this.getView().byId("FormSt2").setVisible(false);
			this.getView().byId("FormSt1").setVisible(true);
		},

		onVotar: function() {
			var IdSolicitacao = this.getView().byId("Idsolicitacao").getValue();
			var Bukrs = "2001";
			var WerksO = this.getView().byId("IdWerkso").getValue();

			this.getRouter().navTo("BackDetail", {
				IdSolicitacao: IdSolicitacao,
				Bukrs: Bukrs,
				WerksO: WerksO
			});
		},

		onSalvar: function() {
			var smartTable2 = this.getView().byId("smartTable");
			var smartTable = this.getView().byId("smartTable1");
			var table = smartTable.getTable();
			var length = table.getSelectedIndices().length;
			var SelectedIndices = table.getSelectedIndices();
			var oModel = this.getView().getModel();
				oModel.setUseBatch(false);
			var Incoterm = "";
			var Montante = "";
			var DataInicio = "";
			var DataFim = "";
			var Orcamento = "";
			var Material = "";
			var B_Editar = this.getView().byId("B_Edit");
			var B_Salvar = this.getView().byId("B_Salvar");
			var B_Cancelar = this.getView().byId("B_Cancelar");
			var Key = "";
			var that = this;

			if (length === 0) {
				sap.m.MessageBox.error("Nenhuma linha selecionada para alteração.");
				return;
			}

			var dialog = new Dialog({
				title: 'Confirmação',
				type: 'Message',
				content: new Text({
					text: "Confirma alteração das linhas selecionadas?"
				}),
				beginButton: new Button({
					text: "Confirma",
					press: function() {
						//Função para Excluir registros
						for (var i = 0; i < length; i++) {
							var Indice = SelectedIndices[i];
							var oEntry = {};
							oEntry.Vencedor = "A";

							Incoterm = "";
							Incoterm = table.getRows()[Indice].getCells()[6].getValue();
							if (Incoterm !== "") {
								oEntry.Incoterm = Incoterm;
							}

							Montante = "";
							Montante = table.getRows()[Indice].getCells()[10].getValue();
							if (Montante !== "") {
								Montante = Montante.replace(",", ".");
								oEntry.Montante = Montante;
							}

							DataInicio = "";
							DataInicio = table.getRows()[Indice].getCells()[15].getValue();
							if (DataInicio !== "") {
								while(DataInicio.indexOf("//") != -1){
									DataInicio = DataInicio.replace("//", "");
								}
								oEntry.DataInicio = DataInicio;
							}

							DataFim = "";
							DataFim = table.getRows()[Indice].getCells()[16].getValue();
							if (DataFim !== "") {
								while(DataFim.indexOf("//") != -1){
									DataFim = DataFim.replace("//", "");
								}
								oEntry.DataFim = DataFim;
							}

							Orcamento = "";
							Orcamento = table.getRows()[Indice].getCells()[17].getValue();
							if (Orcamento !== "") {
								oEntry.Orcamento = parseFloat(Orcamento).toFixed(2);
							}

							Material = "";
							Material = table.getRows()[Indice].getCells()[0].getValue();
							if (Material !== "") {
								oEntry.Matnr = Material;
							}

							Key = "";
							Key = table.getContextByIndex(Indice).sPath;

							oModel.update(Key, oEntry, {
								success: function(oData, oResponse) {

								},
								error: function(oError) {
									sap.m.MessageBox.error("Alteração não realizada");
								}
							});

						}
						dialog.close();
					}
				}),
				endButton: new Button({
					text: 'Cancelar',
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
					that.getView().byId("FormSt2").setVisible(false);
					that.getView().byId("FormSt1").setVisible(true);
					smartTable.rebindTable("e");
					smartTable2.rebindTable("e");
				}
			});
			dialog.open();
		},

		handleValueHelpMap: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog1) {
				this._valueHelpDialog1 = sap.ui.xmlfragment("ZCBMM_GERAR_COTACAO.ZCBMM_GERAR_COTACAO.view.Matnr", this);
				this.getView().addDependent(this._valueHelpDialog1);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog1.open(sInputValue);
		},

		_handleValueHelpMatnr: function(oEvent) {
			var sValue = oEvent.getParameter("value");

			if (!sValue) {
				sValue = " ";
			}

			sValue = sValue.toUpperCase();
			var sFilter = sValue;
			var oFilter = new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.Contains, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);

		},
		
		_Confirme_Matnr: function(evt){
			var oSelectedItem = evt.getParameter("selectedItem");
			this._valueHelpDialog1 = null;

			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
			}
		}

	});

});