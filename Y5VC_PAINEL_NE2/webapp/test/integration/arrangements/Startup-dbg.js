sap.ui.define(["sap/ui/test/Opa5","Y5VC_PAINEL_NE2/Y5VC_PAINEL_NE2/localService/mockserver","sap/ui/model/odata/v2/ODataModel","sap/ui/core/routing/HashChanger","Y5VC_PAINEL_NE2/Y5VC_PAINEL_NE2/test/flpSandbox","sap/ui/fl/FakeLrepConnectorLocalStorage"],function(t,e,a,i,r,s){"use strict";return t.extend("Y5VC_PAINEL_NE2.Y5VC_PAINEL_NE2.test.integration.arrangements.Startup",{iStartMyFLPApp:function(t){var a=t||{};this._clearSharedData();a.delay=a.delay||1;var n=[];n.push(e.init(a));n.push(r.init());this.iWaitForPromise(Promise.all(n));s.enableFakeConnector();this.waitFor({autoWait:a?a.autoWait:true,success:function(){(new i).setHash(a.intent+(a.hash?"&/"+a.hash:""))}})},iRestartTheAppWithTheRememberedItem:function(t){var e;this.waitFor({success:function(){e=this.getContext().currentItem.id}});this.waitFor({success:function(){t.hash="ZET_VCFI_TIT_COBRARSet/"+encodeURIComponent(e);this.iStartMyFLPApp(t)}})},_clearSharedData:function(){a.mSharedData={server:{},service:{},meta:{}}}})});