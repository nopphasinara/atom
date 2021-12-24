(function() {
  module.exports = {
    autoDiff: {
      title: 'Auto Diff',
      description: 'Automatically recalculates the diff when one of the editors changes.',
      type: 'boolean',
      "default": true,
      order: 1
    },
    diffWords: {
      title: 'Show Word Diff',
      description: 'Diffs the words between each line when this box is checked.',
      type: 'boolean',
      "default": true,
      order: 2
    },
    ignoreWhitespace: {
      title: 'Ignore Whitespace',
      description: 'Will not diff whitespace when this box is checked.',
      type: 'boolean',
      "default": false,
      order: 3
    },
    turnOffSoftWrap: {
      title: 'Remove Soft Wrap',
      description: 'Removes soft wrap during diff - restores when finished.',
      type: 'boolean',
      "default": false,
      order: 4
    },
    muteNotifications: {
      title: 'Mute Notifications',
      description: 'Mutes all warning notifications when this box is checked.',
      type: 'boolean',
      "default": false,
      order: 5
    },
    hideDocks: {
      title: 'Hide Docks',
      description: 'Hides all docks (Tree View, Github, etc) during diff - shows when finished.',
      type: 'boolean',
      "default": false,
      order: 6
    },
    scrollSyncType: {
      title: 'Sync Scrolling',
      description: 'Syncs the scrolling of the editors.',
      type: 'string',
      "default": 'Vertical + Horizontal',
      "enum": ['Vertical + Horizontal', 'Vertical', 'None'],
      order: 7
    },
    colors: {
      type: 'object',
      properties: {
        addedColorSide: {
          title: 'Added Color Side',
          description: 'The side that the latest version of the file is on. The added color will be applied to this editor and the removed color will be opposite.',
          type: 'string',
          "default": 'left',
          "enum": ['left', 'right'],
          order: 1
        },
        overrideThemeColors: {
          title: 'Override Highlight Colors',
          description: 'Override the line highlight colors (defined by variables in your selected syntax theme) with the colors selected below.',
          type: 'boolean',
          "default": false,
          order: 2
        },
        addedColor: {
          title: 'Added Custom Color',
          description: 'The color that will be used for highlighting added lines when **Override Highlight Colors** is checked.',
          type: 'color',
          "default": 'green',
          order: 3
        },
        removedColor: {
          title: 'Removed Custom Color',
          description: 'The color that will be used for highlighting removed lines when **Override Highlight Colors** is checked.',
          type: 'color',
          "default": 'red',
          order: 4
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL3NwbGl0LWRpZmYvbGliL2NvbmZpZy1zY2hlbWEuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyxXQUFQO01BQ0EsV0FBQSxFQUFhLHNFQURiO01BRUEsSUFBQSxFQUFNLFNBRk47TUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBSFQ7TUFJQSxLQUFBLEVBQU8sQ0FKUDtLQURGO0lBTUEsU0FBQSxFQUNFO01BQUEsS0FBQSxFQUFPLGdCQUFQO01BQ0EsV0FBQSxFQUFhLDZEQURiO01BRUEsSUFBQSxFQUFNLFNBRk47TUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBSFQ7TUFJQSxLQUFBLEVBQU8sQ0FKUDtLQVBGO0lBWUEsZ0JBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyxtQkFBUDtNQUNBLFdBQUEsRUFBYSxvREFEYjtNQUVBLElBQUEsRUFBTSxTQUZOO01BR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUhUO01BSUEsS0FBQSxFQUFPLENBSlA7S0FiRjtJQWtCQSxlQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sa0JBQVA7TUFDQSxXQUFBLEVBQWEseURBRGI7TUFFQSxJQUFBLEVBQU0sU0FGTjtNQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FIVDtNQUlBLEtBQUEsRUFBTyxDQUpQO0tBbkJGO0lBd0JBLGlCQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sb0JBQVA7TUFDQSxXQUFBLEVBQWEsMkRBRGI7TUFFQSxJQUFBLEVBQU0sU0FGTjtNQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FIVDtNQUlBLEtBQUEsRUFBTyxDQUpQO0tBekJGO0lBOEJBLFNBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyxZQUFQO01BQ0EsV0FBQSxFQUFhLDZFQURiO01BRUEsSUFBQSxFQUFNLFNBRk47TUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBSFQ7TUFJQSxLQUFBLEVBQU8sQ0FKUDtLQS9CRjtJQW9DQSxjQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sZ0JBQVA7TUFDQSxXQUFBLEVBQWEscUNBRGI7TUFFQSxJQUFBLEVBQU0sUUFGTjtNQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsdUJBSFQ7TUFJQSxDQUFBLElBQUEsQ0FBQSxFQUFNLENBQUMsdUJBQUQsRUFBMEIsVUFBMUIsRUFBc0MsTUFBdEMsQ0FKTjtNQUtBLEtBQUEsRUFBTyxDQUxQO0tBckNGO0lBMkNBLE1BQUEsRUFDRTtNQUFBLElBQUEsRUFBTSxRQUFOO01BQ0EsVUFBQSxFQUNFO1FBQUEsY0FBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLGtCQUFQO1VBQ0EsV0FBQSxFQUFhLDRJQURiO1VBRUEsSUFBQSxFQUFNLFFBRk47VUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLE1BSFQ7VUFJQSxDQUFBLElBQUEsQ0FBQSxFQUFNLENBQUMsTUFBRCxFQUFTLE9BQVQsQ0FKTjtVQUtBLEtBQUEsRUFBTyxDQUxQO1NBREY7UUFPQSxtQkFBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLDJCQUFQO1VBQ0EsV0FBQSxFQUFhLHlIQURiO1VBRUEsSUFBQSxFQUFNLFNBRk47VUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBSFQ7VUFJQSxLQUFBLEVBQU8sQ0FKUDtTQVJGO1FBYUEsVUFBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLG9CQUFQO1VBQ0EsV0FBQSxFQUFhLHlHQURiO1VBRUEsSUFBQSxFQUFNLE9BRk47VUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLE9BSFQ7VUFJQSxLQUFBLEVBQU8sQ0FKUDtTQWRGO1FBbUJBLFlBQUEsRUFDRTtVQUFBLEtBQUEsRUFBTyxzQkFBUDtVQUNBLFdBQUEsRUFBYSwyR0FEYjtVQUVBLElBQUEsRUFBTSxPQUZOO1VBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUhUO1VBSUEsS0FBQSxFQUFPLENBSlA7U0FwQkY7T0FGRjtLQTVDRjs7QUFERiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID1cbiAgYXV0b0RpZmY6XG4gICAgdGl0bGU6ICdBdXRvIERpZmYnXG4gICAgZGVzY3JpcHRpb246ICdBdXRvbWF0aWNhbGx5IHJlY2FsY3VsYXRlcyB0aGUgZGlmZiB3aGVuIG9uZSBvZiB0aGUgZWRpdG9ycyBjaGFuZ2VzLidcbiAgICB0eXBlOiAnYm9vbGVhbidcbiAgICBkZWZhdWx0OiB0cnVlXG4gICAgb3JkZXI6IDFcbiAgZGlmZldvcmRzOlxuICAgIHRpdGxlOiAnU2hvdyBXb3JkIERpZmYnXG4gICAgZGVzY3JpcHRpb246ICdEaWZmcyB0aGUgd29yZHMgYmV0d2VlbiBlYWNoIGxpbmUgd2hlbiB0aGlzIGJveCBpcyBjaGVja2VkLidcbiAgICB0eXBlOiAnYm9vbGVhbidcbiAgICBkZWZhdWx0OiB0cnVlXG4gICAgb3JkZXI6IDJcbiAgaWdub3JlV2hpdGVzcGFjZTpcbiAgICB0aXRsZTogJ0lnbm9yZSBXaGl0ZXNwYWNlJ1xuICAgIGRlc2NyaXB0aW9uOiAnV2lsbCBub3QgZGlmZiB3aGl0ZXNwYWNlIHdoZW4gdGhpcyBib3ggaXMgY2hlY2tlZC4nXG4gICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgZGVmYXVsdDogZmFsc2VcbiAgICBvcmRlcjogM1xuICB0dXJuT2ZmU29mdFdyYXA6XG4gICAgdGl0bGU6ICdSZW1vdmUgU29mdCBXcmFwJ1xuICAgIGRlc2NyaXB0aW9uOiAnUmVtb3ZlcyBzb2Z0IHdyYXAgZHVyaW5nIGRpZmYgLSByZXN0b3JlcyB3aGVuIGZpbmlzaGVkLidcbiAgICB0eXBlOiAnYm9vbGVhbidcbiAgICBkZWZhdWx0OiBmYWxzZVxuICAgIG9yZGVyOiA0XG4gIG11dGVOb3RpZmljYXRpb25zOlxuICAgIHRpdGxlOiAnTXV0ZSBOb3RpZmljYXRpb25zJ1xuICAgIGRlc2NyaXB0aW9uOiAnTXV0ZXMgYWxsIHdhcm5pbmcgbm90aWZpY2F0aW9ucyB3aGVuIHRoaXMgYm94IGlzIGNoZWNrZWQuJ1xuICAgIHR5cGU6ICdib29sZWFuJ1xuICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgb3JkZXI6IDVcbiAgaGlkZURvY2tzOlxuICAgIHRpdGxlOiAnSGlkZSBEb2NrcydcbiAgICBkZXNjcmlwdGlvbjogJ0hpZGVzIGFsbCBkb2NrcyAoVHJlZSBWaWV3LCBHaXRodWIsIGV0YykgZHVyaW5nIGRpZmYgLSBzaG93cyB3aGVuIGZpbmlzaGVkLidcbiAgICB0eXBlOiAnYm9vbGVhbidcbiAgICBkZWZhdWx0OiBmYWxzZVxuICAgIG9yZGVyOiA2XG4gIHNjcm9sbFN5bmNUeXBlOlxuICAgIHRpdGxlOiAnU3luYyBTY3JvbGxpbmcnXG4gICAgZGVzY3JpcHRpb246ICdTeW5jcyB0aGUgc2Nyb2xsaW5nIG9mIHRoZSBlZGl0b3JzLidcbiAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIGRlZmF1bHQ6ICdWZXJ0aWNhbCArIEhvcml6b250YWwnXG4gICAgZW51bTogWydWZXJ0aWNhbCArIEhvcml6b250YWwnLCAnVmVydGljYWwnLCAnTm9uZSddXG4gICAgb3JkZXI6IDdcbiAgY29sb3JzOlxuICAgIHR5cGU6ICdvYmplY3QnXG4gICAgcHJvcGVydGllczpcbiAgICAgIGFkZGVkQ29sb3JTaWRlOlxuICAgICAgICB0aXRsZTogJ0FkZGVkIENvbG9yIFNpZGUnXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIHNpZGUgdGhhdCB0aGUgbGF0ZXN0IHZlcnNpb24gb2YgdGhlIGZpbGUgaXMgb24uIFRoZSBhZGRlZCBjb2xvciB3aWxsIGJlIGFwcGxpZWQgdG8gdGhpcyBlZGl0b3IgYW5kIHRoZSByZW1vdmVkIGNvbG9yIHdpbGwgYmUgb3Bwb3NpdGUuJ1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICBkZWZhdWx0OiAnbGVmdCdcbiAgICAgICAgZW51bTogWydsZWZ0JywgJ3JpZ2h0J11cbiAgICAgICAgb3JkZXI6IDFcbiAgICAgIG92ZXJyaWRlVGhlbWVDb2xvcnM6XG4gICAgICAgIHRpdGxlOiAnT3ZlcnJpZGUgSGlnaGxpZ2h0IENvbG9ycydcbiAgICAgICAgZGVzY3JpcHRpb246ICdPdmVycmlkZSB0aGUgbGluZSBoaWdobGlnaHQgY29sb3JzIChkZWZpbmVkIGJ5IHZhcmlhYmxlcyBpbiB5b3VyIHNlbGVjdGVkIHN5bnRheCB0aGVtZSkgd2l0aCB0aGUgY29sb3JzIHNlbGVjdGVkIGJlbG93LidcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIG9yZGVyOiAyXG4gICAgICBhZGRlZENvbG9yOlxuICAgICAgICB0aXRsZTogJ0FkZGVkIEN1c3RvbSBDb2xvcidcbiAgICAgICAgZGVzY3JpcHRpb246ICdUaGUgY29sb3IgdGhhdCB3aWxsIGJlIHVzZWQgZm9yIGhpZ2hsaWdodGluZyBhZGRlZCBsaW5lcyB3aGVuICoqT3ZlcnJpZGUgSGlnaGxpZ2h0IENvbG9ycyoqIGlzIGNoZWNrZWQuJ1xuICAgICAgICB0eXBlOiAnY29sb3InXG4gICAgICAgIGRlZmF1bHQ6ICdncmVlbidcbiAgICAgICAgb3JkZXI6IDNcbiAgICAgIHJlbW92ZWRDb2xvcjpcbiAgICAgICAgdGl0bGU6ICdSZW1vdmVkIEN1c3RvbSBDb2xvcidcbiAgICAgICAgZGVzY3JpcHRpb246ICdUaGUgY29sb3IgdGhhdCB3aWxsIGJlIHVzZWQgZm9yIGhpZ2hsaWdodGluZyByZW1vdmVkIGxpbmVzIHdoZW4gKipPdmVycmlkZSBIaWdobGlnaHQgQ29sb3JzKiogaXMgY2hlY2tlZC4nXG4gICAgICAgIHR5cGU6ICdjb2xvcidcbiAgICAgICAgZGVmYXVsdDogJ3JlZCdcbiAgICAgICAgb3JkZXI6IDRcbiJdfQ==
