sap.ui.define([
	"fibria/com/ZFBC_AMEACAS/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"fibria/com/ZFBC_AMEACAS/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, History, formatter, Filter, FilterOperator) {
	"use strict";
	return BaseController.extend("fibria.com.ZFBC_AMEACAS.controller.Worklist", {
		formatter: formatter,
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */
		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			var oViewModel, iOriginalBusyDelay,
				//oTable = this.byId("table");
				// Put down worklist table's original value for busy indicator delay,
				// so it can be restored later on. Busy handling on the table is
				// taken care of by the table itself.
				//iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
				//this._oTable = oTable;
				// keeps the search state
				//this._oTableSearchState = [];
				// Model used to manipulate control states
				oViewModel = new JSONModel({
					//worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
					saveAsTileTitle: this.getResourceBundle().getText("saveAsTileTitle", this.getResourceBundle().getText("worklistViewTitle")),
					shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
					shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
					shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
					unidadeOrganizacional: null,
					categoriaRisco: null,
					responsavel: null,
					tipoVisao: null
				});
			this.setModel(oViewModel, "worklistView"); // Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			/*
				oTable.attachEventOnce("updateFinished", function(){
					// Restore original busy indicator delay for worklist's table
					oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
				});
				*/
			this.setInitialModel();
		},
		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */
		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		/*
			onUpdateFinished : function (oEvent) {
				// update the worklist's object counter after the table update
				var sTitle,
					oTable = oEvent.getSource(),
					iTotalItems = oEvent.getParameter("total");
				// only update the counter if the length is final and
				// the table is not empty
				if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
					sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
				} else {
					sTitle = this.getResourceBundle().getText("worklistTableTitle");
				}
				this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
			},
			*/
		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress: function(oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},
		setInitialModel: function() {
			var arrOrganizacaoFilter = [];
			var arrCatriscoFilter = [];
			var arrFdriscoFilter = [];
			var that = this;
			var oModel = this.getOwnerComponent().getModel();
			
			oModel.read("/GeralRiscos", {
				filters: [],
				success: function(oData) {
					arrOrganizacaoFilter.push({ "Organizacao": "" });
					arrCatriscoFilter.push({ "Catrisco": "" });
					oData.results.map(function(entry) {
						if (arrOrganizacaoFilter.filter(function(item) { return item.Organizacao === entry.Organizacao; }).length === 0) {
							arrOrganizacaoFilter.push({ "Organizacao": entry.Organizacao });
						}
						if (arrCatriscoFilter.filter(function(item) { return item.Catrisco === entry.Catrisco; }).length === 0) {
							arrCatriscoFilter.push({ "Catrisco": entry.Catrisco });
						}
					});
				}
			});
			
			oModel.read("/ResponsavelSet", {
				filters: [],
				success: function(oData) {
					arrFdriscoFilter.push({ "Fdrisco": "" });
					oData.results.map(function(entry) {
							arrFdriscoFilter.push({ "Fdrisco": entry.Fullnname });
					});
					var oFilterModel = new JSONModel();
				 	oFilterModel.setData({
						//"Organizacao": "",
						"OrganizacaoSet": arrOrganizacaoFilter,
						//"Catrisco": "",
						"CatriscoSet": arrCatriscoFilter,
						//"Fdrisco": "",
						"FdriscoSet": arrFdriscoFilter
					});
					that.setModel(oFilterModel, "filter");
				}
			});
		},
		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function() {
			var oViewModel = this.getModel("worklistView"),
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
		/*
			onSearch : function (oEvent) {
				if (oEvent.getParameters().refreshButtonPressed) {
					// Search field's 'refresh' button has been pressed.
					// This is visible if you select any master list item.
					// In this case no new search is triggered, we only
					// refresh the list binding.
					this.onRefresh();
				} else {
					var oTableSearchState = [];
					var sQuery = oEvent.getParameter("query");

					if (sQuery && sQuery.length > 0) {
						oTableSearchState = [new Filter("Risco", FilterOperator.Contains, sQuery)];
					}
					this._applySearch(oTableSearchState);
				}

			},
			*/
		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		/*
			onRefresh : function () {
				this._oTable.getBinding("items").refresh();
			},
			*/
		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */
		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showObject: function(oItem) {
			this.getRouter().navTo("object", {
				objectId: oItem.getBindingContext().getProperty("Objid")
			});
		},
		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {object} oTableSearchState an array of filters for the search
		 * @private
		 */
		/*
			_applySearch: function(oTableSearchState) {
				var oViewModel = this.getModel("worklistView");
				this._oTable.getBinding("items").filter(oTableSearchState, "Application");
				// changes the noDataText of the list in case there are no filter results
				if (oTableSearchState.length !== 0) {
					oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
				}
			},
			*/
		handleValueHelpOrganizacao: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogOrganizacao) {
				this._valueHelpDialogOrganizacao = sap.ui.xmlfragment("fibria.com.ZFBC_AMEACAS.fragment.SearchHelpOrganizacao", this);
				this.getView().addDependent(this._valueHelpDialogOrganizacao);
			}
			// create a filter for the binding
			this._valueHelpDialogOrganizacao.getBinding("items").filter([new Filter("Organizacao", sap.ui.model.FilterOperator.Contains, sInputValue)]);
			// open value help dialog filtered by the input value
			this._valueHelpDialogOrganizacao.open(sInputValue);
		},
		_handleOrganizacaoSHSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter("Organizacao", sap.ui.model.FilterOperator.Contains, sValue);
			evt.getSource().getBinding("items").filter([oFilter]);
		},
		_handleOrganizacaoSHClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem"),
				oViewModel = this.getView().getModel("worklistView");
			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId),
					sTitle = oSelectedItem.getTitle();
					//sDescription = oSelectedItem.getDescription();
				//productInput.setSelectedKey(sDescription);
				productInput.setValue(sTitle);
				oViewModel.setProperty("/unidadeOrganizacional", sTitle);
			}
			//evt.getSource().getBinding("items").filter([]);
		},
		handleValueHelpCatrisco: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogCatrisco) {
				this._valueHelpDialogCatrisco = sap.ui.xmlfragment("fibria.com.ZFBC_AMEACAS.fragment.SearchHelpCatrisco", this);
				this.getView().addDependent(this._valueHelpDialogCatrisco);
			}
			// create a filter for the binding
			this._valueHelpDialogCatrisco.getBinding("items").filter([new Filter("Catrisco", sap.ui.model.FilterOperator.Contains, sInputValue)]);
			// open value help dialog filtered by the input value
			this._valueHelpDialogCatrisco.open(sInputValue);
		},
		_handleCatriscoSHSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter("Catrisco", sap.ui.model.FilterOperator.Contains, sValue);
			evt.getSource().getBinding("items").filter([oFilter]);
		},
		_handleCatriscoSHClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem"),
				oViewModel = this.getView().getModel("worklistView");
			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId),
					sTitle = oSelectedItem.getTitle();
					//sDescription = oSelectedItem.getDescription();
				//productInput.setSelectedKey(sDescription);
				productInput.setValue(sTitle);
				oViewModel.setProperty("/categoriaRisco", sTitle);
			}
			//evt.getSource().getBinding("items").filter([]);
		},
		handleValueHelpFdrisco: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogFdrisco) {
				this._valueHelpDialogFdrisco = sap.ui.xmlfragment("fibria.com.ZFBC_AMEACAS.fragment.SearchHelpFdrisco", this);
				this.getView().addDependent(this._valueHelpDialogFdrisco);
			}
			// create a filter for the binding
			this._valueHelpDialogFdrisco.getBinding("items").filter([new Filter("Fdrisco", sap.ui.model.FilterOperator.Contains, sInputValue)]);
			// open value help dialog filtered by the input value
			this._valueHelpDialogFdrisco.open(sInputValue);
		},
		_handleFdriscoSHSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter("Fdrisco", sap.ui.model.FilterOperator.Contains, sValue);
			evt.getSource().getBinding("items").filter([oFilter]);
		},
		_handleFdriscoSHClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem"),
				oViewModel = this.getView().getModel("worklistView");
			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId),
					sTitle = oSelectedItem.getTitle();
					//sDescription = oSelectedItem.getDescription();
				//productInput.setSelectedKey(sDescription);
				productInput.setValue(sTitle);
				oViewModel.setProperty("/responsavel", sTitle);
			}
			//evt.getSource().getBinding("items").filter([]);
		},
		/**
		 *@memberOf fibria.com.ZFBC_AMEACAS.controller.Worklist
		 */
		onExecutar: function() {
			var oViewModel = this.getView().getModel("worklistView"),
				unidadeOrganizacional = oViewModel.getProperty("/unidadeOrganizacional"),
				categoriaRisco = oViewModel.getProperty("/categoriaRisco"),
				responsavel = oViewModel.getProperty("/responsavel"),
				dataInicialRisco = this.getView().byId("dtpDataInicialRisco").getValue(),
				tipoVisao = oViewModel.getProperty("/tipoVisao");
				
				//unidadeOrganizacional = unidadeOrganizacional !== null ? unidadeOrganizacional : " ";
				//categoriaRisco = categoriaRisco !== null ? categoriaRisco : " ";
				//responsavel = responsavel !== null ? responsavel : " ";
				//dataInicialRisco = dataInicialRisco === null || dataInicialRisco === "" ? " " : dataInicialRisco;
				//tipoVisao = tipoVisao !== null ? tipoVisao : " ";
					
			if (!this.getView().byId("dtpDataInicialRisco")._bValid) {
				sap.m.MessageToast.show("Informar uma Data Inicial do Risco válida.", {
					width: "20em"
				});
			}
			else if (tipoVisao === null) {
				sap.m.MessageToast.show("Informar um Tipo de Visão.", {
					width: "20em"
				});
			}
			else {
				var filters = {
					organizacao: unidadeOrganizacional,
					catrisco: categoriaRisco,
					fdrisco: responsavel,
					begda: dataInicialRisco,
					tipovisao: tipoVisao
				};
				sap.ui.getCore().setModel(filters, "VAmeacasFilters");
				this.getRouter().navTo("object");
			}
		},
		onDataPickerChange: function(oEvent) {
			if (!oEvent.getParameter("valid")) {
				oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
			}
			else {
				oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
			}
		}
	});
});