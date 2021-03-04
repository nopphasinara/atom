'use babel';

const helpers = require('./helpers');
String.prototype.plural = require('./plural');
const connection = require('./connection');

module.exports = {
   selector: '.source.php, .blade.php',
   suggestionPriority: 2,//=> more proirity than default.

   async getSuggestions (request) {
      return new Promise(function(resolve, reject) {
         if(connection.connectionInstance==null) {
            connection.dbconn().then(con => {
               connection.connectionInstance = con;
               if(atom.config.get('laravel-model-attributes.showNotifications'))
               atom.notifications.addSuccess('connection was reset succesfully! type again!');
               reject(false);
            }).catch(err => {
               if(atom.config.get('laravel-model-attributes.showNotifications'))
               atom.notifications.addError('Failed to start MySQL connection, you have to configure it properly.');
            });
         }
         else {
            let { prefix, bufferPosition, editor, scopeDescriptor, activatedManually } = request;
            let selection = helpers.getWordAtPosition(editor.lineTextForBufferRow(bufferPosition.row), bufferPosition.column);
            let searchForProp = selection.substring(selection.indexOf('->'), 0);
            searchForProp = selection.replace(searchForProp+'->','');
            if (selection.startsWith('$') && selection.indexOf('->')>-1) {
               let suggestions = [];
               if (editor = atom.workspace.getActiveTextEditor()) {
                  selection = selection.substring(selection.indexOf('->'),0);
                  let tableName = helpers.findVariableDefinition(bufferPosition.row,bufferPosition.column, selection,editor);
                  selection = selection.replace('$','');
                  selection = selection.replace('->','');
                  connection.connectionInstance.query('Show columns from '+tableName, function (err, result) {
                     if (err) {
                        // if(atom.config.get('laravel-model-attributes.showNotifications'))
                        // atom.notifications.addWarning('table "'+tableName+'"'+' does not exist!');

                        // START PLURAL
                        connection.connectionInstance.query('Show columns from '+selection.plural(), function (err, result) {
                           if (err) {
                              if(atom.config.get('laravel-model-attributes.showNotifications'))
                              atom.notifications.addWarning('p:table "'+selection.plural()+'"'+' does not exist!');
                              reject(false);
                           }
                           else {
                              for (var i = 0; i < result.length; i++) {
                                 if(searchForProp && result[i].Field.indexOf(searchForProp)==-1) {
                                    continue;
                                 }
                                 let sgt = {
                                    replacementPrefix: selection,
                                    rightLabel: result[i].Type,
                                    text: result[i].Field,
                                    type: 'laravel-model-att'
                                 };
                                 let color = (result[i].Null=="NO" && result[i].Default==null) ? "#c0392b" : (result[i].Null=="NO" ? "#16a085" : "#95a5a6");
                                 sgt.iconHTML = `<div style="color: ${color};"><i class="icon-database"></i></div>`;
                                 suggestions.push(sgt);
                              }
                              resolve(suggestions);
                           }
                        });
                        // END PLURAL

                        // reject(false);
                     }
                     else {
                        for (var i = 0; i < result.length; i++) {
                           if(searchForProp && result[i].Field.indexOf(searchForProp)==-1) {
                              continue;
                           }
                           let sgt = {
                              replacementPrefix: selection,
                              rightLabel: result[i].Type,
                              text: result[i].Field,
                              type: 'laravel-model-att'
                           };
                           let color = (result[i].Null=="NO" && result[i].Default==null) ? "#c0392b" : (result[i].Null=="NO" ? "#16a085" : "#95a5a6");
                           sgt.iconHTML = `<div style="color: ${color};"><i class="icon-database"></i></div>`;
                           suggestions.push(sgt);
                        }
                        resolve(suggestions);
                     }
                  });
               }
            }
            else {
               resolve(null);
            }
         }
      });
   },
   onDidInsertSuggestion({editor, triggerPosition, suggestion}) {
      let selection = helpers.getWordAtPosition(editor.lineTextForBufferRow(triggerPosition.row), triggerPosition.column);
      if(!selection.endsWith('->')) {
         editor.deleteToPreviousWordBoundary();
      }
      editor.insertText(suggestion.text);
   }
};
