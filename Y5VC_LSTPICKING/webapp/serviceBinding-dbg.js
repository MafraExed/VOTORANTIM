function initModel() {
	var sUrl = "/SSO_IDP_GW_FI1/sap/opu/odata/sap/ZGWVCMM_GESTAO_ESTOQUE_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}