"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sigc/utils/isEmpty', 'com/innova/sigc/lib/formUtils/formUtils', 'com/innova/sigc/model/process/Vendor', 'com/innova/sigc/service/http', 'com/innova/sigc/utils/showToast', 'com/innova/sigc/model/constant', 'com/innova/sigc/model/process/VendorByHistory', 'com/innova/sigc/model/process/VendorByData', 'com/innova/sigc/service/petitions', 'com/innova/sigc/model/searchHelp/SearchHelp', 'sap/ui/core/Fragment', 'sap/ui/model/json/JSONModel'],
/**
 * @class
 * @name Vendors.js
 * @description - Handler of the vendors for the process controller
 *
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel
 * @param {typeof sap.ui.core.Fragment} Fragment
 *
 * @returns {object}
 *
 * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
 * @version 1.0.0
 */
function (isEmpty, formUtils, Vendor, http, showToast, constant, VendorByHistory, VendorByData, petitions, SearchHelp, Fragment, JSONModel) {
  return {
    /* =========================================================== */

    /* begin: event handlers                                       */

    /* =========================================================== */

    /**
     * @function
     * @name onAddVendorButton
     * @description - Muestra el dialogo para aÃ±adir nuevo proveedor
     *
     * @public
     * @returns {void}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    onAddVendorButton: function onAddVendorButton() {
      var _this = this;

      var oView = this.getView();
      Fragment.load({
        id: oView.getId(),
        name: 'com.innova.sigc.view.biddingProcess.dialog.vendor.AddVendor',
        controller: this
      }).then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control;
        oView.addDependent(oDialog);
        oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
        _this._oAddVendorDialog = oDialog;
        oDialog.attachAfterClose(oDialog.destroy.bind(oDialog));
        _this._oFormAddVendor = _this.byId('byDataForm');
        formUtils.addValidatorAllMultiInputs({
          fields: _this._oFormAddVendor.getControlsByFieldGroupId('MultiInputGroup')
        });
        oDialog.open();
      }).catch(this.errorHandler.bind(this));
    },

    /**
     * @function
     * @name onSearchVendor
     * @description - Busca el vendedor segun el formulario diligenciado
     *
     * @public
     * @returns {void}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    onSearchVendor: function onSearchVendor(evt, formId) {
      var _this2 = this;

      var form = this.byId(formId);

      if (formId === 'byDataForm') {
        Promise.resolve(this._oAddVendorDialog.setBusy(true)).then(this._isValidForm.bind(this, form)).then(formUtils.getFormData.bind(formUtils, form)).then(function (data) {
          return new VendorByData(data);
        }).then(http.post.bind(http, constant.api.GET_VENDOR_DATA_PATH)).then(function (_ref) {
          var data = _ref.data;

          if (isEmpty(data)) {
            throw new Error('No se encontraron datos');
          }

          var finalData = _this2._filterDataTable(data);

          if (isEmpty(finalData)) {
            throw new Error('No hay proveedores disponibles');
          }

          _this2._oAddVendorDialog.setModel(new JSONModel({
            data: finalData
          }), 'vendorsByData');

          _this2.byId('addVendorButton').setEnabled(true);
        }).catch(this.errorHandler.bind(this)).finally(this._oAddVendorDialog.setBusy.bind(this._oAddVendorDialog, false));
      } else {
        Promise.resolve(this._oAddVendorDialog.setBusy(true)).then(this._isValidForm.bind(this, form)).then(formUtils.getFormData.bind(formUtils, form)).then(this._buildDataRequest.bind(this)).then(petitions.post.bind(petitions, constant.GET_VENDOR_HISTORY)).then(function (_ref2) {
          var data = _ref2.data;

          if (isEmpty(data)) {
            throw new Error(_this2._i18n.getText('Commons.0042'));
          }

          return data;
        }).then(this._buildVendorsByIdRequest.bind(this)).then(function (_ref3) {
          var data = _ref3.data;

          var finalData = _this2._filterDataTable(data);

          if (isEmpty(finalData)) {
            throw new Error(_this2._i18n.getText('0138'));
          }

          _this2._oAddVendorDialog.setModel(new JSONModel({
            data: finalData
          }), 'vendorsByHistory');

          _this2.byId('addVendorButton').setEnabled(true);
        }).catch(this.errorHandler.bind(this)).finally(this._oAddVendorDialog.setBusy.bind(this._oAddVendorDialog, false));
      }
    },

    /**
     * @function
     * @name onAddVendorHistory
     * @description - Agrega a la tabla de proveedores los proveedores seleccionados
     *
     * @public
     * @returns {void}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    onAddVendorHistory: function onAddVendorHistory() {
      var _this3 = this;

      Promise.resolve(this._oAddVendorDialog.setBusy(true)).then(this._getSelectedVendors.bind(this)).then(this._buildOffersRequest.bind(this)).then(this._sendOffersHistory.bind(this)).then(this._fetchOffers.bind(this)).then(function () {
        showToast(_this3._i18n.getText('Commons.0021'));

        _this3._oFormModel.refresh(true);

        _this3.byId('vendorsTable').clearSelection();

        _this3._oAddVendorDialog.close();
      }).catch(this.errorHandler.bind(this)).finally(this._oAddVendorDialog.setBusy.bind(this._oAddVendorDialog, false));
    },

    /**
     * @function
     * @name onShowNewVendorDialog
     * @description - Show new vendor dialog.
     *
     * @public
     * @returns {void}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    onShowNewVendorDialog: function onShowNewVendorDialog() {
      var _this4 = this;

      var oView = this.getView();
      Fragment.load({
        id: oView.getId(),
        name: 'com.innova.sigc.view.biddingProcess.dialog.vendor.NewVendor',
        controller: this
      }).then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control; // connect dialog to the root view of this component (models, lifecycle)

        oView.addDependent(oDialog);
        oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
        _this4._oNewVendorDialog = oDialog;

        _this4._oNewVendorDialog.setModel(new JSONModel({
          emails: [],
          phones: [],
          categories: []
        }), 'vendors');

        oDialog.attachAfterClose(oDialog.destroy.bind(oDialog));
        oDialog.open();
      });
    },

    /**
     * @function
     * @name onCreateVendorAndOffer
     * @description - Create vendor and offer.
     *
     * @public
     * @returns {void}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    onCreateVendorAndOffer: function onCreateVendorAndOffer() {
      var _this5 = this;

      Promise.resolve(this._oNewVendorDialog.setBusy(true)).then(this._validateFields.bind(this)).then(this._buildVendorRequest.bind(this)).then(http.post.bind(http, "".concat(constant.api.VENDOR_PATH))).then(function (_ref4) {
        var data = _ref4.data;
        _this5._iVendorId = data.idProv;
      }).then(function () {
        return http.post("".concat(constant.api.OFFERS_PATH), {
          processId: _this5._numProc,
          vendorId: _this5._iVendorId
        });
      }).then(this._fetchOffers.bind(this)).then(function () {
        showToast(_this5._i18n.getText('Commons.0021'));

        _this5.byId('vendorsTable').clearSelection();

        _this5._oNewVendorDialog.close();
      }).catch(this.errorHandler.bind(this)).finally(this._oNewVendorDialog.setBusy.bind(this._oNewVendorDialog, false));
    },

    /**
     * @function
     * @name onAddField
     * @description - Agrega filas a la tabla seleccionada.
     *
     * @public
     * @returns {void}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    onAddField: function onAddField(button, property) {
      var toolbar = button.getParent();
      var table = toolbar.getParent();
      var binding = table.getBinding();
      var modelVendors = binding.getModel();
      var nullData = {
        index: Math.random(),
        smtpAddr: '',
        remark: '',
        telNumber: '',
        telExtens: '',
        id: ''
      };
      modelVendors.setProperty("/".concat(property), [].concat(_toConsumableArray(modelVendors.getProperty("/".concat(property))), [nullData]));
      table.clearSelection();
    },

    /**
     * @function
     * @name onDeleteField
     * @description - Elimina filas a la tabla seleccionada.
     *
     * @public
     * @returns {void}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    onDeleteField: function onDeleteField(button, property) {
      var toolbar = button.getParent();
      var table = toolbar.getParent();
      var binding = table.getBinding();
      var modelVendors = binding.getModel();
      var indexToDelete = table.getSelectedIndices();
      var arrayProp = modelVendors.getProperty("/".concat(property));
      indexToDelete.forEach(function (i) {
        var contextRow = table.getContextByIndex(i);

        var _contextRow$getObject = contextRow.getObject(),
            index = _contextRow$getObject.index;

        arrayProp = arrayProp.filter(function (element) {
          return element.index !== index;
        });
      });
      modelVendors.setProperty("/".concat(property), arrayProp);
      table.clearSelection();
    },

    /**
     * @function
     * @name onTypeEmail
     * @description - Verifica que en el campo Email este escrito un correo electronico valido
     *
     * @public
     * @param {sap.ui.base.Event} oEvent - An Event object consisting of an id, a source and a map of parameters.
     * @returns {void}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    onTypeEmail: function onTypeEmail(oEvent) {
      var source =
      /** @type {sap.m.Input} */
      oEvent.getSource();
      var buttonAdd = this.byId('saveVendorButton');
      var email = source.getValue();
      var mailregex = /^\w+[\w-+.]*@\w+([-.]\w+)*\.[a-zA-Z]{2,}$/;

      if (email && !mailregex.test(email)) {
        source.setValueState(sap.ui.core.ValueState.Warning);
        source.setValueStateText(this._i18n.getText('0179'));
        buttonAdd.setEnabled(false);
      } else {
        source.setValueState(sap.ui.core.ValueState.None);
        buttonAdd.setEnabled(true);
      }
    },

    /**
     * @function
     * @name onValidateName
     * @description - Verifica que tanto el campo de name1 como el de ciudad esten llenos
     *
     * @public
     * @param {sap.ui.base.Event} oEvent - An Event object consisting of an id, a source and a map of parameters.
     * @returns {void}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    onValidateName: function onValidateName(oEvent, field) {
      var source =
      /** @type {sap.m.Input} */
      oEvent.getSource();
      var buttonAdd = this.getView().byId('saveVendorButton');
      var value = source.getValue();

      if (isEmpty(value)) {
        source.setValueState(sap.ui.core.ValueState.Error);
        source.setValueStateText("Debe digitar ".concat(field));
        buttonAdd.setEnabled(false);
      } else {
        source.setValueState(sap.ui.core.ValueState.None);
        buttonAdd.setEnabled(true);
      }
    },

    /**
     * @function
     * @name onCountryChange
     * @description - Setea las regiones dependiendo del pais seleccionado
     *
     * @public
     * @returns {void}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    onCountryChange: function onCountryChange(evt) {
      var _this6 = this;

      var countryKey = evt.getSource().getSelectedKey();
      http.get("".concat(constant.api.GET_REGIONS_HELP, "?land1=").concat(countryKey), new SearchHelp('REGIONS')).then(function (_ref5) {
        var data = _ref5.data;

        _this6._oNewVendorDialog.getModel('vendors').setProperty('/regions', data);
      });
    },

    /**
     * @function
     * @name onSendInvitationsToVendors
     * @description - Send invitations to vendors
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onSendInvitationsToVendors: function onSendInvitationsToVendors() {
      Promise.resolve(this._oPage.setBusy(true)).then(this._getSelectedIndices.bind(this, this.byId('vendorsTable'))).then(this._validateSendIntationsToVendors.bind(this)).then(function (context) {
        return context.map(function (c) {
          return {
            angnr: c.getProperty('angnr')
          };
        });
      }).then(http.post.bind(http, constant.api.VENDOR_INVITATION_PATH)).then(showToast.bind(showToast, this._i18n.getText('Commons.0021'))).then(this._fetchOffers.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
    },

    /**
     * @function
     * @name onDeleteOffers
     * @description - Delete offers
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onDeleteOffers: function onDeleteOffers() {
      var _this7 = this;

      Promise.resolve(this._oPage.setBusy(true)).then(this._getSelectedIndices.bind(this, this.byId('vendorsTable'))).then(function (context) {
        return context.filter(function (c) {
          return !c.getProperty('estaOfer');
        }).map(function (c) {
          return {
            angnr: c.getProperty('angnr')
          };
        });
      }).then(function (data) {
        return isEmpty(data) ? Promise.reject(_this7._i18n.getText('0353')) : data;
      }).then(http.delete.bind(http, constant.api.OFFER_DELETE_PATH)).then(this._clearVendorSection.bind(this)).then(showToast.bind(showToast, this._i18n.getText('Commons.0021'))).then(this._fetchOffers.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
    },

    /**
     * @function
     * @name onShowEditVendorEmailsDialog
     * @description - Show edit vendor emails dialog
     *
     * @public
     * @param {sap.ui.table.Row} row - Row of the table
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onShowEditVendorEmailsDialog: function onShowEditVendorEmailsDialog(row) {
      var _this8 = this;

      var context = row.getBindingContext('processModel');

      var _context$getObject =
      /** @type {object} */
      context.getObject(),
          vendor = _context$getObject.vendor,
          vendorId = _context$getObject.vendorId;

      var emails = vendor.emails;
      var oView = this.getView();
      Fragment.load({
        id: oView.getId(),
        name: 'com.innova.sigc.view.biddingProcess.dialog.vendor.EditVendorEmails',
        controller: this
      }).then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control; // connect dialog to the root view of this component (models, lifecycle)

        oView.addDependent(oDialog);
        oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
        _this8._oEditVendorEmailsDialog = oDialog;

        _this8._oEditVendorEmailsDialog.setModel(new JSONModel({
          emails: emails,
          vendorId: vendorId
        }), 'vendors');

        oDialog.attachAfterClose(oDialog.destroy.bind(oDialog));
        oDialog.open();
      });
    },

    /**
     * @function
     * @name onEditVendorEmails
     * @description - Edit vendor emails
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onEditVendorEmails: function onEditVendorEmails() {
      var _this9 = this;

      var model = this._oEditVendorEmailsDialog.getModel('vendors');

      var emails = model.getProperty('/emails');
      var vendorId = model.getProperty('/vendorId');
      Promise.resolve(this._oEditVendorEmailsDialog.setBusy.bind(this._oEditVendorEmailsDialog, true)).then(function () {
        _this9._validateEmailFields({
          list: emails,
          i18n: _this9._i18n
        });
      }).then(http.post.bind(http, "".concat(constant.api.VENDORS_PATH, "/").concat(vendorId, "/").concat(constant.api.EMAILS_PATH), {
        emails: emails
      })).then(this._clearVendorSection.bind(this)).then(showToast.bind(showToast, this._i18n.getText('Commons.0021'))).then(this._fetchOffers.bind(this)).then(this._oEditVendorEmailsDialog.close.bind(this._oEditVendorEmailsDialog)).catch(this.errorHandler.bind(this)).finally(this._oEditVendorEmailsDialog.setBusy.bind(this._oEditVendorEmailsDialog, false));
    },

    /* =========================================================== */

    /* finish: event handlers                                      */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: internal methods                                     *
    /* =========================================================== */

    /**
     * @function
     * @name _filterDataTable
     * @description - Filtra los elementos de la tabla para mostrar solo los proveedores disponibles
     *
     * @private
     * @returns {Array}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    _filterDataTable: function _filterDataTable(data) {
      var recentData = this._oFormModel.getProperty('/offers');

      var idsNoPermitidos = recentData.map(function (doc) {
        return doc.vendor.idProv;
      });
      return data.filter(function (doc) {
        return !idsNoPermitidos.includes(doc.idProv);
      });
    },

    /**
     * @function
     * @name _sendOffersHistory
     * @description - Envia las ofertas de los proveedores seleccionados.
     *
     * @private
     * @param {Promise[]}  arrayOffers - arreglo de peticiones para ofertas.
     * @returns {Promise}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    _sendOffersHistory: function _sendOffersHistory(arrayOffers) {
      return arrayOffers.reduce(function (acc, el) {
        return acc.then(function (res) {
          return el.then(function (resp) {
            return [].concat(_toConsumableArray(res), [resp]);
          });
        });
      }, Promise.resolve([]));
    },

    /**
     * @function
     * @name _getSelectedVendors
     * @description - Obtiene los proveedores seleccionados.
     *
     * @private
     * @returns {array}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    _getSelectedVendors: function _getSelectedVendors() {
      var table = this.byId('vendorTable');
      var table2 = this.byId('vendor2Table');
      var indexToAdd = table.getSelectedIndices();
      var indexToAdd2 = table2.getSelectedIndices();

      if (isEmpty(indexToAdd) && isEmpty(indexToAdd2)) {
        throw new Error(this._i18n.getText('0139'));
      }

      var arrayProp = [];
      var arrayProp2 = [];
      indexToAdd.forEach(function (i) {
        var contextRow = table.getContextByIndex(i);
        var data = contextRow.getObject();
        arrayProp.push(data);
      });
      indexToAdd2.forEach(function (i) {
        var contextRow = table2.getContextByIndex(i);
        var data = contextRow.getObject();
        arrayProp2.push(data);
      });
      arrayProp = arrayProp.concat(arrayProp2);
      return arrayProp;
    },

    /**
     * @function
     * @name _buildOffersRequest
     * @description - Crea el array de ofertas para agregar a los proveedores.
     *
     * @private
     * @returns {array}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildOffersRequest: function _buildOffersRequest(data) {
      var _this10 = this;

      var arrayOffers = [];
      data.forEach(function (element) {
        arrayOffers.push(http.post("".concat(constant.api.OFFERS_PATH), {
          processId: _this10._numProc,
          vendorId: element.idProv
        }));
      });
      return arrayOffers;
    },

    /**
     * @function
     * @name _searchVendorId
     * @description - Busca los proveedores.
     *
     * @private
     * @param {Promise[]}  arrayVendors - arreglo de peticiones para datos del proveedor.
     * @returns {Promise}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    _searchVendorId: function _searchVendorId(arrayVendors) {
      return arrayVendors.reduce(function (acc, el) {
        return acc.then(function (res) {
          return el.then(function (resp) {
            return [].concat(_toConsumableArray(res), [resp]);
          });
        });
      }, Promise.resolve([]));
    },

    /**
     * @function
     * @name _buildVendorsByIdRequest
     * @description - Crea el array de emails para realizar las invitaciones a los proveedores.
     *
     * @private
     * @returns {array}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildVendorsByIdRequest: function _buildVendorsByIdRequest(dataVendor) {
      return http.post("".concat(constant.api.VENDOR_ID_PATH), {
        lifnr: dataVendor.map(function (element) {
          return element.LIFNR;
        })
      });
    },

    /**
     * @function
     * @name _buildDataRequest
     * @description - Crea el data Request para vendor by history
     *
     * @private
     * @returns {void}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildDataRequest: function _buildDataRequest(data) {
      var dataVendor = {
        matnr: formUtils.getMultiInputDataVendor(data.matnr),
        matkl: formUtils.getMultiInputDataVendor(data.matkl),
        ekorg: formUtils.getMultiInputDataVendor(data.ekorg),
        txz01: formUtils.getMultiInputDataVendor(data.txz01 ? [data.txz01] : []),
        date: data.date
      };
      return new VendorByHistory(dataVendor);
    },

    /**
     * @function
     * @name _validateFields
     * @description - Valida los campos obligatorios del formulario.
     *
     * @private
     * @returns {void}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    _validateFields: function _validateFields() {
      var name1 = this.byId('oINombre1');
      var country = this.byId('oIPais');
      var stcd1 = this.byId('oIFiscalId');
      var stcdt = this.byId('oITipoIdFiscal');
      this._oListEmails = this.byId('emailTable').getBinding().oList;
      this._oListPhones = this.byId('phoneTable').getBinding().oList;
      this._oListCategories = this.byId('categoryTable').getBinding().oList;

      this._validateInputField({
        input: name1,
        valueStateText: this._i18n.getText('0106')
      });

      this._validateComboBoxFields({
        comboBox: stcdt,
        valueStateText: this._i18n.getText('0178')
      });

      this._validateInputField({
        input: stcd1,
        valueStateText: this._i18n.getText('0177')
      });

      this._validateInputField({
        input: country,
        valueStateText: this._i18n.getText('0107')
      });

      this._validateEmailFields({
        list: this._oListEmails,
        i18n: this._i18n
      });

      this._validatePhoneFields({
        list: this._oListPhones,
        i18n: this._i18n
      });

      this._validateCategoryFields({
        list: this._oListCategories,
        i18n: this._i18n
      });
    },

    /**
     * @function
     * @name _validateInputField
     * @description - Validate input field.
     *
     * @private
     * @param {object} context - context of the field
     * @param {sap.m.Input} context.input - stcd1 input
     * @param {object} context.valueStateText - stcd1 input
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _validateInputField: function _validateInputField(_ref6) {
      var input = _ref6.input,
          valueStateText = _ref6.valueStateText;
      var value = input.getValue();
      input.setValueState(sap.ui.core.ValueState.None);

      if (isEmpty(value)) {
        input.setValueState(sap.ui.core.ValueState.Error);
        input.setValueStateText(valueStateText);
        throw new Error(valueStateText);
      }
    },

    /**
     * @function
     * @name _validateComboBoxFields
     * @description - Validate ComboBox field.
     *
     * @private
     * @param {object} context - context of the field
     * @param {sap.m.ComboBox} context.comboBox - ComboBox
     * @param {object} context.valueStateText - ValueStateText
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _validateComboBoxFields: function _validateComboBoxFields(_ref7) {
      var comboBox = _ref7.comboBox,
          valueStateText = _ref7.valueStateText;
      var value = comboBox.getSelectedKey();
      comboBox.setValueState(sap.ui.core.ValueState.None);

      if (isEmpty(value)) {
        comboBox.setValueState(sap.ui.core.ValueState.Error);
        comboBox.setValueStateText(valueStateText);
        throw new Error(valueStateText);
      }
    },

    /**
     * @function
     * @name _validateEmailFields
     * @description - Validate fields for emails
     *
     * @private
     * @param {object} context - context of the field
     * @param {sap.m.Input} context.list - stcd1 input
     * @param {object} context.i18n - stcd1 input
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _validateEmailFields: function _validateEmailFields(_ref8) {
      var list = _ref8.list,
          i18n = _ref8.i18n;

      if (isEmpty(list)) {
        throw new Error(i18n.getText('0108'));
      }

      if (!this._validateEmails(list)) {
        throw new Error(i18n.getText('0109'));
      }
    },

    /**
     * @function
     * @name _validatePhoneFields
     * @description - Validate fields for phones
     *
     * @private
     * @param {object} context - context of the field
     * @param {sap.m.Input} context.list - stcd1 input
     * @param {object} context.i18n - stcd1 input
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _validatePhoneFields: function _validatePhoneFields(_ref9) {
      var list = _ref9.list,
          i18n = _ref9.i18n;

      if (!isEmpty(list)) {
        if (!this._validatePhones(list)) {
          throw new Error(i18n.getText('0119'));
        }
      }
    },

    /**
     * @function
     * @name _validateCategoryFields
     * @description - Validate fields for Category
     *
     * @private
     * @param {object} context - context of the field
     * @param {sap.m.Input} context.list - stcd1 input
     * @param {object} context.i18n - stcd1 input
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _validateCategoryFields: function _validateCategoryFields(_ref10) {
      var list = _ref10.list,
          i18n = _ref10.i18n;

      if (!isEmpty(list)) {
        if (!this._validateCategories(list)) {
          throw new Error(i18n.getText('0120'));
        }
      }
    },

    /**
     * @function
     * @name _buildVendorRequest
     * @description - Crea el objeto request para guardar el proveedor.
     *
     * @private
     * @returns {void}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildVendorRequest: function _buildVendorRequest() {
      this._oListPhones = this.byId('phoneTable').getBinding().oList;
      this._oListCategories = this.byId('categoryTable').getBinding().oList;
      var name1 = this.byId('oINombre1');
      var name2 = this.byId('oINombre2');
      var city1 = this.byId('oIPoblacion');
      var city2 = this.byId('oIDistrito');
      var street = this.byId('oICalle');
      var sort1 = this.byId('oICriterioBusqueda');
      var houseNum1 = this.byId('oIEdificio');
      var postCode1 = this.byId('oICodigoPostal');
      var country = this.byId('oIPais');
      var region = this.byId('oICiudad');
      var stcd1 = this.byId('oIFiscalId');
      var stcd2 = this.byId('oIFiscalId2');
      var stcdt = this.byId('oITipoIdFiscal');
      var spras = this.byId('oIIdioma');
      var categoriesId = [];
      var phonesList = [];
      var emailList = [];

      this._oListCategories.forEach(function (element) {
        categoriesId.push({
          id: parseInt(element.id, 10)
        });
      });

      this._oListPhones.forEach(function (element) {
        phonesList.push({
          telNumber: element.telNumber,
          telExtens: element.telExtens
        });
      });

      this._oListEmails.forEach(function (element) {
        emailList.push({
          smtpAddr: element.smtpAddr,
          remark: element.remark
        });
      });

      return new Vendor({
        idProv: 1152469087,
        name1: name1.getValue() || null,
        name2: name2.getValue() || null,
        city1: city1.getValue() || null,
        // poblaciÃ³n
        city2: city2.getValue() || null,
        // distrito
        street: street.getValue() || null,
        postCode1: postCode1.getValue() || null,
        houseNum1: houseNum1.getValue() || null,
        country: country.getSelectedKey() || null,
        region: region.getSelectedKey() || null,
        sort1: sort1.getValue() || null,
        // criterio de busqueda
        stcd1: stcd1.getValue() || null,
        // numero de identificaciÃ³n fiscal
        stcd2: stcd2.getValue() || null,
        spras: spras.getSelectedKey() || null,
        // idioma
        stcdt: stcdt.getSelectedKey() || null,
        // tipo de identificaciÃ³n
        emails: emailList,
        phones: phonesList,
        category: categoriesId
      });
    },

    /**
     * @function
     * @name _validateEmails
     * @description - Valida que no hayan campos vacÃ­os en la tabla de correos.
     *
     * @private
     * @returns {boolean}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    _validateEmails: function _validateEmails(listTable) {
      var validator = true;
      listTable.forEach(function (element) {
        if (isEmpty(element.smtpAddr)) {
          validator = false;
        }
      });
      return validator;
    },

    /**
     * @function
     * @name _validatePhones
     * @description - Valida que no hayan campos vacÃ­os en la tabla de telefonos.
     *
     * @private
     * @param {object[]} listTable - context of the field
     * @returns {boolean}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    _validatePhones: function _validatePhones(listTable) {
      var validator = true;
      listTable.forEach(function (element) {
        if (isEmpty(element.telNumber)) {
          validator = false;
        }
      });
      return validator;
    },

    /**
     * @function
     * @name _validateCategories
     * @description - Valida que no hayan campos vacÃ­os en la tabla de categorias.
     *
     * @private
     * @returns {boolean}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    _validateCategories: function _validateCategories(listTable) {
      var validator = true;
      listTable.forEach(function (element) {
        if (isEmpty(element.id)) {
          validator = false;
        }
      });
      return validator;
    },

    /**
     * @function
     * @name _buildInvitationRequest
     * @description - Crea el array de emails para realizar las invitaciones a los proveedores.
     *
     * @private
     * @returns {array}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildInvitationRequest: function _buildInvitationRequest() {
      var _this11 = this;

      var arrayInvitationsEmails = [];

      this._oListEmails.forEach(function (element) {
        arrayInvitationsEmails.push(http.post.bind(http, "".concat(constant.api.VENDOR_INVITATION_PATH), {
          vendorId: _this11._iVendorId,
          email: element.smtpAddr
        }));
      });

      return arrayInvitationsEmails;
    },

    /**
     * @function
     * @name _sendInvitations
     * @description - Envia los emails.
     *
     * @private
     * @param {Promise[]}  arrayInvitationsEmails - arreglo de promesas para invitaciones de proveedor.
     * @returns {Promise}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    _sendInvitations: function _sendInvitations(arrayInvitationsEmails) {
      return arrayInvitationsEmails.reduce(function (acc, el) {
        return acc.then(function (res) {
          return el().then(function (resp) {
            return [].concat(_toConsumableArray(res), [resp]);
          });
        });
      }, Promise.resolve([]));
    },

    /**
     * @function
     * @name _clearVendorSection
     * @description - Clear vendor section.
     *
     * @private
     * @returns {void} - Nothing to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _clearVendorSection: function _clearVendorSection() {
      this._oFormModel.setProperty('/offers', []);

      this.byId('vendorsTable').clearSelection();
    },

    /**
     * @function
     * @name _validateSendIntationsToVendors
     * @description - Validate send invitations to vendors.
     *
     * @private
     * @param {object} context - Context items selected.
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _validateSendIntationsToVendors: function _validateSendIntationsToVendors(context) {
      var offers = context.filter(function (c) {
        return !c.getProperty('estaOfer');
      });

      if (isEmpty(offers)) {
        this.byId('vendorsTable').clearSelection();
        throw new Error(this._i18n.getText('0372'));
      }

      return offers;
    }
    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

  };
});