"use strict";

sap.ui.define(['sap/ui/core/Fragment', 'sap/ui/model/json/JSONModel'],
/**
 * @class
 * @name AdditionalInformation.js
 * @description - Handles the additional information of the qualification
 *
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel
 *
 * @returns {object}
 *
 * @author Edwin Valencia <evalencia@innovainternacional.biz>
 * @version 1.0.0
 */
function (Fragment, JSONModel) {
  return {
    /**
     * @function
     * @name onSeeOfferAttachment
     * @description - Handles the see offer attachment event.
     *
     * @public
     * @param {object[]} attachments - The attachments.
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onSeeOfferAttachment: function onSeeOfferAttachment(attachments) {
      var _this = this;

      var oView = this.getView();
      Fragment.load({
        id: oView.getId(),
        name: 'com.innova.sigc.view.biddingProcess.dialog.qualification.SeeOfferAttachments',
        controller: this
      }).then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control; // connect dialog to the root view of this component (models, lifecycle)

        oView.addDependent(oDialog);

        var uploadSet =
        /** @type {sap.m.upload.UploadSet} */
        _this.byId('offerAttachmentsUploadSet');

        uploadSet.getToolbar().setVisible(false);
        uploadSet.addDelegate({
          ondragenter: function ondragenter(oEvent) {
            oEvent.stopPropagation();
          },
          ondragover: function ondragover(oEvent) {
            oEvent.stopPropagation();
          },
          ondrop: function ondrop(oEvent) {
            oEvent.stopPropagation();
          }
        }, uploadSet);
        uploadSet.setModel(new JSONModel(attachments));
        oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
        oDialog.attachAfterClose(oDialog.destroy.bind(oDialog));
        _this._oSeeOfferAttachmentsDialog = oDialog;
        oDialog.open();
      });
    },

    /**
     * @function
     * @name onDownloadOfferAttachment
     * @description - Download the attachment.
     *
     * @public
     * @param {sap.ui.base.Event} oEvent - An Event object consisting of an id, a source and a map of parameters.
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onDownloadOfferAttachment: function onDownloadOfferAttachment(oEvent) {
      oEvent.preventDefault();
      var item = oEvent.getParameter('item');
      var context = item.getBindingContext();
      var id = context.getProperty('id');
      Promise.resolve(this._oSeeOfferAttachmentsDialog.setBusy(true)).then(this._fecthAttachments.bind(this, {
        context: context,
        id: id
      })).catch(this.errorHandler.bind(this)).finally(this._oSeeOfferAttachmentsDialog.setBusy.bind(this._oSeeOfferAttachmentsDialog, false));
    },

    /**
     * @function
     * @name onDoNotUploadFiles
     * @description - Handler of the do not upload files.
     *
     * @public
     * @param {sap.ui.base.Event} oEvent - An Event object consisting of an id, a source and a map of parameters.
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onDoNotUploadFiles: function onDoNotUploadFiles(oEvent) {
      oEvent.preventDefault();
    },

    /**
     * @function
     * @name onShowComment
     * @description - Handler of the do not upload files.
     *
     * @public
     * @param {sap.m.ObjectStatus} source - The source of the event.
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onShowComment: function onShowComment(source) {
      var oView = this.getView();

      if (!this._pPopover) {
        this._pPopover = Fragment.load({
          id: oView.getId(),
          name: 'com.innova.sigc.view.biddingProcess.dialog.qualification.SeeAttachedComment',
          controller: this
        }).then(function (oPopover) {
          oView.addDependent(oPopover);
          oPopover.getEndButton().attachPress(oPopover.close.bind(oPopover));
          return oPopover;
        });
      }

      this._pPopover.then(function (oPopover) {
        oPopover.close();
        var comments = source.getBindingContext().getProperty('comments');
        oPopover.destroyContent().addContent(new sap.m.FormattedText({
          htmlText: comments
        }));
        oPopover.openBy(source);
      });
    },

    /* =========================================================== */

    /* begin: internal methods                                     *
    /* =========================================================== */

    /**
     * @function
     * @name _additionalInformationStrategy
     * @description - Additional information strategy
     *
     * @private
     * @returns {void} - Nothing to return
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _additionalInformationStrategy: function _additionalInformationStrategy() {
      var offers = this._oFormModel.getProperty("/offers");

      var filteredOffers = offers.filter(function (offer) {
        var _offer$attachments;

        return !!offer.comentCab || !!((_offer$attachments = offer.attachments) !== null && _offer$attachments !== void 0 && _offer$attachments.length);
      });
      this.byId('additionalInformationList').setModel(new JSONModel({
        offers: filteredOffers
      }));
    }
    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

  };
});