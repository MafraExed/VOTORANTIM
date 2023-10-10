/*global location */
sap.ui.define([
	"Y5GL_DECLAR4/Y5GL_DECLAR4/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"Y5GL_DECLAR4/Y5GL_DECLAR4/model/formatter",
	"sap/ui/Device",
	'sap/m/PDFViewer',
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/m/Text',
	'sap/ui/core/Fragment'

], function (BaseController, JSONModel, formatter, Device, PDFViewer, Dialog, Button, Text, Fragment) {
	"use strict";

	//Global Variables

	var TpDec;
	var Pernr;

	return BaseController.extend("Y5GL_DECLAR4.Y5GL_DECLAR4.controller.Detail", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0
			});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			this.setModel(oViewModel, "detailView");

			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));

		},

		onPrint: function () {
			this.getView().byId("FormChange480_12120").print();
			//window.print();
		},

		onSendEmailPress: function () {
			var oViewModel = this.getModel("detailView");

			sap.m.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},

		onShareInJamPress: function () {
			var oViewModel = this.getModel("detailView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});

			oShareDialog.open();
		},

		_onObjectMatched: function (oEvent) {

			//	var pagewidth = this.getView().byId("__page2-cont").isPrototypeOf("width");
			//	var pageheight = this.getView().byId("__page2-cont").isPrototypeOf("height");
			//	var width =	window.innerWidth || document.body.clientWidth;
			//	var	height = window.innerHeight || document.body.clientHeight;
/*
			TpDec = oEvent.getParameter("arguments").TpDec;
			Pernr = oEvent.getParameter("arguments").Pernr;
			var a = new sap.ui.model.json.JSONModel;
			var s = "/sap/opu/odata/sap/ZGWGLHR_FERIAS_ESS_SRV/ZET_GLHR_DECLARADETSet(TpDec='" + TpDec + "',Pernr='" + Pernr + "')";
			//var download = "/sap/opu/odata/sap/ZGWGLHR_FERIAS_ESS_SRV/ZET_GLHR_DECLARADETSet(TpDec='" + TpDec + "',Pernr='" + Pernr + "')/$value";

			a.loadData(s, null, false, "GET", false, false, null);
			var ValueString = a.oData.d.ValueString;*/

			//	$("UploadCollection").attr("items", "data:application/pdf;base64," + ValueString);
			//	$("iframe").attr("src", "data:application/pdf;base64," + ValueString);
			//	$("iframe").attr("widht", pagewidth);
			//	$("iframe").attr("height", pageheight);

		},

		openPDF: function (oEvent) {

			//	TpDec = oEvent.getParameter("arguments").TpDec;0
			
			//	Pernr = oEvent.getParameter("arguments").Pernr;
			//var a = new sap.ui.model.json.JSONModel;
		/*	var download = "/sap/opu/odata/sap/ZGWGLHR_FERIAS_ESS_SRV/ZET_GLHR_DECLARADETSet(TpDec='" + TpDec + "',Pernr='" + Pernr +
				"')/$value";*/
/*
			var oA = document.createElement("a");
			oA.href = download;
			oA.target = "_blank";
			oA.style.display = "none";
			document.body.appendChild(oA);
			oA.click();
			document.body.removeChild(oA);*/

			//	a.loadData(download, null, false, "GET", false, false, null);
			//	var ValueString = a.oData.d.ValueString;

			//	$("iframe").attr("src", "data:image/jpeg;base64," + ValueString);

			//	$("iframe").attr("src", download);
			//sap.m.URLHelper.redirect(download, true);
		},

		// -> Upload de arquivos / Chamada de SmartForms ------- Início
		onChange: function (oEvent) {
			// Stellen das CSRF Token wenn ein File hinzugefügt ist
			var oUploadCollection = oEvent.getSource();
			var _csrfToken = this.getView().getModel().oHeaders["x-csrf-token"];
			var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
				name: "x-csrf-token",
				value: _csrfToken
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
		},

		onBeforeUploadStarts: function (oEvent) {
			var TpDec = this.getView().byId("TpDec").getValue();

			var sSlug = TpDec + oEvent.getParameter("fileName");

			// Stellen die Kopf Parameter slug
			var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
				name: "slug",
				value: sSlug
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);

		},

		onuploadComplete: function (oEvent) {

			var TpDec = this.getView().byId("TpDec").getValue();

			var oFilterTpDec = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, TpDec);

			var oList = this.getView().byId("UploadCollection");

			oList.getBindingInfo("items").filter([oFilterTpDec]);
		},

		onmodelContextChange: function (oEvent) {
			/*	//var TpDec = this.getView().byId("TpDec").getValue();
				var TpDec = "001";
				//var TpDec = oEvent.getParameter("arguments").TpDec;
				//var oFilterTpDec = new sap.ui.model.Filter("TpDec", sap.ui.model.FilterOperator.EQ, TpDec);
				//oEvent.getSource().getBinding("items").filter([oFilterTpDec]);

				var TpDec = "001",
					oFilter = {},
					oFilter = new sap.ui.model.Filter("TpDec", sap.ui.model.FilterOperator.EQ, TpDec),
					oList = this.getView().byId("UploadCollection");

				oList.getBinding("items").filter([oFilter]);*/
		},
		// -> Upload de arquivos / Chamada de SmartForms ------- Fim

		onVoltar: function (oEvent) {

			this.getRouter().navTo("master");
		},

		_bindView: function (sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("detailView");

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function () {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}

		},

		_onMetadataLoaded: function () {
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

		/**
		 * Set the full screen mode to false and navigate to master page
		 */
		onCloseDetailPress: function () {
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
			// No item should be selected on master after detail page is closed
			this.getOwnerComponent().oListSelector.clearMasterListSelection();
			this.getRouter().navTo("master");
		},

		/**
		 * Toggle between full and non full screen mode.
		 */
		toggleFullScreen: function () {
			var bFullScreen = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
			if (!bFullScreen) {
				// store current layout and go full screen
				this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
				this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
			} else {
				// reset to previous layout
				this.getModel("appView").setProperty("/layout", this.getModel("appView").getProperty("/previousLayout"));
			}
		},

		FormatChecked: function (value) {
			if (value === 'X') {

				return true;

			} else {

				return false;

			}

		},

		FormatChecked2: function (value) {
			if (value === 'X') {

				return true;

			} else {

				return false;

			}

		},

		onAfterRendering: function (evt) {
			//var abono = this.getView().byId("IdFavor").getValue();
		},

	});

});