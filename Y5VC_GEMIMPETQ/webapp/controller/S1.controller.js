sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ndc/BarcodeScanner",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"../model/nfHeaderModel",
	"../model/nfHeaderListModel",
	"../model/formatter",
	"sap/m/MessageBox",
	"sap/m/UploadCollectionParameter",
	"sap/ui/Device"
], function (Controller, BarcodeScanner, MessageToast, JSONModel, NfHeaderModel, NfHeaderListModel, Formatter, MessageBox,
	UploadCollectionParameter, Device) {
	"use strict";

	return Controller.extend("Workspace.zimprimir_etiqueta.controller.S1", {
		formatter: Formatter,

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Workspace.zimprimir_etiqueta.view.S1
		 */
		handleRouteMatched: function (oEvent) {
			// var sAppId = "App5c06d9238147af3ab5537f2a";

			// var oParams = {};

			if (oEvent.getParameter("data").chvNfe) {
				// Recupera instância do modelo
				this.getInstanceNfHeaderList();

				// Recupera Estrutura com dados da nota fiscal
				this._nFheaderList.readNfHeaderByChvNfe(this.getView(), this._onLoadSuccess, oEvent.getParameter("data").chvNfe);

			}

			var oDetailList = this.getView().byId("DetailList");
			var oEtqList = this.getView().byId("EtqList");

			oEtqList.setBusy(true);

			var vPath = "NFITEMLIST>/0";
			oDetailList.bindElement({
				path: vPath
			});
			oEtqList.bindElement({
				path: vPath
			});

			this.onInitButtonsState();
			this._statusAcceptButtonConverter();

			this._LabelPendingData = [];

			this._LabelPrintQueue = new Map();
			this._resetQtyLabelInput();

			oEtqList.setBusy(false);

			this.onNavBackDetail();

		},

		onInit: function () {

			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("S1").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

		},

		_onLoadSuccess: function (oView, oModel, oModelItem) {
			oView.setModel(oModel, "NFHEADERLOC");
			oView.setModel(oModelItem, "NFITEMLIST");
		},

		getInstanceNfHeaderList: function () {
			this._nFheaderList = NfHeaderListModel.getInstance();
		},

		onPressMasterBack: function () {
			this.onPressCancel();
		},

		onPressItemMaster: function (oEvent) {
			var oContext = oEvent.getParameters().listItem.getBindingContext("NFITEMLIST");
			var oDetailList = this.getView().byId("DetailList");
			var oEtqList = this.getView().byId("EtqList");

			var vPathAnt = oContext.getPath();
			let oData = oDetailList.getModel("NFITEMLIST");
			var vPathMax = oData.length;
			var vPathNewB = this._previousPath(vPathAnt, vPathMax);

			if (vPathNewB !== undefined) {
				this.getView().byId("LeftButton").setEnabled(true);
			} else {
				this.getView().byId("LeftButton").setEnabled(false);
			}

			var vPathNewN = this._nextPath(vPathAnt, vPathMax);

			if (vPathNewN !== undefined) {
				this.getView().byId("RightButton").setEnabled(true);
			} else {
				this.getView().byId("RightButton").setEnabled(false);
			}

			var vPath = "NFITEMLIST>".concat(oContext.getPath());

			oDetailList.bindElement({
				path: vPath
			});
			oEtqList.bindElement({
				path: vPath
			});

			this._resetQtyLabelInput();
			this._statusAcceptButtonConverter();

			if (Device.system.phone === true) {
				this.getView().byId("root").hideMaster();
				var vID = this.getView().byId("iten_detail").getId();
				this.getView().byId("root").toDetail(vID);
			}
		},

		onPressAccept: function (oEvent) {

			var oTranslationModel = this.getView().getModel("i18n");
			var oBundle = oTranslationModel.getResourceBundle();

			// var oPrintButton = this.getView().byId("PrintButton");
			// var sTypePrintButton = oPrintButton.getType();

			var sItemtext = this.getView().byId("DetailList").getHeaderText();

			let oContext = this.getView().byId("DetailList").getBindingContext("NFITEMLIST");
			let vMengeEtq = oContext.getProperty("mengeEtqToPrint");
			let vChvnfe = oContext.getProperty("chvnfe");
			let vItmNum = oContext.getProperty("itmnum");
			let vMengeTotEtq = oContext.getProperty("mengeEtq");
			let vXchpf = oContext.getProperty("xchpf"); //Lote Obrigatório
			let vEbeln = oContext.getProperty("ebeln");

			let vMengeMat = oContext.getProperty("mengeMat");
			let vBalance = oContext.getProperty("balance");
			// let vDataValidade = oContext.getProperty("dataValidade");
			
			let vDataValidade = this.getView().byId("datVal_etq").getDateValue();
			
			if (vDataValidade !== null && vDataValidade !== undefined && vDataValidade !== '') {
			let oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-ddTHH:mm:ss"
			});
			vDataValidade = oDateFormat.format(vDataValidade);
			}

			if (vMengeEtq <= 0 || vMengeMat < 0) {

				if (vMengeMat < 0) {
					this.getView().byId("qtd_material").setValueState("Error");
				}

				this.getView().byId("qtd_etq").setValueState("Error");

				let bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.error(oBundle.getText("values_error"), {
					styleClass: bCompact ? "sapUiSizeCompact" : ""
				});
				return;
			} else {
				this.getView().byId("qtd_material").setValueState("Success");
				this.getView().byId("qtd_etq").setValueState("Success");
			}

			if (vXchpf !== undefined && vXchpf !== null && vXchpf === true) {

				if (vDataValidade === "" || vDataValidade === undefined || vDataValidade === null ) {
					this.getView().byId("datVal_etq").setValueState("Error");
					let bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
					MessageBox.error(oBundle.getText("date_error"), {
						styleClass: bCompact ? "sapUiSizeCompact" : ""
					});
					return;
				} else {
					this.getView().byId("datVal_etq").setValueState("Success");
				}
			}

			if (vEbeln === undefined || vEbeln === null || vEbeln === "") {

				let bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.error(oBundle.getText("ebeln_error"), {
					styleClass: bCompact ? "sapUiSizeCompact" : ""
				});
				return;
			}

			// Verifica se saldo remanescente é maior ou igual a quantidade desejada
			if (vBalance >= vMengeEtq * vMengeMat) {

				// Há saldo
				// Cria etiquetas 
				for (let i = 0; i < vMengeEtq; i++) {
					let oLabel = {};
					oLabel.chvnfe = vChvnfe;
					oLabel.itmnum = vItmNum;
					oLabel.categoriaEtq = "MAT";
					oLabel.status = "AT";
					oLabel.menge = vMengeMat.toString();
					oLabel.dataValidade = vDataValidade;

					this._LabelPendingData.push(oLabel);
				}

				// Subtrai saldo
				vBalance = vBalance - vMengeEtq * vMengeMat;

				vBalance = vBalance.toFixed(3);
				oContext.getModel().setProperty(oContext.getPath() + "/balance", vBalance);
				vMengeTotEtq = parseFloat(vMengeTotEtq) + parseFloat(vMengeEtq) * parseFloat(vMengeMat);
				vMengeTotEtq = vMengeTotEtq.toFixed(3);
				oContext.getModel().setProperty(oContext.getPath() + "/mengeEtq", vMengeTotEtq.toString());

				this._setStatus(vChvnfe, vItmNum, "01");

				if (vBalance === parseFloat(0)) {
					var sTextToPrint = oBundle.getText("print_flag", [sItemtext]);
					MessageToast.show(sTextToPrint, {
						width: "30em"
					});
					this.onNavBackDetail();

					//this.onPressRight(null);
				} else {
					this._resetQtyLabelInput();
					MessageToast.show(oBundle.getText("message_label_enqueue"));
					this.onNavBackDetail();
				}

			} else {
				// Erro, não há saldo suficiente
				// Etiqueta inválida
				MessageToast.show(oBundle.getText("error_no_balance"));
				return;
			}
		},

		onPressLeft: function (oEvent) {

			let oView = this.getView().byId("DetailList");

			var vPathAnt = oView.getElementBinding("NFITEMLIST").getPath();
			var vPathMax = oView.getModel("NFITEMLIST").getData().length;
			var vPathNew = this._previousPath(vPathAnt, vPathMax);

			this.getView().byId("RightButton").setEnabled(true);
			this.getView().byId("qtd_material").setValueState("None");
			this.getView().byId("qtd_etq").setValueState("None");

			if (vPathNew !== undefined) {

				var oDetailList = this.getView().byId("DetailList");
				var oEtqList = this.getView().byId("EtqList");

				var vPath = "NFITEMLIST>".concat(vPathNew);

				oDetailList.bindElement({
					path: vPath
				});
				oEtqList.bindElement({
					path: vPath
				});
			}
			this._resetQtyLabelInput();
			this._statusAcceptButtonConverter();
		},

		onPressRight: function (oEvent) {

			let oView = this.getView().byId("DetailList");
			var vPathAnt = oView.getElementBinding("NFITEMLIST").getPath();
			var vPathMax = oView.getModel("NFITEMLIST").getData().length;
			var vPathNew = this._nextPath(vPathAnt, vPathMax);

			this.getView().byId("LeftButton").setEnabled(true);
			this.getView().byId("qtd_material").setValueState("None");
			this.getView().byId("qtd_etq").setValueState("None");

			if (vPathNew !== undefined) {

				var oDetailList = this.getView().byId("DetailList");
				var oEtqList = this.getView().byId("EtqList");

				var vPath = "NFITEMLIST>".concat(vPathNew);

				oDetailList.bindElement({
					path: vPath
				});
				oEtqList.bindElement({
					path: vPath
				});
				this._resetQtyLabelInput();
			}
			this._statusAcceptButtonConverter();
		},

		_nextPath: function (vPathAnt, vPathMax) {

			var vPathAntFields = vPathAnt.split("/");
			var vPathAntNumber = vPathAntFields[1];
			++vPathAntNumber;

			if (vPathAntNumber < vPathMax) {
				var vPathNew = "/".concat(vPathAntNumber);
			}
			if (vPathAntNumber === (vPathMax - 1)) {
				this.getView().byId("RightButton").setEnabled(false);
			}
			return vPathNew;
		},

		_previousPath: function (vPathAnt, vPathMax) {

			var vPathAntFields = vPathAnt.split("/");
			var vPathAntNumber = vPathAntFields[1];
			--vPathAntNumber;

			if (vPathAntNumber <= vPathMax && vPathAntNumber >= 0) {
				var vPathNew = "/".concat(vPathAntNumber);
			}

			if (vPathAntNumber === 0) {
				this.getView().byId("LeftButton").setEnabled(false);
			}
			return vPathNew;
		},

		_statusAcceptButtonConverter: function (that) {
			return;
			var mySelf;
			if (that !== undefined) {
				mySelf = that;
			} else {
				mySelf = this;
			}

			var oDetailList = mySelf.getView().byId("DetailList");

			if (typeof oDetailList.getBindingContext("NFITEMLIST") === "undefined") {

			} else {
				var vStatus = oDetailList.getBindingContext("NFITEMLIST").getProperty("status");

				if (vStatus === "11") {
					mySelf.getView().byId("AcceptButton").setType("Emphasized");
					mySelf.getView().byId("AcceptButton").setEnabled(true);
					mySelf.getView().byId("qtd_material").setValueState("Success");
					mySelf.getView().byId("qtd_etq").setValueState("Success");
					mySelf.getView().byId("qtd_material").setEnabled(true);
					mySelf.getView().byId("qtd_etq").setEnabled(true);
				} else if (vStatus === "00") {
					mySelf.getView().byId("AcceptButton").setType("Default");
					mySelf.getView().byId("AcceptButton").setEnabled(true);
					mySelf.getView().byId("qtd_material").setEnabled(true);
					mySelf.getView().byId("qtd_etq").setEnabled(true);
				} else if (vStatus === "01") {
					mySelf.getView().byId("AcceptButton").setType("Default");
					mySelf.getView().byId("AcceptButton").setEnabled(true);
					mySelf.getView().byId("qtd_material").setValueState("Success");
					mySelf.getView().byId("qtd_etq").setValueState("Success");
					mySelf.getView().byId("qtd_material").setEnabled(false);
					mySelf.getView().byId("qtd_etq").setEnabled(false);
				} else if (vStatus === "12") {
					mySelf.getView().byId("AcceptButton").setType("Emphasized");
					mySelf.getView().byId("AcceptButton").setEnabled(true);
					mySelf.getView().byId("qtd_material").setValueState("Success");
					mySelf.getView().byId("qtd_etq").setValueState("Success");
					mySelf.getView().byId("qtd_material").setEnabled(false);
					mySelf.getView().byId("qtd_etq").setEnabled(false);
				} else {
					mySelf.getView().byId("AcceptButton").setType("Emphasized");
					mySelf.getView().byId("AcceptButton").setEnabled(false);
					mySelf.getView().byId("qtd_material").setEnabled(false);
					mySelf.getView().byId("qtd_etq").setEnabled(false);
				}
			}
		},

		onPressCancel: function () {

			var oTranslationModel = this.getView().getModel("i18n");
			var oBundle = oTranslationModel.getResourceBundle();

			var msg = oBundle.getText("message_cancel_process");

			var mySelf = this;
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;

			if (this._LabelPendingData.length !== 0) {

				MessageBox.warning(msg, {
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					onClose: function (oAction) {
						if (oAction === "YES") {

							// Ajuste de Botões
							mySelf.getView().byId("AcceptButton").setType("Default");
							mySelf.getView().byId("RightButton").setEnabled(false);
							mySelf.getView().byId("LeftButton").setEnabled(false);

							var oRouter = mySelf.getOwnerComponent().getRouter();
							mySelf._nFheaderList.resetNFList();
							var oModel = mySelf.getView().getModel("NFHEADERLOC");
							if (oModel) {
								oModel.destroy();
							}

							oModel = mySelf.getView().getModel("NFITEMLIST");
							if (oModel) {
								oModel.destroy();
							}

							oRouter.navTo("inicio");

						}
					}
				});
			} else {
				// Ajuste de Botões
				mySelf.getView().byId("AcceptButton").setType("Default");
				mySelf.getView().byId("RightButton").setEnabled(false);
				mySelf.getView().byId("LeftButton").setEnabled(false);

				var oRouter = mySelf.getOwnerComponent().getRouter();
				mySelf._nFheaderList.resetNFList();
				var oModel = mySelf.getView().getModel("NFHEADERLOC");
				if (oModel) {
					oModel.destroy();
				}

				oModel = mySelf.getView().getModel("NFITEMLIST");
				if (oModel) {
					oModel.destroy();
				}

				oRouter.navTo("inicio");
			}
		},

		onPressPrint: function (oEvent) {
			
			let oPrintButton = this.byId("PrintButton");
			oPrintButton.setEnabled(false);
			
			var oTranslationModel = this.getView().getModel("i18n");
			var oBundle = oTranslationModel.getResourceBundle();
			var oData = this.getView().getModel("NFITEMLIST").getData();

			var that = this;
			let boolBalanceGreaterThanZero;
			let oControl = this.byId("iten_detail");
			oControl.setBusy(true);

			that.controlBO = [];

			if (this._LabelPendingData.length > 0) {

				for (let oValue of oData) {

					if (parseFloat(oValue.balance) !== 0.00) {
						//Cria objeto B.O.
						var BO = {};
						boolBalanceGreaterThanZero = true;
						BO.chvnfe = oValue.chvnfe;
						BO.itmnum = oValue.itmnum;
						BO.balance = oValue.balance;
						BO.ebeln = oValue.ebeln;
						BO.ebelp = oValue.ebelp;
						BO.meins = oValue.meins;
						BO.TpItem = "00"; //Ref NF
						BO.OpAutobo = "0004"; // Texto para o BackEnd "Falta parcial"
						this.controlBO.push(BO);
					}
				}

				if (boolBalanceGreaterThanZero) {
					MessageBox.show(
						oBundle.getText("message_question_balance_greater_zero"), {
							icon: MessageBox.Icon.INFORMATION,
							title: oBundle.getText("title_message_peding_balance"),
							actions: [MessageBox.Action.YES, MessageBox.Action.NO],
							onClose: function (oAction) {
								if (oAction === "YES") {
									//Imprimir etiquetas
									that._PrintItens(that);
									//Abrir BO
									that._OpenBO(that, "018");

								} else {
									// Não fazer nada.
									MessageToast.show(oBundle.getText("message_canceled_by_user"));
									oControl.setBusy(false);
									oPrintButton.setEnabled(true);
								}
							}
						}
					);
				} else {
					//Imprimir etiquetas
					that._PrintItens(that);
				}
			} else {
				// Não há itens na fila de impressão
				MessageToast.show(oBundle.getText("error_no_label_on_print_queue"));
				oControl.setBusy(false);
				oPrintButton.setEnabled(true);
			}
		},

		_PrintItens: function (oThat) {

			var oModel = oThat.getView().getModel("NFHEADER");
			var oData = oThat.getView().getModel("NFITEMLIST").getData();
			var mySelf = oThat;

			oModel.setDeferredGroups(["BackendReturn"]);
			var mParameters = {
				groupId: "BackendReturn",
				success: function (odata, resp) {

					if (odata !== undefined) {
						var oTranslationModel = mySelf.getView().getModel("i18n");
						var oBundle = oTranslationModel.getResourceBundle();
						oThat._LabelPendingData = [];
						mySelf._oDataReturnAjust(mySelf, "S");
						jQuery.sap.log.info("OnPrint Callback");
						mySelf._PDF(mySelf);
						mySelf._statusAcceptButtonConverter(mySelf);

						var bCompact = !!mySelf.getView().$().closest(".sapUiSizeCompact").length;
						MessageBox.success(oBundle.getText("update_success"), {
							styleClass: bCompact ? "sapUiSizeCompact" : ""
						});
						oThat.getView().byId("iten_detail").setBusy(false);
						oThat.getView().byId("PrintButton").setEnabled(true);
					}
				},
				error: function (odata, resp) {

					if (odata !== undefined) {
						var oTranslationModel = mySelf.getView().getModel("i18n");
						var oBundle = oTranslationModel.getResourceBundle();

						var bCompact = !!mySelf.getView().$().closest(".sapUiSizeCompact").length;
						MessageBox.error(oBundle.getText("update_error"), {
							styleClass: bCompact ? "sapUiSizeCompact" : ""
						});

						mySelf._oDataReturnAjust(mySelf, "E");
					}
					mySelf.getView().byId("iten_detail").setBusy(false);
					oThat.getView().byId("PrintButton").setEnabled(true);
				}
			};

			let mPrintBalance = new Map();

			for (let oLabel of this._LabelPendingData) {

				if (oLabel.menge > parseFloat(0)) {
					oModel.create("/ZET_VCMM_LABELSet", oLabel, {
						groupId: "BackendReturn"
					});

					let oPrintBalance = mPrintBalance.get(oLabel.itmnum);
					if (oPrintBalance) {
						oPrintBalance.mengeEtq = parseFloat(oPrintBalance.mengeEtq) + parseFloat(oLabel.menge);
						mPrintBalance.set(oLabel.itmnum, oPrintBalance);
					} else {
						let newPrintBalance = {};
						newPrintBalance.mengeEtq = parseFloat(oLabel.menge);
						mPrintBalance.set(oLabel.itmnum, newPrintBalance);
					}
				}
			}

			for (let oValue of oData) {
				let oEntry = {};

				let oPrintBalance = mPrintBalance.get(oValue.itmnum);

				if (oPrintBalance) {

					oEntry.Chvnfe = oValue.chvnfe;
					oEntry.Itmnum = oValue.itmnum;
					//		oEntry.mengeEtq = parseInt(oValue.mengeEtq,10) + parseInt(oPrintBalance.mengeEtq,10);
					oEntry.mengeEtq = oValue.mengeEtq.toString();

					if (oValue.menge === oEntry.mengeEtq) {
						oEntry.Status = "02"; //Marcar para impressão Pendente	
					} else {
						oEntry.Status = "01"; //Marcar para impressão Pendente	
					}
					oModel.update("/ZET_VCMM_NFITEMSet(Chvnfe='" + oEntry.Chvnfe + "',Itmnum='" + oEntry.Itmnum + "')", oEntry, {
						groupId: "BackendReturn"
					});

				}
			}

			oModel.submitChanges(mParameters);

		},

		_oDataReturnAjust: function (that, vAction) {

			// var oModel = that.getView().getModel("NFHEADER");
			var oData = that.getView().getModel("NFITEMLIST").getData();

			// var oTranslationModel = that.getView().getModel("i18n");
			// var oBundle = oTranslationModel.getResourceBundle();

			// var vChvnfe = this.getView().byId("DetailList").getBindingContext("NFITEMLIST").getProperty("chvnfe");
			// var vItmNum = this.getView().byId("DetailList").getBindingContext("NFITEMLIST").getProperty("itmnum");
			// var vStatus = this.getView().byId("DetailList").getBindingContext("NFITEMLIST").getProperty("status");
			// var oItem = this._nFheaderList.findByItmNum(vChvnfe, vItmNum);

			var oModel = that.getView().getModel("NFITEMLIST");

			if (oData instanceof Array) {
				oData.forEach(function (oValue) {

					if ((oValue.status === "11" || oValue.status === "12") && vAction === "S") {

						var oItem = that._nFheaderList.findByItmNum(oValue.chvnfe, oValue.itmnum);
						oItem.setStatus("02");
						oModel.updateBindings();
					} else {
						// var oItemE = that._nFheaderList.findByItmNum(oValue.chvnfe, oValue.itmnum);
						// oItemE.setStatus("00");
						// oModel.updateBindings();
					}
				});
			}
		},
		_PDF: function (that) {

			jQuery.sap.log.info("OnPDF print");
			var vChvnfe = that.getView().byId("DetailList").getBindingContext("NFITEMLIST").getProperty("chvnfe");

			var string = that.getView().getModel("NFHEADER").sServiceUrl +
				"/ZET_VCMM_FILESet(fileName='" + vChvnfe + "',fileCategory='MAT',fileDescription='asdsa')/$value";
			// var oModel = that.getView().getModel("NFHEADER");
			// var mySelf = that;
			parent.window.open(string, "_blank");
			// sap.m.URLHelper.destroy();
			// sap.m.URLHelper.redirect(string, true);
			//sap.m.URLHelper.redirect(string, true); 
			//window.open();
		},

		onNavBackDetail: function (oEvent) {
			this.getView().byId("root").backMaster();
		},

		onInitButtonsState: function () {

			var oDetailList = this.getView().byId("DetailList");
			var oEtqList = this.getView().byId("EtqList");

			var vPathAnt = "/0";
			let oModel = oDetailList.getModel("NFITEMLIST");
			var vPathMax = 0;
			if (oModel && oModel.getData()) {
				vPathMax = oModel.getData().length;
			}
			var vPathNewB = this._previousPath(vPathAnt, vPathMax);

			if (vPathNewB !== undefined) {
				this.getView().byId("LeftButton").setEnabled(true);
			} else {
				this.getView().byId("LeftButton").setEnabled(false);
			}

			var vPathNewN = this._nextPath(vPathAnt, vPathMax);

			if (vPathNewN !== undefined) {
				this.getView().byId("RightButton").setEnabled(true);
			} else {
				this.getView().byId("RightButton").setEnabled(false);
			}

			var vPath = "NFITEMLIST>".concat("/0");

			oDetailList.bindElement({
				path: vPath
			});
			oEtqList.bindElement({
				path: vPath
			});

			this._statusAcceptButtonConverter();

			if (Device.system.phone === true) {
				this.getView().byId("root").hideMaster();
				var vID = this.getView().byId("iten_detail").getId();
				this.getView().byId("root").toDetail(vID);
			}
		},

		onExit: function () {

			// var oRouter = this.getOwnerComponent().getRouter();
			this._nFheaderList.resetNFList();
			var oModel = this.getView().getModel("NFHEADERLOC");
			if (oModel) {
				oModel.destroy();
			}

			oModel = this.getView().getModel("NFITEMLIST");
			if (oModel) {
				oModel.destroy();
			}

			oModel = this.getView().getModel("NFLABELLIST");
			if (oModel) {
				oModel.destroy();
			}

			oModel = this.getView().getModel("NFLABELSCAN");
			if (oModel) {
				oModel.destroy();
			}

		},

		_resetQtyLabelInput: function () {
			let oContext = this.getView().byId("DetailList").getBindingContext("NFITEMLIST");
			if (oContext) {
				oContext.getModel().setProperty(oContext.getPath() + "/mengeEtqToPrint", "1");
				oContext.getModel().setProperty(oContext.getPath() + "/mengeMat", oContext.getProperty("balance"));
			}

		},

		_setStatus: function (vChvnfe, vItmNum, vStatus) {
			let oItem = this._nFheaderList.findByItmNum(vChvnfe, vItmNum);

			let oModel = this.getView().getModel("NFITEMLIST");

			oItem.setStatus("11");

			oModel.updateBindings();
		},

		_OpenBO: function (oThat, vBoType) {

			var oModel = this.getView().getModel("NFHEADER");
			var bCompact = !!oThat.getView().$().closest(".sapUiSizeCompact").length;

			var mySelf = oThat;
			var oView = mySelf.getView();
			var oBundle = oView.getModel("i18n").getResourceBundle();

			var mParameters = {
				groupId: "BackendReturn",
				success: function (oData, oResp) {
					mySelf._setBusy(mySelf, false);
					mySelf.getView().byId("iten_detail").setBusy(false);
					mySelf.getView().byId("PrintButton").setBusy(false);
					var vNumeroBo;
					try {
						//successo
						if (oData.__batchResponses[0] && oData.__batchResponses[0].__changeResponses) {
							for (let oResponse of oData.__batchResponses[0].__changeResponses) {
								try {
									vNumeroBo = oResponse.data.NumeroBo;
									var vNumeroBoOut = oThat.formatter.shiftLeadingZeros(vNumeroBo);

									if (vNumeroBoOut <= 0) {
										vNumeroBo = undefined;
										continue;
									}
									MessageBox.success(
										oBundle.getText("text_create_bo_success", [vNumeroBoOut]), {
											styleClass: bCompact ? "sapUiSizeCompact" : ""
										});

									break;
								} catch (errResp) {
									continue;
								}
							}
						}

						if (!vNumeroBo) {
							var vMsgErro = "";
							try {
								var responseParser = JSON.parse(oData.__batchResponses[0].response.body);
								var errorDetails = responseParser.error.innererror.errordetails;
								if (errorDetails.length > 1) {
									vMsgErro = errorDetails[0].message;
								} else {
									vMsgErro = responseParser.error.message.value;
								}
							} catch (errMsg) {
								vMsgErro = oData.__batchResponses[0].message;
							}
							MessageBox.error(vMsgErro, {
								title: oBundle.getText("update_error"),
								styleClass: "sapUiSizeCompact"
							});
						}
					} catch (err) {
						MessageBox.error(oResp.body);
					}
				},
				error: function (oData, resp) {
					mySelf._setBusy(mySelf, false);

					if (oData.__batchResponses !== undefined) {
						var vMsgErro = "";
						try {
							var responseParser = JSON.parse(oData.__batchResponses[0].response.body);
							var errorDetails = responseParser.error.innererror.errordetails;
							if (errorDetails.length > 1) {
								vMsgErro = errorDetails[0].message;
							} else {
								vMsgErro = responseParser.error.message.value;
							}
						} catch (err) {
							vMsgErro = oData.__batchResponses[0].message;
						}
						MessageBox.error(vMsgErro, {
							title: oBundle.getText("update_error"),
							styleClass: "sapUiSizeCompact"
						});
					} else {
						MessageBox.error(oBundle.getText("update_error"), {
							styleClass: bCompact ? "sapUiSizeCompact" : ""
						});
					}
				}
			};

			var oEntry = {};

			oModel.setDeferredGroups(["BackendReturn"]);
			for (let oValue of mySelf.controlBO) {
				if (oValue.chvnfe !== undefined) {
					oEntry = {
						"ChaveXmlNfe": oValue.chvnfe,
						"ZAT_VCMM_BOHEADER_TO_BOITEM": []
					};
					var oBoItem = { //Item
						"Itmnum": oValue.itmnum,
						"TpItem": oValue.TpItem,
						"TipoBo": vBoType,
						"QuantidadeBo": oValue.balance,
						"Matnr": oValue.matnr,
						"Meins": oValue.meins,
						"OpAutobo": oValue.OpAutobo,
						"ZAT_VCMM_BOITEM_TO_BOHIST": [{ //Histórico (chat)
							"Comentario": oValue.comentario
						}],
						"ZAT_VCMM_BOITEM_TO_BOANEXO": [] //Anexos
					};

					var oBoItemAnexos = oValue.anexo;
					if (oBoItemAnexos instanceof Array) {
						for (var i = 0; i < oBoItemAnexos.length; i++) {
							oBoItemAnexos[i].Tcode = null;
							var oBoAnexo = {};
							oBoAnexo.Chadat = oBoItemAnexos[i].Chadat;
							oBoAnexo.Chanam = oBoItemAnexos[i].Chanam;
							oBoAnexo.Chatim = oBoItemAnexos[i].Chatim;
							oBoAnexo.Credat = oBoItemAnexos[i].Credat;
							oBoAnexo.Crenam = oBoItemAnexos[i].Crenam;
							oBoAnexo.Cretim = oBoItemAnexos[i].Cretim;
							oBoAnexo.DocumentType = oBoItemAnexos[i].DocumentType;
							oBoAnexo.FilePath = oBoItemAnexos[i].FilePath;
							oBoAnexo.Description = oBoItemAnexos[i].Description;
							oBoAnexo.MimeType = oBoItemAnexos[i].MimeType;
							oBoAnexo.Base64 = oBoItemAnexos[i].Base64;

							oBoItem.ZAT_VCMM_BOITEM_TO_BOANEXO.push(oBoAnexo);
						}
					}

					oEntry.ZAT_VCMM_BOHEADER_TO_BOITEM.push(oBoItem);

					oModel.create("/ZET_VCMM_BOHEADERSet", oEntry, {
						groupId: "BackendReturn"
					});
				}
				oModel.submitChanges(mParameters);
			}

		},

		_setBusy: function (oThat, boolVisible) {
			let oControl = oThat.byId("root");
			oControl.setBusy(boolVisible);
		},
		//*********
		onPressBO: function (oEvent) {

			let oView = this.getView();

			this.oDialogBo = oView.byId("idDialogSplitLabel");

			if (!this.oDialogBo) {
				this.oDialogBo = sap.ui.xmlfragment(oView.getId(), "Workspace.zimprimir_etiqueta.view.BoOp", this);
			}

			// // Multi-select if required
			// var bMultiSelect = !!oEvent.getSource().data("multi");
			// this._oDialog.setMultiSelect(bMultiSelect);

			// // Remember selections if required
			// var bRemember = !!oEvent.getSource().data("remember");
			// this._oDialog.setRememberSelections(bRemember);

			this.getView().addDependent(this.oDialogBo);

			var vText = this.byId("DetailList").getHeaderText();
			this.byId("ListBO").setHeaderText(vText);

			var vTextMatSap = this.getView().byId("DetailList").getBindingContext("NFITEMLIST").getProperty("maktx");
			this.byId("MatSAPDescBO").setValue(vTextMatSap);

			var vTextMat = this.getView().byId("DetailList").getBindingContext("NFITEMLIST").getProperty("descProd");
			this.byId("MatNFDescBO").setValue(vTextMat);

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this.onPressOthers();

			var oBo = [];
			this.getView().setModel(new JSONModel(), "BOANEXOLOC");
			this.getView().getModel("BOANEXOLOC").setData(oBo);

			this.byId("UploadCollection").destroyItems();

			this.oDialogBo.open();
		},

		onPressLeftover: function (oEvent) {
			this.byId("ListBO").setVisible(true);
			this.byId("UploadCollection").setVisible(false);
			this.byId("Text_area").setGrowingMaxLines(6);
		},

		onPressOthers: function (oEvent) {
			this.byId("ListBO").setVisible(false);
			this.byId("UploadCollection").setVisible(true);
			this.byId("Text_area").setGrowingMaxLines(3);
		},

		onSaveBO: function (oEvent) {
			let oTranslationModel = this.getView().getModel("i18n");
			let oBundle = oTranslationModel.getResourceBundle();

			var vTipoBO = this.getView().byId("item").getSelectedKey();

			if (!this.validateMandatoryBOFields()) {
				this.controlBO = [];

				//Cria objeto B.O.
				var BO = {};
				BO.chvnfe = this.getView().byId("DetailList").getBindingContext("NFITEMLIST").getProperty("chvnfe");
				BO.itmnum = this.getView().byId("DetailList").getBindingContext("NFITEMLIST").getProperty("itmnum");
				BO.balance = this.getView().byId("qtd_material_bo").getValue();
				BO.ebeln = this.getView().byId("DetailList").getBindingContext("NFITEMLIST").getProperty("ebeln");
				BO.ebelp = this.getView().byId("DetailList").getBindingContext("NFITEMLIST").getProperty("ebelp");
				BO.matnr = this.getView().byId("DetailList").getBindingContext("NFITEMLIST").getProperty("matnr");
				BO.meins = this.getView().byId("DetailList").getBindingContext("NFITEMLIST").getProperty("meins");
				BO.comentario = this.getView().byId("Text_area").getValue();

				if (sap.ushell !== undefined) {
					BO.user = sap.ushell.Container.getUser().getFullName();
				}

				var oModel = this.getView().getModel("BOANEXOLOC");
				if (oModel && oModel !== undefined) {
					BO.anexo = oModel.getData();
					oModel.destroy();
				}

				switch (vTipoBO) {
				case "017": // Sobra
					BO.OpAutobo = "0002"; // Texto para o BackEnd "Sobra fisica parcial"
					BO.TpItem = "00"; //Ref NF
					break;
				case "021": // Item Novo
					BO.OpAutobo = "0005"; // Texto para o BackEnd Item Novo
					BO.TpItem = "01"; //Item avulso
					break;
				case "019": // Avaria
					BO.OpAutobo = "0006"; // Texto para o BackEnd Avaria
					BO.TpItem = "00"; //Ref NF
					break;
				}

				this.controlBO.push(BO);
				this._OpenBO(this, vTipoBO);
				this._setBusy(this, true);
				this.onCloseBO();
			} else {
				MessageBox.error(oBundle.getText("validate_field_error"), {
					title: oBundle.getText("update_error"),
					styleClass: "sapUiSizeCompact"
				});
			}
		},
		validateMandatoryBOFields: function () {
			// Verifica se campos obrigatórios estão preenchidos
			let aMandatoryFields = [
				"qtd_material_bo"
			];

			let oView = this.getView();
			let bValidationError = false;
			let oTranslationModel = this.getView().getModel("i18n");
			let oBundle = oTranslationModel.getResourceBundle();

			for (let vControlId of aMandatoryFields) {
				let oControl = oView.byId(vControlId);
				if (oControl) {
					if (!oControl.getEditable()) {
						continue;
					}

					if (oControl.getValue() === "") {
						oControl.setValueState("Error");
						oControl.setValueStateText(oBundle.getText("input_required"));
						bValidationError = true;
					} else {
						oControl.setValueState("None");
					}
				}
			}

			return bValidationError;
		},
		onCloseBO: function (oEvent) {
			this.byId("Text_area").setValue(null);
			this.byId("qtd_material_bo").setValue(null);
			this.byId("item").setSelectedKey("021");
			this.oDialogBo.close();
			var oModel = this.getView().getModel("BOANEXOLOC");
			if (oModel !== undefined) {
				oModel.updateBindings();
			}
		},

		onChange: function (oEvent) {

			var oBoAnexo = {};

			oBoAnexo.Chadat = null;
			oBoAnexo.Chanam = null;
			oBoAnexo.Chatim = null;
			oBoAnexo.Credat = null;
			oBoAnexo.Crenam = null;
			oBoAnexo.Cretim = null;
			// oBoAnexo.Description = vBoNum + vBoItem;
			oBoAnexo.DocumentType = "BO";
			oBoAnexo.FilePath = oEvent.getParameter("files")[0].name;
			oBoAnexo.Guid = null;
			// oBoAnexo.ItemBo = vBoItem;
			let vMime = "";
			if (oEvent.getParameter("files")[0].type) {
				vMime = oEvent.getParameter("files")[0].type.substring(0, 30);
			}
			oBoAnexo.MimeType = vMime;
			// oBoAnexo.NumeroBo = vBoNum;
			oBoAnexo.Tcode = "1";
			oBoAnexo.File = oEvent.getParameter("files")[0];
			//oBoAnexo.Selected = null;
			oBoAnexo.Source = oEvent.getSource();

			// ler conteudo do anexo
			oBoAnexo.Base64 = null;
			var reader = new FileReader();
			reader.onload = function (e) {
				oBoAnexo.Base64 = e.currentTarget.result.replace("data:" + oBoAnexo.File.type + ";base64,", "");
			};
			reader.readAsDataURL(oBoAnexo.File);

			var oModel = this.getView().getModel("BOANEXOLOC");
			if (oModel && oModel !== undefined) {
				var oData = this.getView().getModel("BOANEXOLOC").getData();
			}
			if (oData && oData instanceof Array) {
				oData.push(oBoAnexo);
			} else {
				var oBo = [];
				oBo.push(oBoAnexo);
				this.getView().setModel(new JSONModel(), "BOANEXOLOC");
				this.getView().getModel("BOANEXOLOC").setData(oBo);
			}

			this.getView().getModel("BOANEXOLOC").updateBindings();
		},
		onUploadComplete: function (oEvent) {
			//var sUploadedFileName = oEvent.getParameter("files")[0].fileName;
			/*setTimeout(function () {
				var oUploadCollection = this.byId("UploadCollection").destroyItems();

				for (var i = 0; i < oUploadCollection.getItems().length; i++) {
					oUploadCollection.removeItem(oUploadCollection.getItems()[i]);
				}
			}.bind(this), 8000);*/

		},
		handleMatDescPress: function (oEvent) {

			if (!this._valueMatDescDialog) {
				this._valueMatDescDialog = sap.ui.xmlfragment("Workspace.zimprimir_etiqueta.view.MatDesc", this);
				this.getView().addDependent(this._valueMatDescDialog);
			}

			var oContext = this.getView().byId("DetailList").getBindingContext("NFITEMLIST");
			var vPath = "NFITEMLIST>".concat(oContext.getPath());
			this._valueMatDescDialog.bindElement(vPath);
			this._valueMatDescDialog.open();

		},
		onCloseMatDesc: function (oEvent) {
			this._valueMatDescDialog.close();
		}
	});
});