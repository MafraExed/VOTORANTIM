sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/m/Button',
	'sap/m/Text',
	'sap/m/MessageBox',
	'sap/m/Dialog',
	"../model/formatter"
], function (Controller, JSONModel, Filter, FilterOperator, Button, Text, MessageBox, Dialog, formatter) {
	"use strict";
	var Fikrs;
	var Kunnr;
	var Knkli;
	var NivelDet;
	var texto2;
	return Controller.extend("Y5VC_PAINEL_NE2.Y5VC_PAINEL_NE2.controller.Promessas", {

		formatter: formatter,

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Y5VC_PAINEL_NE2.Y5VC_PAINEL_NE2.view.Items
		 */
		onInit: function () {

			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});

			this.getRouter().getRoute("Promessas").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "PromessasView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});

		},

		_onObjectMatched: function (oEvent) {
			 Fikrs = oEvent.getParameter("arguments").Fikrs;
			 Kunnr = oEvent.getParameter("arguments").Kunnr;
			 Knkli = oEvent.getParameter("arguments").Knkli;
			 NivelDet = oEvent.getParameter("arguments").NivelDet;
			
			var table = this.getView().byId("IdProm");
			table.rebindTable("e");
		},
		
		getText: function (oEvent){
			texto2 = oEvent.getText();
		},
		
		Cancelamento: function (oEvent) {
			var selecionados = this.getView().byId("table2").getSelectedIndices();
			var table = this.getView().byId("table2");
			
			var este = this;
			var oModel = this.getView().getModel();
			oModel.setUseBatch(true);
			var oParameters = {};
			var sTexto;

			var smartTable = this.getView().byId("IdProm");

			if (selecionados.length < 1) {
				sap.m.MessageBox.error("Nenhum item selecionado");
				return;
			}

			if (selecionados.length > 1) {
				sap.m.MessageBox.error("Selecionar apenas um item");
				return;
			}
			
			var stprom = table.getContextByIndex([selecionados[0]]).getObject().StProm;
			
			if (stprom !== '01'){
				sap.m.MessageBox.error("É possível cancelar apenas items com status '01'");
				return;
			}
			
			var texto = "Motivo do Cancelamento (50 caracteres)";
			var dialog = new Dialog({
				title: texto,
				type: "Message",
				content: [
					new sap.m.Label({
						text: "",
						labelFor: "submitDialogTextarea"
					}),
					new sap.m.TextArea("submitDialogTextarea", {
						id: "IdTextArea",
						//value: 
						//value: "\n TESTE TABELAS REGISTRO CONTATO CLIENTES. \n TESTE DE QUEBRA DE LINHA 01. \n  \n TALEXANDRETA--21/07/2020------ \n",
						//width: "150%",
						editable: true,
						growing: true,
						rows: 1,
						cols: 100,
						liveChange: function (oEvent2) {
						texto2 = oEvent2.getParameter("value");
					        }
						//placeholder: "Digite aqui."
					})
				],
				beginButton: new Button({
					text: "Ok",
					press: function (data) {
						if(!texto2){
							sap.m.MessageBox.error("É necessário informar o motivo do cancelamento");
							return;
						}
						
						oParameters = {};
						oParameters.Fikrs = table.getContextByIndex([selecionados[0]]).getObject().Fikrs;
						oParameters.Belnr = table.getContextByIndex([selecionados[0]]).getObject().Belnr;
						oParameters.Bukrs = table.getContextByIndex([selecionados[0]]).getObject().Bukrs;
						oParameters.Gjahr = table.getContextByIndex([selecionados[0]]).getObject().Gjahr;
						oParameters.Buzei = table.getContextByIndex([selecionados[0]]).getObject().Buzei;
						oParameters.Kunnr = table.getContextByIndex([selecionados[0]]).getObject().Kunnr;
						oParameters.Comentario = texto2;
						texto2 = "";
						oParameters.Knkli = table.getContextByIndex([selecionados[0]]).getObject().Knkli;
						oParameters.DtProm = table.getContextByIndex([selecionados[0]]).getObject().DtProm;
						oParameters.DtCriReg = table.getContextByIndex([selecionados[0]]).getObject().DtCriReg;
						oParameters.HrCriReg = table.getContextByIndex([selecionados[0]]).getObject().HrCriReg;
						oParameters.Acao = 'C';
						oModel.update("/ZET_VCFI_PROMESSASet(Fikrs='"+ oParameters.Fikrs +"',Belnr='"+ oParameters.Belnr +"',Bukrs='"+ oParameters.Bukrs +"',Gjahr='"+ oParameters.Gjahr +"',Buzei='"+ oParameters.Buzei +"',DtCriReg='"+ "1" +"',HrCriReg='"+ "1" +"')", oParameters, {
							success: function (oData, oResponse) {
								// var hdrMessage = oResponse.headers["sap-message"];
								// var hdrMessageObject = JSON.parse(hdrMessage);
								// sap.m.MessageBox.warning(hdrMessageObject.message);
								//oListBinding.refresh(true);
								if (!sTexto) {
									sTexto = "Cancelamento efetuado";
									//smartTable.rebindTable("e");
									//este.getView().getModel().refresh();

									MessageBox.show(sTexto);
									smartTable.rebindTable("e");
									
								}
							},
							error: function (oError) {
								if (!sTexto) {
									for (var i = 0; i < JSON.parse(oError.responseText).error.innererror.errordetails.length; i++) {
										var message = "- " + JSON.parse(oError.responseText).error.innererror.errordetails[i].message + "\n";
										sTexto = sTexto + message;
									}
									sap.m.MessageBox.error(sTexto);
								}
								//sap.m.MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
							}
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
			
			
			
		},
		
		formatStateEStatus: function (oValue) {
			if (oValue === "01") {
				return "Information";
			} else if (oValue === "02") {
				return "Error";
			} else if (oValue === "03") {
				return "Success";
			} else if (oValue === "04") {
				return "Warning";
			} 
			return "None";
		},
		
		Edicao: function (oEvent) {
			var selecionados = this.getView().byId("table2").getSelectedIndices();
			var table = this.getView().byId("table2");
			
			var este = this;
			var oModel = this.getView().getModel();
			oModel.setUseBatch(true);
			var oParameters = {};
			var sTexto;

			var smartTable = this.getView().byId("IdProm");

			if (selecionados.length < 1) {
				sap.m.MessageBox.error("Nenhum item selecionado");
				return;
			}

			if (selecionados.length > 1) {
				sap.m.MessageBox.error("Selecionar apenas um item");
				return;
			}
			
			var stprom = table.getContextByIndex([selecionados[0]]).getObject().StProm;
			
			if (stprom !== '01'){
				sap.m.MessageBox.error("É possível editar apenas items com status '01'");
				return;
			}
			
			var texto = "Confirma a alteração do item selecionado?";
			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: texto
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {

						oParameters = {};
						oParameters.Fikrs = table.getContextByIndex([selecionados[0]]).getObject().Fikrs;
						oParameters.Belnr = table.getContextByIndex([selecionados[0]]).getObject().Belnr;
						oParameters.Bukrs = table.getContextByIndex([selecionados[0]]).getObject().Bukrs;
						oParameters.Gjahr = table.getContextByIndex([selecionados[0]]).getObject().Gjahr;
						oParameters.Buzei = table.getContextByIndex([selecionados[0]]).getObject().Buzei;
						oParameters.Kunnr = table.getContextByIndex([selecionados[0]]).getObject().Kunnr;
						oParameters.Knkli = table.getContextByIndex([selecionados[0]]).getObject().Knkli;
						oParameters.Comentario = table.getContextByIndex([selecionados[0]]).getObject().Comentario;
						oParameters.DtProm = table.getContextByIndex([selecionados[0]]).getObject().DtProm;
						oParameters.DtCriReg = table.getContextByIndex([selecionados[0]]).getObject().DtCriReg;
						oParameters.HrCriReg = table.getContextByIndex([selecionados[0]]).getObject().HrCriReg;
						oParameters.Acao = 'E';
						oModel.update("/" + "ZET_VCFI_PROMESSASet(Fikrs='"+ oParameters.Fikrs +"',Belnr='"+ oParameters.Belnr +"',Bukrs='"+ oParameters.Bukrs +"',Gjahr='"+ oParameters.Gjahr +"',Buzei='"+ oParameters.Buzei +"',DtCriReg='"+ "1" +"',HrCriReg='"+ "1" +"')", oParameters, {
							success: function (oData, oResponse) {
								// var hdrMessage = oResponse.headers["sap-message"];
								// var hdrMessageObject = JSON.parse(hdrMessage);
								// sap.m.MessageBox.warning(hdrMessageObject.message);
								//oListBinding.refresh(true);
								if (!sTexto) {
									sTexto = "Alteração efetuada";
									//smartTable.rebindTable("e");
									//este.getView().getModel().refresh();

									MessageBox.show(sTexto);
									smartTable.rebindTable("e");
									
								}
							},
							error: function (oError) {
								if (!sTexto) {
									for (var i = 0; i < JSON.parse(oError.responseText).error.innererror.errordetails.length; i++) {
										var message =  JSON.parse(oError.responseText).error.innererror.errordetails[i].message ;
										sTexto =  message;
									}
									sap.m.MessageBox.error(sTexto);
								}
								//sap.m.MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
							}
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
			
			
			
		},

		BeforeTable: function (oEvent) {

			
			oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
                    path: "Fikrs",
                    operator: "EQ",
                    value1: Fikrs
                }));
                
                oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
                    path: "Kunnr",
                    operator: "EQ",
                    value1: Kunnr
                }));
                
                oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
                    path: "Knkli",
                    operator: "EQ",
                    value1: Knkli
                }));
                
                oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
                    path: "NivelDet",
                    operator: "EQ",
                    value1: NivelDet
                }));
                
     		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView: function (sObjectPath) {
			var oViewModel = this.getModel("PromessasView"),
				oDataModel = this.getModel();

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
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function () {
			var oView = this.getView(),
				oViewModel = this.getModel("PromessasView"),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.Belnr,
				sObjectName = oObject.Cliente;

			oViewModel.setProperty("/busy", false);
			// Add the object page to the flp routing history
			this.addHistoryEntry({
				title: this.getResourceBundle().getText("objectTitle") + " - " + sObjectName,
				icon: "sap-icon://enter-more",
				intent: "#Y5VC_PAINEL_NE2-display&/ZET_VCFI_HIST_NEGSet/" + sObjectId
			});

			oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("saveAsTileTitle", [sObjectName]));
			oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf Y5VC_PAINEL_NE2.Y5VC_PAINEL_NE2.view.Items
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf Y5VC_PAINEL_NE2.Y5VC_PAINEL_NE2.view.Items
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf Y5VC_PAINEL_NE2.Y5VC_PAINEL_NE2.view.Items
		 */
		//	onExit: function() {
		//
		//	}

	});

});