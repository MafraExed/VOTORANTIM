sap.ui.define([
	"ZCBMM_APRVCOTA/ZCBMM_APRVCOTA/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/Button",
	"sap/m/MessageBox",
	"sap/m/Dialog",
	"sap/m/MessageToast",
	"sap/ui/core/mvc/Controller",
	"ZCBMM_APRVCOTA/ZCBMM_APRVCOTA/model/formatter",
	"sap/m/Text"
], function(BaseController, JSONModel, Button, MessageBox, Dialog, MessageToast, Controller, formatter, Text) {
	"use strict";

	return BaseController.extend("ZCBMM_APRVCOTA.ZCBMM_APRVCOTA.controller.Mapa", {

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
			var Bukrs = oEvent.getParameter("arguments").Bukrs;
			var WerksO = oEvent.getParameter("arguments").WerksO;
			var IdSolicitacao = oEvent.getParameter("arguments").IdSolicitacao;
			var IdRota = oEvent.getParameter("arguments").IdRota;
			var NrTransp = oEvent.getParameter("arguments").NrTransp;
			var TpVeiculo = oEvent.getParameter("arguments").TpVeiculo;

			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("ZET_CBMM_CF_VEICULOSet", {
					Bukrs: Bukrs,
					WerksO: WerksO,
					IdSolicitacao: IdSolicitacao,
					IdRota: IdRota,
					NrTransp: NrTransp,
					TpVeiculo: TpVeiculo
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
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
				this._valueHelpDialog2 = sap.ui.xmlfragment("ZCBMM_APRVCOTA.ZCBMM_APRVCOTA.view.Zterm", this);
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

			// var sValue = oEvent.getParameter("value");
			// var oFilter = new sap.ui.model.Filter("Aprovador",
			//  sap.ui.model.FilterOperator.Contains, sValue);
			// oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		OnSave: function() {
			var oModel = this.getView().getModel();
			var _oComponent = this.getOwnerComponent();
			var oList = _oComponent.oListSelector._oList;
			var oListBinding = oList.getBinding("items");
			var IdSolicitacao = this.getView().byId("IdSolicitacao").getValue();
			var IdRota = this.getView().byId("IdRota").getValue();
			var Volume = this.getView().byId("IdVolume").getValue();
			// var VlrTotDc = this.getView().byId("IdVlrTotDc").getValue();
			// var FreteNegoc = this.getView().byId("IdFreteNegoc").getValue();
			// var FretePedag = this.getView().byId("IdFretePedag").getValue();
			var OrcBaseline = this.getView().byId("IdOrcBaseline").getValue();
			// var VarPrecos = this.getView().byId("IdVarPrecos").getValue();
			var Saving = this.getView().byId("IdSaving").getValue();
			// var Orcamento = this.getView().byId("IdOrcamento").getValue();
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
			// oKeys.Empresa = this.getView().byId("IdEmpresa").getValue();
			// oKeys.Alcada = this.getView().byId("IdAlcada").getValue();
			oKeys.Vigencia = this.getView().byId("IdVigencia").getValue();
			oKeys.Negociacao = this.getView().byId("IdNegociacao").getValue();
			oKeys.Volume = this.getView().byId("IdVolume").getValue();
			oKeys.DataBase = this.getView().byId("IDDataBase").getValue();
			oKeys.AtPreco = this.getView().byId("IdAtPreco").getValue();
			oKeys.PrazoPag = this.getView().byId("IdPrazoPag").getValue();
			oKeys.Incoterm = this.getView().byId("IdIncoterm").getValue();
			// oKeys.Cadastro = this.getView().byId("IdCadastro").getValue();
			// oKeys.CamRede = this.getView().byId("IdCamRede").getValue();
			oKeys.Performance = this.getView().byId("IdPerformance").getValue();
			oKeys.Performance = this.getView().byId("IdObjeto").getValue();
			
			if (textApro === "Sim") {
				oKeys.AproTec = 'X';
			}
			if (textApro === "Não") {
				oKeys.AproTec = '-';
			}

			// if (textHab === "Sim") {
			// 	oKeys.HabQuali = 'X';
			// }
			// if (textHab === "Não") {
			// 	oKeys.HabQuali = '-';
			// }

			// oKeys.textHab = (textApro);
			// oKeys.textHab = (textHab);
			// oKeys.AproTec = this.getView().byId("IdAproTec").getValue();
			// oKeys.HabQuali = this.getView().byId("IdHabQuali").getValue();

			oKeys.IdRota = parseInt(IdRota);
			oKeys.IdSolicitacao = parseInt(IdSolicitacao);
			oKeys.Volume = parseInt(Volume);
			// oKeys.VlrTotDc = parseInt(VlrTotDc);
			// oKeys.FreteNegoc = parseInt(FreteNegoc);
			// oKeys.FretePedag = parseInt(FretePedag);
			oKeys.OrcBaseline = parseInt(OrcBaseline);
			// oKeys.VarPrecos = parseInt(VarPrecos);
			oKeys.Saving = parseInt(Saving);
			// oKeys.Orcamento = parseInt(Orcamento);
			oKeys.Tco = parseInt(Tco);
			oKeys.VlrNegoc = parseInt(VlrNegoc);
			oKeys.VlrProp = parseInt(VlrProp);
			oKeys.Pedagio = parseInt(Pedagio);

			// oKeys.textApro = parseInt(textApro);
			// oKeys.textHab = parseInt(textHab);
			while(oKeys.TpVeiculo.indexOf(" ") != -1)
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
		}
	});

});