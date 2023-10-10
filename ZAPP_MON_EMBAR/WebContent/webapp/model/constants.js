(function() {
	'use strict';
	jQuery.sap.declare("nasa.ui5.monitorEmbarques.model.constants");
	nasa.ui5.monitorEmbarques.model.constants = {
	
		LISTTIPOVENDA:[{"Value": "", "Name": ""},
		               {"Value": "N", "Name": "Normal"},
		               {"Value": "D", "Name": "Direta"}
				  	  ],
	    LISTTPNAV:[{"Value": "B", "Name": "Breakbulk"},
				   {"Value": "C", "Name": "Container"}
			      ],
		START_STATUS: "I",
	    PENDENT_STATUS: "P",
		COMPLETED_STATUS: "C",
		ALL_STATUS: ""
		
	};
}());
