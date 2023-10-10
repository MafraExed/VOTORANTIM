sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"../model/formatter",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/m/UploadCollectionParameter",
	"sap/ui/model/Filter",
	"sap/ui/core/format/DateFormat",
	"sap/f/library",
	"sap/m/Button",
	"sap/m/Text",
	"sap/m/Dialog"
], function (JSONModel, Controller, Formatter, MessageBox, MessageToast, UploadCollectionParameter, Filter, DateFormat, fioriLibrary,
	Button, Text, Dialog) {
	"use strict";

	const cTpItemAvulso = "01";

	const cStsAberto = "A";
	const cStsFinalizado = "F";
	const cStsAguardAprov = "X";

	const cTipoBoAvaria = "019";
	const cTipoBoPedSemSald = "026";
	const cTipoBoPedNLocaliz = "027";
	const cTipoBoPedItemElimin = "014";
	const cTipoBoCNPJDiverg = "028";

	const constErroBadRequest = "400";

	return Controller.extend("workspace.zcockpit_bo_v3.controller.S2", {
		myFormatter: Formatter,

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf workspace.zcockpit_bo_v3.view.S3
		 */
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("detailDetail").attachPatternMatched(this.handleRouteMatched, this);
		},

		handleRouteMatched: function (oEvent) {
			this._BOPath = oEvent.getParameter("arguments").BOPath;
			this._BOPathParent = oEvent.getParameter("arguments").BOPathParent;

			var oView = this.getView();
			var that = this;
			var oTranslationModel = this.getView().getModel("i18n");
			var oBundle = oTranslationModel.getResourceBundle();
			oView.bindElement({
				path: "/" + this._BOPath,
				parameters: {
					expand: "ZAT_VCMM_BOITEM_TO_BOANEXO,ZAT_VCMM_BOITEM_TO_BOHIST,ZAT_VCMM_BOITEM_TO_BOPED_AGRP"
				},
				model: "GE",
				events: {
					change: function (oEventChange) {
						// No data for the binding
						if (!oView.getBindingContext("GE")) {
							MessageBox.error(oBundle.getText("NotFound"), {
								title: oBundle.getText("Error"),
								styleClass: "sapUiSizeCompact",
								onClose: function (oAction) {
									that.handleClose();
								}
							});
						} else {
							that.verificarModeEdit();
						}
					},
					dataRequested: function (oData) {
						sap.ui.core.BusyIndicator.show();
					},
					dataReceived: function (oData) {
						sap.ui.core.BusyIndicator.hide();
					}
				}
			});
		},
		verificarModeEdit: function () {
			var oCtx = this.getView().getBindingContext("GE");
			if (oCtx) {
				//Para exibir opção para salvar
				if (oCtx.bCreated) {
					this.enableEditNewMode(true);

				} else if (oCtx.getModel().hasPendingChanges()) {
					this.enableEditExistMode(true);

				} else {
					//por já comtemplar a edição de item já existente
					this.enableEditNewMode(false);
				}
			}

		},

		_verificarSairSave: function (fnFunction) {
			let oView = this.getView();
			let oModel = oView.getModel("GE");
			let oTranslationModel = this.getView().getModel("i18n");
			let oBundle = oTranslationModel.getResourceBundle();
			let that = this;

			if (oModel && oModel.hasPendingChanges()) {

				var dialog = new Dialog({
					title: oBundle.getText("PopSairSave"),
					type: "Message",
					content: new Text({
						text: oBundle.getText("PopSairSaveText")
					}),
					beginButton: new Button({
						text: oBundle.getText("PopSairSaveBtnConfirm"),
						icon: "sap-icon://accept",
						type: "Accept",
						press: function () {
							if (oModel) {
								oModel.resetChanges();
								oModel.updateBindings(true);
							}
							fnFunction();
							dialog.close();
						}
					}),
					endButton: new Button({
						text: oBundle.getText("PopSairSaveBtnCancel"),
						icon: "sap-icon://decline",
						type: "Reject",
						press: function () {
							dialog.close();
						}
					}),
					afterClose: function () {
						that.getView().setBusy(false);
						dialog.destroy();
					}
				});
				dialog.open();
			} else {
				fnFunction();
			}
		},

		onEditToggleButtonPress: function (oEvent) {
			var oView = this.getView();
			var vControlId = "ButtonSaveId";
			var oControl = oView.byId(vControlId);
			var vEditMode = oControl.getEnabled();

			var that = this;
			var oCtx = this.getView().getBindingContext("GE");
			var bCreated = false;
			if (oCtx) {
				bCreated = oCtx.bCreated;
			}
			// Verifica alterações pendentes
			// Se há alterações pendentes, então o usuário está em modo de edição.
			// Logo, deve-se salvar ou perder os dados.
			this._verificarSairSave(function () {
				if (bCreated) {
					that.handleClose();
				} else {
					that.enableEditExistMode(!vEditMode);
				}
			});
		},

		enableEditNewMode: function (vEdit) {
			this.enableEditExistMode(vEdit);

			//tipo de B.O.
			let oControl = this.getView().byId("InputIncidentTypeId");
			oControl.setEditable(vEdit);
		},
		enableEditExistMode: function (vEdit) {

			let oView = this.getView();
			let oModelUtil = oView.getModel("GE");

			let oCtx = oView.getBindingContext("GE");
			let oItem = oCtx.getObject();

			//btn salvar
			let oBtnSalve = oView.byId("ButtonSaveId");
			oBtnSalve.setEnabled(vEdit);

			//histórico
			let oHist = oView.byId("FeedInputItemHist");
			oHist.setEnabled(vEdit);

			//Btn liberar B.O. para aberto
			let oBtnLibOpen = oView.byId("EditButtonLibOpen");
			oBtnLibOpen.setEnabled(false);

			//Btn finalizar B.O.
			let oBtnFinalizar = oView.byId("EditButtonFinish");
			oBtnFinalizar.setEnabled(false);

			//Btn gerar pedidos
			let oBtnPedProc = oView.byId("EditButtonPed");
			oBtnPedProc.setEnabled(false);

			//Btn para editar item BO
			let oBtnEditItm = oView.byId("EditButtonId");
			oBtnEditItm.setEnabled(true);

			oView.byId("downloadButton").setEnabled(false);
			oView.byId("delAnexButton").setEnabled(false);

			//para status
			let vEditStsAb = false;
			let vEditStsFim = false;
			let vEditStsAguardAprov = false;
			let vEditCreated = oCtx.bCreated;

			if (oItem.Status === cStsAberto) {
				vEditStsAb = vEdit;

				oBtnFinalizar.setEnabled(true);
				oBtnPedProc.setEnabled(true);

				//status finalizado
			} else if (oItem.Status === cStsFinalizado) {
				vEditStsFim = true;

				//status aguardando aprovação
			} else if (oItem.Status === cStsAguardAprov) {
				vEditStsAguardAprov = true;
				
				oBtnFinalizar.setEnabled(true);
			}

			oBtnLibOpen.setEnabled(vEditStsAguardAprov);

			let aFieldGrp = sap.ui.getCore().byFieldGroupId("GrpStsAberto");
			for (let oControl of aFieldGrp) {
				if (oControl.setEditable) {
					oControl.setEditable(vEditStsAb);
				} else if (oControl.setEnabled) {
					oControl.setEnabled(vEditStsAb);
				}
			}
			let oUpload = oView.byId("UploadCollection");
			oUpload.setUploadEnabled((vEditCreated || vEditStsAb) ? true : false);

			//editáveis para itens avulso ou tipo de B.O. sem pedido (só ao criar ou após aberto)
			// Obs.: Tipo de B.O. sem pedido: em conformidade com método ZCLMM0063_BOITEM_MODEL=>GET_TBO_SEM_PED( )
			let vEditItAvul = false;
			let vViewItAvul = false;
			if (oItem.TpItem === cTpItemAvulso || oItem.TipoBo === cTipoBoPedNLocaliz || oItem.TipoBo === cTipoBoPedItemElimin || oItem.TipoBo ===
				cTipoBoCNPJDiverg) {
				vEditItAvul = (vEditCreated || vEditStsAb) ? vEdit : false;
				vViewItAvul = true;
			}
			aFieldGrp = sap.ui.getCore().byFieldGroupId("GrpAvulsoItmEdit");
			for (let oControl of aFieldGrp) {
				if (oControl.setEditable) {
					oControl.setEditable(vEditItAvul);
				}
			}
			aFieldGrp = sap.ui.getCore().byFieldGroupId("GrpAvulsoItmOnly");
			for (let oControl of aFieldGrp) {
				if (oControl.setVisible) {
					oControl.setVisible(vViewItAvul);
				}
			}

			//pedidos processados
			aFieldGrp = sap.ui.getCore().byFieldGroupId("GrpPedProc");
			for (let oControl of aFieldGrp) {
				if (oControl.setVisible) {
					if (oItem.EbelnProc && oItem.EbelnProc !== "") {
						oControl.setVisible(true);
					} else {
						oControl.setVisible(false);
					}
				}
			}

			//pedidos agrupados
			let vEditPedAgrp = vEditStsAb;
			let aBoPedAgrp = oItem.ZAT_VCMM_BOITEM_TO_BOPED_AGRP;
			let aBoPedAgrpPath;
			if (aBoPedAgrp) {
				aBoPedAgrpPath = aBoPedAgrp.__list;
			}
			if (aBoPedAgrpPath && Array.isArray(aBoPedAgrpPath)) {
				if (aBoPedAgrpPath.length <= 0) {
					vEditPedAgrp = vEditStsAb;
				} else {
					for (let vPathPedAgrp of aBoPedAgrpPath) {
						if (vPathPedAgrp === "") {
							vEditPedAgrp = false;
							break;
						}
						let oBoAgrpPed = oModelUtil.getContext("/" + vPathPedAgrp);
						//caso encontre registro que já está persistido, não habilita a edição
						if (oBoAgrpPed !== undefined && !oBoAgrpPed.bCreated) {
							vEditPedAgrp = false;
							break;
						}
					}
				}
			}
			aFieldGrp = sap.ui.getCore().byFieldGroupId("GrpPedAgrpEdit");
			for (let oControl of aFieldGrp) {
				if (oControl.setEditable) {
					oControl.setEditable(vEditPedAgrp);
				} else if (oControl.setEnabled) {
					oControl.setEnabled(vEditPedAgrp);
				}
			}

			//Tipo de B.O.: Avaria
			if (oItem.TipoBo === cTipoBoAvaria) {
				let oInputQtde = oView.byId("InputItemAmountIncidentId");
				oInputQtde.setEditable((vEditCreated || vEditStsAb) ? vEdit : false);
			}

			//Status finalizado
			if (vEditStsFim) {
				oBtnSalve.setEnabled(false);
				oHist.setEnabled(false);
				oBtnEditItm.setEnabled(false);
			}

		},

		onPressCancel: function (oEvent) {
			this.handleClose();
		},

		handleFullScreen: function () {
			var sNextLayout = this.getOwnerComponent().getModel("FlexibleColumn").getProperty("/actionButtonsInfo/endColumn/fullScreen");
			this.oRouter.navTo("detailDetail", {
				layout: sNextLayout,
				BOPath: this._BOPath,
				BOPathParent: this._BOPathParent
			});

		},

		handleExitFullScreen: function () {
			var sNextLayout = this.getOwnerComponent().getModel("FlexibleColumn").getProperty("/actionButtonsInfo/endColumn/exitFullScreen");
			this.oRouter.navTo("detailDetail", {
				layout: sNextLayout,
				BOPath: this._BOPath,
				BOPathParent: this._BOPathParent
			});
		},
		navToList: function () {
			var that = this;
			this._verificarSairSave(function () {
				that._navToList();
			});
		},
		_navToList: function () {
			var sNextLayout = this.getOwnerComponent().getModel("FlexibleColumn").getProperty("/actionButtonsInfo/midColumn/closeColumn");
			this.oRouter.navTo("master", {
				layout: sNextLayout
			});
		},
		handleClose: function () {
			var that = this;
			var vCreatedParent = false;
			var oModelParent;
			try {
				oModelParent = this.getView().getModel("GE").getContext("/" + this._BOPathParent);
				vCreatedParent = oModelParent.bCreated;
			} catch (e) {
				vCreatedParent = false;
			}
			this._verificarSairSave(function () {
				if (vCreatedParent) {
					that.navToList();
				} else {
					that._closeFlexColumn();
				}
			});
		},
		_closeFlexColumn: function () {
			var that = this;
			this._verificarSairSave(function () {
				var sNextLayout = that.getOwnerComponent().getModel("FlexibleColumn").getProperty("/actionButtonsInfo/endColumn/closeColumn");
				that.oRouter.navTo("detail", {
					layout: sNextLayout,
					BOPath: that._BOPathParent
				});
			});
		},
		onPost: function (oEvent) {
			var oTranslationModel = this.getView().getModel("i18n");
			var oBundle = oTranslationModel.getResourceBundle();

			var oCtxItm = this.getView().getBindingContext("GE");
			var vNumeroBo, vItemBo;
			//if (!oCtxItm.bCreated) {
			vNumeroBo = oCtxItm.getProperty(oCtxItm.getPath() + "/NumeroBo");
			vItemBo = oCtxItm.getProperty(oCtxItm.getPath() + "/ItemBo");
			//}
			//forçar para update o parent
			var oDate = new Date();
			oCtxItm.getModel().setProperty(oCtxItm.getPath() + "/Chadat", oDate);

			var aBoItemHist = oCtxItm.getProperty(oCtxItm.getPath() + "/ZAT_VCMM_BOITEM_TO_BOHIST");
			if (!aBoItemHist) {
				aBoItemHist = [];
				oCtxItm.getModel().setProperty(oCtxItm.getPath() + "/ZAT_VCMM_BOITEM_TO_BOHIST", aBoItemHist);
			}

			var oModel = this.getOwnerComponent().getModel("GE");
			var oContextNew = oModel.createEntry("ZET_VCMM_BOHISTSet");
			var oModelNew = oContextNew.getModel();
			var vPathNew = oContextNew.getPath();

			oModelNew.setProperty(vPathNew + "/NumeroBo", vNumeroBo);
			oModelNew.setProperty(vPathNew + "/ItemBo", vItemBo);
			oModelNew.setProperty(vPathNew + "/Comentario", oEvent.getParameter("value"));
			oModelNew.setProperty(vPathNew + "/Credat", oDate);
			if (sap.ushell !== undefined) {
				oModelNew.setProperty(vPathNew + "/NomeUsuario", sap.ushell.Container.getUser().getFullName());
			} else {
				oModelNew.setProperty(vPathNew + "/NomeUsuario", oBundle.getText("value_name"));
			}

			//add path
			vPathNew = vPathNew.split("/").slice(-1).pop();
			aBoItemHist.push(vPathNew);

			oCtxItm.getModel().updateBindings();
		},
		handleBoTypeValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment("workspace.zcockpit_bo_v3.view.BOType", this);
				this.getView().addDependent(this._valueHelpDialog);
			}
			this._valueHelpDialog.open(sInputValue);
		},

		_handleBoTypeValueHelpSearch: function (evt) {
			var sValue = evt.getParameter("value").toUpperCase();
			var oFilter = new Filter(
				"Descricao",
				sap.ui.model.FilterOperator.Contains, sValue);

			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleBoTypeValueHelpClose: function (evt) {
			let oSelectedItem = evt.getParameter("selectedItem");
			let oInput = this.byId("InputIncidentTypeId");
			let oInputQtde = this.byId("InputItemAmountIncidentId");
			if (oInput && oSelectedItem) {
				let sKey = oSelectedItem.getDescription();
				let sDescr = oSelectedItem.getTitle();

				oInput.setValue(sKey);
				oInput.setDescription(sDescr);

				this.verificarModeEdit();
			}
		},
		handleGCatValueHelp: function (oEvent) {
			var oView = this.getView();
			var oDialog = oView.byId("selectDialogGcat");
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "workspace.zcockpit_bo_v3.view.GCat", this);
				// connect dialog to view (models, lifecycle)
				oView.addDependent(oDialog);
			}

			//oDialog.removeAllItems();

			//Filtro base
			var oModelUtil = this.getView().getModel("GE");
			var oHeaderBo = oModelUtil.getContext("/" + this._BOPathParent);
			var oObjHeader = oHeaderBo.getObject();

			if (oObjHeader) {
				var oFilter = new sap.ui.model.Filter({
					filters: [
						new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, oObjHeader.Bukrs)
					],
					and: true
				});

				var oBinding = oDialog.getBinding("items");
				oBinding.filter(oFilter);

				oDialog.open();
			} else {
				this.handleClose();
			}

		},
		_handleGCatValueHelpSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value").toUpperCase();

			//Filtro base
			var oModelUtil = this.getView().getModel("GE");
			var oHeaderBo = oModelUtil.getContext("/" + this._BOPathParent);

			var oFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, oHeaderBo.getObject().Bukrs),
					new sap.ui.model.Filter("DescrGcat", sap.ui.model.FilterOperator.Contains, sValue)
				],
				and: true
			});
			var oView = this.getView();
			var oBinding = oView.byId("selectDialogGcat").getBinding("items");
			oBinding.filter(oFilter);
		},
		_handleGCatValueHelpClose: function (oEvent) {
			let oSelectedItem = oEvent.getParameter("selectedItem");
			let oInput = this.byId("InputGcatId");
			if (oInput && oSelectedItem) {
				let sDescr = oSelectedItem.getDescription();
				let sKey = oSelectedItem.getTitle();

				try {
					oInput.setValue(sKey);
					oInput.setDescription(sDescr);

					//remove o processador atual
					let oInputProcAtual = this.getView().byId("InputProcAtualId");
					oInputProcAtual.setValue("");
					oInputProcAtual.setDescription("");
				} catch (e) {
					MessageBox.error(e.message);
				}

			}
		},
		handleProcAtualValueHelp: function (oEvent) {
			var oTranslationModel = this.getView().getModel("i18n");
			var oBundle = oTranslationModel.getResourceBundle();
			var oView = this.getView();
			var oInputGCat = oView.byId("InputGcatId");
			var vGcat = oInputGCat.getValue();

			if (!vGcat || vGcat.length <= 0 || vGcat === "0000") {
				oInputGCat.setValueState("Error");
				oInputGCat.setValueStateText(oBundle.getText("input_required"));

				MessageBox.error(oBundle.getText("not_found_gcat"));
			} else {

				var oDialog = oView.byId("selectDialogRespBo");
				// create dialog lazily
				if (!oDialog) {
					// create dialog via fragment factory
					oDialog = sap.ui.xmlfragment(oView.getId(), "workspace.zcockpit_bo_v3.view.RespBO", this);
					// connect dialog to view (models, lifecycle)
					oView.addDependent(oDialog);
				}

				//Filtro base
				var oModelUtil = this.getView().getModel("GE");
				var oHeaderBo = oModelUtil.getContext("/" + this._BOPathParent);
				var oFilter = new sap.ui.model.Filter({
					filters: [
						new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, oHeaderBo.getObject().Bukrs),
						new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.EQ, oHeaderBo.getObject().Werks),
						new sap.ui.model.Filter("GestorCategoria", sap.ui.model.FilterOperator.EQ, vGcat)
					],
					and: true
				});

				var oBinding = oDialog.getBinding("items");
				oBinding.filter(oFilter);

				oDialog.open();

			}
		},
		_handleProcAtualValueHelpSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value").toUpperCase();

			//Filtro base
			var oModelUtil = this.getView().getModel("GE");
			var oHeaderBo = oModelUtil.getContext("/" + this._BOPathParent);

			var vGcat = this.getView().byId("InputGcatId").getValue();

			var oFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, oHeaderBo.getObject().Bukrs),
					new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.EQ, oHeaderBo.getObject().Werks),
					new sap.ui.model.Filter("GestorCategoria", sap.ui.model.FilterOperator.EQ, vGcat),
					new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, sValue)
				],
				and: true
			});
			var oView = this.getView();
			var oBinding = oView.byId("selectDialogRespBo").getBinding("items");
			oBinding.filter(oFilter);
		},
		_handleProcAtualValueHelpClose: function (oEvent) {
			let oSelectedItem = oEvent.getParameter("selectedItem");
			let oInput = this.byId("InputProcAtualId");
			let oInputType = this.byId("InputTypeProcAtualId");
			if (oInput && oSelectedItem) {
				try {
					let oCtxSel = oSelectedItem.getBindingContext("GE");
					let oRespBo = oCtxSel.getObject();
					oInput.setValue(oRespBo.RespBo);
					oInput.setDescription(oRespBo.Name);

					oInputType.setValue(oRespBo.TpRespBo);

					let oInputGcat = this.getView().byId("InputGcatId");

					//atualiza o gestor de categoria
					if (oInputGcat.getValue() !== oRespBo.GestorCategoria) {

						oInputGcat.setValue(oRespBo.GestorCategoria);

						//para pegar a descrição (caso o objeto já esteja carregado)
						let oCtxGeral = this.getView().getModel("GE");
						let sUrlGCat = "/ZET_VCMM_GCAT_BOSet(Bukrs='" + oRespBo.Bukrs + "',GestorCategoria='" + oRespBo.GestorCategoria + "')";
						let oGCat = oCtxGeral.getProperty(sUrlGCat);
						if (oGCat) {
							oInputGcat.setDescription(oGCat.DescrGcat);
						}
					}
				} catch (e) {
					MessageBox.error(e.message);
				}

			}
		},
		onSelectionChange: function () {
			var oUploadCollection = this.byId("UploadCollection");
			// If there's any item selected, sets download button enabled
			if (oUploadCollection.getSelectedItems().length > 0) {
				this.byId("downloadButton").setEnabled(true);
				this.byId("delAnexButton").setEnabled(true);
			} else {
				this.byId("downloadButton").setEnabled(false);
				this.byId("delAnexButton").setEnabled(false);
			}
		},

		onBeforeUploadStarts: function (oEvent) {
			// Header Slug
			var oCustomerHeaderSlug = new UploadCollectionParameter({
				name: "slug",
				value: oEvent.getParameter("fileName")
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
		},

		onUploadComplete: function (oEvent) {
			/*var sUploadedFileName = oEvent.getParameter("files")[0].fileName;
			setTimeout(function() {
				var oUploadCollection = this.byId("UploadCollection");

				for (var i = 0; i < oUploadCollection.getItems().length; i++) {
					if (oUploadCollection.getItems()[i].getFileName() === sUploadedFileName) {
						oUploadCollection.removeItem(oUploadCollection.getItems()[i]);
						break;
					}
				}

				// delay the success message in order to see other messages before
				//MessageToast.show("Event uploadComplete triggered");
			}.bind(this), 8000);*/

		},
		onGerarPedido: function (oEvent) {
			var that = this;
			this._verificarSairSave(function () {
				that._gerarPedido();
			});
		},
		_gerarPedido: function () {
			var oView = this.getView();
			var oBundle = oView.getModel("i18n").getResourceBundle();
			var that = this;
			var oModelUtil = oView.getModel("GE");
			var vPath = oView.getBindingContext("GE").getPath();
			var oItemBo = oModelUtil.getProperty(vPath);

			var dialog = new Dialog({
				title: oBundle.getText("PopGerPedidoTitle"),
				type: "Message",
				content: new Text({
					text: oBundle.getText("PopGerPedidoText")
				}),
				beginButton: new Button({
					text: oBundle.getText("PopGerPedidoBtnConfirm"),
					icon: "sap-icon://accept",
					type: "Accept",
					press: function () {
						if (oItemBo.TipoBo === cTipoBoPedSemSald) {
							//opção para informar o tipo de pedido
							that._procPedDivergSelBsart();
						} else {
							//tipo de pedido será determinado pelo serviço
							that._procPedDiverg("");
						}

						dialog.close();
					}
				}),
				endButton: new Button({
					text: oBundle.getText("PopGerPedidoBtnCancel"),
					icon: "sap-icon://decline",
					type: "Reject",
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
		_procPedDivergSelBsart: function () {
			var oView = this.getView();
			var oBundle = oView.getModel("i18n").getResourceBundle();
			var that = this;
			var oModelUtil = oView.getModel("GE");
			var vPath = oView.getBindingContext("GE").getPath();
			var oItemBo = oModelUtil.getProperty(vPath);
			var vIdInputBsart = "InputBsartProc";

			var dialog = new Dialog({
				title: oBundle.getText("PopBsartProcTitle"),
				type: "Message",
				content: [
					new sap.m.Label({
						text: oBundle.getText("labelBsartProc"),
						labelFor: vIdInputBsart,
					}),
					new sap.m.Input({
						maxLength: 4,
						id: vIdInputBsart,
						required: true,
						value: oItemBo.BsartProc
					})
				],
				beginButton: new Button({
					text: oBundle.getText("PopBsartProcConfirm"),
					icon: "sap-icon://accept",
					type: "Accept",
					press: function () {
						var oInputBsart = sap.ui.getCore().byId(vIdInputBsart);
						var vBsart = oInputBsart.getValue();
						if (vBsart && $.trim(vBsart) !== "") {
							that._procPedDiverg(vBsart);
							dialog.close();
						} else {
							oInputBsart.setValueState("Error");
							oInputBsart.setValueStateText(oBundle.getText("input_required"));
						}

					}
				}),
				endButton: new Button({
					text: oBundle.getText("PopBsartProcCancel"),
					icon: "sap-icon://decline",
					type: "Reject",
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
		_procPedDiverg: function (vBsart) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var oModelUtil = this.getView().getModel("GE");
			var that = this;

			var vPath = this.getView().getBindingContext("GE").getPath();
			var oItemBo = oModelUtil.getProperty(vPath);

			oModelUtil.attachRequestSent(this._onAttachRequest);
			oModelUtil.attachRequestCompleted(this._onAttachRequestCompleted);
			oModelUtil.callFunction("/procPedDiverg", {
				method: "POST", // http method
				urlParameters: {
					"itemBo": oItemBo.ItemBo,
					"numeroBo": oItemBo.NumeroBo,
					"bsart": vBsart
				}, // function import parameters
				success: function (oData, response) { // callback function for success
					MessageBox.success(
						oBundle.getText("PopGerPedidoOk"), {
							onClose: function (oAction) {
								that.handleClose();
							}
						});
					oModelUtil.updateBindings();
				},
				error: function (oData) { // callback function for error
					//that._onAttachRequestCompleted();
					var responseText = oData.responseText;
					if (responseText !== undefined) {
						var vMsgErro = "";
						try {
							var responseParser = JSON.parse(responseText);
							var errorDetails = responseParser.error.innererror.errordetails;
							if (errorDetails.length > 1) {
								vMsgErro = errorDetails[0].message;
							} else {
								vMsgErro = responseParser.error.message.value;
							}
						} catch (err) {
							vMsgErro = responseText;
						}
						MessageBox.error(vMsgErro, {
							title: oBundle.getText("backend_read_error"),
							styleClass: "sapUiSizeCompact"
						});
					} else {
						MessageBox.error(oBundle.getText("backend_read_error"), {
							styleClass: "sapUiSizeCompact"
						});
					}
				}
			});

		},
		onPressFinish: function (oEvent) {
			var that = this;
			this._verificarSairSave(function () {
				that._finalizarItemBO();
			});
		},
		_finalizarItemBO: function () {
			var oView = this.getView();
			var oBundle = oView.getModel("i18n").getResourceBundle();
			var that = this;
			var dialog = new Dialog({
				title: oBundle.getText("PopFinishTitle"),
				type: "Message",
				content: new Text({
					text: oBundle.getText("PopFinishText")
				}),
				beginButton: new Button({
					text: oBundle.getText("PopGerPedidoBtnConfirm"),
					icon: "sap-icon://accept",
					type: "Accept",
					press: function () {
						that._callFunction("defStsItmBOFinalizado");
						dialog.close();
					}
				}),
				endButton: new Button({
					text: oBundle.getText("PopGerPedidoBtnCancel"),
					icon: "sap-icon://decline",
					type: "Reject",
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
		onPressLibOpen: function (oEvent) {
			var that = this;
			this._verificarSairSave(function () {
				that._liberarOpenItemBO();
			});
		},
		_liberarOpenItemBO: function () {
			var oView = this.getView();
			var oBundle = oView.getModel("i18n").getResourceBundle();
			var that = this;
			var dialog = new Dialog({
				title: oBundle.getText("PopLibOpenTitle"),
				type: "Message",
				content: new Text({
					text: oBundle.getText("PopLibOpenText")
				}),
				beginButton: new Button({
					text: oBundle.getText("PopGerPedidoBtnConfirm"),
					icon: "sap-icon://accept",
					type: "Accept",
					press: function () {
						that._callFunction("defStsItmBOAberto");
						dialog.close();
					}
				}),
				endButton: new Button({
					text: oBundle.getText("PopGerPedidoBtnCancel"),
					icon: "sap-icon://decline",
					type: "Reject",
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
		_callFunction: function (vFunction) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var oModelUtil = this.getView().getModel("GE");
			var that = this;

			var vPath = this.getView().getBindingContext("GE").getPath();
			var oItemBo = oModelUtil.getProperty(vPath);

			oModelUtil.attachRequestSent(this._onAttachRequest);
			oModelUtil.attachRequestCompleted(this._onAttachRequestCompleted);
			oModelUtil.callFunction("/" + vFunction, {
				method: "POST", // http method
				urlParameters: {
					"itemBo": oItemBo.ItemBo,
					"numeroBo": oItemBo.NumeroBo
				}, // function import parameters
				success: function (oData, response) { // callback function for success
					MessageBox.success(
						oBundle.getText("PopGerPedidoOk"), {
							onClose: function (oAction) {
								that.handleClose();
							}
						});
					oModelUtil.updateBindings();
				},
				error: function (oData) { // callback function for error
					//that._onAttachRequestCompleted();
					var responseText = oData.responseText;
					if (responseText !== undefined) {
						var vMsgErro = "";
						try {
							var responseParser = JSON.parse(responseText);
							var errorDetails = responseParser.error.innererror.errordetails;
							if (errorDetails.length > 1) {
								vMsgErro = errorDetails[0].message;
							} else {
								vMsgErro = responseParser.error.message.value;
							}
						} catch (err) {
							vMsgErro = responseText;
						}
						MessageBox.error(vMsgErro, {
							title: oBundle.getText("backend_read_error"),
							styleClass: "sapUiSizeCompact"
						});
					} else {
						MessageBox.error(oBundle.getText("backend_read_error"), {
							styleClass: "sapUiSizeCompact"
						});
					}
				}
			});

		},
		onChange: function (oEvent) {
			var oFile = oEvent.getParameter("files")[0];
			var reader = new FileReader();
			var that = this;
			reader.onload = function (e) {

				var oCtxItm = that.getView().getBindingContext("GE");
				var vNumeroBo, vItemBo;
				//if (!oCtxItm.bCreated) {
				vNumeroBo = oCtxItm.getProperty(oCtxItm.getPath() + "/NumeroBo");
				vItemBo = oCtxItm.getProperty(oCtxItm.getPath() + "/ItemBo");
				//}
				//forçar para update o parent
				var oDate = new Date();
				oCtxItm.getModel().setProperty(oCtxItm.getPath() + "/Chadat", oDate);

				var aBoItemAnexo = oCtxItm.getProperty(oCtxItm.getPath() + "/ZAT_VCMM_BOITEM_TO_BOANEXO");
				if (!aBoItemAnexo) {
					aBoItemAnexo = [];
					oCtxItm.getModel().setProperty(oCtxItm.getPath() + "/ZAT_VCMM_BOITEM_TO_BOANEXO", aBoItemAnexo);
				}

				var oModel = that.getOwnerComponent().getModel("GE");
				var oContextNew = oModel.createEntry("ZET_VCMM_BOANEXOSet");
				var oModelNew = oContextNew.getModel();
				var vPathNew = oContextNew.getPath();

				let vDescr = vNumeroBo + vItemBo;
				if (!vDescr) {
					vDescr = "Novo_Item";
				}
				let vMime = "";
				if (oFile.type) {
					vMime = oFile.type.substring(0, 30);
				}
				oModelNew.setProperty(vPathNew + "/Description", vDescr);
				oModelNew.setProperty(vPathNew + "/DocumentType", "BO");
				oModelNew.setProperty(vPathNew + "/FilePath", oFile.name);
				
				
				let str = e.currentTarget.result;
				let regex = /(base64,)/g;

				var vBase64 = "";
				if(vMime != "" ){
					vBase64 = e.currentTarget.result.replace("data:" + oFile.type + ";base64,", "");	
				}else{
					let vIndex = str.search(regex);
					vMime = e.currentTarget.result.substring(5,vIndex);
					vIndex = vIndex + 7;
					vBase64 = e.currentTarget.result.substring(vIndex);
				}
				
				oModelNew.setProperty(vPathNew + "/MimeType", vMime);
				oModelNew.setProperty(vPathNew + "/Base64", vBase64);

				oModelNew.setProperty(vPathNew + "/ItemBo", vItemBo);
				oModelNew.setProperty(vPathNew + "/NumeroBo", vNumeroBo);

				//add path
				vPathNew = vPathNew.split("/").slice(-1).pop();
				aBoItemAnexo.push(vPathNew);

				oCtxItm.getModel().updateBindings();
			};

			reader.readAsDataURL(oFile);

		},

		onDownloadItem: function () {
			var oUploadCollection = this.byId("UploadCollection");
			var aSelectedItems = oUploadCollection.getSelectedItems();
			if (aSelectedItems) {
				for (var i = 0; i < aSelectedItems.length; i++) {
					var oModel = this.getView().getModel("GE");
					var vPath = aSelectedItems[i].getBindingContext("GE").getPath();
					var oProperty = oModel.getProperty(vPath);

					var vFileCategory = oProperty.DocumentType;
					var vfileDescription = oProperty.Description;
					var vId = aSelectedItems[i].getProperty("documentId");

					var oURL = oModel.sServiceUrl + "/ZET_VCMM_FILESet(fileName='" + vId + "',fileCategory='" +
						vFileCategory + "',fileDescription='" + vfileDescription + "')/$value";
					sap.m.URLHelper.destroy();
					sap.m.URLHelper.redirect(oURL, true);
				}
			}
		},
		onDelAnex: function () {
			var oTranslationModel = this.getView().getModel("i18n");
			var oBundle = oTranslationModel.getResourceBundle();
			var oUploadCollection = this.byId("UploadCollection");
			var aSelectedItems = oUploadCollection.getSelectedItems();
			var oCtxItm = this.getView().getBindingContext("GE");
			var oModel = this.getView().getModel("GE");
			var aBoItemAnexo = oCtxItm.getProperty(oCtxItm.getPath() + "/ZAT_VCMM_BOITEM_TO_BOANEXO");
			if (aSelectedItems) {
				for (var i = 0; i < aSelectedItems.length; i++) {
					var oCtxSel = aSelectedItems[i].getBindingContext("GE");
					if (!oCtxSel.bCreated) { //somente os recem criados
						MessageBox.error(oBundle.getText("only_remove_new"));
						break;
					}
					oModel.deleteCreatedEntry(oCtxSel);

					//remove do relacionamento
					var vPath = oCtxSel.getPath();
					vPath = vPath.split("/").slice(-1).pop();
					if (aBoItemAnexo && aBoItemAnexo instanceof Array) {
						for (var j = 0; j < aBoItemAnexo.length; j++) {
							if (aBoItemAnexo[j] === vPath) {
								aBoItemAnexo.splice(j, 1);
								break;
							}
						}
					}

				}

				oCtxItm.getModel().updateBindings();
			}
		},
		onPressSave: function (oEvent) {
			var oTranslationModel = this.getView().getModel("i18n");
			var oBundle = oTranslationModel.getResourceBundle();
			if (!this.validateMandatoryFields()) {
				var that = this;
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				var vCreatedParent = false;
				var oModelParent;
				try {
					oModelParent = this.getView().getModel("GE").getContext("/" + this._BOPathParent);
					vCreatedParent = oModelParent.bCreated;
				} catch (e) {
					vCreatedParent = false;
				}

				var vPendChanges = false;

				var oCtx = this.getView().getBindingContext("GE");
				if (oCtx) {
					var oModel = oCtx.getModel();
				}

				if (oCtx) {
					vPendChanges = oModel.hasPendingChanges();
				}
				if (!vPendChanges) {
					MessageBox.error(oBundle.getText("not_pend_changes"), {
						styleClass: bCompact ? "sapUiSizeCompact" : ""
					});
				} else {
					oModel.attachRequestSent(this._onAttachRequest);
					oModel.attachRequestCompleted(this._onAttachRequestCompleted);

					var NumeroBoParent;
					try {
						if (oModelParent) {
							NumeroBoParent = oModelParent.getProperty(oModelParent.getPath() + "/NumeroBo");
						}
						if (!NumeroBoParent) {
							NumeroBoParent = oCtx.getProperty(oCtx.getPath() + "/NumeroBo");
						}
					} catch (error) {
						NumeroBoParent = undefined;
					}

					var mParameters = {
						success: function (oData, oResp) {
							var vNumeroBoOut;
							try {
								for (let oBatchResponse of oData.__batchResponses) {

									//Verifica se há erro
									var vMsgErro = null;
									try {
										if (oBatchResponse.response.statusCode === constErroBadRequest) { //Erro
											var responseParser = JSON.parse(oBatchResponse.response.body);
											var errorDetails = responseParser.error.innererror.errordetails;
											if (errorDetails.length > 1) {
												vMsgErro = errorDetails[0].message;
											} else {
												vMsgErro = responseParser.error.message.value;
											}
											MessageBox.error(vMsgErro, {
												title: oBundle.getText("backend_read_error"),
												styleClass: "sapUiSizeCompact"
											});
											break;
										}
									} catch (errMsg) {
										vMsgErro = null;
									}
								} //for (let oBatchResponse of oData.__batchResponses) {

								//Se não houve erro...
								if (vMsgErro === null) {

									//verifica se houve sucesso
									for (let oBatchResponse of oData.__batchResponses) {

										if (oBatchResponse && oBatchResponse.__changeResponses) {

											for (let oResponse of oBatchResponse.__changeResponses) {
												try {
													vNumeroBoOut = that.myFormatter.shiftLeadingZeros(oResponse.data.NumeroBo);
													if (vNumeroBoOut <= 0) {
														vNumeroBoOut = undefined;
														continue;
													}
													break;
												} catch (errResp) {
													vNumeroBoOut = undefined;
													continue;
												}
											} //for (let oResponse of oData.__batchResponses[0].__changeResponses) {

											if (vNumeroBoOut) {
												break;
											}

										} else {
											try {
												vNumeroBoOut = that.myFormatter.shiftLeadingZeros(oBatchResponse.data.NumeroBo);
												if (vNumeroBoOut <= 0) {
													vNumeroBoOut = undefined;
													continue;
												}
												break;
											} catch (errResp) {
												vNumeroBoOut = undefined;
												continue;
											}
										} //if (oBatchResponse && oBatchResponse.__changeResponses) {
									} //for (let oBatchResponse of oData.__batchResponses) {

									//successo
									if (!vNumeroBoOut) {
										try {
											vNumeroBoOut = that.myFormatter.shiftLeadingZeros(NumeroBoParent);
											if (vNumeroBoOut <= 0) {
												vNumeroBoOut = undefined;
											}
										} catch (errResp) {
											vNumeroBoOut = undefined;
										}
									}
									if (vNumeroBoOut) {
										MessageBox.success(
											oBundle.getText("bo_created_success", [vNumeroBoOut]), {
												styleClass: bCompact ? "sapUiSizeCompact" : "",
												onClose: function (oAction) {
													oModel.resetChanges();
													if (vCreatedParent) {
														that.navToList();
													} else {
														that.handleClose();
													}
												}
											});
										oModel.updateBindings();
									} else {
										MessageBox.error(oBundle.getText("backend_read_error"));
									}

								} //if (vMsgErro === null) {
							} catch (err) {
								MessageBox.error(oBundle.getText("backend_read_error"));
							}
						},
						error: function (oData, oResp) {
							//that._onAttachRequestCompleted();
							if (oData.__batchResponses !== undefined) {
								var vMsgErro = "";
								try {
									var responseParser = JSON.parse(oData.__batchResponses[0].response.body);
									var errorDetails = responseParser.error.innererror.errordetails;
									if (errorDetails.length > 1) {
										vMsgErro = errorDetails[0].message;
									} else {
										vMsgErro = responseParser.error.message.value;
									}
								} catch (err) {
									vMsgErro = oData.__batchResponses[0].message;
								}
								MessageBox.error(vMsgErro, {
									title: oBundle.getText("backend_read_error"),
									styleClass: "sapUiSizeCompact"
								});
							} else {
								MessageBox.error(oBundle.getText("backend_read_error"));
							}
						}
					};
					oModel.submitChanges(mParameters);

				}
			} else {
				MessageBox.error(oBundle.getText("validate_field_error"), {
					title: oBundle.getText("backend_read_error"),
					styleClass: "sapUiSizeCompact"
				});
			}
		},

		validateMandatoryFields: function () {

			// Verifica se campos obrigatórios estão preenchidos
			let oView = this.getView();
			let bValidationError = false;
			let oTranslationModel = this.getView().getModel("i18n");
			let oBundle = oTranslationModel.getResourceBundle();
			let aControlsMand = [];

			//todos campos criados para o pedido agrupado
			let aFieldGrp = sap.ui.getCore().byFieldGroupId("GrpPedAgrpEdit");
			for (let oControl of aFieldGrp) {
				if (oControl && oControl.getEditable && oControl.bOutput && oControl.getRequired && oControl.getRequired()) {
					aControlsMand.push(oControl);
				}
			}
			//todos id's obrigatórios
			let oInputTpBo = oView.byId("InputIncidentTypeId");
			if (oInputTpBo && oInputTpBo.getEditable && oInputTpBo.bOutput) {
				aControlsMand.push(oInputTpBo);
			}

			//todos controls obrigatórios
			for (let oControl of aControlsMand) {
				if (!oControl.getEditable || !oControl.getEditable()) {
					continue;
				}

				if (oControl.getValue() === "") {
					oControl.setValueState("Error");
					oControl.setValueStateText(oBundle.getText("input_required"));
					bValidationError = true;
				} else {
					oControl.setValueState("None");
				}
			}

			return bValidationError;
		},
		onPressLog: function () {
			var oView = this.getView();
			var oDialog = oView.byId("idDialogTableLogItm");
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "workspace.zcockpit_bo_v3.view.LogItem", this);
				// connect dialog to view (models, lifecycle)
				oView.addDependent(oDialog);
			}

			var oModelUtil = oView.getBindingContext("GE");
			var vPath = oModelUtil.getPath();
			var oItemBo = oModelUtil.getProperty(vPath);

			var oTbTableLog = oView.byId("idTbTableLogItm");

			var oFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("NumeroBo", sap.ui.model.FilterOperator.EQ, oItemBo.NumeroBo),
					new sap.ui.model.Filter("ItemBo", sap.ui.model.FilterOperator.EQ, oItemBo.ItemBo)
				],
				and: true
			});

			var oBinding = oTbTableLog.getBinding("items");
			oBinding.filter(oFilter);

			oDialog.open();
		},
		onAddPedAgrp: function (oEvent) {
			var oCtxItm = this.getView().getBindingContext("GE");
			var vNumeroBo, vItemBo;

			//if (!oCtxItm.bCreated) {
			vNumeroBo = oCtxItm.getProperty(oCtxItm.getPath() + "/NumeroBo");
			vItemBo = oCtxItm.getProperty(oCtxItm.getPath() + "/ItemBo");
			//}
			//forçar para update o parent
			var oDate = new Date();
			oCtxItm.getModel().setProperty(oCtxItm.getPath() + "/Chadat", oDate);

			var aBoAgrpPed = oCtxItm.getProperty(oCtxItm.getPath() + "/ZAT_VCMM_BOITEM_TO_BOPED_AGRP");
			if (!aBoAgrpPed) {
				aBoAgrpPed = [];
				oCtxItm.getModel().setProperty(oCtxItm.getPath() + "/ZAT_VCMM_BOITEM_TO_BOPED_AGRP", aBoAgrpPed);
			}

			var oModel = this.getOwnerComponent().getModel("GE");
			var oContextNew = oModel.createEntry("ZET_VCMM_BOPED_AGRPSet");
			var oModelNew = oContextNew.getModel();
			var vPathNew = oContextNew.getPath();

			oModelNew.setProperty(vPathNew + "/NumeroBo", vNumeroBo);
			oModelNew.setProperty(vPathNew + "/ItemBo", vItemBo);

			//add path
			vPathNew = vPathNew.split("/").slice(-1).pop();
			aBoAgrpPed.push(vPathNew);

			oCtxItm.getModel().updateBindings();
		},
		onRemovePedAgrp: function (oEvent) {
			var oTranslationModel = this.getView().getModel("i18n");
			var oBundle = oTranslationModel.getResourceBundle();
			var oTable = this.byId("PedAgrpTableId");
			var aSelectedItems = oTable.getSelectedItems();
			var oCtxItm = this.getView().getBindingContext("GE");
			var oModel = this.getView().getModel("GE");
			var aBoAgrpPed = oCtxItm.getProperty(oCtxItm.getPath() + "/ZAT_VCMM_BOITEM_TO_BOPED_AGRP");
			if (aSelectedItems) {
				for (var i = 0; i < aSelectedItems.length; i++) {
					var oCtxSel = aSelectedItems[i].getBindingContext("GE");
					if (!oCtxSel.bCreated) { //somente os recem criados
						MessageBox.error(oBundle.getText("only_remove_new"));
						break;
					}
					//remove do model geral
					oModel.deleteCreatedEntry(oCtxSel);

					//remove do relacionamento
					var vPath = oCtxSel.getPath();
					vPath = vPath.split("/").slice(-1).pop();
					if (aBoAgrpPed && aBoAgrpPed instanceof Array) {
						for (var j = 0; j < aBoAgrpPed.length; j++) {
							if (aBoAgrpPed[j] === vPath) {
								aBoAgrpPed.splice(j, 1);
								break;
							}
						}
					}

				}
				oCtxItm.getModel().updateBindings();
			}

		},
		onChangeMaterial: function (oEvent) {
			var that = this;
			var oView = this.getView();
			var oModel = oView.getModel("GE");

			var oTranslationModel = that.getView().getModel("i18n");
			var oBundle = oTranslationModel.getResourceBundle();
			var oSource = oEvent.getSource();
			var vMatnr = oSource.getValue();

			//Faz Requisição ao backend
			oModel.attachRequestSent(this._onAttachRequest);
			oModel.attachRequestCompleted(this._onAttachRequestCompleted);
			oModel.read("/ZET_VCMM_MATERIALSet('" + vMatnr + "')", {
				success: function (oData, response) {
					if (!oData || !oData.Matnr) {

						var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
						MessageBox.warning(oBundle.getText("NotFound"), {
							styleClass: bCompact ? "sapUiSizeCompact" : ""
						});
						oSource.setValue("");
						oSource.setValueState("Error");
						oView.byId("TextItemDescriptionId").setText("");
						oView.byId("InputItemAmountIncidentId").setDescription("");

					} else {
						oSource.setValueState("None");
						oView.byId("TextItemDescriptionId").setText(oData.Maktx);
						oView.byId("InputItemAmountIncidentId").setDescription(oData.Meins);

						MessageToast.show(oBundle.getText("success_matnr_ok"), {
							duration: 3000,
							width: "30em",
							closeOnBrowserNavigation: false // default
						});
					}
				},
				error: function (oData, response) {
					//that._onAttachRequestCompleted();

					var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
					MessageBox.warning(oBundle.getText("NotFound"), {
						styleClass: bCompact ? "sapUiSizeCompact" : ""
					});

					oSource.setValue("");
					oSource.setValueState("Error");
					oView.byId("TextItemDescriptionId").setText("");
					oView.byId("InputItemAmountIncidentId").setDescription("");
				}
			});
		},
		onChangePedComp: function (oEvent) {
			var that = this;
			var oView = this.getView();
			var oModel = oView.getModel("GE");

			var oTranslationModel = that.getView().getModel("i18n");
			var oBundle = oTranslationModel.getResourceBundle();
			var oInputEbeln = oView.byId("InputPurchaseOrderId");
			var oInputEbelp = oView.byId("InputPurchaseOrdeItemId");
			var vEbeln = oInputEbeln.getValue();
			var vEbelp = oInputEbelp.getValue();

			if (vEbeln !== "" && vEbelp !== "") {

				//Faz Requisição ao backend
				oModel.attachRequestSent(this._onAttachRequest);
				oModel.attachRequestCompleted(this._onAttachRequestCompleted);
				oModel.read("/ZET_VCMM_ITEM_PEDSet(Ebeln='" + vEbeln + "',Ebelp='" + vEbelp + "')", {
					success: function (oData, response) {
						if (!oData || !oData.Ebeln) {

							var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
							MessageBox.warning(oBundle.getText("NotFound"), {
								styleClass: bCompact ? "sapUiSizeCompact" : ""
							});
							oInputEbeln.setValue("");
							oInputEbeln.setValueState("Error");
							oInputEbelp.setValue("");
							oInputEbelp.setValueState("Error");

						} else {
							oInputEbeln.setValueState("None");
							oInputEbelp.setValueState("None");

							MessageToast.show(oBundle.getText("success_ped_ok"), {
								duration: 3000,
								width: "30em",
								closeOnBrowserNavigation: false // default
							});
						}
					},
					error: function (oData, response) {
						//that._onAttachRequestCompleted();

						var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
						MessageBox.warning(oBundle.getText("NotFound"), {
							styleClass: bCompact ? "sapUiSizeCompact" : ""
						});
						oInputEbeln.setValue("");
						oInputEbeln.setValueState("Error");
						oInputEbelp.setValue("");
						oInputEbelp.setValueState("Error");
					}
				});
			}
		},
		onChangePedAgrpKeys: function (oEvent) {
			var that = this;
			var oView = this.getView();
			var oModel = oView.getModel("GE");

			var oTranslationModel = that.getView().getModel("i18n");
			var oBundle = oTranslationModel.getResourceBundle();

			var vPath = oEvent.getSource().getBindingContext("GE").getPath();

			var oItem = oEvent.getSource().getParent();
			var oEditableCells = oItem.getCells();

			var oInputEbeln, oInputEbelp;

			$(oEditableCells).each(function (i) {
				var oEditableCell = oEditableCells[i];
				if (oEditableCell.getName) {

					switch (oEditableCell.getName()) {
					case "InputEbelnAgrpPed":
						oInputEbeln = oEditableCell;
						break;
					case "InputEbelpAgrpPed":
						oInputEbelp = oEditableCell;
						break;
					default:
					}
				}
			});

			var vEbeln = "";
			if (oInputEbeln) {
				vEbeln = oInputEbeln.getValue();
			}
			var vEbelp = "";
			if (oInputEbelp) {
				vEbelp = oInputEbelp.getValue();
			}

			if (vEbeln !== "" && vEbelp !== "") {

				//Faz Requisição ao backend
				oModel.attachRequestSent(this._onAttachRequest);
				oModel.attachRequestCompleted(this._onAttachRequestCompleted);
				oModel.read("/ZET_VCMM_ITEM_PEDSet(Ebeln='" + vEbeln + "',Ebelp='" + vEbelp + "')", {
					success: function (oData, response) {
						if (!oData || !oData.Ebeln) {

							var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
							MessageBox.warning(oBundle.getText("NotFound"), {
								styleClass: bCompact ? "sapUiSizeCompact" : ""
							});
							oInputEbeln.setValue("");
							oInputEbeln.setValueState("Error");
							oInputEbelp.setValue("");
							oInputEbelp.setValueState("Error");

							oModel.setProperty(vPath + "/Matnr", "");
							oModel.setProperty(vPath + "/Txz01", "");
							oModel.setProperty(vPath + "/Unit", "");

						} else {
							oInputEbeln.setEditable(false);
							oInputEbelp.setEditable(false);

							oModel.setProperty(vPath + "/Matnr", oData.Matnr);
							oModel.setProperty(vPath + "/Txz01", oData.Txz01);
							oModel.setProperty(vPath + "/Unit", oData.Meins);

							MessageToast.show(oBundle.getText("success_ped_ok"), {
								duration: 3000,
								width: "30em",
								closeOnBrowserNavigation: false // default
							});
						}
					},
					error: function (oData, response) {
						//that._onAttachRequestCompleted();

						var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
						MessageBox.warning(oBundle.getText("NotFound"), {
							styleClass: bCompact ? "sapUiSizeCompact" : ""
						});
						oInputEbeln.setValue("");
						oInputEbeln.setValueState("Error");
						oInputEbelp.setValue("");
						oInputEbelp.setValueState("Error");

						oModel.setProperty(vPath + "/Matnr", "");
						oModel.setProperty(vPath + "/Txz01", "");
						oModel.setProperty(vPath + "/Unit", "");
					}
				});
			}
		},
		onCloseLogItm: function () {
			this.byId("idDialogTableLogItm").close();
		},
		_onAttachRequest: function () {
			sap.ui.core.BusyIndicator.show();
		},
		_onAttachRequestCompleted: function () {
			sap.ui.core.BusyIndicator.hide();
		},

		onFilenameLengthExceed: function (oEvent) {
			var oTranslationModel = this.getView().getModel("i18n");
			var oBundle = oTranslationModel.getResourceBundle();
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.warning(oBundle.getText("File_name_Length_Exceed"), {
				styleClass: bCompact ? "sapUiSizeCompact" : ""
			});
		},

		onFileSizeExceed: function (oEvent) {
			var oTranslationModel = this.getView().getModel("i18n");
			var oBundle = oTranslationModel.getResourceBundle();
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.warning(oBundle.getText("File_Size_Exceed"), {
				styleClass: bCompact ? "sapUiSizeCompact" : ""
			});
		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf workspace.zcockpit_bo_v3.view.S3
		 */

		onExit: function () {
			//this.oRouter.getRoute("detailDetail").detachPatternMatched(this.handleRouteMatched, this);
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf workspace.zcockpit_bo_v3.view.S3
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf workspace.zcockpit_bo_v3.view.S3
		 */
		//	onAfterRendering: function() {
		//
		//	},
	});
});