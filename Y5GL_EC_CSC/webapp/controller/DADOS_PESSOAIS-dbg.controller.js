sap.ui.define([
	"Y5GL_EC_CSC/Y5GL_EC_CSC/controller/BaseController",
	"sap/ui/Device",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text",
	"sap/ui/model/Filter"

], function (BaseController, Device, Dialog, Button, Text, Filter) {
	"use strict";

	return BaseController.extend("Y5GL_EC_CSC.Y5GL_EC_CSC.controller.DADOS_PESSOAIS", {
		onInit: function () {
			this.getRouter().getRoute("DADOS_PESSOAIS").attachPatternMatched(this._onObjectMatched, this);

			var sName = sap.ushell.Container.getUser().getFullName();
			this.getView().byId("idTitleDep").setText(sName);

			// Image loading
			var sRootPath = jQuery.sap.getModulePath("Y5GL_EC_CSC.Y5GL_EC_CSC");
			var sImagePath = sRootPath + "/imagens/Transparente_CBA.gif";
			this.getView().byId("idimg").setSrc(sImagePath);

		},

		_onObjectMatched: function (oEvent) {
			var Pernr = oEvent.getParameter("arguments").Pernr;
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("ZET_MEUS_DADOS_ECSet", {
					Pernr: Pernr,
					Tipo: "V"
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
			this.getRouter().navTo("master");
		},
		
		onReprovar: function(){
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

			if (NomeCompleto === "" || NomeCompleto === undefined) {
				view.byId("IdNomeCompleto").setValueState("Error");
				sap.m.MessageBox.error("Informe o nome completo.");
				return;
			} else {
				view.byId("IdNomeCompleto").setValueState("None");
				oEntry.Nome = NomeCompleto;
			}

			if (DataNascimento === "" || DataNascimento === undefined) {
				view.byId("IdDataNascimento").setValueState("Error");
				sap.m.MessageBox.error("Informe a data de nascimento.");
				return;
			} else {
				view.byId("IdDataNascimento").setValueState("None");
				DataNascimento = DataNascimento.substring(0, 4) + DataNascimento.substring(5, 7) + DataNascimento.substring(8, 10);
				oEntry.DtNasc = DataNascimento;
			}

			if (Sexo === "" || Sexo === undefined) {
				view.byId("IdSexo").setValueState("Error");
				sap.m.MessageBox.error("Informe o sexo.");
				return;
			} else {
				view.byId("IdSexo").setValueState("None");
				oEntry.Sexo = Sexo;
			}

			if (Nacionaliade === "" || Nacionaliade === undefined) {
				view.byId("IdNacionaliade").setValueState("Error");
				sap.m.MessageBox.error("Informe a nacionalidade.");
				return;
			} else {
				view.byId("IdNacionaliade").setValueState("None");
				oEntry.Nacionalidade = Nacionaliade;
			}

			if (LocalNascimento === "" || LocalNascimento === undefined) {
				view.byId("IdLocalNascimento").setValueState("Error");
				sap.m.MessageBox.error("Informe a local de nascimento.");
				return;
			} else {
				view.byId("IdLocNascimento").setValueState("None");
				oEntry.Municipio = LocalNascimento;
			}
			
			if (CodNaturalidade === "" || CodNaturalidade === undefined) {
				view.byId("IdCodNat").setValueState("Error");
				sap.m.MessageBox.error("Informe a local de nascimento.");
				return;
			} else {
				view.byId("IdCodNat").setValueState("None");
				oEntry.CodNaturalidade = CodNaturalidade;
			}

			if (EstNasc === "" || EstNasc === undefined) {
				view.byId("IdEstNasc").setValueState("Error");
				sap.m.MessageBox.error("Informe o estado de nascimento.");
				return;
			} else {
				view.byId("IdEstNasc").setValueState("None");
				oEntry.Estado = EstNasc;
			}

			if (PaisNasc === "" || PaisNasc === undefined) {
				view.byId("IdPaisNasc").setValueState("Error");
				sap.m.MessageBox.error("Informe o pais de nascimento.");
				return;
			} else {
				view.byId("IdPaisNasc").setValueState("None");
				oEntry.Pais = PaisNasc;
			}

			if (Idioma === "" || Idioma === undefined) {
				view.byId("IdIdioma").setValueState("Error");
				sap.m.MessageBox.error("Informe o idioma.");
				return;
			} else {
				view.byId("IdIdioma").setValueState("None");
				oEntry.Idioma = Idioma;
			}

			if (EstCivil === "" || EstCivil === undefined) {
				view.byId("IdEstCivil").setValueState("Error");
				sap.m.MessageBox.error("Informe o estado civil.");
				return;
			} else {
				view.byId("IdEstCivil").setValueState("None");
				oEntry.EstadoCivil = EstCivil;
			}

			if (CasadoDesde === "" || CasadoDesde === undefined) {
				if (EstCivil !== "1") {
					view.byId("IdCasadoDesde").setValueState("Error");
					sap.m.MessageBox.error("Informe o estado civil desde.");
					return;
				}
				view.byId("IdCasadoDesde").setValueState("None");
			} else {
				view.byId("IdCasadoDesde").setValueState("None");
				CasadoDesde = CasadoDesde.substring(0, 4) + CasadoDesde.substring(5, 7) + CasadoDesde.substring(8, 10);
				oEntry.DtCasamento = CasadoDesde;
			}

			if (Raca === "" || Raca === undefined) {
				view.byId("IdRaca").setValueState("Error");
				sap.m.MessageBox.error("Informe a raca.");
				return;
			} else {
				view.byId("IdRaca").setValueState("None");
				oEntry.Raca = Raca;
			}

			if (Aposentado === "" || Aposentado === undefined) {
				view.byId("IdAposentado").setValueState("Error");
				sap.m.MessageBox.error("Informe se aposentado.");
				return;
			} else {
				view.byId("IdAposentado").setValueState("None");
				oEntry.Aposentado = Aposentado;
			}

			oEntry.Tipo = "X";

			key = "/ZET_MEUS_DADOS_ECSet(Pernr='0',Tipo='R')";

			dialog = new Dialog({
				title: "Confirma\xE7\xE3o",
				type: "Message",
				content: new Text({
					text: "Confirma a alteração de dados pessoais?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(key, oEntry, {
							success: function (oData, oResponse) {

								sap.m.MessageBox.success("Dados gravados.", {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
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
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
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

			if (NomeCompleto === "" || NomeCompleto === undefined) {
				view.byId("IdNomeCompleto").setValueState("Error");
				sap.m.MessageBox.error("Informe o nome completo.");
				return;
			} else {
				view.byId("IdNomeCompleto").setValueState("None");
				oEntry.Nome = NomeCompleto;
			}

			if (DataNascimento === "" || DataNascimento === undefined) {
				view.byId("IdDataNascimento").setValueState("Error");
				sap.m.MessageBox.error("Informe a data de nascimento.");
				return;
			} else {
				view.byId("IdDataNascimento").setValueState("None");
				DataNascimento = DataNascimento.substring(0, 4) + DataNascimento.substring(5, 7) + DataNascimento.substring(8, 10);
				oEntry.DtNasc = DataNascimento;
			}

			if (Sexo === "" || Sexo === undefined) {
				view.byId("IdSexo").setValueState("Error");
				sap.m.MessageBox.error("Informe o sexo.");
				return;
			} else {
				view.byId("IdSexo").setValueState("None");
				oEntry.Sexo = Sexo;
			}

			if (Nacionaliade === "" || Nacionaliade === undefined) {
				view.byId("IdNacionaliade").setValueState("Error");
				sap.m.MessageBox.error("Informe a nacionalidade.");
				return;
			} else {
				view.byId("IdNacionaliade").setValueState("None");
				oEntry.Nacionalidade = Nacionaliade;
			}

			if (LocalNascimento === "" || LocalNascimento === undefined) {
				view.byId("IdLocalNascimento").setValueState("Error");
				sap.m.MessageBox.error("Informe a local de nascimento.");
				return;
			} else {
				view.byId("IdLocNascimento").setValueState("None");
				oEntry.Municipio = LocalNascimento;
			}
			
			if (CodNaturalidade === "" || CodNaturalidade === undefined) {
				view.byId("IdCodNat").setValueState("Error");
				sap.m.MessageBox.error("Informe a local de nascimento.");
				return;
			} else {
				view.byId("IdCodNat").setValueState("None");
				oEntry.CodNaturalidade = CodNaturalidade;
			}

			if (EstNasc === "" || EstNasc === undefined) {
				view.byId("IdEstNasc").setValueState("Error");
				sap.m.MessageBox.error("Informe o estado de nascimento.");
				return;
			} else {
				view.byId("IdEstNasc").setValueState("None");
				oEntry.Estado = EstNasc;
			}

			if (PaisNasc === "" || PaisNasc === undefined) {
				view.byId("IdPaisNasc").setValueState("Error");
				sap.m.MessageBox.error("Informe o pais de nascimento.");
				return;
			} else {
				view.byId("IdPaisNasc").setValueState("None");
				oEntry.Pais = PaisNasc;
			}

			if (Idioma === "" || Idioma === undefined) {
				view.byId("IdIdioma").setValueState("Error");
				sap.m.MessageBox.error("Informe o idioma.");
				return;
			} else {
				view.byId("IdIdioma").setValueState("None");
				oEntry.Idioma = Idioma;
			}

			if (EstCivil === "" || EstCivil === undefined) {
				view.byId("IdEstCivil").setValueState("Error");
				sap.m.MessageBox.error("Informe o estado civil.");
				return;
			} else {
				view.byId("IdEstCivil").setValueState("None");
				oEntry.EstadoCivil = EstCivil;
			}

			if (CasadoDesde === "" || CasadoDesde === undefined) {
				if (EstCivil !== "1") {
					view.byId("IdCasadoDesde").setValueState("Error");
					sap.m.MessageBox.error("Informe o estado civil desde.");
					return;
				}
				view.byId("IdCasadoDesde").setValueState("None");
			} else {
				view.byId("IdCasadoDesde").setValueState("None");
				CasadoDesde = CasadoDesde.substring(0, 4) + CasadoDesde.substring(5, 7) + CasadoDesde.substring(8, 10);
				oEntry.DtCasamento = CasadoDesde;
			}

			if (Raca === "" || Raca === undefined) {
				view.byId("IdRaca").setValueState("Error");
				sap.m.MessageBox.error("Informe a raca.");
				return;
			} else {
				view.byId("IdRaca").setValueState("None");
				oEntry.Raca = Raca;
			}

			if (Aposentado === "" || Aposentado === undefined) {
				view.byId("IdAposentado").setValueState("Error");
				sap.m.MessageBox.error("Informe se aposentado.");
				return;
			} else {
				view.byId("IdAposentado").setValueState("None");
				oEntry.Aposentado = Aposentado;
			}

			oEntry.Tipo = "X";

			key = "/ZET_MEUS_DADOS_ECSet(Pernr='0',Tipo='A')";

			dialog = new Dialog({
				title: "Confirma\xE7\xE3o",
				type: "Message",
				content: new Text({
					text: "Confirma a alteração de dados pessoais?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(key, oEntry, {
							success: function (oData, oResponse) {

								sap.m.MessageBox.success("Dados gravados.", {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
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
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
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

		handleValueHelp: function (oEvent) {

			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog1) {
				this._valueHelpDialog1 = sap.ui.xmlfragment("Y5GL_EC_CSC.Y5GL_EC_CSC.view.LocNascimento", this);
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

			var Pernr = "0";
			var infty = "0002";
			var Subty = "0";
			var Tipo = "U";

			if (Pernr !== "" || Subty !== "") {
				var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
				var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, Subty);
				var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, Tipo);
				var oList = this.getView().byId("UploadCollection");

				oList.getBinding("items").filter([oFilterInfty, oFilterSubty, oFilterTipo]);
			}
		},

		onmodelListContextChange: function (oEvent) {
			var Pernr = "0";
			var infty = "0002";
			var Subty = "0";
			var Tipo = "U";

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
			var Pernr = "0";
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
								sap.m.MessageBox.success("Documentos excluido com suceso.", {
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