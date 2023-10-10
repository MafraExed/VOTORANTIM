sap.ui.define([
	"Y5GL_EC_BENEF4/Y5GL_EC_BENEF4/controller/BaseController",
	"sap/ui/Device",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
	"sap/m/Label",
	"sap/m/TextArea",
	"sap/m/ButtonType"
], function (BaseController, Device, Dialog, Button, Text, Filter, FilterOperator, Label, TextArea, ButtonType) {
	"use strict";

	var param, operacao, dep, chaveacao, via2, Cancela;

	return BaseController.extend("Y5GL_EC_BENEF4.Y5GL_EC_BENEF4.controller.BENEFICIOS_DETAIL", {

		onInit: function () {
			this.getRouter().getRoute("BENEFICIOS_DETAIL").attachPatternMatched(this._onObjectMatched, this);

			this.buscaImagem();
		},

		getValue: function (oValue) {
			return this.getView().byId(oValue).getValue();
		},

		getSelect: function (oValue) {
			return this.getView().byId(oValue).getSelectedKey();
		},

		_onObjectMatched: function (oEvent) {

			var Beneficio = oEvent.getParameter("arguments").Zparam;
			var Descricao = oEvent.getParameter("arguments").Zdesc;

			while (Descricao.indexOf("_") != -1) {
				Descricao = Descricao.replace("_", "/");
			}

			var Pernr = "0";
			var Tipo = "V";

			this.getView().getModel().refresh(true);
			this.getView().byId("idTitleDependentes").setText(Descricao);
			param = Beneficio;

			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("ZET_GLHR_DETAIL_BENEFICIOSSet", {
					Pernr: Pernr,
					Beneficio: Beneficio,
					Tipo: Tipo

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
			this.filtraUploadCollection();

			this.getView().byId(param).setVisible(true);

			if (param !== undefined) {

				switch (param) {
				case "EMP_CONSIGNADO":
					this.empConsiginado();
					break;
                case "ADELANTO":
                    this.configBeneficio();
                    break;
                case "ADELANTO_SUELDOS":
                    this.configBeneficio();
                    break;
                case "ASIGNACION":
                    this.configBeneficio();
                    break;
                case "ASIGNACION_ESCOLAR":
                    this.configBeneficio();
                    break;
                case "AGUINALDO_NAVIDENO":
                    this.configBeneficio();
                    break;
                case "PASAJE_UNIVERSITARIO":
                    this.pasajeUniversitario();
                    break;
				case "ESTAC_MOVBUS":
					this.estacMovBus();
					break;
				case "LABORAL":
					this.laboral();
					break;
				case "PASAJE":
					this.pasaje();
					break;
				case "REEMBOLSO_CURSOS":
					this.reembolsoCursos();
					break;
				case "REEMBOLSO_EXPATRIADO":
					this.reembolsoExpatriado();
					break;
				case "REEMBOLSO_IDIOMA":
					this.reembolsoIdioma();
					break;
				case "SEGURO_DE_VIDA":
					this.seguroVida();
					break;
				case "PLANO_MEDICO":
					this.planoMedico();
					break;
				}
			}
		},

		filtraUploadCollection: function () {
			var infty, subty;

			if (param !== undefined) {
				switch (param) {
				case "EMP_CONSIGNADO":
					infty = "XXXX";
					subty = "EMCO";
					break;
                case "ADELANTO":
                    infty = "XXXX";
                    subty = "ADEL";
                    break;
                case "ADELANTO_SUELDOS":
                    infty = "XXXX";
                    subty = "ADES";
                    break;
                case "ASIGNACION":
                    infty = "XXXX";
                    subty = "ASIG";
                    break;
                case "ASIGNACION_ESCOLAR":
                    infty = "XXXX";
                    subty = "ASIE";
                    break;
                case "AGUINALDO_NAVIDENO":
                    infty = "XXXX";
                    subty = "AGUI";
                    break;
                case "PASAJE_UNIVERSITARIO":
                    infty = "XXXX";
                    subty = "PASU";
                    break;
				case "ESTAC_MOVBUS":
					infty = "XXXX";
					subty = "ESMV";
					break;
				case "LABORAL":
					infty = "XXXX";
					subty = "LABO";
					break;
				case "PASAJE":
					infty = "XXXX";
					subty = "PASA";
					break;
				case "REEMBOLSO_CURSOS":
					infty = "XXXX";
					subty = "RECU";
					break;
				case "REEMBOLSO_EXPATRIADO":
					infty = "XXXX";
					subty = "REEX";
					break;
				case "REEMBOLSO_IDIOMA":
					infty = "XXXX";
					subty = "REID";
					break;
				case "SEGURO_DE_VIDA":
					infty = "0037";
					subty = "PE05";
					break;
				case "PLANO_MEDICO":
					infty = "PS01";
					subty = "PS01";
					break;
				}

				if (subty !== "") {
					var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, "0");
					var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
					var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, subty);
					var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "B");
					var oList = this.getView().byId("UploadCollection");
					oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo]);
				}
			}
		},

		empConsiginado: function () {
			var status = this.getView().byId("idTipo").getValue();
			if (status !== "") {
				if (status !== "X") {
					this.getView().byId("IdEditDetailDep").setVisible(false);
				}
			} else {
				this.getView().byId("IdEditDetailDep").setVisible(true);
			}

			this.getView().byId("IdEditDetailDep").setText("Solicitación");
		},

        configBeneficio: function () {
            var status = this.getView().byId("idTipo").getValue();
			if (status !== "") {
				if (status !== "X") {
					this.getView().byId("IdEditDetailDep").setVisible(false);
				}
			} else {
				this.getView().byId("IdEditDetailDep").setVisible(true);
			}

			this.getView().byId("IdEditDetailDep").setText("Solicitación");
        },

		pasajeUniversitario: function () {
			this.getView().byId("IdEditDetailDep").setText("Solicitación");

			this.getView().byId("IdPlano_PASAJE_UNIVERSITARIO").setSelectedKey();
			this.getView().byId("IdAno_PASAJE_UNIVERSITARIO").setSelectedKey();
		},

		estacMovBus: function () {
			this.getView().byId("IdEditDetailDep").setText("Solicitación");
		},
		laboral: function () {
			this.getView().byId("IdEditDetailDep").setText("Solicitar");

			this.getView().byId("IdPlano_LABORAL").setSelectedKey();
			this.getView().byId("IdAno_LABORAL").setSelectedKey();
		},
		pasaje: function () {
			this.getView().byId("IdEditDetailDep").setText("Solicitar");

			this.getView().byId("IdPlano_PASAJE").setSelectedKey();
			this.getView().byId("IdAno_PASAJE").setSelectedKey();
		},
		reembolsoCursos: function () {
			this.getView().byId("IdEditDetailDep").setText("Solicitar");
		},
		reembolsoExpatriado: function () {
			this.getView().byId("IdEditDetailDep").setText("Solicitar");
		},
		reembolsoIdioma: function () {
			this.getView().byId("IdEditDetailDep").setText("Solicitar");
		},
		seguroVida: function () {
			this.getView().byId("IdIncluir").setVisible(false);

			var Plano = this.getView().byId("IdPlano_SEGURO_DE_VIDA").getSelectedKey();
			var Opcoes = this.getView().byId("IdOpcoes_SEGURO_DE_VIDA").getBinding("items");
			var oFilterOpcoes = new sap.ui.model.Filter("Bplan", sap.ui.model.FilterOperator.EQ, Plano);
			Opcoes.filter([oFilterOpcoes]);

			this.getView().byId("IdSegundaVia").setVisible(false);

			this.getView().byId("IdEditDetailDep").setText("Editar plan");
		},
		planoMedico: function () {

			var Plano = this.getView().byId("IdPlano_PLANO_MEDICO").getSelectedKey();
			var Opcoes = this.getView().byId("IdOpcoes_PLANO_MEDICO").getBinding("items");
			var smartTable = this.getView().byId("smartTable");
			var oFilterOpcoes = new sap.ui.model.Filter("Bplan", sap.ui.model.FilterOperator.EQ, Plano);

			smartTable.rebindTable("e");
			this.getView().byId("IdIncluir").setVisible(true);
			Opcoes.filter([oFilterOpcoes]);
			this.getView().byId("IdEditDetailDep").setText("Solicitar");
			this.getView().byId("IdCancelDetailDep").setVisible(false);
		},

		formatFalse: function () {
			return false;
		},

		onVoltar: function () {
			var bReplace;
			var Zdesc;

			this.getView().byId("IdCancelDetailDep").setVisible(false);
			bReplace = !Device.system.phone;
			Zdesc = "master";
			this.getRouter().navTo(Zdesc, bReplace);

		},

		onCancel: function () {
			var dialog;
			var that = this;
			dialog = new Dialog({
				title: "Confirmacion",
				type: "Message",
				content: new Text({
					text: "¿Quieres cancelar el cambio?"
				}),
				beginButton: new Button({
					text: "Sí",
					press: function () {
						that.Cancela();
						that.getView().byId("TextInclusao").setVisible(false);
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

		Cancela: function () {
			var that = this;
			that.getView().getModel().refresh(true);

			switch (param) {
			case "PLANO_MEDICO":
				that.getView().byId("TextInclusao").setVisible(false);
				that.getView().byId("TextExclusao").setVisible(false);
				break;
			}
			that.getView().byId("UploadCollection").setUploadButtonInvisible(false);
			that.getView().byId("IdCancelDetailDep").setVisible(false);
			that.getView().byId("IdIncluir").setVisible(false);
			that.getView().byId("IdSalvarDetailDep").setVisible(false);
			that.getView().byId("UPLOAD").setVisible(false);
		},

		FormatBVisible: function (oValue) {
			if (oValue !== null) {
				if (oValue === "Não" || oValue === "Sim") {
					return true;
				} else {
					return false;
				}
			}
		},

		formatVisibleMsg: function (oValue) {

			if (param !== "PASAJE") {
				if (param !== "LABORAL") {
					if (oValue !== "X") {
						if (oValue !== "") {
							return true;
						} else {
							return false;
						}
					} else {
						return false;
					}
				} else {
					return false;
				}
			} else {
				return false;
			}
		},

		formatVisibleEditOpcoes: function (oValue) {
			//if (oValue === "Em ResoluÃ§Ã£o") {
			if (param !== "PASAJE") {
				if (param !== "LABORAL") {
					if (oValue !== "X") {
						if (oValue !== "") {
							return false;
						} else {
							return true;
						}
					} else {
						return true;
					}
				} else {
					return true
				}
			} else {
				return true;
			}
		},

		FormatEditable: function (oValue) {
			if (oValue === "") {
				return true;
			} else {
				return false;
			}
		},

		formatVisiblebButton: function (oValue) {
			//if (oValue === "Em ResoluÃ§Ã£o") {

			if (param !== "PASAJE") {
				if (param !== "LABORAL") {
					if (oValue !== "X") {
						if (oValue === "") {
							return false;
						} else {
							return true;
						}
					} else {
						return false;
					}
				} else {
					return false;
				}
			} else {
				return false;
			}
		},

		FormatBV: function (oValue) {
			if (param !== "COOPERATIVA") {
				if (param !== "TRANSPORTE") {
					if (oValue === "Em ResoluÃ§Ã£o" || oValue === "") {
						return false;
					} else {
						return true;
					}
				} else {
					return false;
				}
			} else {
				return false;
			}
		},

		onEdit: function () {
			var visao = this.getView();
			var edit = true;
			var dep = "";

			visao.byId("UPLOAD").setVisible(true);

			switch (param) {
			case "EMP_CONSIGNADO":
				this.getView().byId("TextEMP_CONSIGNADO").setVisible(true);
				break;
            case "ADELANTO":
                this.getView().byId("TextADELANTO").setVisible(true);
                break;
            case "ADELANTO_SUELDOS":
                this.getView().byId("TextADELANTO_SUELDOS").setVisible(true);
                break;
            case "ASIGNACION":
                this.getView().byId("TextASIGNACION").setVisible(true);
                break;
            case "ASIGNACION_ESCOLAR":
                this.getView().byId("TextASIGNACION_ESCOLAR").setVisible(true);
                break;
            case "AGUINALDO_NAVIDENO":
                this.getView().byId("TextAGUINALDO_NAVIDENO").setVisible(true);
                break;
            case "PASAJE_UNIVERSITARIO":
                this.getView().byId("IdPlano_PASAJE_UNIVERSITARIO").setEditable(true);
                this.getView().byId("IdAno_PASAJE_UNIVERSITARIO").setEditable(true);
                this.getView().byId("TextPASAJE_UNIVERSITARIO").setVisible(true);
                break;
			case "ESTAC_MOVBUS":
				this.getView().byId("IdPlano_ESTAC_MOVBUS").setEditable(true);
				this.getView().byId("IdAno_ESTAC_MOVBUS").setEditable(true);
				this.getView().byId("TextESTAC_MOVBUS").setVisible(true);
				break;
			case "LABORAL":
				this.getView().byId("IdPlano_LABORAL").setEditable(true);
				this.getView().byId("IdAno_LABORAL").setEditable(true);
				this.getView().byId("TextLABORAL").setVisible(true);
				break;
			case "PASAJE":
				this.getView().byId("IdPlano_PASAJE").setEditable(true);
				this.getView().byId("IdAno_PASAJE").setEditable(true);
				this.getView().byId("TextTransporte").setVisible(true);
				break;
			case "REEMBOLSO_CURSOS":
				this.getView().byId("IdPlano_REEMBOLSO_CURSOS").setEditable(true);
				this.getView().byId("IdAno_REEMBOLSO_CURSOS").setEditable(true);
				this.getView().byId("TextREEMBOLSO_CURSOS").setVisible(true);
				break;
			case "REEMBOLSO_EXPATRIADO":
				this.getView().byId("IdPlano_REEMBOLSO_EXPATRIADO").setEditable(true);
				this.getView().byId("IdAno_REEMBOLSO_EXPATRIADO").setEditable(true);
				this.getView().byId("TextREEMBOLSO_EXPATRIADO").setVisible(true);
				break;
			case "REEMBOLSO_IDIOMA":
				this.getView().byId("IdPlano_REEMBOLSO_IDIOMA").setEditable(true);
				this.getView().byId("IdAno_REEMBOLSO_IDIOMA").setEditable(true);
				this.getView().byId("TextREEMBOLSO_IDIOMA").setVisible(true);
				break;
			case "SEGURO_DE_VIDA":
				this.getView().byId("IdPlano_SEGURO_DE_VIDA").setEditable(true);
				this.getView().byId("IdOpcoes_SEGURO_DE_VIDA").setEditable(true);
				this.getView().byId("TextPlano").setVisible(true);
				break;
			case "PLANO_MEDICO":
				this.getView().byId("IdPlano_PLANO_MEDICO").setEditable(true);
				this.getView().byId("IdOpcoes_PLANO_MEDICO").setEditable(true);
				this.getView().byId("IdSegundaVia").setVisible(false);
				this.getView().byId("TextInclusao").setVisible(true);
				break;
			}
			this.getView().byId("IdCancelDetailDep").setVisible(true);
			this.getView().byId("IdSalvarDetail").setVisible(true);
		},

		onChange: function (oEvent) {
			var oUploadCollection = oEvent.getSource();
			var oModel = this.getView().getModel();
			oModel.refreshSecurityToken();
			var oHeaders = oModel.oHeaders;
			var sToken = oHeaders["x-csrf-token"];
			// Stellen das CSRF Token wenn ein File hinzugefügt ist
			var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
				name: "x-csrf-token",
				value: sToken
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
		},

		onDeleteSelectedItems: function (oEvent) {
			var oModel = this.getView().getModel();
			var UploadCollection = this.getView().byId("UploadCollection");
			var oList = UploadCollection.oList;
			var ListItem = oEvent.getParameters("listItem");
			var docid = ListItem.documentId;
			var idTipo = this.getView().byId("idTipo").getValue();
			var infty = "";
			var subty = "";
			var valor = " ";
			var mes = "0";
			var ano = "0";
			var favor = "0";
			var pernr = "0";
			var tipo = "E";
			var Area = "0";
			var objps = "0";
			var Menssagem = "";
			var Concatenate = "";
			var Key = "";
			var oEntry = {};
			var dialog = "";
			var erro = "";
			var erro2 = "";
			var messagem = "";
			var buscaValor = "";
			var that = this;
			if (param !== undefined) {
				switch (param) {
				case "EMP_CONSIGNADO":
					infty = "XXXX";
					subty = "EMCO";
					buscaValor = "x";
					break;
                case "ADELANTO":
                    infty = "XXXX";
                    subty = "ADEL";
                    buscaValor = "x";
                    break;
                case "ADELANTO_SUELDOS":
                    infty = "XXXX";
                    subty = "ADES";
                    buscaValor = "x";
                    break;
                case "ASIGNACION":
                    infty = "XXXX";
                    subty = "ASIG";
                    buscaValor = "x";
                    break;
                case "ASIGNACION_ESCOLAR":
                    infty = "XXXX";
                    subty = "ASIE";
                    buscaValor = "x";
                    break;
                case "AGUINALDO_NAVIDENO":
                    infty = "XXXX";
                    subty = "AGUI";
                    buscaValor = "x";
                    break;
                case "PASAJE_UNIVERSITARIO":
                    infty = "XXXX";
                    subty = "PASU";
                    break;
				case "ESTAC_MOVBUS":
					infty = "XXXX";
					subty = "ESMV";
					break;
				case "LABORAL":
					infty = "XXXX";
					subty = "LABO";
					break;
				case "PASAJE":
					infty = "XXXX";
					subty = "PASA";
					break;
				case "REEMBOLSO_CURSOS":
					infty = "XXXX";
					subty = "RECU";
					break;
				case "REEMBOLSO_EXPATRIADO":
					infty = "XXXX";
					subty = "REEX";
					break;
				case "REEMBOLSO_IDIOMA":
					infty = "XXXX";
					subty = "REID";
					break;
				case "SEGURO_DE_VIDA":
					infty = "0037";
					subty = "PE05";
					buscaValor = "x";
					break;
				case "PLANO_MEDICO":
					infty = "0167";
					subty = "PS01";
					buscaValor = "x";
					break;
				}
				if (buscaValor !== "x") {
					mes = this.getSelect("IdPlano_" + param);
					ano = this.getSelect("IdAno_" + param);
					valor = mes + "_" + ano;
				}
				if (idTipo === "Em ResoluÃ§Ã£o") {
					sap.m.MessageBox.error("No será posible eliminar el adjunto cuando el ticket ya exista.");
					return;
				}
				if (operacao === "I") {
					Menssagem = "No hay dependientes marcados para su inclusión";
				} else {
					Menssagem = "No hay dependientes marcados para Exclusión";
				}
				if (dep === "X") {
					if (operacao === "I") {
						Concatenate = "I@";
						Menssagem = "Não existem dependentes marcados para inclusão";
					} else {
						Concatenate = "E@";
						Menssagem = "Não existem dependentes marcados para Exclusão";
					}
					var chave = chaveacao;
					subty = chave.split(",");
					subty = subty[2];
					subty = subty.split("Subty=");
					subty = subty[1];
					while (subty.indexOf("'") !== -1) {
						subty = subty.replace("'", "");
					}
					if (subty < 10) {
						subty = "0" + subty;
					}
					objps = chave.split(",");
					objps = objps[3];
					objps = objps.split("Objps=");
					objps = objps[1];
					while (objps.indexOf("'") !== -1) {
						objps = objps.replace("'", "");
					}
					while (objps.indexOf(")") !== -1) {
						objps = objps.replace(")", "");
					}
					if (objps === "") {
						objps = "00";
					}
					Concatenate = Concatenate + subty + "-" + objps;
				}

				docid = parseInt(docid);

				Key = "/ZET_GLRH_UPLOADSet(Ano='" + ano + "',Favor='" + favor + "',Infty='" + infty + "',Mes='" + mes + "',Pernr='" + pernr +
					"',Tipo='" + tipo + "',Subty='" + subty + "',DocId=" + docid + ",Objps='',Icnum='',Valor='" + valor + "',Dependentes='" +
					Concatenate + "',Area='" + Area + "')";
				oEntry.DocId = docid;
				oEntry.Valor = valor;
				dialog = new Dialog({
					title: "Confirmación",
					type: "Message",
					content: new Text({
						text: "¿Confirmar la eliminación del archivo adjunto?"
					}),
					beginButton: new Button({
						text: "Sí ",
						press: function () {
							oModel.update(Key, oEntry, {
								success: function (oData, oResponse) {
									sap.m.MessageBox.success("Documentos eliminados correctamente.", {
										actions: ["OK"],
										onClose: function (sAction) {
											UploadCollection.getBinding("items").refresh(true);
											that.getView().byId("IdPlano_" + param).setEditable(true);
											that.getView().byId("IdAno_" + param).setEditable(true);
										}
									});
								},
								error: function (oError) {
									erro = oError.responseText;
									erro2 = JSON.parse(erro);
									messagem = erro2.error.message.value;
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
			}
		},

		onBeforeUploadStarts: function (oEvent) {
			var pernr = "0";
			var infty = "0";
			var subty = "0";
			var objps = "0";
			var oListBase;
			var valor = "";
			var buscaValor = "";
			var Concatenate = "";
			var Menssagem = "";
			var mes;
			var ano;

			if (param !== undefined) {
				switch (param) {
				case "EMP_CONSIGNADO":
					infty = "XXXX";
					subty = "EMCO";
					buscaValor = "x";
					break;
                case "ADELANTO":
                    infty = "XXXX";
                    subty = "ADEL";
                    buscaValor = "x";
                    break;
                case "ADELANTO_SUELDOS":
                    infty = "XXXX";
                    subty = "ADES";
                    buscaValor = "x";
                    break;
                case "ASIGNACION":
                    infty = "XXXX";
                    subty = "ASIG";
                    buscaValor = "x";
                    break;
                case "ASIGNACION_ESCOLAR":
                    infty = "XXXX";
                    subty = "ASIE";
                    buscaValor = "x";
                    break;
                case "AGUINALDO_NAVIDENO":
                    infty = "XXXX";
                    subty = "AGUI";
                    buscaValor = "x";
                    break;
                case "PASAJE_UNIVERSITARIO":
                    infty = "XXXX";
                    subty = "PASU";
                    break;
				case "ESTAC_MOVBUS":
					infty = "XXXX";
					subty = "ESMV";
					break;
				case "LABORAL":
					infty = "XXXX";
					subty = "LABO";
					break;
				case "PASAJE":
					infty = "XXXX";
					subty = "PASA";
					break;
				case "REEMBOLSO_CURSOS":
					infty = "XXXX";
					subty = "RECU";
					break;
				case "REEMBOLSO_EXPATRIADO":
					infty = "XXXX";
					subty = "REEX";
					break;
				case "REEMBOLSO_IDIOMA":
					infty = "XXXX";
					subty = "REID";
					break;
				case "SEGURO_DE_VIDA":
					infty = "0037";
					subty = "PE05";
					buscaValor = "x";
					break;
				case "PLANO_MEDICO":
					infty = "0167";
					subty = "PS01";
					buscaValor = "x";
					break;
				}

				if (buscaValor !== "x") {
					mes = this.getSelect("IdPlano_" + param);
					if (mes === "") {
						sap.m.MessageBox.error("Seleccione el mes de referencia.");
						return;
					}
					ano = this.getSelect("IdAno_" + param);
					if (ano === "") {
						sap.m.MessageBox.error("Seleccione año de referencia.");
						return;
					}
					valor = mes + "_" + ano;
				}

				if (dep === "X") {

					var selecionados = oListBase.getSelectedIndices();

					if (operacao === "I") {
						Concatenate = "I@";
						Menssagem = "Não existem dependentes marcados para inclusão";
					} else if (operacao === "E") {
						Concatenate = "E@";
						Menssagem = "Não existem dependentes marcados para Exclusão";
					} else if (via2 === "X") {
						Concatenate = "2@";
						Menssagem = "Não existem dependentes marcados para solicitação de segunda via.";

						for (var i = 0; i < selecionados.length; i++) {
							subty = oListBase.getContextByIndex([selecionados[i]]).getObject().Subty;
							objps = oListBase.getContextByIndex([selecionados[i]]).getObject().Objps;
							Concatenate = Concatenate + subty + "-" + objps + "@";
						}
					}

					if (via2 !== "X") {
						var chave = chaveacao;
						subty = chave.split(",");
						subty = subty[2];
						subty = subty.split("Subty=");
						subty = subty[1];

						while (subty.indexOf("'") !== -1) {
							subty = subty.replace("'", "");
						}

						if (subty < 10) {
							subty = "0" + subty;
						}

						objps = chave.split(",");
						objps = objps[3];
						objps = objps.split("Objps=");
						objps = objps[1];

						while (objps.indexOf("'") !== -1) {
							objps = objps.replace("'", "");
						}

						while (objps.indexOf(")") !== -1) {
							objps = objps.replace(")", "");
						}

						if (objps === "") {
							objps = "00";
						}

						Concatenate = Concatenate + subty + "-" + objps;
					}
				}

				if (pernr !== "" || subty !== "" || objps !== "") {
					var sSlug = pernr + "$" + infty + "$" + subty + "$" + objps + "$" + oEvent.getParameter("fileName") + "$ $ $" + Concatenate +
						"$" +
						valor;
					// Stellen die Kopf Parameter slug
					var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
						name: "slug",
						value: sSlug
					});
					oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
				}
			}
		},

		onuploadComplete: function (oEvent) {
			var Pernr = "0";
			var infty;
			var subty;
			var valor = "";
			var mes;
			var ano;
			var buscaValor = "";
			var Concatenate = "";
			var Menssagem = "";
			var objps = "";

			if (param !== undefined) {
				switch (param) {
				case "EMP_CONSIGNADO":
					infty = "XXXX";
					subty = "EMCO";
					buscaValor = "x";
					break;
                case "ADELANTO":
                    infty = "XXXX";
                    subty = "ADEL";
                    buscaValor = "x";
                    break;
                case "ADELANTO_SUELDOS":
                    infty = "XXXX";
                    subty = "ADES";
                    buscaValor = "x";
                    break;
                case "ASIGNACION":
                    infty = "XXXX";
                    subty = "ASIG";
                    buscaValor = "x";
                    break;
                case "ASIGNACION_ESCOLAR":
                    infty = "XXXX";
                    subty = "ASIE";
                    buscaValor = "x";
                    break;
                case "AGUINALDO_NAVIDENO":
                    infty = "XXXX";
                    subty = "AGUI";
                    buscaValor = "x";
                    break;
                case "PASAJE_UNIVERSITARIO":
                    infty = "XXXX";
                    subty = "PASU";
                    break;
				case "ESTAC_MOVBUS":
					infty = "XXXX";
					subty = "ESMV";
					break;
				case "LABORAL":
					infty = "XXXX";
					subty = "LABO";
					break;
				case "PASAJE":
					infty = "XXXX";
					subty = "PASA";
					break;
				case "REEMBOLSO_CURSOS":
					infty = "XXXX";
					subty = "RECU";
					break;
				case "REEMBOLSO_EXPATRIADO":
					infty = "XXXX";
					subty = "REEX";
					break;
				case "REEMBOLSO_IDIOMA":
					infty = "XXXX";
					subty = "REID";
					break;
				case "SEGURO_DE_VIDA":
					infty = "0037";
					subty = "PE05";
					buscaValor = "x";
					break;
				case "PLANO_MEDICO":
					infty = "0167";
					subty = "PS01";
					buscaValor = "x";
					break;
				}

				if (buscaValor !== "x") {
					mes = this.getSelect("IdPlano_" + param);
					ano = this.getSelect("IdAno_" + param);
					valor = mes + "_" + ano;

					this.getView().byId("IdPlano_" + param).setEditable(false);
					this.getView().byId("IdAno_" + param).setEditable(false);
				}

				if (dep === "X") {

					if (operacao === "I") {
						Concatenate = "I@";
						Menssagem = "Não existem dependentes marcados para inclusão";
					} else {
						Concatenate = "E@";
						Menssagem = "Não existem dependentes marcados para Exclusão";
					}

					if (via2 !== "X") {
						var chave = chaveacao;
						subty = chave.split(",");
						subty = subty[2];
						subty = subty.split("Subty=");
						subty = subty[1];
						while (subty.indexOf("'") !== -1) {
							subty = subty.replace("'", "");
						}
						if (subty < 10) {
							subty = "0" + subty;
						}

						objps = chave.split(",");
						objps = objps[3];
						objps = objps.split("Objps=");
						objps = objps[1];
						while (objps.indexOf("'") !== -1) {
							objps = objps.replace("'", "");
						}
						while (objps.indexOf(")") !== -1) {
							objps = objps.replace(")", "");
						}

						if (objps === "") {
							objps = "00";
						}

						Concatenate = Concatenate + subty + "-" + objps;
					}
				}

				if (Pernr !== "" || subty !== "") {
					var oFiltertTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "U");
					var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
					var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, subty);
					var oFilterValor = new sap.ui.model.Filter("Valor", sap.ui.model.FilterOperator.EQ, valor);

					var oList = this.getView().byId("UploadCollection");

					oList.getBinding("items").filter([oFilterInfty, oFilterSubty, oFiltertTipo, oFilterValor]);
				}
			}
		},

		onmodelListContextChange: function (oEvent) {
			var Pernr = "0";
			var infty;
			var subty;
			var valor;
			var mes;
			var ano;
			var buscaValor = "";

			if (param !== undefined) {
				switch (param) {
				case "EMP_CONSIGNADO":
					infty = "XXXX";
					subty = "EMCO";
					buscaValor = "x";
					break;
                case "ADELANTO":
                    infty = "XXXX";
                    subty = "ADEL";
                    buscaValor = "x";
                    break;
                case "ADELANTO_SUELDOS":
                    infty = "XXXX";
                    subty = "ADES";
                    buscaValor = "x";
                    break;
                case "ASIGNACION":
                    infty = "XXXX";
                    subty = "ASIG";
                    buscaValor = "x";
                    break;
                case "ASIGNACION_ESCOLAR":
                    infty = "XXXX";
                    subty = "ASIE";
                    buscaValor = "x";
                    break;
                case "AGUINALDO_NAVIDENO":
                    infty = "XXXX";
                    subty = "AGUI";
                    buscaValor = "x";
                    break;
                case "PASAJE_UNIVERSITARIO":
                    infty = "XXXX";
                    subty = "PASU";
                    break;
				case "ESTAC_MOVBUS":
					infty = "XXXX";
					subty = "ESMV";
					break;
				case "LABORAL":
					infty = "XXXX";
					subty = "LABO";
					break;
				case "PASAJE":
					infty = "XXXX";
					subty = "PASA";
					break;
				case "REEMBOLSO_CURSOS":
					infty = "XXXX";
					subty = "RECU";
					break;
				case "REEMBOLSO_EXPATRIADO":
					infty = "XXXX";
					subty = "REEX";
					break;
				case "REEMBOLSO_IDIOMA":
					infty = "XXXX";
					subty = "REID";
					break;
				case "SEGURO_DE_VIDA":
					infty = "0037";
					subty = "PE05";
					buscaValor = "x";
					break;
				case "PLANO_MEDICO":
					infty = "0167";
					subty = "PS01";
					buscaValor = "x";
					break;
				}

				if (buscaValor !== "x") {
					mes = this.getSelect("IdPlano_" + param);
					valor = mes + "_" + ano;
				}

				if (Pernr !== "" || subty !== "") {
					var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr);
					var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, infty);
					var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, subty);
					var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, "B");
					var oFilterValor = new sap.ui.model.Filter("Valor", sap.ui.model.FilterOperator.EQ, valor);
					var oList = this.getView().byId("UploadCollection");
					oList.getBinding("items").filter([oFilterPernr, oFilterInfty, oFilterSubty, oFilterTipo, oFilterValor]);
				}
			}
		},

		onSave: function (via2) {
			var dialog;
			var oModel = this.getView().getModel();
			var oEntry = {};
			var that = this;
			var Beneficio = param;
			var Pernr = "0";
			var Tipo;

			if (Cancela === "C") {
				Tipo = Cancela;
            } else {
				Tipo = "G";
			}

			var Key = "/ZET_GLHR_DETAIL_BENEFICIOSSet(Pernr='" + Pernr + "',Beneficio='" + Beneficio + "',Tipo='" + Tipo + "')";
			var desativaValor = "";

			switch (Beneficio) {
			case "EMP_CONSIGNADO":
				oEntry.Rubrica = this.getSelect("IdPlano_EMP_CONSIGNADO");
				desativaValor = "x";
				break;
            case "ADELANTO":
                oEntry.Rubrica = this.getSelect("IdPlano_ADELANTO");
                desativaValor = "x";
                break;
            case "ADELANTO_SUELDOS":
                oEntry.Rubrica = this.getSelect("IdPlano_ADELANTO_SUELDOS");
                desativaValor = "x";
                break;
            case "ASIGNACION":
                oEntry.Rubrica = this.getSelect("IdPlano_ASIGNACION");
                desativaValor = "x";
                break;
            case "ASIGNACION_ESCOLAR":
                oEntry.Rubrica = this.getSelect("IdPlano_ASIGNACION_ESCOLAR");
                desativaValor = "x";
                break;
            case "AGUINALDO_NAVIDENO":
                oEntry.Rubrica = this.getSelect("IdPlano_AGUINALDO_NAVIDENO");
                desativaValor = "x";
                break;
			case "SEGURO_DE_VIDA":
				oEntry.Bplan = this.getSelect("IdPlano_SEGURO_DE_VIDA");
				if (oEntry.Bplan === "") {
					this.getView().byId("IdPlano_SEGURO_DE_VIDA").setValueState("Error");
					sap.m.MessageBox.error("Informar el plan");
					return;
				} else {
					this.getView().byId("IdPlano_SEGURO_DE_VIDA").setValueState("Success");
				}

				oEntry.Opcoes = this.getView().byId("IdOpcoes_SEGURO_DE_VIDA").getSelectedKey();
				if (oEntry.Opcoes === "") {
					this.getView().byId("IdOpcoes_SEGURO_DE_VIDA").setValueState("Error");
					sap.m.MessageBox.error("Selecciona entre las opciones");
					return;
				} else {
					this.getView().byId("IdOpcoes_SEGURO_DE_VIDA").setValueState("Success");
				}
			
				desativaValor = "x";
				break;
			case "PLANO_MEDICO":
				oEntry.Bplan = this.getSelect("IdPlano_PLANO_MEDICO");
				oEntry.Opcoes = this.getSelect("IdOpcoes_PLANO_MEDICO");
				desativaValor = "x";
				break;
			}

			if (desativaValor !== "x") {
				var mes = this.getSelect("IdPlano_" + param);
				var ano = this.getSelect("IdAno_" + param);
				oEntry.Valor = mes + "_" + ano;
			}

			oEntry.Tipo = oEntry.Operation;
			oEntry.Beneficio = Beneficio;
			if (oEntry.Montante !== "" && oEntry.Montante !== undefined) {
				while (oEntry.Montante.indexOf(".") !== -1) {
					oEntry.Montante = oEntry.Montante.replace(".", "");
				}
				oEntry.Montante = oEntry.Montante.replace(",", ".");
			}
			this.GravaBeneficio(Key, oEntry, via2);
		},

		GravaBeneficio: function (key, oEntry, via2) {
			var that = this;
			var oModel = this.getView().getModel();
			var menssagemsave = "";

			if (via2 === "X") {
				menssagemsave = "¿Confirmar pedido duplicado?";
			} else {
				menssagemsave = "¿Confirma el cambio / inclusión del beneficio?";
			}

			var dialog = new Dialog({
				title: "Confirmación",
				type: "Message",
				content: new Text({
					text: menssagemsave
				}),
				beginButton: new Button({
					text: "Sí",
					press: function () {
						oModel.update(key, oEntry, {
							success: function (oData, oResponse) {
								sap.m.MessageBox.success("Solicitud enviada", {
									actions: ["OK"],
									onClose: function (sAction) {
										that.getView().getModel().refresh(true);
										that.getView().byId("IdCancelDetailDep").setVisible(false);
									}
								});
							},
							error: function (oError) {
								var erro = oError;
								erro = erro.responseText;
								var erro2 = JSON.parse(erro);
								var messagem = erro2.error.message.value;
								var codigo = erro2.error.code;
								if (codigo === "Fiori - W/001") {
									sap.m.MessageBox.warning(messagem, {
										actions: ["OK"],
										onClose: function (sAction) {
											that.getView().getModel().refresh(true);
											that.getView().byId("IdCancelDetailDep").setVisible(false);
										}
									});
								} else {
									sap.m.MessageBox.error(messagem, {
										actions: ["OK"],
										onClose: function (sAction) {}
									});
									return;
								}
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

		onchangeIdMargemEmp: function (oEvent) {
			var that = this;
			var number;
			var numero = oEvent.getParameter("value");
			var oEvent_id = oEvent.getParameter("id");
			var id = oEvent_id.split("DETAIL--")[1];
			var numero_aux;

			numero_aux = numero;

			while (numero.indexOf(",") !== -1) {
				numero = numero.replace(",", ".");
			}

			number = !isNaN(numero);

			if (number === true) {
				numero = this.adicionarpontoFloat(numero_aux);

				this.getView().byId(id).setValue(numero);
			} else {
				sap.m.MessageBox.error("O valor informado deverá ser um número.", {
					actions: ["OK"],
					onClose: function (sAction) {
						that.getView().byId("IdMargemEmp").setValue();
					}
				});
			}
		},

		onAdd: function () {
			var Pernr = "0";
			var Tipo = "A";
			var Objps = "0";
			var Subty = "-";
			var Favor = "-";
			var Zdesc = "DependentesAdd";
			var Cpf = "-";
			this.getRouter().navTo(Zdesc, {
				Pernr: Pernr,
				Subty: Subty,
				Objps: Objps,
				Tipo: Tipo,
				Favor: Favor,
				Icnum: Cpf
			});
		},

        onAnoReferenciaChanged: async function (oEvent) {
            const sBeneficio = param;

            const oView = this.getView();
            oView.setBusy(true);
   
            const sSelectedYear = oEvent.getParameters().value;
            const iMinhasSolicitacoesCount = await this.getMinhasSolicitacoesCount(sBeneficio, sSelectedYear);
            const isSecondRequest = iMinhasSolicitacoesCount > 0;

            oView.setBusy(false);

            if (isSecondRequest) {
                sap.m.MessageBox.warning(`Ya ha registrado una solicitud en el año ${sSelectedYear}. Por favor, asegúrese que esta nueva solicitud sea por un hijo distinto.`);    
            }
        },

        getMinhasSolicitacoesCount: async function (sBeneficio, sYear) {
            const oModel = this.getView().getModel();

            const aFilters = [
                new Filter("Beneficio", FilterOperator.EQ, sBeneficio),
                new Filter("DataCriacao", FilterOperator.Contains, sYear)
            ];

            return new Promise((resolve, reject) => {
                oModel.read("/ZET_GLHR_MINHAS_SOLICITACOESSet/$count", {
                    filters: aFilters,
                    success: (sCount) => {
                        resolve(Number.parseInt(sCount, 10));
                    },
                    error: (oError) => {
                        reject(oError);
                    },
                });
            });
        },

		onSegunda: function () {
			var that = this;
			var messagem;
			via2 = "X";
			var count;

			if (param === "PLANO_MEDICO") {
				count = this.getView().byId("table1").getBinding("rows").getLength();
			} else if (param === "PLANO_ODONTOLOGICO") {
				count = this.getView().byId("table1_PLANO_ODONTOLOGICO").getBinding("rows").getLength();
			}

			if (count > 0) {
				messagem = "Deseje solicitar segunda via da carterinha para:";
				sap.m.MessageBox.show(messagem, {
					actions: ["Dependente", "Titular"],
					onClose: function (sAction) {
						if (sAction === "Dependente") {
							if (param === "PLANO_MEDICO") {
								that.byId("table1").setSelectionMode("MultiToggle");
								that.byId("IdCancelBeneficio").setVisible(false);
								that.byId("IdSegundaVia").setVisible(false);
								that.byId("IdCancelDetailDep").setVisible(true);
								that.byId("IdSalvarDetailDep").setVisible(true);
								that.byId("UPLOAD").setVisible(true);
								dep = "X";
							} else if (param === "PLANO_ODONTOLOGICO") {
								that.byId("table1_PLANO_ODONTOLOGICO").setSelectionMode("MultiToggle");
								that.byId("IdCancelBeneficio").setVisible(false);
								that.byId("IdSegundaVia").setVisible(false);
								that.byId("IdCancelDetailDep").setVisible(true);
								that.byId("IdSalvarDetailDep").setVisible(true);
								that.byId("UPLOAD").setVisible(true);
							}
						} else if (sAction === "Titular") {
							that.byId("UPLOAD").setVisible(true);
							that.byId("IdSegundaVia").setVisible(false);
							that.byId("IdCancelBeneficio").setVisible(false);
							that.byId("IdSalvarDetail2via").setVisible(true);
							that.byId("IdCancelDetailDep").setVisible(true);
						}
					}
				});
			} else {
				that.onSave(via2);
			}

		},
	});
});