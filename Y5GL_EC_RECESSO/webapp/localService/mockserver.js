sap.ui.define(["sap/ui/core/util/MockServer"],function(e){"use strict";var t,a="Y5GL_EC_RECESSO/Y5GL_EC_RECESSO/",r=a+"localService/mockdata";return{init:function(){var n=jQuery.sap.getUriParameters(),i=jQuery.sap.getModulePath(r),o=jQuery.sap.getModulePath(a+"manifest",".json"),s="ZET_AVISOFERSet",u=n.get("errorType"),c=u==="badRequest"?400:500,p=jQuery.sap.syncGetJSON(o).data,f=p["sap.app"].dataSources.mainService,d=jQuery.sap.getModulePath(a+f.settings.localUri.replace(".xml",""),".xml"),g=/.*\/$/.test(f.uri)?f.uri:f.uri+"/";t=new e({rootUri:g});e.config({autoRespond:true,autoRespondAfter:n.get("serverDelay")||1e3});t.simulate(d,{sMockdataBaseUrl:i,bGenerateMissingMockData:true});var l=t.getRequests(),S=function(e,t,a){a.response=function(a){a.respond(e,{"Content-Type":"text/plain;charset=utf-8"},t)}};if(n.get("metadataError")){l.forEach(function(e){if(e.path.toString().indexOf("$metadata")>-1){S(500,"metadata Error",e)}})}if(u){l.forEach(function(e){if(e.path.toString().indexOf(s)>-1){S(c,u,e)}})}t.setRequests(l);t.start();jQuery.sap.log.info("Running the app with mock data")},getMockServer:function(){return t}}});