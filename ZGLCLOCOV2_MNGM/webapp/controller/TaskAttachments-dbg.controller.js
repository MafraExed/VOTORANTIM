sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/m/library", "sap/ui/core/Fragment", "sap/m/MessageBox", "sap/m/MessageToast"], function (BaseController, JSONModel, formatter, mobileLibrary, Fragment, MessageBox, MessageToast) {
  "use strict";

  return BaseController.extend("votorantim.corp.clocov2planmanagement.controller.TaskAttachments", {
    formatter: formatter,

    onInit: function () {
      this.createModel({ hasSelectedItems: false }, "attachmentView");
      this.createModel({}, "addAttachment");
    },

    onAnexarArquivo: function () {
      const oFileUploader = this.byId("fileUploader");

      if (oFileUploader.getValue() === "") {
        sap.m.MessageBox.error("Nenhum arquivo selecionado");
        return;
      }

      const fields = ["AddAttachTitle"];
      if (this.validateInputFields(fields)) return;

      if (!this._taskView) this._taskView = this.getRootView("votorantim.corp.clocov2planmanagement.view.Task");
      const contextObject = this._taskView.getBindingContext().getObject();

      const url = `/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/v2_tarefas(Profile='${contextObject.Profile}',Instance=${contextObject.Instance},NodeID='${contextObject.NodeID}')/to_anexo_upload`;

      oFileUploader.setSendXHR(true);
      oFileUploader.setUploadUrl(url);
      oFileUploader.removeAllHeaderParameters();
      const oHeaders = this._taskView.getModel().oHeaders;
      const sToken = oHeaders["x-csrf-token"];

      const newFileDetail = this.getView().getModel("addAttachment").getProperty("/");
      let slug = `${newFileDetail.Title}##${newFileDetail.Comment}##${oFileUploader.getValue()}`;
      slug = slug.replaceAll("\n", " ");

      slug = encodeURIComponent(slug);

      let oHeaderParameter = new sap.ui.unified.FileUploaderParameter({ name: "slug", value: slug });
      oFileUploader.addHeaderParameter(oHeaderParameter);
      oHeaderParameter = new sap.ui.unified.FileUploaderParameter({ name: "X-CSRF-Token", value: sToken });
      oFileUploader.addHeaderParameter(oHeaderParameter);

      this._addAttachmentDialog.then(function (oDialog) {
        oDialog.setBusy(true);
      });
      oFileUploader.upload();
    },

    handleUploadAttachment: function (oEvent) {
      this.onCloseAddAttachmentDialog();

      this.byId("fileUploader").setValue("");

      const sResponse = oEvent.getParameter("responseRaw");
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(sResponse, "text/xml");

      if (xmlDoc.getElementsByTagName("error").length > 0) {
        MessageBox.error(xmlDoc.getElementsByTagName("message")[0].textContent);
        return;
      }

      this.byId("idAttachmentTable").getBinding("items").refresh();
    },

    onPressAddAttachment: function () {
      const oView = this.getView();
      this.getView().getModel("addAttachment").setProperty("/", {});

      if (!this._addAttachmentDialog) {
        this._addAttachmentDialog = Fragment.load({
          id: oView.getId(),
          name: "votorantim.corp.clocov2planmanagement.fragments.AddAttachment",
          controller: this,
        }).then(function (oDialog) {
          oDialog.setModel(oView.getModel());
          oView.addDependent(oDialog);
          return oDialog;
        });
      }

      this._addAttachmentDialog.then(
        function (oDialog) {
          oDialog.open();
        }.bind(this)
      );
    },

    onCloseAddAttachmentDialog: function () {
      this._addAttachmentDialog.then(function (oDialog) {
        oDialog.setBusy(false);
        oDialog.close();
      });
    },

    onSelectChange: function () {

      const selectedItems = this.byId("idAttachmentTable").getSelectedItems();

      let hasSelectedItems = false;

      if (selectedItems.length > 0) {
        hasSelectedItems = true;
      }

      this.getModel("attachmentView").setProperty("/hasSelectedItems", hasSelectedItems);
    },

    onDeleteAttachments: function () {

      const table = this.byId("idAttachmentTable");

      const selectedItems = table.getSelectedItems();

      MessageBox.warning("Atenção! Todas os anexos selecionados serão excluídos. Deseja continuar?", {

        actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
        emphasizedAction: MessageBox.Action.OK,
        onClose: function (sAction) {

          if (sAction === MessageBox.Action.OK) {

            this.getView().setBusy(true);

            const oParams = {
              useBatch: true,
            };

            const oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/", oParams);
            const sGroupId = new Date().getTime();
            const requestParams = {};
            requestParams.groupId = sGroupId;
            oModel.setDeferredGroups([sGroupId]);

            for (const selectedItem of selectedItems) {
              const context = selectedItem.getBindingContext().getObject();
              requestParams.changeSetId = (Math.floor(Math.random() * 101) + Math.floor(Math.random() * 101));
              oModel.remove(`/v2_anexos(Profile='${context.Profile}',Instance=${context.Instance},Item='${context.Item}',fileId='${encodeURIComponent(context.fileId)}')`, requestParams);
            }

            oModel.submitChanges({
              success: function (oData, sResponse) {
                table.removeSelections();
                this.getModel("attachmentView").setProperty("/hasSelectedItems", false);
                this.getModel().refresh(true);
                this.getView().setBusy(false);
                MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("appDataSaved"));
              }.bind(this),
              error: function (oError) { }.bind(this),
            });
          }
        }.bind(this),
      });


    },
  });
});
