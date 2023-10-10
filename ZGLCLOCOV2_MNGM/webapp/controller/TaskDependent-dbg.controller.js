sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/m/library", "sap/ui/core/Fragment", "sap/m/Popover", "sap/m/Button", "sap/m/FormattedText", "sap/m/HBox", "sap/ui/model/Sorter", "sap/m/MessageToast"], function (BaseController, JSONModel, formatter, mobileLibrary, Fragment, Popover, Button, FormattedText, HBox, Sorter, MessageToast) {
  "use strict";

  // shortcut for sap.m.URLHelper
  var URLHelper = mobileLibrary.URLHelper;

  return BaseController.extend("votorantim.corp.clocov2planmanagement.controller.TaskDependent", {
    formatter: formatter,

    onInit: function () {
      this.byId("idGrapPredSuc").setCurrentZoomLevel(0.85);

      this.createModel(
        {
          cols: [
            {
              label: "Tarefa",
              template: "DescTarefa",
              width: "37%",
            },
            {
              label: "Responsável",
              template: "RespExec",
              width: "16%",
            },
            {
              label: "Caminho",
              template: "Caminho",
              width: "47%",
            },
          ],
        },
        "columnsSearchDeps"
      );

      this.createModel(
        {
          nodes: [],
          lines: [],
        },
        "graphPredSuc"
      );

      this.createModel([], "dependentGraphNode");
      this.createModel([], "dependentGraphLine");
      this.createModel([], "newGraphItemsNode");
      this.createModel([], "newGraphItemsLine");
      this.createModel([], "dependentsOfNewItems");
      this.createModel([], "linesRemoved");

      this.getView().attachModelContextChange(null, this.onContextChange, this);

    },

    onExit: function () {
      this.getView().detachModelContextChange(this.onContextChange, this);
    },

    onContextChange: function (oEvent) {
      if (!this.getView().getModel()) return;
      if (!this.getView().getBindingContext()) return;
      const context = this.getView().getBindingContext().getObject();
      if (this._lastItem === context.NodeID) return;
      this._lastItem = context.NodeID;

      const deps = this.getView().getBindingContext().getProperty("toDependentes");
      const dependentsGraphNode = [];
      const dependentsGraphLine = [];
      for (const dep of deps) {
        const depData = this.getView().getModel().getProperty("/" + dep);
        this.mountNodes(depData, dependentsGraphNode, dependentsGraphLine);
      }
      this.getModel("dependentGraphNode").setProperty("/", dependentsGraphNode);
      this.getModel("dependentGraphLine").setProperty("/", dependentsGraphLine);
      this.getModel("newGraphItemsNode").setProperty("/", []);
      this.getModel("newGraphItemsLine").setProperty("/", []);
      this.getModel("dependentsOfNewItems").setProperty("/", []);

      this.mountGraph(context);
    },

    mountNodes: function (depData, dependentsGraphNode, dependentsGraphLine) {
      if (depData.Item_prev === "000000000000") {
        dependentsGraphNode.push(depData);
        return;
      }
      else {
        dependentsGraphLine.push(depData);
      }

      if (this.getDependentIndex(dependentsGraphNode, depData.NodeID) === -1) {
        const depGraphNode = { ...depData };
        depGraphNode.Item_prev = "000000000000";
        dependentsGraphNode.push(depGraphNode);
      }
    },

    openSearchHelpDependent: function (oEvent) {
      const source = oEvent.getSource();

      if (!this._taskView) this._taskView = this.getRootView("votorantim.corp.clocov2planmanagement.view.Task");

      var oSorter = new Sorter({
        path: 'Caminho',
        descending: false
      });

      const dataPath = {
        path: this._taskView.getBindingContext().getPath() + "/to_tarefas",
        sorter: oSorter,
      };

      let type;
      let title;
      if (source.getId().indexOf("idBtnAddPredGraph") !== -1) {
        title = this.getView().getModel("i18n").getResourceBundle().getText("taskSelectPredec");
        type = "predecessor";
      }

      if (source.getId().indexOf("idBtnAddSucGraph") !== -1) {
        title = this.getView().getModel("i18n").getResourceBundle().getText("taskSelectPredec");
        type = "sucessor";
      }

      const addDep = function (oEvent) {
        this.onSHPressPredTasks(oEvent, type)
      }

      const fieldsSearch = ["DescTarefa", "RespExec", "Caminho"];
      this.onValueHelpRequested(dataPath, "columnsSearchDeps", title, fieldsSearch, addDep.bind(this), true);

    },

    onSHPressPredTasks: function (oEvent, type) {

      const currentGraphSelection = this._graphRightClickNode[0].getValue().taskDetail;
      if (!this._taskView) this._taskView = this.getRootView("votorantim.corp.clocov2planmanagement.view.Task");
      const table = this._oValueHelpDialog.getTable();
      let selectedIndices = table.getSelectedIndices();
      const newGraphItemsNode = this.getView().getModel("newGraphItemsNode").getProperty("/");
      const newGraphItemsLine = this.getView().getModel("newGraphItemsLine").getProperty("/");
      const dependentGraphNode = this.getView().getModel("dependentGraphNode").getProperty("/");

      const checkSelectedItems = [];
      for (const indice of selectedIndices) {
        const object = table.getContextByIndex(indice).getObject();
        if (object.Empresa !== "")
          checkSelectedItems.push(indice);
        else
          MessageToast.show(`Erro: Tarefa ${object.DescTarefa} não tem empresa cadastrada`);
      }
      selectedIndices = checkSelectedItems;

      if (selectedIndices.length === 0) return;

      this.onDataChanged();

      const getDependentsOfNewItems = [];
      for (const indice of selectedIndices) {
        const object = table.getContextByIndex(indice).getObject();

        if (object.NodeID === currentGraphSelection.NodeID) continue;
        if (type === "predecessor")
          getDependentsOfNewItems.push(object);
        else
          getDependentsOfNewItems.push(currentGraphSelection);
      }

      this.getDependentsOfNewItems(getDependentsOfNewItems).then(() => {
        for (const indice of selectedIndices) {
          const object = table.getContextByIndex(indice).getObject();

          if (object.NodeID === currentGraphSelection.NodeID) continue;

          let selectedTask;

          let alreadyExists = dependentGraphNode.findIndex((data) => {
            return data.Item_prev === object.Item_prev || data.NodeID === object.NodeID;
          })
          if (alreadyExists !== -1) continue;

          alreadyExists = newGraphItemsNode.findIndex((data) => {
            return data.Item_prev === object.Item_prev || data.NodeID === object.NodeID;
          })
          if (alreadyExists !== -1) continue;

          if (type === "predecessor") {
            selectedTask = object;
          }
          else
            selectedTask = currentGraphSelection;

          let newEntryGraphLine;
          if (type === "predecessor")
            newEntryGraphLine = this.newTaskBody(currentGraphSelection, object);
          else
            newEntryGraphLine = this.newTaskBody(object, currentGraphSelection);

          newGraphItemsLine.push(newEntryGraphLine);

          let pos = this.getDependentIndex(newGraphItemsNode, object.NodeID);
          if (pos === -1) {
            pos = this.getDependentIndex(dependentGraphNode, object.NodeID);
            if (pos === -1) {
              const newEntryGraphNode = this.newTaskBody(object, { NodeID: "000000000000" });
              newGraphItemsNode.push(newEntryGraphNode);
            }
          }

          const sGroupId = "changeDep";
          this._taskView.getModel().setDeferredGroups([sGroupId]);
          this._taskView.getModel().createEntry("/v2_dependentes", { properties: newEntryGraphLine, groupId: sGroupId });
        }

        this.getView().getModel("newGraphItemsNode").setProperty("/", newGraphItemsNode);
        this.getView().getModel("newGraphItemsLine").setProperty("/", newGraphItemsLine);

        this.mountGraph();

        this._oValueHelpDialog.close();

      });
    },

    getDependentsOfNewItems: async function (getDependentsOfNewItems) {
      const groupId = "depofnewitems";
      this.getView().setBusy(true);
      this.getModel().setDeferredGroups([groupId]);

      if (getDependentsOfNewItems.length === 0) return;

      for (const getDependentsOfNewItem of getDependentsOfNewItems) {
        this.getModel().read(`/v2_dependentes(Profile='${getDependentsOfNewItem.Profile}',Instance=${getDependentsOfNewItem.Instance},NodeID='${getDependentsOfNewItem.NodeID}',Item_prev='')/toDependentes`, {
          groupId: groupId,
        });
      }

      await new Promise((resolve, reject) => {
        this.getModel().submitChanges({
          groupId: groupId,
          success: function (oData, oResponse) {
            const dependentsOfNewItems = this.getModel("dependentsOfNewItems").getProperty("/");
            for (const batchResponse of oData.__batchResponses) {
              dependentsOfNewItems.push(...batchResponse.data.results)
            }
            this.getModel("dependentsOfNewItems").setProperty("/", dependentsOfNewItems);
            this.getView().setBusy(false);
            resolve(oResponse);
          }.bind(this)
        })
      });

      return;
    },

    onDataChanged: function () {
      if (!this._taskView) this._taskView = this.getRootView("votorantim.corp.clocov2planmanagement.view.Task");
      if (!this._taskView.getModel("taskView").getProperty("/hasChanges")) {
        this._taskView.byId("ObjectPageTask").setShowFooter(true);
        this._taskView.getModel("taskView").setProperty("/hasChanges", true);
      }
      this._lastItem = null;
      this.getView().getModel("taskView").setProperty("/suggestMassChanges", true);
    },

    onPressRemoveDep: function (oEvent, taskDetails) {

      const newGraphItemsLine = this.getView().getModel("newGraphItemsLine").getProperty("/");
      if (!this._taskView) this._taskView = this.getRootView("votorantim.corp.clocov2planmanagement.view.Task");

      this.onDataChanged();

      const mParameters = { groupId: "changeDep" };
      const fullPath = `/v2_dependentes(Profile='${taskDetails.toDetail.Profile}',Instance=${taskDetails.toDetail.Instance},NodeID='${taskDetails.to}',Item_prev='${taskDetails.from}')`;

      const depIsNew = newGraphItemsLine.findIndex((data) => {
        return data.Item_prev === taskDetails.from && data.NodeID === taskDetails.to;
      })

      if (depIsNew === -1) {

        this._taskView.getModel().setDeferredGroups(["changeDep"]);
        this._taskView.getModel().remove(fullPath, mParameters);
        this.removeFromGraph(true, taskDetails);
      } else {
        for (const [key, value] of Object.entries(this._taskView.getModel().getPendingChanges())) {
          if (value.NodeID === taskDetails.to && value.Item_prev === taskDetails.from) {
            this._taskView.getModel().resetChanges(["/" + key], true, true);
            break;
          }
        }
        this.removeFromGraph(false, taskDetails);
        // newGraphItemsLine.splice(depIsNew, 1);
        // this.getView().getModel("newGraphItemsLine").setProperty("/", newGraphItemsLine);
      }
      this.mountGraph();
    },

    removeFromGraph(fromOdata, taskDetails) {

      const dependentGraphNode = this.getModel("dependentGraphNode").getProperty("/");
      const dependentGraphLine = this.getModel("dependentGraphLine").getProperty("/");
      const newGraphItemsNode = this.getModel("newGraphItemsNode").getProperty("/");
      const newGraphItemsLine = this.getModel("newGraphItemsLine").getProperty("/");

      const linesRemoved = this.getModel("linesRemoved").getProperty("/");
      linesRemoved.push(taskDetails);
      this.getModel("linesRemoved").setProperty("/", linesRemoved);

      if (fromOdata) {
        const pos = dependentGraphLine.findIndex((data) => {
          return data.Item_prev === taskDetails.from && data.NodeID === taskDetails.to;
        })
        dependentGraphLine.splice(pos, 1);
        this.getModel("dependentGraphLine").setProperty("/", dependentGraphLine);
      }
      else {
        const pos = newGraphItemsLine.findIndex((data) => {
          return data.Item_prev === taskDetails.from && data.NodeID === taskDetails.to;
        })
        newGraphItemsLine.splice(pos, 1);
        this.getModel("newGraphItemsLine").setProperty("/", newGraphItemsLine);
      }

      const checkNode = (NodeID) => {

        if (!this._taskView) this._taskView = this.getRootView("votorantim.corp.clocov2planmanagement.view.Task");
        const contextObject = this._taskView.getBindingContext().getObject();
        if (contextObject.NodeID === NodeID) return;

        let pos = newGraphItemsLine.findIndex((data) => {
          return data.Item_prev === NodeID || data.NodeID === NodeID;
        })

        if (pos === -1) pos = dependentGraphLine.findIndex((data) => {
          return data.Item_prev === NodeID || data.NodeID === NodeID;
        })

        if (pos === -1) {
          pos = this.getDependentIndex(dependentGraphNode, NodeID);
          if (pos !== -1) {
            dependentGraphNode.splice(pos, 1);
            this.getModel("dependentGraphNode").setProperty("/", dependentGraphNode);
          }

          pos = this.getDependentIndex(newGraphItemsNode, NodeID);
          if (pos !== -1) {
            newGraphItemsNode.splice(pos, 1);
            this.getModel("newGraphItemsNode").setProperty("/", newGraphItemsNode);
          }
        }
      }

      checkNode(taskDetails.from);
      checkNode(taskDetails.to);

    },

    // getPrevFromNode

    pressOptionsGraph: function (oElement) {
      const oView = this.getView();
      const buttonDOM = oElement.getParameter("buttonElement");
      const graphNode = oElement.getSource().getParent();
      const customData = graphNode.getCustomData("task");

      if (!this._optionsNode) {
        this._optionsNode = Fragment.load({
          id: oView.getId(),
          name: "votorantim.corp.clocov2planmanagement.fragments.GraphOptions",
          controller: this
        }).then(function (oPopover) {
          oView.addDependent(oPopover);
          return oPopover;
        });
      }
      this._optionsNode.then(function (oPopover) {
        this._graphRightClickNode = customData;
        oPopover.openBy(buttonDOM);
      }.bind(this));
    },

    refreshGraph: function () {
      this.invalidate();
    },

    mountGraph: function (context) {

      const dependentGraphNode = this.getModel("dependentGraphNode").getProperty("/");
      const dependentsOfNewItems = this.getModel("dependentsOfNewItems").getProperty("/");
      const dependentGraphLine = this.getModel("dependentGraphLine").getProperty("/");
      const newGraphItemsNode = this.getModel("newGraphItemsNode").getProperty("/");
      const newGraphItemsLine = this.getModel("newGraphItemsLine").getProperty("/");
      const linesRemoved = this.getModel("linesRemoved").getProperty("/");
      const graphModel = this.getView().getModel("graphPredSuc");
      const nodes = graphModel.getProperty("/nodes");
      const lines = graphModel.getProperty("/lines");

      const newNode = (index, tascName, RespExec, Resp, InicioPlan, graphStatus, profile, instance, item, item_prev, company) => {
        return {
          key: index,
          title: tascName,
          graphStatus: graphStatus,
          attributes: [
            {
              label: "Empresa",
              value: company,
            },
            {
              label: "Início",
              value: InicioPlan,
            },
            {
              label: "Responsável Exec.",
              value: RespExec,
            },
            {
              label: "Responsável",
              value: Resp,
            },
          ],
          taskDetail: {
            Profile: profile,
            Instance: instance,
            NodeID: item,
            Item_prev: item_prev
          },
          actionButtons: [
            {
              icon: "sap-icon://overflow",
              title: "Opções",
            }
          ]
        };
      };

      const newLine = (from, to, fromDetail, toDetail) => {
        return {
          from: from,
          fromDetail: fromDetail,
          to: to,
          toDetail: toDetail,
          lineActions: [
            {
              icon: "sap-icon://delete",
              title: "Remover",
            }
          ]
        };
      };

      nodes.splice(0, nodes.length);
      lines.splice(0, lines.length);

      graphModel.setProperty("/nodes", nodes);
      graphModel.setProperty("/lines", lines);

      if (!context) context = this.getView().getBindingContext().getObject();

      nodes.push(newNode(context.NodeID, context.DescTarefa, context.RespExec, context.Resp, formatter.getEndPlanText(context.InicioPlanejadoDias, context.InicioPlanAposDataBase), "Success", context.Profile, context.Instance, context.NodeID, context.Item_prev, context.Empresa));

      for (const depData of dependentGraphNode) {
        if (depData.NodeID === context.NodeID) continue;
        nodes.push(newNode(depData.NodeID, depData.DescTarefa, depData.RespExec, depData.Resp, formatter.getEndPlanText2(depData.InicioPlanejadoDias, depData.InicioPlanAposDataBase), "", depData.Profile, depData.Instance, depData.NodeID, depData.Item_prev, depData.Empresa));
      };

      for (const depData of dependentGraphLine) {
        lines.push(newLine(depData.Item_prev, depData.NodeID, dependentGraphNode[this.getDependentIndex(dependentGraphNode, depData.Item_prev)], depData));
      }

      for (const newGraphItem of newGraphItemsNode) {
        nodes.push(newNode(newGraphItem.NodeID, newGraphItem.DescTarefa, newGraphItem.RespExec, newGraphItem.Resp, formatter.getEndPlanText(newGraphItem.InicioPlanejadoDias, newGraphItem.InicioPlanAposDataBase), "", newGraphItem.Profile, newGraphItem.Instance, newGraphItem.NodeID, newGraphItem.Item_prev, newGraphItem.Empresa));
      }

      for (const newGraphItem of newGraphItemsLine) {
        let fromDetail;
        let pos = this.getDependentIndex(dependentGraphNode, newGraphItem.Item_prev);

        if (pos !== -1) fromDetail = dependentGraphNode[pos];
        else fromDetail = newGraphItemsNode[this.getDependentIndex(newGraphItemsNode, newGraphItem.Item_prev)];

        lines.push(newLine(newGraphItem.Item_prev, newGraphItem.NodeID, fromDetail, newGraphItem));
      }

      for (const dependentsOfNewItem of dependentsOfNewItems) {
        let fromDetail;

        if (nodes.filter(item => item.key === dependentsOfNewItem.NodeID).length === 0)
          nodes.push(newNode(dependentsOfNewItem.NodeID, dependentsOfNewItem.DescTarefa, dependentsOfNewItem.RespExec, dependentsOfNewItem.Resp, formatter.getEndPlanText(dependentsOfNewItem.InicioPlanejadoDias, dependentsOfNewItem.InicioPlanAposDataBase), "", dependentsOfNewItem.Profile, dependentsOfNewItem.Instance, dependentsOfNewItem.NodeID, dependentsOfNewItem.Item_prev, dependentsOfNewItem.Empresa));

        if (dependentsOfNewItem.Item_prev === "000000000000") continue;

        if (lines.filter(item => item.to === dependentsOfNewItem.NodeID && item.from === dependentsOfNewItem.Item_prev).length === 0) {
          let pos = this.getDependentIndex(dependentGraphNode, dependentsOfNewItem.Item_prev);

          if (pos !== -1) fromDetail = dependentGraphNode[pos];
          else fromDetail = dependentsOfNewItems[this.getDependentIndex(dependentsOfNewItems, dependentsOfNewItem.Item_prev)];

          const isRemoved = linesRemoved.findIndex((data) => {
            return data.from === dependentsOfNewItem.Item_prev && data.to === dependentsOfNewItem.NodeID;
          })


          if (isRemoved === -1)
            lines.push(newLine(dependentsOfNewItem.Item_prev, dependentsOfNewItem.NodeID, fromDetail, dependentsOfNewItem));
        }
      }

      graphModel.setProperty("/nodes", nodes);
      graphModel.setProperty("/lines", lines);
    },

    getDependentIndex: function (dependents, NodeID) {
      return dependents.map(e => e.NodeID).indexOf(NodeID);
    },

    linePress: function (oEvent) {

      const line = oEvent.getSource();
      const taskDetails = line.getCustomData("task")[0].getValue();
      const htmlText = `<p style=\"text-align:Center\">A tarefa <span style=\"color: navy\"><strong>${taskDetails.fromDetail.DescTarefa}</strong></span> é <strong>predecessora</strong> da tarefa <span style=\"color: navy\"><strong>${taskDetails.toDetail.DescTarefa}</strong></span></p>`;

      const footer = new HBox({ justifyContent: "Center", items: [new Button({ text: "Remover", press: function (oEvent) { this.onPressRemoveDep(oEvent, taskDetails) }.bind(this) })] }).addStyleClass("sapUiTinyMarginBottom");

      if (!this._optionsLine) {
        this._optionsLine = new Popover({
          placement: "Bottom",
          showHeader: false,
          content: [new FormattedText({ htmlText: htmlText })],
          footer: footer,
        }).addStyleClass("sapUiResponsivePadding--content");
      }
      else {
        this._optionsLine.destroyFooter();
        this._optionsLine.setFooter(footer);
        this._optionsLine.getContent()[0].setHtmlText(htmlText);
      }

      // Prevents render a default tooltip
      oEvent.preventDefault();
      this._optionsLine.openBy(oEvent.getParameter("opener"));
    },

  });
});
