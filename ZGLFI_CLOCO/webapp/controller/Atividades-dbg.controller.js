sap.ui.define(["FechamentoContabil/controller/BaseController", "sap/ui/model/json/JSONModel", "sap/ui/core/util/Export", "sap/ui/core/util/ExportTypeCSV", "sap/ui/core/Fragment", 'sap/m/GroupHeaderListItem', "sap/m/MessageBox", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "../model/formatter"], function (BaseController, JSONModel, Export, ExportTypeCSV, Fragment, GroupHeaderListItem, MessageBox, Filter, FilterOperator, formatter) {
  "use strict";

  var periodos;
  var planoSelecionado;
  var planoSelecionadoFluxo;
  var usuarioSAPatual;
  var elementoSelecionado;

  return BaseController.extend("FechamentoContabil.controller.Atividades", {
    onInit: function () {
      //	this.addBrowserEvents();

      //	var route = sap.ui.core.UIComponent.getRouterFor(this);
      //	route.attachRouteMatched(this.inicializaKey, this);

      // Icone SYNC deve ser exibido apenas para desktop
      /*	if (!sap.ui.Device.system.phone) {
          var imagePath = $.sap.getModulePath("FechamentoContabil", "/LogoEmpresas/");
          var logo = this.getView().byId("idLogo");
          logo.setSrc(imagePath + "CBA.png");
        }*/

      this.attachPatternMatched("Atividades");
      this.attachPatternMatched("AtividadesSelecionadas");
      this.attachPatternMatched("AtividadesAtrasadas");
      this.attachPatternMatched("AtividadesMobile");

      this.createModel(
        {
          preSelectedTasks: false,
          taskDetails: {}
        },
        "preSelectedTasks"
      );

      this.createModel(
        {
          type: "email"
        },
        "shareTask"
      );

      this.createModel({ motivos: [], motivoSelecionado: "" }, "motivosAtraso");

      this.createModel(
        {
          progress: 0,
          atividadeAtrasada: false,
          selectedTaskStatus: "",
          levelsRejected: [],
          levelsApproved: [],
          popupTarefasAtrasadas: []
        },
        "viewAtividades"
      );

      this.getView().byId("containerKeys").attachBrowserEvent("click", this.onPressKeys, this);

      this.getUserInfo((userInfo) => this._userInfo = userInfo);


      //	var oModelKey = sap.ui.getCore().getModel("key");

      // verifica se o filtro já foi inicializado na tela anterior
      //	if(oModelKey === undefined)// || oModelKey.oData["viewAtual"] === this.getView().getControllerName())
      // Inicializa o Monitor	do zero
      //		this.getDadosECC("dadosIniciais");
    },

    onSaveVariantFilter: function (oEvent) {
      const sName = oEvent.getParameter("name");
      const oFilterBar = Fragment.byId(this.getView().getId(), "filterbar_atividades");
      const oFilterModel = oFilterBar.getModel();
      const oFilterData = oFilterModel.getData();
      // const oVariantData = {
      //   filterData: oFilterData
      // };
      // oEvent.getSource().addVariant(sName, oVariantData);
      var aVariantItems = [
        new sap.ui.comp.variants.VariantItem({
          key: "item1",
          text: "Item 1"
        }),
        new sap.ui.comp.variants.VariantItem({
          key: "item2",
          text: "Item 2"
        })
      ];
      oEvent.getSource().addVariantItem(new sap.ui.comp.variants.VariantItem({
        key: "item1",
        text: "Item 1"
      }),);
    },

    onSelectVariantFilter: function (oEvent) {
      const oFilterBar = Fragment.byId(this.getView().getId(), "filterbar_atividades");
      const oFilterModel = oFilterBar.getModel();
      const sKey = oEvent.getParameter("key");
      const oVariant = oEvent.getSource().getVariant(sKey);
      if (oVariant) {
        const oFilterData = oVariant.filterData;
        oFilterModel.setData(oFilterData);
      }
    },

    formatter: formatter,

    expandDadosIniciaisAtividades: "ToPlanos,ToPlanoSelecionado,ToPeriodos,ToHierarquiaPastas,ToTarefas",

    onPressKeys: function () {
      this.openFilterAtividades();
    },

    onCompanyHelp: function (oEvent) {

      const fCompany = Fragment.byId(this.getView().getId(), "fCompany");
      const aCols = {
        cols: [
          {
            label: "Empresa",
            template: "CompanyCode",
            width: "10rem"
          },
        ]
      }

      this.createModel(
        aCols,
        "CompanyColumns"
      );

      const colsModel = this.getModel("CompanyColumns");

      this._oValueHelpDialogCompany = sap.ui.xmlfragment("FechamentoContabil.view.fragments.companyValueHelp", this);
      this.getView().addDependent(this._oValueHelpDialogCompany);

      this._oValueHelpDialogCompany.setBusy(true);

      this._oValueHelpDialogCompany.getTableAsync().then(function (oTable) {
        oTable.setModel(this.getModel());
        oTable.setModel(colsModel, "columns");
        const filter = this.getKeyFilter();

        if (oTable.bindRows) {
          oTable.bindAggregation("rows", {
            path: `/v2_empresas`,
            events: {
              dataReceived: function () { this._oValueHelpDialogCompany.setBusy(false); }.bind(this)
            },
            filters: filter
          });
        }

        if (oTable.bindItems) {
          oTable.bindAggregation("items", {
            path: `/v2_empresas`,
            filters: filter
          }, function () {
            return new ColumnListItem({
              cells: aCols.cols.map(function (column) {
                return new sap.m.Label({ text: "{" + column.template + "}" });
              })
            });
          });
        }
        this._oValueHelpDialogCompany.update();
      }.bind(this));

      // this._oValueHelpDialogCompany.setTokens(fCompany.getTokens());
      this._oValueHelpDialogCompany.open();
    },

    checkSelectedPlan: function (oEvent) {
      if (this.getView().byId("idInputModelo").getItems().length > 0) {
        const selectedProfile = this.getView().byId("idInputModelo").getSelectedKey();
        const selectedInstance = this.getView().byId("idInputPeriodo").getSelectedKey().trim();
        Fragment.byId(this.getView().getId(), "fProfile").setSelectedKey(selectedProfile)

        const fInstance = Fragment.byId(this.getView().getId(), "fInstance");
        fInstance.bindItems({
          path: `/v2_periodos(Profile='${selectedProfile}',Instance=0)/toPeriodos`,
          events: {
            dataReceived: function () {
              fInstance.setSelectedKey(selectedInstance);
            }.bind(this)
          },
          template: new sap.ui.core.ListItem({
            text: {
              path: "Data_fixada", formatter: formatter.formatDate
            },
            key: "{Instance}",
            additionalText: "{Descricao}"
          })
        })
        fInstance.setEnabled(true);
        Fragment.byId(this.getView().getId(), "fCompany").setEnabled(true);
      }
    },

    onValueHelpCompanyOkPress: function (oEvent) {
      const fCompany = Fragment.byId(this.getView().getId(), "fCompany");
      const aTokens = oEvent.getParameter("tokens");
      fCompany.removeAllTokens();
      fCompany.setTokens(aTokens);
      this._oValueHelpDialogCompany.close();
    },

    onValueHelpCompanyCancelPress: function () {
      this._oValueHelpDialogCompany.close();
    },

    onValueHelpCompanyAfterClose: function () {
      this._oValueHelpDialogCompany.destroy();
    },

    onFilterSelectProfile: function () {
      const profileSelected = Fragment.byId(this.getView().getId(), "fProfile").getSelectedKey();
      const fInstance = Fragment.byId(this.getView().getId(), "fInstance");
      fInstance.setValue("");
      const fCompany = Fragment.byId(this.getView().getId(), "fCompany");
      fCompany.removeAllTokens();
      fInstance.bindItems({
        path: `/v2_periodos(Profile='${profileSelected}',Instance=0)/toPeriodos`,
        template: new sap.ui.core.ListItem({
          text: { path: "Data_fixada", formatter: formatter.formatDate },
          key: "{Instance}",
          additionalText: "{Descricao}"
        })
      })
      fInstance.setEnabled(true);

    },

    onFilterAtividades: function () {
      if (this.isMissingRequiredFilters()) {
        MessageBox.error("Preencher todos os campos obrigatórios");
        return;
      }
      const filters = this.getAtividadesFilters();

      this.getSettings();

      this.getDadosECC("dadosIniciais", this.expandDadosIniciaisAtividades, null, null, filters.aFilters);
      this.closeFilterAtividades();
    },

    isMissingRequiredFilters: function () {
      const requiredSelectControls = ["fProfile", "fInstance"];
      for (const controlId of requiredSelectControls) {
        if (!Fragment.byId(this.getView().getId(), controlId).getSelectedKey()) return true;
      }
      return false;
    },

    getAtividadesFilters: function () {
      const filter = new Filter([]);

      const profile = Fragment.byId(this.getView().getId(), "fProfile").getSelectedKey();
      const instance = Fragment.byId(this.getView().getId(), "fInstance").getSelectedKey();
      filter.aFilters.push(this.createFilter("Profile", FilterOperator.EQ, profile));
      filter.aFilters.push(this.createFilter("Instance", FilterOperator.EQ, instance));

      //get companies filters
      const fCompany = Fragment.byId(this.getView().getId(), "fCompany");
      const companyTokens = fCompany.getTokens();
      if (companyTokens.length > 0)
        for (const token of companyTokens) {
          filter.aFilters.push(this.createFilter("Company", FilterOperator.EQ, token.getKey()));
        }
      fCompany.setValue("");

      //Get Resp and Resp Exec filters
      const respValue = Fragment.byId(this.getView().getId(), "fResp").getValue();
      if (respValue) filter.aFilters.push(this.createFilter("Resp", FilterOperator.EQ, respValue));

      const respExecValue = Fragment.byId(this.getView().getId(), "fRespExec").getValue();
      if (respExecValue) filter.aFilters.push(this.createFilter("RespExec", FilterOperator.EQ, respExecValue));

      //Get Departament filters
      const departmentValue = Fragment.byId(this.getView().getId(), "fDepartamento").getValue();
      if (departmentValue) filter.aFilters.push(this.createFilter("Departament", FilterOperator.EQ, departmentValue));

      //Get Coe filter
      const coeValue = Fragment.byId(this.getView().getId(), "fCoe").getSelectedKey();
      if (coeValue)
        if (coeValue === "YES") filter.aFilters.push(this.createFilter("Coe", FilterOperator.EQ, true));
        else filter.aFilters.push(this.createFilter("Coe", FilterOperator.EQ, false));

      //Get plan date range
      const dataPlanDe = Fragment.byId(this.getView().getId(), "fDataPlanDe").getDateValue();
      const dataPlanAte = Fragment.byId(this.getView().getId(), "fDataPlanAte").getDateValue();
      if (dataPlanDe || dataPlanAte) filter.aFilters.push(this.createFilter("InicioPlan", FilterOperator.BT, dataPlanDe, dataPlanAte));

      return filter;
    },

    addFilterFromTokens: function (path, operator, tokens) {
      const filters = [];
      for (const token of tokens) {
        filters.push(this.createFilter(path, operator, token.getKey()));
      }
      return filters;
    },

    createFilter: function (path, operator, value, value2) {
      return {
        sPath: path,
        sOperator: operator, // required from "sap/ui/model/FilterOperator"
        oValue1: value,
        oValue2: value2,
      }
    },

    onFilterSelectPeriodo: function () {

      const fCompany = Fragment.byId(this.getView().getId(), "fCompany");

      const filter = this.getKeyFilter();

      fCompany.bindAggregation("suggestionItems", {
        path: `/v2_empresas`,
        filters: filter,
        template: new sap.ui.core.Item({
          text: { path: "CompanyCode" },
          key: "{CompanyCode}",
        })
      })
      fCompany.setEnabled(true);
    },

    getKeyFilter: function () {
      const profileSelected = Fragment.byId(this.getView().getId(), "fProfile").getSelectedKey();
      const fInstanceSelected = Fragment.byId(this.getView().getId(), "fInstance").getSelectedKey();

      return new Filter({
        filters: [
          new Filter("Profile", FilterOperator.EQ, profileSelected),
          new Filter("Instance", FilterOperator.EQ, fInstanceSelected)
        ],
        and: true
      });
    },

    setDadosECCANTIGO: function (parametro, data) {
      var oModel = this.getOwnerComponent().getModel();
      var oRequestData = {};
      var key = this.getPlanoTarefaSelecionado(this);
      var oDataURL;
      var that = this;

      oRequestData.Profile = key[0];
      oRequestData.Instance = key[1];

      // if (parametro === "setNovidades") {
      //   oRequestData.Novidade = "X";
      //   oDataURL = "/ETS_DADOS_USUARIO(Profile='" + key[0].trim() + "',Instance='" + key[1].trim() + "',Node='" + key[2].trim() + "')";
      //   oRequestData.Node = key[2];
      //   oRequestData.Parametro = parametro;
      // }
      if (parametro === "setStatus") {
        oRequestData.Status = data.Status;
        oDataURL = "/ETS_DADOS_ITEM(Profile='" + key[0].trim() + "',Instance='" + key[1].trim() + "',Item='" + data.Atividade.trim() + "')";
        oRequestData.Item = data.Atividade;
        oRequestData.Parametro = parametro;
        this.getView().setBusy(true);
      }
      /*			if(parametro === "setPersistenciaSelecao"){
              oDataURL		 = "/ETS_DADOS_USUARIO(Profile='" + key[0].trim() + "',Instance='" + key[1].trim() + "',Node='" + key[2].trim() + "')";
              oRequestData.Node		= key[2];
              oRequestData.Parametro	= parametro;
            }*/
      /*			oModel.update(oDataURL, oRequestData, null, function(oData, oResponse){
                sap.m.MessageToast.show("SUCESSO");
                },function(oData, oResponse){
                  sap.m.MessageToast.show("Erro na conexão com o ECC");
            });*/
      oModel.update(oDataURL, oRequestData, {
        async: false,
        success: function (oData, response) {
          if (parametro === "setStatus") {
            //that.getDadosECC("atualizaDadosMonitor");
            that.updateStatus(data);
            that.getView().setBusy(false);
            sap.m.MessageToast.show("Status atualizado com sucesso");
          }
        },
        error: function (oError) {
          sap.m.MessageToast.show("ERRO");
          that.getView().setBusy(false);
        },
      });
    },

    onLinkEmMassaPress: function () {
      var oItems = this.getTableItemsAttachment();

      if (oItems.itens.length) {
        this.loadItemsDialog(this, oItems, false, true);
      }
    },

    onLinkEmMassa: function (oKeys) {
      this._keysLinkEmMassa = oKeys;

      //First, create the attachment
      this.openLinkListEmMassa();
    },

    onLinkCreateMultiple: function (oEvent) {
      // var that = this;

      //Valida URL
      try {
        var oUrl = new URL(sap.ui.getCore().byId("inputUrlHyperlinkMultiple").getValue());
      } catch (_) {
        MessageBox.error('A URL deve iniciar com "http://" ou "https://"');
        return;
      }

      var oLink = {
        Plano: this.getView().byId("idInputModelo").getSelectedItem().getText().trim(),
        Nome: sap.ui.getCore().byId("inputNomeHyperlinkMultiple").getValue(),
        Descricao: sap.ui.getCore().byId("inputDescHyperlinkMultiple").getValue(),
        Link: oUrl.href,
      };

      this.associaLinkEmMassa(oLink);

      // var mParameters = {
      //   success: function (oNewLink, oResponse) {
      //     sap.m.MessageToast.show("Hiperlink cadastrado com sucesso");
      //     that.onCloseDialogLink();
      //   },
      //   error: function (oError) {
      //     //Captura erros retornados do SAP
      //     var msgErro = JSON.parse(oError.responseText).error.message.value;
      //     MessageBox.error(msgErro);
      //   },
      // };

      // var oDataModel = this.getView().getModel();
      // oDataModel.create("/LinkTarefas", oLink, mParameters);
    },

    openLinkListEmMassa: function (oEvent) {
      if (!this._oDialogLinkListEmMassa) {
        this._oDialogLinkListEmMassa = sap.ui.xmlfragment("FechamentoContabil.view.fragments.newHyperlinkMultiple", this);
        this.getView().addDependent(this._oDialogLinkListEmMassa);
        if (sap.ui.Device.system.phone) {
          this._oDialogLinkListEmMassa.setContentWidth("100%");
        }
      }

      this._oDialogLinkListEmMassa.open();
    },

    onLinkEmMassaDialogClose: function () {
      if (this._oDialogLinkListEmMassa) {
        this._oDialogLinkListEmMassa.close();
        this._oDialogLinkListEmMassa.destroy();
        this._oDialogLinkListEmMassa = undefined;
      }
    },

    associaLinkEmMassa: function (link) {
      let totalItems;
      let totalCompleted = 0;
      this.getView().setBusy(true);
      const requestParams = {
        groupId: "updateLinkMass",
        defaultUpdateMethod: "PUT",
        useBatch: true
      };

      const oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/", requestParams);
      oModel.setDeferredGroups([requestParams.groupId]);

      totalItems = this._keysLinkEmMassa.length;

      this.setProgress(0);
      this.displayDialogProgress();

      const updateItems = (fromIndex) => {

        let updatedItems = 0;
        for (let index = fromIndex; index < this._keysLinkEmMassa.length; index++) {

          const key = this._keysLinkEmMassa[index];

          const data = {
            Plano: link.Plano,
            Tarefa: key.NoAtual,
            Nome: link.Nome,
            Descricao: link.Descricao,
            Link: link.Link,
          };
          requestParams.changeSetId = Math.floor(Math.random() * 501) + Math.floor(Math.random() * 501) + Math.floor(Math.random() * 501);
          oModel.create(`/LinkTarefas`, data, requestParams);

          updatedItems++;
          totalCompleted++;

          if (updatedItems === this.massBatchSize || totalCompleted === totalItems) {

            this.submitChangesSync(oModel, "updateLinkMass").then(() => {
              this.setProgress((totalCompleted / totalItems) * 100);
              if (totalCompleted !== totalItems)
                updateItems(totalCompleted);
              else {
                this.closeDialogProgress();
                this.onLinkEmMassaDialogClose();
                this.getView().setBusy(false);
                sap.m.MessageToast.show("Link criado com sucesso para as atividades selecionadas");
              }
            })
            return;
          }
        }
      }
      updateItems(totalCompleted);

    },

    onAnexoEmMassaPress: function () {
      var oItems = this.getTableItemsAttachment();

      if (oItems.itens.length) {
        this.loadItemsDialog(this, oItems, true);
      }
    },

    openAnexoListEmMassa: function (oEvent) {
      if (!this._oDialogAnexoListEmMassa) {
        this._oDialogAnexoListEmMassa = sap.ui.xmlfragment("FechamentoContabil.view.fragments.anexosEmMassa", this);
        this.getView().addDependent(this._oDialogAnexoListEmMassa);
        if (sap.ui.Device.system.phone) {
          this._oDialogAnexoListEmMassa.setContentWidth("100%");
        }
      }

      this._oDialogAnexoListEmMassa.open();
    },

    getTableItemsAttachment: function () {
      var that = this;
      var oTable = this.getView().byId("idTableAtividades");
      var oItems = oTable.getBinding("rows").aIndices;
      var oList = oTable.getBinding("rows").oList;
      var itens = [];
      var oKeys = [];

      let oListCopy = JSON.parse(JSON.stringify(oList));

      //Obtém a chave dos itens selecionados
      oItems.forEach(function (item, index) {
        var oRow = oListCopy[item];

        var aKey = {
          NoAtual: oRow.NO_ATIVIDADE,
        };

        //Converte datas/hora
        oRow.DATA_INICIO_PLAN = that.getCellDate(oRow.DATA_INICIO_PLAN);
        oRow.HORA_INICIO_PLAN = that.getCellTime(oRow.HORA_INICIO_PLAN);
        oRow.DATA_FIM_PLAN = that.getCellDate(oRow.DATA_FIM_PLAN);
        oRow.HORA_FIM_PLAN = that.getCellTime(oRow.HORA_FIM_PLAN);
        oRow.DATA_INICIO = that.getCellDate(oRow.DATA_INICIO);
        oRow.HORA_INICIO = that.getCellTime(oRow.HORA_INICIO);
        oRow.DATA_FIM = that.getCellDate(oRow.DATA_FIM);
        oRow.HORA_FIM = that.getCellTime(oRow.HORA_FIM);

        itens.push(oRow);
        oKeys.push(aKey);
      });

      return {
        itens: itens,
        keys: oKeys,
      };
    },

    onAnexoEmMassa: function (oKeys) {
      this._keysAnexoEmMassa = oKeys;

      //First, create the attachment
      this.openAnexoListEmMassa();
    },

    onAnexarArquivoEmMassa: function () {
      var oFileUploader = sap.ui.getCore().byId("fileUploaderAnexoEmMassa");

      if (oFileUploader.getValue() === "") {
        MessageBox.Error("Nenhum arquivo selecionado");
        return;
      }

      const oModel = this.getView().getModel();
      const profile = this.getView().byId("idInputModelo").getSelectedItem().getText();
      const instance = this.getView().byId("idInputPeriodo").getSelectedItem().getKey();
      const oDataURL = `/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/ETS_MONITOR_GERAL(Modelo='${profile.trim()}',Instance='${instance.trim()}',Hierarquia='')/MonitorToFile`;

      //	oModel.refreshSecurityToken();
      oFileUploader.removeAllHeaderParameters();
      const oHeaders = oModel.oHeaders;
      const sToken = oHeaders["x-csrf-token"];

      let oHeaderParameter = new sap.ui.unified.FileUploaderParameter({
        name: "slug",
        value: oFileUploader.getValue(),
      });
      oFileUploader.addHeaderParameter(oHeaderParameter);
      oHeaderParameter = new sap.ui.unified.FileUploaderParameter({
        name: "X-CSRF-Token",
        value: sToken,
      });
      oFileUploader.addHeaderParameter(oHeaderParameter);

      oFileUploader.setSendXHR(true);
      oFileUploader.setUploadUrl(oDataURL);
      sap.ui.core.BusyIndicator.show();
      oFileUploader.upload();
    },

    handleUploadCompleteAnexoEmMassa: function (oEvent) {
      const sResponse = oEvent.getParameter("responseRaw");
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(sResponse, "text/xml");

      if (xmlDoc.getElementsByTagName("error").length > 0) {
        sap.m.MessageBox.error(xmlDoc.getElementsByTagName("message")[0].textContent);
        sap.ui.core.BusyIndicator.hide();
        return;
      }

      let fileDocId = xmlDoc.getElementsByTagName("id")[0].textContent.substring(xmlDoc.getElementsByTagName("id")[0].textContent.indexOf("FileId='") + 8);
      fileDocId = fileDocId.substring(0, fileDocId.indexOf("'"));

      this.associaArquivoEmMassa(fileDocId);

      var oFileUploader = sap.ui.getCore().byId("fileUploaderAnexoEmMassa");
      oFileUploader.setValue("");

      this.onAnexoEmMassaDialogClose();
    },

    associaArquivoEmMassa: function (fileId) {
      let totalItems;
      let totalCompleted = 0;
      const profile = this.getView().byId("idInputModelo").getSelectedItem().getText();
      const instance = this.getView().byId("idInputPeriodo").getSelectedItem().getKey();;
      const requestParams = {
        groupId: "updateAnexoMass",
        defaultUpdateMethod: "PUT",
        useBatch: true
      };

      const oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/", requestParams);
      oModel.setDeferredGroups([requestParams.groupId]);

      totalItems = this._keysAnexoEmMassa.length;

      this.setProgress(0);
      this.displayDialogProgress();

      const updateItems = (fromIndex) => {

        let updatedItems = 0;
        for (let index = fromIndex; index < this._keysAnexoEmMassa.length; index++) {

          const key = this._keysAnexoEmMassa[index];

          const data = {
            Profile: profile,
            Instance: instance,
            Item: key.NoAtual,
            FileId: fileId,
          };
          requestParams.changeSetId = Math.floor(Math.random() * 501) + Math.floor(Math.random() * 501) + Math.floor(Math.random() * 501);
          oModel.update(`/ETS_FILE(Profile='${profile.trim()}',Instance='${instance.trim()}',Item='${key.NoAtual}',FileId='${fileId}')`, data, requestParams);

          updatedItems++;
          totalCompleted++;

          if (updatedItems === this.massBatchSize || totalCompleted === totalItems) {

            this.submitChangesSync(oModel, "updateAnexoMass").then(() => {
              this.setProgress((totalCompleted / totalItems) * 100);
              if (totalCompleted !== totalItems)
                updateItems(totalCompleted);
              else {
                this.closeDialogProgress();
                this.onLinkEmMassaDialogClose();
                sap.ui.core.BusyIndicator.hide();
                this.getView().setBusy(false);
                sap.m.MessageToast.show("Arquivo anexado com sucesso");
              }
            })
            return;
          }
        }
      }
      updateItems(totalCompleted);

      // for (const key of this._keysAnexoEmMassa) {
      //   const data = {
      //     Profile: profile,
      //     Instance: instance,
      //     Item: key.NoAtual,
      //     FileId: fileId,
      //   };
      //   oModel.update(`/ETS_FILE(Profile='${profile.trim()}',Instance='${instance.trim()}',Item='${key.NoAtual}',FileId='${fileId}')`, data, requestParams);
      // }

      oModel.submitChanges({
        success: function (oData, sResponse) {
          this.getView().setBusy(false);
          if (oData.__batchResponses[0].response) {
            const resp = JSON.parse(oData.__batchResponses[0].response.body);
            sap.m.MessageToast.show(resp.error.message.value);
          } else {
            sap.m.MessageToast.show("Arquivo anexado com sucesso");
            // this.getDadosECC("atividadeAnexos");

            // key.iconAnexo.setColor("blue");
            // if (this.getView().getViewName() === "FechamentoContabil.view.Atividades") this.setValueModel_atividades(key.iconAnexo, "NO", key.NoAtual, "CONTEM_ANEXO", "X");
            // else this.setValueModel_gantt(key.iconAnexo, "NO", key.NoAtual, "CONTEM_ANEXO", "X");
          }
        }.bind(this),
        error: function (oError) {
          sap.m.MessageToast.show("Erro ao anexar arquivo em massa");
          this.getView().setBusy(false);
        }.bind(this),
      });
    },

    openAnexoListEmMassa: function (oEvent) {
      if (!this._oDialogAnexoListEmMassa) {
        this._oDialogAnexoListEmMassa = sap.ui.xmlfragment("FechamentoContabil.view.fragments.anexosEmMassa", this);
        this.getView().addDependent(this._oDialogAnexoListEmMassa);
        if (sap.ui.Device.system.phone) {
          this._oDialogAnexoListEmMassa.setContentWidth("100%");
        }
      }

      this._oDialogAnexoListEmMassa.open();
    },

    /***************************************************************************
      onAnexoDialogClose
    ****************************************************************************/
    onAnexoEmMassaDialogClose: function () {
      if (this._oDialogAnexoListEmMassa) {
        this._oDialogAnexoListEmMassa.close();
        this._oDialogAnexoListEmMassa.destroy();
        this._oDialogAnexoListEmMassa = undefined;
      }
    },

    respostaECCANTIGO: function (that, parameter, data) {
      switch (parameter) {
        case "dadosIniciais":
          that.inicializaMonitor(that, data);
          break;
        case "inicializaDadosMonitor":
          that.setModelTree(that, data.MonitorToHierarquia);
          that.setList(data.MonitorToHierarquia);
          that.getDadosECC("inicializaTree");
          that.checkFilters();
          that.setDadosECC("setPersistenciaSelecao");
          break;
        case "inicializaTree":
          that.setModelTree(that, data.MonitorToHierarquia);
          that.setPathHierarquia();
          that.getView().setBusy(false);
          that.setKey();
          break;
        case "atualizaDadosMonitor":
          that.setList(data.MonitorToHierarquia);
          that.setPathHierarquia();
          //that.updateGraficos(that,data);
          that.setKey();
          that.checkFilters();
          that.getView().setBusy(false);
          that.setDadosECC("setPersistenciaSelecao");
          break;
        case "fileNames":
          that.setFilenames(that, data.MonitorToFilenames);
          that.getView().setBusy(false);
          break;
      }
      this.closePopups();
    },

    /*	updateStatus: function(data){
      	
        if(data.Status === "R"){
          elementoSelecionado.setSrc("sap-icon://process");
          elementoSelecionado.setColor("#bfbfbf");
          elementoSelecionado.setTooltip("Em processamento");
        }
        if(data.Status === "0"){
          elementoSelecionado.setSrc("sap-icon://complete");
          elementoSelecionado.setColor("#46af4f");
          elementoSelecionado.setTooltip("Concluído sem erros");
        }
        if(data.Status === "2"){
          elementoSelecionado.setSrc("sap-icon://complete");
          elementoSelecionado.setColor("#d2e23f");
          elementoSelecionado.setTooltip("Concluído com avisos");
        }
        if(data.Status === "4"){
          elementoSelecionado.setSrc("sap-icon://complete");
          elementoSelecionado.setColor("#e2753f");
          elementoSelecionado.setTooltip("Concluído com erros");
        }
      	
      },*/

    setList: function (MonitorToHierarquia) {
      var atividades = [];

      MonitorToHierarquia.results.forEach(function (atividade) {
        if (atividade.NO_ATIVIDADE !== "") {
          atividades.push({
            NO: atividade.NO,
            MODELO: atividade.MODELO,
            INSTANCE: atividade.INSTANCE,
            HIERARQUIA: atividade.HIERARQUIA,
            DESC_NO: atividade.DESC_NO,
            NO_PAI: atividade.NO_PAI,
            NO_ATIVIDADE: atividade.NO_ATIVIDADE,
            nome: atividade.DESC_TAREFA,
            status: atividade.STATUS,
            critico: atividade.CRITICO,
            tipoTarefa: atividade.TPTAREFA,
            respExec: atividade.RESP_EXEC,
            dataInicioPlan: atividade.DATA_INICIO_PLAN,
            horaInicioPlan: atividade.HORA_INICIO_PLAN,
            dataFimPlan: atividade.DATA_FIM_PLAN,
            horaFimPlan: atividade.HORA_FIM_PLAN,
            duracaoPlan: atividade.DURACAO_PLAN,
            dataInicio: atividade.DATA_INICIO,
            horaInicio: atividade.HORA_INICIO,
            dataFim: atividade.DATA_FIM,
            horaFim: atividade.HORA_FIM,
            duracao: atividade.DURACAO,
            responsavel: atividade.RESP,
            anexo: atividade.CONTEM_ANEXO,
            ICON_STATUS: atividade.ICON_STATUS,
            COLOR_STATUS: atividade.COLOR_STATUS,
            atividadeAtrasada: atividade.ATIVIDADE_ATRASADA,
            path: atividade.PATH,
          });

          usuarioSAPatual = atividade.USUARIO_ATUAL;
        }
      });

      var oListModel = new sap.ui.model.json.JSONModel(atividades);

      // Assign the model object to the SAPUI5 core
      this.getView().setModel(oListModel, "list");
    },

    onConfigHierarquia: function (oEvent) {
      var popupHierarquia = this.getView().byId("idMenuHierarquia");
      popupHierarquia.toggleStyleClass("menu__hierarquia__inativo");
    },

    /*	onNovaHierarquia: function (oEvent) {
        this.getDadosECC("atualizaDadosMonitor");
      },*/

    checkFilters: function () {
      var ColAtvdAtrasada = this.getView().byId("ColAtividadeAtrasada");
      var ColRespExec = this.getView().byId("idColRespExec");
      var BtnAtvdAtrasada = this.getView().byId("idAtivdAtrasadas");
      var BtnMinhasAtivds = this.getView().byId("idMinhasAtvds");
      var tableAtividades = this.getView().byId("idTableAtividades");
      var ColFimPlanH = this.getView().byId("idColFimPlanH");
      var ColFimPlanD = this.getView().byId("idColFimPlanD");
      var ColCritico = this.getView().byId("idColCritico");

      if (!tableAtividades.getBinding("rows")) return;


      // if (this.getView().getModel("preSelectedTasks").getProperty("/preSelectedTasks")) {
      //   const filters = [];
      //   const taskDetails = this.getView().getModel("preSelectedTasks").getProperty("/taskDetails")

      //   if (taskDetails.tasks.indexOf(",") === -1) {
      //     const newFilter = new sap.ui.model.Filter("NO_ATIVIDADE", sap.ui.model.FilterOperator.EQ, taskDetails.tasks);
      //     filters.push(newFilter);
      //   }
      //   else {
      //     const tasks = taskDetails.tasks.split(",");
      //     for (const task of tasks) {
      //       const newFilter = new sap.ui.model.Filter("NO_ATIVIDADE", sap.ui.model.FilterOperator.EQ, task);
      //       filters.push(newFilter);
      //     }
      //   }

      //   const filterData = new sap.ui.model.Filter(filters, false);

      //   tableAtividades.getBinding("rows").filter(filterData, "Application");

      //   const planoSelecionado = this.getView().getModel("PlanoSelecionado").getProperty("/");

      //   const itemProfile = new sap.ui.core.Item({
      //     key: planoSelecionado.Profile,
      //     text: planoSelecionado.Profile
      //   })

      //   this.getView().byId("idInputModelo").addItem(itemProfile);
      //   this.getView().byId("idInputModelo").setSelectedKey(planoSelecionado.Profile);

      //   const itemPeriodo = new sap.ui.core.Item({
      //     key: planoSelecionado.Instance,
      //     text: planoSelecionado.Data
      //   })

      //   this.getView().byId("idInputPeriodo").addItem(itemPeriodo);
      //   this.getView().byId("idInputPeriodo").setSelectedKey(planoSelecionado.Instance);

      // }

      if (BtnAtvdAtrasada.getPressed()) {
        ColAtvdAtrasada.filter("X");
        tableAtividades.sort(ColCritico, sap.ui.table.SortOrder.Descending, false);
        tableAtividades.sort(ColFimPlanD, sap.ui.table.SortOrder.Ascending, true);
        tableAtividades.sort(ColFimPlanH, sap.ui.table.SortOrder.Ascending, true);
      } else {
        ColAtvdAtrasada.filter("");
        tableAtividades.getBinding("rows").sort(null);
        var aColumns = tableAtividades.getColumns();
        for (var i = 0; i < aColumns.length; i++) {
          aColumns[i].setSorted(false);
        }
      }

      if (BtnMinhasAtivds.getPressed()) {
        ColRespExec.filter(this.getView().getModel("Tarefas").oData[0].USUARIO_ATUAL);
      } else ColRespExec.filter("");
    },

    onChangeDate: function (oEvent) {
      var source = oEvent.getSource();
      source.setValue(source.getTooltip());
    },

    /*		onPressStatus: function(oEvent){
        	
          elementoSelecionado = oEvent.getSource();
        	
          if(elementoSelecionado.getSrc() === "sap-icon://stop")
            this.habilitaBtnStatus(false);
          else 
            if(elementoSelecionado.getTooltip() === "Em processamento" || elementoSelecionado.getTooltip() === "Desconhecido")
              this.habilitaBtnStatus(true);
            else
              this.habilitaBtnStatus(false);
      	
          this.closePopups();
      	
          var centerViewPort = document.querySelector("#centerViewPort");
          var limitedWidtht  = document.querySelector(".sapUShellApplicationContainerLimitedWidth");
          var diffWidth = (centerViewPort.clientWidth - limitedWidtht.offsetWidth) / 2;
      	
          var popupChangeStatus = this.getView().byId("popupChangeStatus").getDomRef();// document.querySelector(".popup_change_status");
          popupChangeStatus.classList.toggle("popup__disable");
          var iconStatusDom = oEvent.getSource().getDomRef();
          var rect = iconStatusDom.getBoundingClientRect();

          popupChangeStatus.classList.remove("popup_change_status_left");
          popupChangeStatus.classList.remove("popup_change_status_right");
          if(rect.left > 0){
            diffWidth = rect.left - diffWidth;
            popupChangeStatus.style.left = (diffWidth + 53) + "px"; //( rect.left - 80 )  + "px";
            popupChangeStatus.style.top  = (rect.top - 70) + "px";
            popupChangeStatus.classList.add("popup_change_status_left");
          }
          else{
            popupChangeStatus.style.left = (diffWidth + 53) + "px"; //( rect.left - 80 )  + "px";
            popupChangeStatus.style.top  = (rect.top - 70) + "px";
            popupChangeStatus.classList.add("popup_change_status_right");
          }
        	
        },
      	
        pressChangeStatus: function(oEvent){
          var status;
          var value;
          var id = oEvent.getSource().getId();
          if(id.indexOf("idProc") !== -1)
            status = "R";
          if(id.indexOf("idOk") !== -1)
            status = "0";
          if(id.indexOf("idAviso") !== -1)
            status = "2";
          if(id.indexOf("idErro") !== -1)
            status = "4";
          	
          var atividade = this.getAtividade(elementoSelecionado);
          value = { Atividade: atividade, Status: status };
          this.setDadosECC("setStatus",value);
          this.closePopups();	
        },*/

    /*	habilitaBtnStatus: function(habilitar){
        var statusIconIDs = ["idOk", "idAviso", "idProc", "idErro"];
        var status;
        var that = this;
        if(habilitar){
          statusIconIDs.forEach(function(id){
          	
            status = that.byId(id);
            status.setVisible(true);
          	
            if(id === "idProc")
              status.setVisible(false);
          	
          });
        }
        else{
          statusIconIDs.forEach(function(id){
            status = that.byId(id);
            if(id === "idOk" || id === "idAviso" || id === "idErro")
              status.setVisible(false);
            if(id === "idProc")
              status.setVisible(true);
          });
        }
      },*/

    /*	closePopups: function(){ 
        var popups = document.querySelectorAll(".zpopup");
        popups.forEach(function(popup){
          if(!popup.classList.contains("popup__disable"))
            popup.classList.add("popup__disable");
        });
      },*/

    /*		getAtividade: function(oEvent){
        	
          var metadata = oEvent.getMetadata();
          var parent;
        	
          if(metadata.getName() === "sap.ui.base.Event")
            parent = oEvent.getSource().getParent();
          else
            parent = oEvent.getParent();
          	
          for(var i = 0; i < 6; i++){
            if(parent.getMetadata()._sClassName === "sap.ui.table.Row")
              break;
            parent = parent.getParent();
          }
          var cells = parent.getCells();
          var hbox = cells[0];
          var items = hbox.getItems();
          return items[1].getText();
        },*/

    /*		addBrowserEvents: function(){
          var statusIcons = document.querySelectorAll("popup__change__status__icon");
          statusIcons.forEach(function(icon){
            icon.addEventListener("mouseover", function(){
              var idTextStatus = this.getView().byId("idTextStatus");
              if(icon.getAttribute("id").indexOf("idProc") !== -1)
                idTextStatus.setText("texte");
            });
          });
        	
          var statusIconIDs = ["idOk", "idAviso", "idProc", "idErro"];
          var id;
          var status;
          var that = this;
          statusIconIDs.forEach(function(id){
            status = that.byId(id);
            status.attachBrowserEvent("mouseover", function(){
              var idTextStatus = that.getView().byId("idTextStatus");
            	
              if(id === "idOk"){
                idTextStatus.setText("Concluído sem erros");
                idTextStatus.getDomRef().style.color = "#46af4f";
              }
              if(id === "idAviso"){
                idTextStatus.setText("Concluído com avisos");
                idTextStatus.getDomRef().style.color = "#d2e23f";
              }
              if(id === "idErro"){
                idTextStatus.setText("Concluído com erros");
                idTextStatus.getDomRef().style.color = "#e2753f";
              }

              if(id === "idProc"){
                idTextStatus.setText("Em processamento");
                idTextStatus.getDomRef().style.color = "#bfbfbf";
              }
            }); 
            status.attachBrowserEvent("mouseout", function(){
              var idTextStatus = that.getView().byId("idTextStatus");
              idTextStatus.setText("");
            });
          });
        },
      	
    /*		onConfigAnexo: function (oEvent) {
          var source = oEvent.getSource();
          var popupAnexo = this.getView().byId("idPopupAnexo");
          if(source.getSrc() === "sap-icon://decline"){
            popupAnexo.toggleStyleClass("popup__anexo__inativo");
            return;
          }
          var vboxAnexos = this.getView().byId("idVBoxAnexos");
          vboxAnexos.setVisible(false);
          var selectList = this.getView().byId("selectList");
          selectList.removeAllItems();
          elementoSelecionado = oEvent.getSource();
          this.getDadosECC("atividadeAnexos");
          popupAnexo.toggleStyleClass("popup__anexo__inativo");
        },*/

    /*	setFilenames: function(that,fileNames){
        var selectList = this.getView().byId("selectList");
        var vboxAnexos = this.getView().byId("idVBoxAnexos");
        if(fileNames.results.length > 0){
        	
          vboxAnexos.setVisible(true);
        	
          fileNames.results.forEach(function(filename){
            var item = new sap.ui.core.Item();
            item.setKey(filename.Profile.trim() + "-" + filename.Instance.trim() + "-" + filename.Hierarquia.trim() + "-" + filename.Fileid.trim());
            item.setText(filename.Filename);
            selectList.addItem(item);
          });
        }
        else{
          vboxAnexos.setVisible(false);
        }
      },*/
    /*
  onAnexarArquivo: function(){
      var oFileUploader = this.byId("fileUploader");
    	
      if(oFileUploader.getValue() === ""){
        sap.m.MessageToast.show("Nenhum arquivo selecionado");
        return;
      }
    	
      var key = this.getPlanoTarefaSelecionado(this);
      var oModel = this.getView().getModel();
      var noAtividade = this.getAtividade(elementoSelecionado);
      var oDataURL = "/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/ETS_MONITOR_GERAL(Modelo='" + key[0].trim() + "',Instance='" + key[1].trim() + "',Hierarquia='" + noAtividade +	"')/MonitorToFile";
    	
    //	oModel.refreshSecurityToken();
      oFileUploader.removeAllHeaderParameters();
          var oHeaders = oModel.oHeaders;
          var sToken = oHeaders["x-csrf-token"];

      var oHeaderParameter = new sap.ui.unified.FileUploaderParameter({name: "slug", value: oFileUploader.getValue() });
      oFileUploader.addHeaderParameter(oHeaderParameter);
          oHeaderParameter = new sap.ui.unified.FileUploaderParameter({name: "X-CSRF-Token", value: sToken });
      oFileUploader.addHeaderParameter(oHeaderParameter);
    	
      oFileUploader.setSendXHR(true);
      oFileUploader.setUploadUrl(oDataURL);
      this.getView().setBusy(true);
      oFileUploader.upload();
    	
    },
  	
    onDownloadItem: function(oEvent){
      var oDataURL;
      var key = oEvent.getSource().getSelectedKey().split("-");

            oDataURL = "/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/ETS_FILE(Profile='" + key[0].trim() + "',Instance='" + key[1].trim() + "',Item='" + key[2].trim() + "',FileId='" + key[3].trim() + "')/$value";

      window.open(oDataURL);
    },
  	
    handleUploadComplete: function(oEvent) {
      var sResponse = oEvent.getParameter("response");
      if (sResponse.indexOf("ERRO") === -1) {
/*				var sMsg = "";
        var m = /^\[(\d\d\d)\]:(.*)$/.exec(sResponse);
        if (m[1] === "200") {
          sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Success)";
          oEvent.getSource().setValue("");
        } else {
          sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Error)";
        }

        sap.m.MessageToast.show("Arquivo anexado com sucesso");
        var popupAnexo = this.getView().byId("idPopupAnexo");
        popupAnexo.toggleStyleClass("popup__anexo__inativo");
        elementoSelecionado.setColor("blue");
      }
      else
        sap.m.MessageToast.show("Arquivo não suportado");
      this.getView().setBusy(false);
      var oFileUploader = this.byId("fileUploader");
      oFileUploader.setValue("");
    },*/

    onExportarExcel: function (oEvent) {

      const profile = this.getView().byId("idInputModelo").getSelectedItem().getText();
      const instance = parseInt(this.getView().byId("idInputPeriodo").getSelectedKey().trim());
      let url;

      if (window.location.href.indexOf("fioridev") !== -1) url = `https://fioridev.votorantim.com.br/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/RP_ITEMSet?$filter=Profile eq '${profile}' and Instance eq ${instance}&$format=xlsx`
      if (window.location.href.indexOf("brsaolsvfid01") !== -1) url = `http://brsaolsvfid01.votorantim.grupo:8000/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/RP_ITEMSet?$filter=Profile eq '${profile}' and Instance eq ${instance}&$format=xlsx`
      if (window.location.href.indexOf("fiori.") !== -1) url = `https://fiori.votorantim.com.br/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/RP_ITEMSet?$filter=Profile eq '${profile}' and Instance eq ${instance}&$format=xlsx`

      if (!url) url = `http://brsaolsvfid01.votorantim.grupo:8000/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/RP_ITEMSet?$filter=Profile eq '${profile}' and Instance eq ${instance}&$format=xlsx&saml2=disabled`

      window.open(url).focus();
    },

    openSendTask: function (oEvent) {

      this.onPressFechaPopupOptions();

      Fragment.load({
        id: this.getView().getId(),
        name: "FechamentoContabil.view.fragments.sendTask",
        controller: this
      }).then(function (oDialog) {


        Fragment.byId(this.getView().getId(), "sendTaskInputEmail").addValidator(this.multiInputEmailValidator);
        Fragment.byId(this.getView().getId(), "sendTaskInputEmail").attachBrowserEvent("keydown", this.updateEmailSuggestions, this);

        this.getView().getModel("shareTask").setProperty("/text", `Olá,\n\nEstou compartilhando com você a atividade ${this._descAtividadeAtual}`);
        this.getView().getModel("shareTask").setProperty("/type", "teams");
        this.getView().getModel("shareTask").setProperty("/subject", "");

        this._oDialogSendTask = oDialog;
        oDialog.setBusy(true);
        oDialog.setBusyIndicatorDelay(0)
        this.getView().addDependent(oDialog);
        this.initRichTextEditor(false, oDialog);
        oDialog.open();
      }.bind(this));

    },

    onSendTaskDialogClose: function () {
      if (this._oDialogSendTask) {
        this._oDialogSendTask.close();
        this._oDialogSendTask.destroy();
        this._oDialogSendTask = undefined;
      }
    },

    initRichTextEditor: function (bIsTinyMCE5, oDialog) {

      const profile = this.getView().byId("idInputModelo").getSelectedItem().getText().trim();
      const instance = this.getView().byId("idInputPeriodo").getSelectedKey();
      const taskUrl = `${window.location.href.substring(0, window.location.href.indexOf("/atv"))}/tasks/${profile}/${instance.trim()}/${this._noAtual}`;

      var that = this,
        sHtmlValue = `<div style="max-height: 390px; overflow-y: auto; width: fit-content;">
        <table
            style="margin-left: 5px; margin-top: -1px; border-collapse: collapse; background-color: #EEEEEE; position: relative;">
            <thead style="background-color: #1C6EA4; color: white; text-align: left; position: sticky; top: -1px;">
                <tr>
                    <th style="border: 1px solid #ddd;padding-left: 10px;padding-right: 10px;">Tarefa</th>
                    <th style="border: 1px solid #ddd;padding-left: 10px;padding-right: 10px;">Responsável pela Execução</th>
                    <th style="border: 1px solid #ddd;padding-left: 10px;padding-right: 10px;text-align: center;">Empresa</th>
                    <th style="border: 1px solid #ddd;padding-left: 10px;padding-right: 10px;">Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: 1px solid #ddd;padding-left: 10px;padding-right: 10px;"><a href="${taskUrl}">${this._descAtividadeAtual}</a></td>
                    <td style="border: 1px solid #ddd;padding-left: 10px;padding-right: 10px;">${this._respExecAtual}</td>
                    <td style="border: 1px solid #ddd;padding-left: 10px;padding-right: 10px;text-align: center;">${this._empresaAtual}</td>
                    <td style="border: 1px solid #ddd;padding-left: 10px;padding-right: 10px;">${this._statusAtual}</td>
                </tr>
            </tbody>
        </table>
    </div>`;

      sap.ui.require(["sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/library"],
        function (RTE, library) {
          var EditorType = library.EditorType;
          that.oRichTextEditor = new RTE("myRTE", {
            editorType: bIsTinyMCE5 ? EditorType.TinyMCE5 : EditorType.TinyMCE4,
            width: "100%",
            height: "100%",
            editable: false,
            customToolbar: false,
            showGroupFont: false,
            showGroupLink: false,
            showGroupInsert: false,
            showGroupClipboard: false,
            showGroupFontStyle: false,
            showGroupStructure: false,
            showGroupTextAlign: false,
            ready: function () {
              this.setValue(sHtmlValue);
              oDialog.setBusy(false);
            }
          });

          Fragment.byId(this.getView().getId(), "sendtaskRickTextContainer").addItem(that.oRichTextEditor);
        }.bind(this));
    },

    onPressRemoveFilters: function () {
      this.byId("btnShowOtherTasks").setVisible(false);
      this.openFilterAtividades();
    },

    onSendTaskDialog: function () {

      const shareTaskModel = this.getView().getModel("shareTask").getProperty("/");

      if (shareTaskModel.type === "teams" && shareTaskModel.text.length > 500) {
          sap.m.MessageBox.error(`Permitido no máximo 500 caracteres para compartilhamento via Teams (quantidade de carateres - ${shareTaskModel.text.length})`);
          return;
      }

      if (!this.getTokensEmailValues("sendTaskInputEmail")) {
        sap.m.MessageBox.error("Campo \"E-mails\" é obrigatório");
        return;
      }

      if (shareTaskModel.type !== "teams") {
        if (!shareTaskModel.subject || shareTaskModel.subject.trim() === "") {
          sap.m.MessageBox.error("Campo \"Assunto\" é obrigatório");
          return;
        }
      }

      const shareTaskData = {
        Type: shareTaskModel.type,
        Recipients: this.getTokensEmailValues("sendTaskInputEmail"),
        Subject: shareTaskModel.subject || "",
        Text: `${shareTaskModel.text}<br><br>${this.oRichTextEditor.getValue()}`
      }

      if (this.getView().getModel("shareTask").getProperty("/type") === "teams")
        shareTaskData.Text = shareTaskData.Text + "<p>Atenção! Mensagem automática. Favor não responder.</p>";

      this._oDialogSendTask.setBusy(true);

      this.getView().getModel().callFunction("/share_task", {    // function import name
        method: "POST",                             // http method
        urlParameters: shareTaskData, // function import parameters        
        success: function (oData, response) {
          this._oDialogSendTask.setBusy(false);
          this.onSendTaskDialogClose();
          sap.m.MessageBox.success("Tarefa enviada");
        }.bind(this),
        error: function (oError) {
          this._oDialogSendTask.setBusy(false);
          sap.m.MessageBox.error("Erro ao enviar tarefa");
        }.bind(this)
      });

      // this.onPressFechaPopupOptions();

    },

    getTokensEmailValues: function (idMultiInput) {
      let value;
      const multInput = this.getView().byId(idMultiInput);
      const tokens = multInput.getTokens();

      for (const token of tokens) {
        if (value) value += ";" + token.getText();
        else value = token.getText();
      }

      return value;
    },

    onChangeShareText: function (oEvent) {

      const textArea = oEvent.getSource();
      const newValue = oEvent.getParameter("newValue");

      const values = newValue.replace(/\r\n/g, "\n").split("\n")
      if (values.length > 8) {
        textArea.setValue(textArea.getLastValue());
        return;
      }
      textArea.setValue(newValue);
    },

    onPressApprovals: function (oEvent) {

      this.onPressFechaPopupOptions();

      this.getWorkflowData();

      let canApprove = false;
      if (this._statusAtual === "Em Aprovação") canApprove = true;
      this.getModel("viewAtividades").setProperty("/selectedTaskStatus", canApprove);

      Fragment.load({
        id: this.getView().getId(),
        name: "FechamentoContabil.view.fragments.Approvals",
        controller: this
      }).then(function (oDialog) {
        this._oDialogApprovals = oDialog;
        this.getView().addDependent(this._oDialogApprovals);
        oDialog.setBusy(true);
        oDialog.setBusyIndicatorDelay(0);
        oDialog.open();
      }.bind(this));

    },

    onApprovalskDialogClose: function () {
      if (this._oDialogApprovals) {
        this._oDialogApprovals.close();
        this._oDialogApprovals.destroy();
        this._oDialogApprovals = undefined;
      }
    },

    getWorkflowData: function () {
      const profile = this.getView().byId("idInputModelo").getSelectedItem().getText().trim();
      const instance = parseInt(this.getView().byId("idInputPeriodo").getSelectedKey());

      this.getModel().read(`/v2_workflow_status(Profile='${profile}',Instance=${instance},Item='${this._noAtual}',Level='',ApprovalDate='',ApprovalTime='')/toCurrentStatus`, {
        success: function (oData, oResponse) {
          this.setlevelsRejectedApproved(oResponse.data.results);
          this.createModel(oResponse.data.results, "workflowStatus");
          this._oDialogApprovals.setBusy(false);
        }.bind(this)
      });
    },

    setlevelsRejectedApproved: function (workflowData) {
      const levelsApproved = [];
      const levelsRejected = [];

      for (const workflow of workflowData) {
        if (workflow.Status === 'A') levelsApproved.push(workflow.Level);
        if (workflow.Status === 'R') levelsRejected.push(workflow.Level);
      }

      this.getModel("viewAtividades").setProperty("/levelsApproved", levelsApproved);
      this.getModel("viewAtividades").setProperty("/levelsRejected", levelsRejected);

    },

    getGroupLevel: function (oGroup) {

      const levelsApproved = this.getModel("viewAtividades").getProperty("/levelsApproved");
      const levelsRejected = this.getModel("viewAtividades").getProperty("/levelsRejected");

      let highlight = "Warning";
      let count = "Pendente";
      if (levelsApproved.indexOf(oGroup.key) !== -1) {
        highlight = "Success";
        count = "Aprovado";
      }
      if (levelsRejected.indexOf(oGroup.key) !== -1) {
        highlight = "Error";
        count = "Rejeitado";
      }

      return new GroupHeaderListItem({
        title: `Nível ${oGroup.key}`,
        highlight: highlight,
        count: count,
        upperCase: false,
        selected: true
      });
    },

    checkLastStatusApproval: function (newStatus, context) {

      if (newStatus === "R") {
        this.updateStatus({ Status: newStatus });
        return;
      }

      if (newStatus === "0") {

        const workflowStatus = this.getModel("workflowStatus").getProperty("/");

        if (workflowStatus[workflowStatus.length - 1].Level === context.Level)
          this.updateStatus({ Status: newStatus });
      }

    },

    approveRejectTask: function (oEvent, action) {

      const context = oEvent.getSource().getBindingContext("workflowStatus").getObject();
      let approveData = {};

      Object.assign(approveData, {
        Profile: context.Profile,
        Instance: this.getView().byId("idInputPeriodo").getSelectedKey().trim(),
        Item: context.Item,
        Level: context.Level,
        Status: "",
        Reason: context.Reason
      });

      const executeApproval = (newStatus) => {
        this._oDialogApprovals.setBusy(true);

        this.getView().getModel().callFunction("/approve_reject_task", {
          method: "POST",
          urlParameters: approveData,
          success: function (oData, response) {
            this._oDialogApprovals.setBusy(false);
            this.onApprovalskDialogClose();
            sap.m.MessageBox.success("Status alterado com sucesso");
            this.checkLastStatusApproval(newStatus, context);
          }.bind(this),
          error: function (oError) {
            this._oDialogApprovals.setBusy(false);
            sap.m.MessageBox.error("Erro ao alterar status da tarefa");
          }.bind(this)
        });
      }

      if (action === "approve") {
        MessageBox.warning(`Tem certeza que deseja aprovar a tarefa "${this._descAtividadeAtual}"?`, {
          actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
          emphasizedAction: MessageBox.Action.OK,
          onClose: function (sAction) {

            if (sAction !== MessageBox.Action.OK) return;

            approveData.Status = "A";
            executeApproval("0");

          }
        });
      }
      else {

        if (!this.oRejectDialog) {
          this.oRejectDialog = new sap.m.Dialog({
            title: "Motivo da Rejeição",
            content: [
              new sap.m.Label({ Text: "Motivo:", labelFor: "idInputReject" }),
              new sap.m.Input({ id: "idInputReject", maxLength: 128, value: "{workflowStatus>Reason}" })
            ],
            beginButton: new sap.m.Button({
              type: "Emphasized",
              text: "Rejeitar",
              press: function () {
                const newContext = oEvent.getSource().getBindingContext("workflowStatus").getObject();
                approveData.Status = "R";
                approveData.Reason = newContext.Reason;
                executeApproval("R");
                this.oRejectDialog.close();
              }.bind(this)
            }),
            endButton: new sap.m.Button({
              text: "Cancelar",
              press: function () {
                this.oRejectDialog.close();
              }.bind(this)
            })
          }).addStyleClass("sapUiContentPadding");

          // to get access to the controller's model
          this.getView().addDependent(this.oRejectDialog);
        }

        this.oRejectDialog.setBindingContext(oEvent.getSource().getBindingContext("workflowStatus"), "workflowStatus");
        this.oRejectDialog.open();
      }
    },

    onPressApprovalsHistory: function () {

      this.getWorkflowHistoryData();

      Fragment.load({
        id: this.getView().getId(),
        name: "FechamentoContabil.view.fragments.ApprovalsHistory",
        controller: this
      }).then(function (oDialog) {
        this._oDialogApprovalsHistory = oDialog;
        this.getView().addDependent(this._oDialogApprovalsHistory);
        oDialog.setBusy(true);
        oDialog.setBusyIndicatorDelay(0);
        oDialog.open();
      }.bind(this));

    },

    onApprovalsHistorykDialogClose: function () {
      if (this._oDialogApprovalsHistory) {
        this._oDialogApprovalsHistory.close();
        this._oDialogApprovalsHistory.destroy();
        this._oDialogApprovalsHistory = undefined;
      }
    },

    getWorkflowHistoryData: function () {
      const filters = [];

      const createFilter = (path, value) => {
        return new sap.ui.model.Filter(path, sap.ui.model.FilterOperator.EQ, value);
      }

      filters.push(createFilter("Profile", this.getView().byId("idInputModelo").getSelectedItem().getText().trim()));
      filters.push(createFilter("Instance", parseInt(this.getView().byId("idInputPeriodo").getSelectedKey())));
      filters.push(createFilter("Item", this._noAtual));

      this.getModel().read(`/v2_workflow_status`, {
        filters: filters,
        success: function (oData, oResponse) {
          this.createModel(oResponse.data.results, "workflowStatusHistory");
          this._oDialogApprovalsHistory.setBusy(false);
        }.bind(this)
      });
    },

    onShowDetailHistory: function (oEvent) {

      const bindingContext = oEvent.getSource().getBindingContext("workflowStatusHistory");

      Fragment.load({
        id: this.getView().getId(),
        name: "FechamentoContabil.view.fragments.ApprovalsHistoryDetail",
        controller: this
      }).then(function (oDialog) {
        oDialog.setBindingContext(bindingContext, "workflowStatusHistory");
        this._oDialogApprovalsHistoryDetail = oDialog;
        this.getView().addDependent(this._oDialogApprovalsHistoryDetail);
        oDialog.open();
      }.bind(this));
    },

    onApprovalsHistoryDetailDialogClose: function () {
      if (this._oDialogApprovalsHistoryDetail) {
        this._oDialogApprovalsHistoryDetail.close();
        this._oDialogApprovalsHistoryDetail.destroy();
        this._oDialogApprovalsHistoryDetail = undefined;
      }
    },

    onPressTaskLogHistory: function () {

      this.getTaskLogHistoryData();

      Fragment.load({
        id: this.getView().getId(),
        name: "FechamentoContabil.view.fragments.TaskLogHistory",
        controller: this
      }).then(function (oDialog) {
        this._oDialogTaskLogHistory = oDialog;
        this.getView().addDependent(this._oDialogTaskLogHistory);
        oDialog.setBusy(true);
        oDialog.setBusyIndicatorDelay(0);
        oDialog.open();
      }.bind(this));

    },

    onTaskLogHistorykDialogClose: function () {
      if (this._oDialogTaskLogHistory) {
        this._oDialogTaskLogHistory.close();
        this._oDialogTaskLogHistory.destroy();
        this._oDialogTaskLogHistory = undefined;
      }
    },

    getTaskLogHistoryData: function () {
      const filters = [];

      const createFilter = (path, value) => {
        return new sap.ui.model.Filter(path, sap.ui.model.FilterOperator.EQ, value);
      }

      filters.push(createFilter("Profile", this.getView().byId("idInputModelo").getSelectedItem().getText().trim()));
      filters.push(createFilter("Instance", parseInt(this.getView().byId("idInputPeriodo").getSelectedKey())));
      filters.push(createFilter("Item", this._noAtual));

      this.getModel().read(`/v2_historico_tarefas`, {
        filters: filters,
        success: function (oData, oResponse) {
          this.createModel(oResponse.data.results, "taskLogHistory");
          this._oDialogTaskLogHistory.setBusy(false);
        }.bind(this)
      });
    },

    displayLongReason: function (oEvent, text) {
      if (!this._longReasonDialog) {
        this._longReasonDialog = new sap.m.Dialog({
          title: 'Justificativa',
          content: new sap.m.Text({ text: text }),
          beginButton: new sap.m.Button({
            text: 'Fechar',
            press: function () {
              this.onLongReasonDialogClose();
            }.bind(this)
          })
        }).addStyleClass("sapUiContentPadding");

        //to get access to the global model
        this.getView().addDependent(this._longReasonDialog);
      }

      this._longReasonDialog.open();
    },

    onLongReasonDialogClose: function () {
      if (this._longReasonDialog) {
        this._longReasonDialog.close();
        this._longReasonDialog.destroy();
        this._longReasonDialog = undefined;
      }
    },

    openLateTasksPopup: function (oEvent) {
      if (!this._oDialogLateTasksPopup) {
        this._oDialogLateTasksPopup = sap.ui.xmlfragment("FechamentoContabil.view.fragments.LateTasks", this);
        this.getView().addDependent(this._oDialogLateTasksPopup);
        if (sap.ui.Device.system.phone) {
          this._oDialogLateTasksPopup.setContentWidth("100%");
        }
      }

      this._oDialogLateTasksPopup.open();
    },

    onCloseDialogLateTasks: function () {
      if (this._oDialogLateTasksPopup) {
        this._oDialogLateTasksPopup.close();
        this._oDialogLateTasksPopup.destroy();
        this._oDialogLateTasksPopup = undefined;
      }
    },

    

  });
});
