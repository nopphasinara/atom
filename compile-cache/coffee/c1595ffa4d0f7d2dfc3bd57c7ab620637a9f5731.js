(function() {
  var CompositeDisposable, JsonConverter, YAML, converter, expandAction, isEven, unique,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  YAML = require('js-yaml');

  converter = require('json-2-csv');

  CompositeDisposable = require('atom').CompositeDisposable;

  unique = function(array) {
    var i, key, output, ref, results, value;
    output = {};
    for (key = i = 0, ref = array.length; 0 <= ref ? i < ref : i > ref; key = 0 <= ref ? ++i : --i) {
      output[array[key]] = array[key];
    }
    results = [];
    for (key in output) {
      value = output[key];
      results.push(value);
    }
    return results;
  };

  isEven = function(val) {
    return val % 2 === 0;
  };

  expandAction = function(docs, opType) {
    var action, actions, doc, docKeys, excludeFields, field, i, len, metaId, metaIndex, metaParentId, metaType, value;
    if (opType == null) {
      opType = 'index';
    }
    metaIndex = atom.config.get('json-converter.elasticIndex');
    metaType = atom.config.get('json-converter.elasticDocType');
    metaId = atom.config.get('json-converter.elasticUidField');
    metaParentId = atom.config.get('json-converter.elasticParentUidField');
    excludeFields = atom.config.get('json-converter.elasticExcludeFields');
    actions = [];
    for (i = 0, len = docs.length; i < len; i++) {
      doc = docs[i];
      docKeys = Object.keys(doc);
      action = {};
      action[opType] = {};
      if (metaIndex) {
        action[opType]._index = metaIndex;
      }
      if (metaType) {
        action[opType]._type = metaType;
      }
      if (indexOf.call(docKeys, metaId) >= 0) {
        action[opType]._id = doc[metaId];
      }
      if (indexOf.call(docKeys, metaParentId) >= 0) {
        action[opType]._parent = doc[metaParentId];
      }
      if (opType === 'delete') {
        actions.push(JSON.stringify(action));
      } else {
        for (field in doc) {
          value = doc[field];
          if (indexOf.call(excludeFields, field) >= 0) {
            delete doc[field];
          }
        }
        if (opType === 'update') {
          doc = {
            "doc": doc
          };
        }
        actions.push(JSON.stringify(action));
        actions.push(JSON.stringify(doc));
      }
    }
    return actions;
  };

  module.exports = JsonConverter = {
    subscriptions: null,
    config: {
      jsonIndet: {
        title: 'JSON Indent',
        type: 'integer',
        "default": 2
      },
      yamlIndet: {
        title: 'YAML Indent',
        type: 'integer',
        "default": 2
      },
      csvDelimiterField: {
        title: 'CSV Delimiter',
        type: 'string',
        "default": ','
      },
      csvDelimiterArray: {
        title: 'CSV Delimiter Array',
        type: 'string',
        "default": ';'
      },
      csvDelimiterWrap: {
        title: 'CSV Wrap Values in Quotes',
        type: 'string',
        "default": ''
      },
      elasticIndex: {
        title: 'Elasticsearch Index Name',
        type: 'string',
        "default": 'blog'
      },
      elasticDocType: {
        title: 'Elasticsearch Type Name',
        type: 'string',
        "default": 'posts'
      },
      elasticUidField: {
        title: 'Elasticsearch Stored UID Field Name in CSV',
        type: 'string',
        "default": 'id'
      },
      elasticParentUidField: {
        title: 'Elasticsearch Stored Parent UID Field Name in CSV',
        type: 'string',
        "default": 'parent'
      },
      elasticExcludeFields: {
        title: 'Elasticsearch Exclude fields in CSV',
        type: 'array',
        "default": []
      }
    },
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'json-converter:csv-to-elasticsearch-bulk-create-format': (function(_this) {
          return function() {
            return _this.csvToElasticsearchBulkFormat({
              opType: 'create'
            });
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'json-converter:csv-to-elasticsearch-bulk-delete-format': (function(_this) {
          return function() {
            return _this.csvToElasticsearchBulkFormat({
              opType: 'delete'
            });
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'json-converter:csv-to-elasticsearch-bulk-index-format': (function(_this) {
          return function() {
            return _this.csvToElasticsearchBulkFormat({
              opType: 'index'
            });
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'json-converter:csv-to-elasticsearch-bulk-update-format': (function(_this) {
          return function() {
            return _this.csvToElasticsearchBulkFormat({
              opType: 'update'
            });
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'json-converter:json-to-elasticsearch-bulk-create-format': (function(_this) {
          return function() {
            return _this.jsonToElasticsearchBulkFormat({
              opType: 'create'
            });
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'json-converter:json-to-elasticsearch-bulk-delete-format': (function(_this) {
          return function() {
            return _this.jsonToElasticsearchBulkFormat({
              opType: 'delete'
            });
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'json-converter:json-to-elasticsearch-bulk-index-format': (function(_this) {
          return function() {
            return _this.jsonToElasticsearchBulkFormat({
              opType: 'index'
            });
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'json-converter:json-to-elasticsearch-bulk-update-format': (function(_this) {
          return function() {
            return _this.jsonToElasticsearchBulkFormat({
              opType: 'update'
            });
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'json-converter:csv-to-json': (function(_this) {
          return function() {
            return _this.csvToJson();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'json-converter:json-to-csv': (function(_this) {
          return function() {
            return _this.jsonToCsv();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'json-converter:json-to-yaml': (function(_this) {
          return function() {
            return _this.jsonToYaml();
          };
        })(this)
      }));
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'json-converter:yaml-to-json': (function(_this) {
          return function() {
            return _this.yamlToJson();
          };
        })(this)
      }));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    serialize: function() {},
    csvToJson: function() {
      var csv, editor, options;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      csv = editor.getText();
      if (!csv.length) {
        return;
      }
      options = {
        DELIMITER: {
          FIELD: atom.config.get('json-converter.csvDelimiterField').replace('\\t', '\t'),
          ARRAY: atom.config.get('json-converter.csvDelimiterArray'),
          WRAP: atom.config.get('json-converter.csvDelimiterWrap')
        },
        EOL: editor.getBuffer().lineEndingForRow(0)
      };
      return converter.csv2json(csv, function(error, json) {
        var ref;
        if (!error) {
          return atom.workspace.open('').then(function(newEditor) {
            var indent, text;
            newEditor.setGrammar(atom.grammars.selectGrammar('untitled.json'));
            indent = atom.config.get('json-converter.jsonIndet');
            text = JSON.stringify(json, null, indent);
            return newEditor.setText(text);
          });
        } else {
          return (ref = atom.notifications) != null ? ref.addError('csvToJson: CSV convert error', {
            dismissable: true,
            detail: error
          }) : void 0;
        }
      }, options);
    },
    jsonToCsv: function() {
      var editor, error, json, options, ref;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      try {
        json = JSON.parse(editor.getText());
      } catch (error1) {
        error = error1;
        if ((ref = atom.notifications) != null) {
          ref.addError('jsonToCsv: JSON parse error', {
            dismissable: true,
            detail: error.toString()
          });
        }
      }
      options = {
        DELIMITER: {
          FIELD: atom.config.get('json-converter.csvDelimiterField').replace('\\t', '\t'),
          ARRAY: atom.config.get('json-converter.csvDelimiterArray'),
          WRAP: atom.config.get('json-converter.csvDelimiterWrap')
        }
      };
      return converter.json2csv(json, function(error, csv) {
        var ref1;
        if (!error) {
          return atom.workspace.open('').then(function(newEditor) {
            newEditor.setGrammar(atom.grammars.selectGrammar('untitled.csv'));
            return newEditor.setText(csv);
          });
        } else {
          return (ref1 = atom.notifications) != null ? ref1.addError('jsonToCsv: JSON convert error', {
            dismissable: true,
            detail: error
          }) : void 0;
        }
      }, options);
    },
    jsonToYaml: function() {
      var editor, error, json, ref;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      try {
        json = JSON.parse(editor.getText());
      } catch (error1) {
        error = error1;
        if ((ref = atom.notifications) != null) {
          ref.addError('jsonToYaml: JSON parse error', {
            dismissable: true,
            detail: error.toString()
          });
        }
      }
      return atom.workspace.open('').then(function(newEditor) {
        var indent, text;
        newEditor.setGrammar(atom.grammars.selectGrammar('untitled.yaml'));
        indent = atom.config.get('json-converter.yamlIndent');
        text = YAML.safeDump(json, {
          indent: indent
        });
        return newEditor.setText(text);
      });
    },
    yamlToJson: function() {
      var editor, error, json, ref;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      try {
        json = YAML.safeLoad(editor.getText(), {
          schema: YAML.JSON_SCHEMA
        });
      } catch (error1) {
        error = error1;
        if ((ref = atom.notifications) != null) {
          ref.addError('yamlToJson: YAML parse error', {
            dismissable: true,
            detail: error.toString()
          });
        }
      }
      return atom.workspace.open('').then(function(newEditor) {
        var indent, text;
        newEditor.setGrammar(atom.grammars.selectGrammar('untitled.json'));
        indent = atom.config.get('json-converter.jsonIndet');
        text = JSON.stringify(json, null, indent);
        return newEditor.setText(text);
      });
    },
    csvToElasticsearchBulkFormat: function(arg) {
      var csv, editor, opType, options;
      opType = (arg != null ? arg : {
        opType: 'index'
      }).opType;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      csv = editor.getText();
      options = {
        DELIMITER: {
          FIELD: atom.config.get('json-converter.csvDelimiterField').replace('\\t', '\t'),
          ARRAY: atom.config.get('json-converter.csvDelimiterArray'),
          WRAP: atom.config.get('json-converter.csvDelimiterWrap')
        }
      };
      return converter.csv2json(csv, function(error, docs) {
        var ref;
        if (!error) {
          return atom.workspace.open('').then(function(newEditor) {
            var text;
            newEditor.setGrammar(atom.grammars.selectGrammar('untitled.json'));
            text = expandAction(docs, opType).join('\r\n');
            newEditor.setText(text);
            return newEditor.setCursorScreenPosition([0, 0]);
          });
        } else {
          return (ref = atom.notifications) != null ? ref.addError('csvToElasticsearchBulkFormat: CSV convert error', {
            dismissable: true,
            detail: error
          }) : void 0;
        }
      }, options);
    },
    jsonToElasticsearchBulkFormat: function(arg) {
      var docs, editor, error, json, opType, ref;
      opType = (arg != null ? arg : {
        opType: 'index'
      }).opType;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      try {
        json = JSON.parse(editor.getText());
      } catch (error1) {
        error = error1;
        if ((ref = atom.notifications) != null) {
          ref.addError('jsonToElasticsearchBulkFormat: JSON parse error', {
            dismissable: true,
            detail: error.toString()
          });
        }
        return;
      }
      docs = json instanceof Array ? json : [json];
      return atom.workspace.open('').then(function(newEditor) {
        var text;
        newEditor.setGrammar(atom.grammars.selectGrammar('untitled.json'));
        text = expandAction(docs, opType).join('\r\n');
        newEditor.setText(text);
        return newEditor.setCursorScreenPosition([0, 0]);
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9qc29uLWNvbnZlcnRlci9saWIvanNvbi1jb252ZXJ0ZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxpRkFBQTtJQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsU0FBUjs7RUFDUCxTQUFBLEdBQVksT0FBQSxDQUFRLFlBQVI7O0VBQ1gsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFBLEdBQVMsU0FBQyxLQUFEO0FBQ1AsUUFBQTtJQUFBLE1BQUEsR0FBUztBQUNULFNBQTJDLHlGQUEzQztNQUFBLE1BQU8sQ0FBQSxLQUFNLENBQUEsR0FBQSxDQUFOLENBQVAsR0FBcUIsS0FBTSxDQUFBLEdBQUE7QUFBM0I7QUFDQTtTQUFBLGFBQUE7O21CQUFBO0FBQUE7O0VBSE87O0VBS1QsTUFBQSxHQUFTLFNBQUMsR0FBRDtBQUNQLFdBQU8sR0FBQSxHQUFNLENBQU4sS0FBVztFQURYOztFQUdULFlBQUEsR0FBZSxTQUFDLElBQUQsRUFBTyxNQUFQO0FBQ2IsUUFBQTs7TUFEb0IsU0FBTzs7SUFDM0IsU0FBQSxHQUFZLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw2QkFBaEI7SUFDWixRQUFBLEdBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLCtCQUFoQjtJQUNYLE1BQUEsR0FBUyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0NBQWhCO0lBQ1QsWUFBQSxHQUFlLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQ0FBaEI7SUFDZixhQUFBLEdBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixxQ0FBaEI7SUFFaEIsT0FBQSxHQUFVO0FBQ1YsU0FBQSxzQ0FBQTs7TUFDRSxPQUFBLEdBQVUsTUFBTSxDQUFDLElBQVAsQ0FBWSxHQUFaO01BRVYs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LElBQUEsQ0FBMUQ7T0FBcEMsQ0FBbkI7TUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztRQUFBLHlEQUFBLEVBQTJELENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLDZCQUFELENBQStCO2NBQUEsTUFBQSxFQUFRLFFBQVI7YUFBL0I7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0Q7T0FBcEMsQ0FBbkI7TUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztRQUFBLHlEQUFBLEVBQTJELENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLDZCQUFELENBQStCO2NBQUEsTUFBQSxFQUFRLFFBQVI7YUFBL0I7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0Q7T0FBcEMsQ0FBbkI7TUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztRQUFBLHdEQUFBLEVBQTBELENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLDZCQUFELENBQStCO2NBQUEsTUFBQSxFQUFRLE9BQVI7YUFBL0I7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUQ7T0FBcEMsQ0FBbkI7TUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztRQUFBLHlEQUFBLEVBQTJELENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLDZCQUFELENBQStCO2NBQUEsTUFBQSxFQUFRLFFBQVI7YUFBL0I7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFB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TCxDQUFXLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBWCxFQURUO09BQUEsY0FBQTtRQUVNOzthQUNjLENBQUUsUUFBcEIsQ0FDRSxpREFERixFQUVFO1lBQUEsV0FBQSxFQUFhLElBQWI7WUFBbUIsTUFBQSxFQUFRLEtBQUssQ0FBQyxRQUFOLENBQUEsQ0FBM0I7V0FGRjs7QUFHQSxlQU5GOztNQVFBLElBQUEsR0FBVSxJQUFBLFlBQWdCLEtBQW5CLEdBQThCLElBQTlCLEdBQXdDLENBQUMsSUFBRDthQUUvQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsRUFBcEIsQ0FBdUIsQ0FBQyxJQUF4QixDQUE2QixTQUFDLFNBQUQ7QUFDM0IsWUFBQTtRQUFBLFNBQVMsQ0FBQyxVQUFWLENBQXFCLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBZCxDQUE0QixlQUE1QixDQUFyQjtRQUNBLElBQUEsR0FBTyxZQUFBLENBQWEsSUFBYixFQUFtQixNQUFuQixDQUEwQixDQUFDLElBQTNCLENBQWdDLE1BQWhDO1FBQ1AsU0FBUyxDQUFDLE9BQVYsQ0FBa0IsSUFBbEI7ZUFDQSxTQUFTLENBQUMsdUJBQVYsQ0FBa0MsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFsQztNQUoyQixDQUE3QjtJQWQ2QixDQW5ML0I7O0FBN0NGIiwic291cmNlc0NvbnRlbnQiOlsiWUFNTCA9IHJlcXVpcmUgJ2pzLXlhbWwnXG5jb252ZXJ0ZXIgPSByZXF1aXJlKCdqc29uLTItY3N2JylcbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbnVuaXF1ZSA9IChhcnJheSkgLT5cbiAgb3V0cHV0ID0ge31cbiAgb3V0cHV0W2FycmF5W2tleV1dID0gYXJyYXlba2V5XSBmb3Iga2V5IGluIFswLi4uYXJyYXkubGVuZ3RoXVxuICB2YWx1ZSBmb3Iga2V5LCB2YWx1ZSBvZiBvdXRwdXRcblxuaXNFdmVuID0gKHZhbCkgLT5cbiAgcmV0dXJuIHZhbCAlIDIgPT0gMFxuXG5leHBhbmRBY3Rpb24gPSAoZG9jcywgb3BUeXBlPSdpbmRleCcpIC0+XG4gIG1ldGFJbmRleCA9IGF0b20uY29uZmlnLmdldCgnanNvbi1jb252ZXJ0ZXIuZWxhc3RpY0luZGV4JylcbiAgbWV0YVR5cGUgPSBhdG9tLmNvbmZpZy5nZXQoJ2pzb24tY29udmVydGVyLmVsYXN0aWNEb2NUeXBlJylcbiAgbWV0YUlkID0gYXRvbS5jb25maWcuZ2V0KCdqc29uLWNvbnZlcnRlci5lbGFzdGljVWlkRmllbGQnKVxuICBtZXRhUGFyZW50SWQgPSBhdG9tLmNvbmZpZy5nZXQoJ2pzb24tY29udmVydGVyLmVsYXN0aWNQYXJlbnRVaWRGaWVsZCcpXG4gIGV4Y2x1ZGVGaWVsZHMgPSBhdG9tLmNvbmZpZy5nZXQoJ2pzb24tY29udmVydGVyLmVsYXN0aWNFeGNsdWRlRmllbGRzJylcblxuICBhY3Rpb25zID0gW11cbiAgZm9yIGRvYyBpbiBkb2NzXG4gICAgZG9jS2V5cyA9IE9iamVjdC5rZXlzKGRvYylcblxuICAgIGFjdGlvbiA9IHt9XG4gICAgYWN0aW9uW29wVHlwZV0gPSB7fVxuICAgIGFjdGlvbltvcFR5cGVdLl9pbmRleCA9IG1ldGFJbmRleCBpZiBtZXRhSW5kZXhcbiAgICBhY3Rpb25bb3BUeXBlXS5fdHlwZSA9IG1ldGFUeXBlIGlmIG1ldGFUeXBlXG4gICAgYWN0aW9uW29wVHlwZV0uX2lkID0gZG9jW21ldGFJZF0gaWYgbWV0YUlkIGluIGRvY0tleXNcbiAgICBhY3Rpb25bb3BUeXBlXS5fcGFyZW50ID0gZG9jW21ldGFQYXJlbnRJZF0gaWYgbWV0YVBhcmVudElkIGluIGRvY0tleXNcblxuICAgIGlmIG9wVHlwZSBpcyAnZGVsZXRlJ1xuICAgICAgYWN0aW9ucy5wdXNoKEpTT04uc3RyaW5naWZ5KGFjdGlvbikpXG4gICAgZWxzZVxuICAgICAgZm9yIGZpZWxkLCB2YWx1ZSBvZiBkb2NcbiAgICAgICAgZGVsZXRlIGRvY1tmaWVsZF0gaWYgZmllbGQgaW4gZXhjbHVkZUZpZWxkc1xuICAgICAgZG9jID0ge1wiZG9jXCI6IGRvY30gaWYgb3BUeXBlIGlzICd1cGRhdGUnXG4gICAgICBhY3Rpb25zLnB1c2goSlNPTi5zdHJpbmdpZnkoYWN0aW9uKSlcbiAgICAgIGFjdGlvbnMucHVzaChKU09OLnN0cmluZ2lmeShkb2MpKVxuXG4gIHJldHVybiBhY3Rpb25zXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gSnNvbkNvbnZlcnRlciA9XG4gIHN1YnNjcmlwdGlvbnM6IG51bGxcblxuICBjb25maWc6XG4gICAganNvbkluZGV0OlxuICAgICAgdGl0bGU6ICdKU09OIEluZGVudCdcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogMlxuICAgIHlhbWxJbmRldDpcbiAgICAgIHRpdGxlOiAnWUFNTCBJbmRlbnQnXG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IDJcbiAgICBjc3ZEZWxpbWl0ZXJGaWVsZDpcbiAgICAgIHRpdGxlOiAnQ1NWIERlbGltaXRlcidcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnLCdcbiAgICBjc3ZEZWxpbWl0ZXJBcnJheTpcbiAgICAgIHRpdGxlOiAnQ1NWIERlbGltaXRlciBBcnJheSdcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnOydcbiAgICBjc3ZEZWxpbWl0ZXJXcmFwOlxuICAgICAgdGl0bGU6ICdDU1YgV3JhcCBWYWx1ZXMgaW4gUXVvdGVzJ1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICcnXG4gICAgZWxhc3RpY0luZGV4OlxuICAgICAgdGl0bGU6ICdFbGFzdGljc2VhcmNoIEluZGV4IE5hbWUnXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJ2Jsb2cnXG4gICAgZWxhc3RpY0RvY1R5cGU6XG4gICAgICB0aXRsZTogJ0VsYXN0aWNzZWFyY2ggVHlwZSBOYW1lJ1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICdwb3N0cydcbiAgICBlbGFzdGljVWlkRmllbGQ6XG4gICAgICB0aXRsZTogJ0VsYXN0aWNzZWFyY2ggU3RvcmVkIFVJRCBGaWVsZCBOYW1lIGluIENTVidcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnaWQnXG4gICAgZWxhc3RpY1BhcmVudFVpZEZpZWxkOlxuICAgICAgdGl0bGU6ICdFbGFzdGljc2VhcmNoIFN0b3JlZCBQYXJlbnQgVUlEIEZpZWxkIE5hbWUgaW4gQ1NWJ1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICdwYXJlbnQnXG4gICAgZWxhc3RpY0V4Y2x1ZGVGaWVsZHM6XG4gICAgICB0aXRsZTogJ0VsYXN0aWNzZWFyY2ggRXhjbHVkZSBmaWVsZHMgaW4gQ1NWJ1xuICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgZGVmYXVsdDogW11cblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2pzb24tY29udmVydGVyOmNzdi10by1lbGFzdGljc2VhcmNoLWJ1bGstY3JlYXRlLWZvcm1hdCc6ID0+IEBjc3ZUb0VsYXN0aWNzZWFyY2hCdWxrRm9ybWF0KG9wVHlwZTogJ2NyZWF0ZScpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdqc29uLWNvbnZlcnRlcjpjc3YtdG8tZWxhc3RpY3NlYXJjaC1idWxrLWRlbGV0ZS1mb3JtYXQnOiA9PiBAY3N2VG9FbGFzdGljc2VhcmNoQnVsa0Zvcm1hdChvcFR5cGU6ICdkZWxldGUnKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnanNvbi1jb252ZXJ0ZXI6Y3N2LXRvLWVsYXN0aWNzZWFyY2gtYnVsay1pbmRleC1mb3JtYXQnOiA9PiBAY3N2VG9FbGFzdGljc2VhcmNoQnVsa0Zvcm1hdChvcFR5cGU6ICdpbmRleCcpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdqc29uLWNvbnZlcnRlcjpjc3YtdG8tZWxhc3RpY3NlYXJjaC1idWxrLXVwZGF0ZS1mb3JtYXQnOiA9PiBAY3N2VG9FbGFzdGljc2VhcmNoQnVsa0Zvcm1hdChvcFR5cGU6ICd1cGRhdGUnKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnanNvbi1jb252ZXJ0ZXI6anNvbi10by1lbGFzdGljc2VhcmNoLWJ1bGstY3JlYXRlLWZvcm1hdCc6ID0+IEBqc29uVG9FbGFzdGljc2VhcmNoQnVsa0Zvcm1hdChvcFR5cGU6ICdjcmVhdGUnKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnanNvbi1jb252ZXJ0ZXI6anNvbi10by1lbGFzdGljc2VhcmNoLWJ1bGstZGVsZXRlLWZvcm1hdCc6ID0+IEBqc29uVG9FbGFzdGljc2VhcmNoQnVsa0Zvcm1hdChvcFR5cGU6ICdkZWxldGUnKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnanNvbi1jb252ZXJ0ZXI6anNvbi10by1lbGFzdGljc2VhcmNoLWJ1bGstaW5kZXgtZm9ybWF0JzogPT4gQGpzb25Ub0VsYXN0aWNzZWFyY2hCdWxrRm9ybWF0KG9wVHlwZTogJ2luZGV4JylcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2pzb24tY29udmVydGVyOmpzb24tdG8tZWxhc3RpY3NlYXJjaC1idWxrLXVwZGF0ZS1mb3JtYXQnOiA9PiBAanNvblRvRWxhc3RpY3NlYXJjaEJ1bGtGb3JtYXQob3BUeXBlOiAndXBkYXRlJylcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2pzb24tY29udmVydGVyOmNzdi10by1qc29uJzogPT4gQGNzdlRvSnNvbigpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdqc29uLWNvbnZlcnRlcjpqc29uLXRvLWNzdic6ID0+IEBqc29uVG9Dc3YoKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnanNvbi1jb252ZXJ0ZXI6anNvbi10by15YW1sJzogPT4gQGpzb25Ub1lhbWwoKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnanNvbi1jb252ZXJ0ZXI6eWFtbC10by1qc29uJzogPT4gQHlhbWxUb0pzb24oKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG5cbiAgc2VyaWFsaXplOiAtPlxuXG4gIGNzdlRvSnNvbjogLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICByZXR1cm4gdW5sZXNzIGVkaXRvcj9cblxuICAgIGNzdiA9IGVkaXRvci5nZXRUZXh0KClcbiAgICByZXR1cm4gdW5sZXNzIGNzdi5sZW5ndGhcblxuICAgIG9wdGlvbnMgPVxuICAgICAgREVMSU1JVEVSOlxuICAgICAgICBGSUVMRDogYXRvbS5jb25maWcuZ2V0KCdqc29uLWNvbnZlcnRlci5jc3ZEZWxpbWl0ZXJGaWVsZCcpLnJlcGxhY2UoJ1xcXFx0JywgJ1xcdCcpXG4gICAgICAgIEFSUkFZOiBhdG9tLmNvbmZpZy5nZXQoJ2pzb24tY29udmVydGVyLmNzdkRlbGltaXRlckFycmF5JylcbiAgICAgICAgV1JBUDogYXRvbS5jb25maWcuZ2V0KCdqc29uLWNvbnZlcnRlci5jc3ZEZWxpbWl0ZXJXcmFwJylcbiAgICAgIEVPTDogZWRpdG9yLmdldEJ1ZmZlcigpLmxpbmVFbmRpbmdGb3JSb3coMClcblxuICAgIGNvbnZlcnRlci5jc3YyanNvbihjc3YsIChlcnJvciwganNvbikgLT5cbiAgICAgIGlmIG5vdCBlcnJvclxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCcnKS50aGVuKChuZXdFZGl0b3IpIC0+XG4gICAgICAgICAgbmV3RWRpdG9yLnNldEdyYW1tYXIoYXRvbS5ncmFtbWFycy5zZWxlY3RHcmFtbWFyKCd1bnRpdGxlZC5qc29uJykpXG4gICAgICAgICAgaW5kZW50ID0gYXRvbS5jb25maWcuZ2V0KCdqc29uLWNvbnZlcnRlci5qc29uSW5kZXQnKVxuICAgICAgICAgIHRleHQgPSBKU09OLnN0cmluZ2lmeShqc29uLCBudWxsLCBpbmRlbnQpXG4gICAgICAgICAgbmV3RWRpdG9yLnNldFRleHQodGV4dClcbiAgICAgICAgKVxuICAgICAgZWxzZVxuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnM/LmFkZEVycm9yKCdjc3ZUb0pzb246IENTViBjb252ZXJ0IGVycm9yJyxcbiAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSwgZGV0YWlsOiBlcnJvcilcbiAgICAsIG9wdGlvbnMpXG5cbiAganNvblRvQ3N2OiAtPlxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIHJldHVybiB1bmxlc3MgZWRpdG9yP1xuXG4gICAgdHJ5XG4gICAgICBqc29uID0gSlNPTi5wYXJzZShlZGl0b3IuZ2V0VGV4dCgpKVxuICAgIGNhdGNoIGVycm9yXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnM/LmFkZEVycm9yKCdqc29uVG9Dc3Y6IEpTT04gcGFyc2UgZXJyb3InLFxuICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSwgZGV0YWlsOiBlcnJvci50b1N0cmluZygpKVxuXG4gICAgb3B0aW9ucyA9XG4gICAgICBERUxJTUlURVI6XG4gICAgICAgIEZJRUxEOiBhdG9tLmNvbmZpZy5nZXQoJ2pzb24tY29udmVydGVyLmNzdkRlbGltaXRlckZpZWxkJykucmVwbGFjZSgnXFxcXHQnLCAnXFx0JylcbiAgICAgICAgQVJSQVk6IGF0b20uY29uZmlnLmdldCgnanNvbi1jb252ZXJ0ZXIuY3N2RGVsaW1pdGVyQXJyYXknKVxuICAgICAgICBXUkFQOiBhdG9tLmNvbmZpZy5nZXQoJ2pzb24tY29udmVydGVyLmNzdkRlbGltaXRlcldyYXAnKVxuXG4gICAgY29udmVydGVyLmpzb24yY3N2KGpzb24sIChlcnJvciwgY3N2KSAtPlxuICAgICAgaWYgbm90IGVycm9yXG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJycpLnRoZW4oKG5ld0VkaXRvcikgLT5cbiAgICAgICAgICBuZXdFZGl0b3Iuc2V0R3JhbW1hcihhdG9tLmdyYW1tYXJzLnNlbGVjdEdyYW1tYXIoJ3VudGl0bGVkLmNzdicpKVxuICAgICAgICAgIG5ld0VkaXRvci5zZXRUZXh0KGNzdilcbiAgICAgICAgKVxuICAgICAgZWxzZVxuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnM/LmFkZEVycm9yKCdqc29uVG9Dc3Y6IEpTT04gY29udmVydCBlcnJvcicsXG4gICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsIGRldGFpbDogZXJyb3IpXG4gICAgLCBvcHRpb25zKVxuXG4gIGpzb25Ub1lhbWw6IC0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgcmV0dXJuIHVubGVzcyBlZGl0b3I/XG5cbiAgICB0cnlcbiAgICAgIGpzb24gPSBKU09OLnBhcnNlKGVkaXRvci5nZXRUZXh0KCkpXG4gICAgY2F0Y2ggZXJyb3JcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucz8uYWRkRXJyb3IoJ2pzb25Ub1lhbWw6IEpTT04gcGFyc2UgZXJyb3InLFxuICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSwgZGV0YWlsOiBlcnJvci50b1N0cmluZygpKVxuXG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlbignJykudGhlbigobmV3RWRpdG9yKSAtPlxuICAgICAgbmV3RWRpdG9yLnNldEdyYW1tYXIoYXRvbS5ncmFtbWFycy5zZWxlY3RHcmFtbWFyKCd1bnRpdGxlZC55YW1sJykpXG4gICAgICBpbmRlbnQgPSBhdG9tLmNvbmZpZy5nZXQoJ2pzb24tY29udmVydGVyLnlhbWxJbmRlbnQnKVxuICAgICAgdGV4dCA9IFlBTUwuc2FmZUR1bXAoanNvbiwgaW5kZW50OiBpbmRlbnQpXG4gICAgICBuZXdFZGl0b3Iuc2V0VGV4dCh0ZXh0KVxuICAgIClcblxuXG4gIHlhbWxUb0pzb246IC0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgcmV0dXJuIHVubGVzcyBlZGl0b3I/XG5cbiAgICB0cnlcbiAgICAgIGpzb24gPSBZQU1MLnNhZmVMb2FkKGVkaXRvci5nZXRUZXh0KCksIHNjaGVtYTogWUFNTC5KU09OX1NDSEVNQSlcbiAgICBjYXRjaCBlcnJvclxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zPy5hZGRFcnJvcigneWFtbFRvSnNvbjogWUFNTCBwYXJzZSBlcnJvcicsXG4gICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLCBkZXRhaWw6IGVycm9yLnRvU3RyaW5nKCkpXG5cbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCcnKS50aGVuKChuZXdFZGl0b3IpIC0+XG4gICAgICBuZXdFZGl0b3Iuc2V0R3JhbW1hcihhdG9tLmdyYW1tYXJzLnNlbGVjdEdyYW1tYXIoJ3VudGl0bGVkLmpzb24nKSlcbiAgICAgIGluZGVudCA9IGF0b20uY29uZmlnLmdldCgnanNvbi1jb252ZXJ0ZXIuanNvbkluZGV0JylcbiAgICAgIHRleHQgPSBKU09OLnN0cmluZ2lmeShqc29uLCBudWxsLCBpbmRlbnQpXG4gICAgICBuZXdFZGl0b3Iuc2V0VGV4dCh0ZXh0KVxuICAgIClcblxuICBjc3ZUb0VsYXN0aWNzZWFyY2hCdWxrRm9ybWF0OiAoe29wVHlwZX09e29wVHlwZTogJ2luZGV4J30pLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICByZXR1cm4gdW5sZXNzIGVkaXRvcj9cblxuICAgIGNzdiA9IGVkaXRvci5nZXRUZXh0KClcblxuICAgIG9wdGlvbnMgPVxuICAgICAgREVMSU1JVEVSOlxuICAgICAgICBGSUVMRDogYXRvbS5jb25maWcuZ2V0KCdqc29uLWNvbnZlcnRlci5jc3ZEZWxpbWl0ZXJGaWVsZCcpLnJlcGxhY2UoJ1xcXFx0JywgJ1xcdCcpXG4gICAgICAgIEFSUkFZOiBhdG9tLmNvbmZpZy5nZXQoJ2pzb24tY29udmVydGVyLmNzdkRlbGltaXRlckFycmF5JylcbiAgICAgICAgV1JBUDogYXRvbS5jb25maWcuZ2V0KCdqc29uLWNvbnZlcnRlci5jc3ZEZWxpbWl0ZXJXcmFwJylcblxuICAgIGNvbnZlcnRlci5jc3YyanNvbihjc3YsIChlcnJvciwgZG9jcykgLT5cbiAgICAgIGlmIG5vdCBlcnJvclxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCcnKS50aGVuKChuZXdFZGl0b3IpIC0+XG4gICAgICAgICAgbmV3RWRpdG9yLnNldEdyYW1tYXIoYXRvbS5ncmFtbWFycy5zZWxlY3RHcmFtbWFyKCd1bnRpdGxlZC5qc29uJykpXG4gICAgICAgICAgdGV4dCA9IGV4cGFuZEFjdGlvbihkb2NzLCBvcFR5cGUpLmpvaW4oJ1xcclxcbicpXG4gICAgICAgICAgbmV3RWRpdG9yLnNldFRleHQodGV4dClcbiAgICAgICAgICBuZXdFZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDBdKVxuICAgICAgICApXG4gICAgICBlbHNlXG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucz8uYWRkRXJyb3IoXG4gICAgICAgICAgJ2NzdlRvRWxhc3RpY3NlYXJjaEJ1bGtGb3JtYXQ6IENTViBjb252ZXJ0IGVycm9yJyxcbiAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSwgZGV0YWlsOiBlcnJvcilcbiAgICAsIG9wdGlvbnMpXG5cbiAganNvblRvRWxhc3RpY3NlYXJjaEJ1bGtGb3JtYXQ6ICh7b3BUeXBlfT17b3BUeXBlOiAnaW5kZXgnfSktPlxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIHJldHVybiB1bmxlc3MgZWRpdG9yP1xuXG4gICAgdHJ5XG4gICAgICBqc29uID0gSlNPTi5wYXJzZShlZGl0b3IuZ2V0VGV4dCgpKVxuICAgIGNhdGNoIGVycm9yXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnM/LmFkZEVycm9yKFxuICAgICAgICAnanNvblRvRWxhc3RpY3NlYXJjaEJ1bGtGb3JtYXQ6IEpTT04gcGFyc2UgZXJyb3InLFxuICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSwgZGV0YWlsOiBlcnJvci50b1N0cmluZygpKVxuICAgICAgcmV0dXJuXG5cbiAgICBkb2NzID0gaWYganNvbiBpbnN0YW5jZW9mIEFycmF5IHRoZW4ganNvbiBlbHNlIFtqc29uXVxuXG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlbignJykudGhlbigobmV3RWRpdG9yKSAtPlxuICAgICAgbmV3RWRpdG9yLnNldEdyYW1tYXIoYXRvbS5ncmFtbWFycy5zZWxlY3RHcmFtbWFyKCd1bnRpdGxlZC5qc29uJykpXG4gICAgICB0ZXh0ID0gZXhwYW5kQWN0aW9uKGRvY3MsIG9wVHlwZSkuam9pbignXFxyXFxuJylcbiAgICAgIG5ld0VkaXRvci5zZXRUZXh0KHRleHQpXG4gICAgICBuZXdFZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oWzAsIDBdKVxuICAgIClcbiJdfQ==
