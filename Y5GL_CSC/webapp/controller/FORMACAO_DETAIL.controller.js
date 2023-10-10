sap.ui.define([
	"Y5GL_CSC/Y5GL_CSC/controller/BaseController",
	"sap/ui/Device",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text"
], function (BaseController, Device, Dialog, Button, Text) {
	"use strict";
	var type;
	var Pernr;
	return BaseController.extend("Y5GL_CSC.Y5GL_CSC.controller.FORMACAO_DETAIL", {

		onInit: function () {

			this.getRouter().getRoute("FORMACAO_DETAIL").attachPatternMatched(this._onObjectMatched, this);

			var sName = sap.ushell.Container.getUser().getFullName();
			this.getView().byId("idTitleDep").setText(sName);

			// Image loading
			var sRootPath = jQuery.sap.getModulePath("Y5GL_CSC.Y5GL_CSC");
			var sImagePath = sRootPath + "/imagens/Transparente_CBA.gif";
			this.getView().byId("idimg").setSrc(sImagePath);
		},
		
		formatVisibleEdit: function (oValue) {
			if (oValue === "Em ResoluÃ§Ã£o") {
				return false;
			} else {
				return true;
			}
		},
		
		onVoltar: function () {
			this.getRouter().navTo("worklist");
		},

		onBackMaster: function () {
			this.getRouter().navTo("master");
		},

		_onObjectMatched: function (oEvent) {
			type = "A";
			this.getView().byId("UploadCollection").setUploadButtonInvisible(true);

			Pernr = oEvent.getParameter("arguments").Pernr;
			
			this.getView().byId("idTitleMeuCadastro").setText("Formação Educacional - (Matrícula - " + Pernr + ")");         
			var Slart = oEvent.getParameter("arguments").Slart;
			var Chamado = oEvent.getParameter("arguments").Chamado;
			
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("ZET_GLHR_FORM_EMP_ECSet", {
					Pernr: Pernr,
					Slart: Slart,
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
				// if object could not be found, the selection in the master listNOTE
				// does not make sense anymore.
				//this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}

			var IdDenCursoTESTE = this.getView().byId("IdDenCursoTESTE").getValue();

			while (IdDenCursoTESTE.indexOf(".") !== -1) {
				IdDenCursoTESTE = IdDenCursoTESTE.replace(".", "-");
			}

			this.getView().byId("IdDtFimForm").setValue(IdDenCursoTESTE);

			var Infty = "0022";
			var Subty = this.getView().byId("IdEstEnsino").getSelectedKey();

			if (Subty !== "") {
				var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr);
				var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, Infty);
				var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, Subty);
				var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "U");
				var oList = this.getView().byId("UploadCollection");

				oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo]);
			}
		},

		_onDetail: function () {},

		onChangeIdFormacao: function (oEvent) {
			var IdFormacao = this.getView().byId("IdFormacao").getSelectedKey();

			if (IdFormacao === "00000000") {
				this.getView().byId("IdDenCurso").setEditable(true);
			} else {
				this.getView().byId("IdDenCurso").setEditable(false);
			}
		},

		onAdiciona: function (oEvent) {
			this.getView().getModel().refresh(true);
			type = "I";
			this.getView().byId("UploadCollection").setUploadButtonInvisible(false);

			Pernr = oEvent.getParameter("arguments").Pernr;
			var Slart = oEvent.getParameter("arguments").Slart;

			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("ZET_GLHR_FORM_EMP_ECSet", {
					Pernr: 0,
					Slart: 0,
					Tipo: "I"
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));

			this.getView().byId("IdEditDetailDep").setVisible(false);
			this.getView().byId("IdSalvarDetailDep").setVisible(true);
			this.getView().byId("IdCancelarDetailDep").setVisible(false);

		},

		formatEditable: function (value) {
			if (value !== "" && value !== undefined && value !== "0") {
				return false;
			} else {
				return true;
			}
		},

		formatVisible: function (value) {
			if (value !== "" && value !== undefined) {
				return true;
			} else {
				return false;
			}
		},

		formatNotVisible: function (value) {
			if (value !== "" && value !== undefined) {
				return false;
			} else {
				return true;
			}
		},

		onEdit: function () {

			this.getView().byId("IdEstEnsino").setEditable(true);
			this.getView().byId("IdInstituicao").setEditable(true);
			this.getView().byId("IdPais").setEditable(true);
			this.getView().byId("IdCertificado").setEditable(true);
			this.getView().byId("IdDuracao").setEditable(true);
			this.getView().byId("IdTpDuracao").setEditable(true);
			this.getView().byId("IdDenCurso").setEditable(true);
			this.getView().byId("IdDtFimForm").setEditable(true);
			this.getView().byId("IdDenCursoTESTE").setEditable(true);
			this.getView().byId("IdFormacao").setEditable(true);

			this.getView().byId("IdSalvarDetailDep").setVisible(true);
			this.getView().byId("IdCancelarDetailDep").setVisible(true);

			this.getView().byId("IdEditDetailDep").setVisible(false);

			this.getView().byId("UploadCollection").setUploadButtonInvisible(false);
		},

		onCancel: function () {
			this.getView().getModel().refresh(true);

			this.getView().byId("IdCancelarDetailDep").setVisible(false);
			if (type !== "I") {
				this.getView().byId("UploadCollection").setUploadButtonInvisible(true);
			}

			this.getView().byId("IdEstEnsino").setValueState("None");
			this.getView().byId("IdFormacao").setValueState("None");
			this.getView().byId("IdInstituicao").setValueState("None");
			this.getView().byId("IdPais").setValueState("None");
			this.getView().byId("IdCertificado").setValueState("None");
			this.getView().byId("IdDuracao").setValueState("None");
			this.getView().byId("IdTpDuracao").setValueState("None");
			this.getView().byId("IdDenCurso").setValueState("None");
			this.getView().byId("IdDtFimForm").setValueState("None");
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
			var Infty = "0022";
			var Subty = this.getView().byId("IdEstEnsino").getSelectedKey();
			var Objps = "0";
			if (Pernr !== "" || Subty !== "" || Objps !== "") {
				var sSlug = Pernr + "$" + Infty + "$" + Subty + "$" + Objps + "$" + oEvent.getParameter("fileName");
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
			var Infty = "0022";
			var Subty = this.getView().byId("IdEstEnsino").getSelectedKey();
			var tipo = "U";

			if (Subty !== "") {
				var oFilterPenr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr);
				var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, Infty);
				var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, Subty);
				var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, tipo);
				var oList = this.getView().byId("UploadCollection");

				oList.getBinding("items").filter([oFilterPenr,oFilterInfty, oFilterSubty, oFilterTipo]);
			}
		},

		onmodelListContextChange: function (oEvent) {
			var Infty = "0022";
			var Subty = this.getView().byId("IdEstEnsino").getSelectedKey();
			var Tipo = "U";
			if (Subty !== "") {
				var oFilterPenr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr);
				var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, Infty);
				var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, Subty);
				var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, Tipo);
				var oList = this.getView().byId("UploadCollection");
				oList.getBinding("items").filter([oFilterPenr,oFilterInfty, oFilterSubty, oFilterTipo]);
			}
		},

		formatEditableKsbez: function (oValue) {
			if (oValue === "Outros") {
				return true;
			} else {
				return false;
			}
		},

		onSave: function () {
			var dialog;
			var that = this;
			var oModel = this.getView().getModel();
			var oEntry = {};
			var slart = this.getView().byId("IdEstEnsino").getSelectedKey();
			var Key = "/ZET_GLHR_FORM_EMP_ECSet(Pernr='" + Pernr + "',Slart='" + slart + "',Tipo='G')";

			oEntry.Slart = this.getView().byId("IdEstEnsino").getSelectedKey();
			if (oEntry.Slart === "" || oEntry.Slart === "0") {
				this.getView().byId("IdEstEnsino").setValueState("Error");
				sap.m.MessageBox.error("Por favor, informe o tipo de Estabelecimento de Ensino.");
				return;
			} else {
				this.getView().byId("IdEstEnsino").setValueState("Success");
			}

			oEntry.Ausbi = this.getView().byId("IdFormacao").getSelectedKey();

			if (oEntry.Ausbi === "" || oEntry.Ausbi === "0") {
				this.getView().byId("IdFormacao").setValueState("Error");
				sap.m.MessageBox.error("Por favor, informe a formação.");
				return;
			} else {
				this.getView().byId("IdFormacao").setValueState("Success");
			}

			oEntry.Insti = this.getView().byId("IdInstituicao").getValue();

			if (oEntry.Insti === "") {
				this.getView().byId("IdInstituicao").setValueState("Error");
				sap.m.MessageBox.error("Por favor, informe a instituição de ensino.");
				return;
			} else {
				this.getView().byId("IdInstituicao").setValueState("Success");
			}

			oEntry.Sland = this.getView().byId("IdPais").getSelectedKey();

			if (oEntry.Sland === "") {
				this.getView().byId("IdPais").setValueState("Error");
				sap.m.MessageBox.error("Por favor, selecione o Pais.");
				return;
			} else {
				this.getView().byId("IdPais").setValueState("Success");
			}

			oEntry.Slabs = this.getView().byId("IdCertificado").getSelectedKey();

			if (oEntry.Slabs === "") {
				this.getView().byId("IdCertificado").setValueState("Error");
				sap.m.MessageBox.error("Por favor, informe se a formação contem Certificado.");
				return;
			} else {
				this.getView().byId("IdCertificado").setValueState("Success");
			}

			oEntry.Anzkl = this.getView().byId("IdDuracao").getValue();
			if (oEntry.Anzkl === "" || oEntry.Anzkl === "0") {
				this.getView().byId("IdDuracao").setValueState("Error");
				sap.m.MessageBox.error("Por favor, informe duração.");
				return;
			} else {
				this.getView().byId("IdDuracao").setValueState("Success");
			}

			oEntry.Anzeh = this.getView().byId("IdTpDuracao").getSelectedKey();

			if (oEntry.Anzeh === "") {
				this.getView().byId("IdTpDuracao").setValueState("Error");
				sap.m.MessageBox.error("Por favor, informe unidade de tempo.");
				return;
			} else {
				this.getView().byId("IdTpDuracao").setValueState("Success");
			}

			oEntry.Ksbez = this.getView().byId("IdDenCurso").getValue();

			if (oEntry.Ksbez === "") {
				if (oEntry.Ausbi === "00000000") {
					this.getView().byId("IdDenCurso").setValueState("Error");
					sap.m.MessageBox.error("Por favor, para quando a formação for Outros, deverá ser preenchido o campo denominação do curso.");
					return;
				} else {
					this.getView().byId("IdDenCurso").setValueState("Success");
				}
			}else{
				this.getView().byId("IdDenCurso").setValueState("Success");
			}

			oEntry.ZenddaForm = this.getView().byId("IdDtFimForm").getValue();

			if (oEntry.ZenddaForm === "") {
				this.getView().byId("IdDtFimForm").setValueState("Error");
				sap.m.MessageBox.error("Por favor, data fim da formação.");
				return;
			} else {
				this.getView().byId("IdDtFimForm").setValueState("Success");
			}

			dialog = new Dialog({
				title: "Confirma\xE7\xE3o",
				type: "Message",
				content: new Text({
					text: "Após a confirmação não será possivel alterar o anexo até que o processo seja finalizado. Deseja seguir?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(Key, oEntry, {
							success: function (oData, oResponse) {
								sap.m.MessageBox.success("Sua inclusão/alteração foi iniciada e seguirá para processamento. Aguarde retorno ou acompanhae pelo app.", {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function (sAction) {
										that.getView().getModel().refresh(true);
										that.getRouter().navTo("FORMACAO");
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
										if (type === "A") {
											that.getView().getModel().refresh(true);
											that.getView().byId("UploadCollection").setUploadButtonInvisible(true);
										}
										if (type === "I") {
											that.getView().byId("IdCancelarDetailDep").setVisible(true);
										}
										//that.getView().byId("IdCancelarDetailDep").setVisible(false);
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
			var Infty = "0022";
			var Subty = this.getView().byId("IdEstEnsino").getSelectedKey();
			var oModel = this.getView().getModel();
			var Ano = "0";
			var Favor = "0";
			var Infty = Infty;
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
			
			var UploadCollection = this.getView().byId("UploadCollection");
			
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

	});

});