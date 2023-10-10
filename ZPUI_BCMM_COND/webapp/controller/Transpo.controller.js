sap.ui.define([
	"ZPUI_BCMM_COND/ZPUI_BCMM_COND/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/m/Text',
	"ZPUI_BCMM_COND/ZPUI_BCMM_COND/model/formatter"
], function(BaseController, JSONModel, Dialog, Button, Text, formatter) {
	"use strict";

	return BaseController.extend("ZPUI_BCMM_COND.ZPUI_BCMM_COND.controller.Transpo", {

		formatter: formatter,

		onInit: function() {
			// var oViewModel = new JSONModel({
			// 	busy: false,
			// 	delay: 0
			// });

			this.getRouter().getRoute("transpo").attachPatternMatched(this._onObjectMatched, this);
			this.getRouter().getRoute("backtranspo").attachPatternMatched(this.attTable, this);
			//this.setModel(oViewModel, "detailView");

			//this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},

		attTable: function() {
			var smartTable = this.getView().byId("smartTable");
			smartTable.rebindTable("e");

			sap.m.MessageToast.show("Registros inserido com sucesso");
		},
		
		onPress: function(oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
			this._input = "";

		},
		
		_showObject: function(oItem) {

			var NrTransp = oItem.getBindingContext().getProperty("NrTransp");
			var Tpveiculo = oItem.getBindingContext().getProperty("TpVeiculo");
			var WerksO = oItem.getBindingContext().getProperty("WerksO");
			var IdSolicitacao = oItem.getBindingContext().getProperty("IdSolicitacao");
			var IdRota = oItem.getBindingContext().getProperty("IdRota");
			var Bukrs = this.getView().byId("IdBukrs").getValue();
			
			this._input = "";

			this.getRouter().navTo("cond", {
				Bukrs: Bukrs,
				Tpveiculo: Tpveiculo,
				Werkso: WerksO,
				Idsolicitacao: IdSolicitacao,
				Idrota: IdRota,
				Nrtransp: NrTransp

			});
		},

		_onObjectMatched: function(oEvent) {
			var Bukrs = oEvent.getParameter("arguments").Bukrs;
			var IdSolicitacao = oEvent.getParameter("arguments").IdSolicitacao;
			var WerksO = oEvent.getParameter("arguments").WerksO;
			var IdRota = oEvent.getParameter("arguments").IdRota;
			var NrTransp = oEvent.getParameter("arguments").NrTransp;

			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("ZET_CBMM_CF_TRANSPSet", {
					Bukrs: Bukrs,
					WerksO: WerksO,
					IdSolicitacao: parseInt(IdSolicitacao),
					IdRota: parseInt(IdRota),
					NrTransp: NrTransp
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		atualizaTabela: function(oEvent) {
			var NrTransp = this.getView().byId("IdNrTransp").getValue();
			var IdRota = this.getView().byId("IdRota").getValue();
			var IdSolicitacao = this.getView().byId("IdSolicitacao").getValue();

			var filter01 = new sap.ui.model.Filter({
				path: "NrTransp",
				operator: "EQ",
				value1: NrTransp
			});
			var filter02 = new sap.ui.model.Filter({
				path: "IdRota",
				operator: "EQ",
				value1: IdRota
			});
			var filter03 = new sap.ui.model.Filter({
				path: "IdSolicitacao",
				operator: "EQ",
				value1: IdSolicitacao
			});

			if (NrTransp) {
				oEvent.getParameter("bindingParams").filters.push(filter01, filter02, filter03);
			}
		},

		onBack: function() {
			this.getRouter().navTo("Back");
			this._input = "";
		},

		addRow: function() {
			if (!this._input) {
				var that = this;
				that._input = new sap.m.Input({
						showValueHelp: true,
						editable: true,
						submit: function(oEvent) {

							var oModel = that.getView().getModel();
							var key = "";
							var oParameters = {};

							oParameters.Bukrs = that.getView().byId("IdBukrs").getValue();
							oParameters.WerksO = that.getView().byId("IdWerksO").getValue();
							oParameters.IdSolicitacao = parseInt(that.getView().byId("IdSolicitacao").getValue());
							oParameters.IdRota = parseInt(that.getView().byId("IdRota").getValue());
							oParameters.NrTransp = that.getView().byId("IdNrTransp").getValue();
							oParameters.TpVeiculo = this.getValue();

							if (!oParameters.TpVeiculo) {
								sap.m.MessageBox.show("Campo Tipo de veículo obrigatório");
								that._input.setValueState("Warning");
								return;
							}

							oParameters.TpVeiculo = oParameters.TpVeiculo.replace(/ /g, "%20");

							var oModel2 = new sap.ui.model.json.JSONModel();
							var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_VEIC_HSet/$count?$filter=Matnr eq '" +
								oParameters.TpVeiculo + "'";

							oModel2.loadData(serviceUrl, null, false, "GET", false, false, null);
							var oInd = oModel2.getData();

							if (oInd !== 1) {
								sap.m.MessageToast.show("Veículo inválido, favor selecionar um veículo válido.");
								that._input.setValueState("Error");
								return;
							}

							key = "/ZET_CBMM_CF_VEICULOSet(Bukrs='" + oParameters.Bukrs + "',WerksO='" + oParameters.WerksO + "',IdSolicitacao=" +
								oParameters
								.IdSolicitacao + ",IdRota=" + oParameters.IdRota + ",NrTransp='" + oParameters.NrTransp + "',TpVeiculo='" + oParameters.TpVeiculo +
								"')";

							oModel.update(key, oParameters, {
								success: function(oData, oResponse) {
									sap.m.MessageBox.success("Veiculo cadastrado com sucesso");
									that.byId("table").getBinding("items").refresh();
								},

								error: function(e) {
									sap.m.MessageBox.error("Não foi possível inserir o veículo");
								}
							});
							that.getView().byId("smartTable").rebindTable("e");
							that._input = "";

						},
						valueHelpRequest: function(oEvent) {
							var sInputValue = oEvent.getSource().getValue();
							that.inputId = oEvent.getSource().getId();
							// create value help dialog
							if (!that._valueHelpDialog2) {
								that._valueHelpDialog2 = sap.ui.xmlfragment("ZPUI_BCMM_COND.ZPUI_BCMM_COND.view.Veic", that);
								that.getView().addDependent(that._valueHelpDialog2);
								that._valueHelpDialog2.setModel(that.getView().getModel());

							}
							// open value help dialog filtered by the input value
							that._valueHelpDialog2.open(sInputValue);
						}

					}

				);
				var item = new sap.m.ColumnListItem({
					cells: [that._input]
				});

				this.byId("table").addItem(item);
			}
		},

		DeleteRecords: function() {

			var oModel = this.getView().getModel();
			var oTable = this.getView().byId("smartTable").getTable();
			var items = oTable._aSelectedPaths;
			var length = items.length;
			var erro = 0;
			var este = this;
			var texto = " ";

			if (items.length < 1) {
				sap.m.MessageBox.error("Nenhuma linha selecionada");
				return;
			} else {
				texto = "Confirma exclusão dos registros selecionados?";
			}

			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: texto
				}),
				beginButton: new Button({
					text: "Sim",
					press: function() {

						for (var i = 0; i < length; i++) {
							var oEntry = oTable._aSelectedPaths[i];

							oModel.remove(oEntry, {
								method: "DELETE",
								success: function(data) {
								este._input = "";
									erro = 0;
								},
								error: function(e) {

									erro = 1;
								}
							});
						}
						dialog.close();
						oTable = este.byId("table");
						oTable.getBinding("items").refresh();

						if (erro === 0) {
							sap.m.MessageBox.success("Registros Excluidos Corretamente!");
						} else if (erro === 1) {
							sap.m.MessageBox.error("Registros não foram excluidos - Erro ao chamar o serviço!");
						}
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
			
			this._input = "";

		},

		_bindView: function(sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getView("transpoView").getModel();
			//this.getView().getModel();

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

			var sPath = oElementBinding.getPath(),
				oResourceBundle = this.getResourceBundle(),
				oObject = oView.getModel().getObject(sPath),
				sObjectId = oObject.IdSolicitacao,
				sObjectName = oObject.IdSolicitacao,
				oViewModel = this.getView("transpoView").getModel();

			this.getOwnerComponent().oListSelector.selectAListItem(sPath);

			oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("shareSaveTileAppTitle", [sObjectName]));
			oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));

			var smartTable = this.getView().byId("smartTable");
			smartTable.rebindTable("e");
		},

		_handleValueHelpClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");

			this._valueHelpDialog1 = null;
			this._valueHelpDialog4 = null;
			this._valueHelpDialog6 = null;

			if (oSelectedItem) {
				var productInput = this._input;
				productInput.setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);
			this._input.setValueState("None");
		},

		_handleValueHelpVeic: function(oEvent) {
			var sValue = oEvent.getParameter("value");

			if (!sValue) {
				sValue = " ";
			}

			var sFilter = sValue;

			var oFilter = oFilter = new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.Contains, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);

		}
	});

});