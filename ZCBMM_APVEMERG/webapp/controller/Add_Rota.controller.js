sap.ui.define([
	"ZCBMM_APVEMERG/ZCBMM_APVEMERG/controller/BaseController",
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/m/Text',
	"sap/ui/model/json/JSONModel"
], function(BaseController,
	Dialog,
	Button,
	Text,
	JSONModel) {
	"use strict";

	return BaseController.extend("ZCBMM_APVEMERG.ZCBMM_APVEMERG.controller.Add_Rota", {

		onInit: function() {
			this.getRouter().getRoute("Add_Rota").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function(oEvent) {
			// inicio - Gravar informações do cabeçalho
			var Werks = oEvent.getParameter("arguments").Werks;
			var IdSolicitacao = oEvent.getParameter("arguments").IdSolicitacao;
			var Carteira = oEvent.getParameter("arguments").Carteira;
			var Modalidade = oEvent.getParameter("arguments").Modalidade;
			var Prioridade = oEvent.getParameter("arguments").Prioridade;
			var Finalidade = oEvent.getParameter("arguments").Finalidade;
			var GrpCompras = oEvent.getParameter("arguments").GrpCompras;
			var DtInic = oEvent.getParameter("arguments").DtInic;

			this.getView().byId("IdWerks").setValue(Werks);
			this.getView().byId("IdIdSolicitacao").setValue(IdSolicitacao);
			this.getView().byId("IdCarteira").setValue(Carteira);
			this.getView().byId("IdModalidade").setValue(Modalidade);
			this.getView().byId("IdPrioridade").setValue(Prioridade);
			this.getView().byId("IdFinalidade").setValue(Finalidade);
			this.getView().byId("IdGrpCompras").setValue(GrpCompras);
			this.getView().byId("IdDtInic").setValue(DtInic);
			this.getView().byId("IdWerksO").setValue(Werks);
			// Fim - Gravar informações do cabeçalho

			// Inicio - Buscar a gravar informação do id da rota
			var oModel = new sap.ui.model.json.JSONModel();
			var oInd = {};
			var newIdSolicitacao;
			var BuscaIdCota = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_ROTASet/$count?$filter=IdSolicitacao eq " +
				IdSolicitacao + "";

			oModel.loadData(BuscaIdCota, null, false, "GET", false, false, null);
			oInd = oModel.oData;
			newIdSolicitacao = oInd + 1;
			this.getView().byId("IdIdRota").setValue(newIdSolicitacao);
			// Fim - Buscar a gravar informação do id da rota

			// Inicio - Buscar informações do centro caso ja não exista cadastrado

			var WerksoDescr = this.getView().byId("IdWerksoDescr").getValue();
			var AdrnrO = this.getView().byId("IdAdrnrO").getValue();
			var CnpjO = this.getView().byId("IdCnpjO").getValue();
			var oModel10 = new sap.ui.model.json.JSONModel();
			var WerksO = this.getView().byId("IdWerksO").getValue();
			var Bukrs = "2001";
			var Uf = "";
			var Munic = "";
			var Cnpj = "";
			var sService = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_WERKSSet(Bukrs='" + Bukrs + "',Werks='" + WerksO +
				"')";

			if (WerksoDescr === "" || AdrnrO === "" || CnpjO === "") {
				oModel10.loadData(sService, null, false, "GET", false, false, null);
				WerksoDescr = oModel10.oData.d.Name1;
				AdrnrO = oModel10.oData.d.Endereco;
				CnpjO = oModel10.oData.d.Cnpj;
				Munic = oModel10.oData.d.Munic;
				Uf = oModel10.oData.d.Uf;

				if (CnpjO !== "") {
					Cnpj = CnpjO.substring(0, 2) + "." + CnpjO.substring(2, 5) + "." + CnpjO.substring(5, 8) + "/" + CnpjO.substring(8, 12) + "-" +
						CnpjO.substring(12, 15);
				}
				this.getView().byId("IdWerksoDescr").setValue(WerksoDescr);
				this.getView().byId("IdAdrnrO").setValue(AdrnrO);
				this.getView().byId("IdCnpjO").setValue(Cnpj);
				this.getView().byId("IdUfO").setValue(Uf);
				this.getView().byId("IdMunicO").setValue(Munic);
			}

			// Fim - Buscar informações do centro caso ja não exista cadastrado

			// Inicio - Validar carteira e deixar campos visiveis.
			if (Carteira === "SERVIÇO") {
				this.getView().byId("TabFilterOrigem").setVisible(true);
				this.getView().byId("TabFilterDestino").setVisible(false);
				this.getView().byId("TabFilterMaterial").setVisible(false);
				this.getView().byId("TabFilterOutros").setVisible(false);
				this.getView().byId("TabFilterEscopo").setVisible(true);
				this.getView().byId("TabFilterTrasnporte").setVisible(false);
			}
			if (Carteira === "INSUMO" || Carteira === "RESIDUO" || Carteira === "BAUXITA") {
				this.getView().byId("TabFilterOrigem").setVisible(true);
				this.getView().byId("TabFilterDestino").setVisible(true);
				this.getView().byId("TabFilterMaterial").setVisible(true);
				this.getView().byId("TabFilterOutros").setVisible(true);
				this.getView().byId("TabFilterEscopo").setVisible(false);
				this.getView().byId("TabFilterTrasnporte").setVisible(false);
			}
			if (Carteira === "MRO") {
				this.getView().byId("TabFilterOrigem").setVisible(true);
				this.getView().byId("TabFilterDestino").setVisible(true);
				this.getView().byId("TabFilterMaterial").setVisible(true);
				this.getView().byId("TabFilterOutros").setVisible(true);
				this.getView().byId("TabFilterEscopo").setVisible(false);
				this.getView().byId("TabFilterTrasnporte").setVisible(false);
			}
			if (Carteira === "PRODUTO ACABADO") {
				this.getView().byId("TabFilterOrigem").setVisible(true);
				this.getView().byId("TabFilterDestino").setVisible(true);
				this.getView().byId("TabFilterMaterial").setVisible(true);
				this.getView().byId("TabFilterOutros").setVisible(true);
				this.getView().byId("TabFilterEscopo").setVisible(false);
				this.getView().byId("TabFilterTrasnporte").setVisible(true);
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
		},

		onBack: function() {
			this.getRouter().navTo("BackSol");
		},

		onHelpZone1: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog1) {
				this._valueHelpDialog1 = sap.ui.xmlfragment("ZCBMM_APVEMERG.ZCBMM_APVEMERG.view.Zone1", this);
				this.getView().addDependent(this._valueHelpDialog1);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog1.open(sInputValue);
		},

		onHelpPerigoso: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog2) {
				this._valueHelpDialog2 = sap.ui.xmlfragment("ZCBMM_APVEMERG.ZCBMM_APVEMERG.view.Perigoso", this);
				this.getView().addDependent(this._valueHelpDialog2);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog2.open(sInputValue);
		},

		onHelpTpEmbalagem: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog3) {
				this._valueHelpDialog3 = sap.ui.xmlfragment("ZCBMM_APVEMERG.ZCBMM_APVEMERG.view.TpEmbalagem", this);
				this.getView().addDependent(this._valueHelpDialog3);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog3.open(sInputValue);
		},

		onHelpTpVeiculo: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog4) {
				this._valueHelpDialog4 = sap.ui.xmlfragment("ZCBMM_APVEMERG.ZCBMM_APVEMERG.view.TpVeiculo", this);
				this.getView().addDependent(this._valueHelpDialog4);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog4.open(sInputValue);
		},

		onHelpWerks: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog5) {
				this._valueHelpDialog5 = sap.ui.xmlfragment("ZCBMM_APVEMERG.ZCBMM_APVEMERG.view.Werks", this);
				this.getView().addDependent(this._valueHelpDialog5);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog5.open(sInputValue);
		},

		onHelpMaterial: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog6) {
				this._valueHelpDialog6 = sap.ui.xmlfragment("ZCBMM_APVEMERG.ZCBMM_APVEMERG.view.Material", this);
				this.getView().addDependent(this._valueHelpDialog6);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog6.open(sInputValue);
		},

		onHelpTpCarreg: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog7) {
				this._valueHelpDialog7 = sap.ui.xmlfragment("ZCBMM_APVEMERG.ZCBMM_APVEMERG.view.Carregamento", this);
				this.getView().addDependent(this._valueHelpDialog7);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog7.open(sInputValue);
		},

		_handleValueHelpClose: function(evt) {
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

		_Confirme_Zone1: function(evt) {

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

		},

		_Confirme_Material: function(evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			this._valueHelpDialog5 = null;

			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
			}

			this.onChangeIdDescMaterial();

			this.getView().byId(productInput).setValueState("None");
		},

		_Confirme_Carregamento: function(evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			this._valueHelpDialog5 = null;

			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
			}

			this.onChangeTpCarregamento();

			this.getView().byId(productInput).setValueState("None");
		},

		_Confirme_TpVeiculo: function(evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			this._valueHelpDialog5 = null;

			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
			}

			this.onChangeTpVeiculo();

			this.getView().byId(productInput).setValueState("None");
		},

		_Confirme_TpEmbalagem: function(evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			this._valueHelpDialog5 = null;

			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
			}

			this.onChangeTpEmbalagem();

			this.getView().byId(productInput).setValueState("None");
		},

		_Confirme_Perigoso: function(evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			this._valueHelpDialog5 = null;

			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
			}

			this.onChangePerigoso();

			this.getView().byId(productInput).setValueState("None");
		},

		_Confirme_werks: function(evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			this._valueHelpDialog5 = null;

			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
			}

			this.onChangeWerksD();

			this.getView().byId(productInput).setValueState("None");
		},

		_onModelContextChangePerigoso: function(oEvent) {
			var Parametro = "PERIGOSO";

			var sFilter = Parametro;
			var oFilter = oFilter = new sap.ui.model.Filter("Parametro", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		_onModelContextChangeTpEmbalagem: function(oEvent) {
			var Parametro = "TIPOS DE EMBALAGEM";

			var sFilter = Parametro;
			var oFilter = oFilter = new sap.ui.model.Filter("Parametro", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		_onModelContextChangeTpVeiculo: function(oEvent) {
			var Parametro = "TIPOS DE VEICULO";

			var sFilter = Parametro;
			var oFilter = oFilter = new sap.ui.model.Filter("Parametro", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		_onModelContextChangeMaterial: function(oEvent) {
			var Parametro = "PRODUTO";

			var sFilter = Parametro;
			var oFilter = oFilter = new sap.ui.model.Filter("Parametro", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		_onModelContextChangeTpCarreg: function(oEvent) {
			var Parametro = "TIPOS DE CARREGAMENTO";

			var sFilter = Parametro;
			var oFilter = oFilter = new sap.ui.model.Filter("Parametro", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		onChangeWerksD: function() {
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

					this.getView().byId("IdWerksD").setValueState("Success");
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

					if (CnpjD !== "") {
						cnpj = CnpjD.substring(0, 2) + "." + CnpjD.substring(2, 5) + "." + CnpjD.substring(5, 8) + "/" + CnpjD.substring(8, 12) + "-" +
							CnpjD.substring(12, 15);
					}

					this.getView().byId("IdWerksdDescr").setValue(WerksoDescr);
					this.getView().byId("IdAdrnrD").setValue(AdrnrD);
					this.getView().byId("IdCnpjD").setValue(cnpj);
					this.getView().byId("IdMunicD").setValue(MunicD);
					this.getView().byId("IdUfD").setValue(UfD);
				}
			}
		},

		_handleValueHelpZone1: function(oEvent) {
			var sValue = oEvent.getParameter("value");

			var oFilter = new sap.ui.model.Filter("Vtext",
				sap.ui.model.FilterOperator.Contains, sValue);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpWerks: function(oEvent) {
			var sValue = oEvent.getParameter("value");

			var oFilter = new sap.ui.model.Filter("Werks",
				sap.ui.model.FilterOperator.Contains, sValue);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		onSave: function() {
			var oModel = this.getView().getModel();
			var This = this;
			var Bukrs = "2001";
			var WerksO = This.getView().byId("IdWerksO").getValue();
			var IdSolicitacao = This.getView().byId("IdIdSolicitacao").getValue();
			var IdRota = This.getView().byId("IdIdRota").getValue();
			var Carteira = This.getView().byId("IdCarteira").getValue();
			var Key = "/ZET_CBMM_CF_ROTASet(Bukrs='" + Bukrs + "',WerksO='" + WerksO + "',IdSolicitacao=" + IdSolicitacao + ",IdRota=" +
				IdRota + ")";
			var oEntry = {};
			oEntry.Zone1O = This.getView().byId("IdZone1O").getValue();
			oEntry.WerksoDescr = This.getView().byId("IdWerksoDescr").getValue();
			oEntry.Zone1D = This.getView().byId("IdZone1D").getValue();
			oEntry.AdrnrO = This.getView().byId("IdAdrnrO").getValue();
			//oEntry.MengeUnit = This.getView().byId("IdMengeUnit").getValue();
			//	oEntry.MengeUnit = parseInt(oEntry.MengeUnit);
			oEntry.CnpjO = This.getView().byId("IdCnpjO").getValue();
			oEntry.CnpjO = oEntry.CnpjO.substring(0, 2) + oEntry.CnpjO.substring(4, 6) + oEntry.CnpjO.substring(8, 11) + oEntry.CnpjO.substring(
				12, 16) + oEntry.CnpjO.substring(17, 19);
			oEntry.ContatoO = This.getView().byId("IdContatoO").getValue();
			oEntry.EmailO = This.getView().byId("IdEmailO").getValue();
			oEntry.TelefoneO = This.getView().byId("IdTelefoneO").getValue();
			oEntry.MunicO = This.getView().byId("IdMunicO").getValue();
			oEntry.UfO = This.getView().byId("IdUfO").getValue();
			oEntry.WerksD = This.getView().byId("IdWerksD").getValue();
			oEntry.WerksdDescr = This.getView().byId("IdWerksdDescr").getValue();
			oEntry.AdrnrD = This.getView().byId("IdAdrnrD").getValue();
			oEntry.CnpjD = This.getView().byId("IdCnpjD").getValue();
			oEntry.CnpjD = oEntry.CnpjD.substring(0, 2) + oEntry.CnpjD.substring(4, 6) + oEntry.CnpjD.substring(8, 11) + oEntry.CnpjD.substring(
				12, 16) + oEntry.CnpjD.substring(17, 19);
			oEntry.ContatoD = This.getView().byId("IdContatoD").getValue();
			oEntry.EmailD = This.getView().byId("IdEmailD").getValue();
			oEntry.TelefoneD = This.getView().byId("IdTelefoneD").getValue();
			oEntry.MunicD = This.getView().byId("IdMunicD").getValue();
			oEntry.UfD = This.getView().byId("IdUfD").getValue();
			oEntry.DescMaterial = This.getView().byId("IdDescMaterial").getValue();
			oEntry.Perigoso = This.getView().byId("IdPerigoso").getValue();
			oEntry.CodOnu = This.getView().byId("IdCodOnu").getValue();
			oEntry.CodOnu = parseInt(oEntry.CodOnu);
			oEntry.PesoUnit = This.getView().byId("IdPesoUnit").getValue();
			oEntry.PesoUnit = parseInt(oEntry.PesoUnit);
			oEntry.PesoTotal = This.getView().byId("IdPesoTotal").getValue();
			oEntry.PesoTotal = parseInt(oEntry.PesoTotal);
			oEntry.Altura = This.getView().byId("IdAltura").getValue();
			oEntry.Altura = parseInt(oEntry.Altura);
			oEntry.Largura = This.getView().byId("IdLargura").getValue();
			oEntry.Largura = parseInt(oEntry.Largura);
			oEntry.Compr = This.getView().byId("IdCompr").getValue();
			oEntry.Compr = parseInt(oEntry.Compr);
			oEntry.TpEmbalagem = This.getView().byId("IdTpEmbalagem").getValue();
			oEntry.TpCarreg = This.getView().byId("IdTpCarreg").getValue();
			oEntry.TpVeiculo = This.getView().byId("IdTpVeiculo").getValue();
			oEntry.AlturaEmb = This.getView().byId("IdAlturaEmb").getValue();
			oEntry.AlturaEmb = parseInt(oEntry.AlturaEmb);
			oEntry.LarguraEmb = This.getView().byId("IdLarguraEmb").getValue();
			oEntry.LarguraEmb = parseInt(oEntry.LarguraEmb);
			oEntry.ComprEmb = This.getView().byId("IdComprEmb").getValue();
			oEntry.ComprEmb = parseInt(oEntry.ComprEmb);
			oEntry.VolumEmb = This.getView().byId("IdVolumEmb").getValue();
			oEntry.VolumEmb = parseInt(oEntry.VolumEmb);
			oEntry.VlrTon = This.getView().byId("IdVlrTon").getValue();
			oEntry.VlrTon = parseInt(oEntry.VlrTon);
			oEntry.RotCarreg = This.getView().byId("IdRotCarreg").getValue();
			oEntry.HrCargaInic = This.getView().byId("IdHrCargaInic").getValue();
			oEntry.HrCargaFim = This.getView().byId("IdHrCargaFim").getValue();
			oEntry.HrDescInic = This.getView().byId("IdHrDescInic").getValue();
			oEntry.HrDescFim = This.getView().byId("IdHrDescFim").getValue();
			oEntry.ComprReboq = This.getView().byId("IdComprReboq").getValue();
			oEntry.ComprReboq = parseInt(oEntry.ComprReboq);

			// Inicio - Validar Carteira Serviço 
			if (Carteira === "SERVIÇO") {
				// Inicio - Origem

				if (oEntry.Zone1O === "") {
					This.getView().byId("IdZone1O").setValueState("Error");
					sap.m.MessageBox.error("Zona de Transporte Origem não informada!");
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
			}
			// Fim - Validar Carteira Serviço 

			// Inicio - Validar informações da carteira MRO
			if (Carteira === "MRO") {

				// Inicio - Origem

				if (oEntry.Zone1O === "") {
					This.getView().byId("IdZone1O").setValueState("Error");
					sap.m.MessageBox.error("Zona de Transporte Origem não informada!");
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
				if (oEntry.Zone1D === "") {
					This.getView().byId("IdZone1D").setValueState("Error");
					sap.m.MessageBox.error("Zona de Transporte Destino não informada!");
					This.getView().byId("TabFilterDestino").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("2");
					return;
				} else {
					This.getView().byId("TabFilterDestino").setIconColor();
				}

				if (oEntry.WerksdDescr === "") {
					This.getView().byId("IdWerksdDescr").setValueState("Error");
					sap.m.MessageBox.error("Razão Social do Destino não informada!");
					This.getView().byId("TabFilterDestino").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("2");
					return;
				} else {
					This.getView().byId("TabFilterDestino").setIconColor();
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

				if (oEntry.MengeUnit === "") {
					This.getView().byId("IdMengeUnit").setValueState("Error");
					sap.m.MessageBox.error("Quanditade não informada!");
					This.getView().byId("TabFilterMaterial").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("3");
					return;
				} else {
					This.getView().byId("TabFilterMaterial").setIconColor();
				}

				if (oEntry.Perigoso === "") {
					This.getView().byId("IdCodOnu").setValueState("Error");
					sap.m.MessageBox.error("Classificação do material não informada!");
					This.getView().byId("TabFilterMaterial").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("3");
					return;
				} else {
					This.getView().byId("TabFilterMaterial").setIconColor();
				}

				if (oEntry.Perigoso === "SIM") {
					if (oEntry.CodOnu === "") {
						This.getView().byId("IdCodOnu").setValueState("Error");
						sap.m.MessageBox.error("Codigo ONU não informada!");
						This.getView().byId("TabFilterMaterial").setIconColor("Negative");
						This.getView().byId("iconTabBar").setSelectedKey("3");
						return;
					} else {
						This.getView().byId("TabFilterMaterial").setIconColor();
					}
				}
				if (oEntry.PesoUnit === "") {
					This.getView().byId("IdPesoUnit").setValueState("Error");
					sap.m.MessageBox.error("Peso Unitario do material não informado!");
					This.getView().byId("TabFilterMaterial").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("3");
					return;
				} else {
					This.getView().byId("TabFilterMaterial").setIconColor();
				}

				if (oEntry.VlrTon === "") {
					This.getView().byId("IdVlrTon").setValueState("Error");
					sap.m.MessageBox.error("Valor total por tonelada do material não informado!");
					This.getView().byId("TabFilterMaterial").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("3");
					return;
				} else {
					This.getView().byId("TabFilterMaterial").setIconColor();
				}

				if (oEntry.Altura === "") {
					This.getView().byId("IdAltura").setValueState("Error");
					sap.m.MessageBox.error("Altura do material não informada!");
					This.getView().byId("TabFilterMaterial").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("3");
					return;
				} else {
					This.getView().byId("TabFilterMaterial").setIconColor();
				}

				if (oEntry.Compr === "") {
					This.getView().byId("IdCompr").setValueState("Error");
					sap.m.MessageBox.error("Comprimento do material não informada!");
					This.getView().byId("TabFilterMaterial").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("3");
					return;
				} else {
					This.getView().byId("TabFilterMaterial").setIconColor();
				}

				// Fim - Material

				// Inicio - Outros
				if (oEntry.TpEmbalagem === "") {
					This.getView().byId("IdTpEmbalagem").setValueState("Error");
					sap.m.MessageBox.error("Tipo de Embalagem não informada!");
					This.getView().byId("TabFilterOutros").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("4");
					return;
				} else {
					This.getView().byId("TabFilterOutros").setIconColor();
				}

				if (oEntry.AlturaEmb === "") {
					This.getView().byId("IdAlturaEmb").setValueState("Error");
					sap.m.MessageBox.error("Altura da Embalagem não informada!");
					This.getView().byId("TabFilterOutros").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("4");
					return;
				} else {
					This.getView().byId("TabFilterOutros").setIconColor();
				}

				if (oEntry.LarguraEmb === "") {
					This.getView().byId("IdLarguraEmb").setValueState("Error");
					sap.m.MessageBox.error("Largura da Embalagem não informada!");
					This.getView().byId("TabFilterOutros").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("4");
					return;
				} else {
					This.getView().byId("TabFilterOutros").setIconColor();
				}

				if (oEntry.ComprEmb === "") {
					This.getView().byId("IdComprEmb").setValueState("Error");
					sap.m.MessageBox.error("Comprimento da Embalagem não informado!");
					This.getView().byId("TabFilterOutros").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("4");
					return;
				} else {
					This.getView().byId("TabFilterOutros").setIconColor();
				}

				if (oEntry.VolumEmb === "") {
					This.getView().byId("IdVolumEmb").setValueState("Error");
					sap.m.MessageBox.error("Volume da Embalagem não informado!");
					This.getView().byId("TabFilterOutros").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("4");
					return;
				} else {
					This.getView().byId("TabFilterOutros").setIconColor();
				}

				if (oEntry.TpCarreg === "") {
					This.getView().byId("IdTpCarreg").setValueState("Error");
					sap.m.MessageBox.error("Tipo de Carregamento não informado!");
					This.getView().byId("TabFilterOutros").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("4");
					return;
				} else {
					This.getView().byId("TabFilterOutros").setIconColor();
				}

				if (oEntry.TpVeiculo === "") {
					This.getView().byId("IdTpVeiculo").setValueState("Error");
					sap.m.MessageBox.error("Tipo de Veiculo não informado!");
					This.getView().byId("TabFilterOutros").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("4");
					return;
				} else {
					This.getView().byId("TabFilterOutros").setIconColor();
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

				if (oEntry.ComprReboq === "") {
					This.getView().byId("IdComprReboq").setValueState("Error");
					sap.m.MessageBox.error("Comprimento do reboque não informado!");
					This.getView().byId("TabFilterOutros").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("4");
					return;
				} else {
					This.getView().byId("TabFilterOutros").setIconColor();
				}

				if (oEntry.RotCarreg === "") {
					This.getView().byId("IdRotCarreg").setValueState("Error");
					sap.m.MessageBox.error("Rotina de carregamento não informado!");
					This.getView().byId("TabFilterOutros").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("4");
					return;
				} else {
					This.getView().byId("TabFilterOutros").setIconColor();
				}

				// Fim - Outros
			}
			// Fim - Validar informações da carteira MRO

			if (Carteira === "INSUMO") {

				// Inicio - Origem

				if (oEntry.Zone1O === "") {
					This.getView().byId("IdZone1O").setValueState("Error");
					sap.m.MessageBox.error("Zona de Transporte Origem não informada!");
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
				if (oEntry.Zone1D === "") {
					This.getView().byId("IdZone1D").setValueState("Error");
					sap.m.MessageBox.error("Zona de Transporte Destino não informada!");
					This.getView().byId("TabFilterDestino").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("2");
					return;
				} else {
					This.getView().byId("TabFilterDestino").setIconColor();
				}

				if (oEntry.WerksdDescr === "") {
					This.getView().byId("IdWerksdDescr").setValueState("Error");
					sap.m.MessageBox.error("Razão Social do Destino não informada!");
					This.getView().byId("TabFilterDestino").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("2");
					return;
				} else {
					This.getView().byId("TabFilterDestino").setIconColor();
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

				if (oEntry.MengeUnit === "") {
					This.getView().byId("IdMengeUnit").setValueState("Error");
					sap.m.MessageBox.error("Quanditade não informada!");
					This.getView().byId("TabFilterMaterial").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("3");
					return;
				} else {
					This.getView().byId("TabFilterMaterial").setIconColor();
				}

				if (oEntry.Perigoso === "") {
					This.getView().byId("IdCodOnu").setValueState("Error");
					sap.m.MessageBox.error("Classificação do material não informada!");
					This.getView().byId("TabFilterMaterial").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("3");
					return;
				} else {
					This.getView().byId("TabFilterMaterial").setIconColor();
				}

				if (oEntry.Perigoso === "SIM") {
					if (oEntry.CodOnu === "") {
						This.getView().byId("IdCodOnu").setValueState("Error");
						sap.m.MessageBox.error("Codigo ONU não informada!");
						This.getView().byId("TabFilterMaterial").setIconColor("Negative");
						This.getView().byId("iconTabBar").setSelectedKey("3");
						return;
					} else {
						This.getView().byId("TabFilterMaterial").setIconColor();
					}
				}
				if (oEntry.PesoUnit === "") {
					This.getView().byId("IdPesoUnit").setValueState("Error");
					sap.m.MessageBox.error("Peso Unitario do material não informado!");
					This.getView().byId("TabFilterMaterial").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("3");
					return;
				} else {
					This.getView().byId("TabFilterMaterial").setIconColor();
				}

				if (oEntry.VlrTon === "") {
					This.getView().byId("IdVlrTon").setValueState("Error");
					sap.m.MessageBox.error("Valor total por tonelada do material não informado!");
					This.getView().byId("TabFilterMaterial").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("3");
					return;
				} else {
					This.getView().byId("TabFilterMaterial").setIconColor();
				}

				if (oEntry.Altura === "") {
					This.getView().byId("IdAltura").setValueState("Error");
					sap.m.MessageBox.error("Altura do material não informada!");
					This.getView().byId("TabFilterMaterial").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("3");
					return;
				} else {
					This.getView().byId("TabFilterMaterial").setIconColor();
				}

				if (oEntry.Compr === "") {
					This.getView().byId("IdCompr").setValueState("Error");
					sap.m.MessageBox.error("Comprimento do material não informada!");
					This.getView().byId("TabFilterMaterial").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("3");
					return;
				} else {
					This.getView().byId("TabFilterMaterial").setIconColor();
				}

				// Fim - Material

				// Inicio - Outros
				if (oEntry.TpEmbalagem === "") {
					This.getView().byId("IdTpEmbalagem").setValueState("Error");
					sap.m.MessageBox.error("Tipo de Embalagem não informada!");
					This.getView().byId("TabFilterOutros").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("4");
					return;
				} else {
					This.getView().byId("TabFilterOutros").setIconColor();
				}

				if (oEntry.AlturaEmb === "") {
					This.getView().byId("IdAlturaEmb").setValueState("Error");
					sap.m.MessageBox.error("Altura da Embalagem não informada!");
					This.getView().byId("TabFilterOutros").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("4");
					return;
				} else {
					This.getView().byId("TabFilterOutros").setIconColor();
				}

				if (oEntry.LarguraEmb === "") {
					This.getView().byId("IdLarguraEmb").setValueState("Error");
					sap.m.MessageBox.error("Largura da Embalagem não informada!");
					This.getView().byId("TabFilterOutros").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("4");
					return;
				} else {
					This.getView().byId("TabFilterOutros").setIconColor();
				}

				if (oEntry.ComprEmb === "") {
					This.getView().byId("IdComprEmb").setValueState("Error");
					sap.m.MessageBox.error("Comprimento da Embalagem não informado!");
					This.getView().byId("TabFilterOutros").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("4");
					return;
				} else {
					This.getView().byId("TabFilterOutros").setIconColor();
				}

				if (oEntry.VolumEmb === "") {
					This.getView().byId("IdVolumEmb").setValueState("Error");
					sap.m.MessageBox.error("Volume da Embalagem não informado!");
					This.getView().byId("TabFilterOutros").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("4");
					return;
				} else {
					This.getView().byId("TabFilterOutros").setIconColor();
				}

				if (oEntry.TpCarreg === "") {
					This.getView().byId("IdTpCarreg").setValueState("Error");
					sap.m.MessageBox.error("Tipo de Carregamento não informado!");
					This.getView().byId("TabFilterOutros").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("4");
					return;
				} else {
					This.getView().byId("TabFilterOutros").setIconColor();
				}

				if (oEntry.TpVeiculo === "") {
					This.getView().byId("IdTpVeiculo").setValueState("Error");
					sap.m.MessageBox.error("Tipo de Veiculo não informado!");
					This.getView().byId("TabFilterOutros").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("4");
					return;
				} else {
					This.getView().byId("TabFilterOutros").setIconColor();
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

				if (oEntry.ComprReboq === "") {
					This.getView().byId("IdComprReboq").setValueState("Error");
					sap.m.MessageBox.error("Comprimento do reboque não informado!");
					This.getView().byId("TabFilterOutros").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("4");
					return;
				} else {
					This.getView().byId("TabFilterOutros").setIconColor();
				}

				if (oEntry.RotCarreg === "") {
					This.getView().byId("IdRotCarreg").setValueState("Error");
					sap.m.MessageBox.error("Rotina de carregamento não informado!");
					This.getView().byId("TabFilterOutros").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("4");
					return;
				} else {
					This.getView().byId("TabFilterOutros").setIconColor();
				}

				// Fim - Outros
			}

			if (Carteira === "PRODUTO ACABADO") {

				// Inicio - Origem

				if (oEntry.Zone1O === "") {
					This.getView().byId("IdZone1O").setValueState("Error");
					sap.m.MessageBox.error("Zona de Transporte Origem não informada!");
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
				if (oEntry.Zone1D === "") {
					This.getView().byId("IdZone1D").setValueState("Error");
					sap.m.MessageBox.error("Zona de Transporte Destino não informada!");
					This.getView().byId("TabFilterDestino").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("2");
					return;
				} else {
					This.getView().byId("TabFilterDestino").setIconColor();
				}

				if (oEntry.WerksdDescr === "") {
					This.getView().byId("IdWerksdDescr").setValueState("Error");
					sap.m.MessageBox.error("Razão Social do Destino não informada!");
					This.getView().byId("TabFilterDestino").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("2");
					return;
				} else {
					This.getView().byId("TabFilterDestino").setIconColor();
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

				if (oEntry.MengeUnit === "") {
					This.getView().byId("IdMengeUnit").setValueState("Error");
					sap.m.MessageBox.error("Quanditade não informada!");
					This.getView().byId("TabFilterMaterial").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("3");
					return;
				} else {
					This.getView().byId("TabFilterMaterial").setIconColor();
				}

				if (oEntry.Perigoso === "") {
					This.getView().byId("IdCodOnu").setValueState("Error");
					sap.m.MessageBox.error("Classificação do material não informada!");
					This.getView().byId("TabFilterMaterial").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("3");
					return;
				} else {
					This.getView().byId("TabFilterMaterial").setIconColor();
				}

				if (oEntry.Perigoso === "SIM") {
					if (oEntry.CodOnu === "") {
						This.getView().byId("IdCodOnu").setValueState("Error");
						sap.m.MessageBox.error("Codigo ONU não informada!");
						This.getView().byId("TabFilterMaterial").setIconColor("Negative");
						This.getView().byId("iconTabBar").setSelectedKey("3");
						return;
					} else {
						This.getView().byId("TabFilterMaterial").setIconColor();
					}
				}
				if (oEntry.PesoUnit === "") {
					This.getView().byId("IdPesoUnit").setValueState("Error");
					sap.m.MessageBox.error("Peso Unitario do material não informado!");
					This.getView().byId("TabFilterMaterial").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("3");
					return;
				} else {
					This.getView().byId("TabFilterMaterial").setIconColor();
				}

				if (oEntry.VlrTon === "") {
					This.getView().byId("IdVlrTon").setValueState("Error");
					sap.m.MessageBox.error("Valor total por tonelada do material não informado!");
					This.getView().byId("TabFilterMaterial").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("3");
					return;
				} else {
					This.getView().byId("TabFilterMaterial").setIconColor();
				}

				if (oEntry.Altura === "") {
					This.getView().byId("IdAltura").setValueState("Error");
					sap.m.MessageBox.error("Altura do material não informada!");
					This.getView().byId("TabFilterMaterial").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("3");
					return;
				} else {
					This.getView().byId("TabFilterMaterial").setIconColor();
				}

				if (oEntry.Compr === "") {
					This.getView().byId("IdCompr").setValueState("Error");
					sap.m.MessageBox.error("Comprimento do material não informada!");
					This.getView().byId("TabFilterMaterial").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("3");
					return;
				} else {
					This.getView().byId("TabFilterMaterial").setIconColor();
				}

				// Fim - Material

				// Inicio - Outros
				if (oEntry.TpEmbalagem === "") {
					This.getView().byId("IdTpEmbalagem").setValueState("Error");
					sap.m.MessageBox.error("Tipo de Embalagem não informada!");
					This.getView().byId("TabFilterOutros").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("4");
					return;
				} else {
					This.getView().byId("TabFilterOutros").setIconColor();
				}

				if (oEntry.AlturaEmb === "") {
					This.getView().byId("IdAlturaEmb").setValueState("Error");
					sap.m.MessageBox.error("Altura da Embalagem não informada!");
					This.getView().byId("TabFilterOutros").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("4");
					return;
				} else {
					This.getView().byId("TabFilterOutros").setIconColor();
				}

				if (oEntry.LarguraEmb === "") {
					This.getView().byId("IdLarguraEmb").setValueState("Error");
					sap.m.MessageBox.error("Largura da Embalagem não informada!");
					This.getView().byId("TabFilterOutros").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("4");
					return;
				} else {
					This.getView().byId("TabFilterOutros").setIconColor();
				}

				if (oEntry.ComprEmb === "") {
					This.getView().byId("IdComprEmb").setValueState("Error");
					sap.m.MessageBox.error("Comprimento da Embalagem não informado!");
					This.getView().byId("TabFilterOutros").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("4");
					return;
				} else {
					This.getView().byId("TabFilterOutros").setIconColor();
				}

				if (oEntry.VolumEmb === "") {
					This.getView().byId("IdVolumEmb").setValueState("Error");
					sap.m.MessageBox.error("Volume da Embalagem não informado!");
					This.getView().byId("TabFilterOutros").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("4");
					return;
				} else {
					This.getView().byId("TabFilterOutros").setIconColor();
				}

				if (oEntry.TpCarreg === "") {
					This.getView().byId("IdTpCarreg").setValueState("Error");
					sap.m.MessageBox.error("Tipo de Carregamento não informado!");
					This.getView().byId("TabFilterOutros").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("4");
					return;
				} else {
					This.getView().byId("TabFilterOutros").setIconColor();
				}

				if (oEntry.TpVeiculo === "") {
					This.getView().byId("IdTpVeiculo").setValueState("Error");
					sap.m.MessageBox.error("Tipo de Veiculo não informado!");
					This.getView().byId("TabFilterOutros").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("4");
					return;
				} else {
					This.getView().byId("TabFilterOutros").setIconColor();
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

				if (oEntry.ComprReboq === "") {
					This.getView().byId("IdComprReboq").setValueState("Error");
					sap.m.MessageBox.error("Comprimento do reboque não informado!");
					This.getView().byId("TabFilterOutros").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("4");
					return;
				} else {
					This.getView().byId("TabFilterOutros").setIconColor();
				}

				if (oEntry.RotCarreg === "") {
					This.getView().byId("IdRotCarreg").setValueState("Error");
					sap.m.MessageBox.error("Rotina de carregamento não informado!");
					This.getView().byId("TabFilterOutros").setIconColor("Negative");
					This.getView().byId("iconTabBar").setSelectedKey("4");
					return;
				} else {
					This.getView().byId("TabFilterOutros").setIconColor();
				}

				// Fim - Outros
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

			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: "Confirma a criação da solicitação?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function() {
						oModel.update(Key, oEntry, {
							success: function(oData, oResponse) {
								sap.m.MessageBox.success("Solicitação criada com sucesso!");
								This.getRouter().navTo("BackAddSol");
							},
							error: function(oError) {
								sap.m.MessageBox.error("Erro ao chamar o serviço");
							}
						});
						dialog.close();
					}
				}),
				endButton: new Button({
					text: "Não",
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

		onChangeZone1O: function() {
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

		},
		onChageZone1D: function() {
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
		},

		onChangePerigoso: function() {
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
		},

		onChangeTpEmbalagem: function() {
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

		onChangeTpCarregamento: function() {
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

		onChangeIdDescMaterial: function() {
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

		onChangeTpVeiculo: function() {
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

		onChangeMengeUnit: function() {
			var Quantidade = this.getView().byId("IdMengeUnit").getValue();
			var PesoUnit = this.getView().byId("IdPesoUnit").getValue();
			var Total = 0;

			if (Quantidade !== "") {
				this.getView().byId("IdMengeUnit").setValue(Quantidade);

				if (PesoUnit !== "") {
					Total = Quantidade * PesoUnit;

					this.getView().byId("IdPesoTotal").setValue(Total);
				}
			}
		},

		onChangePesoUnit: function() {
			var Quantidade = this.getView().byId("IdMengeUnit").getValue();
			var PesoUnit = this.getView().byId("IdPesoUnit").getValue();
			var Total = 0;

			if (PesoUnit !== "") {
				this.getView().byId("IdPesoUnit").setValue(PesoUnit);

				if (Quantidade !== "") {
					Quantidade = parseFloat(Quantidade);
					Total = Quantidade * PesoUnit;
					this.getView().byId("IdPesoTotal").setValue(Total);
				}
			}
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

		onBeforeUploadStarts: function(oEvent) {

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

		ondeletePress: function(oEvent) {
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

		onChangeInput: function(oEvent) {
			var id = oEvent.getParameters().id;
			id = id.substring(46);
			var Input = this.getView().byId(id).getValue();

			if (Input !== "") {
				this.getView().byId(id).setValueState("None");
			}
		}
	});
});