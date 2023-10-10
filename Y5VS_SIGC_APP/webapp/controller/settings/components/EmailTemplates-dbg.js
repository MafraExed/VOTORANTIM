"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sigc/lib/richTextEditor/editor', 'com/innova/sigc/model/constant', 'com/innova/sigc/service/http', 'com/innova/sigc/utils/showToast', 'sap/ui/core/Fragment', 'sap/ui/model/json/JSONModel'],
/**
 * @class
 * @name EmailTemplates.js
 * @description - Handler of EmailTemplates for the settings controller
 *
 * @returns {object}
 *
 * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
 * @version 1.0.0
 */
function (editor, constant, http, showToast, Fragment, JSONModel) {
  return {
    /* =========================================================== */

    /* begin: event handlers                                       */

    /* =========================================================== */

    /**
     * @function
     * @name onHelpIconPress
     * @description - opens the help value help to provide suggestion for the variables
     *
     * @public
     * @param {object} oEvent - event to get the icon control
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    onHelpIconPress: function onHelpIconPress(oEvent) {
      var _this = this;

      var oButton = oEvent.getSource(); // create popover

      if (!this._pPopover) {
        this._pPopover = Fragment.load({
          id: this._oView.getId(),
          name: 'com.innova.sigc.view.settings.fragment.TemplateHelp',
          controller: this
        }).then(function (oPopover) {
          _this._oView.addDependent(oPopover);

          return oPopover;
        });
      }

      this._pPopover.then(function (oPopover) {
        if (oPopover.openBy) {
          oPopover.openBy(oButton);
        } else {
          oPopover.open();
        }
      });
    },

    /**
     * @function
     * @name onCloseTemplateHelpPress
     * @description - close the Help value help.
     *
     * @public
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    onCloseTemplateHelpPress: function onCloseTemplateHelpPress() {
      this._pPopover.then(function (oPopover) {
        oPopover.close();
      });
    },

    /**
     * @function
     * @name onSavePress
     * @description - email template is saved
     *
     * @public
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onSavePress: function onSavePress() {
      var that = this;
      var model = this.getModel('emailTemplate');
      var data = model.getData();

      if (data) {
        Promise.resolve(this._oPage.setBusy(true)).then(http.update.bind(http, "".concat(constant.api.CUSTOM_TEMPLATE), {
          type: data.type,
          subject: data.subject,
          content: this._oEmailTemplateEditor.getContent()
        })).then(function () {
          return showToast(that.getResourceBundle().getText('0387'));
        }).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
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
     * @name _getEmailTemplates
     * @description - fetches the initial/default email templates
     *
     * @public
     * @returns {Promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _getEmailTemplates: function _getEmailTemplates(_ref) {
      var _this$_oEmailTemplate;

      var templateName = _ref.templateName;

      // Show help button
      this._oView.byId('sHelpIconId').setVisible(true); // Set the template content


      (_this$_oEmailTemplate = this._oEmailTemplateEditor) === null || _this$_oEmailTemplate === void 0 ? void 0 : _this$_oEmailTemplate.setContent(''); // Fetch the template and set the content

      return http.get("".concat(constant.api.CUSTOM_TEMPLATE, "/").concat(templateName)).then(this._handleEmailTemplateData.bind(this)).then(this._renderEmailTemplateEditor.bind(this));
    },

    /**
     * @function
     * @name _handleEmailTemplateData
     * @description - Handle the email template data and set it to the model
     *
     * @private
     * @param {object} res - response from the server
     * @param {object} res.data - response data
     *
     * @returns {void} - Nothing to return
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _handleEmailTemplateData: function _handleEmailTemplateData(_ref2) {
      var data = _ref2.data;
      var titles = {
        offer_vendor_invitation: '0409',
        process_adendo_created: '0423',
        process_invitation: '0424',
        process_qa_answer: '0425',
        process_qa_question: '0426',
        registration_welcome_user: '0427',
        registration_welcome_vendor: '0428',
        user_registration: '0429',
        vendor_registration: '0430'
      };
      this.setModel(new JSONModel(_objectSpread(_objectSpread({}, data), {}, {
        title: this.getResourceBundle().getText(titles[data.type])
      })), 'emailTemplate');
    },

    /**
     * @function
     * @name _renderEmailTemplateEditor
     * @description - fetches the initial/default email templates
     *
     * @private
     * @returns {Promise} - Nothing to return
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    _renderEmailTemplateEditor: function _renderEmailTemplateEditor() {
      var _this2 = this;

      return new Promise(function (resolve) {
        if (!_this2._oEmailTemplateEditor) {
          editor.removeEditorManager();
          _this2._oEmailTemplateEditor = editor.initializeQuillEditor.call(_this2, {
            container: _this2.getView().byId('emailTemplateEditor').getDomRef(),
            placeholder: _this2.getResourceBundle().getText('0386'),
            setup: function setup(edtr) {
              edtr.on('init', function () {
                edtr.setContent(_this2.getModel('emailTemplate').getProperty('/content'));
                resolve();
              });
            }
          });
        } else {
          resolve();
        }

        _this2._oEmailTemplateEditor.render();
      });
    }
    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

  };
});