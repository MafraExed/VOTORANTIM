function initModel() {
	var sUrl = "/odata/v2/CalibrationSession/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}