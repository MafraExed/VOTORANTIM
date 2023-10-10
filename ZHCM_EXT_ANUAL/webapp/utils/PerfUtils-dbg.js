/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mypaystubs.utils.PerfUtils");
//hcm.emp.payslip.utils.PerfUtils.getMeasurements();
/*global hcm:true*/
hcm.mypaystubs.utils.PerfUtils = {

    MASTER_INIT : "hcm.mypaystubs.utils.MASTER_INIT",
    DETAIL_INIT : "hcm.mypaystubs.utils.DETAIL_INIT",
    PaystubLoading : "hcm.mypaystubs.utils.PaystubLoading",
    afterZoomableScrollContainerRendering : "hcm.mypaystubs.utils.afterZoomableScrollContainerRendering",
    onGetListSuccess : "hcm.mypaystubs.utils.onGetListSuccess",
    onListSelect : "hcm.mypaystubs.utils.onListSelect",
    RenderPdf : "hcm.mypaystubs.utils.RenderPdf",
    getPdfUrl: "hcm.mypaystubs.utils.getPdfUrl",
    lazyRoundNumber : "hcm.mypaystubs.utils.lazyRoundNumber",
    updateModel : "hcm.mypaystubs.utils.updateModel",
    LoadPdfData : "hcm.mypaystubs.utils.LoadPdfData",
    getDocument : "hcm.mypaystubs.utils.getDocument",
    showBusyCursor : "hcm.mypaystubs.utils.showBusyCursor",
    hideBusyCursor : "hcm.mypaystubs.utils.hideBusyCursor",
    openApplication : "hcm.mypaystubs.utils.openApplication",
    MasterView : "hcm.mypaystubs.utils.MasterView",
    DetailView : "hcm.mypaystubs.utils.DetailView",

    _mCounter:{},
    getMeasurements : function(){
        var aMeasures = jQuery.sap.measure.getAllMeasurements();
        var aOutputs = [];
        for( var i in aMeasures){
            var oMeasure = aMeasures[i];
            var oOutput = {
                "id" : oMeasure.id,
                "info" : (oMeasure.info ? oMeasure.info : ''),
                "start" : oMeasure.start.toString(),
                "end" : oMeasure.end.toString(),
                "time"  : oMeasure.time,
                "duration" : oMeasure.duration
            };
            aOutputs.push(oOutput);
        }
        var sOutput = JSON.stringify(aOutputs);
        return sOutput;
    },
    getStartId:function(id){
        if(hcm.mypaystubs.utils.PerfUtils._mCounter[id]==undefined){
            hcm.mypaystubs.utils.PerfUtils._mCounter[id]=-1;
        }
        hcm.mypaystubs.utils.PerfUtils._mCounter[id]++;
        return id +" ("+hcm.mypaystubs.utils.PerfUtils._mCounter[id]+")";
    },
    getEndId:function(id){
        if(hcm.mypaystubs.utils.PerfUtils._mCounter[id]==undefined){
            hcm.mypaystubs.utils.PerfUtils._mCounter[id]=0;
        }
        return id +" ("+hcm.mypaystubs.utils.PerfUtils._mCounter[id]+")";
    }
};