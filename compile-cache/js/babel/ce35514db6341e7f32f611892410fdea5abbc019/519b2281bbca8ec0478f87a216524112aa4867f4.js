Object.defineProperty(exports, '__esModule', {
  value: true
});

var _atom = require('atom');

'use babel';

var _require = require('child_process');

var exec = _require.exec;

var remote = require('remote');

exports['default'] = {
  subscriptions: null,

  activate: function activate(state) {
    var _this = this;

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new _atom.CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'repl-console:run': function replConsoleRun() {
        return _this.runCode();
      }
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
  },

  runCommand: function runCommand(command) {
    exec(command, function (err, stdout, stderr) {
      if (err) {
        console.log(err.message);
      }

      if (stdout) {
        console.log(stdout);
      }

      if (stderr) {
        console.log(stderr);
      }

      console.log('Finished executing code via REPL Console');
    });
  },

  runCode: function runCode() {
    var editor = atom.workspace.getActiveTextEditor();
    if (!editor) {
      return;
    }

    var text = editor.getText();
    var grammerName = editor.getGrammar().name;

    // Open dev tools console
    remote.BrowserWindow.getFocusedWindow().openDevTools();

    var validGrammers = ['Ruby', 'JavaScript', 'Python', 'PHP', 'Go', 'Shell Script', 'JSON'];

    if (!validGrammers.includes(grammerName)) {
      console.log('REPL Console: unknown grammer - ' + grammerName);
      console.log('Valid Grammers:', validGrammers.join(', '));
      return;
    }

    if (!text) {
      return;
    }

    console.log('Running ' + grammerName + ' code via REPL Console');

    var escapedText = text.replace(/(["$\\])/g, '\\$1');
    var command = undefined;

    switch (grammerName) {
      case 'Go':
        command = 'echo "' + escapedText + '" > /tmp/repl-console-go-src.go && go run /tmp/repl-console-go-src.go; rm /tmp/repl-console-go-src.go';
        break;

      case 'Ruby':
        command = 'echo "' + escapedText + '" | ruby';
        break;

      case 'Python':
        command = 'echo "' + escapedText + '" | python';
        break;

      case 'PHP':
        command = 'echo "' + escapedText + '" | php';
        break;

      case 'Shell Script':
        command = 'echo "' + escapedText + '" | sh';
        break;

      case 'JSON':
        try {
          console.log(JSON.parse(text));
        } catch (e) {
          console.warn(e);
        }
        break;

      case 'JavaScript':
        // For JS run it directly in dev console
        try {
          var output = new Function(text)();
          if (output) {
            console.log(output);
          }
        } catch (e) {
          console.warn(e);
        }
        break;
    }

    if (command) {
      this.runCommand(command);
    } else {
      console.log('Finished executing code via REPL Console');
    }
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9yZXBsLWNvbnNvbGUvbGliL3JlcGwtY29uc29sZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O29CQUVvQyxNQUFNOztBQUYxQyxXQUFXLENBQUM7O2VBR0ssT0FBTyxDQUFDLGVBQWUsQ0FBQzs7SUFBakMsSUFBSSxZQUFKLElBQUk7O0FBQ1osSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztxQkFFaEI7QUFDYixlQUFhLEVBQUUsSUFBSTs7QUFFbkIsVUFBUSxFQUFBLGtCQUFDLEtBQUssRUFBRTs7OztBQUVkLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUM7OztBQUcvQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUN6RCx3QkFBa0IsRUFBRTtlQUFNLE1BQUssT0FBTyxFQUFFO09BQUE7S0FDekMsQ0FBQyxDQUFDLENBQUM7R0FDTDs7QUFFRCxZQUFVLEVBQUEsc0JBQUc7QUFDWCxRQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO0dBQzlCOztBQUVELFlBQVUsRUFBQSxvQkFBQyxPQUFPLEVBQUM7QUFDakIsUUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFLO0FBQ3JDLFVBQUcsR0FBRyxFQUFDO0FBQ0wsZUFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7T0FDMUI7O0FBRUQsVUFBRyxNQUFNLEVBQUM7QUFDUixlQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQ3JCOztBQUVELFVBQUcsTUFBTSxFQUFDO0FBQ1IsZUFBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUNyQjs7QUFFRCxhQUFPLENBQUMsR0FBRyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7S0FDekQsQ0FBQyxDQUFDO0dBQ0o7O0FBRUQsU0FBTyxFQUFBLG1CQUFHO0FBQ1IsUUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0FBQ2xELFFBQUksQ0FBQyxNQUFNLEVBQUU7QUFDWCxhQUFPO0tBQ1I7O0FBRUQsUUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzVCLFFBQUksV0FBVyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUM7OztBQUczQyxVQUFNLENBQUMsYUFBYSxDQUFDLGdCQUFnQixFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7O0FBRXZELFFBQUksYUFBYSxHQUFHLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRTFGLFFBQUcsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFDO0FBQ3RDLGFBQU8sQ0FBQyxHQUFHLHNDQUFvQyxXQUFXLENBQUcsQ0FBQztBQUM5RCxhQUFPLENBQUMsR0FBRyxvQkFBb0IsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3pELGFBQU87S0FDUjs7QUFFRCxRQUFHLENBQUMsSUFBSSxFQUFDO0FBQ1AsYUFBTztLQUNSOztBQUVELFdBQU8sQ0FBQyxHQUFHLGNBQVksV0FBVyw0QkFBeUIsQ0FBQzs7QUFFNUQsUUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDcEQsUUFBSSxPQUFPLFlBQUEsQ0FBQzs7QUFFWixZQUFRLFdBQVc7QUFDakIsV0FBSyxJQUFJO0FBQ1AsZUFBTyxjQUFZLFdBQVcsMEdBQXVHLENBQUM7QUFDdEksY0FBTTs7QUFBQSxBQUVSLFdBQUssTUFBTTtBQUNULGVBQU8sY0FBWSxXQUFXLGFBQVUsQ0FBQztBQUN6QyxjQUFNOztBQUFBLEFBRVIsV0FBSyxRQUFRO0FBQ1gsZUFBTyxjQUFZLFdBQVcsZUFBWSxDQUFDO0FBQzNDLGNBQU07O0FBQUEsQUFFUixXQUFLLEtBQUs7QUFDUixlQUFPLGNBQVksV0FBVyxZQUFTLENBQUM7QUFDeEMsY0FBTTs7QUFBQSxBQUVSLFdBQUssY0FBYztBQUNqQixlQUFPLGNBQVksV0FBVyxXQUFRLENBQUM7QUFDdkMsY0FBTTs7QUFBQSxBQUVSLFdBQUssTUFBTTtBQUNULFlBQUc7QUFDRCxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDL0IsQ0FBQyxPQUFNLENBQUMsRUFBQztBQUNSLGlCQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2pCO0FBQ0QsY0FBTTs7QUFBQSxBQUVSLFdBQUssWUFBWTs7QUFFZixZQUFJO0FBQ0YsY0FBSSxNQUFNLEdBQUcsQUFBQyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRyxDQUFDO0FBQ3BDLGNBQUcsTUFBTSxFQUFDO0FBQ1IsbUJBQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7V0FDckI7U0FDRixDQUFDLE9BQU0sQ0FBQyxFQUFFO0FBQ1QsaUJBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDakI7QUFDRCxjQUFNO0FBQUEsS0FDVDs7QUFFRCxRQUFHLE9BQU8sRUFBQztBQUNULFVBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDMUIsTUFBTTtBQUNMLGFBQU8sQ0FBQyxHQUFHLENBQUMsMENBQTBDLENBQUMsQ0FBQztLQUN6RDtHQUNGO0NBQ0YiLCJmaWxlIjoiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL3JlcGwtY29uc29sZS9saWIvcmVwbC1jb25zb2xlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcbmNvbnN0IHsgZXhlYyB9ID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpO1xudmFyIHJlbW90ZSA9IHJlcXVpcmUoJ3JlbW90ZScpO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHN1YnNjcmlwdGlvbnM6IG51bGwsXG5cbiAgYWN0aXZhdGUoc3RhdGUpIHtcbiAgICAvLyBFdmVudHMgc3Vic2NyaWJlZCB0byBpbiBhdG9tJ3Mgc3lzdGVtIGNhbiBiZSBlYXNpbHkgY2xlYW5lZCB1cCB3aXRoIGEgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICAvLyBSZWdpc3RlciBjb21tYW5kIHRoYXQgdG9nZ2xlcyB0aGlzIHZpZXdcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICdyZXBsLWNvbnNvbGU6cnVuJzogKCkgPT4gdGhpcy5ydW5Db2RlKClcbiAgICB9KSk7XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICB9LFxuXG4gIHJ1bkNvbW1hbmQoY29tbWFuZCl7XG4gICAgZXhlYyhjb21tYW5kLCAoZXJyLCBzdGRvdXQsIHN0ZGVycikgPT4ge1xuICAgICAgaWYoZXJyKXtcbiAgICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpO1xuICAgICAgfVxuXG4gICAgICBpZihzdGRvdXQpe1xuICAgICAgICBjb25zb2xlLmxvZyhzdGRvdXQpO1xuICAgICAgfVxuXG4gICAgICBpZihzdGRlcnIpe1xuICAgICAgICBjb25zb2xlLmxvZyhzdGRlcnIpO1xuICAgICAgfVxuXG4gICAgICBjb25zb2xlLmxvZygnRmluaXNoZWQgZXhlY3V0aW5nIGNvZGUgdmlhIFJFUEwgQ29uc29sZScpO1xuICAgIH0pO1xuICB9LFxuXG4gIHJ1bkNvZGUoKSB7XG4gICAgbGV0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICBpZiAoIWVkaXRvcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCB0ZXh0ID0gZWRpdG9yLmdldFRleHQoKTtcbiAgICBsZXQgZ3JhbW1lck5hbWUgPSBlZGl0b3IuZ2V0R3JhbW1hcigpLm5hbWU7XG5cbiAgICAvLyBPcGVuIGRldiB0b29scyBjb25zb2xlXG4gICAgcmVtb3RlLkJyb3dzZXJXaW5kb3cuZ2V0Rm9jdXNlZFdpbmRvdygpLm9wZW5EZXZUb29scygpO1xuXG4gICAgbGV0IHZhbGlkR3JhbW1lcnMgPSBbJ1J1YnknLCAnSmF2YVNjcmlwdCcsICdQeXRob24nLCAnUEhQJywgJ0dvJywgJ1NoZWxsIFNjcmlwdCcsICdKU09OJ107XG5cbiAgICBpZighdmFsaWRHcmFtbWVycy5pbmNsdWRlcyhncmFtbWVyTmFtZSkpe1xuICAgICAgY29uc29sZS5sb2coYFJFUEwgQ29uc29sZTogdW5rbm93biBncmFtbWVyIC0gJHtncmFtbWVyTmFtZX1gKTtcbiAgICAgIGNvbnNvbGUubG9nKGBWYWxpZCBHcmFtbWVyczpgLCB2YWxpZEdyYW1tZXJzLmpvaW4oJywgJykpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmKCF0ZXh0KXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhgUnVubmluZyAke2dyYW1tZXJOYW1lfSBjb2RlIHZpYSBSRVBMIENvbnNvbGVgKTtcblxuICAgIGxldCBlc2NhcGVkVGV4dCA9IHRleHQucmVwbGFjZSgvKFtcIiRcXFxcXSkvZywgJ1xcXFwkMScpO1xuICAgIGxldCBjb21tYW5kO1xuXG4gICAgc3dpdGNoIChncmFtbWVyTmFtZSkge1xuICAgICAgY2FzZSAnR28nOlxuICAgICAgICBjb21tYW5kID0gYGVjaG8gXCIke2VzY2FwZWRUZXh0fVwiID4gL3RtcC9yZXBsLWNvbnNvbGUtZ28tc3JjLmdvICYmIGdvIHJ1biAvdG1wL3JlcGwtY29uc29sZS1nby1zcmMuZ287IHJtIC90bXAvcmVwbC1jb25zb2xlLWdvLXNyYy5nb2A7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdSdWJ5JzpcbiAgICAgICAgY29tbWFuZCA9IGBlY2hvIFwiJHtlc2NhcGVkVGV4dH1cIiB8IHJ1YnlgO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnUHl0aG9uJzpcbiAgICAgICAgY29tbWFuZCA9IGBlY2hvIFwiJHtlc2NhcGVkVGV4dH1cIiB8IHB5dGhvbmA7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdQSFAnOlxuICAgICAgICBjb21tYW5kID0gYGVjaG8gXCIke2VzY2FwZWRUZXh0fVwiIHwgcGhwYDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ1NoZWxsIFNjcmlwdCc6XG4gICAgICAgIGNvbW1hbmQgPSBgZWNobyBcIiR7ZXNjYXBlZFRleHR9XCIgfCBzaGA7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdKU09OJzpcbiAgICAgICAgdHJ5e1xuICAgICAgICAgIGNvbnNvbGUubG9nKEpTT04ucGFyc2UodGV4dCkpO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgIGNvbnNvbGUud2FybihlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnSmF2YVNjcmlwdCc6XG4gICAgICAgIC8vIEZvciBKUyBydW4gaXQgZGlyZWN0bHkgaW4gZGV2IGNvbnNvbGVcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBsZXQgb3V0cHV0ID0gKG5ldyBGdW5jdGlvbih0ZXh0KSkoKTtcbiAgICAgICAgICBpZihvdXRwdXQpe1xuICAgICAgICAgICAgY29uc29sZS5sb2cob3V0cHV0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgIGNvbnNvbGUud2FybihlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZihjb21tYW5kKXtcbiAgICAgIHRoaXMucnVuQ29tbWFuZChjb21tYW5kKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ0ZpbmlzaGVkIGV4ZWN1dGluZyBjb2RlIHZpYSBSRVBMIENvbnNvbGUnKTtcbiAgICB9XG4gIH1cbn07XG4iXX0=