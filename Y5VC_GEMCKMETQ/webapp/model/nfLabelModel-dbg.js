sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel",
	"./baseObjectModel"
], function(Object, JSONModel, BaseObject) {
  "use strict";
  return BaseObject.extend("com.sap.build.standard.operadorLogistico.model.NFLabelModel", {
  			
  	
  			constructor: function(vChvnfe){
  				BaseObject.call(this);
  				this.setChvnfe(vChvnfe);
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

			setNretq: function(vNretq){
  				this.nretq = vNretq;
  			},
  			setChvnfe: function(vChvnfe){
  				this.chvnfe = vChvnfe;
  			},
  			setItmnum: function(vItmnum){
  				this.itmnum = vItmnum;	
  			},
  			setCatEtq: function(vCatEtq){
  				this.catetq = vCatEtq;
  			},
  			setStatus: function(vStatus){
  				this.status = vStatus;
  			},
  			setMenge: function(vMenge){
  				this.menge = vMenge;
  			},
  			setMeins: function(vMeins){
  				this.meins = vMeins;
  			},
  			setCheckBox: function(vCheckBox){
  				this.checkbox = vCheckBox;	
  			},
  			
  			getStatus: function(vStatus){
  				return this.status;
  			}
		});
});
