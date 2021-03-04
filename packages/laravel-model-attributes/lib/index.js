'use babel';

import { CompositeDisposable } from 'atom';
const provider = require('./provider');
const config = require('./config');
const connection = require('./connection');

export default {
   subscriptions: null,
   config: config,
   activate(state) {
      // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
      this.subscriptions = new CompositeDisposable();
      this.subscriptions.add(atom.project.onDidChangeFiles(function () {}));

      // on activate run dbconn() to set an instance
      connection.dbconn().then(con=> {
         if(atom.config.get('laravel-model-attributes.showNotifications'))
         atom.notifications.addInfo('Your Database '+atom.config.get('laravel-model-attributes.databaseName')+'  is Connected now');
         connection.connectionInstance = con;
      }).catch(err => {
         connection.connectionInstance = null;
         if(atom.config.get('laravel-model-attributes.showNotifications'))
         atom.notifications.addError('Failed to start MySQL connection, you have to configure it properly. and make sure the service for mysql is running');
      });
   },
   deactivate() {
      if (this.subscriptions)
      this.subscriptions.dispose();

      this.subscriptions = null;
      if (connection.connectionInstance!=null) {
         connection.connectionInstance.end(err=> {
            if (err) {
               if(atom.config.get('laravel-model-attributes.showNotifications'))
               atom.notifications.addWarning('failed to close connection');
            }
            else {
               if(atom.config.get('laravel-model-attributes.showNotifications'))
               atom.notifications.addSuccess('Connection to MySQL database was closed');
            }
         });
         connection.connectionInstance = null;
      }
      else if(atom.config.get('laravel-model-attributes.showNotifications')){atom.notifications.addWarning('Connection to MySQL was never there!');}
   },

   getProvider () {
      return provider;
   },
};
