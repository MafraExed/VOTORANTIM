sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/m/library", "sap/m/Link", "sap/m/MessageToast"], function (BaseController, JSONModel, formatter, mobileLibrary, Link, MessageToast) {
  "use strict";

  // shortcut for sap.m.URLHelper
  var URLHelper = mobileLibrary.URLHelper;

  return BaseController.extend("votorantim.corp.clocov2planmanagement.controller.Folder", {
    onInit: function () {
      this.createModel(
        {
          hasChanges: false,
          dependentDialog: {
            display: "tree",
          },
        },
        "folderView"
      );

      this.getRouter().getRoute("folder").attachPatternMatched(this._onObjectMatched, this);
    },

    mountBreadcumb: function () {
      const pathComplete = this.getView("task").getBindingContext().getProperty("Caminho");
      const paths = pathComplete.split("/");
      const breadcumb = this.byId("idBreadcumbFolder");
      breadcumb.destroyLinks();
      for (const path of paths) {
        const link = new Link({ text: path, enabled: false });
        breadcumb.addLink(link);
      }
    },

    _onObjectMatched: function (oEvent) {
      this.getModel("appView").setProperty("/layout", "TwoColumnsBeginExpanded");
      let oArgs = oEvent.getParameter("arguments");

      let sItemPath = `/v2_pastas(Profile='${oArgs.profile}',Instance=${oArgs.instance},Item='${oArgs.item}')`;
      this._profile = oArgs.profile;
      this._instance = oArgs.instance;
      this._bindView(sItemPath);
    },

    _bindView: function (sObjectPath) {
      this.getView().bindElement({
        path: sObjectPath,
        events: {
          change: this._onBindingChange.bind(this),
          dataRequested: function () {
            this.getView().setBusy(true);
            // oViewModel.setProperty("/busy", true);
          }.bind(this),
          dataReceived: function () {}.bind(this),
        },
      });
    },

    _onBindingChange: function () {
      var oView = this.getView(),
        oElementBinding = oView.getElementBinding();

      if (!oElementBinding.getBoundContext()) {
        // this.getRouter().getTargets().display("detailObjectNotFound");
        this.getRouter().navTo(
          "detail",
          {
            profile: this._profile,
            instance: this._instance,
          },
          true
        );
        return;
      }
      this.mountBreadcumb();
      this.getView().setBusy(false);
    },

    onCloseDetailPress: function () {
      this.getModel("appView").setProperty("/actionButtonsInfo/endColumn/fullScreen", false);
      // No item should be selected on list after detail page is closed
      // this.getOwnerComponent().oListSelector.clearListListSelection();
      // set the layout property of FCL control to show two columns
      this.getModel("appView").setProperty("/layout", "OneColumn");
      this.getRouter().navTo("object", {
        objectId: "01",
        // objectId : oItem.getBindingContext().getProperty("OrderID")
      });
    },

    getFolderDetailViewId: function () {
      const sections = this.byId("ObjectPageFolder").getSections();
      const subsection = sections[0].getSubSections();
      const blocks = subsection[0].getBlocks();
      return blocks[0].getSelectedView();
    },

    onPressSaveFolder: function () {
      const fields = ["descFolderDetail"];
      const blockId = this.getFolderDetailViewId();

      // if (sap.ui.getCore().byId(blockId).byId("typeFolderDetail").getSelectedKey() === "BUKRS") {
      //   fields.push("btnCompanyFolder");
      // }

      if (this.validateInputFields(fields, sap.ui.getCore().byId(blockId))) return;

      this.validateInputSAP(["idResponsavel#user", "btnCalendarFolder#calendar"], sap.ui.getCore().byId(blockId)).then((error) => {
        if (error) return;

        this.getView().setBusy(true);
        this.getModel().setProperty("/" + this.getView().getBindingContext().getPath(), this.getView().getBindingContext().getObject());
        this.getModel().submitChanges({
          success: function (oData) {
            this.getView().setBusy(false);
            MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("appDataSaved"));
            this.byId("ObjectPageFolder").setShowFooter(false);
            this.getView().getModel("folderView").setProperty("/hasChanges", false);
            this.getOwnerComponent().getModel().refresh(true);
          }.bind(this),
        });
      });
    },

    /**
     * Toggle between full and non full screen mode.
     */
    toggleFullScreen: function () {
      var bFullScreen = this.getModel("appView").getProperty("/actionButtonsInfo/endColumn/fullScreen");
      this.getModel("appView").setProperty("/actionButtonsInfo/endColumn/fullScreen", !bFullScreen);
      if (!bFullScreen) {
        // store current layout and go full screen
        this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
        this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
      } else {
        // reset to previous layout
        this.getModel("appView").setProperty("/layout", this.getModel("appView").getProperty("/previousLayout"));
      }
    },
  });
});
