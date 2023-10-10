sap.ui.define(["sap/ui/core/UIComponent", "sap/ui/Device", "./controller/ErrorHandler"], function (t, s, e) {
	"use strict";
	return t.extend("Y5GL_RECIBOS2.Y5GL_RECIBOS2.Component", {
		metadata: {
			manifest: "json"
		},
		init: function () {
			this._oErrorHandler = new e(this);
			t.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
		},
		destroy: function () {
			this._oErrorHandler.destroy();
			t.prototype.destroy.apply(this, arguments);
		},
		getContentDensityClass: function () {
			if (this._sContentDensityClass === undefined) {
				if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!s.support.touch) {
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}
	});
});