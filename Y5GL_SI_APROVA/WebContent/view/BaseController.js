/*global history */
jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([ "sap/ui/core/mvc/Controller", "sap/ui/core/routing/History", "vsa/y5gl_si_portal/model/formatter" ], function(Controller, History, formatter) {
  "use strict";

  return Controller.extend("vsa.y5gl_si_portal.view.BaseController", {

    formatter: formatter,

    getRouter : function() {
      return this.getOwnerComponent().getRouter();
    },

    getModel : function(sName) {
      return this.getView().getModel(sName);
    },

    setModel : function(oModel, sName) {
      return this.getView().setModel(oModel, sName);
    },

    getUserName: function(){
      var oUserModel = new sap.ui.model.json.JSONModel();
      oUserModel.loadData("/sap/bc/ui2/start_up?", "", false);
      return ((oUserModel.getData().id) ? oUserModel.getData().id : "");
    },

    setUser : function(sUserId) {
      this.getOwnerComponent().getModel('global').setProperty("/userid", sUserId);
      if(sUserId == ""){
        this._oList.bindItems({
          path : '/Investimentos',
          template : this.getTemplate(this._oList),
          parameters: {
               expand: "ToAprovador,ToItem"
          }
        });
      }else{
        this._oList.bindItems({
          path : '/Investimentos',
          template : this.getTemplate(this._oList),
          filters : [ new sap.ui.model.Filter("Userid", "EQ", sUserId) ],
          parameters: {
               expand: "ToAprovador,ToItem"
          }
        });
      }
    },

    getAdm : function(){
      var t = this;
      var sUserId = "";
      var oModel = this.getOwnerComponent().getModel();
      t.getOwnerComponent().getModel('global').setProperty("/aprovacao", true);

      oModel.read("/Administradores", {
        async : false,
        success : function(oData, response) {
          if(oData.results.length > 0){
            if(oData.results[0].EAdm && oData.results[0].EAdm != ""){
              sUserId = oData.results[0].Userid;
              if (!t._oDialogAdm) {
                t._oDialogAdm = sap.ui.xmlfragment("vsa.y5gl_si_portal.view.fragment.adm", t);
                t._oDialogAdm.setModel(t.getView().getModel());
                t.getView().addDependent(t._oDialogAdm);
              }
              t.getView().byId("btnAdmSel").setVisible(true);
              var newModel = new sap.ui.model.json.JSONModel(oData);
			  newModel.setSizeLimit(10000);
			  t._oDialogAdm.setModel(newModel, "Adm");
              t._oDialogAdm.open();
            }else{
              if(oData.results[0].ESub && oData.results[0].ESub != ""){
                sUserId = oData.results[0].Userid;
                var sTxt = oData.results[0].ESubMsg + ", " + t.getResourceBundle().getText("CANCEL") + "?"
                t.getOwnerComponent().getModel('global').setProperty("/submensagem", oData.results[0].ESubMsg);

                sap.m.MessageBox.show(sTxt, {
                  icon : sap.m.MessageBox.Icon.QUESTION,
                  title : t.getResourceBundle().getText("SUBSTITUTION"),
                  actions : [ sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO ],
                  onClose : function(oAction) {
                    if(oAction != "CANCEL"){
                      if (oAction === "YES"){
                        oModel.remove("/Substitutos('" + sUserId  + "')");
                        t.setUser(sUserId);
                        t.getOwnerComponent().getModel('global').setProperty("/submensagem", "");
                      }else{
                        t.setUser(sUserId);
                        t.getOwnerComponent().getModel('global').setProperty("/aprovacao", false);
                      }
                    }
                  }
                });
              }
            }
          }else{
            t.setUser(t.getUserName());
          }
        },
        error : function(oError){
          t.setUser(t.getUserName());
        }
      });
    },

    setUnidade : function(){
      var t = this;
      this.getOwnerComponent().getModel().read("/Grupos('')", { // vazio
        async : false,
        success : function(oData, response) {
          t.getOwnerComponent().getModel('global').setProperty("/unidade", oData.Unidade);
          t.loadDynFields(oData.Unidade);
          
          t.getModel().callFunction("/AtivaDesativaBotoes", {
      method: "GET",
      urlParameters: {
        Unidade: oData.Unidade
      },
      success: function (oData, response) {
        t.setGlobalInterrupt(oData);
      }.bind(this),
      error: function (oError) {
        t.setGlobalInterrupt();
      }.bind(this)
       });            
        },
        error : function(oError){
        }
      });
    },
    
  setGlobalInterrupt: function(oData){
    if (oData){
      this.getOwnerComponent().getModel('global').setProperty("/intIcon", oData.IconeInterromper);
      this.getOwnerComponent().getModel('global').setProperty("/intVisible", oData.AtivaInterromper);
      this.getOwnerComponent().getModel('global').setProperty("/questDisbl", oData.DesativaQuestionar);
      this.getOwnerComponent().getModel('global').setProperty("/massvApprv", oData.AtivaRejMassa);
      this.getOwnerComponent().getModel('global').setProperty("/multiSelec", oData.AtivaSelMulti);
      this.getOwnerComponent().getModel('global').setProperty("/multi", false);
    }else{
      this.getOwnerComponent().getModel('global').setProperty("/intIcon", "");
      this.getOwnerComponent().getModel('global').setProperty("/intVisible", false);
      this.getOwnerComponent().getModel('global').setProperty("/questDisbl", false);
    }
  },        

    searchApprove : function(oEvent){
      var sQuery = oEvent.getParameter("value");
      var aItems = oEvent.getSource().getItems();
      for(var i=0; i<aItems.length; i++){
        var mItem = aItems[i].getBindingContext("Adm").getObject();
        if (sQuery && sQuery != "") {
          if (  mItem.Nome.toUpperCase().indexOf(sQuery.toUpperCase()) !== -1 ||
              mItem.Userid.toUpperCase().indexOf(sQuery.toUpperCase()) !== -1
            ) {
            aItems[i].setVisible(true);
                } else {
                  aItems[i].setVisible(false);
                }
        }else{
          aItems[i].setVisible(true);
        }
      }
    },

    onSelApprover : function(oEvent){
      var sAprovador = oEvent.getParameter("selectedItem").getProperty("description");
      if(sAprovador != ""){
        this.setUser(sAprovador);
      }
    },

    onCloseApprover : function(){
      Lblnithis._oDialogAdm.close()
    },

    loadDynFields : function(sUnidade) {
      var t = this;
      this.getOwnerComponent().getModel().read("/Campos", { // HEADER
        async : false,
        filters : [ new sap.ui.model.Filter("Unidade", "EQ", sUnidade),
              new sap.ui.model.Filter("Tipo", "EQ", "C") ],
        success : function(oData, response) {
          if (oData.results.length <= 0) {
            sap.m.MessageBox.show(t.getResourceBundle().getText("NCAMPOSDINAMICOS"), {
              icon : sap.m.MessageBox.Icon.ERROR,
              title : t.getResourceBundle().getText("CAMPOSDINAMICOS"),
              actions : [ sap.m.MessageBox.Action.OK ],
              onClose : function(oAction) {
                return;
              }
            });
          } else {
            t.getOwnerComponent().getModel('hFields').setData(oData);
          }
        }
      });

      this.getOwnerComponent().getModel().read("/Campos", { // DETAIL
        async : false,
        filters : [ new sap.ui.model.Filter("Unidade", "EQ", sUnidade),
              new sap.ui.model.Filter("Tipo", "EQ", "D") ],
        success : function(oData, response) {
          if (oData.results.length <= 0) {
            sap.m.MessageBox.show(t.getResourceBundle().getText("NCAMPOSDINAMICOS"), {
              icon : sap.m.MessageBox.Icon.ERROR,
              title : t.getResourceBundle().getText("CAMPOSDINAMICOS"),
              actions : [ sap.m.MessageBox.Action.OK ],
              onClose : function(oAction) {
                return;
              }
            });
          } else {
            t.getOwnerComponent().getModel("dFields").setData(oData);
          }
        }
      });
    },

    setComentario : function(sPath, sProcesso, sUnidade) {
      var t = this;
      var sText = "";
      this.getOwnerComponent().getModel().read("/Comentarios", { // COMENT�RIOS
        async : true,
        filters : [ new sap.ui.model.Filter("Processo", "EQ", sProcesso),
              new sap.ui.model.Filter("Unidade", "EQ", sUnidade),
              new sap.ui.model.Filter("Tipo", "EQ", "C")
              ],
        success : function(oData, response) {
          for(var i=0;i<oData.results.length;i++){
            if (sText.length === 0){
              sText = oData.results[i].Tdline;
            }else{
              sText = sText + " \n " + oData.results[i].Tdline;
            }
          }
          t.getOwnerComponent().getModel("global").setProperty("/" + sProcesso, sText);
          t.setIconTab(t._oIconTabBar, sPath);
        }
      });
    },

    setIconTab : function(oIconTabBar, sPath) {
      if(oIconTabBar){
        var t = this;
        var sUser = this.getOwnerComponent().getModel('global').getProperty("/userid");
        var sPathToAprova = sPath + "/ToAprovador";
        oIconTabBar.removeAllItems();
        oIconTabBar.removeAllContent();
        oIconTabBar.detachSelect();
        oIconTabBar.setExpanded(false);
        oIconTabBar.bindAggregation("items", sPathToAprova, function(index, context) {
          t.getOwnerComponent().getModel('global').setProperty("/relcode", context.getObject().ERelcode);
          if(context.getObject().Status != "A"){
          return new sap.m.IconTabFilter({
            icon : { path: 'Status', formatter : formatter.iconTabBar } ,
            iconColor : { path: 'Status', formatter : formatter.iconColor },
            count : { path: 'Relcode' },
            tooltip: { path: 'NameUsr' },
            text : { path: 'NameUsr' },
            content : new sap.m.Text({text: t.getOwnerComponent().getModel("global").getProperty("/" + context.getObject().Processo)})
          });
          }else{
            var tab = new sap.m.Table({
                columnHeaderVisible : false,
                  columns: [new sap.m.Column({ width: "15px", hAlign: "Left", header: new sap.m.Label({ text: ""  }) }),
                        new sap.m.Column({ hAlign: "Left", header: new sap.m.Label({ text: ""  }) })]
            });
            var fil = new sap.ui.model.Filter({ filters: [ new sap.ui.model.Filter("IUnidade", "EQ", context.getObject().Unidade),
                         new sap.ui.model.Filter("IDocumento", "EQ", context.getObject().Processo),
                                     new sap.ui.model.Filter("IBukrs", "EQ", context.getObject().Bukrs),
                                     new sap.ui.model.Filter("IGjahr", "EQ", context.getObject().Gjahr),
                                     new sap.ui.model.Filter("IProcesso", "EQ", "SI"),
                                     new sap.ui.model.Filter("IFiori", "EQ", "X") ], 
                               and: true });

            var tem = new sap.m.ColumnListItem({ vAlign: "Middle", type: sap.m.ListType.Active, press: t.onAttachPress, 
              cells:[new sap.ui.core.Icon({ src: "sap-icon://attachment" }),
                   new sap.m.Text({ text:"{FileName}" })]});
                   //new sap.m.Link({ text:"{FileName}", 
                   //href : "/sap/opu/odata/sap/ZGWGLAN_PORTAL_SRV/Xstrings(IFileName='" + '{FileName}' + "',IClass='" + '{Class}' + "',IObjid='" + '{Objid}' + "')/$value" })]}); 
            var lis = { path: "/Anexos", template: tem, filters: fil };
            tab.setModel(t.getOwnerComponent().getModel('attachments')); 
            tab.bindAggregation("items", lis);
            return new sap.m.IconTabFilter({
              icon : { path: 'Status', formatter : formatter.iconTabBar } ,
              iconColor : { path: 'Status', formatter : formatter.iconColor }, 
              count : { path: 'Relcode' },
              tooltip: { path: 'NameUsr' }, 
              text : { path: 'NameUsr' },
              content : tab
            });
          }
        }, this);  
      }
    },

    onAttachPress : [function(e) {
      var sContext = e.getSource().getBindingContext().getObject();
      var sPath = "/sap/opu/odata/sap/ZGWGLAN_PORTAL_SRV/Xstrings(IFileName='" + sContext.FileName + "',IClass='" + sContext.Class + "',IObjid='" + sContext.Objid + "')/$value";
      var downloadLink = document.createElement("a");
      downloadLink.href = sPath;
      downloadLink.download = sContext.FileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }, this],

    setForm : function(oForm, sContext) {
      oForm.removeAllContent();
      var ahFields = this.getOwnerComponent().getModel("dFields").getData().results;
      if (ahFields) {
        var sLanguage = sap.ui.getCore().getConfiguration().getLanguage().slice(0, 2).toLowerCase();
        ahFields.forEach(function(n) {
          var oField = "";
          var sText = n["Ddtext" + sLanguage ].toLowerCase();
          sText = sText.charAt(0).toUpperCase() + sText.slice(1);
          if (sContext) {
            n.Fieldname = n.Fieldname.toLowerCase();  
            var aSplit = n.Fieldname.split("_");
            for(var i=0; i<aSplit.length; i++){ 
              oField = oField + aSplit[i].charAt(0).toUpperCase() + aSplit[i].slice(1);
            }
            oField = sContext[oField];
            if (n.Datatype == 'D') {
              oField = formatter.dateExternal(oField);
            }
            if (n.Datatype == 'V') { 
              oField = formatter.currencyExternal(oField);
            }
            if (n.Datatype == 'T') {
              oField = formatter.timeExternal(oField);
            }
      if(oField && oField.length > 0){
        oForm.addContent(new sap.m.Label({ text : sText }));
        oForm.addContent(new sap.m.Text({
          text : oField
        }));
      }
          }
        }, this);
      }
    },

    setTable : function(oTable, oTabModel, sPath) {
      if (oTable) {
        var t = this;
        oTable.removeAllColumns();
        oTable.removeAllAggregation();
        oTable.removeAllAssociation();
        oTable.unbindColumns();
        oTable.unbindRows()
        oTable.destroyColumns();
        oTable.setModel(oTabModel, "tabModel");
        oTable.bindColumns("tabModel>/results", function(index, context) {
          var sLanguage = sap.ui.getCore().getConfiguration().getLanguage().slice(0, 2).toLowerCase();; 
          var sColumnName = context.getObject()["Ddtext" + sLanguage];
          return new sap.ui.table.Column({
            flexible: true,
            resizable: true,
            autoResizable: true,
            minWidth: 10,
            width : "10rem",
                  label: sColumnName,
                  template: t.setColumnTemplate(context.getObject())
              });

        }, this);

        oTable.bindRows(sPath);

        if(oTable.getBinding("rows")){
          oTable.getBinding("rows").attachDataReceived(function(e){
              var c = 0;
              var b = e.getSource() 
              if (b) {
                c = b.getLength();
              }
              if (c > 0) {
                this._oTable.setVisible(true);
                this._oTable.setTitle(this.getResourceBundle().getText("TABLETITLE", c));
              } else {
                this._oTable.setVisible(false);
                this._oTable.setTitle(this.getResourceBundle().getText("TABLETITLE", "0"));
              }
          }, this);
        }
      }
    },

    setColumnTemplate : function(sData) {
      var sColumnId = "";
      var aSplit = sData.Fieldname.toLowerCase().split("_");

      for(var i=0; i< aSplit.length; i++){ 
        sColumnId = sColumnId + aSplit[i].charAt(0).toUpperCase() + aSplit[i].slice(1);
      }
      if (sData.Datatype == 'D') {
        return new sap.m.Text({ 
          text: { path : sColumnId, 
              formatter : formatter.dateExternal 
              }
        });
      }
      if (sData.Datatype == 'V') {
        return new sap.m.Text({ 
          text: { path : sColumnId, 
              formatter : formatter.currencyExternal 
              }
        });
      }
      if (sData.Datatype == 'T') {
        return new sap.m.Text({ 
          text: { path : sColumnId, 
              formatter : formatter.timeExternal 
              }
        });
      }
      if (sData.Datatype == 'C') {
        return new sap.m.Text({ 
          text: { path : sColumnId }
        });
      }

    },

    getTemplate : function(oList) {
      if (oList.getBindingInfo("items"))
        return oList.getBindingInfo("items").template;
      else {
        return null;
      }
    },

    getResourceBundle : function() {
      return this.getOwnerComponent().getModel("i18n").getResourceBundle();
    },

    onNavBack : function() {
      var sPreviousHash = History.getInstance().getPreviousHash();
      if (sPreviousHash !== undefined) {
        history.go(-1);
      } else {
        this.getRouter().navTo("master", {}, true);
      }
    },

    onAcao: function (sModo, aTab, sComent, sRejectionText) {
      var t = this;
      var oModel = this.getOwnerComponent().getModel();
      var sUserId = this.getOwnerComponent().getModel('global').getProperty("/userid");
      var sGroupId = '1',
        sChangeSetId = "Create";

      var sRelcode = this.getOwnerComponent().getModel('global').getProperty("/relcode");
      var sRejCode = this.getOwnerComponent().getModel('global').getProperty("/rejCode", sRejCode);
      var sRejUserid = this.getOwnerComponent().getModel('global').getProperty("/rejUserid", sRejUserid);

      for(var i=0; i<aTab.length;i++){
        var sPath = "/" + aTab[i].ToAprovador.__list[0];
        var oData = oModel.getData(sPath);

        var oEntry = {
              Modo    : sModo,
              Mensagem  : "",
              Documento   : aTab[i].Posnr,
              Bukrs   : aTab[i].BukrsResp,
              Gjahr   : aTab[i].Gjahr,
              Bnfpo   : "",
              Unidade   : aTab[i].Unidade,
              Relcode   : ((oData.ERelcode && oData.ERelcode != "") ? oData.ERelcode : sRelcode),
              Userid      : ((sUserId && sUserId != "") ? sUserId : aTab[i].Userid),
              Coment      : sComent,
              RejEvent    : ((sRejCode && (sRejCode === "I")) ? sRejCode: "" ),
          RejCode     : ((sRejCode && (sRejCode !== "I")) ? sRejCode: ""),
          RejUserid : ((sRejUserid) ? sRejUserid : ""),
          Motivo      : ((sRejectionText) ? sRejectionText : "")
        }

        oModel.setDeferredGroups([sGroupId]);

        oModel.create("/Acoes", oEntry, { groupId: sGroupId }, {changeSetId : sChangeSetId} );

      }

      oModel.submitChanges({ 
        groupId: sGroupId, 
        changeSetId : sChangeSetId,
        success: function(oData) {
          var oResp = oData.__batchResponses[0].__changeResponses; 
          for(var i=0;i<oResp.length;i++){
            sap.m.MessageToast.show(oResp[i].data.Mensagem);
            window._oList.getBinding("items").refresh()
                t.getRouter().navTo("master", {}, true);
          }},
              error : function(oError) { 
                t.errorMsg(oError);
              } 
            }, this);
    },

    errorMsg : function(sMsg){
      var t = this;
      sap.m.MessageBox.show( t.getResourceBundle().getText(sMsg), {
                  icon: sap.m.MessageBox.Icon.ERROR,
                  title: t.getResourceBundle().getText("ERROR"),
                  actions: [sap.m.MessageBox.Action.OK],
                  onClose: function(oAction) { 
                    return
                  }
              }
            );

    },

    sucessMsg : function(sMsg){
      var t = this;
      sap.m.MessageBox.show( t.getResourceBundle().getText(sMsg), {
                  icon: sap.m.MessageBox.Icon.SUCESS,
                  title: t.getResourceBundle().getText("SUCESS"),
                  actions: [sap.m.MessageBox.Action.OK],
                  onClose: function(oAction) { 
                    //t.commitChanges();
                    t.getOwnerComponent().getModel().refresh();
                    t.getRouter().navTo("master", {}, true);
                    return
                  }
              }
            );

    },

    onCloseDialog : function(e){
      e.getSource().getParent().close();
    },

//    onRejectDialog: function (sModo, sContext, sRelcode) {
//      window._that = this;
//      var dialog = new sap.m.Dialog({
//        title: this.getResourceBundle().getText("REJECT"),
//        type: sap.m.DialogType.Message,
//        state: sap.ui.core.ValueState.Error,
//        content: [
//          //new sap.m.Label({ text: this.getResourceBundle().getText("REJECTTEXT"), labelFor: 'rejectDialogTextarea'}),
//          new sap.m.TextArea('rejectDialogTextarea', {
//            liveChange: function(oEvent) {
//              var sText = oEvent.getParameter('value');
//              var parent = oEvent.getSource().getParent();
//              parent.getBeginButton().setEnabled(sText.length > 0);
//            },
//            width: '100%',
//            placeholder: this.getResourceBundle().getText("INSERTACOMENT")
//          })
//        ],
//        beginButton: new sap.m.Button({
//          text: this.getResourceBundle().getText("CONFIRM"),
//          enabled: false,
//          press: function () {
//            dialog.close();
//            sContext.Coment = sap.ui.getCore().byId('rejectDialogTextarea').getValue();
//            if(!sContext.Coment) {sContext.Coment = "";}
//            window._that.onAcao(sModo, sContext, sRelcode); 
//          }
//        }),
//        endButton: new sap.m.Button({
//          text: this.getResourceBundle().getText("CANCEL"),
//          press: function () {
//            dialog.close();
//          }
//        }),
//        afterClose: function() {
//          dialog.destroy();
//        }
//      }, this);
//
//      dialog.open();
//    },

//    onQuestionDialog: function (sModo, sContext, sRelcode) {
//      window._that = this;
//      var oVBox = new sap.m.VBox({width: "100%"});
//      oVBox.addItem(new sap.m.Label({ text: this.getResourceBundle().getText("MAILTO"), labelFor: 'txtMailTo'}),
//          new sap.m.Text('txtMailTo', { text : sContext.NameText } ));
//      oVBox.addItem(new sap.m.Label({ text: this.getResourceBundle().getText("MAILAD"), labelFor: 'txtMailAd'}));
//      oVBox.addItem(new sap.m.Text('txtMailAd', { text : sContext.EMail } ));
//      oVBox.addItem(new sap.m.Label({ text: this.getResourceBundle().getText("MAILBODY"), labelFor: 'txtAreaQuestion'}));
//      oVBox.addItem(new sap.m.TextArea('txtAreaQuestion', {
//        liveChange: function(oEvent) {
//          var sText = oEvent.getParameter('value');
//          var parent = oEvent.getSource().getParent();
//          parent.getBeginButton().setEnabled(sText.length > 0);
//        },
//        width: '100%',
//        placeholder: ""
//      }));
//      var dialog = new sap.m.Dialog({
//        title: this.getResourceBundle().getText("QUESTION"),
//        type: sap.m.DialogType.Message,
//        state: sap.ui.core.ValueState.Warning,
//        content: [ oVBox ],
//        beginButton: new sap.m.Button({
//          text: this.getResourceBundle().getText("CONFIRM"),
//          enabled: false,
//          press: function () {
//            dialog.close();
//            sContext.Coment = sap.ui.getCore().byId('txtAreaQuestion').getValue();
////            if(!sContext.Coment) {sContext.Coment = "";}
////            window._that.onAcao(sModo, sContext, sRelcode); 
//          }
//        }),
//        endButton: new sap.m.Button({
//          text: this.getResourceBundle().getText("CANCEL"),
//          press: function () {
//            dialog.close();
//          }
//        }),
//        afterClose: function() {
//          dialog.destroy();
//        }
//      }, this);
//
//      dialog.open();
//    }

  });

});