(function() {
	'use strict';
	jQuery.sap.declare("nasa.ui5.planejamentoEmbarque.model.constant");
	nasa.ui5.planejamentoEmbarque.model.constant = {
		LISTTPEMB:[{"Value": "N", "Name": "Normal"},
				   {"Value": "P", "Name": "Possession Letter"}
				  ],
	    LISTTPNAV:[{"Value": "B", "Name": "Breakbulk"},
				   {"Value": "C", "Name": "Container"}
			      ],
		START_STATUS: "I",
	    PENDENT_STATUS: "P",
		COMPLETED_STATUS: "C",
		ALL_STATUS: "",
		ENTITY_MONITOR: "/ZET_FBSD_ShipmentDetailSet"
	};
	
}());
