sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/m/Button",
	"sap/m/MessageToast"
], function (Controller, JSONModel, Dialog, Text, Button, MessageToast) {
	"use strict";
	return Controller.extend("vsa.y5gl_22_delega.view.Default", {
		onInit: function () {

			var that = this;
			var oModel = this.getOwnerComponent().getModel();
			oModel.setSizeLimit(2000);

			this.oFormatYyyymmdd = sap.ui.core.format.DateFormat.getInstance({
				pattern: "dd-MM-yyyy",
				calendarType: sap.ui.core.CalendarType.Gregorian
			});

			var oViewModel = new JSONModel({
				minDate: new Date(),
				isTouch: sap.ui.Device.support.touch,
				isNoTouch: !sap.ui.Device.support.touch,
				isPhone: sap.ui.Device.system.phone,
				isNoPhone: !sap.ui.Device.system.phone
			});
			
			this.getView().setModel(oViewModel, "Substituto");

			var sServiceUrl = "/sap/opu/odata/sap/ZGWGL22_DELEGA_SRV";
			
			var oModel1 = new sap.ui.model.odata.ODataModel(sServiceUrl, true);		

//			oModel1.read('/Substitutos', {
//				success: function (oData, response) {
//					if (oData.results.length) {
//						// response header
//						var hdrMessage = response.headers["sap-message"];
//						var hdrMessageObject = JSON.parse(hdrMessage);
//
//						that.onApproveDialog(hdrMessageObject.message);
//					}
//				}
//			});
		},

		onAfterRendering: function () {
			//Disabilita o Titulo do launchpad 
			if(sap.ui.getCore().byId("shellAppTitle")){
				sap.ui.getCore().byId("shellAppTitle").setVisible(false);
			}
		},
		
		getUserName: function(){
			var oUserModel = new sap.ui.model.json.JSONModel();
			oUserModel.loadData("/sap/bc/ui2/start_up?", "", false);
			return ((oUserModel.getData().id) ? oUserModel.getData().id : "");
		},		
		
		onApproveDialog: function (oMsg) {
			var that = this;
			var dialog = new Dialog({
				title: 'Confirmar',
				type: 'Message',
				content: new Text({
					//text: 'Existe uma indicao de substituto.'
					text: oMsg
				}),
				beginButton: new Button({
					text: 'Anular',
					press: function () {
						that.onAnularSubs();
						//		MessageToast.show('Submit pressed!');
						dialog.close();
					}
				}),
				endButton: new Button({
					text: 'Cancelar',
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
		onAnularSubs: function () {
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var osucesso = oResourceBundle.getText("msgsucesso");
			var sServiceUrl = "/sap/opu/odata/sap/ZGWGL22_DELEGA_SRV";
			var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
			var oEntry = {};
			oEntry.Ident = "";
			oModel.create("/Delegar('" + oEntry.Ident + "')", oEntry, {
				method: "PUT",
				success: function (data) {
					MessageToast.show(osucesso);
				},
				error: function (e) {
					MessageToast.show("error");
				}
			});
		},
		handleSelectionChange: function (oEvent) {
			//	var IdDate = this.getView().byId("TextError");
			//	IdDate.setText("");
		},
		handleCalendarSelect: function (oEvent) {
			var oCalendar = oEvent.getSource();
			//var oCalendar = oEvent.oSource;
			this._updateText(oCalendar);
		},
		showBusyIndicator: function (iDuration, iDelay) {
			sap.ui.core.BusyIndicator.show(iDelay);

			if (iDuration && iDuration > 0) {
				if (this._sTimeoutId) {
					jQuery.sap.clearDelayedCall(this._sTimeoutId);
					this._sTimeoutId = null;
				}

				this._sTimeoutId = jQuery.sap.delayedCall(iDuration, this, function () {
					this.hideBusyIndicator();
				});
			}
		},
		_updateText: function (oCalendar) {

			//var oSelectedDateFrom = this.getView().byId("selectedDateFrom");
			var oSelectedDateTo = this.getView().byId("selectedDateTo");
			var aSelectedDates = oCalendar.getSelectedDates();
			var oDate;
			if (aSelectedDates.length > 0) {
				oDate = aSelectedDates[0].getStartDate();
				if (oDate) {
					oSelectedDateTo.setText(this.oFormatYyyymmdd.format(oDate));
				} else {
					oSelectedDateTo.setText(" Nenhuma data selecionada");
				}
//				oDate = aSelectedDates[0].getEndDate();
//				if (oDate) {
//					oSelectedDateTo.setText(this.oFormatYyyymmdd.format(oDate));
//				} else {
//					oSelectedDateTo.setText("Nenhuma data selecionada");
//				}
			} else {
				oSelectedDateTo.setText(" Nenhuma data selecionada");
			}
		},
		_updateTextError: function (oMsg) {
			var IdDate = this.getView().byId("TextError");
			if (oMsg.length > 0) {
				IdDate.setText(oMsg);
				IdDate.setState("Error");
			} else {
				IdDate.setText("");
			}
		},
		hideBusyIndicator: function () {
			sap.ui.core.BusyIndicator.hide();
		},
		onSalvar: function (oEvent) {
			var that = this;
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var omsgerro = oResourceBundle.getText("msgerro");
			var IdFragCombo = this.getView().byId("IdSubstituto");
			
			var aSelectedDates = this.getView().byId("calendar").getSelectedDates();
			var oDate;
			if (aSelectedDates.length > 0) {
				oDate = aSelectedDates[0].getStartDate();
			}
			
			
			//	var oText = this.getView().byId("TextError");
			//	oText.setText("Solicita��o em Processamento... aguarde!");
			//	oText.setState("Success");

			//	var oPanel = this.getView().byId("panel1");
			//	oPanel.setBusy(true);

			//var IdFrom = this.getView().byId("selectedDateFrom");
			var IdTo = this.getView().byId("selectedDateTo");

			//var dateFrom = IdFrom.getText();
			var dateTo = IdTo.getText();

			var l_error;
//			if (dateFrom == 'Nenhuma data selecionada') {
//				MessageToast.show(omsgerro); 
//				l_error = 'x';
//			}

			if (dateTo == 'Nenhuma data selecionada' && l_error == null) {
				MessageToast.show(omsgerro);
				l_error = 'x';
			}

			if (l_error == null) {

				this.showBusyIndicator(16000, 0);

				var IdUser;
				var sServiceUrl = "/sap/opu/odata/sap/ZGWGL22_DELEGA_SRV";
				var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

				try {
					IdUser = IdFragCombo.getSelectedItem().getKey();
				} catch (err) {

				}
				var oEntry = {
						Ident : this.getUserName(),
						IdentSubst : IdUser,
						Validade : oDate
				};

				var batchChanges = [];

				batchChanges.push(oModel.createBatchOperation("/Delegar", "POST", oEntry));
				oModel.addBatchChangeOperations(batchChanges);
				oModel.setUseBatch(true);
				oModel.setRefreshAfterChange(true);

				oModel.submitBatch(function (oData, oResp) {
						for (var i = 0; i < oData.__batchResponses.length; i++) {
							var oResponse = oData.__batchResponses[i].response;
							if (typeof oResponse !== "undefined" && oResponse.statusCode !== "200") {
								var message = JSON.parse(oResponse.body);
								var msgText = message.error.message.value;
								MessageToast.show(msgText);
								that.hideBusyIndicator();
							}
						}

						if (typeof oResponse === "undefined" && oResp.statusCode === 202) {
							that.hideBusyIndicator();
							MessageToast.show(that.getView().getModel("i18n").getResourceBundle().getText("msgsucesso"));
						}
					},
					function (err) {
						that._showMsgProcesso(err.response.statusText, 2000);
						that.hideBusyIndicator();
					});
			}
		}
	});
});