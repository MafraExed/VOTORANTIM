"use strict";
/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["com/innova/model/constant","com/innova/service/petitions","sap/base/util/deepExtend","sap/m/MessageBox"],function(e,t,n,o){return{onAddNewDcoumentTypePress:function e(){this.getView().getModel("Settings").setProperty("/IsCreateDocumentType",true);this.bUpdateDocumentType=false;this.handleOpenDocumentTypeDialog()},handleOpenDocumentTypeDialog:function e(t){var n=this;this._oDocumentTypeDialog=sap.ui.core.Fragment.load({name:"com.innova.sitrack.view.settings.fragment.CreateDocumentType",controller:this}).then(function(e){var t=e;n.getView().addDependent(t);t.addStyleClass(n.getOwnerComponent().getContentDensityClass());t.attachAfterClose(t.destroy.bind(t));return t});this._oDocumentTypeDialog.then(function(e){if(!t){n.getModel("Settings").setProperty("/createdocumenttype",{BSART:"",WERKS_F:"",WERKS_T:""})}e.open()})},onCreateDocumentTypePress:function e(){var t=n({},this.getView().getModel("Settings").getProperty("/createdocumenttype"));if(this.bUpdateDocumentType){t.CRUD="U";this._saveOrUpdateDocumentType(t)}else{t.CRUD="C";this._saveOrUpdateDocumentType(t)}},handleCloseDocumentTypeDialog:function e(){return this._oDocumentTypeDialog.then(function(e){e.close()})},onDocumentTypeRowDeletePress:function e(){var t=this.getView().getModel("Settings").getProperty("/selectedTableRow");if(t.length===0){o.error(this.getResourceBundle().getText("Settings.0029"));return}var n=t[0];n.CRUD="D";this._openDeleteRecordDialog("","",true,n)},onDocumentTypeEditPress:function e(){var t=this.getView().getModel("Settings").getProperty("/selectedTableRow");if(t.length===0){o.error(this.getResourceBundle().getText("Settings.0029"));return}var n=t[0];this.getView().getModel("Settings").setProperty("/IsCreateDocumentType",false);this.bUpdateDocumentType=true;this.getView().getModel("Settings").setProperty("/createdocumenttype",n);this.handleOpenDocumentTypeDialog(n)},getDocumentTypes:function n(){var o=this;return t.post(e.GET_CONF_DOCS,{IT_DOCS:[{CRUD:"R"}]}).then(function(e){var t=e.data;o.getView().getModel("Settings").setProperty("/documenttypes",t)}).catch(this.errorHandler.bind(this))},_saveOrUpdateDocumentType:function n(o){t.post(e.GET_CONF_DOCS,{IT_DOCS:[o]}).then(this.getDocumentTypes.bind(this)).then(this.handleCloseDocumentTypeDialog.bind(this)).then(this.clearSelectedIndex.bind(this)).catch(this.errorHandler.bind(this))}}});