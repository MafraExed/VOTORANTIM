/*global location*/
sap.ui.define([
	"fibria/com/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"fibria/com/model/formatter",
	"sap/m/MessageBox"
], function(
	BaseController,
	JSONModel,
	History,
	formatter,
	MessageBox
) {
	"use strict";

	return BaseController.extend("fibria.com.controller.Object", {
		formatter: formatter,
		// _onButtonObjectPrint: function(oEvent) {
		// 	if (!this._oDialog) {
		// 		this._oDialog = sap.ui.xmlfragment("fibria.com.fragment.ObjPrint", this);
		// 		this.getView().addDependent(this._oDialog);
				
		// 		this._mFilters = {
		// 		    "Objid": [
		// 		        new sap.ui.model.Filter("Objid", "EQ", this.getModel("sObjectId")),
		// 		        new sap.ui.model.Filter("Otype", "EQ", "OF")
		// 		    ]
		// 		};
				
		// 		var oTable = sap.ui.getCore().byId("tblRiscoDonosCells");
		// 		var oBinding = oTable.getBinding("items");
		// 		oBinding.filter(this._mFilters.Objid);
				
		// 		oTable = sap.ui.getCore().byId("tblRiscoImpactosCatg");
		// 		oBinding = oTable.getBinding("items");
		// 		oBinding.filter(this._mFilters.Objid);
				
		// 		oTable = sap.ui.getCore().byId("tblRiscoImpactosLevel");
		// 		oBinding = oTable.getBinding("items");
		// 		oBinding.filter(this._mFilters.Objid);
				
		// 		oTable = sap.ui.getCore().byId("tblRiscoMedida");
		// 		oBinding = oTable.getBinding("items");
		// 		oBinding.filter(this._mFilters.Objid);
				
		// 		var oVizFrame = sap.ui.getCore().byId("vzfMatrizImpacto");
		// 		oVizFrame.setModel(this.getModel("heatmapModel"));
		// 		oVizFrame.setVizProperties({
		// 		    plotArea: {
		// 		        background: {
		// 		            border: {
		// 		                top: {
		// 		                    visible: false
		// 		                },
		// 		                bottom: {
		// 		                    visible: false
		// 		                },
		// 		                left: {
		// 		                    visible: false
		// 		                },
		// 		                right: {
		// 		                    visible: false
		// 		                }
		// 		            }
		// 		        }
		// 		    },
		// 		    legend: {
		// 		        visible: false
		// 		    },
		// 		    title: {
		// 		        visible: false
		// 		    }
		// 		});
				
		// 		oVizFrame.setVizScales([{
		// 		    "feed": "color",
		// 		    "type": "color",
		// 		    "numOfSegments": 5,
		// 		    "palette": [
		// 		        "#92D050",
		// 		        "#00B050",
		// 		        "#FFFF00",
		// 		        "#DE8703",
		// 		        "#FF0000"
		// 		    ]
		// 		}]);
				
		// 		this.onClickVizFrame("", "ObjPrint");	 
		
		// 		if(sap.ui.getCore().byId("txtProbabilidadeValor").getText() == "Muito provável"){
		// 			sap.ui.getCore().byId("txtProbabilidadeValor").setText("Muito Prov.");
		// 		}
		// 	}
			
		// 	// toggle compact style
		// 	jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
		// 	this._oDialog.open();
			
		// 	sap.ui.getCore().byId("ObjPrint").$().find('th').each(function(i, o) {
		// 		$(o).addClass('columnStyleGreen');
		// 	});
			
		// 	var path = $.sap.getModulePath("fibria.com", "/image/AnaliseRisco.png");
		// 	sap.ui.getCore().byId("imgAnaliseRisco").setSrc(path);
			
		// 	path = $.sap.getModulePath("fibria.com", "/image/EsferaImpacto.png");
		// 	sap.ui.getCore().byId("imgEsferaImpacto").setSrc(path);
			
		// 	var iOriginalBusyDelay,
		// 		oViewModel = new JSONModel({
		// 			busy: true,
		// 			delay: 0
		// 		});
			
		// 	iOriginalBusyDelay = sap.ui.getCore().byId("ObjPrint").getBusyIndicatorDelay();
		// 	sap.ui.getCore().setModel(oViewModel, "objectView");
		// 	sap.ui.getCore().byId("ObjPrint").getModel().metadataLoaded().then(function() {
		// 		oViewModel.setProperty("/delay", iOriginalBusyDelay);
		// 	});
			
		// 	var oTable = sap.ui.getCore().byId("tblRiscoMedida");
		// 	oTable.onAfterRendering = function() {
		// 		if (sap.m.Table.onAfterRendering) {
		// 			sap.m.Table.onAfterRendering.apply(sap.ui.getCore().byId("tblRiscoMedida"), arguments);
		// 		}
		// 		var cols = sap.ui.getCore().byId("tblRiscoMedida").getColumns();
			
		// 		for (var i = 0; i < cols.length; i++) {
		// 			var th = sap.ui.getCore().byId("tblRiscoMedida").$().find('th');
		// 			th.addClass('columnStyleGray');
		// 		}
				
		// 		var countRiscoMedida = sap.ui.getCore().byId("tblRiscoMedida").getItems().length;
				
		// 		if (countRiscoMedida === 2) {
		// 			oViewModel.setProperty("/SizeRiscoMedida", "96px");
		// 		}
		// 		else if (countRiscoMedida > 2) {
		// 			oViewModel.setProperty("/SizeRiscoMedida", "129px");
		// 		}
		// 		else {
		// 			oViewModel.setProperty("/SizeRiscoMedida", "64px");
		// 		}
		// 	};
		// },
		

		onPrintObject: function(oEvent) {
			// var isFirefox = typeof InstallTrigger !== 'undefined';
			// var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
			// var isIE = false || !!document.documentMode;
			// var isEdge = !isIE && !!window.StyleMedia;
			// var isChrome = !!window.chrome && !!window.chrome.webstore;

			var oTarget = this.getView().byId(oEvent.getSource().data("targetId"));
			var $domTarget = oTarget.$()[0];
			var sTargetContent = $domTarget.innerHTML;
			var sOriginalContent = document.body.innerHTML;
			
			var arq_css = $.sap.getModulePath("fibria.com", "/css/style.css");
			this.getView().byId("pageObject").oParent.getContent()[0].$().printThis({
				debug: false,                     // show the iframe for debugging
				importCSS: true,                  // import parent page css
				importStyle: true,                // import style tags
				printContainer: true,             // grab outer container as well as the contents of the selector
				loadCSS: arq_css,                 // path to additional css file - use an array [] for multiple
				pageTitle: "",  				  // add title to print page
				removeInline: false,              // remove all inline styles from print elements
				removeInlineSelector: "body *",   // custom selectors to filter inline styles. removeInline must be true
				printDelay: 1000,                 // variable print delay
				header: null,                     // prefix to html
				footer: null,                     // postfix to html
				base: false,                      // preserve the BASE tag, or accept a string for the URL
				formValues: false,                // preserve input/form values
				canvas: true,                     // copy canvas elements
				// doctypeString: sTargetContent,    // enter a different doctype for older markup
				doctypeString: '<!doctype html>', // enter a different doctype for older markup
				removeScripts: true,              // remove script tags from print content
				copyTagClasses: true,             // copy classes from the html & body tag
				beforePrintEvent: null,           // callback function for printEvent in iframe
				beforePrint: null,                // function called before iframe is filled
				afterPrint: null                  // function called before iframe is removed
			});
		},

		onInit: function() {
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

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
					oViewModel.setProperty("/SizeRiscoMedida", "97px");
				}
				else if (countRiscoMedida > 2) {
					oViewModel.setProperty("/SizeRiscoMedida", "130px");
				}
				else {
					oViewModel.setProperty("/SizeRiscoMedida", "65px");
				}
		    };
		    
		    
			var oTablePrint = this.byId("tblRiscoMedidaPrint");
			oTablePrint.onAfterRendering = function() {
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
					this.$().addClass('marginP1 example-screen11 example-screen2');
				}
				else if (countRiscoMedida > 2) {
					this.$().addClass('marginP2 example-screen11 example-screen2');
				}
				else {
					this.$().addClass('marginP3 example-screen11 example-screen2');
				}
		    };
		},
		
		onAfterRendering: function() {
			this.getView().$().find('th').each(function(i, o) {
				$(o).addClass('columnStyleGreen');
			});
			//this.getView().$().find("lblComentarios1a").parent().addClass("columnStyleGreen");

			var path = $.sap.getModulePath("fibria.com", "/image/AnaliseRisco.png");
			this.getView().byId("imgAnaliseRisco").setSrc(path);
			
			path = $.sap.getModulePath("fibria.com", "/image/EsferaImpacto.png");
			this.getView().byId("imgEsferaImpacto").setSrc(path);
		},
		
		onClickVizFrame: function(oEvent) {
			var val_probabilidade = this.getView().byId("txtProbabilidadeValor").getText(), 
				val_impacto = this.getView().byId("txtNivelImpactoValor").getText(), 
				val_cor = null,
				action = {
					clearSelection: true
				};
				
			jQuery.sap.delayedCall(500, this, function() {
				if (val_probabilidade === "Muito provável"){
					val_probabilidade = "Muito Provável";
				}
	
				if(val_probabilidade === "" || val_impacto === "" || val_probabilidade === "N/A" || val_impacto === "N/A")
					this.getView().byId("vzfMatrizImpacto").vizSelection("", action);
				if((val_probabilidade === "" && val_impacto === "") || (val_probabilidade === "N/A" && val_impacto === "N/A"))
					this.getView().byId("vzfMatrizImpacto").vizSelection("", action);
				else{

					for(var i = 0; i < this.getModel("heatmapModel").getData().matrizimpactoameaca.length; i++){
						if(this.getModel("heatmapModel").getData().matrizimpactoameaca[i].Probabilidade.toUpperCase() === val_probabilidade.toUpperCase() && this.getModel("heatmapModel").getData().matrizimpactoameaca[i].Impacto.toUpperCase() === val_impacto.toUpperCase())
							val_cor = parseInt(this.getModel("heatmapModel").getData().matrizimpactoameaca[i].Cor);
					}
					jQuery.sap.delayedCall(100, this, function() {
						var point = [{
							data : {
								"Probabilidade": val_probabilidade,
								"Impacto": val_impacto,
								"Cor": val_cor
							}
						}];
						this.getView().byId("vzfMatrizImpacto").vizSelection(point, action);
					});
				}
			});
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
			
			this.setModel(sObjectId, "sObjectId");
            this.setModel(sObjectType, "sObjectType");
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
			
			oTable = this.byId("tblRiscoMedidaPrint");
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