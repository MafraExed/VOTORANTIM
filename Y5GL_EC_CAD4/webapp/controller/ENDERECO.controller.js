sap.ui.define([
	"Y5GL_EC_CAD4/Y5GL_EC_CAD4/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text"
], function (BaseController, JSONModel, Dialog, Button, Text) {
	"use strict";

	return BaseController.extend("Y5GL_EC_CAD4.Y5GL_EC_CAD4.controller.ENDERECO", {

		onInit: function () {
			this.getRouter().getRoute("ENDERECO").attachPatternMatched(this._onObjectMatched, this);

			this.buscaImagem();
		},

		FormatFalse: function (value) {
			return false;
		},
		
		FormatIdZzcounc: function(){
			var IdZzregion = this.getView()	.byId("IdZzregion").getSelectedKey();
			
			return IdZzregion;
		},

		formatVisibleEdit: function (oValue) {
			if (oValue === "Em ResoluÃ§Ã£o") {
				return false;
			} else {
				return true;
			}
		},

		formatVisible: function (oValue) {
			if (oValue === "Em ResoluÃ§Ã£o") {
				return true;
			} else {
				return false;
			}
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
					oModel = response;
					that.BuscaEndereco(oModel);
				},
				error: function () {

				}
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
			oViewModel.setSizeLimit(1000);
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

			var status = this.getView().byId("idTipo").getValue();
			if (status === 'X') {
				this.getView().byId("IdEditDetailDep").setVisible(false);
			}
			this.getView().byId("IdTipo_End").setEditable(false);
			
			this.filtraProvinicia();
		},

		filtraProvinicia: function () {
			var Zzregion = this.getView().byId("IdZzregion").getSelectedKey();
			var Zzcounc = this.getView().byId("IdZzcounc");
			var oFilterZzregion = new sap.ui.model.Filter("Regio", sap.ui.model.FilterOperator.EQ, Zzregion);

			Zzcounc.getBinding("items").filter([oFilterZzregion]);
			
			this.filtraDistrito();
		},

		filtraDistrito: function () {
			var Zzregion = this.getView().byId("IdZzregion").getSelectedKey();
			var Zzcounc = this.getView().byId("IdZzcounc").getSelectedKey();

			var oFilterZzregion = new sap.ui.model.Filter("Regio", sap.ui.model.FilterOperator.EQ, Zzregion);
			var oFilterZzcounc = new sap.ui.model.Filter("Counc", sap.ui.model.FilterOperator.EQ, Zzcounc);

			var IdZzcityc = this.getView().byId("IdZzcityc");

			IdZzcityc.getBinding("items").filter([oFilterZzregion, oFilterZzcounc]);
		},

		onCancela: function () {
			this.getView().getModel().refresh(true);
		},

		onChangeZzregion: function () {
			var Zzregion = this.getView().byId("IdZzregion").getSelectedKey();
			var Zzcounc = this.getView().byId("IdZzcounc");
			var oFilterZzregion = new sap.ui.model.Filter("Regio", sap.ui.model.FilterOperator.EQ, Zzregion);

			Zzcounc.getBinding("items").filter([oFilterZzregion]);
			this.getView().byId("IdZzcounc").setEditable(true);
		},

		onChangeZzcounc: function () {
			var Zzregion = this.getView().byId("IdZzregion").getSelectedKey();
			var Zzcounc = this.getView().byId("IdZzcounc").getSelectedKey();

			var oFilterZzregion = new sap.ui.model.Filter("Regio", sap.ui.model.FilterOperator.EQ, Zzregion);
			var oFilterZzcounc = new sap.ui.model.Filter("Counc", sap.ui.model.FilterOperator.EQ, Zzcounc);

			var IdZzcityc = this.getView().byId("IdZzcityc");

			IdZzcityc.getBinding("items").filter([oFilterZzregion, oFilterZzcounc]);
			this.getView().byId("IdZzcityc").setEditable(true);
		},

		onChangeZzcityc: function () {
			var Zzregion = this.getView().byId("IdZzregion").getSelectedKey();
			var Zzcounc = this.getView().byId("IdZzcounc").getSelectedKey();
			var Zzcityc = this.getView().byId("IdZzcityc").getSelectedKey();
			var IdZzubigeo = Zzregion + Zzcounc + Zzcityc;

			this.getView().byId("IdZzubigeo").setValue(IdZzubigeo);

		},

		onEdit: function () {

			this.getView().byId("IdCEP").setEditable(true);
			this.getView().byId("IdNumero").setEditable(true);
			this.getView().byId("IdComplemento").setEditable(true);
			this.getView().byId("IdTipoEnd").setEditable(false);
			this.getView().byId("IdRua").setEditable(true);
			this.getView().byId("IdBairro").setEditable(true);
			this.getView().byId("IdCidade").setEditable(true);
			this.getView().byId("idProvincia").setEditable(true);
			this.getView().byId("IdCodMunicipio").setEditable(true);
			this.getView().byId("IdLand1").setEditable(true);
			this.getView().byId("IdZztpcalle").setEditable(true);
			this.getView().byId("IdZztpzona").setEditable(true);
			this.getView().byId("IdZdszon").setEditable(true);
			this.getView().byId("IdZzregion").setEditable(true);
			this.getView().byId("IdZzcounc").setEditable(false);
			this.getView().byId("IdZzcityc").setEditable(false);
			//this.getView().byId("IdZzinddi").setEditable(true);
			this.getView().byId("IdZzubigeo").setEditable(false);
			//this.getView().byId("IdZzcodlardis").setEditable(true);
			this.getView().byId("Idtelnr").setEditable(true);

			this.getView().byId("IdSalvarDetailDep").setVisible(true);
			this.getView().byId("IdCancelaAprov").setVisible(true);
			this.getView().byId("UPLOAD").setVisible(true);
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
					value: encodeURIComponent(sSlug)
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
			var dialog;
			var erro;
			var that = this;
			var oModel = this.getView().getModel();
			var key;
			var oEntry = {};
			var erro2;
			var messagem;

			var IdTipoEnd = this.getView().byId("IdTipoEnd").getSelectedKey();
			oEntry.Subty = IdTipoEnd;

			if (oEntry.Subty === "") {
				this.getView().byId("IdTipoEnd").setValueState("Error");
				sap.m.MessageBox.error("Informe o tipo de endereço");
				return;
			} else {
				this.getView().byId("IdTipoEnd").setValueState("Success");
			}

			var IdCEP = this.getView().byId("IdCEP").getValue();
			oEntry.Cep = IdCEP;

			var IdTipo_End = this.getView().byId("IdTipo_End").getSelectedKey();
			oEntry.Zztpend = IdTipo_End;

			var IdRua = this.getView().byId("IdRua").getValue();
			oEntry.Rua = IdRua;

			var IdNumero = this.getView().byId("IdNumero").getValue();
			oEntry.Numero = IdNumero;

			var IdComplemento = this.getView().byId("IdComplemento").getValue();
			oEntry.Complemento = IdComplemento;

			var IdBairro = this.getView().byId("IdBairro").getValue();
			oEntry.Bairro = IdBairro;

			var IdCidade = this.getView().byId("IdCidade").getValue();
			oEntry.Cidade = IdCidade;

			var Provincia = this.getView().byId("idProvincia").getSelectedKey();
			oEntry.State = Provincia;

			var IdCodMunicipio = this.getView().byId("IdCodMunicipio").getValue();
			oEntry.Ibge = IdCodMunicipio;

			var Land1 = this.getView().byId("IdLand1").getSelectedKey();
			oEntry.Land1 = Land1;

			var Zztpcalle = this.getView().byId("IdZztpcalle").getSelectedKey();
			oEntry.Zztpcalle = Zztpcalle;

			var IdZztpzona = this.getView().byId("IdZztpzona").getSelectedKey();
			oEntry.Zztpzona = IdZztpzona;

			var IdZdszon = this.getView().byId("IdZdszon").getValue();
			oEntry.Zdszon = IdZdszon;

			var Zzregion = this.getView().byId("IdZzregion").getSelectedKey();
			oEntry.Zzregion = Zzregion;

			var Zzcounc = this.getView().byId("IdZzcounc").getSelectedKey();
			oEntry.Zzcounc = Zzcounc;

			var Zzcityc = this.getView().byId("IdZzcityc").getSelectedKey();
			oEntry.Zzcityc = Zzcityc;

			// var Zzinddi = this.getView().byId("IdZzinddi").getSelectedKey();
			// oEntry.Zzinddi = Zzinddi;
			
			var telnr = this.getView().byId("Idtelnr").getValue();
			oEntry.Telnr = telnr;

			// var Zzcodlardis = this.getView().byId("IdZzcodlardis").getSelectedKey();
			// oEntry.Zzcodlardis = Zzcodlardis;

			key = "/ZET_GLHR_CAD_ENDERECOSet(ITipo='M',Pernr='0',Subty='" + IdTipoEnd + "')";

			dialog = new Dialog({
				title: "Confirmación",
				type: "Message",
				content: new Text({
					text: "¿Confirmar la grabación de la dirección?"
				}),
				beginButton: new Button({
					text: "Sí",
					press: function () {
						oModel.update(key, oEntry, {
							success: function (oData, oResponse) {
								sap.m.MessageBox.success("DIRECCIÓN REGISTRADA CON ÉXITO!", {
									actions: ["OK"],
									onClose: function (sAction) {
										that.getView().getModel().refresh(true);
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
			var Area = "0";

			var UploadCollection = this.getView().byId("UploadCollection");

			if (idTipo === "Em ResoluÃ§Ã£o") {
				sap.m.MessageBox.error("No será posible eliminar el archivo adjunto cuando el ticket ya exista.");
				return;
			}

			var Key = "/ZET_GLRH_UPLOADSet(Ano='" + Ano + "',Favor='" + Favor + "',Infty='" + Infty + "',Mes='" + Mes + "',Pernr='" + Pernr +
				"',Tipo='" + Tipo + "',Subty='" + Subty + "',DocId=" + docid + ",Objps='',Icnum='',Valor='',Dependentes='',Area='" + Area + "')";;
			var oEntry = {};
			oEntry.DocId = 1;

			var dialog = new Dialog({
				title: "Confirmación",
				type: "Message",
				content: new Text({
					text: "¿Confirmar la eliminación del archivo adjunto?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(Key, oEntry, {
							success: function (oData, oResponse) {
								sap.m.MessageBox.success("Documentos eliminados correctamente.", {
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

		uploadButtonInvisible: function (oValue) {
			if (oValue === "Em ResoluÃ§Ã£o") {
				return true;
			} else {
				return false;
			}
		}

	});

});