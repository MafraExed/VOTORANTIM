sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	var mudanca;

	return Controller.extend("Charm.controller.Detalhe", {

		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Detalhe").attachPatternMatched(this._onObjectMatched, this);
		},
	
		
		_onObjectMatched: function (oEvent) {
			
			var that = this;
			
/*			this.getView().bindElement({
				path: "/" + oEvent.getParameter("arguments").invoicePath,
				model: "invoice"
			});*/
			
			var panels = ["idPanelDadosGerais","idPanelTexto","idPanelTransportes","idPanelAnexos"];
			panels.forEach(function(idPanel){
				var panel = that.getView().byId(idPanel);
				panel.setExpanded(false);
			});
			
			mudanca = oEvent.getParameter("arguments").mudanca;
			this.getDadosECC("buscaMudanca");
		},
		
		addBrowserEvents: function(){
			var that = this;
			var labelAcao = this.getView().byId("idLabelAcao");
			labelAcao.attachBrowserEvent("click",function(){
				that.onBtnAcao();
			});
			labelAcao = this.getView().byId("idHboxAcoes");
			labelAcao.attachBrowserEvent("click",function(){
				that.onBtnAcao();
			});
			
		},
		
		getDadosECC: function(parametro){
			
			var oModel = this.getOwnerComponent().getModel();
			var oDataURL;
			var expand = null;
			var that = this;
			var oLocalModel;
			
		//  Busca Mudança
			if(parametro === "buscaMudanca"){
				oDataURL  = "/ETS_DadosGerais(Mudanca='" + mudanca + "',Request='',DataCriacao='')";
				expand = "dadosGeraisToRequest,dadosGeraisToTexto,dadosGeraisToRequest,dadosGeraisToAnexos";
			}
			if(parametro === "buscaAcoes"){
				oDataURL  = "/ETS_DadosGerais(Mudanca='" + mudanca + "',Request='',DataCriacao='')";
				expand = "dadosGeraisToAcoes";
			}

			oModel.removeData();
			that.setLoading(true);
			oModel.read(oDataURL, {
				urlParameters: { "$expand": expand },
				method: "GET",
				success: function (data) {
					if(parametro === "buscaMudanca"){
						oLocalModel  = new sap.ui.model.json.JSONModel(data);
						that.getView().setModel(oLocalModel,"dadosGerais");
						that.setText(data.dadosGeraisToTexto);
					}
					if(parametro === "buscaAcoes"){
						oLocalModel  = new sap.ui.model.json.JSONModel(data);
						that.getView().setModel(oLocalModel,"Acoes");
						
						if(data.dadosGeraisToAcoes.results.length > 0){
						
							var blackScreen   = document.querySelector(".popover__black");
							var statusPopover = document.querySelector(".popover__status");
							blackScreen.classList.remove("popup__disable");
							statusPopover.classList.remove("popup__disable");
						}
						else{
							that.showPopup("Nenhuma ação disponível para essa mudança");
						}
					}
					that.setLoading(false);
				},
				error: function () {
					sap.m.MessageToast.show("Erro na conexão com o ECC");
					that.setLoading(false);
				}
			});
		},
		
		showPopup: function(text){
			
			var that = this;
			var dialog;
			
			dialog = new sap.m.Dialog({
				showHeader: false,
				content: new sap.m.Text({
					text: text
				}).addStyleClass("dialog__text"),
				beginButton: new sap.m.Button({
					text: "Fechar",
					press: function () {
						dialog.close();
					}.bind(that)
				})
			});

			//to get access to the global model
			that.getView().addDependent(dialog);
			
		
			dialog.open();	
		},
		
		setDadosECC: function(parametro,data){
			
			var oModel			 = this.getOwnerComponent().getModel();
			var oRequestData	 = {};
			var oDataURL;
			var that = this;
			

			if(parametro === "setAcao"){
				oRequestData.Mudanca = mudanca;
				oRequestData.Type = data;
				oDataURL		 = "/ETS_Acoes(Mudanca='" + mudanca + "')";
			}

/*			oModel.update(oDataURL, oRequestData, null, function(oData, oResponse){
					sap.m.MessageToast.show("SUCESSO");
    			},function(oData, oResponse){
    				sap.m.MessageToast.show("Erro na conexão com o ECC");
			});*/
			that.setLoading(true);
			oModel.update(oDataURL, oRequestData, {
			       async : false,
			       success : function(oData, response) {
			    	
			    	  	that.setLoading(false);
			       		if(response.headers.msg){
			       			that.showPopup(decodeURIComponent(response.headers.msg));
			       		}
			       		else{
							var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
							oRouter.navTo("Resultado");
			       		}
			       },
			       error : function(oError) {
			       		that.setLoading(false);
			            sap.m.MessageToast.show("Erro na resposta do CHARM");
			            
					}
			  });
			  
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
		
		setText: function(textos){
			var htmlText = "";
			var textControl;
			
			textos.results.forEach(function(texto){
				if(texto.Format === "T"){
					texto.Line = "<H4> <strong>" + texto.Line + "</strong> </H4>";
				}
				htmlText = htmlText + texto.Line + "<br/>";
			});	
			textControl = this.getView().byId("idText");
			textControl.setHtmlText(htmlText);
		},
		
		onBtnAcao: function(){
			//sap.ui.getCore().byId("__xmlview4").getController().getDadosECC("buscaAcoes");
			this.getDadosECC("buscaAcoes");
		},
		
		onAcaoSelected: function(oEvent){
			
			var that = this;
			var source = oEvent.getSource();
			var dialog;
			
		
			dialog = new sap.m.Dialog({
				showHeader: false,
				content: new sap.m.Text({
					text: "Deseja realmente alterar o status da mudança?"
				}).addStyleClass("dialog__text"),
				beginButton: new sap.m.Button({
					text: "Sim",
					type: "Accept",
					press: function () {
						dialog.close();
						that.closeStatusPopover();
						that.setDadosECC("setAcao",source.getParent().getItems()[2].getText());
					}.bind(that)
				}),
				endButton: new sap.m.Button({
					text: "Cancelar",
					type: "Reject",
					press: function () {
						dialog.close();
						that.closeStatusPopover();
					}.bind(that)
				})
			});

			//to get access to the global model
			that.getView().addDependent(dialog);
			
		
			dialog.open();	
		},
		
		onExibeTodosObjetos: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Request",{ mudanca: mudanca,
			                          request: "*",
			                          sistema: "*" });
		},
		
		closeStatusPopover: function(){
			var blackScreen = document.querySelector(".popover__black");
			blackScreen.classList.add("popup__disable");
			var statusPopover = document.querySelector(".popover__status");
			statusPopover.classList.add("popup__disable");
		},
		

		onBack: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Main");
		},
		
		handleRequestSelected: function(oEvent){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Request",{ mudanca: mudanca,
			                          request: oEvent.getSource().getContent()[0].getItems()[0].getItems()[0].getItems()[1].getText(),
			                          sistema: oEvent.getSource().getContent()[0].getItems()[2].getText() });
		},

		//	onBeforeRendering: function() {
		//
		//	},

		onAfterRendering: function() {
			
			this.addBrowserEvents();
			
			var that = this;
			var panels = document.querySelectorAll(".sapMPanelHdr");
			var parent;
			var counter = 0;
			var id = "";
			panels.forEach(function(panel){
				panel.addEventListener("click",function(e){
					parent = e.target.parentNode;
					while(counter < 10){
						parent = parent.parentNode;
						if(parent.id.indexOf("idPanelDadosGerais") !== -1){
							id = "idPanelDadosGerais";
							break;
						}
						if(parent.id.indexOf("idPanelTexto") !== -1){
							id = "idPanelTexto";
							break;
						}
						if(parent.id.indexOf("idPanelTransportes") !== -1){
							id = "idPanelTransportes";
							break;
						}
						if(parent.id.indexOf("idPanelAnexos") !== -1){
							id = "idPanelAnexos";
							break;
						}
						counter += 1;
					}
					
					var panelControl = that.getView().byId(id);
	
					if(panelControl.getExpanded()){
						panelControl.setExpanded(false);
					}
					else{
						panelControl.setExpanded(true);
					}
				});
			});
		}
			

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf Charm.view.Detalhe
		 */
		//	onExit: function() {
		//
		//	}

	});

});