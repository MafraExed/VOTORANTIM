sap.ui.define([
	"ZPUI_BCMM_COND/ZPUI_BCMM_COND/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/m/Text',
	"ZPUI_BCMM_COND/ZPUI_BCMM_COND/model/formatter"
], function(BaseController, JSONModel, Dialog, Button, Text, formatter) {
	"use strict";

	return BaseController.extend("ZPUI_BCMM_COND.ZPUI_BCMM_COND.controller.Cond", {

		onInit: function() {

			this.getRouter().getRoute("cond").attachPatternMatched(this._onObjectMatched, this);

		},

		_onObjectMatched: function(oEvent) {
			this.getView().byId("IdTpveiculo").setValue(oEvent.getParameter("arguments").Tpveiculo);
			this.getView().byId("Idsolicitacao").setValue(oEvent.getParameter("arguments").Idsolicitacao);
			this.getView().byId("IdWerkso").setValue(oEvent.getParameter("arguments").Werkso);
			this.getView().byId("Idrota").setValue(oEvent.getParameter("arguments").Idrota);
			this.getView().byId("IdNrtransp").setValue(oEvent.getParameter("arguments").Nrtransp);
			this.getView().byId("IdBukrs").setValue(oEvent.getParameter("arguments").Bukrs);

			this.getView().byId("smartTable").rebindTable("e");
			this.getView().byId("smartTable2").rebindTable("e");

			this.getView().byId("form1").setVisible(true);
			this.getView().byId("form2").setVisible(false);

		},

		VerificaExcel: function(oEvent) {
			var idsol = this.getView().byId("Idsolicitacao").getValue();
			var cond = this.getView().byId("smartTable").getTable().getRows()[0].getCells()[3].getValue();
			var neg = this.getView().byId("smartTable").getTable().getRows()[0].getCells()[13].getValue();

			oEvent.getParameters().exportSettings.fileName = idsol + "_" + neg + "_" + cond;
		},
		onBack: function() {
			// voltar para tela anterior
			this.getRouter().navTo("backtranspo");
			this._input = "";
		},

		addRow2: function() {
			this.getView().byId("form1").setVisible(false);
			this.getView().byId("form2").setVisible(true);
			this.addRow();
		},

		addRow: function() {
			if (!this._input) {
				var that = this;
				that._input = [new sap.m.Input({
							showValueHelp: true,
							editable: true,
							submit: function(oEvent) {

								var oModel = that.getView().getModel();
								var key = "";
								var oParameters = {};

								oParameters.Kschl = this.getValue();
								oParameters.Werkso = that.getView().byId("IdWerkso").getValue();
								oParameters.Idsolicitacao = parseInt(that.getView().byId("Idsolicitacao").getValue());
								oParameters.Idrota = parseInt(that.getView().byId("Idrota").getValue());
								oParameters.Nrtransp = that.getView().byId("IdNrtransp").getValue();
								oParameters.Bukrs = that.getView().byId("IdBukrs").getValue();
								oParameters.QtdEscala = that._input[1].getValue();
								var veic = that.getView().byId("IdTpveiculo").getValue();
								veic = veic.replace(/ /g, "%20");
								veic = veic.replace(/#/g, "%23");
								oParameters.Tpveiculo = veic;

								if (!oParameters.Kschl) {
									sap.m.MessageBox.show("Campo condição e quantidade obrigatório");
									that._input[0].setValueState("Warning");

									return;
								}

								var oModel2 = new sap.ui.model.json.JSONModel();
								var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_VEICONDSet/$count?$filter=Kschl eq '" +
									oParameters.Kschl + "'";

								oModel2.loadData(serviceUrl, null, false, "GET", false, false, null);
								var oInd = oModel2.getData();

								if (oInd !== 1) {
									sap.m.MessageToast.show("Condição inválida, favor selecionar uma condição válida.");
									that._input[0].setValueState("Error");
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
							valueHelpRequest: function(oEvent) {
								var sInputValue = oEvent.getSource().getValue();
								that.inputId = oEvent.getSource().getId();
								// create value help dialog
								if (!that._valueHelpDialog2) {
									that._valueHelpDialog2 = sap.ui.xmlfragment("ZPUI_BCMM_COND.ZPUI_BCMM_COND.view.Condicoes", that);
									that.getView().addDependent(that._valueHelpDialog2);
									that._valueHelpDialog2.setModel(that.getView().getModel());

								}
								// open value help dialog filtered by the input value
								that._valueHelpDialog2.open(sInputValue);
							}

						}

					),
					new sap.m.Input({
							type:"Text",
							editable: true,
							placeholder: "0,0",
							value: "0,0",
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
			var erro = 0;
			var este = this;
			var texto = " ";

			if (this.getView().byId("smartTable").getTable()._oSelection.aSelectedIndices.length < 1) {
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

						for (var i = 0; i < este.getView().byId("smartTable").getItems().length; i++) {

							if (este.getView().byId("smartTable").getTable()._oSelection.aSelectedIndices[i] === i) {
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

		},

		atualizaTabela: function(oEvent) {
			var NrTransp = this.getView().byId("IdNrtransp").getValue();
			var IdRota = parseInt(this.getView().byId("Idrota").getValue());
			var Idsolicitacao = parseInt(this.getView().byId("Idsolicitacao").getValue());
			var IdTpveiculo = this.getView().byId("IdTpveiculo").getValue();
			var IdWerkso = this.getView().byId("IdWerkso").getValue();

			var filter01 = new sap.ui.model.Filter({
				path: "Nrtransp",
				operator: "EQ",
				value1: NrTransp
			});
			var filter02 = new sap.ui.model.Filter({
				path: "Idrota",
				operator: "EQ",
				value1: IdRota
			});
			var filter03 = new sap.ui.model.Filter({
				path: "Idsolicitacao",
				operator: "EQ",
				value1: Idsolicitacao
			});
			var filter04 = new sap.ui.model.Filter({
				path: "Tpveiculo",
				operator: "EQ",
				value1: IdTpveiculo
			});
			var filter05 = new sap.ui.model.Filter({
				path: "Werkso",
				operator: "EQ",
				value1: IdWerkso
			});

			if (!isNaN(Idsolicitacao) || !isNaN(IdRota)) {
				oEvent.getParameter("bindingParams").filters.push(filter01, filter02, filter03, filter04, filter05);
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
		}

	});
});