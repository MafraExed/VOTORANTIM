sap.ui.define([
	"ZCBMM_SOLICITACAO_FRETE/ZCBMM_SOLICITACAO_FRETE/controller/BaseController",
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/m/Text',
	"sap/ui/model/json/JSONModel"
], function (BaseController,
	Dialog,
	Button,
	Text,
	JSONModel) {
	"use strict";

	return BaseController.extend("ZCBMM_SOLICITACAO_FRETE.ZCBMM_SOLICITACAO_FRETE.controller.Add_Rota", {

		onInit: function () {
			this.getRouter().getRoute("Add_Rota").attachPatternMatched(this._onObjectMatched, this);
			this.getRouter().getRoute("Add_Rota_Copy").attachPatternMatched(this._onObjectMatched_Copy, this);

			this.getView().byId("IdWerksoDescr").setValueState("Error");
		},

		_onObjectMatched_Copy: function (oEvent) {

			//this.getView().byId("iconTabBar").setSelectKey("0");
			// inicio - Gravar informações do cabeçalho
			var Werks = oEvent.getParameter("arguments").Werks;
			var IdSolicitacao = oEvent.getParameter("arguments").IdSolicitacao;
			var Carteira = oEvent.getParameter("arguments").Carteira;
			var Modalidade = oEvent.getParameter("arguments").Modalidade;
			var Prioridade = oEvent.getParameter("arguments").Prioridade;
			var Finalidade = oEvent.getParameter("arguments").Finalidade;
			var GrpCompras = oEvent.getParameter("arguments").GrpCompras;
			var DtInic = oEvent.getParameter("arguments").DtInic;
			var Kostl = oEvent.getParameter("arguments").Kostl;
			var IdRotaCopy = oEvent.getParameter("arguments").IdRota;

			this.getView().byId("IdWerks").setValue(Werks);
			this.getView().byId("IdIdSolicitacao").setValue(IdSolicitacao);
			this.getView().byId("IdCarteira").setValue(Carteira);
			this.getView().byId("IdModalidade").setValue(Modalidade);
			this.getView().byId("IdPrioridade").setValue(Prioridade);
			this.getView().byId("IdFinalidade").setValue(Finalidade);
			this.getView().byId("IdGrpCompras").setValue(GrpCompras);
			this.getView().byId("IdDtInic").setValue(DtInic);
			this.getView().byId("IdWerksO").setValue(Werks);
			this.getView().byId("IdKostl").setValue(Kostl);

			// Fim - Gravar informações do cabeçalho

			// Inicio - Buscar a gravar informação do id da rota
			var oModel = new sap.ui.model.json.JSONModel();
			var oInd = {};
			var newIdSolicitacao = 0;
			var BuscaIdCota = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_ROTASet(Bukrs='2001',WerksO='" + Werks +
				"',IdSolicitacao=" + IdSolicitacao + ",IdRota=0)";

			oModel.loadData(BuscaIdCota, null, false, "GET", false, false, null);
			oInd = oModel.oData.d.IdRota;
			newIdSolicitacao = oInd + 1;
			this.getView().byId("IdIdRota").setValue(newIdSolicitacao);
			// Fim - Buscar a gravar informação do id da rota

			// Inicio - Validar carteira e deixar campos visiveis.
			if (Carteira === "SERVIÇO") {
				this.getView().byId("TabFilterOrigem").setVisible(true);
				this.getView().byId("TabFilterDestino").setVisible(false);
				this.getView().byId("TabFilterMaterial").setVisible(false);
				this.getView().byId("TabFilterOutros").setVisible(false);
				this.getView().byId("TabFilterEscopo").setVisible(true);
			}
			if (Carteira === "INSUMO" || Carteira === "RESIDUO" || Carteira === "BAUXITA") {
				this.getView().byId("TabFilterOrigem").setVisible(true);
				this.getView().byId("TabFilterDestino").setVisible(true);
				this.getView().byId("TabFilterMaterial").setVisible(true);
				this.getView().byId("TabFilterOutros").setVisible(true);
				this.getView().byId("TabFilterEscopo").setVisible(true);
			}
			if (Carteira === "MRO") {
				this.getView().byId("TabFilterOrigem").setVisible(true);
				this.getView().byId("TabFilterDestino").setVisible(true);
				this.getView().byId("TabFilterMaterial").setVisible(true);
				this.getView().byId("TabFilterOutros").setVisible(true);
				this.getView().byId("TabFilterEscopo").setVisible(true);
			}
			if (Carteira === "PRODUTO ACABADO") {
				this.getView().byId("TabFilterOrigem").setVisible(true);
				this.getView().byId("TabFilterDestino").setVisible(true);
				this.getView().byId("TabFilterMaterial").setVisible(true);
				this.getView().byId("TabFilterOutros").setVisible(true);
				this.getView().byId("TabFilterEscopo").setVisible(true);
			}
			// Fim - Validar carteira e deixar campos visiveis.

			// Inicio - Filtro nos uploads de arquivo
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue(),
				IdRota = this.getView().byId("IdIdRota").getValue(),
				filter = IdSolicitacao + ";" + IdRota,
				oFilter = new sap.ui.model.Filter("WerksO", sap.ui.model.FilterOperator.EQ, filter),
				oList = this.getView().byId("UploadCollection");

			// Executa filtro
			oList.getBinding("items").filter([oFilter]);
			// fim executa filtro

			// Fim - Filtro nos uploads de arquivo

			// Inicio - Limpar tela ao ingressar. 

			var oModel_Copy = new sap.ui.model.json.JSONModel();
			var oInd_Copy = {};
			var BuscaIdCopy = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_ROTASet(Bukrs='2001',WerksO='" + Werks +
				"',IdSolicitacao=" + IdSolicitacao + ",IdRota=" + IdRotaCopy + ")";

			oModel_Copy.loadData(BuscaIdCopy, null, false, "GET", false, false, null);

			this.getView().byId("IdWerksO").setValue(oModel_Copy.oData.d.WerksO);
			this.getView().byId("IdWerksoDescr").setValue(oModel_Copy.oData.d.WerksoDescr);
			this.getView().byId("IdAdrnrO").setValue(oModel_Copy.oData.d.AdrnrO);
			this.getView().byId("IdCnpjO").setValue(oModel_Copy.oData.d.CnpjO);
			this.getView().byId("IdUfO").setValue(oModel_Copy.oData.d.UfO);
			this.getView().byId("IdMunicO").setValue(oModel_Copy.oData.d.MunicO);
			this.getView().byId("IdZone1O").setValue(oModel_Copy.oData.d.Zone1O);
			this.getView().byId("IdZone1D").setValue(oModel_Copy.oData.d.Zone1D);
			this.getView().byId("IdContatoO").setValue(oModel_Copy.oData.d.ContatoO);
			this.getView().byId("IdEmailO").setValue(oModel_Copy.oData.d.EmailO);
			this.getView().byId("IdWerksD").setValue(oModel_Copy.oData.d.WerksD);
			this.getView().byId("IdWerksdDescr").setValue(oModel_Copy.oData.d.WerksdDescr);
			this.getView().byId("IdAdrnrD").setValue(oModel_Copy.oData.d.AdrnrD);
			this.getView().byId("IdCnpjD").setValue(oModel_Copy.oData.d.CnpjD);
			this.getView().byId("IdUfD").setValue(oModel_Copy.oData.d.UfD);
			this.getView().byId("IdMunicD").setValue(oModel_Copy.oData.d.MunicD);
			this.getView().byId("IdContatoD").setValue(oModel_Copy.oData.d.ContatoD);
			this.getView().byId("IdEmailD").setValue(oModel_Copy.oData.d.EmailD);
			this.getView().byId("IdTelefoneD").setValue(oModel_Copy.oData.d.TelefoneD);
			this.getView().byId("IdDescMaterial").setValue(oModel_Copy.oData.d.DescMaterial);
			this.getView().byId("IdMengeUnit").setValue(oModel_Copy.oData.d.MengeUnit);
			this.getView().byId("IdPerigoso").setValue(oModel_Copy.oData.d.Perigoso);
			this.getView().byId("IdCodOnu").setValue(oModel_Copy.oData.d.CodOnu);
			this.getView().byId("IdPesoUnit").setValue();
			this.getView().byId("IdVlrTon").setValue();
			this.getView().byId("IdTpEmbalagem").setValue(oModel_Copy.oData.d.TpEmbalagem);
			this.getView().byId("IdAlturaEmb").setValue(oModel_Copy.oData.d.AlturaEmb);
			this.getView().byId("IdLarguraEmb").setValue(oModel_Copy.oData.d.LarguraEmb);
			this.getView().byId("IdComprEmb").setValue(oModel_Copy.oData.d.ComprEmb);
			this.getView().byId("IdVolumEmb").setValue(oModel_Copy.oData.d.VolumEmb);
			this.getView().byId("IdTpCarreg").setValue(oModel_Copy.oData.d.TpCarreg);
			this.getView().byId("IdTpVeiculo").setValue(oModel_Copy.oData.d.TpVeiculo);
			this.getView().byId("IdHrCargaInic").setValue(oModel_Copy.oData.d.HrCargaInic);
			this.getView().byId("IdHrCargaFim").setValue(oModel_Copy.oData.d.HrCargaFim);
			this.getView().byId("IdHrDescInic").setValue(oModel_Copy.oData.d.HrDescInic);
			this.getView().byId("IdHrDescFim").setValue(oModel_Copy.oData.d.HrDescFim);
			this.getView().byId("IdComprReboq").setValue(oModel_Copy.oData.d.ComprReboq);
			this.getView().byId("IdRotCarreg").setValue(oModel_Copy.oData.d.RotCarreg);
			this.getView().byId("IdRotCarreg").setValue(oModel_Copy.oData.d.RotCarreg);
			this.getView().byId("IdRoute").setValue(oModel_Copy.oData.d.Route);
			this.getView().byId("IdTelefoneO").setValue(oModel_Copy.oData.d.TelefoneO);
			this.getView().byId("MessageIt").setVisible(false);

			// Fim - Limpar tela ao ingressar. 
			this.getView().byId("IdDtInicTransp").setValue(DtInic);
			this.getView().byId("IdWerksoDescr").setEditable(true);
			this.getView().byId("IdAdrnrO").setEditable(true);
			this.getView().byId("IdCnpjO").setEditable(true);
			this.getView().byId("IdUfO").setEditable(true);
			this.getView().byId("IdMunicO").setEditable(true);
			this.getView().byId("IdWerksdDescr").setEditable(true);
			this.getView().byId("IdAdrnrD").setEditable(true);
			this.getView().byId("IdCnpjD").setEditable(true);
			this.getView().byId("IdUfD").setEditable(true);
			this.getView().byId("IdMunicD").setEditable(true);

			this.getView().byId("IdWerksoDescr").setValueState("None");
		},

		_onObjectMatched: function (oEvent) {
			// inicio - Gravar informações do cabeçalho
			var Werks = oEvent.getParameter("arguments").Werks;
			var IdSolicitacao = oEvent.getParameter("arguments").IdSolicitacao;
			var Carteira = oEvent.getParameter("arguments").Carteira;
			var Modalidade = oEvent.getParameter("arguments").Modalidade;
			var Prioridade = oEvent.getParameter("arguments").Prioridade;
			var Finalidade = oEvent.getParameter("arguments").Finalidade;
			var GrpCompras = oEvent.getParameter("arguments").GrpCompras;
			var DtInic = oEvent.getParameter("arguments").DtInic;
			var Kostl = oEvent.getParameter("arguments").Kostl;

			this.getView().byId("IdWerks").setValue(Werks);
			this.getView().byId("IdIdSolicitacao").setValue(IdSolicitacao);
			this.getView().byId("IdCarteira").setValue(Carteira);
			this.getView().byId("IdModalidade").setValue(Modalidade);
			this.getView().byId("IdPrioridade").setValue(Prioridade);
			this.getView().byId("IdFinalidade").setValue(Finalidade);
			this.getView().byId("IdGrpCompras").setValue(GrpCompras);
			this.getView().byId("IdDtInic").setValue(DtInic);
			this.getView().byId("IdWerksO").setValue(Werks);
			this.getView().byId("IdKostl").setValue(Kostl);
			// Fim - Gravar informações do cabeçalho

			// Inicio - Buscar a gravar informação do id da rota
			var oModel = new sap.ui.model.json.JSONModel();
			var oInd = {};
			var newIdSolicitacao = 0;
			var BuscaIdCota = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_ROTASet(Bukrs='2001',WerksO='" + Werks +
				"',IdSolicitacao=" + IdSolicitacao + ",IdRota=0)";

			oModel.loadData(BuscaIdCota, null, false, "GET", false, false, null);
			oInd = oModel.oData.d.IdRota;
			newIdSolicitacao = oInd + 1;
			this.getView().byId("IdIdRota").setValue(newIdSolicitacao);
			// Fim - Buscar a gravar informação do id da rota

			// Inicio - Validar carteira e deixar campos visiveis.
			if (Carteira === "SERVIÇO") {
				this.getView().byId("TabFilterOrigem").setVisible(true);
				this.getView().byId("TabFilterDestino").setVisible(false);
				this.getView().byId("TabFilterMaterial").setVisible(false);
				this.getView().byId("TabFilterOutros").setVisible(false);
				this.getView().byId("TabFilterEscopo").setVisible(true);
			}
			if (Carteira === "INSUMO" || Carteira === "RESIDUO" || Carteira === "BAUXITA") {
				this.getView().byId("TabFilterOrigem").setVisible(true);
				this.getView().byId("TabFilterDestino").setVisible(true);
				this.getView().byId("TabFilterMaterial").setVisible(true);
				this.getView().byId("TabFilterOutros").setVisible(true);
				this.getView().byId("TabFilterEscopo").setVisible(true);
			}
			if (Carteira === "MRO") {
				this.getView().byId("TabFilterOrigem").setVisible(true);
				this.getView().byId("TabFilterDestino").setVisible(true);
				this.getView().byId("TabFilterMaterial").setVisible(true);
				this.getView().byId("TabFilterOutros").setVisible(true);
				this.getView().byId("TabFilterEscopo").setVisible(true);
			}
			if (Carteira === "PRODUTO ACABADO") {
				this.getView().byId("TabFilterOrigem").setVisible(true);
				this.getView().byId("TabFilterDestino").setVisible(true);
				this.getView().byId("TabFilterMaterial").setVisible(true);
				this.getView().byId("TabFilterOutros").setVisible(true);
				this.getView().byId("TabFilterEscopo").setVisible(true);
			}
			// Fim - Validar carteira e deixar campos visiveis.

			// Inicio - Filtro nos uploads de arquivo
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue(),
				IdRota = this.getView().byId("IdIdRota").getValue(),
				filter = IdSolicitacao + ";" + IdRota,
				oFilter = new sap.ui.model.Filter("WerksO", sap.ui.model.FilterOperator.EQ, filter),
				oList = this.getView().byId("UploadCollection");

			// Executa filtro
			oList.getBinding("items").filter([oFilter]);
			// fim executa filtro

			// Fim - Filtro nos uploads de arquivo

			// Inicio - Limpar tela ao ingressar. 
			this.getView().byId("IdWerksO").setValue();
			this.getView().byId("IdWerksoDescr").setValue();
			this.getView().byId("IdAdrnrO").setValue();
			this.getView().byId("IdCnpjO").setValue();
			this.getView().byId("IdUfO").setValue();
			this.getView().byId("IdMunicO").setValue();
			this.getView().byId("IdZone1O").setValue();
			this.getView().byId("IdZone1D").setValue();
			this.getView().byId("IdContatoO").setValue();
			this.getView().byId("IdEmailO").setValue();
			this.getView().byId("IdWerksD").setValue();
			this.getView().byId("IdWerksdDescr").setValue();
			this.getView().byId("IdAdrnrD").setValue();
			this.getView().byId("IdCnpjD").setValue();
			this.getView().byId("IdUfD").setValue();
			this.getView().byId("IdMunicD").setValue();
			this.getView().byId("IdContatoD").setValue();
			this.getView().byId("IdEmailD").setValue();
			this.getView().byId("IdTelefoneD").setValue();
			this.getView().byId("IdDescMaterial").setValue();
			this.getView().byId("IdMengeUnit").setValue();
			this.getView().byId("IdPerigoso").setValue();
			this.getView().byId("IdCodOnu").setValue();
			this.getView().byId("IdPesoUnit").setValue();
			this.getView().byId("IdVlrTon").setValue();
			this.getView().byId("IdTpEmbalagem").setValue();
			this.getView().byId("IdAlturaEmb").setValue();
			this.getView().byId("IdLarguraEmb").setValue();
			this.getView().byId("IdComprEmb").setValue();
			this.getView().byId("IdVolumEmb").setValue();
			this.getView().byId("IdTpCarreg").setValue();
			this.getView().byId("IdTpVeiculo").setValue();
			this.getView().byId("IdHrCargaInic").setValue();
			this.getView().byId("IdHrCargaFim").setValue();
			this.getView().byId("IdHrDescInic").setValue();
			this.getView().byId("IdHrDescFim").setValue();
			this.getView().byId("IdComprReboq").setValue();
			this.getView().byId("IdRotCarreg").setValue();
			this.getView().byId("IdRotCarreg").setValue();
			this.getView().byId("IdRoute").setValue();
			this.getView().byId("IdTelefoneO").setValue();
			this.getView().byId("MessageIt").setVisible(false);

			// Fim - Limpar tela ao ingressar. 
			this.getView().byId("IdDtInicTransp").setValue(DtInic);
			this.getView().byId("IdWerksoDescr").setEditable(true);
			this.getView().byId("IdAdrnrO").setEditable(true);
			this.getView().byId("IdCnpjO").setEditable(true);
			this.getView().byId("IdUfO").setEditable(true);
			this.getView().byId("IdMunicO").setEditable(true);
			this.getView().byId("IdWerksdDescr").setEditable(true);
			this.getView().byId("IdAdrnrD").setEditable(true);
			this.getView().byId("IdCnpjD").setEditable(true);
			this.getView().byId("IdUfD").setEditable(true);
			this.getView().byId("IdMunicD").setEditable(true);
		},

		onBack: function () {
			// Voltar os campos a padrão - Inicio
			this.getView().byId("IdZone1O").setValueState("None");
			this.getView().byId("IdZone1D").setValueState("None");
			this.getView().byId("IdWerksO").setValueState("None");
			this.getView().byId("IdWerksoDescr").setValueState("None");
			this.getView().byId("IdAdrnrO").setValueState("None");
			this.getView().byId("IdCnpjO").setValueState("None");
			this.getView().byId("IdUfO").setValueState("None");
			this.getView().byId("IdMunicO").setValueState("None");
			this.getView().byId("IdContatoO").setValueState("None");
			this.getView().byId("IdEmailO").setValueState("None");
			this.getView().byId("IdTelefoneO").setValueState("None");
			this.getView().byId("IdWerksD").setValueState("None");
			this.getView().byId("IdWerksdDescr").setValueState("None");
			this.getView().byId("IdAdrnrD").setValueState("None");
			this.getView().byId("IdCnpjD").setValueState("None");
			this.getView().byId("IdUfD").setValueState("None");
			this.getView().byId("IdMunicD").setValueState("None");
			this.getView().byId("IdContatoD").setValueState("None");
			this.getView().byId("IdEmailD").setValueState("None");
			this.getView().byId("IdTelefoneD").setValueState("None");
			this.getView().byId("IdDescMaterial").setValueState("None");
			this.getView().byId("IdTpEmbalagem").setValueState("None");
			this.getView().byId("IdMengeUnit").setValueState("None");
			this.getView().byId("IdPerigoso").setValueState("None");
			this.getView().byId("IdCodOnu").setValueState("None");
			this.getView().byId("IdTpCarreg").setValueState("None");
			this.getView().byId("IdTpVeiculo").setValueState("None");
			this.getView().byId("IdPesoUnit").setValueState("None");
			this.getView().byId("IdVlrTon").setValueState("None");
			this.getView().byId("IdAlturaEmb").setValueState("None");
			this.getView().byId("IdLarguraEmb").setValueState("None");
			this.getView().byId("IdComprEmb").setValueState("None");
			this.getView().byId("IdVolumEmb").setValueState("None");
			this.getView().byId("IdHrCargaInic").setValueState("None");
			this.getView().byId("IdHrCargaFim").setValueState("None");
			this.getView().byId("IdHrDescInic").setValueState("None");
			this.getView().byId("IdHrDescFim").setValueState("None");
			this.getView().byId("IdDtInicTransp").setValueState("None");
			this.getView().byId("IdDtFimTransp").setValueState("None");
			this.getView().byId("IdComprReboq").setValueState("None");
			this.getView().byId("IdRotCarreg").setValueState("None");

			this.getView().byId("TabFilterZona").setIconColor();
			this.getView().byId("TabFilterOrigem").setIconColor();
			this.getView().byId("TabFilterDestino").setIconColor();
			this.getView().byId("TabFilterMaterial").setIconColor();
			this.getView().byId("TabFilterOutros").setIconColor();
			this.getView().byId("TabFilterEscopo").setIconColor();
			// Voltar os campos a padrão - Fim

			var Bukrs = "2001";
			var WerksO = this.getView().byId("IdWerks").getValue();
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();
			var Carteira = this.getView().byId("IdCarteira").getValue();
			var Modalidade = this.getView().byId("IdModalidade").getValue();
			var Prioridade = this.getView().byId("IdPrioridade").getValue();
			var Finalidade = this.getView().byId("IdFinalidade").getValue();
			var GrpCompras = this.getView().byId("IdGrpCompras").getValue();
			var DtInic = this.getView().byId("IdDtInic").getValue();
			var Kostl = this.getView().byId("IdKostl").getValue();

			this.getRouter().navTo("BackAddSol", {
				Bukrs: Bukrs,
				WerksO: WerksO,
				IdSolicitacao: IdSolicitacao,
				Carteira: Carteira,
				Modalidade: Modalidade,
				Prioridade: Prioridade,
				Finalidade: Finalidade,
				GrpCompras: GrpCompras,
				DtInic: DtInic,
				Kostl: Kostl
			});
		},

		onHelpZone1: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog1) {
				this._valueHelpDialog1 = sap.ui.xmlfragment("ZCBMM_SOLICITACAO_FRETE.ZCBMM_SOLICITACAO_FRETE.view.Zone1", this);
				this.getView().addDependent(this._valueHelpDialog1);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog1.open(sInputValue);
		},

		onHelpPerigoso: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog2) {
				this._valueHelpDialog2 = sap.ui.xmlfragment("ZCBMM_SOLICITACAO_FRETE.ZCBMM_SOLICITACAO_FRETE.view.Perigoso", this);
				this.getView().addDependent(this._valueHelpDialog2);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog2.open(sInputValue);
		},

		onHelpTpEmbalagem: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog3) {
				this._valueHelpDialog3 = sap.ui.xmlfragment("ZCBMM_SOLICITACAO_FRETE.ZCBMM_SOLICITACAO_FRETE.view.TpEmbalagem", this);
				this.getView().addDependent(this._valueHelpDialog3);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog3.open(sInputValue);
		},

		onHelpTpVeiculo: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog4) {
				this._valueHelpDialog4 = sap.ui.xmlfragment("ZCBMM_SOLICITACAO_FRETE.ZCBMM_SOLICITACAO_FRETE.view.TpVeiculo", this);
				this.getView().addDependent(this._valueHelpDialog4);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog4.open(sInputValue);
		},

		onHelpWerks: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog5) {
				this._valueHelpDialog5 = sap.ui.xmlfragment("ZCBMM_SOLICITACAO_FRETE.ZCBMM_SOLICITACAO_FRETE.view.Werks", this);
				this.getView().addDependent(this._valueHelpDialog5);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog5.open(sInputValue);
		},

		onHelpMaterial: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog6) {
				this._valueHelpDialog6 = sap.ui.xmlfragment("ZCBMM_SOLICITACAO_FRETE.ZCBMM_SOLICITACAO_FRETE.view.Material", this);
				this.getView().addDependent(this._valueHelpDialog6);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog6.open(sInputValue);
		},

		onHelpTpCarreg: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog7) {
				this._valueHelpDialog7 = sap.ui.xmlfragment("ZCBMM_SOLICITACAO_FRETE.ZCBMM_SOLICITACAO_FRETE.view.Carregamento", this);
				this.getView().addDependent(this._valueHelpDialog7);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog7.open(sInputValue);
		},

		_handleValueHelpClose: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");

			this._valueHelpDialog1 = null;
			this._valueHelpDialog2 = null;
			this._valueHelpDialog3 = null;
			this._valueHelpDialog4 = null;
			this._valueHelpDialog5 = null;
			this._valueHelpDialog6 = null;
			this._valueHelpDialog7 = null;

			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);
			//this.getView().byId(this.inputId).setValueState("None");
		},

		_Confirme_Zone1: function (evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			this._valueHelpDialog1 = null;

			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());

				var Zone1 = oSelectedItem.getTitle();
				var oInd = {};
				var oModel1 = new sap.ui.model.json.JSONModel();

				var sServiceCount = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_ZONE1Set/$count?$filter=Vtext eq '" + Zone1 +
					"'";

				oModel1.loadData(sServiceCount, null, false, "GET", false, false, null);
				oInd = oModel1.oData;

				if (oInd === 0) {
					this.getpView().byId(productInput).setValueState("Error");
					sap.m.MessageBox.error("A Zona de tranpsorte informada não existe.");
					return;
				} else {
					this.getView().byId(this.inputId).setValueState("None");
				}
			}

			this.onValidaZona();

		},

		_Confirme_Material: function (evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			this._valueHelpDialog5 = null;

			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
			}

			this.onChangeIdDescMaterial();

			this.getView().byId(productInput).setValueState("None");
		},

		_Confirme_Carregamento: function (evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			this._valueHelpDialog5 = null;

			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
			}

			this.onChangeTpCarregamento();

			this.getView().byId(productInput).setValueState("None");
		},

		_Confirme_TpVeiculo: function (evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			this._valueHelpDialog5 = null;

			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
			}

			this.onChangeTpVeiculo();

			this.getView().byId(productInput).setValueState("None");
		},

		_Confirme_TpEmbalagem: function (evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			this._valueHelpDialog5 = null;

			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
			}

			this.onChangeTpEmbalagem();

			this.getView().byId(productInput).setValueState("None");
		},

		_Confirme_Perigoso: function (evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			this._valueHelpDialog5 = null;

			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
			}

			this.onChangePerigoso();

			this.getView().byId(productInput).setValueState("None");
		},

		_Confirme_werks: function (evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			this._valueHelpDialog5 = null;

			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
			}

			this.onChangeWerksD();
			this.onChangeWerks();

			this.getView().byId(productInput).setValueState("None");
		},

		_onModelContextChangePerigoso: function (oEvent) {
			var Parametro = "PERIGOSO";

			var sFilter = Parametro;
			var oFilter = oFilter = new sap.ui.model.Filter("Parametro", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		_onModelContextChangeTpEmbalagem: function (oEvent) {
			var Parametro = "TIPOS DE EMBALAGEM";

			var sFilter = Parametro;
			var oFilter = oFilter = new sap.ui.model.Filter("Parametro", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		_onModelContextChangeTpVeiculo: function (oEvent) {
			var Parametro = "TIPOS DE VEICULO";

			var sFilter = Parametro;
			var oFilter = oFilter = new sap.ui.model.Filter("Parametro", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		_onModelContextChangeMaterial: function (oEvent) {
			var Parametro = "PRODUTO";

			var sFilter = Parametro;
			var oFilter = oFilter = new sap.ui.model.Filter("Parametro", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		_onModelContextChangeTpCarreg: function (oEvent) {
			var Parametro = "TIPOS DE CARREGAMENTO";

			var sFilter = Parametro;
			var oFilter = oFilter = new sap.ui.model.Filter("Parametro", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		onChangeWerks: function () {
			var oModel20 = new sap.ui.model.json.JSONModel();
			var oModel30 = new sap.ui.model.json.JSONModel();
			var oInd = {};
			var Bukrs = "2001";
			var Werks = this.getView().byId("IdWerksO").getValue();
			var cnpj = "";

			if (Werks === "") {
				this.getView().byId("IdWerksO").setValueState("None");

				this.getView().byId("IdWerksoDescr").setEditable(true);
				this.getView().byId("IdWerksoDescr").setValue("");

				this.getView().byId("IdAdrnrO").setEditable(true);
				this.getView().byId("IdAdrnrO").setValue("");

				this.getView().byId("IdCnpjO").setEditable(true);
				this.getView().byId("IdCnpjO").setValue("");

				this.getView().byId("IdUfO").setEditable(true);
				this.getView().byId("IdUfO").setValue("");

				this.getView().byId("IdMunicO").setEditable(true);
				this.getView().byId("IdMunicO").setValue("");
			} else {

				var sServiceCount = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_WERKSSet/$count?$filter=Werks eq '" + Werks +
					"'";

				oModel30.loadData(sServiceCount, null, false, "GET", false, false, null);
				oInd = oModel30.oData;

				if (oInd === 0) {
					this.getView().byId("IdWerksoDescr").setEditable(true);
					this.getView().byId("IdWerksoDescr").setValue("");

					this.getView().byId("IdAdrnrO").setEditable(true);
					this.getView().byId("IdAdrnrO").setValue("");

					this.getView().byId("IdCnpjO").setEditable(true);
					this.getView().byId("IdCnpjO").setValue("");

					this.getView().byId("IdUfO").setEditable(true);
					this.getView().byId("IdUfO").setValue("");

					this.getView().byId("IdMunicO").setEditable(true);
					this.getView().byId("IdMunicO").setValue("");

					this.getView().byId("IdWerksO").setValueState("Error");
					sap.m.MessageBox.error("O centro informado não existe, verifique a informação.");
					return;
				} else {

					var sService = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_WERKSSet(Bukrs='" + Bukrs + "',Werks='" + Werks +
						"')";

					oModel20.loadData(sService, null, false, "GET", false, false, null);

					this.getView().byId("IdWerksO").setValueState("None");
					this.getView().byId("IdWerksoDescr").setEditable(false);
					this.getView().byId("IdAdrnrO").setEditable(false);
					this.getView().byId("IdCnpjO").setEditable(false);
					this.getView().byId("IdMunicO").setEditable(false);
					this.getView().byId("IdUfO").setEditable(false);

					var WerksoDescr = oModel20.oData.d.Name1;
					var AdrnrO = oModel20.oData.d.Endereco;
					var CnpjO = oModel20.oData.d.Cnpj;
					var UfO = oModel20.oData.d.Uf;
					var MunicO = oModel20.oData.d.Munic;

					this.getView().byId("IdWerksoDescr").setValue(WerksoDescr);
					this.getView().byId("IdAdrnrO").setValue(AdrnrO);
					this.getView().byId("IdCnpjO").setValue(cnpj);
					this.getView().byId("IdMunicO").setValue(MunicO);
					this.getView().byId("IdUfO").setValue(UfO);
					this.getView().byId("IdUfO").setValue(UfO);
					this.getView().byId("IdCnpjO").setValue(CnpjO);
				}
			}
		},

		onChangeWerksD: function () {
			var oModel20 = new sap.ui.model.json.JSONModel();
			var oModel30 = new sap.ui.model.json.JSONModel();
			var oInd = {};
			var Bukrs = "2001";
			var WerksD = this.getView().byId("IdWerksD").getValue();
			var cnpj = "";

			if (WerksD === "") {
				this.getView().byId("IdWerksD").setValueState("None");

				this.getView().byId("IdWerksdDescr").setEditable(true);
				this.getView().byId("IdWerksdDescr").setValue("");

				this.getView().byId("IdAdrnrD").setEditable(true);
				this.getView().byId("IdAdrnrD").setValue("");

				this.getView().byId("IdCnpjD").setEditable(true);
				this.getView().byId("IdCnpjD").setValue("");

				this.getView().byId("IdUfD").setEditable(true);
				this.getView().byId("IdUfD").setValue("");

				this.getView().byId("IdMunicD").setEditable(true);
				this.getView().byId("IdMunicD").setValue("");
			} else {

				var sServiceCount = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_WERKSSet/$count?$filter=Werks eq '" + WerksD +
					"'";

				oModel30.loadData(sServiceCount, null, false, "GET", false, false, null);
				oInd = oModel30.oData;

				if (oInd === 0) {
					this.getView().byId("IdWerksdDescr").setEditable(true);
					this.getView().byId("IdWerksdDescr").setValue("");

					this.getView().byId("IdAdrnrD").setEditable(true);
					this.getView().byId("IdAdrnrD").setValue("");

					this.getView().byId("IdCnpjD").setEditable(true);
					this.getView().byId("IdCnpjD").setValue("");

					this.getView().byId("IdUfD").setEditable(true);
					this.getView().byId("IdUfD").setValue("");

					this.getView().byId("IdMunicD").setEditable(true);
					this.getView().byId("IdMunicD").setValue("");

					this.getView().byId("IdWerksD").setValueState("Error");
					sap.m.MessageBox.error("O centro informado não existe, verifique a informação.");
					return;
				} else {

					var sService = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_WERKSSet(Bukrs='" + Bukrs + "',Werks='" + WerksD +
						"')";

					oModel20.loadData(sService, null, false, "GET", false, false, null);

					this.getView().byId("IdWerksD").setValueState("None");
					this.getView().byId("IdWerksdDescr").setEditable(false);
					this.getView().byId("IdAdrnrD").setEditable(false);
					this.getView().byId("IdCnpjD").setEditable(false);
					this.getView().byId("IdMunicD").setEditable(false);
					this.getView().byId("IdUfD").setEditable(false);

					var WerksoDescr = oModel20.oData.d.Name1;
					var AdrnrD = oModel20.oData.d.Endereco;
					var CnpjD = oModel20.oData.d.Cnpj;
					var UfD = oModel20.oData.d.Uf;
					var MunicD = oModel20.oData.d.Munic;

					this.getView().byId("IdWerksdDescr").setValue(WerksoDescr);
					this.getView().byId("IdAdrnrD").setValue(AdrnrD);
					this.getView().byId("IdCnpjD").setValue(cnpj);
					this.getView().byId("IdMunicD").setValue(MunicD);
					this.getView().byId("IdUfD").setValue(UfD);
					this.getView().byId("IdCnpjD").setValue(CnpjD);
				}
			}
		},

		_handleValueHelpZone1: function (oEvent) {
			var sValue = oEvent.getParameter("value");

			var oFilter = new sap.ui.model.Filter("Vtext",
				sap.ui.model.FilterOperator.Contains, sValue);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpWerks: function (oEvent) {
			var sValue = oEvent.getParameter("value");

			var oFilter = new sap.ui.model.Filter("Werks",
				sap.ui.model.FilterOperator.Contains, sValue);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		onSave: function () {
			var oModel = this.getView().getModel();
			var This = this;
			var Bukrs = "2001";
			var WerksO = This.getView().byId("IdWerksO").getValue();
			if (WerksO === "") {
				WerksO = "0";
			}
			var IdSolicitacao = This.getView().byId("IdIdSolicitacao").getValue();
			var IdRota = This.getView().byId("IdIdRota").getValue();
			var Carteira = This.getView().byId("IdCarteira").getValue();
			var Key = "/ZET_CBMM_CF_ROTASet(Bukrs='" + Bukrs + "',WerksO='" + WerksO + "',IdSolicitacao=" + IdSolicitacao + ",IdRota=" +
				IdRota + ")";
			var oEntry = {};

			// Transporte - Inicio
			oEntry.Zone1O = This.getView().byId("IdZone1O").getValue();
			oEntry.Zone1D = This.getView().byId("IdZone1D").getValue();
			oEntry.Route = This.getView().byId("IdRoute").getValue();
			// Transporte - FIM

			//Origem - Inicio
			oEntry.WerksO = WerksO;
			oEntry.WerksoDescr = This.getView().byId("IdWerksoDescr").getValue();
			oEntry.AdrnrO = This.getView().byId("IdAdrnrO").getValue();
			oEntry.CnpjO = This.getView().byId("IdCnpjO").getValue();
			oEntry.CnpjO = oEntry.CnpjO.substring(0, 2) + oEntry.CnpjO.substring(4, 6) + oEntry.CnpjO.substring(8, 11) + oEntry.CnpjO.substring(
				12, 16) + oEntry.CnpjO.substring(17, 19);
			oEntry.UfO = This.getView().byId("IdUfO").getValue();
			oEntry.MunicO = This.getView().byId("IdMunicO").getValue();
			oEntry.ContatoO = This.getView().byId("IdContatoO").getValue();
			oEntry.EmailO = This.getView().byId("IdEmailO").getValue();
			oEntry.TelefoneO = This.getView().byId("IdTelefoneO").getValue();
			//Origem - Fim

			//Destino - Inicio
			oEntry.WerksD = This.getView().byId("IdWerksD").getValue();
			oEntry.WerksdDescr = This.getView().byId("IdWerksdDescr").getValue();
			oEntry.AdrnrD = This.getView().byId("IdAdrnrD").getValue();
			oEntry.CnpjD = This.getView().byId("IdCnpjD").getValue();
			oEntry.CnpjD = oEntry.CnpjD.substring(0, 2) + oEntry.CnpjD.substring(4, 6) + oEntry.CnpjD.substring(8, 11) + oEntry.CnpjD.substring(
				12, 16) + oEntry.CnpjD.substring(17, 19);
			oEntry.UfD = This.getView().byId("IdUfD").getValue();
			oEntry.MunicD = This.getView().byId("IdMunicD").getValue();
			oEntry.ContatoD = This.getView().byId("IdContatoD").getValue();
			oEntry.EmailD = This.getView().byId("IdEmailD").getValue();
			oEntry.TelefoneD = This.getView().byId("IdTelefoneD").getValue();
			//Destino - Fim

			// Material - Inicio
			oEntry.DescMaterial = This.getView().byId("IdDescMaterial").getValue();
			oEntry.MengeUnit = This.getView().byId("IdMengeUnit").getValue();
			if (oEntry.MengeUnit === "") {
				oEntry.MengeUnit = 0;
			} else {
				while (oEntry.MengeUnit.indexOf(".") != -1) {
					oEntry.MengeUnit = oEntry.MengeUnit.replace(".", "");
				}

				while (oEntry.MengeUnit.indexOf(",") != -1) {
					oEntry.MengeUnit = oEntry.MengeUnit.replace(",", "");
				}
			}
			//oEntry.MengeUnit = oEntry.MengeUnit.replace(".","");
			oEntry.MengeUnit = parseFloat(oEntry.MengeUnit);

			oEntry.Perigoso = This.getView().byId("IdPerigoso").getValue();

			oEntry.CodOnu = This.getView().byId("IdCodOnu").getValue();
			if (oEntry.CodOnu === "") {
				oEntry.CodOnu = 0;
			}
			oEntry.CodOnu = parseInt(oEntry.CodOnu); // Convertendo para Numerico

			oEntry.PesoUnit = This.getView().byId("IdPesoUnit").getValue();
			if (oEntry.PesoUnit === "") {
				oEntry.PesoUnit = 0;
			}
			if (oEntry.PesoUnit !== 0) {
				oEntry.PesoUnit = oEntry.PesoUnit.replace(".", "");
				oEntry.PesoUnit = oEntry.PesoUnit.replace(",", ".");
			}
			oEntry.VlrTon = This.getView().byId("IdVlrTon").getValue();
			if (oEntry.VlrTon === "") {
				oEntry.VlrTon = 0;
			}
			if (oEntry.VlrTon !== 0) {
				while (oEntry.VlrTon.indexOf(".") != -1) {
					oEntry.VlrTon = oEntry.VlrTon.replace(".", "");
				}
				oEntry.VlrTon = oEntry.VlrTon.replace(",", ".");
				oEntry.VlrTon = parseFloat(oEntry.VlrTon).toFixed(3); // Convertendo para Numerico
			}

			//Outros - Inicio
			oEntry.TpEmbalagem = This.getView().byId("IdTpEmbalagem").getValue();
			oEntry.AlturaEmb = This.getView().byId("IdAlturaEmb").getValue();
			if (oEntry.AlturaEmb === "") {
				oEntry.AlturaEmb = 0;
			}
			oEntry.AlturaEmb = parseInt(oEntry.AlturaEmb); // Convertendo para Numerico
			oEntry.LarguraEmb = This.getView().byId("IdLarguraEmb").getValue();
			if (oEntry.LarguraEmb === "") {
				oEntry.LarguraEmb = 0;
			}
			oEntry.LarguraEmb = parseInt(oEntry.LarguraEmb); // Convertendo para Numerico
			oEntry.ComprEmb = This.getView().byId("IdComprEmb").getValue();
			if (oEntry.ComprEmb === "") {
				oEntry.ComprEmb = 0;
			}
			oEntry.ComprEmb = parseInt(oEntry.ComprEmb);
			oEntry.VolumEmb = This.getView().byId("IdVolumEmb").getValue();
			if (oEntry.VolumEmb === "") {
				oEntry.VolumEmb = 0;
			}
			oEntry.VolumEmb = parseInt(oEntry.VolumEmb);
			oEntry.TpCarreg = This.getView().byId("IdTpCarreg").getValue();
			oEntry.TpVeiculo = This.getView().byId("IdTpVeiculo").getValue();
			oEntry.HrCargaInic = This.getView().byId("IdHrCargaInic").getValue();
			oEntry.HrCargaFim = This.getView().byId("IdHrCargaFim").getValue();
			oEntry.HrDescInic = This.getView().byId("IdHrDescInic").getValue();
			oEntry.HrDescFim = This.getView().byId("IdHrDescFim").getValue();
			oEntry.ComprReboq = This.getView().byId("IdComprReboq").getValue();
			if (oEntry.ComprReboq === "") {
				oEntry.ComprReboq = 0;
			}
			oEntry.ComprReboq = parseInt(oEntry.ComprReboq);
			oEntry.RotCarreg = This.getView().byId("IdRotCarreg").getValue();
			//Outros - Fim

			// Transporte - Inicio
			oEntry.DtInicTransp = This.getView().byId("IdDtInicTransp").getValue();
			oEntry.DtFimTransp = This.getView().byId("IdDtFimTransp").getValue();
			// Transporte - Fim

			// Validaçãode Campos a partir de Carteiras

			// Inicio - Trasnporte
			if (oEntry.Zone1O === "") {
				This.getView().byId("IdZone1O").setValueState("Error");
				sap.m.MessageBox.error("Zona de Transporte Origem não informada!");
				This.getView().byId("TabFilterZona").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("0");
				return;
			} else {
				This.getView().byId("TabFilterZona").setIconColor();
			}

			if (oEntry.Zone1D === "") {
				This.getView().byId("IdZone1D").setValueState("Error");
				sap.m.MessageBox.error("Zona de Transporte Destino não informada!");
				This.getView().byId("TabFilterZona").setIconColor("Negative");
				This.getView().byId("TabFilterZona").setSelectedKey("0");
				return;
			} else {
				This.getView().byId("TabFilterDestino").setIconColor();
			}

			// Fim - Trasnporte

			// Inicio - Origem
			if (oEntry.WerksO === "" || oEntry.WerksO === "0") {
				if (oEntry.WerksoDescr === "") {
					sap.m.MessageBox.error("Deverá ser informado ou o centro de Origem ou a descrição de origem.");
					This.getView().byId("IdWerksoDescr").setValueState("Error");
					This.getView().byId("IdWerksO").setValueState("Error");
					This.getView().byId("TabFilterOrigem").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("1");
					return;
				} else {
					This.getView().byId("TabFilterOrigem").setIconColor();
				}
			}

			if (oEntry.AdrnrO === "") {
				sap.m.MessageBox.error("Endereço não informado.");
				This.getView().byId("IdAdrnrO").setValueState("Error");
				This.getView().byId("TabFilterOrigem").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("1");
				return;
			} else {
				This.getView().byId("TabFilterOrigem").setIconColor();
			}

			if (oEntry.CnpjO === "") {
				sap.m.MessageBox.error("CNPJ não informado.");
				This.getView().byId("IdCnpjO").setValueState("Error");
				This.getView().byId("TabFilterOrigem").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("1");
				return;
			} else {
				This.getView().byId("TabFilterOrigem").setIconColor();
			}

			if (oEntry.UfO === "") {
				sap.m.MessageBox.error("Estado não informado.");
				This.getView().byId("IdUfO").setValueState("Error");
				This.getView().byId("TabFilterOrigem").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("1");
				return;
			} else {
				This.getView().byId("TabFilterOrigem").setIconColor();
			}

			if (oEntry.MunicO === "") {
				sap.m.MessageBox.error("Municipio não informado.");
				This.getView().byId("IdMunicO").setValueState("Error");
				This.getView().byId("TabFilterOrigem").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("1");
				return;
			} else {
				This.getView().byId("TabFilterOrigem").setIconColor();
			}

			if (oEntry.ContatoO === "") {
				This.getView().byId("IdContatoO").setValueState("Error");
				sap.m.MessageBox.error("Contato Origem não informado!");
				This.getView().byId("TabFilterOrigem").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("1");
				return;
			} else {
				This.getView().byId("TabFilterOrigem").setIconColor();
			}

			if (oEntry.EmailO === "") {
				This.getView().byId("IdEmailO").setValueState("Error");
				sap.m.MessageBox.error("Email Origem não informado!");
				This.getView().byId("TabFilterOrigem").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("1");
				return;
			} else {
				This.getView().byId("TabFilterOrigem").setIconColor();
			}

			if (oEntry.TelefoneO === "") {
				This.getView().byId("IdTelefoneO").setValueState("Error");
				sap.m.MessageBox.error("Telefone Origem não informado!");
				This.getView().byId("TabFilterOrigem").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("1");
				return;
			} else {
				This.getView().byId("TabFilterOrigem").setIconColor();
			}
			// Fim - Origem

			// Inicio - Destino

			if (oEntry.WerksD === "") {
				if (oEntry.WerksdDescr === "") {
					This.getView().byId("IdWerksdDescr").setValueState("Error");
					This.getView().byId("IdWerksD").setValueState("Error");
					sap.m.MessageBox.error("Deverá ser informado o centro ou a descrição Destino");
					This.getView().byId("TabFilterDestino").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("2");
					return;
				} else {
					This.getView().byId("TabFilterDestino").setIconColor();
				}
			}

			if (oEntry.AdrnrD === "") {
				This.getView().byId("IdAdrnrD").setValueState("Error");
				sap.m.MessageBox.error("Endereço do Destino não informado!");
				This.getView().byId("TabFilterDestino").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("2");
				return;
			} else {
				This.getView().byId("TabFilterDestino").setIconColor();
			}

			if (oEntry.CnpjD === "") {
				This.getView().byId("IdCnpjD").setValueState("Error");
				sap.m.MessageBox.error("Cnpj do Destino não informado!");
				This.getView().byId("TabFilterDestino").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("2");
				return;
			} else {
				This.getView().byId("TabFilterDestino").setIconColor();
			}

			if (oEntry.UfD === "") {
				This.getView().byId("IdUfD").setValueState("Error");
				sap.m.MessageBox.error("Estado do Destino não informado!");
				This.getView().byId("TabFilterDestino").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("2");
				return;
			} else {
				This.getView().byId("TabFilterDestino").setIconColor();
			}

			if (oEntry.UfD === "") {
				This.getView().byId("IdUfD").setValueState("Error");
				sap.m.MessageBox.error("Estado do Destino não informado!");
				This.getView().byId("TabFilterDestino").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("2");
				return;
			} else {
				This.getView().byId("TabFilterDestino").setIconColor();
			}

			if (oEntry.MunicD === "") {
				This.getView().byId("IdMunicD").setValueState("Error");
				sap.m.MessageBox.error("Municipio do Destino não informado!");
				This.getView().byId("TabFilterDestino").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("2");
				return;
			} else {
				This.getView().byId("TabFilterDestino").setIconColor();
			}

			if (oEntry.ContatoD === "") {
				This.getView().byId("IdContatoD").setValueState("Error");
				sap.m.MessageBox.error("Contato do Destino não informado!");
				This.getView().byId("TabFilterDestino").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("2");
				return;
			} else {
				This.getView().byId("TabFilterDestino").setIconColor();
			}

			if (oEntry.EmailD === "") {
				This.getView().byId("IdEmailD").setValueState("Error");
				sap.m.MessageBox.error("Email do Destino não informado!");
				This.getView().byId("TabFilterDestino").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("2");
				return;
			} else {
				This.getView().byId("TabFilterDestino").setIconColor();
			}

			if (oEntry.TelefoneD === "") {
				This.getView().byId("IdTelefoneD").setValueState("Error");
				sap.m.MessageBox.error("Telefone do Destino não informado!");
				This.getView().byId("TabFilterDestino").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("2");
				return;
			} else {
				This.getView().byId("TabFilterDestino").setIconColor();
			}

			// Fim - Destino

			// Inicio - Material
			if (oEntry.DescMaterial === "") {
				This.getView().byId("IdDescMaterial").setValueState("Error");
				sap.m.MessageBox.error("Material não informado!");
				This.getView().byId("TabFilterMaterial").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("3");
				return;
			} else {
				This.getView().byId("TabFilterMaterial").setIconColor();
			}

			if (oEntry.TpEmbalagem === "") {
				This.getView().byId("IdTpEmbalagem").setValueState("Error");
				sap.m.MessageBox.error("Tipo de Embalagem não informada!");
				This.getView().byId("TabFilterMaterial").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("3");
				return;
			} else {
				This.getView().byId("TabFilterOutros").setIconColor();
			}

			if (oEntry.MengeUnit === 0) {
				This.getView().byId("IdMengeUnit").setValueState("Error");
				sap.m.MessageBox.error("Quanditade não informada!");
				This.getView().byId("TabFilterMaterial").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("3");
				return;
			} else {
				This.getView().byId("TabFilterMaterial").setIconColor();
			}

			if (oEntry.Perigoso === "") {
				This.getView().byId("IdPerigoso").setValueState("Error");
				sap.m.MessageBox.error("Classificação do material não informada!");
				This.getView().byId("TabFilterMaterial").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("3");
				return;
			} else {
				This.getView().byId("TabFilterMaterial").setIconColor();
			}

			if (oEntry.Perigoso === "SIM") {
				if (oEntry.CodOnu === 0) {
					This.getView().byId("IdCodOnu").setValueState("Error");
					sap.m.MessageBox.error("Codigo ONU não informada!");
					This.getView().byId("TabFilterMaterial").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("3");
					return;
				} else {
					This.getView().byId("TabFilterMaterial").setIconColor();
				}
			}

			if (oEntry.TpCarreg === "") {
				This.getView().byId("IdTpCarreg").setValueState("Error");
				sap.m.MessageBox.error("Tipo de Carregamento não informado!");
				This.getView().byId("TabFilterMaterial").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("3");
				return;
			} else {
				This.getView().byId("TabFilterMaterial").setIconColor();
			}

			if (oEntry.TpVeiculo === "") {
				This.getView().byId("IdTpVeiculo").setValueState("Error");
				sap.m.MessageBox.error("Tipo de Veiculo não informado!");
				This.getView().byId("TabFilterMaterial").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("3");
				return;
			} else {
				This.getView().byId("TabFilterMaterial").setIconColor();
			}

			if (oEntry.PesoUnit === 0) {
				This.getView().byId("IdPesoUnit").setValueState("Error");
				sap.m.MessageBox.error("Peso Unitario do material não informado!");
				This.getView().byId("TabFilterMaterial").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("3");
				return;
			} else {
				This.getView().byId("TabFilterMaterial").setIconColor();
			}

			if (oEntry.VlrTon === 0) {
				This.getView().byId("IdVlrTon").setValueState("Error");
				sap.m.MessageBox.error("Valor unitário  do material não informado!");
				This.getView().byId("TabFilterMaterial").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("3");
				return;
			} else {
				This.getView().byId("TabFilterMaterial").setIconColor();
			}

			// Fim - Material
			// Inicio - Outros

			if (oEntry.AlturaEmb === 0) {
				This.getView().byId("IdAlturaEmb").setValueState("Error");
				sap.m.MessageBox.error("Altura da Embalagem não informada!");
				This.getView().byId("TabFilterMaterial").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("3");
				return;
			} else {
				This.getView().byId("TabFilterMaterial").setIconColor();
			}

			if (oEntry.LarguraEmb === 0) {
				This.getView().byId("IdLarguraEmb").setValueState("Error");
				sap.m.MessageBox.error("Largura da Embalagem não informada!");
				This.getView().byId("TabFilterMaterial").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("3");
				return;
			} else {
				This.getView().byId("TabFilterMaterial").setIconColor();
			}

			if (oEntry.ComprEmb === 0) {
				This.getView().byId("IdComprEmb").setValueState("Error");
				sap.m.MessageBox.error("Comprimento da Embalagem não informado!");
				This.getView().byId("TabFilterMaterial").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("3");
				return;
			} else {
				This.getView().byId("TabFilterMaterial").setIconColor();
			}

			if (oEntry.VolumEmb === 0) {
				This.getView().byId("IdVolumEmb").setValueState("Error");
				sap.m.MessageBox.error("Volume da Embalagem não informado!");
				This.getView().byId("TabFilterMaterial").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("3");
				return;
			} else {
				This.getView().byId("TabFilterMaterial").setIconColor();
			}

			if (oEntry.HrCargaInic === "") {
				This.getView().byId("IdHrCargaInic").setValueState("Error");
				sap.m.MessageBox.error("Hora da Carga inicial não informada!");
				This.getView().byId("TabFilterOutros").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("4");
				return;
			} else {
				This.getView().byId("TabFilterOutros").setIconColor();
			}

			if (oEntry.HrCargaFim === "") {
				This.getView().byId("IdHrCargaFim").setValueState("Error");
				sap.m.MessageBox.error("Hora da Carga fim não informada!");
				This.getView().byId("TabFilterOutros").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("4");
				return;
			} else {
				This.getView().byId("TabFilterOutros").setIconColor();
			}

			if (oEntry.HrDescInic === "") {
				This.getView().byId("IdHrDescInic").setValueState("Error");
				sap.m.MessageBox.error("Hora da Descarga inicio não informada!");
				This.getView().byId("TabFilterOutros").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("4");
				return;
			} else {
				This.getView().byId("TabFilterOutros").setIconColor();
			}

			if (oEntry.HrDescFim === "") {
				This.getView().byId("IdHrDescFim").setValueState("Error");
				sap.m.MessageBox.error("Hora da Descarga fim não informada!");
				This.getView().byId("TabFilterOutros").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("4");
				return;
			} else {
				This.getView().byId("TabFilterOutros").setIconColor();
			}

			if (oEntry.DtFimTransp === "") {
				This.getView().byId("IdDtFimTransp").setValueState("Error");
				sap.m.MessageBox.error("Data de fim do transporte não informada.");
				This.getView().byId("TabFilterOutros").setIconColor("Negative");
				This.getView().byId("iconTabBar").setSelectedKey("4");
				return;
			} else {
				This.getView().byId("TabFilterOutros").setIconColor();
			}

			//Inicio - Verificar campos
			var vZone1O = This.getView().byId("IdZone1O").getValueState();
			var vZone1D = This.getView().byId("IdZone1D").getValueState();
			var vWerksD = This.getView().byId("IdWerksD").getValueState();
			var vDescMaterial = This.getView().byId("IdDescMaterial").getValueState();
			var vIdPerigoso = This.getView().byId("IdPerigoso").getValueState();
			var vTpEmbalagem = This.getView().byId("IdTpEmbalagem").getValueState();
			var vTpCarreg = This.getView().byId("IdTpCarreg").getValueState();
			var vTpVeiculo = This.getView().byId("IdTpVeiculo").getValueState();

			if (vZone1O === "Error" || vZone1D === "Error" || vWerksD === "Error" || vDescMaterial === "Error" || vIdPerigoso === "Error" ||
				vTpEmbalagem === "Error" || vTpCarreg === "Error" || vTpVeiculo === "Error"
			) {
				sap.m.MessageBox.error("Existem informações inválidas, a rota não será cadastrada!");
				return;
			}
			//Fim - Verificar campos
			// var oModel90 = new sap.ui.model.json.JSONModel();
			// var sServiceCount = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_UPLOADSet/$count?$filter=WerksO eq '" +
			// 	IdSolicitacao + ";" + IdRota + "'";
			// oModel90.loadData(sServiceCount, null, false, "GET", false, false, null);

			// var oInd2 = oModel90.oData;

			// if (oInd2 === 0) {
			// 	sap.m.MessageBox.error("Anexe informações para gravar");
			// 	return;
			// }

			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: "Confirma a criação da solicitação?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(Key, oEntry, {
							success: function (oData, oResponse) {
								sap.m.MessageBox.success("Solicitação criada com sucesso!", {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function (sAction) {
										var Modalidade = This.getView().byId("IdModalidade").getValue();
										var Prioridade = This.getView().byId("IdPrioridade").getValue();
										var Finalidade = This.getView().byId("IdFinalidade").getValue();
										var GrpCompras = This.getView().byId("IdGrpCompras").getValue();
										var DtInic = This.getView().byId("IdDtInic").getValue();
										var Werks = This.getView().byId("IdWerks").getValue();
										var Kostl = This.getView().byId("IdKostl").getValue();

										This.getRouter().navTo("BackAddSol", {
											Bukrs: Bukrs,
											WerksO: Werks,
											IdSolicitacao: IdSolicitacao,
											Carteira: Carteira,
											Modalidade: Modalidade,
											Prioridade: Prioridade,
											Finalidade: Finalidade,
											GrpCompras: GrpCompras,
											DtInic: DtInic,
											Kostl: Kostl
										});
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

		onChangeWerksdDescr: function () {
			var WerksdDescr = this.getView().byId("IdWerksdDescr").getValue();
			var WerksO = this.getView().byId("IdWerksD").getValue();

			if (WerksdDescr === "") {
				this.getView().byId("IdWerksdDescr").setValueState("Error");
				if (WerksO === "") {
					this.getView().byId("IdWerksD").setValueState("Error");
				}
			} else {
				this.getView().byId("IdWerksdDescr").setValueState("None");
				this.getView().byId("IdWerksD").setValueState("None");
			}
		},

		onChangeIdUfO: function () {
			var IdUfO = this.getView().byId("IdUfO").getValue();;

			if (IdUfO === "") {
				this.getView().byId("IdUfO").setValueState("Error");
				sap.m.MessageBox.error("Estado não preenchido.");
			}
		},

		onChangeIdMunicO: function () {
			var IdMunicO = this.getView().byId("IdMunicO").getValue();;

			if (IdMunicO === "") {
				this.getView().byId("IdMunicO").setValueState("Error");
				sap.m.MessageBox.error("Municipio não preenchido.");
			}
		},

		onChangeZone1O: function () {
			var Zone1O = this.getView().byId("IdZone1O").getValue();
			var oInd = {};
			var oModel1 = new sap.ui.model.json.JSONModel();

			var sServiceCount = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_ZONE1Set/$count?$filter=Vtext eq '" +
				Zone1O +
				"'";

			oModel1.loadData(sServiceCount, null, false, "GET", false, false, null);
			oInd = oModel1.oData;

			if (oInd === 0) {
				this.getView().byId("IdZone1O").setValueState("Error");
				sap.m.MessageBox.error("A Zona de tranpsorte informada não existe.");
				return;
			} else {
				this.getView().byId("IdZone1O").setValueState("None");
			}

			this.onValidaZona();

		},

		onValidaZona: function () {
			// Alimenta Campo itinerario
			var Zone1D = this.getView().byId("IdZone1D").getValue();
			var Zone1O = this.getView().byId("IdZone1O").getValue();

			if (Zone1D !== "" && Zone1O !== "") {

				// Verificar se tem espaços.
				while (Zone1D.indexOf(" ") != -1)
					Zone1D = Zone1D.replace(" ", "%20");

				while (Zone1O.indexOf(" ") != -1)
					Zone1O = Zone1O.replace(" ", "%20");
				// Verificar se tem espaços.

				var oModel2 = new sap.ui.model.json.JSONModel();

				var key = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_ROUTESet(Zone1='" + Zone1O + "',Zone2='" + Zone1D + "')";

				oModel2.loadData(key, null, false, "GET", false, false, null);
				var Route = oModel2.oData.d.Route;

				if (Route === "") {
					this.getView().byId("MessageIt").setVisible(true);
				} else {
					this.getView().byId("MessageIt").setVisible(false);
				}

				this.getView().byId("IdRoute").setValue(Route);

			}
			// Alimenta Campo itinerario
		},

		onChangeZone1D: function () {
			var Zone1D = this.getView().byId("IdZone1D").getValue();
			var oInd = {};
			var oModel1 = new sap.ui.model.json.JSONModel();

			var sServiceCount = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_ZONE1Set/$count?$filter=Vtext eq '" +
				Zone1D +
				"'";

			oModel1.loadData(sServiceCount, null, false, "GET", false, false, null);
			oInd = oModel1.oData;

			if (oInd === 0) {
				this.getView().byId("IdZone1D").setValueState("Error");
				sap.m.MessageBox.error("A Zona de tranpsorte informada não existe.");
				return;
			} else {
				this.getView().byId("IdZone1D").setValueState("None");
			}

			this.onValidaZona();
		},

		onChangePerigoso: function () {
			var Perigoso = this.getView().byId("IdPerigoso").getValue();
			if (Perigoso !== "") {
				if (Perigoso !== "SIM") {
					if (Perigoso !== "NÃO") {
						this.getView().byId("IdPerigoso").setValueState("Error");
						sap.m.MessageBox.error("O campo Perigoso deverá ser preenchido com SIM ou NÃO.");
						return;
					} else {
						this.getView().byId("IdPerigoso").setValueState("None");
						this.getView().byId("IdCodOnu").setValueState("None");
					}
				} else {
					this.getView().byId("IdPerigoso").setValueState("None");
				}
			} else {
				this.getView().byId("IdPerigoso").setValueState("None");
			}

			if (Perigoso === "SIM") {
				this.getView().byId("IdCodOnu").setEditable(true);
			} else {
				this.getView().byId("IdCodOnu").setEditable(false);
			}
			this.onValidaZona();
		},

		onChangeTpEmbalagem: function () {
			var oModel1 = new sap.ui.model.json.JSONModel();
			var TpEmbalagem = this.getView().byId("IdTpEmbalagem").getValue();
			var oInd = 0;

			if (TpEmbalagem !== "") {
				var sServiceCount = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_PARAMETSet/$count?$filter=Valor eq '" +
					TpEmbalagem +
					"'";
				oModel1.loadData(sServiceCount, null, false, "GET", false, false, null);
				oInd = oModel1.oData;

				if (oInd === 0) {
					this.getView().byId("IdTpEmbalagem").setValueState("Error");
					sap.m.MessageBox.error("Tipo de embalagem não existe.");
					return;
				} else {
					this.getView().byId("IdTpEmbalagem").setValueState("None");
				}
			}
		},

		onChangeTpCarregamento: function () {
			var oModel1 = new sap.ui.model.json.JSONModel();
			var TpCarreg = this.getView().byId("IdTpCarreg").getValue();
			var oInd = 0;

			if (TpCarreg !== "") {
				var sServiceCount = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_PARAMETSet/$count?$filter=Valor eq '" +
					TpCarreg +
					"'";
				oModel1.loadData(sServiceCount, null, false, "GET", false, false, null);
				oInd = oModel1.oData;

				if (oInd === 0) {
					this.getView().byId("IdTpCarreg").setValueState("Error");
					sap.m.MessageBox.error("Tipo de carragemento não existe.");
					return;
				} else {
					this.getView().byId("IdTpCarreg").setValueState("None");
				}
			}
		},

		onChangeIdDescMaterial: function () {
			var oModel1 = new sap.ui.model.json.JSONModel();
			var DescMaterial = this.getView().byId("IdDescMaterial").getValue();
			var oInd = 0;

			if (DescMaterial !== "") {
				var sServiceCount = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_PARAMETSet/$count?$filter=Valor eq '" +
					DescMaterial +
					"'";
				oModel1.loadData(sServiceCount, null, false, "GET", false, false, null);
				oInd = oModel1.oData;

				if (oInd === 0) {
					this.getView().byId("IdDescMaterial").setValueState("Error");
					sap.m.MessageBox.error("Material não existe.");
					return;
				} else {
					this.getView().byId("IdDescMaterial").setValueState("None");
				}
			}
		},

		onChangeWerksoDescr: function () {
			var WerksoDescr = this.getView().byId("IdWerksoDescr").getValue();

			if (WerksoDescr === "") {
				this.getView().byId("IdWerksoDescr").setValueState("Error");
			} else {
				this.getView().byId("IdWerksoDescr").setValueState("None");
				this.getView().byId("IdWerksO").setValueState("None");
			}
		},

		onChangeTpVeiculo: function () {
			var oModel1 = new sap.ui.model.json.JSONModel();
			var TpVeiculo = this.getView().byId("IdTpVeiculo").getValue();
			var oInd = 0;

			if (TpVeiculo !== "") {
				var sServiceCount = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_PARAMETSet/$count?$filter=Valor eq '" +
					TpVeiculo +
					"'";
				oModel1.loadData(sServiceCount, null, false, "GET", false, false, null);
				oInd = oModel1.oData;

				if (oInd === 0) {
					this.getView().byId("IdTpVeiculo").setValueState("Error");
					sap.m.MessageBox.error("Tipo de veiculo não existe.");
					return;
				} else {
					this.getView().byId("IdTpVeiculo").setValueState("None");
				}
			}
		},

		onChangeMengeUnit: function () {
			var Quantidade = this.getView().byId("IdMengeUnit").getValue();

			if (Quantidade !== 0) {
				this.getView().byId("IdMengeUnit").setValue(Quantidade);
			}

			if (Quantidade === 0) {
				this.getView().byId("IdMengeUnit").setValueState("Error");
				sap.m.MessageBox.error("Informe Quantidade");
			} else {
				this.getView().byId("IdMengeUnit").setValueState("None");
				Quantidade = Quantidade.replace(",", ".");
				Quantidade = parseFloat(Quantidade);
				Quantidade = Quantidade.toLocaleString('pt-BR');
				this.getView().byId("IdMengeUnit").setValue(Quantidade);
			}
		},

		onChangePesoUnit: function () {
			var Quantidade = this.getView().byId("IdMengeUnit").getValue();
			var PesoUnit = this.getView().byId("IdPesoUnit").getValue();
			var Total = 0;

			if (PesoUnit !== "") {
				this.getView().byId("IdPesoUnit").setValue(PesoUnit);

				if (Quantidade !== "") {
					Quantidade = parseFloat(Quantidade);
					Total = Quantidade * PesoUnit;
				}
			}

			if (PesoUnit === 0) {
				this.getView().byId("IdPesoUnit").setValueState("Error");
				sap.m.MessageBox.error("Informe Peso Unitario");
			} else {
				this.getView().byId("IdPesoUnit").setValueState("None");
				PesoUnit = PesoUnit.replace(",", ".");
				PesoUnit = parseFloat(PesoUnit);
				PesoUnit = PesoUnit.toLocaleString('pt-BR');
				this.getView().byId("IdPesoUnit").setValue(PesoUnit);
			}
		},

		// for UPLOAD.
		onChange: function (oEvent) {
			// Stellen das CSRF Token wenn ein File hinzugeft ist
			var oUploadCollection = oEvent.getSource();
			var _csrfToken = this.getView().getModel().oHeaders['x-csrf-token'];
			var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
				name: "x-csrf-token",
				value: _csrfToken
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
		},

		onuploadComplete: function (oEvent) {
			this.getView().getModel().refresh();

			// Inicio - Filtro nos uploads de arquivo
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue(),
				IdRota = this.getView().byId("IdIdRota").getValue(),
				filter = IdSolicitacao + ";" + IdRota,
				oFilter = new sap.ui.model.Filter("WerksO", sap.ui.model.FilterOperator.EQ, filter),
				oList = this.getView().byId("UploadCollection");

			// Executa filtro
			oList.getBinding("items").filter([oFilter]);
			// fim executa filtro

			// Fim - Filtro nos uploads de arquivo
		},

		onBeforeUploadStarts: function (oEvent) {

			var sName = sap.ushell.Container.getUser().getFullName();
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();
			var IdRota = this.getView().byId("IdIdRota").getValue();
			var sSlug = sName + "$" + IdSolicitacao + "$" + oEvent.getParameter("fileName") + "$" + IdRota;

			// Stellen die Kopf Parameter slug
			var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
				name: "slug",
				value: sSlug
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
			//			_busyDialog.open();
		},

		ondeletePress: function (oEvent) {
			var oModel = this.getView().getModel();
			var UploadCollection = this.getView().byId("UploadCollection");
			var oModel10 = UploadCollection.getModel();

			var Bukrs = "2001";
			var WerksO = this.getView().byId("IdWerks").getValue();
			var IdSolicitacao = this.getView().byId("IdIdSolicitacao").getValue();
			IdSolicitacao = parseInt(IdSolicitacao);
			var IdRota = this.getView().byId("IdIdRota").getValue();
			IdRota = parseInt(IdRota);

			var sEvent = oEvent.getSource();
			var sDocId = sEvent.getProperty("documentId");

			while (sDocId.indexOf(" ") != -1)
				sDocId = sDocId.replace(" ", "");
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
					text: "Confirma Eliminação do Arquivo em Anexo?"
				}),
				beginButton: new Button({
					text: "Confirma",
					press: function () {

						oModel10.update(sService, oEntry, {
							success: function (oData, oResponse) {
								sap.m.MessageBox.success("Anexo Eliminado com Sucesso", {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function (sAction) {
										sRefr.refresh();
									}
								});
							},
							error: function (oError) {
								sap.m.MessageBox.error("Erro na Grava\xE7\xE3o da Sele\xE7\xE3o!!");
							}
						});
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
				}
			});
			dialog.open();
		},
		// FIM Upload

		onChangeInput: function (oEvent) {
			var id = oEvent.getParameters().id;
			id = id.substring(43);
			var Input = this.getView().byId(id).getValue();

			if (Input !== "") {
				this.getView().byId(id).setValueState("None");
			}
		},

		onChangeContatoO: function () {
			var ContatoO = this.getView().byId("IdContatoO").getValue();

			if (ContatoO !== "") {
				this.getView().byId("IdContatoO").setValueState("None");
			} else {
				this.getView().byId("IdContatoO").setValueState("Error");
				sap.m.MessageBox.error("Informe o Contato do Centro");
			}
		},

		onChangeContatoD: function () {
			var ContatoD = this.getView().byId("IdContatoD").getValue();

			if (ContatoD !== "") {
				this.getView().byId("IdContatoD").setValueState("None");
			} else {
				this.getView().byId("IdContatoD").setValueState("Error");
				sap.m.MessageBox.error("Informe o Contato do Centro");
			}
		},

		onchangeIdAdrnrD: function () {
			var AdrnrD = this.getView().byId("IdAdrnrD").getValue();

			if (AdrnrD !== "") {
				this.getView().byId("IdAdrnrD").setValueState("None");
			} else {
				this.getView().byId("IdAdrnrD").setValueState("Error");
				sap.m.MessageBox.error("Informe o endereço");
			}
		},

		onChangeIdCnpjD: function () {
			var IdCnpjD = this.getView().byId("IdCnpjD").getValue();

			if (IdCnpjD !== "") {
				this.getView().byId("IdCnpjD").setValueState("None");
			} else {
				this.getView().byId("IdCnpjD").setValueState("Error");
				sap.m.MessageBox.error("Informe o CNPJ!");
			}

		},

		onchangeIdUfD: function () {
			var IdUfD = this.getView().byId("IdUfD").getValue();

			if (IdUfD !== "") {
				this.getView().byId("IdUfD").setValueState("None");
			} else {
				this.getView().byId("IdUfD").setValueState("Error");
				sap.m.MessageBox.error("Informe o Estado!");
			}
		},

		onChangeIdMunicD: function () {
			var IdMunicD = this.getView().byId("onChangeIdMunicD").getValue();

			if (IdMunicD !== "") {
				this.getView().byId("IdMunicD").setValueState("None");
			} else {
				this.getView().byId("IdMunicD").setValueState("Error");
				sap.m.MessageBox.error("Informe o Estado!");
			}
		},

		onChangeIdEmailD: function () {
			var IdEmailD = this.getView().byId("IdEmailD").getValue();

			if (IdEmailD === "") {
				this.getView().byId("IdEmailD").setValueState("Error");
				sap.m.MessageBox.error("Informe o Email!");

			} else {
				this.getView().byId("IdEmailD").setValueState("None");
			}
		},

		onChangeIdTelefoneD: function () {
			var IdTelefoneD = this.getView().byId("IdTelefoneD").getValue();

			if (IdTelefoneD === "") {
				this.getView().byId("IdTelefoneD").setValueState("Error");
				sap.m.MessageBox.error("Informe o Telefone!");
			} else {
				this.getView().byId("IdTelefoneD").setValueState("None");
			}
		},
		onChangeEmailO: function () {
			var EmailO = this.getView().byId("IdEmailO").getValue();

			if (EmailO !== "") {
				this.getView().byId("IdEmailO").setValueState("None");
			} else {
				this.getView().byId("IdEmailO").setValueState("Error");
				sap.m.MessageBox.error("Informe o Email do Contato do Centro");
			}
		},

		onChangeTelefoneO: function () {
			var TelefoneO = this.getView().byId("IdTelefoneO").getValue();

			if (TelefoneO !== "") {
				this.getView().byId("IdTelefoneO").setValueState("None");
			} else {
				this.getView().byId("IdTelefoneO").setValueState("Error");
				sap.m.MessageBox.error("Informe o Telefone do Contato do Centro");
			}
		},

		onChangeVlrTon: function () {
			var VlrTon = this.getView().byId("IdVlrTon").getValue();

			if (VlrTon === "" || VlrTon === 0) {
				this.getView().byId("IdVlrTon").setValueState("Error");
				sap.m.MessageBox.error("Valor unitário  não informado.");
				return;
			} else {
				this.getView().byId("IdVlrTon").setValueState("None");
				VlrTon = VlrTon.replace(",", ".");
				VlrTon = parseFloat(VlrTon);
				VlrTon = VlrTon.toLocaleString('pt-BR');
				this.getView().byId("IdVlrTon").setValue(VlrTon);
			}

		},

		onIdDescMaterial: function () {
			var IdDescMaterial = this.getView().byId("IdDescMaterial").getValue();

			if (IdDescMaterial === "") {
				this.getView().byId("IdDescMaterial").setValueState("Error");
				sap.m.MessageBox.error("Material não informado.");
				return;
			} else {
				this.getView().byId("IdDescMaterial").setValueState("None");
			}
		},

		IdHrCargaInic: function () {
			var IdHrCargaInic = this.getView().byId("IdHrCargaInic").getValue();

			if (IdHrCargaInic === "") {
				this.getView().byId("IdHrCargaInic").setValueState("Error");
			} else {
				this.getView().byId("IdHrCargaInic").setValueState("None");
			}
		},

		onChangeIdHrCargaFim: function () {
			var IdHrCargaFim = this.getView().byId("IdHrCargaFim").getValue();

			if (IdHrCargaFim === "") {
				this.getView().byId("IdHrCargaFim").setValueState("Error");
			} else {
				this.getView().byId("IdHrCargaFim").setValueState("None");
			}
		},

		onChangeIdHrDescInic: function () {
			var IdHrDescInic = this.getView().byId("IdHrDescInic").getValue();

			if (IdHrDescInic === "") {
				this.getView().byId("IdHrDescInic").setValueState("Error");
			} else {
				this.getView().byId("IdHrDescInic").setValueState("None");
			}
		},

		onChangeIdHrDescFim: function () {
			var IdHrDescFim = this.getView().byId("IdHrDescFim").getValue();

			if (IdHrDescFim === "") {
				this.getView().byId("IdHrDescFim").setValueState("Error");
			} else {
				this.getView().byId("IdHrDescFim").setValueState("None");
			}
		},

		onChangeIdDtInicTransp: function () {
			var IdDtInicTransp = this.getView().byId("IdDtInicTransp").getValue();

			if (IdDtInicTransp === "") {
				this.getView().byId("onChangeIdDtInicTransp").setValueState("Error");
			} else {
				this.getView().byId("onChangeIdDtInicTransp").setValueState("None");
			}
		},

		onChangeIdDtFimTransp: function () {
			var IdDtFimTransp = this.getView().byId("IdDtFimTransp").getValue();

			if (IdDtFimTransp === "") {
				this.getView().byId("IdDtFimTransp").setValueState("Error");
			} else {
				this.getView().byId("IdDtFimTransp").setValueState("None");
			}
		},

		onChangeIdHrCargaInic: function () {
			var IdHrCargaInic = this.getView().byId("IdHrCargaInic").getValue();

			if (IdHrCargaInic === "") {
				this.getView().byId("IdHrCargaInic").setValueState("Error");
				return;
			} else {
				this.getView().byId("IdHrCargaInic").setValueState("None");
			}
		},

		onChangeIdAlturaEmb: function () {
			var IdAlturaEmb = this.getView().byId("IdAlturaEmb").getValue();

			if (IdAlturaEmb === "") {
				this.getView().byId("IdAlturaEmb").setValueState("Error");
				return;
			} else {
				this.getView().byId("IdAlturaEmb").setValueState("None");
			}
		},

		onChangeIdLarguraEmb: function () {
			var IdLarguraEmb = this.getView().byId("IdLarguraEmb").getValue();

			if (IdLarguraEmb === "") {
				this.getView().byId("IdLarguraEmb").setValueState("Error");
				return;
			} else {
				this.getView().byId("IdLarguraEmb").setValueState("None");
			}
		},

		onChangeIdComprEmb: function () {
			var IdComprEmb = this.getView().byId("IdComprEmb").getValue();

			if (IdComprEmb === "") {
				this.getView().byId("IdComprEmb").setValueState("Error");
				return;
			} else {
				this.getView().byId("IdComprEmb").setValueState("None");
			}
		},

		onChangeIdVolumEmb: function () {
			var IdVolumEmb = this.getView().byId("IdVolumEmb").getValue();

			if (IdVolumEmb === "") {
				this.getView().byId("IdVolumEmb").setValueState("Error");
				return;
			} else {
				this.getView().byId("IdVolumEmb").setValueState("None");
			}
		},

		onChangeIdVlrTon: function () {
			var IdVlrTon = this.getView().byId("IdVlrTon").getValue();

			if (IdVlrTon !== "" || IdVlrTon !== 0) {
				while (IdVlrTon.indexOf(".") != -1) {
					IdVlrTon = IdVlrTon.replace(".", "");
				}

				IdVlrTon = IdVlrTon.replace(",", ".");
				IdVlrTon = parseFloat(IdVlrTon);
				IdVlrTon = IdVlrTon.toLocaleString('pt-BR');

				this.getView().byId("IdVlrTon").setValue(IdVlrTon);
			}
		}

	});
});