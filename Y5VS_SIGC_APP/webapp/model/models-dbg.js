"use strict";

sap.ui.define(['./session/SessionStorageModel', 'com/innova/sigc/model/process/EntProvEvaluationCriteria', 'com/innova/sigc/model/process/ProcessQuestionsType', 'com/innova/sigc/model/process/LevelEvaluationCriteria', 'com/innova/sigc/model/process/ValoracionEvaluationCriteria', 'sap/ui/Device', 'sap/ui/model/BindingMode', 'sap/ui/model/json/JSONModel'], function (SessionStorageModel, EntProvEvaluationCriteria, ProcessQuestionsType, LevelEvaluationCriteria, ValoracionEvaluationCriteria, Device, BindingMode, JSONModel) {
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
    createCriteriaModel: function createCriteriaModel() {
      var oModel = new JSONModel({
        level: LevelEvaluationCriteria,
        valoracion: ValoracionEvaluationCriteria,
        entradaProveedor: EntProvEvaluationCriteria
      });
      oModel.setDefaultBindingMode('OneWay');
      return oModel;
    },

    /**
     * @function
     * @name createQuestionModel
     * @description - Crea el modelo para las preguntas disponibles
     * .
     *
     * @publicir
     * @returns {sap.ui.model.json.JSONModel} - Modelo JSONModel
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    createQuestionModel: function createQuestionModel() {
      var oModel = new JSONModel({
        types: ProcessQuestionsType
      });
      oModel.setDefaultBindingMode('OneWay');
      return oModel;
    }
  };
});