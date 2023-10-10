sap.ui.define(["sap/base/util/ObjectPath","sap/ushell/services/Container"],function(e){"use strict";e.set(["sap-ushell-config"],{defaultRenderer:"fiori2",bootstrapPlugins:{RuntimeAuthoringPlugin:{component:"sap.ushell.plugins.rta",config:{validateAppVersion:false}},PersonalizePlugin:{component:"sap.ushell.plugins.rta-personalize",config:{validateAppVersion:false}}},renderers:{fiori2:{componentData:{config:{enableSearch:false,rootIntent:"Shell-home"}}}},services:{LaunchPage:{adapter:{config:{groups:[{tiles:[{tileType:"sap.ushell.ui.tile.StaticTile",properties:{title:"Y5GL_FERI_NEXA",targetURL:"#Y5GL_FERI_NEXA-display"}}]}]}}},ClientSideTargetResolution:{adapter:{config:{inbounds:{"Y5GL_FERI_NEXA-display":{semanticObject:"Y5GL_FERI_NEXA",action:"display",description:"Y5GL_FERI_NEXA",title:"Y5GL_FERI_NEXA",signature:{parameters:{}},resolutionResult:{applicationType:"SAPUI5",additionalInformation:"SAPUI5.Component=Y5GL_FERI_NEXA.Y5GL_FERI_NEXA",url:sap.ui.require.toUrl("Y5GL_FERI_NEXA/Y5GL_FERI_NEXA")}}}}}},NavTargetResolution:{config:{enableClientSideTargetResolution:true}}}});var t={init:function(){if(!this._oBootstrapFinished){this._oBootstrapFinished=sap.ushell.bootstrap("local");this._oBootstrapFinished.then(function(){sap.ushell.Container.createRenderer().placeAt("content")})}return this._oBootstrapFinished}};return t});