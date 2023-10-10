(function() {
	'use strict';
	jQuery.sap.declare("nasa.ui5.vendaIntercompany.model.constant");
	nasa.ui5.vendaIntercompany.model.constant = {
		HIDE_MODE: "HideMode",
		UNHIDE_MODE: "ShowHideMode",
		START_STATUS: "I",
	    PENDENT_STATUS: "P",
		COMPLETED_STATUS: "C",
		ALL_STATUS: "ALL",
		STATUS_VALIDATED: "Neutral",
		EVENT_CREATE: "Gerar_Documentos",
		EVENT_CANCEL: "Cancelar_Documentos",
		EVENT_REFRESH: "Atualizar_Documentos",
		PARTNERS: [ { funcao: "AG", tipo: "K"},
		            { funcao: "EO", tipo: "K"},
					{ funcao: "RE", tipo: "K"},
					{ funcao: "RG", tipo: "K"},
					{ funcao: "WE", tipo: "K"},
					{ funcao: "ZP", tipo: "K"},
					{ funcao: "ZN", tipo: "F"},
					{ funcao: "ZO", tipo: "F"},
					{ funcao: "ZR", tipo: "F"}
				  ]
	};
	
}());
