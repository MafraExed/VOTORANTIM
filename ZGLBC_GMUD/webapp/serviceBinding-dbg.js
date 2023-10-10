function initModel() {
	var sUrl = "/sap/opu/odata/sap/ZGWGLBC_CHARM_UTILS_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}