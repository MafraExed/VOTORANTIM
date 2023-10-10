sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "sap/m/MessageToast"
], function (Controller, MessageBox, MessageToast) {
  "use strict";

  return Controller.extend("ZFI_VCDC_CARGO_BONIFIC.ZFI_VCDC_CARGO_BONIFIC.controller.View1", {
    onInit: function () {
      var sValue = jQuery.sap.getUriParameters().get("processo");
      var oModel = this.getView().getModel();
      var oEntry = {};
      var Key = "/ZET_CARREGAMENTOSet(Confirma='C',Processo='" + sValue + "')";
      var messagem = "";

      this.getView().byId("tProcess").setText(sValue);
      oEntry.Processo = sValue;
      oEntry.Confirma = "C";
      var that = this;

      oModel.update(Key, oEntry, {
        success: function (oData, oResponse) {
          that.getView().byId("button0").setVisible(true);
          that.getView().byId("button1").setVisible(true);
        },
        error: function (oError) {

          var otext = oError.responseText;
          var oMsg = JSON.parse(otext);
          messagem = oMsg.error.message.value;
          sap.m.MessageBox.error(messagem, {
            actions: ["OK"],
            onClose: function (sAction) {
              that.getView().byId("button0").setVisible(false);
              that.getView().byId("button1").setVisible(false);
            }
          });
          return;
        }
      });
    },

    onAprov: function () {
      var sValue = jQuery.sap.getUriParameters().get("processo");

      var oModel = this.getView().getModel();
      var oEntry = {};
      var Key = "/ZET_CARREGAMENTOSet(Confirma='Y',Processo='" + sValue + "')";

      oEntry.Processo = sValue;
      oEntry.Confirma = "Y";

      oModel.update(Key, oEntry, {
        success: function (oData, oResponse) {
          MessageBox.success("Pedido liberado para carregamento");
        },
        error: function (oError) {
          MessageBox.error("Erro ao aprovar portaria " + sValue + "");
        }
      });

    },

    onReprov: function () {
      var sValue = jQuery.sap.getUriParameters().get("processo");
      var oModel = this.getView().getModel();
      var oEntry = {};
      var Key = "/ZET_CARREGAMENTOSet(Confirma='N',Processo='" + sValue + "')";

      oEntry.Processo = sValue;
      oEntry.Confirma = "N";

      oModel.update(Key, oEntry, {
        success: function (oData, oResponse) {
          MessageBox.success("Pedido reprovado para carregamento");
        },
        error: function (oError) {
          MessageBox.error("Erro ao aprovar portaria " + sValue + "");
        }
      });

    }
  });
});