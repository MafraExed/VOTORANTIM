sap.ui.define([],function(){"use strict";return{groupUnitNumber:function(e){return function(t){var r=t.getProperty("Index"),n,u;if(r<=20){n="LE20";u=e.getText("masterGroup1Header1")}else{n="GT20";u=e.getText("masterGroup1Header2")}return{key:n,text:u}}}}});