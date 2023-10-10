sap.ui.define(["Y5GL_SOLFER_DHO/Y5GL_SOLFER_DHO/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"Y5GL_SOLFER_DHO/Y5GL_SOLFER_DHO/model/formatter",
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment"

], function (e, t, r, o, n, i, a, s, u, Controller, MessageToast, Fragment) {
	"use strict";
	return e.extend("Y5GL_SOLFER_DHO.Y5GL_SOLFER_DHO.controller.Master", {
		formatter: u,
		onInit: function () {
			var e = this.byId("list"),
				t = this._createViewModel(),
				r = e.getBusyIndicatorDelay();

			this._oList = e;
			this._oListFilterState = {
				aFilter: [],
				aSearch: []
			};
			this.setModel(t, "masterView");
			e.attachEventOnce("updateFinished", function () {
				t.setProperty("/delay", r);
			});
			this.getView().addEventDelegate({
				onBeforeFirstShow: function () {}.bind(this)
			});
			this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
			this.getRouter().attachBypassed(this.onBypassed, this);

			this.readOdataDHO();

		},

		_getDialog: function (e) {

			if ( this.is_dho === '') {
				sap.m.MessageBox.error("Você não possui perfil DHO para fazer solicitação de Férias");
			} else {
				if (!this._oDialog) {
					this._oDialog = sap.ui.xmlfragment("idFragment", "Y5GL_SOLFER_DHO.Y5GL_SOLFER_DHO.view.Employee", this);

					this.getView().addDependent(this._oDialog);

				}

				var pernr = sap.ui.core.Fragment.byId("idFragment", "pernr");
				if(pernr != null){
					pernr.setValue();
				}
				return this._oDialog;
			}

		},
		onOpenDialog: function (e) {
			this._getDialog(e).open();
		},

		onSave: function (evt) {

			var pernr = sap.ui.core.Fragment.byId("idFragment", "pernr").getValue();
			this.selectOdata(pernr);
			this.onCloseDialog();
		},

		onCloseDialog: function () {
			this._getDialog().close();
		},

		readOdataDHO: function () {

			var that = this;
			var is_dho = '';
			var oModel = this.getOwnerComponent().getModel();
			var sPath = "/ZET_GLHR_IS_DHO";
			oModel.read(sPath, {
				async: true,
				success: function (oData, oResponse) {
					if (oData.results.length > 0){
					    that.is_dho = oData.results[0].is_dho;
					    that.bukrs = oData.results[0].Bukrs;
					    that.werks = oData.results[0].werks;
				    }else{
				    	that.is_dho = '';
				    }    
				     
					that.onOpenDialog();
					
					return oData.results[0].is_dho;
				},
				error: function () {
					sap.m.MessageBox.error("Sem Perfil DHO para programar Férias");
				}
			});

		},

		selectOdata: function (pernr) {

			var that = this;
			var l_pernr = pernr;
			var oModel = this.getOwnerComponent().getModel();
		//	var sFilter = "Pernr eq '" + l_pernr + "'";
			var sFilter = "Pernr eq '" + l_pernr + "' and " +
						  "Werks eq '" + this.werks + "' and " +
						  "Bukrs eq '" + this.bukrs + "' and " +
						  "Is_dho eq '" + this.is_dho + "'"; 
			var sPath = "/ZET_GLHR_PERIODOS";
		
			oModel.read(sPath, {
				urlParameters: {
					"$filter": sFilter
				},
				async: false,
				success: function (oData, oResponse) {
					var oList = that.getView().byId("list");
					var oModel = new sap.ui.model.json.JSONModel();
					
					if(oData.results.length >0){

						var is_dho    = oData.results[0].Is_dho;
						var is_status = oData.results[0].Status;
						var l_name    = oData.results[0].Nome;
						var l_pernr	  = oData.results[0].Pernr;
						
						if ( is_dho == 'X' && is_status == 'Erro' ){
						    sap.m.MessageBox.error("Sem permissão para programar férias para este empregado");
						    oData = null;
						}else{
						  var oTitle = that.getView().byId("list");
						  var comp_name = l_pernr + " - "+ l_name;
						  oTitle.setHeaderText(comp_name);
						}	
					}

					oModel.setData(oData);
					oList.setModel(oModel);

					return oData.results;
				},
				error: function (oError) {
					sap.m.MessageToast.show("Férias não encontradas!");
				}
			});
		},

		onSelectionChange: function (e) {
			var t = e.getSource(),
				r = e.getParameter("selected");
			if (!(t.getMode() === "MultiSelect" && !r)) {
				this._showDetail(e.getParameter("listItem") || e.getSource())
			}
		},
		_createViewModel: function () {
			return new t({
				isFilterBarVisible: false,
				filterBarLabel: "",
				delay: 0,
				title: this.getResourceBundle().getText("masterTitleCount", [0]),
				noDataText: this.getResourceBundle().getText("masterListNoDataText"),
				sortBy: "Pernr",
				groupBy: "None"
			})
		},
		_onMasterMatched: function (e) {
			this.getModel("appView").setProperty("/layout", "OneColumn");
			var t = e.getParameter("arguments").Pernr
		},
		_showDetail: function (e) {
			var t = e.getBindingContext().getProperty("Bukrs");
			this.setEmpresa(t);
			var r = !s.system.phone;
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getRouter().navTo("object", {
				Index: e.getBindingContext().getProperty("Index"),
				Pernr: e.getBindingContext().getProperty("Pernr"),
				Endda: e.getBindingContext().getProperty("Endda"),
				Begda: e.getBindingContext().getProperty("Begda")
			}, r)
		},
		FormatStatus: function (e) {
			if (e === "Disponível") {
				return "Success"
			}
			if (e === "Em Programação") {
				return "Warning"
			}
			if (e === "Homologado") {
				return "Success"
			}
			if (e === "Em Aberto") {
				return "Error"
			}
			if (e === "Em aprovação") {
				return "Warning"
			} else {
				return "Success"
			}
		},
		onAdd: function () {
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getRouter().navTo("Add")
		},
		formatterIcon: function (e) {
			var t = jQuery.sap.getModulePath("Y5GL_SOLFER_DHO.Y5GL_SOLFER_DHO");
			var r = t + "/Icones/";
			var o;
			o = r + "FERIAS.png";
			return o
		}
	})
});