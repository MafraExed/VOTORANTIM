/*global history */
sap.ui.define([
	"vsa/y5gl_re_portal/view/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"vsa/y5gl_re_portal/model/formatter",
	"vsa/y5gl_re_portal/model/grouper",
	"vsa/y5gl_re_portal/model/GroupSortState"
], function (BaseController, JSONModel, Filter, FilterOperator, GroupHeaderListItem, Device, Formatter, grouper, GroupSortState) {
	"use strict";

	return BaseController.extend("vsa.y5gl_re_portal.view.Master", {

		//Formatter: formatter, 

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the master list controller is instantiated. It sets up the event handling for the master/detail communication and other lifecycle tasks.
		 * @public
		 */
		onInit: function () {
			var t = this;
			// Deferred Object 
			this.oUpdateFinishedDeferred = jQuery.Deferred();

			// Control state model
			var oList = this.byId("listMaster"),
				oViewModel = this._createViewModel(),
				// Put down master list's original value for busy indicator delay,
				// so it can be restored later on. Busy handling on the master list is
				// taken care of by the master list itself.
				iOriginalBusyDelay = oList.getBusyIndicatorDelay();

			this._oMultiModel = this.getOwnerComponent().getModel("multi");

			this._oGroupSortState = new GroupSortState(oViewModel, grouper.groupUnitNumber(this.getResourceBundle()));

			window._oList = oList;

			this._oList = oList;
			// keeps the filter and search state
			this._oListFilterState = {
				aFilter: [],
				aSearch: []
			};

			this.setModel(oViewModel, "masterView");
			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			//      oList.attachEventOnce("updateFinished", function () {
			//        // Restore original busy indicator delay for the list
			//        oViewModel.setProperty("/delay", iOriginalBusyDelay);
			//      }, this);

			//       this.getView().addEventDelegate({
			//        onBeforeFirstShow: function () {
			//          this.getOwnerComponent().oListSelector.setBoundMasterList(oList);
			//        }.bind(this)
			//       });

			this.getOwnerComponent().getModel().attachRequestSent(function (oEvent) {
				sap.ui.core.BusyIndicator.show(0);
				//        t._oList.setBusy(true);
				//          if(t.getModel("detailView")){
				//            t.getModel("detailView").setProperty("/busy", true);
				//          }
				//          if(t.getModel("multiView")){
				//            t.getModel("multiView").setProperty("/busy", true);
				//          }
			});

			this.getOwnerComponent().getModel().attachRequestCompleted(function (oEvent) {
				sap.ui.core.BusyIndicator.hide();
				//          t._oList.setBusy(false);
				//          if(t.getModel("detailView")){
				//            t.getModel("detailView").setProperty("/busy", false);
				//          }
				//          if(t.getModel("multiView")){
				//            t.getModel("multiView").setProperty("/busy", false);
				//          }
			});

			sap.ui.core.UIComponent.getRouterFor(this).attachRoutePatternMatched(
				this._onMasterMatched, this);

			//this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);

			this.getRouter().attachBypassed(this.onBypassed, this);

			this.setUnidade();

			this.getAdm();

		},

		onMultipleAction: function () {
			var oItems = this._oList.getItems();
			var aItems = [];
			var bReplace = !Device.system.phone;

			this._oList.setMode("MultiSelect");
			oItems.forEach(function (oItem) {
				if (oItem.getVisible()) {
					aItems.push(oItem.getBindingContext().getObject());
					oItem.setSelected(true);
				}
			});

			this._oMultiModel.setData({
				results: aItems
			});
			this.getRouter().navTo("mRe", {
				banfn: "All",
				bnfpo: "All",
				unidade: "All"
			}, bReplace);

		},

		onMultipleDesAction: function () {
			var oItems = this._oList.getItems();
			var aItems = [];
			var bReplace = !Device.system.phone;

			this._oList.setMode("MultiSelect");
			oItems.forEach(function (oItem) {
				if (oItem.getVisible()) {
					oItem.setSelected(false);
				}
			});

			this._oMultiModel.setData({
				results: []
			});
			this.getRouter().navTo("mRe", {
				banfn: "All",
				bnfpo: "All",
				unidade: "All"
			}, bReplace);

		},

		onUserPress: function (oEvent) {
			var oObject = oEvent.getSource().getParent().getBindingContext().getObject();
			var sTitle = oObject.Bukrs + "/" + oObject.Belnr + "/" + oObject.Gjahr;

			sTitle = this.getResourceBundle().getText("EmailTtl", sTitle);
			sap.m.URLHelper.triggerEmail(oObject.EMail, sTitle);
		},

		onUpdateFinished: function (oEvent) {
			// update the master list object counter after new data is loaded
			this._updateListItemCount(oEvent.getParameter("total"));
			// hide pull to refresh if necessary
			this.byId("pullToRefresh").hide();

			if (oEvent.getParameter("total") > 0 && !Device.system.phone) {

				var sUnidade = this._oList.getItems()[0].getBindingContext().getObject().Unidade;

				var sBelnrRe = this._oList.getItems()[0].getBindingContext().getObject().BelnrRe;

				this.loadDynFields(sUnidade);

				this.getOwnerComponent().getModel('global').setProperty("/unidade", sUnidade);

				this._oList.setMode('SingleSelectMaster');

				if (this.getView().byId("btnMulti")) {
					this.getView().byId("btnMulti").setPressed(false)
				};

				// Se vazio, seleciona primeiro item
				if (this._oList.getItems().length > 0) {
					if (this.sName === "master") {
						if (!sap.ui.Device.system.phone) {
							this._oList.setSelectedItem(this._oList.getItems()[0]);
							this._showDetail(this._oList.getItems()[0]);
						}
					}
					// Seleciona item na lista
					if (this.sName === "sRe") {
						var aItems = this._oList.getItems();
						for (var i = 0; i < aItems.length; i++) {
							var oObject = this._oList.getItems()[i].getBindingContext().getObject();
							if (oObject.Bukrs === this.sBukrs && oObject.Unidade === this.sUnidade &&
								oObject.Belnr === this.sBelnr && oObject.Gjahr === this.sGjahr &&
								oObject.BelnrRe === sBelnrRe) {
								this._oList.setSelectedItem(this._oList.getItems()[i]);
								break;
							}
						}
					}
				}

			} else {
				if (oEvent.getParameter("total") === 0) {
					this.getRouter().navTo("empty", {}, !Device.system.phone);
				}
			}

			// Resolved Object
			this.oUpdateFinishedDeferred.resolve();

			if (this.getView().byId("btnMulti")) {
				if (this._oList.getMode() === "MultiSelect") {
					this.getView().byId("btnMulti").setPressed(true);
				} else {
					this.getView().byId("btnMulti").setPressed(false);
				}
			}

		},

		onSearch: function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				this.onRefresh();
				return;
			}
			var sQuery = oEvent.getParameter("query");
			var aItems = this._oList.getItems();
			var bFound = false;
			var bIndex = 0;
			for (var i = 0; i < aItems.length; i++) {
				var mItem = aItems[i].getBindingContext().getObject();
				if (sQuery && sQuery != "") {
					if (mItem.BelnrRe.toUpperCase().indexOf(sQuery.toUpperCase()) !== -1 ||
						mItem.Gjahr.toUpperCase().indexOf(sQuery.toUpperCase()) !== -1 ||
						mItem.NameLifnrKunnr.toUpperCase().indexOf(sQuery.toUpperCase()) !== -1
					) {
						if (!bFound) {
							bFound = true;
							bIndex = i;
						}
						aItems[i].setVisible(true);
					} else {
						aItems[i].setVisible(false);
					}
				} else {
					if (!bFound) {
						bFound = true;
						bIndex = i;
					}
					aItems[i].setVisible(true);
				}
			}

			if (!bFound) {
				if (sQuery && sQuery.length > 0) {
					sap.m.MessageBox.error(this.getResourceBundle().getText("masterListNotFound"), {
						onClose: function (oAction) {
							if (!Device.system.phone) {
								this.getRouter().navTo("empty", {}, !Device.system.phone);
							}
						}.bind(this)
					});
				}
			} else {
				if (!Device.system.phone) {
					this._oList.setSelectedItem(aItems[bIndex]);
					this._showDetail(aItems[bIndex]);
				}
			}
		},

		onSemanticFilterPress: function () {

			var bInserted = false;

			if (!this._oDialogApprove_S) {
				this._oDialogApprove_S = sap.ui.xmlfragment("AdvancedSearchDialog", "vsa.y5gl_re_portal.view.fragment.advsearch", this);
				this.getView().addDependent(this._oDialogApprove_S);
			}

			this.getModel("advancedSearchHdr").setData({});
			this.getModel("advancedSearchItm").setData({});

			var oAdvancedSearchForm = sap.ui.core.Fragment.byId("AdvancedSearchDialog", "frAdvancedSearchHdr");
			oAdvancedSearchForm.removeAllContent();
			oAdvancedSearchForm.setVisible(false);

			/* Início - T3RODRIGODC - 26/07/2021 */
			// Range de valores para o campo Documento
			bInserted = this.setRangeBelnr(oAdvancedSearchForm);
			/* Início - T3RODRIGODC - 26/07/2021 */

			// Valida se há algum registro marcado para saída como filtro 
			var aHFields = this.getModel("hFields").getData().results.filter(function (oItem) {
				return oItem.Filtro === "1";
			});

			if (aHFields.length > 0) {
				oAdvancedSearchForm.setVisible(true);
				var sLanguage = sap.ui.getCore().getConfiguration().getLanguage().slice(0, 2).toLowerCase();
				aHFields.forEach(function (oDynamicField) {
					var sText = oDynamicField["Ddtext" + sLanguage].toLowerCase();
					sText = sText.charAt(0).toUpperCase() + sText.slice(1);
					var sField = "";
					var sFieldName = oDynamicField.Fieldname.toLowerCase();
					var aSplit = sFieldName.split("_");
					for (var i = 0; i < aSplit.length; i++) {
						sField = sField + aSplit[i].charAt(0).toUpperCase() + aSplit[i].slice(1);
					}

					/* Início - T3RODRIGODC - 26/07/2021 */
					// Desconsiderar o campo BELNR, pois ele será fixo
					if (sField === 'Belnr') {
						return;
					}
					/* Início - T3RODRIGODC - 26/07/2021 */

					// Label
					oAdvancedSearchForm.addContent(new sap.m.Label({
						text: sText
					}));

					// Field
					var oField;
					var sBinding = "{advancedSearchHdr>/" + sField + "}";
					if (oDynamicField.Datatype == 'D') {
						var sBindingFrom = "{advancedSearchHdr>/" + sField + "From}";
						var sBindingTo = "{advancedSearchHdr>/" + sField + "To}";
						oField = new sap.m.DateRangeSelection({
							dateValue: sBindingFrom,
							secondDateValue: sBindingTo,
							displayFormat: "dd/MM/yyyy",
							valueFormat: "dd/MM/yyyy"
						});
					} else if (oDynamicField.Datatype == 'T') {
						oField = new sap.m.TimePicker({
							value: sBinding,
							valueFormat: "HHmmss",
							displayFormat: "HH:mm:ss"
						});
					} else {
						oField = new sap.m.Input({
							value: sBinding
						});
					}

					bInserted = true;
					oAdvancedSearchForm.addContent(oField);

				});
			}

			oAdvancedSearchForm = sap.ui.core.Fragment.byId("AdvancedSearchDialog", "frAdvancedSearchItm");
			oAdvancedSearchForm.removeAllContent();
			oAdvancedSearchForm.setVisible(false);

			// Valida se há algum registro marcado para saída como filtro 
			var aDFields = this.getModel("dFields").getData().results.filter(function (oItem) {
				return oItem.Filtro === "1";
			});

			if (aDFields.length > 0) {
				oAdvancedSearchForm.setVisible(true);
				var sLanguage = sap.ui.getCore().getConfiguration().getLanguage().slice(0, 2).toLowerCase();
				aDFields.forEach(function (oDynamicField) {
					var sText = oDynamicField["Ddtext" + sLanguage].toLowerCase();
					sText = sText.charAt(0).toUpperCase() + sText.slice(1);
					var sField = "";
					var sFieldName = oDynamicField.Fieldname.toLowerCase();
					var aSplit = sFieldName.split("_");
					for (var i = 0; i < aSplit.length; i++) {
						sField = sField + aSplit[i].charAt(0).toUpperCase() + aSplit[i].slice(1);
					}

					// Label
					oAdvancedSearchForm.addContent(new sap.m.Label({
						text: sText
					}));

					// Field
					var oField;
					var sBinding = "{advancedSearchItm>/" + sField + "}";
					if (oDynamicField.Datatype == 'D') {
						var sBindingFrom = "{advancedSearchItm>/" + sField + "From}";
						var sBindingTo = "{advancedSearchItm>/" + sField + "To}";
						oField = new sap.m.DateRangeSelection({
							dateValue: sBindingFrom,
							secondDateValue: sBindingTo,
							displayFormat: "dd/MM/yyyy",
							valueFormat: "dd/MM/yyyy"
						});
					} else if (oDynamicField.Datatype == 'T') {
						oField = new sap.m.TimePicker({
							value: sBinding,
							valueFormat: "HHmmss",
							displayFormat: "HH:mm:ss"
						});
					} else {
						oField = new sap.m.Input({
							value: sBinding
						});
					}

					bInserted = true;
					oAdvancedSearchForm.addContent(oField);

				});
			}

			if (bInserted) {
				this._oDialogApprove_S.open();
			} else {
				sap.m.MessageBox.error(this.getResourceBundle().getText("noFilterFound"));
			}
		},

		/* Início - T3RODRIGODC - 26/07/2021 */
		isBelnr: function (val) {
			var isNumber = /^\d+$/.test(val);
			var isSizeOk = val.length <= 10;

			return isNumber && isSizeOk;
		},

		setRangeBelnrFieldName: function () {

			if (this._nInc > 0) {
				this._nInc++;
			} else {
				this._nInc = 1;
			}

			this._rangeBelnrFieldName = "oRangeBelnr" + this._nInc;
			return this._rangeBelnrFieldName;
		},

		getRangeBelnrFieldName: function () {
			return this._rangeBelnrFieldName;
		},

		setRangeBelnr: function (oAdvancedSearchForm) {
			var that = this;
			oAdvancedSearchForm.setVisible(true);

			try {

				oAdvancedSearchForm.addContent(new sap.m.Label({
					text: "Nº. Documento"
				}));

				var oField = new sap.m.MultiInput(this.setRangeBelnrFieldName(), {
					showValueHelp: false
				});

				oField.addValidator(function (args) {
					var belnr = args.text;

					if (that.isBelnr(belnr)) {
						belnr = String(belnr).padStart(10, '0');
						return new sap.m.Token({
							key: belnr,
							text: belnr
						});
					}
				});

				oAdvancedSearchForm.addContent(oField);
				return true;
			} catch (e) {
				return false;
			}

		},

		checkBelnrIsInRange: function (nBelnr) {

			var sFieldName = this.getRangeBelnrFieldName();
			var oField = sap.ui.getCore().byId(sFieldName);
			var aTokens = oField.getTokens();

			if (!aTokens.length) {
				return true;
			}

			for (var i = 0; i < aTokens.length; i++) {
				if (aTokens[i].getKey() === nBelnr) {
					return true;
				}
			}

			return false;
		},
		/* Fim - T3RODRIGODC - 26/07/2021 */

		onUndoFilter: function () {
			var aItems = this._oList.getItems();
			for (var i = 0; i < aItems.length; i++) {
				aItems[i].setVisible(true);
			}
			if (!Device.system.phone && aItems.length > 0) {
				this._oList.setSelectedItem(aItems[0]);
				this._showDetail(aItems[0]);
			}
		},

		onConfirmAdvSearch: function () {
			var aItems = this._oList.getItems();
			var oFiltersHdr = this.getModel("advancedSearchHdr").getData();
			var oFiltersItm = this.getModel("advancedSearchItm").getData();

			var ahFields = this.getOwnerComponent().getModel("hFields").getData().results;
			var adFields = this.getOwnerComponent().getModel("dFields").getData().results;
			var bFound = false;
			var bIndex = 0;
			var sValueBase = "";
			var sValueCompare = "";

			for (var i = 0; i < aItems.length; i++) {
				var oItem = aItems[i]
				var oItemData = oItem.getBindingContext().getObject();

				// Montagem dos detalhes do objeto 
				var oDetailObject = {};
				var oDetailConfig = {};

				if (oItemData) {
					var oItemDetail = oItemData;

					ahFields.forEach(function (oFieldBase) {
						var sFieldName = oFieldBase.Fieldname.toLowerCase();
						var aSplit = sFieldName.split("_");
						sFieldName = "";
						for (var i = 0; i < aSplit.length; i++) {
							sFieldName = sFieldName + aSplit[i].charAt(0).toUpperCase() + aSplit[i].slice(1);
						}

						var oValue = oItemDetail[sFieldName];
						var bTextBase = false;
						if (oFieldBase.Datatype == 'D') {
							oValue = Formatter.dateExternal(oValue, "YYYY/MM/dd");
						} else if (oFieldBase.Datatype == 'V') {
							oValue = Formatter.currencyExternal(oValue);
						} else if (oFieldBase.Datatype == 'T') {
							oValue = Formatter.timeExternal(oValue);
						} else {
							bTextBase = true;
						}

						oDetailObject[sFieldName] = oValue;
						oDetailConfig[sFieldName] = {
							isText: bTextBase
						};

					});

					// Cabeçalho
					var bVisible = true;
					if (Object.keys(oFiltersHdr).length > 0) {
						var aKeys = Object.keys(oFiltersHdr);

						aKeys.forEach(function (sKey) {
							if (typeof oFiltersHdr[sKey].getTime !== "undefined") {
								if (sKey.indexOf("From") !== -1) {
									var iIndexOf = sKey.indexOf("From");
									var sKeyBase = sKey.substring(0, iIndexOf);
									var sKeyTo = sKeyBase + "To";
									var dValueFrom = oFiltersHdr[sKey];
									var dValueTo = oFiltersHdr[sKeyTo];
									// Validação do Campo de Destino
									if (oDetailObject[sKeyBase].length > 0) {
										try {
											var dDateBase = new Date(oDetailObject[sKeyBase]);
											if (dDateBase.getTime() < dValueFrom.getTime() || dDateBase.getTime() > dValueTo.getTime()) {
												bVisible = false;
											}
										} catch (e) {
											bVisible = false;
										}
									} else {
										bVisible = false;
									}
								}
							} else {
								if (!oDetailConfig[sKey].isText) {
									if (oFiltersHdr[sKey] !== oDetailObject[sKey]) {
										bVisible = false;
									}
								} else {
									sValueBase = oDetailObject[sKey].toUpperCase();
									sValueCompare = oFiltersHdr[sKey].toUpperCase();
									if (sValueBase.indexOf(sValueCompare) === -1) {
										bVisible = false;
									}
								}
							}
						});
					}

					// Item
					if (oItemData.ToDetalhes.__list && oItemData.ToDetalhes.__list.length > 0) {
						if (Object.keys(oFiltersItm).length > 0) {
							var iItemVisible = 0;
							for (var z = 0; z < oItemData.ToDetalhes.__list.length; z++) {
								var bItemVisible = true;
								var sObjectPath = "/" + oItemData.ToDetalhes.__list[z];
								oItemDetail = this.getModel().getData(sObjectPath);

								oDetailObject = {};
								oDetailConfig = {};
								adFields.forEach(function (oFieldBase) {
									var sFieldName = oFieldBase.Fieldname.toLowerCase();
									var aSplit = sFieldName.split("_");
									sFieldName = "";
									for (var i = 0; i < aSplit.length; i++) {
										sFieldName = sFieldName + aSplit[i].charAt(0).toUpperCase() + aSplit[i].slice(1);
									}

									var oValue = oItemDetail[sFieldName];
									var bTextBase = false;
									if (oFieldBase.Datatype == 'D') {
										oValue = Formatter.dateExternal(oValue, "YYYY/MM/dd");
									} else if (oFieldBase.Datatype == 'V') {
										oValue = Formatter.currencyExternal(oValue);
									} else if (oFieldBase.Datatype == 'T') {
										oValue = Formatter.timeExternal(oValue);
									} else {
										bTextBase = true;
									}

									oDetailObject[sFieldName] = oValue;
									oDetailConfig[sFieldName] = {
										isText: bTextBase
									};
								});

								aKeys = Object.keys(oFiltersItm);
								aKeys.forEach(function (sKey) {
									if (typeof oFiltersItm[sKey].getTime !== "undefined") {
										if (sKey.indexOf("From") !== -1) {
											var iIndexOf = sKey.indexOf("From");
											var sKeyBase = sKey.substring(0, iIndexOf);
											var sKeyTo = sKeyBase + "To";
											var dValueFrom = oFiltersItm[sKey];
											var dValueTo = oFiltersItm[sKeyTo];
											// Validação do Campo de Destino
											if (oDetailObject[sKeyBase].length > 0) {
												try {
													var dDateBase = new Date(oDetailObject[sKeyBase]);
													if (dDateBase.getTime() < dValueFrom.getTime() || dDateBase.getTime() > dValueTo.getTime()) {
														bItemVisible = false;
													}
												} catch (e) {
													bItemVisible = false;
												}
											} else {
												bItemVisible = false;
											}
										}
									} else {
										if (!oDetailConfig[sKey].isText) {
											if (oFiltersItm[sKey] !== oDetailObject[sKey]) {
												bItemVisible = false;
											}
										} else {
											sValueBase = oDetailObject[sKey].toUpperCase();
											sValueCompare = oFiltersItm[sKey].toUpperCase();
											if (sValueBase.indexOf(sValueCompare) === -1) {
												bItemVisible = false;
											}
										}
									}
								});

								if (bItemVisible) {
									iItemVisible++;
								}
							}

							if (iItemVisible === 0) {
								bVisible = false;
							}
						}
					} else {
						if (Object.keys(oFiltersItm).length > 0) {
							bVisible = false;
						}
					}

					/* Inicio - T3RODRIGODC - 26/07/2021 */
					if (bVisible) {
						bVisible = this.checkBelnrIsInRange(oItemData.Belnr);
					}
					/* Fim - T3RODRIGODC - 26/07/2021 */

					// Resultado
					oItem.setVisible(bVisible);
					if (bVisible) {
						if (!bFound) {
							bFound = true;
							bIndex = i;
						}
					}
				} else {
					oItem.setVisible(false);
				}
			}

			this._oDialogApprove_S.close();

			if (bFound) {
				this._oList.setSelectedItem(aItems[bIndex]);
				this._showDetail(aItems[bIndex]);
			} else {
				if (!Device.system.phone) {
					this.getRouter().navTo("empty", {}, !Device.system.phone);
				}
			}
		},

		onMultiSelectPress: function (e) {
			this._oList.removeSelections();
			if (this._oList.getMode() === "MultiSelect") {
				this._oList.setMode('SingleSelectMaster');
				this.getView().byId("headerBar").removeAllContentLeft();
				this.getOwnerComponent().getModel('global').setProperty("/multi", false);
				if (this.getRouter().oHashChanger.getHash().indexOf("mRe") != -1) {
					this._showDetail(this._oList.getItems()[0]);
				}
			} else {
				this._oList.setMode('MultiSelect');
				if (sap.ui.Device.system.phone) {
					this.getView().byId("headerBar").addContentLeft(
						new sap.m.Button({
							icon: "sap-icon://paging",
							press: [this.onNavMul, this]
						}, this)
					);
				}
				this.getView().byId("headerBar").invalidate();
				this._oMultiModel.setData({
					results: []
				});
				this.getOwnerComponent().getModel('global').setProperty("/multi", true);
				if (!Device.system.phone) {;
					this._showMulti(this._oList.getItems()[0], true);
				} else {
					this.getView().byId("btnNavMul").setVisible(true);
				}
			}
		},

		onRefresh: function () {
			this._oList.getBinding("items").refresh();
			//this.getRouter().navTo("empty", {}, true);
		},

		onSort: function (oEvent) {
			var sKey = oEvent.getSource().getSelectedItem().getKey(),
				aSorters = this._oGroupSortState.sort(sKey);

			this._applyGroupSort(aSorters);
		},

		onGroup: function (oEvent) {
			var sKey = oEvent.getSource().getSelectedItem().getKey(),
				aSorters = this._oGroupSortState.group(sKey);

			this._applyGroupSort(aSorters);
		},

		onOpenViewSettings: function () {
			if (!this._oViewSettingsDialog) {
				this._oViewSettingsDialog = sap.ui.xmlfragment("vsa.y5gl_re_portal.view.fragment.filter", this);
				this.getView().addDependent(this._oViewSettingsDialog);
				// forward compact/cozy style into Dialog
				this._oViewSettingsDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			}
			this._oViewSettingsDialog.open();
		},

		onConfirmViewSettingsDialog: function (oEvent) {
			var aFilterItems = oEvent.getParameters().filterItems,
				aFilters = [],
				aCaptions = [];

			// update filter state:
			// combine the filter array and the filter string
			aFilterItems.forEach(function (oItem) {
				switch (oItem.getKey()) {
				case "Filter1":
					aFilters.push(new Filter("Valor", FilterOperator.LE, 100));
					break;
				case "Filter2":
					aFilters.push(new Filter("Valor", FilterOperator.GT, 100));
					break;
				default:
					break;
				}
				aCaptions.push(oItem.getText());
			});

			this._oListFilterState.aFilter = aFilters;
			this._updateFilterBar(aCaptions.join(", "));
			this._applyFilterSearch();
		},

		onSelectionChange: function (oEvent) {
			var oArray = [];
			var oSelItems = this._oList.getSelectedItems();
			if (this._oList.getMode() === "MultiSelect") {
				for (var i = 0; i < oSelItems.length; i++) {
					oArray.push(oSelItems[i].getBindingContext().getObject());
				}
				this._oMultiModel.setData({
					results: oArray
				});
				if (!Device.system.phone) {
					this._showMulti(oEvent.getParameter("listItem") || oEvent.getSource());
				}
			} else {
				this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
			}
		},

		onNavMul: function () {
			this._showMulti(this._oList.getItems()[0], true);
		},

		onBypassed: function () {
			this._oList.removeSelections(true);
		},

		createGroupHeader: function (oGroup) {
			return new GroupHeaderListItem({
				title: oGroup.text,
				upperCase: false
			});
		},

		onNavBack: function () {
			history.go(-1);
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		_createViewModel: function () {
			return new JSONModel({
				isFilterBarVisible: false,
				filterBarLabel: "",
				busy: false,
				delay: 0,
				title: this.getResourceBundle().getText("masterTitleCount", [0]),
				noDataText: this.getResourceBundle().getText("masterListNoDataText"),
				sortBy: "Name1",
				groupBy: "None"
			});
		},

		_onMasterMatched: function (oEvent) {
			this.sName = oEvent.getParameter("name");
			var oParams = oEvent.getParameter("arguments");
			this.sBukrs = (oParams && oParams.bukrs ? oParams.bukrs : "");
			this.sBelnr = (oParams && oParams.belnr ? oParams.belnr : "");
			this.sGjahr = (oParams && oParams.gjahr ? oParams.gjahr : "");
			this.sUnidade = (oParams && oParams.unidade ? oParams.unidade : "");

			//      // Resolved Object
			//      jQuery.when(this.oUpdateFinishedDeferred).then(
			//          jQuery.proxy(function() {
			//            var aItems;
			//
			//            // Se vazio, seleciona primeiro item
			//            if (this._oList.getItems().length > 0){
			//              if (this.sName === "master") {
			//                if(!sap.ui.Device.system.phone){
			//                  this._oList.setSelectedItem(this._oList.getItems()[0]);
			//                  this._showDetail(this._oList.getItems()[0]);
			//                }
			//              }
			//              // Seleciona item na lista
			//              if (this.sName === "sRe") {
			//                aItems = this._oList.getItems();
			//                for (var i = 0; i < aItems.length; i++) {
			//                  var oObject = this._oList.getItems()[i].getBindingContext().getObject();
			//                  if (oObject.Bukrs === this.sBukrs && oObject.Unidade === this.sUnidade &&
			//                    oObject.Belnr === this.sBelnr && oObject.Gjahr   === this.sGjahr) {
			//                    this._oList.setSelectedItem(this._oList.getItems()[i]);
			//                    break;
			//                  }
			//                }
			//              }
			//            }
			//          }.bind(this)));
		},

		onAdmSel: function () {
			this._oDialogAdm.open();
		},

		_showDetail: function (oItem) {
			var bReplace = !Device.system.phone;

			var sBukrs,
				sBelnr,
				sGjahr,
				sUnidade,
				sBelnrRe = undefined;
			if (oItem) {
				sBukrs = oItem.getBindingContext().getProperty("Bukrs");
				sBelnr = oItem.getBindingContext().getProperty("Belnr");
				sGjahr = oItem.getBindingContext().getProperty("Gjahr");
				sUnidade = oItem.getBindingContext().getProperty("Unidade");
				sBelnrRe = oItem.getBindingContext().getProperty("BelnrRe");
			} else {
				//        sBukrs   = oItem.getBindingContext().getProperty("Bukrs");
				//        sBelnr   = oItem.getBindingContext().getProperty("Belnr");
				//        sGjahr   = oItem.getBindingContext().getProperty("Gjahr");
				//        sUnidade = oItem.getBindingContext().getProperty("Unidade")
				//        sEbeln = this.getRouter().oHashChanger.getHash().substring(4, 14);
				//        sUnidade = this.getRouter().oHashChanger.getHash().substring(15, 19);
			}
			this.getRouter().navTo("sRe", {
				bukrs: sBukrs,
				belnr: sBelnr,
				gjahr: sGjahr,
				unidade: sUnidade,
				belnr_re: sBelnrRe
			}, bReplace);
		},

		_showMulti: function (oItem, bInitial) {
			var bReplace = !Device.system.phone;
			if (bInitial) {
				this.getRouter().navTo("mRe", {
					bukrs: "Dummy",
					belnr: "Dummy",
					gjahr: "Dummy",
					unidade: "Dummy"
				}, bReplace);
			} else {
				this.getRouter().navTo("mRe", {
					bukrs: oItem.getBindingContext().getProperty("Bukrs"),
					belnr: oItem.getBindingContext().getProperty("Belnr"),
					gjahr: oItem.getBindingContext().getProperty("Gjahr"),
					unidade: oItem.getBindingContext().getProperty("Unidade")
				}, bReplace);
			}
		},

		_updateListItemCount: function (iTotalItems) {
			var sTitle;
			// only update the counter if the length is final
			if (this._oList.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("masterTitleCount", [iTotalItems]);
				this.getModel("masterView").setProperty("/title", sTitle);
			}
		},

		_applyFilterSearch: function () {
			var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
				oViewModel = this.getModel("masterView");
			this._oList.getBinding("items").filter(aFilters, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aFilters.length !== 0) {
				oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"));
			} else if (this._oListFilterState.aSearch.length > 0) {
				// only reset the no data text to default when no new search was triggered
				oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataText"));
			}
		},

		_applyGroupSort: function (aSorters) {
			this._oList.getBinding("items").sort(aSorters);
		},

		_updateFilterBar: function (sFilterBarText) {
			var oViewModel = this.getModel("masterView");
			oViewModel.setProperty("/isFilterBarVisible", (this._oListFilterState.aFilter.length > 0));
			oViewModel.setProperty("/filterBarLabel", this.getResourceBundle().getText("masterFilterBarText", [sFilterBarText]));
		}

	});

});