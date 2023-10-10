(function() {
	'use strict';
	jQuery.sap.declare("nasa.ui5.faturamentoEmbarque.model.constants");
	nasa.ui5.faturamentoEmbarque.model.constants = {
		HIDE_MODE: "HideMode",
		UNHIDE_MODE: "ShowHideMode",
		START_STATUS: "I",
	    PENDENT_STATUS: "P",
		COMPLETED_STATUS: "C",
		ALL_STATUS: "ALL",
		EVENT_CREATE: "Gerar_Documentos",
		PARTNERS: [ { funcao: "AG", tipo: "K"},
					{ funcao: "RE", tipo: "K"},
					{ funcao: "RG", tipo: "K"},
					{ funcao: "WE", tipo: "K"},
					{ funcao: "ZN", tipo: "F"},
					{ funcao: "ZO", tipo: "F"},
					{ funcao: "ZR", tipo: "F"}
				  ]
	};
}());
