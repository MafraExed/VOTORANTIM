jQuery.sap.registerPreloadedModules({
	"version": "2.0",
	"modules": {
		"Y5GL_RECIBOS/Y5GL_RECIBOS/Component.js": function () {
			sap.ui.define(["sap/ui/core/UIComponent", "sap/ui/Device", "./controller/ErrorHandler"], function (t, s, e) {
				"use strict";
				return t.extend("Y5GL_RECIBOS.Y5GL_RECIBOS.Component", {
					metadata: {
						manifest: "json"
					},
					init: function () {
						this._oErrorHandler = new e(this);
						t.prototype.init.apply(this, arguments);
						this.getRouter().initialize()
					},
					destroy: function () {
						this._oErrorHandler.destroy();
						t.prototype.destroy.apply(this, arguments)
					},
					getContentDensityClass: function () {
						if (this._sContentDensityClass === undefined) {
							if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
								this._sContentDensityClass = ""
							} else if (!s.support.touch) {
								this._sContentDensityClass = "sapUiSizeCompact"
							} else {
								this._sContentDensityClass = "sapUiSizeCozy"
							}
						}
						return this._sContentDensityClass
					}
				})
			});
		},
		"Y5GL_RECIBOS/Y5GL_RECIBOS/controller/App.controller.js": function () {
			sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel"], function (e, t) {
				"use strict";
				return e.extend("Y5GL_RECIBOS.Y5GL_RECIBOS.controller.App", {
					onInit: function () {
						var e, n, o = this.getView().getBusyIndicatorDelay();
						e = new t({
							busy: true,
							delay: 0,
							layout: "OneColumn",
							previousLayout: "",
							actionButtonsInfo: {
								midColumn: {
									fullScreen: false
								}
							}
						});
						this.setModel(e, "appView");
						n = function () {
							e.setProperty("/busy", false);
							e.setProperty("/delay", o)
						};
						this.getOwnerComponent().getModel().metadataLoaded().then(n);
						this.getOwnerComponent().getModel().attachMetadataFailed(n);
						this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass())
					}
				})
			});
		},
		"Y5GL_RECIBOS/Y5GL_RECIBOS/controller/BaseController.js": function () {
			sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History"], function (e, t) {
				"use strict";
				return e.extend("Y5GL_RECIBOS.Y5GL_RECIBOS.controller.BaseController", {
					loading: function (e) {
						if (e === false) {
							this.getView().byId("idGif").addStyleClass("LoadingFalse")
						} else {
							this.getView().byId("idGif").removeStyleClass("LoadingFalse")
						}
					},
					getRouter: function () {
						return this.getOwnerComponent().getRouter()
					},
					getModel: function (e) {
						return this.getView().getModel(e)
					},
					setModel: function (e, t) {
						return this.getView().setModel(e, t)
					},
					getResourceBundle: function () {
						return this.getOwnerComponent().getModel("i18n").getResourceBundle()
					},
					onNavBack: function () {
						var e = t.getInstance().getPreviousHash(),
							i = sap.ushell.Container.getService("CrossApplicationNavigation");
						if (e !== undefined || !i.isInitialNavigation()) {
							history.go(-1)
						} else {
							this.getRouter().navTo("master", {}, true)
						}
					}
				})
			});
		},
		"Y5GL_RECIBOS/Y5GL_RECIBOS/controller/Detail.controller.js": function () {
			sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/m/library", "sap/ui/Device"], function (
				e, t, i, a, o) {
				"use strict";
				var r = a.URLHelper;
				return e.extend("Y5GL_RECIBOS.Y5GL_RECIBOS.controller.Detail", {
					formatter: i,
					onInit: function () {
						var e = new t({
							busy: false,
							delay: 0
						});
						this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
						this.setModel(e, "detailView");
						this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this))
					},
					onSendEmailPress: function () {
						var e = this.getModel("detailView");
						r.triggerEmail(null, e.getProperty("/shareSendEmailSubject"), e.getProperty("/shareSendEmailMessage"))
					},
					onShareInJamPress: function () {
						var e = this.getModel("detailView"),
							t = sap.ui.getCore().createComponent({
								name: "sap.collaboration.components.fiori.sharing.dialog",
								settings: {
									object: {
										id: location.href,
										share: e.getProperty("/shareOnJamTitle")
									}
								}
							});
						t.open()
					},
					_onObjectMatched: function (e) {
						var t = e.getParameter("arguments").Zparam;
						var i = e.getParameter("arguments").Zdesc;
						while (i.indexOf("_") != -1) {
							i = i.replace("_", "/")
						}
						this.getView().byId("idTitleRecibos").setText(i);
						this.getView().byId("SALARIO").setVisible(false);
						this.getView().byId("ADIANTAMENTO_15").setVisible(false);
						this.getView().byId("FERIAS").setVisible(false);
						this.getView().byId("INFORME_RENDIMENTO").setVisible(false);
						this.getView().byId("PGTO_MENSAL").setVisible(false);
						this.getView().byId("PPRV").setVisible(false);
						this.getView().byId("PRV").setVisible(false);
						this.getView().byId(t).setVisible(true)
					},
					onBackMaster: function () {
						this.getRouter().navTo("master")
					},
					onVoltar: function () {
						this.getRouter().navTo("master")
					},
					_bindView: function (e) {
						var t = this.getModel("detailView");
						t.setProperty("/busy", false);
						this.getView().bindElement({
							path: e,
							events: {
								change: this._onBindingChange.bind(this),
								dataRequested: function () {
									t.setProperty("/busy", true)
								},
								dataReceived: function () {
									t.setProperty("/busy", false)
								}
							}
						})
					},
					_onBindingChange: function () {
						var e = this.getView(),
							t = e.getElementBinding();
						if (!t.getBoundContext()) {
							this.getRouter().getTargets().display("detailObjectNotFound");
							this.getOwnerComponent().oListSelector.clearMasterListSelection();
							return
						}
						var i = t.getPath(),
							a = this.getResourceBundle(),
							o = e.getModel().getObject(i),
							r = o.Programm,
							s = o.Zparam,
							d = o.Zdesc,
							n = this.getModel("detailView");
						this.getOwnerComponent().oListSelector.selectAListItem(i);
						n.setProperty("/saveAsTileTitle", a.getText("shareSaveTileAppTitle", [d]));
						n.setProperty("/shareOnJamTitle", s);
						n.setProperty("/shareSendEmailSubject", a.getText("shareSendEmailObjectSubject", [r]));
						n.setProperty("/shareSendEmailMessage", a.getText("shareSendEmailObjectMessage", [s, r, location.href]));
						var l = this.getView().byId("IdPeriodo_SALARIO");
						var g = this.getView().byId("IdPeriodo_PPRV");
						var c = this.getView().byId("IdPeriodo_PRV");
						var h = new sap.ui.model.Filter("ITipo", sap.ui.model.FilterOperator.EQ, "A");
						l.getBinding("items").filter([h]);
						g.getBinding("items").filter([h]);
						c.getBinding("items").filter([h])
					},
					_onMetadataLoaded: function () {
						var e = this.getView().getBusyIndicatorDelay(),
							t = this.getModel("detailView");
						t.setProperty("/delay", 0);
						t.setProperty("/busy", true);
						t.setProperty("/delay", e)
					},
					onCloseDetailPress: function () {
						this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
						this.getOwnerComponent().oListSelector.clearMasterListSelection();
						this.getRouter().navTo("master")
					},
					toggleFullScreen: function () {
						var e = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
						this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !e);
						if (!e) {
							this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
							this.getModel("appView").setProperty("/layout", "MidColumnFullScreen")
						} else {
							this.getModel("appView").setProperty("/layout", this.getModel("appView").getProperty("/previousLayout"))
						}
					},
					onSave: function () {
						var e = this.getView().byId("idTitleRecibos").getText();
						var t;
						var i;
						var a;
						var r = !o.system.phone;
						var s;
						var d;
						var n;
						i = "Pagto_Mensal";
						switch (e) {
						case "ADIANTAMENTO QUINZENAL":
							t = "A";
							a = this.getView().byId("IdPeriodo_ADMTO_15").getSelectedKey();
							s = "0";
							break;
						case "FÉRIAS":
							t = "B";
							s = "0";
							a = this.getView().byId("IdPeriodoFERIAS").getSelectedKey();
							break;
						case "INFORME DE RENDIMENTOS":
							t = "C";
							s = "0";
							a = this.getView().byId("IdPeriodoINFORME_RENDIMENTO").getSelectedKey();
							break;
						case "PAGAMENTO MENSAL":
							t = "D";
							s = "0";
							a = this.getView().byId("IdPeriodoPGTO_MENSAL").getSelectedKey();
							break;
						case "PPR/RV":
							t = "E";
							a = this.getView().byId("IdPeriodo_PPRV").getSelectedKey();
							d = this.getView().byId("idAdiantamento_PPRV").getSelected();
							n = this.getView().byId("idPagamento_PPRV").getSelected();
							break;
						case "13º SALÁRIO":
							t = "G";
							a = this.getView().byId("IdPeriodo_SALARIO").getSelectedKey();
							d = this.getView().byId("idAdiantamento_SALARIO").getSelected();
							n = this.getView().byId("idPagamento_SALARIO").getSelected();
							break
						}
						if (a === "") {
							sap.m.MessageBox.error("Verifique os parametros informados");
							return
						}
						if (d === true) {
							s = "A"
						}
						if (n === true) {
							s = "P"
						}
						if (e === "INFORME DE RENDIMENTOS") {
							this.onImprime(a, s, t);
							return
						}
						this.getRouter().navTo(i, {
							Periodo: a,
							Tipo: t,
							Check: s
						}, r)
					},
					onImprime: function (e, t, i) {
						var a = "/sap/opu/odata/sap/ZGWGLRH_MEU_CADASTRO_SRV/ZET_GLHR_UPFILESet('0$-$-$" + e + "$" + t + "$" + i + "')/$value";
						var o = document.createElement("a");
						o.href = a;
						o.target = "_blank";
						o.style.display = "none";
						document.body.appendChild(o);
						o.click();
						document.body.removeChild(o)
					},
					onSelect: function (e) {
						var t = e.getParameter("id");
						var i = t.split("detail--");
						var a = i[1];
						var o;
						var r;
						switch (a) {
						case "idAdiantamento_SALARIO":
							o = this.getView().byId("IdPeriodo_SALARIO");
							r = "A";
							break;
						case "idPagamento_SALARIO":
							o = this.getView().byId("IdPeriodo_SALARIO");
							r = "P";
							break;
						case "idAdiantamento_PPRV":
							o = this.getView().byId("IdPeriodo_PPRV");
							r = "A";
							break;
						case "idPagamento_PPRV":
							o = this.getView().byId("IdPeriodo_PPRV");
							r = "P";
							break;
						case "idAdiantamento_PRV":
							o = this.getView().byId("IdPeriodo_SALARIO");
							r = "A";
							break;
						case "idPagamento_PRV":
							o = this.getView().byId("IdPeriodo_PPRV");
							r = "P";
							break
						}
						var s = new sap.ui.model.Filter("ITipo", sap.ui.model.FilterOperator.EQ, r);
						o.getBinding("items").filter([s])
					}
				})
			});
		},
		"Y5GL_RECIBOS/Y5GL_RECIBOS/controller/DetailObjectNotFound.controller.js": function () {
			sap.ui.define(["./BaseController"], function (e) {
				"use strict";
				return e.extend("Y5GL_RECIBOS.Y5GL_RECIBOS.controller.DetailObjectNotFound", {})
			});
		},
		"Y5GL_RECIBOS/Y5GL_RECIBOS/controller/DetailObjectNotFound.js": function () {
			sap.ui.define(["./BaseController"], function (e) {
				"use strict";
				return e.extend("Y5GL_RECIBOS.Y5GL_RECIBOS.controller.DetailObjectNotFound", {})
			});
		},
		"Y5GL_RECIBOS/Y5GL_RECIBOS/controller/ErrorHandler.js": function () {
			sap.ui.define(["sap/ui/base/Object", "sap/m/MessageBox"], function (e, s) {
				"use strict";
				return e.extend("Y5GL_RECIBOS.Y5GL_RECIBOS.controller.ErrorHandler", {
					constructor: function (e) {
						this._oResourceBundle = e.getModel("i18n").getResourceBundle();
						this._oComponent = e;
						this._oModel = e.getModel();
						this._bMessageOpen = false;
						this._sErrorText = this._oResourceBundle.getText("errorText");
						this._oModel.attachMetadataFailed(function (e) {
							var s = e.getParameters();
							this._showServiceError(s.response)
						}, this);
						this._oModel.attachRequestFailed(function (e) {
							var s = e.getParameters();
							if (s.response.statusCode !== "404" || s.response.statusCode === 404 && s.response.responseText.indexOf("Cannot POST") ===
								0) {
								this._showServiceError(s.response)
							}
						}, this)
					},
					_showServiceError: function (e) {
						if (this._bMessageOpen) {
							return
						}
						this._bMessageOpen = true;
						s.error(this._sErrorText, {
							id: "serviceErrorMessageBox",
							details: e,
							styleClass: this._oComponent.getContentDensityClass(),
							actions: [s.Action.CLOSE],
							onClose: function () {
								this._bMessageOpen = false
							}.bind(this)
						})
					}
				})
			});
		},
		"Y5GL_RECIBOS/Y5GL_RECIBOS/controller/ListSelector.js": function () {
			sap.ui.define(["sap/ui/base/Object", "sap/base/Log"], function (t, e) {
				"use strict";
				return t.extend("Y5GL_RECIBOS.Y5GL_RECIBOS.controller.ListSelector", {
					constructor: function () {
						this._oWhenListHasBeenSet = new Promise(function (t) {
							this._fnResolveListHasBeenSet = t
						}.bind(this));
						this.oWhenListLoadingIsDone = new Promise(function (t, e) {
							this._oWhenListHasBeenSet.then(function (n) {
								n.getBinding("items").attachEventOnce("dataReceived", function () {
									if (this._oList.getItems().length) {
										t({
											list: n
										})
									} else {
										e({
											list: n
										})
									}
								}.bind(this))
							}.bind(this))
						}.bind(this))
					},
					setBoundMasterList: function (t) {
						this._oList = t;
						this._fnResolveListHasBeenSet(t)
					},
					selectAListItem: function (t) {
						this.oWhenListLoadingIsDone.then(function () {
							var e = this._oList,
								n;
							if (e.getMode() === "None") {
								return
							}
							n = e.getSelectedItem();
							if (n && n.getBindingContext().getPath() === t) {
								return
							}
							e.getItems().some(function (n) {
								if (n.getBindingContext() && n.getBindingContext().getPath() === t) {
									e.setSelectedItem(n);
									return true
								}
							})
						}.bind(this), function () {
							e.warning("Could not select the list item with the path" + t + " because the list encountered an error or had no items")
						})
					},
					clearMasterListSelection: function () {
						this._oWhenListHasBeenSet.then(function () {
							this._oList.removeSelections(true)
						}.bind(this))
					}
				})
			});
		},
		"Y5GL_RECIBOS/Y5GL_RECIBOS/controller/Master.controller.js": function () {
			sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel", "sap/ui/core/routing/History", "sap/ui/model/Filter",
				"sap/ui/model/Sorter", "sap/ui/model/FilterOperator", "sap/m/GroupHeaderListItem", "sap/ui/Device", "sap/ui/core/Fragment",
				"../model/formatter"
			], function (e, t, i, a, r, s, n, o, l, c) {
				"use strict";
				return e.extend("Y5GL_RECIBOS.Y5GL_RECIBOS.controller.Master", {
					formatter: c,
					onInit: function () {
						var e = this.byId("list"),
							t = this._createViewModel(),
							i = e.getBusyIndicatorDelay();
						this._oList = e;
						this._oListFilterState = {
							aFilter: [],
							aSearch: []
						};
						this.setModel(t, "masterView");
						e.attachEventOnce("updateFinished", function () {
							t.setProperty("/delay", i)
						});
						this.getView().addEventDelegate({
							onBeforeFirstShow: function () {}.bind(this)
						});
						this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
						this.getRouter().attachBypassed(this.onBypassed, this);
						var a = sap.ushell.Container.getUser().getFullName();
						this.getView().byId("idTitleText").setText(a)
					},
					onUpdateFinished: function (e) {
						this._updateListItemCount(e.getParameter("total"))
					},
					onSearch: function (e) {
						if (e.getParameters().refreshButtonPressed) {
							this.onRefresh();
							return
						}
						var t = e.getParameter("query");
						if (t) {
							this._oListFilterState.aSearch = [new a("Zdesc", s.Contains, t)]
						} else {
							this._oListFilterState.aSearch = []
						}
						this._applyFilterSearch()
					},
					onRefresh: function () {
						this._oList.getBinding("items").refresh()
					},
					onOpenViewSettings: function (e) {
						var t = "filter";
						if (e.getSource() instanceof sap.m.Button) {
							var i = e.getSource().getId();
							if (i.match("sort")) {
								t = "sort"
							} else if (i.match("group")) {
								t = "group"
							}
						}
						if (!this.byId("viewSettingsDialog")) {
							l.load({
								id: this.getView().getId(),
								name: "Y5GL_RECIBOS.Y5GL_RECIBOS.view.ViewSettingsDialog",
								controller: this
							}).then(function (e) {
								this.getView().addDependent(e);
								e.addStyleClass(this.getOwnerComponent().getContentDensityClass());
								e.open(t)
							}.bind(this))
						} else {
							this.byId("viewSettingsDialog").open(t)
						}
					},
					onConfirmViewSettingsDialog: function (e) {
						this._applySortGroup(e)
					},
					_applySortGroup: function (e) {
						var t = e.getParameters(),
							i, a, s = [];
						i = t.sortItem.getKey();
						a = t.sortDescending;
						s.push(new r(i, a));
						this._oList.getBinding("items").sort(s)
					},
					onSelectionChange: function (e) {
						var t = e.getSource(),
							i = e.getParameter("selected");
						if (!(t.getMode() === "MultiSelect" && !i)) {
							this._showDetail(e.getParameter("listItem") || e.getSource())
						}
					},
					onBypassed: function () {
						this._oList.removeSelections(true)
					},
					createGroupHeader: function (e) {
						return new n({
							title: e.text,
							upperCase: false
						})
					},
					onNavBack: function () {
						var e = i.getInstance().getPreviousHash(),
							t = sap.ushell.Container.getService("CrossApplicationNavigation");
						if (e !== undefined || !t.isInitialNavigation()) {
							history.go(-1)
						} else {
							t.toExternal({
								target: {
									shellHash: "#Shell-home"
								}
							})
						}
					},
					_createViewModel: function () {
						return new t({
							isFilterBarVisible: false,
							filterBarLabel: "",
							delay: 0,
							title: this.getResourceBundle().getText("masterTitleCount", [0]),
							noDataText: this.getResourceBundle().getText("masterListNoDataText"),
							sortBy: "Zdesc",
							groupBy: "None"
						})
					},
					_onMasterMatched: function () {
						this.getModel("appView").setProperty("/layout", "OneColumn")
					},
					_showDetail: function (e) {
						var t = !o.system.phone;
						var i = e.getBindingContext().getProperty("Zparam");
						var a = e.getBindingContext().getProperty("Zdesc");
						while (a.indexOf("/") != -1) {
							a = a.replace("/", "_")
						}
						this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
						this.getRouter().navTo("object", {
							Zparam: i,
							Zdesc: a
						}, t)
					},
					_updateListItemCount: function (e) {
						var t;
						if (this._oList.getBinding("items").isLengthFinal()) {
							t = this.getResourceBundle().getText("masterTitleCount", [e]);
							this.getModel("masterView").setProperty("/title", t)
						}
					},
					_applyFilterSearch: function () {
						var e = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
							t = this.getModel("masterView");
						this._oList.getBinding("items").filter(e, "Application");
						if (e.length !== 0) {
							t.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"))
						} else if (this._oListFilterState.aSearch.length > 0) {
							t.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataText"))
						}
					},
					formatterIcon: function (e) {
						switch (e) {
						case "ADIANTAMENTO QUINZENAL":
							return "sap-icon://lead";
							break;
						case "FÉRIAS":
							return "sap-icon://travel-expense";
							break;
						case "INFORME DE RENDIMENTOS":
							return "sap-icon://payment-approval";
							break;
						case "PAGAMENTO MENSAL":
							return "sap-icon://monitor-payments";
							break;
						case "13º SALÁRIO":
							return "sap-icon://money-bills";
							break;
						case "PPR/RV":
							return "sap-icon://simple-payment";
							break;
						case "PRV":
							return "sap-icon://batch-payments";
							break
						}
					},
					_updateFilterBar: function (e) {
						var t = this.getModel("masterView");
						t.setProperty("/isFilterBarVisible", this._oListFilterState.aFilter.length > 0);
						t.setProperty("/filterBarLabel", this.getResourceBundle().getText("masterFilterBarText", [e]))
					}
				})
			});
		},
		"Y5GL_RECIBOS/Y5GL_RECIBOS/controller/NotFound.controller.js": function () {
			sap.ui.define(["./BaseController"], function (t) {
				"use strict";
				return t.extend("Y5GL_RECIBOS.Y5GL_RECIBOS.controller.NotFound", {
					onInit: function () {
						this.getRouter().getTarget("notFound").attachDisplay(this._onNotFoundDisplayed, this)
					},
					_onNotFoundDisplayed: function () {
						this.getModel("appView").setProperty("/layout", "OneColumn")
					}
				})
			});
		},
		"Y5GL_RECIBOS/Y5GL_RECIBOS/controller/Pagto_Mensal.controller.js": function () {
			sap.ui.define(["./BaseController"], function (e) {
				"use strict";
				var t;
				var a;
				var i;
				return e.extend("Y5GL_RECIBOS.Y5GL_RECIBOS.controller.Pagto_Mensal", {
					onInit: function () {
						var e = jQuery.sap.getModulePath("Y5GL_RECIBOS.Y5GL_RECIBOS");
						var t = e + "/image/Transparente_CBA.gif";
						this.getView().byId("idimg").setSrc(t);
						this.getRouter().getRoute("Pagto_Mensal").attachPatternMatched(this._onObjectMatched, this)
					},
					onVoltar: function () {
						this.getRouter().navTo("master")
					},
					carrega: function () {
						this.getModel().metadataLoaded().then(function () {
							var e = this.getModel().createKey("ZET_GLHR_HTML5_DETAILSet", {
								Periodo: t,
								Tipo: a,
								Check: i
							});
							this._bindView("/" + e)
						}.bind(this))
					},
					_onObjectMatched: function (e) {
						var n = this.getView().byId("html");
						var o = n.getContent();
						a = e.getParameter("arguments").Tipo;
						i = e.getParameter("arguments").Check;
						t = e.getParameter("arguments").Periodo;
						var r = jQuery.sap.getModulePath("Y5GL_RECIBOS.Y5GL_RECIBOS");
						var s = r + "/image/Cba_aluminio_logo.png";
						var g;
						var d;
						this.getView().byId("idLogo").setSrc(s);
						switch (a) {
						case "A":
							g = r + "/image/adiantamentoquinzenal.png";
							d = "Adiantamento Quinzenal";
							break;
						case "B":
							g = r + "/image/ferias.png";
							d = "Recibo de Férias";
							break;
						case "D":
							g = r + "/image/demonstrativopagamento.png";
							d = "Demonstrativo de pagamento";
							break;
						case "E":
							g = r + "/image/pprv.png";
							d = "Recibo PPR/RV";
							break;
						case "F":
							g = r + "/image/prv.png";
							d = "PRV";
							break;
						case "G":
							g = r + "/image/13salario.png";
							d = "Recibo 13° salário";
							break
						}
						this.getView().byId("idDemonstra").setSrc(g);
						this.getView().byId("idTitleRecibos").setText(d);
						if (o !== "") {
							n.setContent("");
							this.carrega()
						} else {
							this.carrega()
						}
					},
					_bindView: function (e) {
						var t = this;
						var a = this.getView().getModel();
						a.setProperty("/busy", false);
						this.getView().bindElement({
							path: e,
							events: {
								change: this._onBindingChange.bind(this),
								dataRequested: function () {
									t.loading(true)
								},
								dataReceived: function () {
									t.loading(false)
								}
							}
						})
					},
					_onBindingChange: function () {
						var e = this.getView(),
							t = e.getElementBinding();
						if (!t.getBoundContext()) {
							this.getRouter().getTargets().display("detailObjectNotFound");
							return
						}
					},
					AfterUpdate: function (e) {
						var t = this.getView().byId("table").getBinding("rows").getLength();
						if (t > 0) {
							this.getView().byId("table").setVisibleRowCount(t)
						} else {
							this.getView().byId("table").setVisibleRowCount(1)
						}
					},
					onBackMaster: function () {
						this.getRouter().navTo("master")
					},
					onbeforeRebindTable: function (e) {
						if (t !== undefined) {
							e.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
								path: "Periodo",
								operator: "EQ",
								value1: t
							}))
						}
					},
					onImprime: function () {
						var e = "/sap/opu/odata/sap/ZGWGLRH_MEU_CADASTRO_SRV/ZET_GLHR_UPFILESet('0$-$-$" + t + "$" + i + "$" + a + "')/$value";
						var n = document.createElement("a");
						n.href = e;
						n.target = "_blank";
						n.style.display = "none";
						document.body.appendChild(n);
						n.click();
						document.body.removeChild(n)
					}
				})
			});
		},
		"Y5GL_RECIBOS/Y5GL_RECIBOS/controller/admto_15.controller.js": function () {
			sap.ui.define(["./BaseController", "sap/ui/Device", "sap/m/Dialog", "sap/m/Button", "sap/ui/model/json/JSONModel"], function (e, t, a,
				i, r) {
				"use strict";
				var s;
				var o;
				var n;
				return e.extend("Y5GL_RECIBOS.Y5GL_RECIBOS.controller.admto_15", {
					onInit: function () {
						this.getRouter().getRoute("admto_15").attachPatternMatched(this._onObjectMatched, this)
					},
					onmodelContextChange: function (e) {
						var t = new sap.ui.model.Filter("Ano", sap.ui.model.FilterOperator.EQ, o);
						var a = new sap.ui.model.Filter("Mes", sap.ui.model.FilterOperator.EQ, n);
						var i = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, s);
						e.getSource().getBinding("items").filter([i, t, a])
					},
					onBackMaster: function () {
						this.getRouter().navTo("master")
					},
					onVoltar: function () {
						this.getRouter().navTo("master")
					},
					_onObjectMatched: function (e) {
						o = e.getParameter("arguments").ano;
						n = e.getParameter("arguments").mes;
						var t = e.getParameter("arguments").desc;
						var a;
						this.getView().byId("idTitleRecibos").setText(t);
						switch (t) {
						case "ADIANTAMENTO QUINZENAL":
							s = "A";
							break;
						case "FÉRIAS":
							s = "B";
							break;
						case "INFORME DE RENDIMENTOS":
							s = "C";
							break;
						case "PAGAMENTO MENSAL":
							s = "D";
							break;
						case "PPRV":
							s = "E";
							break;
						case "PRV":
							s = "F";
							break;
						case "13º SALÁRIO":
							s = "G";
							break
						}
						a = "/sap/opu/odata/sap/ZGWGLRH_MEU_CADASTRO_SRV/ZET_GLHR_UPFILESet('0$-$-$" + n + "$" + o + "$" + s + "')/$value";
						this.getView().byId("idUploadCollectionItem").setUrl(a);
						var i = new sap.ui.model.Filter("Ano", sap.ui.model.FilterOperator.EQ, o);
						var r = new sap.ui.model.Filter("Mes", sap.ui.model.FilterOperator.EQ, n);
						var l = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, s);
						this.getView().byId("UploadCollection").getBinding("items").filter([l, i, r])
					},
					_bindView: function (e) {
						var t = this.getView().getModel();
						t.setProperty("/busy", false);
						this.getView().bindElement({
							path: e,
							events: {
								change: this._onBindingChange.bind(this),
								dataRequested: function () {
									t.setProperty("/busy", true)
								},
								dataReceived: function () {
									t.setProperty("/busy", false)
								}
							}
						})
					},
					_onBindingChange: function () {
						var e = this.getView(),
							t = e.getElementBinding();
						if (!t.getBoundContext()) {
							this.getRouter().getTargets().display("detailObjectNotFound");
							this.getOwnerComponent().oListSelector.clearMasterListSelection();
							return
						}
						var a = t.getPath(),
							i = this.getResourceBundle(),
							r = e.getModel().getObject(a),
							s = r.Programm,
							o = r.Zparam,
							n = r.Zdesc,
							l = this.getModel("detailView");
						this.getOwnerComponent().oListSelector.selectAListItem(a);
						l.setProperty("/saveAsTileTitle", i.getText("shareSaveTileAppTitle", [n]));
						l.setProperty("/shareOnJamTitle", o);
						l.setProperty("/shareSendEmailSubject", i.getText("shareSendEmailObjectSubject", [s]));
						l.setProperty("/shareSendEmailMessage", i.getText("shareSendEmailObjectMessage", [o, s, location.href]))
					}
				})
			});
		},
		"Y5GL_RECIBOS/Y5GL_RECIBOS/i18n/i18n.properties": '# This is the resource bundle for RECIBOS_PAGAMENTO\n\n#XTIT: Application name\nappTitle=RECIBOS_PAGAMENTO\n\n#YDES: Application description\nappDescription=RECIBOS PAGAMENTO\n\n#~~~ Master View ~~~~~~~~~~~~~~~~~~~~~~~~~~\n\n#XTIT: Master view title with placeholder for the number of items\nmasterTitleCount=<ZET_VCHR_RECIBO_PGTOSet> ({0})\n\n#XTOL: Tooltip for the search field\nmasterSearchTooltip=Enter an <ZET_VCHR_RECIBO_PGTOSet> name or a part of it.\n\n#XBLI: text for a list with no data\nmasterListNoDataText=No <ZET_VCHR_RECIBO_PGTOSetPlural> are currently available\n\n#XBLI: text for a list with no data with filter or search\nmasterListNoDataWithFilterOrSearchText=No matching <ZET_VCHR_RECIBO_PGTOSetPlural> found\n\n#XSEL: Option to sort the master list by Zdesc\nmasterSort1=Sort By <Zdesc>\n\n\n#~~~ Detail View ~~~~~~~~~~~~~~~~~~~~~~~~~~\n\n#XTOL: Icon Tab Bar Info\ndetailIconTabBarInfo=Info\n\n#XTOL: Icon Tab Bar Attachments\ndetailIconTabBarAttachments=Attachments\n\n#XTOL: Tooltip text for close column button\ncloseColumn=Close\n\n#XTIT: Save as tile app title\nshareSaveTileAppTitle=RECIBOS_PAGAMENTO - {0}\n\n#XTIT: Send E-Mail subject\nshareSendEmailObjectSubject=<Email subject including object identifier PLEASE REPLACE ACCORDING TO YOUR USE CASE> {0}\n\n#YMSG: Send E-Mail message\nshareSendEmailObjectMessage=<Email body PLEASE REPLACE ACCORDING TO YOUR USE CASE> {0} (id: {1})\\r\\n{2}\n\n#XBUT: Text for the send e-mail button\nsendEmail=Send E-Mail\n\n#XTIT: Title text for the price\npriceTitle=Price\n\n#~~~ Not Found View ~~~~~~~~~~~~~~~~~~~~~~~\n\n#XTIT: Not found view title\nnotFoundTitle=Not Found\n\n#YMSG: The ZET_VCHR_RECIBO_PGTOSet not found text is displayed when there is no ZET_VCHR_RECIBO_PGTOSet with this id\nnoObjectFoundText=This <ZET_VCHR_RECIBO_PGTOSet> is not available\n\n#YMSG: The not found text is displayed when there was an error loading the resource (404 error)\nnotFoundText=The requested resource was not found\n\n#~~~ Not Available View ~~~~~~~~~~~~~~~~~~~~~~~\n\n#XTIT: Master view title\nnotAvailableViewTitle=<ZET_VCHR_RECIBO_PGTOSet>\n\n#~~~ Error Handling ~~~~~~~~~~~~~~~~~~~~~~~\n\n#YMSG: Error dialog description\nerrorText=Sorry, a technical error occurred! Please try again later.',
		"Y5GL_RECIBOS/Y5GL_RECIBOS/localService/metadata.xml": '<edmx:Edmx xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx"\n\txmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns:sap="http://www.sap.com/Protocols/SAPData" Version="1.0"><edmx:DataServices m:DataServiceVersion="2.0"><Schema xmlns="http://schemas.microsoft.com/ado/2008/09/edm" Namespace="ZGWGLRH_MEU_CADASTRO_SRV" xml:lang="pt" sap:schema-version="1"><EntityType Name="ZET_GLRH_COMBO_PARENTESCO_EC" sap:content-version="1"><Key><PropertyRef Name="Id"/></Key><Property Name="Id" Type="Edm.String" Nullable="false" MaxLength="10" sap:unicode="false" sap:label="Campo de caracteres do comprimento 10"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Value" Type="Edm.String" Nullable="false" MaxLength="100" sap:unicode="false" sap:label="Caractere 100"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/></EntityType><EntityType Name="ZET_GLRH_COMBO_SEXO_EC" sap:content-version="1"><Key><PropertyRef Name="Id"/></Key><Property Name="Id" Type="Edm.String" Nullable="false" MaxLength="10" sap:unicode="false" sap:label="Campo de caracteres do comprimento 10"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Value" Type="Edm.String" Nullable="false" MaxLength="100" sap:unicode="false" sap:label="Caractere 100"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/></EntityType><EntityType Name="ZET_GLRH_COMBO_EST_CIVIL_EC" sap:content-version="1"><Key><PropertyRef Name="Id"/></Key><Property Name="Id" Type="Edm.String" Nullable="false" MaxLength="10" sap:unicode="false" sap:label="Campo de caracteres do comprimento 10"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Value" Type="Edm.String" Nullable="false" MaxLength="100" sap:unicode="false" sap:label="Caractere 100"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/></EntityType><EntityType Name="ZET_GLRH_MEU_ARQUIVO_EC" sap:content-version="1"><Key><PropertyRef Name="Pernr"/><PropertyRef Name="Subty"/><PropertyRef Name="Favor"/></Key><Property Name="Pernr" Type="Edm.String" Nullable="false" MaxLength="8" sap:unicode="false" sap:label="Nº pessoal" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Subty" Type="Edm.String" Nullable="false" MaxLength="4" sap:unicode="false" sap:label="Subinfotipo" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Favor" Type="Edm.String" Nullable="false" MaxLength="35" sap:unicode="false" sap:label="1º Nome" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Arquivo" Type="Edm.Binary" Nullable="false" sap:unicode="false" sap:label="File" sap:creatable="false" sap:updatable="false"\n\t\t\t\t\tsap:sortable="false" sap:filterable="false"/><Property Name="Filename" Type="Edm.String" Nullable="false" MaxLength="100" sap:unicode="false" sap:label="Caractere 100"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Mimetype" Type="Edm.String" Nullable="false" MaxLength="100" sap:unicode="false" sap:label="Caractere 100"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Name" Type="Edm.String" Nullable="false" MaxLength="100" sap:unicode="false" sap:label="Caractere 100" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/></EntityType><EntityType Name="ZET_GLRH_DEPENDENTES" sap:content-version="1"><Key><PropertyRef Name="Pernr"/><PropertyRef Name="Subty"/><PropertyRef Name="Objps"/><PropertyRef Name="Favor"/><PropertyRef Name="Tipo"/></Key><Property Name="Pernr" Type="Edm.String" Nullable="false" MaxLength="8" sap:unicode="false" sap:label="Nº pessoal" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Subty" Type="Edm.String" Nullable="false" MaxLength="4" sap:unicode="false" sap:label="Subinfotipo" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Begda" Type="Edm.String" Nullable="false" MaxLength="10" sap:unicode="false"\n\t\t\t\t\tsap:label="Campo de caracteres do comprimento 10" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Endda" Type="Edm.String" Nullable="false" MaxLength="10" sap:unicode="false"\n\t\t\t\t\tsap:label="Campo de caracteres do comprimento 10" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Objps" Type="Edm.String" Nullable="false" MaxLength="2" sap:unicode="false" sap:label="ID objeto" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Parentesco" Type="Edm.String" Nullable="false" MaxLength="50" sap:unicode="false" sap:label="Comentário"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Nomecompleto" Type="Edm.String" Nullable="false" MaxLength="80" sap:unicode="false" sap:label="Nome completo"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Status" Type="Edm.String" Nullable="false" MaxLength="50" sap:unicode="false" sap:label="Comentário" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Fanam" Type="Edm.String" Nullable="false" MaxLength="40" sap:unicode="false" sap:label="Sobrenome" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Fgbdt" Type="Edm.String" Nullable="false" MaxLength="10" sap:unicode="false"\n\t\t\t\t\tsap:label="Campo de caracteres do comprimento 10" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Sexo" Type="Edm.String" Nullable="false" MaxLength="10" sap:unicode="false"\n\t\t\t\t\tsap:label="Campo de caracteres do comprimento 10" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Zzestciv" Type="Edm.String" Nullable="false" MaxLength="1" sap:unicode="false" sap:label="Estado Civil"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Famsa" Type="Edm.String" Nullable="false" MaxLength="4" sap:unicode="false" sap:label="Membro família" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Fnac2" Type="Edm.String" Nullable="false" MaxLength="35" sap:unicode="false" sap:label="Sobrenome" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Favor" Type="Edm.String" Nullable="false" MaxLength="35" sap:unicode="false" sap:label="1º Nome" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Fasex" Type="Edm.String" Nullable="false" MaxLength="1" sap:unicode="false" sap:label="Sexo" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Fgbot" Type="Edm.String" Nullable="false" MaxLength="40" sap:unicode="false" sap:label="LocNascim." sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Fgbld" Type="Edm.String" Nullable="false" MaxLength="3" sap:unicode="false" sap:label="País nascim." sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Fanat" Type="Edm.String" Nullable="false" MaxLength="3" sap:unicode="false" sap:label="Nacionalid." sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Fcnam" Type="Edm.String" Nullable="false" MaxLength="70" sap:unicode="false" sap:label="Nome completo" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Ufbot" Type="Edm.String" Nullable="false" MaxLength="3" sap:unicode="false" sap:label="Região" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Carto" Type="Edm.String" Nullable="false" MaxLength="40" sap:unicode="false" sap:label="Nome cartório" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Noreu" Type="Edm.String" Nullable="false" MaxLength="32" sap:unicode="false" sap:label="Matrícula" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Noreg" Type="Edm.String" Nullable="false" MaxLength="10" sap:unicode="false" sap:label="Nº registro" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Noliv" Type="Edm.String" Nullable="false" MaxLength="10" sap:unicode="false" sap:label="Nº do Livro" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Nofol" Type="Edm.String" Nullable="false" MaxLength="5" sap:unicode="false" sap:label="Nº da Folha" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Dtent" Type="Edm.String" Nullable="false" MaxLength="10" sap:unicode="false"\n\t\t\t\t\tsap:label="Campo de caracteres do comprimento 10" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Icnum" Type="Edm.String" Nullable="false" MaxLength="30" sap:unicode="false" sap:label="Nº CPF" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Nhcnr" Type="Edm.String" Nullable="false" MaxLength="16" sap:unicode="false" sap:label="Cart. Nacional Saúde"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Mothe" Type="Edm.String" Nullable="false" MaxLength="80" sap:unicode="false" sap:label="Nome completo da mãe"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Stinv" Type="Edm.String" Nullable="false" MaxLength="1" sap:unicode="false" sap:label="Dep.inválido" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Salfa" Type="Edm.String" Nullable="false" MaxLength="1" sap:unicode="false" sap:label="Sal.família" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Irflg" Type="Edm.String" Nullable="false" MaxLength="1" sap:unicode="false" sap:label="Imp.de Renda" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Estud" Type="Edm.Boolean" Nullable="false" sap:unicode="false" sap:label="Estudante" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Saled" Type="Edm.String" Nullable="false" MaxLength="1" sap:unicode="false" sap:label="Sal.educação" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Escol" Type="Edm.String" Nullable="false" MaxLength="2" sap:unicode="false" sap:label="Grau instrução" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Zztpdoc" Type="Edm.String" Nullable="false" MaxLength="1" sap:unicode="false" sap:label="Tipo Documento"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="FlagMed" Type="Edm.Boolean" Nullable="false" sap:unicode="false" sap:label="Flag" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="ZzcartMedi" Type="Edm.String" Nullable="false" MaxLength="20" sap:unicode="false" sap:label="Carteirinha Médica"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="FlagDent" Type="Edm.Boolean" Nullable="false" sap:unicode="false" sap:label="Flag" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="ZzcartDent" Type="Edm.String" Nullable="false" MaxLength="20" sap:unicode="false" sap:label="Carteirinha dentista"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Operation" Type="Edm.String" Nullable="false" MaxLength="20" sap:unicode="false" sap:label="Operação" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Znew" Type="Edm.String" Nullable="false" MaxLength="1" sap:unicode="false" sap:label="Caractere 1" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Uname" Type="Edm.String" Nullable="false" MaxLength="12" sap:unicode="false" sap:label="Nome do usuário"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Datum" Type="Edm.String" Nullable="false" MaxLength="10" sap:unicode="false"\n\t\t\t\t\tsap:label="Campo de caracteres do comprimento 10" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="UnameApro" Type="Edm.String" Nullable="false" MaxLength="12" sap:unicode="false" sap:label="Nome do usuário"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="DatumApro" Type="Edm.String" Nullable="false" MaxLength="10" sap:unicode="false"\n\t\t\t\t\tsap:label="Campo de caracteres do comprimento 10" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Observacao" Type="Edm.String" Nullable="false" MaxLength="200" sap:unicode="false" sap:label="Texto (200 car."\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Arquivo" Type="Edm.Binary" Nullable="false" sap:unicode="false" sap:label="File" sap:creatable="false" sap:updatable="false"\n\t\t\t\t\tsap:sortable="false" sap:filterable="false"/><Property Name="Estadocivil" Type="Edm.String" Nullable="false" MaxLength="20" sap:unicode="false" sap:label="char20" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Dtcvc" Type="Edm.String" Nullable="false" MaxLength="10" sap:unicode="false"\n\t\t\t\t\tsap:label="Campo de caracteres do comprimento 10" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Fuman" Type="Edm.Boolean" Nullable="false" sap:unicode="false" sap:label="Fumante" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Moden" Type="Edm.String" Nullable="false" MaxLength="1" sap:unicode="false" sap:label="Modalidade" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Tipo" Type="Edm.String" Nullable="false" MaxLength="1" sap:unicode="false" sap:label="Tipo de movimento"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="NomePernr" Type="Edm.String" Nullable="false" MaxLength="80" sap:unicode="false" sap:label="Nome completo"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Lbcnr" Type="Edm.String" Nullable="false" MaxLength="15" sap:unicode="false" sap:label="Decl. Nascido Vivo"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="HealthplanInd" Type="Edm.String" Nullable="false" MaxLength="1" sap:unicode="false" sap:label="Dep.plano priv.saúde"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Uzeit" Type="Edm.String" Nullable="false" MaxLength="10" sap:unicode="false"\n\t\t\t\t\tsap:label="Campo de caracteres do comprimento 10" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/></EntityType><EntityType Name="ZET_VCHR_UPFILE" m:HasStream="true" sap:content-version="1"><Key><PropertyRef Name="DocName"/></Key><Property Name="DocName" Type="Edm.String" Nullable="false" MaxLength="50" sap:unicode="false" sap:creatable="false" sap:updatable="false"\n\t\t\t\t\tsap:sortable="false"/></EntityType><EntityType Name="ZET_GLRH_UPLOAD" sap:content-version="1"><Key><PropertyRef Name="Pernr"/><PropertyRef Name="Subty"/><PropertyRef Name="Favor"/></Key><Property Name="Pernr" Type="Edm.String" Nullable="false" MaxLength="8" sap:unicode="false" sap:label="Nº pessoal" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false"/><Property Name="Subty" Type="Edm.String" Nullable="false" MaxLength="4" sap:unicode="false" sap:label="Subinfotipo" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false"/><Property Name="Favor" Type="Edm.String" Nullable="false" MaxLength="35" sap:unicode="false" sap:label="1º Nome" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false"/><Property Name="DocId" Type="Edm.Int32" Nullable="false" sap:unicode="false" sap:label="Nº" sap:creatable="false" sap:updatable="false"\n\t\t\t\t\tsap:sortable="false" sap:filterable="false"/><Property Name="Filename" Type="Edm.String" Nullable="false" MaxLength="60" sap:unicode="false"\n\t\t\t\t\tsap:label="Denominação do caminho e do file no front end" sap:creatable="false" sap:updatable="false" sap:sortable="false"\n\t\t\t\t\tsap:filterable="false"/><Property Name="Mimetype" Type="Edm.String" Nullable="false" sap:unicode="false" sap:label="Anexo tipo MIME" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Value" Type="Edm.Binary" Nullable="false" sap:unicode="false" sap:label="VALUE" sap:creatable="false" sap:updatable="false"\n\t\t\t\t\tsap:sortable="false" sap:filterable="false"/><Property Name="Url" Type="Edm.String" Nullable="false" sap:unicode="false" sap:label="URL de objeto" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Documentart" Type="Edm.String" Nullable="false" MaxLength="10" sap:unicode="false"\n\t\t\t\t\tsap:label="Campo de caracteres do comprimento 10" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="DtCriacao" Type="Edm.String" Nullable="false" MaxLength="10" sap:unicode="false"\n\t\t\t\t\tsap:label="Campo de caracteres do comprimento 10" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Autor" Type="Edm.String" Nullable="false" MaxLength="12" sap:unicode="false" sap:label="Nome do usuário"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/></EntityType><EntityType Name="ZET_GLRH_BENEFICIOS" sap:content-version="1"><Key><PropertyRef Name="Programm"/><PropertyRef Name="Zparam"/></Key><Property Name="EStatus" Type="Edm.String" Nullable="false" MaxLength="1" sap:unicode="false" sap:label="Caractere 1" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Programm" Type="Edm.String" Nullable="false" MaxLength="40" sap:unicode="false" sap:label="Nome progr."\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Zparam" Type="Edm.String" Nullable="false" MaxLength="20" sap:unicode="false" sap:label="Parâmetro" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Zdesc" Type="Edm.String" Nullable="false" MaxLength="30" sap:unicode="false" sap:label="Descrição parâmetro"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Zvlpar" Type="Edm.String" Nullable="false" MaxLength="255" sap:unicode="false" sap:label="Valor do parâmetro"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/></EntityType><EntityType Name="ZET_VCHR_DETAIL_BENEFICIOS" sap:content-version="1"><Key><PropertyRef Name="Pernr"/><PropertyRef Name="Beneficio"/></Key><Property Name="Observacao" Type="Edm.String" Nullable="false" MaxLength="255" sap:unicode="false" sap:label="Char255" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Adesao" Type="Edm.String" Nullable="false" MaxLength="1" sap:unicode="false" sap:label="Caractere 1" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Pernr" Type="Edm.String" Nullable="false" MaxLength="8" sap:unicode="false" sap:label="Nº pessoal" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Rubrica" Type="Edm.String" Nullable="false" MaxLength="4" sap:unicode="false"\n\t\t\t\t\tsap:label="Área def.imprecisam., evtlm.utiliz.p/níveis Support Package" sap:creatable="false" sap:updatable="false" sap:sortable="false"\n\t\t\t\t\tsap:filterable="false"/><Property Name="Tipo" Type="Edm.String" Nullable="false" MaxLength="1" sap:unicode="false" sap:label="Caractere 1" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Bplan" Type="Edm.String" Nullable="false" MaxLength="4" sap:unicode="false" sap:label="Pln.benef.comp."\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="MargemFunsejem" Type="Edm.Decimal" Nullable="false" Precision="14" Scale="3" sap:unicode="false" sap:label="Valor original"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="CartMedica" Type="Edm.String" Nullable="false" MaxLength="22" sap:unicode="false" sap:label="x" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="CartDentista" Type="Edm.String" Nullable="false" MaxLength="22" sap:unicode="false" sap:label="x" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Opcoes" Type="Edm.String" Nullable="false" MaxLength="4" sap:unicode="false" sap:label="Pln.benef.comp."\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Montante" Type="Edm.Decimal" Nullable="false" Precision="14" Scale="3" sap:unicode="false" sap:label="Valor original"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Validade" Type="Edm.String" Nullable="false" MaxLength="10" sap:unicode="false"\n\t\t\t\t\tsap:label="Campo de caracteres do comprimento 10" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Status" Type="Edm.String" Nullable="false" MaxLength="1" sap:unicode="false" sap:label="Caractere 1" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Beneficio" Type="Edm.String" Nullable="false" MaxLength="20" sap:unicode="false" sap:label="char20" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/></EntityType><EntityType Name="ZET_VCHR_COMBO_RUBRICA" sap:content-version="1"><Key><PropertyRef Name="Lgart"/></Key><Property Name="Mandt" Type="Edm.String" Nullable="false" MaxLength="3" sap:unicode="false" sap:label="Mandante" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Sprsl" Type="Edm.String" Nullable="false" MaxLength="2" sap:unicode="false" sap:label="Idioma" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Molga" Type="Edm.String" Nullable="false" MaxLength="2" sap:unicode="false" sap:label="Agrupam.países" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Lgart" Type="Edm.String" Nullable="false" MaxLength="4" sap:unicode="false" sap:label="Rubr.salarial" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Lgtxt" Type="Edm.String" Nullable="false" MaxLength="25" sap:unicode="false" sap:label="Texto descr." sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Kztxt" Type="Edm.String" Nullable="false" MaxLength="8" sap:unicode="false" sap:label="TxtBrevRubrSalr"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/></EntityType><EntityType Name="ZET_VCHR_MEU_CADASTRO" sap:content-version="1"><Key><PropertyRef Name="Programm"/><PropertyRef Name="Zdesc"/></Key><Property Name="Programm" Type="Edm.String" Nullable="false" MaxLength="40" sap:unicode="false" sap:label="Nome progr."\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Zdesc" Type="Edm.String" Nullable="false" MaxLength="30" sap:unicode="false" sap:label="Descrição parâmetro"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Status" Type="Edm.String" Nullable="false" MaxLength="24" sap:unicode="false" sap:label="Texto 24" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/></EntityType><EntityType Name="ZET_GLRH_COMBO_PLANO" sap:content-version="1"><Key><PropertyRef Name="Bplan"/></Key><Property Name="Mandt" Type="Edm.String" Nullable="false" MaxLength="3" sap:unicode="false" sap:label="Mandante" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Langu" Type="Edm.String" Nullable="false" MaxLength="2" sap:unicode="false" sap:label="Idioma" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Barea" Type="Edm.String" Nullable="false" MaxLength="2" sap:unicode="false" sap:label="Ár.benefs.comp."\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Bplan" Type="Edm.String" Nullable="false" MaxLength="4" sap:unicode="false" sap:label="Pln.benef.comp."\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Ltext" Type="Edm.String" Nullable="false" MaxLength="30" sap:unicode="false" sap:label="Texto" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Stext" Type="Edm.String" Nullable="false" MaxLength="10" sap:unicode="false" sap:label="Texto" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/></EntityType><EntityType Name="ZET_VCHR_RECIBO_PGTO" sap:content-version="1"><Key><PropertyRef Name="Programm"/><PropertyRef Name="Zdesc"/></Key><Property Name="Programm" Type="Edm.String" Nullable="false" MaxLength="40" sap:unicode="false" sap:label="Nome progr."\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Zdesc" Type="Edm.String" Nullable="false" MaxLength="30" sap:unicode="false" sap:label="Descrição parâmetro"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Status" Type="Edm.String" Nullable="false" MaxLength="24" sap:unicode="false" sap:label="Texto 24" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false"/></EntityType><EntityContainer Name="ZGWGLRH_MEU_CADASTRO_SRV_Entities" m:IsDefaultEntityContainer="true" sap:supported-formats="atom json xlsx"><EntitySet Name="ZET_GLRH_COMBO_PARENTESCO_ECSet" EntityType="ZGWGLRH_MEU_CADASTRO_SRV.ZET_GLRH_COMBO_PARENTESCO_EC" sap:creatable="false"\n\t\t\t\tsap:updatable="false" sap:deletable="false" sap:pageable="false" sap:content-version="1"/><EntitySet Name="ZET_GLRH_COMBO_SEXO_ECSet" EntityType="ZGWGLRH_MEU_CADASTRO_SRV.ZET_GLRH_COMBO_SEXO_EC" sap:creatable="false"\n\t\t\t\tsap:updatable="false" sap:deletable="false" sap:pageable="false" sap:content-version="1"/><EntitySet Name="ZET_GLRH_COMBO_EST_CIVIL_ECSet" EntityType="ZGWGLRH_MEU_CADASTRO_SRV.ZET_GLRH_COMBO_EST_CIVIL_EC" sap:creatable="false"\n\t\t\t\tsap:updatable="false" sap:deletable="false" sap:pageable="false" sap:content-version="1"/><EntitySet Name="ZET_GLRH_MEU_ARQUIVO_ECSet" EntityType="ZGWGLRH_MEU_CADASTRO_SRV.ZET_GLRH_MEU_ARQUIVO_EC" sap:creatable="false"\n\t\t\t\tsap:updatable="false" sap:deletable="false" sap:pageable="false" sap:content-version="1"/><EntitySet Name="ZET_GLRH_DEPENDENTESSet" EntityType="ZGWGLRH_MEU_CADASTRO_SRV.ZET_GLRH_DEPENDENTES" sap:creatable="false"\n\t\t\t\tsap:updatable="false" sap:deletable="false" sap:pageable="false" sap:content-version="1"/><EntitySet Name="ZET_VCHR_UPFILESet" EntityType="ZGWGLRH_MEU_CADASTRO_SRV.ZET_VCHR_UPFILE" sap:creatable="false" sap:updatable="false"\n\t\t\t\tsap:deletable="false" sap:pageable="false" sap:content-version="1"/><EntitySet Name="ZET_GLRH_UPLOADSet" EntityType="ZGWGLRH_MEU_CADASTRO_SRV.ZET_GLRH_UPLOAD" sap:creatable="false" sap:updatable="false"\n\t\t\t\tsap:deletable="false" sap:searchable="true" sap:pageable="false" sap:content-version="1"/><EntitySet Name="ZET_GLRH_BENEFICIOSSet" EntityType="ZGWGLRH_MEU_CADASTRO_SRV.ZET_GLRH_BENEFICIOS" sap:creatable="false"\n\t\t\t\tsap:updatable="false" sap:deletable="false" sap:pageable="false" sap:content-version="1"/><EntitySet Name="ZET_VCHR_DETAIL_BENEFICIOSSet" EntityType="ZGWGLRH_MEU_CADASTRO_SRV.ZET_VCHR_DETAIL_BENEFICIOS" sap:creatable="false"\n\t\t\t\tsap:updatable="false" sap:deletable="false" sap:pageable="false" sap:content-version="1"/><EntitySet Name="ZET_VCHR_COMBO_RUBRICASet" EntityType="ZGWGLRH_MEU_CADASTRO_SRV.ZET_VCHR_COMBO_RUBRICA" sap:creatable="false"\n\t\t\t\tsap:updatable="false" sap:deletable="false" sap:pageable="false" sap:content-version="1"/><EntitySet Name="ZET_VCHR_MEU_CADASTROSet" EntityType="ZGWGLRH_MEU_CADASTRO_SRV.ZET_VCHR_MEU_CADASTRO" sap:creatable="false"\n\t\t\t\tsap:updatable="false" sap:deletable="false" sap:pageable="false" sap:content-version="1"/><EntitySet Name="ZET_GLRH_COMBO_PLANOSet" EntityType="ZGWGLRH_MEU_CADASTRO_SRV.ZET_GLRH_COMBO_PLANO" sap:creatable="false"\n\t\t\t\tsap:updatable="false" sap:deletable="false" sap:pageable="false" sap:content-version="1"/><EntitySet Name="ZET_VCHR_RECIBO_PGTOSet" EntityType="ZGWGLRH_MEU_CADASTRO_SRV.ZET_VCHR_RECIBO_PGTO" sap:creatable="false"\n\t\t\t\tsap:updatable="false" sap:deletable="false" sap:pageable="false" sap:content-version="1"/></EntityContainer><atom:link xmlns:atom="http://www.w3.org/2005/Atom" rel="self" href="./sap/ZGWGLRH_MEU_CADASTRO_SRV/$metadata"/><atom:link xmlns:atom="http://www.w3.org/2005/Atom" rel="latest-version" href="./sap/ZGWGLRH_MEU_CADASTRO_SRV/$metadata"/></Schema></edmx:DataServices></edmx:Edmx>',
		"Y5GL_RECIBOS/Y5GL_RECIBOS/localService/mockserver.js": function () {
			sap.ui.define(["sap/ui/core/util/MockServer", "sap/ui/model/json/JSONModel", "sap/base/Log", "sap/base/util/UriParameters"], function (
				e, t, r, a) {
				"use strict";
				var o, i = "Y5GL_RECIBOS/Y5GL_RECIBOS/",
					n = i + "localService/mockdata";
				var s = {
					init: function (s) {
						var u = s || {};
						return new Promise(function (s, c) {
							var p = sap.ui.require.toUrl(i + "manifest.json"),
								f = new t(p);
							f.attachRequestCompleted(function () {
								var t = new a(window.location.href),
									c = sap.ui.require.toUrl(n),
									p = f.getProperty("/sap.app/dataSources/mainService"),
									l = sap.ui.require.toUrl(i + p.settings.localUri),
									d = /.*\/$/.test(p.uri) ? p.uri : p.uri + "/";
								if (!o) {
									o = new e({
										rootUri: d
									})
								} else {
									o.stop()
								}
								e.config({
									autoRespond: true,
									autoRespondAfter: u.delay || t.get("serverDelay") || 500
								});
								o.simulate(l, {
									sMockdataBaseUrl: c,
									bGenerateMissingMockData: true
								});
								var m = o.getRequests();
								var v = function (e, t, r) {
									r.response = function (r) {
										r.respond(e, {
											"Content-Type": "text/plain;charset=utf-8"
										}, t)
									}
								};
								if (u.metadataError || t.get("metadataError")) {
									m.forEach(function (e) {
										if (e.path.toString().indexOf("$metadata") > -1) {
											v(500, "metadata Error", e)
										}
									})
								}
								var g = u.errorType || t.get("errorType"),
									R = g === "badRequest" ? 400 : 500;
								if (g) {
									m.forEach(function (e) {
										v(R, g, e)
									})
								}
								o.setRequests(m);
								o.start();
								r.info("Running the app with mock data");
								s()
							});
							f.attachRequestFailed(function () {
								var e = "Failed to load application manifest";
								r.error(e);
								c(new Error(e))
							})
						})
					},
					getMockServer: function () {
						return o
					}
				};
				return s
			});
		},
		"Y5GL_RECIBOS/Y5GL_RECIBOS/manifest.json": '{"_version":"1.12.0","sap.app":{"id":"Y5GL_RECIBOS.Y5GL_RECIBOS","type":"application","i18n":"i18n/i18n.properties","title":"{{appTitle}}","description":"{{appDescription}}","applicationVersion":{"version":"1.0.0"},"resources":"resources.json","dataSources":{"mainService":{"uri":"/sap/opu/odata/sap/ZGWGLRH_MEU_CADASTRO_SRV/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}}},"sourceTemplate":{"id":"sap.ui.ui5-template-plugin.2masterdetail","version":"1.67.0"}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://detail-view","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"rootView":{"viewName":"Y5GL_RECIBOS.Y5GL_RECIBOS.view.App","type":"XML","async":true,"id":"app"},"dependencies":{"minUI5Version":"1.52","libs":{"sap.collaboration":{"lazy":true},"sap.f":{},"sap.m":{},"sap.ui.core":{},"sap.ushell":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"Y5GL_RECIBOS.Y5GL_RECIBOS.i18n.i18n"}},"":{"dataSource":"mainService","preload":true}},"routing":{"config":{"routerClass":"sap.f.routing.Router","viewType":"XML","viewPath":"Y5GL_RECIBOS.Y5GL_RECIBOS.view","controlId":"layout","controlAggregation":"beginColumnPages","bypassed":{"target":"notFound"},"async":true},"routes":[{"pattern":"","name":"master","target":"master"},{"pattern":"object/{Zparam}/{Zdesc}/","name":"object","target":["master","object"]},{"name":"admto_15","pattern":"admto_15/{Periodo}/","titleTarget":"","greedy":false,"target":["master","admto_15"]},{"name":"Pagto_Mensal","pattern":"Pagto_Mensal/{Periodo}/{Tipo}/{Check}/","titleTarget":"","greedy":false,"target":["master","Pagto_Mensal"]}],"targets":{"master":{"viewName":"Master","viewLevel":1,"viewId":"master"},"object":{"viewName":"Detail","viewId":"detail","viewLevel":1,"controlAggregation":"midColumnPages"},"detailObjectNotFound":{"viewName":"DetailObjectNotFound","viewId":"detailObjectNotFound","controlAggregation":"midColumnPages"},"notFound":{"viewName":"NotFound","viewId":"notFound"},"admto_15":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewName":"admto_15","title":"Adiantamento Quizenal","viewId":"admto_15","viewLevel":2,"controlAggregation":"midColumnPages"},"Pagto_Mensal":{"viewType":"XML","viewName":"Pagto_Mensal","title":"Pagamento Mensal","viewId":"Pagto_Mensal","viewLevel":2,"controlAggregation":"midColumnPages"}}},"flexEnabled":true,"resources":{"css":[{"uri":"./css/style.css","id":""}]}},"sap.platform.abap":{"uri":"/sap/bc/ui5_ui5/sap/y5gl_recibos/webapp","_version":"1.1.0"}}',
		"Y5GL_RECIBOS/Y5GL_RECIBOS/model/formatter.js": function () {
			sap.ui.define([], function () {
				"use strict";
				return {
					currencyValue: function (e) {
						if (!e) {
							return ""
						}
						return parseFloat(e).toFixed(2)
					}
				}
			});
		},
		"Y5GL_RECIBOS/Y5GL_RECIBOS/model/models.js": function () {
			sap.ui.define(["sap/ui/model/json/JSONModel", "sap/ui/Device", "sap/base/util/ObjectPath"], function (e, n, t) {
				"use strict";
				return {
					createDeviceModel: function () {
						var t = new e(n);
						t.setDefaultBindingMode("OneWay");
						return t
					},
					createFLPModel: function () {
						var n = t.get("sap.ushell.Container.getUser"),
							a = n ? n().isJamActive() : false,
							i = new e({
								isShareInJamActive: a
							});
						i.setDefaultBindingMode("OneWay");
						return i
					}
				}
			});
		},
		"Y5GL_RECIBOS/Y5GL_RECIBOS/view/App.view.xml": '<mvc:View\n\tcontrollerName="Y5GL_RECIBOS.Y5GL_RECIBOS.controller.App"\n\tdisplayBlock="true"\n\theight="100%"\n\txmlns="sap.m"\n\txmlns:f="sap.f"\n\txmlns:mvc="sap.ui.core.mvc"><App\n\t\tid="app"\n\t\tbusy="{appView>/busy}"\n\t\tbusyIndicatorDelay="{appView>/delay}"><f:FlexibleColumnLayout\n\t\t\tid="layout"\n\t\t\tlayout="{appView>/layout}"\n\t\t\tbackgroundDesign="Translucent"></f:FlexibleColumnLayout></App></mvc:View>',
		"Y5GL_RECIBOS/Y5GL_RECIBOS/view/Detail.view.xml": '<mvc:View controllerName="Y5GL_RECIBOS.Y5GL_RECIBOS.controller.Detail" xmlns="sap.m" xmlns:semantic="sap.f.semantic"\n\txmlns:footerbar="sap.ushell.ui.footerbar" xmlns:mvc="sap.ui.core.mvc" xmlns:f="sap.ui.layout.form" xmlns:core="sap.ui.core"><App id="idAppDetail"><pages id="idPagesDetail"><Page id="idTitle"><customHeader><Bar id="idBarMaster"><contentLeft><Button icon="sap-icon://nav-back" id="idB_navback" press="onVoltar"/></contentLeft><contentMiddle><Title text="Recibos" titleStyle="H3" id="idTitleRecibos"/></contentMiddle></Bar></customHeader><content><f:Form id="SALARIO" visible="false" editable="true"><f:layout><f:ResponsiveGridLayout id="idResp_SALARIO" labelSpanXL="4" labelSpanL="4" labelSpanM="12" labelSpanS="12" adjustLabelSpan="false"\n\t\t\t\t\t\t\t\temptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="2" columnsL="2" columnsM="1" singleContainerFullSize="false"/></f:layout><f:formContainers><f:FormContainer id="FormContainer1"><f:formElements><f:FormElement id="FormContainer1_SALARIO"><f:fields><RadioButton groupName="GroupA" text="Adiantamento" id="idAdiantamento_SALARIO" select="onSelect" selected="true"/><RadioButton groupName="GroupA" text="Pagamento" id="idPagamento_SALARIO" select="onSelect"/></f:fields></f:FormElement><f:FormElement label="Perido" id="FormContainer2_SALARIO"><f:fields><ComboBox id="IdPeriodo_SALARIO" selectedKey="" required="true" placeholder="Selecione o Periodo"\n\t\t\t\t\t\t\t\t\t\t\t\titems="{ path:\'/ZET_COMBO_RECIBOSet\', filters: { path: \'IForm\', operator: \'EQ\', value1:\'SALARIO\'}}"><core:Item key="{Periodo}" text="{Periodo}" id="idKeyMes_FormContainer1_SALARIO"/></ComboBox></f:fields></f:FormElement><f:FormElement id="FormContainer4_SALARIO"><f:fields><Button text="Exibir" width="50%" press="onSave" icon="sap-icon://detail-view" id="IdExibe_SALARIO" tooltip="Exibe"/></f:fields></f:FormElement></f:formElements></f:FormContainer></f:formContainers></f:Form><f:Form id="ADIANTAMENTO_15" visible="false" editable="true"><f:layout><f:ResponsiveGridLayout id="idResp_ADMTO_15" labelSpanXL="4" labelSpanL="4" labelSpanM="12" labelSpanS="12" adjustLabelSpan="false"\n\t\t\t\t\t\t\t\temptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="2" columnsL="2" columnsM="1" singleContainerFullSize="false"/></f:layout><f:formContainers><f:FormContainer id="FormContainer2"><f:formElements><f:FormElement label="Período" id="FormContainer1_ADMTO_15"><f:fields><ComboBox id="IdPeriodo_ADMTO_15" selectedKey="" required="true" placeholder="Selecione o Periodo"\n\t\t\t\t\t\t\t\t\t\t\t\titems="{ path:\'/ZET_COMBO_RECIBOSet\', filters: { path: \'IForm\', operator: \'EQ\', value1:\'ADIANTAMENTO_15\'}}"><core:Item key="{Periodo}" text="{Periodo}" id="idKeyMes_FormContainer1_ADMTO_15"/></ComboBox></f:fields></f:FormElement><f:FormElement id="FormContainer4_ADMTO_15"><f:fields><Button text="Exibir" width="50%" press="onSave" icon="sap-icon://detail-view" id="IdExibe_ADMTO_15" tooltip="Exibe"/></f:fields></f:FormElement></f:formElements></f:FormContainer></f:formContainers></f:Form><f:Form id="FERIAS" visible="false" editable="true"><f:layout><f:ResponsiveGridLayout id="idResp_FERIAS" labelSpanXL="4" labelSpanL="4" labelSpanM="12" labelSpanS="12" adjustLabelSpan="false"\n\t\t\t\t\t\t\t\temptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="2" columnsL="2" columnsM="1" singleContainerFullSize="false"/></f:layout><f:formContainers><f:FormContainer id="FormContainer3"><f:formElements><f:FormElement label="Periodo" id="FormContainer1_FERIAS"><f:fields><ComboBox id="IdPeriodoFERIAS" selectedKey="" required="true" placeholder="Selecione o Periodo"\n\t\t\t\t\t\t\t\t\t\t\t\titems="{ path:\'/ZET_COMBO_RECIBOSet\', filters: { path: \'IForm\', operator: \'EQ\', value1:\'FERIAS\'}}"><core:Item key="{Periodo}" text="{Periodo}" id="idKeyMes_FormContainer1_FERIAS"/></ComboBox></f:fields></f:FormElement><f:FormElement id="FormContainer4_FERIAS"><f:fields><Button text="Exibir" width="50%" press="onSave" icon="sap-icon://detail-view" id="IdExibe_FERIAS" tooltip="Exibe"/></f:fields></f:FormElement></f:formElements></f:FormContainer></f:formContainers></f:Form><f:Form id="INFORME_RENDIMENTO" visible="false" editable="true"><f:layout><f:ResponsiveGridLayout id="idResp_INFORME_RENDIMENTO" labelSpanXL="4" labelSpanL="4" labelSpanM="12" labelSpanS="12"\n\t\t\t\t\t\t\t\tadjustLabelSpan="false" emptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="2" columnsL="2" columnsM="1"\n\t\t\t\t\t\t\t\tsingleContainerFullSize="false"/></f:layout><f:formContainers><f:FormContainer id="FormContainer4"><f:formElements><f:FormElement label="Periodo" id="FormContainer1_INFORME_RENDIMENTO" visible="true"><f:fields><ComboBox id="IdPeriodoINFORME_RENDIMENTO" selectedKey="" required="true" placeholder="Selecione o Periodo"\n\t\t\t\t\t\t\t\t\t\t\t\titems="{ path:\'/ZET_COMBO_RECIBOSet\', filters: { path: \'IForm\', operator: \'EQ\', value1:\'INFORME_RENDIMENTO\'}}"><core:Item key="{Periodo}" text="{Periodo}" id="idKeyMes_FormContainer1_INFORME_RENDIMENTO"/></ComboBox></f:fields></f:FormElement><f:FormElement id="FormContainer4_INFORME_RENDIMENTO"><f:fields><Button text="Exibir" width="50%" press="onSave" icon="sap-icon://detail-view" id="IdExibe_INFORME_RENDIMENTO" tooltip="Exibe"/></f:fields></f:FormElement></f:formElements></f:FormContainer></f:formContainers></f:Form><f:Form id="PGTO_MENSAL" visible="false" editable="true"><f:layout><f:ResponsiveGridLayout id="idResp_PGTO_MENSAL" labelSpanXL="4" labelSpanL="4" labelSpanM="12" labelSpanS="12" adjustLabelSpan="false"\n\t\t\t\t\t\t\t\temptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="2" columnsL="2" columnsM="1" singleContainerFullSize="false"/></f:layout><f:formContainers><f:FormContainer id="FormContainer5"><f:formElements><f:FormElement label="Periodo" id="FormContainer1_PGTO_MENSAL"><ComboBox id="IdPeriodoPGTO_MENSAL" selectedKey="" required="true" placeholder="Selecione o Periodo"\n\t\t\t\t\t\t\t\t\t\t\titems="{ path:\'/ZET_COMBO_RECIBOSet\', filters: { path: \'IForm\', operator: \'EQ\', value1:\'PGTO_MENSAL\'}}"><core:Item key="{Periodo}" text="{Periodo}" id="idKeyMes_FormContainer1_PGTO_MENSAL"/></ComboBox></f:FormElement><f:FormElement id="FormContainer4_PGTO_MENSAL"><f:fields><Button text="Exibir" width="50%" press="onSave" icon="sap-icon://detail-view" id="IdExibe_PGTO_MENSAL" tooltip="Exibe"/></f:fields></f:FormElement></f:formElements></f:FormContainer></f:formContainers></f:Form><f:Form id="PPRV" visible="false" editable="true"><f:layout><f:ResponsiveGridLayout id="idResp_PPRV" labelSpanXL="4" labelSpanL="4" labelSpanM="12" labelSpanS="12" adjustLabelSpan="false"\n\t\t\t\t\t\t\t\temptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="2" columnsL="2" columnsM="1" singleContainerFullSize="false"/></f:layout><f:formContainers><f:FormContainer id="FormContainer6"><f:formElements><f:FormElement id="FormContainer1_PPRV"><f:fields><RadioButton groupName="GroupB" text="Adiantamento" id="idAdiantamento_PPRV" select="onSelect" selected="true"/><RadioButton groupName="GroupB" text="Pagamento" id="idPagamento_PPRV" select="onSelect"/></f:fields></f:FormElement><f:FormElement label="Periodo" id="FormContainer2_PPRV"><f:fields><ComboBox id="IdPeriodo_PPRV" selectedKey="" required="true" placeholder="Selecione o Periodo"\n\t\t\t\t\t\t\t\t\t\t\t\titems="{ path:\'/ZET_COMBO_RECIBOSet\', filters: { path: \'IForm\', operator: \'EQ\', value1:\'PPRV\'}}"><core:Item key="{Periodo}" text="{Periodo}" id="idKeyMes_FormContainer1_PPRV"/></ComboBox></f:fields></f:FormElement><f:FormElement id="FormContainer4_PPRV"><f:fields><Button text="Exibir" width="50%" press="onSave" icon="sap-icon://detail-view" id="IdExibe_PPRV" tooltip="Exibe"/></f:fields></f:FormElement></f:formElements></f:FormContainer></f:formContainers></f:Form><f:Form id="PRV" visible="false" editable="true"><f:layout><f:ResponsiveGridLayout id="idResp_PRV" labelSpanXL="4" labelSpanL="4" labelSpanM="12" labelSpanS="12" adjustLabelSpan="false"\n\t\t\t\t\t\t\t\temptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="2" columnsL="2" columnsM="1" singleContainerFullSize="false"/></f:layout><f:formContainers><f:FormContainer id="FormContainer7"><f:formElements><f:FormElement id="FormContainer1_PRV"><f:fields><RadioButton groupName="GroupC" text="Adiantamento" id="idAdiantamento_PRV" select="onSelect" selected="true"/><RadioButton groupName="GroupC" text="Pagamento" id="idPagamento_PRV" select="onSelect"/></f:fields></f:FormElement><f:FormElement label="Periodo" id="FormContainer2_PRV"><f:fields><ComboBox id="IdPeriodo_PRV" selectedKey="" required="true" placeholder="Selecione o Periodo"\n\t\t\t\t\t\t\t\t\t\t\t\titems="{ path:\'/ZET_COMBO_RECIBOSet\', filters: { path: \'IForm\', operator: \'EQ\', value1:\'PRV\'}}"><core:Item key="{Periodo}" text="{Periodo}" id="idKeyMes_FormContainer1_PRV"/></ComboBox></f:fields></f:FormElement><f:FormElement id="FormContainer4_PRV"><f:fields><Button text="Exibir" width="50%" press="onSave" icon="sap-icon://detail-view" id="IdExibe_PRV" tooltip="Exibe"/></f:fields></f:FormElement></f:formElements></f:FormContainer></f:formContainers></f:Form></content></Page></pages></App></mvc:View>',
		"Y5GL_RECIBOS/Y5GL_RECIBOS/view/DetailObjectNotFound.view.xml": '<mvc:View\n\tcontrollerName="Y5GL_RECIBOS.Y5GL_RECIBOS.controller.DetailObjectNotFound"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"><MessagePage\n\t\tid="page"\n\t\ttitle="{i18n>detailTitle}"\n\t\ttext="{i18n>noObjectFoundText}"\n\t\ticon="sap-icon://product"\n\t\tdescription=""\n></MessagePage></mvc:View>',
		"Y5GL_RECIBOS/Y5GL_RECIBOS/view/Master.view.xml": '<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" xmlns:html="http://www.w3.org/1999/xhtml"\n\tcontrollerName="Y5GL_RECIBOS.Y5GL_RECIBOS.controller.Master" displayBlock="true"><App id="app"><pages><Page id="idPageMaster"><customHeader><Bar id="idBarMaster"><contentMiddle><Title text="" id="idTitleText" titleStyle="H2"/></contentMiddle></Bar></customHeader><content><List id="list" width="auto" class="sapFDynamicPageAlignContent"\n\t\t\t\t\t\titems="{ path: \'/ZET_GLHR_RECIBO_PGTOSet\', groupHeaderFactory: \'.createGroupHeader\' }"\n\t\t\t\t\t\tbusyIndicatorDelay="{masterView>/delay}" noDataText="{masterView>/noDataText}"\n\t\t\t\t\t\tmode="{= ${device>/system/phone} ? \'None\' : \'SingleSelectMaster\'}" growing="true" growingScrollToLoad="true"\n\t\t\t\t\t\tupdateFinished=".onUpdateFinished" selectionChange=".onSelectionChange" itemPress=".onSelectionChange"><headerToolbar></headerToolbar><items><ObjectListItem type="Navigation" press=".onSelectionChange" title="{Zdesc}" icon="{path:\'Zdesc\', formatter:\'.formatterIcon\'}" highlight="Information" id="idObjectListItem"><firstStatus></firstStatus></ObjectListItem></items></List><Button text="Voltar" width="100%" id="__button0" type="Back" press="voltarsuccesss" visible="false"/></content></Page></pages></App></mvc:View>',
		"Y5GL_RECIBOS/Y5GL_RECIBOS/view/NotFound.view.xml": '<mvc:View\n\tcontrollerName="Y5GL_RECIBOS.Y5GL_RECIBOS.controller.NotFound"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"><MessagePage\n\t\tid="page"\n\t\ttitle="{i18n>notFoundTitle}"\n\t\ttext="{i18n>notFoundText}"\n\t\ticon="sap-icon://document"\n></MessagePage></mvc:View>',
		"Y5GL_RECIBOS/Y5GL_RECIBOS/view/Pagto_Mensal.view.xml": '<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" xmlns:f="sap.ui.layout.form" xmlns:l="sap.ui.layout"\n\txmlns:smartTable="sap.ui.comp.smarttable" xmlns:html="http://www.w3.org/1999/xhtml" xmlns:table="sap.ui.table"\n\txmlns:app="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1"\n\tcontrollerName="Y5GL_RECIBOS.Y5GL_RECIBOS.controller.Pagto_Mensal"><App id="idApp"><pages><Page id="pages" enableScrolling="true"><customHeader><Bar id="idBarMaster"><contentLeft><Button icon="sap-icon://nav-back" id="idB_navback" press="onVoltar"/></contentLeft><contentMiddle><Title text="Pagamento Mensal" titleStyle="H3" id="idTitleRecibos"/></contentMiddle></Bar></customHeader><content><Image src="" width="40%" id="idLogo"/><Image src="" width="60%" id="idDemonstra"/><core:HTML id="html" preferDOM="false" content="{Exstrfile}"/><f:Form class="editableForm" editable="true" id="form1" visible="true"><f:layout><f:ResponsiveGridLayout id="idResp_FUNSEJEM" labelSpanXL="4" labelSpanL="4" labelSpanM="12" labelSpanS="12" adjustLabelSpan="false"\n\t\t\t\t\t\t\t\temptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="2" columnsL="2" columnsM="1" singleContainerFullSize="false"/></f:layout><f:formContainers><f:FormContainer id="FormContainer"><f:formElements><f:FormElement id="Elemento5"><Text text="Base INSS: {SalContribuicaoInss} | Base Imposto de Renda: {BaseCalcIrrf} | Base FGTS: {BaseCalcFgts} | Valor FGTS: {FgtsMes}"\n\t\t\t\t\t\t\t\t\t\t\tid="idTotalINSS"/></f:FormElement><f:FormElement id="Elemento6"><Button text="Download versão em (PDF)" width="100%" press="onImprime" icon="sap-icon://print" id="id_imprime" tooltip="Imprimir"/></f:FormElement></f:formElements></f:FormContainer></f:formContainers></f:Form></content><footer><Toolbar id="idOverTollbar" design="Transparent"><HBox width="25%" height="25%" id="idGif" class="Loading"><Image src="imagens/voto_load_white.gif" width="100px" class="footer_img" id="idimg"/></HBox><ToolbarSpacer id="idToolbarSpacerD"/></Toolbar></footer></Page></pages></App></mvc:View>',
		"Y5GL_RECIBOS/Y5GL_RECIBOS/view/ViewSettingsDialog.fragment.xml": '<core:FragmentDefinition\n\txmlns="sap.m"\n\txmlns:core="sap.ui.core"><ViewSettingsDialog\n\t\tid="viewSettingsDialog"\n\t\tconfirm=".onConfirmViewSettingsDialog"><sortItems><ViewSettingsItem\n\t\t\t\ttext="{i18n>masterSort1}"\n\t\t\t\tkey="Zdesc"\n\t\t\t\tselected="true"/></sortItems></ViewSettingsDialog></core:FragmentDefinition>',
		"Y5GL_RECIBOS/Y5GL_RECIBOS/view/admto_15.view.xml": '<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" controllerName="Y5GL_RECIBOS.Y5GL_RECIBOS.controller.admto_15"\n\txmlns:html="http://www.w3.org/1999/xhtml"><App id="appid"><pages><Page id="idPage"><customHeader><Bar id="idBarMaster"><contentMiddle><Title text="Adiantamento Quinzenal" titleStyle="H3" id="idTitleRecibos"/></contentMiddle><contentRight><Button icon="sap-icon://home" id="idteste" press="onBackMaster"/></contentRight></Bar></customHeader><content><UploadCollection id="UploadCollection" multiple="false" change="onChange" fileDeleted="onFileDeleted" uploadButtonInvisible="true"\n\t\t\t\t\t\tbeforeUploadStarts="onBeforeUploadStarts" uploadComplete="onuploadComplete" items="{ path: \'/ZET_GLRH_UPLOADSet\', templateShareable: true }"\n\t\t\t\t\t\tmodelContextChange="onmodelContextChange" mode="SingleSelectMaster"\n\t\t\t\t\t\tuploadUrl="/sap/opu/odata/sap/ZGWGLRH_MEU_CADASTRO_SRV/ZET_GLHR_UPFILESet"\n\t\t\t\t\t\tnoDataDescription="Para adicionar/alterar Anexos selecione o botão ( )" noDataText="Aguardando novos Carregamentos"\n\t\t\t\t\t\tnumberOfAttachmentsText="Anexos"><toolbar><OverflowToolbar id="myId" visible="true"><Title id="attachmentTitle"/><ToolbarSpacer id="idToolbarSpacer"/><SearchField width="10rem" search="onSearch" enabled="false" visible="false" id="idSearchField"/><Button id="deleteSelectedButton" text="Delete" press="onDeleteSelectedItems" enabled="false" visible="false" type="Transparent"/><ToggleButton id="selectAllButton" text="Select all" press="onSelectAllPress" enabled="false" visible="false" type="Transparent"/><UploadCollectionToolbarPlaceholder id="IdUploadCollectionToolbar"/></OverflowToolbar></toolbar><items><UploadCollectionItem documentId="{DocId}" fileName="{Filename}" mimeType="{Mimetype}" enableEdit="false" visibleEdit="false"\n\t\t\t\t\t\t\t\tenableDelete="false" visibleDelete="false" deletePress="onFileDelete" selected="true" id="idUploadCollectionItem"/></items></UploadCollection></content></Page></pages></App></mvc:View>'
	}
});