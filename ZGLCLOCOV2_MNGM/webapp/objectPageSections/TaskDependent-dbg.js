sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
	"use strict";

	var ViewType = coreLibrary.mvc.ViewType;

	var TaskDependent = BlockBase.extend("votorantim.corp.clocov2planmanagement.objectPageSections.TaskDependent", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "votorantim.corp.clocov2planmanagement.view.TaskDependent",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "votorantim.corp.clocov2planmanagement.view.TaskDependent",
					type: ViewType.XML
				}
			}
		}
	});
	return TaskDependent;
});
