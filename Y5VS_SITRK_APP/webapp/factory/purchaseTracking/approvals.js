"use strict";sap.ui.define(["sap/m/Label","sap/m/Text","sap/m/ObjectIdentifier","sap/m/FlexBox","sap/ui/table/Column","sap/ui/core/CustomData","com/innova/model/formatter"],function(t,e,a,r,n,o,p){var l={tableApproval:function a(r,o){var p=this;var c=o.getObject();var i=c.FIELDNAME;var s=c.SCRTEXT_L||c.REPTEXT;var u=c.INTTYPE;var v="approvals>".concat(i);var f=new e({text:"{".concat(v,"}")});if(u==="approver"){f=l._buildTemplateTypeApprover.call(p,i)}else if(i==="BNFPO"){f=l._buildBNFPOTemplate({context:o.getObject(),path:v})}else{f=l._buildDefaultTemplate({context:o.getObject(),path:v})}return new n({id:r,label:new t({text:s,tooltip:s,wrapping:true,wrappingType:"Hyphenated"}),autoResizable:true,filterOperator:"Contains",filterProperty:"".concat(i),hAlign:u==="N"?"End":"Left",name:"".concat(i),showFilterMenuEntry:'{= %{process>MARK} !== "X" }',showSortMenuEntry:'{= %{process>MARK} !== "X" }',sortProperty:"".concat(i),template:f,visible:"{= %{process>TECH} !== 'X' && %{process>NO_OUT} !== 'X' }",width:"{= parseInt(%{process>OUTPUTLEN}) > 0 ? parseInt(%{process>OUTPUTLEN}) + 'px' : '130px' }"})},_buildBNFPOTemplate:function t(a){var r=a.path;return new e({text:{parts:["".concat(r)],formatter:function t(e){if(e==="00000"||e===null){return null}return parseInt(e,10)}}})},_buildDefaultTemplate:function t(a){var r=a.path,n=a.context;var o=n.INTTYPE;return new e({text:{parts:["".concat(r)],formatter:function t(e){if(o==="D"){if(e==="0000-00-00"){return null}if(e!==null){return p.formatDateSAP(e===null||e===void 0?void 0:e.split("T")[0],"DD/MM/yyyy")}return e}return e}}})},_buildTemplateTypeApprover:function t(e){var n=this;return new r({direction:"Column",alignItems:"Start",items:[new a({visible:"{= %{approvals>".concat(e,"/date} === '0000-00-00' || %{approvals>").concat(e,"/date} === '0000-00-00'}"),title:"{approvals>".concat(e,"/name}"),titleActive:true,titlePress:[n._findApprover,n],customData:[new o({key:"dataItem",value:"{approvals>".concat(e,"}")})]}),new a({visible:"{= %{approvals>".concat(e,"/date} !== '0000-00-00' && %{approvals>").concat(e,"/date} !== '0000-00-00'}"),title:"{approvals>".concat(e,"/name}"),text:{parts:["approvals>".concat(e,"/date"),"approvals>".concat(e,"/hour")],formatter:function t(e,a){if(e==="0000-00-00"){return null}if(e!==null){var r=p.formatDateSAP(e===null||e===void 0?void 0:e.split("T")[0],"DD/MM/yyyy");return"".concat(r," - ").concat(a)}return e}}}),new a({visible:"{= %{approvals>".concat(e,"/date} !== '0000-00-00' && %{approvals>").concat(e,"/date} !== '0000-00-00'}"),text:"{main>/textPool/K125}: {approvals>".concat(e,"/days}")})]})}};return l});