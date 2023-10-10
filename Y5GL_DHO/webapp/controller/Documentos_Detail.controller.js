sap.ui.define([
	"Y5GL_DHO/Y5GL_DHO/controller/BaseController",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text"
], function (BaseController, Dialog, Button, Text) {
	"use strict";

	var id;
	var id2;
	var Tipo;
	var Pernr;
	return BaseController.extend("Y5GL_DHO.Y5GL_DHO.controller.Documentos_Detail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Y5GL_DHO.Y5GL_DHO.view.Documentos_Detail
		 */
		onInit: function () {
			this.getRouter().getRoute("Documentos_Detail").attachPatternMatched(this._onObjectMatched, this);

			// Image loading
			var sRootPath = jQuery.sap.getModulePath("Y5GL_DHO.Y5GL_DHO");
			var sImagePath = sRootPath + "/imagens/loading.gif";
			this.getView().byId("idimg").setSrc(sImagePath);
		},

		onVoltar: function () {
			this.getRouter().navTo("worklist");
		},

		onBackMaster: function () {
			this.getRouter().navTo("master");
		},
		
		formaMsg: function(oValue){
			if (oValue === "Em ResoluÃ§Ã£o") {
				return true;
			} else {
				return false;
			}
		},

		formatVisibleEdit: function (oValue) {
			if (oValue === "Em ResoluÃ§Ã£o" || oValue === "X") {
				return false;
			} else {
				return true;
			}
		},
		
		FormatBV: function (oValue) {
			if (oValue === "Em ResoluÃ§Ã£o" || oValue === "" || oValue === null) {
				return false;
			} else {
				return true;
			}
		},
		
		formatVisibleUpload: function (oValue) {
			if (oValue === "Em ResoluÃ§Ã£o" || oValue === "") {
				return true;
			} else {
				return false;
			}
		},

		_onObjectMatched: function (oEvent) {
			this.getView().getModel().refresh(true);
			
			var IInfo = oEvent.getParameter("arguments").Subty;
				Tipo = oEvent.getParameter("arguments").Tipo;
			var IPernr = oEvent.getParameter("arguments").Pernr;
			var Chamado = oEvent.getParameter("arguments").Chamado;
			
			Pernr = IPernr;

			id = IInfo;
			id2 = IInfo;

			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("ZET_GLHR_MEUS_DOCUMENTOSSet", {
					IInfo: IInfo,
					IPernr: IPernr,
					ITipo: Tipo,
					Chamado: Chamado 
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
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master listNOTE
				// does not make sense anymore.
				//this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}
			id = id2;
			id = "_" + id;

			this.getView().byId(id).setVisible(true);
			
			if (Tipo === "N"){
				this.getView().byId("UploadCollection").setUploadButtonInvisible(false);
				this.getView().byId("IdSalvarDetailDep").setVisible(true);
				this.getView().byId("IdEditDetailDep").setVisible(false);
				this.getView().byId("IdCancelDetailDep").setVisible(false);
			}else{
				this.getView().byId("UploadCollection").setUploadButtonInvisible(true);
			}
		},

		FormatEditable: function (oValue) {
			if (oValue === "") {
				return true;
			} else {
				return false;
			}
		},

		FormatVisibleForm: function (oValue) {
			return false;
		},
		
		onSave: function(){
			var that = this;
			var oModel = this.getView().getModel();
			var erro;
			var erro2;
			var messagem;
			var oEntry = {};
			
			switch (id) {
			case "_0001":
				oEntry.CpfNr = this.getView().byId("idCpf").getValue();
				break;
			case "_0002":
				oEntry.IdentNr = this.getView().byId("idIdentNr").getValue();
				oEntry.Rgorg = this.getView().byId("idRgorg").getValue();
				oEntry.DtEmis = this.getView().byId("idDtEmis").getValue();
				oEntry.EsEmis = this.getView().byId("idEsEmis").getSelectedKey();
				break;
			case "_0003":
				oEntry.CtpsNr = this.getView().byId("idCtpsNr").getValue();
				oEntry.CtpsSerie = this.getView().byId("idCtpsSerie").getValue();
				oEntry.DtEmis = this.getView().byId("idDtEmis_3").getValue();
				oEntry.EsEmis = this.getView().byId("idEsEmis_3").getSelectedKey();
				break;
			case "_0004":
				oEntry.CregNr = this.getView().byId("idCregNr").getValue();
				oEntry.CregName = this.getView().byId("idCregName").getValue();
				oEntry.CregInit = this.getView().byId("idCregInit").getValue();
				oEntry.DtEmis = this.getView().byId("idDtEmis_0004").getValue();
				oEntry.EsEmis = this.getView().byId("idEsEmis_4").getSelectedKey();
				oEntry.Ocorg = this.getView().byId("idOcorg").getValue();
				oEntry.Zvalidade = this.getView().byId("idZvalidade").getValue();
				oEntry.ZorgEmis = this.getView().byId("idZorgEmis").getValue();
				break;
			case "_0005":
				oEntry.ElecNr = this.getView().byId("idElecNr").getValue();
				oEntry.ElecZone = this.getView().byId("idElecZone").getValue();
				oEntry.ElecSect = this.getView().byId("idElecSect").getValue();
				oEntry.DtEmis = this.getView().byId("idDtEmis_5").getValue();
				oEntry.EsEmis = this.getView().byId("idEsEmis_5").getValue();
				break;
			case "_0006":
				oEntry.PisNr = this.getView().byId("idPisNr").getValue();
				oEntry.DtEmis = this.getView().byId("idDtEmis_6").getValue();
				break;
			case "_0007":
				oEntry.MilNr = this.getView().byId("idMilNr").getValue();
				oEntry.MilType = this.getView().byId("idMilType").getValue();
				oEntry.MilCat = this.getView().byId("idMilCat").getValue();
				oEntry.EsEmis = this.getView().byId("idDtEmis_7").getSelectedKey();
				break;
			case "_0008":
				oEntry.IdforNr = this.getView().byId("idIdforNr").getValue();
				oEntry.VisaType = this.getView().byId("idVisaType_8").getValue();
				oEntry.DtArrv = this.getView().byId("idDtArrv").getValue();
				oEntry.DtEmis = this.getView().byId("idDtEmis_8").getValue();
				oEntry.Rneorg = this.getView().byId("idRneorg").getValue();
				break;
			case "_0009":
				oEntry.VisaNr = this.getView().byId("idVisaNr").getValue();
				oEntry.VisaType = this.getView().byId("idVisaType").getValue();
				oEntry.DtEmis = this.getView().byId("idDtEmis_9").getValue();
				oEntry.ForeignSit = this.getView().byId("idForeignSit").getSelectedKey();
				oEntry.Zvalidade = this.getView().byId("idZvalidade_9").getSelectedKey();
				oEntry.ZclasTrab = this.getView().byId("idZclasTrab").getSelectedKey();
				break;
			case "_0010":
				oEntry.DriveNr = this.getView().byId("idDriveNr").getValue();
				oEntry.Cnhorg = this.getView().byId("idCnhorg").getValue();
				oEntry.DriveCat = this.getView().byId("idDriveCat").getSelectedKey();
				oEntry.DtEmis = this.getView().byId("idDtEmis_10").getValue();
				oEntry.EsEmis = this.getView().byId("idEsEmis_10").getSelectedKey();
				oEntry.Zvalidade = this.getView().byId("idZvalidade_10").getValue();
				oEntry.Zphab = this.getView().byId("idZphab").getValue();
				break;
			case "_0011":
				oEntry.VisaType = this.getView().byId("idVisaType_11").getValue();
				oEntry.DtArrv = this.getView().byId("idDtArrv_11").getValue();
				oEntry.PasspNr = this.getView().byId("idPasspNr_11").getValue();
				oEntry.DtEmis = this.getView().byId("idDtEmis_11").getValue();
				break;
			case "_0012":
				oEntry.NitNr = this.getView().byId("idNitNr").getValue();
				oEntry.DtEmis = this.getView().byId("idDtEmis_12").getValue();
				oEntry.DocNr = this.getView().byId("idDocNr").getValue();
				oEntry.ForeignSit = this.getView().byId("idForeignSit_12").getSelectedKey();
				break;
			case "_0014":
				oEntry.Ricnr = this.getView().byId("idRicnr").getValue();
				oEntry.Ricorg = this.getView().byId("idRicorg").getValue();
				oEntry.DtEmis = this.getView().byId("idDtEmis_14").getValue();
				oEntry.EsEmis = this.getView().byId("idEsEmis_14").getValue();
				break;
			case "_0015":
				oEntry.Nhcnr = this.getView().byId("idNhcnr").getValue();
				break;
			}
			
			var key = "/ZET_GLHR_MEUS_DOCUMENTOSSet(IPernr='0',IInfo='" + id2 + "',ITipo='G')";
			
			var dialog = new Dialog({
				title: "Confirma\xE7\xE3o",
				type: "Message",
				content: new Text({
					text: "Após a confirmação não será possivel alterar o anexo até que o processo seja finalizado. Deseja seguir?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.update(key, oEntry, {
							success: function (oData, oResponse) {

								sap.m.MessageBox.success("Sua inclusão/alteração foi iniciada e seguirá para processamento. Aguarde retorno ou acompanhae pelo app.", {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
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
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function (sAction) {
										that.getView().getModel().refresh(true);
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
			var infty = "0465";
			var Subty = id2;
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

			var infty = "0465";
			var Subty = id2;
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
			var infty = "0465";
			var Subty = id2;
			var Tipo =  "U";

			if (Pernr !== "" || Subty !== "") {
				var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr);
				var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
				var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, Subty);
				var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, Tipo);
				var oList = this.getView().byId("UploadCollection");
				oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo]);
			}
		},
		
		onEdit: function(){
			switch (id) {
			case "_0001":
				this.getView().byId("idCpf").setEditable(true);
				break;
			case "_0002":
				this.getView().byId("idIdentNr").setEditable(true);
				this.getView().byId("idRgorg").setEditable(true);
				this.getView().byId("idDtEmis").setEditable(true);
				this.getView().byId("idEsEmis").setEditable(true);
				break;
			case "_0003":
				this.getView().byId("idCtpsNr").setEditable(true);
				this.getView().byId("idCtpsSerie").setEditable(true);
				this.getView().byId("idDtEmis_3").setEditable(true);
				this.getView().byId("idEsEmis_3").setEditable(true);
				break;
			case "_0004":
				this.getView().byId("idCregNr").setEditable(true);
				this.getView().byId("idCregName").setEditable(true);
				this.getView().byId("idCregInit").setEditable(true);
				this.getView().byId("idDtEmis_0004").setEditable(true);
				this.getView().byId("idEsEmis_4").setEditable(true);
				this.getView().byId("idOcorg").setEditable(true);
				this.getView().byId("idZvalidade").setEditable(true);
				this.getView().byId("idZorgEmis").setEditable(true);
				break;
			case "_0005":
				this.getView().byId("idElecNr").setEditable(true);
				this.getView().byId("idElecZone").setEditable(true);
				this.getView().byId("idElecSect").setEditable(true);
				this.getView().byId("idDtEmis_5").setEditable(true);
				this.getView().byId("idEsEmis_5").setEditable(true);
				break;
			case "_0006":
				this.getView().byId("idPisNr").setEditable(true);
				this.getView().byId("idDtEmis_6").setEditable(true);
				break;
			case "_0007":
				this.getView().byId("idMilNr").setEditable(true);
				this.getView().byId("idMilType").setEditable(true);
				this.getView().byId("idMilCat").setEditable(true);
				this.getView().byId("idDtEmis_7").setEditable(true);
				break;
			case "_0008":
				this.getView().byId("idIdforNr").setEditable(true);
				this.getView().byId("idVisaType_8").setEditable(true);
				this.getView().byId("idDtArrv").setEditable(true);
				this.getView().byId("idDtEmis_8").setEditable(true);
				this.getView().byId("idRneorg").setEditable(true);
				break;
			case "_0009":
				this.getView().byId("idVisaNr").setEditable(true);
				this.getView().byId("idVisaType").setEditable(true);
				this.getView().byId("idDtEmis_9").setEditable(true);
				this.getView().byId("idForeignSit").setEditable(true);
				this.getView().byId("idZvalidade_9").setEditable(true);
				this.getView().byId("idZclasTrab").setEditable(true);
				break;
			case "_0010":
				this.getView().byId("idDriveNr").setEditable(true);
				this.getView().byId("idCnhorg").setEditable(true);
				this.getView().byId("idDriveCat").setEditable(true);
				this.getView().byId("idDtEmis_10").setEditable(true);
				this.getView().byId("idEsEmis_10").setEditable(true);
				this.getView().byId("idZvalidade_10").setEditable(true);
				this.getView().byId("idZphab").setEditable(true);
				break;
			case "_0011":
				this.getView().byId("idVisaType_11").setEditable(true);
				this.getView().byId("idDtArrv_11").setEditable(true);
				this.getView().byId("idPasspNr_11").setEditable(true);
				this.getView().byId("idDtEmis_11").setEditable(true);
				break;
			case "_0012":
				this.getView().byId("idNitNr").setEditable(true);
				this.getView().byId("idDtEmis_12").setEditable(true);
				this.getView().byId("idDocNr").setEditable(true);
				this.getView().byId("idForeignSit_12").setEditable(true);
				break;
			case "_0014":
				this.getView().byId("idRicnr").setEditable(true);
				this.getView().byId("idRicorg").setEditable(true);
				this.getView().byId("idDtEmis_14").setEditable(true);
				this.getView().byId("idEsEmis_14").setEditable(true);
				break;
			case "_0015":
				this.getView().byId("idNhcnr").setEditable(true);
				break;
			}
			
			this.getView().byId("IdSalvarDetailDep").setVisible(true);
			this.getView().byId("IdCancelDetailDep").setVisible(true);
			this.getView().byId("IdEditDetailDep").setVisible(false);
			this.getView().byId("UploadCollection").setUploadButtonInvisible(false);
		},
		
		onCancel: function(){
			this.getView().getModel().refresh(true);
			this.getView().byId("IdCancelDetailDep").setVisible(false);
			this.onVoltar();
		},
		
		onDeleteSelectedItems: function (oEvent) {
			var that = this;
			var infty = "0465";
			var Subty = id2;
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
			
			var UploadCollection = this.getView().byId("UploadCollection");
			
			var Key = "/ZET_GLRH_UPLOADSet(Ano='" + Ano + "',Favor='" + Favor + "',Infty='" + Infty + "',Mes='" + Mes + "',Pernr='" + Pernr +
				"',Tipo='" + Tipo + "',Subty='" + Subty + "',DocId=" + docid + ",Objps='',Icnum='')";
			var oEntry = {};
			oEntry.DocId = docid;

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