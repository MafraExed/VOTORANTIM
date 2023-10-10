/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mypaystubs.controls.PDFViewer");jQuery.sap.require("sap.ui.core.library");jQuery.sap.require("sap.ui.core.RenderManager");jQuery.sap.require("sap.ui.Device");PDFJS={workerSrc:jQuery.sap.getModulePath("hcm.mypaystubs")+"/ext/pdfjs/pdf.worker.js",cMapUrl:jQuery.sap.getModulePath("hcm.mypaystubs")+"/ext/pdfjs/cmaps/",cMapPacked:true,disableWorker:(sap.ui.Device.os.ios?true:false)};jQuery.sap.require("hcm.mypaystubs.ext.pdfjs.pdf");sap.ui.core.Control.extend("hcm.mypaystubs.controls.PDFViewer",{metadata:{properties:{"src":{type:"string",group:"Misc"},"errorMessage":{type:"string",group:"Misc"},"setPdfData":{type:"string",group:"Misc"}},events:{"begin":{},"complete":{}}}});
hcm.mypaystubs.controls.PDFViewer.prototype.exit=function(){jQuery.sap.log.debug("exit "+this.getSrc());this.UnloadPdf();this.ClearPdfData();};
hcm.mypaystubs.controls.PDFViewer.prototype.Show=function(l){var s=this.getSrc();if(!s){return;}if(!this._pdfData){this.fireBegin();l.LoadPdf(s,jQuery.proxy(this.setPdfData,this),jQuery.proxy(this.showErrorMessage,this));}else{this.RenderPdf();}};
hcm.mypaystubs.controls.PDFViewer.prototype.ClearPdfData=function(){this._pdfData=null;this._loadedURL=null;};
hcm.mypaystubs.controls.PDFViewer.prototype.UnloadPdf=function(){if(this._pdfData&&this._loadedURL!==this.getSrc()){jQuery.sap.log.debug("UnloadPdf "+this.getSrc());this.ClearPdfData();$(this.getDomRef()).empty();}};
hcm.mypaystubs.controls.PDFViewer.prototype.setPdfData=function(d){this._pdfData=d;this._loadedURL=this.getSrc();this.RenderPdf();};
hcm.mypaystubs.controls.PDFViewer.prototype.showErrorMessage=function(r){};
hcm.mypaystubs.controls.PDFViewer.prototype.RenderPdf=function(){var i=this.getDomRef(),t=this,c=[];jQuery.sap.log.debug("RenderPdf "+this.getSrc());if(i.childNodes&&i.childNodes.length>0){setTimeout(function(){jQuery.sap.log.debug("The control is already rendered");t.fireComplete();},500);return;}PDFJS.getDocument(this._pdfData).then(function getPdfForm(p){t._pdf=p;var v=i,a=1;t.renderPage(v,p,a++,function pageRenderingComplete(){if(a>p.numPages){jQuery.sap.log.debug("renderPage complete");t.fireComplete();return;}jQuery.sap.log.debug("render another page");t.renderPage(v,p,a++,pageRenderingComplete);},c);});};
hcm.mypaystubs.controls.PDFViewer.prototype.renderPage=function(d,p,a,c){p.getPage(a).then(function(b){jQuery.sap.log.debug("renderingPage "+a);var e,v,f,g,s,h;s=2;if(!d.offsetParent||!d.offsetParent.clientWidth){jQuery.sap.log.debug("invalid offsetParent");return;}e=d.offsetParent.clientWidth;v=b.getViewport(1);f=v.width;g=sap.ui.Device.system.phone?1:e/f;h=b.getViewport(s*g);var i=h.width;var j=h.height;var k=document.createElement('div');k.className='pdfpage';if(sap.ui.Device.system.phone){k.style.width=i+'px';k.style.height=j+'px';}else{k.style.width=i/s+'px';k.style.height=j/s+'px';}d.appendChild(k);var l=document.createElement('canvas');var m=l.getContext('2d');l.width=i;l.height=j;if(sap.ui.Device.system.phone){l.style.width=i+'px';l.style.height=j+'px';}else{l.style.width=i/s+'px';l.style.height=j/s+'px';}var r={canvasContext:m,viewport:h};b.render(r).then(function(){k.appendChild(l);c();});});};
