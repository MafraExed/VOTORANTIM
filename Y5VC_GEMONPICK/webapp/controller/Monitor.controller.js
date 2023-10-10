sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/Token",
	"sap/ui/model/Sorter",
	"../model/formatter",
	"sap/ui/model/json/JSONModel"
], function (Controller, MessageBox, Token, Sorter, formatter, JSONModel) {
	"use strict";

	const cError = "ERROR";
	const cSuccess = "SUCCESS";
	const cUpdate = "UPDATE";
	const cDelete = "DELETE";
	const cRelease = "RELEASE";
	const cSimulation = "SIMULATION";
	const cComplete = "COMPLETE";
	const cSimulationError = "91"; //Erro de simulação
	const cSimulationSuccess = "50"; //Simulação com sucesso

	return Controller.extend("workspace.zmonitor_picking.controller.Monitor", {
		formatter: formatter,
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("TargetMonitor").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

			//para possibilitar copiar e colar conteudo
			let oMultiInput = this.getView().byId("idMIDocpkg");

			//*** add checkbox validator
			let fValidator = function (args) {
				let text = args.text;
				return new Token({
					key: text,
					text: text
				});
			};
			oMultiInput.addValidator(fValidator);
			oMultiInput = this.getView().byId("idMIIdpkg");
			oMultiInput.addValidator(fValidator);

			// Keeps reference to any of the created sap.m.ViewSettingsDialog-s in this sample
			this._mViewSettingsDialogs = {};

			let oModelForPkg = new JSONModel({
				"Options": [{
					key: "T",
					value: "Todos"
				}, {
					key: "X",
					value: "Sim"
				}, {
					key: "",
					value: "Não"
				}]
			});

			this.getView().setModel(oModelForPkg, "modelFilterForPkg");

			let oModelSchDel = new JSONModel({
				"Options": [{
					key: "T",
					value: "Todos"
				}, {
					key: "X",
					value: "Sim"
				}, {
					key: "",
					value: "Não"
				}]
			});

			var oComboBoxStatus = this.getView().byId("idSelStatus");
			oComboBoxStatus.addSelectedKeys("00");

			this.getView().setModel(oModelSchDel, "modelFilterSchDel");
		},

		handleRouteMatched: function (oEvent) {
			this._onSearch();
		},

		_onSearch: function (oEvent) {

			let oSelectCatPkg = this.byId("idSelCatPkg");
			let oMultiComboBoxStatus = this.byId("idSelStatus");
			let oMultiInputDocpkg = this.byId("idMIDocpkg");
			let oMultiInputIdPkg = this.byId("idMIIdpkg");
			let oComboWerks = this.byId("idMIWerks");
			let oSelectForPkg = this.byId("idSelectForPkg");
			let oSelectSchProg = this.byId("idSelectSchDel");
			let oInputUnloadPoint = this.byId("idIPUnloadPoint");
			let oPickingCategory = this.byId("idMITypeDocpkg");
			let oCategory = oPickingCategory.getSelectedKey();       
			let aFilter = [];

			if (oSelectCatPkg.getSelectedItem()) {
				aFilter.push(
					new sap.ui.model.Filter("Catpkg", sap.ui.model.FilterOperator.EQ, oSelectCatPkg.getSelectedItem().getKey())
				);
			}

			for (let oSelectedItem of oMultiComboBoxStatus.getSelectedItems()) {
				aFilter.push(
					new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, oSelectedItem.getKey())
				);
			}

			for (let oToken of oMultiInputDocpkg.getTokens()) {
				if (oToken.getKey() !== "") {
					aFilter.push(
						new sap.ui.model.Filter("Docpkg", sap.ui.model.FilterOperator.EQ, oToken.getKey())
					);
				}
			}

			for (let oToken of oMultiInputIdPkg.getTokens()) {
				if (oToken.getKey() !== "") {
					aFilter.push(
						new sap.ui.model.Filter("Idpkg", sap.ui.model.FilterOperator.EQ, oToken.getKey())
					);
				}
			}

			for (let oSelectedKey of oComboWerks.getSelectedKeys()) {
				aFilter.push(new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.EQ, oSelectedKey));
			}

			// Entrega programada
			if (oSelectSchProg.getSelectedKey) {
				if (oSelectSchProg.getSelectedItem().getText() !== "Todos") {
					if (oSelectSchProg.getSelectedKey() === "X") {
						aFilter.push(new sap.ui.model.Filter("EntregaProg", sap.ui.model.FilterOperator.EQ, true));
					} else {
						aFilter.push(new sap.ui.model.Filter("EntregaProg", sap.ui.model.FilterOperator.EQ, false));
					}
				}
			}

			// Atendimento Forçado
			if (oSelectForPkg.getSelectedKey) {
				if (oSelectForPkg.getSelectedItem().getText() !== "Todos") {
					if (oSelectForPkg.getSelectedKey() === "X") {
						aFilter.push(new sap.ui.model.Filter("AtdForcado", sap.ui.model.FilterOperator.EQ, true));
					} else {
						aFilter.push(new sap.ui.model.Filter("AtdForcado", sap.ui.model.FilterOperator.EQ, false));
					}
				}
			}

			if (oInputUnloadPoint.getValue() !== "") {
				aFilter.push(
					new sap.ui.model.Filter("Ablad", sap.ui.model.FilterOperator.Contains, oInputUnloadPoint.getValue())
				);
			}
			
			//Tipo de Documento
			if(oCategory){
				aFilter.push(new sap.ui.model.Filter("Catpkg", sap.ui.model.FilterOperator.EQ, oCategory));
			}

			let oDatePickerFrom = this.byId("idDPCredatFrom");
			let vValueFrom = oDatePickerFrom.getDateValue();
			let oDatePickerTo = this.byId("idDPCredatTo");
			let vValueTo = oDatePickerTo.getDateValue();

			/*let oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-ddTKK:mm:ss"
			});*/

			let oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-dd"
			});
			vValueFrom = oDateFormat.format(vValueFrom);
			vValueTo = oDateFormat.format(vValueTo);

			if (vValueFrom !== "") {
				if (vValueTo === "") {
					aFilter.push(
						new sap.ui.model.Filter("Credat", sap.ui.model.FilterOperator.EQ, vValueFrom)
					);
				} else {
					aFilter.push(
						new sap.ui.model.Filter("Credat", sap.ui.model.FilterOperator.BT, vValueFrom, vValueTo)
					);
				}
			}

			let oTable = this.byId("idTablePicking");
			//oTable.getBinding("items").filter(aFilter);
			oTable.getBinding("items").filter(aFilter, sap.ui.model.FilterType.Application);

		},

		handleSuccess: function (oData, oResp, oThat, vOperation, boolRefresh) {

			let oView = oThat.getView();
			let oBundle = oView.getModel("i18n").getResourceBundle();

			if (oData.__batchResponses[0].response) {

				let responseText = oData.__batchResponses[0].response.body;
				let responseParser = JSON.parse(responseText);

				if (responseParser.error.innererror) {
					MessageBox.error(responseParser.error.innererror.errordetails[0].message, {
						styleClass: "sapUiSizeCompact"
					});
					oView.getModel("GE").resetChanges();
				} else {
					MessageBox.error(responseParser.error.message.value, {
						styleClass: "sapUiSizeCompact"
					});
				}
			} else {

				MessageBox.success(oBundle.getText(oThat._getOperationMessage(vOperation, cSuccess)), {
					styleClass: "sapUiSizeCompact"
				});
			}
			this._setBusy(oThat);
			if (boolRefresh === true) {
				this._onSearch();
			}
		},

		_getOperationMessage: function (vOperation, vMsgType) {

			// Determina mensagem a ser exibida

			// Erro no processamento
			if (vMsgType === cError) { // Erro
				// Exclusão
				if (vOperation === cDelete) {
					return "txt_delete_error";
				}
				// Atualização
				if (vOperation === cUpdate) {
					return "txt_update_error";
				}
				// Liberar picking
				if (vOperation === cRelease) {
					return "txt_release_error";
				}
				// Simulação
				if (vOperation === cSimulation) {
					return "txt_simulation_error";
				}
				// Finalização
				if (vOperation === cComplete) {
					return "txt_complete_error";
				}

			} else {
				if (vMsgType === cSuccess) { // Sucesso

					// Exclusão
					if (vOperation === cDelete) {
						return "txt_delete_success";
					}
					// Atualização
					if (vOperation === cUpdate) {
						return "txt_update_success";
					}
					// Liberar picking
					if (vOperation === cRelease) {
						return "txt_release_success";
					}
					// Simulação
					if (vOperation === cSimulation) {
						return "txt_simulation_success";
					}
					// Finalização
					if (vOperation === cComplete) {
						return "txt_complete_success";
					}
				}
			}
			return "";
		},

		handleError: function (oData, oResp, oThat, vOperation) {

			let oView = oThat.getView();
			let oBundle = oView.getModel("i18n").getResourceBundle();

			MessageBox.error(oBundle.getText(oThat._getOperationMessage(vOperation, cError)), {
				styleClass: "sapUiSizeCompact"
			});

			this._setBusy(oThat);
		},

		_setBusy: function (oThat) {
			let oView = oThat.getView();
			let oTable = oView.byId("idTablePicking");
			oTable.setBusy(!oTable.getBusy());
		},

		_onSave: function (oEvent) {

			let oView = this.getView();
			let oModel = oView.getModel("GE");
			let oBundle = oView.getModel("i18n").getResourceBundle();

			this._setBusy(this);
			if (!oModel.hasPendingChanges()) {

				// Dados não foram alterados
				MessageBox.error(oBundle.getText("error_unchanged_data"), {
					title: oBundle.getText("error_title"),
					styleClass: "sapUiSizeCompact"
				});
				this._setBusy(this);
				return;
			} else {
				let that = this;
				let mParameters = {
					success: (oData, oResp) => {
						that.handleSuccess(oData, oResp, that, cUpdate, true);
					},
					error: (oData, oResp) => {
						that.handleError(oData, oResp, that, cUpdate);
					}
				};
				oModel.submitChanges(mParameters);
			}

		},

		_onDelete: function (oEvent) {

			let oView = this.getView();
			let oBundle = oView.getModel("i18n").getResourceBundle();
			let oSelectedContexts = this._getSelectedContexts();

			this._setBusy(this);
			// Verifica se alguma linha foi selecionada
			if (oSelectedContexts) {

				this._askUserForDelete();

			} else {
				// Nenhuma linha Selecionada
				MessageBox.error(oBundle.getText("error_none_line_selected"), {
					title: oBundle.getText("error_title"),
					styleClass: "sapUiSizeCompact"
				});
				this._setBusy(this);
				return;
			}

		},

		_deleteEntities: function () {

			let oView = this.getView();
			let oModel = oView.getModel("GE");
			let oSelectedContexts = this._getSelectedContexts();
			let strChangesetId = "gpIDChangeset";

			for (let oContext of oSelectedContexts) {
				oModel.remove(oContext.getPath(), {
					groupId: strChangesetId
				});
			}
			let that = this;
			let mParameters = {
				groupId: strChangesetId,
				success: (oData, oResp) => {
					that.handleSuccess(oData, oResp, that, cDelete, true);
				},
				error: (oData, oResp) => {
					that.handleError(oData, oResp, that, cDelete);
				}
			};
			oModel.setDeferredGroups([strChangesetId]);
			oModel.submitChanges(mParameters);
		},

		_onSimulate: function (oEvent) {

			let oView = this.getView();
			let oModel = oView.getModel("GE");
			let oBundle = oView.getModel("i18n").getResourceBundle();
			let oSelectedContexts = this._getSelectedContexts();

			let strChangesetId = "gpIDChangeset";

			this._setBusy(this);
			if (oSelectedContexts.length > 0) {

				let that = this;
				let mParameters = {
					groupId: strChangesetId,
					success: (oData, oResp) => {
						that.handleSuccess(oData, oResp, that, cSimulation);
					},
					error: (oData, oResp) => {
						that.handleError(oData, oResp, that, cSimulation);
					}
				};
				oModel.setDeferredGroups([strChangesetId]);
				for (let oContext of oSelectedContexts) {
					let oPicking = {};
					oPicking.Idpkg = oContext.getProperty("Idpkg");
					oPicking.Docpkg = oContext.getProperty("Docpkg");
					oPicking.Itmpkg = oContext.getProperty("Itmpkg");

					oModel.callFunction("/simularPicking", {
						method: "POST", // http method
						urlParameters: oPicking,
						groupId: strChangesetId
					}); // function import pa
				}
				oModel.submitChanges(mParameters);
			} else {
				// Verifica se alguma linha foi selecionada
				MessageBox.error(oBundle.getText("error_none_line_selected"), {
					title: oBundle.getText("error_title"),
					styleClass: "sapUiSizeCompact"
				});
				this._setBusy(this);
				return;
			}
		},

		_askUserForComplete: function () {

			let oView = this.getView();
			let oBundle = oView.getModel("i18n").getResourceBundle();
			let that = this;
			MessageBox.show(
				oBundle.getText("txt_confirm_complete"), {
					icon: MessageBox.Icon.INFORMATION,
					title: oBundle.getText("txt_title_complete_picking"),
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: function (oAction) {
						if (oAction === "YES") {
							that._completeEntities(that);
							return true;
						} else {
							that._setBusy(that);
							return false;
						}
					}
				}
			);
		},

		_askUserForDelete: function () {

			let oView = this.getView();
			let oBundle = oView.getModel("i18n").getResourceBundle();
			let that = this;
			MessageBox.show(
				oBundle.getText("txt_confirm_delete"), {
					icon: MessageBox.Icon.INFORMATION,
					title: oBundle.getText("txt_title_delete_picking"),
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: function (oAction) {
						if (oAction === "YES") {
							that._deleteEntities();
							return true;
						} else {
							that._setBusy(that);
							return false;
						}
					}
				}
			);
		},

		_onLog: function () {

			let oView = this.getView();
			let aFilters = [];
			let oTable = oView.byId("idTablePicking");
			let oContext = oTable.getSelectedContexts();
			var oTranslationModel = oView.getModel("i18n");
			var oBundle = oTranslationModel.getResourceBundle();

			// Verifica se alguma linha foi selecionada
			if (oContext.length === 0) {
				MessageBox.error(oBundle.getText("error_none_line_selected"), {
					title: oBundle.getText("error_title"),
					styleClass: "sapUiSizeCompact"
				});
				return;
			}

			for (let oCtx of oContext) {
				let sFilter = new sap.ui.model.Filter({
					path: "Idpkg",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: oCtx.getProperty("Idpkg")
				});
				aFilters.push(sFilter);

				sFilter = new sap.ui.model.Filter({
					path: "Docpkg",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: oCtx.getProperty("Docpkg")
				});
				aFilters.push(sFilter);

				sFilter = new sap.ui.model.Filter({
					path: "Itmpkg",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: oCtx.getProperty("Itmpkg")
				});
				aFilters.push(sFilter);

			}

			var oDialog = oView.byId("idDialogTableLog");
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "workspace.zmonitor_picking.view.LogPicking", this);
				// connect dialog to view (models, lifecycle)
				oView.addDependent(oDialog);
			}
			let oTableLog = this.byId("idTbTableLog");
			if (oTableLog) {
				oTableLog.getBinding("items").filter(aFilters, sap.ui.model.FilterType.Application);
			}
			oDialog.open();
		},
		_getSelectedContexts: function () {

			let oView = this.getView();
			let oTable = oView.byId("idTablePicking");
			let oSelectedContexts = oTable.getSelectedContexts();
			if (oSelectedContexts) {
				return oSelectedContexts;
			} else {
				return null;
			}
		},
		_onCloseLogDialog: function () {
			this.byId("idDialogTableLog").close();
		},
		_handleSortDialogConfirm: function (oEvent) {
			let oTable = this.byId("idTablePicking"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				aSorters = [];

			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));

			// apply the selected sort and group settings
			oBinding.sort(aSorters);
		},
		_createViewSettingsDialog: function (sDialogFragmentName) {
			var oDialog = this._mViewSettingsDialogs[sDialogFragmentName];
			let oView = this.getView();

			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(sDialogFragmentName, this);
				this._mViewSettingsDialogs[sDialogFragmentName] = oDialog;
				oView.addDependent(oDialog);
			}
			return oDialog;
		},
		_onSort: function () {
			this._createViewSettingsDialog("workspace.zmonitor_picking.view.SortDialog").open();
		},

		_onReleasePicking: function () {

			let oView = this.getView();
			let oModel = oView.getModel("GE");
			let oTable = oView.byId("idTablePicking");
			let oContexts = oTable.getSelectedContexts();
			let oTranslationModel = oView.getModel("i18n");
			let oBundle = oTranslationModel.getResourceBundle();
			let boolForcedPickingService = false;
			let boolSimulationError = false;
			// Verifica se alguma linha foi selecionada
			if (oContexts.length === 0) {
				MessageBox.error(oBundle.getText("error_none_line_selected"), {
					title: oBundle.getText("error_title"),
					styleClass: "sapUiSizeCompact"
				});
				return;
			}

			if (oModel.hasPendingChanges()) {
				MessageBox.error(oBundle.getText("error_pending_changes_save_first"), {
					title: oBundle.getText("error_title"),
					styleClass: "sapUiSizeCompact"
				});
				return;
			}

			// Verifica se todos os itens selecionados foram simulados
			for (let oContext of oContexts) {
				let vStatus = oContext.getProperty("Status");

				// 50 = Picking simulado com sucesso
				// 90 = Erro Simulação

				if (vStatus !== cSimulationSuccess && vStatus !== cSimulationError) {
					MessageBox.error(oBundle.getText("error_only_selected_items_allowed"), {
						title: oBundle.getText("error_title"),
						styleClass: "sapUiSizeCompact"
					});
					return;
				} else {
					// Verifica se há itens com erro de simulação.
					// Usuário será questionado se deseja "Forçar" o atendimento
					if (vStatus === "91") {
						boolSimulationError = true;
					}
				}
			}

			if (boolSimulationError) {
				// Questiona atendimento forçado
				boolForcedPickingService = this._askUserForcedPickingService(oBundle);
				if (!boolForcedPickingService) {
					// Usuário não deseja força o atendimento
					return;
				}
			} else {
				this._releasePickingService(false);
			}

		},

		_onComplete: function (oEvent) {
			let oView = this.getView();
			let oModel = oView.getModel("GE");
			let oTable = oView.byId("idTablePicking");
			let oSelectedContexts = oTable.getSelectedContexts();
			let oTranslationModel = oView.getModel("i18n");
			let oBundle = oTranslationModel.getResourceBundle();

			this._setBusy(this);
			// Verifica se alguma linha foi selecionada
			if (oSelectedContexts.length === 0) {
				MessageBox.error(oBundle.getText("error_none_line_selected"), {
					title: oBundle.getText("error_title"),
					styleClass: "sapUiSizeCompact"
				});
				return;
			}

			if (oModel.hasPendingChanges()) {
				MessageBox.error(oBundle.getText("error_pending_changes_save_first"), {
					title: oBundle.getText("error_title"),
					styleClass: "sapUiSizeCompact"
				});
				return;
			}

			this._askUserForComplete();

		},

		_completeEntities: function (oThat) {
			let strChangesetId = "gpIDChangeset";
			let oView = oThat.getView();
			let oModel = oView.getModel("GE");
			let oTable = oView.byId("idTablePicking");
			let oSelectedContexts = oTable.getSelectedContexts();

			let mParameters = {
				groupId: strChangesetId,
				success: (oData, oResp) => {
					oThat.handleSuccess(oData, oResp, oThat, cComplete);
				},
				error: (oData, oResp) => {
					oThat.handleError(oData, oResp, oThat, cComplete);
				}
			};
			oModel.setDeferredGroups([strChangesetId]);
			for (let oContext of oSelectedContexts) {
				let oPicking = {};
				oPicking.Idpkg = oContext.getProperty("Idpkg");
				oPicking.Docpkg = oContext.getProperty("Docpkg");
				oPicking.Itmpkg = oContext.getProperty("Itmpkg");

				oModel.callFunction("/finalizarPicking", {
					method: "POST", // http method
					urlParameters: oPicking,
					groupId: strChangesetId
				}); // function import pa
			}
			oModel.submitChanges(mParameters);
		},

		_askUserForcedPickingService: function (oBundle) {

			let that = this;
			MessageBox.show(
				oBundle.getText("txt_confirm_forced_picking_service"), {
					icon: MessageBox.Icon.INFORMATION,
					title: oBundle.getText("txt_title_forced_picking_service"),
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: function (oAction) {
						if (oAction === "YES") {
							that._releasePickingService(true);
							return true;
						} else {
							return false;
						}
					}
				}
			);

		},
		_releasePickingService: function () {

			let oView = this.getView();
			let oTable = oView.byId("idTablePicking");
			let oModel = oView.getModel("GE");
			let oContexts = oTable.getSelectedContexts();
			let strChangesetId = "gpIDChangeset";

			this._setBusy(this);
			oModel.setDeferredGroups([strChangesetId]);
			// Percorre todos os itens selecionados
			for (let oContext of oContexts) {
				let boolForcePicking = false;
				if (oContext.getProperty("Status") === cSimulationError) {
					boolForcePicking = true;
				}
				let oPicking = {};
				oPicking.Idpkg = oContext.getProperty("Idpkg");
				oPicking.Docpkg = oContext.getProperty("Docpkg");
				oPicking.Itmpkg = oContext.getProperty("Itmpkg");
				oPicking.AtdForcado = boolForcePicking;

				oModel.callFunction("/liberarAtendimentoPicking", {
					method: "POST", // http method
					urlParameters: oPicking,
					groupId: strChangesetId
				}); // function import pa
			}

			let that = this;
			let mParameters = {
				groupId: strChangesetId,
				success: (oData, oResp) => {
					that.handleSuccess(oData, oResp, that, cRelease, true);
				},
				error: (oData, oResp) => {
					that.handleError(oData, oResp, that, cRelease);
				}
			};

			oModel.submitChanges(mParameters);
		},
		onUpdateFinished: function (oEvent) {
			let oView = this.getView();
			let oBundle = oView.getModel("i18n").getResourceBundle();
			var oTitle = this.getView().byId("title_total_pkg");
			if (oEvent.getSource().getBinding("items").isLengthFinal()) {
				var iCount = oEvent.getParameter("total");
				oTitle.setText(oBundle.getText("txt_title_documents") + " (" + iCount + ")");

			}
		},

	});
});