sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel",
	"./baseObjectModel",
	"./nfHeaderModel",
	"./nfItemModel"
], function (Object, JSONModel, BaseObject, NfHeaderModel, NfItemModel) {
	"use strict";
	const cService = "/ZET_VCMM_NFHEADERSet";
	const cNavHeadToItem = "NAVHEADITEM";

	var instance;
	var nfHeaderList = BaseObject.extend("com.sap.build.standard.operadorLogistico.model.NFHeaderListModel", {
		constructor: function () {
			BaseObject.call(this);
			this.nfHeaderList = [];
		},
		addNF: function (oNfHeader) {
			// Verifica se chave de acesso já foi inserida anteriormente
			if (!this.findByChvnfe(oNfHeader.chvnfe)) {
				this.nfHeaderList.push(oNfHeader);
			}
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

		cSuccess: function (oDataret, oResponse, cSuccess, oView, vChvNfe) {

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
				this.readNfHeaderByChvNfe(oView, cSuccess, vChvNfe);
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
			

			if (oResult.NAVHEADITEM) {
				for (let oResultItem of oResult.NAVHEADITEM.results) {
					let oNfItem = new NfItemModel(oResultItem.Chvnfe, oResultItem.Itmnum);
					oNfItem.setMatnr(oResultItem.matnr);
					oNfItem.setMaktx(oResultItem.maktx);
					oNfItem.setWerks(oResultItem.werks);
					oNfItem.setEbeln(oResultItem.ebeln);
					oNfItem.setEbelp(oResultItem.ebelp);
					oNfItem.setMeins(oResultItem.meins);
					oNfItem.setMenge(oResultItem.menge);
					oNfItem.setMengeEtq(oResultItem.mengeEtq);
					oNfItem.setMengeConf(oResultItem.mengeConf);
					oNfItem.setMengeMat(oResultItem.mengeMat);
					oNfItem.setNfnet(oResultItem.nfnet);
					oNfItem.setIcon(oResultItem.icon);
					oNfItem.setStatus(oResultItem.status);
					oNfHeader.addNfItem(oNfItem);
				}
			}
		},
		// Read Memory
		readNfHeaderByChvNfe: function (oView, cSuccess, vChvNfe) {
			// Procura nota Fiscal na Lista
			let oNfHeader = this.findByChvnfe(vChvNfe);
			if (oNfHeader) {
				cSuccess(oView, oNfHeader.getModel(), oNfHeader.getNfItemModelList());
				return;
			} else {
				// Não encontrou Nota Fiscal, insere na Lista
				this.addNF(new NfHeaderModel(vChvNfe, "Pendente"));
				// Recupera dados do backend
				this.readEntitiesByChvNFe(oView, cSuccess, vChvNfe);
			}

		},

		// Read Backend
		readEntityByChvNFeSingle: function (oView, cSuccess) {

		},

		readData: function (oView, cSuccess, aFilters, vChvNfe) {

			var oModel = oView.getModel("NFHEADER");
			var mySelf = this;

			//Faz Requisição ao backend
			oModel.read(cService, {
					filters: aFilters,
					urlParameters: {
						$expand: cNavHeadToItem
					},
					success: (oDataret, oResponse) => {
						mySelf.cSuccess(oDataret, oResponse, cSuccess, oView, vChvNfe);
					},
					error: function (oError) {
						// Error Handling Here
					}
				}

			);
		},

		// Read Backend
		readEntitiesByChvNFe: function (oView, cSuccess, vChvNfe) {

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
			this.readData(oView, cSuccess, aFilter);
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