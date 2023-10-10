sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ndc/BarcodeScanner",
	"../util/formatter",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/Filter"
], function (Controller, BarcodeScanner, Formatter, MessageBox, MessageToast, Filter) {
	"use strict";
	const cStatusInit = "PE"; //Status inicial

	return Controller.extend("Workspace.zagrupador_v2.controller.S0", {
		myFormatter: Formatter,
		_onAttachRequest: function () {
			sap.ui.core.BusyIndicator.show();
		},
		_onAttachRequestCompleted: function () {
			sap.ui.core.BusyIndicator.hide();
		},
		onInit: function () {

			this._filtrarInicial();

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("S0").attachMatched(this.onRouterMatched, this);

		},

		_filtrarInicial: function () {
			var oList = this.getView().byId("list0");
			/*oList.attachEventOnce("updateStarted", this._onAttachRequest);
			oList.attachEventOnce("updateFinished", this._onAttachRequestCompleted);*/

			var oFilter = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, "PE");
			var oSorter = new sap.ui.model.Sorter("Agrupador", true); // sort descending
			var oTemplate = oList.getItems()[0].clone();
			oList.bindAggregation("items", {
				path: "GE>/ZET_VCMM_AGRUPSet",
				sorter: oSorter,
				filters: [oFilter],
				template: oTemplate
			});

		},

		handleCriar: function (oEvent) {
			this.getView().setBusy(true);
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var that = this;

			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.warning(
				oBundle.getText("message_create_grouper"), {
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					onClose: function (oAction) {
						if (oAction === "YES") {
							//Imprimir etiquetas
							that._handleRouteTypeValueHelp();
							//Abrir BO
							// that._OpenBO(that, "018");

						} else {
							// Não fazer nada.
							MessageToast.show(oBundle.getText("message_canceled_by_user"));
							that.getView().setBusy(false);
						}
					}
				}
			);
		},

		_criarNovoAgrupador: function (vKey) {
			var that = this;
			var oView = this.getView();
			var oBundle = oView.getModel("i18n").getResourceBundle();

			var oModel = oView.getModel("GE");
			oView.setBusy(true);

			var mParameters = {
				groupId: "gpIdLeituraAgrup",
				success: (oData, oResp) => {
					if (oData) {
						if (oData.Agrupador === undefined) {
							var responseText = oData.responseText;
							if (responseText !== undefined) {
								var responseParser = JSON.parse(responseText);
								MessageBox.error(responseParser.error.message.value, {
									title: oBundle.getText("Error"),
									styleClass: "sapUiSizeCompact"
								});
							}
						} else {
							var vAgrupadorOut = this.myFormatter.shiftLeadingZeros(oData.Agrupador);
							MessageBox.success(oBundle.getText("RecordedData", [vAgrupadorOut]), {
								styleClass: "sapUiSizeCompact",
								onClose: function (oAction) {
									oView.setBusy(false);
									that._goToLeitura(oData.Agrupador);
								}
							});

						}

					}
				},
				error: (oData, resp) => {
					var responseText = oData.responseText;
					if (responseText !== undefined) {
						var vMsgErro = "";
						try {
							var responseParser = JSON.parse(responseText);
							vMsgErro = responseParser.error.message.value;
						} catch (err) {
							vMsgErro = responseText;
						}
						MessageBox.error(vMsgErro, {
							title: oBundle.getText("Error"),
							styleClass: "sapUiSizeCompact"
						});
					} else {
						MessageBox.error(oBundle.getText("ErrorRecordedData"), {
							styleClass: "sapUiSizeCompact"
						});
					}
				}
			};
			oModel.attachRequestSent(this._onAttachRequest);
			oModel.attachRequestCompleted(this._onAttachRequestCompleted);

			oModel.setDeferredGroups(["gpIdLeituraAgrup"]);
			let oListaAgrup = {};
			oListaAgrup.Rota = vKey; //Temp
			oModel.create("/ZET_VCMM_AGRUPSet", oListaAgrup, mParameters);
			oModel.submitChanges(mParameters);
			oView.setBusy(false);
		},

		_handleRouteTypeValueHelp: function (oEvent) {

			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment("Workspace.zagrupador_v2.view.SRota", this);
				this.getView().addDependent(this._valueHelpDialog);
			}

			this._valueHelpDialog.open();
		},

		_handleRouteTypeValueHelpSearch: function (evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter(
				"Descricao",
				sap.ui.model.FilterOperator.Contains, sValue);

			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleRouteTypeValueHelpClose: function (evt) {
			let oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var vKey = oSelectedItem.getDescription();

				this._criarNovoAgrupador(vKey);
			}
		},
		onRouterMatched: function (evt) {
			if (this.atualizarLista) {
				this.atualizarLista = false;
				var oList = this.getView().byId("list0");
				oList.getBinding("items").refresh(true);
			}
		},
		_goToLeitura: function (vAgrupador) {
			this.atualizarLista = true;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("S1", { // nome do Router
				agrupador: vAgrupador // Parametro do routing
			});
		},
		handleSearch: function (oEvent) {
			var oList = this.getView().byId("list0");
			var vQuery = oEvent.getSource().getValue();
			var oFilter = null;
			//vQuery = "'" + vQuery + "'";
			if (vQuery && vQuery.length > 0) {
				oFilter = new sap.ui.model.Filter("Agrupador", sap.ui.model.FilterOperator.EQ, vQuery);
			}
			var oBinding = oList.getBinding("items");
			oBinding.filter(oFilter);
		},

		handleListItemPress: function (oEvent) {
			var oBindingContext = oEvent.getSource().getBindingContext("GE");
			if (oBindingContext) {
				var vAgrupador = oBindingContext.getProperty("Agrupador");
				this._onListItemPress(vAgrupador);
			}
		},
		_onListItemPress: function (vAgrupador) {
			this.getView().setBusy(true);
			var vAgrupadorOut = this.myFormatter.shiftLeadingZeros(vAgrupador);
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var that = this;

			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			var vText = oBundle.getText("message_edit_grouper");
			vText = vText.concat(" ", [vAgrupadorOut], " ");
			vText = vText.concat("?");

			MessageBox.confirm(
				vText, {
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					onClose: function (oAction) {
						if (oAction === "YES") {
							//Imprimir etiquetas
							that._goToLeitura(vAgrupador);
							that.getView().setBusy(false);
							//Abrir BO
							// that._OpenBO(that, "018");

						} else {
							// Não fazer nada.
							MessageToast.show(oBundle.getText("message_canceled_by_user"));
							that.getView().setBusy(false);
						}
					}
				}
			);
		}
	});
});