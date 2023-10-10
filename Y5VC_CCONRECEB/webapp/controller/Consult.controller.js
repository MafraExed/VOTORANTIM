sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"../model/nfHeaderModel",
	"../model/nfHeaderListModel",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/resource/ResourceModel",
	"sap/m/MessageToast"

], function (BaseController, MessageBox, Utilities, History, Filter, NFHeaderModel, NFHeaderListModel,
	JSONModel, formatter, ResourceModel, MessageToast) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.operadorLogisticoCons.controller.Consult", {
		formatter: formatter,
		onInit: function () {

			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("Page1").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

			this.aFilters = [];

			// Register the view with the message manager
			sap.ui.getCore().getMessageManager().registerObject(this.byId("ipCHVNFE"), true);

			var oModel = new JSONModel({
				data: {}
			});
			this.getView().setModel(oModel);

			var vIsAlmox = Utilities.isAlmox(this.getView());
			var vIsOplog = Utilities.isOpLog(this.getView());

			var oModel = new JSONModel({
				"oplog": vIsOplog,
				"almox": vIsAlmox
			});
			this.getView().setModel(oModel, "Role");

			// set i18n model on view
			let i18nModel = new ResourceModel({
				bundleName: "com.sap.build.standard.operadorLogisticoCons.i18n"
			});
			this.getView().setModel(i18nModel, "i18n");

			this._nFheaderList = NFHeaderListModel.getInstance();

		},

		_onInputSubmit: function (oEvent) {
			var that = this;
			var oModel = this.getView().getModel("NFHEADER");

			var oTable = this.byId("tbNF");
			var oTableItemsBinding = oTable.getBinding("items");
			var vChvNfe = oEvent.getParameter("value");
			if (vChvNfe) {
				if (vChvNfe.length === 44) {

					let oNfeheader = {};
					oNfeheader.Chvnfe = vChvNfe;
					this._nFheaderList.addNF(new NFHeaderModel(vChvNfe, "Pendente"));
					this._setNfHeaderListModel();
					this.byId("ipCHVNFE").setValue("");
					this.byId("titTableCounter").setText("Chaves Bipadas (" + this._nFheaderList.getLines() + ")");
				}
			}
		},

		_setNfHeaderListModel: function () {
			this.getView().setModel(this._nFheaderList.getModelList(), "NFHEADERLIST");
		},

		_onProcessButtonClick: function () {
			var mySelf = this;

			if (this._nFheaderList.size() === 0) {
				MessageToast.show("Nenhuma NF-e selecionada");
				return;
			}

			this.getView().byId("tbNF").setBusy(true);
			this._nFheaderList.readEntitiesByChvNFe(this.getView(), mySelf._cProcessSuccess, mySelf._cProcessError);

		},

		_onItemPress: function (oEvent) {
			var oParam = oEvent.getParameter("listItem");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oCtx = oParam.getBindingContext("NFHEADERLIST");

			oRouter.navTo("NFdetail", {
				chvNfe: oCtx.getProperty("chvnfe")
			});
		},
		_cProcessSuccess: function (oView, oModel) {
			oView.setModel(oModel, "NFHEADERLIST");
			oView.byId("tbNF").setBusy(false);
		},

		_cProcessError: function (oView, oError) {
			oView.byId("tbNF").setBusy(false);

			if (oError) {
				if (oError.responseText) {
					MessageBox.error(JSON.parse(oError.responseText).error.message.value, {
						title: "Erro",
						styleClass: "sapUiSizeCompact"
					});
				} else {
					MessageBox.error("Erro ao buscar Notas Fiscais", {
						title: "Erro",
						styleClass: "sapUiSizeCompact"
					});

				}
			} else {
				MessageBox.error("Erro ao buscar Notas Fiscais", {
					title: "Erro",
					styleClass: "sapUiSizeCompact"
				});

			}

		},

		_onRefreshButtonClick: function () {

			var oModel = this.getView().getModel("NFHEADER");
			var mySelf = this;

			var aFilters = [];

			var sFilter = new sap.ui.model.Filter({
				path: "categoriaEtq",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: "VOL"
			});
			aFilters.push(sFilter);

			sFilter = new sap.ui.model.Filter({
				path: "status",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: "AT"
			});
			aFilters.push(sFilter);

			var vChvnfe = this.byId("ipCHVNFE").getValue();
			//Faz Requisição ao backend
			oModel.read("/ZET_VCMM_NFHEADERSet('" + vChvnfe + "')/NAVHEADLABEL", {
					filters: aFilters,
					success: (oDataret, oResponse) => {
						for (let oData of oDataret.results) {
							oData.checkbox = true;

							oModel.update("/ZET_VCMM_LABELSet('" + oData.nretq + "')", oData, null, function () {});
						}
					},
					error: function (oError) {
						// Error Handling Here
					}
				}

			);

		},

		handleRouteMatched: function (oEvent) {
			var sAppId = "App5c06d9238147af3ab5537f2a";

			var oParams = {};

			this._nFheaderList = NFHeaderListModel.getInstance();
			this._setNfHeaderListModel();

			if (oEvent.getParameters("data").context) {
				this.sContext = oEvent.getParameters("data").context;

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

		doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel() : null;

			var sEntityNameSet;
			if (sPath !== null && sPath !== "") {
				if (sPath.substring(0, 1) === "/") {
					sPath = sPath.substring(1);
				}
				sEntityNameSet = sPath.split("(")[0];
			}
			var sNavigationPropertyName;
			var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

			if (sEntityNameSet !== null) {
				sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet,
					sRouteName);
			}
			if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
				if (sNavigationPropertyName === "") {
					this.oRouter.navTo(sRouteName, {
						context: sPath,
						masterContext: sMasterContext
					}, false);
				} else {
					oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function (bindingContext) {
						if (bindingContext) {
							sPath = bindingContext.getPath();
							if (sPath.substring(0, 1) === "/") {
								sPath = sPath.substring(1);
							}
						} else {
							sPath = "undefined";
						}

						// If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
						if (sPath === "undefined") {
							this.oRouter.navTo(sRouteName);
						} else {
							this.oRouter.navTo(sRouteName, {
								context: sPath,
								masterContext: sMasterContext
							}, false);
						}
					}.bind(this));
				}
			} else {
				this.oRouter.navTo(sRouteName);
			}

			if (typeof fnPromiseResolve === "function") {
				fnPromiseResolve();
			}

		},

		onBeforeRendering: function () {
			this._nFheaderList.destroy();
		},

		onExit: function () {

			// to destroy templates for bound aggregations when templateShareable is true on exit to prevent duplicateId issue
			/*	var aControls = [{
					"controlId": "Fiori_ListReport_ListReport_0-content-Fiori_ListReport_Table-1",
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
				}*/

		}
	});
}, /* bExport= */ true);