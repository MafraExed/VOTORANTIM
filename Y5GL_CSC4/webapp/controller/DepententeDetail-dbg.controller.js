sap.ui.define([
	"Y5GL_CSC4/Y5GL_CSC4/controller/BaseController",
	"sap/ui/Device",
	"Y5GL_CSC4/Y5GL_CSC4/model/formatter",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/m/Label",
	"sap/m/RadioButton",
	"sap/ui/model/json/JSONModel"
], function (BaseController, Device, formatter, Button, Dialog, Text, Label, RadioButton, JSONModel) {
	"use strict";

	var GrauParentesco;
	var Nome;
	var SobreNome;
	var DataNascimento;
	var Sexo;
	var EstadoCivil;
	var Ir;
	var chamado;

	return BaseController.extend("Y5GL_CSC4.Y5GL_CSC4.controller.DepententeDetail", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Y5GL_CSC4.Y5GL_CSC4.view.DepententeDetail
		 */
		onInit: function () {
			this.getRouter().getRoute("DependenteDetail").attachPatternMatched(this._onObjectMatched, this);

			// Image loading
			var sRootPath = jQuery.sap.getModulePath("Y5GL_CSC4.Y5GL_CSC4");
			var sImagePath = sRootPath + "/imagens/loading.gif";
			this.getView().byId("idimg").setSrc(sImagePath);
		},
		
		filtraProvinicia: function () {
			var Zzregion = this.getView().byId("idDepartamento").getSelectedKey();
			var Zzcounc = this.getView().byId("idProvincia");
			var oFilterZzregion = new sap.ui.model.Filter("Regio", sap.ui.model.FilterOperator.EQ, Zzregion);

			Zzcounc.getBinding("items").filter([oFilterZzregion]);
		},

		filtraDistrito: function () {
			var Zzregion = this.getView().byId("idDepartamento").getSelectedKey();
			var Zzcounc = this.getView().byId("idProvincia").getSelectedKey();

			var oFilterZzregion = new sap.ui.model.Filter("Regio", sap.ui.model.FilterOperator.EQ, Zzregion);
			var oFilterZzcounc = new sap.ui.model.Filter("Counc", sap.ui.model.FilterOperator.EQ, Zzcounc);

			var IdZzcityc = this.getView().byId("idDistrito");

			IdZzcityc.getBinding("items").filter([oFilterZzregion, oFilterZzcounc]);
		},
		
		formatSimNao: function (oValue) {
			if (oValue === "X") {
				return "S";
			} else {
				return "N";
			}
		},

		onChangeCPF: function () {
			var cpf = this.getView().byId("idCpf").getValue();

			while (cpf.indexOf(".") != -1) {
				cpf = cpf.replace(".", "");
			}

			while (cpf.indexOf("-") != -1) {
				cpf = cpf.replace("-", "");
			}

			var numeros, digitos, soma, i, resultado, digitos_iguais;
			var erro;
			digitos_iguais = 1;

			if (cpf.length < 11) {
				erro = 1;
			}

			if (erro !== 1) {
				for (i = 0; i < cpf.length - 1; i++)

					if (cpf.charAt(i) != cpf.charAt(i + 1)) {
						digitos_iguais = 0;
						break;
					}

				if (!digitos_iguais) {
					numeros = cpf.substring(0, 9);
					digitos = cpf.substring(9);
					soma = 0;

					for (i = 10; i > 1; i--) {
						soma += numeros.charAt(10 - i) * i;
					}

					resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

					if (resultado != digitos.charAt(0)) {
						erro = 1;
					}

					numeros = cpf.substring(0, 10);

					soma = 0;

					for (i = 11; i > 1; i--)
						soma += numeros.charAt(11 - i) * i;
					resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

					if (resultado != digitos.charAt(1)) {
						erro = 1;
					}

				} else {
					erro = 1;
				}
			} else {
				erro = 1;
			}

			if (erro === 1) {
				sap.m.MessageBox.error("CPF inválido");
				this.getView().byId("idCpf").setValueState("Error");
			} else {
				this.getView().byId("idCpf").setValueState("Success");
			}

		},

		onVoltar: function () {
			this.getRouter().navTo("worklist");
		},

		formatVisibleEdit: function (oValue) {
			if (oValue === "Em ResoluÃ§Ã£o") {
				return false;
			} else {
				return true;
			}
		},

		formatVisibleUpload: function (oValue) {
			if (oValue === "Em ResoluÃ§Ã£o") {
				return true;
			} else {
				return false;
			}
		},

		_onAdd: function (oEvent) {

			this.getView().getModel().refresh(true);

			var Pernr = oEvent.getParameter("arguments").Pernr;
			var Subty = oEvent.getParameter("arguments").Subty;
			var Tipo = "N";
			var Objps = oEvent.getParameter("arguments").Objps;
			var Favor = oEvent.getParameter("arguments").Favor;
			var Icnum = oEvent.getParameter("arguments").Icnum;
			var sObjectPath;

			// Retorna os campos para editaveis
			this.getView().byId("IdParentesco").setEditable(true);
			this.getView().byId("IdFavor").setEditable(true);
			this.getView().byId("IdFanam").setEditable(true);
			this.getView().byId("IdFgbdt").setEditable(true);
			this.getView().byId("IdSexo").setEditable(true);
			this.getView().byId("IdZzestciv").setEditable(true);
			this.getView().byId("IdIR").setEditable(true);
			this.getView().byId("idCpf").setEditable(true);
			this.getView().byId("IdSalvarDetailDep").setVisible(true);
			this.getView().byId("IdEditDetailDep").setVisible(false);
			this.getView().byId("IdCancelarDetailDep").setVisible(false);
			this.getView().byId("IdPlano").setEditable(true);

			//this.getView().byId("IdExcluirDetailDep").setVisible(false);
			this.getView().byId("IdParentesco").setValueState("None");
			this.getView().byId("IdFavor").setValueState("None");
			this.getView().byId("IdFanam").setValueState("None");
			this.getView().byId("IdFgbdt").setValueState("None");
			this.getView().byId("IdFgbdt").setValueState("None");
			this.getView().byId("IdSexo").setValueState("None");
			this.getView().byId("IdZzestciv").setValueState("None");
			this.getView().byId("IdPlano").setValueState("None");

			this.getView().byId("IdIR").setValueState("None");
			this.getView().byId("idCpf").setValueState("None");

			this.getView().byId("IdEditDetailDep").setVisible(false);
			this.getView().byId("IdCancelarDetailDep").setVisible(true);
			this.getView().byId("iddelete").setVisible(false);

			this.getView().byId("idTextEditar").setVisible(false);
			this.getView().byId("idTextExcluir").setVisible(false);
			this.getView().byId("idTextIncluir").setVisible(true);

			// retorna os campos para editaveis

			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then(function () {
				sObjectPath = this.getModel().createKey("ZET_GLRH_DEPENDENTESSet", {
					Pernr: Pernr,
					Subty: Subty,
					Objps: Objps,
					Tipo: Tipo,
					Favor: Favor,
					Icnum: Icnum
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
			Ir = this.getView().byId("IdIR").getSelectedKey();

			if (Ir === "S") {
				Ir = "SIM";
			} else {
				Ir = "Não";
			}

			this.getView().byId("UploadCollection").setUploadButtonInvisible(false);
			this.getView().byId("IdEditDetailDep").setVisible(false);
			this.getView().byId("IdSalvarDetailDep").setVisible(true);
			this.getView().byId("IdCancelarDetailDep").setVisible(true);
			this.getView().byId("IdParentesco").setEditable(true);
			this.getView().byId("IdFavor").setEditable(true);
			this.getView().byId("IdFanam").setEditable(true);
			this.getView().byId("IdFgbdt").setEditable(true);
			this.getView().byId("IdSexo").setEditable(true);
			this.getView().byId("IdZzestciv").setEditable(true);
			this.getView().byId("IdIR").setEditable(true);
			this.getView().byId("idCpf").setEditable(true);
			this.getView().byId("IdPlano").setEditable(false);

			this.getView().byId("idTextEditar").setVisible(true);
			this.getView().byId("idTextExcluir").setVisible(false);
			this.getView().byId("idTextIncluir").setVisible(false);
		},

		onCancel: function () {
			this.getView().byId("IdCancelarDetailDep").setVisible(false);
			this.getView().byId("IdEditDetailDep").setVisible(true);
			this.getView().byId("IdSalvarDetailDep").setVisible(false);
			this.getView().byId("UploadCollection").setUploadButtonInvisible(true);
			this.getView().byId("IdParentesco").setEditable(false);
			this.getView().byId("IdFavor").setEditable(false);
			this.getView().byId("IdFanam").setEditable(false);
			this.getView().byId("IdFgbdt").setEditable(false);
			this.getView().byId("IdSexo").setEditable(false);
			this.getView().byId("IdZzestciv").setEditable(false);
			this.getView().byId("IdIR").setEditable(false);
			this.getView().byId("idCpf").setEditable(false);
			this.getView().byId("IdPlano").setEditable(false);

			this.getView().byId("IdParentesco").setSelectedKey(GrauParentesco);
			this.getView().byId("IdFavor").setValue(Nome);
			this.getView().byId("IdFanam").setValue(SobreNome);
			this.getView().byId("IdFgbdt").setValue(DataNascimento);
			this.getView().byId("IdSexo").setValue(Sexo);
			this.getView().byId("IdZzestciv").setSelectedKey(EstadoCivil);
			this.getView().byId("IdIR").setValue(Ir);

			this.getView().byId("idTextEditar").setVisible(false);
			this.getView().byId("idTextExcluir").setVisible(false);
			this.getView().byId("idTextIncluir").setVisible(false);
		},

		onchangeParentesco: function () {
			var IdParentesco = this.getView().byId("IdParentesco").getSelectedKey();

			if (IdParentesco === "11" || IdParentesco === "12") {
				this.getView().byId("idformplano").setVisible(false);
			} else {
				this.getView().byId("idformplano").setVisible(true);
			}
		},

		_onObjectMatched: function (oEvent) {
			var TipodeOperacao = oEvent.getParameter("arguments").Tipo;

			var Pernr = oEvent.getParameter("arguments").Pernr;
			var Subty = oEvent.getParameter("arguments").Subty;
			var Tipo = "V";
			var Objps = oEvent.getParameter("arguments").Objps;
			var Favor = oEvent.getParameter("arguments").Favor;
			var Icnum = oEvent.getParameter("arguments").Icnum;
			chamado = oEvent.getParameter("arguments").Chamado;
			this.getView().byId("IdObjps").setValue(Objps);
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("ZET_GLRH_DEPENDENTESSet", {
					Icnum: Icnum,
					Pernr: Pernr,
					Subty: Subty,
					Objps: Objps,
					Tipo: Tipo,
					Favor: Favor,
					Chamado: chamado
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));

			// this.getView().byId("IdParentesco").setEditable(false);
			// this.getView().byId("IdFavor").setEditable(false);
			// this.getView().byId("IdFanam").setEditable(false);
			// this.getView().byId("IdFgbdt").setEditable(false);
			// this.getView().byId("IdSexo").setEditable(false);
			// this.getView().byId("IdZzestciv").setEditable(false);

			// this.getView().byId("IdIR").setEditable(false);
			// this.getView().byId("idCpf").setEditable(false);
			// this.getView().byId("IdPlano").setEditable(false);
			// //this.getView().byId("IdExcluirDetailDep").setVisible(true);

		},

		_bindView: function (sObjectPath) {
			// Set busy indicator during view binding
			var that = this;
			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			that.loading(false);
			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						that.loading(true);
					},
					dataReceived: function () {
						that.loading(false);
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
			this.filtraProvinicia();
			this.filtraDistrito();
		},

		onExcluir: function () {
			var that = this;
			var oModel = this.getView().getModel();
			var Pernr = this.getView().byId("IdPernr").getValue();
			var Subty = this.getView().byId("IdParentesco").getSelectedKey();
			var Objps = this.getView().byId("IdObjps").getValue();
			var Favor = this.getView().byId("IdFavor").getValue();
			var CPF = this.getView().byId("idCpf").getValue();
			var Key = "/ZET_GLRH_DEPENDENTESSet(Pernr='" + Pernr + "',Subty='" + Subty + "',Objps='" + Objps + "',Favor='" + Favor +
				"',Tipo='E',Icnum='" + CPF + "')";
			var oEntry = {};

			oEntry.Parentesco = this.getView().byId("IdParentesco").getSelectedKey();
			oEntry.Favor = this.getView().byId("IdFavor").getValue();
			oEntry.Fanam = this.getView().byId("IdFanam").getValue();
			oEntry.Fgbdt = this.getView().byId("IdFgbdt").getValue();
			oEntry.Sexo = this.getView().byId("IdSexo").getSelectedKey();
			oEntry.Zzestciv = this.getView().byId("IdZzestciv").getSelectedKey();
			oEntry.Irflg = this.getView().byId("IdIR").getSelectedKey();
			oEntry.Operation = "Exclusão";

			if (oEntry.Irflg === "S") {
				oEntry.Irflg = "X";
			} else {
				oEntry.Irflg = "";
			}

			oEntry.Icnum = this.getView().byId("idCpf").getValue();
			oEntry.Zplanosaude = this.getView().byId("IdPlano").getSelectedKey();

			if (oEntry.Zplanosaude === "S") {
				oEntry.Zplanosaude = "X";
			} else {
				oEntry.Zplanosaude = " ";
			}

			var dialog = new Dialog({
				title: "Confirma\xE7\xE3o",
				type: "Message",
				content: new Text({
					text: "Após a confirmação não será possivel alterar o anexo até que o processo seja finalizado, deseja seguir?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(Key, oEntry, {
							success: function (oData, oResponse) {
								sap.m.MessageBox.success(
									"Sua exclusão foi iniciada e seguirá para processamento, aguarde retorno ou acompanhae pelo app.", {
										actions: ["OK", sap.m.MessageBox.Action.CLOSE],
										onClose: function (sAction) {
											that.getView().getModel().refresh(true);
											that.getRouter().navTo("DEPENDENTES");
										}
									});
							},
							error: function (oError) {
								var erro = oError;
								erro = erro.responseText;
								var erro2 = JSON.parse(erro);
								var messagem = erro2.error.message.value;
								sap.m.MessageBox.error(messagem);
								return;
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

		onBeforeUploadStarts: function (oEvent) {
			var Pernr = this.getView().byId("IdPernr").getValue();
			var Infty = "0021";
			var Subty = this.getView().byId("IdParentesco").getSelectedKey();
			var Objps = this.getView().byId("IdObjps").getValue();
			if (Objps === "") {
				Objps = "0";
			}
			var IdParentesco = this.getView().byId("IdParentesco").getSelectedKey();
			var Favor = this.getView().byId("IdFavor").getValue();
			var Cpf = this.getView().byId("idCpf").getValue();

			if (IdParentesco === "") {
				sap.m.MessageBox.error("Selecione o Grau de Parentesco.");
				return;
			}

			if (Pernr !== "" && Subty !== "" && Objps !== "") {
				var sSlug = Pernr + "$" + Infty + "$" + Subty + "$" + Objps + "$" + oEvent.getParameter("fileName") + "$" + Favor + "$" + Cpf;
				// Stellen die Kopf Parameter slug
				var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
					name: "slug",
					value: sSlug
				});
				oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
			} else {
				sap.m.MessageBox.error("Não foi possivel fazer upload do arquivo.");
			}
			//			_busyDialog.open();
		},

		onuploadComplete: function (oEvent) {

			var Pernr = this.getView().byId("IdPernr").getValue();
			var Infty = "0021";
			var Subty = this.getView().byId("IdParentesco").getSelectedKey();
			var Tipo = "C";
			var Favor = this.getView().byId("IdFavor").getValue();
			var Cpf = this.getView().byId("idCpf").getValue();

			if (Pernr !== "" && Subty !== "") {
				this.getView().byId("IdParentesco").setEditable(false);
				var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr);
				var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, Infty);
				var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, Subty);
				var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, Tipo);
				var oFilterFavor = new sap.ui.model.Filter("Favor", sap.ui.model.FilterOperator.EQ, Favor);
				var oFilterCpf = new sap.ui.model.Filter("Icnum", sap.ui.model.FilterOperator.EQ, Cpf);

				var oList = this.getView().byId("UploadCollection");

				oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo, oFilterFavor, oFilterCpf]);
			}
		},

		onmodelListContextChange: function (oEvent) {
			var Pernr = this.getView().byId("IdPernr").getValue();
			var Infty = "0021";
			var Subty = this.getView().byId("IdParentesco").getSelectedKey();
			var Tipo = "C";
			var Favor = this.getView().byId("IdFavor").getValue();
			var Cpf = this.getView().byId("idCpf").getValue();

			if (Pernr !== "" || Subty !== "") {
				var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr);
				var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, Infty);
				var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, Subty);
				var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, Tipo);
				var oFilterFavor = new sap.ui.model.Filter("Favor", sap.ui.model.FilterOperator.EQ, Favor);
				var oFilterCpf = new sap.ui.model.Filter("Icnum", sap.ui.model.FilterOperator.EQ, Cpf);
				var oList = this.getView().byId("UploadCollection");
				oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo, oFilterFavor, oFilterCpf]);
			}
		},

		onSave: function () {
			var that = this;
			var oModel = this.getView().getModel();
			var Pernr = this.getView().byId("IdPernr").getValue();
			var Subty = this.getView().byId("IdParentesco").getSelectedKey();
			var Objps = this.getView().byId("IdObjps").getValue();
			var Favor = this.getView().byId("IdFavor").getValue();
			var Cpf = this.getView().byId("idCpf").getValue();
			var Key = "/ZET_GLRH_DEPENDENTESSet(Pernr='" + Pernr + "',Subty='" + Subty + "',Objps='" + Objps + "',Favor='" + Favor +
				"',Tipo='A',Icnum='" + Cpf + "',Chamado='" + chamado +"')";
			var oEntry = {};
			
			oEntry.Pernr = Pernr;
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

			oEntry.Irflg = this.getView().byId("IdIR").getSelectedKey();
			if (oEntry.Irflg === " ") {
				this.getView().byId("IdIR").setValueState("Error");
				sap.m.MessageBox.error("Selecione se é dependente de IR.");
				return;
			} else {
				if (oEntry.Irflg === "S") {
					oEntry.Irflg = "X";
				} else {
					oEntry.Irflg = "";
				}
				this.getView().byId("IdIR").setValueState("Success");
			}

			oEntry.Icnum = this.getView().byId("idCpf").getValue();
			oEntry.HealthplanInd = this.getView().byId("IdPlano").getSelectedKey();

			// if (oEntry.HealthplanInd === "") {
			// 	this.getView().byId("HealthplanInd").setValueState("Error");
			// 	sap.m.MessageBox.error("Informe se o dependente será incluido no plano de saúde.");
			// 	return;
			// } else {
				if (oEntry.HealthplanInd === "S") {
					oEntry.HealthplanInd = "X";
				} else {
					oEntry.HealthplanInd = " ";
				}
				//this.getView().byId("HealthplanInd").setValueState("Success");
			//}

			if (Subty === "11" || Subty === "12") {
				oEntry.HealthplanInd = "N";
			}

			oEntry.Mothe = this.getView().byId("idNomedaMae").getValue();
			oEntry.Fgbld = this.getView().byId("IdPaisNasc").getSelectedKey();
			oEntry.Fanat = this.getView().byId("IdNacionaliade").getSelectedKey();
			oEntry.ZzIctyp = this.getView().byId("idIdentificacion").getSelectedKey();
			oEntry.ZzTpvia = this.getView().byId("idVia").getSelectedKey();
			oEntry.ZzTxvia = this.getView().byId("idNombreVia").getValue();
			oEntry.ZzNrvia = this.getView().byId("idNumeroVia").getValue();
			oEntry.ZzNrint = this.getView().byId("idInterior").getValue();
			oEntry.ZzTpzon = this.getView().byId("idTpZona").getSelectedKey();
			oEntry.ZzNrodep = this.getView().byId("idNrodep").getValue();
			oEntry.ZzNomzon = this.getView().byId("idZzNomzon").getValue();
			oEntry.ZzRefer = this.getView().byId("idZzRefer").getValue();
			oEntry.ZzCityc = this.getView().byId("idDistrito").getSelectedKey();
			oEntry.ZzUbigeo = this.getView().byId("idUbigeo").getValue();
			oEntry.ZzManza = this.getView().byId("idManzana").getValue();
			oEntry.ZzLote = this.getView().byId("idLote").getValue();
			oEntry.ZzKilom = this.getView().byId("idKilometro").getValue();
			oEntry.ZzBlock = this.getView().byId("idBloque").getValue();
			oEntry.ZzEtapa = this.getView().byId("idEtapa").getValue();
			oEntry.ZzRegio = this.getView().byId("idDepartamento").getSelectedKey();
			oEntry.ZzCounc = this.getView().byId("idProvincia").getSelectedKey();
			oEntry.ZzStudy = this.getView().byId("IdZzStudy").getSelectedKey();

			if (oEntry.ZzStudy === "S") {
				oEntry.ZzStudy = true;
			} else {
				oEntry.ZzStudy = false;
			}
			
			oEntry.Fgbna = this.getView().byId("IdFgbna").getValue();
			
			if (oEntry.Fgbna === ""){
				this.getView().byId("IdFgbna").setValueState("Error");
				sap.m.MessageBox.error("Apelido de solteiro no llenado");
				return;
			}
			
			oEntry.Fgbot = this.getView().byId("IdLocNascimento").getValue();
			
				oEntry.ZzIctyp = this.getView().byId("idIdentificacion").getSelectedKey();
			
			if (oEntry.ZzIctyp === ""){
				this.getView().byId("idIdentificacion").setValueState("Error");
				sap.m.MessageBox.error("Tipo de documento no llenado");
				return;
			}
			
			oEntry.ZzIcnum = this.getView().byId("idZzIcnum").getValue();
			
			if (oEntry.ZzIcnum === ""){
				this.getView().byId("idZzIcnum").setValueState("Error");
				sap.m.MessageBox.error("Numero de documento no llenado");
				return;
			}

			var dialog = new Dialog({
				title: "Confirma\xE7\xE3o",
				type: "Message",
				content: new Text({
					text: "Después de la confirmación, no será posible cambiar el archivo adjunto hasta que se complete el proceso. ¿Quieres continuar?"
				}),
				beginButton: new Button({
					text: "Sí",
					press: function () {
						oModel.update(Key, oEntry, {
							success: function (oData, oResponse) {
								sap.m.MessageBox.success(
									"Su inclusión / cambio ha comenzado y se seguirá procesando. Espere comentarios o siga la aplicación.", {
										actions: ["OK"],
										onClose: function (sAction) {
											that.getView().getModel().refresh(true);
											that.getRouter().navTo("worklist");
										}
									});
							},
							error: function (oError) {
								var erro = oError;
								erro = erro.responseText;
								var erro2 = JSON.parse(erro);
								var messagem = erro2.error.message.value;
								sap.m.MessageBox.error(messagem);
								return;
							}
						});
						dialog.close();
					}
				}),
				endButton: new Button({
					text: "No",
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
		},

		onDeleteSelectedItems: function (oEvent) {

			this.getView().byId("IdParentesco").setEditable(true);

			var Infty = "0021";
			var Subty = this.getView().byId("IdParentesco").getSelectedKey();
			var oModel = this.getView().getModel();
			var Ano = "0000";
			var Favor = this.getView().byId("IdFavor").getValue();
			var Mes = "00";
			var Pernr = "0";
			var Tipo = "E";
			var ListItem = oEvent.getParameters("listItem");
			var docid = ListItem.documentId;
			docid = parseInt(docid);
			var idTipo = this.getView().byId("idTipo").getValue();
			var cpf = this.getView().byId("idCpf").getValue();

			if (idTipo === "Em ResoluÃ§Ã£o") {
				sap.m.MessageBox.error("Não será possivel exclusão do anexo, quando o chamado ja existir.");
				return;
			}

			var Key = "/ZET_GLRH_UPLOADSet(Ano='" + Ano + "',Favor='" + Favor + "',Infty='" + Infty + "',Mes='" + Mes + "',Pernr='" + Pernr +
				"',Tipo='" + Tipo + "',Subty='" + Subty + "',DocId=" + docid + ",Objps='',Icnum='" + cpf + "')";

			var oEntry = {};
			oEntry.DocId = 1;

			var UploadCollection = this.getView().byId("UploadCollection");

			var dialog = new Dialog({
				title: "Confirma\xE7\xE3o",
				type: "Message",
				content: new Text({
					text: "Confirma a exclusão anexo?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(Key, oEntry, {
							success: function (oData, oResponse) {
								sap.m.MessageBox.success("Documentos excluido com sucesso.", {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function (sAction) {
										UploadCollection.getBinding("items").refresh(true);
									}
								});
							},
							error: function (oError) {
								var erro = oError;
								erro = erro.responseText;
								var erro2 = JSON.parse(erro);
								var messagem = erro2.error.message.value;
								sap.m.MessageBox.error(messagem, {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function (sAction) {

									}
								});
								return;
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
					//oModel.refresh(true);
				}
			});
			dialog.open();
		},

		FormatIrflg: function (oValue) {
			if (oValue === "X" || oValue === 'S') {
				return "S";
			} else {
				return "N";
			}
		},

		FormatPlano: function (oValue) {

			if (oValue === "11" || oValue === "12") {
				return false;
			} else {
				return true;
			}

		},

		handleValueHelp: function (oEvent) {

			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog1) {
				this._valueHelpDialog1 = sap.ui.xmlfragment("Y5GL_CSC4.Y5GL_CSC4.view.LocNascimento", this);
				this.getView().addDependent(this._valueHelpDialog1);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog1.open(sInputValue);

			// // create a filter for the binding
			if (sInputValue) {
				this._valueHelpDialog1.getBinding("items").filter([new Filter(
					"IMunicipio",
					sap.ui.model.FilterOperator.EQ, sInputValue
				)]);
			}

			this._valueHelpDialog1.getBinding("items").filter([new Filter(
				"IUf",
				sap.ui.model.FilterOperator.EQ, "SP"
			)]);
		},

		onSearchMunicipio: function (oEvent) {
			var sValue = oEvent.getParameter("value");

			if (sValue) {
				var sFilter = sValue;
				var oFilter = new sap.ui.model.Filter("IMunicipio", sap.ui.model.FilterOperator.EQ, sFilter);
				var oFilter2 = new sap.ui.model.Filter("IUf", sap.ui.model.FilterOperator.EQ, "SP");
				oEvent.getSource().getBinding("items").filter([oFilter, oFilter2]);
			}

		},
	});

});