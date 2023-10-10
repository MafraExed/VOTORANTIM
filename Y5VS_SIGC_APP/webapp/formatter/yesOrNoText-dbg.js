"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['sap/ui/model/resource/ResourceModel'], function (ResourceModel)
/**
* @function
* @name yesOrNoText
* @description - Format yes or no text
*
* @public
* @param {string} state - State of the yes or no
* @returns {string}
*
* @author Edwin Valencia <evalencia@innovainternacional.biz>
* @version 1.0.0
*/
{
  var oResourceBundle = new ResourceModel({
    bundleName: 'com.innova.sigc.i18n.i18n'
  }).getResourceBundle();
  return function (state) {
    if (state === 'Y') {
      return oResourceBundle.getText('Commons.0003');
    }

    if (state === 'N') {
      return oResourceBundle.getText('Commons.0004');
    }

    return '';
  };
});