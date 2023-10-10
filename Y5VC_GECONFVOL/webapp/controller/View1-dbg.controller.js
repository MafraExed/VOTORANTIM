sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ndc/BarcodeScanner",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (Controller, BarcodeScanner, JSONModel, MessageBox, MessageToast) {
	"use strict";

	return Controller.extend("workspace.conferenciavolumes.zconferencia_volumes.controller.View1", {
		onInit: function () {

			this.oView = this.getView();

			this.oView.setModel(new JSONModel({
				data: {}
			}));
			
			this._initialization();
		},
		onPressScan: function (oEvent) {
			var that = this;
			BarcodeScanner.scan(
				function (mResult) {
					jQuery.sap.log.info("OnScan primeiro callback");
					that._onScan(mResult.text);
				},
				function (Error) {
					jQuery.sap.log.info("OnScan segundo callback");
				},
    			function (oResult) {
    				jQuery.sap.log.info("OnScan terceiro callback");
    			}
			);
		},
		_onScan: function (vValue) {

			let oView = this.getView();
			let oBundle = oView.getModel("i18n").getResourceBundle();
			let oVolume = new this._decodeVolumeQrCode(vValue);

			if (oVolume === null || !oVolume.chvnfe) {
				// Etiqueta inválida
				MessageBox.error(oBundle.getText("error_invalid_label"), {
					title: oBundle.getText("error_title"),
					styleClass: "sapUiSizeCompact"
				});
			} else {
				this._checkLabelStatus(oVolume);

			}
		},

		_decodeVolumeQrCode: function (vText) {

			let oVolume = {};

			if (vText.length === 184) {
				oVolume.chvnfe = vText.substring(0, 44);
				oVolume.branch = vText.substring(44, 48);
				oVolume.branchName = vText.substring(48, 78);
				oVolume.vendor = vText.substring(78, 113);
				oVolume.volume = vText.substring(113, 121);
				oVolume.dummy = vText.substring(121, 171);
				oVolume.categoriaEtq = vText.substring(171, 174);
				oVolume.nretq = vText.substring(174, 184);
			}

			return oVolume;
		},

		_handleReadLabel: function (oVolume) {

			let oView = this.getView();
			let oBundle = oView.getModel("i18n").getResourceBundle();
			
			if (this._NfHeaderRead.size === 0) {
				this._NfHeaderRead.set(oVolume.chvnfe, oVolume.chvnfe);

				// Read NF
				this._readNfheader(oVolume);
				this._checkLabel(oVolume);
			} else {
				// Verifica se NF-e lida é a mesma em visualização
				if (this._NfHeaderRead.get(oVolume.chvnfe) === undefined) {
					// Erro etiqueta de outra NF-e
					// Etiqueta inválida
					MessageToast.show(oBundle.getText("error_invalid_label_wrong_nfe"));

				} else {
					// Mesma NF-e verifica se Etiqueta já foi lida
					this._checkLabel(oVolume);

				}
			}
		},
		_checkLabel: function (oVolume) {

			let oView = this.getView();
			let oBundle = oView.getModel("i18n").getResourceBundle();
			if (this._LabelsRead.get(oVolume.nretq) === undefined) {
				this._LabelsRead.set(oVolume.nretq, oVolume.nretq);
				let oModel = oView.getModel("NFHEADER");
				let oData = oModel.getData();
				oData.checkedVolumes = this._LabelsRead.size;
				oModel.setData(oData);

				let oNfHeaderList = oView.getModel("NFVOLUMELIST");
				let oDataList = oNfHeaderList.getData();
				oDataList.push({
					"nretq": oVolume.nretq
				});
				oNfHeaderList.setData(oDataList);

			} else {
				// Etiqueta já foi lida
				MessageToast.show(oBundle.getText("error_label_already_checked"));
			}
		},
		_readNfheader: function (oVolume) {

			let oView = this.getView();
			let oBundle = oView.getModel("i18n").getResourceBundle();
			let oModel = oView.getModel("GE");
			let oNfHeaderModel = oView.getModel("NFHEADER");
			oView.setBusy(true);
			oModel.read("/ZET_VCMM_NFHEADERSet(Chvnfe='" + oVolume.chvnfe + "')", {
					success: (oDataResp, oResponse) => {
						if (oDataResp !== null) {
							let oData = oNfHeaderModel.getData();
							oData.nfenum = oDataResp.nfenum;
							oData.serie = oDataResp.series;
							oData.vendor = oDataResp.fornecedorNome;
							oData.step = oDataResp.etapa;
							oData.state = oDataResp.state;
							oData.totVolumes = parseInt(oDataResp.vol, 10);
							oData.date = oDataResp.docDat;
							oData.statusNfeDescr = oDataResp.statusNfeDescr;
							oData.branch		 = oDataResp.branch;
							oData.branchName	 = oDataResp.descricaoFilial;
							oNfHeaderModel.setData(oData);

						}
						oView.setBusy(false);
					},
					error: function (oError) {
						oView.setBusy(false);
						// Etiqueta inválida
						MessageBox.error(oBundle.getText("error_communication"), {
							title: oBundle.getText("error_title"),
							styleClass: "sapUiSizeCompact"
						});
					}
				}

			);

		},

		_initialization: function () {

			let oModel = new JSONModel({
				"nfenum": "",
				"serie": "",
				"date": "",
				"vendor": "",
				"step": "",
				"state": sap.ui.core.ValueState.None,
				"branch":"",
				"branchName":"",
				"totVolumes": "0",
				"checkedVolumes": "0",
				"statusNfeDescr": ""
			});

			this.getView().setModel(oModel, "NFHEADER");

			let oModelTable = new JSONModel([]);
			this.getView().setModel(oModelTable, "NFVOLUMELIST");

			this._LabelsRead = new Map();
			this._NfHeaderRead = new Map();
			
		},

		onPressCancel: function (oEvento) {
			this._initialization();
		},
		
		_checkLabelStatus: function(oVolume){
			
			// Verifica se etiqueta está com status "ATIVA"
			
			let oLabel = {};
			let oView = this.getView();
			let oModel = oView.getModel("GE");
			let that = this;
			var oBundle = oView.getModel("i18n").getResourceBundle();
			
			
			oModel.read("/ZET_VCMM_LABELSet('" + oVolume.nretq + "')", {
					success: (oData, oResp) => {
						// Erro
						if (oData.__batchResponses) {

							let responseText = oData.__batchResponses[0].response.body;
							let responseParser = JSON.parse(responseText);
							MessageBox.error(responseParser.error.message.value, {
								styleClass: "sapUiSizeCompact"
							});
						}
						else{
							if ( oData.status === "AT" ){
								this._handleReadLabel(oVolume);
							}else{
								if ( oData.status === "CA" ){	
								// Etiqueta Cancelada	
									MessageBox.error(oBundle.getText("label_cancelled"),{
										title: oBundle.getText("error"),
										styleClass: "sapUiSizeCompact"
									});												
								}else{
									// Outro STATUS
									MessageBox.error(oBundle.getText("label_not_active"), {
										title: oBundle.getText("error"),
										styleClass: "sapUiSizeCompact"
									});												
								}
							}
						}
						that._setBusy(oView,false);
					},
					error: function (oError) {
						MessageBox.error(oBundle.getText("read_chave_error"), {
							title: oBundle.getText("error"),
							styleClass: "sapUiSizeCompact"
						});			
						that._setBusy(oView,false);
					}
				});
		},
		_setBusy: function(oView,boolValue){
			oView.byId("Chave_NfeInput").setBusy(boolValue);
			oView.byId("idPage").setBusy(boolValue);
		}
	});
});