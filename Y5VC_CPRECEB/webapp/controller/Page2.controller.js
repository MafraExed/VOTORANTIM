sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"../model/nfHeaderModel",
	"../model/nfHeaderListModel",
	"../model/formatter",
	"sap/ui/core/UIComponent"
	
], function (BaseController, MessageBox, Utilities, History, NFHeaderModel, NFHeaderListModel,formatter, UIComponent) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.operadorLogistico.controller.Page2", {
		formatter: formatter,
		handleRouteMatched: function (oEvent) {
			var sAppId = "App5c06d9238147af3ab5537f2a";

			var oParams = {};
			
			if (oEvent.getParameter("data").chvNfe) {
				// Recupera instância do modelo
				this.getInstanceNfHeaderList();
				
				// Recupera Estrutura com dados da nota fiscal
				this._nFheaderList.readNfHeaderByChvNfe(this.getView(),this._onLoadSuccess,oEvent.getParameter("data").chvNfe);

			} else {
				if (this.getOwnerComponent().getComponentData()) {
					var patternConvert = function (oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype") {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};

					this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

				}
			}

			var oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}

		},
		_onNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = UIComponent.getRouterFor(this);
				oRouter.navTo("Page1", {}, true);
			}
		},
		_onLoadSuccess: function(oView, oModel, oModelItem){
			oView.setModel(oModel, "NFHEADER");
			oView.setModel(oModelItem, "NFITEMLIST");
		},
		
		_onFioriObjectPageHeaderPress: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			var oQueryParams = this.getQueryParameters(window.location);

			if (sPreviousHash !== undefined || oQueryParams.navBackToLaunchpad) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("default", true);
			}

		},
		
		getInstanceNfHeaderList: function(){
			this._nFheaderList = NFHeaderListModel.getInstance();
		},
		getQueryParameters: function (oLocation) {
			var oQuery = {};
			var aParams = oLocation.search.substring(1).split("&");
			for (var i = 0; i < aParams.length; i++) {
				var aPair = aParams[i].split("=");
				oQuery[aPair[0]] = decodeURIComponent(aPair[1]);
			}
			return oQuery;

		},
		_onFioriObjectPageHeaderContactPress: function (oEvent) {

			var oPopover;
			var oSource = oEvent.getSource();
			var oBindingContext = oSource.getBindingContext();
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			this.getOwnerComponent().runAsOwner(function () {
				oPopover = oSource.getDependents()[0];
				oPopover.setPlacement("Auto");
			});

			return new Promise(function (fnResolve) {
				oPopover.attachEventOnce("afterOpen", null, fnResolve);
				oPopover.openBy(oSource);
				if (sPath) {
					oPopover.bindElement(sPath);
				}
			}).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("Page2").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

		},
		onExit: function () {

			// to destroy templates for bound aggregations when templateShareable is true on exit to prevent duplicateId issue
			var aControls = [{
				"controlId": "Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-2-sectionContent-Fiori_ObjectPage_Table-1544114644361",
				"groups": ["items"]
			}];
			for (var i = 0; i < aControls.length; i++) {
				var oControl = this.getView().byId(aControls[i].controlId);
				for (var j = 0; j < aControls[i].groups.length; j++) {
					var sAggregationName = aControls[i].groups[j];
					var oBindingInfo = oControl.getBindingInfo(sAggregationName);
					var oTemplate = oBindingInfo.template;
					oTemplate.destroy();
				}
			}

		}
	});
}, /* bExport= */ true);