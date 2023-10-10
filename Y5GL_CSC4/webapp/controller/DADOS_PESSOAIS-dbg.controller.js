sap.ui.define([
	"Y5GL_CSC4/Y5GL_CSC4/controller/BaseController",
	"sap/ui/Device",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text",
	"sap/ui/model/Filter"

], function (BaseController, Device, Dialog, Button, Text, Filter) {
	"use strict";
	
	var Pernr;
	var Chamado;

	return BaseController.extend("Y5GL_CSC4.Y5GL_CSC4.controller.DADOS_PESSOAIS", {
		onInit: function () {
			this.getRouter().getRoute("DADOS_PESSOAIS").attachPatternMatched(this._onObjectMatched, this);

			var sName = sap.ushell.Container.getUser().getFullName();
			this.getView().byId("idTitleDep").setText(sName);

			// Image loading
			var sRootPath = jQuery.sap.getModulePath("Y5GL_CSC4.Y5GL_CSC4");
			var sImagePath = sRootPath + "/imagens/loading.gif";
			this.getView().byId("idimg").setSrc(sImagePath);

		},

		_onObjectMatched: function (oEvent) {
			Pernr = oEvent.getParameter("arguments").Pernr;
			Chamado = oEvent.getParameter("arguments").Chamado;
			
			this.getView().byId("idTitleDependentes").setText("Datos personales - (Matrícula - " + Pernr + ") - Chamado - " + Chamado + " ");
			
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("ZET_MEUS_DADOS_ECSet", {
					Pernr: Pernr,
					Tipo: "V",
					Chamado: Chamado
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		_bindView: function (sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getView().getModel();
			var that = this;
			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);
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
				//this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}
		},

		onBackMaster: function () {
			this.getRouter().navTo("worklist");
		},

		onAprovar: function () {
			var view = this.getView();
			var NomeCompleto = view.byId("IdNomeCompleto").getValue();
			var DataNascimento = view.byId("IdDataNascimento").getValue();
			var Sexo = view.byId("IdSexo").getSelectedKey();
			var Nacionaliade = view.byId("IdNacionaliade").getSelectedKey();
			var LocalNascimento = view.byId("IdLocNascimento").getValue();
			var EstNasc = view.byId("IdEstNasc").getSelectedKey();
			var PaisNasc = view.byId("IdPaisNasc").getSelectedKey();
			var Aposentado = view.byId("IdAposentado").getSelectedKey();
			var Raca = view.byId("IdRaca").getSelectedKey();
			var CasadoDesde = view.byId("IdCasadoDesde").getValue();
			var EstCivil = view.byId("IdEstCivil").getSelectedKey();
			var Idioma = view.byId("IdIdioma").getSelectedKey();
			var CodNaturalidade = view.byId("IdCodNat").getValue();
			var dialog;
			var oModel = this.getView().getModel();
			var that = this;
			var erro;
			var erro2;
			var messagem;
			var key;
			var oEntry = {};
			
			
			oEntry.Vorna = this.getView().byId("IdVorna").getValue();
			oEntry.Rufnm = this.getView().byId("IdRufnm").getValue();
			oEntry.Nachn = this.getView().byId("IdNachn").getValue();
			oEntry.Name2 = this.getView().byId("IdName2").getValue();
			
			if (oEntry.Nachn === ""){
				this.getView().byId("IdNachn").setValueState("Error");
				sap.m.MessageBox.error("Apelido no informado");
				return;
			}else{
				this.getView().byId("IdNomeCompleto").setValueState("Success");
			}
			
			if (NomeCompleto === ""){
				this.getView().byId("IdName2").setValueState("Error");
				sap.m.MessageBox.error("Nombre no informado");
				return;
			}else{
				this.getView().byId("IdName2").setValueState("Success");
			}
			
			oEntry.Nome = NomeCompleto;
			DataNascimento = DataNascimento.substring(0, 4) + DataNascimento.substring(5, 7) + DataNascimento.substring(8, 10);
			oEntry.DtNasc = DataNascimento;
			oEntry.Sexo = Sexo;
			oEntry.Pais = PaisNasc;
			oEntry.Estado = EstNasc;
			oEntry.Nacionalidade = Nacionaliade;
			oEntry.Municipio = LocalNascimento;
			oEntry.CodNaturalidade = CodNaturalidade;
			oEntry.Idioma = Idioma;
			oEntry.EstadoCivil = EstCivil;
			CasadoDesde = CasadoDesde.substring(0, 4) + CasadoDesde.substring(5, 7) + CasadoDesde.substring(8, 10);
			oEntry.DtCasamento = CasadoDesde;
			oEntry.Raca = Raca;
			oEntry.Aposentado = Aposentado;
			oEntry.Tipo = "X";

			key = "/ZET_MEUS_DADOS_ECSet(Pernr='0',Tipo='A',Chamado='0')";

			dialog = new Dialog({
				title: "Confirma\xE7\xE3o",
				type: "Message",
				content: new Text({
					text: "Después de la confirmación, no será posible cambiar el archivo adjunto hasta que se complete el proceso. ¿Quieres continuar?"
				}),
				beginButton: new Button({
					text: "Sí",
					press: function () {
						oModel.update(key, oEntry, {
							success: function (oData, oResponse) {

								sap.m.MessageBox.success(
									"Su inclusión / cambio ha comenzado y se seguirá procesando. Espere comentarios o siga la aplicación.", {
										actions: ["OK"],
										onClose: function (sAction) {
											that.getView().getModel().refresh(true);
											that.onCancel();
											//that.getRouter().navTo("BENEFICIOS");
										}
									});
							},
							error: function (oError) {
								erro = oError;
								erro = erro.responseText;
								erro2 = JSON.parse(erro);
								messagem = erro2.error.message.value;
								sap.m.MessageBox.error(messagem, {
									actions: ["OK"],
									onClose: function (sAction) {
										//that.getRouter().navTo("Master");
									}
								});

								//sap.m.MessageBox.error("Desculpe, não foi possível realizar sua solicitação, tente novamente em alguns instantes");
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

		onConfirmMunicipio: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");

			this._valueHelpDialog1 = null;

			if (oSelectedItem) {
				var title = oSelectedItem.getTitle();
				var descripition = oSelectedItem.getDescription();

				var value = descripition + "-" + title;

				this.getView().byId("IdCodNat").setValue(value);

				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(title);

			}
		},

		onEdit: function () {
			this.getView().byId("Form2").setVisible(false);
			this.getView().byId("form1").setVisible(true);
			this.getView().byId("UploadCollection").setUploadButtonInvisible(false);
			this.getView().byId("IdEnviarDetailDep").setVisible(true);
			this.getView().byId("IdEditDados").setVisible(false);
			this.getView().byId("IdCancelarDetailDep").setVisible(true);
		},

		onCancel: function () {
			this.getView().byId("Form2").setVisible(true);
			this.getView().byId("form1").setVisible(false);
			this.getView().byId("UploadCollection").setUploadButtonInvisible(true);
			this.getView().byId("IdEnviarDetailDep").setVisible(false);
			this.getView().byId("IdEditDados").setVisible(true);
			this.getView().byId("IdCancelarDetailDep").setVisible(false);
			this.getView().getModel().refresh(true);
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
			var Pernr = "0";
			var infty = "0002";
			var Subty = "0";
			var Objps = "0";

			if (Pernr !== "" || Subty !== "" || Objps !== "") {
				var sSlug = Pernr + "$" + infty + "$" + Subty + "$" + Objps + "$" + oEvent.getParameter("fileName");
				// Stellen die Kopf Parameter slug
				var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
					name: "slug",
					value: sSlug
				});
				oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);

			}
			//			_busyDialog.open();
		},

		onuploadComplete: function (oEvent) {

			var infty = "0002";
			var Subty = "0";
			var Tipo = "C";

			if (Pernr !== "" || Subty !== "") {
				var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
				var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, Subty);
				var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, Tipo);
				var oList = this.getView().byId("UploadCollection");

				oList.getBinding("items").filter([oFilterInfty, oFilterSubty, oFilterTipo]);
			}
		},

		onmodelListContextChange: function (oEvent) {
			var infty = "0002";
			var Subty = "0";
			var Tipo = "C";

			if (Pernr !== "" || Subty !== "") {
				var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr);
				var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
				var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, Subty);
				var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, Tipo);
				var oList = this.getView().byId("UploadCollection");
				oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo]);
			}
		},
		
		onDeleteSelectedItems: function (oEvent) {
			var infty = "0002";
			var Subty = "0";
			var oModel = this.getView().getModel();
			var Ano = "0";
			var Favor = "0";
			var Infty = infty;
			var Mes = "0";
			var Tipo = "E";
			var Subty = Subty;
			var ListItem = oEvent.getParameters("listItem");
			var docid = ListItem.documentId;
			docid = parseInt(docid);
			var idTipo = this.getView().byId("idTipo").getValue();
			
			if (idTipo === "Em ResoluÃ§Ã£o"){
				sap.m.MessageBox.error("Não será possivel exclusão do anexo, quando o chamado ja existir.");
				return;
			}
			
			var Key = "/ZET_GLRH_UPLOADSet(Ano='" + Ano + "',Favor='" + Favor + "',Infty='" + Infty + "',Mes='" + Mes + "',Pernr='" + Pernr +
				"',Tipo='" + Tipo + "',Subty='" + Subty + "',DocId=" + docid + ",Objps='',Icnum='')";
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
										UploadCollection.getBinding("items").refresh(true);
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

		formatVisibleEdit: function (oValue) {
			if (oValue === "Em ResoluÃ§Ã£o") {
				return false;
			} else {
				return true;
			}
		}

	});

});