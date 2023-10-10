"use strict";

sap.ui.define(['com/innova/formatter/notificationType', 'sap/ui/model/json/JSONModel', 'sap/m/MessagePopover', 'sap/m/MessageItem'], function (notificationType, JSONModel, MessagePopover, MessageItem) {
  var notification = {
    /**
     * @function
     * @name showNotification
     * @description - Se encarga de recibir los mensajes del backend y
     *  establecer el modelo que muestra el Popover.
     *
     * @public
     * @param {object[]} aItems - Arreglo de los mensajes
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    showNotification: function showNotification(aItems) {
      var oButton = notification.getNotificationButton.call(this);
      var oMessagePopoveNotification = notification.getMessagePopove.call(this);
      var oModel = new JSONModel();
      oButton.setText(aItems.length);
      oModel.setData(aItems);
      oMessagePopoveNotification.setModel(oModel);
      oMessagePopoveNotification.toggle(oButton);
      oButton.setEnabled(true);
    },

    /**
     * @function
     * @name showNotificationFromContext
     * @description - Mostrar notificacion del contexto
     *
     * @public
     * @param {sap.ui.base.Event} oEvent - An Event object consisting of an id, a source and a map of parameters.
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    showNotificationFromContext: function showNotificationFromContext(oEvent) {
      /** @type any */
      var oSource = oEvent.getSource();
      var sContext = oSource.data('context');
      var oObject = oSource.getBindingContext(sContext).getObject();
      var data = oObject.notification.data;
      var oMessagePopoveNotification = notification.getMessagePopove.call(this);
      var oModel = new JSONModel();
      oModel.setData(data);
      oMessagePopoveNotification.setModel(oModel);
      oMessagePopoveNotification.toggle(oSource);
    },

    /**
     * @function
     * @name handleMessagePopoverPress
     * @description - Recibe el evento de presionar del botÃ³n de mostrar notificaciones si las hay.
     *
     * @public
     * @param {sap.ui.base.Event} oEvent - An Event object consisting of an id, a source and a map of parameters.
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    handleMessagePopoverPress: function handleMessagePopoverPress(oEvent) {
      notification.getMessagePopove.call(this).toggle(oEvent.getSource());
    },

    /**
     * @function
     * @name getNotificationButton
     * @description - Obtiene una unica instancia del botÃ³n de notificaciones con id=notificationButton
     *
     * @public
     * @returns {sap.m.Button} - Instancia del botÃ³n.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    getNotificationButton: function getNotificationButton() {
      if (!this._notificationButton) {
        this._notificationButton = this.byId('notificationButton');
      }

      return this._notificationButton;
    },

    /**
     * @function
     * @name getMessagePopove
     * @description - Obtiene una unica instancia del objeto messagePopover para mostrar los mensajes del backend.
     *
     * @public
     * @returns {sap.m.MessagePopover} - Instancia del MessagePopover.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    getMessagePopove: function getMessagePopove() {
      if (!this._messagePopoveNotification) {
        this._messagePopoveNotification = new MessagePopover({
          items: {
            path: '/',
            template: new MessageItem({
              type: {
                path: 'TYPE',
                formatter: notificationType
              },
              title: '{MESSAGE}',
              description: '  '
            })
          }
        });
      }

      return this._messagePopoveNotification;
    }
  };
  return notification;
});