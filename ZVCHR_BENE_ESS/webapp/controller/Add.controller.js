sap.ui.define([
	"ZVCRH_VISAO_EMPREGADO/ZVCRH_VISAO_EMPREGADO/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ZVCRH_VISAO_EMPREGADO/ZVCRH_VISAO_EMPREGADO/model/formatter",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text",
	"sap/ui/core/Fragment",
	"sap/m/UploadCollectionParameter"
], function(BaseController, JSONModel, formatter, Dialog, Button, Text, Fragment) {
	"use strict";
	
	var vupload=""; 
	return BaseController.extend("ZVCRH_VISAO_EMPREGADO.ZVCRH_VISAO_EMPREGADO.controller.Add", {
		formatter: formatter,
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */
		onInit: function() {
			this.getRouter().getRoute("Add").attachPatternMatched(this._onAdd, this);
			vupload = '';
		

		},
		_onAdd: function() {
			// Busca chave.
			this.getView().byId("IdonDoc").setVisible(false);
			vupload = "";
			var oModelBusca = new sap.ui.model.json.JSONModel();
			var serviceUrl =
				"/sap/opu/odata/sap/ZGWVCHR_LIST_DEPENDENTES_SRV/ZET_VCRH_LIST_DEPENDENTESSet(Pernr='-',Subty='-',Objps='-',Tipo='-')";
			oModelBusca.loadData(serviceUrl, null, false, "GET", false, false, null);
			var Pernr = oModelBusca.oData.d.Pernr;
			var Subty = oModelBusca.oData.d.Subty;
			var Objps = oModelBusca.oData.d.Objps;
			// Busca chave.
			this.getView().byId("IdPernr").setValue(Pernr);
			this.getView().byId("IdSubty").setValue(Subty);
			this.getView().byId("IdObjps").setValue(Objps);
			this.getView().byId("IdonAddDoc").setVisible(true);
			this.getView().byId("IdonEnviar").setVisible(true);
			this.getView().byId("IdonDoc").setVisible(false);
			this.getView().byId("IdonVoltar").setVisible(true);
			this.getView().byId("IdMsg").setVisible(false);
			this.getView().byId("IdParentesco").setValue();
			this.getView().byId("IdFavor").setValue();
			this.getView().byId("IdFanam").setValue();
			this.getView().byId("IdFgbdt").setValue();
			this.getView().byId("IdSexo").setValue();
			this.getView().byId("IdZzestciv").setValue();
		
		
		},
		onEnviar: function() {
			var that = this;
			var _oComponent = this.getOwnerComponent();
			var oList = _oComponent.oListSelector._oList;
			var oListBinding = oList.getBinding("items");
			var oModel = this.getView().getModel();
			var Pernr = this.getView().byId("IdPernr").getValue();
			var Subty = this.getView().byId("IdParentesco").getSelectedKey();
			var Objps = this.getView().byId("IdObjps").getValue();
			var Key = "/ZET_VCRH_LIST_DEPENDENTESSet(Pernr='" + Pernr + "',Subty='" + Subty + "',Objps='" + Objps + "',Tipo='U')";
			var oEntry = {};

		

			oEntry.Parentesco = this.getView().byId("IdParentesco").getSelectedKey();
			if (oEntry.Parentesco === "") {
				this.getView().byId("IdParentesco").setValueState("Error");
				sap.m.MessageBox.error("Selecione o Grau de Parentesco.");
				return;
			} else {
				this.getView().byId("IdParentesco").setValueState("Success");
			}
			oEntry.Favor = this.getView().byId("IdFavor").getValue();
			if (oEntry.Favor === "") {
				this.getView().byId("IdFavor").setValueState("Error");
				sap.m.MessageBox.error("Preencher o Nome.");
				return;
			} else {
				this.getView().byId("IdFavor").setValueState("Success");
			}
			oEntry.Fanam = this.getView().byId("IdFanam").getValue();
			if (oEntry.Fanam === "") {
				this.getView().byId("IdFanam").setValueState("Error");
				sap.m.MessageBox.error("Preencher o sobrenome.");
				return;
			} else {
				this.getView().byId("IdFanam").setValueState("Success");
			}
			oEntry.Fgbdt = this.getView().byId("IdFgbdt").getValue();
			if (oEntry.Fgbdt === "") {
				this.getView().byId("IdFgbdt").setValueState("Error");
				sap.m.MessageBox.error("Selecione data de nascimento.");
				return;
			} else {
				this.getView().byId("IdFgbdt").setValueState("Success");
			}
			//	while (oEntry.Fgbdt.indexOf("-") != -1)
			//	oEntry.Fgbdt = oEntry.Fgbdt.replace("-", "");
			oEntry.Sexo = this.getView().byId("IdSexo").getSelectedKey();
			if (oEntry.Sexo === " ") {
				this.getView().byId("IdSexo").setValueState("Error");
				sap.m.MessageBox.error("Selecione o sexo.");
				return;
			} else {
				this.getView().byId("IdSexo").setValueState("Success");
			}
			oEntry.Zzestciv = this.getView().byId("IdZzestciv").getSelectedKey();
			if (oEntry.Zzestciv === " ") {
				this.getView().byId("IdZzestciv").setValueState("Error");
				sap.m.MessageBox.error("Selecione o Estado Civil.");
				return;
			} else {
				this.getView().byId("IdZzestciv").setValueState("Success");
			}
			
				var file = 	vupload;

			if (file === "") {

				sap.m.MessageBox.error("Anexo é obrigatório");
				return;

			}
			var dialog = new Dialog({
				title: "Confirma\xE7\xE3o",
				type: "Message",
				content: new Text({
					text: "Confirma o envio do novo dependente para aprova\xE7\xE3o?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function() {
						oModel.update(Key, oEntry, {
							success: function(oData, oResponse) {
								sap.m.MessageBox.success("Dependente enviado para aprova\xE7\xE3o com sucesso. Favor aguardar aprova\xE7\xE3o CSC.", {
									actions: [
										"OK",
										sap.m.MessageBox.Action.CLOSE
									],
									onClose: function(sAction) {
										dialog.close();
									}
								});
							},
							error: function(oError) {
								sap.m.MessageBox.error("Erro ao chamar o servi\xE7o");
							}
						});
						dialog.close();
					}
				}),
				endButton: new Button({
					text: "N\xE3o",
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
					oListBinding.refresh(true);
					this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
					this.getRouter().navTo("master");
				}
			});
			dialog.open();
			this.getRouter().navTo("master");
		},
		onAddDoc: function(evt) {
			this.getView().byId("IdonDoc").setVisible(false);
			var oEntry = {};
			oEntry.Subty = this.getView().byId("IdParentesco").getSelectedKey();
			if (oEntry.Subty === "") {
				this.getView().byId("IdParentesco").setValueState("Error");
				sap.m.MessageBox.error("Selecione o Grau de Parentesco antes de carregar o documento.");
				return;
			} else {
				this.getView().byId("IdParentesco").setValueState("Success");
			}
			oEntry.Favor = this.getView().byId("IdFavor").getValue();
			if (oEntry.Favor === "") {
				this.getView().byId("IdFavor").setValueState("Error");
				sap.m.MessageBox.error("Preencher o Nome antes de carregar o documento.");
				return;
			} else {
				this.getView().byId("IdFavor").setValueState("Success");
			}
			var oModel = new sap.ui.model.json.JSONModel(oEntry);
			this.getView().setModel(oModel, "ZFOTO");
			var that = this;
			if (that._oDialogUpload) {
				that._oDialogUpload = "";
			}
			if (!that._oDialogUpload) {
				that._oDialogUpload = sap.ui.xmlfragment("fragmentUpload", "ZVCRH_VISAO_EMPREGADO.ZVCRH_VISAO_EMPREGADO.view.Upload", that);
				that.getView().addDependent(that._oDialogUpload);
				that._oDialogUpload.open();

				var arquivo = that.getView().byId("fragmentUpload-UploadCollection");

				//var browseField = document.getElementById("uploadForm").file;
				//    browseField.click();
				//	sap.ui.getCore().byId("UploadCollection");
				arquivo.click();

			}
		},
		openfile: function(oEvent) {
			sap.ui.getCore().byId($('#navigation button').eq(0).attr("id")).firePress();
		},
		onSnapshot: function(oEvent) {
			var vthis = this;
			var sSnapshot = oEvent.getParameter("image");
			var Pernr = this.getView().byId("IdPernr").getValue();
			var Subty = this.getView().byId("IdSubty").getValue();
			var Favor = this.getView().byId("IdObjps").getValue();
			this.csrfToken = this.getModel().getSecurityToken();
			var atb = sSnapshot.substr(22);
			atb = window.atob(atb);
			$.ajax({
				url: "/sap/opu/odata/sap/ZGWVCHR_LIST_DEPENDENTES_SRV/ZET_VCRH_ARQU_UI5Set(Pernr='" + Pernr + "',Subty='" + Subty + "',Favor='" +
					Favor + "')/$value",
				type: "PUT",
				headers: {
					"Content-Type": "image/jpeg",
					"X-CSRF-Token": this.csrfToken
				},
				data: atb,
				success: function(oData, response) {},
				error: function(oError) {}
			});
			var varquivo = "/ZET_VCRH_ARQU_UI5Set(Pernr='" + Pernr + "',Subty='" + Subty + "',Favor='" + Favor + "')/$value";
			var oModel = vthis.getView().getModel().sServiceUrl + varquivo;
			window.parent.location = oModel;
		},
		handleUploadPress: function(oEvent) {
			var fileUploader = Fragment.byId("fragmentUpload", "fileUploader");
			var Pernr = this.getView().byId("IdPernr").getValue();
			var Subty = this.getView().byId("IdParentesco").getValue();
			var Favor = this.getView().byId("IdObjps").getValue();
			this.csrfToken = this.getModel().getSecurityToken();
			/*				
			$.ajax({
				url: "/sap/opu/odata/sap/ZGWVCHR_LIST_DEPENDENTES_SRV/ZET_VCRH_ARQU_UI5Set(Pernr='" + Pernr + "',Subty='" + Subty + "',Favor='" +
					Favor + "')/$value",
				type: "PUT",
				headers: {
					"Content-Type": "image/jpeg",
					"X-CSRF-Token": this.csrfToken
				},
				data: fileUploader,
				success: function(oData, response) {

				},
				error: function(oError) {}
			});*/
			fileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
				name: "slug",
				value: fileUploader.getValue()
			}));
			fileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
				name: "x-csrf-token",
				value: this.csrfToken
			}));
			fileUploader.upload();
		},
		closeDialog: function() {
			if (this._oDialogPhoto) {
				var oCamera = Fragment.byId("fragmentPhoto", "IdCamera");
				oCamera.stopCamera();
				this._oDialogPhoto.close();
				this._oDialogPhoto.destroy();
				this._oDialogPhoto = "";
			}
			if (this._oDialogUpload) {
				this._oDialogUpload.close();
				this._oDialogUpload.destroy();
				this._oDialogUpload = "";
			}
		},
		/**
		 *@memberOf ZVCRH_VISAO_EMPREGADO.ZVCRH_VISAO_EMPREGADO.controller.Add
		 */
		onVoltar: function() {
			//This code was generated by the layout editor.
			this.getRouter().navTo("master");
		},
		onChange: function(oEvent) {
			// Stellen das CSRF Token wenn ein File hinzugefügt ist
			//
			var oUploadCollection = this.getView().byId("UploadCollection");

			var oEntry = {};
			oEntry.Subty = this.getView().byId("IdParentesco").getSelectedKey();
			if (oEntry.Subty === "") {
				this.getView().byId("IdParentesco").setValueState("Error");
				sap.m.MessageBox.error("Selecione o Grau de Parentesco antes de carregar o documento.");
				oUploadCollection.Cancel();
				return;
			} else {
				this.getView().byId("IdParentesco").setValueState("Success");
			}
			oEntry.Favor = this.getView().byId("IdFavor").getValue();
			if (oEntry.Favor === "") {
				this.getView().byId("IdFavor").setValueState("Error");
				sap.m.MessageBox.error("Preencher o Nome antes de carregar o documento.");
				oUploadCollection.Cancel();
				return;
			} else {
				this.getView().byId("IdFavor").setValueState("Success");
			}
			//

			var oUploadCollection = oEvent.getSource();
			var _csrfToken = this.getView().getModel().oHeaders["x-csrf-token"];
			var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
				name: "x-csrf-token",
				value: _csrfToken
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
		},
		onBeforeUploadStarts: function(oEvent) {

			var sSlug = oEvent.getParameter("fileName");
			var Pernr = this.getView().byId("IdPernr").getValue();
			var Subty = this.getView().byId("IdParentesco").getSelectedKey();
			var Favor = this.getView().byId("IdFavor").getValue();
			// Stellen die Kopf Parameter slug
			var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
				name: "slug",
				value: sSlug + "$" + Pernr + "$" + Subty + "$" + Favor
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug); //			_busyDialog.open();
		},
		onuploadComplete: function(oEvent) {
			this.getView().getModel().refresh();
			//		this._oDialogUpload.close();
			//		this._oDialogUpload.destroy();
			//		this._oDialogUpload = "";
			sap.m.MessageBox.success("Arquivo Anexado com Sucesso!");
			this.getView().byId("IdonDoc").setVisible(true);
			vupload = 'X';

		},
		/**
		 *@memberOf ZVCRH_VISAO_EMPREGADO.ZVCRH_VISAO_EMPREGADO.controller.Add
		 */
		getanexo: function() {
			//This code was generated by the layout editor.//This code was generated by the layout editor.
			var vthis = this;
			var Pernr = this.getView().byId("IdPernr").getValue();
			var Subty = this.getView().byId("IdParentesco").getSelectedKey();
			var Favor = this.getView().byId("IdFavor").getValue();
			var varquivo = "/ZET_VCRH_ARQU_UI5Set(Pernr='" + Pernr + "',Subty='" + Subty + "',Favor='" + Favor + "')/$value";
			var oModel = vthis.getView().getModel().sServiceUrl + varquivo;

			//	window.parent.location = oModel;
			window.open(oModel, "_blank");
		}
	});
});