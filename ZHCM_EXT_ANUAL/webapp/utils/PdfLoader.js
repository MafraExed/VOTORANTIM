/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mypaystubs.utils.PdfLoader");
hcm.mypaystubs.utils.PdfLoader=function(){this.sUrl=null;this.sState="idle";this.oRequester=null;this.fOnSuccess=null;this.fOnFailure=null;};
hcm.mypaystubs.utils.PdfLoader.prototype.LoadPdf=function(u,o,a){jQuery.sap.log.debug("PdfLoader::LoadPdf "+u);if(this.oRequester){jQuery.sap.log.debug("PdfLoader::abort "+this.sUrl);this.oRequester.abort();}this.sUrl=u;this.fOnSuccess=o;this.fOnFailure=a;this.LoadPdfData(jQuery.proxy(this.onComplete,this));};
hcm.mypaystubs.utils.PdfLoader.prototype.LoadPdfData=function(o){jQuery.sap.log.debug("PdfLoader::LoadPdfData "+this.sUrl);this.sState="loading";this.oRequester=new XMLHttpRequest();this.oRequester.open("GET",this.sUrl,true);this.oRequester.setRequestHeader("Accept-Language",sap.ui.getCore().getConfiguration().getLanguage());this.oRequester.responseType="arraybuffer";this.oRequester.onload=function(){o();};this.oRequester.send();};
hcm.mypaystubs.utils.PdfLoader.prototype.onComplete=function(){jQuery.sap.log.debug("PdfLoader::onComplete "+this.sUrl);this.sState="loaded";try{if(this.oRequester.status===200||this.oRequester.status===0){var p=this.oRequester.response;if(this.fOnSuccess){this.fOnSuccess(p);}}else{if(this.fOnFailure){this.fOnFailure(this.oRequester.responseText);}}}catch(e){if(this.fOnFailure){this.fOnFailure(null);}}this.oRequester=null;};
