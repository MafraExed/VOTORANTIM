sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("votorantim.corp.clocov2planmanagement.controller.App", {

        onInit: function () {

            this.getModel().read("/v2_userInfo('')");

            var oViewModel,
                fnSetAppNotBusy,
                // iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

                oViewModel = new JSONModel({
                    progress: 15,
                    busy: false,
                    delay: 0,
                    layout: "OneColumn",
                    previousLayout: "",
                    actionButtonsInfo: {
                        midColumn: {
                            fullScreen: false
                        },
                        endColumn: {
                            fullScreen: false
                        },

                    }
                });
            this.setModel(oViewModel, "appView");

            fnSetAppNotBusy = function () {
                oViewModel.setProperty("/busy", false);
                oViewModel.setProperty("/delay", iOriginalBusyDelay);
            };

            // since then() has no "reject"-path attach to the MetadataFailed-Event to disable the busy indicator in case of an error
            // this.getOwnerComponent().getModel().metadataLoaded().then(fnSetAppNotBusy);
            // this.getOwnerComponent().getModel().attachMetadataFailed(fnSetAppNotBusy);

            // apply content density mode to root view
            // this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

            // jQuery.ajaxPrefilter(function (options, originalOptions, jqXHR) {
            //     var success = options.success;
            //     options.success = function (data, textStatus, jqXHR) {
            //         // override success handling
            //         if (typeof (success) === "function") return success(data, textStatus, jqXHR);
            //     };
            //     var error = options.error;
            //     options.error = function (jqXHR, textStatus, errorThrown) {
            //         // override error handling
            //         if (typeof (error) === "function") {
            //             window.alert("Sessão expirada ou erro na conexão com a internet. Atualize a página e tente novamente.")
            //             return error(jqXHR, textStatus, errorThrown);
            //         }
            //     };
            // });

            this.getModel().attachRequestFailed(function (oEvent) { window.alert("Sessão expirada ou erro na conexão com a internet. Atualize a página e tente novamente.") }, this);
        }

    });
});