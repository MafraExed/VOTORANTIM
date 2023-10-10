"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sigc/lib/formUtils/formUtils', 'com/innova/sigc/model/constant', 'com/innova/sigc/model/settings/Evaluator', 'com/innova/sigc/model/settings/ImportSapUsers', 'com/innova/sigc/service/http', 'com/innova/sigc/service/petitions', 'com/innova/sigc/utils/getSelectedRowsContext', 'com/innova/sigc/utils/isEmail', 'com/innova/sigc/utils/isEmpty', 'com/innova/sigc/utils/showToast', 'sap/m/MessageBox', 'sap/ui/core/Fragment', 'sap/ui/model/json/JSONModel'],
/**
 * @class
 * @name Evaluator.js
 * @description - Handler of priority for the settings controller
 *
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel
 * @param {object} constant
 *
 * @returns {object}
 *
 * @author Edwin Valencia <evalencia@innovainternacional.biz>
 * @version 1.0.0
 */
function (formUtils, constant, Evaluator, ImportSapUsers, http, petitions, getSelectedRowsContext, isEmail, isEmpty, showToast, MessageBox, Fragment, JSONModel) {
  return {
    /* =========================================================== */

    /* begin: event handlers                                       */

    /* =========================================================== */

    /**
     * @function
     * @name onShowCreateEvaluatorDialog
     * @description - Show the create evaluator dialog
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onShowCreateEvaluatorDialog: function onShowCreateEvaluatorDialog() {
      var _this = this;

      var action = 'create';

      this._getEvaluatorsDialog({
        action: action
      }).then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control;
        var oButton =
        /** @type {sap.m.Button} */
        oDialog.getBeginButton();

        var text = _this.getResourceBundle().getText('Commons.0029');

        oButton.setText(text);
        oButton.setTooltip(text);
        oButton.attachPress(_this.onCreateEvaluator.bind(_this, {
          action: action
        }));

        _this.getModel('evaluators').setProperty('/editMail', true);

        _this._oEvaluationCriteriaDialog = oDialog;

        _this._oEvaluationCriteriaDialog.unbindElement();

        _this._oEvaluationCriteriaDialog.open();
      }).catch(this.errorHandler.bind(this));
    },

    /**
     * @function
     * @name onShowUpdateEvaluatorDialog
     * @description - Show the update evaluator dialog
     *
     * @public
     * @param {sap.ui.table.Row} row - Row of the table
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onShowUpdateEvaluatorDialog: function onShowUpdateEvaluatorDialog(row) {
      var _this2 = this;

      var context = row.getBindingContext('evaluators');
      var path = context.getPath();
      var action = 'edit';

      this._getEvaluatorsDialog({
        action: action
      }).then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control;
        var oButton =
        /** @type {sap.m.Button} */
        oDialog.getBeginButton();

        var text = _this2.getResourceBundle().getText('Commons.0017');

        oButton.setText(text);
        oButton.setTooltip(text);
        oButton.attachPress(_this2.onUpdateEvaluator.bind(_this2, {
          path: path,
          action: action
        }));

        _this2.getModel('evaluators').setProperty('/editMail', false);

        _this2._oEvaluationCriteriaDialog = oDialog;

        _this2._oEvaluationCriteriaDialog.unbindElement();

        _this2._oEvaluationCriteriaDialog.bindElement({
          path: path,
          model: 'evaluators'
        });

        _this2._oEvaluationCriteriaDialog.open();
      }).catch(this.errorHandler.bind(this));
    },

    /**
     * @function
     * @name onCreateEvaluator
     * @description - Handler of create evaluator
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onCreateEvaluator: function onCreateEvaluator(_ref) {
      var action = _ref.action;
      Promise.resolve(this._oEvaluationCriteriaDialog.setBusy(true)).then(this._validateFieldsForEvaluator.bind(this)).then(this._buildReqForEvaluators.bind(this, {
        action: action
      })).then(http.post.bind(http, constant.api.EVALUATORS_PATH)).then(this._getEvaluators.bind(this)).then(this._oEvaluationCriteriaDialog.close.bind(this._oEvaluationCriteriaDialog)).catch(this.errorHandler.bind(this)).finally(this._oEvaluationCriteriaDialog.setBusy.bind(this._oEvaluationCriteriaDialog, false));
    },

    /**
     * @function
     * @name onUpdateEvaluator
     * @description - Handler of create evaluator
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onUpdateEvaluator: function onUpdateEvaluator(_ref2) {
      var path = _ref2.path,
          action = _ref2.action;
      var id = this.getModel('evaluators').getProperty("".concat(path, "/id"));
      Promise.resolve(this._oEvaluationCriteriaDialog.setBusy(true)).then(this._validateFieldsForEvaluator.bind(this)).then(this._buildReqForEvaluators.bind(this, {
        action: action
      })).then(http.update.bind(http, "".concat(constant.api.EVALUATORS_PATH, "/").concat(id))).then(this._getEvaluators.bind(this)).then(this._oEvaluationCriteriaDialog.close.bind(this._oEvaluationCriteriaDialog)).catch(this.errorHandler.bind(this)).finally(this._oEvaluationCriteriaDialog.setBusy.bind(this._oEvaluationCriteriaDialog, false));
    },

    /**
     * @function
     * @name onResendInvitationMail
     * @description - Handler of resend invitation mail
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onResendInvitationMail: function onResendInvitationMail() {
      var _this3 = this;

      var oTable = this.byId('evaluatorsTable');
      var i18n = this.getResourceBundle();

      if (oTable.getSelectedIndices().length) {
        MessageBox.confirm(i18n.getText('0165'), {
          actions: [i18n.getText('0166'), MessageBox.Action.CANCEL],
          emphasizedAction: i18n.getText('0166'),
          onClose: function onClose(sAction) {
            if (i18n.getText('0166') === sAction) {
              _this3._resendInvitationMail({
                oTable: oTable,
                i18n: i18n
              });
            }
          }
        });
      } else {
        showToast(i18n.getText('Commons.0030'));
      }
    },

    /**
     * @function
     * @name onChangeEvaluatorStatus
     * @description - Handler of resend invitation mail
     *
     * @public
     * @param {string} state - Status change
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onChangeEvaluatorStatus: function onChangeEvaluatorStatus(state) {
      var _this4 = this;

      var oTable = this.byId('evaluatorsTable');
      var i18n = this.getResourceBundle();

      if (oTable.getSelectedIndices().length) {
        var messages = {
          locked: {
            title: i18n.getText('0167'),
            message: i18n.getText('0168')
          },
          unlocked: {
            title: i18n.getText('0169'),
            message: i18n.getText('0170')
          }
        };
        var _messages$state = messages[state],
            title = _messages$state.title,
            message = _messages$state.message;
        MessageBox.confirm(message, {
          actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
          title: title,
          emphasizedAction: MessageBox.Action.OK,
          onClose: function onClose(sAction) {
            if (MessageBox.Action.OK === sAction) {
              var locked = state === 'locked';

              _this4._changeEvaluatorStatus({
                oTable: oTable,
                i18n: i18n,
                locked: locked
              });
            }
          }
        });
      } else {
        showToast(i18n.getText('Commons.0030'));
      }
    },

    /**
     * @function
     * @name onShowImportSapUsersDialog
     * @description - Handler of show import sap users dialog
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onShowImportSapUsersDialog: function onShowImportSapUsersDialog() {
      var _this5 = this;

      var view = this.getView();
      Fragment.load({
        id: view.getId(),
        name: 'com.innova.sigc.view.settings.dialog.evaluator.ImportSapUsers',
        controller: this
      }).then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control; // connect dialog to the root view of this component (models, lifecycle)

        view.addDependent(oDialog);
        oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
        oDialog.attachAfterClose(oDialog.destroy.bind(oDialog));
        formUtils.addValidatorAllMultiInputs({
          fields: _this5.byId('importSapUsersForm').getControlsByFieldGroupId('MultiInputGroup')
        });
        _this5._oImportSapUsersDialog = oDialog;

        _this5._oImportSapUsersDialog.open();
      });
    },

    /**
     * @function
     * @name onSearchSapUsers
     * @description - Handler of search sap users
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onSearchSapUsers: function onSearchSapUsers() {
      var _this6 = this;

      var form = this.byId('importSapUsersForm');
      Promise.resolve(this._oImportSapUsersDialog.setBusy(true)).then(formUtils.getFormData.bind(formUtils, form)).then(this._buildReqToSap.bind(this)).then(petitions.post.bind(petitions, constant.GET_IMPORT_SAP_USERS)).then(function (_ref3) {
        var data = _ref3.data;

        var currentData = _this6.getModel('evaluators').getProperty('/data');

        var newData = data.filter(function (_ref4) {
          var BNAME = _ref4.BNAME;
          return !currentData.find(function (_ref5) {
            var bname = _ref5.bname;
            return bname === BNAME;
          });
        });

        _this6.byId('sapUsersTable').setModel(new JSONModel({
          data: newData
        }));
      }).catch(this.errorHandler.bind(this)).finally(this._oImportSapUsersDialog.setBusy.bind(this._oImportSapUsersDialog, false));
    },

    /**
     * @function
     * @name onConfirmSapUsers
     * @description - Handler of confirm sap users
     *
     * @public
     * @returns {void} - No retona nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onConfirmSapUsers: function onConfirmSapUsers() {
      var _this7 = this;

      var dynamicSHTable = this.byId('sapUsersTable');
      var aSelectedItems = dynamicSHTable.getSelectedItems();

      if (aSelectedItems.length) {
        this._oImportSapUsersDialog.setBusy(true);

        setTimeout(function () {
          Promise.resolve().then(function () {
            return aSelectedItems.map(function (item) {
              return new Evaluator({
                firstname: item.getBindingContext().getProperty('NAME'),
                lastname: item.getBindingContext().getProperty('LAST_NAME'),
                email: item.getBindingContext().getProperty('EMAIL'),
                bname: item.getBindingContext().getProperty('BNAME'),
                roles: _this7._getRolesForEvaluator({
                  tech: item.getBindingContext().getProperty('TECH'),
                  legal: item.getBindingContext().getProperty('LEGAL')
                })
              });
            });
          }).then(_this7._validateEvaluatorEmails.bind(_this7)).then(http.post.bind(http, constant.api.EVALUATORS_SAP_PATH)).then(showToast.bind(showToast, _this7.getResourceBundle().getText('Commons.0021'))).then(_this7._oImportSapUsersDialog.close.bind(_this7._oImportSapUsersDialog, false)).then(_this7._getEvaluators.bind(_this7)).catch(_this7.errorHandler.bind(_this7)).finally(_this7._oImportSapUsersDialog.setBusy.bind(_this7._oImportSapUsersDialog, false));
        });
      }
    },

    /* =========================================================== */

    /* finish: event handlers                                      */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: internal methods                                     *
    /* =========================================================== */

    /**
     * @function
     * @name _getEvaluators
     * @description - Get evaluators
     *
     * @private
     * @returns {Promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _getEvaluators: function _getEvaluators() {
      var _this8 = this;

      return http.get(constant.api.EVALUATORS_PATH).then(function (_ref6) {
        var data = _ref6.data;

        _this8.setModel(new JSONModel({
          data: data,
          editMail: true
        }), 'evaluators');
      });
    },

    /**
     * @function
     * @name _validateFieldsForEvaluator
     * @description - Validate fields for evaluator
     *
     * @private
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _validateFieldsForEvaluator: function _validateFieldsForEvaluator() {
      var firstname = this.byId('firstname').getValue();
      var lastname = this.byId('lastname').getValue();
      var email = this.byId('email').getValue();

      if (isEmpty(firstname) || isEmpty(lastname) || isEmpty(email)) {
        throw new Error(this.getResourceBundle().getText('Commons.0027'));
      }
    },

    /**
     * @function
     * @name _buildReqToCreateEvaluators
     * @description - Build request for evaluators
     *
     * @private
     * @returns {Evaluator}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildReqForEvaluators: function _buildReqForEvaluators(_ref7) {
      var action = _ref7.action;
      var firstname = this.byId('firstname');
      var lastname = this.byId('lastname');
      var email = this.byId('email');
      var tech = this.byId('technical').getSelected();
      var legal = this.byId('legal').getSelected();
      return new Evaluator(_objectSpread(_objectSpread({
        firstname: firstname.getValue(),
        lastname: lastname.getValue()
      }, action === 'create' && {
        email: email.getValue()
      }), {}, {
        roles: this._getRolesForEvaluator({
          tech: tech,
          legal: legal
        })
      }));
    },

    /**
     * @function
     * @name _getRolesForEvaluator
     * @description - Get roles for evaluator
     *
     * @private
     * @returns {object[]}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _getRolesForEvaluator: function _getRolesForEvaluator(_ref8) {
      var tech = _ref8.tech,
          legal = _ref8.legal;
      var roles = [];

      if (tech) {
        roles.push('TECHNICAL_EVALUATOR');
      }

      if (legal) {
        roles.push('LEGAL_EVALUATOR');
      }

      return roles;
    },

    /**
     * @function
     * @name _getEvaluatorsDialog
     * @description - Get evaluators dialog
     *
     * @private
     * @param {object} context
     * @param {string} context.action - Action
     * @returns {Promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _getEvaluatorsDialog: function _getEvaluatorsDialog(_ref9) {
      var action = _ref9.action;
      var view = this.getView();
      return Fragment.load({
        id: view.getId(),
        name: 'com.innova.sigc.view.settings.dialog.evaluator.CreateOrUpdate',
        controller: this
      }).then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control; // connect dialog to the root view of this component (models, lifecycle)

        view.addDependent(oDialog);
        oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
        oDialog.attachAfterClose(oDialog.destroy.bind(oDialog));
        oDialog.data('action', action);
        return oDialog;
      });
    },

    /**
     * @function
     * @name _resendInvitationMail
     * @description - Resend invitation mail
     *
     * @private
     * @param {object} context
     * @param {sap.ui.table.Table} context.oTable - Table with evaluators
     * @param {object} context.i18n - i18n
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _resendInvitationMail: function _resendInvitationMail(_ref10) {
      var oTable = _ref10.oTable,
          i18n = _ref10.i18n;

      this._oPage.setBusy(true);

      getSelectedRowsContext(oTable, {
        i18n: i18n
      }).then(function (selectedRowsContext) {
        return selectedRowsContext.map(function (_ref11) {
          var object = _ref11.object;
          return {
            id: object.id
          };
        });
      }).then(http.post.bind(http, constant.api.EVALUATORS_RESEND_INVITATION_MAIL_PATH)).then(showToast.bind(showToast, i18n.getText('Commons.0021'))).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
    },

    /**
     * @function
     * @name _changeEvaluatorStatus
     * @description - Change evaluator status
     *
     * @private
     * @param {object} context
     * @param {sap.ui.table.Table} context.oTable - Table with evaluators
     * @param {object} context.i18n - i18n
     * @param {boolean} context.locked - locked
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _changeEvaluatorStatus: function _changeEvaluatorStatus(_ref12) {
      var oTable = _ref12.oTable,
          i18n = _ref12.i18n,
          locked = _ref12.locked;

      this._oPage.setBusy(true);

      getSelectedRowsContext(oTable, {
        i18n: i18n
      }).then(function (selectedRowsContext) {
        return selectedRowsContext.map(function (_ref13) {
          var object = _ref13.object;
          return {
            id: object.id,
            locked: locked
          };
        });
      }).then(http.post.bind(http, constant.api.EVALUATORS_CHANGE_STATUS_PATH)).then(showToast.bind(showToast, i18n.getText('Commons.0021'))).then(this._getEvaluators.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
    },

    /**
     * @function
     * @name _validateEvaluatorEmails
     * @description - Validate evaluator emails
     *
     * @private
     * @param {object[]} evaluators
     * @returns {object[]}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _validateEvaluatorEmails: function _validateEvaluatorEmails(evaluators) {
      var isValid = evaluators.every(isEmail);

      if (!isValid) {
        throw new Error(this.getResourceBundle().getText('0360'));
      }

      return evaluators;
    },

    /**
     * @function
     * @name _buildReqToSap
     * @description - Build request to SAP
     *
     * @private
     * @param {object} formData
     * @returns {ImportSapUsers}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildReqToSap: function _buildReqToSap(formData) {
      var req = {};
      Object.entries(formData).forEach(function (_ref14) {
        var _ref15 = _slicedToArray(_ref14, 2),
            key = _ref15[0],
            value = _ref15[1];

        req[key] = value === null || value === void 0 ? void 0 : value.map(function (item) {
          return {
            SIGN: 'I',
            OPTION: 'EQ',
            LOW: item
          };
        });
      });
      return new ImportSapUsers(req);
    }
    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

  };
});