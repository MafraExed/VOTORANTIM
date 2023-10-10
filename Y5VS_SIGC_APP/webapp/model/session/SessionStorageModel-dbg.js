"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['sap/ui/model/json/JSONModel', 'sap/ui/util/Storage', '../numberFormat'], function (JSONModel, Storage, numberFormat) {
  return JSONModel.extend('com.innova.sigc.model.session.SessionStorageModel', {
    _STORAGE_KEY: 'oMQDlug5EfvVaKq2JiZ',
    _storage: null,

    /**
     * Fetches the favorites from local storage and sets up the JSON model
     * By default the string "SESSIONSTORAGE_MODEL" is used but it is recommended to set a custom key
     * to avoid name clashes with other apps or other instances of this model class
      * @param {string} sStorageKey storage key that will be used as an id for the local storage data
     * @param {Object} oSettings settings objec that is passed to the JSON model constructor
     * @return {sap.ui.demo.cart.model.LocalStorageModel} the local storage model instance
     */
    constructor: function constructor() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var sStorageKey = args[0]; // call super constructor with everything from the second argument

      JSONModel.apply(this, [].slice.call(args, 1));
      this.setSizeLimit(1000000); // override default storage key

      if (sStorageKey) {
        this._STORAGE_KEY = sStorageKey;
      }

      this._storage = new Storage(Storage.Type.session, this._STORAGE_KEY); // load data from local storage

      this._loadData();

      return this;
    },

    /**
     * Loads the current state of the model from local storage
     */
    _loadData: function _loadData() {
      var sJSON = this._storage.get(this._STORAGE_KEY);

      if (sJSON) {
        var oData = JSON.parse(sJSON);

        this._setNumberFormat(oData);

        this.setData(oData);
      }

      this._bDataLoaded = true;
    },
    _setNumberFormat: function _setNumberFormat(oData) {
      if (this._STORAGE_KEY === 'MAIN') {
        var sepmil = oData.sysParams.sepmil;
        var sepdec = oData.sysParams.sepdec;
        numberFormat.getNumberFormat(sepmil, sepdec);
        numberFormat.getFormatOptions(sepmil, sepdec);
      }
    },

    /**
     * Saves the current state of the model to local storage
     */
    _storeData: function _storeData() {
      var oData = this.getData(); // update local storage with current data

      var sJSON = JSON.stringify(oData);

      this._storage.put(this._STORAGE_KEY, sJSON);
    },

    /**
     * Sets a property for the JSON model
     * @override
     */
    setProperty: function setProperty() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      JSONModel.prototype.setProperty.apply(this, args);

      this._storeData();
    },

    /**
     * Sets the data for the JSON model
     * @override
     */
    setData: function setData() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      JSONModel.prototype.setData.apply(this, args); // called from constructor: only store data after first load

      if (this._bDataLoaded) {
        this._storeData();
      }
    },

    /**
     * Refreshes the model with the current data
     * @override
     */
    refresh: function refresh() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      JSONModel.prototype.refresh.apply(this, args);

      this._storeData();
    },

    /**
     * Destroy the model with the current data
     * @override
     */
    destroy: function destroy() {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      JSONModel.prototype.destroy.apply(this, args);
      this._bDataLoaded = false;

      this._storage.remove(this._STORAGE_KEY);
    }
  });
});