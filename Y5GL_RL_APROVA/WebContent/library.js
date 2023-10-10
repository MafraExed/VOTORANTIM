sap.ui.define([

"sap/ui/core/Core", "sap/ui/core/library"

], function(Core, Library) {

	"use strict";

	sap.ui.getCore().initLibrary({
		name : "vsa.y5gl_rl_portal",
		dependencies : [ "sap.ui.core" ],
		types : [],
		interfaces : [],
		controls : [ "vsa.y5gl_rl_portal.base" ],
		elements : [],
		version : "1.0.0"
	});

	return vsa.y5gl_rl_portal;

}, /* bExport= */false);