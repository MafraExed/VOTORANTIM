jQuery.sap.require("sap.ui.qunit.qunit-css");jQuery.sap.require("sap.ui.thirdparty.qunit");jQuery.sap.require("sap.ui.qunit.qunit-junit");QUnit.config.autostart=false;sap.ui.require(["sap/ui/test/Opa5","Y5GL_DECLARACOES/Y5GL_DECLARACOES/test/integration/pages/Common","sap/ui/test/opaQunit","Y5GL_DECLARACOES/Y5GL_DECLARACOES/test/integration/pages/App","Y5GL_DECLARACOES/Y5GL_DECLARACOES/test/integration/pages/Browser","Y5GL_DECLARACOES/Y5GL_DECLARACOES/test/integration/pages/Master","Y5GL_DECLARACOES/Y5GL_DECLARACOES/test/integration/pages/Detail","Y5GL_DECLARACOES/Y5GL_DECLARACOES/test/integration/pages/NotFound"],function(t,e){"use strict";t.extendConfig({arrangements:new e,viewNamespace:"Y5GL_DECLARACOES.Y5GL_DECLARACOES.view."});sap.ui.require(["Y5GL_DECLARACOES/Y5GL_DECLARACOES/test/integration/MasterJourney","Y5GL_DECLARACOES/Y5GL_DECLARACOES/test/integration/NavigationJourney","Y5GL_DECLARACOES/Y5GL_DECLARACOES/test/integration/NotFoundJourney","Y5GL_DECLARACOES/Y5GL_DECLARACOES/test/integration/BusyJourney","Y5GL_DECLARACOES/Y5GL_DECLARACOES/test/integration/FLPIntegrationJourney"],function(){QUnit.start()})});