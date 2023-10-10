"use strict";

sap.ui.define(['sap/ui/model/json/JSONModel', 'sap/ui/core/Fragment'], function (JSONModel, Fragment) {
  var attachment = {
    /**
     * @function
     * @name showAttachment
     * @description - Mostrar adjuntos del contexto
     *
     * @public
     * @param {sap.ui.base.Event} oEvent - An Event object consisting of an id, a source and a map of parameters.
     * @returns {void} - No retorna nada.
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    showAttachment: function showAttachment(oEvent) {
      attachment.controller = this.controller;
      var oSource = oEvent.getSource();

      var _oSource$getBindingCo = oSource.getBindingContext('process'),
          sPath = _oSource$getBindingCo.sPath;

      var oItemPressed = oSource.getModel('process').getProperty(sPath);
      var oModel = new JSONModel();
      oModel.setData(oItemPressed);
      attachment.controller.setModel(oModel, 'oItemPressed');

      attachment._openListAttachment(attachment.controller);
    },

    /**
     * @function
     * @name showAttachmentSolPed
     * @description - Mostrar adjuntos SolPed del contexto
     *
     * @public
     * @param {sap.ui.base.Event} oEvent - An Event object consisting of an id, a source and a map of parameters.
     * @returns {void} - No retorna nada.
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    showAttachmentSolPed: function showAttachmentSolPed(oEvent) {
      attachment.controller = this.controller;
      var oSource = oEvent.getSource();

      var _oSource$getBindingCo2 = oSource.getBindingContext('process'),
          sPath = _oSource$getBindingCo2.sPath;

      var oItemPressed = oSource.getModel('process').getProperty(sPath);
      var oModel = new JSONModel();
      oModel.setData(oItemPressed);
      attachment.controller.setModel(oModel, 'oItemPressed');

      attachment._openListAttachmentSolPed(attachment.controller);
    },

    /**
     * @function
     * @name openFindApprover
     * @description - Abrir fragment para seleccionar aprobador
     *
     * @private
     * @returns
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _openListAttachment: function _openListAttachment(controller) {
      var _this = this;

      if (!this._oListAttachment) {
        var oView = controller.getView();
        Fragment.load({
          id: oView.getId(),
          name: 'com.innova.sitrack.view.purchaseTracking.fragment.attachment.ListAttachment',
          controller: this
        }).then(function (control) {
          var oDialog =
          /** @type {sap.m.Dialog} */
          control; // connect dialog to the root view of this component (models, lifecycle)

          oView.addDependent(oDialog);
          oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
          _this._oListAttachment = oDialog;
          oDialog.getModel('oItemPressed').refresh();
          oDialog.open();
        });
      } else {
        this._oListAttachment.open();
      }
    },

    /**
     * @function
     * @name _openListAttachmentSolPed
     * @description - Abrir fragment lista de adjuntos SolPed
     *
     * @private
     * @returns
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _openListAttachmentSolPed: function _openListAttachmentSolPed(controller) {
      var _this2 = this;

      var oView = controller.getView();

      if (!this._oListAttachmentSolPec) {
        Fragment.load({
          id: oView.getId(),
          name: 'com.innova.sitrack.view.purchaseTracking.fragment.attachment.ListAttachmentSolPed',
          controller: this
        }).then(function (control) {
          var oDialog =
          /** @type {sap.m.Dialog} */
          control; // connect dialog to the root view of this component (models, lifecycle)

          oView.addDependent(oDialog);
          oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
          _this2._oListAttachmentSolPec = oDialog;
          oDialog.getModel('oItemPressed').refresh();
          oDialog.open();
        });
      } else {
        oView.getModel('oItemPressed').getData();

        this._oListAttachmentSolPec.open();
      }
    },

    /**
     * @function
     * @name onViewAttachment
     * @description - Mostrar adjuntos del contexto
     *
     * @public
     * @param {sap.ui.base.Event} oEvent - An Event object consisting of an id, a source and a map of parameters.
     * @returns {void} - No retorna nada.
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    onViewAttachment: function onViewAttachment(oEvent) {
      var oSource = oEvent.getSource();
      var oItemPressed = oSource.getModel('oItemPressed');
      var oDataItemPressed = oItemPressed.getData();
      var sPathAttachment = oSource.getBindingContextPath();
      var oView = attachment.controller;
      var oController = oView.getView().getController();
      oController.onConsultAttachment(oDataItemPressed, sPathAttachment);
    },

    /**
     * @function
     * @name onViewAttachmentSolPed
     * @description - Mostrar adjuntos del contexto SolPed
     *
     * @public
     * @param {sap.ui.base.Event} oEvent - An Event object consisting of an id, a source and a map of parameters.
     * @returns {void} - No retorna nada.
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    onViewAttachmentSolPed: function onViewAttachmentSolPed(oEvent) {
      var oSource = oEvent.getSource();
      var oItemPressed = oSource.getModel('oItemPressed');
      var oDataItemPressed = oItemPressed.getData();
      var sPathAttachment = oSource.getBindingContextPath();
      var oView = attachment.controller;
      var oController = oView.getView().getController();
      oController.onConsultAttachmentSolPed(oDataItemPressed, sPathAttachment);
    }
  };
  return attachment;
});