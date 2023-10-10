function initModel() {
	var sUrl = "/sap/opu/odata/sap/ZGWGLRH_MEU_CADASTRO_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}