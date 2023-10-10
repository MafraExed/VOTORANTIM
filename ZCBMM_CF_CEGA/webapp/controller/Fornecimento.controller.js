sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessagePopover",
	"sap/m/MessageItem",
	"sap/m/MessageBox"
], function(Controller, JSONModel, MessageToast, MessagePopover, MessageItem, MessageBox) {
	"use strict";

	// var oMessageTemplate = new MessageItem({
	// 	type: '{msgModel>type}',
	// 	title: '{msgModel>title}',
	// 	description: '{msgModel>description}',
	// 	subtitle: '{msgModel>subtitle}',
	// 	counter: '{msgModel>counter}'
	// });

	return Controller.extend("ZCBMM_CF_CEGA.ZCBMM_CF_CEGA.controller.Fornecimento", {

		handleMessagePopoverPress: function(oEvent) {
			this._getMessagePopover().openBy(oEvent.getSource());
		},
		_getMessagePopover: function() {
			if (!this._oMessagePopover) {
				this._oMessagePopover = sap.ui.xmlfragment(this.getView().getId(), "ZCBMM_CF_CEGA.ZCBMM_CF_CEGA.fragment.BatchProcessingReturn",
					this);
				this.getView().addDependent(this._oMessagePopover);
			}
			return this._oMessagePopover;
			
		},

		aReturn: {
			suc: [],
			err: []
		},

		// _setMessages: function() {
		// 	var oMsgModel = this.getView().getModel("msgModel");

		// 	var aMsgs = [];

		// 	for (var i = 0; i < this.aReturn.err.length; i++) {
		// 		aMsgs.push({
		// 			type: 'Error',
		// 			title: this.aReturn.err[i].text
		// 		});
		// 	}

		// 	for (var i = 0; i < this.aReturn.suc.length; i++) {

		// 		if (this.aReturn.suc[i].text !== "") {
		// 			aMsgs.push({
		// 				type: 'Warning',
		// 				title: this.aReturn.suc[i].text
		// 			});
		// 		}
		// 	}

		// },

		_resetErrorCount: function() {

		},

		_bindView: function(oArguments) {
			if(!oArguments.series){
				oArguments.series = '';
			}
			var oModel = this.getView().getModel();
			var sKey = oModel.createKey("/FornecimentoCBSet", {
				Lifnr: oArguments.lifnr,
				Nfnum: oArguments.nfnum,
				Series: oArguments.series
			});

			this.getView().bindElement({
				path: sKey,
				parameters: {
					expand: "ToIt"
				}
			});
			this._resetTableFieldInputValues();
		},

		onInit: function() {

			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(this._handleRoutePatternMatched, this);

			// this.getView().setModel(new JSONModel({}), "msgModel");

		},

		_clearReturnModel: function(){
			this.aReturn = {
				suc: [],
				err: []
			};
		},
		_handleRoutePatternMatched: function(oEvent) {
			if (oEvent.getParameter("name") !== "fornecimento") {
				return;
			}

			var oArguments = oEvent.getParameter("arguments");

			this._resetErrorCount(); //TODO

			this._clearReturnModel();

			this._bindView(oArguments);

		},

		onContagemCegaPress: function() {

			var oModel = this.getView().getModel();
			var aDeferredGroups = ["ContagemCegaId"];
			var este = this;
		
			oModel.setDeferredGroups(aDeferredGroups);
			var array = [];
			var oTable = this.byId("fornecimentoItemTable");
			var aItems = oTable.getItems();
			var obj;

			if (!this._isContagemCegaFormValid()) {
				return;
			}

			for (var i = 0; i < aItems.length; i++) {
				var oItem = aItems[i];
				var obj2 = {
				matnr: null,
				vol: null
				};
			
				obj = oModel.getObject(oItem.getBindingContextPath());
				var qtd = oItem.getCells()[4].getValue();
				// var qtd = oItem.getCells()[3].getValue();
				// qtd = oItem.getCells()[3].getValue().replace('.','');
				// qtd = parseFloat(oItem.getCells()[3].getValue().replace(',','.'));
				var vol = parseFloat(oItem.getCells()[5].getValue());
				
				// if( qtd === 0 ){
				// 	qtd = parseFloat(oItem.getCells()[3].getValue().replace(',','.'));
				// }
				
				obj2.matnr = obj.Matnr;
				obj2.vol = vol;
				array.push(obj2);
				este._array = array;

				oModel.callFunction("/ContagemCega", {
					method: "POST",
					urlParameters: {
						Fornecedor: obj.Lifnr,
						Matnr: obj.Matnr,
						Nfe: obj.Nfnum,
						Serie: obj.Series,
						Subitem: obj.Subit,
						Ebeln: obj.Ebeln,
						Ebelp: obj.Ebelp,
						Quantidade: qtd,
						Volume: vol
					},
					success: function(oData, response) {
						for(var c = 0; c < este._array.length; c++){
							if (este._array[c].matnr === oData.Matnr){
								este._impressao(oData.Matnr, este._array[c].vol);
								este._array.splice(c, 1);
								break;
							}
						}
						
						MessageToast.show("Contagem realizada com sucesso.");
						try {
							this.aReturn.suc.push({
								text: JSON.parse(response.headers["sap-message"]).message
							});

						} catch (err) {
							
						}
					}.bind(this),
					error: function(oError) {
						var oResponse = JSON.parse(oError.responseText);
						if (oResponse.hasOwnProperty("error")) {

							this.aReturn.err.push({
								text: oResponse.error.message.value
							});
							//MessageBox.error(oResponse.error.message.value);
							// oMessageModel.getData().push({
							// 	type: 'Error',
							// 	title: 'Erro',
							// 	description: oResponse.error.message.value
							// });
						}

					}.bind(this),
					groupId: "ContagemCegaId"
				});

			}

			oModel.submitChanges({
				groupId: "ContagemCegaId",
				success: function(a, b) {
					oModel.refresh();

					if (this.aReturn.err.length <= 0) {

						this._resetTableFieldInputValues();
						
						if(this.aReturn.suc.length > 0){
							MessageBox.error(this.aReturn.suc[0].text);
						}
						
						this._clearReturnModel();
					} else {
						MessageBox.error(this.aReturn.err[0].text);
						this._clearReturnModel();

					}

					// this._setMessages();

				}.bind(this),
				error: function(e) {
					oModel.refresh();
				}.bind(this)
			});
		this.oRouter.navTo("worklist", true); 
		},
		
		_impressao: function(Matnr, vol) {

			var oModel2 = this.getOwnerComponent().getModel();
				//
				oModel2.callFunction("/ImprimirPorMaterial", {
					method: "POST",
					urlParameters: {
						Matnr: Matnr,
						Quantidade: vol,
						Name: this.getView().byId("imp").getSelectedItem().getKey()
					},
					success: function(oData, response) {

					}.bind(this),
					error: function(oError) {

					}
				});

			
		},

		_resetTableFieldInputValues: function() {
			var aItems = this.byId("fornecimentoItemTable").getItems();

			for (var i = 0; i < aItems.length; i++) {
				var oItem = aItems[i];
				
				// oItem.getCells()[0].setValue("");
				// oItem.getCells()[1].setValue("");
				// oItem.getCells()[2].setValue("");
				oItem.getCells()[4].setValue("");
				oItem.getCells()[5].setValue("1");

			}
		},

		// onRegistrarEMPress: function(){
		
		// 	var oModel = this.getView().getModel();
		// 	var obj = this.getView().getBindingContext().getObject();
		// 	var sXmlChaveNfe = obj.XmlChaveNfe;
		// 	var sUrl = "http://vide0401.votorantim.grupo:8004/sap/bc/gui/sap/its/webgui?~transaction=ZGLMM490 S_BUKRS-LOW=2001&S_CHAVE-LOW=" + sXmlChaveNfe + "&~okcode=ONLI";
			
		// 	 sap.m.URLHelper.redirect(sUrl, true);
		// },
		
		onRegistrarEMPress: function() {

			var oModel = this.getView().getModel();
			var obj = this.getView().getBindingContext().getObject();

			oModel.callFunction("/RegistrarEntrMerc", {
				method: "POST",
				urlParameters: {
					Lifnr: obj.Lifnr,
					Nfnum: obj.Nfnum,
					Series: obj.Series

				},
				success: function(oData, response) {

					MessageToast.show("Entrada de mercadoria registrada com sucesso.");

				}.bind(this),
				error: function(oError) {
					var oResponse = JSON.parse(oError.responseText);
					if (oResponse.hasOwnProperty("error")) {

						MessageBox.error(oResponse.error.message.value);
					} else {

					}

				}.bind(this)
			});
		
		},
		
		

		_isContagemCegaFormValid: function() {

			var oTable = this.byId("fornecimentoItemTable");
			var aItems = oTable.getItems();
			var bValid = true;
			var qtd, vol;

			//TODO: substituir por constraints

			for (var i = 0; i < aItems.length; i++) {
				var oItem = aItems[i];

				qtd = oItem.getCells()[4].getValue();
				vol = oItem.getCells()[5].getValue();

				//typeof x == "number" && x >= 0

				if ( qtd === ""  || isNaN(vol) || vol === "0" ) {
					MessageToast.show("Erro: preencha todos os campos antes de realizar a contagem.");
					return false;
					// bValid = false; 
				}

			}

			return bValid;
		}

	});

});