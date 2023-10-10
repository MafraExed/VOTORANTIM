"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sigc/model/constant', 'com/innova/sigc/service/http', 'sap/base/util/deepExtend', 'sap/m/MessageBox'],
/**
 * @class
 * @name ProcessCategory.js
 * @description - Handler of the process category for the settings controller
 *
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel
 * @param {typeof sap.m.MessageBox} MessageBox
 * @param {object} constant
  *
 * @returns {object}
 *
 * @author Edwin Valencia <evalencia@innovainternacional.biz>
 * @version 1.0.0
 */
function (constant, http, deepExtend, MessageBox) {
  return {
    /* =========================================================== */

    /* begin: event handlers                                       */

    /* =========================================================== */
    onAddNewCategoryRecord: function onAddNewCategoryRecord() {
      this.getView().getModel('Settings').setProperty('/IsCreateCategory', true);
      this.bUpdateCategory = false;
      this.getView().getModel('Settings').setProperty('/createcategory', {
        category: '',
        description: '',
        language: this.getModel('main').getProperty('/currentLanguage')
      });
      this.handleOpenCategoryDialog();
    },
    onCategoryEditPress: function onCategoryEditPress() {
      var aSelectedRow = this.getView().getModel('Settings').getProperty('/selectedTableRow');

      if (aSelectedRow.length === 0) {
        MessageBox.error(this.getResourceBundle().getText('Commons.0022'));
        return;
      }

      var oSelectedObject = deepExtend({}, aSelectedRow[0]); // const oSelectedObject = jQuery.extend(true, {}, aSelectedRow[0])

      this.getView().getModel('Settings').setProperty('/IsCreateCategory', false);
      this.getView().getModel('Settings').refresh(true);
      this.bUpdateCategory = true; // const oSelectedObject = oEvent
      //   .getSource()
      //   .getBindingContext('Settings')
      //   .getObject()

      this.getView().getModel('Settings').setProperty('/createcategory', oSelectedObject);
      this.handleOpenCategoryDialog(oSelectedObject);
    },
    onCategoryDeletePress: function onCategoryDeletePress() {
      var aSelectedRow = this.getView().getModel('Settings').getProperty('/selectedTableRow');

      if (aSelectedRow.length === 0) {
        MessageBox.error(this.getResourceBundle().getText('Commons.0022'));
        return;
      }

      var oSelectedObject = aSelectedRow[0];

      this._openDeleteRecordDialog(oSelectedObject.id, constant.api.PROCESS_CATEGORY_PATH);
    },
    onCreateorUpdateCategoryPress: function onCreateorUpdateCategoryPress() {
      var _this = this;

      var oPayload = deepExtend({}, this.getView().getModel('Settings').getProperty('/createcategory')); // const oPayload = jQuery.extend(
      //   true,
      //   {},
      //   this.getView().getModel('Settings').getProperty('/createcategory')
      // )

      var that = this; // delete oPayload.id

      var sUser = that.getView().getModel('main').getProperty('/sysParams/UNAME');
      var oCreatePayload = '';

      if (!this.bUpdateCategory) {
        oCreatePayload = {
          createdBy: sUser
        };
      } else {
        oCreatePayload = {
          processCat: {
            id: oPayload.id
          },
          language: oPayload.language,
          description: oPayload.description
        };
      }

      if (this.bUpdateCategory) {
        this.handleSaveorUpdate(oCreatePayload, oPayload.id, "".concat(constant.api.CAT_DESC, "/").concat(oPayload.id)).then(function (data) {
          if (data.statusText === 'OK') {
            that.getCategories();
            MessageBox.success(_this.getResourceBundle().getText('0232'));
          }
        }).catch(function (error) {
          MessageBox.error(error.message);
        });
      } else {
        this.handleSaveorUpdate(oCreatePayload, '', constant.api.PROCESS_CATEGORY_PATH).then(function (data) {
          oPayload = that.getView().getModel('Settings').getProperty('/createcategory');
          var oDescriptionPayload = {
            processCat: {
              id: data.data.id
            },
            language: _this.getModel('main').getProperty('/currentLanguage'),
            description: oPayload.description
          };
          that.handleSaveorUpdate(oDescriptionPayload, '', constant.api.CAT_DESC).then(function (dataValue) {
            if (dataValue.statusText === 'Created') {
              that.getCategories();
              MessageBox.success(_this.getResourceBundle().getText('0233'));
            }
          }).catch(function (error) {
            MessageBox.error(error.message);
          });
        });
      }

      this.onCategoryClosePress();
    },
    handleOpenCategoryDialog: function handleOpenCategoryDialog(oSelectedCategoryObject) {
      var _this2 = this;

      if (!this._oCreateNewCategoryData) {
        this._oCreateNewCategoryData = sap.ui.core.Fragment.load({
          id: this.getView().getId(),
          name: 'com.innova.sigc.view.settings.fragment.CreateCategory',
          controller: this
        }).then(function (control) {
          var oDialog =
          /** @type {sap.m.Dialog} */
          control; // connect dialog to the root view of this component (models, lifecycle)

          _this2.getView().addDependent(oDialog);

          oDialog.addStyleClass(_this2.getOwnerComponent().getContentDensityClass());
          oDialog.setModel(_this2.getView().getModel('Settings'), 'Settings');

          if (!oSelectedCategoryObject) {
            oDialog.getModel('Settings').setProperty('/createcategory', {
              category: '',
              description: '',
              language: _this2.getModel('main').getProperty('/currentLanguage')
            });
          }

          oDialog.setModel(_this2.getView().getModel('i18n'), 'i18n');
          return oDialog;
        });
      }

      this._oCreateNewCategoryData.then(function (oDialog) {
        oDialog.open();
      });
    },
    onCategoryClosePress: function onCategoryClosePress() {
      this._oCreateNewCategoryData.then(function (oDialog) {
        oDialog.close();
      });
    },

    /* =========================================================== */

    /* finish: event handlers                                      */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: internal methods                                     *
    /* =========================================================== */
    getCategories: function getCategories() {
      var sLanguage = this.getModel('main').getProperty('/currentLanguage');
      return http.get("".concat(constant.api.PROCESS_CATEGORY_PATH, "?language=").concat(sLanguage)).then(this._handleResponseData.bind(this));
    }
    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

  };
});