/*global location */
sap.ui.define([
		"br/com/suzano/ZUI5VP_SHIP_SOF/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"br/com/suzano/ZUI5VP_SHIP_SOF/model/formatter",
		"br/com/suzano/ZUI5VP_SHIP_SOF/webServices/apiConnector",
		"sap/m/UploadCollectionParameter",
		"sap/ui/Device",
		"sap/ui/export/Spreadsheet"
	], function (BaseController, JSONModel, formatter, apiConnector, UploadCollectionParameter, Device, Spreadsheet) {
		"use strict";

		return BaseController.extend("br.com.suzano.ZUI5VP_SHIP_SOF.controller.Detail", {

			formatter: formatter,
			//oPieChartMateriais: null,

			onInit : function () {
				// Model used to manipulate control states. The chosen values make sure,
				// detail page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				var oViewModel = new JSONModel({
					busy : false,
					delay : 0,
					uploadEnabled: true,
					isPhone: Device.system.phone,
					TracePerUnit: true,
					TracePerMaterial: false,
					TracePer: "UnitsEmbarcadas"
				});

				sap.ui.getCore().setModel(this.getView(), "controllerViewDetail");
				this.setModel(oViewModel, "detailView");

				this.oRouter = this.getOwnerComponent().getRouter();
				this.oModel = this.getOwnerComponent().getModel();

				this.oRouter.getRoute("master").attachPatternMatched(this._onBoardMatched, this);
				this.oRouter.getRoute("object").attachPatternMatched(this._onBoardMatched, this);

			},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

			/**
			 * Event handler when the share by E-Mail button has been clicked
			 * @public
			 */
			onShareEmailPress : function () {
				var oViewModel = this.getModel("detailView");

				sap.m.URLHelper.triggerEmail(
					null,
					oViewModel.getProperty("/shareSendEmailSubject"),
					oViewModel.getProperty("/shareSendEmailMessage")
				);
			},

			/**
			 * Event handler when the share in JAM button has been clicked
			 * @public
			 */
			onShareInJamPress : function () {
				var oViewModel = this.getModel("detailView"),
					oShareDialog = sap.ui.getCore().createComponent({
						name : "sap.collaboration.components.fiori.sharing.dialog",
						settings : {
							object :{
								id : location.href,
								share : oViewModel.getProperty("/shareOnJamTitle")
							}
						}
					});

				oShareDialog.open();
			},
			/* =========================================================== */
			/* begin: internal methods                                     */
			/* =========================================================== */

			/**
			 * Binds the view to the object path. Makes sure that detail view displays
			 * a busy indicator while data for the corresponding element binding is loaded.
			 * @function
			 * @param {string} sObjectPath path to the object to be bound to the view.
			 * @private
			 */
			_bindView : function (sObjectPath) {
				// Set busy indicator during view binding
				var controller = sap.ui.getCore().getModel("controllerViewDetail").getController();
				var oViewModel = sap.ui.getCore().getModel();
//				var oViewModelSet = controller.getModel("detailView");

				if (sap.ui.Device.system.phone === true) {
				//	controller.byId("StartOperatio").setTitle(controller.oResourceModel._oResourceBundle.getText("poraoStartOperation2"));
				//	controller.byId("EtimatedTime").setTitle(controller.oResourceModel._oResourceBundle.getText("Estimated2"));
				}
				
				if (oViewModel !== undefined) {
					if (oViewModel.getData().Changed) {
						controller._onBindingChange();
					}
				} else {
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("master", {}, true);
				}
			},

			_onBindingChange : function () {
				var me = sap.ui.getCore().getModel("controllerViewDetail").getController(),
					oViewModel = sap.ui.getCore().getModel(),
					oViewModelSet = me.getModel("detailView"),
					oResourceBundle = me.getResourceBundle(),
					sViagemId = oViewModel.getData().ViagemArm,
					sVesselName = oViewModel.getData().NomeNavio,
					sDocTransporte = oViewModel.getData().DocTransporte,
					iPrancha = oViewModel.getData().Prancha,
					iPranchaReal = oViewModel.getData().PranchaReal;

				// Control state model
				var comparisionChart = this.getView().byId("ComparisonMicroChart");
				comparisionChart.destroyData();

				oViewModel.getData().Changed = false;
				me.setModel(oViewModel);
				me.getView().byId("PranchaValueChange").setValue(iPrancha);

				oViewModelSet.setProperty("/saveAsTileTitle",oResourceBundle.getText("shareSaveTileAppTitle", [sVesselName]));
				oViewModelSet.setProperty("/saveAsTileSubTitle",oResourceBundle.getText("shareSaveTileAppSubTitle", [sViagemId, sDocTransporte]));
				oViewModelSet.setProperty("/saveAsTileNumber", oViewModel.getData().VolEmbarcado);

				oViewModelSet.setProperty("/shareOnJamTitle", sVesselName);
				oViewModelSet.setProperty("/shareSendEmailSubject",
					oResourceBundle.getText("shareSendEmailObjectSubject", [sVesselName, sViagemId]));
				oViewModelSet.setProperty("/shareSendEmailMessage",
					oResourceBundle.getText("shareSendEmailObjectMessage", [sVesselName, sViagemId, sDocTransporte/*, location.href*/]));

				oViewModelSet.setProperty("/QtdNoTraceability", oViewModel.getData().QtdNoTraceability);
				oViewModelSet.setProperty("/ColorTraceability", oViewModel.getData().ColorTraceability);

				me.getView().byId("MessageStrip").setVisible(true);

				if(oViewModel.getData().PercConcluido === 0) {
					oViewModelSet.setProperty("/TypeMsgStrip", "Information");
					oViewModelSet.setProperty("/MessageStrip", oResourceBundle.getText("MessageStripInfoNotStarted"));
					me.getPosts();
					
					var oModel = new JSONModel(),
						aBlank = [];
					oModel.setData(aBlank);
					me.getView().setModel(oModel, "UnitsEmbarcadas");
					me.getView().setModel(oModel, "ConfigNavio");
					me.getView().setModel(oModel, "MateriaisEmbarcados");

				} else { // Somente busca os detalhes de SOF, ranking de paradas e unidades embarcadas se operação já iniciou
					
					var i18nMessageStrip = "";
					
					if (iPranchaReal < iPrancha) {
						if (oViewModel.getData().StatusEmb !== "3") {
							i18nMessageStrip = "MessageStripErrorOpen";
						} else {
							i18nMessageStrip = "MessageStripErrorClose";
						}
						oViewModelSet.setProperty("/TypeMsgStrip", "Error");
					} else if (oViewModel.getData().StatusEmb === "3") {
						i18nMessageStrip = "MessageStripSuccessClose";
						oViewModelSet.setProperty("/TypeMsgStrip", "Success");
					} else {
						var iPerc = Math.round((iPranchaReal / iPrancha) * 100) - 100;
						if (iPerc < 10) { // Indica que a produtividade está próxima de ficar abaixo do previsto, tolerância de 10% 
							i18nMessageStrip = "MessageStripWarning";
							oViewModelSet.setProperty("/TypeMsgStrip", "Warning");
						} else {
							i18nMessageStrip = "MessageStripSuccessOpen";
							oViewModelSet.setProperty("/TypeMsgStrip", "Success");
						}
					}
					oViewModelSet.setProperty("/MessageStrip", oResourceBundle.getText(i18nMessageStrip, [iPranchaReal, iPrancha]));

					var iFilter = [];
					iFilter.push(new sap.ui.model.Filter({
						path: "DocTransporte",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: sDocTransporte
					}));
					iFilter.push(new sap.ui.model.Filter({
						path: "CodigoNavio",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: oViewModel.getData().CodigoNavio
					}));
					iFilter.push(new sap.ui.model.Filter({
						path: "ViagemArm",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: sViagemId
					}));

					var stringParam = "/ZET_VPWM_SOF_DETAILSSet";
	
					// Binding the view will set it to not busy - so the view is always busy if it is not bound
					me.zSetBusyTrue(me);
					var masterController = sap.ui.controller("br.com.suzano.ZUI5VP_SHIP_SOF.controller.Master");
					var oViewMaster = masterController.getView();
					masterController.zSetBusyTrue(oViewMaster);
	
					apiConnector.consumeModel(stringParam, iFilter, {},
						function(oData, oResponse) {
							if (oData.results.length === 0) {
								me.getView().byId("iconSOFDetails").setVisible(false);
							} else {
								me.getView().byId("iconSOFDetails").setVisible(true);
								for(var i = 0; i < oData.results.length; i++) {
									oData.results[i].DatefactFormatted = oData.results[i].Datefact.toLocaleString('en-En',{weekday: "long", month: "long", day: "numeric"});
									oData.results[i].FromTimeFormatted = oData.results[i].FromTime.substr(0,2) + ":" + oData.results[i].FromTime.substr(2,2);
									oData.results[i].ToTimeFormatted = oData.results[i].ToTime.substr(0,2) + ":" + oData.results[i].ToTime.substr(2,2);
								}
							}
							var model = new JSONModel();
							model.setData(oData.results);
							me.getView().setModel(model, "sofList");
							me.zSetBusyFalse(me);
							masterController.zSetBusyFalse(masterController);
							me.getPosts();
						},
						function(err) {
							sap.m.MessageToast.show("Erro Get SOF DB");
							me.zSetBusyFalse(me);
							masterController.zSetBusyFalse(masterController);
						}
					);
	
					stringParam = "/ZET_VPWM_STOP_RANKINGSet";
					apiConnector.consumeModel(stringParam, iFilter, {},
						function(oData, oResponse) {
							var comparisionData = new sap.suite.ui.microchart.ComparisonMicroChartData();
							comparisionChart = me.getView().byId("ComparisonMicroChart");
							for(var i = 0; i < oData.results.length; i++) {
								 comparisionData = new sap.suite.ui.microchart.ComparisonMicroChartData(oData.results[i].CodigoParada, 
									{	color: oData.results[i].Color,
										title: oData.results[i].CodigoParada,
										value: oData.results[i].Value
									});
									
								comparisionChart.addData(comparisionData);
							}
							var model = new JSONModel();
							model.setData(oData.results);
							me.getView().setModel(model, "stopRanking");
						},
						function(err) {
							sap.m.MessageToast.show("Erro Get Ranking");
						}
					);
					
					var ConfigNavio = [],
						UnitsEmbarcadas = [],
						MateriaisEmbarcados = [],
						iIndexCamada = -1,
						iIndexMaterial = -1;

					stringParam = "/ZET_VPWM_UNITS_EMBARCADASSet";
					apiConnector.consumeModel(stringParam, iFilter, {},
						function(oData, oResponse) {
							oData.results.forEach(
								function(currentValue, index, array) {
									if(currentValue.ParentNodeID === 0) {
										currentValue.ParentNodeID = null;
									}
								}, this);
							for (var i = 0; i < oData.results.length; i++) {
								if (me.getView().getModel("detailView").getData().ColorTraceability === "Default") {
									// Nível hirárquico 1 olha ao nível de camada
									if (oData.results[i].HierarchyLevel === 1) {
										for (var j = 0; j < ConfigNavio.length; j ++) {
											if(ConfigNavio[j].Porao === oData.results[i].Porao && 
														ConfigNavio[j].Camada === oData.results[i].Camada) {
															
												iIndexCamada = j;
											}
										}
										if (iIndexCamada < 0) {
											ConfigNavio.push(
												{	Porao: oData.results[i].Porao, 
													Camada: oData.results[i].Camada, 
													Qtd: oData.results[i].QtdLingada,
													Materiais: []
												});
										} else {
											ConfigNavio[iIndexCamada].Qtd = ConfigNavio[iIndexCamada].Qtd + oData.results[i].QtdLingada;
										}
										iIndexCamada = -1;
									}
									// Nível hirárquico 4 olha ao nível de MATERIAL
									if (oData.results[i].HierarchyLevel === 4) {
										
										for (j = 0; j < ConfigNavio.length; j ++) {
											if(ConfigNavio[j].Porao === oData.results[i].Porao && ConfigNavio[j].Camada === oData.results[i].Camada) {
												for (var c = 0; c < ConfigNavio[j].Materiais.length; c ++) {
													if(ConfigNavio[j].Materiais[c].Material === oData.results[i].Material) {
														iIndexMaterial = c;
													}
												}
												iIndexCamada = j;
											}
										}
										if (iIndexCamada >= 0) { // Encontrou registro nem que seja no índice 0
											if(iIndexMaterial < 0){ // Não encontrou registro então deve ser realizado a criação de um novo
												ConfigNavio[iIndexCamada].Materiais.push(
													{	Material: oData.results[i].Material, 
														Produto: oData.results[i].Produto, 
														Qtd: oData.results[i].QtdLingada
													});
											} else {
												ConfigNavio[iIndexCamada].Materiais[iIndexMaterial].Qtd = 
													ConfigNavio[iIndexCamada].Materiais[iIndexMaterial].Qtd + oData.results[i].QtdLingada;
											}
										}
										iIndexCamada = iIndexMaterial = -1;
									}
								}
								if (oData.results[i].HierarchyLevel === 4) { // Faz Append de todos os MATERIAIS
									MateriaisEmbarcados.push(oData.results[i]);
								}
								if (oData.results[i].HierarchyLevel === 5) { // Faz Append de todas as UNITS
									UnitsEmbarcadas.push(oData.results[i]);
								}
							}

							var oUEModel = new JSONModel();
							if(UnitsEmbarcadas.length > 0){
								oUEModel.setData(UnitsEmbarcadas);
							} else {
								oUEModel.setData(oData.results);
							}
							me.getView().setModel(oUEModel, "UnitsEmbarcadas");

							var oCNModel = new JSONModel();
							oCNModel.setData(ConfigNavio);
							me.getView().setModel(oCNModel, "ConfigNavio");
							
							var oMEModel = new JSONModel();
							oMEModel.setData(MateriaisEmbarcados);
							me.getView().setModel(oMEModel, "MateriaisEmbarcados");
							
							me._vizPoroesCamadaHeatmapSet();
						},
						function(err) {
							sap.m.MessageToast.show("Erro Get UnitsEmbarcadas");
						}
					);
				}
			},
			_onMetadataLoaded : function () {
				// Store original busy indicator delay for the detail view
				var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
					oViewModel = this.getModel("detailView");

				// Make sure busy indicator is displayed immediately when
				// detail view is displayed for the first time
				oViewModel.setProperty("/delay", 0);

				// Binding the view will set it to not busy - so the view is always busy if it is not bound
				oViewModel.setProperty("/busy", true);
				// Restore original busy indicator delay for the detail view
				oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
			},

			_onBoardMatched: function (oEvent) {
				this._bindView('/');
			},

			handleFullScreen: function () {
				this.getView().byId("showFullScreen").setVisible(false);
				this.getView().byId("exitFullScreen").setVisible(!Device.system.phone);
				var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
				this.oRouter.navTo("object", {Layout: sNextLayout, DocTransporte: 0}); //sap.ui.getCore().getModel().getData().DocTransporte
			},
			handleExitFullScreen: function () {
				this.getView().byId("showFullScreen").setVisible(!Device.system.phone);
				this.getView().byId("exitFullScreen").setVisible(false);
				var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
				if(sNextLayout) {
					this.oRouter.navTo("object", {Layout: sNextLayout, DocTransporte: 0}); //sap.ui.getCore().getModel().getData().DocTransporte
				}
			},
			handleClose: function (oEvent) {
				this.handleExitFullScreen();
				this.onSaveInfo(oEvent);
				var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
				this.oRouter.navTo("master", {Layout: sNextLayout});
			},
			onPost: function (oEvent) {
				var	me = this;
				me.zSetBusyTrue(me);

				var oObject = sap.ui.getCore().getModel().getData();
				var sValue = oEvent.getParameter("value");
				var oEntry = {
					DocTransporte: oObject.DocTransporte,
					Tipo: "C",
					Msg: sValue
				};

				var stringParam = "/ZET_VPWM_COMMENTSSet";
				apiConnector.createModel(stringParam, oEntry,
					function(oData, oResponse) {
						sap.m.MessageToast.show("Post realizado com sucesso", {
							duration: 3000
						});
						me.getPosts();
						me.zSetBusyFalse(me);
					}, function(err) {
						sap.m.MessageToast.show("Erro na postagem", {
							duration: 3000
						});
						me.getPosts();
						me.zSetBusyFalse(me);
				});
			},

			getPosts: function() {
				var me = this,
					oViewModel = sap.ui.getCore().getModel();
				
				if(!oViewModel) return;
				
				me.zSetBusyTrue(me);
				
				var iFilter = [];
				iFilter.push(new sap.ui.model.Filter({
					path: "DocTransporte",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: oViewModel.getData().DocTransporte
				}));

				var stringParam = "/ZET_VPWM_COMMENTSSet";
				apiConnector.consumeModel(stringParam, iFilter, {},
					function(oData, oResponse) {
						var model = new JSONModel();
						model.setData(oData.results);
						for(var i = 0; i < oData.results.length; i++) {
							oData.results[i].DataPostFormatted = oData.results[i].DataPost.substr(6,2) + "/" + oData.results[i].DataPost.substr(4,2) + "/" + oData.results[i].DataPost.substr(0,4);
							oData.results[i].HoraPostFormatted = oData.results[i].HoraPost.substr(0,2) + ":" + oData.results[i].HoraPost.substr(2,2) + ":" + oData.results[i].HoraPost.substr(4,2);
						}
						me.getView().setModel(model, "boardingFeedback");
						me.getModel("detailView").setProperty("/numeroMsgs", oData.results.length);
						if (oData.results.length === 0) {
							me.getModel("detailView").setProperty("/colorMsg", sap.ui.core.IconColor.Neutral);
						} else {
							me.getModel("detailView").setProperty("/colorMsg", sap.ui.core.IconColor.Default);
						}
						me.zSetBusyFalse(me);
					},
					function(err) {
						me.zSetBusyFalse(me);
						sap.m.MessageToast.show("Erro Get Posts");
					}
				);
			},
			
			onChangeUploadCollection: function(oEvent) {
				var oUploadCollection = oEvent.getSource();
				// Header Token
				var oCustomerHeaderToken = new UploadCollectionParameter({
					name: "x-csrf-token",
					value: "securityTokenFromModel"
				});
				oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
			},

			onUploadComplete: function(oEvent) {
				var oUploadCollection = this.byId("UploadCollection");

				var oUploadItem = new sap.m.UploadCollectionItem({"documentId": jQuery.now().toString(), // generate Id,
					"fileName": oEvent.getParameter("files")[0].fileName,
					"mimeType": "",
					"thumbnailUrl": "",
					"url": "",
					"attributes": [
						{
							"title": "Uploaded By",
							"text": "You",
							"active": false
						},
						{
							"title": "Uploaded On",
							"text": new Date(jQuery.now()).toLocaleDateString(),
							"active": false
						},
						{
							"title": "File Size",
							"text": "505000",
							"active": false
						}
					],
					"statuses": [
						{
							"title": "",
							"text": "",
							"state": "None"
						}
					],
					"markers": [
						{
						}
					],
					"selected": false});
					
				oUploadCollection.addItem(oUploadItem);
				this.getView().getModel().refresh();
	
				// Sets the text to the label
				this.byId("attachmentTitle").setText(this.getAttachmentTitleText());
	
				// delay the success message for to notice onChange message
				//setTimeout(function() {
				//	sap.m.MessageToast.show("UploadComplete event triggered.");
				//}, 4000);
			},

			onBeforeUploadStarts: function(oEvent) {
				// Header Slug
				var oCustomerHeaderSlug = new UploadCollectionParameter({
					name: "slug",
					value: oEvent.getParameter("fileName")
				});
				oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
				sap.m.MessageToast.show("BeforeUploadStarts event triggered.");

				var oFileUploader = sap.ui.getCore().byId("UploadCollection");
				var sUrl = "some URL";
            	oFileUploader.setUploadUrl(sUrl);
            },

			onUploadTerminated: function(oEvent) {
				// get parameter file name
				// var sFileName = oEvent.getParameter("fileName");
				// get a header parameter (in case no parameter specified, the callback function getHeaderParameter returns all request headers)
				// var oRequestHeaders = oEvent.getParameters().getHeaderParameter();
			},

			onFileDeleted: function(oEvent) {
				this.deleteItemById(oEvent.getParameter("documentId"));
				sap.m.MessageToast.show("FileDeleted event triggered.");
			},

			onTypeMissmatch: function() {
				sap.m.MessageToast.show("TypeMissmatch event triggered.");
			},

			getAttachmentTitleText: function() {
				var aItems = this.byId("UploadCollection").getItems();
				return "Uploaded (" + aItems.length + ")";
			},
			onFileSizeExceed: function() {
				sap.m.MessageToast.show("FileSizeExceed event triggered.");
			},
			onFilenameLengthExceed: function() {
				sap.m.MessageToast.show("FilenameLengthExceed event triggered.");
			},

			zSetBusyTrue: function(controller) {
				var model = controller.getModel("detailView");
				model.setProperty("/busy", true);
			},

			zSetBusyFalse: function(controller) {
				var model = controller.getModel("detailView");
				model.setProperty("/busy", false);
			},
			
			onSendMessagePress: function(oEvent){
				var oComments = this.byId("iconTabBar");
        		oComments.setSelectedKey("iconSOFComments");
				sap.m.MessageToast.show("Isso, pode postar mensagens a vontade!");
			},

			onExportExcel: function(oEvent) {
				
				this.zSetBusyTrue(this);
				var aCols, aExportList, oSettings, oSheet, sFilename;
				
				if (oEvent.getSource().getId().toString().indexOf("SOF") > 0) {
					if (this.getView().getModel("sofList")) {

						aCols = this.createColumnConfig("SOF");
						aExportList = this.getView().getModel("sofList").getData();
						
						aExportList.forEach(
							function(currentValue, index, array) {
								currentValue.NomeNavio = sap.ui.getCore().getModel().getData().NomeNavio;
							}, this);
						
						sFilename = "SOF_" + sap.ui.getCore().getModel().getData().NomeNavio + "_" + sap.ui.getCore().getModel().getData().ViagemArm;
					}
				} else if(oEvent.getSource().getId().toString().indexOf("Units") > 0) {
					if (this.getView().getModel("UnitsEmbarcadas")) {

						aCols = this.createColumnConfig("Units");
						aExportList = this.getView().getModel("UnitsEmbarcadas").getData();

						aExportList.forEach(
							function(currentValue, index, array) {
								currentValue.CodigoNavio = sap.ui.getCore().getModel().getData().CodigoNavio;
								currentValue.NomeNavio = sap.ui.getCore().getModel().getData().NomeNavio;
								currentValue.ViagemArm = sap.ui.getCore().getModel().getData().ViagemArm;
							}, this);

						sFilename = "Units_" + sap.ui.getCore().getModel().getData().NomeNavio + "_" + sap.ui.getCore().getModel().getData().ViagemArm;
					}
				}

				if(aExportList.length > 0) {
					oSettings = {
						workbook: {
							columns: aCols
						},
						dataSource: aExportList,
						fileName: sFilename
					};
					oSheet = new Spreadsheet(oSettings);
					oSheet.build()
					    .then( function() {
	  						sap.m.MessageToast.show("Planilha exportada com sucesso");
					    })
					    .catch( function(sMessage) {
	  						sap.m.MessageToast.show("Erro ao exportar: " + sMessage);
					    })
						.finally(function() {
							oSheet.destroy();
						});
				} else {
						sap.m.MessageToast.show("Não há dados para exportar");
				}

				this.zSetBusyFalse(this);
			},

			createColumnConfig: function(sType) {
				if(sType === "SOF") {
					return [
					{
						label: "Código Navio",
						property: "CodigoNavio",
						type: "String"
					},{
						label: "Navio",
						property: "NomeNavio",
						width: "25"
					},{
						label: "Nº Viagem",
						property: "ViagemArm",
						type: "String"
					},{
						label: "Doc. Transporte",
						property: "DocTransporte",
						type: "String"
					},{
						label: "Data",
						property: "DatefactFormatted",
						type: "String"
					}, {
						label: "Gang",
						property: "ItemOc",
						type: "String"
					}, {
						label: "Hold",
						property: "Hold",
						type: "String"
					}, {
						label: "Cód. Material",
						property: "Material",
						type: "String"
					}, {
						label: "Comm",
						property: "Comm",
						type: "String"
					},{
						label: "From Time",
						property: "FromTimeFormatted",
						type: "String"
					}, {
						label: "To Time",
						property: "ToTimeFormatted",
						type: "String"
					},{
						label: "Time",
						property: "Time",
						type: "String"
					},{
						label: "Evento",
						property: "CodigoParada",
						type: "String"
					}, {
						label: "English Descr.",
						property: "DescrEn",
						type: "String"
					},{
						label: "Descr. Português",
						property: "DescrPT",
						type: "String"
					},{
						label: "Tempo Numérico",
						property: "NumTime",
						type: "String"
					}, {
						label: "Volume Embarcado",
						property: "VolEmbarcado",
						type: "String"
					},{
						label: "Unidades Embarcadas",
						property: "UniEmbarcada",
						type: "String"
					},{
						label: "Cod. Porto Destino",
						property: "CodPortDest",
						type: "String"
					},{
						label: "Descr. Porto Destino",
						property: "DescPortDest",
						type: "String"
					},{
						label: "Bigrama",
						property: "Bigrama",
						type: "String"
					},{
						label: "Trigrama",
						property: "Trigrama",
						type: "String"
					},{
						label: "Status",
						property: "Status",
						type: "String"
					}, {
						label: "Situação",
						property: "StatusText",
						type: "String"
					}, {
						label: "Icon",
						property: "Icon",
						type: "String"
					}, {
						label: "Cod. Terminal Origem",
						property: "CodTermOrig",
						type: "String"
					},{
						label: "Descr. Terminal Origem",
						property: "DescTermOrig",
						type: "String"
					},{
						label: "Centro Terminal Origem",
						property: "CentroTermOrig",
						type: "String"
					},{
						label: "Depósito Terminal Origem",
						property: "CodDepositoOrig",
						type: "String"
					},{
						label: "OC",
						property: "Oc",
						type: "String"
					},{
						label: "Item OC",
						property: "ItemOc",
						type: "String"
					}];
				} else if(sType === "Units") {
					return [
					{
						label: "Código Navio",
						property: "CodigoNavio",
						type: "String"
					},{
						label: "Navio",
						property: "NomeNavio",
						width: "25"
					},{
						label: "Nº Viagem",
						property: "ViagemArm",
						type: "String"
					},{
						label: "Doc. Transporte",
						property: "DocTransporte",
						type: "String"
					},{
						label: "OC",
						property: "Oc",
						type: "String"
					},{
						label: "Item OC",
						property: "ItemOc",
						type: "String"
					},{
						label: "RowId",
						property: "RowId",
						type: "String"
					}, {
						label: "Porão",
						property: "Porao",
						type: "String"
					}, {
						label: "Camada",
						property: "Camada",
						type: "String"
					}, {
						label: "Ordenação Viagem",
						property: "Lingada",
						type: "String"
					}, {
						label: "Lingada",
						property: "OrdViagem",
						type: "String"
					},{
						label: "Tipo",
						property: "Tipo",
						type: "String"
					}, {
						label: "Quantidade Lingada",
						property: "QtdLingada",
						type: "String"
					},{
						label: "Unit",
						property: "Unit",
						type: "String"
					},{
						label: "Cód. Material",
						property: "Material",
						type: "String"
					}, {
						label: "Produto",
						property: "Produto",
						type: "String"
					},{
						label: "Data Carregamento",
						property: "DataCarr",
						type: "String"
					},{
						label: "Hora Carregamento",
						property: "HoraCarr",
						type: "String"
					}, {
						label: "Usuário",
						property: "IdUsuario",
						type: "String"
					},{
						label: "Nome Operador",
						property: "NomeOperador",
						type: "String"
					}];
				}

				return null;
			},
			onEditInfo: function(oEvent) {
				this._toggleButtonsAndView(true);
			},
			
			_toggleButtonsAndView : function (bEdit) {
				var oView = this.getView();
	
				// Show the appropriate action buttons and view fields
				oView.byId("infoEditButton").setVisible(!bEdit);
				oView.byId("infoSaveButton").setVisible(bEdit);
				oView.byId("infoCancelButton").setVisible(bEdit);
				oView.byId("PranchaValueView").setVisible(!bEdit);
				oView.byId("PranchaValueChange").setVisible(bEdit);
				
				if (oView.byId("PranchaValueChange").getValue() > 0) {
					oView.byId("PranchaValueChange").setValueState("Success");
				} else {
					oView.byId("PranchaValueChange").setValue();
					oView.byId("PranchaValueChange").setValueState("Error");
				}
			},

			onSaveInfo: function(oEvent) {
				
				var me = this,
					oViewModel = sap.ui.getCore().getModel(),
					stringParam = "/ZET_VPWM_VIAGENSSet" + 
									"(CodigoNavio=" + "'" + oViewModel.getData().CodigoNavio + "'" + 
									",ViagemArm=" + "'" + oViewModel.getData().ViagemArm + "'" +
									",DocTransporte=" + "'" + oViewModel.getData().DocTransporte + "')";

				if(oEvent.getSource().getProperty("type") === "Accept") {
					me.zSetBusyTrue(me);
					var oEntry = {};
					oEntry.CodigoNavio = oViewModel.getData().CodigoNavio;
					oEntry.ViagemArm = oViewModel.getData().ViagemArm;
					oEntry.DocTransporte = oViewModel.getData().DocTransporte;
					oEntry.Prancha = parseInt(me.getView().byId("PranchaValueChange").getValue(), 10);

					//UPDATE
					apiConnector.updateModel(stringParam, oEntry, 
						function(oData, oResponse) {
							if (oResponse.statusCode === 204) {
								sap.m.MessageToast.show("Registro salvo com sucesso");
								me._getNSetPranchaValue(stringParam);
								me._toggleButtonsAndView(false);
								me.zSetBusyFalse(me);
							}
						}, 
						function(err) {
							sap.m.MessageToast.show("Erro ao salvar registro");
							me.zSetBusyFalse(me);
						});
				} else {
					if ((me.getView().byId("PranchaValueChange").getValue() === "") || 
							(parseInt(me.getView().byId("PranchaValueChange").getValue(), 10) <= 0)) {
						sap.m.MessageToast.show(me.getResourceBundle().getText("PranchaNotZero"));
					}
					me._getNSetPranchaValue(stringParam);
					me._toggleButtonsAndView(false);
				}
			},

			handleLiveChange: function(oEvent) {
				if (oEvent.getParameter("value") > 0) {
					oEvent.getSource().setValueState("Success");
					this.getView().byId("infoSaveButton").setEnabled(true);
				} else {
					oEvent.getSource().setValueState("Error");
					this.getView().byId("infoSaveButton").setEnabled(false);
				}
			},
			
			_getNSetPranchaValue: function(sURLParameter) {
				var me = this;
				me.zSetBusyTrue(me);

				apiConnector.consumeModel(sURLParameter, {}, {}, 
					function(oData, oResponse) {
						if (oResponse.statusCode === "200") {
							me.getView().getModel().getData().Prancha = oData.Prancha;
							me.getModel().aBindings.forEach(
								function(currentValue, index, array) {
									if(currentValue.sPath === '/Prancha') {
										currentValue.oValue = oData.Prancha;
									}
								}, me);
						}
						me._bindView('/');
						me.zSetBusyFalse(me);
					}, 
					function(err) {
						sap.m.MessageToast.show("Erro ao recuperar meta gravada");
						me.zSetBusyFalse(me);
					});
			},
			onDataLabelPoroesCamadaHeatmapChanged : function(oEvent){
				var oPoroesCamadaHeatmap = this.getView().byId("idPoroesCamadaHeatmap");
				if (oPoroesCamadaHeatmap){
					oPoroesCamadaHeatmap.setVizProperties(
						{
							plotArea: {
								dataLabel: {
									visible: oEvent.getParameter('state')
								}
							}
						}
					);
				}
			},

			_vizPoroesCamadaHeatmapSet: function() {
				var oPoroesCamadaHeatmap = this.getView().byId("idPoroesCamadaHeatmap"),
                	oPopOver = this.getView().byId("idPoroesCamadaPopOver"),
                	oChartContainer = this.getView().byId("oChartContainer"),
                	me = this,
                	aVesselData = me.getView().getModel("ConfigNavio").getData();

				var iMaxNumberMaterials = 0;
				aVesselData.forEach(
						function(currentValue, index, array) {
							if(currentValue.Materiais.length > iMaxNumberMaterials) {
								iMaxNumberMaterials = currentValue.Materiais.length;	
							}
							currentValue.QtdMateriais = currentValue.Materiais.length;
						}, this);

				var aColorValue = [{
					"feed": "color",
					"type": "color",
					"numOfSegments": iMaxNumberMaterials,
					"palette": ["sapUiChartPaletteSequentialHue1Light3", "sapUiChartPaletteSequentialHue1Light2",
								"sapUiChartPaletteSequentialHue1Light1", "sapUiChartPaletteSequentialHue1",
								"sapUiChartPaletteSequentialHue1Dark1", "sapUiChartPaletteSequentialHue1Dark2",
								"sapUiChartPaletteSequentialHue3Light3", "sapUiChartPaletteSequentialHue3Light2"]
				}];
				oPoroesCamadaHeatmap.setVizScales(aColorValue);

				var aVizProperties = {
						general: {
							groupData: true
						},
						title: { 
							visible: false 
						},
						plotArea: {
							dataLabel: {
								renderer: function(oEvent) {
									oEvent.text = me._getQtdNoPoraoCamada(oEvent.ctx.Porões, oEvent.ctx.Camadas) + " TO/MT";
								}
							}
						}
					};
				oPoroesCamadaHeatmap.setVizProperties(aVizProperties);

				oPopOver.setCustomDataControl(
					function(data){
						var values = data.data.val, 
							divStr = "", 
							idx = values[3].value,
							aConfigNavio = me.getView().getModel("ConfigNavio").getData();
						
                        var svg = "<svg width='10px' height='10px'><path d='M-5,-5L5,-5L5,5L-5,5Z' fill='" + data.data.color + "' transform='translate(5,5)'></path></svg>";

                        divStr = divStr + "<div style = 'margin: 15px 30px 0 10px'>" + svg + "<b style='margin-left:10px'>" + values[0].value + " - " + values[1].value + "</b></div>";
                        divStr = divStr + "<div style = 'margin: 5px 30px 0 30px'><span>" + values[2].name + "</span><span style = 'float: right'>" + values[2].value + "</span></div>";
						
						var iTotal = 0;
                        aConfigNavio[idx].Materiais.forEach(
                        	function(currentValue, index, array) {
		                        divStr = divStr + "<div style = 'margin: 5px 30px 0 30px'><span>" + currentValue.Produto + "</span>";
		                        divStr = divStr + "<span style = 'float: right'>" + currentValue.Qtd + " TO/MT</span></div>";
		                        iTotal = iTotal + currentValue.Qtd;
							}, this);

						divStr = divStr + "<div style = 'margin: 5px 30px 0 30px'><span>Total</span>";
						divStr = divStr + "<span style = 'float: right'>" + iTotal + " TO/MT</span></div>";

                        return new sap.ui.core.HTML({content:divStr});
                    });

                oPopOver.connect(oPoroesCamadaHeatmap.getVizUid());
                oPopOver.setFormatString(sap.viz.ui5.format.ChartFormatter.DefaultPattern.STANDARDINTEGER);
				
				// Esconder ou exibir os botões dependendo da exibição do container de gráfico
				if(oChartContainer.getSelectedContent()) {
					if(oChartContainer.getSelectedContent().getId().indexOf("oChartContainerContent") > 0) {
						this.getView().byId("otbUnitsSearchField").setVisible(false);
						this.getView().byId("otbTraceGroupChanged").setVisible(false);
						this.getView().byId("exportUnitsSpreadheet").setVisible(false);
					} else {
						this.getView().byId("otbUnitsSearchField").setVisible(true);
						this.getView().byId("otbTraceGroupChanged").setVisible(true);
						this.getView().byId("exportUnitsSpreadheet").setVisible(true);
					}
				} else {
					this.getView().byId("otbUnitsSearchField").setVisible(false);
					this.getView().byId("otbTraceGroupChanged").setVisible(false);
					this.getView().byId("exportUnitsSpreadheet").setVisible(false);
				}

                // Hide Settings Panel for phone
                if (Device.system.phone) {
					this.getView().byId("exportUnitsSpreadheet").setVisible(false);
                	var oSettingsPanel = this.getView().byId("settingsPanel");
                	if (oSettingsPanel){
                		oSettingsPanel.setExpanded(false);
                		oSettingsPanel.setVisible(false);
						if (oPoroesCamadaHeatmap){
							oPoroesCamadaHeatmap.setVizProperties(
								{
									plotArea: {
										dataLabel: {
											visible: true
										}
									}
								}
							);
						}
                	}
                }

                // try to load sap.suite.ui.commons for using ChartContainer
                // sap.suite.ui.commons is available in sapui5-sdk-dist but not in demokit
                /*var libraries = sap.ui.getVersionInfo().libraries || [];
                var bSuiteAvailable = libraries.some(function(lib){
                	return lib.name.indexOf("sap.suite.ui.commons") > -1;
                });
                
                if (bSuiteAvailable) {
					jQuery.sap.require("sap/suite/ui/commons/ChartContainer");
	
	                var oChartContainerContent = new sap.suite.ui.commons.ChartContainerContent({
	                    icon : "sap-icon://BusinessSuiteInAppSymbols/icon-vessel",
	                    title : "Heatmap Chart",
	                    content : [ oPoroesCamadaHeatmap ]
	                });
	                
	                var oTableContainerContent = new sap.suite.ui.commons.ChartContainerContent({
	                    icon : "sap-icon://table-view",
	                    title : "Table",
	                    content : [ unitsEmbarcadasTable ]
	                });

	                var oChartContainer = new sap.suite.ui.commons.ChartContainer({
	                    content : [ oChartContainerContent, oTableContainerContent ]
	                });
	                oChartContainer.setShowFullScreen(true);
	                oChartContainer.setAutoAdjustHeight(true);
	                oChartContainer.setShowZoom(false);
	                //oChartContainer.attachContentChange();
	                //oChartContainer.setShowTitle(false);
	                this.getView().byId('chartFixFlex').setFlexContent(oChartContainer);
	            }*/
	            
	            /*var oPieChartConfig = {
	            	vizType: "pie",
	            	vizProperties: {
		            	title: {
		            		visible: false,
		            		text: "Materiais na Camada"
		            	},
		            	legend: {
		            		visible: true
		            	}
	            	}
	            };
	            
	            var oPieChart = sap.viz.ui5.controls.VizFrame("idMateriaisPieChart", oPieChartConfig);*/
	            
			},

			onChartContainerContentChanged: function(oEvent) {
				if (oEvent.getParameters().selectedItemId.indexOf("Table") > 0) {
					this.getView().byId("settingsPanel").setVisible(false);
					if (this.getView().byId("otbTraceGroupChanged").getPressed()) {
						this.getView().byId("otbUnitsSearchField").setVisible(false);
					} else {
						this.getView().byId("otbUnitsSearchField").setVisible(true);
					}
					this.getView().byId("otbTraceGroupChanged").setVisible(true);
					this.getView().byId("exportUnitsSpreadheet").setVisible(true);
				} else {
					this.getView().byId("settingsPanel").setVisible(true);
					this.getView().byId("otbUnitsSearchField").setVisible(false);
					this.getView().byId("otbTraceGroupChanged").setVisible(false);
					this.getView().byId("exportUnitsSpreadheet").setVisible(false);
				}
			},

			onUnitTitlePress: function(oEvent) {
				var sUnitCode = oEvent.getParameter("domRef").text,
					me = this,
					aUnits = me.getView().getModel("UnitsEmbarcadas").getData();

				aUnits.forEach(
					function(currentValue) {
						if (currentValue.Unit === sUnitCode) {
							sap.m.MessageToast.show(
								me.getResourceBundle().getText("MaterialCode") + " " + formatter.updateIntegerValue(currentValue.Material), 
								{
									duration: 3000,
									autoClose: false
								}
							);
						}
					}
				);
			},
			
			_getQtdNoPoraoCamada: function(sPorao, sCamada) {
				var aVesselData = this.getView().getModel("ConfigNavio").getData(),
					iQtdCamadaPorao = 0;

				aVesselData.forEach(
					function(currentValue){
						if (currentValue.Porao === sPorao && currentValue.Camada === sCamada) {
							iQtdCamadaPorao = currentValue.Qtd;
						}
					}
				);
				return iQtdCamadaPorao;
			},

			onTraceTableGroupChanged: function(oEvent) {
				var oTable = this.getView().byId("unitsEmbarcadasTable"),
					oTemplate = oTable.getBindingInfo("items").template,
					sNewModel = "",
					sOldModel = "";

				if (oEvent.getSource().getPressed()) {
					this.getModel("detailView").setProperty("/TracePerUnit", false);
					this.getModel("detailView").setProperty("/TracePerMaterial", true);
					
					sNewModel = "MateriaisEmbarcados";
					sOldModel = "UnitsEmbarcadas";
					
				} else {
					this.getModel("detailView").setProperty("/TracePerUnit", true);
					this.getModel("detailView").setProperty("/TracePerMaterial", false);

					sNewModel = "UnitsEmbarcadas";
					sOldModel = "MateriaisEmbarcados";

				}
				oTemplate.getCells().forEach(
						function(currentCell){
							if(currentCell.getBindingInfo("text")) {
								currentCell.getBindingInfo("text").parts.forEach(
										function(currentPart) {
											if(currentPart.model === sOldModel)
												currentPart.model = sNewModel;
										}
								);
							}
							if(currentCell.getBindingInfo("title")) {
								currentCell.getBindingInfo("title").parts.forEach(
										function(currentPart) {
											if(currentPart.model === sOldModel)
												currentPart.model = sNewModel;
										}
								);
							}
							if(currentCell.getBindingInfo("number")) {
								currentCell.getBindingInfo("number").parts.forEach(
										function(currentPart) {
											if(currentPart.model === sOldModel)
												currentPart.model = sNewModel;
										}
								);
							}
						}
				);

				oTable.bindItems({
						path: sNewModel + ">/", 
						template: oTemplate /*, 
						filters : aFilters,
						sorter : this.aSorterEqui*/
					}
				);
			},

			onTbUnitsSearch: function(oEvent) {
				if (!oEvent) return;
				
				var	aFilters = [],
					sQuery = oEvent.getParameter("query");

				// create model filter
				if (sQuery && sQuery.length > 0) {
					var filter = new sap.ui.model.Filter("Unit", sap.ui.model.FilterOperator.Contains, sQuery);
					aFilters.push(filter);
				}

				// update list binding
				var aList = this.getView().byId("unitsEmbarcadasTable");
				var aBinding = aList.getBinding("items");
				aBinding.filter(aFilters);
			}
		});
	}
);