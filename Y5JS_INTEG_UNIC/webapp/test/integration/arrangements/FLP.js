sap.ui.define(["sap/ui/test/Opa5","sap/ui/core/routing/HashChanger","sap/ui/dom/includeStylesheet","sap/ui/model/odata/v2/ODataModel","sap/ui/fl/FakeLrepConnectorLocalStorage","../../../localService/mockserver","votorantim/Y5JS_INTEGRACAO_UNICO/test/flpSandbox"],function(t,e,a,i,n,o,s){"use strict";function r(){a(sap.ui.require.toUrl("sap/ui/test/OpaCss.css"))}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",r):r();return t.extend("votorantim.Y5JS_INTEGRACAO_UNICO.test.integration.arrangements.FLP",{iStartMyFLPApp:function(t){var a=t||{};a.autoWait=typeof a.autoWait!=="undefined"?a.autoWait:true;a.delay=a.delay||1;this._clearSharedData();var i=[o.init(a),s.init()];this.iWaitForPromise(Promise.all(i));n.enableFakeConnector();this.waitFor({autoWait:a.autoWait,success:function(){(new e).setHash(a.intent+(a.hash?"&/"+a.hash:""))}})},iRestartTheAppWithTheRememberedItem:function(t){this.waitFor({success:function(){var e=this.getContext().currentItem.id;t.hash="ZET_CBMM_CF_APROVADORSet/"+encodeURIComponent(e);this.iStartMyFLPApp(t)}})},iLeaveMyFLPApp:function(){return this.waitFor({success:function(){(new e).setHash("Shell-home")}})},_clearSharedData:function(){i.mSharedData={server:{},service:{},meta:{}}}})});