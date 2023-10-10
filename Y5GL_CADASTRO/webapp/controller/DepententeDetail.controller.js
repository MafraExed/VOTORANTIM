sap.ui.define([
	"Y5GL_CADASTRO/Y5GL_CADASTRO/controller/BaseController",
	"sap/ui/Device",
	"Y5GL_CADASTRO/Y5GL_CADASTRO/model/formatter",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/ui/model/json/JSONModel"
], function (BaseController, Device, formatter, Button, Dialog, Text, JSONModel) {
	"use strict";

	var GrauParentesco;
	var Nome;
	var SobreNome;
	var DataNascimento;
	var Sexo;
	var EstadoCivil;

	return BaseController.extend("Y5GL_CADASTRO.Y5GL_CADASTRO.controller.DepententeDetail", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Y5GL_CADASTRO.Y5GL_CADASTRO.view.DepententeDetail
		 */
		onInit: function () {
			this.getRouter().getRoute("DepententeDetail").attachPatternMatched(this._onObjectMatched, this);
			this.getRouter().getRoute("DependentesAdd").attachPatternMatched(this._onAdd, this);
		},

		onVoltar: function () {
			var bReplace = !Device.system.phone;
			var Zdesc = "DEPENDENTES";
			this.getRouter().navTo(Zdesc, bReplace);
		},

		_onAdd: function (oEvent) {
			var Pernr = oEvent.getParameter("arguments").Pernr;
			var Subty = oEvent.getParameter("arguments").Subty;
			var Tipo = oEvent.getParameter("arguments").Tipo;
			var Objps = oEvent.getParameter("arguments").Objps;
			var Favor = oEvent.getParameter("arguments").Favor;
			var sObjectPath;

			// Retorna os campos para editaveis
			this.getView().byId("IdParentesco").setEditable(true);
			this.getView().byId("IdFavor").setEditable(true);
			this.getView().byId("IdFanam").setEditable(true);
			this.getView().byId("IdFgbdt").setEditable(true);
			this.getView().byId("IdSexo").setEditable(true);
			this.getView().byId("IdZzestciv").setEditable(true);
			this.getView().byId("IdSalvarDetailDep").setVisible(true);
			this.getView().byId("IdEditDetailDep").setVisible(false);
			this.getView().byId("IdCancelarDetailDep").setVisible(false);
			this.getView().byId("IdExcluirDetailDep").setVisible(false);
			this.getView().byId("IdParentesco").setValueState("None");
			this.getView().byId("IdFavor").setValueState("None");
			this.getView().byId("IdFanam").setValueState("None");
			this.getView().byId("IdFgbdt").setValueState("None");
			this.getView().byId("IdFgbdt").setValueState("None");
			this.getView().byId("IdSexo").setValueState("None");
			this.getView().byId("IdZzestciv").setValueState("None");

			// retorna os campos para editaveis

			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then(function () {
				sObjectPath = this.getModel().createKey("ZET_GLRH_DEPENDENTESSet", {
					Pernr: Pernr,
					Subty: Subty,
					Objps: Objps,
					Tipo: Tipo,
					Favor: Favor
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		onEdit: function () {
			GrauParentesco = this.getView().byId("IdParentesco").getSelectedKey();
			Nome = this.getView().byId("IdFavor").getValue();
			SobreNome = this.getView().byId("IdFanam").getValue();
			DataNascimento = this.getView().byId("IdFgbdt").getValue();
			Sexo = this.getView().byId("IdSexo").getValue();
			EstadoCivil = this.getView().byId("IdZzestciv").getSelectedKey();

			this.getView().byId("IdEditDetailDep").setVisible(false);
			this.getView().byId("IdSalvarDetailDep").setVisible(true);
			this.getView().byId("IdCancelarDetailDep").setVisible(true);
			this.getView().byId("IdParentesco").setEditable(true);
			this.getView().byId("IdFavor").setEditable(true);
			this.getView().byId("IdFanam").setEditable(true);
			this.getView().byId("IdFgbdt").setEditable(true);
			this.getView().byId("IdSexo").setEditable(true);
			this.getView().byId("IdZzestciv").setEditable(true);
		},

		onCancel: function () {
			this.getView().byId("IdCancelarDetailDep").setVisible(false);
			this.getView().byId("IdEditDetailDep").setVisible(true);
			this.getView().byId("IdSalvarDetailDep").setVisible(false);

			this.getView().byId("IdParentesco").setEditable(false);
			this.getView().byId("IdFavor").setEditable(false);
			this.getView().byId("IdFanam").setEditable(false);
			this.getView().byId("IdFgbdt").setEditable(false);
			this.getView().byId("IdSexo").setEditable(false);
			this.getView().byId("IdZzestciv").setEditable(false);

			this.getView().byId("IdParentesco").setSelectedKey(GrauParentesco);
			this.getView().byId("IdFavor").setValue(Nome);
			this.getView().byId("IdFanam").setValue(SobreNome);
			this.getView().byId("IdFgbdt").setValue(DataNascimento);
			this.getView().byId("IdSexo").setValue(Sexo);
			this.getView().byId("IdZzestciv").setSelectedKey(EstadoCivil);
		},

		onchangeParentesco: function () {

		},

		_onObjectMatched: function (oEvent) {
			var Pernr = oEvent.getParameter("arguments").Pernr;
			var Subty = oEvent.getParameter("arguments").Subty;
			var Tipo = oEvent.getParameter("arguments").Tipo;
			var Objps = oEvent.getParameter("arguments").Objps;
			var Favor = oEvent.getParameter("arguments").Favor;

			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("ZET_GLRH_DEPENDENTESSet", {
					Pernr: Pernr,
					Subty: Subty,
					Objps: Objps,
					Tipo: Tipo,
					Favor: Favor
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));

			this.getView().byId("IdParentesco").setEditable(false);
			this.getView().byId("IdFavor").setEditable(false);
			this.getView().byId("IdFanam").setEditable(false);
			this.getView().byId("IdFgbdt").setEditable(false);
			this.getView().byId("IdSexo").setEditable(false);
			this.getView().byId("IdZzestciv").setEditable(false);
			this.getView().byId("IdSalvarDetailDep").setVisible(false);
			this.getView().byId("IdCancelarDetailDep").setVisible(false);
			//this.getView().byId("IdEditDetailDep").setVisible(true);
			this.getView().byId("IdExcluirDetailDep").setVisible(true);
		},

		_bindView: function (sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getView().getModel();
			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);
			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function () {
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
		},

		onExcluir: function () {
			var that = this;
			var oModel = this.getView().getModel();
			var Pernr = this.getView().byId("IdPernr").getValue();
			var Subty = this.getView().byId("IdParentesco").getSelectedKey();
			var Objps = this.getView().byId("IdObjps").getValue();
			var Favor = this.getView().byId("IdFavor").getValue();
			var Key = "/ZET_GLRH_DEPENDENTESSet(Pernr='" + Pernr + "',Subty='" + Subty + "',Objps='" + Objps + "',Favor='" + Favor +
				"',Tipo='E')";
			var oEntry = {};
			oEntry.Tipo = "E";

			var dialog = new Dialog({
				title: "Confirma\xE7\xE3o",
				type: "Message",
				content: new Text({
					text: "Confirma a exclusÃ£o ?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(Key, oEntry, {
							success: function (oData, oResponse) {
								sap.m.MessageBox.success("Dependente excluido com sucesso.", {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function (sAction) {
										that.getRouter().navTo("DEPENDENTES");
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
				}
			});
			dialog.open();
		},

		onChange: function (oEvent) {
			// Stellen das CSRF Token wenn ein File hinzugefÃ¼gt ist
			var oUploadCollection = oEvent.getSource();
			var _csrfToken = this.getView().getModel().oHeaders["x-csrf-token"];
			var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
				name: "x-csrf-token",
				value: _csrfToken
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
		},

		onBeforeUploadStarts: function (oEvent) {
			var Pernr = this.getView().byId("IdPernr").getValue();
			var Subty = this.getView().byId("IdSubty").getValue();
			var Objps = this.getView().byId("IdObjps").getValue();
			var Favor = this.getView().byId("IdFavor").getValue();
			var sSlug = Pernr + "$" + Subty + "$" + Objps + "$" + Favor + "$" + oEvent.getParameter("fileName");

			// Stellen die Kopf Parameter slug
			var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
				name: "slug",
				value: sSlug
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
			//			_busyDialog.open();
		},

		onuploadComplete: function (oEvent) {

			var Pernr = this.getView().byId("IdPernr").getValue();
			var Subty = this.getView().byId("IdSubty").getValue();
			var Favor = this.getView().byId("IdFavor").getValue();
			var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr);
			var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, Subty);
			var oFilterFavor = new sap.ui.model.Filter("Favor", sap.ui.model.FilterOperator.EQ, Favor);
			var oList = this.getView().byId("UploadCollection");
			
			//oList.getBinding("items").filter([oFilterPernr]);
			oList.getBindingInfo("items").filter([oFilterPernr,oFilterSubty,oFilterFavor]);
		},
		
		onmodelContextChange: function (oEvent) {
			var Pernr = this.getView().byId("IdPernr").getValue();
			var Subty = this.getView().byId("IdSubty").getValue();
			var Favor = this.getView().byId("IdFavor").getValue();
			var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr);
			var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, Subty);
			var oFilterFavor = new sap.ui.model.Filter("Favor", sap.ui.model.FilterOperator.EQ, Favor);
			
			oEvent.getSource().getBinding("items").filter([oFilterPernr,oFilterSubty,oFilterFavor]);
		},

		onSave: function () {
			var that = this;
			var oModel = this.getView().getModel();
			var Pernr = this.getView().byId("IdPernr").getValue();
			var Subty = this.getView().byId("IdParentesco").getSelectedKey();
			var Objps = this.getView().byId("IdObjps").getValue();
			var Favor = this.getView().byId("IdFavor").getValue();
			var Key = "/ZET_GLRH_DEPENDENTESSet(Pernr='" + Pernr + "',Subty='" + Subty + "',Objps='" + Objps + "',Favor='" + Favor +
				"',Tipo='S')";
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

				sap.m.MessageBox.error("Anexo Ã© obrigatÃ³rio");
				return;

			}
			var dialog = new Dialog({
				title: "Confirma\xE7\xE3o",
				type: "Message",
				content: new Text({
					text: "Confirma a inclusÃ£o do dependente?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(Key, oEntry, {
							success: function (oData, oResponse) {
								sap.m.MessageBox.success("Dependente salvo com sucesso.", {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function (sAction) {
										that.getRouter().navTo("DEPENDENTES");
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
				}
			});
			dialog.open();
		},

		onBackMaster: function () {
			this.getRouter().navTo("master");
		}
	});

});