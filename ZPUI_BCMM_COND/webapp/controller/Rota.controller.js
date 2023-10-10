sap.ui.define([
	"ZPUI_BCMM_COND/ZPUI_BCMM_COND/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/m/Button',
	'sap/ui/model/Filter',
	'sap/m/Dialog',
	'sap/m/Text',
	"ZPUI_BCMM_COND/ZPUI_BCMM_COND/model/formatter"
], function(BaseController, JSONModel, Button, Filter, Dialog, Text, formatter) {
	"use strict";

	return BaseController.extend("ZPUI_BCMM_COND.ZPUI_BCMM_COND.controller.Rota", {

		formatter: formatter,

		onInit: function() {
			this.getRouter().getRoute("rota").attachPatternMatched(this._onObjectMatched, this);
			this.getRouter().getRoute("Back").attachPatternMatched(this.atualizaSmartTable, this);
		},

		atualizaSmartTable: function() {
			this.getView().byId("smartTable").rebindTable("e");

		},

		_onObjectMatched: function(oEvent) {
			var Bukrs = oEvent.getParameter("arguments").Bukrs;
			var IdSolicitacao = oEvent.getParameter("arguments").IdSolicitacao;
			var WerksO = oEvent.getParameter("arguments").WerksO;
			var Werks = oEvent.getParameter("arguments").Werks ;
			var IdRota = oEvent.getParameter("arguments").IdRota;
			var Carteira = oEvent.getParameter("arguments").Carteira;
			var Prioridade = oEvent.getParameter("arguments").Prioridade;
			var DtInic = oEvent.getParameter("arguments").DtInic;
			var GrpCompras = oEvent.getParameter("arguments").GrpCompras;
			var Modalidade = oEvent.getParameter("arguments").Modalidade;
			var Finalidade = oEvent.getParameter("arguments").Finalidade;
			
			IdSolicitacao = parseInt(IdSolicitacao);
			IdRota = parseInt(IdRota);
			
			this.getView().byId("idIdRota").setValue(IdRota);
			while (DtInic.indexOf('_') != -1) {
				DtInic = DtInic.replace('_','/');
			}

			this.getView().byId("IdCarteira").setValue(Carteira);
			this.getView().byId("IdWerks").setValue(Werks);
			this.getView().byId("IdIdSolicitacao").setValue(IdSolicitacao);
			this.getView().byId("IdPrioridade").setValue(Prioridade);
			this.getView().byId("IdDtInic").setValue(DtInic);
			this.getView().byId("IdGrpCompras").setValue(GrpCompras);
			this.getView().byId("IdModalidade").setValue(Modalidade);
			this.getView().byId("IdFinalidade").setValue(Finalidade);
			this.getView().byId("Bukrs").setValue(Bukrs);
			this.getView().byId("IdDtInicC").setValue(DtInic);

			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("ZET_CBMM_CF_ROTASet", {
					Bukrs: Bukrs,
					IdSolicitacao: IdSolicitacao,
					WerksO: WerksO,
					IdRota: IdRota
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));

			//this.getView().byId("smartTable").rebindTable("e");
		},

		_bindView: function(sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getView("rotaView").getModel();

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
				oViewModel = this.getView("rotaView").getModel();

			this.getOwnerComponent().oListSelector.selectAListItem(sPath);

			oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("shareSaveTileAppTitle", [sObjectName]));
			oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));

			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();
			var IdRota = this.getView().byId("idIdRota").getValue();
			var WerksO = this.getView().byId("IdWerks").getValue();
			var oModel2 = new sap.ui.model.json.JSONModel();
			var oInd = {};

			var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_UPLOADSet(Bukrs='2001',WerksO='" + WerksO +
				"',IdSolicitacao=" + IdSolicitacao + ",IdRota=" + IdRota + ",DocId=1)";

			oModel2.loadData(serviceUrl, null, false, "GET", false, false, null);
			oInd = oModel2.oData.d.Filename;

			if (!oInd) {
				this.getView().byId("UploadCollection").setVisible(false);
			} else {
				this.getView().byId("UploadCollection").setVisible(true);
			}

			// Inicio - Filtro nos uploads de arquivo   

			var filter = IdSolicitacao + ";" + IdRota,
				oFilter = new sap.ui.model.Filter("WerksO", sap.ui.model.FilterOperator.EQ, filter),
				oList = this.getView().byId("UploadCollection");
			// Executa filtro   
			oList.getBinding("items").filter([oFilter]);
			
			var IdMengeUnit = this.getView().byId("IdMengeUnit").getValue();
			IdMengeUnit = parseInt(IdMengeUnit);
			IdMengeUnit = IdMengeUnit.toLocaleString('pt-BR');
			
			this.getView().byId("IdMengeUnit").setValue(IdMengeUnit);
			this.getView().byId("smartTable").rebindTable("e");

		},

		onPress: function(oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
			this._input = "";

		},


		atualizaTabela: function(oEvent) {
			var IdRota = this.getView().byId("idIdRota").getValue();
			var IdSol = this.getView().byId("IdIdSolicitacao").getValue();

			var filter01 = new sap.ui.model.Filter({
				path: "IdRota",
				operator: "EQ",
				value1: IdRota
			});

			var filter02 = new sap.ui.model.Filter({
				path: "IdSolicitacao",
				operator: "EQ",
				value1: IdSol
			});

			if (IdRota && IdSol) {
				oEvent.getParameter("bindingParams").filters.push(filter01, filter02);
			}
		},

		atualizaTabelaVeic: function(oEvent) {
			var IdSol = this.getView().byId("IdIdSolicitacao").getValue();

			if (IdSol) {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "IdSolicitacao",
					operator: "EQ",
					value1: IdSol
				}));
			}
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

							oParameters.Bukrs = that.getView().byId("Bukrs").getValue();
							oParameters.WerksO = that.getView().byId("IdWerks").getValue();
							oParameters.IdSolicitacao = parseInt(that.getView().byId("IdIdSolicitacao").getValue());
							oParameters.IdRota = parseInt(that.getView().byId("idIdRota").getValue());
							oParameters.NrTransp = that._input.getValue();

							var oModel2 = new sap.ui.model.json.JSONModel();
							var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_TRANSP_HSet/$count?$filter=Lifnr eq '" +
								oParameters.NrTransp + "'";

							oModel2.loadData(serviceUrl, null, false, "GET", false, false, null);
							var oInd = oModel2.getData();

							if (oInd !== 1) {
								sap.m.MessageToast.show("Transportadora inválida, favor selecionar uma transportadora válida.");
								that._input.setValueState("Error");
								return;
							}

							key = "/ZET_CBMM_CF_TRANSPSet(Bukrs='" + oParameters.Bukrs + "',WerksO='" + oParameters.WerksO + "',IdSolicitacao=" +
								oParameters
								.IdSolicitacao + ",IdRota=" + oParameters.IdRota + ",NrTransp='" + oParameters.NrTransp + "')";

							oModel.update(key, oParameters);

							that.getView().byId("smartTable").rebindTable("e");
							that._input = "";

						},
						valueHelpRequest: function(oEvent) {
							var sInputValue = oEvent.getSource().getValue();
							that.inputId = oEvent.getSource().getId();
							// create value help dialog
							if (!that._valueHelpDialog2) {
								that._valueHelpDialog2 = sap.ui.xmlfragment("ZPUI_BCMM_COND.ZPUI_BCMM_COND.view.Transp", that);
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

		onBack: function() {
			this.getRouter().navTo("backdetail");
			this._input = "";
		},

		DeleteRecords: function(oEvent) {
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
		OnChange: function(oEvent) {

			var oModel = this.getView().getModel();
			var key = "";
			var oParameters = {};
			var este = this;

			oParameters.Bukrs = this.getView().byId("Bukrs").getValue();
			oParameters.WerksO = this.getView().byId("IdWerks").getValue();
			oParameters.IdSolicitacao = parseInt(this.getView().byId("IdIdSolicitacao").getValue());
			oParameters.IdRota = parseInt(this.getView().byId("IdRota").getValue());
			oParameters.NrTransp = oEvent.getSource().getBindingContext().getObject();

			var oModel2 = new sap.ui.model.json.JSONModel();
			var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_TRANSP_HSet/$count?$filter=Lifnr eq '" +
				oParameters
				.NrTransp + "'";

			oModel2.loadData(serviceUrl, null, false, "GET", false, false, null);
			var oInd = oModel2.getData();

			if (oInd !== 1) {
				sap.m.MessageToast.show("Transportadora inválida, favor selecionar uma transportadora válida.");
				return;
			}

			key = "/ZET_CBMM_CF_TRANSPSet(Bukrs='" + oParameters.Bukrs + "',WerksO='" + oParameters.WerksO + "',IdSolicitacao=" + oParameters
				.IdSolicitacao + ",IdRota=" + oParameters.IdRota + ",NrTransp='" + oParameters.NrTransp + "')";

			oModel.update(key, oParameters, {
				success: function(oData, oResponse) {
					sap.m.MessageBox.success("Transportadora cadastrada com sucesso", {
						actions: ["OK", sap.m.MessageBox.Action.CLOSE],
						onClose: function(sAction) {

						}

					});

				},

				error: function(e) {
					sap.m.MessageBox.error("Não foi possível inserir a transportadora");
				}
			});
			this._input = "";
		},

		onNrTransp: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog2) {
				this._valueHelpDialog2 = sap.ui.xmlfragment("ZPUI_BCMM_COND.ZPUI_BCMM_COND.view.Transp", this);
				this.getView().addDependent(this._valueHelpDialog2);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog2.open(sInputValue);
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

		_handleValueHelpTransp: function(oEvent) {
			var sValue = oEvent.getParameter("value");

			if (!sValue) {
				sValue = " ";
			}

			var sFilter = sValue;

			var oFilter = oFilter = new sap.ui.model.Filter("Lifnr", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);

		},

		_showObject: function(oItem) {

			var NrTransp = oItem.getBindingContext().getProperty("NrTransp");
			var Bukrs = this.getView().byId("Bukrs").getValue();
			var WerksO = this.getView().byId("IdWerks").getValue();
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();
			var IdRota = this.getView().byId("idIdRota").getValue();

			this.getRouter().navTo("transpo", {
				Bukrs: Bukrs,
				WerksO: WerksO,
				IdSolicitacao: IdSolicitacao,
				IdRota: IdRota,
				NrTransp: NrTransp

			});
		}

	});

});