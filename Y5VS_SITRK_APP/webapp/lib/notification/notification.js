"use strict";sap.ui.define(["com/innova/formatter/notificationType","sap/ui/model/json/JSONModel","sap/m/MessagePopover","sap/m/MessageItem"],function(t,e,o,i){var a={showNotification:function t(o){var i=a.getNotificationButton.call(this);var n=a.getMessagePopove.call(this);var s=new e;i.setText(o.length);s.setData(o);n.setModel(s);n.toggle(i);i.setEnabled(true)},showNotificationFromContext:function t(o){var i=o.getSource();var n=i.data("context");var s=i.getBindingContext(n).getObject();var c=s.notification.data;var r=a.getMessagePopove.call(this);var g=new e;g.setData(c);r.setModel(g);r.toggle(i)},handleMessagePopoverPress:function t(e){a.getMessagePopove.call(this).toggle(e.getSource())},getNotificationButton:function t(){if(!this._notificationButton){this._notificationButton=this.byId("notificationButton")}return this._notificationButton},getMessagePopove:function e(){if(!this._messagePopoveNotification){this._messagePopoveNotification=new o({items:{path:"/",template:new i({type:{path:"TYPE",formatter:t},title:"{MESSAGE}",description:"  "})}})}return this._messagePopoveNotification}};return a});