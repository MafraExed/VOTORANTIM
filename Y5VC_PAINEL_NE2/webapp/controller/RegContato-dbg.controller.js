sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/m/Button',
	"sap/m/UploadCollectionParameter",
	"sap/ui/Device",
	"sap/m/Text",
	"sap/m/MessageBox",
	"sap/m/Dialog",
	"../model/formatter"
], function (Controller, JSONModel, Filter, FilterOperator, Button, UploadCollectionParameter, Device, Text, MessageBox, Dialog,
	formatter) {
	"use strict";
	var kunnr, knkli, stcd1, stcd2, kkber, Fikrs, Belnr, Bukrs, Buzei, Gjahr, geral;
	return Controller.extend("Y5VC_PAINEL_NE2.Y5VC_PAINEL_NE2.controller.RegContato", {
		formatter: formatter,

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Y5VC_PAINEL_NE2.Y5VC_PAINEL_NE2.view.Items
		 */
		onInit: function () {
			this.getView().setModel(new JSONModel(Device), "device");
			// var iOriginalBusyDelay,
			// 	oViewModel = new JSONModel({
			// 		busy: true,
			// 		delay: 0
			// 	});

			let oJsonModel = new JSONModel([]);
			this.getView().setModel(oJsonModel, "statusCobranca");

			oJsonModel = new JSONModel([]);
			this.getView().setModel(oJsonModel, "detalheStatus");

			this.getRouter().getRoute("RegContato").attachPatternMatched(this._onObjectMatched, this);

			var oUploadCollection = this.getView().byId('UploadCollection');
			oUploadCollection.setUploadUrl("/sap/opu/odata/sap/ZGWVCFI_PAINEL_NEGOCIACAO_SRV/ZET_VCFI_REG_CONTSet");
			// var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZGWVCFI_PAINEL_NEGOCIACAO_SRV", false);
			// this.getView().setModel(oModel);

			// // Store original busy indicator delay, so it can be restored later on
			// iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			// this.setModel(oViewModel, "EditarContatosView");
			// this.getOwnerComponent().getModel().metadataLoaded().then(function () {
			// 	// Restore original busy indicator delay for the object view
			// 	oViewModel.setProperty("/delay", iOriginalBusyDelay);
			// });

		},

		_onObjectMatched: function (oEvent) {
			kunnr = oEvent.getParameter("arguments").Kunnr;
			knkli = oEvent.getParameter("arguments").Knkli;
			stcd1 = oEvent.getParameter("arguments").stcd1;
			stcd2 = oEvent.getParameter("arguments").stcd2;
			kkber = oEvent.getParameter("arguments").Kkber;
			Fikrs = oEvent.getParameter("arguments").Fikrs;
			Belnr = oEvent.getParameter("arguments").Belnr;
			Bukrs = oEvent.getParameter("arguments").Bukrs;
			Buzei = oEvent.getParameter("arguments").Buzei;
			Gjahr = oEvent.getParameter("arguments").Gjahr;
			geral = oEvent.getParameter("arguments").Geral;
			if (geral !== "X") {
				geral = "";
			}
			if (geral === 'X') {
				this.byId("btnOnOff").setState(false);
				this.byId("btnOnOff").setEnabled(false);
				this.byId("IdDataProm").setEditable(false);
				this.byId("IdObs2").setEditable(false);
				this.byId("IDforme41").setVisible(true);
			} else {
				this.byId("btnOnOff").setState(false);
				this.byId("btnOnOff").setEnabled(true);
				this.byId("IdDataProm").setEditable(false);
				this.byId("IdObs2").setEditable(false);
				this.byId("IDforme41").setVisible(false);
			}


			var today = new Date();
			var dd = String(today.getDate()).padStart(2, '0');
			var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
			var yyyy = today.getFullYear();

			today = yyyy + '-' + mm + '-' + dd;

			var hora = new Date();
			hora = hora.getHours();
			var minuto = new Date();
			minuto = minuto.getMinutes();

			if (hora < 10) {
				hora = "0" + hora;
			}

			if (minuto < 10) {
				minuto = "0" + minuto;
			}

			hora = hora + ":" + minuto;

			var usuario = sap.ushell.Container.getUser().getId();

			this.byId("idSel1").setSelectedKey("");
			this.byId("idSel2").setSelectedKey("");
			this.byId("idSel3").setSelectedKey("");
			this.byId("IdData").setValue(today);
			this.byId("IdHora").setValue(hora);
			this.byId("IdUser").setValue(usuario);
			this.byId("IdPessoa").setValue("");
			this.byId("Idtel").setValue("");
			this.byId("Idemail").setValue("");
			this.byId("idText").setValue("");
			this.byId("IdDataProm").setValue("");
			this.byId("IdObs2").setValue("");

			this.getStatusCobranca(Fikrs);
			this.getDetalheStatus(Fikrs);
		},

		getStatusCobranca: function (fikrs) {

			const filter = new Filter({
				path: "Fikrs",
				operator: FilterOperator.EQ, // required from "sap/ui/model/FilterOperator"
				value1: fikrs,
			});

			const oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGWVCFI_PAINEL_NEGOCIACAO_SRV/");

			oModel.read("/ZET_VCFI_RESULTSet", {
				filters: [filter],
				success: function (oData) {
					this.getModel("statusCobranca").setProperty("/", oData.results)
				}.bind(this),
			});
		},

		getDetalheStatus: function (fikrs) {

			const filter = new Filter({
				path: "Fikrs",
				operator: FilterOperator.EQ, // required from "sap/ui/model/FilterOperator"
				value1: fikrs,
			});

			const oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGWVCFI_PAINEL_NEGOCIACAO_SRV/");

			oModel.read("/ZET_VCFI_RESULT_DETSet", {
				filters: [filter],
				success: function (oData) {
					this.getModel("detalheStatus").setProperty("/", oData.results)
				}.bind(this),
			});
		},

		onStartUpload: function (oEvent) {
			var oModel = this.getView().getModel();
			var oParameters = {};

			var oUploadCollection = this.byId("UploadCollection");
			//var oTextArea = this.byId("idText");
			//	var cFiles = oUploadCollection.getItems().length;
			//var uploadInfo = cFiles + " file(s)";

			//if (cFiles > 0) {
			var sel1 = this.byId("idSel1").getSelectedKey();
			var sel2 = this.byId("idSel2").getSelectedKey();
			var sel3 = this.byId("idSel3").getSelectedKey();
			//var data = this.byId("IdData").getDateValue().getDate() + "/" + this.byId("IdData").getDateValue().getMonth() + "/" + this.byId("IdData").getDateValue().getFullYear();
			var data = this.byId("IdData").getValue();
			var hora = this.byId("IdHora").getValue();
			var user = this.byId("IdUser").getValue();
			var pessoa = this.byId("IdPessoa").getValue();
			var tel = this.byId("Idtel").getValue();
			var email = this.byId("Idemail").getValue();
			var text = this.byId("idText").getValue();
			var text2 = text.replace(/\n/, ';');
			var text2 = text2.replace(/\n\n/, ';;');
			var este = this;
			if (this.byId("btnOnOff").getState() === true) {
				var coment = this.byId("IdObs2").getValue();
				var dataProm = this.byId("IdDataProm").getValue();
			}

			if (!sel1) {
				sap.m.MessageToast.show("Forma de contato não foi preenchido");
				return;
			}

			if (!sel2) {
				sap.m.MessageToast.show("Status de cobrança não foi preenchido");
				return;
			}
			if (!data) {
				sap.m.MessageToast.show("Data não foi preenchido");
				return;
			}
			if (!hora) {
				sap.m.MessageToast.show("Hora não foi preenchido");
				return;
			}
			if (!user) {
				sap.m.MessageToast.show("'Executado por:' não foi preenchido");
				return;
			}

			if (!text) {
				sap.m.MessageToast.show("o campo Nota não foi preenchido");
				return;
			}

			if (this.byId("btnOnOff").getState() === true) {
				if (!this.byId("IdDataProm").getValue()) {
					sap.m.MessageToast.show("Data para promessa de pagamento obrigatória");
					return;
				}
			}

			var key = String(Math.floor(Math.random() * 10)) + String(Math.floor(Math.random() * 10)) + String(Math.floor(Math.random() * 10)) +
				String(Math.floor(Math.random() * 10)) + String(Math.floor(Math.random() * 10));

			var items = oUploadCollection.getItems();
			if (items.length > 0) {
				var sSlug = key + "$" + Fikrs + "$" + Belnr + "$" + Bukrs + "$" + Buzei + "$" + Gjahr + "$" + sel1 + "$" + sel2 + "$" + sel3 + "$" +
					data +
					"$" + hora + "$" + user + "$" + pessoa + "$" + tel + "$" + geral +
					"$" + email + "$" + text2 + "$" + oUploadCollection.getItems()[0].getFileName() + "$" + coment + "$" + dataProm;

				var slug = encodeURI(sSlug);
				var oCustomerHeaderSlug = new UploadCollectionParameter({
					name: "slug",
					value: slug
				});
				oUploadCollection.addHeaderParameter(oCustomerHeaderSlug);

				var a = setTimeout(oUploadCollection.upload(), 2000);

			} else {
				sSlug = key + "$" + Fikrs + "$" + Belnr + "$" + Bukrs + "$" + Buzei + "$" + Gjahr + "$" + sel1 + "$" + sel2 + "$" + sel3 + "$" +
					data +
					"$" + hora + "$" + user + "$" + pessoa + "$" + tel + "$" + geral +
					"$" + email + "$" + text2 + "$" + "X" + "$" + coment + "$" + dataProm;

				oParameters = {};
				oParameters.Knkli = knkli;
				oParameters.Kunnr = kunnr;
				oParameters.Fikrs = Fikrs;
				oParameters.Belnr = Belnr;
				oParameters.Bukrs = Bukrs;
				oParameters.Buzei = Buzei;
				oParameters.Gjahr = Gjahr;
				oParameters.FormCont = sel1;
				oParameters.Resultado = sel2;
				oParameters.ResultDet = sel3;
				oParameters.Data = data;
				oParameters.Hora = hora;
				oParameters.User = user;
				oParameters.PessoaCont = pessoa;
				oParameters.NumTel = tel;
				oParameters.Email = email;
				oParameters.Nota = text2;
				oParameters.RegGeral = geral;
				oParameters.Comentario = coment;
				oParameters.DataProm = dataProm;

				var chave = "/ZET_VCFI_REG_CONTSet(Fikrs='" + oParameters.Fikrs + "',Knkli='" + oParameters.Knkli + "')";
				oModel.update(chave, oParameters, {
					success: function (oData, oResponse) {
						// var hdrMessage = oResponse.headers["sap-message"];
						// var hdrMessageObject = JSON.parse(hdrMessage);
						// sap.m.MessageBox.warning(hdrMessageObject.message);
						//oListBinding.refresh(true);
						// if (!sTexto) {
						// 	sTexto = "Tasks criadas com sucesso";
						// 	//smartTable.rebindTable("e");
						// 	//este.getView().getModel().refresh();

						// 	MessageBox.show(sTexto);
						// }
					},
					error: function (oError) {
						// if (!sTexto) {
						// 	for (i = 0; i < JSON.parse(oError.responseText).error.innererror.errordetails.length; i++) {
						// 		var message = "- " + JSON.parse(oError.responseText).error.innererror.errordetails[i].message + "\n";
						// 		sTexto = sTexto + message;
						// 	}
						// 	sap.m.MessageBox.error(sTexto);
						// }
						//sap.m.MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
					}
				});

			}

			//oUploadCollection.upload();

			// if (oTextArea.getValue().length === 0) {
			// 	uploadInfo = uploadInfo + " without notes";
			// } else {
			// 	uploadInfo = uploadInfo + " with notes";
			// }

			var texto = "Registro efetuado com sucesso";
			var dialog = new Dialog({
				title: "Sucesso",
				type: "Message",
				content: new Text({
					text: texto
				}),
				beginButton: new Button({
					text: "Ok",
					press: function () {

						este.getRouter().navTo("worklist");

						dialog.close();

					}
				}),

				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.open();

			//	sap.m.MessageToast.show("Method Upload is called (" + uploadInfo + ")");
			//	MessageBox.information("Uploaded " + uploadInfo);
			//	oTextArea.setValue("");
			//}
		},

		onBeforeUploadStarts: function (oEvent) {
			// Header Slug

			var oUploadCollection = this.byId("UploadCollection");
			var sel1 = this.byId("idSel1").getSelectedKey();
			var sel2 = this.byId("idSel2").getSelectedKey();
			var sel3 = this.byId("idSel3").getSelectedKey();
			//var data = this.byId("IdData").getDateValue().getDate() + "/" + this.byId("IdData").getDateValue().getMonth() + "/" + this.byId("IdData").getDateValue().getFullYear();
			var data = this.byId("IdData").getValue();
			var hora = this.byId("IdHora").getValue();
			var user = this.byId("IdUser").getValue();
			var pessoa = this.byId("IdPessoa").getValue();
			var tel = this.byId("Idtel").getValue();
			var email = this.byId("Idemail").getValue();
			var text = this.byId("idText").getValue();
			var text2 = text.replace(/\n/, ';');
			if (this.byId("btnOnOff").getState() === true) {
				var coment = this.byId("IdObs2").getValue();
				var dataProm = this.byId("IdDataProm").getValue();
			}

			if (!sel1) {
				sap.m.MessageToast.show("Forma de contato não foi preenchido");
				return;
			}

			if (!sel2) {
				sap.m.MessageToast.show("Status de cobrança não foi preenchido");
				return;
			}
			if (!data) {
				sap.m.MessageToast.show("Data não foi preenchido");
				return;
			}
			if (!hora) {
				sap.m.MessageToast.show("Hora não foi preenchido");
				return;
			}
			if (!user) {
				sap.m.MessageToast.show("'Executado por:' não foi preenchido");
				return;
			}

			if (!text2) {
				sap.m.MessageToast.show("o campo Nota não foi preenchido");
				return;
			}

			if (this.byId("btnOnOff").getState() === true) {
				if (!this.byId("IdDataProm")) {
					sap.m.MessageToast.show("Data para promessa de pagamento obrigatória");
					return;
				}
			}

			var key = String(Math.floor(Math.random() * 10)) + String(Math.floor(Math.random() * 10)) + String(Math.floor(Math.random() * 10)) +
				String(Math.floor(Math.random() * 10)) + String(Math.floor(Math.random() * 10));

			var items = oUploadCollection.getItems();
			if (items.length > 0) {
				var sSlug = key + "$" + knkli + "$" + Fikrs + "$" + Belnr + "$" + Bukrs + "$" + Buzei + "$" + Gjahr + "$" + sel1 + "$" + sel2 +
					"$" +
					sel3 + "$" + data + "$" + hora + "$" + user + "$" + pessoa + "$" + tel + "$" + geral +
					"$" + email + "$" + text2 + "$" + oEvent.getParameter("fileName") + "$" + coment + "$" + dataProm + "$" + kunnr;
			} else {
				sSlug = key + "$" + kunnr + "$" + Fikrs + "$" + Belnr + "$" + Bukrs + "$" + Buzei + "$" + Gjahr + "$" + sel1 + "$" + sel2 + "$" +
					sel3 + "$" + data + "$" + hora + "$" + user + "$" + pessoa + "$" + tel + "$" + geral +
					"$" + email + "$" + text2 + "$" + "X" + "$" + coment + "$" + dataProm + "$" + kunnr;

			}

			var slug = encodeURI(sSlug);
			var oCustomerHeaderSlug = new UploadCollectionParameter({
				name: "slug",
				value: slug
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
			// setTimeout(function () {
			// 	sap.m.MessageToast.show("Event beforeUploadStarts triggered");
			// }, 4000);
		},

		onUploadComplete: function (oEvent) {
			var sUploadedFileName = oEvent.getParameter("files")[0].fileName;
			setTimeout(function () {
				var oUploadCollection = this.byId("UploadCollection");

				for (var i = 0; i < oUploadCollection.getItems().length; i++) {
					if (oUploadCollection.getItems()[i].getFileName() === sUploadedFileName) {
						oUploadCollection.removeItem(oUploadCollection.getItems()[i]);
						break;
					}
				}

				// delay the success message in order to see other messages before
				//	sap.m.MessageToast.show("Event uploadComplete triggered");
			}.bind(this), 8000);
		},

		OnOff: function (oEvent) {

			if (oEvent.getParameter("state") === false) {
				this.byId("IdDataProm").setEditable(false);
				this.byId("IdObs2").setEditable(false);
			} else if (oEvent.getParameter("state") === true) {
				this.byId("IdDataProm").setEditable(true);
				this.byId("IdObs2").setEditable(true);
			}
		},

		onChange: function (oEvent) {
			// var oUploadCollection = oEvent.getSource();
			// // Header Token
			// var oCustomerHeaderToken = new UploadCollectionParameter({
			// 	name: "x-csrf-token",
			// 	value: "securityTokenFromModel"
			// });
			// oUploadCollection.addHeaderParameter(oCustomerHeaderToken);

			var oUploadCollection = oEvent.getSource();
			var oModel = this.getView().getModel();
			oModel.refreshSecurityToken();
			var oHeaders = oModel.oHeaders;
			var sToken = oHeaders['x-csrf-token'];
			// Stellen das CSRF Token wenn ein File hinzugefügt ist
			var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
				name: "x-csrf-token",
				value: sToken
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);

		},

		OnResult: function (oEvent) {
			var idsel = this.byId("idSel2").getSelectedKey();
			var idsel3 = this.byId("idSel3").getBinding("items");
			var forma = new sap.ui.model.Filter("CodResult", sap.ui.model.FilterOperator.EQ, idsel);
			idsel3.filter([forma]);

			this.byId("idSel3").setEditable(true);
		},

		onSelectChange: function (oEvent) {
			var oUploadCollection = this.byId("UploadCollection");
			oUploadCollection.setShowSeparators(oEvent.getParameters().selectedItem.getProperty("key"));
		}

	});

});