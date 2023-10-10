/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mypaystubs.utils.DataManager");hcm.mypaystubs.utils.DataManager=(function(){var _=null;var c={};c.exist=true;return{init:function(d,o){_=d;},getBaseODataModel:function(){return _;},setCachedModelObjProp:function(p,a){c[p]=a;},getCachedModelObjProp:function(p){return c[p];},getPersonellAssignments:function(a,s){var b=this;var S=function(d){s(d.results);};var e=function(r){b.parseErrorMessages(r);};_.read("/ConcurrentEmploymentSet",null,[],true,S,e);},getPaystubs:function(a,s){var b=this;var u=[];var p=a.oApplication.pernr;u.push("$filter=PersonnelAssignment eq '"+p+"'");var S=function(d){s(d.results);};var e=function(r){b.errorDialog(b.parseErrorMessages(r));};_.read("/Paystubs",null,u,true,S,e);},parseErrorMessages:function(o){if(o.response&&o.response.body){var d=function(p){var s=1;if(p[0]==="-"){s=-1;p=p.substr(1);}return function(a,b){var f;if(a[p]<b[p]){f=-1;}else if(a[p]>b[p]){f=1;}else{f=0;}return f*s;};};try{var r=JSON.parse(o.response.body);if(r.error&&r.error.message&&r.error.message.value){var f=[];f.push(r.error.message.value);if(r.error.innererror&&r.error.innererror.errordetails&&r.error.innererror.errordetails instanceof Array){r.error.innererror.errordetails.sort(d("severity"));for(var i=0;i<r.error.innererror.errordetails.length;i++){if(r.error.innererror.errordetails[i].message){var m=r.error.innererror.errordetails[i].message;if(r.error.innererror.errordetails[i].severity){m+=" ("+r.error.innererror.errordetails[i].severity+")";}f.push(m);}}}return f;}}catch(e){jQuery.sap.log.warning("couldn't parse error message",["parseErrorMessages"],["DataManger"]);}}},errorDialog:function(m){var a="";var b="";var d="";var s="";if(typeof m==="string"){s={message:m,type:sap.ca.ui.message.Type.ERROR};}else if(m instanceof Array){for(var i=0;i<m.length;i++){a="";if(typeof m[i]==="string"){a=m[i];}else if(typeof m[i]==="object"){a=m[i].value;}a.trim();if(a!==""){if(i===0){b=a;}else{d=d+a+"\n";}}}if(d===""){s={message:b,type:sap.ca.ui.message.Type.ERROR};}else{s={message:b,details:d,type:sap.ca.ui.message.Type.ERROR};}}sap.ca.ui.message.showMessageBox(s);}};}());
