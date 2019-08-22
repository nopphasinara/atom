(function() {
  module.exports = {
    makeAsciidocBlocks: function(languages, debug) {
      var codeBlocks;
      if (debug == null) {
        debug = false;
      }
      codeBlocks = languages.map(function(lang) {
        return {
          name: "markup.code." + lang.code + ".asciidoc",
          begin: "(?=(?>(?:^\\[(source)(?:,|#)\\p{Blank}*(?i:(" + lang.pattern + "))((?:,|#)[^\\]]+)*\\]$)))",
          patterns: [
            {
              match: "^\\[(source)(?:,|#)\\p{Blank}*(?i:(" + lang.pattern + "))((?:,|#)([^,\\]]+))*\\]$",
              captures: {
                0: {
                  name: 'markup.heading.asciidoc',
                  patterns: [
                    {
                      include: '#block-attribute-inner'
                    }
                  ]
                }
              }
            }, {
              include: '#inlines'
            }, {
              include: '#block-title'
            }, {
              comment: 'listing block',
              begin: '^(-{4,})\\s*$',
              contentName: lang.type + ".embedded." + lang.code,
              patterns: [
                {
                  include: '#block-callout'
                }, {
                  include: '#include-directive'
                }, {
                  include: lang.type + "." + lang.code
                }
              ],
              end: '^(\\1)$'
            }, {
              comment: 'open block',
              begin: '^(-{2})\\s*$',
              contentName: lang.type + ".embedded." + lang.code,
              patterns: [
                {
                  include: '#block-callout'
                }, {
                  include: '#include-directive'
                }, {
                  include: lang.type + "." + lang.code
                }
              ],
              end: '^(\\1)$'
            }, {
              comment: 'literal block',
              begin: '^(\\.{4})\\s*$',
              contentName: lang.type + ".embedded." + lang.code,
              patterns: [
                {
                  include: '#block-callout'
                }, {
                  include: '#include-directive'
                }, {
                  include: lang.type + "." + lang.code
                }
              ],
              end: '^(\\1)$'
            }
          ],
          end: '((?<=--|\\.\\.\\.\\.)$|^\\p{Blank}*$)'
        };
      });
      codeBlocks.push({
        begin: '(?=(?>(?:^\\[(source)((?:,|#)[^\\]]+)*\\]$)))',
        patterns: [
          {
            match: '^\\[(source)((?:,|#)([^,\\]]+))*\\]$',
            captures: {
              0: {
                name: 'markup.heading.asciidoc',
                patterns: [
                  {
                    include: '#block-attribute-inner'
                  }
                ]
              }
            }
          }, {
            include: '#inlines'
          }, {
            include: '#block-title'
          }, {
            comment: 'listing block',
            name: 'markup.raw.asciidoc',
            begin: '^(-{4,})\\s*$',
            patterns: [
              {
                include: '#block-callout'
              }, {
                include: '#include-directive'
              }
            ],
            end: '^(\\1)$'
          }, {
            comment: 'open block',
            name: 'markup.raw.asciidoc',
            begin: '^(-{2})\\s*$',
            patterns: [
              {
                include: '#block-callout'
              }, {
                include: '#include-directive'
              }
            ],
            end: '^(\\1)$'
          }, {
            comment: 'literal block',
            name: 'markup.raw.asciidoc',
            begin: '^(\\.{4})\\s*$',
            patterns: [
              {
                include: '#block-callout'
              }, {
                include: '#include-directive'
              }
            ],
            end: '^(\\1)$'
          }
        ],
        end: '((?<=--|\\.\\.\\.\\.)$|^\\p{Blank}*$)'
      });
      codeBlocks.push({
        name: 'markup.raw.asciidoc',
        begin: '^(-{4,})\\s*$',
        beginCaptures: {
          0: {
            name: 'support.asciidoc'
          }
        },
        patterns: [
          {
            include: '#block-callout'
          }, {
            include: '#include-directive'
          }
        ],
        end: '^(\\1)$',
        endCaptures: {
          0: {
            name: 'support.asciidoc'
          }
        }
      });
      if (debug) {
        console.log(CSON.stringify(codeBlocks));
      }
      return codeBlocks;
    },
    makeMarkdownBlocks: function(languages, debug) {
      var codeBlocks;
      if (debug == null) {
        debug = false;
      }
      codeBlocks = languages.map(function(lang) {
        return {
          name: "markup.code." + lang.code + ".asciidoc",
          begin: "^\\s*(`{3,})\\s*(?i:(" + lang.pattern + "))\\s*$",
          beginCaptures: {
            0: {
              name: 'support.asciidoc'
            }
          },
          contentName: lang.type + ".embedded." + lang.code,
          patterns: [
            {
              include: '#block-callout'
            }, {
              include: lang.type + "." + lang.code
            }
          ],
          end: '^\\s*\\1\\s*$',
          endCaptures: {
            0: {
              name: 'support.asciidoc'
            }
          }
        };
      });
      codeBlocks.push({
        name: 'markup.raw.asciidoc',
        begin: '^\\s*(`{3,}).*$',
        beginCaptures: {
          0: {
            name: 'support.asciidoc'
          }
        },
        patterns: [
          {
            include: '#block-callout'
          }
        ],
        end: '^\\s*\\1\\s*$',
        endCaptures: {
          0: {
            name: 'support.asciidoc'
          }
        }
      });
      if (debug) {
        console.log(CSON.stringify(codeBlocks));
      }
      return codeBlocks;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1hc2NpaWRvYy9saWIvY29kZS1ibG9jay1nZW5lcmF0b3IuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FFRTtJQUFBLGtCQUFBLEVBQW9CLFNBQUMsU0FBRCxFQUFZLEtBQVo7QUFFbEIsVUFBQTs7UUFGOEIsUUFBUTs7TUFFdEMsVUFBQSxHQUFhLFNBQVMsQ0FBQyxHQUFWLENBQWMsU0FBQyxJQUFEO2VBQ3pCO1VBQUEsSUFBQSxFQUFNLGNBQUEsR0FBZSxJQUFJLENBQUMsSUFBcEIsR0FBeUIsV0FBL0I7VUFDQSxLQUFBLEVBQU8sOENBQUEsR0FBK0MsSUFBSSxDQUFDLE9BQXBELEdBQTRELDRCQURuRTtVQUVBLFFBQUEsRUFBVTtZQUNSO2NBQUEsS0FBQSxFQUFPLHFDQUFBLEdBQXNDLElBQUksQ0FBQyxPQUEzQyxHQUFtRCw0QkFBMUQ7Y0FDQSxRQUFBLEVBQ0U7Z0JBQUEsQ0FBQSxFQUNFO2tCQUFBLElBQUEsRUFBTSx5QkFBTjtrQkFDQSxRQUFBLEVBQVU7b0JBQ1I7c0JBQUEsT0FBQSxFQUFTLHdCQUFUO3FCQURRO21CQURWO2lCQURGO2VBRkY7YUFEUSxFQVNSO2NBQUEsT0FBQSxFQUFTLFVBQVQ7YUFUUSxFQVdSO2NBQUEsT0FBQSxFQUFTLGNBQVQ7YUFYUSxFQWFSO2NBQUEsT0FBQSxFQUFTLGVBQVQ7Y0FDQSxLQUFBLEVBQU8sZUFEUDtjQUVBLFdBQUEsRUFBZ0IsSUFBSSxDQUFDLElBQU4sR0FBVyxZQUFYLEdBQXVCLElBQUksQ0FBQyxJQUYzQztjQUdBLFFBQUEsRUFBVTtnQkFDUjtrQkFBQSxPQUFBLEVBQVMsZ0JBQVQ7aUJBRFEsRUFHUjtrQkFBQSxPQUFBLEVBQVMsb0JBQVQ7aUJBSFEsRUFLUjtrQkFBQSxPQUFBLEVBQVksSUFBSSxDQUFDLElBQU4sR0FB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Q0FBQSxFQUFHO1lBQUEsSUFBQSxFQUFNLGtCQUFOO1dBQUg7U0FURjtPQURGO01BWUEsSUFBRyxLQUFIO1FBQWMsT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFJLENBQUMsU0FBTCxDQUFlLFVBQWYsQ0FBWixFQUFkOzthQUNBO0lBL0JrQixDQTFIcEI7O0FBRkYiLCJzb3VyY2VzQ29udGVudCI6WyIjIENvZGUgYmxvY2tzIGdlbmVyYXRvclxubW9kdWxlLmV4cG9ydHMgPVxuXG4gIG1ha2VBc2NpaWRvY0Jsb2NrczogKGxhbmd1YWdlcywgZGVidWcgPSBmYWxzZSkgLT5cbiAgICAjIGFkZCBsYW5ndWFnZXMgYmxvY2tzXG4gICAgY29kZUJsb2NrcyA9IGxhbmd1YWdlcy5tYXAgKGxhbmcpIC0+XG4gICAgICBuYW1lOiBcIm1hcmt1cC5jb2RlLiN7bGFuZy5jb2RlfS5hc2NpaWRvY1wiXG4gICAgICBiZWdpbjogXCIoPz0oPz4oPzpeXFxcXFsoc291cmNlKSg/Oix8IylcXFxccHtCbGFua30qKD9pOigje2xhbmcucGF0dGVybn0pKSgoPzosfCMpW15cXFxcXV0rKSpcXFxcXSQpKSlcIlxuICAgICAgcGF0dGVybnM6IFtcbiAgICAgICAgbWF0Y2g6IFwiXlxcXFxbKHNvdXJjZSkoPzosfCMpXFxcXHB7Qmxhbmt9Kig/aTooI3tsYW5nLnBhdHRlcm59KSkoKD86LHwjKShbXixcXFxcXV0rKSkqXFxcXF0kXCJcbiAgICAgICAgY2FwdHVyZXM6XG4gICAgICAgICAgMDpcbiAgICAgICAgICAgIG5hbWU6ICdtYXJrdXAuaGVhZGluZy5hc2NpaWRvYydcbiAgICAgICAgICAgIHBhdHRlcm5zOiBbXG4gICAgICAgICAgICAgIGluY2x1ZGU6ICcjYmxvY2stYXR0cmlidXRlLWlubmVyJ1xuICAgICAgICAgICAgXVxuICAgICAgLFxuICAgICAgICBpbmNsdWRlOiAnI2lubGluZXMnXG4gICAgICAsXG4gICAgICAgIGluY2x1ZGU6ICcjYmxvY2stdGl0bGUnXG4gICAgICAsXG4gICAgICAgIGNvbW1lbnQ6ICdsaXN0aW5nIGJsb2NrJ1xuICAgICAgICBiZWdpbjogJ14oLXs0LH0pXFxcXHMqJCdcbiAgICAgICAgY29udGVudE5hbWU6IFwiI3tsYW5nLnR5cGV9LmVtYmVkZGVkLiN7bGFuZy5jb2RlfVwiXG4gICAgICAgIHBhdHRlcm5zOiBbXG4gICAgICAgICAgaW5jbHVkZTogJyNibG9jay1jYWxsb3V0J1xuICAgICAgICAsXG4gICAgICAgICAgaW5jbHVkZTogJyNpbmNsdWRlLWRpcmVjdGl2ZSdcbiAgICAgICAgLFxuICAgICAgICAgIGluY2x1ZGU6IFwiI3tsYW5nLnR5cGV9LiN7bGFuZy5jb2RlfVwiXG4gICAgICAgIF1cbiAgICAgICAgZW5kOiAnXihcXFxcMSkkJ1xuICAgICAgLFxuICAgICAgICBjb21tZW50OiAnb3BlbiBibG9jaydcbiAgICAgICAgYmVnaW46ICdeKC17Mn0pXFxcXHMqJCdcbiAgICAgICAgY29udGVudE5hbWU6IFwiI3tsYW5nLnR5cGV9LmVtYmVkZGVkLiN7bGFuZy5jb2RlfVwiXG4gICAgICAgIHBhdHRlcm5zOiBbXG4gICAgICAgICAgaW5jbHVkZTogJyNibG9jay1jYWxsb3V0J1xuICAgICAgICAsXG4gICAgICAgICAgaW5jbHVkZTogJyNpbmNsdWRlLWRpcmVjdGl2ZSdcbiAgICAgICAgLFxuICAgICAgICAgIGluY2x1ZGU6IFwiI3tsYW5nLnR5cGV9LiN7bGFuZy5jb2RlfVwiXG4gICAgICAgIF1cbiAgICAgICAgZW5kOiAnXihcXFxcMSkkJ1xuICAgICAgLFxuICAgICAgICBjb21tZW50OiAnbGl0ZXJhbCBibG9jaydcbiAgICAgICAgYmVnaW46ICdeKFxcXFwuezR9KVxcXFxzKiQnXG4gICAgICAgIGNvbnRlbnROYW1lOiBcIiN7bGFuZy50eXBlfS5lbWJlZGRlZC4je2xhbmcuY29kZX1cIlxuICAgICAgICBwYXR0ZXJuczogW1xuICAgICAgICAgIGluY2x1ZGU6ICcjYmxvY2stY2FsbG91dCdcbiAgICAgICAgLFxuICAgICAgICAgIGluY2x1ZGU6ICcjaW5jbHVkZS1kaXJlY3RpdmUnXG4gICAgICAgICxcbiAgICAgICAgICBpbmNsdWRlOiBcIiN7bGFuZy50eXBlfS4je2xhbmcuY29kZX1cIlxuICAgICAgICBdXG4gICAgICAgIGVuZDogJ14oXFxcXDEpJCdcbiAgICAgIF1cbiAgICAgIGVuZDogJygoPzw9LS18XFxcXC5cXFxcLlxcXFwuXFxcXC4pJHxeXFxcXHB7Qmxhbmt9KiQpJ1xuXG4gICAgIyBhZGQgZ2VuZXJpYyBibG9ja1xuICAgIGNvZGVCbG9ja3MucHVzaFxuICAgICAgYmVnaW46ICcoPz0oPz4oPzpeXFxcXFsoc291cmNlKSgoPzosfCMpW15cXFxcXV0rKSpcXFxcXSQpKSknXG4gICAgICBwYXR0ZXJuczogW1xuICAgICAgICBtYXRjaDogJ15cXFxcWyhzb3VyY2UpKCg/Oix8IykoW14sXFxcXF1dKykpKlxcXFxdJCdcbiAgICAgICAgY2FwdHVyZXM6XG4gICAgICAgICAgMDpcbiAgICAgICAgICAgIG5hbWU6ICdtYXJrdXAuaGVhZGluZy5hc2NpaWRvYydcbiAgICAgICAgICAgIHBhdHRlcm5zOiBbXG4gICAgICAgICAgICAgIGluY2x1ZGU6ICcjYmxvY2stYXR0cmlidXRlLWlubmVyJ1xuICAgICAgICAgICAgXVxuICAgICAgLFxuICAgICAgICBpbmNsdWRlOiAnI2lubGluZXMnXG4gICAgICAsXG4gICAgICAgIGluY2x1ZGU6ICcjYmxvY2stdGl0bGUnXG4gICAgICAsXG4gICAgICAgIGNvbW1lbnQ6ICdsaXN0aW5nIGJsb2NrJ1xuICAgICAgICBuYW1lOiAnbWFya3VwLnJhdy5hc2NpaWRvYydcbiAgICAgICAgYmVnaW46ICdeKC17NCx9KVxcXFxzKiQnXG4gICAgICAgIHBhdHRlcm5zOiBbXG4gICAgICAgICAgaW5jbHVkZTogJyNibG9jay1jYWxsb3V0J1xuICAgICAgICAsXG4gICAgICAgICAgaW5jbHVkZTogJyNpbmNsdWRlLWRpcmVjdGl2ZSdcbiAgICAgICAgXVxuICAgICAgICBlbmQ6ICdeKFxcXFwxKSQnXG4gICAgICAsXG4gICAgICAgIGNvbW1lbnQ6ICdvcGVuIGJsb2NrJ1xuICAgICAgICBuYW1lOiAnbWFya3VwLnJhdy5hc2NpaWRvYydcbiAgICAgICAgYmVnaW46ICdeKC17Mn0pXFxcXHMqJCdcbiAgICAgICAgcGF0dGVybnM6IFtcbiAgICAgICAgICBpbmNsdWRlOiAnI2Jsb2NrLWNhbGxvdXQnXG4gICAgICAgICxcbiAgICAgICAgICBpbmNsdWRlOiAnI2luY2x1ZGUtZGlyZWN0aXZlJ1xuICAgICAgICBdXG4gICAgICAgIGVuZDogJ14oXFxcXDEpJCdcbiAgICAgICxcbiAgICAgICAgY29tbWVudDogJ2xpdGVyYWwgYmxvY2snXG4gICAgICAgIG5hbWU6ICdtYXJrdXAucmF3LmFzY2lpZG9jJ1xuICAgICAgICBiZWdpbjogJ14oXFxcXC57NH0pXFxcXHMqJCdcbiAgICAgICAgcGF0dGVybnM6IFtcbiAgICAgICAgICBpbmNsdWRlOiAnI2Jsb2NrLWNhbGxvdXQnXG4gICAgICAgICxcbiAgICAgICAgICBpbmNsdWRlOiAnI2luY2x1ZGUtZGlyZWN0aXZlJ1xuICAgICAgICBdXG4gICAgICAgIGVuZDogJ14oXFxcXDEpJCdcbiAgICAgIF1cbiAgICAgIGVuZDogJygoPzw9LS18XFxcXC5cXFxcLlxcXFwuXFxcXC4pJHxeXFxcXHB7Qmxhbmt9KiQpJ1xuXG4gICAgIyBhZGQgbGlzdGluZyBibG9ja1xuICAgIGNvZGVCbG9ja3MucHVzaFxuICAgICAgbmFtZTogJ21hcmt1cC5yYXcuYXNjaWlkb2MnXG4gICAgICBiZWdpbjogJ14oLXs0LH0pXFxcXHMqJCdcbiAgICAgIGJlZ2luQ2FwdHVyZXM6XG4gICAgICAgIDA6IG5hbWU6ICdzdXBwb3J0LmFzY2lpZG9jJ1xuICAgICAgcGF0dGVybnM6IFtcbiAgICAgICAgaW5jbHVkZTogJyNibG9jay1jYWxsb3V0J1xuICAgICAgLFxuICAgICAgICBpbmNsdWRlOiAnI2luY2x1ZGUtZGlyZWN0aXZlJ1xuICAgICAgXVxuICAgICAgZW5kOiAnXihcXFxcMSkkJ1xuICAgICAgZW5kQ2FwdHVyZXM6XG4gICAgICAgIDA6IG5hbWU6ICdzdXBwb3J0LmFzY2lpZG9jJ1xuXG4gICAgaWYgZGVidWcgdGhlbiBjb25zb2xlLmxvZyBDU09OLnN0cmluZ2lmeSBjb2RlQmxvY2tzXG4gICAgY29kZUJsb2Nrc1xuXG4gIG1ha2VNYXJrZG93bkJsb2NrczogKGxhbmd1YWdlcywgZGVidWcgPSBmYWxzZSkgLT5cbiAgICAjIGFkZCBsYW5ndWFnZXMgYmxvY2tzXG4gICAgY29kZUJsb2NrcyA9IGxhbmd1YWdlcy5tYXAgKGxhbmcpIC0+XG4gICAgICBuYW1lOiBcIm1hcmt1cC5jb2RlLiN7bGFuZy5jb2RlfS5hc2NpaWRvY1wiXG4gICAgICBiZWdpbjogXCJeXFxcXHMqKGB7Myx9KVxcXFxzKig/aTooI3tsYW5nLnBhdHRlcm59KSlcXFxccyokXCJcbiAgICAgIGJlZ2luQ2FwdHVyZXM6XG4gICAgICAgIDA6IG5hbWU6ICdzdXBwb3J0LmFzY2lpZG9jJ1xuICAgICAgY29udGVudE5hbWU6IFwiI3tsYW5nLnR5cGV9LmVtYmVkZGVkLiN7bGFuZy5jb2RlfVwiXG4gICAgICBwYXR0ZXJuczogW1xuICAgICAgICBpbmNsdWRlOiAnI2Jsb2NrLWNhbGxvdXQnXG4gICAgICAsXG4gICAgICAgIGluY2x1ZGU6IFwiI3tsYW5nLnR5cGV9LiN7bGFuZy5jb2RlfVwiXG4gICAgICBdXG4gICAgICBlbmQ6ICdeXFxcXHMqXFxcXDFcXFxccyokJ1xuICAgICAgZW5kQ2FwdHVyZXM6XG4gICAgICAgIDA6IG5hbWU6ICdzdXBwb3J0LmFzY2lpZG9jJ1xuXG4gICAgIyBhZGQgZ2VuZXJpYyBibG9ja1xuICAgIGNvZGVCbG9ja3MucHVzaFxuICAgICAgbmFtZTogJ21hcmt1cC5yYXcuYXNjaWlkb2MnXG4gICAgICBiZWdpbjogJ15cXFxccyooYHszLH0pLiokJ1xuICAgICAgYmVnaW5DYXB0dXJlczpcbiAgICAgICAgMDogbmFtZTogJ3N1cHBvcnQuYXNjaWlkb2MnXG4gICAgICBwYXR0ZXJuczogW1xuICAgICAgICBpbmNsdWRlOiAnI2Jsb2NrLWNhbGxvdXQnXG4gICAgICBdXG4gICAgICBlbmQ6ICdeXFxcXHMqXFxcXDFcXFxccyokJ1xuICAgICAgZW5kQ2FwdHVyZXM6XG4gICAgICAgIDA6IG5hbWU6ICdzdXBwb3J0LmFzY2lpZG9jJ1xuXG4gICAgaWYgZGVidWcgdGhlbiBjb25zb2xlLmxvZyBDU09OLnN0cmluZ2lmeSBjb2RlQmxvY2tzXG4gICAgY29kZUJsb2Nrc1xuIl19
