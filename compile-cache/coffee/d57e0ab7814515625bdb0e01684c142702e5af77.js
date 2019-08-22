(function() {
  var meta;

  meta = {
    define: "https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey",
    key: (function() {
      switch (process.platform) {
        case "darwin":
          return "⌘";
        case "linux":
          return "Super";
        case "win32":
          return "❖";
      }
    })()
  };

  module.exports = {
    general: {
      order: 1,
      type: "object",
      properties: {
        gitPath: {
          order: 1,
          title: "Git Path",
          type: "string",
          "default": "git",
          description: "If git is not in your PATH, specify where the executable is"
        },
        enableStatusBarIcon: {
          order: 2,
          title: "Status-bar Icon",
          type: "boolean",
          "default": true,
          description: "The 'git+' icon in the bottom-right of the status-bar toggles the output view above the status-bar"
        },
        openInPane: {
          order: 3,
          title: "Allow commands to open new panes",
          type: "boolean",
          "default": true,
          description: "Commands like `Commit`, `Log`, `Show`, `Diff` can be split into new panes"
        },
        splitPane: {
          order: 4,
          title: "Split pane direction",
          type: "string",
          "default": "Down",
          description: "Where should new panes go?",
          "enum": ["Up", "Right", "Down", "Left"]
        },
        showFormat: {
          order: 5,
          title: "Format option for 'Git Show'",
          type: "string",
          "default": "full",
          "enum": ["oneline", "short", "medium", "full", "fuller", "email", "raw", "none"],
          description: "Which format to use for `git show`? (`none` will use your git config default)"
        },
        alwaysOpenDockWithResult: {
          order: 6,
          title: "Always show result output",
          type: "boolean",
          "default": false,
          description: "Always display the output view after a command completes (regardless of dock visibility). If the view has been destroyed, it will need to be manually toggled."
        },
        newBranchKey: {
          order: 7,
          title: "Status-bar New Branch modifier key",
          type: "string",
          "default": "alt",
          description: "Holding this modifier key while clicking on the branch name in the status bar will trigger creatinga a new branch. Note that _[`meta`](" + meta.define + ")_ is <kbd>" + meta.key + "</kbd>",
          "enum": ["alt", "shift", "meta", "ctrl"]
        },
        showBranchInTreeView: {
          order: 8,
          title: "Show current branch name in tree view.",
          type: "boolean",
          "default": true,
          description: "The branch name will be displayed next to repo root in the tree view as `[branch-name]`."
        }
      }
    },
    commits: {
      order: 2,
      type: "object",
      properties: {
        verboseCommits: {
          title: "Verbose Commits",
          description: "Show diffs in commit pane?",
          type: "boolean",
          "default": false
        }
      }
    },
    diffs: {
      order: 3,
      type: "object",
      properties: {
        includeStagedDiff: {
          order: 1,
          title: "Include staged diffs?",
          type: "boolean",
          "default": true
        },
        wordDiff: {
          order: 2,
          title: "Word diff",
          type: "boolean",
          "default": false,
          description: "Should diffs be generated with the `--word-diff` flag?"
        },
        syntaxHighlighting: {
          order: 3,
          title: "Enable syntax highlighting in diffs?",
          type: "boolean",
          "default": true
        },
        useSplitDiff: {
          order: 4,
          title: "Split diff",
          type: "boolean",
          "default": false,
          description: "Use the split-diff package to show diffs for a single file. Only works with `Diff` command when a file is open."
        }
      }
    },
    logs: {
      order: 4,
      type: "object",
      properties: {
        numberOfCommitsToShow: {
          order: 1,
          title: "Number of commits to load",
          type: "integer",
          "default": 25,
          minimum: 1,
          description: "Initial amount of commits to load when running the `Log` command"
        }
      }
    },
    remoteInteractions: {
      order: 5,
      type: "object",
      properties: {
        pullRebase: {
          order: 1,
          title: "Pull Rebase",
          type: "boolean",
          "default": false,
          description: "Pull with `--rebase` flag?"
        },
        pullAutostash: {
          order: 2,
          title: "Pull AutoStash",
          type: "boolean",
          "default": false,
          description: "Pull with `--autostash` flag?"
        },
        pullBeforePush: {
          order: 3,
          title: "Pull Before Pushing",
          type: "boolean",
          "default": false,
          description: "Pull from remote before pushing"
        },
        promptForBranch: {
          order: 4,
          title: "Prompt for branch selection when pulling/pushing",
          type: "boolean",
          "default": false,
          description: "If false, it defaults to current branch upstream"
        }
      }
    },
    tags: {
      order: 6,
      type: "object",
      properties: {
        signTags: {
          title: "Sign git tags with GPG",
          type: "boolean",
          "default": false,
          description: "Use a GPG key to sign Git tags"
        }
      }
    },
    experimental: {
      order: 7,
      type: "object",
      properties: {
        customCommands: {
          order: 1,
          title: "Custom Commands",
          type: "boolean",
          "default": false,
          description: "Declared custom commands in your `init` file that can be run from the Git-plus command palette"
        },
        diffBranches: {
          order: 2,
          title: "Show diffs across branches",
          type: "boolean",
          "default": false,
          description: "Diffs will be shown for the current branch against a branch you choose. The `Diff branch files` command will allow choosing which file to compare. The file feature requires the 'split-diff' package to be installed."
        },
        autoFetch: {
          order: 3,
          title: "Auto-fetch",
          type: "integer",
          "default": 0,
          maximum: 60,
          description: "Automatically fetch remote repositories every `x` minutes (`0` will disable this feature)"
        },
        autoFetchNotify: {
          order: 4,
          title: "Auto-fetch notification",
          type: "boolean",
          "default": false,
          description: "Show notifications while running `fetch --all`?"
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvY29uZmlnLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUNFO0lBQUEsTUFBQSxFQUFRLHFFQUFSO0lBQ0EsR0FBQTtBQUNFLGNBQU8sT0FBTyxDQUFDLFFBQWY7QUFBQSxhQUNPLFFBRFA7aUJBQ3FCO0FBRHJCLGFBRU8sT0FGUDtpQkFFb0I7QUFGcEIsYUFHTyxPQUhQO2lCQUdvQjtBQUhwQjtRQUZGOzs7RUFPRixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsT0FBQSxFQUNFO01BQUEsS0FBQSxFQUFPLENBQVA7TUFDQSxJQUFBLEVBQU0sUUFETjtNQUVBLFVBQUEsRUFDRTtRQUFBLE9BQUEsRUFDRTtVQUFBLEtBQUEsRUFBTyxDQUFQO1VBQ0EsS0FBQSxFQUFPLFVBRFA7VUFFQSxJQUFBLEVBQU0sUUFGTjtVQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FIVDtVQUlBLFdBQUEsRUFBYSw2REFKYjtTQURGO1FBTUEsbUJBQUEsRUFDRTtVQUFBLEtBQUEsRUFBTyxDQUFQO1VBQ0EsS0FBQSxFQUFPLGlCQURQO1VBRUEsSUFBQSxFQUFNLFNBRk47VUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBSFQ7VUFJQSxXQUFBLEVBQWEsb0dBSmI7U0FQRjtRQVlBLFVBQUEsRUFDRTtVQUFBLEtBQUEsRUFBTyxDQUFQO1VBQ0EsS0FBQSxFQUFPLGtDQURQO1VBRUEsSUFBQSxFQUFNLFNBRk47VUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBSFQ7VUFJQSxXQUFBLEVBQWEsMkVBSmI7U0FiRjtRQWtCQSxTQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sQ0FBUDtVQUNBLEtBQUEsRUFBTyxzQkFEUDtVQUVBLElBQUEsRUFBTSxRQUZOO1VBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxNQUhU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SGI7U0FERjtPQUhGO0tBbElGO0lBMElBLFlBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyxDQUFQO01BQ0EsSUFBQSxFQUFNLFFBRE47TUFFQSxVQUFBLEVBQ0U7UUFBQSxjQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sQ0FBUDtVQUNBLEtBQUEsRUFBTyxpQkFEUDtVQUVBLElBQUEsRUFBTSxTQUZOO1VBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUhUO1VBSUEsV0FBQSxFQUFhLGdHQUpiO1NBREY7UUFNQSxZQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sQ0FBUDtVQUNBLEtBQUEsRUFBTyw0QkFEUDtVQUVBLElBQUEsRUFBTSxTQUZOO1VBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUhUO1VBSUEsV0FBQSxFQUFhLHdOQUpiO1NBUEY7UUFZQSxTQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sQ0FBUDtVQUNBLEtBQUEsRUFBTyxZQURQO1VBRUEsSUFBQSxFQUFNLFNBRk47VUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBSFQ7VUFJQSxPQUFBLEVBQVMsRUFKVDtVQUtBLFdBQUEsRUFBYSwyRkFMYjtTQWJGO1FBbUJBLGVBQUEsRUFDRTtVQUFBLEtBQUEsRUFBTyxDQUFQO1VBQ0EsS0FBQSxFQUFPLHlCQURQO1VBRUEsSUFBQSxFQUFNLFNBRk47VUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBSFQ7VUFJQSxXQUFBLEVBQWEsaURBSmI7U0FwQkY7T0FIRjtLQTNJRjs7QUFURiIsInNvdXJjZXNDb250ZW50IjpbIm1ldGEgPSAjS2V5XG4gIGRlZmluZTogXCJodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTW91c2VFdmVudC9tZXRhS2V5XCJcbiAga2V5OlxuICAgIHN3aXRjaCBwcm9jZXNzLnBsYXRmb3JtXG4gICAgICB3aGVuIFwiZGFyd2luXCIgdGhlbiBcIuKMmFwiXG4gICAgICB3aGVuIFwibGludXhcIiB0aGVuIFwiU3VwZXJcIlxuICAgICAgd2hlbiBcIndpbjMyXCIgdGhlbiBcIuKdllwiXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgZ2VuZXJhbDpcbiAgICBvcmRlcjogMVxuICAgIHR5cGU6IFwib2JqZWN0XCJcbiAgICBwcm9wZXJ0aWVzOlxuICAgICAgZ2l0UGF0aDpcbiAgICAgICAgb3JkZXI6IDFcbiAgICAgICAgdGl0bGU6IFwiR2l0IFBhdGhcIlxuICAgICAgICB0eXBlOiBcInN0cmluZ1wiXG4gICAgICAgIGRlZmF1bHQ6IFwiZ2l0XCJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiSWYgZ2l0IGlzIG5vdCBpbiB5b3VyIFBBVEgsIHNwZWNpZnkgd2hlcmUgdGhlIGV4ZWN1dGFibGUgaXNcIlxuICAgICAgZW5hYmxlU3RhdHVzQmFySWNvbjpcbiAgICAgICAgb3JkZXI6IDJcbiAgICAgICAgdGl0bGU6IFwiU3RhdHVzLWJhciBJY29uXCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgJ2dpdCsnIGljb24gaW4gdGhlIGJvdHRvbS1yaWdodCBvZiB0aGUgc3RhdHVzLWJhciB0b2dnbGVzIHRoZSBvdXRwdXQgdmlldyBhYm92ZSB0aGUgc3RhdHVzLWJhclwiXG4gICAgICBvcGVuSW5QYW5lOlxuICAgICAgICBvcmRlcjogM1xuICAgICAgICB0aXRsZTogXCJBbGxvdyBjb21tYW5kcyB0byBvcGVuIG5ldyBwYW5lc1wiXG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgICAgZGVzY3JpcHRpb246IFwiQ29tbWFuZHMgbGlrZSBgQ29tbWl0YCwgYExvZ2AsIGBTaG93YCwgYERpZmZgIGNhbiBiZSBzcGxpdCBpbnRvIG5ldyBwYW5lc1wiXG4gICAgICBzcGxpdFBhbmU6XG4gICAgICAgIG9yZGVyOiA0XG4gICAgICAgIHRpdGxlOiBcIlNwbGl0IHBhbmUgZGlyZWN0aW9uXCJcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIlxuICAgICAgICBkZWZhdWx0OiBcIkRvd25cIlxuICAgICAgICBkZXNjcmlwdGlvbjogXCJXaGVyZSBzaG91bGQgbmV3IHBhbmVzIGdvP1wiXG4gICAgICAgIGVudW06IFtcIlVwXCIsIFwiUmlnaHRcIiwgXCJEb3duXCIsIFwiTGVmdFwiXVxuICAgICAgc2hvd0Zvcm1hdDpcbiAgICAgICAgb3JkZXI6IDVcbiAgICAgICAgdGl0bGU6IFwiRm9ybWF0IG9wdGlvbiBmb3IgJ0dpdCBTaG93J1wiXG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICAgICAgZGVmYXVsdDogXCJmdWxsXCJcbiAgICAgICAgZW51bTogW1wib25lbGluZVwiLCBcInNob3J0XCIsIFwibWVkaXVtXCIsIFwiZnVsbFwiLCBcImZ1bGxlclwiLCBcImVtYWlsXCIsIFwicmF3XCIsIFwibm9uZVwiXVxuICAgICAgICBkZXNjcmlwdGlvbjogXCJXaGljaCBmb3JtYXQgdG8gdXNlIGZvciBgZ2l0IHNob3dgPyAoYG5vbmVgIHdpbGwgdXNlIHlvdXIgZ2l0IGNvbmZpZyBkZWZhdWx0KVwiXG4gICAgICBhbHdheXNPcGVuRG9ja1dpdGhSZXN1bHQ6XG4gICAgICAgIG9yZGVyOiA2XG4gICAgICAgIHRpdGxlOiBcIkFsd2F5cyBzaG93IHJlc3VsdCBvdXRwdXRcIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICBkZXNjcmlwdGlvbjogXCJBbHdheXMgZGlzcGxheSB0aGUgb3V0cHV0IHZpZXcgYWZ0ZXIgYSBjb21tYW5kIGNvbXBsZXRlcyAocmVnYXJkbGVzcyBvZiBkb2NrIHZpc2liaWxpdHkpLiBJZiB0aGUgdmlldyBoYXMgYmVlbiBkZXN0cm95ZWQsIGl0IHdpbGwgbmVlZCB0byBiZSBtYW51YWxseSB0b2dnbGVkLlwiXG4gICAgICBuZXdCcmFuY2hLZXk6XG4gICAgICAgIG9yZGVyOiA3XG4gICAgICAgIHRpdGxlOiBcIlN0YXR1cy1iYXIgTmV3IEJyYW5jaCBtb2RpZmllciBrZXlcIlxuICAgICAgICB0eXBlOiBcInN0cmluZ1wiXG4gICAgICAgIGRlZmF1bHQ6IFwiYWx0XCJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiSG9sZGluZyB0aGlzIG1vZGlmaWVyIGtleSB3aGlsZSBjbGlja2luZyBvbiB0aGUgYnJhbmNoIG5hbWUgaW4gdGhlIHN0YXR1cyBiYXIgd2lsbCB0cmlnZ2VyIGNyZWF0aW5nYSBhIG5ldyBicmFuY2guIE5vdGUgdGhhdCBfW2BtZXRhYF0oI3ttZXRhLmRlZmluZX0pXyBpcyA8a2JkPiN7bWV0YS5rZXl9PC9rYmQ+XCJcbiAgICAgICAgZW51bTogW1wiYWx0XCIsIFwic2hpZnRcIiwgXCJtZXRhXCIsIFwiY3RybFwiXVxuICAgICAgc2hvd0JyYW5jaEluVHJlZVZpZXc6XG4gICAgICAgIG9yZGVyOiA4XG4gICAgICAgIHRpdGxlOiBcIlNob3cgY3VycmVudCBicmFuY2ggbmFtZSBpbiB0cmVlIHZpZXcuXCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgYnJhbmNoIG5hbWUgd2lsbCBiZSBkaXNwbGF5ZWQgbmV4dCB0byByZXBvIHJvb3QgaW4gdGhlIHRyZWUgdmlldyBhcyBgW2JyYW5jaC1uYW1lXWAuXCJcbiAgY29tbWl0czpcbiAgICBvcmRlcjogMlxuICAgIHR5cGU6IFwib2JqZWN0XCJcbiAgICBwcm9wZXJ0aWVzOlxuICAgICAgdmVyYm9zZUNvbW1pdHM6XG4gICAgICAgIHRpdGxlOiBcIlZlcmJvc2UgQ29tbWl0c1wiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlNob3cgZGlmZnMgaW4gY29tbWl0IHBhbmU/XCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgZGlmZnM6XG4gICAgb3JkZXI6IDNcbiAgICB0eXBlOiBcIm9iamVjdFwiXG4gICAgcHJvcGVydGllczpcbiAgICAgIGluY2x1ZGVTdGFnZWREaWZmOlxuICAgICAgICBvcmRlcjogMVxuICAgICAgICB0aXRsZTogXCJJbmNsdWRlIHN0YWdlZCBkaWZmcz9cIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICB3b3JkRGlmZjpcbiAgICAgICAgb3JkZXI6IDJcbiAgICAgICAgdGl0bGU6IFwiV29yZCBkaWZmXCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgZGVzY3JpcHRpb246IFwiU2hvdWxkIGRpZmZzIGJlIGdlbmVyYXRlZCB3aXRoIHRoZSBgLS13b3JkLWRpZmZgIGZsYWc/XCJcbiAgICAgIHN5bnRheEhpZ2hsaWdodGluZzpcbiAgICAgICAgb3JkZXI6IDNcbiAgICAgICAgdGl0bGU6IFwiRW5hYmxlIHN5bnRheCBoaWdobGlnaHRpbmcgaW4gZGlmZnM/XCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgdXNlU3BsaXREaWZmOlxuICAgICAgICBvcmRlcjogNFxuICAgICAgICB0aXRsZTogXCJTcGxpdCBkaWZmXCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgZGVzY3JpcHRpb246IFwiVXNlIHRoZSBzcGxpdC1kaWZmIHBhY2thZ2UgdG8gc2hvdyBkaWZmcyBmb3IgYSBzaW5nbGUgZmlsZS4gT25seSB3b3JrcyB3aXRoIGBEaWZmYCBjb21tYW5kIHdoZW4gYSBmaWxlIGlzIG9wZW4uXCJcbiAgbG9nczpcbiAgICBvcmRlcjogNFxuICAgIHR5cGU6IFwib2JqZWN0XCJcbiAgICBwcm9wZXJ0aWVzOlxuICAgICAgbnVtYmVyT2ZDb21taXRzVG9TaG93OlxuICAgICAgICBvcmRlcjogMVxuICAgICAgICB0aXRsZTogXCJOdW1iZXIgb2YgY29tbWl0cyB0byBsb2FkXCJcbiAgICAgICAgdHlwZTogXCJpbnRlZ2VyXCJcbiAgICAgICAgZGVmYXVsdDogMjVcbiAgICAgICAgbWluaW11bTogMVxuICAgICAgICBkZXNjcmlwdGlvbjogXCJJbml0aWFsIGFtb3VudCBvZiBjb21taXRzIHRvIGxvYWQgd2hlbiBydW5uaW5nIHRoZSBgTG9nYCBjb21tYW5kXCJcbiAgcmVtb3RlSW50ZXJhY3Rpb25zOlxuICAgIG9yZGVyOiA1XG4gICAgdHlwZTogXCJvYmplY3RcIlxuICAgIHByb3BlcnRpZXM6XG4gICAgICBwdWxsUmViYXNlOlxuICAgICAgICBvcmRlcjogMVxuICAgICAgICB0aXRsZTogXCJQdWxsIFJlYmFzZVwiXG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlB1bGwgd2l0aCBgLS1yZWJhc2VgIGZsYWc/XCJcbiAgICAgIHB1bGxBdXRvc3Rhc2g6XG4gICAgICAgIG9yZGVyOiAyXG4gICAgICAgIHRpdGxlOiBcIlB1bGwgQXV0b1N0YXNoXCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgZGVzY3JpcHRpb246IFwiUHVsbCB3aXRoIGAtLWF1dG9zdGFzaGAgZmxhZz9cIlxuICAgICAgcHVsbEJlZm9yZVB1c2g6XG4gICAgICAgIG9yZGVyOiAzXG4gICAgICAgIHRpdGxlOiBcIlB1bGwgQmVmb3JlIFB1c2hpbmdcIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICBkZXNjcmlwdGlvbjogXCJQdWxsIGZyb20gcmVtb3RlIGJlZm9yZSBwdXNoaW5nXCJcbiAgICAgIHByb21wdEZvckJyYW5jaDpcbiAgICAgICAgb3JkZXI6IDRcbiAgICAgICAgdGl0bGU6IFwiUHJvbXB0IGZvciBicmFuY2ggc2VsZWN0aW9uIHdoZW4gcHVsbGluZy9wdXNoaW5nXCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgZGVzY3JpcHRpb246IFwiSWYgZmFsc2UsIGl0IGRlZmF1bHRzIHRvIGN1cnJlbnQgYnJhbmNoIHVwc3RyZWFtXCJcbiAgdGFnczpcbiAgICBvcmRlcjogNlxuICAgIHR5cGU6IFwib2JqZWN0XCJcbiAgICBwcm9wZXJ0aWVzOlxuICAgICAgc2lnblRhZ3M6XG4gICAgICAgIHRpdGxlOiBcIlNpZ24gZ2l0IHRhZ3Mgd2l0aCBHUEdcIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICBkZXNjcmlwdGlvbjogXCJVc2UgYSBHUEcga2V5IHRvIHNpZ24gR2l0IHRhZ3NcIlxuICBleHBlcmltZW50YWw6XG4gICAgb3JkZXI6IDdcbiAgICB0eXBlOiBcIm9iamVjdFwiXG4gICAgcHJvcGVydGllczpcbiAgICAgIGN1c3RvbUNvbW1hbmRzOlxuICAgICAgICBvcmRlcjogMVxuICAgICAgICB0aXRsZTogXCJDdXN0b20gQ29tbWFuZHNcIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICBkZXNjcmlwdGlvbjogXCJEZWNsYXJlZCBjdXN0b20gY29tbWFuZHMgaW4geW91ciBgaW5pdGAgZmlsZSB0aGF0IGNhbiBiZSBydW4gZnJvbSB0aGUgR2l0LXBsdXMgY29tbWFuZCBwYWxldHRlXCJcbiAgICAgIGRpZmZCcmFuY2hlczpcbiAgICAgICAgb3JkZXI6IDJcbiAgICAgICAgdGl0bGU6IFwiU2hvdyBkaWZmcyBhY3Jvc3MgYnJhbmNoZXNcIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICBkZXNjcmlwdGlvbjogXCJEaWZmcyB3aWxsIGJlIHNob3duIGZvciB0aGUgY3VycmVudCBicmFuY2ggYWdhaW5zdCBhIGJyYW5jaCB5b3UgY2hvb3NlLiBUaGUgYERpZmYgYnJhbmNoIGZpbGVzYCBjb21tYW5kIHdpbGwgYWxsb3cgY2hvb3Npbmcgd2hpY2ggZmlsZSB0byBjb21wYXJlLiBUaGUgZmlsZSBmZWF0dXJlIHJlcXVpcmVzIHRoZSAnc3BsaXQtZGlmZicgcGFja2FnZSB0byBiZSBpbnN0YWxsZWQuXCJcbiAgICAgIGF1dG9GZXRjaDpcbiAgICAgICAgb3JkZXI6IDNcbiAgICAgICAgdGl0bGU6IFwiQXV0by1mZXRjaFwiXG4gICAgICAgIHR5cGU6IFwiaW50ZWdlclwiXG4gICAgICAgIGRlZmF1bHQ6IDBcbiAgICAgICAgbWF4aW11bTogNjBcbiAgICAgICAgZGVzY3JpcHRpb246IFwiQXV0b21hdGljYWxseSBmZXRjaCByZW1vdGUgcmVwb3NpdG9yaWVzIGV2ZXJ5IGB4YCBtaW51dGVzIChgMGAgd2lsbCBkaXNhYmxlIHRoaXMgZmVhdHVyZSlcIlxuICAgICAgYXV0b0ZldGNoTm90aWZ5OlxuICAgICAgICBvcmRlcjogNFxuICAgICAgICB0aXRsZTogXCJBdXRvLWZldGNoIG5vdGlmaWNhdGlvblwiXG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlNob3cgbm90aWZpY2F0aW9ucyB3aGlsZSBydW5uaW5nIGBmZXRjaCAtLWFsbGA/XCJcbiJdfQ==
