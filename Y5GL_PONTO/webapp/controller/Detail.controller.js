sap.ui.define([
	"Y5GL_PONTO/Y5GL_PONTO/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/library"
], function (BaseController, JSONModel, formatter, mobileLibrary) {
	"use strict";
	return BaseController.extend("Y5GL_PONTO.Y5GL_PONTO.controller.Detail", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit : function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
				busy : false,
				delay : 0
			});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			this.setModel(oViewModel, "detailView");

			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
			
			// Image loading
			var sRootPath = jQuery.sap.getModulePath("Y5GL_PONTO.Y5GL_PONTO");
			var sImagePath = sRootPath + "/imagens/Transparente_CBA.gif";
			this.getView().byId("idimg").setSrc(sImagePath);
		},

		_onObjectMatched : function (oEvent) {
			this.getView().byId("pages").scrollTo(0, 0);
			var n = this.getView().byId("html");
			var o = n.getContent();
			if (o !== "") {
				n.setContent("");
			} 
			var Periodo = oEvent.getParameter("arguments").Periodo;
			var Tipo = oEvent.getParameter("arguments").Tipo;
			var Check = oEvent.getParameter("arguments").Check;
			var Pernr = " ";
			
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then( function() {
				var sObjectPath = this.getModel().createKey("ZET_GLHR_HTML5_DETAILSet", {
					Periodo: Periodo,
					Tipo: Tipo,
					Check: Check,
					Pernr: Pernr
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

	
		_bindView : function (sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getView().getModel();
			var that = this;

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);

			this.getView().bindElement({
				path : sObjectPath,
				events: {
					change : this._onBindingChange.bind(this),
					dataRequested : function () {
						that.loading(true);
					},
					dataReceived: function () {
						that.loading(false);
					}
				}
			});
		},

		_onBindingChange : function () {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();
			var html = this.getView().byId("html").getContent();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}
		},

		_onMetadataLoaded : function () {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("detailView");

			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);

			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		},
		
		onVoltar: function(){
			this.getRouter().navTo("master");
		}
	});

});