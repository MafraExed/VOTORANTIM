sap.ui.define([
	"Y5GL_EC_CAD2/Y5GL_EC_CAD2/controller/BaseController",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text"
], function (BaseController, Dialog, Button, Text) {
	"use strict";

	return BaseController.extend("Y5GL_EC_CAD2.Y5GL_EC_CAD2.controller.PESSOA_REFERENCIA", {

		onInit: function () {
			this.getRouter().getRoute("PESSOA_REFERENCIA").attachPatternMatched(this._onObjectMatched, this);
			this.buscaImagem();
		},

		_onObjectMatched: function () {
			var Tipo = "B";
			var Pernr = "0";

			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("ZET_GLHR_EC_CONTATOSet", {
					Tipo: Tipo,
					Pernr: Pernr
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
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

		_onBindingChange: function () {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();
			// No data for the binding
			// if (!oElementBinding.getBoundContext()) {
			// 	this.getRouter().getTargets().display("detailObjectNotFound");
			// 	// if object could not be found, the selection in the master list
			// 	// does not make sense anymore.
			// 	//this.getOwnerComponent().oListSelector.clearMasterListSelection();
			// 	return;
			// }
		},

/*
		onChangeCEP: function () {
			var that = this;
			var cep = this.getView().byId("IdCEP").getValue();
			if (cep !== "") {
				var url = "https://viacep.com.br/ws/" + cep + "/json/?callback=callback_name";
				var oModel;
				var that = this;

				$.ajax({
					url: url,
					dataType: "jsonp",
					success: function (response) {
						oModel = response;
						that.BuscaEndereco(oModel);
					},
					error: function () {
						sap.m.MessageBox.error("CEP não existe.");
						that.getView().byId("IdCEP").setValue("");
						return;
					}
				});
			} else {
				this.getView().byId("IdRua").setValue("");
				this.getView().byId("IdBairro").setValue("");
				this.getView().byId("IdCidade").setValue("");
				this.getView().byId("IdUF").setValue("");
				this.getView().byId("IdCodMunicipio").setValue("");
				this.getView().byId("IdCEP").setValue("");
			}
		},
*/
		
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

		onEdit: function () {
			this.getView().byId("IdTelefone").setEditable(true);
			this.getView().byId("IdCEP").setEditable(true);
			this.getView().byId("IdNumero").setEditable(true);
			this.getView().byId("IdComplemento").setEditable(true);
			this.getView().byId("IdName2").setEditable(true);

			this.getView().byId("IdCancelaAprov").setVisible(true);
			this.getView().byId("IdSalvarDetailDep").setVisible(true);
			this.getView().byId("IdEditDetailDep").setVisible(false);
		},

		onBackMaster: function () {
			this.getRouter().navTo("master");
		},

		onCancela: function () {
			this.getView().getModel().refresh(true);
		},

		onSave: function () {
			var that = this;
			var IdTipoEnd = this.getView().byId("IdTipoEnd").getSelectedKey();
			var IdTelefone = this.getView().byId("IdTelefone").getValue();
			var IdCEP = this.getView().byId("IdCEP").getValue();
			var IdTipo_End = this.getView().byId("IdTipo_End").getSelectedKey();
			var IdRua = this.getView().byId("IdRua").getValue();
			var IdNumero = this.getView().byId("IdNumero").getValue();
			var IdComplemento = this.getView().byId("IdComplemento").getValue();
			var IdBairro = this.getView().byId("IdBairro").getValue();
			var IdCidade = this.getView().byId("IdCidade").getValue();
			var IdUF = this.getView().byId("IdUF").getValue();
			var IdCodMunicipio = this.getView().byId("IdCodMunicipio").getValue();
			var IdName2 = this.getView().byId("IdName2").getValue();

			var oEntry = {};
			var oModel = this.getView().getModel();
			var Key = "/ZET_GLHR_EC_CONTATOSet(Pernr='0',Tipo='G')";
			oEntry.Name2 = IdName2;
			if (oEntry.Name2 === "") {
				sap.m.MessageBox.error("Informe o nome do contato.");
				return;
			}
			oEntry.Stras = IdRua;
			oEntry.Hsnmr = IdNumero;
			oEntry.Posta = IdComplemento;
			oEntry.Ort02 = IdBairro;
			oEntry.Ort01 = IdCidade;
			oEntry.Land1 = "BR";
			oEntry.Num01 = IdTelefone;
			if (oEntry.Num01 === "") {
				sap.m.MessageBox.error("Informe o telefone do contato de emergência");
				return;
			}

			oEntry.Subty = IdTipoEnd;
			oEntry.Pstlz = IdCEP;
			oEntry.Zztpend = IdTipo_End;

			oEntry.State = IdUF;
			oEntry.Zcodmun = IdCodMunicipio;

			var dialog = new Dialog({
				title: "Confirma\xE7\xE3o",
				type: "Message",
				content: new Text({
					text: "Confirma alteração/inclusão do Contato de emergencia?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(Key, oEntry, {
							success: function (oData, oResponse) {
								sap.m.MessageBox.success("Contato incluido/alterado com sucesso.", {
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
										that.getRouter().navTo("master");
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

		formatFalse: function () {
			return false;
		},

		formatTrue: function () {
			return true;
		}
	});
});