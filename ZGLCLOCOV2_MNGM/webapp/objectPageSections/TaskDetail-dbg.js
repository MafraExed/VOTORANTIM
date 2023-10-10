sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
	"use strict";

	var ViewType = coreLibrary.mvc.ViewType;

	var TaskDetail = BlockBase.extend("votorantim.corp.clocov2planmanagement.objectPageSections.TaskDetail", {
		metadata: {
			views: {
				Collapsed: {
					id: "idTaskDetailView",
					viewName: "votorantim.corp.clocov2planmanagement.view.TaskDetail",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "votorantim.corp.clocov2planmanagement.view.TaskDetail",
					id: "idTaskDetailView",
					type: ViewType.XML
				}
			},
			events:{
				"datachanged": {}
			}
		}
	});
	return TaskDetail;
});
