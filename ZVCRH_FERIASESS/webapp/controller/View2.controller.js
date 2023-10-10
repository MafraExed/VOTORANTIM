sap.ui.define(["sap/ui/core/mvc/Controller"], function(Controller) {
	"use strict";
	var dialog = new sap.m.BusyDialog({
		text: "Processando"
	});
	return Controller.extend("com.sap.votorantim.grupoZHCM_FERIAS_VT.controller.View2", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.sap.votorantim.grupoZHCM_FERIAS_VT.view.View2
		 */
		onInit: function() {
			this.getView().addEventDelegate({
				onBeforeShow: jQuery.proxy(function(evt) {
					this.onBeforeShow(evt);
				}, this)
			});
		},
		onBeforeShow: function(evt) {
			//alert('called from on Before show');
			// DO manipulation here
			var vcontrole = "";
			var vdias = 0;
			var oModeli = new sap.ui.model.json.JSONModel();
			var oModel = sap.ui.getCore().getModel("periodo_det");
			var oData = oModel.getData();
			oModeli.setData(oData);
			var oModel2 = sap.ui.getCore().getModel("periodos_todos");
			var oData2 = oModel2.getData();
			oModel2.setData(oData2);
			sap.ui.getCore().setModel(oModel, "periodo_det2");
			sap.ui.getCore().setModel(oModel2, "periodos_todos2");
			var per_aqui = this.getView().byId("per_aqui");
			per_aqui.setValue(oData.results[0].Begda + " at\xE9 " + oData.results[0].Endda);
			var per_cons = this.getView().byId("per_cons");
			per_cons.setValue(oData.results[0].Desta + " at\xE9 " + oData.results[0].Deend);
			var per_dias = this.getView().byId("per_dias");
			per_dias.setValue(oData.results[0].Anzhl);
			var per_stat = this.getView().byId("per_stat");
			per_stat.setValue(oData.results[0].StatusTxt);
			//periodo1
			var first_ini = this.getView().byId("first_ini");
			first_ini.setValue(oData2.results[1].Inicio);
			var first_diasgozo = this.getView().byId("first_diasgozo");
			first_diasgozo.setValue(oData2.results[1].DiasGozo);
			var first_fim = this.getView().byId("first_fim");
			first_fim.setValue(oData2.results[1].Fim);
			var first_abono = this.getView().byId("first_abono");
			vcontrole = oData2.results[1].Abono;
			if (vcontrole == "X") {
				vcontrole = true;
				vdias = 10;
			} else {
				vcontrole = false;
				vdias = 0;
			}
			first_abono.setSelected(vcontrole);
		
			var first_diasaban = this.getView().byId("first_diasaban");
			first_diasaban.setValue(vdias);
		
			var first_13 = this.getView().byId("first_13");
			vcontrole = oData2.results[1].13;
			if (vcontrole == "X") {
				vcontrole = true;

			} else {
				vcontrole = false;

			}
			first_13.setSelected(vcontrole);

			var first_status = this.getView().byId("first_status");
			first_status.setText(oData2.results[1].StatusTxt);
			//periodo2
			var secon_ini = this.getView().byId("secon_ini");
			secon_ini.setValue(oData2.results[1].Inicio);
			var secon_diasgozo = this.getView().byId("secon_diasgozo");
			secon_diasgozo.setValue(oData2.results[1].DiasGozo);
			var secon_fim = this.getView().byId("secon_fim");
			secon_fim.setValue(oData2.results[1].Fim);
			var secon_status = this.getView().byId("secon_status");
			secon_status.setText(oData2.results[1].StatusTxt);
			// periodo3
			var third_ini = this.getView().byId("third_ini");
			third_ini.setValue(oData2.results[1].Inicio);
			var third_diasgozo = this.getView().byId("third_diasgozo");
			third_diasgozo.setValue(oData2.results[1].DiasGozo);
			var third_fim = this.getView().byId("third_fim");
			third_fim.setValue(oData2.results[1].Fim);
			var third_status = this.getView().byId("third_status");
			third_status.setText(oData2.results[1].StatusTxt);
		},
		onProgramacao: function(evt) {},
		//	var oModel = sap.ui.getCore().getModel("periodo_det");
		//		var oData = oModel.getData();
		back: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("View1");
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.sap.votorantim.grupoZHCM_FERIAS_VT.view.View2
		 */
		onBeforeRendering: function() {},
		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.sap.votorantim.grupoZHCM_FERIAS_VT.view.View2
		 */
		onAfterRendering: function() {},
		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.sap.votorantim.grupoZHCM_FERIAS_VT.view.View2
		 */
		onExit: function() {},
		/**
		 *@memberOf com.sap.votorantim.grupoZHCM_FERIAS_VT.controller.View2
		 * 
		 */
		somardatafirst: function() {
			var that = this;
			var vdata = this.getView().byId("first_ini").getValue();
			var vdays = this.getView().byId("first_diasgozo").getValue();
			if (vdays > 0) {
				var resultado = "";
				var oModel = this.getOwnerComponent().getModel("ferias_ess");
				var sFilter = "VDATA eq '" + vdata + "' and VDIAS eq '" + vdays + "'";
				var sPath = "/CALC_DAYS";
				oModel.read(sPath, {
					urlParameters: {
						"$filter": sFilter
					},
					async: false,
					success: function(oData, oResponse) {
						var vdate = oData.results[0].V_RESULTADO;
						var first_fim = that.getView().byId("first_fim");
						first_fim.setValue(vdate);
					},
					error: function() {
						sap.m.MessageToast.show("F\xE9rias n\xE3o encontradas!");
					}
				});
			}
		},
		somardatasecon: function() {
			var that = this;
			var vdata = this.getView().byId("secon_ini").getValue();
			var vdays = this.getView().byId("secon_diasgozo").getValue();
			if (vdays > 0) {
				var resultado = "";
				var oModel = this.getOwnerComponent().getModel("ferias_ess");
				var sFilter = "VDATA eq '" + vdata + "' and VDIAS eq '" + vdays + "'";
				var sPath = "/CALC_DAYS";
				oModel.read(sPath, {
					urlParameters: {
						"$filter": sFilter
					},
					async: false,
					success: function(oData, oResponse) {
						var vdate = oData.results[0].V_RESULTADO;
						var first_fim = that.getView().byId("secon_fim");
						first_fim.setValue(vdate);
					},
					error: function() {
						sap.m.MessageToast.show("F\xE9rias n\xE3o encontradas!");
					}
				});
			}
		},
		somardatathird: function() {
			var that = this;
			var vdata = this.getView().byId("third_ini").getValue();
			var vdays = this.getView().byId("third_diasgozo").getValue();
			if (vdays > 0) {
				var resultado = "";
				var oModel = this.getOwnerComponent().getModel("ferias_ess");
				var sFilter = "VDATA eq '" + vdata + "' and VDIAS eq '" + vdays + "'";
				var sPath = "/CALC_DAYS";
				oModel.read(sPath, {
					urlParameters: {
						"$filter": sFilter
					},
					async: false,
					success: function(oData, oResponse) {
						var vdate = oData.results[0].V_RESULTADO;
						var first_fim = that.getView().byId("third_fim");
						first_fim.setValue(vdate);
					},
					error: function() {
						sap.m.MessageToast.show("F\xE9rias n\xE3o encontradas!");
					}
				});
			}
		},
		somardata: function(vata, vdias) {
			//This code was generated by the layout editor.
			var that = this;
			var oModel = this.getOwnerComponent().getModel("ferias_ess");
			var sFilter = "VDATA eq '" + vata + "' and VDIAS eq '" + vdias + "'";
			var sPath = "/CALC_DAYS";
			oModel.read(sPath, {
				urlParameters: {
					"$filter": sFilter
				},
				async: false,
				success: function(oData, oResponse) {
					return oData.results[0].RESULTADO;
				},
				error: function() {
					sap.m.MessageToast.show("F\xE9rias n\xE3o encontradas!");
				}
			});
		},
		/**
		 *@memberOf com.sap.votorantim.grupoZHCM_FERIAS_VT.controller.View2
		 */
		setabono: function() {
			var vcontrole;
			var vdias;
			var first_abono = this.getView().byId("first_abono");
			var first_diasaban = this.getView().byId("first_diasaban");
			vcontrole = first_abono.getSelected(vcontrole);

			if (vcontrole == true) {
				vdias = 10;
			} else {
				vdias = 0;
			}

			//This code was generated by the layout editor.

			first_diasaban.setValue(vdias);
		}
	});
});