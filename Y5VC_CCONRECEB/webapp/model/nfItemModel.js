sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel",
	"./baseObjectModel"
], function(Object, JSONModel, BaseObject) {
  "use strict";
  return BaseObject.extend("com.sap.build.standard.operadorLogistico.model.NFItemModel", {
  			
  	
  			constructor: function(vChvnfe,vItmnum){
  				BaseObject.call(this);
  				this.setChvnfe(vChvnfe);
  				this.setItmnum(vItmnum);
  			},
  			getChvnfe: function(){
  				return this.chvnfe;
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
  			setChvnfe: function(vChvnfe){
  				this.chvnfe = vChvnfe;
  			},
  			setItmnum: function(vItmnum){
  				this.itmnum = vItmnum;	
  			},
  			setMatnr: function(vMatnr){
  				this.matnr = vMatnr;
  			},
  			setMaktx: function(vMaktx){
  				this.maktx = vMaktx;	
  			},
  			setWerks: function(vWerks){
  				this.werks = vWerks;
  			},
  			setEbeln: function(vEbeln){
  				this.ebeln = vEbeln;
  			},
  			setEbelp: function(vEbelp){
  				this.ebelp = vEbelp;
  			},
  			setMeins: function(vMeins){
  				this.meins = vMeins;
  			},
  			setMenge: function(vMenge){
  				this.menge = vMenge;
  			},
  			setMengeEtq: function(vMengeEtq){
  				this.mengeEtq = vMengeEtq;
  			},
  			setMengeConf: function(vMengeConf){
  				this.mengeConf = vMengeConf;	
  			},
  			setMengeMat: function(vMengeMat){
  				this.mengeMat = vMengeMat;
  			},
  			setIcon: function(vIcon){
  				this.icon = vIcon;
  			},
  			setStatus: function(vStatus){
  				this.status = vStatus;
  			},
  			setNfnet: function(vNfnet){
  				this.nfnet = vNfnet;
  			}
		});
});
