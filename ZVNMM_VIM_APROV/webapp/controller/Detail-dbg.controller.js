var __invoiceNo = "";

sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
    "sap/m/library",
    "sap/m/MessageToast",
	"sap/m/PDFViewer",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/ui/core/ValueState",
	"sap/m/Text",
], function (BaseController, JSONModel, formatter, mobileLibrary, MessageToast, PDFViewer, Dialog, DialogType, Button, ButtonType, ValueState, Text ) {
	"use strict";

	// shortcut for sap.m.URLHelper
	var URLHelper = mobileLibrary.URLHelper;

	return BaseController.extend("zvnmmvimapproval.controller.Detail", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit : function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
				busy : false,
				delay : 0,
				lineItemListTitle : this.getResourceBundle().getText("detailLineItemTableHeading")
			});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			this.setModel(oViewModel, "detailView");

			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));

			this._pdfViewer = new PDFViewer();
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onSendEmailPress : function () {
			var oViewModel = this.getModel("detailView");

			URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},


		/**
		 * Updates the item count within the line item table's header
		 * @param {object} oEvent an event containing the total number of items in the list
		 * @private
		 */
		onListUpdateFinished : function (oEvent) {
			var sTitle,
				iTotalItems = oEvent.getParameter("total"),
				oViewModel = this.getModel("detailView");

			// only update the counter if the length is final
			if (this.byId("lineItemsList").getBinding("items").isLengthFinal()) {
				if (iTotalItems) {
					sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
				} else {
					//Display 'Line Items' instead of 'Line items (0)'
					sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
				}
				oViewModel.setProperty("/lineItemListTitle", sTitle);
			}
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		/**
		 * Binds the view to the object path and expands the aggregated line items.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched : function (oEvent) {
			var sObjectId =  oEvent.getParameter("arguments").objectId;
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then( function() {
				var sObjectPath = this.getModel().createKey("ZET_VNMM_GET_INV_HEADERSet", {
					InvoiceNo :  sObjectId
				});
				this._bindView("/" + sObjectPath);
				__invoiceNo = sObjectId;
			}.bind(this));
		},

		/**
		 * Binds the view to the object path. Makes sure that detail view displays
		 * a busy indicator while data for the corresponding element binding is loaded.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound to the view.
		 * @private
		 */
		_bindView : function (sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("detailView");

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);

			this.getView().bindElement({
				path : sObjectPath,
				events: {
					change : this._onBindingChange.bind(this),
					dataRequested : function () {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange : function () {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}

			var sPath = oElementBinding.getPath(),
				oResourceBundle = this.getResourceBundle(),
				oObject = oView.getModel().getObject(sPath),
				sObjectId = oObject.InvoiceNo,
				sObjectName = oObject.InvoiceNo,
				oViewModel = this.getModel("detailView");

			this.getOwnerComponent().oListSelector.selectAListItem(sPath);

			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		},

		_onMetadataLoaded : function () {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("detailView"),
				oLineItemTable = this.byId("lineItemsList"),
				iOriginalLineItemTableBusyDelay = oLineItemTable.getBusyIndicatorDelay();

			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);
			oViewModel.setProperty("/lineItemTableDelay", 0);

			oLineItemTable.attachEventOnce("updateFinished", function() {
				// Restore original busy indicator delay for line item table
				oViewModel.setProperty("/lineItemTableDelay", iOriginalLineItemTableBusyDelay);
			});

			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		},

		/**
		 * Set the full screen mode to false and navigate to master page
		 */
		onCloseDetailPress: function () {
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
			// No item should be selected on master after detail page is closed
			this.getOwnerComponent().oListSelector.clearMasterListSelection();
			this.getRouter().navTo("master");
		},

		/**
		 * Toggle between full and non full screen mode.
		 */
		toggleFullScreen: function () {
			var bFullScreen = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
			if (!bFullScreen) {
				// store current layout and go full screen
				this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
				this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
			} else {
				// reset to previous layout
				this.getModel("appView").setProperty("/layout",  this.getModel("appView").getProperty("/previousLayout"));
			}
        },
        onApproveButtonPress: function (oEvent){
            //var msg = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy\r\n eirmod.';
			//MessageToast.show(msg);
			this.doAction("APPR_SAVE", "");
        },

		onRejectButtonPress: function (oEvent){

			var self = this;
			var dialog = new sap.m.Dialog({
			  title: this.getView().getModel("i18n").getResourceBundle().getText("ActionConfirm") ,
			  type: 'Message',
			  content: [
				new sap.m.Label({ text: this.getView().getModel("i18n").getResourceBundle().getText("ReasonRejection"), labelFor: 'event'}),
				new sap.m.Input('event', {
				  liveChange: function(oEvent) {
					var eventName = oEvent.getParameter('value');
					var parent = oEvent.getSource().getParent();
		  
					parent.getBeginButton().setEnabled(eventName.length > 0);
				  },
				  width: '100%',
				  placeholder: this.getView().getModel("i18n").getResourceBundle().getText("ReasonRejectionPlease")
				})
			  ],
			  beginButton: new sap.m.Button({
				text: this.getView().getModel("i18n").getResourceBundle().getText("Submit"),
				enabled: false,
				press: function () {
				  var sText = sap.ui.getCore().byId('event').getValue();
				  self.doAction("REJECT", sText);
				  dialog.close();
				}
			  }),
			  endButton: new sap.m.Button({
				text: this.getView().getModel("i18n").getResourceBundle().getText("Cancel"),
				press: function () {
				  dialog.close();
				}
			  }),
			  afterClose: function() {
				dialog.destroy();
			  }
			});
			dialog.open();

		},

		doAction: function(sAction, sReasonRejection){
            var _oModel = this.getModel("detailView");
			var _this = this;
			var InvToApprove = {};
			
			InvToApprove.InvoiceNo = __invoiceNo;
			InvToApprove.ReasonRejection = sReasonRejection;
			InvToApprove.Action = sAction;
						
			_oModel.setProperty("/busy", true);
			this.getModel().create('/ZET_VNMM_APPROVALSet', InvToApprove,{
				success: function(oData, oResponse){
					

					if (!_this.oSuccessMessageDialog) {
						_this.oSuccessMessageDialog = new Dialog({
							type: DialogType.Message,
							title: "Success",
							state: ValueState.Success,
							content: new Text({ text: oData.Result }),
							beginButton: new Button({
								type: ButtonType.Emphasized,
								text: "OK",
								press: function () {
									_this.oSuccessMessageDialog.close();
									_this.onCloseDetailPress();
									_this.getModel().refresh();
								}.bind(this)
							})
						});
					}
		
					_this.oSuccessMessageDialog.open();

				},
				error: function(error){
					_oModel.setProperty("/busy", false);
				}
			});
			
		},

		onDisplayImagePress: function(oEvent){
			debugger;
			var Path = "/ZET_VNMM_GET_INV_HEADERSet('"+ __invoiceNo +"')/GetImage"
            var _oModel = this.getModel("detailView");
			_oModel.setProperty("/busy", true);
			var myPDFViewer = new PDFViewer();
			this.getModel().read(Path, {
				success: function(oData, oResponse){

					_oModel.setProperty("/busy", false);
					sap.m.URLHelper.redirect(oData.FileURL, true);
					//myPDFViewer.setSource(oData.FileURL);
					//myPDFViewer.setTitle("Invoice Image");
					//myPDFViewer.open();
				},
				error: function(error){
					_oModel.setProperty("/busy", false);
				}
			});

		}
	});

});