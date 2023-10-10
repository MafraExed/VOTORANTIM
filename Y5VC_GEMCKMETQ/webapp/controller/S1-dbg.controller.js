sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ndc/BarcodeScanner",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"../model/nfHeaderModel",
	"../model/nfHeaderListModel",
	"../model/formatter",
	"sap/m/MessageBox",
	"sap/ui/Device",
	"../model/nfLabelScanModel"
], function (Controller, BarcodeScanner, MessageToast, JSONModel, NfHeaderModel, NfHeaderListModel, Formatter, MessageBox, Device,
	NfLabelScanModel) {
	"use strict";
	// const cCatEtq = "MAT";
	const cCheckbox = true;
	const cGroupId = "BackendReturn";

	return Controller.extend("Workspace.zconferencia_etiquetas.controller.S1", {
		myFormatter: Formatter,

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Workspace.zconferencia_etiquetas.view.S1
		 */

		onInit: function () {

			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("S1").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

		},

		handleRouteMatched: function (oEvent) {

			if (oEvent.getParameter("data").chvNfe) {
				// Recupera instância do modelo
				this.getInstanceNfHeaderList();
				this._hashMapLabels = new Map();

				// Recupera Estrutura com dados da nota fiscal
				this._nFheaderList.readNfHeaderByChvNfe(this.getView(), this._onLoadSuccess, oEvent.getParameter("data").chvNfe);

				this.onInitLabelCheck();
				this.onInitButtonsState();

			}
		},

		onPressMasterBack: function () {
			this.onPressCancel();
		},

		_onLoadSuccess: function (oView, oModel, oModelItem, oModelLabel) {
			oView.setModel(oModel, "NFHEADERLOC");
			oView.setModel(oModelItem, "NFITEMLIST");
			oView.setModel(oModelLabel, "NFLABELLIST");

			var oModelLabelScan = new JSONModel({});

			oView.setModel(oModelLabelScan, "NFLABELSCAN");
		},

		getInstanceNfHeaderList: function () {
			this._nFheaderList = NfHeaderListModel.getInstance();
		},

		onPressLabelScan: function (oEvent) {
			var that = this;
			BarcodeScanner.scan(
				function (mResult) {
					that.handleScan(mResult.text);
				},
				function (Error) {
					// alert("Scanning failed: " + Error);
				}
			);
		},

		handleScan: function (ScanValue) {

			this.oOwnerComponent = this.getOwnerComponent();
			var cCatEtq = "MAT"; //this.oOwnerComponent.getUrlParameters(this.getView());

			var vEBELN = ScanValue.slice(0, 10); //Nº do documento de compras			> 10
			var vEBELP = ScanValue.slice(10, 15); //Nº item do documento de compra		> 05
			var vNAME1 = ScanValue.slice(15, 50); //SisGenEst - Nome Fornecedor			> 35
			var vMATNR = ScanValue.slice(50, 68); //Nº do material						> 18
			var vMAKTX = ScanValue.slice(68, 108); //Texto breve de material	    	> 40
			var vMENGE = ScanValue.slice(108, 125); //SisGenEst  - Quantidade			> 17
			var vMEINS = ScanValue.slice(125, 128); //Unidade de medida básica			> 03
			var vDUMMY = ScanValue.slice(128, 152); //DUMMY								> 24
			var vNRETQ = ScanValue.slice(152, 162); //SisGenEst  - Número da Etiqueta	> 10

			var oNfLabelListModel = this.getView().getModel("NFLABELLIST").getData();

			var oNfLabel = oNfLabelListModel.find(o => o.nretq === vNRETQ);

			if (oNfLabel === undefined) {

				this._mensageLabelNotFound();

			} else if (oNfLabel.catetq !== cCatEtq) {

				this._mensageCatEtqNotCorrect();
			} else if (this._hashMapLabels.get(vNRETQ)) {
				this._mensageLabelRead();
			} else {

				oNfLabel.checkbox = cCheckbox;

				var oNfLabelScanModel = this.getView().getModel("NFHEADERLOC").getData().getNfLabelScanModelList();

				this._hashMapLabels.set(vNRETQ, vNRETQ);

				var oNfLabelScan = new NfLabelScanModel(vNRETQ);

				oNfLabelScan.setEbeln(vEBELN);
				oNfLabelScan.setEbelp(vEBELP);
				oNfLabelScan.setName1(vNAME1);
				oNfLabelScan.setMatnr(vMATNR);
				oNfLabelScan.setMaktx(vMAKTX);
				oNfLabelScan.setMenge(vMENGE);
				oNfLabelScan.setMeins(vMEINS);
				oNfLabelScan.setChvnfe(oNfLabel.chvnfe);
				oNfLabelScan.setItmnum(oNfLabel.itmnum);

				oNfLabelScanModel.oData.push(oNfLabelScan);

				var oNfLabelScanData = oNfLabelScanModel.oData;

				this.getView().getModel("NFLABELSCAN").setData(oNfLabelScanData);

				var oTranslationModel = this.getView().getModel("i18n");
				var oBundle = oTranslationModel.getResourceBundle();

				var sTextToPrint = oBundle.getText("message_label_correct_add", [vNRETQ]);
				MessageToast.show(sTextToPrint, {
					width: "30em"
				});

			}
		},

		_mensageLabelNotFound: function (vPath) {

			var oTranslationModel = this.getView().getModel("i18n");
			var oBundle = oTranslationModel.getResourceBundle();

			var msg = oBundle.getText("message_label_not_found");

			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.error(msg, {
				styleClass: bCompact ? "sapUiSizeCompact" : ""
			});
		},

		_mensageCatEtqNotCorrect: function (vPath) {

			var oTranslationModel = this.getView().getModel("i18n");
			var oBundle = oTranslationModel.getResourceBundle();

			var msg = oBundle.getText("message_label_not_correct");

			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.error(msg, {
				styleClass: bCompact ? "sapUiSizeCompact" : ""
			});
		},

		_mensageLabelRead: function () {
			var oTranslationModel = this.getView().getModel("i18n");
			var oBundle = oTranslationModel.getResourceBundle();

			var msg = oBundle.getText("message_label_already_read");

			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.error(msg, {
				styleClass: bCompact ? "sapUiSizeCompact" : ""
			});
		},

		onPressAccept: function (oEvent) {

			this.oOwnerComponent = this.getOwnerComponent();
			var cCatEtq = "MAT"; //this.oOwnerComponent.getUrlParameters(this.getView());

			var oTranslationModel = this.getView().getModel("i18n");
			var oBundle = oTranslationModel.getResourceBundle();

			var oNfLabelListModel = this.getView().getModel("NFLABELLIST").getData();

			var oNfLabel = oNfLabelListModel.find(o => o.checkbox !== cCheckbox & o.catetq === cCatEtq);

			var msg;

			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;

			var mySelf = this;

			this.getView().byId("MasterItens").setBusy(true);

			if (oNfLabel !== undefined) {

				msg = oBundle.getText("message_check_not_completed");

			} else {

				msg = oBundle.getText("message_check_completed");

			}

			MessageBox.warning(msg, {
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				styleClass: bCompact ? "sapUiSizeCompact" : "",
				onClose: function (oAction) {
					if (oAction === "YES") {
						mySelf._checkCompleted(mySelf);
					} else {
						mySelf.getView().byId("MasterItens").setBusy(false);
					}
				}
			});
		},

		_sumNfItemBalance: function (oThat) {
			let oView = oThat.getView();
			let oModelLabel = oView.getModel("NFLABELLIST");
			let oLabelData = oModelLabel.getData();

			let mapNfItem = new Map();

			// 1 - Percorre todas as etiquetas da NF-e e sumariza saldo da quantidade por item da NF
			// 1.a - Se etiqueta foi conferida saldo é ZERO
			// 1.b - Se etiqueta não foi conferida saldo é a quantidade da etiqueta

			// 1 - Percorre todas as etiquetas da NF-e e sumariza saldo da quantidade por item da NF
			for (let oLabel of oLabelData) {
				//Etiquetas Ativas
				if (oLabel.status === "AT" && oLabel.catetq === "MAT") {

					let oItem = {};
					oItem = mapNfItem.get(oLabel.itmnum);
					if (oItem) {
						if (oLabel.checkbox === false) {
							oItem.balance = parseFloat(oItem.balance) + parseFloat(oLabel.menge);
						}
					} else {
						oItem = {};
						if (oLabel.checkbox === false) {
							oItem.balance = parseFloat(oLabel.menge);
						} else {
							oItem.balance = parseFloat(0);
						}
						mapNfItem.set(oLabel.itmnum, oItem);
					}
				}
			}
			return mapNfItem;
		},

		_callBackSuccessBo: function (oThat, oData, oResp) {

			let oView = oThat.getView();
			let oTranslationModel = oView.getModel("i18n");
			let oBundle = oTranslationModel.getResourceBundle();
			let bCompact = !!oView.$().closest(".sapUiSizeCompact").length;
			try {
				let vNumeroBo = "";
				if (oData.__batchResponses[0] && oData.__batchResponses[0].__changeResponses) {
					for (let oResponse of oData.__batchResponses[0].__changeResponses) {
						try {
							vNumeroBo = oResponse.data.NumeroBo;
							var vNumeroBoOut = oThat.myFormatter.shiftLeadingZeros(vNumeroBo);

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
				oView.byId("MasterItens").setBusy(false);
			} catch (err) {
				oView.byId("MasterItens").setBusy(false);
				MessageBox.error(oResp.body);
			}
		},

		_callBackSuccess: function (oThat, oData, oResp) {
			let oView = oThat.getView();
			let oTranslationModel = oView.getModel("i18n");
			let oBundle = oTranslationModel.getResourceBundle();

			let bCompact = !!oView.$().closest(".sapUiSizeCompact").length;
			MessageBox.success(oBundle.getText("update_success"), {
				styleClass: bCompact ? "sapUiSizeCompact" : ""
			});

			oView.byId("MasterItens").setBusy(false);
			oView.byId("ScanButton").setEnabled(false);
			oView.byId("AcceptButton").setEnabled(false);
			oView.byId("AcceptButton").setType("Emphasized");

			// Abre BO se necessário
			oThat._handleBO(oThat);
		},

		_callBackError: function (oThat, oData, oResp) {
			let oView = oThat.getView();
			let oTranslationModel = oView.getModel("i18n");
			let oBundle = oTranslationModel.getResourceBundle();

			let bCompact = !!oView.$().closest(".sapUiSizeCompact").length;
			MessageBox.error(oBundle.getText("update_error"), {
				styleClass: bCompact ? "sapUiSizeCompact" : ""
			});

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
			oView.byId("MasterItens").setBusy(false);

		},

		_checkCompleted: function (that) {

			that.oOwnerComponent = that.getOwnerComponent();
			var cCatEtq = "MAT"; // that.oOwnerComponent.getUrlParameters(that.getView());

			var oModel = that.getView().getModel("NFHEADER");
			var oData = that.getView().getModel("NFLABELLIST").getData();
			that.oDataItem = that.getView().getModel("NFITEMLIST").getData();
			var mySelf = that;

			var mParameters = {
				groupId: cGroupId,
				success: function (odata, resp) {
					mySelf._callBackSuccess(mySelf, odata, resp);
				},
				error: function (odata, resp) {
					mySelf._callBackError(mySelf, odata, resp);
				}
			};

			let bUpdate = false;

			var oEntry = {};

			oModel.setDeferredGroups([cGroupId]);
			for (let oValue of oData) {

				if (oValue.catetq === cCatEtq && oValue.status === "AT" && oValue.checkbox === cCheckbox) {
					oEntry = {};

					bUpdate = true;

					oEntry.nretq = oValue.nretq;
					oEntry.chvnfe = oValue.chvnfe;
					oEntry.itmnum = oValue.itmnum;
					oEntry.checkbox = cCheckbox;

					oModel.update("/ZET_VCMM_LABELSet('" + oEntry.nretq + "')", oEntry, {
						groupId: cGroupId
					});
				}
			}

			if (bUpdate === true) {
				oModel.submitChanges(mParameters);
			} else {
				that._handleBO(that);
			}

			//that.getView().byId("MasterItens").setBusy(false);
			/*if (oModel.hasPendingChanges()) {
				
			} else {
				
			}*/
		},

		_handleBO: function (oThat) {
			let oView = oThat.getView();
			oThat._generateBoControl(oThat);
			if (oThat.controlBO.length > 0) {
				oView.byId("MasterItens").setBusy(true);
				oThat._OpenBO(oThat);
			}
		},

		_generateBoControl: function (oThat) {

			let mapNfItem = oThat._sumNfItemBalance(oThat);
			let oNfitem = oThat.getView().getModel("NFITEMLIST").getData();

			oThat.controlBO = [];
			//let oTranslationModel = oThat.getView().getModel("i18n");
			//let oBundle = oTranslationModel.getResourceBundle();

			for (let [key, value] of mapNfItem) {
				if (parseFloat(value.balance) > parseFloat(0)) {

					let oBo = oThat.controlBO.find(o => o.itmnum === key);
					let oItem = oNfitem.find(o => o.itmnum === key);

					if (oBo === undefined || oBo === null || oBo === '') {

						//Cria objeto B.O.
						var BO = {};

						BO.chvnfe = oItem.chvnfe;
						BO.itmnum = oItem.itmnum;
						BO.balance = value.balance.toString();
						BO.ebeln = oItem.ebeln;
						BO.ebelp = oItem.ebelp;
						BO.meins = oItem.meins;
						BO.matnr = oItem.matnr;
						BO.TpItem = "00"; //Ref NF
						if (parseFloat(value.balance) === parseFloat(oItem.menge)) {
							BO.OpAutobo = "0003"; // Texto para o BackEnd "Falta Total"
							BO.TipoBo = "020";
						} else {
							BO.OpAutobo = "0004"; // Texto para o BackEnd "Falta Parcial"
							BO.TipoBo = "018";
						}

						//BO.comentario = oBundle.getText("message_bo") + oValue.nretq;
						oThat.controlBO.push(BO);

					}
					/*(else {
						oBo.comentario = oBo.comentario + " " + oValue.nretq;*/
				}
			}

		},

		onPressCancel: function (oEvent) {

			var oRouter = this.getOwnerComponent().getRouter();
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

			oRouter.navTo("inicio");

		},

		onInitButtonsState: function (oEvent) {

			this.oOwnerComponent = this.getOwnerComponent();
			var cCatEtq = "MAT"; //this.oOwnerComponent.getUrlParameters(this.getView());

			var oTranslationModel = this.getView().getModel("i18n");
			var oBundle = oTranslationModel.getResourceBundle();

			this.getView().byId("ShortScanEtqList").setHeaderText(oBundle.getText("titleS1"));

			var oNfLabelListModel = this.getView().getModel("NFLABELLIST").getData();

			var oNfLabel = oNfLabelListModel.find(o => o.catetq === cCatEtq && o.checkbox === cCheckbox);

			if (oNfLabel !== undefined) {

				this._mensageCheckCompleted();

			} else {
				this.getView().byId("ScanButton").setEnabled(true);
				this.getView().byId("AcceptButton").setEnabled(true);
				this.getView().byId("AcceptButton").setType("Emphasized");
			}

		},

		_mensageCheckCompleted: function () {

			var oTranslationModel = this.getView().getModel("i18n");
			var oBundle = oTranslationModel.getResourceBundle();

			// var msg = oBundle.getText("message_already_completed");

			// var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			// MessageBox.error(msg, {
			// 	styleClass: bCompact ? "sapUiSizeCompact" : ""
			// });

			this.getView().byId("ScanButton").setEnabled(false);
			this.getView().byId("AcceptButton").setEnabled(false);
			this.getView().byId("AcceptButton").setType("Emphasized");

			this.getView().byId("ShortScanEtqList").setHeaderText(oBundle.getText("message_already_completed"));
		},

		onInitLabelCheck: function () {

			this.oOwnerComponent = this.getOwnerComponent();
			var cCatEtq = "MAT";
			// this.oOwnerComponent.getUrlParameters(this.getView());

			var oData = this.getView().getModel("NFLABELLIST").getData();
			var mySelf = this;
			if (oData instanceof Array) {
				oData.forEach(function (oValue) {
					if (oValue.catetq === cCatEtq && oValue.status === "AT" && oValue.checkbox === cCheckbox) {

						var oNfLabelScanModel = mySelf.getView().getModel("NFHEADERLOC").getData().getNfLabelScanModelList();

						var oNfItem = mySelf.getView().getModel("NFITEMLIST").getData().find(o => o.itmnum === oValue.itmnum);

						var oNfLabelScan = new NfLabelScanModel(oValue.nretq);

						oNfLabelScan.setMatnr(oNfItem.matnr);
						oNfLabelScan.setMaktx(oNfItem.maktx);

						oNfLabelScanModel.oData.push(oNfLabelScan);

						var oNfLabelScanData = oNfLabelScanModel.oData;

						mySelf.getView().getModel("NFLABELSCAN").setData(oNfLabelScanData);
					}
				});
			}
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf Workspace.zconferencia_etiquetas.view.S1
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf Workspace.zconferencia_etiquetas.view.S1
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf Workspace.zconferencia_etiquetas.view.S1
		 */
		onExit: function () {

			this._nFheaderList.resetNFList();
			this._nFheaderList.clear();
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
		handleMatDescPress: function (oEvent) {

			if (!this._valueMatDescDialog) {
				this._valueMatDescDialog = sap.ui.xmlfragment("Workspace.zconferencia_etiquetas.view.MatDesc", this);
				this.getView().addDependent(this._valueMatDescDialog);
			}

			var cCatEtq = "MAT"; // this.oOwnerComponent.getUrlParameters(this.getView());

			if (cCatEtq === "MAT") {

				var vPath = oEvent.getSource().getBindingContext("NFLABELSCAN").getPath();
				var oNfLabelListModel = oEvent.getSource().getModel("NFLABELSCAN").getProperty(vPath);
				var oNfItemListModel = this.getView().getModel("NFITEMLIST").getData();
				var oNfItemIndex = oNfItemListModel.findIndex(o => o.chvnfe === oNfLabelListModel.chvnfe && o.itmnum === oNfLabelListModel.itmnum);

				var vPathNFItem = "NFITEMLIST>".concat("/", oNfItemIndex);
				this._valueMatDescDialog.bindElement(vPathNFItem);
				this._valueMatDescDialog.open();
			}
		},
		onCloseMatDesc: function (oEvent) {
			this._valueMatDescDialog.close();
		},

		_OpenBO: function (oThat) {

			var oModel = this.getView().getModel("NFHEADER");
			var mySelf = oThat;

			var oEntry = {};

			var mParameters = {
				groupId: "BackendReturnBO",
				success: function (oData, oResp) {
					mySelf._callBackSuccessBo(mySelf, oData, oResp);
				},
				error: function (oData, oResp) {
					mySelf._callBackError(mySelf, oData, oResp);
				}
			};

			let bCreated = false;

			oModel.setDeferredGroups(["BackendReturnBO"]);
			for (let oValue of mySelf.controlBO) {
				if (oValue.chvnfe !== undefined) {

					if (!bCreated) {
						oEntry = {
							"ChaveXmlNfe": oValue.chvnfe,
							"ZAT_VCMM_BOHEADER_TO_BOITEM": []
						};
						bCreated = true;
					}

					var oBoItem = { //Item
						"Itmnum": oValue.itmnum,
						"TpItem": oValue.TpItem,
						"TipoBo": oValue.TipoBo,
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
				}
			}

			if (bCreated) {
				oModel.create("/ZET_VCMM_BOHEADERSet", oEntry, {
					groupId: "BackendReturnBO"
				});

				oModel.submitChanges(mParameters);
			}

		},
		//*********
		onPressBO: function (oEvent) {

			let oView = this.getView();

			this.oDialogBo = oView.byId("idDialogSplitLabel");

			if (!this.oDialogBo) {
				this.oDialogBo = sap.ui.xmlfragment(oView.getId(), "Workspace.zconferencia_etiquetas.view.BoOp", this);
			}

			// // Multi-select if required
			// var bMultiSelect = !!oEvent.getSource().data("multi");
			// this._oDialog.setMultiSelect(bMultiSelect);

			// // Remember selections if required
			// var bRemember = !!oEvent.getSource().data("remember");
			// this._oDialog.setRememberSelections(bRemember);

			this.getView().addDependent(this.oDialogBo);

			//this._setBoDetails(oView.getModel("NFITEMLIST").getContext("/0"));
			this.byId("SelBoNfeItem").setSelectedKey("NFITEMLIST>/0/itmnum");

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

		onPressRightover: function (oEvent) {
			this.byId("ListBO").setVisible(true);
			this.byId("UploadCollection").setVisible(true);
			this.byId("Text_area").setGrowingMaxLines(3);
		},

		onSaveBO: function (oEvent) {
			let oView = this.getView();
			let oTranslationModel = oView.getModel("i18n");
			let oBundle = oTranslationModel.getResourceBundle();

			var vTipoBO = oView.byId("item").getSelectedKey();

			if (!this.validateMandatoryBOFields(vTipoBO)) {
				this.controlBO = [];

				//Cria objeto B.O.
				var BO = {};

				BO.balance = oView.byId("qtd_material_bo").getValue();
				BO.comentario = oView.byId("Text_area").getValue();

				if (sap.ushell !== undefined) {
					BO.user = sap.ushell.Container.getUser().getFullName();
				}

				var oModel = oView.getModel("BOANEXOLOC");
				if (oModel && oModel !== undefined) {
					BO.anexo = oModel.getData();
					oModel.destroy();
				}
				let oBindingContext = {};
				switch (vTipoBO) {
				case "017": // Sobra
					oBindingContext = oView.byId("SelBoNfeItem").getSelectedItem().getBindingContext("NFITEMLIST");
					BO.OpAutobo = "0002"; // Texto para o BackEnd "Sobra fisica parcial"
					BO.TpItem = "00"; //Ref NF
					break;
				case "021": // Item Novo
					oBindingContext = oView.getModel("NFITEMLIST").getContext("/0");
					BO.OpAutobo = "0005"; // Texto para o BackEnd Item Novo
					BO.TpItem = "01"; //Item avulso
					break;
				case "019": // Avaria
					oBindingContext = oView.byId("SelBoNfeItem").getSelectedItem().getBindingContext("NFITEMLIST");
					BO.OpAutobo = "0006"; // Texto para o BackEnd Avaria
					BO.TpItem = "00"; //Ref NF
					break;
				}

				BO.chvnfe = oBindingContext.getProperty("chvnfe");
				BO.itmnum = oBindingContext.getProperty("itmnum");
				BO.ebeln = oBindingContext.getProperty("ebeln");
				BO.ebelp = oBindingContext.getProperty("ebelp");
				BO.matnr = oBindingContext.getProperty("matnr");
				BO.meins = oBindingContext.getProperty("meins");
				BO.TipoBo = vTipoBO;

				this.controlBO.push(BO);
				this._OpenBO(this);
				//this._setBusy(this, true);
				this.onCloseBO();
			} else {
				MessageBox.error(oBundle.getText("validate_field_error"), {
					title: oBundle.getText("update_error"),
					styleClass: "sapUiSizeCompact"
				});
			}
		},
		validateMandatoryBOFields: function (vTipoBO) {
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

			// Verifica se item da NF-e foi identificado
			if (vTipoBO === "017" || // Sobra
				vTipoBO === "019") { // Avaria 
				let oControl = oView.byId("SelBoNfeItem");
				if (oControl.getSelectedItem() === null) {
					oControl.setValueState("Error");
					oControl.setValueStateText(oBundle.getText("input_required"));
					bValidationError = true;
				} else {
					oControl.setValueState("None");
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

		_onChangeItemListBO: function (oEvent) {

			this._setBoDetails(oEvent.getParameter("selectedItem").getBindingContext("NFITEMLIST"));
		},

		_setBoDetails: function (oContext) {

			this.byId("MatSAPDescBO").setValue(oContext.getProperty("maktx"));
			this.byId("MatNFDescBO").setValue(oContext.getProperty("descProd"));

		},
		_setBusy: function (oThat, boolVisible) {
			let oControl = oThat.byId("root");
			oControl.setBusy(boolVisible);
		},
	});

});