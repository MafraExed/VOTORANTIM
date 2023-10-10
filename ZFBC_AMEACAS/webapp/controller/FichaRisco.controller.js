/*global location*/
sap.ui.define([
	"fibria/com/ZFBC_AMEACAS/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"fibria/com/ZFBC_AMEACAS/model/formatter"
], function(
	BaseController,
	JSONModel,
	History,
	formatter
) {
	"use strict";

	return BaseController.extend("fibria.com.ZFBC_AMEACAS.controller.FichaRisco", {
		formatter: formatter,

		onInit: function() {
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});

			this.getRouter().getRoute("fichaRisco").attachPatternMatched(this._onObjectMatched, this);

			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function() {
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});

			var heatmapModel = new JSONModel({
				"matrizimpactoameaca": [{
					"Probabilidade": "Remota",
					"Impacto": "Menor",
					"Cor": "1"
				}, {
					"Probabilidade": "Remota",
					"Impacto": "Moderado",
					"Cor": "1"
				}, {
					"Probabilidade": "Remota",
					"Impacto": "Maior",
					"Cor": "2"
				}, {
					"Probabilidade": "Remota",
					"Impacto": "Extremo",
					"Cor": "3"
				}, {
					"Probabilidade": "Possível",
					"Impacto": "Menor",
					"Cor": "1"
				}, {
					"Probabilidade": "Possível",
					"Impacto": "Moderado",
					"Cor": "2"
				}, {
					"Probabilidade": "Possível",
					"Impacto": "Maior",
					"Cor": "3"
				}, {
					"Probabilidade": "Possível",
					"Impacto": "Extremo",
					"Cor": "4"
				}, {
					"Probabilidade": "Provável",
					"Impacto": "Menor",
					"Cor": "2"
				}, {
					"Probabilidade": "Provável",
					"Impacto": "Moderado",
					"Cor": "3"
				}, {
					"Probabilidade": "Provável",
					"Impacto": "Maior",
					"Cor": "4"
				}, {
					"Probabilidade": "Provável",
					"Impacto": "Extremo",
					"Cor": "5"
				}, {
					"Probabilidade": "Muito Provável",
					"Impacto": "Menor",
					"Cor": "3"
				}, {
					"Probabilidade": "Muito Provável",
					"Impacto": "Moderado",
					"Cor": "4"
				}, {
					"Probabilidade": "Muito Provável",
					"Impacto": "Maior",
					"Cor": "5"
				}, {
					"Probabilidade": "Muito Provável",
					"Impacto": "Extremo",
					"Cor": "5"
				}],
				"matrizimpactooportunidade": [{
					"Probabilidade": "Remota",
					"Impacto": "Extremo",
					"Cor": "3"
				}, {
					"Probabilidade": "Remota",
					"Impacto": "Maior",
					"Cor": "2"
				}, {
					"Probabilidade": "Remota",
					"Impacto": "Moderado",
					"Cor": "1"
				}, {
					"Probabilidade": "Remota",
					"Impacto": "Menor",
					"Cor": "1"
				}, {
					"Probabilidade": "Possível",
					"Impacto": "Extremo",
					"Cor": "4"
				}, {
					"Probabilidade": "Possível",
					"Impacto": "Maior",
					"Cor": "3"
				}, {
					"Probabilidade": "Possível",
					"Impacto": "Moderado",
					"Cor": "2"
				}, {
					"Probabilidade": "Possível",
					"Impacto": "Menor",
					"Cor": "1"
				}, {
					"Probabilidade": "Provável",
					"Impacto": "Extremo",
					"Cor": "5"
				}, {
					"Probabilidade": "Provável",
					"Impacto": "Maior",
					"Cor": "4"
				}, {
					"Probabilidade": "Provável",
					"Impacto": "Moderado",
					"Cor": "3"
				}, {
					"Probabilidade": "Provável",
					"Impacto": "Menor",
					"Cor": "2"
				}, {
					"Probabilidade": "Muito Provável",
					"Impacto": "Extremo",
					"Cor": "5"
				}, {
					"Probabilidade": "Muito Provável",
					"Impacto": "Maior",
					"Cor": "5"
				}, {
					"Probabilidade": "Muito Provável",
					"Impacto": "Moderado",
					"Cor": "4"
				}, {
					"Probabilidade": "Muito Provável",
					"Impacto": "Menor",
					"Cor": "3"
				}]
			});
			this.setModel(heatmapModel, "heatmapModel");

			var oVizFrame = this.oVizFrame = this.getView().byId("vzfMatrizImpacto");
			oVizFrame.setModel(heatmapModel);
			oVizFrame.setVizProperties({
				plotArea: {
					background: {
						border: {
							top: {
								visible: false
							},
							bottom: {
								visible: false
							},
							left: {
								visible: false
							},
							right: {
								visible: false
							}
						}
					}
				},
				legend: {
					visible: false
				},
				title: {
					visible: false
				}
			});

			oVizFrame.setVizScales([{
				"feed": "color",
				"type": "color",
				"numOfSegments": 5,
				"palette": [
					"#92D050",
					"#00B050",
					"#FFFF00",
					"#DE8703",
					"#FF0000"
				]
			}]);

			var oTable = this.byId("tblRiscoMedida");
			oTable.onAfterRendering = function() {
		        if (sap.m.Table.onAfterRendering) {
		            sap.m.Table.onAfterRendering.apply(this, arguments);
		        }
		        var cols = this.getColumns();
		
		        for (var i = 0; i < cols.length; i++) {
                    var th = this.$().find('th');
                    th.addClass('columnStyleGray');
		        }
		        
		        var countRiscoMedida = this.getItems().length;
				
				if (countRiscoMedida === 2) {
					oViewModel.setProperty("/SizeRiscoMedida", "96px");
				}
				else if (countRiscoMedida > 2) {
					oViewModel.setProperty("/SizeRiscoMedida", "129px");
				}
				else {
					oViewModel.setProperty("/SizeRiscoMedida", "64px");
				}
				/*
				var sizeRiscoMedida = 47 + (countRiscoMedida*33) + "px";
				oViewModel.setProperty("/SizeRiscoMedida", sizeRiscoMedida);
				*/
		    };
		},
		
		onAfterRendering: function() {
			this.getView().$().find('th').each(function(i, o) {
				$(o).addClass('columnStyleGreen');
			});
			
			var path = $.sap.getModulePath("fibria.com.ZFBC_AMEACAS", "/image/AnaliseRisco.png");
			this.getView().byId("imgAnaliseRisco").setSrc(path);
			
			path = $.sap.getModulePath("fibria.com.ZFBC_AMEACAS", "/image/EsferaImpacto.png");
			this.getView().byId("imgEsferaImpacto").setSrc(path);
		
			//this.onClickVizFrame();
		},
		
		onClickVizFrame: function(oEvent) {
			var val_probabilidade = "", 
				val_impacto = "", 
				val_cor = null,
				action = {
					clearSelection: true
				};
					
			//jQuery.sap.delayedCall(1200, this, function() {
			val_probabilidade = this.getView().byId("txtProbabilidadeValor").getText();	
			if (val_probabilidade === "Muito provável")
				val_probabilidade = "Muito Provável";
			val_impacto = this.getView().byId("txtNivelImpactoValor").getText();

			if(val_probabilidade === "" || val_impacto === "" || val_probabilidade === "N/A" || val_impacto === "N/A")
				this.getView().byId("vzfMatrizImpacto").vizSelection("", action);
			else if((val_probabilidade === "" && val_impacto === "") || (val_probabilidade === "N/A" && val_impacto === "N/A"))
				this.getView().byId("vzfMatrizImpacto").vizSelection("", action);
			else{
				for(var i = 0; i < this.getModel("heatmapModel").getData().matrizimpactoameaca.length; i++){
					if(this.getModel("heatmapModel").getData().matrizimpactoameaca[i].Probabilidade.toUpperCase() === val_probabilidade.toUpperCase() && this.getModel("heatmapModel").getData().matrizimpactoameaca[i].Impacto.toUpperCase() === val_impacto.toUpperCase())
						val_cor = parseInt(this.getModel("heatmapModel").getData().matrizimpactoameaca[i].Cor);
				}
				//jQuery.sap.delayedCall(100, this, function() {
				var point = [{
					data : {
						"Probabilidade": val_probabilidade,
						"Impacto": val_impacto,
						"Cor": val_cor
					}
				}];
				this.getView().byId("vzfMatrizImpacto").vizSelection(point, action);
				//});
			}
			//});
		},
		
		onShareInJamPress: function() {
			var oViewModel = this.getModel("objectView"),
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

		_onObjectMatched: function(oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId,
				sObjectType = oEvent.getParameter("arguments").objectType,
				oViewModel = this.getModel("objectView"),
				oTable,
				oBinding;
			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("RiscoDetalhes", {
					Objid: sObjectId,
					Otype: sObjectType
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));

			this._mFilters = {
				"Objid": [
					new sap.ui.model.Filter("Objid", "EQ", sObjectId),
					new sap.ui.model.Filter("Otype", "EQ", sObjectType)
				]
			};

			oTable = this.byId("tblRiscoDonosCells");
			oBinding = oTable.getBinding("items");
			oBinding.filter(this._mFilters.Objid);

			oTable = this.byId("tblRiscoImpactosCatg");
			oBinding = oTable.getBinding("items");
			oBinding.filter(this._mFilters.Objid);

			oTable = this.byId("tblRiscoImpactosLevel");
			oBinding = oTable.getBinding("items");
			oBinding.filter(this._mFilters.Objid);
			
			oTable = this.byId("tblRiscoMedida");
			oBinding = oTable.getBinding("items");
			oBinding.filter(this._mFilters.Objid);
		},

		_bindView: function(sObjectPath) {
			var oViewModel = this.getModel("objectView"),
				oDataModel = this.getModel();

			this.getView().bindElement({
				path: sObjectPath,

				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oDataModel.metadataLoaded().then(function() {
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function() {
			var oView = this.getView(),
				oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding();

			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.Objid,
				sObjectName = oObject.Stext;

			oViewModel.setProperty("/busy", false);
			oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("saveAsTileTitle", [sObjectName]));
			oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
				
			this.onClickVizFrame();
		},
		
		formatterDate: function(date) {
			if (date && date !== null && date !== "") {
				var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000,
					oDateFormat = sap.ui.core.format.DateFormat.getInstance({
						pattern: "dd/MM/yyyy"
					});
				return oDateFormat.format(new Date(date.getTime() + TZOffsetMs));
			} else {
				return "";
			}
		},
		
		validateSeguravelCobertura: function(param) {
			if (param && param !== null && param !== "") {
				if (param === "Eficaz" || param === "Parcialmente Eficaz") {
					return "Sim";
				} else if (param === "Ineficaz") {
					return "Não";
				}
			} else {
				return "";
			}
		}
	});
});