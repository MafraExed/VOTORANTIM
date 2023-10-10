sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, JSONModel) {
        "use strict";

        return Controller.extend("modulenamevt.controller.Termo", {
            onInit: function () {

                this._oViewModel = new JSONModel({
                    mode: false
                });
                this.getView().setModel(this._oViewModel, "viewModel");
    
            },
            _getFormFields: function (oSimpleForm) {
                var aControls = [];
                var aFormContent = oSimpleForm.getContent();
                var sControlType;
                for (var i = 0; i < aFormContent.length; i++) {
                    sControlType = aFormContent[i].getMetadata().getName();
                    if (sControlType === "sap.m.Input" || sControlType === "sap.m.DateTimeInput" ||
                        sControlType === "sap.m.CheckBox") {
                        aControls.push({
                            control: aFormContent[i],
                            required: aFormContent[i - 1].getRequired && aFormContent[i - 1].getRequired()
                        });
                    }
                }
                return aControls;
            },

            _validateSaveEnablement: function () {

//                var  _oViewModel =  this.getView().getModel("viewModel");

                var aInputControls = this._getFormFields(this.getView().byId("idFormResposta"));
                var oControl;
                for (var m = 0; m < aInputControls.length; m++) {
                    oControl = aInputControls[m].control;
                    if (aInputControls[m].required) {
                        var sValue = oControl.getValue();
                        if (!sValue) {
                            this._oViewModel.setProperty("/mode", false);
                            return;
                        }
                    }
                }
                this._oViewModel.setProperty("/mode", true);
            },

            onTermo: function () {


                var l_termo = "Termo";
                var sRead = "ZET_VCLE_PDFSet(contexto='" + l_termo + "')" + "/$value";
                var URL = "/sap/opu/odata/sap/ZGWVCLE_TERMO_SRV/" + sRead;
                sap.m.URLHelper.redirect(URL, false);



            },

            onCiente: function () {



                // Valores de input da tela...
                //idInputNome
                //idInputCPF
                //idInputToken

                // Captura valores da tela...
                var oInputNome = this.getView().byId("idInputNome").getValue();

                var oInputCPF = this.getView().byId("idInputCPF").getValue();

                var oInputToken = this.getView().byId("idInputToken").getValue();

//                MessageToast.show(oInputNome + " " + oInputCPF + oInputToken);

                // Devolve a reposta para o backend...

//                var refOdata = this.getOwnerComponent().getModel("odataFuncaoRenovaBio");

                var odataPrincipal = this.getOwnerComponent().getModel();

                var  idBotaoCiente = this.getView().byId("_IDGenButton2");

                odataPrincipal.callFunction("/ZFI_VCLE_ACEITE", {
                    "method": "POST",
                    urlParameters: {
                        "nome": oInputNome,
                        "cpf":  oInputCPF,
                        "token": oInputToken,
                        "docnum": "1234567890"
                    },
                    success: function (oData, oResponse) {

                        if ( oData.id === 'S'){

                            sap.m.MessageToast.show(oData.message);
// Seta o botão como desabilitado após a confirmação da leitura do termo...
                            idBotaoCiente.setEnabled(false);

                        }
                        else

                        {

                            sap.m.MessageToast.show("Erro : "+ oData.message);

                        }

//                        sap.m.MessageToast.show("Aceite finalizado com sucesso.");

//                        odataPrincipal.refresh(true);

                    },
                    error: function (oError) {

                        sap.m.MessageToast.show("Erro : " + oData.message);

                    }
                });
            }
        }
        )
    })                

