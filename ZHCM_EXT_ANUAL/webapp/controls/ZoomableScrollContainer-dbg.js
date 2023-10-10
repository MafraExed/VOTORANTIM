/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mypaystubs.controls.ZoomableScrollContainer");

sap.m.ScrollContainer.extend("hcm.mypaystubs.controls.ZoomableScrollContainer", { metadata:{

    // ---- object ----
    publicMethods:[
        // methods
    ],

    // ---- control specific ----
    library:"sap.m",
    properties:{
        "zoomable":{type:"boolean", group:"Misc", defaultValue:true},
        "initialScale":{type:"float", group:"Misc", defaultValue:1},
        "minScale":{type:"float", group:"Misc", defaultValue:1},
        "maxScale":{type:"float", group:"Misc", defaultValue:4}
    },
    events:{

    }
}});


hcm.mypaystubs.controls.ZoomableScrollContainer.prototype.init = function() {
    sap.m.ScrollContainer.prototype.init.apply(this);

};

hcm.mypaystubs.controls.ZoomableScrollContainer.prototype.onAfterRendering = function() {

    var fnCallback = this.getScrollDelegate().onAfterRendering;

    var fScale = this.getInitialScale();
    var fMin = this.getMinScale();
    var fMax = this.getMaxScale();
    var bZoomable = this.getZoomable();


    this.getScrollDelegate().onAfterRendering = function(){
        fnCallback.call(this);
        if(this._scroller){
        	this._scroller.scale = fScale;
        	if(this._scroller.options){
        		this._scroller.options.zoom = bZoomable;
                this._scroller.options.zoomMin = fMin;
                this._scroller.options.zoomMax = fMax;
                this._scroller.options.onZoom = function(oEvent) {
                    // "this" is the scroller
                };
                this._scroller.options.onZoomStart = function(oEvent) {
                };
        	}
        	if(this._scroller.zoom){
        		   this._scroller.zoom(0, 0, fScale);
        	}
        }
    };
};



//
hcm.mypaystubs.controls.ZoomableScrollContainer.prototype.resetContent = function() {
    this.$().append(this.getContent()[0].$());
    this.getScrollDelegate()._scroller.refresh();
};