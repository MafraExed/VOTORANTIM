sap.ui.define([
	"sap/ui/base/Object"
], function (BaseObject) {
	"use strict";
	const cServicePers = "Personalization";
	const cPersonalizationContainer = "ZCockpitBO";
	const cItemValue = "ItemBase";

	return BaseObject.extend("workspace.zcockpit_bo_v3.controller.VariantFilter", {
		constructor: function (oVariantMgmtControl, oController,sVariantSet, fnGetData, fnLoadData) {
			this._oVariantMgmtControl = oVariantMgmtControl;
			this._sVariantSet = sVariantSet;
			this._oController = oController;

			this._fnGetData = fnGetData;
			this._fnLoadData = fnLoadData;

			//eventos
			this._oVariantMgmtControl.attachSave(this, this._onSaveAsVariant);
			this._oVariantMgmtControl.attachSelect(this, this._onSelectVariant);
			this._oVariantMgmtControl.attachManage(this, this._onManageVariant);

			// create a new model 
			var oVariantModel = new sap.ui.model.json.JSONModel();
			//get Variants from personalization set and set the model of variants list to variant managment control 
			this._getAllVariants(function (aVariants, sCurrentVariantKey) {
				oVariantModel.setProperty("/Variants", aVariants);
				oVariantMgmtControl.setModel(oVariantModel);

				//enable save button for save variant "STANDARD"
				if (!oVariantMgmtControl.oVariantSave) {
					oVariantMgmtControl._delayedControlCreation();
				}
				oVariantMgmtControl.oVariantSave.onAfterRendering = function () {
					this.setEnabled(true);
				};
				oVariantMgmtControl.invalidate();

				//default
				if (sCurrentVariantKey) {
					this._oVariantMgmtControl.setInitialSelectionKey(sCurrentVariantKey);
					this._oVariantMgmtControl.fireSelect({
						"key": sCurrentVariantKey
					});
				}
			}.bind(this));

		},
		currentVariantSetModified: function () {
			this._oVariantMgmtControl.currentVariantSetModified(true);
		},
		_getAllVariants: function (fnCallBack) {
			var oPersonalizationVariantSet = {},
				aExistingVariants = [],
				aVariantKeysAndNames = [],
				that = this;
			// Peronalisation from ushell service to persist the settings
			if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
				//get the personalization service of shell 
				this._oPersonalizationService = sap.ushell.Container.getService(cServicePers);
				this._oPersonalizationContainer = this._oPersonalizationService.getPersonalizationContainer(cPersonalizationContainer);
				this._oPersonalizationContainer.fail(function () {
					// call back function in case of fail 
					fnCallBack(aExistingVariants);
				});
				this._oPersonalizationContainer.done(function (oPersonalizationContainer) {
					// check if the current variant set exists, If not, add the new variant set to the container 
					if (!(oPersonalizationContainer.containsVariantSet(that._sVariantSet))) {
						oPersonalizationContainer.addVariantSet(that._sVariantSet);
					}
					// get the variant set 
					oPersonalizationVariantSet = oPersonalizationContainer.getVariantSet(that._sVariantSet);
					aVariantKeysAndNames = oPersonalizationVariantSet.getVariantNamesAndKeys();
					for (var key in aVariantKeysAndNames) {
						if (aVariantKeysAndNames.hasOwnProperty(key)) {
							if (key !== that._oVariantMgmtControl.STANDARDVARIANTKEY) {
								var oVariantItemObject = {};
								oVariantItemObject.VariantKey = aVariantKeysAndNames[key];
								oVariantItemObject.VariantName = key;
								aExistingVariants.push(oVariantItemObject);
							}
						}
					}

					var sVariantLoad = oPersonalizationVariantSet.getCurrentVariantKey();
					if (!sVariantLoad) {
						sVariantLoad = that._oVariantMgmtControl.STANDARDVARIANTKEY;
					}
					fnCallBack(aExistingVariants, sVariantLoad);
				}.bind(this));
			}
		},
		_onSaveAsVariant: function (oEvent, oThat) {
			//oSelectedFilterData is the json object with the data seleced in the filter bar 
			var oSelectedFilterData = oThat._fnLoadData(oThat._oController);
			// get variant parameters:
			var oVariantParam = oEvent.getParameters();
			oThat._saveVariant(oVariantParam, oSelectedFilterData, function () {
				//Do the required actions 
			}.bind(oThat));
		},
		/** 
		 * This method is to save the variant * @param {String} sVariantName- Variant name 
		 * @param {Object} oFilterData- Filter data object-> consolidated filters in JSON 
		 * @param {Function} fnCallBack- the call back function with the array of variants 
		 */
		_saveVariant: function (oVariantParam, oFilterData, fnCallBack) {
			var that = this;
			if (this._oPersonalizationContainer) {
				// save variants in personalization container 
				this._oPersonalizationContainer.fail(function () {
					// call back function in case of fail 
					fnCallBack(false);
				});
				this._oPersonalizationContainer.done(function (oPersonalizationContainer) {
					var oPersonalizationVariantSet = {},
						oVariant = {},
						sVariantKey = "";
					// check if the current variant set exists, If not, add the new variant set to the container 
					if (!(oPersonalizationContainer.containsVariantSet(that._sVariantSet))) {
						oPersonalizationContainer.addVariantSet(that._sVariantSet);
					}
					// get the variant set 
					oPersonalizationVariantSet = oPersonalizationContainer.getVariantSet(that._sVariantSet);
					//get if the variant exists or add new variant 
					if (oVariantParam.key !== that._oVariantMgmtControl.STANDARDVARIANTKEY) {
						sVariantKey = oPersonalizationVariantSet.getVariantKeyByName(oVariantParam.name);
					} else {
						sVariantKey = oPersonalizationVariantSet.getVariantKeyByName(oVariantParam.key);
					}
					if (sVariantKey) {
						oVariant = oPersonalizationVariantSet.getVariant(sVariantKey);
					} else {

						if (oVariantParam.key !== that._oVariantMgmtControl.STANDARDVARIANTKEY) {
							oVariant = oPersonalizationVariantSet.addVariant(oVariantParam.name);
						} else {
							oVariant = oPersonalizationVariantSet.addVariant(oVariantParam.key);
						}
					}
					if (oVariantParam.def === true) {
						oPersonalizationVariantSet.setCurrentVariantKey(oVariant.getVariantKey());
					}
					if (oFilterData) {
						oVariant.setItemValue(cItemValue, JSON.stringify(oFilterData));
					}
					oPersonalizationContainer.save().fail(function () {
						//call callback fn with false 
						fnCallBack(false);
					}).done(function () {
						//call call back with true 
						fnCallBack(true);
					}.bind(this));
				}.bind(this));
			} else {
				if (fnCallBack) {
					fnCallBack(false);
				}
			}
		},
		_onManageVariant: function (oEvent, oThat) {
			var oVariantParam = oEvent.getParameters();
			if (oVariantParam.deleted.length > 0) {
				oThat._deleteVariants(oVariantParam.deleted, function (bDeleted) {
					// delete success if bDeleted is true 
				});
			}
			if (oVariantParam.def.length > 0) {
				oThat._defaultVariant(oVariantParam.def, function (bChanged) {
					// success if bChanged is true 
				});
			}
		},
		_defaultVariant: function (sVariantKey, fnCallBack) {
			var that = this;
			if (this._oPersonalizationContainer) {
				var oPersonalizationVariantSet = {};
				this._oPersonalizationContainer.fail(function () {
					//handle failure case 
				});
				this._oPersonalizationContainer.done(function (oPersonalizationContainer) {
					if (!(oPersonalizationContainer.containsVariantSet(that._sVariantSet))) {
						oPersonalizationContainer.addVariantSet(that._sVariantSet);
					}
					oPersonalizationVariantSet = oPersonalizationContainer.getVariantSet(that._sVariantSet);
					// default variant change
					if (sVariantKey !== that._oVariantMgmtControl.STANDARDVARIANTKEY) {
						oPersonalizationVariantSet.setCurrentVariantKey(sVariantKey);
					} else {
						oPersonalizationVariantSet.setCurrentVariantKey(null);
					}
					oPersonalizationContainer.save().fail(function () {
						//handle failure case 
						fnCallBack(false);
					}).done(function () {
						fnCallBack(true);
					}.bind(this));
				}.bind(this));
			} else {
				if (fnCallBack) {
					fnCallBack(false);
				}
			}
		},
		_deleteVariants: function (aVariantKeys, fnCallBack) {
			var that = this;
			if (this._oPersonalizationContainer) {
				var oPersonalizationVariantSet = {};
				this._oPersonalizationContainer.fail(function () {
					//handle failure case 
				});
				this._oPersonalizationContainer.done(function (oPersonalizationContainer) {
					if (!(oPersonalizationContainer.containsVariantSet(that._sVariantSet))) {
						oPersonalizationContainer.addVariantSet(that._sVariantSet);
					}
					oPersonalizationVariantSet = oPersonalizationContainer.getVariantSet(that._sVariantSet);
					for (var iCount = 0; iCount < aVariantKeys.length; iCount++) {
						if (aVariantKeys[iCount]) {
							oPersonalizationVariantSet.delVariant(aVariantKeys[iCount]);
						}
					}
					oPersonalizationContainer.save().fail(function () {
						//handle failure case 
						fnCallBack(false);
					}).done(function () {
						fnCallBack(true);
					}.bind(this));
				}.bind(this));
			} else {
				if (fnCallBack) {
					fnCallBack(false);
				}
			}
		},
		_onSelectVariant: function (oEvent, oThat) {
			var sSelectedVariantName;
			var sSelectedVariantKey = oEvent.getParameter("key");

			if (sSelectedVariantKey === oThat._oVariantMgmtControl.STANDARDVARIANTKEY) {
				sSelectedVariantName = sSelectedVariantKey;
			} else {
				var oSelectedItem = oEvent.getSource()._getSelectedItem();
				if (oSelectedItem) {
					sSelectedVariantName = oSelectedItem.getProperty("text");
				}
			}

			if (sSelectedVariantKey || sSelectedVariantName) {
				oThat._getVariantFromKey(sSelectedVariantKey, sSelectedVariantName, function (oSelectedVariant) {
					if (oSelectedVariant) {
						var oData = oSelectedVariant.getItemValue(cItemValue);
						if (oData) {
							var aData = JSON.parse(oData);
							oThat._fnGetData(oThat._oController, aData);
						}
					}
				}.bind(oThat));
			}
		},
		_getVariantFromKey: function (sVariantKey, sVariantName, fnCallBack) {
			var that = this;
			if (this._oPersonalizationContainer) {
				this._oPersonalizationContainer.fail(function () {
					// call back function in case of fail 
					if (fnCallBack) {
						fnCallBack(false);
					}
				});
				this._oPersonalizationContainer.done(function (oPersonalizationContainer) {
					var oPersonalizationVariantSet = {};
					// check if the current variant set exists, If not, add the new variant set to the container 
					if (!(oPersonalizationContainer.containsVariantSet(that._sVariantSet))) {
						oPersonalizationContainer.addVariantSet(that._sVariantSet);
					}
					// get the variant set 
					oPersonalizationVariantSet = oPersonalizationContainer.getVariantSet(that._sVariantSet);
					var oVariantSel = oPersonalizationVariantSet.getVariant(sVariantKey);
					if (!oVariantSel) {
						var sVariantKeyLoc = oPersonalizationVariantSet.getVariantKeyByName(sVariantName);
						oVariantSel = oPersonalizationVariantSet.getVariant(sVariantKeyLoc);
					}
					fnCallBack(oVariantSel);
				});
			} else {
				if (fnCallBack) {
					fnCallBack(false);
				}
			}
		}
	});
});