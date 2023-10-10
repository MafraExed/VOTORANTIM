sap.ui.define([
	"Y5GL_EC_CAD2/Y5GL_EC_CAD2/controller/BaseController",
	"sap/ui/Device",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text",
	"sap/ui/model/Filter",
	"sap/m/MessageBox"

], function (BaseController, Device, Dialog, Button, Text, Filter, MessageBox) {
	"use strict";

	return BaseController.extend("Y5GL_EC_CAD2.Y5GL_EC_CAD2.controller.DADOS_PESSOAIS", {
		onInit: function () {
			this.getRouter().getRoute("DADOS_PESSOAIS").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function (oEvent) {
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");

			// Image loading

			this.buscaImagem();

			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("ZET_MEUS_DADOS_ECSet", {
					Pernr: "0",
					Tipo: "V",
					Chamado: "0"
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
			
			this.onTrans();// No data for the binding
			
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				//this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}
			
		},
		onCivil: function (oEvent) {
		
			var estadocivil = this.byId("IdEstCivil").getSelectedKey();
			
			if (estadocivil === "1") {
				
				this.byId("FormCasDesde").setVisible(false);
			    this.byId("IdCasadoDesde").setVisible(false);
			    this.byId("IdCasadoDesde").setRequired(false);
				
			} else {
				
				this.byId("FormCasDesde").setVisible(true);
			    this.byId("IdCasadoDesde").setVisible(true);
			    this.byId("IdCasadoDesde").setRequired(true);
				
			}
			
		},

		onTrans: function (oEvent) {
			var event = oEvent;
			var Transgenero = this.byId("IdTransgenero").getSelectedKey();
			
			if (Transgenero === "00") {
				this.byId("IdNomeSocial").setVisible(true);
			    this.byId("FormNomeSocial").setVisible(true);
			} else {
				this.byId("IdNomeSocial").setVisible(false);
			    this.byId("FormNomeSocial").setVisible(false);
			}
			
			
			var Transgeneroe = this.byId("IdTransgenero_Edit").getSelectedKey();
			
			if (Transgeneroe === "00") {
				this.byId("IdNomeSocial_Edit").setVisible(true);
			    this.byId("FormNomeSocial_Edit").setVisible(true);
			} else {
				this.byId("IdNomeSocial_Edit").setVisible(false);
			    this.byId("FormNomeSocial_Edit").setVisible(false);
			
			}
			
		},

		onBackMaster: function () {
			this.getRouter().navTo("master");
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
			var Genero = view.byId("idGenero").getSelectedKey();
			var Orientacao = view.byId("IdOrientacaoSex").getSelectedKey();
			var Transgenero = view.byId("IdTransgenero").getSelectedKey();
			var NomeSocial = view.byId("IdNomeSocial").getValue();
			var Aceite = view.byId("RealCheckBox_edit").getSelected();
			var dialog;
			var oModel = this.getView().getModel();
			var that = this;
			var erro;
			var erro2;
			var messagem;
			var key;
			var oEntry = {};
			
			if (Genero === "" || Orientacao === "" || Transgenero === "" || Raca === "" ||  EstCivil === ""){
				sap.m.MessageBox.error("Preencha todos os campos obrigatórios.");
				return;
			}

			if (NomeCompleto === "" || NomeCompleto === undefined) {
				view.byId("IdNomeCompleto").setValueState("Error");
				sap.m.MessageBox.error("Informe o nome completo.");
				return;
			} else {
				view.byId("IdNomeCompleto").setValueState("None");
				oEntry.Nome = NomeCompleto;
			}

			DataNascimento = DataNascimento.substring(0, 4) + DataNascimento.substring(5, 7) + DataNascimento.substring(8, 10);
			oEntry.DtNasc = DataNascimento;

			if (Sexo === "" || Sexo === undefined) {
				view.byId("IdSexo").setValueState("Error");
				sap.m.MessageBox.error("Informe o sexo.");
				return;
			} else {
				view.byId("IdSexo").setValueState("None");
				oEntry.Sexo = Sexo;
			}

			oEntry.Nacionalidade = Nacionaliade;
			oEntry.Municipio = LocalNascimento;
			oEntry.CodNaturalidade = CodNaturalidade;
			oEntry.Estado = EstNasc;
			oEntry.Pais = PaisNasc;
			oEntry.Idioma = Idioma;
			oEntry.Genero = Genero;
			oEntry.Orientacaosex = Orientacao;
			oEntry.Transgenero = Transgenero;

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

			oEntry.Raca = Raca;
			oEntry.Aposentado = Aposentado;
			oEntry.Tipo = "X";
			oEntry.NomeSocial = NomeSocial;

			if (Aceite === true) {
				oEntry.Aceite = "X";
			} else {
				oEntry.Aceite = "";
				sap.m.MessageBox.error("O aceite do formulário é uma inforamção obrigatória");
				return;
			}
			
			
			

			key = "/ZET_MEUS_DADOS_ECSet(Pernr='0',Tipo='G',Chamado='0')";

			dialog = new Dialog({
				title: "Confirma\xE7\xE3o",
				type: "Message",
				content: new Text({
					text: "Os ajustes serão efetivados ou poderão seguir fluxo de aprovação deseja continuar?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(key, oEntry, {
							success: function (oData, oResponse) {

								sap.m.MessageBox.success(
									"Sua inclusão/alteração foi iniciada e seguirá para processamento. Aguarde retorno ou acompanhe pelo app.", {
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
				this._valueHelpDialog1 = sap.ui.xmlfragment("Y5GL_EC_CAD2.Y5GL_EC_CAD2.view.LocNascimento", this);
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
			
			var specialChars = /[^a-zA-Z0-9-_ ]/g;
			var fileName = oEvent.getParameter("fileName").split(".", 1);
			
			if (fileName[0].match(specialChars)){
				sap.m.MessageBox.error("O arquivo que você está tentando importar, possui caracteres especiais no nome. Renomeie o arquivo e tente novamente!");
				return;
			}

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

			if (idTipo === "Em ResoluÃ§Ã£o") {
				sap.m.MessageBox.error("Não será possivel exclusão do anexo, quando o chamado ja existir.");
				return;
			}

			var Key = "/ZET_GLRH_UPLOADSet(Ano='" + Ano + "',Favor='" + Favor + "',Infty='" + Infty + "',Mes='" + Mes + "',Pernr='" + Pernr +
				"',Tipo='" + Tipo + "',Subty='" + Subty + "',DocId=" + docid + ",Objps='',Icnum='',Dependentes='',Valor='',Area='')";
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
									actions: ["OK"],
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
									actions: ["OK"],
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
		},

		formatAceite: function (oValue) {
			if (oValue) {
				return true;
			} else {
				return false;
			}
		},

		Genero: function () {
			var key = this.getView().byId("idGenero").getSelectedKey();
			var msg;
			switch (key) {
			case "00":
				msg = "Masculino (pessoa que se identifica com o gênero masculino";
			case "01":
				msg = "Feminino (pessoa que se identifica com o gênero feminino)";
			case "02":
				msg = "Não-binário (pessoa que não se identifica com o gênero masculino nem feminino)";
			case "03":
				msg = "Prefiro não me identificar";
			case "":
				msg = "00 - Masculino (pessoa que se identifica com o gênero masculino \n 01 - Feminino (pessoa que se identifica com o gênero feminino) \n 02 - Não-binário (pessoa que não se identifica com o gênero masculino nem feminino) \n 03 - Prefiro não me identificar";
			}
			sap.m.MessageBox.information(msg);
		},

		naoOrientacaoSexual: function () {
			var key = this.getView().byId("IdOrientacaoSex").getSelectedKey();
			var msg;
			switch (key) {
			case "00":
				msg = "Heterossexual (pessoa que sente atração por pessoas do gênero oposto)";
				break;
			case "01":
				msg = "Gay (homem que sente atração por outros homens)";
				break;
			case "02":
				msg = "Prefiro não responder.";
				break;
			case "03":
				msg = "Lésbica (mulher que sente atração por outras mulheres)";
				break;
			case "04":
				msg = "Bissexual (pessoa que sente atração por dois ou mais gêneros)";
				break;
			case "05":
				msg = "Pansexual (pessoa que sente atração por pessoas de todos os gêneros)";
				break;
			case "06":
				msg = "Assexual (pessoa que não sente atração afetivo e/ou sexual)";
				break;
			case "":
				msg =
					"00 - Heterossexual (pessoa que sente atração por pessoas do gênero oposto) \n 01 - Gay (homem que sente atração por outros homens) \n 02 - Prefiro não responder. \n 03 - Lésbica (mulher que sente atração por outras mulheres) \n 04 - Bissexual (pessoa que sente atração por dois ou mais gêneros) \n 05 - Pansexual (pessoa que sente atração por pessoas de todos os gêneros) \n 06 - Assexual (pessoa que não sente atração afetivo e/ou sexual)";
				break;
			}

			sap.m.MessageBox.information(msg);
		},
		buttonTrans: function () {
			var key = this.getView().byId("IdTransgenero").getSelectedKey();
			var msg;

			if (key === "01") {
				msg = "Cisgênero: Cisgênero (ou cis) é a pessoa que se identifica com o gênero que lhe foi atribuído ao nascer.";
			} else {
				msg =
					"Transgênero (ou trans) é a pessoa cuja identidade não corresponde ao gênero que lhe foi atribuído ao nascer \n Cisgênero: Cisgênero (ou cis) é a pessoa que se identifica com o gênero que lhe foi atribuído ao nascer.";
			}
			sap.m.MessageBox.information(msg);
		},

		onChangeReal: function (oEvent) {
			var value = oEvent.getParameters("value");
	/*		var key = this.getView().byId("IdTransgenero_Edit").getSelectedKey();
			
		if (value.value === "Sim") {
				this.getView().byId("IdNomeSocial_Edit").setVisible(true);
			    this.getView().byId("FormNomeSocial_Edit").setVisible(true);
			} else {
				this.getView().byId("IdNomeSocial_Edit").setVisible(false);
			    this.getView().byId("FormNomeSocial_Edit").setVisible(false);
				
			}
		//	if (value) {
				//this.getView().byId("RealCheckBox_edit").setSelected(true);
		//	} */
		},

		formatReal: function () {
			var idGenero = this.getView().byId("idGenero").getSelectedKey();
			var IdOrientacaoSex = this.getView().byId("IdOrientacaoSex").getSelectedKey();
			var IdTransgenero = this.getView().byId("IdTransgenero").getSelectedKey();

			if (idGenero || IdOrientacaoSex || IdTransgenero) {
				return true;
			} else {
				return false;
			}
		}

	});

});