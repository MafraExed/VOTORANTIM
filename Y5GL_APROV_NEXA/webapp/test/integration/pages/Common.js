sap.ui.define(["sap/ui/test/Opa5"],function(e){"use strict";function t(e,t){var r=jQuery.sap.getResourcePath("Y5GL_APROV_NEXA/Y5GL_APROV_NEXA/app",".html");e=e||"";t=t?"?"+t:"";if(e){e="#"+(e.indexOf("/")===0?e.substring(1):e)}else{e=""}return r+t+e}return e.extend("Y5GL_APROV_NEXA.Y5GL_APROV_NEXA.test.integration.pages.Common",{iStartTheApp:function(e){e=e||{};this.iStartMyAppInAFrame(t(e.hash,"serverDelay=50"))},iStartTheAppWithDelay:function(e,r){this.iStartMyAppInAFrame(t(e,"serverDelay="+r))},iLookAtTheScreen:function(){return this},iStartMyAppOnADesktopToTestErrorHandler:function(e){this.iStartMyAppInAFrame(t("",e))},createAWaitForAnEntitySet:function(e){return{success:function(){var t=false,r;this.getMockServer().then(function(n){r=n.getEntitySetData(e.entitySet);t=true});return this.waitFor({check:function(){return t},success:function(){e.success.call(this,r)}})}}},getMockServer:function(){return new Promise(function(t){e.getWindow().sap.ui.require(["Y5GL_APROV_NEXA/Y5GL_APROV_NEXA/localService/mockserver"],function(e){t(e.getMockServer())})})},theUnitNumbersShouldHaveTwoDecimals:function(t,r,n,i){var s=/^-?\d+\.\d{2}$/;return this.waitFor({controlType:t,viewName:r,success:function(t){e.assert.ok(t.every(function(e){return s.test(e.getNumber())}),n)},errorMessage:i})}})});