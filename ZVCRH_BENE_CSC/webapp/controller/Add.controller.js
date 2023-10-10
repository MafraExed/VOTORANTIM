/*global location */
sap.ui.define([
	"Y5GL_CADASTRO/Y5GL_CADASTRO/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ZVCRH_VISAO_CSC/ZVCRH_VISAO_CSC/model/formatter",
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/m/Text',
	'sap/ui/core/Fragment'
], function(BaseController, JSONModel, formatter, Dialog, Button, Text, Fragment) {
	"use strict";

	return BaseController.extend("ZVCRH_VISAO_CSC.ZVCRH_VISAO_CSC.controller.Add", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function() {
			this.getRouter().getRoute("Add").attachPatternMatched(this._onAdd, this);
		},
		_onAdd: function() {
			// Busca chave.
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
			this.getView().byId("IdonVoltar").setVisible(false);

			this.getView().byId("IdMsg").setVisible(false);

			this.getView().byId("IdParentesco").setValue();
			this.getView().byId("IdFavor").setValue();
			this.getView().byId("IdFanam").setValue();
			this.getView().byId("IdFgbdt").setValue();
			this.getView().byId("IdSexo").setValue();
			this.getView().byId("IdZzestciv").setValue();
		},

		onEnviar: function() {
			var _oComponent = this.getOwnerComponent();
			var oList = _oComponent.oListSelector._oList;
			var oListBinding = oList.getBinding("items");
			var oModel = this.getView().getModel();
			var Pernr = this.getView().byId("IdPernr").getValue();
			var Subty = this.getView().byId("IdSubty").getValue();
			var Objps = this.getView().byId("IdObjps").getValue();
			var Key = "/ZET_VCRH_LIST_DEPENDENTESSet(Pernr='" + Pernr + "',Subty='" + Subty + "',Objps='" + Objps + "',Tipo='U')";
			var oEntry = {};
			oEntry.Parentesco = this.getView().byId("IdParentesco").getValue();
			oEntry.Favor = this.getView().byId("IdFavor").getValue();
			oEntry.Fanam = this.getView().byId("IdFanam").getValue();
			oEntry.Fgbdt = this.getView().byId("IdFgbdt").getValue();
	//		while (oEntry.Fgbdt.indexOf("-") != -1)
	//			oEntry.Fgbdt = oEntry.Fgbdt.replace("-", "");
			oEntry.Sexo = this.getView().byId("IdSexo").getValue();
			oEntry.Zzestciv = this.getView().byId("IdZzestciv").getSelectedKey();

			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: "Confirma o envio do novo dependente para aprovação?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function() {
						oModel.update(Key, oEntry, {
							success: function(oData, oResponse) {
								sap.m.MessageBox.success("Dependente enviado para aprovação com sucesso.", {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function(sAction) {
										dialog.close();
									}
								});
							},
							error: function(oError) {
								sap.m.MessageBox.error("Erro ao chamar o serviço");
							}
						});
						dialog.close();
					}
				}),
				endButton: new Button({
					text: "Não",
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
					oListBinding.refresh(true);	
					this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
				}
			});
			dialog.open();
		},

		onAddDoc: function(evt) {
			
			if (this._oDialogPhoto) {
				this._oDialogPhoto.destroy();
			}
			
			if (!this._oDialogPhoto) {
				this._oDialogPhoto = sap.ui.xmlfragment("fragmentPhoto", "ZVCRH_VISAO_CSC.ZVCRH_VISAO_CSC.view.Foto", this);
				this.getView().addDependent(this._oDialogPhoto);
				this._oDialogPhoto.open();
			}
			
		},
		
		closePhoto: function(){
			this._oDialogPhoto.destroy();   
			this._oDialogPhoto = undefined;
			Fragment.byId("fragmentAceite", "btnClose").setEnabled(true);
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogPhoto);
		},
		
		onSnapshot: function(evt){
			 for (var i = 0; i < this.photoAceitos.length; i++) {
				this.photoAceitos[i].Value = evt.getParameter("image");
			}
			sap.m.MessageBox.success(this.i18n.getText("snapshot"));
			Fragment.byId("fragmentAceite", "btnClose").setEnabled(true);
		},
		
		onSave: function(evt) {
			this.csrfToken = this.getModel().getSecurityToken();
			//Check CSRF from ODATA

			if (Fragment.byId("fragmentAceite", "input1").getValue() && Fragment.byId("fragmentAceite", "input2").getValue()) {
				for (var i = 0; i < this.itemsAceitos.length; i++) {
					this.itemsAceitos[i].data.Login = Fragment.byId("fragmentAceite", "input1").getValue();
					this.itemsAceitos[i].data.Matricula = Fragment.byId("fragmentAceite", "input2").getValue();
					this.photoAceitos[i].Login = Fragment.byId("fragmentAceite", "input1").getValue();
					this.photoAceitos[i].Matricula = Fragment.byId("fragmentAceite", "input2").getValue();
				}
				this.updateAceite(this.itemsAceitos, this.photoAceitos);
				this._oDialog.close();
			}
		}
		

	});

});