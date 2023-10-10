sap.ui.define([
	"ZCBMM_GERAR_COTACAO/ZCBMM_GERAR_COTACAO/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/m/Text',
	"ZCBMM_GERAR_COTACAO/ZCBMM_GERAR_COTACAO/model/formatter"
], function(BaseController, JSONModel, Dialog, Button, Text, formatter) {
	"use strict";

	return BaseController.extend("ZCBMM_GERAR_COTACAO.ZCBMM_GERAR_COTACAO.controller.Condition", {

		onInit: function() {
			this.getRouter().getRoute("Condition").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function(oEvent) {
			var IdSolicitacao = oEvent.getParameter("arguments").IdSolicitacao;
			this.getView().byId("Idsolicitacao").setValue(IdSolicitacao);

			var WerksO = oEvent.getParameter("arguments").WerksO;
			this.getView().byId("IdWerkso").setValue(WerksO);

			this.getView().byId("form1").setVisible(true);
			this.getView().byId("form2").setVisible(false);
			
			var oModel2 = new sap.ui.model.json.JSONModel();
			var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_VEICONDSet/?$filter=Idsolicitacao eq " +
				IdSolicitacao + " and Moeda eq 'C'";
			oModel2.loadData(serviceUrl, null, false, "GET", false, false, null);
			var length = oModel2.oData.d.results.length;
			
			for (var i = 0; i < length; i++) {
				var itinerario = oModel2.oData.d.results[i].IntDescr;
				if (itinerario === ""){
					this.getView().byId("MessageIt").setVisible(true);
				}
			}
			
			this.getView().byId("smartTable").rebindTable("e");
			this.getView().byId("smartTable2").rebindTable("e");

		},

		VerificaExcel: function(oEvent) {
			var idsol = this.getView().byId("Idsolicitacao").getValue();
			var cond = this.getView().byId("smartTable").getTable().getRows()[0].getCells()[3].getValue();
			var neg = this.getView().byId("smartTable").getTable().getRows()[0].getCells()[13].getValue();

			oEvent.getParameters().exportSettings.fileName = idsol + "_" + neg + "_" + cond;
		},
		onBack: function() {
			// voltar para tela anterior
			this._input = "";
			this.getRouter().navTo("backtranspo");

		},

		addRow2: function() {
			this.getView().byId("form1").setVisible(false);
			this.getView().byId("form2").setVisible(true);
			this.addRow();
		},

		addRow: function() {
			if (!this._input) {
				var that = this;
				that._input = [
					new sap.m.Input({
							showValueHelp: true,
							editable: true,
							submit: function(oEvent) {

								var oModel = that.getView().getModel();
								var key = "";
								var oParameters = {};

								oParameters.Kschl = this.getValue();
								oParameters.Werkso = that.getView().byId("IdWerkso").getValue();
								oParameters.Idsolicitacao = parseInt(that.getView().byId("Idsolicitacao").getValue());
								oParameters.Idrota = 0;
								oParameters.Nrtransp = "-";
								oParameters.Bukrs = "2001";
								oParameters.QtdEscala = that._input[1].getValue();
								var veic = "-";
								veic = veic.replace(/ /g, "%20");
								veic = veic.replace(/#/g, "%23");
								oParameters.Tpveiculo = veic;

								if (!oParameters.Kschl) {
									sap.m.MessageBox.show("Campo condição e quantidade obrigatório");
									that._input[0].setValueState("Warning");

									return;
								}

								var oModel2 = new sap.ui.model.json.JSONModel();
								var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_VEICONDSet/?$filter=Kschl eq '" +
									oParameters.Kschl + "' and Moeda eq 'X'";

								oModel2.loadData(serviceUrl, null, false, "GET", false, false, null);
								var length = oModel2.oData.d.results.length;
								if (length === 0) {
									sap.m.MessageToast.show("Condição inválida, favor selecionar uma condição válida.");
									that._input[0].setValueState("Error");
									return;
								} else {

									var Kschl = oModel2.oData.d.results[0].Kschl;
									var Descricao = oModel2.oData.d.results[0].Descricao;
								}

								key = "/ZET_CBMM_CF_VEICONDSet(Bukrs='" + oParameters.Bukrs + "',Kschl='" + oParameters.Kschl + "',Werkso='" + oParameters.Werkso +
									"',Idsolicitacao=" + oParameters.Idsolicitacao + ",Idrota=" + oParameters.Idrota + ",Nrtransp='" + oParameters.Nrtransp +
									"',Tpveiculo='" + oParameters.Tpveiculo + "',QtdEscala='" + oParameters.QtdEscala + "')";

								oModel.update(key, oParameters, {
									success: function(oData, oResponse) {
										sap.m.MessageBox.success("Condição cadastrada com sucesso");
										that.byId("table").getBinding("items").refresh();
									},

									error: function(e) {
										sap.m.MessageBox.error("Não foi possível inserir condição");
									}
								});
								that.getView().byId("smartTable").rebindTable("e");
								that.getView().byId("smartTable2").rebindTable("e");

								that.getView().byId("form1").setVisible(true);
								that.getView().byId("form2").setVisible(false);
								that._input = "";

							},
							valueHelpRequest: function(oEvent) {
								var sInputValue = oEvent.getSource().getValue();
								that.inputId = oEvent.getSource().getId();
								// create value help dialog
								if (!that._valueHelpDialog2) {
									that._valueHelpDialog2 = sap.ui.xmlfragment("ZCBMM_GERAR_COTACAO.ZCBMM_GERAR_COTACAO.view.Condicoes", that);
									that.getView().addDependent(that._valueHelpDialog2);
									that._valueHelpDialog2.setModel(that.getView().getModel());

								}
								// open value help dialog filtered by the input value
								that._valueHelpDialog2.open(sInputValue);
							}

						}

					),
					new sap.m.Input({
							type: "Text",
							editable: true,
							placeholder: "0.000",
							value: "0.000",
							submit: function(oEvent) {
								var oModel = that.getView().getModel();
								var key = "";
								var oParameters = {};

								oParameters.QtdEscala = this.getValue();
								oParameters.Werkso = that.getView().byId("IdWerkso").getValue();
								oParameters.Idsolicitacao = parseInt(that.getView().byId("Idsolicitacao").getValue());
								oParameters.Idrota = parseInt(that.getView().byId("Idrota").getValue());
								oParameters.Nrtransp = that.getView().byId("IdNrtransp").getValue();
								var veic = that.getView().byId("IdTpveiculo").getValue();
								oParameters.Tpveiculo = veic.replace(/ /g, "%20");
								oParameters.Bukrs = that.getView().byId("IdBukrs").getValue();
								oParameters.Kschl = that._input[0].getValue();

								if (!oParameters.Kschl) {
									sap.m.MessageBox.show("Campo condição é obrigatório");
									that._input[0].setValueState("Warning");
									//that._input[1].setValueState("Warning");
									return;
								}

								key = "/ZET_CBMM_CF_VEICONDSet(Bukrs='" + oParameters.Bukrs + "',Kschl='" + oParameters.Kschl + "',Werkso='" + oParameters.Werkso +
									"',Idsolicitacao=" + oParameters.Idsolicitacao + ",Idrota=" + oParameters.Idrota + ",Nrtransp='" + oParameters.Nrtransp +
									"',Tpveiculo='" + oParameters.Tpveiculo + "',QtdEscala='" + oParameters.QtdEscala + "')";

								oModel.update(key, oParameters, {
									success: function(oData, oResponse) {
										sap.m.MessageBox.success("Condição cadastrada com sucesso");
										that.byId("table").getBinding("items").refresh();
									},

									error: function(e) {
										sap.m.MessageBox.error("Não foi possível inserir condição");
									}
								});
								that.getView().byId("smartTable").rebindTable("e");
								that.getView().byId("smartTable2").rebindTable("e");

								that.getView().byId("form1").setVisible(true);
								that.getView().byId("form2").setVisible(false);
								that._input = "";

							},

						}

					),
					new sap.m.Input({
						editable: false,
						value: "TO"

					})
				];
				var item = new sap.m.ColumnListItem({
					cells: [that._input]
				});

				this.byId("table").addItem(item);
			}
		},

		DeleteRecords: function() {

			var oModel = this.getView().getModel();
			var oTable = this.getView().byId("smartTable").getTable();
			var length = oTable._oSelection.aSelectedIndices.length;
			var erro = 0;
			var este = this;
			var texto = " ";

			if (length === 0) {
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

							var oEntry = este.getView().byId("smartTable").getTable().getRows()[i].getBindingContext().sPath;
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

						if (erro === 0) {
							sap.m.MessageBox.success("Registros Excluidos Corretamente!", {
								actions: ["OK", sap.m.MessageBox.Action.CLOSE],
								onClose: function(sAction) {
									oTable = este.byId("table");
									oTable.getBinding("items").refresh();
								}
							});
						} else if (erro === 1) {
							sap.m.MessageBox.error("Registros não foram excluidos - Erro ao chamar o serviço!");
							return;
						}

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

		atualizaTabela: function(oEvent) {
			var Idsolicitacao = parseInt(this.getView().byId("Idsolicitacao").getValue());
			var Moeda = 'C';

			var filter01 = new sap.ui.model.Filter({
				path: "Idsolicitacao",
				operator: "EQ",
				value1: Idsolicitacao
			});

			var filter02 = new sap.ui.model.Filter({
				path: "Moeda",
				operator: "EQ",
				value1: Moeda
			});

			if (!isNaN(Idsolicitacao)) {
				oEvent.getParameter("bindingParams").filters.push(filter01, filter02);
			}
		},

		_handleValueHelpClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");

			this._valueHelpDialog1 = null;
			this._valueHelpDialog4 = null;
			this._valueHelpDialog6 = null;

			if (oSelectedItem) {
				var productInput = this._input[0];
				productInput.setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);
			this._input[0].setValueState("None");
		},

		_handleValueHelpCond: function(oEvent) {
			var sValue = oEvent.getParameter("value");

			if (!sValue) {
				sValue = " ";
			}

			sValue = sValue.toUpperCase();
			var sFilter = sValue;
			var oFilter = new sap.ui.model.Filter("Kschl", sap.ui.model.FilterOperator.Contains, sFilter);
			var oFilter2 = new sap.ui.model.Filter("Descricao", sap.ui.model.FilterOperator.EQ, "ZCOND");
			oEvent.getSource().getBinding("items").filter([oFilter, oFilter2]);

		},
		_onModelContextChangeCond: function(oEvent) {
			var Descricao = "ZCOND";

			var sFilter = Descricao;
			var oFilter = oFilter = new sap.ui.model.Filter("Descricao", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		onVotar: function() {
			this._input = "";
			var IdSolicitacao = this.getView().byId("Idsolicitacao").getValue();
			var Bukrs = "2001";
			var WerksO = this.getView().byId("IdWerkso").getValue();

			this.getRouter().navTo("BackDetail", {
				IdSolicitacao: IdSolicitacao,
				Bukrs: Bukrs,
				WerksO: WerksO,
			});
		}

	});
});