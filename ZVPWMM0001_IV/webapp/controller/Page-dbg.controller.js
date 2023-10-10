sap.ui.define([
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/Label',
	'sap/m/MessageToast',
	'sap/m/Text',
	'sap/m/TextArea',
	'sap/ui/core/mvc/Controller',
	'sap/ui/layout/HorizontalLayout',
	'sap/ui/layout/VerticalLayout',
	'jquery.sap.global',
	'sap/ui/core/Fragment',
	'sap/ui/model/json/JSONModel',
	'sap/m/MessagePopover',
	'sap/m/MessagePopoverItem',
	'sap/m/UploadCollectionParameter',
	'sap/ui/core/format/FileSizeFormat',
	'sap/m/ObjectMarker',
	'sap/ui/core/routing/History'
], function(Button, Dialog, Label, MessageToast, Text, TextArea, Controller, HorizontalLayout, VerticalLayout, jQuery, Fragment,
	JSONModel, MessagePopover, MessagePopoverItem, UploadCollectionParameter, FileSizeFormat, ObjectMarker, History) {
	"use strict";
	var _timeout;
	return Controller.extend("portal.zvpwmm0001_iv.controller.Page", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf zglbc_aprovador.view.view.ViewPedidos
		 */
		onInit: function() {
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0,
				itemsPartner: []
			});

			var oModelAdm = this.getOwnerComponent().getModel();
			var oViewAdm = new JSONModel({
				isAdm: false,
				isApro: true
			});
			this.getView().setModel(oViewAdm, 'Administrador');
			oViewAdm = this.getModel("Administrador");
			var sServiceUrl1 = "/sap/opu/odata/sap/ZGWFBGL_ADM_PORTAL_UTIL_SRV/";
			oModelAdm = new sap.ui.model.odata.ODataModel(sServiceUrl1, true);
			oModelAdm.read("/Administradors", {
				success: function(oData) {
					if (oData.results.length) {
						if (oData.results[0].ButtonAdm === false) {
							oViewAdm.oData.isAdm = false;
							oViewAdm.oData.isApro = true;
						} else if (oData.results[0].ButtonAdm === true) {
							oViewAdm.oData.isAdm = true;
							oViewAdm.oData.isApro = false;
						}
						oViewAdm.refresh(true);
					}
				}
			});

			/*	this.getView().setModel(new JSONModel({
					"items": ["jpg", "txt", "ppt", "doc", "xls", "pdf", "png", "docx", "xlsx", "xlsb", "pptx", "jpeg", "xml"],
					"selected": ["jpg", "txt", "ppt", "doc", "xls", "pdf", "png", "docx", "xlsx", "xlsb", "pptx", "jpeg", "xml"]
				}), "fileTypes");*/

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("page").attachMatched(this._onRouteMatched, this);
			this.getView().setModel(oViewModel, "detailGrupoExportView");
			this.getView().setModel(oViewModel, "HistoryView");
			this._initializeMessagePopOver();

		},

		createPopover: function() {
			if (!this._oQuickView) {
				this._oQuickView = sap.ui.xmlfragment("portal.zvpwmm0001_iv.fragment.Grupo", this);
				this.getView().addDependent(this._oQuickView);
			}
		},

		onBeforeRebindTable: function(oEvent) {

			//  var oBindingParams = oEvent.getParameter('bindingParams');
			//  oBindingParams.parameters.numberOfExpandedLevels = 2;
			//  oBindingParams.parameters.countMode = "Inline";
		},

		onRejeitar: function(oEvent) {

			if (!this._dialog) {
				var vBusyDialog = sap.ui.xmlfragment("portal.zvpwmm0001_iv.fragment.BusyDialogRej", this);
				this.getView().addDependent(vBusyDialog);
			}
			var oModelP = this.getView("default").getModel();
			var IdDocumento = oEvent.getSource().getBindingContext().getProperty("Ivkey");

			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var oTextBtn = oResourceBundle.getText("BtnMotivoR");
			var oTitleRej = oResourceBundle.getText("TitleRejeição");
			var oTitleDocRej = oResourceBundle.getText("TitleDocRej");
			var oTitleDocNoApr = oResourceBundle.getText("TitleDocNoApr");
			var oTitleDocPro = oResourceBundle.getText("TitleDocPro");
			var oTextObri = oResourceBundle.getText("TitleObrig");
			var oTextConf = oResourceBundle.getText("TitleConfr");
			var oTextCanc = oResourceBundle.getText("oTextCance");
			var oTitleRejTotal = oResourceBundle.getText("TitleRejTotal");
			var oTitleRejInter = oResourceBundle.getText("TitleRejInter");

			var oView = this.getView();
			var oModel = oView.getModel();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var Radioindex = "";
			var ActionValue = "";
			var dialog = new Dialog({
				title: oTitleRej,
				type: 'Message',
				content: [
					new Label({
						text: oTextBtn,
						labelFor: 'rejectDialogTextarea'
					}),
					new TextArea('rejectDialogTextarea', {
						liveChange: function(oEvent) {
							var sText = oEvent.getParameter('value');
							var parent = oEvent.getSource().getParent();

							parent.getBeginButton().setEnabled(sText.length > 5);
						},
						maxLength: 255,
						rows: 3,
						width: '100%',
						placeholder: oTextObri
					}),
					new sap.m.RadioButtonGroup("grupo", {
						buttons: [
							new sap.m.RadioButton("button1", {
								selected: true,
								text: oTitleRejTotal
							}),
							new sap.m.RadioButton("button2", {
								text: oTitleRejInter
							})

						],
						select: function(oEvent) {
							Radioindex = oEvent.getParameters().selectedIndex;
						}
					})

				],
				beginButton: new Button({
					text: oTextConf,
					enabled: false,
					press: function() {
						if (Radioindex === 0 || Radioindex === '') {
							ActionValue = "R";
						} else {
							ActionValue = "B";
						}
						var sText = sap.ui.getCore().byId('rejectDialogTextarea').getValue();
						var oUrlParams = {
							Action: ActionValue,
							Coment: sText,
							Documento: IdDocumento,
							Userid: ""
						};

						oModel.callFunction("/OnFuncAction", {
							method: "POST",
							urlParameters: oUrlParams,
							success: function(oData, oResponse) {
								vBusyDialog.close();
								jQuery.sap.clearDelayedCall(_timeout);
								if (oData.Type == 'S') {

									sap.m.MessageToast.show(oTitleDocRej, {
										duration: 4000,
										width: "15em", // default
										my: "default", // default center bottom
										at: "defaul", // default center bottom
										//      of: window, // default
										offset: "0 0", // default
										collision: "fit fit", // default
										onClose: null, // default
										autoClose: false, // default
										animationTimingFunction: "ease-in", // default
										animationDuration: 3000, // default
										closeOnBrowserNavigation: true // default
									});

									oModelP.refresh();
									//	oRouter.navTo("default");
									var oHistory = History.getInstance();
									var sPreviousHash = oHistory.getPreviousHash();
									if (sPreviousHash !== undefined) {
										window.history.go(-1);
									} else {
										//var oRouter1 = sap.ui.core.UIComponent.getRouterFor(this);
										oRouter.navTo("default", true);
									}

								} else {

									sap.m.MessageToast.show(oTitleDocNoApr, {
										duration: 4000, // default
										width: "15em", // default
										my: "default", // default center bottom
										at: "defaul", // default center bottom
										//      of: window, // default
										offset: "0 0", // default
										collision: "fit fit", // default
										onClose: null, // default
										autoClose: false, // default
										animationTimingFunction: "ease-in", // default
										animationDuration: 3000, // default
										closeOnBrowserNavigation: true // default
									});

								}

							},
							error: function(oError) {
								vBusyDialog.close();
								jQuery.sap.clearDelayedCall(_timeout);
								sap.m.MessageToast.show(oError.statusText, {
									duration: 3000, // default
									width: "15em", // default
									my: "default", // default center bottom
									at: "default", // default center bottom
									//    of: window, // default
									offset: "0 0", // default
									collision: "fit fit", // default
									onClose: null, // default
									autoClose: false, // default
									animationTimingFunction: "ease", // default
									animationDuration: 1000, // default
									closeOnBrowserNavigation: true // default
								});

							}
						});

						dialog.close();
						vBusyDialog.open();
					}
				}),
				endButton: new Button({
					text: oTextCanc,
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});

			dialog.open();
		},
		onAprovar: function(oEvent) {
			if (!this._dialog) {
				var vBusyDialog = sap.ui.xmlfragment("portal.zvpwmm0001_iv.fragment.BusyDialog", this);
				this.getView().addDependent(vBusyDialog);
			}

			var oModelD = this.getView("default").getModel();
			var IdDocumento = oEvent.getSource().getBindingContext().getProperty("Ivkey");

			var oView = this.getView();
			var oModel = oView.getModel();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var oTitleAprov = oResourceBundle.getText("TitleAprovacao");
			var oTextCm = oResourceBundle.getText("TitleCm");
			var oTextConf = oResourceBundle.getText("AprovarD");
			var oTextCanc = oResourceBundle.getText("oTextCance");
			var oTitleDocApr = oResourceBundle.getText("TitleDocApr");
			var oTitleDocPro = oResourceBundle.getText("TitleDocPro");

			var dialog = new Dialog({
				title: oTitleAprov,
				type: 'Message',
				content: [
					new Label({
						text: oTextCm,
						labelFor: 'aprovDialogTextarea'
					}),
					new TextArea('aprovDialogTextarea', {
						liveChange: function(oEvent) {
							var sText = oEvent.getParameter('value');
							var parent = oEvent.getSource().getParent();

							//parent.getBeginButton().setEnabled();//sText.length = 0
						},
						maxLength: 255,
						rows: 3,
						width: '100%',
						placeholder: ''
					})
				],
				beginButton: new Button({
					text: oTextConf,
					enabled: true,
					press: function() {
						var sText = sap.ui.getCore().byId('aprovDialogTextarea').getValue();
						var oUrlParams = {
							Action: "A",
							Coment: sText,
							Documento: IdDocumento,
							Userid: ""
						};

						oModel.callFunction("/OnFuncAction", {
							method: "POST",
							urlParameters: oUrlParams,
							success: function(oData, oResponse) {
								vBusyDialog.close();
								jQuery.sap.clearDelayedCall(_timeout);
								if (oData.Type == 'S') {

									sap.m.MessageToast.show(oTitleDocApr, {
										duration: 5000, // default
										width: "15em", // default
										my: "default", // default
										at: "default", // default
										//  of: window, // default
										offset: "0 0", // default
										collision: "fit fit", // default
										onClose: null, // default
										autoClose: false, // default
										animationTimingFunction: "ease-in", // default
										animationDuration: 3000, // default
										closeOnBrowserNavigation: true // default
									});

									oModelD.refresh();
									var oHistory = History.getInstance();
									var sPreviousHash = oHistory.getPreviousHash();
									if (sPreviousHash !== undefined) {
										window.history.go(-1);
									} else {
										//var oRouter1 = sap.ui.core.UIComponent.getRouterFor(this);
										oRouter.navTo("default", true);
									}
								} else {

									sap.m.MessageBox.error(oData.Message, {});
								}

							},
							error: function(oError) {
								vBusyDialog.close();
								jQuery.sap.clearDelayedCall(_timeout);
								sap.m.MessageToast.show(oError.statusText, {
									duration: 3000, // default
									width: "15em", // default
									my: "default", // default center bottom
									at: "default", // default center bottom
									//        of: window, // default
									offset: "0 0", // default
									collision: "fit fit", // default
									onClose: null, // default
									autoClose: false, // default
									animationTimingFunction: "ease", // default
									animationDuration: 1000, // default
									closeOnBrowserNavigation: true // default
								});

							}

							//success: jQuery.proxy(this.successGetATPData, this),
							//error: jQuery.proxy(this.errorGetATPData, this)
						});

						dialog.close();
						vBusyDialog.open();

					}
				}),
				endButton: new Button({
					text: oTextCanc,
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});

			dialog.open();
		},

		errorGetATPData: function(oData) {
			sap.m.MessageBox.error(oData.Message, {});

		},
		closeDialog: function() {
			this.dialog.close();
		},
		getModel: function(name) {
			return this.getView().getModel(name) || this.getOwnerComponent().getModel(name);
		},

		_onRouteMatched: function(oEvent) {

			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();
			oView.bindElement({
				path: "/Inventarios(Ivkey='" + oArgs.Ivkey + "')",
				events: {
					dataRequested: function() {
						oView.setBusy(true);
					},
					dataReceived: function() {
						oView.setBusy(false);
					}
				}
			});
			this.onMessagePopOver(oArgs);
		},
		_onBindingChange: function(oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		},
		handleRouteMatched: function(evt) {
			if (evt.getParameter("name") !== "page") {
				return;
			}
		},

		status: function(Status) {

			if (Status === "X") {
				return "sap-icon://approvals";
			}
			if (Status === "") {
				return "sap-icon://status-negative";
			}
		},
		statusS: function(Status) {

			if (Status === "X") {
				return "Success";
			}
			if (Status === "") {
				return "Warning";
			}

		},
		statusT: function(Status) {

			if (Status === "X") {
				return "Aprovado";
			}
			if (Status === "") {
				return "Pendente";
			}

		},
		statusG: function(Grupo) {
			if (Grupo === "X") {
				return true;
			}
			if (Grupo === "") {
				return false;
			}

		},
		onExit: function() {
			if (this._oPopover) {
				this._oPopover.destroy();
			}
		},

		handleResponsivePopoverPress: function(oEvent) {

			//if (!this._oPopover) {
			var oView = this.getView();
			this._oPopover = sap.ui.xmlfragment(oView.getId(), "portal.zvpwmm0001_iv.fragment.Grupo", this);
			this.getView().addDependent(this._oPopover);
			//}

			this._oPopover.openBy(oEvent.getSource());

			var oModel = this.getView().getModel();
			var sPath = oEvent.getSource().getParent().getBindingContextPath();
			var oViewModel = this.getModel("detailGrupoExportView");
			sPath = sPath + "/ToGrupo";
			oModel.read(sPath, {
				success: function(oData) {
					if (oData.results.length) {
						oViewModel.setProperty("/itemsPartner", oData.results);
						oViewModel.refresh(true);
					}
				}
			});

		},

		handleCloseButton: function(oEvent) {
			this._oPopover.close();
			if (this._oPopover) {
				this._oPopover.destroy();
			}
		},
		onHandleMessagePopover: function(oEvent) {

			this.oMessagePopover.openBy(oEvent.getSource());
		},

		_initializeMessagePopOver: function() {

			this.oMessageTemplate = new MessagePopoverItem({
				type: '{Type}',
				title: '{Message}',
				description: '{Description}',
				subtitle: '{Subtitle}'
			});

			this.oMessagePopover = new MessagePopover({
				items: {
					path: '/',
					template: this.oMessageTemplate
				}
			});

			this.getView().setModel(new sap.ui.model.json.JSONModel(), 'messagePopOver');

		},

		onMessagePopOver: function(oArgs) {

			var that = this;
			var oModel = this.getView().getModel();
			var sPath = ("/Inventarios(Ivkey='" + oArgs.Ivkey + "')" + "/ToLog");
			oModel.read(sPath, {
				success: function(oData, oResponse) {
					that._createMessagePopOver(oResponse);
				}

			});

		},
		_createMessagePopOver: function(oMessages) {
			var sMessages = [];

			oMessages.data.results.forEach(function(oItem) {
				sMessages.push({
					Type: oItem.Type,
					Message: oItem.Title /*oItem.Message*/ ,
					Description: oItem.Description,
					Subtitle: oItem.Subtitle
				});
			});

			//Seta Model no Objeto MessagePopOver
			var oViewModel = this.getModel("messagePopOver");
			oViewModel.setData(sMessages);
			this.oMessagePopover.setModel(oViewModel);

			var oButtonMsg = this.byId("LogButtonMsg");
			oButtonMsg.setText([sMessages.length]);
		},
		_createMessagePopOver1: function(oMessages) {

			var sMessages = [];

			oMessages.data.results.forEach(function(oItem) {
				sMessages.push({
					Type: oItem.Type,
					Message: oItem.Message,
					Description: "",
					Subtitle: ""
				});
			});

			//Seta Model no Objeto MessagePopOver
			var oViewModel = this.getModel("messagePopOver");
			oViewModel.setData(sMessages);
			this.oMessagePopover.setModel(oViewModel);

			var oButtonMsg = this.byId("LogButtonMsg");
			oButtonMsg.setText([sMessages.length]);
		},
		onDownloadItem: function() {
			var oUploadCollection = this.getView().byId("UploadCollection");
			var aSelectedItems = oUploadCollection.getSelectedItems();
			if (aSelectedItems) {
				for (var i = 0; i < aSelectedItems.length; i++) {
					oUploadCollection.downloadItem(aSelectedItems[i], true);
				}
			} else {
				MessageToast.show("Select an item to download");
			}
		},
		getAttachmentTitleText: function() {

			var aItems = this.getView().byId("UploadCollection").getItems();
			return "Uploaded (" + aItems.length + ")";
		},
		onSelectionChange: function() {
			var oUploadCollection = this.getView().byId("UploadCollection");
			// If there's any item selected, sets download button enabled
			if (oUploadCollection.getSelectedItems().length > 0) {
				this.getView().byId("downloadButton").setEnabled(true);
				if (oUploadCollection.getSelectedItems().length === 1) {
					this.getView().byId("versionButton").setEnabled(true);
				} else {
					this.getView().byId("versionButton").setEnabled(false);
				}
			} else {
				this.getView().byId("downloadButton").setEnabled(false);
				this.getView().byId("versionButton").setEnabled(false);
			}
		},
		formatAttribute: function(sValue) {
			if (jQuery.isNumeric(sValue)) {
				return FileSizeFormat.getInstance({
					binaryFilesize: false,
					maxFractionDigits: 1,
					maxIntegerDigits: 3
				}).format(sValue);
			} else {
				return sValue;
			}
		},

		onBeforeUploadStarts: function(oEvent) {
			var IdDocumento = oEvent.getSource().getBindingContext().getProperty("Ivkey");
			var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
				name: "slug",
				value: encodeURIComponent("A|" + oEvent.getParameter("fileName") + "|" + IdDocumento)

			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);

		},
		onVersion: function() {
			var oUploadCollection = this.getView().byId("UploadCollection");
			this.bIsUploadVersion = true;
			this.oItemToUpdate = oUploadCollection.getSelectedItem();
			oUploadCollection.openFileDialog(this.oItemToUpdate);
		},
		updateFile: function() {
			var oData = this.getView().byId("UploadCollection").getModel().getData();
			var aItems = jQuery.extend(true, {}, oData).items;
			// Adds the new metadata to the file which was updated.
			for (var i = 0; i < aItems.length; i++) {
				if (aItems[i].documentId === this.oItemToUpdate.getDocumentId()) {
					// Uploaded by
					aItems[i].attributes[0].text = "You";
					// Uploaded on
					aItems[i].attributes[1].text = new Date(jQuery.now()).toLocaleDateString();
					// Version
					var iVersion = parseInt(aItems[i].attributes[3].text, 10);
					iVersion++;
					aItems[i].attributes[3].text = iVersion;
				}
			}
			// Updates the model.
			this.getView().byId("UploadCollection").getModel().setData({
				"items": aItems
			});
			// Sets the flag back to false.
			this.bIsUploadVersion = false;
			this.oItemToUpdate = null;
		},
		onChange: function(oEvent) {
			var csrfToken = this.csrfToken = this.getView().getModel().oHeaders['x-csrf-token'];
			// Stellen das CSRF Token wenn ein File hinzugefügt ist
			var oUploadCollection = oEvent.getSource();
			var oCustomerHeaderToken = new UploadCollectionParameter({
				name: "x-csrf-token",
				value: csrfToken
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
		},
		onUploadComplete: function(oEvent) {
			var oUploadCollection = this.getView().byId("UploadCollection");
			var oData = oUploadCollection.getModel();
			if (this.bIsUploadVersion) {
				this.updateFile(oEvent.getParameters());
			} else {
				try {
					var aFiles = oEvent.getParameters().files;
					var array = aFiles[0].responseRaw.split("<d:Filename>");

					if (array.length > 1) {
						var array1 = array[1].split("</d");
						MessageToast.show(array1[0]);
					}
				} catch (e) {
					oData.refresh();
				}

			}
			oData.refresh();
		},

		onFileSizeExceed: function(oEvent) {
			MessageToast.show("O tamanho do anexo excede o limite permitido de 10 MB (10240 KB)");
		},

		onTypeMissmatch: function(oEvent) {
			MessageToast.show("Tipo de documento não está autorizado");
		},
		onFileRenamed: function(oEvent) {
			var that = this;
			var IdDocumento = oEvent.getSource().getBindingContext().getProperty("Ivkey");
			var FileId = oEvent.getParameter("documentId");

			var oModel1 = this.getView("default").getModel();
			oModel1.setHeaders({
				"slug": encodeURIComponent("R|" + oEvent.getParameter("fileName") + "|" + IdDocumento + "|" + FileId)
			});

			var oEntry = {
				Documento: IdDocumento,
				FileId: oEvent.getParameter("documentId"),
				Filename: oEvent.getParameter("fileName")
			};

			oModel1.create("/Attachments", oEntry, {
				method: "POST",
				success: function(oData, oError) {
					if (oData.Documento === 'E' && oData.Filename.length) {
						MessageToast.show(oData.Filename);
					}
					var oUploadCollection1 = that.getView().byId("UploadCollection");
					var oData2 = oUploadCollection1.getModel();
					oData2.refresh();
				},
				error: function(oError) {
					sap.m.MessageBox.alert("Error Rename file!!");
					var oUploadCollection1 = that.getView().byId("UploadCollection");
					var oData2 = oUploadCollection1.getModel();
					oData2.refresh();
				}
			});

		},
		onFileDeleted: function(oEvent) {
			this.deleteItemById(oEvent.getParameter("documentId"));
			var that = this;
			var IdDocumento = oEvent.getSource().getBindingContext().getProperty("Ivkey");
			var FileId = oEvent.getParameter("documentId");

			var oModel1 = this.getView("default").getModel();
			oModel1.setHeaders({
				"slug": encodeURIComponent("D|" + oEvent.getParameter("fileName") + "|" + IdDocumento + "|" + FileId)
			});

			var oEntry = {
				Documento: IdDocumento,
				FileId: oEvent.getParameter("documentId"),
				Filename: oEvent.getParameter("fileName")
			};

			oModel1.create("/Attachments", oEntry, {
				method: "POST",
				success: function(oData, oResponse) {
					if (oData.Documento === 'E' && oData.Filename.length) {
						MessageToast.show(oData.Filename);
					}
					var oUploadCollection1 = that.getView().byId("UploadCollection");
					var oData2 = oUploadCollection1.getModel();
					oData2.refresh();
				},
				error: function(oError) {
					sap.m.MessageBox.alert("Error Delete!!");
				}
			});
		},
		deleteItemById: function(sItemToDeleteId) {
			var oData = this.getView().byId("UploadCollection").getModel().getData();
			var aItems = jQuery.extend(true, {}, oData).items;
			jQuery.each(aItems, function(index) {
				if (aItems[index] && aItems[index].documentId === sItemToDeleteId) {
					aItems.splice(index, 1);
				}
			});

		},
		createObjectMarker: function(sId, oContext) {
			var mSettings = null;
			if (oContext.getProperty("type")) {
				mSettings = {
					type: "{type}",
					press: this.onMarkerPress
				};
			}
			return new ObjectMarker(sId, mSettings);
		},
		onHistory: function(oEvent) {

			var oView = this.getView();
			this._oPopover = sap.ui.xmlfragment(oView.getId(), "portal.zvpwmm0001_iv.fragment.History", this);
			this.getView().addDependent(this._oPopover);
			this._oPopover.openBy(oEvent.getSource());

			var oModel = this.getView().getModel();
			var sPath = oEvent.getSource().getParent().getBindingContext().sPath;
			var oViewModel = this.getModel("HistoryView");
			sPath = sPath + "/ToHistory";
			oModel.read(sPath, {
				success: function(oData) {
					if (oData.results.length) {
						oViewModel.setProperty("/History", oData.results);
						oViewModel.refresh(true);
					}
				}
			});

		}
	});

});