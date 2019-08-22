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
          description: "Holding this modifier key while clicking on the branch name in the status bar will trigger creating a new branch. Note that _[`meta`](" + meta.define + ")_ is <kbd>" + meta.key + "</kbd>",
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvY29uZmlnLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUNFO0lBQUEsTUFBQSxFQUFRLHFFQUFSO0lBQ0EsR0FBQTtBQUNFLGNBQU8sT0FBTyxDQUFDLFFBQWY7QUFBQSxhQUNPLFFBRFA7aUJBQ3FCO0FBRHJCLGFBRU8sT0FGUDtpQkFFb0I7QUFGcEIsYUFHTyxPQUhQO2lCQUdvQjtBQUhwQjtRQUZGOzs7RUFPRixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsT0FBQSxFQUNFO01BQUEsS0FBQSxFQUFPLENBQVA7TUFDQSxJQUFBLEVBQU0sUUFETjtNQUVBLFVBQUEsRUFDRTtRQUFBLE9BQUEsRUFDRTtVQUFBLEtBQUEsRUFBTyxDQUFQO1VBQ0EsS0FBQSxFQUFPLFVBRFA7VUFFQSxJQUFBLEVBQU0sUUFGTjtVQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FIVDtVQUlBLFdBQUEsRUFBYSw2REFKYjtTQURGO1FBTUEsbUJBQUEsRUFDRTtVQUFBLEtBQUEsRUFBTyxDQUFQO1VBQ0EsS0FBQSxFQUFPLGlCQURQO1VBRUEsSUFBQSxFQUFNLFNBRk47VUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBSFQ7VUFJQSxXQUFBLEVBQWEsb0dBSmI7U0FQRjtRQVlBLFVBQUEsRUFDRTtVQUFBLEtBQUEsRUFBTyxDQUFQO1VBQ0EsS0FBQSxFQUFPLGtDQURQO1VBRUEsSUFBQSxFQUFNLFNBRk47VUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBSFQ7VUFJQSxXQUFBLEVBQWEsMkVBSmI7U0FiRjtRQWtCQSxTQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sQ0FBUDtVQUNBLEtBQUEsRUFBTyxzQkFEUDtVQUVBLElBQUEsRUFBTSxRQUZOO1VBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxNQUhU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SGI7U0FERjtPQUhGO0tBbElGO0lBMElBLFlBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyxDQUFQO01BQ0EsSUFBQSxFQUFNLFFBRE47TUFFQSxVQUFBLEVBQ0U7UUFBQSxjQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sQ0FBUDtVQUNBLEtBQUEsRUFBTyxpQkFEUDtVQUVBLElBQUEsRUFBTSxTQUZOO1VBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUhUO1VBSUEsV0FBQSxFQUFhLGdHQUpiO1NBREY7UUFNQSxZQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sQ0FBUDtVQUNBLEtBQUEsRUFBTyw0QkFEUDtVQUVBLElBQUEsRUFBTSxTQUZOO1VBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUhUO1VBSUEsV0FBQSxFQUFhLHdOQUpiO1NBUEY7UUFZQSxTQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sQ0FBUDtVQUNBLEtBQUEsRUFBTyxZQURQO1VBRUEsSUFBQSxFQUFNLFNBRk47VUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBSFQ7VUFJQSxPQUFBLEVBQVMsRUFKVDtVQUtBLFdBQUEsRUFBYSwyRkFMYjtTQWJGO1FBbUJBLGVBQUEsRUFDRTtVQUFBLEtBQUEsRUFBTyxDQUFQO1VBQ0EsS0FBQSxFQUFPLHlCQURQO1VBRUEsSUFBQSxFQUFNLFNBRk47VUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBSFQ7VUFJQSxXQUFBLEVBQWEsaURBSmI7U0FwQkY7T0FIRjtLQTNJRjs7QUFURiIsInNvdXJjZXNDb250ZW50IjpbIm1ldGEgPSAjS2V5XG4gIGRlZmluZTogXCJodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTW91c2VFdmVudC9tZXRhS2V5XCJcbiAga2V5OlxuICAgIHN3aXRjaCBwcm9jZXNzLnBsYXRmb3JtXG4gICAgICB3aGVuIFwiZGFyd2luXCIgdGhlbiBcIuKMmFwiXG4gICAgICB3aGVuIFwibGludXhcIiB0aGVuIFwiU3VwZXJcIlxuICAgICAgd2hlbiBcIndpbjMyXCIgdGhlbiBcIuKdllwiXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgZ2VuZXJhbDpcbiAgICBvcmRlcjogMVxuICAgIHR5cGU6IFwib2JqZWN0XCJcbiAgICBwcm9wZXJ0aWVzOlxuICAgICAgZ2l0UGF0aDpcbiAgICAgICAgb3JkZXI6IDFcbiAgICAgICAgdGl0bGU6IFwiR2l0IFBhdGhcIlxuICAgICAgICB0eXBlOiBcInN0cmluZ1wiXG4gICAgICAgIGRlZmF1bHQ6IFwiZ2l0XCJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiSWYgZ2l0IGlzIG5vdCBpbiB5b3VyIFBBVEgsIHNwZWNpZnkgd2hlcmUgdGhlIGV4ZWN1dGFibGUgaXNcIlxuICAgICAgZW5hYmxlU3RhdHVzQmFySWNvbjpcbiAgICAgICAgb3JkZXI6IDJcbiAgICAgICAgdGl0bGU6IFwiU3RhdHVzLWJhciBJY29uXCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgJ2dpdCsnIGljb24gaW4gdGhlIGJvdHRvbS1yaWdodCBvZiB0aGUgc3RhdHVzLWJhciB0b2dnbGVzIHRoZSBvdXRwdXQgdmlldyBhYm92ZSB0aGUgc3RhdHVzLWJhclwiXG4gICAgICBvcGVuSW5QYW5lOlxuICAgICAgICBvcmRlcjogM1xuICAgICAgICB0aXRsZTogXCJBbGxvdyBjb21tYW5kcyB0byBvcGVuIG5ldyBwYW5lc1wiXG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgICAgZGVzY3JpcHRpb246IFwiQ29tbWFuZHMgbGlrZSBgQ29tbWl0YCwgYExvZ2AsIGBTaG93YCwgYERpZmZgIGNhbiBiZSBzcGxpdCBpbnRvIG5ldyBwYW5lc1wiXG4gICAgICBzcGxpdFBhbmU6XG4gICAgICAgIG9yZGVyOiA0XG4gICAgICAgIHRpdGxlOiBcIlNwbGl0IHBhbmUgZGlyZWN0aW9uXCJcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIlxuICAgICAgICBkZWZhdWx0OiBcIkRvd25cIlxuICAgICAgICBkZXNjcmlwdGlvbjogXCJXaGVyZSBzaG91bGQgbmV3IHBhbmVzIGdvP1wiXG4gICAgICAgIGVudW06IFtcIlVwXCIsIFwiUmlnaHRcIiwgXCJEb3duXCIsIFwiTGVmdFwiXVxuICAgICAgc2hvd0Zvcm1hdDpcbiAgICAgICAgb3JkZXI6IDVcbiAgICAgICAgdGl0bGU6IFwiRm9ybWF0IG9wdGlvbiBmb3IgJ0dpdCBTaG93J1wiXG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICAgICAgZGVmYXVsdDogXCJmdWxsXCJcbiAgICAgICAgZW51bTogW1wib25lbGluZVwiLCBcInNob3J0XCIsIFwibWVkaXVtXCIsIFwiZnVsbFwiLCBcImZ1bGxlclwiLCBcImVtYWlsXCIsIFwicmF3XCIsIFwibm9uZVwiXVxuICAgICAgICBkZXNjcmlwdGlvbjogXCJXaGljaCBmb3JtYXQgdG8gdXNlIGZvciBgZ2l0IHNob3dgPyAoYG5vbmVgIHdpbGwgdXNlIHlvdXIgZ2l0IGNvbmZpZyBkZWZhdWx0KVwiXG4gICAgICBhbHdheXNPcGVuRG9ja1dpdGhSZXN1bHQ6XG4gICAgICAgIG9yZGVyOiA2XG4gICAgICAgIHRpdGxlOiBcIkFsd2F5cyBzaG93IHJlc3VsdCBvdXRwdXRcIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICBkZXNjcmlwdGlvbjogXCJBbHdheXMgZGlzcGxheSB0aGUgb3V0cHV0IHZpZXcgYWZ0ZXIgYSBjb21tYW5kIGNvbXBsZXRlcyAocmVnYXJkbGVzcyBvZiBkb2NrIHZpc2liaWxpdHkpLiBJZiB0aGUgdmlldyBoYXMgYmVlbiBkZXN0cm95ZWQsIGl0IHdpbGwgbmVlZCB0byBiZSBtYW51YWxseSB0b2dnbGVkLlwiXG4gICAgICBuZXdCcmFuY2hLZXk6XG4gICAgICAgIG9yZGVyOiA3XG4gICAgICAgIHRpdGxlOiBcIlN0YXR1cy1iYXIgTmV3IEJyYW5jaCBtb2RpZmllciBrZXlcIlxuICAgICAgICB0eXBlOiBcInN0cmluZ1wiXG4gICAgICAgIGRlZmF1bHQ6IFwiYWx0XCJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiSG9sZGluZyB0aGlzIG1vZGlmaWVyIGtleSB3aGlsZSBjbGlja2luZyBvbiB0aGUgYnJhbmNoIG5hbWUgaW4gdGhlIHN0YXR1cyBiYXIgd2lsbCB0cmlnZ2VyIGNyZWF0aW5nIGEgbmV3IGJyYW5jaC4gTm90ZSB0aGF0IF9bYG1ldGFgXSgje21ldGEuZGVmaW5lfSlfIGlzIDxrYmQ+I3ttZXRhLmtleX08L2tiZD5cIlxuICAgICAgICBlbnVtOiBbXCJhbHRcIiwgXCJzaGlmdFwiLCBcIm1ldGFcIiwgXCJjdHJsXCJdXG4gICAgICBzaG93QnJhbmNoSW5UcmVlVmlldzpcbiAgICAgICAgb3JkZXI6IDhcbiAgICAgICAgdGl0bGU6IFwiU2hvdyBjdXJyZW50IGJyYW5jaCBuYW1lIGluIHRyZWUgdmlldy5cIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBicmFuY2ggbmFtZSB3aWxsIGJlIGRpc3BsYXllZCBuZXh0IHRvIHJlcG8gcm9vdCBpbiB0aGUgdHJlZSB2aWV3IGFzIGBbYnJhbmNoLW5hbWVdYC5cIlxuICBjb21taXRzOlxuICAgIG9yZGVyOiAyXG4gICAgdHlwZTogXCJvYmplY3RcIlxuICAgIHByb3BlcnRpZXM6XG4gICAgICB2ZXJib3NlQ29tbWl0czpcbiAgICAgICAgdGl0bGU6IFwiVmVyYm9zZSBDb21taXRzXCJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiU2hvdyBkaWZmcyBpbiBjb21taXQgcGFuZT9cIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICBkaWZmczpcbiAgICBvcmRlcjogM1xuICAgIHR5cGU6IFwib2JqZWN0XCJcbiAgICBwcm9wZXJ0aWVzOlxuICAgICAgaW5jbHVkZVN0YWdlZERpZmY6XG4gICAgICAgIG9yZGVyOiAxXG4gICAgICAgIHRpdGxlOiBcIkluY2x1ZGUgc3RhZ2VkIGRpZmZzP1wiXG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIHdvcmREaWZmOlxuICAgICAgICBvcmRlcjogMlxuICAgICAgICB0aXRsZTogXCJXb3JkIGRpZmZcIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICBkZXNjcmlwdGlvbjogXCJTaG91bGQgZGlmZnMgYmUgZ2VuZXJhdGVkIHdpdGggdGhlIGAtLXdvcmQtZGlmZmAgZmxhZz9cIlxuICAgICAgc3ludGF4SGlnaGxpZ2h0aW5nOlxuICAgICAgICBvcmRlcjogM1xuICAgICAgICB0aXRsZTogXCJFbmFibGUgc3ludGF4IGhpZ2hsaWdodGluZyBpbiBkaWZmcz9cIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICB1c2VTcGxpdERpZmY6XG4gICAgICAgIG9yZGVyOiA0XG4gICAgICAgIHRpdGxlOiBcIlNwbGl0IGRpZmZcIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICBkZXNjcmlwdGlvbjogXCJVc2UgdGhlIHNwbGl0LWRpZmYgcGFja2FnZSB0byBzaG93IGRpZmZzIGZvciBhIHNpbmdsZSBmaWxlLiBPbmx5IHdvcmtzIHdpdGggYERpZmZgIGNvbW1hbmQgd2hlbiBhIGZpbGUgaXMgb3Blbi5cIlxuICBsb2dzOlxuICAgIG9yZGVyOiA0XG4gICAgdHlwZTogXCJvYmplY3RcIlxuICAgIHByb3BlcnRpZXM6XG4gICAgICBudW1iZXJPZkNvbW1pdHNUb1Nob3c6XG4gICAgICAgIG9yZGVyOiAxXG4gICAgICAgIHRpdGxlOiBcIk51bWJlciBvZiBjb21taXRzIHRvIGxvYWRcIlxuICAgICAgICB0eXBlOiBcImludGVnZXJcIlxuICAgICAgICBkZWZhdWx0OiAyNVxuICAgICAgICBtaW5pbXVtOiAxXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkluaXRpYWwgYW1vdW50IG9mIGNvbW1pdHMgdG8gbG9hZCB3aGVuIHJ1bm5pbmcgdGhlIGBMb2dgIGNvbW1hbmRcIlxuICByZW1vdGVJbnRlcmFjdGlvbnM6XG4gICAgb3JkZXI6IDVcbiAgICB0eXBlOiBcIm9iamVjdFwiXG4gICAgcHJvcGVydGllczpcbiAgICAgIHB1bGxSZWJhc2U6XG4gICAgICAgIG9yZGVyOiAxXG4gICAgICAgIHRpdGxlOiBcIlB1bGwgUmViYXNlXCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgZGVzY3JpcHRpb246IFwiUHVsbCB3aXRoIGAtLXJlYmFzZWAgZmxhZz9cIlxuICAgICAgcHVsbEF1dG9zdGFzaDpcbiAgICAgICAgb3JkZXI6IDJcbiAgICAgICAgdGl0bGU6IFwiUHVsbCBBdXRvU3Rhc2hcIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICBkZXNjcmlwdGlvbjogXCJQdWxsIHdpdGggYC0tYXV0b3N0YXNoYCBmbGFnP1wiXG4gICAgICBwdWxsQmVmb3JlUHVzaDpcbiAgICAgICAgb3JkZXI6IDNcbiAgICAgICAgdGl0bGU6IFwiUHVsbCBCZWZvcmUgUHVzaGluZ1wiXG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlB1bGwgZnJvbSByZW1vdGUgYmVmb3JlIHB1c2hpbmdcIlxuICAgICAgcHJvbXB0Rm9yQnJhbmNoOlxuICAgICAgICBvcmRlcjogNFxuICAgICAgICB0aXRsZTogXCJQcm9tcHQgZm9yIGJyYW5jaCBzZWxlY3Rpb24gd2hlbiBwdWxsaW5nL3B1c2hpbmdcIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICBkZXNjcmlwdGlvbjogXCJJZiBmYWxzZSwgaXQgZGVmYXVsdHMgdG8gY3VycmVudCBicmFuY2ggdXBzdHJlYW1cIlxuICB0YWdzOlxuICAgIG9yZGVyOiA2XG4gICAgdHlwZTogXCJvYmplY3RcIlxuICAgIHByb3BlcnRpZXM6XG4gICAgICBzaWduVGFnczpcbiAgICAgICAgdGl0bGU6IFwiU2lnbiBnaXQgdGFncyB3aXRoIEdQR1wiXG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlVzZSBhIEdQRyBrZXkgdG8gc2lnbiBHaXQgdGFnc1wiXG4gIGV4cGVyaW1lbnRhbDpcbiAgICBvcmRlcjogN1xuICAgIHR5cGU6IFwib2JqZWN0XCJcbiAgICBwcm9wZXJ0aWVzOlxuICAgICAgY3VzdG9tQ29tbWFuZHM6XG4gICAgICAgIG9yZGVyOiAxXG4gICAgICAgIHRpdGxlOiBcIkN1c3RvbSBDb21tYW5kc1wiXG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkRlY2xhcmVkIGN1c3RvbSBjb21tYW5kcyBpbiB5b3VyIGBpbml0YCBmaWxlIHRoYXQgY2FuIGJlIHJ1biBmcm9tIHRoZSBHaXQtcGx1cyBjb21tYW5kIHBhbGV0dGVcIlxuICAgICAgZGlmZkJyYW5jaGVzOlxuICAgICAgICBvcmRlcjogMlxuICAgICAgICB0aXRsZTogXCJTaG93IGRpZmZzIGFjcm9zcyBicmFuY2hlc1wiXG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkRpZmZzIHdpbGwgYmUgc2hvd24gZm9yIHRoZSBjdXJyZW50IGJyYW5jaCBhZ2FpbnN0IGEgYnJhbmNoIHlvdSBjaG9vc2UuIFRoZSBgRGlmZiBicmFuY2ggZmlsZXNgIGNvbW1hbmQgd2lsbCBhbGxvdyBjaG9vc2luZyB3aGljaCBmaWxlIHRvIGNvbXBhcmUuIFRoZSBmaWxlIGZlYXR1cmUgcmVxdWlyZXMgdGhlICdzcGxpdC1kaWZmJyBwYWNrYWdlIHRvIGJlIGluc3RhbGxlZC5cIlxuICAgICAgYXV0b0ZldGNoOlxuICAgICAgICBvcmRlcjogM1xuICAgICAgICB0aXRsZTogXCJBdXRvLWZldGNoXCJcbiAgICAgICAgdHlwZTogXCJpbnRlZ2VyXCJcbiAgICAgICAgZGVmYXVsdDogMFxuICAgICAgICBtYXhpbXVtOiA2MFxuICAgICAgICBkZXNjcmlwdGlvbjogXCJBdXRvbWF0aWNhbGx5IGZldGNoIHJlbW90ZSByZXBvc2l0b3JpZXMgZXZlcnkgYHhgIG1pbnV0ZXMgKGAwYCB3aWxsIGRpc2FibGUgdGhpcyBmZWF0dXJlKVwiXG4gICAgICBhdXRvRmV0Y2hOb3RpZnk6XG4gICAgICAgIG9yZGVyOiA0XG4gICAgICAgIHRpdGxlOiBcIkF1dG8tZmV0Y2ggbm90aWZpY2F0aW9uXCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgZGVzY3JpcHRpb246IFwiU2hvdyBub3RpZmljYXRpb25zIHdoaWxlIHJ1bm5pbmcgYGZldGNoIC0tYWxsYD9cIlxuIl19
