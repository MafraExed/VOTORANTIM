"use strict";function _slicedToArray(e,t){return _arrayWithHoles(e)||_iterableToArrayLimit(e,t)||_unsupportedIterableToArray(e,t)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(e,t){if(!e)return;if(typeof e==="string")return _arrayLikeToArray(e,t);var o=Object.prototype.toString.call(e).slice(8,-1);if(o==="Object"&&e.constructor)o=e.constructor.name;if(o==="Map"||o==="Set")return Array.from(e);if(o==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o))return _arrayLikeToArray(e,t)}function _arrayLikeToArray(e,t){if(t==null||t>e.length)t=e.length;for(var o=0,a=new Array(t);o<t;o++){a[o]=e[o]}return a}function _iterableToArrayLimit(e,t){var o=e==null?null:typeof Symbol!=="undefined"&&e[Symbol.iterator]||e["@@iterator"];if(o==null)return;var a=[];var n=true;var r=false;var i,l;try{for(o=o.call(e);!(n=(i=o.next()).done);n=true){a.push(i.value);if(t&&a.length===t)break}}catch(e){r=true;l=e}finally{try{if(!n&&o["return"]!=null)o["return"]()}finally{if(r)throw l}}return a}function _arrayWithHoles(e){if(Array.isArray(e))return e}function ownKeys(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),o.push.apply(o,a)}return o}function _objectSpread(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?ownKeys(Object(o),!0).forEach(function(t){_defineProperty(e,t,o[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):ownKeys(Object(o)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))})}return e}function _defineProperty(e,t,o){if(t in e){Object.defineProperty(e,t,{value:o,enumerable:true,configurable:true,writable:true})}else{e[t]=o}return e}
/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["com/innova/model/constant","com/innova/model/layout/Action","com/innova/model/layout/Function","com/innova/model/layout/Layout","com/innova/service/petitions","com/innova/vendor/lodash.set","sap/m/Button","sap/m/CheckBox","sap/m/ComboBox","sap/m/Dialog","sap/m/Input","sap/m/Label","sap/ui/core/Fragment","sap/ui/core/Item","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/model/json/JSONModel"],function(e,t,o,a,n,r,i,l,s,u,c,d,h,g,y,f,p){var v={onModifyLayouts:function e(){var t=this;if(!this._oNoOutColumnDialog){h.load({id:this.getView().getId(),name:"com.innova.sitrack.view.layout.Layout",controller:this}).then(function(e){t.getView().addDependent(e);e.addStyleClass(t.getOwnerComponent().getContentDensityClass());e.getEndButton().attachPress(function(){t._oModel.updateBindings();e.close()});e.getBeginButton().attachPress(v.onSaveLayout,t);var o=new p({catalog:t._oModel.getProperty("/catalog"),allCatalog:t._oModel.getProperty("/allCatalog")});o.setSizeLimit(1e6);e.setModel(o);t.byId("rowHeightCober").attachChange(v.onChangeStepInput.bind(t));v._setColumnOrder.call(t);t._oNoOutColumnDialog=e;t._oNoOutColumnDialog.open()}).catch(this.errorHandler.bind(this))}else{v._setColumnOrder.call(this);var o=new p({catalog:this._oModel.getProperty("/catalog"),allCatalog:this._oModel.getProperty("/allCatalog")});o.setSizeLimit(1e6);this._oNoOutColumnDialog.setModel(o);this.getView().byId("sfHiddenFields").setValue();this.getView().byId("sfVisibleFields").setValue();this._oNoOutColumnDialog.open()}},onSearchLayouts:function e(){var t=this;var o=this.getModel("appView");try{o.setProperty("/busy",true);v._fetchSearchLayout().then(function(e){var o=e.data;return v._showSearchLayoutDialog.call(t,{model:new p({data:o.layouts})})}).catch(this.errorHandler.bind(this)).then(o.setProperty.bind(o,"/busy",false))}catch(e){this.errorHandler(e);o.setProperty("/busy",false)}},onColumnResize:function e(t,o,a){var n=o;n||(n="125");var i=t.getBindingContext(a).getObject();r(i,"OUTPUTLEN",n.replace("px",""));r(i,"zNoOutChange",true)},onMoveSelectedFieldHandler:function e(t){var o=t.getBindingContext();var a=o.getModel();var n=o.getObject();var i=this._oModel.getProperty("/catalog");r(n,"NO_OUT","");r(n,"zNoOutChange",true);r(n,"COL_POS",i.length+1);i.push(n);a.updateBindings(false)},onMoveDeselectedFieldHandler:function e(t){var o=t.getBindingContext();var a=o.getModel();var n=o.getObject();var i=this._oModel.getProperty("/catalog");r(n,"NO_OUT","X");r(n,"zNoOutChange",true);a.updateBindings(false);var l=this._oModel.getProperty("/allCatalog")[n.FIELDNAME];r(l,"NO_OUT","X");var s=i.filter(function(e){var t=e.FIELDNAME;return t!==n.FIELDNAME}).map(function(e,t){return _objectSpread(_objectSpread({},e),{},{COL_POS:t+1})});this._oModel.setProperty("/catalog",s);a.setProperty("/catalog",s);a.updateBindings(true)},onChangeStepInput:function e(t){var o=t?t.getParameter("value")||this._iColumnHeight:this._iColumnHeight;this._oProcessTable.setRowHeight(o);this._oProcessTable.setColumnHeaderHeight(o);this._iColumnHeight=o},onSearch:function e(t,o){var a=[new y("TECH",f.NE,"X")];if(o&&o.length>0){a.push(new y({filters:[new y({path:"SCRTEXT_L",operator:f.Contains,value1:o}),new y({path:"REPTEXT",operator:f.Contains,value1:o})],and:false}))}var n=t.getParent().getParent();var r=n.getBinding("items");r.filter(a,"Control")},onSaveLayout:function e(){Promise.resolve(this._oNoOutColumnDialog.setBusy(true)).then(v._fetchSearchLayout.bind(this)).then(v._showSaveDialog.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oNoOutColumnDialog.setBusy.bind(this._oNoOutColumnDialog,false))},onSaveLayoutHandler:function e(){var t=this.byId("layoutComboBox");this._saveLayout({nameLayout:t.getSelectedKey()||t.getValue().trim(),defaultLayout:this.byId("defaultCheckbox").getSelected()?"X":""})},onSearchLayout:function e(t,o){var a=[];if(o&&o.length>0){a=[new y("LAYOUT",f.Contains,o)]}var n=t.getBinding("items");if(a.length!==0){n.filter(new y(a,false))}else{n.filter([])}},onConfirmLayout:function r(i){var l=arguments.length>1&&arguments[1]!==undefined?arguments[1]:[];if(l.length){var s=this.getModel("appView");try{s.setProperty("/busy",true);var u=_slicedToArray(l,1),c=u[0];var d=c.getProperty("LAYOUT");n.post("".concat(e.GET_LAYOUT),new a({function:o.PROCESS,action:t.GET,nameLayout:d,catalog:[]})).then(this._buildNewCatalog.bind(this)).catch(this.errorHandler.bind(this)).then(function(){return i.getBinding("items").filter([])}).finally(s.setProperty.bind(s,"/busy",false))}catch(e){this.errorHandler(e);s.setProperty("/busy",false)}}},_setColumnOrder:function e(){var t=this._oProcessTable.getColumns();t.forEach(function(e,t){var o=e.getBindingContext("process");var a=o.getObject();a.COL_POS=t+1});this._oModel.getProperty("/catalog").sort(function(e,t){return e.COL_POS-t.COL_POS});this._oModel.updateBindings()},_fetchSearchLayout:function r(){return n.post("".concat(e.GET_LAYOUT),new a({function:o.PROCESS,action:t.READ,catalog:[]}))},_showSaveDialog:function e(t){var o=t.data;this._oSaveDialog=new u({busyIndicatorDelay:0,stretch:"{device>/system/phone}",title:"{main>/textPool/K086}",type:"Message",content:[new d({labelFor:"layoutInput",required:true,text:"{main>/textPool/K099}",width:"100%"}),new s(this.createId("layoutComboBox"),{items:[o.layouts.sort(function(e,t){var o=e.LAYOUT.toLowerCase();var a=t.LAYOUT.toLowerCase();if(o<a){return-1}if(o>a){return 1}return 0}).map(function(e){var t=e.LAYOUT;return new g({key:t,text:t})})],width:"100%"}),new d({labelFor:"defaultCheckbox",text:"{main>/textPool/K100}",width:"100%"}),new l(this.createId("defaultCheckbox"),{useEntireWidth:true,width:"100%"})],beginButton:new i({text:"{main>/textPool/K065}",press:[v.onSaveLayoutHandler,this]}),endButton:new i({text:"{main>/textPool/K067}"})});this.getView().addDependent(this._oSaveDialog);this._oSaveDialog.attachAfterClose(this._oSaveDialog.destroy.bind(this._oSaveDialog));this._oSaveDialog.getEndButton().attachPress(this._oSaveDialog.close.bind(this._oSaveDialog));this._oSaveDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());this._oSaveDialog.open()},_showSearchLayoutDialog:function e(t){var o=this;var a=t.model;if(!this._oSearchLayoutDialog){h.load({id:this.getView().getId(),name:"com.innova.sitrack.view.layout.SearchLayout",controller:this}).then(function(e){o.getView().addDependent(e);e.addStyleClass(o.getOwnerComponent().getContentDensityClass());e.setModel(a);o._oSearchLayoutDialog=e;e.open()})}else{this._oSearchLayoutDialog.destroyItems();this._oSearchLayoutDialog.setModel(a);this._oSearchLayoutDialog.open()}}};return v});