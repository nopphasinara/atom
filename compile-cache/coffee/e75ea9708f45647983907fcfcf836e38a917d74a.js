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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9zcGxpdC1kaWZmL2xpYi9jb25maWctc2NoZW1hLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxRQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sV0FBUDtNQUNBLFdBQUEsRUFBYSxzRUFEYjtNQUVBLElBQUEsRUFBTSxTQUZOO01BR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUhUO01BSUEsS0FBQSxFQUFPLENBSlA7S0FERjtJQU1BLFNBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyxnQkFBUDtNQUNBLFdBQUEsRUFBYSw2REFEYjtNQUVBLElBQUEsRUFBTSxTQUZOO01BR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUhUO01BSUEsS0FBQSxFQUFPLENBSlA7S0FQRjtJQVlBLGdCQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sbUJBQVA7TUFDQSxXQUFBLEVBQWEsb0RBRGI7TUFFQSxJQUFBLEVBQU0sU0FGTjtNQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FIVDtNQUlBLEtBQUEsRUFBTyxDQUpQO0tBYkY7SUFrQkEsZUFBQSxFQUNFO01BQUEsS0FBQSxFQUFPLGtCQUFQO01BQ0EsV0FBQSxFQUFhLHlEQURiO01BRUEsSUFBQSxFQUFNLFNBRk47TUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBSFQ7TUFJQSxLQUFBLEVBQU8sQ0FKUDtLQW5CRjtJQXdCQSxpQkFBQSxFQUNFO01BQUEsS0FBQSxFQUFPLG9CQUFQO01BQ0EsV0FBQSxFQUFhLDJEQURiO01BRUEsSUFBQSxFQUFNLFNBRk47TUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBSFQ7TUFJQSxLQUFBLEVBQU8sQ0FKUDtLQXpCRjtJQThCQSxTQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sWUFBUDtNQUNBLFdBQUEsRUFBYSw2RUFEYjtNQUVBLElBQUEsRUFBTSxTQUZOO01BR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUhUO01BSUEsS0FBQSxFQUFPLENBSlA7S0EvQkY7SUFvQ0EsY0FBQSxFQUNFO01BQUEsS0FBQSxFQUFPLGdCQUFQO01BQ0EsV0FBQSxFQUFhLHFDQURiO01BRUEsSUFBQSxFQUFNLFFBRk47TUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLHVCQUhUO01BSUEsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLHVCQUFELEVBQTBCLFVBQTFCLEVBQXNDLE1BQXRDLENBSk47TUFLQSxLQUFBLEVBQU8sQ0FMUDtLQXJDRjtJQTJDQSxNQUFBLEVBQ0U7TUFBQSxJQUFBLEVBQU0sUUFBTjtNQUNBLFVBQUEsRUFDRTtRQUFBLGNBQUEsRUFDRTtVQUFBLEtBQUEsRUFBTyxrQkFBUDtVQUNBLFdBQUEsRUFBYSw0SUFEYjtVQUVBLElBQUEsRUFBTSxRQUZOO1VBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxNQUhUO1VBSUEsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLE1BQUQsRUFBUyxPQUFULENBSk47VUFLQSxLQUFBLEVBQU8sQ0FMUDtTQURGO1FBT0EsbUJBQUEsRUFDRTtVQUFBLEtBQUEsRUFBTywyQkFBUDtVQUNBLFdBQUEsRUFBYSx5SEFEYjtVQUVBLElBQUEsRUFBTSxTQUZOO1VBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUhUO1VBSUEsS0FBQSxFQUFPLENBSlA7U0FSRjtRQWFBLFVBQUEsRUFDRTtVQUFBLEtBQUEsRUFBTyxvQkFBUDtVQUNBLFdBQUEsRUFBYSx5R0FEYjtVQUVBLElBQUEsRUFBTSxPQUZOO1VBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxPQUhUO1VBSUEsS0FBQSxFQUFPLENBSlA7U0FkRjtRQW1CQSxZQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sc0JBQVA7VUFDQSxXQUFBLEVBQWEsMkdBRGI7VUFFQSxJQUFBLEVBQU0sT0FGTjtVQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FIVDtVQUlBLEtBQUEsRUFBTyxDQUpQO1NBcEJGO09BRkY7S0E1Q0Y7O0FBREYiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG4gIGF1dG9EaWZmOlxuICAgIHRpdGxlOiAnQXV0byBEaWZmJ1xuICAgIGRlc2NyaXB0aW9uOiAnQXV0b21hdGljYWxseSByZWNhbGN1bGF0ZXMgdGhlIGRpZmYgd2hlbiBvbmUgb2YgdGhlIGVkaXRvcnMgY2hhbmdlcy4nXG4gICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgZGVmYXVsdDogdHJ1ZVxuICAgIG9yZGVyOiAxXG4gIGRpZmZXb3JkczpcbiAgICB0aXRsZTogJ1Nob3cgV29yZCBEaWZmJ1xuICAgIGRlc2NyaXB0aW9uOiAnRGlmZnMgdGhlIHdvcmRzIGJldHdlZW4gZWFjaCBsaW5lIHdoZW4gdGhpcyBib3ggaXMgY2hlY2tlZC4nXG4gICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgZGVmYXVsdDogdHJ1ZVxuICAgIG9yZGVyOiAyXG4gIGlnbm9yZVdoaXRlc3BhY2U6XG4gICAgdGl0bGU6ICdJZ25vcmUgV2hpdGVzcGFjZSdcbiAgICBkZXNjcmlwdGlvbjogJ1dpbGwgbm90IGRpZmYgd2hpdGVzcGFjZSB3aGVuIHRoaXMgYm94IGlzIGNoZWNrZWQuJ1xuICAgIHR5cGU6ICdib29sZWFuJ1xuICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgb3JkZXI6IDNcbiAgdHVybk9mZlNvZnRXcmFwOlxuICAgIHRpdGxlOiAnUmVtb3ZlIFNvZnQgV3JhcCdcbiAgICBkZXNjcmlwdGlvbjogJ1JlbW92ZXMgc29mdCB3cmFwIGR1cmluZyBkaWZmIC0gcmVzdG9yZXMgd2hlbiBmaW5pc2hlZC4nXG4gICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgZGVmYXVsdDogZmFsc2VcbiAgICBvcmRlcjogNFxuICBtdXRlTm90aWZpY2F0aW9uczpcbiAgICB0aXRsZTogJ011dGUgTm90aWZpY2F0aW9ucydcbiAgICBkZXNjcmlwdGlvbjogJ011dGVzIGFsbCB3YXJuaW5nIG5vdGlmaWNhdGlvbnMgd2hlbiB0aGlzIGJveCBpcyBjaGVja2VkLidcbiAgICB0eXBlOiAnYm9vbGVhbidcbiAgICBkZWZhdWx0OiBmYWxzZVxuICAgIG9yZGVyOiA1XG4gIGhpZGVEb2NrczpcbiAgICB0aXRsZTogJ0hpZGUgRG9ja3MnXG4gICAgZGVzY3JpcHRpb246ICdIaWRlcyBhbGwgZG9ja3MgKFRyZWUgVmlldywgR2l0aHViLCBldGMpIGR1cmluZyBkaWZmIC0gc2hvd3Mgd2hlbiBmaW5pc2hlZC4nXG4gICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgZGVmYXVsdDogZmFsc2VcbiAgICBvcmRlcjogNlxuICBzY3JvbGxTeW5jVHlwZTpcbiAgICB0aXRsZTogJ1N5bmMgU2Nyb2xsaW5nJ1xuICAgIGRlc2NyaXB0aW9uOiAnU3luY3MgdGhlIHNjcm9sbGluZyBvZiB0aGUgZWRpdG9ycy4nXG4gICAgdHlwZTogJ3N0cmluZydcbiAgICBkZWZhdWx0OiAnVmVydGljYWwgKyBIb3Jpem9udGFsJ1xuICAgIGVudW06IFsnVmVydGljYWwgKyBIb3Jpem9udGFsJywgJ1ZlcnRpY2FsJywgJ05vbmUnXVxuICAgIG9yZGVyOiA3XG4gIGNvbG9yczpcbiAgICB0eXBlOiAnb2JqZWN0J1xuICAgIHByb3BlcnRpZXM6XG4gICAgICBhZGRlZENvbG9yU2lkZTpcbiAgICAgICAgdGl0bGU6ICdBZGRlZCBDb2xvciBTaWRlJ1xuICAgICAgICBkZXNjcmlwdGlvbjogJ1RoZSBzaWRlIHRoYXQgdGhlIGxhdGVzdCB2ZXJzaW9uIG9mIHRoZSBmaWxlIGlzIG9uLiBUaGUgYWRkZWQgY29sb3Igd2lsbCBiZSBhcHBsaWVkIHRvIHRoaXMgZWRpdG9yIGFuZCB0aGUgcmVtb3ZlZCBjb2xvciB3aWxsIGJlIG9wcG9zaXRlLidcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgZGVmYXVsdDogJ2xlZnQnXG4gICAgICAgIGVudW06IFsnbGVmdCcsICdyaWdodCddXG4gICAgICAgIG9yZGVyOiAxXG4gICAgICBvdmVycmlkZVRoZW1lQ29sb3JzOlxuICAgICAgICB0aXRsZTogJ092ZXJyaWRlIEhpZ2hsaWdodCBDb2xvcnMnXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnT3ZlcnJpZGUgdGhlIGxpbmUgaGlnaGxpZ2h0IGNvbG9ycyAoZGVmaW5lZCBieSB2YXJpYWJsZXMgaW4geW91ciBzZWxlY3RlZCBzeW50YXggdGhlbWUpIHdpdGggdGhlIGNvbG9ycyBzZWxlY3RlZCBiZWxvdy4nXG4gICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICBvcmRlcjogMlxuICAgICAgYWRkZWRDb2xvcjpcbiAgICAgICAgdGl0bGU6ICdBZGRlZCBDdXN0b20gQ29sb3InXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGNvbG9yIHRoYXQgd2lsbCBiZSB1c2VkIGZvciBoaWdobGlnaHRpbmcgYWRkZWQgbGluZXMgd2hlbiAqKk92ZXJyaWRlIEhpZ2hsaWdodCBDb2xvcnMqKiBpcyBjaGVja2VkLidcbiAgICAgICAgdHlwZTogJ2NvbG9yJ1xuICAgICAgICBkZWZhdWx0OiAnZ3JlZW4nXG4gICAgICAgIG9yZGVyOiAzXG4gICAgICByZW1vdmVkQ29sb3I6XG4gICAgICAgIHRpdGxlOiAnUmVtb3ZlZCBDdXN0b20gQ29sb3InXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGNvbG9yIHRoYXQgd2lsbCBiZSB1c2VkIGZvciBoaWdobGlnaHRpbmcgcmVtb3ZlZCBsaW5lcyB3aGVuICoqT3ZlcnJpZGUgSGlnaGxpZ2h0IENvbG9ycyoqIGlzIGNoZWNrZWQuJ1xuICAgICAgICB0eXBlOiAnY29sb3InXG4gICAgICAgIGRlZmF1bHQ6ICdyZWQnXG4gICAgICAgIG9yZGVyOiA0XG4iXX0=
