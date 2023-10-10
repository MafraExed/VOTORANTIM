sap.ui.define([
	"Y5GL_EC_CAD2/Y5GL_EC_CAD2/controller/BaseController",
	"sap/ui/Device",
	"sap/m/Dialog",
	"sap/m/Button"
], function (BaseController, Device, Dialog, Button) {
	"use strict";

	return BaseController.extend("Y5GL_EC_CAD2.Y5GL_EC_CAD2.controller.DEPENDENTES", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Y5GL_EC_CAD2.Y5GL_EC_CAD2.view.DEPENDENTES
		 */
		onInit: function () {
			this.getRouter().getRoute("DEPENDENTES").attachPatternMatched(this.onRefreshList, this);
		},

		onRefreshList: function () {
			var lista = this.getView().byId("list");
			var oListBinding = lista.getBinding("items");
			oListBinding.refresh(true);
		},

		onSelectionChange: function (oEvent) {
			var oList = oEvent.getSource(),
				bSelected = oEvent.getParameter("selected");

			// skip navigation when deselecting an item in multi selection mode
			if (!(oList.getMode() === "MultiSelect" && !bSelected)) {
				// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
				this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
			}
		},

		_showDetail: function (oItem) {
			var bReplace = !Device.system.phone;
			var Zdesc = "DepententeDetail";
			var Pernr = oItem.getBindingContext().getProperty("Pernr");
			var Subty = oItem.getBindingContext().getProperty("Subty");
			var Tipo = "V";
			var Objps = oItem.getBindingContext().getProperty("Objps");
			if (Objps === "") {
				Objps = "0";
			}
			var Icnum = oItem.getBindingContext().getProperty("Icnum");
			if (Icnum === ""){
				Icnum = "99";
			}
			
			var Favor = oItem.getBindingContext().getProperty("Favor");
			this.getRouter().navTo(Zdesc, {
				Pernr: Pernr,
				Subty: Subty,
				Objps: Objps,
				Tipo: Tipo,
				Favor: Favor,
				Icnum: Icnum
			}, bReplace);
		},

		addDependentes: function (oItem) {
			var Pernr = "0";
			var Tipo = "A";
			var Objps = "0";
			var Subty = "-";
			var Favor = "-";
			var Zdesc = "DependentesAdd";
			var Cpf = "-";
			this.getRouter().navTo(Zdesc, {
				Pernr: Pernr,
				Subty: Subty,
				Objps: Objps,
				Tipo: Tipo,
				Favor: Favor,
				Icnum: Cpf
			});
		},

		onSave: function () {
			var _oComponent = this.getOwnerComponent();
			var oList = _oComponent.oListSelector._oList;
			var oListBinding = oList.getBinding("items");
			var oModel = this.getView().getModel();
			var Pernr = this.getView().byId("IdPernr").getValue();
			var Subty = this.getView().byId("IdParentesco").getSelectedKey();
			var Objps = this.getView().byId("IdObjps").getValue();
			Objps = "-";
			var Key = "/ZET_GLRH_LIST_DEPENDENTESSet(Pernr='" + Pernr + "',Subty='" + Subty + "',Objps='" + Objps + "',Tipo='S')";
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
			var vupload = " ";
			var file = vupload;

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
					press: function () {
						oModel.update(Key, oEntry, {
							success: function (oData, oResponse) {
								sap.m.MessageBox.success("Dependente enviado para aprova\xE7\xE3o com sucesso. Favor aguardar aprova\xE7\xE3o CSC.", {
									actions: [
										"OK",
										sap.m.MessageBox.Action.CLOSE
									],
									onClose: function (sAction) {
										dialog.close();
									}
								});
							},
							error: function (oError) {
								sap.m.MessageBox.error("Erro ao chamar o servi\xE7o");
							}
						});
						dialog.close();
					}
				}),
				endButton: new Button({
					text: "N\xE3o",
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
					oListBinding.refresh(true);
					this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
					this.getRouter().navTo("master");
				}
			});
			dialog.open();
			this.getRouter().navTo("master");

		},

		formatterStateStatus: function (oValue) {
			switch (oValue) {
			case "A":
				return "Success";
				break;
			case "X":
				return "Error";
				break;
			}
		},

		formatterText: function (value) {
			switch (value) {
			case "A":
				return "Ativo";
				break;
			case "X":
				return "Bloqueado";
				break;
			}
		},

		onBackMaster: function () {
			this.getRouter().navTo("master");
		},

		_Confirme_Dependete: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var chave = oSelectedItem.getBindingContextPath();
			var Zdesc = "DepententeDetail";
			var separador = chave.split(",");

			var Pernr = separador[4];
			Pernr = Pernr.split("=");
			Pernr = Pernr[1];
			while (Pernr.indexOf("'") != -1) {
				Pernr = Pernr.replace("'", "");
			}

			var Subty = separador[5];
			Subty = Subty.split("=");
			Subty = Subty[1];
			while (Subty.indexOf("'") != -1) {
				Subty = Subty.replace("'", "");
			}
			
			var CPF = separador[2];
			CPF = CPF.split("=");
			CPF = CPF[1];
			while (CPF.indexOf("'") != -1) {
				CPF = CPF.replace("'", "");
			}
			
			if(CPF === "" || CPF === undefined || CPF === "0" ){
				CPF = " ";
			}

			var Objps = separador[3];
			Objps = Objps.split("=");
			Objps = Objps[1];
			while (Objps.indexOf("'") != -1) {
				Objps = Objps.replace("'", "");
			}
			
			if (Objps === ""){
				Objps = "0";
			}

			var Tipo = "E";
			
			var Favor = separador[1];
			Favor = Favor.split("=");
			Favor = Favor[1];
			while (Favor.indexOf("'") != -1) {
				Favor = Favor.replace("'", "");
			}
			
			this.getRouter().navTo(Zdesc, {
			 	Pernr: Pernr,
			 	Subty: Subty,
			 	Objps: Objps,
			 	Tipo: Tipo,
			 	Favor: Favor,
			 	Icnum: CPF,
			 	Chamado: "0"
			 });
		},

		onExcluir: function () {
			if (!this._valueHelpDialog1) {
				this._valueHelpDialog1 = sap.ui.xmlfragment("Y5GL_EC_CAD2.Y5GL_EC_CAD2.view.Dependente", this);
				this.getView().addDependent(this._valueHelpDialog1);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog1.open();
		},
		
		formatterIcon: function (oValue) {
			var sRootPath = jQuery.sap.getModulePath("Y5GL_EC_CAD2.Y5GL_EC_CAD2");
			var sImagePath = sRootPath + "/Icones/DEP_DETAIL.png";
			return sImagePath;
		}
	});

});