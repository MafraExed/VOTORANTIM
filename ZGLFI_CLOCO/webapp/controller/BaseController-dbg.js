/*global history*/
sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History", "../model/formatter", "sap/ui/comp/valuehelpdialog/ValueHelpDialog", "sap/m/MessageBox", "sap/m/Button", "sap/m/Dialog", "sap/ui/model/json/JSONModel", "sap/ui/core/Fragment", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"], function (Controller, History, formatter, ValueHelpDialog, MessageBox, Button, Dialog, JSONModel, Fragment, Filter, FilterOperator) {
  "use strict";

  var init = null;

  var key = {
    Profile: "",
    Instance: "",
    NoAtual: "",
  };

  this._noAtual = null;
  this._iconStatus = null;
  this._iconAnexo = null;

  var expandDadosIniciaisMonitor = "ToPlanos,ToPlanoSelecionado,ToPeriodos,ToHierarquiaPastas,ToTop5TarefasAtrasadas,ToFluxosGerais";
  var expandAtualizaDadosMonitor = "ToPeriodos,ToPlanoSelecionado,ToHierarquiaPastas,ToTop5TarefasAtrasadas";
  var expandAtualizaPeriodosMonitor = "ToPeriodos,ToPlanoSelecionado,ToHierarquiaPastas,ToTop5TarefasAtrasadas,ToFluxosGerais";

  var expandDadosIniciaisAtividades = "ToPlanos,ToPlanoSelecionado,ToPeriodos,ToHierarquiaPastas,ToTarefas";
  var expandAtualizaDadosAtividades = "ToPlanoSelecionado,ToPeriodos,ToHierarquiaPastas,ToTarefas";

  var expandDadosIniciaisGantt = "ToPlanos,ToPlanoSelecionado,ToPeriodos,ToHierarquiaPastas,ToHierarquiaGantt";
  var expandAtualizaDadosGantt = "ToPlanoSelecionado,ToPeriodos,ToHierarquiaPastas,ToHierarquiaGantt";

  /*--> Início alteração - Rodrigo Cano - Iteam */
  this.firstValidNodeId = {};
  /*<-- Fim alteração - Rodrigo Cano - Iteam */

  return Controller.extend("FechamentoContabil.controller.BaseController", {
    /**
     * Convenience method for accessing the router in every controller of the application.
     * @public
     * @returns {sap.ui.core.routing.Router} the router for this component
     */
    formatter: formatter,

    massBatchSize: 30,

    getRouter: function () {
      return this.getOwnerComponent().getRouter();
    },

    /**
     * Convenience method for getting the view model by name in every controller of the application.
     * @public
     * @param {string} sName the model name
     * @returns {sap.ui.model.Model} the model instance
     */
    getModel: function (sName) {
      return this.getView().getModel(sName);
    },

    /**
     * Convenience method for setting the view model in every controller of the application.
     * @public
     * @param {sap.ui.model.Model} oModel the model instance
     * @param {string} sName the model name
     * @returns {sap.ui.mvc.View} the view instance
     */
    setModel: function (oModel, sName) {
      return this.getView().setModel(oModel, sName);
    },

    /**
     * Convenience method for getting the resource bundle.
     * @public
     * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
     */
    getResourceBundle: function () {
      return this.getOwnerComponent().getModel("i18n").getResourceBundle();
    },

    /**
     * Event handler for navigating back.
     * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
     * If not, it will replace the current entry of the browser history with the master route.
     * @public
     */
    onNavBack: function () { },

    attachPatternMatched: function (route) {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute(route).attachPatternMatched(this._onObjectMatched, this);
    },

    getPreselectedTasks: function (oEvent) {
      const urlArguments = oEvent.getParameter("arguments");
      const currentUrl = window.location.href;

      if (urlArguments.profile) {
        const selectedTasks = {
          profile: urlArguments.profile,
          instance: urlArguments.instance,
          tasks: urlArguments.tasks
        }

        // this.getView().getModel("preSelectedTasks").setProperty("/preSelectedTasks", true);
        // this.getView().getModel("preSelectedTasks").setProperty("/taskDetails", taskDetails);

        window.history.pushState('', '', currentUrl.substring(0, currentUrl.indexOf("/tasks")) + "/atv");
        return selectedTasks;
      }
      // else this.getView().getModel("preSelectedTasks").setProperty("/preSelectedTasks", false);
    },

    openFilterAtividades: function () {
      if (!this._ofilterAtividades) {

        Fragment.load({
          id: this.getView().getId(),
          name: "FechamentoContabil.view.fragments.filterAtividades",
          controller: this,
        }).then(function (oDialog) {
          this._ofilterAtividades = oDialog;
          this.getView().addDependent(oDialog);
          if (this._userInfo)
            Fragment.byId(this.getView().getId(), "fRespExec").setValue(this._userInfo.SapUserId);
          else this.getUserInfo((userInfo) => Fragment.byId(this.getView().getId(), "fRespExec").setValue(userInfo.SapUserId));
          // const filterBar = Fragment.byId(this.getView().getId(), "filterbar_atividades");
          // if (filterBar)
          //   filterBar.variantsInitialized();
          oDialog.open();
        }.bind(this));
      } else {
        this._ofilterAtividades.open();
      }
    },

    closeFilterAtividades: function () {
      if (this._ofilterAtividades) {
        this._ofilterAtividades.close();
        // this._ofilterAtividades.destroy();
        // this._ofilterAtividades = undefined;
      }
    },

    getUserInfo: function (callback) {
      const oComponent = this.getOwnerComponent();
      const oModel = oComponent.getModel();
      oModel.read("/v2_userInfo('')", {
        success: callback
      });
    },

    showUserSearchHelp: function (oEvent) {
      const source = oEvent.getSource();

      this.createModel(
        {
          cols: [
            {
              label: "Nome",
              template: "name",
              width: "40%",
            },
            {
              label: "E-mail",
              template: "email",
              width: "40%",
            },
            {
              label: "Usuário SAP",
              template: "user",
              width: "20%",
            },
          ],
        },
        "columnsSearchUsers"
      );

      let fncCallback;
      if (source.getId().indexOf("fRespExec") !== -1) fncCallback = this.onSHPressUserRespExec.bind(this);
      else fncCallback = this.onSHPressUserResp.bind(this);
      const dataPath = "/v2_help_user";
      const title = this.getView().getModel("i18n").getResourceBundle().getText("taskSelectUser");
      const fieldsSearch = ["email", "user", "name"];
      this.onValueHelpRequested(dataPath, "columnsSearchUsers", title, fieldsSearch, fncCallback, false);
      // return;
      // }

    },

    onSHPressUserRespExec: function (oEvent) {
      const table = this._oValueHelpDialog.getTable();
      const selectedIndex = table.getSelectedIndex();
      const object = table.getContextByIndex(selectedIndex).getObject();
      Fragment.byId(this.getView().getId(), "fRespExec").setValue(object.user);
      this._oValueHelpDialog.close();
    },

    onSHPressUserResp: function (oEvent) {
      const table = this._oValueHelpDialog.getTable();
      const selectedIndex = table.getSelectedIndex();
      const object = table.getContextByIndex(selectedIndex).getObject();
      Fragment.byId(this.getView().getId(), "fResp").setValue(object.user);
      this._oValueHelpDialog.close();
    },

    onValueHelpRequested: function (dataPath, columns, title, fieldsSearch, functionOk, multiSelect) {
      // var aCols = this.oColModel.getData().cols;
      this._oBasicSearchField = new sap.m.SearchField();
      this._fieldsSearch = fieldsSearch;

      Fragment.load({
        name: "FechamentoContabil.view.fragments.SearchHelp",
        controller: this,
      }).then(
        function (oValueHelpDialog) {
          this._oValueHelpDialog = oValueHelpDialog;
          this.getView().addDependent(this._oValueHelpDialog);

          var oFilterBar = this._oValueHelpDialog.getFilterBar();
          oFilterBar.setFilterBarExpanded(false);
          oFilterBar.setBasicSearch(this._oBasicSearchField);

          this._oBasicSearchField.onsapenter = function (e) {
            var oFilterBar = this._oValueHelpDialog.getFilterBar();
            oFilterBar.search();
          }.bind(this);

          this._oValueHelpDialog.setTitle(title);
          this._oValueHelpDialog.setSupportMultiselect(multiSelect);

          this._oValueHelpDialog.attachOk(functionOk);

          this._oValueHelpDialog.getTableAsync().then(
            function (oTable) {
              oTable.setModel(this.getModel());
              oTable.setModel(this.getModel(columns), "columns");

              if (oTable.bindRows) {
                oTable.bindAggregation("rows", dataPath);
              }

              if (oTable.bindItems) {
                oTable.bindAggregation("items", dataPath, function () {
                  return new ColumnListItem({
                    cells: this.getModel("columnsSearchUsers").getProperty("/").cols.map(function (column) {
                      return new Label({ text: "{" + column.template + "}" });
                    }),
                  });
                }.bind(this));
              }
              this._oValueHelpDialog.update();
            }.bind(this)
          );

          this._oValueHelpDialog.open();
        }.bind(this)
      );
    },

    onFilterBarSearch: function (oEvent) {
      var sSearchQuery = this._oBasicSearchField.getValue(),
        aSelectionSet = oEvent.getParameter("selectionSet");
      var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
        if (oControl.getValue()) {
          aResult.push(
            new Filter({
              path: oControl.getName(),
              operator: FilterOperator.Contains,
              value1: oControl.getValue(),
            })
          );
        }

        return aResult;
      }, []);

      for (const fieldSearch of this._fieldsSearch) {
        aFilters.push(
          new Filter({
            filters: [new Filter({ path: fieldSearch, operator: FilterOperator.Contains, value1: sSearchQuery })],
            and: false,
          })
        );
      }

      this._filterTable(
        new Filter({
          filters: aFilters,
          and: true,
        })
      );
    },

    _filterTable: function (oFilter) {
      var oValueHelpDialog = this._oValueHelpDialog;

      oValueHelpDialog.getTableAsync().then(function (oTable) {
        if (oTable.bindRows) {
          oTable.getBinding("rows").filter(oFilter);
        }

        if (oTable.bindItems) {
          oTable.getBinding("items").filter(oFilter);
        }

        oValueHelpDialog.update();
      });
    },

    onValueHelpCancelPress: function () {
      this._oValueHelpDialog.close();
    },

    onValueHelpAfterClose: function () {
      this._oValueHelpDialog.destroy();
    },

    showDepartamentSearchHelp: function (departamentId) {

      const oView = this.getView();
      this._departamentId = departamentId;
      const profileSelected = Fragment.byId(this.getView().getId(), "fProfile").getSelectedKey();

      this._departamentDialog = Fragment.load({
        id: this.getView().getId(),
        name: "FechamentoContabil.view.fragments.DepartamentHelp",
        controller: this,
      }).then(
        function (oDialog) {
          oDialog.setModel(oView.getModel());
          oView.addDependent(oDialog);
          this.getView().byId("departamentTable").bindAggregation("rows", `/v2_departamentos(Profile='${profileSelected}',Departamento='')/toDepartamentos`);
          return oDialog;
        }.bind(this)
      );

      this._departamentDialog.then(
        function (oDialog) {
          oDialog.open();
        }.bind(this)
      );
    },

    onPressApplyDepartament: function (oEvent) {
      const table = this.getView().byId("departamentTable");
      const selectedContext = table.getContextByIndex(table.getSelectedIndex()).getObject();
      Fragment.byId(this.getView().getId(), "fDepartamento").setValue(selectedContext.Departamento);
      this.onCloseDepartamentDialog();
    },

    filterDepartament: function (oEvent) {
      const sQuery = oEvent.getParameter("query");
      this._oFilterDepartament = null;

      if (sQuery) {
        this._oFilterDepartament = new Filter([
          new Filter("Departamento", FilterOperator.Contains, sQuery)
        ], false);
      }

      this.byId("departamentTable").getBinding().filter(this._oFilterDepartament, "Application");
    },

    onCloseDepartamentDialog: function () {
      if (this._departamentDialog) {
        this._departamentDialog.then(function (oDialog) {
          oDialog.close();
          oDialog.destroy();
        }.bind(this));
      }
      this._departamentDialog = undefined;
    },

    getSettings: function (dialog) {
      const profile = Fragment.byId(this.getView().getId(), "fProfile").getSelectedKey();
      const instance = Fragment.byId(this.getView().getId(), "fInstance").getSelectedKey();
      this.getModel().read(`/v2_configurations(Profile='${profile}',Instance=${instance})`, {
        success: (odata) => {
          this.createModel(odata, "settings");
          if (odata.LateTasksPopup) {
            this.getMotivosAtraso();
          }
        }
      })
    },

    getMotivosAtraso: function () {
      const profile = Fragment.byId(this.getView().getId(), "fProfile").getSelectedKey();
      const instance = Fragment.byId(this.getView().getId(), "fInstance").getSelectedKey();
      this.getModel().read(`/v2_motivo_atrasos(Profile='${profile}',Instance=${instance},Seq=0)/toMotivosAtrasoTarefa`, {
        success: (odata) => {
          this.getView().getModel("motivosAtraso").setProperty("/motivos", odata.results);
        }
      })
    },

    _onObjectMatched: function (oEvent) {
      var parameters = oEvent.getParameters();

      if (parameters.name === "monitor") {
        this.getDadosECC("dadosIniciais", expandDadosIniciaisMonitor);
      }

      if (parameters.name === "Atividades" || parameters.name === "AtividadesMobile") {
        this.openFilterAtividades();
        // this.getDadosECC("dadosIniciais", expandDadosIniciaisAtividades);
      }
      if (parameters.name === "AtividadesSelecionadas") {
        const filter = new Filter([]);
        const selectedTasks = this.getPreselectedTasks(oEvent);

        filter.aFilters.push(this.createFilter("Profile", FilterOperator.EQ, selectedTasks.profile));
        filter.aFilters.push(this.createFilter("Instance", FilterOperator.EQ, selectedTasks.instance));

        if (selectedTasks.tasks.indexOf(",") === -1) {
          filter.aFilters.push(this.createFilter("Item", FilterOperator.EQ, selectedTasks.tasks));
        }
        else {
          const tasks = selectedTasks.tasks.split(",");
          for (const task of tasks) {
            filter.aFilters.push(this.createFilter("Item", FilterOperator.EQ, task));
          }
        }

        this.byId("btnShowOtherTasks").setVisible(true);
        this.getDadosECC("atualizaDados", expandAtualizaDadosAtividades, null, null, filter.aFilters);
      }
      if (parameters.name === "AtividadesAtrasadas") {
        this.getView().byId("idAtivdAtrasadas").setPressed(true);
        const urlArguments = oEvent.getParameter("arguments");
        key.Profile = urlArguments.profile;
        key.Instance = urlArguments.instance;
        this._atvdAtrasadas = true;
        this.getDadosECC("atualizaDados", expandDadosIniciaisAtividades);
      }
      if (parameters.name === "ganttView") {
        this.getDadosECC("dadosIniciais", expandDadosIniciaisGantt);
      }
    },

    getDadosECC: function (parametro, parExpand, notBusy, callback, filter) {
      var oModel = this.getOwnerComponent().getModel();
      var oDataURL;
      var expand = parExpand;
      var that = this;

      if (this._sync === undefined) {
        this._sync = true;
      }

      if (!notBusy) {
        this.getView().setBusy(true);
      }

      //  dadosIniciais -> qdo o model está vazio, faz a busca inicial no SAP
      if (parametro === "dadosIniciais") {
        oDataURL = "/DadosIniciais";
        //expand = "ToPlanos,ToPlanoSelecionado,ToPeriodos,ToHierarquiaPastas,ToTop5TarefasAtrasadas,ToFluxosGerais";
      }
      if (parametro === "atualizaDados") {
        oDataURL = "/DadosIniciais(Profile='" + key.Profile.trim() + "',Instance='" + key.Instance.trim() + "',NoAtual='" + key.NoAtual.trim() + "')";
        //expand = "ToPeriodos,ToPlanoSelecionado,ToHierarquiaPastas,ToTop5TarefasAtrasadas";
      }
      if (parametro === "atividadeAnexos") {
        oDataURL = "/ETS_MONITOR_GERAL(Modelo='" + key.Profile.trim() + "',Instance='" + key.Instance.trim() + "',Hierarquia='" + key.NoAtual.trim() + "')";
        //parameter = "fileNames";
        expand = "MonitorToFilenames";
      }
      if (parametro === "ExecutaTransacao") {
        oDataURL = "/Dependentes(Profile='" + key.Profile.trim() + "',Instance='" + key.Instance.trim() + "',NoAtual='" + key.NoAtual.trim() + "')";
        //parameter = "fileNames";
        expand = "ToDependentes";
      }

      // oModel.removeData();
      if (expand !== null)
        oModel.read(oDataURL, {
          filters: [filter],
          urlParameters: {
            $expand: expand,
          },
          method: "GET",
          success: function (data) {
            that.respostaECC(that, parametro, data, callback);
          },
          error: function () {
            sap.m.MessageToast.show("Erro na conexão com o ECC");
            that.getView().setBusy(false);
          },
        });
      else
        oModel.read(oDataURL, {
          method: "GET",
          success: function (data) {
            that.respostaECC(that, parametro, data, callback);
          },
          error: function () {
            sap.m.MessageToast.show("Erro na conexão com o ECC");
          },
        });
    },

    respostaECC: function (that, parameter, data, callback) {
      switch (parameter) {
        case "dadosIniciais":
          that.inicializaMonitor(that, data);
          // that.checaNovidades(that, data);
          if (this.getView().getViewName() === "FechamentoContabil.view.Atividades") this.checkFilters();
          break;
        case "atualizaDados":
          that.atualizaDados(that, data);
          if (this.getView().getViewName() === "FechamentoContabil.view.Atividades") {
            if (this._atvdAtrasadas) {
              const itemProfile = new sap.ui.core.Item({
                key: data.ToPlanoSelecionado.Profile,
                text: data.ToPlanoSelecionado.Profile
              })
              this.getView().byId("idInputModelo").addItem(itemProfile);
              this.getView().byId("idInputModelo").setSelectedKey(data.ToPlanoSelecionado.Profile);

              const itemPeriodo = new sap.ui.core.Item({
                key: data.ToPlanoSelecionado.Instance,
                text: data.ToPlanoSelecionado.Data
              })
              this.getView().byId("idInputPeriodo").addItem(itemPeriodo);
              this.getView().byId("idInputPeriodo").setSelectedKey(data.ToPlanoSelecionado.Instance);
            }
            // if (this.getView().getModel("preSelectedTasks").getProperty("/preSelectedTasks")) this.checkFilters();
          }
          break;
        case "atividadeAnexos":
          that.setFilenames(that, data.MonitorToFilenames);
          break;
        case "ExecutaTransacao":
          that.executaTransacao(that, data.ToDependentes.results);
          break;
      }
      that.getView().setBusy(false);

      //callback
      if (callback) {
        if (typeof callback.success === "function") {
          callback.success();
        }
      }
    },

    setDadosECC: function (parametro, data, isMany, index, lenght, tarefaAtual) {
      var oModel = this.getOwnerComponent().getModel();

      var oRequestData = {};
      var oDataURL;
      var that = this;

      if (!isMany) {
        if (this._noAtual) {
          key.NoAtual = this._noAtual;
        }
        if (this._iconStatus) {
          key.IconStatus = this._iconStatus;
        }
        if (this._iconAnexo) {
          key.iconAnexo = this._iconAnexo;
        }
      }

      oRequestData.Profile = key.Profile;
      oRequestData.Instance = key.Instance;

      if (parametro === "setNovidades") {
        oRequestData.Novidade = "X";
      }

      if (parametro === "setNovidades" || parametro === "setPersistenciaSelecao") {
        oDataURL = "/ETS_DADOS_USUARIO(Profile='" + key.Profile.trim() + "',Instance='" + key.Instance.trim() + "',Node='" + key.NoAtual.trim() + "')";
        oRequestData.Node = key[2];
        oRequestData.Parametro = parametro;
      }
      if (parametro === "setStatus") {
        oRequestData.Status = data.Status;
        oRequestData.Justificativa = data.Justificativa;
        oRequestData.JustificativaLonga = data.JustificativaLonga;
        oRequestData.Reprocessamento = data.Reprocessamento;
        oRequestData.TarefaAtrasada = data.TarefaAtrasada;
        oRequestData.CausadoPorPrecedente = data.CausadoPorPrecedente;

        oDataURL = "/ETS_DADOS_ITEM(Profile='" + key.Profile.trim() + "',Instance='" + key.Instance.trim() + "',Item='" + key.NoAtual.trim() + "')";

        oRequestData.Item = key.NoAtual;
        oRequestData.Parametro = parametro;
        this.getView().setBusy(true);
      }

      const sGroupId = new Date().getTime();
      const requestParams = {};
      requestParams.groupId = sGroupId;
      requestParams.changeSetId = Math.floor(Math.random() * 501) + Math.floor(Math.random() * 501) + Math.floor(Math.random() * 501);
      oModel.setDeferredGroups([sGroupId]);

      oModel.update(oDataURL, oRequestData, {
        // groupId: requestParams.groupId,
        changeSetId: requestParams.changeSetId,
        async: false,
        success: function (oData, response) {
          if (parametro === "setStatus") {
            //that.getDadosECC("atualizaDadosMonitor");
            if (response.headers.erro)
              if (!isMany) {
                that.showPopup(decodeURIComponent(response.headers.erro));
              } else {
                if (that._msgErro) {
                  that._msgErro = that._msgErro + "\n\n";
                }
                that._msgErro = that._msgErro + "Atividade nº " + tarefaAtual + ": " + decodeURIComponent(response.headers.erro);
              }
            else {
              that.updateStatus(data);

              if (!isMany) {
                sap.m.MessageToast.show("Status atualizado com sucesso");
                that.closeItemsDialog(that);
              } else {
                sap.ui.core.BusyIndicator.show(0);
              }
            }
          }

          if (isMany) {
            if (index >= lenght) {
              sap.ui.core.BusyIndicator.show(0);

              that.onPressSync({
                success: function () {
                  sap.ui.core.BusyIndicator.hide();
                  sap.m.MessageToast.show("Atualiação em massa concluída");
                },
              });

              if (that._msgErro) {
                sap.ui.core.BusyIndicator.hide();
                MessageBox.error(that._msgErro);
              }

              that.closeItemsDialog(that);
              that._aSelectedItems = [];
              that._aSelectedItemsProperties = [];
            }
            that.getView().setBusy(false);
          } else {
            that.getView().setBusy(false);
          }
        },
        error: function (oError) {
          that.getView().setBusy(false);
          sap.m.MessageToast.show("ERRO");
        },
      });
    },

    inicializaMonitor: function (that, data) {
      var that = this;
      key.NoAtual = data.results[0].NoAtual;

      if (data.results[0].ToPlanos.results.length > 0) {
        that.updateModel(that, "Planos", data.results[0].ToPlanos.results);
        if (data.results[0].ToPlanoSelecionado.Profile) {
          const itemProfile = new sap.ui.core.Item({
            key: data.results[0].ToPlanoSelecionado.Profile,
            text: data.results[0].ToPlanoSelecionado.Profile
          })
          this.getView().byId("idInputModelo").addItem(itemProfile);
          this.getView().byId("idInputModelo").setSelectedKey(data.results[0].ToPlanoSelecionado.Profile);
        }
        else
          this.getView().byId("idInputModelo").setSelectedIndex(0);
      }
      if (data.results[0].ToPeriodos.results.length > 0) {
        that.updateModel(that, "Periodos", data.results[0].ToPeriodos.results);
        if (data.results[0].ToPlanoSelecionado.Profile) {
          this.getView().byId("idInputPeriodo").setSelectedKey(data.results[0].ToPlanoSelecionado.Instance);
          // const indexSelectedInstance = data.results[0].ToPeriodos.results.map(e => e.Instance).indexOf(data.results[0].ToPlanoSelecionado.Instance);
          // this.getView().byId("idInputPeriodo").setSelectedIndex(indexSelectedInstance);
        }
        else
          this.getView().byId("idInputPeriodo").setSelectedIndex(0);
      }
      if (data.results[0].ToPlanoSelecionado !== undefined) {
        that.updateModel(that, "PlanoSelecionado", data.results[0].ToPlanoSelecionado);
        if (data.results[0].ToPlanoSelecionado.GraficoAvancoPlan) {
          that.atualizaGraficosAvanco(data.results[0]);
          that.atualizaGraficoConcluidoPlanejado(data.results[0]);
          //that.setLogo(that, data.results[0]);
        }
        that.setPath(that, data.results[0].ToPlanoSelecionado);
      }
      if (data.results[0].ToHierarquiaPastas.results.length > 0) {
        var nodesPastas = that.montaTree(data.results[0].ToHierarquiaPastas.results);
        /*--> Início alteração - Rodrigo Cano - Iteam - 03/09/2019 */
        that.setFirstValidNode(that, that.firstValidNodeId);
        /*<-- Fim alteração - Rodrigo Cano - Iteam - 03/09/2019 */
        that.updateModel(that, "HierarquiaPastas", nodesPastas);
      }
      if (data.results[0].ToTop5TarefasAtrasadas.results) {
        that.setTOP5(data.results[0].ToTop5TarefasAtrasadas);
      }
      if (data.results[0].ToFluxosGerais.results)
        if (data.results[0].ToFluxosGerais.results.length > 0) {
          that.setFluxoProcesso(that, data.results[0].ToFluxosGerais.results);
          that.setPath(that, data.results[0].ToFluxosGerais.results[0], true);
        }
      if (data.results[0].ToTarefas.results)
        if (data.results[0].ToTarefas.results.length > 0) {
          that.updateModel(that, "Tarefas", data.results[0].ToTarefas.results);
        }
        else that.updateModel(that, "Tarefas", []);
      if (data.results[0].ToHierarquiaGantt.results)
        if (data.results[0].ToHierarquiaGantt.results.length > 0) {
          that.updateGantt(that, data.results[0]);
        }
    },

    setLogo: function (that, data) {
      if (this.getView().getViewName() === "FechamentoContabil.view.Monitor") {
        var logo = "CBA.png";

        if (!sap.ui.Device.system.phone) {
          var imagePath = $.sap.getModulePath("FechamentoContabil", "/LogoEmpresas/");
          if (data.ToPlanoSelecionado.Empresa.charAt(0) === "B") logo = "votorantim-energia-logo.png";
          this.getView()
            .byId("idLogo")
            .setSrc(imagePath + logo);
        }
      }
    },

    atualizaDados: function (that, data) {
      key.NoAtual = data.NoAtual;

      if (data.ToPeriodos.results)
        if (data.ToPeriodos.results.length > 0) {
          that.updateModel(that, "Periodos", data.ToPeriodos.results);
          this.getView().byId("idInputPeriodo").setSelectedIndex(0);
        }
      if (data.ToPlanoSelecionado.Caminho) {
        that.updateModel(that, "PlanoSelecionado", data.ToPlanoSelecionado);
        if (data.ToPlanoSelecionado.GraficoAvancoPlan !== "") {
          that.atualizaGraficosAvanco(data);
          that.atualizaGraficoConcluidoPlanejado(data);
          //that.setLogo(that, data);
        }
        that.setPath(that, data.ToPlanoSelecionado);
      }
      if (data.ToHierarquiaPastas.results)
        if (data.ToHierarquiaPastas.results.length > 0) {
          var nodesPastas = that.montaTree(data.ToHierarquiaPastas.results);
          /*--> Início alteração - Rodrigo Cano - Iteam - 03/09/2019 */
          that.setFirstValidNode(that, that.firstValidNodeId);
          /*<-- Fim alteração - Rodrigo Cano - Iteam - 03/09/2019 */
          that.updateModel(that, "HierarquiaPastas", nodesPastas);
        }
      if (data.ToTop5TarefasAtrasadas.results) {
        that.setTOP5(data.ToTop5TarefasAtrasadas);
      }
      if (data.ToFluxosGerais.results)
        if (data.ToFluxosGerais.results.length > 0) {
          try {
            that.setFluxoProcesso(that, data.ToFluxosGerais.results);
            that.setPath(that, data.ToFluxosGerais.results[0], true);
          } catch (e) {
            if (that._sync) {
              that._sync = false;
              that.onPressSync();
            }
          }
        }
      if (data.ToTarefas.results)
        if (data.ToTarefas.results.length > 0) {
          if (this.getView().getViewName() === "FechamentoContabil.view.AtividadesMobile") var modelTarefas = this.getView().byId("listMobile").getModel("Tarefas");
          else var modelTarefas = this.getView().byId("idTableAtividades").getModel("Tarefas");
          if (modelTarefas !== undefined) {
            modelTarefas.oData = data.ToTarefas.results;
            modelTarefas.refresh(true);
          } else that.updateModel(that, "Tarefas", data.ToTarefas.results);
        }
      if (data.ToHierarquiaGantt.results)
        if (data.ToHierarquiaGantt.results.length > 0) {
          that.updateGantt(that, data);
        }

      if (this.getView().byId("idInputModelo").getItems().length === 0) {
        const itemProfile = new sap.ui.core.Item({
          key: data.ToPlanoSelecionado.Profile,
          text: data.ToPlanoSelecionado.Profile
        })

        this.getView().byId("idInputModelo").addItem(itemProfile);
        this.getView().byId("idInputModelo").setSelectedKey(data.ToPlanoSelecionado.Profile);

        const itemPeriodo = new sap.ui.core.Item({
          key: data.ToPlanoSelecionado.Instance,
          text: data.ToPlanoSelecionado.Data
        })

        this.getView().byId("idInputPeriodo").addItem(itemPeriodo);
        this.getView().byId("idInputPeriodo").setSelectedKey(data.ToPlanoSelecionado.Instance);
      }

    },

    /*		atualizaFluxoGeral: function(that,data){
          that.setFluxoProcesso(that,data.ToFluxosGerais.results);
        },*/

    updateModel: function (that, name, data) {
      var oModel = new sap.ui.model.json.JSONModel(data);
      that.getView().setModel(oModel, name);
    },

    onNovoModelo: function (oEvent) {
      if (oEvent.getSource().getSelectedItem().getText() === this.getView().getModel("PlanoSelecionado").oData.Profile) return;

      key.Profile = oEvent.getSource().getSelectedItem().getText();
      key.Instance = "";
      key.NoAtual = "";

      if (this.getView().getViewName() === "FechamentoContabil.view.Monitor" || this.getView().getViewName() === "FechamentoContabil.view.MonitorMobile") this.getDadosECC("atualizaDados", expandAtualizaPeriodosMonitor);
      if (this.getView().getViewName() === "FechamentoContabil.view.Atividades" || this.getView().getViewName() === "FechamentoContabil.view.AtividadesMobile") this.getDadosECC("atualizaDados", expandAtualizaDadosAtividades);
      if (this.getView().getViewName() === "FechamentoContabil.view.Gantt") this.getDadosECC("atualizaDados", expandAtualizaDadosGantt);
    },

    onNovoPeriodo: function (oEvent) {
      if (oEvent.getSource().getSelectedItem().getText() === this.getView().getModel("Periodos").oData[0].Profile) return;
      key.Profile = this.getView().byId("idInputModelo").getSelectedItem().getText();
      key.Instance = this.getView().byId("idInputPeriodo").getSelectedItem().getKey();
      key.NoAtual = "";

      if (this.getView().getViewName() === "FechamentoContabil.view.Monitor" || this.getView().getViewName() === "FechamentoContabil.view.MonitorMobile") this.getDadosECC("atualizaDados", expandAtualizaPeriodosMonitor);
      if (this.getView().getViewName() === "FechamentoContabil.view.Atividades" || this.getView().getViewName() === "FechamentoContabil.view.AtividadesMobile") this.getDadosECC("atualizaDados", expandAtualizaDadosAtividades);
      if (this.getView().getViewName() === "FechamentoContabil.view.Gantt") this.getDadosECC("atualizaDados", expandAtualizaDadosGantt);
    },

    atualizaGraficosAvanco: function (data) {
      if (data.ToPlanoSelecionado.GraficoAvanco !== "" && (this.getView().getViewName() === "FechamentoContabil.view.Monitor" || this.getView().getViewName() === "FechamentoContabil.view.MonitorMobile")) {
        var percAvanco = parseFloat(data.ToPlanoSelecionado.GraficoAvanco);
        var percAvancoPlan = parseFloat(data.ToPlanoSelecionado.GraficoAvancoPlan);
        this.carregaGrafico(percAvanco, "avanco");
        this.carregaGrafico(percAvancoPlan, "plan");

        /*var grafico = this.getView().byId("idAvancoPlan");
        grafico.setPercentage(parseFloat(data.ToPlanoSelecionado.GraficoAvancoPlan));
        grafico.rerender();
        grafico = this.getView().byId("idAvanco");
        grafico.setPercentage(parseFloat(data.ToPlanoSelecionado.GraficoAvanco));
        grafico.rerender();*/
      }
    },

    atualizaGraficoConcluidoPlanejado: function (data) {
      if (this.getView().getViewName() === "FechamentoContabil.view.Monitor" || this.getView().getViewName() === "FechamentoContabil.view.MonitorMobile") {
        var idAtividadePrevPlan = this.getView().byId("idAtividadePrevPlan");
        idAtividadePrevPlan.setValue1(data.ToPlanoSelecionado.GraficoAtvdConcluida);
        idAtividadePrevPlan.setValue2(data.ToPlanoSelecionado.GraficoAtvdPrevista);
        idAtividadePrevPlan.rerender();
      }
    },

    montaTree: function (nodesIn) {
      var nodes = []; //'deep' object structure
      var nodeMap = {}; //'map', each node is an attribute

      if (nodesIn) {
        var nodeOut;
        var parentId;

        for (var i = 0; i < nodesIn.length; i++) {
          var nodeIn = nodesIn[i];
          nodeOut = {
            NodeID: nodeIn.NodeID,
            Description: nodeIn.Description,
            children: [],
          };

          parentId = nodeIn.ParentNodeID;

          if (parentId !== "null") {
            var parent = nodeMap[nodeIn.ParentNodeID];

            if (parent) {
              parent.children.push(nodeOut);
            }
          } else {
            //there is no parent, must be top level
            nodes.push(nodeOut);
          }

          //add the node to the node map, which is a simple 1-level list of all nodes
          nodeMap[nodeOut.NodeID] = nodeOut;
        }
      }

      /*--> Início alteração - Rodrigo Cano - Iteam - 03/09/2019 */
      if (this.getView().getViewName() !== "FechamentoContabil.view.Atividades" && this.getView().getViewName() !== "FechamentoContabil.view.AtividadesMobile") {
        this.firstValidNodeId = this.getFirstValidNode(this, nodes[0], 0);
      }

      /*<-- Fim alteração - Rodrigo Cano - Iteam - 03/09/2019 */

      return nodes;
    },

    /*--> Início alteração - Rodrigo Cano - Iteam - 03/09/2019 */

    //Retorna o próximo nó que tenha mais de um nó filho
    getFirstValidNode: function (that, node, n) {
      if (node.children.length > 1) {
        var firstNode = {
          Level: n,
          ID: node.NodeID,
        };

        return firstNode;
      } else if (node.children.length) {
        return that.getFirstValidNode(that, node.children[0], n + 1);
      }

      return undefined;
    },

    setFirstValidNode: function (that, node) {
      if (this.getView().getViewName() !== "FechamentoContabil.view.Atividades" && this.getView().getViewName() !== "FechamentoContabil.view.AtividadesMobile") {
        if (node) {
          key.Profile = this.getView().byId("idInputModelo").getSelectedItem().getText();
          key.Instance = this.getView().byId("idInputPeriodo").getSelectedItem().getKey();
          key.NoAtual = node.ID;

          that.getDadosECC("atualizaDados", "ToFluxosGerais");
        }
      }
    },

    /*<-- Fim alteração - Rodrigo Cano - Iteam */

    onTreeClick: function (oEvent) {
      var items = oEvent.getParameters().cellControl.getItems();
      key.Profile = this.getView().byId("idInputModelo").getSelectedItem().getText();
      key.Instance = this.getView().byId("idInputPeriodo").getSelectedItem().getKey();
      key.NoAtual = items[1].getText();
      if (this.getView().getViewName() === "FechamentoContabil.view.Monitor" || this.getView().getViewName() === "FechamentoContabil.view.MonitorMobile") this.getDadosECC("atualizaDados", expandAtualizaDadosMonitor);
      if (this.getView().getViewName() === "FechamentoContabil.view.Atividades") this.getDadosECC("atualizaDados", expandAtualizaDadosAtividades);
      if (this.getView().getViewName() === "FechamentoContabil.view.Gantt") this.getDadosECC("atualizaDados", expandAtualizaDadosGantt);
    },

    onTreeClickFluxoGeral: function (oEvent) {
      var items = oEvent.getParameters().cellControl.getItems();
      key.Profile = this.getView().byId("idInputModelo").getSelectedItem().getText();
      key.Instance = this.getView().byId("idInputPeriodo").getSelectedItem().getKey();
      key.NoAtual = items[1].getText();
      this.getDadosECC("atualizaDados", "ToFluxosGerais");
    },

    setPath: function (that, data, fluxoGeral) {
      var hboxPath;

      if (fluxoGeral) hboxPath = this.getView().byId("idHboxPathFluxoGeral");
      else hboxPath = this.getView().byId("idHboxPath");

      var length = hboxPath.getItems().length - 1;

      if (length > 0) {
        do {
          hboxPath.removeItem(length);
          length--;
        } while (length > 0);
      }

      var result = data.Caminho.split("##");
      length = result.length - 1;

      result.forEach(function (nodeText) {
        var labelText = new sap.m.Label();
        labelText.setText(nodeText);

        let leaf = false;

        if (length > 0) {
          labelText.setTooltip(length.toString());
          if (!sap.ui.Device.system.phone) labelText.addStyleClass("label__path");
          else labelText.addStyleClass("label__path__mobile");
          leaf = true;
        } else {
          if (!sap.ui.Device.system.phone) labelText.addStyleClass("label__path__sel");
          else labelText.addStyleClass("label__path__sel__mobile");
          if (fluxoGeral) labelText.setTooltip(data.NoPai);
          else labelText.setTooltip(key.NoAtual);
        }

        labelText.attachBrowserEvent("click", function () {
          that.onPressPath(labelText, fluxoGeral);
        });

        hboxPath.addItem(labelText);

        if (leaf) hboxPath.addItem(new sap.m.Label({ text: "/" }));

        length--;
      });
    },

    showPopup: function (text) {
      var that = this;
      var dialog;

      dialog = new sap.m.Dialog({
        showHeader: false,
        content: new sap.m.Text({
          text: text,
        }).addStyleClass("dialog__text"),
        beginButton: new sap.m.Button({
          text: "Fechar",
          press: function () {
            dialog.close();
          }.bind(that),
        }),
      });

      //to get access to the global model
      that.getView().addDependent(dialog);

      dialog.open();
    },

    onPressPath: function (labelPath, fluxoGeral) {
      var qtdeNo = labelPath.getTooltip();
      var hboxPath = labelPath.getParent();
      var items = hboxPath.getItems();
      var label = items[hboxPath.getItems().length - 1];

      key.NoAtual = label.getTooltip() + "-" + qtdeNo;
      key.Profile = this.getView().byId("idInputModelo").getSelectedItem().getText();
      key.Instance = this.getView().byId("idInputPeriodo").getSelectedItem().getKey();

      if (this.getView().getViewName() === "FechamentoContabil.view.Monitor")
        if (fluxoGeral) this.getDadosECC("atualizaDados", "ToFluxosGerais");
        else this.getDadosECC("atualizaDados", expandAtualizaDadosMonitor);

      if (this.getView().getViewName() === "FechamentoContabil.view.Atividades") this.getDadosECC("atualizaDados", expandAtualizaDadosAtividades);

      if (this.getView().getViewName() === "FechamentoContabil.view.Gantt") this.getDadosECC("atualizaDados", expandAtualizaDadosGantt);
    },

    onPressSync: function (callback) {
      var hboxPath = this.getView().byId("idHboxPath");
      var items = hboxPath.getItems();

      key.NoAtual = items[items.length - 1].getTooltip();
      key.Profile = this.getView().byId("idInputModelo").getSelectedItem().getText();
      key.Instance = this.getView().byId("idInputPeriodo").getSelectedItem().getKey();

      if (this.getView().getViewName() === "FechamentoContabil.view.Atividades") {
        const filters = this.getAtividadesFilters();
        this.getDadosECC("atualizaDados", expandAtualizaDadosAtividades, false, callback, filters.aFilters);
      }

      if (this.getView().getViewName() === "FechamentoContabil.view.Gantt") this.getDadosECC("atualizaDados", expandAtualizaDadosGantt, false, callback);

      if (this.getView().getViewName() === "FechamentoContabil.view.Monitor") this.getDadosECC("atualizaDados", expandAtualizaDadosMonitor, false, callback);
    },

    getSelectedRowTask: function () {
      const tarefas = this.getModel("Tarefas").getProperty("/");

      for (const tarefa of tarefas) {
        if (tarefa.NO_ATIVIDADE === this._noAtual) {
          return tarefa;
        }
      }
    },

    getCurrentTask: function (sourceControl) {
      let control = sourceControl.getParent();

      while (control.getMetadata()._sClassName !== "sap.ui.table.Row") {
        control = control.getParent();
      }
      return control.getBindingContext("Tarefas").getObject()
    },

    onPressOptions: function (oEvent) {

      const selectedTask = this.getCurrentTask(oEvent.getSource());

      this._noAtual = selectedTask.NO; //this.getAtividadeGantt(oEvent);
      this._iconStatus = this.getIconStatus(oEvent);
      this._iconAnexo = this.getIconAnexo(oEvent.getSource());
      this._statusAtual = this.getAtividadeStatus(selectedTask.STATUS);
      this._respExecAtual = selectedTask.RESP_EXEC;//this.getAtividadeRespExec(oEvent);
      this._empresaAtual = selectedTask.EMPRESA;//this.getAtividadeEmpresa(oEvent);

      key.NoAtual = selectedTask.NO; //this.getAtividadeGantt(oEvent);
      key.IconStatus = this.getIconStatus(oEvent);
      key.iconAnexo = this.getIconAnexo(oEvent.getSource());

      this._descAtividadeAtual = selectedTask.DESC_TAREFA; //this.getAtividadeDesc(oEvent);

      this._selectedTaskRow = selectedTask; //this.getSelectedRowTask();

      var popupOptions = this.getView().byId("popupOptions").getDomRef();
      var buttonOptionsDom = oEvent.getSource().getDomRef();
      var rect = buttonOptionsDom.getBoundingClientRect();

      var centerViewPort = document.querySelector("#viewPortContainer");
      var limitedWidtht = document.querySelector(".sapUShellApplicationContainerLimitedWidth");
      var diffWidth = (centerViewPort.clientWidth - limitedWidtht.offsetWidth) / 2;

      buttonOptionsDom.classList.toggle("button_selected");
      key.buttonOptionsSelected = buttonOptionsDom;

      if (rect.left > 0) {
        diffWidth = rect.left - diffWidth;
        popupOptions.style.left = diffWidth + 53 + "px"; //( rect.left - 80 )  + "px";
        popupOptions.style.top = rect.top - 150 + "px";
      } else {
        popupOptions.style.left = diffWidth + 53 + "px"; //( rect.left - 80 )  + "px";
        popupOptions.style.top = rect.top - 150 + "px";
      }

      if (selectedTask.TPTAREFA === "Lembrete") {
        this.getView().byId("btnExecAtvt").setEnabled(false);
        this.getView().byId("btnAlterarStatus").setEnabled(true);
      } else {
        this.getView().byId("btnAlterarStatus").setEnabled(false);

        if (key.IconStatus.getTooltip() !== "Processamento concluído sem erros" && key.IconStatus.getTooltip() !== "Em processamento" && key.IconStatus.getTooltip() !== "Processamento ativo") this.getView().byId("btnExecAtvt").setEnabled(true);
        else this.getView().byId("btnExecAtvt").setEnabled(false);

        if (key.IconStatus.getSrc() === "sap-icon://question-mark" || key.IconStatus.getSrc() === "sap-icon://complete") this.getView().byId("btnAlterarStatus").setEnabled(true);
        else this.getView().byId("btnAlterarStatus").setEnabled(false);
      }

      if (selectedTask.TPTAREFA === "Transação" && this._selectedTaskRow.STATUS === "R") {
        this.getView().byId("btnAlterarStatus").setEnabled(true);
      }

      if (key.IconStatus.getTooltip() == "Processamento ativo" || key.IconStatus.getTooltip() == "Em processamento") {
        this.getView().byId("btnAlterarStatus").setEnabled(true);
      }

      if (this._selectedTaskRow.HasApproval) this.getView().byId("btnAprovacoes").setEnabled(true);
      else this.getView().byId("btnAprovacoes").setEnabled(false);

      if (this._selectedTaskRow.STATUS === "1") this.getView().byId("btnAlterarStatus").setEnabled(false);



      popupOptions.classList.toggle("popup_disable");
      this.getView().byId("idHboxModal").getDomRef().classList.toggle("popup_disable");
    },

    getIconStatus: function (domRef) {
      let parent = domRef.getSource().getParent();
      let iconStatusControl;
      parent = parent.getParent();
      const cells = parent.getCells();
      for (const cell of cells) {
        if (cell.getMetadata()._sClassName === "sap.ui.core.Icon") {
          return iconStatusControl = cell;
        }
        if (cell.getMetadata()._sClassName === "sap.m.HBox") {
          for (const cellItem of cell.getItems()) {
            if (cellItem.getMetadata()._sClassName === "sap.ui.core.Icon") {
              return iconStatusControl = cellItem;
            }
          }
        }
      }
    },

    closePopups: function () {
      var popups = document.querySelectorAll(".zpopup");
      popups.forEach(function (popup) {
        if (!popup.classList.contains("popup_disable")) popup.classList.add("popup_disable");
      });
    },

    isConfigurationLateTasksActive: function () {
      return this.getView().getModel("settings").getProperty("/LateTasksPopup");
    },

    isTaskLate: function (date, time) {

      const parseDate = (date, time) => {
        return new Date(Date.parse(date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6, 8) + "T" + time.substring(0, 2) + ":" + time.substring(2, 4) + ":" + time.substring(4, 6) + ".000-03:00"));
      }

      const parseFormattedDate = (date, time) => {
        return new Date(Date.parse(date.substring(6, 10) + "-" + date.substring(3, 5) + "-" + date.substring(0, 2) + "T" + time + ".000-03:00"));
      }

      let taskFinishDate;
      if (date.indexOf("/") === -1)
        taskFinishDate = parseDate(date, time);
      else
        taskFinishDate = parseFormattedDate(date, time);

      const currentDate = new Date();

      if (currentDate > taskFinishDate)
        return true;
      else
        return false;
    },

    getLateTasks: function () {

      const lateTasks = [];

      for (const task of this._aSelectedItemsProperties) {
        if (this.isTaskLate(task.DATA_FIM_PLAN, task.HORA_FIM_PLAN))
          lateTasks.push(task);
      }

      this.getModel("viewAtividades").setProperty("/popupTarefasAtrasadas", lateTasks);

      if (lateTasks.length === 0) return false;
      else return true;

    },

    onPressOptionsStatus: function (oEvent, oKeys) {
      // key.NoAtual = this._noAtual;
      // key.IconStatus = this._iconStatus;
      // key.iconAnexo = this._iconAnexo;

      // if (oKeys) {
      //   key.IconStatus = oKeys[0].IconStatus;
      // }

      // var popupStatus = this.getView().byId("popupStatus").getDomRef();
      // var popupOptions = this.getView().byId("popupOptions").getDomRef(); //oEvent.getSource().getDomRef();

      // this.getView().byId("inputStatusMotivo").setValue("");

      // if (key.IconStatus.getSrc() === "sap-icon://stop") this.habilitaBtnStatus(false);
      // //if (key.IconStatus.getTooltip() === "Em processamento" || key.IconStatus.getTooltip() === "Desconhecido" || key.IconStatus.getTooltip() ===
      // //	"Processamento ativo" || key.IconStatus.getTooltip() === "Nenhuma informação de status disponível")
      // else if (key.IconStatus.getTooltip() === "Em processamento" || key.IconStatus.getSrc() === "sap-icon://question-mark" || key.IconStatus.getSrc() === "sap-icon://process" || key.IconStatus.getTooltip() === "Nenhuma informação de status disponível") this.habilitaBtnStatus(true);
      // else this.habilitaBtnStatus(false);

      // if (!oKeys) {
      //   popupStatus.style.top = popupOptions.offsetTop + "px"; //.style.top;
      //   popupStatus.style.left = popupOptions.offsetLeft + "px"; //.style.left;

      //   this.getView().byId("popupOptions").getDomRef().classList.toggle("popup_disable");
      // } else {
      //   popupStatus.style.left = "600px";
      // }

      // popupStatus.classList.toggle("popup_disable");


      // new version begin 
      key.NoAtual = this._noAtual;
      key.IconStatus = this._iconStatus;
      key.iconAnexo = this._iconAnexo;

      this.getModel("viewAtividades").setProperty("/atividadeAtrasada", false);
      if (oKeys) {
        key.IconStatus = oKeys[0].IconStatus;
        if (this._aSelectedItemsProperties[0].STATUS === "R" && !this._aSelectedItemsProperties[0].Reproc)
          if (this.isConfigurationLateTasksActive())
            if (this.getLateTasks())
              this.getModel("viewAtividades").setProperty("/atividadeAtrasada", true);
      }
      else {
        this._aSelectedItems = undefined;
        this._aSelectedItemsProperties = undefined;
        if (this._selectedTaskRow.STATUS === "R" && !this._selectedTaskRow.Reproc)
          if (this.isConfigurationLateTasksActive())
            if (this.isTaskLate(this._selectedTaskRow.DATA_FIM_PLAN, this._selectedTaskRow.HORA_FIM_PLAN))
              this.getModel("viewAtividades").setProperty("/atividadeAtrasada", true);
      }


      this.onPressFechaPopupOptions();

      if (this._oDialogChangeStatus)
        this.onChangeStatusDialogClose();

      Fragment.load({
        id: this.getView().getId(),
        name: "FechamentoContabil.view.fragments.changeStatus",
        controller: this,
      }).then(function (oDialog) {

        this.getModel("motivosAtraso").setProperty("/motivoSelecionado", "");

        this._oDialogChangeStatus = oDialog;
        this.getView().addDependent(oDialog);

        if (this._aSelectedItems){
          Fragment.byId(this.getView().getId(), "idTarefaStatusTitle").setVisible(false);
          Fragment.byId(this.getView().getId(), "idTarefaStatus").setVisible(false);
        }

        Fragment.byId(this.getView().getId(), "inputStatusMotivo").setValue("");
        Fragment.byId(this.getView().getId(), "inputStatusMotivo").setRequired(false);
        Fragment.byId(this.getView().getId(), "changeStatusTaskDesc").setText(this._descAtividadeAtual);
        Fragment.byId(this.getView().getId(), "changeStatusCurrentStatus").setText(this._statusAtual);
        Fragment.byId(this.getView().getId(), "changeStatusTextArea").setVisible(false);

        if (this._selectedTaskRow) this._changeStatusMassIcon = undefined;

        if (this._selectedTaskRow?.STATUS === "0" || this._changeStatusMassIcon === 'sap-icon://complete') {
          Fragment.byId(this.getView().getId(), "inputStatusMotivo").setRequired(true);
          Fragment.byId(this.getView().getId(), "inputStatusMotivo").setPlaceholder("Motivo (texto breve)");
          Fragment.byId(this.getView().getId(), "changeStatusTextArea").setVisible(true);
          this.byId("idTarefaStatusReproc").setVisible(true);
        }
        else {
          Fragment.byId(this.getView().getId(), "inputStatusMotivo").setPlaceholder("Justificativa (opcional)");
        }

        if (this.getModel("viewAtividades").getProperty("/atividadeAtrasada")) {
          if (this._aSelectedItems){
            Fragment.byId(this.getView().getId(), "idLateTasksSectionMass").setVisible(true);

            this.byId("btnDisplayLateTasks").setVisible(true);
          }
          Fragment.byId(this.getView().getId(), "inputStatusMotivo").setVisible(false);
          Fragment.byId(this.getView().getId(), "changeStatusTextArea").setVisible(true);
        }

        if (key.IconStatus.getSrc() === "sap-icon://stop") this.habilitaBtnStatus(false);
        else if (key.IconStatus.getTooltip() === "Em processamento" || key.IconStatus.getSrc() === "sap-icon://question-mark" || key.IconStatus.getSrc() === "sap-icon://process" || key.IconStatus.getTooltip() === "Nenhuma informação de status disponível") this.habilitaBtnStatus(true);
        else this.habilitaBtnStatus(false);

        oDialog.open();
      }.bind(this));

    },

    onChangeStatusDialogClose: function () {
      if (this._oDialogChangeStatus) {
        this._oDialogChangeStatus.close();
        this._oDialogChangeStatus.destroy();
        this._oDialogChangeStatus = undefined;
      }
    },

    getAtvtType: function (oEvent) {
      var metadata = oEvent.getMetadata();
      var parent;
      var cellTipoTarefa;

      if (metadata.getName() === "sap.ui.base.Event") parent = oEvent.getSource().getParent();
      else parent = oEvent.getParent();

      for (var i = 0; i < 6; i++) {
        if (parent.getMetadata()._sClassName === "sap.ui.table.Row") break;
        parent = parent.getParent();
      }

      if (this.getView().getViewName() === "FechamentoContabil.view.Atividades") cellTipoTarefa = 6;
      else cellTipoTarefa = 3;

      var cells = parent.getCells();
      var hbox = cells[cellTipoTarefa];

      var items = hbox.getItems();
      return items[0].getText();
    },

    habilitaBtnStatus: function (habilitar) {
      var statusIconIDs = ["idOk", "idAprov", "idProc"];
      var status;
      var that = this;
      if (habilitar) {
        statusIconIDs.forEach(function (id) {
          status = Fragment.byId(that.getView().getId(), id);
          status.setVisible(true);

          if (id === "idProc") status.setVisible(false);

          let hasApproval;

          if (that._selectedTaskRow) hasApproval = that._selectedTaskRow.HasApproval;

          if (hasApproval) {
            if (id === "idOk") status.setVisible(false);
            if (id === "idAprov") status.setVisible(true);
          }
          else {
            if (id === "idOk") status.setVisible(true);
            if (id === "idAprov") status.setVisible(false);
          }
        });
      } else {
        statusIconIDs.forEach(function (id) {
          status = Fragment.byId(that.getView().getId(), id);
          if (id === "idOk" || id === "idAviso" || id === "idErro" || id === "idAprov") status.setVisible(false);
          if (id === "idProc") status.setVisible(true);
        });
      }
    },

    pressChangeStatus: function (oEvent) {
      var that = this;
      var status;
      var value;
      var id = oEvent.getSource().getId();
      if (id.indexOf("idProc") !== -1) status = "R";
      if (id.indexOf("idOk") !== -1) status = "0";
      if (id.indexOf("idAviso") !== -1) status = "2";
      if (id.indexOf("idErro") !== -1) status = "4";
      if (id.indexOf("idAprov") !== -1) status = "1";

      key.Profile = this.getView().byId("idInputModelo").getSelectedItem().getText();
      key.Instance = this.getView().byId("idInputPeriodo").getSelectedItem().getKey();

      key.value = {
        Atividade: key.NoAtual,
        Status: status,
        Justificativa: Fragment.byId(this.getView().getId(), "inputStatusMotivo").getValue(),
        JustificativaLonga: Fragment.byId(this.getView().getId(), "changeStatusTextArea").getValue(),
        Reprocessamento: false,
        CausadoPorPrecedente: false,
        TarefaAtrasada: this.getModel("viewAtividades").getProperty("/atividadeAtrasada")
      };

      if (this.getModel("viewAtividades").getProperty("/atividadeAtrasada")) {

        key.value.Justificativa = this.getModel("motivosAtraso").getProperty("/motivoSelecionado");

        if (!key.value.Justificativa.trim()) {
          sap.m.MessageBox.error("Campo \"Motivo\" é obrigatório");
          return;
        }

        if (!key.value.JustificativaLonga.trim()) {
          sap.m.MessageBox.error("Campo \"Detalhes do Motivo\" é obrigatório");
          return;
        }
      }

      if (this._selectedTaskRow) this._changeStatusMassIcon = undefined;

      if (id.indexOf("idProc") !== -1 && (this._selectedTaskRow?.STATUS === "0" || this._changeStatusMassIcon === 'sap-icon://complete')) {

        if (!key.value.Justificativa.trim()) {
          sap.m.MessageBox.error("Campo \"Motivo\" é obrigatório");
          return;
        }

        if (!key.value.JustificativaLonga.trim()) {
          sap.m.MessageBox.error("Campo \"Detalhes do Motivo\" é obrigatório");
          return;
        }

        MessageBox.confirm("Esta alteração de status é devido ao reprocessamento de tarefa precedente?",
          {
            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            onClose: function (oAction) {

              if (oAction !== "NO") key.value.CausadoPorPrecedente = true;
              else key.value.CausadoPorPrecedente = false;

              key.value.Reprocessamento = true;

              if (!this._aSelectedItems) {
                this.setDadosECC("setStatus", key.value);
                this._selectedTaskRow.Reproc = true;
              } else if (!this._aSelectedItems.length) {
                this.setDadosECC("setStatus", key.value);
                this._selectedTaskRow.Reproc = true;
              } else {

                const statusData = {
                  Status: key.value.Status,
                  Justificativa: key.value.Justificativa,
                  JustificativaLonga: key.value.JustificativaLonga,
                  Reprocessamento: key.value.Reprocessamento,
                  CausadoPorPrecedente: key.value.CausadoPorPrecedente,
                  Parametro: "setStatus",
                  TarefaAtrasada: this.getModel("viewAtividades").getProperty("/atividadeAtrasada")

                }
                this.updateStatusECCMass(this._aSelectedItems, statusData);
              }
              this.onChangeStatusDialogClose();
            }.bind(this)
          });
      }
      else {
        if (!this._aSelectedItems) {
          this.setDadosECC("setStatus", key.value);
        } else if (!this._aSelectedItems.length) {
          this.setDadosECC("setStatus", key.value);
        } else {

          const statusData = {
            Status: key.value.Status,
            Justificativa: key.value.Justificativa,
            JustificativaLonga: key.value.JustificativaLonga,
            Reprocessamento: key.value.Reprocessamento,
            CausadoPorPrecedente: key.value.CausadoPorPrecedente,
            Parametro: "setStatus",
            TarefaAtrasada: this.getModel("viewAtividades").getProperty("/atividadeAtrasada")
          }
          this.updateStatusECCMass(this._aSelectedItems, statusData);
        }
        this.onChangeStatusDialogClose();
      }
    },

    updateStatusECCMass: function (items, data) {
      sap.ui.core.BusyIndicator.show(0);
      let totalItems;
      let totalCompleted = 0;

      const requestParams = { groupId: "updateStatusMass", useBatch: true };
      const oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/", requestParams);
      oModel.setDeferredGroups([requestParams.groupId]);

      totalItems = items.length;

      this.setProgress(0);
      this.displayDialogProgress();

      const updateItems = (fromIndex) => {
        let updatedItems = 0;
        for (let index = fromIndex; index < items.length; index++) {

          data.Item = items[index].NoAtual;
          let sendData = {};
          Object.assign(sendData, data);

          if(this.getModel("viewAtividades").getProperty("/atividadeAtrasada")){
            if (!this.isTaskLate(this._aSelectedItemsProperties[index].DATA_FIM_PLAN, this._aSelectedItemsProperties[index].HORA_FIM_PLAN)){
              sendData.TarefaAtrasada = false;
              sendData.JustificativaLonga = "";
              sendData.Justificativa = this.byId("inputStatusMotivoMass").getValue();
            }
          }

          const url = "/ETS_DADOS_ITEM(Profile='" + key.Profile.trim() + "',Instance='" + key.Instance.trim() + "',Item='" + sendData.Item.trim() + "')";

          requestParams.changeSetId = Math.floor(Math.random() * 501) + Math.floor(Math.random() * 501) + Math.floor(Math.random() * 501);
          oModel.update(url, sendData, requestParams);

          updatedItems++;
          totalCompleted++;

          if (updatedItems === this.massBatchSize || totalCompleted === totalItems) {

            this.submitChangesSync(oModel, "updateStatusMass").then(() => {
              this.setProgress((totalCompleted / totalItems) * 100);
              if (totalCompleted !== totalItems)
                updateItems(totalCompleted);
              else {
                this.closeDialogProgress();
                this._aSelectedItems = undefined;
                this._aSelectedItemsProperties = undefined;
                this.onPressSync({
                  success: function () {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Atualiação em massa concluída");
                  },
                });
              }
            })
            return;
          }
        }
      }
      updateItems(totalCompleted);
    },

    submitChangesSync: async function (oModel, groupId) {
      const requestParams = { groupId: groupId };
      oModel.setDeferredGroups([groupId]);

      await new Promise((resolve, reject) => {
        oModel.submitChanges({
          groupId: requestParams.groupId,
          success: function (oData) {
            if (oData.__batchResponses[0].response) {
              const resp = JSON.parse(oData.__batchResponses[0].response.body);
              sap.m.MessageToast.show(resp.error.message.value);
            }
            resolve(oData);
          }.bind(this),
          error: function (oError) {
            switch (groupId) {
              case "updateStatusMass":
                MessageBox.error("Erro ao mudar o status em massa");
                break;
              case "updateLinkMass":
                MessageBox.error("Erro ao atribuir Link em massa");
                break;
              case "updateAnexoMass":
                MessageBox.error("Erro ao atribuir Anexo em massa");
                break;
              default:
                break;
            }
            this.closeDialogProgress();
            sap.ui.core.BusyIndicator.hide();
            this.getView().setBusy(false);
          }.bind(this),
        });
      })
    },

    setProgress: function (percent) {
      this.getView().getModel("viewAtividades").setProperty("/progress", percent);
    },

    displayDialogProgress: function () {

      if (!this.oDialogProgress) {
        this.oDialogProgress = new sap.m.Dialog({
          title: "Atualização em andamento",
          content: new sap.m.ProgressIndicator({
            percentValue: "{viewAtividades>/progress}",
            displayValue: { path: 'viewAtividades>/progress', formatter: formatter.formatProgress }
          })
        }).addStyleClass("sapUiContentPadding")
      } this
      this.getView().addDependent(this.oDialogProgress);
      this.oDialogProgress.open();
    },

    closeDialogProgress: function () {
      this.oDialogProgress.close();
    },

    getAtividadeGantt: function (oEvent) {
      var metadata = oEvent.getMetadata();
      var parent;

      if (metadata.getName() === "sap.ui.base.Event") parent = oEvent.getSource().getParent();
      else parent = oEvent.getParent();

      for (var i = 0; i < 6; i++) {
        if (parent.getMetadata()._sClassName === "sap.ui.table.Row") break;
        parent = parent.getParent();
      }
      var cells = parent.getCells();
      var hbox = cells[0];
      if (this.getView().getViewName() === "FechamentoContabil.view.Atividades") {
        var items = hbox.getItems();
        return items[1].getText();
      }
      var items = hbox.getItems();
      items = items[1].getItems();
      return items[3].getText();
    },

    getAtividadeDesc: function (oEvent) {
      var metadata = oEvent.getMetadata();
      var parent;

      if (metadata.getName() === "sap.ui.base.Event") parent = oEvent.getSource().getParent();
      else parent = oEvent.getParent();

      for (var i = 0; i < 6; i++) {
        if (parent.getMetadata()._sClassName === "sap.ui.table.Row") break;
        parent = parent.getParent();
      }
      var cells = parent.getCells();
      var hbox = cells[0];
      if (this.getView().getViewName() === "FechamentoContabil.view.Atividades") {
        return cells[2].getText();
      }
      var items = hbox.getItems();
      items = items[1].getItems();
      return items[3].getText();
    },

    updateStatus: function (data) {
      if (data.Status === "R") {
        key.IconStatus.setSrc("sap-icon://process");
        key.IconStatus.setColor("#bfbfbf");
        key.IconStatus.setTooltip("Em processamento");
        if (this._selectedTaskRow)
          this._selectedTaskRow.STATUS = "R";
        if (this._aSelectedItems) {
          for (const item of this._aSelectedItems) {
            item.IconStatus.setSrc("sap-icon://process");
            item.IconStatus.setColor("#bfbfbf");
            item.IconStatus.setTooltip("Em processamento");
          }
        }
      }
      if (data.Status === "0") {
        key.IconStatus.setSrc("sap-icon://complete");
        key.IconStatus.setColor("#46af4f");
        key.IconStatus.setTooltip("Concluído sem erros");
        if (this._selectedTaskRow)
          this._selectedTaskRow.STATUS = "0";
      }
      if (data.Status === "2") {
        key.IconStatus.setSrc("sap-icon://complete");
        key.IconStatus.setColor("#d2e23f");
        key.IconStatus.setTooltip("Concluído com avisos");
      }
      if (data.Status === "4") {
        key.IconStatus.setSrc("sap-icon://complete");
        key.IconStatus.setColor("#e2753f");
        key.IconStatus.setTooltip("Concluído com erros");
      }
      if (data.Status === "1") {
        key.IconStatus.setSrc("sap-icon://hr-approval");
        key.IconStatus.setColor("navy");
        key.IconStatus.setTooltip("Em Aprovação");
        if (this._selectedTaskRow)
          this._selectedTaskRow.STATUS = "1";
      }
    },

    onPressTransacao: function (oEvent) {
      key.Profile = this.getView().byId("idInputModelo").getSelectedItem().getText();
      key.Instance = this.getView().byId("idInputPeriodo").getSelectedItem().getKey();

      this.getView().byId("popupOptions").getDomRef().classList.toggle("popup_disable");

      this.getDadosECC("ExecutaTransacao");
    },

    executaTransacao: function (that, data) {
      var dependentesConcluidos = true;

      data.forEach(function (dependente) {
        if (dependente.Status !== "0" && dependente.Status !== "2") dependentesConcluidos = false;
      });

      if (dependentesConcluidos) {
        key.Profile = this.getView().byId("idInputModelo").getSelectedItem().getText();
        key.Instance = this.getView().byId("idInputPeriodo").getSelectedItem().getKey();
        if (window.location.href.indexOf("fioridev") !== -1 || window.location.href.indexOf("brsaolsvfid01") !== -1 || window.location.href.indexOf("localhost") !== -1) sap.m.URLHelper.redirect("https://wdqas.votorantim.com.br/sap/bc/gui/sap/its/webgui/its/webgui?~transaction=*ZGLFI686 p_profil=" + key.Profile + ";p_instan=" + key.Instance + ";p_item=" + key.NoAtual, true);
        else sap.m.URLHelper.redirect("https://wdprd.votorantim.com.br/sap/bc/gui/sap/its/webgui/its/webgui?~transaction=*ZGLFI686 p_profil=" + key.Profile + ";p_instan=" + key.Instance + ";p_item=" + key.NoAtual, true);
        this.closePopups();
        key.buttonOptionsSelected.classList.toggle("button_selected");
      } else {
        that.updateModel(that, "Dependentes", data);
        this.getView().byId("popupDependentes").getDomRef().classList.toggle("popup_disable");
      }
    },

    onPressTarefa: function (oEvent) {
      key.Profile = this.getView().byId("idInputModelo").getSelectedItem().getText();
      key.Instance = this.getView().byId("idInputPeriodo").getSelectedItem().getKey();
      if (window.location.href.indexOf("fioridev") !== -1 || window.location.href.indexOf("brsaolsvfid01") !== -1 || window.location.href.indexOf("localhost") !== -1) sap.m.URLHelper.redirect("https://wdqas.votorantim.com.br/sap/bc/gui/sap/its/webgui/its/webgui?~transaction=*ZGLFI677 p_chave=" + key.Profile + "-" + key.Instance + "-" + key.NoAtual, true);
      else sap.m.URLHelper.redirect("https://wdprd.votorantim.com.br/sap/bc/gui/sap/its/webgui/its/webgui?~transaction=*ZGLFI677 p_chave=" + key.Profile + "-" + key.Instance + "-" + key.NoAtual, true);
      this.closePopups();
      key.buttonOptionsSelected.classList.toggle("button_selected");
    },

    onPressFechaPopupOptions: function () {
      this.closePopups();
      if (key.buttonOptionsSelected)
        key.buttonOptionsSelected.classList.toggle("button_selected");
    },

    onConfigAnexo: function (oEvent) {
      this.openAnexoList(oEvent);
    },

    getIconAnexo: function (oEvent) {
      var metadata = oEvent.getMetadata();
      var parent;
      var cellIconAnexo;

      if (metadata.getName() === "sap.ui.base.Event") parent = oEvent.getSource().getParent();
      else parent = oEvent.getParent();

      for (var i = 0; i < 6; i++) {
        if (parent.getMetadata()._sClassName === "sap.ui.table.Row") break;
        parent = parent.getParent();
      }

      if (this.getView().getViewName() === "FechamentoContabil.view.Atividades") cellIconAnexo = 19;
      else cellIconAnexo = 12;

      var cells = parent.getCells();
      var hbox = cells[cellIconAnexo];

      var items = hbox.getItems();
      return items[0];
    },

    setFilenames: function (that, fileNames) {
      var selectList = sap.ui.getCore().byId("selectAnexoList");
      var vboxAnexos = sap.ui.getCore().byId("idVBoxAnexosFr");
      var oIcon;
      var sTooltip;

      if (fileNames.results.length > 0) {
        vboxAnexos.setVisible(true);

        fileNames.results.forEach(function (filename) {
          // var item = new sap.ui.core.Item();
          var item = new sap.ui.core.ListItem();
          item.setKey(filename.Profile.trim() + "-" + filename.Instance.trim() + "-" + filename.Hierarquia.trim() + "-" + filename.Fileid.trim());

          //Anexo é comum em todas as instâncias
          if (filename.Instance.trim() === "0") {
            oIcon = "⭐ ";
            sTooltip = 'Clique para baixar o arquivo "&" (Procedimento)';
          } else {
            oIcon = "🏳️ ";
            sTooltip = 'Clique para baixar o arquivo "&" (Evidência da tarefa)';
          }

          item.setTooltip(sTooltip.replace("&", filename.Filename));
          item.setAdditionalText(`Adicionado em: ${filename.CreatedOn}`);

          item.setText(oIcon + filename.Filename);
          selectList.addItem(item);
        });
      } else {
        vboxAnexos.setVisible(false);
      }
    },

    onDownloadItem: function (oEvent) {
      var oDataURL;
      var key = oEvent.getSource().getSelectedKey().split("-");

      oDataURL = "/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/ETS_FILE(Profile='" + key[0].trim() + "',Instance='" + key[1].trim() + "',Item='" + key[2].trim() + "',FileId='" + key[3].trim() + "')/$value";

      window.open(oDataURL);
    },

    onAnexarArquivo: function () {
      var oFileUploader = sap.ui.getCore().byId("fileUploaderFr");

      if (oFileUploader.getValue() === "") {
        MessageBox.Error("Nenhum arquivo selecionado");
        return;
      }

      var oModel = this.getView().getModel();
      var noAtividade = key.NoAtual;
      var oDataURL = "/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/ETS_MONITOR_GERAL(Modelo='" + key.Profile.trim() + "',Instance='" + key.Instance.trim() + "',Hierarquia='" + noAtividade + "')/MonitorToFile";

      //	oModel.refreshSecurityToken();
      oFileUploader.removeAllHeaderParameters();
      var oHeaders = oModel.oHeaders;
      var sToken = oHeaders["x-csrf-token"];

      var slug = oFileUploader.getValue();
      slug = slug.replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '');

      var oHeaderParameter = new sap.ui.unified.FileUploaderParameter({
        name: "slug",
        value: slug,
      });
      oFileUploader.addHeaderParameter(oHeaderParameter);
      oHeaderParameter = new sap.ui.unified.FileUploaderParameter({
        name: "X-CSRF-Token",
        value: sToken,
      });
      oFileUploader.addHeaderParameter(oHeaderParameter);

      oFileUploader.setSendXHR(true);
      oFileUploader.setUploadUrl(oDataURL);
      this.getView().setBusy(true);
      oFileUploader.upload();
    },

    handleUploadComplete: function (oEvent) {
      var sResponse = oEvent.getParameter("response");
      if (sResponse.indexOf("ERRO") === -1) {
        sap.m.MessageToast.show("Arquivo anexado com sucesso");
        var selectList = sap.ui.getCore().byId("selectAnexoList");
        selectList.removeAllItems();
        this.getDadosECC("atividadeAnexos");

        //var popupAnexo = this.getView().byId("idPopupAnexo");
        //popupAnexo.toggleStyleClass("popup__anexo__inativo");
        key.iconAnexo.setColor("blue");
        if (this.getView().getViewName() === "FechamentoContabil.view.Atividades") this.setValueModel_atividades(key.iconAnexo, "NO", key.NoAtual, "CONTEM_ANEXO", "X");
        else this.setValueModel_gantt(key.iconAnexo, "NO", key.NoAtual, "CONTEM_ANEXO", "X");
      } else {
        const sResponse = oEvent.getParameter("responseRaw");
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(sResponse, "text/xml");
        MessageBox.error((xmlDoc.getElementsByTagName("message")[0].textContent));
      }
      this.getView().setBusy(false);
      var oFileUploader = sap.ui.getCore().byId("fileUploaderFr");
      oFileUploader.setValue("");
    },

    setValueModel_gantt: function (context, keyname, keyvalue, fieldname, value) {
      var model = key.iconAnexo.getModel("gantt");
      this.setResultsModel_gantt(model.oData.root.results, keyname, keyvalue, fieldname, value);
    },

    setResultsModel_gantt: function (results, keyname, keyvalue, fieldname, value) {
      var done = null;
      var that = this;

      results.forEach(function (item) {
        if (done !== null) return done;
        if (item[keyname] === keyvalue) {
          item[fieldname] = value;
          done = "ok";
          return done;
        } else if (item.results !== undefined) {
          done = that.setResultsModel_gantt(item.results, keyname, keyvalue, fieldname, value);
        }
      });
      return done;
    },

    setValueModel_atividades: function (context, keyname, keyvalue, fieldname, value) {
      var model = key.iconAnexo.getModel("Tarefas");
      model.oData.forEach(function (item) {
        if (item[keyname] === keyvalue) item[fieldname] = value;
      });
    },

    checaNovidades: function (that, data) {
      // if (init === null) {
      //   var oModel = sap.ui.getCore().getModel("init");

      //   if (oModel === undefined) {
      //     oModel = new sap.ui.model.json.JSONModel({
      //       init: "x",
      //     });
      //     sap.ui.getCore().setModel(oModel, "init");

      //     if (data.results[0].ToPlanoSelecionado.Novidades === "X") {
      //       this.getView().setBusy(true);
      //       this.displayNews();
      //     }
      //     init = "X";
      //   }
      // }
    },

    displayNews: function () {
      // if (sap.ui.Device.system.phone) return;

      // var imagePath = $.sap.getModulePath("FechamentoContabil", "/novidades/");

      // if (!this.oDialogNovidades) {
      //   this.oDialogNovidades = sap.ui.xmlfragment("FechamentoContabil.view.fragments.novidades", this);
      //   this.oDialogNovidades.setModel(this.getView().getModel());
      //   this.getView().addDependent(this.oDialogNovidades);
      //   this.oDialogNovidades.setContentWidth("1120px");
      //   this.oDialogNovidades.setContentHeight("592px");
      // }

      // sap.ui
      //   .getCore()
      //   .byId("news7")
      //   .setSrc(imagePath + "Novidade_08.png");
      // this.oDialogNovidades.open();
    },

    pressNovidades: function (oEvent) {
      //this.getView().byId("popupNovidades").toggleStyleClass("popup_disable");
      //this.getView().byId("idHboxModal").toggleStyleClass("popup_disable");

      // if (sap.ui.getCore().byId("idCheckNovidade").getSelected()) {
      //   this.setDadosECC("setNovidades");
      // }
      // this.oDialogNovidades.close();
      // this.oDialogNovidades.destroy(true);
      // this.oDialogNovidades = undefined;
    },

    novidadesLoaded: function () {
      this.getView().setBusy(false);
    },

    pressNovidadesProximo: function () {
      this.getView().byId("carouselProximo").next();
    },

    onPressFeedback: function () {
      sap.m.URLHelper.redirect("https://docs.google.com/forms/d/e/1FAIpQLSfFpPzWBz9WLN65Fp-D0P-Y8FbPT_zwNkK3uzZe0nnmjLpbKA/viewform", true);
    },

    /* Início - Rodrigo Cano (Iteam) */
    /***************************************************************************
      onAtualizaStatusMassaPress
    ****************************************************************************/
    onAtualizaStatusMassaPress: function (oEvent) {
      var oIcon = oEvent.getSource().getIcon();
      var oItems = this.getTableItems(oIcon);
      this._selectedTaskRow = undefined;
      this._changeStatusMassIcon = oIcon;

      if (oItems.itens.length) {

        //Check if there is Tasks with Approval (they are not supported)
        for (const item of oItems.itens) {
          if (item.HasApproval) {
            MessageBox.error("Para esta operação não é permitido selecionar tarefas com workflow de aprovação");
            return;
          }
        }

        this.loadItemsDialog(this, oItems);
      }
    },

    /***************************************************************************
      getTableItems
    ****************************************************************************/
    getTableItems: function (oIcon) {
      var that = this;
      var oTable = this.getView().byId("idTableAtividades");
      var oItems = oTable.getBinding("rows").aIndices;
      var oList = oTable.getBinding("rows").oList;
      var itens = [];
      var oKeys = [];

      //Obtém a chave dos itens selecionados
      oItems.forEach(function (item, index) {
        var oRow = oList[item];

        var oIconStatus = new sap.ui.core.Icon();

        oIconStatus.setSrc(oRow.ICON_STATUS);
        oIconStatus.setTooltip(oRow.STATUS);

        var aKey = {
          NoAtual: oRow.NO_ATIVIDADE,
          IconStatus: oIconStatus,
        };

        //Busca de acordo com o tipo de tarefa escolhido
        if (oRow.ICON_STATUS === oIcon) {
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
        }
      });

      if (!itens.length) {
        MessageBox.error("Nenhuma atividade encontrada para o filtro escolhido");
      }

      return {
        itens: itens,
        keys: oKeys,
      };
    },

    /***************************************************************************
      loadItemsDialog
    ****************************************************************************/
    loadItemsDialog: function (that, oItems, anexoEmMassa, linkEmMassa) {

      that._aSelectedItemsProperties = [];

      //Instancia o diálogo de ajuda de pesquisa
      if (!that._oDialogItems) {
        that._oDialogItems = new ValueHelpDialog({
          supportMultiselect: true,
          Title: "Selecione as atividades e clique em OK",
          key: "NO_ATIVIDADE",
          ok: function (oEvent) {
            var oKey = [];
            that._aSelectedItems = [];

            //Retorna os valores selecionados
            var aTokens = oEvent.getParameter("tokens");
            aTokens.forEach(function (iToken) {
              oItems.keys.forEach(function (iKey) {
                if (iToken.getKey() === iKey.NoAtual) {
                  oKey.push(iKey);
                }
              });
              oItems.itens.forEach(function (item) {
                if (iToken.getKey() === item.NO) {
                  that._aSelectedItemsProperties.push(item);
                }
              });
            });

            if (oKey.length) {
              that._aSelectedItems = oKey;
              if (anexoEmMassa) that.onAnexoEmMassa(oKey);
              else if (linkEmMassa) that.onLinkEmMassa(oKey);
              else that.onPressOptionsStatus(null, oKey);
              that.closeItemsDialog(that);
            } else {
              MessageBox.error("Nenhuma atividade foi selecionada");
            }
          },
          cancel: function () {
            that.closeItemsDialog(that);
          },
        });
      }

      var oTable = that._oDialogItems.getTable();

      //Colunas da ajuda de pesquisa
      var oColModel = new sap.ui.model.json.JSONModel();
      var oColumnList = this.getColumnList();
      oColModel.setData({
        cols: oColumnList,
      });

      var oRowModel = new sap.ui.model.json.JSONModel();
      oRowModel.setData({
        Items: oItems.itens,
      });

      oTable.setModel(oColModel, "columns");

      oTable.setModel(oRowModel);
      oTable.bindRows("/Items");

      // that.ajustaColunas(oTable);
      that._oDialogItems.open();
    },

    /***************************************************************************
      closeItemsDialog
    ****************************************************************************/
    closeItemsDialog: function (that) {
      //Fecha o diálogo e elimina o objeto
      if (that._oDialogItems) {
        that._oDialogItems.close();
        that._oDialogItems.destroy();
        that._oDialogItems = undefined;
      }
    },

    /***************************************************************************
      getColumnList
    ****************************************************************************/
    getColumnList: function () {
      var oColumnList = [
        {
          label: "Núm. Atividade",
          template: "NO_ATIVIDADE",
          width: "7rem",
        },
        {
          label: "Status",
          width: "2.2rem",
        },
        {
          label: "Atividade",
          template: "DESC_TAREFA",
          width: "25rem",
        },
        {
          label: "Empresa",
          template: "EMPRESA",
          width: "5rem",
        },
        {
          label: "Crítico",
          width: "2.2rem",
        },
        {
          label: "Caminho",
          template: "PATH",
          width: "30rem",
        },
        {
          label: "Tipo Tarefa",
          template: "TPTAREFA",
          width: "7rem",
        },
        {
          label: "Responsável Exec",
          template: "RESP_EXEC",
          width: "8rem",
        },
        {
          label: "Início Plan(D)",
          template: "DATA_INICIO_PLAN",
          width: "6rem",
        },
        {
          label: "Inicio Plan(H)",
          template: "HORA_INICIO_PLAN",
          width: "6rem",
        },
        {
          label: "Fim Plan(D)",
          template: "DATA_FIM_PLAN",
          width: "6rem",
        },
        {
          label: "Fim Plan(H)",
          template: "HORA_FIM_PLAN",
          width: "6rem",
        },
        {
          label: "Duração Plan",
          template: "DURACAO_PLAN",
          width: "6rem",
        },
        {
          label: "Data Inicio",
          template: "DATA_INICIO",
          width: "6rem",
        },
        {
          label: "Hora Início",
          template: "HORA_INICIO",
          width: "6rem",
        },
        {
          label: "Data Fim",
          template: "DATA_FIM",
          width: "6rem",
        },
        {
          label: "Hora Fim",
          template: "HORA_FIM",
          width: "6rem",
        },
        {
          label: "Duração",
          template: "DURACAO",
          width: "6rem",
        },
        {
          label: "Responsável",
          template: "RESP",
          width: "8rem",
        },
      ];

      return oColumnList;
    },

    /***************************************************************************
      getCellDate
    ****************************************************************************/
    getCellDate: function (oCell) {
      var sDate = oCell;
      if (sDate) {
        if (sDate.indexOf("/") === -1)
          sDate = sDate.substr(6, 2) + "/" + sDate.substr(4, 2) + "/" + sDate.substr(0, 4);
      }
      return sDate;
    },

    /***************************************************************************
      getCellTime
    ****************************************************************************/
    getCellTime: function (oCell) {
      var sTime = oCell;

      if (sTime) {
        if (sTime.indexOf(":") === -1)
          sTime = sTime.substr(0, 2) + ":" + sTime.substr(2, 2) + ":" + sTime.substr(4, 2);
      }
      return sTime;
    },

    /***************************************************************************
      ajustaColunas
    ****************************************************************************/
    ajustaColunas: function (oTable) {
      var oColumns = oTable.getColumns();

      //Marca Coluna Status como ícone
      oColumns[1].setTemplate(
        new sap.ui.core.Icon({
          src: "{ICON_STATUS}",
          tooltip: "{ICON_STATUS}",
          color: "{COLOR_STATUS}",
          hAlign: "Center",
        })
      );

      //Marca Coluna Itens como ícone
      oColumns[4].setTemplate(
        new sap.ui.core.Icon({
          src: "sap-icon://error",
          color: "orange",
          visible: "{= ${CRITICO} === '' ? false : true }",
          tooltip: "Tarefa crítica",
          hAlign: "Center",
        })
      );
    },

    /***************************************************************************
      onQuestionarViaEmailPress
    ****************************************************************************/
    onQuestionarViaEmailPress: function () {
      $("*").css("cursor", "wait");
      sap.ui.core.BusyIndicator.show(0);
      this.createScreenshot();
    },

    /***************************************************************************
      loadEmailDialog
    ****************************************************************************/
    loadEmailDialog: function (dataUrl) {
      if (!this.oDialogEmail) {
        this.oDialogEmail = sap.ui.xmlfragment("FechamentoContabil.view.fragments.email", this);
        this.oDialogEmail.setModel(this.getView().getModel());
        this.getView().addDependent(this.oDialogEmail);
        this.oDialogEmail.setContentWidth("500px");
        this.oDialogEmail.setContentHeight("430px");

        var oMultiInput = sap.ui.getCore().byId("inputEmail");
        oMultiInput.addValidator(function (args) {
          var text = args.text;
          return new sap.m.Token({
            key: text,
            text: text,
          });
        });
      }

      var oImage = sap.ui.getCore().byId("imgAnexo");
      var oBusyIndicator = sap.ui.getCore().byId("imgAnexoBusy");

      sap.ui.core.BusyIndicator.hide();

      this.oDialogEmail.open();
      $("*").css("cursor", "auto");

      oImage.setSrc(dataUrl);
      oBusyIndicator.destroy(true);
    },

    /***************************************************************************
      onCloseDialogEmail
    ****************************************************************************/
    onCloseDialogEmail: function () {
      if (this.oDialogEmail) {
        this.oDialogEmail.close();
        this.oDialogEmail.destroy(true);
        this.oDialogEmail = undefined;
      }
    },

    /***************************************************************************
      createScreenshot
    ****************************************************************************/
    createScreenshot: function () {
      var that = this;
      var oScreen = document.getElementById(this.createId("IdCorpoPagina"));

      //Screenshot do corpo principal da página
      domtoimage
        .toPng(oScreen)
        .then(function (dataUrl) {
          that.loadEmailDialog(dataUrl);
        })
        .catch(function (error) {
          that.loadEmailDialog("X");
          sap.m.MessageToast.show("O dispositivo bloqueou a captura de tela.");
        });
    },

    /***************************************************************************
      onConfirmQuestion
    ****************************************************************************/
    onConfirmQuestion: function () {
      var oEmail;
      var aTokens = sap.ui.getCore().byId("inputEmail").getTokens();
      var oMensagem = sap.ui.getCore().byId("txtEmailMensagem").getValue();

      //Pega os emails digitados no campo e monta uma string separada por ";"
      aTokens.forEach(function (item) {
        oEmail = oEmail ? oEmail + ";" + item.getKey() : item.getKey();
      });

      //Valida o preenchimento dos campos
      if (!oEmail) {
        MessageBox.error("O campo e-mail deve ser preenchido");
        return;
      }

      if (!oMensagem) {
        MessageBox.error("O campo mensagem deve ser preenchido");
        return;
      }

      //Envia o email
      this.sendEmailQuestionar(oEmail, oMensagem);
    },

    /***************************************************************************
      sendEmailQuestionar
    ****************************************************************************/
    sendEmailQuestionar: function (oEmail, oMensagem) {
      var that = this;
      this.oDialogEmail.setBusy(true);

      var oModel = this.getView().getModel();
      oModel.setUseBatch(false);

      var oAssunto = "Fechamento Contábil - Status";
      var oPath = "/Questions";

      var aAnexo = sap.ui.getCore().byId("imgAnexo").getSrc().trim().split(",");

      //Pega somente a parte necessária do anexo
      if (aAnexo.length === 2) {
        var oAnexo = aAnexo[1].trim();
      }

      //Trata as quebras de linha da mensagem
      oMensagem = oMensagem.replace(new RegExp("\r?\n", "g"), "<br />");

      var oEntry = {
        Email: oEmail,
        Assunto: oAssunto,
        Mensagem: oMensagem,
        Anexo: oAnexo,
      };

      //Envia o Email
      oModel.create(oPath, oEntry, {
        async: false,
        success: function (data) {
          sap.m.MessageToast.show(data.Mensagem);
          that.onCloseDialogEmail();
        },
        error: function (e) {
          //Captura erros retornados do SAP
          var msgErro = JSON.parse(e.responseText).error.message.value;
          MessageBox.error(msgErro);
          that.oDialogEmail.setBusy(false);
        },
      });
    },

    /***************************************************************************
      carregaGrafico
    ****************************************************************************/
    carregaGrafico: function (perc, grafico) {
      var oName = grafico.charAt(0).toUpperCase() + grafico.slice(1);
      var oGrafico = "IdGrafico" + oName;
      var oValue = "IdValue" + oName;

      oGrafico = document.getElementById(this.createId(oGrafico));
      oGrafico.className = "radio_chart " + grafico + " p" + perc;

      oValue = document.getElementById(this.createId(oValue));
      oValue.innerHTML = perc + "%";
    },

    /***************************************************************************
      getLinkRelatorio
    ****************************************************************************/
    getLinkRelatorio: function () {
      var that = this;
      var oProfile = this.getView().byId("idInputModelo").getSelectedItem().getText();
      var oDataURL = "/Hyperlinks('" + oProfile + "')";
      var oModel = this.getView().getModel();

      sap.ui.core.BusyIndicator.show(0);

      //Obtém o link do relatório
      oModel.read(oDataURL, {
        async: false,
        method: "GET",
        success: function (data) {
          sap.ui.core.BusyIndicator.hide();

          //Redireciona para o relatório
          var oLink = data.Link;

          if (sap.ui.Device.system.phone) {
            window.location.href = oLink;
          } else {
            //Abre em uma janela PopUp
            that.popUpExterno(oLink);
          }
        },
        error: function (error) {
          //link não cadastrado
          sap.ui.core.BusyIndicator.hide();
          var erro = JSON.parse(error.responseText);
          MessageBox.error(erro.error.message.value);
        },
      });
    },

    /***************************************************************************
      popUpExterno
    ****************************************************************************/
    popUpExterno: function (Url) {
      window.open(Url, "Relatório de Resultados", "toolbar=no,menubar=no,resizable=no");
    },

    /***************************************************************************
      openAnexoList
    ****************************************************************************/
    openAnexoList: function (oEvent) {
      if (!this._oDialogAnexoList) {
        this._oDialogAnexoList = sap.ui.xmlfragment("FechamentoContabil.view.fragments.anexos", this);
        this.getView().addDependent(this._oDialogAnexoList);
        if (sap.ui.Device.system.phone) {
          this._oDialogAnexoList.setContentWidth("100%");
        } else {
          this._oDialogAnexoList.setContentWidth("700px");
          this._oDialogAnexoList.setContentHeight("500px");
        }
      }

      if (oEvent.getSource().getMetadata()._sClassName === "sap.ui.core.Icon") {
        sap.ui.getCore().byId("idUploaderAnexoFr").setVisible(false);
        key.iconAnexo = oEvent.getSource();
      } else {
        sap.ui.getCore().byId("idUploaderAnexoFr").setVisible(true);
        if (!sap.ui.Device.system.phone) {
          var oFileUploader = sap.ui.getCore().byId("fileUploaderFr");
          oFileUploader.setWidth("600px");
        }

        this.onPressFechaPopupOptions();
      }

      if (!sap.ui.Device.system.phone) {
        var oLegendaAnexo = sap.ui.getCore().byId("idLegendaAnexo");

        var oNotificationList = sap.ui.getCore().byId("notificationList");
        oLegendaAnexo.setWidth("600px");
        oNotificationList.setWidth("650px");
      }

      key.Profile = this.getView().byId("idInputModelo").getSelectedItem().getText();
      key.Instance = this.getView().byId("idInputPeriodo").getSelectedItem().getKey();
      key.NoAtual = this.getAtividadeGantt(key.iconAnexo);

      var vboxAnexos = sap.ui.getCore().byId("idVBoxAnexosFr");
      vboxAnexos.setVisible(false);

      var selectList = sap.ui.getCore().byId("selectAnexoList");
      selectList.removeAllItems();

      this.getDadosECC("atividadeAnexos");

      this._oDialogAnexoList.open();
    },

    /***************************************************************************
      onAnexoDialogClose
    ****************************************************************************/
    onAnexoDialogClose: function () {
      if (this._oDialogAnexoList) {
        this._oDialogAnexoList.close();
        this._oDialogAnexoList.destroy();
        this._oDialogAnexoList = undefined;
      }
    },

    /***************************************************************************
      openVideoList
    ****************************************************************************/
    openVideoList: function () {
      // var oCaminhoJson = $.sap.getModulePath("FechamentoContabil", "/Videos/lista.json");
      // var oModel = new JSONModel(oCaminhoJson);

      // if (!this._oDialogVideoList) {
      //   this._oDialogVideoList = sap.ui.xmlfragment("FechamentoContabil.view.fragments.videoList", this);
      //   this._oDialogVideoList.setModel(oModel);
      //   this.getView().addDependent(this._oDialogVideoList);
      //   this._oDialogVideoList.setContentWidth("600px");
      //   this._oDialogVideoList.setContentHeight("300px");
      // }

      // this._oDialogVideoList.open();
    },

    /***************************************************************************
      onVideoListClose
    ****************************************************************************/
    onVideoListClose: function (oEvent) {
      if (this._oDialogVideoList) {
        this._oDialogVideoList.close();
        this._oDialogVideoList.destroy();
        this._oDialogVideoList = undefined;
      }
    },
    /***************************************************************************
      onVideoSearch
    ****************************************************************************/
    onVideoSearch: function (oEvent) {
      // var sValue = oEvent.getParameter("value");
      // var oFilter = new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.Contains, sValue);
      // var oBinding = oEvent.getSource().getBinding("items");
      // oBinding.filter([oFilter]);
    },

    /***************************************************************************
      onVideoListClick
    ****************************************************************************/
    onVideoListClick: function (oEvent) {
      // var oSelectedItem = oEvent.getParameter("selectedItem");

      // if (oSelectedItem) {
      //   if (!this._oDialogVideoPlayer) {
      //     this._oDialogVideoPlayer = sap.ui.xmlfragment("FechamentoContabil.view.fragments.videoPlayer", this);
      //     this.getView().addDependent(this._oDialogVideoPlayer);

      //     if (sap.ui.Device.system.phone) {
      //       this._oDialogVideoPlayer.setContentWidth("100%");
      //     } else {
      //       this._oDialogVideoPlayer.setContentWidth("930px");
      //       this._oDialogVideoPlayer.setContentHeight("520px");
      //     }
      //   }

      //   var oVideoContainer = sap.ui.getCore().byId("VideoPlayer");
      //   oVideoContainer.removeAllItems();

      //   //Caminho do arquivo
      //   var oArquivo = "/Videos/Video_" + oSelectedItem.getInfo() + ".json";

      //   var oCaminhoJson = $.sap.getModulePath("FechamentoContabil", oArquivo);
      //   var oModel = new JSONModel();

      //   var oSize = "";

      //   if (sap.ui.Device.system.phone) {
      //     oSize = 'width="99%"';
      //   } else {
      //     oSize = 'width="920" height="514"';
      //   }

      //   var htmlDiv = new sap.ui.core.HTML();
      //   htmlDiv.setContent("<video autoplay " + oSize + " controls ></video>");
      //   oVideoContainer.addItem(htmlDiv);

      //   oModel.attachEventOnce(
      //     "requestCompleted",
      //     function () {
      //       var oVideo = {
      //         mime: oModel.getProperty("/mime"),
      //         data: oModel.getProperty("/data"),
      //       };

      //       htmlDiv.setContent("<video autoplay " + oSize + ' controls src="data:' + oVideo.mime + ";base64," + oVideo.data + '" ></video>');
      //       oVideoContainer.removeAllItems();
      //       oVideoContainer.addItem(htmlDiv);

      //       this._oDialogVideoPlayer.setBusy(false);
      //     },
      //     this
      //   );

      //   oModel.loadData(oCaminhoJson);

      //   var oVideoPlayerDialog = sap.ui.getCore().byId("VideoPlayerDialog");
      //   oVideoPlayerDialog.setTitle(oSelectedItem.getDescription());
      //   this._oDialogVideoPlayer.setBusy(true);
      //   this._oDialogVideoPlayer.open();
      // }
    },

    /***************************************************************************
      onVideoPlayerClose
    ****************************************************************************/
    onVideoPlayerClose: function () {
      if (this._oDialogVideoPlayer) {
        this._oDialogVideoPlayer.close();
        this._oDialogVideoPlayer.destroy();
        this._oDialogVideoPlayer = undefined;
      }
    },

    /***************************************************************************
      onBtnLinkClick
    ****************************************************************************/
    onBtnLinkClick: function (oEvent) {
      if (!this._oDialogLinkList) {
        this._oDialogLinkList = sap.ui.xmlfragment("FechamentoContabil.view.fragments.hyperlinks", this);
        this._oDialogLinkList.setModel(this.getView().getModel());
        this.getView().addDependent(this._oDialogLinkList);
        this._oDialogLinkList.setContentWidth("600px");
        this._oDialogLinkList.setContentHeight("300px");
      }

      this._oDialogLinkList.setBusy(true);
      this.onPressFechaPopupOptions();
      this.getLinkTarefa(oEvent);
      this._oDialogLinkList.open();
    },

    /***************************************************************************
      onLinkListClick
    ****************************************************************************/
    onLinkListClick: function (oEvent) {
      var oLink = oEvent.getParameter("listItem").getDescription();

      if (sap.ui.Device.system.phone) {
        window.location.href = oLink;
      } else {
        //Abre em uma janela PopUp
        sap.m.URLHelper.redirect(oLink, true);
      }
    },

    /***************************************************************************
      onLinkListClose
    ****************************************************************************/
    onLinkListClose: function (oEvent) {
      if (this._oDialogLinkList) {
        this._oDialogLinkList.close();
        this._oDialogLinkList.destroy();
        this._oDialogLinkList = undefined;
      }
    },

    /***************************************************************************
      onAddNewLink
    ****************************************************************************/
    onAddNewLink: function () {
      if (!this._oDialogNewLink) {
        this._oDialogNewLink = sap.ui.xmlfragment("FechamentoContabil.view.fragments.newHyperlink", this);
        this._oDialogNewLink.setModel(this.getView().getModel());
        this.getView().addDependent(this._oDialogNewLink);
        this._oDialogNewLink.setContentWidth("550px");
        this._oDialogNewLink.setContentHeight("280px");
      }

      this._oDialogNewLink.open();
    },

    /***************************************************************************
      onCloseDialogLink
    ****************************************************************************/
    onCloseDialogLink: function () {
      if (this._oDialogNewLink) {
        this._oDialogNewLink.close();
        this._oDialogNewLink.destroy();
        this._oDialogNewLink = undefined;
      }
    },

    /***************************************************************************
      onDeleteLink
    ****************************************************************************/
    onDeleteLink: function (oEvent) {
      var oList = oEvent.getSource();
      var oItem = oEvent.getParameter("listItem");
      var sPath = oItem.getBindingContext().getPath();
      var that = this;

      //Confirmação
      MessageBox.warning("O hyperlink será removido em todas as instâncias. Essa ação não poderá ser desfeita.", {
        actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
        onClose: function (sAction) {
          if (sAction === sap.m.MessageBox.Action.OK) {
            //Após deletar, volta o foco para a Lista
            oList.attachEventOnce("updateFinished", oList.focus, oList);

            // Remove o Item selecionado
            that.getView().getModel().remove(sPath);
          }
        },
      });
    },

    /***************************************************************************
      getLinkTarefa
    ****************************************************************************/
    getLinkTarefa: function (oEvent) {
      var that = this;

      var filterPlano = new sap.ui.model.Filter({
        path: "Plano",
        operator: sap.ui.model.FilterOperator.EQ,
        value1: this.getView().byId("idInputModelo").getSelectedItem().getText().trim(),
      });

      var filterTarefa = new sap.ui.model.Filter({
        path: "Tarefa",
        operator: sap.ui.model.FilterOperator.EQ,
        value1: this.getAtividadeGantt(key.iconAnexo).trim(),
      });

      var oSelectDialog = sap.ui.getCore().byId("LinkListDialog");

      oSelectDialog.bindAggregation("items", {
        path: "/LinkTarefas",
        filters: [filterPlano, filterTarefa],
        template: new sap.m.StandardListItem({
          title: "{Nome}",
          description: "{Link}",
          tooltip: "{Descricao}",
          icon: "sap-icon://chain-link",
          iconDensityAware: false,
          iconInset: false,
          highlight: "Information",
          type: "Active",
          wrapping: true,
        }),
      });

      that._oDialogLinkList.setBusy(false);
    },

    /***************************************************************************
      onLinkCreate
    ****************************************************************************/
    onLinkCreate: function (oEvent) {
      var that = this;

      //Valida URL
      try {
        var oUrl = new URL(sap.ui.getCore().byId("inputUrlHyperlink").getValue());
      } catch (_) {
        MessageBox.error('A URL deve iniciar com "http://" ou "https://"');
        return;
      }

      var oLink = {
        Plano: this.getView().byId("idInputModelo").getSelectedItem().getText().trim(),
        Tarefa: this.getAtividadeGantt(key.iconAnexo).trim(),
        Nome: sap.ui.getCore().byId("inputNomeHyperlink").getValue(),
        Descricao: sap.ui.getCore().byId("inputDescHyperlink").getValue(),
        Link: oUrl.href,
      };

      var mParameters = {
        success: function (oNewLink, oResponse) {
          sap.m.MessageToast.show("Hiperlink cadastrado com sucesso");
          that.onCloseDialogLink();
        },
        error: function (oError) {
          //Captura erros retornados do SAP
          var msgErro = JSON.parse(oError.responseText).error.message.value;
          MessageBox.error(msgErro);
        },
      };

      var oDataModel = this.getView().getModel();
      oDataModel.create("/LinkTarefas", oLink, mParameters);
    },

    createModel: function (json, modelName) {
      const oViewModel = new JSONModel(json);
      this.getView().setModel(oViewModel, modelName);
    },
    /*	Fim - Rodrigo Cano(Iteam) */

    getAtividadeStatus: function (status) {

      if (status === "R") {
        return "Em processamento";
      }

      if (status === "0") {
        return "Concluído sem erros";
      }

      if (status === "2") {
        return "Concluído com avisos";
      }

      if (status === "4") {
        return "Concluído com erros";
      }

      if (status === "1") {
        return "Em Aprovação";
      }

      return "Não Iniciada";

    },

    getAtividadeRespExec: function (oEvent) {
      var metadata = oEvent.getMetadata();
      var parent;

      if (metadata.getName() === "sap.ui.base.Event") parent = oEvent.getSource().getParent();
      else parent = oEvent.getParent();

      for (var i = 0; i < 6; i++) {
        if (parent.getMetadata()._sClassName === "sap.ui.table.Row") break;
        parent = parent.getParent();
      }
      var cells = parent.getCells();
      var hbox = cells[7];
      if (this.getView().getViewName() === "FechamentoContabil.view.Atividades") {
        var items = hbox.getItems();
        return items[0].getText()
      }
    },

    getAtividadeEmpresa: function (oEvent) {
      var metadata = oEvent.getMetadata();
      var parent;

      if (metadata.getName() === "sap.ui.base.Event") parent = oEvent.getSource().getParent();
      else parent = oEvent.getParent();

      for (var i = 0; i < 6; i++) {
        if (parent.getMetadata()._sClassName === "sap.ui.table.Row") break;
        parent = parent.getParent();
      }
      var cells = parent.getCells();
      var hbox = cells[3];
      if (this.getView().getViewName() === "FechamentoContabil.view.Atividades") {
        var items = hbox.getItems();
        return items[0].getText()
      }
    },

    updateEmailSuggestions: function (oEvent) {
      this._updateEmailSuggestion = 4;

      if (this._updatingSuggestion === undefined) this._updatingSuggestion = false;

      if (!this._updatingSuggestion) {
        this._updatingSuggestion = true;
        this.updateSuggestion(oEvent);
      }
    },

    updateSuggestion: function (oEvent) {
      setTimeout(() => {

        if (this._updateEmailSuggestion === undefined) this._updateEmailSuggestion = 4;

        this._updateEmailSuggestion -= 1;

        if (this._updateEmailSuggestion > 0) this.updateSuggestion(oEvent);
        else {
          let controlId;

          if (oEvent.target.id.indexOf("sendTaskInputEmail") !== -1) controlId = "sendTaskInputEmail";

          const multiInput = this.byId(controlId);

          multiInput.setBusy(true);

          const filter = new sap.ui.model.Filter({
            // required from "sap/ui/model/Filter"
            path: "Name",
            operator: sap.ui.model.FilterOperator.EQ, // required from "sap/ui/model/FilterOperator"
            value1: multiInput.getValue(),
          });

          const oParams = {
            useBatch: false,
          };
          const oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/", oParams);

          oModel.read("/v2_help_users_office", {
            filters: [filter],
            top: 5,
            success: function (oData) {
              multiInput.setBusy(false);

              multiInput.removeAllSuggestionRows();

              for (const result of oData.results) {
                const newRow = new sap.m.ColumnListItem({
                  cells: [
                    new sap.m.Text({
                      text: result.DisplayName,
                    }),
                    new sap.m.Text({
                      text: result.UserPrincipalName,
                    }),
                  ],
                });

                multiInput.addSuggestionRow(newRow);
              }

              this._updatingSuggestion = false;
            }.bind(this),
            error: function (error) {
              multiInput.setBusy(false);
              sap.m.MessageToast.show("Erro ao buscar emails");
              this._updatingSuggestion = false;
            }.bind(this)
          });
        }
      }, 250);
    },

    emailSugestionSelected: function (oEvent) {
      const selectedCells = oEvent.getParameter('selectedRow').getCells();
      const newToken = new sap.m.Token({ key: selectedCells[1].getText(), text: selectedCells[1].getText() });
      oEvent.getSource().addToken(newToken);
      // this.onDataChanged();
    },

    multiInputEmailValidator: function (args) {
      const text = args.text;
      if (text.indexOf("@") !== -1)
        return new sap.m.Token({ key: text, text: text });
    }

  });
});
