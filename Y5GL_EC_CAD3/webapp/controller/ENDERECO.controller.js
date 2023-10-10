sap.ui.define([
	"Y5GL_EC_CAD3/Y5GL_EC_CAD3/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text"
], function (BaseController, JSONModel, Dialog, Button, Text) {
	"use strict";

	return BaseController.extend("Y5GL_EC_CAD3.Y5GL_EC_CAD3.controller.ENDERECO", {

		onInit: function () {
			this.getRouter().getRoute("ENDERECO").attachPatternMatched(this._onObjectMatched, this);

			this.buscaImagem();
		},

		formatVisibleEdit: function (oValue) {
			if (oValue === "Em ResoluÃ§Ã£o") {
				return false;
			} else {
				return true;
			}
		},
		
		formatFalse: function (oValue) {
			
				return false;
			
		},

		onChangeCEP: function () {
			var cep = this.getView().byId("IdCEP").getValue();
			var url = "https://viacep.com.br/ws/" + cep + "/json/?callback=callback_name";
			var oModel;
			var that = this;

			$.ajax({
				url: url,
				dataType: "jsonp",
				success: function (response) {
					///oModel = response;
					///that.BuscaEndereco(oModel);
				},
				error: function () {
				}
			});
		that.BuscaEnderecoNovo();
		},

		BuscaEnderecoNovo: function () {
			var cep = this.getView().byId("IdCEP").getValue();
			var url = "https://viacep.com.br/ws/" + cep + "/json/";
			var oModel;
			var that = this;
			
			fetch(url).then(function(response) {
			  return response.json();
			}).then(function(response) {
/*			//o Resultado em JSON está aqui no DATA
			  console.log(data);
			}).catch(function() {
			  console.log("Booo");*/
			  
				oModel = response;
				that.BuscaEndereco(oModel);
				
			});
		},
		
		BuscaEndereco: function (oModel) {
			var rua = oModel.logradouro;
			var bairro = oModel.bairro;
			var cidade = oModel.localidade;
			var uf = oModel.uf;
			var ibge = oModel.ibge;
			var cep = oModel.cep;

			this.getView().byId("IdRua").setValue(rua);
			this.getView().byId("IdBairro").setValue(bairro);
			this.getView().byId("IdCidade").setValue(cidade);
			this.getView().byId("IdUF").setValue(uf);
			this.getView().byId("IdCodMunicipio").setValue(ibge);
			this.getView().byId("IdCEP").setValue(cep);
			this.getView().byId("IdNumero").setValue("");
			this.getView().byId("IdComplemento").setValue("");

		},

		FormatEditable: function (value) {
			if (value !== "" || value === undefined) {
				return false;
			} else {
				return true;
			}
		},

		_onObjectMatched: function () {
			var ITipo = "V";
			var Pernr = "0";
			var Subty = "0";

			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("ZET_GLHR_CAD_ENDERECOSet", {
					ITipo: ITipo,
					Pernr: Pernr,
					Subty: Subty
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		onBackMaster: function () {
			this.getRouter().navTo("master");
		},

		_bindView: function (sObjectPath) {
			// Set busy indicator during view binding
			var that = this;
			var oViewModel = this.getView().getModel();
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

		FormatButtom1: function (value) {
			if (value !== "" || value === undefined) {
				return false;
			} else {
				return true;
			}
		},

		FormatButtom2: function (value) {
			if (value !== "" || value === undefined) {
				return true;
			} else {
				return false;
			}
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
			this.getView().byId("IdTipo_End").setEditable(false);
		},

		onCancela: function () {
			this.getView().getModel().refresh(true);
		},

		onEdit: function () {
			this.getView().byId("IdBairro").setEditable(true);
			this.getView().byId("IdRua").setEditable(true);
			this.getView().byId("IdCEP").setEditable(true);
			this.getView().byId("IdNumero").setEditable(true);
			this.getView().byId("IdComplemento").setEditable(true);
			this.getView().byId("IdTipo_End").setEditable(true);

			this.getView().byId("IdSalvarDetailDep").setVisible(true);
			this.getView().byId("IdCancelaAprov").setVisible(true);

			this.getView().byId("IdEditDetailDep").setVisible(false);

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
			var Infty = "0006";
			var Subty = this.getView().byId("IdTipoEnd").getSelectedKey();
			var Objps = "0";
			if (Pernr !== "" || Subty !== "" || Objps !== "") {
				var sSlug = Pernr + "$" + Infty + "$" + Subty + "$" + Objps + "$" + oEvent.getParameter("fileName");
				// Stellen die Kopf Parameter slug
				var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
					name: "slug",
					value: encodeURIComponent( sSlug )
				});
				oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);

			}
			//			_busyDialog.open();
		},

		onuploadComplete: function (oEvent) {

			var Pernr = "0";
			var Infty = "0006";
			var Subty = this.getView().byId("IdTipoEnd").getSelectedKey();
			var Tipo = "U";

			if (Pernr !== "" || Subty !== "") {
				var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, Infty);
				var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, Subty);
				var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, Tipo);
				var oList = this.getView().byId("UploadCollection");

				oList.getBinding("items").filter([oFilterInfty, oFilterSubty, oFilterTipo]);
			}
		},

		onmodelListContextChange: function (oEvent) {
			var Pernr = "0";
			var Infty = "0006";
			var Subty = this.getView().byId("IdTipoEnd").getSelectedKey();
			var Tipo = "U";
			if (Pernr !== "" || Subty !== "") {
				var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr);
				var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, Infty);
				var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, Subty);
				var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, Tipo);
				var oList = this.getView().byId("UploadCollection");
				oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo]);
			}
		},

		onSave: function () {
			var IdTipoEnd = this.getView().byId("IdTipoEnd").getSelectedKey();
			var IdCEP = this.getView().byId("IdCEP").getValue();
			var IdRua = this.getView().byId("IdRua").getValue();
			var IdNumero = this.getView().byId("IdNumero").getValue();
			var IdComplemento = this.getView().byId("IdComplemento").getValue();
			var IdBairro = this.getView().byId("IdBairro").getValue();
			var IdCidade = this.getView().byId("IdCidade").getValue();
			var IdUF = this.getView().byId("IdUF").getValue();
			var IdCodMunicipio = this.getView().byId("IdCodMunicipio").getValue();
			var IdTipo_End = this.getView().byId("IdTipo_End").getSelectedKey();
			var dialog;
			var erro;
			var that = this;
			var oModel = this.getView().getModel();
			var key;
			var oEntry = {};
			var erro2;
			var messagem;

			oEntry.Subty = IdTipoEnd;

			if (oEntry.Subty === "") {
				this.getView().byId("IdTipoEnd").setValueState("Error");
				sap.m.MessageBox.error("Informe o tipo de endereço");
				return;
			} else {
				this.getView().byId("IdTipoEnd").setValueState("Success");
			}

			oEntry.Cep = IdCEP;

			if (oEntry.Cep === "") {
				this.getView().byId("IdCEP").setValueState("Error");
				sap.m.MessageBox.error("Informe o CEP");
				return;
			} else {
				this.getView().byId("IdCEP").setValueState("Success");
			}

			oEntry.Rua = IdRua;
			oEntry.Numero = IdNumero;

			if (oEntry.Numero === "") {
				this.getView().byId("IdNumero").setValueState("Error");
				sap.m.MessageBox.error("Informe o numero do endereço");
				return;
			} else {
				this.getView().byId("IdNumero").setValueState("Success");
			}

			oEntry.Zztpend = IdTipo_End;

			if (oEntry.Zztpend === "") {
				this.getView().byId("IdTipo_End").setValueState("Error");
				sap.m.MessageBox.error("Informe o tipo de endereço");
				return;
			} else {
				this.getView().byId("IdTipo_End").setValueState("Success");
			}

			oEntry.Complemento = IdComplemento;
			oEntry.Bairro = IdBairro;
			oEntry.Cidade = IdCidade;
			oEntry.Uf = IdUF;
			oEntry.Ibge = IdCodMunicipio;

			key = "/ZET_GLHR_CAD_ENDERECOSet(ITipo='A',Pernr='0',Subty='" + IdTipoEnd + "')";

			dialog = new Dialog({
				title: "Confirma\xE7\xE3o",
				type: "Message",
				content: new Text({
					text: "Confirma a gravação de endereço?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(key, oEntry, {
							success: function (oData, oResponse) {
								sap.m.MessageBox.success("Endereço gravado com sucesso!", {
									actions: ["OK"],
									onClose: function (sAction) {
										that.getView().getModel().refresh(true);
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
										//that.getView().getModel().refresh(true);
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
				}
			});
			dialog.open();
		},

		onDeleteSelectedItems: function (oEvent) {
			var Pernr = "0";
			var Infty = "0006";
			var Subty = this.getView().byId("IdTipoEnd").getSelectedKey();
			var oModel = this.getView().getModel();
			var Ano = "0";
			var Favor = "0";
			var Infty = Infty;
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
				"',Tipo='" + Tipo + "',Subty='" + Subty + "',DocId=" + docid + ",Objps='',Icnum='')";
			var oEntry = {};
			oEntry.DocId = 1;

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
		}

	});

});