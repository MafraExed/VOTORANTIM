sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel",
	"./baseObjectModel",
	"./nfHeaderModel",
	"./nfItemModel",
	"../controller/utilities"
], function (Object, JSONModel, BaseObject, NfHeaderModel, NfItemModel, Utilities) {
	"use strict";
	const cService = "/ZET_VCMM_NFHEADERSet";
	const cNavHeadToItem = "NAVHEADITEM";

	var instance;
	var nfHeaderList = BaseObject.extend("com.sap.build.standard.operadorLogistico.model.NFHeaderListModel", {
		constructor: function () {
			BaseObject.call(this);
			this.nfHeaderList = [];
		},
		destroy: function(){
			this.nfHeaderList = [];
		},
		
		addNF: function (oNfHeader) {
			// Verifica se chave de acesso já foi inserida anteriormente
			if (!this.findByChvnfe(oNfHeader.chvnfe)) {
				this.nfHeaderList.push(oNfHeader);
			}
		},
		clearList: function(){
			this.nfHeaderList = [];
		},
		getModelList: function () {
			return new JSONModel(this.nfHeaderList);
		},
		findByChvnfe: function (vChvNfe) {
			return this.nfHeaderList.find(oNfHeader => oNfHeader.chvnfe === vChvNfe);
		},
		getNfItemModelList: function (vChvNfe) {
			var oNfHeader = this.findByChvnfe(vChvNfe);
			return oNfHeader.getNfItemModelList();
		},
		getLines: function () {
			return this.nfHeaderList.length;
		},

		cSuccess: function (oDataret, oResponse, cSuccess, cError, oView, vChvNfe) {

			// Atualiza Lista de Notas Fiscais
			for (let oResult of oDataret.results) {

				if (!this.findByChvnfe(oResult.Chvnfe)) {
					this.addNF(new NfHeaderModel(oResult.Chvnfe, "Pendente"));
				}
 
				for (let oNfHeader of this.nfHeaderList) {

					if (oResult.Chvnfe === oNfHeader.getChvNfe()) {
						// Atualiza modelo com informações recuperadas do backend
						this.updateNfHeaderFromResult(oNfHeader,oResult);
						break;
					}
				}
			}
			if (vChvNfe) {
				this.readNfHeaderByChvNfe(oView, cSuccess, cError, vChvNfe);
			} else {
				cSuccess(oView, this.getModelList());
			}
		},
		updateNfHeaderFromResult: function (oNfHeader, oResult) {
			oNfHeader.setFornecedor(oResult.fornecedor);
			oNfHeader.setFornecedorNome(oResult.fornecedorNome);
			oNfHeader.setBukrs(oResult.bukrs);
			oNfHeader.setBranch(oResult.branch);
			oNfHeader.setNfenum(oResult.nfenum);
			oNfHeader.setSeries(oResult.series);
			oNfHeader.setStatusNfe(oResult.statusNfe);
			oNfHeader.setStatusInt(oResult.statusInt);
			oNfHeader.setStatusIcon(oResult.statusIcon);
			oNfHeader.setStatusIcon(oResult.statusIcon);
			oNfHeader.setStatusColor(oResult.statusColor);
			oNfHeader.setDescricaoFilial(oResult.descricaoFilial);
			oNfHeader.setDocDat(oResult.docDat);
			oNfHeader.setCnpjFilial(oResult.cnpjFilial);
			oNfHeader.setCnpjFornecedor(oResult.cnpjFornecedor);
			oNfHeader.setMoeda(oResult.moeda);
			oNfHeader.setNfTot(oResult.nfTot);
			oNfHeader.setEtapa(oResult.etapa);
			oNfHeader.setStatusNfeDescr(oResult.statusNfeDescr);
			oNfHeader.setVol(oResult.vol);
			

		
		},
		// Read Memory
		readNfHeaderByChvNfe: function (oView, cSuccess, cError, vChvNfe) {
			// Procura nota Fiscal na Lista
			let oNfHeader = this.findByChvnfe(vChvNfe);
			if (oNfHeader) {
				cSuccess(oView, oNfHeader.getModel(), oNfHeader.getNfItemModelList());
				return;
			} else {
				// Não encontrou Nota Fiscal, insere na Lista
				this.addNF(new NfHeaderModel(vChvNfe, "Pendente"));
				// Recupera dados do backend
				this.readEntitiesByChvNFe(oView, cSuccess, cError, vChvNfe);
			}

		},

		// Read Backend
		readEntityByChvNFeSingle: function (oView, cSuccess) {

		},

		readData: function (oView, cSuccess, cError, aFilters, vChvNfe) {

			var oModel = oView.getModel("NFHEADER");
			var mySelf = this;
			oModel.setHeaders(Utilities.getRoleHeaders(oView));
			//Faz Requisição ao backend
			oModel.read(cService, {
					filters: aFilters,
					success: (oDataret, oResponse) => {
						mySelf.cSuccess(oDataret, oResponse, cSuccess, cError, oView, vChvNfe);
					},
					error: function (oError) {
						cError(oView,oError);
					}
				}

			);
		},

		// Read Backend
		readEntitiesByChvNFe: function (oView, cSuccess, cError, vChvNfe) {

			var aFilter = [];
			var oModel = oView.getModel("NFHEADER");
			var mySelf = this;
			var sFilter = {};

			if (vChvNfe) {
				// Monta Filtro
				sFilter = new sap.ui.model.Filter({
					path: "Chvnfe",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: vChvNfe
				});
				aFilter.push(sFilter);
			} else {
				for (let oNfHeader of this.nfHeaderList) {

					// Monta Filtro
					sFilter = new sap.ui.model.Filter({
						path: "Chvnfe",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: oNfHeader.getChvNfe()
					});

					aFilter.push(sFilter);
				}
			}
			this.readData(oView, cSuccess, cError, aFilter);
		},
		
		size: function(){
			return this.nfHeaderList.length;
		}
	});

	return {
		getInstance: function () {
			if (!instance) {
				instance = new nfHeaderList();
			}
			return instance;
		}
	};

});