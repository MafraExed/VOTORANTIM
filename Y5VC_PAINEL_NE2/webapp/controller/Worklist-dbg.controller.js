sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/m/Button',
	'sap/ui/model/Sorter',
	'sap/m/Text',
	'sap/m/MessageBox',
	'sap/m/Dialog',
	"sap/m/QuickViewGroupElement",
], function (BaseController, JSONModel, formatter, Filter, FilterOperator, Button, Sorter, Text, MessageBox, Dialog, QuickViewGroupElement) {
	"use strict";

	var todas;
	var kunnr;
	var vencidas;
	var avencer;
	var prometido;
	var belnr;
	var bukrs;
	var buzei;
	var fikrs;
	var gjahr;
	var knkli;

	return BaseController.extend("Y5VC_PAINEL_NE2.Y5VC_PAINEL_NE2.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {
			var oViewModel,
				iOriginalBusyDelay,
				oTable = this.byId("table");

			// Put down worklist table's original value for busy indicator delay,
			// so it can be restored later on. Busy handling on the table is
			// taken care of by the table itself.
			iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			// keeps the search state
			this._aTableSearchState = [];

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
				saveAsTileTitle: this.getResourceBundle().getText("saveAsTileTitle", this.getResourceBundle().getText("worklistViewTitle")),
				shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
				tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay: 0
			});
			this.setModel(oViewModel, "worklistView");

			this.loading(false);

			var oQuickViewCard = this.byId("quickViewCard");
			oQuickViewCard.setShowVerticalScrollBar(true);

			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			oTable.attachEventOnce("updateFinished", function () {
				// Restore original busy indicator delay for worklist's table
				oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			});

			this.getRouter().getRoute("worklist").attachPatternMatched(this._atttable, this);

			// Add the worklist page to the flp routing history
			this.addHistoryEntry({
				title: this.getResourceBundle().getText("worklistViewTitle"),
				icon: "sap-icon://table-view",
				intent: "#Y5VC_PAINEL_NE2-display"
			}, true);
		},

		_atttable: function (oEvent) {
			this.getView().getModel().refresh(true);
		},

		getUrlParam: function (param) {
			let value = window.location.href.substring(window.location.href.indexOf(param + "=") + param.length + 1);
			if (value.indexOf("&") !== -1) value = value.substring(0, value.indexOf("&"));
			return value.toLowerCase();
		},

		filterbarInitialized: function (oEvent) {

			let setDefault = false;
			let aaf;
			let cliente;

			if (window.location.href.indexOf("aaf=") !== -1 && window.location.href.indexOf("cliente=") !== -1) {
				aaf = this.getUrlParam("aaf");
				cliente = this.getUrlParam("cliente");
				setDefault = true;
			};

			if (this._varChanged) return;

			const variantManager = this.byId("ST_SmartFilterBar").getVariantManagement();
			const variantItems = variantManager.getVariantItems();

			for (const variantItem of variantItems) {

				if (setDefault) {
					if (variantItem.getText().toLowerCase() === aaf) {
						this._varChanged = true;
						variantManager.setCurrentVariantId(variantItem.getKey())
						break;
					}
				}
				variantItem.setProperty("readOnly", false);
			}

			if (setDefault) {
				const filterData = this.byId("ST_SmartFilterBar").getFilterData();

				if (cliente.indexOf(",") === -1) {
					filterData.Kunnr = cliente;
					this.byId("ST_SmartFilterBar").setFilterData(filterData);
				}

				window.history.pushState('', '', window.location.href.substring(0, window.location.href.lastIndexOf("?")));
				this.byId("ST_SmartFilterBar").search();
			}
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
		onUpdateFinished: function (oEvent) {
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



		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress: function (oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},

		formatHighLight: function (oValue) {
			if (oValue === "RN") {
				return "Success";
			} else if (oValue === "VN") {
				return "Error";
			} else {
				return "None";
			}

			//return "Information";
		},

		buscaImagem: function () {
			var sRootPath = jQuery.sap.getModulePath("Y5VC_PAINEL_NE2.Y5VC_PAINEL_NE2");
			var caminho_imagem = sRootPath + "/imagens/voto_load.gif";
			this.getView().byId("idimg").setSrc(caminho_imagem);
			this.getView().byId("idimg").addStyleClass("CLASSE_VSA");

		},

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function () {
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

		onSearch: function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var aTableSearchState = [];
				var sQuery = oEvent.getParameter("query");

				if (sQuery && sQuery.length > 0) {
					aTableSearchState = [new Filter("Kunnr", FilterOperator.Contains, sQuery)];
				}
				this._applySearch(aTableSearchState);
			}

		},

		AfterUpdate1: function (oEvent) {

			var linhas = this.getView().byId("table").getBinding("rows").getLength();
			if (linhas === 0) {
				this.getView().byId("idHor").setVisible(false);
				return;
			}

			this.getView().byId("idHor").setVisible(true);

			var Land1;
			for (var i = 0; i < this.getView().byId("ST_SmartFilterBar").getFilterData().Land1.ranges.length; i++) {
				if (i === 0) {
					Land1 = this.getView().byId("ST_SmartFilterBar").getFilterData().Land1.ranges[i].value1;
				} else {
					Land1 = Land1 + ';' + this.getView().byId("ST_SmartFilterBar").getFilterData().Land1.ranges[i].value1;
				}

			}

			var Bukrs;
			for (i = 0; i < this.getView().byId("ST_SmartFilterBar").getFilterData().Bukrs.ranges.length; i++) {
				if (i === 0) {
					Bukrs = this.getView().byId("ST_SmartFilterBar").getFilterData().Bukrs.ranges[i].value1;
				} else {
					Bukrs = Bukrs + ';' + this.getView().byId("ST_SmartFilterBar").getFilterData().Bukrs.ranges[i].value1;
				}
			}

			var Kkber;
			for (i = 0; i < this.getView().byId("ST_SmartFilterBar").getFilterData().Kkber.ranges.length; i++) {
				if (i === 0) {
					Kkber = this.getView().byId("ST_SmartFilterBar").getFilterData().Kkber.ranges[i].value1;
				} else {
					Kkber = Kkber + ';' + this.getView().byId("ST_SmartFilterBar").getFilterData().Kkber.ranges[i].value1;
				}
			}

			fikrs = this.getView().byId("ST_SmartFilterBar").getFilterData().Fikrs;
			kunnr = this.getView().byId("ST_SmartFilterBar").getFilterData().Kunnr;
			//kunnr   = this.getView().byId("IdKunnr2").getValue();
			var stcd1 = this.getView().byId("ST_SmartFilterBar").getFilterData().Stcd1;
			var stcd2 = this.getView().byId("ST_SmartFilterBar").getFilterData().Stcd2;
			var niveldet = this.getView().byId("idSel").getSelectedKey();

			if (stcd1 === "" || !stcd1) {
				stcd1 = "X";
			}

			if (stcd2 === "" || !stcd2) {
				stcd2 = "X";
			}

			if (kunnr === "") {
				kunnr = "X";
			}

			var oViewModel = this.getView().getModel();
			oViewModel.setProperty("/busy", true);

			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("ZET_VCFI_DADOS_GERAISSet", {
					Kunnr: kunnr,
					Stcd1: stcd1,
					Stcd2: stcd2,
					Land1: Land1,
					Fikrs: fikrs,
					NivelDet: niveldet,
					Bukrs: Bukrs,
					Kkber: Kkber
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));

			var oObj = this.byId("idQuickViewGroup");

			var oTemplate = new QuickViewGroupElement({
				label: "{}",
				value: "{}",
				type: "{}"
			});

			if (kunnr !== "X" && kunnr !== "") {
				oObj.bindAggregation("elements", {
					path: '/ZET_VCFI_CONTATO_CLISet',
					filters: [new Filter("Kunnr", FilterOperator.EQ, kunnr),
					new Filter("Kkber", FilterOperator.EQ, Kkber),
					new Filter("NivelDet", FilterOperator.EQ, niveldet)
					],
					template: new QuickViewGroupElement({
						label: "{ContTyp}",
						value: "{Contat}   {Tag}",
						type: "text"
					})

				});
			}

			// if (stcd1 !== "X" && stcd1 !== "") {
			// 	oObj.bindAggregation("elements", {
			// 		path: '/ZET_VCFI_CONTATO_CLISet',
			// 		filters: [new Filter("Stcd1", FilterOperator.EQ, stcd1),
			// 			new Filter("Kkber", FilterOperator.EQ, Kkber),
			// 			new Filter("NivelDet", FilterOperator.EQ, niveldet)
			// 		],
			// 		template: new QuickViewGroupElement({
			// 			label: "{ContTyp}",
			// 			value: "{Contat}   {Tag}",
			// 			type: "{ContTyp}"
			// 		})

			// 	});
			// }

			// if (stcd2 !== "X" && stcd2 !== "") {
			// 	oObj.bindAggregation("elements", {
			// 		path: '/ZET_VCFI_CONTATO_CLISet',
			// 		filters: [new Filter("Stcd2", FilterOperator.EQ, stcd2),
			// 			new Filter("Kkber", FilterOperator.EQ, Kkber),
			// 			new Filter("NivelDet", FilterOperator.EQ, niveldet)
			// 		],
			// 		template: new QuickViewGroupElement({
			// 			label: "{ContTyp}",
			// 			value: "{Contat}   {Tag}",
			// 			type: "{ContTyp}"
			// 		})

			// 	});
			// }

		},

		_bindView: function (sObjectPath) {
			var oViewModel = this.getView().getModel(),
				oDataModel = this.getModel();

			this.buscaImagem();

			var that = this;

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oDataModel.metadataLoaded().then(function () {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							//	oViewModel.setProperty("/busy", true);
							that.loading(true);
						});
					},
					dataReceived: function () {
						//oViewModel.setProperty("/busy", false);
						that.loading(false);
						that.getView().byId("idHor").setVisible(true);
					}
				}
			});
		},

		_onBindingChange: function () {
			var oView = this.getView(),
				oViewModel = this.getView().getModel(),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.Reserva,
				sObjectName = oObject.Item;

			//oViewModel.setProperty("/busy", false);
			// Add the object page to the flp routing history
			this.addHistoryEntry({
				title: this.getResourceBundle().getText("objectTitle") + " - " + sObjectName,
				icon: "sap-icon://enter-more",
				intent: "#Resgistraraceitedebaixasporreserva-display&/ZET_VCFI_DADOSGERAISSet/" + sObjectId
			});

			// oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("saveAsTileTitle", [sObjectName]));
			// oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			// oViewModel.setProperty("/shareSendEmailSubject",
			// 	oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			// oViewModel.setProperty("/shareSendEmailMessage",
			// 	oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		},

		AfterUpdate2: function (oEvent) {
			var Bukrs = this.getView().byId("ST_SmartFilterBar").getFilterData().Kunnr;
			var Kkber = this.getView().byId("ST_SmartFilterBar").getFilterData();
			var kunnr = this.getView().byId("IdKunnr").getValue();
			var stcd1 = this.getView().byId("IdStcd1").getValue();
			var stcd2 = this.getView().byId("IdStcd2").getValue();

			var oTable = this.byId("table2");
			oTable.getParameter("bindingParams").filters.push(kunnr, Bukrs, Kkber, stcd1, stcd2);

			oTable.getBinding("items").filter([kunnr, Bukrs, Kkber, stcd1, stcd2]);

			//var oFilterPernr = new sap.ui.model.Filter("Kunnr", sap.ui.model.FilterOperator.EQ, "1001");
			// this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			// this.getModel().metadataLoaded().then(function () {
			// 	var sObjectPath = this.getModel().createKey("ZET_GLHR_DETAIL_BENEFICIOSSet", {
			// 		IPernr: Pernr,
			// 		IBeneficio: Beneficio,
			// 		ITipo: "V"

			// 	});
			// 	this._bindView("/" + sObjectPath);
			// }.bind(this));

		},

		TitCobraBeforeRebindTable: function (oEvent) {

			// var stcd1 = this.getView().byId("ST_SmartFilterBar").getFilterData().Stcd1;
			// if (stcd1 !== "") {
			// 	oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
			// 		path: "Stcd1",
			// 		operator: "EQ",
			// 		value1: stcd1
			// 	}));
			// }

			// var stcd2 = this.getView().byId("ST_SmartFilterBar").getFilterData().Stcd2;
			// if (stcd2 !== "") {
			// 	oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
			// 		path: "Stcd2",
			// 		operator: "EQ",
			// 		value1: stcd2
			// 	}));
			// }

			var niveldet = this.getView().byId("idSel").getSelectedKey();

			oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
				path: "NivelDet",
				operator: "EQ",
				value1: niveldet
			}));

			if (vencidas === 1) {
				vencidas = "";
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Status",
					operator: "EQ",
					value1: 'VN'
				}));
			}

			if (avencer === 1) {
				avencer = "";
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Status",
					operator: "EQ",
					value1: 'AV'
				}));
			}

			if (prometido === 1) {
				prometido = "";
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Status",
					operator: "EQ",
					value1: 'PM'
				}));
			}

			var oParameters = oEvent.getParameter("bindingParams");
			oParameters.sorter.push(new sap.ui.model.Sorter("Belnr", true));

		},

		onHelpKunnr: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog1) {
				this._valueHelpDialog1 = sap.ui.xmlfragment("Y5VC_PAINEL_NE2.Y5VC_PAINEL_NE2.view.Kunnr", this);
				this.getView().addDependent(this._valueHelpDialog1);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog1.open(sInputValue);
		},

		handleSuggest: function (oEvent) {
			var sTerm = oEvent.getParameter("suggestValue");
			var aFilters = [];
			if (sTerm) {
				aFilters.push(new Filter("Kunnr", sap.ui.model.FilterOperator.Contains, sTerm));
			}
			oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
			//oEvent.getSource().getBinding("suggestionItems").filter.resume();
		},

		handleSuggeststcd1: function (oEvent) {
			var sTerm = oEvent.getParameter("suggestValue");
			var aFilters = [];
			if (sTerm) {
				aFilters.push(new Filter("Stcd1", sap.ui.model.FilterOperator.Contains, sTerm));
			}
			oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
			//oEvent.getSource().getBinding("suggestionItems").filter.resume();
		},

		handleSuggeststcd2: function (oEvent) {
			var sTerm = oEvent.getParameter("suggestValue");
			var aFilters = [];
			if (sTerm) {
				aFilters.push(new Filter("Stcd2", sap.ui.model.FilterOperator.Contains, sTerm));
			}
			oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
			//oEvent.getSource().getBinding("suggestionItems").filter.resume();
		},

		_handleValueHelpClose: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			this._valueHelpDialog1 = null;
			this._valueHelpDialog4 = null;
			this._valueHelpDialog6 = null;
			this._valueHelpDialog3 = null;
			this._valueHelpDialog2 = null;
			this._valueHelpDialog7 = null;

			if (oSelectedItem) {

				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());

				//	this.getView().byId("IdCapa").setValue(oSelectedItem.getBindingContext().getProperty("Capa"));
				//	this.getView().byId("IdUM").setValue(oSelectedItem.getBindingContext().getProperty("Um"));
			}
			evt.getSource().getBinding("items").filter([]);
			this.getView().byId(this.inputId).setValueState("None");
		},

		onSearchKunnr: function (oEvent) {
			var sValue = oEvent.getParameter("value");

			if (!sValue) {
				sValue = " ";
			}

			var sFilter = sValue;
			var oFilter = new sap.ui.model.Filter("Kunnr", sap.ui.model.FilterOperator.Contains, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);

		},

		OnClear2: function (oEvent) {
			var veiculo = this.getView().byId("IdTpVeiculo").getValue();
			var oModel2 = new sap.ui.model.json.JSONModel();

			var serviceUrl = "/sap/opu/odata/sap/ZGWCBLE_REMESSA_SAIDA_SRV/ZET_CBMM_CF_VEIC_HSet/$count?$filter=Matnr eq '" +
				veiculo + "'";

			serviceUrl = encodeURI(serviceUrl);

			oModel2.loadData(serviceUrl, null, false, "GET", false, false, null);
			var oInd = oModel2.getData();

			if (oInd < 1) {

				sap.m.MessageToast.show("Veículo inválido!");
				this.getView().byId("IdTpVeiculo").setValueState("Error");
				return;
			}

			this.getView().byId("IdTpVeiculo").setValueState("None");

			serviceUrl = "/sap/opu/odata/sap/ZGWCBLE_REMESSA_SAIDA_SRV/ZET_CBMM_CF_VEIC_HSet(Matnr='" +
				veiculo + "')";

			serviceUrl = encodeURI(serviceUrl);

			oModel2.loadData(serviceUrl, null, false, "GET", false, false, null);

			this.getView().byId("IdCapa").setValue(oModel2.oData.d.Capa);
			this.getView().byId("IdUM").setValue(oModel2.oData.d.Um);

		},

		Partida: function () {

			todas = 1;
			var smart = this.getView().byId("it_items2");
			smart.rebindTable("e");
			// var oFilter = new sap.u
		},

		Vencidas: function () {
			vencidas = 1;
			var smart = this.getView().byId("it_items2");
			smart.rebindTable("e");
			// var oFilter = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.Contains, "AV");

			// var oList = this.getView().byId("table");
			// oList.getBinding("items").filter([oFilter]);

			// oList.getBinding("items").refresh();
		},

		Avencer: function () {
			avencer = 1;
			var smart = this.getView().byId("it_items2");
			smart.rebindTable("e");
		},

		Prometido: function () {
			prometido = 1;
			var smart = this.getView().byId("it_items2");
			smart.rebindTable("e");

		},

		Lista: function () {

			var Kunnr = this.getView().byId("ST_SmartFilterBar").getFilterData().Kunnr;
			//var Kunnr = this.getView().byId("IdKunnr2").getValue();
			var stcd1 = this.getView().byId("ST_SmartFilterBar").getFilterData().Stcd1;

			var stcd2 = this.getView().byId("ST_SmartFilterBar").getFilterData().Stcd2;

			var kkber = this.getView().byId("ST_SmartFilterBar").getFilterData().Kkber.ranges[0].value1;

			this.getRouter().navTo("ListaClientes", {
				Kunnr: Kunnr,
				stcd1: stcd1,
				stcd2: stcd2,
				kkber: kkber
			});
		},

		ConsultHist: function (oEvent) {
			var selecionados = this.getView().byId("table").getSelectedIndices();
			var table = this.getView().byId("table");
			var este = this;

			if (this.getView().byId("table").getBinding("rows").getLength() < 1) {
				sap.m.MessageBox.error("Não é possível navegar, nenhum documento foi carregado");
				return;
			}


			var data = new Date();
			data.setDate(data.getDate() - 540);

			var datalow = data.toLocaleDateString();
			datalow = datalow.replace("/", ".");
			datalow = datalow.replace("/", ".");

			var datanew = new Date();

			var datahigh = datanew.toLocaleDateString();
			datahigh = datahigh.replace("/", ".");
			datahigh = datahigh.replace("/", ".");

			var Fikrs7 = this.getView().byId("ST_SmartFilterBar").getFilterData().Fikrs;
			var syst = table.getContextByIndex(0).getObject().Syst;
			var Knkli2 = este.getView().byId("table").getContextByIndex(0).getObject().Knkli;

			if (syst === "E05") {

				sap.m.URLHelper.redirect(
					"http://vide0502.votorantim.grupo:8005/sap/bc/gui/sap/its/webgui/?~transaction=ZGLFI784%20S_FIKRS-LOW=" + Fikrs7 + ";S_KNKLI-LOW=" +
					Knkli2 + ";S_DTCRI-LOW=" + datalow + ";S_DTCRI-HIGH=" + datahigh + ";&~okcode=ONLI", true);
			} else if (syst === "E04") {
				sap.m.URLHelper.redirect(
					"http://vide0401.votorantim.grupo:8004/sap/bc/gui/sap/its/webgui/?~transaction=ZGLFI784%20S_FIKRS-LOW=" + Fikrs7 + ";S_KNKLI-LOW=" +
					Knkli2 + ";S_DTCRI-LOW=" + datalow + ";S_DTCRI-HIGH=" + datahigh + ";&~okcode=ONLI", true);
			}

		},

		Cred: function (oEvent) {
			var selecionados = this.getView().byId("table").getSelectedIndices();
			var table = this.getView().byId("table");
			var este = this;

			if (this.getView().byId("table").getBinding("rows").getLength() < 1) {
				sap.m.MessageBox.error("Não é possível navegar, nenhum documento foi carregado");
				return;
			}

			var Kunnr3 = this.getView().byId("ST_SmartFilterBar").getFilterData().Kunnr;
			var kkber3 = this.getView().byId("ST_SmartFilterBar").getFilterData().Kkber.ranges[0].value1;
			var syst = table.getContextByIndex(0).getObject().Syst;

			if (syst === "E05") {

				sap.m.URLHelper.redirect(
					"http://vide0502.votorantim.grupo:8005/sap/bc/gui/sap/its/webgui/?~transaction=FD33%20RF02L-KUNNR=" + Kunnr3 + ";RF02L-KKBER=" +
					kkber3 + ";RF02L-D0105=X;RF02L-D0110=X;RF02L-D0210=X;RF02L-D0220=X&~okcode=/00", true);
			} else if (syst === "E04") {
				sap.m.URLHelper.redirect(
					"http://vide0401.votorantim.grupo:8004/sap/bc/gui/sap/its/webgui/?~transaction=FD33%20RF02L-KUNNR=" + Kunnr3 + ";RF02L-KKBER=" +
					kkber3 + ";RF02L-D0105=X;RF02L-D0110=X;RF02L-D0210=X;RF02L-D0220=X&~okcode=/00", true);
			}
		},

		RegCont: function (oEvent) {
			var selecionados = this.getView().byId("table").getSelectedIndices();
			var table = this.getView().byId("table");
			var este = this;

			if (this.getView().byId("table").getBinding("rows").getLength() < 1) {
				sap.m.MessageBox.error("Não é possível registrar contato, nenhum documento foi carregado");
				return;
			}

			if (selecionados.length < 1) {

				var texto = "Nenhum item selecionado, gravar nota geral?";
				var dialog = new Dialog({
					title: "Confirmação",
					type: "Message",
					content: new Text({
						text: texto
					}),
					beginButton: new Button({
						text: "Sim",
						press: function () {
							//	var Kunnr2 = este.getView().byId("IdKunnr2").getValue();

							var kunnr2 = este.getView().byId("table").getContextByIndex(0).getObject().Kunnr2;
							var Knkli2 = este.getView().byId("table").getContextByIndex(0).getObject().Knkli;
							var stcd1 = este.getView().byId("ST_SmartFilterBar").getFilterData().Stcd1;

							var stcd2 = este.getView().byId("ST_SmartFilterBar").getFilterData().Stcd2;

							var kkber = este.getView().byId("ST_SmartFilterBar").getFilterData().Kkber.ranges[0].value1;

							var Fikrs = este.getView().byId("ST_SmartFilterBar").getFilterData().Fikrs;

							var geral = "X";
							este.getRouter().navTo("RegContato", {
								Kunnr: kunnr2,
								Knkli: Knkli2,
								stcd1: stcd1,
								stcd2: stcd2,
								kkber: kkber,
								Fikrs: Fikrs,
								Geral: geral,
							});

							dialog.close();

						}
					}),
					endButton: new Button({
						text: "Cancelar",
						press: function () {
							dialog.close();
						}
					}),
					afterClose: function () {
						dialog.destroy();
					}
				});
				dialog.open();

			} else {

				texto = "Registrar notas para os documentos selecionados?";
				dialog = new Dialog({
					title: "Confirmação",
					type: "Message",
					content: new Text({
						text: texto
					}),
					beginButton: new Button({
						text: "Sim",
						press: function () {
							var Kunnr2;
							var Knkli3;
							var stcd1;
							var stcd2;
							var kkber;
							var fikrs2;
							var bukrs2;
							var belnr2;
							var buzei2;
							var gjahr2;

							for (var i = 0; i < selecionados.length; i++) {

								Knkli3 = este.getView().byId("table").getContextByIndex(0).getObject().Knkli;
								kkber = table.getContextByIndex([selecionados[i]]).getObject().Kkber;
								fikrs2 = table.getContextByIndex([selecionados[i]]).getObject().Fikrs;
								if (i === 0) {
									Kunnr2 = table.getContextByIndex([selecionados[i]]).getObject().Kunnr;
									bukrs2 = table.getContextByIndex([selecionados[i]]).getObject().Bukrs;
									belnr2 = table.getContextByIndex([selecionados[i]]).getObject().Belnr;
									buzei2 = table.getContextByIndex([selecionados[i]]).getObject().Buzei;
									gjahr2 = table.getContextByIndex([selecionados[i]]).getObject().Gjahr;
								} else {
									Kunnr2 = Kunnr2 + ";" + table.getContextByIndex([selecionados[i]]).getObject().Kunnr;
									bukrs2 = bukrs2 + ";" + table.getContextByIndex([selecionados[i]]).getObject().Bukrs;
									belnr2 = belnr2 + ";" + table.getContextByIndex([selecionados[i]]).getObject().Belnr;
									buzei2 = buzei2 + ";" + table.getContextByIndex([selecionados[i]]).getObject().Buzei;
									gjahr2 = gjahr2 + ";" + table.getContextByIndex([selecionados[i]]).getObject().Gjahr;
								}
							}

							este.getRouter().navTo("RegContato", {
								Kunnr: Kunnr2,
								Knkli: Knkli3,
								stcd1: stcd1,
								stcd2: stcd2,
								kkber: kkber,
								Fikrs: fikrs2,
								Belnr: belnr2,
								Bukrs: bukrs2,
								Buzei: buzei2,
								Gjahr: gjahr2
							});

							dialog.close();

						}
					}),
					endButton: new Button({
						text: "Cancelar",
						press: function () {
							dialog.close();
						}
					}),
					afterClose: function () {
						dialog.destroy();
					}
				});
				dialog.open();

			}

		},

		SimReneg: function (oEvent) {

			// var selecionados = this.getView().byId("table").getSelectedItems();
			var table = this.getView().byId("table");

			// if (selecionados.length < 1) {
			// 	sap.m.MessageBox.error("Nenhum item selecionado");
			// 	return;
			// }

			// if (selecionados.length > 1) {
			// 	sap.m.MessageBox.error("Selecionar apenas um item");
			// 	return;
			// }
			// var bukrs = table.getContextByIndex([selecionados[0]]).getObject().Bukrs;
			// var kunnr = table.getContextByIndex([selecionados[0]]).getObject().Kunnr;
			var syst = table.getContextByIndex(0).getObject().Syst;

			if (syst === "E05") {

				sap.m.URLHelper.redirect(
					"http://vide0502.votorantim.grupo:8005/sap/bc/gui/sap/its/webgui/?~transaction=ZGLFI637%20&~okcode=ONLI", true);
			} else if (syst === "E04") {
				sap.m.URLHelper.redirect(
					"http://vide0401.votorantim.grupo:8004/sap/bc/gui/sap/its/webgui/?~transaction=ZGLFI637%20&~okcode=ONLI", true);
			}
		},

		EmiBol: function (oEvent) {

			var selecionados = this.getView().byId("table").getSelectedIndices();
			var table = this.getView().byId("table");

			if (selecionados.length < 1) {
				sap.m.MessageBox.error("Nenhum item selecionado");
				return;
			}

			if (selecionados.length > 1) {
				sap.m.MessageBox.error("Selecionar apenas um item");
				return;
			}
			var bukrs3 = table.getContextByIndex([selecionados[0]]).getObject().Bukrs;
			var belnr3 = table.getContextByIndex([selecionados[0]]).getObject().Belnr;
			var Gjahr3 = table.getContextByIndex([selecionados[0]]).getObject().Gjahr;
			var Zlsch = table.getContextByIndex([selecionados[0]]).getObject().Zlsch;
			var xis = "X";

			var syst = table.getContextByIndex([selecionados[0]]).getObject().Syst;

			if (syst === "E05") {

				sap.m.URLHelper.redirect(
					"http://vide0502.votorantim.grupo:8005/sap/bc/gui/sap/its/webgui/?~transaction=ZVCFI5109_004%20P_BUKRS=" + bukrs3 + ";P_BELNR=" +
					belnr3 + ";P_GJAHR=" + Gjahr3 + ";P_ZLSCH=" + Zlsch + ";P_REIMP=" + xis, true);
			} else if (syst === "E04") {
				sap.m.URLHelper.redirect(
					"http://vide040.votorantim.grupo:8004/sap/bc/gui/sap/its/webgui/?~transaction=ZVCFI5109_004%20P_BUKRS=" + bukrs3 + ";P_BELNR=" +
					belnr3 + ";P_GJAHR=" + Gjahr3 + ";P_ZLSCH=" + Zlsch + ";P_REIMP=" + xis, true);
			}
		},

		EditarContato: function (oEvent) {

			var Kkber;
			for (var i = 0; i < this.getView().byId("ST_SmartFilterBar").getFilterData().Kkber.ranges.length; i++) {
				if (i === 0) {
					Kkber = this.getView().byId("ST_SmartFilterBar").getFilterData().Kkber.ranges[i].value1;
				} else {
					Kkber = Kkber + ';' + this.getView().byId("ST_SmartFilterBar").getFilterData().Kkber.ranges[i].value1;
				}
			}

			var Kunnr = this.getView().byId("ST_SmartFilterBar").getFilterData().Kunnr;
			//var Kunnr = this.getView().byId("IdKunnr2").getValue();
			var stcd1 = this.getView().byId("ST_SmartFilterBar").getFilterData().Stcd1;
			var stcd2 = this.getView().byId("ST_SmartFilterBar").getFilterData().Stcd2;
			var fikrs3 = this.getView().byId("ST_SmartFilterBar").getFilterData().Fikrs;
			var niveldet = this.getView().byId("idSel").getSelectedKey();

			this.getRouter().navTo("EditarContatos", {
				Kunnr: Kunnr,
				stcd1: stcd1,
				stcd2: stcd2,
				Kkber: Kkber,
				Fikrs: fikrs3,
				NivelDet: niveldet
			});

		},

		LinkDoc: function (oEvent) {
			var Vbeln = oEvent.getSource().getText();
			var syst = oEvent.getSource().getBindingContext().getObject().Syst;

			if (syst === "E05") {

				sap.m.URLHelper.redirect("http://vide0502.votorantim.grupo:8005/sap/bc/gui/sap/its/webgui/?~transaction=VF03%20VBRK-VBELN=" +
					Vbeln +
					"&~okcode=/00", true);
			} else if (syst === "E04") {
				sap.m.URLHelper.redirect("http://vide0401.votorantim.grupo:8004/sap/bc/gui/sap/its/webgui/?~transaction=VF03%20VBRK-VBELN=" +
					Vbeln +
					"&~okcode=/00", true);
			}
		},

		LinkDocBelnr: function (oEvent) {

			var bukrs3 = oEvent.getSource().getBindingContext().getObject().Bukrs;
			var belnr3 = oEvent.getSource().getBindingContext().getObject().Belnr;
			var Gjahr3 = oEvent.getSource().getBindingContext().getObject().Gjahr;

			var syst = oEvent.getSource().getBindingContext().getObject().Syst;

			if (syst === "E05") {
				sap.m.URLHelper.redirect("http://vide0502.votorantim.grupo:8005/sap/bc/gui/sap/its/webgui/?~transaction=FB03%20RF05L-BELNR=" +
					belnr3 +
					";RF05L-BUKRS=" + bukrs3 + ";RF05L-GJAHR=" + Gjahr3 + "&~okcode=/00", true);
			} else if (syst === "E04") {
				sap.m.URLHelper.redirect("http://vide0401.votorantim.grupo:8004/sap/bc/gui/sap/its/webgui/?~transaction=FB03%20RF05L-BELNR=" +
					belnr3 +
					";RF05L-BUKRS=" + bukrs3 + ";RF05L-GJAHR=" + Gjahr3 + "&~okcode=/00", true);
			}

		},

		VisualizarNotas: function (oEvent) {

			var selecionados = this.getView().byId("table4").getSelectedIndices();
			var table = this.getView().byId("table4");

			if (selecionados.length < 1) {
				sap.m.MessageBox.error("Nenhum item selecionado");
				return;
			}
			var FilterFikrs;
			var FilterNotaId;
			var FilterGjahrNota;
			for (var i = 0; i < selecionados.length; i++) {
				if (i === 0) {
					FilterFikrs = table.getContextByIndex([selecionados[i]]).getObject().Fikrs;
					FilterNotaId = table.getContextByIndex([selecionados[i]]).getObject().NotaId;
					FilterGjahrNota = table.getContextByIndex([selecionados[i]]).getObject().GjahrNota;
				} else {
					FilterFikrs = FilterFikrs + ";" + table.getContextByIndex([selecionados[i]]).getObject().Fikrs;
					FilterNotaId = FilterNotaId + ";" + table.getContextByIndex([selecionados[i]]).getObject().NotaId;
					FilterGjahrNota = FilterGjahrNota + ";" + table.getContextByIndex([selecionados[i]]).getObject().GjahrNota;
				}
			}

			var oModel2 = new sap.ui.model.json.JSONModel();
			var serviceUrl = "/sap/opu/odata/sap/ZGWVCFI_PAINEL_NEGOCIACAO_SRV/ZET_VCFI_BUSCA_NOTASet(Fikrs='" +
				FilterFikrs + "',NotaId='" + FilterNotaId + "',GjahrNota='" + FilterGjahrNota + "')";

			oModel2.loadData(serviceUrl, null, false, "GET", false, false, null);
			var oInd = oModel2.getData();

			var that = this;
			var oModel = this.getView().getModel();
			var stexto = oModel2.oData.d.Texto;

			//	var test = "\n" + stexto + "\n ricardo \n alcantara \n";

			var est = stexto.replace(/&&/g, "\n");

			var dialog = "";
			dialog = new Dialog({
				title: "Motivo de Reprovação",
				type: "Message",
				content: [
					new sap.m.Label({
						text: "Notas",
						labelFor: "submitDialogTextarea"
					}),
					new sap.m.TextArea("submitDialogTextarea", {
						id: "IdTextArea",
						value: est,
						//value: "\n TESTE TABELAS REGISTRO CONTATO CLIENTES. \n TESTE DE QUEBRA DE LINHA 01. \n  \n TALEXANDRETA--21/07/2020------ \n",
						width: "150%",
						editable: true,
						rows: 20,
						cols: 80,
						//liveChange: getText()
						//placeholder: "Digite aqui."
					})
				],
				beginButton: new Button({
					type: sap.m.ButtonType.Emphasized,
					text: "Ok",
					press: function () {

						dialog.close();

					}.bind(this)
				}),
				endButton: new Button({
					text: "Cancelar",
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.open();
		},

		NotasBeforeRebindTable: function (oEvent) {

			if (belnr) {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Belnr",
					operator: "EQ",
					value1: belnr
				}));
			}

			if (bukrs !== "") {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Bukrs",
					operator: "EQ",
					value1: bukrs
				}));
			}

			if (buzei !== "") {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Buzei",
					operator: "EQ",
					value1: buzei
				}));
			}

			// oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
			// 	path: "Fikrs",
			// 	operator: "EQ",
			// 	value1: fikrs
			// }));

			oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
				path: "Gjahr",
				operator: "EQ",
				value1: gjahr
			}));

			oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
				path: "Knkli",
				operator: "EQ",
				value1: knkli
			}));

		},

		getText: function (texto) {

			var texto = texto;

		},

		NotasVisu: function (oEvent) {

			belnr = oEvent.getSource().getBindingContext().getObject().Belnr;
			bukrs = oEvent.getSource().getBindingContext().getObject().Bukrs;
			buzei = oEvent.getSource().getBindingContext().getObject().Buzei;
			fikrs = oEvent.getSource().getBindingContext().getObject().Fikrs;
			gjahr = oEvent.getSource().getBindingContext().getObject().Gjahr;
			knkli = oEvent.getSource().getBindingContext().getObject().Knkli;

			this.getRouter().navTo("Notas", {
				Belnr: belnr,
				Bukrs: bukrs,
				Buzei: buzei,
				Fikrs: fikrs,
				Gjahr: gjahr,
				Knkli: knkli
			});

			// var smart = this.getView().byId("ItNotas");
			// smart.rebindTable("e");
		},

		AnexosVisu: function (oEvent) {
			var anexos = oEvent.getSource().getText();

			if (anexos === "00000") {
				sap.m.MessageBox.error("Não existe anexo para essa nota!");
				return;
			}

			var NotaId = oEvent.getSource().getBindingContext().getObject().NotaId;
			var GjahrNota = oEvent.getSource().getBindingContext().getObject().GjahrNota;
			var fikrs2 = oEvent.getSource().getBindingContext().getObject().Fikrs;

			this.getRouter().navTo("Anexos", {
				Fikrs: fikrs2,
				NotaId: NotaId,
				GjahrNota: GjahrNota

			});
		},

		Hist: function (oEvent) {
			var selecionados = this.getView().byId("table").getSelectedIndices();
			var table = this.getView().byId("table");

			if (selecionados.length < 1) {
				sap.m.MessageBox.error("Nenhum item selecionado");
				return;
			}

			if (selecionados.length > 1) {
				sap.m.MessageBox.error("Selecionar apenas um item");
				return;
			}

			var Fikrs = table.getContextByIndex([selecionados[0]]).getObject().Fikrs;
			var Belnr = table.getContextByIndex([selecionados[0]]).getObject().Belnr;
			var Bukrs = table.getContextByIndex([selecionados[0]]).getObject().Bukrs;
			var Gjahr = table.getContextByIndex([selecionados[0]]).getObject().Gjahr;
			var Buzei = table.getContextByIndex([selecionados[0]]).getObject().Buzei;

			this.getRouter().navTo("Items", {
				Fikrs: Fikrs,
				Belnr: Belnr,
				Bukrs: Bukrs,
				Gjahr: Gjahr,
				Buzei: Buzei
			});

		},

		Prom: function (oEvent) {

			var table = this.getView().byId("table");

			if (this.getView().byId("table").getBinding("rows").getLength() < 1) {
				sap.m.MessageBox.error("Não é possível navegar, nenhum documento foi carregado");
				return;
			}

			var Fikrs = table.getContextByIndex(0).getObject().Fikrs;
			var Kunnr3 = table.getContextByIndex(0).getObject().Kunnr;
			var Knkli3 = table.getContextByIndex(0).getObject().Knkli;
			var niveldet = this.getView().byId("idSel").getSelectedKey();

			this.getRouter().navTo("Promessas", {
				Fikrs: Fikrs,
				Kunnr: Kunnr3,
				Knkli: Knkli3,
				NivelDet: niveldet
			});

		},
		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function () {
			var oTable = this.byId("table");
			oTable.getBinding("items").refresh();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showObject: function (oItem) {
			this.getRouter().navTo("Items", {
				Cliente: oItem.getBindingContext().getProperty("Kunnr")
			});
		},

		formatterTestStatus: function (a) {
			var b = sap.ushell.Container.getUser().getFullName();
			return b;
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
		 * @private
		 */
		_applySearch: function (aTableSearchState) {
			var oTable = this.byId("table"),
				oViewModel = this.getModel("worklistView");
			oTable.getBinding("items").filter(aTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			}
		}

	});
});