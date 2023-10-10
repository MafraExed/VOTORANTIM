sap.ui.define([
	"Y5GL_DHO_FORM2/Y5GL_DHO_FORM2/controller/BaseController",
	"sap/ui/model/Filter",
], function (BaseController, Filter) {
	"use strict";

	return BaseController.extend("Y5GL_DHO_FORM2.Y5GL_DHO_FORM2.controller.Detalhe", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Y5GL_DHO_FORM2.Y5GL_DHO_FORM2.view.Detalhe
		 */
		onInit: function () {
			this.getRouter().getRoute("Detalhe").attachPatternMatched(this._onObjectMatched, this);
		},	

		_onObjectMatched: function (oEvent) {
			this.getView().getModel().refresh(true);
			
			var Infty = oEvent.getParameter("arguments").Infty;
			var Subty = oEvent.getParameter("arguments").Subty;

			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("ZET_GLHR_FORMULARIOS_SUBTIPOSSet", {
					Infty: Infty,
					Subty: Subty
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		_bindView: function (sObjectPath) {
			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						//that.loading(true);
					},
					dataReceived: function () {
						//that.loading(false);
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

		onmodelListContextChange: function (oEvent) {
			var Bukrs = this.getView().byId("ComboBukrs").getSelectedKey();
			var Infty = this.getView().byId("Infotipo").getValue();
			var Subty = this.getView().byId("Subtipo").getValue();
			var Area = this.getView().byId("ComboArea").getSelectedKey();

			if (Infty !== "" || Subty !== "") {
				var oFilterBukrs = new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, Bukrs);
				var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, Subty);
				var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, Infty);
				var oFilterArea = new sap.ui.model.Filter("Area", sap.ui.model.FilterOperator.EQ, Area);
				var oList = this.getView().byId("UploadCollection");
				oList.getBinding("items").filter([oFilterBukrs, oFilterInfty, oFilterSubty, oFilterArea]);
			}
		},

		onBeforeUploadStarts: function (oEvent) {
			var Bukrs = this.getView().byId("ComboBukrs").getSelectedKey();
			var Infty = this.getView().byId("Infotipo").getValue();
			var Subty = this.getView().byId("Subtipo").getValue();
			var Area = this.getView().byId("ComboArea").getSelectedKey();

			if (Infty !== "" && Subty !== "") {
				var sSlug = Bukrs + "$" + Infty + "$" + Subty + "$" + Area + "$" + oEvent.getParameter("fileName");
				// Stellen die Kopf Parameter slug
				var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
					name: "slug",
					value: encodeURIComponent( sSlug )
				});
				oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
			} else {
				sap.m.MessageBox.error("Não foi possivel fazer upload do arquivo.");
			}
			//			_busyDialog.open();

		},

		onuploadComplete: function (oEvent) {
			var Bukrs = this.getView().byId("ComboBukrs").getSelectedKey();
			var Infty = this.getView().byId("Infotipo").getValue();
			var Subty = this.getView().byId("Subtipo").getValue();
			var Area = this.getView().byId("ComboArea").getSelectedKey();

			if (Infty !== "" && Subty !== "") {
				var oFilterBukrs = new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, Bukrs);
				var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, Infty);
				var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, Subty);
				var oFilterArea = new sap.ui.model.Filter("Area", sap.ui.model.FilterOperator.EQ, Area);
				var oList = this.getView().byId("UploadCollection");
				oList.getBinding("items").filter([oFilterBukrs, oFilterInfty, oFilterSubty, oFilterArea]);
			}

			sap.m.MessageBox.success("Seu formulario foi anexado com sucesso.");
		},
		onChange: function (oEvent) {
			var Bukrs = this.getView().byId("ComboBukrs").getSelectedKey();
			if (Bukrs === "") {
				sap.m.MessageBox.error("Informar empresa antes do upload do arquivo.");
				return;
			}

			var Area = this.getView().byId("ComboArea").getSelectedKey();
			if (Area === "") {
				sap.m.MessageBox.error("Informar area de RH antes do upload do arquivo.");
				return;
			}

			var oUploadCollection = oEvent.getSource();
			var oModel = this.getView().getModel();
			oModel.refreshSecurityToken();
			var oHeaders = oModel.oHeaders;
			var sToken = oHeaders['x-csrf-token'];
			// Stellen das CSRF Token wenn ein File hinzugefügt ist
			var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
				name: "x-csrf-token",
				value: sToken
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
		},

		onChangeBukrs: function () {
			var Bukrs = this.getView().byId("ComboBukrs").getSelectedKey();

			if (Bukrs !== "") {
				this.getView().byId("ComboArea").setEditable(true);
			}

			var ComboArea = this.getView().byId("ComboArea").getBinding("items");
			var oFilterOpcoes = new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, Bukrs);
			ComboArea.filter([oFilterOpcoes]);

		},

		onchangeArea: function () {
			var Area = this.getView().byId("ComboArea").getSelectedKey();
			var Bukrs = this.getView().byId("ComboBukrs").getSelectedKey();
			var Infty = this.getView().byId("Infotipo").getValue();
			var Subty = this.getView().byId("Subtipo").getValue();

			if (Area !== "") {
				var UploadCollection = this.getView().byId("UploadCollection").getBinding("items");
				var oFilterBukrs = new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, Bukrs);
				var oFilterArea = new sap.ui.model.Filter("Area", sap.ui.model.FilterOperator.EQ, Area);
				var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, Infty);
				var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, Subty);
				UploadCollection.filter([oFilterBukrs, oFilterArea, oFilterInfty, oFilterSubty]);
			}
		},

		onDeleteSelectedItems: function (oEvent) {
			var UploadCollection = this.getView().byId("UploadCollection");
			var oModel = this.getView().getModel();
			var Area = this.getView().byId("ComboArea").getSelectedKey();
			var Bukrs = this.getView().byId("ComboBukrs").getSelectedKey();
			var Infty = this.getView().byId("Infotipo").getValue();
			var Subty = this.getView().byId("Subtipo").getValue();
			var docId = oEvent.getParameters().item.getProperty("documentId");
			var oEntry = {};
			var Key;

			Key = "/ZET_GLHR_DHO_UPLOADSet(Area='" + Area + "',Bukrs='" + Bukrs + "',Infty='" + Infty + "',Subty='" + Subty + "',DocId=" +
				docId + ")";

			oEntry.Autor = "D";

			oModel.update(Key, oEntry, {
				success: function (oData, oResponse) {
					sap.m.MessageBox.success("Arquivo excluido com sucesso.", {
						actions: ["OK"],
						onClose: function (sAction) {
							UploadCollection.getBinding("items").refresh(true);
						}
					});
				},
				error: function (oError) {}
			});
		},
		
		FormatFalse: function (){
			return false
		}
		
	});

});