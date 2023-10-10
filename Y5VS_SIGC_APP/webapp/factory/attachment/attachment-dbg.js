"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['sap/m/upload/UploadSetItem', 'sap/m/ObjectAttribute'],
/**
 * @function
 * @name attachment
 * @namespace com.innova.sipp.factory.attachment
 * @description - Factory for attachment
 *
 * @public
 * @param {sap.m.upload.UploadSetItem} UploadSetItem
 * @param {sap.m.ObjectAttribute} ObjectAttribute
 * @returns {object}
 *
 * @author Edwin Valencia <evalencia@innovainternacional.biz>
 * @version 1.0.0
 */
function (UploadSetItem, ObjectAttribute) {
  return {
    /**
     * @function
     * @name sharedUse
     * @description - Create shared attachment UploadSetItem
     *
     * @public
     * @param {string} id - column id
     * @param {object} context - Context binding
     * @returns {sap.m.upload.UploadSetItem}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    sharedUse: function sharedUse(id, context) {
      return new UploadSetItem(id + Math.floor(Math.random() * (1 - 4999)) + 4999, {
        fileName: context.getProperty('originalname'),
        mediaType: context.getProperty('mimetype'),
        url: './upload',
        uploadState: sap.m.UploadState.Complete,
        visibleEdit: false,
        openPressed: this.onDownloadAttachment.bind(this),
        removePressed: this.onRemoveAttachment.bind(this),
        attributes: [new ObjectAttribute({
          title: '{i18n>0146}',
          text: '{processModel>createAt}',
          active: false
        })]
      });
    },

    /**
     * @function
     * @name internalUse
     * @description - Create internal attachment UploadSetItem
     *
     * @public
     * @param {string} id - column id
     * @param {object} context - Context binding
     * @returns {sap.m.upload.UploadSetItem}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    internalUse: function internalUse(id, context) {
      return new UploadSetItem(id + Math.floor(Math.random() * (9999 - 5000)) + 5000, {
        fileName: context.getProperty('originalname'),
        mediaType: context.getProperty('mimetype'),
        url: './upload',
        uploadState: sap.m.UploadState.Complete,
        visibleEdit: false,
        openPressed: this.onDownloadAttachment.bind(this),
        removePressed: this.onRemoveAttachment.bind(this),
        attributes: [new ObjectAttribute({
          title: '{i18n>0146}',
          text: '{processModel>createAt}',
          active: false
        })]
      });
    }
  };
});