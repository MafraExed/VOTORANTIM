sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
	'sap/ui/core/routing/History'
], function (Controller, JSONModel, History) {
	"use strict";

	return Controller.extend("fibria.y5vp_portalui5.controller.Default", {
		onInit: function () {

			var that = this;
			var oData = new JSONModel({
				isCount: "..."
			});

			var oModelOv = new sap.ui.model.json.JSONModel(oData);
			var oModelLp = new sap.ui.model.json.JSONModel(oData);
			var oModelFi = new sap.ui.model.json.JSONModel(oData);
			var oModelPo = new sap.ui.model.json.JSONModel(oData);
			var oModelRc = new sap.ui.model.json.JSONModel(oData);
			var oModelSr = new sap.ui.model.json.JSONModel(oData);
			var oModelIv = new sap.ui.model.json.JSONModel(oData);
			var oModelSisb = new sap.ui.model.json.JSONModel(oData);
			var oModelDele = new sap.ui.model.json.JSONModel(oData);

			this.getView().setModel(oModelOv, "ViewOv");
			this.getView().setModel(oModelLp, "ViewLp");
			this.getView().setModel(oModelFi, "ViewFi");
			this.getView().setModel(oModelPo, "ViewPo");
			this.getView().setModel(oModelRc, "ViewRc");
			this.getView().setModel(oModelSr, "ViewSr");
			this.getView().setModel(oModelIv, "ViewIv");
			this.getView().setModel(oModelSisb, "ViewSisb");
			this.getView().setModel(oModelDele, "ViewDele");

			var ServiceOV = this.getOwnerComponent().getModel("OV");
			var ServiceLP = this.getOwnerComponent().getModel("LP");
			var ServiceFI = this.getOwnerComponent().getModel("FI");
			var ServicePO = this.getOwnerComponent().getModel("PO");
			var ServiceRC = this.getOwnerComponent().getModel("RC");
			var ServiceSR = this.getOwnerComponent().getModel("SR");
			var ServiceIV = this.getOwnerComponent().getModel("IV");
			var ServiceSISB = this.getOwnerComponent().getModel("SISB");
			var ServiceDELE = this.getOwnerComponent().getModel("DELE");

			var oViewOv = this.getModel("ViewOv");
			var oViewLp = this.getModel("ViewLp");
			var oViewFi = this.getModel("ViewFi");
			var oViewPo = this.getModel("ViewPo");
			var oViewRc = this.getModel("ViewRc");
			var oViewSr = this.getModel("ViewSr");
			var oViewIv = this.getModel("ViewIv");
			var oViewSisb = this.getModel("ViewSisb");
			var oViewDele = this.getModel("ViewDele");

			oViewOv.oData.isCount = '...';
			oViewLp.oData.isCount = '...';
			oViewFi.oData.isCount = '...';
			oViewPo.oData.isCount = '...';
			oViewRc.oData.isCount = '...';
			oViewSr.oData.isCount = '...';
			oViewIv.oData.isCount = '...';
			oViewSisb.oData.isCount = '...';
			oViewDele.oData.isCount = '...';

			oViewOv.refresh(true);
			oViewLp.refresh(true);
			oViewFi.refresh(true);
			oViewPo.refresh(true);
			oViewRc.refresh(true);
			oViewSr.refresh(true);
			oViewIv.refresh(true);
			oViewSisb.refresh(true);
			oViewDele.refresh(true);

			ServiceOV.read("/OrdemVendas/$count", {
				success: function (oData) {
					// set data to display
					oViewOv.oData.isCount = oData;
					oViewOv.refresh(true);
				},

				error: function (oError) {

				}
			});
			ServiceLP.read("/ListaPrecos/$count", {
				success: function (oData) {
					// set data to display
					oViewLp.oData.isCount = oData;
					oViewLp.refresh(true);
				},

				error: function (oError) {

				}
			});
			ServiceFI.read("/Financeiros/$count", {
				success: function (oData) {
					// set data to display
					oViewFi.oData.isCount = oData;
					oViewFi.refresh(true);
				},

				error: function (oError) {

				}
			});
			ServicePO.read("/Compras/$count", {
				success: function (oData) {
					// set data to display
					oViewPo.oData.isCount = oData;
					oViewPo.refresh(true);
				},

				error: function (oError) {

				}
			});
			ServiceRC.read("/Requisicaos/$count", {
				success: function (oData) {
					// set data to display
					oViewRc.oData.isCount = oData;
					oViewRc.refresh(true);
				},

				error: function (oError) {

				}
			});

			ServiceSR.read("/FolhaServicos/$count", {
				success: function (oData) {
					// set data to display
					oViewSr.oData.isCount = oData;
					oViewSr.refresh(true);
				},

				error: function (oError) {

				}
			});
			ServiceIV.read("/Inventarios/$count", {
				success: function (oData) {
					// set data to display
					oViewIv.oData.isCount = oData;
					oViewIv.refresh(true);
				},

				error: function (oError) {

				}
			});
			ServiceSISB.read("/Sisbs/$count", {
				success: function (oData) {
					// set data to display
					oViewSisb.oData.isCount = oData;
					oViewSisb.refresh(true);
				},

				error: function (oError) {

				}
			});

			ServiceDELE.read("/Delegacoes/$count", {
				success: function (oData) {
					// set data to display
					oViewDele.oData.isCount = oData;
					oViewDele.refresh(true);
				},

				error: function (oError) {

				}
			});

			that.modelServices();

			//	setInterval(function () {
			//		that.onInit();
			//	}, 180000);

		},

		modelServices: function () {
			var self = this;
			self.heartbeatTrigger = new sap.ui.core.IntervalTrigger(180000);
			self.heartbeatTrigger.addListener(function () {
				self.callOdata();
			});
		},

		callOdata: function () {

			var ServiceOV = this.getOwnerComponent().getModel("OV");
			var ServiceLP = this.getOwnerComponent().getModel("LP");
			var ServiceFI = this.getOwnerComponent().getModel("FI");
			var ServicePO = this.getOwnerComponent().getModel("PO");
			var ServiceRC = this.getOwnerComponent().getModel("RC");
			var ServiceSR = this.getOwnerComponent().getModel("SR");
			var ServiceIV = this.getOwnerComponent().getModel("IV");
			var ServiceSISB = this.getOwnerComponent().getModel("SISB");
			var ServiceDELE = this.getOwnerComponent().getModel("DELE");

			var oViewOv = this.getModel("ViewOv");
			var oViewLp = this.getModel("ViewLp");
			var oViewFi = this.getModel("ViewFi");
			var oViewPo = this.getModel("ViewPo");
			var oViewRc = this.getModel("ViewRc");
			var oViewSr = this.getModel("ViewSr");
			var oViewIv = this.getModel("ViewIv");
			var oViewSisb = this.getModel("ViewSisb");
			var oViewDele = this.getModel("ViewDele");

			ServiceOV.read("/OrdemVendas/$count", {
				success: function (oData) {
					// set data to display
					oViewOv.oData.isCount = oData;
					oViewOv.refresh(true);
				},

				error: function (oError) {

				}
			});
			ServiceLP.read("/ListaPrecos/$count", {
				success: function (oData) {
					// set data to display
					oViewLp.oData.isCount = oData;
					oViewLp.refresh(true);
				},

				error: function (oError) {

				}
			});
			ServiceFI.read("/Financeiros/$count", {
				success: function (oData) {
					// set data to display
					oViewFi.oData.isCount = oData;
					oViewFi.refresh(true);
				},

				error: function (oError) {

				}
			});
			ServicePO.read("/Compras/$count", {
				success: function (oData) {
					// set data to display
					oViewPo.oData.isCount = oData;
					oViewPo.refresh(true);
				},

				error: function (oError) {

				}
			});
			ServiceRC.read("/Requisicaos/$count", {
				success: function (oData) {
					// set data to display
					oViewRc.oData.isCount = oData;
					oViewRc.refresh(true);
				},

				error: function (oError) {

				}
			});

			ServiceSR.read("/FolhaServicos/$count", {
				success: function (oData) {
					// set data to display
					oViewSr.oData.isCount = oData;
					oViewSr.refresh(true);
				},

				error: function (oError) {

				}
			});
			ServiceIV.read("/Inventarios/$count", {
				success: function (oData) {
					// set data to display
					oViewIv.oData.isCount = oData;
					oViewIv.refresh(true);
				},

				error: function (oError) {

				}
			});
			ServiceSISB.read("/Sisbs/$count", {
				success: function (oData) {
					// set data to display
					oViewSisb.oData.isCount = oData;
					oViewSisb.refresh(true);
				},

				error: function (oError) {

				}
			});

			ServiceDELE.read("/Delegacoes/$count", {
				success: function (oData) {
					// set data to display
					oViewDele.oData.isCount = oData;
					oViewDele.refresh(true);
				},

				error: function (oError) {

				}
			});

		},

		onAfterRendering: function () {
			sap.ui.getCore().byId("backBtn").setVisible(false);
			//Disabilita o Titulo do launchpad
			sap.ui.getCore().byId("shellAppTitle").setVisible(false);

			sap.ui.getCore().byId("backBtn").attachPress(this, function (oEvent) {
				oEvent.preventDefault();
			}.bind(this));

			/*var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			oCrossAppNavigator.toExternal({
				target: {
					semanticObject: "#"
				}
			});*/

		},

		getModel: function (name) {
			return this.getView().getModel(name) || this.getOwnerComponent().getModel(name);
		},
		onPressOv: function (evt) {
			//sap.m.URLHelper.redirect( '/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?&sap-ushell-config=standalone#PortalOrdemVenda-display' ); 
			sap.m.URLHelper.redirect(
				'/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?&sap-ushell-config=standalone#PortalOrdemVenda-display'
			);
		},
		onPressLp: function (evt) {
			sap.m.URLHelper.redirect(
				'/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?&sap-ushell-config=standalone#PortalListaPreco-display'
			);
		},
		onPressFi: function (evt) {
			sap.m.URLHelper.redirect(
				'/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?&sap-ushell-config=standalone#PortalFinanceiro-display'
			);
		},
		onPressPo: function (evt) {
			sap.m.URLHelper.redirect(
				'/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?&sap-ushell-config=standalone#PortalCompra-display'
			);
		},
		onPressRc: function (evt) {
			sap.m.URLHelper.redirect(
				'/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?&sap-ushell-config=standalone#PortalRequisicao-display'
			);
		},
		onPressSr: function (evt) {
			sap.m.URLHelper.redirect(
				'/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?&sap-ushell-config=standalone#PortalFolhaServico-display'
			);
		},
		onPressIv: function (evt) {
			sap.m.URLHelper.redirect(
				'/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?&sap-ushell-config=standalone#Portal_Iventario-display'
			);
		},
		onPressSisb: function (evt) {
			sap.m.URLHelper.redirect(
				'/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?&sap-ushell-config=standalone#Portal_SISB-display'
			);
		},
		onPressDele: function (evt) {
			sap.m.URLHelper.redirect(
				'/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?&sap-ushell-config=standalone#Portal_Delegacao-display'
			);
		},

		getDocs: function (name) {
			return this.getView().getModel(name) || this.getOwnerComponent().getModel(name);
		},

	});
});