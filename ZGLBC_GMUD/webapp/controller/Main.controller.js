sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	var init = true;

	return Controller.extend("Charm.controller.Main", {

		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Main").attachPatternMatched(this._onObjectMatched, this);
		},
			
		_onObjectMatched: function (oEvent) {
			
			var that = this;
			
/*			this.getView().bindElement({
				path: "/" + oEvent.getParameter("arguments").invoicePath,
				model: "invoice"
			});*/
			
		//	var action = oEvent.getParameter("arguments").action;
			if(init){
				this.getDadosECC("Pesquisas");
				init = false;
			}
			else{
				this.resetFields();
				var dynamicPage = that.getView().byId("dynamicPageId");
				dynamicPage.setHeaderExpanded(true);
				that.getView().byId("listNfe").setVisible(false);
			}
		},
			
		resetFields: function(){
			
			var that = this;
			var control;
			var Controls  = ["inpMudc","inpReq","inpCriadoEm", "inpCriadoAte"];
			
			Controls.forEach(function(input){
				control = that.getView().byId(input);
				control.setValue("");
			});
			
			control = that.getView().byId("listNfe");
			control.destroyItems();
			
		},	
		
		getDadosECC: function(parametro,data){
			
			var oModel = this.getOwnerComponent().getModel();
			var oDataURL;
			var expand = null;
			var key = [];
			var that = this;
			
		//  Busca Mudança
			if(parametro === "buscaMudanca"){
				key = this.getKey();
				oDataURL  = "/ETS_DadosGerais(Mudanca='" + key[0].trim() + "',Request='" + key[1].trim() + "',DataCriacao='" + key[2].trim() + "')";
				expand = "dadosGerais";
				this.setLoading(true);
			}
			if(parametro === "Pesquisas"){
				key = this.getKey();
				oDataURL  = "/ETS_PesquisaAvancada";
			}
			if(parametro === "executaPesquisa"){
				key = this.getKey();
				oDataURL  = "/ETS_PesquisaAvancada(Guid='" + data + "')";
				expand = "pesquisaToDadosGerais";
				this.setLoading(true);
			}
			
			oModel.removeData();
			if(expand !== null){
				oModel.read(oDataURL, {
					urlParameters: { "$expand": expand },
					method: "GET",
					success: function (data) {
						var oModel2;
						if(parametro === "buscaMudanca"){
							oModel2  = new sap.ui.model.json.JSONModel(data.dadosGerais);
							that.getView().setModel(oModel2,"dadosGerais");
							if(data.dadosGerais.results.length > 0){
								var dynamicPage = that.getView().byId("dynamicPageId");
								dynamicPage.setHeaderExpanded(false);
								that.getView().byId("listNfe").setVisible(true);
							}
							else{
								sap.m.MessageToast.show("Nenhuma mudança encontrada");
								var dynamicPage = that.getView().byId("dynamicPageId");
								dynamicPage.setHeaderExpanded(true);
								that.getView().byId("listNfe").setVisible(false);
							}
								
						}
						else{
							oModel2  = new sap.ui.model.json.JSONModel(data.pesquisaToDadosGerais);
							that.getView().setModel(oModel2,"dadosGerais");
							if(data.pesquisaToDadosGerais.results.length > 0){
								var dynamicPage = that.getView().byId("dynamicPageId");
								dynamicPage.setHeaderExpanded(false);
								that.getView().byId("listNfe").setVisible(true);
							}
							else{
								sap.m.MessageToast.show("Nenhuma mudança encontrada");
								var dynamicPage = that.getView().byId("dynamicPageId");
								dynamicPage.setHeaderExpanded(true);
								that.getView().byId("listNfe").setVisible(false);
							}
						}
						
						that.setLoading(false);
					},
					error: function () {
						sap.m.MessageToast.show("Erro na conexão com o ECC");
						that.setLoading(false);
					}
				});
			}
			else {
				oModel.read(oDataURL, {
					method: "GET",
					success: function (data) {
						var oModel2      = new sap.ui.model.json.JSONModel(data.results);
						that.getView().setModel(oModel2,"Pesquisas");
					},
					error: function () {
						sap.m.MessageToast.show("Erro na conexão com o ECC");
					}
				});	
				
			}
		},
		
		setLoading: function(loading){
			
			var loadPage      = this.getView().byId("loading");
			var loadPageBlack = this.getView().byId("loadingBlack");
			if(loading){
				loadPage.removeStyleClass("popup__disable");
				loadPageBlack.removeStyleClass("popup__disable");
			}
			else{
				loadPage.addStyleClass("popup__disable");
				loadPageBlack.addStyleClass("popup__disable");
			}
		},
		
		getKey: function(){
			var key = [];
			var mudanca = this.getView().byId("inpMudc").getValue();
			var request = this.getView().byId("inpReq").getValue();
			var dateFrom;
			var dateTo;
			var day;
			var month; 
			var year;
			var dateControl;
			
			key.push(mudanca);
			key.push(request);
			
			dateControl = this.getView().byId("inpCriadoEm");
			if(dateControl.getDateValue() !== null){
				day   = dateControl.getDateValue().getDate();
				if(day < 10){
					day = "0" + day;}
				month = dateControl.getDateValue().getMonth() + 1;
				if(month < 10){
					month = "0" + month;}
				year  = dateControl.getDateValue().getFullYear();
				dateFrom = year.toString() + month.toString() + day.toString();
			}
			else{
				dateFrom = null;
			}
				
			dateControl = this.getView().byId("inpCriadoAte");
			if(dateControl.getDateValue() !== null){
				day   = dateControl.getDateValue().getDate();
				if(day < 10){
					day = "0" + day;}
				month = dateControl.getDateValue().getMonth() + 1;
				if(month < 10){
					month = "0" + month;}
				year   = dateControl.getDateValue().getFullYear();
				dateTo = year.toString() + month.toString() + day.toString();
			}
			else{
				dateTo   = null;
			}
			
			key.push(dateFrom + ">" + dateTo);
			return key;
		},
		
		onSelectPesquisa: function(oEvent){
			this.getDadosECC("executaPesquisa",oEvent.getParameters().selectedItem.getKey());
			
			oEvent.getSource().setSelectedItem(null);
		},
			
		searchNF:function(){
			this.getDadosECC("buscaMudanca");
			
/*			var dynamicPage = this.getView().byId("dynamicPageId");
			dynamicPage.setHeaderExpanded(false);*/
			
/*			var listNfe = document.querySelector(".NfeList__mobile");
			listNfe.classList.add("NfeList__mobile__active");*/
		},
		
		onClickItem: function(oEvent){
			var list = oEvent.getSource();
			
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Detalhe",{ mudanca:list.getContent()[0].getItems()[0].getItems()[0].getItems()[0].getText() });
		},
		
		addBrowserEvents: function(){
			var that = this; 
			var footer;
			var inputControls = ["inpMudc",	"inpReq", "inpCriadoEm","inpCriadoAte"];
			var labelBusca = this.getView().byId("idLabelBusca");
			labelBusca.attachBrowserEvent("click",function(){
				that.searchNF(that); 
			});
			
			var hboxBusca = this.getView().byId("idHboxBusca");
			hboxBusca.attachBrowserEvent("click",function(){
				that.searchNF(that); 
			});
			
			inputControls.forEach(function(idControl){
				that.getView().byId(idControl).attachBrowserEvent("focusin",function(){ 
					footer = document.querySelector("footer");
					footer.classList.add("popup__disable");
				});
				that.getView().byId(idControl).attachBrowserEvent("focusout",function(){ 
					footer = document.querySelector("footer");
					footer.classList.remove("popup__disable");
				});
			});
		},
		
		onAfterRendering: function() {
			this.addBrowserEvents();
			var labelBusca = this.getView().byId("inpMudc");
			labelBusca.focus();
		}
				

	});

});