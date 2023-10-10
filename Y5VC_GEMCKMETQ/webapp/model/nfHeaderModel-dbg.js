sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel",
	"./baseObjectModel"
], function(Object, JSONModel, BaseObject) {
  "use strict";
  return BaseObject.extend("com.sap.build.standard.operadorLogistico.model.NFHeaderModel", {
  			
  	
  			constructor: function(chvNfe,statusNfe){
  				BaseObject.call(this);
  				this.chvnfe = chvNfe;
  				this.statusNfe = statusNfe;
  				this.nfItemList = [];
  				this.nfLabelList = [];
  				this.nfLabelScanList = [];
  			},
  			setValues: function(fornecedor,fornecedorNome, bukrs, branch, nfenum, series, statusNfe, statusInt, statusIcon, statusColor, descricaoFilial, docDat){
				this.fornecedor     	= fornecedor;
				this.fornecedorNome 	= fornecedorNome;
				this.bukrs				= bukrs;
				this.branch         	= branch; 
				this.nfenum 	    	= nfenum;
				this.series 	    	= series;
				this.statusNfe      	= statusNfe;
				this.statusInt	    	= statusInt;
				this.statusIcon			= statusIcon;
				this.statusColor    	= statusColor;
				this.descricaoFilial	= descricaoFilial;
				this.docDat			    = docDat;
  			},
  			getChvNfe: function(){
  				return this.chvnfe;
  			},
  			getItens: function(){
  				return this.nfItemList;
  			},
  			getStructure: function(){
  				return { 
  					"Chvnfe":			 this.chvnfe,
					"Fornecedor":		 this.fornecedor,          
					"FornecedorNome":	 this.fornecedorNome,
					"Bukrs":			 this.bukrs,
					"Branch":			 this.branch,
					"Nfenum" :			 this.nfenum,
					"Series" :			 this.series,
					"StatusNfe":		 this.statusNfe,
					"StatusInt":		 this.statusInt,
					"StatusIcon":		 this.statusIcon,
					"StatusColor":		 this.statusColor,
					"DescricaoFilial":   this.descricaoFilial,
					"DocDat":   		 this.docDat
  				};
  			},
  			addNfItem: function(oNfItem){
  				this.nfItemList.push(oNfItem);
  			},
  			getNfItemModelList: function(){
  				return new JSONModel(this.nfItemList);
  			},
  			addNfLabel: function(oNfLabel){
  				this.nfLabelList.push(oNfLabel);
  			},
  			getNfLabelModelList: function(){
  				return new JSONModel(this.nfLabelList);
  			},
  			addNfLabelScan: function(oNfLabelScanList){
  				this.nfLabelScanList.push(oNfLabelScanList);
  			},
  			getNfLabelScanModelList: function(){
  				return new JSONModel(this.nfLabelScanList);
  			},
  			setFornecedor: function(vFornecedor){
				this.fornecedor     	= vFornecedor;  				
  			},
			setFornecedorNome: function(vFornecedorNome){
				this.fornecedorNome 	= vFornecedorNome;
			},
			setBukrs: function(vBukrs){
				this.bukrs				= vBukrs;
			},
			setBranch: function(vBranch){
				this.branch         	= vBranch; 
			},
			setNfenum: function(vNfenhum){
				this.nfenum 	    	= vNfenhum;
			},
			setSeries: function(vSeries){
				this.series 	    	= vSeries;
			},
			setStatusNfe: function(vStatusNfe){
				this.statusNfe      	= vStatusNfe;
			},
			setStatusInt: function(vStatusInt){
				this.statusInt	    	= vStatusInt;
			},
			setStatusIcon: function(vStatusIcon){
				this.statusIcon			= vStatusIcon;
			},
			setStatusColor: function(vStatusColor){
				this.statusColor    	= vStatusColor;
			},
			setDescricaoFilial: function(vDescricaoFilial){
				this.descricaoFilial	= vDescricaoFilial;	
			},
			setDocDat: function(vDocDat){
				this.docDat			    = vDocDat;
			},
			setCnpjFilial: function(vCnpjFilial){
				this.cnpjFilial = vCnpjFilial;
			},
			setCnpjFornecedor: function(vCnpjFornecedor){
				this.cnpjFornecedor = vCnpjFornecedor;
			},
			setMoeda: function(vMoeda){
				this.moeda = vMoeda;
			},
			setNfTot: function(vNfTot){
				this.nfTot = vNfTot;
			}
		});
});
