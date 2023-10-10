/*global location history */
sap.ui.define([
	"ZCBMM_RELATORIO/ZCBMM_RELATORIO/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"ZCBMM_RELATORIO/ZCBMM_RELATORIO/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator" 
], function (BaseController, JSONModel, History, formatter, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("ZCBMM_RELATORIO.ZCBMM_RELATORIO.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated. 
		 * @public
		 */
		onInit: function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true, 
					delay: 0
				});
			this.getRouter().getRoute("worklist").attachPatternMatched(this._onObjectMatched, this);
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "worklistView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});

			//var sName = sap.ushell.Container.getUser().getFullName();
			//this.getView().byId("IdUser").setValue(sName);

		},

		_onObjectMatched: function () {
			// TODO
			// var date = new Date(), y = date.getFullYear(), m = date.getMonth();
			// var firstDay = new Date(y, m, 1);
			// var lastDay = new Date(y, m + 1, 0);
			// this.byId("IdDtIni").setValue(firstDay);
			// this.byId("IdDtFim").setValue(lastDay);

		},

		Iniciar: function () {
			var oModel = new sap.ui.model.json.JSONModel();
			var DtInic = this.getView().byId("IdDtIni").getValue();
			var DtFim = this.getView().byId("IdDtFim").getValue();
			//var sName = this.getView().byId("IdUser").getValue();

			var sService = "/sap/opu/odata/sap/ZGWCBMM_RELATORIO_SRV/ZET_CBMM_CF_RELATORIOSet(DtInic=datetime'" + DtInic +
				"T00:00:00',DtFim=datetime'" + DtFim + "T23:59:59')";
			oModel.loadData(sService, null, false, "GET", false, false, null);

			if (oModel.oData.d === undefined) {
				sap.m.MessageBox.error("Não foi possivel buscar informações");
				return;
			}

			var Saving = oModel.oData.d.Saving;

			// ALTERADO POR MAFRA
			var l_saving;
			if (Saving > 0) {
				this.getView().byId("IdSaving").setValueColor("Good");
				this.getView().byId("IdSaving").setIndicator("Up");
			} else {
				this.getView().byId("IdSaving").setValueColor("Error");
				this.getView().byId("IdSaving").setIndicator("Down");
			}
			Saving = Saving.toLocaleString('pt-BR');
			l_saving = Saving.length;
			this.getView().byId("IdSaving").setTruncateValueTo(l_saving);
			// ALTERADO POR MAFRA

			var SlaFPrazo = oModel.oData.d.SlaFPrazo;
			var SlaFAtrazo = oModel.oData.d.SlaFAtraso;
			var SlaAPrazo = oModel.oData.d.SlaAPrazo;
			var SlaAAtrazo = oModel.oData.d.SlaAAtraso;
			var PerfPositivas = oModel.oData.d.PerfPositivas;
			var PerfNegativas = oModel.oData.d.PerfNegativas;

			if (SlaFPrazo + SlaFAtrazo + SlaAPrazo + SlaAAtrazo === 0) {
				PerfPositivas = 0;
				PerfNegativas = 0;
			}

			var ModMro = oModel.oData.d.CarteiraMro;
			var ModInsumo = oModel.oData.d.CarteiraInsumo;
			var ModPa = oModel.oData.d.CarteiraPa;
			var ModServico = oModel.oData.d.CarteiraServico;
			var TpSolSpot = oModel.oData.d.ModSpot;
			var TpSolContratos = oModel.oData.d.ModContratos;
			var TpSolTabela = oModel.oData.d.ModTabela;
			var TpSolPc = oModel.oData.d.ModSolPc;
			var MSolicAberto = oModel.oData.d.SolicAberto;
			var MSolicAtraso = oModel.oData.d.SolicAtraso;
			var MSolicConc = oModel.oData.d.SolicConc;

			this.getView().byId("IdSlaAPrazo").setValue(SlaAPrazo);
			this.getView().byId("IdSlaAAtrazo").setValue(SlaAAtrazo);
			this.getView().byId("IdSlaFAtrazo").setValue(SlaFAtrazo);
			this.getView().byId("IdSlaFPrazo").setValue(SlaFPrazo);
			this.getView().byId("IdSaving").setValue(Saving);
			this.getView().byId("IdPerfPositivas").setPercentage(PerfNegativas);
			this.getView().byId("IdPerfNegativas").setPercentage(PerfPositivas);

			this.getView().byId("IdModMro").setValue(ModMro);
			this.getView().byId("TextMRO").setText("MRO (" + ModMro + ")");
			this.getView().byId("IdModInsumo").setValue(ModInsumo);
			this.getView().byId("TextInsumos").setText("Insumos (" + ModInsumo + ")");
			this.getView().byId("IdModPa").setValue(ModPa);
			this.getView().byId("TextPA").setText("Produto Acabado (" + ModPa + ")");
			this.getView().byId("IdModServico").setValue(ModServico);
			this.getView().byId("TextServico").setText("ModServico (" + ModServico + ")");

			this.getView().byId("IdTpSolSpot").setValue(TpSolSpot);
			this.getView().byId("TextSpot").setText("Spot (" + TpSolSpot + ")");
			this.getView().byId("IdTpSolContratos").setValue(TpSolContratos);
			this.getView().byId("TextContratos").setText("Contratos (" + TpSolContratos + ")");
			this.getView().byId("IdTpSolTabela").setValue(TpSolTabela);
			this.getView().byId("TextManut").setText("Manutenção de Tabela (" + TpSolTabela + ")");
			this.getView().byId("IdTpPc").setValue(TpSolPc);
			this.getView().byId("TextPC").setText("Pedido de Compras (" + TpSolPc + ")");

			this.getView().byId("IdMSolicAberto").setValue(MSolicAberto);
			this.getView().byId("TextAberto").setText("Em Aberto (" + MSolicAberto + ")");
			this.getView().byId("IdMSolicAtraso").setValue(MSolicAtraso);
			this.getView().byId("TextAtraso").setText("Em Atraso (" + MSolicAtraso + ")");
			this.getView().byId("IdMSolicConc").setValue(MSolicConc);
			this.getView().byId("TextConc").setText("Concluidas (" + MSolicConc + ")");

			sap.m.MessageBox.success("Calculos executados");
			return; 

			// Fim - Alterado por Mafra
		},

		press: function (evt) {
			var DtInic = this.getView().byId("IdDtIni").getValue();
			var DtFim = this.getView().byId("IdDtFim").getValue();

			if (DtInic !== "" || DtFim !== "") {

				this.getRouter().navTo(evt.getSource().getId().replace(this.getView().getId() + "--", ""), {
					DtInic: DtInic,
					DtFim: DtFim
				});
			} else {
				sap.m.MessageBox.error("Informe data de inicio e data fim");
				return;
			}
		}
	});
});