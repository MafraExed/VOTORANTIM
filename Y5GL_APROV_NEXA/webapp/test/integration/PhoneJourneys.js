jQuery.sap.require("sap.ui.qunit.qunit-css");jQuery.sap.require("sap.ui.thirdparty.qunit");jQuery.sap.require("sap.ui.qunit.qunit-junit");QUnit.config.autostart=false;sap.ui.require(["sap/ui/test/Opa5","Y5GL_APROV_NEXA/Y5GL_APROV_NEXA/test/integration/pages/Common","sap/ui/test/opaQunit","Y5GL_APROV_NEXA/Y5GL_APROV_NEXA/test/integration/pages/App","Y5GL_APROV_NEXA/Y5GL_APROV_NEXA/test/integration/pages/Browser","Y5GL_APROV_NEXA/Y5GL_APROV_NEXA/test/integration/pages/Master","Y5GL_APROV_NEXA/Y5GL_APROV_NEXA/test/integration/pages/Detail","Y5GL_APROV_NEXA/Y5GL_APROV_NEXA/test/integration/pages/NotFound"],function(t,e){"use strict";t.extendConfig({arrangements:new e,viewNamespace:"Y5GL_APROV_NEXA.Y5GL_APROV_NEXA.view."});sap.ui.require(["Y5GL_APROV_NEXA/Y5GL_APROV_NEXA/test/integration/NavigationJourneyPhone","Y5GL_APROV_NEXA/Y5GL_APROV_NEXA/test/integration/NotFoundJourneyPhone","Y5GL_APROV_NEXA/Y5GL_APROV_NEXA/test/integration/BusyJourneyPhone"],function(){QUnit.start()})});