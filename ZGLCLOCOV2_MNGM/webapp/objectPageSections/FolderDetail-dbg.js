sap.ui.define(["sap/ui/core/library", "sap/uxap/BlockBase"], function (coreLibrary, BlockBase) {
  "use strict";

  var ViewType = coreLibrary.mvc.ViewType;

  var FolderDetail = BlockBase.extend("votorantim.corp.clocov2planmanagement.objectPageSections.FolderDetail", {
    metadata: {
      views: {
        Collapsed: {
          viewName: "votorantim.corp.clocov2planmanagement.view.FolderDetail",
          type: ViewType.XML,
        },
        Expanded: {
          viewName: "votorantim.corp.clocov2planmanagement.view.FolderDetail",
          type: ViewType.XML,
        },
      },
    },
  });
  return FolderDetail;
});
