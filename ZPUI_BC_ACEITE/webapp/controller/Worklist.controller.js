/*global location history */
sap.ui.define([
	"ZCBMM_ACEITE_RESERVA/ZCBMM_ACEITE_RESERVA/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"ZCBMM_ACEITE_RESERVA/ZCBMM_ACEITE_RESERVA/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/Button",
	"sap/m/List",
	"sap/m/StandardListItem",
	"sap/ui/model/Sorter",
	'sap/m/VBox',
	'sap/m/Dialog',
	'sap/m/Text',
	'sap/m/TextArea',
	'sap/ui/core/Fragment'
], function (BaseController, JSONModel, History, formatter, Filter, FilterOperator, Button, List, StandardListItem, Sorter, VBox, Dialog,
	Text, TextArea, Fragment) {
	"use strict";

	return BaseController.extend("ZCBMM_ACEITE_RESERVA.ZCBMM_ACEITE_RESERVA.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {
			var oViewModel,
				iOriginalBusyDelay,
				oTable = this.byId("smartTable");
			this.i18n = this.getResourceBundle();
			this.photo = {
				Value: null,
				Reserva: null,
				Nome: null,
				Item: null,
				Matricula: null
			};

			// Put down worklist table's original value for busy indicator delay,
			// so it can be restored later on. Busy handling on the table is
			// taken care of by the table itself.
			iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			// keeps the search state
			this._aTableSearchState = [];

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				worklistTableTitle: this.i18n.getText("worklistTableTitle"),
				saveAsTileTitle: this.i18n.getText("saveAsTileTitle", this.i18n.getText("worklistViewTitle")),
				shareOnJamTitle: this.i18n.getText("worklistTitle"),
				shareSendEmailSubject: this.i18n.getText("shareSendEmailWorklistSubject"),
				shareSendEmailMessage: this.i18n.getText("shareSendEmailWorklistMessage", [location.href]),
				tableNoDataText: this.i18n.getText("tableNoDataText"),
				tableBusyDelay: 0
			});
			this.setModel(oViewModel, "worklistView");

			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			oTable.attachEventOnce("updateFinished", function () {
				// Restore original busy indicator delay for worklist's table
				oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			});
			// Add the worklist page to the flp routing history
			this.addHistoryEntry({
				title: this.i18n.getText("worklistViewTitle"),
				icon: "sap-icon://table-view",
				intent: "#Resgistraraceitedebaixasporreserva-display"
			}, true);

			//this.getView().byId("html").setContent("<canvas id='signature-pad' width='400' height='200' class='signature-pad'></canvas>");
		},

		/******************Signature Pad Draw************************/
		// onSign: function (oEvent) {
		// 	var canvas = document.getElementById("signature-pad");
		// 	if (canvas) {
		// 		var context = canvas.getContext("2d");
		// 	}
		// 	var disableSave = true;
		// 	var pixels = [];
		// 	var cpixels = [];
		// 	var xyLast = {};
		// 	var xyAddLast = {};
		// 	var calculate = false;
		// 	canvas.width = 276;
		// 	canvas.height = 180;
		// 	context.fillStyle = "#fff";
		// 	context.strokeStyle = "#444";
		// 	context.lineWidth = 1.5;
		// 	context.lineCap = "round";
		// 	context.fillRect(0, 0, canvas.width, canvas.height);

		// 	canvas.addEventListener('touchstart', this.on_mousedown(), false);
		// 	canvas.addEventListener('mousedown', this.on_mousedown(), false);
		// },

		// //functions
		// remove_event_listeners: function () {
		// 	var canvas = document.getElementById("signature-pad");
		// 	if (canvas) {
		// 		var context = canvas.getContext("2d");
		// 	}
		// 	var disableSave = true;
		// 	var pixels = [];
		// 	var cpixels = [];
		// 	var xyLast = {};
		// 	var xyAddLast = {};
		// 	var calculate = false;
		// 	canvas.removeEventListener('mousemove', this.on_mousemove(), false);
		// 	canvas.removeEventListener('mouseup', this.on_mouseup(), false);
		// 	canvas.removeEventListener('touchmove', this.on_mousemove(), false);
		// 	canvas.removeEventListener('touchend', this.on_mouseup(), false);

		// 	document.body.removeEventListener('mouseup', this.on_mouseup(), false);
		// 	document.body.removeEventListener('touchend', this.on_mouseup(), false);
		// },

		// get_coords: function (e) {
		// 	var canvas = document.getElementById("signature-pad");
		// 	if (canvas) {
		// 		var context = canvas.getContext("2d");
		// 	}
		// 	var disableSave = true;
		// 	var pixels = [];
		// 	var cpixels = [];
		// 	var xyLast = {};
		// 	var xyAddLast = {};
		// 	var calculate = false;
		// 	var x, y;

		// 	if (e.changedTouches && e.changedTouches[0]) {
		// 		var offsety = canvas.offsetTop || 0;
		// 		var offsetx = canvas.offsetLeft || 0;

		// 		x = e.changedTouches[0].pageX - offsetx;
		// 		y = e.changedTouches[0].pageY - offsety;
		// 	} else if (e.layerX || 0 == e.layerX) {
		// 		x = e.layerX;
		// 		y = e.layerY;
		// 	} else if (e.offsetX || 0 == e.offsetX) {
		// 		x = e.offsetX;
		// 		y = e.offsetY;
		// 	}

		// 	return {
		// 		x: x,
		// 		y: y
		// 	};
		// },

		// on_mousedown: function (e) {

		// 	var canvas = document.getElementById("signature-pad");
		// 	if (canvas) {
		// 		var context = canvas.getContext("2d");
		// 	}
		// 	var disableSave = true;
		// 	var pixels = [];
		// 	var cpixels = [];
		// 	var xyLast = {};
		// 	var xyAddLast = {};
		// 	var calculate = false;
		// 	if (e !== undefined) {
		// 		e.preventDefault();
		// 		e.stopPropagation();
		// 	}
		// 	canvas.addEventListener('mouseup', this.on_mouseup(), false);
		// 	canvas.addEventListener('mousemove', this.on_mousemove(), false);
		// 	canvas.addEventListener('touchend', this.on_mouseup(), false);
		// 	canvas.addEventListener('touchmove', this.on_mousemove(), false);
		// 	document.body.addEventListener('mouseup', this.on_mouseup(), false);
		// 	document.body.addEventListener('touchend', this.on_mouseup(), false);

		// 	var empty = false;
		// 	var xy = this.get_coords(e);
		// 	context.beginPath();
		// 	pixels.push('moveStart');
		// 	context.moveTo(xy.x, xy.y);
		// 	pixels.push(xy.x, xy.y);
		// 	xyLast = xy;

		// },

		// on_mousemove: function (e, finish) {
		// 	var canvas = document.getElementById("signature-pad");
		// 	if (canvas) {
		// 		var context = canvas.getContext("2d");
		// 	}
		// 	var disableSave = true;
		// 	var pixels = [];
		// 	var cpixels = [];
		// 	var xyLast = {};
		// 	var xyAddLast = {};
		// 	var calculate = false;

		// 	e.preventDefault();
		// 	e.stopPropagation();

		// 	var xy = this.get_coords(e);
		// 	var xyAdd = {
		// 		x: (xyLast.x + xy.x) / 2,
		// 		y: (xyLast.y + xy.y) / 2
		// 	};

		// 	if (calculate) {
		// 		var xLast = (xyAddLast.x + xyLast.x + xyAdd.x) / 3;
		// 		var yLast = (xyAddLast.y + xyLast.y + xyAdd.y) / 3;
		// 		pixels.push(xLast, yLast);
		// 	} else {
		// 		calculate = true;
		// 	}

		// 	context.quadraticCurveTo(xyLast.x, xyLast.y, xyAdd.x, xyAdd.y);
		// 	pixels.push(xyAdd.x, xyAdd.y);
		// 	context.stroke();
		// 	context.beginPath();
		// 	context.moveTo(xyAdd.x, xyAdd.y);
		// 	xyAddLast = xyAdd;
		// 	xyLast = xy;

		// },

		// on_mouseup: function (e) {
		// 	var canvas = document.getElementById("signature-pad");
		// 	if (canvas) {
		// 		var context = canvas.getContext("2d");
		// 	}
		// 	var disableSave = true;
		// 	var pixels = [];
		// 	var cpixels = [];
		// 	var xyLast = {};
		// 	var xyAddLast = {};
		// 	var calculate = false;
		// 	this.remove_event_listeners();
		// 	disableSave = false;
		// 	context.stroke();
		// 	pixels.push('e');
		// 	calculate = false;
		// },

		// /***********Download the Signature Pad********************/

		// saveButton: function (oEvent) {
		// 	var canvas = document.getElementById("signature-pad");
		// 	if (canvas) {
		// 		var context = canvas.getContext("2d");
		// 	}
		// 	var disableSave = true;
		// 	var pixels = [];
		// 	var cpixels = [];
		// 	var xyLast = {};
		// 	var xyAddLast = {};
		// 	var calculate = false;

		// 	var link = document.createElement('a');
		// 	link.href = canvas.toDataURL('image/jpeg');
		// 	link.download = 'sign.jpeg';
		// 	link.click();
		// 	var signaturePad = new SignaturePad(canvas, {
		// 		backgroundColor: '#ffffff',
		// 		penColor: 'rgb(0, 0, 0)'
		// 	});
		// },

		// /************Clear Signature Pad**************************/

		// clearButton: function (oEvent) {

		// 	var canvas = document.getElementById("signature-pad");
		// 	var context = canvas.getContext("2d");
		// 	context.clearRect(0, 0, canvas.width, canvas.height);

		// 	var signaturePad = new SignaturePad(document.getElementById('signature-pad'), {
		// 		backgroundColor: '#ffffff',
		// 		penColor: 'rgb(0, 0, 0)',
		// 		penWidth: '1'
		// 	});
		// },
		// atualizaTabela: function() {
		// 	var smartTable = this.getView().byId("smartTable");
		// 	smartTable.rebindTable("e");
		// },

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function (oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.i18n.getText("worklistTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.i18n.getText("worklistTableTitle");
			}
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress: function (oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function () {
			var oViewModel = this.getModel("worklistView"),
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

		onRefresh: function () {
			var oTable = this.byId("smartTable");
			oTable.getBinding("items").refresh();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		save: function (evt) {
			var items = this.byId("table").getItems();

			if (items.length === 0) {
				sap.m.MessageBox.warning(this.i18n.getText("noItems"));
				return;
			}
			this.itemsAceitos = [];
			this.photoAceitos = [];
			for (var i = 0; i < items.length; i++) {
				var itemAceito = {};
				var objItem = this.getModel().getObject(items[i].getBindingContext().getPath());
				var cells = items[i].getCells();
				delete objItem.__metadata;
				itemAceito.path = items[i].getBindingContext().getPath();
				itemAceito.data = objItem;
				this.photo.Nome = objItem.Nome;
				this.photo.Matricula = objItem.Matricula;
				this.photo.Reserva = objItem.Reserva;
				this.photo.Item = objItem.Item;
				for (var i2 = 0; i2 < cells.length; i2++) {
					if (cells[i2].getId().match("inputId")) {
						itemAceito.data.QtdAceite = cells[i2].getValue().replace(",", ".");
					}
				}
				if (itemAceito.data.QtdAceite > 0) {
					this.itemsAceitos.push(itemAceito);
					this.photoAceitos.push(this.photo);
				}
			}
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("fragmentAceite", "ZCBMM_ACEITE_RESERVA.ZCBMM_ACEITE_RESERVA.view.Aceite", this);
			}

			this.getView().addDependent(this._oDialog);

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
		},

		closeDialog: function (evt) {
			this.csrfToken = this.getModel().getSecurityToken();
			//Check CSRF from ODATA

			if (Fragment.byId("fragmentAceite", "input1").getValue() && Fragment.byId("fragmentAceite", "input2").getValue()) {
				for (var i = 0; i < this.itemsAceitos.length; i++) {
					this.itemsAceitos[i].data.Nome = Fragment.byId("fragmentAceite", "input1").getValue();
					this.itemsAceitos[i].data.Matricula = Fragment.byId("fragmentAceite", "input2").getValue();
					this.photoAceitos[i].Nome = Fragment.byId("fragmentAceite", "input1").getValue();
					this.photoAceitos[i].Matricula = Fragment.byId("fragmentAceite", "input2").getValue();
					this.itemsAceitos[i].data.Login = sap.ushell.Container.getService('UserInfo').getId();
					this.photoAceitos[i].Login = sap.ushell.Container.getService('UserInfo').getId();
					
				}
				
				this.updateAceite(this.itemsAceitos, this.photoAceitos);
				this._oDialog.close();
			}
		},

		beforeClose: function (evt) {
			this._oDialog.destroy();
			this._oDialog = undefined;
		},

		close: function (evt) {
			this._oDialog.close();
		},

		onSnapshot: function (evt) {

			for (var i = 0; i < this.photoAceitos.length; i++) {
				this.photoAceitos[i].Value = evt.getParameter("image");
			}
			sap.m.MessageBox.success(this.i18n.getText("snapshot"));
			Fragment.byId("fragmentAceite", "btnClose").setEnabled(true);
		},

		onPhoto: function (evt) {
			if (!this._oDialogPhoto) {
				this._oDialogPhoto = sap.ui.xmlfragment("fragmentPhoto", "ZCBMM_ACEITE_RESERVA.ZCBMM_ACEITE_RESERVA.view.Foto", this);
			}

			this.getView().addDependent(this._oDialogPhoto);
			var cells = evt.getSource().getParent().getCells();
			for (var i = 0; i < cells.length; i++) {
				if (cells[i].getId().match("idreserva")) {
					var reserva = cells[i].getText();
				} else if (cells[i].getId().match("itemreserva")) {
					var item = cells[i].getText();
				} else if (cells[i].getId().match("datareserva")) {
					var data = cells[i].getText();
				} else if (cells[i].getId().match("horareserva")) {
					var horaStr = cells[i].getText();
					var oTimeFormat = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "PTHH'H'mm'M'ss'S'"
					});
					var date = new Date(data.substr(3, 2) + "/" + data.substr(0, 2) + "/" + data.substr(6));
					date.setHours((horaStr.substr(9, 2) === "PM") ? parseInt(horaStr.substr(0, 2)) + 12 : parseInt(horaStr.substr(0, 2))); //"03:38:04 PM"
					date.setMinutes(parseInt(horaStr.substr(3, 2)));
					date.setSeconds(parseInt(horaStr.substr(6, 2)));
					var timeinmiliseconds = date.getTime();
					var timeStr = oTimeFormat.format(new Date(timeinmiliseconds));
					var hora = timeStr;
				}
			}
			var image = Fragment.byId("fragmentPhoto", "image");
			var dataStr = data.substr(6, 4) + data.substr(3, 2) + data.substr(0, 2);
			image.setSrc("/sap/opu/odata/sap/ZGWCBMM_ACEITE_RESERVA_SRV/ZET_CBMM_CF_ACEITE_FOTOSet(Reserva='" + reserva + "',Item='" + item +
				"',Data='" + dataStr + "',Hora=time'" + hora + "')/$value");

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogPhoto);
			this._oDialogPhoto.open();
		},

		closePhoto: function (evt) {
			this._oDialogPhoto.close();
		},

		updateAceite: function (itemsAceitos, photoAceitos) {
			var that = this;
			var i = 0;

			for (var i = 0; i < itemsAceitos.length; i++) {
				var horaMs = itemsAceitos[i].data.Hora;
				var oTimeFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "PTHH'H'mm'M'ss'S'"
				});
                var date = new Date(horaMs.ms);
				var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
				var timeinmiliseconds = date.getTime();
				var timeStr = oTimeFormat.format(new Date(timeinmiliseconds + TZOffsetMs));
				var hora = timeStr;

				this.getModel().update(itemsAceitos[i].path, itemsAceitos[i].data, {
					success: function (oData, response) {
						sap.m.MessageBox.success("Aceite realizado com sucesso");
						var table = that.byId("table").getItems();

						for (var itm = 0; itm < itemsAceitos.length; itm++) {

							for (var count = 0; count < table.length; count++) {
								if (table[count].getCells()[2].getText() === itemsAceitos[itm].data.Reserva) {
									that.byId("table").getItems()[count].getCells()[8].setValue(" ");
									//sap.m.MessageBox.success(that.i18n.getText("updatesuccess"));
								}
							}
						}
					},
					error: function (oError) {
						sap.m.MessageBox.error("Não foi possível fazer o aceite");
						//sap.m.MessageBox.error(that.i18n.getText("updateerror"));
					}
				});
				// $.ajax({
				// 	url: "/sap/opu/odata/sap/ZGWCBMM_ACEITE_RESERVA_SRV/ZET_CBMM_CF_ACEITEConsultaSet(Reserva='" + itemsAceitos[
				// 			i].data.Reserva + "',Item='" + itemsAceitos[i].data.Item +
				// 		"',Data='" + itemsAceitos[i].data.DtNecessidade + "',Hora=time'" + hora + "')/Photo",
				// 	type: "POST",
				// 	headers: {
				// 		"content-type": "image/png",
				// 		"X-CSRF-Token": that.csrfToken
				// 	},
				// 	data: photoAceitos[i].Value.substr(22),
				// 	success: function(oData, response) {
				// 	},
				// 	error: function(oError) {
				// 	}
				// });

			}
		}

		// this.getModel().submitChanges({
		// 	groupId: "registroFotos",
		// 	success: function(oData, response) {
		// 		sap.m.MessageBox.success(that.i18n.getText("photosuccess"));
		// 	},
		// 	error: function(oError) {
		// 		sap.m.MessageBox.error(that.i18n.getText("photoerror"));

		// 	}
		// });
		// }

	});
});