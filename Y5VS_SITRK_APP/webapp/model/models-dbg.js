"use strict";

sap.ui.define(['./session/SessionStorageModel', 'sap/ui/model/BindingMode', 'sap/ui/model/json/JSONModel', 'sap/ui/Device'], function (SessionStorageModel, BindingMode, JSONModel, Device) {
  return {
    createDeviceModel: function createDeviceModel() {
      var oModel = new JSONModel(Device);
      oModel.setDefaultBindingMode('OneWay');
      return oModel;
    },
    createMainModel: function createMainModel() {
      // create and set main model
      var oMainModel = new SessionStorageModel('MAIN', {
        catalog: {},
        sysParams: {},
        textPool: {}
      });
      oMainModel.setDefaultBindingMode('OneWay');
      return oMainModel;
    },
    createStoreModel: function createStoreModel() {
      // create and set main model
      var oStoreModel = new JSONModel({
        req: {},
        res: {}
      });
      oStoreModel.setDefaultBindingMode(BindingMode.OneWay);
      return oStoreModel;
    },
    createPaymentModel: function createPaymentModel() {
      // create and set payment model
      var oPaymentModel = new JSONModel({
        req: {},
        res: {}
      });
      oPaymentModel.setDefaultBindingMode(BindingMode.OneWay);
      return oPaymentModel;
    }
  };
});