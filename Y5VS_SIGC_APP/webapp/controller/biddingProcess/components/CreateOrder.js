"use strict";function ownKeys(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,o)}return r}function _objectSpread(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?ownKeys(Object(r),!0).forEach(function(t){_defineProperty(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):ownKeys(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}function _defineProperty(e,t,r){if(t in e){Object.defineProperty(e,t,{value:r,enumerable:true,configurable:true,writable:true})}else{e[t]=r}return e}function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_unsupportedIterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _iterableToArray(e){if(typeof Symbol!=="undefined"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}function _slicedToArray(e,t){return _arrayWithHoles(e)||_iterableToArrayLimit(e,t)||_unsupportedIterableToArray(e,t)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(e,t){if(!e)return;if(typeof e==="string")return _arrayLikeToArray(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);if(r==="Object"&&e.constructor)r=e.constructor.name;if(r==="Map"||r==="Set")return Array.from(e);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return _arrayLikeToArray(e,t)}function _arrayLikeToArray(e,t){if(t==null||t>e.length)t=e.length;for(var r=0,o=new Array(t);r<t;r++){o[r]=e[r]}return o}function _iterableToArrayLimit(e,t){var r=e==null?null:typeof Symbol!=="undefined"&&e[Symbol.iterator]||e["@@iterator"];if(r==null)return;var o=[];var n=true;var i=false;var a,s;try{for(r=r.call(e);!(n=(a=r.next()).done);n=true){o.push(a.value);if(t&&o.length===t)break}}catch(e){i=true;s=e}finally{try{if(!n&&r["return"]!=null)r["return"]()}finally{if(i)throw s}}return o}function _arrayWithHoles(e){if(Array.isArray(e))return e}sap.ui.define(["com/innova/sigc/formatter/formatMessage","com/innova/sigc/formatter/formatMessageType","com/innova/sigc/lib/formUtils/formUtils","com/innova/sigc/model/constant","com/innova/sigc/model/process/roundsProcessStatus/RoundsProcessStatus","com/innova/sigc/model/process/poCreate/Imputacion","com/innova/sigc/model/process/poCreate/PoCreate","com/innova/sigc/model/process/poCreate/Posicion","com/innova/sigc/model/process/poCreate/Servicio","com/innova/sigc/model/searchHelp/SearchHelp","com/innova/sigc/service/http","com/innova/sigc/service/petitions","com/innova/sigc/utils/addLeadingZeros","com/innova/sigc/utils/checkIfNumberBetween","com/innova/sigc/utils/isEmpty","com/innova/vendor/lodash.find","com/innova/vendor/lodash.get","sap/m/MessageBox","sap/ui/core/Fragment","sap/ui/model/json/JSONModel"],function(e,t,r,o,n,i,a,s,c,u,d,l,p,f,h,_,m,g,v,b){return{formatMessageType:t,onCreateOrderButtonPress:function e(t){var r=this;var o=t.offerId;var n=this._oFormModel.getProperty("/offers");var i=_(n,{angnr:o});if(m(i,"vendor.lifnr","")===""){g.error(this._i18n.getText("0416",i.vendor.name1));return}if(i){Promise.resolve(this._oPage.setBusy(true)).then(this._getPosTypeAndKnttp.bind(this)).then(function(e){var t=_slicedToArray(e,3),o=t[0],n=t[1],a=t[2];return r._buildOrderModel({posType:o,knttp:n,offer:i,taxCode:a})}).then(this._openCreateOrderDialog.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage,false))}},onCreateOrder:function e(){Promise.resolve(this._oCreateOrderDialog.setBusy(true)).then(this._isValidForm.bind(this,this.byId("headerDataForm"))).then(this._buildReqToCreateOrder.bind(this)).then(l.post.bind(l,o.GET_CREATE_ORDER)).then(this._showNotificationsForCreateOrder.bind(this)).then(this._updatePurchaseOrder.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oCreateOrderDialog.setBusy.bind(this._oCreateOrderDialog,false))},getMessagePopover:function e(){if(!this._messagePopoveNotification){this._messagePopoveNotification=new sap.m.MessagePopover({items:{path:"/",template:new sap.m.MessageItem({type:{path:"TYPE",formatter:t},title:"{MESSAGE}",description:"{MESSAGE}"})}})}return this._messagePopoveNotification},onImputacionButtonPress:function e(t){var r=this;var o=t.getBindingContext();var n=this.getView();var i=o.getProperty("imputations");v.load({id:n.getId(),name:"com.innova.sigc.view.biddingProcess.dialog.order.CreateImputacion",controller:this}).then(function(e){var t=e;n.addDependent(t);t.getEndButton().attachPress(t.close.bind(t));r._oCreateImputacionDialog=t;t.setModel(new b({contextPosition:o,imputacion:i!==null&&i!==void 0?i:[]}));t.attachAfterClose(t.destroy.bind(t));t.open()})},onPercentageImputacionChange:function e(t){var r=t.getValue();t.setValueState(sap.ui.core.ValueState.None);if(!f(r,1,100)){t.setValueState(sap.ui.core.ValueState.Error);t.setValue("")}},onAddImputacion:function e(){var t=this;var o=this.byId("imputacionDataForm");Promise.resolve(this._oCreateImputacionDialog.setBusy(true)).then(this._isValidForm.bind(this,o)).then(this._checkImputationPercentageBeforeAdding.bind(this,o)).then(function(){var e=r.getFormData(o);var n=t._oCreateImputacionDialog.getModel();var i=n.getProperty("/imputacion");n.setProperty("/imputacion",[].concat(_toConsumableArray(i),[_objectSpread(_objectSpread({},e),{},{SERIAL_NO:i.length+1})]));o.getFormContainers().forEach(function(e){r.cleanFields({formElements:e.getFormElements()})})}).catch(this.errorHandler.bind(this)).finally(this._oCreateImputacionDialog.setBusy.bind(this._oCreateImputacionDialog,false))},onDeleteImputacion:function e(){var t=this;var r=this.byId("listOfImputations");Promise.resolve(this._oCreateImputacionDialog.setBusy(true)).then(this._getSelectedItems.bind(this,r)).then(function(e){var o=e.map(function(e){return e.getBindingContext().getProperty("SERIAL_NO")});var n=t._oCreateImputacionDialog.getModel();var i=n.getProperty("/imputacion");n.setProperty("/imputacion",i.filter(function(e){return!o.includes(e.SERIAL_NO)}).map(function(e,t){return _objectSpread(_objectSpread({},e),{},{SERIAL_NO:t+1})}));r.removeSelections(true)}).catch(this.errorHandler.bind(this)).finally(this._oCreateImputacionDialog.setBusy.bind(this._oCreateImputacionDialog,false))},onCreateImputations:function e(){try{var t=this._oCreateImputacionDialog.getModel();var r=t.getProperty("/contextPosition");var o=t.getProperty("/imputacion");var n=o.reduce(function(e,t){return e+parseFloat(t.DISTR_PERC)},0);if(n!==100){throw new Error(this._i18n.getText("0371"))}var i=r.getObject();i.imputations=o;r.getModel().updateBindings();this._oCreateImputacionDialog.close()}catch(e){this.errorHandler(e)}},onDeletePurchaseOrder:function e(t){var r=this;var n=t.value,i=t.offerId,a=t.vendorName;g.confirm(this._i18n.getText("0421",[n,a]),{actions:[g.Action.OK,this._i18n.getText("Commons.0007")],emphasizedAction:this._i18n.getText("Commons.0007"),onClose:function e(t){if(t===g.Action.OK){Promise.resolve(r._oPage.setBusy(true)).then(l.post.bind(l,o.GET_DELETE_ORDER,{IV_PEDIDO:n})).then(r._handleResponseDeleteSapOrder.bind(r,i)).then(r._showNotifications.bind(r)).then(r._fetchAPI.bind(r,r._numProc)).then(r._fetchOffers.bind(r)).then(r._fetchQualificationSummary.bind(r)).catch(r.errorHandler.bind(r)).finally(r._oPage.setBusy.bind(r._oPage,false))}}})},_getPosTypeAndKnttp:function e(){return[this._getPosType(),this._getKnttp(),this._getTaxCode()].reduce(function(e,t){return e.then(function(e){return t.then(function(t){return[].concat(_toConsumableArray(e),[t])})})},Promise.resolve([]))},_getTaxCode:function e(){var t=new u("MWSKZ",{FCAT:"X"});t.setFCODE1("TAXCO");return l.post(o.GET_SEARCH_HELP,t).then(function(e){var t=e.data;return t})},_getPosType:function e(){return l.post(o.GET_SEARCH_HELP,new u("PSTYP",{FCAT:"X"})).then(function(e){var t=e.data;return t})},_getKnttp:function e(){return l.post(o.GET_SEARCH_HELP,new u("KNTTP",{FCAT:"X"})).then(function(e){var t=e.data;return t})},_buildOrderModel:function e(t){var r=t.posType,o=t.knttp,i=t.offer,a=t.taxCode;var s=this._oFormModel.getData();var c=m(s,"roundsProcess",[]);var u=m(s,"positions",[]);var d=s.bukrs,l=s.ekorg,p=s.waers,f=s.ekgrp,g=s.zterm,v=s.dzterm;var y=_(c,{estatusRonda:n.ABIERTO.status});var P=y===null||y===void 0?void 0:y.roundId;var T=i.pricesPerRound,E=i.positions;return new b({bukrs:d,ekgrp:f,ekorg:l,offer:i,dzterm:v,positions:u.map(function(e){var t;var r=e.id;var o=(t=e.eeind)===null||t===void 0?void 0:t.replace(/T.+/,"");var n=_(T,{roundId:P,positionId:r});var i=_(E,{positionId:r});return _objectSpread(_objectSpread({},e),{},{eeind:o,price:n,offerPosition:i})}).filter(function(e){var t=e.offerPosition;return!h(t===null||t===void 0?void 0:t.cantAsig)}),waers:p,zterm:g,editable:true,searchHelp:{posType:r,knttp:o,taxCode:a}})},_openCreateOrderDialog:function e(t){var r=this;var o=this.getView();return v.load({id:o.getId(),name:"com.innova.sigc.view.biddingProcess.dialog.order.CreateOrder",controller:this}).then(function(e){var n=e;o.addDependent(n);n.getEndButton().attachPress(n.close.bind(n));r._oCreateOrderDialog=n;n.setModel(t);n.attachAfterClose(function(){r._oCreateOrderDialog=null;n.destroy()});n.open()})},_buildReqToCreateOrder:function e(){var t=r.getFormData(this.byId("headerDataForm"));var o=this._oCreateOrderDialog.getModel().getProperty("/positions");var n=this._buildPositionsToCreateOrder(o);var i=this._buildServicesToCreateOrder(o);var s=this._buildImputationsToCreateOrder(o);var c=this.byId("headerText").getValue();var u=this.byId("noteText").getValue();var d=[].concat(this._buildHeaderText({text:c,textId:"F01"}),this._buildHeaderText({text:u,textId:"F02"}));var l=this._oCreateOrderDialog.getModel().getProperty("/offer/vendor/lifnr");return new a({header:_objectSpread(_objectSpread({},t),{},{VENDOR:l,COLLECT_NO:this._numProc}),textoCab:d,positions:n,services:i,imputations:s})},_buildPositionsToCreateOrder:function e(t){return t.map(function(e){return new s({PO_ITEM:e.posProc,MATERIAL:e.matnr,SHORT_TEXT:e.maktx,QUANTITY:m(e,"offerPosition.cantAsig",0),PO_UNIT:e.meins,DELIVERY_DATE:e.eeind,NET_PRICE:m(e,"price.bbwert",0),MATL_GROUP:e.matkl,PLANT:e.werks,PREQ_NAME:e.afnam,ITEM_CAT:e.posType,ACCTASSCAT:e.knttp,PREQ_NO:e.banfn,PREQ_ITEM:e.bnfpo,TAX_CODE:e.taxCode})})},_buildServicesToCreateOrder:function e(t){return t.filter(function(e){var t=e.posType;return t==="F"}).map(function(e){return new c({PO_ITEM:e.posProc,LINE_NO:"0000000001",SERVICE:"",SHORT_TEXT:e.maktx,QUANTITY:m(e,"offerPosition.cantAsig",0),BASE_UOM:e.meins,GR_PRICE:m(e,"price.bbwert",0),MATL_GROUP:e.matkl})})},_buildImputationsToCreateOrder:function t(r){var o=this;var n=r.filter(function(e){var t=e.knttp;return!h(t)});var a=[];n.forEach(function(t){var r=t.imputations;if(h(r)){throw new Error(e(o._i18n.getText("0369"),[t.posProc]))}a=a.concat(r.map(function(e){return new i({PO_ITEM:t.posProc,LINE_NO:"0000000001",SERIAL_NO:e.SERIAL_NO,DISTR_PERC:parseFloat("".concat(parseInt(e.DISTR_PERC,10)/100)).toFixed(2),G_L_ACCT:e.G_L_ACCT,COST_CTR:e.COST_CTR,ORDER_NO:e.ORDER_NO,WBS_ELEMENT:e.WBS_ELEMENT,GR_RCPT:e.GR_RCPT})}))});return a},_buildHeaderText:function e(t){var r=t.text,o=t.textId;var n=[];var i=r.split(/\r?\n/).filter(Boolean);for(var a=0;a<i.length;a+=1){var s=i[a];n.push({TEXT_ID:o,SECUENCIA:p(a+1,3),TEXT_FORM:null,TEXT_LINE:s})}return n},_showNotificationsForCreateOrder:function e(t){var r=t.data;var o=this.getMessagePopover();var n=this.byId("messagePopoverBtn");n.setText("".concat(r.ET_MENSAJES.length));n.setEnabled(true);n.attachPress(function e(){o.toggle(this)});o.setModel(new b(r.ET_MENSAJES));o.toggle(n);o._oPopover.setModal(true);return r.PO_NUMBER},_updatePurchaseOrder:function e(t){if(t){var r=this._oCreateOrderDialog.getModel();var n=r.getProperty("/offer/angnr");r.setProperty("/poNumber",t);r.setProperty("/editable",false);this.byId("createOrdenBtn").setVisible(false);this.byId("closeCreateOrderBtn").setText(this._i18n.getText("Commons.0032"));this.byId("closeCreateOrderBtn").setType("Accept");return d.post("".concat(o.api.PROCESS_PATH,"/").concat(this._numProc,"/").concat(o.api.PURCHASE_ORDER),{angnr:n,purchaseOrder:t})}return Promise.resolve()},_checkImputationPercentageBeforeAdding:function e(t){var o=r.getFormData(t),n=o.DISTR_PERC;var i=this._oCreateImputacionDialog.getModel();var a=i.getProperty("/imputacion");var s=a.reduce(function(e,t){return e+parseFloat(t.DISTR_PERC)},parseFloat(n));if(s>100){throw new Error(this._i18n.getText("0370"))}},_handleResponseDeleteSapOrder:function e(t,r){var n=r.data;var i=n.some(function(e){var t=e.TYPE;return t==="E"});this._oDeletePurchaseOrderNotifications={notifications:n,state:i?"Error":"Success"};var a=Promise.resolve();if(!i){a=d.post("".concat(o.api.PROCESS_PATH,"/").concat(this._numProc,"/").concat(o.api.DELETE_PURCHASE_ORDER),{angnr:t})}return a},_showNotifications:function e(){var t=this;var r=this.getView();return v.load({id:r.getId(),name:"com.innova.sigc.view.biddingProcess.dialog.order.ShowNotifications",controller:this}).then(function(e){var o=e;r.addDependent(o);o.getEndButton().attachPress(o.close.bind(o));o.attachAfterClose(o.destroy.bind(o));o.setModel(new b(t._oDeletePurchaseOrderNotifications));var n=t.byId("messageView");var i=t.byId("backButton");n.attachItemSelect(i.setVisible.bind(i,true));i.attachPress(function(){n.navigateBack();i.setVisible(false)});t._oDeleteOrderDialog=o;o.open()})}}});