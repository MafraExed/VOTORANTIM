sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ndc/BarcodeScanner",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"../model/nfHeaderModel",
	"../model/nfHeaderListModel",
	"../model/formatter",
	"sap/m/MessageBox"
], function (Controller, BarcodeScanner, MessageToast, JSONModel, NfHeaderModel, NfHeaderListModel, Formatter, MessageBox) {
	"use strict";

	return Controller.extend("Workspace.zimprimir_etiqueta.controller.S0", {
		myFormatter: Formatter,
		onInit: function () {
			this.oView = this.getView();

			this.oView.setModel(new JSONModel({
				data: []
			}));

			var oModel = this.oView.getModel();

			// attach handlers for validation errors
			// sap.ui.getCore().getMessageManager().registerObject(this.oView.byId("nameInput"), true);
			sap.ui.getCore().getMessageManager().registerObject(this.oView.byId("Chave_NfeInput"), true);

			this.getView().setModel(oModel);
			this._nFheaderList = NfHeaderListModel.getInstance();
			this.oView._oRouter = this.getOwnerComponent().getRouter();
			
		},
		onPressScan: function (oEvent) {
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
			this.byId("Chave_NfeInput").setValue(ScanValue);
			this.byId("Chave_NfeInput").fireEvent("submit");
			// this.onChaveNfeInputSubmit(ScanValue);
		},
		_getChvnfeByBarcode: function (vBarCode) {
			var vChvNfe = "";
			if (vBarCode.length === 184) { // etiqueta
				vChvNfe = vBarCode.substring(0, 44);	
			} else if (vBarCode.length === 44) { //chave de acess
				vChvNfe = vBarCode;
			}
			return vChvNfe;
		},
		onChaveNfeInputSubmit: function (oEvent) {
			//var oBundle = this.getView().getModel("i18n").getResourceBundle();
			//var vChvNfe = "";
			// var oRouter = this.getOwnerComponent().getRouter();
			let oView = this.getView();
			var that = this;
			that._setBusy(oView,true);
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

			var vBarCode = oEvent.getParameter("value");
			if (vBarCode === undefined) {
				vBarCode = this.byId("Chave_NfeInput").getValue();
			}
			
			
			if (vBarCode && vBarCode.length === 44) {
				this._readNfe(that,vBarCode);
			} 
			else{
				this._checkLabelStatus(vBarCode);	
			}
			
		},
		
		_readNfe: function(oThat,vBarCode){

			let that = oThat;
			let oBundle = that.getView().getModel("i18n").getResourceBundle();
			let vChvNfe = that._getChvnfeByBarcode(vBarCode);
			
			if (vChvNfe && vChvNfe.length === 44) {
				that._nFheaderList.addNF(new NfHeaderModel(vChvNfe));
				that._setNfHeaderListModel();
				that.onProcessReadNfe(that, vChvNfe);
			} else {
				MessageBox.error(oBundle.getText("errorBarCodInvalid"), {
					title: oBundle.getText("error"),
					styleClass: "sapUiSizeCompact"
				});
			}
		},
		
		
		_setNfHeaderListModel: function () {
			this.getView().setModel(this._nFheaderList.getModelList(), "NFHEADERLIST");
		},
		onProcessReadNfe: function (that, vChvNfe) {
			var mySelf = this;
			this.getView().byId("idPage").setBusy(true);
			this._nFheaderList.readEntitiesByChvNFe(this.getView(), mySelf._cProcessSuccess, mySelf._cProcessError, that, vChvNfe);
		},
		_cProcessSuccess: function (oView, oModel, that) {
			oView.setModel(oModel, "NFHEADERLIST");
			
			// Verifica status da NF-e para impressão de etiquetas de material
			// Só permite conferência de etiquetas no status 05
			if ( oModel.getData().statusNfe < "05"  || 
				 oModel.getData().statusNfe > "05"	 ){ 
				
				// NF-e com status invalido para impressão de etiquetas
				var oTranslationModel = oView.getModel("i18n");
				var oBundle = oTranslationModel.getResourceBundle();
				MessageBox.error(oBundle.getText("invalid_nfe_status"), {
					title: oBundle.getText("error"),
					styleClass: "sapUiSizeCompact"
				});					
				
				//that._setBusy(oView,false);	
				oView.byId("Chave_NfeInput").setBusy(false);
				oView.byId("idPage").setBusy(false);				
			}
			else {
				
				if (oModel.getData().statusNfe === undefined ){
					// Não encontrou NF-e
					oTranslationModel = oView.getModel("i18n");
					oBundle = oTranslationModel.getResourceBundle();
					MessageBox.error(oBundle.getText("nfe_not_found"), {
						title: oBundle.getText("error"),
						styleClass: "sapUiSizeCompact"
					});					
				
					oView.byId("Chave_NfeInput").setBusy(false);
					oView.byId("idPage").setBusy(false);				
					
				}else{
					var oCtx = oModel.getData().chvnfe; //that._getChvnfeByBarcode( vBarcode );
					var oRouter = oView._oRouter;
					oRouter.navTo("visao_itens", {
						chvNfe: oCtx
					});
		
					oView.byId("Chave_NfeInput").setValue("");
					oView.byId("Chave_NfeInput").setBusy(false);
					oView.byId("idPage").setBusy(false);				
				}
			}
		},

		_cProcessError: function (oView) { //Erro ao buscar a NF no ECC

			var oTranslationModel = oView.getModel("i18n");
			var oBundle = oTranslationModel.getResourceBundle();
			MessageBox.error(oBundle.getText("read_chave_error"), {
				title: oBundle.getText("error"),
				styleClass: "sapUiSizeCompact"
			});

			oView.byId("idPage").setBusy(false);
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
		
		_checkLabelStatus: function(vText){
			
			// Verifica se etiqueta está com status "ATIVA"
			
			let oLabel = {};
			let oView = this.getView();
			let oModel = oView.getModel("NFHEADER");
			let that = this;
			var oBundle = oView.getModel("i18n").getResourceBundle();
			oLabel = this._decodeVolumeQrCode(vText);
			
			oModel.read("/ZET_VCMM_LABELSet('" + oLabel.nretq + "')", {
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
								that._readNfe(that, vText);	
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