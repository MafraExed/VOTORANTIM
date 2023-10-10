/*global location */
sap.ui.define([
	"ZCBMM_SEL_VENCEDOR/ZCBMM_SEL_VENCEDOR/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ZCBMM_SEL_VENCEDOR/ZCBMM_SEL_VENCEDOR/model/formatter",
	"sap/m/MessageToast",
	"sap/ui/core/mvc/Controller",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text"
], function (BaseController, JSONModel, formatter, MessageToast, Controller, Dialog, Button, Text) {
	"use strict";

	return BaseController.extend("ZCBMM_SEL_VENCEDOR.ZCBMM_SEL_VENCEDOR.controller.Detail", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function () {

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			this._oBusyDialog = new sap.m.BusyDialog();

		},

		onShareEmailPress: function () {
			var oViewModel = this.getModel("detailView");

			sap.m.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},

		onShareInJamPress: function () {
			var oViewModel = this.getModel("detailView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});

			oShareDialog.open();
		},

		_onObjectMatched: function (oEvent) {
			var IdSolicitacao = oEvent.getParameter("arguments").IdSolicitacao;
			var WerksO = oEvent.getParameter("arguments").WerksO;

			this.getView().byId("Idsolicitacao").setValue(IdSolicitacao);
			this.getView().byId("IdWerkso").setValue(WerksO);

			var smartTable = this.getView().byId("smartTable");
			smartTable.rebindTable("e");

		},

		atualizaTabela: function (oEvent) {
			var IdSolicitacao = this.getView().byId("Idsolicitacao").getValue();

			if (IdSolicitacao) {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Idsolicitacao",
					operator: "EQ",
					value1: IdSolicitacao
				}));
			}

			oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
				path: "Moeda",
				operator: "EQ",
				value1: "Y"
			}));
		},

		onConfirm: function () {
			var that = this;
			var _oComponent = this.getOwnerComponent();
			var oList = _oComponent.oListSelector._oList;
			var oListBinding = oList.getBinding("items");
			var smarttable = this.getView().byId("smartTable");
			var table = smarttable.getTable();
			var length = table.getSelectedIndices().length;
			var SelectedIndices = table.getSelectedIndices();
			var oModel = this.getView().getModel();
			var Justif = this.getView().byId("IdJustif").getValue();
			var oEntry = {};
			oEntry.Vencedor = "X";
			oEntry.Justif = Justif;
			var oEntry2 = {};
			oEntry2.Status = "MAPA";
			var Bukrs = "2001";
			var Werks = this.getView().byId("IdWerkso").getValue();
			var IdSolicitacao = this.getView().byId("Idsolicitacao").getValue();
			var Key2 = "/ZET_CBMM_CF_FRETESet(Bukrs='" + Bukrs + "',WerksO='" + Werks + "',IdSolicitacao=" + IdSolicitacao + ")";
			if (length === 0) {
				sap.m.MessageBox.error("Selecione os vencedores");
				return;
			}

			if (oEntry.Justif === "") {
				sap.m.MessageBox.error("Justificativa não informada.");
				return;
			}
			var dialog = new Dialog({
				title: 'Confirmação',
				type: 'Message',
				content: new Text({
					text: "Confirma seleção de vencedores?"
				}),
				beginButton: new Button({
					text: "Confirma",
					press: function () {
						//Função para Excluir registros
						for (var i = 0; i < length; i++) {
							var Indice = SelectedIndices[i];
							var Key = table.getContextByIndex(Indice).sPath;
							oModel.update(Key, oEntry, {
								error: function (oError) {
									sap.m.MessageBox.error("Vencedor não selecionado");
									return;
								}
							});
						}
						oModel.update(Key2, oEntry2, {
							error: function (oError) {
								sap.m.MessageBox.error("Erro ao chamar o serviço");
								return;
							}
						});
						dialog.close();
					}
				}),
				endButton: new Button({
					text: 'Cancelar',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
					sap.m.MessageBox.success("Vencedores selecionados com sucesso.", {
						actions: ["OK", sap.m.MessageBox.Action.CLOSE],
						onClose: function (sAction) {
							that.getRouter().navTo("masterRefresh");
							dialog.close();
						}
					});
				}
			});
			dialog.open();
		},

		onVoltar: function () {
			var that = this;
			var oModel = this.getView("Master").getModel();
			var Bukrs = "2001";
			var WerksO = this.getView("Master").byId("IdWerkso").getValue();
			var IdSolicitacao = this.getView("Master").byId("Idsolicitacao").getValue();

			var Key = "/ZET_CBMM_CF_FRETESet(Bukrs='" + Bukrs + "',WerksO='" + WerksO + "',IdSolicitacao=" + IdSolicitacao + ")";
			var oEntry = {};
			oEntry.Status = "GCOT";

			var dialog = "";
			dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: "Deseja estornar o Status?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(Key, oEntry, {
							success: function (oData, oResponse) {
								sap.m.MessageBox.success("Status estornado com sucesso!", {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function (sAction) {
										that.getRouter().navTo("masterRefresh");
									}
								});
							},
							error: function (oError) {
								sap.m.MessageBox.error("Erro ao chamar o serviço");
							}
						});
						dialog.close();
					}
				}),
				endButton: new Button({
					text: "Não",
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.open();

		},

		onEdit: function () {
			var smartTable = this.getView().byId("smartTable");
			smartTable.setEditable(true);

			this.getView().byId("B_CVencedores").setVisible(false);
			this.getView().byId("B_Edit").setVisible(false);
			this.getView().byId("B_Salvar").setVisible(false);
			this.getView().byId("B_Cancelar").setVisible(true);
			this.getView().byId("B_Upload").setVisible(false);
			this.getView().byId("fileUploader").setVisible(true);
		},

		onCancelar: function () {
			var smartTable = this.getView().byId("smartTable");
			smartTable.setEditable(false);

			this.getView().byId("B_CVencedores").setVisible(true);
			this.getView().byId("B_Edit").setVisible(true);
			this.getView().byId("B_Salvar").setVisible(false);
			this.getView().byId("B_Cancelar").setVisible(false);
			this.getView().byId("B_Upload").setVisible(false);
			this.getView().byId("fileUploader").setVisible(false);
		},

		onSalvar: function () {
			var _oComponent = this.getOwnerComponent();
			var oList = _oComponent.oListSelector._oList;
			var oListBinding = oList.getBinding("items");
			var smartTable = this.getView().byId("smartTable");
			var table = smartTable.getTable();
			var length = table.getSelectedIndices().length;
			var SelectedIndices = table.getSelectedIndices();
			var oModel = this.getView().getModel();
			var Volume = "";
			var PrazoPag = "";
			var FretePedag = "";
			var Tco;
			var TcoOrc;
			var HabQuali = "";
			var AproTec = "";
			var B_Editar = this.getView().byId("B_Edit");
			var B_Salvar = this.getView().byId("B_Salvar");
			var B_Cancelar = this.getView().byId("B_Cancelar");
			var B_Confirma = this.getView().byId("B_CVencedores");
			var Key = "";

			if (length === 0) {
				sap.m.MessageBox.error("Nenhuma linha selecionada para alteração.");
				return;
			}

			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: "Confirma alteração das linhas selecionadas?"
				}),
				beginButton: new Button({
					text: "Confirma",
					press: function () {
						//Função para Excluir registros
						for (var i = 0; i < length; i++) {
							var Indice = SelectedIndices[i];
							var oEntry = {};
							oEntry.Vencedor = "Z";

							Volume = "";
							Volume = table.getRows()[Indice].getCells()[4].getValue();
							Volume = Volume.replace(".", "");
							if (Volume !== "") {
								oEntry.Volume = parseInt(Volume);
							}

							PrazoPag = "";
							PrazoPag = table.getRows()[Indice].getCells()[7].getValue();
							if (PrazoPag !== "") {
								oEntry.PrazoPag = PrazoPag;
							}

							FretePedag = "";
							FretePedag = table.getRows()[Indice].getCells()[10].getValue();
							if (FretePedag !== "") {

								while (FretePedag.indexOf(",") != -1) {
									FretePedag = FretePedag.replace(",", ".");
								}

								oEntry.FretePedag = parseFloat(FretePedag);
								oEntry.FretePedag = oEntry.FretePedag.toFixed(2);
							}

							Tco = 0;
							Tco = table.getRows()[Indice].getCells()[15].getValue();
							if (Tco !== "") {

								while (Tco.indexOf(".") != -1) {
									Tco = Tco.replace(".", "");
								}

								while (Tco.indexOf(",") != -1) {
									Tco = Tco.replace(",", ".");
								}

								oEntry.Tco = parseFloat(Tco);
								oEntry.Tco = oEntry.Tco.toFixed(2);
							}

							TcoOrc = 0;
							TcoOrc = table.getRows()[Indice].getCells()[16].getValue();
							if (TcoOrc !== "") {

								while (TcoOrc.indexOf(".") != -1) {
									TcoOrc = TcoOrc.replace(".", "");
								}

								while (TcoOrc.indexOf(",") != -1) {
									TcoOrc = TcoOrc.replace(",", ".");
								}

								oEntry.TcoOrc = parseFloat(TcoOrc);
								oEntry.TcoOrc = oEntry.TcoOrc.toFixed(2);
							}

							HabQuali = "";
							HabQuali = table.getRows()[Indice].getCells()[18].getValue();
							if (HabQuali !== "") {
								oEntry.HabQuali = HabQuali;
							}

							AproTec = "";
							AproTec = table.getRows()[Indice].getCells()[17].getValue();
							if (AproTec !== "") {
								oEntry.AproTec = AproTec;
							}

							Key = "";
							Key = table.getContextByIndex(Indice).sPath;

							oModel.update(Key, oEntry, {
								error: function (oError) {
									sap.m.MessageBox.error("Alteração não realizada");
									return;
								}
							});

						}
						dialog.close();
					}
				}),
				endButton: new Button({
					text: "Cancelar",
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
					smartTable.setEditable(false);
					B_Editar.setVisible(true);
					B_Salvar.setVisible(false);
					B_Cancelar.setVisible(false);
					B_Confirma.setVisible(true);
					smartTable.rebindTable("e");
				}
			});
			dialog.open();
		},

		AfterUpdate: function (oEvent) {
			this.getView().byId("table").setVisibleRowCount(this.getView().byId("table").getBinding("rows").getLength());
		},

		onUpload: function (oEvent) {

			var oModel = this.getView().getModel();

			var sError = "";
			var sBukrs = "2001";
			var sWerkso = this.getView().byId("IdWerkso").getValue();
			var sIdSolicitacao = this.getView().byId("Idsolicitacao").getValue();

			var allTextLines = this.reader.result.split(/\r\n|\n/);

			for (var i = 1; i < allTextLines.length; i++) {

				var data = allTextLines[i].split(';');
				var tarr = [];

				for (var j = 0; j < data.length; j++) {
					tarr.push(data[j]);
				}

				var sIdrota = tarr[19];
				if (sIdrota === undefined) {
					continue;
				}

				var sNrtransp = tarr[20];
				var sQtdEscala = tarr[21];
				var sTpveiculo = tarr[2];
				while (sTpveiculo.indexOf(" ") != -1) {
					sTpveiculo = sTpveiculo.replace(" ", "%20");
				}

				var sKschl = tarr[0];
				var Key = "/ZET_CBMM_CF_VEICONDSet(Bukrs='" + sBukrs + "',Idrota=" + sIdrota + ",Idsolicitacao=" + sIdSolicitacao + ",Kschl='" +
					sKschl + "',Nrtransp='" + sNrtransp + "',QtdEscala='" + sQtdEscala + "',Tpveiculo='" + sTpveiculo + "',Werkso='" + sWerkso +
					"')";

				var oEntry = {};
				oEntry.Vencedor = "Z";

				var sVolume = tarr[4];
				sVolume = sVolume.replace(".", "");
				if (sVolume !== "") {
					oEntry.Volume = parseInt(sVolume);
				}

				var sPrazoPag = tarr[7];
				if (sPrazoPag !== "") {
					oEntry.PrazoPag = sPrazoPag;
				}

				var sFretePedag = tarr[10];
				if (sFretePedag !== "") {

					while (sFretePedag.indexOf(",") != -1) {
						sFretePedag = sFretePedag.replace(",", ".");
					}

					oEntry.FretePedag = parseFloat(sFretePedag);
					oEntry.FretePedag = oEntry.FretePedag.toFixed(2);
				}

				var sOrcamento = tarr[11];
				if (sOrcamento !== "") {

					while (sOrcamento.indexOf(".") != -1) {
						sOrcamento = sOrcamento.replace(".", "");
					}

					while (sOrcamento.indexOf(",") != -1) {
						sOrcamento = sOrcamento.replace(",", ".");
					}

					oEntry.Orcamento = parseFloat(sOrcamento);
					oEntry.Orcamento = oEntry.Orcamento.toFixed(2);
				}

				var sTco = tarr[15];
				if (sTco !== "") {

					while (sTco.indexOf(".") != -1) {
						sTco = sTco.replace(".", "");
					}

					while (sTco.indexOf(",") != -1) {
						sTco = sTco.replace(",", ".");
					}

					oEntry.Tco = parseFloat(sTco);
					oEntry.Tco = oEntry.Tco.toFixed(2);
				}

				var sTcoOrc = tarr[16];
				if (sTcoOrc !== "") {

					while (sTcoOrc.indexOf(".") != -1) {
						sTcoOrc = sTcoOrc.replace(".", "");
					}

					while (sTcoOrc.indexOf(",") != -1) {
						sTcoOrc = sTcoOrc.replace(",", ".");
					}

					oEntry.TcoOrc = parseFloat(sTcoOrc);
					oEntry.TcoOrc = oEntry.TcoOrc.toFixed(2);
				}

				var sAproTec = tarr[17];
				if (sAproTec !== "") {
					oEntry.AproTec = sAproTec;
				}

				var sHabQuali = tarr[18];
				if (sHabQuali !== "") {
					oEntry.HabQuali = sHabQuali;
				}

				oModel.update(Key, oEntry, {
					error: function (oError) {
						sError = "E";
						return;
					}
				});

			}

			if (sError === "E") {
				sap.m.MessageBox.error("upload não realizado");
			} else {
				sap.m.MessageBox.success("Upload realizado com Sucesso");

				this.getView().byId("fileUploader").setVisible(true);
				this.getView().byId("fileUploader").clear();
				this.getView().byId("B_Upload").setVisible(false);
			}

		},

		handleUploadStart: function (oEvent) {

			var fU = this.getView().byId("fileUploader");
			fU.attachEvent("importaTabela", function () {

			}, this);

		},

		handleUploadComplete: function (oEvent) {

			var t = this;
			var fU2 = this.getView().byId("fileUploader");
			var domRef = fU2.getFocusDomRef();
			var oFileToRead = domRef.files[0];

			this.reader = new FileReader();
			this.reader.readAsText(oFileToRead);

			fU2.fireEvent("importaTabela");
			this.getView().byId("B_Upload").setVisible(true);

		}

	});

});