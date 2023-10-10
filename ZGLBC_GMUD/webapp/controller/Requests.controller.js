sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	var mudanca;
	var request;
	var sistema;

	return Controller.extend("Charm.controller.Requests", {

		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Request").attachPatternMatched(this._onObjectMatched, this);
		},
		
		_onObjectMatched: function (oEvent) {
/*			this.getView().bindElement({
				path: "/" + oEvent.getParameter("arguments").invoicePath,
				model: "invoice"
			});*/
			mudanca = oEvent.getParameter("arguments").mudanca;
			request = oEvent.getParameter("arguments").request;
			sistema = oEvent.getParameter("arguments").sistema;
			this.getDadosECC("buscaObjetosRequest");
		},
		
		onBack: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Detalhe",{ mudanca: mudanca });
		},

		getDadosECC: function(parametro){
			
			var oModel = this.getOwnerComponent().getModel("Request");
			var oDataURL;
			var expand = null;
			var that = this;
			
		//  Busca Mudança
			if(parametro === "buscaObjetosRequest"){
				oDataURL  = "/ETS_RequestObjects(Request='" + request + "',Sistema='" + sistema + "',Mudanca='" + mudanca +  "')";
				expand = "objetosRequest";
			}

			oModel.removeData();
			that.setLoading(true);
			oModel.read(oDataURL, {
				urlParameters: { "$expand": expand },
				method: "GET",
				success: function (data) {
					var oModel2      = new sap.ui.model.json.JSONModel(data);
					if(data.Request === "*"){
						data.Request = "Objetos - Mudança " + mudanca; 
					}
					that.getView().setModel(oModel2,"objetosRequest");
					that.setLoading(false);
				},
				error: function () {
					sap.m.MessageToast.show("Erro na conexão com o ECC");
					that.setLoading(false);
				}
			});
		},
		
		setLoading: function(loading){
/*			var loadPage      = document.querySelector("loading");
			var loadPageBlack = document.querySelector("loadingBlack");
			if(loading){
				loadPage.classList.remove("popup__disable");
				loadPageBlack.classList.remove("popup__disable");
			}
			else{
				loadPage.classList.add("popup__disable");
				loadPageBlack.classList.add("popup__disable");
			}*/
			
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
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf Charm.view.Requests
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf Charm.view.Requests
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf Charm.view.Requests
		 */
		//	onExit: function() {
		//
		//	}

	});

});