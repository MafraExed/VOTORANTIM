sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel",
	"./baseObjectModel"
], function (Object, JSONModel, BaseObject) {
	"use strict";
	return BaseObject.extend("com.sap.build.standard.operadorLogistico.model.NFLabelScanModel", {

		constructor: function (vNRETQ) {
			BaseObject.call(this);
			this.setNretq(vNRETQ);
		},
		getChvnfe: function () {
			return this.chvnfe;
		},
		getStructure: function () {
			return {
				"Chvnfe": this.chvnfe,
				"Fornecedor": this.fornecedor,
				"FornecedorNome": this.fornecedorNome,
				"Bukrs": this.bukrs,
				"Branch": this.branch,
				"Nfenum": this.nfenum,
				"Series": this.series,
				"StatusNfe": this.statusNfe,
				"StatusInt": this.statusInt,
				"StatusIcon": this.statusIcon,
				"StatusColor": this.statusColor,
				"DescricaoFilial": this.descricaoFilial,
				"DocDat": this.docDat
			};
		},

		setNretq: function (vNretq) {
			this.nretq = vNretq;
		},
		setEbeln: function (vEBELN) {
			this.EBELN = vEBELN;
		},
		setEbelp: function (vEBELP) {
			this.EBELP = vEBELP;
		},
		setName1: function (vNAME1) {
			this.NAME1 = vNAME1;
		},
		setMatnr: function (vMATNR) {
			this.MATNR = vMATNR;
		},
		setMaktx: function (vMAKTX) {
			this.MAKTX = vMAKTX;
		},
		setMenge: function (vMENGE) {
			this.MENGE = vMENGE;
		},
		setMeins: function (vMEINS) {
			this.MEINS = vMEINS;
		},
		setCheckBox: function (vCheckBox) {
			this.checkbox = vCheckBox;
		},
		setChvnfe: function (vChvnfe) {
			this.chvnfe = vChvnfe;
		},
		setItmnum: function (vItmnum) {
			this.itmnum = vItmnum;
		},

		getStatus: function (vStatus) {
			return this.status;
		}
	});
});