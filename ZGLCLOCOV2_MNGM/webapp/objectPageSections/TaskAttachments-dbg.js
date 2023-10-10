sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
	"use strict";

	var ViewType = coreLibrary.mvc.ViewType;

	var TaskAttachments = BlockBase.extend("votorantim.corp.clocov2planmanagement.objectPageSections.TaskAttachments", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "votorantim.corp.clocov2planmanagement.view.TaskAttachments",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "votorantim.corp.clocov2planmanagement.view.TaskAttachments",
					type: ViewType.XML
				}
			}
		}
	});
	return TaskAttachments;
});
